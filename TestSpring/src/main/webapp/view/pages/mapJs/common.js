layui.use(['element','form'], function(){
  var element = layui.element;
  var form = layui.form;
  
  //…
});



$(function(){
	
	$('.dropDownBtn').on('click',function(){
		$(this).toggleClass("zk").parents('.dropDown').find('.list').toggle();
	});
	var headerHeight = $('.tit').outerHeight(),
		footerHeight = $('.bottom').outerHeight();
		$('#map').height($(window).height() - headerHeight - footerHeight /*- 285*/);
	
	//tab
	$('a[data-toggle=tab]').click(function(){
       $(this).parent().addClass("active").siblings().removeClass("active");
       selector = $(this).attr("data-target");
	   $(selector).addClass("active").siblings().removeClass("active");
       $(selector).siblings().css("display","none")
       $(selector).fadeIn("fast");
   });

	$('#map-table .btn_ss_a').click(function(){
		$(this).addClass('none').siblings().removeClass('none');
		$('#map-table').css({'height':'0','min-height':'0'});
		$('#map-table .tab,#map-table .tab-content').css('display','none');
		$('#map').height($(window).height() - headerHeight - footerHeight);
		$('.map-right').css('bottom','10px');
	});
	$('#map-table .btn_ss_b').click(function(){
		$(this).addClass('none').siblings().removeClass('none');
		$('#map-table').css({'height':'282px','min-height':'282px'});
		$('#map-table .tab,#map-table .tab-content').css('display','block');
		$('#map').height($(window).height() - headerHeight - footerHeight /*- 285*/);
		$('.map-right').css('bottom','290px');
	});
	$('.map-right .btn_ss_c').click(function(){
		$(this).parent().toggleClass('ss')
	});


});

//获取url中的参数
function getUrlParam(name) {
	//var name = decodeURI(name);
	//var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	//var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	//if (r != null) return unescape(r[2]); return null; //返回参数值
	var name2, value;
	var str = decodeURI(window.location.href); //取得整个地址栏
	var num = str.indexOf("?");//第一个？为参数开始的标志
	str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
	num = str.indexOf("?");//第二个？为版本，在框架框架中自动加上的
	if (num != -1) {
		str = str.substr(0, num);
	}

	var arr = str.split("&"); //各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name2 = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name2] = value;
		}
	}
	return this[name]
}