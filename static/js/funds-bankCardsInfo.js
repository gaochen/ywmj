$(function() {

    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybind.dismisDialog();
        window.history.go(-1);
    });

    // 从localStorage提取当前银行卡信息
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    var json = storage.getItem("bankCard");
    var data = JSON.parse(json);

    $(".bankCardsInfo-logo").find("div").css("backgroundImage","url("+data.bankLogo+")");
    $(".bankCardsInfo-name").text(data.bankName+data.bankCardTypeDesc);
    $(".bankCardsInfo-number").text(data.bankCardNumber);

    if (!data.limitInfoDto) {
        $(".js-limitPerOp").text("无限额数据，请等待更新");
    }
    else if (typeof data.limitInfoDto.limitPerOp === "number" && data.limitInfoDto.limitPerOp !== -1) {
        $(".js-limitPerOp").text("¥ "+data.limitInfoDto.limitPerOp);
    }
    else if (data.limitInfoDto.limitPerOp === -1) {
        $(".js-limitPerOp").text("无限额");
    }

    if (!data.limitInfoDto) {
        $(".js-limitPerDay").text("无限额数据，请等待更新");
    }
    else if (typeof data.limitInfoDto.limitPerDay === "number" && data.limitInfoDto.limitPerDay !== -1) {
        $(".js-limitPerDay").text("¥ "+data.limitInfoDto.limitPerDay);
    }
    else if (data.limitInfoDto.limitPerDay === -1) {
        $(".js-limitPerDay").text("无限额");
    }

    if (!data.limitInfoDto) {
        $(".js-limitPerMonth").text("无限额数据，请等待更新");
    }
    else if (typeof data.limitInfoDto.limitPerMonth === "number" && data.limitInfoDto.limitPerMonth !== -1) {
        $(".js-limitPerMonth").text("¥ "+data.limitInfoDto.limitPerMonth);
    }
    else if (data.limitInfoDto.limitPerMonth === -1) {
        $(".js-limitPerMonth").text("无限额");
    }
    
    $(".bankCardsInfo-btn").on("click", function() {
        // 判断是否已经验证支付密码
        var token = GC.Lib.GetQueryString("token");

        GC.Hybind.showDialog();

        if (token) {
            // 解绑
            var api = window.Host.customer+"/account/bankCard/"+data.bindId;

            $.ajax({
                type: "GET",
                url: api,
                data:{"sessionToken":sessionToken, "token":token},
                dataType: "json",
                success: function(data) {
                    GC.Hybind.dismisDialog();
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
                type: "POST",
                url: api,
                data:{"sessionToken":sessionToken, "bindId":data.bindId},
                dataType: "json",
                success: function(data) {
                    GC.Hybind.dismisDialog();
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
