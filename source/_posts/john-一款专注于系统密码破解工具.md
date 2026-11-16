---
title: "john 一款专注于系统密码破解工具"
date: 2026-09-18 15:07:31
description: "文章参考：密码破解-john的使用 - Junglezt - 博客园 john会自动识别需要破解的hash，但是很多时候会识别错误，这个不用担心，我们使用专门识别hash类型的工具hash-identifier。"
categories:
  - 网络安全
tags:
  - 渗透测试
  - 工具
  - mazesec
  - 工具技巧
---

文章参考：[密码破解-john的使用 - Junglezt - 博客园](https://www.cnblogs.com/Junglezt/p/16048189.html)

john会自动识别需要破解的hash，但是很多时候会识别错误，这个不用担心，我们使用专门识别hash类型的工具hash-identifier。

在对hash值的类型进行识别后，我们需要在john找到是否支持破解该类型hash

john --list=formats可以列出所有支持破解的hash类型，我们可以配合grep进行筛选john --list=formats | grep 

找到john可以破解类型hash的名称，我们可以直接使用john进行密码的破解，下面是john在使用的时候的语法格式

```bash
john --format=[format] --wordlist=[path to wordlist] [path to file]
```

重要参数

--wordlist=字典，--format=解密类型

破解一个acf的sha256加密的密码

```bash
└─$ johnjohn --format=sha256crypt --wordlist=/usr/share/wordlists/rockyou.txt 1
Using default input encoding: UTF-8
Loaded 1 password hash (sha256crypt, crypt(3) $5$ [SHA256 512/512 AVX512BW 16x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
juggernaut       (root)
1g 0:00:00:05 DONE (2026-06-24 00:22) 0.1821g/s 11937p/s 11937c/s 11937C/s sactown..ryanscott
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```