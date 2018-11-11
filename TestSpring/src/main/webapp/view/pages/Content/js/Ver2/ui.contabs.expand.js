function loadItem(dataUrl, menuName) {
    // 获取标识数据
    var //dataUrl = $(this).attr('href'),
        //dataIndex = $(this).data('index'),
        ///menuName = $.trim($(this).text()),
        flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length === 0) return false;

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
            flag = false;
            return false;
        }
    });
    // 选项卡菜单不存在
    if (flag) {
        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.J_menuTab').removeClass('active');

        // 添加选项卡对应的iframe dataIndex
        var str1 = '<iframe class="J_iframe" name="iframe' + "0" + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
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
}

// 关闭选项卡菜单
function closeTab(sender) {
    var closeTabId = $(sender).data('id');
    var currentWidth = $(sender).width();

    // 当前元素处于活动状态
    if ($(sender).hasClass('active')) {

        // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
        if ($(sender).next('.J_menuTab').size()) {

            var activeId = $(sender).next('.J_menuTab:eq(0)').data('id');
            $(sender).next('.J_menuTab:eq(0)').addClass('active');

            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == activeId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });

            var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
            if (marginLeftVal < 0) {
                $('.page-tabs-content').animate({
                    marginLeft: (marginLeftVal + currentWidth) + 'px'
                }, "fast");
            }

            //  移除当前选项卡
            $(sender).remove();

            // 移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
        }

        // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
        if ($(sender).prev('.J_menuTab').size()) {
            var activeId = $(sender).prev('.J_menuTab:last').data('id');
            $(sender).prev('.J_menuTab:last').addClass('active');
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == activeId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });

            //  移除当前选项卡
            $(sender).remove();

            // 移除tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
        }
    }
        // 当前元素不处于活动状态
    else {
        //  移除当前选项卡
        $(sender).remove();

        // 移除相应tab对应的内容区
        $('.J_mainContent .J_iframe').each(function () {
            if ($(this).data('id') == closeTabId) {
                $(this).remove();
                return false;
            }
        });
        scrollToTab($('.J_menuTab.active'));
    }
    return false;
}
//刷新iframe
function refreshTab(target) {
    //var target = $('.J_iframe[data-id="' + $(sender).data('id') + '"]');
    var url = target.attr('src');
    //显示loading提示
    //var loading = layer.load();
    target.attr('src', url).load(function () {
        //关闭loading提示
        // layer.close(loading);
    });
}
//计算元素集合的总宽度
function calSumWidth(elements) {
    var width = 0;
    $(elements).each(function () {
        width += $(this).outerWidth(true);
    });
    return width;
}
//滚动到指定选项卡
function scrollToTab(element) {
    var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".page-tabs-content").outerWidth() < visibleWidth) {
        scrollVal = 0;
    } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
        if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
            scrollVal = marginLeftVal;
            var tabElement = element;
            while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                scrollVal -= $(tabElement).prev().outerWidth();
                tabElement = $(tabElement).prev();
            }
        }
    } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
        scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
    }
    $('.page-tabs-content').animate({
        marginLeft: 0 - scrollVal + 'px'
    }, "fast");
}

var frameIdx;
$(function () {
    if (window.frames[0] != undefined && $("#firstTab") != undefined) {
        frameIdx = window.frames[0].window;
    }

});
