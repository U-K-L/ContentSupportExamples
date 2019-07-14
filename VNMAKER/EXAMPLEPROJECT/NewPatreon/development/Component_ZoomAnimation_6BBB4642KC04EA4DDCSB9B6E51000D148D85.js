var Component_ZoomAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ZoomAnimation = (function(superClass) {
  extend(Component_ZoomAnimation, superClass);


  /**
  * Executes a zoom-animation on a game-object.
  *
  * @module gs
  * @class Component_ZoomAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_ZoomAnimation(data) {
    Component_ZoomAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
  }


  /**
  * Serializes the zoom-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_ZoomAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing
    };
  };


  /**
  * Updates the zoom-animation.
  *
  * @method update
   */

  Component_ZoomAnimation.prototype.update = function() {
    Component_ZoomAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updatePosition();
    this.object.zoom.x = this.easing.x;
    this.object.zoom.y = this.easing.y;
    if (!this.easing.isRunning) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the zoom-animation.
  *
  * @method zoomTo
  * @param {number} x The x-axis zoom-factor.
  * @param {number} y The y-axis zoom-factor.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_ZoomAnimation.prototype.start = function(x, y, duration, easingType, callback) {
    this.callback = callback;
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (duration === 0 || this.isInstantSkip()) {
      this.object.zoom.x = x;
      this.object.zoom.y = y;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      return this.easing.start(this.object.zoom.x, this.object.zoom.y, x, y, duration);
    }
  };

  return Component_ZoomAnimation;

})(gs.Component_Animation);

gs.Component_ZoomAnimation = Component_ZoomAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGlDQUFDLElBQUQ7SUFDVCwwREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsaUJBQWdCLElBQUksQ0FBRSxlQUF0QjtFQVJMOzs7QUFVYjs7Ozs7O29DQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7O0VBRFU7OztBQUdkOzs7Ozs7b0NBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixxREFBQSxTQUFBO0lBRUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtBQUE4QixhQUE5Qjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQWIsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUN6QixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFiLEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFFekIsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjttREFDSSxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUR4Qjs7RUFUSTs7O0FBWVI7Ozs7Ozs7Ozs7O29DQVVBLEtBQUEsR0FBTyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sUUFBUCxFQUFpQixVQUFqQixFQUE2QixRQUE3QjtJQUNILElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxVQUFBLElBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFZLENBQUEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFmO0lBQ3BELElBQUcsUUFBQSxLQUFZLENBQVosSUFBaUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFwQjtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQWIsR0FBaUI7TUFDakIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBYixHQUFpQjttREFDakIsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFIeEI7S0FBQSxNQUFBO2FBS0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBM0IsRUFBOEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBM0MsRUFBOEMsQ0FBOUMsRUFBaUQsQ0FBakQsRUFBb0QsUUFBcEQsRUFMSjs7RUFIRzs7OztHQXZEMkIsRUFBRSxDQUFDOztBQWtFekMsRUFBRSxDQUFDLHVCQUFILEdBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfWm9vbUFuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X1pvb21BbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSB6b29tLWFuaW1hdGlvbiBvbiBhIGdhbWUtb2JqZWN0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfWm9vbUFuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGVhc2luZy1vYmplY3QgdXNlZCBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgZWFzaW5nXG4gICAgICAgICogQHR5cGUgZ3MuRWFzaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAZWFzaW5nID0gbmV3IGdzLkVhc2luZyhudWxsLCBkYXRhPy5lYXNpbmcpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIHpvb20tYW5pbWF0aW9uIGludG8gYSBkYXRhLWJ1bmRsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHRvRGF0YUJ1bmRsZVxuICAgICMjI1xuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgZWFzaW5nOiBAZWFzaW5nXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHpvb20tYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBlYXNpbmcuaXNSdW5uaW5nIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAZWFzaW5nLnVwZGF0ZVBvc2l0aW9uKClcbiAgICAgICAgQG9iamVjdC56b29tLnggPSBAZWFzaW5nLnhcbiAgICAgICAgQG9iamVjdC56b29tLnkgPSBAZWFzaW5nLnlcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZ1xuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyB0aGUgem9vbS1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB6b29tVG9cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IFRoZSB4LWF4aXMgem9vbS1mYWN0b3IuXG4gICAgKiBAcGFyYW0ge251bWJlcn0geSBUaGUgeS1heGlzIHpvb20tZmFjdG9yLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrIGNhbGxlZCBpZiBibGVuZGluZyBpcyBmaW5pc2hlZC4gXG4gICAgIyMjICAgIFxuICAgIHN0YXJ0OiAoeCwgeSwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdUeXBlIHx8IGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbZ3MuRWFzaW5nVHlwZXMuRUFTRV9JTl1cbiAgICAgICAgaWYgZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpXG4gICAgICAgICAgICBAb2JqZWN0Lnpvb20ueCA9IHhcbiAgICAgICAgICAgIEBvYmplY3Quem9vbS55ID0geVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0KEBvYmplY3Quem9vbS54LCBAb2JqZWN0Lnpvb20ueSwgeCwgeSwgZHVyYXRpb24pXG5cbiAgICAgICAgXG5ncy5Db21wb25lbnRfWm9vbUFuaW1hdGlvbiA9IENvbXBvbmVudF9ab29tQW5pbWF0aW9uIl19
//# sourceURL=Component_ZoomAnimation_112.js