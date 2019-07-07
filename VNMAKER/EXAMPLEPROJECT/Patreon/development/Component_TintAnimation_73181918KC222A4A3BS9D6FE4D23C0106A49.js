var Component_TintAnimation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_TintAnimation = (function(superClass) {
  extend(Component_TintAnimation, superClass);


  /**
  * Executes a tint-animation on a game-object. The tint is executed on
  * the game object's tone-property.
  *
  * @module gs
  * @class Component_TintAnimation
  * @extends gs.Component_Animation
  * @memberof gs
  * @constructor
   */

  function Component_TintAnimation(data) {
    Component_TintAnimation.__super__.constructor.apply(this, arguments);
    this.sourceTone = data != null ? data.sourceTone : void 0;
    this.targetTone = data != null ? data.targetTone : void 0;
    this.easing = new gs.Easing(null, data != null ? data.easing : void 0);
    this.callback = null;
  }


  /**
  * Serializes the tint-animation into a data-bundle.
  *
  * @method toDataBundle
   */

  Component_TintAnimation.prototype.toDataBundle = function() {
    return {
      easing: this.easing,
      sourceTone: this.sourceTone,
      targetTone: this.targetTone
    };
  };


  /**
  * Updates the tint-animation.
  *
  * @method update
   */

  Component_TintAnimation.prototype.update = function() {
    var a;
    Component_TintAnimation.__super__.update.apply(this, arguments);
    if (!this.easing.isRunning) {
      return;
    }
    this.easing.updateValue();
    a = this.easing.value;
    this.object.tone.red = Math.floor((this.sourceTone.red * a + this.targetTone.red * (255 - a)) / 255);
    this.object.tone.green = Math.floor((this.sourceTone.green * a + this.targetTone.green * (255 - a)) / 255);
    this.object.tone.blue = Math.floor((this.sourceTone.blue * a + this.targetTone.blue * (255 - a)) / 255);
    this.object.tone.grey = Math.floor((this.sourceTone.grey * a + this.targetTone.grey * (255 - a)) / 255);
    if (!this.easing.isRunning) {
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    }
  };


  /**
  * Starts the tint-animation.
  *
  * @method start
  * @param {gs.Tone} tone The target-tone.
  * @param {number} duration The duration in frames.
  * @param {Object} easingType The easing-type.
  * @param {function} [callback] An optional callback called if the animation is finished.
   */

  Component_TintAnimation.prototype.start = function(tone, duration, easing, callback) {
    this.callback = callback;
    if (this.object.tone.red === tone.red && this.object.tone.green === tone.green && this.object.tone.blue === tone.blue && this.object.tone.grey === tone.grey) {
      if (typeof this.callback === "function") {
        this.callback(this.object, this);
      }
    }
    if (duration === 0 || this.isInstantSkip()) {
      this.object.tone = tone;
      return typeof this.callback === "function" ? this.callback(this.object, this) : void 0;
    } else {
      this.sourceTone = new Tone(this.object.tone);
      this.targetTone = tone;
      this.callback = callback;
      this.easing.type = easing;
      return this.easing.startValue(255, -255, duration);
    }
  };

  return Component_TintAnimation;

})(gs.Component_Animation);

gs.Component_TintAnimation = Component_TintAnimation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7RUFVYSxpQ0FBQyxJQUFEO0lBQ1QsMERBQUEsU0FBQTtJQUVBLElBQUMsQ0FBQSxVQUFELGtCQUFjLElBQUksQ0FBRTtJQUNwQixJQUFDLENBQUEsVUFBRCxrQkFBYyxJQUFJLENBQUU7SUFDcEIsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixpQkFBZ0IsSUFBSSxDQUFFLGVBQXRCO0lBQ2QsSUFBQyxDQUFBLFFBQUQsR0FBWTtFQU5IOzs7QUFRYjs7Ozs7O29DQUtBLFlBQUEsR0FBYyxTQUFBO1dBQ1Y7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVQ7TUFDQSxVQUFBLEVBQVksSUFBQyxDQUFBLFVBRGI7TUFFQSxVQUFBLEVBQVksSUFBQyxDQUFBLFVBRmI7O0VBRFU7OztBQUtkOzs7Ozs7b0NBS0EsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEscURBQUEsU0FBQTtJQUNBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7QUFBOEIsYUFBOUI7O0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7SUFDQSxDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUVaLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQWIsR0FBbUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixHQUFrQixDQUFsQixHQUFzQixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosR0FBa0IsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxDQUF6QyxDQUFBLEdBQXNELEdBQWpFO0lBQ25CLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsR0FBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixHQUFvQixDQUFwQixHQUF3QixJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosR0FBb0IsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxDQUE3QyxDQUFBLEdBQTBELEdBQXJFO0lBQ3JCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQWIsR0FBb0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixHQUFtQixDQUFuQixHQUF1QixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosR0FBbUIsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxDQUEzQyxDQUFBLEdBQXdELEdBQW5FO0lBQ3BCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQWIsR0FBb0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixHQUFtQixDQUFuQixHQUF1QixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosR0FBbUIsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxDQUEzQyxDQUFBLEdBQXdELEdBQW5FO0lBRXBCLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQWY7bURBQ0ksSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFEeEI7O0VBWkk7OztBQWdCUjs7Ozs7Ozs7OztvQ0FTQSxLQUFBLEdBQU8sU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixNQUFqQixFQUF5QixRQUF6QjtJQUVILElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQWIsS0FBb0IsSUFBSSxDQUFDLEdBQXpCLElBQWlDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsS0FBc0IsSUFBSSxDQUFDLEtBQTVELElBQ0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBYixLQUFxQixJQUFJLENBQUMsSUFEM0IsSUFDb0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBYixLQUFxQixJQUFJLENBQUMsSUFEakU7O1FBRUcsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVE7T0FGdkI7O0lBSUEsSUFBRyxRQUFBLEtBQVksQ0FBWixJQUFpQixJQUFDLENBQUEsYUFBRCxDQUFBLENBQXBCO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWU7bURBQ2YsSUFBQyxDQUFBLFNBQVUsSUFBQyxDQUFBLFFBQVEsZUFGeEI7S0FBQSxNQUFBO01BSUksSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFiO01BQ2xCLElBQUMsQ0FBQSxVQUFELEdBQWM7TUFDZCxJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWU7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBQyxHQUF6QixFQUE4QixRQUE5QixFQVJKOztFQVBHOzs7O0dBM0QyQixFQUFFLENBQUM7O0FBNEV6QyxFQUFFLENBQUMsdUJBQUgsR0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9UaW50QW5pbWF0aW9uXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfVGludEFuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudF9BbmltYXRpb25cbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhIHRpbnQtYW5pbWF0aW9uIG9uIGEgZ2FtZS1vYmplY3QuIFRoZSB0aW50IGlzIGV4ZWN1dGVkIG9uXG4gICAgKiB0aGUgZ2FtZSBvYmplY3QncyB0b25lLXByb3BlcnR5LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfVGludEFuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAc291cmNlVG9uZSA9IGRhdGE/LnNvdXJjZVRvbmVcbiAgICAgICAgQHRhcmdldFRvbmUgPSBkYXRhPy50YXJnZXRUb25lXG4gICAgICAgIEBlYXNpbmcgPSBuZXcgZ3MuRWFzaW5nKG51bGwsIGRhdGE/LmVhc2luZylcbiAgICAgICAgQGNhbGxiYWNrID0gbnVsbFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSB0aW50LWFuaW1hdGlvbiBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAjIyMgICAgXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBlYXNpbmc6IEBlYXNpbmcsXG4gICAgICAgIHNvdXJjZVRvbmU6IEBzb3VyY2VUb25lLFxuICAgICAgICB0YXJnZXRUb25lOiBAdGFyZ2V0VG9uZVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSB0aW50LWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgICAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXIgXG4gICAgICAgIGlmIG5vdCBAZWFzaW5nLmlzUnVubmluZyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGVhc2luZy51cGRhdGVWYWx1ZSgpXG4gICAgICAgIGEgPSBAZWFzaW5nLnZhbHVlXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LnRvbmUucmVkID0gTWF0aC5mbG9vcigoQHNvdXJjZVRvbmUucmVkICogYSArIEB0YXJnZXRUb25lLnJlZCAqICgyNTUgLSBhKSkgLyAyNTUpXG4gICAgICAgIEBvYmplY3QudG9uZS5ncmVlbiA9IE1hdGguZmxvb3IoKEBzb3VyY2VUb25lLmdyZWVuICogYSArIEB0YXJnZXRUb25lLmdyZWVuICogKDI1NSAtIGEpKSAvIDI1NSlcbiAgICAgICAgQG9iamVjdC50b25lLmJsdWUgPSBNYXRoLmZsb29yKChAc291cmNlVG9uZS5ibHVlICogYSArIEB0YXJnZXRUb25lLmJsdWUgKiAoMjU1IC0gYSkpIC8gMjU1KVxuICAgICAgICBAb2JqZWN0LnRvbmUuZ3JleSA9IE1hdGguZmxvb3IoKEBzb3VyY2VUb25lLmdyZXkgKiBhICsgQHRhcmdldFRvbmUuZ3JleSAqICgyNTUgLSBhKSkgLyAyNTUpXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQGVhc2luZy5pc1J1bm5pbmdcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSB0aW50LWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgKiBAcGFyYW0ge2dzLlRvbmV9IHRvbmUgVGhlIHRhcmdldC10b25lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWFzaW5nVHlwZSBUaGUgZWFzaW5nLXR5cGUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIEFuIG9wdGlvbmFsIGNhbGxiYWNrIGNhbGxlZCBpZiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBcbiAgICAjIyMgXG4gICAgc3RhcnQ6ICh0b25lLCBkdXJhdGlvbiwgZWFzaW5nLCBjYWxsYmFjaykgLT5cblxuICAgICAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBpZiBAb2JqZWN0LnRvbmUucmVkID09IHRvbmUucmVkIGFuZCBAb2JqZWN0LnRvbmUuZ3JlZW4gPT0gdG9uZS5ncmVlbiBhbmQgXG4gICAgICAgICAgICBAb2JqZWN0LnRvbmUuYmx1ZSA9PSB0b25lLmJsdWUgYW5kIEBvYmplY3QudG9uZS5ncmV5ID09IHRvbmUuZ3JleVxuICAgICAgICAgICBAY2FsbGJhY2s/KEBvYmplY3QsIHRoaXMpXG4gICAgICAgICAgIFxuICAgICAgICBpZiBkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKClcbiAgICAgICAgICAgIEBvYmplY3QudG9uZSA9IHRvbmVcbiAgICAgICAgICAgIEBjYWxsYmFjaz8oQG9iamVjdCwgdGhpcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNvdXJjZVRvbmUgPSBuZXcgVG9uZShAb2JqZWN0LnRvbmUpXG4gICAgICAgICAgICBAdGFyZ2V0VG9uZSA9IHRvbmVcbiAgICAgICAgICAgIEBjYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICAgICAgICBAZWFzaW5nLnR5cGUgPSBlYXNpbmdcbiAgICAgICAgICAgIEBlYXNpbmcuc3RhcnRWYWx1ZSgyNTUsIC0yNTUsIGR1cmF0aW9uKVxuICAgICAgICBcbmdzLkNvbXBvbmVudF9UaW50QW5pbWF0aW9uID0gQ29tcG9uZW50X1RpbnRBbmltYXRpb24iXX0=
//# sourceURL=Component_TintAnimation_45.js