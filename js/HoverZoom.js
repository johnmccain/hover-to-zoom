/**
 * Makes an image hover zoomable
 * Requires jQuery
 * @constructor
 * @param {jQueryelement} par - a div containing the image you would like to make hover-zoomable
 * @param {object} config -
 */
function HoverZoom(par, config) {

	this.$par = par;
	this.$img = this.$par.find('img');
	this.$img.addClass('hz-image');

	//maximum resolution of source image
	this.resY = this.$img[0].naturalHeight;
	this.resX = this.$img[0].naturalWidth;
	this.$par.addClass('hz-hover-wrapper');

	this.imgHeight = this.$img.height();
	this.imgWidth = this.$img.width();

	this.$par.css({
		width: this.imgWidth,
		height: this.imgHeight
	});

	if (config) {
		this.zoom = config.zoom || Math.max(1, Math.min(this.resX / this.imgWidth, this.resY / this.imgHeight));
	} else {
		this.zoom = Math.max(1, Math.min(this.resX / this.imgWidth, this.resY /this.imgHeight));
	}

	this.bindEvents();
}

HoverZoom.prototype = {
	/**
	 * Binds events for the hover to zoom feature
	 */
	bindEvents: function() {
		this.$par.bind('mouseenter', this, function(event) {
			event.data.handler = event.data.$par.bind('mousemove', event.data, function(event) {
				var y = Math.max(event.clientY - event.data.$par.offset().top, 0);
				var x = Math.max(event.clientX - event.data.$par.offset().left, 0);
				var top = -1 * y * (event.data.zoom - 1);
				var left = -1 * x * (event.data.zoom - 1);

				var topTime;
				var leftTime;
				if(top/left > left/top) {
					leftTime = (top / left);
					topTime = 1;
				} else {
					topTime = (left / top);
					leftTime = 1;
				}

				event.data.$img.css({
					top: top,
					left: left,
					width: event.data.imgWidth * event.data.zoom,
					height: event.data.imgHeight * event.data.zoom
				});
			});
		});
		this.$par.bind('mouseleave', this, function(event) {
			event.data.$par.unbind('mousemove');
			event.data.$img.css({
				top: 0,
				left: 0,
				width: event.data.imgWidth,
				height: event.data.imgHeight
			});
		});
	}
};
