/**
 * Created by binzhi on 2018/10/9.
 */
$(document).ready(function () {
    loadDepartment(function () {
        buildTable()
    });
});

function roleSetting(ele) {
    $("#roleUserId").val($(ele).attr("value"));
    $("#roleUserName").val($(ele).parent().parent().siblings()[2].innerText);
    loadRoles(function(){
        loadUserRole(function(){
            layer.open({
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                title: "角色设置",
                area: ['420px','500px'], //宽高
                content: $("#roleForm")
            });
        });
    })
}

function saveUserRole(){
    var roles = [];
    $("input:checkbox[name='roleSetting']:checked").each(function() {
        roles.push([$(this).val(),($(this).parent())[0].innerText,$("#roleUserId").val(),$("#roleUserName").val()]);
    });
//        console.log(roles);
    $.ajax({
        url: httpServer + "/office/setUserRoles",
        type: "POST",
        data: {userId: $("#roleUserId").val(), roles: JSON.stringify(roles)},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                layer.alert(data.msg, function () {
                    layer.closeAll();
                })
            } else {
                layer.alert(data.msg)
            }
        }
    });
}

function loadRoles(cb) {
    $.ajax({
        url: httpServer + "/office/queryRole",
        type: "post",
        dataType: 'json',
        data: {},
        success: function (data) {
            if (data.status === "success") {
                var roles = data.items;
                var roleCheckBoxDiv = $("#roleCheckBox");
                roleCheckBoxDiv.empty();
                $("<label>角色设置(请勾选用户角色)</label><br>").appendTo(roleCheckBoxDiv);
                for (var i = 0, size = roles.length; i < size; i++) {
                    $("<label class=\"checkbox-inline\">" +
                        "<input type=\"checkbox\" name=\"roleSetting\" value='"+roles[i].roleId+"'>" + roles[i].roleName +
                        "</label>")
                        .appendTo(roleCheckBoxDiv);
                }
                if (!!cb)
                    cb();
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}


function loadUserRole(cb){
    $.ajax({
        url: httpServer + "/office/loadUserRole",
        type: "post",
        dataType: 'json',
        data: {userId:$("#roleUserId").val()},
        success: function (data) {
            if (data.status === "success") {
                var roles = data.items;
                for(var i= 0,size = roles.length;i<size;i++){
                    $("input:checkbox[value="+roles[i].roleId+"]").each(function() {
                        $(this).attr("checked","checked")
                    });
                }
                if (!!cb)
                    cb();
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}


function savePassword() {
    var pwd1 = $("#pwd1").val();
    var pwd2 = $("#pwd2").val();

    if(!pwd1 || !pwd2){
        layer.msg("请填写完整密码以及确认密码！");
        return
    }
    if (pwd1 !== pwd2) {
        layer.msg("两次输入密码不一致！");
        return
    }
    $.ajax({
        url: httpServer + "/office/changePwd",
        type: "post",
        dataType: 'json',
        data: {userId: $("#userId").val(), pwd: pwd1},
        success: function (data) {
            if (data.status === "success") {
                layer.alert(data.msg, function () {
                    layer.closeAll();
                })
            } else {
                layer.alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.alert("连接服务器失败")
        }
    });
}

function cancel() {
    layer.closeAll();
}
function changePassword(ele) {
    $("#userId").val($(ele).attr("value"));
    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        title: "修改密码",
        area: ['420px','500px'], //宽高
        content: $("#passwordForm")
    });
}

function buildTable() {
    $('#crud-template').crudTemplate(
        {
            colModel: [
                {name: 'userName', text: '用户名', type: "string", width: 50, required: true, searchable: true},
                {name: 'logTime', text: '登录时间', type: "string", width: 100, readOnly: true},
                {name: 'logIp', text: '登录Ip', type: "string", width: 100, readOnly: true},
                {name: 'remarks', text: '说明', type: "string", width: 100},
                {
                    name: 'userId',
                    text: '用户ID',
                    type: "string",
                    width: 100,
                    keyValue: true,
                    readOnly: true,
                    hideColumn: true
                },
                {
                    name: 'userRoleName',
                    text: '用户角色',
                    type: "number",
                    width: 50,
                    readOnly: true,
                    hideColumn: true
                },
                {
                    name: 'userRoleId',
                    text: '角色ID',
                    type: "string",
                    width: 50,
                    readOnly: true,
                    searchable: false,
                    hideColumn: true
                },

                {
                    name: 'inUse',
                    text: '是否可用',
                    type: "string",
                    width: 100,
                    valueType: "select",
                    selectOption: "是,否"
                },
                {
                    name: 'headcompany',
                    text: '所属公司',
                    type: "string",
                    width: 100,
                    bindEvent: "onClick",
                    bindFunction: "selectHeadCompany"
                },
                {
                    name: 'subcompany',
                    text: '所属子公司',
                    type: "string",
                    width: 100,
                    bindEvent: "onClick",
                    bindFunction: "selectSubCompany"
                },
                //{
                //    name: 'department',
                //    text: '所属部门',
                //    type: "string",
                //    width: 100,
                //    valueType: "select",
                //    selectOption: "",
                //    bindEvent: "onChange",
                //    bindFunction: "selectDepartment"
                //},
                //{name: 'teams', text: '所属队伍', type: "string", width: 100, valueType: "select", selectOption: ""}
            ],
            extendCol: [
                {"name": "角色设置", "key": "userId", fun: "roleSetting"},
                {"name": "修改密码", "key": "userId", fun: "changePassword"},
            ],
            postUrl: httpServer + "/office/queryUser",//查询数据 Post
            delUrl: httpServer + "/office/deleteUser",//删除 Post
//                    exportUrl: httpServer + "/office/exportData",//暂时Get 不提交参数
            addUrl: httpServer + "/office/addUser",//Post 新增数据
            editUrl: httpServer + "/office/updateUser",//Post 修改数据
            pColumnsWidth: 150,//条件区域列选择宽度
            pageRows: 8,//每页行数
            keyValue: "userId",//主键名称
            keyType: "string",//主键类型 [string/number]
            editForm: "fixed-table-form",//新增 修改 表单容器
            //myTool: "#myTool",//工具条容器
            isQuery: false,
            timeKey: "",
            userOperationInfo: "oderQuery",
            userPermission: {create: true, update: true, export: false, remove: true, updateId: false},
            layDate: {
                format: 'YYYY/MM/DD', //日期控件 格式化
                istime: false, //是否开启时间选择
                isclear: true, //是否显示清空
                istoday: true, //是否显示今天
                issure: true, //是否显示确认
                festival: true, //是否显示节日
                min: '1900-01-01 00:00:00', //最小日期
                max: '2099-12-31 23:59:59', //最大日期
                start: laydate.now(), //开始日期
                fixed: false, //是否固定在可视区域
                zIndex: 99999999, //css z-index
                //choose: function(dates) { //选择好日期的回调
                //}
            }
        });
}