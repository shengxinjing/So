define('common:widget/ui/storage/local_storage.js', function(require, exports, module){

/** 
 * @file	本地存储封装，支持有效期
 * @author 	zhuyaqiu
 * @date 	2014/03/15
 */ 
 
module.exports = (function () {

    var storage = window.localStorage;
    var available = storage ? true : false;
    var CONST_VALUE = "_val_";
    var CONST_EXPIRE = "_exp_";
    
    //反序列化
    function deserialize(value) {
        if (typeof value != 'string') { 
            return undefined;
        }
        try { 
            return JSON.parse(value);
        }catch(e) { 
            return value || undefined;
        }
    }    
    
    /**
     * @description 设置localstorage值
     * @param {String} key  属性名
     * @param {Object} val 值
     * @param {Num} expires 过期时间(天)，(如要删除则需调用cleanup清理)
     */
    var set = function(key, val, expires) {
        if(!available){
            return;
        }
        if (val === undefined) { 
            return remove(key);
        }
        if( get(key) !== null ){
            remove(key);
        }
        
        if(typeof(expires) === "number"){
            storage.setItem(key, JSON.stringify({"_val_":val,"_exp_":Date.now() + expires * 1000 * 3600 *24}));
        }else{
            storage.setItem(key, JSON.stringify(val));
        }
        return val;
    };
    
    /**
     * @description 获取localstorage值
     * @param {String} key  属性名
     * @return {Object} _value 值
     */
    var get = function(key) { 
        if(!available){
            return undefined;
        }
        var _value = deserialize(storage.getItem(key));
        if (_value && typeof(_value) === "object" && _value.hasOwnProperty("_exp_")) {
            if(_value["_exp_"] > Date.now()){
                return _value["_val_"];
            }else{
                return undefined;
            }
        }
        return _value;
    };
    
    /**
     * @description 删除localstorage值
     * @param {String} key  属性名
     */
    var remove = function(key) { 
        if(!available){
            return;
        }
        storage.removeItem(key);
    };
        
    /**
     * @description 清除localstorage所有值
     */
    var clear = function() { 
        if(!available){
            return;
        }
        storage.clear();
    };
            
    /**
     * @description 获取localstorage所有值
     * @return [object] 所有的localstorage数据
     */
    var getall = function() {
        if(!available){
            return undefined;
        }
        var _ret = {};
        for (var i = 0; i < storage.length; i++) {
            var key = storage.key(i);
            _ret[key] = get(key);
        }
        return _ret;
    };
            
    /**
     * @description 清理过期的localstorage值
     */
    var cleanup = function() {
        if(!available){
            return;
        }
        for (var i = storage.length - 1; i >= 0; i--) {
            var _key = storage.key(i);            
            if(get(_key) === undefined){
                remove(_key);
            }
        }
    };
    
    //初始化时手动清理次过期的值
    cleanup();

    return{
        available: available,    //是否支持localstorage
        set: set,                //设置
        get: get,                //获取
        remove: remove,            //删除
        clear: clear,            //清除所有
        getall: getall,            //获取所有
        cleanup: cleanup        //清理过期
    };
})();


});