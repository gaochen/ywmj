var GC = window.GC || {};

/**
 * Hybind：与移动端的交互方法
 */
GC.Hybind = (function() {
    // 设备检测
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //获取tokne,回调getTokenReturn
    var getToken = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.getToken();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.getToken.postMessage("");
        }
    };

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

    /**
     * [showToast 弹出提示信息]
     * @param  {[type]} caseId [description]
     * @return {[type]}        [description]
     */
    var showToast = function (message) {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.showToastMessage(message);
        }
        //iOS接口
        if (isiOS) {
            var message = message;
            window.webkit.messageHandlers.toastMessage.postMessage(message);
        }
    };

    /**
     * [showDialog 等待提示]
     * @return {[type]} [description]
     */
    var showDialog = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.showDialog();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.showDialog.postMessage("");
        }
    };

    /**
     * [dismisDialog 隐藏提示]
     * @return {[type]} [description]
     */
    var dismisDialog = function() {
        //Android接口
        if (isAndroid) {
            window.jsIntelligencer.dismisDialog();
        }
        //iOS接口
        if (isiOS) {
            window.webkit.messageHandlers.dismisDialog.postMessage("");
    }
    }

    return {
        closePage: closePage,
        getToken: getToken,
        showToast: showToast,
        showDialog: showDialog,
        dismisDialog: dismisDialog
    };
})();

/**
 * Lib：通用库
 */
GC.Lib = (function() {
    /**
     * [GetQueryString 获取url参数]
     * @param {[type]} name [参数名称]
     */
    var GetQueryString = function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };

    /**
     * [toDouble 个位数字添0]
     * @param  {[type]} iNum [数字参数]
     */
    var toDouble = function(iNum) {
        if (iNum < 10) {
            return '0' + iNum;
        } else {
            return '' + iNum;
        }
    };

    /**
     * [setTime 通用时间格式转换]
     * @param {[type]} para [时间戳]
     */
    var setTime = function (para) {
        var newTime = new Date(para);
        var result=newTime.getFullYear()+"."+toDouble(newTime.getMonth()+1)+"."+toDouble(newTime.getDate()) + " " + toDouble(newTime.getHours()) + ":" + toDouble(newTime.getMinutes()) + ":" + toDouble(newTime.getSeconds());
        return result;
    };

    return {
        GetQueryString: GetQueryString,
        toDouble: toDouble,
        setTime: setTime,
    }
})();