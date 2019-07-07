var Component_MaskAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_MaskAnimation = (function(superClass) {
  extend(Component_MaskAnimation, superClass);


  /**
  * Executes a mask-animation on a game-object.
  *
  * @module gs
  * @class Component_MaskAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_MaskAnimation(data) {
    Component_MaskAnimation.__super__.constructor.apply(this, arguments);
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
    this.callback = null;
    this.animationType = (data != null ? data.animationType : void 0) || 0;
  }


  /**
  * Serializes the mask-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_MaskAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      animationType: this.animationType
    };
  };


  /**
  * Updates the mask-animation.
  *
  * @method update
   */

  Component_MaskAnimation.prototype.update = function() {
    Component_MaskAnimation.__super__.update.call(this);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    this.object.mask.value = this.easing.value;
    if (!this.easing.isRunning) {
      if (this.animationType < 1) {
        this.object.mask.source = null;
        this.object.mask.vague = 0;
      }
      this.animationType = 0;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Lets the game object appear on screen using a masking-effect.
  *
  * @method maskIn
  * @param {gs.Mask} mask The mask used for the animation.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MaskAnimation.prototype.maskIn = function(mask, duration, easing, callback) {
    var ref;
    this.easing.type = easing;
    this.animationType = 0;
    this.callback = callback;
    if (duration === 0 || this.isInstantSkip()) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.object.mask.type = 1;
      this.object.mask.source = ResourceManager.getBitmap("Graphics/Masks/" + ((ref = mask.graphic) != null ? ref.name : void 0));
      this.object.mask.vague = mask.vague;
      this.object.mask.value = 255;
      return this.easing.startValue(255, -255 - mask.vague, duration);
    }
  };


  /**
  * Lets the game object disappear from screen using a masking-effect.
  *
  * @method maskIn
  * @param {gs.Mask} mask The mask used for the animation.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MaskAnimation.prototype.maskOut = function(mask, duration, easing, callback) {
    var ref;
    this.easing.type = easing;
    this.animationType = 0;
    this.callback = callback;
    if (duration === 0 || this.isInstantSkip()) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.object.mask.type = 1;
      this.object.mask.source = ResourceManager.getBitmap("Graphics/Masks/" + ((ref = mask.graphic) != null ? ref.name : void 0));
      this.object.mask.vague = mask.vague;
      this.object.mask.value = 0;
      return this.easing.startValue(-mask.vague, 255 + mask.vague, duration);
    }
  };


  /**
  * Description follows...
  *
  * @method maskTo
  * @param {gs.Mask} mask The mask used for the animation.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_MaskAnimation.prototype.maskTo = function(mask, duration, easing, callback) {
    var ref, ref1, ref2, ref3;
    this.easing.type = easing;
    this.animationType = 1;
    this.callback = callback;
    this.object.mask.type = 1;
    if (mask.sourceType === 0) {
      this.object.mask.source = ResourceManager.getBitmap("Graphics/Masks/" + ((ref = mask.graphic) != null ? ref.name : void 0));
    } else {
      if (((ref1 = this.object.mask.source) != null ? ref1.videoElement : void 0) != null) {
        this.object.mask.source.pause();
      }
      this.object.mask.source = ResourceManager.getVideo("Movies/" + mask.video.name);
      if ((ref2 = this.object.mask.source) != null) {
        ref2.play();
      }
      if ((ref3 = this.object.mask.source) != null) {
        ref3.loop = true;
      }
    }
    this.object.mask.vague = mask.vague;
    if (duration === 0 || this.isInstantSkip()) {
      this.animationType = 0;
      this.object.mask.value = mask.value;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.startValue(this.object.mask.value, mask.value - this.object.mask.value, duration);
    }
  };

  return Component_MaskAnimation;

})(gs.Component_Animation);

gs.Component_MaskAnimation = Component_MaskAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGlDQUFDLElBQUQ7SUFDVCwwREFBQSxTQUFBO0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixpQkFBZ0IsSUFBSSxDQUFFLGVBQXRCO0lBQ2QsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxhQUFELG1CQUFpQixJQUFJLENBQUUsdUJBQU4sSUFBdUI7RUFML0I7OztBQU9iOzs7Ozs7b0NBS0EsWUFBQSxHQUFjLFNBQUE7V0FDVjtNQUFBLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBVDtNQUNBLGFBQUEsRUFBZSxJQUFDLENBQUEsYUFEaEI7O0VBRFU7OztBQUlkOzs7Ozs7b0NBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixrREFBQTtJQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7QUFBOEIsYUFBOUI7O0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7SUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFiLEdBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFFN0IsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtNQUNJLElBQUcsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBcEI7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFiLEdBQXNCO1FBQ3RCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsR0FBcUIsRUFGekI7O01BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7bURBQ2pCLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBTHhCOztFQVBJOzs7QUFjUjs7Ozs7Ozs7OztvQ0FTQSxNQUFBLEdBQVEs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Q0FBQyxJQUE5Qzs7WUFDSCxDQUFFLElBQXJCLENBQUE7OztZQUNtQixDQUFFLElBQXJCLEdBQTRCO09BUmhDOztJQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsR0FBcUIsSUFBSSxDQUFDO0lBRTFCLElBQUcsUUFBQSxLQUFZLENBQVosSUFBaUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFwQjtNQUNJLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsR0FBcUIsSUFBSSxDQUFDO21EQUMxQixJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUh4QjtLQUFBLE1BQUE7YUFLSSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBaEMsRUFBdUMsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFqRSxFQUF3RSxRQUF4RSxFQUxKOztFQXBCSTs7OztHQXRHMEIsRUFBRSxDQUFDOztBQWlJekMsRUFBRSxDQUFDLHVCQUFILEdBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfTWFza0FuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X01hc2tBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBtYXNrLWFuaW1hdGlvbiBvbiBhIGdhbWUtb2JqZWN0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfTWFza0FuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAZWFzaW5nID0gbmV3IGdzLkVhc2luZyhudWxsLCBkYXRhPy5lYXNpbmcpXG4gICAgICAgIEBjYWxsYmFjayA9IG51bGxcbiAgICAgICAgQGFuaW1hdGlvblR5cGUgPSBkYXRhPy5hbmltYXRpb25UeXBlIHx8IDBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSBtYXNrLWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgICAgIFxuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgZWFzaW5nOiBAZWFzaW5nLFxuICAgICAgICBhbmltYXRpb25UeXBlOiBAYW5pbWF0aW9uVHlwZVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG1hc2stYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmcgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBlYXNpbmcudXBkYXRlVmFsdWUoKVxuICAgICAgICBAb2JqZWN0Lm1hc2sudmFsdWUgPSBAZWFzaW5nLnZhbHVlXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmdcbiAgICAgICAgICAgIGlmIEBhbmltYXRpb25UeXBlIDwgMVxuICAgICAgICAgICAgICAgIEBvYmplY3QubWFzay5zb3VyY2UgPSBudWxsXG4gICAgICAgICAgICAgICAgQG9iamVjdC5tYXNrLnZhZ3VlID0gMFxuICAgICAgICAgICAgQGFuaW1hdGlvblR5cGUgPSAwXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgXG4gICAgIyMjKlxuICAgICogTGV0cyB0aGUgZ2FtZSBvYmplY3QgYXBwZWFyIG9uIHNjcmVlbiB1c2luZyBhIG1hc2tpbmctZWZmZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgbWFza0luXG4gICAgKiBAcGFyYW0ge2dzLk1hc2t9IG1hc2sgVGhlIG1hc2sgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjay1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICAgXG4gICAgbWFza0luOiAobWFzaywgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2spIC0+XG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1xuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDBcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudHlwZSA9IDFcbiAgICAgICAgICAgIEBvYmplY3QubWFzay5zb3VyY2UgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3ttYXNrLmdyYXBoaWM/Lm5hbWV9XCIpXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudmFndWUgPSBtYXNrLnZhZ3VlXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudmFsdWUgPSAyNTVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQGVhc2luZy5zdGFydFZhbHVlKDI1NSwgLTI1NSAtIG1hc2sudmFndWUsIGR1cmF0aW9uKVxuICAgIFxuICAgICMjIypcbiAgICAqIExldHMgdGhlIGdhbWUgb2JqZWN0IGRpc2FwcGVhciBmcm9tIHNjcmVlbiB1c2luZyBhIG1hc2tpbmctZWZmZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgbWFza0luXG4gICAgKiBAcGFyYW0ge2dzLk1hc2t9IG1hc2sgVGhlIG1hc2sgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjay1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICBcbiAgICBtYXNrT3V0OiAobWFzaywgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2spIC0+XG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1xuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDBcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudHlwZSA9IDFcbiAgICAgICAgICAgIEBvYmplY3QubWFzay5zb3VyY2UgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3ttYXNrLmdyYXBoaWM/Lm5hbWV9XCIpXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudmFndWUgPSBtYXNrLnZhZ3VlXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2sudmFsdWUgPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBlYXNpbmcuc3RhcnRWYWx1ZSgtbWFzay52YWd1ZSwgMjU1ICsgbWFzay52YWd1ZSwgZHVyYXRpb24pXG4gICAgXG4gICAgIyMjKlxuICAgICogRGVzY3JpcHRpb24gZm9sbG93cy4uLlxuICAgICpcbiAgICAqIEBtZXRob2QgbWFza1RvXG4gICAgKiBAcGFyYW0ge2dzLk1hc2t9IG1hc2sgVGhlIG1hc2sgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjay1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICAgXG4gICAgbWFza1RvOiAobWFzaywgZHVyYXRpb24sIGVhc2luZywgY2FsbGJhY2spIC0+XG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1xuICAgICAgICBAYW5pbWF0aW9uVHlwZSA9IDFcbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcblxuICAgICAgICBAb2JqZWN0Lm1hc2sudHlwZSA9IDFcblxuICAgICAgICAjIEZJWE1FOiBEb3VibGVkIGNvZGUsIHNlZSBDb21tYW5kSW50ZXJwcmV0ZXIuY29tbWFuZE1hc2tQaWN0dXJlXG4gICAgICAgIGlmIG1hc2suc291cmNlVHlwZSA9PSAwXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2suc291cmNlID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL01hc2tzLyN7bWFzay5ncmFwaGljPy5uYW1lfVwiKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBAb2JqZWN0Lm1hc2suc291cmNlPy52aWRlb0VsZW1lbnQ/XG4gICAgICAgICAgICAgICAgQG9iamVjdC5tYXNrLnNvdXJjZS5wYXVzZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2suc291cmNlID0gUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiTW92aWVzLyN7bWFzay52aWRlby5uYW1lfVwiKVxuICAgICAgICAgICAgQG9iamVjdC5tYXNrLnNvdXJjZT8ucGxheSgpXG4gICAgICAgICAgICBAb2JqZWN0Lm1hc2suc291cmNlPy5sb29wID0gdHJ1ZVxuICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3QubWFzay52YWd1ZSA9IG1hc2sudmFndWVcblxuICAgICAgICBpZiBkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKClcbiAgICAgICAgICAgIEBhbmltYXRpb25UeXBlID0gMFxuICAgICAgICAgICAgQG9iamVjdC5tYXNrLnZhbHVlID0gbWFzay52YWx1ZVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0VmFsdWUoQG9iamVjdC5tYXNrLnZhbHVlLCBtYXNrLnZhbHVlIC0gQG9iamVjdC5tYXNrLnZhbHVlLCBkdXJhdGlvbilcbiAgICAgICAgXG5ncy5Db21wb25lbnRfTWFza0FuaW1hdGlvbiA9IENvbXBvbmVudF9NYXNrQW5pbWF0aW9uIl19
//# sourceURL=Component_MaskAnimation_37.js