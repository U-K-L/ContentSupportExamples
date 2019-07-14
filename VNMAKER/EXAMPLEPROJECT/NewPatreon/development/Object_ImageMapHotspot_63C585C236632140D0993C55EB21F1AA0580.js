var Object_ImageMapHotspot,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_ImageMapHotspot = (function(superClass) {
  extend(Object_ImageMapHotspot, superClass);

  Object_ImageMapHotspot.objectCodecBlackList = ["parent"];

  Object_ImageMapHotspot.toDataBundle = function(object, context) {
    return {
      enabled: object.enabled,
      selected: object.selected
    };
  };


  /**
  * A game object used for pictures in a scene.
  *
  * @module gs
  * @class Object_Picture
  * @extends gs.Object_Visual
  * @memberof gs
  * @constructor
   */

  function Object_ImageMapHotspot() {
    Object_ImageMapHotspot.__super__.constructor.call(this);
  }

  return Object_ImageMapHotspot;

})(gs.Object_Picture);

gs.Object_ImageMapHotspot = Object_ImageMapHotspot;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07OztFQUNGLHNCQUFDLENBQUEsb0JBQUQsR0FBd0IsQ0FBQyxRQUFEOztFQUV4QixzQkFBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLE1BQUQsRUFBUyxPQUFUO0FBQ1gsV0FBTztNQUNILE9BQUEsRUFBUyxNQUFNLENBQUMsT0FEYjtNQUVILFFBQUEsRUFBVSxNQUFNLENBQUMsUUFGZDs7RUFESTs7O0FBTWY7Ozs7Ozs7Ozs7RUFTYSxnQ0FBQTtJQUNULHNEQUFBO0VBRFM7Ozs7R0FsQm9CLEVBQUUsQ0FBQzs7QUFxQnhDLEVBQUUsQ0FBQyxzQkFBSCxHQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X0ltYWdlTWFwSG90c3BvdFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0ltYWdlTWFwSG90c3BvdCBleHRlbmRzIGdzLk9iamVjdF9QaWN0dXJlXG4gICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wicGFyZW50XCJdXG4gICAgXG4gICAgQHRvRGF0YUJ1bmRsZTogKG9iamVjdCwgY29udGV4dCkgLT5cbiAgICAgICAgcmV0dXJuIHsgXG4gICAgICAgICAgICBlbmFibGVkOiBvYmplY3QuZW5hYmxlZFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG9iamVjdC5zZWxlY3RlZFxuICAgICAgICB9XG4gICBcbiAgICAjIyMqXG4gICAgKiBBIGdhbWUgb2JqZWN0IHVzZWQgZm9yIHBpY3R1cmVzIGluIGEgc2NlbmUuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9QaWN0dXJlXG4gICAgKiBAZXh0ZW5kcyBncy5PYmplY3RfVmlzdWFsXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuZ3MuT2JqZWN0X0ltYWdlTWFwSG90c3BvdCA9IE9iamVjdF9JbWFnZU1hcEhvdHNwb3QiXX0=
//# sourceURL=Object_ImageMapHotspot_188.js