var Component_ImageMap,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_ImageMap = (function(superClass) {
  extend(Component_ImageMap, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_ImageMap.prototype.onDataBundleRestore = function(data, context) {
    var bitmap, ground, h, j, len, ref, results;
    this.setupEventHandlers();
    this.object.addObject(this.ground);
    bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + this.object.images[0]);
    ground = new gs.Bitmap(bitmap.width, bitmap.height);
    ground.blt(0, 0, bitmap, new Rect(0, 0, bitmap.width, bitmap.height));
    this.ground.bitmap = ground;
    this.setupHotspots(this.hotspots);
    ref = this.hotspots;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      h = ref[j];
      results.push(this.object.addObject(h));
    }
    return results;
  };


  /**
  * A component which turns a game object into an interactive image-map.
  *
  * @module gs
  * @class Component_ImageMap
  * @extends gs.Component_Visual
  * @memberof gs
   */

  function Component_ImageMap() {
    Component_ImageMap.__super__.constructor.apply(this, arguments);

    /**
    * The ground/base image.
    * @property ground
    * @type gs.Object_Picture
    * @default null
     */
    this.ground = null;

    /**
    * An array of different hotspots.
    * @property hotspots
    * @type gs.Object_Picture[]
    * @default null
     */
    this.hotspots = null;

    /**
    * The variable context used if a hotspot needs to deal with local variables.
    * @property variableContext
    * @type Object
    * @default null
     */
    this.variableContext = null;

    /**
    * Indicates if the image-map is active. An in-active image-map doesn't respond
    * to any input-event. Hover effects are still working.
    * @property active
    * @type boolean
    * @default yes
     */
    this.active = true;
  }


  /**
  * Adds event-handler for mouse/touch events to update the component only if 
  * a user-action happened.
  *
  * @method setupEventHandlers
   */

  Component_ImageMap.prototype.setupEventHandlers = function() {
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    return gs.GlobalEventManager.on("mouseUp", ((function(_this) {
      return function(e) {
        var contains, hotspot, j, len, ref, results;
        contains = Rect.contains(_this.object.dstRect.x, _this.object.dstRect.y, _this.object.dstRect.width, _this.object.dstRect.height, Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y);
        if (contains && _this.active) {
          ref = _this.hotspots;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            hotspot = ref[j];
            if (_this.checkHotspotAction(hotspot)) {
              e.breakChain = true;
              if (hotspot.data.bindToSwitch) {
                hotspot.selected = !hotspot.selected;
              }
              results.push(_this.executeHotspotAction(hotspot));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
    })(this)), null, this.object);
  };


  /**
  * Initializes the image-map. Creates the background and hotspots.
  *
  * @method setup
   */

  Component_ImageMap.prototype.setup = function() {
    var bitmap, ground;
    this.setupEventHandlers();
    bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + this.object.images[0]);
    bitmap.makeMutable();
    ground = new gs.Bitmap(bitmap.width, bitmap.height);
    ground.blt(0, 0, bitmap, new Rect(0, 0, bitmap.width, bitmap.height));
    this.ground = new gs.Object_Picture();
    this.ground.bitmap = ground;
    this.ground.image = null;
    this.ground.zIndex = this.object.zIndex;
    this.ground.imageHandling = gs.ImageHandling.CUSTOM_SIZE;
    this.object.addObject(this.ground);
    this.setupHotspots();
    this.ground.srcRect.set(0, 0, ground.width, ground.height);
    this.ground.dstRect.width = ground.width;
    this.ground.dstRect.height = ground.height;
    this.ground.update();
    this.object.dstRect.width = this.ground.dstRect.width;
    return this.object.dstRect.height = this.ground.dstRect.height;
  };


  /**
  * Sets up the hotspots on the image-map. Each hotspot is a gs.Object_ImageMapHotspot
  * object.
  *
  * @method setupHotspots
   */

  Component_ImageMap.prototype.setupHotspots = function(hotspots) {
    return this.hotspots = this.object.hotspots.select((function(_this) {
      return function(v, i) {
        var picture, ref, ref1, ref2, ref3;
        _this.ground.bitmap.clearRect(v.x, v.y, v.size.width, v.size.height);
        picture = new gs.Object_ImageMapHotspot();
        picture.fixedSize = true;
        picture.srcRect = new Rect(v.x, v.y, v.size.width, v.size.height);
        picture.dstRect = new Rect(v.x, v.y, v.size.width, v.size.height);
        picture.imageHandling = gs.ImageHandling.CUSTOM_SIZE;
        picture.zIndex = _this.object.zIndex + 1;
        picture.selected = (ref = hotspots != null ? (ref1 = hotspots[i]) != null ? ref1.selected : void 0 : void 0) != null ? ref : false;
        picture.enabled = (ref2 = hotspots != null ? (ref3 = hotspots[i]) != null ? ref3.enabled : void 0 : void 0) != null ? ref2 : true;
        picture.actions = v.data.actions;
        picture.data = v.data;
        picture.commonEventId = v.commonEventId;
        picture.anchor.set(0.5, 0.5);
        _this.object.addObject(picture);
        return picture;
      };
    })(this));
  };


  /**
  * Initializes the image-map. Frees ground image.
  *
  * @method dispose
   */

  Component_ImageMap.prototype.dispose = function() {
    Component_ImageMap.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    return this.ground.bitmap.dispose();
  };


  /**
  * Executes a hotspot's associated action. Depending on the configuration a hotspot
  * can trigger a common-event or turn on a switch for example.
  *
  * @method executeHotspotAction
  * @param {gs.Object_Picture} hotspot - The hotspot where the image should be updated.
  * @protected
   */

  Component_ImageMap.prototype.executeHotspotAction = function(hotspot) {
    var domain, ref, ref1, ref2, ref3;
    GameManager.variableStore.setupTempVariables(this.variableContext);
    if (hotspot.data.bindToSwitch) {
      domain = GameManager.variableStore.domain;
      GameManager.variableStore.setBooleanValueTo(hotspot.data["switch"], hotspot.selected);
    }
    if (hotspot.data.bindValueTo) {
      domain = GameManager.variableStore.domain;
      GameManager.variableStore.setNumberValueTo(hotspot.data.bindValueVariable, hotspot.data.bindValue);
    }
    switch (hotspot.data.action) {
      case 1:
        if ((ref = this.object.events) != null) {
          ref.emit("jumpTo", this.object, {
            label: hotspot.data.label
          });
        }
        break;
      case 2:
        if ((ref1 = this.object.events) != null) {
          ref1.emit("callCommonEvent", this.object, {
            commonEventId: hotspot.data.commonEventId,
            finish: hotspot.data.finish
          });
        }
        break;
      case 3:
        if ((ref2 = this.object.events) != null) {
          ref2.emit("action", this.object, {
            actions: hotspot.data.actions
          });
        }
    }
    if (hotspot.data.finish) {
      return (ref3 = this.object.events) != null ? ref3.emit("finish", this.object) : void 0;
    }
  };


  /**
  * Checks if a hotspot's associated action needs to be executed. Depending on the configuration a hotspot
  * can trigger a common-event or turn on a switch for example.
  *
  * @method updateHotspotAction
  * @param {gs.Object_Picture} hotspot - The hotspot where the image should be updated.
  * @return {boolean} If <b>true</b> the hotspot's action needs to be executed. Otherwise <b>false</b>.
  * @protected
   */

  Component_ImageMap.prototype.checkHotspotAction = function(hotspot) {
    var hovered, result;
    result = false;
    hovered = hotspot.dstRect.contains(Input.Mouse.x - hotspot.origin.x, Input.Mouse.y - hotspot.origin.y);
    if (hovered && hotspot.enabled && Input.Mouse.buttons[Input.Mouse.LEFT] === 2) {
      result = true;
    }
    return result;
  };


  /**
  * Updates a hotspot's image. Depending on the state the image of a hotspot can
  * change for example if the mouse hovers over a hotspot.
  *
  * @method updateHotspotImage
  * @param {gs.Object_Picture} hotspot - The hotspot where the image should be updated.
  * @param {boolean} hovered - Indicates if the hotspot is hovered by mouse/touch cursor.
  * @protected
   */

  Component_ImageMap.prototype.updateHotspotImage = function(hotspot, hovered) {
    var baseImage;
    baseImage = hotspot.enabled ? this.object.images[2] || this.object.images[0] : this.object.images[0];
    if (hovered && hotspot.enabled) {
      if (hotspot.selected) {
        return hotspot.image = this.object.images[4] || this.object.images[1] || baseImage;
      } else {
        return hotspot.image = this.object.images[1] || baseImage;
      }
    } else {
      if (hotspot.selected) {
        return hotspot.image = this.object.images[3] || baseImage;
      } else {
        return hotspot.image = baseImage;
      }
    }
  };


  /**
  * Updates a hotspot.
  *
  * @method updateHotspot
  * @param {gs.Object_Picture} hotspot - The hotspot to update.
  * @protected
   */

  Component_ImageMap.prototype.updateHotspot = function(hotspot) {
    var hovered;
    hotspot.visible = this.object.visible;
    hotspot.opacity = this.object.opacity;
    hotspot.tone.setFromObject(this.object.tone);
    hotspot.color.setFromObject(this.object.color);
    if (hotspot.data.bindEnabledState) {
      GameManager.variableStore.setupTempVariables(this.variableContext);
      hotspot.enabled = GameManager.variableStore.booleanValueOf(hotspot.data.enabledSwitch);
    }
    if (hotspot.data.bindToSwitch) {
      GameManager.variableStore.setupTempVariables(this.variableContext);
      hotspot.selected = GameManager.variableStore.booleanValueOf(hotspot.data["switch"]);
    }
    hovered = hotspot.dstRect.contains(Input.Mouse.x - hotspot.origin.x, Input.Mouse.y - hotspot.origin.y);
    this.updateHotspotImage(hotspot, hovered);
    return hotspot.update();
  };


  /**
  * Updates the ground-image.
  *
  * @method updateGround
  * @protected
   */

  Component_ImageMap.prototype.updateGround = function() {
    this.ground.visible = this.object.visible;
    this.ground.opacity = this.object.opacity;
    this.ground.anchor.x = 0.5;
    this.ground.anchor.y = 0.5;
    this.ground.tone.setFromObject(this.object.tone);
    this.ground.color.setFromObject(this.object.color);
    return this.ground.update();
  };


  /**
  * Updates the image-map's ground and all hotspots.
  *
  * @method update
   */

  Component_ImageMap.prototype.update = function() {
    var hotspot, j, len, ref;
    Component_ImageMap.__super__.update.call(this);
    this.updateGround();
    ref = this.hotspots;
    for (j = 0, len = ref.length; j < len; j++) {
      hotspot = ref[j];
      this.updateHotspot(hotspot);
    }
    return null;
  };

  return Component_ImageMap;

})(gs.Component_Visual);

gs.Component_ImageMap = Component_ImageMap;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsa0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OytCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDakIsUUFBQTtJQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQWtCLElBQUMsQ0FBQSxNQUFuQjtJQUVBLE1BQUEsR0FBUyxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsb0JBQUEsR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUE5RDtJQUNULE1BQUEsR0FBYSxJQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsTUFBTSxDQUFDLEtBQWpCLEVBQXdCLE1BQU0sQ0FBQyxNQUEvQjtJQUNiLE1BQU0sQ0FBQyxHQUFQLENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsTUFBakIsRUFBNkIsSUFBQSxJQUFBLENBQUssQ0FBTCxFQUFRLENBQVIsRUFBVyxNQUFNLENBQUMsS0FBbEIsRUFBeUIsTUFBTSxDQUFDLE1BQWhDLENBQTdCO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0lBRWpCLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLFFBQWhCO0FBQ0E7QUFBQTtTQUFBLHFDQUFBOzttQkFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBa0IsQ0FBbEI7QUFESjs7RUFWaUI7OztBQWFyQjs7Ozs7Ozs7O0VBUWEsNEJBQUE7SUFDVCxxREFBQSxTQUFBOztBQUVBOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7SUFNQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7Ozs7SUFNQSxJQUFDLENBQUEsZUFBRCxHQUFtQjs7QUFFbkI7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVO0VB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QUFNLENBQUMsT0FBUixHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDO0lBQzFCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDO0lBQzFCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQWYsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBZixHQUFtQjtJQUNuQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFiLENBQTJCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBbkM7SUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFkLENBQTRCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBcEM7V0FDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBQTtFQVBVOzs7QUFTZDs7Ozs7OytCQUtBLE1BQUEsR0FBUSxTQUFBO0FBQ0osUUFBQTtJQUFBLDZDQUFBO0lBRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQTtBQUVBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFDLENBQUEsYUFBRCxDQUFlLE9BQWY7QUFESjtBQUdBLFdBQU87RUFSSDs7OztHQTFRcUIsRUFBRSxDQUFDOztBQW9ScEMsRUFBRSxDQUFDLGtCQUFILEdBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfSW1hZ2VNYXBcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9JbWFnZU1hcCBleHRlbmRzIGdzLkNvbXBvbmVudF9WaXN1YWxcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIEBvYmplY3QuYWRkT2JqZWN0KEBncm91bmQpXG4gICAgICAgIFxuICAgICAgICBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tAb2JqZWN0LmltYWdlc1swXX1cIilcbiAgICAgICAgZ3JvdW5kID0gbmV3IGdzLkJpdG1hcChiaXRtYXAud2lkdGgsIGJpdG1hcC5oZWlnaHQpXG4gICAgICAgIGdyb3VuZC5ibHQoMCwgMCwgYml0bWFwLCBuZXcgUmVjdCgwLCAwLCBiaXRtYXAud2lkdGgsIGJpdG1hcC5oZWlnaHQpKVxuICAgICAgICBAZ3JvdW5kLmJpdG1hcCA9IGdyb3VuZFxuICAgICAgICBcbiAgICAgICAgQHNldHVwSG90c3BvdHMoQGhvdHNwb3RzKVxuICAgICAgICBmb3IgaCBpbiBAaG90c3BvdHNcbiAgICAgICAgICAgIEBvYmplY3QuYWRkT2JqZWN0KGgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEEgY29tcG9uZW50IHdoaWNoIHR1cm5zIGEgZ2FtZSBvYmplY3QgaW50byBhbiBpbnRlcmFjdGl2ZSBpbWFnZS1tYXAuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9JbWFnZU1hcFxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Zpc3VhbFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGdyb3VuZC9iYXNlIGltYWdlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBncm91bmRcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfUGljdHVyZVxuICAgICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgICAgIyMjXG4gICAgICAgIEBncm91bmQgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQW4gYXJyYXkgb2YgZGlmZmVyZW50IGhvdHNwb3RzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBob3RzcG90c1xuICAgICAgICAqIEB0eXBlIGdzLk9iamVjdF9QaWN0dXJlW11cbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICMjI1xuICAgICAgICBAaG90c3BvdHMgPSBudWxsXG4gICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgdmFyaWFibGUgY29udGV4dCB1c2VkIGlmIGEgaG90c3BvdCBuZWVkcyB0byBkZWFsIHdpdGggbG9jYWwgdmFyaWFibGVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSB2YXJpYWJsZUNvbnRleHRcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICMjI1xuICAgICAgICBAdmFyaWFibGVDb250ZXh0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgaW1hZ2UtbWFwIGlzIGFjdGl2ZS4gQW4gaW4tYWN0aXZlIGltYWdlLW1hcCBkb2Vzbid0IHJlc3BvbmRcbiAgICAgICAgKiB0byBhbnkgaW5wdXQtZXZlbnQuIEhvdmVyIGVmZmVjdHMgYXJlIHN0aWxsIHdvcmtpbmcuXG4gICAgICAgICogQHByb3BlcnR5IGFjdGl2ZVxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAZGVmYXVsdCB5ZXNcbiAgICAgICAgIyMjXG4gICAgICAgIEBhY3RpdmUgPSB5ZXNcbiAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXIgZm9yIG1vdXNlL3RvdWNoIGV2ZW50cyB0byB1cGRhdGUgdGhlIGNvbXBvbmVudCBvbmx5IGlmIFxuICAgICogYSB1c2VyLWFjdGlvbiBoYXBwZW5lZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRXZlbnRIYW5kbGVyc1xuICAgICMjIyBcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwibW91c2VVcFwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZVVwXCIsICgoZSkgPT4gXG4gICAgICAgICAgICBjb250YWlucyA9IFJlY3QuY29udGFpbnMoQG9iamVjdC5kc3RSZWN0LngsIEBvYmplY3QuZHN0UmVjdC55LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBjb250YWlucyBhbmQgQGFjdGl2ZVxuICAgICAgICAgICAgICAgIGZvciBob3RzcG90IGluIEBob3RzcG90c1xuICAgICAgICAgICAgICAgICAgICBpZiBAY2hlY2tIb3RzcG90QWN0aW9uKGhvdHNwb3QpIFxuICAgICAgICAgICAgICAgICAgICAgICAgZS5icmVha0NoYWluID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBob3RzcG90LmRhdGEuYmluZFRvU3dpdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG90c3BvdC5zZWxlY3RlZCA9ICFob3RzcG90LnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBAZXhlY3V0ZUhvdHNwb3RBY3Rpb24oaG90c3BvdClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgKSwgbnVsbCwgQG9iamVjdFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgaW1hZ2UtbWFwLiBDcmVhdGVzIHRoZSBiYWNrZ3JvdW5kIGFuZCBob3RzcG90cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBcbiAgICAgICAgYml0bWFwID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1BpY3R1cmVzLyN7QG9iamVjdC5pbWFnZXNbMF19XCIpXG4gICAgICAgIGJpdG1hcC5tYWtlTXV0YWJsZSgpXG4gICAgICAgIGdyb3VuZCA9IG5ldyBncy5CaXRtYXAoYml0bWFwLndpZHRoLCBiaXRtYXAuaGVpZ2h0KVxuICAgICAgICBncm91bmQuYmx0KDAsIDAsIGJpdG1hcCwgbmV3IFJlY3QoMCwgMCwgYml0bWFwLndpZHRoLCBiaXRtYXAuaGVpZ2h0KSlcbiAgICAgICAgXG4gICAgICAgIEBncm91bmQgPSBuZXcgZ3MuT2JqZWN0X1BpY3R1cmUoKVxuICAgICAgICBAZ3JvdW5kLmJpdG1hcCA9IGdyb3VuZFxuICAgICAgICBAZ3JvdW5kLmltYWdlID0gbnVsbFxuICAgICAgICBAZ3JvdW5kLnpJbmRleCA9IEBvYmplY3QuekluZGV4XG4gICAgICAgIEBncm91bmQuaW1hZ2VIYW5kbGluZyA9IGdzLkltYWdlSGFuZGxpbmcuQ1VTVE9NX1NJWkVcbiAgICAgICAgQG9iamVjdC5hZGRPYmplY3QoQGdyb3VuZClcbiAgICAgICAgXG4gICAgICAgIEBzZXR1cEhvdHNwb3RzKClcbiAgICAgICAgXG4gICAgICAgIEBncm91bmQuc3JjUmVjdC5zZXQoMCwgMCwgZ3JvdW5kLndpZHRoLCBncm91bmQuaGVpZ2h0KVxuICAgICAgICBAZ3JvdW5kLmRzdFJlY3Qud2lkdGggPSBncm91bmQud2lkdGhcbiAgICAgICAgQGdyb3VuZC5kc3RSZWN0LmhlaWdodCA9IGdyb3VuZC5oZWlnaHRcbiAgICAgICAgQGdyb3VuZC51cGRhdGUoKVxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQGdyb3VuZC5kc3RSZWN0LndpZHRoXG4gICAgICAgIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgPSBAZ3JvdW5kLmRzdFJlY3QuaGVpZ2h0XG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB0aGUgaG90c3BvdHMgb24gdGhlIGltYWdlLW1hcC4gRWFjaCBob3RzcG90IGlzIGEgZ3MuT2JqZWN0X0ltYWdlTWFwSG90c3BvdFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBIb3RzcG90c1xuICAgICMjI1xuICAgIHNldHVwSG90c3BvdHM6IChob3RzcG90cykgLT5cbiAgICAgICAgQGhvdHNwb3RzID0gQG9iamVjdC5ob3RzcG90cy5zZWxlY3QgKHYsIGkpID0+IFxuICAgICAgICAgICAgQGdyb3VuZC5iaXRtYXAuY2xlYXJSZWN0KHYueCwgdi55LCB2LnNpemUud2lkdGgsIHYuc2l6ZS5oZWlnaHQpXG4gICAgICAgICAgICBwaWN0dXJlID0gbmV3IGdzLk9iamVjdF9JbWFnZU1hcEhvdHNwb3QoKVxuICAgICAgICAgICAgcGljdHVyZS5maXhlZFNpemUgPSB0cnVlXG4gICAgICAgICAgICBwaWN0dXJlLnNyY1JlY3QgPSBuZXcgUmVjdCh2LngsIHYueSwgdi5zaXplLndpZHRoLCB2LnNpemUuaGVpZ2h0KVxuICAgICAgICAgICAgcGljdHVyZS5kc3RSZWN0ID0gbmV3IFJlY3Qodi54LCB2LnksIHYuc2l6ZS53aWR0aCwgdi5zaXplLmhlaWdodClcbiAgICAgICAgICAgIHBpY3R1cmUuaW1hZ2VIYW5kbGluZyA9IGdzLkltYWdlSGFuZGxpbmcuQ1VTVE9NX1NJWkVcbiAgICAgICAgICAgIHBpY3R1cmUuekluZGV4ID0gQG9iamVjdC56SW5kZXggKyAxXG4gICAgICAgICAgICBwaWN0dXJlLnNlbGVjdGVkID0gaG90c3BvdHM/W2ldPy5zZWxlY3RlZCA/IG5vXG4gICAgICAgICAgICBwaWN0dXJlLmVuYWJsZWQgPSBob3RzcG90cz9baV0/LmVuYWJsZWQgPyB5ZXNcbiAgICAgICAgICAgIHBpY3R1cmUuYWN0aW9ucyA9IHYuZGF0YS5hY3Rpb25zXG4gICAgICAgICAgICBwaWN0dXJlLmRhdGEgPSB2LmRhdGFcbiAgICAgICAgICAgIHBpY3R1cmUuY29tbW9uRXZlbnRJZCA9IHYuY29tbW9uRXZlbnRJZFxuICAgICAgICAgICAgcGljdHVyZS5hbmNob3Iuc2V0KDAuNSwgMC41KVxuICAgICAgICAgICAgQG9iamVjdC5hZGRPYmplY3QocGljdHVyZSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHBpY3R1cmVcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBpbWFnZS1tYXAuIEZyZWVzIGdyb3VuZCBpbWFnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlVXBcIiwgQG9iamVjdClcbiAgICAgICAgQGdyb3VuZC5iaXRtYXAuZGlzcG9zZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEV4ZWN1dGVzIGEgaG90c3BvdCdzIGFzc29jaWF0ZWQgYWN0aW9uLiBEZXBlbmRpbmcgb24gdGhlIGNvbmZpZ3VyYXRpb24gYSBob3RzcG90XG4gICAgKiBjYW4gdHJpZ2dlciBhIGNvbW1vbi1ldmVudCBvciB0dXJuIG9uIGEgc3dpdGNoIGZvciBleGFtcGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgZXhlY3V0ZUhvdHNwb3RBY3Rpb25cbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X1BpY3R1cmV9IGhvdHNwb3QgLSBUaGUgaG90c3BvdCB3aGVyZSB0aGUgaW1hZ2Ugc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgZXhlY3V0ZUhvdHNwb3RBY3Rpb246IChob3RzcG90KSAtPlxuICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldHVwVGVtcFZhcmlhYmxlcyhAdmFyaWFibGVDb250ZXh0KVxuICAgICAgICBpZiBob3RzcG90LmRhdGEuYmluZFRvU3dpdGNoXG4gICAgICAgICAgICBkb21haW4gPSBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmRvbWFpblxuICAgICAgICAgICAgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXRCb29sZWFuVmFsdWVUbyhob3RzcG90LmRhdGEuc3dpdGNoLCBob3RzcG90LnNlbGVjdGVkKVxuICAgICAgICBpZiBob3RzcG90LmRhdGEuYmluZFZhbHVlVG9cbiAgICAgICAgICAgIGRvbWFpbiA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuZG9tYWluXG4gICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldE51bWJlclZhbHVlVG8oaG90c3BvdC5kYXRhLmJpbmRWYWx1ZVZhcmlhYmxlLCBob3RzcG90LmRhdGEuYmluZFZhbHVlKVxuICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBob3RzcG90LmRhdGEuYWN0aW9uXG4gICAgICAgICAgICB3aGVuIDEgIyBKdW1wIFRvXG4gICAgICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJqdW1wVG9cIiwgQG9iamVjdCwgeyBsYWJlbDogaG90c3BvdC5kYXRhLmxhYmVsIH0pXG4gICAgICAgICAgICB3aGVuIDIgIyBDYWxsIENvbW1vbiBFdmVudFxuICAgICAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzPy5lbWl0KFwiY2FsbENvbW1vbkV2ZW50XCIsIEBvYmplY3QsIHsgY29tbW9uRXZlbnRJZDogaG90c3BvdC5kYXRhLmNvbW1vbkV2ZW50SWQsIGZpbmlzaDogaG90c3BvdC5kYXRhLmZpbmlzaCB9KVxuICAgICAgICAgICAgd2hlbiAzICMgVUkgQWN0aW9uXG4gICAgICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJhY3Rpb25cIiwgQG9iamVjdCwgeyBhY3Rpb25zOiBob3RzcG90LmRhdGEuYWN0aW9ucyB9KVxuICAgICAgICBcbiAgICAgICAgaWYgaG90c3BvdC5kYXRhLmZpbmlzaFxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJmaW5pc2hcIiwgQG9iamVjdClcbiAgICAgICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIENoZWNrcyBpZiBhIGhvdHNwb3QncyBhc3NvY2lhdGVkIGFjdGlvbiBuZWVkcyB0byBiZSBleGVjdXRlZC4gRGVwZW5kaW5nIG9uIHRoZSBjb25maWd1cmF0aW9uIGEgaG90c3BvdFxuICAgICogY2FuIHRyaWdnZXIgYSBjb21tb24tZXZlbnQgb3IgdHVybiBvbiBhIHN3aXRjaCBmb3IgZXhhbXBsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUhvdHNwb3RBY3Rpb25cbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X1BpY3R1cmV9IGhvdHNwb3QgLSBUaGUgaG90c3BvdCB3aGVyZSB0aGUgaW1hZ2Ugc2hvdWxkIGJlIHVwZGF0ZWQuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiA8Yj50cnVlPC9iPiB0aGUgaG90c3BvdCdzIGFjdGlvbiBuZWVkcyB0byBiZSBleGVjdXRlZC4gT3RoZXJ3aXNlIDxiPmZhbHNlPC9iPi5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjaGVja0hvdHNwb3RBY3Rpb246IChob3RzcG90KSAtPlxuICAgICAgICByZXN1bHQgPSBub1xuICAgICAgICBob3ZlcmVkID0gaG90c3BvdC5kc3RSZWN0LmNvbnRhaW5zKElucHV0Lk1vdXNlLnggLSBob3RzcG90Lm9yaWdpbi54LCBJbnB1dC5Nb3VzZS55IC0gaG90c3BvdC5vcmlnaW4ueSlcbiAgICAgICAgXG4gICAgICAgIGlmIGhvdmVyZWQgYW5kIGhvdHNwb3QuZW5hYmxlZCBhbmQgSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyXG4gICAgICAgICAgICByZXN1bHQgPSB5ZXNcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGEgaG90c3BvdCdzIGltYWdlLiBEZXBlbmRpbmcgb24gdGhlIHN0YXRlIHRoZSBpbWFnZSBvZiBhIGhvdHNwb3QgY2FuXG4gICAgKiBjaGFuZ2UgZm9yIGV4YW1wbGUgaWYgdGhlIG1vdXNlIGhvdmVycyBvdmVyIGEgaG90c3BvdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUhvdHNwb3RJbWFnZVxuICAgICogQHBhcmFtIHtncy5PYmplY3RfUGljdHVyZX0gaG90c3BvdCAtIFRoZSBob3RzcG90IHdoZXJlIHRoZSBpbWFnZSBzaG91bGQgYmUgdXBkYXRlZC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaG92ZXJlZCAtIEluZGljYXRlcyBpZiB0aGUgaG90c3BvdCBpcyBob3ZlcmVkIGJ5IG1vdXNlL3RvdWNoIGN1cnNvci5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICB1cGRhdGVIb3RzcG90SW1hZ2U6IChob3RzcG90LCBob3ZlcmVkKSAtPlxuICAgICAgICBiYXNlSW1hZ2UgPSBpZiBob3RzcG90LmVuYWJsZWQgdGhlbiBAb2JqZWN0LmltYWdlc1syXSB8fCBAb2JqZWN0LmltYWdlc1swXSBlbHNlIEBvYmplY3QuaW1hZ2VzWzBdIFxuICAgICAgICBpZiBob3ZlcmVkIGFuZCBob3RzcG90LmVuYWJsZWRcbiAgICAgICAgICAgIGlmIGhvdHNwb3Quc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICBob3RzcG90LmltYWdlID0gQG9iamVjdC5pbWFnZXNbNF0gfHwgQG9iamVjdC5pbWFnZXNbMV0gfHwgYmFzZUltYWdlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaG90c3BvdC5pbWFnZSA9IEBvYmplY3QuaW1hZ2VzWzFdIHx8IGJhc2VJbWFnZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBob3RzcG90LnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgaG90c3BvdC5pbWFnZSA9IEBvYmplY3QuaW1hZ2VzWzNdIHx8IGJhc2VJbWFnZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGhvdHNwb3QuaW1hZ2UgPSBiYXNlSW1hZ2VcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGEgaG90c3BvdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUhvdHNwb3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X1BpY3R1cmV9IGhvdHNwb3QgLSBUaGUgaG90c3BvdCB0byB1cGRhdGUuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgXG4gICAgdXBkYXRlSG90c3BvdDogKGhvdHNwb3QpIC0+XG4gICAgICAgIGhvdHNwb3QudmlzaWJsZSA9IEBvYmplY3QudmlzaWJsZVxuICAgICAgICBob3RzcG90Lm9wYWNpdHkgPSBAb2JqZWN0Lm9wYWNpdHlcbiAgICAgICAgaG90c3BvdC50b25lLnNldEZyb21PYmplY3QoQG9iamVjdC50b25lKVxuICAgICAgICBob3RzcG90LmNvbG9yLnNldEZyb21PYmplY3QoQG9iamVjdC5jb2xvcilcbiAgICAgICAgaWYgaG90c3BvdC5kYXRhLmJpbmRFbmFibGVkU3RhdGVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBUZW1wVmFyaWFibGVzKEB2YXJpYWJsZUNvbnRleHQpXG4gICAgICAgICAgICBob3RzcG90LmVuYWJsZWQgPSBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmJvb2xlYW5WYWx1ZU9mKGhvdHNwb3QuZGF0YS5lbmFibGVkU3dpdGNoKVxuICAgICAgICBpZiBob3RzcG90LmRhdGEuYmluZFRvU3dpdGNoXG4gICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldHVwVGVtcFZhcmlhYmxlcyhAdmFyaWFibGVDb250ZXh0KVxuICAgICAgICAgICAgaG90c3BvdC5zZWxlY3RlZCA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuYm9vbGVhblZhbHVlT2YoaG90c3BvdC5kYXRhLnN3aXRjaClcbiAgICAgICAgaG92ZXJlZCA9IGhvdHNwb3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gaG90c3BvdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIGhvdHNwb3Qub3JpZ2luLnkpXG4gICAgICAgIFxuICAgICAgICBAdXBkYXRlSG90c3BvdEltYWdlKGhvdHNwb3QsIGhvdmVyZWQpICAgICAgIFxuICAgICAgICBob3RzcG90LnVwZGF0ZSgpICAgICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgZ3JvdW5kLWltYWdlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlR3JvdW5kXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgdXBkYXRlR3JvdW5kOiAtPlxuICAgICAgICBAZ3JvdW5kLnZpc2libGUgPSBAb2JqZWN0LnZpc2libGVcbiAgICAgICAgQGdyb3VuZC5vcGFjaXR5ID0gQG9iamVjdC5vcGFjaXR5XG4gICAgICAgIEBncm91bmQuYW5jaG9yLnggPSAwLjVcbiAgICAgICAgQGdyb3VuZC5hbmNob3IueSA9IDAuNVxuICAgICAgICBAZ3JvdW5kLnRvbmUuc2V0RnJvbU9iamVjdChAb2JqZWN0LnRvbmUpXG4gICAgICAgIEBncm91bmQuY29sb3Iuc2V0RnJvbU9iamVjdChAb2JqZWN0LmNvbG9yKVxuICAgICAgICBAZ3JvdW5kLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGltYWdlLW1hcCdzIGdyb3VuZCBhbmQgYWxsIGhvdHNwb3RzLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICBAdXBkYXRlR3JvdW5kKClcbiAgICAgICAgXG4gICAgICAgIGZvciBob3RzcG90IGluIEBob3RzcG90c1xuICAgICAgICAgICAgQHVwZGF0ZUhvdHNwb3QoaG90c3BvdClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgICAgIFxuZ3MuQ29tcG9uZW50X0ltYWdlTWFwID0gQ29tcG9uZW50X0ltYWdlTWFwIl19
//# sourceURL=Component_ImageMap_110.js