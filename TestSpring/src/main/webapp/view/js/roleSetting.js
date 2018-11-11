/**
 * Created by Administrator on 2018/10/8 0008.
 */

function buildTable() {
    $('#crud-template').crudTemplate(
        {
            colModel: [
                {
                    name: 'roleName',
                    text: '角色名称',
                    type: "string",
                    width: 50,
                    required: true,
                    searchable: false,
                    isDatetime: false
                },
                //{
                //    name: 'dataScope',
                //    text: '数据范围',
                //    type: "string",
                //    width: 50,
                //    required: true,
                //    searchable: false,
                //    readOnly: true
                //},
                {name: 'remarks', text: '备注', type: "string", width: 50, required: true},
                {
                    name: 'roleId',
                    text: 'ID',
                    type: "string",
                    width: 100,
                    keyValue: true,
                    readOnly: true,
                    hideColumn: true
                },
            ],
            extendCol: [
                //{"name": "账号管理", "key": "userId", fun: "viewPic"},
                {"name": "权限配置", "key": "roleId", fun: "loadMenu"}
            ],
            postUrl: httpServer + "/office/queryRole",//查询数据 Post
            delUrl: httpServer + "/vehicle/delete",//删除 Post
            addUrl: httpServer + "/office/addRole",//Post 新增数据
            editUrl: httpServer + "/vehicle/update",//Post 修改数据
            pColumnsWidth: 150,//条件区域列选择宽度
            pageRows: 8,//每页行数
            keyValue: "roleId",//主键名称
            keyType: "string",//主键类型 [string/number]
            editForm: "fixed-table-form",//新增 修改 表单容器
            //myTool: "#myTool",//工具条容器
            isQuery: false,
            timeKey: "",
            userPermission:{create:true,remove:true,update:true,edit:true},
        });
}
var menuTree;
var menuTreeSetting = {
    view: {
        addHoverDom: false,
        removeHoverDom: false,
        selectedMulti: false
    },
    check: {
        enable: true,
        chkStyle: "checkbox"
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id"
        }
    },
    edit: {
        enable: false
    },
    callback: {
        onCheck: menuTreeOnCheck,
        beforeCheck: menuTreeBeforeCheck
        //onClick: treeOnclick
    }
};

function menuTreeOnCheck(e, treeId, treeNode) {
    console.log(treeNode.id + " : " + treeNode.name)
}
function menuTreeBeforeCheck(treeId, treeNode) {
    //if(treeNode.isParent){
    //    layer.alert("只能勾选车车牌号码！");
    //    return false;
    //}
    return true
}

var menuPermissionMap = {};
function loadMenu(ele) {
    if (!!menuTree) {
        $.fn.zTree.destroy("treeDemo");
        menuTree = null;
    }
    $("#roleId").val($(ele).attr("value"));
    var tds = $(ele).parent().parent().siblings();
    $("#roleName").val(tds[2].innerText);
    initMenuTree(function () {
        $.ajax({
            url: httpServer + "/office/loadRolePermission",
            type: "POST",
            data: {roleId: $("#roleId").val()},
            dataType: "json",
            success: function (data) {
                if (data.status === "success") {
                    var permissions = data.items;
                    var permissionMap = {};
                    for (var i = 0, size = permissions.length; i < size; i++) {
                        var permission = permissionMap[permissions[i].permission];
                        if (!permission) {
                            permission = {};
                        }
                        permission[permissions[i].operate] = true;
                        permissionMap[permissions[i].permission] = permission;
                    }
                    var nodes = menuTree.getNodes();
                    for (var i = 0, size = nodes.length; i < size; i++) {
                        nodeIteration(nodes[i], permissionMap);
                    }
                    showSettingDiv();
                } else {
                    layer.alert(data.msg)
                }
            }
        });
    })
}
function initMenuTree(cb) {
    $.ajax({
        url: httpServer + "/office/queryMenu",
        type: "GET",
        data: "",
        dataType: "json",
        success: function (data) {
            menuPermissionMap = {};
            if (data.status === "success") {
                var menus = data.items;
                var zNodes = [];
                for (var i = 0, size = menus.length; i < size; i++) {
                    menuPermissionMap[menus[i].menuId] = menus[i];
                    zNodes.push({id: menus[i].menuId, pId: menus[i].parentId, name: menus[i].menuName, open: true})
                }
                menuTree = $.fn.zTree.init($("#menuTree"), menuTreeSetting, zNodes);
                cb();
            } else {
                layer.alert(data.msg)
            }
        }
    });
}

//迭代所有菜单的节点
function nodeIteration(node, permissionMap) {
    if (node.isParent) {
        var children = node.children;
        for (var i = 0, size = children.length; i < size; i++) {
            nodeIteration(children[i], permissionMap);
        }
    } else {
        var menu = menuPermissionMap[node.id];
        var parentId = menu.permission; //当前菜单为只读菜单，则此值为菜单的id，如果当前菜单为表格菜单，则此值为菜单的权限名称
        if (menu.menuType === '表格') {
            var temp =  permissionMap[menu.permission];
            if(!temp){
                temp={};
            }
            var newNodes = [
                {name: "查看", id: parentId + ":view", checked: temp[parentId + ":view"]},
                {name: "增加", id: parentId + ":add" ,checked: temp[parentId + ":add"]},
                {name: "修改", id: parentId + ":edit" ,checked: temp[parentId + ":edit"]},
                {name: "删除", id: parentId + ":remove",checked: temp[parentId + ":remove"]}
            ];
            menuTree.addNodes(node, newNodes);
        }else{
            if(!!permissionMap[menu.permission]){
                node.checked = true;
                menuTree.updateNode(node);
            }
        }
    }
}

function saveSetting() {
    var nodes = menuTree.getCheckedNodes(true);
    var permissions = [];
    var menus = [];
    var roleMenuMap ={};
    var roleId = $("#roleId").val();
    var roleName = $("#roleName").val();
    for (var i = 0, size = nodes.length; i < size; i++) {
        if (nodes[i].isParent) {
            continue;
        }
        var id = nodes[i].id;
        var menu = menuPermissionMap[id];//如果存在，则证明当前的菜单为只读菜单
        if (!menu) {
            menu = menuPermissionMap[nodes[i].getParentNode().id];
            permissions.push([roleId, roleName, menu.menuId, menu.menuName, menu.permission, id]);
            if(!roleMenuMap[menu.menuId]){
                menus.push([roleId, roleName, menu.menuId, menu.menuName]);
                roleMenuMap[menu.menuId] =true;
            }
        } else {
            permissions.push([roleId, roleName, menu.menuId, menu.menuName, menu.permission, menu.permission + ":view"]);
            if(!roleMenuMap[menu.menuId]){
                menus.push([roleId, roleName, menu.menuId, menu.menuName]);
                roleMenuMap[menu.menuId] =true;
            }
        }
        parentNodeIteration(nodes[i],roleMenuMap,menus,roleId,roleName);
    }
    $.ajax({
        url: httpServer + "/office/setRolePermission",
        type: "POST",
        data: {roleId: roleId, permissions: JSON.stringify(permissions),menus:JSON.stringify(menus)},
        dataType: "json",
        success: function (data) {
            if (data.status === "success") {
                layer.alert(data.msg, function () {
                    showTableDiv();
                    layer.closeAll();
                })
            } else {
                layer.alert(data.msg)
            }
        }
    });
}
//把父节点的菜单也加入菜单范围
function parentNodeIteration(node,roleMenuMap,menus,roleId,roleName){
    var parentNode = node.getParentNode();
    if(!!parentNode){
        if(!roleMenuMap[parentNode.id]){
            menus.push([roleId, roleName, parentNode.id, parentNode.name]);
            roleMenuMap[parentNode.id] =true;
        }
        parentNodeIteration(parentNode,roleMenuMap,menus,roleId,roleName)
    }
}

function showSettingDiv() {
    $("#tableDiv").hide();
    $("#settingDiv").fadeIn(1000);
}
function showTableDiv() {
    $("#settingDiv").hide();
    $("#tableDiv").fadeIn(1000);
}

$(document).ready(function () {
    buildTable()
});
