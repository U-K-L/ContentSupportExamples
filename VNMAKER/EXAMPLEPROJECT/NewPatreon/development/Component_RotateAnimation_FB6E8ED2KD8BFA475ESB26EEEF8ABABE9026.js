var Component_RotateAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_RotateAnimation = (function(superClass) {
  extend(Component_RotateAnimation, superClass);


  /**
  * Executes a rotate-animation on a game-object.
  *
  * @module gs
  * @class Component_RotateAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_RotateAnimation(data) {
    Component_RotateAnimation.__super__.constructor.apply(this, arguments);
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
    this.callback = null;
  }


  /**
  * Serializes the rotate-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_RotateAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing
    };
  };


  /**
  * Updates the rotate-animation.
  *
  * @method update
   */

  Component_RotateAnimation.prototype.update = function() {
    Component_RotateAnimation.__super__.update.call(this);
    if (!this.easing.isRunning) {
      return;
    }
    this.object.angle = this.easing.value;
    this.easing.updateValue();
    if (!this.easing.isRunning && !this.easing.isEndless) {
      this.object.angle = Math.round(this.object.angle);
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the rotate-animation.
  *
  * @method rotateTo
  * @param {number} angle The target angle
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if the animation is finished.
   */

  Component_RotateAnimation.prototype.rotateTo = function(angle, duration, easingType, callback) {
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    this.callback = callback;
    if (duration === 0 || GameManager.tempSettings.skip) {
      this.object.angle = angle;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.startValue(this.object.angle, angle - this.object.angle, duration);
    }
  };


  /**
  * Starts the rotate-animation.
  *
  * @method start
  * @param {gs.RotationDirection} direction The rotation direction.
  * @param {number} speed The rotation speed in degrees per frame.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if the animation is finished.
   */

  Component_RotateAnimation.prototype.rotate = function(direction, speed, duration, easingType, callback) {
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    this.callback = callback;
    this.speed = speed;
    this.orgAngle = this.object.angle;
    if (direction === 1) {
      speed = -speed;
    }
    if (duration === 0 || GameManager.tempSettings.skip) {
      this.object.angle += speed * duration;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.startValue(this.object.angle, (this.object.angle + speed * duration) - this.object.angle, duration);
    }
  };


  /**
  * Skips the animation. That is used to skip an animation if the user
  * wants to skip very fast through a visual novel scene.
  *
  * @method skip
   */

  Component_RotateAnimation.prototype.skip = function() {
    var ref;
    if (((ref = this.easing) != null ? ref.duration : void 0) >= GameManager.tempSettings.skipTime) {
      this.object.angle = this.orgAngle + this.speed * this.easing.duration;
      return this.easing.isRunning = false;
    }
  };

  return Component_RotateAnimation;

})(gs.Component_Animation);

gs.Component_RotateAnimation = Component_RotateAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEseUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLG1DQUFDLElBQUQ7SUFDVCw0REFBQSxTQUFBO0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixpQkFBZ0IsSUFBSSxDQUFFLGVBQXRCO0lBQ2QsSUFBQyxDQUFBLFFBQUQsR0FBWTtFQUpIOzs7QUFNYjs7Ozs7O3NDQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7O0VBRFU7OztBQUdkOzs7Ozs7c0NBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixvREFBQTtJQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7QUFBOEIsYUFBOUI7O0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDeEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7SUFFQSxJQUFHLENBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFaLElBQTBCLENBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUF6QztNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBbkI7bURBQ2hCLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBRnhCOztFQVBJOzs7QUFZUjs7Ozs7Ozs7OztzQ0FTQSxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixRQUE5QjtJQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLFVBQUEsSUFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVksQ0FBQSxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQWY7SUFDcEQsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUVaLElBQUcsUUFBQSxLQUFZLENBQVosSUFBaUIsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUE3QztNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjttREFDaEIsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFGeEI7S0FBQSxNQUFBO2FBSUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBM0IsRUFBa0MsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBbEQsRUFBeUQsUUFBekQsRUFKSjs7RUFKTTs7O0FBVVY7Ozs7Ozs7Ozs7O3NDQVVBLE1BQUEsR0FBUSxTQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLFFBQW5CLEVBQTZCLFVBQTdCLEVBQXlDLFFBQXpDO0lBQ0osSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsVUFBQSxJQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBWSxDQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBZjtJQUNwRCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUNwQixJQUFHLFNBQUEsS0FBYSxDQUFoQjtNQUNJLEtBQUEsR0FBUSxDQUFDLE1BRGI7O0lBR0EsSUFBRyxRQUFBLEtBQVksQ0FBWixJQUFpQixXQUFXLENBQUMsWUFBWSxDQUFDLElBQTdDO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLElBQWlCLEtBQUEsR0FBUTttREFDekIsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFGeEI7S0FBQSxNQUFBO2FBSUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBM0IsRUFBa0MsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsS0FBQSxHQUFRLFFBQXpCLENBQUEsR0FBcUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUEvRSxFQUFzRixRQUF0RixFQUpKOztFQVJJOzs7QUFjUjs7Ozs7OztzQ0FNQSxJQUFBLEdBQU0sU0FBQTtBQUNGLFFBQUE7SUFBQSxzQ0FBVSxDQUFFLGtCQUFULElBQXFCLFdBQVcsQ0FBQyxZQUFZLENBQUMsUUFBakQ7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUM7YUFDN0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLEdBQW9CLE1BRnhCOztFQURFOzs7O0dBMUY4QixFQUFFLENBQUM7O0FBK0YzQyxFQUFFLENBQUMseUJBQUgsR0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9Sb3RhdGVBbmltYXRpb25cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9Sb3RhdGVBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSByb3RhdGUtYW5pbWF0aW9uIG9uIGEgZ2FtZS1vYmplY3QuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9Sb3RhdGVBbmltYXRpb25cbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQGVhc2luZyA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8uZWFzaW5nKVxuICAgICAgICBAY2FsbGJhY2sgPSBudWxsXG4gICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgcm90YXRlLWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgICBcbiAgICB0b0RhdGFCdW5kbGU6IC0+XG4gICAgICAgIGVhc2luZzogQGVhc2luZ1xuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHJvdGF0ZS1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LmFuZ2xlID0gQGVhc2luZy52YWx1ZVxuICAgICAgICBAZWFzaW5nLnVwZGF0ZVZhbHVlKClcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZyBhbmQgbm90IEBlYXNpbmcuaXNFbmRsZXNzXG4gICAgICAgICAgICBAb2JqZWN0LmFuZ2xlID0gTWF0aC5yb3VuZChAb2JqZWN0LmFuZ2xlKVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSByb3RhdGUtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2Qgcm90YXRlVG9cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSBUaGUgdGFyZ2V0IGFuZ2xlXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgY2FsbGVkIGlmIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuIFxuICAgICMjIyBcbiAgICByb3RhdGVUbzogKGFuZ2xlLCBkdXJhdGlvbiwgZWFzaW5nVHlwZSwgY2FsbGJhY2spIC0+XG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1R5cGUgfHwgZ3MuRWFzaW5ncy5FQVNFX0xJTkVBUltncy5FYXNpbmdUeXBlcy5FQVNFX0lOXVxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBcbiAgICAgICAgaWYgZHVyYXRpb24gPT0gMCBvciBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgQG9iamVjdC5hbmdsZSA9IGFuZ2xlXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBlYXNpbmcuc3RhcnRWYWx1ZShAb2JqZWN0LmFuZ2xlLCBhbmdsZSAtIEBvYmplY3QuYW5nbGUsIGR1cmF0aW9uKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSByb3RhdGUtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAqIEBwYXJhbSB7Z3MuUm90YXRpb25EaXJlY3Rpb259IGRpcmVjdGlvbiBUaGUgcm90YXRpb24gZGlyZWN0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIFRoZSByb3RhdGlvbiBzcGVlZCBpbiBkZWdyZWVzIHBlciBmcmFtZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjayBjYWxsZWQgaWYgdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC4gXG4gICAgIyMjIFxuICAgIHJvdGF0ZTogKGRpcmVjdGlvbiwgc3BlZWQsIGR1cmF0aW9uLCBlYXNpbmdUeXBlLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQGVhc2luZy50eXBlID0gZWFzaW5nVHlwZSB8fCBncy5FYXNpbmdzLkVBU0VfTElORUFSW2dzLkVhc2luZ1R5cGVzLkVBU0VfSU5dXG4gICAgICAgIEBjYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgIEBzcGVlZCA9IHNwZWVkXG4gICAgICAgIEBvcmdBbmdsZSA9IEBvYmplY3QuYW5nbGVcbiAgICAgICAgaWYgZGlyZWN0aW9uID09IDFcbiAgICAgICAgICAgIHNwZWVkID0gLXNwZWVkXG4gICAgICAgIFxuICAgICAgICBpZiBkdXJhdGlvbiA9PSAwIG9yIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICBAb2JqZWN0LmFuZ2xlICs9IHNwZWVkICogZHVyYXRpb25cbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGVhc2luZy5zdGFydFZhbHVlKEBvYmplY3QuYW5nbGUsIChAb2JqZWN0LmFuZ2xlICsgc3BlZWQgKiBkdXJhdGlvbikgLSBAb2JqZWN0LmFuZ2xlLCBkdXJhdGlvbilcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIGFuaW1hdGlvbi4gVGhhdCBpcyB1c2VkIHRvIHNraXAgYW4gYW5pbWF0aW9uIGlmIHRoZSB1c2VyXG4gICAgKiB3YW50cyB0byBza2lwIHZlcnkgZmFzdCB0aHJvdWdoIGEgdmlzdWFsIG5vdmVsIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcFxuICAgICMjIyAgICBcbiAgICBza2lwOiAtPlxuICAgICAgICBpZiBAZWFzaW5nPy5kdXJhdGlvbiA+PSBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWVcbiAgICAgICAgICAgIEBvYmplY3QuYW5nbGUgPSBAb3JnQW5nbGUgKyBAc3BlZWQgKiBAZWFzaW5nLmR1cmF0aW9uXG4gICAgICAgICAgICBAZWFzaW5nLmlzUnVubmluZyA9IG5vXG4gICAgICAgICAgICBcbmdzLkNvbXBvbmVudF9Sb3RhdGVBbmltYXRpb24gPSBDb21wb25lbnRfUm90YXRlQW5pbWF0aW9uIl19
//# sourceURL=Component_RotateAnimation_89.js