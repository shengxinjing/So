## 命名

### 语义

命名同时还需要关注语义，如：

- 变量名 *应当(SHOULD)* 使用名词
- **boolean**类型的 *应当(SHOULD)* 使用**is**、**has**等起头，表示其类型
- 函数名 *应当(SHOULD)* 用动宾短语
- 类名 *应当(SHOULD)* 用名词

## 注释

良好的注释有利于代码阅读和自文档化，以下内容 *必须(MUST)* 包含以/\*\*开头和*/结尾的块注释，便于自文档化：

1. 文件
2. namespace
3. 类
4. 函数或方法
5. 类属性
6. 事件
7. 全局变量
8. 常量

自文档化的文档 *必须(MUST)* 说明what，而不是how。


### 类型定义

所有的类型定义都是以`{`开始, 以`}`结束，例如: {string}, {number}, {boolean}, {Object}, {Function}, {RegExp}, {Array}, {Date}。不仅仅局限于内置的类型，也可以是自定义的类型。比如定义了一个类`Person`，就可以使用它来定义一个参数和返回值的类型。

注意：对于基本类型{string}, {number}, {boolean}，首字母 *必须(MUST)* 小写。

<table>
    <thead>
        <tr>
            <td bgcolor="eeeeee">类型定义</th>
            <td bgcolor="eeeeee">语法示例</th>
            <td bgcolor="eeeeee">解释</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>原生类型</td>
            <td>String => {string}<br>Number => {number}<br>Boolean => {boolean}<br>Object => {Object}<br>Function => {Function}<br>RegExp => {RegExp}<br>Array => {Array}<br>Date => {Date}<br>...</td>
            <td>--</td>
        </tr>
        <tr>
            <td>单一类型集合</td>
            <td>{Array.&lt;string&gt;}</td>
            <td>string类型的数组</td>
        </tr>
        <tr>
            <td>多类型</td>
            <td>{(number｜boolean)}</td>
            <td>可能是number类型, 也可能是boolean类型</td>
        </tr>
        <tr>
            <td>允许为null</td>
            <td>{?number}</td>
            <td>可能是number, 也可能是null</td>
        </tr>
        <tr>
            <td>不允许为null</td>
            <td>{!Object}</td>
            <td>Object类型, 但不是null</td>
        </tr>
        <tr>
            <td>Function类型</td>
            <td>{function(number, boolean)}</td>
            <td>函数, 形参类型</td>
        </tr>
        <tr>
            <td>Function带返回值</td>
            <td>{function(number, boolean):string}</td>
            <td>函数, 形参, 返回值类型</td>
        </tr>
        <tr>
            <td>参数可选</td>
            <td>@param {string=} opt_name</td>
            <td>可选参数, =为类型后缀, opt_为形参前缀</td>
        </tr>
        <tr>
            <td>可变参数</td>
            <td>@param {...number} var_args</td>
            <td>变长参数,  ...为类型前缀, var_args为形参名</td>
        </tr>
        <tr>
            <td>任意类型</td>
            <td>{*}</td>
            <td>任意类型
                <br>@param {...*} var_args
                <br>@param {*=} opt_name
            </td>
        </tr>
    </tbody>
</table>


### 文件注释

文件 *必须(MUST)* 包含文件注释，文件注释 *必须(MUST)* 包含文件说明和开发者信息。文件说明用@file标识，开发者信息用@author标识。注释 *必须(MUST)* 以`/**`开始, 以`*/`结束。

推荐采用如下的文件注释（可以在自己的编辑器中配置模板文件）：

```javascript
/**
 * @file Describe the file
 * @author leeight(liyubei@baidu.com)
 */

// 这里是文件的内容
```

### 命名空间注释

命名空间 *必须(MUST)* 使用@namespace标识。

```javascript
/**
 * @namespace
 */
var baidu = {};
```

### 类注释

*必须(MUST)* 使用@constructor在类的构造函数上做标记。当类说明和构造函数说明需要区分时， *可以(SHOULD)* 使用@class进行类说明。

```javascript
/**
 * 描述
 *
 * @constructor
 */
function Person() {
    // constructor body
}
```

*必须(MUST)* 使用@extends标记类的继承信息。

```javascript
/**
 * 描述
 *
 * @constructor
 * @extends Person
 */
function Baiduer() {
    Person.call(this);
    // constructor body
}
baidu.inherits(Baiduer, Person);
```

使用包装方式扩展类成员时， *必须(MUST)* 通过@lends进行重新指向。

```javascript
/**
 * 类描述
 *
 * @constructor
 * @extends Person
 */
function Baiduer() {
    Person.call(this);
    // constructor body
}

baidu.extend(
    Baiduer.prototype, 
    /** @lends Baiduer.prototype */{
        _getLevel: function() {
            // TODO
        }
    }
);
```



类的属性或方法等成员信息 *必须(MUST)* 使用@public/@protected/@private中的任意一个，指明可访问性。

```javascript
/**
 * 类描述
 *
 * @constructor
 * @extends Person
 */
function Baiduer() {
    Person.call(this);

    /**
     * 属性描述
     * 
     * @type {string}
     * @private
     */
    this._level = 'T11';

    // constructor body
}
baidu.inherits(Baiduer, Person);

/**
 * 方法描述
 * 
 * @private
 * @return {string} 返回值描述
 */
Baiduer.prototype._getLevel = function() {
};
```


### 函数/方法注释

函数/方法注释 *必须(MUST)* 包含函数说明、参数和返回值。

参数和返回值注释 *必须(MUST)* 包含类型信息和说明。

如果形参是可选参数， *可以(SHALL)* 使用`opt_`为前缀。

```javascript
/**
 * 函数描述
 *
 * @param {string} p1 参数1的说明
 * @param {string} p2 参数2的说明，比较长
 * 那就换行了.
 * @param {number=} opt_p3 参数3的说明（可选）
 * @return {Object} 返回值描述
 */
function foo(p1, p2, opt_p3) {
    var p3 = opt_p3 || 10;
    return {
        p1 : p1,
        p2 : p2,
        p3 : p3
    };
}
```

对Object中各项的描述， *必须(MUST)* 使用@param， *不得(MUST NOT)* 使用@config。@config只能描述参数的直接1层属性。

```javascript
/**
 * 函数描述
 *
 * @param {Object} option 参数描述
 * @param {string} option.url option项描述
 * @param {string=} option.method option项描述，可选参数
 */
function foo(option) {
    // TODO
}
```

重写父类方法时， *应当(SHOULD)* 添加@override标识。

### 事件注释

*必须(MUST)* 用@event标识事件，事件参数的标识与方法描述的参数标识一样。

```javascript
/**
 * 值变更时触发
 *
 * @event
 * @param {Object} e e描述
 * @param {string} e.before before描述
 * @param {string} e.after after描述
 */
onchange: function (e) {
}
```

如果不带占位函数的事件， *可以(SHOULD)* 在fire时或构造函数中进行事件标识。此时 *必须(MUST)* 明确指定事件所属。

```javascript
Select.prototype.clickHandler = function () {
    /**
     * 值变更时触发
     *
     * @event Select#change
     * @param {Object} e e描述
     * @param {string} e.before before描述
     * @param {string} e.after after描述
     */
    this.fire('change', {...});
};
```

### 全局变量注释

全局变量 *必须(MUST)* 包含注释。全局变量注释 *必须(MUST)* 包含说明和类型信息。

```javascript
/**
 * 全局变量说明
 * 
 * @type {number}
 */
var currentStep = 1;
```

### 常量注释

常量 *必须(MUST)* 包含注释,且 *必须(MUST)* 使用@const标记，并包含说明和类型信息。

```javascript
/**
 * 常量说明
 *  
 * @const
 * @type {string}
 */
var REQUEST_URL = 'myurl.do';
```

### 细节注释

对于内部实现、不容易理解的逻辑说明、摘要信息等，我们可能需要编写细节注释。

细节注释 *必须(MUST)* 使用单行注释的//形式，并且在//后 *必须(MUST)* 跟一个空格。说明必须换行时，每行是一个单行注释的起始。

```javascript
function foo(p1, p2, opt_p3) {
    // 这里对具体内部逻辑进行说明
    // 说明太长需要换行
    for (...) {
        ....
    }
}
```

有时我们会使用一些特殊标记进行说明。特殊标记 *必须(MUST)* 使用单行注释的形式。下面列举了一些常用标记：

1. TODO: 有功能待实现。此时需要对将要实现的功能进行简单说明。
2. FIXME: 该处代码运行没问题，但可能由于时间赶或者其他原因，需要修正。此时需要对如何修正进行简单说明。
3. HACK: 为修正某些问题而写的不太好或者使用了某些诡异手段的代码。此时需要对思路或诡异手段进行描述。
4. XXX: 该处存在陷阱。此时需要对陷阱进行描述。


## 其它

#### `eval`和`with`

当代码中使用`eval`或`with`时，该代码必须由一个同级别工程师和一个高级别工程师进行Review。

## 参考

1. <https://developers.google.com/closure/compiler/docs/js-for-compiler#types>
2. <http://usejsdoc.org/>
3. <http://www.oracle.com/technetwork/java/codeconv-138413.html>
4. <http://www.gnu.org/prep/standards/standards.html>
