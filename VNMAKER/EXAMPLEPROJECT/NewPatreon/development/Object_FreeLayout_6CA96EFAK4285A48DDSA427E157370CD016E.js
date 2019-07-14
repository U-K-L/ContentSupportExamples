var Object_FreeLayout,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_FreeLayout = (function(superClass) {
  extend(Object_FreeLayout, superClass);

  Object_FreeLayout.accessors("zIndex", {
    set: function(v) {
      return this.zIndex_ = v;
    },
    get: function() {
      return (this.zIndex_ || 0) + (!this.parent ? 0 : this.parent.zIndex || 0);
    }
  });


  /**
  * A free-layout which layouts all sub-objects at their specified positions. 
  * So that kind of layout allows each sub-object to be freely positioned.
  *
  * @module ui
  * @class Object_FreeLayout
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_FreeLayout(x, y, width, height) {
    Object_FreeLayout.__super__.constructor.call(this);
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
    this.animator = new gs.Animator();

    /**
    * The layout's sub-objects.
    * @property controls
    * @type ui.Object_UIElement[]
     */
    this.controls = [];

    /**
    * The behavior component to add free-layout specific behavior.
    * @property behavior
    * @type gs.Component_FreeLayoutBehavior
     */
    this.behavior = new gs.Component_FreeLayoutBehavior();

    /**
    * Indicates if the layouts resizes to fit its content.
    * @property sizeToFit
    * @type boolean
     */
    this.sizeToFit = false;
    this.addComponent(this.behavior);
    this.addComponent(this.animator);
  }

  return Object_FreeLayout;

})(ui.Object_UIElement);

ui.Object_FreeLayout = Object_FreeLayout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsaUJBQUE7RUFBQTs7O0FBQU07OztFQUNGLGlCQUFDLENBQUEsU0FBRCxDQUFXLFFBQVgsRUFDSTtJQUFBLEdBQUEsRUFBSyxTQUFDLENBQUQ7YUFBTyxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQWxCLENBQUw7SUFDQSxHQUFBLEVBQUssU0FBQTthQUFHLENBQUMsSUFBQyxDQUFBLE9BQUQsSUFBWSxDQUFiLENBQUEsR0FBa0IsQ0FBSSxDQUFDLElBQUMsQ0FBQSxNQUFMLEdBQWlCLENBQWpCLEdBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixJQUFrQixDQUEzQztJQUFyQixDQURMO0dBREo7OztBQUlBOzs7Ozs7Ozs7OztFQVVhLDJCQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sS0FBUCxFQUFjLE1BQWQ7SUFDVCxpREFBQTtJQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQUEsSUFBSyxDQUFsQixFQUFxQixDQUFBLElBQUssQ0FBMUIsRUFBNkIsS0FBQSxJQUFTLENBQXRDLEVBQXlDLE1BQUEsSUFBVSxDQUFuRDs7QUFFQTs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLFFBQUgsQ0FBQTs7QUFFaEI7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQyw0QkFBSCxDQUFBOztBQUVoQjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhO0lBRWIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUF6Q1M7Ozs7R0FmZSxFQUFFLENBQUM7O0FBMkRuQyxFQUFFLENBQUMsaUJBQUgsR0FBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9GcmVlTGF5b3V0XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfRnJlZUxheW91dCBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICBAYWNjZXNzb3JzIFwiekluZGV4XCIsIFxuICAgICAgICBzZXQ6ICh2KSAtPiBAekluZGV4XyA9IHYsIFxuICAgICAgICBnZXQ6IC0+IChAekluZGV4XyB8fCAwKSArIChpZiAhQHBhcmVudCB0aGVuIDAgZWxzZSBAcGFyZW50LnpJbmRleCB8fCAwKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBIGZyZWUtbGF5b3V0IHdoaWNoIGxheW91dHMgYWxsIHN1Yi1vYmplY3RzIGF0IHRoZWlyIHNwZWNpZmllZCBwb3NpdGlvbnMuIFxuICAgICogU28gdGhhdCBraW5kIG9mIGxheW91dCBhbGxvd3MgZWFjaCBzdWItb2JqZWN0IHRvIGJlIGZyZWVseSBwb3NpdGlvbmVkLlxuICAgICpcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBPYmplY3RfRnJlZUxheW91dFxuICAgICogQGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyMgIFxuICAgIGNvbnN0cnVjdG9yOiAoeCwgeSwgd2lkdGgsIGhlaWdodCkgLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgQGRzdFJlY3Quc2V0KHggfHwgMCwgeSB8fCAwLCB3aWR0aCB8fCAxLCBoZWlnaHQgfHwgMSApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBsYXlvdXQgaXMgcmVzaXphYmxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXNpemFibGVcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAcmVzaXphYmxlID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgYW5pbWF0b3ItY29tcG9uZW50IHRvIGV4ZWN1dGUgZGlmZmVyZW50IGtpbmQgb2YgYW5pbWF0aW9ucyBsaWtlIG1vdmUsIHJvdGF0ZSwgZXRjLiBvbiBpdC5cbiAgICAgICAgKiBAcHJvcGVydHkgYW5pbWF0b3JcbiAgICAgICAgKiBAdHlwZSB2bi5Db21wb25lbnRfQW5pbWF0b3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBhbmltYXRvciA9IG5ldyBncy5BbmltYXRvcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGxheW91dCdzIHN1Yi1vYmplY3RzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjb250cm9sc1xuICAgICAgICAqIEB0eXBlIHVpLk9iamVjdF9VSUVsZW1lbnRbXVxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbnRyb2xzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgYmVoYXZpb3IgY29tcG9uZW50IHRvIGFkZCBmcmVlLWxheW91dCBzcGVjaWZpYyBiZWhhdmlvci5cbiAgICAgICAgKiBAcHJvcGVydHkgYmVoYXZpb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfRnJlZUxheW91dEJlaGF2aW9yXG4gICAgICAgICMjI1xuICAgICAgICBAYmVoYXZpb3IgPSBuZXcgZ3MuQ29tcG9uZW50X0ZyZWVMYXlvdXRCZWhhdmlvcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBsYXlvdXRzIHJlc2l6ZXMgdG8gZml0IGl0cyBjb250ZW50LlxuICAgICAgICAqIEBwcm9wZXJ0eSBzaXplVG9GaXRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAc2l6ZVRvRml0ID0gbm9cbiAgICAgICAgXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGJlaGF2aW9yKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBhbmltYXRvcilcbiAgICAgICAgXG4gICAgICAgIFxudWkuT2JqZWN0X0ZyZWVMYXlvdXQgPSBPYmplY3RfRnJlZUxheW91dCJdfQ==
//# sourceURL=Object_FreeLayout_78.js