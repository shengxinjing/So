# 后端分层架构

逻辑分层之间的调用关系，只能向后依赖，不能向前依赖或者跨层依赖。

## Router

- 路由器，将不同的HTTP请求转交给相应 `Controller` 或 `API` 处理。


## Controller

- 路由将控制权转交给具体`Controller`，`Controller`获取模型数据，并进行模板渲染，然后响应。
- 格式化HTTP请求中的参数，并进行参数校验和权限校验。如校验失败，通过 `redirect` 或 `rewrite` 将控制权再转交回路由器。参数和权限校验，也可以在模型层处理。但必须将这类错误抛出给 `Controller`，由 `Controller` 进行控制权转交，模型层禁止与路由层通讯。
- 标准化数据，以此为输入调用业务逻辑（`PageModel`），得到数据。


## API 

- 用于响应 `json` 或 `jsonp` 数据
- `Controller` 给用户使用（界面化），`API` 给程序使用（纯数据）


## PageModel

- `PageModel` 实现具体业务逻辑，`API` 和 `Controller` 都直接调用 `PageModel`
- `PageModel` 直接调用 `DataModel`，负责`DataModel`间的通讯。
- 一个 `Controller` 只对应一个`PageModel`，一个`PageModel`可以被多个`Controller`或`API`调用。
- `PageModel` 默认调用 `this._execute()` 执行业务逻辑，返回数据的结构为

	```
	{
	    "errorCode": "",
	    "errorMsg": "",
	    "success": true, 
	    "data": {}
	}
	```

	`this._execute()` 调用时进行了异常捕获，出现异常时自动获取异常的 `errorCode` 和 `errorMsg`


## DataModel

- 对 `DaoModel` 的二次封装，实现了基本的数据操作，比如将文本格式化为数据结构等
- 数据库访问的代理者，可以在这一层实现缓存
- 对使用了什么数据库，数据库有哪些表，字段什么含义是透明的。

## DaoModel

- 直接对数据库访问的封装，直接需要了解数据库。
- 无逻辑部分，原子操作

## Database

- 数据库