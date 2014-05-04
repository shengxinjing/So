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