$(function() {
    var userType = GC.Lib.GetQueryString("userType");

    if (userType === "e") {
        $(".funds-recharge").hide();
    }

    // 关闭WebView
    $(".title").find("span").on("click", function() {
        GC.Hybind.closePage();
    });

    // 获取sessionToken
    GC.Hybind.getToken();

    // 从localStorage获取sessionToken
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    console.log(sessionToken);

    // 取消
    $(".funds-btns-cancel").on("click", function() {
        $(".funds-mask").hide();
    });

    // 确认
    $(".funds-btns-confirm").on("click", function() {
        $(".funds-mask").hide();
        GC.Hybind.showDialog();
        var api = window.Host.customer+"/account/auth"; 

        $.ajax({
            type: "POST",
            url: api,
            data:{"sessionToken":sessionToken, "source":1},
            dataType: "json",
            success: function(data) {
                if (data.succ) {
                    window.location.href = data.data;
                    GC.Hybind.dismisDialog();
                }
                else {
                    GC.Hybind.dismisDialog();
                    GC.Hybind.showToast(data.message);
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
        var api = window.Host.customer+"/account";

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken},
            dataType: "json",
            success: function(data) {
                if (data.succ) {
                    var data = data.data;

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
                            window.location.href = window.Host.local + "funds-drawCash.html";
                        }
                        else {
                            $(".funds-mask").show();
                        }
                    });

                }
                else {
                    GC.Hybind.showToast("请求余额："+data.message);
                }
            }
        });
    })();

    // 提现认证
    // (function() {   
    //     // 需要首先验证支付密码
    //     var api = window.Host.customer+"/account/payCode/3";

    //     $.ajax({
    //         type: "GET",
    //         url: api,
    //         data:{"sessionToken":sessionToken},
    //         dataType: "json",
    //         success: function(data) {
    //             if (data.succ) {
    //                 // 跳转页面
    //                 window.location.href = data.data;
    //             }
    //             else {
    //                 GC.Hybind.showToast(data.message);
    //             }
    //         }
    //     });
    // })();

});

function getTokenReturn(token) {
    var sessionToken = token;
    GC.Hybind.showToast("alert:"+sessionToken);
    // localStorage存储sessionToken
    var storage = window.localStorage;
    storage.setItem("sessionToken",sessionToken);
}