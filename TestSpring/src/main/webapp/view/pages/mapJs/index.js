/**
 * Created by binzhi on 2018/9/7.
 */
var locationSource, overlay, container, content, closer;

var markerArray = {};
var selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click
//                condition: ol.events.condition.pointerMove
});

var vehicleTree;
var vehicleNumToTreeIdMap = {};
var checkedVehicle = {};
var pageSize = parseInt(20);

function treeOnCheck(e, treeId, treeNode) {
    //TODO 后续需要优化，勾选项变化时无需全部刷新
    //if(treeNode.isParent){
    //    if (treeNode.checked) {
    //
    //    }else{
    //
    //    }
    //}else{
    //    var vehicle_number = treeNode.id;
    //    if (treeNode.checked) {
    //        getVehicleByNumbers(vehicle_number);
    //    } else {
    //        var feature = markerArray[vehicle_number];
    //        if (!!feature) {
    //            feature.setGeometry(null);
    //            delete markerArray[vehicle_number];
    //        }
    //    }
    //}
    var nodes = vehicleTree.getCheckedNodes(true);
    if (!!nodes) {
        checkedVehicle = {};
        for (var i = 0, size = nodes.length; i < size; i++) {
            var id = nodes[i].id;
            checkedVehicle[id] = true;
        }
        saveCheckedVehicle();
        if (treeNode.checked) {
            queryCar();
        } else {
            for (var number in markerArray) {
                if (!checkedVehicle[number]) {
                    var feature = markerArray[number];
                    if (!!feature) {
                        feature.setGeometry(null);
                    }
                }
            }
        }
    }
}

function treeOnclick(e, treeId, treeNode) {
    if (!treeNode.isParent) {
        var vehicle_number = treeNode.id;
        //console.log(vehicle_number);
        if (!!markerArray[vehicle_number]) {
            var feature = markerArray[vehicle_number];
            var coor = feature.getGeometry().getCoordinates();
            map.getView().setCenter(coor);
            showLocation(feature);
        } else {
            layer.alert("无当前车辆的位置信息！");
        }
    }
}

var setting = {
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
        onClick: treeOnclick
    }
};


$(function () {
    initMap('addMessure');
    addImage();
//            var  featuresList=[];
//            var num = 0;
    setInterval(function () {
        //if(num == 0) clearInterval(intTime);
        //carType = carType.substring(0,carType.lastIndexOf(','));
        queryCar();
    }, 10000);

    $(".tab-tit").on("click", "li", function () {
        //console.info("触发");
        var index = $(this).index();
        var tabId = "#Tab" + index;
        var pageIndex = parseInt($("#pageIndex" + index).val());
        var url = httpServer;
        if (index == 0) {
            url += "/getOffLineVehicle";
            pageSize = 999
        } else {
            url += "/getWarnVehicle";
            pageSize = 20
        }
        //每个Tab点击后加载数据
        $.ajax({
            url: url,
            type: "POST",
            data: {
                "pageIndex": pageIndex,
                "pageSize": pageSize,
                "warn_type": index
            },
            dataType: "json",
            success: function (data) {
                if (data.status == "success") {
                    formatData(index, tabId, data, pageIndex);
                    loadListTeam();
                }
            }
        });
    });

    $(".y-page").on("click", "a", function () {
        if ($(this).hasClass("gray")) {
            return;
        }
        var a_index = $(this).index();
        var parentDiv = $(this).parent().parent();
        var tabId = "#" + parentDiv.attr("id");
        var index = parentDiv.index();
        var pageIndex = parseInt($("#pageIndex" + index).val());
        var url = httpServer;
        if (index == 0) {
            url += "/getOffLineVehicle";
            pageSize = 999
        } else {
            url += "/getWarnVehicle";
            pageSize = 20
        }
        if (a_index == 0) {
            pageIndex = parseInt(1);
        } else if (a_index == 1) {
            pageIndex = pageIndex - parseInt(1);
        } else if (a_index == 3) {
            pageIndex = pageIndex + parseInt(1);
        }
        //每个Tab点击后加载数据
        $.ajax({
            url: url,
            type: "POST",
            data: {
                "pageIndex": pageIndex,
                "pageSize": pageSize,
                "warn_type": index
            },
            dataType: "json",
            success: function (data) {
                if (data.status == "success") {
                    formatData(index, tabId, data, pageIndex);
                    loadListTeam();
                }
            }
        });
    });

    $(".tab-content table tbody").on("mouseover", "tr", function () {
        $(this).addClass("bg-yellow");
    });
    $(".tab-content table tbody").on("mouseout", "tr", function () {
        $(this).removeClass("bg-yellow");
    });

    $(".tab-tit li").eq(0).click();
    $(".tab-tit li a").eq(0).click();
    queryCar();
//            //加载电子围栏到地图
    enableSelectObject();
    //30s刷新一次
    setInterval(function () {
        loadListTeam();
        loadTableData();
    }, 30000);

    $(".MeasureTool ul li").css("display", "none");
});

$(document).ready(function () {
    //$.fn.zTree.init($("#treeDemo"), setting, zNodes);
    loadVecicleFromLocal();
    $("#reflashVehicle").click(function () {
        reflashVehicle();
    });
    $("#reflashOnline").click(function () {
        reflaseVehicleStatus();
    });
    $("#map-table").bg_move({});
    reflaseVehicleStatus();
    setInterval(reflaseVehicleStatus, 15000);
    $("#cleanSearchArea").click(function () {
        $("#searchArea").val("");
    });

    $("#searchVehicle").click(function () {
        searchVehicle();
    });
});

function searchVehicle() {
    var vehicle_number = $("#searchArea").val();
    if (!vehicle_number) {
        layer.alert("请先输入车牌号！");
        return;
    }
    if (!checkedVehicle[vehicle_number]) {
        layer.alert("您所输入的车牌未找到！");
        return;
    }
    if (!markerArray[vehicle_number]) {
        layer.alert("当前车牌号对应车辆已离线！");
    } else {
        var feature = markerArray[vehicle_number];
        var coor = feature.getGeometry().getCoordinates();
        map.getView().setCenter(coor);
        showLocation(feature)
    }
}


function loadVecicleFromLocal() {
    if (window.localStorage) {
        if (!!localStorage.lealone_checkedVehicle) {
            console.log('loading lealone_checkedVehicle from localStorage');
            try {
                checkedVehicle = JSON.parse(localStorage.lealone_checkedVehicle);
            } catch (e) {
                console.log('failed to parse local checkedVehicle!', e);
                checkedVehicle = {}
            }
        }
        if (!localStorage.lealone_harbor) {
            console.log('getting vehicle from server');
            reflashVehicle();
        } else {
            console.log('loading vehicle from localStorage');
            try {
                var vehicles = JSON.parse(localStorage.lealone_harbor);
                for (var i = 0, size = vehicles.length; i < size; i++) {
                    if (checkedVehicle[vehicles[i].id]) {
                        vehicles[i].checked = true;
                    }
                }
                vehicleTree = $.fn.zTree.init($("#treeDemo"), setting, vehicles);
                initVechicleNumToTreeIdMap();
            } catch (e) {
                console.log('failed to parse local record!', e);
                reflashVehicle();
            }
        }

    } else {
        alert('您的浏览器过于陈旧，部分功能可能无法正常使用！');
    }
}

function saveCheckedVehicle() {
    localStorage.lealone_checkedVehicle = JSON.stringify(checkedVehicle);
    console.log("lealone_checkedVehicle is saved")
}


function reflaseVehicleStatus() {
    if (!vehicleTree) {
        //alert("请先初始化车辆信息");
        console.log("vehicleTree is not ready yet");
        return
    }
    $.ajax({
        url: httpServer + "/loadVehicleStatus",
        type: "post",
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                var onlineVehicMap = {};
                var offLineVehilceNums = {};
                for (var i = 0, size = items.length; i < size; i++) {
                    var vehicle = items[i];
                    //console.log(vehicle.status);
                    onlineVehicMap[vehicle.vehicle_number] = true;
                    var node = vehicleTree.getNodeByTId(vehicleNumToTreeIdMap[vehicle.vehicle_number]);
                    if (!node) {
                        console.log(vehicle.vehicle_number + " not found");
                        continue;
                    }
                    if (!!vehicle.status) {
                        node.icon = ""
                    } else {
                        node.icon = "images/bootstrap-red.png";
                        if (!markerArray[vehicle.vehicle_number]) {
                            offLineVehilceNums[vehicle.vehicle_number] = true;
                        }
                    }
                    vehicleTree.updateNode(node)
                }
                for (var number in vehicleNumToTreeIdMap) {
                    if (!onlineVehicMap[number]) {
                        var node = vehicleTree.getNodeByTId(vehicleNumToTreeIdMap[number]);
                        if (!node) {
                            console.log(vehicle.vehicle_number + " not found");
                            continue;
                        }
                        if (!node.isParent) {
                            node.icon = "images/bootstrap-red.png";
                            vehicleTree.updateNode(node);
                            if (!markerArray[number]) {
                                offLineVehilceNums[number] = true;
                            }
                        }
                    }
                }
            }
        }
    });
}

function nodeIteration(node) {
    //console.log("222");
    vehicleNumToTreeIdMap[node.id] = node.tId;
    if (node.isParent) {
        var children = node.children;
        for (var i = 0, size = children.length; i < size; i++) {
            nodeIteration(children[i]);
        }
    }
}

function initVechicleNumToTreeIdMap() {
    var nodes = vehicleTree.getNodes();
    for (var i = 0, size = nodes.length; i < size; i++) {
        //console.log("111")
        nodeIteration(nodes[i]);
        //console.log("333")
    }
}


function reflashVehicle() {
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
                    if (checkedVehicle[zNodes[i].id]) {
                        zNodes[i].checked = true;
                    }
                }
                localStorage.lealone_harbor = JSON.stringify(zNodes);
                vehicleTree = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                initVechicleNumToTreeIdMap();
                reflaseVehicleStatus();
                for (var temp in markerArray) {
                    var feature = markerArray[temp];
                    //feature.setGeometry(null);
                    locationSource.removeFeature(feature);
                    delete markerArray[temp];
                    console.log("delete " + temp);
                }
                queryCar();
            }
        }
    });
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

function formatData(index, tabId, data, pageIndex) {
    $(tabId + " table tbody").empty();
    var arr = data.items;
    var page_a = $(tabId + " .y-page a");
    page_a.each(function () {
        $(this).removeClass("gray");
    });
    var startNum = (pageIndex - 1) * pageSize + parseInt(1);
    if (arr.length < pageSize) {
        page_a.eq(2).addClass("gray");
    }
    if (pageIndex == 1) {
        page_a.eq(0).addClass("gray");
        page_a.eq(1).addClass("gray");
    }
    var htmlStr = "";
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        var rowNum = startNum + parseInt(i);
        if (index == 0) {
            htmlStr += "<tr>"
                + "<td></td>"
                + "<td>" + rowNum + "</td>"
                + "<td>" + obj.latestTime + "</td>"
                + "<td>" + obj.vehicle_number + "</td>"
                + "<td>" + obj.group_type + "</td>"
                + "<td>" + obj.terminal_Sn + "</td>"
                + "<td>" + obj.lon + "</td>"
                + "<td>" + obj.lat + "</td>"
                + "<td>" + obj.speed + "</td>"
                + "<td>" + obj.department + "</td>"
                + "</tr>";
        } else {
            htmlStr += "<tr>"
                + "<td></td>"
                + "<td>" + rowNum + "</td>"
                + "<td>" + obj.warn_time + "</td>"
                + "<td>" + obj.vehicle_number + "</td>"
                    //+ "<td>" + obj.group_type + "</td>"
                    //+ "<td>" + obj.terminal_Sn + "</td>"
                + "<td>" + obj.content + "</td>"
                + "<td>" + obj.warn_level + "</td>"
                + "</tr>";
        }
    }
    $(tabId + " table tbody").append(htmlStr);
    //console.info("arr.length=="+arr.length+"; pageSize=="+pageSize+"; pageIndex=="+pageIndex+"; tabId=="+tabId+"; htmlStr=="+htmlStr);
    $("#pageIndex" + index).val(pageIndex);
}

function loadListTeam() {
    $.ajax({
        url: httpServer + "/loadOnlineInfo",
        type: "POST",
        dataType: "json",
        success: function (data) {
            //console.info("刷新loadListTeam");
            //if(data.staus=="success"){
            $(".span_total").html(data.total);
            $(".span_onLine").html(data.onLine);
            $(".span_offLine").html(data.offLine);
            $(".span_rate").html(changeToPercent((1 - data.rate)));
            //}
        }
    });
}

function loadTableData() {
    var liNum = $(".tab-tit > .active").index();
    //console.info("liNum="+liNum);
    //$(".tab-tit li").eq(liNum).click();
    $("#pageIndex" + liNum).val(1);
    $(".tab-tit li a").eq(liNum).click();
}

function changeToPercent(num) {
    if (!/\d+\.?\d+/.test(num)) {
        //alert("必须为数字");
    }
    var result = (num * 100).toString(),
        index = result.indexOf(".");
    if (index == -1 || result.substr(index + 1).length <= 2) {
        return result + "%";
    }
    return result.substr(0, index + 3) + "%";
}

//增加车辆显示的图层
function addImage() {
    locationSource = new ol.source.Vector({wrapX: false});
    markerlayer = new ol.layer.Vector({
        source: locationSource,
        projection: "EPSG:3857",
        zIndex: 20
    });
    map.addLayer(markerlayer);
    //addCar();
}

function addCar() {
    //在中心点处添加一个图片标注
    var point = new ol.geom.Point(ol.proj.fromLonLat([108.34272, 21.60684]));
    var feature = new ol.Feature({
        geometry: point
    });
    feature.set('name', "桂A 11100（斗）");
    feature.set('department', "部门");
    feature.setId("defaultId");
    feature.set('latestTime', "2018/09/06 14:30:15");
    feature.set('type', 'location');
    setVehicleStyle(feature, "桂A 11100（斗）", 198);
    locationSource.addFeature(feature);
    setTimeout(function () {
        setVehicleOffLine(feature)
    }, 5000);
//            console.log(feature.get("name"));
}

//用于点击物品时显示物品信息
function enableSelectObject() {
    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: false,
        autoPanAnimation: {
            duration: 250
        }
    }));

    map.addOverlay(overlay);

    map.addInteraction(selectClick);
    selectClick.on('select', function (e) {
        var features = e.target.getFeatures();
        //console.log(features);
        if (features.getLength() < 1) {
            return
        }
        var feature = features.pop();
        var type = feature.get("type");
        if (type === "location") {
            showLocation(feature);
        }
    });
}

function showLocation(feature) {
    var name = feature.get("name");
    var url = encodeURI("historicalTrack.html?vehicleNumber=" + name);
    var latestTime = feature.get("latestTime");
    var department = feature.get("department");
    var status = feature.get("status");
    if ("在线" !== status) {
        status = "<span style='color: red'>" + status + "</span>"
    }
    var coordinate = feature.getGeometry().getCoordinates();
    var latlon = ol.proj.toLonLat(coordinate);
    var lon = latlon[1].toFixed(6);
    var lat = latlon[0].toFixed(6);
    content.innerHTML =
        '<p>车牌号：' + name + '</p>' +
        '<p>所属部门：' + department + '</p>' +
        '<p>状态：' + status + '</p>' +
        '<p>最近定位时间：' + latestTime + "</p>" +
        "经纬度为：" + lat + "," + lon
//                    +  '<div class="form-group">'
//                    + '<label for="otherDate">轨迹日期：</label>'
//                    +'<input type="email" class="form-control" id="otherDate" placeholder="请选择日期" onclick="laydate()">'
//                    +'</div>'
        + '<button type="button" class="btn btn-default" onclick="openTrail(\'' + url + '\')">轨迹回放</button>'
    ;
    overlay.setPosition(coordinate);
}
function openTrail(url) {
    window.open(url);
}


/*图层选择*/
$(".selectLayer input").on('click', function () {
    var _this = $(this),
        flag = _this.is(':checked');
    selectLayer(_this);
});

/*测距*/
$('.ranging').on('click', function (e) {
    e.preventDefault();
});

/*测面*/
$('.measurement').on('click', function (e) {
    e.preventDefault();
});
//改变表格高度
$(document).ready(function () {
    $("#map-table").bg_move({});
    queryCar();
});

function queryCar() {
    var numbers = "";
    for (var number in checkedVehicle) {
        numbers += (number + ",")
    }
    if (numbers.length > 3) {
        numbers = numbers.substring(0, numbers.length - 1);
    } else {
        return
    }
    getVehicleByNumbers(numbers);
}

function getVehicleByNumbers(numbers) {
    $.ajax({
        url: httpServer + "/getRealTimeVehicle",
        type: "post",
        data: {numbers: numbers},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                var items = data.items;
                for (var i = 0, size = items.length; i < size; i++) {
                    var vehicle = items[i];
                    var direction = vehicle['direction'];
                    var vehicle_number = vehicle['vehicle_number'];
                    var feature = markerArray[vehicle_number];
                    if (!feature) {
                        //如果车辆不存在，则绘制
                        feature = createFeature(vehicle);
                        markerArray[vehicle_number] = feature;
                        locationSource.addFeature(feature);
                        console.log("new feature add : " + vehicle_number)
                    } else {
                        //如果车辆存在，则调整车辆位置
                        feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([vehicle.lon, vehicle.lat])));
                        feature.set("latestTime", vehicle.latestTime);
                        console.log("old feature move")
                    }
                    setVehicleStyle(feature, vehicle);
                }
            }
        }
    });
}

function createFeature(vehicle) {
    var point = new ol.geom.Point(ol.proj.fromLonLat([vehicle.lon, vehicle.lat]));
    var feature = new ol.Feature({
        geometry: point
    });
    feature.set('name', vehicle.vehicle_number);
    feature.set('department', vehicle.department);
    feature.setId(vehicle.vehicle_number);
    feature.set('latestTime', vehicle.latestTime);
    feature.set('type', 'location');
    //feature.setStyle(vehicleStyle());
    return feature;
}


function offLineVehicleStyle(name, direction, vehicle_purpose) {
    var src = './images/green_arrow.png';
    if (!!vehicle_purpose) {
        switch (vehicle_purpose) {
            case "装车用":
                src = './images/red_arrow.png';
                break;
            case "转栈用":
                src = './images/blue_arrow.png';
                break;
            case "清仓用":
                src = './images/green_arrow.png';
                break;
            default:
                break
        }
    }
    return [
        new ol.style.Style({
            text: new ol.style.Text({
                font: '16px Calibri,sans-serif',
                fill: new ol.style.Fill({color: 'grey'}),
                offsetY: -25,
//                        rotation:Math.PI,
                text: name
            })
        }),
        new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                rotation: (direction / 180) * Math.PI,
//                        src: '../js/map/ol/img/car.png'
                src: src
            })
        })
    ];
}

function setVehicleOffLine(feature) {
    feature.set("status", "离线");
    feature.setStyle(offLineVehicleStyle(feature.get("name"), feature.get("direction"), feature.get("vehicle_purpose")))
}


function setVehicleStyle(vehicleFeature, vehicle) {
    vehicleFeature.set("name", vehicle.vehicle_number);
    vehicleFeature.set("direction", vehicle.direction);
    vehicleFeature.set("vehicle_purpose", vehicle.vehicle_purpose);
    if (vehicle.isOnLine) {
        vehicleFeature.set("status", "在线");
        vehicleFeature.setStyle(vehicleStyle(vehicle.vehicle_number, vehicle.direction, vehicle.vehicle_purpose));
    } else {
        vehicleFeature.set("status", "离线");
        vehicleFeature.setStyle(offLineVehicleStyle(vehicle.vehicle_number, vehicle.direction, vehicle.vehicle_purpose));
    }

}

function vehicleStyle(name, direction, vehicle_purpose) {
    var src = './images/green_arrow.png';
    var color = "green";
    if (!!vehicle_purpose) {
        switch (vehicle_purpose) {
            case "装车用":
                src = './images/red_arrow.png';
                color = "red";
                break;
            case "转栈用":
                src = './images/blue_arrow.png';
                color = "blue";
                break;
            case "清仓用":
                src = './images/green_arrow.png';
                color = "green";
                break;
            default:
                break
        }
    }
    return [
        new ol.style.Style({
            text: new ol.style.Text({
                font: '16px Calibri,sans-serif',
                fill: new ol.style.Fill({color: color}),
                offsetY: -25,
//                        rotation:Math.PI,
                text: name
            })
        }),
        new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                rotation: (direction / 180) * Math.PI,
//                        src: '../js/map/ol/img/car.png'
                src: src
            })
        })
    ];
}
