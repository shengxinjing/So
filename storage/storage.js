define('common:widget/ui/storage/storage.js', function(require, exports, module){

/** 
 * @file	本地存储封装，支持有效期
 * @author 	zhuyaqiu
 * @date 	2014/03/15
 * @exports
			setItem(key, valueStr[, expiresByDays])  ==> valueStr
			setItem(key, valueObj[, expiresByDays])  ==> valueObj
			getItem(key)  ==>  valueStr|valueObj|null
			removeItem()
			clear()
			getAll()
			cleanup()
			available
 */ 
 
module.exports = (function () {

    var storage 		= window.localStorage,
		available 		= storage ? true : false;
    
	var CONST_VALUE 	= "__val",
		CONST_EXPIRE 	= "__exp";
    
    /**
	 * @desc	JSON.parse
	 * @private
	 * @param 	{String}		value	JSON.stringify 或 一般 string
	 * @return	{JSON|String}
	*/
    function _deserialize(value) {
        try { 
            return JSON.parse(value);
        } catch(e) { 
            return value;
        }
    }    
    
    /**
     * @desc	设置 localStorage 值
     * @param 	{String} 		key  	属性名
     * @param 	{String|Object} value 	属性值
     * @param 	{Number|opt} 	expiresByDays 过期时间(天)，如要删除则需调用cleanup. 默认无过期时间
	 * @return 	{any}		
     */
    var setItem = function (key, value, expiresByDays) {
        if (!available) {
            return;
        }
        
		if (typeof value !== "string" && typeof value !== "object") {
			throw new Error("`" + value + "` is not the valid value, only support String or Object");
		}
		
        if (typeof expiresByDays === "number") {
			var tmpObj = {};
			
			tmpObj[CONST_VALUE]  = value;
			tmpObj[CONST_EXPIRE] = +Date.now() + expiresByDays * 1000 * 3600 *24;
		
            storage.setItem(key, JSON.stringify(tmpObj));
        } else {
            storage.setItem(key, (typeof value === "object") ? JSON.stringify(value) : value);
        }
		
        return value;
    };
    
    /**
     * @desc	获取localStorage值
     * @param 	{String} 				key  			属性名
     * @return 	{Object|String|null} 	localStorage	属性值
     */
    var getItem = function(key) { 
        if (!available) {
            return;
        }
		
		// _value值的四种场景，1、字符串   2、JSON 数据    3、带过期信息的JSON数据   4、null
		// 注意： storage.getItem 返回两类数据， null or 字符串(含空字符串)
		// 使用了 trick，即JSON.parse(null) === null
        var _value = _deserialize(storage.getItem(key));
		
        if (_value && typeof _value === "object" && _value.hasOwnProperty(CONST_EXPIRE)) {
            if (_value[CONST_EXPIRE] > +Date.now()) {
                return _value[CONST_VALUE];
            } else {
				removeItem(key);
                return null;
            }
        }
		
        return _value;
    };
    
    /**
     * @desc 	删除localStorage值
     * @param 	{String} 			key		属性名
     */
    var removeItem = function(key) { 
        if (!available) {
            return;
        }
		
        storage.removeItem(key);
    };
        
    /**
     * @desc 	清除localStorage所有值
     */
    var clear = function() { 
        if (!available) {
            return;
        }
		
        storage.clear();
    };
            
    /**
     * @desc 	获取localStorage所有值
     * @return 	{Object} 	所有 localStorage 数据
     */
    var getAll = function () {
        if (!available) {
            return;
        }
		
        var _ret = {},
			keys = [];
		
		for (var i = 0, len = storage.length; i < len; i++) {
			keys.push(storage.key(i));
		}
		
        for (i = 0, len = keys.length; i < len; i++) {
            var key 	= keys[i],
				value 	= getItem(key);
			
			if (value !== null) {
				_ret[key] = value;
			}
        }
		
        return _ret;
    };
            
    /**
     * @desc	清理过期的localStorage值
     */
    var cleanup = function() {
        if (!available) {
            return;
        }
		
		getAll();
    };
    
    cleanup();

    return {
        available	: available,    	//是否支持localstorage
        setItem		: setItem,      	//设置
        getItem		: getItem,         	//获取
        removeItem	: removeItem,      	//删除
        clear		: clear,            //清除所有
        getAll		: getAll,       	//获取所有
        cleanup		: cleanup        	//清理过期
    };
	
})();


});