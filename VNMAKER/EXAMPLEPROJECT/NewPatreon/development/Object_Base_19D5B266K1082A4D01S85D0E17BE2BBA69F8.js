var Object_Base;

Object_Base = (function() {

  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */
  Object_Base.prototype.onDataBundleRestore = function(data, context) {
    if (this.id) {
      return window["$" + this.id] = this;
    }
  };

  Object_Base.accessors("group", {
    set: function(g) {
      var ref;
      this.group_ = g;
      return (ref = gs.ObjectManager.current) != null ? ref.addToGroup(this, g) : void 0;
    },
    get: function() {
      return this.group_;
    }
  });

  Object_Base.accessors("order", {
    set: function(o) {
      var ref;
      if (o !== this.order_) {
        this.order_ = o;
        return (ref = this.parent) != null ? ref.needsSort = true : void 0;
      }
    },
    get: function() {
      return this.order_;
    }
  });

  Object_Base.accessors("needsUpdate", {
    set: function(v) {
      var parent;
      this.needsUpdate_ = v;
      parent = this.parent;
      while (parent) {
        parent.needsUpdate_ = true;
        parent = parent.parent;
      }
      if (v) {
        return this.requestSubUpdate();
      }
    },
    get: function() {
      return this.needsUpdate_ || SceneManager.scene.preparing;
    }
  });

  Object_Base.prototype.requestSubUpdate = function() {
    var j, len, object, ref;
    ref = this.subObjects;
    for (j = 0, len = ref.length; j < len; j++) {
      object = ref[j];
      if (object) {
        object.needsUpdate_ = true;
        object.requestSubUpdate();
      }
    }
    return null;
  };

  Object_Base.accessors("needsFullUpdate", {
    set: function(v) {
      var j, len, object, ref, results;
      this.needsUpdate = v;
      if (v) {
        ref = this.subObjects;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          object = ref[j];
          results.push(object.needsFullUpdate = v);
        }
        return results;
      }
    },
    get: function() {
      return this.needsUpdate_;
    }
  });


  /**
  * The base class for all game objects. A game object itself doesn't implement
  * any game logic but uses components and sub-objects for that.
  *
  * @module gs
  * @class Object_Base
  * @memberof gs
  * @constructor
   */

  function Object_Base() {

    /**
    * @property subObjects
    * @type gs.Object_Base[]
    * @default []
    * A list of game-objects grouped under this game object.
     */
    var ref;
    this.subObjects = [];

    /**
    * @property components
    * @type gs.Component[]
    * @default []
    * A list of components defining the logic/behavior and appearance of the game object.
     */
    this.components = [];

    /**
    * @property componentsById
    * @type Object
    * @default []
    * All associated components by their ID.
     */
    this.componentsById = {};

    /**
    * @property disposed
    * @type boolean
    * @default false
    * Indicates if the game object id disposed. A disposed game object cannot be used anymore.
     */
    this.disposed = false;

    /**
    * @property active
    * @default true
    * Indicates if the game object is active. An inactive game object will not be updated.
     */
    this.active = true;
    this.input = false;

    /**
    * @property id
    * @type string
    * @default null
    * The game object's UID (Unique ID)
     */
    this.id = null;

    /**
    * @property group
    * @default null
    * @type string
    * The game object's group. To get all object's of a specific group the gs.ObjectManager.objectsByGroup property can be used.
     */
    this.group = null;

    /**
    * @property parent
    * @type gs.Object_Base
    * @default null
    * The parent object if the game object is a sub-object of another game object.
     */
    this.parent = null;

    /**
    * @property order
    * @type number
    * @default 0
    * Controls the update-order. The smaller the value the earlier the game object is updated before other game objects are updated.
     */
    this.order = 0;

    /**
    * @property rIndex
    * @type number
    * @default 0
    * Holds the render-index if the game object has a graphical representation on screen. The render-index is the
    * index of the game object's graphic-object(gs.GraphicObject) in the current list of graphic-objects. The render-index
    * is read-only. Setting the render-index to a certain value has no effect.
     */
    this.rIndex = 0;

    /**
    * @property needsSort
    * @type boolean
    * @default true
    * Indicates if the list of sub-objects needs to be sorted by order because of a change.
     */
    this.needsSort = true;

    /**
    * @property needsSort
    * @type boolean
    * @default true
    * Indicates if the UI object needs to be updated.
     */
    this.needsUpdate = true;

    /**
    * @property initialized
    * @type boolean
    * @default true
    * Indicates if the game object and its components have been initialized.
     */
    this.initialized = false;
    if ((ref = gs.ObjectManager.current) != null) {
      ref.registerObject(this);
    }
  }


  /**
  * Disposes the object with all its components and sub-objects. A disposed object will be
  * removed from the parent automatically.
  *
  * @method dispose
   */

  Object_Base.prototype.dispose = function() {
    var ref;
    if (!this.disposed) {
      this.disposed = true;
      this.disposeComponents();
      this.disposeObjects();
      if ((ref = gs.ObjectManager.current) != null) {
        ref.unregisterObject(this);
      }
    }
    return null;
  };


  /**
  * Disposes all sub-objects.
  *
  * @method disposeObjects
  * @protected
   */

  Object_Base.prototype.disposeObjects = function() {
    var j, len, ref, results, subObject;
    ref = this.subObjects;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      subObject = ref[j];
      results.push(subObject != null ? typeof subObject.dispose === "function" ? subObject.dispose() : void 0 : void 0);
    }
    return results;
  };


  /**
  * Disposes all components
  *
  * @method disposeComponents
  * @protected
   */

  Object_Base.prototype.disposeComponents = function() {
    var component, j, len, ref, results;
    ref = this.components;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      results.push(component != null ? typeof component.dispose === "function" ? component.dispose() : void 0 : void 0);
    }
    return results;
  };


  /**
  * Calls setup-routine on all components.
  *
  * @method setup
   */

  Object_Base.prototype.setup = function() {
    var component, j, len, ref;
    ref = this.components;
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      if (!(component != null ? component.isSetup : void 0)) {
        component.setup();
      }
    }
    this.initialized = true;
    return null;
  };


  /**
  * Deserializes components from a data-bundle object.
  * 
  * @method componentsFromDataBundle
  * @param {Object} data The data-bundle object.
   */

  Object_Base.prototype.componentsFromDataBundle = function(data) {
    var component, componentObject, j, len, ref;
    if (data != null ? data.components : void 0) {
      ref = data.components;
      for (j = 0, len = ref.length; j < len; j++) {
        component = ref[j];
        componentObject = new gs[component.className](component);
        this.addComponent(componentObject);
      }
      delete data.components;
    }
    return null;
  };


  /**
  * Serializes components of a specified type to a data-bundle. A component
  * needs to implement the toDataBundle method for correct serialization.
  *
  * @method componentsToDataBundle
  * @param {String} type - A component class name.
  * @return A data bundle.
   */

  Object_Base.prototype.componentsToDataBundle = function(type) {
    var bundle, component, components, j, len, ref;
    components = [];
    ref = this.components;
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      if (component instanceof type) {
        if (component.toDataBundle == null) {
          continue;
        }
        bundle = component.toDataBundle();
        bundle.className = component.constructor.name;
        components.push(bundle);
      }
    }
    return components;
  };


  /**
  * Starts a full-refresh on all sub-objects
  *
  * @method fullRefresh
   */

  Object_Base.prototype.fullRefresh = function() {
    var j, len, object, ref;
    ref = this.subObjects;
    for (j = 0, len = ref.length; j < len; j++) {
      object = ref[j];
      if (object) {
        object.needsUpdate = true;
        object.fullRefresh();
      }
    }
    return null;
  };


  /**
  * Updates the object with all parent- and sub-objects. 
  *
  * @method fullUpdate
   */

  Object_Base.prototype.fullUpdate = function() {
    var j, len, object, parent, ref, results;
    parent = this;
    while (parent !== null) {
      parent.update();
      parent = parent.parent;
    }
    ref = this.subObjects;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      object = ref[j];
      results.push(object != null ? object.update() : void 0);
    }
    return results;
  };


  /**
  * Updates the object and all its components. This method is
  * called automatically by the parent or ObjectManager so in regular it is 
  * not necessary to call it manually.
  *
  * @method update
   */

  Object_Base.prototype.update = function() {
    var component, i;
    if (!this.active) {
      return;
    }
    i = 0;
    while (i < this.components.length) {
      component = this.components[i];
      if (!component.disposed) {
        component.update();
        i++;
      } else {
        this.components.splice(i, 1);
      }
    }
    if (this.input) {
      Input.clear();
    }
    this.input = false;
    return null;
  };


  /**
  * Searches for the first component with the specified class name.
  *
  * @method findComponent
  * @param {String} name The class name of the component.
  * @return {Component} The component or null if a component with the specified class name cannot be found.
   */

  Object_Base.prototype.findComponent = function(name) {
    return this.components.first(function(v) {
      return v.constructor.name === name;
    });
  };


  /**
  * Searches for all components with the specified class name.
  *
  * @method findComponents
  * @param {String} name The class name of the components.
  * @return {Array} The components or null if no component with the specified class name has been found.
   */

  Object_Base.prototype.findComponents = function(name) {
    return this.components.where(function(v) {
      return v.constructor.name === name;
    });
  };


  /**
  * Searches for the component with the specified ID.
  *
  * @method findComponentById
  * @param {String} id The unique identifier of the component.
  * @return {Component} The component or null if a component with the specified ID cannot be found.
   */

  Object_Base.prototype.findComponentById = function(id) {
    return this.componentsById[id];
  };


  /**
  * Adds an object to the list of sub-objects.
  *
  * @method addObject
  * @param {Object_Base} object The object which should be added.
   */

  Object_Base.prototype.addObject = function(object) {
    var ref, ref1;
    if ((ref = gs.ObjectManager.current) != null) {
      ref.remove(object);
    }
    if ((ref1 = object.parent) != null) {
      ref1.removeObject(object);
    }
    object.parent = this;
    this.subObjects.push(object);
    this.needsSort = true;
    this.needsUpdate = true;
    if (object.id != null) {
      return gs.ObjectManager.current.setObjectById(object, object.id);
    }
  };


  /**
  * Inserts an object into the list of sub-objects at the specified index.
  *
  * @method insertObject
  * @param {Object_Base} object The object which should be inserted.
  * @param {Number} index The index.
   */

  Object_Base.prototype.insertObject = function(object, index) {
    var ref;
    gs.ObjectManager.current.remove(object);
    if ((ref = object.parent) != null) {
      ref.removeObject(object);
    }
    object.parent = this;
    this.subObjects.splice(index, 0, object);
    if (object.id != null) {
      return gs.ObjectManager.current.setObjectById(object, object.id);
    }
  };


  /**
  * Sets sub-object at the specified index.
  *
  * @method setObject
  * @param {Object_Base} object The object.
  * @param {Number} index The index.
   */

  Object_Base.prototype.setObject = function(object, index) {
    var ref;
    if (object) {
      gs.ObjectManager.current.remove(object);
      if ((ref = object.parent) != null) {
        ref.removeObject(object);
      }
      object.parent = this;
    }
    this.subObjects[index] = object;
    if ((object != null ? object.id : void 0) != null) {
      return gs.ObjectManager.current.setObjectById(object, object.id);
    }
  };


  /**
  * Removes the specified object from the list of sub-objects.
  *
  * @method removeObject
  * @param {Object_Base} object The object which should be removed.
   */

  Object_Base.prototype.removeObject = function(object) {
    this.subObjects.remove(object);
    object.parent = null;
    return this.needsUpdate = true;
  };


  /**
  * Erases the object at the specified index. The list size
  * will not be changed but the the value at the index will be set to null.
  *
  * @method eraseObject
  * @param {Number} object The object which should be erased.
   */

  Object_Base.prototype.eraseObject = function(index) {
    var object;
    object = this.subObjects[index];
    if (object != null) {
      object.parent = null;
    }
    return this.subObjects[index] = null;
  };


  /**
  * Adds the specified component to the object.
  *
  * @method addComponent
  * @param {Component} component The component
  * @param {String} id An optional unique identifier for the component.
   */

  Object_Base.prototype.addComponent = function(component, id) {
    if (!this.components.contains(component)) {
      component.object = this;
      this.components.push(component);
      if (id != null) {
        return this.componentsById[id] = component;
      }
    }
  };


  /**
  * Inserts a component at the specified index.
  *
  * @method insertComponent
  * @param {Component} component The component.
  * @param {Number} index The index.
  * @param {String} id An optional unique identifier for the component.
   */

  Object_Base.prototype.insertComponent = function(component, index, id) {
    this.components.remove(component);
    component.object = this;
    this.components.splice(index, 0, component);
    if (id != null) {
      return this.componentsById[id] = component;
    }
  };


  /**
  * Removes a component from the object.
  *
  * @method removeComponent
  * @param {Component} component The component to remove.
   */

  Object_Base.prototype.removeComponent = function(component) {
    this.components.remove(component);
    if (typeof id !== "undefined" && id !== null) {
      return delete this.componentsById[id];
    }
  };

  return Object_Base;

})();

gs.Object_Base = Object_Base;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O3dCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7SUFDakIsSUFBRyxJQUFDLENBQUEsRUFBSjthQUNJLE1BQU8sQ0FBQSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQUwsQ0FBUCxHQUFrQixLQUR0Qjs7RUFEaUI7O0VBV3JCLFdBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtBQUNELFVBQUE7TUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVOzJEQUNjLENBQUUsVUFBMUIsQ0FBcUMsSUFBckMsRUFBMkMsQ0FBM0M7SUFGQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBY0EsV0FBQyxDQUFBLFNBQUQsQ0FBVyxPQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO0FBQ0QsVUFBQTtNQUFBLElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxNQUFUO1FBQ0ksSUFBQyxDQUFBLE1BQUQsR0FBVTtnREFDSCxDQUFFLFNBQVQsR0FBcUIsY0FGekI7O0lBREMsQ0FBTDtJQUlBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FKTDtHQURKOztFQWVBLFdBQUMsQ0FBQSxTQUFELENBQVcsYUFBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtBQUNELFVBQUE7TUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUVoQixNQUFBLEdBQVMsSUFBQyxDQUFBO0FBQ1YsYUFBTSxNQUFOO1FBQ0ksTUFBTSxDQUFDLFlBQVAsR0FBc0I7UUFDdEIsTUFBQSxHQUFTLE1BQU0sQ0FBQztNQUZwQjtNQVNBLElBQUcsQ0FBSDtlQUNJLElBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBREo7O0lBYkMs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QUMsQ0FBQSxVQUFXLENBQUEsS0FBQTs7TUFDckIsTUFBTSxDQUFFLE1BQVIsR0FBaUI7O1dBQ2pCLElBQUMsQ0FBQSxVQUFXLENBQUEsS0FBQSxDQUFaLEdBQXFCO0VBSFo7OztBQUtiOzs7Ozs7Ozt3QkFPQSxZQUFBLEdBQWMsU0FBQyxTQUFELEVBQVksRUFBWjtJQUNWLElBQUcsQ0FBSSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsU0FBckIsQ0FBUDtNQUNJLFNBQVMsQ0FBQyxNQUFWLEdBQW1CO01BQ25CLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixTQUFqQjtNQUNBLElBQUcsVUFBSDtlQUNJLElBQUMsQ0FBQSxjQUFlLENBQUEsRUFBQSxDQUFoQixHQUFzQixVQUQxQjtPQUhKOztFQURVOzs7QUFNZDs7Ozs7Ozs7O3dCQVFBLGVBQUEsR0FBaUIsU0FBQyxTQUFELEVBQVksS0FBWixFQUFtQixFQUFuQjtJQUNiLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixTQUFuQjtJQUNBLFNBQVMsQ0FBQyxNQUFWLEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixLQUFuQixFQUEwQixDQUExQixFQUE2QixTQUE3QjtJQUNBLElBQUcsVUFBSDthQUNJLElBQUMsQ0FBQSxjQUFlLENBQUEsRUFBQSxDQUFoQixHQUFzQixVQUQxQjs7RUFKYTs7O0FBT2pCOzs7Ozs7O3dCQU1BLGVBQUEsR0FBaUIsU0FBQyxTQUFEO0lBQ2IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQW1CLFNBQW5CO0lBQ0EsSUFBRyx3Q0FBSDthQUNJLE9BQU8sSUFBQyxDQUFBLGNBQWUsQ0FBQSxFQUFBLEVBRDNCOztFQUZhOzs7Ozs7QUFLckIsRUFBRSxDQUFDLFdBQUgsR0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IE9iamVjdF9CYXNlXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBPYmplY3RfQmFzZVxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICogXG4gICAgKiBAbWV0aG9kIG9uRGF0YUJ1bmRsZVJlc3RvcmUuXG4gICAgKiBAcGFyYW0gT2JqZWN0IGRhdGEgLSBUaGUgZGF0YS1idW5kbGVcbiAgICAqIEBwYXJhbSBncy5PYmplY3RDb2RlY0NvbnRleHQgY29udGV4dCAtIFRoZSBjb2RlYy1jb250ZXh0LlxuICAgICMjI1xuICAgIG9uRGF0YUJ1bmRsZVJlc3RvcmU6IChkYXRhLCBjb250ZXh0KSAtPlxuICAgICAgICBpZiBAaWRcbiAgICAgICAgICAgIHdpbmRvd1tcIiRcIitAaWRdID0gdGhpc1xuICAgICAgICAgICAgXG4gICAgXG4gICAgI1xuICAgICMgR2V0cyBvciBzZXRzIHRoZSBncm91cCB0aGUgb2JqZWN0IGJlbG9uZ3MgdG8uXG4gICAgI1xuICAgICMgQHByb3BlcnR5IGdyb3VwXG4gICAgIyBAdHlwZSBzdHJpbmdcbiAgICAjXG4gICAgQGFjY2Vzc29ycyBcImdyb3VwXCIsIFxuICAgICAgICBzZXQ6IChnKSAtPiBcbiAgICAgICAgICAgIEBncm91cF8gPSBnXG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQ/LmFkZFRvR3JvdXAodGhpcywgZylcbiAgICAgICAgICAgIFxuICAgICAgICBnZXQ6IC0+IEBncm91cF9cbiAgICAgICAgXG4gICAgI1xuICAgICMgR2V0cyBvciBzZXRzIHRoZSBvcmRlci1pbmRleCBvZiB0aGUgb2JqZWN0LiBUaGUgbG93ZXIgdGhlIGluZGV4LCB0aGVcbiAgICAjIGVhcmxpZXIgdGhlIG9iamVjdCB3aWxsIGJlIHVwZGF0ZWQgaW4gYSBsaXN0IG9mIHN1Yi1vYmplY3RzLlxuICAgICNcbiAgICAjIEBwcm9wZXJ0eSBvcmRlclxuICAgICMgQHR5cGUgbnVtYmVyXG4gICAgI1xuICAgIEBhY2Nlc3NvcnMgXCJvcmRlclwiLFxuICAgICAgICBzZXQ6IChvKSAtPlxuICAgICAgICAgICAgaWYgbyAhPSBAb3JkZXJfXG4gICAgICAgICAgICAgICAgQG9yZGVyXyA9IG9cbiAgICAgICAgICAgICAgICBAcGFyZW50Py5uZWVkc1NvcnQgPSB0cnVlXG4gICAgICAgIGdldDogLT4gQG9yZGVyX1xuICAgICAgICBcbiAgICAjXG4gICAgIyBHZXRzIG9yIHNldHMgaWYgYW4gb2JqZWN0cyBuZWVkcyBhbiB1cGRhdGUuIElmIHRydWUsIHRoZSBwYXJlbnQgd2lsbCB1cGRhdGVcbiAgICAjIHRoZSBvYmplY3QgaW4gdGhlIG5leHQgdXBkYXRlIGFuZCByZXNldHMgdGhlIG5lZWRzVXBkYXRlIHByb3BlcnR5IGJhY2tcbiAgICAjIHRvIGZhbHNlLlxuICAgICNcbiAgICAjIEBwcm9wZXJ0eSBuZWVkc1VwZGF0ZVxuICAgICMgQHR5cGUgYm9vbGVhblxuICAgICNcbiAgICBAYWNjZXNzb3JzIFwibmVlZHNVcGRhdGVcIiwgXG4gICAgICAgIHNldDogKHYpIC0+XG4gICAgICAgICAgICBAbmVlZHNVcGRhdGVfID0gdlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJlbnQgPSBAcGFyZW50XG4gICAgICAgICAgICB3aGlsZSBwYXJlbnRcbiAgICAgICAgICAgICAgICBwYXJlbnQubmVlZHNVcGRhdGVfID0geWVzXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgI2lmIHZcbiAgICAgICAgICAgICMgICAgQHBhcmVudD8ubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICNpZiB2XG4gICAgICAgICAgICAjICAgIGZvciBvYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgICMgICAgICAgIG9iamVjdC5uZWVkc1VwZGF0ZV8gPSB2XG4gICAgICAgICAgICBpZiB2XG4gICAgICAgICAgICAgICAgQHJlcXVlc3RTdWJVcGRhdGUoKVxuICAgICAgICBnZXQ6IC0+IHJldHVybiBAbmVlZHNVcGRhdGVfIHx8IFNjZW5lTWFuYWdlci5zY2VuZS5wcmVwYXJpbmdcbiAgICAgICAgXG4gICAgcmVxdWVzdFN1YlVwZGF0ZTogLT5cbiAgICAgICAgZm9yIG9iamVjdCBpbiBAc3ViT2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0XG4gICAgICAgICAgICAgICAgb2JqZWN0Lm5lZWRzVXBkYXRlXyA9IHllc1xuICAgICAgICAgICAgICAgIG9iamVjdC5yZXF1ZXN0U3ViVXBkYXRlKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAjXG4gICAgIyBHZXRzIG9yIHNldHMgaWYgYW4gb2JqZWN0IG5lZWRzIGEgZnVsbCB1cGRhdGUuIEEgZnVsbCB1cGRhdGUgdHJpZ2dlcnNcbiAgICAjIGFuIHVwZGF0ZSBmb3IgYWxsIHN1Yi1vYmplY3RzIHJlY3Vyc2l2ZWx5LiBcbiAgICAjXG4gICAgIyBAcHJvcGVydHkgbmVlZHNGdWxsVXBkYXRlXG4gICAgIyBAdHlwZSBib29sZWFuXG4gICAgI1xuICAgIEBhY2Nlc3NvcnMgXCJuZWVkc0Z1bGxVcGRhdGVcIiwgXG4gICAgICAgIHNldDogKHYpIC0+XG4gICAgICAgICAgICBAbmVlZHNVcGRhdGUgPSB2XG4gICAgICAgICAgICBpZiB2XG4gICAgICAgICAgICAgICAgZm9yIG9iamVjdCBpbiBAc3ViT2JqZWN0c1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QubmVlZHNGdWxsVXBkYXRlID0gdlxuICAgICAgICBnZXQ6IC0+IEBuZWVkc1VwZGF0ZV9cbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFRoZSBiYXNlIGNsYXNzIGZvciBhbGwgZ2FtZSBvYmplY3RzLiBBIGdhbWUgb2JqZWN0IGl0c2VsZiBkb2Vzbid0IGltcGxlbWVudFxuICAgICogYW55IGdhbWUgbG9naWMgYnV0IHVzZXMgY29tcG9uZW50cyBhbmQgc3ViLW9iamVjdHMgZm9yIHRoYXQuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9CYXNlXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHN1Yk9iamVjdHNcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfQmFzZVtdXG4gICAgICAgICogQGRlZmF1bHQgW11cbiAgICAgICAgKiBBIGxpc3Qgb2YgZ2FtZS1vYmplY3RzIGdyb3VwZWQgdW5kZXIgdGhpcyBnYW1lIG9iamVjdC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdWJPYmplY3RzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudFtdXG4gICAgICAgICogQGRlZmF1bHQgW11cbiAgICAgICAgKiBBIGxpc3Qgb2YgY29tcG9uZW50cyBkZWZpbmluZyB0aGUgbG9naWMvYmVoYXZpb3IgYW5kIGFwcGVhcmFuY2Ugb2YgdGhlIGdhbWUgb2JqZWN0LlxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbXBvbmVudHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBjb21wb25lbnRzQnlJZFxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICAgICogQWxsIGFzc29jaWF0ZWQgY29tcG9uZW50cyBieSB0aGVpciBJRC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBjb21wb25lbnRzQnlJZCA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGRpc3Bvc2VkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBnYW1lIG9iamVjdCBpZCBkaXNwb3NlZC4gQSBkaXNwb3NlZCBnYW1lIG9iamVjdCBjYW5ub3QgYmUgdXNlZCBhbnltb3JlLlxuICAgICAgICAjIyNcbiAgICAgICAgQGRpc3Bvc2VkID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgYWN0aXZlXG4gICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgZ2FtZSBvYmplY3QgaXMgYWN0aXZlLiBBbiBpbmFjdGl2ZSBnYW1lIG9iamVjdCB3aWxsIG5vdCBiZSB1cGRhdGVkLlxuICAgICAgICAjIyNcbiAgICAgICAgQGFjdGl2ZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgQGlucHV0ID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgaWRcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICogVGhlIGdhbWUgb2JqZWN0J3MgVUlEIChVbmlxdWUgSUQpXG4gICAgICAgICMjI1xuICAgICAgICBAaWQgPSBudWxsIFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBncm91cFxuICAgICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgKiBUaGUgZ2FtZSBvYmplY3QncyBncm91cC4gVG8gZ2V0IGFsbCBvYmplY3QncyBvZiBhIHNwZWNpZmljIGdyb3VwIHRoZSBncy5PYmplY3RNYW5hZ2VyLm9iamVjdHNCeUdyb3VwIHByb3BlcnR5IGNhbiBiZSB1c2VkLlxuICAgICAgICAjIyNcbiAgICAgICAgQGdyb3VwID0gbnVsbCBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgcGFyZW50XG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X0Jhc2VcbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICogVGhlIHBhcmVudCBvYmplY3QgaWYgdGhlIGdhbWUgb2JqZWN0IGlzIGEgc3ViLW9iamVjdCBvZiBhbm90aGVyIGdhbWUgb2JqZWN0LlxuICAgICAgICAjIyNcbiAgICAgICAgQHBhcmVudCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgb3JkZXJcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICogQ29udHJvbHMgdGhlIHVwZGF0ZS1vcmRlci4gVGhlIHNtYWxsZXIgdGhlIHZhbHVlIHRoZSBlYXJsaWVyIHRoZSBnYW1lIG9iamVjdCBpcyB1cGRhdGVkIGJlZm9yZSBvdGhlciBnYW1lIG9iamVjdHMgYXJlIHVwZGF0ZWQuXG4gICAgICAgICMjI1xuICAgICAgICBAb3JkZXIgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHJJbmRleFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgKiBIb2xkcyB0aGUgcmVuZGVyLWluZGV4IGlmIHRoZSBnYW1lIG9iamVjdCBoYXMgYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb24gc2NyZWVuLiBUaGUgcmVuZGVyLWluZGV4IGlzIHRoZVxuICAgICAgICAqIGluZGV4IG9mIHRoZSBnYW1lIG9iamVjdCdzIGdyYXBoaWMtb2JqZWN0KGdzLkdyYXBoaWNPYmplY3QpIGluIHRoZSBjdXJyZW50IGxpc3Qgb2YgZ3JhcGhpYy1vYmplY3RzLiBUaGUgcmVuZGVyLWluZGV4XG4gICAgICAgICogaXMgcmVhZC1vbmx5LiBTZXR0aW5nIHRoZSByZW5kZXItaW5kZXggdG8gYSBjZXJ0YWluIHZhbHVlIGhhcyBubyBlZmZlY3QuXG4gICAgICAgICMjI1xuICAgICAgICBAckluZGV4ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBuZWVkc1NvcnRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgbGlzdCBvZiBzdWItb2JqZWN0cyBuZWVkcyB0byBiZSBzb3J0ZWQgYnkgb3JkZXIgYmVjYXVzZSBvZiBhIGNoYW5nZS5cbiAgICAgICAgIyMjXG4gICAgICAgIEBuZWVkc1NvcnQgPSB5ZXNcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgbmVlZHNTb3J0XG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIFVJIG9iamVjdCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICAgICAgICAjIyNcbiAgICAgICAgQG5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGluaXRpYWxpemVkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGdhbWUgb2JqZWN0IGFuZCBpdHMgY29tcG9uZW50cyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAgICAgICMjI1xuICAgICAgICBAaW5pdGlhbGl6ZWQgPSBub1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudD8ucmVnaXN0ZXJPYmplY3QodGhpcylcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIG9iamVjdCB3aXRoIGFsbCBpdHMgY29tcG9uZW50cyBhbmQgc3ViLW9iamVjdHMuIEEgZGlzcG9zZWQgb2JqZWN0IHdpbGwgYmVcbiAgICAqIHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IGF1dG9tYXRpY2FsbHkuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgaWYgbm90IEBkaXNwb3NlZFxuICAgICAgICAgICAgQGRpc3Bvc2VkID0geWVzXG4gICAgICAgICAgICBAZGlzcG9zZUNvbXBvbmVudHMoKVxuICAgICAgICAgICAgQGRpc3Bvc2VPYmplY3RzKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudD8udW5yZWdpc3Rlck9iamVjdCh0aGlzKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgYWxsIHN1Yi1vYmplY3RzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZU9iamVjdHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBkaXNwb3NlT2JqZWN0czogLT5cbiAgICAgICAgZm9yIHN1Yk9iamVjdCBpbiBAc3ViT2JqZWN0c1xuICAgICAgICAgICAgc3ViT2JqZWN0Py5kaXNwb3NlPygpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyBhbGwgY29tcG9uZW50c1xuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZUNvbXBvbmVudHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBkaXNwb3NlQ29tcG9uZW50czogLT5cbiAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBAY29tcG9uZW50c1xuICAgICAgICAgICAgY29tcG9uZW50Py5kaXNwb3NlPygpXG4gICAgICAgXG4gICAgIyMjKlxuICAgICogQ2FsbHMgc2V0dXAtcm91dGluZSBvbiBhbGwgY29tcG9uZW50cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIGZvciBjb21wb25lbnQgaW4gQGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudC5zZXR1cCgpIGlmIG5vdCBjb21wb25lbnQ/LmlzU2V0dXBcbiAgICAgICAgICAgIFxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSB5ZXNcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGVzZXJpYWxpemVzIGNvbXBvbmVudHMgZnJvbSBhIGRhdGEtYnVuZGxlIG9iamVjdC5cbiAgICAqIFxuICAgICogQG1ldGhvZCBjb21wb25lbnRzRnJvbURhdGFCdW5kbGVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBkYXRhLWJ1bmRsZSBvYmplY3QuXG4gICAgIyMjXG4gICAgY29tcG9uZW50c0Zyb21EYXRhQnVuZGxlOiAoZGF0YSkgLT5cbiAgICAgICAgaWYgZGF0YT8uY29tcG9uZW50c1xuICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBkYXRhLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBjb21wb25lbnRPYmplY3QgPSBuZXcgZ3NbY29tcG9uZW50LmNsYXNzTmFtZV0oY29tcG9uZW50KVxuICAgICAgICAgICAgICAgIEBhZGRDb21wb25lbnQoY29tcG9uZW50T2JqZWN0KVxuICAgICAgICAgICAgZGVsZXRlIGRhdGEuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIGNvbXBvbmVudHMgb2YgYSBzcGVjaWZpZWQgdHlwZSB0byBhIGRhdGEtYnVuZGxlLiBBIGNvbXBvbmVudFxuICAgICogbmVlZHMgdG8gaW1wbGVtZW50IHRoZSB0b0RhdGFCdW5kbGUgbWV0aG9kIGZvciBjb3JyZWN0IHNlcmlhbGl6YXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBjb21wb25lbnRzVG9EYXRhQnVuZGxlXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgY29tcG9uZW50IGNsYXNzIG5hbWUuXG4gICAgKiBAcmV0dXJuIEEgZGF0YSBidW5kbGUuXG4gICAgIyMjXG4gICAgY29tcG9uZW50c1RvRGF0YUJ1bmRsZTogKHR5cGUpIC0+XG4gICAgICAgIGNvbXBvbmVudHMgPSBbXVxuICAgICAgICBmb3IgY29tcG9uZW50IGluIEBjb21wb25lbnRzXG4gICAgICAgICAgICBpZiBjb21wb25lbnQgaW5zdGFuY2VvZiB0eXBlXG4gICAgICAgICAgICAgICAgY29udGludWUgdW5sZXNzIGNvbXBvbmVudC50b0RhdGFCdW5kbGU/XG4gICAgICAgICAgICAgICAgYnVuZGxlID0gY29tcG9uZW50LnRvRGF0YUJ1bmRsZSgpXG4gICAgICAgICAgICAgICAgYnVuZGxlLmNsYXNzTmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5wdXNoKGJ1bmRsZSlcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHNcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIGEgZnVsbC1yZWZyZXNoIG9uIGFsbCBzdWItb2JqZWN0c1xuICAgICpcbiAgICAqIEBtZXRob2QgZnVsbFJlZnJlc2hcbiAgICAjIyNcbiAgICBmdWxsUmVmcmVzaDogLT5cbiAgICAgICAgZm9yIG9iamVjdCBpbiBAc3ViT2JqZWN0c1xuICAgICAgICAgICAgaWYgb2JqZWN0XG4gICAgICAgICAgICAgICAgb2JqZWN0Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgICAgICAgICAgb2JqZWN0LmZ1bGxSZWZyZXNoKClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG9iamVjdCB3aXRoIGFsbCBwYXJlbnQtIGFuZCBzdWItb2JqZWN0cy4gXG4gICAgKlxuICAgICogQG1ldGhvZCBmdWxsVXBkYXRlXG4gICAgIyMjXG4gICAgZnVsbFVwZGF0ZTogLT5cbiAgICAgICAgcGFyZW50ID0gdGhpc1xuICAgICAgICB3aGlsZSBwYXJlbnQgIT0gbnVsbFxuICAgICAgICAgICAgcGFyZW50LnVwZGF0ZSgpXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50XG4gICAgICAgICAgICBcbiAgICAgICAgZm9yIG9iamVjdCBpbiBAc3ViT2JqZWN0c1xuICAgICAgICAgICAgb2JqZWN0Py51cGRhdGUoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBvYmplY3QgYW5kIGFsbCBpdHMgY29tcG9uZW50cy4gVGhpcyBtZXRob2QgaXNcbiAgICAqIGNhbGxlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBwYXJlbnQgb3IgT2JqZWN0TWFuYWdlciBzbyBpbiByZWd1bGFyIGl0IGlzIFxuICAgICogbm90IG5lY2Vzc2FyeSB0byBjYWxsIGl0IG1hbnVhbGx5LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICByZXR1cm4gaWYgIUBhY3RpdmVcbiAgICAgICAgaSA9IDBcbiAgICAgICAgd2hpbGUgaSA8IEBjb21wb25lbnRzLmxlbmd0aFxuICAgICAgICAgICAgY29tcG9uZW50ID0gQGNvbXBvbmVudHNbaV1cbiAgICAgICAgICAgIGlmICFjb21wb25lbnQuZGlzcG9zZWRcbiAgICAgICAgICAgICAgICBjb21wb25lbnQudXBkYXRlKClcbiAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAY29tcG9uZW50cy5zcGxpY2UoaSwgMSlcblxuXG4gICAgICAgIGlmIEBpbnB1dCB0aGVuIElucHV0LmNsZWFyKClcbiAgICAgICAgQGlucHV0ID0gbm9cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZWFyY2hlcyBmb3IgdGhlIGZpcnN0IGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgY2xhc3MgbmFtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGZpbmRDb21wb25lbnRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnQuXG4gICAgKiBAcmV0dXJuIHtDb21wb25lbnR9IFRoZSBjb21wb25lbnQgb3IgbnVsbCBpZiBhIGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgY2xhc3MgbmFtZSBjYW5ub3QgYmUgZm91bmQuXG4gICAgIyMjXG4gICAgZmluZENvbXBvbmVudDogKG5hbWUpIC0+IEBjb21wb25lbnRzLmZpcnN0ICh2KSAtPiB2LmNvbnN0cnVjdG9yLm5hbWUgPT0gbmFtZVxuICAgIFxuICAgICMjIypcbiAgICAqIFNlYXJjaGVzIGZvciBhbGwgY29tcG9uZW50cyB3aXRoIHRoZSBzcGVjaWZpZWQgY2xhc3MgbmFtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGZpbmRDb21wb25lbnRzXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50cy5cbiAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgY29tcG9uZW50cyBvciBudWxsIGlmIG5vIGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgY2xhc3MgbmFtZSBoYXMgYmVlbiBmb3VuZC5cbiAgICAjIyNcbiAgICBmaW5kQ29tcG9uZW50czogKG5hbWUpIC0+IEBjb21wb25lbnRzLndoZXJlICh2KSAtPiB2LmNvbnN0cnVjdG9yLm5hbWUgPT0gbmFtZVxuICAgIFxuICAgICMjIypcbiAgICAqIFNlYXJjaGVzIGZvciB0aGUgY29tcG9uZW50IHdpdGggdGhlIHNwZWNpZmllZCBJRC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGZpbmRDb21wb25lbnRCeUlkXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBjb21wb25lbnQuXG4gICAgKiBAcmV0dXJuIHtDb21wb25lbnR9IFRoZSBjb21wb25lbnQgb3IgbnVsbCBpZiBhIGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgSUQgY2Fubm90IGJlIGZvdW5kLlxuICAgICMjI1xuICAgIGZpbmRDb21wb25lbnRCeUlkOiAoaWQpIC0+IEBjb21wb25lbnRzQnlJZFtpZF1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGFuIG9iamVjdCB0byB0aGUgbGlzdCBvZiBzdWItb2JqZWN0cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZE9iamVjdFxuICAgICogQHBhcmFtIHtPYmplY3RfQmFzZX0gb2JqZWN0IFRoZSBvYmplY3Qgd2hpY2ggc2hvdWxkIGJlIGFkZGVkLlxuICAgICMjI1xuICAgIGFkZE9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Py5yZW1vdmUob2JqZWN0KVxuICAgICAgICBvYmplY3QucGFyZW50Py5yZW1vdmVPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3QucGFyZW50ID0gdGhpc1xuICAgICAgICBAc3ViT2JqZWN0cy5wdXNoKG9iamVjdClcbiAgICAgICAgQG5lZWRzU29ydCA9IHllc1xuICAgICAgICBAbmVlZHNVcGRhdGUgPSB5ZXNcbiAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlkP1xuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50LnNldE9iamVjdEJ5SWQob2JqZWN0LCBvYmplY3QuaWQpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEluc2VydHMgYW4gb2JqZWN0IGludG8gdGhlIGxpc3Qgb2Ygc3ViLW9iamVjdHMgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGluc2VydE9iamVjdFxuICAgICogQHBhcmFtIHtPYmplY3RfQmFzZX0gb2JqZWN0IFRoZSBvYmplY3Qgd2hpY2ggc2hvdWxkIGJlIGluc2VydGVkLlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleC5cbiAgICAjIyNcbiAgICBpbnNlcnRPYmplY3Q6KG9iamVjdCwgaW5kZXgpIC0+XG4gICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5yZW1vdmUob2JqZWN0KVxuICAgICAgICBvYmplY3QucGFyZW50Py5yZW1vdmVPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3QucGFyZW50ID0gdGhpc1xuICAgICAgICBAc3ViT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIG9iamVjdClcbiAgICAgIFxuICAgICAgICBpZiBvYmplY3QuaWQ/XG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQuc2V0T2JqZWN0QnlJZChvYmplY3QsIG9iamVjdC5pZClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgc3ViLW9iamVjdCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0T2JqZWN0XG4gICAgKiBAcGFyYW0ge09iamVjdF9CYXNlfSBvYmplY3QgVGhlIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXguXG4gICAgIyMjXG4gICAgc2V0T2JqZWN0OiAob2JqZWN0LCBpbmRleCkgLT5cbiAgICAgICAgaWYgb2JqZWN0XG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQucmVtb3ZlKG9iamVjdClcbiAgICAgICAgICAgIG9iamVjdC5wYXJlbnQ/LnJlbW92ZU9iamVjdChvYmplY3QpXG4gICAgICAgICAgICBvYmplY3QucGFyZW50ID0gdGhpc1xuICAgICAgICAgICAgXG4gICAgICAgIEBzdWJPYmplY3RzW2luZGV4XSA9IG9iamVjdFxuICAgICAgXG4gICAgICAgIGlmIG9iamVjdD8uaWQ/XG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQuc2V0T2JqZWN0QnlJZChvYmplY3QsIG9iamVjdC5pZClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGZyb20gdGhlIGxpc3Qgb2Ygc3ViLW9iamVjdHMuXG4gICAgKlxuICAgICogQG1ldGhvZCByZW1vdmVPYmplY3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0X0Jhc2V9IG9iamVjdCBUaGUgb2JqZWN0IHdoaWNoIHNob3VsZCBiZSByZW1vdmVkLlxuICAgICMjI1xuICAgIHJlbW92ZU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgQHN1Yk9iamVjdHMucmVtb3ZlKG9iamVjdClcbiAgICAgICAgb2JqZWN0LnBhcmVudCA9IG51bGxcbiAgICAgICAgQG5lZWRzVXBkYXRlID0geWVzXG4gICAgXG4gICAgIyMjKlxuICAgICogRXJhc2VzIHRoZSBvYmplY3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC4gVGhlIGxpc3Qgc2l6ZVxuICAgICogd2lsbCBub3QgYmUgY2hhbmdlZCBidXQgdGhlIHRoZSB2YWx1ZSBhdCB0aGUgaW5kZXggd2lsbCBiZSBzZXQgdG8gbnVsbC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGVyYXNlT2JqZWN0XG4gICAgKiBAcGFyYW0ge051bWJlcn0gb2JqZWN0IFRoZSBvYmplY3Qgd2hpY2ggc2hvdWxkIGJlIGVyYXNlZC5cbiAgICAjIyNcbiAgICBlcmFzZU9iamVjdDogKGluZGV4KSAtPlxuICAgICAgICBvYmplY3QgPSBAc3ViT2JqZWN0c1tpbmRleF1cbiAgICAgICAgb2JqZWN0Py5wYXJlbnQgPSBudWxsXG4gICAgICAgIEBzdWJPYmplY3RzW2luZGV4XSA9IG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50IHRvIHRoZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRDb21wb25lbnRcbiAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnQgVGhlIGNvbXBvbmVudFxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIEFuIG9wdGlvbmFsIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY29tcG9uZW50LlxuICAgICMjI1xuICAgIGFkZENvbXBvbmVudDogKGNvbXBvbmVudCwgaWQpIC0+XG4gICAgICAgIGlmIG5vdCBAY29tcG9uZW50cy5jb250YWlucyhjb21wb25lbnQpXG4gICAgICAgICAgICBjb21wb25lbnQub2JqZWN0ID0gdGhpc1xuICAgICAgICAgICAgQGNvbXBvbmVudHMucHVzaChjb21wb25lbnQpXG4gICAgICAgICAgICBpZiBpZD9cbiAgICAgICAgICAgICAgICBAY29tcG9uZW50c0J5SWRbaWRdID0gY29tcG9uZW50XG4gICAgIyMjKlxuICAgICogSW5zZXJ0cyBhIGNvbXBvbmVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICpcbiAgICAqIEBtZXRob2QgaW5zZXJ0Q29tcG9uZW50XG4gICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50IFRoZSBjb21wb25lbnQuXG4gICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4LlxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIEFuIG9wdGlvbmFsIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY29tcG9uZW50LlxuICAgICMjIyAgICBcbiAgICBpbnNlcnRDb21wb25lbnQ6IChjb21wb25lbnQsIGluZGV4LCBpZCkgLT5cbiAgICAgICAgQGNvbXBvbmVudHMucmVtb3ZlKGNvbXBvbmVudClcbiAgICAgICAgY29tcG9uZW50Lm9iamVjdCA9IHRoaXNcbiAgICAgICAgQGNvbXBvbmVudHMuc3BsaWNlKGluZGV4LCAwLCBjb21wb25lbnQpXG4gICAgICAgIGlmIGlkP1xuICAgICAgICAgICAgQGNvbXBvbmVudHNCeUlkW2lkXSA9IGNvbXBvbmVudFxuICAgIFxuICAgICMjIypcbiAgICAqIFJlbW92ZXMgYSBjb21wb25lbnQgZnJvbSB0aGUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVtb3ZlQ29tcG9uZW50XG4gICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50IFRoZSBjb21wb25lbnQgdG8gcmVtb3ZlLlxuICAgICMjIyAgXG4gICAgcmVtb3ZlQ29tcG9uZW50OiAoY29tcG9uZW50KSAtPiBcbiAgICAgICAgQGNvbXBvbmVudHMucmVtb3ZlKGNvbXBvbmVudClcbiAgICAgICAgaWYgaWQ/XG4gICAgICAgICAgICBkZWxldGUgQGNvbXBvbmVudHNCeUlkW2lkXVxuXG5ncy5PYmplY3RfQmFzZSA9IE9iamVjdF9CYXNlIl19
//# sourceURL=Object_Base_16.js