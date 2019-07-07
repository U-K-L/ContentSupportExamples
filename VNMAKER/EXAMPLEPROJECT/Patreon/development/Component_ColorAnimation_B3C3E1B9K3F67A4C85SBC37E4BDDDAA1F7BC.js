var Component_ColorAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ColorAnimation = (function(superClass) {
  extend(Component_ColorAnimation, superClass);


  /**
  * Executes a color-animation on a game-object.
  *
  * @module gs
  * @class Component_MoveAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_ColorAnimation(data) {
    Component_ColorAnimation.__super__.constructor.apply(this, arguments);

    /**
    * The easing-object used for the animation.
    * @property easing
    * @type gs.Easing
     */
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);

    /**
    * The start-color.
    * @property sourceColor
    * @type gs.Color
    * @protected
     */
    this.sourceColor = (data != null ? data.sourceColor : void 0) || new Color();

    /**
    * The end-color.
    * @property targetColor
    * @type gs.Color
    * @protected
     */
    this.targetColor = (data != null ? data.targetColor : void 0) || new Color();
  }


  /**
  * Serializes the color-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_ColorAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      sourceColor: this.sourceColor,
      targetColor: this.targetColor
    };
  };


  /**
  * Updates the color-animation
  *
  * @method update
   */

  Component_ColorAnimation.prototype.update = function() {
    var a;
    Component_ColorAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    a = this.easing.value;
    this.object.color.red = Math.floor((this.sourceColor.red * a + this.targetColor.red * (255 - a)) / 255);
    this.object.color.green = Math.floor((this.sourceColor.green * a + this.targetColor.green * (255 - a)) / 255);
    this.object.color.blue = Math.floor((this.sourceColor.blue * a + this.targetColor.blue * (255 - a)) / 255);
    this.object.color.alpha = Math.floor((this.sourceColor.alpha * a + this.targetColor.alpha * (255 - a)) / 255);
    if (!this.easing.isRunning) {
      this.object.color = this.targetColor;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the color-animation.
  *
  * @method colorTo
  * @param {Color} color The target color.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback-function called when the animation is finished.
   */

  Component_ColorAnimation.prototype.start = function(color, duration, easingType, callback) {
    this.callback = callback;
    this.easing.type = easingType;
    if (this.object.color.red === color.red && this.object.color.green === color.green && this.object.color.blue === color.blue && this.object.color.alpha === color.alpha) {
      if (typeof this.callback === "function") {
        this.callback(this.object, this);
      }
    }
    if (duration === 0 || this.isInstantSkip()) {
      this.object.color = color;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.sourceColor = new Color(this.object.color);
      this.targetColor = color;
      return this.easing.startValue(255, -255, duration);
    }
  };

  return Component_ColorAnimation;

})(gs.Component_Animation);

gs.Component_ColorAnimation = Component_ColorAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGtDQUFDLElBQUQ7SUFDVCwyREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsaUJBQWdCLElBQUksQ0FBRSxlQUF0Qjs7QUFFZDs7Ozs7O0lBTUEsSUFBQyxDQUFBLFdBQUQsbUJBQWUsSUFBSSxDQUFFLHFCQUFOLElBQXlCLElBQUEsS0FBQSxDQUFBOztBQUV4Qzs7Ozs7O0lBTUEsSUFBQyxDQUFBLFdBQUQsbUJBQWUsSUFBSSxDQUFFLHFCQUFOLElBQXlCLElBQUEsS0FBQSxDQUFBO0VBeEIvQjs7O0FBMEJiOzs7Ozs7cUNBS0EsWUFBQSxHQUFjLFNBQUE7V0FDVjtNQUFBLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBVDtNQUNBLFdBQUEsRUFBYSxJQUFDLENBQUEsV0FEZDtNQUVBLFdBQUEsRUFBYSxJQUFDLENBQUEsV0FGZDs7RUFEVTs7O0FBT2Q7Ozs7OztxQ0FLQSxNQUFBLEdBQVEsU0FBQTtBQUNKLFFBQUE7SUFBQSxzREFBQSxTQUFBO0lBRUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtBQUE4QixhQUE5Qjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBQTtJQUNBLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDO0lBRVosSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBZCxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLEdBQW1CLENBQW5CLEdBQXVCLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixHQUFtQixDQUFDLEdBQUEsR0FBTSxDQUFQLENBQTNDLENBQUEsR0FBd0QsR0FBbkU7SUFDcEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxHQUFzQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLEdBQXFCLENBQXJCLEdBQXlCLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixHQUFxQixDQUFDLEdBQUEsR0FBTSxDQUFQLENBQS9DLENBQUEsR0FBNEQsR0FBdkU7SUFDdEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBZCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLEdBQW9CLENBQXBCLEdBQXdCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixHQUFvQixDQUFDLEdBQUEsR0FBTSxDQUFQLENBQTdDLENBQUEsR0FBMEQsR0FBckU7SUFDckIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxHQUFzQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLEdBQXFCLENBQXJCLEdBQXlCLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixHQUFxQixDQUFDLEdBQUEsR0FBTSxDQUFQLENBQS9DLENBQUEsR0FBNEQsR0FBdkU7SUFFdEIsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBZjtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUE7bURBQ2pCLElBQUMsQ0FBQSxTQUFVLElBQUMsQ0FBQSxRQUFRLGVBRnhCOztFQWJJOzs7QUFpQlI7Ozs7Ozs7Ozs7cUNBU0EsS0FBQSxHQUFPLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsVUFBbEIsRUFBOEIsUUFBOUI7SUFDSCxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWU7SUFFZixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWQsS0FBcUIsS0FBSyxDQUFDLEdBQTNCLElBQW1DLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWQsS0FBdUIsS0FBSyxDQUFDLEtBQWhFLElBQ0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBZCxLQUFzQixLQUFLLENBQUMsSUFEN0IsSUFDc0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxLQUF1QixLQUFLLENBQUMsS0FEdEU7O1FBRUcsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVE7T0FGdkI7O0lBSUEsSUFBRyxRQUFBLEtBQVksQ0FBWixJQUFpQixJQUFDLENBQUEsYUFBRCxDQUFBLENBQXBCO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCO21EQUNoQixJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsUUFBUSxlQUZ4QjtLQUFBLE1BQUE7TUFJSSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQWQ7TUFDbkIsSUFBQyxDQUFBLFdBQUQsR0FBZTthQUNmLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixHQUFuQixFQUF3QixDQUFDLEdBQXpCLEVBQThCLFFBQTlCLEVBTko7O0VBUkc7Ozs7R0EvRTRCLEVBQUUsQ0FBQzs7QUErRjFDLEVBQUUsQ0FBQyx3QkFBSCxHQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0NvbG9yQW5pbWF0aW9uXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfQ29sb3JBbmltYXRpb24gZXh0ZW5kcyBncy5Db21wb25lbnRfQW5pbWF0aW9uXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBjb2xvci1hbmltYXRpb24gb24gYSBnYW1lLW9iamVjdC5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X01vdmVBbmltYXRpb25cbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBlYXNpbmctb2JqZWN0IHVzZWQgZm9yIHRoZSBhbmltYXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGVhc2luZ1xuICAgICAgICAqIEB0eXBlIGdzLkVhc2luZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGVhc2luZyA9IG5ldyBncy5FYXNpbmcobnVsbCwgZGF0YT8uZWFzaW5nKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBzdGFydC1jb2xvci5cbiAgICAgICAgKiBAcHJvcGVydHkgc291cmNlQ29sb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db2xvclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBzb3VyY2VDb2xvciA9IGRhdGE/LnNvdXJjZUNvbG9yIHx8IG5ldyBDb2xvcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGVuZC1jb2xvci5cbiAgICAgICAgKiBAcHJvcGVydHkgdGFyZ2V0Q29sb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db2xvclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB0YXJnZXRDb2xvciA9IGRhdGE/LnRhcmdldENvbG9yIHx8IG5ldyBDb2xvcigpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIGNvbG9yLWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBlYXNpbmc6IEBlYXNpbmcsXG4gICAgICAgIHNvdXJjZUNvbG9yOiBAc291cmNlQ29sb3IsXG4gICAgICAgIHRhcmdldENvbG9yOiBAdGFyZ2V0Q29sb3JcbiAgICAgXG4gICAgIFxuIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGNvbG9yLWFuaW1hdGlvblxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGVhc2luZy51cGRhdGVWYWx1ZSgpXG4gICAgICAgIGEgPSBAZWFzaW5nLnZhbHVlXG4gICAgXG4gICAgICAgIEBvYmplY3QuY29sb3IucmVkID0gTWF0aC5mbG9vcigoQHNvdXJjZUNvbG9yLnJlZCAqIGEgKyBAdGFyZ2V0Q29sb3IucmVkICogKDI1NSAtIGEpKSAvIDI1NSlcbiAgICAgICAgQG9iamVjdC5jb2xvci5ncmVlbiA9IE1hdGguZmxvb3IoKEBzb3VyY2VDb2xvci5ncmVlbiAqIGEgKyBAdGFyZ2V0Q29sb3IuZ3JlZW4gKiAoMjU1IC0gYSkpIC8gMjU1KVxuICAgICAgICBAb2JqZWN0LmNvbG9yLmJsdWUgPSBNYXRoLmZsb29yKChAc291cmNlQ29sb3IuYmx1ZSAqIGEgKyBAdGFyZ2V0Q29sb3IuYmx1ZSAqICgyNTUgLSBhKSkgLyAyNTUpXG4gICAgICAgIEBvYmplY3QuY29sb3IuYWxwaGEgPSBNYXRoLmZsb29yKChAc291cmNlQ29sb3IuYWxwaGEgKiBhICsgQHRhcmdldENvbG9yLmFscGhhICogKDI1NSAtIGEpKSAvIDI1NSlcblxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmdcbiAgICAgICAgICAgIEBvYmplY3QuY29sb3IgPSBAdGFyZ2V0Q29sb3JcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIGNvbG9yLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNvbG9yVG9cbiAgICAqIEBwYXJhbSB7Q29sb3J9IGNvbG9yIFRoZSB0YXJnZXQgY29sb3IuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmdUeXBlIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gQW4gb3B0aW9uYWwgY2FsbGJhY2stZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cbiAgICAjIyMgICAgICAgICAgXG4gICAgc3RhcnQ6IChjb2xvciwgZHVyYXRpb24sIGVhc2luZ1R5cGUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdUeXBlXG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmNvbG9yLnJlZCA9PSBjb2xvci5yZWQgYW5kIEBvYmplY3QuY29sb3IuZ3JlZW4gPT0gY29sb3IuZ3JlZW4gYW5kXG4gICAgICAgICAgICBAb2JqZWN0LmNvbG9yLmJsdWUgPT0gY29sb3IuYmx1ZSBhbmQgQG9iamVjdC5jb2xvci5hbHBoYSA9PSBjb2xvci5hbHBoYVxuICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgXG4gICAgICAgIGlmIGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKVxuICAgICAgICAgICAgQG9iamVjdC5jb2xvciA9IGNvbG9yXG4gICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzb3VyY2VDb2xvciA9IG5ldyBDb2xvcihAb2JqZWN0LmNvbG9yKVxuICAgICAgICAgICAgQHRhcmdldENvbG9yID0gY29sb3JcbiAgICAgICAgICAgIEBlYXNpbmcuc3RhcnRWYWx1ZSgyNTUsIC0yNTUsIGR1cmF0aW9uKVxuICAgICAgICBcbmdzLkNvbXBvbmVudF9Db2xvckFuaW1hdGlvbiA9IENvbXBvbmVudF9Db2xvckFuaW1hdGlvbiJdfQ==
//# sourceURL=Component_ColorAnimation_119.js