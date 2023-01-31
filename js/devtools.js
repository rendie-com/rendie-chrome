var fun=
{
	obj:{url:"",content:""},
	T:[],
	a01:function()
	{
		var This=this
		chrome.runtime.onMessage.addListener(function (request, sender, next)
		{
			if(request.cmd=="devtools")
			{
				request.next=next;
				switch(request.action)
				{
					case "setNetwork":This.setNetwork(request);;break;
					case "getNetwork":This.getNetwork(request);break;
					default:alert("err:"+request.action);
				}
			}
			return true;
		});
		this.a02()
	},
	a02:function()
	{
		// 创建自定义面板，同一个插件可以创建多个自定义面板
		// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
		chrome.devtools.panels.create('MyPanel', 'img/icon16.png', 'mypanel.html', function(panel)
		{
			console.log('自定义面板创建成功！'); // 注意这个log看不到
		});		
		// 创建自定义侧边栏
		chrome.devtools.panels.elements.createSidebarPane("Images", function(sidebar)
		{
			// sidebar.setPage('../sidebar.html'); // 指定加载某个页面
			sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); // 通过表达式来指定
			//sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
		});
		this.a03()
	},
	a03:function()
	{
		var This=this;
		chrome.devtools.network.onRequestFinished.addListener(function(e){This.a04(e,This);});		
	},
	a04:function(e,This)
	{
		//rq 包含请求响应数据，如：url,响应内容等
		//rq.request.url 接口 的url
		//rq.getContent 接口返回的内容
		if(This.obj.url)
		{
			if(e.request.url.indexOf(This.obj.url)!=-1)//如果能找到，就获取内容
			 {
				 e.getContent(function(content,encoding)
				 {
					 This.obj.content=content;
				 })
			 }
		}
	},
	setNetwork:function(request)
	{
		this.obj.url=request.url;	
		this.obj.content="";
		request.next()
	},
	getNetwork:function(request)
	{
		this.Time(this.getNetwork02,100,this,"1",request);//延时
	},
	getNetwork02:function(request)
	{
		var content=this.obj.content
		if(content!="")
		{
			this.obj.url="";
			this.obj.content="";
			request.next(content)
		}
		else
		{this.Time(this.getNetwork02,100,this,"1",request);}
	},
	Time:function(A,B,C,D,E)//延时执行
	{
		var This=this;
		if(This.T[D])
		{
			window.clearTimeout(This.T[D]);
			delete This.T[D];
		};
		This.T[D]=window.setTimeout(function()
		{
			if(E){A.apply(C,[E]);}else{A.apply(C);}
		},B);
	}
}
fun.a01();