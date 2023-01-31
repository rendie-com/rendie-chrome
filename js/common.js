'use strict';
var Tool={
	T:[],
	//延时执行
  Time:function(A,B,C,D,E)
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
  },
  //高亮tab
  notTab:function(request)
  {
		alert("没有【第"+request.index+"个选项卡】")
  },
	ifTabs:function(request,next1,This,next2)//指定的【选项卡】是否存在，从而选择执行方法。
	{
		chrome.tabs.query({index:request.index-1,windowId:request.windowId},function(tabs)
		{
			if(tabs.length==0)
			{
				if(next2)
				{
					next2.apply(This,[request]);
				}
			}
			else
			{
				request.id=tabs[0].id;//tabs_executeScript_indexOf01   要用
				next1.apply(This,[request]);
			}
		});
	},
	getFileBlob: function (url, next, This, t) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                Tool.apply(this.response, next, This, t)
            }
            else if (this.readyState === 4) {
                
                Tool.apply({ status: this.status }, next, This, t)
            }
        }
        xhr.send();
    },
	apply: function (data, next, This, t) {
			if (t) { next.apply(This, [data, t]); }
			else { next.apply(This, [data]); }
	},
	uploadFile: function (url,headers, data, next, This, t) {
			$.ajax({
					type: 'POST',
					url: url,
					data: data,
					headers:headers,
					timeout: 300000,
					async: false,
					processData: false,
					contentType: false, 
					dataType: "json",
					success: function (data) {
							Tool.apply(data, next, This, t)
					},
					complete: function (XMLHttpRequest, status) {
							if (status != 'success') {
									let data = {
											status: status,
											code: XMLHttpRequest.status,
											error: XMLHttpRequest.responseText
									}
									Tool.apply(data, next, This, t)
							}
					}
			});
	},
}