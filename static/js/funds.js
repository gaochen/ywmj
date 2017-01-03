$(function() {
    // 关闭WebView
    $(".title").find("span").on("click", function() {
        GC.Hybind.closePage();
    });
});