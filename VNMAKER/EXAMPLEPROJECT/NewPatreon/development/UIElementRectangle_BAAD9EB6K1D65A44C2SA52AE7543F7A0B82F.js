var UIElementRectangle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

UIElementRectangle = (function(superClass) {
  extend(UIElementRectangle, superClass);


  /**
  * An ui rectangle is like a regular gs.Rect rectangle but if one of the
  * rectangle's coordinates is changed the <b>needsUpdate</b> property of the
  * assigned game object will be set to <b>true</b> to trigger a refresh.
  *
  * @module ui
  * @class UIElementRectangle
  * @extends gs.Rect
  * @memberof ui
  * @constructor
  * @params {Object} object - The UI object the rectangle belongs to.
   */

  function UIElementRectangle(object) {

    /**
    * The UI object the rectangle belongs to.
    * @property object
    * @type gs.Object_UIElement
     */
    this.object = object != null ? object : {};

    /**
    * The x-coordinate of the rectangle.
    * @property x
    * @type number
     */
    this.x = 0;

    /**
    * The y-coordinate of the rectangle.
    * @property y
    * @type number
     */
    this.y = 0;

    /**
    * The width of the rectangle.
    * @property width
    * @type number
     */
    this.width = 1;

    /**
    * The height of the rectangle.
    * @property height
    * @type number
     */
    this.height = 1;
  }

  UIElementRectangle.accessors("x", {
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

  UIElementRectangle.accessors("y", {
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

  UIElementRectangle.accessors("width", {
    set: function(width) {
      if (width !== this.width_) {
        this.width_ = width;
        return this.object.needsUpdate = true;
      }
    },
    get: function() {
      return this.width_;
    }
  });

  UIElementRectangle.accessors("height", {
    set: function(height) {
      if (height !== this.height_) {
        this.height_ = height;
        return this.object.needsUpdate = true;
      }
    },
    get: function() {
      return this.height_;
    }
  });

  UIElementRectangle.prototype.toRect = function() {
    return new gs.Rect(this.x, this.y, this.width, this.height);
  };

  UIElementRectangle.fromRect = function(object, rect) {
    var result;
    result = new ui.UIElementRectangle(object);
    result.x = rect.x;
    result.y = rect.y;
    result.width = rect.width;
    result.height = rect.height;
    return result;
  };

  return UIElementRectangle;

})(Rect);

ui.UIElementRectangle = UIElementRectangle;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsa0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7OztFQVlhLDRCQUFDLE1BQUQ7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsb0JBQVUsU0FBUzs7QUFFbkI7Ozs7O0lBS0EsSUFBQyxDQUFBLENBQUQsR0FBSzs7QUFFTDs7Ozs7SUFLQSxJQUFDLENBQUEsQ0FBRCxHQUFLOztBQUVMOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtFQWxDRDs7RUFvQ2Isa0JBQUMsQ0FBQSxTQUFELENBQVcsR0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxFQUFUO1FBQ0ksSUFBQyxDQUFBLEVBQUQsR0FBTTtlQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUYxQjs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBT0Esa0JBQUMsQ0FBQSxTQUFELENBQVcsR0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxFQUFUO1FBQ0ksSUFBQyxDQUFBLEVBQUQsR0FBTTtlQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUYxQjs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBT0Esa0JBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsS0FBRDtNQUNELElBQUcsS0FBQSxLQUFTLElBQUMsQ0FBQSxNQUFiO1FBQ0ksSUFBQyxDQUFBLE1BQUQsR0FBVTtlQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUYxQjs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBT0Esa0JBQUMsQ0FBQSxTQUFELENBQVcsUUFBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsTUFBRDtNQUNELElBQUcsTUFBQSxLQUFVLElBQUMsQ0FBQSxPQUFkO1FBQ0ksSUFBQyxDQUFBLE9BQUQsR0FBVztlQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUYxQjs7SUFEQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7OytCQU9BLE1BQUEsR0FBUSxTQUFBO1dBQU8sSUFBQSxFQUFFLENBQUMsSUFBSCxDQUFRLElBQUMsQ0FBQSxDQUFULEVBQVksSUFBQyxDQUFBLENBQWIsRUFBZ0IsSUFBQyxDQUFBLEtBQWpCLEVBQXdCLElBQUMsQ0FBQSxNQUF6QjtFQUFQOztFQUVSLGtCQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDUCxRQUFBO0lBQUEsTUFBQSxHQUFhLElBQUEsRUFBRSxDQUFDLGtCQUFILENBQXNCLE1BQXRCO0lBQ2IsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFJLENBQUM7SUFDaEIsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFJLENBQUM7SUFDaEIsTUFBTSxDQUFDLEtBQVAsR0FBZSxJQUFJLENBQUM7SUFDcEIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsSUFBSSxDQUFDO0FBQ3JCLFdBQU87RUFOQTs7OztHQS9Fa0I7O0FBeUZqQyxFQUFFLENBQUMsa0JBQUgsR0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IFVJRWxlbWVudFJlY3RhbmdsZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgVUlFbGVtZW50UmVjdGFuZ2xlIGV4dGVuZHMgUmVjdFxuICAgICMjIypcbiAgICAqIEFuIHVpIHJlY3RhbmdsZSBpcyBsaWtlIGEgcmVndWxhciBncy5SZWN0IHJlY3RhbmdsZSBidXQgaWYgb25lIG9mIHRoZVxuICAgICogcmVjdGFuZ2xlJ3MgY29vcmRpbmF0ZXMgaXMgY2hhbmdlZCB0aGUgPGI+bmVlZHNVcGRhdGU8L2I+IHByb3BlcnR5IG9mIHRoZVxuICAgICogYXNzaWduZWQgZ2FtZSBvYmplY3Qgd2lsbCBiZSBzZXQgdG8gPGI+dHJ1ZTwvYj4gdG8gdHJpZ2dlciBhIHJlZnJlc2guXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIFVJRWxlbWVudFJlY3RhbmdsZVxuICAgICogQGV4dGVuZHMgZ3MuUmVjdFxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbXMge09iamVjdH0gb2JqZWN0IC0gVGhlIFVJIG9iamVjdCB0aGUgcmVjdGFuZ2xlIGJlbG9uZ3MgdG8uXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChvYmplY3QpIC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0IHRoZSByZWN0YW5nbGUgYmVsb25ncyB0by5cbiAgICAgICAgKiBAcHJvcGVydHkgb2JqZWN0XG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X1VJRWxlbWVudFxuICAgICAgICAjIyNcbiAgICAgICAgQG9iamVjdCA9IG9iamVjdCA/IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgcmVjdGFuZ2xlLlxuICAgICAgICAqIEBwcm9wZXJ0eSB4XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAeCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSByZWN0YW5nbGUuXG4gICAgICAgICogQHByb3BlcnR5IHlcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEB5ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSB3aWR0aCBvZiB0aGUgcmVjdGFuZ2xlLlxuICAgICAgICAqIEBwcm9wZXJ0eSB3aWR0aFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHdpZHRoID0gMVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIHJlY3RhbmdsZS5cbiAgICAgICAgKiBAcHJvcGVydHkgaGVpZ2h0XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAaGVpZ2h0ID0gMVxuICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJ4XCIsIFxuICAgICAgICBzZXQ6ICh4KSAtPlxuICAgICAgICAgICAgaWYgeCAhPSBAeF9cbiAgICAgICAgICAgICAgICBAeF8gPSB4XG4gICAgICAgICAgICAgICAgQG9iamVjdC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICBnZXQ6IC0+IEB4X1xuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwieVwiLCBcbiAgICAgICAgc2V0OiAoeSkgLT5cbiAgICAgICAgICAgIGlmIHkgIT0gQHlfXG4gICAgICAgICAgICAgICAgQHlfID0geVxuICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgZ2V0OiAtPiBAeV9cbiAgICAgICAgXG4gICAgQGFjY2Vzc29ycyBcIndpZHRoXCIsIFxuICAgICAgICBzZXQ6ICh3aWR0aCkgLT5cbiAgICAgICAgICAgIGlmIHdpZHRoICE9IEB3aWR0aF9cbiAgICAgICAgICAgICAgICBAd2lkdGhfID0gd2lkdGhcbiAgICAgICAgICAgICAgICBAb2JqZWN0Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgIGdldDogLT4gQHdpZHRoX1xuICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJoZWlnaHRcIiwgXG4gICAgICAgIHNldDogKGhlaWdodCkgLT5cbiAgICAgICAgICAgIGlmIGhlaWdodCAhPSBAaGVpZ2h0X1xuICAgICAgICAgICAgICAgIEBoZWlnaHRfID0gaGVpZ2h0XG4gICAgICAgICAgICAgICAgQG9iamVjdC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICBnZXQ6IC0+IEBoZWlnaHRfXG4gICAgICAgIFxuICAgIHRvUmVjdDogLT4gbmV3IGdzLlJlY3QoQHgsIEB5LCBAd2lkdGgsIEBoZWlnaHQpXG4gICAgICAgIFxuICAgIEBmcm9tUmVjdDogKG9iamVjdCwgcmVjdCkgLT5cbiAgICAgICAgcmVzdWx0ID0gbmV3IHVpLlVJRWxlbWVudFJlY3RhbmdsZShvYmplY3QpXG4gICAgICAgIHJlc3VsdC54ID0gcmVjdC54XG4gICAgICAgIHJlc3VsdC55ID0gcmVjdC55XG4gICAgICAgIHJlc3VsdC53aWR0aCA9IHJlY3Qud2lkdGhcbiAgICAgICAgcmVzdWx0LmhlaWdodCA9IHJlY3QuaGVpZ2h0XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgXG4gICAgXG4gICAgICAgXG51aS5VSUVsZW1lbnRSZWN0YW5nbGUgPSBVSUVsZW1lbnRSZWN0YW5nbGUiXX0=
//# sourceURL=UIElementRectangle_60.js