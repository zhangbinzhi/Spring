/**
 * Created by binzhi on 2018/9/9. 轨迹js
 */
var map, speed, center, now, trailSource, trailVector, animating = false,
    geoMarker, routeLength, trailPointName, routeCoords, endPoint, startPoint
    , routeFeature, directionArr;
var overlay, container, content, closer;
var trailTimeStampArr = [];
var pointFeatures = [];

var historicalTable;

function initTrail(sourceMap) {
    map = sourceMap;
    trailSource = new ol.source.Vector({wrapX: false});
    trailVector = new ol.layer.Vector({
        source: trailSource,
        projection: "EPSG:3857",
        zIndex:19
    });
    map.addLayer(trailVector);
    enableSelectObject();
}

var selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click
//                condition: ol.events.condition.pointerMove
});

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
        var timeStamp = feature.get("timeStamp");
        if(!timeStamp){
            return false;
        }
        //if (type === "location") {
            showLocation(feature);
        //}
    });
}

function showLocation(feature) {
    var name = feature.get("name");
    var timeStamp = feature.get("timeStamp");
    var speed = feature.get("speed");
    var coordinate = feature.getGeometry().getCoordinates();
    var latlon = ol.proj.toLonLat(coordinate);
    var lon = latlon[1].toFixed(6);
    var lat = latlon[0].toFixed(6);
    var temp  =
        //'<p>定位时间：' + latestTime + "</p>" +
        //"经纬度为：" + lat + "," + lon
        "<p>定位时间：" + timeStamp + "</p>" +
        "<p>经纬度为：" + lat + "," + lon+"</p>"
    ;
    if(!!speed){
        temp+= "<p>速 度 为：" + speed+"</p>"
    }
    content.innerHTML=temp;
    overlay.setPosition(coordinate);
}

function showTrail(items) {
    //items = [{OBJECT_NAME:"TEST",LON:25.273566,LAT: 110.290195}];
    if (items.length < 1) {
        layer.alert("当前时段内无数据！");
        return;
    }
    clearPointFeture();
    var directionArr = [];
    var locationTable = $("#locationTable");
    locationTable.empty();
    var length = items.length - 1;
    var pointArr = [];
    //$("#table_tab").empty();
    //historicalTable.load({data:items});
    //historicalTable.bootstrapTable('load', items);
    document.getElementById("historicalTable").contentWindow.historicalTable.bootstrapTable('load', items);
    var isZeroSpeedBefore = false;
    for (var i = 0; i < items.length; i++) {
        var pointIndex = length - i;
        //$("<tr>"
        //    + "<td width=\"1%\"</td>"
        //    + "<td>" + (i+1) + "</td>"
        //    + "<td><a href='javascript:void(0)' onclick='clickPoint($(this))'><span style='color: #0d8ddb'>" + items[pointIndex].datetime + "</span></a></td>"
        //    + "<td>" + items[pointIndex].lon + "</td>"
        //    + "<td>" + items[pointIndex].lat + "</td>"
        //    + "<td>" + items[pointIndex].speed + "</td>"
        //    + "<td>" + items[pointIndex].warnflag + "</td>"
        //    + "<td>" + items[pointIndex].elevation + "</td>"
        //    + "<td>" + items[pointIndex].direction + "</td>"
        //    + "</tr>").appendTo(locationTable);


        directionArr.push(parseInt(items[pointIndex].direction));
        var coods = ol.proj.fromLonLat([parseFloat(items[pointIndex].lon), parseFloat(items[pointIndex].lat)]);
        pointArr[pointArr.length] = coods;
        var currentPoint = new ol.geom.Point(coods);
        if(items[pointIndex].speed==0){
            if(!isZeroSpeedBefore){
                //多个连续的速度为0的点中，只显示第一个点
                //var feature = new ol.Feature(currentPoint);
                //feature.setStyle(trailStyleFunction);
                //feature.set("timeStamp",items[pointIndex].datetime);
                //pointFeatures.push(feature);
                //trailSource.addFeature(feature);
                createTrailPoint(currentPoint,items[pointIndex])
            }
            isZeroSpeedBefore = true;
        }else{
            isZeroSpeedBefore = false;
            createTrailPoint(currentPoint,items[pointIndex])
        }
        trailTimeStampArr.push(items[pointIndex].datetime);
    }
    if (!endPoint) {
        endPoint =  new ol.Feature(new ol.geom.Point(pointArr[0]));
        trailSource.addFeature(endPoint);
    } else {
        (endPoint.getGeometry()).setCoordinates(pointArr[0]);
    }
    endPoint.set("timeStamp",trailTimeStampArr[0]);
    endPoint.setStyle(endPointStyleFunction);

    if (!startPoint) {
        startPoint =new ol.Feature(new ol.geom.Point(pointArr[pointArr.length - 1]));
        trailSource.addFeature(startPoint);
    } else {
        (startPoint.getGeometry()).setCoordinates(pointArr[pointArr.length - 1]);
    }
    startPoint.set("timeStamp",trailTimeStampArr[trailTimeStampArr.length-1]);
    map.getView().setCenter(pointArr[0]);
    startPoint.setStyle(startPointStyleFunction);

    var route = new ol.geom.LineString(pointArr);
    if (!routeFeature) {
        routeFeature = new ol.Feature({
            geometry: route
        });
        trailSource.addFeature(routeFeature);
    } else {
        routeFeature.setGeometry(route);
    }
    routeFeature.setStyle(trailStyleFunction);

    routeCoords = pointArr;
    routeLength = pointArr.length;
}

function createTrailPoint(currentPoint,item){
    var feature = new ol.Feature(currentPoint);
    feature.setStyle(trailStyleFunction);
    feature.set("timeStamp",item.datetime);
    feature.set("speed",(item.speed/10).toFixed(1) +" km/h");
    pointFeatures.push(feature);
    trailSource.addFeature(feature);
}
function clickPoint(ele){
    var timeStamp = $(ele).text();
    //console.log(timeStamp);
    var tds = $(ele).siblings();
    var lon = tds[0].innerText;
    var lat = tds[1].innerText;
    var speed = tds[2].innerText;
    var cood = ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]);
    content.innerHTML =
        "<p>定位时间：" + timeStamp + "</p>" +
        "<p>经纬度为：" + lat + "," + lon+"</p>" +
        "<p>速 度 为：" + speed+"</p>"
    ;
    overlay.setPosition(cood);
    map.getView().setCenter(cood)
}

$(document).ready(function(){
    initMap('addMessure');
    initTrail(map);
    var vehicleNum = getUrlParam('vehicleNumber');
    var now = new Date();
    $("#endTime").val(getFormatDate(now));
    now.setHours(now.getHours() - 1);
    $("#startTime").val(getFormatDate(now));
    if (!!vehicleNum) {
        $("#vehicle").val(vehicleNum);
    }
    //historicalTable = $('#historicalTable').bootstrapTable({
    //    //method: 'get',
    //    cache: false,
    //    //height: 400,
    //    sortName:"datetime",
    //    striped: true,
    //    pagination: true,
    //    pageSize: 10,
    //    pageNumber:1,
    //    pageList: [10,50,'All'],  sidePagination:'client',
    //    search: false,
    //    showColumns: true,
    //    showRefresh: false,
    //    showExport: true,
    //    exportTypes: ['csv'],
    //    //clickToSelect: true,
    //    onClickCell:function(field,value,row,td){
    //        if(field !=="datetime"){
    //            return
    //        }
    //        clickPoint(td)
    //    },
    //    columns:
    //        [
    //            {field:"datetime",title:"时间",align:"center"},
    //            {field:"lon",title:"维度",align:"center"},
    //            {field:"lat",title:"经度",align:"center"},
    //            {field:"speed",title:"速度",align:"center"},
    //            {field:"warnflag",title:"告警标准",align:"center"},
    //            {field:"elevation",title:"海拔",align:"center"},
    //            {field:"direction",title:"方向",align:"center"},
    //        ]
    //    //data:items,
    //});
});

var layerLoadingIndex;
//画轨迹
function drawTrack() {
    vehicleNum = $("#vehicle").val();
    if (!vehicleNum) {
        layer.alert("请先输入车牌号码！");
        return;
    }
    layerLoadingIndex = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    $.ajax({
        url: httpServer + "/vehicle/queryCarTrack",
        type: "post",
        data: {
            vehicleNumber: $("#vehicle").val(),
            startTime: $("#startTime").val(),
            endTime: $("#endTime").val()
        },
        dataType: "json",
        success: function (data) {
//                    var infoMark = {
//                        vehicleNumber:data.data.vehicleNumber,
//                        terminalId:data.data.terminalId,
//                        groupType:data.data.groupType
//                    };
            if (data.status == "success") {
                showTrail(data.items);
                layer.close(layerLoadingIndex)
            } else {
                layer.close(layerLoadingIndex);
                layer.alert(data.msg);
            }

        }
    });
}

function getFormatDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }

    var mins = date.getMinutes();
    if (mins >= 0 && mins <= 9) {
        mins = "0" + mins;
    }

    var secs = date.getSeconds();
    if (secs >= 0 && secs <= 9) {
        secs = "0" + secs;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + mins
        + seperator2 + secs;
    //return currentdate;
}

function startAnimation() {
    if (!routeCoords || routeCoords.length < 1) {
        alert("请先加载历史轨迹信息！");
        return;
    }
    var speedInput = document.getElementById('speed');
    now = new Date().getTime();
    speed = speedInput.value;
    //speed = routeLength / 4;
    center = routeCoords[0];
    map.getView().setCenter(center);
    //map.getView().setZoom(13);
    if (!geoMarker) {
        geoMarker = new ol.Feature({
            geometry: new ol.geom.Point(center)
        });
        //geoMarker.setStyle(locationStyleFunction("TEST", 60, "装载车"));
        trailSource.addFeature(geoMarker);
    }
    if (animating) {
        stopAnimation(false);
        $("#start-animation").text("播放")
    } else {
        animating = true;
        $("#start-animation").text("停止");
        now = new Date().getTime();
        //clearPointFeture();
        // hide geoMarker
        if (geoMarker) {
            geoMarker.setStyle(null);
        }

        // just in case you pan somewhere else
        //map.getView().setCenter(center);
        map.on('postcompose', moveFeature);
        map.render();
    }
}

function back() {
    if (confirm("确定返回列表页吗？")) {
        history.go(-1);
    }
}
function stopAnimation(ended) {
    animating = false;
    // if animation cancelled set the marker at the beginning
    var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
    /** @type {ol.geom.Point} */
    (geoMarker.getGeometry()).setCoordinates(coord);
    //geoMarker.setStyle(locationStyleFunction("TEST", 60, "装载车"));
    //remove listener
    map.un('postcompose', moveFeature);
    if (ended) {
        if (!!endPoint) {
            //endPoint.setStyle(null);
        }
        $("#start-animation").text("播放");
        alert("轨迹播放结束");
    }
}

var moveFeature = function (event) {
    //var vectorContext = event.vectorContext;
    var frameState = event.frameState;

    if (animating) {
        var elapsedTime = frameState.time - now;
        // here the trick to increase speed is to jump some indexes
        // on lineString coordinates
        var index = Math.round(speed * elapsedTime / 1000);

        if (index >= routeLength) {
            stopAnimation(true);
            return;
        }
        //倒序播放
        var pointIndex = routeLength - index - 1;
        //var pointIndex =  index ;
        (geoMarker.getGeometry()).setCoordinates(routeCoords[pointIndex]);
        if (!!directionArr) {
            geoMarker.setStyle(locationStyleFunction("车辆信息", directionArr[pointIndex], "装载车"));
        }
        //vectorContext.drawFeature(feature, LineStyles.geoMarker);
    }
    // tell OpenLayers to continue the postcompose animation
    map.render();
};
function clearPointFeture(){
    for(var i= 0,size = pointFeatures.length;i<size;i++){
        trailSource.removeFeature(pointFeatures[i])
    }
    pointFeatures =[];
}
function trailStyleFunction() {
    return [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: '#3399CC',
                width: 6
            })
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 4,
                fill: new ol.style.Fill({
                    color: '#EEEE00'
                })
            })
        })
    ];
}

function endPointStyleFunction() {
    return [
        new ol.style.Style({
            image: new ol.style.Icon({
                //anchor: [0.5, 0.5],
                src: './images/navi_end.png'
            })
        })
    ]
}

function startPointStyleFunction() {
    return [
        new ol.style.Style({
            image: new ol.style.Icon({
                //anchor: [0.5, 0.5],
                src: './images/navi_start.png'
            })
        })
    ]
}

function locationStyleFunction(name, direction, vehicle_purpose) {
    var src = './images/green_arrow.png';
    var color = "green";
    if (!!vehicle_purpose) {
        switch (vehicle_purpose) {
            case "装载车":
                src = './images/blue_arrow.png';
                color = "blue";
                break;
            case "清场车":
                src = './images/red_arrow.png';
                color = "red";
                break;
            case "转场车":
                src = './images/green_arrow.png';
                color = "green";
                break;
            default:
                break
        }
    }
    return [
        new ol.style.Style({
            //fill: new ol.style.Fill({
            //    color: 'rgba(255,255,255,0.4)'
            //}),
            //stroke: new ol.style.Stroke({
            //    color: '#3399CC',
            //    width: 2
            //}),
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

function styleFunction(name) {
    return [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.4)'
            }),
            stroke: new ol.style.Stroke({
                color: '#3399CC',
                width: 2
            }),
            text: new ol.style.Text({
                font: '24px Calibri,sans-serif',
                fill: new ol.style.Fill({color: 'red'}),
                //stroke: new ol.style.Stroke({
                //    color: "yellow", width: 2
                //}),
                // get the text from the feature - `this` is ol.Feature
                // and show only under certain resolution
                text: name === null ? "UNKNOWN_NAME" : name
            })
        }),
        //在线的焦点处增加一个橙色圆点
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: 'orange'
                })
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                var coordinates = feature.getGeometry().getCoordinates()[0];
                return new ol.geom.MultiPoint(coordinates);
            }
        })
    ];
}