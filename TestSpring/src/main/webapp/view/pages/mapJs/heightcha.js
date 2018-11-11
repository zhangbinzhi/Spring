(function(){
	function b(t,s){
		this.t = t;
		this.c = t.find(s.move).first();
		this.cs = t.find(s.closed).first();
		this.m = false;
		this.s = false;
		this.hide = 5;
		this.size_bg = s.size;
		this.init();
	}
	b.prototype = {
		init:function(){
			var t = this;
			t.box_sizing = t.t.css('box-sizing');
			t.top = t.t.offset().top - $(window).scrollTop();
			t.height = t.t.outerHeight();
			t.w_height = $(window).height();
			t.size();
		},
		size:function(){
			var t= this;
			
			var mapHide=document.getElementById('map-hide');
			t.t.append('<span class="bg_change_size"></span>');
			t.sz = t.t.find('.bg_change_size').first();
			t.sz.css({'position':'absolute','right':0,'left':0,'top':'-3px','display':'block','height':'3px','cursor':'n-resize','background':'#267ebc'});
			t.sz.on('mousedown',function(e){
				t.s = true;
				t.old_height = t.t.height();
				t.old_size_y = e.pageY;
				$(document).on('mousemove',function(e){
					t.new_height =  t.old_size_y -e.pageY + t.old_height;
					t.t.height(t.new_height);
					if(t.t.outerHeight() + t.top <= t.w_height){
						t.t.height(t.top + t.c_height);
					}
					mapHide.style.display='block';
					return false;
				});
				$(document).on('mouseup',function(){
					t.height = t.t.outerHeight();
					t.s = false;
					mapHide.style.display='none';
					$(document).off('mousemove');
					$(document).off('mouseup');
				});
				return false;
			});
		},
	};
	var y = {
		size : 0
	};
	$.fn.bg_move = function(bg){
		$.extend(y,bg);
		$(this).each(function(){
			new b($(this),y);
		});
	}
})(jQuery);