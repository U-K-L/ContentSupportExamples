
/**
* An enumeration of different dispose behaviors for containers. A dispose
* behavior describes what should happen with objects in a container after
* they got disposed.
*
* @module gs
* @class ContainerDisposeBehavior
* @memberof gs
* @constructor
* @static
* @final
 */
var ContainerDisposeBehavior;

ContainerDisposeBehavior = (function() {
  function ContainerDisposeBehavior() {}

  ContainerDisposeBehavior.initialize = function() {

    /**
    * Removes the disposed object from the container.
    * @property REMOVE
    * @type number
    * @static
    * @final
     */
    this.REMOVE = 0;

    /**
    * Sets the object reference to <b>null</b> but doesn't removing it from the container so the
    * indices are not changed.
    * @property NULL
    * @type number
    * @static
    * @final
     */
    return this.NULL = 1;
  };

  return ContainerDisposeBehavior;

})();

ContainerDisposeBehavior.initialize();

gs.ContainerDisposeBehavior = ContainerDisposeBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFZTTs7O0VBQ0Ysd0JBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQTs7QUFDVDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBRVY7Ozs7Ozs7O1dBUUEsSUFBQyxDQUFBLElBQUQsR0FBUTtFQWxCQzs7Ozs7O0FBb0JqQix3QkFBd0IsQ0FBQyxVQUF6QixDQUFBOztBQUNBLEVBQUUsQ0FBQyx3QkFBSCxHQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29udGFpbmVyRGlzcG9zZUJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiMjIypcbiogQW4gZW51bWVyYXRpb24gb2YgZGlmZmVyZW50IGRpc3Bvc2UgYmVoYXZpb3JzIGZvciBjb250YWluZXJzLiBBIGRpc3Bvc2VcbiogYmVoYXZpb3IgZGVzY3JpYmVzIHdoYXQgc2hvdWxkIGhhcHBlbiB3aXRoIG9iamVjdHMgaW4gYSBjb250YWluZXIgYWZ0ZXJcbiogdGhleSBnb3QgZGlzcG9zZWQuXG4qXG4qIEBtb2R1bGUgZ3NcbiogQGNsYXNzIENvbnRhaW5lckRpc3Bvc2VCZWhhdmlvclxuKiBAbWVtYmVyb2YgZ3NcbiogQGNvbnN0cnVjdG9yXG4qIEBzdGF0aWNcbiogQGZpbmFsXG4jIyNcbmNsYXNzIENvbnRhaW5lckRpc3Bvc2VCZWhhdmlvclxuICAgIEBpbml0aWFsaXplOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogUmVtb3ZlcyB0aGUgZGlzcG9zZWQgb2JqZWN0IGZyb20gdGhlIGNvbnRhaW5lci5cbiAgICAgICAgKiBAcHJvcGVydHkgUkVNT1ZFXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHN0YXRpY1xuICAgICAgICAqIEBmaW5hbFxuICAgICAgICAjIyNcbiAgICAgICAgQFJFTU9WRSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTZXRzIHRoZSBvYmplY3QgcmVmZXJlbmNlIHRvIDxiPm51bGw8L2I+IGJ1dCBkb2Vzbid0IHJlbW92aW5nIGl0IGZyb20gdGhlIGNvbnRhaW5lciBzbyB0aGVcbiAgICAgICAgKiBpbmRpY2VzIGFyZSBub3QgY2hhbmdlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgTlVMTFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBOVUxMID0gMVxuXG5Db250YWluZXJEaXNwb3NlQmVoYXZpb3IuaW5pdGlhbGl6ZSgpICAgIFxuZ3MuQ29udGFpbmVyRGlzcG9zZUJlaGF2aW9yID0gQ29udGFpbmVyRGlzcG9zZUJlaGF2aW9yIl19
//# sourceURL=ContainerDisposeBehavior_80.js