var Component_TilingSprite,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_TilingSprite = (function(superClass) {
  extend(Component_TilingSprite, superClass);


  /**
  * A tiling sprite component tiles the image of the game object on screen. The
  * tiling can be vertical, horizontal or both. The sprite can be managed or
  * unmanaged. A managed sprite is automatically added to the graphics-system
  * and processed every frame until it gets disposed. An unmanaged sprite needs
  * to be added and removed manually.
  *
  * @module gs
  * @class Component_TilingSprite
  * @extends gs.Component_Sprite
  * @memberof gs
  * @constructor
  * @param {boolean} managed - Indicates if the sprite is managed by the graphics system.
   */

  function Component_TilingSprite(managed) {
    this.sprite = null;
    this.image = null;
    this.video = null;
    this.imageFolder = "Graphics/Pictures";
    this.visible = true;
    this.looping = {
      vertical: true,
      horizontal: true
    };
    this.scroll = {
      x: 0,
      y: 0
    };
  }


  /**
  * Creates sprite object.
  *
  * @method setupSprite
   */

  Component_TilingSprite.prototype.setupSprite = function() {
    if (!this.sprite) {
      return this.sprite = new gs.TilingSprite(Graphics.viewport, typeof managed !== "undefined" && managed !== null ? managed : true);
    }
  };


  /**
  * Updates the padding.
  *
  * @method updatePadding
   */

  Component_TilingSprite.prototype.updatePadding = function() {
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

  Component_TilingSprite.prototype.updateRect = function() {
    if (this.sprite.bitmap != null) {
      return this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height);
    }
  };


  /**
  * Updates the sprite properties from the game object properties.
  *
  * @method updateProperties
   */

  Component_TilingSprite.prototype.updateProperties = function() {
    Component_TilingSprite.__super__.updateProperties.call(this);
    this.sprite.zoomX = this.object.zoom.x;
    this.sprite.zoomY = this.object.zoom.y;
    this.sprite.vertical = this.looping.vertical;
    this.sprite.horizontal = this.looping.horizontal;
    this.sprite.x = this.scroll.x;
    this.sprite.y = this.scroll.y;
    this.sprite.angle = this.object.angle;
    this.sprite.rect.x = this.object.dstRect.x;
    this.sprite.rect.y = this.object.dstRect.y;
    this.sprite.rect.width = this.object.dstRect.width;
    return this.sprite.rect.height = this.object.dstRect.height;
  };


  /**
  * Updates the optional sprite properties from the game object properties.
  * @method updateOptionalProperties
   */

  Component_TilingSprite.prototype.updateOptionalProperties = function() {
    Component_TilingSprite.__super__.updateOptionalProperties.apply(this, arguments);
    if (this.object.zoom != null) {
      this.sprite.zoomX = this.object.zoom.x;
      return this.sprite.zoomY = this.object.zoom.y;
    }
  };

  return Component_TilingSprite;

})(gs.Component_Sprite);

gs.Component_TilingSprite = Component_TilingSprite;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0VBY2EsZ0NBQUMsT0FBRDtJQUNULElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUFBLFFBQUEsRUFBVSxJQUFWO01BQWUsVUFBQSxFQUFZLElBQTNCOztJQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFBQSxDQUFBLEVBQUcsQ0FBSDtNQUFNLENBQUEsRUFBRyxDQUFUOztFQVBEOzs7QUFVYjs7Ozs7O21DQUtBLFdBQUEsR0FBYSxTQUFBO0lBQ1QsSUFBRyxDQUFDLElBQUMsQ0FBQSxNQUFMO2FBQ0ksSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQVEsQ0FBQyxRQUF6Qix1REFBbUMsVUFBVSxJQUE3QyxFQURsQjs7RUFEUzs7O0FBSWI7Ozs7OzttQ0FLQSxhQUFBLEdBQWUsU0FBQTtJQUNYLElBQUcsMkJBQUg7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFiLElBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDO01BQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQWIsSUFBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUM7TUFDbEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBYixJQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFoQixHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUMzRCxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFiLElBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWhCLEdBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BSmxFOztFQURXOzs7QUFPZjs7Ozs7OzttQ0FNQSxVQUFBLEdBQVksU0FBQTtJQUNSLElBQUcsMEJBQUg7YUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsR0FBc0IsSUFBQSxJQUFBLENBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUExQixFQUFpQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFoRCxFQUQxQjs7RUFEUTs7O0FBTVo7Ozs7OzttQ0FLQSxnQkFBQSxHQUFrQixTQUFBO0lBQ2QsMkRBQUE7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDO0lBQzVCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixHQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDO0lBQzlCLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDcEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUNwQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUN4QixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFiLEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQWIsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBYixHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQztXQUNyQyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFiLEdBQXNCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDO0VBYnhCOzs7QUFlbEI7Ozs7O21DQUlBLHdCQUFBLEdBQTBCLFNBQUE7SUFDdEIsc0VBQUEsU0FBQTtJQUVBLElBQUcsd0JBQUg7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBRmpDOztFQUhzQjs7OztHQWxGTyxFQUFFLENBQUM7O0FBMEZ4QyxFQUFFLENBQUMsc0JBQUgsR0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9UaWxpbmdTcHJpdGVcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9UaWxpbmdTcHJpdGUgZXh0ZW5kcyBncy5Db21wb25lbnRfU3ByaXRlXG4gICAgIyMjKlxuICAgICogQSB0aWxpbmcgc3ByaXRlIGNvbXBvbmVudCB0aWxlcyB0aGUgaW1hZ2Ugb2YgdGhlIGdhbWUgb2JqZWN0IG9uIHNjcmVlbi4gVGhlXG4gICAgKiB0aWxpbmcgY2FuIGJlIHZlcnRpY2FsLCBob3Jpem9udGFsIG9yIGJvdGguIFRoZSBzcHJpdGUgY2FuIGJlIG1hbmFnZWQgb3JcbiAgICAqIHVubWFuYWdlZC4gQSBtYW5hZ2VkIHNwcml0ZSBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBncmFwaGljcy1zeXN0ZW1cbiAgICAqIGFuZCBwcm9jZXNzZWQgZXZlcnkgZnJhbWUgdW50aWwgaXQgZ2V0cyBkaXNwb3NlZC4gQW4gdW5tYW5hZ2VkIHNwcml0ZSBuZWVkc1xuICAgICogdG8gYmUgYWRkZWQgYW5kIHJlbW92ZWQgbWFudWFsbHkuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9UaWxpbmdTcHJpdGVcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9TcHJpdGVcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1hbmFnZWQgLSBJbmRpY2F0ZXMgaWYgdGhlIHNwcml0ZSBpcyBtYW5hZ2VkIGJ5IHRoZSBncmFwaGljcyBzeXN0ZW0uXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChtYW5hZ2VkKSAtPlxuICAgICAgICBAc3ByaXRlID0gbnVsbFxuICAgICAgICBAaW1hZ2UgPSBudWxsXG4gICAgICAgIEB2aWRlbyA9IG51bGxcbiAgICAgICAgQGltYWdlRm9sZGVyID0gXCJHcmFwaGljcy9QaWN0dXJlc1wiXG4gICAgICAgIEB2aXNpYmxlID0geWVzXG4gICAgICAgIEBsb29waW5nID0gdmVydGljYWw6IHllcywgaG9yaXpvbnRhbDogeWVzXG4gICAgICAgIEBzY3JvbGwgPSB4OiAwLCB5OiAwXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBzcHJpdGUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBTcHJpdGVcbiAgICAjIyNcbiAgICBzZXR1cFNwcml0ZTogLT5cbiAgICAgICAgaWYgIUBzcHJpdGVcbiAgICAgICAgICAgIEBzcHJpdGUgPSBuZXcgZ3MuVGlsaW5nU3ByaXRlKEdyYXBoaWNzLnZpZXdwb3J0LCBtYW5hZ2VkID8geWVzKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBwYWRkaW5nLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUGFkZGluZ1xuICAgICMjI1xuICAgIHVwZGF0ZVBhZGRpbmc6IC0+XG4gICAgICAgIGlmIEBvYmplY3QucGFkZGluZz9cbiAgICAgICAgICAgIEBzcHJpdGUucmVjdC54ICs9IEBvYmplY3QucGFkZGluZy5sZWZ0XG4gICAgICAgICAgICBAc3ByaXRlLnJlY3QueSArPSBAb2JqZWN0LnBhZGRpbmcudG9wXG4gICAgICAgICAgICBAc3ByaXRlLnJlY3Qud2lkdGggLT0gQG9iamVjdC5wYWRkaW5nLmxlZnQrQG9iamVjdC5wYWRkaW5nLnJpZ2h0XG4gICAgICAgICAgICBAc3ByaXRlLnJlY3QuaGVpZ2h0IC09IEBvYmplY3QucGFkZGluZy5ib3R0b20rQG9iamVjdC5wYWRkaW5nLmJvdHRvbVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc291cmNlLSBhbmQgZGVzdGluYXRpb24tcmVjdGFuZ2xlIG9mIHRoZSBnYW1lIG9iamVjdCBzbyB0aGF0XG4gICAgKiB0aGUgYXNzb2NpYXRlZCBiaXRtYXAgZml0cyBpbi4gXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVSZWN0XG4gICAgIyMjXG4gICAgdXBkYXRlUmVjdDogLT5cbiAgICAgICAgaWYgQHNwcml0ZS5iaXRtYXA/XG4gICAgICAgICAgICBAb2JqZWN0LnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAc3ByaXRlLmJpdG1hcC53aWR0aCwgQHNwcml0ZS5iaXRtYXAuaGVpZ2h0KVxuICAgICAgICAgICMgIEBvYmplY3QuZHN0UmVjdC53aWR0aCA9IEBvYmplY3Quc3JjUmVjdC53aWR0aFxuICAgICAgICAgICMgIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgPSBAb2JqZWN0LnNyY1JlY3QuaGVpZ2h0XG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBzcHJpdGUgcHJvcGVydGllcyBmcm9tIHRoZSBnYW1lIG9iamVjdCBwcm9wZXJ0aWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUHJvcGVydGllc1xuICAgICMjI1xuICAgIHVwZGF0ZVByb3BlcnRpZXM6IC0+XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICBAc3ByaXRlLnpvb21YID0gQG9iamVjdC56b29tLnhcbiAgICAgICAgQHNwcml0ZS56b29tWSA9IEBvYmplY3Quem9vbS55XG4gICAgICAgIEBzcHJpdGUudmVydGljYWwgPSBAbG9vcGluZy52ZXJ0aWNhbFxuICAgICAgICBAc3ByaXRlLmhvcml6b250YWwgPSBAbG9vcGluZy5ob3Jpem9udGFsXG4gICAgICAgIEBzcHJpdGUueCA9IEBzY3JvbGwueFxuICAgICAgICBAc3ByaXRlLnkgPSBAc2Nyb2xsLnlcbiAgICAgICAgQHNwcml0ZS5hbmdsZSA9IEBvYmplY3QuYW5nbGVcbiAgICAgICAgQHNwcml0ZS5yZWN0LnggPSBAb2JqZWN0LmRzdFJlY3QueCAjLSBAb2JqZWN0LmRzdFJlY3Qud2lkdGggKiAoQG9iamVjdC56b29tLnggLSAxLjApICogQG9iamVjdC5hbmNob3IueFxuICAgICAgICBAc3ByaXRlLnJlY3QueSA9IEBvYmplY3QuZHN0UmVjdC55ICMtIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgKiAoQG9iamVjdC56b29tLnkgLSAxLjApICogQG9iamVjdC5hbmNob3IueVxuICAgICAgICBAc3ByaXRlLnJlY3Qud2lkdGggPSBAb2JqZWN0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgQHNwcml0ZS5yZWN0LmhlaWdodCA9IEBvYmplY3QuZHN0UmVjdC5oZWlnaHRcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgb3B0aW9uYWwgc3ByaXRlIHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqIEBtZXRob2QgdXBkYXRlT3B0aW9uYWxQcm9wZXJ0aWVzXG4gICAgIyMjXG4gICAgdXBkYXRlT3B0aW9uYWxQcm9wZXJ0aWVzOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC56b29tP1xuICAgICAgICAgICAgQHNwcml0ZS56b29tWCA9IEBvYmplY3Quem9vbS54XG4gICAgICAgICAgICBAc3ByaXRlLnpvb21ZID0gQG9iamVjdC56b29tLnlcbiAgICAgICAgXG4gICAgICAgIFxuZ3MuQ29tcG9uZW50X1RpbGluZ1Nwcml0ZSA9IENvbXBvbmVudF9UaWxpbmdTcHJpdGVcbiJdfQ==
//# sourceURL=Component_TilingSprite_79.js