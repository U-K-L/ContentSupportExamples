var Component_ThreePartImage,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ThreePartImage = (function(superClass) {
  extend(Component_ThreePartImage, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_ThreePartImage.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A three-part image component displays an object on screen using three
  * sub-images: start, middle and end. The start and end will be rendered
  * with fixed size while the middle-part will be stretched in a way like this:<br>
  * <br>
  * |Start-Part Fixed|<-----------Middle-Part Stretched----------->|End-Part Fixed<br>
  * <br>
  * A three-part image is automatically added to the graphics-system
  * and rendered every frame until it gets disposed. It can be horizontal or
  * vertical.
  *
  * @module gs
  * @class Component_ThreePartImage
  * @extends gs.Component_Visual
  * @memberof gs
  * @constructor
   */

  function Component_ThreePartImage(viewport) {
    Component_ThreePartImage.__super__.constructor.call(this);

    /**
    * The native three-part image graphic object.
    * @property threePartImage
    * @type gs.ThreePartImage
     */
    this.threePartImage = new gs.ThreePartImage(viewport != null ? viewport : Graphics.viewport);

    /**
    * The name of the image used to construct the three-part image.
    * @property image
    * @type string
    * @protected
     */
    this.image = null;
  }


  /**
  * Disposes the three-part image.
  * 
  * @method dispose
   */

  Component_ThreePartImage.prototype.dispose = function() {
    Component_ThreePartImage.__super__.dispose.apply(this, arguments);
    return this.threePartImage.dispose();
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_ThreePartImage.prototype.setupEventHandlers = function() {
    return this.threePartImage.onIndexChange = (function(_this) {
      return function() {
        return _this.object.rIndex = _this.threePartImage.index;
      };
    })(this);
  };


  /**
  * Setup the three-part image component. This method is automatically called by the
  * system.
  * @method setup
   */

  Component_ThreePartImage.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Updates the three-part image properties from the game object properties.
  *
  * @method updateProperties
   */

  Component_ThreePartImage.prototype.updateProperties = function() {
    this.threePartImage.x = this.object.dstRect.x - this.object.dstRect.width * (this.object.zoom.x - 1.0) * this.object.anchor.x;
    this.threePartImage.y = this.object.dstRect.y - this.object.dstRect.height * (this.object.zoom.y - 1.0) * this.object.anchor.y;
    this.threePartImage.width = this.object.dstRect.width;
    this.threePartImage.height = this.object.dstRect.height;
    this.threePartImage.firstPartSize = this.object.firstPartSize || 16;
    this.threePartImage.middlePartSize = this.object.middlePartSize || 1;
    this.threePartImage.lastPartSize = this.object.lastPartSize || 16;
    this.threePartImage.visible = this.object.visible;
    this.threePartImage.ox = -this.object.origin.x;
    this.threePartImage.oy = -this.object.origin.y;
    this.threePartImage.z = (this.object.zIndex || 0) + (!this.object.parent ? 0 : this.object.parent.zIndex || 0);
    this.threePartImage.angle = this.object.angle || 0;
    this.threePartImage.anchor.x = this.object.anchor.x;
    return this.threePartImage.anchor.y = this.object.anchor.y;
  };


  /**
  * Updates the padding.
  * 
  * @method updatePadding
   */

  Component_ThreePartImage.prototype.updatePadding = function() {
    if (this.object.padding != null) {
      this.threePartImage.x += this.object.padding.left;
      this.threePartImage.y += this.object.padding.top;
      this.threePartImage.width -= this.object.padding.left + this.object.padding.right;
      return this.threePartImage.height -= this.object.padding.top + this.object.padding.bottom;
    }
  };


  /**
  * Updates the skin-image used to construct the three-part image.
  *
  * @method updateImage
   */

  Component_ThreePartImage.prototype.updateImage = function() {
    var bitmap;
    if ((this.object.image != null) && this.image !== this.object.image) {
      this.image = this.object.image;
      bitmap = ResourceManager.getBitmap((this.object.imageFolder || "Graphics/Pictures") + "/" + this.object.image);
      return this.threePartImage.skin = bitmap;
    }
  };


  /**
  * Updates the three-part image.
  * 
  * @method update
   */

  Component_ThreePartImage.prototype.update = function() {
    Component_ThreePartImage.__super__.update.apply(this, arguments);
    this.object.rIndex = this.threePartImage.index;
    this.updateProperties();
    this.updatePadding();
    return this.updateImage();
  };

  return Component_ThreePartImage;

})(gs.Component_Visual);

gs.Component_ThreePartImage = Component_ThreePartImage;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsd0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O3FDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUJhLGtDQUFDLFFBQUQ7SUFDVCx3REFBQTs7QUFFQTs7Ozs7SUFLQSxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLEVBQUUsQ0FBQyxjQUFILG9CQUFrQixXQUFXLFFBQVEsQ0FBQyxRQUF0Qzs7QUFFdEI7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7RUFoQkE7OztBQWtCYjs7Ozs7O3FDQUtBLE9BQUEsR0FBUyxTQUFBO0lBQ0wsdURBQUEsU0FBQTtXQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQTtFQUZLOzs7QUFJVDs7Ozs7O3FDQUtBLGtCQUFBLEdBQW9CLFNBQUE7V0FDaEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxhQUFoQixHQUFnQyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFDNUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLEtBQUMsQ0FBQSxjQUFjLENBQUM7TUFETDtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEaEI7OztBQUlwQjs7Ozs7O3FDQUtBLEtBQUEsR0FBTyxTQUFBO1dBQ0gsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFERzs7O0FBR1A7Ozs7OztxQ0FLQSxnQkFBQSxHQUFrQixTQUFBO0lBQ2QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxDQUFoQixHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFoQixHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFoQixHQUF3QixDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMs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QUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDO01BQ2pCLE1BQUEsR0FBUyxlQUFlLENBQUMsU0FBaEIsQ0FBNEIsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsSUFBcUIsbUJBQXRCLENBQUEsR0FBMEMsR0FBMUMsR0FBNkMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFqRjthQUNULElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsR0FBdUIsT0FIM0I7O0VBRFM7OztBQU1iOzs7Ozs7cUNBS0EsTUFBQSxHQUFRLFNBQUE7SUFDSixzREFBQSxTQUFBO0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQUMsQ0FBQSxjQUFjLENBQUM7SUFDakMsSUFBQyxDQUFBLGdCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtFQU5JOzs7O0dBMUgyQixFQUFFLENBQUM7O0FBa0kxQyxFQUFFLENBQUMsd0JBQUgsR0FBOEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9UaHJlZVBhcnRJbWFnZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X1RocmVlUGFydEltYWdlIGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Zpc3VhbFxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICogXG4gICAgKiBAbWV0aG9kIG9uRGF0YUJ1bmRsZVJlc3RvcmUuXG4gICAgKiBAcGFyYW0gT2JqZWN0IGRhdGEgLSBUaGUgZGF0YS1idW5kbGVcbiAgICAqIEBwYXJhbSBncy5PYmplY3RDb2RlY0NvbnRleHQgY29udGV4dCAtIFRoZSBjb2RlYy1jb250ZXh0LlxuICAgICMjI1xuICAgIG9uRGF0YUJ1bmRsZVJlc3RvcmU6IChkYXRhLCBjb250ZXh0KSAtPlxuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQSB0aHJlZS1wYXJ0IGltYWdlIGNvbXBvbmVudCBkaXNwbGF5cyBhbiBvYmplY3Qgb24gc2NyZWVuIHVzaW5nIHRocmVlXG4gICAgKiBzdWItaW1hZ2VzOiBzdGFydCwgbWlkZGxlIGFuZCBlbmQuIFRoZSBzdGFydCBhbmQgZW5kIHdpbGwgYmUgcmVuZGVyZWRcbiAgICAqIHdpdGggZml4ZWQgc2l6ZSB3aGlsZSB0aGUgbWlkZGxlLXBhcnQgd2lsbCBiZSBzdHJldGNoZWQgaW4gYSB3YXkgbGlrZSB0aGlzOjxicj5cbiAgICAqIDxicj5cbiAgICAqIHxTdGFydC1QYXJ0IEZpeGVkfDwtLS0tLS0tLS0tLU1pZGRsZS1QYXJ0IFN0cmV0Y2hlZC0tLS0tLS0tLS0tPnxFbmQtUGFydCBGaXhlZDxicj5cbiAgICAqIDxicj5cbiAgICAqIEEgdGhyZWUtcGFydCBpbWFnZSBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBncmFwaGljcy1zeXN0ZW1cbiAgICAqIGFuZCByZW5kZXJlZCBldmVyeSBmcmFtZSB1bnRpbCBpdCBnZXRzIGRpc3Bvc2VkLiBJdCBjYW4gYmUgaG9yaXpvbnRhbCBvclxuICAgICogdmVydGljYWwuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9UaHJlZVBhcnRJbWFnZVxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Zpc3VhbFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKHZpZXdwb3J0KSAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG5hdGl2ZSB0aHJlZS1wYXJ0IGltYWdlIGdyYXBoaWMgb2JqZWN0LlxuICAgICAgICAqIEBwcm9wZXJ0eSB0aHJlZVBhcnRJbWFnZVxuICAgICAgICAqIEB0eXBlIGdzLlRocmVlUGFydEltYWdlXG4gICAgICAgICMjI1xuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2UgPSBuZXcgZ3MuVGhyZWVQYXJ0SW1hZ2Uodmlld3BvcnQgPyBHcmFwaGljcy52aWV3cG9ydClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgaW1hZ2UgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIHRocmVlLXBhcnQgaW1hZ2UuXG4gICAgICAgICogQHByb3BlcnR5IGltYWdlXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGltYWdlID0gbnVsbFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyB0aGUgdGhyZWUtcGFydCBpbWFnZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjICAgICAgIFxuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS5kaXNwb3NlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVycyBmb3IgbW91c2UvdG91Y2ggZXZlbnRzXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyMgXG4gICAgc2V0dXBFdmVudEhhbmRsZXJzOiAtPlxuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2Uub25JbmRleENoYW5nZSA9ID0+XG4gICAgICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEB0aHJlZVBhcnRJbWFnZS5pbmRleFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0dXAgdGhlIHRocmVlLXBhcnQgaW1hZ2UgY29tcG9uZW50LiBUaGlzIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGVcbiAgICAqIHN5c3RlbS5cbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHRocmVlLXBhcnQgaW1hZ2UgcHJvcGVydGllcyBmcm9tIHRoZSBnYW1lIG9iamVjdCBwcm9wZXJ0aWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUHJvcGVydGllc1xuICAgICMjIyAgIFxuICAgIHVwZGF0ZVByb3BlcnRpZXM6IC0+XG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS54ID0gQG9iamVjdC5kc3RSZWN0LnggLSBAb2JqZWN0LmRzdFJlY3Qud2lkdGggKiAoQG9iamVjdC56b29tLnggLSAxLjApICogQG9iamVjdC5hbmNob3IueFxuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2UueSA9IEBvYmplY3QuZHN0UmVjdC55IC0gQG9iamVjdC5kc3RSZWN0LmhlaWdodCAqIChAb2JqZWN0Lnpvb20ueSAtIDEuMCkgKiBAb2JqZWN0LmFuY2hvci55XG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS53aWR0aCA9IEBvYmplY3QuZHN0UmVjdC53aWR0aFxuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2UuaGVpZ2h0ID0gQG9iamVjdC5kc3RSZWN0LmhlaWdodFxuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2UuZmlyc3RQYXJ0U2l6ZSA9IEBvYmplY3QuZmlyc3RQYXJ0U2l6ZSB8fCAxNlxuICAgICAgICBAdGhyZWVQYXJ0SW1hZ2UubWlkZGxlUGFydFNpemUgPSBAb2JqZWN0Lm1pZGRsZVBhcnRTaXplIHx8IDFcbiAgICAgICAgQHRocmVlUGFydEltYWdlLmxhc3RQYXJ0U2l6ZSA9IEBvYmplY3QubGFzdFBhcnRTaXplIHx8IDE2XG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS52aXNpYmxlID0gQG9iamVjdC52aXNpYmxlXG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS5veCA9IC1Ab2JqZWN0Lm9yaWdpbi54XG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS5veSA9IC1Ab2JqZWN0Lm9yaWdpbi55XG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS56ID0gKEBvYmplY3QuekluZGV4IHx8IDApICsgKGlmICFAb2JqZWN0LnBhcmVudCB0aGVuIDAgZWxzZSBAb2JqZWN0LnBhcmVudC56SW5kZXggfHwgMClcbiAgICAgICAgQHRocmVlUGFydEltYWdlLmFuZ2xlID0gQG9iamVjdC5hbmdsZSB8fCAwXG4gICAgICAgIEB0aHJlZVBhcnRJbWFnZS5hbmNob3IueCA9IEBvYmplY3QuYW5jaG9yLnhcbiAgICAgICAgQHRocmVlUGFydEltYWdlLmFuY2hvci55ID0gQG9iamVjdC5hbmNob3IueVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBwYWRkaW5nLlxuICAgICogXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVBhZGRpbmdcbiAgICAjIyMgXG4gICAgdXBkYXRlUGFkZGluZzogLT5cbiAgICAgICAgaWYgQG9iamVjdC5wYWRkaW5nP1xuICAgICAgICAgICAgQHRocmVlUGFydEltYWdlLnggKz0gQG9iamVjdC5wYWRkaW5nLmxlZnRcbiAgICAgICAgICAgIEB0aHJlZVBhcnRJbWFnZS55ICs9IEBvYmplY3QucGFkZGluZy50b3BcbiAgICAgICAgICAgIEB0aHJlZVBhcnRJbWFnZS53aWR0aCAtPSBAb2JqZWN0LnBhZGRpbmcubGVmdCtAb2JqZWN0LnBhZGRpbmcucmlnaHRcbiAgICAgICAgICAgIEB0aHJlZVBhcnRJbWFnZS5oZWlnaHQgLT0gQG9iamVjdC5wYWRkaW5nLnRvcCtAb2JqZWN0LnBhZGRpbmcuYm90dG9tXG4gICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHNraW4taW1hZ2UgdXNlZCB0byBjb25zdHJ1Y3QgdGhlIHRocmVlLXBhcnQgaW1hZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVJbWFnZVxuICAgICMjIyAgICAgICBcbiAgICB1cGRhdGVJbWFnZTogLT5cbiAgICAgICAgaWYgQG9iamVjdC5pbWFnZT8gYW5kIEBpbWFnZSAhPSBAb2JqZWN0LmltYWdlXG4gICAgICAgICAgICBAaW1hZ2UgPSBAb2JqZWN0LmltYWdlXG4gICAgICAgICAgICBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiI3tAb2JqZWN0LmltYWdlRm9sZGVyfHxcIkdyYXBoaWNzL1BpY3R1cmVzXCJ9LyN7QG9iamVjdC5pbWFnZX1cIilcbiAgICAgICAgICAgIEB0aHJlZVBhcnRJbWFnZS5za2luID0gYml0bWFwXG4gICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgdGhyZWUtcGFydCBpbWFnZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5ySW5kZXggPSBAdGhyZWVQYXJ0SW1hZ2UuaW5kZXhcbiAgICAgICAgQHVwZGF0ZVByb3BlcnRpZXMoKVxuICAgICAgICBAdXBkYXRlUGFkZGluZygpXG4gICAgICAgIEB1cGRhdGVJbWFnZSgpXG4gICAgICAgIFxuZ3MuQ29tcG9uZW50X1RocmVlUGFydEltYWdlID0gQ29tcG9uZW50X1RocmVlUGFydEltYWdlIl19
//# sourceURL=Component_ThreePartImage_156.js