$(function() {
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

    // 点击分批支付
    $(".pay-batch").on("click", function() {
        var payToolType = $(".pay-item-active").data("payToolType");
        payToolType = parseInt(payToolType);
        var payAmount = $(".js-overplus").text();
        payAmount = parseFloat(payAmount);

        if (typeof payToolType !== "number" || isNaN(payToolType)) {
            showToast("请选择付款方式！");
            return false;
        }

        if (payAmount < 300) {
            showToast("金额小于300元，请直接点击去支付！");
            return false;
        }

        var message = {"payToolType":payToolType, "payAmount":payAmount};

        payBatch(message);

    });

    // 点击支付
    $(".pay-btn").on("click", function() {
        var payToolType = $(".pay-item-active").data("payToolType");
        payToolType = parseInt(payToolType);
        var payAmount = $(".js-overplus").text();
        payAmount = parseFloat(payAmount);

        if (typeof payToolType !== "number" || isNaN(payToolType)) {
            showToast("请选择付款方式！");
            return false;
        }
        
        var api = window.Host.customer+"/case/order/pay";
        $.ajax({
            type: "POST",
            url: api,
            data:JSON.stringify({"orderId":orderId,"phase":phase, "payToolType":payToolType, "token":token, "payAmount":payAmount}),
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

    var api = window.Host.customer+"/case/order/cashier/"+orderId+"/"+phase;
    $.ajax({
        type: "GET",
        url: api,
        data:{"token":token},
        dataType: "json",
        success: function(data) {
            if (data.succ) {
                $(".js-total").text(data.data.totalAmount);
                $(".js-overplus").text(data.data.dueToPayAmount);
                $(".js-phase").text(data.data.phaseName);
            }
            else {
                showToast(data.message);
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
 * [payBatch 调用原生分批支付弹出框]
 * @param  {[type]} message [arguments]
 * @return {[type]}         [description]
 */
function payBatch(message) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        var payToolType = message.payToolType;
        var payAmount = message.payAmount;
        window.jsIntelligencer.payBatch(payToolType, payAmount);
    }
    //iOS接口
    if (isiOS) {
        var message = message;
        window.webkit.messageHandlers.payBatch.postMessage(message);
    }
}

/**
 * [showToast 弹出提示信息]
 * @param  {[type]} message [description]
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