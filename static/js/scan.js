$(function() {
    var obj = $(".scan-frame");
    var num = obj.find("li").length;
    var oUl = $(".scan-list").eq(0);
    var obj_w = obj.width();
    var oUl_w = num*obj_w;
    oUl.width(oUl_w);
    new Slider().init(obj);
});

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
    init: function(obj) {
        var options = this.options;
        options.oTab = $(obj);
        options.oList = options.oTab.find("ul").eq(0);
        options.aLi = options.oList.find("li");
        options.iW = options.aLi.eq(0).width();
        var that = this;

        options.oTab.on("touchstart", function(ev) { 
            that.fnStart(ev); 
        });

        options.oTab.on("touchmove", function(ev) {
            that.fnMove(ev);
        });    

        options.oTab.on("touchend", function(ev) {
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
            options.oList.css({"WebkitTransform":"translateX("+options.iX+"px)", "transform":"translateX("+options.iX+"px)"});
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
        options.oTab.find("span").eq(0).text(options.iNow+1);
        options.iX = -options.iNow*options.iW;
     
        options.oList.css("transition", "0.5s");
        options.oList.css({"WebkitTransform":"translateX("+options.iX+"px)", "transform":"translateX("+options.iX+"px)"});
    }
   
};