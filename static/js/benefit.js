$(function() {
    //判断浏览器
    (function() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            $(".wrap").addClass("ios");
        }
    })();
    
    getActivityList();

})

/**
 * [getActivityList 获取活动列表]
 * @return {[type]} [description]
 */
function getActivityList() {
    var api = window.Host.customer+"/activity?orderBy=beginTime&isAsc=true";

    // 获取优惠列表
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

            // 清除li
            $(".list").find("li").remove();

            var data = data.data;

            if (data instanceof Array === false) {
                var str = '<div class="benefit-noContent-image"></div>';
                    str+= '<a href="" class="benefit-noContent-text">暂无优惠活动，敬请期待</a>';

                $(".content").css("backgroundColor","#f5f5f5").html(str);
                return false;
            }

            $.each(data, function(i, item) {
                var beginTime = setTime(item.beginTime);
                var endTime = setTime(item.endTime);
                var activityStatus = null;

                switch (item.status) {
                    case "0":
                        activityStatus = "即将开始";
                        break;
                    case "1":
                        activityStatus = "正在进行";
                        break;
                    case "2": 
                        activityStatus = "已经结束";
                        break;
                }

                var oLi = $('<li class="listItem"></li>');
                var url = window.Host.local+"benefitInfo.html?activityId="+item.id;
                var str = '<a href='+url+'>';
                    str += '<div class="listItem-pic" style="background-image:url('+item.listImage+')">';
                    str += '<div class="listItem-recommend"></div>';
                    str += '<div class="listItem-status">'+activityStatus+'</div>';
                    str += '</div>';
                    str += '<div class="listItem-info clearfix">';
                    str += '<span class="listItem-time fl">'+beginTime+' - '+endTime+'</span>';
                    str += '<span class="listItem-location fr">'+item.activityAreaName+'</span>';
                    str += '</div>';
                    str += '</a>';

                oLi.html(str);

                if (item.recommend) {
                    oLi.find(".listItem-recommend").css("display","block");
                }

                oLi.appendTo($(".list"));
            });
        }
    });
}

/**
 * [couponListReturn 刷新活动列表]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function couponListReturn(val) {
    getActivityList();
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