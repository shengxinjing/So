
# 常用记事本

 1. 移动端点击日志统计，基于click 300ms延迟来发送log统计。
 2. HTML5表单增强慎用。如默认Err提示不好，`type="search"` 界面不友好。
 6. CSS 状态类，可使用 s- 前缀表示，状态类通过js/用户交互来切换元素状态。
 7. 全局变量的坏处，在于程序的任何部分都能进行**写入操作**。   
    
    解决方法是
    1、使用作用域变量来封装。
    2、构造函数和实例，将变量绑定到 this 对象上，并且对变量的操作也封装成一个函数（setter/getter），使得变量操作有迹可循。
    3、全局变量可用于程序对外交互，比如js 对html、css的关联，js对url 、后台数据的关联等场景。 数据依赖一定要在程序入口表现出来，否则就是一个坑。
 4. 事件绑定统一使用 `on` 接口，解除绑定使用 `off` 接口，提升编程一致性。
 5. 目录规范和文件命名规范，编码规范，都是为了提升编程一致性。
 10. 移动端可点击区域一定要大大大。
 11. DOM查找中的选择器应该增加 context 上下文环境，避免权限扩散。