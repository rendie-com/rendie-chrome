# rendie-chrome
说明：
这是针对 rendie.com 网站的功能增强开发的谷歌插件。

为什么要装这个插件？
因为它能模拟【键盘】【鼠标】操作，实现自动化办公（仅限chrome软件内操作）。

![](https://raw.githubusercontent.com/rendie-com/rendie-chrome/main/img/Screenshot.jpg)

增强功能有：

highlightTab（高亮tab）

isRD（初始化）

getHtml（get提交，获取源码）

postHtml（post提交，获取源码）

postJson（返回值必须是Json,否则出错。【注：有的网站还必须要你Json提交，否则它给你报错】）

typeJson（自定义类型提交json返回）

notifications（桌面通知）

tabs_remove_create_indexOf（删除后创建再查找【返回网页内容】）

tabs_executeScript_indexOf（执行js代码后再找内容【返回网页内容】）

cookiesGetAll（获取所有cookies）

cookiesGet（获取cookies）

cookiesSet(设置cookies)

cookiesRemove（删除cookies）

tabs_executeScript（执行js代码【无返回值，主要是为了与监听结合用】）

getNetwork（返回监听url的内容。【浏览器必须打开调试模式。即F12】）

setNetwork（监听url(包含)。【浏览器必须打开调试模式。即F12】）

uploadFile（上传文件。【注：（二进制）表示会把文件转成二进制后，再上传】）
