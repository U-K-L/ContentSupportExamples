
/**
* Different types of animation looping.
*
* @module gs
* @class AnimationLoopType
* @memberof gs
* @static
* @final
 */
var AnimationLoopType, Component_PathAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AnimationLoopType = (function() {
  function AnimationLoopType() {}

  AnimationLoopType.initialize = function() {

    /**
    * No looping.
    * @property NONE
    * @static
    * @final
     */
    this.NONE = 0;

    /**
    * Regular looping. If the end of an animation is reached it will start
    * from the beginning.
    * @property NORMAL
    * @static
    * @final
     */
    this.NORMAL = 1;

    /**
    * Reverse looping. If the end of an animation is reached it will be
    * reversed an goes now from end to start.
    * @property REVERSE
    * @static
    * @final
     */
    return this.REVERSE = 2;
  };

  return AnimationLoopType;

})();

AnimationLoopType.initialize();

gs.AnimationLoopType = AnimationLoopType;

Component_PathAnimation = (function(superClass) {
  extend(Component_PathAnimation, superClass);


  /**
  * Executes a path-animation on a game-object. A path-animation moves the
  * game-object along a path of quadratic bezier-curves.
  *
  * @module gs
  * @class Component_PathAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_PathAnimation(data) {
    Component_PathAnimation.__super__.constructor.apply(this, arguments);
    this.path = (data != null ? data.path : void 0) || null;
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
    this.startPosition = (data != null ? data.startPosition : void 0) || null;
    this.loopType = (data != null ? data.loopType : void 0) || 0;
    this.animationType = 0;
    this.effects = (data != null ? data.effects : void 0) || [];
    this.effect = null;
  }


  /**
  * Serializes the path-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_PathAnimation.prototype.toDataBundle = function() {
    return {
      path: this.path,
      easing: this.easing,
      startPosition: this.startPosition,
      loopType: this.loopType
    };
  };


  /**
  * Skips the animation. That is used to skip an animation if the user
  * wants to skip very fast through a visual novel scene.
  *
  * @method skip
   */

  Component_PathAnimation.prototype.skip = function() {
    if (this.loopType === 0 && this.easing.duration > 1) {
      this.easing.duration = 1;
      return this.easing.time = 0;
    }
  };


  /**
  * Calculates a certain point on a specified bezier-curve.
  *
  * @method quadraticBezierPoint
  * @protected
  * @param {number} startPt - The start-point of the bezier-curve.
  * @param {number} controlPt - The control-point of the bezier-curve.
  * @param {number} endPt - The end-point of the bezier-curve.
  * @param {number} percent - The percentage (0.0 - 1.0). A percentage of
  * 0.0 returns the <b>startPt</b> and 1.0 returns the <b>endPt</b> while
  * 0.5 return the point at the middle of the bezier-curve.
   */

  Component_PathAnimation.prototype.quadraticBezierPoint = function(startPt, controlPt, endPt, percent) {
    var x, y;
    x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
    y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
    return {
      x: x,
      y: y
    };
  };


  /**
  * Updates the path-animation.
  *
  * @method update
   */

  Component_PathAnimation.prototype.update = function() {
    var current, curve, effect, i, j, k, len, len1, len2, point, ref, ref1, ref2, value;
    Component_PathAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    value = this.easing.value;
    point = this.path.curveLength / 100 * value;
    ref = this.path.curveLengths;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      len = ref[i];
      if (point <= len.len + len.offset) {
        current = {
          percent: (point - len.offset) / len.len,
          path: this.path.data[i]
        };
        break;
      }
    }
    curve = current.path;
    point = this.quadraticBezierPoint(curve.pt1, curve.cpt, curve.pt2, current.percent);
    switch (this.animationType) {
      case 0:
        this.object.dstRect.x = Math.round(point.x - this.path.data[0].pt1.x + this.startPosition.x);
        this.object.dstRect.y = Math.round(point.y - this.path.data[0].pt1.y + this.startPosition.y);
        break;
      case 2:
        this.object.visual.scroll.x = Math.round(point.x - this.path.data[0].pt1.x + this.startPosition.x);
        this.object.visual.scroll.y = Math.round(point.y - this.path.data[0].pt1.y + this.startPosition.y);
    }
    ref1 = this.effects;
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      effect = ref1[k];
      if ((!this.effect || (this.effect !== effect && ((ref2 = this.effect) != null ? ref2.time : void 0) <= effect.time)) && this.easing.time >= effect.time) {
        this.effect = effect;
        AudioManager.playSound(this.effect.sound);
      }
    }
    if (!this.easing.isRunning) {
      switch (this.loopType) {
        case 0:
          return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
        case 1:
          this.easing.startValue(0, 100, this.easing.duration);
          this.startPosition.x = this.object.dstRect.x;
          return this.startPosition.y = this.object.dstRect.y;
        case 2:
          this.effect = null;
          return this.easing.startValue(this.easing.value, 100 - this.easing.value * 2, this.easing.duration);
      }
    }
  };


  /**
  * Starts the path-animation. Scrolls the game object along the path.
  *
  * @method scrollPath
  * @param {Object} path The path to follow.
  * @param {gs.AnimationLoopType} loopType The loop-Type.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_PathAnimation.prototype.scroll = function(path, loopType, duration, easingType, effects, callback) {
    this.start(path, loopType, duration, easingType, callback);
    return this.animationType = 2;
  };


  /**
  * Starts the path-animation.
  *
  * @method movePath
  * @param {Object} path The path to follow.
  * @param {gs.AnimationLoopType} loopType The loop-Type.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_PathAnimation.prototype.start = function(path, loopType, duration, easingType, effects, callback) {
    var curve, j, l, len1, length, lengths, point, ref, x, y;
    this.effects = effects || [];
    this.effect = null;
    this.callback = callback;
    this.loopType = loopType;
    this.path = {
      data: path || [],
      curveLength: null,
      curveLengths: null
    };
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    this.easing.startValue(0, 100, duration);
    this.startPosition = {
      x: this.object.dstRect.x,
      y: this.object.dstRect.y
    };
    if (this.path.data.length === 0) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else if (duration === 0 || this.isInstantSkip()) {
      point = this.path.data.last().pt2;
      this.object.dstRect.x = Math.round(point.x - this.path.data[0].pt1.x + this.startPosition.x);
      this.object.dstRect.y = Math.round(point.y - this.path.data[0].pt1.y + this.startPosition.y);
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else if (this.path.curveLength == null) {
      length = 0;
      lengths = [];
      ref = this.path.data;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        curve = ref[j];
        x = (curve.cpt.x - curve.pt1.x) + (curve.pt2.x - curve.cpt.x);
        y = (curve.cpt.y - curve.pt1.y) + (curve.pt2.y - curve.cpt.y);
        l = Math.round(Math.sqrt(x * x + y * y));
        lengths.push({
          len: l,
          offset: length
        });
        length += l;
      }
      this.path.curveLength = length;
      return this.path.curveLengths = lengths;
    }
  };

  return Component_PathAnimation;

})(gs.Component_Animation);

gs.Component_PathAnimation = Component_PathAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7O0FBQUEsSUFBQSwwQ0FBQTtFQUFBOzs7QUFTTTs7O0VBQ0YsaUJBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQTs7QUFDVDs7Ozs7O0lBTUEsSUFBQyxDQUFBLElBQUQsR0FBUTs7QUFFUjs7Ozs7OztJQU9BLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7Ozs7V0FPQSxJQUFDLENBQUEsT0FBRCxHQUFXO0VBekJGOzs7Ozs7QUEyQmpCLGlCQUFpQixDQUFDLFVBQWxCLENBQUE7O0FBQ0EsRUFBRSxDQUFDLGlCQUFILEdBQXVCOztBQUVqQjs7OztBQUNGOzs7Ozs7Ozs7OztFQVVhLGlDQUFDLElBQUQ7SUFDVCwwREFBQSxTQUFBO0lBRUEsSUFBQyxDQUFBLElBQUQsbUJBQVEsSUFBSSxDQUFFLGNBQU4sSUFBYztJQUN0QixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLGlCQUFnQixJQUFJLENBQUUsZUFBdEI7SUFDZCxJQUFDLENBQUEsYUFBRCxtQkFBaUIsSUFBSSxDQUFFLHVCQUFOLElBQXVCO0lBQ3hDLElBQUMsQ0FBQSxRQUFELG1CQUFZLElBQUksQ0FBRSxrQkFBTixJQUFrQjtJQUM5QixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUNqQixJQUFDLENBQUEsT0FBRCxtQkFBVyxJQUFJLENBQUUsaUJBQU4sSUFBaUI7SUFDNUIsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQVREOzs7QUFVYjs7Ozs7O29DQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQVA7TUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BRFQ7TUFFQSxhQUFBLEVBQWUsSUFBQyxDQUFBLGFBRmhCO01BR0EsUUFBQSxFQUFVLElBQUMsQ0FBQSxRQUhYOztFQURVOzs7QUFNZDs7Ozs7OztvQ0FN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SUFBQyxDQUFBLFFBQVEsZUFKbkI7S0FBQSxNQUtBLElBQU8sNkJBQVA7TUFDRCxNQUFBLEdBQVM7TUFDVCxPQUFBLEdBQVU7QUFFVjtBQUFBLFdBQUEsdUNBQUE7O1FBQ0ksQ0FBQSxHQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFWLEdBQWMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUF6QixDQUFBLEdBQThCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFWLEdBQWMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUF6QjtRQUNsQyxDQUFBLEdBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQVYsR0FBYyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQXpCLENBQUEsR0FBOEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQVYsR0FBYyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQXpCO1FBQ2xDLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQSxHQUFFLENBQUYsR0FBTSxDQUFBLEdBQUUsQ0FBbEIsQ0FBWDtRQUVKLE9BQU8sQ0FBQyxJQUFSLENBQWE7VUFBRSxHQUFBLEVBQUssQ0FBUDtVQUFVLE1BQUEsRUFBUSxNQUFsQjtTQUFiO1FBQ0EsTUFBQSxJQUFVO0FBTmQ7TUFRQSxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQU4sR0FBb0I7YUFDcEIsSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFOLEdBQXFCLFFBYnBCOztFQWpCRjs7OztHQWxJMkIsRUFBRSxDQUFDOztBQWtLekMsRUFBRSxDQUFDLHVCQUFILEdBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfUGF0aEFuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4jIyMqXG4qIERpZmZlcmVudCB0eXBlcyBvZiBhbmltYXRpb24gbG9vcGluZy5cbipcbiogQG1vZHVsZSBnc1xuKiBAY2xhc3MgQW5pbWF0aW9uTG9vcFR5cGVcbiogQG1lbWJlcm9mIGdzXG4qIEBzdGF0aWNcbiogQGZpbmFsXG4jIyNcbmNsYXNzIEFuaW1hdGlvbkxvb3BUeXBlXG4gICAgQGluaXRpYWxpemU6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBObyBsb29waW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBOT05FXG4gICAgICAgICogQHN0YXRpY1xuICAgICAgICAqIEBmaW5hbFxuICAgICAgICAjIyNcbiAgICAgICAgQE5PTkUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogUmVndWxhciBsb29waW5nLiBJZiB0aGUgZW5kIG9mIGFuIGFuaW1hdGlvbiBpcyByZWFjaGVkIGl0IHdpbGwgc3RhcnRcbiAgICAgICAgKiBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gICAgICAgICogQHByb3BlcnR5IE5PUk1BTFxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBOT1JNQUwgPSAxXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogUmV2ZXJzZSBsb29waW5nLiBJZiB0aGUgZW5kIG9mIGFuIGFuaW1hdGlvbiBpcyByZWFjaGVkIGl0IHdpbGwgYmVcbiAgICAgICAgKiByZXZlcnNlZCBhbiBnb2VzIG5vdyBmcm9tIGVuZCB0byBzdGFydC5cbiAgICAgICAgKiBAcHJvcGVydHkgUkVWRVJTRVxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBSRVZFUlNFID0gMlxuICAgICAgICBcbkFuaW1hdGlvbkxvb3BUeXBlLmluaXRpYWxpemUoKVxuZ3MuQW5pbWF0aW9uTG9vcFR5cGUgPSBBbmltYXRpb25Mb29wVHlwZVxuXG5jbGFzcyBDb21wb25lbnRfUGF0aEFuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhIHBhdGgtYW5pbWF0aW9uIG9uIGEgZ2FtZS1vYmplY3QuIEEgcGF0aC1hbmltYXRpb24gbW92ZXMgdGhlXG4gICAgKiBnYW1lLW9iamVjdCBhbG9uZyBhIHBhdGggb2YgcXVhZHJhdGljIGJlemllci1jdXJ2ZXMuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9QYXRoQW5pbWF0aW9uXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBwYXRoID0gZGF0YT8ucGF0aCB8fCBudWxsXG4gICAgICAgIEBlYXNpbmcgPSBuZXcgZ3MuRWFzaW5nKG51bGwsIGRhdGE/LmVhc2luZylcbiAgICAgICAgQHN0YXJ0UG9zaXRpb24gPSBkYXRhPy5zdGFydFBvc2l0aW9uIHx8IG51bGxcbiAgICAgICAgQGxvb3BUeXBlID0gZGF0YT8ubG9vcFR5cGUgfHwgMFxuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDBcbiAgICAgICAgQGVmZmVjdHMgPSBkYXRhPy5lZmZlY3RzIHx8IFtdXG4gICAgICAgIEBlZmZlY3QgPSBudWxsXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgcGF0aC1hbmltYXRpb24gaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgIyMjXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBwYXRoOiBAcGF0aCxcbiAgICAgICAgZWFzaW5nOiBAZWFzaW5nLFxuICAgICAgICBzdGFydFBvc2l0aW9uOiBAc3RhcnRQb3NpdGlvbixcbiAgICAgICAgbG9vcFR5cGU6IEBsb29wVHlwZVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgYW5pbWF0aW9uLiBUaGF0IGlzIHVzZWQgdG8gc2tpcCBhbiBhbmltYXRpb24gaWYgdGhlIHVzZXJcbiAgICAqIHdhbnRzIHRvIHNraXAgdmVyeSBmYXN0IHRocm91Z2ggYSB2aXN1YWwgbm92ZWwgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwXG4gICAgIyMjICAgICAgXG4gICAgc2tpcDogLT5cbiAgICAgICAgaWYgQGxvb3BUeXBlID09IDAgYW5kIEBlYXNpbmcuZHVyYXRpb24gPiAxXG4gICAgICAgICAgICBAZWFzaW5nLmR1cmF0aW9uID0gMVxuICAgICAgICAgICAgQGVhc2luZy50aW1lID0gMFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxjdWxhdGVzIGEgY2VydGFpbiBwb2ludCBvbiBhIHNwZWNpZmllZCBiZXppZXItY3VydmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBxdWFkcmF0aWNCZXppZXJQb2ludFxuICAgICogQHByb3RlY3RlZFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0UHQgLSBUaGUgc3RhcnQtcG9pbnQgb2YgdGhlIGJlemllci1jdXJ2ZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb250cm9sUHQgLSBUaGUgY29udHJvbC1wb2ludCBvZiB0aGUgYmV6aWVyLWN1cnZlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZFB0IC0gVGhlIGVuZC1wb2ludCBvZiB0aGUgYmV6aWVyLWN1cnZlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHBlcmNlbnQgLSBUaGUgcGVyY2VudGFnZSAoMC4wIC0gMS4wKS4gQSBwZXJjZW50YWdlIG9mXG4gICAgKiAwLjAgcmV0dXJucyB0aGUgPGI+c3RhcnRQdDwvYj4gYW5kIDEuMCByZXR1cm5zIHRoZSA8Yj5lbmRQdDwvYj4gd2hpbGVcbiAgICAqIDAuNSByZXR1cm4gdGhlIHBvaW50IGF0IHRoZSBtaWRkbGUgb2YgdGhlIGJlemllci1jdXJ2ZS5cbiAgICAjIyMgICBcbiAgICBxdWFkcmF0aWNCZXppZXJQb2ludDogKHN0YXJ0UHQsIGNvbnRyb2xQdCwgZW5kUHQsIHBlcmNlbnQpIC0+XG4gICAgICAgIHggPSBNYXRoLnBvdygxLXBlcmNlbnQsMikgKiBzdGFydFB0LnggKyAyICogKDEtcGVyY2VudCkgKiBwZXJjZW50ICogY29udHJvbFB0LnggKyBNYXRoLnBvdyhwZXJjZW50LDIpICogZW5kUHQueFxuICAgICAgICB5ID0gTWF0aC5wb3coMS1wZXJjZW50LDIpICogc3RhcnRQdC55ICsgMiAqICgxLXBlcmNlbnQpICogcGVyY2VudCAqIGNvbnRyb2xQdC55ICsgTWF0aC5wb3cocGVyY2VudCwyKSAqIGVuZFB0LnlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB4OiB4LCB5OiB5IFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHBhdGgtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmcgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBlYXNpbmcudXBkYXRlVmFsdWUoKVxuICAgICAgICB2YWx1ZSA9IEBlYXNpbmcudmFsdWVcbiAgICAgICAgXG4gICAgICAgIHBvaW50ID0gQHBhdGguY3VydmVMZW5ndGggLyAxMDAgKiB2YWx1ZVxuICAgICAgICBmb3IgbGVuLCBpIGluIEBwYXRoLmN1cnZlTGVuZ3Roc1xuICAgICAgICAgICAgaWYgcG9pbnQgPD0gbGVuLmxlbiArIGxlbi5vZmZzZXRcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0geyBwZXJjZW50OiAocG9pbnQgLSBsZW4ub2Zmc2V0KSAvIGxlbi5sZW4sIHBhdGg6IEBwYXRoLmRhdGFbaV0gfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGN1cnZlID0gY3VycmVudC5wYXRoXG4gICAgICAgIHBvaW50ID0gQHF1YWRyYXRpY0JlemllclBvaW50KGN1cnZlLnB0MSwgY3VydmUuY3B0LCBjdXJ2ZS5wdDIsIGN1cnJlbnQucGVyY2VudClcblxuICAgICAgICBzd2l0Y2ggQGFuaW1hdGlvblR5cGVcbiAgICAgICAgICAgIHdoZW4gMFxuICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC54ID0gTWF0aC5yb3VuZChwb2ludC54IC0gQHBhdGguZGF0YVswXS5wdDEueCArIEBzdGFydFBvc2l0aW9uLngpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnkgPSBNYXRoLnJvdW5kKHBvaW50LnkgLSBAcGF0aC5kYXRhWzBdLnB0MS55ICsgQHN0YXJ0UG9zaXRpb24ueSlcbiAgICAgICAgICAgIHdoZW4gMlxuICAgICAgICAgICAgICAgIEBvYmplY3QudmlzdWFsLnNjcm9sbC54ID0gTWF0aC5yb3VuZChwb2ludC54IC0gQHBhdGguZGF0YVswXS5wdDEueCArIEBzdGFydFBvc2l0aW9uLngpXG4gICAgICAgICAgICAgICAgQG9iamVjdC52aXN1YWwuc2Nyb2xsLnkgPSBNYXRoLnJvdW5kKHBvaW50LnkgLSBAcGF0aC5kYXRhWzBdLnB0MS55ICsgQHN0YXJ0UG9zaXRpb24ueSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZm9yIGVmZmVjdCBpbiBAZWZmZWN0c1xuICAgICAgICAgICAgaWYgKCFAZWZmZWN0IG9yIChAZWZmZWN0ICE9IGVmZmVjdCBhbmQgQGVmZmVjdD8udGltZSA8PSBlZmZlY3QudGltZSkpIGFuZCBAZWFzaW5nLnRpbWUgPj0gZWZmZWN0LnRpbWVcbiAgICAgICAgICAgICAgICBAZWZmZWN0ID0gZWZmZWN0XG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZChAZWZmZWN0LnNvdW5kKVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nXG4gICAgICAgICAgICBzd2l0Y2ggQGxvb3BUeXBlXG4gICAgICAgICAgICAgICAgd2hlbiAwXG4gICAgICAgICAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgICAgICAgICB3aGVuIDEgIyBOb3JtYWxcbiAgICAgICAgICAgICAgICAgICAgQGVhc2luZy5zdGFydFZhbHVlKDAsIDEwMCwgQGVhc2luZy5kdXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgQHN0YXJ0UG9zaXRpb24ueCA9IEBvYmplY3QuZHN0UmVjdC54XG4gICAgICAgICAgICAgICAgICAgIEBzdGFydFBvc2l0aW9uLnkgPSBAb2JqZWN0LmRzdFJlY3QueVxuICAgICAgICAgICAgICAgIHdoZW4gMiAjIFJldmVyc2VcbiAgICAgICAgICAgICAgICAgICAgQGVmZmVjdCA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgQGVhc2luZy5zdGFydFZhbHVlKEBlYXNpbmcudmFsdWUsIDEwMCAtIEBlYXNpbmcudmFsdWUqMiwgQGVhc2luZy5kdXJhdGlvbilcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIHBhdGgtYW5pbWF0aW9uLiBTY3JvbGxzIHRoZSBnYW1lIG9iamVjdCBhbG9uZyB0aGUgcGF0aC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNjcm9sbFBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXRoIFRoZSBwYXRoIHRvIGZvbGxvdy5cbiAgICAqIEBwYXJhbSB7Z3MuQW5pbWF0aW9uTG9vcFR5cGV9IGxvb3BUeXBlIFRoZSBsb29wLVR5cGUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgY2FsbGVkIGlmIGJsZW5kaW5nIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICAgICAgICAgICAgXG4gICAgc2Nyb2xsOiAocGF0aCwgbG9vcFR5cGUsIGR1cmF0aW9uLCBlYXNpbmdUeXBlLCBlZmZlY3RzLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQHN0YXJ0KHBhdGgsIGxvb3BUeXBlLCBkdXJhdGlvbiwgZWFzaW5nVHlwZSwgY2FsbGJhY2spXG4gICAgICAgIEBhbmltYXRpb25UeXBlID0gMlxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIHBhdGgtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgbW92ZVBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXRoIFRoZSBwYXRoIHRvIGZvbGxvdy5cbiAgICAqIEBwYXJhbSB7Z3MuQW5pbWF0aW9uTG9vcFR5cGV9IGxvb3BUeXBlIFRoZSBsb29wLVR5cGUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgY2FsbGVkIGlmIGJsZW5kaW5nIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICAgICAgICAgICAgXG4gICAgc3RhcnQ6IChwYXRoLCBsb29wVHlwZSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGVmZmVjdHMsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAZWZmZWN0cyA9IGVmZmVjdHMgfHwgW11cbiAgICAgICAgQGVmZmVjdCA9IG51bGxcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgQGxvb3BUeXBlID0gbG9vcFR5cGVcbiAgICAgICAgQHBhdGggPSBkYXRhOiBwYXRofHxbXSwgY3VydmVMZW5ndGg6IG51bGwsIGN1cnZlTGVuZ3RoczogbnVsbFxuICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdUeXBlIHx8IGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbZ3MuRWFzaW5nVHlwZXMuRUFTRV9JTl1cbiAgICAgICAgQGVhc2luZy5zdGFydFZhbHVlKDAsIDEwMCwgZHVyYXRpb24pXG4gICAgICAgIEBzdGFydFBvc2l0aW9uID0geDogQG9iamVjdC5kc3RSZWN0LngsIHk6IEBvYmplY3QuZHN0UmVjdC55XG4gICAgICAgIFxuICAgICAgICBpZiBAcGF0aC5kYXRhLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgIGVsc2UgaWYgZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpXG4gICAgICAgICAgICBwb2ludCA9IEBwYXRoLmRhdGEubGFzdCgpLnB0MlxuICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnggPSBNYXRoLnJvdW5kKHBvaW50LnggLSBAcGF0aC5kYXRhWzBdLnB0MS54ICsgQHN0YXJ0UG9zaXRpb24ueClcbiAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC55ID0gTWF0aC5yb3VuZChwb2ludC55IC0gQHBhdGguZGF0YVswXS5wdDEueSArIEBzdGFydFBvc2l0aW9uLnkpXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgIGVsc2UgaWYgbm90IEBwYXRoLmN1cnZlTGVuZ3RoP1xuICAgICAgICAgICAgbGVuZ3RoID0gMFxuICAgICAgICAgICAgbGVuZ3RocyA9IFtdXG5cbiAgICAgICAgICAgIGZvciBjdXJ2ZSBpbiBAcGF0aC5kYXRhXG4gICAgICAgICAgICAgICAgeCA9IChjdXJ2ZS5jcHQueCAtIGN1cnZlLnB0MS54KSArIChjdXJ2ZS5wdDIueCAtIGN1cnZlLmNwdC54KVxuICAgICAgICAgICAgICAgIHkgPSAoY3VydmUuY3B0LnkgLSBjdXJ2ZS5wdDEueSkgKyAoY3VydmUucHQyLnkgLSBjdXJ2ZS5jcHQueSlcbiAgICAgICAgICAgICAgICBsID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoeCp4ICsgeSp5KSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZW5ndGhzLnB1c2goeyBsZW46IGwsIG9mZnNldDogbGVuZ3RoIH0pXG4gICAgICAgICAgICAgICAgbGVuZ3RoICs9IGxcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXRoLmN1cnZlTGVuZ3RoID0gbGVuZ3RoXG4gICAgICAgICAgICBAcGF0aC5jdXJ2ZUxlbmd0aHMgPSBsZW5ndGhzXG4gICAgICAgICAgICBcbmdzLkNvbXBvbmVudF9QYXRoQW5pbWF0aW9uID0gQ29tcG9uZW50X1BhdGhBbmltYXRpb24iXX0=
//# sourceURL=Component_PathAnimation_58.js