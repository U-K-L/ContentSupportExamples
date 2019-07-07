var Object_Visual,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Visual = (function(superClass) {
  extend(Object_Visual, superClass);


  /**
  * The base class for all regular visual game objects. 
  *
  * @module 
  * @class Object_Visual
  * @extends gs.Object_Base
  * @memberof vn
  * @constructor
   */

  function Object_Visual(data) {
    Object_Visual.__super__.constructor.call(this);

    /**
    * Indiciates if the game object is visible on screen.
    * @property visible
    * @type boolean
     */
    this.visible = true;

    /**
    * The object's destination rectangle on screen.
    * @property dstRect
    * @type gs.Rect
     */
    this.dstRect = new Rect(data != null ? data.x : void 0, data != null ? data.y : void 0);

    /**
    * The object's origin.
    * @property origin
    * @type gs.Point
     */
    this.origin = new gs.Point(0, 0);

    /**
    * The object's offset.
    * @property offset
    * @type gs.Point
     */
    this.offset = new gs.Point(0, 0);

    /**
    * The object's anchor-point. For example: An anchor-point with 0,0 places the object with its top-left corner
    * at its position but with an 0.5, 0.5 anchor-point the object is placed with its center. An anchor-point of 1,1
    * places the object with its lower-right corner.
    * @property anchor
    * @type gs.Point
     */
    this.anchor = new gs.Point(0.0, 0.0);

    /**
    * The position anchor point. For example: An anchor-point with 0,0 places the object with its top-left corner
    * at its position but with an 0.5, 0.5 anchor-point the object will be placed with its center. An anchor-point of 1,1
    * will place the object with its lower-right corner. It has not effect on the object's rotation/zoom anchor. For that, take
    * a look at <b>anchor</b> property.
    *
    * @property positionAnchor
    * @type gs.Point
     */
    this.positionAnchor = new gs.Point(0, 0);

    /**
    * The object's zoom-setting for x and y axis. The default value is
    * { x: 1.0, y: 1.0 }
    * @property zoom
    * @type gs.Point
     */
    this.zoom = (data != null ? data.zoom : void 0) || new gs.Point(1.0, 1.0);

    /**
    * The object's z-index controls rendering-order/image-overlapping. An object with a smaller z-index is rendered
    * before an object with a larger index. For example: To make sure a game object is always on top of the screen, it
    * should have the largest z-index of all game objects.
    * @property zIndex
    * @type number
     */
    this.zIndex = 700;

    /**
    * The object's blend mode controls how the blending of the object's visual representation is calculated.
    * @property blendMode
    * @type number
    * @default gs.BlendMode.NORMAL
     */
    this.blendMode = gs.BlendMode.NORMAL;

    /**
    * The object's viewport.
    * @property viewport
    * @type gs.Viewport
     */
    this.viewport = Graphics.viewport;

    /**
    * The object's motion-blur settings.
    * @property motionBlur
    * @type gs.MotionBlur
     */
    this.motionBlur = new gs.MotionBlur();

    /**
    * Contains different kinds of shader effects which can be activated for the object.
    * @property effects
    * @type gs.EffectCollection
     */
    this.effects = new gs.EffectCollection();

    /**
    * The object's opacity to control transparency. For example: 0 = Transparent, 255 = Opaque, 128 = Semi-Transparent.
    * @property opacity
    * @type number
     */
    this.opacity = 255;
  }


  /**
  * Restores the game object from a data-bundle.
  *
  * @method restore
  * @param {Object} data - The data-bundle.
   */

  Object_Visual.prototype.restore = function(data) {
    if (data.components) {
      this.componentsFromDataBundle(data);
    }
    Object.mixin(this, data);
    this.dstRect = gs.Rect.fromObject(data.dstRect);
    return this.motionBlur = gs.MotionBlur.fromObject(data.motionBlur);
  };

  return Object_Visual;

})(gs.Object_Base);

gs.Object_Visual = Object_Visual;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsYUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7O0VBU2EsdUJBQUMsSUFBRDtJQUNULDZDQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLElBQUEsZ0JBQUssSUFBSSxDQUFFLFVBQVgsaUJBQWMsSUFBSSxDQUFFLFVBQXBCOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsRUFBWSxDQUFaOztBQUVkOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsRUFBWSxDQUFaOztBQUVkOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxLQUFILENBQVMsR0FBVCxFQUFjLEdBQWQ7O0FBRWQ7Ozs7Ozs7OztJQVNBLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFULEVBQVksQ0FBWjs7QUFFdEI7Ozs7OztJQU1BLElBQUMsQ0FBQSxJQUFELG1CQUFRLElBQUksQ0FBRSxjQUFOLElBQWtCLElBQUEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxHQUFULEVBQWMsR0FBZDs7QUFFMUI7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUM7O0FBRTFCOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBUSxDQUFDOztBQUVyQjs7Ozs7SUFLQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLEVBQUUsQ0FBQyxVQUFILENBQUE7O0FBRWxCOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxFQUFFLENBQUMsZ0JBQUgsQ0FBQTs7QUFFZjs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXO0VBdEdGOzs7QUF3R2I7Ozs7Ozs7MEJBTUEsT0FBQSxHQUFTLFNBQUMsSUFBRDtJQUNMLElBQUcsSUFBSSxDQUFDLFVBQVI7TUFDSSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsSUFBMUIsRUFESjs7SUFHQSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsRUFBbUIsSUFBbkI7SUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBUixDQUFtQixJQUFJLENBQUMsT0FBeEI7V0FDWCxJQUFDLENBQUEsVUFBRCxHQUFjLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBZCxDQUF5QixJQUFJLENBQUMsVUFBOUI7RUFQVDs7OztHQXhIZSxFQUFFLENBQUM7O0FBaUkvQixFQUFFLENBQUMsYUFBSCxHQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X1Zpc3VhbFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X1Zpc3VhbCBleHRlbmRzIGdzLk9iamVjdF9CYXNlXG4gICAgIyMjKlxuICAgICogVGhlIGJhc2UgY2xhc3MgZm9yIGFsbCByZWd1bGFyIHZpc3VhbCBnYW1lIG9iamVjdHMuIFxuICAgICpcbiAgICAqIEBtb2R1bGUgXG4gICAgKiBAY2xhc3MgT2JqZWN0X1Zpc3VhbFxuICAgICogQGV4dGVuZHMgZ3MuT2JqZWN0X0Jhc2VcbiAgICAqIEBtZW1iZXJvZiB2blxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNpYXRlcyBpZiB0aGUgZ2FtZSBvYmplY3QgaXMgdmlzaWJsZSBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHZpc2libGVcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAdmlzaWJsZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBkZXN0aW5hdGlvbiByZWN0YW5nbGUgb24gc2NyZWVuLlxuICAgICAgICAqIEBwcm9wZXJ0eSBkc3RSZWN0XG4gICAgICAgICogQHR5cGUgZ3MuUmVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQGRzdFJlY3QgPSBuZXcgUmVjdChkYXRhPy54LCBkYXRhPy55KVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBvcmlnaW4uXG4gICAgICAgICogQHByb3BlcnR5IG9yaWdpblxuICAgICAgICAqIEB0eXBlIGdzLlBvaW50XG4gICAgICAgICMjI1xuICAgICAgICBAb3JpZ2luID0gbmV3IGdzLlBvaW50KDAsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIG9mZnNldC5cbiAgICAgICAgKiBAcHJvcGVydHkgb2Zmc2V0XG4gICAgICAgICogQHR5cGUgZ3MuUG9pbnRcbiAgICAgICAgIyMjXG4gICAgICAgIEBvZmZzZXQgPSBuZXcgZ3MuUG9pbnQoMCwgMClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3MgYW5jaG9yLXBvaW50LiBGb3IgZXhhbXBsZTogQW4gYW5jaG9yLXBvaW50IHdpdGggMCwwIHBsYWNlcyB0aGUgb2JqZWN0IHdpdGggaXRzIHRvcC1sZWZ0IGNvcm5lclxuICAgICAgICAqIGF0IGl0cyBwb3NpdGlvbiBidXQgd2l0aCBhbiAwLjUsIDAuNSBhbmNob3ItcG9pbnQgdGhlIG9iamVjdCBpcyBwbGFjZWQgd2l0aCBpdHMgY2VudGVyLiBBbiBhbmNob3ItcG9pbnQgb2YgMSwxXG4gICAgICAgICogcGxhY2VzIHRoZSBvYmplY3Qgd2l0aCBpdHMgbG93ZXItcmlnaHQgY29ybmVyLlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbmNob3JcbiAgICAgICAgKiBAdHlwZSBncy5Qb2ludFxuICAgICAgICAjIyNcbiAgICAgICAgQGFuY2hvciA9IG5ldyBncy5Qb2ludCgwLjAsIDAuMClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgcG9zaXRpb24gYW5jaG9yIHBvaW50LiBGb3IgZXhhbXBsZTogQW4gYW5jaG9yLXBvaW50IHdpdGggMCwwIHBsYWNlcyB0aGUgb2JqZWN0IHdpdGggaXRzIHRvcC1sZWZ0IGNvcm5lclxuICAgICAgICAqIGF0IGl0cyBwb3NpdGlvbiBidXQgd2l0aCBhbiAwLjUsIDAuNSBhbmNob3ItcG9pbnQgdGhlIG9iamVjdCB3aWxsIGJlIHBsYWNlZCB3aXRoIGl0cyBjZW50ZXIuIEFuIGFuY2hvci1wb2ludCBvZiAxLDFcbiAgICAgICAgKiB3aWxsIHBsYWNlIHRoZSBvYmplY3Qgd2l0aCBpdHMgbG93ZXItcmlnaHQgY29ybmVyLiBJdCBoYXMgbm90IGVmZmVjdCBvbiB0aGUgb2JqZWN0J3Mgcm90YXRpb24vem9vbSBhbmNob3IuIEZvciB0aGF0LCB0YWtlXG4gICAgICAgICogYSBsb29rIGF0IDxiPmFuY2hvcjwvYj4gcHJvcGVydHkuXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgcG9zaXRpb25BbmNob3JcbiAgICAgICAgKiBAdHlwZSBncy5Qb2ludFxuICAgICAgICAjIyNcbiAgICAgICAgQHBvc2l0aW9uQW5jaG9yID0gbmV3IGdzLlBvaW50KDAsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHpvb20tc2V0dGluZyBmb3IgeCBhbmQgeSBheGlzLiBUaGUgZGVmYXVsdCB2YWx1ZSBpc1xuICAgICAgICAqIHsgeDogMS4wLCB5OiAxLjAgfVxuICAgICAgICAqIEBwcm9wZXJ0eSB6b29tXG4gICAgICAgICogQHR5cGUgZ3MuUG9pbnRcbiAgICAgICAgIyMjXG4gICAgICAgIEB6b29tID0gZGF0YT8uem9vbSB8fCBuZXcgZ3MuUG9pbnQoMS4wLCAxLjApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHotaW5kZXggY29udHJvbHMgcmVuZGVyaW5nLW9yZGVyL2ltYWdlLW92ZXJsYXBwaW5nLiBBbiBvYmplY3Qgd2l0aCBhIHNtYWxsZXIgei1pbmRleCBpcyByZW5kZXJlZFxuICAgICAgICAqIGJlZm9yZSBhbiBvYmplY3Qgd2l0aCBhIGxhcmdlciBpbmRleC4gRm9yIGV4YW1wbGU6IFRvIG1ha2Ugc3VyZSBhIGdhbWUgb2JqZWN0IGlzIGFsd2F5cyBvbiB0b3Agb2YgdGhlIHNjcmVlbiwgaXRcbiAgICAgICAgKiBzaG91bGQgaGF2ZSB0aGUgbGFyZ2VzdCB6LWluZGV4IG9mIGFsbCBnYW1lIG9iamVjdHMuXG4gICAgICAgICogQHByb3BlcnR5IHpJbmRleFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHpJbmRleCA9IDcwMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBibGVuZCBtb2RlIGNvbnRyb2xzIGhvdyB0aGUgYmxlbmRpbmcgb2YgdGhlIG9iamVjdCdzIHZpc3VhbCByZXByZXNlbnRhdGlvbiBpcyBjYWxjdWxhdGVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBibGVuZE1vZGVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAZGVmYXVsdCBncy5CbGVuZE1vZGUuTk9STUFMXG4gICAgICAgICMjI1xuICAgICAgICBAYmxlbmRNb2RlID0gZ3MuQmxlbmRNb2RlLk5PUk1BTFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyB2aWV3cG9ydC5cbiAgICAgICAgKiBAcHJvcGVydHkgdmlld3BvcnRcbiAgICAgICAgKiBAdHlwZSBncy5WaWV3cG9ydFxuICAgICAgICAjIyNcbiAgICAgICAgQHZpZXdwb3J0ID0gR3JhcGhpY3Mudmlld3BvcnRcbiAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBtb3Rpb24tYmx1ciBzZXR0aW5ncy5cbiAgICAgICAgKiBAcHJvcGVydHkgbW90aW9uQmx1clxuICAgICAgICAqIEB0eXBlIGdzLk1vdGlvbkJsdXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBtb3Rpb25CbHVyID0gbmV3IGdzLk1vdGlvbkJsdXIoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIENvbnRhaW5zIGRpZmZlcmVudCBraW5kcyBvZiBzaGFkZXIgZWZmZWN0cyB3aGljaCBjYW4gYmUgYWN0aXZhdGVkIGZvciB0aGUgb2JqZWN0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBlZmZlY3RzXG4gICAgICAgICogQHR5cGUgZ3MuRWZmZWN0Q29sbGVjdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQGVmZmVjdHMgPSBuZXcgZ3MuRWZmZWN0Q29sbGVjdGlvbigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIG9wYWNpdHkgdG8gY29udHJvbCB0cmFuc3BhcmVuY3kuIEZvciBleGFtcGxlOiAwID0gVHJhbnNwYXJlbnQsIDI1NSA9IE9wYXF1ZSwgMTI4ID0gU2VtaS1UcmFuc3BhcmVudC5cbiAgICAgICAgKiBAcHJvcGVydHkgb3BhY2l0eVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQG9wYWNpdHkgPSAyNTVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgdGhlIGdhbWUgb2JqZWN0IGZyb20gYSBkYXRhLWJ1bmRsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlLlxuICAgICMjIyAgICBcbiAgICByZXN0b3JlOiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YS5jb21wb25lbnRzXG4gICAgICAgICAgICBAY29tcG9uZW50c0Zyb21EYXRhQnVuZGxlKGRhdGEpXG4gICAgICAgICAgICBcbiAgICAgICAgT2JqZWN0Lm1peGluKHRoaXMsIGRhdGEpXG4gICAgICAgIFxuICAgICAgICBAZHN0UmVjdCA9IGdzLlJlY3QuZnJvbU9iamVjdChkYXRhLmRzdFJlY3QpXG4gICAgICAgIEBtb3Rpb25CbHVyID0gZ3MuTW90aW9uQmx1ci5mcm9tT2JqZWN0KGRhdGEubW90aW9uQmx1cilcbiAgICAgICAgXG5ncy5PYmplY3RfVmlzdWFsID0gT2JqZWN0X1Zpc3VhbCJdfQ==
//# sourceURL=Object_Visual_28.js