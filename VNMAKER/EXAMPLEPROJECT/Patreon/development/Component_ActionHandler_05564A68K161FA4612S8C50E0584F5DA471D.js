var Component_ActionHandler,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ActionHandler = (function(superClass) {
  extend(Component_ActionHandler, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_ActionHandler.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * An action-handler component allows a UI game object to execute
  * actions. An action can be a method-call of a component or of the scene which
  * always takes two parameters: Sender and Params. For more info about
  * UI actions, see help-file.
  * 
  * @module ui
  * @class Component_ActionHandler
  * @extends ui.Component_Handler
  * @memberof ui
  * @constructor
   */

  function Component_ActionHandler() {

    /**
    * @property initialized
    * @type boolean
    * @protected
     */
    this.initialized = false;

    /**
    * Counter for delayed/timed actions.
    * @property waitCounter
    * @type number
    * @protected
     */
    this.waitCounter = 0;

    /**
    * Indicates if the mouse/touch pointer is inside the UI object's bounds.
    * @property contains
    * @type boolean
    * @protected
     */
    this.containsPointer = false;
  }


  /**
  * Disposes the component.
  *
  * @method dispose
   */

  Component_ActionHandler.prototype.dispose = function() {
    Component_ActionHandler.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    return gs.GlobalEventManager.offByOwner("mouseMoved", this.object);
  };


  /**
  * Adds event-handler for mouse/touch events to update the component only if 
  * a user-action happened.
  *
  * @method setupEventHandlers
   */

  Component_ActionHandler.prototype.setupEventHandlers = function() {
    var ref;
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("mouseMoved", this.object);
    if (this.object.focusable) {
      gs.GlobalEventManager.on("keyUp", ((function(_this) {
        return function(e) {
          if (Input.release(Input.KEY_RETURN) && _this.object.ui.focused) {
            _this.object.needsUpdate = true;
            return _this.executeActions();
          }
        };
      })(this)), null, this.object);
    }
    gs.GlobalEventManager.on("mouseUp", ((function(_this) {
      return function(e) {
        var action, actions, contains, exec, i, len;
        contains = Rect.contains(_this.object.dstRect.x, _this.object.dstRect.y, _this.object.dstRect.width, _this.object.dstRect.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y);
        if (contains) {
          exec = false;
          actions = actions || _this.object.actions;
          if (actions != null) {
            for (i = 0, len = actions.length; i < len; i++) {
              action = actions[i];
              exec = _this.checkAction(action) && !_this.checkActionWait(action);
              if (exec) {
                break;
              }
            }
          }
          if (exec) {
            e.breakChain = true;
            _this.executeActions();
          }
          return _this.object.needsUpdate = true;
        }
      };
    })(this)), null, this.object);
    if ((ref = this.object.actions) != null ? ref.first(function(a) {
      return a && (a.event === "onMouseEnter" || a.event === "onMouseLeave" || a.event === "onMouseHover");
    }) : void 0) {
      gs.GlobalEventManager.on("mouseMoved", ((function(_this) {
        return function(e) {
          var contains;
          contains = Rect.contains(_this.object.dstRect.x, _this.object.dstRect.y, _this.object.dstRect.width, _this.object.dstRect.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y);
          if (_this.containsPointer !== contains) {
            _this.containsPointer = contains;
            return _this.object.needsUpdate = true;
          }
        };
      })(this)), null, this.object);
    }
    return this.object.events.on("action", (function(_this) {
      return function(e) {
        if (e.actions || e.action) {
          return _this.executeAction(e.actions != null ? e.actions[0] : e.action);
        }
      };
    })(this));
  };


  /**
  * Sets up associated actions. Each action is validated and specific default values for the action-target
  * and other options are set if not specified.
  *
  * @method setupActions
   */

  Component_ActionHandler.prototype.setupActions = function() {
    var action, component, i, len, ref, results, target, targets;
    if (this.object.actions != null) {
      ref = this.object.actions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        action = ref[i];
        if (!action) {
          continue;
        }
        if (!action.event) {
          action.event = "onAction";
        }
        if (action.wait != null) {
          continue;
        }
        if (action.target == null) {
          action.target = this.object.controller;
        }
        if (typeof action.target === "string") {
          if (action.target.contains(".")) {
            action.target = ui.Component_FormulaHandler.fieldValue(this.object, action.target);
          }
          targets = action.target.split(".");
          target = gs.ObjectManager.current.objectById(targets[0]);
          if (target != null) {
            component = target.findComponentById(targets[1]);
            if (component == null) {
              target = target.components.where(function(v) {
                return typeof v[action.name] === "function";
              }).first();
            } else {
              target = component;
            }
          } else {
            target = this.object;
          }
          action.target = target;
        }
        if (action.condition != null) {
          action.conditions = [action.condition];
          results.push(delete action.condition);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Initializes the action-handler.
  * 
  * @method setup
   */

  Component_ActionHandler.prototype.setup = function() {
    this.initialized = true;
    this.setupEventHandlers();
    return this.setupActions();
  };


  /**
  * Updates the action-handler.
  * 
  * @method update
   */

  Component_ActionHandler.prototype.update = function() {};

  Component_ActionHandler.prototype.checkAction = function(action) {
    return ((action != null ? action.event : void 0) || (action != null ? action.events : void 0)) && this.checkObject(action);
  };

  Component_ActionHandler.prototype.checkActionWait = function(action) {
    var result;
    result = false;
    if ((action.wait != null) && action.wait > 0) {
      this.waitCounter = action.wait;
      action.wait = 0;
      result = true;
    }
    return result;
  };

  Component_ActionHandler.prototype.updateActionTarget = function(action) {
    var component, target, targets;
    if (action.target == null) {
      action.target = this.object.controller;
    }
    if (action.target.exec || typeof action.target === "string") {
      if (action.target.exec) {
        action.target = ui.Component_FormulaHandler.fieldValue(this.object, action.target);
      }
      targets = action.target.split(".");
      target = gs.ObjectManager.current.objectById(targets[0]);
      if (target != null) {
        component = target.findComponentById(targets[1]);
        if (component == null) {
          target = target.components.where(function(v) {
            return typeof v[action.name] === "function";
          }).first();
        } else {
          target = component;
        }
      } else {
        target = this.object;
      }
      return action.target = target;
    }
  };

  Component_ActionHandler.prototype.canExecuteActions = function() {
    return this.waitCounter <= 0 && this.object.ui.enabled && this.object.visible;
  };


  /**
  * Executes the specified actions. A single action is only executed if
  * all assigned events and conditions are true.
  * 
  * @method executeActions
  * @return If <b>true</b> there was at least one action executed. Otherwise <b>false</b>
   */

  Component_ActionHandler.prototype.executeActions = function(actions) {
    var action, i, len, result;
    if (!this.canExecuteActions()) {
      return;
    }
    result = false;
    actions = actions || this.object.actions;
    if (actions != null) {
      for (i = 0, len = actions.length; i < len; i++) {
        action = actions[i];
        if (!this.checkAction(action)) {
          continue;
        }
        if (this.checkActionWait(action)) {
          break;
        }
        this.updateActionTarget(action);
        this.executeAction(action);
        result = true;
      }
    }
    return result;
  };


  /**
  * Executes the specified action if all assigned events and conditions
  * are true.
  * 
  * @method executeAction
  * @param {Object} action The action to execute.
   */

  Component_ActionHandler.prototype.executeAction = function(action) {
    var name, target;
    target = action.target || this.object.target;
    if (target != null) {
      if (action.sound) {
        AudioManager.playSound(action.sound);
      }
      return typeof target[name = action.name] === "function" ? target[name](this.object, action.params) : void 0;
    }
  };

  return Component_ActionHandler;

})(ui.Component_Handler);

ui.Component_ActionHandler = Component_ActionHandler;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O29DQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7OztFQVlhLGlDQUFBOztBQUNUOzs7OztJQUtBLElBQUMsQ0FBQSxXQUFELEdBQWU7O0FBRWY7Ozs7OztJQU1BLElBQUMsQ0FBQSxXQUFELEdBQWU7O0FBRWY7Ozs7OztJQU1BLElBQUMsQ0FBQSxlQUFELEdBQW1CO0VBdEJWOzs7QUF5QmI7Ozs7OztvQ0FLQSxPQUFBLEdBQVMsU0FBQTtJQUNMLHNEQUFBLFNBQUE7SUFFQSxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBdEIsQ0FBaUMsT0FBakMsRUFBMEMsSUFBQyxDQUFBLE1BQTNDO0lBQ0EsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQXRCLENBQWlDLFNBQWpDLEVBQTRDLElBQUMsQ0FBQSxNQUE3QztXQUNBLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUF0QixDQUFpQyxZQUFqQyxFQUErQyxJQUFDLENBQUEsTUFBaEQ7RUFMSzs7O0FBUVQ7Ozs7Ozs7b0NBTUEsa0JBQUEsR0FBb0IsU0FBQTtBQUNoQixRQUFBO0lBQUEsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQXRCLENBQWlDLE9BQWpDLEVBQTBDLElBQUMsQ0FBQSxNQUEzQztJQUNBLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUF0QixDQUFpQyxTQUFqQyxFQUE0QyxJQUFDLENBQUEsTUFBN0M7SUFDQSxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBdEIsQ0FBaUMsWUFBakMsRUFBK0MsSUFBQyxDQUFBLE1BQWhEO0lBR0EsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVg7TUFDSSxFQUFFLENBQUMsa0JBQWtCLENB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QUUsQ0FBQyx1QkFBSCxHQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0FjdGlvbkhhbmRsZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9BY3Rpb25IYW5kbGVyIGV4dGVuZHMgdWkuQ29tcG9uZW50X0hhbmRsZXJcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFuIGFjdGlvbi1oYW5kbGVyIGNvbXBvbmVudCBhbGxvd3MgYSBVSSBnYW1lIG9iamVjdCB0byBleGVjdXRlXG4gICAgKiBhY3Rpb25zLiBBbiBhY3Rpb24gY2FuIGJlIGEgbWV0aG9kLWNhbGwgb2YgYSBjb21wb25lbnQgb3Igb2YgdGhlIHNjZW5lIHdoaWNoXG4gICAgKiBhbHdheXMgdGFrZXMgdHdvIHBhcmFtZXRlcnM6IFNlbmRlciBhbmQgUGFyYW1zLiBGb3IgbW9yZSBpbmZvIGFib3V0XG4gICAgKiBVSSBhY3Rpb25zLCBzZWUgaGVscC1maWxlLlxuICAgICogXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0FjdGlvbkhhbmRsZXJcbiAgICAqIEBleHRlbmRzIHVpLkNvbXBvbmVudF9IYW5kbGVyXG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGluaXRpYWxpemVkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbml0aWFsaXplZCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ291bnRlciBmb3IgZGVsYXllZC90aW1lZCBhY3Rpb25zLlxuICAgICAgICAqIEBwcm9wZXJ0eSB3YWl0Q291bnRlclxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB3YWl0Q291bnRlciA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1vdXNlL3RvdWNoIHBvaW50ZXIgaXMgaW5zaWRlIHRoZSBVSSBvYmplY3QncyBib3VuZHMuXG4gICAgICAgICogQHByb3BlcnR5IGNvbnRhaW5zXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb250YWluc1BvaW50ZXIgPSBub1xuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBjb21wb25lbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZVVwXCIsIEBvYmplY3QpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwibW91c2VNb3ZlZFwiLCBAb2JqZWN0KVxuICAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXIgZm9yIG1vdXNlL3RvdWNoIGV2ZW50cyB0byB1cGRhdGUgdGhlIGNvbXBvbmVudCBvbmx5IGlmIFxuICAgICogYSB1c2VyLWFjdGlvbiBoYXBwZW5lZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZVVwXCIsIEBvYmplY3QpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwibW91c2VNb3ZlZFwiLCBAb2JqZWN0KVxuICAgICAgIFxuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5mb2N1c2FibGVcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcImtleVVwXCIsICgoZSkgPT4gXG4gICAgICAgICAgICAgICAgaWYgSW5wdXQucmVsZWFzZShJbnB1dC5LRVlfUkVUVVJOKSBhbmQgQG9iamVjdC51aS5mb2N1c2VkXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgQGV4ZWN1dGVBY3Rpb25zKClcbiAgICAgICAgICAgICksIG51bGwsIEBvYmplY3RcbiAgICAgICAgXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIm1vdXNlVXBcIiwgKChlKSA9PiBcbiAgICAgICAgICAgIGNvbnRhaW5zID0gUmVjdC5jb250YWlucyhAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIFxuICAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC53aWR0aCwgQG9iamVjdC5kc3RSZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICBpZiBjb250YWluc1xuICAgICAgICAgICAgICAgIGV4ZWMgPSBub1xuICAgICAgICAgICAgICAgIGFjdGlvbnMgPSBhY3Rpb25zIHx8IEBvYmplY3QuYWN0aW9uc1xuICAgICAgICAgICAgICAgIGlmIGFjdGlvbnM/XG4gICAgICAgICAgICAgICAgICAgIGZvciBhY3Rpb24gaW4gYWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhlYyA9IEBjaGVja0FjdGlvbihhY3Rpb24pIGFuZCAhQGNoZWNrQWN0aW9uV2FpdChhY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBpZiBleGVjXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBleGVjXG4gICAgICAgICAgICAgICAgICAgIGUuYnJlYWtDaGFpbiA9IHllc1xuICAgICAgICAgICAgICAgICAgICBAZXhlY3V0ZUFjdGlvbnMoKVxuICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgKSwgbnVsbCwgQG9iamVjdFxuICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmFjdGlvbnM/LmZpcnN0KChhKSAtPiBhIGFuZCAoYS5ldmVudCA9PSBcIm9uTW91c2VFbnRlclwiIG9yIGEuZXZlbnQgPT0gXCJvbk1vdXNlTGVhdmVcIiBvciBhLmV2ZW50ID09IFwib25Nb3VzZUhvdmVyXCIpKVxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwibW91c2VNb3ZlZFwiLCAoKGUpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbnMgPSBSZWN0LmNvbnRhaW5zKEBvYmplY3QuZHN0UmVjdC54LCBAb2JqZWN0LmRzdFJlY3QueSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgIElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54LCBJbnB1dC5Nb3VzZS55IC0gQG9iamVjdC5vcmlnaW4ueSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIEBjb250YWluc1BvaW50ZXIgIT0gY29udGFpbnNcbiAgICAgICAgICAgICAgICAgICAgQGNvbnRhaW5zUG9pbnRlciA9IGNvbnRhaW5zXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBudWxsLCBAb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgQG9iamVjdC5ldmVudHMub24gXCJhY3Rpb25cIiwgKGUpID0+XG4gICAgICAgICAgICBpZiBlLmFjdGlvbnMgb3IgZS5hY3Rpb25cbiAgICAgICAgICAgICAgICBAZXhlY3V0ZUFjdGlvbihpZiBlLmFjdGlvbnM/IHRoZW4gZS5hY3Rpb25zWzBdIGVsc2UgZS5hY3Rpb24pXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdXAgYXNzb2NpYXRlZCBhY3Rpb25zLiBFYWNoIGFjdGlvbiBpcyB2YWxpZGF0ZWQgYW5kIHNwZWNpZmljIGRlZmF1bHQgdmFsdWVzIGZvciB0aGUgYWN0aW9uLXRhcmdldFxuICAgICogYW5kIG90aGVyIG9wdGlvbnMgYXJlIHNldCBpZiBub3Qgc3BlY2lmaWVkLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBBY3Rpb25zXG4gICAgIyMjICAgICAgICBcbiAgICBzZXR1cEFjdGlvbnM6IC0+XG4gICAgICAgIGlmIEBvYmplY3QuYWN0aW9ucz9cbiAgICAgICAgICAgIGZvciBhY3Rpb24gaW4gQG9iamVjdC5hY3Rpb25zXG4gICAgICAgICAgICAgICAgY29udGludWUgdW5sZXNzIGFjdGlvblxuICAgICAgICAgICAgICAgIGlmIG5vdCBhY3Rpb24uZXZlbnQgdGhlbiBhY3Rpb24uZXZlbnQgPSBcIm9uQWN0aW9uXCJcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24ud2FpdD8gdGhlbiBjb250aW51ZVxuICAgICAgICAgICAgICAgIGlmIG5vdCBhY3Rpb24udGFyZ2V0PyB0aGVuIGFjdGlvbi50YXJnZXQgPSBAb2JqZWN0LmNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICBpZiB0eXBlb2YgYWN0aW9uLnRhcmdldCA9PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdGlvbi50YXJnZXQuY29udGFpbnMoXCIuXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb24udGFyZ2V0ID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoQG9iamVjdCwgYWN0aW9uLnRhcmdldClcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0cyA9IGFjdGlvbi50YXJnZXQuc3BsaXQoXCIuXCIpXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKHRhcmdldHNbMF0pXG4gICAgICAgICAgICAgICAgICAgIGlmIHRhcmdldD9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHRhcmdldC5maW5kQ29tcG9uZW50QnlJZCh0YXJnZXRzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IGNvbXBvbmVudD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuY29tcG9uZW50cy53aGVyZSgodikgLT4gdHlwZW9mIHZbYWN0aW9uLm5hbWVdID09IFwiZnVuY3Rpb25cIikuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBAb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi50YXJnZXQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24uY29uZGl0aW9uP1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24uY29uZGl0aW9ucyA9IFthY3Rpb24uY29uZGl0aW9uXVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgYWN0aW9uLmNvbmRpdGlvblxuICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBhY3Rpb24taGFuZGxlci5cbiAgICAqIFxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSB5ZXNcbiAgICAgICAgXG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBAc2V0dXBBY3Rpb25zKCkgICAgXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGFjdGlvbi1oYW5kbGVyLlxuICAgICogXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cblxuICAgICAgXG4gICAgY2hlY2tBY3Rpb246IChhY3Rpb24pIC0+IChhY3Rpb24/LmV2ZW50IG9yIGFjdGlvbj8uZXZlbnRzKSBhbmQgQGNoZWNrT2JqZWN0KGFjdGlvbilcbiAgICBjaGVja0FjdGlvbldhaXQ6IChhY3Rpb24pIC0+XG4gICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgIFxuICAgICAgICBpZiBhY3Rpb24ud2FpdD8gYW5kIGFjdGlvbi53YWl0ID4gMFxuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gYWN0aW9uLndhaXRcbiAgICAgICAgICAgIGFjdGlvbi53YWl0ID0gMFxuICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIHVwZGF0ZUFjdGlvblRhcmdldDogKGFjdGlvbikgLT5cbiAgICAgICAgaWYgbm90IGFjdGlvbi50YXJnZXQ/IHRoZW4gYWN0aW9uLnRhcmdldCA9IEBvYmplY3QuY29udHJvbGxlclxuICAgICAgICBpZiBhY3Rpb24udGFyZ2V0LmV4ZWMgb3IgdHlwZW9mIGFjdGlvbi50YXJnZXQgPT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgaWYgYWN0aW9uLnRhcmdldC5leGVjXG4gICAgICAgICAgICAgICBhY3Rpb24udGFyZ2V0ID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoQG9iamVjdCwgYWN0aW9uLnRhcmdldClcbiAgICAgICAgICAgIHRhcmdldHMgPSBhY3Rpb24udGFyZ2V0LnNwbGl0KFwiLlwiKVxuICAgICAgICAgICAgdGFyZ2V0ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQodGFyZ2V0c1swXSlcbiAgICAgICAgICAgIGlmIHRhcmdldD9cbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPSB0YXJnZXQuZmluZENvbXBvbmVudEJ5SWQodGFyZ2V0c1sxXSlcbiAgICAgICAgICAgICAgICBpZiBub3QgY29tcG9uZW50P1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuY29tcG9uZW50cy53aGVyZSgodikgLT4gdHlwZW9mIHZbYWN0aW9uLm5hbWVdID09IFwiZnVuY3Rpb25cIikuZmlyc3QoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gY29tcG9uZW50XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gQG9iamVjdFxuICAgICAgICAgICAgYWN0aW9uLnRhcmdldCA9IHRhcmdldFxuICAgIFxuICAgIGNhbkV4ZWN1dGVBY3Rpb25zOiAtPiBAd2FpdENvdW50ZXIgPD0gMCBhbmQgQG9iamVjdC51aS5lbmFibGVkIGFuZCBAb2JqZWN0LnZpc2libGUgICAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyB0aGUgc3BlY2lmaWVkIGFjdGlvbnMuIEEgc2luZ2xlIGFjdGlvbiBpcyBvbmx5IGV4ZWN1dGVkIGlmXG4gICAgKiBhbGwgYXNzaWduZWQgZXZlbnRzIGFuZCBjb25kaXRpb25zIGFyZSB0cnVlLlxuICAgICogXG4gICAgKiBAbWV0aG9kIGV4ZWN1dGVBY3Rpb25zXG4gICAgKiBAcmV0dXJuIElmIDxiPnRydWU8L2I+IHRoZXJlIHdhcyBhdCBsZWFzdCBvbmUgYWN0aW9uIGV4ZWN1dGVkLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+XG4gICAgIyMjXG4gICAgZXhlY3V0ZUFjdGlvbnM6IChhY3Rpb25zKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBjYW5FeGVjdXRlQWN0aW9ucygpXG4gICAgICAgIFxuICAgICAgICByZXN1bHQgPSBub1xuICAgICAgICBhY3Rpb25zID0gYWN0aW9ucyB8fCBAb2JqZWN0LmFjdGlvbnNcbiAgICAgICAgaWYgYWN0aW9ucz9cbiAgICAgICAgICAgIGZvciBhY3Rpb24gaW4gYWN0aW9uc1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlIGlmIG5vdCBAY2hlY2tBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgICAgICAgIGJyZWFrIGlmIEBjaGVja0FjdGlvbldhaXQoYWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBAdXBkYXRlQWN0aW9uVGFyZ2V0KGFjdGlvbilcbiAgICAgICAgICAgICAgICBAZXhlY3V0ZUFjdGlvbihhY3Rpb24pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyB0aGUgc3BlY2lmaWVkIGFjdGlvbiBpZiBhbGwgYXNzaWduZWQgZXZlbnRzIGFuZCBjb25kaXRpb25zXG4gICAgKiBhcmUgdHJ1ZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCBleGVjdXRlQWN0aW9uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIFRoZSBhY3Rpb24gdG8gZXhlY3V0ZS5cbiAgICAjIyMgICAgICAgICAgICBcbiAgICBleGVjdXRlQWN0aW9uOiAoYWN0aW9uKSAtPlxuICAgICAgICB0YXJnZXQgPSBhY3Rpb24udGFyZ2V0IHx8IEBvYmplY3QudGFyZ2V0XG4gICAgICAgIFxuICAgICAgICBpZiB0YXJnZXQ/IFxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZChhY3Rpb24uc291bmQpIGlmIGFjdGlvbi5zb3VuZFxuICAgICAgICAgICAgdGFyZ2V0W2FjdGlvbi5uYW1lXT8oQG9iamVjdCwgYWN0aW9uLnBhcmFtcylcbiAgICAgICAgICAgIFxudWkuQ29tcG9uZW50X0FjdGlvbkhhbmRsZXIgPSBDb21wb25lbnRfQWN0aW9uSGFuZGxlciJdfQ==
//# sourceURL=Component_ActionHandler_122.js