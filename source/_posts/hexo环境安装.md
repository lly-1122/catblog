---
title: "hexo环境安装"
date: 2026-09-18 15:10:16
description: "安装 清理旧环境： 制定node.js安装版本： 安装hexo-cli： 初始化项目： 创建一个空目录使用hexo init初始化目录"
categories:
  - 随记
tags:
  - 美化
  - web
---

安装

清理旧环境：

```bash
sudo yum remove nodejs npm -y
```

制定node.js安装版本：

```bash
# 导入 Node.js 18.x (LTS) 仓库
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -

# 安装 Node.js
sudo yum install -y nodejs

# 验证版本是否符合你的要求
node -v  # 应输出 v18.x.x
npm -v   # 应输出 8.x.x 或 9.x.x (符合你 6.14.13~latest 的要求)
```

安装hexo-cli：

```bash
# 建议先设置国内镜像源，防止下载超时
npm config set registry https://registry.npmmirror.com

# 全局安装 hexo-cli
sudo npm install -g hexo-cli

# 验证
hexo -v
```

初始化项目：

```bash
# 1. 初始化（此时会下载 Hexo 6.3.0 或最新的核心文件）
hexo init my_blog
cd my_blog

# 2. 安装项目依赖
npm install

# 3. 验证 Hexo 核心版本
npx hexo -v
```

创建一个空目录使用hexo init初始化目录

```
hexo clean：清理缓存（每次改动配置后建议执行）。
hexo g：生成静态页面（将 Markdown 转为 HTML）。
hexo s：启动本地服务器预览（默认 http://localhost:4000）。
hexo n "我的第一篇文章"：新建文章。
```