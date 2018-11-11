/**
 * Created by binzhi on 2018/10/9.
 */

var headCompany = {};
var headCompanyStr = "";
var subCompany = {};
var department = {};
function loadDepartment(cb) {
    $.ajax({
        type: 'POST',
        url: httpServer + "/office/loadOffice",
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.status !== 'success') {
                layer.alert("获取部门信息失败 ：" + data.msg);
            } else {
                var items = data.items;
                //第一轮循环，找总公司
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];
//                        var node = {id: item.id, pId: item.parent_id, name: item.office};
                    if ("防城港港口" === item.office) {
                        continue;
                    } else {
                        if (item.parent_id === "防城港港口") {
                            headCompany[item.office] = [];
                            headCompanyStr += (item.office + ",")
                        }
                    }
                }
                if (headCompanyStr.length < 1) {
                    swal("无部门信息，无法编辑车辆，请先配置机构信息");
                    return;
                } else {
                    headCompanyStr = headCompanyStr.substring(0, headCompanyStr.length - 1);
                    console.log(headCompanyStr);
                }
                //第二轮循环，找子公司
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];//
                    if ("防城港港口" === item.office) {
                        continue;
                    } else {
                        var headCompanyName = item.parent_id;
                        if (!!headCompany[headCompanyName]) {
                            var subCompanys = headCompany[headCompanyName];
                            subCompanys.push(item.office);
                            //创建子公司中的列表
                            subCompany[item.office] = [];
                        }
                    }
                }

                //第三轮循环，找部门
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];//
                    if ("防城港港口" === item.office) {
                        continue;
                    } else {
                        var subCompanyName = item.parent_id;
                        if (!!subCompany[subCompanyName]) {
                            var departments = subCompany[subCompanyName];
                            departments.push(item.office);
                            //创建子公司中的列表
                            department[item.office] = [];
                        }
                    }
                }

                //第四轮循环，找队伍
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];//
                    if ("防城港港口" === item.office) {
                        continue;
                    } else {
                        var departName = item.parent_id;
                        if (!!department[departName]) {
                            var teams = department[departName];
                            teams.push(item.office);
                        }
                    }
                }
                if (!!cb) {
                    cb();
                }
            }
        }
    });
}


function saveSelect() {
    var name = $("#select_name").val();
    if (!name) {
        layer.alert("操作失败！");
        return;
    }
    $(".fixed-table-form input[name='" + name + "']").val($("#sel_company").val());
    layer.closeAll();
}

function cancel() {
    layer.closeAll();
}

function selectHeadCompany(ele) {
    $("#select_name").val($(ele).attr("name"));
    var options = headCompanyStr.split(",");
    var sel = $("#sel_company");
    $("#companyType").html("请选择所属公司");
    sel.empty();
    for (var i = 0, size = options.length; i < size; i++) {
        $("<option value='" + options[i] + "'>" + options[i] + "</option>").appendTo(sel)
    }
    showSelectForm();
}

function showSelectForm(){
    layer.open({
        //title:"请选择所属公司",
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        //area: ['420px', '240px'], //宽高
        content: $("#companyForm")
    });
}
function selectSubCompany(ele) {
    var headCompanyInput = $(".fixed-table-form input[name='headcompany']").val();
    if (!headCompanyInput) {
        layer.alert("请先选择所属公司！");
        return;
    }
    $("#select_name").val($(ele).attr("name"));
    var options = headCompany[headCompanyInput];
    if(!options ||options.length<1){
        layer.alert("当前公司下无子公司！");
        return;
    }
    $("#companyType").html("请选择子公司");
    var sel = $("#sel_company");
    sel.empty();
    for (var i = 0, size = options.length; i < size; i++) {
        $("<option value='" + options[i] + "'>" + options[i] + "</option>").appendTo(sel)
    }
    showSelectForm();
}

function selectDepartment(ele) {
    console.log($(ele).val());
    var subs = department[$(ele).val()];
    var sel = $("#teams");
    sel.empty();
    $("<option value=''></option>").appendTo(sel);
    if (!!department[$(ele).val()]) {
        if (subs.length > 0) {
            for (var i = 0, size = subs.length; i < size; i++) {
                $("<option value='" + subs[i] + "'>" + subs[i] + "</option>").appendTo(sel)
            }
        }
    }
}
