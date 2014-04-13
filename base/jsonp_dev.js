function requestScript(src, callback){
    var script = document.createElement('script');
    
    var random = Math.floor(Math.random() * 10000);
    var callbackName = "_cbk" + random;
    
    window[callbackName] = function(result){
        callback(result);
    }
    
    if (src.indexOf('callback=') == -1) {
        var callbackParam = '&callback=' + callbackName;
        // for case:   
        // www.baidu.com?
        // www.baidu.com?a=56&b=87
        if (src.indexOf('=') == -1) {
            callbackParam = callbackParam.slice(1);
        }
        src = src + callbackParam;
    }
    script.src = src;
    script.addEventListener('load', function(e) {
        var t = e.target;
        t.parentNode.removeChild(t);
        delete window[callbackName];
    }, false);
    document.getElementsByTagName('head')[0].appendChild(script);
}