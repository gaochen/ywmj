$(function() {

    /* 首页头部导航切换 */
   (function() {
        $(".index-nav a").on("tap", function() {
            var index = $(this).index();

            if (index === 1) {
                $(".content").addClass("data-active");
            }
            else {
                $(".content").removeClass("data-active");
            }

            $(this).addClass("active").siblings("a").removeClass("active");
            $(".index-tab").eq(index).addClass("show").siblings(".index-tab").removeClass("show");
        });
   })();

   //加载现场实景
   (function() {
        var id = GetQueryString("caseId");
        var url = window.Host.customer+"/case/app/detail/scene/"+id;
        
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                var data = data.data;
                // 720背景图
                $(".index-720").css("background-image","url("+data.caseCover+")");

                // 作品名称
                $(".index-720-name").text(data.caseName);

                // 720路径
                if (typeof data.pathOf720 === "string") {
                    $(".index-720-btn").addClass("show");
                    $(".index-720-url").addClass("show").attr("href", data.pathOf720);
                }

                // 基础信息index-basicInfo-info
                $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / " + data.cost + "万" + " / " + data.buildingName);
            
                // 平面布置
                var url_plainLayput = "http://" + window.location.host + "/template/plainLayout.html?caseId="+id;
                $(".index-plainLayout").attr("href", url_plainLayput).find(".index-module-pic").css("background-image","url("+data.planCover+")");
            
                // 实景照片
                var url_realScene = "http://" + window.location.host + "/template/realScene.html?caseId="+id;
                $(".index-scene").attr("href", url_realScene).find(".index-module-pic").css("background-image","url("+data.sceneCover+")");

                // 相似作品
                $.each(data.relativeCases, function(i, index) {
                    var oDiv = $('<div class="index-similar-item fl" data-case-id='+ index.caseId +'><div class="index-similar-cover" style="background-image:url('+ data.caseCover +')"></div><div class="index-similar-name">'+index.caseName+'</div></div>');
                    if (i === 0) {
                        oDiv.addClass("fl");
                    }
                    else {
                        oDiv.addClass("fr");
                    }
                    oDiv.appendTo($(".index-similar-frame"));
                }); 
            }
        });
   })();
});

/**
 * [lazyLoad 滚动延时加载]
 * @param  {[type]} arr [dom类数组]
 * @return {[type]}     [description]
 */
function lazyLoad(arr) {
    for (var i=0, len=arr.length; i< len; i++) {
        var _this = arr[i];
        var src = _this.dataset.src;
        var top = _this.getBoundingClientRect().top;

        if ( top < 666 && _this.style.backgroundImage === "") {
            _this.style.backgroundImage = "url("+src+")";
        }
    }
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
