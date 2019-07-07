var Object_Picture,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Picture = (function(superClass) {
  extend(Object_Picture, superClass);

  Object_Picture.objectCodecBlackList = ["parent"];


  /**
  * A game object used for pictures in a scene.
  *
  * @module gs
  * @class Object_Picture
  * @extends gs.Object_Visual
  * @memberof gs
  * @constructor
   */

  function Object_Picture(parent, data, type) {
    Object_Picture.__super__.constructor.call(this, data);

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
    * The domain the object belongs to.
    * @property domain
    * @type string
     */
    this.domain = "com.degica.vnm.default";

    /**
    
    * Indicates if the object's visual presentation should be mirrored horizontally.
    * @property mirror
    * @type boolean
     */
    this.mirror = false;

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
    * The object's animator-component to execute different kind of animations like move, rotate, etc. on it.
    * @property animator
    * @type vn.Component_Animator
     */
    this.animator = new gs.Component_Animator();

    /**
    * The object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite|gs.Component_TilingSprite|gs.Component_Frame|gs.Component_ThreePartImage|gs.Component_Quad
     */
    switch (type) {
      case 0:
        this.visual = new gs.Component_Sprite();
        break;
      case 1:
        this.visual = new gs.Component_TilingSprite();
        break;
      case 2:
        this.visual = new gs.Component_Frame();
        break;
      case 3:
        this.visual = new gs.Component_ThreePartImage();
        break;
      case 4:
        this.visual = new gs.Component_Quad();
        break;
      default:
        this.visual = new gs.Component_Sprite();
    }
    this.frameThickness = 16;
    this.frameCornerSize = 16;
    this.firstPartSize = 7;
    this.middlePartSize = 1;
    this.lastPartSize = 7;
    this.addComponent(this.visual);
    this.addComponent(this.animator);
    this.componentsFromDataBundle(data);
  }


  /**
  * Restores the game object from a data-bundle.
  *
  * @method restore
  * @param {Object} data - The data-bundle.
   */

  Object_Picture.prototype.restore = function(data) {
    Object_Picture.__super__.restore.call(this, data);
    this.srcRect = gs.Rect.fromObject(data.srcRect);
    this.mask = gs.Mask.fromObject(data.mask);
    return this.motionBlur = gs.MotionBlur.fromObject(data.motionBlur);
  };


  /**
  * Serializes the object into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} The data-bundle.
   */

  Object_Picture.prototype.toDataBundle = function() {
    var components, result;
    components = this.componentsToDataBundle(gs.Component_Animation);
    result = {
      dstRect: this.dstRect,
      srcRect: this.srcRect,
      opacity: this.opacity,
      origin: this.origin,
      zIndex: this.zIndex,
      mask: this.mask.toDataBundle(),
      motionBlur: this.motionBlur,
      zoom: this.zoom,
      angle: this.angle,
      anchor: this.anchor,
      offset: this.offset,
      mirror: this.mirror,
      image: this.image,
      components: components
    };
    return result;
  };

  return Object_Picture;

})(gs.Object_Visual);

gs.Object_Picture = Object_Picture;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsY0FBQTtFQUFBOzs7QUFBTTs7O0VBQ0YsY0FBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsUUFBRDs7O0FBRXhCOzs7Ozs7Ozs7O0VBU2Esd0JBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxJQUFmO0lBQ1QsZ0RBQU0sSUFBTjs7QUFFQTs7Ozs7O0lBTUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLElBQUEsQ0FBQTs7QUFFZjs7Ozs7SUFLQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsRUFBRSxDQUFDLElBQUgsQ0FBQTs7QUFFWjs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBR1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLElBQUEsQ0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsQ0FBckI7O0FBRWI7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLEVBQUUsQ0FBQyxnQkFBSCxDQUFBOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLGtCQUFILENBQUE7O0FBRWhCOzs7OztBQUtBLFlBQU8sSUFBUDtBQUFBLFdBQ1MsQ0FEVDtRQUNnQixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQUE7QUFBckI7QUFEVCxXQUVTLENBRlQ7UUFFZ0IsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxzQkFBSCxDQUFBO0FBQXJCO0FBRlQsV0FHUyxDQUhUO1FBR2dCLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsZUFBSCxDQUFBO0FBQXJCO0FBSFQsV0FJUyxDQUpUO1FBSWdCLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsd0JBQUgsQ0FBQTtBQUFyQjtBQUpULFdBS1MsQ0FMVDtRQUtnQixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLGNBQUgsQ0FBQTtBQUFyQjtBQUxUO1FBTVMsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxnQkFBSCxDQUFBO0FBTnZCO0lBU0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7SUFDQSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsSUFBMUI7RUFuR1M7OztBQXFHYjs7Ozs7OzsyQkFNQSxPQUFBLEdBQVMsU0FBQyxJQUFEO0lBQ0wsNENBQU0sSUFBTjtJQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFSLENBQW1CLElBQUksQ0FBQyxPQUF4QjtJQUNYLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFSLENBQW1CLElBQUksQ0FBQyxJQUF4QjtXQUNSLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFkLENBQXlCLElBQUksQ0FBQyxVQUE5QjtFQUxUOzs7QUFPVDs7Ozs7OzsyQkFNQSxZQUFBLEdBQWMsU0FBQTtBQUNWLFFBQUE7SUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLHNCQUFELENBQXdCLEVBQUUsQ0FBQyxtQkFBM0I7SUFFYixNQUFBLEdBQVM7TUFDTCxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BREw7TUFFTCxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BRkw7TUFHTCxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BSEw7TUFJTCxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BSko7TUFLTCxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BTEo7TUFNTCxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFOLENBQUEsQ0FORDtNQU9MLFVBQUEsRUFBWSxJQUFDLENBQUEsVUFQUjtNQVFMLElBQUEsRUFBTSxJQUFDLENBQUEsSUFSRjtNQVNMLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FUSDtNQVVMLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFWSjtNQVdMLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFYSjtNQVlMLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFaSjtNQWFMLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FiSDtNQWNMLFVBQUEsRUFBWSxVQWRQOztBQWlCVCxXQUFPO0VBcEJHOzs7O0dBcElXLEVBQUUsQ0FBQzs7QUEwSmhDLEVBQUUsQ0FBQyxjQUFILEdBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfUGljdHVyZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X1BpY3R1cmUgZXh0ZW5kcyBncy5PYmplY3RfVmlzdWFsXG4gICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wicGFyZW50XCJdXG4gICBcbiAgICAjIyMqXG4gICAgKiBBIGdhbWUgb2JqZWN0IHVzZWQgZm9yIHBpY3R1cmVzIGluIGEgc2NlbmUuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9QaWN0dXJlXG4gICAgKiBAZXh0ZW5kcyBncy5PYmplY3RfVmlzdWFsXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAocGFyZW50LCBkYXRhLCB0eXBlKSAtPlxuICAgICAgICBzdXBlcihkYXRhKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBzb3VyY2UgcmVjdGFuZ2xlLiBJdCBjb250cm9scyB3aGljaCBwYXJ0IG9mIHRoZSBvYmplY3QncyBpbWFnZSBpcyB1c2VkXG4gICAgICAgICogZm9yIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IHNyY1JlY3RcbiAgICAgICAgKiBAdHlwZSBncy5SZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAc3JjUmVjdCA9IG5ldyBSZWN0KClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3MgbWFzayB0byBleGVjdXRlIG1hc2tpbmctZWZmZWN0cyBvbiBpdC5cbiAgICAgICAgKiBAcHJvcGVydHkgbWFza1xuICAgICAgICAqIEB0eXBlIGdzLk1hc2tcbiAgICAgICAgIyMjXG4gICAgICAgIEBtYXNrID0gbmV3IGdzLk1hc2soKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBkb21haW4gdGhlIG9iamVjdCBiZWxvbmdzIHRvLlxuICAgICAgICAqIEBwcm9wZXJ0eSBkb21haW5cbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBkb21haW4gPSBcImNvbS5kZWdpY2Eudm5tLmRlZmF1bHRcIlxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICBcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG9iamVjdCdzIHZpc3VhbCBwcmVzZW50YXRpb24gc2hvdWxkIGJlIG1pcnJvcmVkIGhvcml6b250YWxseS5cbiAgICAgICAgKiBAcHJvcGVydHkgbWlycm9yXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQG1pcnJvciA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGltYWdlIHVzZWQgZm9yIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGltYWdlXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAaW1hZ2UgPSBcIlwiXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHJvdGF0aW9uLWFuZ2xlIG9mIHRoZSBwaWN0dXJlIGluIGRlZ3JlZXMuIFRoZSByb3RhdGlvbiBjZW50ZXIgZGVwZW5kcyBvbiB0aGVcbiAgICAgICAgKiBhbmNob3ItcG9pbnQuXG4gICAgICAgICogQHByb3BlcnR5IGFuZ2xlXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAYW5nbGUgPSAwXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjb2xvciB0b25lIG9mIHRoZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IHRvbmVcbiAgICAgICAgKiBAdHlwZSBncy5Ub25lXG4gICAgICAgICMjI1xuICAgICAgICBAdG9uZSA9IG5ldyBUb25lKDAsIDAsIDAsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNvbG9yIG9mIHRoZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29sb3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb2xvciA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIENvbnRhaW5zIGRpZmZlcmVudCBraW5kcyBvZiBlZmZlY3RzIHdoaWNoIGNhbiBiZSBhY3RpdmF0ZWQgZm9yIHRoZSBvYmplY3QuXG4gICAgICAgICogQHByb3BlcnR5IGVmZmVjdHNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBlZmZlY3RzID0gbmV3IGdzLkVmZmVjdENvbGxlY3Rpb24oKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyBhbmltYXRvci1jb21wb25lbnQgdG8gZXhlY3V0ZSBkaWZmZXJlbnQga2luZCBvZiBhbmltYXRpb25zIGxpa2UgbW92ZSwgcm90YXRlLCBldGMuIG9uIGl0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbmltYXRvclxuICAgICAgICAqIEB0eXBlIHZuLkNvbXBvbmVudF9BbmltYXRvclxuICAgICAgICAjIyNcbiAgICAgICAgQGFuaW1hdG9yID0gbmV3IGdzLkNvbXBvbmVudF9BbmltYXRvcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHZpc3VhbC1jb21wb25lbnQgdG8gZGlzcGxheSB0aGUgZ2FtZSBvYmplY3Qgb24gc2NyZWVuLlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aXN1YWxcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfU3ByaXRlfGdzLkNvbXBvbmVudF9UaWxpbmdTcHJpdGV8Z3MuQ29tcG9uZW50X0ZyYW1lfGdzLkNvbXBvbmVudF9UaHJlZVBhcnRJbWFnZXxncy5Db21wb25lbnRfUXVhZFxuICAgICAgICAjIyNcbiAgICAgICAgc3dpdGNoIHR5cGVcbiAgICAgICAgICAgIHdoZW4gMCB0aGVuIEB2aXN1YWwgPSBuZXcgZ3MuQ29tcG9uZW50X1Nwcml0ZSgpXG4gICAgICAgICAgICB3aGVuIDEgdGhlbiBAdmlzdWFsID0gbmV3IGdzLkNvbXBvbmVudF9UaWxpbmdTcHJpdGUoKVxuICAgICAgICAgICAgd2hlbiAyIHRoZW4gQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfRnJhbWUoKVxuICAgICAgICAgICAgd2hlbiAzIHRoZW4gQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfVGhyZWVQYXJ0SW1hZ2UoKVxuICAgICAgICAgICAgd2hlbiA0IHRoZW4gQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfUXVhZCgpXG4gICAgICAgICAgICBlbHNlIEB2aXN1YWwgPSBuZXcgZ3MuQ29tcG9uZW50X1Nwcml0ZSgpXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgQGZyYW1lVGhpY2tuZXNzID0gMTZcbiAgICAgICAgQGZyYW1lQ29ybmVyU2l6ZSA9IDE2XG4gICAgICAgIEBmaXJzdFBhcnRTaXplID0gN1xuICAgICAgICBAbWlkZGxlUGFydFNpemUgPSAxXG4gICAgICAgIEBsYXN0UGFydFNpemUgPSA3XG4gICAgICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEB2aXN1YWwpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGFuaW1hdG9yKVxuICAgICAgICBAY29tcG9uZW50c0Zyb21EYXRhQnVuZGxlKGRhdGEpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIHRoZSBnYW1lIG9iamVjdCBmcm9tIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZS5cbiAgICAjIyMgICAgXG4gICAgcmVzdG9yZTogKGRhdGEpIC0+XG4gICAgICAgIHN1cGVyKGRhdGEpXG4gICAgICAgIFxuICAgICAgICBAc3JjUmVjdCA9IGdzLlJlY3QuZnJvbU9iamVjdChkYXRhLnNyY1JlY3QpXG4gICAgICAgIEBtYXNrID0gZ3MuTWFzay5mcm9tT2JqZWN0KGRhdGEubWFzaylcbiAgICAgICAgQG1vdGlvbkJsdXIgPSBncy5Nb3Rpb25CbHVyLmZyb21PYmplY3QoZGF0YS5tb3Rpb25CbHVyKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSBvYmplY3QgaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkYXRhLWJ1bmRsZS5cbiAgICAjIyMgICAgXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBjb21wb25lbnRzID0gQGNvbXBvbmVudHNUb0RhdGFCdW5kbGUoZ3MuQ29tcG9uZW50X0FuaW1hdGlvbilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZHN0UmVjdDogQGRzdFJlY3QsXG4gICAgICAgICAgICBzcmNSZWN0OiBAc3JjUmVjdCxcbiAgICAgICAgICAgIG9wYWNpdHk6IEBvcGFjaXR5LFxuICAgICAgICAgICAgb3JpZ2luOiBAb3JpZ2luLFxuICAgICAgICAgICAgekluZGV4OiBAekluZGV4LFxuICAgICAgICAgICAgbWFzazogQG1hc2sudG9EYXRhQnVuZGxlKCksXG4gICAgICAgICAgICBtb3Rpb25CbHVyOiBAbW90aW9uQmx1cixcbiAgICAgICAgICAgIHpvb206IEB6b29tLFxuICAgICAgICAgICAgYW5nbGU6IEBhbmdsZSxcbiAgICAgICAgICAgIGFuY2hvcjogQGFuY2hvcixcbiAgICAgICAgICAgIG9mZnNldDogQG9mZnNldCxcbiAgICAgICAgICAgIG1pcnJvcjogQG1pcnJvcixcbiAgICAgICAgICAgIGltYWdlOiBAaW1hZ2UsXG4gICAgICAgICAgICBjb21wb25lbnRzOiBjb21wb25lbnRzXG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICBcbmdzLk9iamVjdF9QaWN0dXJlID0gT2JqZWN0X1BpY3R1cmUiXX0=
//# sourceURL=Object_Picture_47.js