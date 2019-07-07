var Component_Visual,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Visual = (function(superClass) {
  extend(Component_Visual, superClass);


  /**
  * The base class for all components displaying an object on screen.
  * @module gs
  * @class Component_Visual
  * @extends gs.Component
  * @memberof gs
  * @constructor
   */

  function Component_Visual() {
    Component_Visual.__super__.constructor.apply(this, arguments);
  }


  /**
  * Updates the origin-point of the game object.
  * @method updateOrigin
   */

  Component_Visual.prototype.updateOrigin = function() {
    var ox, oy, p;
    ox = 0;
    oy = 0;
    if (this.object.parent != null) {
      p = this.object.parent;
      while ((p != null) && (p.dstRect != null)) {
        ox += p.dstRect.x + p.offset.x;
        oy += p.dstRect.y + p.offset.y;
        p = p.parent;
      }
    }
    ox += this.object.offset.x;
    oy += this.object.offset.y;
    this.object.origin.x = ox;
    return this.object.origin.y = oy;
  };


  /**
  * Updates the origin and the destination-rectangle from a layout-rectangle if present.
  * @method update
   */

  Component_Visual.prototype.update = function() {
    var ref;
    Component_Visual.__super__.update.apply(this, arguments);
    this.updateOrigin();
    if ((this.object.layoutRect != null) && (((ref = this.object.parent) != null ? ref.dstRect : void 0) != null)) {
      if (this.object.layoutRect.x) {
        this.object.dstRect.x = this.object.layoutRect.x(this.object.parent.dstRect.width);
      }
      if (this.object.layoutRect.y) {
        this.object.dstRect.y = this.object.layoutRect.y(this.object.parent.dstRect.height);
      }
      if (this.object.layoutRect.width) {
        this.object.dstRect.width = this.object.layoutRect.width(this.object.parent.dstRect.width);
      }
      if (this.object.layoutRect.height) {
        return this.object.dstRect.height = this.object.layoutRect.height(this.object.parent.dstRect.height);
      }
    }
  };

  return Component_Visual;

})(gs.Component);

gs.Component_Visual = Component_Visual;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZ0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O0VBUWEsMEJBQUE7SUFDVCxtREFBQSxTQUFBO0VBRFM7OztBQUdiOzs7Ozs2QkFJQSxZQUFBLEdBQWMsU0FBQTtBQUNWLFFBQUE7SUFBQSxFQUFBLEdBQUs7SUFDTCxFQUFBLEdBQUs7SUFDTCxJQUFHLDBCQUFIO01BQ0ksQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFDWixhQUFNLFdBQUEsSUFBTyxtQkFBYjtRQUNJLEVBQUEsSUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQVYsR0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdCLEVBQUEsSUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQVYsR0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdCLENBQUEsR0FBSSxDQUFDLENBQUM7TUFIVixDQUZKOztJQU9BLEVBQUEsSUFBTSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNyQixFQUFBLElBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFHckIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBZixHQUFtQjtXQUNuQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFmLEdBQW1CO0VBZlQ7OztBQWtCZDs7Ozs7NkJBSUEsTUFBQSxHQUFRLFNBQUE7QUFDSixRQUFBO0lBQUEsOENBQUEsU0FBQTtJQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7SUFHQSxJQUFHLGdDQUFBLElBQXdCLHFFQUEzQjtNQUNJLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBdEI7UUFBNkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBbkIsQ0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQTVDLEVBQWpEOztNQUNBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBdEI7UUFBNkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBbkIsQ0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTVDLEVBQWpEOztNQUNBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBdEI7UUFBaUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBaEIsR0FBd0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBbkIsQ0FBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhELEVBQXpEOztNQUNBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBdEI7ZUFBa0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBaEIsR0FBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBbkIsQ0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWpELEVBQTNEO09BSko7O0VBTEk7Ozs7R0F0Q21CLEVBQUUsQ0FBQzs7QUFtRGxDLEVBQUUsQ0FBQyxnQkFBSCxHQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X1Zpc3VhbFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X1Zpc3VhbCBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIFRoZSBiYXNlIGNsYXNzIGZvciBhbGwgY29tcG9uZW50cyBkaXNwbGF5aW5nIGFuIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1Zpc3VhbFxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG9yaWdpbi1wb2ludCBvZiB0aGUgZ2FtZSBvYmplY3QuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9yaWdpblxuICAgICMjI1xuICAgIHVwZGF0ZU9yaWdpbjogLT5cbiAgICAgICAgb3ggPSAwXG4gICAgICAgIG95ID0gMFxuICAgICAgICBpZiBAb2JqZWN0LnBhcmVudD9cbiAgICAgICAgICAgIHAgPSBAb2JqZWN0LnBhcmVudFxuICAgICAgICAgICAgd2hpbGUgcD8gYW5kIHAuZHN0UmVjdD9cbiAgICAgICAgICAgICAgICBveCArPSBwLmRzdFJlY3QueCArIHAub2Zmc2V0LnhcbiAgICAgICAgICAgICAgICBveSArPSBwLmRzdFJlY3QueSArIHAub2Zmc2V0LnlcbiAgICAgICAgICAgICAgICBwID0gcC5wYXJlbnRcbiAgICAgICAgICBcbiAgICAgICAgb3ggKz0gQG9iamVjdC5vZmZzZXQueFxuICAgICAgICBveSArPSBAb2JqZWN0Lm9mZnNldC55XG5cbiAgICAgICAgXG4gICAgICAgIEBvYmplY3Qub3JpZ2luLnggPSBveFxuICAgICAgICBAb2JqZWN0Lm9yaWdpbi55ID0gb3lcbiAgICAgICAgXG4gICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBvcmlnaW4gYW5kIHRoZSBkZXN0aW5hdGlvbi1yZWN0YW5nbGUgZnJvbSBhIGxheW91dC1yZWN0YW5nbGUgaWYgcHJlc2VudC5cbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBAdXBkYXRlT3JpZ2luKClcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmxheW91dFJlY3Q/IGFuZCBAb2JqZWN0LnBhcmVudD8uZHN0UmVjdD9cbiAgICAgICAgICAgIGlmIEBvYmplY3QubGF5b3V0UmVjdC54IHRoZW4gQG9iamVjdC5kc3RSZWN0LnggPSBAb2JqZWN0LmxheW91dFJlY3QueChAb2JqZWN0LnBhcmVudC5kc3RSZWN0LndpZHRoKVxuICAgICAgICAgICAgaWYgQG9iamVjdC5sYXlvdXRSZWN0LnkgdGhlbiBAb2JqZWN0LmRzdFJlY3QueSA9IEBvYmplY3QubGF5b3V0UmVjdC55KEBvYmplY3QucGFyZW50LmRzdFJlY3QuaGVpZ2h0KVxuICAgICAgICAgICAgaWYgQG9iamVjdC5sYXlvdXRSZWN0LndpZHRoIHRoZW4gQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5sYXlvdXRSZWN0LndpZHRoKEBvYmplY3QucGFyZW50LmRzdFJlY3Qud2lkdGgpXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmxheW91dFJlY3QuaGVpZ2h0IHRoZW4gQG9iamVjdC5kc3RSZWN0LmhlaWdodCA9IEBvYmplY3QubGF5b3V0UmVjdC5oZWlnaHQoQG9iamVjdC5wYXJlbnQuZHN0UmVjdC5oZWlnaHQpXG5cblxuXG5ncy5Db21wb25lbnRfVmlzdWFsID0gQ29tcG9uZW50X1Zpc3VhbCJdfQ==
//# sourceURL=Component_Visual_53.js