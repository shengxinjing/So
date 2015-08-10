# MVC、MVP 和 MVVM

## 1 Introduce

从较高层次看，三种模式很类似。它们力争把用户界面、业务逻辑、数据层分开，即分离关注，使UI更容易变换和单元测试。

任何应用程序架构的目标都是使代码尽可能地可测试。在任何应用程序中，UI都特别地难以测试。因此，我们试图**把逻辑从视图中剥离出来**，由此实现代码可测试的目标。

## 2 巴拉巴拉

![MVC三种架构](http://img.blog.csdn.net/20140401173412296?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbmFwb2x1bnlpc2hp/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

MVC、MVP、MVVM 三者的共同点，就是 Model 和 View。

Model即应用数据，同时对外提供数据操作的API，可以在数据发生变化时发出变更通知。

View即UI层，包括UI展现和用户输入的感知。

### 三者的简介

**MVC**

Controller（被动地）接收 View 中的用户操作，根据用户输入不同，调用相应的 Model 的 API 进行数据操作，然后可选择不同 View 来渲染 Model 数据。

一个 Controller 可对应多个 View。

Controller 对 View 的实现不太关心，只是被动地接收来自 View 的用户输入。

Model 中的数据变更会直接通知 View（可同步通信也可以异步通信），而Controller 无法感知。

**MVP**

Presenter，与 Controller 一样，接收来自 View 的用户操作，并通过API的形式对 Model 进行操作；与 Controller **不同的是 Presenter 会反作用于 View**，Model 的变更通知首先被 Presenter 获得，然后再由 Presenter 去更新 View。

一个 Presenter 只对应于一个View。

Controller 存在于后台，而 Presenter 常存在于客户端。Presenter 以异步方式，与服务器端的Model进行通信，Model完成操作后异步通知 Presenter，然后再有 Presenter 反作用于 View。 

MVP模式主要用于 Stateful 的客户端，客户端拥有强大的数据操作能力，应用程序状态储存在内存中，也可以通过命令将应用程序状态持久化（持久化技术也很多样，可以在本地持久化，也可以在服务器端进行数据持久化）。

同时，由于MVP模式完全隔离的 View 和 Model，在 Present 上建立中间数据层，开发者可以在 Presenter 这一中间数据层上建立UI测试，使得UI测试变得非常易行。

**MVVM**

该模式的关键技术之一就是**数据的双向绑定，View的变化会直接影响ViewModel，ViewModel的变化或者内容也会直接体现在View上**。MVVM模式从MVP模式演变而来，都是富客户端的系统架构，其与MVP的另一不同之处在于，MVP中的 Presenter 和 View 是一对一关系，而MVVM模式中的 ViewModel 和 View 是一对多的关系，大幅度地提升数据间的共享能力，在 View 层能非常容易地实现多视图的联动。这种模式实际上是框架替应用开发者做了一些工作，开发者只需要较少的代码就能实现比较复杂的交互。

## 3 三种模式

**MVC模式**

 1. Controller 接受用户输入（User Action）
 2. Controller 操作 Model 进行数据更新
 3. Model 返回的数据直接用来渲染 View
 4. 客户端显示更新后的 View

在MVC模式中，程序认为 View 是无状态的，因此用户输入等价于HTTP请求，HTTP 请求由后端 Controller 来接管。Controller 并不知道 View 的任何细节，Controller 和 View 是一对多的关系。

**MVP模式**

 1. View 接受用户输入（有状态的View）
 2. View 将请求转交给 Presenter
 3. Presenter 操作 Model 进行数据更新
 4. 数据更新后，Model 通知 Presenter 数据发生变化
 5. Presenter 同步数据给 View，引发 View 更新

和 MVC 不同的是，Presenter 能反作用于 View，而且 View 和 Model 进行了完全隔离，由 Presenter 来负责更新 View。

正常情况下，开发者对 View 进行抽象，提取其中的属性和事件，然后 Presenter 引用 View 的抽象（**即中间层**）。这样能很容易地构造 View 的 mock 对象，提高可单元测试性。
 
**MVVM模式**

 1. The user provides some kind of input.
 2. The View translates this to data and sends this data to the ViewModel, the ViewModel holds the data.
 3. When called to do so with a command, the ViewModel forwards the data as changes to the model.
 4. The Model is updated and sends possibly notifications of its state back to the ViewModel.
 5. The ViewModel sends a notification back to the View and the View rerenders.

**The behavior and state is put in the Presentation Model.** That means, the view itself will not keep any state. The Presentation Model contains the state (and Model data). 

## 4 MVC 和 MVVM 的起源

It really boils down to（归结为） just the difference between the early web and the desktop.

**The first acronym, MVC, originated on the web.** 

Let's retain one feature of this web stuff, not as it is today, but as it existed ten years ago.

**The HTML page is essentially dumb and passive（被动的）. The browser is a thin client, or if you will, a poor client. There is no intelligence in the browser**. 

Full page reloads rule. The **»view«** is generated anew（重新） each time around.

----------

Desktop apps are fat clients, or rich clients. **They're clients full of intelligence, full of knowledge about their data**. They're **stateful**. They cache data they're handling in memory. No such crap as a full page relaod. And this rich desktop way is probably where the second acronym originated, MVVM.

Don't be fooled by the letters, by the omission of the C. Controllers are still there. They need to be. Nothing gets removed. We just add one thing: **statefulness, data cached on the client (and along with it intelligence to handle that data)**. 

That data, essentially a cache on the client, now gets called **»ViewModel«**. It's what allows rich interactivity. And that's it.

> MVC = model, controller, view = one-way communication = poor interactivity
 
> MVVM = **model, controller（User Action）, cache（User Data）, view** = two-way communication = rich interactivity
 
We can see that with Javascript, the web has embraced MVVM.

## 5 大神怎么看

[addyosmani' understanding-mvc-and-mvp-for-javascript-and-backbone-developers/](http://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)

MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) (traditionally) managing logic, user-input and coordinating both the models and views.

目前阅读尚有压力，留待以后继续深入。

## 6 其他文章

[Understanding MVC, MVP and MVVM Design Patterns](http://www.dotnet-tricks.com/Tutorial/designpatterns/2FMM060314-Understanding-MVC,-MVP-and-MVVM-Design-Patterns.html)

> In web application, each action is a call to a URL and for each such call there is a controller available in the application who respond to such call. Once that Controller has completed its processing, it will return the correct View.

**Key Points about MVP Pattern:**

 1. User interacts with the View.
 2. There is one-to-one relationship between View and Presenter.
 3. Provides two way communication between View and Presenter.
 4. View >> Presenter >> Model.

**Key Points about MVVM Pattern:**

 1. User interacts with the View.
 2. There is many-to-one relationship between View and ViewModel.
 3. Supports two-way data binding between View and ViewModel.
 4. View >> ViewModel >> Model  