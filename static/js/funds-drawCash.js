$(function() {
    // 返回上一页
    $(".title").find("span").on("click", function() {
        window.history.go(-1);
    });

    // 弹出银行卡选择
    $(".recharge-checked").on("click", function() {
        $(".selectBank-mask").show();
    });

    // 取消银行卡选择
    $(".selectBank-btns-cancel").on("click", function() {
        $(".selectBank-mask").hide();
    });

    // 阻止下一层滚动
    (function() {
        var oUl = document.querySelector(".selectBank-list");
        oUl.addEventListener('touchmove', function (event) {
            event.preventDefault();
        },false);
    })();

    // 关闭弹出框
    $(".selectBank-mask").on("click", function() {
        $(this).hide();
    });
    $(".selectBank-frame").on("click", function(ev) {
        ev.stopPropagation();
    });
});