var Object_DataGrid,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_DataGrid = (function(superClass) {
  extend(Object_DataGrid, superClass);

  Object_DataGrid.accessors("zIndex", {
    set: function(v) {
      return this.zIndex_ = v;
    },
    get: function() {
      return (this.zIndex_ || 0) + (!this.parent ? 0 : this.parent.zIndex || 0);
    }
  });

  Object_DataGrid.accessors("scrollOffsetY", {
    set: function(v) {
      if (v !== this.scrollOffsetY_) {
        this.scrollOffsetY_ = v;
        return this.needsFullUpdate = true;
      }
    },
    get: function() {
      return this.scrollOffsetY_;
    }
  });


  /**
  * A data-grid allows to display items from a associated data-source using a specified item-template. 
  * Unlike a stack-layout, a data-grid is optimized to display even high amounts of items but they all
  * need to use the same item-template with same size.
  *
  * @module ui
  * @class Object_DataGrid
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_DataGrid(params) {
    Object_DataGrid.__super__.constructor.call(this);
    this.scrollOffsetY_ = 0;

    /**
    * The UI object's animator-component to execute different kind of animations like move, rotate, etc. on it.
    * @property animator
    * @type vn.Component_Animator
     */
    this.animator = new gs.Animator();

    /**
    * The behavior component to add free-layout specific behavior.
    * @property behavior
    * @type gs.Component_FreeLayoutBehavior
     */
    this.behavior = new ui.Component_DataGridBehavior(params);

    /**
    * Indicates if the layouts resizes to fit its content.
    * @property sizeToFit
    * @type boolean
     */
    this.sizeToFit = false;
    this.addComponent(this.behavior);
    this.addComponent(this.animator);
  }

  return Object_DataGrid;

})(ui.Object_UIElement);

ui.Object_DataGrid = Object_DataGrid;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZUFBQTtFQUFBOzs7QUFBTTs7O0VBQ0YsZUFBQyxDQUFBLFNBQUQsQ0FBVyxRQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO2FBQU8sSUFBQyxDQUFBLE9BQUQsR0FBVztJQUFsQixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUE7YUFBRyxDQUFDLElBQUMsQ0FBQSxPQUFELElBQVksQ0FBYixDQUFBLEdBQWtCLENBQUksQ0FBQyxJQUFDLENBQUEsTUFBTCxHQUFpQixDQUFqQixHQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsSUFBa0IsQ0FBM0M7SUFBckIsQ0FETDtHQURKOztFQUlDLGVBQUMsQ0FBQSxTQUFELENBQVcsZUFBWCxFQUNHO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxjQUFUO1FBQ0ksSUFBQyxDQUFBLGNBQUQsR0FBa0I7ZUFDbEIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsS0FGdkI7O0lBREMsQ0FBTDtJQUlBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FKTDtHQURIOzs7QUFPRDs7Ozs7Ozs7Ozs7O0VBV2EseUJBQUMsTUFBRDtJQUNULCtDQUFBO0lBRUEsSUFBQyxDQUFBLGNBQUQsR0FBa0I7O0FBQ2xCOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLFFBQUgsQ0FBQTs7QUFFaEI7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxFQUFFLENBQUMsMEJBQUgsQ0FBOEIsTUFBOUI7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFFYixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxRQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtFQTFCUzs7OztHQXZCYSxFQUFFLENBQUM7O0FBb0RqQyxFQUFFLENBQUMsZUFBSCxHQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X0RhdGFHcmlkXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfRGF0YUdyaWQgZXh0ZW5kcyB1aS5PYmplY3RfVUlFbGVtZW50XG4gICAgQGFjY2Vzc29ycyBcInpJbmRleFwiLCBcbiAgICAgICAgc2V0OiAodikgLT4gQHpJbmRleF8gPSB2LCBcbiAgICAgICAgZ2V0OiAtPiAoQHpJbmRleF8gfHwgMCkgKyAoaWYgIUBwYXJlbnQgdGhlbiAwIGVsc2UgQHBhcmVudC56SW5kZXggfHwgMClcbiAgICAgICAgXG4gICAgIEBhY2Nlc3NvcnMgXCJzY3JvbGxPZmZzZXRZXCIsXG4gICAgICAgIHNldDogKHYpIC0+IFxuICAgICAgICAgICAgaWYgdiAhPSBAc2Nyb2xsT2Zmc2V0WV9cbiAgICAgICAgICAgICAgICBAc2Nyb2xsT2Zmc2V0WV8gPSB2XG4gICAgICAgICAgICAgICAgQG5lZWRzRnVsbFVwZGF0ZSA9IHllc1xuICAgICAgICBnZXQ6IC0+IEBzY3JvbGxPZmZzZXRZX1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBIGRhdGEtZ3JpZCBhbGxvd3MgdG8gZGlzcGxheSBpdGVtcyBmcm9tIGEgYXNzb2NpYXRlZCBkYXRhLXNvdXJjZSB1c2luZyBhIHNwZWNpZmllZCBpdGVtLXRlbXBsYXRlLiBcbiAgICAqIFVubGlrZSBhIHN0YWNrLWxheW91dCwgYSBkYXRhLWdyaWQgaXMgb3B0aW1pemVkIHRvIGRpc3BsYXkgZXZlbiBoaWdoIGFtb3VudHMgb2YgaXRlbXMgYnV0IHRoZXkgYWxsXG4gICAgKiBuZWVkIHRvIHVzZSB0aGUgc2FtZSBpdGVtLXRlbXBsYXRlIHdpdGggc2FtZSBzaXplLlxuICAgICpcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBPYmplY3RfRGF0YUdyaWRcbiAgICAqIEBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjICBcbiAgICBjb25zdHJ1Y3RvcjogKHBhcmFtcykgLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgQHNjcm9sbE9mZnNldFlfID0gMFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIFVJIG9iamVjdCdzIGFuaW1hdG9yLWNvbXBvbmVudCB0byBleGVjdXRlIGRpZmZlcmVudCBraW5kIG9mIGFuaW1hdGlvbnMgbGlrZSBtb3ZlLCByb3RhdGUsIGV0Yy4gb24gaXQuXG4gICAgICAgICogQHByb3BlcnR5IGFuaW1hdG9yXG4gICAgICAgICogQHR5cGUgdm4uQ29tcG9uZW50X0FuaW1hdG9yXG4gICAgICAgICMjI1xuICAgICAgICBAYW5pbWF0b3IgPSBuZXcgZ3MuQW5pbWF0b3IoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBiZWhhdmlvciBjb21wb25lbnQgdG8gYWRkIGZyZWUtbGF5b3V0IHNwZWNpZmljIGJlaGF2aW9yLlxuICAgICAgICAqIEBwcm9wZXJ0eSBiZWhhdmlvclxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9GcmVlTGF5b3V0QmVoYXZpb3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBiZWhhdmlvciA9IG5ldyB1aS5Db21wb25lbnRfRGF0YUdyaWRCZWhhdmlvcihwYXJhbXMpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBsYXlvdXRzIHJlc2l6ZXMgdG8gZml0IGl0cyBjb250ZW50LlxuICAgICAgICAqIEBwcm9wZXJ0eSBzaXplVG9GaXRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAc2l6ZVRvRml0ID0gbm9cbiAgICAgICAgXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGJlaGF2aW9yKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBhbmltYXRvcilcbiAgICAgICAgXG4gICAgICAgIFxudWkuT2JqZWN0X0RhdGFHcmlkID0gT2JqZWN0X0RhdGFHcmlkIl19
//# sourceURL=Object_DataGrid_137.js