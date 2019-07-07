
/**
* Different methods of field-animation.
*
* @module gs
* @class AnimationLoopType
* @memberof gs
* @static
* @final
 */
var Component_FieldAnimation, FieldAnimationMethod,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FieldAnimationMethod = (function() {
  function FieldAnimationMethod() {}

  FieldAnimationMethod.initialize = function() {

    /**
    * Set the value calculated by the easing-logic.
    * @property SET
    * @static
    * @final
     */
    this.SET = 0;

    /**
    * Adds the value calculated by the easing-logic.
    * @property ADD
    * @static
    * @final
     */
    return this.ADD = 1;
  };

  return FieldAnimationMethod;

})();

FieldAnimationMethod.initialize();

gs.FieldAnimationMethod = FieldAnimationMethod;

Component_FieldAnimation = (function(superClass) {
  extend(Component_FieldAnimation, superClass);


  /**
  * Executes a field-animation. A field-animation animates a certain
  * property of the game-object as long as it is a number-property.
  *
  * @module gs
  * @class Component_FieldAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_FieldAnimation(data) {
    Component_FieldAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The field to animate as property-path.
    * @property field
    * @type string
     */
    this.field = data != null ? data.field : void 0;

    /**
    * The animation-method.
    * @property method
    * @type gs.FieldAnimationMethod
    * @default gs.FieldAnimationMethod.SET
     */
    this.method = data != null ? data.method : void 0;

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
  }


  /**
  * Serializes the path-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_FieldAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      method: this.method,
      field: this.field
    };
  };


  /**
  * Updates the field-animation.
  *
  * @method update
   */

  Component_FieldAnimation.prototype.update = function() {
    var value;
    Component_FieldAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    value = ui.Component_BindingHandler.resolveFieldPath(this.object, this.field);
    if (!this.method) {
      value.set(this.object, this.easing.value);
    } else {
      value.set(this.object, value.get(this.object) + this.easing.value);
    }
    if (!this.easing.isRunning) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the field-animation.
  *
  * @method start
  * @param {number} Value The target value.
  * @param {string} field The name of the field/property.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if blending is finished.
   */

  Component_FieldAnimation.prototype.start = function(value, field, duration, easingType, callback) {
    var startValue, valueField;
    this.callback = callback;
    this.field = field;
    this.easing.type = easingType || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_IN];
    if (duration === 0 || this.isInstantSkip()) {
      valueField = ui.Component_BindingHandler.resolveFieldPath(this.object, this.field);
      valueField.set(this.object, value);
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      startValue = ui.Component_BindingHandler.fieldValue(this.object, field);
      return this.easing.startValue(startValue, value - startValue, duration);
    }
  };

  return Component_FieldAnimation;

})(gs.Component_Animation);

gs.Component_FieldAnimation = Component_FieldAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7O0FBQUEsSUFBQSw4Q0FBQTtFQUFBOzs7QUFTTTs7O0VBQ0Ysb0JBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQTs7QUFDVDs7Ozs7O0lBTUEsSUFBQyxDQUFBLEdBQUQsR0FBTzs7QUFFUDs7Ozs7O1dBTUEsSUFBQyxDQUFBLEdBQUQsR0FBTztFQWZFOzs7Ozs7QUFpQmpCLG9CQUFvQixDQUFDLFVBQXJCLENBQUE7O0FBQ0EsRUFBRSxDQUFDLG9CQUFILEdBQTBCOztBQUVwQjs7OztBQUNGOzs7Ozs7Ozs7OztFQVVhLGtDQUFDLElBQUQ7SUFDVCwyREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELGtCQUFTLElBQUksQ0FBRTs7QUFFZjs7Ozs7O0lBTUEsSUFBQyxDQUFBLE1BQUQsa0JBQVUsSUFBSSxDQUFFOztBQUVoQjs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLGlCQUFnQixJQUFJLENBQUUsZUFBdEI7RUF2Qkw7OztBQXlCYjs7Ozs7O3FDQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7TUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BRFQ7TUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBRlI7O0VBRFU7OztBQU1kOzs7Ozs7cUNBS0EsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEsc0RBQUEsU0FBQTtJQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7QUFBOEIsYUFBOUI7O0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7SUFDQSxLQUFBLEdBQVEsRUFBRSxDQUFDLHdCQUF3QixDQUFDLGdCQUE1QixDQUE2QyxJQUFDLENBQUEsTUFBOUMsRUFBc0QsSUFBQyxDQUFBLEtBQXZEO0lBRVIsSUFBRyxDQUFDLElBQUMsQ0FBQSxNQUFMO01BQ0ksS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsTUFBWCxFQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQTNCLEVBREo7S0FBQSxNQUFBO01BR0ksS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFDLENBQUEsTUFBWCxFQUFtQixLQUFLLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxNQUFYLENBQUEsR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFoRCxFQUhKOztJQUtBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7bURBQ0ksSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFEeEI7O0VBWkk7OztBQWVSOzs7Ozs7Ozs7OztxQ0FVQSxLQUFBLEdBQU8sU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLFFBQWYsRUFBeUIsVUFBekIsRUFBcUMsUUFBckM7QUFDSCxRQUFBO0lBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxVQUFBLElBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFZLENBQUEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFmO0lBRXBELElBQUcsUUFBQSxLQUFZLENBQVosSUFBaUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFwQjtNQUNJLFVBQUEsR0FBYSxFQUFFLENBQUMsd0JBQXdCLENBQUMsZ0JBQTVCLENBQTZDLElBQUMsQ0FBQSxNQUE5QyxFQUFzRCxJQUFDLENBQUEsS0FBdkQ7TUFDYixVQUFVLENBQUMsR0FBWCxDQUFlLElBQUMsQ0FBQSxNQUFoQixFQUF3QixLQUF4QjttREFDQSxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUh4QjtLQUFBLE1BQUE7TUFLSSxVQUFBLEdBQWEsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQTVCLENBQXVDLElBQUMsQ0FBQSxNQUF4QyxFQUFnRCxLQUFoRDthQUNiLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixVQUFuQixFQUErQixLQUFBLEdBQVEsVUFBdkMsRUFBbUQsUUFBbkQsRUFOSjs7RUFMRzs7OztHQTdFNEIsRUFBRSxDQUFDOztBQTBGMUMsRUFBRSxDQUFDLHdCQUFILEdBQThCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfRmllbGRBbmltYXRpb25cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIyMjKlxuKiBEaWZmZXJlbnQgbWV0aG9kcyBvZiBmaWVsZC1hbmltYXRpb24uXG4qXG4qIEBtb2R1bGUgZ3NcbiogQGNsYXNzIEFuaW1hdGlvbkxvb3BUeXBlXG4qIEBtZW1iZXJvZiBnc1xuKiBAc3RhdGljXG4qIEBmaW5hbFxuIyMjXG5jbGFzcyBGaWVsZEFuaW1hdGlvbk1ldGhvZFxuICAgIEBpbml0aWFsaXplOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogU2V0IHRoZSB2YWx1ZSBjYWxjdWxhdGVkIGJ5IHRoZSBlYXNpbmctbG9naWMuXG4gICAgICAgICogQHByb3BlcnR5IFNFVFxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBTRVQgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQWRkcyB0aGUgdmFsdWUgY2FsY3VsYXRlZCBieSB0aGUgZWFzaW5nLWxvZ2ljLlxuICAgICAgICAqIEBwcm9wZXJ0eSBBRERcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBAQUREID0gMVxuICAgIFxuRmllbGRBbmltYXRpb25NZXRob2QuaW5pdGlhbGl6ZSgpXG5ncy5GaWVsZEFuaW1hdGlvbk1ldGhvZCA9IEZpZWxkQW5pbWF0aW9uTWV0aG9kXG5cbmNsYXNzIENvbXBvbmVudF9GaWVsZEFuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhIGZpZWxkLWFuaW1hdGlvbi4gQSBmaWVsZC1hbmltYXRpb24gYW5pbWF0ZXMgYSBjZXJ0YWluXG4gICAgKiBwcm9wZXJ0eSBvZiB0aGUgZ2FtZS1vYmplY3QgYXMgbG9uZyBhcyBpdCBpcyBhIG51bWJlci1wcm9wZXJ0eS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0ZpZWxkQW5pbWF0aW9uXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGF0YSkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZmllbGQgdG8gYW5pbWF0ZSBhcyBwcm9wZXJ0eS1wYXRoLlxuICAgICAgICAqIEBwcm9wZXJ0eSBmaWVsZFxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGZpZWxkID0gZGF0YT8uZmllbGRcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgYW5pbWF0aW9uLW1ldGhvZC5cbiAgICAgICAgKiBAcHJvcGVydHkgbWV0aG9kXG4gICAgICAgICogQHR5cGUgZ3MuRmllbGRBbmltYXRpb25NZXRob2RcbiAgICAgICAgKiBAZGVmYXVsdCBncy5GaWVsZEFuaW1hdGlvbk1ldGhvZC5TRVRcbiAgICAgICAgIyMjXG4gICAgICAgIEBtZXRob2QgPSBkYXRhPy5tZXRob2RcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZWFzaW5nLW9iamVjdCB1c2VkIGZvciB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBlYXNpbmdcbiAgICAgICAgKiBAdHlwZSBncy5FYXNpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBlYXNpbmcgPSBuZXcgZ3MuRWFzaW5nKG51bGwsIGRhdGE/LmVhc2luZylcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgcGF0aC1hbmltYXRpb24gaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgIyMjXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBlYXNpbmc6IEBlYXNpbmcsXG4gICAgICAgIG1ldGhvZDogQG1ldGhvZCxcbiAgICAgICAgZmllbGQ6IEBmaWVsZFxuICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgZmllbGQtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmcgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBlYXNpbmcudXBkYXRlVmFsdWUoKVxuICAgICAgICB2YWx1ZSA9IHVpLkNvbXBvbmVudF9CaW5kaW5nSGFuZGxlci5yZXNvbHZlRmllbGRQYXRoKEBvYmplY3QsIEBmaWVsZClcbiAgICAgICAgXG4gICAgICAgIGlmICFAbWV0aG9kICMgU2V0XG4gICAgICAgICAgICB2YWx1ZS5zZXQoQG9iamVjdCwgQGVhc2luZy52YWx1ZSlcbiAgICAgICAgZWxzZSAgICAgICAgIyBBZGRcbiAgICAgICAgICAgIHZhbHVlLnNldChAb2JqZWN0LCB2YWx1ZS5nZXQoQG9iamVjdCkgKyBAZWFzaW5nLnZhbHVlKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZ1xuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIGZpZWxkLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gVmFsdWUgVGhlIHRhcmdldCB2YWx1ZS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCBUaGUgbmFtZSBvZiB0aGUgZmllbGQvcHJvcGVydHkuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2sgY2FsbGVkIGlmIGJsZW5kaW5nIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgICBcbiAgICBzdGFydDogKHZhbHVlLCBmaWVsZCwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAZmllbGQgPSBmaWVsZFxuICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdUeXBlIHx8IGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbZ3MuRWFzaW5nVHlwZXMuRUFTRV9JTl1cbiAgICAgICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgdmFsdWVGaWVsZCA9IHVpLkNvbXBvbmVudF9CaW5kaW5nSGFuZGxlci5yZXNvbHZlRmllbGRQYXRoKEBvYmplY3QsIEBmaWVsZClcbiAgICAgICAgICAgIHZhbHVlRmllbGQuc2V0KEBvYmplY3QsIHZhbHVlKVxuICAgICAgICAgICAgQGNhbGxiYWNrPyhAb2JqZWN0LCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydFZhbHVlID0gdWkuQ29tcG9uZW50X0JpbmRpbmdIYW5kbGVyLmZpZWxkVmFsdWUoQG9iamVjdCwgZmllbGQpXG4gICAgICAgICAgICBAZWFzaW5nLnN0YXJ0VmFsdWUoc3RhcnRWYWx1ZSwgdmFsdWUgLSBzdGFydFZhbHVlLCBkdXJhdGlvbilcbiAgICAgICAgXG5ncy5Db21wb25lbnRfRmllbGRBbmltYXRpb24gPSBDb21wb25lbnRfRmllbGRBbmltYXRpb24iXX0=
//# sourceURL=Component_FieldAnimation_66.js