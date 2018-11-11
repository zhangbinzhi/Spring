/**
 * Created by binzhi on 2018/10/10.
 */

function UrlSearch(){
    var name,value;
    var str=window.location.href; //取得整个地址栏
    var num=str.indexOf("?");//第一个？为参数开始的标志
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
    num=str.indexOf("?");//第二个？为版本，在框架框架中自动加上的
    if(num !=-1){
        str = str.substr(0,num);
    }

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}
