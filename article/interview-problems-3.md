### 判断字符串组成：第一个必须是字母，后面可以是字母、数字、下划线，总长度为5-20

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

### 如何规避Javascript多人开发函数重名的冲突

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

### 求一个字符串的字节长度

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

### 去掉数组中的重复元素

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

- this 指代了 window
- call 和 apply
- 函数被当做方法调用
- 构造函数

### 对对象进行深复制

- 实现浅复制。
- 递归即可。
- 函数是不可复制的，因此只能针对数据。

### 实现将URL查询字符串解析为对象

- 逼格尽显

```
function Url(str) {}

Url.prototype.valueOf = function(){};
Url.prototype.toString = function(){};

Url.parse = function(str){};
Url.stringify = function(obj){};

```

### 什么是闭包？下面这个ul，如何点击每一列的时候alert其index?

闭包是指外部作用域拥有访问内部作用域的程序实现。

闭包最常用实现方式是外部函数返回一个定义在该函数内部的内部函数，该内部函数可以访问到外部函数中的局部变量。

其余的实现主要依赖浏览器的事件处理机制、定时器机制、全局变量。

说到闭包，不得不说的概念是作用域。 在JavaScript中拥有全局作用域和函数作用域两种作用域（还有动态作用域），函数作用域内可嵌套函数作用域。 函数作用域由静态生成，当你的函数定义时，作用域就已经确定。函数调用并不会改变作用域，而是创建了函数的执行上下文，在该执行上下文中，有一个独有的变量对象，该变量对象在函数执行上下文中即活动对象，仅当函数执行时被激活，函数调用完毕后随着执行上下文的释放，活动对象也被冻结（即被释放，活动对象只能被创建和释放，每次调用函数时，激活的活动对象其实是不同的，请别误以为是同一个活动对象）。而函数执行时拥有一个自己的作用域链（与函数作用域链不同，请作为区分），该作用域链在函数创建执行上下文时被初始化，将函数的作用域链复制到执行上下文的作用域链，之后，将该函数的活动对象推入执行作用域链的前端。由此，函数执行时，依赖作用域链，实现了可访问定义在函数内的局部变量，也可以跨作用域访问外层函数以及全局作用域中定义的变量和函数。

而闭包实现了当函数的执行上下文被销毁时，对应的活动对象保持激活状态（未释放）。因为在JavaScript的作用域体系中，内部作用域可以随时访问外部作用域中定义的变量或函数，内部函数定义在外部函数中，因此自然拥有访问外部函数中变量和函数（即变量对象）的权限。基于该原理以及函数作为第一类对象的定义，当内部函数作为外部函数的返回结果并被赋值给外部变量时，拥有访问外部函数中执行时的变量对象的权限。因此，外部函数虽然已经退出执行上下文，但是变量对象不会被释放，引用该内部函数的变量被调用时，可以访问外部函数的变量对象，由此实现了外部变量（外部作用域）访问内部作用域的程序实现。

名词解释：

- 变量对象VO（Variable Object），在全局环境中指代全局变量对象，在函数环境中指代函数的活动对象AO。
- 函数对象在被定义时，拥有[[Scope]]内置属性，用于存放该函数的作用域链。
- 函数被定义时，JavaScript引擎自动将该作用域链的值复制为所定义的执行上下文的作用域链值。
- 函数作为第一类对象，是指函数可以像变量一般作为实际参数、函数返回值的形式被传递。
- 执行上下文（Executive Context）是指可执行代码（Global、Function、Eval）执行时所创造和依赖的上下文。
- 作用域（Scope）是指可以程序可访问的变量和函数的权限。JavaScript中有全局作用域、函数作用域、动态作用域。
- 动态作用域是指临时作用域，分为with、try-catch模块中的catch语句、eval三个形式。

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

## 如何定义类型，如何扩展prototype

JavaScript是一个没有类概念的语言。在JavaScript中实现特定类型的对象创建需要通过构造函数来构造实例，当我们在定义一个函数时，JavaScript引擎会自动定义该函数的构造器逻辑，构造器逻辑在我们使用new 操作符调用函数时被调用。此外，定义函数时，JavaScript引擎还会自动地做一件事情，新建该函数的prototype属性，该属性被自动赋值为一个new Object对象，并在new Object对象上添加一个本地属性（实例属性）constructor，该属性是一个指向我们所定义函数的引用。（When a function object is created, it is given a prototype member which is an object containing a constructor member which is a reference to the function object. ）

说到这里，我们已经提及了构造函数的prototype成员了，而该成员就是通过调用构造函数所生成的实例对象的原型对象。实例对象在被通过调用构造函数创建时，JavaScript引擎会执行一个操作——给创建的实例对象内置[[prototype]]属性，该属性指向其构造函数的prototype成员，但是不可被应用程序显示访问和修改。通过这一步骤，实例对象建立了和原型对象的联系，实例对象一旦创建，其指向的原型对象就已确定，如果此时更新构造函数的prototype的成员，在实例对象也会同步更新（在访问实例的该属性时）。但是，如果此时更改构造函数的prototype的引用指针为另一个对象，原先创建的实例任指向旧的原型对象，而之后创建的实例指向新的原型对象。
 
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