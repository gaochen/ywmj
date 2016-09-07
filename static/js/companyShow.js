$(function() {
    var companyId = GetQueryString("companyId");

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
                $("#company-720").attr("href", data.pathOf720);
            }
            else {
                $(".js-company-720").hide();
            }

            // 视频(1个)
            if (!!data.videos) {
                var video_cover = data.videos[0].videoInfo.url+"?vframe/jpg/offset/"+data.videos[0].videoInfo.second+"/w/240/h/160";
                $(".company-video").css("background-image", "url("+video_cover+")");
                $("#company-video").attr("src", data.videos[0].videoInfo.url);
            }
            else {
                $(".js-company-video").hide();
            }

            // 如果720和视频都没有，去掉顶部分割线
            if (!!data.pathOf720 && !!data.videos) {
                $(".line-index").eq(0).hide();
            }

            $.each(data.pics, function(i, index) {
                var num = i+1;
                var api = "http://"+window.location.host+"/template/scan.html?companyId="+companyId+"&type=company&index="+num;
                var oLi = $('<li class="company-item"><div class="company-item-title">'+index.title+'</div><div class="company-item-describe">'+index.explain+'</div><a href="'+api+'"><img class="company-item-pic" src="'+index.pics[0]+'" /></a></li>');
                oLi.appendTo($(".company-list"));
            });

        },
        error: function(error) {
            $("body").html("请求失败，稍后请重试！");
        } 
    });

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