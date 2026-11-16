---
title: "关于hydra使用技巧"
date: 2026-09-18 15:07:29
description: "- -l catcatcat: 指定用户名为 catcatcat。 - -P /usr/share/wordlists/rockyou.txt: 指定密码字典文件。 - -vV: 开启详细模式，显示爆破过程。 - -t 4: 设置并发线程数为 4。 - -e ns: 尝试空密码（n）和用户名密码相同（s）的组合。"
categories:
  - 网络安全
tags:
  - 渗透测试
  - 工具
  - mazesec
  - 工具技巧
---

```bash
hydra -l catcatcat -P /usr/share/wordlists/rockyou.txt -vV -t 4 -e ns ssh://192.168.5.13
```

- -l catcatcat: 指定用户名为 catcatcat。

- -P /usr/share/wordlists/rockyou.txt: 指定密码字典文件。

- -vV: 开启详细模式，显示爆破过程。

- -t 4: 设置并发线程数为 4。

- -e ns: 尝试空密码（n）和用户名密码相同（s）的组合。