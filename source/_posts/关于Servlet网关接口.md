---
title: "关于Servlet网关接口"
date: 2026-09-18 15:09:49
description: "Servlet是什么？ 相关文章：什么是通用网关接口 (CGI)？ (linux-console.net) Servlet（Server + Applet）是java平台上用于处理Web 请求 和 响应 的 核心组件 ，运行在支持java的web服务器（如Apache Tomcat、Jetty）中。"
categories:
  - 网络安全
tags:
  - 漏洞复刻
  - 知识补充
---

### Servlet是什么？

相关文章：[什么是通用网关接口 (CGI)？ (linux-console.net)](https://cn.linux-console.net/?p=7495)

Servlet（Server + Applet）是java平台上用于处理Web**请求**和**响应**的**核心组件**，运行在支持java的web服务器（如Apache Tomcat、Jetty）中。他是Java EE（现Jakarta EE）规范的一部分，主要用于**动态生成网页**内容、处理表单**数据**、**管理会话**等。

1. Servlet的核心作用

- 接收HTTP请求（GET、POST、PUT、DELETE等）

- 处理业务逻辑（如数据库查询、用户验证）

- 生成HTTP响应（HTML、JSON、文件等）

1. Servlet的工作原理

生命周期：

1. ​**初始化**​：Web 服务器启动时，Servlet 容器（如 Tomcat）加载并调用 init() 方法。

1. ​**处理请求**​：每次用户访问时，调用 service() 方法（通常由 doGet() 或 doPost() 实现）。

1. ​**销毁**​：服务器关闭时，调用 destroy() 方法释放资源。

1.  Servlet与Web服务器的关系

- Servlet容器（如Tomcat）：负责管理Servlet的生命周期、处理HTTP请求/响应。

- Servlet本身：只关注业务逻辑，不关系底层网络通信（如容器处理）。

1. Servlet的常见用途

1. 动态网页（如JSP背后就是Servlet）

1. REST API（返回JSON/XML数据）

1. 文件**上传/下载**（如漏洞中的**PUT**请求处理）

1. **会话管理**（如HttpSession实现**登录状态**）

1. 为什么Tomcat的默认Servlet会涉及安全问题？

- 默认Servlet：Tomcat内置的一个Servlet，负责**处理静态文件**（HTML、JS）和部分**HTTP方法**（如PUT）。

- 漏洞场景：如果管理员错误地启用了PUT方法，攻击者可能会上传恶意文件（如JSP木马），导致RCE（远程代码执行）。

总的来说，Servlet就相当于一个处理器，他负责处理Web请求。而Tomcat则是一个运行环境，管理Servlet的生命周期和网络通信。

基本信息：

漏洞名称：部分 PUT 的潜在 RCE 和/或信息泄露和/或信息损坏。