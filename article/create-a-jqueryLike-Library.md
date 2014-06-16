# 如何创建一个Javascript库

> 原文：[Build Your First JavaScript Library](http://code.tutsplus.com/tutorials/build-your-first-javascript-library--net-26796)
> 进行了修改和精简，用于自我学习

## step 1: Creating the Library Boilerplate

我们以一个结构体开始，它展示了我们库的意图。

```javascript
/*
 * 模块化结构，所有 API 都挂载 dome 命名空间上
 */
window.dome = (function () {
    // 构造函数，将我们选中或创建的 DOM 元素封装成实例对象
    function Dome (els) {
    }
        
    var dome = {
        // 从 DOM 树中选择元素，返回 Dome 实例
        get: function (selector) {}
    };
        
    return dome;
    
}());
```

## step 2: 获取元素

`dome.get()` 传入一个参数，可以是字符串，也可以是 DOM 节点或 NodeList。

```javascript
/*
 * 选择 DOM 元素
 *
 * @namespace   dome.get(selector)
 * @param       {string|Node|NodeList}  selector
 * @return      {Dome}
 */
get: function (selector) {
    var els;
    
    if (typeof selector === "string") {     // selector
        els = document.querySelectorAll(selector);
    } else if (selector.length) {           // NodeList
        els = selector;
    } else {                                // Node
        els = [selector];
    }
    
    // els is a ArrayLike Object
    // the Dome constructor returns a Dome instance
    return new Dome(els);
}
```

## step 3: Dome 构造函数

```javascript
/*
 * Dome 构造函数，将 DOM 元素的集合构造成类的实例
 * Dome 实例是一个类数组对象，在该实例上拓展了许多原型方法
 *
 * @param       {ArrayLike.<Node>}      els
 * @return      {Dome}
 */
function Dome (els) {

    for (var i = 0; i < els.length; i++ ) {
            this[i] = els[i];
    }
    
    this.length = els.length;
}
```

## step 4: 添加工具函数

```javascript
/*
 * 工具函数 map
 *
 * @namespace   Dome#map(callback(item, index): newItem) 
 * @param       {callback(item, index): any}    callback
 * @return      {Array.<any>}
 */
Dome.prototype.map = function (callback) {
    var results = [];
    
    for (i = 0; i < this.length; i++) {
        results.push(callback.call(this, this[i], i));
    }
    
    return results;
};

/*
 * 工具函数 forEach
 *
 * @namespace   Dome#forEach(callback(item, index)) 
 * @param       {callback(item, index)}         callback
 * @return      {Dome}
 */
Dome.prototype.forEach(callback) {
    this.map(callback);
    return this;
};

/*
 * 工具函数 mapOne
 *
 * @namespace   Dome#mapOne(callback(item, index)) 
 * @param       {callback(item, index): any}    callback
 * @return      {any|Array.<any>}               
 */
Dome.prototype.mapOne = function (callback) {
    var mapArray = this.map(callback);
    return mapArray.length > 1 ? mapArray : mapArray[0];
};
```

## step 5: 处理文本 和 HTML

```javascript
/*
 * 操作 innerText 和 innerHTML
 *
 * @namespace   Dome#text()
 *
 * @profile     Dome#text(text)
 * @param       {string}        text
 * @return      {Dome}                         
 *
 * @profile     Dome#text()
 * @return      {string|Array.<string>}               
 */
Dome.prototype.text = function (text) {
    if (typeof text !== "undefined") {
        return this.forEach(function (el) {
            el.innerText = text;
        });
    } else {
        return this.mapOne(function (el) {
            return el.innerText;
        });
    }
};

// 省略
Dome.prototype.html = function (html) {};
```

## step 6: 调整样式

```javascript
/*
 * 增加 HTML 元素的 Class
 *
 * @namespace   Dome#addClass(classes)
 * @param       {string|Array.<string>}         classes
 * @return      {Dome}                         
 */
Dome.prototype.addClass = function (classes) {
    var className = "";
    
    if (typeof classes !== "string") {
        for (var i = 0; i < classes.length; i++) {
            className += " " + classes[i];
        }
    } else {
        className = " " + classes;
    }
    
    return this.forEach(function (el) {
        el.className += className;
    });
};

/*
 * 删除 HTML 元素的 Class
 * 为了简单，一次只能删除一个样式
 *
 * @namespace   Dome#removeClass(clazz)
 * @param       {string}         clazz
 * @return      {Dome}                         
 */
Dome.prototype.removeClass = function (clazz) {
    return this.forEach(function (el) {
        var classNames = el.className.split(" "),
            i;
            
        while ((i = classNames.indexOf(clazz)) > -1) {
            classNames.splice(i, 1)
        }
        
        el.className = classNames.join(" ");
    });
};
```

## step 7: Dome#attr()

```javascript
// 省略
Dome.prototype.attr = function (attr, val) {};
```
　
## step 8: 创建 DOM 元素

```javascript
var dome = {
    // 创建 DOM 元素，返回值为 Dome 实例
    create: function (tagName, attrs) {}
};
```

```javascript
/*
 * 创建 HTML 元素
 *
 * @namespace   dome.create(tagName, attrs)
 * @param       {string}        tagName
 * @param       {Object}        attrs
 * @return      {Dome}                         
 */
create: function (tagName, attrs) {
    var el = new Dome([document.createElement(tagName)]);
    
    if (attrs) {
        // special case 1
        if (attrs.className) {
            el.addClass(attrs.className);
            delete attrs.className;
        }
        
        // special case 2
        if (attrs.text) {
            el.text(attrs.text);
            delete attrs.text;
        }
        
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.attr(key, attrs[key]);
            }
        }
    }
    
    return el;
}
```

## step 9: 将 DOM元素 添加至 DOM 树

```javascript
// 简单思路
Dome.prototype.append = function (els) {
    this.forEach(function (parEl, i) {
        els.forEach(function (childEl) {
        });
    });
};
```

如果我们需要将 `els` 添加到多个元素内，我们需要克隆它们。
　　
```javascript
/* 
 * 添加 DOM 元素至 DOM 树
 * 
 * @namespace   Dome#append(elems)
 * @native      Element#appendChild
 * @native      Element#cloneNode
 * @param       {Dome}          elems       要添加的 Dome 实例
 * @return      {Dome}          Dome 实例
 */
Dome.prototype.append = function (els) {
    return this.forEach(function (parEl, i) {
        els.forEach(function (childEl) {
            if (i > 0) {
                childEl = childEl.cloneNode(true);
            }
            parEl.appendChild(childEl);
        });
    });
};
```

## step 10: 移除节点

```javascript
/* 
 * 移除 DOM 节点
 * 
 * @namespace Dome#remove()
 * @return      {Dome}          Dome 实例
 */
Dome.prototype.remove = function () {
    return this.forEach(function (el) {
        return el.parentNode.removeChild(el);
    });
};
```

## step 11: 处理事件

```javascript
/* 
 * 事件绑定
 * 
 * @namespace   Dome#on(evtName, func)
 * @native      Element#addEventListener
 * @native      Element#attachEvent
 * @param       {string}        evtName     事件类型
 * @param       {function(evt)} func        事件处理函数
 * @return      {Dome}          Dome 实例
 */
Dome.prototype.on = (function () {
    if (document.addEventListener) {
        // 高阶的立即执行函数
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.addEventListener(evt, fn, false);
            });
        };
    } else if (document.attachEvent)  {
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.attachEvent("on" + evt, fn);
            });
        };
    }
}());
```

```javascript
/* 
 * 事件解除绑定
 * 
 * @namespace   Dome#off(evtName, func)
 * @native      Element#removeEventListener
 * @native      Element#detachEvent
 * @param       {string}        evtName     事件类型
 * @param       {function(evt)} func        事件处理函数
 * @return      {Dome}          Dome 实例
 */
Dome.prototype.off = (function () {
    if (document.removeEventListener) {
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.removeEventListener(evt, fn, false);
            });
        };
    } else if (document.detachEvent)  {
        return function (evt, fn) {
            return this.forEach(function (el) {
                el.detachEvent("on" + evt, fn);
            });
        };
    }
}());
```