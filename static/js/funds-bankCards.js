$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybind.dismisDialog();
        window.history.go(-1);
    });

    // 添加银行卡
    $(".bankCards-add").on("click", function() {
        window.location.href = window.Host.local + "funds-"
    });

    // 测试
    // (function() {
    //     var arr = [
    //         {
    //             "bindId": "1",
    //             "bankName": "中国银行",
    //             "bankLogo": "http://o8nljewkg.bkt.clouddn.com/o_1avb77a0p19m91mc4m8i8tu18qi7.jpg?imageView2/1/w/100/h/100",
    //             "bankCardTypeDesc": "储蓄卡",
    //             "bankCardNumber": "2541 **** **** 5246",
    //             "limitInfoDto": {
    //                 "limitPerOp": 1000,
    //                 "limitPerDay": 1000,
    //                 "limitPerMonth": 1000
    //             }
    //         }
    //     ];

    //     $.each(arr, function(i, index) {
    //         var oLi = $('<li></li>');
    //         var str = '<div data-bind-id='+index.bindId+' class="bankCards-logo">';
    //             str += '<div style="background-image:url('+index.bankLogo+')"></div>';
    //             str += '</div>';
    //             str += '<div class="bankCards-info">';
    //             str += '<h4>'+index.bankName+'</h4>';
    //             str += '<p>'+index.bankCardTypeDesc+'</p>';
    //             str += '<span>'+index.bankCardNumber+'</span>';
    //             str += '</div>';

    //         oLi.html(str).appendTo($(".bankCards-list"));

    //         oLi.on("click", function() {
    //             var storage = window.localStorage;
    //             var bankCard=JSON.stringify(index);
    //             storage.setItem("bankCard",bankCard);

    //             window.location.href = window.Host.local+"funds-bankCardsInfo.html";
    //         });
           
    //     });
    // })();

    (function() {
        // 从localStorage获取sessionToken
        var storage = window.localStorage;
        var sessionToken = storage.getItem("sessionToken");

        // 请求银行卡列表
        var api = window.Host.customer+"/account/bankCards";

        GC.Hybind.showDialog();

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken,"onlyDebitCard": false},
            dataType: "json",
            success: function(data) {
                GC.Hybind.dismisDialog();
                if (data.succ) {

                    if (!(data.data instanceof Array)) {
                        $(".bankCards-tips").show();
                        return false;
                    }

                    var arr = data.data;

                    $.each(arr, function(i, index) {
                        var oLi = $('<li></li>');
                        var str = '<div data-bind-id='+index.bindId+' class="bankCards-logo">';
                            str += '<div style="background-image:url('+index.bankLogo+')"></div>';
                            str += '</div>';
                            str += '<div class="bankCards-info">';
                            str += '<h4>'+index.bankName+'</h4>';
                            str += '<p>'+index.bankCardTypeDesc+'</p>';
                            str += '<span>'+index.bankCardNumber+'</span>';
                            str += '</div>';

                        oLi.html(str).appendTo($(".bankCards-list"));

                        oLi.on("click", function() {
                            var storage = window.localStorage;
                            var bankCard=JSON.stringify(index);
                            storage.setItem("bankCard",bankCard);

                            window.location.href = window.Host.local+"funds-bankCardsInfo.html";
                        });
                       
                    });
                }
                else {
                    GC.Hybind.showToast(data.message);
                }
            }
        });
    })();
});

/**
 * [getTokenReturn 获取token]
 * @param  {[type]} ticket [description]
 * @return {[type]}       [description]
 */
function getTokenReturn(ticket) {
    sessionToken = ticket;

    var api = window.Host.customer+"/account/bankCards";

    $.ajax({
        type: "GET",
        url: api,
        data:{"sessionToken":sessionToken},
        dataType: "json",
        success: function(data) {
            if (data.succ) {

                if (!(data.data instanceof Array)) {
                    $(".bankCards-tips").show();
                    return false;
                }

                var arr = data.data;

                $.each(arr, function(i, index) {
                    var oLi = $('<li></li>');
                    var str = '<div data-bind-id='+index.bindId+' class="bankCards-logo">';
                        str += '<div style="background-image:url('+index.bankLogo+')"></div>';
                        str += '</div>';
                        str += '<div class="bankCards-info">';
                        str += '<h4>'+index.bankName+'</h4>';
                        str += '<p>'+index.bankCardTypeDesc+'</p>';
                        str += '<span>'+index.bankCardNumber+'</span>';
                        str += '</div>';

                    oLi.html(str).appendTo($(".bankCards-list"));

                    oLi.on("click", function() {
                        
                    });
                   
                });
            }
            else {
                GC.Hybind.showToast(data.message);
            }
        }
    });

}
