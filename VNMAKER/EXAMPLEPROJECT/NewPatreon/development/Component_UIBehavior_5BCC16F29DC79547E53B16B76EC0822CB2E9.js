var Component_UIBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_UIBehavior = (function(superClass) {
  extend(Component_UIBehavior, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_UIBehavior.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * @module ui
  * @class Component_UIBehavior
  * @extends gs.Component
  * @memberof ui
  * @constructor
   */

  function Component_UIBehavior() {
    this.breakChainAt = null;
    this.containsPointer = false;
    this.isAnimating = false;
    this.viewData_ = [true, false, false, true, false];
    this.nextKeyObjectId = "";
    this.nextKeyObject_ = null;
    this.prevKeyObject_ = null;
  }

  Component_UIBehavior.accessors("nextKeyObject", {
    set: function(v) {
      this.nextKeyObject_ = v;
      if (v) {
        return v.ui.prevKeyObject_ = this.object;
      }
    },
    get: function() {
      return this.nextKeyObject_;
    }
  });

  Component_UIBehavior.accessors("prevKeyObject", {
    set: function(v) {
      this.prevKeyObject_ = v;
      if (v) {
        return v.ui.nextKeyObject_ = this.object;
      }
    },
    get: function() {
      return this.prevKeyObject_;
    }
  });

  Component_UIBehavior.accessors("selected", {
    set: function(v) {
      if (v !== this.viewData_[2]) {
        this.viewData_[2] = v;
        return this.updateStyle();
      }
    },
    get: function() {
      return this.viewData_[2];
    }
  });

  Component_UIBehavior.accessors("hover", {
    set: function(v) {
      if (v !== this.viewData_[1]) {
        this.viewData_[1] = v;
        return this.updateStyle();
      }
    },
    get: function() {
      return this.viewData_[1];
    }
  });

  Component_UIBehavior.accessors("enabled", {
    set: function(v) {
      if (v !== this.viewData_[3]) {
        this.viewData_[3] = v;
        return this.updateStyle();
      }
    },
    get: function() {
      return this.viewData_[3];
    }
  });

  Component_UIBehavior.accessors("focused", {
    set: function(v) {
      if (v !== this.viewData_[4]) {
        this.viewData_[4] = v;
        return this.updateStyle();
      }
    },
    get: function() {
      return this.viewData_[4];
    }
  });

  Component_UIBehavior.accessors("viewData", {
    set: function(v) {
      if (v !== this.viewData_) {
        this.viewData_ = v;
        return this.updateStyle();
      }
    },
    get: function() {
      return this.viewData_;
    }
  });


  /**
  * Prepares the UI-Object for display. This method should be called
  * before a new created UI-Object will be displayed to position all
  * sub-elements correctly.
  *
  * @method prepare
   */

  Component_UIBehavior.prototype.prepare = function() {
    var scene;
    scene = SceneManager.scene;
    scene.preparing = true;
    this.object.update();
    this.object.update();
    return scene.preparing = false;
  };


  /**
  * Executes an animation defined for the specified event. Each UI-Object
  * can have animations for certain events defined in JSON.
  *
  * @param {string} event - The event to execute the animation for such as "onTerminate" or "onInitialize". If
  * no animation has been defined for the specified event, nothing will happen and the callback will be called 
  * immediately.
  * @param {Function} callback - An optional callback function called when the animation ends.
  * @method executeAnimation
   */

  Component_UIBehavior.prototype.executeAnimation = function(event, callback) {
    var animation, i, len, object, ref, ref1;
    this.isAnimating = true;
    this.disappearCounter = this.object.subObjects.length + 1;
    this.disappearCallback = callback;
    ref = this.object.subObjects;
    for (i = 0, len = ref.length; i < len; i++) {
      object = ref[i];
      if (object.ui) {
        object.ui.executeAnimation(event, (function(_this) {
          return function(sender) {
            _this.disappearCounter--;
            if (_this.disappearCounter === 0) {
              _this.isAnimating = false;
              return typeof _this.disappearCallback === "function" ? _this.disappearCallback(_this.object) : void 0;
            }
          };
        })(this));
      } else {
        this.disappearCounter--;
      }
    }
    animation = (ref1 = this.object.animations) != null ? ref1.first(function(a) {
      return a.events.indexOf(event) !== -1;
    }) : void 0;
    if (animation) {
      return this.object.animationExecutor.execute(animation, (function(_this) {
        return function(sender) {
          _this.disappearCounter--;
          if (_this.disappearCounter === 0) {
            _this.isAnimating = false;
            return typeof _this.disappearCallback === "function" ? _this.disappearCallback(_this.object) : void 0;
          }
        };
      })(this));
    } else {
      this.disappearCounter--;
      if (this.disappearCounter === 0) {
        this.isAnimating = false;
        return typeof this.disappearCallback === "function" ? this.disappearCallback(this.object) : void 0;
      }
    }
  };


  /**
  * Executes the animation defined for the "onInitialize" event. Each UI-Object
  * can have animations for certain events defined in JSON.
  *
  * @param {Function} callback - An optional callback function called when the animation ends.
  * @method appear
   */

  Component_UIBehavior.prototype.appear = function(callback) {
    var cb;
    gs.GlobalEventManager.emit("uiAnimationStart");
    cb = (function(_this) {
      return function(sender) {
        gs.GlobalEventManager.emit("uiAnimationFinish");
        return typeof callback === "function" ? callback(sender) : void 0;
      };
    })(this);
    return this.executeAnimation("onInitialize", cb);
  };


  /**
  * Executes the animation defined for the "onTerminate" event. Each UI-Object
  * can have animations for certain events defined in JSON.
  *
  * @param {Function} callback - An optional callback function called when the animation ends.
  * @method disappear
   */

  Component_UIBehavior.prototype.disappear = function(callback) {
    var cb;
    gs.GlobalEventManager.emit("uiAnimationStart");
    cb = (function(_this) {
      return function(sender) {
        gs.GlobalEventManager.emit("uiAnimationFinish");
        return typeof callback === "function" ? callback(sender) : void 0;
      };
    })(this);
    return this.executeAnimation("onTerminate", cb);
  };


  /**
  * Disposes the component.
  *
  * @method dispose
   */

  Component_UIBehavior.prototype.dispose = function() {
    Component_UIBehavior.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("objectGotFocus", this.object);
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    gs.GlobalEventManager.offByOwner("mouseDown", this.object);
    return gs.GlobalEventManager.offByOwner("mouseMoved", this.object);
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_UIBehavior.prototype.setupEventHandlers = function() {
    if (this.object.focusable) {
      gs.GlobalEventManager.on("objectGotFocus", ((function(_this) {
        return function(e) {
          if (e.sender !== _this.object) {
            return _this.blur();
          }
        };
      })(this)), null, this.object);
      gs.GlobalEventManager.on("keyUp", ((function(_this) {
        return function(e) {
          if (_this.focused) {
            if (_this.nextKeyObject && (Input.release(Input.KEY_DOWN) || Input.release(Input.KEY_RIGHT))) {
              _this.nextKeyObject.ui.focus();
              return e.breakChain = true;
            } else if (_this.prevKeyObject && (Input.release(Input.KEY_UP) || Input.release(Input.KEY_LEFT))) {
              _this.prevKeyObject.ui.focus();
              return e.breakChain = true;
            }
          }
        };
      })(this)), null, this.object);
    }
    if (this.object.styles.first((function(s) {
      return s.selector === 1;
    }))) {
      gs.GlobalEventManager.on("mouseMoved", ((function(_this) {
        return function(e) {
          var contains;
          if (!_this.enabled) {
            return;
          }
          contains = Rect.contains(_this.object.dstRect.x, _this.object.dstRect.y, _this.object.dstRect.width, _this.object.dstRect.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y);
          if (_this.containsPointer !== contains || (_this.hover && !contains)) {
            _this.containsPointer = contains;
            _this.object.needsUpdate = true;
            _this.hover = contains;
            _this.updateParentStyle();
            _this.updateChildrenStyle();
          }
          return null;
        };
      })(this)), null, this.object);
    }
    if (this.object.focusable || this.object.styles.first((function(s) {
      return s.selector === 2 || s.selector === 4;
    }))) {
      return gs.GlobalEventManager.on("mouseDown", ((function(_this) {
        return function(e) {
          var contains, group, i, len, object;
          if (!_this.enabled || Input.Mouse.buttons[Input.Mouse.LEFT] !== 1) {
            return;
          }
          contains = Rect.contains(_this.object.dstRect.x, _this.object.dstRect.y, _this.object.dstRect.width, _this.object.dstRect.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y);
          if (contains) {
            _this.object.needsUpdate = true;
            _this.focus();
            if (_this.object.selectable) {
              if (_this.object.group) {
                _this.selected = true;
                group = gs.ObjectManager.current.objectsByGroup(_this.object.group);
                for (i = 0, len = group.length; i < len; i++) {
                  object = group[i];
                  if (object !== _this.object) {
                    object.ui.selected = false;
                  }
                }
              } else {
                _this.selected = !_this.selected;
              }
            } else {
              _this.updateStyle();
            }
            _this.updateParentStyle();
          }
          return null;
        };
      })(this)), null, this.object, 0);
    }
  };


  /**
  * Initializes the binding-handler.
  * 
  * @method setup
   */

  Component_UIBehavior.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Gives the input focus to this UI object. If the UI object is not focusable, nothing will happen.
  * 
  * @method focus
   */

  Component_UIBehavior.prototype.focus = function() {
    if (this.object.focusable && !this.focused) {
      this.focused = true;
      this.updateChildrenStyle();
      return gs.GlobalEventManager.emit("objectGotFocus", this.object);
    }
  };


  /**
  * Removes the input focus from this UI object. If the UI object is not focusable, nothing will happen.
  * 
  * @method blur
   */

  Component_UIBehavior.prototype.blur = function() {
    if (this.object.focusable && this.focused) {
      this.focused = false;
      this.updateChildrenStyle();
      return gs.GlobalEventManager.emit("objectLostFocus", this.object);
    }
  };

  Component_UIBehavior.prototype.updateParentStyle = function() {
    var parent, ref;
    parent = this.object.parent;
    while (parent) {
      if ((ref = parent.ui) != null) {
        ref.updateStyle();
      }
      parent = parent.parent;
    }
    return null;
  };

  Component_UIBehavior.prototype.updateChildrenStyle = function() {
    var control, i, len, ref;
    if (this.object.controls) {
      ref = this.object.controls;
      for (i = 0, len = ref.length; i < len; i++) {
        control = ref[i];
        if (control && control.ui) {
          control.ui.updateStyle();
          control.ui.updateChildrenStyle();
        }
      }
    }
    return null;
  };

  Component_UIBehavior.prototype.updateStyle = function() {
    var base, i, j, len, len1, object, objects, ref, ref1, style;
    if (this.object.styles) {
      ref = this.object.styles;
      for (i = 0, len = ref.length; i < len; i++) {
        style = ref[i];
        if (!this.viewData_[style.selector]) {
          style.revert(this.object);
        }
      }
      ref1 = this.object.styles;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        style = ref1[j];
        if (style.target === -1) {
          if (this.viewData_[style.selector]) {
            style.apply(this.object);
          }
        } else {
          objects = this.object.parentsByStyle[style.target];
          if (objects) {
            object = objects[0];
            if (object && object.ui.viewData_[style.selector]) {
              style.apply(this.object);
            }
          }
        }
      }
      if (this.object.font) {
        if (typeof (base = this.object.behavior).refresh === "function") {
          base.refresh();
        }
      }
    }
    return null;
  };


  /**
  * Updates the binding-handler.
  * 
  * @method update
   */

  Component_UIBehavior.prototype.update = function() {
    if (this.nextKeyObjectId && !this.nextKeyObject) {
      return this.nextKeyObject = gs.ObjectManager.current.objectById(this.nextKeyObjectId);
    }
  };

  return Component_UIBehavior;

})(gs.Component);

ui.Component_UIBehavior = Component_UIBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsb0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O2lDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7RUFPYSw4QkFBQTtJQUNULElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBQ2hCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsU0FBRCxHQUFhLENBQUMsSUFBRCxFQUFNLEtBQU4sRUFBVSxLQUFWLEVBQWMsSUFBZCxFQUFtQixLQUFuQjtJQUNiLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxjQUFELEdBQWtCO0VBUFQ7O0VBU2Isb0JBQUMsQ0FBQSxTQUFELENBQVcsZUFBWCxFQUNJO0lBQUEsR0FBQSxFQUFLLFNBQUMsQ0FBRDtNQUNELElBQUMsQ0FBQSxjQUFELEdBQWtCO01BQ2xCLElBQUcsQ0FBSDtlQUNJLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBTCxHQUFzQixJQUFDLENBQUEsT0FEM0I7O0lBRkMsQ0FBTDtJQUlBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FKTDtHQURKOztFQU9BLG9CQUFDLENBQUEsU0FBRCxDQUFXLGVBQVgsRUFDSTtJQUFBLEdBQUEsRUFBSyxTQUFDLENBQUQ7TUFDRCxJQUFDLENBQUEsY0FBRCxHQUFrQjtNQUNsQixJQUFHLENBQUg7ZUFDSSxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQUwsR0FBc0IsSUFBQyxDQUFBLE9BRDNCOztJQUZDLENBQUw7SUFJQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBSkw7R0FESjs7RUFPQSxv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LEtBQUssQ0FBQyxLQUFOLENBQVksSUFBQyxDQUFBLE1BQWIsRUFESjthQUZKO1dBTEo7O0FBREo7TUFXQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBWDs7Y0FDb0IsQ0FBQztTQURyQjtPQWhCSjs7QUFtQkEsV0FBTztFQXBCRTs7O0FBc0JiOzs7Ozs7aUNBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixJQUFHLElBQUMsQ0FBQSxlQUFELElBQXFCLENBQUMsSUFBQyxDQUFBLGFBQTFCO2FBQ0ksSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBekIsQ0FBb0MsSUFBQyxDQUFBLGVBQXJDLEVBRHJCOztFQURJOzs7O0dBdFV1QixFQUFFLENBQUM7O0FBMlV0QyxFQUFFLENBQUMsb0JBQUgsR0FBMEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9TdHlsZUhhbmRsZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9VSUJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoaXMgb2JqZWN0IGluc3RhbmNlIGlzIHJlc3RvcmVkIGZyb20gYSBkYXRhLWJ1bmRsZS4gSXQgY2FuIGJlIHVzZWRcbiAgICAqIHJlLWFzc2lnbiBldmVudC1oYW5kbGVyLCBhbm9ueW1vdXMgZnVuY3Rpb25zLCBldGMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbW9kdWxlIHVpXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1VJQmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgQGJyZWFrQ2hhaW5BdCA9IG51bGxcbiAgICAgICAgQGNvbnRhaW5zUG9pbnRlciA9IG5vXG4gICAgICAgIEBpc0FuaW1hdGluZyA9IG5vXG4gICAgICAgIEB2aWV3RGF0YV8gPSBbeWVzLCBubywgbm8sIHllcywgbm9dXG4gICAgICAgIEBuZXh0S2V5T2JqZWN0SWQgPSBcIlwiXG4gICAgICAgIEBuZXh0S2V5T2JqZWN0XyA9IG51bGxcbiAgICAgICAgQHByZXZLZXlPYmplY3RfID0gbnVsbFxuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwibmV4dEtleU9iamVjdFwiLCBcbiAgICAgICAgc2V0OiAodikgLT5cbiAgICAgICAgICAgIEBuZXh0S2V5T2JqZWN0XyA9IHZcbiAgICAgICAgICAgIGlmIHZcbiAgICAgICAgICAgICAgICB2LnVpLnByZXZLZXlPYmplY3RfID0gQG9iamVjdFxuICAgICAgICBnZXQ6IC0+IEBuZXh0S2V5T2JqZWN0X1xuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwicHJldktleU9iamVjdFwiLCBcbiAgICAgICAgc2V0OiAodikgLT5cbiAgICAgICAgICAgIEBwcmV2S2V5T2JqZWN0XyA9IHZcbiAgICAgICAgICAgIGlmIHZcbiAgICAgICAgICAgICAgICB2LnVpLm5leHRLZXlPYmplY3RfID0gQG9iamVjdFxuICAgICAgICBnZXQ6IC0+IEBwcmV2S2V5T2JqZWN0X1xuICAgICAgICAgICAgICAgIFxuICAgIEBhY2Nlc3NvcnMgXCJzZWxlY3RlZFwiLCBcbiAgICAgICAgc2V0OiAodikgLT4gXG4gICAgICAgICAgICBpZiB2ICE9IEB2aWV3RGF0YV9bMl1cbiAgICAgICAgICAgICAgICBAdmlld0RhdGFfWzJdID0gdlxuICAgICAgICAgICAgICAgIEB1cGRhdGVTdHlsZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGdldDogLT4gQHZpZXdEYXRhX1syXVxuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwiaG92ZXJcIiwgXG4gICAgICAgIHNldDogKHYpIC0+IFxuICAgICAgICAgICAgaWYgdiAhPSBAdmlld0RhdGFfWzFdXG4gICAgICAgICAgICAgICAgQHZpZXdEYXRhX1sxXSA9IHZcbiAgICAgICAgICAgICAgICBAdXBkYXRlU3R5bGUoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBnZXQ6IC0+IEB2aWV3RGF0YV9bMV1cbiAgICAgICAgXG4gICAgQGFjY2Vzc29ycyBcImVuYWJsZWRcIixcbiAgICAgICAgc2V0OiAodikgLT4gXG4gICAgICAgICAgICBpZiB2ICE9IEB2aWV3RGF0YV9bM11cbiAgICAgICAgICAgICAgICBAdmlld0RhdGFfWzNdID0gdlxuICAgICAgICAgICAgICAgIEB1cGRhdGVTdHlsZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGdldDogLT4gQHZpZXdEYXRhX1szXVxuICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwiZm9jdXNlZFwiLFxuICAgICAgICBzZXQ6ICh2KSAtPlxuICAgICAgICAgICAgaWYgdiAhPSBAdmlld0RhdGFfWzRdXG4gICAgICAgICAgICAgICAgQHZpZXdEYXRhX1s0XSA9IHZcbiAgICAgICAgICAgICAgICBAdXBkYXRlU3R5bGUoKVxuICAgICAgICBnZXQ6IC0+IEB2aWV3RGF0YV9bNF1cbiAgICAgICAgXG4gICAgQGFjY2Vzc29ycyBcInZpZXdEYXRhXCIsXG4gICAgICAgIHNldDogKHYpIC0+XG4gICAgICAgICAgICBpZiB2ICE9IEB2aWV3RGF0YV9cbiAgICAgICAgICAgICAgICBAdmlld0RhdGFfID0gdlxuICAgICAgICAgICAgICAgIEB1cGRhdGVTdHlsZSgpXG4gICAgICAgIGdldDogLT4gQHZpZXdEYXRhX1xuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFByZXBhcmVzIHRoZSBVSS1PYmplY3QgZm9yIGRpc3BsYXkuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWRcbiAgICAqIGJlZm9yZSBhIG5ldyBjcmVhdGVkIFVJLU9iamVjdCB3aWxsIGJlIGRpc3BsYXllZCB0byBwb3NpdGlvbiBhbGxcbiAgICAqIHN1Yi1lbGVtZW50cyBjb3JyZWN0bHkuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlXG4gICAgIyMjXG4gICAgcHJlcGFyZTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUucHJlcGFyaW5nID0geWVzXG4gICAgICAgIEBvYmplY3QudXBkYXRlKCkgIyBGaXJzdCBVcGRhdGU6IEJyaW5nIGFsbCBzdWItZWxlbWVudHMgaW4gY29ycmVjdCBzaXplXG4gICAgICAgIEBvYmplY3QudXBkYXRlKCkgIyBTZWNvbmQgVXBkYXRlOiBDb3JyZWN0IGxheW91dFxuICAgICAgICBzY2VuZS5wcmVwYXJpbmcgPSBub1xuICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYW4gYW5pbWF0aW9uIGRlZmluZWQgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuIEVhY2ggVUktT2JqZWN0XG4gICAgKiBjYW4gaGF2ZSBhbmltYXRpb25zIGZvciBjZXJ0YWluIGV2ZW50cyBkZWZpbmVkIGluIEpTT04uXG4gICAgKlxuICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50IHRvIGV4ZWN1dGUgdGhlIGFuaW1hdGlvbiBmb3Igc3VjaCBhcyBcIm9uVGVybWluYXRlXCIgb3IgXCJvbkluaXRpYWxpemVcIi4gSWZcbiAgICAqIG5vIGFuaW1hdGlvbiBoYXMgYmVlbiBkZWZpbmVkIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LCBub3RoaW5nIHdpbGwgaGFwcGVuIGFuZCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgXG4gICAgKiBpbW1lZGlhdGVseS5cbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBlbmRzLlxuICAgICogQG1ldGhvZCBleGVjdXRlQW5pbWF0aW9uXG4gICAgIyMjXG4gICAgZXhlY3V0ZUFuaW1hdGlvbjogKGV2ZW50LCBjYWxsYmFjaykgLT5cbiAgICAgICAgQGlzQW5pbWF0aW5nID0geWVzXG4gICAgICAgIEBkaXNhcHBlYXJDb3VudGVyID0gQG9iamVjdC5zdWJPYmplY3RzLmxlbmd0aCArIDFcbiAgICAgICAgQGRpc2FwcGVhckNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICAgICAgXG4gICAgICAgIGZvciBvYmplY3QgaW4gQG9iamVjdC5zdWJPYmplY3RzXG4gICAgICAgICAgICBpZiBvYmplY3QudWlcbiAgICAgICAgICAgICAgICBvYmplY3QudWkuZXhlY3V0ZUFuaW1hdGlvbihldmVudCwgKHNlbmRlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgQGRpc2FwcGVhckNvdW50ZXItLVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgQGRpc2FwcGVhckNvdW50ZXIgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgQGlzQW5pbWF0aW5nID0gbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBkaXNhcHBlYXJDYWxsYmFjaz8oQG9iamVjdClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGRpc2FwcGVhckNvdW50ZXItLVxuICAgICAgICAgXG4gICAgICAgIGFuaW1hdGlvbiA9IEBvYmplY3QuYW5pbWF0aW9ucz8uZmlyc3QgKGEpIC0+IGEuZXZlbnRzLmluZGV4T2YoZXZlbnQpICE9IC0xXG4gICAgICAgIFxuICAgICAgICBpZiBhbmltYXRpb25cbiAgICAgICAgICAgIEBvYmplY3QuYW5pbWF0aW9uRXhlY3V0b3IuZXhlY3V0ZShhbmltYXRpb24sIChzZW5kZXIpID0+XG4gICAgICAgICAgICAgICAgQGRpc2FwcGVhckNvdW50ZXItLVxuICAgICAgICAgICAgICAgIGlmIEBkaXNhcHBlYXJDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICAgICAgQGlzQW5pbWF0aW5nID0gbm9cbiAgICAgICAgICAgICAgICAgICAgQGRpc2FwcGVhckNhbGxiYWNrPyhAb2JqZWN0KSBcbiAgICAgICAgICAgIClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpc2FwcGVhckNvdW50ZXItLVxuICAgICAgICAgICAgaWYgQGRpc2FwcGVhckNvdW50ZXIgPT0gMFxuICAgICAgICAgICAgICAgIEBpc0FuaW1hdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgQGRpc2FwcGVhckNhbGxiYWNrPyhAb2JqZWN0KSBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyB0aGUgYW5pbWF0aW9uIGRlZmluZWQgZm9yIHRoZSBcIm9uSW5pdGlhbGl6ZVwiIGV2ZW50LiBFYWNoIFVJLU9iamVjdFxuICAgICogY2FuIGhhdmUgYW5pbWF0aW9ucyBmb3IgY2VydGFpbiBldmVudHMgZGVmaW5lZCBpbiBKU09OLlxuICAgICpcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBlbmRzLlxuICAgICogQG1ldGhvZCBhcHBlYXJcbiAgICAjIyMgICAgICAgIFxuICAgIGFwcGVhcjogKGNhbGxiYWNrKSAtPiBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLmVtaXQoXCJ1aUFuaW1hdGlvblN0YXJ0XCIpXG4gICAgICAgIGNiID0gKHNlbmRlcikgPT4gXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInVpQW5pbWF0aW9uRmluaXNoXCIpXG4gICAgICAgICAgICBjYWxsYmFjaz8oc2VuZGVyKVxuICAgICAgICBAZXhlY3V0ZUFuaW1hdGlvbihcIm9uSW5pdGlhbGl6ZVwiLCBjYilcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgdGhlIGFuaW1hdGlvbiBkZWZpbmVkIGZvciB0aGUgXCJvblRlcm1pbmF0ZVwiIGV2ZW50LiBFYWNoIFVJLU9iamVjdFxuICAgICogY2FuIGhhdmUgYW5pbWF0aW9ucyBmb3IgY2VydGFpbiBldmVudHMgZGVmaW5lZCBpbiBKU09OLlxuICAgICpcbiAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGFuaW1hdGlvbiBlbmRzLlxuICAgICogQG1ldGhvZCBkaXNhcHBlYXJcbiAgICAjIyMgICAgXG4gICAgZGlzYXBwZWFyOiAoY2FsbGJhY2spIC0+IFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInVpQW5pbWF0aW9uU3RhcnRcIilcbiAgICAgICAgY2IgPSAoc2VuZGVyKSA9PiBcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5lbWl0KFwidWlBbmltYXRpb25GaW5pc2hcIilcbiAgICAgICAgICAgIGNhbGxiYWNrPyhzZW5kZXIpXG4gICAgICAgIEBleGVjdXRlQW5pbWF0aW9uKFwib25UZXJtaW5hdGVcIiwgY2IpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBjb21wb25lbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyIFwibW91c2VVcFwiLCBAb2JqZWN0XG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwib2JqZWN0R290Rm9jdXNcIiwgQG9iamVjdClcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJrZXlVcFwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlRG93blwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlTW92ZWRcIiwgQG9iamVjdClcbiAgICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVycyBmb3IgbW91c2UvdG91Y2ggZXZlbnRzXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyMgXG4gICAgc2V0dXBFdmVudEhhbmRsZXJzOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmZvY3VzYWJsZVxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwib2JqZWN0R290Rm9jdXNcIiwgKChlKSA9PlxuICAgICAgICAgICAgICAgIGlmIGUuc2VuZGVyICE9IEBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgQGJsdXIoKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG51bGwsIEBvYmplY3RcblxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwia2V5VXBcIiwgKChlKSA9PlxuICAgICAgICAgICAgICAgIGlmIEBmb2N1c2VkXG4gICAgICAgICAgICAgICAgICAgIGlmIEBuZXh0S2V5T2JqZWN0IGFuZCAoSW5wdXQucmVsZWFzZShJbnB1dC5LRVlfRE9XTikgb3IgSW5wdXQucmVsZWFzZShJbnB1dC5LRVlfUklHSFQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG5leHRLZXlPYmplY3QudWkuZm9jdXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5icmVha0NoYWluID0geWVzXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgQHByZXZLZXlPYmplY3QgYW5kIChJbnB1dC5yZWxlYXNlKElucHV0LktFWV9VUCkgb3IgSW5wdXQucmVsZWFzZShJbnB1dC5LRVlfTEVGVCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBAcHJldktleU9iamVjdC51aS5mb2N1cygpXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmJyZWFrQ2hhaW4gPSB5ZXNcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBudWxsLCBAb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5zdHlsZXMuZmlyc3QgKChzKSAtPiBzLnNlbGVjdG9yID09IDEpXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZU1vdmVkXCIsICgoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlmICFAZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICBjb250YWlucyA9IFJlY3QuY29udGFpbnMoQG9iamVjdC5kc3RSZWN0LngsIEBvYmplY3QuZHN0UmVjdC55LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIEBjb250YWluc1BvaW50ZXIgIT0gY29udGFpbnMgb3IgKEBob3ZlciBhbmQgIWNvbnRhaW5zKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGNvbnRhaW5zUG9pbnRlciA9IGNvbnRhaW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAaG92ZXIgPSBjb250YWluc1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBAdXBkYXRlUGFyZW50U3R5bGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQHVwZGF0ZUNoaWxkcmVuU3R5bGUoKVxuICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBudWxsLCBAb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5mb2N1c2FibGUgb3IgQG9iamVjdC5zdHlsZXMuZmlyc3QgKChzKSAtPiBzLnNlbGVjdG9yID09IDIgfHwgcy5zZWxlY3RvciA9PSA0KVxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwibW91c2VEb3duXCIsICgoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlmICFAZW5hYmxlZCBvciBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLkxFRlRdICE9IDFcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbnMgPSBSZWN0LmNvbnRhaW5zKEBvYmplY3QuZHN0UmVjdC54LCBAb2JqZWN0LmRzdFJlY3QueSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC53aWR0aCwgQG9iamVjdC5kc3RSZWN0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgY29udGFpbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgQGZvY3VzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgQG9iamVjdC5zZWxlY3RhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgQG9iamVjdC5ncm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc2VsZWN0ZWQgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0c0J5R3JvdXAoQG9iamVjdC5ncm91cClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIG9iamVjdCBpbiBncm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0ICE9IEBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudWkuc2VsZWN0ZWQgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNlbGVjdGVkID0gIUBzZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEB1cGRhdGVTdHlsZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBAdXBkYXRlUGFyZW50U3R5bGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbCAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgbnVsbCwgQG9iamVjdCwgMFxuICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBiaW5kaW5nLWhhbmRsZXIuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgXG4gICAgIyMjKlxuICAgICogR2l2ZXMgdGhlIGlucHV0IGZvY3VzIHRvIHRoaXMgVUkgb2JqZWN0LiBJZiB0aGUgVUkgb2JqZWN0IGlzIG5vdCBmb2N1c2FibGUsIG5vdGhpbmcgd2lsbCBoYXBwZW4uXG4gICAgKiBcbiAgICAqIEBtZXRob2QgZm9jdXNcbiAgICAjIyMgICAgICAgICAgICAgICBcbiAgICBmb2N1czogLT5cbiAgICAgICAgaWYgQG9iamVjdC5mb2N1c2FibGUgYW5kICFAZm9jdXNlZFxuICAgICAgICAgICAgQGZvY3VzZWQgPSB5ZXNcbiAgICAgICAgICAgIEB1cGRhdGVDaGlsZHJlblN0eWxlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLmVtaXQoXCJvYmplY3RHb3RGb2N1c1wiLCBAb2JqZWN0KVxuICAgIFxuICAgICMjIypcbiAgICAqIFJlbW92ZXMgdGhlIGlucHV0IGZvY3VzIGZyb20gdGhpcyBVSSBvYmplY3QuIElmIHRoZSBVSSBvYmplY3QgaXMgbm90IGZvY3VzYWJsZSwgbm90aGluZyB3aWxsIGhhcHBlbi5cbiAgICAqIFxuICAgICogQG1ldGhvZCBibHVyXG4gICAgIyMjXG4gICAgYmx1cjogLT5cbiAgICAgICAgaWYgQG9iamVjdC5mb2N1c2FibGUgYW5kIEBmb2N1c2VkXG4gICAgICAgICAgICBAZm9jdXNlZCA9IG5vXG4gICAgICAgICAgICBAdXBkYXRlQ2hpbGRyZW5TdHlsZSgpXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcIm9iamVjdExvc3RGb2N1c1wiLCBAb2JqZWN0KVxuICAgICAgICAgICAgXG4gICAgdXBkYXRlUGFyZW50U3R5bGU6IC0+XG4gICAgICAgIHBhcmVudCA9IEBvYmplY3QucGFyZW50XG4gICAgICAgIHdoaWxlIHBhcmVudFxuICAgICAgICAgICAgcGFyZW50LnVpPy51cGRhdGVTdHlsZSgpXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgXG4gICAgdXBkYXRlQ2hpbGRyZW5TdHlsZTogKCkgLT5cbiAgICAgICAgaWYgQG9iamVjdC5jb250cm9sc1xuICAgICAgICAgICAgZm9yIGNvbnRyb2wgaW4gQG9iamVjdC5jb250cm9sc1xuICAgICAgICAgICAgICAgIGlmIGNvbnRyb2wgYW5kIGNvbnRyb2wudWlcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbC51aS51cGRhdGVTdHlsZSgpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wudWkudXBkYXRlQ2hpbGRyZW5TdHlsZSgpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgICAgICAgICAgIFxuICAgIHVwZGF0ZVN0eWxlOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnN0eWxlc1xuICAgICAgICAgICAgZm9yIHN0eWxlIGluIEBvYmplY3Quc3R5bGVzXG4gICAgICAgICAgICAgICAgaWYgIUB2aWV3RGF0YV9bc3R5bGUuc2VsZWN0b3JdXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlLnJldmVydChAb2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciBzdHlsZSBpbiBAb2JqZWN0LnN0eWxlc1xuICAgICAgICAgICAgICAgIGlmIHN0eWxlLnRhcmdldCA9PSAtMVxuICAgICAgICAgICAgICAgICAgICBpZiBAdmlld0RhdGFfW3N0eWxlLnNlbGVjdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUuYXBwbHkoQG9iamVjdClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHMgPSBAb2JqZWN0LnBhcmVudHNCeVN0eWxlW3N0eWxlLnRhcmdldF1cbiAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gb2JqZWN0c1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0IGFuZCBvYmplY3QudWkudmlld0RhdGFfW3N0eWxlLnNlbGVjdG9yXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLmFwcGx5KEBvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmZvbnRcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmJlaGF2aW9yLnJlZnJlc2g/KCkgIyBGSVhNRTogQ3JlYXRlcyBhIGRlcGVuZGVuY3kgb24gVGV4dC1CZWhhdmlvclxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBiaW5kaW5nLWhhbmRsZXIuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBpZiBAbmV4dEtleU9iamVjdElkIGFuZCAhQG5leHRLZXlPYmplY3RcbiAgICAgICAgICAgIEBuZXh0S2V5T2JqZWN0ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoQG5leHRLZXlPYmplY3RJZClcbiAgICAgICAgXG4gICAgIFxudWkuQ29tcG9uZW50X1VJQmVoYXZpb3IgPSBDb21wb25lbnRfVUlCZWhhdmlvciJdfQ==
//# sourceURL=Component_UIBehavior_143.js