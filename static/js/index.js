$(function() {
    /* 首页头部导航切换 */
   (function() {
        $(".index-nav a").on("tap", function() {
            $(this).addClass("active").siblings("a").removeClass("active");
        });
   })();
});