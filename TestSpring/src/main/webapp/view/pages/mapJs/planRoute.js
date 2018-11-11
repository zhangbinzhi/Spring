/**
 * Created by binzhi on 2018/9/16.道路限速
 */

var planRouteMap, planRouteSource, planRouteVector, planRouteFeature = {},routeVehicleNumToTreeIdMap = {},routeVehicleTree,routeCheckedVehicle={};
var vehicleToRouteMap = {},planRouteAction = 'add';
var routeTreeSetting = {
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
        onCheck: treeOnCheck,
        beforeCheck:beforeCheck
        //onClick: treeOnclick
    }
};

function beforeCheck(treeId, treeNode){
    if(treeNode.isParent){
        layer.alert("只能勾选车车牌号码！");
        return false;
    }
    if(treeNode.checked){
        return true;
    }
    var route = vehicleToRouteMap[treeNode.id];
    if(!route){
        return true
    }else{
        if(route != $("#route_id").val()){
            var msg = "车辆 ： "+treeNode.id+" 已绑定了道路："+route+" ,确定重新绑定吗？";
            return confirm(msg);
        }else{
            return true;
        }
    }
}
function routeDone(){
    layer.closeAll();
}

function treeOnCheck(e, treeId, treeNode) {
    var url = "";
    if(treeNode.checked){
        url =  httpServer+"/vehicle/setVehicleToRoute";
    }else{
        url =  httpServer+"/vehicle/cancelVehicleToRoute";
    }
    $.ajax({
        url:url,
        type: "post",
        dataType: 'json',
        data: {route_id: $("#route_id").val(),vehicle_number:treeNode.id,offset:30},
        success: function (data) {
            if (data.status === "success") {
                if(treeNode.checked){
                    vehicleToRouteMap[treeNode.id] =  $("#route_id").val();
                }else{
                    vehicleToRouteMap[treeNode.id] = null;
                }
            }else{
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}


function loadRouteVecicleFromLocal() {
    if (window.localStorage) {
        if (!localStorage.lealone_harbor) {
            console.log('getting vehicle from server');
            reflashRouteVehicle();
        } else {
            console.log('loading vehicle from localStorage');
            try {
                var vehicles = JSON.parse(localStorage.lealone_harbor);
                for (var i = 0, size = vehicles.length; i < size; i++) {
                    if (routeCheckedVehicle[vehicles[i].id]) {
                        vehicles[i].checked = true;
                    }
                }
                routeVehicleTree = $.fn.zTree.init($("#treeDemo"), routeTreeSetting, vehicles);
                initRouteVehicleNumToTreeIdMap();
            } catch (e) {
                console.log('failed to parse local record!', e);
                reflashRouteVehicle();
            }
        }

    } else {
        alert('您的浏览器过于陈旧，部分功能可能无法正常使用！');
    }
}

function reflashRouteVehicle() {
    console.log('getting vehicle from server');
    $.ajax({
        url: httpServer + "/loadAllVehicle",
        type: "post",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                var zNodes = getZNodes(items);
                for (var i = 0, size = zNodes.length; i < size; i++) {
                    if (routeCheckedVehicle[zNodes[i].id]) {
                        zNodes[i].checked = true;
                    }
                }
                localStorage.lealone_harbor = JSON.stringify(zNodes);
                routeVehicleTree = $.fn.zTree.init($("#treeDemo"), routeTreeSetting, zNodes);
                initRouteVehicleNumToTreeIdMap();
            }
        }
    });
}

function initRouteVehicleNumToTreeIdMap() {
    var nodes = routeVehicleTree.getNodes();
    for (var i = 0, size = nodes.length; i < size; i++) {
        //console.log("111")
        nodeIteration(nodes[i],routeVehicleNumToTreeIdMap);
        //console.log("333")
    }
}


function nodeIteration(node,map) {
    //console.log("222");
    map[node.id] = node.tId;
    if (node.isParent) {
        var children = node.children;
        for (var i = 0, size = children.length; i < size; i++) {
            nodeIteration(children[i],map);
        }
    }
}

function getZNodes(items) {
    var nodeRecoeds = {};
    var zNodes = [];
    for (var i = 0; i < items.length; i++) {
        var status = items[i].status;
        var headcompany = items[i].headcompany;
        var subcompany = items[i].subcompany;
        var department = items[i].department;
        var teams = items[i].teams;
        var icon;
        if (!status || status === "false") {
            icon = "images/bootstrap-red.png"
        } else {
            icon = ""
        }
        if (!headcompany || headcompany === "null") {
            zNodes.push({id: items[i].vehicle_number, pId: 0, name: items[i].vehicle_number});
            continue;
        }
        if (!nodeRecoeds[headcompany]) {
            //加入总公司节点
            nodeRecoeds [headcompany] = true;
            zNodes.push({id: headcompany, pId: 0, name: headcompany, open: true});
        }
        if (!!subcompany && subcompany != "null") {
            if (!nodeRecoeds[subcompany]) {
                //加入子公司节点
                nodeRecoeds[subcompany] = true;
                zNodes.push({id: subcompany, pId: headcompany, name: subcompany, open: true});
            }
            if (!!department && department !== "null") {
                if (!nodeRecoeds[department]) {
                    //加入部门节点
                    nodeRecoeds[department] = true;
                    zNodes.push({id: department, pId: subcompany, name: department, open: true});
                }
                if (!!teams && teams !== "null") {
                    if (!nodeRecoeds[teams]) {
                        //加入队伍节点
                        nodeRecoeds[teams] = true;
                        zNodes.push({id: teams, pId: department, name: teams, open: true, "icon": icon});
                    }
                    //绑定在队伍下
                    zNodes.push({
                        id: items[i].vehicle_number,
                        pId: teams,
                        name: items[i].vehicle_number,
                        "icon": icon
                    });
                } else {
                    //队伍为空时，直接绑在部门下
                    zNodes.push({
                        id: items[i].vehicle_number,
                        pId: department,
                        name: items[i].vehicle_number,
                        "icon": icon
                    });
                }

            } else {
                //部门为空时，直接绑在子公司下
                zNodes.push({
                    id: items[i].vehicle_number,
                    pId: subcompany,
                    name: items[i].vehicle_number,
                    "icon": icon
                });
            }
        } else {
            //子公司为空时直接绑在总公司下
            zNodes.push({
                id: items[i].vehicle_number,
                pId: headcompany,
                name: items[i].vehicle_number,
                "icon": icon
            });
        }


    }
    return zNodes;
}

function initPlanRoute(sourceMap, cb) {
    planRouteMap = sourceMap;
    planRouteSource = new ol.source.Vector();
    planRouteVector = new ol.layer.Vector({
        source: planRouteSource
        ,zIndex:11
    });
    //initInteraction(sourceMap, planRouteSource, function (geojson) {
    //    console.log(geojson)
    //});
    //map.addLayer(planRouteVector);
    return planRouteVector;
}

function loadPlanRoute() {
    planRouteSource.clear();
    planRouteFeature={};
    $.ajax({
        url: httpServer+"/map/loadPlanRoute",
        type: "post",
        dataType: 'json',
        data: {pageIndex: 1, pageSize: 500},
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                appendToPlanRouteTable(items)
            } else {
                layer.alert("查询道路信息失败")
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function showAddPlanRouteForm() {
    if(planRouteAction==='add'){
        $("#planRouteInput").val("");
        $("#btn_startDrawPlanRoute").text("开始绘制").removeAttr("disabled").show();
    }else{
        $("#btn_startDrawPlanRoute").hide()
    }
    $("#div_addPlanRouteForm").show();
    $("#div_planRouteTable").hide();
}

function showPlanRouteTable() {
    $("#div_addPlanRouteForm").hide();
    $("#div_planRouteTable").show();
}

function startDrawPlanRoute(ele) {
    var text = $(ele).text().trim();
    if (text !== "开始绘制") {
        return
    }
    var roadLimitName = $("#planRouteInput").val();
    if (!roadLimitName) {
        layer.alert("请先输入导航名称");
        return
    }
    $("#btn_startDrawPlanRoute").text("请在地图上绘制...").attr("disabled", "disabled");
    planRouteSource.clear();
    initInteraction(planRouteMap, planRouteSource, function (geojson) {
        console.log(geojson)
    });
    changeInteraction("LineString", planRouteSource, function (geojsonStr, geojson) {
        var planRouteInput = $("#planRouteInput").val();
        geojson.set('name', planRouteInput);
        geojson.setStyle(styleFunction(planRouteInput));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(geojson, {featureProjection: "EPSG:3857", decimals: 6});
        //console.log(geojsonStr2);
        $("#planRouteGeojson").val(geojsonStr2);
    })
}

function cancelPlanRoute(){
    if (planRouteAction==='add'){
        var text =  $("#btn_startDrawPlanRoute").text();
        if(text ==="请在地图上绘制..."){
            $("#btn_startDrawPlanRoute").text("开始绘制").removeAttr("disabled");
            changeInteraction();
            removeInteraction();
            loadPlanRoute();
        }
    }else{
        changeInteraction();
        removeInteraction();
        loadPlanRoute();
    }
    showPlanRouteTable();
}

function savePlanRoute() {
    var planRouteInput = $("#planRouteInput").val();
    if (!planRouteInput) {
        layer.alert("请填写完表格!");
        return
    }
    var geoJsonStr = $("#planRouteGeojson").val();
    if(!geoJsonStr){
        layer.alert("请先绘制路线!");
        return
    }
    var url = httpServer+"/map/addPlanRoute";
    var data =  {
        route_id: planRouteInput,
        geometry: $("#planRouteGeojson").val()
    };
    if(planRouteAction==='edit'){
        url = httpServer+"/map/editPlanRoute";
        data['planRouteHistoryName']= $("#planRouteHistoryName").val();
        var feature = planRouteFeature[$("#planRouteHistoryName").val()];
        feature.set('name', planRouteInput);
        feature.setStyle(styleFunction(planRouteInput));
        var writer = new ol.format.GeoJSON();
        var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
        $("#planRouteGeojson").val(geojsonStr2);
        data['geometry']= $("#planRouteGeojson").val();
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
                //$("#btn_startDrawRoadLimit").text("开始绘制").removeAttr("disabled");
                loadPlanRoute();
                showPlanRouteTable();
                layer.alert("保存成功");

            } else {
                layer.alert("添加道路信息失败")
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function addPlanRoute(){
    planRouteAction='add';
    showAddPlanRouteForm()
}

function deletePlanRoute(id) {
    layer.confirm("确定删除限速：" + id + " 吗？", function () {
        $.ajax({
            url: httpServer+"/map/deletePlanRoute",
            type: "post",
            dataType: 'json',
            data: {keys: id},
            success: function (data) {
                if (data.status === "success") {
                    layer.alert("删除成功",function(){
                        layer.closeAll();
                        loadPlanRoute();
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

function editPlanRoute(route_id,btn){
    planRouteAction = 'edit';
    var tds = btn.parent().siblings();
    for(var i= 0,size = tds.length;i<size;i++){
        console.log(tds[i].innerHTML)
    }
    $("#planRouteInput").val($(tds[1]).children("a:first-child").text());
    $("#planRouteHistoryName").val(route_id);

    for(var id in planRouteFeature){
        var feature = planRouteFeature[id];
        if(id!==route_id){
            planRouteSource.removeFeature(feature)
        }else{
            map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
            var writer = new ol.format.GeoJSON();
            var geojsonStr2 = writer.writeFeature(feature, {featureProjection: "EPSG:3857", decimals: 6});
            $("#planRouteGeojson").val(geojsonStr2);
        }
    }
    initInteraction(planRouteMap,planRouteSource,function (geojson) {
        console.log(geojson);
        $("#planRouteGeojson").val(geojson);
    });
    showAddPlanRouteForm();
}

function appendToPlanRouteTable(items) {
    $("#table_planRoute").empty();
    var count = 0;
    items.forEach(function (item) {
        var route_id = item.route_id;
        var geoJson = item.geometry;
        geoJson = geoJson.replace(new RegExp("&quot;", 'g'), "\"");
        if(geoJson.indexOf("geometry")<0){
            return;
        }
        count++;
        //console.log(geoJson);
        var feature = (new ol.format.GeoJSON()).readFeature(geoJson, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857"
        });
        feature.setStyle(styleFunction(feature.get("name")));
        planRouteFeature[route_id] = feature;
        planRouteSource.addFeature(feature);

        $("<tr   item = '" + route_id + "'>" +
            "<td>" + count + "</td>" +
            "<td id='" + route_id + "' onclick='showPlanRoute($(this))'>" +
            "<a href='javascript:void(0)'>" + route_id + "</a></td>" +
            //"<td>" + speed + "</td>" +
            //"<td>" + status + "</td>" +
            "<td>" +
            "  <a  href ='javascript:void(0);' onclick='editPlanRoute(\"" + route_id + "\",$(this))' >编辑</a>" +
            "  <a  href ='javascript:void(0);' onclick='deletePlanRoute(\""+route_id+"\")' style=\"padding-left: 10px;\">删除</a>" +
            "   <a  href ='javascript:void(0);' onclick='getVehicleToRoute(\""+route_id+"\")' style=\"padding-left: 10px;\">车辆管理</a>" +
            //"   <button type='button' class='btn btn-default' onclick='deletePlanRoute(\""+route_id+"\")' >删除</button>" +
            //"   <button type='button' class='btn btn-default' onclick='' >保存</button>" +
            "</td>" +
            "</tr>")
            .appendTo($("#table_planRoute"));
    });
    $("#planRouteTable").bootstrapTable(
        {
            //showExport: true,                     //是否显示导出
            //exportDataType: "all"              //basic', 'all', 'selected'.
            search:false
        }
    );
}



function getVehicleToRoute(route_id){
    $("#route_id").val(route_id);
    $.ajax({
        url: httpServer+"/vehicle/getVehicleToRoute",
        type: "post",
        dataType: 'json',
        data: {route_id: route_id},
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                routeCheckedVehicle = {};
                vehicleToRouteMap = {};
                for(var i= 0,size = items.length;i<size;i++){
                    if(items[i].route_id == route_id){
                        routeCheckedVehicle[items[i].vehicle_number] = true
                    }
                    vehicleToRouteMap[items[i].vehicle_number] = items[i].route_id
                }

                for(var  vehicleNum in routeVehicleNumToTreeIdMap){
                    var node = routeVehicleTree.getNodeByTId(routeVehicleNumToTreeIdMap[vehicleNum]);
                    if(routeCheckedVehicle[vehicleNum]){
                        node.checked = true;
                    }else{
                        node.checked = false;
                    }
                    routeVehicleTree.updateNode(node);
                }
                layerIndex = layer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    title:"请勾选车辆",
                    //area: ['420px','550px'], //宽高
                    content: $("#planRouteTreeDiv")
                });
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function checkParentNode(node){
    var parentNode = node.getParentNode();
    if(!!parentNode){
        parentNode.checked = true;
        routeVehicleTree.updateNode(parentNode);
        checkParentNode(parentNode);
    }
}


function showPlanRoute(tr) {
    //选中行是突出显示颜色
    tr.parent().css("background-color", "#e5e5e5").siblings().css("background-color", "#FFFFFF");
    //var geojsonStr =  tr.attr("item");
    //var feature= (new ol.format.GeoJSON()).readFeature(geojsonStr,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
    //var name = feature.get("name");
    //feature.setStyle(styleFunction(name));
    //feature.setId(name);
    var id = tr.attr("id");
    var feature = planRouteFeature[id];
    if (!!feature) {
        //将第一条线的第一个点作为地图的中心
        map.getView().setCenter(feature.getGeometry().getCoordinates()[0]);
    } else {

    }
    //console.log(feature.get("name"));

    //console.log( feature.getGeometry().getCoordinates()[0][0])

}