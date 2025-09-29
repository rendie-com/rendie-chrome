'use strict';
let fun = {
    a01: function () {
        var This = this;
        window.addEventListener("message", function (e)//接收消息
        {
            //console.log('【rendie.com/js/content-script.js】收到消息：', e.data);
            if (e.data.cmd == 'content-script-rendie-com') {
                chrome.runtime.sendMessage(e.data, function (r) {
                    This.Return(r);
                });
            }
        }, false);
        this.loadJs()
    },
    ////////////////////////////////////////////////////////
    Return: function (t) {        
        let data = {
            return: t,
            cmd: "return-rendie-com"
        }
        window.postMessage(data, '*')
    },
    loadJs: function ()//加载JS文件
    {
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.src = chrome.runtime.getURL("inject/index.js");
        document.head.appendChild(temp);
    },
}.a01();