var Easing;

Easing = (function() {
  Easing.accessors("type", {
    set: function(v) {
      if (v !== this.type_) {
        this.type_ = v;
        return this.func = gs.Easings.EASE_FUNCTIONS[this.type_[0]][this.type_[1]];
      }
    },
    get: function() {
      return this.type_;
    }
  });


  /**
  * The Easing class provides different types of animation using different easings. The easing
  * of an animation controls how hard/soft the animation starts and/or stops.
  *
  * @module gs
  * @class Easing
  * @memberof gs
  * @constructor
  * @param {gs.Easings} type - The easing-type.
  * @param {Object} [data=null] - A data-bundle to restore the easing from.
   */

  function Easing(type, data) {
    if (data != null) {
      Object.mixin(this, data);
    } else {

      /**
      * Frame counter for the animation. 
      * @property time
      * @type number
      * @protected
       */
      this.time = 0;

      /**
      * Delta X 
      * @property dx
      * @type number
      * @protected
       */
      this.dx = 0;

      /**
      * Delta Y
      * @property dy
      * @type number
      * @protected
       */
      this.dy = 0;

      /**
      * @property startX
      * @type number
      * @protected
       */
      this.startX = 0;

      /**
      * @property startY
      * @type number
      * @protected
       */
      this.startY = 0;

      /**
      * The duration of the animation.
      * @property duration
      * @type number
       */
      this.duration = 0;

      /**
      * Indicates if the animation is running.
      * @property isRunning
      * @type boolean
      * @readOnly
       */
      this.isRunning = false;

      /**
      * Indicates if the animation is endless.
      * @property isEndless
      * @type boolean
      * @readOnly
       */
      this.isEndless = false;

      /**
      * @property isSingleValue
      * @type boolean
      * @readOnly
       */
      this.isSingleValue = false;

      /**
      * @property speedX
      * @type number
      * @protected
       */
      this.speedX = 0;

      /**
      * @property speedY
      * @type number
      * @protected
       */
      this.speedY = 0;

      /**
      * @property speed
      * @type number
      * @protected
       */
      this.speed = 0;

      /**
      * @property x
      * @type number
      * @protected
       */
      this.x = 0;

      /**
      * @property y
      * @type number
      * @protected
       */
      this.y = 0;

      /**
      * The current value.
      * @property value
      * @type number
      * @protected
       */
      this.value = 0;

      /**
      * The easing type.
      * @property gs.Easings
      * @type Function
       */
      this.type = type || gs.Easings.EASE_LINEAR[gs.EasingTypes.EASE_OUT];
    }

    /**
    * The easing function used for the animation.
    * @property func
    * @type Function
     */
    this.func = gs.Easings.EASE_FUNCTIONS[this.type[0]][this.type[1]];
  }


  /**
  * Stops the animation 
  *
  * @method stop
   */

  Easing.prototype.stop = function() {
    return this.isRunning = false;
  };


  /**
  * Starts an endless moving/scroll animation.
  *
  * @method startEndless
  * @param {number} speedX - The animation speed on x-axis.
  * @param {number} speedY - The animation speed on y-axis.
   */

  Easing.prototype.startEndless = function(speedX, speedY) {
    this.isRunning = true;
    this.isEndless = true;
    this.speedX = speedX;
    this.speedY = speedY;
    return this.isSingleValue = false;
  };


  /**
  * Starts an endless value animation.
  *
  * @method startValueEndless
  * @param {number} value - The start-value.
  * @param {number} speedY - The animation speed.
   */

  Easing.prototype.startValueEndless = function(value, speed) {
    this.time = 0;
    this.value = value;
    this.speed = speed;
    this.isRunning = true;
    this.isEndless = true;
    return this.isSingleValue = true;
  };


  /**
  * Starts a value animation.
  *
  * @method startValue
  * @param {number} value - The start-value.
  * @param {number} distance - The distance/amount to change the value by.
  * @param {number} duration - The duration of the animation.
   */

  Easing.prototype.startValue = function(value, distance, duration) {
    this.time = 0;
    this.duration = duration || 1;
    this.valueStart = value;
    this.value = value;
    this.distance = distance;
    this.isRunning = true;
    this.isEndless = false;
    return this.isSingleValue = true;
  };


  /**
  * Starts a move/scroll animation.
  *
  * @method start
  * @param {number} sx - The start x-coordinate.
  * @param {number} sy - The start y-coordinate.
  * @param {number} dx - The distance/amount on x-axis.
  * @param {number} dy - The distance/amount on y-axis.
  * @param {number} duration - The duration of the animation.
   */

  Easing.prototype.start = function(sx, sy, dx, dy, duration) {
    this.time = 0;
    this.startX = sx;
    this.startY = sy;
    this.dx = dx - sx;
    this.dy = dy - sy;
    this.x = sx;
    this.y = sy;
    this.duration = duration || 1;
    this.isRunning = true;
    this.isEndless = false;
    return this.isSingleValue = false;
  };


  /**
  * Updates the value animation.
  *
  * @method updateValue
   */

  Easing.prototype.updateValue = function() {
    if (this.isEndless) {
      return this.value += this.speed;
    } else {
      this.value = this.func(this.time, this.valueStart, this.distance, this.duration);
      if (++this.time > this.duration) {
        return this.isRunning = false;
      }
    }
  };


  /**
  * Updates the move/scroll animation.
  *
  * @method updatePosition
   */

  Easing.prototype.updatePosition = function() {
    if (this.isEndless) {
      this.x += this.speedX;
      return this.y += this.speedY;
    } else {
      this.x = this.func(this.time, this.startX, this.dx, this.duration);
      this.y = this.func(this.time, this.startY, this.dy, this.duration);
      this.time++;
      if (this.time > this.duration) {
        return this.isRunning = false;
      }
    }
  };

  return Easing;

})();

gs.Easing = Easing;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07RUFDRixNQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFDSTtJQUFBLEdBQUEsRUFBSyxTQUFDLENBQUQ7TUFDRCxJQUFHLENBQUEsS0FBSyxJQUFDLENBQUEsS0FBVDtRQUNJLElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsSUFBRCxHQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBZSxDQUFBLElBQUMsQ0FBQSxLQUFNLENBQUEsQ0FBQSxDQUFQLENBQVcsQ0FBQSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBUCxFQUZqRDs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7OztBQU9BOzs7Ozs7Ozs7Ozs7RUFXYSxnQkFBQyxJQUFELEVBQU8sSUFBUDtJQUNULElBQUcsWUFBSDtNQUNJLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYixFQUFtQixJQUFuQixFQURKO0tBQUEsTUFBQTs7QUFHSTs7Ozs7O01BTUEsSUFBQyxDQUFBLElBQUQsR0FBUTs7QUFFUjs7Ozs7O01BTUEsSUFBQyxDQUFBLEVBQUQsR0FBTTs7QUFFTjs7Ozs7O01BTUEsSUFBQyxDQUFBLEVBQUQsR0FBTTs7QUFFTjs7Ozs7TUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztNQUtBLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7O01BS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7O01BTUEsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7O01BTUEsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7TUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQjs7QUFFakI7Ozs7O01BS0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7TUFLQSxJQUFDLENB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QVUsSUFBQyxDQUFBLFFBQWQ7ZUFDSSxJQUFDLENBQUEsU0FBRCxHQUFhLE1BRGpCO09BSko7O0VBRFM7OztBQVFiOzs7Ozs7bUJBS0EsY0FBQSxHQUFnQixTQUFBO0lBQ1osSUFBRyxJQUFDLENBQUEsU0FBSjtNQUNJLElBQUMsQ0FBQSxDQUFELElBQU0sSUFBQyxDQUFBO2FBQ1AsSUFBQyxDQUFBLENBQUQsSUFBTSxJQUFDLENBQUEsT0FGWDtLQUFBLE1BQUE7TUFJSSxJQUFDLENBQUEsQ0FBRCxHQUFNLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBQyxDQUFBLElBQVAsRUFBYSxJQUFDLENBQUEsTUFBZCxFQUFzQixJQUFDLENBQUEsRUFBdkIsRUFBMkIsSUFBQyxDQUFBLFFBQTVCO01BQ04sSUFBQyxDQUFBLENBQUQsR0FBTSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQUMsQ0FBQSxJQUFQLEVBQWEsSUFBQyxDQUFBLE1BQWQsRUFBc0IsSUFBQyxDQUFBLEVBQXZCLEVBQTJCLElBQUMsQ0FBQSxRQUE1QjtNQUVOLElBQUMsQ0FBQSxJQUFEO01BRUEsSUFBRyxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxRQUFaO2VBQ0ksSUFBQyxDQUFBLFNBQUQsR0FBYSxNQURqQjtPQVRKOztFQURZOzs7Ozs7QUFhcEIsRUFBRSxDQUFDLE1BQUgsR0FBWSIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogRWFzaW5nXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBFYXNpbmdcbiAgICBAYWNjZXNzb3JzIFwidHlwZVwiLCBcbiAgICAgICAgc2V0OiAodikgLT5cbiAgICAgICAgICAgIGlmIHYgIT0gQHR5cGVfXG4gICAgICAgICAgICAgICAgQHR5cGVfID0gdlxuICAgICAgICAgICAgICAgIEBmdW5jID0gZ3MuRWFzaW5ncy5FQVNFX0ZVTkNUSU9OU1tAdHlwZV9bMF1dW0B0eXBlX1sxXV1cbiAgICAgICAgZ2V0OiAtPiBAdHlwZV9cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVGhlIEVhc2luZyBjbGFzcyBwcm92aWRlcyBkaWZmZXJlbnQgdHlwZXMgb2YgYW5pbWF0aW9uIHVzaW5nIGRpZmZlcmVudCBlYXNpbmdzLiBUaGUgZWFzaW5nXG4gICAgKiBvZiBhbiBhbmltYXRpb24gY29udHJvbHMgaG93IGhhcmQvc29mdCB0aGUgYW5pbWF0aW9uIHN0YXJ0cyBhbmQvb3Igc3RvcHMuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIEVhc2luZ1xuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbSB7Z3MuRWFzaW5nc30gdHlwZSAtIFRoZSBlYXNpbmctdHlwZS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT1udWxsXSAtIEEgZGF0YS1idW5kbGUgdG8gcmVzdG9yZSB0aGUgZWFzaW5nIGZyb20uXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6ICh0eXBlLCBkYXRhKSAtPlxuICAgICAgICBpZiBkYXRhP1xuICAgICAgICAgICAgT2JqZWN0Lm1peGluKHRoaXMsIGRhdGEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMjIypcbiAgICAgICAgICAgICogRnJhbWUgY291bnRlciBmb3IgdGhlIGFuaW1hdGlvbi4gXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSB0aW1lXG4gICAgICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAgICAjIyNcbiAgICAgICAgICAgIEB0aW1lID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIERlbHRhIFggXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBkeFxuICAgICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgICAgIyMjXG4gICAgICAgICAgICBAZHggPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMjIypcbiAgICAgICAgICAgICogRGVsdGEgWVxuICAgICAgICAgICAgKiBAcHJvcGVydHkgZHlcbiAgICAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQGR5ID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBzdGFydFhcbiAgICAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQHN0YXJ0WCA9IDBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyMjKlxuICAgICAgICAgICAgKiBAcHJvcGVydHkgc3RhcnRZXG4gICAgICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAgICAjIyNcbiAgICAgICAgICAgIEBzdGFydFkgPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMjIypcbiAgICAgICAgICAgICogVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBkdXJhdGlvblxuICAgICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQGR1cmF0aW9uID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgYW5pbWF0aW9uIGlzIHJ1bm5pbmcuXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBpc1J1bm5pbmdcbiAgICAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMjIypcbiAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBhbmltYXRpb24gaXMgZW5kbGVzcy5cbiAgICAgICAgICAgICogQHByb3BlcnR5IGlzRW5kbGVzc1xuICAgICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgICAgIyMjXG4gICAgICAgICAgICBAaXNFbmRsZXNzID0gbm9cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyMjKlxuICAgICAgICAgICAgKiBAcHJvcGVydHkgaXNTaW5nbGVWYWx1ZVxuICAgICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgICAgIyMjXG4gICAgICAgICAgICBAaXNTaW5nbGVWYWx1ZSA9IG5vXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMjIypcbiAgICAgICAgICAgICogQHByb3BlcnR5IHNwZWVkWFxuICAgICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgICAgIyMjXG4gICAgICAgICAgICBAc3BlZWRYID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSBzcGVlZFlcbiAgICAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQHNwZWVkWSA9IDBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyMjKlxuICAgICAgICAgICAgKiBAcHJvcGVydHkgc3BlZWRcbiAgICAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQHNwZWVkID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSB4XG4gICAgICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAgICAjIyNcbiAgICAgICAgICAgIEB4ID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIEBwcm9wZXJ0eSB5XG4gICAgICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAgICAjIyNcbiAgICAgICAgICAgIEB5ID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIFRoZSBjdXJyZW50IHZhbHVlLlxuICAgICAgICAgICAgKiBAcHJvcGVydHkgdmFsdWVcbiAgICAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQHZhbHVlID0gMFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIyMqXG4gICAgICAgICAgICAqIFRoZSBlYXNpbmcgdHlwZS5cbiAgICAgICAgICAgICogQHByb3BlcnR5IGdzLkVhc2luZ3NcbiAgICAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICAgICMjI1xuICAgICAgICAgICAgQHR5cGUgPSB0eXBlIHx8IGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbZ3MuRWFzaW5nVHlwZXMuRUFTRV9PVVRdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGVhc2luZyBmdW5jdGlvbiB1c2VkIGZvciB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBmdW5jXG4gICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgIyMjICAgIFxuICAgICAgICBAZnVuYyA9IGdzLkVhc2luZ3MuRUFTRV9GVU5DVElPTlNbQHR5cGVbMF1dW0B0eXBlWzFdXVxuICAgICMjIypcbiAgICAqIFN0b3BzIHRoZSBhbmltYXRpb24gXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wXG4gICAgIyMjICAgXG4gICAgc3RvcDogLT5cbiAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyBhbiBlbmRsZXNzIG1vdmluZy9zY3JvbGwgYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRFbmRsZXNzXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRYIC0gVGhlIGFuaW1hdGlvbiBzcGVlZCBvbiB4LWF4aXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRZIC0gVGhlIGFuaW1hdGlvbiBzcGVlZCBvbiB5LWF4aXMuXG4gICAgIyMjICAgIFxuICAgIHN0YXJ0RW5kbGVzczogKHNwZWVkWCwgc3BlZWRZKSAtPlxuICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgIEBpc0VuZGxlc3MgPSB5ZXNcbiAgICAgICAgQHNwZWVkWCA9IHNwZWVkWFxuICAgICAgICBAc3BlZWRZID0gc3BlZWRZXG4gICAgICAgIEBpc1NpbmdsZVZhbHVlID0gbm9cbiAgICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIGFuIGVuZGxlc3MgdmFsdWUgYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRWYWx1ZUVuZGxlc3NcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIFRoZSBzdGFydC12YWx1ZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZFkgLSBUaGUgYW5pbWF0aW9uIHNwZWVkLlxuICAgICMjIyAgICAgXG4gICAgc3RhcnRWYWx1ZUVuZGxlc3M6ICh2YWx1ZSwgc3BlZWQpIC0+XG4gICAgICAgIEB0aW1lID0gMFxuICAgICAgICBAdmFsdWUgPSB2YWx1ZVxuICAgICAgICBAc3BlZWQgPSBzcGVlZFxuICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgIEBpc0VuZGxlc3MgPSB5ZXNcbiAgICAgICAgQGlzU2luZ2xlVmFsdWUgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgYSB2YWx1ZSBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBzdGFydFZhbHVlXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgc3RhcnQtdmFsdWUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UvYW1vdW50IHRvIGNoYW5nZSB0aGUgdmFsdWUgYnkuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbi5cbiAgICAjIyMgICAgICBcbiAgICBzdGFydFZhbHVlOiAodmFsdWUsIGRpc3RhbmNlLCBkdXJhdGlvbikgLT5cbiAgICAgICAgQHRpbWUgPSAwXG4gICAgICAgIEBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDFcbiAgICAgICAgQHZhbHVlU3RhcnQgPSB2YWx1ZVxuICAgICAgICBAdmFsdWUgPSB2YWx1ZVxuICAgICAgICBAZGlzdGFuY2UgPSBkaXN0YW5jZVxuICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgIEBpc0VuZGxlc3MgPSBub1xuICAgICAgICBAaXNTaW5nbGVWYWx1ZSA9IHllc1xuXG4gICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyBhIG1vdmUvc2Nyb2xsIGFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3ggLSBUaGUgc3RhcnQgeC1jb29yZGluYXRlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHN5IC0gVGhlIHN0YXJ0IHktY29vcmRpbmF0ZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeCAtIFRoZSBkaXN0YW5jZS9hbW91bnQgb24geC1heGlzLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IC0gVGhlIGRpc3RhbmNlL2Ftb3VudCBvbiB5LWF4aXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbi5cbiAgICAjIyMgICAgIFxuICAgIHN0YXJ0OiAoc3gsIHN5LCBkeCwgZHksIGR1cmF0aW9uKSAtPlxuICAgICAgICBAdGltZSA9IDBcbiAgICAgICAgQHN0YXJ0WCA9IHN4XG4gICAgICAgIEBzdGFydFkgPSBzeVxuICAgICAgICBAZHggPSBkeCAtIHN4XG4gICAgICAgIEBkeSA9IGR5IC0gc3lcbiAgICAgICAgQHggPSBzeFxuICAgICAgICBAeSA9IHN5XG4gICAgICAgIEBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDFcbiAgICAgICAgQGlzUnVubmluZyA9IHllc1xuICAgICAgICBAaXNFbmRsZXNzID0gbm9cbiAgICAgICAgQGlzU2luZ2xlVmFsdWUgPSBub1xuICAgICAgICBcbiBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSB2YWx1ZSBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVWYWx1ZVxuICAgICMjIyBcbiAgICB1cGRhdGVWYWx1ZTogLT5cbiAgICAgICAgaWYgQGlzRW5kbGVzc1xuICAgICAgICAgICAgQHZhbHVlICs9IEBzcGVlZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdmFsdWUgPSAoQGZ1bmMoQHRpbWUsIEB2YWx1ZVN0YXJ0LCBAZGlzdGFuY2UsIEBkdXJhdGlvbikpXG4gICAgICAgICAgICBpZiArK0B0aW1lID4gQGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgbW92ZS9zY3JvbGwgYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUG9zaXRpb25cbiAgICAjIyMgICAgIFxuICAgIHVwZGF0ZVBvc2l0aW9uOiAoKSAtPlxuICAgICAgICBpZiBAaXNFbmRsZXNzXG4gICAgICAgICAgICBAeCArPSBAc3BlZWRYXG4gICAgICAgICAgICBAeSArPSBAc3BlZWRZXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB4ID0gKEBmdW5jKEB0aW1lLCBAc3RhcnRYLCBAZHgsIEBkdXJhdGlvbikpXG4gICAgICAgICAgICBAeSA9IChAZnVuYyhAdGltZSwgQHN0YXJ0WSwgQGR5LCBAZHVyYXRpb24pKVxuICAgIFxuICAgICAgICAgICAgQHRpbWUrK1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBAdGltZSA+IEBkdXJhdGlvblxuICAgICAgICAgICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICAgIFxuZ3MuRWFzaW5nID0gRWFzaW5nIl19
//# sourceURL=Easing_46.js