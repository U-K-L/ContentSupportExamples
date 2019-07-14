var Object_ThreePartImage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_ThreePartImage = (function(superClass) {
  extend(Object_ThreePartImage, superClass);


  /**
  * An object to display a three-part image using three
  * sub-images: start, middle and end. For info, see ui.Component_ThreePartImage.
  *
  * @module ui
  * @class Object_ThreePartImage
  * @extends ui.Object_UIElement
  * @memberof ui
  * @constructor
  * @see ui.Component_ThreePartImage
   */

  function Object_ThreePartImage(skin) {
    Object_ThreePartImage.__super__.constructor.apply(this, arguments);
    this.image = skin;

    /**
    * The object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite
     */
    this.visual = new gs.Component_ThreePartImage();

    /**
    * A hotspot behavior-component to make the UI object clickable/touchable.
    * @property hotspot
    * @type gs.Component_HotspotBehavior
     */
    this.hotspot = new gs.Component_HotspotBehavior();
    this.addComponent(this.hotspot);
    this.addComponent(this.visual);
  }

  return Object_ThreePartImage;

})(ui.Object_UIElement);

ui.Object_ThreePartImage = Object_ThreePartImage;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEscUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7O0VBV2EsK0JBQUMsSUFBRDtJQUNULHdEQUFBLFNBQUE7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsd0JBQUgsQ0FBQTs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsRUFBRSxDQUFDLHlCQUFILENBQUE7SUFFZixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxPQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsTUFBZjtFQW5CUzs7OztHQVptQixFQUFFLENBQUM7O0FBaUN2QyxFQUFFLENBQUMscUJBQUgsR0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9UaHJlZVBhcnRJbWFnZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X1RocmVlUGFydEltYWdlIGV4dGVuZHMgdWkuT2JqZWN0X1VJRWxlbWVudFxuICAgICMjIypcbiAgICAqIEFuIG9iamVjdCB0byBkaXNwbGF5IGEgdGhyZWUtcGFydCBpbWFnZSB1c2luZyB0aHJlZVxuICAgICogc3ViLWltYWdlczogc3RhcnQsIG1pZGRsZSBhbmQgZW5kLiBGb3IgaW5mbywgc2VlIHVpLkNvbXBvbmVudF9UaHJlZVBhcnRJbWFnZS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgT2JqZWN0X1RocmVlUGFydEltYWdlXG4gICAgKiBAZXh0ZW5kcyB1aS5PYmplY3RfVUlFbGVtZW50XG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHNlZSB1aS5Db21wb25lbnRfVGhyZWVQYXJ0SW1hZ2VcbiAgICAjIyMgXG4gICAgY29uc3RydWN0b3I6IChza2luKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBAaW1hZ2UgPSBza2luXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHZpc3VhbC1jb21wb25lbnQgdG8gZGlzcGxheSB0aGUgZ2FtZSBvYmplY3Qgb24gc2NyZWVuLlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aXN1YWxcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRfU3ByaXRlXG4gICAgICAgICMjI1xuICAgICAgICBAdmlzdWFsID0gbmV3IGdzLkNvbXBvbmVudF9UaHJlZVBhcnRJbWFnZSgpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQSBob3RzcG90IGJlaGF2aW9yLWNvbXBvbmVudCB0byBtYWtlIHRoZSBVSSBvYmplY3QgY2xpY2thYmxlL3RvdWNoYWJsZS5cbiAgICAgICAgKiBAcHJvcGVydHkgaG90c3BvdFxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9Ib3RzcG90QmVoYXZpb3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBob3RzcG90ID0gbmV3IGdzLkNvbXBvbmVudF9Ib3RzcG90QmVoYXZpb3IoKSBcbiAgICAgICAgXG4gICAgICAgIEBhZGRDb21wb25lbnQoQGhvdHNwb3QpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQHZpc3VhbClcbiAgICAgICAgXG51aS5PYmplY3RfVGhyZWVQYXJ0SW1hZ2UgPSBPYmplY3RfVGhyZWVQYXJ0SW1hZ2UiXX0=
//# sourceURL=Object_ThreePartImage_116.js