var Object_Image,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Image = (function(superClass) {
  extend(Object_Image, superClass);


  /**
  * An UI image object to display an image on screen.
  *
  * @module ui
  * @class Object_Image
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_Image(imageName, imageHandling) {
    Object_Image.__super__.constructor.apply(this, arguments);

    /**
    * The UI object's source rectangle on screen.
    * @property srcRect
    * @type gs.Rect
     */
    this.srcRect = null;

    /**
    * The UI object's rotation-angle in degrees. The rotation center depends on the
    * anchor-point.
    * @property angle
    * @type number
     */
    this.angle = 0;

    /**
    * The UI object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite
     */
    this.visual = new gs.Component_Sprite();

    /**
    * The UI object's bitmap used for visual presentation.
    * @property bitmap
    * @type gs.Bitmap
     */
    if (imageName && imageName[0] === "$") {
      this.bitmap = ResourceManager.getBitmap(imageName);
    } else {
      this.bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + imageName);
    }
    if (this.bitmap != null) {
      if (imageHandling === 1) {
        this.srcRect = new Rect(0, this.bitmap.height / 2, this.bitmap.width, this.bitmap.height / 2);
      } else {
        this.srcRect = new Rect(0, 0, this.bitmap.width || 1, this.bitmap.height || 1);
      }
      this.dstRect.set(0, 0, this.srcRect.width || 1, this.srcRect.height || 1);
    } else {
      this.srcRect = new Rect(0, 0, 1, 1);
      this.dstRect.set(0, 0, 1, 1);
    }
    this.addComponent(this.visual);
  }

  return Object_Image;

})(ui.Object_UIElement);

ui.Object_Image = Object_Image;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsWUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7O0VBU2Esc0JBQUMsU0FBRCxFQUFZLGFBQVo7SUFDVCwrQ0FBQSxTQUFBOztBQUdBOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxnQkFBSCxDQUFBOztBQUVkOzs7OztJQUtBLElBQUcsU0FBQSxJQUFhLFNBQVUsQ0FBQSxDQUFBLENBQVYsS0FBZ0IsR0FBaEM7TUFDSSxJQUFDLENBQUEsTUFBRCxHQUFVLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixTQUExQixFQURkO0tBQUEsTUFBQTtNQUdJLElBQUMsQ0FBQSxNQUFELEdBQVUsZUFBZSxDQUFDLFNBQWhCLENBQTBCLG9CQUFBLEdBQXFCLFNBQS9DLEVBSGQ7O0lBS0EsSUFBRyxtQkFBSDtNQUNJLElBQUcsYUFBQSxLQUFpQixDQUFwQjtRQUNJLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxJQUFBLENBQUssQ0FBTCxFQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixDQUF6QixFQUE0QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQXBDLEVBQTJDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixDQUE1RCxFQURuQjtPQUFBLE1BQUE7UUFHSSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsSUFBQSxDQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLElBQWlCLENBQTVCLEVBQStCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixJQUFrQixDQUFqRCxFQUhuQjs7TUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxJQUFrQixDQUFyQyxFQUF3QyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsSUFBbUIsQ0FBM0QsRUFMSjtLQUFBLE1BQUE7TUFPSSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsSUFBQSxDQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQ7TUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBUko7O0lBVUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtFQTlDUzs7OztHQVZVLEVBQUUsQ0FBQzs7QUEwRDlCLEVBQUUsQ0FBQyxZQUFILEdBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfSW1hZ2VcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE9iamVjdF9JbWFnZSBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICAjIyMqXG4gICAgKiBBbiBVSSBpbWFnZSBvYmplY3QgdG8gZGlzcGxheSBhbiBpbWFnZSBvbiBzY3JlZW4uXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIE9iamVjdF9JbWFnZVxuICAgICogQGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyMgIFxuICAgIGNvbnN0cnVjdG9yOiAoaW1hZ2VOYW1lLCBpbWFnZUhhbmRsaW5nKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3Mgc291cmNlIHJlY3RhbmdsZSBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHNyY1JlY3RcbiAgICAgICAgKiBAdHlwZSBncy5SZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAc3JjUmVjdCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3Mgcm90YXRpb24tYW5nbGUgaW4gZGVncmVlcy4gVGhlIHJvdGF0aW9uIGNlbnRlciBkZXBlbmRzIG9uIHRoZVxuICAgICAgICAqIGFuY2hvci1wb2ludC5cbiAgICAgICAgKiBAcHJvcGVydHkgYW5nbGVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBhbmdsZSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgdmlzdWFsLWNvbXBvbmVudCB0byBkaXNwbGF5IHRoZSBnYW1lIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHZpc3VhbFxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9TcHJpdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEB2aXN1YWwgPSBuZXcgZ3MuQ29tcG9uZW50X1Nwcml0ZSgpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIFVJIG9iamVjdCdzIGJpdG1hcCB1c2VkIGZvciB2aXN1YWwgcHJlc2VudGF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBiaXRtYXBcbiAgICAgICAgKiBAdHlwZSBncy5CaXRtYXBcbiAgICAgICAgIyMjXG4gICAgICAgIGlmIGltYWdlTmFtZSAmJiBpbWFnZU5hbWVbMF0gPT0gXCIkXCJcbiAgICAgICAgICAgIEBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKGltYWdlTmFtZSlcbiAgICAgICAgZWxzZSAgICBcbiAgICAgICAgICAgIEBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tpbWFnZU5hbWV9XCIpXG4gICAgICAgIFxuICAgICAgICBpZiBAYml0bWFwP1xuICAgICAgICAgICAgaWYgaW1hZ2VIYW5kbGluZyA9PSAxXG4gICAgICAgICAgICAgICAgQHNyY1JlY3QgPSBuZXcgUmVjdCgwLCBAYml0bWFwLmhlaWdodCAvIDIsIEBiaXRtYXAud2lkdGgsIEBiaXRtYXAuaGVpZ2h0IC8gMilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc3JjUmVjdCA9IG5ldyBSZWN0KDAsIDAsIEBiaXRtYXAud2lkdGggfHwgMSwgQGJpdG1hcC5oZWlnaHQgfHwgMSlcbiAgICAgICAgICAgIEBkc3RSZWN0LnNldCgwLCAwLCBAc3JjUmVjdC53aWR0aCB8fCAxLCBAc3JjUmVjdC5oZWlnaHQgfHwgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCAxLCAxKVxuICAgICAgICAgICAgQGRzdFJlY3Quc2V0KDAsIDAsIDEsIDEpXG4gICAgICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEB2aXN1YWwpXG4gICAgICAgIFxudWkuT2JqZWN0X0ltYWdlID0gT2JqZWN0X0ltYWdlIl19
//# sourceURL=Object_Image_43.js