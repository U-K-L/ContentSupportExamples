
/**
* An enumeration of game message modes.
*
* ADV - Adventure Mode
* NVL - Novel Mode
*
* @typedef MessageMode
* @memberof vn
 */
var Component_MessageBehavior, MessageMode,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MessageMode = (function() {
  function MessageMode() {}

  MessageMode.ADV = 0;

  MessageMode.NVL = 1;

  return MessageMode;

})();

vn.MessageMode = MessageMode;

Component_MessageBehavior = (function(superClass) {
  extend(Component_MessageBehavior, superClass);

  Component_MessageBehavior.objectCodecBlackList = ["onMessageWaiting", "onMessageFinish"];


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_MessageBehavior.prototype.onDataBundleRestore = function(data, context) {
    this.tempSettings = GameManager.tempSettings;
    return this.setupEventHandlers();
  };


  /**
  * A behavior-component to define the behavior of a game-message.
  *
  * @module vn
  * @class Component_MessageBehavior
  * @extends gs.Component
  * @memberof vn
  * @constructor
   */

  function Component_MessageBehavior() {

    /**
    * Reference to game settings.
    * @property settings
    * @type Object
    * @protected
     */
    this.settings = GameManager.settings;

    /**
    * Reference to temporary game settings.
    * @property settings
    * @type Object
    * @protected
     */
    this.tempSettings = GameManager.tempSettings;

    /**
    * Indicates if the message is currently waiting.
    * @property isWaiting
    * @type boolean
    * @readOnly
     */
    this.isWaiting = false;

    /**
    * Indicates if the message is currently running.
    * @property isRunning
    * @type boolean
    * @readOnly
     */
    this.isRunning = false;

    /**
    * Indicates if a voice is currently playing together with the message.
    * @property isVoicePlaying
    * @type boolean
    * @readOnly
     */
    this.isVoicePlaying = false;

    /**
    * Current message caret/cursor position.
    * @property caretPosition
    * @type gs.Point
    * @readOnly
     */
    this.caretPosition = new gs.Point(0, 0);

    /**
    * Current raw message text.
    * @property message
    * @type string
    * @readOnly
     */
    this.message = "";

    /**
    * All currently displayed raw messages.
    * @property messages
    * @type string[]
    * @readOnly
     */
    this.messages = [];

    /**
    * Voice associated with the current message.
    * @property voice
    * @type gs.AudioBufferReference
     */
    this.voice = null;

    /**
    * Indicates if current message is partial. DEPRECATED. Please do not use.
    * @property partial
    * @deprecated
    * @type boolean
    * @readOnly
     */
    this.partial = false;

    /**
    * Indicates if the message is currently waiting in live-preview.
    * @property waitingPreview
    * @type boolean
    * @readOnly
     */
    this.waitingPreview = false;

    /**
    * Indicates if the auto-message is enabled.
    * @property autoMessageEnabled
    * @type boolean
    * @readOnly
     */
    this.autoMessageEnabled = false;
    this.onMessageFinish = (function(_this) {
      return function(sender) {
        _this.object.events.emit("finish", _this);
        if (_this.object.settings.autoErase || _this.object.settings.paragraphSpacing > 0) {
          return _this.message = "";
        }
      };
    })(this);
    this.onMessageWaiting = (function(_this) {
      return function(sender) {
        if (!_this.object.textRenderer.isBatched() || !_this.object.textRenderer.isBatchInProgress()) {
          _this.object.textRenderer.waitAtEnd = !_this.partial;
          return _this.object.events.emit("waiting", _this);
        }
      };
    })(this);
  }


  /**
  * Adds event-handlers
  *
  * @method setupEventHandlers
   */

  Component_MessageBehavior.prototype.setupEventHandlers = function() {
    this.object.events.offByOwner("messageFinish", this);
    this.object.events.offByOwner("messageWaiting", this);
    this.object.events.on("messageFinish", gs.CallBack("onMessageFinish", this), null, this);
    this.object.events.on("messageWaiting", gs.CallBack("onMessageWaiting", this), null, this);
    gs.GlobalEventManager.offByOwner("previewWaiting", this);
    gs.GlobalEventManager.offByOwner("previewRestart", this);
    gs.GlobalEventManager.on("previewWaiting", ((function(_this) {
      return function(sender) {
        return _this.waitingPreview = true;
      };
    })(this)), null, this);
    return gs.GlobalEventManager.on("previewRestart", ((function(_this) {
      return function(sender) {
        return _this.waitingPreview = false;
      };
    })(this)), null, this);
  };


  /**
  * Setup the component. Adds event handlers.
  *
  * @method setup
   */

  Component_MessageBehavior.prototype.setup = function() {
    return this.setupEventHandlers();
  };


  /**
  * Disposes the component.
  *
  * @method toDataBundle
   */

  Component_MessageBehavior.prototype.dispose = function() {
    Component_MessageBehavior.__super__.dispose.apply(this, arguments);
    gs.GlobalEventManager.offByOwner("previewWaiting", this);
    return gs.GlobalEventManager.offByOwner("previewRestart", this);
  };


  /**
  * Not implemented yet.
  *
  * @method toDataBundle
   */

  Component_MessageBehavior.prototype.toDataBundle = function() {};


  /**
  * Not implemented yet.
  *
  * @method restore
  * @param {Object} bundle - A data bundle.
   */

  Component_MessageBehavior.prototype.restore = function(bundle) {};


  /**
  * Action to show a game message.
  *
  * @method showMessage
  * @param {Object} sender - The sender of this action.
  * @param {Object} params - An object containing the necessary parameters.
   */

  Component_MessageBehavior.prototype.showMessage = function(sender, params) {
    gs.GameNotifier.postContextChange(lcsm(params.message));
    this.partial = params.partial;
    this.message += lcsm(params.message);
    this.addMessage(params.message, RecordManager.characters[params.characterId], this.object.settings.paragraphSpacing > 0, !this.partial);
    if (this.object.textRenderer.isBatched()) {
      return this.object.textRenderer.waitAtEnd = true;
    } else {
      return this.object.textRenderer.waitAtEnd = !this.partial;
    }
  };


  /**
  * Deprecated. Not longer used.
  *
  * @method updateBitmap
   */

  Component_MessageBehavior.prototype.updateBitmap = function() {
    var ref;
    if (!this.object.bitmap || this.object.bitmap.width !== this.object.dstRect.width || this.object.bitmap.height !== this.object.dstRect.height) {
      if ((ref = this.object.bitmap) != null) {
        ref.dispose();
      }
      this.object.bitmap = new Bitmap(this.object.dstRect.width, this.object.dstRect.height);
      return this.object.bitmap.font = this.object.font;
    }
  };


  /**
  * Restores a NVL game message of an array of message-objects. That is
  * necessary to restore a NVL game message from a save-game.
  *
  * @method restoreMessages
  * @param {Array} messages - An array of messages to restore.
   */

  Component_MessageBehavior.prototype.restoreMessages = function(messages) {
    var i, len, message, ref, ref1;
    this.updateBitmap();
    this.clear();
    this.object.opacity = 255;
    this.object.srcRect = new Rect(0, 0, this.object.dstRect.width, this.object.dstRect.height);
    for (i = 0, len = messages.length; i < len; i++) {
      message = messages[i];
      this.object.font.color = new Color(((ref = message.character) != null ? ref.textColor : void 0) || Color.WHITE);
      this.object.textRenderer.drawFormattedTextImmediately(0, 0, this.object.dstRect.width, this.object.dstRect.height, lcsm((ref1 = message.text) != null ? ref1 : message), true);
    }
    return null;
  };


  /**
  * Adds a new message.
  * 
  * @method addMessage
  * @param {string} message - The message.
  * @param {Object} character - Database-Record of a character.
  * @param {boolean} newLine - Indicates if the message should make a line break.
   */

  Component_MessageBehavior.prototype.addMessage = function(message, character, newLine, waitAtEnd) {
    this.object.textRenderer.partialMessage = null;
    this.object.offset = {
      x: 0,
      y: 0
    };
    this.object.visible = true;
    this.object.messages.push({
      text: message,
      character: character
    });
    this.object.textRenderer.waitAtEnd = waitAtEnd;
    if (!this.object.settings.autoErase) {
      this.object.textRenderer.currentY += this.object.settings.paragraphSpacing;
    }
    if (newLine) {
      this.object.textRenderer.newLine();
    }
    this.updateBitmap();
    if ((character != null) && this.object.settings.useCharacterColor) {
      this.object.font.color = new Color((character != null ? character.textColor : void 0) || Color.WHITE);
    }
    this.object.opacity = 255;
    this.object.srcRect = new Rect(0, 0, this.object.dstRect.width, this.object.dstRect.height);
    this.update();
    return this.object.textRenderer.drawFormattedText(0, 0, this.object.dstRect.width, this.object.dstRect.height, message, true);
  };


  /**
  * Clears the game message by deleting/clearing all messages.
  *
  * @method clear
   */

  Component_MessageBehavior.prototype.clear = function() {
    this.object.textRenderer.clear();
    this.object.messages = [];
    return this.message = "";
  };


  /**
  * Closes the game message by making it invisible.
  *
  * @method close
   */

  Component_MessageBehavior.prototype.close = function() {
    return this.object.visible = false;
  };


  /**
  * Gets the duration of an associated voice or 0 if no voice is associated.
  *
  * @method voiceDuration
  * @return {number} The duration in frames.
   */

  Component_MessageBehavior.prototype.voiceDuration = function() {
    var duration;
    duration = 0;
    if ((this.voice != null) && (this.settings.autoMessage.waitForVoice || this.settings.timeMessageToVoice)) {
      duration = Math.round((this.voice.source.buffer.duration * (1.0 / this.voice.source.playbackRate.value)) * 1000 / 16.6);
    } else {
      duration = 0;
    }
    if (this.tempSettings.skip) {
      return 1;
    } else {
      return duration;
    }
  };


  /**
  * Gets the duration of rendering the game-message.
  *
  * @method messageDuration
  * @return {number} The duration in frames.
   */

  Component_MessageBehavior.prototype.messageDuration = function() {
    var duration;
    duration = this.object.textRenderer.calculateDuration();
    if (this.tempSettings.skip) {
      return 1;
    } else {
      return duration;
    }
  };


  /**
  * Gets the time between two messages in auto-read mode.
  *
  * @method autoMessageTime
  * @return {number} The time in frames.
   */

  Component_MessageBehavior.prototype.autoMessageTime = function() {
    if (this.tempSettings.skip) {
      return 1;
    } else {
      return Math.max(Math.round(this.settings.autoMessage.time * Graphics.frameRate), this.voiceDuration() - this.messageDuration());
    }
  };


  /**
  * Gets the current message speed.
  *
  * @method messageSpeed
  * @return {number} The message speed.
   */

  Component_MessageBehavior.prototype.messageSpeed = function() {
    return Math.max(11 - Math.round(GameManager.settings.messageSpeed * 2.5), 0);
  };


  /**
  * Checks if a mouse-button or key was pressed to continue with the message-rendering.
  *
  * @method actionTrigger
  * @return {boolean} If true, the an action-button or action-key is pressed.
   */

  Component_MessageBehavior.prototype.actionTrigger = function() {
    return (gs.ObjectManager.current.input && this.object.visible && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y) && Input.Mouse.buttons[Input.Mouse.LEFT] === 2) || Input.trigger(Input.C);
  };

  Component_MessageBehavior.prototype.finish = function() {
    if ((this.object.voice != null) && GameManager.settings.skipVoiceOnAction) {
      return AudioManager.stopSound(this.object.voice.name);
    }
  };

  Component_MessageBehavior.prototype.erase = function() {
    var duration, fading;
    fading = GameManager.tempSettings.messageFading;
    duration = GameManager.tempSettings.skip ? 0 : fading.duration;
    return this.object.animator.disappear(fading.animation, fading.easing, duration, (function(_this) {
      return function() {
        SceneManager.scene.currentCharacter = {
          name: ""
        };
        _this.clear();
        return _this.object.visible = false;
      };
    })(this));
  };


  /**
  * FIXME: Deprecated? It is also a re-definition of gs.Component_Visual.updateOrigin.
  *
  * @method updateOrigin
   */

  Component_MessageBehavior.prototype.updateOrigin = function() {
    var ox, oy, p;
    ox = 0;
    oy = 0;
    if ((this.object.parent != null) && (this.object.parent.dstRect != null)) {
      p = this.object.parent;
      while ((p != null) && (p.dstRect != null)) {
        ox += p.dstRect.x;
        oy += p.dstRect.y;
        p = p.parent;
      }
    }
    this.object.origin.x = ox;
    return this.object.origin.y = oy;
  };


  /**
  * Updates the object. 
  *
  * @method updateObject
  * @private
   */

  Component_MessageBehavior.prototype.updateObject = function() {
    this.updateOrigin();
    if (this.tempSettings.skip && !this.waitingPreview) {
      return this.object.textRenderer.isWaiting = false;
    }
  };


  /**
  * Updates the message.
  *
  * @method updateMessage
  * @private
   */

  Component_MessageBehavior.prototype.updateMessage = function() {
    var ref;
    this.caretPosition = this.object.textRenderer.caretPosition;
    if (this.tempSettings.skip && (this.settings.allowSkipUnreadMessages || ((ref = GameManager.globalData.messages[this.message]) != null ? ref.read : void 0))) {
      this.object.textRenderer.drawImmediately = true;
      this.object.textRenderer.waitAtEnd = this.waitingPreview;
      return this.object.textRenderer.waitAtEndTime = 0;
    } else {
      this.object.textRenderer.drawImmedialty = false;
      this.updateSpeed();
      return this.updateAutoMessage();
    }
  };


  /**
  * Updates the speed of the message. That depends on game-settings if a message
  * is timed to its voice or not.
  *
  * @method updateSpeed
  * @private
   */

  Component_MessageBehavior.prototype.updateSpeed = function() {
    var voiceDuration;
    voiceDuration = this.voiceDuration();
    if (voiceDuration > 0 && this.settings.timeMessageToVoice) {
      return this.object.textRenderer.speed = voiceDuration / this.message.length;
    } else {
      return this.object.textRenderer.speed = this.messageSpeed();
    }
  };


  /**
  * Update auto-read mode.
  *
  * @method updateAutoMessage
  * @private
   */

  Component_MessageBehavior.prototype.updateAutoMessage = function() {
    if (this.settings.autoMessage.stopOnAction && this.actionTrigger()) {
      this.settings.autoMessage.enabled = false;
    }
    if (this.settings.autoMessage.enabled && !this.partial) {
      if (this.object.textRenderer.waitAtEnd) {
        this.object.textRenderer.isWaiting = false;
      }
      this.object.textRenderer.waitAtEndTime = this.autoMessageTime();
      this.object.textRenderer.waitAtEnd = false;
    } else if (this.autoMessageEnabled !== this.settings.autoMessage.enabled) {
      this.object.textRenderer.waitAtEnd = true;
      this.object.textRenderer.waitAtEndTime = 0;
    }
    return this.autoMessageEnabled = this.settings.autoMessage.enabled;
  };


  /*
  * Updates the game message behavior
  *
  * @method update
   */

  Component_MessageBehavior.prototype.update = function() {
    var ref, ref1, ref2, ref3, ref4, ref5;
    this.object.needsUpdate = true;
    this.updateObject();
    this.updateMessage();
    if (this.character !== this.object.character) {
      gs.GlobalEventManager.emit("talkingEnded", this, {
        character: this.character
      });
      this.character = this.object.character;
    }
    if (this.object.textRenderer.isWaiting !== this.isWaiting || this.object.textRenderer.isRunning !== this.isRunning || (((ref = this.voice) != null ? ref.playing : void 0) && (!((ref1 = this.object.character) != null ? ref1.timeTalkingToVoiceVolume : void 0) || this.voice.averageVolume > this.object.character.talkingVolume)) !== this.isVoicePlaying) {
      this.isWaiting = this.object.textRenderer.isWaiting;
      this.isRunning = this.object.textRenderer.isRunning;
      this.isVoicePlaying = ((ref2 = this.voice) != null ? ref2.playing : void 0) && (!((ref3 = this.object.character) != null ? ref3.timeTalkingToVoiceVolume : void 0) || this.voice.averageVolume > this.object.character.talkingVolume);
      if (!this.tempSettings.skip) {
        if ((ref4 = this.voice) != null ? ref4.playing : void 0) {
          if (!this.isVoicePlaying) {
            gs.GlobalEventManager.emit("talkingEnded", this, {
              character: this.object.character
            });
          } else {
            gs.GlobalEventManager.emit("talkingStarted", this, {
              character: this.object.character
            });
          }
        } else {
          if (this.isWaiting) {
            gs.GlobalEventManager.emit("talkingEnded", this, {
              character: this.object.character
            });
          } else if (this.isRunning) {
            gs.GlobalEventManager.emit("talkingStarted", this, {
              character: this.object.character
            });
          }
        }
      }
    }
    if ((this.object.layoutRect != null) && (((ref5 = this.object.parent) != null ? ref5.dstRect : void 0) != null)) {
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

  return Component_MessageBehavior;

})(gs.Component);

vn.Component_MessageBehavior = Component_MessageBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQTs7Ozs7Ozs7O0FBQUEsSUFBQSxzQ0FBQTtFQUFBOzs7QUFTTTs7O0VBQ0YsV0FBQyxDQUFBLEdBQUQsR0FBTzs7RUFDUCxXQUFDLENBQUEsR0FBRCxHQUFPOzs7Ozs7QUFFWCxFQUFFLENBQUMsV0FBSCxHQUFpQjs7QUFHWDs7O0VBQ0YseUJBQUMsQ0FBQSxvQkFBRCxHQUF3QixDQUFDLGtCQUFELEVBQXFCLGlCQUFyQjs7O0FBRXhCOzs7Ozs7Ozs7c0NBUUEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUDtJQUNqQixJQUFDLENBQUEsWUFBRCxHQUFnQixXQUFXLENBQUM7V0FDNUIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFGaUI7OztBQUlyQjs7Ozs7Ozs7OztFQVNhLG1DQUFBOztBQUNUOzs7Ozs7SUFNQSxJQUFDLENBQUEsUUFBRCxHQUFZLFdBQVcsQ0FBQzs7QUFDeEI7Ozs7OztJQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCLFdBQVcsQ0FBQzs7QUFFNUI7Ozs7OztJQU1BLElBQUMsQ0FBQSxTQUFELEdBQWE7O0FBRWI7Ozs7OztJQU1BLElBQUMsQ0FBQSxTQUFELEdBQWE7O0FBRWI7Ozs7OztJQU1BLElBQUMsQ0FBQSxjQUFELEdBQWtCOztBQUVsQjs7Ozs7O0lBTUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxFQUFFLENBQUMsS0FBSCxDQUFTLENBQVQsRUFBWSxDQUFaOztBQUVyQjs7Ozs7O0lBTUEsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7O0lBTUEsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7SUFLQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7O0lBTUEsSUFBQyxDQUFBLGNBQUQsR0FBa0I7O0FBRWxCOzs7Ozs7SUFNQSxJQUFD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LElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQXRCO1FBQTZCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQWhCLEdBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQW5CLENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUE1QyxFQUFqRDs7TUFDQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQXRCO1FBQWlDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhCLEdBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQW5CLENBQXlCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFoRCxFQUF6RDs7TUFDQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQXRCO2VBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWhCLEdBQXlCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQW5CLENBQTBCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFqRCxFQUEzRDtPQUpKOztFQTFCSTs7OztHQTliNEIsRUFBRSxDQUFDOztBQTZkM0MsRUFBRSxDQUFDLHlCQUFILEdBQStCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfTWVzc2FnZUJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIyMqXG4qIEFuIGVudW1lcmF0aW9uIG9mIGdhbWUgbWVzc2FnZSBtb2Rlcy5cbipcbiogQURWIC0gQWR2ZW50dXJlIE1vZGVcbiogTlZMIC0gTm92ZWwgTW9kZVxuKlxuKiBAdHlwZWRlZiBNZXNzYWdlTW9kZVxuKiBAbWVtYmVyb2Ygdm5cbiMjI1xuY2xhc3MgTWVzc2FnZU1vZGVcbiAgICBAQURWID0gMFxuICAgIEBOVkwgPSAxXG4gICAgXG52bi5NZXNzYWdlTW9kZSA9IE1lc3NhZ2VNb2RlXG5cblxuY2xhc3MgQ29tcG9uZW50X01lc3NhZ2VCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgIEBvYmplY3RDb2RlY0JsYWNrTGlzdCA9IFtcIm9uTWVzc2FnZVdhaXRpbmdcIiwgXCJvbk1lc3NhZ2VGaW5pc2hcIl1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgQHRlbXBTZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5nc1xuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQSBiZWhhdmlvci1jb21wb25lbnQgdG8gZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGdhbWUtbWVzc2FnZS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHZuXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X01lc3NhZ2VCZWhhdmlvclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2Ygdm5cbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogUmVmZXJlbmNlIHRvIGdhbWUgc2V0dGluZ3MuXG4gICAgICAgICogQHByb3BlcnR5IHNldHRpbmdzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHNldHRpbmdzID0gR2FtZU1hbmFnZXIuc2V0dGluZ3NcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFJlZmVyZW5jZSB0byB0ZW1wb3JhcnkgZ2FtZSBzZXR0aW5ncy5cbiAgICAgICAgKiBAcHJvcGVydHkgc2V0dGluZ3NcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAdGVtcFNldHRpbmdzID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBtZXNzYWdlIGlzIGN1cnJlbnRseSB3YWl0aW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1dhaXRpbmdcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIG1lc3NhZ2UgaXMgY3VycmVudGx5IHJ1bm5pbmcuXG4gICAgICAgICogQHByb3BlcnR5IGlzUnVubmluZ1xuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiBhIHZvaWNlIGlzIGN1cnJlbnRseSBwbGF5aW5nIHRvZ2V0aGVyIHdpdGggdGhlIG1lc3NhZ2UuXG4gICAgICAgICogQHByb3BlcnR5IGlzVm9pY2VQbGF5aW5nXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQGlzVm9pY2VQbGF5aW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDdXJyZW50IG1lc3NhZ2UgY2FyZXQvY3Vyc29yIHBvc2l0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjYXJldFBvc2l0aW9uXG4gICAgICAgICogQHR5cGUgZ3MuUG9pbnRcbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBjYXJldFBvc2l0aW9uID0gbmV3IGdzLlBvaW50KDAsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ3VycmVudCByYXcgbWVzc2FnZSB0ZXh0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBtZXNzYWdlXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAbWVzc2FnZSA9IFwiXCJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbGwgY3VycmVudGx5IGRpc3BsYXllZCByYXcgbWVzc2FnZXMuXG4gICAgICAgICogQHByb3BlcnR5IG1lc3NhZ2VzXG4gICAgICAgICogQHR5cGUgc3RyaW5nW11cbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBtZXNzYWdlcyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVm9pY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IG1lc3NhZ2UuXG4gICAgICAgICogQHByb3BlcnR5IHZvaWNlXG4gICAgICAgICogQHR5cGUgZ3MuQXVkaW9CdWZmZXJSZWZlcmVuY2VcbiAgICAgICAgIyMjXG4gICAgICAgIEB2b2ljZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgY3VycmVudCBtZXNzYWdlIGlzIHBhcnRpYWwuIERFUFJFQ0FURUQuIFBsZWFzZSBkbyBub3QgdXNlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwYXJ0aWFsXG4gICAgICAgICogQGRlcHJlY2F0ZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAcGFydGlhbCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBtZXNzYWdlIGlzIGN1cnJlbnRseSB3YWl0aW5nIGluIGxpdmUtcHJldmlldy5cbiAgICAgICAgKiBAcHJvcGVydHkgd2FpdGluZ1ByZXZpZXdcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAd2FpdGluZ1ByZXZpZXcgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgYXV0by1tZXNzYWdlIGlzIGVuYWJsZWQuXG4gICAgICAgICogQHByb3BlcnR5IGF1dG9NZXNzYWdlRW5hYmxlZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBhdXRvTWVzc2FnZUVuYWJsZWQgPSBub1xuICAgICAgXG4gICAgICAgIEBvbk1lc3NhZ2VGaW5pc2ggPSAoc2VuZGVyKSA9PlxuICAgICAgICAgICAgQG9iamVjdC5ldmVudHMuZW1pdCBcImZpbmlzaFwiLCB0aGlzXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBvYmplY3Quc2V0dGluZ3MuYXV0b0VyYXNlIG9yIEBvYmplY3Quc2V0dGluZ3MucGFyYWdyYXBoU3BhY2luZyA+IDBcbiAgICAgICAgICAgICAgICBAbWVzc2FnZSA9IFwiXCJcbiAgICAgICAgICAgIFxuICAgICAgICBAb25NZXNzYWdlV2FpdGluZyA9IChzZW5kZXIpID0+XG4gICAgICAgICAgICBpZiAhQG9iamVjdC50ZXh0UmVuZGVyZXIuaXNCYXRjaGVkKCkgb3IgIUBvYmplY3QudGV4dFJlbmRlcmVyLmlzQmF0Y2hJblByb2dyZXNzKClcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci53YWl0QXRFbmQgPSAhQHBhcnRpYWxcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmV2ZW50cy5lbWl0IFwid2FpdGluZ1wiLCB0aGlzXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVyc1xuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBFdmVudEhhbmRsZXJzXG4gICAgIyMjIFxuICAgIHNldHVwRXZlbnRIYW5kbGVyczogLT5cbiAgICAgICAgQG9iamVjdC5ldmVudHMub2ZmQnlPd25lcihcIm1lc3NhZ2VGaW5pc2hcIiwgdGhpcylcbiAgICAgICAgQG9iamVjdC5ldmVudHMub2ZmQnlPd25lcihcIm1lc3NhZ2VXYWl0aW5nXCIsIHRoaXMpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LmV2ZW50cy5vbiBcIm1lc3NhZ2VGaW5pc2hcIiwgZ3MuQ2FsbEJhY2soXCJvbk1lc3NhZ2VGaW5pc2hcIiwgdGhpcyksIG51bGwsIHRoaXNcbiAgICAgICAgQG9iamVjdC5ldmVudHMub24gXCJtZXNzYWdlV2FpdGluZ1wiLCBncy5DYWxsQmFjayhcIm9uTWVzc2FnZVdhaXRpbmdcIiwgdGhpcyksIG51bGwsIHRoaXNcbiAgICAgICAgICAgIFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcInByZXZpZXdXYWl0aW5nXCIsIHRoaXMpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwicHJldmlld1Jlc3RhcnRcIiwgdGhpcylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwicHJldmlld1dhaXRpbmdcIiwgKChzZW5kZXIpID0+XG4gICAgICAgICAgICBAd2FpdGluZ1ByZXZpZXcgPSB5ZXNcbiAgICAgICAgKSwgbnVsbCwgdGhpc1xuICAgICAgICBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwicHJldmlld1Jlc3RhcnRcIiwgKChzZW5kZXIpID0+XG4gICAgICAgICAgICBAd2FpdGluZ1ByZXZpZXcgPSBub1xuICAgICAgICApLCBudWxsLCB0aGlzXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHVwIHRoZSBjb21wb25lbnQuIEFkZHMgZXZlbnQgaGFuZGxlcnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFxuICAgICMjI1xuICAgIHNldHVwOiAtPlxuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIGNvbXBvbmVudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHRvRGF0YUJ1bmRsZVxuICAgICMjIyAgIFxuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcInByZXZpZXdXYWl0aW5nXCIsIHRoaXMpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwicHJldmlld1Jlc3RhcnRcIiwgdGhpcylcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBOb3QgaW1wbGVtZW50ZWQgeWV0LlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgIyMjXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICMjIypcbiAgICAqIE5vdCBpbXBsZW1lbnRlZCB5ZXQuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYnVuZGxlIC0gQSBkYXRhIGJ1bmRsZS5cbiAgICAjIyMgICAgXG4gICAgcmVzdG9yZTogKGJ1bmRsZSkgLT5cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIHRvIHNob3cgYSBnYW1lIG1lc3NhZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBzaG93TWVzc2FnZVxuICAgICogQHBhcmFtIHtPYmplY3R9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2YgdGhpcyBhY3Rpb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5lY2Vzc2FyeSBwYXJhbWV0ZXJzLlxuICAgICMjI1xuICAgIHNob3dNZXNzYWdlOiAoc2VuZGVyLCBwYXJhbXMpIC0+XG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0Q29udGV4dENoYW5nZShsY3NtKHBhcmFtcy5tZXNzYWdlKSlcbiAgICAgICAgXG4gICAgICAgIEBwYXJ0aWFsID0gcGFyYW1zLnBhcnRpYWxcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQG1lc3NhZ2UgKz0gbGNzbShwYXJhbXMubWVzc2FnZSlcbiAgICAgICAgXG4gICAgICAgIEBhZGRNZXNzYWdlKHBhcmFtcy5tZXNzYWdlLCBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbcGFyYW1zLmNoYXJhY3RlcklkXSwgQG9iamVjdC5zZXR0aW5ncy5wYXJhZ3JhcGhTcGFjaW5nID4gMCwgIUBwYXJ0aWFsKVxuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC50ZXh0UmVuZGVyZXIuaXNCYXRjaGVkKClcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLndhaXRBdEVuZCA9IHllc1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci53YWl0QXRFbmQgPSAhQHBhcnRpYWxcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEZXByZWNhdGVkLiBOb3QgbG9uZ2VyIHVzZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVCaXRtYXBcbiAgICAjIyNcbiAgICB1cGRhdGVCaXRtYXA6IC0+XG4gICAgICAgIGlmICFAb2JqZWN0LmJpdG1hcCBvciBAb2JqZWN0LmJpdG1hcC53aWR0aCAhPSBAb2JqZWN0LmRzdFJlY3Qud2lkdGggb3IgQG9iamVjdC5iaXRtYXAuaGVpZ2h0ICE9IEBvYmplY3QuZHN0UmVjdC5oZWlnaHRcbiAgICAgICAgICAgIEBvYmplY3QuYml0bWFwPy5kaXNwb3NlKClcbiAgICAgICAgICAgIEBvYmplY3QuYml0bWFwID0gbmV3IEJpdG1hcChAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQpXG4gICAgICAgICAgICBAb2JqZWN0LmJpdG1hcC5mb250ID0gQG9iamVjdC5mb250XG4gICAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgYSBOVkwgZ2FtZSBtZXNzYWdlIG9mIGFuIGFycmF5IG9mIG1lc3NhZ2Utb2JqZWN0cy4gVGhhdCBpc1xuICAgICogbmVjZXNzYXJ5IHRvIHJlc3RvcmUgYSBOVkwgZ2FtZSBtZXNzYWdlIGZyb20gYSBzYXZlLWdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlTWVzc2FnZXNcbiAgICAqIEBwYXJhbSB7QXJyYXl9IG1lc3NhZ2VzIC0gQW4gYXJyYXkgb2YgbWVzc2FnZXMgdG8gcmVzdG9yZS5cbiAgICAjIyNcbiAgICByZXN0b3JlTWVzc2FnZXM6IChtZXNzYWdlcykgLT5cbiAgICAgICAgQHVwZGF0ZUJpdG1hcCgpXG4gICAgICAgIEBjbGVhcigpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0Lm9wYWNpdHkgPSAyNTVcbiAgICAgICAgQG9iamVjdC5zcmNSZWN0ID0gbmV3IFJlY3QoMCwgMCwgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0KVxuICAgICAgICBcbiAgICAgICAgZm9yIG1lc3NhZ2UgaW4gbWVzc2FnZXNcbiAgICAgICAgICAgIEBvYmplY3QuZm9udC5jb2xvciA9IG5ldyBDb2xvcihtZXNzYWdlLmNoYXJhY3Rlcj8udGV4dENvbG9yIHx8IENvbG9yLldISVRFKVxuICAgICAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIuZHJhd0Zvcm1hdHRlZFRleHRJbW1lZGlhdGVseSgwLCAwLCBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQsIGxjc20obWVzc2FnZS50ZXh0ID8gbWVzc2FnZSksIHllcylcblxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGEgbmV3IG1lc3NhZ2UuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgYWRkTWVzc2FnZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBUaGUgbWVzc2FnZS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFyYWN0ZXIgLSBEYXRhYmFzZS1SZWNvcmQgb2YgYSBjaGFyYWN0ZXIuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld0xpbmUgLSBJbmRpY2F0ZXMgaWYgdGhlIG1lc3NhZ2Ugc2hvdWxkIG1ha2UgYSBsaW5lIGJyZWFrLlxuICAgICMjI1xuICAgIGFkZE1lc3NhZ2U6IChtZXNzYWdlLCBjaGFyYWN0ZXIsIG5ld0xpbmUsIHdhaXRBdEVuZCkgLT5cbiAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIucGFydGlhbE1lc3NhZ2UgPSBudWxsXG4gICAgICAgIEBvYmplY3Qub2Zmc2V0ID0geDogMCwgeTogMFxuICAgICAgICBAb2JqZWN0LnZpc2libGUgPSB5ZXNcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3QubWVzc2FnZXMucHVzaCh7IHRleHQ6IG1lc3NhZ2UsIGNoYXJhY3RlcjogY2hhcmFjdGVyfSlcbiAgICAgICAgXG4gICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLndhaXRBdEVuZCA9IHdhaXRBdEVuZFxuICAgICAgICBpZiBub3QgQG9iamVjdC5zZXR0aW5ncy5hdXRvRXJhc2VcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLmN1cnJlbnRZICs9IEBvYmplY3Quc2V0dGluZ3MucGFyYWdyYXBoU3BhY2luZ1xuICAgICAgICBpZiBuZXdMaW5lXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci5uZXdMaW5lKClcbiAgICAgICAgQHVwZGF0ZUJpdG1hcCgpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgY2hhcmFjdGVyPyBhbmQgQG9iamVjdC5zZXR0aW5ncy51c2VDaGFyYWN0ZXJDb2xvclxuICAgICAgICAgICAgQG9iamVjdC5mb250LmNvbG9yID0gbmV3IENvbG9yKGNoYXJhY3Rlcj8udGV4dENvbG9yIHx8IENvbG9yLldISVRFKVxuICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3Qub3BhY2l0eSA9IDI1NVxuICAgICAgICBAb2JqZWN0LnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQpXG4gICAgIFxuICAgICAgICBAdXBkYXRlKClcbiAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIuZHJhd0Zvcm1hdHRlZFRleHQoMCwgMCwgQG9iamVjdC5kc3RSZWN0LndpZHRoLCBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0LCBtZXNzYWdlLCB5ZXMpXG5cbiAgICAjIyMqXG4gICAgKiBDbGVhcnMgdGhlIGdhbWUgbWVzc2FnZSBieSBkZWxldGluZy9jbGVhcmluZyBhbGwgbWVzc2FnZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhclxuICAgICMjI1xuICAgIGNsZWFyOiAtPiBcbiAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIuY2xlYXIoKVxuICAgICAgICBAb2JqZWN0Lm1lc3NhZ2VzID0gW11cbiAgICAgICAgQG1lc3NhZ2UgPSBcIlwiXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENsb3NlcyB0aGUgZ2FtZSBtZXNzYWdlIGJ5IG1ha2luZyBpdCBpbnZpc2libGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbG9zZVxuICAgICMjI1xuICAgIGNsb3NlOiAtPiBcbiAgICAgICAgQG9iamVjdC52aXNpYmxlID0gbm9cbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSBkdXJhdGlvbiBvZiBhbiBhc3NvY2lhdGVkIHZvaWNlIG9yIDAgaWYgbm8gdm9pY2UgaXMgYXNzb2NpYXRlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHZvaWNlRHVyYXRpb25cbiAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGR1cmF0aW9uIGluIGZyYW1lcy5cbiAgICAjIyNcbiAgICB2b2ljZUR1cmF0aW9uOiAtPlxuICAgICAgICBkdXJhdGlvbiA9IDBcbiAgICAgICAgaWYgQHZvaWNlPyBhbmQgKEBzZXR0aW5ncy5hdXRvTWVzc2FnZS53YWl0Rm9yVm9pY2Ugb3IgQHNldHRpbmdzLnRpbWVNZXNzYWdlVG9Wb2ljZSlcbiAgICAgICAgICAgIGR1cmF0aW9uID0gTWF0aC5yb3VuZCgoQHZvaWNlLnNvdXJjZS5idWZmZXIuZHVyYXRpb24gKiAoMS4wIC8gQHZvaWNlLnNvdXJjZS5wbGF5YmFja1JhdGUudmFsdWUpKSAqIDEwMDAgLyAxNi42KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDBcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQHRlbXBTZXR0aW5ncy5za2lwIHRoZW4gMSBlbHNlIGR1cmF0aW9uXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIGR1cmF0aW9uIG9mIHJlbmRlcmluZyB0aGUgZ2FtZS1tZXNzYWdlLlxuICAgICpcbiAgICAqIEBtZXRob2QgbWVzc2FnZUR1cmF0aW9uXG4gICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkdXJhdGlvbiBpbiBmcmFtZXMuXG4gICAgIyMjXG4gICAgbWVzc2FnZUR1cmF0aW9uOiAtPiBcbiAgICAgICAgZHVyYXRpb24gPSBAb2JqZWN0LnRleHRSZW5kZXJlci5jYWxjdWxhdGVEdXJhdGlvbigpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gaWYgQHRlbXBTZXR0aW5ncy5za2lwIHRoZW4gMSBlbHNlIGR1cmF0aW9uXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHRpbWUgYmV0d2VlbiB0d28gbWVzc2FnZXMgaW4gYXV0by1yZWFkIG1vZGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBhdXRvTWVzc2FnZVRpbWVcbiAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIHRpbWUgaW4gZnJhbWVzLlxuICAgICMjI1xuICAgIGF1dG9NZXNzYWdlVGltZTogLT4gXG4gICAgICAgIGlmIEB0ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KE1hdGgucm91bmQoQHNldHRpbmdzLmF1dG9NZXNzYWdlLnRpbWUgKiBHcmFwaGljcy5mcmFtZVJhdGUpLCBAdm9pY2VEdXJhdGlvbigpIC0gQG1lc3NhZ2VEdXJhdGlvbigpKVxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIGN1cnJlbnQgbWVzc2FnZSBzcGVlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG1lc3NhZ2VTcGVlZFxuICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgbWVzc2FnZSBzcGVlZC5cbiAgICAjIyNcbiAgICBtZXNzYWdlU3BlZWQ6IC0+IE1hdGgubWF4KDExIC0gTWF0aC5yb3VuZChHYW1lTWFuYWdlci5zZXR0aW5ncy5tZXNzYWdlU3BlZWQgKiAyLjUpLCAwKVxuICAgIFxuICAgICMjIypcbiAgICAqIENoZWNrcyBpZiBhIG1vdXNlLWJ1dHRvbiBvciBrZXkgd2FzIHByZXNzZWQgdG8gY29udGludWUgd2l0aCB0aGUgbWVzc2FnZS1yZW5kZXJpbmcuXG4gICAgKlxuICAgICogQG1ldGhvZCBhY3Rpb25UcmlnZ2VyXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiB0cnVlLCB0aGUgYW4gYWN0aW9uLWJ1dHRvbiBvciBhY3Rpb24ta2V5IGlzIHByZXNzZWQuXG4gICAgIyMjXG4gICAgYWN0aW9uVHJpZ2dlcjogLT4gKGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5pbnB1dCBhbmQgQG9iamVjdC52aXNpYmxlIGFuZCBAb2JqZWN0LmRzdFJlY3QuY29udGFpbnMoSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KSBhbmQgSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyKSBvciBJbnB1dC50cmlnZ2VyKElucHV0LkMpXG4gICAgXG4gICAgZmluaXNoOiAtPlxuICAgICAgICAjQG9iamVjdC5jaGFyYWN0ZXIgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LnZvaWNlPyBhbmQgR2FtZU1hbmFnZXIuc2V0dGluZ3Muc2tpcFZvaWNlT25BY3Rpb25cbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5zdG9wU291bmQoQG9iamVjdC52b2ljZS5uYW1lKVxuICAgIFxuICAgIGVyYXNlOiAtPlxuICAgICAgICBmYWRpbmcgPSBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MubWVzc2FnZUZhZGluZ1xuICAgICAgICBkdXJhdGlvbiA9IGlmIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwIHRoZW4gMCBlbHNlIGZhZGluZy5kdXJhdGlvblxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5hbmltYXRvci5kaXNhcHBlYXIoZmFkaW5nLmFuaW1hdGlvbiwgZmFkaW5nLmVhc2luZywgZHVyYXRpb24sID0+XG4gICAgICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuY3VycmVudENoYXJhY3RlciA9IHsgbmFtZTogXCJcIiB9XG4gICAgICAgICAgICBAY2xlYXIoKVxuICAgICAgICAgICAgQG9iamVjdC52aXNpYmxlID0gbm9cbiAgICAgICAgKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBGSVhNRTogRGVwcmVjYXRlZD8gSXQgaXMgYWxzbyBhIHJlLWRlZmluaXRpb24gb2YgZ3MuQ29tcG9uZW50X1Zpc3VhbC51cGRhdGVPcmlnaW4uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVPcmlnaW5cbiAgICAjIyNcbiAgICB1cGRhdGVPcmlnaW46IC0+XG4gICAgICAgIG94ID0gMFxuICAgICAgICBveSA9IDBcbiAgICAgICAgaWYgQG9iamVjdC5wYXJlbnQ/IGFuZCBAb2JqZWN0LnBhcmVudC5kc3RSZWN0P1xuICAgICAgICAgICAgcCA9IEBvYmplY3QucGFyZW50XG4gICAgICAgICAgICB3aGlsZSBwPyBhbmQgcC5kc3RSZWN0P1xuICAgICAgICAgICAgICAgIG94ICs9IHAuZHN0UmVjdC54XG4gICAgICAgICAgICAgICAgb3kgKz0gcC5kc3RSZWN0LnlcbiAgICAgICAgICAgICAgICBwID0gcC5wYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3Qub3JpZ2luLnggPSBveFxuICAgICAgICBAb2JqZWN0Lm9yaWdpbi55ID0gb3lcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgb2JqZWN0LiBcbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9iamVjdFxuICAgICogQHByaXZhdGVcbiAgICAjIyNcbiAgICB1cGRhdGVPYmplY3Q6IC0+XG4gICAgICAgIEB1cGRhdGVPcmlnaW4oKVxuICAgICAgICBcbiAgICAgICAgaWYgQHRlbXBTZXR0aW5ncy5za2lwIGFuZCBub3QgQHdhaXRpbmdQcmV2aWV3XG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci5pc1dhaXRpbmcgPSBub1xuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG1lc3NhZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVNZXNzYWdlXG4gICAgKiBAcHJpdmF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZU1lc3NhZ2U6IC0+XG4gICAgICAgIEBjYXJldFBvc2l0aW9uID0gQG9iamVjdC50ZXh0UmVuZGVyZXIuY2FyZXRQb3NpdGlvblxuICAgICAgICBcbiAgICAgICAgaWYgQHRlbXBTZXR0aW5ncy5za2lwIGFuZCAoQHNldHRpbmdzLmFsbG93U2tpcFVucmVhZE1lc3NhZ2VzIG9yIEdhbWVNYW5hZ2VyLmdsb2JhbERhdGEubWVzc2FnZXNbQG1lc3NhZ2VdPy5yZWFkKVxuICAgICAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIuZHJhd0ltbWVkaWF0ZWx5ID0geWVzXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci53YWl0QXRFbmQgPSBAd2FpdGluZ1ByZXZpZXdcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLndhaXRBdEVuZFRpbWUgPSAwXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLmRyYXdJbW1lZGlhbHR5ID0gbm9cbiAgICAgICAgICAgIEB1cGRhdGVTcGVlZCgpXG4gICAgICAgICAgICBAdXBkYXRlQXV0b01lc3NhZ2UoKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3BlZWQgb2YgdGhlIG1lc3NhZ2UuIFRoYXQgZGVwZW5kcyBvbiBnYW1lLXNldHRpbmdzIGlmIGEgbWVzc2FnZVxuICAgICogaXMgdGltZWQgdG8gaXRzIHZvaWNlIG9yIG5vdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVNwZWVkXG4gICAgKiBAcHJpdmF0ZVxuICAgICMjI1xuICAgIHVwZGF0ZVNwZWVkOiAtPlxuICAgICAgICB2b2ljZUR1cmF0aW9uID0gQHZvaWNlRHVyYXRpb24oKVxuICAgICAgICBpZiB2b2ljZUR1cmF0aW9uID4gMCBhbmQgQHNldHRpbmdzLnRpbWVNZXNzYWdlVG9Wb2ljZVxuICAgICAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIuc3BlZWQgPSB2b2ljZUR1cmF0aW9uIC8gQG1lc3NhZ2UubGVuZ3RoXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLnNwZWVkID0gQG1lc3NhZ2VTcGVlZCgpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGUgYXV0by1yZWFkIG1vZGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVBdXRvTWVzc2FnZVxuICAgICogQHByaXZhdGVcbiAgICAjIyNcbiAgICB1cGRhdGVBdXRvTWVzc2FnZTogLT5cbiAgICAgICAgaWYgQHNldHRpbmdzLmF1dG9NZXNzYWdlLnN0b3BPbkFjdGlvbiBhbmQgQGFjdGlvblRyaWdnZXIoKVxuICAgICAgICAgICAgQHNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWQgPSBub1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBzZXR0aW5ncy5hdXRvTWVzc2FnZS5lbmFibGVkIGFuZCBub3QgQHBhcnRpYWxcbiAgICAgICAgICAgIGlmIEBvYmplY3QudGV4dFJlbmRlcmVyLndhaXRBdEVuZFxuICAgICAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLmlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci53YWl0QXRFbmRUaW1lID0gQGF1dG9NZXNzYWdlVGltZSgpXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRSZW5kZXJlci53YWl0QXRFbmQgPSBub1xuICAgICAgICBlbHNlIGlmIEBhdXRvTWVzc2FnZUVuYWJsZWQgIT0gQHNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWRcbiAgICAgICAgICAgIEBvYmplY3QudGV4dFJlbmRlcmVyLndhaXRBdEVuZCA9IHllc1xuICAgICAgICAgICAgQG9iamVjdC50ZXh0UmVuZGVyZXIud2FpdEF0RW5kVGltZSA9IDBcbiAgICAgICAgICAgIFxuICAgICAgICBAYXV0b01lc3NhZ2VFbmFibGVkID0gQHNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWRcbiAgICAgICAgICAgIFxuICAgICMjI1xuICAgICogVXBkYXRlcyB0aGUgZ2FtZSBtZXNzYWdlIGJlaGF2aW9yXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgQHVwZGF0ZU9iamVjdCgpXG4gICAgICAgIEB1cGRhdGVNZXNzYWdlKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBjaGFyYWN0ZXIgIT0gQG9iamVjdC5jaGFyYWN0ZXIgICBcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5lbWl0KFwidGFsa2luZ0VuZGVkXCIsIHRoaXMsIGNoYXJhY3RlcjogQGNoYXJhY3RlcilcbiAgICAgICAgICAgIEBjaGFyYWN0ZXIgPSBAb2JqZWN0LmNoYXJhY3RlclxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QudGV4dFJlbmRlcmVyLmlzV2FpdGluZyAhPSBAaXNXYWl0aW5nIG9yIEBvYmplY3QudGV4dFJlbmRlcmVyLmlzUnVubmluZyAhPSBAaXNSdW5uaW5nIG9yIChAdm9pY2U/LnBsYXlpbmcgJiYgKCFAb2JqZWN0LmNoYXJhY3Rlcj8udGltZVRhbGtpbmdUb1ZvaWNlVm9sdW1lIG9yIEB2b2ljZS5hdmVyYWdlVm9sdW1lID4gQG9iamVjdC5jaGFyYWN0ZXIudGFsa2luZ1ZvbHVtZSkpICE9IEBpc1ZvaWNlUGxheWluZ1xuICAgICAgICAgICAgQGlzV2FpdGluZyA9IEBvYmplY3QudGV4dFJlbmRlcmVyLmlzV2FpdGluZ1xuICAgICAgICAgICAgQGlzUnVubmluZyA9IEBvYmplY3QudGV4dFJlbmRlcmVyLmlzUnVubmluZ1xuICAgICAgICAgICAgQGlzVm9pY2VQbGF5aW5nID0gKEB2b2ljZT8ucGxheWluZyAmJiAoIUBvYmplY3QuY2hhcmFjdGVyPy50aW1lVGFsa2luZ1RvVm9pY2VWb2x1bWUgb3IgQHZvaWNlLmF2ZXJhZ2VWb2x1bWUgPiBAb2JqZWN0LmNoYXJhY3Rlci50YWxraW5nVm9sdW1lKSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbm90IEB0ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgICAgIGlmIEB2b2ljZT8ucGxheWluZ1xuICAgICAgICAgICAgICAgICAgICBpZiBub3QgQGlzVm9pY2VQbGF5aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInRhbGtpbmdFbmRlZFwiLCB0aGlzLCBjaGFyYWN0ZXI6IEBvYmplY3QuY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInRhbGtpbmdTdGFydGVkXCIsIHRoaXMsIGNoYXJhY3RlcjogQG9iamVjdC5jaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZiBAaXNXYWl0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInRhbGtpbmdFbmRlZFwiLCB0aGlzLCBjaGFyYWN0ZXI6IEBvYmplY3QuY2hhcmFjdGVyKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIEBpc1J1bm5pbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5lbWl0KFwidGFsa2luZ1N0YXJ0ZWRcIiwgdGhpcywgY2hhcmFjdGVyOiBAb2JqZWN0LmNoYXJhY3RlcilcbiAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QubGF5b3V0UmVjdD8gYW5kIEBvYmplY3QucGFyZW50Py5kc3RSZWN0P1xuICAgICAgICAgICAgaWYgQG9iamVjdC5sYXlvdXRSZWN0LnggdGhlbiBAb2JqZWN0LmRzdFJlY3QueCA9IEBvYmplY3QubGF5b3V0UmVjdC54KEBvYmplY3QucGFyZW50LmRzdFJlY3Qud2lkdGgpXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmxheW91dFJlY3QueSB0aGVuIEBvYmplY3QuZHN0UmVjdC55ID0gQG9iamVjdC5sYXlvdXRSZWN0LnkoQG9iamVjdC5wYXJlbnQuZHN0UmVjdC5oZWlnaHQpXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmxheW91dFJlY3Qud2lkdGggdGhlbiBAb2JqZWN0LmRzdFJlY3Qud2lkdGggPSBAb2JqZWN0LmxheW91dFJlY3Qud2lkdGgoQG9iamVjdC5wYXJlbnQuZHN0UmVjdC53aWR0aClcbiAgICAgICAgICAgIGlmIEBvYmplY3QubGF5b3V0UmVjdC5oZWlnaHQgdGhlbiBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQG9iamVjdC5sYXlvdXRSZWN0LmhlaWdodChAb2JqZWN0LnBhcmVudC5kc3RSZWN0LmhlaWdodClcbnZuLkNvbXBvbmVudF9NZXNzYWdlQmVoYXZpb3IgPSBDb21wb25lbnRfTWVzc2FnZUJlaGF2aW9yIl19
//# sourceURL=Component_MessageBehavior_127.js