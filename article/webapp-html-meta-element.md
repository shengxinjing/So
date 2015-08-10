# Webapp 开发 —— Meta篇

## 1、viewport

视口（布局视口）属性

```html
<meta name="viewport" content="property1=value,property2=value" />
```

<table>
    <thead>
        <tr>
            <th>属性</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>width</td>
            <td>The width of the viewport in pixels. The default is 980. value `device-width`: The width of the device in pixels.</td>
        </tr>
        <tr>
            <td>height</td>
            <td>The height of the viewport in pixels. The default is calculated based on the value of the width property and the aspect ratio of the device. value `device-height`: The height of the device in pixels.</td>
        </tr>
        <tr>
            <td>initial-scale</td>
            <td>The initial scale of the viewport as a multiplier(乘数). The default is calculated to fit the webpage in the visible area. The range is determined by the minimum-scale and maximum-scale properties.You can set only the initial scale of the viewport—the scale of the viewport the first time the webpage is displayed. Thereafter, the user can zoom in and out unless you set user-scalable to `no`. Zooming by the user is also limited by the minimum-scale and maximum-scale properties.</td>
        </tr>
        <tr>
            <td>minimum-scale</td>
            <td>Specifies the minimum scale value of the viewport. The default is 0.25. The range is from >0 to 10.0.</td>
        </tr>
        <tr>
            <td>maximum-scale</td>
            <td>Specifies the maximum scale value of the viewport. The default is 5.0. The range is from >0 to 10.0.</td>
        </tr>  
        <tr>
            <td>user-scalable</td>
            <td>Determines whether or not the user can zoom in and out. The default is yes.</td>
        </tr>
    </tbody>
    <tfoot></tfoot>
</table>

建议写法(只需设置initial-scale即可，省略 width=device-width，因为iphone5 有Bug)：

```html
<meta name="viewport" content="initial-scale=1.0,user-scalable=no" /> 
```
> see more:  
> 1、http://www.quirksmode.org/mobile/metaviewport/
> 2、http://bigc.at/ios-webapp-viewport-meta.orz

## 2.format-detection

特殊格式监听

```html
<meta name="format-detection" content="telephone=no" />
```

 - telephone(default=yes)  调起拨号界面
 - email(default=yes)      调起用户邮箱
 - adress(default=yes)     调起系统地图

## 3.apple-mobile-web-app-capable(For IOS)

IOS中，webapp有两种状态，一种是浏览器中的 usual 态，还有一种是 Home Page 上打开的 webapp 态。
apple-mobile-web-app-capables 指定了，发送至桌面的webapp打开时是否全屏(standalone)。webapp全屏时，会隐藏头部地址栏和底部状态栏，且此时可定义顶部的状态条样式。

```html
<meta name="apple-mobile-web-app-capable" content="yes" >
```

> see more:  
>   1、http://stanislav.it/how-to-prevent-ios-standalone-mode-web-apps-from-opening-links-in-safari/
>   2、https://gist.github.com/kylebarrow/1042026

## 4.apple-mobile-web-app-status-bar-style(For IOS)

This meta tag has no effect unless you first specify full-screen mode as described in “apple-mobile-web-app-capable.”

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black" >
```

If content is set to `default`, the status bar appears normal. If set to `black`, the status bar has a black background. If set to `black-translucent`, the status bar is black and translucent. If set to default or black, the web content is displayed below the status bar. If set to black-translucent, the web content is displayed on the entire screen, partially obscured by the status bar.

> see more: https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html#//apple_ref/doc/uid/TP40008193-SW2

## 5.Home Page Icon(For IOS)

把网站 `添加至主屏幕` 时，使用apple-touch-icon和apple-touch-icon-precomposed指定图片地址。两者区别是：使用apple-touch-icon属性会 `增加透明高光层的图标`; 使用apple-touch-icon-precomposed 时使用 `设计原图图标`。二选一即可。

```html
<link 
    rel="apple-touch-icon"
    sizes="120x120"
    href="/static/images/apple-touch-icon-120x120.png" />
<link 
    rel="apple-touch-icon-precomposed" 
    sizes="57x57" 
    href="/static/global/logo.png" />
```

> see more: https://gist.github.com/tfausak/2222823

## 6.Webapp Startup Images

webapp 启动图片

```html
<link 
    rel="apple-touch-startup-image"
    href="/static/images/apple-touch-startup-image-640x1096.png"
    media="(device-width: 320px) and (device-height: 568px)
        and (-webkit-device-pixel-ratio: 2)">
        
<link 
    rel="apple-touch-startup-image"
    href="/static/images/apple-touch-startup-image-640x920.png"
    media="(device-width: 320px) and (device-height: 480px)
        and (-webkit-device-pixel-ratio: 2)">
```

> see more: https://gist.github.com/tfausak/2222823


