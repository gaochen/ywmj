$(function() {
    // 获取url参数
    var id = GetQueryString("caseId");    // 案例id
    var appe = GetQueryString("appe");      // 是否为E端
    var twitterId = GetQueryString("uid");    // 用户id
    var twitterType = GetQueryString("type");    // 用户类型
    var isTwitter = GetQueryString("twitter");  // 是否为twitter
    var indexId = window.location.hash;

    if (typeof appe === "string" && appe !== "null") {
        $(".appe").hide();
    }

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
        loadXCSJ(url, id, appe, twitterId, twitterType, isTwitter);
   })();

   // 加载原创团队
   (function() {
        var url = window.Host.customer+"/case/app/detail/team/"+id;
        
        // 请求数据
        loadYCTD(url, id, appe, twitterId, twitterType, isTwitter);

   })();

   // 加载详细资料
   (function() {
        var url = window.Host.customer+"/case/app/details/"+id;
        
        // 请求数据
        loadXXZL(url, id, appe, twitterId, twitterType, isTwitter);

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

    // 视频播放
    (function() {

        $(".personal-video").on("tap", function() {
            // 统计个人视频点击事件次数
            statistics();

            $(".personal-mask").addClass("show");

            var video = document.querySelector("#personal-video");
            video.play();

        });

        $(".personal-mask").on("tap", function(ev) {
            ev.stopPropagation();
            $(this).removeClass("show");
        });

        $("#personal-video").on("tap", function(ev) {
            ev.stopPropagation();
        });
        
    })();

});

/**
 * [loadXCSJ 请求现场实景数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadXCSJ(url, id, appe) {
    var url = url,
        id = id,
        appe = appe,
        twitterId = twitterId,
        twitterType = twitterType,
        isTwitter = isTwitter;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var data = data.data;
            // 720背景图
            data.caseCover = data.caseCover + window.Host.imgSize_750_750;
            $(".index-720").css("background-image","url("+data.caseCover+")");

            // 作品名称
            $(".index-720-name").text(data.caseName);

            // 720路径
            if (typeof data.pathOf720 === "string") {
                $(".index-720-btn").addClass("show");
                $("#index-720").on("click", function() {
                    // 统计公司720点击事件次数
                    statistics();

                    var weixin = navigator.userAgent.search("Language"),
                        wifi = navigator.userAgent.search("WIFI");
                    if (weixin > 0) {
                        if (wifi > 0) {
                            window.location.href = data.pathOf720;
                        }
                        else {
                            $(".wifi-mask").show();
                            $(".wifi-Lbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                window.location.href = data.pathOf720;
                            });
                            $(".wifi-Rbtn").on("click", function(ev) {
                                ev.stopPropagation();
                                $(".wifi-mask").hide();
                            });
                        }
                    }
                    else {
                        window.location.href = data.pathOf720;
                    }
                });
            }

            // 基础信息
            if (typeof data.cost === "string" && data.cost !== "0.00") {
                $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / " + data.cost + "万" + " / " + data.buildingName);
            }
            else {
                $(".index-basicInfo-info").text(data.cityName + " / " + data.decorateStyle + " / " + data.houseType + " / " + data.houseArea + "㎡" + " / "  + data.buildingName);
            }

            // 视频(1个)
            if (!!data.videos) {
                $(".js-video-title").text(data.videos[0].phaseName);
                var video_cover = data.videos[0].videoInfo.url+"?vframe/jpg/offset/"+data.videos[0].videoInfo.second+"/w/240/h/160";
                $(".personal-video").css("background-image", "url("+video_cover+")");
                $("#personal-video").attr("src", data.videos[0].videoInfo.url);
                var oDiv = $('<div></div>');
                var oSpan = $('<span></span>');
                oDiv.appendTo($(".personal-video"));
                oSpan.appendTo($(".personal-video"));
            }
            else {
                $(".js-personal-video").hide();
            }
        
            // 平面布置
            if (typeof data.planCount === "number") {
                var url_plainLayput = window.Host.local + "plainLayout.html?caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                data.planCover = data.planCover + window.Host.imgSize_750_500;
                $("#index-plainLayout").attr("href", url_plainLayput).find(".index-module-pic").css("background-image","url("+data.planCover+")");
                $(".index-plainLayout-count").text(data.planCount);
            }
            else {
                $("#index-plainLayout").hide().next(".line-index").hide();
            }

            // 实景照片
            if (typeof data.sceneCount === "number") {
                var url_realScene = window.Host.local + "realScene.html?caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                data.sceneCover = data.sceneCover + window.Host.imgSize_750_500;
                $("#index-scene").attr("href", url_realScene).find(".index-module-pic").css("background-image","url("+data.sceneCover+")");
                $(".index-scene-count").text(data.sceneCount);
            }
            else {
                $("#index-scene").hide().next(".line-index").hide();
            }

            // 相似作品
            if (data.relativeCases) {
                $.each(data.relativeCases, function(i, index) {
                    var oDiv = $('<div class="index-similar-item js-download" data-case-id='+ index.caseId +'></div>');
                    
                    var str = '<div class="index-similar-cover" style="background-image:url('+index.caseCover+window.Host.imgSize_330_330+')"></div>';
                        str += '<div class="index-similar-name">'+index.caseName+'</div>';

                    if (i === 0) {
                        oDiv.addClass("fl");
                    }
                    else {
                        oDiv.addClass("fr");
                    }
                    oDiv.html(str);
                    oDiv.appendTo($(".index-similar-frame"));
                }); 
            }
            else {
                $(".index-similar").hide().next(".line-index").hide();
            }   

            // 微信内下载提示
            wxTips();
        }
    });
}

/**
 * [loadYCTD 请求原创团队数据]
 * @param  {[type]} url [请求接口地址]
 * @param  {[type]} id  [案例编号]
 * @return {[type]}     [description]
 */
function loadYCTD(url, id, appe) {
    var url = url,
        id = id,
        appe = appe,
        twitterId = twitterId,
        twitterType = twitterType,
        isTwitter = isTwitter;

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
                var phaseId = index.phaseId;

                $.each(index.employees, function(i, index) {
                    var oLi = $('<li></li>');
                    var url = window.Host.local+"personal.html?userId="+index.userId+"&phaseId="+phaseId+"&caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                    var str = '<a href="'+url+'">';
                    str += '<div class="team-portrait fl" style="background-image: url('+index.headImage+window.Host.imgSize_80_80+');">';
                    // str += '<img src="'+index.headImage+window.Host.imgSize_80_80+'">';
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
                var url = window.Host.local+"company.html?companyId="+index.company.companyId+"&caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                var str = '<a href="'+url+'">';
                str += '<div class="team-portrait fl" style="background-image: url('+index.company.companyHeadImage+window.Host.imgSize_80_80+');">';
                //str += '<img src="'+index.company.companyHeadImage+window.Host.imgSize_80_80+'">';
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
function loadXXZL(url, id, appe) {
    var url = url,
        id = id,
        appe = appe,
        twitterId = twitterId,
        twitterType = twitterType,
        isTwitter = isTwitter;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            var data = data.data;

            // 项目造价
            if (data.costs instanceof Array) {
                $.each(data.costs, function(i, index) { 

                    if (index.id === 9) {
                        $(".data-totalCost").find("span").text(index.cost+"万元");
                    }
                    else {
                        var oLi = $('<li><div class="data-cost-icon data-icon-'+index.id+'"></div><p><span>'+index.costType+'</span><span>'+index.cost+'万元</span></p></li>');
                        
                        if ((i%2) ===0) {
                            var border = $('<div class="data-cost-line"></div>');
                            border.appendTo(oLi);
                        }

                        oLi.appendTo($(".data-cost"));
                    }

                });
            }
            else {
                $(".js-cost").hide();
            }

            // 材料品牌
            if (data.brands instanceof Array) {
                $.each(data.brands, function(i, index) {
                    var url=window.Host.local+"material.html?brandId="+index.brandId+"&caseId="+id+"&appe="+appe+"&uid="+twitterId+"&type="+twitterType+"&twitter="+isTwitter;
                    var oLi = $('<li><a href="'+url+'">'+index.brandName+'品牌</a></li>');
                    oLi.appendTo($(".data-material ul"));
                });
            }
            else {
                $(".js-brands").hide();
            }

            if ($(".js-cost").css("display") === "none" && $(".js-brands").css("display") === "none") {
                $(".data-noContent").show();
            }
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

/**
 * [statistics 友盟统计]
 * @return {[type]} [description]
 */
function statistics() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //Android接口
    if (isAndroid) {
        _czc.push(["_trackEvent","案例720","安卓设备","h5"]);        
    }
    //iOS接口
    if (isiOS) {
        _czc.push(["_trackEvent","案例720","iOS设备","h5"]);
    }
}
