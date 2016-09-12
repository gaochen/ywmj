define(function() {
    /**
     * [GetQueryString 通过名字查询url参数]
     * @param {[type]} name [description]
     */
    return function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
});