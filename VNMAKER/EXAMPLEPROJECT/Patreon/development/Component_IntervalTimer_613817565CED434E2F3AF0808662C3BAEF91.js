var Component_IntervalTimer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_IntervalTimer = (function(superClass) {
  extend(Component_IntervalTimer, superClass);


  /**
  * A component which adds timing-features to a game object. The game object
  * will send an "elapsed" event everytime the time interval has been elapsed.
  *
  * @module gs
  * @class Component_IntervalTimer
  * @extends gs.Component
  * @memberof gs
   */

  function Component_IntervalTimer() {
    Component_IntervalTimer.__super__.constructor.call(this);

    /**
    * Indicates if the timer is running. 
    *
    * @property isRunning
    * @type boolean
    * @readOnly
     */
    this.isRunning = false;

    /**
    * @property frameCount
    * @type number
    * @private
     */
    this.frameCount = 0;

    /**
    * The interval at which the associated action will be executed.
    * @property interval
    * @type number
     */
    this.interval = 0;
  }


  /**
  * Starts the timer. 
  *
  * @method start
   */

  Component_IntervalTimer.prototype.start = function() {
    this.isRunning = true;
    return this.frameCount = 0;
  };


  /**
  * Stops the timer. 
  *
  * @method stop
   */

  Component_IntervalTimer.prototype.stop = function() {
    return this.isRunning = false;
  };


  /**
  * Resumes the timer. 
  *
  * @method resume
   */

  Component_IntervalTimer.prototype.resume = function() {
    return this.isRunning = true;
  };


  /**
  * Pauses the timer. 
  *
  * @method pause
   */

  Component_IntervalTimer.prototype.pause = function() {
    return this.isRunning = false;
  };


  /**
  * Updates the timer.
  *
  * @method update
   */

  Component_IntervalTimer.prototype.update = function() {
    if (this.isRunning) {
      this.frameCount++;
      if (this.frameCount >= this.interval) {
        this.object.events.emit("elapsed", this.object);
        return this.frameCount = 0;
      }
    }
  };

  return Component_IntervalTimer;

})(gs.Component);

gs.Component_IntervalTimer = Component_IntervalTimer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGlDQUFBO0lBQ1QsdURBQUE7O0FBRUE7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxVQUFELEdBQWM7O0FBRWQ7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtFQXhCSDs7O0FBMEJiOzs7Ozs7b0NBS0EsS0FBQSxHQUFPLFNBQUE7SUFDSCxJQUFDLENBQUEsU0FBRCxHQUFhO1dBQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUZYOzs7QUFJUDs7Ozs7O29DQUtBLElBQUEsR0FBTSxTQUFBO1dBQUcsSUFBQyxDQUFBLFNBQUQsR0FBYTtFQUFoQjs7O0FBRU47Ozs7OztvQ0FLQSxNQUFBLEdBQVEsU0FBQTtXQUFHLElBQUMsQ0FBQSxTQUFELEdBQWE7RUFBaEI7OztBQUVSOzs7Ozs7b0NBS0EsS0FBQSxHQUFPLFNBQUE7V0FBRyxJQUFDLENBQUEsU0FBRCxHQUFhO0VBQWhCOzs7QUFFUDs7Ozs7O29DQUtBLE1BQUEsR0FBUSxTQUFBO0lBQ0osSUFBRyxJQUFDLENBQUEsU0FBSjtNQUNJLElBQUMsQ0FBQSxVQUFEO01BRUEsSUFBRyxJQUFDLENBQUEsVUFBRCxJQUFlLElBQUMsQ0FBQSxRQUFuQjtRQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQWYsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBQyxDQUFBLE1BQWhDO2VBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUZsQjtPQUhKOztFQURJOzs7O0dBdkUwQixFQUFFLENBQUM7O0FBb0Z6QyxFQUFFLENBQUMsdUJBQUgsR0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9JbnRlcnZhbFRpbWVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfSW50ZXJ2YWxUaW1lciBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIEEgY29tcG9uZW50IHdoaWNoIGFkZHMgdGltaW5nLWZlYXR1cmVzIHRvIGEgZ2FtZSBvYmplY3QuIFRoZSBnYW1lIG9iamVjdFxuICAgICogd2lsbCBzZW5kIGFuIFwiZWxhcHNlZFwiIGV2ZW50IGV2ZXJ5dGltZSB0aGUgdGltZSBpbnRlcnZhbCBoYXMgYmVlbiBlbGFwc2VkLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfSW50ZXJ2YWxUaW1lclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgdGltZXIgaXMgcnVubmluZy4gXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgaXNSdW5uaW5nXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGZyYW1lQ291bnRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lQ291bnQgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGludGVydmFsIGF0IHdoaWNoIHRoZSBhc3NvY2lhdGVkIGFjdGlvbiB3aWxsIGJlIGV4ZWN1dGVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbnRlcnZhbFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGludGVydmFsID0gMFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIHRpbWVyLiBcbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgIyMjXG4gICAgc3RhcnQ6IC0+IFxuICAgICAgICBAaXNSdW5uaW5nID0geWVzXG4gICAgICAgIEBmcmFtZUNvdW50ID0gMFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTdG9wcyB0aGUgdGltZXIuIFxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RvcFxuICAgICMjIyAgIFxuICAgIHN0b3A6IC0+IEBpc1J1bm5pbmcgPSBub1xuICAgIFxuICAgICMjIypcbiAgICAqIFJlc3VtZXMgdGhlIHRpbWVyLiBcbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3VtZVxuICAgICMjI1xuICAgIHJlc3VtZTogLT4gQGlzUnVubmluZyA9IHllc1xuICAgIFxuICAgICMjIypcbiAgICAqIFBhdXNlcyB0aGUgdGltZXIuIFxuICAgICpcbiAgICAqIEBtZXRob2QgcGF1c2VcbiAgICAjIyNcbiAgICBwYXVzZTogLT4gQGlzUnVubmluZyA9IG5vXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHRpbWVyLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBpZiBAaXNSdW5uaW5nXG4gICAgICAgICAgICBAZnJhbWVDb3VudCsrXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBmcmFtZUNvdW50ID49IEBpbnRlcnZhbFxuICAgICAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzLmVtaXQoXCJlbGFwc2VkXCIsIEBvYmplY3QpXG4gICAgICAgICAgICAgICAgQGZyYW1lQ291bnQgPSAwXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICBcblxuICAgICAgICBcbiBcbmdzLkNvbXBvbmVudF9JbnRlcnZhbFRpbWVyID0gQ29tcG9uZW50X0ludGVydmFsVGltZXIiXX0=
//# sourceURL=Component_IntervalTimer_174.js