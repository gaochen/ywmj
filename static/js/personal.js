$(function() {

    var oSummary = $(".personal-summary");
    var oBtn = $(".personal-btn");

    // 是否显示按钮
    if (oSummary.find("p").height() > oSummary.height()) {
        oBtn.show();
    } 
    
    // 显示全部内容
    $(".personal-btn").on("tap", function() {
        var _this = $(this);
        if (oSummary.hasClass("personal-summary-active")) {
            oSummary.removeClass("personal-summary-active");
            _this.removeClass("personal-btn-active");
        }
        else {
            oSummary.addClass("personal-summary-active");
            _this.addClass("personal-btn-active");
        }
    });

    // 居中显示
    $.each($(".personal-article").find("li"), function() {
        var oTitle = $(this).find(".personal-article-title"),
            oPic = $(this).find(".personal-article-thumb"),
            h = $(this).height(),
            oTitle_h = oTitle.height(),
            oPic_h = oPic.height(),
            h1,
            h2;

        h1 = Math.floor((h - oTitle_h)/2);
        h2 = Math.floor((h - oPic_h)/2);

        oTitle.css("margin-top",h1+"px");
        oPic.css("margin-top",h2+"px");
    });

    // 视频播放
    (function() {

        $(".personal-video").on("tap", function() {

            $(".personal-mask").addClass("show");

            var video = document.querySelector("#personal-video");
            video.play();

        });

        $(".personal-mask").on("tap", function() {
            $(this).removeClass("show");
        });

        $("#personal-video").on("tap", function(ev) {
            ev.stopPropagation();
        });
        
    })();

    //滚动到底部
    var oDiv = document.querySelector(".content");
    var iStartTouchX = 0;
    var iStartTouchY = 0;
    var iDisX = 0;
    var iDisY = 0;
    var startTop = 0;
    var endTop = 0;

    oDiv.addEventListener("touchstart", function(ev) {

        var ev = ev || window.event;
        var _ev = ev.changedTouches[0];
        iStartTouchX = _ev.pageX;
        iStartTouchY = _ev.pageY;

        var startTop = oDiv.scrollTop;
        console.log("startTop:"+startTop);
        //console.log(iStartTouchX + "," + iStartTouchY);

    }, false);

    oDiv.addEventListener("touchmove", function(ev) {

        var ev = ev || window.event;
        var _ev = ev.changedTouches[0];

        var iDisX = _ev.pageX - iStartTouchX;
        var iDisY = _ev.pageY - iStartTouchY;

        var X = Math.abs(iDisX);
        var Y = Math.abs(iDisY);

        var bool = (Y > X && iDisY < 0);
        if (!bool) {
            return false;
        }


    }, false);

    oDiv.addEventListener("touchend", function(ev) {
        var endTop = oDiv.scrollTop;
        console.log("endTop:"+endTop);

        // $.ajax({
        //     type: "GET",
        //     url: window.Host.customer+"/case/app/detail/scene/pics/1044",
        //     dataType: "json",
        //     success: function(data) {
        //     }
        // });

    }, false);

});