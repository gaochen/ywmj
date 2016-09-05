$(function() {
    // 获取url参数
    var id = GetQueryString("caseId");
    var indexId = window.location.hash;

    // 显示对应的tab
    if (indexId === "#index=1") {
        $(".index-nav").find("a").eq(1).addClass("active").siblings("a").removeClass("active");
        $(".index-tab").eq(1).addClass("show").siblings(".index-tab").removeClass("show");
    }

    if (indexId === "#index=2") {
        $(".content").addClass("data-active");
        $(".index-nav").find("a").eq(2).addClass("active").siblings("a").removeClass("active");
        $(".index-tab").eq(2).addClass("show").siblings(".index-tab").removeClass("show");
    }

    // 加载现场实景
   (function() {
        var url = window.Host.customer+"/case/app/detail/scene/"+id;
        
        // 请求数据
        loadXCSJ(url, id);
   })();

   // 加载原创团队
   (function() {
        var url = window.Host.customer+"/case/app/detail/team/"+id;
        
        // 请求数据
        loadYCTD(url, id);

   })();

   // 加载详细资料
   (function() {
        var url = window.Host.customer+"/case/app/details/"+id;
        
        // 请求数据
        loadXXZL(url, id);

   })();

    // 头部标签切换
   (function() {
        $(".index-nav a").on("tap", function() {
            var index = $(this).index();

            if (index === 2) {
                $(".content").addClass("data-active");
            }
            else {
                $(".content").removeClass("data-active");
            }

            $(this).addClass("active").siblings("a").removeClass("active");
            $(".index-tab").eq(index).addClass("show").siblings(".index-tab").removeClass("show");
        });
   })();

    // 关闭底部下载提示层
    $(".bottom-close").on("click", function(ev) {
        ev.stopPropagation();
        $(".wrap").find(".bottom").remove();
    });

});

/**
 * [loadXCSJ 请求现场实景数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadXCSJ(url, id) {
    var url = url,
        id = id;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var data = data.data;
            // 720背景图
            $(".index-720").css("background-image","url("+data.caseCover+")");

            // 作品名称
            $(".index-720-name").text(data.caseName);

            // 720路径
            if (typeof data.pathOf720 === "string") {
                $(".index-720-btn").addClass("show");
                $("#index-720").addClass("show").attr("href", data.pathOf720);
            }

            // 基础信息
            $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / " + data.cost + "万" + " / " + data.buildingName);
        
            // 平面布置
            var url_plainLayput = "http://" + window.location.host + "/template/plainLayout.html?caseId="+id;
            $("#index-plainLayout").attr("href", url_plainLayput).find(".index-module-pic").css("background-image","url("+data.planCover+")");
        
            // 实景照片
            var url_realScene = "http://" + window.location.host + "/template/realScene.html?caseId="+id;
            $("#index-scene").attr("href", url_realScene).find(".index-module-pic").css("background-image","url("+data.sceneCover+")");

            // 相似作品
            $.each(data.relativeCases, function(i, index) {
                var oDiv = $('<div class="index-similar-item fl" data-case-id='+ index.caseId +'><div class="index-similar-cover" style="background-image:url('+ data.caseCover +')"></div><div class="index-similar-name">'+index.caseName+'</div></div>');
                if (i === 0) {
                    oDiv.addClass("fl");
                }
                else {
                    oDiv.addClass("fr");
                }
                oDiv.appendTo($(".index-similar-frame"));
            }); 
        }
    });
}

/**
 * [loadYCTD 请求原创团队数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadYCTD(url, id) {
    var url = url,
        id = id;

   // return false;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var data = data.data;

            $.each(data.phases, function(i, index) {
                var oDiv = $('<div class="team-group"><div class="team-title">'+index.phase+'</div></div>');
                var oLine = $('<div class="line-index"></div>');
                var oUl = $('<ul class="team-list clearfix"></ul>'); 

                $.each(index.employees, function(i, index) {
                    var oLi = $('<li></li>');
                    var url = "http://"+window.location.host+"/template/personal.html?caseId="+index.userId;
                    var str = '<a href="'+url+'">';
                    str += '<div class="team-portrait fl">';
                    str += '<img src="'+index.headImage+'">';
                    str += '</div>';
                    str += '<div class="team-member fl">';
                    str += '<h4>'+index.name+'</h4>';
                    str += '<p>'+index.title+'</p>';
                    str += '</div>';
                    str += '<span></span>';
                    str += '</a>';

                    oLi.html(str).appendTo(oUl);
                });

                var company = $('<li></li>');
                var url = "http://"+window.location.host+"/template/company.html?caseId="+index.company.companyId;
                var str = '<a href="'+url+'">';
                str += '<div class="team-portrait fl">';
                str += '<img src="'+index.company.companyHeadImage+'">';
                str += '</div>';
                str += '<div class="team-member fl">';
                str += '<h4>'+index.company.companyName+'</h4>';
                str += '<p>所属公司</p>';
                str += '</div>';
                str += '<span></span>';
                str += '</a>'; 

                company.html(str).appendTo(oUl);
                oUl.appendTo(oDiv);
                oDiv.appendTo($(".js-team"));
                oLine.appendTo($(".js-team"));
            });

        }
    });
}

/**
 * [loadXXZL 请求详细资料数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadXXZL(url, id) {
    var url = url,
        id = id;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var data = data.data;

            // 项目造价
            $.each(data.costs, function(i, index) {                
                if (index.id === 9) {
                    $(".data-totalCost").find("span").text(index.cost+"万元");
                }
                else {
                    var oLi = $('<li><div class="data-cost-icon data-icon-'+index.id+'"></div><p><span>'+index.costType+'</span><span>'+index.cost+'万元</span></p></li>');
                    
                    if ((index.id%2) ===1) {
                        var border = $('<div class="data-cost-line"></div>');
                        border.appendTo(oLi);
                    }

                    oLi.appendTo($(".data-cost"));
                }

            });

            // 材料品牌
            $.each(data.brands, function(i, index) {
                var url;
                switch (index.brandId) {
                    case 1:
                    // 主材品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=1&caseId="+id;
                    case 2:
                    // 辅材品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=2&caseId="+id;
                    case 3:
                    // 设备品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=3&caseId="+id;
                    case 4:
                    // 家居品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=4&caseId="+id;
                    case 5:
                    // 灯具品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=5&caseId="+id;
                    case 6:
                    // 饰品品牌
                    url = "http://"+window.location.host+"/template/material.html?brandType=6&caseId="+id;
                }
                var oLi = $('<li><a href="'+url+'">主材品牌</a></li>');
                oLi.appendTo($(".data-material ul"));

            });
        }
    });
}

/**
 * [lazyLoad 滚动延时加载]
 * @param  {[type]} arr [dom类数组]
 * @return {[type]}     [description]
 */
function lazyLoad(arr) {
    for (var i=0, len=arr.length; i< len; i++) {
        var _this = arr[i];
        var src = _this.dataset.src;
        var top = _this.getBoundingClientRect().top;

        if ( top < 666 && _this.style.backgroundImage === "") {
            _this.style.backgroundImage = "url("+src+")";
        }
    }
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
