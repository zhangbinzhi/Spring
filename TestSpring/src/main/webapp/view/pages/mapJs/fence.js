/**
 * Created by binzhi on 2018/9/16.道路限速
 */

var fenceMap, fenceSource, fenceVector, fenceFeature = {};

var fenceVehicleNumToTreeIdMap = {},fenceVehicleTree,fenceCheckedVehicle={},vehicleToFenceConditionMap = {};
var fenceAction = 'add';

function initFence(sourceMap, cb) {
    fenceMap = sourceMap;
    fenceSource = new ol.source.Vector();
    fenceVector = new ol.layer.Vector({
        source: fenceSource,
        zIndex:10
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
    //initInteraction(sourceMap, fenceSource, function (geojson) {
    //    console.log(geojson)
    //});
    //fenceMap.addLayer(fenceVector);
    return fenceVector;
}

function loadFence() {
    fenceSource.clear();
    fenceFeature={};
    $.ajax({
        url:httpServer+ "/map/loadFence",
        type: "post",
        dataType: 'json',
        data: {pageIndex: 1, pageSize: 9},
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                appendToFenceTable(items)
            } else {
                layer.alert("查询道路信息失败")
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}


var fenceTreeSetting = {
    view: {
        addHoverDom: false,
        removeHoverDom: false,
        selectedMulti: false
    },
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id"
        }
    },
    edit: {
        enable: false
    },
    callback: {
        onCheck: fenceTreeOnCheck,
        beforeCheck:fenceTreeBeforeCheck
        //onClick: treeOnclick
    }
};

function fenceTreeOnCheck(e, treeId, treeNode){
    var url = "";
    if(treeNode.checked){
        url =  httpServer+"/vehicle/setVehicleToFence";
    }else{
        url =  httpServer+"/vehicle/cancelVehicleToFence";
    }
    $.ajax({
        url:url,
        type: "post",
        dataType: 'json',
        data: {
            fence_id: $("#fence_id").val(),
            vehicle_number:treeNode.id,
            warn_condition:$("#condition").val()
        },
        success: function (data) {
            if (data.status === "success") {
                if(treeNode.checked){
                    vehicleToFenceConditionMap[treeNode.id] = $("#condition").val();
                }else{
                    vehicleToFenceConditionMap[treeNode.id] = null;
                }
            }else{
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}
function fenceTreeBeforeCheck(treeId, treeNode){
    if(treeNode.isParent){
        layer.alert("只能勾选车车牌号码！");
        return false;
    }
    if(treeNode.checked){
        return true;
    }
    var currentCondition = vehicleToFenceConditionMap[treeNode.id];
    if(!!currentCondition){
        if($("#condition").val()==currentCondition){
            return true
        }else{
            return confirm("车辆： "+treeNode.id+" ,已经配置了条件："+currentCondition+" ，确定修改为："+$("#condition").val()+" 吗？");
        }
    }
    return true
}

function loadFenceVecicleFromLocal() {
    if (window.localStorage) {
        if (!localStorage.lealone_harbor) {
            console.log('getting vehicle from server');
            reflashFenceVehicle();
        } else {
            console.log('loading vehicle from localStorage');
            try {
                var vehicles = JSON.parse(localStorage.lealone_harbor);
                for (var i = 0, size = vehicles.length; i < size; i++) {
                    if (fenceCheckedVehicle[vehicles[i].id]) {
                        vehicles[i].checked = true;
                    }
                }
                fenceVehicleTree = $.fn.zTree.init($("#fenceTree"), fenceTreeSetting, vehicles);
                initFenceVehicleNumToTreeIdMap();
            } catch (e) {
                console.log('failed to parse local record!', e);
                reflashFenceVehicle();
            }
        }

    } else {
        alert('您的浏览器过于陈旧，部分功能可能无法正常使用！');
    }
}

function reflashFenceVehicle() {
    console.log('getting vehicle from server');
    $.ajax({
        url: httpServer + "loadAllVehicle",
        type: "post",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                var zNodes = getZNodes(items);
                for (var i = 0, size = zNodes.length; i < size; i++) {
                    if (fenceCheckedVehicle[zNodes[i].id]) {
                        zNodes[i].checked = true;
                    }
                }
                localStorage.lealone_harbor = JSON.stringify(zNodes);
                fenceVehicleTree = $.fn.zTree.init($("#fenceTree"), fenceTreeSetting, zNodes);
                initFenceVehicleNumToTreeIdMap();
            }
        }
    });
}

function initFenceVehicleNumToTreeIdMap() {
    var nodes = fenceVehicleTree.getNodes();
    for (var i = 0, size = nodes.length; i < size; i++) {
        //console.log("111")
        nodeIteration(nodes[i],fenceVehicleNumToTreeIdMap);
        //console.log("333")
    }
}

function startDrawFence(ele) {
    var text = $(ele).text().trim();
    if (text !== "开始绘制") {
        return
    }
    var fenceInput = $("#fenceInput").val();
    if (!fenceInput) {
        layer.alert("请先输入围栏名称");
        return
    }
    $("#btn_startDrawFence").text("请在地图上绘制...").attr("disabled", "disabled");
    initInteraction(fenceMap, fenceSource, function (geojson) {
        console.log(geojson)
    });
    fenceSource.clear();
    changeInteraction("Polygon", fenceSource, function (geojsonStr, geojson) {
        var fenceInput = $("#fenceInput").val();
        geojson.set('name', fenceInput);
        geojson.setStyle(fenceStyle(fenceInput));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(geojson, {featureProjection: "EPSG:3857", decimals: 6});
        //console.log(geojsonStr2);
        $("#fenceGeojson").val(geojsonStr2);
    })
}

function saveFence() {
    var fenceInput = $("#fenceInput").val();
    if (!fenceInput) {
        layer.alert("请填写完表格!");
        return
    }
    var geoJsonStr = $("#fenceGeojson").val();
    if(!geoJsonStr){
        layer.alert("请先绘制!");
        return
    }
    var url = httpServer+"/map/addFence";
    var data = {
            fence_id: fenceInput,
            status: $("#fenceStatus").val(),
            geometry: $("#fenceGeojson").val()
        };
    if(fenceAction==='edit'){
        url = httpServer+"/map/editFence";
        data['fenceHistoryName']= $("#fenceHistoryName").val();
        var feature = fenceFeature[$("#fenceHistoryName").val()];
        feature.set('name', fenceInput);
        feature.setStyle(fenceStyle(fenceInput));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
        $("#fenceGeojson").val(geojsonStr2);
        data['geometry']= $("#fenceGeojson").val();
    }
    $.ajax({
        url: url,
        type: "post",
        dataType: 'json',
        data: data,
        success: function (data) {
            changeInteraction();
            removeInteraction();
            if (data.status === "success") {
                layer.alert("保存成功", function () {
                    layer.closeAll();
                    loadFence();
                    showFenceTable();
                });
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function editFence(fence_id,btn){
    fenceAction = 'edit';
    var tds = btn.parent().siblings();
    for(var i= 0,size = tds.length;i<size;i++){
        console.log(tds[i].innerHTML)
    }
    $("#fenceInput").val($(tds[1]).children("a:first-child").text());
    $("#fenceHistoryName").val(fence_id);

    var inUse = tds[2].innerHTML;
    if(inUse=="是"){
        $("#fenceStatus").val(1);
    }else{
        $("#fenceStatus").val(0);
    }

    for(var id in fenceFeature){
        var feature = fenceFeature[id];
        if(id!==fence_id){
            fenceSource.removeFeature(feature)
        }else{
            map.getView().setCenter(feature.getGeometry().getCoordinates()[0][0]);
            var writer = new ol.format.GeoJSON();
            var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
            $("#fenceGeojson").val(geojsonStr2);
        }
    }
    initInteraction(fenceMap,fenceSource,function (geojson) {
        console.log(geojson);
        $("#fenceGeojson").val(geojson);
    });
    showAddFenceForm();
}

function cancelFence() {
    if (fenceAction==='add'){
        var text = $("#btn_startDrawFence").text();
        if (text === "请在地图上绘制...") {
            $("#btn_startDrawFence").text("开始绘制").removeAttr("disabled");
            changeInteraction();
            removeInteraction();
            loadFence()
        }
    }else{
        changeInteraction();
        removeInteraction();
        loadFence();
    }

    showFenceTable();
}

function showAddFenceForm() {
    if(fenceAction==='add'){
        $("#fenceInput").val("");
        $("#btn_startDrawFence").text("开始绘制").removeAttr("disabled").show();
    }else{
        $("#btn_startDrawFence").hide()
    }
    $("#div_addFenceForm").show();
    $("#div_fenceTable").hide();
}

function showFenceTable() {
    $("#div_addFenceForm").hide();
    $("#div_fenceTable").show();
}


function addFence(){
    fenceAction = 'add';
    showAddFenceForm();
}

function deleteFence(id) {
    layer.confirm("确定删除限速：" + id + " 吗？", function () {
        $.ajax({
            url: httpServer+"/map/deleteFence",
            type: "post",
            dataType: 'json',
            data: {keys: id},
            success: function (data) {
                if (data.status === "success") {
                    layer.alert("删除成功", function () {
                        layer.closeAll();
                        loadFence();
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

function appendToFenceTable(items) {
    $("#table_fence").empty();
    var count = 0;
    items.forEach(function (item) {
        count++;
        var fence_id = item.fence_id;
        var status = item.status;
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
        feature.setStyle(fenceStyle(feature.get("name")));
        fenceFeature[fence_id] = feature;
        fenceSource.addFeature(feature);

        $("<tr   item = '" + fence_id + "'>" +
            "<td>" + count + "</td>" +
            "<td id='" + fence_id + "' onclick='showFence($(this))'><a href='javascript:void(0)'>" + fence_id + "</a></td>" +
                //"<td>" + speed + "</td>" +
            "<td>" + status + "</td>" +
            "<td>" +
            "   <a  href ='javascript:void(0);' onclick='editFence(\"" + fence_id + "\",$(this))' >编辑</a>" +
            "   <a  href ='javascript:void(0);' onclick='deleteFence(\"" + fence_id + "\")' style=\"padding-left: 10px;\">删除</a>" +
            "   <a  href ='javascript:void(0);' onclick='getVehicleToFence(\"" + fence_id + "\")' style=\"padding-left: 10px;\">车辆管理</a>" +
            //"<div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n" +
            //"  <button type=\"button\" class=\"btn btn-sm\">编辑</button>\n" +
            //"  <button type=\"button\" class=\"btn btn-sm\">删除</button>\n" +
            //"  <button type=\"button\" class=\"btn btn-sm\">配置车辆</button>\n" +
            //"</div>"+
                //"   <button type='button' class='btn btn-default' onclick='' >保存</button>" +
            "</td>" +
            "</tr>")
            .appendTo($("#table_fence"));
    });

    $("#fenceTable").bootstrapTable(
        {
            //showExport: true,                     //是否显示导出
            //exportDataType: "all"              //basic', 'all', 'selected'.
            search:false
        }
    );
}

function getVehicleToFence(fence_id){
    var fence =  $("#fence_id").val();
    if(!!fence_id){
        $("#fence_id").val(fence_id);
        fence = fence_id
    }
    var condition = $("#condition").val();
    $.ajax({
        url: httpServer+"/vehicle/getVehicleToFence",
        type: "post",
        dataType: 'json',
        data: {fence_id: fence},
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                fenceCheckedVehicle = {};
                vehicleToFenceConditionMap={};
                for(var i= 0,size = items.length;i<size;i++){
                    vehicleToFenceConditionMap[items[i].vehicle_number] =items[i].warn_condition;
                    if(items[i].warn_condition == condition){
                        fenceCheckedVehicle[items[i].vehicle_number] = true
                    }
                }
                for(var  vehicleNum in fenceVehicleNumToTreeIdMap){
                    var node = fenceVehicleTree.getNodeByTId(fenceVehicleNumToTreeIdMap[vehicleNum]);
                    node.checked = !!fenceCheckedVehicle[vehicleNum];
                    fenceVehicleTree.updateNode(node);
                }
                layerIndex = layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    title:"请勾选车辆",
                    //area: ['420px','550px'], //宽高
                    content: $("#fenceTreeDiv")
                });
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function changeWarnCondition(){
    var condition = $("#condition").val();
    for(var  vehicleNum in fenceVehicleNumToTreeIdMap){
        var node = fenceVehicleTree.getNodeByTId(fenceVehicleNumToTreeIdMap[vehicleNum]);

        node.checked = (condition ===vehicleToFenceConditionMap[vehicleNum]);
        fenceVehicleTree.updateNode(node);
    }
}

function showFence(tr) {
    //选中行是突出显示颜色
    tr.parent().css("background-color", "#e5e5e5").siblings().css("background-color", "#FFFFFF");
    //var geojsonStr =  tr.attr("item");
    //var feature= (new ol.format.GeoJSON()).readFeature(geojsonStr,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
    //var name = feature.get("name");
    //feature.setStyle(fenceStyle(name));
    //feature.setId(name);
    var id = tr.attr("id");
    var feature = fenceFeature[id];
    if (!!feature) {
        //将第一条线的第一个点作为地图的中心
        map.getView().setCenter(feature.getGeometry().getCoordinates()[0][0]);
    } else {

    }
    //console.log(feature.get("name"));

    //console.log( feature.getGeometry().getCoordinates()[0][0])

}