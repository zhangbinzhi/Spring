/**
 * 指标图层js
 * Created by 53443 on 2017-03-13.
 */

var cutlinejson=cutlineObj['zb']['default'];
var temphtml="";

function IniConfigObj2(param){
    IniObj2();
    param.callback();
}
function SaveSetting2(){
    var content=new Array();
    var v=$('#ZBRenderingMode').find("option:selected").attr('saveValue');
    var table="PARAM_DISPLAY_COLOUR";
    var where="expr_name='"+v+"'";
    var isok=true;
    $.ajax({
        url: Public.Host+"/webService/delTableData",
        type: "post",
        dataType: 'json',
        headers: {
            "Accept": "*/*",
        },
        contentType: "multipart/form-data;charset=UTF-8 application/x-www-form-urlencoded",
        data: { table: table, "where": where },
        success: function (d) {
            if (d.status === "success") {
                var flag = false;
                $.each($("#divsth2").children('div[data-savingdiv="1"]'),function(i,e){
                    var color=$(e).find("input[data-type='color']").val();
                    if(color==""){
                        color="#000000";
                    }
                    var max=$(e).find("input[data-type='max']").val();
                    var min=$(e).find("input[data-type='min']").val();
                    if(max == -1&&min ==-1){
                        if(!flag){
                            flag = true;
                        }else{
                            return true;
                        }
                    }
                    content.push({"color":color,"min":min,"max":max});
                    $.ajax({
                        url: Public.Host+"/webService/addTableData",
                        type: "post",
                        dataType: 'json',
                        data: { table: table, "where": "(expr_name,start_value,end_value,colour) values('"+v+"',"+min+","+max+",'"+color+"')" },
                        success: function (data) {
                            if (data.status != "success") {
                                isok=false;
                            }
                        }
                    });
                });
                cutlineObj['zb'][v]=content;
                cutlinejson=content;
                if(isok){
                    layer.confirm("是否确定保存更改？", {icon: 3, title:'保存成功'}, function(index){
                        window.location.reload();

                    },function(){ });
                }else{
                    layer.msg("保存出现错误!");
                }
            } else {
                layer.msg("保存出现错误!");
            }
        }
    });
//        setCookie("cutlineArrayStr",JSON.stringify(content));

}
function CloseThisTab2(){
    layer.close(CutlineIndex);
}
function ChangeMode2(){
    var v=$('#ZBRenderingMode').find("option:selected").attr('saveValue');
    if(cutlineObj['zb'].hasOwnProperty(v)){
        cutlinejson=cutlineObj['zb'][v];
    }else{
        cutlinejson=cutlineObj['zb']['default'];
    }
    IniConfigObj2({
        callback:function(){
            SetValue2();
        }
    });
}
function IniObj2(){
    temphtml="";
    $("#btnAddCol2").nextAll().remove();
    var flag =  true;//标记位，用于判断数据库中是否已经保存有默认颜色
    var defaulePlant ="";
    $.each( cutlinejson,function(i,e){
        if(e.min == -1 &&e.max == -1){
            flag = false;
            defaulePlant =
                '<div class="col-sm-12" style=" float:left;width:100%;margin-top: 10px;" data-savingdiv="1" data-savingmode="0">' +
                '<div style="width: 62px;float: right;" class="input-group">' +
                '<input data-type="color" dataname="color" type="text" value="'+ e.color+'" class="hide" style="width: 80px;height: 30px"/>' +
                '<span class="form-control colorpicker-element" style="cursor: pointer;height:30px;width:60px; background-color: '+ e.color+';margin-bottom: -10px;">' +
                '</span>' +
                '</div>' +
                '<div><span style="border: 1px solid #ccc;width:155px;float:left;padding:5px 0;text-align:center">其它全部</span></div>'+
                '<div hidden>' +
                '<input type="number" value="-1" data-type="min" class="form-control " style="width: 60px;float:left;padding:0;padding-left: 15px;">' +
                ' <label class="" style="float: left;margin-top: 8px;margin:10px;">—</label> ' +
                '<input type="number" value="-1" data-type="max" class="form-control " style="width: 60px;float: left;padding:0;padding-left: 15px;" >' +
                '</div>' +
                '</div>';
        }else{
            temphtml+=
                '<div class="col-sm-12" style="float:left;width:100%;margin-top: 10px;" data-savingdiv="1" data-savingmode="0">' +
                '<div style="width: 62px;float: right;" class="input-group">' +
                '<input data-type="color" data-order="'+i+'" dataname="color" type="text" value="'+ e.color+'" class="hide" style="width: 80px;height: 30px"/>' +
                '<span class="form-control colorpicker-element" style="cursor: pointer;height:30px;width:60px; background-color: '+ e.color+';margin-bottom: -10px;">' +
                '</span>' +
                '</div>' +
                '<div style="">' +
                '<input type="number" data-type="min" class="form-control " style="width: 60px;float:left;padding:0;padding-left: 15px;">' +
                ' <label class="" style="float: left;margin-top: 8px;margin:0 10px;">—</label> ' +
                '<input type="number" data-type="max" class="form-control " style="width: 60px;float: left;padding:0;padding-left: 15px;" >' +
                '</div>' +
                '</div>';
        }
    });
    if(flag){
        defaulePlant =
            '<div class="col-sm-12" style=" float:left;width:100%;margin-top: 10px;" data-savingdiv="1" data-savingmode="0">' +
            '<div style="width: 62px;float: right;" class="input-group">' +
            '<input data-type="color" dataname="color" type="text" value="#00000" class="hide" style="width: 80px;height: 30px"/>' +
            '<span class="form-control colorpicker-element" style="height:30px;width:60px; background-color: #00000;margin-bottom: -10px;">' +
            '</span>' +
            '</div>' +
            '<div><span style="border: 1px solid #ccc;width:155px;float:left;padding:5px 0;text-align:center">其它全部</span></div>'+
            '<div hidden>' +
            '<input type="number" value="-1" data-type="min" class="form-control " style="width: 60px;float:left;padding:0;padding-left: 15px;">' +
            ' <label class="" style="float: left;margin-top: 8px;margin:10px;">—</label> ' +
            '<input type="number" value="-1" data-type="max" class="form-control " style="width: 60px;float: left;padding:0;padding-left: 15px;" >' +
            '</div>' +
            '</div>';
    }
    temphtml=defaulePlant +temphtml;
    $("#btnAddCol2").after(temphtml);
}
function SetValue2(){

    cutlinejson.sort(sortNumber2);
    $.each( cutlinejson,function(i,e){
        $("input[data-order='"+i+"']").val(e.color);
        var min=parseFloat(e.min);
        var max=parseFloat(e.max);
        $("input[data-order='"+i+"']").parent().next().find("input[data-type='min']").val(min);
        $("input[data-order='"+i+"']").parent().next().find("input[data-type='max']").val(max);
    });
    $('.colorpicker-element').colorpicker({
        fillcolor:true,
        event:'click',
        success:function(o,color){
            $(o).css("background-color",color);
            $(o).prev().val(color);
        }
    });
}

function addColorControl2(){
    var i=cutlinejson.length;
    temphtml='<div class="col-sm-12" style="float:left;width:100%;margin-top: 10px;" data-savingdiv="1" data-savingmode="0">' +
        '<div style="width: 62px;float: right;" class="input-group">' +
        '<input dataname="color" data-type="color" type="text" value="#00000" class="hide" style="width: 80px;height: 30px"/>' +
        '<span class="form-control colorpicker-element" style="height:30px;width:60px; background-color: #00000;margin-bottom: -10px;"></span></div>' +
        '<div style=""><input type="number" data-type="min" class="form-control " style="width: 60px;float:left;padding:0;padding-left: 15px;">' +
        ' <label class="" style="float: left;margin-top: 8px;margin:0 10px;">—</label> ' +
        '<input type="number" data-type="max" class="form-control " style="width: 60px;float: left;padding:0;padding-left: 15px;" >' +
        '</div></div>';
    $("#divsth2").append(temphtml);
    $('.colorpicker-element').colorpicker({
        fillcolor:true,
        event:'click',
        success:function(o,color){
            $(o).css("background-color",color);
            $(o).prev().val(color);
        }
    });
}
function minusControl2(){
    var Length=$("#divsth2").children("div").length;
    if(Length>1) {
        $("#divsth2").children("div:last-child").remove();
    }
}
function sortNumber2(a,b){
    return a.min - b.min;
}

