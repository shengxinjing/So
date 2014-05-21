# CSS2.1 Visual formatting model

## 1. Introduce

可视格式化模型，即用户代理如何处理文档树用于显示可视元素的方法。

在可视格式化模型中，文档树中的每个元素会基于`盒子模型`生成零个或多个盒子。这些盒子的布局通过以下因素控制：

 - 盒子尺寸和类型
 - 定位机制（普通流、浮动、绝对定位）
 - 文档树中元素间的相互关系
 - 额外信息（如视口、图片的原始尺寸等）

可视格式化模型并没有定义格式化的所有细节。因此，遵从规范的用户代理在那些没有涉及的细节上，可能会表现出不同的行为。

### 视口

连续媒体的用户代理通常会给用户提供一个视口，通过视口区域，用户得以浏览文档。当视口调整大小时，用户代理可能会改变文档树的布局。当视口小于文档用于渲染的画布时，用户代理应该提供一个滚动机制。

### 容器块

在 CSS2.1 中，盒子的定位和尺寸常相对一个称为容器块`containing block`的矩形盒子的边缘计算得到。

一般来说，已生成的盒子同时也会成为其后代盒子的容器块`containing block`，这时，我们说该盒子为其后代盒子建立了容器块。

当我们说“一个盒子的容器块”，是指这个盒子所在的容器块，而不是说这个盒子所生成的容器块。

每个盒子相对于其容器块定位，但并不限于容器块内部，因此盒子可能溢出。

## 2. 显示类型 —— 控制盒子的生成

### 块级元素和块盒子

> Block-level elements are those elements of the source document that are formatted visually as blocks.
> 
> values make an element block-level: 'block', 'list-item', and 'table'.

块级盒子是 `Block Formatting Context` 中的基础元素。

每个块级元素会生成一个主块级盒子，该主块级盒子将存放其后代盒子和生成内容，同时定位机制也跟它相关。此外，某些块级元素，如 `list-item` ，除了主块级盒子，还生成额外的盒子，这些额外的盒子相对于主块级盒子进行定位。

除 `table box` 和 `replaced elements` 外，一个 `block-level box` 同时也是一个 `block container box`。一个 `block container box` 要么只包含 `block-level box` ，否则将形成一个 `Inline Formatting Context`，因此只能包含 `inline-level box`。并不是所有的`block container box` 都是 `block-level box`，`non-replaced inline-block`、`non-replaced table-cell` 都是 `block container box`，而本身并不是 `block-level box`。

 > Block-level boxes that are also block containers are called block boxes.

`block level box`、`block container box` 和 `block box`，当我们不强调三者间的区别时，都缩写为 `block`。

### 匿名 block box

如果一个 `block container box` 内部拥有一个 `block-level box`，那么该 `block container box` 内部只能包含 `block-level box`。

PS: **请避免出现此类情况（含匿名 block box 和 inline 元素中含 block 元素两类）**，因此以下省略

### 行内级元素 和 行内盒子

`inline-level element` 是指那些不生成新块级内容的元素，其内容将被分配到行中。

 > values make an element inline-level: 'inline', 'inline-table', and 'inline-block'.

`inline-level element` 生成 `inline-level box`，是 `Inline Formatting Context` 中的基础元素。

 > inline box 是指本身是 inline-level box，同时其内容(content)参与到所在的 IFC 环境中的盒子。

一个 `non-replaced inline` 元素生成一个 `inline box`。对于那些不是 `inline box`  的 `inline-level block`，我们称为 **原子行内级盒子**，比如 `replaced inline`、`inline-block`、`inline-table` 元素，这是因为这些盒子在IFC中表现为一个单独而不可分割的盒子。

###  匿名 inline box

 > 任何直接包含在一个 `block container` 元素中的文本必须视为一个匿名的行内元素。
 
 > Any text that is directly contained inside a block container element (not inside an inline element) must be treated as an anonymous inline element.
 
这些匿名行内盒子从它们的父级 `block container`  盒子中继承可继承的属性，不可继承属性则赋予初始化值。

如果在上下文中，我们明确就知道这是哪类匿名盒子，我们会将匿名块盒子和匿名行内盒子都简写为匿名盒子。

### Run-in boxes

在 CSS3 中被废弃，可以用其他属性来模拟，应用场景不多。

### The `display` property

```
Value:              inline | block | list-item | inline-block | table | inline-table | table-xxx | none
Initial:  	        inline
Applies to:  	    all elements
Inherited:  	    no
Percentages:  	    N/A
Media:  	        all
Computed value:     the specified value, except for positioned and floating and the root element.

block:              generate a block box.
inline-block:       generate an inline-level block container. 
inline:             generate one or more inline boxes.
list-item:          generate a principal block box and a marker box.
```

## 3.定位机制
在CSS2.1中，一个盒子可以基于三种定位机制进行布局：

普通流。在CSS2.1中，普通流包括由块级盒子组成的块级格式化、由行内级盒子组成的行内格式化以及块级和行内盒子的相对定位。
浮动。在浮动模型中，一个盒子先基于普通流进行布局，然后脱离当前流，尽可能远地平移到 left 或 right。内容可能会围绕浮动一边流动。
绝对定位。在绝对定位模型中，一个盒子完全从普通流中移除，并相对于其容器块进行定位。
一个元素在浮动、绝对定位或是根元素时，这个元素是脱离文档流(flow)的。一个元素在文档流中是指它没有脱离文档流。一个元素A的文档流是指包括元素A 以及 A中所有文档流的元素的集合。

The flow of an element A is the set consisting of A and all in-flow elements whose nearest out-of-flow ancestor is A.

3.1 定位机制: 'position' property
postion 和 float 属性决定了使用哪种定位机制来计算盒子的位置。

'position'
Value:  	static | relative | absolute | fixed | inherit
Initial:  	static
Applies to:  	all elements
Inherited:  	no
Percentages:  	N/A
Media:  	visual
Computed value:  	as specified
static
该盒子是一个普通盒子，基于普通流布局。top/right/bottom/left 属性不可应用。
relative
该盒子基于普通流定位，并相对其原始位置发生偏移。如果盒子B被相对定位，其后面的盒子在进行 layout 时就好像 B 并没有相对偏移。
absolute
该盒子通过top/right/bottom/left 属性指定其定位（甚至可能包括尺寸）。这些属性表示相对于该盒子的容器块的偏移距离。绝对定位元素完全脱离文档流。
fixed
该盒子基于绝对定位模型定位，同时，该盒子相对某些参考物来说是固定的。在手持、屏幕、投影、tv等媒体类型中，该盒子相对于视口固定，在视口滚动时不会发生移动。在打印媒体中，该盒子在每页中都将渲染，其相对于与 page box 固定。对于其他媒体，没有定义其表现方式。
User agents may treat position as 'static' on the root element.

3.2 Box offsets: 'top', 'right', 'bottom', 'left'
我们说一个元素是定位元素，是指这个元素的 position 属性的值非 static。定位元素生成定位盒子，并基于这四个属性进行布局，

'top'
Value:  	<length> | <percentage> | auto | inherit
Initial:  	auto
Applies to:  	positioned elements
Inherited:  	no
Percentages:  	refer to height of containing block
Media:  	visual
Computed value:  	if specified as a length, the corresponding absolute length; if specified as a percentage, the specified value; otherwise, 'auto'.
这个属性指定了一个绝对定位盒子的 margin box 边缘相对于其容器块边缘的偏移地址。对于相对定位盒子来说，偏移相对于该盒子自身的边缘。'right'　--   'bottom'　--　'left' 同理。

4 普通流
在普通流中的盒子属于某个格式化上下文，可能是块级格式化上下文，也可能是行内的，但是不能同时属于这两个上下文。块级盒子参与到BFC中，而行内级盒子参与到IFC中。

4.1 BFC 块级格式化上下文
浮动元素、绝对定位元素、非块盒子的块容器元素（比如inline-block、table-cell、table-caption）以及 overflow值非visible(除非这个值被传递到视口) 的块盒子会为其内容建立一个新的块级格式化上下文。

在块级格式化上下文中，盒子从包含块的顶部开始，在垂直方向一个一个地连续布局。两个盒子之间的垂直距离有 margin 属性决定。在同一块级上下文中的相邻块级盒子的垂直 margin 会合并。

在一个块级上下文中，每个盒子的左外边距与包含块的左边缘重合（如果是rtl 格式化环境中，右边缘）。即使存在浮动时它也同样奏效，除非这个盒子建立一个新的块级上下文，这样由于浮动原因，这个盒子会变窄。

4.2 行内格式化上下文 IFC
在行内格式化上下文中，盒子依据水平方向进行布局，从包含块的顶部开始，一个接着一个布局。这些盒子的水平方向的 margin、border、padding 会发挥作用。行内格式化上下文中的盒子在垂直方向上有不同的对齐方式：比如顶部、底部、基线对齐等。

我们将形成每一个行的矩形区域称为行框(line box)。

一个行框的的宽度取决于其包含块以及浮动元素的存在情形。一个行框的高度取决于行高的计算规则。

一个行框总是足够高来容纳该行内的所有盒子。当一个盒子B 的高度比包含它的行框的高度要小时，其垂直对齐方式取决于 vertical-algin 属性。当但个行框无法容纳多个行内盒子时，这些行内盒子将分配到多个垂直相邻的行框中。因此，一个段落就是一系列垂直排列的行框。垂直相邻的行框之间没有垂直的空白分隔，并且这些行框之间不会相互覆盖。

通常来说，一个行框的左边缘与其包含块的左边缘重合，右边缘与其包含块的右边缘重合。但是，浮动盒子可能会出现在包含块和行框之间。因此，尽管在同一IFC中的行框通常有相同的宽度（即包含块的宽度），这些行框也可能由于浮动导致水平可用空间减少而产生不同的宽度。在同一IFC中的行框在高度上常常是不同的，取决于行高计算和垂直对齐方式。

当一个行框中的所有行内级盒子总宽度小于该行框的宽度时，这些行内级盒子在水平方向的分布取决于 text-align 属性。

当一个行内盒子超出了一个行框的宽度时，它将会被分割为多个盒子，这些盒子将分布到多个行框中。如果一个行内盒子无法进行分割（比如，这个行内盒子只包含一个字符，或是指定语言的分词规则不允许在这个行内盒子进行分词，又或者 white-space 值为 nowrap 或 pre等），那么这个行内盒子将会溢出这个行框。

当一个行内盒子被分割时，margin、border、padding 在分割处没有任何的视觉表现。

行内盒子也可以在同一行框中被分 割成多个盒子，这需要基于双向文本机制 (bidirectional text)。

在一个IFC中，只生成刚好能足够容纳其行内级内容的行框数量。对于不含文本、无保留空白符、没有非零 margin、padding、border 的行内元素，以及没有其他文档流内容(比如图片、inline-block 或 inline-table)，并且也不是以一个保留的换行符结束的行框，对该行框内的任何元素进行定位时，这个行框被视作高度为零，如果是其他目的，则这个行框视为不存在。

4.3 相对定位
一旦一个元素基于普通流或浮动进行布局，它就可以相对原有位置进行平移，这种机制称为相对定位。对元素B1进行相对定位不会影响之后的元素B2: 即B2在进行布局计算时就好像B1没有相对定位一样，当B1进行相对定位后，B2并不会重新定位。 这意味着相对定位会导致元素之间的相互覆盖。但是，如果相对定位导致一个 'overflow:auto' 或 'overflow:scroll' 的盒子内容溢出，用户代理必须允许用户能够访问溢出的内容，这时候，因为滚动条的创建，可能会影响其他元素的布局。

一个相对定位的盒子会保持其普通流的尺寸，包括源代码中的换行和空格。一个相对定位元素会建立一个新的容器块(containing block)。

相对定位时，如果 left/right 值都为 auto(intial value)，实际使用值为0. 如果left/right 过于约束，依赖 direction:ltr/rtl 决定冲突。top/bottom 机制类似。

5 浮动
浮动是指一个盒子被平移到当前行的左边和右边。浮动一个最有趣的特征是内容会沿着浮动盒子的边缘流动。

一个浮动盒子被平移到左边或右边，直到这个盒子的外边缘与其包含块的边缘接触，或是其他浮动元素接触。如果有一个行框，那么浮动盒子的顶外边缘与当前行框的顶部对齐。

如果当前情况下，没有足够的水平空间容纳浮动元素，浮动元素会试着下移，直到有足够空间，或者水平方向没有其他浮动元素存在。

由于浮动不存在文档流中，这个浮动元素前面和后面的非定位块盒子在垂直方向流动，就好像浮动元素不存在一样。但浮动元素之后的当前和随后的行框会因为给浮动盒子的 margin box 腾出空间会缩短。

如果行框中存在一个位置满足以下四个条件，则该行框与浮动元素相邻：

a、在行框的顶部或以下   b、在行框的底部或以上    c、在浮动元素 top margin edge 以下  d、在浮动元素 bottom margin edge 以上

这意味着，如果一个浮动元素的 outer 边缘为0 或是负数，它不会缩短任何的行框。

如果一个缩短的行框变得太小而无法包含任何内容，那么这个行框将向下移动（并且它的宽度将重新计算）直到能容纳某些内容或是不存在浮动元素。当前行框中所有出现在浮动元素前的内容必须在同一行框中沿着浮动元素重新流动。换句话说，如果行内级盒子已经被定位在该行上，然后用户代理检测一个左浮动盒子，而且该浮动盒子能适应到还剩下的行框空间（即剩下的行框空间大于浮动盒子的大小），那么这个左浮动盒子会在该行上重新定位，与行框的顶部对齐，并且之前已定位的行内级盒子必须沿着浮动盒子的右边缘重新浮动。



 

 

table 元素、block-level replaced 元素、或建立新BFC的普通流元素(非定位普通流)的 border box 作为元素本身绝对不能覆盖任何在同一 BFC 中的浮动元素的 margin box。如果有必要的话，用户代理应该清除这个元素，将这个元素移到任何浮动元素之下，或将这个元素置于相邻与有足够空间的浮动元素的位置。这样可能会使得该元素的 border box 比实际定义的更小。CSS2规范并没有定义，何时一个用户代理可以将这些元素放置于浮动元素之旁，或这些元素的 border box 可以缩小多少。

一个浮动可以也可能覆盖普通流中的其他盒子。当覆盖行为发生时，浮动元素总是渲染在 non-positioned in-flow block 之前，而在 in-flow inline 之后。

5.1 浮动元素的定位
'float'
Value:  	left | right | none | inherit
Initial:  	none
Applies to:  	all, but not absolutely positoned
Inherited:  	no
Percentages:  	N/A
Media:  	visual
Computed value:  	as specified
User agents may treat float as 'none' on the root element.

下面是控制浮动行为的具体规则（只说左浮动，右浮动类似）：

左浮动盒子的左外边缘不可以超出其容器块的左侧。 
如果当前盒子是左浮动的，并且在源文档中存在任何已经左浮动的盒子，那么对于每个先左浮动的盒子来说，当前左浮动盒子的左外边缘必须处于先左浮动盒子的右外边缘的右侧，或当前左浮动盒子的顶部低于先浮动盒子的底部。
左浮动盒子的右外边缘不可以出现在任何之后右浮动元素的左外边缘的右侧。 
浮动盒子的顶外边缘不可以超过其容器块的顶部。当浮动发生在两个可合并的外边距中间时，浮动盒子就好像它有另外一个空的匿名父级块参与到流的布局中。
浮动盒子的顶外边缘不可以超过任何出现在源文档前面的块盒子或浮动盒子的顶外边缘。
浮动盒子的顶外边缘不可以超过任何出现在源文档前面的文本盒子所在行框的顶部。
左浮动盒子如果在其左侧有另一个左浮动盒子，那么该盒子的右外边缘不可以超出容器的右侧。（一个左浮动盒子的右外边缘不可以溢出，除非它不得不溢出）
浮动盒子要尽可能高
浮动盒子要尽可能靠向左（右）侧，但其优先级比尽可能高的规则低。


浮动元素存在于两个块盒子中间时，就好像浮动盒子有一个空的匿名块盒子

但在 CSS2.1中，如果BFC中存在一个 in-flow 垂直方向的负 margin 而导致浮动盒子的位置高于其原来应该的位置，所有这些负边距都将重置为 0，并且浮动的位置变为未定义。（PS：好像测试没有通过~~~~本来以为是为了处理行内元素的相互覆盖而引入的~~）

But in CSS 2.1, if, within the block formatting context, there is an in-flow negative vertical margin such that the float's position is above the position it would be at were all such negative margins set to zero, the position of the float is undefined.

以上规则的“其他元素”仅是指与浮动在同一BFC中的其他元素。

5.2 控制浮动周围的文档流
'clear'
Value:  	none | left | right | both | inherit
Initial:  	none
Applies to:  	block-level elements
Inherited:  	no
Percentages:  	N/A
Media:  	visual
Computed value:  	as specified
该属性表明该元素盒子的哪一边不可以与之前浮动的盒子相邻。clear 属性不考虑该元素内部的浮动或是其他BFC中浮动。

left
Requires that the top border edge of the box be below the bottom outer edge of any left-floating boxes that resulted from elements earlier in the source document.
如果 clear 的值非 “none”，这时它可能会引入 clearance。 Clearance 会抑制 margin collapsing，并表现为该元素的 margin-top 之上的空白。

Computing the clearance of an element on which 'clear' is set is done by first determining the hypothetical position of the element's top border edge. This position is where the actual top border edge would have been if the element's 'clear' property had been 'none'.

If this hypothetical position of the element's top border edge is not past the relevant floats, then clearance is introduced, and margins collapse according to the rules in 8.3.1.

Note: The clearance can be negative or zero.

当 clear 属性设置在浮动元素上时，它将导致浮动定位规则的改变。新增规则10：

       10. 该浮动盒子的顶外边缘必须处于所有先浮动盒子的底外边缘之下。
       
9.6 绝对定位
在绝对定位模型中，一个盒子相对于其容器块进行偏移。该盒子将完全从普通流中移除。一个绝对定位盒子将为其普通流中的子元素以及其绝对定位的后代建立一个新的容器块。然而，一个绝对定位元素的内容不会围绕任何其他盒子流动。绝对定位盒子可能会被其他盒子的内容所覆盖，或是覆盖其他盒子的内容，这取决于相互覆盖盒子的 stack levels 。

在这个规范中所说的绝对定位元素（盒子），是指其 position 属性为 absolute 或是 fixed。

9.6.1 固定定位
固定定位是绝对定位模型中的一种特殊场景。它们之间的唯一区别在于，对于一个固定定位盒子来说，其容器块是由视口所建立的。对于连续媒体来说，固定盒子在文档滚动时不会移动（相对于视口固定）。从这个角度看，固定定位与 固定背景图片相似。对于分页媒体来说，固定定位盒子在每个分页都会重复。如果固定定位盒子超出了页面区域，那么该盒子将会裁剪。对于在初始化容器块中不可见的固定定位盒子，打印时并不会打印出来。

9.7 'display', 'position', 和 'float'间的关系
这三个影响盒子生成以及布局的属性—— 'display', 'position', and 'float' ——相互间的影响如下：

如果 display 为 none，其 position 和 float 属性将被忽略。该元素不生成盒子。
否则，如果 position 为 absolute 或 fixed，该盒子被绝对定位。 float 属性计算值为 none，该盒子的 display 属性依据下表确定。该盒子的定位取决于 top/right/bottom/left 属性值及其容器块。
否则，如果 float 属性值非 none，该盒子进行浮动，其 display 属性值基于下表确定。
否则，如果该元素是根元素， 其 display 属性值基于下表确定。
否则，其 display 属性值就是指定值。
Specified value	Computed value
inline-table	table
inline, table-row-group, table-column, table-column-group, table-header-group,

table-footer-group, table-row, table-cell, table-caption, inline-block

block
others	same as specified
9.8 普通流、浮动、绝对定位比较（略）
9.9 分层显示
9.9.1 指定层叠级别：the 'z-index' property
Value:  	auto | <integer> | inherit
Initial:  	auto
Applies to:  	positioned elements
Inherited:  	no
Percentages:  	N/A
Media:  	visual
Computed value:  	as specified
对一个定位盒子来说， z-index 属性指定了：

当前层叠上下文中该盒子的层叠级别。
该盒子是否建立一个新的层叠上下文。
其属性值拥有下列含义：

<integer>
This integer is the stack level of the generated box in the current stacking context. The box also establishes a new stacking context.
auto
The stack level of the generated box in the current stacking context is 0. The box does not establish a new stacking context unless it is the root element.
在这一章中，短语“在前面” 意味着当用户面对屏幕时更加靠近用户。

在CSS2.1 中，每个盒子在三个维度拥有定位。除了其水平和垂直方向的定位以外，盒子沿着z坐标也有定位。z轴的定位主要与盒子之间覆盖次序相关，这一章将讨论这些盒子如何在z轴上进行定位。

我们将渲染树在画布上的渲染顺序，成为层叠上下文。一个层叠上下文可以包含更多的层叠上下文。一个层叠上下文如果从其父级层叠上下文的角度来观察，它是原子不可分的；也即是说，其他层叠上下文中的盒子不应该(may not)出现在该层叠上下文的任何盒子之间。

每个盒子都属于一个层叠上下文。在一个给定层叠上下文中的每个定位盒子都有一个整数的层叠级别，这个层叠级别就是其在该层叠上下文中相对于其他层叠级别的在 z 轴方向上的位置。层叠级别越高，这个盒子就越“在前面"。盒子可以拥有负的层叠级别。同一层叠上下文中的相同层叠级别的盒子依据其在文档树中的出现顺序处理层叠，后者层叠前者。

根元素将生成根层叠上下文。其他的层叠上下文通过任何 z-index 计算值非 auto  的定位元素所生成。层叠上下文并不一定需要与容器块相关。在未来的CSS版本中，其他属性可能会引入层叠上下文，比如 'opacity' [CSS3COLOR]。

在每个层叠上下文内部，下面的层通过从后到前的顺序被渲染：

the background and borders of the element forming the stacking context.
the child stacking contexts with negative stack levels (most negative first).
the in-flow, non-inline-level, non-positioned descendants.
the non-positioned floats.
the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
the child stacking contexts with positive stack levels (least positive first).
在每个层叠上下文中，层叠级别为 0 的定位元素（在第六层）、非定位浮动元素（第四层）、行内块（第五层）和行内表格（第五层），在渲染时就好像这些元素本身自己生成新的层叠上下文，除了他们的后代定位元素和子层叠上下文基于当前所在层叠上下文进行渲染。

这个渲染顺序将对每个层叠上下文递归应用。