# 又经历了一个月的重构。

## FIS2

这次重构项目用上了 FIS2， 瞬间就上了档次。相对 FIS1 来讲，FIS2 更强调三种能力，从设计思路到文档上，也更加成熟。

FIS2的三种能力，资源定位、资源依赖、资源嵌入。从最基本的要素来说，是基于资源定位能力，FIS在对项目文件静态编译时，通过特征标识符(`src`、`url`、`__uri`等)来识别资源路径，并通过对相对路径 或 根路径(root) 的解析去尝试定位资源。如果对应路径的资源存在。三种能力最终转换为 资源的真实路径（即定位功能，有md5、domain），资源的真实内容（即嵌入）以及 资源映射表（即依赖，静态依赖基于map.json资源依赖表，资源载入还包括资源的动态依赖）。

## 模块划分

模块划分的目的，在于将大系统各部分进行有效的隔离，降低编程关注度，提升对代码的控制能力（全局变量是有害的，对吧）。在模块内，可以有效地提升代码的复用度和维护性，维护模块内的生态系统。模块之间，能更好地梳理模块间的关系，业务模块间仅通过URL方式进行简单通信，避免其他的干扰，使得程序边界更加清晰。

同时，抽离出一个公用模块，可以给各业务模块调用，以此来解决模块间的复用问题。在公用模块中，存放开发时的基础类库、js模块管理库、基础CSS、可复用CSS，公用组件等。

## HTML 

HTML主要是指HTML母板。主要放置的内容有，HTML5 mobile 标准头部、基础CSS和JS、 错误监控脚本、性能监控脚本、数据统计脚本等。

## CSS

CSS的处理，FIS2 改用了 LESS 预处理语言。本来希望引入autoprefixer，由于时间仓促，仅仅完成了调研，并没有投入使用。

整个CSS的架构层次是, reset/normal.CSS + util.CSS + mixin.less(基础颜色 + 浏览器兼容 + 实用函数) + widget.css(限制样式的作用域，FISP自带，web components的思想) + page.css。 

目前，每个层次的细节处理还不怎么到位，比如 noraml.css 没有良好的测试覆盖和文档等，不过整体架构思路应该是正确的。

## js基础类库 和 js模块化

使用 zepto 作为我们的基础库，除核心 zepto.js 外，也引入 ajax、event、form、touch 等子模块。 由于时间仓促，还是沿用了 gmu 封装的zepto库，版本比较老。为了充分享受开源社区的成果，也考虑使用最新的zepto版本。

在js模块管理库的选用上，使用的 fis 开源的 modjs， modjs 天生与fis2的 map.json 配合，所以在开发成本上更小。 在可选用的js模块管理库上，目前还有 requirejs 和 seajs，后续可能会有学习和项目应用。

## UI库 和 js基础模块

FIS1的时候，我们使用的是GMU，移动开发UI库。后来因为某些原因，放弃使用，而是基于自己的实践进行开发。这次重构中，主要是引入 lazyload、toast、dialog、sug 等UI组件。自己开发的好处是，可控性强而且能针对业务逻辑进行优化，但在测试覆盖上做得有些薄弱。  此外，除UI组件外，还重构了 cookie、http、storage、geolocation、openapp 等js模块。

## 开发和测试基准

    两种平台：      android & IOS
    
    系统版本分布：  android 2.3.x   android 4.x
                    IOS5            IOS6            IOS7
                    
    浏览器覆盖：    默认浏览器(android 和 IOS)
                    UC浏览器
                    QQ浏览器
                    chrome浏览器
                    (百度浏览器*)
        
    网络状况：      2G
                    3G 
                    4G（目前与3G同等对待）
                    wifi
    
    屏幕宽度        核心 320px - 400px layout viewport
                    响应式简单实践
                    
    
[参考1:  国内浏览器使用率](http://www.cnnic.net.cn/hlwfzyj/hlwxzbg/ydhlwbg/201310/P020131016356661940876.pdf)    
                    
## 开发规范

    1、目录组织和文件命名
    2、HTML + CSS规范   (*参考：ecomfe、google、tweet)
    3、JS 规范          (*参考：ecomfe、google、jsdoc)
    4、FISP 使用规范    (基于业务实践)
    
## 文档平台

1. ui化的 HTML+CSS 应该有文档，而且文档应该依赖就近的注释自动化生成（参考 http://trulia.github.io/hologram/）。
2. 模块化JS应该有文档，文档应该依赖就近的注释自动化生成（参考 jsdoc）。
3. 依赖与后端的数据也应该有文档，而且自动化随机生成测试数据（参考淘宝的mock数据, http://thx.alibaba-inc.com/RAP/）。
    
## 其他
    
    balabala（嗯，我要按照上面这个思路来梳理下最近的知识体系）
