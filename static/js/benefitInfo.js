$(function() {
    //判断浏览器
    (function() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            $(".wrap").addClass("ios");
        }
    })();

    userId = "";
    getUserId();

    // 返回前一个页面
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    var activityId = GetQueryString("activityId");

    // 获取活动详情接口
    var api = window.Host.customer+"/activity/"+activityId;
    // 获取商户列表
    var apiOfCompany = window.Host.customer+"/activity/"+activityId+"/company";

    $.ajax({
        type: "GET",
        url: api,
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

            var beginTime = setTime(data.beginTime);
            var endTime = setTime(data.endTime);

            $(".detail-cover").find("img").attr("src",data.bannerImage);
            $(".detail-Info-location").text(data.activityAreaName);
            $(".detail-Info-title").text(data.activityName);
            $(".detail-Info-summary").text(data.description);
            $(".detail-Info-date").text(beginTime+" - "+endTime);
            
            if (typeof data.specification !== "string" && typeof data.specificationImage !== "string") {
                $(".detail-details").hide();
            }
            else if (typeof data.specification === "string" && typeof data.specificationImage !== "string") {
                $(".detail-details-text").text(data.specification);
            }
            else if (typeof data.specification !== "string" && typeof data.specificationImage === "string") {
                $(".detail-details-text").hide().siblings(".detail-details-pic").show().find("img").attr("src",data.specificationImage);
            }
            else if (typeof data.specification === "string" && typeof data.specificationImage === "string") {
                $(".detail-details-text").text(data.specification).siblings(".detail-details-pic").find("img").attr("src",data.specificationImage);
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
        }
    });

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

            var data = data.data

            var num = data.length;
            $(".detail-company-count").text(num);

            $.each(data, function(i, index) {
                var oLi = $('<li class="detail-company-item"></li>');
                var url = window.Host.local+"benefitCompany.html?activityId="+activityId+"&companyId="+index.companyId+"&userId="+userId;
                var str = '<a href='+url+'>';
                    str+= '<div class="detail-company-logo" style="background-image:url('+index.logoImage+window.Host.imgSize_80_80+')">';
                    //str+= '<img src="'+index.logoImage+'" alt="" />';
                    str+= '</div>';
                    str+= '<div class="detail-company-name">'+index.companyName+'</div>';
                    str+= '<div class="detail-company-summary">'+index.description+'</div>';
                    str+= '<div class="detail-company-data">';
                    str+= '<div class="detail-company-plan">预案数量 '+index.caseCount+'</div>';
                    str+= '<div class="detail-company-owner">参与业主 '+index.userCount+'</div>';
                    str+= '</div>';
                    str+= '<div class="detail-company-arrow"></div>';
                    str+= '</a>';

                oLi.html(str);
                oLi.appendTo($(".detail-company-list"));
            })
        }
    });

})

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
 * [setUserId 获取userId]
 * @param {[type]} userId [description]
 */
function setUserId(number) {
    userId = number;
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
 * [getUserId 获取用户Id]
 * @param  {[type]} caseId [description]
 * @return {[type]}        [description]
 */
function getUserId() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        userId = window.jsIntelligencer.getUserId();
        alert("android:"+userId);
    }
    //iOS接口
    if (isiOS) {
        window.webkit.messageHandlers.getUserId.postMessage("");
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