var Object_IntervalTimer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_IntervalTimer = (function(superClass) {
  extend(Object_IntervalTimer, superClass);

  Object_IntervalTimer.objectCodecBlackList = ["parent"];


  /**
  * A timer object. A timer can be used as a regular timer or as a stop-watch.
  *
  * @module gs
  * @class Object_IntervalTimer
  * @extends gs.Object_Base
  * @memberof gs
  * @constructor
   */

  function Object_IntervalTimer() {
    Object_IntervalTimer.__super__.constructor.call(this);

    /**
    * A behavior-component to add timer-specific behavior to the object.
    * @property behavior
    * @type gs.Component_IntervalTimer
     */
    this.behavior = new gs.Component_IntervalTimer();

    /**
    * An event-emitter to emit events.
    * @property events
    * @type gs.Component_EventEmitter
     */
    this.events = new gs.EventEmitter();
    this.addComponent(this.events);
    this.addComponent(this.behavior);
  }

  return Object_IntervalTimer;

})(gs.Object_Base);

gs.Object_IntervalTimer = Object_IntervalTimer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsb0JBQUE7RUFBQTs7O0FBQU07OztFQUNGLG9CQUFDLENBQUEsb0JBQUQsR0FBd0IsQ0FBQyxRQUFEOzs7QUFFeEI7Ozs7Ozs7Ozs7RUFTYSw4QkFBQTtJQUNULG9EQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLHVCQUFILENBQUE7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsWUFBSCxDQUFBO0lBRWQsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUFsQlM7Ozs7R0Faa0IsRUFBRSxDQUFDOztBQWdDdEMsRUFBRSxDQUFDLG9CQUFILEdBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfSW50ZXJ2YWxUaW1lclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0ludGVydmFsVGltZXIgZXh0ZW5kcyBncy5PYmplY3RfQmFzZVxuICAgIEBvYmplY3RDb2RlY0JsYWNrTGlzdCA9IFtcInBhcmVudFwiXVxuICAgIFxuICAgICMjIypcbiAgICAqIEEgdGltZXIgb2JqZWN0LiBBIHRpbWVyIGNhbiBiZSB1c2VkIGFzIGEgcmVndWxhciB0aW1lciBvciBhcyBhIHN0b3Atd2F0Y2guXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9JbnRlcnZhbFRpbWVyXG4gICAgKiBAZXh0ZW5kcyBncy5PYmplY3RfQmFzZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEEgYmVoYXZpb3ItY29tcG9uZW50IHRvIGFkZCB0aW1lci1zcGVjaWZpYyBiZWhhdmlvciB0byB0aGUgb2JqZWN0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBiZWhhdmlvclxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9JbnRlcnZhbFRpbWVyXG4gICAgICAgICMjI1xuICAgICAgICBAYmVoYXZpb3IgPSBuZXcgZ3MuQ29tcG9uZW50X0ludGVydmFsVGltZXIoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGV2ZW50LWVtaXR0ZXIgdG8gZW1pdCBldmVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9FdmVudEVtaXR0ZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBldmVudHMgPSBuZXcgZ3MuRXZlbnRFbWl0dGVyKClcbiAgICAgICAgXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGV2ZW50cylcbiAgICAgICAgQGFkZENvbXBvbmVudChAYmVoYXZpb3IpXG4gICAgICAgIFxuZ3MuT2JqZWN0X0ludGVydmFsVGltZXIgPSBPYmplY3RfSW50ZXJ2YWxUaW1lciJdfQ==
//# sourceURL=Object_IntervalTimer_165.js