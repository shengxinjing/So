define('common:widget/ui/http/http.js', function(require, exports, module){
    /**
     * @file
     *      1、QueryString 转换为 Object
     *      2、生成特定查询字符串
     *      3、支持查询参数多选功能(JS数组展现)、'+' 转 ' '
     * @author      zhuyaqiu
     * @exports     
     *          create([oldQs,] newQs)
     *          parse([queryString]) 
     *          reject([queryString,] predict)
     * @notice      
     *       1、默认情况下, queryString 是编码格式的, queryStringObj 是解码格式的
     *       2、支持一key多值, 如 dd=4&dd=5, 表示多选，对应数据为 dd : [4, 5]
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
     * @desc        QueryString 转换为 Object
     * @param       {QueryString=}      queryString     queryString 
     * @param       {boolean=false}     noDecode        是否需要对 queryString 解码，方便程序操作
     * @return      {QueryStringObject}                 返回查询字符串的对象格式
     * @test        parseQs(dd-%26d=1+d&dd-%26d=&dd-%26d=%E4%B8%AD%E6%96%87&dd-%26d=4&ddd=555+888)
     */
    function parseQs(queryString, noDecode) {
        if (queryString === void(0)) queryString = window.location.search.substring(1);

        var pairs = queryString.split("&");
        var ret = {};
        
        for (var i = 0, len = pairs.length; i < len; i++) {
            
            var pair    = pairs[i].split("="),
                key     = noDecode ? pair[0] : decodeURIComponent(pair[0]),
                value;
            
            // important 
            if (value = pair[1]) {
                value = (noDecode ? value : decodeURIComponent(value).replace(/\+/g, ' '));    // "+" 2 " "
                
                if (ret[key] === void(0)) {
                    ret[key] = value;
                } else {                            // case for mutiple check
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
     * @desc        Object 转换为 QueryString
     * @param       {PlainObject}   queryStringObj  合法的查询字符串的JS对象
     * @param       {Boolean|opt}   noEncode        是否需要对 queryString 编码 
     * @return      {QueryString}                   查询字符串
     * @example     stringifyQs({kk : 'test'})
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
     * @desc        生成特定查询字符串, 同名参数覆盖
     * @param       {QueryString|PlainObject}   oldQs   
     * @param       {QueryString|PlainObject}   newQs
     * @return      {QueryString}
     * @test        stringifyQs({kk : 'test'})
     * @test        stringifyQs('dd=444&kgn=k', {kk : 'test'})
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
     * @desc    过滤指定 queryString 中的指定字段，支持回调函数
     * @param   {QueryString=}                      queryString
     * @param   {string|Array<string>|function}     predict
     * @return  {QueryString}                       过滤字段后的queryString
     */
    var reject = function (queryString, predict) {
        // arguments handler
        if (arguments.length === 1) {
            predict     = queryString;
            queryString = window.location.search.substring(1);
        }
        
        // convert to Object
        var queryStringObj = parseQs(queryStringObj);
        
        // handler
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
                default:
                    throw new TypeError("only accept right type!");
            }
        }
        
        // convert to String
        return stringifyQs(queryStringObj);
    }

    module.exports = {
        create  : createQs,
        parse   : parseQs,
        reject  : reject
    };
});