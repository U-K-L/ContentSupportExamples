var Component_StackLayoutBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_StackLayoutBehavior = (function(superClass) {
  extend(Component_StackLayoutBehavior, superClass);


  /**
  * Turns a game object into a stack-layout and layouts all sub-objects
  * like stack vertically or horizontally. The game object needs a 
  * container-component.
  * <br>
  * The sub-objects in a stack-layout can be configured as resizable or
  * non-resizable(fixed-size). For example:<br>
  * <br>
  * Lets say we have a layout-size of 500px in width with three controls.<br>
  * <br>
  * | 80px | dynamic | 80px | <br>
  * <br>
  * Two controls have a fixed size of 80px and the middle-control has a
  * dynamic-size because it is configured to be resizable. In that case, 
  * the size of the resizable control would be 340px because that is the
  * free space left after subtracting the size(160px) of the fixed-size controls.<br>
  * <br>
  * In addition, each sub-object can have different alignment options.
  *
  * @module gs
  * @class Component_StackLayoutBehavior
  * @extends gs.Component_LayoutBehavior
  * @memberof gs
  * @constructor
   */

  function Component_StackLayoutBehavior(orientation) {
    Component_StackLayoutBehavior.__super__.constructor.apply(this, arguments);

    /**
    * The orientation of the stack-layout. Can be vertical or horizontal.
    * @property orientation
    * @type gs.Orientation
     */
    this.orientation = orientation || 0;

    /**
    * @property scrollOffsetX
    * @type number
    * @protected
     */
    this.scrollOffsetX = 0;

    /**
    * @property scrollOffsetY
    * @type number
    * @protected
     */
    this.scrollOffsetY = 0;

    /**
    * @property contentHeight
    * @type number
    * @protected
     */
    this.contentHeight = 0;

    /**
    * Control list-offset.
    * @property offset
    * @type number
    * @protected
     */
    this.offset = 0;

    /**
    * Count of controls to process.
    * @property contentHeight
    * @type number
    * @protected
     */
    this.count = 0;

    /**
    * Current x-coordinate. 
    * @property cx
    * @type number
    * @protected
     */
    this.cx = 0;

    /**
    * Current y-coordinate. 
    * @property cy
    * @type number
    * @protected
     */
    this.cy = 0;

    /**
    * Total size of all centered controls. 
    * @property centerSize
    * @type number
    * @protected
     */
    this.centerSize = 0;

    /**
    * Current x/y-coordinate for a centered control.
    * @property center
    * @type number
    * @protected
     */
    this.center = 0;

    /**
    * Current x/y-coordinate for a bottom/right aligned control.
    * @property bottom
    * @type number
    * @protected
     */
    this.bottom = 0;
    this.managementMode = 0;
  }


  /**
  * Initializes the layout.
  *
  * @method setup
   */

  Component_StackLayoutBehavior.prototype.setup = function() {
    this.update();
    if (this.object.scrollable) {
      return gs.GlobalEventManager.on("mouseWheel", (function(_this) {
        return function() {
          var r;
          r = _this.object.dstRect;
          if (Rect.contains(r.x, r.y, r.width, r.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y)) {
            return _this.object.update();
          }
        };
      })(this));
    }
  };


  /**
  * Updates the layout depending on its orientation.
  *
  * @method update
   */

  Component_StackLayoutBehavior.prototype.update = function() {
    Component_StackLayoutBehavior.__super__.update.apply(this, arguments);
    if (this.orientation === 0) {
      return this.layoutHorizontal();
    } else {
      return this.layoutVertical();
    }
  };


  /**
  * Sizes the layout to fit its content
  *
  * @method sizeToFit
  * @return number The content size.
   */

  Component_StackLayoutBehavior.prototype.sizeToFit = function() {
    if (this.orientation === 0) {
      return this.sizeToFitHorizontal();
    } else {
      return this.sizeToFitVertical();
    }
  };


  /**
  * Sizes the horizontal-layout to fit its content
  *
  * @method sizeToFitHorizontal
   */

  Component_StackLayoutBehavior.prototype.sizeToFitHorizontal = function() {
    var control, i, j, rect, ref, ref1, results, x, y;
    x = 0;
    y = 0;
    rect = this.object.dstRect;
    if (this.object.sizeToFit) {
      results = [];
      for (i = j = ref = this.offset, ref1 = this.count; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
        control = this.object.subObjects[i];
        if (!control.alignment) {
          rect.width = Math.max(x + control.margin.left + control.dstRect.width + control.margin.right, rect.width || 0);
          x += control.margin.left + control.dstRect.width + control.margin.right;
        }
        if (!control.alignmentY) {
          results.push(rect.height = Math.max(y + control.margin.top + control.dstRect.height + control.margin.bottom, rect.height || 0));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Sizes the vertical-layout to fit its content
  *
  * @method sizeToFitVertical
   */

  Component_StackLayoutBehavior.prototype.sizeToFitVertical = function() {
    var control, j, len, rect, ref, results;
    rect = this.object.dstRect;
    if (this.object.sizeToFit) {
      ref = this.object.subObjects;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        control = ref[j];
        rect.width = Math.max(control.dstRect.x + control.dstRect.width + control.margin.right, rect.width || 1);
        results.push(rect.height = Math.max(control.dstRect.y + control.dstRect.height + control.margin.bottom, rect.height || 1));
      }
      return results;
    }
  };


  /**
  * Calculates the dynamic-size of a horizontal stack-layout. That size is used for
  * resizable-controls to let them fill all free space. It is calculated in the
  * following way:<br>
  * <br>
  * dynamic-size = sum-of-all-fixed-control-sizes / count-of-resizable-controls
  * <br>
  *
  * @method calculateDynamicSizeHorizontal
  * @return {number} The dynamic size.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.calculateDynamicSizeHorizontal = function() {
    var control, dynamicCount, fixedSize, i, j, len, rect, ref;
    fixedSize = 0;
    dynamicCount = 0;
    rect = this.object.dstRect;
    ref = this.object.subObjects;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      control = ref[i];
      if (control.resizable && !control.sizeToFit) {
        dynamicCount++;
      } else {
        fixedSize += control.margin.left + control.dstRect.width + control.margin.right;
        if (control.alignmentX === 1) {
          this.centerSize += control.dstRect.width + control.margin.right;
        }
      }
    }
    return Math.round((rect.width - fixedSize) / dynamicCount);
  };


  /**
  * Calculates the dynamic-size of a vertical stack-layout. That size is used for
  * resizable-controls to let them fill all free space. It is calculated in the
  * following way:<br>
  * <br>
  * dynamic-size = sum-of-all-fixed-control-sizes / count-of-resizable-controls
  * <br>
  *
  * @method calculateDynamicSizeVertical
  * @return {number} The dynamic size.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.calculateDynamicSizeVertical = function() {
    var control, dynamicCount, fixedSize, j, len, ref;
    fixedSize = 0;
    dynamicCount = 0;
    ref = this.object.subObjects;
    for (j = 0, len = ref.length; j < len; j++) {
      control = ref[j];
      if (control.resizable && !control.sizeToFit) {
        dynamicCount++;
      } else {
        fixedSize += control.dstRect.height;
        if (control.alignmentY === 1) {
          this.centerSize += control.dstRect.height + control.margin.bottom;
        }
      }
    }
    return Math.round((this.object.dstRect.height - fixedSize) / dynamicCount);
  };


  /**
  * Layouts the specified control as fixed-size control for a horizontal stack-layout. 
  *
  * @method updateControlRectFixedH
  * @param {gs.Object_Base} control The control to update.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.updateControlRectFixedH = function(control) {
    var rect;
    rect = this.object.dstRect;
    if (control.alignmentX === 0) {
      this.cx += control.margin.left;
      control.dstRect.x = this.cx;
      this.cx += control.dstRect.width + control.margin.right;
    } else if (control.alignmentX === 2) {
      this.bottom += control.margin.right;
      control.dstRect.x = (rect.x + rect.width) - control.dstRect.width - this.bottom;
      this.bottom += control.dstRect.width + control.margin.left;
    } else if (control.alignmentX === 1) {
      control.dstRect.x = this.center + (rect.width - this.centerSize) / 2;
      this.center += control.dstRect.width + control.margin.right;
    }
    if (control.alignmentY === 1) {
      return control.dstRect.y = this.cy + Math.round((rect.height - (control.dstRect.height + control.margin.top + control.margin.bottom)) / 2);
    } else {
      return control.dstRect.y = this.cy + control.margin.top;
    }
  };


  /**
  * Layouts the specified control as fixed-size control for a vertical stack-layout. 
  *
  * @method updateControlRectFixedV
  * @param {gs.Object_Base} control The control to update.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.updateControlRectFixedV = function(control) {
    var rect;
    rect = this.object.dstRect;
    if (control.alignmentY === 0) {
      this.cy += control.margin.top;
      control.dstRect.y = this.cy;
      this.cy += control.dstRect.height + control.margin.bottom;
      control.dstRect.x = this.cx + control.margin.left;
    } else if (control.alignmentY === 2) {
      this.bottom += control.margin.bottom;
      control.dstRect.y = rect.height - control.dstRect.height - this.bottom;
      this.bottom += control.dstRect.height + control.margin.top;
      control.dstRect.x = this.cx + control.margin.left;
    } else if (control.alignmentY === 1) {
      control.dstRect.y = this.center + (rect.height - this.centerSize) / 2;
      control.dstRect.x = this.cx + control.margin.left;
      this.center += control.dstRect.height + control.margin.bottom;
    }
    if (control.alignmentX === 1) {
      return control.dstRect.x = this.cx + Math.round((rect.width - control.dstRect.width) / 2);
    }
  };


  /**
  * Layouts the specified control as resizable-control for a horizontal stack-layout. 
  * That means the control will take up all free space after subtracting all 
  * fixed-size controls.
  *
  * @method updateControlRectResizableH
  * @param {gs.Object_Base} control The control to update.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.updateControlRectResizableH = function(control) {
    var dynamicSize;
    dynamicSize = this.calculateDynamicSizeHorizontal();
    control.dstRect.y = control.margin.top;
    control.dstRect.height = this.object.dstRect.height - control.margin.bottom - control.margin.top;
    control.dstRect.x = this.cx + control.margin.left;
    control.dstRect.width = dynamicSize - control.margin.right - control.margin.left;
    return this.cx += dynamicSize;
  };


  /**
  * Layouts the specified control as resizable-control for a vertical stack-layout. 
  * That means the control will take up all free space after subtracting all 
  * fixed-size controls.
  *
  * @method updateControlRectResizableV
  * @param {gs.Object_Base} control The control to update.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.updateControlRectResizableV = function(control) {
    var dynamicSize;
    dynamicSize = this.calculateDynamicSizeVertical();
    control.dstRect.x = control.margin.left;
    control.dstRect.width = this.object.dstRect.width - control.margin.right - control.margin.left;
    control.dstRect.y = this.cy + control.margin.top;
    control.dstRect.height = dynamicSize - control.margin.bottom - control.margin.top;
    return this.cy += dynamicSize;
  };


  /**
  * Updates a control.
  *
  * @method updateControl
  * @param {gs.Object_Base} control The control to update.
  * @protected
   */

  Component_StackLayoutBehavior.prototype.updateControl = function(control) {
    if (this.orientation === 1) {
      if (control.clipRect == null) {
        control.clipRect = this.object.clipRect;
      }
      if (true) {
        if (control.needsUpdate) {
          control.needsUpdate = false;
          control.update();
        }
        control.updated = true;
        return control.visible = true;
      } else {
        if (control.visible) {
          control.visible = false;
          return control.update();
        }
      }
    } else {
      return Component_StackLayoutBehavior.__super__.updateControl.call(this, control);
    }
  };


  /**
  * Layouts the sub-objects horizontally.
  *
  * @method layoutHorizontal
   */

  Component_StackLayoutBehavior.prototype.layoutHorizontal = function() {
    var control, i, ref;
    this.bottom = 0;
    this.center = 0;
    this.centerSize = 0;
    this.offset = this.object.listOffset || 0;
    this.count = this.object.subObjects.length;
    this.cx = 0;
    this.cy = 0;
    this.sizeToFitHorizontal();
    i = this.offset;
    while (i < this.object.subObjects.length) {
      control = this.object.subObjects[i];
      this.updateControl(control);
      if (control.disposed) {
        this.object.removeObject(control);
        i--;
      } else {
        if (control.resizable && !control.sizeToFit) {
          this.updateControlRectResizableH(control);
        } else {
          this.updateControlRectFixedH(control);
        }
      }
      i++;
    }
    if ((ref = this.object.clipRect) != null) {
      ref.set(this.object.dstRect.x + this.object.origin.x, this.object.dstRect.y + this.object.origin.y, this.object.dstRect.width, this.object.dstRect.height);
    }
    return null;
  };


  /**
  * Layouts the sub-objects vertically.
  *
  * @method layoutVertical
   */

  Component_StackLayoutBehavior.prototype.layoutVertical = function() {
    var control, currentY, i, ref;
    this.bottom = 0;
    this.center = 0;
    this.centerSize = 0;
    this.offset = this.object.listOffset || 0;
    this.count = this.object.subObjects.length;
    this.cx = 0;
    this.cy = 0;
    this.cy -= this.object.scrollOffsetY;
    i = this.offset;
    currentY = 0;
    while (i < this.object.subObjects.length) {
      control = this.object.subObjects[i];
      i++;
      if (!control) {
        continue;
      }
      this.updateControl(control);
      if (control.disposed) {
        this.object.removeObject(control);
        i--;
      } else {
        if (control.resizable && !control.sizeToFit) {
          this.updateControlRectResizableV(control);
        } else {
          this.updateControlRectFixedV(control);
        }
      }
    }
    this.sizeToFitVertical();
    if ((ref = this.object.clipRect) != null) {
      ref.set(this.object.dstRect.x + this.object.origin.x, this.object.dstRect.y + this.object.origin.y, this.object.dstRect.width, this.object.dstRect.height);
    }
    return null;
  };

  return Component_StackLayoutBehavior;

})(gs.Component_LayoutBehavior);

gs.Component_StackLayoutBehavior = Component_StackLayoutBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsNkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF5QmEsdUNBQUMsV0FBRDtJQUNULGdFQUFBLFNBQUE7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQUFBLElBQWU7O0FBRTlCOzs7OztJQUtBLElBQUMsQ0FBQSxhQUFELEdBQWlCOztBQUVqQjs7Ozs7SUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQjs7QUFFakI7Ozs7O0lBS0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7O0FBRWpCOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7Ozs7SUFNQSxJQUFDLENBQUEsRUFBRCxHQUFNOztBQUVOOzs7Ozs7SUFNQSxJQUFDLENBQUEsRUFBRCxHQUFNOztBQUVOOzs7Ozs7SUFNQSxJQUFDLENBQUEsVUFBRCxHQUFjOztBQUVkOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7RUF2RlQ7OztBQXlGYjs7Ozs7OzBDQUtBLEtBQUEsR0FBTyxTQUFBO0lBQ0gsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUVBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFYO2FBQ0ksRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQXRCLENBQXlCLFlBQXpCLEVBQXVDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNuQyxjQUFBO1VBQUEsQ0FBQSxHQUFJLEtBQUMsQ0FBQSxNQUFNLENBQUM7VUFFWixJQUFHLElBQUksQ0FBQyxRQUFMLENBQWMsQ0FBQyxDQUFDLENBQWhCLEVBQW1CLENBQUMsQ0FBQyxDQUFyQixFQUF3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LEdBQVc7QUFFWCxXQUFNLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUE3QjtNQUNJLE9BQUEsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVcsQ0FBQSxDQUFBO01BQzdCLENBQUE7TUFDQSxJQUFBLENBQWdCLE9BQWhCO0FBQUEsaUJBQUE7O01BRUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxPQUFmO01BRUEsSUFBRyxPQUFPLENBQUMsUUFBWDtRQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixPQUFyQjtRQUNBLENBQUEsR0FGSjtPQUFBLE1BQUE7UUFJSSxJQUFHLE9BQU8sQ0FBQyxTQUFSLElBQXNCLENBQUMsT0FBTyxDQUFDLFNBQWxDO1VBQ0ksSUFBQyxDQUFBLDJCQUFELENBQTZCLE9BQTdCLEVBREo7U0FBQSxNQUFBO1VBR0ksSUFBQyxDQUFBLHVCQUFELENBQXlCLE9BQXpCLEVBSEo7U0FKSjs7SUFQSjtJQWdCQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTs7U0FHZ0IsQ0FBRSxHQUFsQixDQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFoQixHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUF6RCxFQUE0RCxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFoQixHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUEvRixFQUFrRyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFsSCxFQUF5SCxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUF6STs7QUFFQSxXQUFPO0VBbENLOzs7O0dBell3QixFQUFFLENBQUM7O0FBNGEvQyxFQUFFLENBQUMsNkJBQUgsR0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9TdGFja0xheW91dEJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfU3RhY2tMYXlvdXRCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRCZWhhdmlvclxuICAgICMjIypcbiAgICAqIFR1cm5zIGEgZ2FtZSBvYmplY3QgaW50byBhIHN0YWNrLWxheW91dCBhbmQgbGF5b3V0cyBhbGwgc3ViLW9iamVjdHNcbiAgICAqIGxpa2Ugc3RhY2sgdmVydGljYWxseSBvciBob3Jpem9udGFsbHkuIFRoZSBnYW1lIG9iamVjdCBuZWVkcyBhIFxuICAgICogY29udGFpbmVyLWNvbXBvbmVudC5cbiAgICAqIDxicj5cbiAgICAqIFRoZSBzdWItb2JqZWN0cyBpbiBhIHN0YWNrLWxheW91dCBjYW4gYmUgY29uZmlndXJlZCBhcyByZXNpemFibGUgb3JcbiAgICAqIG5vbi1yZXNpemFibGUoZml4ZWQtc2l6ZSkuIEZvciBleGFtcGxlOjxicj5cbiAgICAqIDxicj5cbiAgICAqIExldHMgc2F5IHdlIGhhdmUgYSBsYXlvdXQtc2l6ZSBvZiA1MDBweCBpbiB3aWR0aCB3aXRoIHRocmVlIGNvbnRyb2xzLjxicj5cbiAgICAqIDxicj5cbiAgICAqIHwgODBweCB8IGR5bmFtaWMgfCA4MHB4IHwgPGJyPlxuICAgICogPGJyPlxuICAgICogVHdvIGNvbnRyb2xzIGhhdmUgYSBmaXhlZCBzaXplIG9mIDgwcHggYW5kIHRoZSBtaWRkbGUtY29udHJvbCBoYXMgYVxuICAgICogZHluYW1pYy1zaXplIGJlY2F1c2UgaXQgaXMgY29uZmlndXJlZCB0byBiZSByZXNpemFibGUuIEluIHRoYXQgY2FzZSwgXG4gICAgKiB0aGUgc2l6ZSBvZiB0aGUgcmVzaXphYmxlIGNvbnRyb2wgd291bGQgYmUgMzQwcHggYmVjYXVzZSB0aGF0IGlzIHRoZVxuICAgICogZnJlZSBzcGFjZSBsZWZ0IGFmdGVyIHN1YnRyYWN0aW5nIHRoZSBzaXplKDE2MHB4KSBvZiB0aGUgZml4ZWQtc2l6ZSBjb250cm9scy48YnI+XG4gICAgKiA8YnI+XG4gICAgKiBJbiBhZGRpdGlvbiwgZWFjaCBzdWItb2JqZWN0IGNhbiBoYXZlIGRpZmZlcmVudCBhbGlnbm1lbnQgb3B0aW9ucy5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1N0YWNrTGF5b3V0QmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRCZWhhdmlvclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKG9yaWVudGF0aW9uKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc3RhY2stbGF5b3V0LiBDYW4gYmUgdmVydGljYWwgb3IgaG9yaXpvbnRhbC5cbiAgICAgICAgKiBAcHJvcGVydHkgb3JpZW50YXRpb25cbiAgICAgICAgKiBAdHlwZSBncy5PcmllbnRhdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24gfHwgMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBzY3JvbGxPZmZzZXRYXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHNjcm9sbE9mZnNldFggPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHNjcm9sbE9mZnNldFlcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAc2Nyb2xsT2Zmc2V0WSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgY29udGVudEhlaWdodFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb250ZW50SGVpZ2h0ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIENvbnRyb2wgbGlzdC1vZmZzZXQuXG4gICAgICAgICogQHByb3BlcnR5IG9mZnNldFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBvZmZzZXQgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ291bnQgb2YgY29udHJvbHMgdG8gcHJvY2Vzcy5cbiAgICAgICAgKiBAcHJvcGVydHkgY29udGVudEhlaWdodFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb3VudCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDdXJyZW50IHgtY29vcmRpbmF0ZS4gXG4gICAgICAgICogQHByb3BlcnR5IGN4XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGN4ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEN1cnJlbnQgeS1jb29yZGluYXRlLiBcbiAgICAgICAgKiBAcHJvcGVydHkgY3lcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY3kgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVG90YWwgc2l6ZSBvZiBhbGwgY2VudGVyZWQgY29udHJvbHMuIFxuICAgICAgICAqIEBwcm9wZXJ0eSBjZW50ZXJTaXplXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGNlbnRlclNpemUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ3VycmVudCB4L3ktY29vcmRpbmF0ZSBmb3IgYSBjZW50ZXJlZCBjb250cm9sLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjZW50ZXJcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY2VudGVyID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEN1cnJlbnQgeC95LWNvb3JkaW5hdGUgZm9yIGEgYm90dG9tL3JpZ2h0IGFsaWduZWQgY29udHJvbC5cbiAgICAgICAgKiBAcHJvcGVydHkgYm90dG9tXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGJvdHRvbSA9IDBcbiAgICAgICAgXG4gICAgICAgIEBtYW5hZ2VtZW50TW9kZSA9IDBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIGxheW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjIFxuICAgIHNldHVwOiAtPlxuICAgICAgICBAdXBkYXRlKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5zY3JvbGxhYmxlXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZVdoZWVsXCIsID0+XG4gICAgICAgICAgICAgICAgciA9IEBvYmplY3QuZHN0UmVjdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIFJlY3QuY29udGFpbnMoci54LCByLnksIHIud2lkdGgsIHIuaGVpZ2h0LCBJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QudXBkYXRlKClcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGxheW91dCBkZXBlbmRpbmcgb24gaXRzIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIGlmIEBvcmllbnRhdGlvbiA9PSAwXG4gICAgICAgICAgICBAbGF5b3V0SG9yaXpvbnRhbCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBsYXlvdXRWZXJ0aWNhbCgpXG4gICAgXG4gICAgIyMjKlxuICAgICogU2l6ZXMgdGhlIGxheW91dCB0byBmaXQgaXRzIGNvbnRlbnRcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNpemVUb0ZpdFxuICAgICogQHJldHVybiBudW1iZXIgVGhlIGNvbnRlbnQgc2l6ZS5cbiAgICAjIyNcbiAgICBzaXplVG9GaXQ6IC0+XG4gICAgICAgIGlmIEBvcmllbnRhdGlvbiA9PSAwXG4gICAgICAgICAgICByZXR1cm4gQHNpemVUb0ZpdEhvcml6b250YWwoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gQHNpemVUb0ZpdFZlcnRpY2FsKClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNpemVzIHRoZSBob3Jpem9udGFsLWxheW91dCB0byBmaXQgaXRzIGNvbnRlbnRcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNpemVUb0ZpdEhvcml6b250YWxcbiAgICAjIyNcbiAgICBzaXplVG9GaXRIb3Jpem9udGFsOiAtPlxuICAgICAgICB4ID0gMFxuICAgICAgICB5ID0gMFxuICAgICAgICByZWN0ID0gQG9iamVjdC5kc3RSZWN0XG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LnNpemVUb0ZpdFxuICAgICAgICAgICAgZm9yIGkgaW4gW0BvZmZzZXQuLi5AY291bnRdXG4gICAgICAgICAgICAgICAgY29udHJvbCA9IEBvYmplY3Quc3ViT2JqZWN0c1tpXVxuXG4gICAgICAgICAgICAgICAgaWYgIWNvbnRyb2wuYWxpZ25tZW50XG4gICAgICAgICAgICAgICAgICAgIHJlY3Qud2lkdGggPSBNYXRoLm1heCh4ICsgY29udHJvbC5tYXJnaW4ubGVmdCArIGNvbnRyb2wuZHN0UmVjdC53aWR0aCArIGNvbnRyb2wubWFyZ2luLnJpZ2h0LCByZWN0LndpZHRoIHx8IDApXG4gICAgICAgICAgICAgICAgICAgIHggKz0gY29udHJvbC5tYXJnaW4ubGVmdCArIGNvbnRyb2wuZHN0UmVjdC53aWR0aCArIGNvbnRyb2wubWFyZ2luLnJpZ2h0XG4gICAgICAgICAgICAgICAgaWYgIWNvbnRyb2wuYWxpZ25tZW50WVxuICAgICAgICAgICAgICAgICAgICByZWN0LmhlaWdodCA9IE1hdGgubWF4KHkgKyBjb250cm9sLm1hcmdpbi50b3AgKyBjb250cm9sLmRzdFJlY3QuaGVpZ2h0ICsgY29udHJvbC5tYXJnaW4uYm90dG9tLCByZWN0LmhlaWdodCB8fCAwKVxuICAgIFxuICAgICMjIypcbiAgICAqIFNpemVzIHRoZSB2ZXJ0aWNhbC1sYXlvdXQgdG8gZml0IGl0cyBjb250ZW50XG4gICAgKlxuICAgICogQG1ldGhvZCBzaXplVG9GaXRWZXJ0aWNhbFxuICAgICMjIyAgICBcbiAgICBzaXplVG9GaXRWZXJ0aWNhbDogLT5cbiAgICAgICAgcmVjdCA9IEBvYmplY3QuZHN0UmVjdFxuICAgICAgICBpZiBAb2JqZWN0LnNpemVUb0ZpdFxuICAgICAgICAgICAgZm9yIGNvbnRyb2wgaW4gQG9iamVjdC5zdWJPYmplY3RzXG4gICAgICAgICAgICAgICAgcmVjdC53aWR0aCA9IE1hdGgubWF4KGNvbnRyb2wuZHN0UmVjdC54ICsgY29udHJvbC5kc3RSZWN0LndpZHRoICsgY29udHJvbC5tYXJnaW4ucmlnaHQsIHJlY3Qud2lkdGggfHwgMSlcbiAgICAgICAgICAgICAgICByZWN0LmhlaWdodCA9IE1hdGgubWF4KGNvbnRyb2wuZHN0UmVjdC55ICsgY29udHJvbC5kc3RSZWN0LmhlaWdodCArIGNvbnRyb2wubWFyZ2luLmJvdHRvbSwgcmVjdC5oZWlnaHQgfHwgMSlcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGR5bmFtaWMtc2l6ZSBvZiBhIGhvcml6b250YWwgc3RhY2stbGF5b3V0LiBUaGF0IHNpemUgaXMgdXNlZCBmb3JcbiAgICAqIHJlc2l6YWJsZS1jb250cm9scyB0byBsZXQgdGhlbSBmaWxsIGFsbCBmcmVlIHNwYWNlLiBJdCBpcyBjYWxjdWxhdGVkIGluIHRoZVxuICAgICogZm9sbG93aW5nIHdheTo8YnI+XG4gICAgKiA8YnI+XG4gICAgKiBkeW5hbWljLXNpemUgPSBzdW0tb2YtYWxsLWZpeGVkLWNvbnRyb2wtc2l6ZXMgLyBjb3VudC1vZi1yZXNpemFibGUtY29udHJvbHNcbiAgICAqIDxicj5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNhbGN1bGF0ZUR5bmFtaWNTaXplSG9yaXpvbnRhbFxuICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZHluYW1pYyBzaXplLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjYWxjdWxhdGVEeW5hbWljU2l6ZUhvcml6b250YWw6IC0+XG4gICAgICAgIGZpeGVkU2l6ZSA9IDBcbiAgICAgICAgZHluYW1pY0NvdW50ID0gMFxuICAgICAgICByZWN0ID0gQG9iamVjdC5kc3RSZWN0XG4gICAgICAgIGZvciBjb250cm9sLCBpIGluIEBvYmplY3Quc3ViT2JqZWN0c1xuICAgICAgICAgICAgaWYgY29udHJvbC5yZXNpemFibGUgYW5kICFjb250cm9sLnNpemVUb0ZpdFxuICAgICAgICAgICAgICAgIGR5bmFtaWNDb3VudCsrXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZml4ZWRTaXplICs9IGNvbnRyb2wubWFyZ2luLmxlZnQgKyBjb250cm9sLmRzdFJlY3Qud2lkdGggKyBjb250cm9sLm1hcmdpbi5yaWdodFxuICAgICAgICAgICAgICAgIGlmIGNvbnRyb2wuYWxpZ25tZW50WCA9PSAxXG4gICAgICAgICAgICAgICAgICAgIEBjZW50ZXJTaXplICs9IGNvbnRyb2wuZHN0UmVjdC53aWR0aCArIGNvbnRyb2wubWFyZ2luLnJpZ2h0XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKChyZWN0LndpZHRoIC0gZml4ZWRTaXplKSAvIGR5bmFtaWNDb3VudCkgXG4gICAgIFxuICAgICMjIypcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGR5bmFtaWMtc2l6ZSBvZiBhIHZlcnRpY2FsIHN0YWNrLWxheW91dC4gVGhhdCBzaXplIGlzIHVzZWQgZm9yXG4gICAgKiByZXNpemFibGUtY29udHJvbHMgdG8gbGV0IHRoZW0gZmlsbCBhbGwgZnJlZSBzcGFjZS4gSXQgaXMgY2FsY3VsYXRlZCBpbiB0aGVcbiAgICAqIGZvbGxvd2luZyB3YXk6PGJyPlxuICAgICogPGJyPlxuICAgICogZHluYW1pYy1zaXplID0gc3VtLW9mLWFsbC1maXhlZC1jb250cm9sLXNpemVzIC8gY291bnQtb2YtcmVzaXphYmxlLWNvbnRyb2xzXG4gICAgKiA8YnI+XG4gICAgKlxuICAgICogQG1ldGhvZCBjYWxjdWxhdGVEeW5hbWljU2l6ZVZlcnRpY2FsXG4gICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkeW5hbWljIHNpemUuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNhbGN1bGF0ZUR5bmFtaWNTaXplVmVydGljYWw6IC0+XG4gICAgICAgIGZpeGVkU2l6ZSA9IDBcbiAgICAgICAgZHluYW1pY0NvdW50ID0gMFxuICAgICAgICBcbiAgICAgICAgZm9yIGNvbnRyb2wgaW4gQG9iamVjdC5zdWJPYmplY3RzXG4gICAgICAgICAgICBpZiBjb250cm9sLnJlc2l6YWJsZSBhbmQgIWNvbnRyb2wuc2l6ZVRvRml0XG4gICAgICAgICAgICAgICAgZHluYW1pY0NvdW50KytcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmaXhlZFNpemUgKz0gY29udHJvbC5kc3RSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgIGlmIGNvbnRyb2wuYWxpZ25tZW50WSA9PSAxXG4gICAgICAgICAgICAgICAgICAgIEBjZW50ZXJTaXplICs9IGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQgKyBjb250cm9sLm1hcmdpbi5ib3R0b21cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoKEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgLSBmaXhlZFNpemUpIC8gZHluYW1pY0NvdW50KVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBMYXlvdXRzIHRoZSBzcGVjaWZpZWQgY29udHJvbCBhcyBmaXhlZC1zaXplIGNvbnRyb2wgZm9yIGEgaG9yaXpvbnRhbCBzdGFjay1sYXlvdXQuIFxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlQ29udHJvbFJlY3RGaXhlZEhcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdXBkYXRlLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHVwZGF0ZUNvbnRyb2xSZWN0Rml4ZWRIOiAoY29udHJvbCkgLT5cbiAgICAgICAgcmVjdCA9IEBvYmplY3QuZHN0UmVjdFxuICAgICAgICBpZiBjb250cm9sLmFsaWdubWVudFggPT0gMFxuICAgICAgICAgICAgQGN4ICs9IGNvbnRyb2wubWFyZ2luLmxlZnRcbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gQGN4XG4gICAgICAgICAgICBAY3ggKz0gY29udHJvbC5kc3RSZWN0LndpZHRoICsgY29udHJvbC5tYXJnaW4ucmlnaHRcbiAgICAgICAgZWxzZSBpZiBjb250cm9sLmFsaWdubWVudFggPT0gMlxuICAgICAgICAgICAgQGJvdHRvbSArPSBjb250cm9sLm1hcmdpbi5yaWdodFxuICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnggPSAocmVjdC54K3JlY3Qud2lkdGgpIC0gY29udHJvbC5kc3RSZWN0LndpZHRoIC0gQGJvdHRvbVxuICAgICAgICAgICAgQGJvdHRvbSArPSBjb250cm9sLmRzdFJlY3Qud2lkdGggKyBjb250cm9sLm1hcmdpbi5sZWZ0XG4gICAgICAgIGVsc2UgaWYgY29udHJvbC5hbGlnbm1lbnRYID09IDFcbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gQGNlbnRlciArIChyZWN0LndpZHRoIC0gQGNlbnRlclNpemUpIC8gMlxuICAgICAgICAgICAgQGNlbnRlciArPSBjb250cm9sLmRzdFJlY3Qud2lkdGggKyBjb250cm9sLm1hcmdpbi5yaWdodFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGNvbnRyb2wuYWxpZ25tZW50WSA9PSAxXG4gICAgICAgICAgICBjb250cm9sLmRzdFJlY3QueSA9IEBjeSArIE1hdGgucm91bmQoKHJlY3QuaGVpZ2h0LShjb250cm9sLmRzdFJlY3QuaGVpZ2h0K2NvbnRyb2wubWFyZ2luLnRvcCtjb250cm9sLm1hcmdpbi5ib3R0b20pKSAvIDIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gQGN5ICsgY29udHJvbC5tYXJnaW4udG9wXG4gICAgIFxuICAgICMjIypcbiAgICAqIExheW91dHMgdGhlIHNwZWNpZmllZCBjb250cm9sIGFzIGZpeGVkLXNpemUgY29udHJvbCBmb3IgYSB2ZXJ0aWNhbCBzdGFjay1sYXlvdXQuIFxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlQ29udHJvbFJlY3RGaXhlZFZcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdXBkYXRlLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgXG4gICAgdXBkYXRlQ29udHJvbFJlY3RGaXhlZFY6IChjb250cm9sKSAtPlxuICAgICAgICByZWN0ID0gQG9iamVjdC5kc3RSZWN0XG4gICAgICAgIGlmIGNvbnRyb2wuYWxpZ25tZW50WSA9PSAwXG4gICAgICAgICAgICBAY3kgKz0gY29udHJvbC5tYXJnaW4udG9wXG4gICAgICAgICAgICBjb250cm9sLmRzdFJlY3QueSA9IEBjeVxuICAgICAgICAgICAgQGN5ICs9IGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQgKyBjb250cm9sLm1hcmdpbi5ib3R0b21cbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gQGN4ICsgY29udHJvbC5tYXJnaW4ubGVmdFxuICAgICAgICBlbHNlIGlmIGNvbnRyb2wuYWxpZ25tZW50WSA9PSAyXG4gICAgICAgICAgICBAYm90dG9tICs9IGNvbnRyb2wubWFyZ2luLmJvdHRvbVxuICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnkgPSAocmVjdC5oZWlnaHQpIC0gY29udHJvbC5kc3RSZWN0LmhlaWdodCAtIEBib3R0b21cbiAgICAgICAgICAgIEBib3R0b20gKz0gY29udHJvbC5kc3RSZWN0LmhlaWdodCArIGNvbnRyb2wubWFyZ2luLnRvcFxuICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnggPSBAY3ggKyBjb250cm9sLm1hcmdpbi5sZWZ0XG4gICAgICAgIGVsc2UgaWYgY29udHJvbC5hbGlnbm1lbnRZID09IDFcbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gQGNlbnRlciArIChyZWN0LmhlaWdodCAtIEBjZW50ZXJTaXplKSAvIDJcbiAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gQGN4ICsgY29udHJvbC5tYXJnaW4ubGVmdFxuICAgICAgICAgICAgQGNlbnRlciArPSBjb250cm9sLmRzdFJlY3QuaGVpZ2h0ICsgY29udHJvbC5tYXJnaW4uYm90dG9tXG4gICAgICAgIGlmIGNvbnRyb2wuYWxpZ25tZW50WCA9PSAxXG4gICAgICAgICAgICBjb250cm9sLmRzdFJlY3QueCA9IEBjeCArIE1hdGgucm91bmQoKHJlY3Qud2lkdGgtY29udHJvbC5kc3RSZWN0LndpZHRoKSAvIDIpXG4gICAgIFxuICAgICMjIypcbiAgICAqIExheW91dHMgdGhlIHNwZWNpZmllZCBjb250cm9sIGFzIHJlc2l6YWJsZS1jb250cm9sIGZvciBhIGhvcml6b250YWwgc3RhY2stbGF5b3V0LiBcbiAgICAqIFRoYXQgbWVhbnMgdGhlIGNvbnRyb2wgd2lsbCB0YWtlIHVwIGFsbCBmcmVlIHNwYWNlIGFmdGVyIHN1YnRyYWN0aW5nIGFsbCBcbiAgICAqIGZpeGVkLXNpemUgY29udHJvbHMuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVDb250cm9sUmVjdFJlc2l6YWJsZUhcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdXBkYXRlLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgXG4gICAgdXBkYXRlQ29udHJvbFJlY3RSZXNpemFibGVIOiAoY29udHJvbCkgLT5cbiAgICAgICAgZHluYW1pY1NpemUgPSBAY2FsY3VsYXRlRHluYW1pY1NpemVIb3Jpem9udGFsKCkgXG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gY29udHJvbC5tYXJnaW4udG9wXG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQgPSBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0IC0gY29udHJvbC5tYXJnaW4uYm90dG9tIC0gY29udHJvbC5tYXJnaW4udG9wXG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gQGN4ICsgY29udHJvbC5tYXJnaW4ubGVmdFxuICAgICAgICBjb250cm9sLmRzdFJlY3Qud2lkdGggPSBkeW5hbWljU2l6ZSAtIGNvbnRyb2wubWFyZ2luLnJpZ2h0IC0gY29udHJvbC5tYXJnaW4ubGVmdFxuICAgICAgICBAY3ggKz0gZHluYW1pY1NpemVcbiAgICBcbiAgICAjIyMqXG4gICAgKiBMYXlvdXRzIHRoZSBzcGVjaWZpZWQgY29udHJvbCBhcyByZXNpemFibGUtY29udHJvbCBmb3IgYSB2ZXJ0aWNhbCBzdGFjay1sYXlvdXQuIFxuICAgICogVGhhdCBtZWFucyB0aGUgY29udHJvbCB3aWxsIHRha2UgdXAgYWxsIGZyZWUgc3BhY2UgYWZ0ZXIgc3VidHJhY3RpbmcgYWxsIFxuICAgICogZml4ZWQtc2l6ZSBjb250cm9scy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUNvbnRyb2xSZWN0UmVzaXphYmxlVlxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gY29udHJvbCBUaGUgY29udHJvbCB0byB1cGRhdGUuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIHVwZGF0ZUNvbnRyb2xSZWN0UmVzaXphYmxlVjogKGNvbnRyb2wpIC0+XG4gICAgICAgIGR5bmFtaWNTaXplID0gQGNhbGN1bGF0ZUR5bmFtaWNTaXplVmVydGljYWwoKVxuICAgICAgICBjb250cm9sLmRzdFJlY3QueCA9IGNvbnRyb2wubWFyZ2luLmxlZnRcbiAgICAgICAgY29udHJvbC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5kc3RSZWN0LndpZHRoIC0gY29udHJvbC5tYXJnaW4ucmlnaHQgLSBjb250cm9sLm1hcmdpbi5sZWZ0XG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gQGN5ICsgY29udHJvbC5tYXJnaW4udG9wXG4gICAgICAgIGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQgPSBkeW5hbWljU2l6ZSAtIGNvbnRyb2wubWFyZ2luLmJvdHRvbSAtIGNvbnRyb2wubWFyZ2luLnRvcFxuICAgICAgICBAY3kgKz0gZHluYW1pY1NpemVcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGEgY29udHJvbC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUNvbnRyb2xcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdXBkYXRlLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICB1cGRhdGVDb250cm9sOiAoY29udHJvbCkgLT5cbiAgICAgICAgaWYgQG9yaWVudGF0aW9uID09IDFcbiAgICAgICAgICAgIGlmIG5vdCBjb250cm9sLmNsaXBSZWN0PyB0aGVuIGNvbnRyb2wuY2xpcFJlY3QgPSBAb2JqZWN0LmNsaXBSZWN0XG4gICAgICAgICAgICBpZiB5ZXMgIyFjb250cm9sLnVwZGF0ZWQgb3IgKFJlY3QuaW50ZXJzZWN0KGNvbnRyb2wuZHN0UmVjdC54K0BvYmplY3QuZHN0UmVjdC54LCBjb250cm9sLmRzdFJlY3QueSsgQG9iamVjdC5kc3RSZWN0LnksIGNvbnRyb2wuZHN0UmVjdC53aWR0aCwgY29udHJvbC5kc3RSZWN0LmhlaWdodCwgQG9iamVjdC5kc3RSZWN0LngsIEBvYmplY3QuZHN0UmVjdC55LCBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQpKVxuICAgICAgICAgICAgICAgIGlmIGNvbnRyb2wubmVlZHNVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbC5uZWVkc1VwZGF0ZSA9IG5vXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wudXBkYXRlKClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29udHJvbC51cGRhdGVkID0geWVzXG4gICAgICAgICAgICAgICAgY29udHJvbC52aXNpYmxlID0geWVzXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgY29udHJvbC52aXNpYmxlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wudmlzaWJsZSA9IG5vXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2wudXBkYXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3VwZXIoY29udHJvbClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogTGF5b3V0cyB0aGUgc3ViLW9iamVjdHMgaG9yaXpvbnRhbGx5LlxuICAgICpcbiAgICAqIEBtZXRob2QgbGF5b3V0SG9yaXpvbnRhbFxuICAgICMjIyBcbiAgICBsYXlvdXRIb3Jpem9udGFsOiAtPlxuICAgICAgICBAYm90dG9tID0gMFxuICAgICAgICBAY2VudGVyID0gMFxuICAgICAgICBAY2VudGVyU2l6ZSA9IDBcbiAgICAgICAgQG9mZnNldCA9IChAb2JqZWN0Lmxpc3RPZmZzZXR8fDApXG4gICAgICAgIEBjb3VudCA9IEBvYmplY3Quc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgQGN4ID0gMFxuICAgICAgICBAY3kgPSAwXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgQHNpemVUb0ZpdEhvcml6b250YWwoKVxuICAgICAgICBcbiAgICAgICAgaSA9IEBvZmZzZXRcbiAgICAgICAgd2hpbGUgaSA8IEBvYmplY3Quc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGNvbnRyb2wgPSBAb2JqZWN0LnN1Yk9iamVjdHNbaV1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHVwZGF0ZUNvbnRyb2woY29udHJvbClcblxuICAgICAgICAgICAgaWYgY29udHJvbC5kaXNwb3NlZFxuICAgICAgICAgICAgICAgIEBvYmplY3QucmVtb3ZlT2JqZWN0KGNvbnRyb2wpXG4gICAgICAgICAgICAgICAgaS0tXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaWYgY29udHJvbC5yZXNpemFibGUgYW5kICFjb250cm9sLnNpemVUb0ZpdFxuICAgICAgICAgICAgICAgICAgICBAdXBkYXRlQ29udHJvbFJlY3RSZXNpemFibGVIKGNvbnRyb2wpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAdXBkYXRlQ29udHJvbFJlY3RGaXhlZEgoY29udHJvbClcbiAgICAgICAgICAgIGkrKyAgICBcbiAgICAgICAgQG9iamVjdC5jbGlwUmVjdD8uc2V0KEBvYmplY3QuZHN0UmVjdC54ICsgQG9iamVjdC5vcmlnaW4ueCwgQG9iamVjdC5kc3RSZWN0LnkgKyBAb2JqZWN0Lm9yaWdpbi55LCBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQpICBcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBMYXlvdXRzIHRoZSBzdWItb2JqZWN0cyB2ZXJ0aWNhbGx5LlxuICAgICpcbiAgICAqIEBtZXRob2QgbGF5b3V0VmVydGljYWxcbiAgICAjIyMgICAgICAgICAgIFxuICAgIGxheW91dFZlcnRpY2FsOiAtPlxuICAgICAgICBAYm90dG9tID0gMFxuICAgICAgICBAY2VudGVyID0gMFxuICAgICAgICBAY2VudGVyU2l6ZSA9IDBcbiAgICAgICAgQG9mZnNldCA9IChAb2JqZWN0Lmxpc3RPZmZzZXR8fDApXG4gICAgICAgIEBjb3VudCA9IEBvYmplY3Quc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgQGN4ID0gMFxuICAgICAgICBAY3kgPSAwXG4gICAgICAgIFxuICAgICAgICBAY3kgLT0gQG9iamVjdC5zY3JvbGxPZmZzZXRZXG4gICAgICAgIGkgPSBAb2Zmc2V0XG4gICAgICAgIGN1cnJlbnRZID0gMFxuICAgICAgICBcbiAgICAgICAgd2hpbGUgaSA8IEBvYmplY3Quc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGNvbnRyb2wgPSBAb2JqZWN0LnN1Yk9iamVjdHNbaV1cbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgY29udGludWUgdW5sZXNzIGNvbnRyb2xcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHVwZGF0ZUNvbnRyb2woY29udHJvbClcbiBcbiAgICAgICAgICAgIGlmIGNvbnRyb2wuZGlzcG9zZWRcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnJlbW92ZU9iamVjdChjb250cm9sKVxuICAgICAgICAgICAgICAgIGktLVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIGNvbnRyb2wucmVzaXphYmxlIGFuZCAhY29udHJvbC5zaXplVG9GaXRcbiAgICAgICAgICAgICAgICAgICAgQHVwZGF0ZUNvbnRyb2xSZWN0UmVzaXphYmxlVihjb250cm9sKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQHVwZGF0ZUNvbnRyb2xSZWN0Rml4ZWRWKGNvbnRyb2wpXG4gICAgICAgICAgICBcbiAgICAgICAgQHNpemVUb0ZpdFZlcnRpY2FsKCkgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3QuY2xpcFJlY3Q/LnNldChAb2JqZWN0LmRzdFJlY3QueCArIEBvYmplY3Qub3JpZ2luLngsIEBvYmplY3QuZHN0UmVjdC55ICsgQG9iamVjdC5vcmlnaW4ueSwgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0KSAgXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGwgICAgXG5ncy5Db21wb25lbnRfU3RhY2tMYXlvdXRCZWhhdmlvciA9IENvbXBvbmVudF9TdGFja0xheW91dEJlaGF2aW9yIl19
//# sourceURL=Component_StackLayoutBehavior_85.js