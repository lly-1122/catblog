---
title: "steghide 一款专注于图片隐写的工具"
date: 2026-09-18 15:07:29
description: "steghide是一款强大的因隐写工具，可用于在不损坏图片或音频文件结构的情况下隐藏或提取数据。 使用embed命令将秘密潜入载体文件： 提取隐藏数据 查询载体信息 如果不知道文件密码可以利用stegcracker爆破"
categories:
  - 网络安全
tags:
  - 渗透测试
  - 工具
  - mazesec
  - 工具技巧
---

steghide是一款强大的因隐写工具，可用于在不损坏图片或音频文件结构的情况下隐藏或提取数据。

使用embed命令将秘密潜入载体文件：

```bash
steghide embed -cf 载体文件.jpg -ef 隐藏文件.txt -p 密码
```

提取隐藏数据

```bash
steghide extract -sf 载体文件.jpg -p 密码
```

查询载体信息

```bash
steghide info 载体文件.jpg
```

如果不知道文件密码可以利用stegcracker爆破

```bash
stegcracker cat.jpg /usr/share/wordlists/rockyou.txt
```