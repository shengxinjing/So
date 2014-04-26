# 两个视口

## 可视视口  和  布局视口

布局视口是页面文档进行布局的视口（比如IOS系统下默认的布局视口宽度为980px），而可视视口是可缩放的，可滚动的（默认情况下默认的可视视口宽度与布局视口宽度相等，此时页面缩放比不为1，是页面缩小而使得视口区域信息更多）。用户进行缩放时，产生缩放效果的仅仅是可视视口，布局视口是不会进行处理的。

**度量 布局视口**

```javascript
document.documentElement.clientWidth
document.documentElement.clientHeight
```

在PC端，只有一个视口。
document.documentElement.clientWidth 即视口宽度（与window.innerWidth 相差一个滚动条的宽度，如果有滚动条的话）。

**度量 可视视口**

```javascript
window.innerWidth       //移动端滚动条没有宽度
```

**改变移动浏览器上的布局视口**

```html
<meta name="viewport" content="initial-scale=1.0,user-scalable=no" />
```

initial-scale=1.0 表示布局视口与理想可视视口（ideal）的比值, 比如Iphone 4/5 的理想可视视口为 320(640 / 2)。