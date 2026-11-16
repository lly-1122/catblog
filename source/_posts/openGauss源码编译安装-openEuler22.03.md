---
title: openEuler 22.03 源码编译 openGauss 全流程
date: 2026-11-09 10:00:00
tags:
  - openGauss
  - openEuler
  - 信创
  - 数据库
categories:
  - 数据库
  - opengauss
description: 按 openGauss 开源实习前置测试任务（Issue #98）从源码编译 openGauss 的完整记录，补上官方指南省略的 make / make install，以及 $GAUSSLOG 告警、首次连接必须设置角色密码这两个实际会踩的坑。
---

## 结论先行

按 openGauss 官方「开源实习前置测试任务指南（Issue #98）」走，**有三处需要自己补**：

1. **官方指南漏了 `make` 和 `make install`**。cmake 只生成构建文件，不产出可执行程序，直接跳到「初始化数据库」必然报找不到文件。
2. **首次连接后不能直接执行 SQL**，会报 `ERROR: Please use "ALTER ROLE ... PASSWORD ..."`。必须先给角色设一次密码。
3. **`$GAUSSLOG` 告警刷屏**，不影响功能，但交作业截图时一屏黄字很难看，提前设好环境变量即可。

下面是从零到 `openGauss=#` 的完整过程。

<!-- more -->

## 环境

| 项目 | 取值 |
|---|---|
| 操作系统 | openEuler 22.03 LTS-SP4，x86_64，内核 5.10.0-339 |
| 登录用户 | `liuluoyuan`（家目录 `/home/liuluoyuan`） |
| 三方库目录 | `~/binarylibs`（openEuler_2203_x86_64 包） |
| 安装目录 | `~/mppdb_temp_install`（即 `GAUSSHOME`） |
| 数据目录 | `~/data` |
| 端口 | 5432 |

> 实测内存 4 GB + 4 GB swap 也能编完，但必须控制并行度（见第 7 步）。

## 1. 安装编译依赖

```bash
sudo yum update -y
sudo yum groupinstall "Development Tools" -y
sudo yum install -y libedit-devel libxml2-devel lz4-devel numactl-devel unixODBC-devel \
  java-1.8.0-openjdk-devel make binutils libaio-devel flex bison ncurses-devel \
  glibc-devel patch readline-devel openblas-devel which python3 dkms cmake gcc gcc++
```

如果提示 `dkms` / `openblas-devel` 找不到，先启用 EPOL 源：

```bash
sudo yum install -y epol-release
sudo yum makecache
```

## 2. 下载第三方库（binarylibs）

三方库版本必须与操作系统 / 架构严格匹配。openEuler 22.03 x86_64 用这个包：

```bash
mkdir -p ~/download ~/binarylibs
wget https://opengauss.obs.cn-south-1.myhuaweicloud.com/latest/binarylibs/gcc10.3/openGauss-third_party_binarylibs_openEuler_2203_x86_64.tar.gz -P ~/download
tar -zxvf ~/download/openGauss-third_party_binarylibs_openEuler_2203_x86_64.tar.gz -C ~/binarylibs --strip-components=1
ls ~/binarylibs
```

`ls` 能看到 `kernel`、`buildtools` 等目录，说明解压正确。

## 3. 获取源码

```bash
cd ~
git clone https://gitcode.com/opengauss/openGauss-server.git
cd openGauss-server
```

> 注意：不指定分支时 clone 的是 master，编出来的版本号会是 `8.0.0-RC1` 这类开发版。要 7.0.0-LTS 需先 `git checkout` 对应 tag，再走同样流程。

## 4. 编写环境变量脚本 `env_cmake`

在源码根目录新建 `env_cmake`：

```bash
cd ~/openGauss-server
vim env_cmake
```

内容：

```bash
## 版本与平台
export DEBUG_TYPE=debug
export BUILD_TUPLE=x86_64
export GCC_VERSION=10.3.1

## 三方库
export THIRD_BIN_PATH=$HOME/binarylibs
export JAVA_HOME=$THIRD_BIN_PATH/kernel/platform/openjdk8/${BUILD_TUPLE}/jdk/
export PATH=${JAVA_HOME}/bin:$PATH
export APPEND_FLAGS="-g3 -w -fPIC"
export GCCFOLDER=$THIRD_BIN_PATH/buildtools/gcc10.3
export CC=$GCCFOLDER/gcc/bin/gcc
export CXX=$GCCFOLDER/gcc/bin/g++

export LD_LIBRARY_PATH=$GCCFOLDER/gcc/lib64:$GCCFOLDER/isl/lib:$GCCFOLDER/mpc/lib/:$GCCFOLDER/mpfr/lib/:$GCCFOLDER/gmp/lib/:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$THIRD_BIN_PATH/kernel/dependency/kerberos/comm/lib:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$THIRD_BIN_PATH/kernel/dependency/libcgroup/comm/lib:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$THIRD_BIN_PATH/kernel/dependency/openssl/comm/lib:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$THIRD_BIN_PATH/kernel/dependency/libcurl/comm/lib:$LD_LIBRARY_PATH
export PATH=$GCCFOLDER/gcc/bin:$PATH

## 安装目录
export PREFIX_HOME=$HOME/mppdb_temp_install
export GAUSSHOME=$PREFIX_HOME
export GAUSSLOG=$HOME/log
export LD_LIBRARY_PATH=$GAUSSHOME/lib:$LD_LIBRARY_PATH
export PATH=$GAUSSHOME/bin:$PATH
```

加载并验证：

```bash
source env_cmake
echo $THIRD_BIN_PATH   # /home/liuluoyuan/binarylibs
echo $GAUSSHOME        # /home/liuluoyuan/mppdb_temp_install
which gcc              # 必须指向 binarylibs 内的 gcc，不是 /usr/bin/gcc
```

> **只要新开终端，就要重新 `source env_cmake`**，否则 gsql / gaussdb 会报 `libssl.so.3: cannot open shared object file`。

**坑 3 就在这里顺手解决**：`export GAUSSLOG=$HOME/log`（并 `mkdir -p ~/log`）。不设这个变量，启动和连接时每行都会打一条 `WARNING: Failed to obtain environment value $GAUSSLOG!`。

## 5. cmake 配置

```bash
cd ~/openGauss-server
mkdir -p cmake_build && cd cmake_build
cmake .. -DENABLE_MULTIPLE_NODES=OFF -DENABLE_THREAD_SAFETY=ON \
  -DENABLE_READLINE=ON -DENABLE_MOT=ON \
  -DENABLE_OPENEULER_MAJOR=ON -DENABLE_OPENSSL3=ON
```

看到 `Build files have been written to ...` 即成功。openEuler 22.03 **必须**带 `-DENABLE_OPENEULER_MAJOR=ON`。

## 6 & 7. make（官方指南省略的一步）与 make install

仍在 `cmake_build` 目录：

```bash
make -j4 2>&1 | tee make.log
make install 2>&1 | tee install.log
```

- 内存 8 GB 用 `-j4`；4 GB 内存建议 `-j2`，否则容易 `Killed`（OOM）。
- 耗时大约 30 分钟到 2 小时，**用 `tmux` 或 `nohup` 跑**，别让 SSH 断掉。
- 验证：

```bash
ls $GAUSSHOME/bin | grep -E "gaussdb|gs_initdb|gsql"
```

三个都在，说明编译 + 安装成功。

## 8. 初始化数据库

```bash
$GAUSSHOME/bin/gs_initdb -D /home/liuluoyuan/data --nodename=dn_6001
```

> `gs_initdb` 和 `gaussdb` **不能用 root 跑**，必须切到普通用户；数据目录也要属于该用户。

## 9. 启动数据库

手册里常用的写法是直接拉 gaussdb：

```bash
$GAUSSHOME/bin/gaussdb -D /home/liuluoyuan/data --single_node &
```

实际生产味更足、也更方便管理的是用 `gs_ctl`：

```bash
gs_ctl start -D ~/data
gs_ctl status -D ~/data     # gs_ctl: server is running (PID: xxxxx)
```

> 手工 `make install` 出来的这套**没有 `gs_om`**（那是 OM 工具链安装的产物），所以别照着别的教程敲 `gs_om -t status`，会提示 `command not found`。用 `gs_ctl status` 就够。

## 10. 连接——这里最容易翻车

```bash
gsql -d postgres -p 5432 -r
```

看到 `openGauss=#` 提示符，**先别急着截图**。此时执行任何 SQL 都会报：

```
ERROR:  Please use "ALTER ROLE "liuluoyuan" PASSWORD 'password';" 
        to set the password of the user before other operations!
```

这是 openGauss 的安全机制：初始角色没有密码，第一次必须先设置。执行：

```bash
gsql -d postgres -p 5432 -r -c "ALTER ROLE liuluoyuan IDENTIFIED BY '你的密码';"
```

之后再验证，能出结果行才算真的可用：

```bash
gsql -d postgres -p 5432 -r -c "select version();"
gsql -d postgres -p 5432 -r -c "select current_database() as db, current_user as usr, now();"
```

```
                                    version
-----------------------------------------------------------------------------
 (openGauss 8.0.0-RC1 build 15b25281) compiled at 2026-10-31 19:48:04 ...
(1 row)

    db    |    usr     |              now
----------+------------+-------------------------------
 postgres | liuluoyuan | 2026-11-09 09:00:27.665851+08
(1 row)
```

**截图建议一次拍全**：系统版本（`cat /etc/openEuler-release`）、`GAUSSHOME`、`gs_ctl status`、`gsql --version`、`select version()` 的实际输出、监听端口（`ss -lntp | grep 5432`）。只截一个 `openGauss=#` 提示符，等于没证明任何东西。

## 常见问题

**Q1：`make` 报 `Killed`**
内存被 OOM 杀掉。降到 `make -j2`，或加 swap：

```bash
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
free -h
```

**Q2：`gsql: error while loading shared libraries: libssl.so.3`**
没 `source env_cmake`，`LD_LIBRARY_PATH` 里缺 `$GAUSSHOME/lib`。

**Q3：`gs_om: command not found`**
手工 `make install` 的安装没有 OM 工具，用 `gs_ctl status -D ~/data` 代替。

**Q4：`cmake` 找不到三方库 / gcc 版本不对**
确认已 `source env_cmake`；确认 `THIRD_BIN_PATH` 指向与系统匹配的 binarylibs；`which gcc` 必须指向 binarylibs 里的 gcc。

**Q5：编出来是 8.0.0-RC1，不是 7.0.0-LTS**
master 分支的版本号就是开发版。要 LTS 需 `git checkout` 对应 tag 后重新编译。

## 小结

这套流程真正花时间的不是敲命令，而是**官方指南省略的那两步（make / make install）和两个默认不说、但一跑就撞上的坑（`$GAUSSLOG` 告警、首次连接必须先设密码）**。把这几处补上，从零到可连接大约 1～2 小时（含编译）。

> 本次成果已提交至 openGauss 社区开源实习仓库（PR #70），环境为 openEuler 22.03 LTS-SP4 + openGauss 8.0.0-RC1（源码编译）。
