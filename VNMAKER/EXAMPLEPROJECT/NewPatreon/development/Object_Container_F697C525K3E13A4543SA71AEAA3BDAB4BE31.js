var Object_Container,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Container = (function(superClass) {
  extend(Object_Container, superClass);


  /**
  * A game object which can contain other game objects.
  *
  * @module gs
  * @class Object_Container
  * @extends gs.Object_Base
  * @memberof gs
  * @constructor
   */

  function Object_Container(disposeBehavior) {
    Object_Container.__super__.constructor.apply(this, arguments);

    /**
    * The container's behavior component.
    * @property behavior
    * @type behavior
     */
    this.behavior = new gs.Component_Container(disposeBehavior);
    this.addComponent(this.behavior);
  }

  return Object_Container;

})(gs.Object_Base);

gs.Object_Container = Object_Container;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZ0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLDBCQUFDLGVBQUQ7SUFDVCxtREFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLG1CQUFILENBQXVCLGVBQXZCO0lBQ2hCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUFUUzs7OztHQVZjLEVBQUUsQ0FBQzs7QUFxQmxDLEVBQUUsQ0FBQyxnQkFBSCxHQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X0NvbnRhaW5lclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0NvbnRhaW5lciBleHRlbmRzIGdzLk9iamVjdF9CYXNlXG4gICAgIyMjKlxuICAgICogQSBnYW1lIG9iamVjdCB3aGljaCBjYW4gY29udGFpbiBvdGhlciBnYW1lIG9iamVjdHMuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9Db250YWluZXJcbiAgICAqIEBleHRlbmRzIGdzLk9iamVjdF9CYXNlXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGlzcG9zZUJlaGF2aW9yKSAtPlxuICAgICAgICBzdXBlclxuICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNvbnRhaW5lcidzIGJlaGF2aW9yIGNvbXBvbmVudC5cbiAgICAgICAgKiBAcHJvcGVydHkgYmVoYXZpb3JcbiAgICAgICAgKiBAdHlwZSBiZWhhdmlvclxuICAgICAgICAjIyNcbiAgICAgICAgQGJlaGF2aW9yID0gbmV3IGdzLkNvbXBvbmVudF9Db250YWluZXIoZGlzcG9zZUJlaGF2aW9yKVxuICAgICAgICBAYWRkQ29tcG9uZW50KEBiZWhhdmlvcilcbiAgICAgICAgXG5ncy5PYmplY3RfQ29udGFpbmVyID0gT2JqZWN0X0NvbnRhaW5lciJdfQ==
//# sourceURL=Object_Container_88.js