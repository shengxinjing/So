# Express4 example 学习

## 1、基础结构

```javascript
// 新建 app 服务器
var express = require('../../lib/express');
var app = express();

// 伪造的数据库
var users = [
    { id: 0, name: 'tj', email: 'tj@vision-media.ca', role: 'member' }
  , { id: 1, name: 'ciaran', email: 'ciaranj@gmail.com', role: 'member' }
];

// 路由中间件（使用在 get/post 等路由回调函数序列中）
function loadUser(req, res, next) {
  // app.get("/xxx/:id") ==> req.params.id
  var user = users[req.params.id]; 
  if (user) {                             
    req.user = user;    // 消息传递机制
    next();
  } else {              // 错误处理机制，服务器会统一处理 error
    next(new Error('Failed to load user ' + req.params.id));
  }
}

// use 中间件，影响所有用户请求，或 `path` 目录下的所有请求
// 用户请求进来时，会根据声明的顺序依次调用中间件
app.use(function(req, res, next){
  // 消息传递机制，即中间件模式    
  req.authenticatedUser = users[0];   
  next();
});

app.get('/', function(req, res){
  // 首页访问时，进行302重定向
  res.redirect('/user/0');
});

app.get('/user/:id', loadUser, function(req, res){
  // 发送静态响应，也可用模版引擎解析模版     
  res.send('Viewing user ' + req.user.name);
});

// 启动服务器
app.listen(3000);
console.log('Express app started on port 3000');
```

## 2、模版引擎

### 模版配置

```javascript
// 设置模版文件的存放目录 
app.set('views', __dirname + '/views')

// 设置模版解析引擎
app.set('view engine', 'jade') 
```

### 渲染模版 

```javascript
// 路由匹配，当访问当前域名首页时
app.get('/', function(req, res){
    // 读取模版目录下 users.jade 模版文件，
    // 并使用数据来渲染模版文件（模版引擎为 jade）
    res.render('users', { users: users });
});
```

## 3、favicon

```javascript
var favicon = require('static-favicon');

// use faviconMiddleware
app.use(favicon());
```

## 4、静态文件

```javascript

// express.static() 中间件放置在路由处理之前
app.use(express.static(__dirname + '/public'));

// 所有以 '/static' 起始的请求，删除该前置路径并转交给 express.static() 中间件处理
// staticMiddleware 使用的是 req.url, 而非 req.originalUrl
// 匹配 /static 前置路径后, req.url 会自动删除该前置路径
/*
子目录中间件
Mounted middleware `app.use(prefixPath, function)` functions are not invoked unless the req.url contains this prefix, at which point it is stripped when the function is invoked. This affects this function only, subsequent middleware will see req.url with "/static" included unless they are mounted as well.
*/
app.use('/static', express.static(__dirname + '/public'));

// static 中间件可多次调用，如果无法匹配目录，会调用 next()
app.use(express.static(__dirname + '/public/css'));
```

## 5、服务器日志

```javascript
var logger = require('morgan');

// 日志中间件，logger 是日志中间件构造器
// 可指定日志的详略程度和定制日志格式
app.use(logger('dev'));
```

## 6、环境变量

```bash
$ NODE_ENV=product NODE_T=1 node app.js
```

```javascipt
console.log(process.env.NODE_ENV);  // product
console.log(process.env.NODE_T);    // 1
```

## 7、错误处理

```javascript

// 如果用户请求没有路由进行响应
// 即期望之外的用户请求，一致认为是 404 错误
app.use(function(req, res, next){
    res.status(404);
    res.render('404', { url: req.url });
});

// error-handling middleware, they require an arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed.
// 异常处理路由，所以异常统一在此处进行处理
// 该异常可以恢复，也可以委托给后续的异常处理进行处理
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err });
});
```

## 8、通用中间件

```javascript
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// by mounting this middleware to /api
// meaning only paths prefixed with "/api" will cause this middleware to be invoked
app.use('/api', function(req, res, next){
  // 在 queryString 上传递参数
  var key = req.query['api-key'];

  // key isn't present
  if (!key) return next(error(400, 'api key required'));

  // key is invalid, equal to apiKeys.indexOf(key) === -1
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  // 增强req对象，在中间件之间进行消息通信
  req.key = key;  
  // 将控制权转交为下个 middleware
  next();
});

var apiKeys = ['foo', 'bar', 'baz'];

// 各种路由处理，这里所有路由基于通过上面的 middleware 通过,
// 否则，会统一在 app.use(function (err, req, res, next){}) 处理
```

## 9、Cookies and Session

```javascript
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

// parses request cookies, populating `req.cookies` and `req.signedCookies`
// when the secret key is passed, used for signing the cookies.
app.use(cookieParser('my secret here'));

// 这里可以使用已经结构化的 cookies 和 签名cookies.
// 只有签名合法的 cookie 才会被结构化，否则将被忽略
// 签名算法 和 密钥(secret key) 只有服务器知晓。
// request cookie string convert to structural object.
app.use(function (req, res, next){
    req.cookies 
    req.signedCookies
});
```

```javascript
// setter cookie(add / update)
res.cookie('remember', 1, { maxAge: minute });
// clear cookie
res.clearCookie('remember');
// get cookies
req.cookies.remember
// set sign cookie
res.cookie('name', 'tobi', { signed: true });
```

```javascript
var session = require('express-session');

// Required by session() middleware, pass the secret key for signed cookies
// if secret key is passed, then we can access it by `req.secret` in later middleware handlers, which is mostly used by sessionMiddleware.
app.use(cookieParser('keyboard cat'));

// Populates req.session, recognize user by signedSessionCookie.
// default cookieName is `connect.sid` and cookieOptions is 
// `{ path: '/', httpOnly: true, maxAge: null }`
// and session data can be stored by many ways, such as memory\mongoDb etc.
app.use(session());

// 在后面的middleware 中，开发者通过 req.session 来访问该用户的session信息。
// session 存储在内存中时，表现为一个以 sessionId 为 key 的对象，其 value 为一个Object 实例（一个Object就是一个userSession）。当用户第二次访问时，就会拿着 sessionId 从内存中恢复其 session 数据。
```

## 10、app.param

For example when `:user` is present in a route path you may map user loading logic to automatically provide req.user to the route,  or perform validations on the parameter input.

It is important to realize that any route that triggered a named parameter function to run will only be run if `next` was not called with an error in the named parameter handler.

```javascript
// 用于对 url pathname 上的命名参数进行处理
// Load user by id
// for example:    /user/:user
app.param('user', function(req, res, next, userId){
  if (req.user = users[userId]) {
    next();
  } else {
    next(new Error('failed to find user'));
  }
});
```

## 11、params + query + body = req.param

    req.param(name)

Lookup is performed in the following order:

 1. req.params
 2. req.body
 3. req.query

Direct access to `req.body`, `req.params`, and `req.query` should be favoured for clarity - unless you truly accept input from each object.

## 12、路由控制

    app.get(path, [callback...], callback)

支持多个回调函数，在回调函数内部可调用 `next('route')` 函数中断当前路由（即不会执行当前路由的后续回调函数），而将控制权转交给后续路由。    

    app.route(path)

返回一个路由实例，在实例上可以调用 VERB 方法，主要应用如下：

```javascript
app.route('/events')
.all(function(req, res, next) {
})
.get(function(req, res, next) {
})
.post(function(req, res, next) {
})
```

## 13、locals 对象，依赖注入？

    app.locals      // for all view templates
    req.locals      // for the current response view template
    
在 `app.locals` 或 `res.locals` 对象中声明的属性或方法，可以在视图模版中访问到。经常用于定义一些全局或公用变量，使得程序易于维护。

## 14、获取用户请求头数据

    req.get(httpHeaderName)

大小写不敏感，
req.get('Content-Type');
req.get('content-type');
是一个效果。

## 15、JSON and JSONP

JSON Response
```javascript
res.json({ user: 'tobi' })
res.json(500, { error: 'message' })
```

JSONP Response
```javascript
// ?callback=foo
res.jsonp({ user: 'tobi' })
// => foo({ "user": "tobi" })

app.set('jsonp callback name', 'cb');

// ?cb=foo
res.jsonp(500, { error: 'message' })
// => foo({ "error": "message" })
```

## 16、内容协商

    res.format(object)
    
Performs content-negotiation on the request `Accept` header field when present. This method uses `req.accepted`. When no match is performed, the server responds with 406 "Not Acceptable", or invokes the `default` callback.

Use MIME

```javascript
res.format({
  'text/plain': function(){
    res.send('hey');
  },
  
  'text/html': function(){
    res.send('hey');
  },
  
  'application/json': function(){
    res.send({ message: 'hey' });
  }
});
```
OR ExtName

```javascript
res.format({
  text: function(){
    res.send('hey');
  },
  
  html: function(){
    res.send('hey');
  },
  
  json: function(){
    res.send({ message: 'hey' });
  }
});
```