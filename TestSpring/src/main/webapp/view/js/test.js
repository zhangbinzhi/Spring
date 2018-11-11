/**
 * Created by Administrator on 2018/4/9 0009.
 */

generateMenu();

function generateMenu(){
    var records = [
        {
            "parentId": "7e310f4d-50dc-4052-9182-08585203139f",
            "menuId": "0576c86d-dac9-443b-964f-6ced31d4d32b",
            "icon": "fa-table",
            "menuName": "每日报表",
            "href": "day_report.html",
            "sort": 1
        },
        {
            "parentId": "",
            "menuId": "3b118309-fcea-4cef-b6aa-3d1eea32534f",
            "icon": "fa-home",
            "menuName": "首页",
            "href": "index.html",
            "sort": 1
        },
        {
            "parentId": "2bef8540-fd11-4b1b-ad0c-12a9aa51aa95",
            "menuId": "b6aec42d-78f8-4b47-83ac-59b90e4781c1",
            "icon": "",
            "menuName": "机构管理",
            "href": "office.html",
            "sort": 1
        },
        {
            "parentId": "287afbd9-d3b1-4240-a4c7-e229e949770e",
            "menuId": "025aaba0-c3b0-452b-8727-8bd10621f852",
            "icon": "",
            "menuName": "告警信息查询",
            "href": "",
            "sort": 1
        },
        {
            "parentId": "2bef8540-fd11-4b1b-ad0c-12a9aa51aa95",
            "menuId": "444890fd-1f4d-4378-a1bd-46b11dd16abd",
            "icon": "",
            "menuName": "用户管理",
            "href": "userSetting.html",
            "sort": 2
        },
        {
            "parentId": "287afbd9-d3b1-4240-a4c7-e229e949770e",
            "menuId": "bdcd01cb-9f82-44bc-9c6c-c5e4848216cf",
            "icon": "",
            "menuName": "告警配置管理",
            "href": "mapSetting.html",
            "sort": 2
        },
        {
            "parentId": "7b07dd2f-fd93-402e-88ca-b6118188952b",
            "menuId": "e6c8e747-cba7-4d2f-abe9-f9def0395123",
            "icon": "fa-table",
            "menuName": "车辆历史轨迹查询",
            "href": "/admin/pages/historicalTrack.html",
            "sort": 2
        },
        {
            "parentId": "7e310f4d-50dc-4052-9182-08585203139f",
            "menuId": "c2b90993-bbc3-4080-af64-831dd442e67f",
            "icon": "",
            "menuName": "月读报表",
            "href": "month_report.html",
            "sort": 2
        },
        {
            "parentId": "",
            "menuId": "360d50a2-d1d8-46c6-8dc2-94f8dbd463aa",
            "icon": "fa-cab",
            "menuName": "在线监控",
            "href": "vehicleMonitor.html",
            "sort": 2
        },
        {
            "parentId": "",
            "menuId": "7b07dd2f-fd93-402e-88ca-b6118188952b",
            "icon": "fa-table",
            "menuName": " 监控管理",
            "href": "",
            "sort": 3
        },
        {
            "parentId": "7e310f4d-50dc-4052-9182-08585203139f",
            "menuId": "67d9530e-e625-4d4d-9988-8d18f8182cd4",
            "icon": "fa-table",
            "menuName": "年度报表",
            "href": "year_report.html",
            "sort": 3
        },
        {
            "parentId": "7b07dd2f-fd93-402e-88ca-b6118188952b",
            "menuId": "0c20b942-12f2-4b7c-9460-fed2dbf3d450",
            "icon": "fa-automobile",
            "menuName": "车辆管理",
            "href": "/admin/pages/vehicle.html",
            "sort": 3
        },
        {
            "parentId": "2bef8540-fd11-4b1b-ad0c-12a9aa51aa95",
            "menuId": "d61f9efd-b79e-4b90-868d-2383c7993123",
            "icon": "",
            "menuName": "角色管理",
            "href": "roleSetting.html",
            "sort": 3
        },
        {
            "parentId": "",
            "menuId": "287afbd9-d3b1-4240-a4c7-e229e949770e",
            "icon": "fa-warning",
            "menuName": "告警管理",
            "href": "",
            "sort": 4
        },
        {
            "parentId": "2bef8540-fd11-4b1b-ad0c-12a9aa51aa95",
            "menuId": "3d8ff390-0645-4af2-b2d4-1f9f97e5c2b9",
            "icon": "",
            "menuName": "菜单管理",
            "href": "menuSetting.html",
            "sort": 4
        },
        {
            "parentId": "",
            "menuId": "7e310f4d-50dc-4052-9182-08585203139f",
            "icon": "fa-table",
            "menuName": "报表统计",
            "href": "",
            "sort": 5
        },
        {
            "parentId": "",
            "menuId": "2bef8540-fd11-4b1b-ad0c-12a9aa51aa95",
            "icon": "fa-gears",
            "menuName": "系统设置",
            "href": "",
            "sort": 7
        }
    ];
    var rootNodes = getRootNodes(records,'parentId');
    console.log(JSON.stringify(rootNodes));
    return rootNodes;
}

function getRootNodes(data,parentColumn) {
    var result = {};
    for(var i= 0,size = data.length;i<size;i++){
        var item =data[i];
        if (!item[parentColumn]) {
            //result.push(item);
            var menu = {name:item.menuName,class:item.icon,url:item.href,id:item.menuId};
            result[item.menuId] = menu;
            getChildNodes(data, parentColumn,menu)
        }
    }
    return result;
}

function getChildNodes(data, parentColumn,parentNode) {
    for(var i= 0,size = data.length;i<size;i++){
        var item =data[i];
        if (!!item[parentColumn] && item[parentColumn] === parentNode['id']) {
            if(!parentNode['menu']){
                parentNode['menu']={};
            }
            var subMenu = {name:item.menuName,class:item.icon,url:item.href,id:item.menuId};
            parentNode['menu'][item.menuId] = subMenu;
            getChildNodes(data, parentColumn,subMenu)
        }
    }
}
