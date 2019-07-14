var Object_Text,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Text = (function(superClass) {
  extend(Object_Text, superClass);

  Object_Text.accessors("text", {
    set: function(v) {
      if (v !== this.text_) {
        this.text_ = v;
        return this.needsUpdate = true;
      }
    },
    get: function() {
      return this.text_;
    }
  });

  Object_Text.accessors("visible", {
    set: function(v) {
      if (v !== this.visible_) {
        this.visible_ = v;
        this.needsUpdate = true;
        return this.fullRefresh();
      }
    },
    get: function() {
      return this.visible_ && (!this.parent || this.parent.visible);
    }
  });


  /**
  * A UI object to display text on screen.
  *
  * @module ui
  * @class Object_Text
  * @extends gs.Object_Text
  * @memberof ui
  * @constructor
   */

  function Object_Text() {
    Object_Text.__super__.constructor.call(this);

    /**
    * Indicates if that UI object will break the binding-chain. If <b>true</b> the UI object
    * will not change any binding-targets for the current binding-execution period.
    * @property breakBindingChain
    * @type boolean
     */
    this.breakBindingChain = false;
    this.dstRect = new ui.UIElementRectangle(this);
    this.wordWrap = true;
    this.controlsByStyle = new Array(ui.UIManager.stylesById.length);
    this.styles = [];
    this.activeStyles = [];
    this.data = new Array(10);

    /**
    * The UI object's padding. The default is { left: 0, top: 0, right: 0, bottom: 0 }.
    * @property padding
    * @type ui.Space
     */
    this.padding = new ui.Space(0, 0, 0, 0);

    /**
    * The UI object's margin. The margin defines an extra space around the UI object. 
    * The default is { left: 0, top: 0, right: 0, bottom: 0 }.
    * @property margin
    * @type Object
     */
    this.margin = new ui.Space(0, 0, 0, 0);

    /**
    * An event-emitter to emit events.
    * @property events
    * @type gs.Component_EventEmitter
     */
    this.events = new gs.EventEmitter();
    this.addComponent(this.events);
  }

  return Object_Text;

})(gs.Object_Text);

ui.Object_Text = Object_Text;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsV0FBQTtFQUFBOzs7QUFBTTs7O0VBTUYsV0FBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO01BQ0QsSUFBRyxDQUFBLEtBQUssSUFBQyxDQUFBLEtBQVQ7UUFDSSxJQUFDLENBQUEsS0FBRCxHQUFTO2VBQ1QsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUZuQjs7SUFEQyxDQUFMO0lBS0EsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUxMO0dBREo7O0VBUUEsV0FBQyxDQUFBLFNBQUQsQ0FBVyxTQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO01BQ0QsSUFBRyxDQUFBLEtBQUssSUFBQyxDQUFBLFFBQVQ7UUFDSSxJQUFDLENBQUEsUUFBRCxHQUFZO1FBQ1osSUFBQyxDQUFBLFdBQUQsR0FBZTtlQUNmLElBQUMsQ0FBQSxXQUFELENBQUEsRUFISjs7SUFEQyxDQUFMO0lBTUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUEsUUFBRCxJQUFjLENBQUMsQ0FBQyxJQUFDLENBQUEsTUFBRixJQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBckI7SUFBakIsQ0FOTDtHQURKOzs7QUFTQTs7Ozs7Ozs7OztFQVNhLHFCQUFBO0lBQ1QsMkNBQUE7O0FBRUE7Ozs7OztJQU1BLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsRUFBRSxDQUFDLGtCQUFILENBQXNCLElBQXRCO0lBQ2YsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsS0FBQSxDQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQTlCO0lBQ3ZCLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsS0FBQSxDQUFNLEVBQU47O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLENBQWxCOztBQUVmOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEI7O0FBRWQ7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxZQUFILENBQUE7SUFDZCxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0VBdENTOzs7O0dBaENTLEVBQUUsQ0FBQzs7QUF3RTdCLEVBQUUsQ0FBQyxXQUFILEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfVGV4dFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X1RleHQgZXh0ZW5kcyBncy5PYmplY3RfVGV4dFxuICAgICNcbiAgICAjIFRoZSB0ZXh0IHRvIGRpc3BsYXkuXG4gICAgIyBAcHJvcGVydHkgdGV4dFxuICAgICMgQHR5cGUgc3RyaW5nXG4gICAgI1xuICAgIEBhY2Nlc3NvcnMgXCJ0ZXh0XCIsIFxuICAgICAgICBzZXQ6ICh2KSAtPiBcbiAgICAgICAgICAgIGlmIHYgIT0gQHRleHRfXG4gICAgICAgICAgICAgICAgQHRleHRfID0gdlxuICAgICAgICAgICAgICAgIEBuZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICAgICAgXG4gICAgICAgIGdldDogLT4gQHRleHRfXG4gICAgICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJ2aXNpYmxlXCIsIFxuICAgICAgICBzZXQ6ICh2KSAtPiBcbiAgICAgICAgICAgIGlmIHYgIT0gQHZpc2libGVfXG4gICAgICAgICAgICAgICAgQHZpc2libGVfID0gdlxuICAgICAgICAgICAgICAgIEBuZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICAgICAgICAgIEBmdWxsUmVmcmVzaCgpXG4gICAgICAgICAgICBcbiAgICAgICAgZ2V0OiAtPiBAdmlzaWJsZV8gYW5kICghQHBhcmVudCBvciBAcGFyZW50LnZpc2libGUpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEEgVUkgb2JqZWN0IHRvIGRpc3BsYXkgdGV4dCBvbiBzY3JlZW4uXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIE9iamVjdF9UZXh0XG4gICAgKiBAZXh0ZW5kcyBncy5PYmplY3RfVGV4dFxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyMgXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhhdCBVSSBvYmplY3Qgd2lsbCBicmVhayB0aGUgYmluZGluZy1jaGFpbi4gSWYgPGI+dHJ1ZTwvYj4gdGhlIFVJIG9iamVjdFxuICAgICAgICAqIHdpbGwgbm90IGNoYW5nZSBhbnkgYmluZGluZy10YXJnZXRzIGZvciB0aGUgY3VycmVudCBiaW5kaW5nLWV4ZWN1dGlvbiBwZXJpb2QuXG4gICAgICAgICogQHByb3BlcnR5IGJyZWFrQmluZGluZ0NoYWluXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQGJyZWFrQmluZGluZ0NoYWluID0gbm9cbiAgICAgICAgQGRzdFJlY3QgPSBuZXcgdWkuVUlFbGVtZW50UmVjdGFuZ2xlKHRoaXMpXG4gICAgICAgIEB3b3JkV3JhcCA9IHllc1xuICAgICAgICBAY29udHJvbHNCeVN0eWxlID0gbmV3IEFycmF5KHVpLlVJTWFuYWdlci5zdHlsZXNCeUlkLmxlbmd0aClcbiAgICAgICAgQHN0eWxlcyA9IFtdXG4gICAgICAgIEBhY3RpdmVTdHlsZXMgPSBbXVxuICAgICAgICBAZGF0YSA9IG5ldyBBcnJheSgxMClcblxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIFVJIG9iamVjdCdzIHBhZGRpbmcuIFRoZSBkZWZhdWx0IGlzIHsgbGVmdDogMCwgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwIH0uXG4gICAgICAgICogQHByb3BlcnR5IHBhZGRpbmdcbiAgICAgICAgKiBAdHlwZSB1aS5TcGFjZVxuICAgICAgICAjIyNcbiAgICAgICAgQHBhZGRpbmcgPSBuZXcgdWkuU3BhY2UoMCwgMCwgMCwgMClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgbWFyZ2luLiBUaGUgbWFyZ2luIGRlZmluZXMgYW4gZXh0cmEgc3BhY2UgYXJvdW5kIHRoZSBVSSBvYmplY3QuIFxuICAgICAgICAqIFRoZSBkZWZhdWx0IGlzIHsgbGVmdDogMCwgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwIH0uXG4gICAgICAgICogQHByb3BlcnR5IG1hcmdpblxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQG1hcmdpbiA9IG5ldyB1aS5TcGFjZSgwLCAwLCAwLCAwKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGV2ZW50LWVtaXR0ZXIgdG8gZW1pdCBldmVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9FdmVudEVtaXR0ZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBldmVudHMgPSBuZXcgZ3MuRXZlbnRFbWl0dGVyKClcbiAgICAgICAgQGFkZENvbXBvbmVudChAZXZlbnRzKVxuICAgICAgICBcbnVpLk9iamVjdF9UZXh0ID0gT2JqZWN0X1RleHQiXX0=
//# sourceURL=Object_Text_101.js