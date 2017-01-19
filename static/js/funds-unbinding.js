$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybind.dismisDialog();
        window.history.go(-1);
    });

    // 从localStorage提取当前银行卡信息
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    var userType = storage.getItem("userType");
    var apiHost = null;

    // 判断APP是C端还是E端
    if (userType === "e") {
        apiHost = window.Host.employee;
    }
    else if (userType === "c") {
        apiHost = window.Host.customer;
    }
    else {
        GC.Hybind.showToast("访问出错，请重试");
        GC.Hybind.closePage();
    }

    //　从url参数获取token
    var token = GC.Lib.GetQueryString("token");
    var bindId = GC.Lib.GetQueryString("bindId");
    var requestNo = GC.Lib.GetQueryString("requestNo");
    // 解绑
    var api = apiHost+"/account/bankCard/"+bindId;

    GC.Hybind.showDialog();

    $.ajax({
        type: "POST",
        url: api,
        data:{"sessionToken":sessionToken, "token":token, "requestNo":requestNo},
        dataType: "json",
        success: function(res) {
            GC.Hybind.dismisDialog();
            if (res.succ) {
                GC.Hybind.showToast("解绑成功");
            }
            else {
                GC.Hybind.showToast(res.message);
                if (res.stateCode == 336) {
                    setTimeout(function() {
                        GC.Hybind.closePage();
                    }, 3000);
                }
            }
            window.location.href = window.Host.local + "funds-bankCards.html";
        }
    });   
});