
原文：http://ntesmailfetc.blog.163.com/blog/static/206287061201241011546581/

> 跨域问题包括所有跨域调用，无论是跨域数据获取，还是进行跨Frame调用实现页面交互。本文分享跨域数据获取。

## JSONP

最简单，也是最实用的跨域数据获取方式。通过动态生成 `<script>` 标签和 Callback 形式实现跨域数据通信。

一个JSONP接口可能是这样的：

> http://www.example.com/path/to/api?query=xxx&callback=fSomeMethod

服务器端返回如下格式的数据：

```javascript
// data 即为通讯的数据，以 js Object 形式返回，完美兼容 JSON
fSomeMethod({data})  
```

优点：实现简单，无浏览器兼容性问题
缺点：GET Method HTTP Only，且在某些浏览器会显示加载中提示

## 表单 Post 至同域

将当前页面的表单 Post 至一个隐藏的 iframe 中。

该 iframe 的 URL 即是要跨域访问的URL，该 URL 中需要开发者传递一些参数来进行必要的通信（如回调函数名，表单提交URL等），该URL对应的页面将生成自动提交表单至我们指定的回调URL的页面，这时候就可以直接调用同域的回调（而数据是从跨域表单 Post 而来）：

首先新建一个IFrame，URL如下：

```
http://www.exmaple.com/app?query=xxx&callback=fSomeMethod&backurl=http://www.other.com/path/to
```

该URL返回的内容如下：

```html
<form action="${{backurl}}" method="post">
	<input type="hidden" name="data" value="序列化的数据">
	<input type="hidden" name="callback" value="${{callback}}">
</form>
<script>
    document.getElementsByTagName("form")[0].submit();
</script>
```

该页面将在IFrame中自动提交表单到我们指定的URL中，这时候只要我们指定一个同域的URL就能实现IFrame间的相互通信。

表单 post 提交到 http://some.a.com/path 后，将返回：

```
<script>
    window.parent.${{param.callback}}("${{param.data}}");
</script>
```

由于两个IFrame属于同域，可以相互访问数据，这样就完成整个跨域获取数据的过程

优点：支持post方式，并且原生cross all browser

缺点：实现有点复杂，并且流程有点曲折，需要两次请求，而且表单post方式会引起刷新提示的问题

## 服务器代理

在服务器端来获取跨域数据，然后在同域里通过 Ajax 方式或其他方式返回给浏览器。

优点：实现简单，无跨浏览器兼容性问题
缺点：需要在服务器端实现模拟请求来获取数据

## HTML5 的 XDomainRequest

HTML5 原生支持可跨域的Ajax来获取数据，这里有个对浏览器的各种跨域ajax的测试：

http://www.debugtheweb.com/test/teststreaming.aspx

优点：原生支持
缺点：兼容性问题

## Flash 代理

成也萧何败也萧何

----------

本篇介绍跨 iframe 调用时需要 cross domain 的问题。

在页面中当需要加载外域应用的iframe时，最容易出现 IFrame跨域问题，因为外域的iframe不能直接调用:

以下的例子会以这几个页面作为例子：
页面a : http://www.a.com/a.htm
页面b:  http://www.b.com/b.htm
a的内容：
```
<iframe src="http://www.b.com/b.htm" id="ifrm_b">
</iframe>
```

## html5 postMessage

html5支持这种方式：

```
oWin.postMessage(oMessage, sTargetDomain);
// oWin 为需要跨域调用的window对象
// oMessage为传送的数据
// sTargetDomain是跨域的frame的域
```

假如页面a跨域页面b，那么在页面a上调用以下进行跨域：

```
document.getElementById("ifrm_b").contentWindow.postMessage(
    JSON.stringify({value:"this is cross call by PostMessage."}),
    "http://www.b.com"
);
```

然后在b，需要加一个window的message事件监听
```
fAddEvent(window, "message", function (o) {
 	var oMessage = o.data;
 	alert(oMessage.value); 
});
```

优点：完美的跨frame跨域调用
缺点：只支持html5的浏览器

## 代理iframe方式

使用代理iframe的方式有两种，一种通过window.name方式跨域调用，一种是通过url参数的方式传递调用，不过两种方式的调用原理都是创建一个隐藏的iframe，iframe的url指向需要跨域的域名的一个代理页面，然后通过这个代理的iframe，和跨域的iframe通讯，因为这时代理的iframe和跨域的iframe完全同域，就可以畅通无阻进行。

在上面的例子加多一个代理页面c:
代理iframe c :  http://www.b.com/c.htm
在页面a加入以下函数：

```
function fCrossByName(sDomain, oData) {
 	var oIframe = document.getElementById("ifrmCross");
 	if (oIframe) {
  		oIframe.parentNode.removeChild(oIframe);
 	}
 	
 	oIframe = document.createElement("IFRAME");
 	
 	oIframe.style.display = "none";
 	oIframe.id = "ifrmCross";
 	oIframe.name = JSON.stringify(oData);
 	
 	document.body.appendChild(oIframe);
 	
 	oIframe.src = "http://" + sDomain + "/c.htm";
}
```

然后在页面a就可以进行跨域：

```
fCrossByName("www.b.com", {
 	value : "this is cross call by iframe",
 	func  : "fCrossByNameCall",    // 要跨域调用的函数名
 	win   : "ifrm_b"
});
```

然后在代理iframe加入以下代码：

```
var oData = !window.name 
        ? null 
        : (new Function('return '+window.name))();
        
if (oData.win && oData.func) {
    var win = (oData.win == "top") ? top : parent[oData.win];
 	var oResult = win[oData.func](oData);
}
```

这样就可以实现整个的跨域调用，通过url参数方式跨域调用，和这个类似，只是需要将数据放到代理iframe的url参数上，而不是name。

下面这个页面demo显示这三种方式的调用（因为没加JSON的转换js包，需要使用支持内置JSON对象的浏览器运行..）：
http://mimg.163.com/demo/crossdomain_test.htm

优点：没有浏览器兼容问题
缺点：因为要部署代理iframe的文件，所以比较麻烦，整个流程也比较复杂，如果要实现和html5的postMessage兼容的接口，需要做大量封装，就会更加造成更加复杂