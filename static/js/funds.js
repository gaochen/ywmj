$(function() {
    // 初始化localStorage
    var storage = window.localStorage;

    // 获取APP类型
    var userType = GC.Lib.GetQueryString("userType");

    if (userType) {
        storage.setItem("userType",userType);
    }
    else {
        userType = storage.getItem("userType");
    }

    // 获取sessionToken，设置userType、source
    GC.Hybind.getToken();

    // 从localStorage获取sessionToken
    var sessionToken = storage.getItem("sessionToken");
    var apiHost = null;

    // 判断APP是C端还是E端
    if (userType === "e") {
        $(".funds-recharge").hide();
        apiHost = window.Host.employee;
    }
    else if (userType === "c") {
        apiHost = window.Host.customer;
    }
    else {
        GC.Hybind.showToast("访问出错，请重试");
        GC.Hybind.closePage();
    }

    // 关闭WebView
    $(".title").find("span").on("click", function() {
        GC.Hybind.closePage();
    });

    // 取消
    $(".funds-btns-cancel").on("click", function() {
        $(".funds-mask").hide();
    });

    // 确认
    $(".funds-btns-confirm").on("click", function() {
        $(".funds-mask").hide();
        GC.Hybind.showDialog();
        var api = apiHost+"/account/auth"; 

        $.ajax({
            type: "POST",
            url: api,
            data:{"sessionToken":sessionToken, "source":1},
            dataType: "json",
            success: function(res) {
                GC.Hybind.dismisDialog();
                if (res.succ) {
                    window.location.href = res.data;
                }
                else {
                    GC.Hybind.showToast(res.message);
                    if (res.stateCode == 336) {
                        setTimeout(function() {
                            GC.Hybind.closePage();
                        }, 3000);
                    }
                }
            }
        });
    });

    // 关闭弹出框
    $(".funds-mask").on("click", function() {
        $(this).hide();
    });
    $(".funds-frame").on("click", function(ev) {
        ev.stopPropagation();
    });

    // 请求余额
    (function() {
        GC.Hybind.showDialog();
        var api = apiHost+"/account";

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken},
            dataType: "json",
            success: function(res) {
                GC.Hybind.dismisDialog();
                if (res.succ) {
                    var data = res.data;

                    storage.setItem("balance", data.balance);
                    $(".js-balance").text(data.balance);
                    $(".js-frozenCapital").text(data.frozenCapital);

                    var authorized = data.authorized;

                    // 跳转明细
                    $(".funds-link").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-detail.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转充值
                    $(".funds-recharge").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-recharge.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转银行卡
                    $(".funds-banks").on("click", function() {
                        if (authorized) {
                            window.location.href = window.Host.local + "funds-bankCards.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                    // 跳转提现
                    $(".funds-drawCash").on("click", function() {
                        if (authorized) {
                            if (data.balance == 0) {
                                GC.Hybind.showToast("余额为零，无法提现！")
                            }
                            else {
                                // 需要首先验证支付密码
                                var api = apiHost+"/account/payCode/3";

                                GC.Hybind.showDialog();

                                $.ajax({
                                    type: "POST",
                                    url: api,
                                    data:{"sessionToken":sessionToken},
                                    dataType: "json",
                                    success: function(res) {
                                        GC.Hybind.dismisDialog();
                                        if (res.succ) {
                                            // 跳转页面
                                            window.location.href = res.data;
                                        }
                                        else {
                                            GC.Hybind.showToast(res.message);
                                            if (res.stateCode == 336) {
                                                setTimeout(function() {
                                                    GC.Hybind.closePage();
                                                }, 3000);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                }
                else {
                    GC.Hybind.showToast(res.message);
                    if (res.stateCode == 336) {
                        setTimeout(function() {
                            GC.Hybind.closePage();
                        }, 3000);
                    }
                }
            }
        });
    })();

});

/**
 * [getTokenReturn 获取token]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
function getTokenReturn(token) {
    var sessionToken = token;
    // localStorage存储sessionToken
    var storage = window.localStorage;
    storage.setItem("sessionToken",sessionToken);
    storage.setItem("source", "1");
}