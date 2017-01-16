$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        GC.Hybind.dismisDialog();
        window.history.go(-1);
    });

    // 从localStorage获取sessionToken
    var storage = window.localStorage;
    var sessionToken = storage.getItem("sessionToken");
    var payTool = null;
    var bindId = null;

    // 请求银行卡列表
    (function() {
        // 请求银行卡列表
        var api = window.Host.customer+"/account/bankCards";

        GC.Hybind.showDialog();

        $.ajax({
            type: "GET",
            url: api,
            data:{"sessionToken":sessionToken,"onlyDebitCard": true},
            dataType: "json",
            success: function(res) {
                GC.Hybind.dismisDialog();

                if (res.succ) {
                    if (!res.data) {
                        // 无银行卡，使用新卡支付
                        payTool = "3";
                        bindId = -1;

                        var str = '<div class="recharge-checked-frame">';
                        str += '<p class="recharge-checked-newCard">使用新卡支付</p>';
                        str += '</div>';
                        $(".recharge-checked").html(str);
                    }
                    else {
                        var arr = res.data;

                        // 默认选中第一个银行卡
                        payTool = "2";
                        bindId = arr[0].bindId;

                        var number = arr[0].bankCardNumber.substr(-4);
                        var str = '<div class="recharge-checked-frame">';
                        str += '<div class="recharge-checked-oldCard">';
                        str += '<span class="recharge-checked-icon" style="background-image:url('+arr[0].bankLogo+')"></span>';
                        str += '<p class="recharge-checked-bankName">'+arr[0].bankName+'</p>';
                        str += '<p class="recharge-checked-bankCard">尾号'+number+' 储蓄卡</p>';
                        str += '</div>';
                        str += '<span class="recharge-checked-arrow"></span>';
                        str += '</div>';
                        $(".recharge-checked").html(str);

                        $.each(arr, function(i, index) {
                            var number = index.bankCardNumber.substr(-4);

                            var oLi = $('<li class="selectBank-bankCard" data-bind-id="'+index.bindId+'"></li>');
                            var str = '<span class="selectBank-bankCard-icon" data-imgUrl="'+index.bankLogo+'" style="background-image:url('+index.bankLogo+')"></span>';
                                str += '<p class="selectBank-bankCard-bankName">'+index.bankName+'</p>';
                                str += '<p class="selectBank-bankCard-bankNumber">尾号'+number+' 储蓄卡</p>';
                                str += '<span class="selectBank-bankCard-checked"></span>';

                            oLi.html(str).insertBefore($(".selectBank-newCard"));

                            // 判断是否选中
                            if (bindId == index.bindId) {
                                oLi.addClass("active");
                            }

                            oLi.on("click", function() {
                                var self = $(this);
                                if (!self.hasClass("active")) {
                                    self.addClass("active").siblings("li").removeClass("active");
                                }
                            });
                           
                        });
    
                        // 选择新卡
                        $(".selectBank-newCard").on("click", function() {
                            var self = $(this);
                            if (!self.hasClass("active")) {
                                self.addClass("active").siblings("li").removeClass("active");
                            }
                        });

                        // 弹出银行卡选择
                        $(".recharge-checked").on("click", function() {
                            $(".selectBank-mask").show();
                        });

                        // 取消银行卡选择
                        $(".selectBank-btns-cancel").on("click", function() {
                            $(".selectBank-mask").hide();
                        });

                        // 确认银行卡选择
                        $(".selectBank-btns-confirm").on("click", function() {
                            var selectData = {};
                            var selectNode = $(".selectBank-list").find(".active");

                            selectData.bindId = selectNode.attr("data-bind-id");
                            bindId = selectData.bindId;

                            if (selectData.bindId == "-1") {
                                payTool = "3";
                                var str = '<div class="recharge-checked-frame">';
                                str += '<span class="recharge-checked-arrow"></span>';
                                str += '<p class="recharge-checked-newCard">使用新卡支付</p>';
                                str += '</div>';
                                $(".recharge-checked").html(str);
                            }
                            else {
                                payTool = "2";

                                var bankLogo = selectNode.find(".selectBank-bankCard-icon").attr("data-imgUrl");
                                var bankName = selectNode.find(".selectBank-bankCard-bankName").text();
                                var bankNumber = selectNode.find(".selectBank-bankCard-bankNumber").text();

                                var str = '<div class="recharge-checked-frame">';
                                str += '<div class="recharge-checked-oldCard">';
                                str += '<span class="recharge-checked-icon" style="background-image:url('+bankLogo+')"></span>';
                                str += '<p class="recharge-checked-bankName">'+bankName+'</p>';
                                str += '<p class="recharge-checked-bankCard">'+bankNumber+'</p>';
                                str += '</div>';
                                str += '<span class="recharge-checked-arrow"></span>';
                                str += '</div>';
                                $(".recharge-checked").html(str);
                            }

                            $(".selectBank-mask").hide();
                        });
                    }
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

    // 点击下一步
    $(".recharge-next").on("click", function() {
        var amount = parseInt($(".recharge-input").val());
        
        if (!!amount && amount > 0) {
            var api = window.Host.customer+"/account/capital/recharge?sessionToken="+sessionToken;

            GC.Hybind.showDialog();

            $.ajax({
                type: "POST",
                url: api,
                data:JSON.stringify({"payTool":payTool, "amount":amount, "bindId":bindId}),
                dataType: "json",
                contentType: "application/json",
                success: function(res) {
                    GC.Hybind.dismisDialog();
                    if (res.succ) {
                        window.location.href = res.data;
                    }
                    else {
                        GC.Hybind.showToast(res.message);
                        if (res.stateCode == 336) {
                            GC.Hybind.closePage();
                        }
                    }
                }
            });    
        }
        else {
            GC.Hybind.showToast("请输入金额且金额大于0！")
        }
    });
});