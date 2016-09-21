$(function() {
    var caseId = GetQueryString("caseId"),
        companyId = GetQueryString("companyId");

    var api = window.Host.customer+"/case/app/present/company/"+companyId;

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

            $(".company-720").css("background-image", "url("+data.cover+")");

            // 720路径
            if (!!data.pathOf720) {
                $(".company-720-btn").addClass("show");
                $("#company-720").on("click", function() {
                    var weixin = navigator.userAgent.search("Language"),
                        wifi = navigator.userAgent.search("WIFI");
                    if (weixin > 0) {
                        if (wifi > 0) {
                            window.location.href = data.pathOf720;
                        }
                        else {
                            $(".wifi-mask").show();
                            $(".wifi-Lbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                window.location.href = data.pathOf720;
                            });
                            $(".wifi-Rbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                $(".wifi-mask").hide();
                            });
                        }
                    }
                    else {
                        window.location.href = data.pathOf720;
                    }
                });
            }
            else {
                $(".js-company-720").hide();
            }

            // 视频(1个)
            if (!!data.video) {
                var video_cover = data.video.url+"?vframe/jpg/offset/"+data.video.second+"/w/240/h/160";
                $(".company-video").css("background-image", "url("+video_cover+")");
                $("#company-video").attr("src", data.video.url);
                var oDiv = $('<div></div>');
                var oSpan = $('<span></span>');
                oDiv.appendTo($(".company-video"));
                oSpan.appendTo($(".company-video"));
            }
            else {
                $(".js-company-video").hide();
            }

            // 如果720和视频都没有，去掉顶部分割线
            if (!data.pathOf720 && !data.video) {
                $(".line-index").eq(0).hide();
            }

            if (!!data.pics) {
                $.each(data.pics, function(i, index) {
                    var num = i+1;
                    var api = window.Host.local+"scan.html?companyId="+companyId+"&type=company&index="+num+"&caseId="+caseId;
                    if (num < 10) {
                        var oLi = $('<li class="company-item"><div class="company-item-title">0'+num+'</div><div class="company-item-describe">'+index.explain+'</div><a href="'+api+'"><img class="company-item-pic" src="'+index.pics[0]+'" /></a></li>');
                    }
                    else {
                        var oLi = $('<li class="company-item"><div class="company-item-title">'+num+'</div><div class="company-item-describe">'+index.explain+'</div><a href="'+api+'"><img class="company-item-pic" src="'+index.pics[0]+'" /></a></li>');
                    }
                    oLi.appendTo($(".company-list"));
                });
            }
            else {
                $(".js-company-pics").hide();
            }

        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
        } 
    });

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

    // 关闭底部下载提示层
    $(".bottom-close").on("click", function(ev) {
        ev.stopPropagation();
        $(".wrap").find(".bottom").remove();
    });
});

/**
 * [GetQueryString 通过名字查询url参数]
 * @param {[type]} name [description]
 */
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}