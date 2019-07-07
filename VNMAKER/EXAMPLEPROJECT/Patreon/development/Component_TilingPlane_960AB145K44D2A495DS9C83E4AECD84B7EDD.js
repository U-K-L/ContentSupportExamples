var Component_TilingPlane,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_TilingPlane = (function(superClass) {
  extend(Component_TilingPlane, superClass);


  /**
  * A tiling plane component tiles the image of the game object endless over the screen. The
  * tiling can be vertical, horizontal or both. The sprite can be managed or
  * unmanaged. A managed sprite is automatically added to the graphics-system
  * and processed every frame until it gets disposed. An unmanaged sprite needs
  * to be added and removed manually.
  *
  * @module gs
  * @class Component_TilingPlane
  * @extends gs.Component_Sprite
  * @memberof gs
  * @constructor
  * @param {boolean} managed - Indicates if the sprite is managed by the graphics system.
   */

  function Component_TilingPlane(managed) {
    this.sprite = null;
    this.tilingPlane = null;
    this.tilingSprite = this.sprite;
    this.image = null;
    this.video = null;
    this.imageFolder = "Graphics/Pictures";
    this.visible = true;
    this.looping = {
      vertical: false,
      horizontal: false
    };
  }


  /**
  * Creates sprite object.
  *
  * @method setupSprite
   */

  Component_TilingPlane.prototype.setupSprite = function() {
    if (!this.sprite) {
      this.sprite = new gs.Sprite(Graphics.viewport, typeof managed !== "undefined" && managed !== null ? managed : true);
      return this.tilingSprite = this.sprite;
    }
  };


  /**
  * Updates the padding.
  *
  * @method updatePadding
   */

  Component_TilingPlane.prototype.updatePadding = function() {
    if (this.object.padding != null) {
      this.sprite.rect.x += this.object.padding.left;
      this.sprite.rect.y += this.object.padding.top;
      this.sprite.rect.width -= this.object.padding.left + this.object.padding.right;
      return this.sprite.rect.height -= this.object.padding.bottom + this.object.padding.bottom;
    }
  };


  /**
  * Updates the source- and destination-rectangle of the game object so that
  * the associated bitmap fits in. 
  *
  * @method updateRect
   */

  Component_TilingPlane.prototype.updateRect = function() {
    if (this.sprite.bitmap != null) {
      this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height);
      this.object.dstRect.width = this.object.srcRect.width;
      return this.object.dstRect.height = this.object.srcRect.height;
    }
  };


  /**
  * Updates the sprite properties from the game object properties.
  *
  * @method updateProperties
   */

  Component_TilingPlane.prototype.updateProperties = function() {
    Component_TilingPlane.__super__.updateProperties.call(this);
    this.sprite.vertical = this.looping.vertical;
    this.sprite.horizontal = this.looping.horizontal;
    this.sprite.x = this.object.dstRect.x;
    return this.sprite.y = this.object.dstRect.y;
  };


  /**
  * Updates the optional sprite properties from the game object properties.
  * @method updateOptionalProperties
   */

  Component_TilingPlane.prototype.updateOptionalProperties = function() {
    Component_TilingPlane.__super__.updateOptionalProperties.call(this);
    this.sprite.zoomX = this.object.zoom.x;
    return this.sprite.zoomY = this.object.zoom.y;
  };


  /**
  * Updates the tiling-plane component by updating its visibility, image, padding and
  * properties. To save performance, a gs.TilingPlane is only used if looping is enabled. Otherwise
  * a regular sprite is used.
  * @method update
   */

  Component_TilingPlane.prototype.update = function() {
    if (this.tilingSprite && (this.looping.vertical || this.looping.horizontal)) {
      this.tilingSprite.dispose();
      this.tilingPlane = new gs.TilingPlane(null, this.tilingSprite.managed);
      this.tilingSprite = null;
      this.sprite = this.tilingPlane;
      this.image = null;
    }
    if (this.tilingPlane && !(this.looping.vertical || this.looping.horizontal)) {
      this.tilingPlane.dispose();
      this.tilingSprite = new gs.Sprite(null, this.tilingPlane.managed);
      this.tilingPlane = null;
      this.sprite = this.tilingSprite;
      this.image = null;
    }
    return Component_TilingPlane.__super__.update.apply(this, arguments);
  };

  return Component_TilingPlane;

})(gs.Component_Sprite);

gs.Component_TilingPlane = Component_TilingPlane;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEscUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0VBY2EsK0JBQUMsT0FBRDtJQUNULElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBO0lBQ2pCLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO01BQUEsUUFBQSxFQUFVLEtBQVY7TUFBYyxVQUFBLEVBQVksS0FBMUI7O0VBUkY7OztBQVViOzs7Ozs7a0NBS0EsV0FBQSxHQUFhLFNBQUE7SUFDVCxJQUFHLENBQUMsSUFBQyxDQUFBLE1BQUw7TUFDSSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFRLENBQUMsUUFBbkIsdURBQTZCLFVBQVUsSUFBdkM7YUFDZCxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsT0FGckI7O0VBRFM7OztBQUtiOzs7Ozs7a0NBS0EsYUFBQSxHQUFlLFNBQUE7SUFDWCxJQUFHLDJCQUFIO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBYixJQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUNsQyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFiLElBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDO01BQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsSUFBc0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBaEIsR0FBcUIsSUFBQyxDQUFBLE1B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PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfVGlsaW5nUGxhbmVcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9UaWxpbmdQbGFuZSBleHRlbmRzIGdzLkNvbXBvbmVudF9TcHJpdGVcbiAgICAjIyMqXG4gICAgKiBBIHRpbGluZyBwbGFuZSBjb21wb25lbnQgdGlsZXMgdGhlIGltYWdlIG9mIHRoZSBnYW1lIG9iamVjdCBlbmRsZXNzIG92ZXIgdGhlIHNjcmVlbi4gVGhlXG4gICAgKiB0aWxpbmcgY2FuIGJlIHZlcnRpY2FsLCBob3Jpem9udGFsIG9yIGJvdGguIFRoZSBzcHJpdGUgY2FuIGJlIG1hbmFnZWQgb3JcbiAgICAqIHVubWFuYWdlZC4gQSBtYW5hZ2VkIHNwcml0ZSBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBncmFwaGljcy1zeXN0ZW1cbiAgICAqIGFuZCBwcm9jZXNzZWQgZXZlcnkgZnJhbWUgdW50aWwgaXQgZ2V0cyBkaXNwb3NlZC4gQW4gdW5tYW5hZ2VkIHNwcml0ZSBuZWVkc1xuICAgICogdG8gYmUgYWRkZWQgYW5kIHJlbW92ZWQgbWFudWFsbHkuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9UaWxpbmdQbGFuZVxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Nwcml0ZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFuYWdlZCAtIEluZGljYXRlcyBpZiB0aGUgc3ByaXRlIGlzIG1hbmFnZWQgYnkgdGhlIGdyYXBoaWNzIHN5c3RlbS5cbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKG1hbmFnZWQpIC0+XG4gICAgICAgIEBzcHJpdGUgPSBudWxsXG4gICAgICAgIEB0aWxpbmdQbGFuZSA9IG51bGxcbiAgICAgICAgQHRpbGluZ1Nwcml0ZSA9IEBzcHJpdGVcbiAgICAgICAgQGltYWdlID0gbnVsbFxuICAgICAgICBAdmlkZW8gPSBudWxsXG4gICAgICAgIEBpbWFnZUZvbGRlciA9IFwiR3JhcGhpY3MvUGljdHVyZXNcIlxuICAgICAgICBAdmlzaWJsZSA9IHllc1xuICAgICAgICBAbG9vcGluZyA9IHZlcnRpY2FsOiBubywgaG9yaXpvbnRhbDogbm9cbiAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIHNwcml0ZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFNwcml0ZVxuICAgICMjI1xuICAgIHNldHVwU3ByaXRlOiAtPlxuICAgICAgICBpZiAhQHNwcml0ZVxuICAgICAgICAgICAgQHNwcml0ZSA9IG5ldyBncy5TcHJpdGUoR3JhcGhpY3Mudmlld3BvcnQsIG1hbmFnZWQgPyB5ZXMpXG4gICAgICAgICAgICBAdGlsaW5nU3ByaXRlID0gQHNwcml0ZVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBwYWRkaW5nLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUGFkZGluZ1xuICAgICMjI1xuICAgIHVwZGF0ZVBhZGRpbmc6IC0+XG4gICAgICAgIGlmIEBvYmplY3QucGFkZGluZz9cbiAgICAgICAgICAgIEBzcHJpdGUucmVjdC54ICs9IEBvYmplY3QucGFkZGluZy5sZWZ0XG4gICAgICAgICAgICBAc3ByaXRlLnJlY3QueSArPSBAb2JqZWN0LnBhZGRpbmcudG9wXG4gICAgICAgICAgICBAc3ByaXRlLnJlY3Qud2lkdGggLT0gQG9iamVjdC5wYWRkaW5nLmxlZnQrQG9iamVjdC5wYWRkaW5nLnJpZ2h0XG4gICAgICAgICAgICBAc3ByaXRlLnJlY3QuaGVpZ2h0IC09IEBvYmplY3QucGFkZGluZy5ib3R0b20rQG9iamVjdC5wYWRkaW5nLmJvdHRvbVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc291cmNlLSBhbmQgZGVzdGluYXRpb24tcmVjdGFuZ2xlIG9mIHRoZSBnYW1lIG9iamVjdCBzbyB0aGF0XG4gICAgKiB0aGUgYXNzb2NpYXRlZCBiaXRtYXAgZml0cyBpbi4gXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVSZWN0XG4gICAgIyMjXG4gICAgdXBkYXRlUmVjdDogLT5cbiAgICAgICAgaWYgQHNwcml0ZS5iaXRtYXA/XG4gICAgICAgICAgICBAb2JqZWN0LnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAc3ByaXRlLmJpdG1hcC53aWR0aCwgQHNwcml0ZS5iaXRtYXAuaGVpZ2h0KVxuICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5zcmNSZWN0LndpZHRoXG4gICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQG9iamVjdC5zcmNSZWN0LmhlaWdodFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3ByaXRlIHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVByb3BlcnRpZXNcbiAgICAjIyNcbiAgICB1cGRhdGVQcm9wZXJ0aWVzOiAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICBAc3ByaXRlLnZlcnRpY2FsID0gQGxvb3BpbmcudmVydGljYWxcbiAgICAgICAgQHNwcml0ZS5ob3Jpem9udGFsID0gQGxvb3BpbmcuaG9yaXpvbnRhbFxuICAgICAgICBAc3ByaXRlLnggPSBAb2JqZWN0LmRzdFJlY3QueFxuICAgICAgICBAc3ByaXRlLnkgPSBAb2JqZWN0LmRzdFJlY3QueVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG9wdGlvbmFsIHNwcml0ZSBwcm9wZXJ0aWVzIGZyb20gdGhlIGdhbWUgb2JqZWN0IHByb3BlcnRpZXMuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllc1xuICAgICMjIyAgICBcbiAgICB1cGRhdGVPcHRpb25hbFByb3BlcnRpZXM6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgIEBzcHJpdGUuem9vbVggPSBAb2JqZWN0Lnpvb20ueFxuICAgICAgICBAc3ByaXRlLnpvb21ZID0gQG9iamVjdC56b29tLnlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgdGlsaW5nLXBsYW5lIGNvbXBvbmVudCBieSB1cGRhdGluZyBpdHMgdmlzaWJpbGl0eSwgaW1hZ2UsIHBhZGRpbmcgYW5kXG4gICAgKiBwcm9wZXJ0aWVzLiBUbyBzYXZlIHBlcmZvcm1hbmNlLCBhIGdzLlRpbGluZ1BsYW5lIGlzIG9ubHkgdXNlZCBpZiBsb29waW5nIGlzIGVuYWJsZWQuIE90aGVyd2lzZVxuICAgICogYSByZWd1bGFyIHNwcml0ZSBpcyB1c2VkLlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBpZiBAdGlsaW5nU3ByaXRlIGFuZCAoQGxvb3BpbmcudmVydGljYWwgb3IgQGxvb3BpbmcuaG9yaXpvbnRhbClcbiAgICAgICAgICAgIEB0aWxpbmdTcHJpdGUuZGlzcG9zZSgpXG4gICAgICAgICAgICBAdGlsaW5nUGxhbmUgPSBuZXcgZ3MuVGlsaW5nUGxhbmUobnVsbCwgQHRpbGluZ1Nwcml0ZS5tYW5hZ2VkKVxuICAgICAgICAgICAgQHRpbGluZ1Nwcml0ZSA9IG51bGxcbiAgICAgICAgICAgIEBzcHJpdGUgPSBAdGlsaW5nUGxhbmVcbiAgICAgICAgICAgIEBpbWFnZSA9IG51bGxcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAdGlsaW5nUGxhbmUgYW5kIG5vdCAoQGxvb3BpbmcudmVydGljYWwgb3IgQGxvb3BpbmcuaG9yaXpvbnRhbClcbiAgICAgICAgICAgIEB0aWxpbmdQbGFuZS5kaXNwb3NlKClcbiAgICAgICAgICAgIEB0aWxpbmdTcHJpdGUgPSBuZXcgZ3MuU3ByaXRlKG51bGwsIEB0aWxpbmdQbGFuZS5tYW5hZ2VkKVxuICAgICAgICAgICAgQHRpbGluZ1BsYW5lID0gbnVsbFxuICAgICAgICAgICAgQHNwcml0ZSA9IEB0aWxpbmdTcHJpdGVcbiAgICAgICAgICAgIEBpbWFnZSA9IG51bGxcbiAgICAgICAgICAgIFxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgXG5ncy5Db21wb25lbnRfVGlsaW5nUGxhbmUgPSBDb21wb25lbnRfVGlsaW5nUGxhbmVcbiJdfQ==
//# sourceURL=Component_TilingPlane_94.js