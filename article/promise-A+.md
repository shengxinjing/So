# Promise/A+ 规范

## 通俗表述

    A 是一项耗时任务，需由任务B提供基础数据，任务B也是一项耗时任务，需由任务C提供基础数据。

任务B、C都是一个耗时任务，任务有三种状态

 1. **任务进行中**，对输入数据进行处理
 2. **任务完成**，输出处理后数据，供上层处理
 3. **任务失败**，输出失败原因，供上层处理

C任务最终的返回结果，有两种情况，dataC 或者 errC。
B任务接受到数据时（C任务必须在任务完成后告知B，并传递有效信息给B），有两个选择：

 1. 对C提交的数据(dataC|errC)进行处理(可异步，也可同步), 完成后告知任务A并相关数据(dataB|errC)
 2. 直接将C的数据转交给A(dataC|errC)

对上面的任务描述，进行抽象： `依赖拓扑关系的消息传递`

## 1. 术语

* `promise` is an `object` with a `then` method whose behavior conforms to this specification.
* `thenable` is an object that defines a then method.
* `value` is any legal JavaScript value.
* `exception` is a value that is thrown using the `throw` statement.
* `reason` is a value that indicates why a promise was rejected.


## 2. Promise States

A promise must be in one of three states: `pending`, `fulfilled`, or `rejected`.

When `pending`, a promise: 
> may transition to either the `fulfilled` or `rejected` state.

When `fulfilled`, a promise: 
> must not transition to any other state. 
> must have a `value`, which must not change.

When `rejected`, a promise: 
> must not transition to any other state. 
> must have a `reason`, which must not change.

Here, "must not change" means immutable identity (i.e. ===), but does not imply deep immutability. (引用不可变，而非 deepEqual)


## 3. The `then` Method

> A promise must provide a then method to access its current or eventual value or reason.

A promise's `then` method accepts two arguments:

        promise.then(onFulfilled, onRejected)

Both `onFulfilled` and `onRejected` are optional arguments:

1. If `onFulfilled` is not a `function`, it must be ignored.
2. If `onRejected` is not a `function`, it must be ignored.
3. If `onFulfilled` is a function:
    * it must be called after promise is `fulfilled`, with promise's `value` as its first argument.
    * it must not be called before promise is fulfilled.
    * it must not be called more than once.
4. If `onRejected` is a function:
    * it must be called after promise is `rejected`, with promise's `reason` as its first argument.
    * it must not be called before promise is rejected.
    * it must not be called more than once.
5. `onFulfilled` or `onRejected` must not be called until **the execution context stack contains only platform code**.
6. `onFulfilled` and `onRejected` must **be called as functions** (i.e. with no this value).
7. `then` may be called multiple times on **the same** `promise`.
    * If/when `promise` is `fulfilled`, all respective `onFulfilled` callbacks must execute in the order of their originating calls to `then`.
    * If/when `promise` is `rejected`, all respective `onRejected` callbacks must execute in the order of their originating calls to `then`.
8. **`then` must return a `promise`**.

        promise2 = promise1.then(onFulfilled, onRejected);

    * If either `onFulfilled` or `onRejected` __returns a value x__, run the Promise Resolution Procedure __Resolve(promise2, x)__.
    * If either `onFulfilled` or `onRejected` __throws an exception e__, promise2 must be __rejected__ with `e` as the reason.
    * If `onFulfilled` is __not a function__ and promise1 is __fulfilled__, promise2 must be __fulfilled__ with the same `value`.
    * If `onRejected` is __not a function__ and promise1 is __rejected__, promise2 must be __rejected__ with the same `reason`.

## 4. example

> promise2 = promise1.then(onFulfilled, onRejected);

### case1: `onFulfilled`/`onRejected` is not a function

__result:__ trigger the same event with the same `value` / `reason`

```javascript
var Promise = require("mpromise");
var promise1 = new Promise();

global.setTimeout(function (){
    promise1.fulfill("这里传递fulfill的value,可以支持多个参数！")
}, 10000); 

var promise2 = promise1.then();

promise2.onFulfill(function(data){
    console.log("data: " + data);
});

// "data: 这里传递fulfill的value,可以支持多个参数！"
```

### case2: `onFulfilled`/`onRejected` throws an `exception` e

```javascript
var Promise = require("mpromise");
var promise1 = new Promise();

global.setTimeout(function (){
    promise1.fulfill("这里传递fulfill的value,可以支持多个参数！")
}, 10000);

var promise2 = promise1.then(function onFulfilled(data){
    console.log("data: " + data);
    throw new Error('抛出 exception, promise2 能接收到该对象, 并调用 reject');
});

promise2.onReject(function(err){
    console.log("err: " + err.message);
});

// "data: 这里传递fulfill的value,可以支持多个参数！"
// "err: 抛出 exception, promise2 能接收到该对象, 并调用 reject"  
```
    
## 5. The Promise Resolution Procedure

The promise resolution procedure is an abstract operation __taking as input a `promise` and a `value`__, which we denote as __Resolve(promise2, x)__. 

> If `x` is a `thenable`, it attempts to make `promise2` adopt the state of `x`, under the assumption that x behaves at least somewhat like a promise. 
> Otherwise, it `fulfills` `promise` with the value `x`.

This treatment of `thenables` allows promise implementations to interoperate, as long as they expose a Promises/A+-compliant `then` method. It also allows Promises/A+ implementations to "assimilate" nonconformant implementations with reasonable `then` methods.

To run __Resolve(promise2, x)__, perform the following steps:

1. If `promise2` and `x` refer to the same object, `reject` `promise2` with a TypeError as the `reason`.
2. If `x` is a `promise`, adopt its state:
    * If `x` is pending, `promise2` must remain `pending` until `x` is `fulfilled` or `rejected`.
    * If/when `x` is `fulfilled`, `fulfill` `promise2` with the same `value`.
    * If/when `x` is `rejected`, `reject` `promise2` with the same `reason`.
3. Otherwise, if `x` is an object or function:
    1. try Let `then` be `x.then`.
    2. If retrieving the property `x.then` results in a thrown exception `e`, reject `promise2` with `e` as the `reason`.
    3. If `then` is a function, call it with `x` as `this`, first argument     `resolvePromise`, and second argument `rejectPromise`, where:
        * If/when `resolvePromise` is called with a `value` `y`, run __Resolve(promise2, y)__.
        * If/when `rejectPromise` is called with a `reason` `r`, `reject` `promise2` with `r`.
        * If both `resolvePromise` and `rejectPromise` are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
        * If calling `then` throws an `exception` `e`,
            * If `resolvePromise` or `rejectPromise` have been called, ignore it.
            * Otherwise, `reject` `promise2` with `e` as the `reason`.
    4. If `then` is not a function, `fulfill` `promise2` with x.
4. If `x` is not an object or function, `fulfill` `promise2` with `x`.

If a `promise` is `resolved` with a `thenable` that participates in a circular `thenable` chain, such that the recursive nature of __Resolve(promise, thenable)__ eventually causes __Resolve(promise, thenable)__ to be called again, following the above algorithm will lead to infinite recursion. Implementations are encouraged, but not required, to detect such recursion and reject promise with an informative TypeError as the `reason`.

## 6. __Resolve(promise, x)__ implementation

```javascript
// promise status depends on x
function resolve(promise, x) {
	var then, 
		type, 
		done,
		reject_,
		resolve_;
		
	type = typeof x;
	
	if (promise === x) {
		return promise.reject(newTypeError("promise and x are the same"));
	}
	
	if (x && (then = x.then) && ('function' == typeof then) {
		try {
		    // 递归 resolve
			resolve_ = function() {
				var args = slice(arguments);
				resolve.apply(this, [promise].concat(args));
			};
			
			reject_ = promise.reject.bind(promise);
			
			// done only once
			done = false;
			
			return then.call(x, function fulfill() {
				if (done) return;
				done = true;
				return resolve_.apply(this, arguments);
			}, function reject() {
				if (done) return;
				done = true;
				return reject_.apply(this, arguments);
			});
		} catch(err) {
			if (done) return;
			done = true;
			
			// 神马意思？
			if (promise.ended) {
				throw err;
			}	
			
			return promise.reject(err);
		}
	}
	
	promise.fulfill(x);
}
```    
    

### example 

```javascript
var promise1 = new Promise();

promise2 = promise1.then(function fulfill(data) {
    var promise3 = new Promise();
    return promise3;
});
```    
    
### analysis
    
存在三个 promise 实例，promise1、promise2、promise3.

when the promise1 fulfills ，invoke the callback `fulfill`, which returns promise3.

promise2's status changes depending on the status changing on promise3. if promise3 fulfills with a `value`, then promise2 fulfills with the same `value`. if promise3 reject with a `reason`, then promise2 rejects with the same `reason`.

if the callback `fulfill` returns a `value` which is not thenable(promise must be thenabel, but thenable object/function may not be a promise), then fulfill promise2 with the same `value`. 

## 7.注意

    promise.fulfill(data) 时, data值避免返回为一个 promise 对象。

因为会有意外的逻辑存在，还是以程序可控为第一要旨。
    