$(function() {
    //判断浏览器
    (function() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            $(".wrap").addClass("ios");
        }
    })();

    orderId = null;
    token = null;
    phase = null;

    payInfo();

    // 返回上一页
    $(".title").find("span").on("click", function() {
        dismisDialog();
        closePage();
    });

    // 选择支付方式
    $(".pay-list").find("li").on("click", function() {
        if (!$(this).hasClass("pay-item-wait") && !$(this).hasClass("pay-item-active")) {
            $(this).addClass("pay-item-active").siblings("li").removeClass("pay-item-active");
        }
    });

    // 点击支付
    $(".pay-btn").on("click", function() {
        var payToolType = $(".pay-item-active").data("payToolType");
        payToolType = parseInt(payToolType);

        if (typeof payToolType !== "number" || isNaN(payToolType)) {
            showToast("请选择付款方式！");
            return false;
        }
        
        var api = window.Host.customer+"/case/order/booking/pay";
        $.ajax({
            type: "POST",
            url: api,
            data:JSON.stringify({"orderId":orderId, "payToolType":payToolType, "token":token}),
            dataType: "json",
            contentType: "application/json",
            beforeSend: function() {
                showDialog();
            },
            success: function(data) {
                dismisDialog();
                
                if (data.succ) {
                    window.location.href = data.data;
                }
                else {
                    showToast("付款失败，请返回重试！");
                }
            }
        });

    });


});

/**
 * [payInfoReturn app支付页面接口回调方法]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function payInfoReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    orderId = parseInt(value.orderId);
    token = value.token;
    phase = parseInt(value.payStep);
    
    switch (phase) {
        case 1:
            $(".js-phase").text("预约");
        break;
    }

    var api = window.Host.customer+"/case/order/booking/cashier/"+orderId+"/"+phase;
    $.ajax({
        type: "GET",
        url: api,
        data:{"token":token},
        dataType: "json",
        success: function(data) {
            if (data.succ) {
                $(".js-total").text(data.data.totalAmount);
                $(".js-overplus").text(data.data.dueToPayAmount);
            }
            else {
                showToast("请求付款金额失败，请返回重试！");
            }
        }
    });
}

/**
 * [payInfo app支付页面接口]
 * @return {[type]} [description]
 */
function payInfo() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.payInfo();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.payInfo.postMessage("");
    }
}

/**
 * [showToast 弹出提示信息]
 * @param  {[type]} caseId [description]
 * @return {[type]}        [description]
 */
function showToast(message) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.showToastMessage(message);
    }
    //iOS接口
    if (isiOS) {
        var message = message;
        window.webkit.messageHandlers.toastMessage.postMessage(message);
    }
}

/**
 * [closePage 关闭h5页面]
 * @return {[type]} [description]
 */
function closePage() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.closePage();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.closePage.postMessage("");
    }
}

/**
 * [showDialog 等待提示]
 * @return {[type]} [description]
 */
function showDialog() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.showDialog();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.showDialog.postMessage("");
    }
}

/**
 * [dismisDialog 隐藏提示]
 * @return {[type]} [description]
 */
function dismisDialog() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.dismisDialog();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.dismisDialog.postMessage("");
    }
}