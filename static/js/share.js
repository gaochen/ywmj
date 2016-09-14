$(function() {

    (function() {
        var api = "http://192.168.28.116:8182/case/app/ticket";
        var sharetitle = "鹦鹉美家",
            sharedesc = "鹦鹉美家，是由成都鹦鹉美家网络科技有限公司开发的一款生活装修类手机APP软件，有iOS和安卓两个版本，在各大应用市场中都已上线。致力于打造一个以“家”为中心的综合品质服务平台。",
            sharelink = "http://192.168.28.84:8085?caseId=4",
            shareimgUrl = "http://o8nljewkg.bkt.clouddn.com/o_1aqgmpk0m539m9h11g5inmihr41.jpg";

        var requestUrl = window.location.href.split("#")[0];

        //var requestUrl = "http://console.yingwumeijia.com";
        // requestUrl = encodeURIComponent(requestUrl);

        $.ajax({
            type: "GET",
            url: api,
            data: {"requestUrl":requestUrl},
            dataType: "json",
            success: function(data) {
                // 判断返回数据是否错误
                console.log(data);  

                var data = data.data;
                console.log(data);

                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.randomStr,
                    signature: data.ticket,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                    ]
                });

                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function (res) {
                            // 以键值对的形式返回，可用的api值true，不可用为false
                            console.log(res);
                        }
                    });
                    wx.error(function (res) {
                        console.log(res);
                    })
                    //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareTimeline({
                        title: sharetitle, // 分享标题
                        link: sharelink, // 分享链接
                        imgUrl: shareimgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数

                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //获取“分享给朋友”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareAppMessage({
                        title: sharetitle, // 分享标题
                        desc: sharedesc, // 分享描述
                        link: sharelink, // 分享链接
                        imgUrl: shareimgUrl, // 分享图标
                        type: 'link', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //获取“分享到QQ”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareQQ({
                        title: sharetitle, // 分享标题
                        desc: sharedesc, // 分享描述
                        link: sharelink, // 分享链接
                        imgUrl: shareimgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            //alert(shareimgUrl);
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareWeibo({
                        title: sharetitle, // 分享标题
                        desc: sharedesc, // 分享描述
                        link: sharelink, // 分享链接
                        imgUrl: shareimgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                })

            }
        });
    })();
});