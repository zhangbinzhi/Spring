/**
 * Created by binzhi on 2018/10/10.用于将数据库返回的菜单列表转为 sb框架的json格式
 */
function generateMenu(records){
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
            var menu = {name:item.menuName,class:item.icon,url:item.href,id:item.menuId,type:item.menuStyle};
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
            var subMenu = {name:item.menuName,class:item.icon,url:item.href,id:item.menuId,type:item.menuStyle};
            parentNode['menu'][item.menuId] = subMenu;
            getChildNodes(data, parentColumn,subMenu)
        }
    }
}
