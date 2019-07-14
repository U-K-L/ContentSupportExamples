var Object_StackLayout,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_StackLayout = (function(superClass) {
  extend(Object_StackLayout, superClass);

  Object_StackLayout.accessors("zIndex", {
    set: function(v) {
      return this.zIndex_ = v;
    },
    get: function() {
      return (this.zIndex_ || 0) + (!this.parent ? 0 : this.parent.zIndex || 0);
    }
  });

  Object_StackLayout.accessors("scrollOffsetY", {
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
  * A stack-layout which layouts all it sub-objects
  * like a stack vertically or horizontally.
  * 
  * @module ui
  * @class Object_StackLayout
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_StackLayout(x, y, width, height, orientation) {
    Object_StackLayout.__super__.constructor.call(this);
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
    this.animator = new gs.Component_Animator();

    /**
    * The layout's sub-objects.
    * @property controls
    * @type ui.Object_UIElement[]
     */
    this.controls = [];

    /**
    * The stack-layout's orientation. 
    * @property orientation
    * @type gs.Orientation
     */
    this.orientation = orientation === "vertical" ? 1 : 0;

    /**
    * The stack-layout's scroll-offset on y-axis. 
    * @property scrollOffsetY
    * @type number
     */
    this.scrollOffsetY = 0;

    /**
    * Indicates if the layouts resizes to fit its content.
    * @property sizeToFit
    * @type boolean
     */
    this.sizeToFit = false;

    /**
    * The behavior component to add stack-layout specific behavior.
    * @property behavior
    * @type gs.Component_StackLayoutBehavior
     */
    this.behavior = new gs.Component_StackLayoutBehavior();
    this.behavior.orientation = this.orientation;
    this.addComponent(this.behavior);
    this.addComponent(this.animator);
  }

  return Object_StackLayout;

})(ui.Object_UIElement);

ui.Object_StackLayout = Object_StackLayout;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsa0JBQUE7RUFBQTs7O0FBQU07OztFQUNGLGtCQUFDLENBQUEsU0FBRCxDQUFXLFFBQVgsRUFDSTtJQUFBLEdBQUEsRUFBSyxTQUFDLENBQUQ7YUFBTyxJQUFDLENBQUEsT0FBRCxHQUFXO0lBQWxCLENBQUw7SUFDQSxHQUFBLEVBQUssU0FBQTthQUFHLENBQUMsSUFBQyxDQUFBLE9BQUQsSUFBWSxDQUFiLENBQUEsR0FBa0IsQ0FBSSxDQUFDLElBQUMsQ0FBQSxNQUFMLEdBQWlCLENBQWpCLEdBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixJQUFrQixDQUEzQztJQUFyQixDQURMO0dBREo7O0VBSUEsa0JBQUMsQ0FBQSxTQUFELENBQVcsZUFBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxjQUFUO1FBQ0ksSUFBQyxDQUFBLGNBQUQsR0FBa0I7ZUFDbEIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsS0FGdkI7O0lBREMsQ0FBTDtJQUlBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FKTDtHQURKOzs7QUFPQTs7Ozs7Ozs7Ozs7RUFVYSw0QkFBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsRUFBYyxNQUFkLEVBQXNCLFdBQXRCO0lBQ1Qsa0RBQUE7SUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUFBLElBQUssQ0FBbEIsRUFBcUIsQ0FBQSxJQUFLLENBQTFCLEVBQTZCLEtBQUEsSUFBUyxDQUF0QyxFQUF5QyxNQUFBLElBQVUsQ0FBbkQ7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQyxrQkFBSCxDQUFBOztBQUVoQjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxXQUFELEdBQWtCLFdBQUEsS0FBZSxVQUFsQixHQUFrQyxDQUFsQyxHQUF5Qzs7QUFFeEQ7Ozs7O0lBS0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7O0FBRWpCOzs7OztJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWE7O0FBRWI7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxFQUFFLENBQUMsNkJBQUgsQ0FBQTtJQUNoQixJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsR0FBd0IsSUFBQyxDQUFBO0lBQ3pCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7SUFDQSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxRQUFmO0VBdkRTOzs7O0dBdEJnQixFQUFFLENBQUM7O0FBK0VwQyxFQUFFLENBQUMsa0JBQUgsR0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9TdGFja0xheW91dFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X1N0YWNrTGF5b3V0IGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgIEBhY2Nlc3NvcnMgXCJ6SW5kZXhcIiwgXG4gICAgICAgIHNldDogKHYpIC0+IEB6SW5kZXhfID0gdiwgXG4gICAgICAgIGdldDogLT4gKEB6SW5kZXhfIHx8IDApICsgKGlmICFAcGFyZW50IHRoZW4gMCBlbHNlIEBwYXJlbnQuekluZGV4IHx8IDApXG4gICAgICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJzY3JvbGxPZmZzZXRZXCIsXG4gICAgICAgIHNldDogKHYpIC0+IFxuICAgICAgICAgICAgaWYgdiAhPSBAc2Nyb2xsT2Zmc2V0WV9cbiAgICAgICAgICAgICAgICBAc2Nyb2xsT2Zmc2V0WV8gPSB2XG4gICAgICAgICAgICAgICAgQG5lZWRzRnVsbFVwZGF0ZSA9IHllc1xuICAgICAgICBnZXQ6IC0+IEBzY3JvbGxPZmZzZXRZX1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBIHN0YWNrLWxheW91dCB3aGljaCBsYXlvdXRzIGFsbCBpdCBzdWItb2JqZWN0c1xuICAgICogbGlrZSBhIHN0YWNrIHZlcnRpY2FsbHkgb3IgaG9yaXpvbnRhbGx5LlxuICAgICogXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgT2JqZWN0X1N0YWNrTGF5b3V0XG4gICAgKiBAZXh0ZW5kcyB1aS5PYmplY3RfVUlFbGVtZW50XG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjIyAgXG4gICAgY29uc3RydWN0b3I6ICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikgLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgQGRzdFJlY3Quc2V0KHggfHwgMCwgeSB8fCAwLCB3aWR0aCB8fCAxLCBoZWlnaHQgfHwgMSApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBsYXlvdXQgaXMgcmVzaXphYmxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXNpemFibGVcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAcmVzaXphYmxlID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgYW5pbWF0b3ItY29tcG9uZW50IHRvIGV4ZWN1dGUgZGlmZmVyZW50IGtpbmQgb2YgYW5pbWF0aW9ucyBsaWtlIG1vdmUsIHJvdGF0ZSwgZXRjLiBvbiBpdC5cbiAgICAgICAgKiBAcHJvcGVydHkgYW5pbWF0b3JcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfQW5pbWF0b3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBhbmltYXRvciA9IG5ldyBncy5Db21wb25lbnRfQW5pbWF0b3IoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsYXlvdXQncyBzdWItb2JqZWN0cy5cbiAgICAgICAgKiBAcHJvcGVydHkgY29udHJvbHNcbiAgICAgICAgKiBAdHlwZSB1aS5PYmplY3RfVUlFbGVtZW50W11cbiAgICAgICAgIyMjXG4gICAgICAgIEBjb250cm9scyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHN0YWNrLWxheW91dCdzIG9yaWVudGF0aW9uLiBcbiAgICAgICAgKiBAcHJvcGVydHkgb3JpZW50YXRpb25cbiAgICAgICAgKiBAdHlwZSBncy5PcmllbnRhdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQG9yaWVudGF0aW9uID0gaWYgb3JpZW50YXRpb24gPT0gXCJ2ZXJ0aWNhbFwiIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgc3RhY2stbGF5b3V0J3Mgc2Nyb2xsLW9mZnNldCBvbiB5LWF4aXMuIFxuICAgICAgICAqIEBwcm9wZXJ0eSBzY3JvbGxPZmZzZXRZXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAc2Nyb2xsT2Zmc2V0WSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGxheW91dHMgcmVzaXplcyB0byBmaXQgaXRzIGNvbnRlbnQuXG4gICAgICAgICogQHByb3BlcnR5IHNpemVUb0ZpdFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEBzaXplVG9GaXQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBiZWhhdmlvciBjb21wb25lbnQgdG8gYWRkIHN0YWNrLWxheW91dCBzcGVjaWZpYyBiZWhhdmlvci5cbiAgICAgICAgKiBAcHJvcGVydHkgYmVoYXZpb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfU3RhY2tMYXlvdXRCZWhhdmlvclxuICAgICAgICAjIyNcbiAgICAgICAgQGJlaGF2aW9yID0gbmV3IGdzLkNvbXBvbmVudF9TdGFja0xheW91dEJlaGF2aW9yKClcbiAgICAgICAgQGJlaGF2aW9yLm9yaWVudGF0aW9uID0gQG9yaWVudGF0aW9uXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGJlaGF2aW9yKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBhbmltYXRvcilcbiAgICAgICAgXG51aS5PYmplY3RfU3RhY2tMYXlvdXQgPSBPYmplY3RfU3RhY2tMYXlvdXQiXX0=
//# sourceURL=Object_StackLayout_111.js