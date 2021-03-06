# sublime 插件集中地

## 1. 格式化

### HTML Beautify

### CSS Format

### JSFormat
   
Javascript 代码格式化，快捷键 **`Ctrl` + `Alt` + `F`**

### Pretty JSON

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

### CSS3

CSS3 属性识别

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

### all Autocomplete

在当前打开的文件中完成自动匹配，扩展 sublime 原生的 atuocomplete

### AutoFileName

文件路径和文件名自动补全

### nodejs

nodejs 代码自动提示

## 3. 代码校验

### SublimeLinter

支持lint语法，可以高亮linter认为有错误的代码行，也支持高亮一些特别的注释，比如 `TODO`，这样就可以被快速定位。

**`ctrl` + `alt` + `l`**

https://sublime.wbond.net/packages/SublimeLinter

## 4. 杂项

### Clipboard History

粘贴板历史记录，方便使用复制/剪切的内容。

### ConvertToUTF8

快捷键 **`Ctrl` + `Shift` + `C`**

`https://github.com/seanliang/Codecs33`，由于 Sublime Text 3 内嵌的 Python 限制，ConvertToUTF8 可能无法正常工作。你可以安装本插件来解决这一问题。

### DocBlockr

用来写注释的神器，基于 jsdoc 规范

### CSScomb

CSS 属性排序

### SideBarEnhancements

SideBarEnhancements 增强侧边栏

### TrailingSpacer

高亮显示多余的空格和Tab，并可以一键删除它们。

![](http://img1.tuicool.com/VVfaqq.jpg)

注意，在github上下载的插件缺少了一个设置快捷键的文件，可以新建一个名字和后缀为`Default (Windows).sublime-keymap`的文件，添加以下代码。

```
[
    { "keys": ["ctrl+alt+d"], "command": "delete_trailing_spaces" },
    { "keys": ["ctrl+alt+o"], "command": "toggle_trailing_spaces" }
]
```

### markdown Preview

参考：

 * [1 巴拉巴拉](http://www.jb51.net/web/79855.html)
 * [2 巴拉巴拉](http://www.oschina.net/translate/20-powerful-sublimetext-plugins?from=20140210)
 * [3 巴拉巴拉](http://www.tuicool.com/articles/qEFJrm)
