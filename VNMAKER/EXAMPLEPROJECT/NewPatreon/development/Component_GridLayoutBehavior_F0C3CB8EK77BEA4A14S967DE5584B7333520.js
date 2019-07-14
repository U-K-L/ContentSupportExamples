var Component_GridLayoutBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_GridLayoutBehavior = (function(superClass) {
  extend(Component_GridLayoutBehavior, superClass);


  /**
  * Turns a game object into a free-layout and layouts all sub-objects
  * in a grid of rows and columns.
  
  * @module gs
  * @class Component_GridLayoutBehavior
  * @extends gs.Component_LayoutBehavior
  * @memberof gs
  * @constructor
   */

  function Component_GridLayoutBehavior() {
    Component_GridLayoutBehavior.__super__.constructor.apply(this, arguments);
    this.column = 0;
    this.row = 0;
  }

  Component_GridLayoutBehavior.prototype.sizeToFit = function() {};


  /**
  * Updates a specified control.
  *
  * @method updateControl
  * @protected
  * @param {gs.Object_Base} control The control to update
   */

  Component_GridLayoutBehavior.prototype.updateControl = function(control) {
    var cellSpacing, rect;
    Component_GridLayoutBehavior.__super__.updateControl.apply(this, arguments);
    cellSpacing = this.object.cellSpacing;
    rect = this.object.dstRect;
    control.parent = this.object;
    control.dstRect.x = cellSpacing[0] + this.column * (control.dstRect.width + cellSpacing[2]);
    control.dstRect.y = cellSpacing[1] + this.row * (control.dstRect.height + cellSpacing[3]);
    if (control.needsUpdate) {
      control.needsUpdate = false;
      control.update();
    }
    if (this.object.sizeToFit) {
      rect.width = Math.max(control.dstRect.x + control.dstRect.width + cellSpacing[2], rect.width || 0);
      return rect.height = Math.max(control.dstRect.y + control.dstRect.height + cellSpacing[3], rect.height || 0);
    }
  };


  /**
  * Updates the grid-layout.
  *
  * @method update
   */

  Component_GridLayoutBehavior.prototype.update = function() {
    var cellSpacing, columns, control, count, i, j, offset, rect, ref, ref1, rows;
    this.updateOrigin();
    cellSpacing = this.object.cellSpacing;
    rows = this.object.rows;
    columns = this.object.columns;
    this.row = 0;
    this.column = 0;
    offset = (this.object.listOffset || 0) * (rows * columns);
    count = Math.min(this.object.subObjects.length, rows * columns + offset);
    rect = this.object.dstRect;
    for (i = j = ref = offset, ref1 = count; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
      control = this.object.subObjects[i];
      control.index = i;
      this.updateControl(control);
      this.column++;
      if (this.column >= columns) {
        this.column = 0;
        this.row++;
      }
      if (this.row >= rows) {
        break;
      }
    }
    if (this.object.clipRect != null) {
      return this.object.clipRect.set(rect.x, rect.y, rect.width, rect.height);
    }
  };

  return Component_GridLayoutBehavior;

})(gs.Component_LayoutBehavior);

gs.Component_GridLayoutBehavior = Component_GridLayoutBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsNEJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7RUFVYSxzQ0FBQTtJQUNULCtEQUFBLFNBQUE7SUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLEdBQUQsR0FBTztFQUpFOzt5Q0FNYixTQUFBLEdBQVcsU0FBQSxHQUFBOzs7QUFFWDs7Ozs7Ozs7eUNBT0EsYUFBQSxHQUFlLFNBQUMsT0FBRDtBQUNYLFFBQUE7SUFBQSxpRUFBQSxTQUFBO0lBRUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDdEIsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFFZixPQUFPLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUE7SUFDbEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFoQixHQUFvQixXQUFZLENBQUEsQ0FBQSxDQUFaLEdBQWlCLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQWhCLEdBQXNCLFdBQVksQ0FBQSxDQUFBLENBQW5DO0lBQy9DLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBaEIsR0FBb0IsV0FBWSxDQUFBLENBQUEsQ0FBWixHQUFpQixJQUFDLENBQUEsR0FBRCxHQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFoQixHQUF1QixXQUFZLENBQUEsQ0FBQSxDQUFwQztJQUM1QyxJQUFHLE9BQU8sQ0FBQyxXQUFYO01BQ0ksT0FBTyxDQUFDLFdBQVIsR0FBc0I7TUFDdEIsT0FBTyxDQUFDLE1BQVIsQ0FBQSxFQUZKOztJQUlBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFYO01BQ0ksSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBaEIsR0FBb0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFwQyxHQUE0QyxXQUFZLENBQUEsQ0FBQSxDQUFqRSxFQUFxRSxJQUFJLENBQUMsS0FBTCxJQUFjLENBQW5GO2FBQ2IsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBaEIsR0FBb0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFwQyxHQUE2QyxXQUFZLENBQUEsQ0FBQSxDQUFsRSxFQUFzRSxJQUFJLENBQUMsTUFBTCxJQUFlLENBQXJGLEVBRmxCOztFQWJXOzs7QUFrQmY7Ozs7Ozt5Q0FLQSxNQUFBLEdBQVEsU0FBQTtBQUNKLFFBQUE7SUFBQSxJQUFDLENBQUEsWUFBRCxDQUFBO0lBRUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDdEIsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDZixPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUNsQixJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLE1BQUEsR0FBUyxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixJQUFvQixDQUFyQixDQUFBLEdBQTBCLENBQUMsSUFBQSxHQUFPLE9BQVI7SUFDbkMsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBNUIsRUFBb0MsSUFBQSxHQUFPLE9BQVAsR0FBaUIsTUFBckQ7SUFDUixJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQztBQUVmLFNBQVMsa0dBQVQ7TUFDSSxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFXLENBQUEsQ0FBQTtNQUM3QixPQUFPLENBQUMsS0FBUixHQUFnQjtNQUVoQixJQUFDLENBQUEsYUFBRCxDQUFlLE9BQWY7TUFFQSxJQUFDLENBQUEsTUFBRDtNQUNBLElBQUcsSUFBQyxDQUFBLE1BQUQsSUFBVyxPQUFkO1FBQ0ksSUFBQyxDQUFBLE1BQUQsR0FBVTtRQUNWLElBQUMsQ0FBQSxHQUFELEdBRko7O01BSUEsSUFBRyxJQUFDLENBQUEsR0FBRCxJQUFRLElBQVg7QUFDSSxjQURKOztBQVhKO0lBY0EsSUFBRyw0QkFBSDthQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQWpCLENBQXFCLElBQUksQ0FBQyxDQUExQixFQUE2QixJQUFJLENBQUMsQ0FBbEMsRUFBcUMsSUFBSSxDQUFDLEtBQTFDLEVBQWlELElBQUksQ0FBQyxNQUF0RCxFQURKOztFQTFCSTs7OztHQWpEK0IsRUFBRSxDQUFDOztBQThFOUMsRUFBRSxDQUFDLDRCQUFILEdBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfR3JpZExheW91dEJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfR3JpZExheW91dEJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50X0xheW91dEJlaGF2aW9yXG4gICAgIyMjKlxuICAgICogVHVybnMgYSBnYW1lIG9iamVjdCBpbnRvIGEgZnJlZS1sYXlvdXQgYW5kIGxheW91dHMgYWxsIHN1Yi1vYmplY3RzXG4gICAgKiBpbiBhIGdyaWQgb2Ygcm93cyBhbmQgY29sdW1ucy5cblxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9HcmlkTGF5b3V0QmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRCZWhhdmlvclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBjb2x1bW4gPSAwXG4gICAgICAgIEByb3cgPSAwXG5cbiAgICBzaXplVG9GaXQ6IC0+XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgYSBzcGVjaWZpZWQgY29udHJvbC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUNvbnRyb2xcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAgIyMjIFxuICAgIHVwZGF0ZUNvbnRyb2w6IChjb250cm9sKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgY2VsbFNwYWNpbmcgPSBAb2JqZWN0LmNlbGxTcGFjaW5nXG4gICAgICAgIHJlY3QgPSBAb2JqZWN0LmRzdFJlY3RcbiAgICAgICAgXG4gICAgICAgIGNvbnRyb2wucGFyZW50ID0gQG9iamVjdFxuICAgICAgICBjb250cm9sLmRzdFJlY3QueCA9IGNlbGxTcGFjaW5nWzBdICsgQGNvbHVtbiAqIChjb250cm9sLmRzdFJlY3Qud2lkdGgrY2VsbFNwYWNpbmdbMl0pXG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gY2VsbFNwYWNpbmdbMV0gKyBAcm93ICogKGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQrY2VsbFNwYWNpbmdbM10pXG4gICAgICAgIGlmIGNvbnRyb2wubmVlZHNVcGRhdGVcbiAgICAgICAgICAgIGNvbnRyb2wubmVlZHNVcGRhdGUgPSBub1xuICAgICAgICAgICAgY29udHJvbC51cGRhdGUoKVxuICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LnNpemVUb0ZpdFxuICAgICAgICAgICAgcmVjdC53aWR0aCA9IE1hdGgubWF4KGNvbnRyb2wuZHN0UmVjdC54ICsgY29udHJvbC5kc3RSZWN0LndpZHRoICsgY2VsbFNwYWNpbmdbMl0sIHJlY3Qud2lkdGggfHwgMClcbiAgICAgICAgICAgIHJlY3QuaGVpZ2h0ID0gTWF0aC5tYXgoY29udHJvbC5kc3RSZWN0LnkgKyBjb250cm9sLmRzdFJlY3QuaGVpZ2h0ICsgY2VsbFNwYWNpbmdbM10sIHJlY3QuaGVpZ2h0IHx8IDApXG4gICAgICAgICAgIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBncmlkLWxheW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgQHVwZGF0ZU9yaWdpbigpXG4gICAgICAgIFxuICAgICAgICBjZWxsU3BhY2luZyA9IEBvYmplY3QuY2VsbFNwYWNpbmdcbiAgICAgICAgcm93cyA9IEBvYmplY3Qucm93c1xuICAgICAgICBjb2x1bW5zID0gQG9iamVjdC5jb2x1bW5zXG4gICAgICAgIEByb3cgPSAwXG4gICAgICAgIEBjb2x1bW4gPSAwXG4gICAgICAgIG9mZnNldCA9IChAb2JqZWN0Lmxpc3RPZmZzZXR8fDApICogKHJvd3MgKiBjb2x1bW5zKSBcbiAgICAgICAgY291bnQgPSBNYXRoLm1pbihAb2JqZWN0LnN1Yk9iamVjdHMubGVuZ3RoLCByb3dzICogY29sdW1ucyArIG9mZnNldClcbiAgICAgICAgcmVjdCA9IEBvYmplY3QuZHN0UmVjdFxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gW29mZnNldC4uLmNvdW50XVxuICAgICAgICAgICAgY29udHJvbCA9IEBvYmplY3Quc3ViT2JqZWN0c1tpXVxuICAgICAgICAgICAgY29udHJvbC5pbmRleCA9IGlcblxuICAgICAgICAgICAgQHVwZGF0ZUNvbnRyb2woY29udHJvbClcblxuICAgICAgICAgICAgQGNvbHVtbisrXG4gICAgICAgICAgICBpZiBAY29sdW1uID49IGNvbHVtbnNcbiAgICAgICAgICAgICAgICBAY29sdW1uID0gMFxuICAgICAgICAgICAgICAgIEByb3crK1xuXG4gICAgICAgICAgICBpZiBAcm93ID49IHJvd3NcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5jbGlwUmVjdD9cbiAgICAgICAgICAgIEBvYmplY3QuY2xpcFJlY3Quc2V0KHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodCkgICAgICBcbiAgICAgICAgXG5ncy5Db21wb25lbnRfR3JpZExheW91dEJlaGF2aW9yID0gQ29tcG9uZW50X0dyaWRMYXlvdXRCZWhhdmlvciJdfQ==
//# sourceURL=Component_GridLayoutBehavior_94.js