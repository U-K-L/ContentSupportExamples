var Component_PanelBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_PanelBehavior = (function(superClass) {
  extend(Component_PanelBehavior, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_PanelBehavior.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A panel-component gives a game-object the same capabilities like
  * a visual object but has no graphical representation. So a panel has
  * a position and a size.<br>
  * <br>
  * It can be used to make invisible hotspot-areas or modal-blocking areas for
  * example.
  *
  * @module gs
  * @class Component_PanelBehavior
  * @extends gs.Component_Visual
  * @memberof gs
  * @constructor
   */

  function Component_PanelBehavior() {}


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_PanelBehavior.prototype.setupEventHandlers = function() {
    if (this.object.modal) {
      gs.GlobalEventManager.on("mouseUp", ((function(_this) {
        return function(e) {
          if (_this.object.modal) {
            return e.breakChain = true;
          }
        };
      })(this)), null, this.object);
      gs.GlobalEventManager.on("mouseDown", ((function(_this) {
        return function(e) {
          if (_this.object.modal) {
            return e.breakChain = true;
          }
        };
      })(this)), null, this.object);
      return gs.GlobalEventManager.on("mouseMoved", ((function(_this) {
        return function(e) {
          if (_this.object.modal) {
            return e.breakChain = true;
          }
        };
      })(this)), null, this.object);
    }
  };


  /**
  * Initializes the panel component.
  *
  * @method setup
   */

  Component_PanelBehavior.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Disposes the component.
  *
  * @method dispose
   */

  Component_PanelBehavior.prototype.dispose = function() {
    Component_PanelBehavior.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("mouseDown", this.object);
    return gs.GlobalEventManager.offByOwner("mouseMoved", this.object);
  };

  return Component_PanelBehavior;

})(gs.Component_Visual);

gs.Component_PanelBehavior = Component_PanelBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O29DQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7Ozs7O0VBY2EsaUNBQUEsR0FBQTs7O0FBR2I7Ozs7OztvQ0FLQSxrQkFBQSxHQUFvQixTQUFBO0lBQ2hCLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFYO01BQ0ksRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQXRCLENBQXlCLFNBQXpCLEVBQW9DLENBQUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7VUFBTyxJQUFHLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWDttQkFBc0IsQ0FBQyxDQUFDLFVBQUYsR0FBZSxLQUFyQzs7UUFBUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFwQyxFQUF1RixJQUF2RixFQUE2RixJQUFDLENBQUEsTUFBOUY7TUFDQSxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBdEIsQ0FBeUIsV0FBekIsRUFBc0MsQ0FBQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFYO21CQUFzQixDQUFDLENBQUMsVUFBRixHQUFlLEtBQXJDOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFELENBQXRDLEVBQXlGLElBQXpGLEVBQStGLElBQUMsQ0FBQSxNQUFoRzthQUNBLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUF0QixDQUF5QixZQUF6QixFQUF1QyxDQUFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQ3BDLElBQUcsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFYO21CQUFzQixDQUFDLENBQUMsVUFBRixHQUFlLEtBQXJDOztRQURvQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUF2QyxFQUVHLElBRkgsRUFFUyxJQUFDLENBQUEsTUFGVixFQUhKOztFQURnQjs7O0FBUXBCOzs7Ozs7b0NBS0EsS0FBQSxHQUFPLFNBQUE7V0FDSCxJQUFDLENBQUEsa0JBQUQsQ0FBQTtFQURHOzs7QUFHUDs7Ozs7O29DQUtBLE9BQUEsR0FBUyxTQUFBO0lBQ0wsc0RBQUEsU0FBQTtJQUVBLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUF0QixDQUFpQyxTQUFqQyxFQUE0QyxJQUFDLENBQUEsTUFBN0M7SUFDQSxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBdEIsQ0FBaUMsV0FBakMsRUFBOEMsSUFBQyxDQUFBLE1BQS9DO1dBQ0EsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQXRCLENBQWlDLFlBQWpDLEVBQStDLElBQUMsQ0FBQSxNQUFoRDtFQUxLOzs7O0dBdkR5QixFQUFFLENBQUM7O0FBOER6QyxFQUFFLENBQUMsdUJBQUgsR0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9QYW5lbEJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfUGFuZWxCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEEgcGFuZWwtY29tcG9uZW50IGdpdmVzIGEgZ2FtZS1vYmplY3QgdGhlIHNhbWUgY2FwYWJpbGl0aWVzIGxpa2VcbiAgICAqIGEgdmlzdWFsIG9iamVjdCBidXQgaGFzIG5vIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbi4gU28gYSBwYW5lbCBoYXNcbiAgICAqIGEgcG9zaXRpb24gYW5kIGEgc2l6ZS48YnI+XG4gICAgKiA8YnI+XG4gICAgKiBJdCBjYW4gYmUgdXNlZCB0byBtYWtlIGludmlzaWJsZSBob3RzcG90LWFyZWFzIG9yIG1vZGFsLWJsb2NraW5nIGFyZWFzIGZvclxuICAgICogZXhhbXBsZS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1BhbmVsQmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXJzIGZvciBtb3VzZS90b3VjaCBldmVudHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIGlmIEBvYmplY3QubW9kYWxcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIm1vdXNlVXBcIiwgKChlKSA9PiBpZiBAb2JqZWN0Lm1vZGFsIHRoZW4gZS5icmVha0NoYWluID0geWVzKSwgbnVsbCwgQG9iamVjdFxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwibW91c2VEb3duXCIsICgoZSkgPT4gaWYgQG9iamVjdC5tb2RhbCB0aGVuIGUuYnJlYWtDaGFpbiA9IHllcyksIG51bGwsIEBvYmplY3RcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIm1vdXNlTW92ZWRcIiwgKChlKSA9PiBcbiAgICAgICAgICAgICAgICBpZiBAb2JqZWN0Lm1vZGFsIHRoZW4gZS5icmVha0NoYWluID0geWVzXG4gICAgICAgICAgICApLCBudWxsLCBAb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgcGFuZWwgY29tcG9uZW50LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBjb21wb25lbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwibW91c2VVcFwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlRG93blwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlTW92ZWRcIiwgQG9iamVjdClcbiAgICAgICAgXG5ncy5Db21wb25lbnRfUGFuZWxCZWhhdmlvciA9IENvbXBvbmVudF9QYW5lbEJlaGF2aW9yIl19
//# sourceURL=Component_PanelBehavior_151.js