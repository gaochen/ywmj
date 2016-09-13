require({
    paths : {
        'zepto': "libs/zepto.min",
        'config': "config",
        'query': 'getQuery',
        'vue': 'libs/vue.min'
    },
    shim: {
        'zepto': {
            exports: '$'
        }
    }
})

require(['zepto', 'vue', 'query', 'config'], function($, Vue, query) {
    $(function() {
        var id = query.GetQueryString("caseId");
        //var api = window.Host.customer+"/case/app/detail/scene/plan/"+id;
        var api = "/static/js/plainLayout.txt";

        $.ajax({
            type: "GET",
            url: api,
            dataType: "json",
            success: function(data) {
                
                var data = data.data;

                var app = new Vue({
                    el: '#app',
                    data : {
                        items: data
                    }
                });

                // $.each(data, function(i, item) {
                //     var oDiv = $('<div class="plainLayout-item"></div>');
                //     str = '<div class="plainLayout-title">';
                //     str += '<h1>'+item.title+'</h1>';
                //     str += '<h4>原始平面图</h4>';
                //     str += '</div>';
                //     str += '<div class="plainLayout-pic">';
                //     str += '<a href="#" class="plainLayout-link">';
                //     str += '<img src="'+item.pics[0]+'" alt="原始平面图">';
                //     str += '</a>';
                //     str += '</div>';
                //     str += '<div class="plainLayout-title">';
                //     str += '<h4>设计平面图</h4>';
                //     str += '</div>';
                //     str += '<div class="plainLayout-pic">';
                //     str += '<a href="#" class="plainLayout-link">';
                //     str += '<img src="'+item.pics[1]+'" alt="设计平面图">';
                //     str += '</a>';
                //     str += '</div>';
                //     str += '<div class="plainLayout-describe">'+item.explain+'</div>';
                
                //     oDiv.html(str);
                //     oDiv.appendTo($(".content"));
                // });
        
                // var arr_a = $(".plainLayout-link");
                // $.each(arr_a, function(i, item) {
                //     var index = i+1;
                //     var api = window.Host.local+"scan.html?caseId="+id+"&type=plainLayout&index="+index;
                //     $(this).attr("href", api);
                // });

            }
        });

        // 关闭底部下载提示层
        $(".bottom-close").on("click", function(ev) {
            ev.stopPropagation();
            $(".wrap").find(".bottom").remove();
        });
    });
});