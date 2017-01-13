$(function() {

    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    // 从localStorage提取当前银行卡信息
    var storage = window.localStorage;
    var json = storage.getItem("bankCard");
    var data = JSON.parse(json);

    $(".bankCardsInfo-logo").find("div").css("backgroundImage","url("+data.bankLogo+")");
    $(".bankCardsInfo-name").text(data.bankName+data.bankCardTypeDesc);
    $(".bankCardsInfo-number").text(data.bankCardNumber);
    $(".js-limitPerOp").text("¥ "+data.limitInfoDto.limitPerOp);
    $(".js-limitPerDay").text("¥ "+data.limitInfoDto.limitPerDay);
    $(".js-limitPerMonth").text("¥ "+data.limitInfoDto.limitPerMonth);
    
    $(".bankCardsInfo-btn").on("click", function() {
        // 判断是否已经验证支付密码
        var token = GC.Lib.GetQueryString("token");

        if (token) {
            // 解绑
            var api = window.Host.customer+"/account/bankCard/"+data.bindId;

            $.ajax({
                type: "GET",
                url: api,
                data:{"sessionToken":sessionToken, "token":token},
                dataType: "json",
                success: function(data) {
                    if (data.succ) {
                        GC.Hybind.showToast("解绑成功");
                        window.location.href = window.Host.local + "/funds-bankCards.html";
                    }
                    else {
                        GC.Hybind.showToast(data.message);
                    }

                }
            });   

        }
        else {
            // 需要首先验证支付密码
            var api = window.Host.customer+"/account/payCode/7";

            $.ajax({
                type: "GET",
                url: api,
                data:{"sessionToken":sessionToken},
                dataType: "json",
                success: function(data) {
                    if (data.succ) {
                        // 跳转页面
                        window.location.href = data.data;
                    }
                    else {
                        GC.Hybind.showToast(data.message);
                    }
                }
            });   
        }

    }); 

});
