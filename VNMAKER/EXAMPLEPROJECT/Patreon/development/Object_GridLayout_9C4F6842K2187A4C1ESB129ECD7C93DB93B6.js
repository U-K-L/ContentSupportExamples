var Object_GridLayout,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_GridLayout = (function(superClass) {
  extend(Object_GridLayout, superClass);


  /**
  * A grid-layout which layouts all it sub-objects
  * in a grid of rows and columns.
  *
  * @module ui
  * @class Object_GridLayout
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_GridLayout(x, y, width, height, rows, columns) {
    Object_GridLayout.__super__.constructor.call(this);
    this.dstRect.set(x || 0, y || 0, width || 1, height || 1);

    /**
    * Indicates if the layout is resizable.
    * @property resizable
    * @type boolean
     */
    this.resizable = false;

    /**
    * The UI object's animator-component to execute different kind of animations like move, rotate, etc. on it.
    * @property animator
    * @type vn.Component_Animator
     */
    this.animator = new gs.Component_Animator();

    /**
    * The layout's sub-objects.
    * @property controls
    * @type ui.Object_UIElement[]
     */
    this.controls = [];

    /**
    * Number of rows for the grid.
    * @property rows
    * @type number
     */
    this.rows = rows;

    /**
    * Number of columns for the grid.
    * @property columns
    * @type number
     */
    this.columns = columns;

    /**
    * The spacing between the cells of the grid.
    * @property cellSpacing
    * @type ui.Spacing
     */
    this.cellSpacing = [0, 0, 0, 0];

    /**
    * Indicates if the layouts resizes to fit its content.
    * @property sizeToFit
    * @type boolean
     */
    this.sizeToFit = false;

    /**
    * The behavior component to add grid-layout specific behavior.
    * @property behavior
    * @type gs.Component_GridLayoutBehavior
     */
    this.behavior = new gs.Component_GridLayoutBehavior();
    this.addComponent(this.behavior);
    this.addComponent(this.animator);
  }

  return Object_GridLayout;

})(ui.Object_UIElement);

ui.Object_GridLayout = Object_GridLayout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsaUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7RUFVYSwyQkFBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxNQUFkLEVBQXNCLElBQXRCLEVBQTRCLE9BQTVCO0lBQ1QsaURBQUE7SUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUFBLElBQUssQ0FBbEIsRUFBcUIsQ0FBQSxJQUFLLENBQTFCLEVBQTZCLEtBQUEsSUFBUyxDQUF0QyxFQUF5QyxNQUFBLElBQVUsQ0FBbkQ7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQyxrQkFBSCxDQUFBOztBQUVoQjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxJQUFELEdBQVE7O0FBRVI7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVjs7QUFFZjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLDRCQUFILENBQUE7SUFFaEIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUE3RFM7Ozs7R0FYZSxFQUFFLENBQUM7O0FBMEVuQyxFQUFFLENBQUMsaUJBQUgsR0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9HcmlkTGF5b3V0XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfR3JpZExheW91dCBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAjIyMqXG4gICAgKiBBIGdyaWQtbGF5b3V0IHdoaWNoIGxheW91dHMgYWxsIGl0IHN1Yi1vYmplY3RzXG4gICAgKiBpbiBhIGdyaWQgb2Ygcm93cyBhbmQgY29sdW1ucy5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgT2JqZWN0X0dyaWRMYXlvdXRcbiAgICAqIEBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjICBcbiAgICBjb25zdHJ1Y3RvcjogKHgsIHksIHdpZHRoLCBoZWlnaHQsIHJvd3MsIGNvbHVtbnMpIC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgQGRzdFJlY3Quc2V0KHggfHwgMCwgeSB8fCAwLCB3aWR0aCB8fCAxLCBoZWlnaHQgfHwgMSApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBsYXlvdXQgaXMgcmVzaXphYmxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXNpemFibGVcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAcmVzaXphYmxlID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgYW5pbWF0b3ItY29tcG9uZW50IHRvIGV4ZWN1dGUgZGlmZmVyZW50IGtpbmQgb2YgYW5pbWF0aW9ucyBsaWtlIG1vdmUsIHJvdGF0ZSwgZXRjLiBvbiBpdC5cbiAgICAgICAgKiBAcHJvcGVydHkgYW5pbWF0b3JcbiAgICAgICAgKiBAdHlwZSB2bi5Db21wb25lbnRfQW5pbWF0b3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBhbmltYXRvciA9IG5ldyBncy5Db21wb25lbnRfQW5pbWF0b3IoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsYXlvdXQncyBzdWItb2JqZWN0cy5cbiAgICAgICAgKiBAcHJvcGVydHkgY29udHJvbHNcbiAgICAgICAgKiBAdHlwZSB1aS5PYmplY3RfVUlFbGVtZW50W11cbiAgICAgICAgIyMjXG4gICAgICAgIEBjb250cm9scyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogTnVtYmVyIG9mIHJvd3MgZm9yIHRoZSBncmlkLlxuICAgICAgICAqIEBwcm9wZXJ0eSByb3dzXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAcm93cyA9IHJvd3NcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBOdW1iZXIgb2YgY29sdW1ucyBmb3IgdGhlIGdyaWQuXG4gICAgICAgICogQHByb3BlcnR5IGNvbHVtbnNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb2x1bW5zID0gY29sdW1uc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBzcGFjaW5nIGJldHdlZW4gdGhlIGNlbGxzIG9mIHRoZSBncmlkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjZWxsU3BhY2luZ1xuICAgICAgICAqIEB0eXBlIHVpLlNwYWNpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBjZWxsU3BhY2luZyA9IFswLCAwLCAwLCAwXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgbGF5b3V0cyByZXNpemVzIHRvIGZpdCBpdHMgY29udGVudC5cbiAgICAgICAgKiBAcHJvcGVydHkgc2l6ZVRvRml0XG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQHNpemVUb0ZpdCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGJlaGF2aW9yIGNvbXBvbmVudCB0byBhZGQgZ3JpZC1sYXlvdXQgc3BlY2lmaWMgYmVoYXZpb3IuXG4gICAgICAgICogQHByb3BlcnR5IGJlaGF2aW9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29tcG9uZW50X0dyaWRMYXlvdXRCZWhhdmlvclxuICAgICAgICAjIyNcbiAgICAgICAgQGJlaGF2aW9yID0gbmV3IGdzLkNvbXBvbmVudF9HcmlkTGF5b3V0QmVoYXZpb3IoKVxuICAgICAgICBcbiAgICAgICAgQGFkZENvbXBvbmVudChAYmVoYXZpb3IpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGFuaW1hdG9yKVxuICAgICAgICBcbnVpLk9iamVjdF9HcmlkTGF5b3V0ID0gT2JqZWN0X0dyaWRMYXlvdXQiXX0=
//# sourceURL=Object_GridLayout_21.js