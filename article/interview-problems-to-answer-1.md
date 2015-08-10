# 前端面试集锦（一）

## 语法你妹

笔试中如果遇上这样的题目，你会怎么办

```javascript
var a = 5,
    b = 5;
    
alert(a+++b);    
```

首先，我的直觉就是这家公司前端水平较差，或没有团队的未来规划。TMD，你说上面的东西考什么，TMD谁JS代码这样写啊，在这样的公司工作简直就是浪费自己的生命。

再来看另一题

```javascript
function f() {return 1;}
function f() {return 2;}
alert(f());
```

你这是又在秀下限吗？ 在反模式编程中，我真的觉得你简直就是专家了。

## 作用域

### 神马是作用域

作用域也就是作用范围，在程序语言中，是指一个变量在某个范围能被访问到，而在范围之外无法被访问到（有可能是没有权限，也有可能变量已被销毁）。在Javascript中，简而言之，有全局作用域和函数作用域。

### 全局作用域

全局作用域，对应全局对象 global， 所有定义在全局对象上的属性和方法，同时也是全局作用域中的变量和函数，反之也成立。CPU进入Javascript执行进程，Javascript（主语可能有问题）会自己创建全局变量和全局作用域，程序在全局作用域下执行。

### 函数作用域

在全局作用域声明函数，当函数进入执行状态时，程序将进入当前函数的作用域中(**函数作用域**)。此时，程序可以访问函数所产生的作用域，和全局作用域，也就是说在函数内部既可以访问到函数内声明的变量，也可以访问在全局作用域中声明的变量。函数每次调用将产生不同的作用域，不同作用域间的变量不会产生相互影响。

### 作用域链

在Javascript中，函数内部可以嵌套函数，也就是说，函数作用域中可以有更加深层的函数作用域。这种情况也适用于全局作用域，全局作用域中可以有函数作用域。 当作用域产生嵌套时，就产生了作用域链。

作用域链使得程序可以对祖先作用域中的变量进行读取和写入操作（无法进行删除和新增操作）。

```javascript
(function A(){
    var a = 5;
    B = function removeVar() { delete a;}
    C = function addVar() { b = 5;} 
    D = function updateVar() { a =  55; }
    E = function readVarA() { alert(a); }
    F = function readVarB() { alert(b); }
})();

E();    //可以读取
B();    //无法删除
E();
D();    //可以写入
E();
C();    //无法新增
F();   
```

### 作用域屏蔽效应

在作用域中进行变量的读写操作时，程序是从当前作用域中向上递归查找同名的变量，如果发现同名变量，就中断这个过程；如果无法获取到同名变量，在进行变量读取操作时，程序会报错; 在进行变量写入操作时，这会自动将该变量声明为全局变量。

由于变量查找是一个递归查询过程，我们在可以当前作用域声明祖先作用域中的同名变量，而打到作用域屏蔽的效果（实际工程应用中少用，因为这个效应有强烈的 side effect）。

### 作用域共享

如果不同作用域共享相同的祖先作用域，在作用域A中对祖先作用域C中的变量b进行write操作，此时，在作用域B中读取作用域C中的变量b，返回值会受到前面write操作的影响。

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

### 闭包哇哈哈

从上面的例子中，我们可以看到，有相同祖先作用域的不同函数之间，是能够共享这个祖先作用域的。 而实际上，同一的函数（Javascript 是词法作用域，嗯，这个词有点高大上，通俗来说，Javascript的作用域是静态的，一个函数在声明时，就决定了这个函数在被调用执行时的父级以及祖先作用域）。

如果更加深入一步，从Javascript的语言实现来看（只是为了更好的理解概念，工程应用中不会有直接接触），每一个函数在声明时，都有一个[[scope]]语言内部属性，该属性是一个链式结构，每个节点即一个作用域（在程序实现中也称为 变量对象 或 全局对象）。链式结构的顺序以函数所在作用域为起点，以全局作用域为终点。

函数在调用执行时，当前执行环境的作用域链基于下面方法生成：以当前激活的变量对象作为一个作用域（作用域中还有 arguments 和 this， 但是由于同名变量的作用域屏蔽效应，我们无法直接访问祖先作用域中的 arguments 和 this），将该作用域作为作用域链的起点，后面的作用域链接到该函数的[[scope]]属性，由此产生完整的作用域链。

有了上面的基础之后，解释闭包就更加简单了。

广义的闭包是指拥有词法作用域特性的作用域构建者。在Javascript中，就是函数，因为函数拥有词法作用域，并且本身也能产生作用域（其实有些等同于产生执行上下文，但是 with 你懂得，不产生新的执行上下文，但是能临时产生作用域）。

狭义的闭包，也就是我们常常说的闭包，就是指在函数内部的函数。 因为在Javascript中，函数作为一等公民，与变量有同等的地位， 因此一个函数做被作为函数的返回值。 此时，被返回的函数，拥有对该函数声明时所在作用域的访问权限，程序只能通过函数方式来访问这些作用域，而无法直接访问。这就是闭包的作用，提供对某些隐私作用域的访问权限，由此实现隐私数据的管理和共享行为。

## Javascript怎么实现继承

### 怎么来继承

简单而言，基础的继承实现就是原型式继承，然后是 all-in-ones 的继承方式（复制也是一种all-in-ones，mixin也是一种，函数借用也是一种）

### 原型（构造函数）

Javascript最为原始的继承方式，就是原型式继承。

在Javascript中，一个函数被定义时，Javascript的语言机制会自动给该函数增加一个 protype 属性， prototype属性初始化是一个Object实例，默认有一个属性 constructor, 是对该函数的引用。

```javascript
function A() {}

console.dir(A.prototype);                       // {constructor: A}
console.log(A.prototype.constructor === A);     // true
``` 

开发者可以通过 new 操作符创建一个对象实例，此时该函数A被称为`构造函数`。在通过 new A() 创建对象实例a时，基于Javascript语言机制，会自动在a上关联一个[[prototype]]属性（引擎实现时一般使用的是 \__proto__ 属性），该属性指向当前构造函数 prototyoe 属性所引用的对象。

```javascript
var a = new A();

console.dir(a);     // { __proto__: A.prototype }
```

在Javascript中，将对象[[prototype]]属性所引用的对象，定义为对象的`原型`。对象的原型由构造函数的prototype 确定。

### 原型的作用

既然通过new 操作符创建的对象都有一个 \__proto__ 语言私有属性，那么，这个属性在Javascript语言有什么的作用呢？

原型的作用，在某种程度上与作用域的作用有些类似。 当开发者去访问（读取操作）对象上的属性时，Javascript首先在对象上查找是否存在同名属性，如果未能发现，这个时候会进入的 \__proto__ 所引用的对象上去查找同名属性（property find solution）。当然，开发者对在原型的属性仅仅访问权限，而没有其他权限，而作用域还拥有写入权限。

```javascript
function A(){}
A.prototype.test = "aa";

var a = new A();
console.log(a.test);    // aa
consolo.dir(a); 
// { __proto__: {constructor: A; test: "aa"; __proto__: Object.prototype} }
```

由于所有通过 new A() 方式构造出来的对象都拥有对 A.prototype 的访问权限。 开发者就可以将对象的公共属性和方法（一般是方法居多，属性一般是做 override 使用）存放在 A.prototype 中，这样每个实例对象都可以访问这些属性和方法，从而实现继承。

### this

我日，这个就先跳过了。发现内容太多了。

### 原型链

有点像作用域链，属性（方法）的查询过程是一个递归查找原型链的过程。

### override 重载（一直不知道重载是神马意思）

基于原型链的屏蔽效应。与作用域不同的地方是，作用域的屏蔽效应是不可恢复的（因为没有对函数变量对象的删除权限，这个权限是Javascript内部的），原型链的屏蔽效应是能一定程度恢复的。

```javascript
function A(){}
A.prototype.test = "aa";

var a = new A();
a.test = "bb";          // 增加屏蔽
console.log(a.test);    // bb
delete a.test;          // 消除屏蔽
console.log(a.test);    // aa
```

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