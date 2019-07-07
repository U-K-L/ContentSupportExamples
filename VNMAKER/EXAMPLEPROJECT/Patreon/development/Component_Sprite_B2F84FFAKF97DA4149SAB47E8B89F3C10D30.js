var AnimationTypes, Component_Sprite,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Sprite = (function(superClass) {
  extend(Component_Sprite, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Sprite.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A sprite component to display an object on screen. It can be managed or
  * unmanaged. A managed sprite is automatically added to the graphics-system
  * and rendered every frame until it gets disposed. An unmanaged sprite needs
  * to be added and removed manually.
  *
  * @module gs
  * @class Component_Sprite
  * @extends gs.Component_Visual
  * @memberof gs
  * @constructor
  * @param {boolean} managed - Indicates if the sprite is managed by the graphics system.
   */

  function Component_Sprite(managed) {
    Component_Sprite.__super__.constructor.call(this);

    /**
    * The native sprite object to display the game object on screen.
    *
    * @property sprite
    * @type Sprite
    * @protected
     */
    this.sprite = null;

    /**
    * The name of the image to display.
    *
    * @property image
    * @type string
    * @protected
     */
    this.image = null;

    /**
    * The name of the video to display.
    *
    * @property video
    * @type string
    * @protected
     */
    this.video = null;

    /**
    * The name of the folder from where the image should be loaded.
    *
    * @property image
    * @type string
    * @protected
     */
    this.imageFolder = "Graphics/Pictures";

    /**
    * The visibility. If <b>false</b>, the sprite is not rendered.
    *
    * @property visible
    * @type boolean
    * @protected
     */
    this.visible = false;

    /**
    * Indicates if the image is loaded.
    *
    * @property imageLoaded
    * @type boolean
    * @protected
     */
    this.imageLoaded = false;
  }


  /**
  * Disposes the sprite. If the sprite is managed, it will be automatically
  * removed from the graphics system and viewport.
  * @method dispose
   */

  Component_Sprite.prototype.dispose = function() {
    var ref, ref1;
    Component_Sprite.__super__.dispose.apply(this, arguments);
    if (this.sprite) {
      this.sprite.dispose();
      if (this.sprite.video) {
        this.sprite.video.stop();
      }
      if (!this.sprite.managed) {
        if ((ref = this.sprite.viewport) != null) {
          ref.removeGraphicObject(this.sprite);
        }
        return (ref1 = Graphics.viewport) != null ? ref1.removeGraphicObject(this.sprite) : void 0;
      }
    }
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_Sprite.prototype.setupEventHandlers = function() {
    return this.sprite.onIndexChange = (function(_this) {
      return function() {
        _this.object.rIndex = _this.sprite.index;
        return _this.object.needsUpdate = true;
      };
    })(this);
  };


  /**
  * Setup the sprite.
  * @method setupSprite
   */

  Component_Sprite.prototype.setupSprite = function() {
    if (!this.sprite) {
      return this.sprite = new Sprite(Graphics.viewport, typeof managed !== "undefined" && managed !== null ? managed : true);
    }
  };


  /**
  * Setup the sprite component. This method is automatically called by the
  * system.
  * @method setup
   */

  Component_Sprite.prototype.setup = function() {
    this.isSetup = true;
    this.setupSprite();
    this.setupEventHandlers();
    return this.update();
  };


  /**
  * Updates the source- and destination-rectangle of the game object so that
  * the associated bitmap fits in. The imageHandling property controls how
  * the rectangles are resized.
  * @method updateRect
   */

  Component_Sprite.prototype.updateRect = function() {
    if (this.sprite.bitmap != null) {
      if (!this.object.imageHandling) {
        this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height);
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      } else if (this.object.imageHandling === 1) {
        this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height / 2);
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      } else if (this.object.imageHandling === 2) {
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      }
    }
  };


  /**
  * Updates the bitmap object from the associated image name. The imageFolder
  * property controls from which resource-folder the image will be loaded.
  * @method updateBitmap
   */

  Component_Sprite.prototype.updateBitmap = function() {
    this.imageLoaded = false;
    this.image = this.object.image;
    if (this.object.image.startsWith("data:") || this.object.image.startsWith("$")) {
      this.sprite.bitmap = ResourceManager.getBitmap(this.object.image);
    } else {
      this.sprite.bitmap = ResourceManager.getBitmap((this.object.imageFolder || this.imageFolder) + "/" + this.object.image);
    }
    if (this.sprite.bitmap != null) {
      if (!this.imageLoaded) {
        this.imageLoaded = this.sprite.bitmap.loaded;
      } else {
        delete this.sprite.bitmap.loaded_;
      }
    }
    return this.object.bitmap = this.sprite.bitmap;
  };


  /**
  * Updates the video object from the associated video name. It also updates
  * the video-rendering process.
  * @method updateVideo
   */

  Component_Sprite.prototype.updateVideo = function() {
    var ref, ref1;
    if (this.object.video !== this.videoName) {
      this.videoName = this.object.video;
      this.sprite.video = ResourceManager.getVideo("Movies/" + this.object.video);
      if (this.sprite.video != null) {
        if ((ref = $PARAMS.preview) != null ? ref.settings.musicDisabled : void 0) {
          this.sprite.video.volume = 0;
        }
        this.sprite.video.loop = this.object.loop;
        this.sprite.video.play();
        this.object.srcRect = new Rect(0, 0, this.sprite.video.width, this.sprite.video.height);
        if (!this.object.fixedSize) {
          this.object.dstRect = new Rect(this.object.dstRect.x, this.object.dstRect.y, this.sprite.video.width, this.sprite.video.height);
        }
      }
    }
    return (ref1 = this.sprite.video) != null ? ref1.update() : void 0;
  };


  /**
  * Updates the image if the game object has the image-property set.
  * @method updateImage
   */

  Component_Sprite.prototype.updateImage = function() {
    var ref;
    if (this.object.image != null) {
      if (this.object.image !== this.image || (!this.imageLoaded && ((ref = this.sprite.bitmap) != null ? ref.loaded : void 0))) {
        this.updateBitmap();
        return this.updateRect();
      }
    } else if (this.object.bitmap != null) {
      return this.sprite.bitmap = this.object.bitmap;
    } else if ((this.object.video != null) || this.videoName !== this.object.video) {
      return this.updateVideo();
    } else {
      this.image = null;
      this.object.bitmap = null;
      return this.sprite.bitmap = null;
    }
  };


  /**
  * If the sprite is unmanaged, this method will update the visibility of the
  * sprite. If the sprite leaves the viewport, it will be removed to save 
  * performance and automatically added back to the viewport if it enters
  * the viewport.
  * @method updateVisibility
   */

  Component_Sprite.prototype.updateVisibility = function() {
    var visible;
    if (!this.sprite.managed) {
      visible = Rect.intersect(this.object.dstRect.x + this.object.origin.x, this.object.dstRect.y + this.object.origin.y, this.object.dstRect.width, this.object.dstRect.height, 0, 0, Graphics.width, Graphics.height);
      if (visible && !this.visible) {
        (this.object.viewport || Graphics.viewport).addGraphicObject(this.sprite);
        this.visible = true;
      }
      if (!visible && this.visible) {
        (this.object.viewport || Graphics.viewport).removeGraphicObject(this.sprite);
        return this.visible = false;
      }
    }
  };


  /**
  * Updates the padding.
  * @method updatePadding
   */

  Component_Sprite.prototype.updatePadding = function() {
    if (this.object.padding != null) {
      this.sprite.x += this.object.padding.left;
      this.sprite.y += this.object.padding.top;
      this.sprite.zoomX -= (this.object.padding.left + this.object.padding.right) / this.object.srcRect.width;
      return this.sprite.zoomY -= (this.object.padding.bottom + this.object.padding.bottom) / this.object.srcRect.height;
    }
  };


  /**
  * Updates the sprite properties from the game object properties.
  * @method updateProperties
   */

  Component_Sprite.prototype.updateProperties = function() {
    var ref, ref1;
    this.sprite.width = this.object.dstRect.width;
    this.sprite.height = this.object.dstRect.height;
    this.sprite.x = this.object.dstRect.x;
    this.sprite.y = this.object.dstRect.y;
    this.sprite.mask = (ref = this.object.mask) != null ? ref : this.mask;
    this.sprite.angle = this.object.angle || 0;
    this.sprite.opacity = (ref1 = this.object.opacity) != null ? ref1 : 255;
    this.sprite.clipRect = this.object.clipRect;
    this.sprite.srcRect = this.object.srcRect;
    this.sprite.blendingMode = this.object.blendMode || 0;
    this.sprite.mirror = this.object.mirror;
    this.sprite.visible = this.object.visible && (!this.object.parent || (this.object.parent.visible == null) || this.object.parent.visible);
    this.sprite.ox = -this.object.origin.x;
    this.sprite.oy = -this.object.origin.y;
    return this.sprite.z = (this.object.zIndex || 0) + (!this.object.parent ? 0 : this.object.parent.zIndex || 0);
  };


  /**
  * Updates the optional sprite properties from the game object properties.
  * @method updateOptionalProperties
   */

  Component_Sprite.prototype.updateOptionalProperties = function() {
    if (this.object.tone != null) {
      this.sprite.tone = this.object.tone;
    }
    if (this.object.color != null) {
      this.sprite.color = this.object.color;
    }
    if (this.object.viewport != null) {
      this.sprite.viewport = this.object.viewport;
    }
    if (this.object.effects != null) {
      this.sprite.effects = this.object.effects;
    }
    if (this.object.anchor != null) {
      this.sprite.anchor.x = this.object.anchor.x;
      this.sprite.anchor.y = this.object.anchor.y;
    }
    if (this.object.positionAnchor != null) {
      this.sprite.positionAnchor = this.object.positionAnchor;
    }
    if (this.object.zoom != null) {
      this.sprite.zoomX = this.object.zoom.x;
      this.sprite.zoomY = this.object.zoom.y;
    }
    if (this.object.motionBlur != null) {
      return this.sprite.motionBlur = this.object.motionBlur;
    }
  };


  /**
  * Updates the sprite component by updating its visibility, image, padding and
  * properties.
  * @method update
   */

  Component_Sprite.prototype.update = function() {
    Component_Sprite.__super__.update.apply(this, arguments);
    if (!this.isSetup) {
      this.setup();
    }
    this.updateVisibility();
    this.updateImage();
    this.updateProperties();
    this.updateOptionalProperties();
    this.updatePadding();
    this.object.rIndex = this.sprite.index;
    return this.sprite.update();
  };

  return Component_Sprite;

})(gs.Component_Visual);


/**
* Enumeration of appearance animations. 
*
* @module gs
* @class AnimationTypes
* @static
* @memberof gs
 */

AnimationTypes = (function() {
  function AnimationTypes() {}

  AnimationTypes.initialize = function() {

    /**
    * An object appears or disappears by moving into or out of the screen.
    * @property MOVEMENT
    * @type number
    * @static
    * @final
     */
    this.MOVEMENT = 0;

    /**
    * An object appears or disappears using alpha-blending.
    * @property BLENDING
    * @type number
    * @static
    * @final
     */
    this.BLENDING = 1;

    /**
    * An object appears or disappears using a mask-image.
    * @property MASKING
    * @type number
    * @static
    * @final
     */
    return this.MASKING = 2;
  };

  return AnimationTypes;

})();

AnimationTypes.initialize();

gs.AnimationTypes = AnimationTypes;

gs.Component_Sprite = Component_Sprite;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZ0NBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OzZCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7Ozs7RUFhYSwwQkFBQyxPQUFEO0lBQ1QsZ0RBQUE7O0FBRUE7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLEtBQUQsR0FBUzs7QUFFVDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxXQUFELEdBQWU7RUF2RE47OztBQXlEYjs7Ozs7OzZCQUtBLE9BQUEsR0FBUyxTQUFBO0FBQ0wsUUFBQTtJQUFBLCtDQUFBLFNBQUE7SUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFKO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7TUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWDtRQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWQsQ0FBQSxFQURKOztNQUdBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQWY7O2FBQ29CLENBQUUsbUJBQWxCLENBQXNDLElBQUMsQ0FBQSxNQUF2Qzs7d0RBQ2lCLENBQUUsbUJBQW5CLENBQXVDLElBQUMsQ0FBQSxNQUF4QyxXQUZKO09BTko7O0VBSEs7OztBQWFUOzs7Ozs7NkJBS0Esa0JBQUEsR0FBb0IsU0FBQTtXQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsR0FBd0IsQ0FBQSxTQUFBLEtBQUE7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QUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxXQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSx3QkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDO1dBQ3pCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBO0VBWEk7Ozs7R0F2U21CLEVBQUUsQ0FBQzs7O0FBcVRsQzs7Ozs7Ozs7O0FBUU07OztFQUNGLGNBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQTs7QUFDVDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBQ1o7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUNaOzs7Ozs7O1dBT0EsSUFBQyxDQUFBLE9BQUQsR0FBVztFQXhCRjs7Ozs7O0FBMEJqQixjQUFjLENBQUMsVUFBZixDQUFBOztBQUNBLEVBQUUsQ0FBQyxjQUFILEdBQW9COztBQUNwQixFQUFFLENBQUMsZ0JBQUgsR0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X1Nwcml0ZSBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEEgc3ByaXRlIGNvbXBvbmVudCB0byBkaXNwbGF5IGFuIG9iamVjdCBvbiBzY3JlZW4uIEl0IGNhbiBiZSBtYW5hZ2VkIG9yXG4gICAgKiB1bm1hbmFnZWQuIEEgbWFuYWdlZCBzcHJpdGUgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgZ3JhcGhpY3Mtc3lzdGVtXG4gICAgKiBhbmQgcmVuZGVyZWQgZXZlcnkgZnJhbWUgdW50aWwgaXQgZ2V0cyBkaXNwb3NlZC4gQW4gdW5tYW5hZ2VkIHNwcml0ZSBuZWVkc1xuICAgICogdG8gYmUgYWRkZWQgYW5kIHJlbW92ZWQgbWFudWFsbHkuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9TcHJpdGVcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1hbmFnZWQgLSBJbmRpY2F0ZXMgaWYgdGhlIHNwcml0ZSBpcyBtYW5hZ2VkIGJ5IHRoZSBncmFwaGljcyBzeXN0ZW0uXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChtYW5hZ2VkKSAtPlxuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBuYXRpdmUgc3ByaXRlIG9iamVjdCB0byBkaXNwbGF5IHRoZSBnYW1lIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgc3ByaXRlXG4gICAgICAgICogQHR5cGUgU3ByaXRlXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHNwcml0ZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgaW1hZ2UgdG8gZGlzcGxheS5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZVxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgdmlkZW8gdG8gZGlzcGxheS5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aWRlb1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB2aWRlbyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgZm9sZGVyIGZyb20gd2hlcmUgdGhlIGltYWdlIHNob3VsZCBiZSBsb2FkZWQuXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAaW1hZ2VGb2xkZXIgPSBcIkdyYXBoaWNzL1BpY3R1cmVzXCJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgdmlzaWJpbGl0eS4gSWYgPGI+ZmFsc2U8L2I+LCB0aGUgc3ByaXRlIGlzIG5vdCByZW5kZXJlZC5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aXNpYmxlXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB2aXNpYmxlID0gbm9cblxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBpbWFnZSBpcyBsb2FkZWQuXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VMb2FkZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGltYWdlTG9hZGVkID0gbm9cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIHNwcml0ZS4gSWYgdGhlIHNwcml0ZSBpcyBtYW5hZ2VkLCBpdCB3aWxsIGJlIGF1dG9tYXRpY2FsbHlcbiAgICAqIHJlbW92ZWQgZnJvbSB0aGUgZ3JhcGhpY3Mgc3lzdGVtIGFuZCB2aWV3cG9ydC5cbiAgICAqIEBtZXRob2QgZGlzcG9zZVxuICAgICMjI1xuICAgIGRpc3Bvc2U6IC0+IFxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgaWYgQHNwcml0ZVxuICAgICAgICAgICAgQHNwcml0ZS5kaXNwb3NlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQHNwcml0ZS52aWRlb1xuICAgICAgICAgICAgICAgIEBzcHJpdGUudmlkZW8uc3RvcCgpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG5vdCBAc3ByaXRlLm1hbmFnZWRcbiAgICAgICAgICAgICAgICBAc3ByaXRlLnZpZXdwb3J0Py5yZW1vdmVHcmFwaGljT2JqZWN0KEBzcHJpdGUpXG4gICAgICAgICAgICAgICAgR3JhcGhpY3Mudmlld3BvcnQ/LnJlbW92ZUdyYXBoaWNPYmplY3QoQHNwcml0ZSlcbiBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXJzIGZvciBtb3VzZS90b3VjaCBldmVudHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIEBzcHJpdGUub25JbmRleENoYW5nZSA9ID0+XG4gICAgICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEBzcHJpdGUuaW5kZXhcbiAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXR1cCB0aGUgc3ByaXRlLlxuICAgICogQG1ldGhvZCBzZXR1cFNwcml0ZVxuICAgICMjIyBcbiAgICBzZXR1cFNwcml0ZTogLT5cbiAgICAgICAgaWYgIUBzcHJpdGVcbiAgICAgICAgICAgIEBzcHJpdGUgPSBuZXcgU3ByaXRlKEdyYXBoaWNzLnZpZXdwb3J0LCBtYW5hZ2VkID8geWVzKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0dXAgdGhlIHNwcml0ZSBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGlzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGJ5IHRoZVxuICAgICogc3lzdGVtLlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICAgICBAaXNTZXR1cCA9IHllc1xuICAgICAgICBAc2V0dXBTcHJpdGUoKVxuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgQHVwZGF0ZSgpXG4gICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHNvdXJjZS0gYW5kIGRlc3RpbmF0aW9uLXJlY3RhbmdsZSBvZiB0aGUgZ2FtZSBvYmplY3Qgc28gdGhhdFxuICAgICogdGhlIGFzc29jaWF0ZWQgYml0bWFwIGZpdHMgaW4uIFRoZSBpbWFnZUhhbmRsaW5nIHByb3BlcnR5IGNvbnRyb2xzIGhvd1xuICAgICogdGhlIHJlY3RhbmdsZXMgYXJlIHJlc2l6ZWQuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVJlY3RcbiAgICAjIyNcbiAgICB1cGRhdGVSZWN0OiAtPlxuICAgICAgICBpZiBAc3ByaXRlLmJpdG1hcD9cbiAgICAgICAgICAgIGlmICFAb2JqZWN0LmltYWdlSGFuZGxpbmdcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAc3ByaXRlLmJpdG1hcC53aWR0aCwgQHNwcml0ZS5iaXRtYXAuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIGlmIG5vdCBAb2JqZWN0LmZpeGVkU2l6ZVxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3Qud2lkdGggPSBAb2JqZWN0LnNyY1JlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LmhlaWdodCA9IEBvYmplY3Quc3JjUmVjdC5oZWlnaHRcbiAgICAgICAgICAgIGVsc2UgaWYgQG9iamVjdC5pbWFnZUhhbmRsaW5nID09IDFcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAc3ByaXRlLmJpdG1hcC53aWR0aCwgQHNwcml0ZS5iaXRtYXAuaGVpZ2h0IC8gMilcbiAgICAgICAgICAgICAgICBpZiBub3QgQG9iamVjdC5maXhlZFNpemVcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5zcmNSZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgPSBAb2JqZWN0LnNyY1JlY3QuaGVpZ2h0XG4gICAgICAgICAgICBlbHNlIGlmIEBvYmplY3QuaW1hZ2VIYW5kbGluZyA9PSAyXG4gICAgICAgICAgICAgICAgaWYgbm90IEBvYmplY3QuZml4ZWRTaXplXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC53aWR0aCA9IEBvYmplY3Quc3JjUmVjdC53aWR0aFxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQG9iamVjdC5zcmNSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBiaXRtYXAgb2JqZWN0IGZyb20gdGhlIGFzc29jaWF0ZWQgaW1hZ2UgbmFtZS4gVGhlIGltYWdlRm9sZGVyXG4gICAgKiBwcm9wZXJ0eSBjb250cm9scyBmcm9tIHdoaWNoIHJlc291cmNlLWZvbGRlciB0aGUgaW1hZ2Ugd2lsbCBiZSBsb2FkZWQuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUJpdG1hcFxuICAgICMjI1xuICAgIHVwZGF0ZUJpdG1hcDogLT5cbiAgICAgICAgQGltYWdlTG9hZGVkID0gbm9cbiAgICAgICAgQGltYWdlID0gQG9iamVjdC5pbWFnZVxuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5pbWFnZS5zdGFydHNXaXRoKFwiZGF0YTpcIikgfHwgQG9iamVjdC5pbWFnZS5zdGFydHNXaXRoKFwiJFwiKVxuICAgICAgICAgICAgQHNwcml0ZS5iaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKEBvYmplY3QuaW1hZ2UpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzcHJpdGUuYml0bWFwID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIiN7QG9iamVjdC5pbWFnZUZvbGRlcnx8QGltYWdlRm9sZGVyfS8je0BvYmplY3QuaW1hZ2V9XCIpXG4gICAgICAgICAgXG4gICAgICAgIGlmIEBzcHJpdGUuYml0bWFwPyAgXG4gICAgICAgICAgICBpZiBub3QgQGltYWdlTG9hZGVkXG4gICAgICAgICAgICAgICAgQGltYWdlTG9hZGVkID0gQHNwcml0ZS5iaXRtYXAubG9hZGVkXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVsZXRlIEBzcHJpdGUuYml0bWFwLmxvYWRlZF9cbiAgICAgICAgICAgIFxuICAgICAgICBAb2JqZWN0LmJpdG1hcCA9IEBzcHJpdGUuYml0bWFwXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHZpZGVvIG9iamVjdCBmcm9tIHRoZSBhc3NvY2lhdGVkIHZpZGVvIG5hbWUuIEl0IGFsc28gdXBkYXRlc1xuICAgICogdGhlIHZpZGVvLXJlbmRlcmluZyBwcm9jZXNzLlxuICAgICogQG1ldGhvZCB1cGRhdGVWaWRlb1xuICAgICMjI1xuICAgIHVwZGF0ZVZpZGVvOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnZpZGVvICE9IEB2aWRlb05hbWVcbiAgICAgICAgICAgIEB2aWRlb05hbWUgPSBAb2JqZWN0LnZpZGVvXG4gICAgICAgICAgICBAc3ByaXRlLnZpZGVvID0gUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiTW92aWVzLyN7QG9iamVjdC52aWRlb31cIilcbiAgICAgICAgICAgIGlmIEBzcHJpdGUudmlkZW8/XG4gICAgICAgICAgICAgICAgaWYgJFBBUkFNUy5wcmV2aWV3Py5zZXR0aW5ncy5tdXNpY0Rpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgIEBzcHJpdGUudmlkZW8udm9sdW1lID0gMFxuICAgICAgICAgICAgICAgIEBzcHJpdGUudmlkZW8ubG9vcCA9IEBvYmplY3QubG9vcFxuICAgICAgICAgICAgICAgIEBzcHJpdGUudmlkZW8ucGxheSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgQG9iamVjdC5zcmNSZWN0ID0gbmV3IFJlY3QoMCwgMCwgQHNwcml0ZS52aWRlby53aWR0aCwgQHNwcml0ZS52aWRlby5oZWlnaHQpXG4gICAgICAgICAgICAgICAgaWYgbm90IEBvYmplY3QuZml4ZWRTaXplXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdCA9IG5ldyBSZWN0KEBvYmplY3QuZHN0UmVjdC54LCBAb2JqZWN0LmRzdFJlY3QueSwgQHNwcml0ZS52aWRlby53aWR0aCwgQHNwcml0ZS52aWRlby5oZWlnaHQpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBzcHJpdGUudmlkZW8/LnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGltYWdlIGlmIHRoZSBnYW1lIG9iamVjdCBoYXMgdGhlIGltYWdlLXByb3BlcnR5IHNldC5cbiAgICAqIEBtZXRob2QgdXBkYXRlSW1hZ2VcbiAgICAjIyNcbiAgICB1cGRhdGVJbWFnZTogLT5cbiAgICAgICAgaWYgQG9iamVjdC5pbWFnZT9cbiAgICAgICAgICAgIGlmIEBvYmplY3QuaW1hZ2UgIT0gQGltYWdlIG9yICghQGltYWdlTG9hZGVkIGFuZCBAc3ByaXRlLmJpdG1hcD8ubG9hZGVkKVxuICAgICAgICAgICAgICAgIEB1cGRhdGVCaXRtYXAoKVxuICAgICAgICAgICAgICAgIEB1cGRhdGVSZWN0KClcbiAgICAgICAgZWxzZSBpZiBAb2JqZWN0LmJpdG1hcD8gICAgXG4gICAgICAgICAgICBAc3ByaXRlLmJpdG1hcCA9IEBvYmplY3QuYml0bWFwXG4gICAgICAgIGVsc2UgaWYgQG9iamVjdC52aWRlbz8gb3IgQHZpZGVvTmFtZSAhPSBAb2JqZWN0LnZpZGVvXG4gICAgICAgICAgICBAdXBkYXRlVmlkZW8oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaW1hZ2UgPSBudWxsXG4gICAgICAgICAgICBAb2JqZWN0LmJpdG1hcCA9IG51bGxcbiAgICAgICAgICAgIEBzcHJpdGUuYml0bWFwID0gbnVsbFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogSWYgdGhlIHNwcml0ZSBpcyB1bm1hbmFnZWQsIHRoaXMgbWV0aG9kIHdpbGwgdXBkYXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZVxuICAgICogc3ByaXRlLiBJZiB0aGUgc3ByaXRlIGxlYXZlcyB0aGUgdmlld3BvcnQsIGl0IHdpbGwgYmUgcmVtb3ZlZCB0byBzYXZlIFxuICAgICogcGVyZm9ybWFuY2UgYW5kIGF1dG9tYXRpY2FsbHkgYWRkZWQgYmFjayB0byB0aGUgdmlld3BvcnQgaWYgaXQgZW50ZXJzXG4gICAgKiB0aGUgdmlld3BvcnQuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVZpc2liaWxpdHlcbiAgICAjIyNcbiAgICB1cGRhdGVWaXNpYmlsaXR5OiAtPlxuICAgICAgICBpZiAhQHNwcml0ZS5tYW5hZ2VkXG4gICAgICAgICAgICB2aXNpYmxlID0gUmVjdC5pbnRlcnNlY3QoQG9iamVjdC5kc3RSZWN0LngrQG9iamVjdC5vcmlnaW4ueCwgQG9iamVjdC5kc3RSZWN0LnkrQG9iamVjdC5vcmlnaW4ueSwgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCBHcmFwaGljcy53aWR0aCwgR3JhcGhpY3MuaGVpZ2h0KVxuICAgICAgICAgICAgaWYgdmlzaWJsZSBhbmQgIUB2aXNpYmxlXG4gICAgICAgICAgICAgICAgKEBvYmplY3Qudmlld3BvcnQgfHwgR3JhcGhpY3Mudmlld3BvcnQpLmFkZEdyYXBoaWNPYmplY3QoQHNwcml0ZSlcbiAgICAgICAgICAgICAgICBAdmlzaWJsZSA9IHllc1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgIXZpc2libGUgYW5kIEB2aXNpYmxlXG4gICAgICAgICAgICAgICAgKEBvYmplY3Qudmlld3BvcnQgfHwgR3JhcGhpY3Mudmlld3BvcnQpLnJlbW92ZUdyYXBoaWNPYmplY3QoQHNwcml0ZSlcbiAgICAgICAgICAgICAgICBAdmlzaWJsZSA9IG5vXG4gICAgICAgICAgICAgICAgXG4gICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBwYWRkaW5nLlxuICAgICogQG1ldGhvZCB1cGRhdGVQYWRkaW5nXG4gICAgIyMjXG4gICAgdXBkYXRlUGFkZGluZzogLT5cbiAgICAgICAgaWYgQG9iamVjdC5wYWRkaW5nP1xuICAgICAgICAgICAgQHNwcml0ZS54ICs9IEBvYmplY3QucGFkZGluZy5sZWZ0XG4gICAgICAgICAgICBAc3ByaXRlLnkgKz0gQG9iamVjdC5wYWRkaW5nLnRvcFxuICAgICAgICAgICAgQHNwcml0ZS56b29tWCAtPSAoQG9iamVjdC5wYWRkaW5nLmxlZnQrQG9iamVjdC5wYWRkaW5nLnJpZ2h0KSAvIEBvYmplY3Quc3JjUmVjdC53aWR0aFxuICAgICAgICAgICAgQHNwcml0ZS56b29tWSAtPSAoQG9iamVjdC5wYWRkaW5nLmJvdHRvbStAb2JqZWN0LnBhZGRpbmcuYm90dG9tKSAvIEBvYmplY3Quc3JjUmVjdC5oZWlnaHRcbiAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3ByaXRlIHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqIEBtZXRob2QgdXBkYXRlUHJvcGVydGllc1xuICAgICMjI1xuICAgIHVwZGF0ZVByb3BlcnRpZXM6IC0+XG4gICAgICAgIEBzcHJpdGUud2lkdGggPSBAb2JqZWN0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgQHNwcml0ZS5oZWlnaHQgPSBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0XG4gICAgICAgIEBzcHJpdGUueCA9IEBvYmplY3QuZHN0UmVjdC54IFxuICAgICAgICBAc3ByaXRlLnkgPSBAb2JqZWN0LmRzdFJlY3QueVxuICAgICAgICBAc3ByaXRlLm1hc2sgPSBAb2JqZWN0Lm1hc2sgPyBAbWFza1xuICAgICAgICBAc3ByaXRlLmFuZ2xlID0gQG9iamVjdC5hbmdsZSB8fCAwXG4gICAgICAgIEBzcHJpdGUub3BhY2l0eSA9IEBvYmplY3Qub3BhY2l0eSA/IDI1NVxuICAgICAgICBAc3ByaXRlLmNsaXBSZWN0ID0gQG9iamVjdC5jbGlwUmVjdFxuICAgICAgICBAc3ByaXRlLnNyY1JlY3QgPSBAb2JqZWN0LnNyY1JlY3RcbiAgICAgICAgQHNwcml0ZS5ibGVuZGluZ01vZGUgPSBAb2JqZWN0LmJsZW5kTW9kZSB8fCAwXG4gICAgICAgIEBzcHJpdGUubWlycm9yID0gQG9iamVjdC5taXJyb3JcbiAgICAgICAgQHNwcml0ZS52aXNpYmxlID0gQG9iamVjdC52aXNpYmxlIGFuZCAoIUBvYmplY3QucGFyZW50IG9yICFAb2JqZWN0LnBhcmVudC52aXNpYmxlPyBvciBAb2JqZWN0LnBhcmVudC52aXNpYmxlKVxuICAgICAgICBAc3ByaXRlLm94ID0gLUBvYmplY3Qub3JpZ2luLnhcbiAgICAgICAgQHNwcml0ZS5veSA9IC1Ab2JqZWN0Lm9yaWdpbi55XG4gICAgICAgIEBzcHJpdGUueiA9IChAb2JqZWN0LnpJbmRleCB8fCAwKSArIChpZiAhQG9iamVjdC5wYXJlbnQgdGhlbiAwIGVsc2UgQG9iamVjdC5wYXJlbnQuekluZGV4IHx8IDApXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG9wdGlvbmFsIHNwcml0ZSBwcm9wZXJ0aWVzIGZyb20gdGhlIGdhbWUgb2JqZWN0IHByb3BlcnRpZXMuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllc1xuICAgICMjI1xuICAgIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllczogLT5cbiAgICAgICAgaWYgQG9iamVjdC50b25lP1xuICAgICAgICAgICAgQHNwcml0ZS50b25lID0gQG9iamVjdC50b25lXG4gICAgICAgIGlmIEBvYmplY3QuY29sb3I/XG4gICAgICAgICAgICBAc3ByaXRlLmNvbG9yID0gQG9iamVjdC5jb2xvclxuICAgICAgICBpZiBAb2JqZWN0LnZpZXdwb3J0P1xuICAgICAgICAgICAgQHNwcml0ZS52aWV3cG9ydCA9IEBvYmplY3Qudmlld3BvcnRcbiAgICAgICAgaWYgQG9iamVjdC5lZmZlY3RzP1xuICAgICAgICAgICAgQHNwcml0ZS5lZmZlY3RzID0gQG9iamVjdC5lZmZlY3RzXG4gICAgICAgIGlmIEBvYmplY3QuYW5jaG9yP1xuICAgICAgICAgICAgQHNwcml0ZS5hbmNob3IueCA9IEBvYmplY3QuYW5jaG9yLnhcbiAgICAgICAgICAgIEBzcHJpdGUuYW5jaG9yLnkgPSBAb2JqZWN0LmFuY2hvci55XG4gICAgICAgIGlmIEBvYmplY3QucG9zaXRpb25BbmNob3I/XG4gICAgICAgICAgICBAc3ByaXRlLnBvc2l0aW9uQW5jaG9yID0gQG9iamVjdC5wb3NpdGlvbkFuY2hvclxuICAgICAgICBpZiBAb2JqZWN0Lnpvb20/XG4gICAgICAgICAgICBAc3ByaXRlLnpvb21YID0gQG9iamVjdC56b29tLnhcbiAgICAgICAgICAgIEBzcHJpdGUuem9vbVkgPSBAb2JqZWN0Lnpvb20ueVxuICAgICAgICBpZiBAb2JqZWN0Lm1vdGlvbkJsdXI/XG4gICAgICAgICAgICBAc3ByaXRlLm1vdGlvbkJsdXIgPSBAb2JqZWN0Lm1vdGlvbkJsdXJcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3ByaXRlIGNvbXBvbmVudCBieSB1cGRhdGluZyBpdHMgdmlzaWJpbGl0eSwgaW1hZ2UsIHBhZGRpbmcgYW5kXG4gICAgKiBwcm9wZXJ0aWVzLlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAc2V0dXAoKSBpZiBub3QgQGlzU2V0dXBcbiAgICAgICAgQHVwZGF0ZVZpc2liaWxpdHkoKVxuICAgICAgICBAdXBkYXRlSW1hZ2UoKVxuICAgICAgICBAdXBkYXRlUHJvcGVydGllcygpXG4gICAgICAgIEB1cGRhdGVPcHRpb25hbFByb3BlcnRpZXMoKVxuICAgICAgICBAdXBkYXRlUGFkZGluZygpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEBzcHJpdGUuaW5kZXhcbiAgICAgICAgQHNwcml0ZS51cGRhdGUoKVxuICAgICAgICBcblxuIyMjKlxuKiBFbnVtZXJhdGlvbiBvZiBhcHBlYXJhbmNlIGFuaW1hdGlvbnMuIFxuKlxuKiBAbW9kdWxlIGdzXG4qIEBjbGFzcyBBbmltYXRpb25UeXBlc1xuKiBAc3RhdGljXG4qIEBtZW1iZXJvZiBnc1xuIyMjXG5jbGFzcyBBbmltYXRpb25UeXBlc1xuICAgIEBpbml0aWFsaXplOiAtPiAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIG9iamVjdCBhcHBlYXJzIG9yIGRpc2FwcGVhcnMgYnkgbW92aW5nIGludG8gb3Igb3V0IG9mIHRoZSBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IE1PVkVNRU5UXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHN0YXRpY1xuICAgICAgICAqIEBmaW5hbFxuICAgICAgICAjIyNcbiAgICAgICAgQE1PVkVNRU5UID0gMFxuICAgICAgICAjIyMqXG4gICAgICAgICogQW4gb2JqZWN0IGFwcGVhcnMgb3IgZGlzYXBwZWFycyB1c2luZyBhbHBoYS1ibGVuZGluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgQkxFTkRJTkdcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBAQkxFTkRJTkcgPSAxXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBvYmplY3QgYXBwZWFycyBvciBkaXNhcHBlYXJzIHVzaW5nIGEgbWFzay1pbWFnZS5cbiAgICAgICAgKiBAcHJvcGVydHkgTUFTS0lOR1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBNQVNLSU5HID0gMlxuXG5BbmltYXRpb25UeXBlcy5pbml0aWFsaXplKCkgICAgXG5ncy5BbmltYXRpb25UeXBlcyA9IEFuaW1hdGlvblR5cGVzXG5ncy5Db21wb25lbnRfU3ByaXRlID0gQ29tcG9uZW50X1Nwcml0ZVxuIl19
//# sourceURL=Component_Sprite_61.js