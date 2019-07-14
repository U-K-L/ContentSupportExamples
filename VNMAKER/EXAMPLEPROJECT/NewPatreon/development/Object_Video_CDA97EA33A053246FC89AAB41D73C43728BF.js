var Object_Video,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Video = (function(superClass) {
  extend(Object_Video, superClass);


  /**
  * A game object used for custom texts in a scene.
  *
  * @module gs
  * @class Object_Video
  * @extends gs.Object_Visual
  * @memberof gs
  * @constructor
   */

  function Object_Video(data) {
    Object_Video.__super__.constructor.apply(this, arguments);

    /**
    * The UI object's source rectangle on screen.
    * @property srcRect
    * @type gs.Rect
     */
    this.srcRect = null;

    /**
    * The UI object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite
     */
    this.visual = new gs.Component_Sprite();

    /**
    * An event-emitter to emit events.
    * @property events
    * @type gs.Component_EventEmitter
     */
    this.events = new gs.EventEmitter();
    this.addComponent(this.events);
    this.addComponent(this.visual);
  }

  return Object_Video;

})(ui.Object_UIElement);

ui.Object_Video = Object_Video;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsWUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7O0VBU2Esc0JBQUMsSUFBRDtJQUNULCtDQUFBLFNBQUE7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQUE7O0FBRWQ7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxZQUFILENBQUE7SUFFZCxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtFQXpCUzs7OztHQVZVLEVBQUUsQ0FBQzs7QUFzQzlCLEVBQUUsQ0FBQyxZQUFILEdBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfVmlkZW9cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE9iamVjdF9WaWRlbyBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAjIyMqXG4gICAgKiBBIGdhbWUgb2JqZWN0IHVzZWQgZm9yIGN1c3RvbSB0ZXh0cyBpbiBhIHNjZW5lLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBPYmplY3RfVmlkZW9cbiAgICAqIEBleHRlbmRzIGdzLk9iamVjdF9WaXN1YWxcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QncyBzb3VyY2UgcmVjdGFuZ2xlIG9uIHNjcmVlbi5cbiAgICAgICAgKiBAcHJvcGVydHkgc3JjUmVjdFxuICAgICAgICAqIEB0eXBlIGdzLlJlY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBzcmNSZWN0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QncyB2aXN1YWwtY29tcG9uZW50IHRvIGRpc3BsYXkgdGhlIGdhbWUgb2JqZWN0IG9uIHNjcmVlbi5cbiAgICAgICAgKiBAcHJvcGVydHkgdmlzdWFsXG4gICAgICAgICogQHR5cGUgZ3MuQ29tcG9uZW50X1Nwcml0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfU3ByaXRlKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBldmVudC1lbWl0dGVyIHRvIGVtaXQgZXZlbnRzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBldmVudHNcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfRXZlbnRFbWl0dGVyXG4gICAgICAgICMjI1xuICAgICAgICBAZXZlbnRzID0gbmV3IGdzLkV2ZW50RW1pdHRlcigpXG4gICAgICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEBldmVudHMpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQHZpc3VhbClcbiAgICAgXG4gICAgICAgIFxudWkuT2JqZWN0X1ZpZGVvID0gT2JqZWN0X1ZpZGVvIl19
//# sourceURL=Object_Video_130.js