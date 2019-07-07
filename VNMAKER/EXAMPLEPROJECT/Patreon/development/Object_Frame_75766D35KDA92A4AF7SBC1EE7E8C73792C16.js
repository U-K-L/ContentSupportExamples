var Object_Frame,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Frame = (function(superClass) {
  extend(Object_Frame, superClass);


  /**
  * An UI frame object to display an frame on screen useful for buttons, windows, etc.
  *
  * @module ui
  * @class Object_Frame
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_Frame(skin) {
    Object_Frame.__super__.constructor.apply(this, arguments);
    this.image = skin || GameManager.windowSkin;

    /**
    * The UI object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Frame
     */
    this.visual = new gs.Component_Frame();

    /**
    * The thickness of the frame/border in pixels. Default is 16.
    * @property frameThickness
    * @type number
     */
    this.frameThickness = 16;

    /**
    * The corner-size of the frame in pixels. Default is 16(16x16 pixel).
    * @property frameCornerSize
    * @type number
     */
    this.frameCornerSize = 16;
    this.addComponent(this.visual);
  }

  return Object_Frame;

})(ui.Object_UIElement);

ui.Object_Frame = Object_Frame;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsWUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7O0VBU2Esc0JBQUMsSUFBRDtJQUNULCtDQUFBLFNBQUE7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUEsSUFBUSxXQUFXLENBQUM7O0FBRTdCOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsZUFBSCxDQUFBOztBQUdkOzs7OztJQUtBLElBQUMsQ0FBQSxjQUFELEdBQWtCOztBQUVsQjs7Ozs7SUFLQSxJQUFDLENBQUEsZUFBRCxHQUFtQjtJQUVuQixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0VBMUJTOzs7O0dBVlUsRUFBRSxDQUFDOztBQXNDOUIsRUFBRSxDQUFDLFlBQUgsR0FBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9GcmFtZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0ZyYW1lIGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgICMjIypcbiAgICAqIEFuIFVJIGZyYW1lIG9iamVjdCB0byBkaXNwbGF5IGFuIGZyYW1lIG9uIHNjcmVlbiB1c2VmdWwgZm9yIGJ1dHRvbnMsIHdpbmRvd3MsIGV0Yy5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgT2JqZWN0X0ZyYW1lXG4gICAgKiBAZXh0ZW5kcyB1aS5PYmplY3RfVUlFbGVtZW50XG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjIyAgXG4gICAgY29uc3RydWN0b3I6IChza2luKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBAaW1hZ2UgPSBza2luIHx8IEdhbWVNYW5hZ2VyLndpbmRvd1NraW5cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgdmlzdWFsLWNvbXBvbmVudCB0byBkaXNwbGF5IHRoZSBnYW1lIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHZpc3VhbFxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9GcmFtZVxuICAgICAgICAjIyNcbiAgICAgICAgQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfRnJhbWUoKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgdGhpY2tuZXNzIG9mIHRoZSBmcmFtZS9ib3JkZXIgaW4gcGl4ZWxzLiBEZWZhdWx0IGlzIDE2LlxuICAgICAgICAqIEBwcm9wZXJ0eSBmcmFtZVRoaWNrbmVzc1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lVGhpY2tuZXNzID0gMTZcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY29ybmVyLXNpemUgb2YgdGhlIGZyYW1lIGluIHBpeGVscy4gRGVmYXVsdCBpcyAxNigxNngxNiBwaXhlbCkuXG4gICAgICAgICogQHByb3BlcnR5IGZyYW1lQ29ybmVyU2l6ZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lQ29ybmVyU2l6ZSA9IDE2XG4gICAgICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEB2aXN1YWwpXG4gICAgICAgIFxudWkuT2JqZWN0X0ZyYW1lID0gT2JqZWN0X0ZyYW1lIl19
//# sourceURL=Object_Frame_91.js