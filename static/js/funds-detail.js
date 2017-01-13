$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    //滚动到底部
    (function() {
        // 从localStorage获取sessionToken
        var storage = window.localStorage;
        var sessionToken = storage.getItem("sessionToken");

        // 下拉刷新参数
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

        var api = window.Host.customer+"/account/detail/"+pageNum+"/"+pageSize;
        slideDown(api, sessionToken);
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
                var api = window.Host.customer+"/account/detail/"+pageNum+"/"+pageSize;
                slideDown(api, sessionToken);
                pageNum++;
            }

        }, false);
    })();
});

/**
 * [slideDown 下拉刷新]
 * @param  {[type]} api [请求接口]
 * @return {[type]}     [description]
 */
function slideDown(api, sessionToken) {
    $.ajax({
        type: "GET",
        url: api,
        data:{"sessionToken":sessionToken},
        dataType: "json",
        success: function(data) {
            if (data.succ) {

                var data = data.data;

                if (!(data instanceof Array)) {
                    GC.Hybind.showToast("暂无更多明细");
                }

                if (data.length === 10) {
                    $(".list-slideDown").show();
                }
                else {
                    $(".list-slideDown").hide();
                }

                if (data.length > 0) {
                    $.each(data, function(i, index) {
                        var operateTime = GC.Lib.setTime(index.operateTime);
                        var oLi = $('<li><p class="detail-type">'+index.detail+'</p><p class="detail-date">'+operateTime+'</p><p class="detail-num">'+index.amount+'</p></li>')
                    
                        oLi.appendTo($(".detail-list"));
                    });
                }


            }
            else {
                GC.Hybind.showToast(data.message);
            }
        }
    });
}