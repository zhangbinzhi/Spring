$(function () {
    //暂时保留旧菜单，用于测试
    var menuList = {
        index: {
            name: "首页",
            class: "fa-home",
            url: "index.html"
        },
        vehicle: {
            name: "在线监控",
            class: "fa-cab",
            url: "vehicleMonitor.html"
        },
        crudTemplate: {
            name: "监控管理",
            class: "fa-history",
            url: "#",
            menu: {
                historicalTrack: {
                    name: "车辆历史轨迹",
                    url: "historicalTrack.html"
                },
                vehicle: {
                    name: "车辆管理",
                    url: "vehicle.html"
                },
            }
        },
        warnTemplate: {
            name: "告警管理",
            class: "fa-warning",
            url: "#",
            menu: {
                vehicle: {
                    name: "告警信息查询",
                    url: "historicalTrack.html"
                },
                mapSetting: {
                    name: "告警配置管理",
                    url: "mapSetting.html"
                },

            }
        },
        reportTemplate: {
            name: "报表统计",
            class: "fa-table",
            url: "#",
            menu: {
                vehicle: {
                    name: "每日报表",
                    url: "day_report.html"
                },
                mapSetting: {
                    name: "月度报表",
                    url: "month_report.html"
                },
                office: {
                    name: "年度报表",
                    url: "year_report.html"
                },
            }
        },
        systemSet: {
            name: "系统设置",
            class: "fa-gears",
            url: "#",
            menu: {
                vehicle: {
                    name: "机构管理",
                    url: "office.html"
                },
                useSetting: {
                    name: "用户管理",
                    url: "userSetting.html"
                },
                roleSetting: {
                    name: "角色管理",
                    class:"fa-user",
                    url: "roleSetting.html"
                },
                menuSetting: {
                    name: "菜单管理",
                    url: "menuSetting.html"
                }
            }
        },
        helpTemplate: {
            name: "帮助",
            class: "fa-rss",
            url: "#",
            menu: {
                vehicle: {
                    name: "个人信息",
                    url: "#"
                },
                mapSetting: {
                    name: "修改密码",
                    url: "#"
                },
                office: {
                    name: "技术支持",
                    url: "http://www.xunyijia.cn/index.html"
                },
            }
        },
    };
    if(!window.localStorage){
        layer.alert("您的浏览器过于陈旧，系统将无法正常运行，请使用最新的主流浏览器");
    }else{
        var harbor_menuList = window.localStorage.harbor_menuList;
        var userInfo = window.localStorage.harbor_userInfo;
        if(!!harbor_menuList){
            menuList = JSON.parse(harbor_menuList);
            userInfo = JSON.parse(userInfo);
            $("#welcomeLink").html(" "+userInfo.userName+"，欢迎您")
        }else{
            //如果尚未登录过，则返回登录页面
            window.location.href="login.html"
        }
    }

    var side_menu = $('#side-menu');
    $.each(menuList, function (index, r) {
        var li = $("<li></li>");
        //var a = $("<a href=\"" + r.url + "\"><i class=\"fa " + r.class + " fa-fw\"></i> " + r.name + "</a>");
        var icon = r.class;
        if (!!icon) {
            icon = "<i class=\"fa " + icon + " fa-fw\"></i>";
        } else {
            icon = ""
        }
        var onclick ="";
        if(!r.menu){
            onclick =  "onclick='openLink($(this))'";
        }
        var a = $("<a href=\"javascript:void(0)\" "+onclick+" link='"+r.url+"' type='"+r.type+"'>" + icon + r.name + "</a>");
        li.append(a);
        if (!!r.menu) {
            a.append($("<span class=\"fa arrow\"></span>"));
            var u2 = $("<ul class=\"nav nav-second-level\"></ul>");
            var secondMenu = r.menu;
            $.each(secondMenu, function (index2, r2) {
                var icon2 = r2.class;
                if (!!icon2) {
                    icon2 = "<i class=\"fa " + icon2 + " fa-fw\"></i>";
                } else {
                    icon2 = ""
                }
                var li2 = $("<li></li>");
                //var a2 = $("<a href=\"" + r2.url + "\">" + icon2 + r2.name + "</a>");
                var onclick2 ="";
                if(!r2.menu){
                    onclick2 =  "onclick='openLink($(this))'";
                }
                var a2 = $("<a href=\"javascript:void(0)\" "+onclick2+" link='"+r2.url+"' type='"+r2.type+"'>" + icon2 + r2.name + "</a>");
                li2.append(a2);
                if (r2.menu) {
                    var u3 = $("<ul class=\"nav nav-third-level\"></ul>");
                    a2.append($("<span class=\"fa arrow\"></span>"));
                    var thirdMenu = r2.menu;
                    $.each(thirdMenu, function (index3, r3) {
                        var icon3 = r3.class;
                        if (!!icon3) {
                            icon3 = "<i class=\"fa " + icon3 + " fa-fw\"></i>";
                        } else {
                            icon3 = ""
                        }
                        var li3 = $("<li></li>");
                        //var a3 = $("<a href=\"" + r3.url + "\">" + icon3 + r3.name + "</a>");
                        var a3 = $("<a href=\"javascript:void(0)\" onclick='openLink($(this))' link='"+r3.url+"' type='"+r3.type+"'>" + icon3 + r3.name + "</a>");
                        li3.append(a3);
                        u3.append(li3);
                    });
                    li2.append(u3);
                }
                u2.append(li2)
            });
            li.append(u2);
        }
        side_menu.append(li);
    });

    $('#side-menu').metisMenu();
});

function openLink(linkEle){
    var link = $(linkEle).attr("link");
    var type = $(linkEle).attr("type");
    if(type==='iframe'){
        console.log("openLink in iframe");
        link = "myBlankIframe.html?iframe="+link
    }
    window.location.href=link;
}

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location.href;
    console.log("================== "+url);
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function () {
        //console.log($(this).attr("link"));
        //return this.href == url;
        return url.indexOf($(this).attr("link"))>-1;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});

function writeHeader() {
    document.write(
        "  <nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\" style=\"margin-bottom: 0;background:#41ace9;\">\n" +
        "            <div class=\"navbar-header\">\n" +
        "                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n" +
        "                    <span class=\"sr-only\">Toggle navigation</span>\n" +
        "                    <span class=\"icon-bar\"></span>\n" +
        "                    <span class=\"icon-bar\"></span>\n" +
        "                    <span class=\"icon-bar\"></span>\n" +
        "                </button>\n" +
        "                <a  class=\"navbar-brand\" href=\"index.html\" style=\"color: #ffffff\">防城港北斗车辆监控系统</a>\n" +
        "            </div>\n" +
        "            <!-- /.navbar-header -->\n" +
        "\n" +

        "            <ul class=\"nav navbar-top-links navbar-right\">\n" +
        "                <!-- /.dropdown -->\n" +
        "                <li class=\"dropdown\">\n" +
            //"                    <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">\n"+
            //"                        <i class=\"fa fa-user fa-fw\" style=\"background:#41ace9;color: #ffffff\"></i> 系统管理员，欢迎您！</i>\n"+
        "                        <li><a href=\"#\"  class=\"fa fa-user\" style=\"background:#41ace9;color: #ffffff\" id='welcomeLink'> 系统管理员，欢迎您！</a>\n" +
        "                        <li><a href=\"javascript:void(0)\" onclick='logOff()' class=\"fa \" style=\"background:#41ace9;color: #ffffff\"> 退出</a>\n" +
        "                    </a>\n" +
            //"                    <ul class=\"dropdown-menu dropdown-user\">\n"+
            //"                        <li><a href=\"#\"><i class=\"fa fa-user fa-fw\"></i> 用户信息</a>\n"+
            //"                        </li>\n"+
            //"                        <li><a href=\"#\"><i class=\"fa fa-gear fa-fw\"></i> 密码修改</a>\n"+
            //"                        </li>\n"+
            //"                        <li class=\"divider\"></li>\n"+
            //"                        <li><a href=\"login.html\"><i class=\"fa fa-sign-out fa-fw\"></i> 注销</a>\n"+
            //"                        </li>\n"+
            //"                    </ul>\n"+
        "                    <!-- /.dropdown-user -->\n" +
        "                </li>\n" +
        "                <!-- /.dropdown -->\n" +
        "            </ul>\n" +
        "            <!-- /.navbar-top-links -->\n" +
        "\n" +
        "            <div class=\"navbar-default sidebar\" role=\"navigation\">\n" +
        "                <div class=\"sidebar-nav navbar-collapse\">\n" +
        "                    <ul class=\"nav\" id=\"side-menu\">\n" +
            //"                        <li class=\"sidebar-search\">\n"+
            ////"                            <div class=\"input-group custom-search-form\">\n"+
            ////"                                <input type=\"text\" class=\"form-control\" placeholder=\"Search...\">\n"+
            ////"                                <span class=\"input-group-btn\">\n"+
            ////"                                    <button class=\"btn btn-default\" type=\"button\">\n"+
            ////"                                        <i class=\"fa fa-search\"></i>\n"+
            ////"                                    </button>\n"+
            ////"                                </span>\n"+
            ////"                            </div>\n"+
            //"                            <!-- /input-group -->\n"+
            //"                        </li>\n"+
        "                    </ul>\n" +
        "                </div>\n" +
        "                <!-- /.sidebar-collapse -->\n" +
        "            </div>\n" +
        "            <!-- /.navbar-static-side -->\n" +
        "        </nav>"
    )
}

function logOff(){
    $.ajax({
        type: 'POST',
        url: httpServer + "/user/logOff",
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.status !== 'success') {
                window.localStorage.harbor_menuList = null;
                layer.alert(data.msg);
            } else {
                window.location.href = "login.html";
            }
        }
    });
}