### 判断字符串组成

第一个必须是字母，后面可以是字母、数字、下划线，总长度为5-20

考察正则表达式的掌握。
```
var regexp = /^[a-zA-Z]\w{4,19}$/ ;
regexp.test("tetttttssfgdsg8979");
```


### 截取字符串 abcdefg 的 efg

考察字符串操作API的熟悉。

- `String.prototype.indexOf()`
- `String.prototype.substring()`
- `String.prototype.substr()`
- `String.prototype.test()`


### 判断一个字符串中出现次数最多的字符

字符串遍历，并进行字符出现的计数，考察基本编程知识。


### 如何规避多人开发时的函数重名冲突

- 命名空间；
- 立即执行函数模式，避免污染全局环境；

样例代码：
```
MYAPP.namespace('MYAPP.utilities.array');
MYAPP.utilities.array = (function() {

    // 依赖声明
    var uobj = MYAPP.utilities.object,
        ulang = MYAPP.utilities.lang,

        //私有属性
        array_string = "[object Array]",
        ops = Object.prototype.toString;

    //私有方法
    function isArray(a) {
        return ops.call(a) === array_string;
    }

    //一次性初始化过程
    //.........

    //公有API
    return {
        isArray: isArray
    };
}());
```


### 面向对象编程中的继承

- 原型式继承 和 借用构造函数结合的方式。

```
function inherit(SubClass, SuperClass) {
	SubClass.prototype = Object.create(SuperClass.prototype);
	SubClass.prototype.constructor = SubClass;
	SubClass.uber = SuperClass;
}

function SubClass(config){
	if (SubClass.uber) {
		SubClass.uber.call(this, config);
	}
	//......
}

function SuperClass(config){
	//......
}

inherit(SubClass, SuperClass);

var obj = new SubClass({});
```

借用构造函数方式，解决了实例属性的问题，同时可以灵活地传递参数；原型式继承的优势，是有效地实现原型成员的复用和扩展（覆写），同时维护了原型链的关系。

### 求字符串的字节个数

在GBK编码下，中文是两个字节，UTF-8下中文为三个字节。

```
function GetBytes(str){
    var len = str.length;
    var bytes = len;
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) >= 256) bytes++;
        if (str.charCodeAt(i) >＝ 65536) bytes++;
    }
    
    return bytes;
}
```

### 数组中相同元素去重

- 注意要创建数组副本，不要修改原始数组。
- 注意尽量避免扩展内置类型的原型方法。
- `indexOf` 和 `equal`，如何判断两个元素相等

```
Array.prototype.unique = function() {
    var ret = [];
    var obj = {};
    var len = this.length;
    for (var i = 0; i < len; i++) {
        var val = this[i];

        if (!obj[val]) {
            obj[val] = true;
            ret.push(val);
        }
    }
    return ret;
};
```

### this 的典型应用

- this 默认指代了 window
- call 和 apply 的应用
- 函数被当做方法调用
- 构造函数

### 实现对象的深复制

- 实现浅复制。
- 递归即可。
- 函数是不可复制的，因此只能针对数据。

### 将URL查询字符串解析为对象

- 逼格尽显

```
function Url(str) {}

Url.prototype.valueOf = function(){};
Url.prototype.toString = function(){};

Url.parse = function(str){};
Url.stringify = function(obj){};

```

### 如何理解闭包

先说作用域，作用域是指可以程序可访问的变量和函数的集合（权限） 。在JavaScript中，函数拥有自己的作用域。 由于函数中可以嵌套函数，因此作用域中也可以嵌套作用域。

以下为例：

```javascript
function a() {
	var A = 0;
	
	function b() {
		var B = 1;
	}
	
	b();
}
```

函数 a 中嵌套了函数 b。

函数 a 被执行时，将创建自己的作用域。因此在函数 a 的执行环境中， 可以通过变量标识 `A` 、`b` 访问到自身作用域中的对应变量和函数。同理，函数 b 被执行时也将创建自己的作用域（每次执行都会创建新的作用域），函数 b，不仅可以访问自身作用域中的变量和函数， 也可以访问其外层作用域中的变量和函数。

这是由于，javascript 的变量和函数的查询机制决定的。 当存在作用域的嵌套情况时，此时，我们将从最里层的作用域开始，一层一层到最外层的一系列作用域所形成的一个有序数据结构，称之为作用域链。在函数中引用一个变量，该变量将沿着当前的作用域链，按照就近原则，进行匹配查找。因此，里面的函数，可以访问外层函数的作用域。

函数的作用域链由两部分组成，一部分是**执行时作用域**，另一部分则是函数被定义时所确立的**静态作用域链**。当函数被定义时，其静态作用域链就已经被确定，不论函数在哪里被调用，其静态作用域链的值就是当前所在函数的**执行时作用域链**。函数调用时，在其创建执行上下文阶段，将**执行时作用域**拼接在其**静态作用域链**的前端，才形成**执行时作用域链**。这样的实现，使得在函数内部，开发者既可以访问定义在该函数内的局部变量和函数，也可以访问外层函数以及全局作用域中所定义的变量和函数。

闭包是什么呢，广义的闭包就是指这个作用域机制。狭义的，是指函数拥有闭合的作用域，除了在该函数体内以及在该函数体内所定义的函数内可访问该作用域以外，其他方式均不可访问该作用域。

这个特性，经常被用来创建一些中间作用域，用于限制变量和函数的访问权限。

名词解释：

- 函数在被定义时，拥有`[[Scope]]`属性，用于存放该函数的作用域链。
- 函数被定义时，JavaScript引擎自动将该作用域链的值复制为所定义的执行上下文的作用域链值。
- 函数作为第一类对象，是指函数可以像变量一般作为实参、函数返回值的形式被传递。
- 执行上下文（Executive Context）是指可执行代码（Global、Function、Eval）执行时所创造并依赖的上下文。
- JavaScript中有全局作用域、函数作用域、动态作用域。
- 动态作用域是指临时作用域，分为 `with`、`try-catch`、`eval`三种形式。

### js 异步加载和回调

 注意竞争状态的处理，下面有坑的。

```
var n = document.createElement("script");
n.type = "text/javascript";
n.onreadystatechange = function () {
       var state = this.readyState;
       if ('loaded' === state || 'complete' === state) {
           n.onreadystatechange = null;
           callback(id, url); 
       }
};
n.addEventListener('load',function () { 
	callback(id,url); 
});
```

## 如何定义类型，prototype 原理

在JavaScript中，通过构造函数，实现特定类型的对象创建。

当我们在定义函数时，JavaScript引擎会自动定义该函数的构造器逻辑，构造器逻辑在我们使用 new 操作符调用函数时被调用。此外，JavaScript引擎还会自动新建该函数的 `prototype` 属性，其值是一个新建的Object实例，并拥有 `constructor` 属性，指向我们所定义函数。

实例对象在被通过 new 操作创建时，JavaScript引擎将执行一个操作——给新建的实例对象赋值`[[prototype]]`属性，该值指向其构造函数的 `prototype` 对象。这时，我们将 `prototype` 对象称之为该构造函数的原型对象。通过这一机制，实例对象与原型对象建立了联系，实例对象一旦创建，其指向的原型对象就已确定，此时，如果更新构造函数的`prototype`对象的成员，在实例对象也会同步更新。但如果将构造函数的`prototype`指向为另一个对象，则原先创建的实例仍指向旧原型对象，之后创建的实例指向新原型对象。

接下来就说 原型链 和 原型链查找机制。
 
### 多浏览器检测通过什么？

- navigator.userAgent  用户代理
- 特性检测
- 怪癖检测，用于处理奇怪的bug

### 前端开发的优化

原则一： 减少网络通信和HTTP请求消耗

- 合并请求，比如CSS精灵、合并JavaScript文件、合并CSS文件
- 缓存数据，减少请求
- CDN，选择最优线路下载数据
- 按需加载，仅当需要时才请求必要数据
- 延迟加载，典型应用是Lazyload延迟加载图片
- 预加载，提前申请数据，对用户未来行为预测
- 代码优化，减少代码量
- 首屏外数据异步化

原则二： 减少客户端的处理压力

- 合理规划HTML代码，精简DOM树规模
- 利用CSS选择器性能差异，尽可能少用CSS表达式、利用CSS继承和层叠特定
- img标签在宽高可知时在HTML中定义宽度和高度，避免浏览器回流和重绘
- 减少和优化DOM操作，缓存查询结果，批量化操作方法避免反复回流和重绘（文档碎片、复制节点、隐藏元素）
- 使用setTimeout避免浏览器失去响应，或者使用 Web Workers后台执行JavaScript
- 使用innerHTML，利用浏览器的原生效率高的特性
- 使用事件代理技术
- 延迟渲染，比如textarea的技术
- 优化JavaScript代码，减少性能损失

具体规则可以看Yahoo的指导建议。