var Sprite_Debug,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Sprite_Debug = (function(superClass) {
  extend(Sprite_Debug, superClass);


  /**
  * Sprite to display debug information on screen. <b>HINT:</b> Will be probably removed
  * before release.
  *
  * @module gs
  * @class Sprite_Debug
  * @extends gs.Sprite
  * @memberof gs
  * @static
   */

  function Sprite_Debug(viewport) {
    var size;
    Sprite_Debug.__super__.constructor.call(this, viewport);

    /**
    * @property frameTime
    * @type number|string
    * The time / time-text to display.
     */
    this.frameTime = 0;
    size = Math.round(8 / 240 * Graphics.height);
    this.bitmap = new Bitmap(180 * Graphics.scale, 28 * Graphics.scale);
    this.bitmap.font = new Font("Verdana", size);
    this.bitmap.font.color = Color.WHITE;
    this.srcRect = new Rect(0, 0, this.bitmap.width, this.bitmap.height);
    this.z = 15000;
    this.opacity = 255;
    this.visible = true;
    this.x = 0;
    this.y = 0;
  }

  Sprite_Debug.prototype.redraw = function() {
    this.bitmap.clear();
    return this.bitmap.drawText(0, 0, this.bitmap.width, this.bitmap.height, this.frameTime.toString(), 0, 0);
  };

  return Sprite_Debug;

})(Sprite);

window.Sprite_Debug = Sprite_Debug;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsWUFBQTtFQUFBOzs7QUFBTTs7OztBQUNGOzs7Ozs7Ozs7OztFQVVhLHNCQUFDLFFBQUQ7QUFDVCxRQUFBO0lBQUEsOENBQU0sUUFBTjs7QUFDQTs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhO0lBRWIsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLEdBQUosR0FBVSxRQUFRLENBQUMsTUFBOUI7SUFDUCxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUFPLEdBQUEsR0FBSSxRQUFRLENBQUMsS0FBcEIsRUFBMkIsRUFBQSxHQUFLLFFBQVEsQ0FBQyxLQUF6QztJQUNkLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFtQixJQUFBLElBQUEsQ0FBSyxTQUFMLEVBQWdCLElBQWhCO0lBQ25CLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWIsR0FBcUIsS0FBSyxDQUFDO0lBQzNCLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxJQUFBLENBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQW5CLEVBQTBCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBbEM7SUFFZixJQUFDLENBQUEsQ0FBRCxHQUFLO0lBQ0wsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsQ0FBRCxHQUFLO0lBQ0wsSUFBQyxDQUFBLENBQUQsR0FBSztFQW5CSTs7eUJBcUJiLE1BQUEsR0FBUSxTQUFBO0lBQ0osSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQUE7V0FDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUEvQixFQUFzQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQTlDLEVBQXNELElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBWCxDQUFBLENBQXRELEVBQTZFLENBQTdFLEVBQWdGLENBQWhGO0VBRkk7Ozs7R0FoQ2U7O0FBcUMzQixNQUFNLENBQUMsWUFBUCxHQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogU3ByaXRlX0RlYnVnXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBTcHJpdGVfRGVidWcgZXh0ZW5kcyBTcHJpdGVcbiAgICAjIyMqXG4gICAgKiBTcHJpdGUgdG8gZGlzcGxheSBkZWJ1ZyBpbmZvcm1hdGlvbiBvbiBzY3JlZW4uIDxiPkhJTlQ6PC9iPiBXaWxsIGJlIHByb2JhYmx5IHJlbW92ZWRcbiAgICAqIGJlZm9yZSByZWxlYXNlLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBTcHJpdGVfRGVidWdcbiAgICAqIEBleHRlbmRzIGdzLlNwcml0ZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAc3RhdGljXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6ICh2aWV3cG9ydCkgLT5cbiAgICAgICAgc3VwZXIodmlld3BvcnQpXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgZnJhbWVUaW1lXG4gICAgICAgICogQHR5cGUgbnVtYmVyfHN0cmluZ1xuICAgICAgICAqIFRoZSB0aW1lIC8gdGltZS10ZXh0IHRvIGRpc3BsYXkuXG4gICAgICAgICMjI1xuICAgICAgICBAZnJhbWVUaW1lID0gMFxuICAgICAgICBcbiAgICAgICAgc2l6ZSA9IE1hdGgucm91bmQoOCAvIDI0MCAqIEdyYXBoaWNzLmhlaWdodClcbiAgICAgICAgQGJpdG1hcCA9IG5ldyBCaXRtYXAoMTgwKkdyYXBoaWNzLnNjYWxlLCAyOCAqIEdyYXBoaWNzLnNjYWxlKVxuICAgICAgICBAYml0bWFwLmZvbnQgPSBuZXcgRm9udChcIlZlcmRhbmFcIiwgc2l6ZSlcbiAgICAgICAgQGJpdG1hcC5mb250LmNvbG9yID0gQ29sb3IuV0hJVEVcbiAgICAgICAgQHNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAYml0bWFwLndpZHRoLCBAYml0bWFwLmhlaWdodClcbiAgICAgICAgXG4gICAgICAgIEB6ID0gMTUwMDBcbiAgICAgICAgQG9wYWNpdHkgPSAyNTVcbiAgICAgICAgQHZpc2libGUgPSB5ZXNcbiAgICAgICAgQHggPSAwXG4gICAgICAgIEB5ID0gMFxuICAgICAgICBcbiAgICByZWRyYXc6IC0+XG4gICAgICAgIEBiaXRtYXAuY2xlYXIoKVxuICAgICAgICBAYml0bWFwLmRyYXdUZXh0KDAsIDAsIEBiaXRtYXAud2lkdGgsIEBiaXRtYXAuaGVpZ2h0LCBAZnJhbWVUaW1lLnRvU3RyaW5nKCksIDAsIDApXG4gICAgICAgIFxuICAgICAgICBcbndpbmRvdy5TcHJpdGVfRGVidWcgPSBTcHJpdGVfRGVidWdcblxuXG4gICAgICAgICJdfQ==
//# sourceURL=Sprite_Debug_10.js