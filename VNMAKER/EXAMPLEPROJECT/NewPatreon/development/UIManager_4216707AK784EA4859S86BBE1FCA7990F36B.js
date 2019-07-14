var Formula, Space, Style, UIManager;

Formula = (function() {

  /**
  * Encapsulates a UI formula. A formula can be used in UI layouts to define
  * property-bindings or to implement a specific behavior.
  *
  * @module ui
  * @class Formula
  * @memberof ui
  * @constructor
  * @param {Function} f - The formula-function. Defines the logic of the formula.
  * @param {Object} data - An optional data-object which can be accessed inside the formula-function.
  * @param {string} event - An optional event-name to define when the formula should be executed.
   */
  function Formula(f, data, event) {

    /**
    * Indicates if its the first time the formula is called.
    * @property onInitialize
    * @type boolean
     */
    var i, j, l, ref, ref1;
    this.onInitialize = true;

    /**
    * The formula-function.
    * @property exec_
    * @type Function
     */
    this.exec_ = f;

    /**
    * An optional data-object which can bes accessed inside the formula-function.
    * @property data
    * @type Object
     */
    this.data = data;

    /**
    * An optional event-name to define when the formula should be executed.
    * @property event
    * @type string
     */
    this.event = event;

    /**
    * An array of custom number-data which can be used for different purposes. The first element
    * is also used in onChange method to store the old value and check against the new one to detect a change.
    * @property numbers
    * @type number[]
     */
    this.numbers = new Array(10);
    for (i = j = 0, ref = this.numbers.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.numbers[i] = 0;
    }

    /**
    * An array of custom string-data which can be used for different purposes. The first element
    * is also used in onTextChange method to store the old value and check against the new one to detect a change.
    * @property strings
    * @type string[]
     */
    this.strings = new Array(10);
    for (i = l = 0, ref1 = this.strings.length; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
      this.strings[i] = "";
    }
  }


  /**
  * The formula-function. Its a wrapper-function before the first-time call was made.
  * @method exec
   */

  Formula.prototype.exec = function() {
    var r;
    this.exec = this.exec_;
    r = this.exec_.apply(this, arguments);
    this.onInitialize = false;
    return r;
  };


  /**
  * Checks if the specified number-value has changed since the last check. It uses
  * the first entry of the numbers-array to store the value and check against the new one.
  *
  * @method onChange
  * @param {number} numberValue - Number value to check.
   */

  Formula.prototype.onChange = function(numberValue) {
    var result;
    result = this.numbers[0] !== numberValue;
    this.numbers[0] = numberValue;
    return result;
  };


  /**
  * Checks if the specified text-value has changed since the last check. It uses
  * the first entry of the strings-array to store the value and check against the new one.
  *
  * @method onTextChange
  * @param {string} textValue - Text value to check.
   */

  Formula.prototype.onTextChange = function(textValue) {
    var result;
    result = this.strings[0] !== textValue;
    this.strings[0] = textValue;
    return result;
  };

  return Formula;

})();

ui.Formula = Formula;

Space = (function() {

  /**
  * Describes a space inside or around something like a margin or padding.
  *
  * @module ui
  * @class Space
  * @memberof ui
  * @constructor
  * @param {number} left - Space at the left in pixels.
  * @param {number} top - Space at the top in pixels.
  * @param {number} right - Space at the right in pixels.
  * @param {number} bottom - Space at the bottom in pixels.
   */
  function Space(left, top, right, bottom) {

    /**
    * Space at the left in pixels.
    * @property left
    * @type number
     */
    this.left = left;

    /**
    * Space at the top in pixels.
    * @property top
    * @type number
     */
    this.top = top;

    /**
    * Space at the right in pixels.
    * @property right
    * @type number
     */
    this.right = right;

    /**
    * Space at the bottom in pixels.
    * @property bottom
    * @type number
     */
    this.bottom = bottom;
  }


  /**
  * Sets the coordinates of the space by copying them from a specified space.
  *
  * @method setFromObject
  * @param {Object} space - A space to copy.
   */

  Space.prototype.setFromObject = function(space) {
    this.left = space.left;
    this.top = space.top;
    this.right = space.right;
    return this.bottom = space.bottom;
  };


  /**
  * Sets the coordinates of the space.
  *
  * @method set
  * @param {number} left - Space at the left in pixels.
  * @param {number} top - Space at the top in pixels.
  * @param {number} right - Space at the right in pixels.
  * @param {number} bottom - Space at the bottom in pixels.
   */

  Space.prototype.set = function(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    return this.bottom = bottom;
  };


  /**
  * Creates a new space object from an array of coordinates.
  *
  * @method fromArray
  * @static
  * @param {number[]} array - An array of coordinates (left, top right, bottom).
   */

  Space.fromArray = function(array) {
    return new ui.Space(array[0], array[1], array[2], array[3]);
  };

  return Space;

})();

ui.Space = Space;

Style = (function() {

  /**
  * A UI style can applied to a UI object to modify it properties like color, image, etc. to give a certain "style" to it.
  *
  * @module ui
  * @class Style
  * @memberof ui
  * @constructor
  * @param {Object} descriptor - A style-descriptor to initialize the style from.
  * @param {number} id - A unique numeric ID to access the style through UIManager.stylesById collection.
  * @param {number} selector - A selector ID which controls under which conditions the styles will be applied.
   */
  function Style(descriptor, id, selector) {

    /**
    * ID number to quickly access this style and link to this style.
    * @property id
    * @type number
     */
    this.id = id;

    /**
    * Style-ID of target object. This style will only be applied on UI objects with that style ID which are
    * children of UI objects where this style is applied.
    * @property target
    * @type number
     */
    this.target = -1;

    /**
    * Selector-ID which controls under which conditions the style becomes active.
    * @property selector
    * @type number
     */
    this.selector = selector;

    /**
    * The font used for the text-display.
    * @default null
    * @property font
    * @type gs.Font
     */
    this.font = null;

    /**
    * The UI object's image used for visual presentation.
    * @property image
    * @type string
     */
    this.image = null;

    /**
    * The UI object's animations used for visual presentation.
    * @default null
    * @property animations
    * @type Object[]
     */
    this.animations = null;

    /**
    * The UI object's color.
    * @property color
    * @type gs.Color
     */
    this.color = null;

    /**
    * The UI object's anchor-point. For example: An anchor-point with 0,0 places the object with its top-left corner
    * at its position but with an 0.5, 0.5 anchor-point the object is placed with its center. An anchor-point of 1,1
    * places the object with its lower-right corner.
    * @property anchor
    * @type gs.Point
     */
    this.anchor = null;

    /**
    * The UI object's zoom-setting for x and y axis.
    * @default new gs.Point(1.0, 1.0)
    * @property zoom
    * @type gs.Point
     */
    this.zoom = null;

    /**
    * The UI object's margin. The margin defines an extra space around the UI object. 
    * The default is { left: 0, top: 0, right: 0, bottom: 0 }.
    * @property margin
    * @type Object
     */
    this.margin = null;

    /**
    * The UI object's padding. The default is { left: 0, top: 0, right: 0, bottom: 0 }.
    * @property padding
    * @type Object
     */
    this.padding = null;

    /**
    * The UI object's mask for masking-effects.
    * @property mask
    * @type gs.Mask
     */
    this.mask = null;

    /**
    * The UI object's alignment.
    * @property alignment
    * @type ui.Alignment
     */
    this.alignment = -1;

    /**
    * The UI object's opacity to control transparency. For example: 0 = Transparent, 255 = Opaque, 128 = Semi-Transparent.
    * @property opacity
    * @type number
     */
    this.opacity = -1;

    /**
    * The object's clip-rect for visual presentation.
    * @default null
    * @property clipRect
    * @type gs.Rect
    * @protected
     */
    this.clipRect = null;

    /**
    * The corner-size of the frame.
    * @property frameCornerSize
    * @type number
     */
    this.frameCornerSize = -1;

    /**
    * The thickness of the frame.
    * @property frameThickness
    * @type number
     */
    this.frameThickness = -1;

    /**
    * The looping of the image.
    * @property looping
    * @type ui.Orientation
     */
    this.looping = null;

    /**
    * The object's z-index controls rendering-order/image-overlapping. An object with a smaller z-index is rendered
    * before an object with a larger index. For example: To make sure a game object is always on top of the screen, it
    * should have the largest z-index of all game objects.
    * @property zIndex
    * @type number
     */
    this.zIndex = -1;

    /**
    * The object's alignment on x-axis. Needs to be supported by layout.
    * @property alignmentX
    * @type number
     */
    this.alignmentX = -1;

    /**
    * The object's alignment on y-axis. Needs to be supported by layout.
    * @property alignmentY
    * @type number
     */
    this.alignmentY = -1;

    /**
    * The object's resize behavior.
    * @property resizable
    * @type boolean
     */
    this.resizable = null;

    /**
    * The original style descriptor.
    * @property descriptor
    * @type Object
     */
    this.descriptor = descriptor;
    if (descriptor) {
      this.setFromDescriptor(descriptor);
    }
  }


  /**
  * Initializes the style from a style-descriptor.
  *
  * @method setFromDescriptor
  * @param {Object} descriptor - The style-descriptor.
   */

  Style.prototype.setFromDescriptor = function(descriptor) {
    this.descriptor = descriptor;
    this.image = descriptor.image;
    if (descriptor.color) {
      this.color = gs.Color.fromArray(descriptor.color);
    }
    if (descriptor.anchor) {
      this.anchor = new gs.Point(descriptor.anchor[0], descriptor.anchor[1]);
    }
    if (descriptor.zoom) {
      this.zoom = new gs.Point(descriptor.zoom[0], descriptor.zoom[1]);
    }
    if (descriptor.font) {
      this.setupFont(descriptor);
    }
    if (descriptor.clipRect) {
      this.clipRect = gs.Rect.fromArray(descriptor.clipRect);
    }
    if (descriptor.opacity >= 0) {
      this.opacity = descriptor.opacity;
    }
    if (descriptor.alignment >= 0) {
      this.alignment = descriptor.alignment;
    }
    if (descriptor.margin) {
      this.margin = ui.Space.fromArray(descriptor.margin);
    }
    if (descriptor.padding) {
      this.padding = ui.Space.fromArray(descriptor.padding);
    }
    this.animations = descriptor.animations;
    if (descriptor.frameCornerSize) {
      this.frameCornerSize = descriptor.frameCornerSize;
    }
    if (descriptor.frameThickness) {
      this.frameThickness = descriptor.frameThickness;
    }
    if (descriptor.frame) {
      this.frame = descriptor.frame;
    }
    if (descriptor.looping) {
      this.looping = descriptor.looping;
    }
    if (descriptor.resizable != null) {
      this.resizable = descriptor.resizable;
    }
    if (descriptor.zIndex) {
      this.zIndex = descriptor.zIndex;
    }
    if (descriptor.alignmentX) {
      this.alignmentX = ui.UIManager.alignments[descriptor.alignmentX];
    }
    if (descriptor.alignmentY) {
      return this.alignmentY = ui.UIManager.alignments[descriptor.alignmentY];
    }
  };

  Style.prototype.set = function(style) {
    this.image = style.image;
    this.color.setFromObject(style.color);
    this.anchor.set(style.anchor.x, style.anchor.y);
    this.zoom.set(style.zoom.x, style.zoom.y);
    if (style.font) {
      if (!this.font) {
        this.font = new gs.Font(style.font.name, style.font.size);
      }
      this.font.set(style.font);
    }
    if (style.clipRect) {
      if (!this.clipRect) {
        this.clipRect = new gs.Rect();
      }
      this.clipRect.setFromObject(style.clipRect);
    }
    this.opacity = style.opacitz;
    this.alignment = style.alignment;
    this.margin.setFromObject(style.margin);
    return this.padding.setFromObject(style.padding);
  };


  /**
  * Initializes font-data from a style-descriptor.
  *
  * @method setupFont
  * @param {Object} descriptor - The style-descriptor.
  * @protected
   */

  Style.prototype.setupFont = function(descriptor) {
    var ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (descriptor.font) {
      if (!this.font) {
        this.font = new Font(descriptor.font.name, (ref = descriptor.font.size) != null ? ref : 0);
      } else {
        this.font.name = descriptor.font.name;
        this.font.size = (ref1 = descriptor.font.size) != null ? ref1 : 0;
      }
      this.font.bold = (ref2 = descriptor.font.bold) != null ? ref2 : this.font.bold;
      this.font.italic = (ref3 = descriptor.font.italic) != null ? ref3 : this.font.italic;
      this.font.smallCaps = (ref4 = descriptor.font.smallCaps) != null ? ref4 : this.font.smallCaps;
      this.font.underline = (ref5 = descriptor.font.underline) != null ? ref5 : this.font.underline;
      this.font.strikeThrough = (ref6 = descriptor.font.strikeThrough) != null ? ref6 : this.font.strikeThrough;
      if (descriptor.font.color != null) {
        this.font.color.setFromArray(descriptor.font.color);
      }
      if (descriptor.font.border != null) {
        this.font.border = (ref7 = descriptor.font.border) != null ? ref7 : false;
        this.font.borderSize = (ref8 = descriptor.font.borderSize) != null ? ref8 : 4;
        this.font.borderColor.set(0, 0, 0, 255);
      }
      if (descriptor.font.outline != null) {
        this.font.border = (ref9 = descriptor.font.outline) != null ? ref9 : false;
        this.font.borderSize = (ref10 = descriptor.font.outline.size) != null ? ref10 : 4;
        if (descriptor.font.outline.color != null) {
          return this.font.borderColor.setFromArray(descriptor.font.outline.color);
        } else {
          return this.font.borderColor.set(0, 0, 0, 255);
        }
      }
    }
  };


  /**
  * Applies the style to a UI object.
  *
  * @method apply
  * @param {ui.Object_UIElement} object - The UI object where the style should be applied to.
   */

  Style.prototype.apply = function(object) {
    var ref;
    if (!object.activeStyles.contains(this)) {
      object.activeStyles.push(this);
      if (this.font) {
        if ((ref = object.font) != null) {
          ref.set(this.font);
        }
      }
      if (this.color) {
        object.color.set(this.color);
      }
      if (this.image) {
        object.image = this.image;
      }
      if (this.anchor) {
        object.anchor.set(this.anchor.x, this.anchor.y);
      }
      if (this.zoom) {
        object.zoom.set(this.zoom.x, this.zoom.y);
      }
      if (this.padding) {
        object.padding.setFromObject(this.padding);
      }
      if (this.margin) {
        object.margin.setFromObject(this.margin);
      }
      if (this.opacity >= 0) {
        object.opacity = this.opacity;
      }
      if (this.alignment >= 0) {
        object.alignment = this.alignment;
      }
      if (this.frameThickness >= 0) {
        object.frameThickness = this.frameThickness;
      }
      if (this.frameCornerSize >= 0) {
        object.frameCornerSize = this.frameCornerSize;
      }
      if (this.mask) {
        object.mask.set(this.mask);
      }
      if (this.zIndex >= 0) {
        object.zIndex = this.zIndex;
      }
      if (this.alignmentX >= 0) {
        object.alignmentX = this.alignmentX;
      }
      if (this.alignmentY >= 0) {
        object.alignmentY = this.alignmentY;
      }
      if (this.resizable != null) {
        object.resizable = this.resizable;
      }
      this.applyLooping(object);
      return this.applyAnimations(object);
    }
  };


  /**
  * Applies the looping-data of the style to a UI object.
  *
  * @method applyLooping
  * @param {ui.Object_UIElement} object - The UI object where the looping-data should be applied to.
  * @protected
   */

  Style.prototype.applyLooping = function(object) {
    if (this.looping) {
      if (!object.visual.looping) {
        object.visual.dispose();
        object.removeComponent(object.visual);
        object.visual = new gs.Component_TilingSprite();
        object.addComponent(object.visual);
      }
      object.visual.looping.vertical = this.looping.vertical;
      return object.visual.looping.horizontal = this.looping.horizontal;
    }
  };


  /**
  * Applies the animation-data of the style to a UI object. This automatically adds an animation-handler
  * component(ui.Component_AnimationHandler) with the id "animationHandler" to the UI object if not already exists.
  *
  * @method applyAnimations
  * @param {ui.Object_UIElement} object - The UI object where the animation-data should be applied to.
  * @protected
   */

  Style.prototype.applyAnimations = function(object) {
    if (this.animations) {
      object.animations = Object.deepCopy(this.animations);
      if (!object.findComponentById("animationHandler")) {
        object.animationExecutor = new ui.Component_AnimationExecutor();
        object.addComponent(new ui.Component_AnimationHandler(), "animationHandler");
        return object.addComponent(object.animationExecutor, "animationExecutor");
      }
    }
  };


  /**
  * Reverts the changes from a UI object made by this style. However, this resets all styleable properties
  * were set by this style. So it is necessary to apply all other styles again, but that is already handles in
  * ui.Component_UIBehavior.
  *
  * @method revert
  * @param {ui.Object_UIElement} object - The UI object where the style should be reverted.
   */

  Style.prototype.revert = function(object) {
    var activeStyles, i1, j, j1, k1, l, l1, n, o, p, q, s, t, u, w, x, y, z;
    activeStyles = object.activeStyles;
    if (object.activeStyles.contains(this)) {
      object.activeStyles.remove(this);
      if (this.font) {
        object.font.set(gs.Fonts.TEXT);
        for (j = activeStyles.length - 1; j >= 0; j += -1) {
          s = activeStyles[j];
          if (s.font) {
            object.font.set(s.font);
            break;
          }
        }
      }
      if (this.color) {
        object.color.set(Color.WHITE);
        for (l = activeStyles.length - 1; l >= 0; l += -1) {
          s = activeStyles[l];
          if (s.color) {
            object.color.set(s.color);
            break;
          }
        }
      }
      if (this.image) {
        object.image = null;
        for (n = activeStyles.length - 1; n >= 0; n += -1) {
          s = activeStyles[n];
          if (s.image) {
            object.image = s.image;
            break;
          }
        }
      }
      if (this.anchor) {
        object.anchor.set(0, 0);
        for (o = activeStyles.length - 1; o >= 0; o += -1) {
          s = activeStyles[o];
          if (s.anchor) {
            object.anchor.setFromObject(s.anchor);
            break;
          }
        }
      }
      if (this.zoom) {
        object.zoom.set(1.0, 1.0);
        for (p = activeStyles.length - 1; p >= 0; p += -1) {
          s = activeStyles[p];
          if (s.zoom) {
            object.zoom.setFromObject(s.zoom);
            break;
          }
        }
      }
      if (this.padding) {
        object.padding.set(0, 0, 0, 0);
        for (q = activeStyles.length - 1; q >= 0; q += -1) {
          s = activeStyles[q];
          if (s.padding) {
            object.padding.setFromObject(s.padding);
            break;
          }
        }
      }
      if (this.margin) {
        object.margin.set(0, 0, 0, 0);
        for (t = activeStyles.length - 1; t >= 0; t += -1) {
          s = activeStyles[t];
          if (s.margin) {
            object.margin.setFromObject(s.margin);
            break;
          }
        }
      }
      if (this.opacity >= 0) {
        object.opacity = 255;
        for (u = activeStyles.length - 1; u >= 0; u += -1) {
          s = activeStyles[u];
          if (s.opacity >= 0) {
            object.opacity = s.opacity;
            break;
          }
        }
      }
      if (this.alignment >= 0) {
        object.alignment = 0;
        for (w = activeStyles.length - 1; w >= 0; w += -1) {
          s = activeStyles[w];
          if (s.alignment >= 0) {
            object.alignment = s.alignment;
            break;
          }
        }
      }
      if (this.frameCornerSize >= 0) {
        object.frameCornerSize = 16;
        for (x = activeStyles.length - 1; x >= 0; x += -1) {
          s = activeStyles[x];
          if (s.frameCornerSize >= 0) {
            object.frameCornerSize = s.frameCornerSize;
            break;
          }
        }
      }
      if (this.frameThickness >= 0) {
        object.frameThickness = 16;
        for (y = activeStyles.length - 1; y >= 0; y += -1) {
          s = activeStyles[y];
          if (s.frameThickness >= 0) {
            object.frameThickness = s.frameThickness;
            break;
          }
        }
      }
      if (this.mask) {
        object.mask.set(null);
        for (z = activeStyles.length - 1; z >= 0; z += -1) {
          s = activeStyles[z];
          if (s.mask) {
            object.mask.set(s.font);
            break;
          }
        }
      }
      if (this.zIndex >= 0) {
        object.zIndex = 0;
        for (i1 = activeStyles.length - 1; i1 >= 0; i1 += -1) {
          s = activeStyles[i1];
          if (s.zIndex >= 0) {
            object.zIndex = s.zIndex;
            break;
          }
        }
      }
      if (this.alignmentX >= 0) {
        object.alignmentX = 0;
        for (j1 = activeStyles.length - 1; j1 >= 0; j1 += -1) {
          s = activeStyles[j1];
          if (s.alignmentX >= 0) {
            object.alignmentX = s.alignmentX;
            break;
          }
        }
      }
      if (this.alignmentY >= 0) {
        object.alignmentY = 0;
        for (k1 = activeStyles.length - 1; k1 >= 0; k1 += -1) {
          s = activeStyles[k1];
          if (s.alignmentY >= 0) {
            object.alignmentY = s.alignmentY;
            break;
          }
        }
      }
      if (this.resizable != null) {
        object.resizable = false;
        for (l1 = activeStyles.length - 1; l1 >= 0; l1 += -1) {
          s = activeStyles[l1];
          if (s.resizable != null) {
            object.resizable = s.resizable;
            break;
          }
        }
      }
      this.revertAnimations(object);
      return this.revertLooping(object);
    }
  };


  /**
  * Reverts the animation-data changes applied to a UI object by this style.
  *
  * @method revertAnimations
  * @param {ui.Object_UIElement} object - The UI object where the animation-data changes should be reverted.
   */

  Style.prototype.revertAnimations = function(object) {
    var activeStyles, j, results, s;
    activeStyles = object.activeStyles;
    if (this.animations) {
      object.animations = null;
      results = [];
      for (j = activeStyles.length - 1; j >= 0; j += -1) {
        s = activeStyles[j];
        if (s.animations) {
          object.animations = Object.deepCopy(s.animations);
          if (!object.findComponentById("animationHandler")) {
            results.push(object.addComponent(new ui.Component_AnimationHandler(), "animationHandler"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Reverts the looping-data changes applied to a UI object by this style.
  *
  * @method revertLooping
  * @param {ui.Object_UIElement} object - The UI object where the looping-data changes should be reverted.
   */

  Style.prototype.revertLooping = function(object) {
    var activeStyles, j, results, s;
    activeStyles = object.activeStyles;
    if (this.looping) {
      object.visual.looping.vertical = false;
      object.visual.looping.horizontal = false;
      results = [];
      for (j = activeStyles.length - 1; j >= 0; j += -1) {
        s = activeStyles[j];
        if (s.looping) {
          if (!object.visual.looping) {
            object.visual.dispose();
            object.removeComponent(object.visual);
            object.visual = new gs.Component_TilingSprite();
            object.addComponent(object.visual);
          }
          object.visual.looping.vertical = s.looping.vertical;
          results.push(object.visual.looping.horizontal = s.looping.horizontal);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  return Style;

})();

ui.Style = Style;

UIManager = (function() {

  /**
  * Handles the creation of In Game UI elements. For more information about
  * In-Game UI see help file.
  *
  * @module ui
  * @class UIManager
  * @memberof ui
  * @constructor
   */
  function UIManager() {

    /**
    * Stores all registered UI layouts by name/id.
    * @property layouts
    * @type Object
     */
    this.layouts = {};

    /**
    * Stores all registered UI styles by name/id.
    * @property styles
    * @type Object
     */
    this.styles = {};

    /**
    * Stores all UI styles by number id.
    * @property stylesById
    * @type ui.Style[]
     */
    this.stylesById = new Array();

    /**
    * Stores all UI styles by style-name.
    * @property stylesByName
    * @type Object
     */
    this.stylesByName = {};

    /**
    * Stores all registered custom UI types/templates by name/id.
    * @property customTypes
    * @type Object
     */
    this.customTypes = {};

    /**
    * Stores all registered UI controllers by name/id.
    * @property customTypes
    * @type Object
     */
    this.controllers = {};

    /**
    * Stores all registered UI data sources by name/id.
    * @property customTypes
    * @type Object
     */
    this.dataSources = {};

    /**
    * Mapping to table to map alignment names to number values.
    * @property alignments
    * @type Object
    * @protected
     */
    this.alignments = {
      "left": 0,
      "top": 0,
      "center": 1,
      "bottom": 2,
      "right": 2,
      "0": 0,
      "1": 1,
      "2": 2
    };

    /**
    * Mapping to table to map blend-mode names to number values.
    * @property blendModes
    * @type Object
    * @protected
     */
    this.blendModes = {
      "normal": 0,
      "add": 1,
      "sub": 2
    };

    /**
    * Mapping to table to map selector names to number values.
    * @property selectors
    * @type Object
     */
    this.selectors = {
      normal: 0,
      hover: 1,
      selected: 2,
      enabled: 3,
      focused: 4
    };
    this.defaultPlaceholderParams = {};
  }


  /**
  * Sets up UI Manager, optimizes styles, etc.
  *
  * @method setup
   */

  UIManager.prototype.setup = function() {
    return this.setupStyles();
  };


  /**
  * Sets up the UI styles by wrapping them into ui.Style objects and optimizing the access.
  *
  * @method setupStyles
  * @protected
   */

  UIManager.prototype.setupStyles = function() {
    var id, k, ref, selector, selectorMap, subs;
    id = 0;
    selectorMap = this.selectors;
    for (k in this.styles) {
      subs = k.split(" ");
      selector = subs[0].split(":");
      if (selectorMap[selector[1]]) {
        this.stylesById[id] = new ui.Style(this.styles[k], id, selectorMap[selector[1]]);
      } else {
        this.stylesById[id] = new ui.Style(this.styles[k], id, 0);
      }
      if (!this.stylesByName[selector[0]]) {
        this.stylesByName[selector[0]] = [];
      }
      this.stylesByName[selector[0]].push(this.stylesById[id]);
      this.styles[k] = this.stylesById[id];
      id++;
    }
    for (k in this.styles) {
      subs = k.split(" ");
      if (subs.length > 1) {
        this.stylesByName[subs[1]].push(this.styles[k]);
        this.styles[k].target = (ref = this.styles[k.split(":")[0]]) != null ? ref.id : void 0;
      }
    }
    return null;
  };


  /**
  * Executes all placeholder formulas in the specified descriptor. The descriptor will be changed
  * and placeholder formulas are replaced with their evaluated result value.
  *
  * @method executePlaceholderFormulas
  * @param {Object} descriptor - The descriptor.
  * @param {Object} params - Object containing the placeholder params.
  * @protected
   */

  UIManager.prototype.executePlaceholderFormulas = function(descriptor, id, params) {
    var c, i, j, k, keys, l, len, len1, v;
    if (descriptor == null) {
      return;
    }
    keys = Object.keys(descriptor);
    for (j = 0, len = keys.length; j < len; j++) {
      k = keys[j];
      v = descriptor[k];
      if (v != null) {
        if (v instanceof Array) {
          for (c = l = 0, len1 = v.length; l < len1; c = ++l) {
            i = v[c];
            if (i != null) {
              if (typeof i === "object") {
                this.executePlaceholderFormulas(i, id, params);
              } else if (c !== "exec" && typeof i === "function") {
                window.p = params || this.defaultPlaceholderParams;
                window.d = descriptor;
                v[c] = i();
              }
            }
          }
        } else if (typeof v === "object") {
          this.executePlaceholderFormulas(v, id, params);
        } else if (k !== "exec_" && typeof v === "function") {
          window.p = params || this.defaultPlaceholderParams;
          window.d = descriptor;
          descriptor[k] = v();
        }
      }
    }
    return null;
  };


  /**
  * Creates a calculation for a specified expression.
  *
  * @method createCalcFunction
  * @param {String} expression - The expression to create a calculation function for.
  * @return {Function} The calculation function.
  * @protected
   */

  UIManager.prototype.createCalcFunction = function(expression) {
    expression = expression.replace(/([0-9]+)%/gm, "($1 / 100 * v)");
    return eval("(function(v){ return " + expression + "})");
  };


  /**
  * Creates an object from the specified object type. The type has the format
  * <namespace>.<typename> like vn.Component_Hotspot.
  *
  * @method createObject
  * @param {String} type - The type name.
  * @return {Object} The created object.
  * @protected
   */

  UIManager.prototype.createObject = function(type) {
    var subs;
    subs = type.split(".");
    return new window[subs[0]][subs[1]]();
  };


  /**
  * Creates an UI object from a specified UI descriptor.
  *
  * @method createFromDescriptor
  * @param {Object} descriptor - The UI object descriptor.
  * @param {gs.Object_UIElement} parent - The UI parent object. (A layout for example).
  * @return {gs.Object_UIElement} The created UI object.
   */

  UIManager.prototype.createFromDescriptor = function(descriptor, parent) {
    var control, k;
    control = null;
    for (k in this.controllers) {
      if (this.controllers[k].type != null) {
        this.controllers[k] = this.createObject(this.controllers[k].type);
      }
    }
    return this._createFromDescriptor(descriptor, parent);
  };


  /**
  * Creates an image button UI object.
  *
  * @method createImageButton
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createImageButton = function(descriptor) {
    var control;
    control = new ui.Object_Hotspot(descriptor.image, descriptor.imageHandling);
    control.behavior.sound = descriptor.sound;
    control.behavior.sounds = descriptor.sounds;
    control.image = descriptor.image;
    control.images = descriptor.images;
    if (descriptor.imageFolder != null) {
      control.imageFolder = descriptor.imageFolder;
    }
    if (descriptor.looping != null) {
      control.visual.dispose();
      control.removeComponent(control.visual);
      control.visual = new gs.Component_TilingSprite();
      control.addComponent(control.visual);
      control.visual.looping.vertical = descriptor.looping.vertical;
      control.visual.looping.horizontal = descriptor.looping.horizontal;
    }
    if (descriptor.color != null) {
      control.color = Color.fromArray(descriptor.color);
    }
    return control;
  };


  /**
  * Creates an image UI object.
  *
  * @method createImage
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createImage = function(descriptor) {
    var control;
    control = new ui.Object_Image(descriptor.image, descriptor.imageHandling);
    if (descriptor.imageFolder != null) {
      control.imageFolder = descriptor.imageFolder;
    }
    if (descriptor.looping != null) {
      control.visual.dispose();
      control.removeComponent(control.visual);
      control.visual = new gs.Component_TilingSprite();
      control.addComponent(control.visual);
      control.visual.looping.vertical = descriptor.looping.vertical;
      control.visual.looping.horizontal = descriptor.looping.horizontal;
    }
    if (descriptor.color != null) {
      control.color = Color.fromArray(descriptor.color);
    }
    return control;
  };


  /**
  * Creates an image map UI object.
  *
  * @method createImageMap
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createImageMap = function(descriptor) {
    var control;
    control = new ui.Object_ImageMap();
    control.hotspots = (descriptor.hotspots || []).select(function(h) {
      return {
        x: h.rect[0],
        y: h.rect[1],
        size: {
          width: h.rect[2],
          height: h.rect[3]
        },
        data: {
          action: 3,
          actions: h.actions
        }
      };
    });
    control.images = descriptor.images;
    control.insertComponent(new ui.Component_ActionHandler(), 1, "actionHandler");
    control.target = SceneManager.scene.behavior;
    return control;
  };


  /**
  * Creates a video UI object.
  *
  * @method createVideo
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createVideo = function(descriptor) {
    var control, ref;
    control = new ui.Object_Video();
    control.video = descriptor.video;
    control.loop = (ref = descriptor.loop) != null ? ref : true;
    return control;
  };


  /**
  * Creates a panel UI object.
  *
  * @method createPanel
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createPanel = function(descriptor) {
    var control, ref;
    control = new ui.Object_Panel();
    control.modal = (ref = descriptor.modal) != null ? ref : false;
    if (descriptor.color != null) {
      control.color = Color.fromArray(descriptor.color);
    }
    return control;
  };


  /**
  * Creates a frame UI object.
  *
  * @method createFrame
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createFrame = function(descriptor) {
    var control;
    control = new ui.Object_Frame(descriptor.frameSkin);
    control.frameThickness = descriptor.frameThickness || 16;
    control.frameCornerSize = descriptor.frameCornerSize || 16;
    control.image = descriptor.image;
    control.images = descriptor.images;
    return control;
  };


  /**
  * Creates a three-part image UI object.
  *
  * @method createThreePartImage
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createThreePartImage = function(descriptor) {
    var control;
    control = new ui.Object_ThreePartImage(descriptor.frameSkin);
    control.firstPartSize = descriptor.firstPartSize || 16;
    control.middlePartSize = descriptor.middlePartSize || 1;
    control.lastPartSize = descriptor.lastPartSize || 16;
    control.image = descriptor.image;
    control.images = descriptor.images;
    return control;
  };


  /**
  * Creates a text UI object.
  *
  * @method createText
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createText = function(descriptor) {
    var control, ref;
    control = new ui.Object_Text();
    control.text = lcs(descriptor.text);
    control.sizeToFit = descriptor.sizeToFit;
    control.formatting = descriptor.formatting;
    control.wordWrap = (ref = descriptor.wordWrap) != null ? ref : false;
    control.behavior.format = descriptor.format;
    if (descriptor.textPadding) {
      control.behavior.padding = ui.Space.fromArray(descriptor.textPadding);
    }
    if (descriptor.resolvePlaceholders != null) {
      control.resolvePlaceholders = descriptor.resolvePlaceholders;
    }
    if (descriptor.color != null) {
      control.color = Color.fromArray(descriptor.color);
    }
    return control;
  };


  /**
  * Creates a free-layout UI object.
  *
  * @method createFreeLayout
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createFreeLayout = function(descriptor) {
    var control;
    if (descriptor.frame != null) {
      control = new ui.Object_FreeLayout(descriptor.frame[0] || 0, descriptor.frame[1] || 0, descriptor.frame[2] || 1, descriptor.frame[3] || 1);
    } else {
      control = new ui.Object_FreeLayout(0, 0, 1, 1);
    }
    control.sizeToFit = descriptor.sizeToFit;
    return control;
  };


  /**
  * Creates a stack-layout UI object.
  *
  * @method createStackLayout
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createStackLayout = function(descriptor) {
    var control;
    if (descriptor.frame != null) {
      control = new ui.Object_StackLayout(descriptor.frame[0] || 0, descriptor.frame[1] || 0, descriptor.frame[2] || 1, descriptor.frame[3] || 1, descriptor.orientation);
    } else {
      control = new ui.Object_StackLayout(0, 0, 1, 1, descriptor.orientation);
    }
    control.sizeToFit = descriptor.sizeToFit;
    return control;
  };


  /**
  * Creates a spread-layout UI object.
  *
  * @method createSpreadLayout
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createSpreadLayout = function(descriptor) {
    var control;
    if (descriptor.frame != null) {
      control = new ui.Object_SpreadLayout(descriptor.frame[0] || 0, descriptor.frame[1] || 0, descriptor.frame[2] || 1, descriptor.frame[3] || 1, descriptor.orientation);
    } else {
      control = new ui.Object_SpreadLayout(0, 0, 1, 1, descriptor.orientation);
    }
    return control;
  };


  /**
  * Creates a grid-layout UI object.
  *
  * @method createGridLayout
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createGridLayout = function(descriptor) {
    var control;
    if (descriptor.frame != null) {
      control = new ui.Object_GridLayout(descriptor.frame[0], descriptor.frame[1], descriptor.frame[2], descriptor.frame[3], descriptor.rows, descriptor.columns, descriptor.template);
    } else {
      control = new ui.Object_GridLayout(0, 0, 1, 1, descriptor.rows, descriptor.columns, descriptor.template);
    }
    control.cellSpacing = descriptor.cellSpacing || [0, 0, 0, 0];
    control.sizeToFit = descriptor.sizeToFit;
    return control;
  };


  /**
  * Creates a message UI object.
  *
  * @method createMessage
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createMessage = function(descriptor) {
    var control;
    control = new ui.Object_Message();
    return control;
  };


  /**
  * Creates a data-grid UI object.
  *
  * @method createDataGrid
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created image button UI object.
   */

  UIManager.prototype.createDataGrid = function(descriptor) {
    var control;
    control = new ui.Object_DataGrid(descriptor);
    return control;
  };


  /**
  * Creates an UI object depending on the object-type of the specified UI descriptor.
  *
  * @method createControl
  * @param {Object} descriptor - The UI object descriptor.
  * @return {gs.Object_UIElement} The created UI object.
  * @protected
   */

  UIManager.prototype.createControl = function(descriptor) {
    var control;
    control = null;
    switch (descriptor.type) {
      case "ui.ImageButton":
        control = this.createImageButton(descriptor);
        break;
      case "ui.Image":
        control = this.createImage(descriptor);
        break;
      case "ui.ImageMap":
        control = this.createImageMap(descriptor);
        break;
      case "ui.Video":
        control = this.createVideo(descriptor);
        break;
      case "ui.Panel":
        control = this.createPanel(descriptor);
        break;
      case "ui.Frame":
        control = this.createFrame(descriptor);
        break;
      case "ui.ThreePartImage":
        control = this.createThreePartImage(descriptor);
        break;
      case "ui.Text":
        control = this.createText(descriptor);
        break;
      case "ui.Message":
        control = this.createMessage(descriptor);
        break;
      case "ui.DataGrid":
        control = this.createDataGrid(descriptor);
        break;
      case "ui.FreeLayout":
        control = this.createFreeLayout(descriptor);
        break;
      case "ui.StackLayout":
        control = this.createStackLayout(descriptor);
        break;
      case "ui.SpreadLayout":
        control = this.createSpreadLayout(descriptor);
        break;
      case "ui.GridLayout":
        control = this.createGridLayout(descriptor);
    }
    return control;
  };

  UIManager.prototype.createLayoutRect = function(frame, control) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    if (!control.layoutRect) {
      control.layoutRect = new ui.LayoutRect();
    }
    control.layoutRect.set(0, 0, 0, 0);
    if (frame != null) {
      if (((ref = frame[0]) != null ? ref.length : void 0) != null) {
        control.layoutRect.x = this.createCalcFunction(frame[0]);
        control.dstRect.x = 0;
      } else {
        control.dstRect.x = (ref1 = descriptor.frame[0]) != null ? ref1 : control.dstRect.x;
      }
      if (((ref2 = frame[1]) != null ? ref2.length : void 0) != null) {
        control.layoutRect.y = this.createCalcFunction(frame[1]);
        control.dstRect.y = 0;
      } else {
        control.dstRect.y = (ref3 = frame[1]) != null ? ref3 : control.dstRect.y;
      }
      if (((ref4 = frame[2]) != null ? ref4.length : void 0) != null) {
        control.layoutRect.width = this.createCalcFunction(frame[2]);
        control.dstRect.width = 1;
      } else {
        control.dstRect.width = (ref5 = frame[2]) != null ? ref5 : control.dstRect.width;
      }
      if (((ref6 = frame[3]) != null ? ref6.length : void 0) != null) {
        control.layoutRect.height = this.createCalcFunction(frame[3]);
        return control.dstRect.height = 1;
      } else {
        return control.dstRect.height = (ref7 = frame[3]) != null ? ref7 : control.dstRect.height;
      }
    }
  };


  /**
  * Adds the styles defined in an array of style-names to the specified control.
  *
  * @method addControlStyles
  * @param {Object} control - The control to add the styles to.
  * @param {string[]} styles - Array of style-names to add.
   */

  UIManager.prototype.addControlStyles = function(control, styles) {
    var j, len, results, style, styleName;
    results = [];
    for (j = 0, len = styles.length; j < len; j++) {
      styleName = styles[j];
      if (this.stylesByName[styleName] != null) {
        results.push((function() {
          var l, len1, ref, results1;
          ref = this.stylesByName[styleName];
          results1 = [];
          for (l = 0, len1 = ref.length; l < len1; l++) {
            style = ref[l];
            control.styles.push(style);
            if (style.target === -1 && style.selector === 0) {
              results1.push(style.apply(control));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Creates an UI object from a specified UI descriptor. This method is called
  * recursively for all child-descriptors.
  *
  * @method createControlFromDescriptor
  * @param {Object} descriptor - The UI object descriptor.
  * @param {gs.Object_UIElement} parent - The UI parent object. (A layout for example).
  * @param {number} index - The index.
  * @return {gs.Object_UIElement} The created UI object.
  * @protected
   */

  UIManager.prototype.createControlFromDescriptor = function(descriptor, parent, index) {
    var action, actions, bindings, c, child, childControl, component, control, controls, customFields, data, formulas, i, isNumber, item, j, l, len, len1, len2, len3, m, n, o, p, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref3, ref4, ref5, ref6, ref7, ref8, ref9, style, target, type, typeName, valid;
    control = null;
    if (descriptor.style != null) {
      descriptor.styles = [descriptor.style];
      delete descriptor.style;
    }
    descriptor = Object.deepCopy(descriptor);
    this.executePlaceholderFormulas(descriptor, descriptor.id, descriptor.params);
    control = this.createControl(descriptor);
    if (control == null) {
      type = Object.deepCopy(this.customTypes[descriptor.type]);
      this.executePlaceholderFormulas(type, descriptor.id, descriptor.params);
      typeName = type.type;
      customFields = type.customFields;
      bindings = type.bindings;
      formulas = type.formulas;
      actions = type.actions;
      if (type.style != null) {
        type.styles = [type.style];
        type.style = null;
      }
      Object.mixin(type, descriptor);
      if (customFields != null) {
        Object.mixin(type.customFields, customFields);
      }
      if ((bindings != null) && bindings !== type.bindings) {
        type.bindings = type.bindings.concat(bindings);
      }
      if ((formulas != null) && formulas !== type.formulas) {
        type.formulas = type.formulas.concat(formulas);
      }
      if ((actions != null) && actions !== type.actions) {
        type.actions = actions.concat(type.actions);
      }
      type.type = typeName;
      return this.createControlFromDescriptor(type, parent);
    } else if (parent != null) {
      parent.addObject(control);
      control.index = index;
    } else {
      gs.ObjectManager.current.addObject(control);
    }
    control.ui = new ui.Component_UIBehavior();
    control.addComponent(control.ui);
    control.params = descriptor.params;
    if (descriptor.updateBehavior === "continuous") {
      control.updateBehavior = ui.UpdateBehavior.CONTINUOUS;
    }
    if (descriptor.inheritProperties) {
      control.inheritProperties = true;
    }
    if (descriptor.font != null) {
      control.font = new Font(descriptor.font.name, descriptor.font.size);
      control.font.bold = (ref = descriptor.font.bold) != null ? ref : control.font.bold;
      control.font.italic = (ref1 = descriptor.font.italic) != null ? ref1 : control.font.italic;
      control.font.smallCaps = (ref2 = descriptor.font.smallCaps) != null ? ref2 : control.font.smallCaps;
      control.font.underline = (ref3 = descriptor.font.underline) != null ? ref3 : control.font.underline;
      control.font.strikeThrough = (ref4 = descriptor.font.strikeThrough) != null ? ref4 : control.font.strikeThrough;
      if (descriptor.font.color != null) {
        control.font.color = Color.fromArray(descriptor.font.color);
      }
      if (descriptor.font.border != null) {
        control.font.border = (ref5 = descriptor.font.border) != null ? ref5 : false;
        control.font.borderSize = (ref6 = descriptor.font.borderSize) != null ? ref6 : 4;
        control.font.borderColor = new Color(0, 0, 0);
      }
      if (descriptor.font.outline != null) {
        control.font.border = (ref7 = descriptor.font.outline) != null ? ref7 : false;
        control.font.borderSize = (ref8 = descriptor.font.outline.size) != null ? ref8 : 4;
        if (descriptor.font.outline.color != null) {
          control.font.borderColor = Color.fromArray(descriptor.font.outline.color);
        } else {
          control.font.borderColor = new Color(0, 0, 0);
        }
      }
    }
    if (descriptor.components != null) {
      ref9 = descriptor.components;
      for (j = 0, len = ref9.length; j < len; j++) {
        c = ref9[j];
        m = c.module || "gs";
        component = new window[m][c.type](c.params);
        control.addComponent(component, c.id);
        control[c.id] = component;
      }
    }
    control.focusable = (ref10 = descriptor.focusable) != null ? ref10 : control.focusable;
    if (descriptor.nextKeyObject) {
      control.ui.nextKeyObjectId = descriptor.nextKeyObject;
    }
    if (descriptor.initialFocus) {
      control.ui.focus();
    }
    actions = Object.deepCopy(descriptor.action != null ? [descriptor.action] : descriptor.actions);
    if (actions != null) {
      for (l = 0, len1 = actions.length; l < len1; l++) {
        action = actions[l];
        if (action != null) {
          action.event = (ref11 = action.event) != null ? ref11 : "onAccept";
          if (action.target == null) {
            target = this.controllers != null ? this.controllers[descriptor.target] : controller;
            action.target = target || SceneManager.scene.behavior;
          }
        }
      }
      control.actions = actions;
      if (!control.findComponentById("actionHandler")) {
        control.insertComponent(new ui.Component_ActionHandler(), 1, "actionHandler");
      }
    }
    if (descriptor.id != null) {
      control.id = descriptor.id;
      gs.ObjectManager.current.setObjectById(control, control.id);
    }
    control.descriptor = descriptor;
    control.layoutRect = new Rect();
    control.layoutRect.set(0, 0, 0, 0);
    if (descriptor.frame != null) {
      if (((ref12 = descriptor.frame[0]) != null ? ref12.length : void 0) != null) {
        control.layoutRect.x = this.createCalcFunction(descriptor.frame[0]);
        control.dstRect.x = 0;
      } else {
        control.dstRect.x = (ref13 = descriptor.frame[0]) != null ? ref13 : control.dstRect.x;
      }
      if (((ref14 = descriptor.frame[1]) != null ? ref14.length : void 0) != null) {
        control.layoutRect.y = this.createCalcFunction(descriptor.frame[1]);
        control.dstRect.y = 0;
      } else {
        control.dstRect.y = (ref15 = descriptor.frame[1]) != null ? ref15 : control.dstRect.y;
      }
      if (((ref16 = descriptor.frame[2]) != null ? ref16.length : void 0) != null) {
        control.layoutRect.width = this.createCalcFunction(descriptor.frame[2]);
        control.dstRect.width = 1;
      } else {
        control.dstRect.width = (ref17 = descriptor.frame[2]) != null ? ref17 : control.dstRect.width;
      }
      if (((ref18 = descriptor.frame[3]) != null ? ref18.length : void 0) != null) {
        control.layoutRect.height = this.createCalcFunction(descriptor.frame[3]);
        control.dstRect.height = 1;
      } else {
        control.dstRect.height = (ref19 = descriptor.frame[3]) != null ? ref19 : control.dstRect.height;
      }
    }
    if (descriptor.sizeToParent != null) {
      control.sizeToParent = descriptor.sizeToParent;
    }
    if (descriptor.blendMode != null) {
      control.blendMode = this.blendModes[descriptor.blendMode];
    }
    if (descriptor.anchor != null) {
      control.anchor.set(descriptor.anchor[0], descriptor.anchor[1]);
    }
    control.opacity = (ref20 = descriptor.opacity) != null ? ref20 : 255;
    if (descriptor.minimumSize != null) {
      control.minimumSize = {
        width: descriptor.minimumSize[0],
        height: descriptor.minimumSize[1]
      };
    }
    if (descriptor.resizable != null) {
      control.resizable = descriptor.resizable;
    }
    if (descriptor.scrollable != null) {
      control.scrollable = descriptor.scrollable;
    }
    if (descriptor.fixedSize != null) {
      control.fixedSize = descriptor.fixedSize;
    }
    if (descriptor.draggable != null) {
      control.draggable = descriptor.draggable;
      control.draggable.step = 0;
      if (control.draggable.rect != null) {
        control.draggable.rect = Rect.fromArray(control.draggable.rect);
      }
      control.addComponent(new ui.Component_Draggable());
    }
    if (descriptor.bindings != null) {
      control.bindings = descriptor.bindings;
      control.insertComponent(new ui.Component_BindingHandler(), 0);
    }
    if (descriptor.formulas != null) {
      control.formulas = descriptor.formulas;
      control.insertComponent(new ui.Component_FormulaHandler(), 0);
    }
    control.dataField = descriptor.dataField;
    control.enabled = (ref21 = descriptor.enabled) != null ? ref21 : true;
    if (descriptor.selectable != null) {
      control.selectable = descriptor.selectable;
    }
    if (descriptor.group != null) {
      control.group = descriptor.group;
      gs.ObjectManager.current.addToGroup(control, control.group);
    }
    if (descriptor.customFields != null) {
      control.customFields = Object.deepCopy(descriptor.customFields);
    }
    if (descriptor.margin != null) {
      control.margin.left = descriptor.margin[0];
      control.margin.top = descriptor.margin[1];
      control.margin.right = descriptor.margin[2];
      control.margin.bottom = descriptor.margin[3];
    }
    if (descriptor.padding != null) {
      control.padding.left = descriptor.padding[0];
      control.padding.top = descriptor.padding[1];
      control.padding.right = descriptor.padding[2];
      control.padding.bottom = descriptor.padding[3];
    }
    if (descriptor.alignment != null) {
      control.alignment = this.alignments[descriptor.alignment];
    }
    control.alignmentY = this.alignments[descriptor.alignmentY || 0];
    control.alignmentX = this.alignments[descriptor.alignmentX || 0];
    control.zIndex = descriptor.zIndex || 0;
    control.order = descriptor.order || 0;
    control.chainOrder = ((ref22 = descriptor.chainOrder) != null ? ref22 : descriptor.zOrder) + ((parent != null ? parent.chainOrder : void 0) || 0);
    if (descriptor.zoom != null) {
      control.zoom = {
        x: descriptor.zoom[0] / 100,
        y: descriptor.zoom[1] / 100
      };
    }
    if (descriptor.visible != null) {
      control.visible = descriptor.visible;
    }
    if (descriptor.clipRect) {
      control.clipRect = new Rect(control.dstRect.x, control.dstRect.y, control.dstRect.width, control.dstRect.height);
    }
    if (descriptor.styles != null) {
      this.addControlStyles(control, descriptor.styles);
    }
    if (descriptor.template != null) {
      control.behavior.managementMode = ui.LayoutManagementMode.fromString(descriptor.managementMode);
      data = ui.Component_FormulaHandler.fieldValue(control, control.dataField);
      isNumber = typeof data === "number";
      if (data != null) {
        for (i = n = 0, ref23 = (ref24 = data.length) != null ? ref24 : data; 0 <= ref23 ? n < ref23 : n > ref23; i = 0 <= ref23 ? ++n : --n) {
          if ((data[i] != null) || isNumber) {
            valid = true;
            if ((descriptor.dataFilter != null) && !isNumber) {
              valid = ui.Component_Handler.checkCondition(data[i], descriptor.dataFilter);
            }
            if (valid || isNumber) {
              child = this.createControlFromDescriptor(descriptor.template, control, i);
              if ((ref25 = data[i]) != null ? ref25.dstRect : void 0) {
                child.dstRect = ui.UIElementRectangle.fromRect(child, data[i].dstRect);
              }
              if ((child.clipRect == null) && (control.clipRect != null)) {
                child.clipRect = control.clipRect;
              }
              control.addObject(child);
              child.index = i;
              child.order = ((ref26 = data.length) != null ? ref26 : data) - i;
              control.controls.push(child);
            }
          }
        }
      }
    }
    if (descriptor.controls && descriptor.controls.exec) {
      controls = ui.Component_FormulaHandler.fieldValue(descriptor, descriptor.controls);
    } else {
      controls = descriptor.controls;
    }
    if (controls != null) {
      for (i = o = 0, len2 = controls.length; o < len2; i = ++o) {
        item = controls[i];
        childControl = this._createFromDescriptor(item, control, i);
        if ((childControl.clipRect == null) && (control.clipRect != null)) {
          childControl.clipRect = control.clipRect;
        }
        childControl.index = i;
        childControl.origin.x = control.origin.x + control.dstRect.x;
        childControl.origin.y = control.origin.y + control.dstRect.y;
        control.addObject(childControl);
        control.controls.push(childControl);
      }
    }
    if (control.styles && control.parentsByStyle) {
      parent = control.parent;
      while (parent) {
        if (parent.styles) {
          ref27 = parent.styles;
          for (p = 0, len3 = ref27.length; p < len3; p++) {
            style = ref27[p];
            if (!control.parentsByStyle[style.id]) {
              control.parentsByStyle[style.id] = [];
            }
            control.parentsByStyle[style.id].push(parent);
          }
        }
        parent = parent.parent;
      }
    }
    if (descriptor.animations != null) {
      control.animations = Object.deepCopy(descriptor.animations);
      control.animationExecutor = new ui.Component_AnimationExecutor();
      control.addComponent(control.animationExecutor);
      control.addComponent(new ui.Component_AnimationHandler());
    }
    control.ui.updateStyle();
    control.setup();
    return control;
  };


  /**
  * Creates an UI object from a specified UI descriptor.
  *
  * @method _createFromDescriptor
  * @param {Object} descriptor - The UI object descriptor.
  * @param {gs.Object_UIElement} parent - The UI parent object. (A layout for example).
  * @return {gs.Object_UIElement} The created UI object.
  * @protected
   */

  UIManager.prototype._createFromDescriptor = function(descriptor, parent, index) {
    var control, controller;
    control = this.createControlFromDescriptor(descriptor, parent, index);
    if (descriptor.controller != null) {
      controller = this.controllers[descriptor.controller];
      control.controller = controller;
      control.addComponent(controller);
    }
    return control;
  };

  UIManager.prototype.createLayoutFromDescriptor = function(descriptor, parent, index) {
    return this._createFromDescriptor(descriptor, parent, index);
  };

  return UIManager;

})();

Graphics.width = $PARAMS.resolution.width;

Graphics.height = $PARAMS.resolution.height;

ui.UiFactory = new UIManager();

ui.UIManager = ui.UiFactory;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7OztFQVlhLGlCQUFDLENBQUQsRUFBSSxJQUFKLEVBQVUsS0FBVjs7QUFDVDs7Ozs7QUFBQSxRQUFBO0lBS0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7O0lBS0EsSUFBQyxDQUFBLElBQUQsR0FBUTs7QUFFUjs7Ozs7SUFLQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7Ozs7SUFNQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsS0FBQSxDQUFNLEVBQU47QUFDZixTQUF5Qiw4RkFBekI7TUFBQSxJQUFDLENBQUEsT0FBUSxDQUFBLENBQUEsQ0FBVCxHQUFjO0FBQWQ7O0FBRUE7Ozs7OztJQU1BLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxLQUFBLENBQU0sRUFBTjtBQUNmLFNBQTBCLG1HQUExQjtNQUFBLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFULEdBQWM7QUFBZDtFQTdDUzs7O0FBZ0RiOzs7OztvQkFJQSxJQUFBLEdBQU0sU0FBQTtBQUNILFFBQUE7SUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQTtJQUNULENBQUEsR0FBSSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBYSxJQUFiLEVBQW1CLFNBQW5CO0lBQ0osSUFBQyxDQUFBLFlBQUQsR0FBZ0I7QUFFaEIsV0FBTztFQUxKOzs7QUFPTjs7Ozs7Ozs7b0JBT0EsUUFBQSxHQUFVLFNBQUMsV0FBRDtBQUNOLFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQVQsS0FBZTtJQUN4QixJQUFDLENBQUEsT0FBUSxDQUFBLENBQUEsQ0FBVCxHQUFjO0FBRWQsV0FBTztFQUpEOzs7QUFNVjs7Ozs7Ozs7b0JBT0Es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Q0FBeUIsSUFBQSxFQUFFLENBQUMsMEJBQUgsQ0FBQSxDQUF6QixFQUpKOztJQU1BLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBWCxDQUFBO0lBQ0EsT0FBTyxDQUFDLEtBQVIsQ0FBQTtBQUVBLFdBQU87RUFsU2tCOzs7QUFvUzdCOzs7Ozs7Ozs7O3NCQVNBLHFCQUFBLEdBQXVCLFNBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsS0FBckI7QUFDbkIsUUFBQTtJQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsMkJBQUQsQ0FBNkIsVUFBN0IsRUFBeUMsTUFBekMsRUFBaUQsS0FBakQ7SUFFVixJQUFHLDZCQUFIO01BQ0ksVUFBQSxHQUFhLElBQUMsQ0FBQSxXQUFZLENBQUEsVUFBVSxDQUFDLFVBQVg7TUFDMUIsT0FBTyxDQUFDLFVBQVIsR0FBcUI7TUFDckIsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsVUFBckIsRUFISjs7QUFLQSxXQUFPO0VBUlk7O3NCQVV2QiwwQkFBQSxHQUE0QixTQUFDLFVBQUQsRUFBYSxNQUFiLEVBQXFCLEtBQXJCO1dBQ3hCLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixVQUF2QixFQUFtQyxNQUFuQyxFQUEyQyxLQUEzQztFQUR3Qjs7Ozs7O0FBS2hDLFFBQVEsQ0FBQyxLQUFULEdBQWlCLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0FBQ3BDLFFBQVEsQ0FBQyxNQUFULEdBQWtCLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0FBQ3JDLEVBQUUsQ0FBQyxTQUFILEdBQW1CLElBQUEsU0FBQSxDQUFBOztBQUNuQixFQUFFLENBQUMsU0FBSCxHQUFlLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogVUlNYW5hZ2VyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIEZvcm11bGFcbiAgICAjIyMqXG4gICAgKiBFbmNhcHN1bGF0ZXMgYSBVSSBmb3JtdWxhLiBBIGZvcm11bGEgY2FuIGJlIHVzZWQgaW4gVUkgbGF5b3V0cyB0byBkZWZpbmVcbiAgICAqIHByb3BlcnR5LWJpbmRpbmdzIG9yIHRvIGltcGxlbWVudCBhIHNwZWNpZmljIGJlaGF2aW9yLlxuICAgICpcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBGb3JtdWxhXG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZiAtIFRoZSBmb3JtdWxhLWZ1bmN0aW9uLiBEZWZpbmVzIHRoZSBsb2dpYyBvZiB0aGUgZm9ybXVsYS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gQW4gb3B0aW9uYWwgZGF0YS1vYmplY3Qgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIGluc2lkZSB0aGUgZm9ybXVsYS1mdW5jdGlvbi5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIEFuIG9wdGlvbmFsIGV2ZW50LW5hbWUgdG8gZGVmaW5lIHdoZW4gdGhlIGZvcm11bGEgc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZiwgZGF0YSwgZXZlbnQpIC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgaXRzIHRoZSBmaXJzdCB0aW1lIHRoZSBmb3JtdWxhIGlzIGNhbGxlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgb25Jbml0aWFsaXplXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQG9uSW5pdGlhbGl6ZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBmb3JtdWxhLWZ1bmN0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBleGVjX1xuICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAZXhlY18gPSBmXG4gICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIG9wdGlvbmFsIGRhdGEtb2JqZWN0IHdoaWNoIGNhbiBiZXMgYWNjZXNzZWQgaW5zaWRlIHRoZSBmb3JtdWxhLWZ1bmN0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBkYXRhXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjIyAgIFxuICAgICAgICBAZGF0YSA9IGRhdGFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBvcHRpb25hbCBldmVudC1uYW1lIHRvIGRlZmluZSB3aGVuIHRoZSBmb3JtdWxhIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgZXZlbnRcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjIFxuICAgICAgICBAZXZlbnQgPSBldmVudFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGFycmF5IG9mIGN1c3RvbSBudW1iZXItZGF0YSB3aGljaCBjYW4gYmUgdXNlZCBmb3IgZGlmZmVyZW50IHB1cnBvc2VzLiBUaGUgZmlyc3QgZWxlbWVudFxuICAgICAgICAqIGlzIGFsc28gdXNlZCBpbiBvbkNoYW5nZSBtZXRob2QgdG8gc3RvcmUgdGhlIG9sZCB2YWx1ZSBhbmQgY2hlY2sgYWdhaW5zdCB0aGUgbmV3IG9uZSB0byBkZXRlY3QgYSBjaGFuZ2UuXG4gICAgICAgICogQHByb3BlcnR5IG51bWJlcnNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJbXVxuICAgICAgICAjIyMgXG4gICAgICAgIEBudW1iZXJzID0gbmV3IEFycmF5KDEwKVxuICAgICAgICBAbnVtYmVyc1tpXSA9IDAgZm9yIGkgaW4gWzAuLkBudW1iZXJzLmxlbmd0aF1cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBhcnJheSBvZiBjdXN0b20gc3RyaW5nLWRhdGEgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGRpZmZlcmVudCBwdXJwb3Nlcy4gVGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgICAgKiBpcyBhbHNvIHVzZWQgaW4gb25UZXh0Q2hhbmdlIG1ldGhvZCB0byBzdG9yZSB0aGUgb2xkIHZhbHVlIGFuZCBjaGVjayBhZ2FpbnN0IHRoZSBuZXcgb25lIHRvIGRldGVjdCBhIGNoYW5nZS5cbiAgICAgICAgKiBAcHJvcGVydHkgc3RyaW5nc1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgICMjI1xuICAgICAgICBAc3RyaW5ncyA9IG5ldyBBcnJheSgxMClcbiAgICAgICAgQHN0cmluZ3NbaV0gPSBcIlwiIGZvciBpIGluIFswLi5Ac3RyaW5ncy5sZW5ndGhdXG4gICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFRoZSBmb3JtdWxhLWZ1bmN0aW9uLiBJdHMgYSB3cmFwcGVyLWZ1bmN0aW9uIGJlZm9yZSB0aGUgZmlyc3QtdGltZSBjYWxsIHdhcyBtYWRlLlxuICAgICogQG1ldGhvZCBleGVjXG4gICAgIyMjXG4gICAgZXhlYzogLT5cbiAgICAgICBAZXhlYyA9IEBleGVjX1xuICAgICAgIHIgPSBAZXhlY18uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgIEBvbkluaXRpYWxpemUgPSBub1xuICAgICAgIFxuICAgICAgIHJldHVybiByXG4gICAgICAgXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgbnVtYmVyLXZhbHVlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGNoZWNrLiBJdCB1c2VzXG4gICAgKiB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIG51bWJlcnMtYXJyYXkgdG8gc3RvcmUgdGhlIHZhbHVlIGFuZCBjaGVjayBhZ2FpbnN0IHRoZSBuZXcgb25lLlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25DaGFuZ2VcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXJWYWx1ZSAtIE51bWJlciB2YWx1ZSB0byBjaGVjay5cbiAgICAjIyMgICAgXG4gICAgb25DaGFuZ2U6IChudW1iZXJWYWx1ZSkgLT5cbiAgICAgICAgcmVzdWx0ID0gQG51bWJlcnNbMF0gIT0gbnVtYmVyVmFsdWVcbiAgICAgICAgQG51bWJlcnNbMF0gPSBudW1iZXJWYWx1ZVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCB0ZXh0LXZhbHVlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGNoZWNrLiBJdCB1c2VzXG4gICAgKiB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIHN0cmluZ3MtYXJyYXkgdG8gc3RvcmUgdGhlIHZhbHVlIGFuZCBjaGVjayBhZ2FpbnN0IHRoZSBuZXcgb25lLlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25UZXh0Q2hhbmdlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFZhbHVlIC0gVGV4dCB2YWx1ZSB0byBjaGVjay5cbiAgICAjIyMgICAgIFxuICAgIG9uVGV4dENoYW5nZTogKHRleHRWYWx1ZSkgLT5cbiAgICAgICAgcmVzdWx0ID0gQHN0cmluZ3NbMF0gIT0gdGV4dFZhbHVlXG4gICAgICAgIEBzdHJpbmdzWzBdID0gdGV4dFZhbHVlXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxudWkuRm9ybXVsYSA9IEZvcm11bGFcblxuY2xhc3MgU3BhY2VcbiAgICAjIyMqXG4gICAgKiBEZXNjcmliZXMgYSBzcGFjZSBpbnNpZGUgb3IgYXJvdW5kIHNvbWV0aGluZyBsaWtlIGEgbWFyZ2luIG9yIHBhZGRpbmcuXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIFNwYWNlXG4gICAgKiBAbWVtYmVyb2YgdWlcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgLSBTcGFjZSBhdCB0aGUgbGVmdCBpbiBwaXhlbHMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdG9wIC0gU3BhY2UgYXQgdGhlIHRvcCBpbiBwaXhlbHMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSBTcGFjZSBhdCB0aGUgcmlnaHQgaW4gcGl4ZWxzLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGJvdHRvbSAtIFNwYWNlIGF0IHRoZSBib3R0b20gaW4gcGl4ZWxzLlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAobGVmdCwgdG9wLCByaWdodCwgYm90dG9tKSAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogU3BhY2UgYXQgdGhlIGxlZnQgaW4gcGl4ZWxzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsZWZ0XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAbGVmdCA9IGxlZnRcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTcGFjZSBhdCB0aGUgdG9wIGluIHBpeGVscy5cbiAgICAgICAgKiBAcHJvcGVydHkgdG9wXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAdG9wID0gdG9wXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3BhY2UgYXQgdGhlIHJpZ2h0IGluIHBpeGVscy5cbiAgICAgICAgKiBAcHJvcGVydHkgcmlnaHRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEByaWdodCA9IHJpZ2h0XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3BhY2UgYXQgdGhlIGJvdHRvbSBpbiBwaXhlbHMuXG4gICAgICAgICogQHByb3BlcnR5IGJvdHRvbVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGJvdHRvbSA9IGJvdHRvbVxuICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNwYWNlIGJ5IGNvcHlpbmcgdGhlbSBmcm9tIGEgc3BlY2lmaWVkIHNwYWNlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0RnJvbU9iamVjdFxuICAgICogQHBhcmFtIHtPYmplY3R9IHNwYWNlIC0gQSBzcGFjZSB0byBjb3B5LlxuICAgICMjIyAgIFxuICAgIHNldEZyb21PYmplY3Q6IChzcGFjZSkgLT5cbiAgICAgICAgQGxlZnQgPSBzcGFjZS5sZWZ0XG4gICAgICAgIEB0b3AgPSBzcGFjZS50b3BcbiAgICAgICAgQHJpZ2h0ID0gc3BhY2UucmlnaHRcbiAgICAgICAgQGJvdHRvbSA9IHNwYWNlLmJvdHRvbVxuICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNwYWNlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdCAtIFNwYWNlIGF0IHRoZSBsZWZ0IGluIHBpeGVscy5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSBTcGFjZSBhdCB0aGUgdG9wIGluIHBpeGVscy5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCAtIFNwYWNlIGF0IHRoZSByaWdodCBpbiBwaXhlbHMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIC0gU3BhY2UgYXQgdGhlIGJvdHRvbSBpbiBwaXhlbHMuXG4gICAgIyMjICAgIFxuICAgIHNldDogKGxlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbSkgLT5cbiAgICAgICAgQGxlZnQgPSBsZWZ0XG4gICAgICAgIEB0b3AgPSB0b3BcbiAgICAgICAgQHJpZ2h0ID0gcmlnaHRcbiAgICAgICAgQGJvdHRvbSA9IGJvdHRvbVxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYSBuZXcgc3BhY2Ugb2JqZWN0IGZyb20gYW4gYXJyYXkgb2YgY29vcmRpbmF0ZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBmcm9tQXJyYXlcbiAgICAqIEBzdGF0aWNcbiAgICAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5IC0gQW4gYXJyYXkgb2YgY29vcmRpbmF0ZXMgKGxlZnQsIHRvcCByaWdodCwgYm90dG9tKS5cbiAgICAjIyMgICAgXG4gICAgQGZyb21BcnJheTogKGFycmF5KSAtPiBuZXcgdWkuU3BhY2UoYXJyYXlbMF0sIGFycmF5WzFdLCBhcnJheVsyXSwgYXJyYXlbM10pXG4gICAgICAgIFxudWkuU3BhY2UgPSBTcGFjZVxuXG5jbGFzcyBTdHlsZVxuICAgICMjIypcbiAgICAqIEEgVUkgc3R5bGUgY2FuIGFwcGxpZWQgdG8gYSBVSSBvYmplY3QgdG8gbW9kaWZ5IGl0IHByb3BlcnRpZXMgbGlrZSBjb2xvciwgaW1hZ2UsIGV0Yy4gdG8gZ2l2ZSBhIGNlcnRhaW4gXCJzdHlsZVwiIHRvIGl0LlxuICAgICpcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBTdHlsZVxuICAgICogQG1lbWJlcm9mIHVpXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gQSBzdHlsZS1kZXNjcmlwdG9yIHRvIGluaXRpYWxpemUgdGhlIHN0eWxlIGZyb20uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSBBIHVuaXF1ZSBudW1lcmljIElEIHRvIGFjY2VzcyB0aGUgc3R5bGUgdGhyb3VnaCBVSU1hbmFnZXIuc3R5bGVzQnlJZCBjb2xsZWN0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNlbGVjdG9yIC0gQSBzZWxlY3RvciBJRCB3aGljaCBjb250cm9scyB1bmRlciB3aGljaCBjb25kaXRpb25zIHRoZSBzdHlsZXMgd2lsbCBiZSBhcHBsaWVkLlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGVzY3JpcHRvciwgaWQsIHNlbGVjdG9yKSAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogSUQgbnVtYmVyIHRvIHF1aWNrbHkgYWNjZXNzIHRoaXMgc3R5bGUgYW5kIGxpbmsgdG8gdGhpcyBzdHlsZS5cbiAgICAgICAgKiBAcHJvcGVydHkgaWRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBpZCA9IGlkXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3R5bGUtSUQgb2YgdGFyZ2V0IG9iamVjdC4gVGhpcyBzdHlsZSB3aWxsIG9ubHkgYmUgYXBwbGllZCBvbiBVSSBvYmplY3RzIHdpdGggdGhhdCBzdHlsZSBJRCB3aGljaCBhcmVcbiAgICAgICAgKiBjaGlsZHJlbiBvZiBVSSBvYmplY3RzIHdoZXJlIHRoaXMgc3R5bGUgaXMgYXBwbGllZC5cbiAgICAgICAgKiBAcHJvcGVydHkgdGFyZ2V0XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAdGFyZ2V0ID0gLTFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTZWxlY3Rvci1JRCB3aGljaCBjb250cm9scyB1bmRlciB3aGljaCBjb25kaXRpb25zIHRoZSBzdHlsZSBiZWNvbWVzIGFjdGl2ZS5cbiAgICAgICAgKiBAcHJvcGVydHkgc2VsZWN0b3JcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBzZWxlY3RvciA9IHNlbGVjdG9yXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGZvbnQgdXNlZCBmb3IgdGhlIHRleHQtZGlzcGxheS5cbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICogQHByb3BlcnR5IGZvbnRcbiAgICAgICAgKiBAdHlwZSBncy5Gb250XG4gICAgICAgICMjI1xuICAgICAgICBAZm9udCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgaW1hZ2UgdXNlZCBmb3IgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgYW5pbWF0aW9ucyB1c2VkIGZvciB2aXN1YWwgcHJlc2VudGF0aW9uLlxuICAgICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgICAgKiBAcHJvcGVydHkgYW5pbWF0aW9uc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFtdXG4gICAgICAgICMjI1xuICAgICAgICBAYW5pbWF0aW9ucyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgY29sb3IuXG4gICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29sb3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb2xvciA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgYW5jaG9yLXBvaW50LiBGb3IgZXhhbXBsZTogQW4gYW5jaG9yLXBvaW50IHdpdGggMCwwIHBsYWNlcyB0aGUgb2JqZWN0IHdpdGggaXRzIHRvcC1sZWZ0IGNvcm5lclxuICAgICAgICAqIGF0IGl0cyBwb3NpdGlvbiBidXQgd2l0aCBhbiAwLjUsIDAuNSBhbmNob3ItcG9pbnQgdGhlIG9iamVjdCBpcyBwbGFjZWQgd2l0aCBpdHMgY2VudGVyLiBBbiBhbmNob3ItcG9pbnQgb2YgMSwxXG4gICAgICAgICogcGxhY2VzIHRoZSBvYmplY3Qgd2l0aCBpdHMgbG93ZXItcmlnaHQgY29ybmVyLlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbmNob3JcbiAgICAgICAgKiBAdHlwZSBncy5Qb2ludFxuICAgICAgICAjIyNcbiAgICAgICAgQGFuY2hvciA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3Mgem9vbS1zZXR0aW5nIGZvciB4IGFuZCB5IGF4aXMuXG4gICAgICAgICogQGRlZmF1bHQgbmV3IGdzLlBvaW50KDEuMCwgMS4wKVxuICAgICAgICAqIEBwcm9wZXJ0eSB6b29tXG4gICAgICAgICogQHR5cGUgZ3MuUG9pbnRcbiAgICAgICAgIyMjXG4gICAgICAgIEB6b29tID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QncyBtYXJnaW4uIFRoZSBtYXJnaW4gZGVmaW5lcyBhbiBleHRyYSBzcGFjZSBhcm91bmQgdGhlIFVJIG9iamVjdC4gXG4gICAgICAgICogVGhlIGRlZmF1bHQgaXMgeyBsZWZ0OiAwLCB0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAgfS5cbiAgICAgICAgKiBAcHJvcGVydHkgbWFyZ2luXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAbWFyZ2luID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBVSSBvYmplY3QncyBwYWRkaW5nLiBUaGUgZGVmYXVsdCBpcyB7IGxlZnQ6IDAsIHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCB9LlxuICAgICAgICAqIEBwcm9wZXJ0eSBwYWRkaW5nXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAcGFkZGluZyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3MgbWFzayBmb3IgbWFza2luZy1lZmZlY3RzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBtYXNrXG4gICAgICAgICogQHR5cGUgZ3MuTWFza1xuICAgICAgICAjIyNcbiAgICAgICAgQG1hc2sgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIFVJIG9iamVjdCdzIGFsaWdubWVudC5cbiAgICAgICAgKiBAcHJvcGVydHkgYWxpZ25tZW50XG4gICAgICAgICogQHR5cGUgdWkuQWxpZ25tZW50XG4gICAgICAgICMjI1xuICAgICAgICBAYWxpZ25tZW50ID0gLTFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgVUkgb2JqZWN0J3Mgb3BhY2l0eSB0byBjb250cm9sIHRyYW5zcGFyZW5jeS4gRm9yIGV4YW1wbGU6IDAgPSBUcmFuc3BhcmVudCwgMjU1ID0gT3BhcXVlLCAxMjggPSBTZW1pLVRyYW5zcGFyZW50LlxuICAgICAgICAqIEBwcm9wZXJ0eSBvcGFjaXR5XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAb3BhY2l0eSA9IC0xXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGNsaXAtcmVjdCBmb3IgdmlzdWFsIHByZXNlbnRhdGlvbi5cbiAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICogQHByb3BlcnR5IGNsaXBSZWN0XG4gICAgICAgICogQHR5cGUgZ3MuUmVjdFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjbGlwUmVjdCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY29ybmVyLXNpemUgb2YgdGhlIGZyYW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBmcmFtZUNvcm5lclNpemVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBmcmFtZUNvcm5lclNpemUgPSAtMVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSB0aGlja25lc3Mgb2YgdGhlIGZyYW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBmcmFtZVRoaWNrbmVzc1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGZyYW1lVGhpY2tuZXNzID0gLTFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbG9vcGluZyBvZiB0aGUgaW1hZ2UuXG4gICAgICAgICogQHByb3BlcnR5IGxvb3BpbmdcbiAgICAgICAgKiBAdHlwZSB1aS5PcmllbnRhdGlvblxuICAgICAgICAjIyNcbiAgICAgICAgQGxvb3BpbmcgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIHotaW5kZXggY29udHJvbHMgcmVuZGVyaW5nLW9yZGVyL2ltYWdlLW92ZXJsYXBwaW5nLiBBbiBvYmplY3Qgd2l0aCBhIHNtYWxsZXIgei1pbmRleCBpcyByZW5kZXJlZFxuICAgICAgICAqIGJlZm9yZSBhbiBvYmplY3Qgd2l0aCBhIGxhcmdlciBpbmRleC4gRm9yIGV4YW1wbGU6IFRvIG1ha2Ugc3VyZSBhIGdhbWUgb2JqZWN0IGlzIGFsd2F5cyBvbiB0b3Agb2YgdGhlIHNjcmVlbiwgaXRcbiAgICAgICAgKiBzaG91bGQgaGF2ZSB0aGUgbGFyZ2VzdCB6LWluZGV4IG9mIGFsbCBnYW1lIG9iamVjdHMuXG4gICAgICAgICogQHByb3BlcnR5IHpJbmRleFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHpJbmRleCA9IC0xXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGFsaWdubWVudCBvbiB4LWF4aXMuIE5lZWRzIHRvIGJlIHN1cHBvcnRlZCBieSBsYXlvdXQuXG4gICAgICAgICogQHByb3BlcnR5IGFsaWdubWVudFhcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBhbGlnbm1lbnRYID0gLTFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3MgYWxpZ25tZW50IG9uIHktYXhpcy4gTmVlZHMgdG8gYmUgc3VwcG9ydGVkIGJ5IGxheW91dC5cbiAgICAgICAgKiBAcHJvcGVydHkgYWxpZ25tZW50WVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGFsaWdubWVudFkgPSAtMVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBvYmplY3QncyByZXNpemUgYmVoYXZpb3IuXG4gICAgICAgICogQHByb3BlcnR5IHJlc2l6YWJsZVxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNpemFibGUgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9yaWdpbmFsIHN0eWxlIGRlc2NyaXB0b3IuXG4gICAgICAgICogQHByb3BlcnR5IGRlc2NyaXB0b3JcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBkZXNjcmlwdG9yID0gZGVzY3JpcHRvclxuICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvclxuICAgICAgICAgICAgQHNldEZyb21EZXNjcmlwdG9yKGRlc2NyaXB0b3IpXG5cbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgc3R5bGUgZnJvbSBhIHN0eWxlLWRlc2NyaXB0b3IuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRGcm9tRGVzY3JpcHRvclxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgc3R5bGUtZGVzY3JpcHRvci5cbiAgICAjIyMgXG4gICAgc2V0RnJvbURlc2NyaXB0b3I6IChkZXNjcmlwdG9yKSAtPlxuICAgICAgICBAZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JcbiAgICAgICAgQGltYWdlID0gZGVzY3JpcHRvci5pbWFnZVxuICAgICAgICBAY29sb3IgPSBncy5Db2xvci5mcm9tQXJyYXkoZGVzY3JpcHRvci5jb2xvcikgaWYgZGVzY3JpcHRvci5jb2xvclxuICAgICAgICBAYW5jaG9yID0gbmV3IGdzLlBvaW50KGRlc2NyaXB0b3IuYW5jaG9yWzBdLCBkZXNjcmlwdG9yLmFuY2hvclsxXSkgaWYgZGVzY3JpcHRvci5hbmNob3JcbiAgICAgICAgQHpvb20gPSBuZXcgZ3MuUG9pbnQoZGVzY3JpcHRvci56b29tWzBdLCBkZXNjcmlwdG9yLnpvb21bMV0pIGlmIGRlc2NyaXB0b3Iuem9vbVxuICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5mb250XG4gICAgICAgICAgICBAc2V0dXBGb250KGRlc2NyaXB0b3IpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5jbGlwUmVjdFxuICAgICAgICAgICAgQGNsaXBSZWN0ID0gZ3MuUmVjdC5mcm9tQXJyYXkoZGVzY3JpcHRvci5jbGlwUmVjdClcbiAgICAgICAgICAgIFxuICAgICAgICBAb3BhY2l0eSA9IGRlc2NyaXB0b3Iub3BhY2l0eSBpZiBkZXNjcmlwdG9yLm9wYWNpdHkgPj0gMFxuICAgICAgICBAYWxpZ25tZW50ID0gZGVzY3JpcHRvci5hbGlnbm1lbnQgaWYgZGVzY3JpcHRvci5hbGlnbm1lbnQgPj0gMFxuICAgICAgICBAbWFyZ2luID0gdWkuU3BhY2UuZnJvbUFycmF5KGRlc2NyaXB0b3IubWFyZ2luKSBpZiBkZXNjcmlwdG9yLm1hcmdpblxuICAgICAgICBAcGFkZGluZyA9IHVpLlNwYWNlLmZyb21BcnJheShkZXNjcmlwdG9yLnBhZGRpbmcpIGlmIGRlc2NyaXB0b3IucGFkZGluZ1xuICAgICAgICBAYW5pbWF0aW9ucyA9IGRlc2NyaXB0b3IuYW5pbWF0aW9uc1xuICAgICAgICBAZnJhbWVDb3JuZXJTaXplID0gZGVzY3JpcHRvci5mcmFtZUNvcm5lclNpemUgaWYgZGVzY3JpcHRvci5mcmFtZUNvcm5lclNpemVcbiAgICAgICAgQGZyYW1lVGhpY2tuZXNzID0gZGVzY3JpcHRvci5mcmFtZVRoaWNrbmVzcyBpZiBkZXNjcmlwdG9yLmZyYW1lVGhpY2tuZXNzXG4gICAgICAgIEBmcmFtZSA9IGRlc2NyaXB0b3IuZnJhbWUgaWYgZGVzY3JpcHRvci5mcmFtZVxuICAgICAgICBAbG9vcGluZyA9IGRlc2NyaXB0b3IubG9vcGluZyBpZiBkZXNjcmlwdG9yLmxvb3BpbmdcbiAgICAgICAgQHJlc2l6YWJsZSA9IGRlc2NyaXB0b3IucmVzaXphYmxlIGlmIGRlc2NyaXB0b3IucmVzaXphYmxlP1xuICAgICAgICBAekluZGV4ID0gZGVzY3JpcHRvci56SW5kZXggaWYgZGVzY3JpcHRvci56SW5kZXhcbiAgICAgICAgQGFsaWdubWVudFggPSB1aS5VSU1hbmFnZXIuYWxpZ25tZW50c1tkZXNjcmlwdG9yLmFsaWdubWVudFhdIGlmIGRlc2NyaXB0b3IuYWxpZ25tZW50WFxuICAgICAgICBAYWxpZ25tZW50WSA9IHVpLlVJTWFuYWdlci5hbGlnbm1lbnRzW2Rlc2NyaXB0b3IuYWxpZ25tZW50WV0gaWYgZGVzY3JpcHRvci5hbGlnbm1lbnRZXG4gICAgICAgIFxuICAgIHNldDogKHN0eWxlKSAtPlxuICAgICAgICBAaW1hZ2UgPSBzdHlsZS5pbWFnZVxuICAgICAgICBAY29sb3Iuc2V0RnJvbU9iamVjdChzdHlsZS5jb2xvcilcbiAgICAgICAgQGFuY2hvci5zZXQoc3R5bGUuYW5jaG9yLngsIHN0eWxlLmFuY2hvci55KVxuICAgICAgICBAem9vbS5zZXQoc3R5bGUuem9vbS54LCBzdHlsZS56b29tLnkpXG4gICAgICAgIFxuICAgICAgICBpZiBzdHlsZS5mb250XG4gICAgICAgICAgICBpZiAhQGZvbnQgdGhlbiBAZm9udCA9IG5ldyBncy5Gb250KHN0eWxlLmZvbnQubmFtZSwgc3R5bGUuZm9udC5zaXplKVxuICAgICAgICAgICAgQGZvbnQuc2V0KHN0eWxlLmZvbnQpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgc3R5bGUuY2xpcFJlY3RcbiAgICAgICAgICAgIGlmICFAY2xpcFJlY3QgdGhlbiBAY2xpcFJlY3QgPSBuZXcgZ3MuUmVjdCgpXG4gICAgICAgICAgICBAY2xpcFJlY3Quc2V0RnJvbU9iamVjdChzdHlsZS5jbGlwUmVjdClcbiAgICAgICAgICAgIFxuICAgICAgICBAb3BhY2l0eSA9IHN0eWxlLm9wYWNpdHpcbiAgICAgICAgQGFsaWdubWVudCA9IHN0eWxlLmFsaWdubWVudFxuICAgICAgICBAbWFyZ2luLnNldEZyb21PYmplY3Qoc3R5bGUubWFyZ2luKVxuICAgICAgICBAcGFkZGluZy5zZXRGcm9tT2JqZWN0KHN0eWxlLnBhZGRpbmcpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIGZvbnQtZGF0YSBmcm9tIGEgc3R5bGUtZGVzY3JpcHRvci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwRm9udFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgc3R5bGUtZGVzY3JpcHRvci5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgc2V0dXBGb250OiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgaWYgZGVzY3JpcHRvci5mb250XG4gICAgICAgICAgICBpZiAhQGZvbnRcbiAgICAgICAgICAgICAgICBAZm9udCA9IG5ldyBGb250KGRlc2NyaXB0b3IuZm9udC5uYW1lLCBkZXNjcmlwdG9yLmZvbnQuc2l6ZSA/IDApXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGZvbnQubmFtZSA9IGRlc2NyaXB0b3IuZm9udC5uYW1lXG4gICAgICAgICAgICAgICAgQGZvbnQuc2l6ZSA9IGRlc2NyaXB0b3IuZm9udC5zaXplID8gMFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgQGZvbnQuYm9sZCA9IGRlc2NyaXB0b3IuZm9udC5ib2xkID8gQGZvbnQuYm9sZFxuICAgICAgICAgICAgQGZvbnQuaXRhbGljID0gZGVzY3JpcHRvci5mb250Lml0YWxpYyA/IEBmb250Lml0YWxpY1xuICAgICAgICAgICAgQGZvbnQuc21hbGxDYXBzID0gZGVzY3JpcHRvci5mb250LnNtYWxsQ2FwcyA/IEBmb250LnNtYWxsQ2Fwc1xuICAgICAgICAgICAgQGZvbnQudW5kZXJsaW5lID0gZGVzY3JpcHRvci5mb250LnVuZGVybGluZSA/IEBmb250LnVuZGVybGluZVxuICAgICAgICAgICAgQGZvbnQuc3RyaWtlVGhyb3VnaCA9IGRlc2NyaXB0b3IuZm9udC5zdHJpa2VUaHJvdWdoID8gQGZvbnQuc3RyaWtlVGhyb3VnaFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBkZXNjcmlwdG9yLmZvbnQuY29sb3I/XG4gICAgICAgICAgICAgICAgQGZvbnQuY29sb3Iuc2V0RnJvbUFycmF5KGRlc2NyaXB0b3IuZm9udC5jb2xvcilcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgZGVzY3JpcHRvci5mb250LmJvcmRlcj9cbiAgICAgICAgICAgICAgICBAZm9udC5ib3JkZXIgPSBkZXNjcmlwdG9yLmZvbnQuYm9yZGVyID8gbm9cbiAgICAgICAgICAgICAgICBAZm9udC5ib3JkZXJTaXplID0gZGVzY3JpcHRvci5mb250LmJvcmRlclNpemUgPyA0XG4gICAgICAgICAgICAgICAgQGZvbnQuYm9yZGVyQ29sb3Iuc2V0KDAsIDAsIDAsIDI1NSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGRlc2NyaXB0b3IuZm9udC5vdXRsaW5lP1xuICAgICAgICAgICAgICAgIEBmb250LmJvcmRlciA9IGRlc2NyaXB0b3IuZm9udC5vdXRsaW5lID8gbm9cbiAgICAgICAgICAgICAgICBAZm9udC5ib3JkZXJTaXplID0gZGVzY3JpcHRvci5mb250Lm91dGxpbmUuc2l6ZSA/IDRcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBkZXNjcmlwdG9yLmZvbnQub3V0bGluZS5jb2xvcj9cbiAgICAgICAgICAgICAgICAgICAgQGZvbnQuYm9yZGVyQ29sb3Iuc2V0RnJvbUFycmF5KGRlc2NyaXB0b3IuZm9udC5vdXRsaW5lLmNvbG9yKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGZvbnQuYm9yZGVyQ29sb3Iuc2V0KDAsIDAsIDAsIDI1NSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBcHBsaWVzIHRoZSBzdHlsZSB0byBhIFVJIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFwcGx5XG4gICAgKiBAcGFyYW0ge3VpLk9iamVjdF9VSUVsZW1lbnR9IG9iamVjdCAtIFRoZSBVSSBvYmplY3Qgd2hlcmUgdGhlIHN0eWxlIHNob3VsZCBiZSBhcHBsaWVkIHRvLlxuICAgICMjIyAgICAgICAgICAgICAgICBcbiAgICBhcHBseTogKG9iamVjdCkgLT5cbiAgICAgICAgaWYgbm90IG9iamVjdC5hY3RpdmVTdHlsZXMuY29udGFpbnModGhpcylcbiAgICAgICAgICAgIG9iamVjdC5hY3RpdmVTdHlsZXMucHVzaCh0aGlzKVxuICAgICAgICAgICAgaWYgQGZvbnQgdGhlbiBvYmplY3QuZm9udD8uc2V0KEBmb250KVxuICAgICAgICAgICAgaWYgQGNvbG9yIHRoZW4gb2JqZWN0LmNvbG9yLnNldChAY29sb3IpXG4gICAgICAgICAgICBpZiBAaW1hZ2UgdGhlbiBvYmplY3QuaW1hZ2UgPSBAaW1hZ2VcbiAgICAgICAgICAgIGlmIEBhbmNob3IgdGhlbiBvYmplY3QuYW5jaG9yLnNldChAYW5jaG9yLngsIEBhbmNob3IueSlcbiAgICAgICAgICAgIGlmIEB6b29tIHRoZW4gb2JqZWN0Lnpvb20uc2V0KEB6b29tLngsIEB6b29tLnkpXG4gICAgICAgICAgICBpZiBAcGFkZGluZyB0aGVuIG9iamVjdC5wYWRkaW5nLnNldEZyb21PYmplY3QoQHBhZGRpbmcpXG4gICAgICAgICAgICBpZiBAbWFyZ2luIHRoZW4gb2JqZWN0Lm1hcmdpbi5zZXRGcm9tT2JqZWN0KEBtYXJnaW4pXG4gICAgICAgICAgICBpZiBAb3BhY2l0eSA+PSAwIHRoZW4gb2JqZWN0Lm9wYWNpdHkgPSBAb3BhY2l0eVxuICAgICAgICAgICAgaWYgQGFsaWdubWVudCA+PSAwIHRoZW4gb2JqZWN0LmFsaWdubWVudCA9IEBhbGlnbm1lbnRcbiAgICAgICAgICAgIGlmIEBmcmFtZVRoaWNrbmVzcyA+PSAwIHRoZW4gb2JqZWN0LmZyYW1lVGhpY2tuZXNzID0gQGZyYW1lVGhpY2tuZXNzXG4gICAgICAgICAgICBpZiBAZnJhbWVDb3JuZXJTaXplID49IDAgdGhlbiBvYmplY3QuZnJhbWVDb3JuZXJTaXplID0gQGZyYW1lQ29ybmVyU2l6ZVxuICAgICAgICAgICAgaWYgQG1hc2sgdGhlbiBvYmplY3QubWFzay5zZXQoQG1hc2spXG4gICAgICAgICAgICBpZiBAekluZGV4ID49IDAgdGhlbiBvYmplY3QuekluZGV4ID0gQHpJbmRleFxuICAgICAgICAgICAgaWYgQGFsaWdubWVudFggPj0gMCB0aGVuIG9iamVjdC5hbGlnbm1lbnRYID0gQGFsaWdubWVudFhcbiAgICAgICAgICAgIGlmIEBhbGlnbm1lbnRZID49IDAgdGhlbiBvYmplY3QuYWxpZ25tZW50WSA9IEBhbGlnbm1lbnRZXG4gICAgICAgICAgICBpZiBAcmVzaXphYmxlPyB0aGVuIG9iamVjdC5yZXNpemFibGUgPSBAcmVzaXphYmxlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBhcHBseUxvb3Bpbmcob2JqZWN0KVxuICAgICAgICAgICAgQGFwcGx5QW5pbWF0aW9ucyhvYmplY3QpXG4gICAgIFxuICAgICMjIypcbiAgICAqIEFwcGxpZXMgdGhlIGxvb3BpbmctZGF0YSBvZiB0aGUgc3R5bGUgdG8gYSBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBhcHBseUxvb3BpbmdcbiAgICAqIEBwYXJhbSB7dWkuT2JqZWN0X1VJRWxlbWVudH0gb2JqZWN0IC0gVGhlIFVJIG9iamVjdCB3aGVyZSB0aGUgbG9vcGluZy1kYXRhIHNob3VsZCBiZSBhcHBsaWVkIHRvLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgYXBwbHlMb29waW5nOiAob2JqZWN0KSAtPlxuICAgICAgICBpZiBAbG9vcGluZ1xuICAgICAgICAgICAgaWYgIW9iamVjdC52aXN1YWwubG9vcGluZ1xuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgb2JqZWN0LnJlbW92ZUNvbXBvbmVudChvYmplY3QudmlzdWFsKVxuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwgPSBuZXcgZ3MuQ29tcG9uZW50X1RpbGluZ1Nwcml0ZSgpXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFkZENvbXBvbmVudChvYmplY3QudmlzdWFsKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBAbG9vcGluZy52ZXJ0aWNhbFxuICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBAbG9vcGluZy5ob3Jpem9udGFsXG4gICAgIFxuICAgICMjIypcbiAgICAqIEFwcGxpZXMgdGhlIGFuaW1hdGlvbi1kYXRhIG9mIHRoZSBzdHlsZSB0byBhIFVJIG9iamVjdC4gVGhpcyBhdXRvbWF0aWNhbGx5IGFkZHMgYW4gYW5pbWF0aW9uLWhhbmRsZXJcbiAgICAqIGNvbXBvbmVudCh1aS5Db21wb25lbnRfQW5pbWF0aW9uSGFuZGxlcikgd2l0aCB0aGUgaWQgXCJhbmltYXRpb25IYW5kbGVyXCIgdG8gdGhlIFVJIG9iamVjdCBpZiBub3QgYWxyZWFkeSBleGlzdHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBhcHBseUFuaW1hdGlvbnNcbiAgICAqIEBwYXJhbSB7dWkuT2JqZWN0X1VJRWxlbWVudH0gb2JqZWN0IC0gVGhlIFVJIG9iamVjdCB3aGVyZSB0aGUgYW5pbWF0aW9uLWRhdGEgc2hvdWxkIGJlIGFwcGxpZWQgdG8uXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICBcbiAgICBhcHBseUFuaW1hdGlvbnM6IChvYmplY3QpIC0+XG4gICAgICAgIGlmIEBhbmltYXRpb25zXG4gICAgICAgICAgICBvYmplY3QuYW5pbWF0aW9ucyA9IE9iamVjdC5kZWVwQ29weShAYW5pbWF0aW9ucylcbiAgICAgICAgICAgIGlmICFvYmplY3QuZmluZENvbXBvbmVudEJ5SWQoXCJhbmltYXRpb25IYW5kbGVyXCIpXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdGlvbkV4ZWN1dG9yID0gbmV3IHVpLkNvbXBvbmVudF9BbmltYXRpb25FeGVjdXRvcigpXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFkZENvbXBvbmVudChuZXcgdWkuQ29tcG9uZW50X0FuaW1hdGlvbkhhbmRsZXIoKSwgXCJhbmltYXRpb25IYW5kbGVyXCIpXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFkZENvbXBvbmVudChvYmplY3QuYW5pbWF0aW9uRXhlY3V0b3IsIFwiYW5pbWF0aW9uRXhlY3V0b3JcIilcbiAgICAgICAgICAgICAgICBcbiAgICAgIFxuICAgICMjIypcbiAgICAqIFJldmVydHMgdGhlIGNoYW5nZXMgZnJvbSBhIFVJIG9iamVjdCBtYWRlIGJ5IHRoaXMgc3R5bGUuIEhvd2V2ZXIsIHRoaXMgcmVzZXRzIGFsbCBzdHlsZWFibGUgcHJvcGVydGllc1xuICAgICogd2VyZSBzZXQgYnkgdGhpcyBzdHlsZS4gU28gaXQgaXMgbmVjZXNzYXJ5IHRvIGFwcGx5IGFsbCBvdGhlciBzdHlsZXMgYWdhaW4sIGJ1dCB0aGF0IGlzIGFscmVhZHkgaGFuZGxlcyBpblxuICAgICogdWkuQ29tcG9uZW50X1VJQmVoYXZpb3IuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXZlcnRcbiAgICAqIEBwYXJhbSB7dWkuT2JqZWN0X1VJRWxlbWVudH0gb2JqZWN0IC0gVGhlIFVJIG9iamVjdCB3aGVyZSB0aGUgc3R5bGUgc2hvdWxkIGJlIHJldmVydGVkLlxuICAgICMjIyAgICAgICAgICAgICBcbiAgICByZXZlcnQ6IChvYmplY3QpIC0+XG4gICAgICAgIGFjdGl2ZVN0eWxlcyA9IG9iamVjdC5hY3RpdmVTdHlsZXNcbiAgICAgICAgaWYgb2JqZWN0LmFjdGl2ZVN0eWxlcy5jb250YWlucyh0aGlzKVxuICAgICAgICAgICAgb2JqZWN0LmFjdGl2ZVN0eWxlcy5yZW1vdmUodGhpcylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGZvbnQgdGhlbiBvYmplY3QuZm9udC5zZXQoZ3MuRm9udHMuVEVYVCk7ICAgICAgICAgICAgICAgKGlmIHMuZm9udCB0aGVuIG9iamVjdC5mb250LnNldChzLmZvbnQpOyBicmVhaykgZm9yIHMgaW4gYWN0aXZlU3R5bGVzIGJ5IC0xXG4gICAgICAgICAgICBpZiBAY29sb3IgdGhlbiBvYmplY3QuY29sb3Iuc2V0KENvbG9yLldISVRFKTsgICAgICAgICAgICAgICAoaWYgcy5jb2xvciB0aGVuIG9iamVjdC5jb2xvci5zZXQocy5jb2xvcik7IGJyZWFrKSBmb3IgcyBpbiBhY3RpdmVTdHlsZXMgYnkgLTFcbiAgICAgICAgICAgIGlmIEBpbWFnZSB0aGVuIG9iamVjdC5pbWFnZSA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgIChpZiBzLmltYWdlIHRoZW4gb2JqZWN0LmltYWdlID0gcy5pbWFnZTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQGFuY2hvciB0aGVuIG9iamVjdC5hbmNob3Iuc2V0KDAsIDApOyAgICAgICAgICAgICAgICAgICAgKGlmIHMuYW5jaG9yIHRoZW4gb2JqZWN0LmFuY2hvci5zZXRGcm9tT2JqZWN0KHMuYW5jaG9yKTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQHpvb20gdGhlbiBvYmplY3Quem9vbS5zZXQoMS4wLCAxLjApOyAgICAgICAgICAgICAgICAgICAgKGlmIHMuem9vbSB0aGVuIG9iamVjdC56b29tLnNldEZyb21PYmplY3Qocy56b29tKTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQHBhZGRpbmcgdGhlbiBvYmplY3QucGFkZGluZy5zZXQoMCwgMCwgMCwgMCk7ICAgICAgICAgICAgKGlmIHMucGFkZGluZyB0aGVuIG9iamVjdC5wYWRkaW5nLnNldEZyb21PYmplY3Qocy5wYWRkaW5nKTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQG1hcmdpbiB0aGVuIG9iamVjdC5tYXJnaW4uc2V0KDAsIDAsIDAsIDApOyAgICAgICAgICAgICAgKGlmIHMubWFyZ2luIHRoZW4gb2JqZWN0Lm1hcmdpbi5zZXRGcm9tT2JqZWN0KHMubWFyZ2luKTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQG9wYWNpdHkgPj0gMCB0aGVuIG9iamVjdC5vcGFjaXR5ID0gMjU1OyAgICAgICAgICAgICAgICAgKGlmIHMub3BhY2l0eSA+PSAwIHRoZW4gb2JqZWN0Lm9wYWNpdHkgPSBzLm9wYWNpdHk7IGJyZWFrKSBmb3IgcyBpbiBhY3RpdmVTdHlsZXMgYnkgLTFcbiAgICAgICAgICAgIGlmIEBhbGlnbm1lbnQgPj0gMCB0aGVuIG9iamVjdC5hbGlnbm1lbnQgPSAwOyAgICAgICAgICAgICAgIChpZiBzLmFsaWdubWVudCA+PSAwIHRoZW4gb2JqZWN0LmFsaWdubWVudCA9IHMuYWxpZ25tZW50OyBicmVhaykgZm9yIHMgaW4gYWN0aXZlU3R5bGVzIGJ5IC0xXG4gICAgICAgICAgICBpZiBAZnJhbWVDb3JuZXJTaXplID49IDAgdGhlbiBvYmplY3QuZnJhbWVDb3JuZXJTaXplID0gMTY7ICAoaWYgcy5mcmFtZUNvcm5lclNpemUgPj0gMCB0aGVuIG9iamVjdC5mcmFtZUNvcm5lclNpemUgPSBzLmZyYW1lQ29ybmVyU2l6ZTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQGZyYW1lVGhpY2tuZXNzID49IDAgdGhlbiBvYmplY3QuZnJhbWVUaGlja25lc3MgPSAxNjsgICAgKGlmIHMuZnJhbWVUaGlja25lc3MgPj0gMCB0aGVuIG9iamVjdC5mcmFtZVRoaWNrbmVzcyA9IHMuZnJhbWVUaGlja25lc3M7IGJyZWFrKSBmb3IgcyBpbiBhY3RpdmVTdHlsZXMgYnkgLTFcbiAgICAgICAgICAgIGlmIEBtYXNrIHRoZW4gb2JqZWN0Lm1hc2suc2V0KG51bGwpOyAgICAgICAgICAgICAgICAgICAgICAgIChpZiBzLm1hc2sgdGhlbiBvYmplY3QubWFzay5zZXQocy5mb250KTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQHpJbmRleCA+PSAwIHRoZW4gb2JqZWN0LnpJbmRleCA9IDA7ICAgICAgICAgICAgICAgICAgICAgKGlmIHMuekluZGV4ID49IDAgdGhlbiBvYmplY3QuekluZGV4ID0gcy56SW5kZXg7IGJyZWFrKSBmb3IgcyBpbiBhY3RpdmVTdHlsZXMgYnkgLTFcbiAgICAgICAgICAgIGlmIEBhbGlnbm1lbnRYID49IDAgdGhlbiBvYmplY3QuYWxpZ25tZW50WCA9IDA7ICAgICAgICAgICAgIChpZiBzLmFsaWdubWVudFggPj0gMCB0aGVuIG9iamVjdC5hbGlnbm1lbnRYID0gcy5hbGlnbm1lbnRYOyBicmVhaykgZm9yIHMgaW4gYWN0aXZlU3R5bGVzIGJ5IC0xXG4gICAgICAgICAgICBpZiBAYWxpZ25tZW50WSA+PSAwIHRoZW4gb2JqZWN0LmFsaWdubWVudFkgPSAwOyAgICAgICAgICAgICAoaWYgcy5hbGlnbm1lbnRZID49IDAgdGhlbiBvYmplY3QuYWxpZ25tZW50WSA9IHMuYWxpZ25tZW50WTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgaWYgQHJlc2l6YWJsZT8gdGhlbiBvYmplY3QucmVzaXphYmxlID0gbm87ICAgICAgICAgICAgICAgICAgKGlmIHMucmVzaXphYmxlPyB0aGVuIG9iamVjdC5yZXNpemFibGUgPSBzLnJlc2l6YWJsZTsgYnJlYWspIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcmV2ZXJ0QW5pbWF0aW9ucyhvYmplY3QpXG4gICAgICAgICAgICBAcmV2ZXJ0TG9vcGluZyhvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFJldmVydHMgdGhlIGFuaW1hdGlvbi1kYXRhIGNoYW5nZXMgYXBwbGllZCB0byBhIFVJIG9iamVjdCBieSB0aGlzIHN0eWxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmV2ZXJ0QW5pbWF0aW9uc1xuICAgICogQHBhcmFtIHt1aS5PYmplY3RfVUlFbGVtZW50fSBvYmplY3QgLSBUaGUgVUkgb2JqZWN0IHdoZXJlIHRoZSBhbmltYXRpb24tZGF0YSBjaGFuZ2VzIHNob3VsZCBiZSByZXZlcnRlZC5cbiAgICAjIyMgICAgICAgICAgICAgICAgIFxuICAgIHJldmVydEFuaW1hdGlvbnM6IChvYmplY3QpIC0+XG4gICAgICAgIGFjdGl2ZVN0eWxlcyA9IG9iamVjdC5hY3RpdmVTdHlsZXNcbiAgICAgICAgaWYgQGFuaW1hdGlvbnNcbiAgICAgICAgICAgIG9iamVjdC5hbmltYXRpb25zID0gbnVsbDsgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciBzIGluIGFjdGl2ZVN0eWxlcyBieSAtMVxuICAgICAgICAgICAgICAgIGlmIHMuYW5pbWF0aW9uc1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuYW5pbWF0aW9ucyA9IE9iamVjdC5kZWVwQ29weShzLmFuaW1hdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIGlmICFvYmplY3QuZmluZENvbXBvbmVudEJ5SWQoXCJhbmltYXRpb25IYW5kbGVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuYWRkQ29tcG9uZW50KG5ldyB1aS5Db21wb25lbnRfQW5pbWF0aW9uSGFuZGxlcigpLCBcImFuaW1hdGlvbkhhbmRsZXJcIilcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmV2ZXJ0cyB0aGUgbG9vcGluZy1kYXRhIGNoYW5nZXMgYXBwbGllZCB0byBhIFVJIG9iamVjdCBieSB0aGlzIHN0eWxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmV2ZXJ0TG9vcGluZ1xuICAgICogQHBhcmFtIHt1aS5PYmplY3RfVUlFbGVtZW50fSBvYmplY3QgLSBUaGUgVUkgb2JqZWN0IHdoZXJlIHRoZSBsb29waW5nLWRhdGEgY2hhbmdlcyBzaG91bGQgYmUgcmV2ZXJ0ZWQuXG4gICAgIyMjICAgICAgICAgICAgICAgICBcbiAgICByZXZlcnRMb29waW5nOiAob2JqZWN0KSAtPlxuICAgICAgICBhY3RpdmVTdHlsZXMgPSBvYmplY3QuYWN0aXZlU3R5bGVzXG4gICAgICAgIGlmIEBsb29waW5nXG4gICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBub1xuICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBub1xuICAgICAgICAgICAgZm9yIHMgaW4gYWN0aXZlU3R5bGVzIGJ5IC0xXG4gICAgICAgICAgICAgICAgaWYgcy5sb29waW5nXG4gICAgICAgICAgICAgICAgICAgIGlmICFvYmplY3QudmlzdWFsLmxvb3BpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QucmVtb3ZlQ29tcG9uZW50KG9iamVjdC52aXN1YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlzdWFsID0gbmV3IGdzLkNvbXBvbmVudF9UaWxpbmdTcHJpdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFkZENvbXBvbmVudChvYmplY3QudmlzdWFsKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0gcy5sb29waW5nLnZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy5ob3Jpem9udGFsID0gcy5sb29waW5nLmhvcml6b250YWxcbiAgICAgICAgICAgIFxudWkuU3R5bGUgPSBTdHlsZVxuXG5jbGFzcyBVSU1hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBIYW5kbGVzIHRoZSBjcmVhdGlvbiBvZiBJbiBHYW1lIFVJIGVsZW1lbnRzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dFxuICAgICogSW4tR2FtZSBVSSBzZWUgaGVscCBmaWxlLlxuICAgICpcbiAgICAqIEBtb2R1bGUgdWlcbiAgICAqIEBjbGFzcyBVSU1hbmFnZXJcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYWxsIHJlZ2lzdGVyZWQgVUkgbGF5b3V0cyBieSBuYW1lL2lkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsYXlvdXRzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAbGF5b3V0cyA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIGFsbCByZWdpc3RlcmVkIFVJIHN0eWxlcyBieSBuYW1lL2lkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzdHlsZXNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBzdHlsZXMgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgVUkgc3R5bGVzIGJ5IG51bWJlciBpZC5cbiAgICAgICAgKiBAcHJvcGVydHkgc3R5bGVzQnlJZFxuICAgICAgICAqIEB0eXBlIHVpLlN0eWxlW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBzdHlsZXNCeUlkID0gbmV3IEFycmF5KClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYWxsIFVJIHN0eWxlcyBieSBzdHlsZS1uYW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzdHlsZXNCeU5hbWVcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBzdHlsZXNCeU5hbWUgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgcmVnaXN0ZXJlZCBjdXN0b20gVUkgdHlwZXMvdGVtcGxhdGVzIGJ5IG5hbWUvaWQuXG4gICAgICAgICogQHByb3BlcnR5IGN1c3RvbVR5cGVzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAY3VzdG9tVHlwZXMgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgcmVnaXN0ZXJlZCBVSSBjb250cm9sbGVycyBieSBuYW1lL2lkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXN0b21UeXBlc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbnRyb2xsZXJzID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYWxsIHJlZ2lzdGVyZWQgVUkgZGF0YSBzb3VyY2VzIGJ5IG5hbWUvaWQuXG4gICAgICAgICogQHByb3BlcnR5IGN1c3RvbVR5cGVzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAZGF0YVNvdXJjZXMgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIE1hcHBpbmcgdG8gdGFibGUgdG8gbWFwIGFsaWdubWVudCBuYW1lcyB0byBudW1iZXIgdmFsdWVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbGlnbm1lbnRzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGFsaWdubWVudHMgPSB7IFwibGVmdFwiOiAwLCBcInRvcFwiOiAwLCBcImNlbnRlclwiOiAxLCBcImJvdHRvbVwiOiAyLCBcInJpZ2h0XCI6IDIsIFwiMFwiOiAwLCBcIjFcIjogMSwgXCIyXCI6IDIgfVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIE1hcHBpbmcgdG8gdGFibGUgdG8gbWFwIGJsZW5kLW1vZGUgbmFtZXMgdG8gbnVtYmVyIHZhbHVlcy5cbiAgICAgICAgKiBAcHJvcGVydHkgYmxlbmRNb2Rlc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBibGVuZE1vZGVzID0geyBcIm5vcm1hbFwiOiAwLCBcImFkZFwiOiAxLCBcInN1YlwiOiAyIH1cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBNYXBwaW5nIHRvIHRhYmxlIHRvIG1hcCBzZWxlY3RvciBuYW1lcyB0byBudW1iZXIgdmFsdWVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBzZWxlY3RvcnNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBzZWxlY3RvcnMgPSB7IG5vcm1hbDogMCwgaG92ZXI6IDEsIHNlbGVjdGVkOiAyLCBlbmFibGVkOiAzLCBmb2N1c2VkOiA0IH1cbiAgICAgICAgQGRlZmF1bHRQbGFjZWhvbGRlclBhcmFtcyA9IHt9XG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBVSSBNYW5hZ2VyLCBvcHRpbWl6ZXMgc3R5bGVzLCBldGMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICAgICBAc2V0dXBTdHlsZXMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRoZSBVSSBzdHlsZXMgYnkgd3JhcHBpbmcgdGhlbSBpbnRvIHVpLlN0eWxlIG9iamVjdHMgYW5kIG9wdGltaXppbmcgdGhlIGFjY2Vzcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwU3R5bGVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBTdHlsZXM6IC0+XG4gICAgICAgIGlkID0gMFxuICAgICAgICBzZWxlY3Rvck1hcCA9IEBzZWxlY3RvcnNcbiAgICAgICAgZm9yIGsgb2YgQHN0eWxlc1xuICAgICAgICAgICAgc3VicyA9IGsuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICBzZWxlY3RvciA9IHN1YnNbMF0uc3BsaXQoXCI6XCIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHNlbGVjdG9yTWFwW3NlbGVjdG9yWzFdXVxuICAgICAgICAgICAgICAgIEBzdHlsZXNCeUlkW2lkXSA9IG5ldyB1aS5TdHlsZShAc3R5bGVzW2tdLCBpZCwgc2VsZWN0b3JNYXBbc2VsZWN0b3JbMV1dKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzdHlsZXNCeUlkW2lkXSA9IG5ldyB1aS5TdHlsZShAc3R5bGVzW2tdLCBpZCwgMClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgIUBzdHlsZXNCeU5hbWVbc2VsZWN0b3JbMF1dXG4gICAgICAgICAgICAgICAgQHN0eWxlc0J5TmFtZVtzZWxlY3RvclswXV0gPSBbXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgQHN0eWxlc0J5TmFtZVtzZWxlY3RvclswXV0ucHVzaChAc3R5bGVzQnlJZFtpZF0pXG4gICAgICAgICAgICBAc3R5bGVzW2tdID0gQHN0eWxlc0J5SWRbaWRdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlkKytcbiAgICAgICAgXG4gICAgICAgIGZvciBrIG9mIEBzdHlsZXNcbiAgICAgICAgICAgIHN1YnMgPSBrLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgaWYgc3Vicy5sZW5ndGggPiAxXG4gICAgICAgICAgICAgICAgQHN0eWxlc0J5TmFtZVtzdWJzWzFdXS5wdXNoKEBzdHlsZXNba10pXG4gICAgICAgICAgICAgICAgQHN0eWxlc1trXS50YXJnZXQgPSBAc3R5bGVzW2suc3BsaXQoXCI6XCIpWzBdXT8uaWRcbiAgICAgICAgICAgICAgICAjQHN0eWxlc1tzdWJzWzFdXS50YXJnZXQgPSBAc3R5bGVzW2tdLmlkXG4gICAgICAgICAgICAgICAgI0BzdHlsZXNba10udGFyZ2V0ID0gQHN0eWxlc1tzdWJzWzFdXS5pZFxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEV4ZWN1dGVzIGFsbCBwbGFjZWhvbGRlciBmb3JtdWxhcyBpbiB0aGUgc3BlY2lmaWVkIGRlc2NyaXB0b3IuIFRoZSBkZXNjcmlwdG9yIHdpbGwgYmUgY2hhbmdlZFxuICAgICogYW5kIHBsYWNlaG9sZGVyIGZvcm11bGFzIGFyZSByZXBsYWNlZCB3aXRoIHRoZWlyIGV2YWx1YXRlZCByZXN1bHQgdmFsdWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBleGVjdXRlUGxhY2Vob2xkZXJGb3JtdWxhc1xuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgZGVzY3JpcHRvci5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPYmplY3QgY29udGFpbmluZyB0aGUgcGxhY2Vob2xkZXIgcGFyYW1zLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBleGVjdXRlUGxhY2Vob2xkZXJGb3JtdWxhczogKGRlc2NyaXB0b3IsIGlkLCBwYXJhbXMpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgZGVzY3JpcHRvcj9cbiAgICAgICAga2V5cyA9IE9iamVjdC5rZXlzKGRlc2NyaXB0b3IpXG4gICAgICAgICAgICBcbiAgICAgICAgZm9yIGsgaW4ga2V5c1xuICAgICAgICAgICAgdiA9IGRlc2NyaXB0b3Jba11cbiAgICAgICAgICAgIGlmIHY/XG4gICAgICAgICAgICAgICAgaWYgdiBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgICAgICAgICAgIGZvciBpLCBjIGluIHZcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGk/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgdHlwZW9mIGkgPT0gXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZXhlY3V0ZVBsYWNlaG9sZGVyRm9ybXVsYXMoaSwgaWQsIHBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGMgIT0gXCJleGVjXCIgYW5kIHR5cGVvZiBpID09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cucCA9IHBhcmFtcyB8fCAgQGRlZmF1bHRQbGFjZWhvbGRlclBhcmFtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZCA9IGRlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdltjXSA9IGkoKVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdHlwZW9mIHYgPT0gXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgICAgICBAZXhlY3V0ZVBsYWNlaG9sZGVyRm9ybXVsYXModiwgaWQsIHBhcmFtcylcbiAgICAgICAgICAgICAgICBlbHNlIGlmIGsgIT0gXCJleGVjX1wiIGFuZCB0eXBlb2YgdiA9PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnAgPSBwYXJhbXMgfHwgQGRlZmF1bHRQbGFjZWhvbGRlclBhcmFtc1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZCA9IGRlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvcltrXSA9IHYoKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIGNhbGN1bGF0aW9uIGZvciBhIHNwZWNpZmllZCBleHByZXNzaW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlQ2FsY0Z1bmN0aW9uXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvbiAtIFRoZSBleHByZXNzaW9uIHRvIGNyZWF0ZSBhIGNhbGN1bGF0aW9uIGZ1bmN0aW9uIGZvci5cbiAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY2FsY3VsYXRpb24gZnVuY3Rpb24uXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgICAgXG4gICAgY3JlYXRlQ2FsY0Z1bmN0aW9uOiAoZXhwcmVzc2lvbikgLT5cbiAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZSgvKFswLTldKyklL2dtLCBcIigkMSAvIDEwMCAqIHYpXCIpXG4gICAgICAgIHJldHVybiBldmFsKFwiKGZ1bmN0aW9uKHYpeyByZXR1cm4gXCIgKyBleHByZXNzaW9uICsgXCJ9KVwiKVxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGZyb20gdGhlIHNwZWNpZmllZCBvYmplY3QgdHlwZS4gVGhlIHR5cGUgaGFzIHRoZSBmb3JtYXRcbiAgICAqIDxuYW1lc3BhY2U+Ljx0eXBlbmFtZT4gbGlrZSB2bi5Db21wb25lbnRfSG90c3BvdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZU9iamVjdFxuICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBuYW1lLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY3JlYXRlZCBvYmplY3QuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgIFxuICAgIGNyZWF0ZU9iamVjdDogKHR5cGUpIC0+XG4gICAgICAgIHN1YnMgPSB0eXBlLnNwbGl0KFwiLlwiKVxuICAgICAgICByZXR1cm4gbmV3IHdpbmRvd1tzdWJzWzBdXVtzdWJzWzFdXSgpXG4gICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGFuIFVJIG9iamVjdCBmcm9tIGEgc3BlY2lmaWVkIFVJIGRlc2NyaXB0b3IuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVGcm9tRGVzY3JpcHRvclxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9VSUVsZW1lbnR9IHBhcmVudCAtIFRoZSBVSSBwYXJlbnQgb2JqZWN0LiAoQSBsYXlvdXQgZm9yIGV4YW1wbGUpLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgVUkgb2JqZWN0LlxuICAgICMjIyAgIFxuICAgIGNyZWF0ZUZyb21EZXNjcmlwdG9yOiAoZGVzY3JpcHRvciwgcGFyZW50KSAtPlxuICAgICAgICBjb250cm9sID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgZm9yIGsgb2YgQGNvbnRyb2xsZXJzXG4gICAgICAgICAgICBpZiBAY29udHJvbGxlcnNba10udHlwZT9cbiAgICAgICAgICAgICAgICBAY29udHJvbGxlcnNba10gPSBAY3JlYXRlT2JqZWN0KEBjb250cm9sbGVyc1trXS50eXBlKVxuICAgICAgICAgICAgXG4gICAgICAgIEBfY3JlYXRlRnJvbURlc2NyaXB0b3IoZGVzY3JpcHRvciwgcGFyZW50KVxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYW4gaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUltYWdlQnV0dG9uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciAtIFRoZSBVSSBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9VSUVsZW1lbnR9IFRoZSBjcmVhdGVkIGltYWdlIGJ1dHRvbiBVSSBvYmplY3QuXG4gICAgIyMjICBcbiAgICBjcmVhdGVJbWFnZUJ1dHRvbjogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0hvdHNwb3QoZGVzY3JpcHRvci5pbWFnZSwgZGVzY3JpcHRvci5pbWFnZUhhbmRsaW5nKSBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgY29udHJvbC5iZWhhdmlvci5zb3VuZCA9IGRlc2NyaXB0b3Iuc291bmRcbiAgICAgICAgY29udHJvbC5iZWhhdmlvci5zb3VuZHMgPSBkZXNjcmlwdG9yLnNvdW5kc1xuICAgICAgICBjb250cm9sLmltYWdlID0gZGVzY3JpcHRvci5pbWFnZVxuICAgICAgICBjb250cm9sLmltYWdlcyA9IGRlc2NyaXB0b3IuaW1hZ2VzXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuaW1hZ2VGb2xkZXI/XG4gICAgICAgICAgICBjb250cm9sLmltYWdlRm9sZGVyID0gZGVzY3JpcHRvci5pbWFnZUZvbGRlclxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IubG9vcGluZz9cbiAgICAgICAgICAgIGNvbnRyb2wudmlzdWFsLmRpc3Bvc2UoKVxuICAgICAgICAgICAgY29udHJvbC5yZW1vdmVDb21wb25lbnQoY29udHJvbC52aXN1YWwpXG4gICAgICAgICAgICBjb250cm9sLnZpc3VhbCA9IG5ldyBncy5Db21wb25lbnRfVGlsaW5nU3ByaXRlKClcbiAgICAgICAgICAgIGNvbnRyb2wuYWRkQ29tcG9uZW50KGNvbnRyb2wudmlzdWFsKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb250cm9sLnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0gZGVzY3JpcHRvci5sb29waW5nLnZlcnRpY2FsXG4gICAgICAgICAgICBjb250cm9sLnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBkZXNjcmlwdG9yLmxvb3BpbmcuaG9yaXpvbnRhbFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbG9yP1xuICAgICAgICAgICAgY29udHJvbC5jb2xvciA9IENvbG9yLmZyb21BcnJheShkZXNjcmlwdG9yLmNvbG9yKVxuICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYW4gaW1hZ2UgVUkgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlSW1hZ2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAjIyMgICAgIFxuICAgIGNyZWF0ZUltYWdlOiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgY29udHJvbCA9IG5ldyB1aS5PYmplY3RfSW1hZ2UoZGVzY3JpcHRvci5pbWFnZSwgZGVzY3JpcHRvci5pbWFnZUhhbmRsaW5nKSBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5pbWFnZUZvbGRlcj9cbiAgICAgICAgICAgIGNvbnRyb2wuaW1hZ2VGb2xkZXIgPSBkZXNjcmlwdG9yLmltYWdlRm9sZGVyXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5sb29waW5nP1xuICAgICAgICAgICAgY29udHJvbC52aXN1YWwuZGlzcG9zZSgpXG4gICAgICAgICAgICBjb250cm9sLnJlbW92ZUNvbXBvbmVudChjb250cm9sLnZpc3VhbClcbiAgICAgICAgICAgIGNvbnRyb2wudmlzdWFsID0gbmV3IGdzLkNvbXBvbmVudF9UaWxpbmdTcHJpdGUoKVxuICAgICAgICAgICAgY29udHJvbC5hZGRDb21wb25lbnQoY29udHJvbC52aXN1YWwpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRyb2wudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBkZXNjcmlwdG9yLmxvb3BpbmcudmVydGljYWxcbiAgICAgICAgICAgIGNvbnRyb2wudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IGRlc2NyaXB0b3IubG9vcGluZy5ob3Jpem9udGFsXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuY29sb3I/XG4gICAgICAgICAgICBjb250cm9sLmNvbG9yID0gQ29sb3IuZnJvbUFycmF5KGRlc2NyaXB0b3IuY29sb3IpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYW4gaW1hZ2UgbWFwIFVJIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUltYWdlTWFwXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciAtIFRoZSBVSSBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9VSUVsZW1lbnR9IFRoZSBjcmVhdGVkIGltYWdlIGJ1dHRvbiBVSSBvYmplY3QuXG4gICAgIyMjICAgICAgICBcbiAgICBjcmVhdGVJbWFnZU1hcDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0ltYWdlTWFwKClcbiAgICAgICAgY29udHJvbC5ob3RzcG90cyA9IChkZXNjcmlwdG9yLmhvdHNwb3RzfHxbXSkuc2VsZWN0IChoKSAtPiBcbiAgICAgICAgICAgIHsgeDogaC5yZWN0WzBdLCB5OiBoLnJlY3RbMV0sIHNpemU6IHsgd2lkdGg6IGgucmVjdFsyXSwgaGVpZ2h0OiBoLnJlY3RbM10gfSwgZGF0YTogeyBhY3Rpb246IDMsIGFjdGlvbnM6IGguYWN0aW9ucyB9IH1cbiAgICAgICAgY29udHJvbC5pbWFnZXMgPSBkZXNjcmlwdG9yLmltYWdlc1xuICAgICAgICBjb250cm9sLmluc2VydENvbXBvbmVudChuZXcgdWkuQ29tcG9uZW50X0FjdGlvbkhhbmRsZXIoKSwgMSwgXCJhY3Rpb25IYW5kbGVyXCIpXG4gICAgICAgIGNvbnRyb2wudGFyZ2V0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYSB2aWRlbyBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVWaWRlb1xuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfVUlFbGVtZW50fSBUaGUgY3JlYXRlZCBpbWFnZSBidXR0b24gVUkgb2JqZWN0LlxuICAgICMjIyAgICBcbiAgICBjcmVhdGVWaWRlbzogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X1ZpZGVvKClcbiAgICAgICAgY29udHJvbC52aWRlbyA9IGRlc2NyaXB0b3IudmlkZW9cbiAgICAgICAgY29udHJvbC5sb29wID0gZGVzY3JpcHRvci5sb29wID8geWVzXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYSBwYW5lbCBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVQYW5lbFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfVUlFbGVtZW50fSBUaGUgY3JlYXRlZCBpbWFnZSBidXR0b24gVUkgb2JqZWN0LlxuICAgICMjIyAgICAgICBcbiAgICBjcmVhdGVQYW5lbDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X1BhbmVsKClcbiAgICAgICAgY29udHJvbC5tb2RhbCA9IGRlc2NyaXB0b3IubW9kYWwgPyBub1xuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbG9yP1xuICAgICAgICAgICAgY29udHJvbC5jb2xvciA9IENvbG9yLmZyb21BcnJheShkZXNjcmlwdG9yLmNvbG9yKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9sXG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIGZyYW1lIFVJIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUZyYW1lXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciAtIFRoZSBVSSBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9VSUVsZW1lbnR9IFRoZSBjcmVhdGVkIGltYWdlIGJ1dHRvbiBVSSBvYmplY3QuXG4gICAgIyMjICAgICAgICAgICBcbiAgICBjcmVhdGVGcmFtZTogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0ZyYW1lKGRlc2NyaXB0b3IuZnJhbWVTa2luKVxuICAgICAgICBjb250cm9sLmZyYW1lVGhpY2tuZXNzID0gZGVzY3JpcHRvci5mcmFtZVRoaWNrbmVzcyB8fCAxNlxuICAgICAgICBjb250cm9sLmZyYW1lQ29ybmVyU2l6ZSA9IGRlc2NyaXB0b3IuZnJhbWVDb3JuZXJTaXplIHx8IDE2XG4gICAgICAgIGNvbnRyb2wuaW1hZ2UgPSBkZXNjcmlwdG9yLmltYWdlXG4gICAgICAgIGNvbnRyb2wuaW1hZ2VzID0gZGVzY3JpcHRvci5pbWFnZXNcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9sXG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIHRocmVlLXBhcnQgaW1hZ2UgVUkgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlVGhyZWVQYXJ0SW1hZ2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAjIyMgICAgIFxuICAgIGNyZWF0ZVRocmVlUGFydEltYWdlOiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgY29udHJvbCA9IG5ldyB1aS5PYmplY3RfVGhyZWVQYXJ0SW1hZ2UoZGVzY3JpcHRvci5mcmFtZVNraW4pXG4gICAgICAgIGNvbnRyb2wuZmlyc3RQYXJ0U2l6ZSA9IGRlc2NyaXB0b3IuZmlyc3RQYXJ0U2l6ZSB8fCAxNlxuICAgICAgICBjb250cm9sLm1pZGRsZVBhcnRTaXplID0gZGVzY3JpcHRvci5taWRkbGVQYXJ0U2l6ZSB8fCAxXG4gICAgICAgIGNvbnRyb2wubGFzdFBhcnRTaXplID0gZGVzY3JpcHRvci5sYXN0UGFydFNpemUgfHwgMTZcbiAgICAgICAgY29udHJvbC5pbWFnZSA9IGRlc2NyaXB0b3IuaW1hZ2VcbiAgICAgICAgY29udHJvbC5pbWFnZXMgPSBkZXNjcmlwdG9yLmltYWdlc1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xcbiAgICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIHRleHQgVUkgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlVGV4dFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfVUlFbGVtZW50fSBUaGUgY3JlYXRlZCBpbWFnZSBidXR0b24gVUkgb2JqZWN0LlxuICAgICMjIyAgICAgXG4gICAgY3JlYXRlVGV4dDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X1RleHQoKVxuICAgICAgICBjb250cm9sLnRleHQgPSBsY3MoZGVzY3JpcHRvci50ZXh0KVxuICAgICAgICBjb250cm9sLnNpemVUb0ZpdCA9IGRlc2NyaXB0b3Iuc2l6ZVRvRml0XG4gICAgICAgIGNvbnRyb2wuZm9ybWF0dGluZyA9IGRlc2NyaXB0b3IuZm9ybWF0dGluZ1xuICAgICAgICBjb250cm9sLndvcmRXcmFwID0gZGVzY3JpcHRvci53b3JkV3JhcCA/IG5vXG4gICAgICAgIGNvbnRyb2wuYmVoYXZpb3IuZm9ybWF0ID0gZGVzY3JpcHRvci5mb3JtYXRcbiAgICAgICAgaWYgZGVzY3JpcHRvci50ZXh0UGFkZGluZ1xuICAgICAgICAgICAgY29udHJvbC5iZWhhdmlvci5wYWRkaW5nID0gdWkuU3BhY2UuZnJvbUFycmF5KGRlc2NyaXB0b3IudGV4dFBhZGRpbmcpXG4gICAgICAgIGlmIGRlc2NyaXB0b3IucmVzb2x2ZVBsYWNlaG9sZGVycz9cbiAgICAgICAgICAgIGNvbnRyb2wucmVzb2x2ZVBsYWNlaG9sZGVycyA9IGRlc2NyaXB0b3IucmVzb2x2ZVBsYWNlaG9sZGVyc1xuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbG9yP1xuICAgICAgICAgICAgY29udHJvbC5jb2xvciA9IENvbG9yLmZyb21BcnJheShkZXNjcmlwdG9yLmNvbG9yKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9sXG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIGZyZWUtbGF5b3V0IFVJIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUZyZWVMYXlvdXRcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAjIyMgXG4gICAgY3JlYXRlRnJlZUxheW91dDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGlmIGRlc2NyaXB0b3IuZnJhbWU/XG4gICAgICAgICAgICBjb250cm9sID0gbmV3IHVpLk9iamVjdF9GcmVlTGF5b3V0KGRlc2NyaXB0b3IuZnJhbWVbMF0gfHwgMCwgZGVzY3JpcHRvci5mcmFtZVsxXSB8fCAwLCBkZXNjcmlwdG9yLmZyYW1lWzJdIHx8IDEsIGRlc2NyaXB0b3IuZnJhbWVbM10gfHwgMSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29udHJvbCA9IG5ldyB1aS5PYmplY3RfRnJlZUxheW91dCgwLCAwLCAxLCAxKVxuICAgICAgICBjb250cm9sLnNpemVUb0ZpdCA9IGRlc2NyaXB0b3Iuc2l6ZVRvRml0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYSBzdGFjay1sYXlvdXQgVUkgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlU3RhY2tMYXlvdXRcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAjIyMgICAgIFxuICAgIGNyZWF0ZVN0YWNrTGF5b3V0OiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgaWYgZGVzY3JpcHRvci5mcmFtZT9cbiAgICAgICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X1N0YWNrTGF5b3V0KGRlc2NyaXB0b3IuZnJhbWVbMF0gfHwgMCwgZGVzY3JpcHRvci5mcmFtZVsxXSB8fCAwLCBkZXNjcmlwdG9yLmZyYW1lWzJdIHx8IDEsIGRlc2NyaXB0b3IuZnJhbWVbM10gfHwgMSwgZGVzY3JpcHRvci5vcmllbnRhdGlvbilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29udHJvbCA9IG5ldyB1aS5PYmplY3RfU3RhY2tMYXlvdXQoMCwgMCwgMSwgMSwgZGVzY3JpcHRvci5vcmllbnRhdGlvbilcbiAgICAgICAgY29udHJvbC5zaXplVG9GaXQgPSBkZXNjcmlwdG9yLnNpemVUb0ZpdFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGEgc3ByZWFkLWxheW91dCBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVTcHJlYWRMYXlvdXRcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgaW1hZ2UgYnV0dG9uIFVJIG9iamVjdC5cbiAgICAjIyMgICAgIFxuICAgIGNyZWF0ZVNwcmVhZExheW91dDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGlmIGRlc2NyaXB0b3IuZnJhbWU/XG4gICAgICAgICAgICBjb250cm9sID0gbmV3IHVpLk9iamVjdF9TcHJlYWRMYXlvdXQoZGVzY3JpcHRvci5mcmFtZVswXSB8fCAwLCBkZXNjcmlwdG9yLmZyYW1lWzFdIHx8IDAsIGRlc2NyaXB0b3IuZnJhbWVbMl0gfHwgMSwgZGVzY3JpcHRvci5mcmFtZVszXSB8fCAxLCBkZXNjcmlwdG9yLm9yaWVudGF0aW9uKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb250cm9sID0gbmV3IHVpLk9iamVjdF9TcHJlYWRMYXlvdXQoMCwgMCwgMSwgMSwgZGVzY3JpcHRvci5vcmllbnRhdGlvbilcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGEgZ3JpZC1sYXlvdXQgVUkgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlR3JpZExheW91dFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfVUlFbGVtZW50fSBUaGUgY3JlYXRlZCBpbWFnZSBidXR0b24gVUkgb2JqZWN0LlxuICAgICMjIyAgICBcbiAgICBjcmVhdGVHcmlkTGF5b3V0OiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgaWYgZGVzY3JpcHRvci5mcmFtZT9cbiAgICAgICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0dyaWRMYXlvdXQoZGVzY3JpcHRvci5mcmFtZVswXSwgZGVzY3JpcHRvci5mcmFtZVsxXSwgZGVzY3JpcHRvci5mcmFtZVsyXSwgZGVzY3JpcHRvci5mcmFtZVszXSwgZGVzY3JpcHRvci5yb3dzLCBkZXNjcmlwdG9yLmNvbHVtbnMsIGRlc2NyaXB0b3IudGVtcGxhdGUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0dyaWRMYXlvdXQoMCwgMCwgMSwgMSwgZGVzY3JpcHRvci5yb3dzLCBkZXNjcmlwdG9yLmNvbHVtbnMsIGRlc2NyaXB0b3IudGVtcGxhdGUpXG4gICAgICAgIGNvbnRyb2wuY2VsbFNwYWNpbmcgPSBkZXNjcmlwdG9yLmNlbGxTcGFjaW5nIHx8IFswLCAwLCAwLCAwXVxuICAgICAgICBjb250cm9sLnNpemVUb0ZpdCA9IGRlc2NyaXB0b3Iuc2l6ZVRvRml0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGEgbWVzc2FnZSBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVNZXNzYWdlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvciAtIFRoZSBVSSBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9VSUVsZW1lbnR9IFRoZSBjcmVhdGVkIGltYWdlIGJ1dHRvbiBVSSBvYmplY3QuXG4gICAgIyMjICAgICBcbiAgICBjcmVhdGVNZXNzYWdlOiAoZGVzY3JpcHRvcikgLT5cbiAgICAgICAgY29udHJvbCA9IG5ldyB1aS5PYmplY3RfTWVzc2FnZSgpIFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xcbiAgICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIGRhdGEtZ3JpZCBVSSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVEYXRhR3JpZFxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfVUlFbGVtZW50fSBUaGUgY3JlYXRlZCBpbWFnZSBidXR0b24gVUkgb2JqZWN0LlxuICAgICMjIyAgICBcbiAgICBjcmVhdGVEYXRhR3JpZDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBuZXcgdWkuT2JqZWN0X0RhdGFHcmlkKGRlc2NyaXB0b3IpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGFuIFVJIG9iamVjdCBkZXBlbmRpbmcgb24gdGhlIG9iamVjdC10eXBlIG9mIHRoZSBzcGVjaWZpZWQgVUkgZGVzY3JpcHRvci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUNvbnRyb2xcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgVUkgb2JqZWN0LlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY3JlYXRlQ29udHJvbDogKGRlc2NyaXB0b3IpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggZGVzY3JpcHRvci50eXBlXG4gICAgICAgICAgICB3aGVuIFwidWkuSW1hZ2VCdXR0b25cIlxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlSW1hZ2VCdXR0b24oZGVzY3JpcHRvcilcbiAgICAgICAgICAgIHdoZW4gXCJ1aS5JbWFnZVwiXG4gICAgICAgICAgICAgICAgY29udHJvbCA9IEBjcmVhdGVJbWFnZShkZXNjcmlwdG9yKVxuICAgICAgICAgICAgd2hlbiBcInVpLkltYWdlTWFwXCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZUltYWdlTWFwKGRlc2NyaXB0b3IpXG4gICAgICAgICAgICB3aGVuIFwidWkuVmlkZW9cIlxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlVmlkZW8oZGVzY3JpcHRvcilcbiAgICAgICAgICAgIHdoZW4gXCJ1aS5QYW5lbFwiXG4gICAgICAgICAgICAgICAgY29udHJvbCA9IEBjcmVhdGVQYW5lbChkZXNjcmlwdG9yKVxuICAgICAgICAgICAgd2hlbiBcInVpLkZyYW1lXCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZUZyYW1lKGRlc2NyaXB0b3IpXG4gICAgICAgICAgICB3aGVuIFwidWkuVGhyZWVQYXJ0SW1hZ2VcIlxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlVGhyZWVQYXJ0SW1hZ2UoZGVzY3JpcHRvcilcbiAgICAgICAgICAgIHdoZW4gXCJ1aS5UZXh0XCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZVRleHQoZGVzY3JpcHRvcilcbiAgICAgICAgICAgIHdoZW4gXCJ1aS5NZXNzYWdlXCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZU1lc3NhZ2UoZGVzY3JpcHRvcilcbiAgICAgICAgICAgIHdoZW4gXCJ1aS5EYXRhR3JpZFwiXG4gICAgICAgICAgICAgICAgY29udHJvbCA9IEBjcmVhdGVEYXRhR3JpZChkZXNjcmlwdG9yKVxuICAgICAgICAgICAgd2hlbiBcInVpLkZyZWVMYXlvdXRcIlxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlRnJlZUxheW91dChkZXNjcmlwdG9yKVxuICAgICAgICAgICAgd2hlbiBcInVpLlN0YWNrTGF5b3V0XCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZVN0YWNrTGF5b3V0KGRlc2NyaXB0b3IpXG4gICAgICAgICAgICB3aGVuIFwidWkuU3ByZWFkTGF5b3V0XCJcbiAgICAgICAgICAgICAgICBjb250cm9sID0gQGNyZWF0ZVNwcmVhZExheW91dChkZXNjcmlwdG9yKVxuICAgICAgICAgICAgd2hlbiBcInVpLkdyaWRMYXlvdXRcIlxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlR3JpZExheW91dChkZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbFxuICAgIFxuICAgIFxuICAgIGNyZWF0ZUxheW91dFJlY3Q6IChmcmFtZSwgY29udHJvbCkgLT5cbiAgICAgICAgaWYgIWNvbnRyb2wubGF5b3V0UmVjdFxuICAgICAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0ID0gbmV3IHVpLkxheW91dFJlY3QoKVxuICAgICAgICBjb250cm9sLmxheW91dFJlY3Quc2V0KDAsIDAsIDAsIDApXG4gICAgICAgIFxuICAgICAgICBpZiBmcmFtZT9cbiAgICAgICAgICAgIGlmIGZyYW1lWzBdPy5sZW5ndGg/XG4gICAgICAgICAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0LnggPSBAY3JlYXRlQ2FsY0Z1bmN0aW9uKGZyYW1lWzBdKVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC54ID0gKGRlc2NyaXB0b3IuZnJhbWVbMF0gPyBjb250cm9sLmRzdFJlY3QueClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGZyYW1lWzFdPy5sZW5ndGg/XG4gICAgICAgICAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0LnkgPSBAY3JlYXRlQ2FsY0Z1bmN0aW9uKGZyYW1lWzFdKVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gKGZyYW1lWzFdID8gY29udHJvbC5kc3RSZWN0LnkpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBmcmFtZVsyXT8ubGVuZ3RoP1xuICAgICAgICAgICAgICAgIGNvbnRyb2wubGF5b3V0UmVjdC53aWR0aCA9IEBjcmVhdGVDYWxjRnVuY3Rpb24oZnJhbWVbMl0pXG4gICAgICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LndpZHRoID0gMVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC53aWR0aCA9IChmcmFtZVsyXSA/IGNvbnRyb2wuZHN0UmVjdC53aWR0aClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGZyYW1lWzNdPy5sZW5ndGg/XG4gICAgICAgICAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0LmhlaWdodCA9IEBjcmVhdGVDYWxjRnVuY3Rpb24oZnJhbWVbM10pXG4gICAgICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LmhlaWdodCA9IDFcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjb250cm9sLmRzdFJlY3QuaGVpZ2h0ID0gKGZyYW1lWzNdID8gY29udHJvbC5kc3RSZWN0LmhlaWdodClcbiAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyB0aGUgc3R5bGVzIGRlZmluZWQgaW4gYW4gYXJyYXkgb2Ygc3R5bGUtbmFtZXMgdG8gdGhlIHNwZWNpZmllZCBjb250cm9sLlxuICAgICpcbiAgICAqIEBtZXRob2QgYWRkQ29udHJvbFN0eWxlc1xuICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRyb2wgLSBUaGUgY29udHJvbCB0byBhZGQgdGhlIHN0eWxlcyB0by5cbiAgICAqIEBwYXJhbSB7c3RyaW5nW119IHN0eWxlcyAtIEFycmF5IG9mIHN0eWxlLW5hbWVzIHRvIGFkZC5cbiAgICAjIyMgICAgIFxuICAgIGFkZENvbnRyb2xTdHlsZXM6IChjb250cm9sLCBzdHlsZXMpIC0+XG4gICAgICAgIGZvciBzdHlsZU5hbWUgaW4gc3R5bGVzXG4gICAgICAgICAgICBpZiBAc3R5bGVzQnlOYW1lW3N0eWxlTmFtZV0/XG4gICAgICAgICAgICAgICAgZm9yIHN0eWxlIGluIEBzdHlsZXNCeU5hbWVbc3R5bGVOYW1lXVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sLnN0eWxlcy5wdXNoKHN0eWxlKVxuICAgICAgICAgICAgICAgICAgICBpZiBzdHlsZS50YXJnZXQgPT0gLTEgYW5kIHN0eWxlLnNlbGVjdG9yID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLmFwcGx5KGNvbnRyb2wpXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhbiBVSSBvYmplY3QgZnJvbSBhIHNwZWNpZmllZCBVSSBkZXNjcmlwdG9yLiBUaGlzIG1ldGhvZCBpcyBjYWxsZWRcbiAgICAqIHJlY3Vyc2l2ZWx5IGZvciBhbGwgY2hpbGQtZGVzY3JpcHRvcnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3JcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yIC0gVGhlIFVJIG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICogQHBhcmFtIHtncy5PYmplY3RfVUlFbGVtZW50fSBwYXJlbnQgLSBUaGUgVUkgcGFyZW50IG9iamVjdC4gKEEgbGF5b3V0IGZvciBleGFtcGxlKS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSBpbmRleC5cbiAgICAqIEByZXR1cm4ge2dzLk9iamVjdF9VSUVsZW1lbnR9IFRoZSBjcmVhdGVkIFVJIG9iamVjdC5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgIFxuICAgIGNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcjogKGRlc2NyaXB0b3IsIHBhcmVudCwgaW5kZXgpIC0+XG4gICAgICAgIGNvbnRyb2wgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLnN0eWxlP1xuICAgICAgICAgICAgZGVzY3JpcHRvci5zdHlsZXMgPSBbZGVzY3JpcHRvci5zdHlsZV1cbiAgICAgICAgICAgIGRlbGV0ZSBkZXNjcmlwdG9yLnN0eWxlXG4gICAgICAgICAgICBcbiAgICAgICAgZGVzY3JpcHRvciA9IE9iamVjdC5kZWVwQ29weShkZXNjcmlwdG9yKVxuICAgICAgICBAZXhlY3V0ZVBsYWNlaG9sZGVyRm9ybXVsYXMoZGVzY3JpcHRvciwgZGVzY3JpcHRvci5pZCwgZGVzY3JpcHRvci5wYXJhbXMpXG4gICAgICAgICAgICBcbiAgICAgICAgY29udHJvbCA9IEBjcmVhdGVDb250cm9sKGRlc2NyaXB0b3IpXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgY29udHJvbD9cbiAgICAgICAgICAgIHR5cGUgPSBPYmplY3QuZGVlcENvcHkoQGN1c3RvbVR5cGVzW2Rlc2NyaXB0b3IudHlwZV0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBleGVjdXRlUGxhY2Vob2xkZXJGb3JtdWxhcyh0eXBlLCBkZXNjcmlwdG9yLmlkLCBkZXNjcmlwdG9yLnBhcmFtcylcbiAgICAgICBcbiAgICAgICAgICAgIHR5cGVOYW1lID0gdHlwZS50eXBlXG4gICAgICAgICAgICBjdXN0b21GaWVsZHMgPSB0eXBlLmN1c3RvbUZpZWxkc1xuICAgICAgICAgICAgYmluZGluZ3MgPSB0eXBlLmJpbmRpbmdzXG4gICAgICAgICAgICBmb3JtdWxhcyA9IHR5cGUuZm9ybXVsYXNcbiAgICAgICAgICAgIGFjdGlvbnMgPSB0eXBlLmFjdGlvbnNcbiAgICAgICAgICAgIGlmIHR5cGUuc3R5bGU/XG4gICAgICAgICAgICAgICAgdHlwZS5zdHlsZXMgPSBbdHlwZS5zdHlsZV1cbiAgICAgICAgICAgICAgICB0eXBlLnN0eWxlID0gbnVsbFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgT2JqZWN0Lm1peGluKHR5cGUsIGRlc2NyaXB0b3IpXG4gICAgICAgICAgICBpZiBjdXN0b21GaWVsZHM/IHRoZW4gT2JqZWN0Lm1peGluKHR5cGUuY3VzdG9tRmllbGRzLCBjdXN0b21GaWVsZHMpXG4gICAgICAgICAgICBpZiBiaW5kaW5ncz8gYW5kIGJpbmRpbmdzICE9IHR5cGUuYmluZGluZ3MgdGhlbiB0eXBlLmJpbmRpbmdzID0gdHlwZS5iaW5kaW5ncy5jb25jYXQoYmluZGluZ3MpXG4gICAgICAgICAgICBpZiBmb3JtdWxhcz8gYW5kIGZvcm11bGFzICE9IHR5cGUuZm9ybXVsYXMgdGhlbiB0eXBlLmZvcm11bGFzID0gdHlwZS5mb3JtdWxhcy5jb25jYXQoZm9ybXVsYXMpXG4gICAgICAgICAgICBpZiBhY3Rpb25zPyBhbmQgYWN0aW9ucyAhPSB0eXBlLmFjdGlvbnMgdGhlbiB0eXBlLmFjdGlvbnMgPSBhY3Rpb25zLmNvbmNhdCh0eXBlLmFjdGlvbnMpXG4gICAgICAgICAgICB0eXBlLnR5cGUgPSB0eXBlTmFtZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gQGNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcih0eXBlLCBwYXJlbnQpXG4gICAgICAgIGVsc2UgaWYgcGFyZW50P1xuICAgICAgICAgICAgcGFyZW50LmFkZE9iamVjdChjb250cm9sKVxuICAgICAgICAgICAgY29udHJvbC5pbmRleCA9IGluZGV4XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5hZGRPYmplY3QoY29udHJvbClcbiAgICAgICAgIFxuICAgICAgICBjb250cm9sLnVpID0gbmV3IHVpLkNvbXBvbmVudF9VSUJlaGF2aW9yKClcbiAgICAgICAgY29udHJvbC5hZGRDb21wb25lbnQoY29udHJvbC51aSlcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBjb250cm9sLnBhcmFtcyA9IGRlc2NyaXB0b3IucGFyYW1zXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLnVwZGF0ZUJlaGF2aW9yID09IFwiY29udGludW91c1wiXG4gICAgICAgICAgICBjb250cm9sLnVwZGF0ZUJlaGF2aW9yID0gdWkuVXBkYXRlQmVoYXZpb3IuQ09OVElOVU9VU1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuaW5oZXJpdFByb3BlcnRpZXNcbiAgICAgICAgICAgIGNvbnRyb2wuaW5oZXJpdFByb3BlcnRpZXMgPSB5ZXNcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmZvbnQ/XG4gICAgICAgICAgICBjb250cm9sLmZvbnQgPSBuZXcgRm9udChkZXNjcmlwdG9yLmZvbnQubmFtZSwgZGVzY3JpcHRvci5mb250LnNpemUpXG4gICAgICAgICAgICBjb250cm9sLmZvbnQuYm9sZCA9IGRlc2NyaXB0b3IuZm9udC5ib2xkID8gY29udHJvbC5mb250LmJvbGRcbiAgICAgICAgICAgIGNvbnRyb2wuZm9udC5pdGFsaWMgPSBkZXNjcmlwdG9yLmZvbnQuaXRhbGljID8gY29udHJvbC5mb250Lml0YWxpY1xuICAgICAgICAgICAgY29udHJvbC5mb250LnNtYWxsQ2FwcyA9IGRlc2NyaXB0b3IuZm9udC5zbWFsbENhcHMgPyBjb250cm9sLmZvbnQuc21hbGxDYXBzXG4gICAgICAgICAgICBjb250cm9sLmZvbnQudW5kZXJsaW5lID0gZGVzY3JpcHRvci5mb250LnVuZGVybGluZSA/IGNvbnRyb2wuZm9udC51bmRlcmxpbmVcbiAgICAgICAgICAgIGNvbnRyb2wuZm9udC5zdHJpa2VUaHJvdWdoID0gZGVzY3JpcHRvci5mb250LnN0cmlrZVRocm91Z2ggPyBjb250cm9sLmZvbnQuc3RyaWtlVGhyb3VnaFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBkZXNjcmlwdG9yLmZvbnQuY29sb3I/XG4gICAgICAgICAgICAgICAgY29udHJvbC5mb250LmNvbG9yID0gQ29sb3IuZnJvbUFycmF5KGRlc2NyaXB0b3IuZm9udC5jb2xvcilcbiAgICAgICAgICAgIGlmIGRlc2NyaXB0b3IuZm9udC5ib3JkZXI/XG4gICAgICAgICAgICAgICAgY29udHJvbC5mb250LmJvcmRlciA9IGRlc2NyaXB0b3IuZm9udC5ib3JkZXIgPyBub1xuICAgICAgICAgICAgICAgIGNvbnRyb2wuZm9udC5ib3JkZXJTaXplID0gZGVzY3JpcHRvci5mb250LmJvcmRlclNpemUgPyA0XG4gICAgICAgICAgICAgICNpZiBkZXNjcmlwdG9yLmZvbnQuYm9yZGVyLmNvbG9yXG4gICAgICAgICAgICAjICAgICAgICBjb250cm9sLmZvbnQuYm9yZGVyQ29sb3IgPSBDb2xvci5mcm9tQXJyYXkoZGVzY3JpcHRvci5mb250LmJvcmRlci5jb2xvcilcbiAgICAgICAgICAgICAgICBjb250cm9sLmZvbnQuYm9yZGVyQ29sb3IgPSBuZXcgQ29sb3IoMCwgMCwgMClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGRlc2NyaXB0b3IuZm9udC5vdXRsaW5lP1xuICAgICAgICAgICAgICAgIGNvbnRyb2wuZm9udC5ib3JkZXIgPSBkZXNjcmlwdG9yLmZvbnQub3V0bGluZSA/IG5vXG4gICAgICAgICAgICAgICAgY29udHJvbC5mb250LmJvcmRlclNpemUgPSBkZXNjcmlwdG9yLmZvbnQub3V0bGluZS5zaXplID8gNFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIGRlc2NyaXB0b3IuZm9udC5vdXRsaW5lLmNvbG9yP1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sLmZvbnQuYm9yZGVyQ29sb3IgPSBDb2xvci5mcm9tQXJyYXkoZGVzY3JpcHRvci5mb250Lm91dGxpbmUuY29sb3IpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb250cm9sLmZvbnQuYm9yZGVyQ29sb3IgPSBuZXcgQ29sb3IoMCwgMCwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbXBvbmVudHM/XG4gICAgICAgICAgICBmb3IgYyBpbiBkZXNjcmlwdG9yLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBtID0gYy5tb2R1bGUgfHwgXCJnc1wiXG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbmV3IHdpbmRvd1ttXVtjLnR5cGVdKGMucGFyYW1zKVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuYWRkQ29tcG9uZW50KGNvbXBvbmVudCwgYy5pZClcbiAgICAgICAgICAgICAgICBjb250cm9sW2MuaWRdID0gY29tcG9uZW50XG4gICAgICAgICAgICAgICAgI2NvbXBvbmVudC5zZXR1cD8oKVxuICAgICAgICAgXG4gICAgICAgIGNvbnRyb2wuZm9jdXNhYmxlID0gZGVzY3JpcHRvci5mb2N1c2FibGUgPyBjb250cm9sLmZvY3VzYWJsZSAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5uZXh0S2V5T2JqZWN0XG4gICAgICAgICAgICBjb250cm9sLnVpLm5leHRLZXlPYmplY3RJZCA9IGRlc2NyaXB0b3IubmV4dEtleU9iamVjdFxuICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5pbml0aWFsRm9jdXNcbiAgICAgICAgICAgIGNvbnRyb2wudWkuZm9jdXMoKVxuICAgICAgICAgICAgXG4gICAgICAgIGFjdGlvbnMgPSBPYmplY3QuZGVlcENvcHkoaWYgZGVzY3JpcHRvci5hY3Rpb24/IHRoZW4gW2Rlc2NyaXB0b3IuYWN0aW9uXSBlbHNlIGRlc2NyaXB0b3IuYWN0aW9ucykgXG4gICAgICAgIGlmIGFjdGlvbnM/XG4gICAgICAgICAgICBmb3IgYWN0aW9uIGluIGFjdGlvbnNcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24/XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5ldmVudCA9IGFjdGlvbi5ldmVudCA/IFwib25BY2NlcHRcIlxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgYWN0aW9uLnRhcmdldD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGlmIEBjb250cm9sbGVycz8gdGhlbiBAY29udHJvbGxlcnNbZGVzY3JpcHRvci50YXJnZXRdIGVsc2UgY29udHJvbGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLnRhcmdldCA9IHRhcmdldCB8fCBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3JcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29udHJvbC5hY3Rpb25zID0gYWN0aW9uc1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZighY29udHJvbC5maW5kQ29tcG9uZW50QnlJZChcImFjdGlvbkhhbmRsZXJcIikpXG4gICAgICAgICAgICAgICAgY29udHJvbC5pbnNlcnRDb21wb25lbnQobmV3IHVpLkNvbXBvbmVudF9BY3Rpb25IYW5kbGVyKCksIDEsIFwiYWN0aW9uSGFuZGxlclwiKVxuICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5pZD9cbiAgICAgICAgICAgIGNvbnRyb2wuaWQgPSBkZXNjcmlwdG9yLmlkXG4gICAgICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQuc2V0T2JqZWN0QnlJZChjb250cm9sLCBjb250cm9sLmlkKVxuICAgICAgICAgICAgXG4gICAgICAgIGNvbnRyb2wuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JcbiAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0ID0gbmV3IFJlY3QoKVxuICAgICAgICBjb250cm9sLmxheW91dFJlY3Quc2V0KDAsIDAsIDAsIDApXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuZnJhbWU/XG4gICAgICAgICAgICBpZiBkZXNjcmlwdG9yLmZyYW1lWzBdPy5sZW5ndGg/XG4gICAgICAgICAgICAgICAgY29udHJvbC5sYXlvdXRSZWN0LnggPSBAY3JlYXRlQ2FsY0Z1bmN0aW9uKGRlc2NyaXB0b3IuZnJhbWVbMF0pXG4gICAgICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnggPSAwXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LnggPSAoZGVzY3JpcHRvci5mcmFtZVswXSA/IGNvbnRyb2wuZHN0UmVjdC54KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgZGVzY3JpcHRvci5mcmFtZVsxXT8ubGVuZ3RoP1xuICAgICAgICAgICAgICAgIGNvbnRyb2wubGF5b3V0UmVjdC55ID0gQGNyZWF0ZUNhbGNGdW5jdGlvbihkZXNjcmlwdG9yLmZyYW1lWzFdKVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC55ID0gKGRlc2NyaXB0b3IuZnJhbWVbMV0gPyBjb250cm9sLmRzdFJlY3QueSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGRlc2NyaXB0b3IuZnJhbWVbMl0/Lmxlbmd0aD9cbiAgICAgICAgICAgICAgICBjb250cm9sLmxheW91dFJlY3Qud2lkdGggPSBAY3JlYXRlQ2FsY0Z1bmN0aW9uKGRlc2NyaXB0b3IuZnJhbWVbMl0pXG4gICAgICAgICAgICAgICAgY29udHJvbC5kc3RSZWN0LndpZHRoID0gMVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC53aWR0aCA9IChkZXNjcmlwdG9yLmZyYW1lWzJdID8gY29udHJvbC5kc3RSZWN0LndpZHRoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgZGVzY3JpcHRvci5mcmFtZVszXT8ubGVuZ3RoP1xuICAgICAgICAgICAgICAgIGNvbnRyb2wubGF5b3V0UmVjdC5oZWlnaHQgPSBAY3JlYXRlQ2FsY0Z1bmN0aW9uKGRlc2NyaXB0b3IuZnJhbWVbM10pICNwYXJzZUludChkZXNjcmlwdG9yLmZyYW1lWzNdLnNwbGl0KFwiJVwiKVswXSlcbiAgICAgICAgICAgICAgICBjb250cm9sLmRzdFJlY3QuaGVpZ2h0ID0gMVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQgPSAoZGVzY3JpcHRvci5mcmFtZVszXSA/IGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQpXG4gICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLnNpemVUb1BhcmVudD9cbiAgICAgICAgICAgIGNvbnRyb2wuc2l6ZVRvUGFyZW50ID0gZGVzY3JpcHRvci5zaXplVG9QYXJlbnRcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmJsZW5kTW9kZT9cbiAgICAgICAgICAgIGNvbnRyb2wuYmxlbmRNb2RlID0gQGJsZW5kTW9kZXNbZGVzY3JpcHRvci5ibGVuZE1vZGVdXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5hbmNob3I/XG4gICAgICAgICAgICBjb250cm9sLmFuY2hvci5zZXQoZGVzY3JpcHRvci5hbmNob3JbMF0sIGRlc2NyaXB0b3IuYW5jaG9yWzFdKVxuICAgICAgICBcblxuICAgICAgICBjb250cm9sLm9wYWNpdHkgPSBkZXNjcmlwdG9yLm9wYWNpdHkgPyAyNTUgICAgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IubWluaW11bVNpemU/XG4gICAgICAgICAgICBjb250cm9sLm1pbmltdW1TaXplID0geyB3aWR0aDogZGVzY3JpcHRvci5taW5pbXVtU2l6ZVswXSwgaGVpZ2h0OiBkZXNjcmlwdG9yLm1pbmltdW1TaXplWzFdIH1cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLnJlc2l6YWJsZT8gdGhlbiBjb250cm9sLnJlc2l6YWJsZSA9IGRlc2NyaXB0b3IucmVzaXphYmxlXG4gICAgICAgIGlmIGRlc2NyaXB0b3Iuc2Nyb2xsYWJsZT8gdGhlbiBjb250cm9sLnNjcm9sbGFibGUgPSBkZXNjcmlwdG9yLnNjcm9sbGFibGUgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuZml4ZWRTaXplPyB0aGVuIGNvbnRyb2wuZml4ZWRTaXplID0gZGVzY3JpcHRvci5maXhlZFNpemVcbiAgICAgICAgaWYgZGVzY3JpcHRvci5kcmFnZ2FibGU/XG4gICAgICAgICAgICBjb250cm9sLmRyYWdnYWJsZSA9IGRlc2NyaXB0b3IuZHJhZ2dhYmxlXG4gICAgICAgICAgICBjb250cm9sLmRyYWdnYWJsZS5zdGVwID0gMFxuICAgICAgICAgICAgaWYgY29udHJvbC5kcmFnZ2FibGUucmVjdD9cbiAgICAgICAgICAgICAgICBjb250cm9sLmRyYWdnYWJsZS5yZWN0ID0gUmVjdC5mcm9tQXJyYXkoY29udHJvbC5kcmFnZ2FibGUucmVjdClcbiAgICAgICAgICAgIGNvbnRyb2wuYWRkQ29tcG9uZW50KG5ldyB1aS5Db21wb25lbnRfRHJhZ2dhYmxlKCkpXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmJpbmRpbmdzP1xuICAgICAgICAgICAgY29udHJvbC5iaW5kaW5ncyA9IGRlc2NyaXB0b3IuYmluZGluZ3NcbiAgICAgICAgICAgIGNvbnRyb2wuaW5zZXJ0Q29tcG9uZW50KG5ldyB1aS5Db21wb25lbnRfQmluZGluZ0hhbmRsZXIoKSwgMClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmZvcm11bGFzP1xuICAgICAgICAgICAgY29udHJvbC5mb3JtdWxhcyA9IGRlc2NyaXB0b3IuZm9ybXVsYXNcbiAgICAgICAgICAgIGNvbnRyb2wuaW5zZXJ0Q29tcG9uZW50KG5ldyB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIoKSwgMClcbiAgICAgICAgICAgIFxuICAgICAgICBjb250cm9sLmRhdGFGaWVsZCA9IGRlc2NyaXB0b3IuZGF0YUZpZWxkXG4gICAgICAgIGNvbnRyb2wuZW5hYmxlZCA9IGRlc2NyaXB0b3IuZW5hYmxlZCA/IHllc1xuICAgICAgICBpZiBkZXNjcmlwdG9yLnNlbGVjdGFibGU/IHRoZW4gY29udHJvbC5zZWxlY3RhYmxlID0gZGVzY3JpcHRvci5zZWxlY3RhYmxlXG4gICAgICAgIGlmIGRlc2NyaXB0b3IuZ3JvdXA/IFxuICAgICAgICAgICAgY29udHJvbC5ncm91cCA9IGRlc2NyaXB0b3IuZ3JvdXBcbiAgICAgICAgICAgIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5hZGRUb0dyb3VwKGNvbnRyb2wsIGNvbnRyb2wuZ3JvdXApXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmN1c3RvbUZpZWxkcz9cbiAgICAgICAgICAgIGNvbnRyb2wuY3VzdG9tRmllbGRzID0gT2JqZWN0LmRlZXBDb3B5KGRlc2NyaXB0b3IuY3VzdG9tRmllbGRzKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IubWFyZ2luP1xuICAgICAgICAgICAgY29udHJvbC5tYXJnaW4ubGVmdCA9IGRlc2NyaXB0b3IubWFyZ2luWzBdXG4gICAgICAgICAgICBjb250cm9sLm1hcmdpbi50b3AgPSBkZXNjcmlwdG9yLm1hcmdpblsxXVxuICAgICAgICAgICAgY29udHJvbC5tYXJnaW4ucmlnaHQgPSBkZXNjcmlwdG9yLm1hcmdpblsyXVxuICAgICAgICAgICAgY29udHJvbC5tYXJnaW4uYm90dG9tID0gZGVzY3JpcHRvci5tYXJnaW5bM11cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLnBhZGRpbmc/XG4gICAgICAgICAgICBjb250cm9sLnBhZGRpbmcubGVmdCA9IGRlc2NyaXB0b3IucGFkZGluZ1swXVxuICAgICAgICAgICAgY29udHJvbC5wYWRkaW5nLnRvcCA9IGRlc2NyaXB0b3IucGFkZGluZ1sxXVxuICAgICAgICAgICAgY29udHJvbC5wYWRkaW5nLnJpZ2h0ID0gZGVzY3JpcHRvci5wYWRkaW5nWzJdXG4gICAgICAgICAgICBjb250cm9sLnBhZGRpbmcuYm90dG9tID0gZGVzY3JpcHRvci5wYWRkaW5nWzNdXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci5hbGlnbm1lbnQ/XG4gICAgICAgICAgICBjb250cm9sLmFsaWdubWVudCA9IEBhbGlnbm1lbnRzW2Rlc2NyaXB0b3IuYWxpZ25tZW50XVxuICAgICAgICAgICAgXG4gICAgICAgIGNvbnRyb2wuYWxpZ25tZW50WSA9IEBhbGlnbm1lbnRzW2Rlc2NyaXB0b3IuYWxpZ25tZW50WSB8fCAwXVxuICAgICAgICBjb250cm9sLmFsaWdubWVudFggPSBAYWxpZ25tZW50c1tkZXNjcmlwdG9yLmFsaWdubWVudFggfHwgMF1cbiAgICAgICAgY29udHJvbC56SW5kZXggPSBkZXNjcmlwdG9yLnpJbmRleCB8fCAwXG4gICAgICAgIGNvbnRyb2wub3JkZXIgPSBkZXNjcmlwdG9yLm9yZGVyIHx8IDBcbiAgICAgICAgY29udHJvbC5jaGFpbk9yZGVyID0gKGRlc2NyaXB0b3IuY2hhaW5PcmRlciA/IGRlc2NyaXB0b3Iuek9yZGVyKSArIChwYXJlbnQ/LmNoYWluT3JkZXIgfHwgMClcbiAgICAgICAgaWYgZGVzY3JpcHRvci56b29tP1xuICAgICAgICAgICAgY29udHJvbC56b29tID0geDogZGVzY3JpcHRvci56b29tWzBdIC8gMTAwLCB5OiBkZXNjcmlwdG9yLnpvb21bMV0gLyAxMDBcbiAgICAgICAgI2NvbnRyb2wuZGF0YUZpZWxkcyA9IGRhdGFGaWVsZHNcbiAgICAgICAgI2NvbnRyb2wuY29udHJvbGxlcnMgPSBAY29udHJvbGxlcnNcbiAgICAgICAgI2NvbnRyb2wuY29udHJvbGxlciA9IGNvbnRyb2xsZXJcbiAgICAgICAgXG4gICAgICAgIGlmIGRlc2NyaXB0b3IudmlzaWJsZT9cbiAgICAgICAgICAgIGNvbnRyb2wudmlzaWJsZSA9IGRlc2NyaXB0b3IudmlzaWJsZVxuICAgICAgICBpZiBkZXNjcmlwdG9yLmNsaXBSZWN0XG4gICAgICAgICAgICBjb250cm9sLmNsaXBSZWN0ID0gbmV3IFJlY3QoY29udHJvbC5kc3RSZWN0LngsIGNvbnRyb2wuZHN0UmVjdC55LCBjb250cm9sLmRzdFJlY3Qud2lkdGgsIGNvbnRyb2wuZHN0UmVjdC5oZWlnaHQpXG5cbiAgICAgICAgaWYgZGVzY3JpcHRvci5zdHlsZXM/XG4gICAgICAgICAgICBAYWRkQ29udHJvbFN0eWxlcyhjb250cm9sLCBkZXNjcmlwdG9yLnN0eWxlcylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgZGVzY3JpcHRvci50ZW1wbGF0ZT9cbiAgICAgICAgICAgIGNvbnRyb2wuYmVoYXZpb3IubWFuYWdlbWVudE1vZGUgPSB1aS5MYXlvdXRNYW5hZ2VtZW50TW9kZS5mcm9tU3RyaW5nKGRlc2NyaXB0b3IubWFuYWdlbWVudE1vZGUpXG4gICAgICAgICAgICBkYXRhID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoY29udHJvbCwgY29udHJvbC5kYXRhRmllbGQpICNjb250cm9sLmRhdGFGaWVsZHNbY29udHJvbC5kYXRhRmllbGRdXG4gICAgICAgICAgICBpc051bWJlciA9IHR5cGVvZiBkYXRhID09IFwibnVtYmVyXCJcbiAgICAgICAgICAgIGlmIGRhdGE/XG4gICAgICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi4oZGF0YS5sZW5ndGggPyBkYXRhKV1cbiAgICAgICAgICAgICAgICAgICAgaWYgZGF0YVtpXT8gb3IgaXNOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBkZXNjcmlwdG9yLmRhdGFGaWx0ZXI/IGFuZCBub3QgaXNOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHVpLkNvbXBvbmVudF9IYW5kbGVyLmNoZWNrQ29uZGl0aW9uKGRhdGFbaV0sIGRlc2NyaXB0b3IuZGF0YUZpbHRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHZhbGlkIG9yIGlzTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBAY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKGRlc2NyaXB0b3IudGVtcGxhdGUsIGNvbnRyb2wsIGkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgI2NoaWxkLmRhdGFGaWVsZHMgPSBjb250cm9sLmRhdGFGaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBkYXRhW2ldPy5kc3RSZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmRzdFJlY3QgPSB1aS5VSUVsZW1lbnRSZWN0YW5nbGUuZnJvbVJlY3QoY2hpbGQsIGRhdGFbaV0uZHN0UmVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm90IGNoaWxkLmNsaXBSZWN0PykgYW5kIGNvbnRyb2wuY2xpcFJlY3Q/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsaXBSZWN0ID0gY29udHJvbC5jbGlwUmVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICNjaGlsZC5wYXJlbnQgPSBjb250cm9sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbC5hZGRPYmplY3QoY2hpbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuaW5kZXggPSBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQub3JkZXIgPSAoZGF0YS5sZW5ndGggPyBkYXRhKSAtIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sLmNvbnRyb2xzLnB1c2goY2hpbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbnRyb2xzIGFuZCBkZXNjcmlwdG9yLmNvbnRyb2xzLmV4ZWNcbiAgICAgICAgICAgIGNvbnRyb2xzID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoZGVzY3JpcHRvciwgZGVzY3JpcHRvci5jb250cm9scylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY29udHJvbHMgPSBkZXNjcmlwdG9yLmNvbnRyb2xzXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgY29udHJvbHM/XG4gICAgICAgICAgICBmb3IgaXRlbSwgaSBpbiBjb250cm9sc1xuICAgICAgICAgICAgICAgIGNoaWxkQ29udHJvbCA9IEBfY3JlYXRlRnJvbURlc2NyaXB0b3IoaXRlbSwgY29udHJvbCwgaSlcbiAgICAgICAgICAgICAgICBpZiAobm90IGNoaWxkQ29udHJvbC5jbGlwUmVjdD8pIGFuZCBjb250cm9sLmNsaXBSZWN0P1xuICAgICAgICAgICAgICAgICAgICBjaGlsZENvbnRyb2wuY2xpcFJlY3QgPSBjb250cm9sLmNsaXBSZWN0XG4gICAgICAgICAgICAgICAgY2hpbGRDb250cm9sLmluZGV4ID0gaVxuICAgICAgICAgICAgICAgIGNoaWxkQ29udHJvbC5vcmlnaW4ueCA9IGNvbnRyb2wub3JpZ2luLnggKyBjb250cm9sLmRzdFJlY3QueFxuICAgICAgICAgICAgICAgIGNoaWxkQ29udHJvbC5vcmlnaW4ueSA9IGNvbnRyb2wub3JpZ2luLnkgKyBjb250cm9sLmRzdFJlY3QueVxuICAgICAgICAgICAgICAgICNjaGlsZENvbnRyb2wucGFyZW50ID0gY29udHJvbFxuICAgICAgICAgICAgICAgIGNvbnRyb2wuYWRkT2JqZWN0KGNoaWxkQ29udHJvbClcbiAgICAgICAgICAgICAgICBjb250cm9sLmNvbnRyb2xzLnB1c2goY2hpbGRDb250cm9sKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBjb250cm9sLnN0eWxlcyBhbmQgY29udHJvbC5wYXJlbnRzQnlTdHlsZVxuICAgICAgICAgICAgI2ZvciBzdHlsZSBpbiBjb250cm9sLnN0eWxlc1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJlbnQgPSBjb250cm9sLnBhcmVudFxuICAgICAgICAgICAgd2hpbGUgcGFyZW50XG4gICAgICAgICAgICAgICAgaWYgcGFyZW50LnN0eWxlc1xuICAgICAgICAgICAgICAgICAgICBmb3Igc3R5bGUgaW4gcGFyZW50LnN0eWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgIWNvbnRyb2wucGFyZW50c0J5U3R5bGVbc3R5bGUuaWRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbC5wYXJlbnRzQnlTdHlsZVtzdHlsZS5pZF0gPSBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbC5wYXJlbnRzQnlTdHlsZVtzdHlsZS5pZF0ucHVzaChwYXJlbnQpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgI3doaWxlIHBhcmVudFxuICAgICAgICAgICAgICAgICAgICAjaWYgcGFyZW50LmNvbnRyb2xzQnlTdHlsZVxuICAgICAgICAgICAgICAgICAgICAjICAgIGlmKCFwYXJlbnQuY29udHJvbHNCeVN0eWxlW3N0eWxlLmlkXSlcbiAgICAgICAgICAgICAgICAgICAgIyAgICAgICAgcGFyZW50LmNvbnRyb2xzQnlTdHlsZVtzdHlsZS5pZF0gPSBbXVxuICAgICAgICAgICAgICAgICAgICAjICAgIHBhcmVudC5jb250cm9sc0J5U3R5bGVbc3R5bGUuaWRdLnB1c2goY29udHJvbClcbiAgICAgICAgICAgICAgICAgICMgIGlmIGNvbnRyb2wucGFyZW50c0J5U3R5bGVcbiAgICAgICAgICAgICAgICAgICMgICAgICBpZiAhY29udHJvbC5wYXJlbnRzQnlTdHlsZVtzdHlsZS5pZF1cbiAgICAgICAgICAgICAgICAgICMgICAgICAgICAgY29udHJvbC5wYXJlbnRzQnlTdHlsZVtzdHlsZS5pZF0gPSBbXVxuICAgICAgICAgICAgICAgICAgIyAgICAgIGNvbnRyb2wucGFyZW50c0J5U3R5bGVbc3R5bGUuaWRdLnB1c2gocGFyZW50KVxuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmFuaW1hdGlvbnM/XG4gICAgICAgICAgICBjb250cm9sLmFuaW1hdGlvbnMgPSBPYmplY3QuZGVlcENvcHkoZGVzY3JpcHRvci5hbmltYXRpb25zKVxuICAgICAgICAgICAgY29udHJvbC5hbmltYXRpb25FeGVjdXRvciA9IG5ldyB1aS5Db21wb25lbnRfQW5pbWF0aW9uRXhlY3V0b3IoKVxuICAgICAgICAgICAgY29udHJvbC5hZGRDb21wb25lbnQoY29udHJvbC5hbmltYXRpb25FeGVjdXRvcilcbiAgICAgICAgICAgIGNvbnRyb2wuYWRkQ29tcG9uZW50KG5ldyB1aS5Db21wb25lbnRfQW5pbWF0aW9uSGFuZGxlcigpKVxuICAgICAgICAgXG4gICAgICAgIGNvbnRyb2wudWkudXBkYXRlU3R5bGUoKVxuICAgICAgICBjb250cm9sLnNldHVwKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9sXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYW4gVUkgb2JqZWN0IGZyb20gYSBzcGVjaWZpZWQgVUkgZGVzY3JpcHRvci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIF9jcmVhdGVGcm9tRGVzY3JpcHRvclxuICAgICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3IgLSBUaGUgVUkgb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9VSUVsZW1lbnR9IHBhcmVudCAtIFRoZSBVSSBwYXJlbnQgb2JqZWN0LiAoQSBsYXlvdXQgZm9yIGV4YW1wbGUpLlxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X1VJRWxlbWVudH0gVGhlIGNyZWF0ZWQgVUkgb2JqZWN0LlxuICAgICogQHByb3RlY3RlZCBcbiAgICAjIyMgICBcbiAgICBfY3JlYXRlRnJvbURlc2NyaXB0b3I6IChkZXNjcmlwdG9yLCBwYXJlbnQsIGluZGV4KSAtPiAgICAgXG4gICAgICAgIGNvbnRyb2wgPSBAY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKGRlc2NyaXB0b3IsIHBhcmVudCwgaW5kZXgpXG4gICAgICAgIFxuICAgICAgICBpZiBkZXNjcmlwdG9yLmNvbnRyb2xsZXI/XG4gICAgICAgICAgICBjb250cm9sbGVyID0gQGNvbnRyb2xsZXJzW2Rlc2NyaXB0b3IuY29udHJvbGxlcl1cbiAgICAgICAgICAgIGNvbnRyb2wuY29udHJvbGxlciA9IGNvbnRyb2xsZXJcbiAgICAgICAgICAgIGNvbnRyb2wuYWRkQ29tcG9uZW50KGNvbnRyb2xsZXIpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9sXG4gICAgICAgIFxuICAgIGNyZWF0ZUxheW91dEZyb21EZXNjcmlwdG9yOiAoZGVzY3JpcHRvciwgcGFyZW50LCBpbmRleCkgLT5cbiAgICAgICAgQF9jcmVhdGVGcm9tRGVzY3JpcHRvcihkZXNjcmlwdG9yLCBwYXJlbnQsIGluZGV4KVxuICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgXG5HcmFwaGljcy53aWR0aCA9ICRQQVJBTVMucmVzb2x1dGlvbi53aWR0aFxuR3JhcGhpY3MuaGVpZ2h0ID0gJFBBUkFNUy5yZXNvbHV0aW9uLmhlaWdodFxudWkuVWlGYWN0b3J5ID0gbmV3IFVJTWFuYWdlcigpXG51aS5VSU1hbmFnZXIgPSB1aS5VaUZhY3RvcnkiXX0=
//# sourceURL=UIManager_99.js