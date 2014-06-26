# sublime 插件集中地

## 1. 格式化

### HTML Beautify

HTML 格式化

### CSS Format

支持三种格式的CSS格式化，支持 `展开模式`、`单行模式`、`压缩模式` 三种

![CSS Format 的功能示意图](http://ww1.sinaimg.cn/large/67157d58gw1eh496txuv3j20q40afgmw.jpg)

### JSFormat
   
Javascript 代码格式化，快捷键 **`Ctrl` + `Alt` + `F`**

![Javascript 代码格式化的图片](https://camo.githubusercontent.com/cc50e7fce68d91f05cc3335d40c8b26aa0d892c8/687474703a2f2f6d312e696d672e73726364642e636f6d2f6661726d342f642f323031322f313130352f31352f41353136384334423742313137414231334234463039303337454545443642435f423530305f3930305f3530305f3132372e4a504547)



### Pretty JSON

格式化JSON

![](https://camo.githubusercontent.com/d4e0ca9dcbf2a3d4b3b84419417afe3f84a67b0c/687474703a2f2f6d332e696d672e73726364642e636f6d2f6661726d342f642f323031322f313130352f31362f31364139314432323542463333314537373135303242363837313031423143455f423530305f3930305f3530305f3135312e4a504547)

### Alignment 

代码对齐，目前必须使用快捷键操作。

文档：

 * http://wbond.net/sublime_packages/alignment

功能：

 * 垂直方向的行对齐
 * mid-line 垂直方向对齐，可以设置字符，比如 `:` 、`=`
 * 设置是否确保有一个空格在 mid-line 字符前

![Alignment 的功能示意图](http://ww2.sinaimg.cn/large/67157d58gw1eh49f1zctdj20bb06kglx.jpg)


## 2. 高亮 和 自动提示

### HTML5

HTML5 语法高亮 和 提示

### Emmet

zen Coding，革命性的工具

### LESS

LESS 语法高亮

https://sublime.wbond.net/packages/LESS

### CSS3_Syntax 

CSS3语法高亮，提升开发顺畅度。

https://github.com/i-akhmadullin/Sublime-CSS3

### Bracket Highlighter

Bracket Highlighter matches a variety of brackets such as: `[]`, `()`, `{}`, `""`, `''`, `<tag></tag>`, and even custom brackets.

https://sublime.wbond.net/packages/BracketHighlighter

### jQuery

jquery API 提示，利于快速开发

![](https://camo.githubusercontent.com/e4b552306ef96c9a06d851f446f9d3b8f4f2634e/687474703a2f2f7777322e73696e61696d672e636e2f6d773639302f3637313537643538677731656832366c64627437616a323067663034673734692e6a7067)

## 3. 代码校验

### SublimeLinter

支持lint语法，可以高亮linter认为有错误的代码行，也支持高亮一些特别的注释，比如 `TODO`，这样就可以被快速定位。

**`ctrl` + `alt` + `l`**

https://sublime.wbond.net/packages/SublimeLinter

## 4. 杂项

### Clipboard History

粘贴板历史记录，方便使用复制/剪切的内容。

### Nettuts Fetch

Nettuts Fetch可以让你设置一些需要同步的文件列表，然后保存更新。

![](http://www.qianduan.net/wp-content/uploads/2012/02/remote.jpg)

### ConvertToUTF8

快捷键 **`Ctrl` + `Shift` + `C`**

### CanIUse

兼容性权威指南

![兼容性权威指南](http://static.oschina.net/uploads/img/201402/05081908_kT29.gif)

### DocBlockr

用来写注释的神器，基于 jsdoc 规范

### DevDocs

文档权威指南

### CSScomb

CSS 属性排序

### SideBarEnhancements

SideBarEnhancements 本是增强侧边栏插件，这里将教大家如何用来做st3的浏览器预览插件，并可自定义浏览器预览的快捷键。

安装此插件，点击工具栏的 `preferences > package setting > side bar > Key Building-User`，键入以下代码，这里设置按 `Ctrl+Shift+C` 复制文件路径，按F1~F5分别在firefox，chrome，IE，safari，opera浏览器预览效果，注意代码中的浏览器路径要以自己电脑里的文件路径为准。

```javascript
[
    { "keys": ["ctrl+shift+c"], "command": "copy_path" },
    //firefox
    { 
        "keys": ["f1"], 
        "command": "side_bar_files_open_with",
        "args": {
            "paths": [],
            "application": "C:\\software\\Browser\\Mozilla Firefox\\firefox.exe",
            "extensions":".*" //匹配任何文件类型
        }
    },
    //chrome
    { 
        "keys": ["f2"], 
        "command": "side_bar_files_open_with",
        "args": {
            "paths": [],
            "application": "C:\\Users\\Mr.DenGo\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
            "extensions":".*"
        }
     }
]
```

### TrailingSpacer

高亮显示多余的空格和Tab，并可以一键删除它们。

![](http://img1.tuicool.com/VVfaqq.jpg)

注意，在github上下载的插件缺少了一个设置快捷键的文件，可以新建一个名字和后缀为`Default (Windows).sublime-keymap`的文件，添加以下代码。

```javascript
[
    { "keys": ["ctrl+alt+d"], "command": "delete_trailing_spaces" },
    { "keys": ["ctrl+alt+o"], "command": "toggle_trailing_spaces" }
]
```

参考：

 * [1 巴拉巴拉](http://www.jb51.net/web/79855.html)
 * [2 巴拉巴拉](http://www.oschina.net/translate/20-powerful-sublimetext-plugins?from=20140210)
 * [3 巴拉巴拉](http://www.tuicool.com/articles/qEFJrm)