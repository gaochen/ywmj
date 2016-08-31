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
});