---
title: "QQ机器人制作"
date: 2022-6-2
categories: [Recreation, Bot]
tags: [qq, bot]
---

简易QQ机器人制作

<!-- more -->

# QQ机器人制作

现实无法满足，只能靠电子老婆了（bushi

BV1aZ4y1f7e2是很好的教程，我自己摸索很久最后还是看了这个教程，简单有效

***

**前提**：你的电脑要有python环境，还要有个vscode用来写码. 虽然但是，只是做一个最简单的机器人（不自己写插件）的话，编程知识大概是不需要的. python最好是3.9的，3.10会寄. 

**Start**：

1. 先把go-cqhttp下载了： [Release v1.0.0-rc3 · Mrs4s/go-cqhttp (github.com)](https://github.com/Mrs4s/go-cqhttp/releases/tag/v1.0.0-rc3) 

   网页下面找下载（找自己的版本
   
   ![1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/1.png)

2. 打开里面的go-cqhttp.exe，之后会自动生成go-cqhttp.bat，运行.

   通讯方式选3:反向ws
   
   ![2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/2.png)

3. 之后会发现你有config.yml了，打开进行编辑

   你需要更改下面几项：

   * ```
     account: # 账号相关
       uin: 123456789 # QQ账号
       password: 'abcd1234' # 密码为空时使用扫码登录
     ```

   * ```
     # 反向WS设置
       - ws-reverse:
           # 反向WS Universal 地址
           # 注意 设置了此项地址后下面两项将会被忽略
           universal: ws://127.0.0.1:12345/onebot/v11/ws/
     ```

     注意ws里填的12345，这个端口号不建议使用8080（即本机，可能会与其他服务冲突），选一个随机数（10000往上）就行

     

4. 再次运行go-cqhttp.bat，按照指示登录你的机器人QQ.

   登录之后暂时可以关了

5. 在当前文件夹（cd 网上会有教的）打开命令指示符

   ```
   nb create
   ```

   如果报告说找不到'nb'就pip下载nonebot2（顺便把nonebot脚手架给下了，后面方便

   ```
   pip install nb-cil                         #这是脚手架
   pip install nonebot2                       #这是nonebot2
   ```

   这两行还是在刚才那个命令指示符里写，运行就下好了

   如果出现满屏红字报错，大概率是网络问题（因为python在外面），多试几次就行，当然你也可以上网查怎么解决这类问题（或者拉到本页面最后，有教。。。

   回到nb create:

   ```
   Project Name   #项目名字，比如叫它QQbot
   Where to store the plugin?  #插件存放的名称，选src就行
   Which builtin plugin(s) would you like to use?  #选echo，用来测试bot是否正常运行
   Which adapter(s) would you like to use?  #选OneBot V11
   ```

   此时就会建立一个QQbot（起的项目名称）文件夹

6. 打开QQbot文件夹，编辑.env，里面的dev改成prod，意味着以后读取环境变量将从.env.prod里读取

   打开.env.prod，里面改成这样

   ```
   HOST=127.0.0.1
   PORT=12345                      #刚刚在config.yml里的反向ws写的随机数
   SUPERUSER=["12345678"]          #nonebot超级用户，写你自己的号就行
   NICKNAME=["QQbot"]              #机器人的昵称
   COMMAND_START=["/"]             #命令起始字符
   ```

7. 打开bot.py，Ctrl+~打开Vscode的命令框，cd到当前文件夹，输入nb run启动bot

   同时我们打开刚刚打开过的go-cqhttp.bat

   机器人启动

8. 更机器人私聊/echo aaa，如果正常运行机器人会回复你aaa（插件echo的用处）

此时的机器人啥也不会，只会一个echo，我们需要给它加插件

**插件添加**：

1. 到Nonebot的插件商店里 [NoneBot](https://v2.nonebot.dev/store) ，选一个插件，点击右上角的图标进入github界面

   ![3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/3.png)

2. 首先，在命令行里直接输入pip install 插件名 是可以下载的，如果是这样的下载方式的话，需要到bot.py里稍做配置，添加插件：

   ```
   nonebot.load_builtin_plugins("echo")   #自带的echo插件
   nonebot.load_plugin('nonebot_plugin_picsearcher') #搜图插件
   ```

   **有些**(不是全部)插件会支持脚手架下载，即我们刚才pip下载的nb-cil

   nb plugin install 插件名

   这种下载方式的话，不需要更改配置，下完了就结束了

3. 给你的机器人加一堆花里胡哨的插件就能去玩了

***

**pip下载速度离谱解决**：

使用国内镜像下载

清华：https://pypi.tuna.tsinghua.edu.cn/simple

阿里云：http://mirrors.aliyun.com/pypi/simple/

中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/

华中理工大学：http://pypi.hustunique.com/

山东理工大学：http://pypi.sdutlinux.org/ 

豆瓣：http://pypi.douban.com/simple/


例：下载pyspider
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyspider

**github下载速度离谱解决**：

 [下载 (serctl.com)](https://d.serctl.com/) 

让这个网站帮你下~