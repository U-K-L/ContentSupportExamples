var Component_BindingHandler,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_BindingHandler = (function(superClass) {
  extend(Component_BindingHandler, superClass);


  /**
  * Caches already compiled binding-paths.
  * @property compiledPaths
  * @type Object
  * @static
   */

  Component_BindingHandler.compiledPaths = {};


  /**
  * A binding-handler component allows a UI game object to execute
  * property-bindings.<br><br>
  *
  * For example: A text-label can bind its text-property to a backend-field 
  * like the current music-volume to always display correct music-volume. 
  * If the volume changes, the text-property will be updated
  * automatically.
  *
  * To define a binding, a special property-path syntax is used. For example:<br>
  * <br>
  * $myTextField.text<br>
  * <br>
  * is a property-path to access the text-property of a text-field object
  * with the identifier "myTextField". For more information, take a look
  * into the "In Game UI System" section of the help-file.
  * 
  * @module ui
  * @class Component_BindingHandler
  * @extends ui.Component_Handler
  * @memberof ui
  * @constructor
   */

  function Component_BindingHandler() {}


  /**
  * Initializes the binding-handler.
  * 
  * @method setup
   */

  Component_BindingHandler.prototype.setup = function() {};


  /**
  * Updates the binding-handler.
  * 
  * @method update
   */

  Component_BindingHandler.prototype.update = function() {
    var binding, i, len, ref;
    ref = this.object.bindings;
    for (i = 0, len = ref.length; i < len; i++) {
      binding = ref[i];
      this.executeBinding(binding);
    }
    this.object.initialized = true;
    return null;
  };


  /**
  * Executes a specified binding. The binding is only executed if all assigned
  * events and conditions are true.
  * 
  * @method executeBinding
  * @param {Object} binding - The binding to execute.
   */

  Component_BindingHandler.prototype.executeBinding = function(binding) {
    var offset, ref, ref1, source, target, value;
    if (!this.checkObject(binding)) {
      return;
    }
    source = (ref = binding.sourceFunc) != null ? ref : (binding.sourceFunc = this.resolveFieldPath(binding.sourceField));
    target = (ref1 = binding.targetFunc) != null ? ref1 : (binding.targetFunc = this.resolveFieldPath(binding.targetField));
    if (!target) {
      return;
    }
    if (!source) {
      return target.set(this.object, null);
    }
    value = source.get(this.object);
    offset = 0;
    if (binding.offset != null) {
      value += binding.offset;
    }
    if (binding.max != null) {
      value = Math.min(binding.max, value);
    }
    if (binding.min != null) {
      value = Math.max(binding.min, value);
    }
    return target.set(this.object, value);
  };


  /**
  * Evaluates a specified property-path and returns the result.
  * 
  * @method fieldValue
  * @param {string} path - A property-path.
  * @return {Object} The value of the property-path.
   */

  Component_BindingHandler.prototype.fieldValue = function(path) {
    return ui.Component_BindingHandler.fieldValue(this.object, path);
  };


  /**
  * Executes a specified binding. The binding is only executed if all assigned
  * events and conditions are true.
  * 
  * @method executeBinding
  * @param {Object} binding - The binding to execute.
  * @static
   */

  Component_BindingHandler.executeBinding = function(sender, binding) {
    var binder;
    binder = new ui.BindingHandler();
    binder.object = sender;
    return binder.executeBinding(binding);
  };


  /**
  * Evaluates a property-path on a specified object and returns the result.
  * 
  * @method fieldValue
  * @static
  * @param {Object} object - An object to evaluate the property-path on.
  * @param {string} path - A property-path.
  * @return {Object} The value of the property-path.
   */

  Component_BindingHandler.fieldValue = function(object, path) {
    var field;
    if (typeof path === "string") {
      field = ui.Component_BindingHandler.resolveFieldPath(object, path);
      if (field == null) {
        return 0;
      }
      return field.get(object);
    } else {
      return path;
    }
  };


  /**
  * Resolves a property-path of a specified object and returns the result. The
  * result-object has a get- and an optional set-function to get or set the
  * value for the property-path. The set-function is only present for property-paths
  * which can be written.
  * 
  * @method resolveFieldPath
  * @static
  * @param {Object} object - An object to evaluate the property-path on.
  * @param {string} path - A property-path.
  * @return {Object} The result-object containing a get- and set-function to manipulate the property-value.
   */

  Component_BindingHandler.resolveFieldPath = function(object, path) {
    var result;
    result = ui.Component_BindingHandler.compiledPaths[path];
    if (result != null) {
      return result;
    }
    if (path != null) {
      result = {
        set: null,
        get: null
      };
      result.get = eval("(function(o) { return " + path + " })");
      result.set = eval("(function(o, v) { " + path + " = v; })");
      ui.Component_BindingHandler.compiledPaths[path] = result;
    }
    return result;
  };


  /**
  * Resolves a property-path and returns the result. The
  * result-object has a get- and an optional set-function to get or set the
  * value for the property-path. The set-function is only present for property-paths
  * which can be written.
  * 
  * @method resolveFieldPath
  * @param {Object} object - An object to evaluate the property-path on.
  * @param {string} path - A property-path.
  * @return {Object} The result-object containing a get- and set-function to manipulate the property-value.
   */

  Component_BindingHandler.prototype.resolveFieldPath = function(path) {
    return ui.Component_BindingHandler.resolveFieldPath(this.object, path);
  };

  return Component_BindingHandler;

})(ui.Component_Handler);

ui.Component_BindingHandler = Component_BindingHandler;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7OztFQU1BLHdCQUFDLENBQUEsYUFBRCxHQUFnQjs7O0FBRWhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QmEsa0NBQUEsR0FBQTs7O0FBRWI7Ozs7OztxQ0FLQSxLQUFBLEdBQU8sU0FBQSxHQUFBOzs7QUFFUDs7Ozs7O3FDQUtBLE1BQUEsR0FBUSxTQUFBO0FBQ0osUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQjtBQURKO0lBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLEdBQXNCO0FBRXRCLFdBQU87RUFOSDs7O0FBUVI7Ozs7Ozs7O3FDQU9BLGNBQUEsR0FBZ0IsU0FBQyxPQUFEO0FBQ1osUUFBQTtJQUFBLElBQVUsQ0FBSSxJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsQ0FBZDtBQUFBLGFBQUE7O0lBRUEsTUFBQSw4Q0FBOEIsQ0FBQyxPQUFPLENBQUMsVUFBUixHQUFtQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsT0FBTyxDQUFDLFdBQTFCLENBQXBCO0lBQzlCLE1BQUEsZ0RBQThCLENBQUMsT0FBTyxDQUFDLFVBQVIsR0FBbUIsSUFBQyxDQUFBLGdCQUFELENBQWtCLE9BQU8sQ0FBQyxXQUExQixDQUFwQjtJQUU5QixJQUFVLENBQUMsTUFBWDtBQUFBLGFBQUE7O0lBQ0EsSUFBb0MsQ0FBQyxNQUFyQztBQUFBLGFBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsTUFBWixFQUFvQixJQUFwQixFQUFQOztJQUVBLEtBQUEsR0FBUSxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxNQUFaO0lBQ1IsTUFBQSxHQUFTO0lBRVQsSUFBRyxzQkFBSDtNQUNJLEtBQUEsSUFBUyxPQUFPLENBQUMsT0FEckI7O0lBRUEsSUFBRyxtQkFBSDtNQUNJLEtBQUEsR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQU8sQ0FBQyxHQUFqQixFQUFzQixLQUF0QixFQURaOztJQUVBLElBQUcsbUJBQUg7TUFDSSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFPLENBQUMsR0FBakIsRUFBc0IsS0FBdEIsRUFEWjs7V0FHQSxNQUFNLENBQUMsR0FBUCxDQUFXLElBQUMsQ0FBQSxNQUFaLEVBQW9CLEtBQXBCO0VBbkJZOzs7QUFxQmhCOzs7Ozs7OztxQ0FPQSxVQUFBLEdBQVksU0FBQyxJQUFEO1dBQVUsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFVBQTVCLENBQXVDLElBQUMsQ0FBQSxNQUF4QyxFQUFnRCxJQUFoRDtFQUFWOzs7QUFFWjs7Ozs7Ozs7O0VBUUEsd0JBQUMsQ0FBQSxjQUFELEdBQWlCLFNBQUMsTUFBRCxFQUFTLE9BQVQ7QUFDYixRQUFBO0lBQUEsTUFBQSxHQUFhLElBQUEsRUFBRSxDQUFDLGNBQUgsQ0FBQTtJQUNiLE1BQU0sQ0FBQyxNQUFQLEdBQWdCO1dBQ2hCLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCO0VBSGE7OztBQUtqQjs7Ozs7Ozs7OztFQVNBLHdCQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDVCxRQUFBO0lBQUEsSUFBRyxPQUFPLElBQVAsS0FBZSxRQUFsQjtNQUNJLEtBQUEsR0FBUSxFQUFFLENBQUMsd0JBQXdCLENBQUMsZ0JBQTVCLENBQTZDLE1BQTdDLEVBQXFELElBQXJEO01BQ1IsSUFBZ0IsYUFBaEI7QUFBQSxlQUFPLEVBQVA7O0FBQ0EsYUFBTyxLQUFLLENBQUMsR0FBTixDQUFVLE1BQVYsRUFIWDtLQUFBLE1BQUE7QUFLSSxhQUFPLEtBTFg7O0VBRFM7OztBQVFiOzs7Ozs7Ozs7Ozs7O0VBWUEsd0JBQUMsQ0FBQSxnQkFBRCxHQUFtQixTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ2YsUUFBQTtJQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUMsYUFBYyxDQUFBLElBQUE7SUFDbkQsSUFBRyxjQUFIO0FBQWdCLGFBQU8sT0FBdkI7O0lBRUEsSUFBRyxZQUFIO01BQ0ksTUFBQSxHQUFTO1FBQUUsR0FBQSxFQUFLLElBQVA7UUFBYSxHQUFBLEVBQUssSUFBbEI7O01BQ1QsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFBLENBQUssd0JBQUEsR0FBMkIsSUFBM0IsR0FBa0MsS0FBdkM7TUFDYixNQUFNLENBQUMsR0FBUCxHQUFhLElBQUEsQ0FBSyxvQkFBQSxHQUF1QixJQUF2QixHQUE4QixVQUFuQztNQUViLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFjLENBQUEsSUFBQSxDQUExQyxHQUFrRCxPQUx0RDs7QUFPQSxXQUFPO0VBWFE7OztBQWFuQjs7Ozs7Ozs7Ozs7O3FDQVdBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtXQUFVLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBNUIsQ0FBNkMsSUFBQyxDQUFBLE1BQTlDLEVBQXNELElBQXREO0VBQVY7Ozs7R0E3SmlCLEVBQUUsQ0FBQzs7QUErSjFDLEVBQUUsQ0FBQyx3QkFBSCxHQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0JpbmRpbmdIYW5kbGVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfQmluZGluZ0hhbmRsZXIgZXh0ZW5kcyB1aS5Db21wb25lbnRfSGFuZGxlclxuICAgICMjIypcbiAgICAqIENhY2hlcyBhbHJlYWR5IGNvbXBpbGVkIGJpbmRpbmctcGF0aHMuXG4gICAgKiBAcHJvcGVydHkgY29tcGlsZWRQYXRoc1xuICAgICogQHR5cGUgT2JqZWN0XG4gICAgKiBAc3RhdGljXG4gICAgIyMjXG4gICAgQGNvbXBpbGVkUGF0aHM6IHt9XG4gICAgXG4gICAgIyMjKlxuICAgICogQSBiaW5kaW5nLWhhbmRsZXIgY29tcG9uZW50IGFsbG93cyBhIFVJIGdhbWUgb2JqZWN0IHRvIGV4ZWN1dGVcbiAgICAqIHByb3BlcnR5LWJpbmRpbmdzLjxicj48YnI+XG4gICAgKlxuICAgICogRm9yIGV4YW1wbGU6IEEgdGV4dC1sYWJlbCBjYW4gYmluZCBpdHMgdGV4dC1wcm9wZXJ0eSB0byBhIGJhY2tlbmQtZmllbGQgXG4gICAgKiBsaWtlIHRoZSBjdXJyZW50IG11c2ljLXZvbHVtZSB0byBhbHdheXMgZGlzcGxheSBjb3JyZWN0IG11c2ljLXZvbHVtZS4gXG4gICAgKiBJZiB0aGUgdm9sdW1lIGNoYW5nZXMsIHRoZSB0ZXh0LXByb3BlcnR5IHdpbGwgYmUgdXBkYXRlZFxuICAgICogYXV0b21hdGljYWxseS5cbiAgICAqXG4gICAgKiBUbyBkZWZpbmUgYSBiaW5kaW5nLCBhIHNwZWNpYWwgcHJvcGVydHktcGF0aCBzeW50YXggaXMgdXNlZC4gRm9yIGV4YW1wbGU6PGJyPlxuICAgICogPGJyPlxuICAgICogJG15VGV4dEZpZWxkLnRleHQ8YnI+XG4gICAgKiA8YnI+XG4gICAgKiBpcyBhIHByb3BlcnR5LXBhdGggdG8gYWNjZXNzIHRoZSB0ZXh0LXByb3BlcnR5IG9mIGEgdGV4dC1maWVsZCBvYmplY3RcbiAgICAqIHdpdGggdGhlIGlkZW50aWZpZXIgXCJteVRleHRGaWVsZFwiLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgdGFrZSBhIGxvb2tcbiAgICAqIGludG8gdGhlIFwiSW4gR2FtZSBVSSBTeXN0ZW1cIiBzZWN0aW9uIG9mIHRoZSBoZWxwLWZpbGUuXG4gICAgKiBcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfQmluZGluZ0hhbmRsZXJcbiAgICAqIEBleHRlbmRzIHVpLkNvbXBvbmVudF9IYW5kbGVyXG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIGJpbmRpbmctaGFuZGxlci5cbiAgICAqIFxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBiaW5kaW5nLWhhbmRsZXIuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBmb3IgYmluZGluZyBpbiBAb2JqZWN0LmJpbmRpbmdzXG4gICAgICAgICAgICBAZXhlY3V0ZUJpbmRpbmcoYmluZGluZylcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3QuaW5pdGlhbGl6ZWQgPSB5ZXNcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgIFxuICAgICMjIypcbiAgICAqIEV4ZWN1dGVzIGEgc3BlY2lmaWVkIGJpbmRpbmcuIFRoZSBiaW5kaW5nIGlzIG9ubHkgZXhlY3V0ZWQgaWYgYWxsIGFzc2lnbmVkXG4gICAgKiBldmVudHMgYW5kIGNvbmRpdGlvbnMgYXJlIHRydWUuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgZXhlY3V0ZUJpbmRpbmdcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5nIC0gVGhlIGJpbmRpbmcgdG8gZXhlY3V0ZS5cbiAgICAjIyMgICAgXG4gICAgZXhlY3V0ZUJpbmRpbmc6IChiaW5kaW5nKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IEBjaGVja09iamVjdChiaW5kaW5nKVxuICAgICAgICBcbiAgICAgICAgc291cmNlID0gYmluZGluZy5zb3VyY2VGdW5jID8gKGJpbmRpbmcuc291cmNlRnVuYz1AcmVzb2x2ZUZpZWxkUGF0aChiaW5kaW5nLnNvdXJjZUZpZWxkKSlcbiAgICAgICAgdGFyZ2V0ID0gYmluZGluZy50YXJnZXRGdW5jID8gKGJpbmRpbmcudGFyZ2V0RnVuYz1AcmVzb2x2ZUZpZWxkUGF0aChiaW5kaW5nLnRhcmdldEZpZWxkKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpZiAhdGFyZ2V0XG4gICAgICAgIHJldHVybiB0YXJnZXQuc2V0KEBvYmplY3QsIG51bGwpIGlmICFzb3VyY2VcbiAgICAgICAgICAgIFxuICAgICAgICB2YWx1ZSA9IHNvdXJjZS5nZXQoQG9iamVjdClcbiAgICAgICAgb2Zmc2V0ID0gMFxuICAgICAgICBcbiAgICAgICAgaWYgYmluZGluZy5vZmZzZXQ/XG4gICAgICAgICAgICB2YWx1ZSArPSBiaW5kaW5nLm9mZnNldFxuICAgICAgICBpZiBiaW5kaW5nLm1heD9cbiAgICAgICAgICAgIHZhbHVlID0gTWF0aC5taW4oYmluZGluZy5tYXgsIHZhbHVlKVxuICAgICAgICBpZiBiaW5kaW5nLm1pbj9cbiAgICAgICAgICAgIHZhbHVlID0gTWF0aC5tYXgoYmluZGluZy5taW4sIHZhbHVlKVxuICAgICAgICAgICAgXG4gICAgICAgIHRhcmdldC5zZXQoQG9iamVjdCwgdmFsdWUpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBFdmFsdWF0ZXMgYSBzcGVjaWZpZWQgcHJvcGVydHktcGF0aCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICogXG4gICAgKiBAbWV0aG9kIGZpZWxkVmFsdWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gQSBwcm9wZXJ0eS1wYXRoLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LXBhdGguXG4gICAgIyMjIFxuICAgIGZpZWxkVmFsdWU6IChwYXRoKSAtPiB1aS5Db21wb25lbnRfQmluZGluZ0hhbmRsZXIuZmllbGRWYWx1ZShAb2JqZWN0LCBwYXRoKSAgXG4gICAgXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBzcGVjaWZpZWQgYmluZGluZy4gVGhlIGJpbmRpbmcgaXMgb25seSBleGVjdXRlZCBpZiBhbGwgYXNzaWduZWRcbiAgICAqIGV2ZW50cyBhbmQgY29uZGl0aW9ucyBhcmUgdHJ1ZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCBleGVjdXRlQmluZGluZ1xuICAgICogQHBhcmFtIHtPYmplY3R9IGJpbmRpbmcgLSBUaGUgYmluZGluZyB0byBleGVjdXRlLlxuICAgICogQHN0YXRpY1xuICAgICMjIyBcbiAgICBAZXhlY3V0ZUJpbmRpbmc6IChzZW5kZXIsIGJpbmRpbmcpIC0+XG4gICAgICAgIGJpbmRlciA9IG5ldyB1aS5CaW5kaW5nSGFuZGxlcigpXG4gICAgICAgIGJpbmRlci5vYmplY3QgPSBzZW5kZXJcbiAgICAgICAgYmluZGVyLmV4ZWN1dGVCaW5kaW5nKGJpbmRpbmcpXG5cbiAgICAjIyMqXG4gICAgKiBFdmFsdWF0ZXMgYSBwcm9wZXJ0eS1wYXRoIG9uIGEgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICogXG4gICAgKiBAbWV0aG9kIGZpZWxkVmFsdWVcbiAgICAqIEBzdGF0aWNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBBbiBvYmplY3QgdG8gZXZhbHVhdGUgdGhlIHByb3BlcnR5LXBhdGggb24uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIEEgcHJvcGVydHktcGF0aC5cbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS1wYXRoLlxuICAgICMjIyBcbiAgICBAZmllbGRWYWx1ZTogKG9iamVjdCwgcGF0aCkgLT5cbiAgICAgICAgaWYgdHlwZW9mIHBhdGggPT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgZmllbGQgPSB1aS5Db21wb25lbnRfQmluZGluZ0hhbmRsZXIucmVzb2x2ZUZpZWxkUGF0aChvYmplY3QsIHBhdGgpXG4gICAgICAgICAgICByZXR1cm4gMCB1bmxlc3MgZmllbGQ/XG4gICAgICAgICAgICByZXR1cm4gZmllbGQuZ2V0KG9iamVjdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHBhdGhcbiAgICAgXG4gICAgIyMjKlxuICAgICogUmVzb2x2ZXMgYSBwcm9wZXJ0eS1wYXRoIG9mIGEgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LiBUaGVcbiAgICAqIHJlc3VsdC1vYmplY3QgaGFzIGEgZ2V0LSBhbmQgYW4gb3B0aW9uYWwgc2V0LWZ1bmN0aW9uIHRvIGdldCBvciBzZXQgdGhlXG4gICAgKiB2YWx1ZSBmb3IgdGhlIHByb3BlcnR5LXBhdGguIFRoZSBzZXQtZnVuY3Rpb24gaXMgb25seSBwcmVzZW50IGZvciBwcm9wZXJ0eS1wYXRoc1xuICAgICogd2hpY2ggY2FuIGJlIHdyaXR0ZW4uXG4gICAgKiBcbiAgICAqIEBtZXRob2QgcmVzb2x2ZUZpZWxkUGF0aFxuICAgICogQHN0YXRpY1xuICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIEFuIG9iamVjdCB0byBldmFsdWF0ZSB0aGUgcHJvcGVydHktcGF0aCBvbi5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gQSBwcm9wZXJ0eS1wYXRoLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0LW9iamVjdCBjb250YWluaW5nIGEgZ2V0LSBhbmQgc2V0LWZ1bmN0aW9uIHRvIG1hbmlwdWxhdGUgdGhlIHByb3BlcnR5LXZhbHVlLlxuICAgICMjIyAgICBcbiAgICBAcmVzb2x2ZUZpZWxkUGF0aDogKG9iamVjdCwgcGF0aCkgLT4gXG4gICAgICAgIHJlc3VsdCA9IHVpLkNvbXBvbmVudF9CaW5kaW5nSGFuZGxlci5jb21waWxlZFBhdGhzW3BhdGhdXG4gICAgICAgIGlmIHJlc3VsdD8gdGhlbiByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICAgICBpZiBwYXRoPyAgXG4gICAgICAgICAgICByZXN1bHQgPSB7IHNldDogbnVsbCwgZ2V0OiBudWxsIH1cbiAgICAgICAgICAgIHJlc3VsdC5nZXQgPSBldmFsKFwiKGZ1bmN0aW9uKG8pIHsgcmV0dXJuIFwiICsgcGF0aCArIFwiIH0pXCIpXG4gICAgICAgICAgICByZXN1bHQuc2V0ID0gZXZhbChcIihmdW5jdGlvbihvLCB2KSB7IFwiICsgcGF0aCArIFwiID0gdjsgfSlcIilcbiAgICAgICAgICBcbiAgICAgICAgICAgIHVpLkNvbXBvbmVudF9CaW5kaW5nSGFuZGxlci5jb21waWxlZFBhdGhzW3BhdGhdID0gcmVzdWx0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgXG4gICAgIyMjKlxuICAgICogUmVzb2x2ZXMgYSBwcm9wZXJ0eS1wYXRoIGFuZCByZXR1cm5zIHRoZSByZXN1bHQuIFRoZVxuICAgICogcmVzdWx0LW9iamVjdCBoYXMgYSBnZXQtIGFuZCBhbiBvcHRpb25hbCBzZXQtZnVuY3Rpb24gdG8gZ2V0IG9yIHNldCB0aGVcbiAgICAqIHZhbHVlIGZvciB0aGUgcHJvcGVydHktcGF0aC4gVGhlIHNldC1mdW5jdGlvbiBpcyBvbmx5IHByZXNlbnQgZm9yIHByb3BlcnR5LXBhdGhzXG4gICAgKiB3aGljaCBjYW4gYmUgd3JpdHRlbi5cbiAgICAqIFxuICAgICogQG1ldGhvZCByZXNvbHZlRmllbGRQYXRoXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQW4gb2JqZWN0IHRvIGV2YWx1YXRlIHRoZSBwcm9wZXJ0eS1wYXRoIG9uLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBBIHByb3BlcnR5LXBhdGguXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHQtb2JqZWN0IGNvbnRhaW5pbmcgYSBnZXQtIGFuZCBzZXQtZnVuY3Rpb24gdG8gbWFuaXB1bGF0ZSB0aGUgcHJvcGVydHktdmFsdWUuXG4gICAgIyMjICAgICBcbiAgICByZXNvbHZlRmllbGRQYXRoOiAocGF0aCkgLT4gdWkuQ29tcG9uZW50X0JpbmRpbmdIYW5kbGVyLnJlc29sdmVGaWVsZFBhdGgoQG9iamVjdCwgcGF0aClcbiAgICAgICAgXG51aS5Db21wb25lbnRfQmluZGluZ0hhbmRsZXIgPSBDb21wb25lbnRfQmluZGluZ0hhbmRsZXIiXX0=
//# sourceURL=Component_BindingHandler_113.js