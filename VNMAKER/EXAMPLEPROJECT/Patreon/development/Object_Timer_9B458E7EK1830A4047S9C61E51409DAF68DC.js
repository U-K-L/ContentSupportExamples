var Object_Timer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Timer = (function(superClass) {
  extend(Object_Timer, superClass);

  Object_Timer.objectCodecBlackList = ["parent"];


  /**
  * A timer object. A timer can be used as a regular timer or as a stop-watch.
  *
  * @module gs
  * @class Object_Timer
  * @extends gs.Object_Base
  * @memberof gs
  * @constructor
   */

  function Object_Timer(data) {
    Object_Timer.__super__.constructor.call(this);

    /**
    * The current seconds.
    * @property seconds
    * @type number
     */
    this.seconds = 0;

    /**
    * The current minutes.
    * @property seconds
    * @type number
     */
    this.minutes = 0;

    /**
    * Indicates if the timer runs like a stop-watch.
    * @property stopWatch
    * @type boolean
     */
    this.stopWatch = false;

    /**
    * A behavior-component to add timer-specific behavior to the object.
    * @property behavior
    * @type gs.Component_Timer
     */
    this.behavior = null;

    /**
    * An event-emitter to emit events.
    * @property events
    * @type gs.Component_EventEmitter
     */
    this.events = new gs.EventEmitter();
    this.addComponent(this.events);
    if (data != null) {
      this.componentsFromDataBundle(data);
    } else {
      this.behavior = new gs.Component_Timer();
      this.addComponent(this.behavior);
    }
  }


  /**
  * Serializes the object into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} The data-bundle.
   */

  Object_Timer.prototype.toDataBundle = function() {
    var components, result;
    components = this.componentsToDataBundle(gs.Component_Timer);
    result = {
      stopWatch: this.stopWatch,
      minutes: this.minutes,
      seconds: this.seconds,
      components: components
    };
    return result;
  };

  Object_Timer.prototype.restore = function(dataBundle) {};

  return Object_Timer;

})(gs.Object_Base);

gs.Object_Timer = Object_Timer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsWUFBQTtFQUFBOzs7QUFBTTs7O0VBQ0YsWUFBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsUUFBRDs7O0FBRXhCOzs7Ozs7Ozs7O0VBU2Esc0JBQUMsSUFBRDtJQUNULDRDQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxZQUFILENBQUE7SUFFZCxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0lBRUEsSUFBRyxZQUFIO01BQ0ksSUFBQyxDQUFBLHdCQUFELENBQTBCLElBQTFCLEVBREo7S0FBQSxNQUFBO01BR0ksSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxFQUFFLENBQUMsZUFBSCxDQUFBO01BQ2hCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWYsRUFKSjs7RUF4Q1M7OztBQThDYjs7Ozs7Ozt5QkFNQSxZQUFBLEdBQWMsU0FBQTtBQUNWLFFBQUE7SUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLHNCQUFELENBQXdCLEVBQUUsQ0FBQyxlQUEzQjtJQUViLE1BQUEsR0FBUztNQUNMLFNBQUEsRUFBVyxJQUFDLENBQUEsU0FEUDtNQUVMLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FGTDtNQUdMLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FITDtNQUlMLFVBQUEsRUFBWSxVQUpQOztBQU9ULFdBQU87RUFWRzs7eUJBWWQsT0FBQSxHQUFTLFNBQUMsVUFBRCxHQUFBOzs7O0dBNUVjLEVBQUUsQ0FBQzs7QUFpRjlCLEVBQUUsQ0FBQyxZQUFILEdBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfVGltZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE9iamVjdF9UaW1lciBleHRlbmRzIGdzLk9iamVjdF9CYXNlXG4gICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wicGFyZW50XCJdXG4gICAgXG4gICAgIyMjKlxuICAgICogQSB0aW1lciBvYmplY3QuIEEgdGltZXIgY2FuIGJlIHVzZWQgYXMgYSByZWd1bGFyIHRpbWVyIG9yIGFzIGEgc3RvcC13YXRjaC5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgT2JqZWN0X1RpbWVyXG4gICAgKiBAZXh0ZW5kcyBncy5PYmplY3RfQmFzZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCBzZWNvbmRzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzZWNvbmRzXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAc2Vjb25kcyA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCBtaW51dGVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzZWNvbmRzXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAbWludXRlcyA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIHRpbWVyIHJ1bnMgbGlrZSBhIHN0b3Atd2F0Y2guXG4gICAgICAgICogQHByb3BlcnR5IHN0b3BXYXRjaFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdG9wV2F0Y2ggPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEEgYmVoYXZpb3ItY29tcG9uZW50IHRvIGFkZCB0aW1lci1zcGVjaWZpYyBiZWhhdmlvciB0byB0aGUgb2JqZWN0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBiZWhhdmlvclxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9UaW1lclxuICAgICAgICAjIyNcbiAgICAgICAgQGJlaGF2aW9yID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGV2ZW50LWVtaXR0ZXIgdG8gZW1pdCBldmVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGV2ZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9FdmVudEVtaXR0ZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBldmVudHMgPSBuZXcgZ3MuRXZlbnRFbWl0dGVyKClcbiAgICAgICAgXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGV2ZW50cylcbiAgICAgICAgXG4gICAgICAgIGlmIGRhdGE/XG4gICAgICAgICAgICBAY29tcG9uZW50c0Zyb21EYXRhQnVuZGxlKGRhdGEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBiZWhhdmlvciA9IG5ldyBncy5Db21wb25lbnRfVGltZXIoKVxuICAgICAgICAgICAgQGFkZENvbXBvbmVudChAYmVoYXZpb3IpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIG9iamVjdCBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGRhdGEtYnVuZGxlLlxuICAgICMjIyAgICBcbiAgICB0b0RhdGFCdW5kbGU6IC0+XG4gICAgICAgIGNvbXBvbmVudHMgPSBAY29tcG9uZW50c1RvRGF0YUJ1bmRsZShncy5Db21wb25lbnRfVGltZXIpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIHN0b3BXYXRjaDogQHN0b3BXYXRjaCxcbiAgICAgICAgICAgIG1pbnV0ZXM6IEBtaW51dGVzLFxuICAgICAgICAgICAgc2Vjb25kczogQHNlY29uZHMsXG4gICAgICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICBcbiAgICByZXN0b3JlOiAoZGF0YUJ1bmRsZSkgLT5cbiAgICAgICAgXG4gICAgICAgIFxuICAgIFxuICAgICAgICBcbmdzLk9iamVjdF9UaW1lciA9IE9iamVjdF9UaW1lciJdfQ==
//# sourceURL=Object_Timer_157.js