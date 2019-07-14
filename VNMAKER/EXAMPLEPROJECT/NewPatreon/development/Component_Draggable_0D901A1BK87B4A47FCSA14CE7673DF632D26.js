var Component_Draggable,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Draggable = (function(superClass) {
  extend(Component_Draggable, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Draggable.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * Makes a game object draggable using mouse/touch. The dragging can be
  * vertical, horizontal or both. It can be configured as pixel-wise or 
  * step-wise dragging. For example: To create a slider for UI with
  * fixed steps, step-wise is useful while a pixel-wise dragging could
  * be used for a volume-slider.
  *
  * @module gs
  * @class Component_Draggable
  * @extends gs.Component
  * @memberof gs
  * @constructor
   */

  function Component_Draggable() {

    /**
    * Mouse/Pointer x coordinate
    * @property mx
    * @type number
     */
    this.mx = 0;

    /**
    * Mouse/Pointer y coordinate
    * @property my
    * @type number
     */
    this.my = 0;

    /**
    * Stepping in pixels.
    * @property stepSize
    * @type gs.Point
     */
    this.stepSize = {
      x: 0,
      y: 0
    };

    /**
    * Drag Area
    * @property rect
    * @type gs.Rect
     */
    this.rect = null;
  }


  /**
  * Adds event-handler for mouse/touch events to update the component only if 
  * a user-action happened.
  *
  * @method setupEventHandlers
   */

  Component_Draggable.prototype.setupEventHandlers = function() {
    gs.GlobalEventManager.on("mouseMoved", ((function(_this) {
      return function() {
        var rect, ref, x, y;
        rect = (ref = _this.object.draggable) != null ? ref.rect : void 0;
        x = Input.Mouse.x - _this.object.origin.x;
        y = Input.Mouse.y - _this.object.origin.y;
        if (_this.object.dragging || rect.contains(x, y)) {
          return _this.object.needsUpdate = true;
        }
      };
    })(this)), null, this.object);
    return gs.GlobalEventManager.on("mouseDown", ((function(_this) {
      return function() {
        var rect, ref, x, y;
        rect = (ref = _this.object.draggable) != null ? ref.rect : void 0;
        x = Input.Mouse.x - _this.object.origin.x;
        y = Input.Mouse.y - _this.object.origin.y;
        if (rect.contains(x, y)) {
          return _this.object.needsUpdate = true;
        }
      };
    })(this)), null, this.object);
  };


  /**
  * Initializes the component. Adds event-handler for mouse/touch events to
  * update the component only if a user-action happened.
  *
  * @method setup
   */

  Component_Draggable.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Disposes the component.
  *
  * @method dispose
   */

  Component_Draggable.prototype.dispose = function() {
    Component_Draggable.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("mouseDown", this.object);
    return gs.GlobalEventManager.offByOwner("mouseMoved", this.object);
  };


  /**
  * Updates the dragging-process on x-axis if configured.
  *
  * @method updateAxisX
  * @protected
   */

  Component_Draggable.prototype.updateAxisX = function() {
    var ref;
    if ((ref = this.object.draggable.axisX) != null ? ref : true) {
      if (this.object.dragging) {
        this.object.draggable.step = Math.round(Math.max(this.rect.x, Math.min(this.mx - this.object.dstRect.width / 2, this.rect.x + this.rect.width - this.object.dstRect.width)) / this.stepSize.x);
        return this.object.dstRect.x = this.object.draggable.step * this.stepSize.x;
      } else if (this.object.draggable.steps != null) {
        return this.object.dstRect.x = this.object.draggable.step * this.stepSize.x;
      }
    }
  };


  /**
  * Updates the dragging-process on y-axis if configured.
  *
  * @method updateAxisY
  * @protected
   */

  Component_Draggable.prototype.updateAxisY = function() {
    var ref;
    if ((ref = this.object.draggable.axisY) != null ? ref : true) {
      if (this.object.dragging) {
        this.object.draggable.step = Math.round(Math.max(this.rect.y, Math.min(this.my - this.object.dstRect.height / 2, this.rect.y + this.rect.height - this.object.dstRect.height)) / this.stepSize.y);
        return this.object.dstRect.y = this.object.draggable.step * this.stepSize.y;
      } else if (this.object.draggable.steps != null) {
        return this.object.dstRect.y = this.object.draggable.step * this.stepSize.y;
      }
    }
  };


  /**
  * Calculates the size of a single step if steps are configured for this
  * component. Otherwise the step-size 1-pixel.
  *
  * @method updateDragging
  * @protected
   */

  Component_Draggable.prototype.updateStepSize = function() {
    if (this.object.draggable.steps != null) {
      this.stepSize.x = (this.rect.width - this.object.dstRect.width) / (this.object.draggable.steps - 1);
      return this.stepSize.y = (this.rect.height - this.object.dstRect.height) / (this.object.draggable.steps - 1);
    } else {
      this.stepSize.x = 1;
      return this.stepSize.y = 1;
    }
  };


  /**
  * Updates the game object's dragging-state and fires a dragged-event
  * if necessary.
  *
  * @method updateDragging
  * @protected
   */

  Component_Draggable.prototype.updateDragging = function() {
    var pressed, ref, ref1, x, y;
    if (this.object.focusable && !this.object.ui.focused) {
      return;
    }
    x = Input.Mouse.x - this.object.origin.x;
    y = Input.Mouse.y - this.object.origin.y;
    pressed = Input.Mouse.buttons[Input.Mouse.LEFT] === 1;
    if ((this.mx !== x || this.my !== y) && pressed && this.rect.contains(x, y)) {
      if (!this.object.dragging) {
        this.object.dragging = true;
        if ((ref = this.object.events) != null) {
          ref.emit("dragStart", this.object);
        }
      }
      this.object.events.emit("drag", this.object);
    } else if (Input.Mouse.buttons[Input.Mouse.LEFT] === 2 || Input.Mouse.buttons[Input.Mouse.LEFT] === 0) {
      if (this.object.dragging) {
        this.object.dragging = false;
        if ((ref1 = this.object.events) != null) {
          ref1.emit("dragEnd", this.object);
        }
      }
    }
    this.mx = x;
    return this.my = y;
  };


  /**
  * Updates the dragging-logic.
  *
  * @method update
   */

  Component_Draggable.prototype.update = function() {
    var ref;
    this.rect = ((ref = this.object.draggable) != null ? ref.rect : void 0) || this.object.dstRect;
    this.updateStepSize();
    this.updateDragging();
    this.updateAxisX();
    return this.updateAxisY();
  };

  return Component_Draggable;

})(gs.Component);

ui.Draggable = Component_Draggable;

ui.Component_Draggable = Component_Draggable;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsbUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O2dDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7Ozs7RUFhYSw2QkFBQTs7QUFDVDs7Ozs7SUFLQSxJQUFDLENBQUEsRUFBRCxHQUFNOztBQUVOOzs7OztJQUtBLElBQUMsQ0FBQSxFQUFELEdBQU07O0FBRU47Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUFFLENBQUEsRUFBRyxDQUFMO01BQVEsQ0FBQSxFQUFHLENBQVg7OztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxJQUFELEdBQVE7RUEzQkM7OztBQTZCYjs7Ozs7OztnQ0FNQSxrQkFBQSxHQUFvQixTQUFBO0lBQ2hCLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUF0QixDQUF5QixZQUF6QixFQUF1QyxDQUFFLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtBQUNyQyxZQUFBO1FBQUEsSUFBQSwrQ0FBd0IsQ0FBRTtRQUMxQixDQUFBLEdBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ25DLENBQUEsR0FBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbkMsSUFBRyxLQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsSUFBb0IsSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQXZCO2lCQUNJLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixLQUQxQjs7TUFKcUM7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUYsQ0FBdkMsRUFNRyxJQU5ILEVB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LEdBQW1COztjQUNMLENBQUUsSUFBaEIsQ0FBcUIsU0FBckIsRUFBZ0MsSUFBQyxDQUFBLE1BQWpDO1NBRko7T0FEQzs7SUFLTCxJQUFDLENBQUEsRUFBRCxHQUFNO1dBQ04sSUFBQyxDQUFBLEVBQUQsR0FBTTtFQWxCTTs7O0FBb0JoQjs7Ozs7O2dDQUtBLE1BQUEsR0FBUSxTQUFBO0FBQ0osUUFBQTtJQUFBLElBQUMsQ0FBQSxJQUFELCtDQUF5QixDQUFFLGNBQW5CLElBQTJCLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDM0MsSUFBQyxDQUFBLGNBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxjQUFELENBQUE7SUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtFQUxJOzs7O0dBNUtzQixFQUFFLENBQUM7O0FBd0xyQyxFQUFFLENBQUMsU0FBSCxHQUFlOztBQUNmLEVBQUUsQ0FBQyxtQkFBSCxHQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0RyYWdnYWJsZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0RyYWdnYWJsZSBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICogXG4gICAgKiBAbWV0aG9kIG9uRGF0YUJ1bmRsZVJlc3RvcmUuXG4gICAgKiBAcGFyYW0gT2JqZWN0IGRhdGEgLSBUaGUgZGF0YS1idW5kbGVcbiAgICAqIEBwYXJhbSBncy5PYmplY3RDb2RlY0NvbnRleHQgY29udGV4dCAtIFRoZSBjb2RlYy1jb250ZXh0LlxuICAgICMjI1xuICAgIG9uRGF0YUJ1bmRsZVJlc3RvcmU6IChkYXRhLCBjb250ZXh0KSAtPlxuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogTWFrZXMgYSBnYW1lIG9iamVjdCBkcmFnZ2FibGUgdXNpbmcgbW91c2UvdG91Y2guIFRoZSBkcmFnZ2luZyBjYW4gYmVcbiAgICAqIHZlcnRpY2FsLCBob3Jpem9udGFsIG9yIGJvdGguIEl0IGNhbiBiZSBjb25maWd1cmVkIGFzIHBpeGVsLXdpc2Ugb3IgXG4gICAgKiBzdGVwLXdpc2UgZHJhZ2dpbmcuIEZvciBleGFtcGxlOiBUbyBjcmVhdGUgYSBzbGlkZXIgZm9yIFVJIHdpdGhcbiAgICAqIGZpeGVkIHN0ZXBzLCBzdGVwLXdpc2UgaXMgdXNlZnVsIHdoaWxlIGEgcGl4ZWwtd2lzZSBkcmFnZ2luZyBjb3VsZFxuICAgICogYmUgdXNlZCBmb3IgYSB2b2x1bWUtc2xpZGVyLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfRHJhZ2dhYmxlXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBNb3VzZS9Qb2ludGVyIHggY29vcmRpbmF0ZVxuICAgICAgICAqIEBwcm9wZXJ0eSBteFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQG14ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIE1vdXNlL1BvaW50ZXIgeSBjb29yZGluYXRlXG4gICAgICAgICogQHByb3BlcnR5IG15XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAbXkgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RlcHBpbmcgaW4gcGl4ZWxzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzdGVwU2l6ZVxuICAgICAgICAqIEB0eXBlIGdzLlBvaW50XG4gICAgICAgICMjI1xuICAgICAgICBAc3RlcFNpemUgPSB7IHg6IDAsIHk6IDAgfVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIERyYWcgQXJlYVxuICAgICAgICAqIEBwcm9wZXJ0eSByZWN0XG4gICAgICAgICogQHR5cGUgZ3MuUmVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQHJlY3QgPSBudWxsXG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVyIGZvciBtb3VzZS90b3VjaCBldmVudHMgdG8gdXBkYXRlIHRoZSBjb21wb25lbnQgb25seSBpZiBcbiAgICAqIGEgdXNlci1hY3Rpb24gaGFwcGVuZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyMgXG4gICAgc2V0dXBFdmVudEhhbmRsZXJzOiAtPlxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZU1vdmVkXCIsICggPT5cbiAgICAgICAgICAgIHJlY3QgPSBAb2JqZWN0LmRyYWdnYWJsZT8ucmVjdFxuICAgICAgICAgICAgeCA9IElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54XG4gICAgICAgICAgICB5ID0gSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnlcbiAgICAgICAgICAgIGlmIEBvYmplY3QuZHJhZ2dpbmcgb3IgcmVjdC5jb250YWlucyh4LCB5KVxuICAgICAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgKSwgbnVsbCwgQG9iamVjdFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZURvd25cIiwoID0+XG4gICAgICAgICAgICByZWN0ID0gQG9iamVjdC5kcmFnZ2FibGU/LnJlY3RcbiAgICAgICAgICAgIHggPSBJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueFxuICAgICAgICAgICAgeSA9IElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55XG4gICAgICAgICAgICBpZiByZWN0LmNvbnRhaW5zKHgsIHkpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICApLCBudWxsLCBAb2JqZWN0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBjb21wb25lbnQuIEFkZHMgZXZlbnQtaGFuZGxlciBmb3IgbW91c2UvdG91Y2ggZXZlbnRzIHRvXG4gICAgKiB1cGRhdGUgdGhlIGNvbXBvbmVudCBvbmx5IGlmIGEgdXNlci1hY3Rpb24gaGFwcGVuZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjIyAgICBcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIGNvbXBvbmVudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZURvd25cIiwgQG9iamVjdClcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZU1vdmVkXCIsIEBvYmplY3QpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGRyYWdnaW5nLXByb2Nlc3Mgb24geC1heGlzIGlmIGNvbmZpZ3VyZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVBeGlzWFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgICAgIFxuICAgIHVwZGF0ZUF4aXNYOiAtPlxuICAgICAgICBpZiAoQG9iamVjdC5kcmFnZ2FibGUuYXhpc1ggPyB5ZXMpXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmRyYWdnaW5nXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kcmFnZ2FibGUuc3RlcCA9IE1hdGgucm91bmQoTWF0aC5tYXgoQHJlY3QueCwgTWF0aC5taW4oKEBteCAtIEBvYmplY3QuZHN0UmVjdC53aWR0aCAvIDIpLCBAcmVjdC54K0ByZWN0LndpZHRoLUBvYmplY3QuZHN0UmVjdC53aWR0aCkpIC8gQHN0ZXBTaXplLngpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnggPSBAb2JqZWN0LmRyYWdnYWJsZS5zdGVwICogQHN0ZXBTaXplLnhcbiAgICAgICAgICAgIGVsc2UgaWYgQG9iamVjdC5kcmFnZ2FibGUuc3RlcHM/XG4gICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LnggPSBAb2JqZWN0LmRyYWdnYWJsZS5zdGVwICogQHN0ZXBTaXplLnhcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBkcmFnZ2luZy1wcm9jZXNzIG9uIHktYXhpcyBpZiBjb25maWd1cmVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlQXhpc1lcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgICAgICBcbiAgICB1cGRhdGVBeGlzWTogLT5cbiAgICAgICAgaWYgKEBvYmplY3QuZHJhZ2dhYmxlLmF4aXNZID8geWVzKVxuICAgICAgICAgICAgaWYgQG9iamVjdC5kcmFnZ2luZ1xuICAgICAgICAgICAgICAgIEBvYmplY3QuZHJhZ2dhYmxlLnN0ZXAgPSBNYXRoLnJvdW5kKE1hdGgubWF4KEByZWN0LnksIE1hdGgubWluKChAbXkgLSBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0IC8gMiksIEByZWN0LnkrQHJlY3QuaGVpZ2h0LUBvYmplY3QuZHN0UmVjdC5oZWlnaHQpKSAvIEBzdGVwU2l6ZS55KVxuICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC55ID0gQG9iamVjdC5kcmFnZ2FibGUuc3RlcCAqIEBzdGVwU2l6ZS55XG4gICAgICAgICAgICBlbHNlIGlmIEBvYmplY3QuZHJhZ2dhYmxlLnN0ZXBzP1xuICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC55ID0gQG9iamVjdC5kcmFnZ2FibGUuc3RlcCAqIEBzdGVwU2l6ZS55XG4gICAgXG4gICAgIyMjKlxuICAgICogQ2FsY3VsYXRlcyB0aGUgc2l6ZSBvZiBhIHNpbmdsZSBzdGVwIGlmIHN0ZXBzIGFyZSBjb25maWd1cmVkIGZvciB0aGlzXG4gICAgKiBjb21wb25lbnQuIE90aGVyd2lzZSB0aGUgc3RlcC1zaXplIDEtcGl4ZWwuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVEcmFnZ2luZ1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgIFxuICAgIHVwZGF0ZVN0ZXBTaXplOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmRyYWdnYWJsZS5zdGVwcz9cbiAgICAgICAgICAgIEBzdGVwU2l6ZS54ID0gKEByZWN0LndpZHRoLUBvYmplY3QuZHN0UmVjdC53aWR0aCkgLyAoQG9iamVjdC5kcmFnZ2FibGUuc3RlcHMtMSlcbiAgICAgICAgICAgIEBzdGVwU2l6ZS55ID0gKEByZWN0LmhlaWdodC1Ab2JqZWN0LmRzdFJlY3QuaGVpZ2h0KSAvIChAb2JqZWN0LmRyYWdnYWJsZS5zdGVwcy0xKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc3RlcFNpemUueCA9IDFcbiAgICAgICAgICAgIEBzdGVwU2l6ZS55ID0gMVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGdhbWUgb2JqZWN0J3MgZHJhZ2dpbmctc3RhdGUgYW5kIGZpcmVzIGEgZHJhZ2dlZC1ldmVudFxuICAgICogaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlRHJhZ2dpbmdcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIHVwZGF0ZURyYWdnaW5nOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmZvY3VzYWJsZSBhbmQgIUBvYmplY3QudWkuZm9jdXNlZCB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgeCA9IElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54XG4gICAgICAgIHkgPSBJbnB1dC5Nb3VzZS55IC0gQG9iamVjdC5vcmlnaW4ueVxuICAgICAgICBwcmVzc2VkID0gSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAxXG4gICAgICAgIFxuICAgICAgICBpZiAoQG14ICE9IHggb3IgQG15ICE9IHkpIGFuZCBwcmVzc2VkIGFuZCBAcmVjdC5jb250YWlucyh4LCB5KVxuICAgICAgICAgICAgaWYgIUBvYmplY3QuZHJhZ2dpbmdcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmRyYWdnaW5nID0geWVzXG4gICAgICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJkcmFnU3RhcnRcIiwgQG9iamVjdClcbiAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzLmVtaXQoXCJkcmFnXCIsIEBvYmplY3QpXG4gICAgICAgIGVsc2UgaWYgSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyIG9yIElucHV0Lk1vdXNlLmJ1dHRvbnNbSW5wdXQuTW91c2UuTEVGVF0gPT0gMFxuICAgICAgICAgICAgaWYgQG9iamVjdC5kcmFnZ2luZ1xuICAgICAgICAgICAgICAgIEBvYmplY3QuZHJhZ2dpbmcgPSBub1xuICAgICAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzPy5lbWl0KFwiZHJhZ0VuZFwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAbXggPSB4XG4gICAgICAgIEBteSA9IHlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgZHJhZ2dpbmctbG9naWMuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgQHJlY3QgPSBAb2JqZWN0LmRyYWdnYWJsZT8ucmVjdCB8fCBAb2JqZWN0LmRzdFJlY3QgXG4gICAgICAgIEB1cGRhdGVTdGVwU2l6ZSgpXG4gICAgICAgIEB1cGRhdGVEcmFnZ2luZygpXG4gICAgICAgIEB1cGRhdGVBeGlzWCgpXG4gICAgICAgIEB1cGRhdGVBeGlzWSgpXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbnVpLkRyYWdnYWJsZSA9IENvbXBvbmVudF9EcmFnZ2FibGVcbnVpLkNvbXBvbmVudF9EcmFnZ2FibGUgPSBDb21wb25lbnRfRHJhZ2dhYmxlIl19
//# sourceURL=Component_Draggable_40.js