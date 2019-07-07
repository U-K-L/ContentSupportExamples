var Component_SpreadLayoutBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_SpreadLayoutBehavior = (function(superClass) {
  extend(Component_SpreadLayoutBehavior, superClass);


  /**
  * Turns a game object into a spread-layout and spreads all sub-objects
  * evenly over the layout-space vertically or horizontally. The game object needs a 
  * container-component.
  *
  * @module gs
  * @class Component_SpreadLayoutBehavior
  * @extends gs.Component_LayoutBehavior
  * @memberof gs
  * @constructor
   */

  function Component_SpreadLayoutBehavior(orientation) {
    Component_SpreadLayoutBehavior.__super__.constructor.apply(this, arguments);

    /**
    * The orientation of the spread-layout.
    * @property orientation
    * @type gs.Orientation.
     */
    this.orientation = orientation || 0;
  }


  /**
  * Updates the spread-layout.
  *
  * @method update
   */

  Component_SpreadLayoutBehavior.prototype.update = function() {
    Component_SpreadLayoutBehavior.__super__.update.apply(this, arguments);
    this.object.visible_ = this.object.visible && (!this.object.parent || this.object.parent.visible);
    if (this.orientation === 0) {
      return this.layoutHorizontal();
    } else {
      return this.layoutVertical();
    }
  };


  /**
  * Spreads all sub-objects evenly over the layout-space horizontally.
  *
  * @method layoutHorizontal
   */

  Component_SpreadLayoutBehavior.prototype.layoutHorizontal = function() {
    var control, count, i, j, rect, ref, y;
    count = this.object.controls.length;
    this.object.visible_ = this.object.visible && (!this.object.parent || this.object.parent.visible);
    y = 0;
    rect = this.object.dstRect;
    for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      control = this.object.controls[i];
      control.parent = this.object;
      control.update();
      control.dstRect.x = Math.floor((rect.width - control.dstRect.width) / (count - 1)) * i;
      if (!control.clipRect) {
        control.clipRect = this.object.clipRect;
      }
      if (control.alignmentY === 1) {
        control.dstRect.y = y + Math.round((rect.height - (control.dstRect.height + control.margin.top + control.margin.bottom)) / 2);
      }
    }
    if (this.object.clipRect != null) {
      return this.object.clipRect.set(rect.x, rect.y, rect.width, rect.height);
    }
  };


  /**
  * Spreads all sub-objects evenly over the layout-space vertically.
  *
  * @method layoutHorizontal
   */

  Component_SpreadLayoutBehavior.prototype.layoutVertical = function() {
    var control, count, i, j, rect, ref, x;
    count = this.object.controls.length;
    this.object.visible_ = this.object.visible && (!this.object.parent || this.object.parent.visible);
    x = 0;
    rect = this.object.dstRect;
    for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      control = this.object.controls[i];
      control.parent = this.object;
      control.update();
      control.dstRect.y = Math.floor(rect.height / count) * i;
      if (!control.clipRect) {
        control.clipRect = this.object.clipRect;
      }
      if (control.alignmentX === 1) {
        control.dstRect.x = x + Math.round((rect.width - (control.dstRect.width + control.margin.left + control.margin.right)) / 2);
      }
    }
    if (this.object.clipRect != null) {
      return this.object.clipRect.set(rect.x, rect.y, rect.width, rect.height);
    }
  };

  return Component_SpreadLayoutBehavior;

})(gs.Component_LayoutBehavior);

gs.Component_SpreadLayoutBehavior = Component_SpreadLayoutBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsOEJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7O0VBV2Esd0NBQUMsV0FBRDtJQUNULGlFQUFBLFNBQUE7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQUFBLElBQWU7RUFSckI7OztBQVViOzs7Ozs7MkNBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSiw0REFBQSxTQUFBO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLEdBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixJQUFvQixDQUFDLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFULElBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQW5DO0lBQ3ZDLElBQUcsSUFBQyxDQUFBLFdBQUQsS0FBZ0IsQ0FBbkI7YUFDSSxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxFQURKO0tBQUEsTUFBQTthQUdJLElBQUMsQ0FBQSxjQUFELENBQUEsRUFISjs7RUFISTs7O0FBUVI7Ozs7OzsyQ0FLQSxnQkFBQSxHQUFrQixTQUFBO0FBQ2QsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUN6QixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsR0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLElBQW9CLENBQUMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVQsSUFBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBbkM7SUFDdkMsQ0FBQSxHQUFJO0lBQ0osSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFFZixTQUFTLDhFQUFUO01BQ0ksT0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUyxDQUFBLENBQUE7TUFDM0IsT0FBTyxDQUFDLE1BQVIsR0FBaUIsSUFBQyxD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PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfU3ByZWFkTGF5b3V0QmVoYXZpb3JcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9TcHJlYWRMYXlvdXRCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRCZWhhdmlvclxuICAgICMjIypcbiAgICAqIFR1cm5zIGEgZ2FtZSBvYmplY3QgaW50byBhIHNwcmVhZC1sYXlvdXQgYW5kIHNwcmVhZHMgYWxsIHN1Yi1vYmplY3RzXG4gICAgKiBldmVubHkgb3ZlciB0aGUgbGF5b3V0LXNwYWNlIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5LiBUaGUgZ2FtZSBvYmplY3QgbmVlZHMgYSBcbiAgICAqIGNvbnRhaW5lci1jb21wb25lbnQuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9TcHJlYWRMYXlvdXRCZWhhdmlvclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0xheW91dEJlaGF2aW9yXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAob3JpZW50YXRpb24pIC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzcHJlYWQtbGF5b3V0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBvcmllbnRhdGlvblxuICAgICAgICAqIEB0eXBlIGdzLk9yaWVudGF0aW9uLlxuICAgICAgICAjIyNcbiAgICAgICAgQG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24gfHwgMFxuXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3ByZWFkLWxheW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgQG9iamVjdC52aXNpYmxlXyA9IEBvYmplY3QudmlzaWJsZSBhbmQgKCFAb2JqZWN0LnBhcmVudCBvciBAb2JqZWN0LnBhcmVudC52aXNpYmxlKVxuICAgICAgICBpZiBAb3JpZW50YXRpb24gPT0gMFxuICAgICAgICAgICAgQGxheW91dEhvcml6b250YWwoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAbGF5b3V0VmVydGljYWwoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFNwcmVhZHMgYWxsIHN1Yi1vYmplY3RzIGV2ZW5seSBvdmVyIHRoZSBsYXlvdXQtc3BhY2UgaG9yaXpvbnRhbGx5LlxuICAgICpcbiAgICAqIEBtZXRob2QgbGF5b3V0SG9yaXpvbnRhbFxuICAgICMjIyAgICAgICAgXG4gICAgbGF5b3V0SG9yaXpvbnRhbDogLT5cbiAgICAgICAgY291bnQgPSBAb2JqZWN0LmNvbnRyb2xzLmxlbmd0aFxuICAgICAgICBAb2JqZWN0LnZpc2libGVfID0gQG9iamVjdC52aXNpYmxlIGFuZCAoIUBvYmplY3QucGFyZW50IG9yIEBvYmplY3QucGFyZW50LnZpc2libGUpXG4gICAgICAgIHkgPSAwXG4gICAgICAgIHJlY3QgPSBAb2JqZWN0LmRzdFJlY3RcbiAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi4uY291bnRdXG4gICAgICAgICAgICBjb250cm9sID0gQG9iamVjdC5jb250cm9sc1tpXVxuICAgICAgICAgICAgY29udHJvbC5wYXJlbnQgPSBAb2JqZWN0XG4gICAgICAgICAgICBjb250cm9sLnVwZGF0ZSgpXG5cbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gTWF0aC5mbG9vcigocmVjdC53aWR0aC1jb250cm9sLmRzdFJlY3Qud2lkdGgpIC8gKGNvdW50LTEpKSAqIGlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgIWNvbnRyb2wuY2xpcFJlY3RcbiAgICAgICAgICAgICAgICBjb250cm9sLmNsaXBSZWN0ID0gQG9iamVjdC5jbGlwUmVjdFxuICAgICAgICAgICAgaWYgY29udHJvbC5hbGlnbm1lbnRZID09IDFcbiAgICAgICAgICAgICAgICBjb250cm9sLmRzdFJlY3QueSA9IHkgKyBNYXRoLnJvdW5kKChyZWN0LmhlaWdodC0oY29udHJvbC5kc3RSZWN0LmhlaWdodCtjb250cm9sLm1hcmdpbi50b3ArY29udHJvbC5tYXJnaW4uYm90dG9tKSkgLyAyKVxuICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QuY2xpcFJlY3Q/XG4gICAgICAgICAgICBAb2JqZWN0LmNsaXBSZWN0LnNldChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpICBcbiAgICAgIFxuICAgICMjIypcbiAgICAqIFNwcmVhZHMgYWxsIHN1Yi1vYmplY3RzIGV2ZW5seSBvdmVyIHRoZSBsYXlvdXQtc3BhY2UgdmVydGljYWxseS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxheW91dEhvcml6b250YWxcbiAgICAjIyMgICAgICAgICAgICAgIFxuICAgIGxheW91dFZlcnRpY2FsOiAtPlxuICAgICAgICBjb3VudCA9IEBvYmplY3QuY29udHJvbHMubGVuZ3RoXG4gICAgICAgIEBvYmplY3QudmlzaWJsZV8gPSBAb2JqZWN0LnZpc2libGUgYW5kICghQG9iamVjdC5wYXJlbnQgb3IgQG9iamVjdC5wYXJlbnQudmlzaWJsZSlcbiAgICAgICAgeCA9IDBcbiAgICAgICAgcmVjdCA9IEBvYmplY3QuZHN0UmVjdFxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5jb3VudF1cbiAgICAgICAgICAgIGNvbnRyb2wgPSBAb2JqZWN0LmNvbnRyb2xzW2ldXG4gICAgICAgICAgICBjb250cm9sLnBhcmVudCA9IEBvYmplY3RcbiAgICAgICAgICAgIGNvbnRyb2wudXBkYXRlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnkgPSBNYXRoLmZsb29yKHJlY3QuaGVpZ2h0IC8gY291bnQpICogaVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAhY29udHJvbC5jbGlwUmVjdFxuICAgICAgICAgICAgICAgIGNvbnRyb2wuY2xpcFJlY3QgPSBAb2JqZWN0LmNsaXBSZWN0XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBjb250cm9sLmFsaWdubWVudFggPT0gMVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0geCArIE1hdGgucm91bmQoKHJlY3Qud2lkdGgtKGNvbnRyb2wuZHN0UmVjdC53aWR0aCtjb250cm9sLm1hcmdpbi5sZWZ0K2NvbnRyb2wubWFyZ2luLnJpZ2h0KSkgLyAyKVxuICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QuY2xpcFJlY3Q/XG4gICAgICAgICAgICBAb2JqZWN0LmNsaXBSZWN0LnNldChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpIFxuICAgXG5ncy5Db21wb25lbnRfU3ByZWFkTGF5b3V0QmVoYXZpb3IgPSBDb21wb25lbnRfU3ByZWFkTGF5b3V0QmVoYXZpb3IiXX0=
//# sourceURL=Component_SpreadLayoutBehavior_67.js