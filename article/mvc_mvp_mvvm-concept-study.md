# MVC、MVP 和 MVVM

## 1 Introduce

从较高层次看，三种模式很类似。它们力争把用户界面、业务逻辑以及数据层分开，即分离关注，使UI更容易变换和单元测试。

任何应用程序架构的目标都是使代码尽可能地可测试。在任何应用程序中，UI都特别地难以测试。因此，我们**试图把逻辑从视图中剥离出来**，由此实现代码可测试的目标。

## 2 巴拉巴拉

![MVC三种架构](http://img.blog.csdn.net/20140401173412296?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbmFwb2x1bnlpc2hp/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

MVC、MVP、MVVM三者的共同点，就是Model和View。

Model即应用数据，同时向外提供数据操作的API，也可能在数据发生变化时发出变更通知。Model不依赖于View的实现，只要外部程序调用Model的接口就能够实现对数据的增删改查等操作。

View即UI层，包括UI展现和用户输入的感知。

### 三者差异在于如何粘合View和Model，实现用户交互处理以及变更通知

**MVC**

Controller（被动地）接收 View 中的用户操作，根据事件不同，或调用Model的API进行数据操作，或进行 View 的跳转。

一个 Controller 可以对应多个 View（即存在不同分支）。

Controller 对 View 的实现不太关心，只是被动地接收，Model 中的数据变更不会通过 Controller 而是直接通知 View，View 通常采用观察者模式实现与 Model 通信。

**MVP**

Presenter，与 Controller 一样，接收来自 View 的用户操作，并通过API的形式对 Model 进行操作；与 Controller **不同的是 Presenter 会反作用于 View**，Model的变更通知首先被 Presenter 获得，然后再由 Presenter 去更新 View。

一个 Presenter 只对应于一个View。

**MVVM**

ViewModel 是包含 View 的数据属性和操作的层级，**该模式的关键技术就是数据绑定，View的变化会直接影响ViewModel，ViewModel的变化或者内容也会直接体现在View上。**

这种模式实际上是框架替应用开发者做了一些工作，开发者只需要较少的代码就能实现比较复杂的交互。

MVP 和 MVVM 完全隔离了Model和View，但是在有些情况下，数据从Model到ViewModel 或者 Presenter 的**拷贝开销很大**，可能也会结合 MVC 的方式，Model 直接通知 View 进行变更。

广义地谈论MVC是指的MV*，即视图和模型的分离，只要一个框架提供了视图和模型的分离，我们就可以认为它是一个MVC框架。

## 3 再说一次

**MVC**

　1. View 接受用户的交互请求
　2. View将请求转交给Controller，
　3. Controller 操作 Model 进行数据更新
　4. 数据更新后，Model通知 View 数据变化
　5. View 显示更新之后的数据
　　
Controller不知道任何 View 的细节，一个 Controller 能被多个 View 使用。MVC的缺点是很难对 Controller进行单元测试，Controller操作数据，但是如何从View上断言这些数据的变化呢？

例如，点击一个View的按钮，提交一个事件给Controller，Controller修改Model的值。这个值反映到View上是字体和颜色的变化。测试这个Case还是有点困难的。
 
**MVP**

 1. View接受用户的交互请求
 2. View将请求转交给 Presenter
 3. Presenter操作Model进行数据更新
 4. 数据更新后，Model通知Presenter数据发生变化
 5. Presenter 同步数据给 View，引发 View 更新

和MVC不同的是，Presenter能反作用于View，不像 Controller只能被动的接受view的指挥。

正常情况下，开发者可以抽象View，暴露属性和事件，然后Presenter引用view的抽象。这样可以很容易地构造view的mock对象，提高可单元测试性。在这里，presenter的责任变大了，不仅要操作数据，而且要更新view。

在现实mvp的实现中，一部分倾向于在view中放置简单的逻辑，在presenter放置复杂的逻辑，另一部分倾向于在presenter中放置全部的逻辑。这两种分别被称为：Passive View 和 Superivising Controller。

在Passive View中，为了减少UI组件的行为，使用controller不仅控制用户事件的响应，而且将结果更新到view上。可以集中测试controller，减小view出问题的风险。

在Superivising Controller中的controller既处理用户输入的响应，又操作view处理view的复杂逻辑。
 
**MVVM**

MVVM在Model的基础上添加一个ViewModel，这个ViewModel除正常属性外，还包括一些供View显示用的属性（**即应用程序状态数据**）。

例如在经典的MVP中，view有一个属性ischeck，需要在presenter中设置view的ischeck值。**但是在MVVM中的presenter也会有一个ischeck属性来同步view的ischeck属性**，可能会用到observer模式同步ischeck的值。

在MVVM中，presenter被改名为ViewModel，就演变成了你看到的MVVM。在支持双向绑定的平台，MVVM更受欢迎。例如：微软的WPF和Silverlight。

## 4 differencs between MVC and MVVM

It really boils down to（归结为） just the difference between the early web and the desktop.

**The first acronym, MVC, originated on the web.** 

Let's retain one feature of this web stuff, not as it is today, but as it existed ten years ago.

**The HTML page is essentially dumb（笨拙的） and passive（被动的）. The browser is a thin client, or if you will, a poor client. There is no intelligence in the browser**. 

Full page reloads rule. The »view« is generated anew（重新） each time around.

----------

Let's remember that this web way, compared to the desktop. Desktop apps are fat clients, or rich clients. **They're clients full of intelligence, full of knowledge about their data**. They're **stateful**. They cache data they're handling in memory. No such crap as a full page relaod.

**And this rich desktop way is probably where the second acronym originated, MVVM.** 

Don't be fooled by the letters, by the omission of the C. Controllers are still there. They need to be. Nothing gets removed. We just add one thing: **statefulness, data cached on the client (and along with it intelligence to handle that data)**. That data, essentially（本质上来说） a cache on the client, now gets called »ViewModel«. It's what allows rich interactivity. And that's it.

 > MVC = model, controller, view = essentially one-way communication = poor interactivity

----------

 > MVVM = model, controller, cache, view = two-way communication = rich interactivity
 
We can see that with Javascript, the web has embraced(拥抱) MVVM. Browsers can no longer be legitimately called thin clients. 

## 5 大神怎么看

[addyosmani' understanding-mvc-and-mvp-for-javascript-and-backbone-developers/](http://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)

MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) (traditionally) managing logic, user-input and coordinating both the models and views.

## 6 最新文章怎么说

[Understanding MVC, MVP and MVVM Design Patterns](http://www.dotnet-tricks.com/Tutorial/designpatterns/2FMM060314-Understanding-MVC,-MVP-and-MVVM-Design-Patterns.html)
