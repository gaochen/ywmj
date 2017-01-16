$(function() {
    var userType = GC.Lib.GetQueryString("userType");  // 判断C端还是E端
    var source = GC.Lib.GetQueryString("source");  // 判断来源是推客信息还是资金信息

    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybind.dismisDialog();
        if (source == "2") {
            GC.Hybind.closePage();
        }
        else {
            window.location.href = window.Host.local + "funds.html?source=1";
        }
    });

    (function() {
        // 从localStorage获取sessionToken
        var storage = window.localStorage;
        var sessionToken = storage.getItem("sessionToken");

        // 添加银行卡
        $(".bankCards-add").on("click", function() {
            GC.Hybind.showDialog();
            var url = window.Host.customer+"/account/bankCard";

            $.ajax({
                type: "POST",
                url: url,
                data:{"sessionToken":sessionToken},
                dataType: "json",
                success: function(res) {
                    GC.Hybind.dismisDialog();
                    if (res.succ) {
                        window.location.href = data.data;
                    }
                    else {
                        GC.Hybind.showToast(res.message);
                        if (res.stateCode == 336) {
                            GC.Hybind.closePage();
                        }
                    }
                }
            });

        });

        // 请求银行卡列表
        var api = window.Host.customer+"/account/bankCards";

        GC.Hybind.showDialog();

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken,"onlyDebitCard": false},
            dataType: "json",
            success: function(res) {
                GC.Hybind.dismisDialog();
                if (res.succ) {

                    if (!res.data) {
                        $(".bankCards-tips").show();
                        return false;
                    }

                    var arr = res.data;

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
                    GC.Hybind.showToast(res.message);
                    if (res.stateCode == 336) {
                        GC.Hybind.closePage();
                    }
                }
            }
        });
    })();
});
