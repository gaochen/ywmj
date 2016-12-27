$(function() {
    var id = GetQueryString("caseId");
    var index = GetQueryString("index");
    var type = GetQueryString("type");
    var userId = GetQueryString("userId");
    var phaseId = GetQueryString("phaseId");
    var companyId = GetQueryString("companyId");

    switch (type) {
        case "plainLayout":
            var api = window.Host.customer+"/case/app/detail/scene/plan/"+id;
            loadPMBZ(api, id, index);
            break;
        case "realScene":
            var api = window.Host.customer+"/case/app/detail/scene/pics/"+id;
            loadSJZP(api, id, index);
            break; 
        case "personal":
            var api = window.Host.customer+"/case/app/resume/employee/"+userId+"/"+id+"/"+phaseId;
            loadGRJJ(api, id, null);
            break;
        case "company":
            var api = window.Host.customer+"/case/app/present/company/"+companyId;
            loadGSZS(api, id, index);
            break;
    }
});

/**
 * [loadPMBZ 请求平面布置数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @param  {[type]} index  [当前点击的图片顺序]
 * @return {[type]}     [description]
 */
function loadPMBZ(url, id, index) {
    var url = url,
        id = id,
        index = index;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            $.each(data, function(i, item) {
                var _this = item;

                $.each(item.pics, function(i, item) {
                    var oLi = $('<li class="scan-item"></li>');
                    var str = '<div class="scan-picBox">';
                    str += '<img src="'+item+window.Host.imgSize_750+window.Host.watermark+'" alt="">';
                    str += '<div></div>';
                    str += '</div>';
                    str += '<div class="scan-content show">';
                    str += '<div class="scan-describe">';
                    str += '<h3>'+_this.title+'</h3>';
                    str += '<p>'+_this.explain+'</p>';
                    str += '</div>';
                    str += '</div>';

                    oLi.html(str);
                    oLi.appendTo($(".scan-list"));
                })
            });

            // 底部图片页码
            var len = $(".scan-list").find("li").length;
            $(".scan-page").find("span").eq(0).text(index);
            $(".scan-page").find("span").eq(1).text(len);

            // 侧滑
            var obj = $(".scan-frame");
            var oUl = $(".scan-list").eq(0);
            var obj_w = obj.width();
            var oUl_w = len*obj_w;
            oUl.width(oUl_w);

            var startX = -1*(index-1)*obj_w;
            oUl.css({"WebkitTransform":"translateX("+startX+"px)", "transform":"translateX("+startX+"px)"});
            
            new Slider().init(obj, index);

            // 点击图片隐藏文字
            $(".scan-picBox").on("click", function(ev) {
                ev.stopPropagation();
                var oContent = $(this).siblings(".scan-content");
                if (oContent.hasClass("show")) {
                    oContent.removeClass("show");
                }
                else {
                    oContent.addClass("show");
                }
            });
        }
    });
}

/**
 * [loadSJZP 请求实景照片数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @param  {[type]} index  [当前点击的图片顺序]
 * @return {[type]}     [description]
 */
function loadSJZP(url, id, index) {
    var url = url,
        id = id,
        index = index;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            $.each(data.pics, function(i, item) {
                var oLi = $('<li class="scan-item"></li>');
                var str = '<div class="scan-picBox">';
                str += '<img src="'+item.pics[0]+window.Host.imgSize_750+window.Host.watermark+'" alt="">';
                str += '<div></div>';
                str += '</div>';
                str += '<div class="scan-content show">';
                str += '<div class="scan-describe">';
                str += '<h3>'+item.title+'</h3>';
                str += '<p>'+item.explain+'</p>';
                str += '</div>';
                str += '</div>';

                oLi.html(str);
                oLi.appendTo($(".scan-list"));
            });

            // 底部图片页码
            var len = $(".scan-list").find("li").length;
            $(".scan-page").find("span").eq(0).text(index);
            $(".scan-page").find("span").eq(1).text(len);

            // 侧滑
            var obj = $(".scan-frame");
            var oUl = $(".scan-list").eq(0);
            var obj_w = obj.width();
            var oUl_w = len*obj_w;
            oUl.width(oUl_w);

            var startX = -1*(index-1)*obj_w;
            oUl.css({"WebkitTransform":"translateX("+startX+"px)", "transform":"translateX("+startX+"px)"});
            
            new Slider().init(obj, index);

            // 点击图片隐藏文字
            $(".scan-picBox").on("click", function(ev) {
                ev.stopPropagation();
                var oContent = $(this).siblings(".scan-content");
                if (oContent.hasClass("show")) {
                    oContent.removeClass("show");
                }
                else {
                    oContent.addClass("show");
                }
            });
        }
    })
}

/**
 * [loadGRJJ 请求个人简介数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @param  {[type]} index  [当前点击的图片顺序]
 * @return {[type]}     [description]
 */
function loadGRJJ(url, id, index) {
    var url = url,
        id = id,
        index = index;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            $.each(data.presentPics, function(i, item) {
                var oLi = $('<li class="scan-item"></li>');
                var str = '<div class="scan-picBox">';
                str += '<img src="'+item+window.Host.imgSize_750+'" alt="">';
                str += '<div></div>';
                str += '</div>';

                oLi.html(str);
                oLi.appendTo($(".scan-list"));
            });

            // 底部图片页码
            var len = $(".scan-list").find("li").length;
            $(".scan-page").find("span").eq(0).text(1);
            $(".scan-page").find("span").eq(1).text(len);

            // 侧滑
            var obj = $(".scan-frame");
            var oUl = $(".scan-list").eq(0);
            var obj_w = obj.width();
            var oUl_w = len*obj_w;
            oUl.width(oUl_w);
            
            new Slider().init(obj, null);
        }
    });
}

/**
 * [loadGSZS 请求公司展示数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @param  {[type]} index  [当前点击的图片顺序]
 * @return {[type]}     [description]
 */
function loadGSZS(url, id, index) {
    var url = url,
        id = id,
        index = index;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {

            // 判断返回数据是否错误
            if (data.succ === false) {
                $("body").html(data.message+"，稍后请重试!");
                return false;
            }

            var data = data.data;

            $.each(data.pics, function(i, item) {
                var num = i+1;
                if (num < 10) {
                    num = "0"+num;
                }
                var oLi = $('<li class="scan-item"></li>');
                var str = '<div class="scan-picBox">';
                str += '<img src="'+item.pics[0]+window.Host.imgSize_750+'" alt="">';
                str += '<div></div>';
                str += '</div>';
                str += '<div class="scan-content show">';
                str += '<div class="scan-describe">';
                str += '<h3>'+num+'</h3>';
                str += '<p>'+item.explain+'</p>';
                str += '</div>';
                str += '</div>';

                oLi.html(str);
                oLi.appendTo($(".scan-list"));
            });

            // 底部图片页码
            var len = $(".scan-list").find("li").length;
            $(".scan-page").find("span").eq(0).text(index);
            $(".scan-page").find("span").eq(1).text(len);

            // 侧滑
            var obj = $(".scan-frame");
            var oUl = $(".scan-list").eq(0);
            var obj_w = obj.width();
            var oUl_w = len*obj_w;
            oUl.width(oUl_w);

            var startX = -1*(index-1)*obj_w;
            oUl.css({"WebkitTransform":"translateX("+startX+"px)", "transform":"translateX("+startX+"px)"});
            
            new Slider().init(obj, index);

            // 点击图片隐藏文字
            $(".scan-picBox").on("click", function(ev) {
                ev.stopPropagation();
                var oContent = $(this).siblings(".scan-content");
                if (oContent.hasClass("show")) {
                    oContent.removeClass("show");
                }
                else {
                    oContent.addClass("show");
                }
            });
        }
    })
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

/**
 * [Slider 幻灯片]
 */
function Slider() {
    this.options = {
        oTab : null,
        oList : null,
        aLi : null,
        iNow : 0,
        iX : 0,
        iW : 0,
        iStartTouchX : 0,
        iStartX : 0,
        iDis : 0,
        iStartTouchY : 0,
        iStartY : 0,
        iDisY : 0
    }
}

Slider.prototype = {
    init: function(obj, index) {
        var options = this.options;
        options.oTab = $(obj);
        options.oList = options.oTab.find("ul").eq(0);
        options.aLi = options.oList.find("li");
        options.iW = options.aLi.eq(0).width();
        var that = this;

        // 初始化定位，默认定位为0
        var index = index;
        if (typeof index === "string") {
            options.iNow = index-1;
            options.iX = -options.iNow*options.iW;
        }

        options.oTab.on("touchstart", function(ev) { 
            that.fnStart(ev); 
        });

        options.oTab.on("touchmove", function(ev) {
            that.fnMove(ev);
        });    

        options.oTab.on("touchend", function() {
            that.fnEnd();
        });
    },
    fnStart: function(ev) {
        var options = this.options;

        options.oList.css("transition", "none");
        var _ev = ev.changedTouches[0];
        options.iStartTouchX = _ev.pageX;
        options.iStartX = options.iX;

        options.iStartTouchY = _ev.pageY;
    },
    fnMove: function(ev) {
        var options = this.options;

        var _ev = ev.changedTouches[0];
        options.iDis = _ev.pageX - options.iStartTouchX;
        options.iDisY = _ev.pageY - options.iStartTouchY;

        //判断是竖直滑动还是横向滑动
        var Y = Math.abs(options.iDisY);
        var X = Math.abs(options.iDis);

        if (X > Y) {
            ev.stopPropagation();
            ev.preventDefault();
            options.iX = options.iStartX + options.iDis;
            options.oList.css({"WebkitTransform":"translateX("+options.iX+"px) translateZ(0)", "transform":"translateX("+options.iX+"px) translateZ(0)"});
        }
    },
    fnEnd: function() {
        var options = this.options;
        var val = Math.abs(options.iDis) * 4;

        if (val > options.iW) {
            options.iDis < 0 ? options.iNow++ : options.iNow--;   
        }

        if (options.iNow < 0) {
            options.iNow = 0;
        }
        if (options.iNow > options.aLi.length-1) {
            options.iNow = options.aLi.length-1;
        }
        this.tab();
    },
    tab: function() {
        var options = this.options;
        options.iDis = 0;
        options.oTab.find("span").eq(0).text(options.iNow+1);
        options.iX = -options.iNow*options.iW;
     
        options.oList.css("transition", "0.5s");
        options.oList.css({"WebkitTransform":"translateX("+options.iX+"px) translateZ(0)", "transform":"translateX("+options.iX+"px) translateZ(0)"});
    }
   
};