var Component_BlendAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_BlendAnimation = (function(superClass) {
  extend(Component_BlendAnimation, superClass);


  /**
  * Executes a blend-animation on a game-object.
  *
  * @module gs
  * @class Component_BlendAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_BlendAnimation(data) {
    Component_BlendAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
  }


  /**
  * Serializes the blend-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_BlendAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing
    };
  };


  /**
  * Updates the blend-animation.
  *
  * @method update
   */

  Component_BlendAnimation.prototype.update = function() {
    Component_BlendAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    this.object.opacity = this.easing.value;
    if (!this.easing.isRunning) {
      this.object.opacity = Math.round(this.object.opacity);
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the blend-animation.
  *
  * @method start
  * @param {number} opacity The target opacity.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_BlendAnimation.prototype.start = function(opacity, duration, easingType, callback) {
    this.callback = callback;
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (this.object.opacity === opacity) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
    if (duration === 0 || this.isInstantSkip()) {
      this.object.opacity = opacity;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.startValue(this.object.opacity, opacity - this.object.opacity, duration);
    }
  };

  return Component_BlendAnimation;

})(gs.Component_Animation);

gs.Component_BlendAnimation = Component_BlendAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGtDQUFDLElBQUQ7SUFDVCwyREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsaUJBQWdCLElBQUksQ0FBRSxlQUF0QjtFQVJMOzs7QUFVYjs7Ozs7O3FDQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7O0VBRFU7OztBQUdkOzs7Ozs7cUNBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixzREFBQSxTQUFBO0lBQ0EsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtBQUE4QixhQUE5Qjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDO0lBRTFCLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsR0FBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQW5CO21EQUNsQixJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUZ4Qjs7RUFQSTs7O0FBV1I7Ozs7Ozs7Ozs7cUNBU0EsS0FBQSxHQUFPLFNBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsVUFBcEIsRUFBZ0MsUUFBaEM7SUFDSCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsVUFBQSxJQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBWSxDQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBZjtJQUNwRCxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixLQUFtQixPQUF0QjtBQUFtQyxtREFBTyxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUE5RDs7SUFFQSxJQUFHLFFBQUEsS0FBWSxDQUFaLElBQWlCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBcEI7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsR0FBa0I7bURBQ2xCLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBRnhCO0tBQUEsTUFBQTthQUlJLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQTNCLEVBQW9DLE9BQUEsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQXRELEVBQStELFFBQS9ELEVBSko7O0VBTEc7Ozs7R0FyRDRCLEVBQUUsQ0FBQzs7QUFnRTFDLEVBQUUsQ0FBQyx3QkFBSCxHQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0JsZW5kQW5pbWF0aW9uXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfQmxlbmRBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBibGVuZC1hbmltYXRpb24gb24gYSBnYW1lLW9iamVjdC5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0JsZW5kQW5pbWF0aW9uXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZWFzaW5nLW9iamVjdCB1c2VkIGZvciB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBlYXNpbmdcbiAgICAgICAgKiBAdHlwZSBncy5FYXNpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBlYXNpbmcgPSBuZXcgZ3MuRWFzaW5nKG51bGwsIGRhdGE/LmVhc2luZylcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgYmxlbmQtYW5pbWF0aW9uIGludG8gYSBkYXRhLWJ1bmRsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHRvRGF0YUJ1bmRsZVxuICAgICMjI1xuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgZWFzaW5nOiBAZWFzaW5nXG4gICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGJsZW5kLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG5cbiAgICAgICAgQGVhc2luZy51cGRhdGVWYWx1ZSgpXG4gICAgICAgIEBvYmplY3Qub3BhY2l0eSA9IEBlYXNpbmcudmFsdWVcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZ1xuICAgICAgICAgICAgQG9iamVjdC5vcGFjaXR5ID0gTWF0aC5yb3VuZChAb2JqZWN0Lm9wYWNpdHkpXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSBibGVuZC1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBzdGFydFxuICAgICogQHBhcmFtIHtudW1iZXJ9IG9wYWNpdHkgVGhlIHRhcmdldCBvcGFjaXR5LlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrIGNhbGxlZCBpZiBibGVuZGluZyBpcyBmaW5pc2hlZC4gXG4gICAgIyMjICBcbiAgICBzdGFydDogKG9wYWNpdHksIGR1cmF0aW9uLCBlYXNpbmdUeXBlLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQGNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgQGVhc2luZy50eXBlID0gZWFzaW5nVHlwZSB8fCBncy5FYXNpbmdzLkVBU0VfTElORUFSW2dzLkVhc2luZ1R5cGVzLkVBU0VfSU5dXG4gICAgICAgIGlmIEBvYmplY3Qub3BhY2l0eSA9PSBvcGFjaXR5IHRoZW4gcmV0dXJuIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQG9iamVjdC5vcGFjaXR5ID0gb3BhY2l0eVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0VmFsdWUoQG9iamVjdC5vcGFjaXR5LCBvcGFjaXR5IC0gQG9iamVjdC5vcGFjaXR5LCBkdXJhdGlvbilcbiAgICAgICAgXG5ncy5Db21wb25lbnRfQmxlbmRBbmltYXRpb24gPSBDb21wb25lbnRfQmxlbmRBbmltYXRpb24iXX0=
//# sourceURL=Component_BlendAnimation_25.js