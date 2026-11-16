---
title: "详解cookie"
date: 2026-09-18 15:09:48
description: "参考文案：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Cookies Cookie的作用 HTTP Cookie（翻译过来叫做曲奇）是服务器发送给客户端的一种身份确认手段，她保存在客户端浏览器中本地的一小块数据。浏览器会存储cookie并在下次像同一个服务器发起请求，并 携带 这个cookie。"
categories:
  - 网络安全
tags:
  - 漏洞复刻
  - 知识补充
---

参考文案：[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Cookies)

## Cookie的作用

HTTP Cookie（翻译过来叫做曲奇）是服务器发送给客户端的一种身份确认手段，她保存在客户端浏览器中本地的一小块数据。浏览器会存储cookie并在下次像同一个服务器发起请求，并**携带**这个cookie。通常，她用于告知服务器**两个请求**来自**同一个用户**——如保持用户的登录状态。

主要用于以下三个方面：

会话状态：如**登录状态**、**购物车**、**游戏分数**

个性化：如用户自定义设置、主题等等

浏览器跟踪：**跟踪**用户行为

Cookie曾一度用于客户端数据的存储，因当时并没有**其他适合**的存储办法而作为唯一的存储手段，但现在推荐使用**现代存储API**。由于服务器指定Cookie后，浏览器的每次请求都会携带Cookie数据，会带来额外的**性能开销**（尤其是在移动的环境下）。新的浏览器API已经允许开发者直接将数据存储到本地，如使用Web Storage API（localStorage和sessionStorage）或IndexedDB。

> 备注：如果想要查看Cookie存储，你可以在开发者工具中启用存储查看器（Storage Inspector）功能，并在存储书上选中Cookie。


edge浏览器：F12——应用程序——本地存储/Cookie

## 创建Cookie

服务器收到HTTP请求后，服务器可以在响应头里添加一个或者多个Set-Cookie选项。浏览器收到响应后通常会保存下Cookie，并将其放在HTTP Cookie标头内，向同一服务器发出请求时一起发送。你可以指定一个过期日期或者时间段之后，不能发送cookie。你也可以对指定的域和路径设置额外的限制，以限制cookie发送的位置。关于下面提到的头部属性的详细信息，请参考Set-Cookie文章。

## Set-Cookie和Cookie标头

服务器使用**Set-Cookie**响应头向用户代理（一般为浏览器）发送**Cookie信息**。一个简单的**Cookie**可能像这样：

```http
Set-Cookie: <cookie-name>=<cookie-value>
```

这指示服务器发送标头告知**客户端**存储一对**cookie**：

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[页面内容]
```

<!-- more -->


之后，对该服务器发起的每次新请求，都会携带服务器发给我们的Set-Cookie也就是通过信息头Cookie发送给服务器，让服务器识别到我们

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

> 备注提问：如何在以下几种服务器访问中设置Set-Cookie响应头信息：
> PHP
> Node.JS
> Python
> Ruby on Rails


### 关于Cookie的生命周期控制

后期参考：[HTTP Cookie - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Cookies)

总结：现在总的来说我对于cookie只是一个稍微的了解，也就是说我在思考cookie是如何被利用来攻击的，所以这后面的控制生命周期这一块，可能会等到我用到的时候才会来做笔记。