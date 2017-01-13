$(function() {
    // 选择用户协议
    $(".checkBox-icon").on("click", function() {
        if ($(this).hasClass("checkBox-icon-active")) {
            $(this).removeClass("checkBox-icon-active");
        }
        else {
            $(this).addClass("checkBox-icon-active");
        }
    });

    // 判断输入手机号是否正确
    $(".phoneNumber").on("blur", function() {
        var value = $(this).val();
        if (value.match(/^1\d{10}$/)) {
            $(".sendCode").addClass("sendCode-active");
            $(".submit").addClass("submit-active");
        }
        // else {
        //     $(".sendCode").removeClass("sendCode-active")
        //     showJsToast("请输入正确手机号");
        // }
    }); 

    // 发送验证码
    $(".sendCode").on("click", function() {
        var self = $(this);
        if (self.hasClass("sendCode-active")) {
            self.text("60秒").removeClass("sendCode-active").addClass("sendCode-invalid");
            var num = 60;
            var timer = setInterval(function() {
                num--;
                if (num === 0) {
                    clearInterval(timer);
                    self.text("重新获取").addClass("sendCode-active").removeClass("sendCode-invalid");
                }
                else {
                    self.text(num+"秒");
                }
            }, 1000);
        }
    });

    // 点击注册
    $(".submit").on("click", function() {
        var self = $(this);

        if (self.hasClass("submit-active")) {
            // 判断手机号是否正确
            if (!$(".phoneNumber").val().match(/^1\d{10}$/)) {
                showJsToast("请输入正确的手机号");   
                return false;
            }
            // 判断短信验证码是否正确
            if (!$(".msg").val().match(/^\d{6}$/)) {
                showJsToast("请输入正确的短信验证码");  
                return false;
            }
            // 判断密码是否正确
            if (!$(".password").val().match(/^[0-9A-Za-z]{8,20}$/)) {
                showJsToast("请输入正确的密码");  
                return false;
            }
            // 判断是否勾选用户协议
            if (!$(".checkBox-icon").hasClass("checkBox-icon-active")) {
                showJsToast("请先勾选我同意《用户协议》");
                return false;
            }

            // 通过验证
            showJsToast("成功");

        }
    });
});

/**
 * [showJsToast 仿ios提示]
 * @param  {[type]} text [提示文本]
 * @return {[type]}      [description]
 */
function showJsToast(text) {
    $("body").find(".js-toast").remove();

    var timer =null;
    var oDiv = $('<div class="js-toast"><p>'+text+'</p></div>');
    oDiv.appendTo($("body"));

    timer = setTimeout(function() {
        $("body").find(".js-toast").remove();
    }, 3000);
}