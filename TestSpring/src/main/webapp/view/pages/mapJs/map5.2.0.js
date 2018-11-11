var map,
    fenceSource,
    //markerlayer,
    carType = "";

var 境界_layer;
var 道路_layer;
var 堆场_layer;
var 货堆_layer;
var 铁路_layer;
var 其他_s_layer;
var 其他_l_layer;
var fenceLayer;

var measureControls;

function initMap(addMessure) {
    var center = ol.proj.fromLonLat([108.34272, 21.60684]);
    //地图服务器配置，若本地未搭建地图环境，可以请求服务器上的
    //调用天地图接口
    //地图层
    var TDTMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        }),
        zIndex:1
    });

    //地名层
    //var TDTNameLayer = new ol.layer.Tile({
    //    source: new ol.source.XYZ({
    //        url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
    //    })
    //});




    var extendControl = [];
    if (!!addMessure) {
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(6),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });
        extendControl.push(mousePositionControl)
    }


    map = new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }).extend(extendControl),
        layers: [
//            mapLayer  ,  //若本地为搭建起地图服务器，将这行注释掉时可以直接查看覆盖图层（但无地图作为背景）
            TDTMapLayer,
//            TDTGisLayer,
//            TDTNameLayer
            //调用瓦片地图(注意，瓦片地图使用的坐标方式为经纬度，与其他坐标方式不同)
//            createTileLayer()
        ],
        target: "map",
        logo: false,
        view: new ol.View({
            projection: "EPSG:3857",
            center: center,
            zoom: 15,
            maxZoom: 18,
            minZoom: 13
        })
    });
    initWMSLayers();
    map.addLayer(境界_layer);
    map.addLayer(道路_layer);
    fenceSource = new ol.source.Vector({wrapX: false});
    fenceLayer = new ol.layer.Vector({
        source: fenceSource,
        zIndex:9,
        projection: "EPSG:3857"
    });
    loadFence();
    //map.addLayer(fenceLayer);
    //if(false){
    //    //是否显示堆场等信息
    //    map.addLayer(堆场_layer);
    //    map.addLayer(货堆_layer);
    //    map.addLayer(其他_s_layer);
    //    map.addLayer(其他_l_layer);
    //}

    //map.removeLayer(堆场_layer);
    if (!!addMessure) {
        addmeaurelayer(map);
    }
    //map.addLayers([vectors]);
    //map.addControl(new OpenLayers.Control.MousePosition());
    $(".MeasureTool").css("display", "none");
}
function addmeaurelayer(map) {
    measureControls = new ol.control.MeasureTool({
        sphereradius: 6378137,//sphereradius
        panel: "#measureTool"
    });
    map.addControl(measureControls);

}
function initWMSLayers() {
    境界_layer =
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: geoserverAddress + "geoserver/mrxc/wms",
                params: {'LAYERS': 'mrxc:境界'},
                serverType: 'geoserver',
                //crossOrigin: 'anonymous'
            })
            ,zIndex:2
        });

    道路_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: geoserverAddress + "geoserver/mrxc/wms",
            params: {'LAYERS': 'mrxc:道路'},
            serverType: 'geoserver',
            //crossOrigin: 'anonymous'
        })
        ,zIndex:3
    });
    堆场_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: geoserverAddress + "geoserver/mrxc/wms",
            params: {'LAYERS': 'mrxc:堆场'},
            serverType: 'geoserver',
            //crossOrigin: 'anonymous'
        })
        ,zIndex:4
    });

    货堆_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: geoserverAddress + "geoserver/mrxc/wms",
            params: {'LAYERS': 'mrxc:货堆'},
            serverType: 'geoserver',
            //crossOrigin: 'anonymous'
        })
        ,zIndex:5
    });

    铁路_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: geoserverAddress + "geoserver/mrxc/wms",
            params: {'LAYERS': 'mrxc:铁路'},
            serverType: 'geoserver',
            //crossOrigin: 'anonymous'
        })
        ,zIndex:6
    });
    其他_l_layer =
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: geoserverAddress + "geoserver/mrxc/wms",
                params: {'LAYERS': 'mrxc:其他_1'},
                serverType: 'geoserver',
                //crossOrigin: 'anonymous'
            })
            , zIndex:7
        });
    其他_s_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: geoserverAddress + "geoserver/mrxc/wms",
            params: {'LAYERS': 'mrxc:其他_s'},
            serverType: 'geoserver',
            //crossOrigin: 'anonymous'
        })
        ,zIndex:8
    });
}

//增加电子围栏展示
function loadFence() {
    $.ajax({
        url: httpServer +"/map/loadFence",
        type: "GET",
        data: "",
        dataType: "json",
        success: function (data) {
            var fenceList = data.items;
            if (fenceList != null) {
                for (var i = 0; i < fenceList.length; i++) {
                    var geometryData = fenceList[i].geometry;
                    //var geojson_format = new OpenLayers.Format.GeoJSON();
                    var feature= (new ol.format.GeoJSON()).readFeature(geometryData,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"});
                    //vectors.addFeatures(geojson_format.read(geometryData));
                    var name = feature.get("name");
                    feature.setStyle(fenceStyle(name));
                    fenceSource.addFeature(feature);
                }
                //vectors.setVisibility(false);
            }
        }
    });
}

function fenceStyle(name) {
    return [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.0)'
            }),
            stroke: new ol.style.Stroke({
                color: '#FF0000',
                lineDash: [10, 10],
                width: 2
            }),
            text: new ol.style.Text({
                font: '24px Calibri,sans-serif',
                fill: new ol.style.Fill({color: 'blue'}),
                //stroke: new ol.style.Stroke({
                //    color: "yellow", width: 2
                //}),
                // get the text from the feature - `this` is ol.Feature
                // and show only under certain resolution
                text: name === null ? "" : name
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

function selectLayer(btn) {
    var flag = btn.is(':checked');
    switch (btn.val()) {
        case "1":
        {
            //if (vectors.map == null) {
            //    map.addLayer(vectors);
            //}
            if (flag) {
                //vectors.setVisibility(true);
                map.addLayer(fenceLayer);

            } else {
                //vectors.setVisibility(false);
                map.removeLayer(fenceLayer);
            }
        }
            break;
        case "2":
        {
            if (flag) {
                map.addLayer(其他_s_layer);
                map.addLayer(其他_l_layer);
                //其他_s_layer.setVisibility(true);
                //其他_l_layer.setVisibility(true);
            } else {
                //其他_s_layer.setVisibility(false);
                //其他_l_layer.setVisibility(false);
                map.removeLayer(其他_s_layer);
                map.removeLayer(其他_l_layer);
            }
        }
            break;
        case "3":
        {
            if (flag) {
                map.addLayer(铁路_layer);
                //if (铁路_layer.map == null) {
                //    map.addLayer(铁路_layer);
                //}
                //铁路_layer.setVisibility(true);
            } else {
                //铁路_layer.setVisibility(false);
                map.removeLayer(铁路_layer);
            }
        }
            break;
        case "4":
        {
            if (flag) {
                //货堆_layer.setVisibility(true);
                map.addLayer(货堆_layer);

            } else {
                //货堆_layer.setVisibility(false);
                map.removeLayer(货堆_layer);
            }
        }
            break;
        case "5":
        {
            if (flag) {
                //堆场_layer.setVisibility(true);
                map.addLayer(堆场_layer);
            } else {
                //堆场_layer.setVisibility(false);
                map.removeLayer(堆场_layer);
            }
        }
            break;
        case "6":
        {
            if (flag) {
                map.addLayer(境界_layer);
                map.addLayer(道路_layer);
                //境界_layer.setVisibility(true);
                //道路_layer.setVisibility(true);

            } else {
                //境界_layer.setVisibility(false);
                //道路_layer.setVisibility(false);
                map.removeLayer(境界_layer);
                map.removeLayer(道路_layer);
            }
        }
            break;
    }
}


function toggleControl(element) {
    //alert("Hello");
    var typeSelect = {};
    var text = $(element).text();
    if ("测距" === text) {
        typeSelect.value = "length";
        typeSelect.check = false;
    } else {
        typeSelect.value = "area";
        typeSelect.check = false;
    }
    measureControls.mapmeasure(typeSelect);
}
