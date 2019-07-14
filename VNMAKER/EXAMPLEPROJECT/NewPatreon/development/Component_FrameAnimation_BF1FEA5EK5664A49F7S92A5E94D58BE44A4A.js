var Component_FrameAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_FrameAnimation = (function(superClass) {
  extend(Component_FrameAnimation, superClass);


  /**
  * Executes a classic image-frame animation defined in Database. The image in regular
  * contains multiple sub-images (frames) which are then animated
  * by modifying the <b>srcRect</b> property of the game object.
  *
  * @module gs
  * @class Component_FrameAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
  * @param {Object} record - The animation database-record.
   */

  function Component_FrameAnimation(record) {
    Component_FrameAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The database record.
    * @property record
    * @type Object
     */
    this.record = null;

    /**
    * The name of the animation defined in Database.
    * @property name
    * @type string
     */
    this.name = null;

    /**
    * The amount of frames on x-axis.
    * @property framesX
    * @type number
     */
    this.framesX = 1;

    /**
    * The amount of frames on y-axis.
    * @property framesY
    * @type number
     */
    this.framesY = 1;

    /**
    * The frame-range to animation like only Frame 4 - 6 for example.
    * @property frameRange
    * @type gs.Range
     */
    this.frameRange = {
      start: 0,
      end: 0
    };

    /**
    * The frame-range used if the animation gets repeated.
    * @property repetitionFrameRange
    * @type gs.Range
     */
    this.repetitionFrameRange = this.frameRange;

    /**
    * The amount of frames to animate.
    * @property frameCount
    * @type number
    * @protected
     */
    this.frameCount = 1;

    /**
    * The graphic used as image for the animation.
    * @property graphic
    * @type Object
     */
    this.graphic = null;

    /**
    * Indicates if the animation repeats.
    * @property repeat
    * @type boolean
     */
    this.repeat = false;

    /**
    * The position of the animation on the target-object.
    * @property framesY
    * @type gs.AnimationPosition
     */
    this.position = 0;

    /**
    * The duration of a single frame.
    * @property frameDuration
    * @type number
    * @protected
     */
    this.frameDuration = 10;

    /**
    * A frame-counter needed for animation-process.
    * @property frameDuration
    * @type number
    * @protected
     */
    this.frameCounter = 0;

    /**
    * The duration of the animation.
    * @property frameDuration
    * @type number
     */
    this.duration = 10;

    /**
    * Indicates if the animation is currently running.
    * @property isRunning
    * @type boolean
     */
    this.isRunning = false;

    /**
    * Stores frame/pattern-offset.
    * @property patternOffset
    * @type number
    * @protected
     */
    this.patternOffset = this.frameRange.start;

    /**
    * Stores current frame/pattern
    * @property patternOffset
    * @type number
    * @protected
     */
    this.pattern = this.patternOffset;

    /**
    * Indicates if its still the first run of the animation.
    * @property firstRun
    * @type boolean
    * @protected
     */
    this.firstRun = true;
    if (record != null) {
      this.refresh(record);
      this.start();
    }
  }


  /**
  * Serializes the frame-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_FrameAnimation.prototype.toDataBundle = function() {
    return {
      name: this.name,
      framesX: this.framesX,
      framesY: this.framesY,
      frameRange: this.frameRange,
      repetitionFrameRange: this.repetitionFrameRange,
      frameCount: this.frameCount,
      graphic: this.graphic,
      repeat: this.repeat,
      position: this.position,
      frameDuration: this.frameDuration,
      frameCounter: this.frameCounter,
      duration: this.duration,
      isRunning: this.isRunning,
      patternOffset: this.patternOffset,
      pattern: this.pattern,
      firstRun: this.firstRun
    };
  };


  /**
  * Refreshes the animation from the specified database-record.
  *
  * @method refresh
  * @param {Object} record - The animation database-record.
   */

  Component_FrameAnimation.prototype.refresh = function(record) {

    /**
    * The images to animate through.
    * @property images
    * @type string[]
     */
    this.name = record.name;
    this.framesX = record.framesX || 1;
    this.framesY = record.framesY || 1;
    this.frameRange = {
      start: Math.min(record.frameRange.start, record.frameRange.end),
      end: Math.max(record.frameRange.start, record.frameRange.end)
    };
    this.repetitionFrameRange = record.useRepetitionFrameRange && (record.repetitionFrameRange != null) ? record.repetitionFrameRange : this.frameRange;
    this.frameCount = (this.frameRange.end - this.frameRange.start) + 1;
    this.graphic = record.graphic;
    this.repeat = record.repeat || false;
    this.position = record.position;
    this.frameDuration = record.duration != null ? Math.round(record.duration / this.frameCount) : 10;
    this.frameCounter = 0;
    this.duration = record.duration || 10;
    this.isRunning = false;
    this.patternOffset = this.frameRange.start;
    this.pattern = this.patternOffset;
    return this.firstRun = true;
  };


  /**
  * Starts the frame-animation.
  *
  * @method start
   */

  Component_FrameAnimation.prototype.start = function(callback) {
    this.callback = callback;
    this.isRunning = true;
    this.firstRun = true;
    this.frameCounter = 0;
    this.frameCount = (this.frameRange.end - this.frameRange.start) + 1;
    this.frameDuration = Math.round(this.duration / this.frameCount);
    return this.patternOffset = this.frameRange.start;
  };


  /**
  * Updates the frame-animation.
  *
  * @method update
   */

  Component_FrameAnimation.prototype.update = function() {
    var bitmap, column, frameHeight, frameWidth, row;
    Component_FrameAnimation.__super__.update.apply(this, arguments);
    if (!this.isRunning) {
      return;
    }
    if (this.frameCounter >= this.duration) {
      if (this.repeat) {
        this.firstRun = false;
        this.frameCounter = 0;
        this.frameCount = (this.repetitionFrameRange.end - this.repetitionFrameRange.start) + 1;
        this.frameDuration = Math.ceil(this.duration / this.frameCount);
        this.patternOffset = this.repetitionFrameRange.start;
      } else {
        this.isRunning = false;
        if (typeof this.onFinish === "function") {
          this.onFinish(this);
        }
        if (typeof this.callback === "function") {
          this.callback(this.object, this);
        }
        return;
      }
    }
    this.pattern = this.patternOffset + Math.floor(this.frameCounter / this.frameDuration);
    this.frameCounter++;
    if (this.object != null) {
      bitmap = this.object.bitmap || ResourceManager.getBitmap((this.object.imageFolder || "Graphics/Pictures") + "/" + this.object.image);
      if (bitmap != null) {
        frameWidth = Math.floor(bitmap.width / this.framesX);
        frameHeight = Math.floor(bitmap.height / this.framesY);
        column = this.pattern % this.framesX;
        row = Math.floor(this.pattern / this.framesX);
        this.object.srcRect.set(column * frameWidth, row * frameHeight, frameWidth, frameHeight);
        this.object.dstRect.width = this.object.srcRect.width;
        return this.object.dstRect.height = this.object.srcRect.height;
      }
    }
  };

  return Component_FrameAnimation;

})(gs.Component_Animation);

window.Component_FrameAnimation = Component_FrameAnimation;

gs.Component_FrameAnimation = Component_FrameAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7OztFQVlhLGtDQUFDLE1BQUQ7SUFDVCwyREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBUTs7QUFFUjs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXOztBQUVYOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUFFLEtBQUEsRUFBTyxDQUFUO01BQVksR0FBQSxFQUFLLENBQWpCOzs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBQyxDQUFBOztBQUV6Qjs7Ozs7O0lBTUEsSUFBQyxDQUFBLFVBQUQsR0FBYzs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXOztBQUVYOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7O0lBTUEsSUFBQyxDQUFBLGFBQUQsR0FBaUI7O0FBRWpCOzs7Ozs7SUFNQSxJQUFDLENBQUEsWUFBRCxHQUFnQjs7QUFFaEI7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7Ozs7SUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDOztBQUU3Qjs7Ozs7O0lBTUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUE7O0FBRVo7Ozs7OztJQU1BLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFFWixJQUFHLGNBQUg7TUFDSSxJQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQ7TUFDQSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBRko7O0VBaElTOzs7QUFvSWI7Ozs7OztxQ0FLQSxZQUFBLEdBQWMsU0FBQTtXQUNWO01BQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQUFQO01BQ0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQURWO01BRUEsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQUZWO01BR0EsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQUhiO01BSUEsb0JBQUEsRUFBc0IsSUFBQyxDQUFBLG9CQUp2QjtNQUtBLFVBQUEsRUFBWSxJQUFDLENBQUEsVUFMYjtNQU1BLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FOVjtNQU9BLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFQVDtNQVFBLFFBQUEsRUFBVSxJQUFDLENBQUEsUUFSWDtNQVNBLGFBQUEsRUFBZSxJQUFDLENBQUEsYUFUaEI7TUFVQSxZQUFBLEVBQWMsSUFBQyxDQUFBLFlBVmY7TUFXQSxRQUFBLEVBQVUsSUFBQyxDQUFBLFFBWFg7TUFZQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFNBWlo7TUFhQSxhQUFBLEVBQWUsSUFBQyxDQUFBLGFBYmhCO01BY0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxPQWRWO01BZUEsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQWZYOztFQURVOzs7QUFrQmQ7Ozs7Ozs7cUNBT0EsT0FBQSxHQUFTLFNBQUMsTUFBRDs7QUFDTDs7Ozs7SUFLQSxJQUFDLENBQUEsSUFBRCxHQUFRLE1BQU0sQ0FBQztJQUNmLElBQUMsQ0FBQSxPQUFELEdBQVcsTUFBTSxDQUFDLE9BQVAsSUFBa0I7SUFDN0IsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUMsT0FBUCxJQUFrQjtJQUM3QixJQUFDLENBQUEsVUFBRCxHQUFjO01BQUUsS0FBQSxFQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUEzQixFQUFrQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQXBELENBQVQ7TUFBbUUsR0FBQSxFQUFLLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUEzQixFQUFrQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQXBELENBQXhFOztJQUNkLElBQUMsQ0FBQSxvQkFBRCxHQUEyQixNQUFNLENBQUMsdUJBQVAsSUFBbUMscUNBQXRDLEdBQXdFLE1BQU0sQ0FBQyxvQkFBL0UsR0FBeUcsSUFBQyxDQUFBO0lBQ2xJLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosR0FBa0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUEvQixDQUFBLEdBQXdDO0lBQ3RELElBQUMsQ0FBQSxPQUFELEdBQVcsTUFBTSxDQUFDO0lBQ2xCLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBTSxDQUFDLE1BQVAsSUFBaUI7SUFDM0IsSUFBQyxDQUFBLFFBQUQsR0FBWSxNQUFNLENBQUM7SUFFbkIsSUFBQyxDQUFBLGFBQUQsR0FBb0IsdUJBQUgsR0FBeUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFNLENBQUMsUUFBUCxHQUFrQixJQUFDLENBQUEsVUFBOUIsQ0FBekIsR0FBd0U7SUFDekYsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFDaEIsSUFBQyxDQUFBLFFBQUQsR0FBWSxNQUFNLENBQUMsUUFBUCxJQUFtQjtJQUMvQixJQUFDLENBQUEsU0FBRCxHQUFhO0lBQ2IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQztJQUM3QixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQTtXQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7RUF0QlA7OztBQXdCVDs7Ozs7O3FDQUtBLEtBQUEsR0FBTyxTQUFDLFFBQUQ7SUFDSCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLEdBQWtCLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBL0IsQ0FBQSxHQUF3QztJQUN0RCxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFVBQXhCO1dBQ2pCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUM7RUFQMUI7OztBQVNQOzs7Ozs7cUNBS0EsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEsc0RBQUEsU0FBQTtJQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsU0FBUjtBQUF1QixhQUF2Qjs7SUFFQSxJQUFHLElBQUMsQ0FBQSxZQUFELElBQWlCLElBQUMsQ0FBQSxRQUFyQjtNQUNJLElBQUcsSUFBQyxDQUFBLE1BQUo7UUFDSSxJQUFDLENBQUEsUUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLFlBQUQsR0FBZ0I7UUFDaEIsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFDLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxHQUF0QixHQUE0QixJQUFDLENBQUEsb0JBQW9CLENBQUMsS0FBbkQsQ0FBQSxHQUE0RDtRQUMxRSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFVBQXZCO1FBQ2pCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUwzQztPQUFBLE1BQUE7UUFPSSxJQUFDLENBQUEsU0FBRCxHQUFhOztVQUNiLElBQUMsQ0FBQSxTQUFVOzs7VUFDWCxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUTs7QUFDcEIsZUFWSjtPQURKOztJQWFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsYUFBNUI7SUFDNUIsSUFBQyxDQUFBLFlBQUQ7SUFFQSxJQUFHLG1CQUFIO01BQ0ksTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixJQUFrQixlQUFlLENBQUMsU0FBaEIsQ0FBNEIsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsSUFBcUIsbUJBQXRCLENBQUEsR0FBMEMsR0FBMUMsR0FBNkMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFqRjtNQUUzQixJQUFHLGNBQUg7UUFDSSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFNLENBQUMsS0FBUCxHQUFlLElBQUMsQ0FBQSxPQUEzQjtRQUNiLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLElBQUMsQ0FBQSxPQUE1QjtRQUNkLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQTtRQUNyQixHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUF2QjtRQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQWhCLENBQW9CLE1BQUEsR0FBUyxVQUE3QixFQUF5QyxHQUFBLEdBQU0sV0FBL0MsRUFBNEQsVUFBNUQsRUFBd0UsV0FBeEU7UUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFoQixHQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQztlQUN4QyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFoQixHQUF5QixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQVA3QztPQUhKOztFQXBCSTs7OztHQTFOMkIsRUFBRSxDQUFDOztBQTJQMUMsTUFBTSxDQUFDLHdCQUFQLEdBQWtDOztBQUNsQyxFQUFFLENBQUMsd0JBQUgsR0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9GcmFtZUFuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBGSVhNRTogVGhpcyBjbGFzcyBzdGlsbCBmb2xsb3dzIGRlcHJlY2F0ZWQgcnVsZXMsIHNob3VsZCBiZSBmaXhlZC5cbmNsYXNzIENvbXBvbmVudF9GcmFtZUFuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhIGNsYXNzaWMgaW1hZ2UtZnJhbWUgYW5pbWF0aW9uIGRlZmluZWQgaW4gRGF0YWJhc2UuIFRoZSBpbWFnZSBpbiByZWd1bGFyXG4gICAgKiBjb250YWlucyBtdWx0aXBsZSBzdWItaW1hZ2VzIChmcmFtZXMpIHdoaWNoIGFyZSB0aGVuIGFuaW1hdGVkXG4gICAgKiBieSBtb2RpZnlpbmcgdGhlIDxiPnNyY1JlY3Q8L2I+IHByb3BlcnR5IG9mIHRoZSBnYW1lIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0ZyYW1lQW5pbWF0aW9uXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtIHtPYmplY3R9IHJlY29yZCAtIFRoZSBhbmltYXRpb24gZGF0YWJhc2UtcmVjb3JkLlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAocmVjb3JkKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBkYXRhYmFzZSByZWNvcmQuXG4gICAgICAgICogQHByb3BlcnR5IHJlY29yZFxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQHJlY29yZCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIGRlZmluZWQgaW4gRGF0YWJhc2UuXG4gICAgICAgICogQHByb3BlcnR5IG5hbWVcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBuYW1lID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBhbW91bnQgb2YgZnJhbWVzIG9uIHgtYXhpcy5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVzWFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lc1ggPSAxXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGFtb3VudCBvZiBmcmFtZXMgb24geS1heGlzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBmcmFtZXNZXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAZnJhbWVzWSA9IDFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZnJhbWUtcmFuZ2UgdG8gYW5pbWF0aW9uIGxpa2Ugb25seSBGcmFtZSA0IC0gNiBmb3IgZXhhbXBsZS5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVSYW5nZVxuICAgICAgICAqIEB0eXBlIGdzLlJhbmdlXG4gICAgICAgICMjI1xuICAgICAgICBAZnJhbWVSYW5nZSA9IHsgc3RhcnQ6IDAsIGVuZDogMCB9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGZyYW1lLXJhbmdlIHVzZWQgaWYgdGhlIGFuaW1hdGlvbiBnZXRzIHJlcGVhdGVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXBldGl0aW9uRnJhbWVSYW5nZVxuICAgICAgICAqIEB0eXBlIGdzLlJhbmdlXG4gICAgICAgICMjI1xuICAgICAgICBAcmVwZXRpdGlvbkZyYW1lUmFuZ2UgPSBAZnJhbWVSYW5nZVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBhbW91bnQgb2YgZnJhbWVzIHRvIGFuaW1hdGUuXG4gICAgICAgICogQHByb3BlcnR5IGZyYW1lQ291bnRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAZnJhbWVDb3VudCA9IDFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZ3JhcGhpYyB1c2VkIGFzIGltYWdlIGZvciB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBncmFwaGljXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAZ3JhcGhpYyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGFuaW1hdGlvbiByZXBlYXRzLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXBlYXRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAcmVwZWF0ID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgcG9zaXRpb24gb2YgdGhlIGFuaW1hdGlvbiBvbiB0aGUgdGFyZ2V0LW9iamVjdC5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVzWVxuICAgICAgICAqIEB0eXBlIGdzLkFuaW1hdGlvblBvc2l0aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAcG9zaXRpb24gPSAwXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBkdXJhdGlvbiBvZiBhIHNpbmdsZSBmcmFtZS5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVEdXJhdGlvblxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBmcmFtZUR1cmF0aW9uID0gMTBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBIGZyYW1lLWNvdW50ZXIgbmVlZGVkIGZvciBhbmltYXRpb24tcHJvY2Vzcy5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVEdXJhdGlvblxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBmcmFtZUNvdW50ZXIgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGZyYW1lRHVyYXRpb25cbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBkdXJhdGlvbiA9IDEwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBhbmltYXRpb24gaXMgY3VycmVudGx5IHJ1bm5pbmcuXG4gICAgICAgICogQHByb3BlcnR5IGlzUnVubmluZ1xuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBmcmFtZS9wYXR0ZXJuLW9mZnNldC5cbiAgICAgICAgKiBAcHJvcGVydHkgcGF0dGVybk9mZnNldFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBwYXR0ZXJuT2Zmc2V0ID0gQGZyYW1lUmFuZ2Uuc3RhcnRcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgY3VycmVudCBmcmFtZS9wYXR0ZXJuXG4gICAgICAgICogQHByb3BlcnR5IHBhdHRlcm5PZmZzZXRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAcGF0dGVybiA9IEBwYXR0ZXJuT2Zmc2V0XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIGl0cyBzdGlsbCB0aGUgZmlyc3QgcnVuIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGZpcnN0UnVuXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBmaXJzdFJ1biA9IHllc1xuICAgICAgICBcbiAgICAgICAgaWYgcmVjb3JkP1xuICAgICAgICAgICAgQHJlZnJlc2gocmVjb3JkKVxuICAgICAgICAgICAgQHN0YXJ0KClcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgZnJhbWUtYW5pbWF0aW9uIGludG8gYSBkYXRhLWJ1bmRsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHRvRGF0YUJ1bmRsZVxuICAgICMjIyAgIFxuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgbmFtZTogQG5hbWUsXG4gICAgICAgIGZyYW1lc1g6IEBmcmFtZXNYLFxuICAgICAgICBmcmFtZXNZOiBAZnJhbWVzWSxcbiAgICAgICAgZnJhbWVSYW5nZTogQGZyYW1lUmFuZ2UsXG4gICAgICAgIHJlcGV0aXRpb25GcmFtZVJhbmdlOiBAcmVwZXRpdGlvbkZyYW1lUmFuZ2UsXG4gICAgICAgIGZyYW1lQ291bnQ6IEBmcmFtZUNvdW50LFxuICAgICAgICBncmFwaGljOiBAZ3JhcGhpYyxcbiAgICAgICAgcmVwZWF0OiBAcmVwZWF0LFxuICAgICAgICBwb3NpdGlvbjogQHBvc2l0aW9uLFxuICAgICAgICBmcmFtZUR1cmF0aW9uOiBAZnJhbWVEdXJhdGlvbixcbiAgICAgICAgZnJhbWVDb3VudGVyOiBAZnJhbWVDb3VudGVyLFxuICAgICAgICBkdXJhdGlvbjogQGR1cmF0aW9uLFxuICAgICAgICBpc1J1bm5pbmc6IEBpc1J1bm5pbmcsXG4gICAgICAgIHBhdHRlcm5PZmZzZXQ6IEBwYXR0ZXJuT2Zmc2V0LFxuICAgICAgICBwYXR0ZXJuOiBAcGF0dGVybixcbiAgICAgICAgZmlyc3RSdW46IEBmaXJzdFJ1blxuICAgICBcbiAgICAjIyMqXG4gICAgKiBSZWZyZXNoZXMgdGhlIGFuaW1hdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgZGF0YWJhc2UtcmVjb3JkLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVmcmVzaFxuICAgICogQHBhcmFtIHtPYmplY3R9IHJlY29yZCAtIFRoZSBhbmltYXRpb24gZGF0YWJhc2UtcmVjb3JkLlxuICAgICMjIyAgXG4gICAgIyBGSVhNRTogSXMgdGhhdCBtZXRob2Qgc3RpbGwgaW4gdXNlP1xuICAgIHJlZnJlc2g6IChyZWNvcmQpIC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgaW1hZ2VzIHRvIGFuaW1hdGUgdGhyb3VnaC5cbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VzXG4gICAgICAgICogQHR5cGUgc3RyaW5nW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBuYW1lID0gcmVjb3JkLm5hbWVcbiAgICAgICAgQGZyYW1lc1ggPSByZWNvcmQuZnJhbWVzWCB8fCAxXG4gICAgICAgIEBmcmFtZXNZID0gcmVjb3JkLmZyYW1lc1kgfHwgMVxuICAgICAgICBAZnJhbWVSYW5nZSA9IHsgc3RhcnQ6IE1hdGgubWluKHJlY29yZC5mcmFtZVJhbmdlLnN0YXJ0LCByZWNvcmQuZnJhbWVSYW5nZS5lbmQpLCBlbmQ6IE1hdGgubWF4KHJlY29yZC5mcmFtZVJhbmdlLnN0YXJ0LCByZWNvcmQuZnJhbWVSYW5nZS5lbmQpIH1cbiAgICAgICAgQHJlcGV0aXRpb25GcmFtZVJhbmdlID0gaWYgcmVjb3JkLnVzZVJlcGV0aXRpb25GcmFtZVJhbmdlIGFuZCByZWNvcmQucmVwZXRpdGlvbkZyYW1lUmFuZ2U/IHRoZW4gcmVjb3JkLnJlcGV0aXRpb25GcmFtZVJhbmdlIGVsc2UgQGZyYW1lUmFuZ2VcbiAgICAgICAgQGZyYW1lQ291bnQgPSAoQGZyYW1lUmFuZ2UuZW5kIC0gQGZyYW1lUmFuZ2Uuc3RhcnQpICsgMVxuICAgICAgICBAZ3JhcGhpYyA9IHJlY29yZC5ncmFwaGljXG4gICAgICAgIEByZXBlYXQgPSByZWNvcmQucmVwZWF0IHx8IG5vXG4gICAgICAgIEBwb3NpdGlvbiA9IHJlY29yZC5wb3NpdGlvblxuXG4gICAgICAgIEBmcmFtZUR1cmF0aW9uID0gaWYgcmVjb3JkLmR1cmF0aW9uPyB0aGVuIE1hdGgucm91bmQocmVjb3JkLmR1cmF0aW9uIC8gQGZyYW1lQ291bnQpIGVsc2UgMTBcbiAgICAgICAgQGZyYW1lQ291bnRlciA9IDBcbiAgICAgICAgQGR1cmF0aW9uID0gcmVjb3JkLmR1cmF0aW9uIHx8IDEwXG4gICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICBAcGF0dGVybk9mZnNldCA9IEBmcmFtZVJhbmdlLnN0YXJ0XG4gICAgICAgIEBwYXR0ZXJuID0gQHBhdHRlcm5PZmZzZXRcbiAgICAgICAgQGZpcnN0UnVuID0geWVzXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyB0aGUgZnJhbWUtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAjIyMgICBcbiAgICBzdGFydDogKGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgIEBmaXJzdFJ1biA9IHllc1xuICAgICAgICBAZnJhbWVDb3VudGVyID0gMFxuICAgICAgICBAZnJhbWVDb3VudCA9IChAZnJhbWVSYW5nZS5lbmQgLSBAZnJhbWVSYW5nZS5zdGFydCkgKyAxXG4gICAgICAgIEBmcmFtZUR1cmF0aW9uID0gTWF0aC5yb3VuZChAZHVyYXRpb24gLyBAZnJhbWVDb3VudClcbiAgICAgICAgQHBhdHRlcm5PZmZzZXQgPSBAZnJhbWVSYW5nZS5zdGFydFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBmcmFtZS1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIGlmIG5vdCBAaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAZnJhbWVDb3VudGVyID49IEBkdXJhdGlvblxuICAgICAgICAgICAgaWYgQHJlcGVhdFxuICAgICAgICAgICAgICAgIEBmaXJzdFJ1biA9IG5vXG4gICAgICAgICAgICAgICAgQGZyYW1lQ291bnRlciA9IDBcbiAgICAgICAgICAgICAgICBAZnJhbWVDb3VudCA9IChAcmVwZXRpdGlvbkZyYW1lUmFuZ2UuZW5kIC0gQHJlcGV0aXRpb25GcmFtZVJhbmdlLnN0YXJ0KSArIDFcbiAgICAgICAgICAgICAgICBAZnJhbWVEdXJhdGlvbiA9IE1hdGguY2VpbChAZHVyYXRpb24gLyBAZnJhbWVDb3VudClcbiAgICAgICAgICAgICAgICBAcGF0dGVybk9mZnNldCA9IEByZXBldGl0aW9uRnJhbWVSYW5nZS5zdGFydFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICAgICAgICAgIEBvbkZpbmlzaD8odGhpcylcbiAgICAgICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgQHBhdHRlcm4gPSBAcGF0dGVybk9mZnNldCArIE1hdGguZmxvb3IoQGZyYW1lQ291bnRlciAvIEBmcmFtZUR1cmF0aW9uKSBcbiAgICAgICAgQGZyYW1lQ291bnRlcisrXG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0P1xuICAgICAgICAgICAgYml0bWFwID0gQG9iamVjdC5iaXRtYXAgfHwgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIiN7QG9iamVjdC5pbWFnZUZvbGRlcnx8XCJHcmFwaGljcy9QaWN0dXJlc1wifS8je0BvYmplY3QuaW1hZ2V9XCIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGJpdG1hcD9cbiAgICAgICAgICAgICAgICBmcmFtZVdpZHRoID0gTWF0aC5mbG9vcihiaXRtYXAud2lkdGggLyBAZnJhbWVzWClcbiAgICAgICAgICAgICAgICBmcmFtZUhlaWdodCA9IE1hdGguZmxvb3IoYml0bWFwLmhlaWdodCAvIEBmcmFtZXNZKVxuICAgICAgICAgICAgICAgIGNvbHVtbiA9IEBwYXR0ZXJuICUgQGZyYW1lc1hcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKEBwYXR0ZXJuIC8gQGZyYW1lc1gpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5zcmNSZWN0LnNldChjb2x1bW4gKiBmcmFtZVdpZHRoLCByb3cgKiBmcmFtZUhlaWdodCwgZnJhbWVXaWR0aCwgZnJhbWVIZWlnaHQpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5zcmNSZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LmhlaWdodCA9IEBvYmplY3Quc3JjUmVjdC5oZWlnaHRcbiAgICAgICAgICAgICAgICBcblxud2luZG93LkNvbXBvbmVudF9GcmFtZUFuaW1hdGlvbiA9IENvbXBvbmVudF9GcmFtZUFuaW1hdGlvblxuZ3MuQ29tcG9uZW50X0ZyYW1lQW5pbWF0aW9uID0gQ29tcG9uZW50X0ZyYW1lQW5pbWF0aW9uIl19
//# sourceURL=Component_FrameAnimation_103.js