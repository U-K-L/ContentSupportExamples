var UIElementPoint;

UIElementPoint = (function() {

  /**
  * An ui point is like a regular point with an x- and y-coordinate but if one of the
  * coordinates is changed the <b>needsUpdate</b> property of the
  * assigned game object will be set to <b>true</b> to trigger a refresh.
  *
  * @module ui
  * @class UIElementPoint
  * @memberof ui
  * @constructor
  * @params {Object} object - The UI object the rectangle belongs to.
   */
  function UIElementPoint(object) {

    /**
    * The UI object the rectangle belongs to.
    * @property object
    * @type gs.Object_UIElement
     */
    this.object = object != null ? object : {};

    /**
    * The x-coordinate of the point.
    * @property x
    * @type number
     */
    this.x = 0;

    /**
    * The y-coordinate of the point.
    * @property y
    * @type number
     */
    this.y = 0;
  }

  UIElementPoint.accessors("x", {
    set: function(x) {
      if (x !== this.x_) {
        this.x_ = x;
        return this.object.needsUpdate = true;
      }
    },
    get: function() {
      return this.x_;
    }
  });

  UIElementPoint.accessors("y", {
    set: function(y) {
      if (y !== this.y_) {
        this.y_ = y;
        return this.object.needsUpdate = true;
      }
    },
    get: function() {
      return this.y_;
    }
  });

  return UIElementPoint;

})();

ui.UIElementPoint = UIElementPoint;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7O0VBV2Esd0JBQUMsTUFBRDs7QUFDVDs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxvQkFBVSxTQUFTOztBQUVuQjs7Ozs7SUFLQSxJQUFDLENBQUEsQ0FBRCxHQUFLOztBQUVMOzs7OztJQUtBLElBQUMsQ0FBQSxDQUFELEdBQUs7RUFwQkk7O0VBc0JiLGNBQUMsQ0FBQSxTQUFELENBQVcsR0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxFQUFUO1FBQ0ksSUFBQyxDQUFBLEVBQUQsR0FBTTtlQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUYxQjs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBT0EsY0FBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO01BQ0QsSUFBRyxDQUFBLEtBQUssSUFBQyxDQUFBLEVBQVQ7UUFDSSxJQUFDLENBQUEsRUFBRCxHQUFNO2VBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLEdBQXNCLEtBRjFCOztJQURDLENBQUw7SUFJQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBSkw7R0FESjs7Ozs7O0FBT0osRUFBRSxDQUFDLGNBQUgsR0FBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IFVJRWxlbWVudFBvaW50XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBVSUVsZW1lbnRQb2ludFxuICAgICMjIypcbiAgICAqIEFuIHVpIHBvaW50IGlzIGxpa2UgYSByZWd1bGFyIHBvaW50IHdpdGggYW4geC0gYW5kIHktY29vcmRpbmF0ZSBidXQgaWYgb25lIG9mIHRoZVxuICAgICogY29vcmRpbmF0ZXMgaXMgY2hhbmdlZCB0aGUgPGI+bmVlZHNVcGRhdGU8L2I+IHByb3BlcnR5IG9mIHRoZVxuICAgICogYXNzaWduZWQgZ2FtZSBvYmplY3Qgd2lsbCBiZSBzZXQgdG8gPGI+dHJ1ZTwvYj4gdG8gdHJpZ2dlciBhIHJlZnJlc2guXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIFVJRWxlbWVudFBvaW50XG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtcyB7T2JqZWN0fSBvYmplY3QgLSBUaGUgVUkgb2JqZWN0IHRoZSByZWN0YW5nbGUgYmVsb25ncyB0by5cbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKG9iamVjdCkgLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QgdGhlIHJlY3RhbmdsZSBiZWxvbmdzIHRvLlxuICAgICAgICAqIEBwcm9wZXJ0eSBvYmplY3RcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfVUlFbGVtZW50XG4gICAgICAgICMjI1xuICAgICAgICBAb2JqZWN0ID0gb2JqZWN0ID8ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAgICAgKiBAcHJvcGVydHkgeFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHggPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgICAgICogQHByb3BlcnR5IHlcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEB5ID0gMFxuICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJ4XCIsIFxuICAgICAgICBzZXQ6ICh4KSAtPlxuICAgICAgICAgICAgaWYgeCAhPSBAeF9cbiAgICAgICAgICAgICAgICBAeF8gPSB4XG4gICAgICAgICAgICAgICAgQG9iamVjdC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICBnZXQ6IC0+IEB4X1xuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwieVwiLCBcbiAgICAgICAgc2V0OiAoeSkgLT5cbiAgICAgICAgICAgIGlmIHkgIT0gQHlfXG4gICAgICAgICAgICAgICAgQHlfID0geVxuICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgZ2V0OiAtPiBAeV9cbiAgICAgICBcbnVpLlVJRWxlbWVudFBvaW50ID0gVUlFbGVtZW50UG9pbnQgICAiXX0=
//# sourceURL=UIElementPoint_70.js