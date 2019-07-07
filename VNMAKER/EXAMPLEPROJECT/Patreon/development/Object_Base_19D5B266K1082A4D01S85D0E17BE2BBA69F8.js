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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O3dCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7SUFDakIsSUFBRyxJQUFDLENBQUEsRUFBSjthQUNJLE1BQU8sQ0FBQSxHQUFBLEdBQUksSUFBQyxDQUFBLEVBQUwsQ0FBUCxHQUFrQixLQUR0Qjs7RUFEaUI7O0VBV3JCLFdBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtBQUNELFVBQUE7TUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVOzJEQUNjLENBQUUsVUFBMUIsQ0FBcUMsSUFBckMsRUFBMkMsQ0FBM0M7SUFGQyxDQUFMO0lBSUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpMO0dBREo7O0VBY0EsV0FBQyxDQUFBLFNBQUQsQ0FBVyxPQUFYLEVBQ0k7SUFBQSxHQUFBLEVBQUssU0FBQyxDQUFEO0FBQ0QsVUFBQTtNQUFBLElBQUcsQ0FBQSxLQUFLLElBQUMsQ0FBQSxNQUFUO1FBQ0ksSUFBQyxDQUFBLE1BQUQsR0FBVTtnREFDSCxDQUFFLFNBQVQsR0FBcUIsY0FGekI7O0lBREMsQ0FBTDtJQUlBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FKTDtHQURKOztFQWVBLFdBQUMsQ0FBQSxTQUFELENBQVcsYUFBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtBQUNELFVBQUE7TUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUVoQixNQUFBLEdBQVMsSUFBQyxDQUFBO0FBQ1YsYUFBTSxNQUFOO1FBQ0ksTUFBTSxDQUFDLFlBQVAsR0FBc0I7UUFDdEIsTUFBQSxHQUFTLE1BQU0sQ0FBQztNQUZwQjtNQVNBLElBQUcsQ0FBSDtlQUNJLElBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBREo7O0lBYkMs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QUFDLENBQUEsVUFBVyxDQUFBLEtBQUE7O01BQ3JCLE1BQU0sQ0FBRSxNQUFSLEdBQWlCOztXQUNqQixJQUFDLENBQUEsVUFBVyxDQUFBLEtBQUEsQ0FBWixHQUFxQjtFQUhaOzs7QUFLYjs7Ozs7Ozs7d0JBT0EsWUFBQSxHQUFjLFNBQUMsU0FBRCxFQUFZLEVBQVo7SUFDVixJQUFHLENBQUksSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQXFCLFNBQXJCLENBQVA7TUFDSSxTQUFTLENBQUMsTUFBVixHQUFtQjtNQUNuQixJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsU0FBakI7TUFDQSxJQUFHLFVBQUg7ZUFDSSxJQUFDLENBQUEsY0FBZSxDQUFBLEVBQUEsQ0FBaEIsR0FBc0IsVUFEMUI7T0FISjs7RUFEVTs7O0FBTWQ7Ozs7Ozs7Ozt3QkFRQSxlQUFBLEdBQWlCLFNBQUMsU0FBRCxFQUFZLEtBQVosRUFBbUIsRUFBbkI7SUFDYixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBbUIsU0FBbkI7SUFDQSxTQUFTLENBQUMsTUFBVixHQUFtQjtJQUNuQixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBbUIsS0FBbkIsRUFBMEIsQ0FBMUIsRUFBNkIsU0FBN0I7SUFDQSxJQUFHLFVBQUg7YUFDSSxJQUFDLENBQUEsY0FBZSxDQUFBLEVBQUEsQ0FBaEIsR0FBc0IsVUFEMUI7O0VBSmE7OztBQU9qQjs7Ozs7Ozt3QkFNQSxlQUFBLEdBQWlCLFNBQUMsU0FBRDtJQUNiLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixTQUFuQjtJQUNBLElBQUcsd0NBQUg7YUFDSSxPQUFPLElBQUMsQ0FBQSxjQUFlLENBQUEsRUFBQSxFQUQzQjs7RUFGYTs7Ozs7O0FBS3JCLEVBQUUsQ0FBQyxXQUFILEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBPYmplY3RfQmFzZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0Jhc2VcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgaWYgQGlkXG4gICAgICAgICAgICB3aW5kb3dbXCIkXCIrQGlkXSA9IHRoaXNcbiAgICAgICAgICAgIFxuICAgIFxuICAgICNcbiAgICAjIEdldHMgb3Igc2V0cyB0aGUgZ3JvdXAgdGhlIG9iamVjdCBiZWxvbmdzIHRvLlxuICAgICNcbiAgICAjIEBwcm9wZXJ0eSBncm91cFxuICAgICMgQHR5cGUgc3RyaW5nXG4gICAgI1xuICAgIEBhY2Nlc3NvcnMgXCJncm91cFwiLCBcbiAgICAgICAgc2V0OiAoZykgLT4gXG4gICAgICAgICAgICBAZ3JvdXBfID0gZ1xuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Py5hZGRUb0dyb3VwKHRoaXMsIGcpXG4gICAgICAgICAgICBcbiAgICAgICAgZ2V0OiAtPiBAZ3JvdXBfXG4gICAgICAgIFxuICAgICNcbiAgICAjIEdldHMgb3Igc2V0cyB0aGUgb3JkZXItaW5kZXggb2YgdGhlIG9iamVjdC4gVGhlIGxvd2VyIHRoZSBpbmRleCwgdGhlXG4gICAgIyBlYXJsaWVyIHRoZSBvYmplY3Qgd2lsbCBiZSB1cGRhdGVkIGluIGEgbGlzdCBvZiBzdWItb2JqZWN0cy5cbiAgICAjXG4gICAgIyBAcHJvcGVydHkgb3JkZXJcbiAgICAjIEB0eXBlIG51bWJlclxuICAgICNcbiAgICBAYWNjZXNzb3JzIFwib3JkZXJcIixcbiAgICAgICAgc2V0OiAobykgLT5cbiAgICAgICAgICAgIGlmIG8gIT0gQG9yZGVyX1xuICAgICAgICAgICAgICAgIEBvcmRlcl8gPSBvXG4gICAgICAgICAgICAgICAgQHBhcmVudD8ubmVlZHNTb3J0ID0gdHJ1ZVxuICAgICAgICBnZXQ6IC0+IEBvcmRlcl9cbiAgICAgICAgXG4gICAgI1xuICAgICMgR2V0cyBvciBzZXRzIGlmIGFuIG9iamVjdHMgbmVlZHMgYW4gdXBkYXRlLiBJZiB0cnVlLCB0aGUgcGFyZW50IHdpbGwgdXBkYXRlXG4gICAgIyB0aGUgb2JqZWN0IGluIHRoZSBuZXh0IHVwZGF0ZSBhbmQgcmVzZXRzIHRoZSBuZWVkc1VwZGF0ZSBwcm9wZXJ0eSBiYWNrXG4gICAgIyB0byBmYWxzZS5cbiAgICAjXG4gICAgIyBAcHJvcGVydHkgbmVlZHNVcGRhdGVcbiAgICAjIEB0eXBlIGJvb2xlYW5cbiAgICAjXG4gICAgQGFjY2Vzc29ycyBcIm5lZWRzVXBkYXRlXCIsIFxuICAgICAgICBzZXQ6ICh2KSAtPlxuICAgICAgICAgICAgQG5lZWRzVXBkYXRlXyA9IHZcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGFyZW50ID0gQHBhcmVudFxuICAgICAgICAgICAgd2hpbGUgcGFyZW50XG4gICAgICAgICAgICAgICAgcGFyZW50Lm5lZWRzVXBkYXRlXyA9IHllc1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICNpZiB2XG4gICAgICAgICAgICAjICAgIEBwYXJlbnQ/Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgICAgICAjaWYgdlxuICAgICAgICAgICAgIyAgICBmb3Igb2JqZWN0IGluIEBzdWJPYmplY3RzXG4gICAgICAgICAgICAjICAgICAgICBvYmplY3QubmVlZHNVcGRhdGVfID0gdlxuICAgICAgICAgICAgaWYgdlxuICAgICAgICAgICAgICAgIEByZXF1ZXN0U3ViVXBkYXRlKClcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQG5lZWRzVXBkYXRlXyB8fCBTY2VuZU1hbmFnZXIuc2NlbmUucHJlcGFyaW5nXG4gICAgICAgIFxuICAgIHJlcXVlc3RTdWJVcGRhdGU6IC0+XG4gICAgICAgIGZvciBvYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdFxuICAgICAgICAgICAgICAgIG9iamVjdC5uZWVkc1VwZGF0ZV8gPSB5ZXNcbiAgICAgICAgICAgICAgICBvYmplY3QucmVxdWVzdFN1YlVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgI1xuICAgICMgR2V0cyBvciBzZXRzIGlmIGFuIG9iamVjdCBuZWVkcyBhIGZ1bGwgdXBkYXRlLiBBIGZ1bGwgdXBkYXRlIHRyaWdnZXJzXG4gICAgIyBhbiB1cGRhdGUgZm9yIGFsbCBzdWItb2JqZWN0cyByZWN1cnNpdmVseS4gXG4gICAgI1xuICAgICMgQHByb3BlcnR5IG5lZWRzRnVsbFVwZGF0ZVxuICAgICMgQHR5cGUgYm9vbGVhblxuICAgICNcbiAgICBAYWNjZXNzb3JzIFwibmVlZHNGdWxsVXBkYXRlXCIsIFxuICAgICAgICBzZXQ6ICh2KSAtPlxuICAgICAgICAgICAgQG5lZWRzVXBkYXRlID0gdlxuICAgICAgICAgICAgaWYgdlxuICAgICAgICAgICAgICAgIGZvciBvYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm5lZWRzRnVsbFVwZGF0ZSA9IHZcbiAgICAgICAgZ2V0OiAtPiBAbmVlZHNVcGRhdGVfXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBUaGUgYmFzZSBjbGFzcyBmb3IgYWxsIGdhbWUgb2JqZWN0cy4gQSBnYW1lIG9iamVjdCBpdHNlbGYgZG9lc24ndCBpbXBsZW1lbnRcbiAgICAqIGFueSBnYW1lIGxvZ2ljIGJ1dCB1c2VzIGNvbXBvbmVudHMgYW5kIHN1Yi1vYmplY3RzIGZvciB0aGF0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBPYmplY3RfQmFzZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBzdWJPYmplY3RzXG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X0Jhc2VbXVxuICAgICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICAgICogQSBsaXN0IG9mIGdhbWUtb2JqZWN0cyBncm91cGVkIHVuZGVyIHRoaXMgZ2FtZSBvYmplY3QuXG4gICAgICAgICMjI1xuICAgICAgICBAc3ViT2JqZWN0cyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGNvbXBvbmVudHNcbiAgICAgICAgKiBAdHlwZSBncy5Db21wb25lbnRbXVxuICAgICAgICAqIEBkZWZhdWx0IFtdXG4gICAgICAgICogQSBsaXN0IG9mIGNvbXBvbmVudHMgZGVmaW5pbmcgdGhlIGxvZ2ljL2JlaGF2aW9yIGFuZCBhcHBlYXJhbmNlIG9mIHRoZSBnYW1lIG9iamVjdC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBjb21wb25lbnRzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgY29tcG9uZW50c0J5SWRcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgKiBAZGVmYXVsdCBbXVxuICAgICAgICAqIEFsbCBhc3NvY2lhdGVkIGNvbXBvbmVudHMgYnkgdGhlaXIgSUQuXG4gICAgICAgICMjI1xuICAgICAgICBAY29tcG9uZW50c0J5SWQgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBkaXNwb3NlZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgZ2FtZSBvYmplY3QgaWQgZGlzcG9zZWQuIEEgZGlzcG9zZWQgZ2FtZSBvYmplY3QgY2Fubm90IGJlIHVzZWQgYW55bW9yZS5cbiAgICAgICAgIyMjXG4gICAgICAgIEBkaXNwb3NlZCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGFjdGl2ZVxuICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGdhbWUgb2JqZWN0IGlzIGFjdGl2ZS4gQW4gaW5hY3RpdmUgZ2FtZSBvYmplY3Qgd2lsbCBub3QgYmUgdXBkYXRlZC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBhY3RpdmUgPSB5ZXNcbiAgICAgICAgXG4gICAgICAgIEBpbnB1dCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGlkXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAqIFRoZSBnYW1lIG9iamVjdCdzIFVJRCAoVW5pcXVlIElEKVxuICAgICAgICAjIyNcbiAgICAgICAgQGlkID0gbnVsbCBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgZ3JvdXBcbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICogVGhlIGdhbWUgb2JqZWN0J3MgZ3JvdXAuIFRvIGdldCBhbGwgb2JqZWN0J3Mgb2YgYSBzcGVjaWZpYyBncm91cCB0aGUgZ3MuT2JqZWN0TWFuYWdlci5vYmplY3RzQnlHcm91cCBwcm9wZXJ0eSBjYW4gYmUgdXNlZC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBncm91cCA9IG51bGwgXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHBhcmVudFxuICAgICAgICAqIEB0eXBlIGdzLk9iamVjdF9CYXNlXG4gICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAqIFRoZSBwYXJlbnQgb2JqZWN0IGlmIHRoZSBnYW1lIG9iamVjdCBpcyBhIHN1Yi1vYmplY3Qgb2YgYW5vdGhlciBnYW1lIG9iamVjdC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBwYXJlbnQgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IG9yZGVyXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAqIENvbnRyb2xzIHRoZSB1cGRhdGUtb3JkZXIuIFRoZSBzbWFsbGVyIHRoZSB2YWx1ZSB0aGUgZWFybGllciB0aGUgZ2FtZSBvYmplY3QgaXMgdXBkYXRlZCBiZWZvcmUgb3RoZXIgZ2FtZSBvYmplY3RzIGFyZSB1cGRhdGVkLlxuICAgICAgICAjIyNcbiAgICAgICAgQG9yZGVyID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBySW5kZXhcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAZGVmYXVsdCAwXG4gICAgICAgICogSG9sZHMgdGhlIHJlbmRlci1pbmRleCBpZiB0aGUgZ2FtZSBvYmplY3QgaGFzIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9uIHNjcmVlbi4gVGhlIHJlbmRlci1pbmRleCBpcyB0aGVcbiAgICAgICAgKiBpbmRleCBvZiB0aGUgZ2FtZSBvYmplY3QncyBncmFwaGljLW9iamVjdChncy5HcmFwaGljT2JqZWN0KSBpbiB0aGUgY3VycmVudCBsaXN0IG9mIGdyYXBoaWMtb2JqZWN0cy4gVGhlIHJlbmRlci1pbmRleFxuICAgICAgICAqIGlzIHJlYWQtb25seS4gU2V0dGluZyB0aGUgcmVuZGVyLWluZGV4IHRvIGEgY2VydGFpbiB2YWx1ZSBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAjIyNcbiAgICAgICAgQHJJbmRleCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgbmVlZHNTb3J0XG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGxpc3Qgb2Ygc3ViLW9iamVjdHMgbmVlZHMgdG8gYmUgc29ydGVkIGJ5IG9yZGVyIGJlY2F1c2Ugb2YgYSBjaGFuZ2UuXG4gICAgICAgICMjI1xuICAgICAgICBAbmVlZHNTb3J0ID0geWVzXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IG5lZWRzU29ydFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBVSSBvYmplY3QgbmVlZHMgdG8gYmUgdXBkYXRlZC5cbiAgICAgICAgIyMjXG4gICAgICAgIEBuZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbml0aWFsaXplZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBnYW1lIG9iamVjdCBhbmQgaXRzIGNvbXBvbmVudHMgaGF2ZSBiZWVuIGluaXRpYWxpemVkLlxuICAgICAgICAjIyNcbiAgICAgICAgQGluaXRpYWxpemVkID0gbm9cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQ/LnJlZ2lzdGVyT2JqZWN0KHRoaXMpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBvYmplY3Qgd2l0aCBhbGwgaXRzIGNvbXBvbmVudHMgYW5kIHN1Yi1vYmplY3RzLiBBIGRpc3Bvc2VkIG9iamVjdCB3aWxsIGJlXG4gICAgKiByZW1vdmVkIGZyb20gdGhlIHBhcmVudCBhdXRvbWF0aWNhbGx5LlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZVxuICAgICMjI1xuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIGlmIG5vdCBAZGlzcG9zZWRcbiAgICAgICAgICAgIEBkaXNwb3NlZCA9IHllc1xuICAgICAgICAgICAgQGRpc3Bvc2VDb21wb25lbnRzKClcbiAgICAgICAgICAgIEBkaXNwb3NlT2JqZWN0cygpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQ/LnVucmVnaXN0ZXJPYmplY3QodGhpcylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIGFsbCBzdWItb2JqZWN0cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VPYmplY3RzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgZGlzcG9zZU9iamVjdHM6IC0+XG4gICAgICAgIGZvciBzdWJPYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgIHN1Yk9iamVjdD8uZGlzcG9zZT8oKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgYWxsIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VDb21wb25lbnRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgZGlzcG9zZUNvbXBvbmVudHM6IC0+XG4gICAgICAgIGZvciBjb21wb25lbnQgaW4gQGNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudD8uZGlzcG9zZT8oKVxuICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxzIHNldHVwLXJvdXRpbmUgb24gYWxsIGNvbXBvbmVudHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICAgICBmb3IgY29tcG9uZW50IGluIEBjb21wb25lbnRzXG4gICAgICAgICAgICBjb21wb25lbnQuc2V0dXAoKSBpZiBub3QgY29tcG9uZW50Py5pc1NldHVwXG4gICAgICAgICAgICBcbiAgICAgICAgQGluaXRpYWxpemVkID0geWVzXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERlc2VyaWFsaXplcyBjb21wb25lbnRzIGZyb20gYSBkYXRhLWJ1bmRsZSBvYmplY3QuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgY29tcG9uZW50c0Zyb21EYXRhQnVuZGxlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YS1idW5kbGUgb2JqZWN0LlxuICAgICMjI1xuICAgIGNvbXBvbmVudHNGcm9tRGF0YUJ1bmRsZTogKGRhdGEpIC0+XG4gICAgICAgIGlmIGRhdGE/LmNvbXBvbmVudHNcbiAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gZGF0YS5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29tcG9uZW50T2JqZWN0ID0gbmV3IGdzW2NvbXBvbmVudC5jbGFzc05hbWVdKGNvbXBvbmVudClcbiAgICAgICAgICAgICAgICBAYWRkQ29tcG9uZW50KGNvbXBvbmVudE9iamVjdClcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyBjb21wb25lbnRzIG9mIGEgc3BlY2lmaWVkIHR5cGUgdG8gYSBkYXRhLWJ1bmRsZS4gQSBjb21wb25lbnRcbiAgICAqIG5lZWRzIHRvIGltcGxlbWVudCB0aGUgdG9EYXRhQnVuZGxlIG1ldGhvZCBmb3IgY29ycmVjdCBzZXJpYWxpemF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgY29tcG9uZW50c1RvRGF0YUJ1bmRsZVxuICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIGNvbXBvbmVudCBjbGFzcyBuYW1lLlxuICAgICogQHJldHVybiBBIGRhdGEgYnVuZGxlLlxuICAgICMjI1xuICAgIGNvbXBvbmVudHNUb0RhdGFCdW5kbGU6ICh0eXBlKSAtPlxuICAgICAgICBjb21wb25lbnRzID0gW11cbiAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBAY29tcG9uZW50c1xuICAgICAgICAgICAgaWYgY29tcG9uZW50IGluc3RhbmNlb2YgdHlwZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlIHVubGVzcyBjb21wb25lbnQudG9EYXRhQnVuZGxlP1xuICAgICAgICAgICAgICAgIGJ1bmRsZSA9IGNvbXBvbmVudC50b0RhdGFCdW5kbGUoKVxuICAgICAgICAgICAgICAgIGJ1bmRsZS5jbGFzc05hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZVxuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChidW5kbGUpXG4gICAgICAgIHJldHVybiBjb21wb25lbnRzXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyBhIGZ1bGwtcmVmcmVzaCBvbiBhbGwgc3ViLW9iamVjdHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIGZ1bGxSZWZyZXNoXG4gICAgIyMjXG4gICAgZnVsbFJlZnJlc2g6IC0+XG4gICAgICAgIGZvciBvYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgIGlmIG9iamVjdFxuICAgICAgICAgICAgICAgIG9iamVjdC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICAgICAgICAgIG9iamVjdC5mdWxsUmVmcmVzaCgpXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBvYmplY3Qgd2l0aCBhbGwgcGFyZW50LSBhbmQgc3ViLW9iamVjdHMuIFxuICAgICpcbiAgICAqIEBtZXRob2QgZnVsbFVwZGF0ZVxuICAgICMjI1xuICAgIGZ1bGxVcGRhdGU6IC0+XG4gICAgICAgIHBhcmVudCA9IHRoaXNcbiAgICAgICAgd2hpbGUgcGFyZW50ICE9IG51bGxcbiAgICAgICAgICAgIHBhcmVudC51cGRhdGUoKVxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFxuICAgICAgICAgICAgXG4gICAgICAgIGZvciBvYmplY3QgaW4gQHN1Yk9iamVjdHNcbiAgICAgICAgICAgIG9iamVjdD8udXBkYXRlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgb2JqZWN0IGFuZCBhbGwgaXRzIGNvbXBvbmVudHMuIFRoaXMgbWV0aG9kIGlzXG4gICAgKiBjYWxsZWQgYXV0b21hdGljYWxseSBieSB0aGUgcGFyZW50IG9yIE9iamVjdE1hbmFnZXIgc28gaW4gcmVndWxhciBpdCBpcyBcbiAgICAqIG5vdCBuZWNlc3NhcnkgdG8gY2FsbCBpdCBtYW51YWxseS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgcmV0dXJuIGlmICFAYWN0aXZlXG4gICAgICAgIGkgPSAwXG4gICAgICAgIHdoaWxlIGkgPCBAY29tcG9uZW50cy5sZW5ndGhcbiAgICAgICAgICAgIGNvbXBvbmVudCA9IEBjb21wb25lbnRzW2ldXG4gICAgICAgICAgICBpZiBub3QgY29tcG9uZW50LmRpc3Bvc2VkXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgaSsrXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGNvbXBvbmVudHMuc3BsaWNlKGksIDEpXG5cblxuICAgICAgICBpZiBAaW5wdXQgdGhlbiBJbnB1dC5jbGVhcigpXG4gICAgICAgIEBpbnB1dCA9IG5vXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2VhcmNoZXMgZm9yIHRoZSBmaXJzdCBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50XG4gICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50LlxuICAgICogQHJldHVybiB7Q29tcG9uZW50fSBUaGUgY29tcG9uZW50IG9yIG51bGwgaWYgYSBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWUgY2Fubm90IGJlIGZvdW5kLlxuICAgICMjI1xuICAgIGZpbmRDb21wb25lbnQ6IChuYW1lKSAtPiBAY29tcG9uZW50cy5maXJzdCAodikgLT4gdi5jb25zdHJ1Y3Rvci5uYW1lID09IG5hbWVcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZWFyY2hlcyBmb3IgYWxsIGNvbXBvbmVudHMgd2l0aCB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50c1xuICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudHMuXG4gICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGNvbXBvbmVudHMgb3IgbnVsbCBpZiBubyBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGNsYXNzIG5hbWUgaGFzIGJlZW4gZm91bmQuXG4gICAgIyMjXG4gICAgZmluZENvbXBvbmVudHM6IChuYW1lKSAtPiBAY29tcG9uZW50cy53aGVyZSAodikgLT4gdi5jb25zdHJ1Y3Rvci5uYW1lID09IG5hbWVcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZWFyY2hlcyBmb3IgdGhlIGNvbXBvbmVudCB3aXRoIHRoZSBzcGVjaWZpZWQgSUQuXG4gICAgKlxuICAgICogQG1ldGhvZCBmaW5kQ29tcG9uZW50QnlJZFxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgY29tcG9uZW50LlxuICAgICogQHJldHVybiB7Q29tcG9uZW50fSBUaGUgY29tcG9uZW50IG9yIG51bGwgaWYgYSBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIElEIGNhbm5vdCBiZSBmb3VuZC5cbiAgICAjIyNcbiAgICBmaW5kQ29tcG9uZW50QnlJZDogKGlkKSAtPiBAY29tcG9uZW50c0J5SWRbaWRdXG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBhbiBvYmplY3QgdG8gdGhlIGxpc3Qgb2Ygc3ViLW9iamVjdHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRPYmplY3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0X0Jhc2V9IG9iamVjdCBUaGUgb2JqZWN0IHdoaWNoIHNob3VsZCBiZSBhZGRlZC5cbiAgICAjIyNcbiAgICBhZGRPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudD8ucmVtb3ZlKG9iamVjdClcbiAgICAgICAgb2JqZWN0LnBhcmVudD8ucmVtb3ZlT2JqZWN0KG9iamVjdClcbiAgICAgICAgb2JqZWN0LnBhcmVudCA9IHRoaXNcbiAgICAgICAgQHN1Yk9iamVjdHMucHVzaChvYmplY3QpXG4gICAgICAgIEBuZWVkc1NvcnQgPSB5ZXNcbiAgICAgICAgQG5lZWRzVXBkYXRlID0geWVzXG4gICAgXG4gICAgICAgIGlmIG9iamVjdC5pZD9cbiAgICAgICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5zZXRPYmplY3RCeUlkKG9iamVjdCwgb2JqZWN0LmlkKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBJbnNlcnRzIGFuIG9iamVjdCBpbnRvIHRoZSBsaXN0IG9mIHN1Yi1vYmplY3RzIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBpbnNlcnRPYmplY3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0X0Jhc2V9IG9iamVjdCBUaGUgb2JqZWN0IHdoaWNoIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXguXG4gICAgIyMjXG4gICAgaW5zZXJ0T2JqZWN0OihvYmplY3QsIGluZGV4KSAtPlxuICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQucmVtb3ZlKG9iamVjdClcbiAgICAgICAgb2JqZWN0LnBhcmVudD8ucmVtb3ZlT2JqZWN0KG9iamVjdClcbiAgICAgICAgb2JqZWN0LnBhcmVudCA9IHRoaXNcbiAgICAgICAgQHN1Yk9iamVjdHMuc3BsaWNlKGluZGV4LCAwLCBvYmplY3QpXG4gICAgICBcbiAgICAgICAgaWYgb2JqZWN0LmlkP1xuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50LnNldE9iamVjdEJ5SWQob2JqZWN0LCBvYmplY3QuaWQpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHN1Yi1vYmplY3QgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldE9iamVjdFxuICAgICogQHBhcmFtIHtPYmplY3RfQmFzZX0gb2JqZWN0IFRoZSBvYmplY3QuXG4gICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4LlxuICAgICMjI1xuICAgIHNldE9iamVjdDogKG9iamVjdCwgaW5kZXgpIC0+XG4gICAgICAgIGlmIG9iamVjdFxuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50LnJlbW92ZShvYmplY3QpXG4gICAgICAgICAgICBvYmplY3QucGFyZW50Py5yZW1vdmVPYmplY3Qob2JqZWN0KVxuICAgICAgICAgICAgb2JqZWN0LnBhcmVudCA9IHRoaXNcbiAgICAgICAgICAgIFxuICAgICAgICBAc3ViT2JqZWN0c1tpbmRleF0gPSBvYmplY3RcbiAgICAgIFxuICAgICAgICBpZiBvYmplY3Q/LmlkP1xuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50LnNldE9iamVjdEJ5SWQob2JqZWN0LCBvYmplY3QuaWQpXG4gICAgXG4gICAgIyMjKlxuICAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIG9iamVjdCBmcm9tIHRoZSBsaXN0IG9mIHN1Yi1vYmplY3RzLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVtb3ZlT2JqZWN0XG4gICAgKiBAcGFyYW0ge09iamVjdF9CYXNlfSBvYmplY3QgVGhlIG9iamVjdCB3aGljaCBzaG91bGQgYmUgcmVtb3ZlZC5cbiAgICAjIyNcbiAgICByZW1vdmVPYmplY3Q6IChvYmplY3QpIC0+XG4gICAgICAgIEBzdWJPYmplY3RzLnJlbW92ZShvYmplY3QpXG4gICAgICAgIG9iamVjdC5wYXJlbnQgPSBudWxsXG4gICAgICAgIEBuZWVkc1VwZGF0ZSA9IHllc1xuICAgIFxuICAgICMjIypcbiAgICAqIEVyYXNlcyB0aGUgb2JqZWN0IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguIFRoZSBsaXN0IHNpemVcbiAgICAqIHdpbGwgbm90IGJlIGNoYW5nZWQgYnV0IHRoZSB0aGUgdmFsdWUgYXQgdGhlIGluZGV4IHdpbGwgYmUgc2V0IHRvIG51bGwuXG4gICAgKlxuICAgICogQG1ldGhvZCBlcmFzZU9iamVjdFxuICAgICogQHBhcmFtIHtOdW1iZXJ9IG9iamVjdCBUaGUgb2JqZWN0IHdoaWNoIHNob3VsZCBiZSBlcmFzZWQuXG4gICAgIyMjXG4gICAgZXJhc2VPYmplY3Q6IChpbmRleCkgLT5cbiAgICAgICAgb2JqZWN0ID0gQHN1Yk9iamVjdHNbaW5kZXhdXG4gICAgICAgIG9iamVjdD8ucGFyZW50ID0gbnVsbFxuICAgICAgICBAc3ViT2JqZWN0c1tpbmRleF0gPSBudWxsXG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyB0aGUgc3BlY2lmaWVkIGNvbXBvbmVudCB0byB0aGUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgYWRkQ29tcG9uZW50XG4gICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50IFRoZSBjb21wb25lbnRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBBbiBvcHRpb25hbCB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAjIyNcbiAgICBhZGRDb21wb25lbnQ6IChjb21wb25lbnQsIGlkKSAtPlxuICAgICAgICBpZiBub3QgQGNvbXBvbmVudHMuY29udGFpbnMoY29tcG9uZW50KVxuICAgICAgICAgICAgY29tcG9uZW50Lm9iamVjdCA9IHRoaXNcbiAgICAgICAgICAgIEBjb21wb25lbnRzLnB1c2goY29tcG9uZW50KVxuICAgICAgICAgICAgaWYgaWQ/XG4gICAgICAgICAgICAgICAgQGNvbXBvbmVudHNCeUlkW2lkXSA9IGNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIEluc2VydHMgYSBjb21wb25lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGluc2VydENvbXBvbmVudFxuICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudCBUaGUgY29tcG9uZW50LlxuICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleC5cbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBBbiBvcHRpb25hbCB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAjIyMgICAgXG4gICAgaW5zZXJ0Q29tcG9uZW50OiAoY29tcG9uZW50LCBpbmRleCwgaWQpIC0+XG4gICAgICAgIEBjb21wb25lbnRzLnJlbW92ZShjb21wb25lbnQpXG4gICAgICAgIGNvbXBvbmVudC5vYmplY3QgPSB0aGlzXG4gICAgICAgIEBjb21wb25lbnRzLnNwbGljZShpbmRleCwgMCwgY29tcG9uZW50KVxuICAgICAgICBpZiBpZD9cbiAgICAgICAgICAgIEBjb21wb25lbnRzQnlJZFtpZF0gPSBjb21wb25lbnRcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIGEgY29tcG9uZW50IGZyb20gdGhlIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlbW92ZUNvbXBvbmVudFxuICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudCBUaGUgY29tcG9uZW50IHRvIHJlbW92ZS5cbiAgICAjIyMgIFxuICAgIHJlbW92ZUNvbXBvbmVudDogKGNvbXBvbmVudCkgLT4gXG4gICAgICAgIEBjb21wb25lbnRzLnJlbW92ZShjb21wb25lbnQpXG4gICAgICAgIGlmIGlkP1xuICAgICAgICAgICAgZGVsZXRlIEBjb21wb25lbnRzQnlJZFtpZF1cblxuZ3MuT2JqZWN0X0Jhc2UgPSBPYmplY3RfQmFzZSJdfQ==
//# sourceURL=Object_Base_5.js