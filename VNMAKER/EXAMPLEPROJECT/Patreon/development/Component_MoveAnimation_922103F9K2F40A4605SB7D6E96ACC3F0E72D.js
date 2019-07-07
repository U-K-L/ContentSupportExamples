var Component_MoveAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_MoveAnimation = (function(superClass) {
  extend(Component_MoveAnimation, superClass);


  /**
  * Executes a move-animation on a game-object.
  *
  * @module gs
  * @class Component_MoveAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_MoveAnimation(data) {
    Component_MoveAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);

    /**
    * The move-animation type (move-in, move-out, etc.).
    * @property animationType
    * @type gs.MoveAnimationType
     */
    this.animationType = (data != null ? data.animationType : void 0) || 0;
  }


  /**
  * Serializes the move-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_MoveAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      animationType: this.animationType
    };
  };


  /**
  * Updates the move-animation.
  *
  * @method update
   */

  Component_MoveAnimation.prototype.update = function() {
    Component_MoveAnimation.__super__.update.call(this);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updatePosition();
    this.updateCoordinates();
    if (!this.easing.isRunning) {
      if (!this.easing.isEndless) {
        this.object.dstRect.x = Math.round(this.object.dstRect.x);
        this.object.dstRect.y = Math.round(this.object.dstRect.y);
      }
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Updates the game object's coordinates depending on animation type.
  *
  * @method updateCoordinates
  * @protected
   */

  Component_MoveAnimation.prototype.updateCoordinates = function() {
    switch (this.animationType) {
      case 0:
        this.object.offset.x = Math.floor(this.easing.x);
        return this.object.offset.y = Math.floor(this.easing.y);
      case 1:
        this.object.dstRect.x = Math.floor(this.easing.x);
        return this.object.dstRect.y = Math.floor(this.easing.y);
      case 2:
        this.object.visual.scroll.x = Math.round(this.easing.x);
        return this.object.visual.scroll.y = Math.round(this.easing.y);
    }
  };


  /**
  * Scrolls the game object's content with a specified speed if supported.
  *
  * @method scroll
  * @param {number} speedX The speed on x-axis in pixels per frame.
  * @param {number} speedY The speed on y-axis in pixels per frame.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type used for the animation.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.scroll = function(speedX, speedY, duration, easingType, callback) {
    this.move(speedX, speedY, duration, easingType, callback);
    return this.animationType = 2;
  };


  /**
  * Scrolls the game object to a specified position.
  *
  * @method scrollTo
  * @param {number} x The x-coordinate of the position.
  * @param {number} y The y-coordinate of the position.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.scrollTo = function(x, y, duration, easingType, callback) {
    this.animationType = 2;
    this.callback = callback;
    if (this.object.visual.scroll.x === x && this.object.visual.scroll.y === y) {
      return;
    }
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (duration === 0 || this.isInstantSkip()) {
      this.object.visual.scroll.x = x;
      this.object.visual.scroll.y = y;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.easing.start(this.object.visual.scroll.x, this.object.visual.scroll.y, x, y, duration);
      this.targetX = x;
      return this.targetY = y;
    }
  };


  /**
  * Moves the game object with a specified speed.
  *
  * @method move
  * @param {number} speedX The speed on x-axis in pixels per frame.
  * @param {number} speedY The speed on y-axis in pixels per frame.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type used for the animation.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.move = function(speedX, speedY, duration, easingType, callback) {
    this.animationType = 1;
    this.targetX = duration * speedX;
    this.targetY = duration * speedY;
    this.callback = callback;
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (duration === 0 || this.isInstantSkip()) {
      return this.easing.startEndless(speedX, speedY);
    } else {
      return this.easing.start(this.object.dstRect.x, this.object.dstRect.y, this.targetX, this.targetY, duration);
    }
  };


  /**
  * Moves the game object to a specified position.
  *
  * @method moveTo
  * @param {number} x The x-coordinate of the position.
  * @param {number} y The y-coordinate of the position.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.moveTo = function(x, y, duration, easingType, callback) {
    this.animationType = 1;
    this.callback = callback;
    if (this.object.dstRect.x === x && this.object.dstRect.y === y) {
      return;
    }
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (duration === 0 || this.isInstantSkip()) {
      this.easing.x = x;
      this.easing.y = y;
      return this.updateCoordinates();
    } else {
      this.easing.start(this.object.dstRect.x, this.object.dstRect.y, x, y, duration);
      this.targetX = x;
      return this.targetY = y;
    }
  };


  /**
  * Lets a game object appear on screen from left, top, right or bottom using 
  * a move-animation
  *
  * @method moveIn
  * @param {number} x The x-coordinate of the target-position.
  * @param {number} y The y-coordinate of the target-position.
  * @param {number} type The movement-direction from where the game object should move-in.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.moveIn = function(x, y, type, duration, easing, callback) {
    var height, rect, width;
    this.animationType = 0;
    this.object.offset.x = 0;
    this.object.offset.y = 0;
    if (duration === 0 || this.isInstantSkip()) {
      this.object.update();
      return typeof callback === "function" ? callback(this.object, this) : void 0;
    }
    this.easing.type = easing;
    this.callback = callback;
    rect = this.object.angle != null ? this.object.dstRect.rotate(this.object.angle) : this.object.dstRect;
    width = rect.width * this.object.zoom.x;
    height = rect.height * this.object.zoom.y;
    x = this.object.dstRect.x - (width - rect.width) * this.object.anchor.x;
    y = this.object.dstRect.y - (height - rect.height) * this.object.anchor.y;
    switch (type) {
      case 0:
        this.object.offset.y = 0;
        this.object.offset.x = -(x + width + this.object.origin.x);
        break;
      case 1:
        this.object.offset.y = -(y + height + this.object.origin.y);
        this.object.offset.x = 0;
        break;
      case 2:
        this.object.offset.x = (this.object.viewport || Graphics.viewport).rect.width - x;
        this.object.offset.y = 0;
        break;
      case 3:
        this.object.offset.x = 0;
        this.object.offset.y = (this.object.viewport || Graphics.viewport).rect.height - y;
    }
    this.object.update();
    return this.easing.start(this.object.offset.x, this.object.offset.y, 0, 0, duration);
  };


  /**
  * Lets a game object disappear from screen to the left, top, right or bottom using 
  * a move-animation
  *
  * @method moveOut
  * @param {number} type The movement-direction in which the game object should move-out.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MoveAnimation.prototype.moveOut = function(type, duration, easing, callback) {
    var height, rect, viewport, width, x, y;
    this.animationType = 0;
    this.easing.type = easing;
    this.callback = callback;
    x = 0;
    y = 0;
    viewport = Graphics.viewport;
    rect = this.object.angle != null ? this.object.dstRect.rotate(this.object.angle) : this.object.dstRect;
    width = rect.width * this.object.zoom.x;
    height = rect.height * this.object.zoom.y;
    x = this.object.dstRect.x - (width - rect.width) * this.object.anchor.x;
    y = this.object.dstRect.y - (height - rect.height) * this.object.anchor.y;
    switch (type) {
      case 0:
        x = -(this.object.origin.x + x + width);
        y = 0;
        break;
      case 1:
        y = -(this.object.origin.y + y + height);
        x = 0;
        break;
      case 2:
        x = (this.object.viewport || Graphics.viewport).rect.width;
        y = 0;
        break;
      case 3:
        y = (this.object.viewport || Graphics.viewport).rect.height;
        x = 0;
    }
    if (duration === 0 || this.isInstantSkip()) {
      this.object.offset.x = x;
      this.object.offset.y = y;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.start(this.object.offset.x, this.object.offset.y, x, y, duration);
    }
  };

  return Component_MoveAnimation;

})(gs.Component_Animation);

gs.Component_MoveAnimation = Component_MoveAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGlDQUFDLElBQUQ7SUFDVCwwREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsaUJBQWdCLElBQUksQ0FBRSxlQUF0Qjs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsYUFBRCxtQkFBaUIsSUFBSSxDQUFFLHVCQUFOLElBQXVCO0VBZi9COzs7QUFpQmI7Ozs7OztvQ0FLQSxZQUFBLEdBQWMsU0FBQTtXQUNWO01BQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUFUO01BQ0EsYUFBQSxFQUFlLElBQUMsQ0FBQSxhQURoQjs7RUFEVTs7O0FBSWQ7Ozs7OztvQ0FLQSxNQUFBLEdBQVEsU0FBQTtJQUNKLGtEQUFBO0lBQ0EsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtBQUE4QixhQUE5Qjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQTtJQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBRUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtNQUNJLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFoQixHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQTNCO1FBQ3BCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQWhCLEdBQW9CLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBM0IsRUFGeEI7O21EQUdBLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFR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QUEsYUFBRCxDQUFBLENBQXBCO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBZixHQUFtQjtNQUNuQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFmLEdBQW1CO21EQUNuQixJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUh4QjtLQUFBLE1BQUE7YUFLSSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUE3QixFQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUEvQyxFQUFrRCxDQUFsRCxFQUFxRCxDQUFyRCxFQUF3RCxRQUF4RCxFQUxKOztFQW5DSzs7OztHQXhOeUIsRUFBRSxDQUFDOztBQWtRekMsRUFBRSxDQUFDLHVCQUFILEdBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfTW92ZUFuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X01vdmVBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBtb3ZlLWFuaW1hdGlvbiBvbiBhIGdhbWUtb2JqZWN0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfTW92ZUFuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGVhc2luZy1vYmplY3QgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgZWFzaW5nXG4gICAgICAgICogQHR5cGUgZ3MuRWFzaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAZWFzaW5nID0gbmV3IGdzLkVhc2luZyhudWxsLCBkYXRhPy5lYXNpbmcpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG1vdmUtYW5pbWF0aW9uIHR5cGUgKG1vdmUtaW4sIG1vdmUtb3V0LCBldGMuKS5cbiAgICAgICAgKiBAcHJvcGVydHkgYW5pbWF0aW9uVHlwZVxuICAgICAgICAqIEB0eXBlIGdzLk1vdmVBbmltYXRpb25UeXBlXG4gICAgICAgICMjI1xuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IGRhdGE/LmFuaW1hdGlvblR5cGUgfHwgMFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSBtb3ZlLWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgICBcbiAgICB0b0RhdGFCdW5kbGU6IC0+XG4gICAgICAgIGVhc2luZzogQGVhc2luZyxcbiAgICAgICAgYW5pbWF0aW9uVHlwZTogQGFuaW1hdGlvblR5cGVcbiAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgbW92ZS1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAZWFzaW5nLnVwZGF0ZVBvc2l0aW9uKClcbiAgICAgICAgXG4gICAgICAgIEB1cGRhdGVDb29yZGluYXRlcygpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nXG4gICAgICAgICAgICBpZiBub3QgQGVhc2luZy5pc0VuZGxlc3NcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QueCA9IE1hdGgucm91bmQoQG9iamVjdC5kc3RSZWN0LngpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnkgPSBNYXRoLnJvdW5kKEBvYmplY3QuZHN0UmVjdC55KVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBnYW1lIG9iamVjdCdzIGNvb3JkaW5hdGVzIGRlcGVuZGluZyBvbiBhbmltYXRpb24gdHlwZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUNvb3JkaW5hdGVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICB1cGRhdGVDb29yZGluYXRlczogLT5cbiAgICAgICAgc3dpdGNoIEBhbmltYXRpb25UeXBlXG4gICAgICAgICAgICB3aGVuIDBcbiAgICAgICAgICAgICAgICBAb2JqZWN0Lm9mZnNldC54ID0gTWF0aC5mbG9vcihAZWFzaW5nLngpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IE1hdGguZmxvb3IoQGVhc2luZy55KVxuICAgICAgICAgICAgd2hlbiAxXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnggPSBNYXRoLmZsb29yKEBlYXNpbmcueClcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QueSA9IE1hdGguZmxvb3IoQGVhc2luZy55KVxuICAgICAgICAgICAgd2hlbiAyXG4gICAgICAgICAgICAgICAgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnggPSBNYXRoLnJvdW5kKEBlYXNpbmcueClcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnZpc3VhbC5zY3JvbGwueSA9IE1hdGgucm91bmQoQGVhc2luZy55KVxuICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNjcm9sbHMgdGhlIGdhbWUgb2JqZWN0J3MgY29udGVudCB3aXRoIGEgc3BlY2lmaWVkIHNwZWVkIGlmIHN1cHBvcnRlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNjcm9sbFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkWCBUaGUgc3BlZWQgb24geC1heGlzIGluIHBpeGVscyBwZXIgZnJhbWUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRZIFRoZSBzcGVlZCBvbiB5LWF4aXMgaW4gcGl4ZWxzIHBlciBmcmFtZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlIHVzZWQgZm9yIHRoZSBhbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrLWZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuXG4gICAgIyMjICBcbiAgICBzY3JvbGw6IChzcGVlZFgsIHNwZWVkWSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAbW92ZShzcGVlZFgsIHNwZWVkWSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKVxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDJcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2Nyb2xscyB0aGUgZ2FtZSBvYmplY3QgdG8gYSBzcGVjaWZpZWQgcG9zaXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBzY3JvbGxUb1xuICAgICogQHBhcmFtIHtudW1iZXJ9IHggVGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjay1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLlxuICAgICMjIyAgICAgIFxuICAgIHNjcm9sbFRvOiAoeCwgeSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDJcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgaWYgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnggPT0geCBhbmQgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnkgPT0geSB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGVhc2luZy50eXBlID0gZWFzaW5nVHlwZSB8fCBncy5FYXNpbmdzLkVBU0VfTElORUFSW2dzLkVhc2luZ1R5cGVzLkVBU0VfSU5dXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnggPSB4XG4gICAgICAgICAgICBAb2JqZWN0LnZpc3VhbC5zY3JvbGwueSA9IHlcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVhc2luZy5zdGFydChAb2JqZWN0LnZpc3VhbC5zY3JvbGwueCwgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnksIHgsIHksIGR1cmF0aW9uKVxuICAgICAgICAgICAgQHRhcmdldFggPSB4XG4gICAgICAgICAgICBAdGFyZ2V0WSA9IHlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogTW92ZXMgdGhlIGdhbWUgb2JqZWN0IHdpdGggYSBzcGVjaWZpZWQgc3BlZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCBtb3ZlXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRYIFRoZSBzcGVlZCBvbiB4LWF4aXMgaW4gcGl4ZWxzIHBlciBmcmFtZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZFkgVGhlIHNwZWVkIG9uIHktYXhpcyBpbiBwaXhlbHMgcGVyIGZyYW1lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2stZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cbiAgICAjIyMgICAgICAgIFxuICAgIG1vdmU6IChzcGVlZFgsIHNwZWVkWSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDFcbiAgICAgICAgQHRhcmdldFggPSBkdXJhdGlvbiAqIHNwZWVkWFxuICAgICAgICBAdGFyZ2V0WSA9IGR1cmF0aW9uICogc3BlZWRZXG4gICAgICAgIEBjYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgIFxuICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdUeXBlIHx8IGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbZ3MuRWFzaW5nVHlwZXMuRUFTRV9JTl1cbiAgICAgICAgaWYgZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0RW5kbGVzcyhzcGVlZFgsIHNwZWVkWSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVhc2luZy5zdGFydChAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIEB0YXJnZXRYLCBAdGFyZ2V0WSwgZHVyYXRpb24pXG4gICAgXG4gICAgIyMjKlxuICAgICogTW92ZXMgdGhlIGdhbWUgb2JqZWN0IHRvIGEgc3BlY2lmaWVkIHBvc2l0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgbW92ZVRvXG4gICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IFRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrLWZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuXG4gICAgIyMjICAgICAgXG4gICAgbW92ZVRvOiAoeCwgeSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDFcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgaWYgQG9iamVjdC5kc3RSZWN0LnggPT0geCBhbmQgQG9iamVjdC5kc3RSZWN0LnkgPT0geSB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGVhc2luZy50eXBlID0gZWFzaW5nVHlwZSB8fCBncy5FYXNpbmdzLkVBU0VfTElORUFSW2dzLkVhc2luZ1R5cGVzLkVBU0VfSU5dXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQGVhc2luZy54ID0geFxuICAgICAgICAgICAgQGVhc2luZy55ID0geVxuICAgICAgICAgICAgQHVwZGF0ZUNvb3JkaW5hdGVzKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVhc2luZy5zdGFydChAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIHgsIHksIGR1cmF0aW9uKVxuICAgICAgICAgICAgQHRhcmdldFggPSB4XG4gICAgICAgICAgICBAdGFyZ2V0WSA9IHlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBMZXRzIGEgZ2FtZSBvYmplY3QgYXBwZWFyIG9uIHNjcmVlbiBmcm9tIGxlZnQsIHRvcCwgcmlnaHQgb3IgYm90dG9tIHVzaW5nIFxuICAgICogYSBtb3ZlLWFuaW1hdGlvblxuICAgICpcbiAgICAqIEBtZXRob2QgbW92ZUluXG4gICAgKiBAcGFyYW0ge251bWJlcn0geCBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSB0YXJnZXQtcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSB0YXJnZXQtcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSBUaGUgbW92ZW1lbnQtZGlyZWN0aW9uIGZyb20gd2hlcmUgdGhlIGdhbWUgb2JqZWN0IHNob3VsZCBtb3ZlLWluLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrLWZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuIFxuICAgICMjIyAgICAgICAgIFxuICAgIG1vdmVJbjogKHgsIHksIHR5cGUsIGR1cmF0aW9uLCBlYXNpbmcsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDBcbiAgICAgICAgQG9iamVjdC5vZmZzZXQueCA9IDBcbiAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IDBcbiAgICAgICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQG9iamVjdC51cGRhdGUoKVxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBcbiAgICAgICAgQGVhc2luZy50eXBlID0gZWFzaW5nXG4gICAgICAgIEBjYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgIFxuICAgICAgICByZWN0ID0gaWYgQG9iamVjdC5hbmdsZT8gdGhlbiBAb2JqZWN0LmRzdFJlY3Qucm90YXRlKEBvYmplY3QuYW5nbGUpIGVsc2UgQG9iamVjdC5kc3RSZWN0XG4gICAgICAgIHdpZHRoID0gcmVjdC53aWR0aCAqIEBvYmplY3Quem9vbS54XG4gICAgICAgIGhlaWdodCA9IHJlY3QuaGVpZ2h0ICogQG9iamVjdC56b29tLnlcbiAgICAgICAgeCA9IEBvYmplY3QuZHN0UmVjdC54IC0gKHdpZHRoLXJlY3Qud2lkdGgpICogQG9iamVjdC5hbmNob3IueFxuICAgICAgICB5ID0gQG9iamVjdC5kc3RSZWN0LnkgLSAoaGVpZ2h0LXJlY3QuaGVpZ2h0KSAqIEBvYmplY3QuYW5jaG9yLnlcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCB0eXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBMZWZ0XG4gICAgICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IDBcbiAgICAgICAgICAgICAgICBAb2JqZWN0Lm9mZnNldC54ID0gLSh4K3dpZHRoK0BvYmplY3Qub3JpZ2luLngpXG4gICAgICAgICAgICB3aGVuIDEgIyBUb3BcbiAgICAgICAgICAgICAgICBAb2JqZWN0Lm9mZnNldC55ID0gLSh5K2hlaWdodCtAb2JqZWN0Lm9yaWdpbi55KVxuICAgICAgICAgICAgICAgIEBvYmplY3Qub2Zmc2V0LnggPSAwXG4gICAgICAgICAgICB3aGVuIDIgIyBSaWdodFxuICAgICAgICAgICAgICAgIEBvYmplY3Qub2Zmc2V0LnggPSAoQG9iamVjdC52aWV3cG9ydHx8R3JhcGhpY3Mudmlld3BvcnQpLnJlY3Qud2lkdGggLSB4XG4gICAgICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IDBcbiAgICAgICAgICAgIHdoZW4gMyAjIEJvdHRvbVxuICAgICAgICAgICAgICAgIEBvYmplY3Qub2Zmc2V0LnggPSAwXG4gICAgICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IChAb2JqZWN0LnZpZXdwb3J0fHxHcmFwaGljcy52aWV3cG9ydCkucmVjdC5oZWlnaHQgLSB5XG5cbiAgICAgICAgQG9iamVjdC51cGRhdGUoKVxuICAgICAgICBAZWFzaW5nLnN0YXJ0KEBvYmplY3Qub2Zmc2V0LngsIEBvYmplY3Qub2Zmc2V0LnksIDAsIDAsIGR1cmF0aW9uKVxuICAgICAgIFxuICAgICMjIypcbiAgICAqIExldHMgYSBnYW1lIG9iamVjdCBkaXNhcHBlYXIgZnJvbSBzY3JlZW4gdG8gdGhlIGxlZnQsIHRvcCwgcmlnaHQgb3IgYm90dG9tIHVzaW5nIFxuICAgICogYSBtb3ZlLWFuaW1hdGlvblxuICAgICpcbiAgICAqIEBtZXRob2QgbW92ZU91dFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgVGhlIG1vdmVtZW50LWRpcmVjdGlvbiBpbiB3aGljaCB0aGUgZ2FtZSBvYmplY3Qgc2hvdWxkIG1vdmUtb3V0LlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrLWZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuIFxuICAgICMjIyAgICBcbiAgICBtb3ZlT3V0OiAodHlwZSwgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2spIC0+XG4gICAgICAgICNpZiBkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKClcbiAgICAgICAgIyAgICByZXR1cm4gY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgICAgICBcbiAgICAgICAgQGFuaW1hdGlvblR5cGUgPSAwXG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1xuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgeCA9IDBcbiAgICAgICAgeSA9IDBcbiAgICAgICAgdmlld3BvcnQgPSBHcmFwaGljcy52aWV3cG9ydFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHJlY3QgPSBpZiBAb2JqZWN0LmFuZ2xlPyB0aGVuIEBvYmplY3QuZHN0UmVjdC5yb3RhdGUoQG9iamVjdC5hbmdsZSkgZWxzZSBAb2JqZWN0LmRzdFJlY3RcbiAgICAgICAgd2lkdGggPSByZWN0LndpZHRoICogQG9iamVjdC56b29tLnhcbiAgICAgICAgaGVpZ2h0ID0gcmVjdC5oZWlnaHQgKiBAb2JqZWN0Lnpvb20ueVxuICAgICAgICB4ID0gQG9iamVjdC5kc3RSZWN0LnggLSAod2lkdGgtcmVjdC53aWR0aCkgKiBAb2JqZWN0LmFuY2hvci54XG4gICAgICAgIHkgPSBAb2JqZWN0LmRzdFJlY3QueSAtIChoZWlnaHQtcmVjdC5oZWlnaHQpICogQG9iamVjdC5hbmNob3IueVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIHR5cGVcbiAgICAgICAgICAgIHdoZW4gMCAjIExlZnRcbiAgICAgICAgICAgICAgICB4ID0gLShAb2JqZWN0Lm9yaWdpbi54K3grd2lkdGgpXG4gICAgICAgICAgICAgICAgeSA9IDBcbiAgICAgICAgICAgIHdoZW4gMSAjIFRvcFxuICAgICAgICAgICAgICAgIHkgPSAtKEBvYmplY3Qub3JpZ2luLnkreStoZWlnaHQpXG4gICAgICAgICAgICAgICAgeCA9IDBcbiAgICAgICAgICAgIHdoZW4gMiAjIFJpZ2h0XG4gICAgICAgICAgICAgICAgeCA9IChAb2JqZWN0LnZpZXdwb3J0fHxHcmFwaGljcy52aWV3cG9ydCkucmVjdC53aWR0aFxuICAgICAgICAgICAgICAgIHkgPSAwIFxuICAgICAgICAgICAgd2hlbiAzICMgQm90dG9tXG4gICAgICAgICAgICAgICAgeSA9IChAb2JqZWN0LnZpZXdwb3J0fHxHcmFwaGljcy52aWV3cG9ydCkucmVjdC5oZWlnaHRcbiAgICAgICAgICAgICAgICB4ID0gMFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKClcbiAgICAgICAgICAgIEBvYmplY3Qub2Zmc2V0LnggPSB4XG4gICAgICAgICAgICBAb2JqZWN0Lm9mZnNldC55ID0geVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0KEBvYmplY3Qub2Zmc2V0LngsIEBvYmplY3Qub2Zmc2V0LnksIHgsIHksIGR1cmF0aW9uKVxuICAgICAgICBcbmdzLkNvbXBvbmVudF9Nb3ZlQW5pbWF0aW9uID0gQ29tcG9uZW50X01vdmVBbmltYXRpb24iXX0=
//# sourceURL=Component_MoveAnimation_76.js