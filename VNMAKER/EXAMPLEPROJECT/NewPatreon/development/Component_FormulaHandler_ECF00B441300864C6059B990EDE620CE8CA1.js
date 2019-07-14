var Component_FormulaHandler,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_FormulaHandler = (function(superClass) {
  extend(Component_FormulaHandler, superClass);


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

  function Component_FormulaHandler() {
    this.breakChainAt = null;
  }


  /**
  * Initializes the binding-handler.
  * 
  * @method setup
   */

  Component_FormulaHandler.prototype.setup = function() {};


  /**
  * Updates the binding-handler.
  * 
  * @method update
   */

  Component_FormulaHandler.prototype.update = function() {
    var formula, i, len, ref;
    ref = this.object.formulas;
    for (i = 0, len = ref.length; i < len; i++) {
      formula = ref[i];
      this.executeFormula(formula);
    }
    this.object.initialized = true;
    return null;
  };

  Component_FormulaHandler.prototype.executeFormula = function(formula) {
    if (this.checkObject(formula)) {
      window.o = this.object;
      window.d = this.object.data[0];
      return formula.exec();
    }
  };

  Component_FormulaHandler.executeFormula = function(object, formula) {
    window.o = object;
    window.d = object.data[0];
    return formula.exec();
  };


  /**
  * Evaluates a specified property-path and returns the result.
  * 
  * @method fieldValue
  * @param {string} path - A property-path.
  * @return {Object} The value of the property-path.
   */

  Component_FormulaHandler.prototype.fieldValue = function(path) {
    return ui.FormulaHandler.fieldValue(this.object, path);
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

  Component_FormulaHandler.fieldValue = function(object, path, readOnly) {
    var ref, value;
    if (typeof (path != null ? path.exec : void 0) === "function") {
      window.o = object;
      window.d = object != null ? (ref = object.data) != null ? ref[0] : void 0 : void 0;
      value = path.exec();
      return value != null ? value : 0;
    } else {
      return path;
    }
  };

  return Component_FormulaHandler;

})(ui.Component_Handler);

ui.Component_FormulaHandler = Component_FormulaHandler;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBdUJhLGtDQUFBO0lBQ1QsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7RUFEUDs7O0FBR2I7Ozs7OztxQ0FLQSxLQUFBLEdBQU8sU0FBQSxHQUFBOzs7QUFFUDs7Ozs7O3FDQUtBLE1BQUEsR0FBUSxTQUFBO0FBQ0osUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQjtBQURKO0lBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLEdBQXNCO0FBRXRCLFdBQU87RUFOSDs7cUNBUVIsY0FBQSxHQUFnQixTQUFDLE9BQUQ7SUFDWixJQUFHLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBYixDQUFIO01BQ0ksTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUE7TUFDWixNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSyxDQUFBLENBQUE7YUFDeEIsT0FBTyxDQUFDLElBQVIsQ0FBQSxFQUhKOztFQURZOztFQU1oQix3QkFBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxNQUFELEVBQVMsT0FBVDtJQUNiLE1BQU0sQ0FBQyxDQUFQLEdBQVc7SUFDWCxNQUFNLENBQUMsQ0FBUCxHQUFXLE1BQU0sQ0FBQyxJQUFLLENBQUEsQ0FBQTtXQUN2QixPQUFPLENBQUMsSUFBUixDQUFBO0VBSGE7OztBQUtqQjs7Ozs7Ozs7cUNBT0EsVUFBQSxHQUFZLFNBQUMsSUFBRDtXQUFVLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBbEIsQ0FBNkIsSUFBQyxDQUFBLE1BQTlCLEVBQXNDLElBQXRDO0VBQVY7OztBQUVaOzs7Ozs7Ozs7O0VBU0Esd0JBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLFFBQWY7QUFDVCxRQUFBO0lBQUEsSUFBRyxPQUFPLGdCQUFDLElBQUksQ0FBRSxhQUFQLENBQVAsS0FBdUIsVUFBMUI7TUFDSSxNQUFNLENBQUMsQ0FBUCxHQUFXO01BQ1gsTUFBTSxDQUFDLENBQVAscURBQXlCLENBQUEsQ0FBQTtNQUN6QixLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBQTtBQUVSLDZCQUFPLFFBQVEsRUFMbkI7S0FBQSxNQUFBO0FBT0ksYUFBTyxLQVBYOztFQURTOzs7O0dBNUVzQixFQUFFLENBQUM7O0FBc0YxQyxFQUFFLENBQUMsd0JBQUgsR0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9Gb3JtdWxhSGFuZGxlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyIGV4dGVuZHMgdWkuQ29tcG9uZW50X0hhbmRsZXJcbiAgICAjIyMqXG4gICAgKiBBIGJpbmRpbmctaGFuZGxlciBjb21wb25lbnQgYWxsb3dzIGEgVUkgZ2FtZSBvYmplY3QgdG8gZXhlY3V0ZVxuICAgICogcHJvcGVydHktYmluZGluZ3MuPGJyPjxicj5cbiAgICAqXG4gICAgKiBGb3IgZXhhbXBsZTogQSB0ZXh0LWxhYmVsIGNhbiBiaW5kIGl0cyB0ZXh0LXByb3BlcnR5IHRvIGEgYmFja2VuZC1maWVsZCBcbiAgICAqIGxpa2UgdGhlIGN1cnJlbnQgbXVzaWMtdm9sdW1lIHRvIGFsd2F5cyBkaXNwbGF5IGNvcnJlY3QgbXVzaWMtdm9sdW1lLiBcbiAgICAqIElmIHRoZSB2b2x1bWUgY2hhbmdlcywgdGhlIHRleHQtcHJvcGVydHkgd2lsbCBiZSB1cGRhdGVkXG4gICAgKiBhdXRvbWF0aWNhbGx5LlxuICAgICpcbiAgICAqIFRvIGRlZmluZSBhIGJpbmRpbmcsIGEgc3BlY2lhbCBwcm9wZXJ0eS1wYXRoIHN5bnRheCBpcyB1c2VkLiBGb3IgZXhhbXBsZTo8YnI+XG4gICAgKiA8YnI+XG4gICAgKiAkbXlUZXh0RmllbGQudGV4dDxicj5cbiAgICAqIDxicj5cbiAgICAqIGlzIGEgcHJvcGVydHktcGF0aCB0byBhY2Nlc3MgdGhlIHRleHQtcHJvcGVydHkgb2YgYSB0ZXh0LWZpZWxkIG9iamVjdFxuICAgICogd2l0aCB0aGUgaWRlbnRpZmllciBcIm15VGV4dEZpZWxkXCIuIEZvciBtb3JlIGluZm9ybWF0aW9uLCB0YWtlIGEgbG9va1xuICAgICogaW50byB0aGUgXCJJbiBHYW1lIFVJIFN5c3RlbVwiIHNlY3Rpb24gb2YgdGhlIGhlbHAtZmlsZS5cbiAgICAqIFxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIENvbXBvbmVudF9CaW5kaW5nSGFuZGxlclxuICAgICogQGV4dGVuZHMgdWkuQ29tcG9uZW50X0hhbmRsZXJcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgIEBicmVha0NoYWluQXQgPSBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBiaW5kaW5nLWhhbmRsZXIuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgYmluZGluZy1oYW5kbGVyLlxuICAgICogXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgZm9yIGZvcm11bGEgaW4gQG9iamVjdC5mb3JtdWxhc1xuICAgICAgICAgICAgQGV4ZWN1dGVGb3JtdWxhKGZvcm11bGEpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LmluaXRpYWxpemVkID0geWVzXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICBcbiAgICBleGVjdXRlRm9ybXVsYTogKGZvcm11bGEpIC0+IFxuICAgICAgICBpZiBAY2hlY2tPYmplY3QoZm9ybXVsYSlcbiAgICAgICAgICAgIHdpbmRvdy5vID0gQG9iamVjdFxuICAgICAgICAgICAgd2luZG93LmQgPSBAb2JqZWN0LmRhdGFbMF1cbiAgICAgICAgICAgIGZvcm11bGEuZXhlYygpXG4gICAgICAgICAgICBcbiAgICBAZXhlY3V0ZUZvcm11bGE6IChvYmplY3QsIGZvcm11bGEpIC0+XG4gICAgICAgIHdpbmRvdy5vID0gb2JqZWN0XG4gICAgICAgIHdpbmRvdy5kID0gb2JqZWN0LmRhdGFbMF1cbiAgICAgICAgZm9ybXVsYS5leGVjKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFdmFsdWF0ZXMgYSBzcGVjaWZpZWQgcHJvcGVydHktcGF0aCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICogXG4gICAgKiBAbWV0aG9kIGZpZWxkVmFsdWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gQSBwcm9wZXJ0eS1wYXRoLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LXBhdGguXG4gICAgIyMjIFxuICAgIGZpZWxkVmFsdWU6IChwYXRoKSAtPiB1aS5Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKEBvYmplY3QsIHBhdGgpICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFdmFsdWF0ZXMgYSBwcm9wZXJ0eS1wYXRoIG9uIGEgc3BlY2lmaWVkIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICogXG4gICAgKiBAbWV0aG9kIGZpZWxkVmFsdWVcbiAgICAqIEBzdGF0aWNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBBbiBvYmplY3QgdG8gZXZhbHVhdGUgdGhlIHByb3BlcnR5LXBhdGggb24uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIEEgcHJvcGVydHktcGF0aC5cbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS1wYXRoLlxuICAgICMjIyBcbiAgICBAZmllbGRWYWx1ZTogKG9iamVjdCwgcGF0aCwgcmVhZE9ubHkpIC0+XG4gICAgICAgIGlmIHR5cGVvZiAocGF0aD8uZXhlYykgPT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICB3aW5kb3cubyA9IG9iamVjdFxuICAgICAgICAgICAgd2luZG93LmQgPSBvYmplY3Q/LmRhdGE/WzBdXG4gICAgICAgICAgICB2YWx1ZSA9IHBhdGguZXhlYygpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA/IDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHBhdGhcbiAgICAgXG51aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIgPSBDb21wb25lbnRfRm9ybXVsYUhhbmRsZXIiXX0=
//# sourceURL=Component_FormulaHandler_120.js