# CSSOM View Module

## Window Interface

**innerWidth/Height**
视口`viewport`大小, 含滚动条。

outerWidth/Height
浏览器窗口的大小，几乎不用

**pageXOffset和pageYOffset**   
视口中整个文档 `document` 滚动值

screenX and screenY
浏览器在显示器中的位置。

## Screen Interface

availWidth和availHeight
显示器可用宽高，不包括任务栏之类。

colorDepth (同名属性 pixelDepth)
表示显示器的颜色深度。一般来说就是 32位。

width和height
表示显示器屏幕的宽高。

## Document Interface

**elementFromPoint(x, y)**
返回给定坐标处所在的元素。通过模拟点击动作获得该元素，相对于 viewport。

## Element Interface

**getBoundingClientRect()**
元素 `border-edge` 相对于 `viewport` 的定位信息, 返回拥有 left、top、right、bottom 属性的对象。

getClientRects()
元素所包含的所有 `inline box` 的 `border egde` 相对于`viewport`的定位信息，返回类数组结构。

clientLeft 和 clientTop     
元素 `border edge` 和 `padding edge` 间的距离，一般而言即 `border-width`，有滚定条时增加滚动条的宽度，几乎不用。

**clientWidth和clientHeight**
`padding edge`，但需去除其中的滚动条宽度（如果存在的话）。

**scrollLeft和scrollTop**
元素的滚动距离信息，该元素有滚动条时才有意义。

**scrollWidth和scrollHeight**
元素 `padding edge` 的实际宽高，有滚动条时有特殊行为。

## HTMLElement Interface

**offsetParent**
The computed value of the `position` property is not static 
*OR* the HTML `body` element.

**offsetLeft 和 offsetTop**
元素相对于 offsetParent 的偏移值, 基准为 offsetParent的 `padding edge` 和元素的 `border edge`。

**offsetWidth和offsetHeight**
元素的 `border box` 尺寸，含滚动条。

## MouseEvent Interface

**clientX, clientY**
鼠标相对视口 `viewport` 的坐标。

**offsetX, offsetY**
鼠标相对于当前被点击元素(e.target) `padding edge` 的偏移值。

**pageX, pageY**
鼠标相对于文档 `document` 的坐标。

screenX, screenY
鼠标相对于显示器屏幕的坐标。

see: [w3c 文档](http://www.w3.org/TR/cssom-view/)
