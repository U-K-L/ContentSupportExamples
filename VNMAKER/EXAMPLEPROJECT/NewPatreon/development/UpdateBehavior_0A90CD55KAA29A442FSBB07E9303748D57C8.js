
/**
* An enumeration of different UI object update behaviors.
*
* @module ui
* @class UpdateBehavior
* @memberof ui
* @constructor
* @static
* @final
 */
var UpdateBehavior;

UpdateBehavior = (function() {
  function UpdateBehavior() {}

  UpdateBehavior.initialize = function() {

    /**
    * The UI object is only updated if necessary. However, there are cases where
    * a necessary update is not detected.
    * @property NORMAL
    * @type number
    * @static
    * @final
     */
    this.NORMAL = 0;

    /**
    * The UI object is updated on every frame.
    * @property CONTINUOUS
    * @type number
    * @static
    * @final
     */
    return this.CONTINUOUS = 1;
  };

  return UpdateBehavior;

})();

UpdateBehavior.initialize();

ui.UpdateBehavior = UpdateBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBVU07OztFQUNGLGNBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQTs7QUFDVDs7Ozs7Ozs7SUFRQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7O1dBT0EsSUFBQyxDQUFBLFVBQUQsR0FBYztFQWxCTDs7Ozs7O0FBb0JqQixjQUFjLENBQUMsVUFBZixDQUFBOztBQUNBLEVBQUUsQ0FBQyxjQUFILEdBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBVcGRhdGVCZWhhdmlvclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4jIyMqXG4qIEFuIGVudW1lcmF0aW9uIG9mIGRpZmZlcmVudCBVSSBvYmplY3QgdXBkYXRlIGJlaGF2aW9ycy5cbipcbiogQG1vZHVsZSB1aVxuKiBAY2xhc3MgVXBkYXRlQmVoYXZpb3JcbiogQG1lbWJlcm9mIHVpXG4qIEBjb25zdHJ1Y3RvclxuKiBAc3RhdGljXG4qIEBmaW5hbFxuIyMjXG5jbGFzcyBVcGRhdGVCZWhhdmlvclxuICAgIEBpbml0aWFsaXplOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIFVJIG9iamVjdCBpcyBvbmx5IHVwZGF0ZWQgaWYgbmVjZXNzYXJ5LiBIb3dldmVyLCB0aGVyZSBhcmUgY2FzZXMgd2hlcmVcbiAgICAgICAgKiBhIG5lY2Vzc2FyeSB1cGRhdGUgaXMgbm90IGRldGVjdGVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBOT1JNQUxcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBATk9STUFMID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QgaXMgdXBkYXRlZCBvbiBldmVyeSBmcmFtZS5cbiAgICAgICAgKiBAcHJvcGVydHkgQ09OVElOVU9VU1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBDT05USU5VT1VTID0gMVxuICAgIFxuVXBkYXRlQmVoYXZpb3IuaW5pdGlhbGl6ZSgpXG51aS5VcGRhdGVCZWhhdmlvciA9IFVwZGF0ZUJlaGF2aW9yIl19
//# sourceURL=UpdateBehavior_0.js