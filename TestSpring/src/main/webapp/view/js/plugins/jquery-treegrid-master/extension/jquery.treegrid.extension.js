//var treeIdToNameMap={};
(function ($) {
    "use strict";

    $.fn.treegridData = function (options, param) {
        //如果是调用方法
        if (typeof options == 'string') {
            return $.fn.treegridData.methods[options](this, param);
        }

        //如果是初始化组件
        options = $.extend({}, $.fn.treegridData.defaults, options || {});
        var target = $(this);
        //debugger;
        //得到根节点
        target.getRootNodes = function (data) {
            var result = [];
            $.each(data, function (index, item) {
                if (!item[options.parentColumn]) {
                    result.push(item);
                }
            });
            return result;
        };
        //递归获取子节点并且设置子节点
        target.getChildNodes = function (data, parentNode, tbody) {
            $.each(data, function (i, item) {
                if (!!item[options.parentColumn] && item[options.parentColumn] === parentNode[options.id]) {
                    var tr = $('<tr></tr>');
                    var id = 'treegrid-' + item[options.id];
                    tr.addClass(id);
                    tr.attr('id', id);
                    tr.addClass('treegrid-parent-' + item[options.parentColumn]);
                    $.each(options.columns, function (index, column) {
                        var td;
                        if (index == 0 && !!item['icon']) {
                            td = $('<td><i class="fa ' + item['icon'] + '"> </i>  '+item[column.field]+'</td>');
                        } else if(column.field=='icon'){
                            td = $('<td><i class="fa ' + item['icon'] + '"> </i>  '+item[column.field]+'</td>');
                        }else{
                            td = $('<td>'+item[column.field]+'</td>');
                        }
                        tr.append(td);
                    });
                    tr.append(createOperationTd(id, parentNode));
                    tbody.append(tr);
                    target.getChildNodes(data, item, tbody)

                }
            });
        };
        target.addClass('table');
        if (options.striped) {
            target.addClass('table-striped');
        }
        if (options.bordered) {
            target.addClass('table-bordered');
        }
        if (options.url) {
            $.ajax({
                type: options.type,
                url: options.url,
                data: options.ajaxParams,
                dataType: "JSON",
                success: function (responeData, textStatus, jqXHR) {
                    //debugger;

                    //构造表头
                    var data = responeData.items;
                    if (data.length < 1) {
                        data.push({})//TODO 处理后台菜单未空时的问题
                    }
                    var thr = $('<tr></tr>');
                    $.each(options.columns, function (i, item) {
                        var th = $('<th style="padding:10px;"></th>');
                        th.text(item.title);
                        thr.append(th);
                    });
                    var th = $('<th style="padding:10px;"></th>');
                    th.text('操作');
                    thr.append(th);
                    var thead = $('<thead></thead>');
                    thead.append(thr);
                    target.append(thead);

                    //构造表体
                    var tbody = $('<tbody></tbody>');
                    var rootNode = target.getRootNodes(data);
                    $.each(rootNode, function (i, item) {
                        var tr = $('<tr></tr>');
                        var id = 'treegrid-' + item[options.id];
                        tr.addClass(id);
                        tr.attr('id', id);
                        $.each(options.columns, function (index, column) {
                            var td;
                            if (index == 0 && !!item['icon']) {
                                td = $('<td><i class="fa ' + item['icon'] + '"> </i>  '+item[column.field]+'</td>');
                            } else if(column.field=='icon'){
                                td = $('<td><i class="fa ' + item['icon'] + '"> </i>  '+item[column.field]+'</td>');
                            }else{
                                td = $('<td>'+item[column.field]+'</td>');
                            }
                            tr.append(td);
                        });
                        tr.append(createOperationTd(id));
                        tbody.append(tr);
                        target.getChildNodes(data, item, tbody);
                    });
                    target.append(tbody);
                    target.treegrid({
                        expanderExpandedClass: options.expanderExpandedClass,
                        expanderCollapsedClass: options.expanderCollapsedClass
                    });
                    if (!options.expandAll) {
                        target.treegrid('collapseAll');
                    }
                }
            });
        }
        else {
            //也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....有兴趣可以自己实现，思路和上述类似
        }
        return target;
    };

    $.fn.treegridData.methods = {
        getAllNodes: function (target, data) {
            return target.treegrid('getAllNodes');
        },
        //组件的其他方法也可以进行类似封装........
    };

    $.fn.treegridData.defaults = {
        id: 'Id',
        parentColumn: 'ParentId',
        data: [],    //构造table的数据集合
        type: "GET", //请求数据的ajax类型
        url: null,   //请求数据的ajax的url
        ajaxParams: {}, //请求数据的ajax的data属性
        expandColumn: null,//在哪一列上面显示展开按钮
        expandAll: true,  //是否全部展开
        striped: false,   //是否各行渐变色
        bordered: false,  //是否显示边框
        columns: [],
        expanderExpandedClass: 'glyphicon glyphicon-chevron-down',//展开的按钮的图标
        expanderCollapsedClass: 'glyphicon glyphicon-chevron-right'//缩起的按钮的图标

    };
})(jQuery);

//不同的页面，往下的函数可以用不同的实现方式
//function createOperationTd(id, parentNode) {
//}


//function edit(id, ele) {
//}

//function showForm() {
//    $("#treeTableDive").hide();
//    $("#formDiv").fadeIn(1000);
//}

//function showTable() {
//    $("#formDiv").hide();
//    $("#treeTableDive").fadeIn(1000);
//}

//增加子菜单
//function addSubMenu(id, ele) {
//}

//增加同级菜单
//function addSibMenu(id, ele) {
//}

//function deleteMenu(id, ele){
//}

//function addMenu() {
//}

//function editMenu() {
//}