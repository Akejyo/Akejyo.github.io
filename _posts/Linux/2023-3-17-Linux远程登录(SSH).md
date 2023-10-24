---
title: "Linux远程登录(SSH)"
date: 2023-3-17
categories: [Study, Linux]
tags: [Linux]
---

Xshell

# Linux远程登录(SSH)

1. 下载OpenSSH server

   ~~~
   sudo apt update
   sudo apt upgrade
   sudo apt install openssh-server
   ~~~

2. 查看一下ssh有无启动，一般来说已经开了

   ~~~
   sudo systemctl status ssh
   ~~~

<img src="https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/linux_i%20(22).png" alt="linux_i (22)" style="zoom:33%;" />

3. 防火墙允许一下

   ~~~
   sudo ufw allow ssh
   ~~~

4. `ifconfig` 查一下ip
5. 打开Xshell，ssh 用户名@ip 远程连接

![linux_i (23)](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/linux_i%20(23).png)

***

参考教程：

 [Linux (Ubuntu) 如何开启SSH远程登录_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1rz4y1R7DA/?spm_id_from=333.1007.top_right_bar_window_history.content.click) 

