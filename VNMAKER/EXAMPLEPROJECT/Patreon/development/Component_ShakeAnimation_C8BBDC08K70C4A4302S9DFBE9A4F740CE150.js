var Component_ShakeAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ShakeAnimation = (function(superClass) {
  extend(Component_ShakeAnimation, superClass);


  /**
  * Executes a horizontal shake-animation on a game-object.
  *
  * @module gs
  * @class Component_ShakeAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_ShakeAnimation(data) {
    var ref;
    Component_ShakeAnimation.__super__.constructor.apply(this, arguments);
    this.easingX = new gs.Easing(null, data != null ? data.easingX : void 0);
    this.easingY = new gs.Easing(null, data != null ? data.easingY : void 0);
    this.range = (data != null ? data.range : void 0) || {
      x: 0,
      y: 0
    };
    this.speed = (data != null ? data.speed : void 0) || 0;
    this.callback = null;
    this.isRunning = (ref = data != null ? data.isRunning : void 0) != null ? ref : false;
    this.duration = (data != null ? data.duration : void 0) || 0;
  }


  /**
  * Serializes the shake-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_ShakeAnimation.prototype.toDataBundle = function() {
    return {
      easingX: this.easingX,
      easingY: this.easingY,
      range: this.range,
      duration: this.duration,
      speed: this.speed,
      isRunning: this.isRunning
    };
  };


  /**
  * Skips the animation. That is used to skip an animation if the user
  * wants to skip very fast through a visual novel scene.
  *
  * @method skip
   */

  Component_ShakeAnimation.prototype.skip = function() {
    if (this.easingX.duration > 1) {
      this.easingX.duration = 1;
      this.easingX.time = 0;
    }
    if (this.easingY.duration > 1) {
      this.easingY.duration = 1;
      return this.easingY.time = 0;
    }
  };


  /**
  * Starts the shake-animation.
  *
  * @method start
  * @param {gs.Range} range The horizontal shake-range.
  * @param {number} speed The shake-speed.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if the animation is finished.
   */

  Component_ShakeAnimation.prototype.start = function(range, speed, duration, easing, callback) {
    this.range = range;
    this.easingX.type = easing;
    this.easingY.type = easing;
    this.speed = speed;
    this.duration = duration;
    this.callback = callback;
    if (this.duration === 0 || this.isInstantSkip()) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.isRunning = true;
      this.startOffset = {
        x: this.object.offset.x,
        y: this.object.offset.y
      };
      if (range.x !== 0) {
        this.easingX.startValue(this.startOffset.x, range.x, Math.max(range.x / speed, 1));
      }
      if (range.y !== 0) {
        return this.easingY.startValue(this.startOffset.y, range.y, Math.max(range.y / speed, 1));
      }
    }
  };


  /**
  * Updates the shake-animation.
  *
  * @method update
   */

  Component_ShakeAnimation.prototype.update = function() {
    Component_ShakeAnimation.__super__.update.call(this);
    if ((this.duration === 0 || this.isInstantSkip()) && this.isRunning) {
      this.easingX.isRunning = false;
      this.easingY.isRunning = false;
      this.object.offset.x = 0;
      this.object.offset.y = 0;
      this.isRunning = false;
      if (typeof this.callback === "function") {
        this.callback(this.object, this);
      }
    }
    if (!this.isRunning) {
      return;
    }
    this.easingX.updateValue();
    this.easingY.updateValue();
    if (this.easingY.isRunning) {
      this.object.offset.y = Math.round(this.easingY.value);
    }
    if (this.easingX.isRunning) {
      this.object.offset.x = Math.round(this.easingX.value);
    }
    if (!this.easingX.isRunning) {
      this.easingX.startValue(this.object.offset.x, (this.object.offset.x > 0 ? -(this.range.x * 2) : this.range.x * 2), Math.max(this.range.x * 2 / this.speed, 2));
    }
    if (!this.easingY.isRunning) {
      this.easingY.startValue(this.object.offset.y, (this.object.offset.y > 0 ? -(this.range.y * 2) : this.range.y * 2), Math.max(this.range.y * 2 / this.speed, 2));
    }
    return this.duration--;
  };

  return Component_ShakeAnimation;

})(gs.Component_Animation);

gs.Component_ShakeAnimation = Component_ShakeAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGtDQUFDLElBQUQ7QUFDVCxRQUFBO0lBQUEsMkRBQUEsU0FBQTtJQUNBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsaUJBQWdCLElBQUksQ0FBRSxnQkFBdEI7SUFDZixJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLGlCQUFnQixJQUFJLENBQUUsZ0JBQXRCO0lBQ2YsSUFBQyxDQUFBLEtBQUQsbUJBQVMsSUFBSSxDQUFFLGVBQU4sSUFBZTtNQUFFLENBQUEsRUFBRyxDQUFMO01BQVEsQ0FBQSxFQUFHLENBQVg7O0lBQ3hCLElBQUMsQ0FBQSxLQUFELG1CQUFTLElBQUksQ0FBRSxlQUFOLElBQWU7SUFDeEIsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxTQUFELGtFQUErQjtJQUMvQixJQUFDLENBQUEsUUFBRCxtQkFBWSxJQUFJLENBQUUsa0JBQU4sSUFBa0I7RUFSckI7OztBQVdiOzs7Ozs7cUNBS0EsWUFBQSxHQUFjLFNBQUE7V0FDVjtNQUFBLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FBVjtNQUNBLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FEVjtNQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FGUjtNQUdBLFFBQUEsRUFBVSxJQUFDLENBQUEsUUFIWDtNQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FKUjtNQUtBLFNBQUEsRUFBVyxJQUFDLENBQUEsU0FMWjs7RUFEVTs7O0FBUWQ7Ozs7Ozs7cUNBTUEsSUFBQSxHQUFNLFNBQUE7SUFDRixJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxHQUFvQixDQUF2QjtNQUNJLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxH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QUFDLHdCQUFILEdBQThCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfU2hha2VBbmltYXRpb25cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9TaGFrZUFuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhIGhvcml6b250YWwgc2hha2UtYW5pbWF0aW9uIG9uIGEgZ2FtZS1vYmplY3QuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9TaGFrZUFuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBlYXNpbmdYID0gbmV3IGdzLkVhc2luZyhudWxsLCBkYXRhPy5lYXNpbmdYKVxuICAgICAgICBAZWFzaW5nWSA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8uZWFzaW5nWSlcbiAgICAgICAgQHJhbmdlID0gZGF0YT8ucmFuZ2UgfHwgeyB4OiAwLCB5OiAwIH1cbiAgICAgICAgQHNwZWVkID0gZGF0YT8uc3BlZWQgfHwgMFxuICAgICAgICBAY2FsbGJhY2sgPSBudWxsXG4gICAgICAgIEBpc1J1bm5pbmcgPSBkYXRhPy5pc1J1bm5pbmcgPyBub1xuICAgICAgICBAZHVyYXRpb24gPSBkYXRhPy5kdXJhdGlvbiB8fCAwXG4gICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIHNoYWtlLWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgIFxuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgZWFzaW5nWDogQGVhc2luZ1gsXG4gICAgICAgIGVhc2luZ1k6IEBlYXNpbmdZLFxuICAgICAgICByYW5nZTogQHJhbmdlLFxuICAgICAgICBkdXJhdGlvbjogQGR1cmF0aW9uLFxuICAgICAgICBzcGVlZDogQHNwZWVkLFxuICAgICAgICBpc1J1bm5pbmc6IEBpc1J1bm5pbmdcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIGFuaW1hdGlvbi4gVGhhdCBpcyB1c2VkIHRvIHNraXAgYW4gYW5pbWF0aW9uIGlmIHRoZSB1c2VyXG4gICAgKiB3YW50cyB0byBza2lwIHZlcnkgZmFzdCB0aHJvdWdoIGEgdmlzdWFsIG5vdmVsIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcFxuICAgICMjIyAgIFxuICAgIHNraXA6IC0+IFxuICAgICAgICBpZiBAZWFzaW5nWC5kdXJhdGlvbiA+IDFcbiAgICAgICAgICAgIEBlYXNpbmdYLmR1cmF0aW9uID0gMVxuICAgICAgICAgICAgQGVhc2luZ1gudGltZSA9IDBcbiAgICAgICAgaWYgQGVhc2luZ1kuZHVyYXRpb24gPiAxXG4gICAgICAgICAgICBAZWFzaW5nWS5kdXJhdGlvbiA9IDFcbiAgICAgICAgICAgIEBlYXNpbmdZLnRpbWUgPSAwXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSBzaGFrZS1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBzdGFydFxuICAgICogQHBhcmFtIHtncy5SYW5nZX0gcmFuZ2UgVGhlIGhvcml6b250YWwgc2hha2UtcmFuZ2UuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgVGhlIHNoYWtlLXNwZWVkLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrIGNhbGxlZCBpZiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICBcbiAgICBzdGFydDogKHJhbmdlLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2spIC0+XG4gICAgICAgIEByYW5nZSA9IHJhbmdlXG4gICAgICAgIEBlYXNpbmdYLnR5cGUgPSBlYXNpbmdcbiAgICAgICAgQGVhc2luZ1kudHlwZSA9IGVhc2luZ1xuICAgICAgICBAc3BlZWQgPSBzcGVlZFxuICAgICAgICBAZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBcbiAgICAgICAgaWYgQGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgICAgICBAc3RhcnRPZmZzZXQgPSB4OiBAb2JqZWN0Lm9mZnNldC54LCB5OiBAb2JqZWN0Lm9mZnNldC55XG4gICAgICAgICAgICBpZiByYW5nZS54ICE9IDBcbiAgICAgICAgICAgICAgICBAZWFzaW5nWC5zdGFydFZhbHVlKEBzdGFydE9mZnNldC54LCByYW5nZS54LCBNYXRoLm1heChyYW5nZS54IC8gc3BlZWQsIDEpKVxuICAgICAgICAgICAgaWYgcmFuZ2UueSAhPSAwXG4gICAgICAgICAgICAgICAgQGVhc2luZ1kuc3RhcnRWYWx1ZShAc3RhcnRPZmZzZXQueSwgcmFuZ2UueSwgTWF0aC5tYXgocmFuZ2UueSAvIHNwZWVkLCAxKSlcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHNoYWtlLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIChAZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKSBhbmQgQGlzUnVubmluZ1xuICAgICAgICAgICAgQGVhc2luZ1guaXNSdW5uaW5nID0gbm9cbiAgICAgICAgICAgIEBlYXNpbmdZLmlzUnVubmluZyA9IG5vXG4gICAgICAgICAgICBAb2JqZWN0Lm9mZnNldC54ID0gMFxuICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IDBcbiAgICAgICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAZWFzaW5nWC51cGRhdGVWYWx1ZSgpXG4gICAgICAgIEBlYXNpbmdZLnVwZGF0ZVZhbHVlKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBlYXNpbmdZLmlzUnVubmluZ1xuICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueSA9IE1hdGgucm91bmQoQGVhc2luZ1kudmFsdWUpXG4gICAgICAgIGlmIEBlYXNpbmdYLmlzUnVubmluZ1xuICAgICAgICAgICAgQG9iamVjdC5vZmZzZXQueCA9IE1hdGgucm91bmQoQGVhc2luZ1gudmFsdWUpXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQGVhc2luZ1guaXNSdW5uaW5nXG4gICAgICAgICAgICBAZWFzaW5nWC5zdGFydFZhbHVlKEBvYmplY3Qub2Zmc2V0LngsIChpZiBAb2JqZWN0Lm9mZnNldC54ID4gMCB0aGVuIC0oQHJhbmdlLngqMikgZWxzZSAoQHJhbmdlLngqMikpLCBNYXRoLm1heChAcmFuZ2UueCoyIC8gQHNwZWVkLCAyKSlcbiAgICAgICAgaWYgbm90IEBlYXNpbmdZLmlzUnVubmluZ1xuICAgICAgICAgICAgQGVhc2luZ1kuc3RhcnRWYWx1ZShAb2JqZWN0Lm9mZnNldC55LCAoaWYgQG9iamVjdC5vZmZzZXQueSA+IDAgdGhlbiAtKEByYW5nZS55KjIpIGVsc2UgKEByYW5nZS55KjIpKSwgTWF0aC5tYXgoQHJhbmdlLnkqMiAvIEBzcGVlZCwgMikpXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgQGR1cmF0aW9uLS1cbiAgICAgICAgICAgIFxuZ3MuQ29tcG9uZW50X1NoYWtlQW5pbWF0aW9uID0gQ29tcG9uZW50X1NoYWtlQW5pbWF0aW9uIl19
//# sourceURL=Component_ShakeAnimation_123.js