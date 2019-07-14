var Component_DataGridBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_DataGridBehavior = (function(superClass) {
  var DataSource, DataWrapper;

  extend(Component_DataGridBehavior, superClass);

  DataWrapper = (function() {
    function DataWrapper(data) {
      this.data = data;
      this.viewData = [true, false, false, true, false];
    }

    return DataWrapper;

  })();

  DataSource = (function() {
    function DataSource(source) {
      var i, k, ref;
      this.source = source || [];
      this.length = this.source.length;
      this.wrappedSource = new Array(this.source.length);
      for (i = k = 0, ref = this.wrappedSource.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        this.wrappedSource[i] = null;
      }
    }

    DataSource.prototype.set = function(source) {
      var i, k, ref, results;
      this.source = source || [];
      this.length = this.source.length;
      this.wrappedSource = new Array(this.source.length);
      results = [];
      for (i = k = 0, ref = this.wrappedSource.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        results.push(this.wrappedSource[i] = null);
      }
      return results;
    };

    DataSource.prototype.itemAt = function(index) {
      var item;
      item = this.wrappedSource[index];
      if (!item) {
        item = new DataWrapper(this.source[index]);
        this.wrappedSource[index] = item;
      }
      return item;
    };

    DataSource.prototype.setItemAt = function(index, data) {
      if (this.wrappedSource[index]) {
        this.wrappedSource[index].data = data;
      }
      return this.source[index] = data;
    };

    return DataSource;

  })();

  Component_DataGridBehavior.accessors("dataSource", {
    set: function(v) {
      if (v !== this.dataSource_.source) {
        this.dataSource_.set(v);
        return this.resize();
      }
    },
    get: function() {
      return this.dataSource_;
    }
  });


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_DataGridBehavior.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * The data-grid behavior component defines the logic for a data-grid. A data-grid
  * allows to display items from a associated data-source using a specified
  * item-template. Unlike a stack-layout, a data-grid is optimized to display even high amounts of items but they all
  * need to use the same item-template with same size.
  *
  * @module ui
  * @class Component_DataGridBehavior
  * @extends gs.Component_Visual
  * @memberof ui
  * @constructor
  * @params {Object} params - The params-object containing the data-grid settings.
   */

  function Component_DataGridBehavior(params) {
    Component_DataGridBehavior.__super__.constructor.call(this);
    this.params = params || {};

    /**
    * The item-template descriptor used for each item of the data-grid.
    * @property template
    * @type Object
     */
    this.template = this.params.template;

    /**
    * The data-source used for the data-grid. Can be an array or a formula.
    * @property dataSource
    * @type Object[]|string
     */
    this.dataSource_ = null;

    /**
    * Stores the item-objects needed for rendering. They are created from the item-template.
    * @property items
    * @protected
    * @type gs.Object_Base[]
     */
    this.items = this.params.items || [];

    /**
    * Numbers of columns.
    * @property columns
    * @type number
     */
    this.columns = this.params.columns || 1;

    /**
    * Indicates if the data-grid is initialized and ready for rendering.
    * @property initialized
    * @protected
    * @type boolean
     */
    this.initialized = false;

    /**
    * Defines a horizontal and vertical spacing between items.
    * @property spacing
    * @default [0, 10]        
    * @type number[]
     */
    this.spacing = this.params.spacing || [0, 0];
  }


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_DataGridBehavior.prototype.setupEventHandlers = function() {
    return gs.GlobalEventManager.on("mouseWheel", (function(_this) {
      return function() {
        var r;
        r = _this.object.dstRect;
        if (Rect.contains(r.x, r.y, r.width, r.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y)) {
          return _this.updateScroll();
        }
      };
    })(this));
  };


  /**
  * Sets up the data-grid.
  *
  * @method setup
   */

  Component_DataGridBehavior.prototype.setup = function() {
    var item;
    if (this.object.dstRect.width === 1) {
      return;
    }
    this.initialized = true;
    if (!this.template.size) {
      item = ui.UIManager.createControlFromDescriptor(this.template.descriptor, this.object);
      item.index = 0;
      item.update();
      this.template.size = [item.dstRect.width, item.dstRect.height];
      item.dispose();
    }
    if (this.params.dataSource.exec) {
      this.dataSource_ = new DataSource(ui.Component_FormulaHandler.fieldValue(this.object, this.params.dataSource) || []);
    } else {
      this.dataSource_ = new DataSource(this.params.dataSource || []);
    }
    this.resize();
    this.setupEventHandlers();
    return Component_DataGridBehavior.__super__.setup.call(this);
  };


  /**
  * Updates scrolling.
  *
  * @method updateScroll
   */

  Component_DataGridBehavior.prototype.updateScroll = function() {
    this.object.scrollableHeight = Math.max(0, this.object.contentHeight - this.object.dstRect.height);
    if (Input.Mouse.wheel <= -1) {
      this.object.scrollOffsetY = Math.max(this.object.scrollOffsetY - Input.Mouse.wheelSpeed * 0.1, 0);
    }
    if (Input.Mouse.wheel >= 1) {
      this.object.scrollOffsetY = Math.min(this.object.scrollOffsetY - Input.Mouse.wheelSpeed * 0.1, this.object.scrollableHeight);
    }
    return this.object.scrollOffsetY = Math.max(Math.min(this.object.scrollOffsetY, this.object.scrollableHeight), 0);
  };


  /**
  * Resizes the data-grid and creates the necessary display objects from the data-grid template.
  *
  * @method resize
   */

  Component_DataGridBehavior.prototype.resize = function() {
    var height, index, item, itemsX, itemsY, k, l, len, m, ref, ref1, ref2, totalItemsY, width, x, y;
    width = this.object.dstRect.width;
    height = this.object.dstRect.height;
    itemsX = this.columns || 1;
    itemsY = Math.ceil((height - this.spacing[1]) / (this.template.size[1] + this.spacing[1])) + this.columns + 1;
    totalItemsY = Math.ceil(this.dataSource.length / this.columns);
    ref = this.items;
    for (k = 0, len = ref.length; k < len; k++) {
      item = ref[k];
      if (item != null) {
        item.dispose();
      }
    }
    this.items = [];
    for (y = l = 0, ref1 = itemsY; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
      for (x = m = 0, ref2 = itemsX; 0 <= ref2 ? m < ref2 : m > ref2; x = 0 <= ref2 ? ++m : --m) {
        index = y * itemsX + x;
        if (index < this.dataSource.length) {
          item = ui.UIManager.createControlFromDescriptor(this.template.descriptor, this.object);
          item.data[0] = this.dataSource.itemAt(index).data;
          item.dstRect.x = this.spacing[0] + x * (this.template.size[0] + this.spacing[0]);
          item.dstRect.y = this.spacing[1] + y * (this.template.size[1] + this.spacing[1]);
          item.dstRect.width = this.template.size[0];
          item.dstRect.height = this.template.size[1];
          item.index = index;
          item.ui.viewData = this.dataSource.itemAt(index).viewData;
          this.items[item.index] = item;
          this.object.addObject(item);
        }
      }
    }
    this.object.scrollableHeight = this.spacing[1] + totalItemsY * (this.template.size[1] + this.spacing[1]) - height;
    this.object.scrollOffsetY = 0;
    return this.object.contentHeight = this.spacing[1] + totalItemsY * (this.template.size[1] + this.spacing[1]);
  };

  Component_DataGridBehavior.prototype.itemAtIndex = function(index) {
    return this.items.first(function(item) {
      return item.index === index;
    });
  };

  Component_DataGridBehavior.prototype.indexForItem = function(item) {
    return item.index;
  };


  /**
  * Updates the data-grid.
  *
  * @method update
   */

  Component_DataGridBehavior.prototype.update = function() {
    var column, i, item, itemIndex, itemsY, j, k, offset, ref, ref1, results, row, scrollOffset;
    Component_DataGridBehavior.__super__.update.call(this);
    if (!this.initialized) {
      this.setup();
    }
    scrollOffset = this.object.scrollOffsetY;
    offset = Math.floor(scrollOffset / (this.template.size[1] + this.spacing[1])) * this.columns;
    i = offset;
    itemIndex = 0;
    itemsY = Math.ceil((this.object.dstRect.height - this.spacing[1]) / (this.template.size[1] + this.spacing[1])) * this.columns + this.columns + 1;
    while (i < Math.min(offset + itemsY, this.dataSource.length)) {
      row = Math.floor(i / this.columns);
      column = i % this.columns;
      item = this.items[itemIndex];
      if (item) {
        item.data[0] = this.dataSource.itemAt(i).data;
        if (this.object.clipRect) {
          item.clipRect = this.object.clipRect;
        }
        item.index = i;
        item.ui.viewData = this.dataSource.itemAt(i).viewData;
        item.dstRect.x = this.spacing[0] + column * (this.template.size[0] + this.spacing[0]);
        item.dstRect.y = this.spacing[1] + (row - (offset / this.columns)) * (this.template.size[1] + this.spacing[1]) + (-scrollOffset % (this.template.size[1] + this.spacing[1]));
        item.visible = true;
        item.update();
        item.update();
        itemIndex++;
      }
      i++;
    }
    results = [];
    for (j = k = ref = itemIndex, ref1 = this.items.length; ref <= ref1 ? k < ref1 : k > ref1; j = ref <= ref1 ? ++k : --k) {
      if (this.items[j]) {
        this.items[j].visible = false;
        results.push(this.items[j].update());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Component_DataGridBehavior;

})(gs.Component_Visual);

ui.Component_DataGridBehavior = Component_DataGridBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsMEJBQUE7RUFBQTs7O0FBQU07QUFDRixNQUFBOzs7O0VBQU07SUFDVyxxQkFBQyxJQUFEO01BQ1QsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQyxJQUFELEVBQU0sS0FBTixFQUFVLEtBQVYsRUFBYyxJQUFkLEVBQW1CLEtBQW5CO0lBRkg7Ozs7OztFQUlYO0lBQ1csb0JBQUMsTUFBRDtBQUNULFVBQUE7TUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQUEsSUFBVTtNQUNwQixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUM7TUFDbEIsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFkO0FBQ3JCLFdBQWtDLG9HQUFsQztRQUFBLElBQUMsQ0FBQSxhQUFjLENBQUEsQ0FBQSxDQUFmLEdBQW9CO0FBQXBCO0lBSlM7O3lCQU1iLEdBQUEsR0FBSyxTQUFDLE1BQUQ7QUFDRCxVQUFBO01BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFBLElBQVU7TUFDcEIsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDO01BQ2xCLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBZDtBQUNyQjtXQUFrQyxvR0FBbEM7cUJBQUEsSUFBQyxDQUFBLGFBQWMsQ0FBQSxDQUFBLENBQWYsR0FBb0I7QUFBcEI7O0lBSkM7O3lCQU1MLE1BQUEsR0FBUSxTQUFDLEtBQUQ7QUFDSixVQUFBO01BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxhQUFjLENBQUEsS0FBQTtNQUN0QixJQUFHLENBQUMsSUFBSjtRQUNJLElBQUEsR0FBVyxJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsTUFB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PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9EYXRhR3JpZEJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfRGF0YUdyaWRCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICBjbGFzcyBEYXRhV3JhcHBlclxuICAgICAgICBjb25zdHJ1Y3RvcjogKGRhdGEpIC0+XG4gICAgICAgICAgICBAZGF0YSA9IGRhdGFcbiAgICAgICAgICAgIEB2aWV3RGF0YSA9IFt5ZXMsIG5vLCBubywgeWVzLCBub11cbiAgICBcbiAgICBjbGFzcyBEYXRhU291cmNlXG4gICAgICAgIGNvbnN0cnVjdG9yOiAoc291cmNlKSAtPlxuICAgICAgICAgICAgQHNvdXJjZSA9IHNvdXJjZSB8fCBbXVxuICAgICAgICAgICAgQGxlbmd0aCA9IEBzb3VyY2UubGVuZ3RoXG4gICAgICAgICAgICBAd3JhcHBlZFNvdXJjZSA9IG5ldyBBcnJheShAc291cmNlLmxlbmd0aClcbiAgICAgICAgICAgIEB3cmFwcGVkU291cmNlW2ldID0gbnVsbCBmb3IgaSBpbiBbMC4uQHdyYXBwZWRTb3VyY2UubGVuZ3RoXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBzZXQ6IChzb3VyY2UpIC0+XG4gICAgICAgICAgICBAc291cmNlID0gc291cmNlIHx8IFtdXG4gICAgICAgICAgICBAbGVuZ3RoID0gQHNvdXJjZS5sZW5ndGhcbiAgICAgICAgICAgIEB3cmFwcGVkU291cmNlID0gbmV3IEFycmF5KEBzb3VyY2UubGVuZ3RoKVxuICAgICAgICAgICAgQHdyYXBwZWRTb3VyY2VbaV0gPSBudWxsIGZvciBpIGluIFswLi5Ad3JhcHBlZFNvdXJjZS5sZW5ndGhdXG4gICAgICAgICAgICBcbiAgICAgICAgaXRlbUF0OiAoaW5kZXgpIC0+XG4gICAgICAgICAgICBpdGVtID0gQHdyYXBwZWRTb3VyY2VbaW5kZXhdXG4gICAgICAgICAgICBpZiAhaXRlbVxuICAgICAgICAgICAgICAgIGl0ZW0gPSBuZXcgRGF0YVdyYXBwZXIoQHNvdXJjZVtpbmRleF0pXG4gICAgICAgICAgICAgICAgQHdyYXBwZWRTb3VyY2VbaW5kZXhdID0gaXRlbVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICBcbiAgICAgICAgc2V0SXRlbUF0OihpbmRleCwgZGF0YSkgLT5cbiAgICAgICAgICAgIGlmIEB3cmFwcGVkU291cmNlW2luZGV4XVxuICAgICAgICAgICAgICAgIEB3cmFwcGVkU291cmNlW2luZGV4XS5kYXRhID0gZGF0YVxuICAgICAgICAgICAgQHNvdXJjZVtpbmRleF0gPSBkYXRhXG4gICAgICAgICAgICBcbiAgICBAYWNjZXNzb3JzIFwiZGF0YVNvdXJjZVwiLCBcbiAgICAgICAgc2V0OiAodikgLT5cbiAgICAgICAgICAgIGlmIHYgIT0gQGRhdGFTb3VyY2VfLnNvdXJjZVxuICAgICAgICAgICAgICAgIEBkYXRhU291cmNlXy5zZXQodilcbiAgICAgICAgICAgICAgICBAcmVzaXplKClcbiAgICAgICAgZ2V0OiAtPiBAZGF0YVNvdXJjZV9cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoaXMgb2JqZWN0IGluc3RhbmNlIGlzIHJlc3RvcmVkIGZyb20gYSBkYXRhLWJ1bmRsZS4gSXQgY2FuIGJlIHVzZWRcbiAgICAqIHJlLWFzc2lnbiBldmVudC1oYW5kbGVyLCBhbm9ueW1vdXMgZnVuY3Rpb25zLCBldGMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBUaGUgZGF0YS1ncmlkIGJlaGF2aW9yIGNvbXBvbmVudCBkZWZpbmVzIHRoZSBsb2dpYyBmb3IgYSBkYXRhLWdyaWQuIEEgZGF0YS1ncmlkXG4gICAgKiBhbGxvd3MgdG8gZGlzcGxheSBpdGVtcyBmcm9tIGEgYXNzb2NpYXRlZCBkYXRhLXNvdXJjZSB1c2luZyBhIHNwZWNpZmllZFxuICAgICogaXRlbS10ZW1wbGF0ZS4gVW5saWtlIGEgc3RhY2stbGF5b3V0LCBhIGRhdGEtZ3JpZCBpcyBvcHRpbWl6ZWQgdG8gZGlzcGxheSBldmVuIGhpZ2ggYW1vdW50cyBvZiBpdGVtcyBidXQgdGhleSBhbGxcbiAgICAqIG5lZWQgdG8gdXNlIHRoZSBzYW1lIGl0ZW0tdGVtcGxhdGUgd2l0aCBzYW1lIHNpemUuXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIENvbXBvbmVudF9EYXRhR3JpZEJlaGF2aW9yXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfVmlzdWFsXG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtcyB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1zLW9iamVjdCBjb250YWluaW5nIHRoZSBkYXRhLWdyaWQgc2V0dGluZ3MuXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChwYXJhbXMpIC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgQHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGl0ZW0tdGVtcGxhdGUgZGVzY3JpcHRvciB1c2VkIGZvciBlYWNoIGl0ZW0gb2YgdGhlIGRhdGEtZ3JpZC5cbiAgICAgICAgKiBAcHJvcGVydHkgdGVtcGxhdGVcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEB0ZW1wbGF0ZSA9IEBwYXJhbXMudGVtcGxhdGVcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZGF0YS1zb3VyY2UgdXNlZCBmb3IgdGhlIGRhdGEtZ3JpZC4gQ2FuIGJlIGFuIGFycmF5IG9yIGEgZm9ybXVsYS5cbiAgICAgICAgKiBAcHJvcGVydHkgZGF0YVNvdXJjZVxuICAgICAgICAqIEB0eXBlIE9iamVjdFtdfHN0cmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGRhdGFTb3VyY2VfID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyB0aGUgaXRlbS1vYmplY3RzIG5lZWRlZCBmb3IgcmVuZGVyaW5nLiBUaGV5IGFyZSBjcmVhdGVkIGZyb20gdGhlIGl0ZW0tdGVtcGxhdGUuXG4gICAgICAgICogQHByb3BlcnR5IGl0ZW1zXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAqIEB0eXBlIGdzLk9iamVjdF9CYXNlW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBpdGVtcyA9IEBwYXJhbXMuaXRlbXMgfHwgW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBOdW1iZXJzIG9mIGNvbHVtbnMuXG4gICAgICAgICogQHByb3BlcnR5IGNvbHVtbnNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb2x1bW5zID0gQHBhcmFtcy5jb2x1bW5zIHx8IDFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGRhdGEtZ3JpZCBpcyBpbml0aWFsaXplZCBhbmQgcmVhZHkgZm9yIHJlbmRlcmluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgaW5pdGlhbGl6ZWRcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQGluaXRpYWxpemVkID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBEZWZpbmVzIGEgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgc3BhY2luZyBiZXR3ZWVuIGl0ZW1zLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzcGFjaW5nXG4gICAgICAgICogQGRlZmF1bHQgWzAsIDEwXSAgICAgICAgXG4gICAgICAgICogQHR5cGUgbnVtYmVyW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBzcGFjaW5nID0gQHBhcmFtcy5zcGFjaW5nIHx8IFswLCAwXVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXJzIGZvciBtb3VzZS90b3VjaCBldmVudHNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIm1vdXNlV2hlZWxcIiwgPT5cbiAgICAgICAgICAgIHIgPSBAb2JqZWN0LmRzdFJlY3RcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgUmVjdC5jb250YWlucyhyLngsIHIueSwgci53aWR0aCwgci5oZWlnaHQsIElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54LCBJbnB1dC5Nb3VzZS55IC0gQG9iamVjdC5vcmlnaW4ueSlcbiAgICAgICAgICAgICAgICBAdXBkYXRlU2Nyb2xsKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRoZSBkYXRhLWdyaWQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjIyAgIFxuICAgIHNldHVwOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmRzdFJlY3Qud2lkdGggPT0gMSB0aGVuIHJldHVyblxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSB5ZXNcblxuICAgICAgICBpZiAhQHRlbXBsYXRlLnNpemVcbiAgICAgICAgICAgIGl0ZW0gPSB1aS5VSU1hbmFnZXIuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKEB0ZW1wbGF0ZS5kZXNjcmlwdG9yLCBAb2JqZWN0KVxuICAgICAgICAgICAgaXRlbS5pbmRleCA9IDBcbiAgICAgICAgICAgIGl0ZW0udXBkYXRlKClcbiAgICAgICAgICAgIEB0ZW1wbGF0ZS5zaXplID0gW2l0ZW0uZHN0UmVjdC53aWR0aCwgaXRlbS5kc3RSZWN0LmhlaWdodF1cbiAgICAgICAgICAgIGl0ZW0uZGlzcG9zZSgpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5kYXRhU291cmNlLmV4ZWNcbiAgICAgICAgICAgIEBkYXRhU291cmNlXyA9IG5ldyBEYXRhU291cmNlKHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKEBvYmplY3QsIEBwYXJhbXMuZGF0YVNvdXJjZSkgfHwgW10pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkYXRhU291cmNlXyA9IG5ldyBEYXRhU291cmNlKEBwYXJhbXMuZGF0YVNvdXJjZSB8fCBbXSlcbiAgICAgICAgXG4gICAgICAgIEByZXNpemUoKVxuICAgICAgICBcbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyBzY3JvbGxpbmcuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVTY3JvbGxcbiAgICAjIyNcbiAgICB1cGRhdGVTY3JvbGw6IC0+XG4gICAgICAgIEBvYmplY3Quc2Nyb2xsYWJsZUhlaWdodCA9IE1hdGgubWF4KDAsIEBvYmplY3QuY29udGVudEhlaWdodCAtIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQpXG4gICAgICAgIGlmIElucHV0Lk1vdXNlLndoZWVsIDw9IC0xXG4gICAgICAgICAgICBAb2JqZWN0LnNjcm9sbE9mZnNldFkgPSBNYXRoLm1heChAb2JqZWN0LnNjcm9sbE9mZnNldFkgLSBJbnB1dC5Nb3VzZS53aGVlbFNwZWVkICogMC4xLCAwKVxuICAgICAgICAgICBcbiAgICAgICAgaWYgSW5wdXQuTW91c2Uud2hlZWwgPj0gMVxuICAgICAgICAgICAgQG9iamVjdC5zY3JvbGxPZmZzZXRZID0gTWF0aC5taW4oQG9iamVjdC5zY3JvbGxPZmZzZXRZIC0gSW5wdXQuTW91c2Uud2hlZWxTcGVlZCAqIDAuMSwgQG9iamVjdC5zY3JvbGxhYmxlSGVpZ2h0KVxuICAgICAgICAgICAgXG4gICAgXG4gICAgICAgIEBvYmplY3Quc2Nyb2xsT2Zmc2V0WSA9IE1hdGgubWF4KE1hdGgubWluKEBvYmplY3Quc2Nyb2xsT2Zmc2V0WSwgQG9iamVjdC5zY3JvbGxhYmxlSGVpZ2h0KSwgMClcbiAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc2l6ZXMgdGhlIGRhdGEtZ3JpZCBhbmQgY3JlYXRlcyB0aGUgbmVjZXNzYXJ5IGRpc3BsYXkgb2JqZWN0cyBmcm9tIHRoZSBkYXRhLWdyaWQgdGVtcGxhdGUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXNpemVcbiAgICAjIyMgICAgIFxuICAgIHJlc2l6ZTogLT5cbiAgICAgICAgd2lkdGggPSBAb2JqZWN0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgaGVpZ2h0ID0gQG9iamVjdC5kc3RSZWN0LmhlaWdodFxuICAgICAgICBcbiAgICAgICAgaXRlbXNYID0gQGNvbHVtbnMgfHwgMVxuICAgICAgICBpdGVtc1kgPSBNYXRoLmNlaWwoKGhlaWdodC1Ac3BhY2luZ1sxXSkgLyAoQHRlbXBsYXRlLnNpemVbMV0rQHNwYWNpbmdbMV0pKSArIEBjb2x1bW5zKzFcbiAgICAgICAgdG90YWxJdGVtc1kgPSBNYXRoLmNlaWwoQGRhdGFTb3VyY2UubGVuZ3RoIC8gQGNvbHVtbnMpXG4gICAgICAgIFxuICAgICAgICBpdGVtPy5kaXNwb3NlKCkgZm9yIGl0ZW0gaW4gQGl0ZW1zXG4gICAgICAgIEBpdGVtcyA9IFtdICNuZXcgQXJyYXkoaXRlbXNYICogaXRlbXNZKVxuICAgICAgICBcbiAgICAgICAgZm9yIHkgaW4gWzAuLi5pdGVtc1ldXG4gICAgICAgICAgICBmb3IgeCBpbiBbMC4uLml0ZW1zWF1cbiAgICAgICAgICAgICAgICBpbmRleCAgPSB5ICogaXRlbXNYICsgeFxuICAgICAgICAgICAgICAgIGlmIGluZGV4IDwgQGRhdGFTb3VyY2UubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSB1aS5VSU1hbmFnZXIuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKEB0ZW1wbGF0ZS5kZXNjcmlwdG9yLCBAb2JqZWN0KVxuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YVswXSA9IEBkYXRhU291cmNlLml0ZW1BdChpbmRleCkuZGF0YSAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZHN0UmVjdC54ID0gQHNwYWNpbmdbMF0gKyB4ICogKEB0ZW1wbGF0ZS5zaXplWzBdK0BzcGFjaW5nWzBdKVxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRzdFJlY3QueSA9IEBzcGFjaW5nWzFdICsgeSAqIChAdGVtcGxhdGUuc2l6ZVsxXStAc3BhY2luZ1sxXSlcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kc3RSZWN0LndpZHRoID0gQHRlbXBsYXRlLnNpemVbMF1cbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kc3RSZWN0LmhlaWdodCA9IEB0ZW1wbGF0ZS5zaXplWzFdXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaW5kZXggPSBpbmRleFxuICAgICAgICAgICAgICAgICAgICBpdGVtLnVpLnZpZXdEYXRhID0gQGRhdGFTb3VyY2UuaXRlbUF0KGluZGV4KS52aWV3RGF0YVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgQGl0ZW1zW2l0ZW0uaW5kZXhdID0gaXRlbVxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmFkZE9iamVjdChpdGVtKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBAb2JqZWN0LnNjcm9sbGFibGVIZWlnaHQgPSBAc3BhY2luZ1sxXSArIHRvdGFsSXRlbXNZICogKEB0ZW1wbGF0ZS5zaXplWzFdK0BzcGFjaW5nWzFdKSAtIGhlaWdodFxuICAgICAgICBAb2JqZWN0LnNjcm9sbE9mZnNldFkgPSAwXG4gICAgICAgIEBvYmplY3QuY29udGVudEhlaWdodCA9IEBzcGFjaW5nWzFdICsgdG90YWxJdGVtc1kgKiAoQHRlbXBsYXRlLnNpemVbMV0rQHNwYWNpbmdbMV0pXG5cbiAgICBpdGVtQXRJbmRleDogKGluZGV4KSAtPlxuICAgICAgICBAaXRlbXMuZmlyc3QgKGl0ZW0pIC0+IGl0ZW0uaW5kZXggPT0gaW5kZXhcbiAgICAgICAgXG4gICAgaW5kZXhGb3JJdGVtOiAoaXRlbSkgLT4gaXRlbS5pbmRleFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBkYXRhLWdyaWQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEBpbml0aWFsaXplZFxuICAgICAgICAgICAgQHNldHVwKClcbiAgICAgICAgXG4gICAgICAgIHNjcm9sbE9mZnNldCA9IEBvYmplY3Quc2Nyb2xsT2Zmc2V0WVxuICAgICAgICBvZmZzZXQgPSBNYXRoLmZsb29yKChzY3JvbGxPZmZzZXQpIC8gKEB0ZW1wbGF0ZS5zaXplWzFdK0BzcGFjaW5nWzFdKSkgKiBAY29sdW1uc1xuICAgICAgICBpID0gb2Zmc2V0XG4gICAgICAgIGl0ZW1JbmRleCA9IDBcbiAgICAgICAgaXRlbXNZID0gTWF0aC5jZWlsKChAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0LUBzcGFjaW5nWzFdKSAvICAoQHRlbXBsYXRlLnNpemVbMV0rQHNwYWNpbmdbMV0pKSAqIEBjb2x1bW5zICsgQGNvbHVtbnMrMVxuICAgICAgICBcbiAgICAgICAgd2hpbGUgaSA8IE1hdGgubWluKG9mZnNldCtpdGVtc1ksIEBkYXRhU291cmNlLmxlbmd0aClcbiAgICAgICAgICAgIHJvdyA9IE1hdGguZmxvb3IoaSAvIEBjb2x1bW5zKVxuICAgICAgICAgICAgY29sdW1uID0gaSAlIEBjb2x1bW5zXG4gICAgICAgICAgICBpdGVtID0gQGl0ZW1zW2l0ZW1JbmRleF1cbiAgICAgICAgICAgIGlmIGl0ZW1cbiAgICAgICAgICAgICAgICBpdGVtLmRhdGFbMF0gPSBAZGF0YVNvdXJjZS5pdGVtQXQoaSkuZGF0YVxuICAgICAgICAgICAgICAgIGlmIEBvYmplY3QuY2xpcFJlY3RcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGlwUmVjdCA9IEBvYmplY3QuY2xpcFJlY3RcbiAgICAgICAgICAgICAgICBpdGVtLmluZGV4ID0gaVxuICAgICAgICAgICAgICAgIGl0ZW0udWkudmlld0RhdGEgPSBAZGF0YVNvdXJjZS5pdGVtQXQoaSkudmlld0RhdGFcbiAgICAgICAgICAgICAgICBpdGVtLmRzdFJlY3QueCA9IEBzcGFjaW5nWzBdICsgY29sdW1uICogKEB0ZW1wbGF0ZS5zaXplWzBdK0BzcGFjaW5nWzBdKVxuICAgICAgICAgICAgICAgIGl0ZW0uZHN0UmVjdC55ID0gQHNwYWNpbmdbMV0gKyAocm93LShvZmZzZXQvQGNvbHVtbnMpKSAqIChAdGVtcGxhdGUuc2l6ZVsxXStAc3BhY2luZ1sxXSkgKyAoLXNjcm9sbE9mZnNldCAlIChAdGVtcGxhdGUuc2l6ZVsxXStAc3BhY2luZ1sxXSkpXG4gICAgICAgICAgICAgICAgaXRlbS52aXNpYmxlID0geWVzXG4gICAgICAgICAgICAgICAgaXRlbS51cGRhdGUoKVxuICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlKClcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXgrK1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGkrK1xuICAgICAgICBcbiAgICAgICAgZm9yIGogaW4gW2l0ZW1JbmRleC4uLkBpdGVtcy5sZW5ndGhdXG4gICAgICAgICAgICBpZiBAaXRlbXNbal1cbiAgICAgICAgICAgICAgICBAaXRlbXNbal0udmlzaWJsZSA9IG5vXG4gICAgICAgICAgICAgICAgQGl0ZW1zW2pdLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG51aS5Db21wb25lbnRfRGF0YUdyaWRCZWhhdmlvciA9IENvbXBvbmVudF9EYXRhR3JpZEJlaGF2aW9yIl19
//# sourceURL=Component_DataGridBehavior_172.js