var Object_DomainContainer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_DomainContainer = (function(superClass) {
  extend(Object_DomainContainer, superClass);


  /**
  * A game object which can contain other game objects by domain.
  *
  * @module gs
  * @class Object_DomainContainer
  * @extends gs.Object_Base
  * @memberof gs
  * @constructor
   */

  function Object_DomainContainer(disposeBehavior) {
    Object_DomainContainer.__super__.constructor.apply(this, arguments);

    /**
    * All sub-objects by domain. The default domain is an empty string.
    * @property subObjectsByDomain
    * @type Object
     */
    this.subObjectsByDomain = {
      "com.degica.vnm.default": this.subObjects
    };

    /**
    * The container's behavior component.
    * @property behavior
    * @type gs.Component_DomainContainer
     */
    this.behavior = new gs.Component_DomainContainer(disposeBehavior);
    this.addComponent(this.behavior);
  }

  return Object_DomainContainer;

})(gs.Object_Base);

gs.Object_DomainContainer = Object_DomainContainer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGdDQUFDLGVBQUQ7SUFDVCx5REFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtNQUFFLHdCQUFBLEVBQTBCLElBQUMsQ0FBQSxVQUE3Qjs7O0FBRXRCOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLHlCQUFILENBQTZCLGVBQTdCO0lBRWhCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFFBQWY7RUFqQlM7Ozs7R0FWb0IsRUFBRSxDQUFDOztBQTZCeEMsRUFBRSxDQUFDLHNCQUFILEdBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfRG9tYWluQ29udGFpbmVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfRG9tYWluQ29udGFpbmVyIGV4dGVuZHMgZ3MuT2JqZWN0X0Jhc2VcbiAgICAjIyMqXG4gICAgKiBBIGdhbWUgb2JqZWN0IHdoaWNoIGNhbiBjb250YWluIG90aGVyIGdhbWUgb2JqZWN0cyBieSBkb21haW4uXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9Eb21haW5Db250YWluZXJcbiAgICAqIEBleHRlbmRzIGdzLk9iamVjdF9CYXNlXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGlzcG9zZUJlaGF2aW9yKSAtPlxuICAgICAgICBzdXBlclxuICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQWxsIHN1Yi1vYmplY3RzIGJ5IGRvbWFpbi4gVGhlIGRlZmF1bHQgZG9tYWluIGlzIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgc3ViT2JqZWN0c0J5RG9tYWluXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAc3ViT2JqZWN0c0J5RG9tYWluID0geyBcImNvbS5kZWdpY2Eudm5tLmRlZmF1bHRcIjogQHN1Yk9iamVjdHMgfVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjb250YWluZXIncyBiZWhhdmlvciBjb21wb25lbnQuXG4gICAgICAgICogQHByb3BlcnR5IGJlaGF2aW9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29tcG9uZW50X0RvbWFpbkNvbnRhaW5lclxuICAgICAgICAjIyNcbiAgICAgICAgQGJlaGF2aW9yID0gbmV3IGdzLkNvbXBvbmVudF9Eb21haW5Db250YWluZXIoZGlzcG9zZUJlaGF2aW9yKVxuICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEBiZWhhdmlvcilcbiAgICAgICAgXG5ncy5PYmplY3RfRG9tYWluQ29udGFpbmVyID0gT2JqZWN0X0RvbWFpbkNvbnRhaW5lciJdfQ==
//# sourceURL=Object_DomainContainer_101.js