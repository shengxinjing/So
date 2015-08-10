## 1. generator function

ES6 引入的新概念和对应语法，`generator function` 是指其返回值为 `generator` 的一类函数，其形式与一般函数不同，必须在 `function` 关键字后直接跟一个`*` 来表示该函数是一个 `generator function`。`generator function` 函数内部支持 `yield` 操作符。如下

```javascript
function *(){
	var res = [];
	var a = Promise.resolve(1);
	var b = Promise.resolve(2);
	res[1] = yield a;
	res[2] = yield b;

	console.log(res);
}
``` 

### 关于 yield 操作符
 
> [rv] = yield [expression];
> The yield keyword is used to pause and resume a generator function
> 
>- expression
Defines the value to return from the generator function via the iterator protocol. If omitted, undefined is returned instead.
>- rv
Lets the generator capture the value of expression for use the next time it resumes execution.

yield 操作符可以分三个部分

- 右侧表达式的值，同时暂停 `generator function` 的执行
- 左侧 `yield` 操作后的返回值，同时恢复 `generator function` 的执行
- 中间的数据处理，以其右侧表达式值作为输入，以左侧返回值为输出


## 2. generator

> 调用 `generator function` 函数，程序将返回一个 `generator`。

`generator` 遵循 `iterator protocal`（遍历器协议），该协议定义了三个方法

- `next()`
- `throw()`
- `return()`

`generator` 通过 `next()` API来驱动其遍历的过程，而 `yield` 操作符划分了遍历的每个阶段。

当遇到 `yield` 操作符，遍历的一个阶段结束，`next()` 返回对应 `yield` 操作符的右侧表达式的值。

开发者对该返回值进行数据处理（可以同步，也可以异步），完成后得到新数据 `handledData`，然后再次调用 `next(handledData)`，从原有中断位置继续执行遍历，并将处理后的数据作为 `yield` 操作的返回值。如此反复，直到 `generator` 完成遍历，即 `generator function` 函数执行完成。

### `next()`

`next()` 函数返回一个对象，该对象有且仅有两个属性

- `value`，表示对应 `yield` 操作符处其右侧表达式的值
- `done`，表示遍历器是否已完成遍历，`boolean` 值

## 3. 例子（应用）

```javascript
function createAsyncTask(val) {
	var callback = null;
	var finished = false;

	return {
		addCallback: function(cb) {
			callback = cb;

			if (finished) {
				callback();
			}
		},
		runTask: function(){
			window.setTimeout(function(){
				console.log(val);
				finished = true;

				if (callback) {
					callback();
				}
			}, 5000);
		}
	};
}


var gen = function* () {
	var a = yield createAsyncTask('hello world!');
	return a;
};
var g = gen();


var ret = g.next();
// console.log(ret);
// output --> {value: Object, done: false}
ret.value.runTask();
ret.value.addCallback(function(){
	console.log('callback called');
	
	// 继续遍历，可以返回一个自定义的字符串
	var ret = g.next('新的输入值');
	// console.log(ret.value);
	// output --> "新的输入值"
	// console.log(ret.done);
	// output --> true
});
```

上面例子，我们可以看到 `generator function` 和 `yield` 的作用。
我们发现，这样的异步编程似乎仍不够清晰。
用 `generator` 来异步编程是否还能够简化呢？

## 4. 原因分析

上面例子中的异步编程，我们可以分成三个部分来看待。

- 第一部分，单个异步任务API的定义，对应的是函数函数 `createAsyncTask`。
- 第二部分，是 `generator function` 的编写。
- 第三部分，是 `generator` `next()` 的调用，也即遍历过程。

第一部分，在实际开发环境中，往往有现成的API，因此并不需要我们花太多心思。
第二部分，实际上就是业务逻辑，应该成为我们重点关注也是唯一关注的地方。
第三部分，我们可以通过约定的方法来实现自动的遍历过程，而不需要我们每次编写。

因此，我们期望的结果应该如下：

```javascript
// 自动遍历执行
autoRun(function* () {
	var a = yield createAsyncTask('hello world!');
	return a;
});
```

## 5. thunk

从我们最熟悉的API说起。

> `fs.readFile(filename[, options], callback)`

thunk 是一个约定。

thunk 是指一个函数，其有且仅有一个入参，且该参数是一个函数。该函数的第一入参是 `error` 对象，第二入参是一个正常数据，与上面 `fs.readFile` API 中的 `callback` 相同。

以 `fs.readFile` 为例，将其改成 thunk 函数，可以这样做：

```javascript
var readFileThunkGen = function(fileName, options) {
	var options = options || {};

	// return a thunk
	return function(callback) {
		fs.readFile(fileName, options, callback);
	}
}

// readFileThunk 就是一个 thunk
var readFileThunk = readFileThunkGen('a.txt');

// thunk 应该这么用
readFileThunk(function callback(err, fileContent){
	// doSomething;
});
```

对上面过程进行再次抽象，可以得到这样一个函数：

```
function thunkify(fn, cxt) {
	// return a thunkGenerator
	return function() {
		var args = [].slice.call(arguments);

		// return a thunk
		return function(callback) {
			fn.apply(cxt, args.concat(callback)); 
		}
	}
}

var readFileThunk = thunkify(fs.readFile)('a.txt');
readFileThunk(function callback(err, fileContent){
	// doSomething;
});
```


## 让 `generator` 自动遍历

如果约定， `yield` 操作符右侧表达式的值都是一个 thunk。那么，也就是说，`next()` 返回值的 `value` 属性都是一个 thunk。

```javascript
function autoRun(gen) {
  var iterator = gen();

  function next(err, data) {
	  var result = iterator.next(data);
	  
	  if (result.done) {
		  return;
	  } else {
	  	  result.value(next);
	  }
  }

  next(null, null);
}

autoRun(gen);
```

## thunkify 库实现 `thunkify(fn)`

thunkify 库做了额外的处理

## co 库实现 `autoRun(gen)`

co 库做了额外的处理

## 异步编程

```
var fs = require('fs');
var thunkify = require('thunkify');
var co = require('co');
var readFile = thunkify(fs.readFile);

var gen = function* (){
	var r1 = yield readFile('/etc/fstab');
	console.log(r1.toString());
	var r2 = yield readFile('/etc/shells');
	console.log(r2.toString());
};

co(gen);
```