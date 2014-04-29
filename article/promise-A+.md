## 通俗表述。

A 有一个任务，需要 B 提供数据， B 提供的数据需要 C 提供数据后进行一定处理后才能产出。

因此 B，C 各自有一个耗费时间的任务，每个任务即可能是正在进行中，也可能是任务成功得到了相关数据，也可能是任务失败并告知失败原因。

C 接到消息后，开始进行任务 c 。 任务 c 花费了一段时间后终于有了结果（要么成功要么失败）。 C 把这个任务的结果立刻告诉了 B  。 

如果不论任务结果如何，B 都是直接把这个结果转交给 A 的话，那就比较简单。 这是一种情况。

还有一种情况，就是根据任务 c 的结果， B 会针对性的进行处理。比如， 如果 c 是成功结果，那个 B 可能对 c 得出的结果进行一定耗时的处理(任务 b)， 完成后再把任务 b 的结果立刻告诉 A 。 同样，即使任务 c 是失败的结果， B 也可能对失败结果进行耗时处理（另一任务 b1），并将 b1 的处理结果转告给 A（如果 c 失败而b1 成功，A 只知道这件事成功了）。 

也就是说，任务 c 的结果可能是成功，也可能失败。 对于任何一种结果， B 有两种选择，对结果进行处理并将处理结果转告给 A; 或者直接将 c 的处理结果转告给 A。 而 A 只关心 B 给它什么结果，而不管 C 的结果如何，也不管 C 怎么给 B 沟通。

## 1. Terminology

* `promise` is an `object` or `function` with a then method whose behavior conforms to this specification.
* `thenable` is an object or function that defines a then method.
* `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
* `exception` is a value that is thrown using the `throw` statement.
* `reason` is a value that indicates why a promise was rejected.


## 2. Promise States

A promise must be in one of three states: `pending`, `fulfilled`, or `rejected`.

When `pending`, a promise: 
> may transition to either the `fulfilled` or `rejected` state.

When `fulfilled`, a promise: 
> must not transition to any other state. 
> must have a value, which must not change.

When `rejected`, a promise: 
> must not transition to any other state. 
> must have a reason, which must not change.

Here, "must not change" means immutable identity (i.e. ===), but does not imply deep immutability.


## 3. The `then` Method

> A promise must provide a then method to access its current or eventual value or reason.

A promise's `then` method accepts two arguments:

        promise.then(onFulfilled, onRejected)

Both `onFulfilled` and `onRejected` are optional arguments:

1. If `onFulfilled` is not a function, it must be ignored.
2. If `onRejected` is not a function, it must be ignored.
3. If `onFulfilled` is a function:
    * it must be called after promise is fulfilled, with promise's value as its first argument.
    * it must not be called before promise is fulfilled.
    * it must not be called more than once.
4. If `onRejected` is a function:
    * it must be called after promise is rejected, with promise's reason as its first argument.
    * it must not be called before promise is rejected.
    * it must not be called more than once.
5. `onFulfilled` or `onRejected` must not be called until the execution context stack contains only platform code. [3.1].
6. `onFulfilled` and `onRejected` must be called as functions (i.e. with no this value). [3.2]
7. `then` may be called multiple times on the same promise.
    * If/when promise is fulfilled, all respective `onFulfilled` callbacks must execute in the order of their originating calls to then.
    * If/when promise is rejected, all respective `onRejected` callbacks must execute in the order of their originating calls to then.
8. `then` must return a promise.

        promise2 = promise1.then(onFulfilled, onRejected);

    * If either `onFulfilled` or `onRejected` __returns a value x__, run the Promise Resolution Procedure _Resolve(promise2, x)_.
    * If either `onFulfilled` or `onRejected` __throws an exception e__, promise2 must be __rejected__ with e as the reason.
    * If `onFulfilled` is __not a function__ and promise1 is __fulfilled__, promise2 must be __fulfilled__ with the same value.
    * If `onRejected` is __not a function__ and promise1 is __rejected__, promise2 must be __rejected__ with the same reason.

## 4. example
> promise2 = promise1.then(onFulfilled, onRejected);

### case1: `onFulfilled`/`onRejected` is not a function
__result:__ trigger the same event with the sanme value/reason

    var Promise = require("mpromise");
    var promise1 = new Promise();
    
    global.setTimeout(function (){
        promise1.fulfill("这里传递fulfill的value,可以支持多个参数！")
    }, 10000) 
    
    var promise2 = promise1.then();
    
    promise2.onFulfill(function(data){
        console.log("data: " + data);
    });
    
    // return 
    // "data: 这里传递fulfill的value,可以支持多个参数！"

### case2: `onFulfilled`/`onRejected` throws an exception e

    var Promise = require("mpromise");
    var promise1 = new Promise();
    
    global.setTimeout(function (){
        promise1.fulfill("这里传递fulfill的value,可以支持多个参数！")
    }, 10000) 
    
    var promise2 = promise1.then(function(data){
        console.log("data: " + data);
        throw new Error('如果抛出一个error, promise2 能接收到该error,并用reject 处理该error');
    });
    
    promise2.onReject(function(err){
        console.log("err: " + err.message);
    });
  
    // return 
    // "data: 这里传递fulfill的value,可以支持多个参数！"
    // "err: 如果抛出一个error, promise2 能接收到该error,并用reject 处理该error"  
    
## 5. The Promise Resolution Procedure

The promise resolution procedure is an abstract operation _taking as input a `promise` and a `value`_, which we denote as _Resolve(promise, x)_. 
> If `x` is a `thenable`, it attempts to make `promise` adopt the state of `x`, under the assumption that x behaves at least somewhat like a promise. 
> Otherwise, it `fulfills` `promise` with the value `x`.

This treatment of `thenables` allows promise implementations to interoperate, as long as they expose a Promises/A+-compliant `then` method. It also allows Promises/A+ implementations to "assimilate" nonconformant implementations with reasonable `then` methods.

To run _Resolve(promise, x)_, perform the following steps:

1. If `promise` and `x` refer to the same object, `reject` `promise` with a TypeError as the reason.
2. If `x` is a `promise`, adopt its state [3.4]:
    * If `x` is pending, promise must remain pending until x is fulfilled or rejected.
    * If/when `x` is fulfilled, fulfill promise with the same value.
    * If/when `x` is rejected, reject promise with the same reason.
3. Otherwise, if `x` is an object or function,
    1. Let `then` be `x.then`. [3.5]
    2. If retrieving the property `x.then` results in a thrown exception `e`, reject `promise` with `e` as the reason.
    3. If `then` is a function, call it with `x` as `this`, first argument     `resolvePromise`, and second argument `rejectPromise`, where:
        * If/when `resolvePromise` is called with a value y, run _Resolve(promise, y)_.
        * If/when `rejectPromise` is called with a reason r, reject promise with r.
        * If both `resolvePromise` and `rejectPromise` are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
        * If calling `then` throws an exception e,
            * If `resolvePromise` or `rejectPromise` have been called, ignore it.
            * Otherwise, `reject` `promise` with e as the reason.
    4. If `then` is not a function, fulfill promise with x.
4. If `x` is not an object or function, `fulfill` `promise` with x.

If a promise is resolved with a thenable that participates in a circular thenable chain, such that the recursive nature of _Resolve(promise, thenable)_ eventually causes _Resolve(promise, thenable)_ to be called again, following the above algorithm will lead to infinite recursion. Implementations are encouraged, but not required, to detect such recursion and reject promise with an informative TypeError as the reason.

## 6. _Resolve(promise, x)_ implementation
### code

    // promise status depends on x
    function resolve(promise, x) {
    	var then, 
    		type, 
    		done,
    		reject_,
    		resolve_;
    		
    	type = typeof x;
    	
    	if (promise===x) {
    		return promise.reject(newTypeError("promise and x are the same"));
    	}
    	
    	if (x && (then = x.then) && ('function' == typeof then) {
    		try {
    			resolve_ = function() {
    				var args = slice(arguments);
    				resolve.apply(this, [promise].concat(args));
    			};
    			
    			reject_ = promise.reject.bind(promise);
    			
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
    			if (promise.ended) {
    				throw err;
    			}	
    			return promise.reject(err);
    		}
    	}
    	
    	promise.fulfill(x);
    }

### example 
    var promise1 = new Promise();
    promise2 = promise1.then(function fulfill(data) {
        var promise3 = new Promise();
        return promise3;
    });
    
### analysis
    
这里存在三个 promise 实例，promise1、promise2、promise3.

when the promise1 fulfills ，invoke the callback `fulfill`, which returns the promise3. promise2's status changes depending on the status changing on promise3. if promise3 fulfills with a `value`, then promise2 fulfills with the same `value`. if promise3 reject with a `reason`, then promise2 rejects with the same `reason`.

if the callback `fulfill` returns a `value` which is not thenable(promise must be thenabel, but thenable object/function may not be a promise), then fulfill promise2 with the same `value`. 
    