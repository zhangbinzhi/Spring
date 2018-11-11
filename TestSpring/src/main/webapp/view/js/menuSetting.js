/**
 * Created by Administrator on 2018/10/5.
 */
$(document).ready(function () {
    $('#iconpicker').iconpicker({
        align: 'center', // Only in div tag
        arrowClass: 'btn-danger',
        arrowPrevIconClass: 'glyphicon glyphicon-chevron-left',
        arrowNextIconClass: 'glyphicon glyphicon-chevron-right',
        cols: 10,
        footer: true,
        header: true,
        icon: 'fa-circle-o',
        iconset: 'fontawesome',
        labelHeader: '{0} / {1} 页',
        labelFooter: '{0} - {1} / {2} icons',
        placement: 'bottom', // Only in button tag
        rows: 5,
        search: true,
        searchText: '搜索',
        selectedClass: 'btn-success',
        unselectedClass: ''
    });

    $('#iconpicker').on('change', function(e) {
        console.log(e.icon);
       $("#icon").val(e.icon);
    });

    $('#tb').treegridData({
        id: 'menuId',
        parentColumn: 'parentId',
        data:[],
        type: "GET", //请求数据的ajax类型
        url: httpServer+'/office/queryMenu',   //请求数据的ajax的url
        ajaxParams: {}, //请求数据的ajax的data属性
        expandColumn: null,//在哪一列上面显示展开按钮
        striped: true,   //是否各行渐变色
        bordered: true,  //是否显示边框
        //expandAll: false,  //是否全部展开
        columns: [
            {title: '菜单名称',field: 'menuName'},
            {title: '菜单类型',field: 'menuType'},
            {title: '链接',field: 'href'},
            {title: '图标',field: 'icon'},
            {title: '序号',field: 'sort'},
            {title: '显示',field: 'isShow'},
            {title: '权限名称',field: 'permission'},
            {title: '说明',field: 'remarks'},
            {title: '打开方式',field: 'menuStyle'}

        ]
    });

});

//不同的页面，往下的函数可以用不同的实现方式
function createOperationTd(id, parentNode) {
    var td;
    if (!!parentNode) {
        if (parentNode.menuLevel < 1) {
            td = $('<td>' +
                '<a href="javascript:void(0);" onclick=\"edit(\'' + id + '\',$(this))\">编辑</a>  ' +
                '<a href="javascript:void(0);" onclick=\"deleteMenu(\'' + id + '\',$(this))\">删除</a>  ' +
                '<a href="javascript:void(0);" onclick=\"addSubMenu(\'' + id + '\',$(this))\">增加下级菜单</a>  ' +
                    //'<a href="javascript:void(0);">增加同级菜单</a>' +
                '</td>');
        } else {
            td = $('<td>' +
                '<a href="javascript:void(0);" onclick=\"edit(\'' + id + '\',$(this))\">编辑</a>  ' +
                '<a href="javascript:void(0);" onclick=\"deleteMenu(\'' + id + '\',$(this))\">删除</a>  ' +
                    //'<a href="javascript:void(0);" onclick=\"addSubMenu(\'' + id + '\',$(this))\">增加下级菜单</a>  ' +
                    //'<a href="javascript:void(0);">增加同级菜单</a>' +
                '</td>');
        }
    } else {
        td = $('<td>' +
            '<a href="javascript:void(0);" onclick=\"edit(\'' + id + '\',$(this))\">编辑</a>  ' +
            '<a href="javascript:void(0);" onclick=\"deleteMenu(\'' + id + '\',$(this))\">删除</a>  ' +
            '<a href="javascript:void(0);" onclick=\"addSubMenu(\'' + id + '\',$(this))\">增加下级菜单</a>  ' +
            '<a href="javascript:void(0);" onclick=\"addSibMenu(\'' + id + '\',$(this))\">增加同级菜单</a>' +
            '</td>');
    }

    return td;
}


function edit(id, ele) {
    var selector = "#" + id;
    var nodeId = $(selector).treegrid('getNodeId');
    $("#menuId").val(nodeId);

    var tds = $(ele).parent().siblings();
    $("#menuName").val(tds[0].innerText);
    $("#menuType").val(tds[1].innerText);
    $("#href").val(tds[2].innerText);
    $("#icon").val(tds[3].innerText.trim());
    $("#iconpicker").iconpicker('setIcon', tds[3].innerText.trim());
    $("#sort").val(tds[4].innerText);
    $("input:radio[name='isShow']").each(function(){
        if($(this).val()==tds[5].innerText){
            console.log($(this).val());
            $(this).prop("checked","checked");
        }else{
            $(this).removeAttr("checked");
        }
    });
    $("#permission").val(tds[6].innerText);
    $("#remarks").val(tds[7].innerText);
    $("#menuStyle").val(tds[8].innerText);


    $("#editBtn").show();
    $("#saveBtn").hide();
    showForm();
}

function showForm() {
    $("#treeTableDive").hide();
    $("#formDiv").fadeIn(1000);
}

function showTable() {
    $("#formDiv").hide();
    $("#treeTableDive").fadeIn(1000);
}

//增加子菜单
function addSubMenu(id, ele) {
    var selector = "#" + id;
    var nodeId = $(selector).treegrid('getNodeId');
    $("#parentId").val(nodeId);
    $("#menuLevel").val($(selector).treegrid('getDepth')+ 1) ;
    $("#saveBtn").show();
    $("#editBtn").hide();
    showForm();
}

//增加同级菜单
function addSibMenu(id, ele) {
    var selector = "#" + id;
    var parentId = $(selector).treegrid('getParentNodeId');
    if (!!parentId) {
        console.log(parentId);
        $("#parentId").val(parentId);
        //$("#parentName").val(parentNode.Name);
    }
    $("#menuLevel").val($(selector).treegrid('getDepth'));
    $("#saveBtn").show();
    $("#editBtn").hide();
    showForm();
}

function deleteMenu(id, ele){
    var tds = $(ele).parent().siblings();
    var menuName = tds[0].innerText;
    var selector = "#" + id;
    var nodeId = $(selector).treegrid('getNodeId');

    layer.confirm("确定删除菜单："+menuName+" 及其子菜单吗？",function(){
        $.ajax({
            url: httpServer + "/office/deleteMenu",
            type: "post",
            dataType: 'json',
            data: {menuId:nodeId},
            success: function (data) {
                if (data.status === "success") {
                    layer.alert('操作成功');
                    layer.alert('新增成功',function(){
                        window.location.reload();
                    });
                } else {
                    layer.alert(data.msg)
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.alert("连接服务器失败")
            }
        });
    })
}

function addMenu() {
    var data = {};
    data.parentId = $("#parentId").val();
    data.menuName = $("#menuName").val();
    data.menuLevel = $("#menuLevel").val();
    data.href = $("#href").val();
    data.icon = $("#icon").val();
    data.sort = $("#sort").val();
    data.isShow = $("input[name='isShow']:checked").val();
    data.permission = $("#permission").val();
    data.menuType = $("#menuType").val();
    data.remarks = $("#remarks").val();
    data.menuStyle =  $("#menuStyle").val();
    $.ajax({
        url: httpServer + "/office/addMenu",
        type: "post",
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.status === "success") {
                layer.alert('新增成功',function(){
                    window.location.reload();
                });

            } else {
                alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("连接服务器失败")
        }
    });
}

function editMenu() {
    var data = {};
    data.menuId = $("#menuId").val();
    data.menuName = $("#menuName").val();
    data.href = $("#href").val();
    data.icon = $("#icon").val();
    data.sort = $("#sort").val();
    data.isShow = $("input[name='isShow']:checked").val();
    data.permission = $("#permission").val();
    data.menuType = $("#menuType").val();
    data.remarks = $("#remarks").val();
    data.menuStyle =  $("#menuStyle").val();

    $.ajax({
        url: httpServer + "/office/editMenu",
        type: "post",
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data.status === "success") {
                layer.alert('修改成功',function(){
                    window.location.reload();
                });
            } else {
                alert(data.msg)
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("连接服务器失败")
        }
    });
}
