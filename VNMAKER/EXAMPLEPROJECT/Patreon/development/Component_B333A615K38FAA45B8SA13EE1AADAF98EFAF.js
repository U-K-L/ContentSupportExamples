var Component;

Component = (function() {

  /**
  * The base class of all components. A component defines a certain piece of
  * game logic. 
  *
  * @module gs
  * @class Component
  * @memberof gs
  * @constructor
   */
  function Component() {

    /**
    * The associated game object. A component only be part of one game object at the same time.
    * @property object
    * @type gs.Object_Base
    * @default null
     */
    this.object = null;

    /**
    * Indicates if the component is disposed. A disposed component cannot be used anymore.
    * @property disposed
    * @type boolean
    * @default false
     */
    this.disposed = false;

    /**
    * An optional unique id. The component can be accessed through this ID using the gs.Object_Base.findComponentById method.
    * @property id
    * @type string
    * @default null
     */
    this.id = null;

    /**
    * Indicates if the component is setup.
    * @property isSetup
    * @type boolean
    * @default no
     */
    this.isSetup = false;
  }


  /**
  * Called when the component is added to a new object.
  * @method setup
   */

  Component.prototype.setup = function() {
    return this.isSetup = true;
  };


  /**
  * Disposes the component. The component will be removed from the game object
  * automatically.
  * @method dispose
   */

  Component.prototype.dispose = function() {
    return this.disposed = true;
  };


  /**
  * Updates the component. Needs to be implemented in derived class.
  * @method update
   */

  Component.prototype.update = function() {};

  return Component;

})();

gs.Component = Component;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7OztFQVNhLG1CQUFBOztBQUNUOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7Ozs7SUFNQSxJQUFDLENBQUEsRUFBRCxHQUFNOztBQUVOOzs7Ozs7SUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXO0VBL0JGOzs7QUFpQ2I7Ozs7O3NCQUlBLEtBQUEsR0FBTyxTQUFBO1dBQ0gsSUFBQyxDQUFBLE9BQUQsR0FBVztFQURSOzs7QUFHUDs7Ozs7O3NCQUtBLE9BQUEsR0FBUyxTQUFBO1dBQUcsSUFBQyxDQUFBLFFBQUQsR0FBWTtFQUFmOzs7QUFFVDs7Ozs7c0JBSUEsTUFBQSxHQUFRLFNBQUEsR0FBQTs7Ozs7O0FBRVosRUFBRSxDQUFDLFNBQUgsR0FBZSIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRcbiAgICAjIyMqXG4gICAgKiBUaGUgYmFzZSBjbGFzcyBvZiBhbGwgY29tcG9uZW50cy4gQSBjb21wb25lbnQgZGVmaW5lcyBhIGNlcnRhaW4gcGllY2Ugb2ZcbiAgICAqIGdhbWUgbG9naWMuIFxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgYXNzb2NpYXRlZCBnYW1lIG9iamVjdC4gQSBjb21wb25lbnQgb25seSBiZSBwYXJ0IG9mIG9uZSBnYW1lIG9iamVjdCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBvYmplY3RcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfQmFzZVxuICAgICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgICAgIyMjXG4gICAgICAgIEBvYmplY3QgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzcG9zZWQuIEEgZGlzcG9zZWQgY29tcG9uZW50IGNhbm5vdCBiZSB1c2VkIGFueW1vcmUuXG4gICAgICAgICogQHByb3BlcnR5IGRpc3Bvc2VkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICMjI1xuICAgICAgICBAZGlzcG9zZWQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIG9wdGlvbmFsIHVuaXF1ZSBpZC4gVGhlIGNvbXBvbmVudCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCB0aGlzIElEIHVzaW5nIHRoZSBncy5PYmplY3RfQmFzZS5maW5kQ29tcG9uZW50QnlJZCBtZXRob2QuXG4gICAgICAgICogQHByb3BlcnR5IGlkXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAjIyNcbiAgICAgICAgQGlkID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgY29tcG9uZW50IGlzIHNldHVwLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1NldHVwXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IG5vXG4gICAgICAgICMjI1xuICAgICAgICBAaXNTZXR1cCA9IG5vXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQgdG8gYSBuZXcgb2JqZWN0LlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPiBcbiAgICAgICAgQGlzU2V0dXAgPSB5ZXNcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIGNvbXBvbmVudC4gVGhlIGNvbXBvbmVudCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZ2FtZSBvYmplY3RcbiAgICAqIGF1dG9tYXRpY2FsbHkuXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPiBAZGlzcG9zZWQgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBjb21wb25lbnQuIE5lZWRzIHRvIGJlIGltcGxlbWVudGVkIGluIGRlcml2ZWQgY2xhc3MuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgXG5ncy5Db21wb25lbnQgPSBDb21wb25lbnQiXX0=
//# sourceURL=Component_5.js