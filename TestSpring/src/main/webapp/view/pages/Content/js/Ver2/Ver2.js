$(function () {
    var b = location.pathname, c = location.search;
    !function () {
        var a = a ? a : "";
        a = '.';    //qyz 修改为直接连接到本地
        var c = "";
        var d = {
            DataAdmin: {
                code: "Eshine_DataAdmin",
                name: "数据管理",
                flshow: !0,
                icon: "icon iconfont icon-shuju",
                href: a + "/page/dataAdmin/cell.html",
                menu: {
                    Control: {
                        name: "数据管理",
                        href: "javascript:;",
                        menu: {
                            downloadSetting: {
                                name: "配置MR服务器",
                                href: a + "/page/dataAdmin/downloadSetting.html",
                                code: "Eshine_DataAdmin_downloadSetting"
                            },
                            Cell: {
                                name: "工参数据管理",
                                href: a + "/page/dataAdmin/cell.html",
                                code: "Eshine_DataAdmin_Cell"
                            },
                            Atu: {
                                name: "ATU数据管理",
                                href: a + "/page/dataAdmin/atu.html",
                                code: "Eshine_DataAdmin_Atu"
                            },
                            dataCleaner: {
                                name: "数据维护",
                                href: a + "/page/dataAdmin/dataCleaner.html",
                                code: "Eshine_DataAdmin_dataCleaner"
                            },

                        }
                    }
                }
            },
            coverEval: {
                code: "eshine_coverEval",
                name: "MR指标",
                href: a + "/page/coverEval/cellMr.html",
                flshow: !0,
                icon: "icon iconfont icon-fugaishuai",
                menu: {
                    Eval: {
                        name: "指标统计",
                        href: "javascript:;",
                        menu: {
                            List: {
                                name: "小区级MR指标",
                                href: a + "/page/coverEval/cellMr.html",
                                code: "eshine_coverEval_cellMr"
                            },
                            Image: {
                                name: "区域级MR指标",
                                href: a + "/page/coverEval/areaMr.html",
                                code: "eshine_coverEval_areaMr"
                            }
                        }
                    },
                    analysis: {
                        name: "一维指标",
                        href: "javascript:;",
                        ishide: !1,
                        menu: {
                            TA: {
                                name: "Mrs_TADV",
                                href: a + "/page/coverEval/ta.html",
                                code: "eshine_coverEval_ta"
                            },
                            Mrs_AOA: {
                                name: "Mrs_AOA",
                                href: a + "/page/coverEval/mrsAOA.html",
                                code: "eshine_coverEval_mrsAOA"
                            },
                            Mrs_RSRP: {
                                name: "Mrs_RSRP",
                                href: a + "/page/coverEval/mrsRSRP.html",
                                code: "eshine_coverEval_mrsRSRP"
                            },
                            Mrs_RSRQ: {
                                name: "Mrs_RSRQ",
                                href: a + "/page/coverEval/mrsRSRQ.html",
                                code: "eshine_coverEval_mrsRSRQ"
                            },
                            Mrs_SinrUL: {
                                name: "Mrs_SinrUL",
                                href: a + "/page/coverEval/mrsSINRUL.html",
                                code: "eshine_coverEval_mrsSINRUL"
                            },
                        }
                    },
                }
            },
            netStru: {
                code: "Eshine_netStru",
                name: "网络结构",
                flshow: !0,
                icon: "icon iconfont icon-wangluo",
                href: a + "/page/netStru/cellStru.html",
                menu: {
                    Stru: {
                        name: "重叠覆盖度",
                        href: "javascript:;",
                        menu: {
                            cellStru: {
                              name: "小区重叠覆盖度",
                                href: a + "/page/netStru/cellStru.html",
                                code: "eshine_netStru_cellStru"
                            },
                            areaStru: {
                               name: "区域重叠覆盖度",
                                href: a + "/page/netStru/areaStru.html",
                                code: "eshine_netStru_areaStru"
                            }
                        }
                    },
                    Pass: {
                        name: "过覆盖",
                        href: "javascript:;",
                        ishide: !1,
                        menu: {
                            cellPass: {
                                name: "小区过覆盖",
                                href: a + "/page/netStru/cellPass.html",
                                code: "eshine_netStru_cellPass"
                            },
                        }
                    },
                }
            },
            pciOpti: {
                code: "Eshine_pciOpti",
                name: "PCI优化",
                flshow: !0,
                icon: "icon iconfont icon-shiliangzhinengduixiang2",
                href: a + "/page/pciOpti/pciCheck2.html",
                menu: {
                    pci: {
                        name: "PCI优化",
                        href: "javascript:;",
                        menu: {
                            pciCheck: {
                                name: "PCI方案",
                                href: a + "/page/pciOpti/pciCheck2.html",
                                code: "eshine_pciOpti_pciCheck2"
                            },
                            mroInterference: {
                                name: "MRO干扰矩阵查询",
                                href: a + "/page/pciOpti/mroInterference.html",
                                code: "eshine_pciOpti_cellStru"
                            },
                            atuInterference: {
                                name: "ATU干扰矩阵查询",
                                href: a + "/page/pciOpti/atuInterference.html",
                                code: "eshine_pciOpti_atuInterference"
                            },

                        }
                    },
                }
            },
            ncellOptimize: {
                code: "Eshine_ncellOptimize",
                name: "邻区优化",
                flshow: !0,
                icon: "icon iconfont icon-icon",
                //href: "./page/pciOpti/ncellOptimize2.html",
                href: a + "/page/pciOpti/ncellOptimize2.html",
            },
            map: {
                code: "Eshine_map",
                name: "地理分析",
                flshow: !0,
                icon: "icon iconfont icon-erjicaidanlinqufenxi",
                //href: "./page/map/map.html",
                href: a + "/page/map/map.html",
            },
            sysAdmin: {
                code: "Eshine_sysAdmin",
                name: "系统管理",
                flshow: !0,
                icon: "icon iconfont icon-xitongpeizhi",
                href: a + "/page/sysAdmin/params.html",
                menu: {
                    system: {
                        name: "系统配置",
                        href: "javascript:;",
                        menu: {
                            params: {
                                name: "参数配置",
                                href: a + "/page/sysAdmin/params.html",
                                code: "eshine_sysAdmin_params"
                            },
                            admin: {
                                name: "账号管理",
                                href: a + "/page/sysAdmin/admin.html",
                                code: "eshine_sysAdmin_params"
                            },
                            admin: {
                                name: "城市管理",
                                href: a + "/page/sysAdmin/cityAdmin.html",
                                code: "eshine_sysAdmin_params"
                            },
                        }
                    },
                }
            },
        };
        var e = {
            init: function () {
                if (!$(".side-wrap").length)
                    return !1;
                var a = this;
                return (a.setHtml(),
                setTimeout(function () {
                    a.setWidth(),
                    a.setposi(),
                    a.Resize()
                }, 100),
                void a.hoverevent())
            },
            SetTab: function () {
                // 获取标识数据
                var dataUrl = $(this).attr('href'),
                    dataIndex = $(this).data('index'),
                    menuName = $.trim($(this).text()),
                    flag = true;

                if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;

                // 选项卡菜单已存在
                $('.J_menuTab').each(function () {
                    if ($(this).data('id') == dataUrl) {
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                            scrollToTab(this);
                            // 显示tab对应的内容区
                            $('.J_mainContent .J_iframe').each(function () {
                                if ($(this).data('id') == dataUrl) {
                                    $(this).show().siblings('.J_iframe').hide();
                                    return false;
                                }
                            });
                        }

                        //显示loading提示
                        var loading = layer.load();
                        $('.J_mainContent iframe:visible').load(function () {
                            //iframe加载完成后隐藏loading提示
                            layer.close(loading);
                        });


                        var target = $('.J_iframe[data-id="' + $(this).data('id') + '"]');
                        var url = target.attr('src');
                        //显示loading提示
                        var loading = layer.load();
                        target.attr('src', url).load(function () {
                            //关闭loading提示
                            layer.close(loading);
                        });


                        flag = false;
                        return false;
                    }
                });

                // 选项卡菜单不存在
                if (flag) {
                    var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
                    $('.J_menuTab').removeClass('active');

                    // 添加选项卡对应的iframe
                    var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '?v=4.0" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                    $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

                    //显示loading提示
                    var loading = layer.load();

                    $('.J_mainContent iframe:visible').load(function () {
                        //iframe加载完成后隐藏loading提示
                        layer.close(loading);
                    });
                    // 添加选项卡
                    $('.J_menuTabs .page-tabs-content').append(str);
                    scrollToTab($('.J_menuTab.active'));
                }
                return false;
            },
            setHtml: function () {
                var a;
                var u = $("<ul></ul>");
                $(".side-menu").append(u);
                $.each(d, function (index, r) {
                    a = $("<li class=\"pr side-menu-li li-crop menu1\" id=\"" + r.code + "\" code=\"" + r.code + "\">");
                    a.append("<a class=\"side-menu-a new-con-p J_menuItem\" href=\"" + r.href + "\"><i class=\"" + r.icon + "\"></i>" + r.name + "</a>");
                    a.append("<div class=\"float-menu\" style=\"top: 0px;\"></div>");
                    u.append(a);
                    if (1 != r.ishide) {
                        if (r.flshow) {
                            var c = '<ul class="sec-nav clearfix sec-nav-flow">';
                            for (var e in r.menu)
                                if (!r.menu[e].ishide) {
                                    if (c += '<li class="sec-nav-li sec-nav-li-flow">',
                                        c += '<a class="sec-nav-a li-a-color" href="' + r.menu[e].href + '">' + r.menu[e].name + "</a>",
                                        r.menu[e].menu) {
                                        var f = '<ul class="third-nav-ul">';
                                        for (var g in r.menu[e].menu)
                                            r.menu[e].menu[g].ishide || (f += '<li class="third-nav-li menu2" code="' + r.menu[e].menu[g].code + '"><a class="third-nav-a new-con J_menuItem" href="' + r.menu[e].menu[g].href + '">' + r.menu[e].menu[g].name + "</a></li>");
                                        f += "</ul>",
                                            c += f
                                    }
                                    c += "</li>"
                                }
                        } else {
                            var c = '<ul class="sec-nav">';
                            for (var e in r.menu)
                                if (!r.menu[e].ishide) {
                                    if (c += '<li class="sec-nav-li menu2" code="' + r.menu[e].code + '">',
                                        c += '<a class="sec-nav-a new-con J_menuItem" href="' + r.menu[e].href + '">' + r.menu[e].name + "</a>",
                                        r.menu[e].menu) {
                                        var f = '<ul class="third-nav-ul">';
                                        for (var g in r.menu[e].menu)
                                            r.menu[e].menu[g].ishide || (f += '<li class="third-nav-li"><a class="third-nav-a J_menuItem" href="' + r.menu[e].menu[g].href + '">' + r.menu[e].menu[g].name + "</a></li>");
                                        f += "</ul>",
                                            c += f
                                    }
                                    c += "</li>"
                                }
                        }
                        c += "</ul>",
                            a.find(".float-menu").html(c);
                    }
                });

                //                for (var b in d) {
                //                   
                //                }
                $('.J_menuItem').on('click', this.SetTab);
            },
            hidefn: function (a) {
                for (var b = 0; b < a.length; b++) {
                    var c = a[b].split(".");
                    1 == c.length && (d[c[0]].ishide = !0),
                    2 == c.length ? d[c[0]].menu[c[1]].ishide = !0 : 3 == c.length && (d[c[0]].menu[c[1]].menu[c[2]].ishide = !0)
                }
            },
            showfn: function (a) {
                for (var b = 0; b < a.length; b++) {
                    var c = a[b].split(".");
                    1 == c.length && (d[c[0]].ishide = !1),
                    2 == c.length ? d[c[0]].menu[c[1]].ishide = !1 : 3 == c.length && (d[c[0]].menu[c[1]].menu[c[2]].ishide = !1)
                }
            },
            setAgentMenu: function () {
                var b = this;
                if (d.product.menu.List.href = a + "/product/product?action=summaryList",
                d.order.menu.LogisticsList.href = a + "/order/logisticsReconciliation?action=list",
                d.order.menu.QueryContent.href = a + "/order/orderStatistics.jsp",
                d.order.menu.QueryContent.name = "订单统计",
                parent.sysSetting.right.processList)
                    for (var c = parent.sysSetting.right.processList.length - 1; c > -1; c--) {
                        if (4 == parent.sysSetting.right.processList[c]) {
                            b.showfn(["order.LogisticsList"]),
                            d.order.menu.LogisticsList.name = "发货统计";
                            break
                        }
                        if (3 == parent.sysSetting.right.processList[c]) {
                            b.showfn(["order.LogisticsList"]),
                            d.order.menu.LogisticsList.name = "出库统计";
                            break
                        }
                    }
                b.hidefn(["product.Storage", "product.Promotion", "product.Type", "product.tUnit", "pay", "message", "product.collect"]),
                d.product.flshow = !1
            },
            hoverevent: function () {
                var a, c;
                a = b.replace("/", ""),
                    a.indexOf("/") != -1 && (a = a.substring(0, a.indexOf("/"))),
                    "faq" == a ? a = "message" : "inventory" == a ? a = "product" : "generalize" == a && (a = "message"),
                    c = document.getElementById(a),
                    c && (c.className = c.className + " current"),
                    $(".side-menu .side-menu-li").hover(function () {
                        var a = $(this);
                        a.addClass("hover").removeClass("current").siblings(".side-menu-li").removeClass("current hover");
                        var b = a.find(".float-menu");
                        b.html() && (b.show(),
                            b.addClass("showMenu"))
                    }, function () {
                        var a = $(this);
                        a.removeClass("current hover");
                        var b = a.find(".float-menu");
                        b.html() && b.removeClass("showMenu"),
                            Public.Ui.Menu.curInd != -1 && $(".side-menu .side-menu-li").eq(Public.Ui.Menu.curInd).addClass("current")
                    });
            },
            hoverEventAgent: function () {
                var a, c;
                a = b.replace("/", ""),
                    a.indexOf("/") != -1 ? (c = document.getElementById(a.substring(0, a.indexOf("/"))),
                        a = a.substring(0, a.indexOf("/"))) : c = document.getElementById(a),
                    c && (c.className = c.className + " current"),
                    Public.Ui.Menu.curInd = $(".side-menu>ul>li").index($(".side-menu>ul>li.current")),
                    $(".side-menu>ul>li").hover(function () {
                        var a = $(this);
                        a.addClass("current").siblings("li").removeClass("current")
                    }, function () {
                        var a = $(this);
                        a.removeClass("current"), Public.Ui.Menu.curInd != -1 && $(".side-menu>ul>li").eq(Public.Ui.Menu.curInd).addClass("current")
                    });
            },
            setWidth: function () {
                for (var a = $(".side-menu .float-menu .sec-nav-flow"), b = 0; b < a.length; b++) {
                    a.eq(b).parents(".float-menu").css("display", "block");
                    for (var c = a.eq(b).find(".sec-nav-li-flow"), d = 0, e = 0; e < c.length; e++)
                        d += c.eq(e).outerWidth() + 5;
                    a.eq(b).width(d),
                    c.height(a.eq(b).height()),
                    a.eq(b).parents(".float-menu").css("display", "none")
                }
            },
            setposi: function () {
                var a = ($(".side-menu .side-menu-li"),
                $(".side-menu .float-menu"));
                a.css({
                    top: 0
                });
            },
            Resize: function () {
                function a() {
                    var a = parent.window.Public.ResizeData.LeftLi1.outerHeight()
                      , b = parent.window.Public.ResizeData.LeftLi1.offset().top - $(document).scrollTop() + parent.window.Public.ResizeData.FloatMenu1height;
                    b > $(parent.window).height() ? parent.window.Public.ResizeData.FloatMenu1.css({
                        "margin-top": a - parent.window.Public.ResizeData.FloatMenu1height
                    }) : parent.window.Public.ResizeData.FloatMenu1.css({
                        "margin-top": 0
                    });
                    var c = a
                      , d = parent.window.Public.ResizeData.LeftLi2.offset().top - $(document).scrollTop() + parent.window.Public.ResizeData.FloatMenu2height;
                    d > $(parent.window).height() ? parent.window.Public.ResizeData.FloatMenu2.css({
                        "margin-top": c - parent.window.Public.ResizeData.FloatMenu2height
                    }) : parent.window.Public.ResizeData.FloatMenu2.css({
                        "margin-top": 0
                    });
                }

                Public.ResizeData.LeftLi = $(".side-menu .side-menu-li"),
                    Public.ResizeData.LeftLi1 = Public.ResizeData.LeftLi.eq(Public.ResizeData.LeftLi.length - 1),
                    Public.ResizeData.FloatMenu1 = Public.ResizeData.LeftLi1.find(".float-menu"),
                    Public.ResizeData.FloatMenu1height = Public.ResizeData.FloatMenu1.outerHeight(),
                    Public.ResizeData.LeftLi2 = Public.ResizeData.LeftLi.eq(Public.ResizeData.LeftLi.length - 2),
                    Public.ResizeData.FloatMenu2 = Public.ResizeData.LeftLi2.find(".float-menu"),
                    Public.ResizeData.FloatMenu2height = Public.ResizeData.FloatMenu2.outerHeight(),
                    a(),
                    $(parent.window).resize(function () {
                        parent && a();
                    });
            }
        };
        e.init();
    }();
});
var Public = {
    Grid: {},
    commonApp: {},
    Ui: {
        Menu: {},
        MenuList: {},
        Combo: {},
        Dialog: {},
        DatePicker: {},
        Tip: {}
    },
    Order: {},
    Format: {},
    Valid: {},
    Ajax: {},
    Alert: {},
    Validate: {},
    Event: {},
    Cookies: {},
    Session: {},
    Print: {},
    Table: {},
    ResizeData: {},
    newSlide: {},
    Message: {},
    Host: 'http://222.84.165.140:9999',
}