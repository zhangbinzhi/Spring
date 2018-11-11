/**
 * Created by Administrator on 2018/5/16 0016.
 */

var layerIndex;
var eventTreeNode;
var operationType;
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false,
        dblClickExpand: dblClickExpand
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        removeTitle: "删除",
        renameTitle: "编辑",
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename,
        onClick: clickFun
    }
};


var nodeNameMap={};
var zNodes;
var log, className = "dark";
function beforeDrag(treeId, treeNodes) {
    return false;
}
function beforeEditName(treeId, treeNode) {
    className = (className === "dark" ? "" : "dark");
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    eventTreeNode = treeNode;
    layerIndex = layer.confirm("确定编辑节点 -- " + treeNode.name + " 吗？", {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.close(layerIndex);
        operationType = "edit";
        resetForm(eventTreeNode);
        layerIndex = layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
//                    area: ['420px', '340px'], //宽高
            content: $("#form")
        });
    }, function () {
        eventTreeNode = null;
        layer.close(layerIndex);
    });
    return false;

//            setTimeout(function() {
//                if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
//                    setTimeout(function() {
////                        zTree.editName(treeNode);
////                        zTree.editName(treeNode);
//                        treeNode.name = "tesr";
//                        zTree.updateNode(treeNode);
//
//                    }, 0);
//                }
//            }, 0);
}
function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "" : "dark");
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    layerIndex = layer.confirm("确定删除 节点 -- " + treeNode.name + " 吗？", {
        btn: ['确定', '取消'] //按钮
    }, function () {
        zTree.removeNode(treeNode);
        layer.close(layerIndex);
    }, function () {
        layer.close(layerIndex);
    });
    return false;
//            return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}
function onRemove(e, treeId, treeNode) {
}
function beforeRename(treeId, treeNode, newName, isCancel) {
    className = (className === "dark" ? "" : "dark");
    if (newName.length == 0) {
        setTimeout(function () {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}
function onRename(e, treeId, treeNode, isCancel) {
    return true;
}
function showRemoveBtn(treeId, treeNode) {
    return  treeNode.getPath().length > 1;
}
function showRenameBtn(treeId, treeNode) {
//            console.log(treeNode.id);
    return treeNode.getPath().length > 1;
}
function dblClickExpand(treeId, treeNode) {
    return treeNode.level > 0;
}

function addHoverDom(treeId, treeNode) {
    if (treeNode.getPath().length > 4) return;
    eventTreeNode = treeNode;
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='增加' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        operationType = "add";
        //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        //console.log(treeNode.getIndex());
        //console.log(treeNode);
        //zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "新节点" + (newCount++)});
        resetForm();
        layerIndex = layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
//                    area: ['420px', '340px'], //宽高
            content: $("#form")
        });
        return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};

function clickFun(event, treeId, treeNode, clickFlag) {
    if (!!treeNode.url) {
        window.open(treeNode.url);
    }
}

$(document).ready(function () {
    //$.fn.zTree.init($("#treeDemo"), setting, zNodes);
    loadDbMenu();
});

function saveZtree() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var nodes = zTree.getNodes()[0];
    var nodeList = [];
    nodeList.push({"id": "防城港港口", pId: "", "name": "防城港港口"});
    if(nodes.isParent){
        var children1 = nodes.children;
        for (var i = 0, size1 = children1.length; i < size1; i++) {
            var subChildren = children1[i];
            nodeIteration(nodes,subChildren,nodeList);
        }
    }

    console.log(JSON.stringify(nodeList));
    infoLoading();
    $.ajax({
        type: 'POST',
        url: httpServer+"/office/officeUpdate",
        data: {
            jsonStr: JSON.stringify(nodeList)
        },
        dataType: 'json',
        success: function (data) {
            closeLoading();
            layer.alert(data.msg);
        }
    });
}


function nodeIteration(parentNode,node,list){
    list.push({id:node.id,pid:parentNode.name,name:node.name});
    if(node.isParent){
        var children = node.children;
        for (var i = 0, size = children.length; i < size; i++) {
            nodeIteration(node,children[i],list);
        }
    }
}

function resetZtree() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

function addNode() {
    var menuMame = $("#menuMame").val();
    if (!menuMame) {
        layer.msg("菜单名称或值不能为空", {time: 1000});
        return;
    }
    if(!!nodeNameMap[menuMame]){
        layer.msg("重复的部门名称！请尝试增加前缀（如 **公司**部）", {time: 2000});
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (operationType === "add") {
        zTree.addNodes(eventTreeNode, {
            id: menuMame,
            pId: eventTreeNode.id,
            name: menuMame,
        });
    } else if ("edit" === operationType) {
        eventTreeNode.name = menuMame;
        eventTreeNode.id = menuMame;
        zTree.updateNode(eventTreeNode);
    }
    nodeNameMap[menuMame]=true;
    resetForm();
    layer.close(layerIndex);
}

function resetForm(treeNode) {
    $("#menuMame").val("");
}

function infoLoading() {
    layerIndex = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}
function closeLoading() {
    if (!!layerIndex) {
        layer.close(layerIndex);
    }
}
function cancel() {
    if (!!layerIndex) {
        layer.close(layerIndex);
    }
}

function openALL(){
    $.fn.zTree.getZTreeObj("treeDemo").expandAll(true);
}

function closeAll(){
    $.fn.zTree.getZTreeObj("treeDemo").expandAll(false);
}

function loadDbMenu() {
    infoLoading();
    $.ajax({
        type: 'POST',
        url: httpServer+"/office/loadOffice",
        data: {},
        dataType: 'json',
        success: function (data) {
            closeLoading();
            if (data.status !== 'success') {
                layer.alert("获取菜单失败 ：" + data.msg);
            } else {
                var items = data.items;
                var tempList = [];
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];
                    var node = {id: item.id, pId: item.parent_id, name: item.office};
                    if("防城港港口"===item.office){
                        node["open"] = true
                    }
                    nodeNameMap[item.office] = true;
                    tempList.push(node);
                }

                if (tempList.length < 1) {
                    tempList.push({"id": "防城港港口", pId: "", "name": "防城港港口"})
                }
                zNodes = tempList;
                $.fn.zTree.init($("#treeDemo"), setting, tempList);
            }
        }
    });
}


