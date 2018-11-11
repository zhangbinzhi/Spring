/**
 * Created by binzhi on 2018/9/16.道路限速
 */

var roadLimitMap, roadLimitSource, roadLimitVector, roadLimitFeature = {};
var roadLimitAction = 'add';
function initRoadLimit(sourceMap, cb) {
    roadLimitMap = sourceMap;
    roadLimitSource = new ol.source.Vector();
    roadLimitVector = new ol.layer.Vector({
        source: roadLimitSource,
        zIndex:12
        //style: new ol.style.Style({
        //    fill: new ol.style.Fill({
        //        color: 'rgba(255, 255, 255, 0.2)'
        //    }),
        //    stroke: new ol.style.Stroke({
        //        color: '#ffcc33',
        //        width: 2
        //    }),
        //    image: new ol.style.Circle({
        //        radius: 7,
        //        fill: new ol.style.Fill({
        //            color: '#ffcc33'
        //        })
        //    })
        //})
    });
    //initInteraction(sourceMap, roadLimitSource, function (geojson) {
    //    console.log(geojson)
    //});
    roadLimitMap.addLayer(roadLimitVector);
    return roadLimitVector;
}


function loadRoadLimit() {
    roadLimitSource.clear();
    roadLimitFeature ={};
    $.ajax({
        url: httpServer+"/map/loadRoadLimit",
        type: "post",
        dataType: 'json',
        data: {pageIndex: 1, pageSize: 500},
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                appendToTable(items)
            } else {
                layer.alert("查询道路信息失败")
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function showAddRoadLimitForm() {
    if(roadLimitAction==='add'){
        $("#roadLimitNameInput").val("");
        $("#limitSpeed").val("");
        $("#btn_startDrawRoadLimit").text("开始绘制").removeAttr("disabled").show();
    }else{
        $("#btn_startDrawRoadLimit").hide();
    }
    $("#div_addRoadLimitForm").show();
    $("#div_roadLimitTable").hide();
}

function showRoadLimitTable() {
    $("#div_addRoadLimitForm").hide();
    $("#div_roadLimitTable").show();
}

function startDrawRoadLimit(ele) {
    var text = $(ele).text().trim();
    if (text !== "开始绘制") {
        return
    }
    var roadLimitName = $("#roadLimitNameInput").val();
    if (!roadLimitName) {
        layer.alert("请先输入道路名称");
        return
    }
    $("#btn_startDrawRoadLimit").text("请在地图上绘制...").attr("disabled", "disabled");
    initInteraction(roadLimitMap, roadLimitSource, function (geojson) {
        console.log(geojson)
    });
    roadLimitSource.clear();
    changeInteraction("LineString", roadLimitSource, function (geojsonStr, geojson) {
        var roadLimitName = $("#roadLimitNameInput").val();
        geojson.set('name', roadLimitName);
        geojson.setStyle(styleFunction(roadLimitName));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(geojson, {featureProjection: "EPSG:3857", decimals: 6});
        //console.log(geojsonStr2);
        $("#roadLimitGeojson").val(geojsonStr2);
    })
}

function cancelRoadLimit(){
    if (roadLimitAction==='add'){
        var text =  $("#btn_startDrawRoadLimit").text();
        if(text ==="请在地图上绘制..."){
            $("#btn_startDrawRoadLimit").text("开始绘制").removeAttr("disabled");
            changeInteraction();
            removeInteraction();
            loadRoadLimit();
        }
    }else{
        changeInteraction();
        removeInteraction();
        loadRoadLimit();
    }
    showRoadLimitTable();
}

function saveRoadLimit() {
    var roadLimitName = $("#roadLimitNameInput").val();
    var limitSpeed = $("#limitSpeed").val();

    if (!roadLimitName || !limitSpeed) {
        layer.alert("请填写完表格!");
        return
    }
    var geoJsonStr = $("#roadLimitGeojson").val();
    if(!geoJsonStr){
        layer.alert("请先绘制路线!");
        return
    }
    var data =  {
        road_id: roadLimitName,
        status: $("#roadLimitStatus").val(),
        geometry: $("#roadLimitGeojson").val(),
        limit_speed: limitSpeed
    };
    var url=httpServer+"/map/addRoadLimit";
    if(roadLimitAction==='edit'){
        url=httpServer+"/map/editRoadLimit";
        data['roadLimitHistoryName'] = $("#roadLimitHistoryName").val();
        var feature = roadLimitFeature[$("#roadLimitHistoryName").val()];
        feature.set('name', roadLimitName);
        feature.setStyle(styleFunction(roadLimitName));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
        $("#roadLimitGeojson").val(geojsonStr2);
        data['geometry']= $("#roadLimitGeojson").val();
    }
    $.ajax({
        url: url,
        type: "post",
        dataType: 'json',
        data:data,//限速信息先写死
        success: function (data) {
            changeInteraction();
            removeInteraction();
            if (data.status === "success") {
                $("#btn_startDrawRoadLimit").text("开始绘制").removeAttr("disabled");
                layer.alert("保存成功", function () {
                    layer.closeAll();
                    loadRoadLimit();
                    showRoadLimitTable();
                });

            } else {
                layer.alert("添加道路信息失败")
            }

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function deleteRoadLimit(id) {
    layer.confirm("确定删除限速：" + id + " 吗？", function () {
        $.ajax({
            url: httpServer+"/map/deleteRoadLimit",
            type: "post",
            dataType: 'json',
            data: {keys: id},
            success: function (data) {
                if (data.status === "success") {
                    layer.alert("删除成功", function () {
                        layer.closeAll();
                        loadRoadLimit();
                    })
                } else {
                    layer.alert(data.msg)
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert("连接服务器失败")
            }
        });
    })
}

function appendToTable(items) {
    $("#table_roadLimit").empty();
    var count = 0;
    items.forEach(function (item) {
        count++;
        var road_id = item.road_id;
        var status = item.status;
        var speed = item.limit_speed;
        if (!!status) {
            status = '是'
        } else {
            status = '否'
        }
        var geoJson = item.geometry;
        geoJson = geoJson.replace(new RegExp("&quot;", 'g'), "\"");
        //console.log(geoJson);
        var feature = (new ol.format.GeoJSON()).readFeature(geoJson, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857"
        });
        feature.setStyle(styleFunction(feature.get("name")));
        roadLimitFeature[road_id] = feature;
        roadLimitSource.addFeature(feature);

        $("<tr   item = '" + road_id + "'>" +
            "<td>" + count + "</td>" +
            "<td id='" + road_id + "' onclick='showRoadLimit($(this))'><a href='javascript:void(0)'>" + road_id + "</a></td>" +
            "<td>" + speed + "</td>" +
            "<td>" + status + "</td>" +
            "<td>" +
            "   <a  href ='javascript:void(0);' onclick='editRoadLimit(\"" + road_id + "\",$(this))' >编辑</a>" +
            "   <a  href ='javascript:void(0);' onclick='deleteRoadLimit(\"" + road_id + "\")' style=\"padding-left: 10px;\">删除</a>" +
                //"   <button type='button' class='btn btn-default' onclick='' >保存</button>" +
            "</td>" +
            "</tr>")
            .appendTo($("#table_roadLimit"));
    });

    $("#roadLimitTable").bootstrapTable(
        {
        //showExport: true,                     //是否显示导出
        //exportDataType: "all"              //basic', 'all', 'selected'.
            search:false
        }
    );

}

function  addRouteLimit(){
    roadLimitAction = 'add';
    showAddRoadLimitForm();
}

function editRoadLimit(road_id,btn){
    roadLimitAction = 'edit';
    var tds = btn.parent().siblings();
    //for(var i= 0,size = tds.length;i<size;i++){
    //    console.log(tds[i].innerHTML)
    //}
    $("#roadLimitNameInput").val($(tds[1]).children("a:first-child").text());
    $("#limitSpeed").val(tds[2].innerHTML);
    $("#roadLimitHistoryName").val(road_id);
    var inUse = tds[3].innerHTML;
    if(inUse=="是"){
        $("#roadLimitStatus").val(1);
    }else{
        $("#roadLimitStatus").val(0);
    }
    for(var id in roadLimitFeature){
        var feature = roadLimitFeature[id];
        if(id!==road_id){
            roadLimitSource.removeFeature(feature)
        }else{
            map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
            var writer = new ol.format.GeoJSON();
            var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
            $("#roadLimitGeojson").val(geojsonStr2);
        }
    }
    initInteraction(roadLimitMap,roadLimitSource,function (geojson) {
        console.log(geojson)
        $("#roadLimitGeojson").val(geojson);
    });
    showAddRoadLimitForm();
}

function showRoadLimit(tr) {
    //选中行是突出显示颜色
    tr.parent().css("background-color", "#e5e5e5").siblings().css("background-color", "#FFFFFF");
    //var geojsonStr =  tr.attr("item");
    //var feature= (new ol.format.GeoJSON()).readFeature(geojsonStr,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
    //var name = feature.get("name");
    //feature.setStyle(styleFunction(name));
    //feature.setId(name);
    var id = tr.attr("id");
    var feature = roadLimitFeature[id];
    if (!!feature) {
        //将第一条线的第一个点作为地图的中心
        map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
    } else {

    }
    //console.log(feature.get("name"));

    //console.log( feature.getGeometry().getCoordinates()[0][0])

}