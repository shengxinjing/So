# 如何创建一个Javascript库

> 原文：[Build Your First JavaScript Library](http://code.tutsplus.com/tutorials/build-your-first-javascript-library--net-26796)
> 进行了精简，用于自我学习

## step 1: Creating the Library Boilerplate

我们以一个结构体开始，它展示了我们库的意图。

```
// 模块化结构，所有 API 都挂载 dome 命名空间上
window.dome = (function () {
    // 构造函数，将我们选择或创建的 DOM 封装成实例对象
    function Dome (els) {
    }
        
    // 库对外公布的 API 都挂载在 dome 上    
    var dome = {
        // 用来从 DOM 树中选择元素
        // 我们期望的返回是 Dome 实例
        get: function (selector) {
        }
    };
        
    return dome;
    
}());
```

## step 2: 获取元素

dome.get() 函数传入一个参数。它可以有好几种情况，如果它是一个字符串，我们假定它是一个CSS选择器；我们也可以传入单个 DOM 节点或是一个 NodeList。

```
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
    // the function return a Dome instance
    return new Dome(els);
}
```

## step 3: Dome 构造函数

```
function Dome (els) {

    for (var i = 0; i < els.length; i++ ) {
            this[i] = els[i];
    }
    
    this.length = els.length;
}
```

我们将 DOM 元素的集合封装为一个实例对象。由此，我们可以通过定义原型方法来集化操作这些 DOM 元素。

## step 4: 添加常用工具函数

```
// @namespace Dome#map(callback(item, index):newItem) 
Dome.prototype.map = function (callback) {
    var results = [];
    
    for (i = 0; i < this.length; i++) {
        // callback(item, index)
        results.push(callback.call(this, this[i], i));
    }
    
    return results;
};
```

```
// @namespace Dome#forEach()
Dome.prototype.forEach(callback) {
    this.map(callback);
    // support for chainning invoke
    return this;
};
```

```
// @namespace Dome#mapOne
Dome.prototype.mapOne = function (callback) {
    var mapArray = this.map(callback);
    return mapArray.length > 1 ? mapArray : mapArray[0];
};
```

## step 5: 处理文本 和 HTML

```javascript
// @namespace Dome#text
// @profile Setter Dome#text(text)
// @profile Getter Dome#text()
Dome.prototype.text = function (text) {
    // check for argument.length === 0 is more happy
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
```

```javascript
Dome.prototype.html = function (html) {
    if (typeof html !== "undefined") {
        return this.forEach(function (el) {
            el.innerHTML = html;
        });
    } else {
        return this.mapOne(function (el) {
                return el.innerHTML;
        });
    }
};
```

## step 6: 调整样式

```javascript
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
```

为了保持简单，我们只允许一次删除一个样式。

```javascript
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

## step 7: attr()

```
Dome.prototype.attr = function (attr, val) {
};
```
　
## step 8: 创建 DOM 元素

将该方法作为 Dome 实例的一个方法不是很好，我们直接把它挂到dome对象上去。

```javascript
var dome = {
    create: function (tagName, attrs) {
    }
};
```

你已经看到，我们使用两个参数：元素的名字，和属性值对象。大部分属性能过attr方法赋值，但是两种方法可以做特殊处理。我们使用addClass方法操作className属性，以及text方法操作text属性。当然，我们首先需要创建DOM元素和Dome实例。

```
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

## step 9: 附加元素到 DOM 树

dome1.append(dome2);

使用情况如下：我们可能想要append或prepend

一个新的元素到一个或多个已存在的元素

多个新元素到一个或多个已存在的元素

一个已存在的元素到一个或多个已存在的元素

多个已存在的元素到一个或多个已存在的元素

让我们一步一步来：

```
Dome.prototype.append = function (els) {
    this.forEach(function (parEl, i) {
        els.forEach(function (childEl) {
        });
    });
};
```

我们期望els参数是一个Dome对象。我们必须遍历我们每一个元素，并且在它里面，我们还要遍历每个我们需要append的元素。

如果我们将els添加到多个元素内，我们需要克隆它们。然而，我们不想在他们第一次被附加的时候克隆节点，而是随后再说。如果我们不是附加到第一个父元素，我们将克隆节点。这样，真正的节点将会放到第一个父节点中，其它父节点将获得一个拷贝。
　　
```javascript
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

```
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

```
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

```
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