define('common:widget/ui/cookie/cookie.js', function(require, exports, module){

/**
 * @desc	cookie 操作
 * @refer	mootools/
 * @author	zhuyaqiu
 * @data	2014-03-14
 * @export
			set(key, value, expiresByDay, domain, path)
			get(key)
			remove(key)
 * @notice 
		1、cookie在同一域名的不同port共享的，需注意
		2、key命名请使用合法字符，避免出错(建议：[a-zA-Z][\w-]*)
		3、value : encodeURIComponent/decodeURIComponent
		4、服务器端在发送 cookie 时，cookie值自动进行 URL 编码; 接收时自动进行 URL 解码
**/
module.exports = {
	/** 
	 * @desc	设置 cookie，或删除 cookie
	 * @param  	{String} key      			cookie 键名
	 * @param  	{String|opt} value    		cookie 键值; 缺省时执行 remove 操作
	 * @param  	{Number|opt} expiresByDay	cookie 有效期(天); 缺省时有效期为会话期间
	 * @param  	{String|opt} domain        	cookie 域名; 缺省时为该参数(当前域名)
	 * @param  	{String|opt} path			cookie 路径; 缺省时为网站根目录("/")
	 * @return	{String|undefined}        	cookie 键值(已encodeURIComponent编码)
	 * @test	set('TGCITY', 'ddd');
	*/
	set : function(key, value, expiresByDay, domain, path) {
		domain 	= domain || "";
		path 	= path || "/";
		
		if (value === void(0) && value === "") {     	// remove
			value = void(0);
			expiresByDay = -1;
		} else {										// setter
			value = encodeURIComponent(value);
		}
		
		if (expiresByDay === void(0)) {
			document.cookie = key + "=" + value + ";path=" + path + ";domain=" + domain;
		} else {
			var date = new Date();
			date.setTime(date.getTime() + expiresByDay * 1000 * 3600 * 24);
			document.cookie = key + "=" + value +";expires=" + date.toUTCString() +";path=" + path + ";domain=" + domain;
		}
		
		return value;
	},
	
	/** 
	 * @desc	获取 cookie 值
	 * @param	{String} key      		cookie 键名
	 * @return	{String|undefined}		cookie 键值
	 * @test 	get("TGCITY")
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
		
		return;
	},
	
	/**
	 * @desc	删除 cookie 值
	 * @param  	{String} key      			cookie 键名
	 * @param  	{String|opt} domain    		cookie 域名，缺省时为无域名参数
	 * @param  	{String|opt} path			cookie 路径，缺省时为网站根目录("/")
	 * @test	remove("TGCITY")
	*/
	remove : function (key, domain, path) {
		this.set(key, "", -1, domain, path);
	}
};

});