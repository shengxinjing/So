define('common:widget/ui/toast/toast.js', function(require, exports, module){

/** 
 * @file   轻量级弹出层提示 toast
		1、弹出toast，默认3000ms后消失，支持指定时间
		2、toast居中显示，同一时刻界面上只能出现一个toast(单例)
		3、toast支持 innerHTML 格式，请确保输入数据安全(防xss)
 * @exports		
 *		create(innerHTML, timeout || 3000)
 *		clear() 
 * @author zhuyaqiu
 * @since  2014/03/11
 */ 
 
module.exports = (function() {

    var TOAST_WIDTH 	= 200;
    
	var _timer, 
		_cacheElem;
    
    /**
     * @desc  创建toast
     * @param {String} innerHTML 		toast显示的文字，支持 innerHTML 格式
     * @param {Number||3000} timeout 	toast超时消失时间，单位(ms)
     * @return null
     */
    var create = function (innerHTML, timeout) {    
		timeout = timeout || 3000;

		var toastElem;	
			
		// initial	
		if (!_cacheElem) {
			toastElem = document.createElement("div");
			toastElem.style.cssText = [
				"position : fixed",
				"z-index : 100",
				"top : 50%",
				"left : 50%",
				
				"width : " + TOAST_WIDTH + "px",
				"padding : 16px 10px",
				"border-radius : 5px",
				"margin : 0 -" + TOAST_WIDTH/2 + "px",
			
				"font-size : 14px",
				"color : #fff",
				"text-align : center",
				"background : rgba(0, 0, 0, 0.7)"
			].join(";");
			document.body.appendChild(toastElem);
			
			_cacheElem = toastElem;
		}
		
		// action
		_cacheElem.innerHTML = innerHTML;
        _cacheElem.style.display = "block";
        
		// reset _timer
        clearTimeout(_timer);
		_timer = setTimeout(clear, timeout);
    };
        
    /**
     * @desc 清除toast
     */
    var clear = function() {
		_cacheElem && (_cacheElem.style.display = "none");
    };
    
    return {
        create: create,	
        clear: 	clear	
    };
})();


});
