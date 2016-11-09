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
	this.$par.addClass('hz-hover-wrapper');

	if (config) {
		this.viewHeight = config.viewHeight || 150;
		this.viewWidth = config.viewWidth || 200;
		this.zoom = config.zoom || Math.max(1, Math.min(this.resX / this.$img.outerWidth(), this.resY / this.$img.outerHeight()));
	} else {
		this.viewHeight = 150;
		this.viewWidth = 200;
		this.zoom = Math.max(1, Math.min(this.resX / this.$img.outerWidth(), this.resY /this.$img.outerHeight()));
	}

	this.createElements();
	this.bindEvents();
}

HoverZoom.prototype = {
	/**
	 * Creates, styles, and inserts the necessary elements for the Hover to Zoom feature
	 */
	createElements: function() {
		this.$wrapper = jQuery('<div class="hz-hover-mask-wrapper"></div>');
		this.$top = jQuery('<div class="hz-top-mask hz-hover-mask"></div>');
		this.$center = jQuery('<div class="hz-hover-mask-center-box"></div>');
		this.$left = jQuery('<div class="hz-left-mask hz-hover-mask"></div>');
		this.$visible = jQuery('<div class="hz-visible-mask"></div>');
		this.$right = jQuery('<div class="hz-right-mask hz-hover-mask"></div>');
		this.$bottom = jQuery('<div class="hz-bottom-mask hz-hover-mask"></div>');
		this.$zoomedWrapper = jQuery('<div class="hz-zoomed-wrapper"></div>');
		this.$zoomedImg = jQuery('<img class="hz-zoomed-img" />');

		this.$visible.css({
			height: this.viewHeight + 'px',
			width: this.viewWidth + 'px'
		});
		this.$zoomedWrapper.css({
			height: (this.viewHeight * this.zoom + 'px'),
			width: (this.viewWidth * this.zoom + 'px'),
			right: (-1 * this.viewWidth * this.zoom + 'px')
		});

		this.$zoomedImg.css({
			width: this.$img.outerWidth() * this.zoom
		});

		this.$zoomedWrapper.addClass('hz-hidden');
		this.$zoomedImg.attr('src', this.$img.attr('src'));

		//append
		this.$par.append(this.$zoomedWrapper);
		this.$zoomedWrapper.append(this.$zoomedImg);
		this.$par.append(this.$wrapper);
		this.$wrapper.append(this.$top);
		this.$wrapper.append(this.$center);
		this.$center.append(this.$left);
		this.$center.append(this.$visible);
		this.$center.append(this.$right);
		this.$wrapper.append(this.$bottom);

		jQuery('.hz-hover-mask').addClass('hz-hidden');
	},

	/**
	 * Binds events for the hover to zoom feature
	 */
	bindEvents: function() {
		this.$wrapper.on('mouseenter', '', this, function(event) {
			jQuery('.hz-hover-mask').removeClass('hz-hidden');
			event.data.$zoomedWrapper.removeClass('hz-hidden');
			event.data.handler = event.data.$wrapper.on('mousemove', '', event.data, function(event) {
				var top = Math.min(event.data.$img.outerHeight() - event.data.viewHeight, Math.max(event.clientY - event.data.$wrapper.offset().top - (event.data.viewHeight / 2), 0));
				var left = Math.min(event.data.$img.outerWidth() - event.data.viewWidth, Math.max(event.clientX - event.data.$wrapper.offset().left - (event.data.viewWidth / 2), 0));
				var bottom = Math.max(event.data.$wrapper.outerHeight() - top - (event.data.viewHeight), 0);
				var right = Math.max(event.data.$wrapper.outerWidth() - left - (event.data.viewWidth), 0);

				event.data.$top.css('min-height', top);
				event.data.$left.css('max-width', left);
				event.data.$right.css('max-width', right);
				event.data.$bottom.css('min-height', bottom);

				event.data.$zoomedImg.css({
					top: -1 * (top + (event.data.viewHeight * 0)) * event.data.zoom,
					left: -1 * (left + (event.data.viewWidth * 0)) * event.data.zoom
				});
			});
		});
		this.$wrapper.on('mouseleave', '', this, function(event) {
			event.data.$wrapper.off('mousemove');
			jQuery('.hz-hover-mask').addClass('hz-hidden');
			event.data.$zoomedWrapper.addClass('hz-hidden');
		});
	}
};
