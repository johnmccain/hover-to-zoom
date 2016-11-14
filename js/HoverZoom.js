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

	//maximum resolution of source image
	this.resY = this.$img[0].naturalHeight;
	this.resX = this.$img[0].naturalWidth;

	this.imgWidth = this.$par.width();

	this.$par.css({
		width: this.imgWidth,
	});

	this.$img.css({
		height: 'auto',
		width: this.imgWidth
	});

	this.imgHeight = this.$img.height();

	this.$par.css({
		height: this.imgHeight
	});

	if (config) {
		if(config.zoom) {
			this.zoomConfig = true;
		}
		this.zoom = config.zoom || Math.max(1, Math.min(this.resX / this.imgWidth, this.resY / this.imgHeight));
	} else {
		this.zoom = Math.max(1, Math.min(this.resX / this.imgWidth, this.resY / this.imgHeight));
	}

	this.$par.addClass('hz-hover-wrapper');
	this.$img.addClass('hz-image');

	this.bindEvents();
}

HoverZoom.prototype = {
	/**
	 * Binds events for the hover to zoom feature
	 */
	bindEvents: function() {
		this.$par.bind('mouseenter', this, function(event) {
			event.data.handler = event.data.$par.bind('mousemove', event.data, function(event) {
				var y = Math.max(event.pageY - event.data.$par.offset().top, 0);
				var x = Math.max(event.pageX - event.data.$par.offset().left, 0);
				var top = -1 * y * (event.data.zoom - 1);
				var left = -1 * x * (event.data.zoom - 1);
				event.data.$img.attr('style', 'max-width: none !important; top: ' + top + 'px !important; left: ' + left + 'px !important; width: ' + event.data.imgWidth * event.data.zoom + 'px !important;' + ' height: ' + event.data.imgHeight * event.data.zoom + 'px !important');
			});
		});
		jQuery(window).bind('resize orientationChange', this, function(event) {

			event.data.imgWidth = event.data.$par.width();
			event.data.$img.css({
				height: 'auto',
				width: event.data.imgWidth
			});
			event.data.imgHeight = event.data.$img.height();
			event.data.$par.css({
				height: event.data.imgHeight
			});

		    if(!event.data.zoomConfig) {
				//reset zoom level if it was not manually set
				event.data.zoom = Math.max(1, Math.min(event.data.resX / event.data.imgWidth, event.data.resY / event.data.imgHeight));
			}
		});
		this.$par.bind('mouseleave', this, function(event) {
			event.data.$par.unbind('mousemove');
			event.data.$img.css({
				top: 0,
				left: 0,
				width: event.data.$par.width(),
				height: 'auto'
			});
		});
	}
};
