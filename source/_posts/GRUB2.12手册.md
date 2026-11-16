---
title: "主题文件格式"
date: 2026-09-18 15:10:19
description: "主题文件格式 介绍 GRUB图形菜单支持可以自定义的布局和GRUB引导菜单的外观。主题是通过plain配置指定各种GUI组建（包括启动菜单、超时进度条和短信）以及使用颜色、字体和图像的外观。实例可在docs/example theme."
categories:
  - 随记
tags:
  - 美化
---

# 主题文件格式

## 介绍

GRUB图形菜单支持可以自定义的布局和GRUB引导菜单的外观。主题是通过plain配置指定各种GUI组建（包括启动菜单、超时进度条和短信）以及使用颜色、字体和图像的外观。实例可在docs/example_theme.txt中找到

## 主题元素

### 颜色

可以通过很多种方式指定颜色：

- HTML样式的"RRGGBB”或"#RGB"格式，其中*R*、*G*和*B*是十六进制的数字（例如，"#8899FF"）

- 作为逗号分隔的是禁止RGB值（例如，”128，128，255“）

- 替换为”SVG 1.0 color names"（例如，“cornflowerblue”），必须以小写形式指定。

### 字体

字体GRUB使用“PFF2 font format”位图字体。指字体 替换为完整的字体名称。目前没有提供字体的首选项立标，或从一种字体派生另一种字体。使用GRUB中的loadfont命令（loadfont）加载字体。查看加载字体执行lsfints。如果字体太多，无法适合屏幕，在执行lsfonts之前执行set pger=1.

### 进度条

进度条用于显示GRUB引导default菜单选项。创建将显示剩余时间，只需要创建一个“progress_bar"组建，其中包含ID"_timeout_"。这向GRUB表明进度条应该会随着时间流逝而更新，如果 启动被用户终端。

进度条可以选择在其上显示文本。此文本是 由变量”text“控制，改变两包含了一个printf模板，其中只有参数%d是剩余的秒数。其他特别 值