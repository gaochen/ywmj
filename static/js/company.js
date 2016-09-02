$(function() {

    /**
     * 公司描述
     */
    (function() {
        var oSummary = $(".company-summary");
        var oBtn = $(".company-btn");

        // 是否显示按钮
        if (oSummary.find("p").height() > oSummary.height()) {
            oBtn.show();
        } 
        
        // 显示全部内容
        $(".company-btn").on("tap", function() {
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
    })();

    // 跳转公司展示链接
    var url_companyShow = "http://" + window.location.host + "/template/companyShow.html";
    $("#company-show").attr("href", url_companyShow);

    // 视频播放
    (function() {

        $(".company-video").on("tap", function() {

            $(".company-mask").addClass("show");

            var video = document.querySelector("#company-video");
            video.play();

        });

        $(".company-mask").on("tap", function() {
            $(this).removeClass("show");
        });

        $("#company-video").on("tap", function(ev) {
            ev.stopPropagation();
        });
        
    })();
});