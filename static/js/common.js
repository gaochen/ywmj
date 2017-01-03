var GC = window.GC || {};

/**
 * Hybind：与移动端的交互方法
 */
GC.Hybind = (function() {
    // 设备检测
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 关闭WebView
    var closePage = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.closePage();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.closePage.postMessage("");
        }
    };

    return {
        closePage: closePage
    };
})();