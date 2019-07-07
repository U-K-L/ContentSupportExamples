var Object_Hotspot,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Hotspot = (function(superClass) {
  extend(Object_Hotspot, superClass);

  Object_Hotspot.objectCodecBlackList = ["parent"];


  /**
  * A hotspot object to define an area on the screen which can respond
  * to user-actions like mouse/touch actions. A hotspot can have multiple
  * images for different states like hovered, selected, etc.
  *
  * @module gs
  * @class Object_Hotspot
  * @extends gs.Object_Visual
  * @memberof gs
  * @constructor
   */

  function Object_Hotspot() {
    Object_Hotspot.__super__.constructor.apply(this, arguments);

    /**
    * The object's source rectangle. It controls which part of the object's image is used
    * for visual presentation.
    * @property srcRect
    * @type gs.Rect
     */
    this.srcRect = new Rect();

    /**
    * The object's mask to execute masking-effects on it.
    * @property mask
    * @type gs.Mask
     */
    this.mask = new gs.Mask();

    /**
    * Indicates if the object's visual presentation should be mirrored horizontally.
    * @property mirror
    * @type boolean
     */
    this.mirror = false;

    /**
    * The domain the object belongs to.
    * @property domain
    * @type string
     */
    this.domain = "com.degica.vnm.default";

    /**
    * The object's image used for visual presentation.
    * @property image
    * @type string
     */
    this.image = "";

    /**
    * The rotation-angle of the picture in degrees. The rotation center depends on the
    * anchor-point.
    * @property angle
    * @type number
     */
    this.angle = 0;

    /**
    * The color tone of the object used for the visual presentation.
    * @property tone
    * @type gs.Tone
     */
    this.tone = new Tone(0, 0, 0, 0);

    /**
    * The color of the object used for the visual presentation.
    * @property color
    * @type gs.Color
     */
    this.color = new Color(255, 255, 255, 0);

    /**
    * Contains different kinds of effects which can be activated for the object.
    * @property effects
    * @type Object
     */
    this.effects = new gs.EffectCollection();

    /**
    * Indicates if the hotspot is selectable by mouse/touch.
    * @property selectable
    * @type boolean
     */
    this.selectable = true;

    /**
    * Indicates if the hotspot is enabled. A disabled hotspot will not fire any events/actions.
    * @property enabled.
    * @type boolean
     */
    this.enabled = true;

    /**
    * The object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite
     */
    this.visual = new gs.Component_Sprite();

    /**
    * The object's image-handling.
    * @property imageHandling
    * @type gs.ImageHandling
     */
    this.imageHandling = 0;

    /**
    * A behavior-component to hotspot-specific behavior to the object.
    * @property behavior
    * @type gs.Component_HotspotBehavior
     */
    this.behavior = new gs.Component_HotspotBehavior();
    this.behavior.imageHandling = this.imageHandling;

    /**
    * The hotspot's target. The target it optional but if set the hotspot follows
    * the target. For example: A hotspot could be follow moving picture.
    * @property target
    * @type gs.Object_Visual
     */
    this.target = null;

    /**
    * The names of the images for the different states of the hotspot. At least one image
    * needs to be set. The other ones are optional and used for the following:<br>
    *
    * - 0 = Base (Required)
    * - 1 = Hovered
    * - 2 = Unselected
    * - 3 = Selected
    * - 4 = Selected Hovered
    * @property images
    * @type string[]
     */
    this.images = [];

    /**
    * An event-emitter to emit events.
    * @property events
    * @type gs.Component_EventEmitter
     */
    this.events = new gs.EventEmitter();
    this.addComponent(this.events);
    this.addComponent(this.behavior);
    this.addComponent(this.visual);
  }

  return Object_Hotspot;

})(gs.Object_Visual);

gs.Object_Hotspot = Object_Hotspot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsY0FBQTtFQUFBOzs7QUFBTTs7O0VBQ0YsY0FBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsUUFBRDs7O0FBRXhCOzs7Ozs7Ozs7Ozs7RUFXYSx3QkFBQTtJQUNULGlEQUFBLFNBQUE7O0FBRUE7Ozs7OztJQU1BLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxJQUFBLENBQUE7O0FBRWY7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLEVBQUUsQ0FBQyxJQUFILENBQUE7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLElBQUEsQ0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsQ0FBckI7O0FBRWI7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLEVBQUUsQ0FBQyxnQkFBSCxDQUFBOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxVQUFELEdBQWM7O0FBRWQ7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQUE7O0FBRWQ7Ozs7O0lBS0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7O0FBRWpCOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLHlCQUFILENBQUE7SUFDaEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxhQUFWLEdBQTBCLElBQUMsQ0FBQTs7QUFFM0I7Ozs7OztJQU1BLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7Ozs7Ozs7OztJQVlBLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxZQUFILENBQUE7SUFFZCxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE1BQWY7RUF2SVM7Ozs7R0FkWSxFQUFFLENBQUM7O0FBd0poQyxFQUFFLENBQUMsY0FBSCxHQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X0hvdHNwb3RcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE9iamVjdF9Ib3RzcG90IGV4dGVuZHMgZ3MuT2JqZWN0X1Zpc3VhbFxuICAgIEBvYmplY3RDb2RlY0JsYWNrTGlzdCA9IFtcInBhcmVudFwiXVxuICAgIFxuICAgICMjIypcbiAgICAqIEEgaG90c3BvdCBvYmplY3QgdG8gZGVmaW5lIGFuIGFyZWEgb24gdGhlIHNjcmVlbiB3aGljaCBjYW4gcmVzcG9uZFxuICAgICogdG8gdXNlci1hY3Rpb25zIGxpa2UgbW91c2UvdG91Y2ggYWN0aW9ucy4gQSBob3RzcG90IGNhbiBoYXZlIG11bHRpcGxlXG4gICAgKiBpbWFnZXMgZm9yIGRpZmZlcmVudCBzdGF0ZXMgbGlrZSBob3ZlcmVkLCBzZWxlY3RlZCwgZXRjLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBPYmplY3RfSG90c3BvdFxuICAgICogQGV4dGVuZHMgZ3MuT2JqZWN0X1Zpc3VhbFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3Mgc291cmNlIHJlY3RhbmdsZS4gSXQgY29udHJvbHMgd2hpY2ggcGFydCBvZiB0aGUgb2JqZWN0J3MgaW1hZ2UgaXMgdXNlZFxuICAgICAgICAqIGZvciB2aXN1YWwgcHJlc2VudGF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzcmNSZWN0XG4gICAgICAgICogQHR5cGUgZ3MuUmVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQHNyY1JlY3QgPSBuZXcgUmVjdCgpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIG1hc2sgdG8gZXhlY3V0ZSBtYXNraW5nLWVmZmVjdHMgb24gaXQuXG4gICAgICAgICogQHByb3BlcnR5IG1hc2tcbiAgICAgICAgKiBAdHlwZSBncy5NYXNrXG4gICAgICAgICMjI1xuICAgICAgICBAbWFzayA9IG5ldyBncy5NYXNrKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG9iamVjdCdzIHZpc3VhbCBwcmVzZW50YXRpb24gc2hvdWxkIGJlIG1pcnJvcmVkIGhvcml6b250YWxseS5cbiAgICAgICAgKiBAcHJvcGVydHkgbWlycm9yXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQG1pcnJvciA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGRvbWFpbiB0aGUgb2JqZWN0IGJlbG9uZ3MgdG8uXG4gICAgICAgICogQHByb3BlcnR5IGRvbWFpblxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGRvbWFpbiA9IFwiY29tLmRlZ2ljYS52bm0uZGVmYXVsdFwiXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGltYWdlIHVzZWQgZm9yIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGltYWdlXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAaW1hZ2UgPSBcIlwiXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHJvdGF0aW9uLWFuZ2xlIG9mIHRoZSBwaWN0dXJlIGluIGRlZ3JlZXMuIFRoZSByb3RhdGlvbiBjZW50ZXIgZGVwZW5kcyBvbiB0aGVcbiAgICAgICAgKiBhbmNob3ItcG9pbnQuXG4gICAgICAgICogQHByb3BlcnR5IGFuZ2xlXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAYW5nbGUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNvbG9yIHRvbmUgb2YgdGhlIG9iamVjdCB1c2VkIGZvciB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgdG9uZVxuICAgICAgICAqIEB0eXBlIGdzLlRvbmVcbiAgICAgICAgIyMjXG4gICAgICAgIEB0b25lID0gbmV3IFRvbmUoMCwgMCwgMCwgMClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY29sb3Igb2YgdGhlIG9iamVjdCB1c2VkIGZvciB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgY29sb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db2xvclxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbG9yID0gbmV3IENvbG9yKDI1NSwgMjU1LCAyNTUsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ29udGFpbnMgZGlmZmVyZW50IGtpbmRzIG9mIGVmZmVjdHMgd2hpY2ggY2FuIGJlIGFjdGl2YXRlZCBmb3IgdGhlIG9iamVjdC5cbiAgICAgICAgKiBAcHJvcGVydHkgZWZmZWN0c1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQGVmZmVjdHMgPSBuZXcgZ3MuRWZmZWN0Q29sbGVjdGlvbigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBob3RzcG90IGlzIHNlbGVjdGFibGUgYnkgbW91c2UvdG91Y2guXG4gICAgICAgICogQHByb3BlcnR5IHNlbGVjdGFibGVcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAc2VsZWN0YWJsZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgaG90c3BvdCBpcyBlbmFibGVkLiBBIGRpc2FibGVkIGhvdHNwb3Qgd2lsbCBub3QgZmlyZSBhbnkgZXZlbnRzL2FjdGlvbnMuXG4gICAgICAgICogQHByb3BlcnR5IGVuYWJsZWQuXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQGVuYWJsZWQgPSB5ZXNcblxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHZpc3VhbC1jb21wb25lbnQgdG8gZGlzcGxheSB0aGUgZ2FtZSBvYmplY3Qgb24gc2NyZWVuLlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aXN1YWxcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfU3ByaXRlXG4gICAgICAgICMjI1xuICAgICAgICBAdmlzdWFsID0gbmV3IGdzLkNvbXBvbmVudF9TcHJpdGUoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBpbWFnZS1oYW5kbGluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VIYW5kbGluZ1xuICAgICAgICAqIEB0eXBlIGdzLkltYWdlSGFuZGxpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZUhhbmRsaW5nID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEEgYmVoYXZpb3ItY29tcG9uZW50IHRvIGhvdHNwb3Qtc3BlY2lmaWMgYmVoYXZpb3IgdG8gdGhlIG9iamVjdC5cbiAgICAgICAgKiBAcHJvcGVydHkgYmVoYXZpb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfSG90c3BvdEJlaGF2aW9yXG4gICAgICAgICMjI1xuICAgICAgICBAYmVoYXZpb3IgPSBuZXcgZ3MuQ29tcG9uZW50X0hvdHNwb3RCZWhhdmlvcigpXG4gICAgICAgIEBiZWhhdmlvci5pbWFnZUhhbmRsaW5nID0gQGltYWdlSGFuZGxpbmdcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgaG90c3BvdCdzIHRhcmdldC4gVGhlIHRhcmdldCBpdCBvcHRpb25hbCBidXQgaWYgc2V0IHRoZSBob3RzcG90IGZvbGxvd3NcbiAgICAgICAgKiB0aGUgdGFyZ2V0LiBGb3IgZXhhbXBsZTogQSBob3RzcG90IGNvdWxkIGJlIGZvbGxvdyBtb3ZpbmcgcGljdHVyZS5cbiAgICAgICAgKiBAcHJvcGVydHkgdGFyZ2V0XG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X1Zpc3VhbFxuICAgICAgICAjIyNcbiAgICAgICAgQHRhcmdldCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZXMgb2YgdGhlIGltYWdlcyBmb3IgdGhlIGRpZmZlcmVudCBzdGF0ZXMgb2YgdGhlIGhvdHNwb3QuIEF0IGxlYXN0IG9uZSBpbWFnZVxuICAgICAgICAqIG5lZWRzIHRvIGJlIHNldC4gVGhlIG90aGVyIG9uZXMgYXJlIG9wdGlvbmFsIGFuZCB1c2VkIGZvciB0aGUgZm9sbG93aW5nOjxicj5cbiAgICAgICAgKlxuICAgICAgICAqIC0gMCA9IEJhc2UgKFJlcXVpcmVkKVxuICAgICAgICAqIC0gMSA9IEhvdmVyZWRcbiAgICAgICAgKiAtIDIgPSBVbnNlbGVjdGVkXG4gICAgICAgICogLSAzID0gU2VsZWN0ZWRcbiAgICAgICAgKiAtIDQgPSBTZWxlY3RlZCBIb3ZlcmVkXG4gICAgICAgICogQHByb3BlcnR5IGltYWdlc1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgICMjI1xuICAgICAgICBAaW1hZ2VzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBldmVudC1lbWl0dGVyIHRvIGVtaXQgZXZlbnRzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBldmVudHNcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfRXZlbnRFbWl0dGVyXG4gICAgICAgICMjI1xuICAgICAgICBAZXZlbnRzID0gbmV3IGdzLkV2ZW50RW1pdHRlcigpO1xuICBcbiAgICAgICAgQGFkZENvbXBvbmVudChAZXZlbnRzKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBiZWhhdmlvcilcbiAgICAgICAgQGFkZENvbXBvbmVudChAdmlzdWFsKVxuICAgICAgICBcbiAgICAgICAgXG5ncy5PYmplY3RfSG90c3BvdCA9IE9iamVjdF9Ib3RzcG90Il19
//# sourceURL=Object_Hotspot_78.js