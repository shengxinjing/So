# 前端面试题集锦（一）

## 1. 语法你妹

笔试中如果遇上这样的题目，你会怎么办

```javascript
var a = 5,
    b = 5;
    
alert(a+++b);    
```

这种题目实在太low，浪费我生命。
再来看另一题

```javascript
function f() {return 1;}
function f() {return 2;}
alert(f());
```

你这是又在秀下限吗？ 在反模式编程中，我觉得你简直是专家啊。

## 2. 作用域

### 神马是作用域

作用域，是指一个变量在某个特定范围内可以被访问到，而在该范围外无法被程序访问。在Javascript中，简而言之，有全局作用域和函数作用域。

全局作用域，对应全局对象 global。所有定义在全局对象上的属性和方法，同时也是全局作用域中的变量和函数，反之亦成立。

在Js中声明函数，当函数被执行时，程序将进入到函数的作用域中(**函数作用域**)。此时，程序可以访问函数所产生的作用域，和全局作用域。也就是说，在函数内部既可以访问到函数内声明的变量和函数，也可以访问在全局作用域中的变量和函数。函数每次调用都将产生不同的作用域，不同作用域间的变量不会产生相互影响。

### 作用域链

在Javascript中，函数可以嵌套函数。也就是说，函数作用域可以嵌套更深的函数作用域。这种情况也适用于全局作用域，全局作用域中会有函数作用域。当作用域发生嵌套时，Javascript 使用链式结构来表示这种关系，程序上称之为作用域链。

作用域链使得程序可以对祖先作用域中的变量进行读写操作（但无法进行删除和新增操作）。

### 作用域的屏蔽效应

在作用域中进行变量的读写操作时，程序是从当前作用域为起始，沿着作用域链递归查找同名变量的过程。如果发现同名变量，就中断这个过程，并以此进行读写操作；如果无法找到同名变量，在进行读取操作时，程序会报错; 在进行写入操作时，则会自动将该变量声明为全局变量。

由于变量查找是一个递归查询过程，因此会产生作用域的屏蔽效应，即出现同名变量时，程序无法读写更深层次的同名变量。在程序开发中，需要留意这个特性带来的 `side effect`。

### 作用域共享

如果不同作用域共享相同的祖先作用域，在作用域A中对祖先作用域C中的变量b进行write操作。然后，在作用域B中读取其祖先作用域C中的变量b，返回值会受到前面write操作的影响。

```javascript
function C(){
    var b = 0;
    
    function A() {
        b = 1;
    }
    
    function B() {
        alert(b);
    }
    
    window.A = A;
    window.B = B;
}

C();
A();
B();
```

程序开发中，要极力避免这种不直观的场景。

### 闭包哇哈哈

从上例中可以看到，拥有相同祖先作用域的不同函数之间，是能够共享这个祖先作用域的。 

实际上，同一个函数，每次执行时，其父级和祖先作用域也是共享的。这是由于 Javascript 是基于词法作用域的，也就是说，其父级和祖先作用域在函数被声明时即被确定，且无法修改。 这有别于动态作用域，其父级和祖先作用域仅在函数被执行时才被确认。

从 Javascript 的语言实现来看，每个函数在声明时，都拥有一个 `[[scope]]` 属性。该属性是一个链式结构，链式结构中的每个节点代表一个作用域。链式结构的顺序以函数声明时所在作用域为起点，依次向上，以全局作用域为终点。

广义的闭包是指拥有词法作用域特性的作用域创建者。在Javascript中，就是函数，函数自身拥有词法作用域，并且也能产生作用域。
狭义的闭包，也就是常说的闭包，是指在函数内部的函数。这就是闭包的作用，提供对某些隐私作用域的访问权限，实现隐私数据的共享行为。

## 3. Javascript 实现继承

### 怎么来继承

简单而言，基础的继承实现基于原型式继承。还有 all-in-ones 的继承方式（复制也是一种all-in-ones，mixin也是一种，函数借用也是一种）

### 基于原型式继承的面向对象编程

```javascript
Function.prototype.implement = function(superClass) {
    // 实现继承链
    function F(){};
    F.prototype = superClass.prototype;
    this.prototype = new F();
    
    // 修复 constructor 属性 和 增加对父级原型的访问权限
    this.prototype.constructor = this;
    this.prototype._superProto = superClass.prototype;
};

// 构造函数A
function A() { this.name = "aa"; }

// 构造函数B
function B() {}
B.prototype.test = function (){ console.log(456); }

// 在A上实现B的接口，即A继承于B
A.implement(B);

var a = new A();
console.log(a.name);        // aa
console.log(a.test());       // 456
console.log(a.constructor === A);           // true
console.log(a._superProto === B.prototype); // true
console.log(a._superProto.test === a.test); // true
```

### all-in-ones

有点懒，暂时就先忽略一下。

### 基于复制的面向对象编程

```javascript
Object.prototype.implement = function (obj) {
    // 这里写的浅复制，没来得及写成深复制。
    for (var key in obj) {
        if (obj.hasOwnProperty(key)){
            this[key] = obj[key];
        }
    }
}

var promise = {
    onFulfill: function() {...},
    onReject: function() {...},
    fulfill: function() {...},
    reject: function() {...},
    status: "pending"
};

var obj = {};
obj.implement(promise);
```

## 4. Event 事件机制

### 事件模型（职责链 + pub/sub）

三个阶段（按照DOM树传递事件），订阅者/发布者模式。

```
EventTarget.addEventListener()
EventTarget.removeEventListener()
EventTarget.dispatchEvent()
```

### 事件对象  `Event`

事件对象向用户提供了必要的用户交互信息，开发者根据这些用户信息来控制程序的逻辑走向。

```
// 事件所处阶段
e.eventPhase

Event.prototype 
    CAPTURING_PHASE : 1
    AT_TARGET       : 2
    BUBBLING_PHASE  : 3

// 事件类型    
e.type

// 当前DOM节点
e.currentTarget

// 事件源DOM节点
e.target

e.stopPropagation() 
e.stopImmediatePropagation()

e.preventDefault()

// 更多信息可参见相关文档或规范定义
```
 
### 默认行为
 
从测试效果看，可理解为，对应触发事件后，默认行为 function() { //dosomething} 立刻进入到 event loop 队列中，而 preventDefault 函数的调用是将该默认行为在队列中移除。可以类比 `setTimeout` 和 `clearTimeout`。

此概念也常用于Javascript编程中。经典的例子 ，dialog 对话框在关闭前触发一个 beforeClose 事件，其默认行为即关闭对话框。 但是当事件处理函数返回 false 时，阻止默认的对话框关闭行为。

### jquery的事件实现

 1. 事件的手动派发(派发该元素上的事件)
 2. 事件对象的二次封装
 3. 事件委托的模拟
 4. 非冒泡事件的冒泡化（职责链派发）
 5. 高阶事件（特殊事件）

## 性能优化系统

- 性能监控
    1. 监控方式（侵入式和非侵入式）和埋点
    2. 监控粒度（关键时刻点）
    3. 数据运算和图表化
    4. 基础服务化，快速接入系统
- 数据分析
    1. 分析性能瓶颈
- 方案调研和优化
    1. 确认性能瓶颈，调研解决方案，设计、尝试、权衡
    2. 代码开发与上线
- 优化反馈
- 流程化，上下游打通，后端优化，数据化，产生积累效应，推广监控的范围
- 性能优化建议
    1. CDN接入，提升**请求并发**能力（网络延时高时有较好效果）
    2. 降低资源冗余度，**按需加载**
    3. 合理的版本管理，提升**缓存**命中率
    4. 合理的请求合并（或资源嵌入），**降低请求数**
    5. 延迟加载（考虑竞争状态），**核心任务优先**原则
    6. **提前处理**（DNS预解析，图片预加载，js预加载）
    7. HTTP长连接，**避免重复握手**


## 前端架构

- Javascript 基础库，比如 jquery，underscore 等
- UI 组件库，比如 lazyload、dialog、cookie 等
- reset CSS & normalize CSS & util CSS & mixin LESS
- CSS预处理语言 和 后处理工具
- Javascript模块化编程
- 模块化开发
- 本地构建，代码部署和发布（CDN）
- 注释 和 文档化

## FIS 的核心功能

- 模块化开发，依赖声明
- 后端 loader 实现 和 map.json 资源依赖表
- 三种能力，分离开发和部署
- 覆盖式发布和md5戳，最大限度利用缓冲
- 将性能优化纳入流程，并自动化
