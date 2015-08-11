# express 4x Example 学习

## 路由地图

```javascript
// 路由地图的应用
app.map({
    '/users': {
        get: users.list,    // VERB and routeAction
        del: users.del,
        '/:uid': {          // prefixPath and controllers
            get: users.get,
            '/pets': {
                get: pets.list,
                '/:pid': {
                    del: pets.del
                }
            }
        }
    }
});
```

## 文件下载
```javascript
app.get('/files/:file', function(req, res, next){
    var file = req.params.file;
    var path = __dirname + '/files/' + file;

    res.download(path);
});
```

## 与模版通信

```javascript
function ferrets(user) {
  return user.species == 'ferret';
}

function count(req, res, next) {
  User.count(function(err, count){
    if (err) return next(err);
    req.count = count;
    next();
  })
}

function users(req, res, next) {
  User.all(function(err, users){
    if (err) return next(err);
    req.users = users;
    next();
  })
}

// 1、参数传递方式，更加灵活, 但是维护性上略有不便
// 可共享基础数据，然后在不同路由分支上对数据进行二次改造
app.get('/middleware', count, users, function(req, res, next){
    res.render('user', {
        title: 'Users',
        count: req.count,
        users: req.users.filter(ferrets)    // 对基础数据二次改造
    });
});

// 2、直接将数据输出到 locals 变量上，避免多次传参
// 不灵活之处是，对数据的二次改造从逻辑上比较怪异，是 override 过程
function count2(req, res, next) {
    User.count(function(err, count){
        if (err) return next(err);
        res.locals.count = count;
        next();
    })
}

function users2(req, res, next) {
    User.all(function(err, users){
        if (err) return next(err);
        res.locals.users = users.filter(ferrets);
        next();
    })
}

app.get('/middleware-locals', count2, users2, function(req, res, next){
  res.render('user', { title: 'Users' });
});

//  通用中间件，只暴露给 /api 前缀的用户请求上
app.use('/api', function(req, res, next){
    res.locals.user = req.user;
    res.locals.sess = req.session;
    next();
});
```

## 虚拟主机

```javascript
var vhost = require('vhost');

/*
edit /etc/hosts:

127.0.0.1       foo.example.com
127.0.0.1       bar.example.com
127.0.0.1       example.com
*/

// Main app
var main = express();
main.use(logger('dev'));
main.get('/', function(req, res){
    res.send('Hello from main app!');
});
main.get('/:sub', function(req, res){
    res.send('requested ' + req.params.sub);
});

// Redirect app
var redirect = express();
redirect.all('*', function(req, res){
    console.log(req.subdomains);
    res.redirect('http://example.com:3000/' + req.subdomains[0]);
});

// Vhost app
var app = express();
app.use(vhost('*.example.com', redirect));  // Serves all subdomains via Redirect app
app.use(vhost('example.com', main));        // Serves top level domain via Main server app

app.listen(3000);
console.log('Express app started on port 3000');
```

## 路由 actions

```javascript

// General      首页路由
app.get('/', site.index);

// User         用户个人中心路由
app.all('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// Posts        文章路由
app.get('/posts', post.list);
```

## 跨域XHR

```javascript
api.all('*', function(req, res, next){
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});
```

## 权限认证

```javascript
// 函数签名是有多伤身啊
hash(password, function(err, salt, hash){});
hash(password, salt, function(err, hash){}); 
```

## 简单的MVC

```javascript
// define a custom res.message() method which stores messages in the session
app.response.message = function(msg){
    // reference `req.session` via the `this.req` reference
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
    return this;
};

// Custom Router
module.exports = function(parent, options){
  var verbose = options.verbose;
  
  // 读取文件，目录结构与规范一致
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    // name 是一个模块目录名，比如 main、 user
    verbose && console.log('\n   %s:', name);
    
    var obj = require('./../controllers/' + name);
    
    var name    = obj.name || name;
    var prefix  = obj.prefix || '';
    
    var app = express();
    
    var method;
    var path;

    // allow specifying the view engine
    if (obj.engine) app.set('view engine', obj.engine);
    app.set('views', __dirname + '/../controllers/' + name + '/views');

    // before middleware support
    if (obj.before) {
      path = '/' + name + '/:' + name + '_id';
      app.all(path, obj.before);
      
      verbose && console.log('     ALL %s -> before', path);
      
      path = '/' + name + '/:' + name + '_id/*';
      app.all(path, obj.before);
      
      verbose && console.log('     ALL %s -> before', path);
    }

    // generate routes based on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
      // route exports
      switch (key) {
        case 'show':
          method = 'get';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'list':
          method = 'get';
          path = '/' + name + 's';
          break;
        case 'edit':
          method = 'get';
          path = '/' + name + '/:' + name + '_id/edit';
          break;
        case 'update':
          method = 'put';
          path = '/' + name + '/:' + name + '_id';
          break;
        case 'create':
          method = 'post';
          path = '/' + name;
          break;
        case 'index':
          method = 'get';
          path = '/';
          break;
        default:
          throw new Error('unrecognized route: ' + name + '.' + key);
      }

      path = prefix + path;         // 模拟 mounted app, if prefix is existed.
      app[method](path, obj[key]);  // 指向path路径的method方法，由obj[key]指向的路由器接管
      
      verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
    }

    // mount the app
    parent.use(app);
  });
};
```

## FORM 表单提交

form有个属性 `enctype`，默认值是 `application/x-www-form-urlencoded`，表示会将表单数据用&符号做一个简单的拼接。例如：

```
POST /post_test.php HTTP/1.1   
Content-Type: application/x-www-form-urlencoded   
Content-Length: 42  
   
title=test&content=%B3%AC%BC%B6%C5%AE%C9%FA&submit=post+article  
```

这个时候 `Content-Type` 为 `application/x-www-form-urlencoded`。

如果 `enctype` 的值为 `multipart/form-data`，表示表单中包含文件上传，它会将表单中的数据使用一个boundary作为分隔上传。例如：

```
POST /post_test.php?t=1 HTTP/1.1  
Content-Type: multipart/form-data; boundary=---------------------------7dbf514701e8
Content-Length: 345  
   
-----------------------------7dbf514701e8  
Content-Disposition: form-data; name="title"  
test  
-----------------------------7dbf514701e8  
Content-Disposition: form-data; name="content"  
....  
-----------------------------7dbf514701e8  
Content-Disposition: form-data; name="submit"  
post article  
-----------------------------7dbf514701e8--  
```

这时 `Content-Type` 变为 `multipart/form-data`。
参考：http://imzc.net/archives/131 
