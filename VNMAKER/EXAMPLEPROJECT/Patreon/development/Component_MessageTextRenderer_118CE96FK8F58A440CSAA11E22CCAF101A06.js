var Component_MessageTextRenderer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_MessageTextRenderer = (function(superClass) {
  extend(Component_MessageTextRenderer, superClass);

  Component_MessageTextRenderer.objectCodecBlackList = ["onLinkClick", "onBatchDisappear"];


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_MessageTextRenderer.prototype.onDataBundleRestore = function(data, context) {
    var bitmap, customObject, j, l, len, len1, len2, line, m, message, n, ref, ref1, ref2;
    this.setupEventHandlers();
    l = 0;
    ref = this.object.messages;
    for (j = 0, len = ref.length; j < len; j++) {
      message = ref[j];
      if (this.object.settings.useCharacterColor) {
        this.object.font.color = new gs.Color(message.character.textColor);
      }
      this.lines = this.calculateLines(lcsm(message.text), true, 0);
      ref1 = this.lines;
      for (m = 0, len1 = ref1.length; m < len1; m++) {
        line = ref1[m];
        bitmap = this.createBitmap(line);
        if (line === this.line) {
          this.drawLineContent(line, bitmap, this.charIndex + 1);
        } else {
          this.drawLineContent(line, bitmap, -1);
        }
        this.allSprites[l].bitmap = bitmap;
        l++;
      }
    }
    ref2 = this.customObjects;
    for (n = 0, len2 = ref2.length; n < len2; n++) {
      customObject = ref2[n];
      SceneManager.scene.addObject(customObject);
    }
    return null;
  };


  /**
  *  A text-renderer component to render an animated and interactive message text using
  *  dimensions of the game object's destination-rectangle. The message is displayed
  *  using a sprite for each line instead of drawing to the game object's bitmap object.
  *
  *  @module gs
  *  @class Component_MessageTextRenderer
  *  @extends gs.Component_TextRenderer
  *  @memberof gs
  *  @constructor
   */

  function Component_MessageTextRenderer() {
    Component_MessageTextRenderer.__super__.constructor.apply(this, arguments);

    /**
    * An array containing all sprites of the current message.
    * @property sprites
    * @type gs.Sprite[]
    * @protected
     */
    this.sprites = [];

    /**
    * An array containing all sprites of all messages. In NVL mode
    * a page can contain multiple messages.
    * @property allSprites
    * @type gs.Sprite[]
    * @protected
     */
    this.allSprites = [];

    /**
    * An array containing all line-objects of the current message.
    * @property lines
    * @type gs.TextRendererLine[]
    * @readOnly
     */
    this.lines = null;

    /**
    * The line currently rendered.
    * @property line
    * @type number
    * @readOnly
     */
    this.line = 0;

    /**
    * The left and right padding per line.
    * @property padding
    * @type number
     */
    this.padding = 6;

    /**
    * The minimum height of the line currently rendered. If 0, the measured
    * height of the line will be used.
    * @property minLineHeight
    * @type number
     */
    this.minLineHeight = 0;

    /**
    * The spacing between text lines in pixels.
    * @property lineSpacing
    * @type number
     */
    this.lineSpacing = 2;

    /**
    * The line currently rendered.
    * @property currentLine
    * @type number
    * @protected
     */
    this.currentLine = 0;

    /**
    * The height of the line currently rendered.
    * @property currentLineHeight
    * @type number
    * @protected
     */
    this.currentLineHeight = 0;

    /**
    * Index of the current character to draw.
    * @property charIndex
    * @type number
    * @readOnly
     */
    this.charIndex = 0;

    /**
    * Position of the message caret. The caret is like an invisible
    * cursor pointing to the x/y coordinates of the last rendered character of
    * the message. That position can be used to display a waiting- or processing-animation for example.
    * @property caretPosition
    * @type gs.Point
    * @readOnly
     */
    this.caretPosition = new gs.Point();

    /**
    * Indicates that the a message is currently in progress.
    * @property isRunning
    * @type boolean
    * @readOnly
     */
    this.isRunning = false;

    /**
    * The current x-coordinate of the caret/cursor.
    * @property currentX
    * @type number
    * @readOnly
     */
    this.currentX = 0;

    /**
    * The current y-coordinate of the caret/cursor.
    * @property currentY
    * @type number
    * @readOnly
     */
    this.currentY = 0;

    /**
    * The current sprites used to display the current text-line/part.
    * @property currentSprite
    * @type gs.Sprite
    * @readOnly
     */
    this.currentSprite = null;

    /**
    * Indicates if the message-renderer is currently waiting like for a user-action.
    * @property isWaiting
    * @type boolean
    * @readOnly
     */
    this.isWaiting = false;

    /**
    * Indicates if the message-renderer is currently waiting for a key-press or mouse/touch action.
    * @property waitForKey
    * @type boolean
    * @readOnly
     */
    this.waitForKey = false;

    /**
    * Number of frames the message-renderer should wait before continue.
    * @property waitCounter
    * @type number
     */
    this.waitCounter = 0;

    /**
    * Speed of the message-drawing. The smaller the value, the faster the message is displayed.
    * @property speed
    * @type number
     */
    this.speed = 1;

    /**
    * Indicates if the message should be rendered immedialtely without any animation or delay.
    * @property drawImmediately
    * @type boolean
     */
    this.drawImmediately = false;

    /**
    * Indicates if the message should wait for a user-action or a certain amount of time
    * before finishing.
    * @property waitAtEnd
    * @type boolean
     */
    this.waitAtEnd = true;

    /**
    * The number of frames to wait before finishing a message.
    * before finishing.
    * @property waitAtEndTime
    * @type number
     */
    this.waitAtEndTime = 0;

    /**
    * Indicates if auto word-wrap should be used. Default is <b>true</b>
    * @property wordWrap
    * @type boolean
     */
    this.wordWrap = true;

    /**
    * Custom game objects which are alive until the current message is erased. Can be used to display
    * animated icons, etc.
    * @property customObjects
    * @type gs.Object_Base[]
     */
    this.customObjects = [];

    /**
    * A hashtable/dictionary object to store custom-data useful like for token-processing. The data must be
    * serializable.
    * @property customObjects
    * @type Object
     */
    this.customData = {};

    /**
    * A callback function called if the player clicks on a non-stylable link (LK text-code) to trigger
    * the specified common event.
    * @property onLinkClick
    * @type Function
     */
    this.onLinkClick = function(e) {
      return SceneManager.scene.interpreter.callCommonEvent(e.data.linkData.commonEventId, null);
    };

    /**
    * A callback function called if a batched messsage has been faded out. It triggers the execution of
    * the next message.
    * @property onBatchDisappear
    * @type Function
     */
    this.onBatchDisappear = (function(_this) {
      return function(e) {
        _this.drawImmediately = false;
        _this.isWaiting = false;
        _this.object.opacity = 255;
        return _this.executeBatch();
      };
    })(this);
  }


  /**
  * Serializes the message text-renderer into a data-bundle.
  * @method toDataBundle
  * @return {Object} A data-bundle.
   */

  Component_MessageTextRenderer.prototype.toDataBundle = function() {
    var bundle, ignore, k;
    ignore = ["object", "font", "sprites", "allSprites", "currentSprite", "currentX"];
    bundle = {
      currentSpriteIndex: this.sprites.indexOf(this.currentSprite)
    };
    for (k in this) {
      if (ignore.indexOf(k) === -1) {
        bundle[k] = this[k];
      }
    }
    return bundle;
  };


  /**
  * Disposes the message text-renderer and all sprites used to display
  * the message.
  * @method dispose
   */

  Component_MessageTextRenderer.prototype.dispose = function() {
    var j, len, ref, ref1, results, sprite;
    Component_MessageTextRenderer.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    ref = this.allSprites;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      sprite = ref[j];
      if ((ref1 = sprite.bitmap) != null) {
        ref1.dispose();
      }
      results.push(sprite.dispose());
    }
    return results;
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_MessageTextRenderer.prototype.setupEventHandlers = function() {
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    gs.GlobalEventManager.on("mouseUp", ((function(_this) {
      return function(e) {
        if (GameManager.settings.autoMessage.enabled && !GameManager.settings.autoMessage.stopOnAction) {
          return;
        }
        if (_this.object.dstRect.contains(Input.Mouse.x - _this.object.origin.x, Input.Mouse.y - _this.object.origin.y)) {
          if (_this.isWaiting && !(_this.waitCounter > 0 || _this.waitForKey)) {
            e.breakChain = true;
            _this["continue"]();
          } else {
            _this.drawImmediately = !_this.waitForKey;
            _this.waitCounter = 0;
            _this.waitForKey = false;
            _this.isWaiting = false;
          }
          if (_this.waitForKey) {
            if (Input.Mouse.buttons[Input.Mouse.LEFT] === 2) {
              e.breakChain = true;
              Input.clear();
              _this.waitForKey = false;
              return _this.isWaiting = false;
            }
          }
        }
      };
    })(this)), null, this.object);
    return gs.GlobalEventManager.on("keyUp", ((function(_this) {
      return function(e) {
        if (Input.keys[Input.C] && (!_this.isWaiting || (_this.waitCounter > 0 || _this.waitForKey))) {
          _this.drawImmediately = !_this.waitForKey;
          _this.waitCounter = 0;
          _this.waitForKey = false;
          _this.isWaiting = false;
        }
        if (_this.isWaiting && !_this.waitForKey && !_this.waitCounter && Input.keys[Input.C]) {
          _this["continue"]();
        }
        if (_this.waitForKey) {
          if (Input.keys[Input.C]) {
            Input.clear();
            _this.waitForKey = false;
            return _this.isWaiting = false;
          }
        }
      };
    })(this)), null, this.object);
  };


  /**
  * Sets up the renderer. Registers necessary event handlers.
  * @method setup
   */

  Component_MessageTextRenderer.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Restores the message text-renderer's state from a data-bundle.
  * @method restore
  * @param {Object} bundle - A data-bundle containing message text-renderer state.
   */

  Component_MessageTextRenderer.prototype.restore = function(bundle) {
    var k;
    for (k in bundle) {
      if (k === "currentSpriteIndex") {
        this.currentSprite = this.sprites[bundle.currentSpriteIndex];
      } else {
        this[k] = bundle[k];
      }
    }
    if (this.sprites.length > 0) {
      this.currentY = this.sprites.last().y - this.object.origin.y - this.object.dstRect.y;
      this.line = this.maxLines;
      this.isWaiting = this.isWaiting || this.isRunning;
    }
    return null;
  };


  /**
  * Continues message-processing if currently waiting.
  * @method continue
   */

  Component_MessageTextRenderer.prototype["continue"] = function() {
    var duration, fading, ref, ref1;
    Input.clear();
    this.isWaiting = false;
    if (this.line >= this.lines.length) {
      this.isRunning = false;
      return (ref = this.object.events) != null ? ref.emit("messageFinish", this) : void 0;
    } else {
      if ((ref1 = this.object.events) != null) {
        ref1.emit("messageBatch", this);
      }
      fading = GameManager.tempSettings.messageFading;
      duration = GameManager.tempSettings.skip ? 0 : fading.duration;
      return this.object.animator.disappear(fading.animation, fading.easing, duration, gs.CallBack("onBatchDisappear", this));
    }
  };


  /**
  * Updates the text-renderer.
  * @method update
   */

  Component_MessageTextRenderer.prototype.update = function() {
    var j, len, len1, m, object, ref, ref1, ref2, sprite;
    ref = this.allSprites;
    for (j = 0, len = ref.length; j < len; j++) {
      sprite = ref[j];
      sprite.opacity = this.object.opacity;
      sprite.visible = this.object.visible;
      sprite.ox = -this.object.offset.x;
      sprite.oy = -this.object.offset.y;
      sprite.mask.value = this.object.mask.value;
      sprite.mask.vague = this.object.mask.vague;
      sprite.mask.source = this.object.mask.source;
      sprite.mask.type = this.object.mask.type;
    }
    ref1 = this.customObjects;
    for (m = 0, len1 = ref1.length; m < len1; m++) {
      object = ref1[m];
      object.opacity = this.object.opacity;
      object.visible = this.object.visible;
    }
    if (!this.isRunning && this.waitCounter > 0) {
      this.waitCounter--;
      if (this.waitCounter === 0) {
        this["continue"]();
      }
      return;
    }
    if (this.object.visible && ((ref2 = this.lines) != null ? ref2.length : void 0) > 0) {
      this.updateLineWriting();
      return this.updateCaretPosition();
    }
  };


  /**
  * Indicates if its a batched messages.
  *
  * @method isBatched
  * @return If <b>true</b> it is a batched message. Otherwise <b>false</b>.
   */

  Component_MessageTextRenderer.prototype.isBatched = function() {
    return this.lines.length > this.maxLines;
  };


  /**
  * Indicates if the batch is still in progress and not done.
  *
  * @method isBatchInProgress
  * @return If <b>true</b> the batched message is still not done. Otherwise <b>false</b>
   */

  Component_MessageTextRenderer.prototype.isBatchInProgress = function() {
    return this.lines.length - this.line > this.maxLines;
  };


  /**
  * Starts displaying the next page of text if a message is too long to fit
  * into one message box.
  *
  * @method executeBatch
   */

  Component_MessageTextRenderer.prototype.executeBatch = function() {
    this.clearAllSprites();
    this.lines = this.lines.slice(this.line);
    this.line = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.currentLineHeight = 0;
    this.tokenIndex = 0;
    this.charIndex = 0;
    this.token = this.lines[this.line].content[this.tokenIndex] || new gs.RendererToken(null, "");
    this.maxLines = this.calculateMaxLines(this.lines);
    this.lineAnimationCount = this.speed;
    this.sprites = this.createSprites(this.lines);
    this.allSprites = this.allSprites.concat(this.sprites);
    this.currentSprite = this.sprites[this.line];
    this.currentSprite.x = this.currentX + this.object.origin.x + this.object.dstRect.x;
    return this.drawNext();
  };


  /**
  * Calculates the duration(in frames) the message-renderer needs to display
  * the message.
  *
  * @method calculateDuration
  * @return {number} The duration in frames.
   */

  Component_MessageTextRenderer.prototype.calculateDuration = function() {
    var duration, j, len, len1, line, m, ref, ref1, token;
    duration = 0;
    if (this.lines != null) {
      ref = this.lines;
      for (j = 0, len = ref.length; j < len; j++) {
        line = ref[j];
        ref1 = line.content;
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          token = ref1[m];
          if (token != null) {
            duration += this.calculateDurationForToken(token);
          }
        }
      }
    }
    return duration;
  };


  /**
  * Calculates the duration(in frames) the message-renderer needs to display
  * the specified line.
  *
  * @method calculateDurationForLine
  * @param {gs.RendererTextLine} line The line to calculate the duration for.
  * @return {number} The duration in frames.
   */

  Component_MessageTextRenderer.prototype.calculateDurationForLine = function(line) {
    var duration, j, len, ref, token;
    duration = 0;
    if (line) {
      ref = line.content;
      for (j = 0, len = ref.length; j < len; j++) {
        token = ref[j];
        if (token != null) {
          duration += this.calculateDurationForToken(token);
        }
      }
    }
    return duration;
  };


  /**
  * Calculates the duration(in frames) the message-renderer needs to process
  * the specified token.
  *
  * @method calculateDurationForToken
  * @param {string|Object} token - The token.
  * @return {number} The duration in frames.
   */

  Component_MessageTextRenderer.prototype.calculateDurationForToken = function(token) {
    var duration;
    duration = 0;
    if (token.code != null) {
      switch (token.code) {
        case "W":
          if (token.value !== "A") {
            duration = token.value / 1000 * Graphics.frameRate;
          }
      }
    } else {
      duration = token.value.length * this.speed;
    }
    return duration;
  };


  /**
  * Calculates the maximum of lines which can be displayed in one message.
  *
  * @method calculateMaxLines
  * @param {Array} lines - An array of line-objects.
  * @return {number} The number of displayable lines.
   */

  Component_MessageTextRenderer.prototype.calculateMaxLines = function(lines) {
    var height, j, len, line, result;
    height = 0;
    result = 0;
    for (j = 0, len = lines.length; j < len; j++) {
      line = lines[j];
      height += line.height + this.lineSpacing;
      if (this.currentY + height > this.object.dstRect.height) {
        break;
      }
      result++;
    }
    return Math.min(lines.length, result || 1);
  };


  /**
  * Displays the character or processes the next control-token.
  *
  * @method drawNext
   */

  Component_MessageTextRenderer.prototype.drawNext = function() {
    var lineSpacing, s, size, token;
    token = this.processToken();
    if ((token != null ? token.value.length : void 0) > 0) {
      this.char = this.token.value.charAt(this.charIndex);
      size = this.font.measureTextPlain(this.char);
      s = Graphics.scale;
      lineSpacing = this.lineSpacing;
      if (this.currentLine !== this.line) {
        this.currentLine = this.line;
        this.currentLineHeight = 0;
      }
      this.currentSprite.y = this.object.origin.y + this.object.dstRect.y + this.currentY;
      this.currentSprite.visible = true;
      this.drawLineContent(this.lines[this.line], this.currentSprite.bitmap, this.charIndex + 1);
      this.currentSprite.srcRect.width = this.currentSprite.bitmap.width;
      this.currentLineHeight = this.lines[this.line].height;
      return this.currentX = Math.min(this.lines[this.line].width, this.currentX + size.width);
    }
  };


  /**
  * Processes the next character/token of the message.
  * @method nextChar
  * @private
   */

  Component_MessageTextRenderer.prototype.nextChar = function() {
    var base, base1, results;
    results = [];
    while (true) {
      this.charIndex++;
      this.lineAnimationCount = this.speed;
      if ((this.token.code != null) || this.charIndex >= this.token.value.length) {
        if (typeof (base = this.token).onEnd === "function") {
          base.onEnd();
        }
        this.tokenIndex++;
        if (this.tokenIndex >= this.lines[this.line].content.length) {
          this.tokenIndex = 0;
          this.line++;
          this.currentSprite.srcRect.width = this.currentSprite.bitmap.width;
          this.currentSprite = this.sprites[this.line];
          if (this.currentSprite != null) {
            this.currentSprite.x = this.object.origin.x + this.object.dstRect.x;
          }
          if (this.line < this.maxLines) {
            this.currentY += (this.currentLineHeight || this.font.lineHeight) + this.lineSpacing * Graphics.scale;
            this.charIndex = 0;
            this.currentX = 0;
            this.token = this.lines[this.line].content[this.tokenIndex] || new gs.RendererToken(null, "");
          }
        } else {
          this.charIndex = 0;
          this.token = this.lines[this.line].content[this.tokenIndex] || new gs.RendererToken(null, "");
        }
        if (typeof (base1 = this.token).onStart === "function") {
          base1.onStart();
        }
      }
      if (!this.token || this.token.value !== "\n" || !this.lines[this.line]) {
        break;
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Finishes the message. Depending on the message configuration, the
  * message text-renderer will now wait for a user-action or a certain amount
  * of time.
  *
  * @method finish
   */

  Component_MessageTextRenderer.prototype.finish = function() {
    var ref, ref1, ref2;
    if (this.waitAtEnd) {
      this.isWaiting = true;
      return (ref = this.object.events) != null ? ref.emit("messageWaiting", this) : void 0;
    } else if (this.waitAtEndTime > 0) {
      this.waitCounter = this.waitAtEndTime;
      this.isWaiting = false;
      return (ref1 = this.object.events) != null ? ref1.emit("messageWaiting", this) : void 0;
    } else {
      if ((ref2 = this.object.events) != null) {
        ref2.emit("messageWaiting", this);
      }
      return this["continue"]();
    }
  };


  /**
  * Returns the position of the caret in pixels. The caret is like an invisible
  * cursor pointing to the x/y coordinates of the last rendered character of
  * the message. That position can be used to display a waiting- or processing-animation for example.
  *
  * @method updateCaretPosition
   */

  Component_MessageTextRenderer.prototype.updateCaretPosition = function() {
    this.caretPosition.x = this.currentX + this.padding;
    return this.caretPosition.y = this.currentY + this.currentLineHeight / 2;
  };


  /**
  * Updates the line writing.
  *
  * @method updateLineWriting
  * @private
   */

  Component_MessageTextRenderer.prototype.updateLineWriting = function() {
    if (this.isRunning && !this.isWaiting && !this.waitForKey && this.waitCounter <= 0) {
      if (this.lineAnimationCount <= 0) {
        while (true) {
          if (this.line < this.maxLines) {
            this.nextChar();
          }
          if (this.line >= this.maxLines) {
            this.finish();
          } else {
            this.drawNext();
          }
          if (!((this.token.code || this.lineAnimationCount <= 0 || this.drawImmediately) && this.waitForKey && this.waitCounter > 0 && this.isRunning && this.line < this.maxLines)) {
            break;
          }
        }
      }
      this.lineAnimationCount--;
    }
    if (this.waitForKey) {
      this.isWaiting = true;
    }
    if (this.waitCounter > 0) {
      if (GameManager.tempSettings.skip) {
        this.waitCounter = 1;
      }
      this.isWaiting = true;
      this.waitCounter--;
      if (this.waitCounter <= 0) {
        this.isWaiting = false;
        if (this.line >= this.maxLines) {
          return this["continue"]();
        }
      }
    }
  };


  /**
  * Creates a token-object for a specified text-code.
  * 
  * @method createToken
  * @param {string} code - The code/type of the text-code.
  * @param {string} value - The value of the text-code.
  * @return {Object} The token-object.
   */

  Component_MessageTextRenderer.prototype.createToken = function(code, value) {
    var data, i, j, ref, tokenObject;
    tokenObject = null;
    switch (code) {
      case "CE":
        data = value.split("/");
        value = data.shift();
        value = isNaN(value) ? data[0] : parseInt(value);
        for (i = j = 0, ref = data; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          if (data[i].startsWith('"') && data[i].endsWith('"')) {
            data[i] = data[i].substring(1, data[i].length - 1);
          } else {
            data[i] = isNaN(data[i]) ? data[i] : parseFloat(data[i]);
          }
        }
        tokenObject = {
          code: code,
          value: value,
          values: data
        };
        break;
      default:
        tokenObject = Component_MessageTextRenderer.__super__.createToken.call(this, code, value);
    }
    return tokenObject;
  };


  /**
  * <p>Measures a control-token. If a token produces a visual result like displaying an icon then it must return the size taken by
  * the visual result. If the token has no visual result, <b>null</b> must be returned. This method is called for every token when the message is initialized.</p> 
  *
  * <p>This method is not called while the message is running. For that case, see <i>processControlToken</i> method which is called
  * for every token while the message is running.</p>
  *
  * @param {Object} token - A control-token.
  * @return {gs.Size} The size of the area taken by the visual result of the token or <b>null</b> if the token has no visual result.
  * @method analyzeControlToken
  * @protected
   */

  Component_MessageTextRenderer.prototype.measureControlToken = function(token) {
    return Component_MessageTextRenderer.__super__.measureControlToken.call(this, token);
  };


  /**
  * <p>Draws the visual result of a token, like an icon for example, to the specified bitmap. This method is called for every token when the message is initialized and the sprites for each
  * text-line are created.</p> 
  *
  * <p>This method is not called while the message is running. For that case, see <i>processControlToken</i> method which is called
  * for every token while the message is running.</p>
  *
  * @param {Object} token - A control-token.
  * @param {gs.Bitmap} bitmap - The bitmap used for the current text-line. Can be used to draw something on it like an icon, etc.
  * @param {number} offset - An x-offset for the draw-routine.
  * @param {number} length - Determines how many characters of the token should be drawn. Can be ignored for tokens
  * not drawing any characters.
  * @method drawControlToken
  * @protected
   */

  Component_MessageTextRenderer.prototype.drawControlToken = function(token, bitmap, offset, length) {
    switch (token.code) {
      case "RT":
        return Component_MessageTextRenderer.__super__.drawControlToken.call(this, token, bitmap, offset, length);
    }
  };


  /**
  * Processes a control-token. A control-token is a token which influences
  * the text-rendering like changing the fonts color, size or style. Changes 
  * will be automatically applied to the game object's font.
  *
  * For message text-renderer, a few additional control-tokens like
  * speed-change, waiting, etc. needs to be processed here.
  *
  * This method is called for each token while the message is initialized and
  * also while the message is running. See <i>formattingOnly</i> parameter.
  *
  * @param {Object} token - A control-token.
  * @param {boolean} formattingOnly - If <b>true</b> the message is initializing right now and only 
  * format-tokens should be processed which is necessary for the message to calculated sizes correctly.
  * @return {Object} A new token which is processed next or <b>null</b>.
  * @method processControlToken
  * @protected
   */

  Component_MessageTextRenderer.prototype.processControlToken = function(token, formattingOnly) {
    var animation, bitmap, character, duration, easing, expression, line, linkStart, object, params, ref, result, sound, textTokens, values;
    if (formattingOnly) {
      return Component_MessageTextRenderer.__super__.processControlToken.call(this, token);
    }
    result = null;
    switch (token.code) {
      case "CE":
        params = {
          "values": token.values
        };
        if ((ref = this.object.events) != null) {
          ref.emit("callCommonEvent", this.object, {
            commonEventId: Math.max(0, token.value - 1),
            params: params,
            finish: false,
            waiting: true
          });
        }
        break;
      case "X":
        if (typeof token.value === "function") {
          token.value(this.object);
        }
        break;
      case "A":
        animation = RecordManager.animations[Math.max(token.value - 1, 0)];
        if ((animation != null ? animation.graphic.name : void 0) != null) {
          bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + animation.graphic.name);
          object = new gs.Object_Animation(animation);
          this.addCustomObject(object);
          this.currentX += Math.round(bitmap.width / animation.framesX);
          this.currentSprite.srcRect.width += Math.round(bitmap.width / animation.framesX);
        }
        break;
      case "RT":
        if (token.rtSize.width > token.rbSize.width) {
          this.currentX += token.rtSize.width;
          this.font.set(this.getRubyTextFont(token));
        } else {
          this.currentX += token.rbSize.width;
        }
        break;
      case "LK":
        if (token.value === 'E') {
          object = new ui.Object_Hotspot();
          object.enabled = true;
          object.setup();
          this.addCustomObject(object);
          object.dstRect.x = this.object.dstRect.x + this.object.origin.x + this.customData.linkData.cx;
          object.dstRect.y = this.object.dstRect.y + this.object.origin.y + this.customData.linkData.cy;
          object.dstRect.width = this.currentX - this.customData.linkData.cx;
          object.dstRect.height = this.currentLineHeight;
          object.events.on("click", gs.CallBack("onLinkClick", this), {
            linkData: this.customData.linkData
          }, this);
        } else {
          this.customData.linkData = {
            cx: this.currentX,
            cy: this.currentY,
            commonEventId: token.value - 1,
            tokenIndex: this.tokenIndex
          };
        }
        break;
      case "SLK":
        if (token.value === 'E') {
          this.currentSprite.bitmap.clearRect(this.customData.linkData.cx, this.customData.linkData.cy, this.currentX - this.customData.linkData.cx + this.object.font.borderSize * 2, this.currentLineHeight);
          line = this.lines[this.line].content;
          linkStart = this.findToken(this.tokenIndex - 1, "SLK", -1, line);
          textTokens = this.findTokensBetween(this.customData.linkData.tokenIndex, this.tokenIndex, null, line);
          object = new ui.Object_Text();
          object.text = textTokens.join("");
          object.sizeToFit = true;
          object.formatting = true;
          object.wordWrap = false;
          object.ui = new ui.Component_UIBehavior();
          object.enabled = true;
          object.addComponent(object.ui);
          object.addComponent(new gs.Component_HotspotBehavior());
          if (this.customData.linkData.styleIndex === -1) {
            ui.UIManager.addControlStyles(object, ["hyperlink"]);
          } else {
            ui.UIManager.addControlStyles(object, ["hyperlink-" + this.customData.linkData.styleIndex]);
          }
          object.setup();
          this.addCustomObject(object);
          object.dstRect.x = this.object.dstRect.x + this.object.origin.x + this.customData.linkData.cx;
          object.dstRect.y = this.object.dstRect.y + this.object.origin.y + this.customData.linkData.cy;
          object.events.on("click", gs.CallBack("onLinkClick", this), {
            linkData: this.customData.linkData
          }, this);
        } else {
          if (isNaN(token.value)) {
            values = token.value.split(",");
            this.customData.linkData = {
              cx: this.currentX,
              cy: this.currentY,
              commonEventId: parseInt(values[0]) - 1,
              styleIndex: parseInt(values[1]),
              tokenIndex: this.tokenIndex
            };
          } else {
            this.customData.linkData = {
              cx: this.currentX,
              cy: this.currentY,
              commonEventId: token.value - 1,
              tokenIndex: this.tokenIndex,
              styleIndex: -1
            };
          }
        }
        break;
      case "E":
        expression = RecordManager.characterExpressions[Math.max(token.value - 1, 0)];
        character = SceneManager.scene.currentCharacter;
        if ((expression != null) && ((character != null ? character.index : void 0) != null)) {
          duration = GameManager.defaults.character.expressionDuration;
          easing = gs.Easings.fromObject(GameManager.defaults.character.changeEasing);
          animation = GameManager.defaults.character.changeAnimation;
          object = SceneManager.scene.characters.first(function(c) {
            return c.rid === character.index;
          });
          if (object != null) {
            object.behavior.changeExpression(expression, animation, easing, duration);
          }
        }
        break;
      case "SP":
        sound = RecordManager.system.sounds[token.value - 1];
        AudioManager.playSound(sound);
        break;
      case "S":
        GameManager.settings.messageSpeed = token.value;
        break;
      case "W":
        this.drawImmediately = false;
        if (!GameManager.tempSettings.skip) {
          if (token.value === "A") {
            this.waitForKey = true;
          } else {
            this.waitCounter = Math.round(token.value / 1000 * Graphics.frameRate);
          }
        }
        break;
      case "WE":
        this.waitAtEnd = token.value === "Y";
        break;
      case "DI":
        this.drawImmediately = token.value === 1;
        break;
      default:
        result = Component_MessageTextRenderer.__super__.processControlToken.call(this, token);
    }
    return result;
  };


  /**
  * Clears/Resets the text-renderer.
  *
  * @method clear
   */

  Component_MessageTextRenderer.prototype.clear = function() {
    var j, len, ref, ref1, ref2, sprite;
    this.charIndex = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.line = 0;
    this.lines = [];
    this.clearCustomObjects();
    if ((ref = this.object.bitmap) != null) {
      ref.clear();
    }
    ref1 = this.allSprites;
    for (j = 0, len = ref1.length; j < len; j++) {
      sprite = ref1[j];
      sprite.dispose();
      if ((ref2 = sprite.bitmap) != null) {
        ref2.dispose();
      }
    }
    this.allSprites = [];
    return null;
  };


  /**
  * Clears/Disposes all sprites used to display the text-lines/parts.
  *
  * @method clearAllSprites
   */

  Component_MessageTextRenderer.prototype.clearAllSprites = function() {
    var j, len, ref, ref1, sprite;
    ref = this.allSprites;
    for (j = 0, len = ref.length; j < len; j++) {
      sprite = ref[j];
      sprite.dispose();
      if ((ref1 = sprite.bitmap) != null) {
        ref1.dispose();
      }
    }
    return null;
  };


  /**
  * Clears/Disposes the sprites used to display the text-lines/parts of the current/last message.
  *
  * @method clearSprites
   */

  Component_MessageTextRenderer.prototype.clearSprites = function() {
    var j, len, ref, ref1, sprite;
    ref = this.sprites;
    for (j = 0, len = ref.length; j < len; j++) {
      sprite = ref[j];
      sprite.dispose();
      if ((ref1 = sprite.bitmap) != null) {
        ref1.dispose();
      }
    }
    return null;
  };


  /**
  * Adds a game object to the message which is alive until the message is
  * erased. Can be used to display animationed-icons, etc. in a message.
  *
  * @method addCustomObject
  * @param object {Object} The game object to add.
   */

  Component_MessageTextRenderer.prototype.addCustomObject = function(object) {
    object.dstRect.x = this.object.dstRect.x + this.object.origin.x + this.currentX;
    object.dstRect.y = this.object.dstRect.y + this.object.origin.y + this.currentY;
    object.zIndex = this.object.zIndex + 1;
    object.update();
    SceneManager.scene.addObject(object);
    return this.customObjects.push(object);
  };


  /**
  * Clears the list of custom game objects. All game objects are disposed and removed
  * from the scene.
  *
  * @method addCustomObject
  * @param object {Object} The game object to add.
   */

  Component_MessageTextRenderer.prototype.clearCustomObjects = function() {
    var j, len, object, ref;
    ref = this.customObjects;
    for (j = 0, len = ref.length; j < len; j++) {
      object = ref[j];
      object.dispose();
      SceneManager.scene.removeObject(object);
    }
    return this.customObjects = [];
  };


  /**
  * Creates the bitmap for a specified line-object.
  *
  * @method createBitmap
  * @private
  * @param {Object} line - A line-object.
  * @return {Bitmap} A newly created bitmap containing the line-text.
   */

  Component_MessageTextRenderer.prototype.createBitmap = function(line) {
    var bitmap;
    this.font = this.object.font;
    bitmap = new Bitmap(this.object.dstRect.width, Math.max(this.minLineHeight, line.height));
    bitmap.font = this.font;
    return bitmap;
  };


  /**
  * Draws the line's content on the specified bitmap.
  *
  * @method drawLineContent
  * @protected
  * @param {Object} line - A line-object which should be drawn on the bitmap.
  * @param {gs.Bitmap} bitmap - The bitmap to draw the line's content on.
  * @param {number} length - Determines how many characters of the specified line should be drawn. You can 
  * specify -1 to draw all characters.
   */

  Component_MessageTextRenderer.prototype.drawLineContent = function(line, bitmap, length) {
    var currentX, drawAll, i, j, len, ref, size, token, value;
    bitmap.clear();
    currentX = this.padding;
    drawAll = length === -1;
    ref = line.content;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      token = ref[i];
      if (i > this.tokenIndex && !drawAll) {
        break;
      }
      if (token.code != null) {
        size = this.measureControlToken(token, bitmap);
        this.drawControlToken(token, bitmap, currentX);
        if (size) {
          currentX += size.width;
        }
        this.processControlToken(token, true, line);
      } else if (token.value.length > 0) {
        token.applyFormat(this.font);
        value = token.value;
        if (!drawAll && this.tokenIndex === i && value.length > length) {
          value = value.substring(0, length);
        }
        if (value !== "\n") {
          size = this.font.measureTextPlain(value);
          bitmap.drawText(currentX, line.height - (size.height - this.font.descent) - line.descent, size.width, bitmap.height, value, 0, 0);
          currentX += size.width;
        }
      }
    }
    return line.contentWidth = currentX + this.font.measureTextPlain(" ").width;
  };


  /**
  * Creates the sprite for a specified line-object.
  *
  * @method createSprite
  * @private
  * @param {Object} line - A line-object.
  * @return {Sprite} A newly created sprite object containing the line-text as bitmap.
   */

  Component_MessageTextRenderer.prototype.createSprite = function(line) {
    var bitmap, sprite;
    bitmap = this.createBitmap(line);
    this.currentX = 0;
    this.waitCounter = 0;
    this.waitForKey = false;
    sprite = new Sprite(Graphics.viewport);
    sprite.bitmap = bitmap;
    sprite.visible = true;
    sprite.z = this.object.zIndex + 1;
    sprite.srcRect = new Rect(0, 0, 0, bitmap.height);
    return sprite;
  };


  /**
  * Creates the sprites for a specified array of line-objects.
  *
  * @method createSprites
  * @private
  * @see gs.Component_MessageTextRenderer.createSprite.
  * @param {Array} lines - An array of line-objects.
  * @return {Array} An array of sprites.
   */

  Component_MessageTextRenderer.prototype.createSprites = function(lines) {
    var i, j, len, line, result, sprite;
    this.fontSize = this.object.font.size;
    result = [];
    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      sprite = this.createSprite(line);
      result.push(sprite);
    }
    return result;
  };


  /**
  * Starts a new line.
  *
  * @method newLine
   */

  Component_MessageTextRenderer.prototype.newLine = function() {
    this.currentX = 0;
    return this.currentY += this.currentLineHeight + this.lineSpacing;
  };


  /**
  * Displays a formatted text immediately without any delays or animations. The
  * Component_TextRenderer.drawFormattedText method from the base-class cannot
  * be used here because it would render to the game object's bitmap object while
  * this method is rendering to the sprites.
  *
  * @method drawFormattedTextImmediately
  * @param {number} x - The x-coordinate of the text's position.
  * @param {number} y - The y-coordinate of the text's position.
  * @param {number} width - Deprecated. Can be null.
  * @param {number} height - Deprecated. Can be null.
  * @param {string} text - The text to draw.
  * @param {boolean} wordWrap - If wordWrap is set to true, line-breaks are automatically created.
   */

  Component_MessageTextRenderer.prototype.drawFormattedTextImmediately = function(x, y, width, height, text, wordWrap) {
    this.drawFormattedText(x, y, width, height, text, wordWrap);
    while (true) {
      this.nextChar();
      if (this.line >= this.maxLines) {
        this.isRunning = false;
      } else {
        this.drawNext();
      }
      if (!this.isRunning) {
        break;
      }
    }
    this.currentY += this.currentLineHeight + this.lineSpacing;
    return null;
  };


  /**
  * Starts the rendering-process for the message.
  *
  * @method drawFormattedText
  * @param {number} x - The x-coordinate of the text's position.
  * @param {number} y - The y-coordinate of the text's position.
  * @param {number} width - Deprecated. Can be null.
  * @param {number} height - Deprecated. Can be null.
  * @param {string} text - The text to draw.
  * @param {boolean} wordWrap - If wordWrap is set to true, line-breaks are automatically created.
   */

  Component_MessageTextRenderer.prototype.drawFormattedText = function(x, y, width, height, text, wordWrap) {
    var currentX, ref;
    text = text || " ";
    this.font.set(this.object.font);
    this.speed = 11 - Math.round(GameManager.settings.messageSpeed * 2.5);
    this.isRunning = true;
    this.drawImmediately = false;
    this.lineAnimationCount = this.speed;
    this.currentLineHeight = 0;
    this.isWaiting = false;
    this.waitForKey = false;
    this.charIndex = 0;
    this.token = null;
    this.tokenIndex = 0;
    this.message = text;
    this.line = 0;
    this.currentLine = this.line;
    currentX = this.currentX;
    this.lines = this.calculateLines(lcsm(this.message), wordWrap, this.currentX);
    this.sprites = this.createSprites(this.lines);
    this.allSprites = this.allSprites.concat(this.sprites);
    this.currentX = currentX;
    this.currentSprite = this.sprites[this.line];
    this.currentSprite.x = this.currentX + this.object.origin.x + this.object.dstRect.x;
    this.maxLines = this.calculateMaxLines(this.lines);
    this.token = ((ref = this.lines[this.line]) != null ? ref.content[this.tokenIndex] : void 0) || new gs.RendererToken(null, "");
    return this.start();
  };


  /**
  * Starts the message-rendering process.
  *
  * @method start
  * @protected
   */

  Component_MessageTextRenderer.prototype.start = function() {
    var ref;
    if (GameManager.tempSettings.skip && GameManager.tempSettings.skipTime === 0) {
      return this.instantSkip();
    } else if (this.maxLines === 0) {
      if (((ref = this.lines[0]) != null ? ref.content : void 0) === "") {
        return this.finish();
      } else {
        this.maxLines = 1;
        return this.drawNext();
      }
    } else {
      return this.drawNext();
    }
  };


  /**
  * Skips the current message and finishes the message-processing immediately. The message
  * tokens are processed but not rendered.
  *
  * @method instantSkip
   */

  Component_MessageTextRenderer.prototype.instantSkip = function() {
    var ref;
    while (true) {
      if (this.line < this.maxLines) {
        this.nextChar();
      }
      if (this.line >= this.maxLines) {
        break;
      } else {
        this.processToken();
      }
      if (!(this.isRunning && this.line < this.maxLines)) {
        break;
      }
    }
    if ((ref = this.object.events) != null) {
      ref.emit("messageWaiting", this);
    }
    return this["continue"]();
  };


  /**
  * Processes the current token.
  *
  * @method processToken
   */

  Component_MessageTextRenderer.prototype.processToken = function() {
    var base, token;
    token = null;
    if (this.token.code != null) {
      token = this.processControlToken(this.token, false);
      if (token != null) {
        this.token = token;
        if (typeof (base = this.token).onStart === "function") {
          base.onStart();
        }
      }
    } else {
      token = this.token;
    }
    return token;
  };

  return Component_MessageTextRenderer;

})(gs.Component_TextRenderer);

gs.Component_MessageTextRenderer = Component_MessageTextRenderer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsNkJBQUE7RUFBQTs7O0FBQU07OztFQUNGLDZCQUFDLENBQUEsb0JBQUQsR0FBd0IsQ0FBQyxhQUFELEVBQWdCLGtCQUFoQjs7O0FBQ3hCOzs7Ozs7Ozs7MENBUUEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUDtBQUNqQixRQUFBO0lBQUEsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFDQSxDQUFBLEdBQUk7QUFFSjtBQUFBLFNBQUEscUNBQUE7O01BQ0ksSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBcEI7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFiLEdBQXlCLElBQUEsRUFBRSxDQUFDLEtBQUgsQ0FBUyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQTNCLEVBRDdCOztNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQSxDQUFLLE9BQU8sQ0FBQyxJQUFiLENBQWhCLEVBQW9DLElBQXBDLEVBQXlDLENBQXpDO0FBQ1Q7QUFBQSxXQUFBLHdDQUFBOztRQUNJLE1BQUEsR0FBUyxJQUFDLENBQUEsWUFBRCxDQUFjLElBQWQ7UUFDVCxJQUFHLElBQUEsS0FBUSxJQUFDLENBQUEsSUFBWjtVQUNJLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLE1BQXZCLEVBQStCLElBQUMsQ0FBQSxTQUFELEdBQVcsQ0FBMUMsRUFESjtTQUFBLE1BQUE7VUFHSSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixFQUF1QixNQUF2QixFQUErQixDQUFDLENBQWhDLEVBSEo7O1FBSUEsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFmLEdBQXdCO1FBQ3hCLENBQUE7QUFQSjtBQUpKO0FBY0E7QUFBQSxTQUFBLHdDQUFBOztNQUNJLFlBQVksQ0FB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QUcsdUJBQUg7TUFDSSxLQUFBLEdBQVEsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQUMsQ0FBQSxLQUF0QixFQUE2QixLQUE3QjtNQUNSLElBQUcsYUFBSDtRQUNJLElBQUMsQ0FBQSxLQUFELEdBQVM7O2NBQ0gsQ0FBQztTQUZYO09BRko7S0FBQSxNQUFBO01BTUksS0FBQSxHQUFRLElBQUMsQ0FBQSxNQU5iOztBQVFBLFdBQU87RUFYRzs7OztHQTFuQzBCLEVBQUUsQ0FBQzs7QUF5b0MvQyxFQUFFLENBQUMsNkJBQUgsR0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9NZXNzYWdlVGV4dFJlbmRlcmVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfTWVzc2FnZVRleHRSZW5kZXJlciBleHRlbmRzIGdzLkNvbXBvbmVudF9UZXh0UmVuZGVyZXJcbiAgICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJvbkxpbmtDbGlja1wiLCBcIm9uQmF0Y2hEaXNhcHBlYXJcIl1cbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIGwgPSAwXG4gICAgICAgIFxuICAgICAgICBmb3IgbWVzc2FnZSBpbiBAb2JqZWN0Lm1lc3NhZ2VzXG4gICAgICAgICAgICBpZiBAb2JqZWN0LnNldHRpbmdzLnVzZUNoYXJhY3RlckNvbG9yXG4gICAgICAgICAgICAgICAgQG9iamVjdC5mb250LmNvbG9yID0gbmV3IGdzLkNvbG9yKG1lc3NhZ2UuY2hhcmFjdGVyLnRleHRDb2xvcilcbiAgICAgICAgICAgIEBsaW5lcyA9IEBjYWxjdWxhdGVMaW5lcyhsY3NtKG1lc3NhZ2UudGV4dCksIHllcywgMClcbiAgICAgICAgICAgIGZvciBsaW5lIGluIEBsaW5lc1xuICAgICAgICAgICAgICAgIGJpdG1hcCA9IEBjcmVhdGVCaXRtYXAobGluZSlcbiAgICAgICAgICAgICAgICBpZiBsaW5lID09IEBsaW5lXG4gICAgICAgICAgICAgICAgICAgIEBkcmF3TGluZUNvbnRlbnQobGluZSwgYml0bWFwLCBAY2hhckluZGV4KzEpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZHJhd0xpbmVDb250ZW50KGxpbmUsIGJpdG1hcCwgLTEpXG4gICAgICAgICAgICAgICAgQGFsbFNwcml0ZXNbbF0uYml0bWFwID0gYml0bWFwXG4gICAgICAgICAgICAgICAgbCsrXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgXG4gICAgICAgIGZvciBjdXN0b21PYmplY3QgaW4gQGN1c3RvbU9iamVjdHNcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5hZGRPYmplY3QoY3VzdG9tT2JqZWN0KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiAgQSB0ZXh0LXJlbmRlcmVyIGNvbXBvbmVudCB0byByZW5kZXIgYW4gYW5pbWF0ZWQgYW5kIGludGVyYWN0aXZlIG1lc3NhZ2UgdGV4dCB1c2luZ1xuICAgICogIGRpbWVuc2lvbnMgb2YgdGhlIGdhbWUgb2JqZWN0J3MgZGVzdGluYXRpb24tcmVjdGFuZ2xlLiBUaGUgbWVzc2FnZSBpcyBkaXNwbGF5ZWRcbiAgICAqICB1c2luZyBhIHNwcml0ZSBmb3IgZWFjaCBsaW5lIGluc3RlYWQgb2YgZHJhd2luZyB0byB0aGUgZ2FtZSBvYmplY3QncyBiaXRtYXAgb2JqZWN0LlxuICAgICpcbiAgICAqICBAbW9kdWxlIGdzXG4gICAgKiAgQGNsYXNzIENvbXBvbmVudF9NZXNzYWdlVGV4dFJlbmRlcmVyXG4gICAgKiAgQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1RleHRSZW5kZXJlclxuICAgICogIEBtZW1iZXJvZiBnc1xuICAgICogIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHNwcml0ZXMgb2YgdGhlIGN1cnJlbnQgbWVzc2FnZS5cbiAgICAgICAgKiBAcHJvcGVydHkgc3ByaXRlc1xuICAgICAgICAqIEB0eXBlIGdzLlNwcml0ZVtdXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHNwcml0ZXMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHNwcml0ZXMgb2YgYWxsIG1lc3NhZ2VzLiBJbiBOVkwgbW9kZVxuICAgICAgICAqIGEgcGFnZSBjYW4gY29udGFpbiBtdWx0aXBsZSBtZXNzYWdlcy5cbiAgICAgICAgKiBAcHJvcGVydHkgYWxsU3ByaXRlc1xuICAgICAgICAqIEB0eXBlIGdzLlNwcml0ZVtdXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGFsbFNwcml0ZXMgPSBbXVxuICAgICAgICAjIyMqXG4gICAgICAgICogQW4gYXJyYXkgY29udGFpbmluZyBhbGwgbGluZS1vYmplY3RzIG9mIHRoZSBjdXJyZW50IG1lc3NhZ2UuXG4gICAgICAgICogQHByb3BlcnR5IGxpbmVzXG4gICAgICAgICogQHR5cGUgZ3MuVGV4dFJlbmRlcmVyTGluZVtdXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAbGluZXMgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGxpbmUgY3VycmVudGx5IHJlbmRlcmVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsaW5lXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAbGluZSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbGVmdCBhbmQgcmlnaHQgcGFkZGluZyBwZXIgbGluZS5cbiAgICAgICAgKiBAcHJvcGVydHkgcGFkZGluZ1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHBhZGRpbmcgPSA2XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG1pbmltdW0gaGVpZ2h0IG9mIHRoZSBsaW5lIGN1cnJlbnRseSByZW5kZXJlZC4gSWYgMCwgdGhlIG1lYXN1cmVkXG4gICAgICAgICogaGVpZ2h0IG9mIHRoZSBsaW5lIHdpbGwgYmUgdXNlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgbWluTGluZUhlaWdodFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQG1pbkxpbmVIZWlnaHQgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHNwYWNpbmcgYmV0d2VlbiB0ZXh0IGxpbmVzIGluIHBpeGVscy5cbiAgICAgICAgKiBAcHJvcGVydHkgbGluZVNwYWNpbmdcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBsaW5lU3BhY2luZyA9IDJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbGluZSBjdXJyZW50bHkgcmVuZGVyZWQuXG4gICAgICAgICogQHByb3BlcnR5IGN1cnJlbnRMaW5lXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGN1cnJlbnRMaW5lID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIGxpbmUgY3VycmVudGx5IHJlbmRlcmVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXJyZW50TGluZUhlaWdodFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjdXJyZW50TGluZUhlaWdodCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRleCBvZiB0aGUgY3VycmVudCBjaGFyYWN0ZXIgdG8gZHJhdy5cbiAgICAgICAgKiBAcHJvcGVydHkgY2hhckluZGV4XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAY2hhckluZGV4ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFBvc2l0aW9uIG9mIHRoZSBtZXNzYWdlIGNhcmV0LiBUaGUgY2FyZXQgaXMgbGlrZSBhbiBpbnZpc2libGVcbiAgICAgICAgKiBjdXJzb3IgcG9pbnRpbmcgdG8gdGhlIHgveSBjb29yZGluYXRlcyBvZiB0aGUgbGFzdCByZW5kZXJlZCBjaGFyYWN0ZXIgb2ZcbiAgICAgICAgKiB0aGUgbWVzc2FnZS4gVGhhdCBwb3NpdGlvbiBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IGEgd2FpdGluZy0gb3IgcHJvY2Vzc2luZy1hbmltYXRpb24gZm9yIGV4YW1wbGUuXG4gICAgICAgICogQHByb3BlcnR5IGNhcmV0UG9zaXRpb25cbiAgICAgICAgKiBAdHlwZSBncy5Qb2ludFxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQGNhcmV0UG9zaXRpb24gPSBuZXcgZ3MuUG9pbnQoKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyB0aGF0IHRoZSBhIG1lc3NhZ2UgaXMgY3VycmVudGx5IGluIHByb2dyZXNzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1J1bm5pbmdcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAaXNSdW5uaW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCB4LWNvb3JkaW5hdGUgb2YgdGhlIGNhcmV0L2N1cnNvci5cbiAgICAgICAgKiBAcHJvcGVydHkgY3VycmVudFhcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBjdXJyZW50WCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCB5LWNvb3JkaW5hdGUgb2YgdGhlIGNhcmV0L2N1cnNvci5cbiAgICAgICAgKiBAcHJvcGVydHkgY3VycmVudFlcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBjdXJyZW50WSA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCBzcHJpdGVzIHVzZWQgdG8gZGlzcGxheSB0aGUgY3VycmVudCB0ZXh0LWxpbmUvcGFydC5cbiAgICAgICAgKiBAcHJvcGVydHkgY3VycmVudFNwcml0ZVxuICAgICAgICAqIEB0eXBlIGdzLlNwcml0ZVxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQGN1cnJlbnRTcHJpdGUgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBtZXNzYWdlLXJlbmRlcmVyIGlzIGN1cnJlbnRseSB3YWl0aW5nIGxpa2UgZm9yIGEgdXNlci1hY3Rpb24uXG4gICAgICAgICogQHByb3BlcnR5IGlzV2FpdGluZ1xuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgbWVzc2FnZS1yZW5kZXJlciBpcyBjdXJyZW50bHkgd2FpdGluZyBmb3IgYSBrZXktcHJlc3Mgb3IgbW91c2UvdG91Y2ggYWN0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSB3YWl0Rm9yS2V5XG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQHdhaXRGb3JLZXkgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIE51bWJlciBvZiBmcmFtZXMgdGhlIG1lc3NhZ2UtcmVuZGVyZXIgc2hvdWxkIHdhaXQgYmVmb3JlIGNvbnRpbnVlLlxuICAgICAgICAqIEBwcm9wZXJ0eSB3YWl0Q291bnRlclxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHdhaXRDb3VudGVyID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFNwZWVkIG9mIHRoZSBtZXNzYWdlLWRyYXdpbmcuIFRoZSBzbWFsbGVyIHRoZSB2YWx1ZSwgdGhlIGZhc3RlciB0aGUgbWVzc2FnZSBpcyBkaXNwbGF5ZWQuXG4gICAgICAgICogQHByb3BlcnR5IHNwZWVkXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAc3BlZWQgPSAxXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBtZXNzYWdlIHNob3VsZCBiZSByZW5kZXJlZCBpbW1lZGlhbHRlbHkgd2l0aG91dCBhbnkgYW5pbWF0aW9uIG9yIGRlbGF5LlxuICAgICAgICAqIEBwcm9wZXJ0eSBkcmF3SW1tZWRpYXRlbHlcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAZHJhd0ltbWVkaWF0ZWx5ID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1lc3NhZ2Ugc2hvdWxkIHdhaXQgZm9yIGEgdXNlci1hY3Rpb24gb3IgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lXG4gICAgICAgICogYmVmb3JlIGZpbmlzaGluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgd2FpdEF0RW5kXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQHdhaXRBdEVuZCA9IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBudW1iZXIgb2YgZnJhbWVzIHRvIHdhaXQgYmVmb3JlIGZpbmlzaGluZyBhIG1lc3NhZ2UuXG4gICAgICAgICogYmVmb3JlIGZpbmlzaGluZy5cbiAgICAgICAgKiBAcHJvcGVydHkgd2FpdEF0RW5kVGltZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHdhaXRBdEVuZFRpbWUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIGF1dG8gd29yZC13cmFwIHNob3VsZCBiZSB1c2VkLiBEZWZhdWx0IGlzIDxiPnRydWU8L2I+XG4gICAgICAgICogQHByb3BlcnR5IHdvcmRXcmFwXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQHdvcmRXcmFwID0geWVzXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ3VzdG9tIGdhbWUgb2JqZWN0cyB3aGljaCBhcmUgYWxpdmUgdW50aWwgdGhlIGN1cnJlbnQgbWVzc2FnZSBpcyBlcmFzZWQuIENhbiBiZSB1c2VkIHRvIGRpc3BsYXlcbiAgICAgICAgKiBhbmltYXRlZCBpY29ucywgZXRjLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXN0b21PYmplY3RzXG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X0Jhc2VbXVxuICAgICAgICAjIyNcbiAgICAgICAgQGN1c3RvbU9iamVjdHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEEgaGFzaHRhYmxlL2RpY3Rpb25hcnkgb2JqZWN0IHRvIHN0b3JlIGN1c3RvbS1kYXRhIHVzZWZ1bCBsaWtlIGZvciB0b2tlbi1wcm9jZXNzaW5nLiBUaGUgZGF0YSBtdXN0IGJlXG4gICAgICAgICogc2VyaWFsaXphYmxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXN0b21PYmplY3RzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAY3VzdG9tRGF0YSA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQSBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgaWYgdGhlIHBsYXllciBjbGlja3Mgb24gYSBub24tc3R5bGFibGUgbGluayAoTEsgdGV4dC1jb2RlKSB0byB0cmlnZ2VyXG4gICAgICAgICogdGhlIHNwZWNpZmllZCBjb21tb24gZXZlbnQuXG4gICAgICAgICogQHByb3BlcnR5IG9uTGlua0NsaWNrXG4gICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgIyMjXG4gICAgICAgIEBvbkxpbmtDbGljayA9IChlKSAtPlxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmludGVycHJldGVyLmNhbGxDb21tb25FdmVudChlLmRhdGEubGlua0RhdGEuY29tbW9uRXZlbnRJZCwgbnVsbClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCBpZiBhIGJhdGNoZWQgbWVzc3NhZ2UgaGFzIGJlZW4gZmFkZWQgb3V0LiBJdCB0cmlnZ2VycyB0aGUgZXhlY3V0aW9uIG9mXG4gICAgICAgICogdGhlIG5leHQgbWVzc2FnZS5cbiAgICAgICAgKiBAcHJvcGVydHkgb25CYXRjaERpc2FwcGVhclxuICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICMjIyAgICBcbiAgICAgICAgQG9uQmF0Y2hEaXNhcHBlYXIgPSAoZSkgPT4gXG4gICAgICAgICAgICBAZHJhd0ltbWVkaWF0ZWx5ID0gbm9cbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICAgICAgQG9iamVjdC5vcGFjaXR5ID0gMjU1XG4gICAgICAgICAgICBAZXhlY3V0ZUJhdGNoKClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIG1lc3NhZ2UgdGV4dC1yZW5kZXJlciBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKiBAbWV0aG9kIHRvRGF0YUJ1bmRsZVxuICAgICogQHJldHVybiB7T2JqZWN0fSBBIGRhdGEtYnVuZGxlLlxuICAgICMjI1xuICAgIHRvRGF0YUJ1bmRsZTogLT5cbiAgICAgICAgaWdub3JlID0gW1wib2JqZWN0XCIsIFwiZm9udFwiLCBcInNwcml0ZXNcIiwgXCJhbGxTcHJpdGVzXCIsIFwiY3VycmVudFNwcml0ZVwiLCBcImN1cnJlbnRYXCJdXG4gICAgICAgIGJ1bmRsZSA9IHsgY3VycmVudFNwcml0ZUluZGV4OiBAc3ByaXRlcy5pbmRleE9mKEBjdXJyZW50U3ByaXRlKSB9XG4gICAgICAgIFxuICAgICAgICBmb3IgayBvZiB0aGlzXG4gICAgICAgICAgICBpZiBpZ25vcmUuaW5kZXhPZihrKSA9PSAtMVxuICAgICAgICAgICAgICAgIGJ1bmRsZVtrXSA9IHRoaXNba11cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGJ1bmRsZVxuICAgICBcbiAgICBcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBtZXNzYWdlIHRleHQtcmVuZGVyZXIgYW5kIGFsbCBzcHJpdGVzIHVzZWQgdG8gZGlzcGxheVxuICAgICogdGhlIG1lc3NhZ2UuXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZVVwXCIsIEBvYmplY3QpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgXG4gICAgICAgIGZvciBzcHJpdGUgaW4gQGFsbFNwcml0ZXNcbiAgICAgICAgICAgIHNwcml0ZS5iaXRtYXA/LmRpc3Bvc2UoKVxuICAgICAgICAgICAgc3ByaXRlLmRpc3Bvc2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEFkZHMgZXZlbnQtaGFuZGxlcnMgZm9yIG1vdXNlL3RvdWNoIGV2ZW50c1xuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBFdmVudEhhbmRsZXJzXG4gICAgIyMjIFxuICAgIHNldHVwRXZlbnRIYW5kbGVyczogLT5cbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZVVwXCIsIEBvYmplY3QpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIm1vdXNlVXBcIiwgKChlKSA9PlxuICAgICAgICAgICAgcmV0dXJuIGlmIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWQgYW5kICFHYW1lTWFuYWdlci5zZXR0aW5ncy5hdXRvTWVzc2FnZS5zdG9wT25BY3Rpb25cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBvYmplY3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICAgICAgaWYgQGlzV2FpdGluZyBhbmQgbm90IChAd2FpdENvdW50ZXIgPiAwIG9yIEB3YWl0Rm9yS2V5KVxuICAgICAgICAgICAgICAgICAgICBlLmJyZWFrQ2hhaW4gPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgQGNvbnRpbnVlKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBkcmF3SW1tZWRpYXRlbHkgPSAhQHdhaXRGb3JLZXlcbiAgICAgICAgICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gMFxuICAgICAgICAgICAgICAgICAgICBAd2FpdEZvcktleSA9IG5vXG4gICAgICAgICAgICAgICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBAd2FpdEZvcktleVxuICAgICAgICAgICAgICAgICAgICBpZiBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLkxFRlRdID09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuYnJlYWtDaGFpbiA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgSW5wdXQuY2xlYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQHdhaXRGb3JLZXkgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICApLCBudWxsLCBAb2JqZWN0XG4gICAgICAgIFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJrZXlVcFwiLCAoKGUpID0+XG4gICAgICAgICAgICBpZiBJbnB1dC5rZXlzW0lucHV0LkNdIGFuZCAoIUBpc1dhaXRpbmcgb3IgKEB3YWl0Q291bnRlciA+IDAgb3IgQHdhaXRGb3JLZXkpKVxuICAgICAgICAgICAgICAgIEBkcmF3SW1tZWRpYXRlbHkgPSAhQHdhaXRGb3JLZXlcbiAgICAgICAgICAgICAgICBAd2FpdENvdW50ZXIgPSAwXG4gICAgICAgICAgICAgICAgQHdhaXRGb3JLZXkgPSBub1xuICAgICAgICAgICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGlzV2FpdGluZyBhbmQgIUB3YWl0Rm9yS2V5IGFuZCAhQHdhaXRDb3VudGVyIGFuZCBJbnB1dC5rZXlzW0lucHV0LkNdXG4gICAgICAgICAgICAgICAgQGNvbnRpbnVlKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEB3YWl0Rm9yS2V5XG4gICAgICAgICAgICAgICAgaWYgSW5wdXQua2V5c1tJbnB1dC5DXVxuICAgICAgICAgICAgICAgICAgICBJbnB1dC5jbGVhcigpXG4gICAgICAgICAgICAgICAgICAgIEB3YWl0Rm9yS2V5ID0gbm9cbiAgICAgICAgICAgICAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICksIG51bGwsIEBvYmplY3RcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB0aGUgcmVuZGVyZXIuIFJlZ2lzdGVycyBuZWNlc3NhcnkgZXZlbnQgaGFuZGxlcnMuXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjIFxuICAgIHNldHVwOiAtPlxuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgdGhlIG1lc3NhZ2UgdGV4dC1yZW5kZXJlcidzIHN0YXRlIGZyb20gYSBkYXRhLWJ1bmRsZS5cbiAgICAqIEBtZXRob2QgcmVzdG9yZVxuICAgICogQHBhcmFtIHtPYmplY3R9IGJ1bmRsZSAtIEEgZGF0YS1idW5kbGUgY29udGFpbmluZyBtZXNzYWdlIHRleHQtcmVuZGVyZXIgc3RhdGUuXG4gICAgIyMjXG4gICAgcmVzdG9yZTogKGJ1bmRsZSkgLT5cbiAgICAgICAgZm9yIGsgb2YgYnVuZGxlXG4gICAgICAgICAgICBpZiBrID09IFwiY3VycmVudFNwcml0ZUluZGV4XCJcbiAgICAgICAgICAgICAgICBAY3VycmVudFNwcml0ZSA9IEBzcHJpdGVzW2J1bmRsZS5jdXJyZW50U3ByaXRlSW5kZXhdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpc1trXSA9IGJ1bmRsZVtrXVxuICAgICAgICBcbiAgICAgICAgaWYgQHNwcml0ZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgQGN1cnJlbnRZID0gQHNwcml0ZXMubGFzdCgpLnkgLSBAb2JqZWN0Lm9yaWdpbi55IC0gQG9iamVjdC5kc3RSZWN0LnlcbiAgICAgICAgICAgIEBsaW5lID0gQG1heExpbmVzXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0gQGlzV2FpdGluZyB8fCBAaXNSdW5uaW5nXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGwgICAgXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQ29udGludWVzIG1lc3NhZ2UtcHJvY2Vzc2luZyBpZiBjdXJyZW50bHkgd2FpdGluZy5cbiAgICAqIEBtZXRob2QgY29udGludWVcbiAgICAjIyNcbiAgICBjb250aW51ZTogLT4gXG4gICAgICAgIElucHV0LmNsZWFyKClcbiAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICBcbiAgICAgICAgaWYgQGxpbmUgPj0gQGxpbmVzLmxlbmd0aFxuICAgICAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgICAgICAgICBAb2JqZWN0LmV2ZW50cz8uZW1pdChcIm1lc3NhZ2VGaW5pc2hcIiwgdGhpcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJtZXNzYWdlQmF0Y2hcIiwgdGhpcylcbiAgICAgICAgICAgIGZhZGluZyA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5tZXNzYWdlRmFkaW5nXG4gICAgICAgICAgICBkdXJhdGlvbiA9IGlmIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwIHRoZW4gMCBlbHNlIGZhZGluZy5kdXJhdGlvblxuICAgICAgICAgICAgQG9iamVjdC5hbmltYXRvci5kaXNhcHBlYXIoZmFkaW5nLmFuaW1hdGlvbiwgZmFkaW5nLmVhc2luZywgZHVyYXRpb24sIGdzLkNhbGxCYWNrKFwib25CYXRjaERpc2FwcGVhclwiLCB0aGlzKSlcbiAgICAgICAgICAgICNAZXhlY3V0ZUJhdGNoKClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHRleHQtcmVuZGVyZXIuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgZm9yIHNwcml0ZSBpbiBAYWxsU3ByaXRlc1xuICAgICAgICAgICAgc3ByaXRlLm9wYWNpdHkgPSBAb2JqZWN0Lm9wYWNpdHlcbiAgICAgICAgICAgIHNwcml0ZS52aXNpYmxlID0gQG9iamVjdC52aXNpYmxlXG4gICAgICAgICAgICBzcHJpdGUub3ggPSAtQG9iamVjdC5vZmZzZXQueFxuICAgICAgICAgICAgc3ByaXRlLm95ID0gLUBvYmplY3Qub2Zmc2V0LnlcbiAgICAgICAgICAgIHNwcml0ZS5tYXNrLnZhbHVlID0gQG9iamVjdC5tYXNrLnZhbHVlXG4gICAgICAgICAgICBzcHJpdGUubWFzay52YWd1ZSA9IEBvYmplY3QubWFzay52YWd1ZVxuICAgICAgICAgICAgc3ByaXRlLm1hc2suc291cmNlID0gQG9iamVjdC5tYXNrLnNvdXJjZVxuICAgICAgICAgICAgc3ByaXRlLm1hc2sudHlwZSA9IEBvYmplY3QubWFzay50eXBlXG4gICAgXG4gICAgICAgIGZvciBvYmplY3QgaW4gQGN1c3RvbU9iamVjdHNcbiAgICAgICAgICAgIG9iamVjdC5vcGFjaXR5ID0gQG9iamVjdC5vcGFjaXR5XG4gICAgICAgICAgICBvYmplY3QudmlzaWJsZSA9IEBvYmplY3QudmlzaWJsZVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAaXNSdW5uaW5nIGFuZCBAd2FpdENvdW50ZXIgPiAwXG4gICAgICAgICAgICBAd2FpdENvdW50ZXItLVxuICAgICAgICAgICAgaWYgQHdhaXRDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICBAY29udGludWUoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QudmlzaWJsZSBhbmQgQGxpbmVzPy5sZW5ndGggPiAwXG4gICAgICAgICAgICBAdXBkYXRlTGluZVdyaXRpbmcoKVxuICAgICAgICAgICAgQHVwZGF0ZUNhcmV0UG9zaXRpb24oKVxuICAgICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogSW5kaWNhdGVzIGlmIGl0cyBhIGJhdGNoZWQgbWVzc2FnZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBpc0JhdGNoZWRcbiAgICAqIEByZXR1cm4gSWYgPGI+dHJ1ZTwvYj4gaXQgaXMgYSBiYXRjaGVkIG1lc3NhZ2UuIE90aGVyd2lzZSA8Yj5mYWxzZTwvYj4uXG4gICAgIyMjXG4gICAgaXNCYXRjaGVkOiAtPiBAbGluZXMubGVuZ3RoID4gQG1heExpbmVzXG4gICAgXG4gICAgIyMjKlxuICAgICogSW5kaWNhdGVzIGlmIHRoZSBiYXRjaCBpcyBzdGlsbCBpbiBwcm9ncmVzcyBhbmQgbm90IGRvbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBpc0JhdGNoSW5Qcm9ncmVzc1xuICAgICogQHJldHVybiBJZiA8Yj50cnVlPC9iPiB0aGUgYmF0Y2hlZCBtZXNzYWdlIGlzIHN0aWxsIG5vdCBkb25lLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+XG4gICAgIyMjXG4gICAgaXNCYXRjaEluUHJvZ3Jlc3M6IC0+IEBsaW5lcy5sZW5ndGggLSBAbGluZSA+IEBtYXhMaW5lc1xuICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyBkaXNwbGF5aW5nIHRoZSBuZXh0IHBhZ2Ugb2YgdGV4dCBpZiBhIG1lc3NhZ2UgaXMgdG9vIGxvbmcgdG8gZml0XG4gICAgKiBpbnRvIG9uZSBtZXNzYWdlIGJveC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGV4ZWN1dGVCYXRjaFxuICAgICMjIyBcbiAgICBleGVjdXRlQmF0Y2g6IC0+XG4gICAgICAgIEBjbGVhckFsbFNwcml0ZXMoKVxuICAgICAgICBAbGluZXMgPSBAbGluZXMuc2xpY2UoQGxpbmUpXG4gICAgICAgIEBsaW5lID0gMFxuICAgICAgICBAY3VycmVudFggPSAwXG4gICAgICAgIEBjdXJyZW50WSA9IDAgIFxuICAgICAgICBAY3VycmVudExpbmVIZWlnaHQgPSAwXG4gICAgICAgIEB0b2tlbkluZGV4ID0gMFxuICAgICAgICBAY2hhckluZGV4ID0gMFxuICAgICAgICBAdG9rZW4gPSBAbGluZXNbQGxpbmVdLmNvbnRlbnRbQHRva2VuSW5kZXhdIHx8IG5ldyBncy5SZW5kZXJlclRva2VuKG51bGwsIFwiXCIpO1xuICAgICAgICBAbWF4TGluZXMgPSBAY2FsY3VsYXRlTWF4TGluZXMoQGxpbmVzKVxuICAgICAgICBAbGluZUFuaW1hdGlvbkNvdW50ID0gQHNwZWVkXG4gICAgICAgIEBzcHJpdGVzID0gQGNyZWF0ZVNwcml0ZXMoQGxpbmVzKVxuICAgICAgICBAYWxsU3ByaXRlcyA9IEBhbGxTcHJpdGVzLmNvbmNhdChAc3ByaXRlcylcbiAgICAgICAgQGN1cnJlbnRTcHJpdGUgPSBAc3ByaXRlc1tAbGluZV1cbiAgICAgICAgQGN1cnJlbnRTcHJpdGUueCA9IEBjdXJyZW50WCArIEBvYmplY3Qub3JpZ2luLnggKyBAb2JqZWN0LmRzdFJlY3QueFxuICAgICAgICBAZHJhd05leHQoKVxuICAgIFxuICAgICMjIypcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGR1cmF0aW9uKGluIGZyYW1lcykgdGhlIG1lc3NhZ2UtcmVuZGVyZXIgbmVlZHMgdG8gZGlzcGxheVxuICAgICogdGhlIG1lc3NhZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBjYWxjdWxhdGVEdXJhdGlvblxuICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICMjIyAgICBcbiAgICBjYWxjdWxhdGVEdXJhdGlvbjogLT5cbiAgICAgICAgZHVyYXRpb24gPSAwXG4gICAgICAgIFxuICAgICAgICBpZiBAbGluZXM/XG4gICAgICAgICAgICBmb3IgbGluZSBpbiBAbGluZXNcbiAgICAgICAgICAgICAgICBmb3IgdG9rZW4gaW4gbGluZS5jb250ZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIHRva2VuP1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gKz0gQGNhbGN1bGF0ZUR1cmF0aW9uRm9yVG9rZW4odG9rZW4pXG4gICAgICAgIHJldHVybiBkdXJhdGlvblxuICAgIFxuICAgICMjIypcbiAgICAqIENhbGN1bGF0ZXMgdGhlIGR1cmF0aW9uKGluIGZyYW1lcykgdGhlIG1lc3NhZ2UtcmVuZGVyZXIgbmVlZHMgdG8gZGlzcGxheVxuICAgICogdGhlIHNwZWNpZmllZCBsaW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2FsY3VsYXRlRHVyYXRpb25Gb3JMaW5lXG4gICAgKiBAcGFyYW0ge2dzLlJlbmRlcmVyVGV4dExpbmV9IGxpbmUgVGhlIGxpbmUgdG8gY2FsY3VsYXRlIHRoZSBkdXJhdGlvbiBmb3IuXG4gICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgIyMjICAgICAgXG4gICAgY2FsY3VsYXRlRHVyYXRpb25Gb3JMaW5lOiAobGluZSkgLT5cbiAgICAgICAgZHVyYXRpb24gPSAwXG4gICAgICAgIFxuICAgICAgICBpZiBsaW5lXG4gICAgICAgICAgICBmb3IgdG9rZW4gaW4gbGluZS5jb250ZW50XG4gICAgICAgICAgICAgICAgaWYgdG9rZW4/XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uICs9IEBjYWxjdWxhdGVEdXJhdGlvbkZvclRva2VuKHRva2VuKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBkdXJhdGlvblxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxjdWxhdGVzIHRoZSBkdXJhdGlvbihpbiBmcmFtZXMpIHRoZSBtZXNzYWdlLXJlbmRlcmVyIG5lZWRzIHRvIHByb2Nlc3NcbiAgICAqIHRoZSBzcGVjaWZpZWQgdG9rZW4uXG4gICAgKlxuICAgICogQG1ldGhvZCBjYWxjdWxhdGVEdXJhdGlvbkZvclRva2VuXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHRva2VuIC0gVGhlIHRva2VuLlxuICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgZHVyYXRpb24gaW4gZnJhbWVzLlxuICAgICMjIyAgICAgICAgICAgICAgICAgICAgXG4gICAgY2FsY3VsYXRlRHVyYXRpb25Gb3JUb2tlbjogKHRva2VuKSAtPlxuICAgICAgICBkdXJhdGlvbiA9IDBcbiAgICAgICAgXG4gICAgICAgIGlmIHRva2VuLmNvZGU/XG4gICAgICAgICAgICBzd2l0Y2ggdG9rZW4uY29kZVxuICAgICAgICAgICAgICAgIHdoZW4gXCJXXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgdG9rZW4udmFsdWUgIT0gXCJBXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gdG9rZW4udmFsdWUgLyAxMDAwICogR3JhcGhpY3MuZnJhbWVSYXRlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGR1cmF0aW9uID0gdG9rZW4udmFsdWUubGVuZ3RoICogQHNwZWVkXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGN1bGF0ZXMgdGhlIG1heGltdW0gb2YgbGluZXMgd2hpY2ggY2FuIGJlIGRpc3BsYXllZCBpbiBvbmUgbWVzc2FnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNhbGN1bGF0ZU1heExpbmVzXG4gICAgKiBAcGFyYW0ge0FycmF5fSBsaW5lcyAtIEFuIGFycmF5IG9mIGxpbmUtb2JqZWN0cy5cbiAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBkaXNwbGF5YWJsZSBsaW5lcy5cbiAgICAjIyNcbiAgICBjYWxjdWxhdGVNYXhMaW5lczogKGxpbmVzKSAtPlxuICAgICAgICBoZWlnaHQgPSAwXG4gICAgICAgIHJlc3VsdCA9IDBcbiAgICAgICAgXG4gICAgICAgIGZvciBsaW5lIGluIGxpbmVzXG4gICAgICAgICAgICAgICAgaGVpZ2h0ICs9IGxpbmUuaGVpZ2h0ICsgQGxpbmVTcGFjaW5nXG4gICAgICAgICAgICAgICAgaWYgQGN1cnJlbnRZK2hlaWdodCA+IChAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIHJlc3VsdCsrXG4gICAgIFxuICAgICAgICByZXR1cm4gTWF0aC5taW4obGluZXMubGVuZ3RoLCByZXN1bHQgfHwgMSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwbGF5cyB0aGUgY2hhcmFjdGVyIG9yIHByb2Nlc3NlcyB0aGUgbmV4dCBjb250cm9sLXRva2VuLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHJhd05leHRcbiAgICAjIyNcbiAgICBkcmF3TmV4dDogLT5cbiAgICAgICAgdG9rZW4gPSBAcHJvY2Vzc1Rva2VuKClcbiAgICAgICAgICAgIFxuICAgICAgICBpZiB0b2tlbj8udmFsdWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgQGNoYXIgPSBAdG9rZW4udmFsdWUuY2hhckF0KEBjaGFySW5kZXgpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNpemUgPSBAZm9udC5tZWFzdXJlVGV4dFBsYWluKEBjaGFyKSAgXG4gICAgICAgICAgICBzID0gR3JhcGhpY3Muc2NhbGUgICBcbiAgICAgICAgICAgIGxpbmVTcGFjaW5nID0gQGxpbmVTcGFjaW5nXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBjdXJyZW50TGluZSAhPSBAbGluZVxuICAgICAgICAgICAgICAgIEBjdXJyZW50TGluZSA9IEBsaW5lXG4gICAgICAgICAgICAgICAjIEBjdXJyZW50WSArPSBAY3VycmVudExpbmVIZWlnaHQgKyBsaW5lU3BhY2luZyAqIEdyYXBoaWNzLnNjYWxlXG4gICAgICAgICAgICAgICAgQGN1cnJlbnRMaW5lSGVpZ2h0ID0gMFxuXG4gICAgICAgICAgICBAY3VycmVudFNwcml0ZS55ID0gQG9iamVjdC5vcmlnaW4ueSArIEBvYmplY3QuZHN0UmVjdC55ICsgQGN1cnJlbnRZXG4gICAgICAgICAgICBAY3VycmVudFNwcml0ZS52aXNpYmxlID0geWVzXG4gICAgICAgICAgICBAZHJhd0xpbmVDb250ZW50KEBsaW5lc1tAbGluZV0sIEBjdXJyZW50U3ByaXRlLmJpdG1hcCwgQGNoYXJJbmRleCsxKVxuICAgICAgICAgICAgQGN1cnJlbnRTcHJpdGUuc3JjUmVjdC53aWR0aCA9IEBjdXJyZW50U3ByaXRlLmJpdG1hcC53aWR0aCAjTWF0aC5taW4oQGN1cnJlbnRTcHJpdGUuc3JjUmVjdC53aWR0aCArIHNpemUud2lkdGgsIEBjdXJyZW50U3ByaXRlLmJpdG1hcC53aWR0aClcbiAgICAgICAgXG4gICAgICAgICAgICBAY3VycmVudExpbmVIZWlnaHQgPSBAbGluZXNbQGxpbmVdLmhlaWdodFxuICAgICAgICAgICAgQGN1cnJlbnRYID0gTWF0aC5taW4oQGxpbmVzW0BsaW5lXS53aWR0aCwgQGN1cnJlbnRYICsgc2l6ZS53aWR0aClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFByb2Nlc3NlcyB0aGUgbmV4dCBjaGFyYWN0ZXIvdG9rZW4gb2YgdGhlIG1lc3NhZ2UuXG4gICAgKiBAbWV0aG9kIG5leHRDaGFyXG4gICAgKiBAcHJpdmF0ZVxuICAgICMjI1xuICAgIG5leHRDaGFyOiAtPlxuICAgICAgICBsb29wXG4gICAgICAgICAgICBAY2hhckluZGV4KytcbiAgICAgICAgICAgIEBsaW5lQW5pbWF0aW9uQ291bnQgPSBAc3BlZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQHRva2VuLmNvZGU/IG9yIEBjaGFySW5kZXggPj0gQHRva2VuLnZhbHVlLmxlbmd0aFxuICAgICAgICAgICAgICAgIEB0b2tlbi5vbkVuZD8oKVxuICAgICAgICAgICAgICAgIEB0b2tlbkluZGV4KytcbiAgICAgICAgICAgICAgICBpZiBAdG9rZW5JbmRleCA+PSBAbGluZXNbQGxpbmVdLmNvbnRlbnQubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIEB0b2tlbkluZGV4ID0gMFxuICAgICAgICAgICAgICAgICAgICBAbGluZSsrXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50U3ByaXRlLnNyY1JlY3Qud2lkdGggPSBAY3VycmVudFNwcml0ZS5iaXRtYXAud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRTcHJpdGUgPSBAc3ByaXRlc1tAbGluZV1cbiAgICAgICAgICAgICAgICAgICAgaWYgQGN1cnJlbnRTcHJpdGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBAY3VycmVudFNwcml0ZS54ID0gQG9iamVjdC5vcmlnaW4ueCArIEBvYmplY3QuZHN0UmVjdC54XG4gICAgICAgICAgICAgICAgICAgIGlmIEBsaW5lIDwgQG1heExpbmVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAY3VycmVudFkgKz0gKEBjdXJyZW50TGluZUhlaWdodCB8fCBAZm9udC5saW5lSGVpZ2h0KSArIEBsaW5lU3BhY2luZyAqIEdyYXBoaWNzLnNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBAY2hhckluZGV4ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRYID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgQHRva2VuID0gQGxpbmVzW0BsaW5lXS5jb250ZW50W0B0b2tlbkluZGV4XSB8fCBuZXcgZ3MuUmVuZGVyZXJUb2tlbihudWxsLCBcIlwiKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGNoYXJJbmRleCA9IDBcbiAgICAgICAgICAgICAgICAgICAgQHRva2VuID0gQGxpbmVzW0BsaW5lXS5jb250ZW50W0B0b2tlbkluZGV4XSB8fCBuZXcgZ3MuUmVuZGVyZXJUb2tlbihudWxsLCBcIlwiKVxuICAgICAgICAgICAgICAgIEB0b2tlbi5vblN0YXJ0PygpXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgIUB0b2tlbiBvciBAdG9rZW4udmFsdWUgIT0gXCJcXG5cIiBvciAhQGxpbmVzW0BsaW5lXVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgIyMjKlxuICAgICogRmluaXNoZXMgdGhlIG1lc3NhZ2UuIERlcGVuZGluZyBvbiB0aGUgbWVzc2FnZSBjb25maWd1cmF0aW9uLCB0aGVcbiAgICAqIG1lc3NhZ2UgdGV4dC1yZW5kZXJlciB3aWxsIG5vdyB3YWl0IGZvciBhIHVzZXItYWN0aW9uIG9yIGEgY2VydGFpbiBhbW91bnRcbiAgICAqIG9mIHRpbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBmaW5pc2hcbiAgICAjIyNcbiAgICBmaW5pc2g6IC0+XG4gICAgICAgIGlmIEB3YWl0QXRFbmRcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBvYmplY3QuZXZlbnRzPy5lbWl0KFwibWVzc2FnZVdhaXRpbmdcIiwgdGhpcylcbiAgICAgICAgZWxzZSBpZiBAd2FpdEF0RW5kVGltZSA+IDBcbiAgICAgICAgICAgIEB3YWl0Q291bnRlciA9IEB3YWl0QXRFbmRUaW1lXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJtZXNzYWdlV2FpdGluZ1wiLCB0aGlzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LmV2ZW50cz8uZW1pdChcIm1lc3NhZ2VXYWl0aW5nXCIsIHRoaXMpXG4gICAgICAgICAgICBAY29udGludWUoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBjYXJldCBpbiBwaXhlbHMuIFRoZSBjYXJldCBpcyBsaWtlIGFuIGludmlzaWJsZVxuICAgICogY3Vyc29yIHBvaW50aW5nIHRvIHRoZSB4L3kgY29vcmRpbmF0ZXMgb2YgdGhlIGxhc3QgcmVuZGVyZWQgY2hhcmFjdGVyIG9mXG4gICAgKiB0aGUgbWVzc2FnZS4gVGhhdCBwb3NpdGlvbiBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IGEgd2FpdGluZy0gb3IgcHJvY2Vzc2luZy1hbmltYXRpb24gZm9yIGV4YW1wbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVDYXJldFBvc2l0aW9uXG4gICAgIyMjXG4gICAgdXBkYXRlQ2FyZXRQb3NpdGlvbjogLT4gXG4gICAgICAgIEBjYXJldFBvc2l0aW9uLnggPSBAY3VycmVudFggKyBAcGFkZGluZyAgIFxuICAgICAgICBAY2FyZXRQb3NpdGlvbi55ID0gQGN1cnJlbnRZICsgQGN1cnJlbnRMaW5lSGVpZ2h0LzJcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgbGluZSB3cml0aW5nLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlTGluZVdyaXRpbmdcbiAgICAqIEBwcml2YXRlXG4gICAgIyMjXG4gICAgdXBkYXRlTGluZVdyaXRpbmc6IC0+XG4gICAgICAgIGlmIEBpc1J1bm5pbmcgYW5kICFAaXNXYWl0aW5nIGFuZCAhQHdhaXRGb3JLZXkgYW5kIEB3YWl0Q291bnRlciA8PSAwXG4gICAgICAgICAgICBpZiBAbGluZUFuaW1hdGlvbkNvdW50IDw9IDBcbiAgICAgICAgICAgICAgICBsb29wXG4gICAgICAgICAgICAgICAgICAgIGlmIEBsaW5lIDwgQG1heExpbmVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAbmV4dENoYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIEBsaW5lID49IEBtYXhMaW5lc1xuICAgICAgICAgICAgICAgICAgICAgICAgQGZpbmlzaCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBkcmF3TmV4dCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgdW5sZXNzIChAdG9rZW4uY29kZSBvciBAbGluZUFuaW1hdGlvbkNvdW50IDw9IDAgb3IgQGRyYXdJbW1lZGlhdGVseSkgYW5kIEB3YWl0Rm9yS2V5IGFuZCBAd2FpdENvdW50ZXIgPiAwIGFuZCBAaXNSdW5uaW5nIGFuZCBAbGluZSA8IEBtYXhMaW5lc1xuICAgICAgICAgICAgQGxpbmVBbmltYXRpb25Db3VudC0tXG4gICAgICAgIGlmIEB3YWl0Rm9yS2V5XG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHdhaXRDb3VudGVyID4gMFxuICAgICAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBcbiAgICAgICAgICAgICAgICBAd2FpdENvdW50ZXIgPSAxXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAd2FpdENvdW50ZXItLVxuICAgICAgICAgICAgaWYgQHdhaXRDb3VudGVyIDw9IDBcbiAgICAgICAgICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgICAgICAgICBAY29udGludWUoKSBpZiBAbGluZSA+PSBAbWF4TGluZXNcbiAgICAgICAgICAgICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIHRva2VuLW9iamVjdCBmb3IgYSBzcGVjaWZpZWQgdGV4dC1jb2RlLlxuICAgICogXG4gICAgKiBAbWV0aG9kIGNyZWF0ZVRva2VuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIFRoZSBjb2RlL3R5cGUgb2YgdGhlIHRleHQtY29kZS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSB2YWx1ZSBvZiB0aGUgdGV4dC1jb2RlLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdG9rZW4tb2JqZWN0LlxuICAgICMjI1xuICAgIGNyZWF0ZVRva2VuOiAoY29kZSwgdmFsdWUpIC0+XG4gICAgICAgIHRva2VuT2JqZWN0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGNvZGVcbiAgICAgICAgICAgIHdoZW4gXCJDRVwiXG4gICAgICAgICAgICAgICAgZGF0YSA9IHZhbHVlLnNwbGl0KFwiL1wiKVxuICAgICAgICAgICAgICAgIHZhbHVlID0gZGF0YS5zaGlmdCgpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpZiBpc05hTih2YWx1ZSkgdGhlbiBkYXRhWzBdIGVsc2UgcGFyc2VJbnQodmFsdWUpXG4gICAgICAgICAgICAgICAgZm9yIGkgaW4gWzAuLi5kYXRhXVxuICAgICAgICAgICAgICAgICAgICBpZiBkYXRhW2ldLnN0YXJ0c1dpdGgoJ1wiJykgYW5kIGRhdGFbaV0uZW5kc1dpdGgoJ1wiJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBkYXRhW2ldLnN1YnN0cmluZygxLCBkYXRhW2ldLmxlbmd0aC0xKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldID0gaWYgaXNOYU4oZGF0YVtpXSkgdGhlbiBkYXRhW2ldIGVsc2UgcGFyc2VGbG9hdChkYXRhW2ldKVxuICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0geyBjb2RlOiBjb2RlLCB2YWx1ZTogdmFsdWUsIHZhbHVlczogZGF0YSAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gc3VwZXIoY29kZSwgdmFsdWUpXG4gICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiB0b2tlbk9iamVjdCBcbiAgICAjIyMqXG4gICAgKiA8cD5NZWFzdXJlcyBhIGNvbnRyb2wtdG9rZW4uIElmIGEgdG9rZW4gcHJvZHVjZXMgYSB2aXN1YWwgcmVzdWx0IGxpa2UgZGlzcGxheWluZyBhbiBpY29uIHRoZW4gaXQgbXVzdCByZXR1cm4gdGhlIHNpemUgdGFrZW4gYnlcbiAgICAqIHRoZSB2aXN1YWwgcmVzdWx0LiBJZiB0aGUgdG9rZW4gaGFzIG5vIHZpc3VhbCByZXN1bHQsIDxiPm51bGw8L2I+IG11c3QgYmUgcmV0dXJuZWQuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmb3IgZXZlcnkgdG9rZW4gd2hlbiB0aGUgbWVzc2FnZSBpcyBpbml0aWFsaXplZC48L3A+IFxuICAgICpcbiAgICAqIDxwPlRoaXMgbWV0aG9kIGlzIG5vdCBjYWxsZWQgd2hpbGUgdGhlIG1lc3NhZ2UgaXMgcnVubmluZy4gRm9yIHRoYXQgY2FzZSwgc2VlIDxpPnByb2Nlc3NDb250cm9sVG9rZW48L2k+IG1ldGhvZCB3aGljaCBpcyBjYWxsZWRcbiAgICAqIGZvciBldmVyeSB0b2tlbiB3aGlsZSB0aGUgbWVzc2FnZSBpcyBydW5uaW5nLjwvcD5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gLSBBIGNvbnRyb2wtdG9rZW4uXG4gICAgKiBAcmV0dXJuIHtncy5TaXplfSBUaGUgc2l6ZSBvZiB0aGUgYXJlYSB0YWtlbiBieSB0aGUgdmlzdWFsIHJlc3VsdCBvZiB0aGUgdG9rZW4gb3IgPGI+bnVsbDwvYj4gaWYgdGhlIHRva2VuIGhhcyBubyB2aXN1YWwgcmVzdWx0LlxuICAgICogQG1ldGhvZCBhbmFseXplQ29udHJvbFRva2VuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgbWVhc3VyZUNvbnRyb2xUb2tlbjogKHRva2VuKSAtPiByZXR1cm4gc3VwZXIodG9rZW4pXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIDxwPkRyYXdzIHRoZSB2aXN1YWwgcmVzdWx0IG9mIGEgdG9rZW4sIGxpa2UgYW4gaWNvbiBmb3IgZXhhbXBsZSwgdG8gdGhlIHNwZWNpZmllZCBiaXRtYXAuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmb3IgZXZlcnkgdG9rZW4gd2hlbiB0aGUgbWVzc2FnZSBpcyBpbml0aWFsaXplZCBhbmQgdGhlIHNwcml0ZXMgZm9yIGVhY2hcbiAgICAqIHRleHQtbGluZSBhcmUgY3JlYXRlZC48L3A+IFxuICAgICpcbiAgICAqIDxwPlRoaXMgbWV0aG9kIGlzIG5vdCBjYWxsZWQgd2hpbGUgdGhlIG1lc3NhZ2UgaXMgcnVubmluZy4gRm9yIHRoYXQgY2FzZSwgc2VlIDxpPnByb2Nlc3NDb250cm9sVG9rZW48L2k+IG1ldGhvZCB3aGljaCBpcyBjYWxsZWRcbiAgICAqIGZvciBldmVyeSB0b2tlbiB3aGlsZSB0aGUgbWVzc2FnZSBpcyBydW5uaW5nLjwvcD5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gLSBBIGNvbnRyb2wtdG9rZW4uXG4gICAgKiBAcGFyYW0ge2dzLkJpdG1hcH0gYml0bWFwIC0gVGhlIGJpdG1hcCB1c2VkIGZvciB0aGUgY3VycmVudCB0ZXh0LWxpbmUuIENhbiBiZSB1c2VkIHRvIGRyYXcgc29tZXRoaW5nIG9uIGl0IGxpa2UgYW4gaWNvbiwgZXRjLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCAtIEFuIHgtb2Zmc2V0IGZvciB0aGUgZHJhdy1yb3V0aW5lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIERldGVybWluZXMgaG93IG1hbnkgY2hhcmFjdGVycyBvZiB0aGUgdG9rZW4gc2hvdWxkIGJlIGRyYXduLiBDYW4gYmUgaWdub3JlZCBmb3IgdG9rZW5zXG4gICAgKiBub3QgZHJhd2luZyBhbnkgY2hhcmFjdGVycy5cbiAgICAqIEBtZXRob2QgZHJhd0NvbnRyb2xUb2tlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGRyYXdDb250cm9sVG9rZW46ICh0b2tlbiwgYml0bWFwLCBvZmZzZXQsIGxlbmd0aCkgLT5cbiAgICAgICAgc3dpdGNoIHRva2VuLmNvZGVcbiAgICAgICAgICAgIHdoZW4gXCJSVFwiICMgUnVieSBUZXh0XG4gICAgICAgICAgICAgICAgc3VwZXIodG9rZW4sIGJpdG1hcCwgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICAgICAgICAgICAgXG4gICAgIFxuICAgICMjIypcbiAgICAqIFByb2Nlc3NlcyBhIGNvbnRyb2wtdG9rZW4uIEEgY29udHJvbC10b2tlbiBpcyBhIHRva2VuIHdoaWNoIGluZmx1ZW5jZXNcbiAgICAqIHRoZSB0ZXh0LXJlbmRlcmluZyBsaWtlIGNoYW5naW5nIHRoZSBmb250cyBjb2xvciwgc2l6ZSBvciBzdHlsZS4gQ2hhbmdlcyBcbiAgICAqIHdpbGwgYmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIHRoZSBnYW1lIG9iamVjdCdzIGZvbnQuXG4gICAgKlxuICAgICogRm9yIG1lc3NhZ2UgdGV4dC1yZW5kZXJlciwgYSBmZXcgYWRkaXRpb25hbCBjb250cm9sLXRva2VucyBsaWtlXG4gICAgKiBzcGVlZC1jaGFuZ2UsIHdhaXRpbmcsIGV0Yy4gbmVlZHMgdG8gYmUgcHJvY2Vzc2VkIGhlcmUuXG4gICAgKlxuICAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZvciBlYWNoIHRva2VuIHdoaWxlIHRoZSBtZXNzYWdlIGlzIGluaXRpYWxpemVkIGFuZFxuICAgICogYWxzbyB3aGlsZSB0aGUgbWVzc2FnZSBpcyBydW5uaW5nLiBTZWUgPGk+Zm9ybWF0dGluZ09ubHk8L2k+IHBhcmFtZXRlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gLSBBIGNvbnRyb2wtdG9rZW4uXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcm1hdHRpbmdPbmx5IC0gSWYgPGI+dHJ1ZTwvYj4gdGhlIG1lc3NhZ2UgaXMgaW5pdGlhbGl6aW5nIHJpZ2h0IG5vdyBhbmQgb25seSBcbiAgICAqIGZvcm1hdC10b2tlbnMgc2hvdWxkIGJlIHByb2Nlc3NlZCB3aGljaCBpcyBuZWNlc3NhcnkgZm9yIHRoZSBtZXNzYWdlIHRvIGNhbGN1bGF0ZWQgc2l6ZXMgY29ycmVjdGx5LlxuICAgICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyB0b2tlbiB3aGljaCBpcyBwcm9jZXNzZWQgbmV4dCBvciA8Yj5udWxsPC9iPi5cbiAgICAqIEBtZXRob2QgcHJvY2Vzc0NvbnRyb2xUb2tlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHByb2Nlc3NDb250cm9sVG9rZW46ICh0b2tlbiwgZm9ybWF0dGluZ09ubHkpIC0+XG4gICAgICAgIHJldHVybiBzdXBlcih0b2tlbikgaWYgZm9ybWF0dGluZ09ubHlcbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIHRva2VuLmNvZGVcbiAgICAgICAgICAgIHdoZW4gXCJDRVwiICMgQ2FsbCBDb21tb24gRXZlbnRcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7IFwidmFsdWVzXCI6IHRva2VuLnZhbHVlcyB9XG4gICAgICAgICAgICAgICAgQG9iamVjdC5ldmVudHM/LmVtaXQoXCJjYWxsQ29tbW9uRXZlbnRcIiwgQG9iamVjdCwgeyBjb21tb25FdmVudElkOiBNYXRoLm1heCgwLCB0b2tlbi52YWx1ZSAtIDEpLCBwYXJhbXM6IHBhcmFtcywgZmluaXNoOiBubywgd2FpdGluZzogeWVzIH0pXG4gICAgICAgICAgICB3aGVuIFwiWFwiICMgU2NyaXB0XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWU/KEBvYmplY3QpXG4gICAgICAgICAgICB3aGVuIFwiQVwiICMgUGxheSBBbmltYXRpb25cbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBSZWNvcmRNYW5hZ2VyLmFuaW1hdGlvbnNbTWF0aC5tYXgodG9rZW4udmFsdWUtMSwgMCldXG4gICAgICAgICAgICAgICAgaWYgYW5pbWF0aW9uPy5ncmFwaGljLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgIGJpdG1hcCA9IFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2FuaW1hdGlvbi5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IG5ldyBncy5PYmplY3RfQW5pbWF0aW9uKGFuaW1hdGlvbilcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIEBhZGRDdXN0b21PYmplY3Qob2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudFggKz0gTWF0aC5yb3VuZChiaXRtYXAud2lkdGggLyBhbmltYXRpb24uZnJhbWVzWClcbiAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRTcHJpdGUuc3JjUmVjdC53aWR0aCArPSBNYXRoLnJvdW5kKGJpdG1hcC53aWR0aCAvIGFuaW1hdGlvbi5mcmFtZXNYKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIFwiUlRcIiAjIFJ1YnkgVGV4dFxuICAgICAgICAgICAgICAgIGlmIHRva2VuLnJ0U2l6ZS53aWR0aCA+IHRva2VuLnJiU2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgICAgICBAY3VycmVudFggKz0gdG9rZW4ucnRTaXplLndpZHRoXG4gICAgICAgICAgICAgICAgICAgIEBmb250LnNldChAZ2V0UnVieVRleHRGb250KHRva2VuKSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50WCArPSB0b2tlbi5yYlNpemUud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIFwiTEtcIiAjIExpbmsgICAgICBcbiAgICAgICAgICAgICAgICBpZiB0b2tlbi52YWx1ZSA9PSAnRScgIyBFbmQgTGlua1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QgPSBuZXcgdWkuT2JqZWN0X0hvdHNwb3QoKVxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZW5hYmxlZCA9IHllc1xuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2V0dXAoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgQGFkZEN1c3RvbU9iamVjdChvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHN0UmVjdC54ID0gQG9iamVjdC5kc3RSZWN0LnggKyBAb2JqZWN0Lm9yaWdpbi54ICsgQGN1c3RvbURhdGEubGlua0RhdGEuY3hcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRzdFJlY3QueSA9IEBvYmplY3QuZHN0UmVjdC55ICsgQG9iamVjdC5vcmlnaW4ueSArIEBjdXN0b21EYXRhLmxpbmtEYXRhLmN5XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5kc3RSZWN0LndpZHRoID0gQGN1cnJlbnRYIC0gQGN1c3RvbURhdGEubGlua0RhdGEuY3hcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQGN1cnJlbnRMaW5lSGVpZ2h0XG5cbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV2ZW50cy5vbihcImNsaWNrXCIsIGdzLkNhbGxCYWNrKFwib25MaW5rQ2xpY2tcIiwgdGhpcyksIGxpbmtEYXRhOiBAY3VzdG9tRGF0YS5saW5rRGF0YSwgdGhpcylcbiAgICAgICAgICAgICAgICBlbHNlICMgQmVnaW4gTGlua1xuICAgICAgICAgICAgICAgICAgICBAY3VzdG9tRGF0YS5saW5rRGF0YSA9IHsgY3g6IEBjdXJyZW50WCwgY3k6IEBjdXJyZW50WSwgY29tbW9uRXZlbnRJZDogdG9rZW4udmFsdWUgLSAxLCB0b2tlbkluZGV4OiBAdG9rZW5JbmRleCB9XG4gICAgICAgICAgICB3aGVuIFwiU0xLXCIgIyBTdHlsZWFibGUgTGlua1xuICAgICAgICAgICAgICAgIGlmIHRva2VuLnZhbHVlID09ICdFJyAjIEVuZCBMaW5rXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50U3ByaXRlLmJpdG1hcC5jbGVhclJlY3QoQGN1c3RvbURhdGEubGlua0RhdGEuY3gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGN1c3RvbURhdGEubGlua0RhdGEuY3ksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRYIC0gQGN1c3RvbURhdGEubGlua0RhdGEuY3ggKyBAb2JqZWN0LmZvbnQuYm9yZGVyU2l6ZSoyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50TGluZUhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IEBsaW5lc1tAbGluZV0uY29udGVudFxuICAgICAgICAgICAgICAgICAgICBsaW5rU3RhcnQgPSBAZmluZFRva2VuKEB0b2tlbkluZGV4LTEsIFwiU0xLXCIsIC0xLCBsaW5lKVxuICAgICAgICAgICAgICAgICAgICB0ZXh0VG9rZW5zID0gQGZpbmRUb2tlbnNCZXR3ZWVuKEBjdXN0b21EYXRhLmxpbmtEYXRhLnRva2VuSW5kZXgsIEB0b2tlbkluZGV4LCBudWxsLCBsaW5lKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0ID0gbmV3IHVpLk9iamVjdF9UZXh0KClcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0VG9rZW5zLmpvaW4oXCJcIilcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnNpemVUb0ZpdCA9IHllc1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZm9ybWF0dGluZyA9IHllc1xuICAgICAgICAgICAgICAgICAgICBvYmplY3Qud29yZFdyYXAgPSBub1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QudWkgPSBuZXcgdWkuQ29tcG9uZW50X1VJQmVoYXZpb3IoKVxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZW5hYmxlZCA9IHllc1xuICAgICAgICAgICAgICAgICAgICBvYmplY3QuYWRkQ29tcG9uZW50KG9iamVjdC51aSlcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFkZENvbXBvbmVudChuZXcgZ3MuQ29tcG9uZW50X0hvdHNwb3RCZWhhdmlvcigpKVxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIEBjdXN0b21EYXRhLmxpbmtEYXRhLnN0eWxlSW5kZXggPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpLlVJTWFuYWdlci5hZGRDb250cm9sU3R5bGVzKG9iamVjdCwgW1wiaHlwZXJsaW5rXCJdKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgdWkuVUlNYW5hZ2VyLmFkZENvbnRyb2xTdHlsZXMob2JqZWN0LCBbXCJoeXBlcmxpbmstXCIrQGN1c3RvbURhdGEubGlua0RhdGEuc3R5bGVJbmRleF0pXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Quc2V0dXAoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgQGFkZEN1c3RvbU9iamVjdChvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHN0UmVjdC54ID0gQG9iamVjdC5kc3RSZWN0LnggKyBAb2JqZWN0Lm9yaWdpbi54ICsgQGN1c3RvbURhdGEubGlua0RhdGEuY3hcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmRzdFJlY3QueSA9IEBvYmplY3QuZHN0UmVjdC55ICsgQG9iamVjdC5vcmlnaW4ueSArIEBjdXN0b21EYXRhLmxpbmtEYXRhLmN5XG5cbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmV2ZW50cy5vbihcImNsaWNrXCIsIGdzLkNhbGxCYWNrKFwib25MaW5rQ2xpY2tcIiwgdGhpcyksIGxpbmtEYXRhOiBAY3VzdG9tRGF0YS5saW5rRGF0YSwgdGhpcylcbiAgICAgICAgICAgICAgICBlbHNlICMgQmVnaW4gTGlua1xuICAgICAgICAgICAgICAgICAgICBpZiBpc05hTih0b2tlbi52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRva2VuLnZhbHVlLnNwbGl0KFwiLFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGN1c3RvbURhdGEubGlua0RhdGEgPSB7IGN4OiBAY3VycmVudFgsIGN5OiBAY3VycmVudFksIGNvbW1vbkV2ZW50SWQ6IHBhcnNlSW50KHZhbHVlc1swXSkgLSAxLCBzdHlsZUluZGV4OiBwYXJzZUludCh2YWx1ZXNbMV0pLCB0b2tlbkluZGV4OiBAdG9rZW5JbmRleCB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjdXN0b21EYXRhLmxpbmtEYXRhID0geyBjeDogQGN1cnJlbnRYLCBjeTogQGN1cnJlbnRZLCBjb21tb25FdmVudElkOiB0b2tlbi52YWx1ZSAtIDEsIHRva2VuSW5kZXg6IEB0b2tlbkluZGV4LCBzdHlsZUluZGV4OiAtMSB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hlbiBcIkVcIiAjIENoYW5nZSBFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyRXhwcmVzc2lvbnNbTWF0aC5tYXgodG9rZW4udmFsdWUtMSwgMCldXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmN1cnJlbnRDaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBpZiBleHByZXNzaW9uPyBhbmQgY2hhcmFjdGVyPy5pbmRleD9cbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5jaGFyYWN0ZXIuZXhwcmVzc2lvbkR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChHYW1lTWFuYWdlci5kZWZhdWx0cy5jaGFyYWN0ZXIuY2hhbmdlRWFzaW5nKVxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5jaGFyYWN0ZXIuY2hhbmdlQW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IFNjZW5lTWFuYWdlci5zY2VuZS5jaGFyYWN0ZXJzLmZpcnN0IChjKSAtPiBjLnJpZCA9PSBjaGFyYWN0ZXIuaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Py5iZWhhdmlvci5jaGFuZ2VFeHByZXNzaW9uKGV4cHJlc3Npb24sIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbilcbiAgXG4gICAgICAgICAgICB3aGVuIFwiU1BcIiAjIFBsYXkgU291bmRcbiAgICAgICAgICAgICAgICBzb3VuZCA9IFJlY29yZE1hbmFnZXIuc3lzdGVtLnNvdW5kc1t0b2tlbi52YWx1ZS0xXVxuICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5U291bmQoc291bmQpXG4gICAgICAgICAgICB3aGVuIFwiU1wiICMgQ2hhbmdlIFNwZWVkXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2V0dGluZ3MubWVzc2FnZVNwZWVkID0gdG9rZW4udmFsdWVcbiAgICAgICAgICAgIHdoZW4gXCJXXCIgIyBXYWl0XG4gICAgICAgICAgICAgICAgQGRyYXdJbW1lZGlhdGVseSA9IG5vXG4gICAgICAgICAgICAgICAgaWYgIUdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICAgICAgICAgIGlmIHRva2VuLnZhbHVlID09IFwiQVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBAd2FpdEZvcktleSA9IHllc1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAd2FpdENvdW50ZXIgPSBNYXRoLnJvdW5kKHRva2VuLnZhbHVlIC8gMTAwMCAqIEdyYXBoaWNzLmZyYW1lUmF0ZSlcbiAgICAgICAgICAgIHdoZW4gXCJXRVwiICMgV2FpdCBhdCBFbmRcbiAgICAgICAgICAgICAgICBAd2FpdEF0RW5kID0gdG9rZW4udmFsdWUgPT0gXCJZXCJcbiAgICAgICAgICAgIHdoZW4gXCJESVwiICMgRHJhdyBJbW1lZGlhbHR5XG4gICAgICAgICAgICAgICAgQGRyYXdJbW1lZGlhdGVseSA9IHRva2VuLnZhbHVlID09IDEgIyBEcmF3IGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gc3VwZXIodG9rZW4pXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0ICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDbGVhcnMvUmVzZXRzIHRoZSB0ZXh0LXJlbmRlcmVyLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2xlYXJcbiAgICAjIyNcbiAgICBjbGVhcjogLT5cbiAgICAgICAgQGNoYXJJbmRleCA9IDBcbiAgICAgICAgQGN1cnJlbnRYID0gMFxuICAgICAgICBAY3VycmVudFkgPSAwXG4gICAgICAgIEBsaW5lID0gMFxuICAgICAgICBAbGluZXMgPSBbXVxuICAgICAgICBAY2xlYXJDdXN0b21PYmplY3RzKClcbiAgICAgICAgQG9iamVjdC5iaXRtYXA/LmNsZWFyKClcbiAgICAgICAgXG4gICAgICAgIGZvciBzcHJpdGUgaW4gQGFsbFNwcml0ZXNcbiAgICAgICAgICAgIHNwcml0ZS5kaXNwb3NlKClcbiAgICAgICAgICAgIHNwcml0ZS5iaXRtYXA/LmRpc3Bvc2UoKVxuICAgICAgICBAYWxsU3ByaXRlcyA9IFtdXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2xlYXJzL0Rpc3Bvc2VzIGFsbCBzcHJpdGVzIHVzZWQgdG8gZGlzcGxheSB0aGUgdGV4dC1saW5lcy9wYXJ0cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNsZWFyQWxsU3ByaXRlc1xuICAgICMjI1xuICAgIGNsZWFyQWxsU3ByaXRlczogLT5cbiAgICAgICAgZm9yIHNwcml0ZSBpbiBAYWxsU3ByaXRlc1xuICAgICAgICAgICAgc3ByaXRlLmRpc3Bvc2UoKVxuICAgICAgICAgICAgc3ByaXRlLmJpdG1hcD8uZGlzcG9zZSgpXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDbGVhcnMvRGlzcG9zZXMgdGhlIHNwcml0ZXMgdXNlZCB0byBkaXNwbGF5IHRoZSB0ZXh0LWxpbmVzL3BhcnRzIG9mIHRoZSBjdXJyZW50L2xhc3QgbWVzc2FnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNsZWFyU3ByaXRlc1xuICAgICMjIyAgICAgICAgXG4gICAgY2xlYXJTcHJpdGVzOiAtPlxuICAgICAgICBmb3Igc3ByaXRlIGluIEBzcHJpdGVzXG4gICAgICAgICAgICBzcHJpdGUuZGlzcG9zZSgpXG4gICAgICAgICAgICBzcHJpdGUuYml0bWFwPy5kaXNwb3NlKClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIEFkZHMgYSBnYW1lIG9iamVjdCB0byB0aGUgbWVzc2FnZSB3aGljaCBpcyBhbGl2ZSB1bnRpbCB0aGUgbWVzc2FnZSBpc1xuICAgICogZXJhc2VkLiBDYW4gYmUgdXNlZCB0byBkaXNwbGF5IGFuaW1hdGlvbmVkLWljb25zLCBldGMuIGluIGEgbWVzc2FnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZEN1c3RvbU9iamVjdFxuICAgICogQHBhcmFtIG9iamVjdCB7T2JqZWN0fSBUaGUgZ2FtZSBvYmplY3QgdG8gYWRkLlxuICAgICMjI1xuICAgIGFkZEN1c3RvbU9iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgb2JqZWN0LmRzdFJlY3QueCA9IEBvYmplY3QuZHN0UmVjdC54ICsgQG9iamVjdC5vcmlnaW4ueCArIEBjdXJyZW50WFxuICAgICAgICBvYmplY3QuZHN0UmVjdC55ID0gQG9iamVjdC5kc3RSZWN0LnkgKyBAb2JqZWN0Lm9yaWdpbi55ICsgQGN1cnJlbnRZXG4gICAgICAgIG9iamVjdC56SW5kZXggPSBAb2JqZWN0LnpJbmRleCArIDFcbiAgICAgICAgb2JqZWN0LnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuYWRkT2JqZWN0KG9iamVjdClcbiAgICAgICAgQGN1c3RvbU9iamVjdHMucHVzaChvYmplY3QpXG4gICAgIFxuICAgICMjIypcbiAgICAqIENsZWFycyB0aGUgbGlzdCBvZiBjdXN0b20gZ2FtZSBvYmplY3RzLiBBbGwgZ2FtZSBvYmplY3RzIGFyZSBkaXNwb3NlZCBhbmQgcmVtb3ZlZFxuICAgICogZnJvbSB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRDdXN0b21PYmplY3RcbiAgICAqIEBwYXJhbSBvYmplY3Qge09iamVjdH0gVGhlIGdhbWUgb2JqZWN0IHRvIGFkZC5cbiAgICAjIyMgICBcbiAgICBjbGVhckN1c3RvbU9iamVjdHM6IC0+XG4gICAgICAgIGZvciBvYmplY3QgaW4gQGN1c3RvbU9iamVjdHNcbiAgICAgICAgICAgIG9iamVjdC5kaXNwb3NlKClcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5yZW1vdmVPYmplY3Qob2JqZWN0KVxuICAgICAgICAgICAgXG4gICAgICAgIEBjdXN0b21PYmplY3RzID0gW11cbiAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIHRoZSBiaXRtYXAgZm9yIGEgc3BlY2lmaWVkIGxpbmUtb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlQml0bWFwXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBBIGxpbmUtb2JqZWN0LlxuICAgICogQHJldHVybiB7Qml0bWFwfSBBIG5ld2x5IGNyZWF0ZWQgYml0bWFwIGNvbnRhaW5pbmcgdGhlIGxpbmUtdGV4dC5cbiAgICAjIyNcbiAgICBjcmVhdGVCaXRtYXA6IChsaW5lKSAtPlxuICAgICAgICBAZm9udCA9IEBvYmplY3QuZm9udFxuICAgICAgICBiaXRtYXAgPSBuZXcgQml0bWFwKEBvYmplY3QuZHN0UmVjdC53aWR0aCwgTWF0aC5tYXgoQG1pbkxpbmVIZWlnaHQsIGxpbmUuaGVpZ2h0KSlcbiAgICAgICAgYml0bWFwLmZvbnQgPSBAZm9udFxuICAgICAgIFxuICAgICAgICByZXR1cm4gYml0bWFwXG4gICAgXG4gICAgIyMjKlxuICAgICogRHJhd3MgdGhlIGxpbmUncyBjb250ZW50IG9uIHRoZSBzcGVjaWZpZWQgYml0bWFwLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHJhd0xpbmVDb250ZW50XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIEEgbGluZS1vYmplY3Qgd2hpY2ggc2hvdWxkIGJlIGRyYXduIG9uIHRoZSBiaXRtYXAuXG4gICAgKiBAcGFyYW0ge2dzLkJpdG1hcH0gYml0bWFwIC0gVGhlIGJpdG1hcCB0byBkcmF3IHRoZSBsaW5lJ3MgY29udGVudCBvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBEZXRlcm1pbmVzIGhvdyBtYW55IGNoYXJhY3RlcnMgb2YgdGhlIHNwZWNpZmllZCBsaW5lIHNob3VsZCBiZSBkcmF3bi4gWW91IGNhbiBcbiAgICAqIHNwZWNpZnkgLTEgdG8gZHJhdyBhbGwgY2hhcmFjdGVycy5cbiAgICAjIyNcbiAgICBkcmF3TGluZUNvbnRlbnQ6IChsaW5lLCBiaXRtYXAsIGxlbmd0aCkgLT5cbiAgICAgICAgYml0bWFwLmNsZWFyKClcbiAgICAgICAgY3VycmVudFggPSBAcGFkZGluZ1xuICAgICAgICBkcmF3QWxsID0gbGVuZ3RoID09IC0xXG4gICAgICAgIFxuICAgICAgICBmb3IgdG9rZW4sIGkgaW4gbGluZS5jb250ZW50XG4gICAgICAgICAgICBicmVhayBpZiBpID4gQHRva2VuSW5kZXggYW5kICFkcmF3QWxsXG4gICAgICAgICAgICBpZiB0b2tlbi5jb2RlP1xuICAgICAgICAgICAgICAgIHNpemUgPSBAbWVhc3VyZUNvbnRyb2xUb2tlbih0b2tlbiwgYml0bWFwKVxuICAgICAgICAgICAgICAgIEBkcmF3Q29udHJvbFRva2VuKHRva2VuLCBiaXRtYXAsIGN1cnJlbnRYKVxuICAgICAgICAgICAgICAgIGlmIHNpemUgdGhlbiBjdXJyZW50WCArPSBzaXplLndpZHRoXG4gICAgICAgICAgICAgICAgQHByb2Nlc3NDb250cm9sVG9rZW4odG9rZW4sIHllcywgbGluZSlcbiAgICAgICAgICAgIGVsc2UgaWYgdG9rZW4udmFsdWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIHRva2VuLmFwcGx5Rm9ybWF0KEBmb250KVxuICAgICAgICAgICAgICAgIHZhbHVlID0gdG9rZW4udmFsdWVcbiAgICAgICAgICAgICAgICBpZiAhZHJhd0FsbCBhbmQgQHRva2VuSW5kZXggPT0gaSBhbmQgdmFsdWUubGVuZ3RoID4gbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlbmd0aClcbiAgICAgICAgICAgICAgICBpZiB2YWx1ZSAhPSBcIlxcblwiXG4gICAgICAgICAgICAgICAgICAgIHNpemUgPSBAZm9udC5tZWFzdXJlVGV4dFBsYWluKHZhbHVlKSAgXG4gICAgICAgICAgICAgICAgICAgIGJpdG1hcC5kcmF3VGV4dChjdXJyZW50WCwgbGluZS5oZWlnaHQgLSAoc2l6ZS5oZWlnaHQgLSBAZm9udC5kZXNjZW50KSAtIGxpbmUuZGVzY2VudCwgc2l6ZS53aWR0aCwgYml0bWFwLmhlaWdodCwgdmFsdWUsIDAsIDApXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRYICs9IHNpemUud2lkdGhcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgbGluZS5jb250ZW50V2lkdGggPSBjdXJyZW50WCArIEBmb250Lm1lYXN1cmVUZXh0UGxhaW4oXCIgXCIpLndpZHRoICAgXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgdGhlIHNwcml0ZSBmb3IgYSBzcGVjaWZpZWQgbGluZS1vYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVTcHJpdGVcbiAgICAqIEBwcml2YXRlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIEEgbGluZS1vYmplY3QuXG4gICAgKiBAcmV0dXJuIHtTcHJpdGV9IEEgbmV3bHkgY3JlYXRlZCBzcHJpdGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGxpbmUtdGV4dCBhcyBiaXRtYXAuXG4gICAgIyMjXG4gICAgY3JlYXRlU3ByaXRlOiAobGluZSkgLT5cbiAgICAgICAgYml0bWFwID0gQGNyZWF0ZUJpdG1hcChsaW5lKVxuICAgICAgICBcbiAgICAgICAgQGN1cnJlbnRYID0gMFxuICAgICAgICBAd2FpdENvdW50ZXIgPSAwXG4gICAgICAgIEB3YWl0Rm9yS2V5ID0gbm9cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3ByaXRlID0gbmV3IFNwcml0ZShHcmFwaGljcy52aWV3cG9ydClcbiAgICAgICAgc3ByaXRlLmJpdG1hcCA9IGJpdG1hcFxuICAgICAgICBzcHJpdGUudmlzaWJsZSA9IHllc1xuICAgICAgICBzcHJpdGUueiA9IEBvYmplY3QuekluZGV4ICsgMVxuICAgICAgICBcbiAgICAgICAgc3ByaXRlLnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCAwLCBiaXRtYXAuaGVpZ2h0KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNwcml0ZVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIHRoZSBzcHJpdGVzIGZvciBhIHNwZWNpZmllZCBhcnJheSBvZiBsaW5lLW9iamVjdHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVTcHJpdGVzXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHNlZSBncy5Db21wb25lbnRfTWVzc2FnZVRleHRSZW5kZXJlci5jcmVhdGVTcHJpdGUuXG4gICAgKiBAcGFyYW0ge0FycmF5fSBsaW5lcyAtIEFuIGFycmF5IG9mIGxpbmUtb2JqZWN0cy5cbiAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBzcHJpdGVzLlxuICAgICMjI1xuICAgIGNyZWF0ZVNwcml0ZXM6IChsaW5lcykgLT5cbiAgICAgICAgQGZvbnRTaXplID0gQG9iamVjdC5mb250LnNpemVcbiAgICAgICAgcmVzdWx0ID0gW11cbiAgICAgICAgZm9yIGxpbmUsIGkgaW4gbGluZXNcbiAgICAgICAgICAgIHNwcml0ZSA9IEBjcmVhdGVTcHJpdGUobGluZSlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNwcml0ZSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyBhIG5ldyBsaW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgbmV3TGluZVxuICAgICMjI1xuICAgIG5ld0xpbmU6IC0+XG4gICAgICAgIEBjdXJyZW50WCA9IDBcbiAgICAgICAgQGN1cnJlbnRZICs9IEBjdXJyZW50TGluZUhlaWdodCArIEBsaW5lU3BhY2luZ1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwbGF5cyBhIGZvcm1hdHRlZCB0ZXh0IGltbWVkaWF0ZWx5IHdpdGhvdXQgYW55IGRlbGF5cyBvciBhbmltYXRpb25zLiBUaGVcbiAgICAqIENvbXBvbmVudF9UZXh0UmVuZGVyZXIuZHJhd0Zvcm1hdHRlZFRleHQgbWV0aG9kIGZyb20gdGhlIGJhc2UtY2xhc3MgY2Fubm90XG4gICAgKiBiZSB1c2VkIGhlcmUgYmVjYXVzZSBpdCB3b3VsZCByZW5kZXIgdG8gdGhlIGdhbWUgb2JqZWN0J3MgYml0bWFwIG9iamVjdCB3aGlsZVxuICAgICogdGhpcyBtZXRob2QgaXMgcmVuZGVyaW5nIHRvIHRoZSBzcHJpdGVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHJhd0Zvcm1hdHRlZFRleHRJbW1lZGlhdGVseVxuICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeC1jb29yZGluYXRlIG9mIHRoZSB0ZXh0J3MgcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5LWNvb3JkaW5hdGUgb2YgdGhlIHRleHQncyBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIERlcHJlY2F0ZWQuIENhbiBiZSBudWxsLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIERlcHJlY2F0ZWQuIENhbiBiZSBudWxsLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkcmF3LlxuICAgICogQHBhcmFtIHtib29sZWFufSB3b3JkV3JhcCAtIElmIHdvcmRXcmFwIGlzIHNldCB0byB0cnVlLCBsaW5lLWJyZWFrcyBhcmUgYXV0b21hdGljYWxseSBjcmVhdGVkLlxuICAgICMjI1xuICAgIGRyYXdGb3JtYXR0ZWRUZXh0SW1tZWRpYXRlbHk6ICh4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0ZXh0LCB3b3JkV3JhcCkgLT5cbiAgICAgICAgQGRyYXdGb3JtYXR0ZWRUZXh0KHgsIHksIHdpZHRoLCBoZWlnaHQsIHRleHQsIHdvcmRXcmFwKVxuICAgICAgICBcbiAgICAgICAgbG9vcFxuICAgICAgICAgICAgQG5leHRDaGFyKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBsaW5lID49IEBtYXhMaW5lc1xuICAgICAgICAgICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBkcmF3TmV4dCgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBicmVhayB1bmxlc3MgQGlzUnVubmluZ1xuICAgICAgICAgICAgXG4gICAgICAgIEBjdXJyZW50WSArPSBAY3VycmVudExpbmVIZWlnaHQgKyBAbGluZVNwYWNpbmdcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0cyB0aGUgcmVuZGVyaW5nLXByb2Nlc3MgZm9yIHRoZSBtZXNzYWdlLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHJhd0Zvcm1hdHRlZFRleHRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgdGV4dCdzIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSB0ZXh0J3MgcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBEZXByZWNhdGVkLiBDYW4gYmUgbnVsbC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBEZXByZWNhdGVkLiBDYW4gYmUgbnVsbC5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZHJhdy5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd29yZFdyYXAgLSBJZiB3b3JkV3JhcCBpcyBzZXQgdG8gdHJ1ZSwgbGluZS1icmVha3MgYXJlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZC5cbiAgICAjIyNcbiAgICBkcmF3Rm9ybWF0dGVkVGV4dDogKHgsIHksIHdpZHRoLCBoZWlnaHQsIHRleHQsIHdvcmRXcmFwKSAtPlxuICAgICAgICB0ZXh0ID0gdGV4dCB8fCBcIiBcIiAjIFVzZSBhIHNwYWNlIGNoYXJhY3RlciBpZiBubyB0ZXh0IGlzIHNwZWNpZmllZC5cbiAgICAgICAgQGZvbnQuc2V0KEBvYmplY3QuZm9udClcbiAgICAgICAgQHNwZWVkID0gMTEgLSBNYXRoLnJvdW5kKEdhbWVNYW5hZ2VyLnNldHRpbmdzLm1lc3NhZ2VTcGVlZCAqIDIuNSlcbiAgICAgICAgQGlzUnVubmluZyA9IHllc1xuICAgICAgICBAZHJhd0ltbWVkaWF0ZWx5ID0gbm9cbiAgICAgICAgQGxpbmVBbmltYXRpb25Db3VudCA9IEBzcGVlZFxuICAgICAgICBAY3VycmVudExpbmVIZWlnaHQgPSAwXG4gICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICBAd2FpdEZvcktleSA9IG5vXG4gICAgICAgIEBjaGFySW5kZXggPSAwXG4gICAgICAgIEB0b2tlbiA9IG51bGxcbiAgICAgICAgQHRva2VuSW5kZXggPSAwXG4gICAgICAgIEBtZXNzYWdlID0gdGV4dFxuICAgICAgICBAbGluZSA9IDBcbiAgICAgICAgQGN1cnJlbnRMaW5lID0gQGxpbmVcbiAgICAgICAgY3VycmVudFggPSBAY3VycmVudFhcbiAgICAgICAgQGxpbmVzID0gQGNhbGN1bGF0ZUxpbmVzKGxjc20oQG1lc3NhZ2UpLCB3b3JkV3JhcCwgQGN1cnJlbnRYKVxuICAgICAgICBAc3ByaXRlcyA9IEBjcmVhdGVTcHJpdGVzKEBsaW5lcylcbiAgICAgICAgQGFsbFNwcml0ZXMgPSBAYWxsU3ByaXRlcy5jb25jYXQoQHNwcml0ZXMpXG4gICAgICAgIEBjdXJyZW50WCA9IGN1cnJlbnRYXG4gICAgICAgIEBjdXJyZW50U3ByaXRlID0gQHNwcml0ZXNbQGxpbmVdXG4gICAgICAgIEBjdXJyZW50U3ByaXRlLnggPSBAY3VycmVudFggKyBAb2JqZWN0Lm9yaWdpbi54ICsgQG9iamVjdC5kc3RSZWN0LnhcbiAgICAgICAgQG1heExpbmVzID0gQGNhbGN1bGF0ZU1heExpbmVzKEBsaW5lcylcbiAgICAgICAgQHRva2VuID0gQGxpbmVzW0BsaW5lXT8uY29udGVudFtAdG9rZW5JbmRleF0gfHwgbmV3IGdzLlJlbmRlcmVyVG9rZW4obnVsbCwgXCJcIilcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBAc3RhcnQoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTdGFydHMgdGhlIG1lc3NhZ2UtcmVuZGVyaW5nIHByb2Nlc3MuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdGFydFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgc3RhcnQ6IC0+XG4gICAgICAgIGlmIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWUgPT0gMFxuICAgICAgICAgICAgQGluc3RhbnRTa2lwKClcbiAgICAgICAgZWxzZSBpZiBAbWF4TGluZXMgPT0gMFxuICAgICAgICAgICAgIyBJZiBmaXJzdCBsaW5lIGlzIGVtcHR5IHRoZW4gaXQgZG9lc24ndCBmaXQgaW50byBjdXJyZW50IGxpbmUsIHNvIGZpbmlzaC5cbiAgICAgICAgICAgIGlmIEBsaW5lc1swXT8uY29udGVudCA9PSBcIlwiXG4gICAgICAgICAgICAgICAgQGZpbmlzaCgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQG1heExpbmVzID0gMVxuICAgICAgICAgICAgICAgIEBkcmF3TmV4dCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkcmF3TmV4dCgpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNraXBzIHRoZSBjdXJyZW50IG1lc3NhZ2UgYW5kIGZpbmlzaGVzIHRoZSBtZXNzYWdlLXByb2Nlc3NpbmcgaW1tZWRpYXRlbHkuIFRoZSBtZXNzYWdlXG4gICAgKiB0b2tlbnMgYXJlIHByb2Nlc3NlZCBidXQgbm90IHJlbmRlcmVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgaW5zdGFudFNraXBcbiAgICAjIyMgIFxuICAgIGluc3RhbnRTa2lwOiAtPlxuICAgICAgICBsb29wXG4gICAgICAgICAgICBpZiBAbGluZSA8IEBtYXhMaW5lc1xuICAgICAgICAgICAgICAgIEBuZXh0Q2hhcigpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBAbGluZSA+PSBAbWF4TGluZXNcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBwcm9jZXNzVG9rZW4oKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgYnJlYWsgdW5sZXNzIEBpc1J1bm5pbmcgYW5kIEBsaW5lIDwgQG1heExpbmVzXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LmV2ZW50cz8uZW1pdChcIm1lc3NhZ2VXYWl0aW5nXCIsIHRoaXMpXG4gICAgICAgIEBjb250aW51ZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFByb2Nlc3NlcyB0aGUgY3VycmVudCB0b2tlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHByb2Nlc3NUb2tlblxuICAgICMjIyAgICBcbiAgICBwcm9jZXNzVG9rZW46IC0+XG4gICAgICAgIHRva2VuID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgQHRva2VuLmNvZGU/XG4gICAgICAgICAgICB0b2tlbiA9IEBwcm9jZXNzQ29udHJvbFRva2VuKEB0b2tlbiwgbm8pXG4gICAgICAgICAgICBpZiB0b2tlbj9cbiAgICAgICAgICAgICAgICBAdG9rZW4gPSB0b2tlblxuICAgICAgICAgICAgICAgIEB0b2tlbi5vblN0YXJ0PygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRva2VuID0gQHRva2VuXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRva2VuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG5ncy5Db21wb25lbnRfTWVzc2FnZVRleHRSZW5kZXJlciA9IENvbXBvbmVudF9NZXNzYWdlVGV4dFJlbmRlcmVyIl19
//# sourceURL=Component_MessageTextRenderer_127.js