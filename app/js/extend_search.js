'use strict';

(function($) {
	$.fn.exp = function(options) {
		var set = $.extend({
			width: 80,
			duration: 200
			}, options );

		 var width = this.width;

		this.on('focus', function(){
			$(this).animate({
				width: set.width
			}, set.duration, function(){});
		});

		this.on('focusout', function(){
			$(this).animate({
				width : 80
			}, set.duration, function(){});
		});

		this.on('blur', function(){
			$(this).animate({
				width: width
			}, set.duration, function(){});
		});

		if (set.action && typeof(set.action) == 'function'){
			this.on('keypress', function(e) {
				if (e.which === 13) {
					set.action($(this).val());
				}
			});
		}
		return this;
	};
}(jQuery));