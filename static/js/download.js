$(function() {
    new FastClick(document.body);

    wxTips();

    // 关闭微信提示
    $(".wxTips").on("click", function() {
        $(this).hide();
    });

    // 关闭底部下载提示层
    $(".bottom-close").on("click", function(ev) {
        ev.stopPropagation();
        $(".wrap").find(".bottom").remove();
    });
});

/**
 * [wxTips 微信提示从浏览器打开]
 * @return {[type]} [description]
 */
function wxTips() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    // 判断是否为微信
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    $(".js-download").on("click", function() {
        // 是否在微信内打开
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            $(".wxTips").show();
            return false;
        }
    
        //Android接口
        if (isAndroid) {
            _czc.push(["_trackEvent","下载按钮","安卓设备","分享案例"]); 
            window.location.href = "http://o7zlnyltf.bkt.clouddn.com/app-ywmj-release.apk";           
        }
        //iOS接口
        if (isiOS) {
            _czc.push(["_trackEvent","下载按钮","iOS设备","分享案例"]);
            window.location.href = "http://itunes.apple.com/us/app/id1133878484";
        }
    });
}