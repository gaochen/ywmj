$(function() {
    var caseId = GetQueryString("caseId"),
        companyId = GetQueryString("companyId");

    var api = window.Host.customer+"/case/app/resume/company/"+companyId+"/"+caseId;

    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            // 公司logo、公司名称
            $(".company-portrait").find("img").attr("src", data.logo);
            $(".company-name").text(data.name);

            // 简介
            var oSummary = $(".company-summary");
            var oBtn = $(".company-btn");

            oSummary.find("p").text(data.resume);

            // 是否显示按钮
            if (oSummary.find("p").height() > oSummary.height()) {
                oBtn.show();
            } 
            
            // 显示全部内容
            $(".personal-btn").on("click", function() {
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

            // 其他作品总数
            if (data.otherCasesCount !== 0) {
                $(".company-other").text(data.otherCasesCount);
                $(".personal-slideDown").show();
            }
            else {
                $(".company-other").hide();
            }

        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
        }
    });

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
            console.log(data);

            var data = data.data;

            if (data.length > 0) {
                $.each(data, function(i, index) {
                    var oLi = $('<li><div><img src="'+index.caseCover+'"></div><p>'+index.caseName+'</p></li>');
                    oLi.appendTo($(".company-otherCase ul"));
               })
            }
            else {
                $(".personal-slideDown").text("已无更多其他作品");
            }
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