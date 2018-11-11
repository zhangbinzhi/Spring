/**
 * Created by binzhi on 2018/9/16.
 */

$(function () {
    var settingLayer={};
    initMap('addMessure');
    $('#map-table .btn_ss_a').click(function(){
        $(this).addClass('none').siblings().removeClass('none');
        $('.map-right').css('bottom','10px');
    });

    $('#map-table .btn_ss_b').click(function(){
        $(this).addClass('none').siblings().removeClass('none');
        $('.map-right').css('bottom','290px');
    });
    $('.map-right .btn_ss_c').click(function(){
        $(this).parent().toggleClass('ss')
    });

    loadRouteVecicleFromLocal();
    loadFenceVecicleFromLocal();
    settingLayer["限速设置"] =initRoadLimit(map);
    loadRoadLimit();

    $(".MeasureTool").css("display", "none");
    $('.dropDownBtn').on('click',function(){
        $(this).toggleClass("zk").parents('.dropDown').find('.list').toggle();
    });
    $(".list li span").css("color", "#000");
    /*图层选择*/
    $(".selectLayer input").on('click', function () {
        var _this = $(this),
            flag = _this.is(':checked');
        selectLayer(_this);
    });

    $('#myTabs a').click(function (e) {
        //e.preventDefault();
        //$(this).tab('show');
        var aria_expanded = $(this).attr("aria-expanded");
        if(aria_expanded==="false"){
            //发生了tab 变化
            var tabName =$(this)[0].innerHTML;
            console.log(tabName);
            for(var key in settingLayer){
                if(key!==tabName){
                    var mapLayer = settingLayer[key];
                    mapLayer.getSource().clear();
                    map.removeLayer(mapLayer);
                }
            }

            if(!settingLayer[tabName]){
                if(tabName==="越线设置"){
                    var newLayer = initPlanRoute(map);
                    settingLayer["越线设置"] =newLayer;
                }else if(tabName==="电子围栏设置"){
                    var newLayer = initFence(map);
                    settingLayer["电子围栏设置"] =newLayer;
                }else{
                    return
                }
            }
            map.addLayer(settingLayer[tabName]);
            if(tabName==="限速设置"){
                cancelRoadLimit();
                loadRoadLimit();
            }else if(tabName==="越线设置"){
                loadPlanRoute();
            }else if(tabName==="电子围栏设置"){
                loadFence();
            }else{
                return;
            }
            //initInteraction(map, settingLayer[tabName].getSource(), function (geojson) {
            //    console.log(geojson)
            //});
        }
    });
});


