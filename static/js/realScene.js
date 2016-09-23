$(function () {
    var id = GetQueryString("caseId");
    var api = window.Host.customer+"/case/app/detail/scene/pics/"+id;

    $.ajax({
        type: "GET",
        url: api,
        dataType: "json",
        success: function(data) {
            // 请求失败
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            $.each(data.pics, function(i, item) {
                var index = i+1;
                var api = window.Host.local+"scan.html?caseId="+id+"&type=realScene&index="+index;
                var oDiv = $('<div class="realScene-item"></div>');
                var str = '<div class="realScene-title">'+item.title+'</div>';
                    str += '<div class="realScene-describe">'+item.explain+'</div>';
                    str += '<div class="realScene-pic">';
                    str += '<a href="'+api+'">';
                    str += '<img src="'+item.pics[0]+window.Host.imgSize_750+'">';
                    str += '</a>';
                    str += '</div>';

                    oDiv.html(str);
                    oDiv.appendTo($(".realScene-list"));
            });

            data.designConcept = data.designConcept.replace(/\n/g,'<br />');
            $(".realScene-designConcept").text(data.designConcept);
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