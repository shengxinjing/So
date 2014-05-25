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

## 3 再说一次

**MVC模式**

 1. Controller 接受用户输入（User Action）
 2. Controller 操作 Model 进行数据更新
 3. Model 返回的数据直接用来渲染 View
 4. 客户端显示更新后的 View

在MVC模式中，程序认为用户在 View 上的交互是无状态的，因此这里的用户输入(User Action)等价于HTTP请求，HTTP 请求由后端 Controller 来接管。Controller 并不知道 View 的任何细节，Controller 和 View 是一对多的关系。


<del>MVC模式的缺点是很难对 Controller进行集中的单元测试，Controller操作数据，但是如何从View上断言这些数据的变化呢？</del>
 
**MVP模式**

 1. View 接受用户输入（有状态的View）
 2. View 将请求转交给 Presenter
 3. Presenter 操作 Model 进行数据更新
 4. 数据更新后，Model 通知 Presenter 数据发生变化
 5. Presenter 同步数据给 View，引发 View 更新

和 MVC 不同的是，Presenter 能反作用于 View，不像 Controller只能被动的接受view的指挥。

正常情况下，开发者对 View 进行抽象，提取其中的属性和事件，然后 Presenter 引用 View 的抽象（**即中间层**）。这样可以很容易地构造 View 的 mock 对象，提高可单元测试性。Presenter 不仅要操作数据，而且要更新 View。
 
**MVVM模式**

MVVM在Model的基础上添加一个ViewModel，这个ViewModel除正常属性外，还包括一些供View显示用的属性（**即应用程序状态数据（stateful）**）。

例如在经典MVP中，View 有一个属性 `ischeck`，需要在 Presenter 中设置 View 的 `ischeck` 值。而在MVVM中，ViewModel 也会有一个 `ischeck` 属性来同步 View 的 `ischeck`属性。ViewModel 和 View 通过观察者模式实现双向绑定。

## 4 differencs between MVC and MVVM

It really boils down to（归结为） just the difference between the early web and the desktop.

**The first acronym, MVC, originated on the web.** 

Let's retain one feature of this web stuff, not as it is today, but as it existed ten years ago.

**The HTML page is essentially dumb and passive（被动的）. The browser is a thin client, or if you will, a poor client. There is no intelligence in the browser**. 

Full page reloads rule. The **»view«** is generated anew（重新） each time around.

----------

Desktop apps are fat clients, or rich clients. **They're clients full of intelligence, full of knowledge about their data**. They're **stateful**. They cache data they're handling in memory. No such crap as a full page relaod.

And this rich desktop way is probably where the second acronym originated, MVVM.

Don't be fooled by the letters, by the omission of the C. Controllers are still there. They need to be. Nothing gets removed. We just add one thing: **statefulness, data cached on the client (and along with it intelligence to handle that data)**. 

That data, essentially a cache on the client, now gets called **»ViewModel«**. It's what allows rich interactivity. And that's it.

 > MVC = model, controller, view = essentially one-way communication = poor interactivity

----------

 > MVVM = **model, controller（User Action）, cache（User Data）, view** = two-way communication = rich interactivity
 
We can see that with Javascript, the web has embraced MVVM.

## 5 大神怎么看

[addyosmani' understanding-mvc-and-mvp-for-javascript-and-backbone-developers/](http://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)

MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) (traditionally) managing logic, user-input and coordinating both the models and views.

## 6 其他文章

[Understanding MVC, MVP and MVVM Design Patterns](http://www.dotnet-tricks.com/Tutorial/designpatterns/2FMM060314-Understanding-MVC,-MVP-and-MVVM-Design-Patterns.html)

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
 
[Understanding-Basics-of-UI-Design-Pattern-MVC-MVP](http://www.codeproject.com/Articles/228214/Understanding-Basics-of-UI-Design-Pattern-MVC-MVP)

MVC、 MVP and MVVM patterns allow us to develop applications with loss coupling and separation of concern which in turn improve testability, maintainability and extendibility with minimum effort.

**MVP**

The view relies on a Presenter to populate it with model data, react to user input, and provide input validation. 

In the MVC, the Controller is responsible for determining which View is displayed in response to any action. This differs from MVP where **actions route through the View to the Presenter**. In MVC, every action in the View basically calls to a Controller along with an action. 

 > In web application, each action is a call to a URL and for each such call there is a controller available in the application who respond to such call. Once that Controller has completed its processing, it will return the correct View.


...

In case of MVP, view binds to the Model directly through data binding. In this case, it's the Presenter's job to pass off the Model to the View so that it can bind to it（**cumunicate to Model and View**）. The Presenter will **also contain logic** for gestures like pressing a button, navigation. It means while implementing this pattern, **we have to write some code in code behind of view in order to delegate to the presenter**. However, in case of MVC, a view does not directly bind to the Model. The view simply renders, and **is completely stateless**. In implementations of MVC, the View usually will not have any logic in the code behind. **Since controller itself returns view while responding to URL action, there is no need to write any code in view code behind file.**

### MVC Steps

    Step 1: Incoming request directed to Controller.
    Step 2: Controller processes request and forms a data Model.
    Step 3: Model is passed to View.
    Step 4: View transforms Model into appropriate output format.
    Step 5: Response is rendered.

### MVVM

If property values in the ViewModel change, those new values automatically propagate to the view via data binding and via notification. When the user performs some action in the view for example clicking on save button, **a command on the ViewModel** executes to perform the requested **action**（RESTFul）. In this process, it’s the ViewModel which modifies model data, View never modifies it. The view classes have no idea that the model classes exist, while the ViewModel and model are unaware of the view. In fact, the model doesn’t have any idea about ViewModel and view exists.

### MVVM 再来一次

The essence of the Presentation Model is to **take all behavior out of the View**. **The behavior and state is put in the Presentation Model.** That means, the view itself will not keep any state (other than what it looks like.) The Presentation Model contains the state. 

The View that cannot or be weak to store any state or have any logic. 

What happens in an MVVM is as follows:

 1. The user provides some kind of input.
 2. The View translates this to data and sends this data to the View Model, the View Model holds the data.
 3. When called to do so with a command, the View Model forwards the data as changes to the model.
 4. The Model is updated and sends possibly notifications of its state back to the View Model.
 5. The View Model sends a notification back to the View and the View rerenders.
