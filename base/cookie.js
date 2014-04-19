define('common:widget/ui/cookie/cookie.js', function(require, exports, module){
    /**
     * @file    cookie 操作
     * @author  zhuyaqiu
     * @data    2014-03-14
     * @export
            set(key, value, expiresByDay, domain, path)
            get(key)
            remove(key)
     * @notice 
            1、cookie在同一域名不同port是共享的
            2、key命名请使用合法字符(建议：[a-zA-Z][\w-]*)
            3、value : encodeURIComponent/decodeURIComponent
    **/
    module.exports = {
        /** 
         * @desc    设置 cookie，或删除 cookie
         * @param   {string}    key             cookie 键名
         * @param   {string=}   value           cookie 键值; 缺省时执行 remove 操作
         * @param   {number=}   expiresByDay    cookie 有效期(天); 缺省时有效期为会话期间
         * @param   {string=}   domain          cookie 域名; 缺省时为当前域名
         * @param   {string=}   path            cookie 路径; 缺省时为域名根目录("/")
         */
        set : function(key, value, expiresByDay, domain, path) {
            path = path || "/";
            
            if (value === void(0) || value === "") {        // remove
                value           = "";
                expiresByDay    = -1;
            } else {                                        // setter
                value = encodeURIComponent(value);
            }
            
            if (expiresByDay === void(0)) {
                document.cookie = key + "=" + value 
                                + (domain ? ";domain=" + domain : "")
                                + ";path=" + path; 
            } else {
                var date = new Date();
                date.setTime(date.getTime() + expiresByDay * 1000 * 3600 * 24);
                document.cookie = key + "=" + value 
                                + ";expires=" + date.toUTCString() 
                                + (domain ? ";domain=" + domain : "")
                                + ";path=" + path; 
            }
        },
        
        /** 
         * @desc    获取 cookie 值
         * @param   {string}        key     cookie 名
         * @return  {string|null}           cookie 值
         */
        get : function (key) {
            var cookies = document.cookie.split(";");
            var _key = key + "=";
                
            for (var i = 0, len = cookies.length; i < len; i++) {
                var pairs = cookies[i].trim();
                if (pairs.indexOf(_key) === 0) {
                    return decodeURIComponent(pairs.replace(_key, ""));
                }
            }
            
            return null;
        },
        
        /**
         * @desc    删除 cookie 值
         * @param   {string}    key         cookie 键名
         * @param   {string=}   domain      cookie 域名，缺省时为无域名参数
         * @param   {string=}   path        cookie 路径，缺省时为网站根目录("/")
         */
        remove : function (key, domain, path) {
            this.set(key, "", -1, domain, path);
        }
    };
});