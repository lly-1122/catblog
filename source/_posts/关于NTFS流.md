---
title: "关于NTFS流"
date: 2026-09-18 15:09:53
description: "原文：[[MS-FSCC]: NTFS Streams Microsoft Learn](https://learn.microsoft.com/zh-cn/openspecs/windows protocols/ms-fscc/c54dec26-1551-4d3a-a0ea-4fa40f848eb3?redirectedfrom=MSDN) 什么是NTFS数据流？ NTFS文件系统中，"
categories:
  - 网络安全
tags:
  - 漏洞复刻
  - nmap
  - 关于Tomcat
---

原文：[[MS-FSCC]: NTFS Streams | Microsoft Learn](https://learn.microsoft.com/zh-cn/openspecs/windows_protocols/ms-fscc/c54dec26-1551-4d3a-a0ea-4fa40f848eb3?redirectedfrom=MSDN)

什么是NTFS数据流？

NTFS文件系统中，一个文件可以包含多个独立的数据块，每个数据块称为一个“流”（Stream）。

- 类比：

好比把文件想象成一个“盒子”，盒子可以有多个“隔间”（流），每个隔间存在不同的东西。

	- 住隔间（默认流）：放文件的实际内容（如文本、图片数据）。

	- 隐藏隔间（命名流）：放额外的数据（如元数据、隐藏信息）。

核心概念

1. 流名称（Stream Name）

- 作用：区分同**一个文件**中的**不同数据块**。

- 规则：

	- 默认流**没有名称**（如file.txt::$DATA中的:后为空）

	- 命名流需要**自定义名称**（如file.txt:secret:$DATA中的secret）。

1. 流类型（Stream Type）

- 作用：声明流的**用途**或**数据结构**。

- 常见类型：

| 流类型 | 用途 | 示例 | 
| -- | -- | -- |
| $DATA | 存储普通数据（默认） | file.txt::$DATA | 
| $INDEX_ALLOCATION | 存储目录索引（仅用于文件夹） | C:\Folder::$INDEX_ALLOCATION | 
| $ATTRIBUTE_LIST | 存储文件属性（如创建时间） | 系统自动管理，用户不可见 | 


- 关键点：

	- 普通文件的默认流类型是$DATA。

	- 文件夹的默认流类型是$INDEX_ALLOCATION（用于管理文件列表）。

1. 技术本质

文件系统的“多合一”设计

- 传统认知：一个文件 = 一份数据。

- NTFS现实：一个文件 = 多个数据块（流）+元数据。

流完整路径：

```bash
文件名:流名称:流类型
```

查看隐藏流

<!-- more -->


```bash
C:\Users\admin>dir /R
 驱动器 C 中的卷没有标签。
 卷的序列号是 A062-A530

 C:\Users\admin 的目录

2025/07/21  16:11    <DIR>          .
2025/06/05  22:29    <DIR>          ..
2025/07/14  23:06             1,898 .bash_history
2025/07/19  21:48    <DIR>          .docker
2025/05/05  00:11    <DIR>          .dotnet
2025/05/24  13:39                70 .finger.txt
2025/04/03  21:47    <DIR>          .goby
2025/03/29  15:10    <DIR>          .i18nupdatemod
2025/03/21  22:04    <DIR>          .PyCharm2018.3
2025/06/02  23:01    <DIR>          .pyenv
2025/04/30  19:21    <DIR>          .qmf
2025/07/18  19:51    <DIR>          .ssh
2025/04/03  21:33    <DIR>          .vscode
2025/03/29  15:55    <DIR>          .zenmap
2025/07/04  19:28            17,409 AMDRM_Install.log
2025/04/04  16:22         3,653,848 AMD_RyzenMaster.log
2025/03/17  00:43    <DIR>          Contacts
2025/04/20  12:54    <DIR>          curseforge
2025/07/20  20:26    <DIR>          Desktop
2025/07/14  21:14    <DIR>          Documents
2025/07/21  07:23    <DIR>          Downloads
2025/03/17  00:43    <DIR>          Favorites
2025/03/17  00:43    <DIR>          Links
2025/03/17  00:43    <DIR>          Music
2025/05/17  21:41    <DIR>          OneDrive
2025/07/07  19:57    <DIR>          Pictures
2025/03/29  13:59    <DIR>          PSAppDeployToolkit
2025/07/21  16:11                 0 sample.txt
                                  9 sample.txt:scret:$DATA
2025/05/18  00:26    <DIR>          Saved Games
2025/03/17  01:24    <DIR>          Searches
2025/07/06  16:48    <DIR>          socat-1.8.0.1
2025/07/20  19:27    <DIR>          Videos
               5 个文件      3,673,225 字节
```