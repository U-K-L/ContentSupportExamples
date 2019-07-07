var Component_ImageAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ImageAnimation = (function(superClass) {
  extend(Component_ImageAnimation, superClass);


  /**
  * Executes a image-based animation.
  *
  * @module gs
  * @class Component_ImageAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_ImageAnimation(data) {
    Component_ImageAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The images to animate through.
    * @property images
    * @type string[]
     */
    this.images = (data != null ? data.images : void 0) || [];

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
  }


  /**
  * Serializes the image-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_ImageAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      images: this.images
    };
  };


  /**
  * Updates the image-animation.
  *
  * @method update
   */

  Component_ImageAnimation.prototype.update = function() {
    Component_ImageAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    this.object.image = this.images[Math.round(this.easing.value)];
    if (!this.easing.isRunning) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * A simple image animation runs from left to right using the game object's
  * image-property.
  *
  * @method changeImages
  * @param {Array} images An array of image names.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_ImageAnimation.prototype.start = function(images, duration, easingType, callback) {
    this.callback = callback;
    this.images = images;
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    return this.easing.startValue(0, images.length - 1, duration);
  };

  return Component_ImageAnimation;

})(gs.Component_Animation);

gs.Component_ImageAnimation = Component_ImageAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGtDQUFDLElBQUQ7SUFDVCwyREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELG1CQUFVLElBQUksQ0FBRSxnQkFBTixJQUFnQjs7QUFFMUI7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixpQkFBZ0IsSUFBSSxDQUFFLGVBQXRCO0VBZkw7OztBQWlCYjs7Ozs7O3FDQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7TUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BRFQ7O0VBRFU7OztBQUlkOzs7Ozs7cUNBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixzREFBQSxTQUFBO0lBQ0EsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtBQUE4QixhQUE5Qjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUEsTUFBTyxDQUFBLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFuQixDQUFBO0lBRXhCLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7bURBQ0ksSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFEeEI7O0VBUEk7OztBQVVSOzs7Ozs7Ozs7OztxQ0FVQSxLQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixFQUErQixRQUEvQjtJQUNILElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsVUFBQSxJQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBWSxDQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBZjtXQUNwRCxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBTSxDQUFDLE1BQVAsR0FBYyxDQUFwQyxFQUF1QyxRQUF2QztFQUpHOzs7O0dBN0Q0QixFQUFFLENBQUM7O0FBbUUxQyxFQUFFLENBQUMsd0JBQUgsR0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9JbWFnZUFuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0ltYWdlQW5pbWF0aW9uIGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICMjIypcbiAgICAqIEV4ZWN1dGVzIGEgaW1hZ2UtYmFzZWQgYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfSW1hZ2VBbmltYXRpb25cbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBpbWFnZXMgdG8gYW5pbWF0ZSB0aHJvdWdoLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZXNcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdbXVxuICAgICAgICAjIyNcbiAgICAgICAgQGltYWdlcyA9IGRhdGE/LmltYWdlcyB8fCBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBlYXNpbmctb2JqZWN0IHVzZWQgZm9yIHRoZSBhbmltYXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGVhc2luZ1xuICAgICAgICAqIEB0eXBlIGdzLkVhc2luZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGVhc2luZyA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8uZWFzaW5nKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSBpbWFnZS1hbmltYXRpb24gaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgIyMjXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBlYXNpbmc6IEBlYXNpbmcsXG4gICAgICAgIGltYWdlczogQGltYWdlc1xuICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGltYWdlLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZyB0aGVuIHJldHVyblxuICBcbiAgICAgICAgQGVhc2luZy51cGRhdGVWYWx1ZSgpXG4gICAgICAgIEBvYmplY3QuaW1hZ2UgPSBAaW1hZ2VzW01hdGgucm91bmQoQGVhc2luZy52YWx1ZSldXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmdcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBIHNpbXBsZSBpbWFnZSBhbmltYXRpb24gcnVucyBmcm9tIGxlZnQgdG8gcmlnaHQgdXNpbmcgdGhlIGdhbWUgb2JqZWN0J3NcbiAgICAqIGltYWdlLXByb3BlcnR5LlxuICAgICpcbiAgICAqIEBtZXRob2QgY2hhbmdlSW1hZ2VzXG4gICAgKiBAcGFyYW0ge0FycmF5fSBpbWFnZXMgQW4gYXJyYXkgb2YgaW1hZ2UgbmFtZXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgY2FsbGVkIGlmIGJsZW5kaW5nIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICAgICAgICBcbiAgICBzdGFydDogKGltYWdlcywgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAaW1hZ2VzID0gaW1hZ2VzXG4gICAgICAgIEBlYXNpbmcudHlwZSA9IGVhc2luZ1R5cGUgfHwgZ3MuRWFzaW5ncy5FQVNFX0xJTkVBUltncy5FYXNpbmdUeXBlcy5FQVNFX0lOXVxuICAgICAgICBAZWFzaW5nLnN0YXJ0VmFsdWUoMCwgaW1hZ2VzLmxlbmd0aC0xLCBkdXJhdGlvbilcbiAgICAgICAgXG5ncy5Db21wb25lbnRfSW1hZ2VBbmltYXRpb24gPSBDb21wb25lbnRfSW1hZ2VBbmltYXRpb24iXX0=
//# sourceURL=Component_ImageAnimation_134.js