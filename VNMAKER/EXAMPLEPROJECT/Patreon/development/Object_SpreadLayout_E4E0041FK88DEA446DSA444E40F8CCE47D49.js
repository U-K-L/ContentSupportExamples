var Object_SpreadLayout,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_SpreadLayout = (function(superClass) {
  extend(Object_SpreadLayout, superClass);


  /**
  * A spread-layout which spreads all sub-objects evenly over the layout-space 
  * vertically or horizontally.
  *
  * @module ui
  * @class Object_SpreadLayout
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_SpreadLayout(x, y, width, height, orientation) {
    Object_SpreadLayout.__super__.constructor.call(this);
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
    * @type gs.Component_Animator
     */
    this.animator = new gs.Animator();

    /**
    * The layout's sub-objects.
    * @property controls
    * @type ui.Object_UIElement[]
     */
    this.controls = [];

    /**
    * The spread-layout's orientation. 
    * @property orientation
    * @type gs.Orientation
     */
    this.orientation = orientation === "vertical" ? 1 : 0;

    /**
    * The behavior component to add spread-layout specific behavior.
    * @property behavior
    * @type gs.Component_SpreadLayoutBehavior
     */
    this.behavior = new gs.Component_SpreadLayoutBehavior();
    this.behavior.orientation = this.orientation;
    this.addComponent(this.behavior);
    this.addComponent(this.animator);
  }

  return Object_SpreadLayout;

})(ui.Object_UIElement);

ui.Object_SpreadLayout = Object_SpreadLayout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsbUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7RUFVYSw2QkFBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxNQUFkLEVBQXNCLFdBQXRCO0lBQ1QsbURBQUE7SUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUFBLElBQUssQ0FBbEIsRUFBcUIsQ0FBQSxJQUFLLENBQTFCLEVBQTZCLEtBQUEsSUFBUyxDQUF0QyxFQUF5QyxNQUFBLElBQVUsQ0FBbkQ7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQyxRQUFILENBQUE7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBa0IsV0FBQSxLQUFlLFVBQWxCLEdBQWtDLENBQWxDLEdBQXlDOztBQUV4RDs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQyw4QkFBSCxDQUFBO0lBQ2hCLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixHQUF3QixJQUFDLENBQUE7SUFDekIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUF6Q1M7Ozs7R0FYaUIsRUFBRSxDQUFDOztBQXNEckMsRUFBRSxDQUFDLG1CQUFILEdBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfU3ByZWFkTGF5b3V0XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfU3ByZWFkTGF5b3V0IGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgICMjIypcbiAgICAqIEEgc3ByZWFkLWxheW91dCB3aGljaCBzcHJlYWRzIGFsbCBzdWItb2JqZWN0cyBldmVubHkgb3ZlciB0aGUgbGF5b3V0LXNwYWNlIFxuICAgICogdmVydGljYWxseSBvciBob3Jpem9udGFsbHkuXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIE9iamVjdF9TcHJlYWRMYXlvdXRcbiAgICAqIEBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjICBcbiAgICBjb25zdHJ1Y3RvcjogKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICBAZHN0UmVjdC5zZXQoeCB8fCAwLCB5IHx8IDAsIHdpZHRoIHx8IDEsIGhlaWdodCB8fCAxIClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGxheW91dCBpcyByZXNpemFibGUuXG4gICAgICAgICogQHByb3BlcnR5IHJlc2l6YWJsZVxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNpemFibGUgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QncyBhbmltYXRvci1jb21wb25lbnQgdG8gZXhlY3V0ZSBkaWZmZXJlbnQga2luZCBvZiBhbmltYXRpb25zIGxpa2UgbW92ZSwgcm90YXRlLCBldGMuIG9uIGl0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbmltYXRvclxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9BbmltYXRvclxuICAgICAgICAjIyNcbiAgICAgICAgQGFuaW1hdG9yID0gbmV3IGdzLkFuaW1hdG9yKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbGF5b3V0J3Mgc3ViLW9iamVjdHMuXG4gICAgICAgICogQHByb3BlcnR5IGNvbnRyb2xzXG4gICAgICAgICogQHR5cGUgdWkuT2JqZWN0X1VJRWxlbWVudFtdXG4gICAgICAgICMjI1xuICAgICAgICBAY29udHJvbHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBzcHJlYWQtbGF5b3V0J3Mgb3JpZW50YXRpb24uIFxuICAgICAgICAqIEBwcm9wZXJ0eSBvcmllbnRhdGlvblxuICAgICAgICAqIEB0eXBlIGdzLk9yaWVudGF0aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAb3JpZW50YXRpb24gPSBpZiBvcmllbnRhdGlvbiA9PSBcInZlcnRpY2FsXCIgdGhlbiAxIGVsc2UgMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBiZWhhdmlvciBjb21wb25lbnQgdG8gYWRkIHNwcmVhZC1sYXlvdXQgc3BlY2lmaWMgYmVoYXZpb3IuXG4gICAgICAgICogQHByb3BlcnR5IGJlaGF2aW9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29tcG9uZW50X1NwcmVhZExheW91dEJlaGF2aW9yXG4gICAgICAgICMjI1xuICAgICAgICBAYmVoYXZpb3IgPSBuZXcgZ3MuQ29tcG9uZW50X1NwcmVhZExheW91dEJlaGF2aW9yKClcbiAgICAgICAgQGJlaGF2aW9yLm9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGJlaGF2aW9yKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBhbmltYXRvcilcbiAgICAgICAgXG51aS5PYmplY3RfU3ByZWFkTGF5b3V0ID0gT2JqZWN0X1NwcmVhZExheW91dCJdfQ==
//# sourceURL=Object_SpreadLayout_123.js