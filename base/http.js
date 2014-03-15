define('common:widget/ui/http/http.js', function(require, exports, module){

/**
 * @file
 * 		1、QueryString 转换为 Object
 *		2、生成特定查询字符串
 *		3、支持查询参数多选功能(JS数组展现)、'+' 转 ' '
 * @author 		zhuyaqiu
 * @date		2013-09-06	
 * @modify		2014-03-13
 * @exports		
 *				create
 *				parse 
 *				reject
 * @example 	create(oldQs, newQs)	==> {QueryString} 创建新 queryString, newQs 会覆盖 oldQs 中同名字段  
 * @example		create(newQs)         	==> {QueryString} 同上 (oldQs 默认为当前页面的 queryString)
 * @example     parse()					==> {Object} 返回当前页面queryString的对象格式
 * @example    	parse(queryString)		==> {Object} 返回指定queryString的对象格式
 * @example		reject(queryString, predict)	==>	{queryStrinng} 进行过滤后的queryString,支持字符串，字符串数组和回调函数
 * @example		reject(predict)					==> {queryStrinng} 同上，queryString 默认为当前页面的 queryString
 * @notice      
		1、默认情况下, queryString 是编码格式的, queryStringObj 是解码格式的
		2、支持一key多值, 如 dd=4&dd=5, 表示多选，对应数据为 dd : [4, 5]
*/

var _extend = function (initObj, extObj) {
	var retObj = {},
		key;
	
	for (key in initObj) {
		retObj[key] = initObj[key];
	}
	
	for (key in extObj) {
		retObj[key] = extObj[key];
	}
	
	return retObj;
};

/**
 * @desc 		QueryString 转换为 Object
 * @param 		{QueryString} 	queryString     queryString	
 * @param 		{Boolean|opt} 	noDecode     	是否需要对 queryString 解码，方便程序操作
 * @return 		{PlainObject}					返回查询字符串的对象格式
 * @test		parseQs(dd-%26d=1+d&dd-%26d=&dd-%26d=%E4%B8%AD%E6%96%87&dd-%26d=4&ddd=555+888)
 * @test		parseQs()
*/
function parseQs(queryString, noDecode) {
	queryString = queryString || window.location.search.substring(1);
	
	var pairs = queryString.split("&");
	var ret = {};
	
	for (var i = 0, len = pairs.length; i < len; i++) {
		
		var pair 	= pairs[i].split("="),
			key 	= noDecode ? pair[0] : decodeURIComponent(pair[0]),
			value;
		
		if (value = pair[1]) {
			value = (noDecode ? value : decodeURIComponent(value).replace(/\+/g, ' '));    // "+" 2 " "
			
			if (ret[key] === undefined) {
				ret[key] = value;
			} else {             				// case for mutiple check
				if (typeof ret[key] !== 'object') {
					ret[key] = [ret[key]];
				}
				ret[key].push(value); 
			}
		}
	}
	
	return ret;
}

/**
 * @desc 		Object 转换为 QueryString
 * @param 		{PlainObject} 	queryStringObj	合法的查询字符串的JS对象
 * @param 		{Boolean|opt} 	noEncode     	是否需要对 queryString 编码 
 * @return 		{QueryString}					查询字符串
 * @example		stringifyQs({kk : 'test'})
*/
function stringifyQs(queryStringObj, noEncode) {
	var arr = [],
		key, value;
		
	for (key in queryStringObj) { 
		value = queryStringObj[key];
		key = noEncode ? key : encodeURIComponent(key);
		
		if (!value) continue;
		
		if (typeof value !== "object") {
			arr.push(key + "=" + (noEncode ? value : encodeURIComponent(value)));
		} else {
			for (var i = 0, len = value.length; i < len; i++) {
				value[i] && arr.push(key + "=" + (noEncode ? value[i] : encodeURIComponent(value[i])));
			}
		}
	}
	
	return arr.join("&").replace(/\%20/g, '+');
}

/**
 * @desc  		生成特定查询字符串, 同名参数覆盖
 * @param 		{QueryString|PlainObject} 	oldQs 	
 * @param 		{QueryString|PlainObject} 	newQs
 * @return  	{QueryString}
 * @test		stringifyQs({kk : 'test'})
 * @test		stringifyQs('dd=444&kgn=k', {kk : 'test'})
*/
var createQs = function (oldQs, newQs) {
	if (newQs === undefined) {
		newQs = oldQs;
		oldQs = window.location.search.substring(1);
	}
	
	if (typeof oldQs === "string") {
		oldQs = parseQs(oldQs);
	}
	if (typeof newQs === "string") {
		newQs = parseQs(newQs);
	}
	
	var Qs = _extend(oldQs, newQs);
	
	return stringifyQs(Qs);
};


/** 
 * @desc	过滤指定 queryString 中的指定字段，支持回调函数
 * @param	{QueryString|opt}					queryString
 * @param 	{String|Array<String>|function}		predict
 * @return 	{QueryString}						过滤字段后的queryString
 * @test	reject("dd=4556&db=8309485&a=d", "dd")
 * @test	reject("dd=4556&db=8309485&a=d", ["dd", "a"])
 * @test	reject("dd=4556&db=8309485&a=d", function (value, key) { return (key == "dd") ? true : false; })
 */
var reject = function (queryString, predict) {
	
	if (arguments.length === 1) {
		predict = queryString;
		queryString = window.location.search.substring(1);
	}
	
	var queryStringObj = parseQs(queryStringObj);
	
	for (var key in queryStringObj) {
		
		switch (typeof predict) {
			case "string": 
				if (key === predict) {
					queryStringObj[key] = "";
				}
				break;
			case "object":
				if (predict.indexOf && predict.indexOf(key) >= 0) {
					queryStringObj[key] = "";
				}
				break;
			case "function" :
				if (predict(queryStringObj[key], key) === true) {
					queryStringObj[key] = "";
				}
				break;
		}
	}
	
	return stringifyQs(queryStringObj);
}

module.exports = {
	create	: createQs,
	parse	: parseQs,
	reject	: reject
};


});