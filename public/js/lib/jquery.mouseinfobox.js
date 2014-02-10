/* 
 * @author Clément Mégnin
 * Open an information box when the mouse is over a dom element
 * http://infobox.cmegnin.fr
 */

var InfoBox = {
      
   _settings : {
      'offsetX'     : 20,
      'offsetY'     : 20,
      'useMouse'    : true,
      'content'     : '',
      'boxClass'    : '',
      'animation'   : [],
      'animDuration': 200,
      'ajaxURL'     : '',
      'ajaxType'    : 'POST',
      'ajaxData'    : '',
      'ajaxReload'  : false,
      'ajaxLoadContent'  : 'Loading ...',
      'bottomPos': false,
      'rightPos': false
   },
  
   _box : null,
   _boxIn : null,
   _elmt : null,
   _boxClosing : false,
  
    init : function(options, elmt ) { 
      this._settings = $.extend({},this._settings,options);

      this._elmt = $(elmt);
      this._box = $('<div class="infoBox '+this._settings.boxClass+'"><div></div></div>');
      this._boxIn = this._box.find(' > div');
      
      if(this._settings.content == '') {
        this._settings.content = this._elmt.attr('title');
        this._elmt.attr('title', '');
      }

      this.changeContent(this._settings.content);

      // mouse events
      this._elmt.mouseenter($.proxy(this.onMouseEnter, this));
      this._elmt.mouseleave($.proxy(this.onMouseLeave, this));
      this._elmt.mousemove($.proxy(this.onMouseMove, this));

      // if the content must be loaded with ajax
      if(this._settings.ajaxURL != '') {
        this.loadAjax();
      }

      return this;
    },
    
    // load informations with ajax request
    loadAjax : function() {
      this.changeContent(this._settings.ajaxLoadContent);
      $.ajax({
        type: this._settings.ajaxType,
        url: this._settings.ajaxURL,
        data: this._settings.ajaxData,
        success: $.proxy(function(msg) {
          this.changeContent(msg);
        }, this)
      });
    },
    
    // change the content of the box
    changeContent : function(newContent) {
      this._settings.content = newContent;
      this._boxIn.html(newContent);
    },
    
    // show the box
    showBox : function() {
      this._box.appendTo('body');
      
      this._boxClosing = false;
      
      // animations
      for(var i = 0; i < this._settings.animation.length; i++) {
        switch(this._settings.animation[i]) {
          case 'opacity' :
            this._boxIn.css('opacity', 0);
            this._boxIn.animate({'opacity': 1}, {'queue': false, 'duration': this._settings.animDuration});
            break;
          case 'top' :
            this._boxIn.css('margin-top', -10);
            this._boxIn.animate({'margin-top': 0}, {'queue': false, 'duration': this._settings.animDuration});
            break;
          case 'bottom' :
            this._boxIn.css('margin-top', 10);
            this._boxIn.animate({'margin-top': 0}, {'queue': false, 'duration': this._settings.animDuration});
            break;
          case 'left' :
            this._boxIn.css('margin-left', -10);
            this._boxIn.animate({'margin-left': 0}, {'queue': false, 'duration': this._settings.animDuration});
            break;
          case 'right' :
            this._boxIn.css('margin-left', 10);
            this._boxIn.animate({'margin-left': 0}, {'queue': false, 'duration': this._settings.animDuration});
            break;
        }
      }
      
      
      // reload ajax content if needed
      if(this._settings.ajaxReload) {
        this.loadAjax();
      }
    },
    
    // hide the box
    hideBox : function() {
      
      this._boxClosing = true;
      
      // animations
      for(var i = 0; i < this._settings.animation.length; i++) {
        switch(this._settings.animation[i]) {
          case 'opacity' :
            this._boxIn.animate({'opacity': 0}, {'queue': false, 'duration': this._settings.animDuration, 'complete': $.proxy(this.closeBox, this)});
            break;
          case 'top' :
            this._boxIn.animate({'margin-top': -10}, {'queue': false, 'duration': this._settings.animDuration, 'complete': $.proxy(this.closeBox, this)});
            break;
          case 'bottom' :
            this._boxIn.animate({'margin-top': 10}, {'queue': false, 'duration': this._settings.animDuration, 'complete': $.proxy(this.closeBox, this)});
            break;
          case 'left' :
            this._boxIn.animate({'margin-left': -10}, {'queue': false, 'duration': this._settings.animDuration});
            break;
          case 'right' :
            this._boxIn.animate({'margin-left': 10}, {'queue': false, 'duration': this._settings.animDuration});
            break;
        }
      }
      
      if(this._settings.animation.length == 0) {
        this.closeBox();
      }
    },
    
    closeBox : function() {
        if(this._boxClosing) this._box.detach();
    },
    
    // mouse enter on the dom element
    onMouseEnter : function(evt) {
      this.showBox();
      this.moveBox(evt.pageX, evt.pageY);
    },
    
    // mouse leave the dom element
    onMouseLeave : function(evt) {
      this.hideBox();
    },
    
    // mouse leave the dom element
    onMouseMove : function(evt) {
      this.moveBox(evt.pageX, evt.pageY);
    },
    
    // move the box
    moveBox : function(posX, posY) {
      
      if(!this._settings.useMouse) {
        posX = this._elmt.offset().left;
        posY = this._elmt.offset().top;
      }
      
      posX += this._settings.offsetX;
      posY += this._settings.offsetY;
      
      if(this._settings.rightPos) posX -= this._box.width();
      if(this._settings.bottomPos) posY -= this._box.height();
      
      
      var limRight = $(window).width() + $(window).scrollLeft() - 10;
      var limLeft = 10 + $(window).scrollLeft();
      var limBottom = $(window).height() + $(window).scrollTop() - 10;
      var limTop = 10 + $(window).scrollTop();
      
      if(posX + this._box.width() > limRight) posX = limRight - this._box.width();
      if(posX < limLeft) posX = limLeft;
      if(posY + this._box.height() > limBottom) posY = limBottom - this._box.height();
      if(posY < limTop) posY = limTop;
      
      this._box.css({
        'left': posX,
        'top': posY
      });
    },
    
    setAjaxURL : function(url) {
      this._settings.ajaxURL = url;
    },
    
    setAjaxData : function(data) {
      this._settings.ajaxData = data;
    }
};

// Make sure Object.create is available in the browser (for our prototypal inheritance)
// Courtesy of Papa Crockford
// Note this is not entirely equal to native Object.create, but compatible with our use-case
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
        F.prototype = o;
        return new F();
    };
}

(function($){
  // Start a plugin
  $.fn.infoBox = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        // Create a new InfoBox object via the Prototypal Object.create
        var ib = Object.create(InfoBox);
        // Run the initialization function of the movieclip
        ib.init(options, this); // `this` refers to the element
        // Save the instance of the movieclip object in the element's data store
        $.data(this, 'InfoBox', ib);
      });
    }
  };
})(jQuery);
