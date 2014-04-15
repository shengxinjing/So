# Webapp 开发 —— CSS.webkit篇

## 1. -webkit-tap-highlight-color: color

禁用IOS系统下的点击反馈效果。

Overrides the highlight color shown when the user taps a link or a JavaScript clickable element in Safari on iOS.

This property obeys the alpha value, if specified. If you don’t specify an alpha value, Safari on iOS applies a default alpha value to the color. To disable tap highlighting, set the alpha value to 0 (invisible). If you set the alpha value to 1.0 (opaque), the element is not visible when tapped.

## 2. -webkit-touch-callout: none

避免用户长久按住一个元素时，调起上下文菜单。比如长按链接 `<a>`, 或长按图片 `<img>`。 

Disables the default callout shown when you touch and hold a touch target.

**Syntax**
-webkit-touch-callout: behavior;

On iOS, when you touch and hold a touch target such as a link, Safari displays a callout containing information about the link. This property allows you to disable that callout. The current allowable values are none and inherit.

## 3. -webkit-overflow-scrolling: touch

指定一个溢出时滚动的元素能够通过 touchmove 方式滚动。

Specifies whether to use native-style scrolling in an overflow:scroll element.

**Syntax**
-webkit-overflow-scrolling: value

**Constants**

> **auto** 
> One finger scrolling without momentum. 
> 
> **touch** 
> Native-style scrolling. Specifying this style has the effect of creating a stacking context (like opacity, masks, and transforms).

## 4. -webkit-user-select: none

禁止用户选择文本，常用于避免用户不小心操作调起文本选择功能。

Determines whether a user can select the content of an element.

## 5. -webkit-text-size-adjust: none

避免移动端旋转屏幕时，进行字体大小缩放。以真实的font-size 进行渲染。

Specifies a size adjustment for displaying text content in Safari on iOS.

## 6. -webkit-backface-visibility: hidden

用于解决 `transform` 的屏幕闪屏问题。

Determines whether or not a transformed element is visible when it is not facing the screen.(setting the element's rotateY between 90deg and 270deg will make it invisible if the value is hidden);

## 7. -webkit-image-set(url(low.png) 1x, url(hi.jpg) 2x)

iOS6+
