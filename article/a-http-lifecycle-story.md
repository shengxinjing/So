# 一次HTTP请求响应的生命周期

用户在浏览器地址栏输入 http://www.youku.com/ 时（含其他类似行为），浏览器和服务器会有一系列的行为发生。

## 启动
浏览器启动获取该资源的过程，这个时间点我们可以通过 `timing.fetchStart` 来访问。

## DNS 查询
获取资源的第一步，是将对应的网址通过DNS解析为对应的IP。DNS信息除了DNS服务器上存在，本地操作系统和浏览器都可能存有DNS缓存，同时本地系统的 hosts 也会对DNS解析产生影响。如果本地没有相应的DNS信息，客户端则去DNS服务器来获取当前域名的IP，这个DNS查询过程是递归的，并且每级DNS服务器都有缓存结构。

进行DNS查询时，分别产生两个时间点， `timing.domainLookupStart`, `timing.domainLookupEnd`。

## TCP 连接
现在浏览器已经知道要访问的服务器IP了。然后，客户端会与该服务器建立 TCP 连接（三次握手），建立链接后才能进行可靠的网络通讯。

TCP连接时，会有 `timing.connectStart`， `timing.connectEnd` 两个时间点。

## HTTP 请求
完成TCP连接后，客户端将 http://www.youku.com/ 组装成一个HTTP请求，并将请求发送给服务器。发送HTTP请求时，产生 `timing.requestStart` 时间点。

## HTTP 响应
服务器收到从客户端发来的HTTP请求，根据请求中的信息进行相应处理，处理完成后，将内容组装成HTTP响应并发送给客户端。客户端开始收到响应，产生 `timing.responseStart` 时间点。客户端接收完响应，则产生     `timing.responseEnd` 时间点。

## 浏览器处理

客户端接受到HTTP响应，如果这个响应是 HTML 文本。浏览器会一边接受HTTP响应，一边解析HTML。

同时根据解析结果，浏览器发起新的HTTP请求，比如css、js、image。浏览器在解析到 CSS 或 image 时，HTTP请求是可以并行的，在这些请求下载完成后，浏览器也会进行解析。在解析到Javascript外部链接时，默认情况下，浏览器的HTML解析进程会阻塞，直到该Javascript文件完成下载，并执行完毕。

这是因为Javascript作为程序存在同步和依赖问题，一旦遇到Javascript就进行阻塞操作，会使得同步和依赖问题的实现变得非常简单。但问题是，并不是所有的Javascript都要求同步的。HTML5 支持 async 属性来指定JS文件可以异步执行，指定async的JS文件在进行下载时，浏览器会继续解析和渲染HTMLL。下载完成的JS代码会尽快执行，在HTML源文档中的asynce Javascript 全部执行完毕后，浏览器才会触发 window.onload 事件。 

该事件触发前后，有 `timing.loadEventStart` 和 `timing.loadEventEnd`。

完成 window.onload 事件后，页面将进入到 异步事件响应阶段。通过用户交互才使得页面产生响应的行为。

![](http://images.cnitblog.com/blog/359286/201309/16201052-e3ec989759a4419b815ff1979d7ffb76.png)