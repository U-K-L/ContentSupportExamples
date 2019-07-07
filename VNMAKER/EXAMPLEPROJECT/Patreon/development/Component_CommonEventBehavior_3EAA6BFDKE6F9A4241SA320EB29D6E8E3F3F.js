var Component_CommonEventBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_CommonEventBehavior = (function(superClass) {
  extend(Component_CommonEventBehavior, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_CommonEventBehavior.prototype.onDataBundleRestore = function(data, context) {
    var ref;
    if (this.object.rid != null) {
      this.object.record = RecordManager.commonEvents[this.object.rid];
      if ((ref = this.object.interpreter) != null) {
        ref.object = this;
      }
      this.object.commands = this.object.record.commands;
    }
    return this.setupEventHandlers();
  };


  /**
  * A component which allows a game object to execute common-events.
  *
  * @module gs
  * @class Component_CommonEventBehavior
  * @extends gs.Component
  * @memberof gs
   */

  function Component_CommonEventBehavior() {
    Component_CommonEventBehavior.__super__.constructor.call(this);

    /**
    * @property readyToStart
    * @type boolean
    * @private
     */
    this.readyToStart = false;

    /**
    * @property initialized
    * @type boolean
    * @private
     */
    this.initialized = false;
    this.callDepth = 0;
  }


  /**
  * Serializes the component into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} The data-bundle.
   */

  Component_CommonEventBehavior.prototype.toDataBundle = function() {
    return {
      initialized: this.initialized,
      readyToStart: this.readyToStart
    };
  };


  /**
  * Restores the component from a data-bundle
  *
  * @method restore
  * @param {Object} bundle- The data-bundle.
   */

  Component_CommonEventBehavior.prototype.restore = function(data) {
    this.setup();
    this.readyToStart = data.readyToStart;
    return this.initialized = data.initialized;
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_CommonEventBehavior.prototype.setupEventHandlers = function() {
    if (!this.object.interpreter) {
      return;
    }
    if (this.object.record.startCondition === 1) {
      return this.object.interpreter.onFinish = (function(_this) {
        return function() {
          var ref;
          if (!_this.object.record.parallel) {
            return (ref = _this.object.events) != null ? ref.emit("finish", _this) : void 0;
          }
        };
      })(this);
    } else {
      if (this.object.record.parallel) {
        return this.object.interpreter.onFinish = (function(_this) {
          return function(sender) {
            return _this.object.removeComponent(sender);
          };
        })(this);
      } else {
        return this.object.interpreter.onFinish = (function(_this) {
          return function(sender) {
            return _this.object.events.emit("finish", _this);
          };
        })(this);
      }
    }
  };


  /**
  * Initializes the common-event.
  *
  * @method setup
   */

  Component_CommonEventBehavior.prototype.setup = function() {
    GameManager.variableStore.setupLocalVariables(this.object.record);
    this.object.record.parameters = this.object.record.parameters != null ? this.object.record.parameters : [];
    this.object.record.startCondition = this.object.record.startCondition != null ? this.object.record.startCondition : 0;
    this.object.record.parallel = this.object.record.parallel != null ? this.object.record.parallel : false;
    this.object.record.conditionSwitch = this.object.record.conditionSwitch != null ? this.object.record.conditionSwitch : null;
    this.object.record.conditionEnabled = this.object.record.conditionEnabled;
    if (this.object.record.startCondition === 1) {
      this.object.interpreter = new gs.Component_CommandInterpreter();
      this.object.interpreter.onFinish = (function(_this) {
        return function() {
          var ref;
          if (!_this.object.record.parallel) {
            return (ref = _this.object.events) != null ? ref.emit("finish", _this) : void 0;
          }
        };
      })(this);
      this.object.interpreter.context.set(this.object.record.index, this.object.record);
      this.object.addComponent(this.object.interpreter);
    }
    return this.initialized = true;
  };


  /**
  * Starts the common-event interpreter with the specified parameters.
  * 
  * @method start
  * @param {Object} parameters The common-event's parameters which can be configured in database.
   */

  Component_CommonEventBehavior.prototype.start = function(parameters) {
    var ref, ref1;
    this.startParameters = parameters;
    if ((this.object.interpreter != null) && !this.object.interpreter.isRunning) {
      this.object.commands = this.object.record.commands;
      this.readyToStart = true;
      if ((ref = this.object.events) != null) {
        ref.emit("start", this);
      }
    }
    if (this.object.record.startCondition === 0 && this.object.record.parallel) {
      return (ref1 = this.object.events) != null ? ref1.emit("finish", this) : void 0;
    }
  };


  /**
  * Initializes variable-store with the start-up parameters configured for the
  * common-event in Database.
  *
  * @method setupParameters
   */

  Component_CommonEventBehavior.prototype.setupParameters = function(parameters, parentContext) {
    var i, j, parameter, ref, results, value;
    if ((parameters != null) && (parameters.values != null)) {
      results = [];
      for (i = j = 0, ref = parameters.values.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        value = parameters.values[i];
        parameter = this.object.record.parameters[i];
        if ((parameter != null) && (value != null)) {
          GameManager.variableStore.setupTempVariables(parentContext);
          switch (parameter.type) {
            case 1:
              value = GameManager.variableStore.numberValueOf(value);
              GameManager.variableStore.setupTempVariables(this.object.interpreter.context);
              results.push(GameManager.variableStore.setNumberValueTo(parameter.numberVariable, value));
              break;
            case 2:
              value = GameManager.variableStore.booleanValueOf(value);
              GameManager.variableStore.setupTempVariables(this.object.interpreter.context);
              results.push(GameManager.variableStore.setBooleanValueTo(parameter.booleanVariable, value));
              break;
            case 3:
              value = GameManager.variableStore.stringValueOf(value);
              GameManager.variableStore.setupTempVariables(this.object.interpreter.context);
              results.push(GameManager.variableStore.setStringValueTo(parameter.stringVariable, value));
              break;
            default:
              results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Calls the common-event with the specified parameters.
  *
  * @method call
  * @param {Object} parameters The common-event's parameters which can be configured in database.
   */

  Component_CommonEventBehavior.prototype.call = function(parameters, settings, parentContext) {
    var interpreter;
    if (!this.object.record.singleInstance) {
      interpreter = new gs.Component_CommandInterpreter();
      interpreter.context.set(this.object.record.index + "_" + this.callDepth, this.object.record);
      GameManager.variableStore.clearTempVariables(interpreter.context);
      this.object.commands = this.object.record.commands;
      this.callDepth++;
    } else {
      interpreter = this.object.interpreter || new gs.Component_CommandInterpreter();
      interpreter.context.set(this.object.record.index, this.object.record);
      this.object.commands = this.object.record.commands;
    }
    interpreter.repeat = false;
    interpreter.object = this.object;
    if (settings) {
      interpreter.settings = settings;
    }
    this.object.interpreter = interpreter;
    GameManager.variableStore.setupTempVariables(interpreter.context);
    this.setupParameters(parameters, parentContext);
    if (this.object.record.parallel) {
      interpreter.onFinish = (function(_this) {
        return function(sender) {
          _this.object.removeComponent(sender);
          if (!_this.object.record.singleInstance) {
            return _this.callDepth--;
          }
        };
      })(this);
      interpreter.start();
      this.object.addComponent(interpreter);
      return null;
    } else {
      interpreter.onFinish = (function(_this) {
        return function(sender) {
          return _this.object.events.emit("finish", _this);
        };
      })(this);
      return interpreter;
    }
  };


  /**
  * Stops the common-event interpreter.
  *
  * @method stop
   */

  Component_CommonEventBehavior.prototype.stop = function() {
    var ref;
    if (this.object.interpreter != null) {
      this.object.interpreter.stop();
      return (ref = this.object.events) != null ? ref.emit("finish", this) : void 0;
    }
  };


  /**
  * Resumes a paused common-event interpreter.
  *
  * @method resume
   */

  Component_CommonEventBehavior.prototype.resume = function() {
    var ref, ref1;
    if (this.object.interpreter != null) {
      this.object.interpreter.resume();
      if ((ref = this.object.events) != null) {
        ref.emit("start", this);
      }
      return (ref1 = this.object.events) != null ? ref1.emit("resume", this) : void 0;
    }
  };


  /**
  * Updates the common-event interpreter.
  *
  * @method update
   */

  Component_CommonEventBehavior.prototype.update = function() {
    if (!this.initialized) {
      this.setup();
    }
    if ((this.object.interpreter != null) && this.readyToStart) {
      this.readyToStart = false;
      this.setupParameters(this.startParameters);
      this.object.interpreter.start();
    }
    if ((this.object.interpreter != null) && this.object.record.startCondition === 1 && !this.object.interpreter.isRunning) {
      if (this.object.record.conditionEnabled) {
        if (GameManager.variableStore.booleanValueOf(this.object.record.conditionSwitch)) {
          return this.start();
        }
      } else {
        return this.start();
      }
    }
  };


  /**
  * Not implemented yet.
  *
  * @method erase
   */

  Component_CommonEventBehavior.prototype.erase = function() {};

  return Component_CommonEventBehavior;

})(gs.Component);

gs.Component_CommonEventBehavior = Component_CommonEventBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsNkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OzBDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDakIsUUFBQTtJQUFBLElBQUcsdUJBQUg7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsYUFBYSxDQUFDLFlBQWEsQ0FBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEdBQVI7O1dBQ3pCLENBQUUsTUFBckIsR0FBOEI7O01BQzlCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUh0Qzs7V0FJQSxJQUFDLENBQUEsa0JBQUQsQ0FBQTtFQUxpQjs7O0FBT3JCOzs7Ozs7Ozs7RUFRYSx1Q0FBQTtJQUNULDZEQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCOztBQUVoQjs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLFNBQUQsR0FBYTtFQWpCSjs7O0FBbUJiOzs7Ozs7OzBDQU1BLFlBQUEsR0FBYyxTQUFBO0FBQ1YsV0FBTztNQUNILFdBQUEsRUFBYSxJQUFDLENBQUEsV0FEWDtNQUVILFlBQUEsRUFBYyxJQUFDLENBQUEsWUFGWjs7RUFERzs7O0FBTWQ7Ozs7Ozs7MENBTUEsT0FBQSxHQUFTLFNBQUMsSUFBRDtJQUNMLElBQUMsQ0FBQSxLQUFELENBQUE7SUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUM7V0FDckIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUM7RUFIZjs7O0FBS1Q7Ozs7OzswQ0FLQSxrQkFBQSxHQUFvQixTQUFBO0lBQ2hCLElBQUcsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVo7QUFBNkIsYUFBN0I7O0lBRUEsSUFBRyxJQUFDLENBQUEs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MUQsSUFBZ0UsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUEzRjtNQUNJLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWxCO1FBQ0ksSUFBRyxXQUFXLENBQUMsYUFBYSxDQUFDLGNBQTFCLENBQXlDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQXhELENBQUg7aUJBQ0ksSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURKO1NBREo7T0FBQSxNQUFBO2VBSUksSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQUpKO09BREo7O0VBVEk7OztBQWdCUjs7Ozs7OzBDQUtBLEtBQUEsR0FBTyxTQUFBLEdBQUE7Ozs7R0FoUGlDLEVBQUUsQ0FBQzs7QUFrUC9DLEVBQUUsQ0FBQyw2QkFBSCxHQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0NvbW1vbkV2ZW50QmVoYXZpb3JcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9Db21tb25FdmVudEJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoaXMgb2JqZWN0IGluc3RhbmNlIGlzIHJlc3RvcmVkIGZyb20gYSBkYXRhLWJ1bmRsZS4gSXQgY2FuIGJlIHVzZWRcbiAgICAqIHJlLWFzc2lnbiBldmVudC1oYW5kbGVyLCBhbm9ueW1vdXMgZnVuY3Rpb25zLCBldGMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIGlmIEBvYmplY3QucmlkP1xuICAgICAgICAgICAgQG9iamVjdC5yZWNvcmQgPSBSZWNvcmRNYW5hZ2VyLmNvbW1vbkV2ZW50c1tAb2JqZWN0LnJpZF1cbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXI/Lm9iamVjdCA9IHRoaXNcbiAgICAgICAgICAgIEBvYmplY3QuY29tbWFuZHMgPSBAb2JqZWN0LnJlY29yZC5jb21tYW5kc1xuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQSBjb21wb25lbnQgd2hpY2ggYWxsb3dzIGEgZ2FtZSBvYmplY3QgdG8gZXhlY3V0ZSBjb21tb24tZXZlbnRzLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfQ29tbW9uRXZlbnRCZWhhdmlvclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSByZWFkeVRvU3RhcnRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEByZWFkeVRvU3RhcnQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbml0aWFsaXplZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgQGluaXRpYWxpemVkID0gbm9cbiAgICAgICAgXG4gICAgICAgIEBjYWxsRGVwdGggPSAwXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIGNvbXBvbmVudCBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGRhdGEtYnVuZGxlLlxuICAgICMjIyBcbiAgICB0b0RhdGFCdW5kbGU6IC0+XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbml0aWFsaXplZDogQGluaXRpYWxpemVkLFxuICAgICAgICAgICAgcmVhZHlUb1N0YXJ0OiBAcmVhZHlUb1N0YXJ0XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgdGhlIGNvbXBvbmVudCBmcm9tIGEgZGF0YS1idW5kbGVcbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBidW5kbGUtIFRoZSBkYXRhLWJ1bmRsZS5cbiAgICAjIyMgICAgXG4gICAgcmVzdG9yZTogKGRhdGEpIC0+XG4gICAgICAgIEBzZXR1cCgpXG4gICAgICAgIEByZWFkeVRvU3RhcnQgPSBkYXRhLnJlYWR5VG9TdGFydFxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSBkYXRhLmluaXRpYWxpemVkXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFkZHMgZXZlbnQtaGFuZGxlcnMgZm9yIG1vdXNlL3RvdWNoIGV2ZW50c1xuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBFdmVudEhhbmRsZXJzXG4gICAgIyMjIFxuICAgIHNldHVwRXZlbnRIYW5kbGVyczogLT5cbiAgICAgICAgaWYgIUBvYmplY3QuaW50ZXJwcmV0ZXIgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QucmVjb3JkLnN0YXJ0Q29uZGl0aW9uID09IDFcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIub25GaW5pc2ggPSA9PiBcbiAgICAgICAgICAgICAgICBpZiBub3QgQG9iamVjdC5yZWNvcmQucGFyYWxsZWxcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJmaW5pc2hcIiwgdGhpcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgQG9iamVjdC5yZWNvcmQucGFyYWxsZWxcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLm9uRmluaXNoID0gKHNlbmRlcikgPT4gQG9iamVjdC5yZW1vdmVDb21wb25lbnQoc2VuZGVyKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIub25GaW5pc2ggPSAoc2VuZGVyKSA9PiBAb2JqZWN0LmV2ZW50cy5lbWl0KFwiZmluaXNoXCIsIHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBjb21tb24tZXZlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjIyAgXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBMb2NhbFZhcmlhYmxlcyhAb2JqZWN0LnJlY29yZClcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3QucmVjb3JkLnBhcmFtZXRlcnMgPSBpZiBAb2JqZWN0LnJlY29yZC5wYXJhbWV0ZXJzPyB0aGVuIEBvYmplY3QucmVjb3JkLnBhcmFtZXRlcnMgZWxzZSBbXVxuICAgICAgICBAb2JqZWN0LnJlY29yZC5zdGFydENvbmRpdGlvbiA9IGlmIEBvYmplY3QucmVjb3JkLnN0YXJ0Q29uZGl0aW9uPyB0aGVuIEBvYmplY3QucmVjb3JkLnN0YXJ0Q29uZGl0aW9uIGVsc2UgMFxuICAgICAgICBAb2JqZWN0LnJlY29yZC5wYXJhbGxlbCA9IGlmIEBvYmplY3QucmVjb3JkLnBhcmFsbGVsPyB0aGVuIEBvYmplY3QucmVjb3JkLnBhcmFsbGVsIGVsc2Ugbm9cbiAgICAgICAgQG9iamVjdC5yZWNvcmQuY29uZGl0aW9uU3dpdGNoID0gaWYgQG9iamVjdC5yZWNvcmQuY29uZGl0aW9uU3dpdGNoPyB0aGVuIEBvYmplY3QucmVjb3JkLmNvbmRpdGlvblN3aXRjaCBlbHNlIG51bGxcbiAgICAgICAgQG9iamVjdC5yZWNvcmQuY29uZGl0aW9uRW5hYmxlZCA9IEBvYmplY3QucmVjb3JkLmNvbmRpdGlvbkVuYWJsZWRcbiAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QucmVjb3JkLnN0YXJ0Q29uZGl0aW9uID09IDFcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIgPSBuZXcgZ3MuQ29tcG9uZW50X0NvbW1hbmRJbnRlcnByZXRlcigpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLm9uRmluaXNoID0gPT4gXG4gICAgICAgICAgICAgICAgaWYgbm90IEBvYmplY3QucmVjb3JkLnBhcmFsbGVsXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzPy5lbWl0KFwiZmluaXNoXCIsIHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLmNvbnRleHQuc2V0KEBvYmplY3QucmVjb3JkLmluZGV4LCBAb2JqZWN0LnJlY29yZClcbiAgICAgICAgICAgIEBvYmplY3QuYWRkQ29tcG9uZW50KEBvYmplY3QuaW50ZXJwcmV0ZXIpXG5cbiAgICAgICAgQGluaXRpYWxpemVkID0geWVzXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSBjb21tb24tZXZlbnQgaW50ZXJwcmV0ZXIgd2l0aCB0aGUgc3BlY2lmaWVkIHBhcmFtZXRlcnMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIFRoZSBjb21tb24tZXZlbnQncyBwYXJhbWV0ZXJzIHdoaWNoIGNhbiBiZSBjb25maWd1cmVkIGluIGRhdGFiYXNlLlxuICAgICMjIyAgIFxuICAgIHN0YXJ0OiAocGFyYW1ldGVycykgLT5cbiAgICAgICAgQHN0YXJ0UGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyPyBhbmQgbm90IEBvYmplY3QuaW50ZXJwcmV0ZXIuaXNSdW5uaW5nXG4gICAgICAgICAgICBAb2JqZWN0LmNvbW1hbmRzID0gQG9iamVjdC5yZWNvcmQuY29tbWFuZHNcbiAgICAgICAgICAgIEByZWFkeVRvU3RhcnQgPSB5ZXNcbiAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzPy5lbWl0KFwic3RhcnRcIiwgdGhpcylcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LnJlY29yZC5zdGFydENvbmRpdGlvbiA9PSAwIGFuZCBAb2JqZWN0LnJlY29yZC5wYXJhbGxlbFxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJmaW5pc2hcIiwgdGhpcylcbiAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdmFyaWFibGUtc3RvcmUgd2l0aCB0aGUgc3RhcnQtdXAgcGFyYW1ldGVycyBjb25maWd1cmVkIGZvciB0aGVcbiAgICAqIGNvbW1vbi1ldmVudCBpbiBEYXRhYmFzZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwUGFyYW1ldGVyc1xuICAgICMjI1xuICAgIHNldHVwUGFyYW1ldGVyczogKHBhcmFtZXRlcnMsIHBhcmVudENvbnRleHQpIC0+XG4gICAgICAgIGlmIHBhcmFtZXRlcnM/IGFuZCBwYXJhbWV0ZXJzLnZhbHVlcz9cbiAgICAgICAgICAgIGZvciBpIGluIFswLi4ucGFyYW1ldGVycy52YWx1ZXMubGVuZ3RoXVxuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyYW1ldGVycy52YWx1ZXNbaV1cbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXIgPSBAb2JqZWN0LnJlY29yZC5wYXJhbWV0ZXJzW2ldXG4gICAgICAgICAgICAgICAgaWYgcGFyYW1ldGVyPyBhbmQgdmFsdWU/XG4gICAgICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBUZW1wVmFyaWFibGVzKHBhcmVudENvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCBwYXJhbWV0ZXIudHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAxICMgTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLm51bWJlclZhbHVlT2YodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXR1cFRlbXBWYXJpYWJsZXMoQG9iamVjdC5pbnRlcnByZXRlci5jb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0TnVtYmVyVmFsdWVUbyhwYXJhbWV0ZXIubnVtYmVyVmFyaWFibGUsIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgQm9vbGVhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5ib29sZWFuVmFsdWVPZih2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldHVwVGVtcFZhcmlhYmxlcyhAb2JqZWN0LmludGVycHJldGVyLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXRCb29sZWFuVmFsdWVUbyhwYXJhbWV0ZXIuYm9vbGVhblZhcmlhYmxlLCB2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMyAjIFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zdHJpbmdWYWx1ZU9mKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBUZW1wVmFyaWFibGVzKEBvYmplY3QuaW50ZXJwcmV0ZXIuY29udGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldFN0cmluZ1ZhbHVlVG8ocGFyYW1ldGVyLnN0cmluZ1ZhcmlhYmxlLCB2YWx1ZSlcbiAgICAjIyMqXG4gICAgKiBDYWxscyB0aGUgY29tbW9uLWV2ZW50IHdpdGggdGhlIHNwZWNpZmllZCBwYXJhbWV0ZXJzLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2FsbFxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgVGhlIGNvbW1vbi1ldmVudCdzIHBhcmFtZXRlcnMgd2hpY2ggY2FuIGJlIGNvbmZpZ3VyZWQgaW4gZGF0YWJhc2UuXG4gICAgIyMjIFxuICAgIGNhbGw6IChwYXJhbWV0ZXJzLCBzZXR0aW5ncywgcGFyZW50Q29udGV4dCkgLT5cbiAgICAgICAgaWYgbm90IEBvYmplY3QucmVjb3JkLnNpbmdsZUluc3RhbmNlXG4gICAgICAgICAgICBpbnRlcnByZXRlciA9IG5ldyBncy5Db21wb25lbnRfQ29tbWFuZEludGVycHJldGVyKClcbiAgICAgICAgICAgIGludGVycHJldGVyLmNvbnRleHQuc2V0KEBvYmplY3QucmVjb3JkLmluZGV4ICsgXCJfXCIgKyBAY2FsbERlcHRoLCBAb2JqZWN0LnJlY29yZClcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuY2xlYXJUZW1wVmFyaWFibGVzKGludGVycHJldGVyLmNvbnRleHQpXG4gICAgICAgICAgICBAb2JqZWN0LmNvbW1hbmRzID0gQG9iamVjdC5yZWNvcmQuY29tbWFuZHNcbiAgICAgICAgICAgIEBjYWxsRGVwdGgrK1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpbnRlcnByZXRlciA9IEBvYmplY3QuaW50ZXJwcmV0ZXIgfHwgbmV3IGdzLkNvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXIoKVxuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY29udGV4dC5zZXQoQG9iamVjdC5yZWNvcmQuaW5kZXgsIEBvYmplY3QucmVjb3JkKVxuICAgICAgICAgICAgQG9iamVjdC5jb21tYW5kcyA9IEBvYmplY3QucmVjb3JkLmNvbW1hbmRzXG4gICAgICAgICAgICBcbiAgICAgICAgaW50ZXJwcmV0ZXIucmVwZWF0ID0gbm9cbiAgICAgICAgaW50ZXJwcmV0ZXIub2JqZWN0ID0gQG9iamVjdFxuICAgICAgICBpbnRlcnByZXRlci5zZXR0aW5ncyA9IHNldHRpbmdzIGlmIHNldHRpbmdzXG4gICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIgPSBpbnRlcnByZXRlclxuICAgICAgICBcbiAgICAgICAgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXR1cFRlbXBWYXJpYWJsZXMoaW50ZXJwcmV0ZXIuY29udGV4dClcbiAgICAgICAgQHNldHVwUGFyYW1ldGVycyhwYXJhbWV0ZXJzLCBwYXJlbnRDb250ZXh0KVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QucmVjb3JkLnBhcmFsbGVsXG4gICAgICAgICAgICBpbnRlcnByZXRlci5vbkZpbmlzaCA9IChzZW5kZXIpID0+IFxuICAgICAgICAgICAgICAgIEBvYmplY3QucmVtb3ZlQ29tcG9uZW50KHNlbmRlcilcbiAgICAgICAgICAgICAgICBpZiBub3QgQG9iamVjdC5yZWNvcmQuc2luZ2xlSW5zdGFuY2VcbiAgICAgICAgICAgICAgICAgICAgQGNhbGxEZXB0aC0tXG4gICAgICAgICAgICBpbnRlcnByZXRlci5zdGFydCgpXG4gICAgICAgICAgICBAb2JqZWN0LmFkZENvbXBvbmVudChpbnRlcnByZXRlcilcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaW50ZXJwcmV0ZXIub25GaW5pc2ggPSAoc2VuZGVyKSA9PiBcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmV2ZW50cy5lbWl0KFwiZmluaXNoXCIsIHRoaXMpXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJwcmV0ZXJcbiAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTdG9wcyB0aGUgY29tbW9uLWV2ZW50IGludGVycHJldGVyLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RvcFxuICAgICMjIyAgICAgIFxuICAgIHN0b3A6IC0+XG4gICAgICAgIGlmIEBvYmplY3QuaW50ZXJwcmV0ZXI/XG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLnN0b3AoKVxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJmaW5pc2hcIiwgdGhpcylcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZXN1bWVzIGEgcGF1c2VkIGNvbW1vbi1ldmVudCBpbnRlcnByZXRlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3VtZVxuICAgICMjIyAgICAgICAgICAgXG4gICAgcmVzdW1lOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyP1xuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5yZXN1bWUoKVxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJzdGFydFwiLCB0aGlzKVxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJyZXN1bWVcIiwgdGhpcylcbiAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGNvbW1vbi1ldmVudCBpbnRlcnByZXRlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgaWYgbm90IEBpbml0aWFsaXplZFxuICAgICAgICAgICAgQHNldHVwKClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyPyBhbmQgQHJlYWR5VG9TdGFydFxuICAgICAgICAgICAgQHJlYWR5VG9TdGFydCA9IG5vXG4gICAgICAgICAgICBAc2V0dXBQYXJhbWV0ZXJzKEBzdGFydFBhcmFtZXRlcnMpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLnN0YXJ0KClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyPyBhbmQgQG9iamVjdC5yZWNvcmQuc3RhcnRDb25kaXRpb24gPT0gMSBhbmQgbm90IEBvYmplY3QuaW50ZXJwcmV0ZXIuaXNSdW5uaW5nXG4gICAgICAgICAgICBpZiBAb2JqZWN0LnJlY29yZC5jb25kaXRpb25FbmFibGVkXG4gICAgICAgICAgICAgICAgaWYgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5ib29sZWFuVmFsdWVPZihAb2JqZWN0LnJlY29yZC5jb25kaXRpb25Td2l0Y2gpXG4gICAgICAgICAgICAgICAgICAgIEBzdGFydCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHN0YXJ0KClcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBOb3QgaW1wbGVtZW50ZWQgeWV0LlxuICAgICpcbiAgICAqIEBtZXRob2QgZXJhc2VcbiAgICAjIyMgXG4gICAgZXJhc2U6IC0+XG4gICAgICAgIFxuZ3MuQ29tcG9uZW50X0NvbW1vbkV2ZW50QmVoYXZpb3IgPSBDb21wb25lbnRfQ29tbW9uRXZlbnRCZWhhdmlvciJdfQ==
//# sourceURL=Component_CommonEventBehavior_162.js