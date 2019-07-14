var ObjectManager;

ObjectManager = (function() {

  /**
  * Stores the current default ObjectManager.
  * @property current
  * @type gs.ObjectManager
  * @static
   */
  ObjectManager.current = null;


  /**
  * Manages game objects by updating if necessary and offering
  * methods to add or remove game objects. All game objects are sorted by
  * the order-property to give control over the update-order.
  *
  * A game object can registered under a unique ID and then easily accessed using
  * that ID. If an object gets registered, a global variable $<ID> is created
  * as well. However, that global variable is only for the use in property-bindings
  * used for In-Game UI. See ui.Component_BindingHandler.
  *
  * In addition, a game object can be assigned to a group like for example
  * a set of UI toggle-buttons can be assigned to the same group and then
  * easily accessed later using gs.ObjectManager.objectsByGroup method.
  *
  * @module gs
  * @class ObjectManager
  * @memberof gs
  * @constructor
  * @see ui.Component_BindingHandler
   */

  function ObjectManager() {

    /**
    * All game objects to manage.
    * @property objects
    * @type gs.Object_Base[]
     */
    this.objects = [];

    /**
    * All game objects by ID.
    * @property objectsById
    * @type Object
     */
    this.objectsById = {};

    /**
    * All game objects by group.
    * @property objectsByGroup_
    * @type Object
     */
    this.objectsByGroup_ = {};

    /**
    * Indicates if the ObjectManager is active. If <b>false</b> the game objects are not updated.
    * @property active
    * @type boolean
     */
    this.active = true;

    /**
    * Indicates if the ObjectManager needs to sort the game objects.
    * @property active
    * @type boolean
     */
    this.needsSort = true;
  }


  /**
  * Disposes the manager and all assigned game objects.
  *
  * @method dispose
   */

  ObjectManager.prototype.dispose = function() {
    var j, len, object, ref, results;
    ref = this.objects;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      object = ref[j];
      if (!object.disposed) {
        results.push(object.dispose());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Disposes all assigned game objects.
  *
  * @method disposeObjects
   */

  ObjectManager.prototype.disposeObjects = function() {
    var j, k, keys, len, object, results;
    keys = Object.keys(this.objectsById);
    results = [];
    for (j = 0, len = keys.length; j < len; j++) {
      k = keys[j];
      object = this.objectsById[k];
      if (object && !object.disposed) {
        results.push(object.dispose());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Registers an object.
  *
  * @method registerObject
   */

  ObjectManager.prototype.registerObject = function(object) {
    if (object.id != null) {
      if (!this.objectsById[object.id]) {
        this.objectsById[object.id] = [];
      }
      this.objectsById[object.id].push(object);
      return window["$" + object.id] = object;
    }
  };


  /**
  * Unregisters an object.
  *
  * @method unregisterObject
   */

  ObjectManager.prototype.unregisterObject = function(object) {
    var objects;
    if ((object != null ? object.id : void 0) != null) {
      objects = this.objectsById[object.id];
      if (objects) {
        objects.remove(object);
        if (objects.length > 0) {
          window["$" + object.id] = objects.last();
        } else {
          delete window["$" + object.id];
        }
      }
    }
    return null;
  };


  /**
  * Adds a game object to the manager. The game object is then automatically updated by the manager.
  *
  * @method addObject
  * @param {gs.Object_Base} object - The game object to add.
   */

  ObjectManager.prototype.addObject = function(object) {
    return this.add(object);
  };


  /**
  * Removes a game object to the manager. The game object is then no longer automatically updated or disposed by the manager.
  *
  * @method removeObject
  * @param {gs.Object_Base} object - The game object to remove.
   */

  ObjectManager.prototype.removeObject = function(object) {
    return this.remove(object);
  };


  /**
  * Adds a game object to the manager. The game object is then automatically updated by the manager.
  *
  * @method add
  * @param {gs.Object_Base} object - The game object to add.
   */

  ObjectManager.prototype.add = function(object) {
    this.objects.push(object);
    this.needsSort = true;
    this.registerObject(object);
    return this.addToGroup(object, object.group);
  };


  /**
  * Removes a game object to the manager. The game object is then no longer automatically updated or disposed by the manager.
  *
  * @method remove
  * @param {gs.Object_Base} object - The game object to remove.
   */

  ObjectManager.prototype.remove = function(object) {
    var ref;
    if (object) {
      this.objects.remove(object);
      this.unregisterObject(object);
      if (object.group != null) {
        return (ref = this.objectsByGroup[object.group]) != null ? ref.remove(object) : void 0;
      }
    }
  };


  /**
  * Gets an object by ID.
  *
  * @method objectById
  * @param {String} id - The ID of the game object to get. 
  * @return {gs.Object_Base} The game object or <b>null</b> if no game object is registered for the specified ID.
   */

  ObjectManager.prototype.objectById = function(id) {
    var ref;
    return (ref = this.objectsById[id]) != null ? ref.last() : void 0;
  };


  /**
  * Gets an object by ID.
  *
  * @method byId
  * @param {String} id - The ID of the game object to get. 
  * @return {gs.Object_Base} The game object or <b>null</b> if no game object is registered for the specified ID.
   */

  ObjectManager.prototype.byId = function(id) {
    var ref;
    return (ref = this.objectsById[id]) != null ? ref.last() : void 0;
  };


  /**
  * Sets the object for an ID.
  *
  * @method setObjectById
  * @param {gs.Object_Base} object - The game object to set.
  * @param {String} id - The ID for the game object.
   */

  ObjectManager.prototype.setObjectById = function(object, id) {
    object.id = id;
    if (!this.objectsById[id]) {
      this.objectsById[id] = [object];
    } else {
      this.objectsById[id].push(object);
    }
    return window["$" + id] = object;
  };


  /**
  * Adds an object to a specified object-group.
  *
  * @method addToGroup
  * @param {gs.Object_Base} object - The game object to add.
  * @param {String} group - The group to assign game object to.
   */

  ObjectManager.prototype.addToGroup = function(object, group) {
    var ref;
    if (group != null) {
      if ((ref = this.objectsByGroup_[object.group]) != null) {
        ref.remove(object);
      }
      if (!this.objectsByGroup_[group]) {
        this.objectsByGroup_[group] = [];
      }
      return this.objectsByGroup_[group].push(object);
    }
  };


  /**
  * Gets all object of a specified object-group.
  *
  * @method objectsByGroup
  * @param {String} group - The object-group.
  * @return {gs.Object_Base[]} The game objects belonging to the specified group.
   */

  ObjectManager.prototype.objectsByGroup = function(group) {
    return this.objectsByGroup_[group] || [];
  };


  /**
  * Updates the manager and all assigned game objects in the right order.
  *
  * @method update
   */

  ObjectManager.prototype.update = function() {
    var i, object;
    i = 0;
    if (this.needsSort) {
      this.objects.sort(function(a, b) {
        if (a.order < b.order) {
          return 1;
        } else if (a.order > b.order) {
          return -1;
        } else {
          return 0;
        }
      });
      this.needsSort = false;
    }
    while (i < this.objects.length) {
      object = this.objects[i];
      if (object.disposed) {
        this.removeObject(object);
      } else {
        if (object.active) {
          object.update();
        }
        i++;
      }
    }
    return null;
  };

  return ObjectManager;

})();

gs.ObjectManager = ObjectManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7OztFQU1BLGFBQUMsQ0FBQSxPQUFELEdBQVU7OztBQUVWOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQmEsdUJBQUE7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxlQUFELEdBQW1COztBQUVuQjs7Ozs7SUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWE7RUFsQ0o7OztBQW9DYjs7Ozs7OzBCQUtBLE9BQUEsR0FBUyxTQUFBO0FBQ0wsUUFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTs7TUFDSSxJQUFHLENBQUksTUFBTSxDQUFDLFFBQWQ7cUJBQ0ksTUFBTSxDQUFDLE9BQVAsQ0FBQSxHQURKO09BQUEsTUFBQTs2QkFBQTs7QUFESjs7RUFESzs7O0FBS1Q7Ozs7OzswQkFLQSxjQUFBLEdBQWdCLFNBQUE7QUFDWixRQUFBO0lBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLFdBQWI7QUFDUDtTQUFBLHNDQUFBOztNQUNJLE1BQUEsR0FBUyxJQUFDLENBQUEsV0FBWSxDQUFBLENBQUE7TUFDdEIsSUFBRyxNQUFBLElBQVcsQ0FBSSxNQUFNLENBQUMsUUFBekI7cUJBQ0ksTUFBTSxDQUFDLE9BQVAsQ0FBQSxHQURKO09BQUEsTUFBQTs2QkFBQTs7QUFGSjs7RUFGWTs7O0FBT2hCOzs7Ozs7MEJBS0EsY0FBQSxHQUFnQixTQUFDLE1BQUQ7SUFDWixJQUFHLGlCQUFIO01BQ0ksSUFBRyxDQUFDLElBQUMsQ0FBQSxXQUFZLENBQUEsTUFBTSxDQUFDLEVBQVAsQ0FBakI7UUFDSSxJQUFDLENBQUEsV0FBWSxDQUFBLE1BQU0s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Ozs7Ozs7OzBCQU9BLGNBQUEsR0FBZ0IsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLGVBQWdCLENBQUEsS0FBQSxDQUFqQixJQUEyQjtFQUF0Qzs7O0FBR2hCOzs7Ozs7MEJBS0EsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEsQ0FBQSxHQUFJO0lBRUosSUFBRyxJQUFDLENBQUEsU0FBSjtNQUNJLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFNBQUMsQ0FBRCxFQUFJLENBQUo7UUFDVixJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLEtBQWY7QUFDSSxpQkFBTyxFQURYO1NBQUEsTUFFSyxJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLEtBQWY7QUFDRCxpQkFBTyxDQUFDLEVBRFA7U0FBQSxNQUFBO0FBR0QsaUJBQU8sRUFITjs7TUFISyxDQUFkO01BT0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxNQVJqQjs7QUFVQSxXQUFNLENBQUEsR0FBSSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQW5CO01BQ0ksTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQTtNQUNsQixJQUFHLE1BQU0sQ0FBQyxRQUFWO1FBQ0ksSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBREo7T0FBQSxNQUFBO1FBR0ksSUFBbUIsTUFBTSxDQUFDLE1BQTFCO1VBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxFQUFBOztRQUNBLENBQUEsR0FKSjs7SUFGSjtBQVFBLFdBQU87RUFyQkg7Ozs7OztBQXVCWixFQUFFLENBQUMsYUFBSCxHQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0TWFuYWdlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0TWFuYWdlclxuICAgICMjIypcbiAgICAqIFN0b3JlcyB0aGUgY3VycmVudCBkZWZhdWx0IE9iamVjdE1hbmFnZXIuXG4gICAgKiBAcHJvcGVydHkgY3VycmVudFxuICAgICogQHR5cGUgZ3MuT2JqZWN0TWFuYWdlclxuICAgICogQHN0YXRpY1xuICAgICMjIyBcbiAgICBAY3VycmVudDogbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIE1hbmFnZXMgZ2FtZSBvYmplY3RzIGJ5IHVwZGF0aW5nIGlmIG5lY2Vzc2FyeSBhbmQgb2ZmZXJpbmdcbiAgICAqIG1ldGhvZHMgdG8gYWRkIG9yIHJlbW92ZSBnYW1lIG9iamVjdHMuIEFsbCBnYW1lIG9iamVjdHMgYXJlIHNvcnRlZCBieVxuICAgICogdGhlIG9yZGVyLXByb3BlcnR5IHRvIGdpdmUgY29udHJvbCBvdmVyIHRoZSB1cGRhdGUtb3JkZXIuXG4gICAgKlxuICAgICogQSBnYW1lIG9iamVjdCBjYW4gcmVnaXN0ZXJlZCB1bmRlciBhIHVuaXF1ZSBJRCBhbmQgdGhlbiBlYXNpbHkgYWNjZXNzZWQgdXNpbmdcbiAgICAqIHRoYXQgSUQuIElmIGFuIG9iamVjdCBnZXRzIHJlZ2lzdGVyZWQsIGEgZ2xvYmFsIHZhcmlhYmxlICQ8SUQ+IGlzIGNyZWF0ZWRcbiAgICAqIGFzIHdlbGwuIEhvd2V2ZXIsIHRoYXQgZ2xvYmFsIHZhcmlhYmxlIGlzIG9ubHkgZm9yIHRoZSB1c2UgaW4gcHJvcGVydHktYmluZGluZ3NcbiAgICAqIHVzZWQgZm9yIEluLUdhbWUgVUkuIFNlZSB1aS5Db21wb25lbnRfQmluZGluZ0hhbmRsZXIuXG4gICAgKlxuICAgICogSW4gYWRkaXRpb24sIGEgZ2FtZSBvYmplY3QgY2FuIGJlIGFzc2lnbmVkIHRvIGEgZ3JvdXAgbGlrZSBmb3IgZXhhbXBsZVxuICAgICogYSBzZXQgb2YgVUkgdG9nZ2xlLWJ1dHRvbnMgY2FuIGJlIGFzc2lnbmVkIHRvIHRoZSBzYW1lIGdyb3VwIGFuZCB0aGVuXG4gICAgKiBlYXNpbHkgYWNjZXNzZWQgbGF0ZXIgdXNpbmcgZ3MuT2JqZWN0TWFuYWdlci5vYmplY3RzQnlHcm91cCBtZXRob2QuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdE1hbmFnZXJcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKiBAc2VlIHVpLkNvbXBvbmVudF9CaW5kaW5nSGFuZGxlclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogQWxsIGdhbWUgb2JqZWN0cyB0byBtYW5hZ2UuXG4gICAgICAgICogQHByb3BlcnR5IG9iamVjdHNcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfQmFzZVtdXG4gICAgICAgICMjIyBcbiAgICAgICAgQG9iamVjdHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFsbCBnYW1lIG9iamVjdHMgYnkgSUQuXG4gICAgICAgICogQHByb3BlcnR5IG9iamVjdHNCeUlkXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjIyBcbiAgICAgICAgQG9iamVjdHNCeUlkID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbGwgZ2FtZSBvYmplY3RzIGJ5IGdyb3VwLlxuICAgICAgICAqIEBwcm9wZXJ0eSBvYmplY3RzQnlHcm91cF9cbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjIFxuICAgICAgICBAb2JqZWN0c0J5R3JvdXBfID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIE9iamVjdE1hbmFnZXIgaXMgYWN0aXZlLiBJZiA8Yj5mYWxzZTwvYj4gdGhlIGdhbWUgb2JqZWN0cyBhcmUgbm90IHVwZGF0ZWQuXG4gICAgICAgICogQHByb3BlcnR5IGFjdGl2ZVxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjIFxuICAgICAgICBAYWN0aXZlID0geWVzXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBPYmplY3RNYW5hZ2VyIG5lZWRzIHRvIHNvcnQgdGhlIGdhbWUgb2JqZWN0cy5cbiAgICAgICAgKiBAcHJvcGVydHkgYWN0aXZlXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyMgXG4gICAgICAgIEBuZWVkc1NvcnQgPSB5ZXNcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIG1hbmFnZXIgYW5kIGFsbCBhc3NpZ25lZCBnYW1lIG9iamVjdHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgZm9yIG9iamVjdCBpbiBAb2JqZWN0c1xuICAgICAgICAgICAgaWYgbm90IG9iamVjdC5kaXNwb3NlZFxuICAgICAgICAgICAgICAgIG9iamVjdC5kaXNwb3NlKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgYWxsIGFzc2lnbmVkIGdhbWUgb2JqZWN0cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VPYmplY3RzXG4gICAgIyMjICAgICAgICAgICBcbiAgICBkaXNwb3NlT2JqZWN0czogLT5cbiAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKEBvYmplY3RzQnlJZClcbiAgICAgICAgZm9yIGsgaW4ga2V5c1xuICAgICAgICAgICAgb2JqZWN0ID0gQG9iamVjdHNCeUlkW2tdXG4gICAgICAgICAgICBpZiBvYmplY3QgYW5kIG5vdCBvYmplY3QuZGlzcG9zZWRcbiAgICAgICAgICAgICAgICBvYmplY3QuZGlzcG9zZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogUmVnaXN0ZXJzIGFuIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlZ2lzdGVyT2JqZWN0XG4gICAgIyMjXG4gICAgcmVnaXN0ZXJPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIG9iamVjdC5pZD9cbiAgICAgICAgICAgIGlmICFAb2JqZWN0c0J5SWRbb2JqZWN0LmlkXVxuICAgICAgICAgICAgICAgIEBvYmplY3RzQnlJZFtvYmplY3QuaWRdID0gW11cbiAgICAgICAgICAgIEBvYmplY3RzQnlJZFtvYmplY3QuaWRdLnB1c2gob2JqZWN0KVxuICAgICAgICAgICAgIyBGSVhNRTogU2hvdWxkIGJlIGhhbmRsZWQgYnkgVWlNYW5hZ2VyIHNpbmNlIGl0IGlzIFVJIHNwZWNpZmljLlxuICAgICAgICAgICAgd2luZG93W1wiJFwiK29iamVjdC5pZF0gPSBvYmplY3RcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVbnJlZ2lzdGVycyBhbiBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCB1bnJlZ2lzdGVyT2JqZWN0XG4gICAgIyMjICAgICAgICBcbiAgICB1bnJlZ2lzdGVyT2JqZWN0OiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBvYmplY3Q/LmlkP1xuICAgICAgICAgICAgb2JqZWN0cyA9IEBvYmplY3RzQnlJZFtvYmplY3QuaWRdXG4gICAgICAgICAgICBpZiBvYmplY3RzXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5yZW1vdmUob2JqZWN0KVxuICAgICAgICAgICAgICAgIGlmIG9iamVjdHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3dbXCIkXCIrb2JqZWN0LmlkXSA9IG9iamVjdHMubGFzdCgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgd2luZG93W1wiJFwiK29iamVjdC5pZF1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGEgZ2FtZSBvYmplY3QgdG8gdGhlIG1hbmFnZXIuIFRoZSBnYW1lIG9iamVjdCBpcyB0aGVuIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBieSB0aGUgbWFuYWdlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZE9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIGFkZC5cbiAgICAjIyMgICAgICAgIFxuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT4gQGFkZChvYmplY3QpXG4gICAgXG4gICAgIyMjKlxuICAgICogUmVtb3ZlcyBhIGdhbWUgb2JqZWN0IHRvIHRoZSBtYW5hZ2VyLiBUaGUgZ2FtZSBvYmplY3QgaXMgdGhlbiBubyBsb25nZXIgYXV0b21hdGljYWxseSB1cGRhdGVkIG9yIGRpc3Bvc2VkIGJ5IHRoZSBtYW5hZ2VyLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVtb3ZlT2JqZWN0XG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gcmVtb3ZlLlxuICAgICMjIyAgICAgICAgXG4gICAgcmVtb3ZlT2JqZWN0OiAob2JqZWN0KSAtPiBAcmVtb3ZlKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGEgZ2FtZSBvYmplY3QgdG8gdGhlIG1hbmFnZXIuIFRoZSBnYW1lIG9iamVjdCBpcyB0aGVuIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBieSB0aGUgbWFuYWdlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIGFkZC5cbiAgICAjIyMgXG4gICAgYWRkOiAob2JqZWN0KSAtPiBcbiAgICAgICAgI0BvYmplY3RzLnNwbGljZSgwLCAwLCBvYmplY3QpXG4gICAgICAgIEBvYmplY3RzLnB1c2gob2JqZWN0KVxuICAgICAgICBAbmVlZHNTb3J0ID0geWVzXG4gICAgICAgIEByZWdpc3Rlck9iamVjdChvYmplY3QpXG4gICAgICAgIEBhZGRUb0dyb3VwKG9iamVjdCwgb2JqZWN0Lmdyb3VwKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIGEgZ2FtZSBvYmplY3QgdG8gdGhlIG1hbmFnZXIuIFRoZSBnYW1lIG9iamVjdCBpcyB0aGVuIG5vIGxvbmdlciBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgb3IgZGlzcG9zZWQgYnkgdGhlIG1hbmFnZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCByZW1vdmVcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byByZW1vdmUuXG4gICAgIyMjIFxuICAgIHJlbW92ZTogKG9iamVjdCkgLT4gXG4gICAgICAgIGlmIG9iamVjdFxuICAgICAgICAgICAgQG9iamVjdHMucmVtb3ZlKG9iamVjdClcbiAgICAgICAgICAgIEB1bnJlZ2lzdGVyT2JqZWN0KG9iamVjdClcbiAgICAgICAgICAgIGlmIG9iamVjdC5ncm91cD9cbiAgICAgICAgICAgICAgICBAb2JqZWN0c0J5R3JvdXBbb2JqZWN0Lmdyb3VwXT8ucmVtb3ZlKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIGFuIG9iamVjdCBieSBJRC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9iamVjdEJ5SWRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBJRCBvZiB0aGUgZ2FtZSBvYmplY3QgdG8gZ2V0LiBcbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9CYXNlfSBUaGUgZ2FtZSBvYmplY3Qgb3IgPGI+bnVsbDwvYj4gaWYgbm8gZ2FtZSBvYmplY3QgaXMgcmVnaXN0ZXJlZCBmb3IgdGhlIHNwZWNpZmllZCBJRC5cbiAgICAjIyMgICAgICAgICBcbiAgICBvYmplY3RCeUlkOiAoaWQpIC0+IEBvYmplY3RzQnlJZFtpZF0/Lmxhc3QoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgYW4gb2JqZWN0IGJ5IElELlxuICAgICpcbiAgICAqIEBtZXRob2QgYnlJZFxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIElEIG9mIHRoZSBnYW1lIG9iamVjdCB0byBnZXQuIFxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X0Jhc2V9IFRoZSBnYW1lIG9iamVjdCBvciA8Yj5udWxsPC9iPiBpZiBubyBnYW1lIG9iamVjdCBpcyByZWdpc3RlcmVkIGZvciB0aGUgc3BlY2lmaWVkIElELlxuICAgICMjIyBcbiAgICBieUlkOiAoaWQpIC0+IEBvYmplY3RzQnlJZFtpZF0/Lmxhc3QoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIG9iamVjdCBmb3IgYW4gSUQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRPYmplY3RCeUlkXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gc2V0LlxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIElEIGZvciB0aGUgZ2FtZSBvYmplY3QuIFxuICAgICMjIyBcbiAgICBzZXRPYmplY3RCeUlkOiAob2JqZWN0LCBpZCkgLT4gXG4gICAgICAgIG9iamVjdC5pZCA9IGlkXG4gICAgICAgIGlmICFAb2JqZWN0c0J5SWRbaWRdXG4gICAgICAgICAgICBAb2JqZWN0c0J5SWRbaWRdID0gW29iamVjdF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdHNCeUlkW2lkXS5wdXNoKG9iamVjdClcbiAgICAgICAgICAgIFxuICAgICAgICB3aW5kb3dbXCIkXCIraWRdID0gb2JqZWN0XG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBhbiBvYmplY3QgdG8gYSBzcGVjaWZpZWQgb2JqZWN0LWdyb3VwLlxuICAgICpcbiAgICAqIEBtZXRob2QgYWRkVG9Hcm91cFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIGFkZC5cbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cCAtIFRoZSBncm91cCB0byBhc3NpZ24gZ2FtZSBvYmplY3QgdG8uIFxuICAgICMjIyBcbiAgICBhZGRUb0dyb3VwOiAob2JqZWN0LCBncm91cCkgLT5cbiAgICAgICAgaWYgZ3JvdXA/XG4gICAgICAgICAgICBAb2JqZWN0c0J5R3JvdXBfW29iamVjdC5ncm91cF0/LnJlbW92ZShvYmplY3QpXG4gICAgICAgICAgICBpZiAhQG9iamVjdHNCeUdyb3VwX1tncm91cF1cbiAgICAgICAgICAgICAgICBAb2JqZWN0c0J5R3JvdXBfW2dyb3VwXSA9IFtdXG4gICAgICAgICAgICBAb2JqZWN0c0J5R3JvdXBfW2dyb3VwXS5wdXNoKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIGFsbCBvYmplY3Qgb2YgYSBzcGVjaWZpZWQgb2JqZWN0LWdyb3VwLlxuICAgICpcbiAgICAqIEBtZXRob2Qgb2JqZWN0c0J5R3JvdXBcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cCAtIFRoZSBvYmplY3QtZ3JvdXAuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfQmFzZVtdfSBUaGUgZ2FtZSBvYmplY3RzIGJlbG9uZ2luZyB0byB0aGUgc3BlY2lmaWVkIGdyb3VwLlxuICAgICMjIyAgICAgICAgIFxuICAgIG9iamVjdHNCeUdyb3VwOiAoZ3JvdXApIC0+IEBvYmplY3RzQnlHcm91cF9bZ3JvdXBdIHx8IFtdXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgbWFuYWdlciBhbmQgYWxsIGFzc2lnbmVkIGdhbWUgb2JqZWN0cyBpbiB0aGUgcmlnaHQgb3JkZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgIFxuICAgIHVwZGF0ZTogLT4gXG4gICAgICAgIGkgPSAwXG4gICAgICAgIFxuICAgICAgICBpZiBAbmVlZHNTb3J0XG4gICAgICAgICAgICBAb2JqZWN0cy5zb3J0IChhLCBiKSAtPlxuICAgICAgICAgICAgICAgIGlmIGEub3JkZXIgPCBiLm9yZGVyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBhLm9yZGVyID4gYi5vcmRlclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICBAbmVlZHNTb3J0ID0gbm9cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgd2hpbGUgaSA8IEBvYmplY3RzLmxlbmd0aFxuICAgICAgICAgICAgb2JqZWN0ID0gQG9iamVjdHNbaV1cbiAgICAgICAgICAgIGlmIG9iamVjdC5kaXNwb3NlZFxuICAgICAgICAgICAgICAgIEByZW1vdmVPYmplY3Qob2JqZWN0KVxuICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICBvYmplY3QudXBkYXRlKCkgaWYgb2JqZWN0LmFjdGl2ZVxuICAgICAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuZ3MuT2JqZWN0TWFuYWdlciA9IE9iamVjdE1hbmFnZXIgI25ldyBPYmplY3RNYW5hZ2VyKCkiXX0=
//# sourceURL=ObjectManager_2.js