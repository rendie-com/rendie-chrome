var fun=
{
	a01:function()
	{
		var This=this
		chrome.runtime.onMessage.addListener(function (request, sender, next)
		{
			if(request.cmd == 'content-script')//表是只接收【content-script】的信息。
			{
				if(request.action=="getWindowId"){chrome.tabs.getSelected(null,function(tab){next(tab.windowId);});}//获取当前窗体ID
				else if(request.windowId==0){alert("谷歌扩展中【windowId】未初始化。");}
				else
				{
					request.next=next;
					switch(request.action)
					{
						case "highlightTab":This.highlightTab(request);break;//高亮tab
						case "uploadFile":This.uploadFile.a01(request);break;
						case "getHtml":This.getHtml(request);break;
						case "postHtml":This.postHtml(request);break;//普通提交（返回的内容不一定是json格式）
						case "postJson":This.postJson(request);break;//json提交(返回的内容一定是json格式)
						case "typeJson":This.typeJson(request);break;//自定义类型提交(返回的内容一定是json格式)
						case "notifications":This.notifications(request);break;
						case "tabs_remove_create_indexOf":This.tabs_remove_create_indexOf01(request);break;
						case "tabs_executeScript_indexOf":This.tabs_executeScript_indexOf01(request);break;
						case "tabs_executeScript":This.tabs_executeScript01(request);break;//执行js代码(无返回值，主要是为了与监听结合用) 
						case "cookiesGetAll":This.cookiesGetAll(request);break;//获取所有cookie信息
						case "cookiesGet":This.cookiesGet(request);break;//获取cookie信息
						case "cookiesSet":This.cookiesSet(request);break;//设置cookie信息
						case "cookiesRemove":This.cookiesRemove(request);break;//删除cookie信息
						default:alert("在【background.js】找不到方法名："+request.action);
					}
				}
			}
			return true;//注：不写这个会出错，内容为【Unchecked runtime.lastError: The message port closed before a response was received.】
			/*
			case "tabs_create_update_indexOf":This.tabs_create_update_indexOf01(request);break;
  		else if(request.action === 'executeScript'){This.executeScript(request,next);return true;}
  		else if(request.action === 'statusComplete'){This.statusComplete(request,next);return true;} 
  		else if(request.action === 'proxy'){This.proxy(request,next);return true;}
  		else if(request.action === 'resetProxy'){This.resetProxy();return true;}
			*/
		});
		this.a02(This);
	},
  a02:function(This)
  {
		/*chrome.contextMenus.create({
			title: "这是右健菜单",
			onclick: function(){aler("右健菜单被点击了")}
		});*/
		/*chrome.tabs.onUpdated.addListener(function (id, info, tab)
		{
			this.tab=[id, info, tab]
			//console.log(JSON.stringify(info,null,2)+"-----"+id+"-----"+JSON.stringify(tab,null,2))
			if(info.status === 'complete'){This.status.push(id);}//有哪些窗口加载完成
		});*/
		/////////////////////////////////////////////////////////////////////////////////////////////
		//插件监听拦截-图片
/*		chrome.webRequest.onBeforeRequest.addListener(
		function(details)
		{
			// console.log(details);
			// 回调返回一个对象，如果对象里得cancel为true则会拦截不继续请求
			return {cancel: true};
		},
		//监听页面请求,你也可以通过*来匹配。urls地址，types请求资源类型
		{
			urls: 
			[
				'https://www.dhgate.com/*',
				'https://rendie.com/image.dhgate.com/*',
			], types: ["image"]
		},// 拦截tophatter图
		["blocking"]);*/
		/////////////////////////////////////////////////
	  this.a03()
	},
  a03:function()
  {
		/**
		* 监听代理服务错误
		* _details 		object 			关于错误的描述
		*/
		/*chrome.proxy.onProxyError.addListener(function(_details)
		{
			 console.log(["代理服务错误",_details]);
		});
		*/
		//监听web请求onResponseStarted
		/*
		chrome.webRequest.onResponseStarted.addListener(function(_result)
		{
			console.log('onResponseStarted');
			console.log(_result);
		},{urls: ["<all_urls>"]});
		*/
		//监听web请求onCompleted
		
		/*
		//chrome.webRequest.onCompleted可以获得网络请求返回的header,但无法获取返回的内容，经过多方研究发现可以用
		chrome.webRequest.onCompleted.addListener(function(_result)
		{
			console.log('onCompleted');
			console.log(_result);
		},{urls: ["<all_urls>"]});*/
			
		//监听web请求ErrorOccurred
		/*
		chrome.webRequest.onErrorOccurred.addListener(function(_result)
		{
			if(_result.erroe === 'net::ERR_PROXY_CONNECTION_FAILED')
			{
				console.log('代理错误');
			}
			else if( _result.erroe === 'net::ERR_NAME_NOT_RESOLVED')
			{
				console.log('网络未解析');
			}
			console.log('onErrorOccurred');
			console.log(_result);
		},{urls: ["<all_urls>"]});
		*/
	
	},
	uploadFile:
	{
		a01:function(request)
		{
			var arr=request.data,arr2=[]
			for(var i=0;i<arr.length;i++)
			{
				if(typeof(arr[i].value)=="string")
				{
					if(arr[i].value.indexOf("（二进制）")!=-1)
					{
						arr2.push(arr[i].value.split('（二进制）')[1])
					}
				}
			}
			request.fileArr=arr2;//图片数组
			request.file2Arr=[];//二进制数组
			this.a02(request)
		},
		a02:function(request)
		{
			if(request.fileArr.length==0)
			{
				//文件转二进制，可以上传了。
				this.a04(request)
			}
			else
			{
				Tool.getFileBlob(request.fileArr[0],this.a03,this,request)
			}
		},
		a03:function(t,request)
		{
			if(t.status==404)
			{request.next(t);}
			else
			{
				request.fileArr.shift();
				request.file2Arr.push(t);
				this.a02(request)			
			}
		},
		a04:function(request)
		{
			var arr=request.data,formData = new FormData()
			for(var i=0;i<arr.length;i++)
			{
				if(typeof(arr[i].value)=="string")
				{
					if(arr[i].value.indexOf("（二进制）")!=-1)
					{
						arr[i].value=request.file2Arr[0];
						request.file2Arr.shift();
					}
				}
				
				//////////////////////////////////////////
				if(arr[i].fileName)
				{formData.append(arr[i].name,arr[i].value,arr[i].fileName);}
				else
				{formData.append(arr[i].name,arr[i].value);}				
			}
			Tool.uploadFile(request.url,request.headers,formData,this.a05,this,request)
		},
		a05:function(t,request)
		{
			request.next(t)
		}
	},
  // 高亮tab
  highlightTab:function(request)
  {
		Tool.ifTabs(request,this.highlightTab02,this,Tool.notTab)
	},
  // 高亮tab
  highlightTab02:function(request)
  {
		chrome.tabs.highlight({tabs:request.index-1,windowId:request.windowId},function(t)
		{
			request.next(t);
		});
	},
  getHtml:function(request)
  {		
    $.ajax(
    {
      url: request.url,
      type: "GET",
      timeout: 60000,
      success:function(data){request.next(data);},
      complete:function(XMLHttpRequest,status)
      {
        if (status != 'success')
				{
					request.next({
						status:status,
						code:XMLHttpRequest.status,
						error:XMLHttpRequest.responseText
					});
				}
      }
    });
  },
  postHtml:function(request)
  {
    $.ajax({
      url: request.url,
      type: "POST",
      timeout: 300000,
      async: false,
      data: request.params,
      success:function (data){request.next(data);},
      complete:function (XMLHttpRequest,status)
      {
				if(status != 'success')
				{
					request.next({
						status:status,
						code:XMLHttpRequest.status,
						error:XMLHttpRequest.responseText
					});
				}
      }
    });
  },
  typeJson:function(request)
  {
		$.ajax({
			url:request.url,
			data:request.params,
			type:request.type,
      timeout: 300000,
			contentType:'application/json;charset=UTF-8',
			cache:false,
			dataType:"json",
			success:function(data){request.next(data);},
      complete:function (XMLHttpRequest,status)
      {
				if(status != 'success')
				{
					request.next({
						status:status,
						code:XMLHttpRequest.status,
						error:XMLHttpRequest.responseText
					});
				}
      }
		});
  },
  postJson:function(request)
  {
		$.ajax({
			url:request.url,
			data:request.params,
			type:"post",
      timeout: 300000,
			contentType:'application/json;charset=UTF-8',
			cache:false,
			dataType:"json",
			success:function(data){request.next(data);},
      complete:function (XMLHttpRequest,status)
      {
				if(status != 'success')
				{
					request.next({
						status:status,
						code:XMLHttpRequest.status,
						error:XMLHttpRequest.responseText
					});
				}
      }
		});
  },
  // 显示桌面通知
  notifications:function(request)
  {
		if(typeof(request.message)=="string")
		{
			chrome.notifications.create(null, {
				type: 'basic',
				iconUrl:request.iconUrl,
				title: request.title,
				message: request.message
			});
		}
		else
		{
			chrome.notifications.create(null,{
				type: 'list',
				iconUrl:request.iconUrl,
				title: request.title,
				message: "填了没用",
				items:request.message
			});
		}
		request.next("ok")		
  },
	//大于【index】，则删除。注：【index】从1开始。
  tabs_remove:function(index,next,This,request)//删除【index】选项卡，直到找不到【index】为止
  {
		var This=this;
		chrome.tabs.query({index:request.index-1,windowId:request.windowId},function(tabs)//我要的【选项卡】是否存在，如果存在，则删除。
		{
			if(tabs.length==0)
			{
				next.apply(This,[request]);
			}
			else
			{
				chrome.tabs.remove(tabs[0].id,function()
				{
					This.tabs_remove(index,next,This,request);
				});
			}
		});
  },
	//创建【index】选项卡，直到找到【index】为止。注：【index】从1开始。
  tabs_create:function(index,next,This,request)//创建【index】选项卡，直到找到【index】为止
  {
		var This=this;
		chrome.tabs.query({index:request.index-1,windowId:request.windowId},function(tabs)
		{
			if(tabs.length==0)//没有就继续创建
			{
				chrome.tabs.create({url:request.url,windowId:request.windowId},function(e)
				{
					request.id=e.id;//  chrome.tabs.executeScript  要用  
					This.tabs_create(index,next,This,request);
				});
			}
			else
			{
				next.apply(This,[request]);
			}
		});
  },
	//删除
  tabs_remove_create_indexOf01:function(request)
  {
		this.tabs_remove(request.index,this.tabs_remove_create_indexOf02,this,request)//删除【index】选项卡，直到找不到【index】为止
  },
	//创建
  tabs_remove_create_indexOf02:function(request)
  {
		this.tabs_create(request.index,this.tabs_remove_create_indexOf03,this,request)//创建【index】选项卡，直到找到【index】为止
  },
  tabs_remove_create_indexOf03:function(request)//是否高亮
  {
		var This=this;
		if(request.isHighlightTab==true)
		{
			chrome.tabs.highlight({tabs:0,windowId:request.windowId},function()//设置第一个【高亮tab】---这样执行速度快
			{
				Tool.Time(This.tabs_indexOf,100,This,"1",request);//延时
			});
		}
		else
		{Tool.Time(This.tabs_indexOf,100,This,"1",request);}
  },
  cookiesGetAll:function(request)//获取所有cookie信息
  {
		chrome.cookies.getAll({url:request.url},
			function (cookies)
			{
				//console.log("查到 " + cookies.length + " 条cookies");
				//console.log("查到的cookie信息：", cookies);
				request.next(JSON.stringify(cookies));
			}
		);
  },
  cookiesGet:function(request)//获取一个cookie信息
  {
		chrome.cookies.get({url:request.url,name:request.name},
			function (cookies)
			{
				request.next(JSON.stringify(cookies));
			}
		);
  },
  cookiesRemove:function(request)//删除一个cookie信息
  {
		chrome.cookies.remove({url:request.url,name:request.name},
			function (cookies)
			{
				request.next(JSON.stringify(cookies));
			}
		);
  },
  cookiesSet:function(request)//设置cookie信息
  {
		chrome.cookies.set(request.param,
			function (cookies)
			{
				request.next(JSON.stringify(cookies));
			}
		);
  },
  tabs_indexOf:function(request)//查找，直到找到为止
  {
		Tool.ifTabs(request,this.tabs_indexOf02,this)//当选项卡不存在，就停止运行。
  },
  tabs_indexOf02:function(request)//查找，直到找到为止
  {
		var This=this;
		chrome.tabs.executeScript(request.id,{code:"document.body.parentNode.outerHTML;"},function(t)
		{
			if(t[0])//取不到值，重新再来。
			{
				if(request.html)
				{
					var arr=request.html.split("<1/>"),isbool=false;
					for(var i=0;i<arr.length;i++)
					{
						if(t[0].indexOf(arr[i])!=-1){isbool=true;break;}
					}				
					if(isbool)
					{
						request.next(t);
					}
					else
					{
						Tool.Time(This.tabs_indexOf,100, This, "1", request);
					}
				}
				else
				{
					alert("必须填写【找查内容】参数。");
				}
			}
			else
			{
				Tool.Time(This.tabs_indexOf,100, This, "1", request);
			}
		});
  },
  // 执行JS
  tabs_executeScript01:function(request)
  {
		Tool.ifTabs(request,this.tabs_executeScript02,this,Tool.notTab)
  },
  tabs_executeScript02:function(request)
  {
		var This=this;
		if(request.file)
		{
			chrome.tabs.executeScript(request.id, {file:request.file},function(){
				chrome.tabs.executeScript(request.id, {code:request.code},function(t)
				{
					request.next(t);
				});
			});
		}
		else
		{
			chrome.tabs.executeScript(request.id, {code:request.code},function(t)
			{
				request.next(t);
			});
		}
  },
  // 执行JS
  tabs_executeScript_indexOf01:function(request)
  {
		Tool.ifTabs(request,this.tabs_executeScript_indexOf02,this,Tool.notTab)
  },
  // 执行JS
  tabs_executeScript_indexOf02:function(request)
  {
		var This=this;
		if(request.file)
		{
			chrome.tabs.executeScript(request.id, {file:request.file},function(){
				chrome.tabs.executeScript(request.id, {code:request.code},function(t)
				{
					Tool.Time(This.tabs_indexOf,100, This, "1", request);
				});
			});
		}
		else
		{
			chrome.tabs.executeScript(request.id, {code:request.code},function(t)
			{
				Tool.Time(This.tabs_indexOf,100, This, "1", request);
			});
		}
  }
}
fun.a01();
/*
 saveScreenshot01:function()
  {
		//这个只能截当前屏幕，截整个网页，chrome有自带的命令。
		var This=this;
		chrome.tabs.captureVisibleTab(null, {format : "png"}, function(data)
		{
			This.saveScreenshot02(data);
		});
	},
	saveScreenshot02:function(data,request)
	{
		var canvas =  document.createElement("canvas");
		var image = new Image();
		image.src = data; 
		image.onload = function()
		{
			canvas.width = image.width;
			canvas.height = image.height;
			var context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			// save the image
			var link = document.createElement('a');
			link.download = "screenshot.png";
			link.href =  canvas.toDataURL();
			link.click();
		};
	},
  tabs_create_update_indexOf01:function(request)//创建--看能不能不要这个
  {
		alert("看能不能不要这个")
			var This=this;
			chrome.tabs.query({index:request.index-1,windowId:request.windowId},function(tabs)//第一层
			{
				if(tabs.length==0)//不存在就创建
				{
					request.isbool=true;
					chrome.tabs.create({url:request.url,windowId:request.windowId},function()
					{
						chrome.tabs.highlight({tabs:0,windowId:request.windowId},function()
						{
							This.tabs_create_update_indexOf01(request,next);
						});						
					});
				}
				else
				{
					//存在就更新
					request.tabsId=tabs[0].id;
					if(request.isbool)//是从创建过来的，就不用更新
					{Tool.Time(This.tabs_create_update_indexOf04,100, This, "1", [request,next]);}
					else
					{This.tabs_create_update_indexOf02(request,next);}
					
				}
			});
  },

	// 获取当前的代理配置(调试使用，正式不需要)
  GetProxyConfig:function()
  {
		chrome.proxy.settings.get({},function(config) {
			console.log(["eeeeeeeeeee",config]);
			console.log(JSON.stringify(config));
		});
	},
  proxy:function(request, next)
  {
		chrome.proxy.settings.set({
			value: {
			"mode":"pac_script",
			"pacScript":{"data":"function FindProxyForURL(url, host){return \""+request.url+"\";}"}
		},
		scope: 'regular'
		},
		function(t)
		{
			//fun.GetProxyConfig()
			next(t)
		});
	},
	//重置为默认代理
  resetProxy:function()
  {
		chrome.proxy.settings.set({value: {mode: "system"}});
	},
  ////////////////////////////////////////////////////////////////////////
	tabs_create_update_indexOf02:function(request,next)//清空内容（如果不清空内容，就可能会获取上一次的内容）
  {
		var This=this;
		chrome.tabs.executeScript(request.tabsId,{code:'document.body.innerHTML="清空内容";'},function(t1)//清空
		{
			if(t1)
			{
				chrome.tabs.executeScript(request.tabsId,{code:'document.body.innerHTML;'},function(t2)
				{
					if(t2=="清空内容"){Tool.Time(This.tabs_create_update_indexOf03,1, This, "1", [request,next]);}
					else
					{
						next("清空代码失败。");
					}
				});
			}
			else
			{
				next("设置空失败。");
			}
		});
	},
  tabs_create_update_indexOf03:function(arr)//查找到想要的代码就出来【request.code】
  {
		//说明：
		//arr[0].url    上一次url与这个是url,不能一样，因为【chrome.tabs.update】一样，就会直接过了。
		var This=this;
		chrome.tabs.update(arr[0].tabsId,{url:arr[0].url},function(t)
		{
			Tool.Time(This.tabs_create_update_indexOf04,100, This, "1", arr);//查找
		});
  },
  tabs_create_update_indexOf04:function(arr1)//查找到想要的代码就出来【request.code】
  {
		var This=this;
		chrome.tabs.executeScript(arr1[0].tabsId,{code:"document.body.parentNode.outerHTML;"},function(t)
		{
			if(t)
			{
				if(arr1[0].code)
				{
					var arr2=arr1[0].code.split("<1/>"),isbool=false;
					for(var i=0;i<arr2.length;i++)
					{
						if(t[0].indexOf(arr2[i])!=-1){isbool=true;break;}
					}				
					if(isbool)
					{
						arr1[1](t);
					}
					else
					{
						Tool.Time(This.tabs_create_update_indexOf04,100, This, "1", arr1);
					}
				}
				else
				{arr1[1]("参数错误。。。");}
			}
			else
			{
				arr1[1]("取值失败。");
				//Tool.Time(This.tabs_create_update_indexOf04,100,This, "1", arr1);
			}
		});
  },
	*/