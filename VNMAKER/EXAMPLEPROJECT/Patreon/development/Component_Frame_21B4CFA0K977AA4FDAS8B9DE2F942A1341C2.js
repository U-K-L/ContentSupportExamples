var Component_Frame,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Frame = (function(superClass) {
  extend(Component_Frame, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Frame.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A frame constructs a graphical frame from its skin-image. The frame can
  * rendered by tiling or strechting the four sides of the frame. A frame
  * is useful for creating In-Game UI windows and boxes. For more info about 
  * the skin-image format, see help-file.
  * 
  * @module gs
  * @class Component_Frame
  * @extends gs.Component_Visual
  * @memberof gs
  * @constructor
  * @param {gs.Viewport} viewport An optional native viewport object.
   */

  function Component_Frame(viewport) {
    Component_Frame.__super__.constructor.call(this);

    /**
    * The native frame-object.
    * @property frame
    * @type gs.Frame
     */
    this.frame = new gs.Frame(viewport != null ? viewport : Graphics.viewport);

    /**
    * The name of the skin-image used to construct the frame.
    * @property image
    * @type string
    * @protected
     */
    this.image = null;
  }


  /**
  * Disposes the frame.
  * 
  * @method dispose
   */

  Component_Frame.prototype.dispose = function() {
    Component_Frame.__super__.dispose.apply(this, arguments);
    return this.frame.dispose();
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_Frame.prototype.setupEventHandlers = function() {
    return this.frame.onIndexChange = (function(_this) {
      return function() {
        return _this.object.rIndex = _this.frame.index;
      };
    })(this);
  };


  /**
  * Setup the frame component. This method is automatically called by the
  * system.
  * @method setup
   */

  Component_Frame.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Updates the padding.
  * 
  * @method updatePadding
   */

  Component_Frame.prototype.updatePadding = function() {
    if (this.object.padding != null) {
      this.frame.x += this.object.padding.left;
      this.frame.y += this.object.padding.top;
      this.frame.width -= this.object.padding.left + this.object.padding.right;
      return this.frame.height -= this.object.padding.top + this.object.padding.bottom;
    }
  };


  /**
  * Updates the frame properties from the game object properties.
  *
  * @method updateProperties
   */

  Component_Frame.prototype.updateProperties = function() {
    this.frame.x = this.object.dstRect.x;
    this.frame.y = this.object.dstRect.y;
    this.frame.width = this.object.dstRect.width;
    this.frame.height = this.object.dstRect.height;
    this.frame.thickness = this.object.frameThickness || 16;
    this.frame.cornerSize = this.object.frameCornerSize || 16;
    this.frame.clipRect = this.object.clipRect;
    this.frame.visible = this.object.visible;
    this.frame.ox = -this.object.origin.x;
    this.frame.oy = -this.object.origin.y;
    this.frame.zoomX = this.object.zoom.x;
    this.frame.zoomY = this.object.zoom.y;
    this.frame.angle = this.object.angle || 0;
    this.frame.opacity = this.object.opacity;
    return this.frame.z = (this.object.zIndex || 0) + (!this.object.parent ? 0 : this.object.parent.zIndex || 0);
  };


  /**
  * Updates the optional sprite properties from the game object properties.
  * @method updateOptionalProperties
   */

  Component_Frame.prototype.updateOptionalProperties = function() {
    if (this.object.tone != null) {
      this.frame.tone = this.object.tone;
    }
    if (this.object.color != null) {
      this.frame.color = this.object.color;
    }
    if (this.object.viewport != null) {
      this.frame.viewport = this.object.viewport;
    }
    if (this.object.effects != null) {
      this.frame.wobble = this.object.effects.wobble;
    }
    if (this.object.anchor != null) {
      this.frame.anchor.x = this.object.anchor.x;
      return this.frame.anchor.y = this.object.anchor.y;
    }
  };


  /**
  * Updates the frame's skin-image used to construct the frame.
  *
  * @method updateImage
   */

  Component_Frame.prototype.updateImage = function() {
    var bitmap;
    if ((this.object.image != null) && this.image !== this.object.image) {
      this.image = this.object.image;
      bitmap = ResourceManager.getBitmap((this.object.imageFolder || "Graphics/Pictures") + "/" + this.object.image);
      return this.frame.skin = bitmap;
    }
  };


  /**
  * Updates the frame's padding, properties and skin-image.
  * 
  * @method update
   */

  Component_Frame.prototype.update = function() {
    Component_Frame.__super__.update.apply(this, arguments);
    this.object.rIndex = this.frame.index;
    this.updateProperties();
    this.updateOptionalProperties();
    this.updatePadding();
    return this.updateImage();
  };

  return Component_Frame;

})(gs.Component_Visual);

gs.Component_Frame = Component_Frame;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7NEJBUUEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUDtXQUNqQixJQUFDLENBQUEsa0JBQUQsQ0FBQTtFQURpQjs7O0FBR3JCOzs7Ozs7Ozs7Ozs7OztFQWFhLHlCQUFDLFFBQUQ7SUFDVCwrQ0FBQTs7QUFFQTs7Ozs7SUFLQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsRUFBRSxDQUFDLEtBQUgsb0JBQVMsV0FBVyxRQUFRLENBQUMsUUFBN0I7O0FBRWI7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7RUFoQkE7OztBQW1CYjs7Ozs7OzRCQUtBLE9BQUEsR0FBUyxTQUFBO0lBQ0wsOENBQUEsU0FBQTtXQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBO0VBRks7OztBQUlUOzs7Ozs7NEJBS0Esa0JBQUEsR0FBb0IsU0FBQTtXQUNoQixJQUFDLENBQUEsS0FBSyxDQUFDLGFBQVAsR0FBdUIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO2VBQ25CLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixLQUFDLENBQUEsS0FBSyxDQUFDO01BREw7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0VBRFA7OztBQUlwQjs7Ozs7OzRCQUtBLEtBQUEsR0FBTyxTQUFBO1dBQ0gsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFERzs7O0FBR1A7Ozs7Ozs0QkFLQSxhQUFBLEdBQWUsU0FBQTtJQUNYLElBQUcsMkJBQUg7TUFDSSxJQUFDLENBQUEsS0FBSyxDQUFDLENBQVAsSUFBWSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUM1QixJQUFDLENBQUEsS0FBSyxDQUFDLENBQVAsSUFBWSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUM1QixJQUFDLENB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QyxNQUFNLENBQUM7YUFDakMsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBZCxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUZyQzs7RUFUc0I7OztBQWExQjs7Ozs7OzRCQUtBLFdBQUEsR0FBYSxTQUFBO0FBQ1QsUUFBQTtJQUFBLElBQUcsMkJBQUEsSUFBbUIsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQXhDO01BQ0ksSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDO01BQ2pCLE1BQUEsR0FBUyxlQUFlLENBQUMsU0FBaEIsQ0FBNEIsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsSUFBcUIsbUJBQXRCLENBQUEsR0FBMEMsR0FBMUMsR0FBNkMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFqRjthQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjLE9BSGxCOztFQURTOzs7QUFNYjs7Ozs7OzRCQUtBLE1BQUEsR0FBUSxTQUFBO0lBQ0osNkNBQUEsU0FBQTtJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsS0FBSyxDQUFDO0lBQ3hCLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLHdCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtFQVBJOzs7O0dBeklrQixFQUFFLENBQUM7O0FBdUpqQyxFQUFFLENBQUMsZUFBSCxHQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0ZyYW1lXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfRnJhbWUgZXh0ZW5kcyBncy5Db21wb25lbnRfVmlzdWFsXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoaXMgb2JqZWN0IGluc3RhbmNlIGlzIHJlc3RvcmVkIGZyb20gYSBkYXRhLWJ1bmRsZS4gSXQgY2FuIGJlIHVzZWRcbiAgICAqIHJlLWFzc2lnbiBldmVudC1oYW5kbGVyLCBhbm9ueW1vdXMgZnVuY3Rpb25zLCBldGMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBIGZyYW1lIGNvbnN0cnVjdHMgYSBncmFwaGljYWwgZnJhbWUgZnJvbSBpdHMgc2tpbi1pbWFnZS4gVGhlIGZyYW1lIGNhblxuICAgICogcmVuZGVyZWQgYnkgdGlsaW5nIG9yIHN0cmVjaHRpbmcgdGhlIGZvdXIgc2lkZXMgb2YgdGhlIGZyYW1lLiBBIGZyYW1lXG4gICAgKiBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIEluLUdhbWUgVUkgd2luZG93cyBhbmQgYm94ZXMuIEZvciBtb3JlIGluZm8gYWJvdXQgXG4gICAgKiB0aGUgc2tpbi1pbWFnZSBmb3JtYXQsIHNlZSBoZWxwLWZpbGUuXG4gICAgKiBcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfRnJhbWVcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKiBAcGFyYW0ge2dzLlZpZXdwb3J0fSB2aWV3cG9ydCBBbiBvcHRpb25hbCBuYXRpdmUgdmlld3BvcnQgb2JqZWN0LlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAodmlld3BvcnQpIC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmF0aXZlIGZyYW1lLW9iamVjdC5cbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVcbiAgICAgICAgKiBAdHlwZSBncy5GcmFtZVxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lID0gbmV3IGdzLkZyYW1lKHZpZXdwb3J0ID8gR3JhcGhpY3Mudmlld3BvcnQpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHNraW4taW1hZ2UgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIGZyYW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZVxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBmcmFtZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjICAgIFxuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIEBmcmFtZS5kaXNwb3NlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVycyBmb3IgbW91c2UvdG91Y2ggZXZlbnRzXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyMgXG4gICAgc2V0dXBFdmVudEhhbmRsZXJzOiAtPlxuICAgICAgICBAZnJhbWUub25JbmRleENoYW5nZSA9ID0+XG4gICAgICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEBmcmFtZS5pbmRleFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0dXAgdGhlIGZyYW1lIGNvbXBvbmVudC4gVGhpcyBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlXG4gICAgKiBzeXN0ZW0uXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHBhZGRpbmcuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgdXBkYXRlUGFkZGluZ1xuICAgICMjIyAgXG4gICAgdXBkYXRlUGFkZGluZzogLT5cbiAgICAgICAgaWYgQG9iamVjdC5wYWRkaW5nP1xuICAgICAgICAgICAgQGZyYW1lLnggKz0gQG9iamVjdC5wYWRkaW5nLmxlZnRcbiAgICAgICAgICAgIEBmcmFtZS55ICs9IEBvYmplY3QucGFkZGluZy50b3BcbiAgICAgICAgICAgIEBmcmFtZS53aWR0aCAtPSAoQG9iamVjdC5wYWRkaW5nLmxlZnQrQG9iamVjdC5wYWRkaW5nLnJpZ2h0KSMgLyBAb2JqZWN0Lnpvb20ueFxuICAgICAgICAgICAgQGZyYW1lLmhlaWdodCAtPSAoQG9iamVjdC5wYWRkaW5nLnRvcCtAb2JqZWN0LnBhZGRpbmcuYm90dG9tKSMgLyBAb2JqZWN0Lnpvb20ueVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGZyYW1lIHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAjIyNcbiAgICB1cGRhdGVQcm9wZXJ0aWVzOiAtPlxuICAgICAgICBAZnJhbWUueCA9IEBvYmplY3QuZHN0UmVjdC54ICMtIEBvYmplY3QuZHN0UmVjdC53aWR0aCAqIChAb2JqZWN0Lnpvb20ueCAtIDEuMCkgKiBAb2JqZWN0LmFuY2hvci54XG4gICAgICAgIEBmcmFtZS55ID0gQG9iamVjdC5kc3RSZWN0LnkgIy0gQG9iamVjdC5kc3RSZWN0LmhlaWdodCAqIChAb2JqZWN0Lnpvb20ueSAtIDEuMCkgKiBAb2JqZWN0LmFuY2hvci55XG4gICAgICAgIEBmcmFtZS53aWR0aCA9IEBvYmplY3QuZHN0UmVjdC53aWR0aFxuICAgICAgICBAZnJhbWUuaGVpZ2h0ID0gQG9iamVjdC5kc3RSZWN0LmhlaWdodFxuICAgICAgICBAZnJhbWUudGhpY2tuZXNzID0gQG9iamVjdC5mcmFtZVRoaWNrbmVzcyB8fCAxNlxuICAgICAgICBAZnJhbWUuY29ybmVyU2l6ZSA9IEBvYmplY3QuZnJhbWVDb3JuZXJTaXplIHx8IDE2XG4gICAgICAgIEBmcmFtZS5jbGlwUmVjdCA9IEBvYmplY3QuY2xpcFJlY3RcbiAgICAgICAgQGZyYW1lLnZpc2libGUgPSBAb2JqZWN0LnZpc2libGVcbiAgICAgICAgQGZyYW1lLm94ID0gLUBvYmplY3Qub3JpZ2luLnhcbiAgICAgICAgQGZyYW1lLm95ID0gLUBvYmplY3Qub3JpZ2luLnlcbiAgICAgICAgQGZyYW1lLnpvb21YID0gQG9iamVjdC56b29tLnhcbiAgICAgICAgQGZyYW1lLnpvb21ZID0gQG9iamVjdC56b29tLnlcbiAgICAgICAgQGZyYW1lLmFuZ2xlID0gQG9iamVjdC5hbmdsZSB8fCAwXG4gICAgICAgIEBmcmFtZS5vcGFjaXR5ID0gQG9iamVjdC5vcGFjaXR5XG4gICAgICAgIEBmcmFtZS56ID0gKEBvYmplY3QuekluZGV4IHx8IDApICsgKGlmICFAb2JqZWN0LnBhcmVudCB0aGVuIDAgZWxzZSBAb2JqZWN0LnBhcmVudC56SW5kZXggfHwgMClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBvcHRpb25hbCBzcHJpdGUgcHJvcGVydGllcyBmcm9tIHRoZSBnYW1lIG9iamVjdCBwcm9wZXJ0aWVzLlxuICAgICogQG1ldGhvZCB1cGRhdGVPcHRpb25hbFByb3BlcnRpZXNcbiAgICAjIyNcbiAgICB1cGRhdGVPcHRpb25hbFByb3BlcnRpZXM6IC0+XG4gICAgICAgIGlmIEBvYmplY3QudG9uZT9cbiAgICAgICAgICAgIEBmcmFtZS50b25lID0gQG9iamVjdC50b25lXG4gICAgICAgIGlmIEBvYmplY3QuY29sb3I/XG4gICAgICAgICAgICBAZnJhbWUuY29sb3IgPSBAb2JqZWN0LmNvbG9yXG4gICAgICAgIGlmIEBvYmplY3Qudmlld3BvcnQ/XG4gICAgICAgICAgICBAZnJhbWUudmlld3BvcnQgPSBAb2JqZWN0LnZpZXdwb3J0XG4gICAgICAgIGlmIEBvYmplY3QuZWZmZWN0cz9cbiAgICAgICAgICAgIEBmcmFtZS53b2JibGUgPSBAb2JqZWN0LmVmZmVjdHMud29iYmxlXG4gICAgICAgIGlmIEBvYmplY3QuYW5jaG9yP1xuICAgICAgICAgICAgQGZyYW1lLmFuY2hvci54ID0gQG9iamVjdC5hbmNob3IueFxuICAgICAgICAgICAgQGZyYW1lLmFuY2hvci55ID0gQG9iamVjdC5hbmNob3IueVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgZnJhbWUncyBza2luLWltYWdlIHVzZWQgdG8gY29uc3RydWN0IHRoZSBmcmFtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUltYWdlXG4gICAgIyMjXG4gICAgdXBkYXRlSW1hZ2U6IC0+XG4gICAgICAgIGlmIEBvYmplY3QuaW1hZ2U/IGFuZCBAaW1hZ2UgIT0gQG9iamVjdC5pbWFnZVxuICAgICAgICAgICAgQGltYWdlID0gQG9iamVjdC5pbWFnZVxuICAgICAgICAgICAgYml0bWFwID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIiN7QG9iamVjdC5pbWFnZUZvbGRlcnx8XCJHcmFwaGljcy9QaWN0dXJlc1wifS8je0BvYmplY3QuaW1hZ2V9XCIpXG4gICAgICAgICAgICBAZnJhbWUuc2tpbiA9IGJpdG1hcFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBmcmFtZSdzIHBhZGRpbmcsIHByb3BlcnRpZXMgYW5kIHNraW4taW1hZ2UuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuXG4gICAgICAgIEBvYmplY3QuckluZGV4ID0gQGZyYW1lLmluZGV4XG4gICAgICAgIEB1cGRhdGVQcm9wZXJ0aWVzKClcbiAgICAgICAgQHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllcygpXG4gICAgICAgIEB1cGRhdGVQYWRkaW5nKClcbiAgICAgICAgQHVwZGF0ZUltYWdlKClcbiAgICAgICAgXG4gICAgICAgIFxuXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG5ncy5Db21wb25lbnRfRnJhbWUgPSBDb21wb25lbnRfRnJhbWUiXX0=
//# sourceURL=Component_Frame_152.js