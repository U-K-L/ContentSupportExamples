var Component_Quad,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Quad = (function(superClass) {
  extend(Component_Quad, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Quad.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A quad component displays rectangle on the screen using the color
  * of the game object.
  *
  * @module gs
  * @class Component_Quad
  * @extends gs.Component
  * @memberof gs
  * @constructor
   */

  function Component_Quad() {
    Component_Quad.__super__.constructor.apply(this, arguments);

    /**
    * The native quad-object to display a colored rectangle on screen.
    * @property quad
    * @type gs.Quad
    * @protected
     */
    this.quad = null;
  }


  /**
  * Disposes the quad.
  * @method dispose
   */

  Component_Quad.prototype.dispose = function() {
    return this.quad.dispose();
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_Quad.prototype.setupEventHandlers = function() {
    return this.quad.onIndexChange = (function(_this) {
      return function() {
        return _this.object.rIndex = _this.quad.index;
      };
    })(this);
  };


  /**
  * Sets up the quad.
  * @method setup
   */

  Component_Quad.prototype.setup = function() {
    this.isSetup = true;
    this.quad = new gs.Quad(Graphics.viewport);
    this.setupEventHandlers();
    return this.update();
  };


  /**
  * Updates the quad and its properties.
  * @method update
   */

  Component_Quad.prototype.update = function() {
    var ref;
    Component_Quad.__super__.update.apply(this, arguments);
    if (!this.isSetup) {
      this.setup();
    }
    this.object.rIndex = this.quad.index;
    this.quad.rect.set(this.object.dstRect.x, this.object.dstRect.y, this.object.dstRect.width, this.object.dstRect.height);
    this.quad.visible = this.object.visible;
    this.quad.ox = -this.object.origin.x;
    this.quad.oy = -this.object.origin.y;
    this.quad.z = (this.object.zIndex || 0) + (!this.object.parent ? 0 : this.object.parent.zIndex || 0);
    this.quad.color = this.object.color || Colors.TRANSPARENT;
    this.quad.opacity = (ref = this.object.opacity) != null ? ref : 255;
    return this.quad.clipRect = this.object.clipRect;
  };

  return Component_Quad;

})(gs.Component_Visual);

gs.Component_Quad = Component_Quad;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsY0FBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7MkJBUUEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUDtXQUNqQixJQUFDLENBQUEsa0JBQUQsQ0FBQTtFQURpQjs7O0FBR3JCOzs7Ozs7Ozs7OztFQVVhLHdCQUFBO0lBQ1QsaURBQUEsU0FBQTs7QUFFQTs7Ozs7O0lBTUEsSUFBQyxDQUFBLElBQUQsR0FBUTtFQVRDOzs7QUFXYjs7Ozs7MkJBSUEsT0FBQSxHQUFTLFNBQUE7V0FBRyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTtFQUFIOzs7QUFFVDs7Ozs7OzJCQUtBLGtCQUFBLEdBQW9CLFNBQUE7V0FDaEIsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUNsQixLQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsS0FBQyxDQUFBLElBQUksQ0FBQztNQURMO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtFQUROOzs7QUFJcEI7Ozs7OzJCQUlBLEtBQUEsR0FBTyxTQUFBO0lBQ0gsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxFQUFFLENBQUMsSUFBSCxDQUFRLFFBQVEsQ0FBQyxRQUFqQjtJQUNaLElBQUMsQ0FBQSxrQkFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtFQUpHOzs7QUFNUDs7Ozs7MkJBSUEsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEsNENBQUEsU0FBQTtJQUVBLElBQVksQ0FBSSxJQUFDLENBQUEsT0FBakI7TUFBQSxJQUFDLENBQUEsS0FBRCxDQUFBLEVBQUE7O0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUM7SUFDdkIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBWCxDQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQS9CLEVBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQWxELEVBQXFELElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQXJFLEVBQTRFLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTVGO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDeEIsSUFBQyxDQUFBLElBQUksQ0FBQyxFQUFOLEdBQVcsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sR0FBVyxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzNCLElBQUMsQ0FBQSxJQUFJLENBQUMsQ0FBTixHQUFVLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLElBQWtCLENBQW5CLENBQUEsR0FBd0IsQ0FBSSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBWixHQUF3QixDQUF4QixHQUErQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFmLElBQXlCLENBQXpEO0lBQ2xDLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixJQUFpQixNQUFNLENBQUM7SUFDdEMsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLCtDQUFrQztXQUNsQyxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQztFQVpyQjs7OztHQTlEaUIsRUFBRSxDQUFDOztBQTRFaEMsRUFBRSxDQUFDLGNBQUgsR0FBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9RdWFkXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfUXVhZCBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEEgcXVhZCBjb21wb25lbnQgZGlzcGxheXMgcmVjdGFuZ2xlIG9uIHRoZSBzY3JlZW4gdXNpbmcgdGhlIGNvbG9yXG4gICAgKiBvZiB0aGUgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9RdWFkXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG5hdGl2ZSBxdWFkLW9iamVjdCB0byBkaXNwbGF5IGEgY29sb3JlZCByZWN0YW5nbGUgb24gc2NyZWVuLlxuICAgICAgICAqIEBwcm9wZXJ0eSBxdWFkXG4gICAgICAgICogQHR5cGUgZ3MuUXVhZFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBxdWFkID0gbnVsbCBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIHF1YWQuXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPiBAcXVhZC5kaXNwb3NlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXJzIGZvciBtb3VzZS90b3VjaCBldmVudHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIEBxdWFkLm9uSW5kZXhDaGFuZ2UgPSA9PlxuICAgICAgICAgICAgQG9iamVjdC5ySW5kZXggPSBAcXVhZC5pbmRleFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB0aGUgcXVhZC5cbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQGlzU2V0dXAgPSB5ZXNcbiAgICAgICAgQHF1YWQgPSBuZXcgZ3MuUXVhZChHcmFwaGljcy52aWV3cG9ydClcbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIEB1cGRhdGUoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHF1YWQgYW5kIGl0cyBwcm9wZXJ0aWVzLlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAc2V0dXAoKSBpZiBub3QgQGlzU2V0dXBcbiAgICAgICAgQG9iamVjdC5ySW5kZXggPSBAcXVhZC5pbmRleFxuICAgICAgICBAcXVhZC5yZWN0LnNldChAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIEBvYmplY3QuZHN0UmVjdC53aWR0aCwgQG9iamVjdC5kc3RSZWN0LmhlaWdodClcbiAgICAgICAgQHF1YWQudmlzaWJsZSA9IEBvYmplY3QudmlzaWJsZVxuICAgICAgICBAcXVhZC5veCA9IC1Ab2JqZWN0Lm9yaWdpbi54XG4gICAgICAgIEBxdWFkLm95ID0gLUBvYmplY3Qub3JpZ2luLnlcbiAgICAgICAgQHF1YWQueiA9IChAb2JqZWN0LnpJbmRleCB8fCAwKSArIChpZiAhQG9iamVjdC5wYXJlbnQgdGhlbiAwIGVsc2UgQG9iamVjdC5wYXJlbnQuekluZGV4IHx8IDApXG4gICAgICAgIEBxdWFkLmNvbG9yID0gQG9iamVjdC5jb2xvciB8fCBDb2xvcnMuVFJBTlNQQVJFTlRcbiAgICAgICAgQHF1YWQub3BhY2l0eSA9IEBvYmplY3Qub3BhY2l0eSA/IDI1NVxuICAgICAgICBAcXVhZC5jbGlwUmVjdCA9IEBvYmplY3QuY2xpcFJlY3RcblxuZ3MuQ29tcG9uZW50X1F1YWQgPSBDb21wb25lbnRfUXVhZCJdfQ==
//# sourceURL=Component_Quad_72.js