var Component_WobbleAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_WobbleAnimation = (function(superClass) {
  extend(Component_WobbleAnimation, superClass);


  /**
  * Executes a blur-animation on a game-object.
  *
  * @module gs
  * @class Component_WobbleAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_WobbleAnimation(data) {
    Component_WobbleAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.powerEasing = new gs.Easing(null, data != null ? data.powerEasing : void 0);
    this.speedEasing = new gs.Easing(null, data != null ? data.speedEasing : void 0);
  }


  /**
  * Updates the blend-animation.
  *
  * @method update
   */

  Component_WobbleAnimation.prototype.update = function() {
    Component_WobbleAnimation.__super__.update.apply(this, arguments);
    if (!this.powerEasing.isRunning && !this.speedEasing.isRunning) {
      return;
    }
    this.powerEasing.updateValue();
    this.speedEasing.updateValue();
    this.object.effects.wobble.power = this.powerEasing.value;
    this.object.effects.wobble.speed = this.speedEasing.value;
    if (!this.powerEasing.isRunning && !this.speedEasing.isRunning) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the blend-animation.
  *
  * @method start
  * @param {number} power The target power.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if the animation is finished.
   */

  Component_WobbleAnimation.prototype.start = function(power, speed, duration, easingType, callback) {
    this.callback = callback;
    this.powerEasing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    this.speedEasing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (this.object.effects.wobble.power === power || this.object.effects.wobble.speed === speed) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
    if (duration === 0 || this.isInstantSkip()) {
      this.object.effects.wobble.power = power;
      this.object.effects.wobble.speed = speed;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.powerEasing.startValue(this.object.effects.wobble.power, power - this.object.effects.wobble.power, duration);
      return this.speedEasing.startValue(this.object.effects.wobble.speed, speed - this.object.effects.wobble.speed, duration);
    }
  };

  return Component_WobbleAnimation;

})(gs.Component_Animation);

gs.Component_WobbleAnimation = Component_WobbleAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEseUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLG1DQUFDLElBQUQ7SUFDVCw0REFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLGlCQUFnQixJQUFJLENBQUUsb0JBQXRCO0lBQ25CLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLGlCQUFnQixJQUFJLENBQUUsb0JBQXRCO0VBVFY7OztBQVdiOzs7Ozs7c0NBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSix1REFBQSxTQUFBO0lBQ0EsSUFBRyxDQUFDLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBZCxJQUE0QixDQUFDLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBN0M7QUFBNEQsYUFBNUQ7O0lBRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUE7SUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixHQUErQixJQUFDLENBQUEsV0FBVyxDQUFDO0lBQzVDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixHQUErQixJQUFDLENBQUEsV0FBVyxDQUFDO0lBRTVDLElBQUcsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQWQsSUFBNEIsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQTdDO21EQUNJLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBRHhCOztFQVRJOzs7QUFZUjs7Ozs7Ozs7OztzQ0FTQSxLQUFBLEdBQU8sU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLFFBQWYsRUFBeUIsVUFBekIsRUFBcUMsUUFBckM7SUFDSCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLEdBQW9CLFVBQUEsSUFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVksQ0FBQSxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQWY7SUFDekQsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLEdBQW9CLFVBQUEsSUFBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVksQ0FBQSxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQWY7SUFDekQsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBdkIsS0FBZ0MsS0FBaEMsSUFBeUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQXZCLEtBQWdDLEtBQTVFO0FBQXVGLG1EQUFPLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBQWxIOztJQUVBLElBQUcsUUFBQSxLQUFZLENBQVosSUFBaUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFwQjtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixHQUErQjtNQUMvQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBdkIsR0FBK0I7bURBQy9CLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBSHhCO0tBQUEsTUFBQTtNQUtJLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBL0MsRUFBc0QsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFyRixFQUE0RixRQUE1RjthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBL0MsRUFBc0QsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFyRixFQUE0RixRQUE1RixFQU5KOztFQU5HOzs7O0dBL0M2QixFQUFFLENBQUM7O0FBNkQzQyxFQUFFLENBQUMseUJBQUgsR0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9Xb2JibGVBbmltYXRpb25cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9Xb2JibGVBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBibHVyLWFuaW1hdGlvbiBvbiBhIGdhbWUtb2JqZWN0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfV29iYmxlQW5pbWF0aW9uXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZWFzaW5nLW9iamVjdCB1c2VkIGZvciB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBlYXNpbmdcbiAgICAgICAgKiBAdHlwZSBncy5FYXNpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBwb3dlckVhc2luZyA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8ucG93ZXJFYXNpbmcpXG4gICAgICAgIEBzcGVlZEVhc2luZyA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8uc3BlZWRFYXNpbmcpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGJsZW5kLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgaWYgIUBwb3dlckVhc2luZy5pc1J1bm5pbmcgYW5kICFAc3BlZWRFYXNpbmcuaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG5cbiAgICAgICAgQHBvd2VyRWFzaW5nLnVwZGF0ZVZhbHVlKClcbiAgICAgICAgQHNwZWVkRWFzaW5nLnVwZGF0ZVZhbHVlKClcbiAgICAgICAgQG9iamVjdC5lZmZlY3RzLndvYmJsZS5wb3dlciA9IEBwb3dlckVhc2luZy52YWx1ZVxuICAgICAgICBAb2JqZWN0LmVmZmVjdHMud29iYmxlLnNwZWVkID0gQHNwZWVkRWFzaW5nLnZhbHVlXG4gICAgICAgIFxuICAgICAgICBpZiAhQHBvd2VyRWFzaW5nLmlzUnVubmluZyBhbmQgIUBzcGVlZEVhc2luZy5pc1J1bm5pbmdcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIGJsZW5kLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gcG93ZXIgVGhlIHRhcmdldCBwb3dlci5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZ1R5cGUgVGhlIGVhc2luZy10eXBlLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjayBjYWxsZWQgaWYgdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC4gXG4gICAgIyMjICBcbiAgICBzdGFydDogKHBvd2VyLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAcG93ZXJFYXNpbmcudHlwZSA9IGVhc2luZ1R5cGUgfHwgZ3MuRWFzaW5ncy5FQVNFX0xJTkVBUltncy5FYXNpbmdUeXBlcy5FQVNFX0lOXVxuICAgICAgICBAc3BlZWRFYXNpbmcudHlwZSA9IGVhc2luZ1R5cGUgfHwgZ3MuRWFzaW5ncy5FQVNFX0xJTkVBUltncy5FYXNpbmdUeXBlcy5FQVNFX0lOXVxuICAgICAgICBpZiBAb2JqZWN0LmVmZmVjdHMud29iYmxlLnBvd2VyID09IHBvd2VyIG9yIEBvYmplY3QuZWZmZWN0cy53b2JibGUuc3BlZWQgPT0gc3BlZWQgdGhlbiByZXR1cm4gQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBcbiAgICAgICAgaWYgZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpXG4gICAgICAgICAgICBAb2JqZWN0LmVmZmVjdHMud29iYmxlLnBvd2VyID0gcG93ZXJcbiAgICAgICAgICAgIEBvYmplY3QuZWZmZWN0cy53b2JibGUuc3BlZWQgPSBzcGVlZFxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcG93ZXJFYXNpbmcuc3RhcnRWYWx1ZShAb2JqZWN0LmVmZmVjdHMud29iYmxlLnBvd2VyLCBwb3dlciAtIEBvYmplY3QuZWZmZWN0cy53b2JibGUucG93ZXIsIGR1cmF0aW9uKVxuICAgICAgICAgICAgQHNwZWVkRWFzaW5nLnN0YXJ0VmFsdWUoQG9iamVjdC5lZmZlY3RzLndvYmJsZS5zcGVlZCwgc3BlZWQgLSBAb2JqZWN0LmVmZmVjdHMud29iYmxlLnNwZWVkLCBkdXJhdGlvbilcbiAgICAgICAgXG5ncy5Db21wb25lbnRfV29iYmxlQW5pbWF0aW9uID0gQ29tcG9uZW50X1dvYmJsZUFuaW1hdGlvbiJdfQ==
//# sourceURL=Component_WobbleAnimation_143.js