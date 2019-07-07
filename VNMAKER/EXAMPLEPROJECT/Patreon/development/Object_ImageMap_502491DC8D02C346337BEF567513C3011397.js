var Object_ImageMap,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_ImageMap = (function(superClass) {
  extend(Object_ImageMap, superClass);

  Object_ImageMap.objectCodecBlackList = ["parent", "target", "controlsByStyle", "parentsByStyle", "styles", "activeStyles"];


  /**
  * An image-map UI object to display an image-map for UI interaction. 
  *
  * @module ui
  * @class Object_ImageMap
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
   */

  function Object_ImageMap() {
    Object_ImageMap.__super__.constructor.apply(this, arguments);

    /**
    * The names of the images used for the different states of the image-map.<br>
    *
    * - 0 = Ground Image
    * - 1 = Hovered
    * - 2 = Unselected
    * - 3 = Selected
    * - 4 = Selected Hovered
    *
    * @property images
    * @type string[]
     */
    this.images = [];

    /**
    * The hotspot data of the image-map. Each entry is a single hotspot on the image-map.
    * @property hotspots
    * @type gs.ImageMapHotspot[]
     */
    this.hotspots = [];

    /**
    * The color tone of the object used for the visual presentation.
    * @property tone
    * @type gs.Tone
     */
    this.tone = new gs.Tone(0, 0, 0, 0);

    /**
    * The color of the object used for the visual presentation.
    * @property color
    * @type gs.Color
     */
    this.color = new gs.Color(255, 255, 255, 0);

    /**
    * The object's animator-component to execute different kind of animations like move, rotate, etc. on it.
    * @property animator
    * @type vn.Component_Animator
     */
    this.animator = new gs.Component_Animator();

    /**
    * The object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_ImageMap
     */
    this.visual = new gs.Component_ImageMap();
    this.addComponent(this.animator);
    this.addComponent(this.visual);
    this.addComponent(this.events);
  }

  return Object_ImageMap;

})(ui.Object_UIElement);

ui.Object_ImageMap = Object_ImageMap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZUFBQTtFQUFBOzs7QUFBTTs7O0VBQ0YsZUFBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsaUJBQXJCLEVBQXdDLGdCQUF4QyxFQUEwRCxRQUExRCxFQUFvRSxjQUFwRTs7O0FBRXhCOzs7Ozs7Ozs7O0VBU2EseUJBQUE7SUFDVCxrREFBQSxTQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7SUFZQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLEVBQUUsQ0FBQyxJQUFILENBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEdBQW5CLEVBQXdCLENBQXhCOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLGtCQUFILENBQUE7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsa0JBQUgsQ0FBQTtJQUVkLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7SUFDQSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxNQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtFQXREUzs7OztHQVphLEVBQUUsQ0FBQzs7QUFvRWpDLEVBQUUsQ0FBQyxlQUFILEdBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfSW1hZ2VNYXBcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE9iamVjdF9JbWFnZU1hcCBleHRlbmRzIHVpLk9iamVjdF9VSUVsZW1lbnRcbiAgICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJwYXJlbnRcIiwgXCJ0YXJnZXRcIiwgXCJjb250cm9sc0J5U3R5bGVcIiwgXCJwYXJlbnRzQnlTdHlsZVwiLCBcInN0eWxlc1wiLCBcImFjdGl2ZVN0eWxlc1wiXVxuICAgIFxuICAgICMjIypcbiAgICAqIEFuIGltYWdlLW1hcCBVSSBvYmplY3QgdG8gZGlzcGxheSBhbiBpbWFnZS1tYXAgZm9yIFVJIGludGVyYWN0aW9uLiBcbiAgICAqXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgT2JqZWN0X0ltYWdlTWFwXG4gICAgKiBAZXh0ZW5kcyB1aS5PYmplY3RfVUlFbGVtZW50XG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZXMgb2YgdGhlIGltYWdlcyB1c2VkIGZvciB0aGUgZGlmZmVyZW50IHN0YXRlcyBvZiB0aGUgaW1hZ2UtbWFwLjxicj5cbiAgICAgICAgKlxuICAgICAgICAqIC0gMCA9IEdyb3VuZCBJbWFnZVxuICAgICAgICAqIC0gMSA9IEhvdmVyZWRcbiAgICAgICAgKiAtIDIgPSBVbnNlbGVjdGVkXG4gICAgICAgICogLSAzID0gU2VsZWN0ZWRcbiAgICAgICAgKiAtIDQgPSBTZWxlY3RlZCBIb3ZlcmVkXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VzXG4gICAgICAgICogQHR5cGUgc3RyaW5nW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZXMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBob3RzcG90IGRhdGEgb2YgdGhlIGltYWdlLW1hcC4gRWFjaCBlbnRyeSBpcyBhIHNpbmdsZSBob3RzcG90IG9uIHRoZSBpbWFnZS1tYXAuXG4gICAgICAgICogQHByb3BlcnR5IGhvdHNwb3RzXG4gICAgICAgICogQHR5cGUgZ3MuSW1hZ2VNYXBIb3RzcG90W11cbiAgICAgICAgIyMjXG4gICAgICAgIEBob3RzcG90cyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNvbG9yIHRvbmUgb2YgdGhlIG9iamVjdCB1c2VkIGZvciB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgdG9uZVxuICAgICAgICAqIEB0eXBlIGdzLlRvbmVcbiAgICAgICAgIyMjXG4gICAgICAgIEB0b25lID0gbmV3IGdzLlRvbmUoMCwgMCwgMCwgMClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY29sb3Igb2YgdGhlIG9iamVjdCB1c2VkIGZvciB0aGUgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgY29sb3JcbiAgICAgICAgKiBAdHlwZSBncy5Db2xvclxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbG9yID0gbmV3IGdzLkNvbG9yKDI1NSwgMjU1LCAyNTUsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGFuaW1hdG9yLWNvbXBvbmVudCB0byBleGVjdXRlIGRpZmZlcmVudCBraW5kIG9mIGFuaW1hdGlvbnMgbGlrZSBtb3ZlLCByb3RhdGUsIGV0Yy4gb24gaXQuXG4gICAgICAgICogQHByb3BlcnR5IGFuaW1hdG9yXG4gICAgICAgICogQHR5cGUgdm4uQ29tcG9uZW50X0FuaW1hdG9yXG4gICAgICAgICMjI1xuICAgICAgICBAYW5pbWF0b3IgPSBuZXcgZ3MuQ29tcG9uZW50X0FuaW1hdG9yKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3MgdmlzdWFsLWNvbXBvbmVudCB0byBkaXNwbGF5IHRoZSBnYW1lIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHZpc3VhbFxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9JbWFnZU1hcFxuICAgICAgICAjIyNcbiAgICAgICAgQHZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfSW1hZ2VNYXAoKVxuICAgICAgICBcbiAgICAgICAgQGFkZENvbXBvbmVudChAYW5pbWF0b3IpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQHZpc3VhbClcbiAgICAgICAgQGFkZENvbXBvbmVudChAZXZlbnRzKVxuICAgICAgICBcbnVpLk9iamVjdF9JbWFnZU1hcCA9IE9iamVjdF9JbWFnZU1hcCJdfQ==
//# sourceURL=Object_ImageMap_143.js