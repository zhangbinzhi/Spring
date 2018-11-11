/**
 * Created by binzhi on 2018/9/8.
 */
var interactionMap, interactionSource, interactionVector, modify;
var interactionCallback;
//function initInteraction(sourceMap, cb) {
//    interactionMap = sourceMap;
//    interactionCallback = cb;
//    if(!!interactionMap){
//        interactionSource = new ol.source.Vector();
//        interactionVector = new ol.layer.Vector({
//            source: interactionSource,
//            style: new ol.style.Style({
//                fill: new ol.style.Fill({
//                    color: 'rgba(255, 255, 255, 0.2)'
//                }),
//                stroke: new ol.style.Stroke({
//                    color: '#ffcc33',
//                    width: 2
//                }),
//                image: new ol.style.Circle({
//                    radius: 7,
//                    fill: new ol.style.Fill({
//                        color: '#ffcc33'
//                    })
//                })
//            })
//        });
//
//        interactionMap.addLayer(interactionVector);
//        modify = new ol.interaction.Modify({source: interactionSource});
//        modify.on('modifyend', function (e) {
//            var currentFeature = e.features.getArray()[0];
//            var writer = new ol.format.GeoJSON();
//            var geojsonStr = writer.writeFeature(currentFeature, {featureProjection: "EPSG:3857", decimals: 6});
//            //console.log(geojsonStr);
//            if(!!interactionCallback){
//                interactionCallback(geojsonStr);
//            }
//        });
//        interactionMap.addInteraction(modify);
//    }
//}

function initInteraction(sourceMap, source, cb) {
    if(!!interactionVector){
        interactionMap.removeLayer(interactionVector)
    }
    interactionMap = sourceMap;
    interactionCallback = cb;

    interactionSource = source;
    interactionVector = new ol.layer.Vector({
        source: interactionSource,
        zIndex:22,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    interactionMap.addLayer(interactionVector);
    modify = new ol.interaction.Modify({source: interactionSource});
    modify.on('modifyend', function (e) {
        var currentFeature = e.features.getArray()[0];
        var writer = new ol.format.GeoJSON();
        var geojsonStr = writer.writeFeature(currentFeature, {featureProjection: "EPSG:3857", decimals: 6});
        //console.log(geojsonStr);
        if (!!interactionCallback) {
            interactionCallback(geojsonStr,currentFeature);
        }
    });
    interactionMap.addInteraction(modify);
}

var interactionDraw, interactionSnap;

function addInteractions(value, source, cb) {
    interactionCallback = cb;
    //value 的选项 Point LineString Polygon，Circle
    interactionDraw = new ol.interaction.Draw({
        source: source,
        type: value
    });
    interactionMap.addInteraction(interactionDraw);
    interactionDraw.on('drawend', function (e) {
        var currentFeature = e.feature;//this is the feature fired the event
        var name = currentFeature.get("name");
        var _name;
        if (!name) {
            _name = "未命名";
        } else {
            _name = name;
        }
        currentFeature.set('name', _name);
        currentFeature.setStyle(styleFunction(_name));
        var writer = new ol.format.GeoJSON();
        var geojson = writer.writeFeature(currentFeature, {featureProjection: "EPSG:3857", decimals: 6});
        interactionMap.removeInteraction(interactionDraw);
        //console.log(ploygonGeoJson);
        if (!!interactionCallback) {
            interactionCallback(geojson,currentFeature);
        }

    });
    interactionSnap = new ol.interaction.Snap({source: source});
    interactionMap.addInteraction(interactionSnap);
}

function removeInteraction(){
    if(!!modify){
        interactionMap.removeInteraction(modify)
    }
    if(!!interactionVector){
        interactionMap.removeLayer(interactionVector)
    }
}

function changeInteraction(value, source, cb) {
    interactionMap.removeInteraction(interactionDraw);
    interactionMap.removeInteraction(interactionSnap);
    if (!!value) {
        addInteractions(value, source, cb);
    }
}