/**
 * 覆盖图层js
 * Created by 53443 on 2017-03-13.
 */

var cutlinejson=cutlineObj['fg']['default'];
var temphtml="";

function IniConfigObj3(param){
    IniObj3();
    param.callback();
}
function SaveSetting3(){
    var content=new Array();
    var v=$('#FGRenderingMode').find("option:selected").attr('saveValue');
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
                console.log(d)
                if (d.status === "success") {
                    var flag = false;

                $.each($("#divsth").children('div[data-savingdiv="1"]'),function(i,e){
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
                    content.push({"color":color,"min":min,"max":max,});
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
                cutlineObj['fg'][v]=content;
                cutlinejson=content;
                if(isok){
                    layer.confirm("是否保存页面以应用改动？", {icon: 3, title:'保存成功'}, function(index){
                        window.location.reload();
                        //layer.closeAll('dialog');
                    },function(){
                        //window.onload=showFGTCDialog();
                        //window.location.reload();
                    });
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

function ChangeMode3(){
    var v=$('#FGRenderingMode').find("option:selected").attr('saveValue');
    if(cutlineObj['fg'].hasOwnProperty(v)){
        cutlinejson=cutlineObj['fg'][v];
    }else{
        cutlinejson=cutlineObj['fg']['default'];
    }
    IniConfigObj3({
        callback:function(){
            SetValue3();
        }
    });
}
function IniObj3(){
    temphtml="";
    $("#btnAddCol").nextAll().remove();
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
    $("#btnAddCol").after(temphtml);
}
function SetValue3(){
    cutlinejson.sort(sortNumber);
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

function addColorControl3(){
    var i=cutlinejson.length;
    temphtml=
        '<div class="col-sm-12" style="float:left;width:100%;margin-top: 10px;" data-savingdiv="1" data-savingmode="0">' +
        '<div style="width: 62px;float: right;" class="input-group">' +
        '<input dataname="color" data-type="color" type="text" value="#00000" class="hide" style="width: 80px;height: 30px"/>' +
        '<span class="form-control colorpicker-element" style="height:30px;width:60px; background-color: #00000;margin-bottom: -10px;"></span></div>' +
        '<div style="">' +
        '<input type="number" data-type="min" class="form-control " style="width: 60px;float:left;padding:0;padding-left: 15px;">' +
        ' <label class="" style="float: left;margin-top: 8px;margin:10px;">—</label> ' +
        '<input type="number" data-type="max" class="form-control " style="width: 60px;float: left;padding:0;padding-left: 15px;" >' +
        '</div></div>';
    $("#divsth").append(temphtml);
    $('.colorpicker-element').colorpicker({
        fillcolor:true,
        event:'click',
        success:function(o,color){
            $(o).css("background-color",color);
            $(o).prev().val(color);
        }
    });
}
function minusControl3(){
    var Length=$("#divsth").children("div").length;
    if(Length>1) {
        $("#divsth").children("div:last-child").remove();
    }

}
function sortNumber3(a,b){
    return a.min - b.min;
}

