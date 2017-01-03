$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });
});