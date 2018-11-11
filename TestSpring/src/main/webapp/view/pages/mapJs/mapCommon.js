/**
 * Created by binzhi on 2018/9/16.
 */
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