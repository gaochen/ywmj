$(function() {
    //判断浏览器
    (function() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            $(".wrap").addClass("ios");
        }
    })();

    activityId = GetQueryString("activityId");
    companyId = GetQueryString("companyId");
    couponId = null;
    userId = "";
    ticket = "";

    couponList();

    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    // 获取公司信息，政策，参与者
    var apiOfCompany = window.Host.customer+"/activity/"+activityId+"/company/"+companyId;
    $.ajax({
        type: "GET",
        url: apiOfCompany,
        dataType: "json",
        success: function(data) {
            // 判断返回数据是否错误
            if (data.succ === false) {
                var str = '<div class="benefit-noContent-image"></div>';
                    str+= '<a href="" class="benefit-noContent-text">访问出错，请点击刷新</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            var data = data.data;

            // 公司头像名字
            $(".company-logo").css("backgroundImage", "url("+data.logoImage+window.Host.imgSize_190_190+")");
            $(".company-name").text(data.companyName);

            // 公司简介
            var oSummary = $(".company-summary");
            var oBtn = $(".company-btn");

            data.resume = data.description.replace(/\n/g,'<br />');
            oSummary.find("p").text(data.description);

            // 是否显示按钮
            if (oSummary.find("p").height() > oSummary.height()) {
                oBtn.show();
            }
            else {
                oSummary.css("height","auto");
            } 

            // 显示全部内容
            oBtn.on("click", function() {
                var _this = $(this);
                if (oSummary.hasClass("company-summary-active")) {
                    oSummary.removeClass("company-summary-active");
                    _this.removeClass("company-btn-active");
                }
                else {
                    oSummary.addClass("company-summary-active");
                    _this.addClass("company-btn-active");
                }
            });

            // 公司政策
            if (typeof data.companyDisc !== "string" && typeof data.companyDiscImage !== "string") {
                $(".detail-details").hide();
            }
            else if (typeof data.companyDisc === "string" && typeof data.companyDiscImage !== "string") {
                $(".detail-details-text").text(data.companyDisc);
            }
            else if (typeof data.companyDisc !== "string" && typeof data.companyDiscImage === "string") {
                $(".detail-details-text").hide().siblings(".detail-details-pic").show().html('<div></div><img src='+data.companyDiscImage+' />');
            }
            else if (typeof data.companyDisc === "string" && typeof data.companyDiscImage === "string") {
                $(".detail-details-text").text(data.companyDisc).siblings(".detail-details-pic").html('<div></div><img src='+data.companyDiscImage+' />');
                $(".detail-details-btn").show();
            }

            // 活动细则按钮
            $(".detail-details-btn").on("click", function() {
                if ($(this).hasClass("detail-details-active")) {
                    $(".detail-details-pic").hide();
                    $(this).removeClass("detail-details-active");
                }
                else {
                    $(".detail-details-pic").show();
                    $(this).addClass("detail-details-active");
                }    
            });

            // 参与业主
            if (data.customerOwners instanceof Array === false) {
                $(".company-actor").hide().next(".line-index").hide();
            }
            else {
                var num = data.customerOwners.length;
                $(".company-actor-count").text(num);

                $.each(data.customerOwners, function(i, index) {
                    var oLi = $('<li style="background-image:url('+index.headImage+window.Host.imgSize_80_80+')"></li>');

                    oLi.appendTo($(".company-actor-list ul"));
                });
            }

        }
    });

    //滚动到底部
    (function() {
        var oDiv = document.querySelector(".content");
        var iStartTouchX = 0;
        var iStartTouchY = 0;
        var iEndTouchY = 0;
        var iDisX = 0;
        var iDisY = 0;
        var startTop = 0;
        var endTop = 0;
        var bool = false;
        var pageNum = 1;
        var pageSize = 10;

        var apiOfCase = window.Host.customer+"/activity/"+activityId+"/company/"+companyId+"/case?pageNum="+pageNum+"&pageSize=10";
        slideDown(apiOfCase, pageNum);
        pageNum++;

        oDiv.addEventListener("touchstart", function(ev) {

            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];
            iStartTouchX = _ev.pageX;
            iStartTouchY = _ev.pageY;

            startTop = oDiv.scrollTop;

        }, false);

        oDiv.addEventListener("touchmove", function(ev) {

            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];

            iDisX = _ev.pageX - iStartTouchX;
            iDisY = _ev.pageY - iStartTouchY;

            var X = Math.abs(iDisX);
            var Y = Math.abs(iDisY);

            if (Y > X && iDisY < 0) {
                bool = true;
            }
            else {
                bool = false;
            }

        }, false);

        oDiv.addEventListener("touchend", function(ev) {
            var ev = ev || window.event;
            var _ev = ev.changedTouches[0];
            iEndTouchY = _ev.pageY;

            if (iStartTouchY === iEndTouchY) {
                return false;
            }

            endTop = oDiv.scrollTop;

            if (endTop === startTop && bool) {
                var apiOfCase = window.Host.customer+"/activity/"+companyId+"/case?pageNum="+pageNum+"&pageSize=10";
                slideDown(apiOfCase, pageNum);
                pageNum++;
            }

        }, false);
    })();
});

/**
 * [getCouponList 未登录获取优惠码列表]
 * @param  {[type]} api [description]
 * @return {[type]}     [description]
 */
function getCouponList(api) {
    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {
            // 判断返回数据是否错误
            if (data.succ === false) {
                showToast("未登录获取券列表："+data.message);
                return false;
            }

            var data = data.data;

            // 清空券信息
            $(".coupon").find("li").remove();

            $.each(data, function(i, item) {
                var beginTime = setTime(item.beginTime);
                var endTime = setTime(item.endTime);

                var oLi = $('<li class="coupon-frame"></li>');
                var str = '<div class="coupon-logo"></div>';
                    str+= '<div class="coupon-name">'+item.couponName+'</div>';
                    if (typeof item.details === "string") {
                        str+= '<div class="coupon-info">'+item.details+'</div>';
                    }
                    else {
                        str+= '<div class="coupon-info"></div>';
                    }
                    str+= '<div class="coupon-detail clearfix">';
                    if (typeof item.rules === "string") {
                        str+= '<div class="coupon-detail-btn fl">详细情况<span></span></div>';
                    }
                    str+= '<div class="coupon-detail-date fr">有效期： <span>'+beginTime+' - '+endTime+'</span></div>';
                    str+= '</div>';
                    if (typeof item.rules === "string") {
                        str+= '<div class="coupon-hide">使用条件：'+item.rules+'</div>';
                    }
                    str+= '<div class="coupon-bottom coupon-btn" data-coupon-id='+item.couponId+'>立即领取</div>';

                oLi.html(str);
                oLi.appendTo($(".coupon"));

            });

            $(".coupon-detail-btn").on("click", function() {
                if ($(this).hasClass("coupon-detail-active")) {
                    $(this).removeClass("coupon-detail-active");
                    $(this).parent().siblings(".coupon-hide").hide();
                }
                else {
                    $(this).addClass("coupon-detail-active");
                    $(this).parent().siblings(".coupon-hide").show();
                }
            });


            $(".coupon-btn").on("click", function() {
                var _this = $(this);
                couponId = _this.data("couponId");

                if (userId === "-1") {
                    showToast("优惠券只能用户领取");
                }
                else if (userId === "") {
                    getCoupon()
                }
            });
        },  
        error: function(res) {
            var str = '<div class="benefit-noContent-image"></div>';
                str+= '<a href="" class="benefit-noContent-text">访问出错，请点击刷新</a>';

            $(".content").css("backgroundColor","#f5f5f5").html(str);
            return false;
        }
    });
}

/**
 * [getCouponListUser 已登录获取优惠码列表]
 * @param  {[type]} api    [description]
 * @param  {[type]} ticket [description]
 * @return {[type]}        [description]
 */
function getCouponListUser(api) {
    $.ajax({
        type: "GET",
        url: api,
        data: ticket,
        dataType: "json",
        success: function(data) {
            // 判断返回数据是否错误
            if (data.succ === false) {
                showToast("登录后获取券列表："+data.message);
                return false;
            }

            var data = data.data;

            // 清空券信息
            $(".coupon").find("li").remove();

            $.each(data, function(i, item) {
                var beginTime = setTime(item.beginTime);
                var endTime = setTime(item.endTime);

                var oLi = $('<li class="coupon-frame"></li>');
                var str = '<div class="coupon-logo"></div>';
                    str+= '<div class="coupon-name">'+item.couponName+'</div>';
                    if (typeof item.details === "string") {
                        str+= '<div class="coupon-info">'+item.details+'</div>';
                    }
                    else {
                        str+= '<div class="coupon-info"></div>';
                    }
                    str+= '<div class="coupon-detail clearfix">';
                    if (typeof item.rules === "string") {
                        str+= '<div class="coupon-detail-btn fl">详细情况<span></span></div>';
                    }
                    str+= '<div class="coupon-detail-date fr">有效期： <span>'+beginTime+' - '+endTime+'</span></div>';
                    str+= '</div>';
                    if (typeof item.rules === "string") {
                        str+= '<div class="coupon-hide">使用条件：'+item.rules+'</div>';
                    }
                    if (typeof item.couponEmployCode === "string") {
                        str+= '<div class="coupon-bottom">已领取优惠码：'+item.couponEmployCode+'</div>';
                    }
                    else {
                        str+= '<div class="coupon-bottom coupon-btn" data-coupon-id='+item.couponId+'>立即领取</div>';
                    }

                oLi.html(str);
                oLi.appendTo($(".coupon"));

            });

            $(".coupon-detail-btn").on("click", function() {
                if ($(this).hasClass("coupon-detail-active")) {
                    $(this).removeClass("coupon-detail-active");
                    $(this).parent().siblings(".coupon-hide").hide();
                }
                else {
                    $(this).addClass("coupon-detail-active");
                    $(this).parent().siblings(".coupon-hide").show();
                }
            });


            $(".coupon-btn").on("click", function() {
                var _this = $(this);
                couponId = _this.data("couponId");

                if (_this.text() !== "立即领取" ) {
                    return false;
                }

                getCoupon();

            });
        },  
        error: function(res) {
            var str = '<div class="benefit-noContent-image"></div>';
                str+= '<a href="" class="benefit-noContent-text">访问出错，请点击刷新</a>';

            $(".content").css("backgroundColor","#f5f5f5").html(str);
            return false;
        }
    });
}

/**
 * [couponList 优惠券列表]
 * @return {[type]} [description]
 */
function couponList() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.couponList();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.couponList.postMessage("");
    }
}

/**
 * [getCoupon 调用app获取优惠券接口]
 * @return {[type]} [description]
 */
function getCoupon() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.getCoupon();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.getCoupon.postMessage("");
    }
}

/**
 * [couponListReturn couponList回调]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function couponListReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    userId = value.userId;
    ticket = value.ticket;

    if ( userId === "-1" || userId === "") {
        var apiOfCoupon = window.Host.customer+"/activity/"+activityId+"/company/"+companyId+"/search";  //userId
        getCouponList(apiOfCoupon);
    }
    else {
        var apiOfCoupon = window.Host.customer+"/activity/"+activityId+"/company/"+companyId+"/search/?userId="+userId;  //userId
        getCouponListUser(apiOfCoupon);
    }
}

/**
 * [getCouponReturn getCoupon回调]
 * @return {[type]} [description]
 */
function getCouponReturn(val) {
    var value = window.atob(val);
    value = JSON.parse(value);
    userId = value.userId;
    ticket = value.ticket;

    var apiOfRecevie = window.Host.customer+"/activity/"+activityId+"/company/"+companyId+"/receiveCoupon/"+couponId+"?userId="+userId;

    $.ajax({
        type: "POST",
        url: apiOfRecevie,
        data: {"ticket":ticket},
        dataType: "json",
        success: function(res) {
            if (res.succ) {
                var data = res.data;
                $.each($(".coupon-frame"), function() {
                    var that = $(this).find(".coupon-bottom");
                    if (that.data("couponId") == couponId) {
                        that.removeClass("coupon-btn").text("已领取优惠码："+data);
                    }
                });
            }
            else {
                showToast(res.message);
            }
        },  
        error: function(res) {
            var str = '<div class="benefit-noContent-image"></div>';
                str+= '<a href="" class="benefit-noContent-text">访问出错，请点击刷新</a>';

            $(".content").css("backgroundColor","#f5f5f5").html(str);
            return false;
        }
    });
}

/**
 * [slideDown 下拉刷新]
 * @param  {[type]} api     [请求地址]
 * @param  {[type]} pageNum [请求页码]
 * @return {[type]}         [description]
 */
function slideDown(api, pageNum) {
    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {
            var data = data.data;

            $(".company-case-count").text(data.totalCount);

            $.each(data.result, function(i, index) {
                var oLi = $('<li data-case-id='+index.id+'><div style="background-image:url('+index.caseCover+window.Host.imgSize_330_330+')"></div><p>'+index.caseName+'</p></li>');

                oLi.appendTo($(".company-case-list ul"));
            });
            
            $(".company-case-list").find("li").on("click", function() {
                var caseId = $(this).data("caseId");
                caseSkip(caseId);
            });
        }
    });
}

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * [caseSkip 案例跳转]
 * @param  {[type]} caseId [description]
 * @return {[type]}        [description]
 */
function caseSkip(caseId) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.startCaseDetailActivity(caseId);
    }
    //iOS接口
    if (isiOS) {
        var message = caseId;
        window.webkit.messageHandlers.showCaseDetail.postMessage(message);
    }
}

/**
 * [showToast 弹出提示信息]
 * @param  {[type]} caseId [description]
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
 * [toLogin 跳转到登陆页面]
 * @return {[type]} [description]
 */
function toLogin() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        window.jsIntelligencer.startLogin();
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.gitTicket.postMessage("message");
    }
}

/**
 * [时间格式]
 * @param  {[type]} default_time [description]
 * @return {[type]}              [description]
 */
function setTime(para) {
    var newTime = new Date(para);
    var result=newTime.getFullYear()+"."+toDouble(newTime.getMonth()+1)+"."+toDouble(newTime.getDate());
    return result;
}

/**
 * [toDouble 个位数字补0]
 * @param  {[type]} iNum [description]
 * @return {[type]}      [description]
 */
function toDouble(iNum) {
    if (iNum < 10) {
        return '0' + iNum;
    } else {
        return '' + iNum;
    }
}
