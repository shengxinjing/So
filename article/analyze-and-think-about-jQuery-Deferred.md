源码版本： jQuery 1.9.1

## jQuery.Deferred

> The Deferred object, introduced in jQuery 1.5, is a chainable utility object created by calling the jQuery.Deferred() method. It can register multiple callbacks into callback queues, invoke callback queues, and relay the success or failure state of any synchronous or asynchronous function.

`jQuery.Deferred` 的设计理念来自 `CommonJS Promises/A`, `jQuery.Deferred` 基于这个理念实现，但并没有完全遵循其设计。

`Promise`，代表单个操作的最终结果。一个 `Promise` 拥有三种状态：`unfulfilled`、`fulfilled`、`failed`。`Promise` 可以从 `unfulfilled` 变为 `fulfill` 或 `failed`，一旦 `Promise` 处于 `fulfill` 或者 `failed` 状态，其状态不可再变化。这种“不可改变”的特性使得 `Promise` 的整体设计非常简单和直观。

每个`Promise`实例都有一个方法：`then(fulfilledCallback, errorCallback)`，用于实现控制反转。

## 三个 Callbacks

deferred 对象内部由三个 jQuery.Callbacks 实例组成，定义分别如下：

```
// fireAPI,  addCallBackAPI, callbacksInstance,               convert2State
[ "resolve", "done",     new jQuery.Callbacks("once memory"), "resolved" ],
[ "reject",  "fail",     new jQuery.Callbacks("once memory"), "rejected" ],
[ "notify",  "progress", new jQuery.Callbacks("memory") ]
```

第一个队列用于存储该 `deferred` 实例 `fulfill` 时的回调队列（Callbacks）。这个队列（Callbacks）的 `fire()/fireWith()` 方法通过 `deferred.resolve()/resolveWith()` 接口间接调用。队列的 `add()` 方法外接成 `deferred.promise()` 的 `done()` API，第二个，第三个队列同理。

## Callbacks 队列的初始化状态

```
if (tuple[3]) {                    
	//resolved | rejected | undefined
	list.add(function () {
	      state = tuple[3];
	}, tuples[i ^ 1][2].disable, tuples[2][2].lock);   
}
```

我们可以发现，deferred 对象的 doneList 已经存在了三个回调函数，第一个函数用于改变当前 deferred 对象的状态，第二个函数禁用 failList，第三个函数锁定 processList。 这样，就实现了上面提到的 CommonJS Promises/A 理念，避免 deferred 对象的状态多次变化。

## API

deferred 对象 API

- `resolve()/resolveWith()`
- `reject()/rejectWith()`
- `notify()/notifyWith()`

promise 对象 API

- `done()`
- `fail()`
- `progress()`
- `then()`。

如果希望获得promise对象，直接调用 `deferred.promise()` ，参数缺省时的返回值就是 promise 对象。

## 标准使用

我们利用函数的封装特性，在函数中创建 `deferred` 对象，并返回 `deferred.promise()` ，这种方法对于函数参数 和 `this` 都没有限制。

```
function createPromise(){
	var deferred = new jQuery.Deferred();
	// 函数体代码
	return deferred.promise();
}
```

## How to implement `promise.then`

```javascript
Promise.prototype.then = function(fulfilledCallback, rejectedCallback){
    var promise = this;
    var newPromise = new Promise(function(resolve, reject){

        promise.done(function(result){
            var returned;

            if (!fulfilledCallback) {
                resolve(result);
                return;
            }

            try {
                returned = fulfilledCallback.call(null, result);

                // if a promise
                if (returned && typeof returned.then === "function") {
                    returned.done(function(_result){
                        resolve(_result);
                    });
                    returned.fail(function(_err){
                        reject(_err);
                    });
                } else {
                    resolve(returned);
                }
            } catch (error) {
                reject(error);
            }
        });


        promise.fail(function(err){
            var returned;

            if (!rejectedCallback) {
                reject(err);
            }

            try {
                returned = rejectedCallback.call(null, err);

                // if a promise
                if (returned && typeof returned.then === "function") {
                    returned.done(function(_result){
                        resolve(_result);
                    });
                    returned.fail(function(_err){
                        reject(_err);
                    });
                } else {
                    resolve(returned);
                }
            } catch (error) {
                reject(error);
            }
        });
        
    });

    return newPromise;
};

```

## how to Implement `Promise.all`

jQuery.when() 可以用于监测多个 deferred 对象，函数返回一个 newDefer。

当所有 deferred 对象状态都变为 resolved 时会触发 newDefer.resolve。若其中一个 deferred 对象状态变为 rejected 时就会触发 newDefer.reject。

```
Promise.all = function(){
    var promiseArr = arguments.slice();
    var remaining  = promiseArr.length;
    var resolveValues = [];

    var newPromise = new Promise(function(resolve, reject){

        promiseArr.forEach(function(promise, index){

            promise.done(function(result){
                resolveValues[index] = result;

                remaining--;
                if (remaining === 0) {
                    resolve(resolveValues);
                }
            });

            promise.fail(function(error){
                reject(error);
            });

        });
    });

    return newPromise;
};
```