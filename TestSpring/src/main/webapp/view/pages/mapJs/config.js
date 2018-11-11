var OpenLayers;
if(!!OpenLayers){
    OpenLayers.ProxyHost = '../cgi/proxy.py?url=';
}
var geoserverAddress='http://219.159.184.58:7794/';
//var httpServer="http://120.78.94.107:8085/";
//var httpServer="http://127.0.0.1:8085/";
var httpServer="";

var Public = {
    getRelationData: '/executeSql',
    exportJsonData: 'http://120.78.94.107:8085/executeSql',
    outPutExcle2: 'http://120.78.94.107:8085/executeSql',
    DoExecute: 'http://120.78.94.107:8085/executeSql'
}
