$(function() {
    // 从localStorage获取sessionToken
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    var balance = storage.getItem("balance");

    // 可提现总金额
    $(".drawCash-total").find("span").text(balance);

    // 点击全部体现
    $(".drawCash-total").find("a").on("click", function() {
        $(".drawCash-input").val(balance);
    });

    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    // 银行卡列表
    (function() {
        // 请求银行卡列表
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
    })();


    // 弹出银行卡选择
    $(".recharge-checked").on("click", function() {
        $(".selectBank-mask").show();
    });

    // 取消银行卡选择
    $(".selectBank-btns-cancel").on("click", function() {
        $(".selectBank-mask").hide();
    });

    // 阻止下一层滚动
    (function() {
        var oUl = document.querySelector(".selectBank-list");
        oUl.addEventListener('touchmove', function (event) {
            event.preventDefault();
        },false);
    })();

    // 关闭弹出框
    $(".selectBank-mask").on("click", function() {
        $(this).hide();
    });
    $(".selectBank-frame").on("click", function(ev) {
        ev.stopPropagation();
    });
});

/**
 * [getTokenReturn 获取token]
 * @param  {[type]} ticket [description]
 * @return {[type]}       [description]
 */
function getTokenReturn(ticket) {
    token = ticket;

    var api = window.Host.customer+"/account/bankCards";

    $.ajax({
        type: "GET",
        url: api,
        data:{"token":token},
        dataType: "json",
        success: function(data) {
            if (data.succ) {
                $.each(data, function(i, index) {
                    var oLi = $('<li></li>');
                    var str = '<div data-bind-id='+index.bindId+' class="bankCards-logo">';
                        str += '<div style="backgroundImage:url('+index.bankLogo+')"></div>';
                        str += '</div>';
                        str += '<div class="bankCards-info">';
                        str += '<h4>'+index.bankName+'</h4>';
                        str += '<p>'+index.bankCardTypeDesc+'</p>';
                        str += '<span>'+index.bankCardNumber+'</span>';
                        str += '</div>';

                    oLi.html(str).appendTo($(".bankCards-list"));

                    oLi.on("click", function(index) {
                        // 存储当前银行卡信息
                        var storage=window.localStorage;
                        var data = JSON.stringify(index);
                        storage.setItem("data", data);

                        window.location.href = window.Host.local+"funds-bankCardsInfo.html";

                    })
                });
            }
            else {
                GC.Hybind.showToast(data.message);
            }
        }
    });

}
