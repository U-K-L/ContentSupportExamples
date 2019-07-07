var Component_EventEmitter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_EventEmitter = (function(superClass) {
  extend(Component_EventEmitter, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_EventEmitter.prototype.onDataBundleRestore = function(data, context) {
    var handler, handlers, i, j, k, l, list, ref;
    for (k in this.handlers) {
      list = this.handlers[k];
      for (i = l = 0, ref = list.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        handlers = list[i];
        j = 0;
        while (j < handlers.length) {
          handler = handlers[j];
          if (!handler.handler || !handler.handler.$vnm_cb) {
            handlers.splice(j, 1);
          } else {
            j++;
          }
        }
      }
    }
    return null;
  };


  /**
  * A component which allow a game object to fire events and manage a list
  * of observers.
  *
  * @module gs
  * @class Component_EventEmitter
  * @extends gs.Component
  * @memberof gs
   */

  function Component_EventEmitter() {
    Component_EventEmitter.__super__.constructor.apply(this, arguments);

    /**
    * List of registered observers.
    *
    * @property handlers
    * @type Object
    * @private
     */
    this.handlers = {};

    /**
    * @property defaultData
    * @type Object
    * @private
     */
    this.defaultData = {};

    /**
    * @property chainInfo
    * @type Object
    * @private
     */
    this.chainInfo = {};

    /**
    * @property needsSort
    * @type boolean
    * @private
     */
    this.needsSort = {};

    /**
    * @property markedForRemove
    * @type Object[]
    * @private
     */
    this.markedForRemove = [];

    /**
    * @property isEmitting
    * @type number
    * @private
     */
    this.isEmitting = 0;
  }


  /**
  * Clears the event emitter by removing all handlers/listeners.
  *
  * @method clear
   */

  Component_EventEmitter.prototype.clear = function() {
    this.needsSort = {};
    this.handlers = {};
    return this.defaultData = {};
  };


  /**
  * Adds a new observer/listener for a specified event.
  *
  * @method on
  * @param {string} eventName - The event name.
  * @param {function} handler - The handler-function called when the event is fired.
  * @param {Object} [data={}] - An optional info-object passed to the handler-function.
  * @param {Object} [owner=null] - An optional owner-object associated with the observer/listener.
  * @param {number} priority - An optional priority level. An observer/listener with a higher level will receive the event before observers/listeners with a lower level.
  * @return {gs.EventObserver} - The added observer-object.
   */

  Component_EventEmitter.prototype.on = function(eventName, handler, data, owner, priority) {
    var handlerObject;
    priority = priority || 0;
    this.needsSort[eventName] = true;
    if (this.handlers[eventName] == null) {
      this.handlers[eventName] = [];
    }
    if (!this.handlers[eventName][priority]) {
      this.handlers[eventName][priority] = [];
    }
    handlerObject = {
      handler: handler,
      once: false,
      data: data,
      owner: owner,
      eventName: eventName,
      priority: priority
    };
    this.handlers[eventName][priority].push(handlerObject);
    return handlerObject;
  };


  /**
  * Adds a new observer/listener for a specified event and removes it
  * after the even has been emitted once.
  *
  * @method once
  * @param {string} eventName - The event name.
  * @param {function} handler - The handler-function called when the event is fired.
  * @param {Object} [data={}] - An optional info-object passed to the handler-function.
  * @param {Object} [owner=null] - An optional owner-object associated with the observer/listener.
  * @param {number} priority - An optional priority level. An observer/listener with a higher level will receive the event before observers/listeners with a lower level.
  * @return {gs.EventObserver} - The added observer-object.
   */

  Component_EventEmitter.prototype.once = function(eventName, handler, data, owner, priority) {
    var handlerObject;
    handlerObject = this.on(eventName, handler, data, owner, priority);
    handlerObject.once = true;
    return handlerObject;
  };


  /**
  * Removes an observer/listener from a specified event. If handler parameter
  * is null, all observers for the specified event are removed.
  *
  * @method off
  * @param {string} eventName - The event name.
  * @param {gs.EventObserver} [handler=null] - The observer-object to remove. 
  * If null, all observers for the specified event are removed.
   */

  Component_EventEmitter.prototype.off = function(eventName, handler) {
    var ref, ref1;
    if (this.isEmitting > 0 && handler) {
      return this.markedForRemove.push(handler);
    } else if (handler != null) {
      return (ref = this.handlers[eventName]) != null ? (ref1 = ref[handler.priority]) != null ? ref1.remove(handler) : void 0 : void 0;
    } else {
      return this.handlers[eventName] = [];
    }
  };


  /**
  * Removes all observers/listeners from an event which are belonging to the specified
  * owner.
  *
  * @method offByOwner
  * @param {string} eventName - The event name.
  * @param {Object} owner - The owner.
  * @return {number} Count of removed observers/listeners.
   */

  Component_EventEmitter.prototype.offByOwner = function(eventName, owner) {
    var handler, handlerList, handlers, l, len, len1, m, ref, ref1, results, results1;
    if (this.handlers[eventName]) {
      if (this.isEmitting > 0) {
        ref = this.handlers[eventName];
        results = [];
        for (l = 0, len = ref.length; l < len; l++) {
          handlerList = ref[l];
          handlers = handlerList != null ? handlerList.where(function(x) {
            return x.owner === owner;
          }) : void 0;
          results.push((function() {
            var len1, m, results1;
            results1 = [];
            for (m = 0, len1 = handlers.length; m < len1; m++) {
              handler = handlers[m];
              results1.push(this.markedForRemove.push(handler));
            }
            return results1;
          }).call(this));
        }
        return results;
      } else {
        ref1 = this.handlers[eventName];
        results1 = [];
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          handlerList = ref1[m];
          results1.push(handlerList.removeAll(function(x) {
            return x.owner === owner;
          }));
        }
        return results1;
      }
    }
  };


  /**
  * Emits the specified event. All observers/listeners registered for the
  * specified event are informed.
  *
  * @method emit
  * @param {string} eventName - The name of the event to fire.
  * @param {Object} [sender=null] - The sender of the event.
  * @param {Object} [data={}] - An optional object passed to each handler-function.
   */

  Component_EventEmitter.prototype.emit = function(eventName, sender, data) {
    var count, handler, handlerList, handlerLists, i, l, len, len1, m, n, ref;
    handlerLists = this.handlers[eventName];
    data = data != null ? data : this.defaultData;
    if (handlerLists && this.needsSort[eventName]) {
      this.needsSort[eventName] = false;
      for (l = 0, len = handlerLists.length; l < len; l++) {
        handlerList = handlerLists[l];
        handlerList.sort(function(a, b) {
          if (a.owner && b.owner) {
            if (a.owner.rIndex > b.owner.rIndex) {
              return -1;
            } else if (a.owner.rIndex < b.owner.rIndex) {
              return 1;
            } else {
              return 0;
            }
          } else {
            return -1;
          }
        });
      }
    }
    if (handlerLists != null) {
      for (m = handlerLists.length - 1; m >= 0; m += -1) {
        handlerList = handlerLists[m];
        if (!handlerList) {
          continue;
        }
        i = 0;
        count = handlerList.length;
        this.isEmitting++;
        while (i < count) {
          handler = handlerList[i];
          data.handler = handler;
          data.sender = sender;
          data.data = handler.data;
          if (!handler.owner || (handler.owner.visible == null) || handler.owner.visible) {
            handler.handler(data);
          }
          if (handler.once) {
            this.markedForRemove.push(handler);
          }
          if (data.breakChain) {
            data.breakChain = false;
            break;
          }
          i++;
        }
        this.isEmitting--;
      }
      if (!this.isEmitting && this.markedForRemove.length > 0) {
        ref = this.markedForRemove;
        for (n = 0, len1 = ref.length; n < len1; n++) {
          handler = ref[n];
          this.handlers[handler.eventName][handler.priority].remove(handler);
        }
        this.markedForRemove = [];
      }
    }
    return null;
  };


  /**
  * Checks if an event-handler with a specified owner exists for the
  * given event.
  *
  * @method checkForOwner
  * @param {string} eventName - The event name.
  * @param {function} owner - The owner to search for.
  * @return {boolean} If <b>true</b>, an event-handler with the specified owner
  * exists for the given event. Otherwise <b>false</b>.
   */

  Component_EventEmitter.prototype.checkForOwner = function(eventName, owner) {
    var handler, l, len, ref, result;
    result = false;
    ref = this.handlers[eventName];
    for (l = 0, len = ref.length; l < len; l++) {
      handler = ref[l];
      if (handler.owner === owner) {
        result = true;
        break;
      }
    }
    return result;
  };


  /**
  * Checks if an event-handler with a specified handler-function exists for the
  * given event.
  *
  * @method checkForHandlerFunction
  * @param {string} eventName - The event name.
  * @param {function} handlerFunction - The handler-function to search for.
  * @return {boolean} If true, an observer witht he specified handler-function
  * exists for the given event. Otherwise false.
   */

  Component_EventEmitter.prototype.checkForHandlerFunction = function(eventName, handlerFunction) {
    var handler, l, len, ref, result;
    result = false;
    if (handlerFunction != null) {
      ref = this.handlers[eventName];
      for (l = 0, len = ref.length; l < len; l++) {
        handler = ref[l];
        if (handler.handler === handlerFunction) {
          result = true;
          break;
        }
      }
    }
    return result;
  };


  /**
  * Not implemented yet.
  * @method update
   */

  Component_EventEmitter.prototype.update = function() {
    return this.object.active = this.object.active && (!this.object.parent || this.object.parent.active);
  };

  return Component_EventEmitter;

})(gs.Component);

gs.Component_EventEmitter = Component_EventEmitter;

gs.EventEmitter = Component_EventEmitter;

gs.GlobalEventManager = new Component_EventEmitter();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFFRjs7Ozs7Ozs7O21DQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDakIsUUFBQTtBQUFBLFNBQUEsa0JBQUE7TUFDSSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVMsQ0FBQSxDQUFBO0FBQ2pCLFdBQVMsb0ZBQVQ7UUFDSSxRQUFBLEdBQVcsSUFBSyxDQUFBLENBQUE7UUFDaEIsQ0FBQSxHQUFJO0FBQ0osZUFBTSxDQUFBLEdBQUksUUFBUSxDQUFDLE1BQW5CO1VBQ0ksT0FBQSxHQUFVLFFBQVMsQ0FBQSxDQUFBO1VBRW5CLElBQUcsQ0FBQyxPQUFPLENBQUMsT0FBVCxJQUFvQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBeEM7WUFDSSxRQUFRLENBQUMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQURKO1dBQUEsTUFBQTtZQUdJLENBQUEsR0FISjs7UUFISjtBQUhKO0FBRko7QUFjQSxXQUFPO0VBZlU7OztBQWdCckI7Ozs7Ozs7Ozs7RUFTYSxnQ0FBQTtJQUNULHlEQUFBLFNBQUE7O0FBRUE7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxXQUFELEdBQWU7O0FBRWY7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxlQUFELEdBQW1COztBQUVuQjs7Ozs7SUFLQSxJQUFDLENBQUEsVUFBRCxHQUFjO0VBN0NMOzs7QUErQ2I7Ozs7OzttQ0FLQSxLQUFBLEdBQU8sU0FBQTtJQUNILElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO1dBQ1osSUFBQyxDQUFBLFdBQUQsR0FB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QUFDLHNCQUFILEdBQTRCOztBQUM1QixFQUFFLENBQUMsWUFBSCxHQUFrQjs7QUFDbEIsRUFBRSxDQUFDLGtCQUFILEdBQTRCLElBQUEsc0JBQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0V2ZW50RW1pdHRlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0V2ZW50RW1pdHRlciBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICNAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJoYW5kbGVyc1wiXVxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICogXG4gICAgKiBAbWV0aG9kIG9uRGF0YUJ1bmRsZVJlc3RvcmUuXG4gICAgKiBAcGFyYW0gT2JqZWN0IGRhdGEgLSBUaGUgZGF0YS1idW5kbGVcbiAgICAqIEBwYXJhbSBncy5PYmplY3RDb2RlY0NvbnRleHQgY29udGV4dCAtIFRoZSBjb2RlYy1jb250ZXh0LlxuICAgICMjI1xuICAgIG9uRGF0YUJ1bmRsZVJlc3RvcmU6IChkYXRhLCBjb250ZXh0KSAtPlxuICAgICAgICBmb3IgayBvZiBAaGFuZGxlcnNcbiAgICAgICAgICAgIGxpc3QgPSBAaGFuZGxlcnNba11cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4ubGlzdC5sZW5ndGhdXG4gICAgICAgICAgICAgICAgaGFuZGxlcnMgPSBsaXN0W2ldXG4gICAgICAgICAgICAgICAgaiA9IDBcbiAgICAgICAgICAgICAgICB3aGlsZSBqIDwgaGFuZGxlcnMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tqXVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgIWhhbmRsZXIuaGFuZGxlciBvciAhaGFuZGxlci5oYW5kbGVyLiR2bm1fY2JcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShqLCAxKVxuICAgICAgICAgICAgICAgICAgICBlbHNlICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaisrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAjQGhhbmRsZXJzID0ge31cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAjIyMqXG4gICAgKiBBIGNvbXBvbmVudCB3aGljaCBhbGxvdyBhIGdhbWUgb2JqZWN0IHRvIGZpcmUgZXZlbnRzIGFuZCBtYW5hZ2UgYSBsaXN0XG4gICAgKiBvZiBvYnNlcnZlcnMuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9FdmVudEVtaXR0ZXJcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogTGlzdCBvZiByZWdpc3RlcmVkIG9ic2VydmVycy5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBoYW5kbGVyc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICMjI1xuICAgICAgICBAaGFuZGxlcnMgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBkZWZhdWx0RGF0YVxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICMjI1xuICAgICAgICBAZGVmYXVsdERhdGEgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBjaGFpbkluZm9cbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQGNoYWluSW5mbyA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IG5lZWRzU29ydFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQG5lZWRzU29ydCA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IG1hcmtlZEZvclJlbW92ZVxuICAgICAgICAqIEB0eXBlIE9iamVjdFtdXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEBtYXJrZWRGb3JSZW1vdmUgPSBbXVxuICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGlzRW1pdHRpbmdcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQGlzRW1pdHRpbmcgPSAwXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2xlYXJzIHRoZSBldmVudCBlbWl0dGVyIGJ5IHJlbW92aW5nIGFsbCBoYW5kbGVycy9saXN0ZW5lcnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhclxuICAgICMjIyBcbiAgICBjbGVhcjogLT5cbiAgICAgICAgQG5lZWRzU29ydCA9IHt9XG4gICAgICAgIEBoYW5kbGVycyA9IHt9XG4gICAgICAgIEBkZWZhdWx0RGF0YSA9IHt9XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFkZHMgYSBuZXcgb2JzZXJ2ZXIvbGlzdGVuZXIgZm9yIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBUaGUgZXZlbnQgbmFtZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBUaGUgaGFuZGxlci1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWQuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW2RhdGE9e31dIC0gQW4gb3B0aW9uYWwgaW5mby1vYmplY3QgcGFzc2VkIHRvIHRoZSBoYW5kbGVyLWZ1bmN0aW9uLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvd25lcj1udWxsXSAtIEFuIG9wdGlvbmFsIG93bmVyLW9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhlIG9ic2VydmVyL2xpc3RlbmVyLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHByaW9yaXR5IC0gQW4gb3B0aW9uYWwgcHJpb3JpdHkgbGV2ZWwuIEFuIG9ic2VydmVyL2xpc3RlbmVyIHdpdGggYSBoaWdoZXIgbGV2ZWwgd2lsbCByZWNlaXZlIHRoZSBldmVudCBiZWZvcmUgb2JzZXJ2ZXJzL2xpc3RlbmVycyB3aXRoIGEgbG93ZXIgbGV2ZWwuXG4gICAgKiBAcmV0dXJuIHtncy5FdmVudE9ic2VydmVyfSAtIFRoZSBhZGRlZCBvYnNlcnZlci1vYmplY3QuXG4gICAgIyMjICAgIFxuICAgIG9uOiAoZXZlbnROYW1lLCBoYW5kbGVyLCBkYXRhLCBvd25lciwgcHJpb3JpdHkpIC0+XG4gICAgICAgIHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMFxuICAgICAgICBAbmVlZHNTb3J0W2V2ZW50TmFtZV0gPSB0cnVlXG4gICAgICAgIGlmIG5vdCBAaGFuZGxlcnNbZXZlbnROYW1lXT9cbiAgICAgICAgICAgIEBoYW5kbGVyc1tldmVudE5hbWVdID0gW11cbiAgICAgICAgaWYgbm90IEBoYW5kbGVyc1tldmVudE5hbWVdW3ByaW9yaXR5XVxuICAgICAgICAgICAgQGhhbmRsZXJzW2V2ZW50TmFtZV1bcHJpb3JpdHldID0gW11cbiAgICAgICAgICAgIFxuICAgICAgICBoYW5kbGVyT2JqZWN0ID0geyBoYW5kbGVyOiBoYW5kbGVyLCBvbmNlOiBubywgZGF0YTogZGF0YSwgb3duZXI6IG93bmVyLCBldmVudE5hbWU6IGV2ZW50TmFtZSwgcHJpb3JpdHk6IHByaW9yaXR5IH1cbiAgICAgICAgQGhhbmRsZXJzW2V2ZW50TmFtZV1bcHJpb3JpdHldLnB1c2goaGFuZGxlck9iamVjdClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBoYW5kbGVyT2JqZWN0XG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBhIG5ldyBvYnNlcnZlci9saXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQgYW5kIHJlbW92ZXMgaXRcbiAgICAqIGFmdGVyIHRoZSBldmVuIGhhcyBiZWVuIGVtaXR0ZWQgb25jZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uY2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBUaGUgZXZlbnQgbmFtZS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBUaGUgaGFuZGxlci1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWQuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW2RhdGE9e31dIC0gQW4gb3B0aW9uYWwgaW5mby1vYmplY3QgcGFzc2VkIHRvIHRoZSBoYW5kbGVyLWZ1bmN0aW9uLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvd25lcj1udWxsXSAtIEFuIG9wdGlvbmFsIG93bmVyLW9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhlIG9ic2VydmVyL2xpc3RlbmVyLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHByaW9yaXR5IC0gQW4gb3B0aW9uYWwgcHJpb3JpdHkgbGV2ZWwuIEFuIG9ic2VydmVyL2xpc3RlbmVyIHdpdGggYSBoaWdoZXIgbGV2ZWwgd2lsbCByZWNlaXZlIHRoZSBldmVudCBiZWZvcmUgb2JzZXJ2ZXJzL2xpc3RlbmVycyB3aXRoIGEgbG93ZXIgbGV2ZWwuXG4gICAgKiBAcmV0dXJuIHtncy5FdmVudE9ic2VydmVyfSAtIFRoZSBhZGRlZCBvYnNlcnZlci1vYmplY3QuXG4gICAgIyMjICAgICAgICBcbiAgICBvbmNlOiAoZXZlbnROYW1lLCBoYW5kbGVyLCBkYXRhLCBvd25lciwgcHJpb3JpdHkpIC0+XG4gICAgICAgIGhhbmRsZXJPYmplY3QgPSBAb24oZXZlbnROYW1lLCBoYW5kbGVyLCBkYXRhLCBvd25lciwgcHJpb3JpdHkpXG4gICAgICAgIGhhbmRsZXJPYmplY3Qub25jZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGhhbmRsZXJPYmplY3RcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVtb3ZlcyBhbiBvYnNlcnZlci9saXN0ZW5lciBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LiBJZiBoYW5kbGVyIHBhcmFtZXRlclxuICAgICogaXMgbnVsbCwgYWxsIG9ic2VydmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudCBhcmUgcmVtb3ZlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9mZlxuICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBldmVudCBuYW1lLlxuICAgICogQHBhcmFtIHtncy5FdmVudE9ic2VydmVyfSBbaGFuZGxlcj1udWxsXSAtIFRoZSBvYnNlcnZlci1vYmplY3QgdG8gcmVtb3ZlLiBcbiAgICAqIElmIG51bGwsIGFsbCBvYnNlcnZlcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQgYXJlIHJlbW92ZWQuXG4gICAgIyMjICAgIFxuICAgIG9mZjogKGV2ZW50TmFtZSwgaGFuZGxlcikgLT5cbiAgICAgICAgaWYgQGlzRW1pdHRpbmcgPiAwIGFuZCBoYW5kbGVyXG4gICAgICAgICAgICBAbWFya2VkRm9yUmVtb3ZlLnB1c2goaGFuZGxlcilcbiAgICAgICAgZWxzZSBpZiBoYW5kbGVyP1xuICAgICAgICAgICAgQGhhbmRsZXJzW2V2ZW50TmFtZV0/W2hhbmRsZXIucHJpb3JpdHldPy5yZW1vdmUoaGFuZGxlcilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGhhbmRsZXJzW2V2ZW50TmFtZV0gPSBbXVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVtb3ZlcyBhbGwgb2JzZXJ2ZXJzL2xpc3RlbmVycyBmcm9tIGFuIGV2ZW50IHdoaWNoIGFyZSBiZWxvbmdpbmcgdG8gdGhlIHNwZWNpZmllZFxuICAgICogb3duZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCBvZmZCeU93bmVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIGV2ZW50IG5hbWUuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXIgLSBUaGUgb3duZXIuXG4gICAgKiBAcmV0dXJuIHtudW1iZXJ9IENvdW50IG9mIHJlbW92ZWQgb2JzZXJ2ZXJzL2xpc3RlbmVycy5cbiAgICAjIyNcbiAgICBvZmZCeU93bmVyOiAoZXZlbnROYW1lLCBvd25lcikgLT5cbiAgICAgICAgaWYgQGhhbmRsZXJzW2V2ZW50TmFtZV1cbiAgICAgICAgICAgIGlmIEBpc0VtaXR0aW5nID4gMFxuICAgICAgICAgICAgICAgIGZvciBoYW5kbGVyTGlzdCBpbiBAaGFuZGxlcnNbZXZlbnROYW1lXVxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVycyA9IGhhbmRsZXJMaXN0Py53aGVyZSAoeCkgLT4geC5vd25lciA9PSBvd25lclxuICAgICAgICAgICAgICAgICAgICBmb3IgaGFuZGxlciBpbiBoYW5kbGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgQG1hcmtlZEZvclJlbW92ZS5wdXNoKGhhbmRsZXIpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yIGhhbmRsZXJMaXN0IGluIEBoYW5kbGVyc1tldmVudE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXJMaXN0LnJlbW92ZUFsbCgoeCkgLT4geC5vd25lciA9PSBvd25lcilcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRW1pdHMgdGhlIHNwZWNpZmllZCBldmVudC4gQWxsIG9ic2VydmVycy9saXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgdGhlXG4gICAgKiBzcGVjaWZpZWQgZXZlbnQgYXJlIGluZm9ybWVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgZW1pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBldmVudCB0byBmaXJlLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtzZW5kZXI9bnVsbF0gLSBUaGUgc2VuZGVyIG9mIHRoZSBldmVudC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbZGF0YT17fV0gLSBBbiBvcHRpb25hbCBvYmplY3QgcGFzc2VkIHRvIGVhY2ggaGFuZGxlci1mdW5jdGlvbi5cbiAgICAjIyMgICAgICBcbiAgICBlbWl0OiAoZXZlbnROYW1lLCBzZW5kZXIsIGRhdGEpIC0+XG4gICAgICAgIGhhbmRsZXJMaXN0cyA9IEBoYW5kbGVyc1tldmVudE5hbWVdXG4gICAgICAgIGRhdGEgPSBkYXRhID8gQGRlZmF1bHREYXRhXG4gICAgICAgIFxuICAgICAgICBpZiBoYW5kbGVyTGlzdHMgYW5kIEBuZWVkc1NvcnRbZXZlbnROYW1lXVxuICAgICAgICAgICAgQG5lZWRzU29ydFtldmVudE5hbWVdID0gbm9cbiAgICAgICAgICAgIGZvciBoYW5kbGVyTGlzdCBpbiBoYW5kbGVyTGlzdHNcbiAgICAgICAgICAgICAgICBoYW5kbGVyTGlzdC5zb3J0IChhLCBiKSAtPlxuICAgICAgICAgICAgICAgICAgICBpZiBhLm93bmVyIGFuZCBiLm93bmVyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhLm93bmVyLnJJbmRleCA+IGIub3duZXIuckluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBhLm93bmVyLnJJbmRleCA8IGIub3duZXIuckluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGhhbmRsZXJMaXN0cz9cbiAgICAgICAgICAgIGZvciBoYW5kbGVyTGlzdCBpbiBoYW5kbGVyTGlzdHMgYnkgLTFcbiAgICAgICAgICAgICAgICBpZiAhaGFuZGxlckxpc3QgdGhlbiBjb250aW51ZVxuICAgICAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICAgICAgY291bnQgPSBoYW5kbGVyTGlzdC5sZW5ndGhcbiAgICAgICAgICAgICAgICBAaXNFbWl0dGluZysrXG4gICAgICAgICAgICAgICAgd2hpbGUgaSA8IGNvdW50XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyTGlzdFtpXVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5oYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnNlbmRlciA9IHNlbmRlclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEgPSBoYW5kbGVyLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICFoYW5kbGVyLm93bmVyIG9yICFoYW5kbGVyLm93bmVyLnZpc2libGU/IG9yIGhhbmRsZXIub3duZXIudmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5oYW5kbGVyKGRhdGEpIFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGhhbmRsZXIub25jZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG1hcmtlZEZvclJlbW92ZS5wdXNoKGhhbmRsZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgZGF0YS5icmVha0NoYWluXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJyZWFrQ2hhaW4gPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgICAgIEBpc0VtaXR0aW5nLS1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICFAaXNFbWl0dGluZyBhbmQgQG1hcmtlZEZvclJlbW92ZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgZm9yIGhhbmRsZXIgaW4gQG1hcmtlZEZvclJlbW92ZVxuICAgICAgICAgICAgICAgICAgICBAaGFuZGxlcnNbaGFuZGxlci5ldmVudE5hbWVdW2hhbmRsZXIucHJpb3JpdHldLnJlbW92ZShoYW5kbGVyKVxuICAgICAgICAgICAgICAgIEBtYXJrZWRGb3JSZW1vdmUgPSBbXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgIFxuXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGlmIGFuIGV2ZW50LWhhbmRsZXIgd2l0aCBhIHNwZWNpZmllZCBvd25lciBleGlzdHMgZm9yIHRoZVxuICAgICogZ2l2ZW4gZXZlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGVja0Zvck93bmVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gVGhlIGV2ZW50IG5hbWUuXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvd25lciAtIFRoZSBvd25lciB0byBzZWFyY2ggZm9yLlxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgPGI+dHJ1ZTwvYj4sIGFuIGV2ZW50LWhhbmRsZXIgd2l0aCB0aGUgc3BlY2lmaWVkIG93bmVyXG4gICAgKiBleGlzdHMgZm9yIHRoZSBnaXZlbiBldmVudC4gT3RoZXJ3aXNlIDxiPmZhbHNlPC9iPi5cbiAgICAjIyMgIFxuICAgIGNoZWNrRm9yT3duZXI6IChldmVudE5hbWUsIG93bmVyKSAtPlxuICAgICAgICByZXN1bHQgPSBub1xuICAgICAgICBcbiAgICAgICAgZm9yIGhhbmRsZXIgaW4gQGhhbmRsZXJzW2V2ZW50TmFtZV1cbiAgICAgICAgICAgIGlmIGhhbmRsZXIub3duZXIgPT0gb3duZXJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB5ZXNcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENoZWNrcyBpZiBhbiBldmVudC1oYW5kbGVyIHdpdGggYSBzcGVjaWZpZWQgaGFuZGxlci1mdW5jdGlvbiBleGlzdHMgZm9yIHRoZVxuICAgICogZ2l2ZW4gZXZlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGVja0ZvckhhbmRsZXJGdW5jdGlvblxuICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBldmVudCBuYW1lLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlckZ1bmN0aW9uIC0gVGhlIGhhbmRsZXItZnVuY3Rpb24gdG8gc2VhcmNoIGZvci5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIHRydWUsIGFuIG9ic2VydmVyIHdpdGh0IGhlIHNwZWNpZmllZCBoYW5kbGVyLWZ1bmN0aW9uXG4gICAgKiBleGlzdHMgZm9yIHRoZSBnaXZlbiBldmVudC4gT3RoZXJ3aXNlIGZhbHNlLlxuICAgICMjIyAgXG4gICAgY2hlY2tGb3JIYW5kbGVyRnVuY3Rpb246IChldmVudE5hbWUsIGhhbmRsZXJGdW5jdGlvbikgLT4gXG4gICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgIFxuICAgICAgICBpZiBoYW5kbGVyRnVuY3Rpb24/XG4gICAgICAgICAgICBmb3IgaGFuZGxlciBpbiBAaGFuZGxlcnNbZXZlbnROYW1lXVxuICAgICAgICAgICAgICAgIGlmIGhhbmRsZXIuaGFuZGxlciA9PSBoYW5kbGVyRnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIE5vdCBpbXBsZW1lbnRlZCB5ZXQuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyBcbiAgICAjIEZJWE1FOiBXaHkgc2hvdWxkIGV2ZW50LWVtaXR0ZXIgaW5mbHVlbmNlIHRoZSBhY3RpdmUtcHJvcGVydHk/XG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBAb2JqZWN0LmFjdGl2ZSA9IEBvYmplY3QuYWN0aXZlIGFuZCAoIUBvYmplY3QucGFyZW50IG9yIEBvYmplY3QucGFyZW50LmFjdGl2ZSlcbiAgICAgICAgXG5ncy5Db21wb25lbnRfRXZlbnRFbWl0dGVyID0gQ29tcG9uZW50X0V2ZW50RW1pdHRlclxuZ3MuRXZlbnRFbWl0dGVyID0gQ29tcG9uZW50X0V2ZW50RW1pdHRlclxuZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyID0gbmV3IENvbXBvbmVudF9FdmVudEVtaXR0ZXIoKSJdfQ==
//# sourceURL=Component_EventEmitter_149.js