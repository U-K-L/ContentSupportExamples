var Component_CommandInterpreter, InterpreterContext, LivePreviewInfo,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LivePreviewInfo = (function() {

  /**
  * Stores internal preview-info if the game runs currently in Live-Preview.
  *        
  * @module gs
  * @class LivePreviewInfo
  * @memberof gs
   */
  function LivePreviewInfo() {

    /**
    * Timer ID if a timeout for live-preview was configured to exit the game loop after a certain amount of time.
    * @property timeout
    * @type number
     */
    this.timeout = null;

    /** 
    * Indicates if Live-Preview is currently waiting for the next user-action. (Selecting another command, etc.)
    * @property waiting  
    * @type boolean
     */
    this.waiting = false;

    /**
    * Counts the amount of executed commands since the last 
    * interpreter-pause(waiting, etc.). If its more than 500, the interpreter will automatically pause for 1 frame to 
    * avoid that Live-Preview freezes the Editor in case of endless loops.
    * @property executedCommands
    * @type number
     */
    this.executedCommands = 0;
  }

  return LivePreviewInfo;

})();

gs.LivePreviewInfo = LivePreviewInfo;

InterpreterContext = (function() {
  InterpreterContext.objectCodecBlackList = ["owner"];


  /**
  * Describes an interpreter-context which holds information about
  * the interpreter's owner and also unique ID used for accessing correct
  * local variables.
  *
  * @module gs
  * @class InterpreterContext
  * @memberof gs
  * @param {number|string} id - A unique ID
  * @param {Object} owner - The owner of the interpreter
   */

  function InterpreterContext(id, owner) {

    /**
    * A unique numeric or textual ID used for accessing correct local variables.
    * @property id
    * @type number|string
     */
    this.id = id;

    /**
    * The owner of the interpreter (e.g. current scene, etc.).
    * @property owner
    * @type Object
     */
    this.owner = owner;
  }


  /**
  * Sets the context's data.
  * @param {number|string} id - A unique ID
  * @param {Object} owner - The owner of the interpreter
  * @method set
   */

  InterpreterContext.prototype.set = function(id, owner) {
    this.id = id;
    return this.owner = owner;
  };

  return InterpreterContext;

})();

gs.InterpreterContext = InterpreterContext;

Component_CommandInterpreter = (function(superClass) {
  extend(Component_CommandInterpreter, superClass);

  Component_CommandInterpreter.objectCodecBlackList = ["object", "command", "onMessageADVWaiting", "onMessageADVDisappear", "onMessageADVFinish"];


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_CommandInterpreter.prototype.onDataBundleRestore = function(data, context) {};


  /**
  * A component which allows a game object to process commands like for
  * scene-objects. For each command a command-function exists. To add
  * own custom commands to the interpreter just create a sub-class and
  * override the gs.Component_CommandInterpreter.assignCommand method
  * and assign the command-function for your custom-command.
  *
  * @module gs
  * @class Component_CommandInterpreter
  * @extends gs.Component
  * @memberof gs
   */

  function Component_CommandInterpreter() {
    Component_CommandInterpreter.__super__.constructor.call(this);

    /**
    * Wait-Counter in frames. If greater than 0, the interpreter will for that amount of frames before continue.
    * @property waitCounter
    * @type number
     */
    this.waitCounter = 0;

    /**
    * Index to the next command to execute.
    * @property pointer
    * @type number
     */
    this.pointer = 0;

    /**
    * Stores states of conditions.
    * @property conditions
    * @type number
    * @protected
     */
    this.conditions = [];

    /**
    * Stores states of loops.
    * @property loops
    * @type number
    * @protected
     */
    this.loops = [];
    this.timers = [];

    /**
    * Indicates if the interpreter is currently running.
    * @property isRunning
    * @type boolean
    * @readOnly
     */
    this.isRunning = false;

    /**
    * Indicates if the interpreter is currently waiting.
    * @property isWaiting
    * @type boolean
     */
    this.isWaiting = false;

    /**
    * Indicates if the interpreter is currently waiting until a message processed by another context like a Common Event
    * is finished.
    * FIXME: Conflict handling can be removed maybe. 
    * @property isWaitingForMessage
    * @type boolean
     */
    this.isWaitingForMessage = false;

    /**
    * Stores internal preview-info if the game runs currently in Live-Preview.
    * <ul>
    * <li>previewInfo.timeout - Timer ID if a timeout for live-preview was configured to exit the game loop after a certain amount of time.</li>
    * <li>previewInfo.waiting - Indicates if Live-Preview is currently waiting for the next user-action. (Selecting another command, etc.)</li>
    * <li>previewInfo.executedCommands - Counts the amount of executed commands since the last 
    * interpreter-pause(waiting, etc.). If its more than 500, the interpreter will automatically pause for 1 frame to 
    * avoid that Live-Preview freezes the Editor in case of endless loops.</li>
    * </ul>
    * @property previewInfo
    * @type boolean
    * @protected
     */
    this.previewInfo = new gs.LivePreviewInfo();

    /**
    * Stores Live-Preview related info passed from the VN Maker editor like the command-index the player clicked on, etc.
    * @property previewData
    * @type Object
    * @protected
     */
    this.previewData = null;

    /**
    * Indicates if the interpreter automatically repeats execution after the last command was executed.
    * @property repeat
    * @type boolean
     */
    this.repeat = false;

    /**
    * The execution context of the interpreter.
    * @property context
    * @type gs.InterpreterContext
    * @protected
     */
    this.context = new gs.InterpreterContext(0, null);

    /**
    * Sub-Interpreter from a Common Event Call. The interpreter will wait until the sub-interpreter is done and set back to
    * <b>null</b>.
    * @property subInterpreter
    * @type gs.Component_CommandInterpreter
    * @protected
     */
    this.subInterpreter = null;

    /**
    * Current indent-level of execution
    * @property indent
    * @type number
    * @protected
     */
    this.indent = 0;

    /**
    * Stores information about for what the interpreter is currently waiting for like for a ADV message, etc. to
    * restore probably when loaded from a save-game.
    * @property waitingFor
    * @type Object
    * @protected
     */
    this.waitingFor = {};

    /**
    * Stores interpreter related settings like how to handle messages, etc.
    * @property settings
    * @type Object
    * @protected
     */
    this.settings = {
      message: {
        byId: {},
        autoErase: true,
        waitAtEnd: true,
        backlog: true
      },
      screen: {
        pan: new gs.Point(0, 0)
      }
    };

    /**
    * Mapping table to quickly get the anchor point for the an inserted anchor-point constant such as
    * Top-Left(0), Top(1), Top-Right(2) and so on.
    * @property graphicAnchorPointsByConstant
    * @type gs.Point[]
    * @protected
     */
    this.graphicAnchorPointsByConstant = [new gs.Point(0.0, 0.0), new gs.Point(0.5, 0.0), new gs.Point(1.0, 0.0), new gs.Point(1.0, 0.5), new gs.Point(1.0, 1.0), new gs.Point(0.5, 1.0), new gs.Point(0.0, 1.0), new gs.Point(0.0, 0.5), new gs.Point(0.5, 0.5)];
  }

  Component_CommandInterpreter.prototype.onHotspotClick = function(e, data) {
    return this.executeAction(data.params.actions.onClick, false, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotEnter = function(e, data) {
    return this.executeAction(data.params.actions.onEnter, true, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotLeave = function(e, data) {
    return this.executeAction(data.params.actions.onLeave, false, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotDragStart = function(e, data) {
    return this.executeAction(data.params.actions.onDrag, true, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotDrag = function(e, data) {
    return this.executeAction(data.params.actions.onDrag, true, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotDragEnd = function(e, data) {
    return this.executeAction(data.params.actions.onDrag, false, data.bindValue);
  };

  Component_CommandInterpreter.prototype.onHotspotStateChanged = function(e, params) {
    if (e.sender.behavior.selected) {
      return this.executeAction(params.actions.onSelect, true);
    } else {
      return this.executeAction(params.actions.onDeselect, false);
    }
  };


  /**
  * Called when a ADV message finished rendering and is now waiting
  * for the user/autom-message timer to proceed.
  *
  * @method onMessageADVWaiting
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onMessageADVWaiting = function(e) {
    var messageObject;
    messageObject = e.sender.object;
    if (!this.messageSettings().waitAtEnd) {
      if (e.data.params.waitForCompletion) {
        this.isWaiting = false;
      }
      messageObject.textRenderer.isWaiting = false;
      messageObject.textRenderer.isRunning = false;
    }
    messageObject.events.off("waiting", e.handler);
    if (this.messageSettings().backlog && (messageObject.settings.autoErase || messageObject.settings.paragraphSpacing > 0)) {
      return GameManager.backlog.push({
        character: messageObject.character,
        message: messageObject.behavior.message,
        choices: []
      });
    }
  };


  /**
  * Called when an ADV message finished fade-out.
  *
  * @method onMessageADVDisappear
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onMessageADVDisappear = function(messageObject, waitForCompletion) {
    SceneManager.scene.currentCharacter = {
      name: ""
    };
    messageObject.behavior.clear();
    messageObject.visible = false;
    if (waitForCompletion) {
      this.isWaiting = false;
    }
    return this.waitingFor.messageADV = null;
  };


  /**
  * Called when an ADV message finished clear.
  *
  * @method onMessageADVClear
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onMessageADVClear = function(messageObject, waitForCompletion) {
    messageObject = this.targetMessage();
    if (this.messageSettings().backlog) {
      GameManager.backlog.push({
        character: messageObject.character,
        message: messageObject.behavior.message,
        choices: []
      });
    }
    return this.onMessageADVDisappear(messageObject, waitForCompletion);
  };


  /**
  * Called when a hotspot/image-map sends a "jumpTo" event to let the
  * interpreter jump to the position defined in the event object.
  *
  * @method onJumpTo
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onJumpTo = function(e) {
    this.jumpToLabel(e.label);
    return this.isWaiting = false;
  };


  /**
  * Called when a hotspot/image-map sends a "callCommonEvent" event to let the
  * interpreter call the common event defined in the event object.
  *
  * @method onJumpTo
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onCallCommonEvent = function(e) {
    var ref;
    this.callCommonEvent(e.commonEventId, e.params || [], !e.finish);
    return this.isWaiting = (ref = e.waiting) != null ? ref : false;
  };


  /**
  * Called when a ADV message finishes. 
  *
  * @method onMessageNVLFinish
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onMessageADVFinish = function(e) {
    var commands, duration, fading, messageObject, pointer;
    messageObject = e.sender.object;
    if (!this.messageSettings().waitAtEnd) {
      return;
    }
    GameManager.globalData.messages[lcsm(e.data.params.message)] = {
      read: true
    };
    GameManager.saveGlobalData();
    if (e.data.params.waitForCompletion) {
      this.isWaiting = false;
    }
    this.waitingFor.messageADV = null;
    pointer = this.pointer;
    commands = this.object.commands;
    messageObject.events.off("finish", e.handler);
    if ((messageObject.voice != null) && GameManager.settings.skipVoiceOnAction) {
      AudioManager.stopSound(messageObject.voice.name);
    }
    if (!this.isMessageCommand(pointer, commands) && this.messageSettings().autoErase) {
      this.isWaiting = true;
      this.waitingFor.messageADV = e.data.params;
      fading = GameManager.tempSettings.messageFading;
      duration = GameManager.tempSettings.skip ? 0 : fading.duration;
      messageObject.waitForCompletion = e.data.params.waitForCompletion;
      return messageObject.animator.disappear(fading.animation, fading.easing, duration, gs.CallBack("onMessageADVDisappear", this, e.data.params.waitForCompletion));
    }
  };


  /**
  * Called when a common event finished execution.
  *
  * @method onCommonEventFinish
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onCommonEventFinish = function(e) {
    SceneManager.scene.commonEventContainer.removeObject(e.sender.object);
    e.sender.object.events.off("finish");
    this.subInterpreter = null;
    return this.isWaiting = false;
  };


  /**
  * Called when a scene call finished execution.
  *
  * @method onCallSceneFinish
  * @param {Object} sender - The sender of this event.
  * @protected
   */

  Component_CommandInterpreter.prototype.onCallSceneFinish = function(sender) {
    this.isWaiting = false;
    return this.subInterpreter = null;
  };


  /**
  * Serializes the interpreter into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} The data-bundle.
   */

  Component_CommandInterpreter.prototype.toDataBundle = function() {
    if (this.isInputDataCommand(Math.max(this.pointer - 1, 0), this.object.commands)) {
      return {
        pointer: Math.max(this.pointer - 1, 0),
        choice: this.choice,
        conditions: this.conditions,
        loops: this.loops,
        labels: this.labels,
        isWaiting: false,
        isRunning: this.isRunning,
        waitCounter: this.waitCounter,
        waitingFor: this.waitingFor,
        indent: this.indent,
        settings: this.settings
      };
    } else {
      return {
        pointer: this.pointer,
        choice: this.choice,
        conditions: this.conditions,
        loops: this.loops,
        labels: this.labels,
        isWaiting: this.isWaiting,
        isRunning: this.isRunning,
        waitCounter: this.waitCounter,
        waitingFor: this.waitingFor,
        indent: this.indent,
        settings: this.settings
      };
    }
  };


  /**
   * Previews the current scene at the specified pointer. This method is called from the
   * VN Maker Scene-Editor if live-preview is enabled and the user clicked on a command.
   *
   * @method preview
   */

  Component_CommandInterpreter.prototype.preview = function() {
    var ex, scene;
    try {
      if (!$PARAMS.preview || !$PARAMS.preview.scene) {
        return;
      }
      GameManager.tempFields.choices = [];
      GameManager.setupCursor();
      this.previewData = $PARAMS.preview;
      gs.GlobalEventManager.emit("previewRestart");
      if (this.previewInfo.timeout) {
        clearTimeout(this.previewInfo.timeout);
      }
      if (Graphics.stopped) {
        Graphics.stopped = false;
        Graphics.onEachFrame(gs.Main.frameCallback);
      }
      scene = new vn.Object_Scene();
      scene.sceneData.uid = this.previewData.scene.uid;
      return SceneManager.switchTo(scene);
    } catch (error) {
      ex = error;
      return console.warn(ex);
    }
  };


  /**
   * Sets up the interpreter.
   *
   * @method setup
   */

  Component_CommandInterpreter.prototype.setup = function() {
    this.previewData = $PARAMS.preview;
    if (this.previewData) {
      return gs.GlobalEventManager.on("mouseDown", ((function(_this) {
        return function() {
          if (_this.previewInfo.waiting) {
            if (_this.previewInfo.timeout) {
              clearTimeout(_this.previewInfo.timeout);
            }
            _this.previewInfo.waiting = false;
            GameManager.tempSettings.skip = false;
            _this.previewData = null;
            return gs.GlobalEventManager.emit("previewRestart");
          }
        };
      })(this)), null, this.object);
    }
  };


  /**
   * Disposes the interpreter.
   *
   * @method dispose
   */

  Component_CommandInterpreter.prototype.dispose = function() {
    if (this.previewData) {
      gs.GlobalEventManager.offByOwner("mouseDown", this.object);
    }
    return Component_CommandInterpreter.__super__.dispose.apply(this, arguments);
  };

  Component_CommandInterpreter.prototype.isInstantSkip = function() {
    return GameManager.tempSettings.skip && GameManager.tempSettings.skipTime === 0;
  };


  /**
  * Restores the interpreter from a data-bundle
  *
  * @method restore
  * @param {Object} bundle- The data-bundle.
   */

  Component_CommandInterpreter.prototype.restore = function() {};


  /**
  * Gets the game message for novel-mode.
  *
  * @method messageObjectNVL
  * @return {ui.Object_Message} The NVL game message object.
   */

  Component_CommandInterpreter.prototype.messageObjectNVL = function() {
    return gs.ObjectManager.current.objectById("gameMessageNVL_message");
  };


  /**
  * Gets the game message for adventure-mode.
  *
  * @method messageObjectADV
  * @return {ui.Object_Message} The ADV game message object.
   */

  Component_CommandInterpreter.prototype.messageObjectADV = function() {
    return gs.ObjectManager.current.objectById("gameMessage_message");
  };


  /**
  * Starts the interpreter
  *
  * @method start
   */

  Component_CommandInterpreter.prototype.start = function() {
    this.conditions = [];
    this.loops = [];
    this.indent = 0;
    this.pointer = 0;
    this.isRunning = true;
    return this.isWaiting = false;
  };


  /**
  * Stops the interpreter
  *
  * @method stop
   */

  Component_CommandInterpreter.prototype.stop = function() {
    return this.isRunning = false;
  };


  /**
  * Resumes the interpreter
  *
  * @method resume
   */

  Component_CommandInterpreter.prototype.resume = function() {
    return this.isRunning = true;
  };


  /**
  * Updates the interpreter and executes all commands until the next wait is 
  * triggered by a command. So in the case of an endless-loop the method will 
  * never return.
  *
  * @method update
   */

  Component_CommandInterpreter.prototype.update = function() {
    if (this.subInterpreter != null) {
      this.subInterpreter.update();
      return;
    }
    GameManager.variableStore.setupTempVariables(this.context);
    if (((this.object.commands == null) || this.pointer >= this.object.commands.length) && !this.isWaiting) {
      if (this.repeat) {
        this.start();
      } else if (this.isRunning) {
        this.isRunning = false;
        if (this.onFinish != null) {
          this.onFinish(this);
        }
        return;
      }
    }
    if (!this.isRunning) {
      return;
    }
    if (!this.object.commands.optimized) {
      DataOptimizer.optimizeEventCommands(this.object.commands);
    }
    if (this.waitCounter > 0) {
      this.waitCounter--;
      this.isWaiting = this.waitCounter > 0;
      return;
    }
    if (this.isWaitingForMessage) {
      this.isWaiting = true;
      if (!this.isProcessingMessageInOtherContext()) {
        this.isWaiting = false;
        this.isWaitingForMessage = false;
      } else {
        return;
      }
    }
    if (GameManager.inLivePreview) {
      while (!(this.isWaiting || this.previewInfo.waiting) && this.pointer < this.object.commands.length && this.isRunning) {
        this.executeCommand(this.pointer);
        this.previewInfo.executedCommands++;
        if (this.previewInfo.executedCommands > 500) {
          this.previewInfo.executedCommands = 0;
          this.isWaiting = true;
          this.waitCounter = 1;
        }
      }
    } else {
      while (!(this.isWaiting || this.previewInfo.waiting) && this.pointer < this.object.commands.length && this.isRunning) {
        this.executeCommand(this.pointer);
      }
    }
    if (this.pointer >= this.object.commands.length && !this.isWaiting) {
      if (this.repeat) {
        return this.start();
      } else if (this.isRunning) {
        this.isRunning = false;
        if (this.onFinish != null) {
          return this.onFinish(this);
        }
      }
    }
  };


  /**
  * Assigns the correct command-function to the specified command-object if 
  * necessary.
  *
  * @method assignCommand
   */

  Component_CommandInterpreter.prototype.assignCommand = function(command) {
    switch (command.id) {
      case "gs.Idle":
        return command.execute = this.commandIdle;
      case "gs.StartTimer":
        return command.execute = this.commandStartTimer;
      case "gs.PauseTimer":
        return command.execute = this.commandPauseTimer;
      case "gs.ResumeTimer":
        return command.execute = this.commandResumeTimer;
      case "gs.StopTimer":
        return command.execute = this.commandStopTimer;
      case "gs.WaitCommand":
        return command.execute = this.commandWait;
      case "gs.LoopCommand":
        return command.execute = this.commandLoop;
      case "gs.BreakLoopCommand":
        return command.execute = this.commandBreakLoop;
      case "gs.Comment":
        return command.execute = function() {
          return 0;
        };
      case "gs.EmptyCommand":
        return command.execute = function() {
          return 0;
        };
      case "gs.ListAdd":
        return command.execute = this.commandListAdd;
      case "gs.ListPop":
        return command.execute = this.commandListPop;
      case "gs.ListShift":
        return command.execute = this.commandListShift;
      case "gs.ListRemoveAt":
        return command.execute = this.commandListRemoveAt;
      case "gs.ListInsertAt":
        return command.execute = this.commandListInsertAt;
      case "gs.ListValueAt":
        return command.execute = this.commandListValueAt;
      case "gs.ListClear":
        return command.execute = this.commandListClear;
      case "gs.ListShuffle":
        return command.execute = this.commandListShuffle;
      case "gs.ListSort":
        return command.execute = this.commandListSort;
      case "gs.ListIndexOf":
        return command.execute = this.commandListIndexOf;
      case "gs.ListSet":
        return command.execute = this.commandListSet;
      case "gs.ListCopy":
        return command.execute = this.commandListCopy;
      case "gs.ListLength":
        return command.execute = this.commandListLength;
      case "gs.ListJoin":
        return command.execute = this.commandListJoin;
      case "gs.ListFromText":
        return command.execute = this.commandListFromText;
      case "gs.ResetVariables":
        return command.execute = this.commandResetVariables;
      case "gs.ChangeVariableDomain":
        return command.execute = this.commandChangeVariableDomain;
      case "gs.ChangeNumberVariables":
        return command.execute = this.commandChangeNumberVariables;
      case "gs.ChangeDecimalVariables":
        return command.execute = this.commandChangeDecimalVariables;
      case "gs.ChangeBooleanVariables":
        return command.execute = this.commandChangeBooleanVariables;
      case "gs.ChangeStringVariables":
        return command.execute = this.commandChangeStringVariables;
      case "gs.CheckSwitch":
        return command.execute = this.commandCheckSwitch;
      case "gs.CheckNumberVariable":
        return command.execute = this.commandCheckNumberVariable;
      case "gs.CheckTextVariable":
        return command.execute = this.commandCheckTextVariable;
      case "gs.Condition":
        return command.execute = this.commandCondition;
      case "gs.ConditionElse":
        return command.execute = this.commandConditionElse;
      case "gs.ConditionElseIf":
        return command.execute = this.commandConditionElseIf;
      case "gs.Label":
        return command.execute = this.commandLabel;
      case "gs.JumpToLabel":
        return command.execute = this.commandJumpToLabel;
      case "gs.SetMessageArea":
        return command.execute = this.commandSetMessageArea;
      case "gs.ShowMessage":
        return command.execute = this.commandShowMessage;
      case "gs.ShowPartialMessage":
        return command.execute = this.commandShowPartialMessage;
      case "gs.MessageFading":
        return command.execute = this.commandMessageFading;
      case "gs.MessageSettings":
        return command.execute = this.commandMessageSettings;
      case "gs.CreateMessageArea":
        return command.execute = this.commandCreateMessageArea;
      case "gs.EraseMessageArea":
        return command.execute = this.commandEraseMessageArea;
      case "gs.SetTargetMessage":
        return command.execute = this.commandSetTargetMessage;
      case "vn.MessageBoxDefaults":
        return command.execute = this.commandMessageBoxDefaults;
      case "vn.MessageBoxVisibility":
        return command.execute = this.commandMessageBoxVisibility;
      case "vn.MessageVisibility":
        return command.execute = this.commandMessageVisibility;
      case "vn.BacklogVisibility":
        return command.execute = this.commandBacklogVisibility;
      case "vn.ShowMessageNVL":
        return command.execute = this.commandShowMessageNVL;
      case "gs.ClearMessage":
        return command.execute = this.commandClearMessage;
      case "vn.ClosePageNVL":
        return command.execute = this.commandClosePageNVL;
      case "gs.ChangeWeather":
        return command.execute = this.commandChangeWeather;
      case "gs.FreezeScreen":
        return command.execute = this.commandFreezeScreen;
      case "gs.ScreenTransition":
        return command.execute = this.commandScreenTransition;
      case "gs.ShakeScreen":
        return command.execute = this.commandShakeScreen;
      case "gs.TintScreen":
        return command.execute = this.commandTintScreen;
      case "gs.FlashScreen":
        return command.execute = this.commandFlashScreen;
      case "gs.ZoomScreen":
        return command.execute = this.commandZoomScreen;
      case "gs.RotateScreen":
        return command.execute = this.commandRotateScreen;
      case "gs.PanScreen":
        return command.execute = this.commandPanScreen;
      case "gs.ScreenEffect":
        return command.execute = this.commandScreenEffect;
      case "gs.ShowVideo":
        return command.execute = this.commandShowVideo;
      case "gs.MoveVideo":
        return command.execute = this.commandMoveVideo;
      case "gs.MoveVideoPath":
        return command.execute = this.commandMoveVideoPath;
      case "gs.TintVideo":
        return command.execute = this.commandTintVideo;
      case "gs.FlashVideo":
        return command.execute = this.commandFlashVideo;
      case "gs.CropVideo":
        return command.execute = this.commandCropVideo;
      case "gs.RotateVideo":
        return command.execute = this.commandRotateVideo;
      case "gs.ZoomVideo":
        return command.execute = this.commandZoomVideo;
      case "gs.BlendVideo":
        return command.execute = this.commandBlendVideo;
      case "gs.MaskVideo":
        return command.execute = this.commandMaskVideo;
      case "gs.VideoEffect":
        return command.execute = this.commandVideoEffect;
      case "gs.VideoMotionBlur":
        return command.execute = this.commandVideoMotionBlur;
      case "gs.VideoDefaults":
        return command.execute = this.commandVideoDefaults;
      case "gs.EraseVideo":
        return command.execute = this.commandEraseVideo;
      case "gs.ShowImageMap":
        return command.execute = this.commandShowImageMap;
      case "gs.EraseImageMap":
        return command.execute = this.commandEraseImageMap;
      case "gs.AddHotspot":
        return command.execute = this.commandAddHotspot;
      case "gs.EraseHotspot":
        return command.execute = this.commandEraseHotspot;
      case "gs.ChangeHotspotState":
        return command.execute = this.commandChangeHotspotState;
      case "gs.ShowPicture":
        return command.execute = this.commandShowPicture;
      case "gs.MovePicture":
        return command.execute = this.commandMovePicture;
      case "gs.MovePicturePath":
        return command.execute = this.commandMovePicturePath;
      case "gs.TintPicture":
        return command.execute = this.commandTintPicture;
      case "gs.FlashPicture":
        return command.execute = this.commandFlashPicture;
      case "gs.CropPicture":
        return command.execute = this.commandCropPicture;
      case "gs.RotatePicture":
        return command.execute = this.commandRotatePicture;
      case "gs.ZoomPicture":
        return command.execute = this.commandZoomPicture;
      case "gs.BlendPicture":
        return command.execute = this.commandBlendPicture;
      case "gs.ShakePicture":
        return command.execute = this.commandShakePicture;
      case "gs.MaskPicture":
        return command.execute = this.commandMaskPicture;
      case "gs.PictureEffect":
        return command.execute = this.commandPictureEffect;
      case "gs.PictureMotionBlur":
        return command.execute = this.commandPictureMotionBlur;
      case "gs.PictureDefaults":
        return command.execute = this.commandPictureDefaults;
      case "gs.PlayPictureAnimation":
        return command.execute = this.commandPlayPictureAnimation;
      case "gs.ErasePicture":
        return command.execute = this.commandErasePicture;
      case "gs.InputNumber":
        return command.execute = this.commandInputNumber;
      case "vn.Choice":
        return command.execute = this.commandShowChoice;
      case "vn.ChoiceTimer":
        return command.execute = this.commandChoiceTimer;
      case "vn.ShowChoices":
        return command.execute = this.commandShowChoices;
      case "vn.UnlockCG":
        return command.execute = this.commandUnlockCG;
      case "vn.L2DJoinScene":
        return command.execute = this.commandL2DJoinScene;
      case "vn.L2DExitScene":
        return command.execute = this.commandL2DExitScene;
      case "vn.L2DMotion":
        return command.execute = this.commandL2DMotion;
      case "vn.L2DMotionGroup":
        return command.execute = this.commandL2DMotionGroup;
      case "vn.L2DExpression":
        return command.execute = this.commandL2DExpression;
      case "vn.L2DMove":
        return command.execute = this.commandL2DMove;
      case "vn.L2DParameter":
        return command.execute = this.commandL2DParameter;
      case "vn.L2DSettings":
        return command.execute = this.commandL2DSettings;
      case "vn.L2DDefaults":
        return command.execute = this.commandL2DDefaults;
      case "vn.CharacterJoinScene":
        return command.execute = this.commandCharacterJoinScene;
      case "vn.CharacterExitScene":
        return command.execute = this.commandCharacterExitScene;
      case "vn.CharacterChangeExpression":
        return command.execute = this.commandCharacterChangeExpression;
      case "vn.CharacterSetParameter":
        return command.execute = this.commandCharacterSetParameter;
      case "vn.CharacterGetParameter":
        return command.execute = this.commandCharacterGetParameter;
      case "vn.CharacterDefaults":
        return command.execute = this.commandCharacterDefaults;
      case "vn.CharacterEffect":
        return command.execute = this.commandCharacterEffect;
      case "vn.ZoomCharacter":
        return command.execute = this.commandZoomCharacter;
      case "vn.RotateCharacter":
        return command.execute = this.commandRotateCharacter;
      case "vn.BlendCharacter":
        return command.execute = this.commandBlendCharacter;
      case "vn.ShakeCharacter":
        return command.execute = this.commandShakeCharacter;
      case "vn.MaskCharacter":
        return command.execute = this.commandMaskCharacter;
      case "vn.MoveCharacter":
        return command.execute = this.commandMoveCharacter;
      case "vn.MoveCharacterPath":
        return command.execute = this.commandMoveCharacterPath;
      case "vn.FlashCharacter":
        return command.execute = this.commandFlashCharacter;
      case "vn.TintCharacter":
        return command.execute = this.commandTintCharacter;
      case "vn.CharacterMotionBlur":
        return command.execute = this.commandCharacterMotionBlur;
      case "vn.ChangeBackground":
        return command.execute = this.commandChangeBackground;
      case "vn.ShakeBackground":
        return command.execute = this.commandShakeBackground;
      case "vn.ScrollBackground":
        return command.execute = this.commandScrollBackground;
      case "vn.ScrollBackgroundTo":
        return command.execute = this.commandScrollBackgroundTo;
      case "vn.ScrollBackgroundPath":
        return command.execute = this.commandScrollBackgroundPath;
      case "vn.ZoomBackground":
        return command.execute = this.commandZoomBackground;
      case "vn.RotateBackground":
        return command.execute = this.commandRotateBackground;
      case "vn.TintBackground":
        return command.execute = this.commandTintBackground;
      case "vn.BlendBackground":
        return command.execute = this.commandBlendBackground;
      case "vn.MaskBackground":
        return command.execute = this.commandMaskBackground;
      case "vn.BackgroundMotionBlur":
        return command.execute = this.commandBackgroundMotionBlur;
      case "vn.BackgroundEffect":
        return command.execute = this.commandBackgroundEffect;
      case "vn.BackgroundDefaults":
        return command.execute = this.commandBackgroundDefaults;
      case "vn.ChangeScene":
        return command.execute = this.commandChangeScene;
      case "vn.ReturnToPreviousScene":
        return command.execute = this.commandReturnToPreviousScene;
      case "vn.CallScene":
        return command.execute = this.commandCallScene;
      case "vn.SwitchToLayout":
        return command.execute = this.commandSwitchToLayout;
      case "gs.ChangeTransition":
        return command.execute = this.commandChangeTransition;
      case "gs.ChangeWindowSkin":
        return command.execute = this.commandChangeWindowSkin;
      case "gs.ChangeScreenTransitions":
        return command.execute = this.commandChangeScreenTransitions;
      case "vn.UIAccess":
        return command.execute = this.commandUIAccess;
      case "gs.PlayVideo":
        return command.execute = this.commandPlayVideo;
      case "gs.PlayMusic":
        return command.execute = this.commandPlayMusic;
      case "gs.StopMusic":
        return command.execute = this.commandStopMusic;
      case "gs.PlaySound":
        return command.execute = this.commandPlaySound;
      case "gs.StopSound":
        return command.execute = this.commandStopSound;
      case "gs.PauseMusic":
        return command.execute = this.commandPauseMusic;
      case "gs.ResumeMusic":
        return command.execute = this.commandResumeMusic;
      case "gs.AudioDefaults":
        return command.execute = this.commandAudioDefaults;
      case "gs.EndCommonEvent":
        return command.execute = this.commandEndCommonEvent;
      case "gs.ResumeCommonEvent":
        return command.execute = this.commandResumeCommonEvent;
      case "gs.CallCommonEvent":
        return command.execute = this.commandCallCommonEvent;
      case "gs.ChangeTimer":
        return command.execute = this.commandChangeTimer;
      case "gs.ShowText":
        return command.execute = this.commandShowText;
      case "gs.RefreshText":
        return command.execute = this.commandRefreshText;
      case "gs.TextMotionBlur":
        return command.execute = this.commandTextMotionBlur;
      case "gs.MoveText":
        return command.execute = this.commandMoveText;
      case "gs.MoveTextPath":
        return command.execute = this.commandMoveTextPath;
      case "gs.RotateText":
        return command.execute = this.commandRotateText;
      case "gs.ZoomText":
        return command.execute = this.commandZoomText;
      case "gs.BlendText":
        return command.execute = this.commandBlendText;
      case "gs.ColorText":
        return command.execute = this.commandColorText;
      case "gs.EraseText":
        return command.execute = this.commandEraseText;
      case "gs.TextEffect":
        return command.execute = this.commandTextEffect;
      case "gs.TextDefaults":
        return command.execute = this.commandTextDefaults;
      case "gs.ChangeTextSettings":
        return command.execute = this.commandChangeTextSettings;
      case "gs.InputText":
        return command.execute = this.commandInputText;
      case "gs.InputName":
        return command.execute = this.commandInputName;
      case "gs.SavePersistentData":
        return command.execute = this.commandSavePersistentData;
      case "gs.SaveSettings":
        return command.execute = this.commandSaveSettings;
      case "gs.PrepareSaveGame":
        return command.execute = this.commandPrepareSaveGame;
      case "gs.SaveGame":
        return command.execute = this.commandSaveGame;
      case "gs.LoadGame":
        return command.execute = this.commandLoadGame;
      case "gs.GetInputData":
        return command.execute = this.commandGetInputData;
      case "gs.WaitForInput":
        return command.execute = this.commandWaitForInput;
      case "gs.ChangeObjectDomain":
        return command.execute = this.commandChangeObjectDomain;
      case "vn.GetGameData":
        return command.execute = this.commandGetGameData;
      case "vn.SetGameData":
        return command.execute = this.commandSetGameData;
      case "vn.GetObjectData":
        return command.execute = this.commandGetObjectData;
      case "vn.SetObjectData":
        return command.execute = this.commandSetObjectData;
      case "vn.ChangeSounds":
        return command.execute = this.commandChangeSounds;
      case "vn.ChangeColors":
        return command.execute = this.commandChangeColors;
      case "gs.ChangeScreenCursor":
        return command.execute = this.commandChangeScreenCursor;
      case "gs.ResetGlobalData":
        return command.execute = this.commandResetGlobalData;
      case "gs.Script":
        return command.execute = this.commandScript;
    }
  };


  /**
  * Executes the command at the specified index and increases the command-pointer.
  *
  * @method executeCommand
   */

  Component_CommandInterpreter.prototype.executeCommand = function(index) {
    var indent;
    this.command = this.object.commands[index];
    if (this.previewData) {
      if (this.pointer < this.previewData.pointer) {
        GameManager.tempSettings.skip = true;
        GameManager.tempSettings.skipTime = 0;
      } else {
        GameManager.tempSettings.skip = this.previewData.settings.animationDisabled;
        GameManager.tempSettings.skipTime = 0;
        this.previewInfo.waiting = true;
        gs.GlobalEventManager.emit("previewWaiting");
        if (this.previewData.settings.animationDisabled || this.previewData.settings.animationTime > 0) {
          this.previewInfo.timeout = setTimeout((function() {
            return Graphics.stopped = true;
          }), this.previewData.settings.animationTime * 1000);
        }
      }
    }
    if (this.command.execute != null) {
      this.command.interpreter = this;
      if (this.command.indent === this.indent) {
        this.command.execute();
      }
      this.pointer++;
      this.command = this.object.commands[this.pointer];
      if (this.command != null) {
        indent = this.command.indent;
      } else {
        indent = this.indent;
        while (indent > 0 && (this.loops[indent] == null)) {
          indent--;
        }
      }
      if (indent < this.indent) {
        this.indent = indent;
        if (this.loops[this.indent] != null) {
          this.pointer = this.loops[this.indent];
          this.command = this.object.commands[this.pointer];
          return this.command.interpreter = this;
        }
      }
    } else {
      this.assignCommand(this.command);
      if (this.command.execute != null) {
        this.command.interpreter = this;
        if (this.command.indent === this.indent) {
          this.command.execute();
        }
        this.pointer++;
        this.command = this.object.commands[this.pointer];
        if (this.command != null) {
          indent = this.command.indent;
        } else {
          indent = this.indent;
          while (indent > 0 && (this.loops[indent] == null)) {
            indent--;
          }
        }
        if (indent < this.indent) {
          this.indent = indent;
          if (this.loops[this.indent] != null) {
            this.pointer = this.loops[this.indent];
            this.command = this.object.commands[this.pointer];
            return this.command.interpreter = this;
          }
        }
      } else {
        return this.pointer++;
      }
    }
  };


  /**
  * Skips all commands until a command with the specified indent-level is 
  * found. So for example: To jump from a Condition-Command to the next
  * Else-Command just pass the indent-level of the Condition/Else command.
  *
  * @method skip
  * @param {number} indent - The indent-level.
  * @param {boolean} backward - If true the skip runs backward.
   */

  Component_CommandInterpreter.prototype.skip = function(indent, backward) {
    var results, results1;
    if (backward) {
      this.pointer--;
      results = [];
      while (this.pointer > 0 && this.object.commands[this.pointer].indent !== indent) {
        results.push(this.pointer--);
      }
      return results;
    } else {
      this.pointer++;
      results1 = [];
      while (this.pointer < this.object.commands.length && this.object.commands[this.pointer].indent !== indent) {
        results1.push(this.pointer++);
      }
      return results1;
    }
  };


  /**
  * Halts the interpreter for the specified amount of time. An optionally
  * callback function can be passed which is called when the time is up.
  *
  * @method wait
  * @param {number} time - The time to wait
  * @param {gs.Callback} callback - Called if the wait time is up.
   */

  Component_CommandInterpreter.prototype.wait = function(time, callback) {
    this.isWaiting = true;
    this.waitCounter = time;
    return this.waitCallback = callback;
  };


  /**
  * Checks if the command at the specified pointer-index is a game message
  * related command.
  *
  * @method isMessageCommand
  * @param {number} pointer - The pointer/index.
  * @param {Object[]} commands - The list of commands to check.
  * @return {boolean} <b>true</b> if its a game message related command. Otherwise <b>false</b>.
   */

  Component_CommandInterpreter.prototype.isMessageCommand = function(pointer, commands) {
    var result;
    result = true;
    if (pointer >= commands.length || (commands[pointer].id !== "gs.InputNumber" && commands[pointer].id !== "vn.Choice" && commands[pointer].id !== "gs.InputText" && commands[pointer].id !== "gs.InputName")) {
      result = false;
    }
    return result;
  };


  /**
  * Checks if the command at the specified pointer-index asks for user-input like
  * the Input Number or Input Text command.
  *
  * @method isInputDataCommand
  * @param {number} pointer - The pointer/index.
  * @param {Object[]} commands - The list of commands to check.
  * @return {boolean} <b>true</b> if its an input-data command. Otherwise <b>false</b>
   */

  Component_CommandInterpreter.prototype.isInputDataCommand = function(pointer, commands) {
    return pointer < commands.length && (commands[pointer].id === "gs.InputNumber" || commands[pointer].id === "gs.InputText" || commands[pointer].id === "vn.Choice" || commands[pointer].id === "vn.ShowChoices");
  };


  /**
  * Checks if a game message is currently running by another interpreter like a
  * common-event interpreter.
  *
  * @method isProcessingMessageInOtherContext
  * @return {boolean} <b>true</b> a game message is running in another context. Otherwise <b>false</b>
   */

  Component_CommandInterpreter.prototype.isProcessingMessageInOtherContext = function() {
    var gm, result, s;
    result = false;
    gm = GameManager;
    s = SceneManager.scene;
    result = ((s.inputNumberWindow != null) && s.inputNumberWindow.visible && s.inputNumberWindow.executionContext !== this.context) || ((s.inputTextWindow != null) && s.inputTextWindow.active && s.inputTextWindow.executionContext !== this.context);
    return result;
  };


  /**
  * If a game message is currently running by an other interpreter like a common-event
  * interpreter, this method trigger a wait until the other interpreter is finished
  * with the game message.
  *
  * @method waitForMessage
  * @return {boolean} <b>true</b> a game message is running in another context. Otherwise <b>false</b>
   */

  Component_CommandInterpreter.prototype.waitForMessage = function() {
    this.isWaitingForMessage = true;
    this.isWaiting = true;
    return this.pointer--;
  };


  /**
  * Gets the value the number variable at the specified index.
  *
  * @method numberValueAtIndex
  * @param {number} scope - The variable's scope.
  * @param {number} index - The index of the variable to get the value from.
  * @return {Number} The value of the variable.
   */

  Component_CommandInterpreter.prototype.numberValueAtIndex = function(scope, index) {
    return GameManager.variableStore.numberValueAtIndex(scope, index);
  };


  /**
  * Gets the value of a (possible) number variable. If a constant number value is specified, this method
  * does nothing an just returns that constant value. That's to make it more comfortable to just pass a value which
  * can be calculated by variable but also be just a constant value.
  *
  * @method numberValueOf
  * @param {number|Object} object - A number variable or constant number value.
  * @return {Number} The value of the variable.
   */

  Component_CommandInterpreter.prototype.numberValueOf = function(object) {
    return GameManager.variableStore.numberValueOf(object);
  };


  /**
  * It does the same like <b>numberValueOf</b> with one difference: If the specified object
  * is a variable, it's value is considered as a duration-value in milliseconds and automatically converted
  * into frames.
  *
  * @method durationValueOf
  * @param {number|Object} object - A number variable or constant number value.
  * @return {Number} The value of the variable.
   */

  Component_CommandInterpreter.prototype.durationValueOf = function(object) {
    if (object && (object.index != null)) {
      return Math.round(GameManager.variableStore.numberValueOf(object) / 1000 * Graphics.frameRate);
    } else {
      return Math.round(GameManager.variableStore.numberValueOf(object));
    }
  };


  /**
  * Gets a position ({x, y}) for the specified predefined object position configured in 
  * Database - System.
  *
  * @method predefinedObjectPosition
  * @param {number} position - The index/ID of the predefined object position to set.
  * @param {gs.Object_Base} object - The game object to set the position for.
  * @param {Object} params - The params object of the scene command.
  * @return {Object} The position {x, y}.
   */

  Component_CommandInterpreter.prototype.predefinedObjectPosition = function(position, object, params) {
    var f, objectPosition;
    objectPosition = RecordManager.system.objectPositions[position];
    if (!objectPosition) {
      return {
        x: 0,
        y: 0
      };
    }
    if (objectPosition.func == null) {
      f = eval("(function(object, params){" + objectPosition.script + "})");
      objectPosition.func = f;
    }
    return objectPosition.func(object, params) || {
      x: 0,
      y: 0
    };
  };


  /**
  * Sets the value of a number variable at the specified index.
  *
  * @method setNumberValueAtIndex
  * @param {number} scope - The variable's scope.
  * @param {number} index - The index of the variable to set.
  * @param {number} value - The number value to set the variable to.
   */

  Component_CommandInterpreter.prototype.setNumberValueAtIndex = function(scope, index, value, domain) {
    return GameManager.variableStore.setNumberValueAtIndex(scope, index, value, domain);
  };


  /**
  * Sets the value of a number variable.
  *
  * @method setNumberValueTo
  * @param {number} variable - The variable to set.
  * @param {number} value - The number value to set the variable to.
   */

  Component_CommandInterpreter.prototype.setNumberValueTo = function(variable, value) {
    return GameManager.variableStore.setNumberValueTo(variable, value);
  };


  /**
  * Sets the value of a list variable.
  *
  * @method setListObjectTo
  * @param {Object} variable - The variable to set.
  * @param {Object} value - The list object to set the variable to.
   */

  Component_CommandInterpreter.prototype.setListObjectTo = function(variable, value) {
    return GameManager.variableStore.setListObjectTo(variable, value);
  };


  /**
  * Sets the value of a boolean/switch variable.
  *
  * @method setBooleanValueTo
  * @param {Object} variable - The variable to set.
  * @param {boolean} value - The boolean value to set the variable to.
   */

  Component_CommandInterpreter.prototype.setBooleanValueTo = function(variable, value) {
    return GameManager.variableStore.setBooleanValueTo(variable, value);
  };


  /**
  * Sets the value of a number variable at the specified index.
  *
  * @method setBooleanValueAtIndex
  * @param {number} scope - The variable's scope.
  * @param {number} index - The index of the variable to set.
  * @param {boolean} value - The boolean value to set the variable to.
   */

  Component_CommandInterpreter.prototype.setBooleanValueAtIndex = function(scope, index, value, domain) {
    return GameManager.variableStore.setBooleanValueAtIndex(scope, index, value, domain);
  };


  /**
  * Sets the value of a string/text variable.
  *
  * @method setStringValueTo
  * @param {Object} variable - The variable to set.
  * @param {string} value - The string/text value to set the variable to.
   */

  Component_CommandInterpreter.prototype.setStringValueTo = function(variable, value) {
    return GameManager.variableStore.setStringValueTo(variable, value);
  };


  /**
  * Sets the value of the string variable at the specified index.
  *
  * @method setStringValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @param {string} value - The value to set.
   */

  Component_CommandInterpreter.prototype.setStringValueAtIndex = function(scope, index, value, domain) {
    return GameManager.variableStore.setStringValueAtIndex(scope, index, value, domain);
  };


  /**
  * Gets the value of a (possible) string variable. If a constant string value is specified, this method
  * does nothing an just returns that constant value. That's to make it more comfortable to just pass a value which
  * can be calculated by variable but also be just a constant value.
  *
  * @method stringValueOf
  * @param {string|Object} object - A string variable or constant string value.
  * @return {string} The value of the variable.
   */

  Component_CommandInterpreter.prototype.stringValueOf = function(object) {
    return GameManager.variableStore.stringValueOf(object);
  };


  /**
  * Gets the value of the string variable at the specified index.
  *
  * @method stringValueAtIndex
  * @param {number} scope - The variable's scope.
  * @param {number} index - The index of the variable to get the value from.
  * @return {string} The value of the variable.
   */

  Component_CommandInterpreter.prototype.stringValueAtIndex = function(scope, index, domain) {
    return GameManager.variableStore.stringValueAtIndex(scope, index, domain);
  };


  /**
  * Gets the value of a (possible) boolean variable. If a constant boolean value is specified, this method
  * does nothing an just returns that constant value. That's to make it more comfortable to just pass a value which
  * can be calculated by variable but also be just a constant value.
  *
  * @method booleanValueOf
  * @param {boolean|Object} object - A boolean variable or constant boolean value.
  * @return {boolean} The value of the variable.
   */

  Component_CommandInterpreter.prototype.booleanValueOf = function(object) {
    return GameManager.variableStore.booleanValueOf(object);
  };


  /**
  * Gets the value of the boolean variable at the specified index.
  *
  * @method booleanValueAtIndex
  * @param {number} scope - The variable's scope.
  * @param {number} index - The index of the variable to get the value from.
  * @return {string} The value of the variable.
   */

  Component_CommandInterpreter.prototype.booleanValueAtIndex = function(scope, index, domain) {
    return GameManager.variableStore.booleanValueAtIndex(scope, index, domain);
  };


  /**
  * Gets the value of a (possible) list variable.
  *
  * @method listObjectOf
  * @param {Object} object - A list variable.
  * @return {Object} The value of the list variable.
   */

  Component_CommandInterpreter.prototype.listObjectOf = function(object) {
    return GameManager.variableStore.listObjectOf(object);
  };


  /**
  * Compares two object using the specified operation and returns the result.
  *
  * @method compare
  * @param {Object} a - Object A.
  * @param {Object} b - Object B.
  * @param {number} operation - The compare-operation to compare Object A with Object B.
  * <ul>
  * <li>0 = Equal To</li>
  * <li>1 = Not Equal To</li>
  * <li>2 = Greater Than</li>
  * <li>3 = Greater or Equal To</li>
  * <li>4 = Less Than</li>
  * <li>5 = Less or Equal To</li>
  * </ul>
  * @return {boolean} The comparison result.
   */

  Component_CommandInterpreter.prototype.compare = function(a, b, operation) {
    switch (operation) {
      case 0:
        return a == b;
      case 1:
        return a != b;
      case 2:
        return a > b;
      case 3:
        return a >= b;
      case 4:
        return a < b;
      case 5:
        return a <= b;
    }
  };


  /**
  * Changes number variables and allows decimal values such as 0.5 too.
  *
  * @method changeDecimalVariables
  * @param {Object} params - Input params from the command
  * @param {Object} roundMethod - The result of the operation will be rounded using the specified method.
  * <ul>
  * <li>0 = None. The result will not be rounded.</li>
  * <li>1 = Commercially</li>
  * <li>2 = Round Up</li>
  * <li>3 = Round Down</li>
  * </ul>
   */

  Component_CommandInterpreter.prototype.changeDecimalVariables = function(params, roundMethod) {
    var diff, end, i, index, k, ref, ref1, roundFunc, scope, source, start;
    source = 0;
    roundFunc = null;
    switch (roundMethod) {
      case 0:
        roundFunc = function(value) {
          return value;
        };
        break;
      case 1:
        roundFunc = function(value) {
          return Math.round(value);
        };
        break;
      case 2:
        roundFunc = function(value) {
          return Math.ceil(value);
        };
        break;
      case 3:
        roundFunc = function(value) {
          return Math.floor(value);
        };
    }
    switch (params.source) {
      case 0:
        source = this.numberValueOf(params.sourceValue);
        break;
      case 1:
        start = this.numberValueOf(params.sourceRandom.start);
        end = this.numberValueOf(params.sourceRandom.end);
        diff = end - start;
        source = Math.floor(start + Math.random() * (diff + 1));
        break;
      case 2:
        source = this.numberValueAtIndex(params.sourceScope, this.numberValueOf(params.sourceReference) - 1, params.sourceReferenceDomain);
        break;
      case 3:
        source = this.numberValueOfGameData(params.sourceValue1);
        break;
      case 4:
        source = this.numberValueOfDatabaseData(params.sourceValue1);
    }
    switch (params.target) {
      case 0:
        switch (params.operation) {
          case 0:
            this.setNumberValueTo(params.targetVariable, roundFunc(source));
            break;
          case 1:
            this.setNumberValueTo(params.targetVariable, roundFunc(this.numberValueOf(params.targetVariable) + source));
            break;
          case 2:
            this.setNumberValueTo(params.targetVariable, roundFunc(this.numberValueOf(params.targetVariable) - source));
            break;
          case 3:
            this.setNumberValueTo(params.targetVariable, roundFunc(this.numberValueOf(params.targetVariable) * source));
            break;
          case 4:
            this.setNumberValueTo(params.targetVariable, roundFunc(this.numberValueOf(params.targetVariable) / source));
            break;
          case 5:
            this.setNumberValueTo(params.targetVariable, this.numberValueOf(params.targetVariable) % source);
        }
        break;
      case 1:
        scope = params.targetScope;
        start = params.targetRange.start - 1;
        end = params.targetRange.end - 1;
        for (i = k = ref = start, ref1 = end; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
          switch (params.operation) {
            case 0:
              this.setNumberValueAtIndex(scope, i, roundFunc(source));
              break;
            case 1:
              this.setNumberValueAtIndex(scope, i, roundFunc(this.numberValueAtIndex(scope, i) + source));
              break;
            case 2:
              this.setNumberValueAtIndex(scope, i, roundFunc(this.numberValueAtIndex(scope, i) - source));
              break;
            case 3:
              this.setNumberValueAtIndex(scope, i, roundFunc(this.numberValueAtIndex(scope, i) * source));
              break;
            case 4:
              this.setNumberValueAtIndex(scope, i, roundFunc(this.numberValueAtIndex(scope, i) / source));
              break;
            case 5:
              this.setNumberValueAtIndex(scope, i, this.numberValueAtIndex(scope, i) % source);
          }
        }
        break;
      case 2:
        index = this.numberValueOf(params.targetReference) - 1;
        switch (params.operation) {
          case 0:
            this.setNumberValueAtIndex(params.targetScope, index, roundFunc(source), params.targetReferenceDomain);
            break;
          case 1:
            this.setNumberValueAtIndex(params.targetScope, index, roundFunc(this.numberValueAtIndex(params.targetScope, index, params.targetReferenceDomain) + source), params.targetReferenceDomain);
            break;
          case 2:
            this.setNumberValueAtIndex(params.targetScope, index, roundFunc(this.numberValueAtIndex(params.targetScope, index, params.targetReferenceDomain) - source), params.targetReferenceDomain);
            break;
          case 3:
            this.setNumberValueAtIndex(params.targetScope, index, roundFunc(this.numberValueAtIndex(params.targetScope, index, params.targetReferenceDomain) * source), params.targetReferenceDomain);
            break;
          case 4:
            this.setNumberValueAtIndex(params.targetScope, index, roundFunc(this.numberValueAtIndex(params.targetScope, index, params.targetReferenceDomain) / source), params.targetReferenceDomain);
            break;
          case 5:
            this.setNumberValueAtIndex(params.targetScope, index, this.numberValueAtIndex(params.targetScope, index, params.targetReferenceDomain) % source, params.targetReferenceDomain);
        }
    }
    return null;
  };


  /**
  * Shakes a game object.
  *
  * @method shakeObject
  * @param {gs.Object_Base} object - The game object to shake.
  * @return {Object} A params object containing additional info about the shake-animation.
   */

  Component_CommandInterpreter.prototype.shakeObject = function(object, params) {
    var duration, easing;
    duration = Math.max(Math.round(this.durationValueOf(params.duration)), 2);
    easing = gs.Easings.fromObject(params.easing);
    object.animator.shake({
      x: this.numberValueOf(params.range.x),
      y: this.numberValueOf(params.range.y)
    }, this.numberValueOf(params.speed) / 100, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Lets the interpreter wait for the completion of a running operation like an animation, etc.
  *
  * @method waitForCompletion
  * @param {gs.Object_Base} object - The game object the operation is executed on. Can be <b>null</b>.
  * @return {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.waitForCompletion = function(object, params) {
    var duration;
    duration = this.durationValueOf(params.duration);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Erases a game object.
  *
  * @method eraseObject
  * @param {gs.Object_Base} object - The game object to erase.
  * @return {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.eraseObject = function(object, params) {
    var duration, easing;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.disappear(params.animation, easing, duration, (function(_this) {
      return function(sender) {
        return sender.dispose();
      };
    })(this));
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Shows a game object on screen.
  *
  * @method showObject
  * @param {gs.Object_Base} object - The game object to show.
  * @param {gs.Point} position - The position where the game object should be shown.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.showObject = function(object, position, params) {
    var duration, easing, x, y;
    x = this.numberValueOf(position.x);
    y = this.numberValueOf(position.y);
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.appear(x, y, params.animation, easing, duration);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Moves a game object.
  *
  * @method moveObject
  * @param {gs.Object_Base} object - The game object to move.
  * @param {gs.Point} position - The position to move the game object to.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.moveObject = function(object, position, params) {
    var duration, easing, p, x, y;
    if (params.positionType === 0) {
      p = this.predefinedObjectPosition(params.predefinedPositionId, object, params);
      x = p.x;
      y = p.y;
    } else {
      x = this.numberValueOf(position.x);
      y = this.numberValueOf(position.y);
    }
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.moveTo(x, y, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Moves a game object along a path.
  *
  * @method moveObjectPath
  * @param {gs.Object_Base} object - The game object to move.
  * @param {Object} path - The path to move the game object along.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.moveObjectPath = function(object, path, params) {
    var duration, easing, ref;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.movePath(path.data, params.loopType, duration, easing, (ref = path.effects) != null ? ref.data : void 0);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Scrolls a scrollable game object along a path.
  *
  * @method scrollObjectPath
  * @param {gs.Object_Base} object - The game object to scroll.
  * @param {Object} path - The path to scroll the game object along.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.scrollObjectPath = function(object, path, params) {
    var duration, easing;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.scrollPath(path, params.loopType, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Zooms/Scales a game object.
  *
  * @method zoomObject
  * @param {gs.Object_Base} object - The game object to zoom.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.zoomObject = function(object, params) {
    var duration, easing;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.zoomTo(this.numberValueOf(params.zooming.x) / 100, this.numberValueOf(params.zooming.y) / 100, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Rotates a game object.
  *
  * @method rotateObject
  * @param {gs.Object_Base} object - The game object to rotate.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.rotateObject = function(object, params) {
    var duration, easing;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    easing = gs.Easings.fromObject(params.easing);
    object.animator.rotate(params.direction, this.numberValueOf(params.speed) / 100, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Blends a game object.
  *
  * @method blendObject
  * @param {gs.Object_Base} object - The game object to blend.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.blendObject = function(object, params) {
    var duration, easing;
    easing = gs.Easings.fromObject(params.easing);
    duration = this.durationValueOf(params.duration);
    object.animator.blendTo(this.numberValueOf(params.opacity), duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Executes a masking-effect on a game object..
  *
  * @method maskObject
  * @param {gs.Object_Base} object - The game object to execute a masking-effect on.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.maskObject = function(object, params) {
    var duration, easing, ref, ref1, ref2;
    easing = gs.Easings.fromObject(params.easing);
    if (params.mask.type === 0) {
      object.mask.type = 0;
      object.mask.ox = this.numberValueOf(params.mask.ox);
      object.mask.oy = this.numberValueOf(params.mask.oy);
      if (((ref = object.mask.source) != null ? ref.videoElement : void 0) != null) {
        object.mask.source.pause();
      }
      if (params.mask.sourceType === 0) {
        object.mask.source = ResourceManager.getBitmap("Graphics/Masks/" + ((ref1 = params.mask.graphic) != null ? ref1.name : void 0));
      } else {
        object.mask.source = ResourceManager.getVideo("Movies/" + ((ref2 = params.mask.video) != null ? ref2.name : void 0));
        if (object.mask.source) {
          object.mask.source.play();
          object.mask.source.loop = true;
        }
      }
    } else {
      duration = this.durationValueOf(params.duration);
      object.animator.maskTo(params.mask, duration, easing);
    }
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Tints a game object.
  *
  * @method tintObject
  * @param {gs.Object_Base} object - The game object to tint.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.tintObject = function(object, params) {
    var duration, easing;
    duration = this.durationValueOf(params.duration);
    easing = gs.Easings.fromObject(params.easing);
    object.animator.tintTo(params.tone, duration, easing);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Flashes a game object.
  *
  * @method flashObject
  * @param {gs.Object_Base} object - The game object to flash.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.flashObject = function(object, params) {
    var duration;
    duration = this.durationValueOf(params.duration);
    object.animator.flash(new Color(params.color), duration);
    if (params.waitForCompletion && !(duration === 0 || this.isInstantSkip())) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Cropes a game object.
  *
  * @method cropObject
  * @param {gs.Object_Base} object - The game object to crop.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.cropObject = function(object, params) {
    object.srcRect.x = this.numberValueOf(params.x);
    object.srcRect.y = this.numberValueOf(params.y);
    object.srcRect.width = this.numberValueOf(params.width);
    object.srcRect.height = this.numberValueOf(params.height);
    object.dstRect.width = this.numberValueOf(params.width);
    return object.dstRect.height = this.numberValueOf(params.height);
  };


  /**
  * Sets the motion blur settings of a game object.
  *
  * @method objectMotionBlur
  * @param {gs.Object_Base} object - The game object to set the motion blur settings for.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.objectMotionBlur = function(object, params) {
    return object.motionBlur.set(params.motionBlur);
  };


  /**
  * Enables an effect on a game object.
  *
  * @method objectEffect
  * @param {gs.Object_Base} object - The game object to execute a masking-effect on.
  * @param {Object} A params object containing additional info.
   */

  Component_CommandInterpreter.prototype.objectEffect = function(object, params) {
    var duration, easing, wobble;
    duration = this.durationValueOf(params.duration);
    easing = gs.Easings.fromObject(params.easing);
    switch (params.type) {
      case 0:
        object.animator.wobbleTo(params.wobble.power / 10000, params.wobble.speed / 100, duration, easing);
        wobble = object.effects.wobble;
        wobble.enabled = params.wobble.power > 0;
        wobble.vertical = params.wobble.orientation === 0 || params.wobble.orientation === 2;
        wobble.horizontal = params.wobble.orientation === 1 || params.wobble.orientation === 2;
        break;
      case 1:
        object.animator.blurTo(params.blur.power / 100, duration, easing);
        object.effects.blur.enabled = true;
        break;
      case 2:
        object.animator.pixelateTo(params.pixelate.size.width, params.pixelate.size.height, duration, easing);
        object.effects.pixelate.enabled = true;
    }
    if (params.waitForCompletion && duration !== 0) {
      this.isWaiting = true;
      return this.waitCounter = duration;
    }
  };


  /**
  * Executes an action like for a hotspot.
  *
  * @method executeAction
  * @param {Object} action - Action-Data.
  * @param {boolean} stateValue - In case of switch-binding, the switch is set to this value.
  * @param {number} bindValue - A number value which be put into the action's bind-value variable.
   */

  Component_CommandInterpreter.prototype.executeAction = function(action, stateValue, bindValue) {
    var domain, ref;
    switch (action.type) {
      case 0:
        if (action.labelIndex) {
          return this.pointer = action.labelIndex;
        } else {
          return this.jumpToLabel(action.label);
        }
        break;
      case 1:
        return this.callCommonEvent(action.commonEventId, null, this.isWaiting);
      case 2:
        domain = GameManager.variableStore.domain;
        return this.setBooleanValueTo(action["switch"], stateValue);
      case 3:
        return this.callScene((ref = action.scene) != null ? ref.uid : void 0);
      case 4:
        domain = GameManager.variableStore.domain;
        this.setNumberValueTo(action.bindValueVariable, bindValue);
        if (action.labelIndex) {
          return this.pointer = action.labelIndex;
        } else {
          return this.jumpToLabel(action.label);
        }
    }
  };


  /**
  * Calls a common event and returns the sub-interpreter for it.
  *
  * @method callCommonEvent
  * @param {number} id - The ID of the common event to call.
  * @param {Object} parameters - Optional common event parameters.
  * @param {boolean} wait - Indicates if the interpreter should be stay in waiting-mode even if the sub-interpreter is finished.
   */

  Component_CommandInterpreter.prototype.callCommonEvent = function(id, parameters, wait) {
    var commonEvent, ref;
    commonEvent = GameManager.commonEvents[id];
    if (commonEvent != null) {
      if (SceneManager.scene.commonEventContainer.subObjects.indexOf(commonEvent) === -1) {
        SceneManager.scene.commonEventContainer.addObject(commonEvent);
      }
      if ((ref = commonEvent.events) != null) {
        ref.on("finish", gs.CallBack("onCommonEventFinish", this));
      }
      this.subInterpreter = commonEvent.behavior.call(parameters || [], this.settings, this.context);
      commonEvent.behavior.update();
      if (this.subInterpreter != null) {
        this.isWaiting = true;
        this.subInterpreter.settings = this.settings;
        this.subInterpreter.start();
        return this.subInterpreter.update();
      }
    }
  };


  /**
  * Calls a scene and returns the sub-interpreter for it.
  *
  * @method callScene
  * @param {String} uid - The UID of the scene to call.
   */

  Component_CommandInterpreter.prototype.callScene = function(uid) {
    var object, sceneDocument;
    sceneDocument = DataManager.getDocument(uid);
    if (sceneDocument != null) {
      this.isWaiting = true;
      this.subInterpreter = new vn.Component_CallSceneInterpreter();
      object = {
        commands: sceneDocument.items.commands
      };
      this.subInterpreter.repeat = false;
      this.subInterpreter.context.set(sceneDocument.uid, sceneDocument);
      this.subInterpreter.object = object;
      this.subInterpreter.onFinish = gs.CallBack("onCallSceneFinish", this);
      this.subInterpreter.start();
      this.subInterpreter.settings = this.settings;
      return this.subInterpreter.update();
    }
  };


  /**
  * Calls a common event and returns the sub-interpreter for it.
  *
  * @method storeListValue
  * @param {number} id - The ID of the common event to call.
  * @param {Object} parameters - Optional common event parameters.
  * @param {boolean} wait - Indicates if the interpreter should be stay in waiting-mode even if the sub-interpreter is finished.
   */

  Component_CommandInterpreter.prototype.storeListValue = function(variable, list, value, valueType) {
    switch (valueType) {
      case 0:
        return this.setNumberValueTo(variable, (!isNaN(value) ? value : 0));
      case 1:
        return this.setBooleanValueTo(variable, (value ? 1 : 0));
      case 2:
        return this.setStringValueTo(variable, value.toString());
      case 3:
        return this.setListObjectTo(variable, (value.length != null ? value : []));
    }
  };


  /**
  * @method jumpToLabel
   */

  Component_CommandInterpreter.prototype.jumpToLabel = function(label) {
    var found, i, k, ref;
    if (!label) {
      return;
    }
    found = false;
    for (i = k = 0, ref = this.object.commands.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      if (this.object.commands[i].id === "gs.Label" && this.object.commands[i].params.name === label) {
        this.pointer = i;
        this.indent = this.object.commands[i].indent;
        found = true;
        break;
      }
    }
    if (found) {
      this.waitCounter = 0;
      return this.isWaiting = false;
    }
  };


  /**
  * Gets the current message box object depending on game mode (ADV or NVL).
  *
  * @method messageBoxObject
  * @return {gs.Object_Base} The message box object.
  * @protected
   */

  Component_CommandInterpreter.prototype.messageBoxObject = function(id) {
    if (SceneManager.scene.layout.visible) {
      return gs.ObjectManager.current.objectById(id || "messageBox");
    } else {
      return gs.ObjectManager.current.objectById(id || "messageBoxNVL");
    }
  };


  /**
  * Gets the current message object depending on game mode (ADV or NVL).
  *
  * @method messageObject
  * @return {ui.Object_Message} The message object.
  * @protected
   */

  Component_CommandInterpreter.prototype.messageObject = function() {
    if (SceneManager.scene.layout.visible) {
      return gs.ObjectManager.current.objectById("gameMessage_message");
    } else {
      return gs.ObjectManager.current.objectById("gameMessageNVL_message");
    }
  };


  /**
  * Gets the current message ID depending on game mode (ADV or NVL).
  *
  * @method messageObjectId
  * @return {string} The message object ID.
  * @protected
   */

  Component_CommandInterpreter.prototype.messageObjectId = function() {
    if (SceneManager.scene.layout.visible) {
      return "gameMessage_message";
    } else {
      return "gameMessageNVL_message";
    }
  };


  /**
  * Gets the current message settings.
  *
  * @method messageSettings
  * @return {Object} The message settings
  * @protected
   */

  Component_CommandInterpreter.prototype.messageSettings = function() {
    var message;
    message = this.targetMessage();
    return message.settings;
  };


  /**
  * Gets the current target message object where all message commands are executed on.
  *
  * @method targetMessage
  * @return {ui.Object_Message} The target message object.
  * @protected
   */

  Component_CommandInterpreter.prototype.targetMessage = function() {
    var message, ref, ref1, ref2, target;
    message = this.messageObject();
    target = this.settings.message.target;
    if (target != null) {
      switch (target.type) {
        case 0:
          message = (ref = gs.ObjectManager.current.objectById(target.id)) != null ? ref : this.messageObject();
          break;
        case 1:
          message = (ref1 = (ref2 = SceneManager.scene.messageAreas[target.id]) != null ? ref2.message : void 0) != null ? ref1 : this.messageObject();
      }
    }
    return message;
  };


  /**
  * Gets the current target message box containing the current target message.
  *
  * @method targetMessageBox
  * @return {ui.Object_UIElement} The target message box.
  * @protected
   */

  Component_CommandInterpreter.prototype.targetMessageBox = function() {
    var messageBox, ref, ref1, target;
    messageBox = this.messageObject();
    target = this.settings.message.target;
    if (target != null) {
      switch (target.type) {
        case 0:
          messageBox = (ref = gs.ObjectManager.current.objectById(target.id)) != null ? ref : this.messageObject();
          break;
        case 1:
          messageBox = (ref1 = gs.ObjectManager.current.objectById("customGameMessage_" + target.id)) != null ? ref1 : this.messageObject();
      }
    }
    return messageBox;
  };


  /**
  * Called after an input number dialog was accepted by the user. It takes the user's input and puts
  * it in the configured number variable.
  *
  * @method onInputNumberFinish
  * @return {Object} Event Object containing additional data like the number, etc.
  * @protected
   */

  Component_CommandInterpreter.prototype.onInputNumberFinish = function(e) {
    this.messageObject().behavior.clear();
    this.setNumberValueTo(this.waitingFor.inputNumber.variable, parseInt(ui.Component_FormulaHandler.fieldValue(e.sender, e.number)));
    this.isWaiting = false;
    this.waitingFor.inputNumber = null;
    return SceneManager.scene.inputNumberBox.dispose();
  };


  /**
  * Called after an input text dialog was accepted by the user. It takes the user's text input and puts
  * it in the configured string variable.
  *
  * @method onInputTextFinish
  * @return {Object} Event Object containing additional data like the text, etc.
  * @protected
   */

  Component_CommandInterpreter.prototype.onInputTextFinish = function(e) {
    this.messageObject().behavior.clear();
    this.setStringValueTo(this.waitingFor.inputText.variable, ui.Component_FormulaHandler.fieldValue(e.sender, e.text).replace(/_/g, ""));
    this.isWaiting = false;
    this.waitingFor.inputText = null;
    return SceneManager.scene.inputTextBox.dispose();
  };


  /**
  * Called after a choice was selected by the user. It jumps to the corresponding label
  * and also puts the choice into backlog.
  *
  * @method onChoiceAccept
  * @return {Object} Event Object containing additional data like the label, etc.
  * @protected
   */

  Component_CommandInterpreter.prototype.onChoiceAccept = function(e) {
    var duration, fading, messageObject, scene;
    scene = SceneManager.scene;
    scene.choiceTimer.behavior.stop();
    e.isSelected = true;
    delete e.sender;
    GameManager.backlog.push({
      character: {
        name: ""
      },
      message: "",
      choice: e,
      choices: $tempFields.choices,
      isChoice: true
    });
    GameManager.tempFields.choices = [];
    messageObject = this.messageObject();
    if (messageObject != null ? messageObject.visible : void 0) {
      this.isWaiting = true;
      fading = GameManager.tempSettings.messageFading;
      duration = GameManager.tempSettings.skip ? 0 : fading.duration;
      messageObject.animator.disappear(fading.animation, fading.easing, duration, (function(_this) {
        return function() {
          messageObject.behavior.clear();
          messageObject.visible = false;
          _this.isWaiting = false;
          _this.waitingFor.choice = null;
          return _this.executeAction(e.action, true);
        };
      })(this));
    } else {
      this.isWaiting = false;
      this.executeAction(e.action, true);
    }
    return scene.choiceWindow.dispose();
  };


  /**
  * Called when a NVL message finishes. 
  *
  * @method onMessageNVLFinish
  * @return {Object} Event Object containing additional data.
  * @protected
   */

  Component_CommandInterpreter.prototype.onMessageNVLFinish = function(e) {
    var messageObject;
    messageObject = gs.ObjectManager.current.objectById("gameMessageNVL_message");
    messageObject.character = null;
    messageObject.events.off("finish", e.handler);
    this.isWaiting = false;
    this.waitingFor.messageNVL = null;
    if ((messageObject.voice != null) && GameManager.settings.skipVoiceOnAction) {
      return AudioManager.stopSound(messageObject.voice.name);
    }
  };


  /**
  * Idle
  * @method commandIdle
  * @protected
   */

  Component_CommandInterpreter.prototype.commandIdle = function() {
    return this.interpreter.isWaiting = true;
  };


  /**
  * Start Timer
  * @method commandStartTimer
  * @protected
   */

  Component_CommandInterpreter.prototype.commandStartTimer = function() {
    var number, scene, timer, timers;
    scene = SceneManager.scene;
    timers = scene.timers;
    number = this.interpreter.numberValueOf(this.params.number);
    timer = timers[number];
    if (timer == null) {
      timer = new gs.Object_IntervalTimer();
      timers[number] = timer;
    }
    timer.events.offByOwner("elapsed", this.object);
    timer.events.on("elapsed", (function(_this) {
      return function(e) {
        var params;
        params = e.data.params;
        switch (params.action.type) {
          case 0:
            if (params.labelIndex != null) {
              return SceneManager.scene.interpreter.pointer = params.labelIndex;
            } else {
              return SceneManager.scene.interpreter.jumpToLabel(params.action.data.label);
            }
            break;
          case 1:
            return SceneManager.scene.interpreter.callCommonEvent(params.action.data.commonEventId);
        }
      };
    })(this), {
      params: this.params
    }, this.object);
    timer.behavior.interval = this.interpreter.durationValueOf(this.params.interval);
    return timer.behavior.start();
  };


  /**
  * Resume Timer
  * @method commandResumeTimer
  * @protected
   */

  Component_CommandInterpreter.prototype.commandResumeTimer = function() {
    var number, ref, timers;
    timers = SceneManager.scene.timers;
    number = this.interpreter.numberValueOf(this.params.number);
    return (ref = timers[number]) != null ? ref.behavior.resume() : void 0;
  };


  /**
  * Pauses Timer
  * @method commandPauseTimer
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPauseTimer = function() {
    var number, ref, timers;
    timers = SceneManager.scene.timers;
    number = this.interpreter.numberValueOf(this.params.number);
    return (ref = timers[number]) != null ? ref.behavior.pause() : void 0;
  };


  /**
  * Stop Timer
  * @method commandStopTimer
  * @protected
   */

  Component_CommandInterpreter.prototype.commandStopTimer = function() {
    var number, ref, timers;
    timers = SceneManager.scene.timers;
    number = this.interpreter.numberValueOf(this.params.number);
    return (ref = timers[number]) != null ? ref.behavior.stop() : void 0;
  };


  /**
  * Wait
  * @method commandWait
  * @protected
   */

  Component_CommandInterpreter.prototype.commandWait = function() {
    var time;
    time = this.interpreter.durationValueOf(this.params.time);
    if ((time != null) && time > 0 && !this.interpreter.previewData) {
      this.interpreter.waitCounter = time;
      return this.interpreter.isWaiting = true;
    }
  };


  /**
  * Loop
  * @method commandLoop
  * @protected
   */

  Component_CommandInterpreter.prototype.commandLoop = function() {
    this.interpreter.loops[this.interpreter.indent] = this.interpreter.pointer;
    return this.interpreter.indent++;
  };


  /**
  * Break Loop
  * @method commandBreakLoop
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBreakLoop = function() {
    var indent;
    indent = this.indent;
    while ((this.interpreter.loops[indent] == null) && indent > 0) {
      indent--;
    }
    this.interpreter.loops[indent] = null;
    return this.interpreter.indent = indent;
  };


  /**
  * @method commandListAdd
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListAdd = function() {
    var list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    switch (this.params.valueType) {
      case 0:
        list.push(this.interpreter.numberValueOf(this.params.numberValue));
        break;
      case 1:
        list.push(this.interpreter.booleanValueOf(this.params.switchValue));
        break;
      case 2:
        list.push(this.interpreter.stringValueOf(this.params.stringValue));
        break;
      case 3:
        list.push(this.interpreter.listObjectOf(this.params.listValue));
    }
    return this.interpreter.setListObjectTo(this.params.listVariable, list);
  };


  /**
  * @method commandListPop
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListPop = function() {
    var list, ref, value;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    value = (ref = list.pop()) != null ? ref : 0;
    return this.interpreter.storeListValue(this.params.targetVariable, list, value, this.params.valueType);
  };


  /**
  * @method commandListShift
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListShift = function() {
    var list, ref, value;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    value = (ref = list.shift()) != null ? ref : 0;
    return this.interpreter.storeListValue(this.params.targetVariable, list, value, this.params.valueType);
  };


  /**
  * @method commandListIndexOf
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListIndexOf = function() {
    var list, value;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    value = -1;
    switch (this.params.valueType) {
      case 0:
        value = list.indexOf(this.interpreter.numberValueOf(this.params.numberValue));
        break;
      case 1:
        value = list.indexOf(this.interpreter.booleanValueOf(this.params.switchValue));
        break;
      case 2:
        value = list.indexOf(this.interpreter.stringValueOf(this.params.stringValue));
        break;
      case 3:
        value = list.indexOf(this.interpreter.listObjectOf(this.params.listValue));
    }
    return this.interpreter.setNumberValueTo(this.params.targetVariable, value);
  };


  /**
  * @method commandListClear
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListClear = function() {
    var list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    return list.length = 0;
  };


  /**
  * @method commandListValueAt
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListValueAt = function() {
    var index, list, ref, value;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    index = this.interpreter.numberValueOf(this.params.index);
    if (index >= 0 && index < list.length) {
      value = (ref = list[index]) != null ? ref : 0;
      return this.interpreter.storeListValue(this.params.targetVariable, list, value, this.params.valueType);
    }
  };


  /**
  * @method commandListRemoveAt
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListRemoveAt = function() {
    var index, list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    index = this.interpreter.numberValueOf(this.params.index);
    if (index >= 0 && index < list.length) {
      return list.splice(index, 1);
    }
  };


  /**
  * @method commandListInsertAt
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListInsertAt = function() {
    var index, list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    index = this.interpreter.numberValueOf(this.params.index);
    if (index >= 0 && index < list.length) {
      switch (this.params.valueType) {
        case 0:
          list.splice(index, 0, this.interpreter.numberValueOf(this.params.numberValue));
          break;
        case 1:
          list.splice(index, 0, this.interpreter.booleanValueOf(this.params.switchValue));
          break;
        case 2:
          list.splice(index, 0, this.interpreter.stringValueOf(this.params.stringValue));
          break;
        case 3:
          list.splice(index, 0, this.interpreter.listObjectOf(this.params.listValue));
      }
      return this.interpreter.setListObjectTo(this.params.listVariable, list);
    }
  };


  /**
  * @method commandListSet
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListSet = function() {
    var index, list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    index = this.interpreter.numberValueOf(this.params.index);
    if (index >= 0) {
      switch (this.params.valueType) {
        case 0:
          list[index] = this.interpreter.numberValueOf(this.params.numberValue);
          break;
        case 1:
          list[index] = this.interpreter.booleanValueOf(this.params.switchValue);
          break;
        case 2:
          list[index] = this.interpreter.stringValueOf(this.params.stringValue);
          break;
        case 3:
          list[index] = this.interpreter.listObjectOf(this.params.listValue);
      }
      return this.interpreter.setListObjectTo(this.params.listVariable, list);
    }
  };


  /**
  * @method commandListCopy
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListCopy = function() {
    var copy, list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    copy = Object.deepCopy(list);
    return this.interpreter.setListObjectTo(this.params.targetVariable, copy);
  };


  /**
  * @method commandListLength
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListLength = function() {
    var list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    return this.interpreter.setNumberValueTo(this.params.targetVariable, list.length);
  };


  /**
  * @method commandListJoin
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListJoin = function() {
    var list, value;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    value = this.params.order === 0 ? list.join("") : list.reverse().join("");
    return this.interpreter.setStringValueTo(this.params.targetVariable, value);
  };


  /**
  * @method commandListFromText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListFromText = function() {
    var list, separator, text;
    text = this.interpreter.stringValueOf(this.params.textVariable);
    separator = this.interpreter.stringValueOf(this.params.separator);
    list = text.split(separator);
    return this.interpreter.setListObjectTo(this.params.targetVariable, list);
  };


  /**
  * @method commandListShuffle
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListShuffle = function() {
    var i, j, k, list, ref, results, tempi, tempj;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    if (list.length === 0) {
      return;
    }
    results = [];
    for (i = k = ref = list.length - 1; ref <= 1 ? k <= 1 : k >= 1; i = ref <= 1 ? ++k : --k) {
      j = Math.floor(Math.random() * (i + 1));
      tempi = list[i];
      tempj = list[j];
      list[i] = tempj;
      results.push(list[j] = tempi);
    }
    return results;
  };


  /**
  * @method commandListSort
  * @protected
   */

  Component_CommandInterpreter.prototype.commandListSort = function() {
    var list;
    list = this.interpreter.listObjectOf(this.params.listVariable);
    if (list.length === 0) {
      return;
    }
    switch (this.params.sortOrder) {
      case 0:
        return list.sort(function(a, b) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
      case 1:
        return list.sort(function(a, b) {
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          }
          return 0;
        });
    }
  };


  /**
  * @method commandResetVariables
  * @protected
   */

  Component_CommandInterpreter.prototype.commandResetVariables = function() {
    var range;
    switch (this.params.target) {
      case 0:
        range = null;
        break;
      case 1:
        range = this.params.range;
    }
    switch (this.params.scope) {
      case 0:
        if (this.params.scene) {
          return GameManager.variableStore.clearLocalVariables({
            id: this.params.scene.uid
          }, this.params.type, range);
        }
        break;
      case 1:
        return GameManager.variableStore.clearLocalVariables(null, this.params.type, range);
      case 2:
        return GameManager.variableStore.clearGlobalVariables(this.params.type, range);
      case 3:
        GameManager.variableStore.clearPersistentVariables(this.params.type, range);
        return GameManager.saveGlobalData();
    }
  };


  /**
  * @method commandChangeVariableDomain
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeVariableDomain = function() {
    return GameManager.variableStore.changeDomain(this.interpreter.stringValueOf(this.params.domain));
  };


  /**
  * @method commandChangeDecimalVariables
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeDecimalVariables = function() {
    return this.interpreter.changeDecimalVariables(this.params, this.params.roundMethod);
  };


  /**
  * @method commandChangeNumberVariables
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeNumberVariables = function() {
    var diff, end, i, index, k, ref, ref1, scope, source, start;
    source = 0;
    switch (this.params.source) {
      case 0:
        source = this.interpreter.numberValueOf(this.params.sourceValue);
        break;
      case 1:
        start = this.interpreter.numberValueOf(this.params.sourceRandom.start);
        end = this.interpreter.numberValueOf(this.params.sourceRandom.end);
        diff = end - start;
        source = Math.floor(start + Math.random() * (diff + 1));
        break;
      case 2:
        source = this.interpreter.numberValueAtIndex(this.params.sourceScope, this.interpreter.numberValueOf(this.params.sourceReference) - 1, this.params.sourceReferenceDomain);
        break;
      case 3:
        source = this.interpreter.numberValueOfGameData(this.params.sourceValue1);
        break;
      case 4:
        source = this.interpreter.numberValueOfDatabaseData(this.params.sourceValue1);
    }
    switch (this.params.target) {
      case 0:
        switch (this.params.operation) {
          case 0:
            this.interpreter.setNumberValueTo(this.params.targetVariable, source);
            break;
          case 1:
            this.interpreter.setNumberValueTo(this.params.targetVariable, this.interpreter.numberValueOf(this.params.targetVariable) + source);
            break;
          case 2:
            this.interpreter.setNumberValueTo(this.params.targetVariable, this.interpreter.numberValueOf(this.params.targetVariable) - source);
            break;
          case 3:
            this.interpreter.setNumberValueTo(this.params.targetVariable, this.interpreter.numberValueOf(this.params.targetVariable) * source);
            break;
          case 4:
            this.interpreter.setNumberValueTo(this.params.targetVariable, Math.floor(this.interpreter.numberValueOf(this.params.targetVariable) / source));
            break;
          case 5:
            this.interpreter.setNumberValueTo(this.params.targetVariable, this.interpreter.numberValueOf(this.params.targetVariable) % source);
        }
        break;
      case 1:
        scope = this.params.targetScope;
        start = this.params.targetRange.start - 1;
        end = this.params.targetRange.end - 1;
        for (i = k = ref = start, ref1 = end; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
          switch (this.params.operation) {
            case 0:
              this.interpreter.setNumberValueAtIndex(scope, i, source);
              break;
            case 1:
              this.interpreter.setNumberValueAtIndex(scope, i, this.interpreter.numberValueAtIndex(scope, i) + source);
              break;
            case 2:
              this.interpreter.setNumberValueAtIndex(scope, i, this.interpreter.numberValueAtIndex(scope, i) - source);
              break;
            case 3:
              this.interpreter.setNumberValueAtIndex(scope, i, this.interpreter.numberValueAtIndex(scope, i) * source);
              break;
            case 4:
              this.interpreter.setNumberValueAtIndex(scope, i, Math.floor(this.interpreter.numberValueAtIndex(scope, i) / source));
              break;
            case 5:
              this.interpreter.setNumberValueAtIndex(scope, i, this.interpreter.numberValueAtIndex(scope, i) % source);
          }
        }
        break;
      case 2:
        index = this.interpreter.numberValueOf(this.params.targetReference) - 1;
        switch (this.params.operation) {
          case 0:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, source, this.params.targetReferenceDomain);
            break;
          case 1:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, this.interpreter.numberValueAtIndex(this.params.targetScope, index, this.params.targetReferenceDomain) + source, this.params.targetReferenceDomain);
            break;
          case 2:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, this.interpreter.numberValueAtIndex(this.params.targetScope, index, this.params.targetReferenceDomain) - source, this.params.targetReferenceDomain);
            break;
          case 3:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, this.interpreter.numberValueAtIndex(this.params.targetScope, index, this.params.targetReferenceDomain) * source, this.params.targetReferenceDomain);
            break;
          case 4:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, Math.floor(this.interpreter.numberValueAtIndex(this.params.targetScope, index, this.params.targetReferenceDomain) / source), this.params.targetReferenceDomain);
            break;
          case 5:
            this.interpreter.setNumberValueAtIndex(this.params.targetScope, index, this.interpreter.numberValueAtIndex(this.params.targetScope, index, this.params.targetReferenceDomain) % source, this.params.targetReferenceDomain);
        }
    }
    return null;
  };


  /**
  * @method commandChangeBooleanVariables
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeBooleanVariables = function() {
    var i, index, k, ref, ref1, source, targetValue, variable;
    source = this.interpreter.booleanValueOf(this.params.value);
    switch (this.params.target) {
      case 0:
        if (this.params.value === 2) {
          targetValue = this.interpreter.booleanValueOf(this.params.targetVariable);
          this.interpreter.setBooleanValueTo(this.params.targetVariable, targetValue ? false : true);
        } else {
          this.interpreter.setBooleanValueTo(this.params.targetVariable, source);
        }
        break;
      case 1:
        variable = {
          index: 0,
          scope: this.params.targetRangeScope
        };
        for (i = k = ref = this.params.rangeStart - 1, ref1 = this.params.rangeEnd - 1; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
          variable.index = i;
          if (this.params.value === 2) {
            targetValue = this.interpreter.booleanValueOf(variable);
            this.interpreter.setBooleanValueTo(variable, targetValue ? false : true);
          } else {
            this.interpreter.setBooleanValueTo(variable, source);
          }
        }
        break;
      case 2:
        index = this.interpreter.numberValueOf(this.params.targetReference) - 1;
        this.interpreter.setBooleanValueAtIndex(this.params.targetRangeScope, index, source, this.params.targetReferenceDomain);
    }
    return null;
  };


  /**
  * @method commandChangeStringVariables
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeStringVariables = function() {
    var ex, i, index, k, ref, ref1, source, targetValue, variable;
    source = "";
    switch (this.params.source) {
      case 0:
        source = lcs(this.params.textValue);
        break;
      case 1:
        source = this.interpreter.stringValueOf(this.params.sourceVariable);
        break;
      case 2:
        source = this.interpreter.stringValueOfDatabaseData(this.params.databaseData);
        break;
      case 2:
        try {
          source = eval(this.params.script);
        } catch (error) {
          ex = error;
          source = "ERR: " + ex.message;
        }
        break;
      default:
        source = lcs(this.params.textValue);
    }
    switch (this.params.target) {
      case 0:
        switch (this.params.operation) {
          case 0:
            this.interpreter.setStringValueTo(this.params.targetVariable, source);
            break;
          case 1:
            this.interpreter.setStringValueTo(this.params.targetVariable, this.interpreter.stringValueOf(this.params.targetVariable) + source);
            break;
          case 2:
            this.interpreter.setStringValueTo(this.params.targetVariable, this.interpreter.stringValueOf(this.params.targetVariable).toUpperCase());
            break;
          case 3:
            this.interpreter.setStringValueTo(this.params.targetVariable, this.interpreter.stringValueOf(this.params.targetVariable).toLowerCase());
        }
        break;
      case 1:
        variable = {
          index: 0,
          scope: this.params.targetRangeScope
        };
        for (i = k = ref = this.params.rangeStart - 1, ref1 = this.params.rangeEnd - 1; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
          variable.index = i;
          switch (this.params.operation) {
            case 0:
              this.interpreter.setStringValueTo(variable, source);
              break;
            case 1:
              this.interpreter.setStringValueTo(variable, this.interpreter.stringValueOf(variable) + source);
              break;
            case 2:
              this.interpreter.setStringValueTo(variable, this.interpreter.stringValueOf(variable).toUpperCase());
              break;
            case 3:
              this.interpreter.setStringValueTo(variable, this.interpreter.stringValueOf(variable).toLowerCase());
          }
        }
        break;
      case 2:
        index = this.interpreter.numberValueOf(this.params.targetReference) - 1;
        switch (this.params.operation) {
          case 0:
            this.interpreter.setStringValueAtIndex(this.params.targetRangeScope, index, source, this.params.targetReferenceDomain);
            break;
          case 1:
            targetValue = this.interpreter.stringValueAtIndex(this.params.targetRangeScope, index, this.params.targetReferenceDomain);
            this.interpreter.setStringValueAtIndex(this.params.targetRangeScope, index, targetValue + source, this.params.targetReferenceDomain);
            break;
          case 2:
            targetValue = this.interpreter.stringValueAtIndex(this.params.targetRangeScope, index, this.params.targetReferenceDomain);
            this.interpreter.setStringValueAtIndex(this.params.targetRangeScope, index, targetValue.toUpperCase(), this.params.targetReferenceDomain);
            break;
          case 3:
            targetValue = this.interpreter.stringValueAtIndex(this.params.targetRangeScope, index, this.params.targetReferenceDomain);
            this.interpreter.setStringValueTo(this.params.targetRangeScope, index, targetValue.toLowerCase(), this.params.targetReferenceDomain);
        }
    }
    return null;
  };


  /**
  * @method commandCheckSwitch
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCheckSwitch = function() {
    var result;
    result = this.interpreter.booleanValueOf(this.params.targetVariable) && this.params.value;
    if (result) {
      return this.interpreter.pointer = this.params.labelIndex;
    }
  };


  /**
  * @method commandNumberCondition
  * @protected
   */

  Component_CommandInterpreter.prototype.commandNumberCondition = function() {
    var result;
    result = this.interpreter.compare(this.interpreter.numberValueOf(this.params.targetVariable), this.interpreter.numberValueOf(this.params.value), this.params.operation);
    this.interpreter.conditions[this.interpreter.indent] = result;
    if (result) {
      return this.interpreter.indent++;
    }
  };


  /**
  * @method commandCondition
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCondition = function() {
    var result;
    switch (this.params.valueType) {
      case 0:
        result = this.interpreter.compare(this.interpreter.numberValueOf(this.params.variable), this.interpreter.numberValueOf(this.params.numberValue), this.params.operation);
        break;
      case 1:
        result = this.interpreter.compare(this.interpreter.booleanValueOf(this.params.variable), this.interpreter.booleanValueOf(this.params.switchValue), this.params.operation);
        break;
      case 2:
        result = this.interpreter.compare(lcs(this.interpreter.stringValueOf(this.params.variable)), lcs(this.interpreter.stringValueOf(this.params.textValue)), this.params.operation);
    }
    this.interpreter.conditions[this.interpreter.indent] = result;
    if (result) {
      return this.interpreter.indent++;
    }
  };


  /**
  * @method commandConditionElse
  * @protected
   */

  Component_CommandInterpreter.prototype.commandConditionElse = function() {
    if (!this.interpreter.conditions[this.interpreter.indent]) {
      return this.interpreter.indent++;
    }
  };


  /**
  * @method commandConditionElseIf
  * @protected
   */

  Component_CommandInterpreter.prototype.commandConditionElseIf = function() {
    if (!this.interpreter.conditions[this.interpreter.indent]) {
      return this.interpreter.commandCondition.call(this);
    }
  };


  /**
  * @method commandCheckNumberVariable
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCheckNumberVariable = function() {
    var result;
    result = this.interpreter.compare(this.interpreter.numberValueOf(this.params.targetVariable), this.interpreter.numberValueOf(this.params.value), this.params.operation);
    if (result) {
      return this.interpreter.pointer = this.params.labelIndex;
    }
  };


  /**
  * @method commandCheckTextVariable
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCheckTextVariable = function() {
    var result, text1, text2;
    result = false;
    text1 = this.interpreter.stringValueOf(this.params.targetVariable);
    text2 = this.interpreter.stringValueOf(this.params.value);
    switch (this.params.operation) {
      case 0:
        result = text1 === text2;
        break;
      case 1:
        result = text1 !== text2;
        break;
      case 2:
        result = text1.length > text2.length;
        break;
      case 3:
        result = text1.length >= text2.length;
        break;
      case 4:
        result = text1.length < text2.length;
        break;
      case 5:
        result = text1.length <= text2.length;
    }
    if (result) {
      return this.interpreter.pointer = this.params.labelIndex;
    }
  };


  /**
  * @method commandLabel
  * @protected
   */

  Component_CommandInterpreter.prototype.commandLabel = function() {};


  /**
  * @method commandJumpToLabel
  * @protected
   */

  Component_CommandInterpreter.prototype.commandJumpToLabel = function() {
    var label;
    label = this.params.labelIndex;
    if (label != null) {
      this.interpreter.pointer = label;
      return this.interpreter.indent = this.interpreter.object.commands[label].indent;
    } else {
      return this.interpreter.jumpToLabel(this.params.name);
    }
  };


  /**
  * @method commandClearMessage
  * @protected
   */

  Component_CommandInterpreter.prototype.commandClearMessage = function() {
    var duration, fading, flags, isLocked, messageObject, scene;
    scene = SceneManager.scene;
    messageObject = this.interpreter.targetMessage();
    if (messageObject == null) {
      return;
    }
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    duration = 0;
    fading = GameManager.tempSettings.messageFading;
    if (!GameManager.tempSettings.skip) {
      duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : fading.duration;
    }
    messageObject.animator.disappear(fading.animation, fading.easing, duration, gs.CallBack("onMessageADVClear", this.interpreter));
    this.interpreter.waitForCompletion(messageObject, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandClosePageNVL
  * @protected
   */

  Component_CommandInterpreter.prototype.commandClosePageNVL = function() {
    var messageBox, messageObject, scene;
    scene = SceneManager.scene;
    messageObject = gs.ObjectManager.current.objectById("gameMessageNVL_message");
    if (messageObject == null) {
      return;
    }
    messageObject.message.clear();
    messageBox = gs.ObjectManager.current.objectById("messageBoxNVL");
    if (messageBox && this.params.visible !== messageBox.visible) {
      return messageBox.visible = false;
    }
  };


  /**
  * @method commandMessageBoxDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMessageBoxDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.messageBox;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      return defaults.disappearAnimation = this.params.disappearAnimation;
    }
  };


  /**
  * @method commandShowMessageNVL
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowMessageNVL = function() {
    var character, messageObject, ref, ref1, ref2, scene, voiceSettings;
    scene = SceneManager.scene;
    scene.messageMode = vn.MessageMode.NVL;
    character = RecordManager.characters[this.params.characterId];
    scene.layout.visible = false;
    scene.layoutNVL.visible = true;
    messageObject = gs.ObjectManager.current.objectById("gameMessageNVL_message");
    if (messageObject == null) {
      return;
    }
    if ((ref = this.interpreter.messageBoxObject()) != null) {
      ref.visible = true;
    }
    messageObject.character = character;
    messageObject.message.addMessage(lcsm(this.params.message), character, !this.params.partial && messageObject.messages.length > 0, true);
    if (this.interpreter.messageSettings().backlog) {
      GameManager.backlog.push({
        character: character,
        message: lcsm(this.params.message),
        choices: []
      });
    }
    messageObject.events.on("finish", (function(_this) {
      return function(e) {
        return _this.interpreter.onMessageNVLFinish(e);
      };
    })(this));
    voiceSettings = GameManager.settings.voicesByCharacter[(ref1 = messageObject.character) != null ? ref1.index : void 0];
    if ((this.params.voice != null) && GameManager.settings.voiceEnabled && (!voiceSettings || voiceSettings.enabled)) {
      if (GameManager.settings.skipVoiceOnAction || !((ref2 = AudioManager.voice) != null ? ref2.playing : void 0)) {
        messageObject.voice = this.params.voice;
        AudioManager.playVoice(this.params.voice);
      }
    } else {
      AudioManager.voice = null;
    }
    this.interpreter.isWaiting = true;
    return this.interpreter.waitingFor.messageNVL = this.params;
  };


  /**
  * @method commandShowMessage
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowMessage = function() {
    var animation, character, defaults, duration, easing, expression, ref, scene, showMessage;
    scene = SceneManager.scene;
    scene.messageMode = vn.MessageMode.ADV;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    showMessage = (function(_this) {
      return function() {
        var messageObject, ref, settings, voiceSettings;
        character = RecordManager.characters[_this.params.characterId];
        scene.layout.visible = true;
        scene.layoutNVL.visible = false;
        messageObject = _this.interpreter.targetMessage();
        if (messageObject == null) {
          return;
        }
        scene.currentCharacter = character;
        messageObject.character = character;
        messageObject.opacity = 255;
        messageObject.events.offByOwner("callCommonEvent", _this.interpreter);
        messageObject.events.on("callCommonEvent", gs.CallBack("onCallCommonEvent", _this.interpreter), {
          params: _this.params
        }, _this.interpreter);
        messageObject.events.once("finish", gs.CallBack("onMessageADVFinish", _this.interpreter), {
          params: _this.params
        }, _this.interpreter);
        messageObject.events.once("waiting", gs.CallBack("onMessageADVWaiting", _this.interpreter), {
          params: _this.params
        }, _this.interpreter);
        if (messageObject.settings.useCharacterColor) {
          messageObject.message.showMessage(_this.interpreter, _this.params, character);
        } else {
          messageObject.message.showMessage(_this.interpreter, _this.params);
        }
        settings = GameManager.settings;
        voiceSettings = settings.voicesByCharacter[character.index];
        if ((_this.params.voice != null) && GameManager.settings.voiceEnabled && (!voiceSettings || voiceSettings > 0)) {
          if ((GameManager.settings.skipVoiceOnAction || !((ref = AudioManager.voice) != null ? ref.playing : void 0)) && !GameManager.tempSettings.skip) {
            messageObject.voice = _this.params.voice;
            return messageObject.behavior.voice = AudioManager.playVoice(_this.params.voice);
          }
        } else {
          return messageObject.behavior.voice = null;
        }
      };
    })(this);
    if ((this.params.expressionId != null) && (character != null)) {
      expression = RecordManager.characterExpressions[this.params.expressionId || 0];
      defaults = GameManager.defaults.character;
      duration = !gs.CommandFieldFlags.isLocked(this.params.fieldFlags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.expressionDuration;
      easing = gs.Easings.fromObject(defaults.changeEasing);
      animation = defaults.changeAnimation;
      character.behavior.changeExpression(expression, animation, easing, duration, (function(_this) {
        return function() {
          return showMessage();
        };
      })(this));
    } else {
      showMessage();
    }
    this.interpreter.isWaiting = ((ref = this.params.waitForCompletion) != null ? ref : true) && !(GameManager.tempSettings.skip && GameManager.tempSettings.skipTime === 0);
    return this.interpreter.waitingFor.messageADV = this.params;
  };


  /**
  * @method commandSetMessageArea
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSetMessageArea = function() {
    var messageLayout, number, scene;
    scene = SceneManager.scene;
    number = this.interpreter.numberValueOf(this.params.number);
    if (scene.messageAreas[number]) {
      messageLayout = scene.messageAreas[number].layout;
      messageLayout.dstRect.x = this.params.box.x;
      messageLayout.dstRect.y = this.params.box.y;
      messageLayout.dstRect.width = this.params.box.size.width;
      messageLayout.dstRect.height = this.params.box.size.height;
      return messageLayout.needsUpdate = true;
    }
  };


  /**
  * @method commandMessageFading
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMessageFading = function() {
    return GameManager.tempSettings.messageFading = {
      duration: this.interpreter.durationValueOf(this.params.duration),
      animation: this.params.animation,
      easing: gs.Easings.fromObject(this.params.easing)
    };
  };


  /**
  * @method commandMessageSettings
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMessageSettings = function() {
    var flags, font, fontName, fontSize, isLocked, messageObject, messageSettings, ref, ref1, ref2, ref3, ref4, ref5;
    messageObject = this.interpreter.targetMessage();
    if (!messageObject) {
      return;
    }
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    messageSettings = this.interpreter.messageSettings();
    if (!isLocked(flags.autoErase)) {
      messageSettings.autoErase = this.params.autoErase;
    }
    if (!isLocked(flags.waitAtEnd)) {
      messageSettings.waitAtEnd = this.params.waitAtEnd;
    }
    if (!isLocked(flags.backlog)) {
      messageSettings.backlog = this.params.backlog;
    }
    if (!isLocked(flags.lineHeight)) {
      messageSettings.lineHeight = this.params.lineHeight;
    }
    if (!isLocked(flags.lineSpacing)) {
      messageSettings.lineSpacing = this.params.lineSpacing;
    }
    if (!isLocked(flags.linePadding)) {
      messageSettings.linePadding = this.params.linePadding;
    }
    if (!isLocked(flags.paragraphSpacing)) {
      messageSettings.paragraphSpacing = this.params.paragraphSpacing;
    }
    if (!isLocked(flags.useCharacterColor)) {
      messageSettings.useCharacterColor = this.params.useCharacterColor;
    }
    messageObject.textRenderer.minLineHeight = (ref = messageSettings.lineHeight) != null ? ref : 0;
    messageObject.textRenderer.lineSpacing = (ref1 = messageSettings.lineSpacing) != null ? ref1 : messageObject.textRenderer.lineSpacing;
    messageObject.textRenderer.padding = (ref2 = messageSettings.linePadding) != null ? ref2 : messageObject.textRenderer.padding;
    fontName = !isLocked(flags.font) ? this.params.font : messageObject.font.name;
    fontSize = !isLocked(flags.size) ? this.params.size : messageObject.font.size;
    font = messageObject.font;
    if (!isLocked(flags.font) || !isLocked(flags.size)) {
      messageObject.font = new Font(fontName, fontSize);
    }
    if (!isLocked(flags.bold)) {
      messageObject.font.bold = this.params.bold;
    }
    if (!isLocked(flags.italic)) {
      messageObject.font.italic = this.params.italic;
    }
    if (!isLocked(flags.smallCaps)) {
      messageObject.font.smallCaps = this.params.smallCaps;
    }
    if (!isLocked(flags.underline)) {
      messageObject.font.underline = this.params.underline;
    }
    if (!isLocked(flags.strikeThrough)) {
      messageObject.font.strikeThrough = this.params.strikeThrough;
    }
    if (!isLocked(flags.color)) {
      messageObject.font.color = new Color(this.params.color);
    }
    messageObject.font.color = (flags.color != null) && !isLocked(flags.color) ? new Color(this.params.color) : font.color;
    messageObject.font.border = (flags.outline != null) && !isLocked(flags.outline) ? this.params.outline : font.border;
    messageObject.font.borderColor = (flags.outlineColor != null) && !isLocked(flags.outlineColor) ? new Color(this.params.outlineColor) : new Color(font.borderColor);
    messageObject.font.borderSize = (flags.outlineSize != null) && !isLocked(flags.outlineSize) ? (ref3 = this.params.outlineSize) != null ? ref3 : 4 : font.borderSize;
    messageObject.font.shadow = (flags.shadow != null) && !isLocked(flags.shadow) ? this.params.shadow : font.shadow;
    messageObject.font.shadowColor = (flags.shadowColor != null) && !isLocked(flags.shadowColor) ? new Color(this.params.shadowColor) : new Color(font.shadowColor);
    messageObject.font.shadowOffsetX = (flags.shadowOffsetX != null) && !isLocked(flags.shadowOffsetX) ? (ref4 = this.params.shadowOffsetX) != null ? ref4 : 1 : font.shadowOffsetX;
    messageObject.font.shadowOffsetY = (flags.shadowOffsetY != null) && !isLocked(flags.shadowOffsetY) ? (ref5 = this.params.shadowOffsetY) != null ? ref5 : 1 : font.shadowOffsetY;
    messageObject.font.bold = font.bold;
    messageObject.font.italic = font.italic;
    return messageObject.font.smallCaps = font.smallCaps;
  };


  /**
  * @method commandCreateMessageArea
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCreateMessageArea = function() {
    var messageArea, number, scene;
    number = this.interpreter.numberValueOf(this.params.number);
    scene = SceneManager.scene;
    scene.behavior.changeMessageAreaDomain(this.params.numberDomain);
    if (!scene.messageAreas[number]) {
      messageArea = new gs.Object_MessageArea();
      messageArea.layout = ui.UIManager.createControlFromDescriptor({
        type: "ui.CustomGameMessage",
        id: "customGameMessage_" + number,
        params: {
          id: "customGameMessage_" + number
        }
      }, messageArea);
      messageArea.message = gs.ObjectManager.current.objectById("customGameMessage_" + number + "_message");
      messageArea.message.domain = this.params.numberDomain;
      messageArea.addObject(messageArea.layout);
      messageArea.layout.dstRect.x = this.params.box.x;
      messageArea.layout.dstRect.y = this.params.box.y;
      messageArea.layout.dstRect.width = this.params.box.size.width;
      messageArea.layout.dstRect.height = this.params.box.size.height;
      messageArea.layout.needsUpdate = true;
      return scene.messageAreas[number] = messageArea;
    }
  };


  /**
  * @method commandEraseMessageArea
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEraseMessageArea = function() {
    var area, number, scene;
    number = this.interpreter.numberValueOf(this.params.number);
    scene = SceneManager.scene;
    scene.behavior.changeMessageAreaDomain(this.params.numberDomain);
    area = scene.messageAreas[number];
    if (area != null) {
      area.layout.dispose();
    }
    return scene.messageAreas[number] = null;
  };


  /**
  * @method commandSetTargetMessage
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSetTargetMessage = function() {
    var message, ref, scene, target;
    message = this.interpreter.targetMessage();
    if (message != null) {
      message.textRenderer.isWaiting = false;
    }
    if (message != null) {
      message.behavior.isWaiting = false;
    }
    scene = SceneManager.scene;
    scene.behavior.changeMessageAreaDomain(this.params.numberDomain);
    target = {
      type: this.params.type,
      id: null
    };
    switch (this.params.type) {
      case 0:
        target.id = this.params.id;
        break;
      case 1:
        target.id = this.interpreter.numberValueOf(this.params.number);
    }
    this.interpreter.settings.message.target = target;
    if (this.params.clear) {
      return (ref = this.interpreter.targetMessage()) != null ? ref.behavior.clear() : void 0;
    }
  };


  /**
  * @method commandBacklogVisibility
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBacklogVisibility = function() {
    var control;
    if (this.params.visible) {
      control = gs.ObjectManager.current.objectById("backlogBox");
      if (control == null) {
        control = gs.ObjectManager.current.objectById("backlog");
      }
      if (control != null) {
        control.dispose();
      }
      if (this.params.backgroundVisible) {
        return control = SceneManager.scene.behavior.createControl(this, {
          descriptor: "ui.MessageBacklogBox"
        });
      } else {
        return control = SceneManager.scene.behavior.createControl(this, {
          descriptor: "ui.MessageBacklog"
        });
      }
    } else {
      control = gs.ObjectManager.current.objectById("backlogBox");
      if (control == null) {
        control = gs.ObjectManager.current.objectById("backlog");
      }
      return control != null ? control.dispose() : void 0;
    }
  };


  /**
  * @method commandMessageVisibility
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMessageVisibility = function() {
    var animation, defaults, duration, easing, flags, isLocked, message;
    defaults = GameManager.defaults.messageBox;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    message = this.interpreter.targetMessage();
    if ((message == null) || this.params.visible === message.visible) {
      return;
    }
    if (this.params.visible) {
      duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
      easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.appearEasing);
      animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
      message.animator.appear(message.dstRect.x, message.dstRect.y, this.params.animation, easing, duration);
    } else {
      duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
      easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.disappearEasing);
      animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
      message.animator.disappear(animation, easing, duration, function() {
        return message.visible = false;
      });
    }
    message.update();
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMessageBoxVisibility
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMessageBoxVisibility = function() {
    var animation, defaults, duration, easing, flags, isLocked, messageBox, visible;
    defaults = GameManager.defaults.messageBox;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    messageBox = this.interpreter.messageBoxObject(this.interpreter.stringValueOf(this.params.id));
    visible = this.params.visible === 1;
    if ((messageBox == null) || visible === messageBox.visible) {
      return;
    }
    if (this.params.visible) {
      duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
      easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.appearEasing);
      animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
      messageBox.animator.appear(messageBox.dstRect.x, messageBox.dstRect.y, animation, easing, duration);
    } else {
      duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
      easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.disappearEasing);
      animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
      messageBox.animator.disappear(animation, easing, duration, function() {
        return messageBox.visible = false;
      });
    }
    messageBox.update();
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandUIAccess
  * @protected
   */

  Component_CommandInterpreter.prototype.commandUIAccess = function() {
    var flags, isLocked;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.generalMenu)) {
      GameManager.tempSettings.menuAccess = this.interpreter.booleanValueOf(this.params.generalMenu);
    }
    if (!isLocked(flags.saveMenu)) {
      GameManager.tempSettings.saveMenuAccess = this.interpreter.booleanValueOf(this.params.saveMenu);
    }
    if (!isLocked(flags.loadMenu)) {
      GameManager.tempSettings.loadMenuAccess = this.interpreter.booleanValueOf(this.params.loadMenu);
    }
    if (!isLocked(flags.backlog)) {
      return GameManager.tempSettings.backlogAccess = this.interpreter.booleanValueOf(this.params.backlog);
    }
  };


  /**
  * @method commandUnlockCG
  * @protected
   */

  Component_CommandInterpreter.prototype.commandUnlockCG = function() {
    var cg;
    cg = RecordManager.cgGallery[this.interpreter.stringValueOf(this.params.cgId)];
    if (cg != null) {
      GameManager.globalData.cgGallery[cg.index] = {
        unlocked: true
      };
      return GameManager.saveGlobalData();
    }
  };


  /**
  * @method commandL2DMove
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DMove = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character instanceof vn.Object_Live2DCharacter) {
      return;
    }
    this.interpreter.moveObject(character, this.params.position, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DMotionGroup
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DMotionGroup = function() {
    var character, motions, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character instanceof vn.Object_Live2DCharacter) {
      return;
    }
    character.motionGroup = {
      name: this.params.data.motionGroup,
      loop: this.params.loop,
      playType: this.params.playType
    };
    if (this.params.waitForCompletion && !this.params.loop) {
      motions = character.model.motionsByGroup[character.motionGroup.name];
      if (motions != null) {
        this.interpreter.isWaiting = true;
        this.interpreter.waitCounter = motions.sum(function(m) {
          return m.getDurationMSec() / 16.6;
        });
      }
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DMotion
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DMotion = function() {
    var character, defaults, fadeInTime, flags, isLocked, motion, scene;
    defaults = GameManager.defaults.live2d;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character instanceof vn.Object_Live2DCharacter) {
      return;
    }
    fadeInTime = !isLocked(flags.fadeInTime) ? this.params.fadeInTime : defaults.motionFadeInTime;
    character.motion = {
      name: this.params.data.motion,
      fadeInTime: fadeInTime,
      loop: this.params.loop
    };
    character.motionGroup = null;
    if (this.params.waitForCompletion && !this.params.loop) {
      motion = character.model.motions[character.motion.name];
      if (motion != null) {
        this.interpreter.isWaiting = true;
        this.interpreter.waitCounter = motion.getDurationMSec() / 16.6;
      }
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DExpression
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DExpression = function() {
    var character, defaults, fadeInTime, flags, isLocked, scene;
    defaults = GameManager.defaults.live2d;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character instanceof vn.Object_Live2DCharacter) {
      return;
    }
    fadeInTime = !isLocked(flags.fadeInTime) ? this.params.fadeInTime : defaults.expressionFadeInTime;
    character.expression = {
      name: this.params.data.expression,
      fadeInTime: fadeInTime
    };
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DExitScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DExitScene = function() {
    var defaults;
    defaults = GameManager.defaults.live2d;
    this.interpreter.commandCharacterExitScene.call(this, defaults);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DSettings
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DSettings = function() {
    var character, flags, isLocked, scene;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!(character != null ? character.visual.l2dObject : void 0)) {
      return;
    }
    if (!isLocked(flags.lipSyncSensitivity)) {
      character.visual.l2dObject.lipSyncSensitivity = this.interpreter.numberValueOf(this.params.lipSyncSensitivity);
    }
    if (!isLocked(flags.idleIntensity)) {
      character.visual.l2dObject.idleIntensity = this.interpreter.numberValueOf(this.params.idleIntensity);
    }
    if (!isLocked(flags.breathIntensity)) {
      character.visual.l2dObject.breathIntensity = this.interpreter.numberValueOf(this.params.breathIntensity);
    }
    if (!isLocked(flags["eyeBlink.enabled"])) {
      character.visual.l2dObject.eyeBlink.enabled = this.params.eyeBlink.enabled;
    }
    if (!isLocked(flags["eyeBlink.interval"])) {
      character.visual.l2dObject.eyeBlink.blinkIntervalMsec = this.interpreter.numberValueOf(this.params.eyeBlink.interval);
    }
    if (!isLocked(flags["eyeBlink.closedMotionTime"])) {
      character.visual.l2dObject.eyeBlink.closedMotionMsec = this.interpreter.numberValueOf(this.params.eyeBlink.closedMotionTime);
    }
    if (!isLocked(flags["eyeBlink.closingMotionTime"])) {
      character.visual.l2dObject.eyeBlink.closingMotionMsec = this.interpreter.numberValueOf(this.params.eyeBlink.closingMotionTime);
    }
    if (!isLocked(flags["eyeBlink.openingMotionTime"])) {
      character.visual.l2dObject.eyeBlink.openingMotionMsec = this.interpreter.numberValueOf(this.params.eyeBlink.openingMotionTime);
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DParameter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DParameter = function() {
    var character, duration, easing, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character instanceof vn.Object_Live2DCharacter) {
      return;
    }
    easing = gs.Easings.fromObject(this.params.easing);
    duration = this.interpreter.durationValueOf(this.params.duration);
    character.animator.l2dParameterTo(this.params.param.name, this.interpreter.numberValueOf(this.params.param.value), duration, easing);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.live2d;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags.motionFadeInTime)) {
      defaults.motionFadeInTime = this.interpreter.numberValueOf(this.params.motionFadeInTime);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      defaults.disappearAnimation = this.params.disappearAnimation;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandL2DJoinScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandL2DJoinScene = function() {
    var animation, character, defaults, duration, easing, flags, isLocked, motionBlur, origin, p, record, ref, ref1, ref2, ref3, ref4, ref5, scene, x, y, zIndex;
    defaults = GameManager.defaults.live2d;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    record = RecordManager.characters[this.interpreter.stringValueOf(this.params.characterId)];
    if (!record || scene.characters.first(function(v) {
      return !v.disposed && v.rid === record.index;
    })) {
      return;
    }
    if (this.params.positionType === 1) {
      x = this.params.position.x;
      y = this.params.position.y;
    } else if (this.params.positionType === 2) {
      x = this.interpreter.numberValueOf(this.params.position.x);
      y = this.interpreter.numberValueOf(this.params.position.y);
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : defaults.zOrder;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    motionBlur = !isLocked(flags["motionBlur.enabled"]) ? this.params.motionBlur : defaults.motionBlur;
    origin = !isLocked(flags.origin) ? this.params.origin : defaults.origin;
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    character = new vn.Object_Live2DCharacter(record);
    character.modelName = ((ref = this.params.model) != null ? ref.name : void 0) || "";
    character.model = ResourceManager.getLive2DModel("Live2D/" + character.modelName);
    if (character.model.motions) {
      character.motion = {
        name: "",
        fadeInTime: 0,
        loop: true
      };
    }
    character.dstRect.x = x;
    character.dstRect.y = y;
    character.anchor.x = !origin ? 0 : 0.5;
    character.anchor.y = !origin ? 0 : 0.5;
    character.blendMode = this.interpreter.numberValueOf(this.params.blendMode);
    character.zoom.x = this.params.position.zoom.d;
    character.zoom.y = this.params.position.zoom.d;
    character.zIndex = zIndex || 200;
    if ((ref1 = character.model) != null) {
      ref1.reset();
    }
    character.setup();
    character.visual.l2dObject.idleIntensity = (ref2 = record.idleIntensity) != null ? ref2 : 1.0;
    character.visual.l2dObject.breathIntensity = (ref3 = record.breathIntensity) != null ? ref3 : 1.0;
    character.visual.l2dObject.lipSyncSensitivity = (ref4 = record.lipSyncSensitivity) != null ? ref4 : 1.0;
    character.update();
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, character, this.params);
      character.dstRect.x = p.x;
      character.dstRect.y = p.y;
    }
    scene.behavior.addCharacter(character, false, {
      animation: animation,
      duration: duration,
      easing: easing,
      motionBlur: motionBlur
    });
    if (((ref5 = this.params.viewport) != null ? ref5.type : void 0) === "ui") {
      character.viewport = Graphics.viewport;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCharacterJoinScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterJoinScene = function() {
    var angle, animation, bitmap, character, defaults, duration, easing, flags, isLocked, mirror, motionBlur, origin, p, record, ref, ref1, ref2, ref3, ref4, scene, x, y, zIndex, zoom;
    defaults = GameManager.defaults.character;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    record = RecordManager.characters[this.params.characterId];
    if (!record || scene.characters.first(function(v) {
      return !v.disposed && v.rid === record.index && !v.disposed;
    })) {
      return;
    }
    character = new vn.Object_Character(record, null, scene);
    character.expression = RecordManager.characterExpressions[((ref = this.params.expressionId) != null ? ref : record.defaultExpressionId) || 0];
    if (character.expression != null) {
      bitmap = ResourceManager.getBitmap("Graphics/Characters/" + ((ref1 = character.expression.idle[0]) != null ? ref1.resource.name : void 0));
    }
    mirror = false;
    angle = 0;
    zoom = 1;
    if (this.params.positionType === 1) {
      x = this.interpreter.numberValueOf(this.params.position.x);
      y = this.interpreter.numberValueOf(this.params.position.y);
      mirror = this.params.position.horizontalFlip;
      angle = this.params.position.angle || 0;
      zoom = ((ref2 = this.params.position.data) != null ? ref2.zoom : void 0) || 1;
    } else if (this.params.positionType === 2) {
      x = this.interpreter.numberValueOf(this.params.position.x);
      y = this.interpreter.numberValueOf(this.params.position.y);
      mirror = false;
      angle = 0;
      zoom = 1;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    origin = !isLocked(flags.origin) ? this.params.origin : defaults.origin;
    zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : defaults.zOrder;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    motionBlur = !isLocked(flags["motionBlur.enabled"]) ? this.params.motionBlur : defaults.motionBlur;
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    if (character.expression != null) {
      bitmap = ResourceManager.getBitmap("Graphics/Characters/" + ((ref3 = character.expression.idle[0]) != null ? ref3.resource.name : void 0));
      if (this.params.origin === 1 && (bitmap != null)) {
        x += (bitmap.width * zoom - bitmap.width) / 2;
        y += (bitmap.height * zoom - bitmap.height) / 2;
      }
    }
    character.mirror = mirror;
    character.anchor.x = !origin ? 0 : 0.5;
    character.anchor.y = !origin ? 0 : 0.5;
    character.zoom.x = zoom;
    character.zoom.y = zoom;
    character.dstRect.x = x;
    character.dstRect.y = y;
    character.zIndex = zIndex || 200;
    character.blendMode = this.interpreter.numberValueOf(this.params.blendMode);
    character.angle = angle;
    character.setup();
    character.update();
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, character, this.params);
      character.dstRect.x = p.x;
      character.dstRect.y = p.y;
    }
    scene.behavior.addCharacter(character, false, {
      animation: animation,
      duration: duration,
      easing: easing,
      motionBlur: motionBlur
    });
    if (((ref4 = this.params.viewport) != null ? ref4.type : void 0) === "ui") {
      character.viewport = Graphics.viewport;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCharacterExitScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterExitScene = function(defaults) {
    var animation, character, duration, easing, flags, isLocked, scene;
    defaults = defaults || GameManager.defaults.character;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.disappearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    scene.behavior.removeCharacter(character, {
      animation: animation,
      duration: duration,
      easing: easing
    });
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCharacterChangeExpression
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterChangeExpression = function() {
    var animation, character, defaults, duration, easing, expression, flags, isLocked, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    defaults = GameManager.defaults.character;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.expressionDuration;
    expression = RecordManager.characterExpressions[this.params.expressionId || 0];
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.changeEasing);
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.changeAnimation;
    character.behavior.changeExpression(expression, this.params.animation, easing, duration);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCharacterSetParameter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterSetParameter = function() {
    var params, value;
    params = GameManager.characterParams[this.interpreter.stringValueOf(this.params.characterId)];
    if ((params == null) || (this.params.param == null)) {
      return;
    }
    switch (this.params.valueType) {
      case 0:
        switch (this.params.param.type) {
          case 0:
            return params[this.params.param.name] = this.interpreter.numberValueOf(this.params.numberValue);
          case 1:
            return params[this.params.param.name] = this.interpreter.numberValueOf(this.params.numberValue) > 0;
          case 2:
            return params[this.params.param.name] = this.interpreter.numberValueOf(this.params.numberValue).toString();
        }
        break;
      case 1:
        switch (this.params.param.type) {
          case 0:
            value = this.interpreter.booleanValueOf(this.params.switchValue);
            return params[this.params.param.name] = value ? 1 : 0;
          case 1:
            return params[this.params.param.name] = this.interpreter.booleanValueOf(this.params.switchValue);
          case 2:
            value = this.interpreter.booleanValueOf(this.params.switchValue);
            return params[this.params.param.name] = value ? "ON" : "OFF";
        }
        break;
      case 2:
        switch (this.params.param.type) {
          case 0:
            value = this.interpreter.stringValueOf(this.params.textValue);
            return params[this.params.param.name] = value.length;
          case 1:
            return params[this.params.param.name] = this.interpreter.stringValueOf(this.params.textValue) === "ON";
          case 2:
            return params[this.params.param.name] = this.interpreter.stringValueOf(this.params.textValue);
        }
    }
  };


  /**
  * @method commandCharacterGetParameter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterGetParameter = function() {
    var params, value;
    params = GameManager.characterParams[this.interpreter.stringValueOf(this.params.characterId)];
    if ((params == null) || (this.params.param == null)) {
      return;
    }
    value = params[this.params.param.name];
    switch (this.params.valueType) {
      case 0:
        switch (this.params.param.type) {
          case 0:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, value);
          case 1:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, value ? 1 : 0);
          case 2:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, value != null ? value.length : 0);
        }
        break;
      case 1:
        switch (this.params.param.type) {
          case 0:
            return this.interpreter.setBooleanValueTo(this.params.targetVariable, value > 0);
          case 1:
            return this.interpreter.setBooleanValueTo(this.params.targetVariable, value);
          case 2:
            return this.interpreter.setBooleanValueTo(this.params.targetVariable, value === "ON");
        }
        break;
      case 2:
        switch (this.params.param.type) {
          case 0:
            return this.interpreter.setStringValueTo(this.params.targetVariable, value != null ? value.toString() : "");
          case 1:
            return this.interpreter.setStringValueTo(this.params.targetVariable, value ? "ON" : "OFF");
          case 2:
            return this.interpreter.setStringValueTo(this.params.targetVariable, value);
        }
    }
  };


  /**
  * @method commandCharacterMotionBlur
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterMotionBlur = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    return character.motionBlur.set(this.params.motionBlur);
  };


  /**
  * @method commandCharacterDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.character;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.expressionDuration)) {
      defaults.expressionDuration = this.interpreter.durationValueOf(this.params.expressionDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      defaults.disappearAnimation = this.params.disappearAnimation;
    }
    if (!isLocked(flags["motionBlur.enabled"])) {
      defaults.motionBlur = this.params.motionBlur;
    }
    if (!isLocked(flags.origin)) {
      return defaults.origin = this.params.origin;
    }
  };


  /**
  * @method commandCharacterEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCharacterEffect = function() {
    var character, characterId, scene;
    scene = SceneManager.scene;
    characterId = this.interpreter.stringValueOf(this.params.characterId);
    character = scene.characters.first(function(c) {
      return !c.disposed && c.rid === characterId;
    });
    if (character == null) {
      return;
    }
    this.interpreter.objectEffect(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandFlashCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandFlashCharacter = function() {
    var character, duration, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (!character) {
      return;
    }
    duration = this.interpreter.durationValueOf(this.params.duration);
    character.animator.flash(new Color(this.params.color), duration);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTintCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTintCharacter = function() {
    var character, duration, easing, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    easing = gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut);
    if (!character) {
      return;
    }
    duration = this.interpreter.durationValueOf(this.params.duration);
    character.animator.tintTo(this.params.tone, duration, easing);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomCharacter = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.zoomObject(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandRotateCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotateCharacter = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.rotateObject(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBlendCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBlendCharacter = function() {
    var character;
    character = SceneManager.scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.blendObject(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandShakeCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShakeCharacter = function() {
    var character;
    character = SceneManager.scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.shakeObject(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMaskCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMaskCharacter = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.maskObject(character, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMoveCharacter
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveCharacter = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.moveObject(character, this.params.position, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMoveCharacterPath
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveCharacterPath = function() {
    var character, scene;
    scene = SceneManager.scene;
    character = scene.characters.first((function(_this) {
      return function(v) {
        return !v.disposed && v.rid === _this.params.characterId;
      };
    })(this));
    if (character == null) {
      return;
    }
    this.interpreter.moveObjectPath(character, this.params.path, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandShakeBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShakeBackground = function() {
    var background;
    background = SceneManager.scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
    if (background == null) {
      return;
    }
    this.interpreter.shakeObject(background, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandScrollBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScrollBackground = function() {
    var duration, easing, horizontalSpeed, layer, ref, scene, verticalSpeed;
    scene = SceneManager.scene;
    duration = this.interpreter.durationValueOf(this.params.duration);
    horizontalSpeed = this.interpreter.numberValueOf(this.params.horizontalSpeed);
    verticalSpeed = this.interpreter.numberValueOf(this.params.verticalSpeed);
    easing = gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut);
    layer = this.interpreter.numberValueOf(this.params.layer);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    if ((ref = scene.backgrounds[layer]) != null) {
      ref.animator.move(horizontalSpeed, verticalSpeed, duration, easing);
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandScrollBackgroundTo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScrollBackgroundTo = function() {
    var background, duration, easing, layer, p, scene, x, y;
    scene = SceneManager.scene;
    duration = this.interpreter.durationValueOf(this.params.duration);
    x = this.interpreter.numberValueOf(this.params.background.location.x);
    y = this.interpreter.numberValueOf(this.params.background.location.y);
    easing = gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut);
    layer = this.interpreter.numberValueOf(this.params.layer);
    background = scene.backgrounds[layer];
    if (!background) {
      return;
    }
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, background, this.params);
      x = p.x;
      y = p.y;
    }
    background.animator.moveTo(x, y, duration, easing);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandScrollBackgroundPath
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScrollBackgroundPath = function() {
    var background, scene;
    scene = SceneManager.scene;
    background = scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
    if (background == null) {
      return;
    }
    this.interpreter.moveObjectPath(background, this.params.path, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMaskBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMaskBackground = function() {
    var background, scene;
    scene = SceneManager.scene;
    background = scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
    if (background == null) {
      return;
    }
    this.interpreter.maskObject(background, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomBackground = function() {
    var duration, easing, layer, ref, scene, x, y;
    scene = SceneManager.scene;
    duration = this.interpreter.durationValueOf(this.params.duration);
    x = this.interpreter.numberValueOf(this.params.zooming.x);
    y = this.interpreter.numberValueOf(this.params.zooming.y);
    easing = gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut);
    layer = this.interpreter.numberValueOf(this.params.layer);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    if ((ref = scene.backgrounds[layer]) != null) {
      ref.animator.zoomTo(x / 100, y / 100, duration, easing);
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandRotateBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotateBackground = function() {
    var background, scene;
    scene = SceneManager.scene;
    background = scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
    if (background) {
      this.interpreter.rotateObject(background, this.params);
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**        
  * @method commandTintBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTintBackground = function() {
    var background, duration, easing, layer, scene;
    scene = SceneManager.scene;
    layer = this.interpreter.numberValueOf(this.params.layer);
    background = scene.backgrounds[layer];
    if (background == null) {
      return;
    }
    duration = this.interpreter.durationValueOf(this.params.duration);
    easing = gs.Easings.fromObject(this.params.easing);
    background.animator.tintTo(this.params.tone, duration, easing);
    this.interpreter.waitForCompletion(background, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBlendBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBlendBackground = function() {
    var background, layer;
    layer = this.interpreter.numberValueOf(this.params.layer);
    background = SceneManager.scene.backgrounds[layer];
    if (background == null) {
      return;
    }
    this.interpreter.blendObject(background, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBackgroundEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBackgroundEffect = function() {
    var background, layer;
    layer = this.interpreter.numberValueOf(this.params.layer);
    background = SceneManager.scene.backgrounds[layer];
    if (background == null) {
      return;
    }
    this.interpreter.objectEffect(background, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBackgroundDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBackgroundDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.background;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.duration)) {
      defaults.duration = this.interpreter.durationValueOf(this.params.duration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["easing.type"])) {
      defaults.easing = this.params.easing;
    }
    if (!isLocked(flags["animation.type"])) {
      defaults.animation = this.params.animation;
    }
    if (!isLocked(flags.origin)) {
      defaults.origin = this.params.origin;
    }
    if (!isLocked(flags.loopHorizontal)) {
      defaults.loopHorizontal = this.params.loopHorizontal;
    }
    if (!isLocked(flags.loopVertical)) {
      return defaults.loopVertical = this.params.loopVertical;
    }
  };


  /**
  * @method commandBackgroundMotionBlur
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBackgroundMotionBlur = function() {
    var background, layer;
    layer = this.interpreter.numberValueOf(this.params.layer);
    background = SceneManager.scene.backgrounds[layer];
    if (background == null) {
      return;
    }
    return background.motionBlur.set(this.params.motionBlur);
  };


  /**
  * @method commandChangeBackground
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeBackground = function() {
    var animation, defaults, duration, easing, flags, isLocked, layer, loopH, loopV, origin, ref, scene, zIndex;
    defaults = GameManager.defaults.background;
    scene = SceneManager.scene;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.duration;
    loopH = !isLocked(flags.loopHorizontal) ? this.params.loopHorizontal : defaults.loopHorizontal;
    loopV = !isLocked(flags.loopVertical) ? this.params.loopVertical : defaults.loopVertical;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.animation;
    origin = !isLocked(flags.origin) ? this.params.origin : defaults.origin;
    zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : defaults.zOrder;
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromObject(this.params.easing) : gs.Easings.fromObject(defaults.easing);
    layer = this.interpreter.numberValueOf(this.params.layer);
    scene.behavior.changeBackground(this.params.graphic, false, animation, easing, duration, 0, 0, layer, loopH, loopV);
    if (scene.backgrounds[layer]) {
      if (((ref = this.params.viewport) != null ? ref.type : void 0) === "ui") {
        scene.backgrounds[layer].viewport = Graphics.viewport;
      }
      scene.backgrounds[layer].anchor.x = origin === 0 ? 0 : 0.5;
      scene.backgrounds[layer].anchor.y = origin === 0 ? 0 : 0.5;
      scene.backgrounds[layer].blendMode = this.interpreter.numberValueOf(this.params.blendMode);
      scene.backgrounds[layer].zIndex = zIndex;
      if (origin === 1) {
        scene.backgrounds[layer].dstRect.x = scene.backgrounds[layer].dstRect.x;
        scene.backgrounds[layer].dstRect.y = scene.backgrounds[layer].dstRect.y;
      }
      scene.backgrounds[layer].setup();
      scene.backgrounds[layer].update();
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCallScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCallScene = function() {
    return this.interpreter.callScene(this.interpreter.stringValueOf(this.params.scene.uid || this.params.scene));
  };


  /**
  * @method commandChangeScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeScene = function() {
    var flags, isLocked, k, len, len1, n, newScene, picture, ref, ref1, scene, uid, video;
    if (GameManager.inLivePreview) {
      return;
    }
    if (!this.params.savePrevious) {
      SceneManager.clear();
    }
    scene = SceneManager.scene;
    if (!this.params.erasePictures && !this.params.savePrevious) {
      scene.removeObject(scene.pictureContainer);
      ref = scene.pictures;
      for (k = 0, len = ref.length; k < len; k++) {
        picture = ref[k];
        if (picture) {
          ResourceManager.context.remove("Graphics/Pictures/" + picture.image);
        }
      }
    }
    if (!this.params.eraseTexts && !this.params.savePrevious) {
      scene.removeObject(scene.textContainer);
    }
    if (!this.params.eraseVideos && !this.params.savePrevious) {
      scene.removeObject(scene.videoContainer);
      ref1 = scene.videos;
      for (n = 0, len1 = ref1.length; n < len1; n++) {
        video = ref1[n];
        if (video) {
          ResourceManager.context.remove("Movies/" + video.video);
        }
      }
    }
    if (this.params.scene) {
      if (this.params.savePrevious) {
        GameManager.sceneData = {
          uid: uid = this.params.scene.uid,
          pictures: [],
          texts: [],
          videos: []
        };
      } else {
        GameManager.sceneData = {
          uid: uid = this.params.scene.uid,
          pictures: scene.pictureContainer.subObjectsByDomain,
          texts: scene.textContainer.subObjectsByDomain,
          videos: scene.videoContainer.subObjectsByDomain
        };
      }
      flags = this.params.fieldFlags || {};
      isLocked = gs.CommandFieldFlags.isLocked;
      newScene = new vn.Object_Scene();
      if (this.params.savePrevious) {
        newScene.sceneData = {
          uid: uid = this.params.scene.uid,
          pictures: [],
          texts: [],
          videos: [],
          backlog: GameManager.backlog
        };
      } else {
        newScene.sceneData = {
          uid: uid = this.params.scene.uid,
          pictures: scene.pictureContainer.subObjectsByDomain,
          texts: scene.textContainer.subObjectsByDomain,
          videos: scene.videoContainer.subObjectsByDomain
        };
      }
      SceneManager.switchTo(newScene, this.params.savePrevious, (function(_this) {
        return function() {
          return _this.interpreter.isWaiting = false;
        };
      })(this));
    } else {
      SceneManager.switchTo(null);
    }
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandReturnToPreviousScene
  * @protected
   */

  Component_CommandInterpreter.prototype.commandReturnToPreviousScene = function() {
    if (GameManager.inLivePreview) {
      return;
    }
    SceneManager.returnToPrevious((function(_this) {
      return function() {
        return _this.interpreter.isWaiting = false;
      };
    })(this));
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandSwitchToLayout
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSwitchToLayout = function() {
    var scene;
    if (GameManager.inLivePreview) {
      return;
    }
    if (ui.UIManager.layouts[this.params.layout.name] != null) {
      scene = new gs.Object_Layout(this.params.layout.name);
      SceneManager.switchTo(scene, this.params.savePrevious);
      return this.interpreter.isWaiting = true;
    }
  };


  /**
  * @method commandChangeTransition
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeTransition = function() {
    var flags, isLocked;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.duration)) {
      SceneManager.transitionData.duration = this.interpreter.durationValueOf(this.params.duration);
    }
    if (!isLocked(flags.graphic)) {
      SceneManager.transitionData.graphic = this.params.graphic;
    }
    if (!isLocked(flags.vague)) {
      return SceneManager.transitionData.vague = this.params.vague;
    }
  };


  /**
  * @method commandFreezeScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandFreezeScreen = function() {
    return Graphics.freeze();
  };


  /**
  * @method commandScreenTransition
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScreenTransition = function() {
    var bitmap, defaults, duration, flags, graphicName, isLocked, ref, ref1, vague;
    defaults = GameManager.defaults.scene;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    graphicName = !isLocked(flags.graphic) ? (ref = this.params.graphic) != null ? ref.name : void 0 : (ref1 = SceneManager.transitionData.graphic) != null ? ref1.name : void 0;
    if (graphicName) {
      bitmap = !isLocked(flags.graphic) ? ResourceManager.getBitmap("Graphics/Masks/" + graphicName) : ResourceManager.getBitmap("Graphics/Masks/" + graphicName);
    }
    vague = !isLocked(flags.vague) ? this.interpreter.numberValueOf(this.params.vague) : SceneManager.transitionData.vague;
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : SceneManager.transitionData.duration;
    this.interpreter.isWaiting = !GameManager.inLivePreview;
    this.interpreter.waitCounter = duration;
    return Graphics.transition(duration, bitmap, vague);
  };


  /**
  * @method commandShakeScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShakeScreen = function() {
    if (SceneManager.scene.viewport == null) {
      return;
    }
    this.interpreter.shakeObject(SceneManager.scene.viewport, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTintScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTintScreen = function() {
    var duration;
    duration = this.interpreter.durationValueOf(this.params.duration);
    SceneManager.scene.viewport.animator.tintTo(new Tone(this.params.tone), duration, gs.Easings.EASE_LINEAR[0]);
    if (this.params.waitForCompletion && duration > 0) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomScreen = function() {
    var duration, easing, scene;
    easing = gs.Easings.fromObject(this.params.easing);
    duration = this.interpreter.durationValueOf(this.params.duration);
    scene = SceneManager.scene;
    SceneManager.scene.viewport.anchor.x = 0.5;
    SceneManager.scene.viewport.anchor.y = 0.5;
    SceneManager.scene.viewport.animator.zoomTo(this.interpreter.numberValueOf(this.params.zooming.x) / 100, this.interpreter.numberValueOf(this.params.zooming.y) / 100, duration, easing);
    this.interpreter.waitForCompletion(null, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPanScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPanScreen = function() {
    var duration, easing, scene, viewport;
    scene = SceneManager.scene;
    duration = this.interpreter.durationValueOf(this.params.duration);
    easing = gs.Easings.fromObject(this.params.easing);
    this.interpreter.settings.screen.pan.x -= this.params.position.x;
    this.interpreter.settings.screen.pan.y -= this.params.position.y;
    viewport = SceneManager.scene.viewport;
    viewport.animator.scrollTo(-this.params.position.x + viewport.dstRect.x, -this.params.position.y + viewport.dstRect.y, duration, easing);
    this.interpreter.waitForCompletion(null, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandRotateScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotateScreen = function() {
    var duration, easing, pan, scene;
    scene = SceneManager.scene;
    easing = gs.Easings.fromObject(this.params.easing);
    duration = this.interpreter.durationValueOf(this.params.duration);
    pan = this.interpreter.settings.screen.pan;
    SceneManager.scene.viewport.anchor.x = 0.5;
    SceneManager.scene.viewport.anchor.y = 0.5;
    SceneManager.scene.viewport.animator.rotate(this.params.direction, this.interpreter.numberValueOf(this.params.speed) / 100, duration, easing);
    this.interpreter.waitForCompletion(null, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandFlashScreen
  * @protected
   */

  Component_CommandInterpreter.prototype.commandFlashScreen = function() {
    var duration;
    duration = this.interpreter.durationValueOf(this.params.duration);
    SceneManager.scene.viewport.animator.flash(new Color(this.params.color), duration, gs.Easings.EASE_LINEAR[0]);
    if (this.params.waitForCompletion && duration !== 0) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandScreenEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScreenEffect = function() {
    var duration, easing, flags, isLocked, scene, viewport, wobble, zOrder;
    scene = SceneManager.scene;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    duration = this.interpreter.durationValueOf(this.params.duration);
    easing = gs.Easings.fromObject(this.params.easing);
    if (!gs.CommandFieldFlags.isLocked(flags.zOrder)) {
      zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    } else {
      zOrder = SceneManager.scene.viewport.zIndex;
    }
    viewport = scene.viewportContainer.subObjects.first(function(v) {
      return v.zIndex === zOrder;
    });
    if (!viewport) {
      viewport = new gs.Object_Viewport();
      viewport.zIndex = zOrder;
      scene.viewportContainer.addObject(viewport);
    }
    switch (this.params.type) {
      case 0:
        viewport.animator.wobbleTo(this.params.wobble.power / 10000, this.params.wobble.speed / 100, duration, easing);
        wobble = viewport.effects.wobble;
        wobble.enabled = this.params.wobble.power > 0;
        wobble.vertical = this.params.wobble.orientation === 0 || this.params.wobble.orientation === 2;
        wobble.horizontal = this.params.wobble.orientation === 1 || this.params.wobble.orientation === 2;
        break;
      case 1:
        viewport.animator.blurTo(this.params.blur.power / 100, duration, easing);
        viewport.effects.blur.enabled = true;
        break;
      case 2:
        viewport.animator.pixelateTo(this.params.pixelate.size.width, this.params.pixelate.size.height, duration, easing);
        viewport.effects.pixelate.enabled = true;
    }
    if (this.params.waitForCompletion && duration !== 0) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandVideoDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandVideoDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.video;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      defaults.disappearAnimation = this.params.disappearAnimation;
    }
    if (!isLocked(flags["motionBlur.enabled"])) {
      defaults.motionBlur = this.params.motionBlur;
    }
    if (!isLocked(flags.origin)) {
      return defaults.origin = this.params.origin;
    }
  };


  /**
  * @method commandShowVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowVideo = function() {
    var animation, defaults, duration, easing, flags, isLocked, number, origin, p, ref, ref1, scene, video, videos, x, y, zIndex;
    defaults = GameManager.defaults.video;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    videos = scene.videos;
    if (videos[number] == null) {
      videos[number] = new gs.Object_Video();
    }
    x = this.interpreter.numberValueOf(this.params.position.x);
    y = this.interpreter.numberValueOf(this.params.position.y);
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    origin = !isLocked(flags.origin) ? this.params.origin : defaults.origin;
    zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : defaults.zOrder;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    video = videos[number];
    video.domain = this.params.numberDomain;
    video.video = (ref = this.params.video) != null ? ref.name : void 0;
    video.loop = true;
    video.dstRect.x = x;
    video.dstRect.y = y;
    video.blendMode = this.interpreter.numberValueOf(this.params.blendMode);
    video.anchor.x = origin === 0 ? 0 : 0.5;
    video.anchor.y = origin === 0 ? 0 : 0.5;
    video.zIndex = zIndex || (1000 + number);
    if (((ref1 = this.params.viewport) != null ? ref1.type : void 0) === "scene") {
      video.viewport = SceneManager.scene.behavior.viewport;
    }
    video.update();
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, video, this.params);
      video.dstRect.x = p.x;
      video.dstRect.y = p.y;
    }
    video.animator.appear(x, y, animation, easing, duration);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMoveVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.moveObject(video, this.params.picture.position, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMoveVideoPath
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveVideoPath = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.moveObjectPath(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandRotateVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotateVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.rotateObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.zoomObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBlendVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBlendVideo = function() {
    var video;
    SceneManager.scene.behavior.changeVideoDomain(this.params.numberDomain);
    video = SceneManager.scene.videos[this.interpreter.numberValueOf(this.params.number)];
    if (video == null) {
      return;
    }
    this.interpreter.blendObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTintVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTintVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.tintObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandFlashVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandFlashVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.flashObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCropVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCropVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    return this.interpreter.cropObject(video, this.params);
  };


  /**
  * @method commandVideoMotionBlur
  * @protected
   */

  Component_CommandInterpreter.prototype.commandVideoMotionBlur = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    return this.interpreter.objectMotionBlur(video, this.params);
  };


  /**
  * @method commandMaskVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMaskVideo = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.maskObject(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandVideoEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandVideoEffect = function() {
    var number, scene, video;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    this.interpreter.objectEffect(video, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandEraseVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEraseVideo = function() {
    var animation, defaults, duration, easing, flags, isLocked, number, scene, video;
    defaults = GameManager.defaults.video;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changeVideoDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    video = scene.videos[number];
    if (video == null) {
      return;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.disappearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
    video.animator.disappear(animation, easing, duration, (function(_this) {
      return function(sender) {
        sender.dispose();
        scene.behavior.changeTextDomain(sender.domain);
        return scene.videos[number] = null;
      };
    })(this));
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandShowImageMap
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowImageMap = function() {
    var bitmap, flags, imageMap, isLocked, number, p, ref, ref1, ref2, ref3, ref4, ref5;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    SceneManager.scene.behavior.changePictureDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    imageMap = SceneManager.scene.pictures[number];
    if (imageMap != null) {
      imageMap.dispose();
    }
    imageMap = new gs.Object_ImageMap();
    imageMap.visual.variableContext = this.interpreter.context;
    SceneManager.scene.pictures[number] = imageMap;
    bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + ((ref = this.params.ground) != null ? ref.name : void 0));
    imageMap.dstRect.width = bitmap.width;
    imageMap.dstRect.height = bitmap.height;
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, imageMap, this.params);
      imageMap.dstRect.x = p.x;
      imageMap.dstRect.y = p.y;
    } else {
      imageMap.dstRect.x = this.interpreter.numberValueOf(this.params.position.x);
      imageMap.dstRect.y = this.interpreter.numberValueOf(this.params.position.y);
    }
    imageMap.anchor.x = this.params.origin === 1 ? 0.5 : 0;
    imageMap.anchor.y = this.params.origin === 1 ? 0.5 : 0;
    imageMap.zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : 400;
    imageMap.blendMode = !isLocked(flags.blendMode) ? this.params.blendMode : 0;
    imageMap.hotspots = this.params.hotspots;
    imageMap.images = [(ref1 = this.params.ground) != null ? ref1.name : void 0, (ref2 = this.params.hover) != null ? ref2.name : void 0, (ref3 = this.params.unselected) != null ? ref3.name : void 0, (ref4 = this.params.selected) != null ? ref4.name : void 0, (ref5 = this.params.selectedHover) != null ? ref5.name : void 0];
    imageMap.events.on("jumpTo", gs.CallBack("onJumpTo", this.interpreter));
    imageMap.events.on("callCommonEvent", gs.CallBack("onCallCommonEvent", this.interpreter));
    imageMap.setup();
    imageMap.update();
    this.interpreter.showObject(imageMap, {
      x: 0,
      y: 0
    }, this.params);
    if (this.params.waitForCompletion) {
      this.interpreter.waitCounter = 0;
      this.interpreter.isWaiting = true;
    }
    imageMap.events.on("finish", (function(_this) {
      return function(sender) {
        return _this.interpreter.isWaiting = false;
      };
    })(this));
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandEraseImageMap
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEraseImageMap = function() {
    var imageMap, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain);
    imageMap = scene.pictures[this.interpreter.numberValueOf(this.params.number)];
    if (imageMap == null) {
      return;
    }
    imageMap.events.emit("finish", imageMap);
    imageMap.visual.active = false;
    this.interpreter.eraseObject(imageMap, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandAddHotspot
  * @protected
   */

  Component_CommandInterpreter.prototype.commandAddHotspot = function() {
    var dragging, hotspot, hotspots, number, picture, ref, ref1, ref2, ref3, ref4, ref5, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeHotspotDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    hotspots = scene.hotspots;
    if (hotspots[number] == null) {
      hotspots[number] = new gs.Object_Hotspot();
    }
    hotspot = hotspots[number];
    hotspot.domain = this.params.numberDomain;
    switch (this.params.positionType) {
      case 0:
        hotspot.dstRect.x = this.params.box.x;
        hotspot.dstRect.y = this.params.box.y;
        hotspot.dstRect.width = this.params.box.size.width;
        hotspot.dstRect.height = this.params.box.size.height;
        break;
      case 1:
        hotspot.dstRect.x = this.interpreter.numberValueOf(this.params.box.x);
        hotspot.dstRect.y = this.interpreter.numberValueOf(this.params.box.y);
        hotspot.dstRect.width = this.interpreter.numberValueOf(this.params.box.size.width);
        hotspot.dstRect.height = this.interpreter.numberValueOf(this.params.box.size.height);
        break;
      case 2:
        picture = scene.pictures[this.interpreter.numberValueOf(this.params.pictureNumber)];
        if (picture != null) {
          hotspot.target = picture;
        }
        break;
      case 3:
        text = scene.texts[this.interpreter.numberValueOf(this.params.textNumber)];
        if (text != null) {
          hotspot.target = text;
        }
    }
    hotspot.behavior.shape = (ref = this.params.shape) != null ? ref : gs.HotspotShape.RECTANGLE;
    if (text != null) {
      hotspot.images = null;
    } else {
      hotspot.images = [((ref1 = this.params.baseGraphic) != null ? ref1.name : void 0) || this.interpreter.stringValueOf(this.params.baseGraphic) || (picture != null ? picture.image : void 0), ((ref2 = this.params.hoverGraphic) != null ? ref2.name : void 0) || this.interpreter.stringValueOf(this.params.hoverGraphic), ((ref3 = this.params.selectedGraphic) != null ? ref3.name : void 0) || this.interpreter.stringValueOf(this.params.selectedGraphic), ((ref4 = this.params.selectedHoverGraphic) != null ? ref4.name : void 0) || this.interpreter.stringValueOf(this.params.selectedHoverGraphic), ((ref5 = this.params.unselectedGraphic) != null ? ref5.name : void 0) || this.interpreter.stringValueOf(this.params.unselectedGraphic)];
    }
    if (this.params.actions.onClick.type !== 0 || this.params.actions.onClick.label) {
      hotspot.events.on("click", gs.CallBack("onHotspotClick", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onClick.bindValue)
      }));
    }
    if (this.params.actions.onEnter.type !== 0 || this.params.actions.onEnter.label) {
      hotspot.events.on("enter", gs.CallBack("onHotspotEnter", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onEnter.bindValue)
      }));
    }
    if (this.params.actions.onLeave.type !== 0 || this.params.actions.onLeave.label) {
      hotspot.events.on("leave", gs.CallBack("onHotspotLeave", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onLeave.bindValue)
      }));
    }
    if (this.params.actions.onDrag.type !== 0 || this.params.actions.onDrag.label) {
      hotspot.events.on("dragStart", gs.CallBack("onHotspotDragStart", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onDrag.bindValue)
      }));
      hotspot.events.on("drag", gs.CallBack("onHotspotDrag", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onDrag.bindValue)
      }));
      hotspot.events.on("dragEnd", gs.CallBack("onHotspotDragEnd", this.interpreter, {
        params: this.params,
        bindValue: this.interpreter.numberValueOf(this.params.actions.onDrag.bindValue)
      }));
    }
    if (this.params.actions.onSelect.type !== 0 || this.params.actions.onSelect.label || this.params.actions.onDeselect.type !== 0 || this.params.actions.onDeselect.label) {
      hotspot.events.on("stateChanged", gs.CallBack("onHotspotStateChanged", this.interpreter, this.params));
    }
    hotspot.selectable = true;
    hotspot.setup();
    if (this.params.dragging.enabled) {
      dragging = this.params.dragging;
      hotspot.draggable = {
        rect: new Rect(dragging.rect.x, dragging.rect.y, dragging.rect.size.width, dragging.rect.size.height),
        axisX: dragging.horizontal,
        axisY: dragging.vertical
      };
      hotspot.addComponent(new ui.Component_Draggable());
      return hotspot.events.on("drag", (function(_this) {
        return function(e) {
          var drag;
          drag = e.sender.draggable;
          GameManager.variableStore.setupTempVariables(_this.interpreter.context);
          if (_this.params.dragging.horizontal) {
            return _this.interpreter.setNumberValueTo(_this.params.dragging.variable, Math.round((e.sender.dstRect.x - drag.rect.x) / (drag.rect.width - e.sender.dstRect.width) * 100));
          } else {
            return _this.interpreter.setNumberValueTo(_this.params.dragging.variable, Math.round((e.sender.dstRect.y - drag.rect.y) / (drag.rect.height - e.sender.dstRect.height) * 100));
          }
        };
      })(this));
    }
  };


  /**
  * @method commandChangeHotspotState
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeHotspotState = function() {
    var flags, hotspot, isLocked, number, scene;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changeHotspotDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    hotspot = scene.hotspots[number];
    if (!hotspot) {
      return;
    }
    if (!isLocked(flags.selected)) {
      hotspot.behavior.selected = this.interpreter.booleanValueOf(this.params.selected);
    }
    if (!isLocked(flags.enabled)) {
      hotspot.behavior.enabled = this.interpreter.booleanValueOf(this.params.enabled);
    }
    hotspot.behavior.updateInput();
    return hotspot.behavior.updateImage();
  };


  /**
  * @method commandEraseHotspot
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEraseHotspot = function() {
    var number, scene;
    scene = SceneManager.scene;
    scene.behavior.changeHotspotDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    if (scene.hotspots[number] != null) {
      scene.hotspots[number].dispose();
      return scene.hotspotContainer.eraseObject(number);
    }
  };


  /**
  * @method commandChangeObjectDomain
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeObjectDomain = function() {
    return SceneManager.scene.behavior.changeObjectDomain(this.interpreter.stringValueOf(this.params.domain));
  };


  /**
  * @method commandPictureDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPictureDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.picture;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      defaults.disappearAnimation = this.params.disappearAnimation;
    }
    if (!isLocked(flags["motionBlur.enabled"])) {
      defaults.motionBlur = this.params.motionBlur;
    }
    if (!isLocked(flags.origin)) {
      return defaults.origin = this.params.origin;
    }
  };

  Component_CommandInterpreter.prototype.createPicture = function(graphic, params) {
    var animation, bitmap, defaults, duration, easing, flags, graphicName, isLocked, number, origin, picture, pictures, ref, ref1, ref2, ref3, ref4, ref5, ref6, scene, snapshot, x, y, zIndex;
    graphic = this.stringValueOf(graphic);
    graphicName = (graphic != null ? graphic.name : void 0) != null ? graphic.name : graphic;
    bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + graphicName);
    if (bitmap && !bitmap.loaded) {
      return null;
    }
    defaults = GameManager.defaults.picture;
    flags = params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    number = this.numberValueOf(params.number);
    pictures = scene.pictures;
    if (pictures[number] == null) {
      picture = new gs.Object_Picture(null, null, (ref = params.visual) != null ? ref.type : void 0);
      picture.domain = params.numberDomain;
      pictures[number] = picture;
      switch ((ref1 = params.visual) != null ? ref1.type : void 0) {
        case 1:
          picture.visual.looping.vertical = true;
          picture.visual.looping.horizontal = true;
          break;
        case 2:
          picture.frameThickness = params.visual.frame.thickness;
          picture.frameCornerSize = params.visual.frame.cornerSize;
          break;
        case 3:
          picture.visual.orientation = params.visual.threePartImage.orientation;
          break;
        case 4:
          picture.color = gs.Color.fromObject(params.visual.quad.color);
          break;
        case 5:
          snapshot = Graphics.snapshot();
          picture.bitmap = snapshot;
          picture.dstRect.width = snapshot.width;
          picture.dstRect.height = snapshot.height;
          picture.srcRect.set(0, 0, snapshot.width, snapshot.height);
      }
    }
    x = this.numberValueOf(params.position.x);
    y = this.numberValueOf(params.position.y);
    picture = pictures[number];
    if (!picture.bitmap) {
      picture.image = graphicName;
    } else {
      picture.image = null;
    }
    bitmap = (ref2 = picture.bitmap) != null ? ref2 : ResourceManager.getBitmap("Graphics/Pictures/" + graphicName);
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.numberValueOf(params.easing.type), params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.durationValueOf(params.duration) : defaults.appearDuration;
    origin = !isLocked(flags.origin) ? params.origin : defaults.origin;
    zIndex = !isLocked(flags.zOrder) ? this.numberValueOf(params.zOrder) : defaults.zOrder;
    animation = !isLocked(flags["animation.type"]) ? params.animation : defaults.appearAnimation;
    picture.mirror = params.position.horizontalFlip;
    picture.angle = params.position.angle || 0;
    picture.zoom.x = ((ref3 = params.position.data) != null ? ref3.zoom : void 0) || 1;
    picture.zoom.y = ((ref4 = params.position.data) != null ? ref4.zoom : void 0) || 1;
    picture.blendMode = this.numberValueOf(params.blendMode);
    if (params.origin === 1 && (bitmap != null)) {
      x += (bitmap.width * picture.zoom.x - bitmap.width) / 2;
      y += (bitmap.height * picture.zoom.y - bitmap.height) / 2;
    }
    picture.dstRect.x = x;
    picture.dstRect.y = y;
    picture.anchor.x = origin === 1 ? 0.5 : 0;
    picture.anchor.y = origin === 1 ? 0.5 : 0;
    picture.zIndex = zIndex || (700 + number);
    if (((ref5 = params.viewport) != null ? ref5.type : void 0) === "scene") {
      picture.viewport = SceneManager.scene.behavior.viewport;
    }
    if (((ref6 = params.size) != null ? ref6.type : void 0) === 1) {
      picture.dstRect.width = params.size.width;
      picture.dstRect.height = params.size.height;
    }
    picture.update();
    return picture;
  };


  /**
  * @method commandShowPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowPicture = function() {
    var animation, defaults, duration, easing, flags, isLocked, p, picture;
    SceneManager.scene.behavior.changePictureDomain(this.params.numberDomain || "");
    defaults = GameManager.defaults.picture;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    picture = this.interpreter.createPicture(this.params.graphic, this.params);
    if (!picture) {
      this.interpreter.pointer--;
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = 1;
      return;
    }
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, picture, this.params);
      picture.dstRect.x = p.x;
      picture.dstRect.y = p.y;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    picture.animator.appear(picture.dstRect.x, picture.dstRect.y, animation, easing, duration);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPlayPictureAnimation
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPlayPictureAnimation = function() {
    var animation, bitmap, component, defaults, duration, easing, flags, isLocked, p, picture, record;
    SceneManager.scene.behavior.changePictureDomain(this.params.numberDomain || "");
    defaults = GameManager.defaults.picture;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    picture = null;
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    if (this.params.animationId != null) {
      record = RecordManager.animations[this.params.animationId];
      if (record != null) {
        picture = this.interpreter.createPicture(record.graphic, this.params);
        component = picture.findComponent("Component_FrameAnimation");
        if (component != null) {
          component.refresh(record);
          component.start();
        } else {
          component = new gs.Component_FrameAnimation(record);
          picture.addComponent(component);
        }
        component.update();
        if (this.params.positionType === 0) {
          p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, picture, this.params);
          picture.dstRect.x = p.x;
          picture.dstRect.y = p.y;
        }
        picture.animator.appear(picture.dstRect.x, picture.dstRect.y, animation, easing, duration);
      }
    } else {
      picture = SceneManager.scene.pictures[this.interpreter.numberValueOf(this.params.number)];
      animation = picture != null ? picture.findComponent("Component_FrameAnimation") : void 0;
      if (animation != null) {
        picture.removeComponent(animation);
        bitmap = ResourceManager.getBitmap("Graphics/Animations/" + picture.image);
        if (bitmap != null) {
          picture.srcRect.set(0, 0, bitmap.width, bitmap.height);
          picture.dstRect.width = picture.srcRect.width;
          picture.dstRect.height = picture.srcRect.height;
        }
      }
    }
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMovePicturePath
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMovePicturePath = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.moveObjectPath(picture, this.params.path, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMovePicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMovePicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.moveObject(picture, this.params.picture.position, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTintPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTintPicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.tintObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandFlashPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandFlashPicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.flashObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandCropPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCropPicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    return this.interpreter.cropObject(picture, this.params);
  };


  /**
  * @method commandRotatePicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotatePicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.rotateObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomPicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.zoomObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBlendPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBlendPicture = function() {
    var picture;
    SceneManager.scene.behavior.changePictureDomain(this.params.numberDomain || "");
    picture = SceneManager.scene.pictures[this.interpreter.numberValueOf(this.params.number)];
    if (picture == null) {
      return;
    }
    this.interpreter.blendObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandShakePicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShakePicture = function() {
    var picture;
    picture = SceneManager.scene.pictures[this.interpreter.numberValueOf(this.params.number)];
    if (picture == null) {
      return;
    }
    this.interpreter.shakeObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMaskPicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMaskPicture = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.maskObject(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPictureMotionBlur
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPictureMotionBlur = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.objectMotionBlur(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPictureEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPictureEffect = function() {
    var number, picture, scene;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    this.interpreter.objectEffect(picture, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandErasePicture
  * @protected
   */

  Component_CommandInterpreter.prototype.commandErasePicture = function() {
    var animation, defaults, duration, easing, flags, isLocked, number, picture, scene;
    defaults = GameManager.defaults.picture;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changePictureDomain(this.params.numberDomain || "");
    number = this.interpreter.numberValueOf(this.params.number);
    picture = scene.pictures[number];
    if (picture == null) {
      return;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.disappearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
    picture.animator.disappear(animation, easing, duration, (function(_this) {
      return function(sender) {
        sender.dispose();
        scene.behavior.changePictureDomain(sender.domain);
        return scene.pictures[number] = null;
      };
    })(this));
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandInputNumber
  * @protected
   */

  Component_CommandInterpreter.prototype.commandInputNumber = function() {
    var scene;
    scene = SceneManager.scene;
    this.interpreter.isWaiting = true;
    if (this.interpreter.isProcessingMessageInOtherContext()) {
      this.interpreter.waitForMessage();
      return;
    }
    if ((GameManager.settings.allowChoiceSkip || this.interpreter.preview) && GameManager.tempSettings.skip) {
      this.interpreter.isWaiting = false;
      this.interpreter.messageObject().behavior.clear();
      this.interpreter.setNumberValueTo(this.params.variable, 0);
      return;
    }
    $tempFields.digits = this.params.digits;
    scene.behavior.showInputNumber(this.params.digits, gs.CallBack("onInputNumberFinish", this.interpreter, this.params));
    this.interpreter.waitingFor.inputNumber = this.params;
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandChoiceTimer
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChoiceTimer = function() {
    var scene;
    scene = SceneManager.scene;
    GameManager.tempFields.choiceTimer = scene.choiceTimer;
    GameManager.tempFields.choiceTimerVisible = this.params.visible;
    if (this.params.enabled) {
      scene.choiceTimer.behavior.seconds = this.interpreter.numberValueOf(this.params.seconds);
      scene.choiceTimer.behavior.minutes = this.interpreter.numberValueOf(this.params.minutes);
      scene.choiceTimer.behavior.start();
      return scene.choiceTimer.events.on("finish", (function(_this) {
        return function(sender) {
          var defaultChoice, ref;
          if (scene.choiceWindow && ((ref = GameManager.tempFields.choices) != null ? ref.length : void 0) > 0) {
            defaultChoice = (GameManager.tempFields.choices.first(function(c) {
              return c.isDefault;
            })) || GameManager.tempFields.choices[0];
            return scene.choiceWindow.events.emit("selectionAccept", scene.choiceWindow, defaultChoice);
          }
        };
      })(this));
    } else {
      return scene.choiceTimer.stop();
    }
  };


  /**
  * @method commandShowChoices
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowChoices = function() {
    var choices, defaultChoice, messageObject, pointer, scene;
    scene = SceneManager.scene;
    pointer = this.interpreter.pointer;
    choices = GameManager.tempFields.choices || [];
    if ((GameManager.settings.allowChoiceSkip || this.interpreter.previewData) && GameManager.tempSettings.skip) {
      messageObject = this.interpreter.messageObject();
      if (messageObject != null ? messageObject.visible : void 0) {
        messageObject.behavior.clear();
      }
      defaultChoice = (choices.first(function(c) {
        return c.isDefault;
      })) || choices[0];
      if (defaultChoice.action.labelIndex != null) {
        this.interpreter.pointer = defaultChoice.action.labelIndex;
      } else {
        this.interpreter.jumpToLabel(defaultChoice.action.label);
      }
    } else {
      if (choices.length > 0) {
        this.interpreter.isWaiting = true;
        scene.behavior.showChoices(choices, gs.CallBack("onChoiceAccept", this.interpreter, {
          pointer: pointer,
          params: this.params
        }));
      }
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandShowChoice
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowChoice = function() {
    var choices, command, commands, dstRect, index, pointer, scene;
    scene = SceneManager.scene;
    commands = this.interpreter.object.commands;
    command = null;
    index = 0;
    pointer = this.interpreter.pointer;
    choices = null;
    dstRect = null;
    switch (this.params.positionType) {
      case 0:
        dstRect = null;
        break;
      case 1:
        dstRect = new Rect(this.params.box.x, this.params.box.y, this.params.box.size.width, this.params.box.size.height);
    }
    if (!GameManager.tempFields.choices) {
      GameManager.tempFields.choices = [];
    }
    choices = GameManager.tempFields.choices;
    return choices.push({
      dstRect: dstRect,
      text: this.params.text,
      index: index,
      action: this.params.action,
      isSelected: false,
      isDefault: this.params.defaultChoice,
      isEnabled: this.interpreter.booleanValueOf(this.params.enabled)
    });
  };


  /**
  * @method commandOpenMenu
  * @protected
   */

  Component_CommandInterpreter.prototype.commandOpenMenu = function() {
    SceneManager.switchTo(new gs.Object_Layout("menuLayout"), true);
    this.interpreter.waitCounter = 1;
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandOpenLoadMenu
  * @protected
   */

  Component_CommandInterpreter.prototype.commandOpenLoadMenu = function() {
    SceneManager.switchTo(new gs.Object_Layout("loadMenuLayout"), true);
    this.interpreter.waitCounter = 1;
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandOpenSaveMenu
  * @protected
   */

  Component_CommandInterpreter.prototype.commandOpenSaveMenu = function() {
    SceneManager.switchTo(new gs.Object_Layout("saveMenuLayout"), true);
    this.interpreter.waitCounter = 1;
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandReturnToTitle
  * @protected
   */

  Component_CommandInterpreter.prototype.commandReturnToTitle = function() {
    SceneManager.clear();
    SceneManager.switchTo(new gs.Object_Layout("titleLayout"));
    this.interpreter.waitCounter = 1;
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandPlayVideo
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPlayVideo = function() {
    var ref, scene;
    if ((GameManager.inLivePreview || GameManager.settings.allowVideoSkip) && GameManager.tempSettings.skip) {
      return;
    }
    GameManager.tempSettings.skip = false;
    scene = SceneManager.scene;
    if (((ref = this.params.video) != null ? ref.name : void 0) != null) {
      scene.video = ResourceManager.getVideo("Movies/" + this.params.video.name);
      this.videoSprite = new Sprite(Graphics.viewport);
      this.videoSprite.srcRect = new Rect(0, 0, scene.video.width, scene.video.height);
      this.videoSprite.video = scene.video;
      this.videoSprite.zoomX = Graphics.width / scene.video.width;
      this.videoSprite.zoomY = Graphics.height / scene.video.height;
      this.videoSprite.z = 99999999;
      scene.video.onEnded = (function(_this) {
        return function() {
          _this.interpreter.isWaiting = false;
          _this.videoSprite.dispose();
          return scene.video = null;
        };
      })(this);
      scene.video.volume = this.params.volume / 100;
      scene.video.playbackRate = this.params.playbackRate / 100;
      this.interpreter.isWaiting = true;
      scene.video.play();
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandAudioDefaults
  * @protected
   */

  Component_CommandInterpreter.prototype.commandAudioDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.musicFadeInDuration)) {
      defaults.musicFadeInDuration = this.params.musicFadeInDuration;
    }
    if (!isLocked(flags.musicFadeOutDuration)) {
      defaults.musicFadeOutDuration = this.params.musicFadeOutDuration;
    }
    if (!isLocked(flags.musicVolume)) {
      defaults.musicVolume = this.params.musicVolume;
    }
    if (!isLocked(flags.musicPlaybackRate)) {
      defaults.musicPlaybackRate = this.params.musicPlaybackRate;
    }
    if (!isLocked(flags.soundVolume)) {
      defaults.soundVolume = this.params.soundVolume;
    }
    if (!isLocked(flags.soundPlaybackRate)) {
      defaults.soundPlaybackRate = this.params.soundPlaybackRate;
    }
    if (!isLocked(flags.voiceVolume)) {
      defaults.voiceVolume = this.params.voiceVolume;
    }
    if (!isLocked(flags.voicePlaybackRate)) {
      return defaults.voicePlaybackRate = this.params.voicePlaybackRate;
    }
  };


  /**
  * @method commandPlayMusic
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPlayMusic = function() {
    var defaults, fadeDuration, flags, isLocked, music, playRange, playTime, playbackRate, volume;
    if (this.params.music == null) {
      return;
    }
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (GameManager.settings.bgmEnabled) {
      fadeDuration = !isLocked(flags.fadeInDuration) ? this.params.fadeInDuration : defaults.musicFadeInDuration;
      volume = !isLocked(flags["music.volume"]) ? this.params.music.volume : defaults.musicVolume;
      playbackRate = !isLocked(flags["music.playbackRate"]) ? this.params.music.playbackRate : defaults.musicPlaybackRate;
      music = {
        name: this.params.music.name,
        volume: volume,
        playbackRate: playbackRate
      };
      if (this.params.playType === 1) {
        playTime = {
          min: this.params.playTime.min * 60,
          max: this.params.playTime.max * 60
        };
        playRange = {
          start: this.params.playRange.start * 60,
          end: this.params.playRange.end * 60
        };
        AudioManager.playMusicRandom(music, fadeDuration, this.params.layer || 0, playTime, playRange);
      } else {
        AudioManager.playMusic(this.params.music.name, volume, playbackRate, fadeDuration, this.params.layer || 0);
      }
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandStopMusic
  * @protected
   */

  Component_CommandInterpreter.prototype.commandStopMusic = function() {
    var defaults, fadeDuration, flags, isLocked;
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    fadeDuration = !isLocked(flags.fadeOutDuration) ? this.params.fadeOutDuration : defaults.musicFadeOutDuration;
    AudioManager.stopMusic(fadeDuration, this.interpreter.numberValueOf(this.params.layer));
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPauseMusic
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPauseMusic = function() {
    var defaults, fadeDuration, flags, isLocked;
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    fadeDuration = !isLocked(flags.fadeOutDuration) ? this.params.fadeOutDuration : defaults.musicFadeOutDuration;
    return AudioManager.stopMusic(fadeDuration, this.interpreter.numberValueOf(this.params.layer));
  };


  /**
  * @method commandResumeMusic
  * @protected
   */

  Component_CommandInterpreter.prototype.commandResumeMusic = function() {
    var defaults, fadeDuration, flags, isLocked;
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    fadeDuration = !isLocked(flags.fadeInDuration) ? this.params.fadeInDuration : defaults.musicFadeInDuration;
    AudioManager.resumeMusic(fadeDuration, this.interpreter.numberValueOf(this.params.layer));
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandPlaySound
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPlaySound = function() {
    var defaults, flags, isLocked, playbackRate, volume;
    defaults = GameManager.defaults.audio;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (GameManager.settings.soundEnabled && !GameManager.tempSettings.skip) {
      volume = !isLocked(flags["sound.volume"]) ? this.params.sound.volume : defaults.soundVolume;
      playbackRate = !isLocked(flags["sound.playbackRate"]) ? this.params.sound.playbackRate : defaults.soundPlaybackRate;
      AudioManager.playSound(this.params.sound.name, volume, playbackRate, this.params.musicEffect);
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandStopSound
  * @protected
   */

  Component_CommandInterpreter.prototype.commandStopSound = function() {
    AudioManager.stopSound(this.params.sound.name);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandEndCommonEvent
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEndCommonEvent = function() {
    var event, eventId;
    eventId = this.interpreter.stringValueOf(this.params.commonEventId);
    event = GameManager.commonEvents[eventId];
    return event != null ? event.behavior.stop() : void 0;
  };


  /**
  * @method commandResumeCommonEvent
  * @protected
   */

  Component_CommandInterpreter.prototype.commandResumeCommonEvent = function() {
    var event, eventId;
    eventId = this.interpreter.stringValueOf(this.params.commonEventId);
    event = GameManager.commonEvents[eventId];
    return event != null ? event.behavior.resume() : void 0;
  };


  /**
  * @method commandCallCommonEvent
  * @protected
   */

  Component_CommandInterpreter.prototype.commandCallCommonEvent = function() {
    var eventId, list, params, scene;
    scene = SceneManager.scene;
    eventId = null;
    if (this.params.commonEventId.index != null) {
      eventId = this.interpreter.stringValueOf(this.params.commonEventId);
      list = this.interpreter.listObjectOf(this.params.parameters.values[0]);
      params = {
        values: list
      };
    } else {
      params = this.params.parameters;
      eventId = this.params.commonEventId;
    }
    return this.interpreter.callCommonEvent(eventId, params);
  };


  /**
  * @method commandChangeTextSettings
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeTextSettings = function() {
    var flags, font, fontName, fontSize, isLocked, number, padding, ref, ref1, ref2, ref3, ref4, scene, textSprite, texts;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    texts = scene.texts;
    if (texts[number] == null) {
      texts[number] = new gs.Object_Text();
      texts[number].visible = false;
    }
    textSprite = texts[number];
    padding = textSprite.behavior.padding;
    font = textSprite.font;
    fontName = textSprite.font.name;
    fontSize = textSprite.font.size;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.lineSpacing)) {
      textSprite.textRenderer.lineSpacing = (ref = this.params.lineSpacing) != null ? ref : textSprite.textRenderer.lineSpacing;
    }
    if (!isLocked(flags.font)) {
      fontName = this.interpreter.stringValueOf(this.params.font);
    }
    if (!isLocked(flags.size)) {
      fontSize = this.interpreter.numberValueOf(this.params.size);
    }
    if (!isLocked(flags.font) || !isLocked(flags.size)) {
      textSprite.font = new Font(fontName, fontSize);
    }
    padding.left = !isLocked(flags["padding.0"]) ? (ref1 = this.params.padding) != null ? ref1[0] : void 0 : padding.left;
    padding.top = !isLocked(flags["padding.1"]) ? (ref2 = this.params.padding) != null ? ref2[1] : void 0 : padding.top;
    padding.right = !isLocked(flags["padding.2"]) ? (ref3 = this.params.padding) != null ? ref3[2] : void 0 : padding.right;
    padding.bottom = !isLocked(flags["padding.3"]) ? (ref4 = this.params.padding) != null ? ref4[3] : void 0 : padding.bottom;
    if (!isLocked(flags.bold)) {
      textSprite.font.bold = this.params.bold;
    }
    if (!isLocked(flags.italic)) {
      textSprite.font.italic = this.params.italic;
    }
    if (!isLocked(flags.smallCaps)) {
      textSprite.font.smallCaps = this.params.smallCaps;
    }
    if (!isLocked(flags.underline)) {
      textSprite.font.underline = this.params.underline;
    }
    if (!isLocked(flags.strikeThrough)) {
      textSprite.font.strikeThrough = this.params.strikeThrough;
    }
    textSprite.font.color = !isLocked(flags.color) ? new Color(this.params.color) : font.color;
    textSprite.font.border = !isLocked(flags.outline) ? this.params.outline : font.border;
    textSprite.font.borderColor = !isLocked(flags.outlineColor) ? new Color(this.params.outlineColor) : new Color(font.borderColor);
    textSprite.font.borderSize = !isLocked(flags.outlineSize) ? this.params.outlineSize : font.borderSize;
    textSprite.font.shadow = !isLocked(flags.shadow) ? this.params.shadow : font.shadow;
    textSprite.font.shadowColor = !isLocked(flags.shadowColor) ? new Color(this.params.shadowColor) : new Color(font.shadowColor);
    textSprite.font.shadowOffsetX = !isLocked(flags.shadowOffsetX) ? this.params.shadowOffsetX : font.shadowOffsetX;
    textSprite.font.shadowOffsetY = !isLocked(flags.shadowOffsetY) ? this.params.shadowOffsetY : font.shadowOffsetY;
    textSprite.behavior.refresh();
    return textSprite.update();
  };


  /**
  * @method commandChangeTextSettings
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTextDefaults = function() {
    var defaults, flags, isLocked;
    defaults = GameManager.defaults.text;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    if (!isLocked(flags.appearDuration)) {
      defaults.appearDuration = this.interpreter.durationValueOf(this.params.appearDuration);
    }
    if (!isLocked(flags.disappearDuration)) {
      defaults.disappearDuration = this.interpreter.durationValueOf(this.params.disappearDuration);
    }
    if (!isLocked(flags.zOrder)) {
      defaults.zOrder = this.interpreter.numberValueOf(this.params.zOrder);
    }
    if (!isLocked(flags["appearEasing.type"])) {
      defaults.appearEasing = this.params.appearEasing;
    }
    if (!isLocked(flags["appearAnimation.type"])) {
      defaults.appearAnimation = this.params.appearAnimation;
    }
    if (!isLocked(flags["disappearEasing.type"])) {
      defaults.disappearEasing = this.params.disappearEasing;
    }
    if (!isLocked(flags["disappearAnimation.type"])) {
      defaults.disappearAnimation = this.params.disappearAnimation;
    }
    if (!isLocked(flags["motionBlur.enabled"])) {
      defaults.motionBlur = this.params.motionBlur;
    }
    if (!isLocked(flags.origin)) {
      return defaults.origin = this.params.origin;
    }
  };


  /**
  * @method commandShowText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandShowText = function() {
    var animation, defaults, duration, easing, flags, isLocked, number, origin, p, positionAnchor, ref, scene, text, textObject, texts, x, y, zIndex;
    defaults = GameManager.defaults.text;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = this.params.text;
    texts = scene.texts;
    if (texts[number] == null) {
      texts[number] = new gs.Object_Text();
    }
    x = this.interpreter.numberValueOf(this.params.position.x);
    y = this.interpreter.numberValueOf(this.params.position.y);
    textObject = texts[number];
    textObject.domain = this.params.numberDomain;
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.appearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.appearDuration;
    origin = !isLocked(flags.origin) ? this.params.origin : defaults.origin;
    zIndex = !isLocked(flags.zOrder) ? this.interpreter.numberValueOf(this.params.zOrder) : defaults.zOrder;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.appearAnimation;
    positionAnchor = !isLocked(flags.positionOrigin) ? this.interpreter.graphicAnchorPointsByConstant[this.params.positionOrigin] || new gs.Point(0, 0) : this.interpreter.graphicAnchorPointsByConstant[defaults.positionOrigin];
    textObject.text = text;
    textObject.dstRect.x = x;
    textObject.dstRect.y = y;
    textObject.blendMode = this.interpreter.numberValueOf(this.params.blendMode);
    textObject.anchor.x = origin === 0 ? 0 : 0.5;
    textObject.anchor.y = origin === 0 ? 0 : 0.5;
    textObject.positionAnchor.x = positionAnchor.x;
    textObject.positionAnchor.y = positionAnchor.y;
    textObject.zIndex = zIndex || (700 + number);
    textObject.sizeToFit = true;
    textObject.formatting = true;
    if (((ref = this.params.viewport) != null ? ref.type : void 0) === "scene") {
      textObject.viewport = SceneManager.scene.behavior.viewport;
    }
    textObject.update();
    if (this.params.positionType === 0) {
      p = this.interpreter.predefinedObjectPosition(this.params.predefinedPositionId, textObject, this.params);
      textObject.dstRect.x = p.x;
      textObject.dstRect.y = p.y;
    }
    textObject.animator.appear(x, y, animation, easing, duration);
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTextMotionBlur
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTextMotionBlur = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    return text.motionBlur.set(this.params.motionBlur);
  };


  /**
  * @method commandRefreshText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRefreshText = function() {
    var number, scene, texts;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    texts = scene.texts;
    if (texts[number] == null) {
      return;
    }
    return texts[number].behavior.refresh(true);
  };


  /**
  * @method commandMoveText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveText = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    this.interpreter.moveObject(text, this.params.picture.position, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandMoveTextPath
  * @protected
   */

  Component_CommandInterpreter.prototype.commandMoveTextPath = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    this.interpreter.moveObjectPath(text, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandRotateText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandRotateText = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    this.interpreter.rotateObject(text, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandZoomText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandZoomText = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    this.interpreter.zoomObject(text, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandBlendText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandBlendText = function() {
    var text;
    SceneManager.scene.behavior.changeTextDomain(this.params.numberDomain);
    text = SceneManager.scene.texts[this.interpreter.numberValueOf(this.params.number)];
    if (text == null) {
      return;
    }
    this.interpreter.blendObject(text, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandColorText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandColorText = function() {
    var duration, easing, number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    duration = this.interpreter.durationValueOf(this.params.duration);
    easing = gs.Easings.fromObject(this.params.easing);
    if (text != null) {
      text.animator.colorTo(new Color(this.params.color), duration, easing);
      if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
        this.interpreter.isWaiting = true;
        this.interpreter.waitCounter = duration;
      }
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandEraseText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandEraseText = function() {
    var animation, defaults, duration, easing, flags, isLocked, number, scene, text;
    defaults = GameManager.defaults.text;
    flags = this.params.fieldFlags || {};
    isLocked = gs.CommandFieldFlags.isLocked;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    easing = !isLocked(flags["easing.type"]) ? gs.Easings.fromValues(this.interpreter.numberValueOf(this.params.easing.type), this.params.easing.inOut) : gs.Easings.fromObject(defaults.disappearEasing);
    duration = !isLocked(flags.duration) ? this.interpreter.durationValueOf(this.params.duration) : defaults.disappearDuration;
    animation = !isLocked(flags["animation.type"]) ? this.params.animation : defaults.disappearAnimation;
    text.animator.disappear(animation, easing, duration, (function(_this) {
      return function(sender) {
        sender.dispose();
        scene.behavior.changeTextDomain(sender.domain);
        return scene.texts[number] = null;
      };
    })(this));
    if (this.params.waitForCompletion && !(duration === 0 || this.interpreter.isInstantSkip())) {
      this.interpreter.isWaiting = true;
      this.interpreter.waitCounter = duration;
    }
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandTextEffect
  * @protected
   */

  Component_CommandInterpreter.prototype.commandTextEffect = function() {
    var number, scene, text;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    number = this.interpreter.numberValueOf(this.params.number);
    text = scene.texts[number];
    if (text == null) {
      return;
    }
    this.interpreter.objectEffect(text, this.params);
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandInputText
  * @protected
   */

  Component_CommandInterpreter.prototype.commandInputText = function() {
    var scene;
    scene = SceneManager.scene;
    scene.behavior.changeTextDomain(this.params.numberDomain);
    if ((GameManager.settings.allowChoiceSkip || this.interpreter.preview) && GameManager.tempSettings.skip) {
      this.interpreter.messageObject().behavior.clear();
      this.interpreter.setStringValueTo(this.params.variable, "");
      return;
    }
    this.interpreter.isWaiting = true;
    if (this.interpreter.isProcessingMessageInOtherContext()) {
      this.interpreter.waitForMessage();
      return;
    }
    $tempFields.letters = this.params.letters;
    scene.behavior.showInputText(this.params.letters, gs.CallBack("onInputTextFinish", this.interpreter, this.interpreter));
    this.interpreter.waitingFor.inputText = this.params;
    return gs.GameNotifier.postMinorChange();
  };


  /**
  * @method commandSavePersistentData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSavePersistentData = function() {
    return GameManager.saveGlobalData();
  };


  /**
  * @method commandSaveSettings
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSaveSettings = function() {
    return GameManager.saveSettings();
  };


  /**
  * @method commandPrepareSaveGame
  * @protected
   */

  Component_CommandInterpreter.prototype.commandPrepareSaveGame = function() {
    if (this.interpreter.previewData != null) {
      return;
    }
    this.interpreter.pointer++;
    GameManager.prepareSaveGame(this.params.snapshot);
    return this.interpreter.pointer--;
  };


  /**
  * @method commandSaveGame
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSaveGame = function() {
    var thumbHeight, thumbWidth;
    if (this.interpreter.previewData != null) {
      return;
    }
    thumbWidth = this.interpreter.numberValueOf(this.params.thumbWidth);
    thumbHeight = this.interpreter.numberValueOf(this.params.thumbHeight);
    return GameManager.save(this.interpreter.numberValueOf(this.params.slot) - 1, thumbWidth, thumbHeight);
  };


  /**
  * @method commandLoadGame
  * @protected
   */

  Component_CommandInterpreter.prototype.commandLoadGame = function() {
    if (this.interpreter.previewData != null) {
      return;
    }
    return GameManager.load(this.interpreter.numberValueOf(this.params.slot) - 1);
  };


  /**
  * @method commandWaitForInput
  * @protected
   */

  Component_CommandInterpreter.prototype.commandWaitForInput = function() {
    var f;
    gs.GlobalEventManager.offByOwner("mouseDown", this.object);
    gs.GlobalEventManager.offByOwner("mouseUp", this.object);
    gs.GlobalEventManager.offByOwner("keyDown", this.object);
    gs.GlobalEventManager.offByOwner("keyUp", this.object);
    f = (function(_this) {
      return function() {
        var executeAction;
        executeAction = false;
        if (Input.Mouse.isButton(_this.params.key)) {
          executeAction = Input.Mouse.buttons[_this.params.key] === _this.params.state;
        } else {
          executeAction = Input.keys[_this.params.key] === _this.params.state;
        }
        if (executeAction) {
          _this.interpreter.isWaiting = false;
          gs.GlobalEventManager.offByOwner("mouseDown", _this.object);
          gs.GlobalEventManager.offByOwner("mouseUp", _this.object);
          gs.GlobalEventManager.offByOwner("keyDown", _this.object);
          return gs.GlobalEventManager.offByOwner("keyUp", _this.object);
        }
      };
    })(this);
    gs.GlobalEventManager.on("mouseDown", f, null, this.object);
    gs.GlobalEventManager.on("mouseUp", f, null, this.object);
    gs.GlobalEventManager.on("keyDown", f, null, this.object);
    gs.GlobalEventManager.on("KeyUp", f, null, this.object);
    return this.interpreter.isWaiting = true;
  };


  /**
  * @method commandGetInputData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandGetInputData = function() {
    switch (this.params.field) {
      case 0:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.A]);
      case 1:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.B]);
      case 2:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.X]);
      case 3:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.Y]);
      case 4:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.L]);
      case 5:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.R]);
      case 6:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.START]);
      case 7:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.keys[Input.SELECT]);
      case 8:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.x);
      case 9:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.y);
      case 10:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.wheel);
      case 11:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.buttons[Input.Mouse.LEFT]);
      case 12:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.buttons[Input.Mouse.RIGHT]);
      case 13:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Input.Mouse.buttons[Input.Mouse.MIDDLE]);
    }
  };


  /**
  * @method commandGetGameData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandGetGameData = function() {
    var ref, ref1, settings, tempSettings;
    tempSettings = GameManager.tempSettings;
    settings = GameManager.settings;
    switch (this.params.field) {
      case 0:
        return this.interpreter.setStringValueTo(this.params.targetVariable, SceneManager.scene.sceneDocument.uid);
      case 1:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(Graphics.frameCount / 60));
      case 2:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(Graphics.frameCount / 60 / 60));
      case 3:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(Graphics.frameCount / 60 / 60 / 60));
      case 4:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, new Date().getDate());
      case 5:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, new Date().getDay());
      case 6:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, new Date().getMonth());
      case 7:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, new Date().getFullYear());
      case 8:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.allowSkip);
      case 9:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.allowSkipUnreadMessages);
      case 10:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, settings.messageSpeed);
      case 11:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.autoMessage.enabled);
      case 12:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, settings.autoMessage.time);
      case 13:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.autoMessage.waitForVoice);
      case 14:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.autoMessage.stopOnAction);
      case 15:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.timeMessageToVoice);
      case 16:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.allowVideoSkip);
      case 17:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.allowChoiceSkip);
      case 18:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.skipVoiceOnAction);
      case 19:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.fullScreen);
      case 20:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.adjustAspectRatio);
      case 21:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.confirmation);
      case 22:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, settings.bgmVolume);
      case 23:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, settings.voiceVolume);
      case 24:
        return this.interpreter.setNumberValueTo(this.params.targetVariable, settings.seVolume);
      case 25:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.bgmEnabled);
      case 26:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.voiceEnabled);
      case 27:
        return this.interpreter.setBooleanValueTo(this.params.targetVariable, settings.seEnabled);
      case 28:
        return this.interpreter.setStringValueTo(this.params.targetVariable, ((ref = LanguageManager.language) != null ? ref.code : void 0) || "");
      case 29:
        return this.interpreter.setStringValueTo(this.params.targetVariable, ((ref1 = LanguageManager.language) != null ? ref1.name : void 0) || "");
    }
  };


  /**
  * @method commandSetGameData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSetGameData = function() {
    var code, language, settings, tempSettings;
    tempSettings = GameManager.tempSettings;
    settings = GameManager.settings;
    switch (this.params.field) {
      case 0:
        return settings.allowSkip = this.interpreter.booleanValueOf(this.params.switchValue);
      case 1:
        return settings.allowSkipUnreadMessages = this.interpreter.booleanValueOf(this.params.switchValue);
      case 2:
        return settings.messageSpeed = this.interpreter.numberValueOf(this.params.numberValue);
      case 3:
        return settings.autoMessage.enabled = this.interpreter.booleanValueOf(this.params.switchValue);
      case 4:
        return settings.autoMessage.time = this.interpreter.numberValueOf(this.params.numberValue);
      case 5:
        return settings.autoMessage.waitForVoice = this.interpreter.booleanValueOf(this.params.switchValue);
      case 6:
        return settings.autoMessage.stopOnAction = this.interpreter.booleanValueOf(this.params.switchValue);
      case 7:
        return settings.timeMessageToVoice = this.interpreter.booleanValueOf(this.params.switchValue);
      case 8:
        return settings.allowVideoSkip = this.interpreter.booleanValueOf(this.params.switchValue);
      case 9:
        return settings.allowChoiceSkip = this.interpreter.booleanValueOf(this.params.switchValue);
      case 10:
        return settings.skipVoiceOnAction = this.interpreter.booleanValueOf(this.params.switchValue);
      case 11:
        settings.fullScreen = this.interpreter.booleanValueOf(this.params.switchValue);
        if (settings.fullScreen) {
          return SceneManager.scene.behavior.enterFullScreen();
        } else {
          return SceneManager.scene.behavior.leaveFullScreen();
        }
        break;
      case 12:
        settings.adjustAspectRatio = this.interpreter.booleanValueOf(this.params.switchValue);
        Graphics.keepRatio = settings.adjustAspectRatio;
        return Graphics.onResize();
      case 13:
        return settings.confirmation = this.interpreter.booleanValueOf(this.params.switchValue);
      case 14:
        return settings.bgmVolume = this.interpreter.numberValueOf(this.params.numberValue);
      case 15:
        return settings.voiceVolume = this.interpreter.numberValueOf(this.params.numberValue);
      case 16:
        return settings.seVolume = this.interpreter.numberValueOf(this.params.numberValue);
      case 17:
        return settings.bgmEnabled = this.interpreter.booleanValueOf(this.params.switchValue);
      case 18:
        return settings.voiceEnabled = this.interpreter.booleanValueOf(this.params.switchValue);
      case 19:
        return settings.seEnabled = this.interpreter.booleanValueOf(this.params.switchValue);
      case 20:
        code = this.interpreter.stringValueOf(this.params.textValue);
        language = LanguageManager.languages.first((function(_this) {
          return function(l) {
            return l.code === code;
          };
        })(this));
        if (language) {
          return LanguageManager.selectLanguage(language);
        }
    }
  };


  /**
  * @method commandGetObjectData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandGetObjectData = function() {
    var area, characterId, field, object, ref, ref1, scene;
    scene = SceneManager.scene;
    switch (this.params.objectType) {
      case 0:
        scene.behavior.changePictureDomain(this.params.numberDomain);
        object = SceneManager.scene.pictures[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 1:
        object = SceneManager.scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
        break;
      case 2:
        scene.behavior.changeTextDomain(this.params.numberDomain);
        object = SceneManager.scene.texts[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 3:
        scene.behavior.changeVideoDomain(this.params.numberDomain);
        object = SceneManager.scene.videos[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 4:
        characterId = this.interpreter.stringValueOf(this.params.characterId);
        object = SceneManager.scene.characters.first((function(_this) {
          return function(v) {
            return !v.disposed && v.rid === characterId;
          };
        })(this));
        break;
      case 5:
        object = gs.ObjectManager.current.objectById("messageBox");
        break;
      case 6:
        scene.behavior.changeMessageAreaDomain(this.params.numberDomain);
        area = SceneManager.scene.messageAreas[this.interpreter.numberValueOf(this.params.number)];
        object = area != null ? area.layout : void 0;
        break;
      case 7:
        scene.behavior.changeHotspotDomain(this.params.numberDomain);
        object = SceneManager.scene.hotspots[this.interpreter.numberValueOf(this.params.number)];
    }
    field = this.params.field;
    if (this.params.objectType === 4) {
      switch (this.params.field) {
        case 0:
          this.interpreter.setStringValueTo(this.params.targetVariable, ((ref = RecordManager.characters[characterId]) != null ? ref.index : void 0) || "");
          break;
        case 1:
          this.interpreter.setStringValueTo(this.params.targetVariable, lcs((ref1 = RecordManager.characters[characterId]) != null ? ref1.name : void 0) || "");
      }
      field -= 2;
    }
    if (object != null) {
      if (field >= 0) {
        switch (field) {
          case 0:
            switch (this.params.objectType) {
              case 2:
                return this.interpreter.setStringValueTo(this.params.targetVariable, object.text || "");
              case 3:
                return this.interpreter.setStringValueTo(this.params.targetVariable, object.video || "");
              default:
                return this.interpreter.setStringValueTo(this.params.targetVariable, object.image || "");
            }
            break;
          case 1:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.dstRect.x);
          case 2:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.dstRect.y);
          case 3:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(object.anchor.x * 100));
          case 4:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(object.anchor.y * 100));
          case 5:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(object.zoom.x * 100));
          case 6:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, Math.round(object.zoom.y * 100));
          case 7:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.dstRect.width);
          case 8:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.dstRect.height);
          case 9:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.zIndex);
          case 10:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.opacity);
          case 11:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.angle);
          case 12:
            return this.interpreter.setBooleanValueTo(this.params.targetVariable, object.visible);
          case 13:
            return this.interpreter.setNumberValueTo(this.params.targetVariable, object.blendMode);
          case 14:
            return this.interpreter.setBooleanValueTo(this.params.targetVariable, object.mirror);
        }
      }
    }
  };


  /**
  * @method commandSetObjectData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandSetObjectData = function() {
    var area, characterId, field, name, object, ref, scene;
    scene = SceneManager.scene;
    switch (this.params.objectType) {
      case 0:
        scene.behavior.changePictureDomain(this.params.numberDomain);
        object = SceneManager.scene.pictures[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 1:
        object = SceneManager.scene.backgrounds[this.interpreter.numberValueOf(this.params.layer)];
        break;
      case 2:
        scene.behavior.changeTextDomain(this.params.numberDomain);
        object = SceneManager.scene.texts[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 3:
        scene.behavior.changeVideoDomain(this.params.numberDomain);
        object = SceneManager.scene.videos[this.interpreter.numberValueOf(this.params.number)];
        break;
      case 4:
        characterId = this.interpreter.stringValueOf(this.params.characterId);
        object = SceneManager.scene.characters.first((function(_this) {
          return function(v) {
            return !v.disposed && v.rid === characterId;
          };
        })(this));
        break;
      case 5:
        object = gs.ObjectManager.current.objectById("messageBox");
        break;
      case 6:
        scene.behavior.changeMessageAreaDomain(this.params.numberDomain);
        area = SceneManager.scene.messageAreas[this.interpreter.numberValueOf(this.params.number)];
        object = area != null ? area.layout : void 0;
        break;
      case 7:
        scene.behavior.changeHotspotDomain(this.params.numberDomain);
        object = SceneManager.scene.hotspots[this.interpreter.numberValueOf(this.params.number)];
    }
    field = this.params.field;
    if (this.params.objectType === 4) {
      switch (field) {
        case 0:
          name = this.interpreter.stringValueOf(this.params.textValue);
          if (object != null) {
            object.name = name;
          }
          if ((ref = RecordManager.characters[characterId]) != null) {
            ref.name = name;
          }
      }
      field--;
    }
    if (object != null) {
      if (field >= 0) {
        switch (field) {
          case 0:
            switch (this.params.objectType) {
              case 2:
                return object.text = this.interpreter.stringValueOf(this.params.textValue);
              case 3:
                return object.video = this.interpreter.stringValueOf(this.params.textValue);
              default:
                return object.image = this.interpreter.stringValueOf(this.params.textValue);
            }
            break;
          case 1:
            return object.dstRect.x = this.interpreter.numberValueOf(this.params.numberValue);
          case 2:
            return object.dstRect.y = this.interpreter.numberValueOf(this.params.numberValue);
          case 3:
            return object.anchor.x = this.interpreter.numberValueOf(this.params.numberValue) / 100;
          case 4:
            return object.anchor.y = this.interpreter.numberValueOf(this.params.numberValue) / 100;
          case 5:
            return object.zoom.x = this.interpreter.numberValueOf(this.params.numberValue) / 100;
          case 6:
            return object.zoom.y = this.interpreter.numberValueOf(this.params.numberValue) / 100;
          case 7:
            return object.zIndex = this.interpreter.numberValueOf(this.params.numberValue);
          case 8:
            return object.opacity = this.interpreter.numberValueOf(this.params.numberValue);
          case 9:
            return object.angle = this.interpreter.numberValueOf(this.params.numberValue);
          case 10:
            return object.visible = this.interpreter.booleanValueOf(this.params.switchValue);
          case 11:
            return object.blendMode = this.interpreter.numberValueOf(this.params.numberValue);
          case 12:
            return object.mirror = this.interpreter.booleanValueOf(this.params.switchValue);
        }
      }
    }
  };


  /**
  * @method commandChangeSounds
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeSounds = function() {
    var fieldFlags, i, k, len, ref, results, sound, sounds;
    sounds = RecordManager.system.sounds;
    fieldFlags = this.params.fieldFlags || {};
    ref = this.params.sounds;
    results = [];
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      sound = ref[i];
      if (!gs.CommandFieldFlags.isLocked(fieldFlags["sounds." + i])) {
        results.push(sounds[i] = this.params.sounds[i]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * @method commandChangeColors
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeColors = function() {
    var color, colors, fieldFlags, i, k, len, ref, results;
    colors = RecordManager.system.colors;
    fieldFlags = this.params.fieldFlags || {};
    ref = this.params.colors;
    results = [];
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      color = ref[i];
      if (!gs.CommandFieldFlags.isLocked(fieldFlags["colors." + i])) {
        results.push(colors[i] = new gs.Color(this.params.colors[i]));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * @method commandChangeScreenCursor
  * @protected
   */

  Component_CommandInterpreter.prototype.commandChangeScreenCursor = function() {
    var bitmap, ref;
    if (((ref = this.params.graphic) != null ? ref.name : void 0) != null) {
      bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + this.params.graphic.name);
      return Graphics.setCursorBitmap(bitmap, this.params.hx, this.params.hy);
    } else {
      return Graphics.setCursorBitmap(null, 0, 0);
    }
  };


  /**
  * @method commandResetGlobalData
  * @protected
   */

  Component_CommandInterpreter.prototype.commandResetGlobalData = function() {
    return GameManager.resetGlobalData();
  };


  /**
  * @method commandScript
  * @protected
   */

  Component_CommandInterpreter.prototype.commandScript = function() {
    var ex;
    try {
      if (!this.params.scriptFunc) {
        this.params.scriptFunc = eval("(function(){" + this.params.script + "})");
      }
      return this.params.scriptFunc();
    } catch (error) {
      ex = error;
      return console.log(ex);
    }
  };

  return Component_CommandInterpreter;

})(gs.Component);

window.CommandInterpreter = Component_CommandInterpreter;

gs.Component_CommandInterpreter = Component_CommandInterpreter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLElBQUEsaUVBQUE7RUFBQTs7O0FBQU07O0FBQ0Y7Ozs7Ozs7RUFPYSx5QkFBQTs7QUFDVDs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXOztBQUVYOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7RUF0Qlg7Ozs7OztBQXdCakIsRUFBRSxDQUFDLGVBQUgsR0FBcUI7O0FBRWY7RUFDRixrQkFBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsT0FBRDs7O0FBRXhCOzs7Ozs7Ozs7Ozs7RUFXYSw0QkFBQyxFQUFELEVBQUssS0FBTDs7QUFDVDs7Ozs7SUFLQSxJQUFDLENBQUEsRUFBRCxHQUFNOztBQUVOOzs7OztJQUtBLElBQUMsQ0FBQSxLQUFELEdBQVM7RUFiQTs7O0FBZWI7Ozs7Ozs7K0JBTUEsR0FBQSxHQUFLLFNBQUMsRUFBRCxFQUFLLEtBQUw7SUFDRCxJQUFDLENBQUEsRUFBRCxHQUFNO1dBQ04sSUFBQyxDQUFBLEtBQUQsR0FBUztFQUZSOzs7Ozs7QUFJVCxFQUFFLENBQUMsa0JBQUgsR0FBd0I7O0FBRWxCOzs7RUFDRiw0QkFBQyxDQUFBLG9CQUFELEdBQXdCLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IscUJBQXRCLEVBQTZDLHVCQUE3QyxFQUFzRSxvQkFBdEU7OztBQUV4Qjs7Ozs7Ozs7O3lDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTs7O0FBR3JCOzs7Ozs7Ozs7Ozs7O0VBWWEsc0NBQUE7SUFDVCw0REFBQTs7QUFFQTs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7OztJQU1BLElBQUMsQ0FBQSxVQUFELEdBQWM7O0FBRWQ7Ozs7OztJQU1BLElBQUMs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QUFoQixDQUEwQixvQkFBQSxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUEvRDthQUNULFFBQVEsQ0FBQyxlQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBekMsRUFBNkMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFyRCxFQUZKO0tBQUEsTUFBQTthQUlJLFFBQVEsQ0FBQyxlQUFULENBQXlCLElBQXpCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBSko7O0VBRHVCOzs7QUFPM0I7Ozs7O3lDQUlBLHNCQUFBLEdBQXdCLFNBQUE7V0FDcEIsV0FBVyxDQUFDLGVBQVosQ0FBQTtFQURvQjs7O0FBR3hCOzs7Ozt5Q0FJQSxhQUFBLEdBQWUsU0FBQTtBQUNYLFFBQUE7QUFBQTtNQUNJLElBQUcsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVo7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsR0FBcUIsSUFBQSxDQUFLLGNBQUEsR0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUF6QixHQUFrQyxJQUF2QyxFQUR6Qjs7YUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxFQUpKO0tBQUEsYUFBQTtNQUtNO2FBQ0YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxFQUFaLEVBTko7O0VBRFc7Ozs7R0E5bkx3QixFQUFFLENBQUM7O0FBdW9MOUMsTUFBTSxDQUFDLGtCQUFQLEdBQTRCOztBQUM1QixFQUFFLENBQUMsNEJBQUgsR0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgTGl2ZVByZXZpZXdJbmZvXG4gICAgIyMjKlxuICAgICogU3RvcmVzIGludGVybmFsIHByZXZpZXctaW5mbyBpZiB0aGUgZ2FtZSBydW5zIGN1cnJlbnRseSBpbiBMaXZlLVByZXZpZXcuXG4gICAgKiAgICAgICAgXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgTGl2ZVByZXZpZXdJbmZvXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRpbWVyIElEIGlmIGEgdGltZW91dCBmb3IgbGl2ZS1wcmV2aWV3IHdhcyBjb25maWd1cmVkIHRvIGV4aXQgdGhlIGdhbWUgbG9vcCBhZnRlciBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuXG4gICAgICAgICogQHByb3BlcnR5IHRpbWVvdXRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEB0aW1lb3V0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKiBcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgTGl2ZS1QcmV2aWV3IGlzIGN1cnJlbnRseSB3YWl0aW5nIGZvciB0aGUgbmV4dCB1c2VyLWFjdGlvbi4gKFNlbGVjdGluZyBhbm90aGVyIGNvbW1hbmQsIGV0Yy4pXG4gICAgICAgICogQHByb3BlcnR5IHdhaXRpbmcgIFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjXG4gICAgICAgIEB3YWl0aW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDb3VudHMgdGhlIGFtb3VudCBvZiBleGVjdXRlZCBjb21tYW5kcyBzaW5jZSB0aGUgbGFzdCBcbiAgICAgICAgKiBpbnRlcnByZXRlci1wYXVzZSh3YWl0aW5nLCBldGMuKS4gSWYgaXRzIG1vcmUgdGhhbiA1MDAsIHRoZSBpbnRlcnByZXRlciB3aWxsIGF1dG9tYXRpY2FsbHkgcGF1c2UgZm9yIDEgZnJhbWUgdG8gXG4gICAgICAgICogYXZvaWQgdGhhdCBMaXZlLVByZXZpZXcgZnJlZXplcyB0aGUgRWRpdG9yIGluIGNhc2Ugb2YgZW5kbGVzcyBsb29wcy5cbiAgICAgICAgKiBAcHJvcGVydHkgZXhlY3V0ZWRDb21tYW5kc1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGV4ZWN1dGVkQ29tbWFuZHMgPSAwXG4gICAgICAgIFxuZ3MuTGl2ZVByZXZpZXdJbmZvID0gTGl2ZVByZXZpZXdJbmZvXG4gICAgICAgIFxuY2xhc3MgSW50ZXJwcmV0ZXJDb250ZXh0XG4gICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wib3duZXJcIl1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBEZXNjcmliZXMgYW4gaW50ZXJwcmV0ZXItY29udGV4dCB3aGljaCBob2xkcyBpbmZvcm1hdGlvbiBhYm91dFxuICAgICogdGhlIGludGVycHJldGVyJ3Mgb3duZXIgYW5kIGFsc28gdW5pcXVlIElEIHVzZWQgZm9yIGFjY2Vzc2luZyBjb3JyZWN0XG4gICAgKiBsb2NhbCB2YXJpYWJsZXMuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIEludGVycHJldGVyQ29udGV4dFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IGlkIC0gQSB1bmlxdWUgSURcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lciAtIFRoZSBvd25lciBvZiB0aGUgaW50ZXJwcmV0ZXJcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGlkLCBvd25lcikgLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEEgdW5pcXVlIG51bWVyaWMgb3IgdGV4dHVhbCBJRCB1c2VkIGZvciBhY2Nlc3NpbmcgY29ycmVjdCBsb2NhbCB2YXJpYWJsZXMuXG4gICAgICAgICogQHByb3BlcnR5IGlkXG4gICAgICAgICogQHR5cGUgbnVtYmVyfHN0cmluZ1xuICAgICAgICAjIyNcbiAgICAgICAgQGlkID0gaWRcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb3duZXIgb2YgdGhlIGludGVycHJldGVyIChlLmcuIGN1cnJlbnQgc2NlbmUsIGV0Yy4pLlxuICAgICAgICAqIEBwcm9wZXJ0eSBvd25lclxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQG93bmVyID0gb3duZXJcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSBjb250ZXh0J3MgZGF0YS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gaWQgLSBBIHVuaXF1ZSBJRFxuICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyIC0gVGhlIG93bmVyIG9mIHRoZSBpbnRlcnByZXRlclxuICAgICogQG1ldGhvZCBzZXRcbiAgICAjIyMgICAgXG4gICAgc2V0OiAoaWQsIG93bmVyKSAtPlxuICAgICAgICBAaWQgPSBpZFxuICAgICAgICBAb3duZXIgPSBvd25lclxuICAgICAgICBcbmdzLkludGVycHJldGVyQ29udGV4dCA9IEludGVycHJldGVyQ29udGV4dFxuXG5jbGFzcyBDb21wb25lbnRfQ29tbWFuZEludGVycHJldGVyIGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wib2JqZWN0XCIsIFwiY29tbWFuZFwiLCBcIm9uTWVzc2FnZUFEVldhaXRpbmdcIiwgXCJvbk1lc3NhZ2VBRFZEaXNhcHBlYXJcIiwgXCJvbk1lc3NhZ2VBRFZGaW5pc2hcIl1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQSBjb21wb25lbnQgd2hpY2ggYWxsb3dzIGEgZ2FtZSBvYmplY3QgdG8gcHJvY2VzcyBjb21tYW5kcyBsaWtlIGZvclxuICAgICogc2NlbmUtb2JqZWN0cy4gRm9yIGVhY2ggY29tbWFuZCBhIGNvbW1hbmQtZnVuY3Rpb24gZXhpc3RzLiBUbyBhZGRcbiAgICAqIG93biBjdXN0b20gY29tbWFuZHMgdG8gdGhlIGludGVycHJldGVyIGp1c3QgY3JlYXRlIGEgc3ViLWNsYXNzIGFuZFxuICAgICogb3ZlcnJpZGUgdGhlIGdzLkNvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXIuYXNzaWduQ29tbWFuZCBtZXRob2RcbiAgICAqIGFuZCBhc3NpZ24gdGhlIGNvbW1hbmQtZnVuY3Rpb24gZm9yIHlvdXIgY3VzdG9tLWNvbW1hbmQuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXJcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBXYWl0LUNvdW50ZXIgaW4gZnJhbWVzLiBJZiBncmVhdGVyIHRoYW4gMCwgdGhlIGludGVycHJldGVyIHdpbGwgZm9yIHRoYXQgYW1vdW50IG9mIGZyYW1lcyBiZWZvcmUgY29udGludWUuXG4gICAgICAgICogQHByb3BlcnR5IHdhaXRDb3VudGVyXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAd2FpdENvdW50ZXIgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kZXggdG8gdGhlIG5leHQgY29tbWFuZCB0byBleGVjdXRlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwb2ludGVyXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAcG9pbnRlciA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgc3RhdGVzIG9mIGNvbmRpdGlvbnMuXG4gICAgICAgICogQHByb3BlcnR5IGNvbmRpdGlvbnNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY29uZGl0aW9ucyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIHN0YXRlcyBvZiBsb29wcy5cbiAgICAgICAgKiBAcHJvcGVydHkgbG9vcHNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAbG9vcHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyBGSVhNRTogU2hvdWxkIG5vdCBiZSBzdG9yZWQgaW4gdGhlIGludGVycHJldGVyLlxuICAgICAgICBAdGltZXJzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGludGVycHJldGVyIGlzIGN1cnJlbnRseSBydW5uaW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1J1bm5pbmdcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAaXNSdW5uaW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGludGVycHJldGVyIGlzIGN1cnJlbnRseSB3YWl0aW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1dhaXRpbmdcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGludGVycHJldGVyIGlzIGN1cnJlbnRseSB3YWl0aW5nIHVudGlsIGEgbWVzc2FnZSBwcm9jZXNzZWQgYnkgYW5vdGhlciBjb250ZXh0IGxpa2UgYSBDb21tb24gRXZlbnRcbiAgICAgICAgKiBpcyBmaW5pc2hlZC5cbiAgICAgICAgKiBGSVhNRTogQ29uZmxpY3QgaGFuZGxpbmcgY2FuIGJlIHJlbW92ZWQgbWF5YmUuIFxuICAgICAgICAqIEBwcm9wZXJ0eSBpc1dhaXRpbmdGb3JNZXNzYWdlXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQGlzV2FpdGluZ0Zvck1lc3NhZ2UgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBpbnRlcm5hbCBwcmV2aWV3LWluZm8gaWYgdGhlIGdhbWUgcnVucyBjdXJyZW50bHkgaW4gTGl2ZS1QcmV2aWV3LlxuICAgICAgICAqIDx1bD5cbiAgICAgICAgKiA8bGk+cHJldmlld0luZm8udGltZW91dCAtIFRpbWVyIElEIGlmIGEgdGltZW91dCBmb3IgbGl2ZS1wcmV2aWV3IHdhcyBjb25maWd1cmVkIHRvIGV4aXQgdGhlIGdhbWUgbG9vcCBhZnRlciBhIGNlcnRhaW4gYW1vdW50IG9mIHRpbWUuPC9saT5cbiAgICAgICAgKiA8bGk+cHJldmlld0luZm8ud2FpdGluZyAtIEluZGljYXRlcyBpZiBMaXZlLVByZXZpZXcgaXMgY3VycmVudGx5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHVzZXItYWN0aW9uLiAoU2VsZWN0aW5nIGFub3RoZXIgY29tbWFuZCwgZXRjLik8L2xpPlxuICAgICAgICAqIDxsaT5wcmV2aWV3SW5mby5leGVjdXRlZENvbW1hbmRzIC0gQ291bnRzIHRoZSBhbW91bnQgb2YgZXhlY3V0ZWQgY29tbWFuZHMgc2luY2UgdGhlIGxhc3QgXG4gICAgICAgICogaW50ZXJwcmV0ZXItcGF1c2Uod2FpdGluZywgZXRjLikuIElmIGl0cyBtb3JlIHRoYW4gNTAwLCB0aGUgaW50ZXJwcmV0ZXIgd2lsbCBhdXRvbWF0aWNhbGx5IHBhdXNlIGZvciAxIGZyYW1lIHRvIFxuICAgICAgICAqIGF2b2lkIHRoYXQgTGl2ZS1QcmV2aWV3IGZyZWV6ZXMgdGhlIEVkaXRvciBpbiBjYXNlIG9mIGVuZGxlc3MgbG9vcHMuPC9saT5cbiAgICAgICAgKiA8L3VsPlxuICAgICAgICAqIEBwcm9wZXJ0eSBwcmV2aWV3SW5mb1xuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAcHJldmlld0luZm8gPSBuZXcgZ3MuTGl2ZVByZXZpZXdJbmZvKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgTGl2ZS1QcmV2aWV3IHJlbGF0ZWQgaW5mbyBwYXNzZWQgZnJvbSB0aGUgVk4gTWFrZXIgZWRpdG9yIGxpa2UgdGhlIGNvbW1hbmQtaW5kZXggdGhlIHBsYXllciBjbGlja2VkIG9uLCBldGMuXG4gICAgICAgICogQHByb3BlcnR5IHByZXZpZXdEYXRhXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHByZXZpZXdEYXRhID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgaW50ZXJwcmV0ZXIgYXV0b21hdGljYWxseSByZXBlYXRzIGV4ZWN1dGlvbiBhZnRlciB0aGUgbGFzdCBjb21tYW5kIHdhcyBleGVjdXRlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgcmVwZWF0XG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQHJlcGVhdCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGV4ZWN1dGlvbiBjb250ZXh0IG9mIHRoZSBpbnRlcnByZXRlci5cbiAgICAgICAgKiBAcHJvcGVydHkgY29udGV4dFxuICAgICAgICAqIEB0eXBlIGdzLkludGVycHJldGVyQ29udGV4dFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb250ZXh0ID0gbmV3IGdzLkludGVycHJldGVyQ29udGV4dCgwLCBudWxsKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN1Yi1JbnRlcnByZXRlciBmcm9tIGEgQ29tbW9uIEV2ZW50IENhbGwuIFRoZSBpbnRlcnByZXRlciB3aWxsIHdhaXQgdW50aWwgdGhlIHN1Yi1pbnRlcnByZXRlciBpcyBkb25lIGFuZCBzZXQgYmFjayB0b1xuICAgICAgICAqIDxiPm51bGw8L2I+LlxuICAgICAgICAqIEBwcm9wZXJ0eSBzdWJJbnRlcnByZXRlclxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAc3ViSW50ZXJwcmV0ZXIgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ3VycmVudCBpbmRlbnQtbGV2ZWwgb2YgZXhlY3V0aW9uXG4gICAgICAgICogQHByb3BlcnR5IGluZGVudFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbmRlbnQgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIGluZm9ybWF0aW9uIGFib3V0IGZvciB3aGF0IHRoZSBpbnRlcnByZXRlciBpcyBjdXJyZW50bHkgd2FpdGluZyBmb3IgbGlrZSBmb3IgYSBBRFYgbWVzc2FnZSwgZXRjLiB0b1xuICAgICAgICAqIHJlc3RvcmUgcHJvYmFibHkgd2hlbiBsb2FkZWQgZnJvbSBhIHNhdmUtZ2FtZS5cbiAgICAgICAgKiBAcHJvcGVydHkgd2FpdGluZ0ZvclxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB3YWl0aW5nRm9yID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgaW50ZXJwcmV0ZXIgcmVsYXRlZCBzZXR0aW5ncyBsaWtlIGhvdyB0byBoYW5kbGUgbWVzc2FnZXMsIGV0Yy5cbiAgICAgICAgKiBAcHJvcGVydHkgc2V0dGluZ3NcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAc2V0dGluZ3MgPSB7IG1lc3NhZ2U6IHsgYnlJZDoge30sIGF1dG9FcmFzZTogeWVzLCB3YWl0QXRFbmQ6IHllcywgYmFja2xvZzogeWVzIH0sIHNjcmVlbjogeyBwYW46IG5ldyBncy5Qb2ludCgwLCAwKSB9IH1cbiAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIE1hcHBpbmcgdGFibGUgdG8gcXVpY2tseSBnZXQgdGhlIGFuY2hvciBwb2ludCBmb3IgdGhlIGFuIGluc2VydGVkIGFuY2hvci1wb2ludCBjb25zdGFudCBzdWNoIGFzXG4gICAgICAgICogVG9wLUxlZnQoMCksIFRvcCgxKSwgVG9wLVJpZ2h0KDIpIGFuZCBzbyBvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgZ3JhcGhpY0FuY2hvclBvaW50c0J5Q29uc3RhbnRcbiAgICAgICAgKiBAdHlwZSBncy5Qb2ludFtdXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGdyYXBoaWNBbmNob3JQb2ludHNCeUNvbnN0YW50ID0gW1xuICAgICAgICAgICAgbmV3IGdzLlBvaW50KDAuMCwgMC4wKSxcbiAgICAgICAgICAgIG5ldyBncy5Qb2ludCgwLjUsIDAuMCksXG4gICAgICAgICAgICBuZXcgZ3MuUG9pbnQoMS4wLCAwLjApLFxuICAgICAgICAgICAgbmV3IGdzLlBvaW50KDEuMCwgMC41KSxcbiAgICAgICAgICAgIG5ldyBncy5Qb2ludCgxLjAsIDEuMCksXG4gICAgICAgICAgICBuZXcgZ3MuUG9pbnQoMC41LCAxLjApLFxuICAgICAgICAgICAgbmV3IGdzLlBvaW50KDAuMCwgMS4wKSxcbiAgICAgICAgICAgIG5ldyBncy5Qb2ludCgwLjAsIDAuNSksXG4gICAgICAgICAgICBuZXcgZ3MuUG9pbnQoMC41LCAwLjUpXG4gICAgICAgIF1cbiAgICAgICAgXG4gICAgb25Ib3RzcG90Q2xpY2s6IChlLCBkYXRhKSAtPiBcbiAgICAgICAgQGV4ZWN1dGVBY3Rpb24oZGF0YS5wYXJhbXMuYWN0aW9ucy5vbkNsaWNrLCBubywgZGF0YS5iaW5kVmFsdWUpXG4gICAgICAgIFxuICAgIG9uSG90c3BvdEVudGVyOiAoZSwgZGF0YSkgLT4gXG4gICAgICAgIEBleGVjdXRlQWN0aW9uKGRhdGEucGFyYW1zLmFjdGlvbnMub25FbnRlciwgeWVzLCBkYXRhLmJpbmRWYWx1ZSlcbiAgICAgICAgXG4gICAgb25Ib3RzcG90TGVhdmU6IChlLCBkYXRhKSAtPiBcbiAgICAgICAgQGV4ZWN1dGVBY3Rpb24oZGF0YS5wYXJhbXMuYWN0aW9ucy5vbkxlYXZlLCBubywgZGF0YS5iaW5kVmFsdWUpXG4gICAgb25Ib3RzcG90RHJhZ1N0YXJ0OiAoZSwgZGF0YSkgLT4gXG4gICAgICAgIEBleGVjdXRlQWN0aW9uKGRhdGEucGFyYW1zLmFjdGlvbnMub25EcmFnLCB5ZXMsIGRhdGEuYmluZFZhbHVlKVxuICAgIG9uSG90c3BvdERyYWc6IChlLCBkYXRhKSAtPiBcbiAgICAgICAgQGV4ZWN1dGVBY3Rpb24oZGF0YS5wYXJhbXMuYWN0aW9ucy5vbkRyYWcsIHllcywgZGF0YS5iaW5kVmFsdWUpXG4gICAgb25Ib3RzcG90RHJhZ0VuZDogKGUsIGRhdGEpIC0+IFxuICAgICAgICBAZXhlY3V0ZUFjdGlvbihkYXRhLnBhcmFtcy5hY3Rpb25zLm9uRHJhZywgbm8sIGRhdGEuYmluZFZhbHVlKVxuICAgIG9uSG90c3BvdFN0YXRlQ2hhbmdlZDogKGUsIHBhcmFtcykgLT4gXG4gICAgICAgIGlmIGUuc2VuZGVyLmJlaGF2aW9yLnNlbGVjdGVkXG4gICAgICAgICAgICBAZXhlY3V0ZUFjdGlvbihwYXJhbXMuYWN0aW9ucy5vblNlbGVjdCwgeWVzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZXhlY3V0ZUFjdGlvbihwYXJhbXMuYWN0aW9ucy5vbkRlc2VsZWN0LCBubylcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCB3aGVuIGEgQURWIG1lc3NhZ2UgZmluaXNoZWQgcmVuZGVyaW5nIGFuZCBpcyBub3cgd2FpdGluZ1xuICAgICogZm9yIHRoZSB1c2VyL2F1dG9tLW1lc3NhZ2UgdGltZXIgdG8gcHJvY2VlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uTWVzc2FnZUFEVldhaXRpbmdcbiAgICAqIEByZXR1cm4ge09iamVjdH0gRXZlbnQgT2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICBcbiAgICBvbk1lc3NhZ2VBRFZXYWl0aW5nOiAoZSkgLT5cbiAgICAgICAgbWVzc2FnZU9iamVjdCA9IGUuc2VuZGVyLm9iamVjdFxuICAgICAgICBpZiAhQG1lc3NhZ2VTZXR0aW5ncygpLndhaXRBdEVuZFxuICAgICAgICAgICAgaWYgZS5kYXRhLnBhcmFtcy53YWl0Rm9yQ29tcGxldGlvblxuICAgICAgICAgICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC50ZXh0UmVuZGVyZXIuaXNXYWl0aW5nID0gbm9cbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QudGV4dFJlbmRlcmVyLmlzUnVubmluZyA9IG5vXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuZXZlbnRzLm9mZiBcIndhaXRpbmdcIiwgZS5oYW5kbGVyXG4gICAgICAgIFxuICAgICAgICBpZiBAbWVzc2FnZVNldHRpbmdzKCkuYmFja2xvZyBhbmQgKG1lc3NhZ2VPYmplY3Quc2V0dGluZ3MuYXV0b0VyYXNlIG9yIG1lc3NhZ2VPYmplY3Quc2V0dGluZ3MucGFyYWdyYXBoU3BhY2luZyA+IDApXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5iYWNrbG9nLnB1c2goeyBjaGFyYWN0ZXI6IG1lc3NhZ2VPYmplY3QuY2hhcmFjdGVyLCBtZXNzYWdlOiBtZXNzYWdlT2JqZWN0LmJlaGF2aW9yLm1lc3NhZ2UsIGNob2ljZXM6IFtdIH0pIFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgd2hlbiBhbiBBRFYgbWVzc2FnZSBmaW5pc2hlZCBmYWRlLW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uTWVzc2FnZUFEVkRpc2FwcGVhclxuICAgICogQHJldHVybiB7T2JqZWN0fSBFdmVudCBPYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGRhdGEuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIG9uTWVzc2FnZUFEVkRpc2FwcGVhcjogKG1lc3NhZ2VPYmplY3QsIHdhaXRGb3JDb21wbGV0aW9uKSAtPlxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuY3VycmVudENoYXJhY3RlciA9IHsgbmFtZTogXCJcIiB9XG4gICAgICAgIG1lc3NhZ2VPYmplY3QuYmVoYXZpb3IuY2xlYXIoKVxuICAgICAgICBtZXNzYWdlT2JqZWN0LnZpc2libGUgPSBub1xuICAgICAgICBcbiAgICAgICAgaWYgd2FpdEZvckNvbXBsZXRpb24gICAgXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgQHdhaXRpbmdGb3IubWVzc2FnZUFEViA9IG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgd2hlbiBhbiBBRFYgbWVzc2FnZSBmaW5pc2hlZCBjbGVhci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uTWVzc2FnZUFEVkNsZWFyXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IEV2ZW50IE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YS5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgIFxuICAgIG9uTWVzc2FnZUFEVkNsZWFyOiAobWVzc2FnZU9iamVjdCwgd2FpdEZvckNvbXBsZXRpb24pIC0+XG4gICAgICAgIG1lc3NhZ2VPYmplY3QgPSBAdGFyZ2V0TWVzc2FnZSgpXG4gICAgICAgIGlmIEBtZXNzYWdlU2V0dGluZ3MoKS5iYWNrbG9nICAgXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5iYWNrbG9nLnB1c2goeyBjaGFyYWN0ZXI6IG1lc3NhZ2VPYmplY3QuY2hhcmFjdGVyLCBtZXNzYWdlOiBtZXNzYWdlT2JqZWN0LmJlaGF2aW9yLm1lc3NhZ2UsIGNob2ljZXM6IFtdIH0pIFxuICAgICAgICBAb25NZXNzYWdlQURWRGlzYXBwZWFyKG1lc3NhZ2VPYmplY3QsIHdhaXRGb3JDb21wbGV0aW9uKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIHdoZW4gYSBob3RzcG90L2ltYWdlLW1hcCBzZW5kcyBhIFwianVtcFRvXCIgZXZlbnQgdG8gbGV0IHRoZVxuICAgICogaW50ZXJwcmV0ZXIganVtcCB0byB0aGUgcG9zaXRpb24gZGVmaW5lZCBpbiB0aGUgZXZlbnQgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25KdW1wVG9cbiAgICAqIEByZXR1cm4ge09iamVjdH0gRXZlbnQgT2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgb25KdW1wVG86IChlKSAtPlxuICAgICAgICBAanVtcFRvTGFiZWwoZS5sYWJlbClcbiAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCB3aGVuIGEgaG90c3BvdC9pbWFnZS1tYXAgc2VuZHMgYSBcImNhbGxDb21tb25FdmVudFwiIGV2ZW50IHRvIGxldCB0aGVcbiAgICAqIGludGVycHJldGVyIGNhbGwgdGhlIGNvbW1vbiBldmVudCBkZWZpbmVkIGluIHRoZSBldmVudCBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBvbkp1bXBUb1xuICAgICogQHJldHVybiB7T2JqZWN0fSBFdmVudCBPYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGRhdGEuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBvbkNhbGxDb21tb25FdmVudDogKGUpIC0+XG4gICAgICAgIEBjYWxsQ29tbW9uRXZlbnQoZS5jb21tb25FdmVudElkLCBlLnBhcmFtcyB8fCBbXSwgIWUuZmluaXNoKVxuICAgICAgICBAaXNXYWl0aW5nID0gZS53YWl0aW5nID8gbm9cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIHdoZW4gYSBBRFYgbWVzc2FnZSBmaW5pc2hlcy4gXG4gICAgKlxuICAgICogQG1ldGhvZCBvbk1lc3NhZ2VOVkxGaW5pc2hcbiAgICAqIEByZXR1cm4ge09iamVjdH0gRXZlbnQgT2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgb25NZXNzYWdlQURWRmluaXNoOiAoZSkgLT5cbiAgICAgICAgbWVzc2FnZU9iamVjdCA9IGUuc2VuZGVyLm9iamVjdCBcbiAgXG4gICAgICAgIGlmIG5vdCBAbWVzc2FnZVNldHRpbmdzKCkud2FpdEF0RW5kIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBHYW1lTWFuYWdlci5nbG9iYWxEYXRhLm1lc3NhZ2VzW2xjc20oZS5kYXRhLnBhcmFtcy5tZXNzYWdlKV0gPSB7IHJlYWQ6IHllcyB9XG4gICAgICAgIEdhbWVNYW5hZ2VyLnNhdmVHbG9iYWxEYXRhKClcbiAgICAgICAgaWYgZS5kYXRhLnBhcmFtcy53YWl0Rm9yQ29tcGxldGlvblxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgIEB3YWl0aW5nRm9yLm1lc3NhZ2VBRFYgPSBudWxsXG4gICAgICAgIHBvaW50ZXIgPSBAcG9pbnRlclxuICAgICAgICBjb21tYW5kcyA9IEBvYmplY3QuY29tbWFuZHNcbiAgICAgICAgXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuZXZlbnRzLm9mZiBcImZpbmlzaFwiLCBlLmhhbmRsZXJcbiAgICAgICAgI21lc3NhZ2VPYmplY3QuY2hhcmFjdGVyID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgbWVzc2FnZU9iamVjdC52b2ljZT8gYW5kIEdhbWVNYW5hZ2VyLnNldHRpbmdzLnNraXBWb2ljZU9uQWN0aW9uXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuc3RvcFNvdW5kKG1lc3NhZ2VPYmplY3Qudm9pY2UubmFtZSlcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAaXNNZXNzYWdlQ29tbWFuZChwb2ludGVyLCBjb21tYW5kcykgYW5kIEBtZXNzYWdlU2V0dGluZ3MoKS5hdXRvRXJhc2VcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEB3YWl0aW5nRm9yLm1lc3NhZ2VBRFYgPSBlLmRhdGEucGFyYW1zXG4gICAgICAgIFxuICAgICAgICAgICAgZmFkaW5nID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLm1lc3NhZ2VGYWRpbmdcbiAgICAgICAgICAgIGR1cmF0aW9uID0gaWYgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXAgdGhlbiAwIGVsc2UgZmFkaW5nLmR1cmF0aW9uXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3Qud2FpdEZvckNvbXBsZXRpb24gPSBlLmRhdGEucGFyYW1zLndhaXRGb3JDb21wbGV0aW9uXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmFuaW1hdG9yLmRpc2FwcGVhcihmYWRpbmcuYW5pbWF0aW9uLCBmYWRpbmcuZWFzaW5nLCBkdXJhdGlvbiwgZ3MuQ2FsbEJhY2soXCJvbk1lc3NhZ2VBRFZEaXNhcHBlYXJcIiwgdGhpcywgZS5kYXRhLnBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbikpXG5cbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgd2hlbiBhIGNvbW1vbiBldmVudCBmaW5pc2hlZCBleGVjdXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBvbkNvbW1vbkV2ZW50RmluaXNoXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IEV2ZW50IE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YS5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBvbkNvbW1vbkV2ZW50RmluaXNoOiAoZSkgLT4gICAgXG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5jb21tb25FdmVudENvbnRhaW5lci5yZW1vdmVPYmplY3QoZS5zZW5kZXIub2JqZWN0KVxuICAgICAgICBlLnNlbmRlci5vYmplY3QuZXZlbnRzLm9mZiBcImZpbmlzaFwiXG4gICAgICAgIEBzdWJJbnRlcnByZXRlciA9IG51bGxcbiAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIHdoZW4gYSBzY2VuZSBjYWxsIGZpbmlzaGVkIGV4ZWN1dGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uQ2FsbFNjZW5lRmluaXNoXG4gICAgKiBAcGFyYW0ge09iamVjdH0gc2VuZGVyIC0gVGhlIHNlbmRlciBvZiB0aGlzIGV2ZW50LlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBvbkNhbGxTY2VuZUZpbmlzaDogKHNlbmRlcikgLT5cbiAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgIEBzdWJJbnRlcnByZXRlciA9IG51bGxcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2VyaWFsaXplcyB0aGUgaW50ZXJwcmV0ZXIgaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkYXRhLWJ1bmRsZS5cbiAgICAjIyMgICBcbiAgICB0b0RhdGFCdW5kbGU6IC0+XG4gICAgICAgIGlmIEBpc0lucHV0RGF0YUNvbW1hbmQoTWF0aC5tYXgoQHBvaW50ZXIgLSAxLCAwKSwgQG9iamVjdC5jb21tYW5kcykgXG4gICAgICAgICAgICBwb2ludGVyOiBNYXRoLm1heChAcG9pbnRlciAtIDEgLCAwKSxcbiAgICAgICAgICAgIGNob2ljZTogQGNob2ljZSwgXG4gICAgICAgICAgICBjb25kaXRpb25zOiBAY29uZGl0aW9ucywgXG4gICAgICAgICAgICBsb29wczogQGxvb3BzLFxuICAgICAgICAgICAgbGFiZWxzOiBAbGFiZWxzLFxuICAgICAgICAgICAgaXNXYWl0aW5nOiBubyxcbiAgICAgICAgICAgIGlzUnVubmluZzogQGlzUnVubmluZyxcbiAgICAgICAgICAgIHdhaXRDb3VudGVyOiBAd2FpdENvdW50ZXIsXG4gICAgICAgICAgICB3YWl0aW5nRm9yOiBAd2FpdGluZ0ZvcixcbiAgICAgICAgICAgIGluZGVudDogQGluZGVudCxcbiAgICAgICAgICAgIHNldHRpbmdzOiBAc2V0dGluZ3NcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcG9pbnRlcjogQHBvaW50ZXIsXG4gICAgICAgICAgICBjaG9pY2U6IEBjaG9pY2UsIFxuICAgICAgICAgICAgY29uZGl0aW9uczogQGNvbmRpdGlvbnMsIFxuICAgICAgICAgICAgbG9vcHM6IEBsb29wcyxcbiAgICAgICAgICAgIGxhYmVsczogQGxhYmVscyxcbiAgICAgICAgICAgIGlzV2FpdGluZzogQGlzV2FpdGluZyxcbiAgICAgICAgICAgIGlzUnVubmluZzogQGlzUnVubmluZyxcbiAgICAgICAgICAgIHdhaXRDb3VudGVyOiBAd2FpdENvdW50ZXIsXG4gICAgICAgICAgICB3YWl0aW5nRm9yOiBAd2FpdGluZ0ZvcixcbiAgICAgICAgICAgIGluZGVudDogQGluZGVudCxcbiAgICAgICAgICAgIHNldHRpbmdzOiBAc2V0dGluZ3NcbiAgICBcbiAgICAjIyMqXG4gICAgIyBQcmV2aWV3cyB0aGUgY3VycmVudCBzY2VuZSBhdCB0aGUgc3BlY2lmaWVkIHBvaW50ZXIuIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmcm9tIHRoZVxuICAgICMgVk4gTWFrZXIgU2NlbmUtRWRpdG9yIGlmIGxpdmUtcHJldmlldyBpcyBlbmFibGVkIGFuZCB0aGUgdXNlciBjbGlja2VkIG9uIGEgY29tbWFuZC5cbiAgICAjXG4gICAgIyBAbWV0aG9kIHByZXZpZXdcbiAgICAjIyNcbiAgICBwcmV2aWV3OiAtPlxuICAgICAgICB0cnlcbiAgICAgICAgICAgIHJldHVybiBpZiAhJFBBUkFNUy5wcmV2aWV3IG9yICEkUEFSQU1TLnByZXZpZXcuc2NlbmVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlcyA9IFtdXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zZXR1cEN1cnNvcigpXG4gICAgICAgICAgICBAcHJldmlld0RhdGEgPSAkUEFSQU1TLnByZXZpZXdcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5lbWl0KFwicHJldmlld1Jlc3RhcnRcIilcbiAgICAgICAgICAgIGlmIEBwcmV2aWV3SW5mby50aW1lb3V0XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KEBwcmV2aWV3SW5mby50aW1lb3V0KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgR3JhcGhpY3Muc3RvcHBlZFxuICAgICAgICAgICAgICAgIEdyYXBoaWNzLnN0b3BwZWQgPSBub1xuICAgICAgICAgICAgICAgIEdyYXBoaWNzLm9uRWFjaEZyYW1lKGdzLk1haW4uZnJhbWVDYWxsYmFjaylcbiAgICAgICAgICAgXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyB2bi5PYmplY3RfU2NlbmUoKSBcbiAgICAgICAgXG4gICAgICAgICAgICBzY2VuZS5zY2VuZURhdGEudWlkID0gQHByZXZpZXdEYXRhLnNjZW5lLnVpZCAgICBcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhzY2VuZSlcbiAgICAgICAgY2F0Y2ggZXhcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihleClcbiAgICBcbiAgICAjIyMqXG4gICAgIyBTZXRzIHVwIHRoZSBpbnRlcnByZXRlci5cbiAgICAjXG4gICAgIyBAbWV0aG9kIHNldHVwXG4gICAgIyMjICAgIFxuICAgIHNldHVwOiAtPlxuICAgICAgICBAcHJldmlld0RhdGEgPSAkUEFSQU1TLnByZXZpZXdcbiAgICAgICAgaWYgQHByZXZpZXdEYXRhXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZURvd25cIiwgKD0+XG4gICAgICAgICAgICAgICAgaWYgQHByZXZpZXdJbmZvLndhaXRpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgQHByZXZpZXdJbmZvLnRpbWVvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChAcHJldmlld0luZm8udGltZW91dClcbiAgICAgICAgICAgICAgICAgICAgQHByZXZpZXdJbmZvLndhaXRpbmcgPSBub1xuICAgICAgICAgICAgICAgICAgICAjQGlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0gbm9cbiAgICAgICAgICAgICAgICAgICAgQHByZXZpZXdEYXRhID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuZW1pdChcInByZXZpZXdSZXN0YXJ0XCIpXG4gICAgICAgICAgICAgICAgKSwgbnVsbCwgQG9iamVjdFxuICAgICBcbiAgICAjIyMqXG4gICAgIyBEaXNwb3NlcyB0aGUgaW50ZXJwcmV0ZXIuXG4gICAgI1xuICAgICMgQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjICAgICAgIFxuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIGlmIEBwcmV2aWV3RGF0YVxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJtb3VzZURvd25cIiwgQG9iamVjdClcbiAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICAgXG4gICAgIFxuICAgIGlzSW5zdGFudFNraXA6IC0+IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWUgPT0gMCAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIHRoZSBpbnRlcnByZXRlciBmcm9tIGEgZGF0YS1idW5kbGVcbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBidW5kbGUtIFRoZSBkYXRhLWJ1bmRsZS5cbiAgICAjIyMgICAgIFxuICAgIHJlc3RvcmU6IC0+XG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSBnYW1lIG1lc3NhZ2UgZm9yIG5vdmVsLW1vZGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBtZXNzYWdlT2JqZWN0TlZMXG4gICAgKiBAcmV0dXJuIHt1aS5PYmplY3RfTWVzc2FnZX0gVGhlIE5WTCBnYW1lIG1lc3NhZ2Ugb2JqZWN0LlxuICAgICMjIyAgICAgICAgICAgXG4gICAgbWVzc2FnZU9iamVjdE5WTDogLT4gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZU5WTF9tZXNzYWdlXCIpXG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgZ2FtZSBtZXNzYWdlIGZvciBhZHZlbnR1cmUtbW9kZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG1lc3NhZ2VPYmplY3RBRFZcbiAgICAqIEByZXR1cm4ge3VpLk9iamVjdF9NZXNzYWdlfSBUaGUgQURWIGdhbWUgbWVzc2FnZSBvYmplY3QuXG4gICAgIyMjICAgICAgICAgICBcbiAgICBtZXNzYWdlT2JqZWN0QURWOiAtPiBcbiAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZV9tZXNzYWdlXCIpXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlclxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAjIyMgICBcbiAgICBzdGFydDogLT5cbiAgICAgICAgQGNvbmRpdGlvbnMgPSBbXVxuICAgICAgICBAbG9vcHMgPSBbXVxuICAgICAgICBAaW5kZW50ID0gMFxuICAgICAgICBAcG9pbnRlciA9IDBcbiAgICAgICAgQGlzUnVubmluZyA9IHllc1xuICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU3RvcHMgdGhlIGludGVycHJldGVyXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wXG4gICAgIyMjICAgXG4gICAgc3RvcDogLT5cbiAgICAgICAgQGlzUnVubmluZyA9IG5vXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc3VtZXMgdGhlIGludGVycHJldGVyXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN1bWVcbiAgICAjIyMgIFxuICAgIHJlc3VtZTogLT5cbiAgICAgICAgQGlzUnVubmluZyA9IHllcyAgICAgICAgXG4gICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGludGVycHJldGVyIGFuZCBleGVjdXRlcyBhbGwgY29tbWFuZHMgdW50aWwgdGhlIG5leHQgd2FpdCBpcyBcbiAgICAqIHRyaWdnZXJlZCBieSBhIGNvbW1hbmQuIFNvIGluIHRoZSBjYXNlIG9mIGFuIGVuZGxlc3MtbG9vcCB0aGUgbWV0aG9kIHdpbGwgXG4gICAgKiBuZXZlciByZXR1cm4uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIGlmIEBzdWJJbnRlcnByZXRlcj9cbiAgICAgICAgICAgIEBzdWJJbnRlcnByZXRlci51cGRhdGUoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldHVwVGVtcFZhcmlhYmxlcyhAY29udGV4dClcbiAgICAgICAgXG4gICAgICAgIGlmIChub3QgQG9iamVjdC5jb21tYW5kcz8gb3IgQHBvaW50ZXIgPj0gQG9iamVjdC5jb21tYW5kcy5sZW5ndGgpIGFuZCBub3QgQGlzV2FpdGluZ1xuICAgICAgICAgICAgaWYgQHJlcGVhdFxuICAgICAgICAgICAgICAgIEBzdGFydCgpXG4gICAgICAgICAgICBlbHNlIGlmIEBpc1J1bm5pbmdcbiAgICAgICAgICAgICAgICBAaXNSdW5uaW5nID0gbm9cbiAgICAgICAgICAgICAgICBpZiBAb25GaW5pc2g/IHRoZW4gQG9uRmluaXNoKHRoaXMpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgbm90IEBpc1J1bm5pbmcgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAb2JqZWN0LmNvbW1hbmRzLm9wdGltaXplZFxuICAgICAgICAgICAgRGF0YU9wdGltaXplci5vcHRpbWl6ZUV2ZW50Q29tbWFuZHMoQG9iamVjdC5jb21tYW5kcylcblxuICAgICAgICBpZiBAd2FpdENvdW50ZXIgPiAwXG4gICAgICAgICAgICBAd2FpdENvdW50ZXItLVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IEB3YWl0Q291bnRlciA+IDBcbiAgICAgICAgICAgIHJldHVybiAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBpc1dhaXRpbmdGb3JNZXNzYWdlXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBpZiBub3QgQGlzUHJvY2Vzc2luZ01lc3NhZ2VJbk90aGVyQ29udGV4dCgpXG4gICAgICAgICAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgQGlzV2FpdGluZ0Zvck1lc3NhZ2UgPSBub1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3XG4gICAgICAgICAgICB3aGlsZSBub3QgKEBpc1dhaXRpbmcgb3IgQHByZXZpZXdJbmZvLndhaXRpbmcpIGFuZCBAcG9pbnRlciA8IEBvYmplY3QuY29tbWFuZHMubGVuZ3RoIGFuZCBAaXNSdW5uaW5nXG4gICAgICAgICAgICAgICAgQGV4ZWN1dGVDb21tYW5kKEBwb2ludGVyKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBAcHJldmlld0luZm8uZXhlY3V0ZWRDb21tYW5kcysrXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgQHByZXZpZXdJbmZvLmV4ZWN1dGVkQ29tbWFuZHMgPiA1MDBcbiAgICAgICAgICAgICAgICAgICAgQHByZXZpZXdJbmZvLmV4ZWN1dGVkQ29tbWFuZHMgPSAwXG4gICAgICAgICAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB3aGlsZSBub3QgKEBpc1dhaXRpbmcgb3IgQHByZXZpZXdJbmZvLndhaXRpbmcpIGFuZCBAcG9pbnRlciA8IEBvYmplY3QuY29tbWFuZHMubGVuZ3RoIGFuZCBAaXNSdW5uaW5nXG4gICAgICAgICAgICAgICAgQGV4ZWN1dGVDb21tYW5kKEBwb2ludGVyKVxuICAgICBcbiAgICAgICAgICBcbiAgICAgICAgaWYgQHBvaW50ZXIgPj0gQG9iamVjdC5jb21tYW5kcy5sZW5ndGggYW5kIG5vdCBAaXNXYWl0aW5nXG4gICAgICAgICAgICBpZiBAcmVwZWF0XG4gICAgICAgICAgICAgICAgQHN0YXJ0KClcbiAgICAgICAgICAgIGVsc2UgaWYgQGlzUnVubmluZ1xuICAgICAgICAgICAgICAgIEBpc1J1bm5pbmcgPSBub1xuICAgICAgICAgICAgICAgIGlmIEBvbkZpbmlzaD8gdGhlbiBAb25GaW5pc2godGhpcylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQXNzaWducyB0aGUgY29ycmVjdCBjb21tYW5kLWZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgY29tbWFuZC1vYmplY3QgaWYgXG4gICAgKiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBhc3NpZ25Db21tYW5kXG4gICAgIyMjICAgICAgXG4gICAgYXNzaWduQ29tbWFuZDogKGNvbW1hbmQpIC0+XG4gICAgICAgIHN3aXRjaCBjb21tYW5kLmlkXG4gICAgICAgICAgICB3aGVuIFwiZ3MuSWRsZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRJZGxlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU3RhcnRUaW1lclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTdGFydFRpbWVyXG4gICAgICAgICAgICB3aGVuIFwiZ3MuUGF1c2VUaW1lclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRQYXVzZVRpbWVyXG4gICAgICAgICAgICB3aGVuIFwiZ3MuUmVzdW1lVGltZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUmVzdW1lVGltZXJcbiAgICAgICAgICAgIHdoZW4gXCJncy5TdG9wVGltZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU3RvcFRpbWVyXG4gICAgICAgICAgICB3aGVuIFwiZ3MuV2FpdENvbW1hbmRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kV2FpdFxuICAgICAgICAgICAgd2hlbiBcImdzLkxvb3BDb21tYW5kXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExvb3BcbiAgICAgICAgICAgIHdoZW4gXCJncy5CcmVha0xvb3BDb21tYW5kXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEJyZWFrTG9vcFxuICAgICAgICAgICAgd2hlbiBcImdzLkNvbW1lbnRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IC0+IDBcbiAgICAgICAgICAgIHdoZW4gXCJncy5FbXB0eUNvbW1hbmRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IC0+IDBcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0QWRkXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RBZGRcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0UG9wXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RQb3BcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0U2hpZnRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTGlzdFNoaWZ0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuTGlzdFJlbW92ZUF0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RSZW1vdmVBdFxuICAgICAgICAgICAgd2hlbiBcImdzLkxpc3RJbnNlcnRBdFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMaXN0SW5zZXJ0QXRcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0VmFsdWVBdFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMaXN0VmFsdWVBdFxuICAgICAgICAgICAgd2hlbiBcImdzLkxpc3RDbGVhclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMaXN0Q2xlYXJcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0U2h1ZmZsZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMaXN0U2h1ZmZsZVxuICAgICAgICAgICAgd2hlbiBcImdzLkxpc3RTb3J0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RTb3J0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuTGlzdEluZGV4T2ZcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTGlzdEluZGV4T2ZcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0U2V0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RTZXRcbiAgICAgICAgICAgIHdoZW4gXCJncy5MaXN0Q29weVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMaXN0Q29weVxuICAgICAgICAgICAgd2hlbiBcImdzLkxpc3RMZW5ndGhcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTGlzdExlbmd0aFxuICAgICAgICAgICAgd2hlbiBcImdzLkxpc3RKb2luXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RKb2luXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTGlzdEZyb21UZXh0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExpc3RGcm9tVGV4dFxuICAgICAgICAgICAgd2hlbiBcImdzLlJlc2V0VmFyaWFibGVzXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFJlc2V0VmFyaWFibGVzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlVmFyaWFibGVEb21haW5cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhbmdlVmFyaWFibGVEb21haW5cbiAgICAgICAgICAgIHdoZW4gXCJncy5DaGFuZ2VOdW1iZXJWYXJpYWJsZXNcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhbmdlTnVtYmVyVmFyaWFibGVzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlRGVjaW1hbFZhcmlhYmxlc1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFuZ2VEZWNpbWFsVmFyaWFibGVzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlQm9vbGVhblZhcmlhYmxlc1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFuZ2VCb29sZWFuVmFyaWFibGVzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlU3RyaW5nVmFyaWFibGVzXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZVN0cmluZ1ZhcmlhYmxlc1xuICAgICAgICAgICAgd2hlbiBcImdzLkNoZWNrU3dpdGNoXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoZWNrU3dpdGNoXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hlY2tOdW1iZXJWYXJpYWJsZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGVja051bWJlclZhcmlhYmxlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hlY2tUZXh0VmFyaWFibGVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hlY2tUZXh0VmFyaWFibGVcbiAgICAgICAgICAgIHdoZW4gXCJncy5Db25kaXRpb25cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ29uZGl0aW9uXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ29uZGl0aW9uRWxzZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDb25kaXRpb25FbHNlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ29uZGl0aW9uRWxzZUlmXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENvbmRpdGlvbkVsc2VJZlxuICAgICAgICAgICAgd2hlbiBcImdzLkxhYmVsXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZExhYmVsXG4gICAgICAgICAgICB3aGVuIFwiZ3MuSnVtcFRvTGFiZWxcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kSnVtcFRvTGFiZWxcbiAgICAgICAgICAgIHdoZW4gXCJncy5TZXRNZXNzYWdlQXJlYVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTZXRNZXNzYWdlQXJlYVxuICAgICAgICAgICAgd2hlbiBcImdzLlNob3dNZXNzYWdlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNob3dNZXNzYWdlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU2hvd1BhcnRpYWxNZXNzYWdlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNob3dQYXJ0aWFsTWVzc2FnZVxuICAgICAgICAgICAgd2hlbiBcImdzLk1lc3NhZ2VGYWRpbmdcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTWVzc2FnZUZhZGluZ1xuICAgICAgICAgICAgd2hlbiBcImdzLk1lc3NhZ2VTZXR0aW5nc1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRNZXNzYWdlU2V0dGluZ3NcbiAgICAgICAgICAgIHdoZW4gXCJncy5DcmVhdGVNZXNzYWdlQXJlYVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDcmVhdGVNZXNzYWdlQXJlYVxuICAgICAgICAgICAgd2hlbiBcImdzLkVyYXNlTWVzc2FnZUFyZWFcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRXJhc2VNZXNzYWdlQXJlYVxuICAgICAgICAgICAgd2hlbiBcImdzLlNldFRhcmdldE1lc3NhZ2VcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2V0VGFyZ2V0TWVzc2FnZVxuICAgICAgICAgICAgd2hlbiBcInZuLk1lc3NhZ2VCb3hEZWZhdWx0c1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRNZXNzYWdlQm94RGVmYXVsdHNcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5NZXNzYWdlQm94VmlzaWJpbGl0eVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRNZXNzYWdlQm94VmlzaWJpbGl0eVxuICAgICAgICAgICAgd2hlbiBcInZuLk1lc3NhZ2VWaXNpYmlsaXR5XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1lc3NhZ2VWaXNpYmlsaXR5XG4gICAgICAgICAgICB3aGVuIFwidm4uQmFja2xvZ1Zpc2liaWxpdHlcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQmFja2xvZ1Zpc2liaWxpdHlcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5TaG93TWVzc2FnZU5WTFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTaG93TWVzc2FnZU5WTFxuICAgICAgICAgICAgd2hlbiBcImdzLkNsZWFyTWVzc2FnZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDbGVhck1lc3NhZ2VcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DbG9zZVBhZ2VOVkxcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2xvc2VQYWdlTlZMXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlV2VhdGhlclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFuZ2VXZWF0aGVyXG4gICAgICAgICAgICB3aGVuIFwiZ3MuRnJlZXplU2NyZWVuXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEZyZWV6ZVNjcmVlblxuICAgICAgICAgICAgd2hlbiBcImdzLlNjcmVlblRyYW5zaXRpb25cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2NyZWVuVHJhbnNpdGlvblxuICAgICAgICAgICAgd2hlbiBcImdzLlNoYWtlU2NyZWVuXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNoYWtlU2NyZWVuXG4gICAgICAgICAgICB3aGVuIFwiZ3MuVGludFNjcmVlblwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRUaW50U2NyZWVuXG4gICAgICAgICAgICB3aGVuIFwiZ3MuRmxhc2hTY3JlZW5cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRmxhc2hTY3JlZW5cbiAgICAgICAgICAgIHdoZW4gXCJncy5ab29tU2NyZWVuXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFpvb21TY3JlZW5cbiAgICAgICAgICAgIHdoZW4gXCJncy5Sb3RhdGVTY3JlZW5cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUm90YXRlU2NyZWVuXG4gICAgICAgICAgICB3aGVuIFwiZ3MuUGFuU2NyZWVuXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFBhblNjcmVlblxuICAgICAgICAgICAgd2hlbiBcImdzLlNjcmVlbkVmZmVjdFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTY3JlZW5FZmZlY3RcbiAgICAgICAgICAgIHdoZW4gXCJncy5TaG93VmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2hvd1ZpZGVvXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTW92ZVZpZGVvXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1vdmVWaWRlb1xuICAgICAgICAgICAgd2hlbiBcImdzLk1vdmVWaWRlb1BhdGhcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTW92ZVZpZGVvUGF0aFxuICAgICAgICAgICAgd2hlbiBcImdzLlRpbnRWaWRlb1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRUaW50VmlkZW9cbiAgICAgICAgICAgIHdoZW4gXCJncy5GbGFzaFZpZGVvXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEZsYXNoVmlkZW9cbiAgICAgICAgICAgIHdoZW4gXCJncy5Dcm9wVmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ3JvcFZpZGVvXG4gICAgICAgICAgICB3aGVuIFwiZ3MuUm90YXRlVmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUm90YXRlVmlkZW9cbiAgICAgICAgICAgIHdoZW4gXCJncy5ab29tVmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kWm9vbVZpZGVvXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQmxlbmRWaWRlb1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRCbGVuZFZpZGVvXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTWFza1ZpZGVvXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1hc2tWaWRlb1xuICAgICAgICAgICAgd2hlbiBcImdzLlZpZGVvRWZmZWN0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFZpZGVvRWZmZWN0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuVmlkZW9Nb3Rpb25CbHVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFZpZGVvTW90aW9uQmx1clxuICAgICAgICAgICAgd2hlbiBcImdzLlZpZGVvRGVmYXVsdHNcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kVmlkZW9EZWZhdWx0c1xuICAgICAgICAgICAgd2hlbiBcImdzLkVyYXNlVmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRXJhc2VWaWRlb1xuICAgICAgICAgICAgd2hlbiBcImdzLlNob3dJbWFnZU1hcFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTaG93SW1hZ2VNYXBcbiAgICAgICAgICAgIHdoZW4gXCJncy5FcmFzZUltYWdlTWFwXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEVyYXNlSW1hZ2VNYXBcbiAgICAgICAgICAgIHdoZW4gXCJncy5BZGRIb3RzcG90XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEFkZEhvdHNwb3RcbiAgICAgICAgICAgIHdoZW4gXCJncy5FcmFzZUhvdHNwb3RcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRXJhc2VIb3RzcG90XG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlSG90c3BvdFN0YXRlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZUhvdHNwb3RTdGF0ZVxuICAgICAgICAgICAgd2hlbiBcImdzLlNob3dQaWN0dXJlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNob3dQaWN0dXJlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTW92ZVBpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTW92ZVBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5Nb3ZlUGljdHVyZVBhdGhcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTW92ZVBpY3R1cmVQYXRoXG4gICAgICAgICAgICB3aGVuIFwiZ3MuVGludFBpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kVGludFBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5GbGFzaFBpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRmxhc2hQaWN0dXJlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ3JvcFBpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ3JvcFBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5Sb3RhdGVQaWN0dXJlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFJvdGF0ZVBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5ab29tUGljdHVyZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRab29tUGljdHVyZVxuICAgICAgICAgICAgd2hlbiBcImdzLkJsZW5kUGljdHVyZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRCbGVuZFBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5TaGFrZVBpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2hha2VQaWN0dXJlXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTWFza1BpY3R1cmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTWFza1BpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5QaWN0dXJlRWZmZWN0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFBpY3R1cmVFZmZlY3RcbiAgICAgICAgICAgIHdoZW4gXCJncy5QaWN0dXJlTW90aW9uQmx1clwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRQaWN0dXJlTW90aW9uQmx1clxuICAgICAgICAgICAgd2hlbiBcImdzLlBpY3R1cmVEZWZhdWx0c1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRQaWN0dXJlRGVmYXVsdHNcbiAgICAgICAgICAgIHdoZW4gXCJncy5QbGF5UGljdHVyZUFuaW1hdGlvblwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRQbGF5UGljdHVyZUFuaW1hdGlvblxuICAgICAgICAgICAgd2hlbiBcImdzLkVyYXNlUGljdHVyZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRFcmFzZVBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gXCJncy5JbnB1dE51bWJlclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRJbnB1dE51bWJlclxuICAgICAgICAgICAgd2hlbiBcInZuLkNob2ljZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTaG93Q2hvaWNlXG4gICAgICAgICAgICB3aGVuIFwidm4uQ2hvaWNlVGltZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hvaWNlVGltZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5TaG93Q2hvaWNlc1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTaG93Q2hvaWNlc1xuICAgICAgICAgICAgd2hlbiBcInZuLlVubG9ja0NHXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFVubG9ja0NHXG4gICAgICAgICAgICB3aGVuIFwidm4uTDJESm9pblNjZW5lXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEwyREpvaW5TY2VuZVxuICAgICAgICAgICAgd2hlbiBcInZuLkwyREV4aXRTY2VuZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMMkRFeGl0U2NlbmVcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5MMkRNb3Rpb25cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTDJETW90aW9uXG4gICAgICAgICAgICB3aGVuIFwidm4uTDJETW90aW9uR3JvdXBcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTDJETW90aW9uR3JvdXBcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5MMkRFeHByZXNzaW9uXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEwyREV4cHJlc3Npb25cbiAgICAgICAgICAgIHdoZW4gXCJ2bi5MMkRNb3ZlXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEwyRE1vdmVcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5MMkRQYXJhbWV0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTDJEUGFyYW1ldGVyXG4gICAgICAgICAgICB3aGVuIFwidm4uTDJEU2V0dGluZ3NcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTDJEU2V0dGluZ3NcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5MMkREZWZhdWx0c1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMMkREZWZhdWx0c1xuICAgICAgICAgICAgd2hlbiBcInZuLkNoYXJhY3RlckpvaW5TY2VuZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFyYWN0ZXJKb2luU2NlbmVcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFyYWN0ZXJFeGl0U2NlbmVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhcmFjdGVyRXhpdFNjZW5lXG4gICAgICAgICAgICB3aGVuIFwidm4uQ2hhcmFjdGVyQ2hhbmdlRXhwcmVzc2lvblwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFyYWN0ZXJDaGFuZ2VFeHByZXNzaW9uXG4gICAgICAgICAgICB3aGVuIFwidm4uQ2hhcmFjdGVyU2V0UGFyYW1ldGVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYXJhY3RlclNldFBhcmFtZXRlclxuICAgICAgICAgICAgd2hlbiBcInZuLkNoYXJhY3RlckdldFBhcmFtZXRlclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFyYWN0ZXJHZXRQYXJhbWV0ZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFyYWN0ZXJEZWZhdWx0c1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFyYWN0ZXJEZWZhdWx0c1xuICAgICAgICAgICAgd2hlbiBcInZuLkNoYXJhY3RlckVmZmVjdFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFyYWN0ZXJFZmZlY3RcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5ab29tQ2hhcmFjdGVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFpvb21DaGFyYWN0ZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5Sb3RhdGVDaGFyYWN0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUm90YXRlQ2hhcmFjdGVyXG4gICAgICAgICAgICB3aGVuIFwidm4uQmxlbmRDaGFyYWN0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQmxlbmRDaGFyYWN0ZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5TaGFrZUNoYXJhY3RlclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTaGFrZUNoYXJhY3RlclxuICAgICAgICAgICAgd2hlbiBcInZuLk1hc2tDaGFyYWN0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTWFza0NoYXJhY3RlclxuICAgICAgICAgICAgd2hlbiBcInZuLk1vdmVDaGFyYWN0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kTW92ZUNoYXJhY3RlclxuICAgICAgICAgICAgd2hlbiBcInZuLk1vdmVDaGFyYWN0ZXJQYXRoXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1vdmVDaGFyYWN0ZXJQYXRoXG4gICAgICAgICAgICB3aGVuIFwidm4uRmxhc2hDaGFyYWN0ZXJcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRmxhc2hDaGFyYWN0ZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5UaW50Q2hhcmFjdGVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFRpbnRDaGFyYWN0ZXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFyYWN0ZXJNb3Rpb25CbHVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYXJhY3Rlck1vdGlvbkJsdXJcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFuZ2VCYWNrZ3JvdW5kXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZUJhY2tncm91bmRcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5TaGFrZUJhY2tncm91bmRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2hha2VCYWNrZ3JvdW5kXG4gICAgICAgICAgICB3aGVuIFwidm4uU2Nyb2xsQmFja2dyb3VuZFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kXG4gICAgICAgICAgICB3aGVuIFwidm4uU2Nyb2xsQmFja2dyb3VuZFRvXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNjcm9sbEJhY2tncm91bmRUb1xuICAgICAgICAgICAgd2hlbiBcInZuLlNjcm9sbEJhY2tncm91bmRQYXRoXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNjcm9sbEJhY2tncm91bmRQYXRoXG4gICAgICAgICAgICB3aGVuIFwidm4uWm9vbUJhY2tncm91bmRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kWm9vbUJhY2tncm91bmRcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5Sb3RhdGVCYWNrZ3JvdW5kXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFJvdGF0ZUJhY2tncm91bmRcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5UaW50QmFja2dyb3VuZFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRUaW50QmFja2dyb3VuZFxuICAgICAgICAgICAgd2hlbiBcInZuLkJsZW5kQmFja2dyb3VuZFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRCbGVuZEJhY2tncm91bmRcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5NYXNrQmFja2dyb3VuZFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRNYXNrQmFja2dyb3VuZFxuICAgICAgICAgICAgd2hlbiBcInZuLkJhY2tncm91bmRNb3Rpb25CbHVyXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEJhY2tncm91bmRNb3Rpb25CbHVyXG4gICAgICAgICAgICB3aGVuIFwidm4uQmFja2dyb3VuZEVmZmVjdFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRCYWNrZ3JvdW5kRWZmZWN0XG4gICAgICAgICAgICB3aGVuIFwidm4uQmFja2dyb3VuZERlZmF1bHRzXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEJhY2tncm91bmREZWZhdWx0c1xuICAgICAgICAgICAgd2hlbiBcInZuLkNoYW5nZVNjZW5lXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZVNjZW5lXG4gICAgICAgICAgICB3aGVuIFwidm4uUmV0dXJuVG9QcmV2aW91c1NjZW5lXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFJldHVyblRvUHJldmlvdXNTY2VuZVxuICAgICAgICAgICAgd2hlbiBcInZuLkNhbGxTY2VuZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDYWxsU2NlbmVcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5Td2l0Y2hUb0xheW91dFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTd2l0Y2hUb0xheW91dFxuICAgICAgICAgICAgd2hlbiBcImdzLkNoYW5nZVRyYW5zaXRpb25cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhbmdlVHJhbnNpdGlvblxuICAgICAgICAgICAgd2hlbiBcImdzLkNoYW5nZVdpbmRvd1NraW5cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhbmdlV2luZG93U2tpblxuICAgICAgICAgICAgd2hlbiBcImdzLkNoYW5nZVNjcmVlblRyYW5zaXRpb25zXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZVNjcmVlblRyYW5zaXRpb25zXG4gICAgICAgICAgICB3aGVuIFwidm4uVUlBY2Nlc3NcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kVUlBY2Nlc3NcbiAgICAgICAgICAgIHdoZW4gXCJncy5QbGF5VmlkZW9cIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUGxheVZpZGVvXG4gICAgICAgICAgICB3aGVuIFwiZ3MuUGxheU11c2ljXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFBsYXlNdXNpY1xuICAgICAgICAgICAgd2hlbiBcImdzLlN0b3BNdXNpY1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTdG9wTXVzaWNcbiAgICAgICAgICAgIHdoZW4gXCJncy5QbGF5U291bmRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUGxheVNvdW5kXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU3RvcFNvdW5kXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFN0b3BTb3VuZFxuICAgICAgICAgICAgd2hlbiBcImdzLlBhdXNlTXVzaWNcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUGF1c2VNdXNpY1xuICAgICAgICAgICAgd2hlbiBcImdzLlJlc3VtZU11c2ljXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFJlc3VtZU11c2ljXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQXVkaW9EZWZhdWx0c1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRBdWRpb0RlZmF1bHRzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuRW5kQ29tbW9uRXZlbnRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRW5kQ29tbW9uRXZlbnRcbiAgICAgICAgICAgIHdoZW4gXCJncy5SZXN1bWVDb21tb25FdmVudFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRSZXN1bWVDb21tb25FdmVudFxuICAgICAgICAgICAgd2hlbiBcImdzLkNhbGxDb21tb25FdmVudFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDYWxsQ29tbW9uRXZlbnRcbiAgICAgICAgICAgIHdoZW4gXCJncy5DaGFuZ2VUaW1lclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFuZ2VUaW1lclxuICAgICAgICAgICAgd2hlbiBcImdzLlNob3dUZXh0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNob3dUZXh0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuUmVmcmVzaFRleHRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUmVmcmVzaFRleHRcbiAgICAgICAgICAgIHdoZW4gXCJncy5UZXh0TW90aW9uQmx1clwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRUZXh0TW90aW9uQmx1clxuICAgICAgICAgICAgd2hlbiBcImdzLk1vdmVUZXh0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1vdmVUZXh0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuTW92ZVRleHRQYXRoXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZE1vdmVUZXh0UGF0aFxuICAgICAgICAgICAgd2hlbiBcImdzLlJvdGF0ZVRleHRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUm90YXRlVGV4dFxuICAgICAgICAgICAgd2hlbiBcImdzLlpvb21UZXh0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFpvb21UZXh0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuQmxlbmRUZXh0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEJsZW5kVGV4dFxuICAgICAgICAgICAgd2hlbiBcImdzLkNvbG9yVGV4dFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDb2xvclRleHRcbiAgICAgICAgICAgIHdoZW4gXCJncy5FcmFzZVRleHRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kRXJhc2VUZXh0IFxuICAgICAgICAgICAgd2hlbiBcImdzLlRleHRFZmZlY3RcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kVGV4dEVmZmVjdCBcbiAgICAgICAgICAgIHdoZW4gXCJncy5UZXh0RGVmYXVsdHNcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kVGV4dERlZmF1bHRzXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlVGV4dFNldHRpbmdzXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZVRleHRTZXR0aW5nc1xuICAgICAgICAgICAgd2hlbiBcImdzLklucHV0VGV4dFwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRJbnB1dFRleHRcbiAgICAgICAgICAgIHdoZW4gXCJncy5JbnB1dE5hbWVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kSW5wdXROYW1lXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU2F2ZVBlcnNpc3RlbnREYXRhXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNhdmVQZXJzaXN0ZW50RGF0YVxuICAgICAgICAgICAgd2hlbiBcImdzLlNhdmVTZXR0aW5nc1wiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRTYXZlU2V0dGluZ3NcbiAgICAgICAgICAgIHdoZW4gXCJncy5QcmVwYXJlU2F2ZUdhbWVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUHJlcGFyZVNhdmVHYW1lXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU2F2ZUdhbWVcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2F2ZUdhbWVcbiAgICAgICAgICAgIHdoZW4gXCJncy5Mb2FkR2FtZVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRMb2FkR2FtZVxuICAgICAgICAgICAgd2hlbiBcImdzLkdldElucHV0RGF0YVwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRHZXRJbnB1dERhdGFcbiAgICAgICAgICAgIHdoZW4gXCJncy5XYWl0Rm9ySW5wdXRcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kV2FpdEZvcklucHV0XG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlT2JqZWN0RG9tYWluXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZU9iamVjdERvbWFpblxuICAgICAgICAgICAgd2hlbiBcInZuLkdldEdhbWVEYXRhXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEdldEdhbWVEYXRhXG4gICAgICAgICAgICB3aGVuIFwidm4uU2V0R2FtZURhdGFcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kU2V0R2FtZURhdGFcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5HZXRPYmplY3REYXRhXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZEdldE9iamVjdERhdGFcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5TZXRPYmplY3REYXRhXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNldE9iamVjdERhdGFcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFuZ2VTb3VuZHNcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kQ2hhbmdlU291bmRzXG4gICAgICAgICAgICB3aGVuIFwidm4uQ2hhbmdlQ29sb3JzXCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZENoYW5nZUNvbG9yc1xuICAgICAgICAgICAgd2hlbiBcImdzLkNoYW5nZVNjcmVlbkN1cnNvclwiIHRoZW4gY29tbWFuZC5leGVjdXRlID0gQGNvbW1hbmRDaGFuZ2VTY3JlZW5DdXJzb3JcbiAgICAgICAgICAgIHdoZW4gXCJncy5SZXNldEdsb2JhbERhdGFcIiB0aGVuIGNvbW1hbmQuZXhlY3V0ZSA9IEBjb21tYW5kUmVzZXRHbG9iYWxEYXRhXG4gICAgICAgICAgICB3aGVuIFwiZ3MuU2NyaXB0XCIgdGhlbiBjb21tYW5kLmV4ZWN1dGUgPSBAY29tbWFuZFNjcmlwdFxuICAgIFxuICAgICMjIypcbiAgICAqIEV4ZWN1dGVzIHRoZSBjb21tYW5kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXggYW5kIGluY3JlYXNlcyB0aGUgY29tbWFuZC1wb2ludGVyLlxuICAgICpcbiAgICAqIEBtZXRob2QgZXhlY3V0ZUNvbW1hbmRcbiAgICAjIyMgICAgICAgXG4gICAgZXhlY3V0ZUNvbW1hbmQ6IChpbmRleCkgLT5cbiAgICAgICAgQGNvbW1hbmQgPSBAb2JqZWN0LmNvbW1hbmRzW2luZGV4XVxuXG4gICAgICAgIGlmIEBwcmV2aWV3RGF0YVxuICAgICAgICAgICAgaWYgQHBvaW50ZXIgPCBAcHJldmlld0RhdGEucG9pbnRlclxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0geWVzXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lID0gMFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0gQHByZXZpZXdEYXRhLnNldHRpbmdzLmFuaW1hdGlvbkRpc2FibGVkXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lID0gMFxuICAgICAgICAgICAgICAgIEBwcmV2aWV3SW5mby53YWl0aW5nID0geWVzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLmVtaXQoXCJwcmV2aWV3V2FpdGluZ1wiKVxuICAgICAgICAgICAgICAgIGlmIEBwcmV2aWV3RGF0YS5zZXR0aW5ncy5hbmltYXRpb25EaXNhYmxlZCBvciBAcHJldmlld0RhdGEuc2V0dGluZ3MuYW5pbWF0aW9uVGltZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgQHByZXZpZXdJbmZvLnRpbWVvdXQgPSBzZXRUaW1lb3V0ICgtPiBHcmFwaGljcy5zdG9wcGVkID0geWVzKSwgKEBwcmV2aWV3RGF0YS5zZXR0aW5ncy5hbmltYXRpb25UaW1lKSoxMDAwXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIEBjb21tYW5kLmV4ZWN1dGU/XG4gICAgICAgICAgICBAY29tbWFuZC5pbnRlcnByZXRlciA9IHRoaXNcbiAgICAgICAgICAgIEBjb21tYW5kLmV4ZWN1dGUoKSBpZiBAY29tbWFuZC5pbmRlbnQgPT0gQGluZGVudFxuICAgICAgICAgICAgQHBvaW50ZXIrK1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBAY29tbWFuZCA9IEBvYmplY3QuY29tbWFuZHNbQHBvaW50ZXJdXG4gICAgICAgICAgICBpZiBAY29tbWFuZD9cbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBAY29tbWFuZC5pbmRlbnRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBAaW5kZW50XG4gICAgICAgICAgICAgICAgd2hpbGUgaW5kZW50ID4gMCBhbmQgKG5vdCBAbG9vcHNbaW5kZW50XT8pXG4gICAgICAgICAgICAgICAgICAgIGluZGVudC0tXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgaW5kZW50IDwgQGluZGVudFxuICAgICAgICAgICAgICAgIEBpbmRlbnQgPSBpbmRlbnRcbiAgICAgICAgICAgICAgICBpZiBAbG9vcHNbQGluZGVudF0/XG4gICAgICAgICAgICAgICAgICAgIEBwb2ludGVyID0gQGxvb3BzW0BpbmRlbnRdXG4gICAgICAgICAgICAgICAgICAgIEBjb21tYW5kID0gQG9iamVjdC5jb21tYW5kc1tAcG9pbnRlcl1cbiAgICAgICAgICAgICAgICAgICAgQGNvbW1hbmQuaW50ZXJwcmV0ZXIgPSB0aGlzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBhc3NpZ25Db21tYW5kKEBjb21tYW5kKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGNvbW1hbmQuZXhlY3V0ZT9cbiAgICAgICAgICAgICAgICBAY29tbWFuZC5pbnRlcnByZXRlciA9IHRoaXNcbiAgICAgICAgICAgICAgICBAY29tbWFuZC5leGVjdXRlKCkgaWYgQGNvbW1hbmQuaW5kZW50ID09IEBpbmRlbnRcbiAgICAgICAgICAgICAgICBAcG9pbnRlcisrXG4gICAgICAgICAgICAgICAgQGNvbW1hbmQgPSBAb2JqZWN0LmNvbW1hbmRzW0Bwb2ludGVyXVxuICAgICAgICAgICAgICAgIGlmIEBjb21tYW5kP1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBAY29tbWFuZC5pbmRlbnRcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IEBpbmRlbnRcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgaW5kZW50ID4gMCBhbmQgKG5vdCBAbG9vcHNbaW5kZW50XT8pXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQtLVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgaW5kZW50IDwgQGluZGVudFxuICAgICAgICAgICAgICAgICAgICBAaW5kZW50ID0gaW5kZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIEBsb29wc1tAaW5kZW50XT9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBwb2ludGVyID0gQGxvb3BzW0BpbmRlbnRdXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29tbWFuZCA9IEBvYmplY3QuY29tbWFuZHNbQHBvaW50ZXJdXG4gICAgICAgICAgICAgICAgICAgICAgICBAY29tbWFuZC5pbnRlcnByZXRlciA9IHRoaXNcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAcG9pbnRlcisrXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIGNvbW1hbmRzIHVudGlsIGEgY29tbWFuZCB3aXRoIHRoZSBzcGVjaWZpZWQgaW5kZW50LWxldmVsIGlzIFxuICAgICogZm91bmQuIFNvIGZvciBleGFtcGxlOiBUbyBqdW1wIGZyb20gYSBDb25kaXRpb24tQ29tbWFuZCB0byB0aGUgbmV4dFxuICAgICogRWxzZS1Db21tYW5kIGp1c3QgcGFzcyB0aGUgaW5kZW50LWxldmVsIG9mIHRoZSBDb25kaXRpb24vRWxzZSBjb21tYW5kLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcFxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGVudCAtIFRoZSBpbmRlbnQtbGV2ZWwuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJhY2t3YXJkIC0gSWYgdHJ1ZSB0aGUgc2tpcCBydW5zIGJhY2t3YXJkLlxuICAgICMjIyAgIFxuICAgIHNraXA6IChpbmRlbnQsIGJhY2t3YXJkKSAtPlxuICAgICAgICBpZiBiYWNrd2FyZFxuICAgICAgICAgICAgQHBvaW50ZXItLVxuICAgICAgICAgICAgd2hpbGUgQHBvaW50ZXIgPiAwIGFuZCBAb2JqZWN0LmNvbW1hbmRzW0Bwb2ludGVyXS5pbmRlbnQgIT0gaW5kZW50XG4gICAgICAgICAgICAgICAgQHBvaW50ZXItLVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcG9pbnRlcisrXG4gICAgICAgICAgICB3aGlsZSBAcG9pbnRlciA8IEBvYmplY3QuY29tbWFuZHMubGVuZ3RoIGFuZCBAb2JqZWN0LmNvbW1hbmRzW0Bwb2ludGVyXS5pbmRlbnQgIT0gaW5kZW50XG4gICAgICAgICAgICAgICAgQHBvaW50ZXIrK1xuICAgIFxuICAgICMjIypcbiAgICAqIEhhbHRzIHRoZSBpbnRlcnByZXRlciBmb3IgdGhlIHNwZWNpZmllZCBhbW91bnQgb2YgdGltZS4gQW4gb3B0aW9uYWxseVxuICAgICogY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgdGltZSBpcyB1cC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHdhaXRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgdG8gd2FpdFxuICAgICogQHBhcmFtIHtncy5DYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsZWQgaWYgdGhlIHdhaXQgdGltZSBpcyB1cC5cbiAgICAjIyMgIFxuICAgIHdhaXQ6ICh0aW1lLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICBAd2FpdENvdW50ZXIgPSB0aW1lXG4gICAgICAgIEB3YWl0Q2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgdGhlIGNvbW1hbmQgYXQgdGhlIHNwZWNpZmllZCBwb2ludGVyLWluZGV4IGlzIGEgZ2FtZSBtZXNzYWdlXG4gICAgKiByZWxhdGVkIGNvbW1hbmQuXG4gICAgKlxuICAgICogQG1ldGhvZCBpc01lc3NhZ2VDb21tYW5kXG4gICAgKiBAcGFyYW0ge251bWJlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyL2luZGV4LlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY29tbWFuZHMgLSBUaGUgbGlzdCBvZiBjb21tYW5kcyB0byBjaGVjay5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IDxiPnRydWU8L2I+IGlmIGl0cyBhIGdhbWUgbWVzc2FnZSByZWxhdGVkIGNvbW1hbmQuIE90aGVyd2lzZSA8Yj5mYWxzZTwvYj4uXG4gICAgIyMjIFxuICAgIGlzTWVzc2FnZUNvbW1hbmQ6IChwb2ludGVyLCBjb21tYW5kcykgLT5cbiAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgIGlmIHBvaW50ZXIgPj0gY29tbWFuZHMubGVuZ3RoIG9yIChjb21tYW5kc1twb2ludGVyXS5pZCAhPSBcImdzLklucHV0TnVtYmVyXCIgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kc1twb2ludGVyXS5pZCAhPSBcInZuLkNob2ljZVwiIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHNbcG9pbnRlcl0uaWQgIT0gXCJncy5JbnB1dFRleHRcIiBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzW3BvaW50ZXJdLmlkICE9IFwiZ3MuSW5wdXROYW1lXCIpXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbm9cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgICMjIypcbiAgICAqIENoZWNrcyBpZiB0aGUgY29tbWFuZCBhdCB0aGUgc3BlY2lmaWVkIHBvaW50ZXItaW5kZXggYXNrcyBmb3IgdXNlci1pbnB1dCBsaWtlXG4gICAgKiB0aGUgSW5wdXQgTnVtYmVyIG9yIElucHV0IFRleHQgY29tbWFuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGlzSW5wdXREYXRhQ29tbWFuZFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlci9pbmRleC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IGNvbW1hbmRzIC0gVGhlIGxpc3Qgb2YgY29tbWFuZHMgdG8gY2hlY2suXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSA8Yj50cnVlPC9iPiBpZiBpdHMgYW4gaW5wdXQtZGF0YSBjb21tYW5kLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+XG4gICAgIyMjICAgICBcbiAgICBpc0lucHV0RGF0YUNvbW1hbmQ6IChwb2ludGVyLCBjb21tYW5kcykgLT5cbiAgICAgICAgcG9pbnRlciA8IGNvbW1hbmRzLmxlbmd0aCBhbmQgKFxuICAgICAgICAgICAgY29tbWFuZHNbcG9pbnRlcl0uaWQgPT0gXCJncy5JbnB1dE51bWJlclwiIG9yXG4gICAgICAgICAgICBjb21tYW5kc1twb2ludGVyXS5pZCA9PSBcImdzLklucHV0VGV4dFwiIG9yXG4gICAgICAgICAgICBjb21tYW5kc1twb2ludGVyXS5pZCA9PSBcInZuLkNob2ljZVwiIG9yXG4gICAgICAgICAgICBjb21tYW5kc1twb2ludGVyXS5pZCA9PSBcInZuLlNob3dDaG9pY2VzXCJcbiAgICAgICAgKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgYSBnYW1lIG1lc3NhZ2UgaXMgY3VycmVudGx5IHJ1bm5pbmcgYnkgYW5vdGhlciBpbnRlcnByZXRlciBsaWtlIGFcbiAgICAqIGNvbW1vbi1ldmVudCBpbnRlcnByZXRlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGlzUHJvY2Vzc2luZ01lc3NhZ2VJbk90aGVyQ29udGV4dFxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gPGI+dHJ1ZTwvYj4gYSBnYW1lIG1lc3NhZ2UgaXMgcnVubmluZyBpbiBhbm90aGVyIGNvbnRleHQuIE90aGVyd2lzZSA8Yj5mYWxzZTwvYj5cbiAgICAjIyMgICAgIFxuICAgIGlzUHJvY2Vzc2luZ01lc3NhZ2VJbk90aGVyQ29udGV4dDogLT5cbiAgICAgICAgcmVzdWx0ID0gbm9cbiAgICAgICAgZ20gPSBHYW1lTWFuYWdlclxuICAgICAgICBzID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIFxuICAgICAgICByZXN1bHQgPVxuICAgICAgICAgICAgICAgICAocy5pbnB1dE51bWJlcldpbmRvdz8gYW5kIHMuaW5wdXROdW1iZXJXaW5kb3cudmlzaWJsZSBhbmQgcy5pbnB1dE51bWJlcldpbmRvdy5leGVjdXRpb25Db250ZXh0ICE9IEBjb250ZXh0KSBvclxuICAgICAgICAgICAgICAgICAocy5pbnB1dFRleHRXaW5kb3c/IGFuZCBzLmlucHV0VGV4dFdpbmRvdy5hY3RpdmUgYW5kIHMuaW5wdXRUZXh0V2luZG93LmV4ZWN1dGlvbkNvbnRleHQgIT0gQGNvbnRleHQpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgXG4gICAgIyMjKlxuICAgICogSWYgYSBnYW1lIG1lc3NhZ2UgaXMgY3VycmVudGx5IHJ1bm5pbmcgYnkgYW4gb3RoZXIgaW50ZXJwcmV0ZXIgbGlrZSBhIGNvbW1vbi1ldmVudFxuICAgICogaW50ZXJwcmV0ZXIsIHRoaXMgbWV0aG9kIHRyaWdnZXIgYSB3YWl0IHVudGlsIHRoZSBvdGhlciBpbnRlcnByZXRlciBpcyBmaW5pc2hlZFxuICAgICogd2l0aCB0aGUgZ2FtZSBtZXNzYWdlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgd2FpdEZvck1lc3NhZ2VcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IDxiPnRydWU8L2I+IGEgZ2FtZSBtZXNzYWdlIGlzIHJ1bm5pbmcgaW4gYW5vdGhlciBjb250ZXh0LiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+XG4gICAgIyMjICAgICAgIFxuICAgIHdhaXRGb3JNZXNzYWdlOiAtPlxuICAgICAgICBAaXNXYWl0aW5nRm9yTWVzc2FnZSA9IHllc1xuICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgIEBwb2ludGVyLS1cbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSB0aGUgbnVtYmVyIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBudW1iZXJWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSdzIHNjb3BlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSB2YXJpYWJsZSB0byBnZXQgdGhlIHZhbHVlIGZyb20uXG4gICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSB2YWx1ZSBvZiB0aGUgdmFyaWFibGUuXG4gICAgIyMjICAgICBcbiAgICBudW1iZXJWYWx1ZUF0SW5kZXg6IChzY29wZSwgaW5kZXgpIC0+IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUubnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpbmRleClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiBhIChwb3NzaWJsZSkgbnVtYmVyIHZhcmlhYmxlLiBJZiBhIGNvbnN0YW50IG51bWJlciB2YWx1ZSBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAgKiBkb2VzIG5vdGhpbmcgYW4ganVzdCByZXR1cm5zIHRoYXQgY29uc3RhbnQgdmFsdWUuIFRoYXQncyB0byBtYWtlIGl0IG1vcmUgY29tZm9ydGFibGUgdG8ganVzdCBwYXNzIGEgdmFsdWUgd2hpY2hcbiAgICAqIGNhbiBiZSBjYWxjdWxhdGVkIGJ5IHZhcmlhYmxlIGJ1dCBhbHNvIGJlIGp1c3QgYSBjb25zdGFudCB2YWx1ZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG51bWJlclZhbHVlT2ZcbiAgICAqIEBwYXJhbSB7bnVtYmVyfE9iamVjdH0gb2JqZWN0IC0gQSBudW1iZXIgdmFyaWFibGUgb3IgY29uc3RhbnQgbnVtYmVyIHZhbHVlLlxuICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgdmFsdWUgb2YgdGhlIHZhcmlhYmxlLlxuICAgICMjIyAgICAgXG4gICAgbnVtYmVyVmFsdWVPZjogKG9iamVjdCkgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5udW1iZXJWYWx1ZU9mKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBJdCBkb2VzIHRoZSBzYW1lIGxpa2UgPGI+bnVtYmVyVmFsdWVPZjwvYj4gd2l0aCBvbmUgZGlmZmVyZW5jZTogSWYgdGhlIHNwZWNpZmllZCBvYmplY3RcbiAgICAqIGlzIGEgdmFyaWFibGUsIGl0J3MgdmFsdWUgaXMgY29uc2lkZXJlZCBhcyBhIGR1cmF0aW9uLXZhbHVlIGluIG1pbGxpc2Vjb25kcyBhbmQgYXV0b21hdGljYWxseSBjb252ZXJ0ZWRcbiAgICAqIGludG8gZnJhbWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHVyYXRpb25WYWx1ZU9mXG4gICAgKiBAcGFyYW0ge251bWJlcnxPYmplY3R9IG9iamVjdCAtIEEgbnVtYmVyIHZhcmlhYmxlIG9yIGNvbnN0YW50IG51bWJlciB2YWx1ZS5cbiAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgICAgIFxuICAgIGR1cmF0aW9uVmFsdWVPZjogKG9iamVjdCkgLT4gXG4gICAgICAgIGlmIG9iamVjdCBhbmQgb2JqZWN0LmluZGV4P1xuICAgICAgICAgICAgTWF0aC5yb3VuZChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLm51bWJlclZhbHVlT2Yob2JqZWN0KSAvIDEwMDAgKiBHcmFwaGljcy5mcmFtZVJhdGUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIE1hdGgucm91bmQoR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5udW1iZXJWYWx1ZU9mKG9iamVjdCkpXG4gICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgYSBwb3NpdGlvbiAoe3gsIHl9KSBmb3IgdGhlIHNwZWNpZmllZCBwcmVkZWZpbmVkIG9iamVjdCBwb3NpdGlvbiBjb25maWd1cmVkIGluIFxuICAgICogRGF0YWJhc2UgLSBTeXN0ZW0uXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVkZWZpbmVkT2JqZWN0UG9zaXRpb25cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiAtIFRoZSBpbmRleC9JRCBvZiB0aGUgcHJlZGVmaW5lZCBvYmplY3QgcG9zaXRpb24gdG8gc2V0LlxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIHNldCB0aGUgcG9zaXRpb24gZm9yLlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMgb2JqZWN0IG9mIHRoZSBzY2VuZSBjb21tYW5kLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgcG9zaXRpb24ge3gsIHl9LlxuICAgICMjI1xuICAgIHByZWRlZmluZWRPYmplY3RQb3NpdGlvbjogKHBvc2l0aW9uLCBvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgb2JqZWN0UG9zaXRpb24gPSBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5vYmplY3RQb3NpdGlvbnNbcG9zaXRpb25dXG4gICAgICAgIGlmICFvYmplY3RQb3NpdGlvbiB0aGVuIHJldHVybiB7IHg6IDAsIHk6IDAgfVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IG9iamVjdFBvc2l0aW9uLmZ1bmM/XG4gICAgICAgICAgICBmID0gZXZhbChcIihmdW5jdGlvbihvYmplY3QsIHBhcmFtcyl7XCIgKyBvYmplY3RQb3NpdGlvbi5zY3JpcHQgKyBcIn0pXCIpXG4gICAgICAgICAgICBvYmplY3RQb3NpdGlvbi5mdW5jID0gZlxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG9iamVjdFBvc2l0aW9uLmZ1bmMob2JqZWN0LCBwYXJhbXMpIHx8IHsgeDogMCwgeTogMCB9XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHZhbHVlIG9mIGEgbnVtYmVyIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXROdW1iZXJWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSdzIHNjb3BlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSB2YXJpYWJsZSB0byBzZXQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgbnVtYmVyIHZhbHVlIHRvIHNldCB0aGUgdmFyaWFibGUgdG8uXG4gICAgIyMjXG4gICAgc2V0TnVtYmVyVmFsdWVBdEluZGV4OiAoc2NvcGUsIGluZGV4LCB2YWx1ZSwgZG9tYWluKSAtPiBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldE51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaW5kZXgsIHZhbHVlLCBkb21haW4pXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBudW1iZXIgdmFyaWFibGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXROdW1iZXJWYWx1ZVRvXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gc2V0LlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIG51bWJlciB2YWx1ZSB0byBzZXQgdGhlIHZhcmlhYmxlIHRvLlxuICAgICMjI1xuICAgIHNldE51bWJlclZhbHVlVG86ICh2YXJpYWJsZSwgdmFsdWUpIC0+IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0TnVtYmVyVmFsdWVUbyh2YXJpYWJsZSwgdmFsdWUpXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBsaXN0IHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0TGlzdE9iamVjdFRvXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gc2V0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIC0gVGhlIGxpc3Qgb2JqZWN0IHRvIHNldCB0aGUgdmFyaWFibGUgdG8uXG4gICAgIyMjXG4gICAgc2V0TGlzdE9iamVjdFRvOiAodmFyaWFibGUsIHZhbHVlKSAtPiBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldExpc3RPYmplY3RUbyh2YXJpYWJsZSwgdmFsdWUpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIGJvb2xlYW4vc3dpdGNoIHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0Qm9vbGVhblZhbHVlVG9cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YXJpYWJsZSAtIFRoZSB2YXJpYWJsZSB0byBzZXQuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlIC0gVGhlIGJvb2xlYW4gdmFsdWUgdG8gc2V0IHRoZSB2YXJpYWJsZSB0by5cbiAgICAjIyNcbiAgICBzZXRCb29sZWFuVmFsdWVUbzogKHZhcmlhYmxlLCB2YWx1ZSkgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXRCb29sZWFuVmFsdWVUbyh2YXJpYWJsZSwgdmFsdWUpXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBudW1iZXIgdmFyaWFibGUgYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldEJvb2xlYW5WYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSdzIHNjb3BlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSB2YXJpYWJsZSB0byBzZXQuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlIC0gVGhlIGJvb2xlYW4gdmFsdWUgdG8gc2V0IHRoZSB2YXJpYWJsZSB0by5cbiAgICAjIyNcbiAgICBzZXRCb29sZWFuVmFsdWVBdEluZGV4OiAoc2NvcGUsIGluZGV4LCB2YWx1ZSwgZG9tYWluKSAtPiBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldEJvb2xlYW5WYWx1ZUF0SW5kZXgoc2NvcGUsIGluZGV4LCB2YWx1ZSwgZG9tYWluKVxuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHZhbHVlIG9mIGEgc3RyaW5nL3RleHQgdmFyaWFibGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRTdHJpbmdWYWx1ZVRvXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gc2V0LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIHN0cmluZy90ZXh0IHZhbHVlIHRvIHNldCB0aGUgdmFyaWFibGUgdG8uXG4gICAgIyMjXG4gICAgc2V0U3RyaW5nVmFsdWVUbzogKHZhcmlhYmxlLCB2YWx1ZSkgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXRTdHJpbmdWYWx1ZVRvKHZhcmlhYmxlLCB2YWx1ZSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc3RyaW5nIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRTdHJpbmdWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSBzY29wZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSB2YXJpYWJsZSdzIGluZGV4LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAgICAjIyMgICAgIFxuICAgIHNldFN0cmluZ1ZhbHVlQXRJbmRleDogKHNjb3BlLCBpbmRleCwgdmFsdWUsIGRvbWFpbikgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXRTdHJpbmdWYWx1ZUF0SW5kZXgoc2NvcGUsIGluZGV4LCB2YWx1ZSwgZG9tYWluKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYSAocG9zc2libGUpIHN0cmluZyB2YXJpYWJsZS4gSWYgYSBjb25zdGFudCBzdHJpbmcgdmFsdWUgaXMgc3BlY2lmaWVkLCB0aGlzIG1ldGhvZFxuICAgICogZG9lcyBub3RoaW5nIGFuIGp1c3QgcmV0dXJucyB0aGF0IGNvbnN0YW50IHZhbHVlLiBUaGF0J3MgdG8gbWFrZSBpdCBtb3JlIGNvbWZvcnRhYmxlIHRvIGp1c3QgcGFzcyBhIHZhbHVlIHdoaWNoXG4gICAgKiBjYW4gYmUgY2FsY3VsYXRlZCBieSB2YXJpYWJsZSBidXQgYWxzbyBiZSBqdXN0IGEgY29uc3RhbnQgdmFsdWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdHJpbmdWYWx1ZU9mXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IG9iamVjdCAtIEEgc3RyaW5nIHZhcmlhYmxlIG9yIGNvbnN0YW50IHN0cmluZyB2YWx1ZS5cbiAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgXG4gICAgc3RyaW5nVmFsdWVPZjogKG9iamVjdCkgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zdHJpbmdWYWx1ZU9mKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc3RyaW5nIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzdHJpbmdWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSdzIHNjb3BlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSB2YXJpYWJsZSB0byBnZXQgdGhlIHZhbHVlIGZyb20uXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgdmFyaWFibGUuXG4gICAgIyMjICAgICBcbiAgICBzdHJpbmdWYWx1ZUF0SW5kZXg6IChzY29wZSwgaW5kZXgsIGRvbWFpbikgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zdHJpbmdWYWx1ZUF0SW5kZXgoc2NvcGUsIGluZGV4LCBkb21haW4pXG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYSAocG9zc2libGUpIGJvb2xlYW4gdmFyaWFibGUuIElmIGEgY29uc3RhbnQgYm9vbGVhbiB2YWx1ZSBpcyBzcGVjaWZpZWQsIHRoaXMgbWV0aG9kXG4gICAgKiBkb2VzIG5vdGhpbmcgYW4ganVzdCByZXR1cm5zIHRoYXQgY29uc3RhbnQgdmFsdWUuIFRoYXQncyB0byBtYWtlIGl0IG1vcmUgY29tZm9ydGFibGUgdG8ganVzdCBwYXNzIGEgdmFsdWUgd2hpY2hcbiAgICAqIGNhbiBiZSBjYWxjdWxhdGVkIGJ5IHZhcmlhYmxlIGJ1dCBhbHNvIGJlIGp1c3QgYSBjb25zdGFudCB2YWx1ZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGJvb2xlYW5WYWx1ZU9mXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW58T2JqZWN0fSBvYmplY3QgLSBBIGJvb2xlYW4gdmFyaWFibGUgb3IgY29uc3RhbnQgYm9vbGVhbiB2YWx1ZS5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRoZSB2YWx1ZSBvZiB0aGUgdmFyaWFibGUuXG4gICAgIyMjIFxuICAgIGJvb2xlYW5WYWx1ZU9mOiAob2JqZWN0KSAtPiBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmJvb2xlYW5WYWx1ZU9mKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYm9vbGVhbiB2YXJpYWJsZSBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICpcbiAgICAqIEBtZXRob2QgYm9vbGVhblZhbHVlQXRJbmRleFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNjb3BlIC0gVGhlIHZhcmlhYmxlJ3Mgc2NvcGUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIHZhcmlhYmxlIHRvIGdldCB0aGUgdmFsdWUgZnJvbS5cbiAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgICAgIFxuICAgIGJvb2xlYW5WYWx1ZUF0SW5kZXg6IChzY29wZSwgaW5kZXgsIGRvbWFpbikgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5ib29sZWFuVmFsdWVBdEluZGV4KHNjb3BlLCBpbmRleCwgZG9tYWluKVxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGEgKHBvc3NpYmxlKSBsaXN0IHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgbGlzdE9iamVjdE9mXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQSBsaXN0IHZhcmlhYmxlLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdmFsdWUgb2YgdGhlIGxpc3QgdmFyaWFibGUuXG4gICAgIyMjIFxuICAgIGxpc3RPYmplY3RPZjogKG9iamVjdCkgLT4gR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5saXN0T2JqZWN0T2Yob2JqZWN0KVxuICAgIFxuICAgICMjIypcbiAgICAqIENvbXBhcmVzIHR3byBvYmplY3QgdXNpbmcgdGhlIHNwZWNpZmllZCBvcGVyYXRpb24gYW5kIHJldHVybnMgdGhlIHJlc3VsdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNvbXBhcmVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBhIC0gT2JqZWN0IEEuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYiAtIE9iamVjdCBCLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IG9wZXJhdGlvbiAtIFRoZSBjb21wYXJlLW9wZXJhdGlvbiB0byBjb21wYXJlIE9iamVjdCBBIHdpdGggT2JqZWN0IEIuXG4gICAgKiA8dWw+XG4gICAgKiA8bGk+MCA9IEVxdWFsIFRvPC9saT5cbiAgICAqIDxsaT4xID0gTm90IEVxdWFsIFRvPC9saT5cbiAgICAqIDxsaT4yID0gR3JlYXRlciBUaGFuPC9saT5cbiAgICAqIDxsaT4zID0gR3JlYXRlciBvciBFcXVhbCBUbzwvbGk+XG4gICAgKiA8bGk+NCA9IExlc3MgVGhhbjwvbGk+XG4gICAgKiA8bGk+NSA9IExlc3Mgb3IgRXF1YWwgVG88L2xpPlxuICAgICogPC91bD5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IFRoZSBjb21wYXJpc29uIHJlc3VsdC5cbiAgICAjIyMgXG4gICAgY29tcGFyZTogKGEsIGIsIG9wZXJhdGlvbikgLT5cbiAgICAgICAgc3dpdGNoIG9wZXJhdGlvblxuICAgICAgICAgICAgd2hlbiAwIHRoZW4gcmV0dXJuIGBhID09IGJgXG4gICAgICAgICAgICB3aGVuIDEgdGhlbiByZXR1cm4gYGEgIT0gYmBcbiAgICAgICAgICAgIHdoZW4gMiB0aGVuIHJldHVybiBhID4gYlxuICAgICAgICAgICAgd2hlbiAzIHRoZW4gcmV0dXJuIGEgPj0gYlxuICAgICAgICAgICAgd2hlbiA0IHRoZW4gcmV0dXJuIGEgPCBiXG4gICAgICAgICAgICB3aGVuIDUgdGhlbiByZXR1cm4gYSA8PSBiXG4gICAgIFxuICAgICMjIypcbiAgICAqIENoYW5nZXMgbnVtYmVyIHZhcmlhYmxlcyBhbmQgYWxsb3dzIGRlY2ltYWwgdmFsdWVzIHN1Y2ggYXMgMC41IHRvby5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNoYW5nZURlY2ltYWxWYXJpYWJsZXNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBJbnB1dCBwYXJhbXMgZnJvbSB0aGUgY29tbWFuZFxuICAgICogQHBhcmFtIHtPYmplY3R9IHJvdW5kTWV0aG9kIC0gVGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uIHdpbGwgYmUgcm91bmRlZCB1c2luZyB0aGUgc3BlY2lmaWVkIG1ldGhvZC5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT4wID0gTm9uZS4gVGhlIHJlc3VsdCB3aWxsIG5vdCBiZSByb3VuZGVkLjwvbGk+XG4gICAgKiA8bGk+MSA9IENvbW1lcmNpYWxseTwvbGk+XG4gICAgKiA8bGk+MiA9IFJvdW5kIFVwPC9saT5cbiAgICAqIDxsaT4zID0gUm91bmQgRG93bjwvbGk+XG4gICAgKiA8L3VsPlxuICAgICMjIyAgICAgICBcbiAgICBjaGFuZ2VEZWNpbWFsVmFyaWFibGVzOiAocGFyYW1zLCByb3VuZE1ldGhvZCkgLT5cbiAgICAgICAgc291cmNlID0gMFxuICAgICAgICByb3VuZEZ1bmMgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggcm91bmRNZXRob2RcbiAgICAgICAgICAgIHdoZW4gMCB0aGVuIHJvdW5kRnVuYyA9ICh2YWx1ZSkgLT4gdmFsdWVcbiAgICAgICAgICAgIHdoZW4gMSB0aGVuIHJvdW5kRnVuYyA9ICh2YWx1ZSkgLT4gTWF0aC5yb3VuZCh2YWx1ZSlcbiAgICAgICAgICAgIHdoZW4gMiB0aGVuIHJvdW5kRnVuYyA9ICh2YWx1ZSkgLT4gTWF0aC5jZWlsKHZhbHVlKVxuICAgICAgICAgICAgd2hlbiAzIHRoZW4gcm91bmRGdW5jID0gKHZhbHVlKSAtPiBNYXRoLmZsb29yKHZhbHVlKVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIHBhcmFtcy5zb3VyY2VcbiAgICAgICAgICAgIHdoZW4gMCAjIENvbnN0YW50IFZhbHVlIC8gVmFyaWFibGUgVmFsdWVcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBAbnVtYmVyVmFsdWVPZihwYXJhbXMuc291cmNlVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDEgIyBSYW5kb21cbiAgICAgICAgICAgICAgICBzdGFydCA9IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5zb3VyY2VSYW5kb20uc3RhcnQpXG4gICAgICAgICAgICAgICAgZW5kID0gQG51bWJlclZhbHVlT2YocGFyYW1zLnNvdXJjZVJhbmRvbS5lbmQpXG4gICAgICAgICAgICAgICAgZGlmZiA9IGVuZCAtIHN0YXJ0XG4gICAgICAgICAgICAgICAgc291cmNlID0gTWF0aC5mbG9vcihzdGFydCArIE1hdGgucmFuZG9tKCkgKiAoZGlmZisxKSlcbiAgICAgICAgICAgIHdoZW4gMiAjIFBvaW50ZXJcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBAbnVtYmVyVmFsdWVBdEluZGV4KHBhcmFtcy5zb3VyY2VTY29wZSwgQG51bWJlclZhbHVlT2YocGFyYW1zLnNvdXJjZVJlZmVyZW5jZSktMSwgcGFyYW1zLnNvdXJjZVJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgIHdoZW4gMyAjIEdhbWUgRGF0YVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IEBudW1iZXJWYWx1ZU9mR2FtZURhdGEocGFyYW1zLnNvdXJjZVZhbHVlMSlcbiAgICAgICAgICAgIHdoZW4gNCAjIERhdGFiYXNlIERhdGFcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBAbnVtYmVyVmFsdWVPZkRhdGFiYXNlRGF0YShwYXJhbXMuc291cmNlVmFsdWUxKVxuICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBwYXJhbXMudGFyZ2V0XG4gICAgICAgICAgICB3aGVuIDAgIyBWYXJpYWJsZVxuICAgICAgICAgICAgICAgIHN3aXRjaCBwYXJhbXMub3BlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMCAjIFNldFxuICAgICAgICAgICAgICAgICAgICAgICAgQHNldE51bWJlclZhbHVlVG8ocGFyYW1zLnRhcmdldFZhcmlhYmxlLCByb3VuZEZ1bmMoc291cmNlKSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxICMgQWRkXG4gICAgICAgICAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVUbyhwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHJvdW5kRnVuYyhAbnVtYmVyVmFsdWVPZihwYXJhbXMudGFyZ2V0VmFyaWFibGUpICsgc291cmNlKSApXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFN1YlxuICAgICAgICAgICAgICAgICAgICAgICAgQHNldE51bWJlclZhbHVlVG8ocGFyYW1zLnRhcmdldFZhcmlhYmxlLCByb3VuZEZ1bmMoQG51bWJlclZhbHVlT2YocGFyYW1zLnRhcmdldFZhcmlhYmxlKSAtIHNvdXJjZSkgKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDMgIyBNdWxcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZVRvKHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZU9mKHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgKiBzb3VyY2UpKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDQgIyBEaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZVRvKHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZU9mKHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgLyBzb3VyY2UpKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDUgIyBNb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZVRvKHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQG51bWJlclZhbHVlT2YocGFyYW1zLnRhcmdldFZhcmlhYmxlKSAlIHNvdXJjZSlcbiAgICAgICAgICAgIHdoZW4gMSAjIFJhbmdlXG4gICAgICAgICAgICAgICAgc2NvcGUgPSBwYXJhbXMudGFyZ2V0U2NvcGVcbiAgICAgICAgICAgICAgICBzdGFydCA9IHBhcmFtcy50YXJnZXRSYW5nZS5zdGFydC0xXG4gICAgICAgICAgICAgICAgZW5kID0gcGFyYW1zLnRhcmdldFJhbmdlLmVuZC0xXG4gICAgICAgICAgICAgICAgZm9yIGkgaW4gW3N0YXJ0Li5lbmRdXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCBwYXJhbXMub3BlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDAgIyBTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpLCByb3VuZEZ1bmMoc291cmNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIEFkZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGksIHJvdW5kRnVuYyhAbnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpKSArIHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDIgIyBTdWJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpLCByb3VuZEZ1bmMoQG51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSkgLSBzb3VyY2UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgTXVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNldE51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGkpICogc291cmNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gNCAjIERpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGksIHJvdW5kRnVuYyhAbnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpKSAvIHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDUgIyBNb2RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpLCBAbnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpKSAlIHNvdXJjZSlcbiAgICAgICAgICAgIHdoZW4gMiAjIFJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIGluZGV4ID0gQG51bWJlclZhbHVlT2YocGFyYW1zLnRhcmdldFJlZmVyZW5jZSkgLSAxXG4gICAgICAgICAgICAgICAgc3dpdGNoIHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVBdEluZGV4KHBhcmFtcy50YXJnZXRTY29wZSwgaW5kZXgsIHJvdW5kRnVuYyhzb3VyY2UpLCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBBZGRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbikgKyBzb3VyY2UpLCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDIgIyBTdWJcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbikgLSBzb3VyY2UpLCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDMgIyBNdWxcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbikgKiBzb3VyY2UpLCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDQgIyBEaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcm91bmRGdW5jKEBudW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbikgLyBzb3VyY2UpLCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDUgIyBNb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZUF0SW5kZXgocGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQG51bWJlclZhbHVlQXRJbmRleChwYXJhbXMudGFyZ2V0U2NvcGUsIGluZGV4LCBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKSAlIHNvdXJjZSwgcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2hha2VzIGEgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBzaGFrZU9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIHNoYWtlLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8gYWJvdXQgdGhlIHNoYWtlLWFuaW1hdGlvbi5cbiAgICAjIyMgICAgICAgIFxuICAgIHNoYWtlT2JqZWN0OiAob2JqZWN0LCBwYXJhbXMpIC0+XG4gICAgICAgIGR1cmF0aW9uID0gTWF0aC5tYXgoTWF0aC5yb3VuZChAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbikpLCAyKVxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QocGFyYW1zLmVhc2luZylcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5zaGFrZSh7IHg6IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5yYW5nZS54KSwgeTogQG51bWJlclZhbHVlT2YocGFyYW1zLnJhbmdlLnkpIH0sIEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5zcGVlZCkgLyAxMDAsIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICBcbiAgICAjIyMqXG4gICAgKiBMZXRzIHRoZSBpbnRlcnByZXRlciB3YWl0IGZvciB0aGUgY29tcGxldGlvbiBvZiBhIHJ1bm5pbmcgb3BlcmF0aW9uIGxpa2UgYW4gYW5pbWF0aW9uLCBldGMuXG4gICAgKlxuICAgICogQG1ldGhvZCB3YWl0Rm9yQ29tcGxldGlvblxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRoZSBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgb24uIENhbiBiZSA8Yj5udWxsPC9iPi5cbiAgICAqIEByZXR1cm4ge09iamVjdH0gQSBwYXJhbXMgb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBpbmZvLlxuICAgICMjIyAgXG4gICAgd2FpdEZvckNvbXBsZXRpb246IChvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgZHVyYXRpb24gPSBAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgaWYgcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEB3YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgXG4gICAgIyMjKlxuICAgICogRXJhc2VzIGEgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBlcmFzZU9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIGVyYXNlLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjICAgICAgXG4gICAgZXJhc2VPYmplY3Q6IChvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5kaXNhcHBlYXIocGFyYW1zLmFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgKHNlbmRlcikgPT4gXG4gICAgICAgICAgICBzZW5kZXIuZGlzcG9zZSgpXG4gICAgICAgIClcbiAgICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAd2FpdENvdW50ZXIgPSBkdXJhdGlvbiBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTaG93cyBhIGdhbWUgb2JqZWN0IG9uIHNjcmVlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNob3dPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byBzaG93LlxuICAgICogQHBhcmFtIHtncy5Qb2ludH0gcG9zaXRpb24gLSBUaGUgcG9zaXRpb24gd2hlcmUgdGhlIGdhbWUgb2JqZWN0IHNob3VsZCBiZSBzaG93bi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjICAgICAgICAgIFxuICAgIHNob3dPYmplY3Q6IChvYmplY3QsIHBvc2l0aW9uLCBwYXJhbXMpIC0+XG4gICAgICAgIHggPSBAbnVtYmVyVmFsdWVPZihwb3NpdGlvbi54KVxuICAgICAgICB5ID0gQG51bWJlclZhbHVlT2YocG9zaXRpb24ueSlcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICBcbiAgICAgICAgb2JqZWN0LmFuaW1hdG9yLmFwcGVhcih4LCB5LCBwYXJhbXMuYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uKVxuICAgICAgICBcbiAgICAgICAgaWYgcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEB3YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgIFxuICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBNb3ZlcyBhIGdhbWUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgbW92ZU9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIG1vdmUuXG4gICAgKiBAcGFyYW0ge2dzLlBvaW50fSBwb3NpdGlvbiAtIFRoZSBwb3NpdGlvbiB0byBtb3ZlIHRoZSBnYW1lIG9iamVjdCB0by5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjIFxuICAgIG1vdmVPYmplY3Q6IChvYmplY3QsIHBvc2l0aW9uLCBwYXJhbXMpIC0+XG4gICAgICAgIGlmIHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMFxuICAgICAgICAgICAgcCA9IEBwcmVkZWZpbmVkT2JqZWN0UG9zaXRpb24ocGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBvYmplY3QsIHBhcmFtcylcbiAgICAgICAgICAgIHggPSBwLnhcbiAgICAgICAgICAgIHkgPSBwLnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgeCA9IEBudW1iZXJWYWx1ZU9mKHBvc2l0aW9uLngpXG4gICAgICAgICAgICB5ID0gQG51bWJlclZhbHVlT2YocG9zaXRpb24ueSlcbiAgICBcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIFxuICAgICAgICBvYmplY3QuYW5pbWF0b3IubW92ZVRvKHgsIHksIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgXG4gICAgICAgIGlmIHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAd2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogTW92ZXMgYSBnYW1lIG9iamVjdCBhbG9uZyBhIHBhdGguXG4gICAgKlxuICAgICogQG1ldGhvZCBtb3ZlT2JqZWN0UGF0aFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIG1vdmUuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcGF0aCAtIFRoZSBwYXRoIHRvIG1vdmUgdGhlIGdhbWUgb2JqZWN0IGFsb25nLlxuICAgICogQHBhcmFtIHtPYmplY3R9IEEgcGFyYW1zIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mby5cbiAgICAjIyMgXG4gICAgbW92ZU9iamVjdFBhdGg6IChvYmplY3QsIHBhdGgsIHBhcmFtcykgLT5cbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5tb3ZlUGF0aChwYXRoLmRhdGEsIHBhcmFtcy5sb29wVHlwZSwgZHVyYXRpb24sIGVhc2luZywgcGF0aC5lZmZlY3RzPy5kYXRhKVxuICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICBcbiAgICAjIyMqXG4gICAgKiBTY3JvbGxzIGEgc2Nyb2xsYWJsZSBnYW1lIG9iamVjdCBhbG9uZyBhIHBhdGguXG4gICAgKlxuICAgICogQG1ldGhvZCBzY3JvbGxPYmplY3RQYXRoXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gc2Nyb2xsLlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhdGggLSBUaGUgcGF0aCB0byBzY3JvbGwgdGhlIGdhbWUgb2JqZWN0IGFsb25nLlxuICAgICogQHBhcmFtIHtPYmplY3R9IEEgcGFyYW1zIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mby5cbiAgICAjIyMgICAgICAgIFxuICAgIHNjcm9sbE9iamVjdFBhdGg6IChvYmplY3QsIHBhdGgsIHBhcmFtcykgLT5cbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5zY3JvbGxQYXRoKHBhdGgsIHBhcmFtcy5sb29wVHlwZSwgZHVyYXRpb24sIGVhc2luZylcbiAgICBcbiAgICAgICAgaWYgcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEB3YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBab29tcy9TY2FsZXMgYSBnYW1lIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHpvb21PYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byB6b29tLlxuICAgICogQHBhcmFtIHtPYmplY3R9IEEgcGFyYW1zIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mby5cbiAgICAjIyMgXG4gICAgem9vbU9iamVjdDogKG9iamVjdCwgcGFyYW1zKSAtPlxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QocGFyYW1zLmVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgb2JqZWN0LmFuaW1hdG9yLnpvb21UbyhAbnVtYmVyVmFsdWVPZihwYXJhbXMuem9vbWluZy54KSAvIDEwMCwgQG51bWJlclZhbHVlT2YocGFyYW1zLnpvb21pbmcueSkgLyAxMDAsIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFJvdGF0ZXMgYSBnYW1lIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJvdGF0ZU9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IC0gVGhlIGdhbWUgb2JqZWN0IHRvIHJvdGF0ZS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjIFxuICAgIHJvdGF0ZU9iamVjdDogKG9iamVjdCwgcGFyYW1zKSAtPlxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QocGFyYW1zLmVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QocGFyYW1zLmVhc2luZylcbiAgICAgICAgXG4gICAgICAgICNpZiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAjICAgIGFjdHVhbER1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICAjICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihAZHVyYXRpb24pXG4gICAgICAgICMgICAgc3BlZWQgPSBAbnVtYmVyVmFsdWVPZihAcGFyYW1zLnNwZWVkKSAvIDEwMFxuICAgICAgICAjICAgIHNwZWVkID0gTWF0aC5yb3VuZChkdXJhdGlvbiAvIChhY3R1YWxEdXJhdGlvbnx8MSkgKiBzcGVlZClcbiAgICAgICAgIyAgICBwaWN0dXJlLmFuaW1hdG9yLnJvdGF0ZShAcGFyYW1zLmRpcmVjdGlvbiwgc3BlZWQsIGFjdHVhbER1cmF0aW9ufHwxLCBlYXNpbmcpXG4gICAgICAgICMgICAgZHVyYXRpb24gPSBhY3R1YWxEdXJhdGlvblxuICAgICAgICAjZWxzZVxuICAgICAgICAjICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgICMgICAgb2JqZWN0LmFuaW1hdG9yLnJvdGF0ZShwYXJhbXMuZGlyZWN0aW9uLCBAbnVtYmVyVmFsdWVPZihAcGFyYW1zLnNwZWVkKSAvIDEwMCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5yb3RhdGUocGFyYW1zLmRpcmVjdGlvbiwgQG51bWJlclZhbHVlT2YocGFyYW1zLnNwZWVkKSAvIDEwMCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAd2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgIFxuICAgICMjIypcbiAgICAqIEJsZW5kcyBhIGdhbWUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgYmxlbmRPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byBibGVuZC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjXG4gICAgYmxlbmRPYmplY3Q6IChvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5ibGVuZFRvKEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5vcGFjaXR5KSwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAd2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBtYXNraW5nLWVmZmVjdCBvbiBhIGdhbWUgb2JqZWN0Li5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG1hc2tPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byBleGVjdXRlIGEgbWFza2luZy1lZmZlY3Qgb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gQSBwYXJhbXMgb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBpbmZvLlxuICAgICMjIyBcbiAgICBtYXNrT2JqZWN0OiAob2JqZWN0LCBwYXJhbXMpIC0+XG4gICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChwYXJhbXMuZWFzaW5nKVxuICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy5tYXNrLnR5cGUgPT0gMFxuICAgICAgICAgICAgb2JqZWN0Lm1hc2sudHlwZSA9IDBcbiAgICAgICAgICAgIG9iamVjdC5tYXNrLm94ID0gQG51bWJlclZhbHVlT2YocGFyYW1zLm1hc2sub3gpXG4gICAgICAgICAgICBvYmplY3QubWFzay5veSA9IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5tYXNrLm95KVxuICAgICAgICAgICAgaWYgb2JqZWN0Lm1hc2suc291cmNlPy52aWRlb0VsZW1lbnQ/XG4gICAgICAgICAgICAgICAgb2JqZWN0Lm1hc2suc291cmNlLnBhdXNlKClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHBhcmFtcy5tYXNrLnNvdXJjZVR5cGUgPT0gMFxuICAgICAgICAgICAgICAgIG9iamVjdC5tYXNrLnNvdXJjZSA9IFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9NYXNrcy8je3BhcmFtcy5tYXNrLmdyYXBoaWM/Lm5hbWV9XCIpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb2JqZWN0Lm1hc2suc291cmNlID0gUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiTW92aWVzLyN7cGFyYW1zLm1hc2sudmlkZW8/Lm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgaWYgb2JqZWN0Lm1hc2suc291cmNlXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5tYXNrLnNvdXJjZS5wbGF5KClcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm1hc2suc291cmNlLmxvb3AgPSB5ZXNcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZHVyYXRpb24gPSBAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgICAgIG9iamVjdC5hbmltYXRvci5tYXNrVG8ocGFyYW1zLm1hc2ssIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgIFxuICAgICMjIypcbiAgICAqIFRpbnRzIGEgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCB0aW50T2JqZWN0XG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gdGludC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjICAgICAgIFxuICAgIHRpbnRPYmplY3Q6IChvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgZHVyYXRpb24gPSBAZHVyYXRpb25WYWx1ZU9mKHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIG9iamVjdC5hbmltYXRvci50aW50VG8ocGFyYW1zLnRvbmUsIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgXG4gICAgIyMjKlxuICAgICogRmxhc2hlcyBhIGdhbWUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgZmxhc2hPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byBmbGFzaC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBBIHBhcmFtcyBvYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGluZm8uXG4gICAgIyMjIFxuICAgIGZsYXNoT2JqZWN0OiAob2JqZWN0LCBwYXJhbXMpIC0+XG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIG9iamVjdC5hbmltYXRvci5mbGFzaChuZXcgQ29sb3IocGFyYW1zLmNvbG9yKSwgZHVyYXRpb24pXG4gICAgICAgIFxuICAgICAgICBpZiBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICBcbiAgICAjIyMqXG4gICAgKiBDcm9wZXMgYSBnYW1lIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyb3BPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IG9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCB0byBjcm9wLlxuICAgICogQHBhcmFtIHtPYmplY3R9IEEgcGFyYW1zIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mby5cbiAgICAjIyMgICAgICAgICBcbiAgICBjcm9wT2JqZWN0OiAob2JqZWN0LCBwYXJhbXMpIC0+XG4gICAgICAgIG9iamVjdC5zcmNSZWN0LnggPSBAbnVtYmVyVmFsdWVPZihwYXJhbXMueClcbiAgICAgICAgb2JqZWN0LnNyY1JlY3QueSA9IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy55KVxuICAgICAgICBvYmplY3Quc3JjUmVjdC53aWR0aCA9IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy53aWR0aClcbiAgICAgICAgb2JqZWN0LnNyY1JlY3QuaGVpZ2h0ID0gQG51bWJlclZhbHVlT2YocGFyYW1zLmhlaWdodClcbiAgICAgICAgXG4gICAgICAgIG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG51bWJlclZhbHVlT2YocGFyYW1zLndpZHRoKVxuICAgICAgICBvYmplY3QuZHN0UmVjdC5oZWlnaHQgPSBAbnVtYmVyVmFsdWVPZihwYXJhbXMuaGVpZ2h0KVxuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIG1vdGlvbiBibHVyIHNldHRpbmdzIG9mIGEgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBvYmplY3RNb3Rpb25CbHVyXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gc2V0IHRoZSBtb3Rpb24gYmx1ciBzZXR0aW5ncyBmb3IuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gQSBwYXJhbXMgb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBpbmZvLlxuICAgICMjI1xuICAgIG9iamVjdE1vdGlvbkJsdXI6IChvYmplY3QsIHBhcmFtcykgLT5cbiAgICAgICAgb2JqZWN0Lm1vdGlvbkJsdXIuc2V0KHBhcmFtcy5tb3Rpb25CbHVyKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBFbmFibGVzIGFuIGVmZmVjdCBvbiBhIGdhbWUgb2JqZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgb2JqZWN0RWZmZWN0XG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBvYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdG8gZXhlY3V0ZSBhIG1hc2tpbmctZWZmZWN0IG9uLlxuICAgICogQHBhcmFtIHtPYmplY3R9IEEgcGFyYW1zIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mby5cbiAgICAjIyMgXG4gICAgb2JqZWN0RWZmZWN0OiAob2JqZWN0LCBwYXJhbXMpIC0+XG4gICAgICAgIGR1cmF0aW9uID0gQGR1cmF0aW9uVmFsdWVPZihwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChwYXJhbXMuZWFzaW5nKVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIHBhcmFtcy50eXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBXb2JibGVcbiAgICAgICAgICAgICAgICBvYmplY3QuYW5pbWF0b3Iud29iYmxlVG8ocGFyYW1zLndvYmJsZS5wb3dlciAvIDEwMDAwLCBwYXJhbXMud29iYmxlLnNwZWVkIC8gMTAwLCBkdXJhdGlvbiwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHdvYmJsZSA9IG9iamVjdC5lZmZlY3RzLndvYmJsZVxuICAgICAgICAgICAgICAgIHdvYmJsZS5lbmFibGVkID0gcGFyYW1zLndvYmJsZS5wb3dlciA+IDBcbiAgICAgICAgICAgICAgICB3b2JibGUudmVydGljYWwgPSBwYXJhbXMud29iYmxlLm9yaWVudGF0aW9uID09IDAgb3IgcGFyYW1zLndvYmJsZS5vcmllbnRhdGlvbiA9PSAyXG4gICAgICAgICAgICAgICAgd29iYmxlLmhvcml6b250YWwgPSBwYXJhbXMud29iYmxlLm9yaWVudGF0aW9uID09IDEgb3IgcGFyYW1zLndvYmJsZS5vcmllbnRhdGlvbiA9PSAyXG4gICAgICAgICAgICB3aGVuIDEgIyBCbHVyXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLmJsdXJUbyhwYXJhbXMuYmx1ci5wb3dlciAvIDEwMCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgICAgICAgICBvYmplY3QuZWZmZWN0cy5ibHVyLmVuYWJsZWQgPSB5ZXNcbiAgICAgICAgICAgIHdoZW4gMiAjIFBpeGVsYXRlXG4gICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLnBpeGVsYXRlVG8ocGFyYW1zLnBpeGVsYXRlLnNpemUud2lkdGgsIHBhcmFtcy5waXhlbGF0ZS5zaXplLmhlaWdodCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgICAgICAgICBvYmplY3QuZWZmZWN0cy5waXhlbGF0ZS5lbmFibGVkID0geWVzXG4gICAgXG4gICAgICAgIGlmIHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgZHVyYXRpb24gIT0gMFxuICAgICAgICAgICAgQGlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQHdhaXRDb3VudGVyID0gZHVyYXRpb25cbiBcbiAgICAjIyMqXG4gICAgKiBFeGVjdXRlcyBhbiBhY3Rpb24gbGlrZSBmb3IgYSBob3RzcG90LlxuICAgICpcbiAgICAqIEBtZXRob2QgZXhlY3V0ZUFjdGlvblxuICAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiAtIEFjdGlvbi1EYXRhLlxuICAgICogQHBhcmFtIHtib29sZWFufSBzdGF0ZVZhbHVlIC0gSW4gY2FzZSBvZiBzd2l0Y2gtYmluZGluZywgdGhlIHN3aXRjaCBpcyBzZXQgdG8gdGhpcyB2YWx1ZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaW5kVmFsdWUgLSBBIG51bWJlciB2YWx1ZSB3aGljaCBiZSBwdXQgaW50byB0aGUgYWN0aW9uJ3MgYmluZC12YWx1ZSB2YXJpYWJsZS5cbiAgICAjIyNcbiAgICBleGVjdXRlQWN0aW9uOiAoYWN0aW9uLCBzdGF0ZVZhbHVlLCBiaW5kVmFsdWUpIC0+XG4gICAgICAgIHN3aXRjaCBhY3Rpb24udHlwZVxuICAgICAgICAgICAgd2hlbiAwICMgSnVtcCBUbyBMYWJlbFxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5sYWJlbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIEBwb2ludGVyID0gYWN0aW9uLmxhYmVsSW5kZXhcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBqdW1wVG9MYWJlbChhY3Rpb24ubGFiZWwpXG4gICAgICAgICAgICB3aGVuIDEgIyBDYWxsIENvbW1vbiBFdmVudFxuICAgICAgICAgICAgICAgIEBjYWxsQ29tbW9uRXZlbnQoYWN0aW9uLmNvbW1vbkV2ZW50SWQsIG51bGwsIEBpc1dhaXRpbmcpXG4gICAgICAgICAgICB3aGVuIDIgIyBCaW5kIFRvIFN3aXRjaFxuICAgICAgICAgICAgICAgIGRvbWFpbiA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuZG9tYWluXG4gICAgICAgICAgICAgICAgQHNldEJvb2xlYW5WYWx1ZVRvKGFjdGlvbi5zd2l0Y2gsIHN0YXRlVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDMgIyBDYWxsIFNjZW5lXG4gICAgICAgICAgICAgICAgQGNhbGxTY2VuZShhY3Rpb24uc2NlbmU/LnVpZClcbiAgICAgICAgICAgIHdoZW4gNCAjIEJpbmQgVmFsdWUgdG8gVmFyaWFibGVcbiAgICAgICAgICAgICAgICBkb21haW4gPSBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmRvbWFpblxuICAgICAgICAgICAgICAgIEBzZXROdW1iZXJWYWx1ZVRvKGFjdGlvbi5iaW5kVmFsdWVWYXJpYWJsZSwgYmluZFZhbHVlKVxuICAgICAgICAgICAgICAgIGlmIGFjdGlvbi5sYWJlbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIEBwb2ludGVyID0gYWN0aW9uLmxhYmVsSW5kZXhcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBqdW1wVG9MYWJlbChhY3Rpb24ubGFiZWwpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxzIGEgY29tbW9uIGV2ZW50IGFuZCByZXR1cm5zIHRoZSBzdWItaW50ZXJwcmV0ZXIgZm9yIGl0LlxuICAgICpcbiAgICAqIEBtZXRob2QgY2FsbENvbW1vbkV2ZW50XG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSBUaGUgSUQgb2YgdGhlIGNvbW1vbiBldmVudCB0byBjYWxsLlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgLSBPcHRpb25hbCBjb21tb24gZXZlbnQgcGFyYW1ldGVycy5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd2FpdCAtIEluZGljYXRlcyBpZiB0aGUgaW50ZXJwcmV0ZXIgc2hvdWxkIGJlIHN0YXkgaW4gd2FpdGluZy1tb2RlIGV2ZW4gaWYgdGhlIHN1Yi1pbnRlcnByZXRlciBpcyBmaW5pc2hlZC5cbiAgICAjIyMgXG4gICAgY2FsbENvbW1vbkV2ZW50OiAoaWQsIHBhcmFtZXRlcnMsIHdhaXQpIC0+XG4gICAgICAgIGNvbW1vbkV2ZW50ID0gR2FtZU1hbmFnZXIuY29tbW9uRXZlbnRzW2lkXVxuICAgICAgICBcbiAgICAgICAgaWYgY29tbW9uRXZlbnQ/XG4gICAgICAgICAgICBpZiBTY2VuZU1hbmFnZXIuc2NlbmUuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0cy5pbmRleE9mKGNvbW1vbkV2ZW50KSA9PSAtMVxuICAgICAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5jb21tb25FdmVudENvbnRhaW5lci5hZGRPYmplY3QoY29tbW9uRXZlbnQpXG4gICAgICAgICAgICBjb21tb25FdmVudC5ldmVudHM/Lm9uIFwiZmluaXNoXCIsIGdzLkNhbGxCYWNrKFwib25Db21tb25FdmVudEZpbmlzaFwiLCB0aGlzKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIgPSBjb21tb25FdmVudC5iZWhhdmlvci5jYWxsKHBhcmFtZXRlcnMgfHwgW10sIEBzZXR0aW5ncywgQGNvbnRleHQpXG4gICAgICAgICAgICAjR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXR1cExvY2FsVmFyaWFibGVzKEBzdWJJbnRlcnByZXRlci5jb250ZXh0KVxuICAgICAgICAgICAgI0dhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBUZW1wVmFyaWFibGVzKEBzdWJJbnRlcnByZXRlci5jb250ZXh0KVxuICAgICAgICAgICAgY29tbW9uRXZlbnQuYmVoYXZpb3IudXBkYXRlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQHN1YkludGVycHJldGVyP1xuICAgICAgICAgICAgICAgIEBpc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIuc2V0dGluZ3MgPSBAc2V0dGluZ3NcbiAgICAgICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIuc3RhcnQoKVxuICAgICAgICAgICAgICAgIEBzdWJJbnRlcnByZXRlci51cGRhdGUoKVxuICAgIFxuICAgICMjIypcbiAgICAqIENhbGxzIGEgc2NlbmUgYW5kIHJldHVybnMgdGhlIHN1Yi1pbnRlcnByZXRlciBmb3IgaXQuXG4gICAgKlxuICAgICogQG1ldGhvZCBjYWxsU2NlbmVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1aWQgLSBUaGUgVUlEIG9mIHRoZSBzY2VuZSB0byBjYWxsLlxuICAgICMjIyAgICAgICAgIFxuICAgIGNhbGxTY2VuZTogKHVpZCkgLT5cbiAgICAgICAgc2NlbmVEb2N1bWVudCA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KHVpZClcbiAgICAgICAgXG4gICAgICAgIGlmIHNjZW5lRG9jdW1lbnQ/XG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIgPSBuZXcgdm4uQ29tcG9uZW50X0NhbGxTY2VuZUludGVycHJldGVyKClcbiAgICAgICAgICAgIG9iamVjdCA9IHsgY29tbWFuZHM6IHNjZW5lRG9jdW1lbnQuaXRlbXMuY29tbWFuZHMgfVxuICAgICAgICAgICAgQHN1YkludGVycHJldGVyLnJlcGVhdCA9IG5vXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIuY29udGV4dC5zZXQoc2NlbmVEb2N1bWVudC51aWQsIHNjZW5lRG9jdW1lbnQpXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIub2JqZWN0ID0gb2JqZWN0XG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIub25GaW5pc2ggPSBncy5DYWxsQmFjayhcIm9uQ2FsbFNjZW5lRmluaXNoXCIsIHRoaXMpXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIuc3RhcnQoKVxuICAgICAgICAgICAgQHN1YkludGVycHJldGVyLnNldHRpbmdzID0gQHNldHRpbmdzXG4gICAgICAgICAgICBAc3ViSW50ZXJwcmV0ZXIudXBkYXRlKClcbiAgICAgICAgICAgIFxuICBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2FsbHMgYSBjb21tb24gZXZlbnQgYW5kIHJldHVybnMgdGhlIHN1Yi1pbnRlcnByZXRlciBmb3IgaXQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9yZUxpc3RWYWx1ZVxuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gVGhlIElEIG9mIHRoZSBjb21tb24gZXZlbnQgdG8gY2FsbC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIC0gT3B0aW9uYWwgY29tbW9uIGV2ZW50IHBhcmFtZXRlcnMuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdhaXQgLSBJbmRpY2F0ZXMgaWYgdGhlIGludGVycHJldGVyIHNob3VsZCBiZSBzdGF5IGluIHdhaXRpbmctbW9kZSBldmVuIGlmIHRoZSBzdWItaW50ZXJwcmV0ZXIgaXMgZmluaXNoZWQuXG4gICAgIyMjICAgICAgICBcbiAgICBzdG9yZUxpc3RWYWx1ZTogKHZhcmlhYmxlLCBsaXN0LCB2YWx1ZSwgdmFsdWVUeXBlKSAtPlxuICAgICAgICBzd2l0Y2ggdmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXIgVmFsdWVcbiAgICAgICAgICAgICAgICBAc2V0TnVtYmVyVmFsdWVUbyh2YXJpYWJsZSwgKGlmICFpc05hTih2YWx1ZSkgdGhlbiB2YWx1ZSBlbHNlIDApKVxuICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoIFZhbHVlXG4gICAgICAgICAgICAgICAgQHNldEJvb2xlYW5WYWx1ZVRvKHZhcmlhYmxlLCAoaWYgdmFsdWUgdGhlbiAxIGVsc2UgMCkpXG4gICAgICAgICAgICB3aGVuIDIgIyBUZXh0IFZhbHVlXG4gICAgICAgICAgICAgICAgQHNldFN0cmluZ1ZhbHVlVG8odmFyaWFibGUsIHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB3aGVuIDMgIyBMaXN0IFZhbHVlXG4gICAgICAgICAgICAgICAgQHNldExpc3RPYmplY3RUbyh2YXJpYWJsZSwgKGlmIHZhbHVlLmxlbmd0aD8gdGhlbiB2YWx1ZSBlbHNlIFtdKSkgXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QganVtcFRvTGFiZWxcbiAgICAjIyMgICAgICAgICBcbiAgICBqdW1wVG9MYWJlbDogKGxhYmVsKSAtPlxuICAgICAgICByZXR1cm4gaWYgbm90IGxhYmVsXG4gICAgICAgIGZvdW5kID0gbm9cbiAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi4uQG9iamVjdC5jb21tYW5kcy5sZW5ndGhdXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmNvbW1hbmRzW2ldLmlkID09IFwiZ3MuTGFiZWxcIiBhbmQgQG9iamVjdC5jb21tYW5kc1tpXS5wYXJhbXMubmFtZSA9PSBsYWJlbFxuICAgICAgICAgICAgICAgIEBwb2ludGVyID0gaVxuICAgICAgICAgICAgICAgIEBpbmRlbnQgPSBAb2JqZWN0LmNvbW1hbmRzW2ldLmluZGVudFxuICAgICAgICAgICAgICAgIGZvdW5kID0geWVzXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgZm91bmRcbiAgICAgICAgICAgIEB3YWl0Q291bnRlciA9IDBcbiAgICAgICAgICAgIEBpc1dhaXRpbmcgPSBub1xuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIGN1cnJlbnQgbWVzc2FnZSBib3ggb2JqZWN0IGRlcGVuZGluZyBvbiBnYW1lIG1vZGUgKEFEViBvciBOVkwpLlxuICAgICpcbiAgICAqIEBtZXRob2QgbWVzc2FnZUJveE9iamVjdFxuICAgICogQHJldHVybiB7Z3MuT2JqZWN0X0Jhc2V9IFRoZSBtZXNzYWdlIGJveCBvYmplY3QuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgXG4gICAgbWVzc2FnZUJveE9iamVjdDogKGlkKSAtPlxuICAgICAgICBpZiBTY2VuZU1hbmFnZXIuc2NlbmUubGF5b3V0LnZpc2libGVcbiAgICAgICAgICAgIHJldHVybiBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChpZCB8fCBcIm1lc3NhZ2VCb3hcIilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKGlkIHx8IFwibWVzc2FnZUJveE5WTFwiKVxuICAgICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgY3VycmVudCBtZXNzYWdlIG9iamVjdCBkZXBlbmRpbmcgb24gZ2FtZSBtb2RlIChBRFYgb3IgTlZMKS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG1lc3NhZ2VPYmplY3RcbiAgICAqIEByZXR1cm4ge3VpLk9iamVjdF9NZXNzYWdlfSBUaGUgbWVzc2FnZSBvYmplY3QuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgIFxuICAgIG1lc3NhZ2VPYmplY3Q6IC0+XG4gICAgICAgIGlmIFNjZW5lTWFuYWdlci5zY2VuZS5sYXlvdXQudmlzaWJsZVxuICAgICAgICAgICAgcmV0dXJuIGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VfbWVzc2FnZVwiKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZU5WTF9tZXNzYWdlXCIpXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgY3VycmVudCBtZXNzYWdlIElEIGRlcGVuZGluZyBvbiBnYW1lIG1vZGUgKEFEViBvciBOVkwpLlxuICAgICpcbiAgICAqIEBtZXRob2QgbWVzc2FnZU9iamVjdElkXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBtZXNzYWdlIG9iamVjdCBJRC5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgIFxuICAgIG1lc3NhZ2VPYmplY3RJZDogLT5cbiAgICAgICAgaWYgU2NlbmVNYW5hZ2VyLnNjZW5lLmxheW91dC52aXNpYmxlXG4gICAgICAgICAgICByZXR1cm4gXCJnYW1lTWVzc2FnZV9tZXNzYWdlXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIFwiZ2FtZU1lc3NhZ2VOVkxfbWVzc2FnZVwiXG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgY3VycmVudCBtZXNzYWdlIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2QgbWVzc2FnZVNldHRpbmdzXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBtZXNzYWdlIHNldHRpbmdzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBtZXNzYWdlU2V0dGluZ3M6IC0+XG4gICAgICAgIG1lc3NhZ2UgPSBAdGFyZ2V0TWVzc2FnZSgpXG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2Uuc2V0dGluZ3NcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgY3VycmVudCB0YXJnZXQgbWVzc2FnZSBvYmplY3Qgd2hlcmUgYWxsIG1lc3NhZ2UgY29tbWFuZHMgYXJlIGV4ZWN1dGVkIG9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdGFyZ2V0TWVzc2FnZVxuICAgICogQHJldHVybiB7dWkuT2JqZWN0X01lc3NhZ2V9IFRoZSB0YXJnZXQgbWVzc2FnZSBvYmplY3QuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgdGFyZ2V0TWVzc2FnZTogLT5cbiAgICAgICAgbWVzc2FnZSA9IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgdGFyZ2V0ID0gQHNldHRpbmdzLm1lc3NhZ2UudGFyZ2V0XG4gICAgICAgIGlmIHRhcmdldD9cbiAgICAgICAgICAgIHN3aXRjaCB0YXJnZXQudHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIExheW91dC1CYXNlZFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQodGFyZ2V0LmlkKSA/IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgICAgICAgICB3aGVuIDEgIyBDdXN0b21cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFNjZW5lTWFuYWdlci5zY2VuZS5tZXNzYWdlQXJlYXNbdGFyZ2V0LmlkXT8ubWVzc2FnZSA/IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBtZXNzYWdlXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIGN1cnJlbnQgdGFyZ2V0IG1lc3NhZ2UgYm94IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgdGFyZ2V0IG1lc3NhZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCB0YXJnZXRNZXNzYWdlQm94XG4gICAgKiBAcmV0dXJuIHt1aS5PYmplY3RfVUlFbGVtZW50fSBUaGUgdGFyZ2V0IG1lc3NhZ2UgYm94LlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgdGFyZ2V0TWVzc2FnZUJveDogLT5cbiAgICAgICAgbWVzc2FnZUJveCA9IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgdGFyZ2V0ID0gQHNldHRpbmdzLm1lc3NhZ2UudGFyZ2V0XG4gICAgICAgIGlmIHRhcmdldD9cbiAgICAgICAgICAgIHN3aXRjaCB0YXJnZXQudHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIExheW91dC1CYXNlZFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlQm94ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQodGFyZ2V0LmlkKSA/IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgICAgICAgICB3aGVuIDEgIyBDdXN0b21cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUJveCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiY3VzdG9tR2FtZU1lc3NhZ2VfXCIrdGFyZ2V0LmlkKSA/IEBtZXNzYWdlT2JqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBtZXNzYWdlQm94XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCBhZnRlciBhbiBpbnB1dCBudW1iZXIgZGlhbG9nIHdhcyBhY2NlcHRlZCBieSB0aGUgdXNlci4gSXQgdGFrZXMgdGhlIHVzZXIncyBpbnB1dCBhbmQgcHV0c1xuICAgICogaXQgaW4gdGhlIGNvbmZpZ3VyZWQgbnVtYmVyIHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25JbnB1dE51bWJlckZpbmlzaFxuICAgICogQHJldHVybiB7T2JqZWN0fSBFdmVudCBPYmplY3QgY29udGFpbmluZyBhZGRpdGlvbmFsIGRhdGEgbGlrZSB0aGUgbnVtYmVyLCBldGMuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgIFxuICAgIG9uSW5wdXROdW1iZXJGaW5pc2g6IChlKSAtPlxuICAgICAgICBAbWVzc2FnZU9iamVjdCgpLmJlaGF2aW9yLmNsZWFyKClcbiAgICAgICAgQHNldE51bWJlclZhbHVlVG8oQHdhaXRpbmdGb3IuaW5wdXROdW1iZXIudmFyaWFibGUsIHBhcnNlSW50KHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKGUuc2VuZGVyLCBlLm51bWJlcikpKVxuICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgQHdhaXRpbmdGb3IuaW5wdXROdW1iZXIgPSBudWxsXG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5pbnB1dE51bWJlckJveC5kaXNwb3NlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgYWZ0ZXIgYW4gaW5wdXQgdGV4dCBkaWFsb2cgd2FzIGFjY2VwdGVkIGJ5IHRoZSB1c2VyLiBJdCB0YWtlcyB0aGUgdXNlcidzIHRleHQgaW5wdXQgYW5kIHB1dHNcbiAgICAqIGl0IGluIHRoZSBjb25maWd1cmVkIHN0cmluZyB2YXJpYWJsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uSW5wdXRUZXh0RmluaXNoXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IEV2ZW50IE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YSBsaWtlIHRoZSB0ZXh0LCBldGMuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIG9uSW5wdXRUZXh0RmluaXNoOiAoZSkgLT5cbiAgICAgICAgQG1lc3NhZ2VPYmplY3QoKS5iZWhhdmlvci5jbGVhcigpXG4gICAgICAgIEBzZXRTdHJpbmdWYWx1ZVRvKEB3YWl0aW5nRm9yLmlucHV0VGV4dC52YXJpYWJsZSwgdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoZS5zZW5kZXIsIGUudGV4dCkucmVwbGFjZSgvXy9nLCBcIlwiKSlcbiAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgIEB3YWl0aW5nRm9yLmlucHV0VGV4dCA9IG51bGxcbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmlucHV0VGV4dEJveC5kaXNwb3NlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgYWZ0ZXIgYSBjaG9pY2Ugd2FzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLiBJdCBqdW1wcyB0byB0aGUgY29ycmVzcG9uZGluZyBsYWJlbFxuICAgICogYW5kIGFsc28gcHV0cyB0aGUgY2hvaWNlIGludG8gYmFja2xvZy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9uQ2hvaWNlQWNjZXB0XG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IEV2ZW50IE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YSBsaWtlIHRoZSBsYWJlbCwgZXRjLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgXG4gICAgb25DaG9pY2VBY2NlcHQ6IChlKSAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5jaG9pY2VUaW1lci5iZWhhdmlvci5zdG9wKClcbiAgICAgICAgXG4gICAgICAgIGUuaXNTZWxlY3RlZCA9IHllc1xuICAgICAgICBkZWxldGUgZS5zZW5kZXJcbiAgICAgICAgXG4gICAgICAgIEdhbWVNYW5hZ2VyLmJhY2tsb2cucHVzaCh7IGNoYXJhY3RlcjogeyBuYW1lOiBcIlwiIH0sIG1lc3NhZ2U6IFwiXCIsIGNob2ljZTogZSwgY2hvaWNlczogJHRlbXBGaWVsZHMuY2hvaWNlcywgaXNDaG9pY2U6IHllcyB9KVxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZXMgPSBbXVxuICAgICAgICBtZXNzYWdlT2JqZWN0ID0gQG1lc3NhZ2VPYmplY3QoKVxuICAgICAgICBpZiBtZXNzYWdlT2JqZWN0Py52aXNpYmxlXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBmYWRpbmcgPSBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MubWVzc2FnZUZhZGluZ1xuICAgICAgICAgICAgZHVyYXRpb24gPSBpZiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCB0aGVuIDAgZWxzZSBmYWRpbmcuZHVyYXRpb25cbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuYW5pbWF0b3IuZGlzYXBwZWFyKGZhZGluZy5hbmltYXRpb24sIGZhZGluZy5lYXNpbmcsIGR1cmF0aW9uLCA9PlxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuYmVoYXZpb3IuY2xlYXIoKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QudmlzaWJsZSA9IG5vXG4gICAgICAgICAgICAgICAgQGlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgQHdhaXRpbmdGb3IuY2hvaWNlID0gbnVsbFxuICAgICAgICAgICAgICAgIEBleGVjdXRlQWN0aW9uKGUuYWN0aW9uLCB0cnVlKVxuICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgICAgIEBleGVjdXRlQWN0aW9uKGUuYWN0aW9uLCB0cnVlKVxuICAgICAgICBzY2VuZS5jaG9pY2VXaW5kb3cuZGlzcG9zZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIHdoZW4gYSBOVkwgbWVzc2FnZSBmaW5pc2hlcy4gXG4gICAgKlxuICAgICogQG1ldGhvZCBvbk1lc3NhZ2VOVkxGaW5pc2hcbiAgICAqIEByZXR1cm4ge09iamVjdH0gRXZlbnQgT2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgICAgXG4gICAgb25NZXNzYWdlTlZMRmluaXNoOiAoZSkgLT5cbiAgICAgICAgbWVzc2FnZU9iamVjdCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VOVkxfbWVzc2FnZVwiKVxuICAgICAgICBtZXNzYWdlT2JqZWN0LmNoYXJhY3RlciA9IG51bGxcbiAgICAgICAgbWVzc2FnZU9iamVjdC5ldmVudHMub2ZmIFwiZmluaXNoXCIsIGUuaGFuZGxlclxuICAgICAgICBAaXNXYWl0aW5nID0gbm9cbiAgICAgICAgQHdhaXRpbmdGb3IubWVzc2FnZU5WTCA9IG51bGxcbiAgICAgICAgaWYgbWVzc2FnZU9iamVjdC52b2ljZT8gYW5kIEdhbWVNYW5hZ2VyLnNldHRpbmdzLnNraXBWb2ljZU9uQWN0aW9uXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuc3RvcFNvdW5kKG1lc3NhZ2VPYmplY3Qudm9pY2UubmFtZSlcbiAgICAgXG4gICAgIyMjKlxuICAgICogSWRsZVxuICAgICogQG1ldGhvZCBjb21tYW5kSWRsZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kSWRsZTogLT5cbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFN0YXJ0IFRpbWVyXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTdGFydFRpbWVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kU3RhcnRUaW1lcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgdGltZXJzID0gc2NlbmUudGltZXJzXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0aW1lciA9IHRpbWVyc1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB0aW1lcj9cbiAgICAgICAgICAgIHRpbWVyID0gbmV3IGdzLk9iamVjdF9JbnRlcnZhbFRpbWVyKClcbiAgICAgICAgICAgIHRpbWVyc1tudW1iZXJdID0gdGltZXJcbiAgICAgICAgICAgIFxuICAgICAgICB0aW1lci5ldmVudHMub2ZmQnlPd25lcihcImVsYXBzZWRcIiwgQG9iamVjdClcbiAgICAgICAgdGltZXIuZXZlbnRzLm9uKFwiZWxhcHNlZFwiLCAoZSkgPT5cbiAgICAgICAgICAgIHBhcmFtcyA9IGUuZGF0YS5wYXJhbXNcbiAgICAgICAgICAgIHN3aXRjaCBwYXJhbXMuYWN0aW9uLnR5cGVcbiAgICAgICAgICAgICAgICB3aGVuIDAgIyBKdW1wIFRvIExhYmVsXG4gICAgICAgICAgICAgICAgICAgIGlmIHBhcmFtcy5sYWJlbEluZGV4P1xuICAgICAgICAgICAgICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmludGVycHJldGVyLnBvaW50ZXIgPSBwYXJhbXMubGFiZWxJbmRleFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuaW50ZXJwcmV0ZXIuanVtcFRvTGFiZWwocGFyYW1zLmFjdGlvbi5kYXRhLmxhYmVsKVxuICAgICAgICAgICAgICAgIHdoZW4gMSAjIENhbGwgQ29tbW9uIEV2ZW50XG4gICAgICAgICAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5pbnRlcnByZXRlci5jYWxsQ29tbW9uRXZlbnQocGFyYW1zLmFjdGlvbi5kYXRhLmNvbW1vbkV2ZW50SWQpXG4gICAgICAgIHsgcGFyYW1zOiBAcGFyYW1zIH0sIEBvYmplY3QpXG4gICAgICAgIFxuICAgICAgICB0aW1lci5iZWhhdmlvci5pbnRlcnZhbCA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5pbnRlcnZhbClcbiAgICAgICAgdGltZXIuYmVoYXZpb3Iuc3RhcnQoKVxuICAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZXN1bWUgVGltZXJcbiAgICAqIEBtZXRob2QgY29tbWFuZFJlc3VtZVRpbWVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kUmVzdW1lVGltZXI6IC0+XG4gICAgICAgIHRpbWVycyA9IFNjZW5lTWFuYWdlci5zY2VuZS50aW1lcnNcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRpbWVyc1tudW1iZXJdPy5iZWhhdmlvci5yZXN1bWUoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBQYXVzZXMgVGltZXJcbiAgICAqIEBtZXRob2QgY29tbWFuZFBhdXNlVGltZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRQYXVzZVRpbWVyOiAtPlxuICAgICAgICB0aW1lcnMgPSBTY2VuZU1hbmFnZXIuc2NlbmUudGltZXJzXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0aW1lcnNbbnVtYmVyXT8uYmVoYXZpb3IucGF1c2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTdG9wIFRpbWVyXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTdG9wVGltZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kU3RvcFRpbWVyOiAtPlxuICAgICAgICB0aW1lcnMgPSBTY2VuZU1hbmFnZXIuc2NlbmUudGltZXJzXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0aW1lcnNbbnVtYmVyXT8uYmVoYXZpb3Iuc3RvcCgpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBXYWl0XG4gICAgKiBAbWV0aG9kIGNvbW1hbmRXYWl0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRXYWl0OiAtPlxuICAgICAgICB0aW1lID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLnRpbWUpIFxuICAgICAgICBcbiAgICAgICAgaWYgdGltZT8gYW5kIHRpbWUgPiAwIGFuZCAhQGludGVycHJldGVyLnByZXZpZXdEYXRhXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSB0aW1lXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIExvb3BcbiAgICAqIEBtZXRob2QgY29tbWFuZExvb3BcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZExvb3A6IC0+XG4gICAgICAgIEBpbnRlcnByZXRlci5sb29wc1tAaW50ZXJwcmV0ZXIuaW5kZW50XSA9IEBpbnRlcnByZXRlci5wb2ludGVyXG4gICAgICAgIEBpbnRlcnByZXRlci5pbmRlbnQrK1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBCcmVhayBMb29wXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRCcmVha0xvb3BcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZEJyZWFrTG9vcDogLT5cbiAgICAgICAgaW5kZW50ID0gQGluZGVudFxuICAgICAgICB3aGlsZSBub3QgQGludGVycHJldGVyLmxvb3BzW2luZGVudF0/IGFuZCBpbmRlbnQgPiAwXG4gICAgICAgICAgICBpbmRlbnQtLVxuICAgICAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5sb29wc1tpbmRlbnRdID0gbnVsbFxuICAgICAgICBAaW50ZXJwcmV0ZXIuaW5kZW50ID0gaW5kZW50XG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdEFkZFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZExpc3RBZGQ6IC0+XG4gICAgICAgIGxpc3QgPSBAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMubGlzdFZhcmlhYmxlKVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMudmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXIgVmFsdWVcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkpXG4gICAgICAgICAgICB3aGVuIDEgIyBTd2l0Y2ggVmFsdWVcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpKVxuICAgICAgICAgICAgd2hlbiAyICMgVGV4dCBWYWx1ZVxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnN0cmluZ1ZhbHVlKSlcbiAgICAgICAgICAgIHdoZW4gMyAjIExpc3QgVmFsdWVcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYWx1ZSkpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5zZXRMaXN0T2JqZWN0VG8oQHBhcmFtcy5saXN0VmFyaWFibGUsIGxpc3QpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdFBvcFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kTGlzdFBvcDogLT5cbiAgICAgICAgbGlzdCA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFyaWFibGUpXG4gICAgICAgIHZhbHVlID0gbGlzdC5wb3AoKSA/IDBcblxuICAgICAgICBAaW50ZXJwcmV0ZXIuc3RvcmVMaXN0VmFsdWUoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgbGlzdCwgdmFsdWUsIEBwYXJhbXMudmFsdWVUeXBlKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0U2hpZnRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZExpc3RTaGlmdDogLT5cbiAgICAgICAgbGlzdCA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFyaWFibGUpXG4gICAgICAgIHZhbHVlID0gbGlzdC5zaGlmdCgpID8gMFxuXG4gICAgICAgIEBpbnRlcnByZXRlci5zdG9yZUxpc3RWYWx1ZShAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBsaXN0LCB2YWx1ZSwgQHBhcmFtcy52YWx1ZVR5cGUpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdEluZGV4T2ZcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZExpc3RJbmRleE9mOiAtPlxuICAgICAgICBsaXN0ID0gQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYXJpYWJsZSlcbiAgICAgICAgdmFsdWUgPSAtMVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMudmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXIgVmFsdWVcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGxpc3QuaW5kZXhPZihAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKSlcbiAgICAgICAgICAgIHdoZW4gMSAjIFN3aXRjaCBWYWx1ZVxuICAgICAgICAgICAgICAgIHZhbHVlID0gbGlzdC5pbmRleE9mKEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKSlcbiAgICAgICAgICAgIHdoZW4gMiAjIFRleHQgVmFsdWVcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGxpc3QuaW5kZXhPZihAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnN0cmluZ1ZhbHVlKSlcbiAgICAgICAgICAgIHdoZW4gMyAjIExpc3QgVmFsdWVcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGxpc3QuaW5kZXhPZihAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMubGlzdFZhbHVlKSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgdmFsdWUpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdENsZWFyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kTGlzdENsZWFyOiAtPlxuICAgICAgICBsaXN0ID0gQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYXJpYWJsZSlcbiAgICAgICAgbGlzdC5sZW5ndGggPSAwXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZExpc3RWYWx1ZUF0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kTGlzdFZhbHVlQXQ6IC0+XG4gICAgICAgIGxpc3QgPSBAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMubGlzdFZhcmlhYmxlKVxuICAgICAgICBpbmRleCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuaW5kZXgpXG4gICAgICAgIFxuICAgICAgICBpZiBpbmRleCA+PSAwIGFuZCBpbmRleCA8IGxpc3QubGVuZ3RoXG4gICAgICAgICAgICB2YWx1ZSA9IGxpc3RbaW5kZXhdID8gMFxuICAgICAgICAgICAgQGludGVycHJldGVyLnN0b3JlTGlzdFZhbHVlKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIGxpc3QsIHZhbHVlLCBAcGFyYW1zLnZhbHVlVHlwZSlcbiAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdFJlbW92ZUF0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgIFxuICAgIGNvbW1hbmRMaXN0UmVtb3ZlQXQ6IC0+XG4gICAgICAgIGxpc3QgPSBAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMubGlzdFZhcmlhYmxlKVxuICAgICAgICBpbmRleCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuaW5kZXgpXG4gICAgICAgIFxuICAgICAgICBpZiBpbmRleCA+PSAwIGFuZCBpbmRleCA8IGxpc3QubGVuZ3RoXG4gICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0SW5zZXJ0QXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgXG4gICAgY29tbWFuZExpc3RJbnNlcnRBdDogLT5cbiAgICAgICAgbGlzdCA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFyaWFibGUpXG4gICAgICAgIGluZGV4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5pbmRleClcbiAgICAgICAgXG4gICAgICAgIGlmIGluZGV4ID49IDAgYW5kIGluZGV4IDwgbGlzdC5sZW5ndGhcbiAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLnZhbHVlVHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIE51bWJlciBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMCwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkpXG4gICAgICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoIFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAwLCBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSkpXG4gICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dCBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMCwgQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5zdHJpbmdWYWx1ZSkpXG4gICAgICAgICAgICAgICAgd2hlbiAzICMgTGlzdCBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMCwgQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYWx1ZSkpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgQGludGVycHJldGVyLnNldExpc3RPYmplY3RUbyhAcGFyYW1zLmxpc3RWYXJpYWJsZSwgbGlzdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0U2V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kTGlzdFNldDogLT5cbiAgICAgICAgbGlzdCA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFyaWFibGUpXG4gICAgICAgIGluZGV4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5pbmRleClcbiAgICAgICAgXG4gICAgICAgIGlmIGluZGV4ID49IDBcbiAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLnZhbHVlVHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIE51bWJlciBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyVmFsdWUpXG4gICAgICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoIFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dCBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuc3RyaW5nVmFsdWUpXG4gICAgICAgICAgICAgICAgd2hlbiAzICMgTGlzdCBWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgQGludGVycHJldGVyLnNldExpc3RPYmplY3RUbyhAcGFyYW1zLmxpc3RWYXJpYWJsZSwgbGlzdCkgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0Q29weVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICBcbiAgICBjb21tYW5kTGlzdENvcHk6IC0+XG4gICAgICAgIGxpc3QgPSBAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMubGlzdFZhcmlhYmxlKVxuICAgICAgICBjb3B5ID0gT2JqZWN0LmRlZXBDb3B5KGxpc3QpXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TGlzdE9iamVjdFRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIGNvcHkpIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0TGVuZ3RoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRMaXN0TGVuZ3RoOiAtPlxuICAgICAgICBsaXN0ID0gQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYXJpYWJsZSlcblxuICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBsaXN0Lmxlbmd0aCkgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdEpvaW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRMaXN0Sm9pbjogLT5cbiAgICAgICAgbGlzdCA9IEBpbnRlcnByZXRlci5saXN0T2JqZWN0T2YoQHBhcmFtcy5saXN0VmFyaWFibGUpXG4gICAgICAgIHZhbHVlID0gaWYgQHBhcmFtcy5vcmRlciA9PSAwIHRoZW4gbGlzdC5qb2luKFwiXCIpIGVsc2UgbGlzdC5yZXZlcnNlKCkuam9pbihcIlwiKVxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgdmFsdWUpIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMaXN0RnJvbVRleHRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRMaXN0RnJvbVRleHQ6IC0+XG4gICAgICAgIHRleHQgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnRleHRWYXJpYWJsZSlcbiAgICAgICAgc2VwYXJhdG9yID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5zZXBhcmF0b3IpXG4gICAgICAgIGxpc3QgPSB0ZXh0LnNwbGl0KHNlcGFyYXRvcilcbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5zZXRMaXN0T2JqZWN0VG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgbGlzdCkgXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZExpc3RTaHVmZmxlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZExpc3RTaHVmZmxlOiAtPlxuICAgICAgICBsaXN0ID0gQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYXJpYWJsZSlcbiAgICAgICAgaWYgbGlzdC5sZW5ndGggPT0gMCB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gW2xpc3QubGVuZ3RoLTEuLjFdXG4gICAgICAgICAgICBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkrMSkpXG4gICAgICAgICAgICB0ZW1waSA9IGxpc3RbaV1cbiAgICAgICAgICAgIHRlbXBqID0gbGlzdFtqXVxuICAgICAgICAgICAgbGlzdFtpXSA9IHRlbXBqXG4gICAgICAgICAgICBsaXN0W2pdID0gdGVtcGlcbiAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTGlzdFNvcnRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgXG4gICAgY29tbWFuZExpc3RTb3J0OiAtPlxuICAgICAgICBsaXN0ID0gQGludGVycHJldGVyLmxpc3RPYmplY3RPZihAcGFyYW1zLmxpc3RWYXJpYWJsZSlcbiAgICAgICAgaWYgbGlzdC5sZW5ndGggPT0gMCB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMuc29ydE9yZGVyXG4gICAgICAgICAgICB3aGVuIDAgIyBBc2NlbmRpbmdcbiAgICAgICAgICAgICAgICBsaXN0LnNvcnQgKGEsIGIpIC0+IFxuICAgICAgICAgICAgICAgICAgICBpZiBhIDwgYiB0aGVuIHJldHVybiAtMVxuICAgICAgICAgICAgICAgICAgICBpZiBhID4gYiB0aGVuIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICB3aGVuIDEgIyBEZXNjZW5kaW5nXG4gICAgICAgICAgICAgICAgbGlzdC5zb3J0IChhLCBiKSAtPlxuICAgICAgICAgICAgICAgICAgICBpZiBhID4gYiB0aGVuIHJldHVybiAtMVxuICAgICAgICAgICAgICAgICAgICBpZiBhIDwgYiB0aGVuIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJlc2V0VmFyaWFibGVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgY29tbWFuZFJlc2V0VmFyaWFibGVzOiAtPlxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy50YXJnZXRcbiAgICAgICAgICAgIHdoZW4gMCAjIEFsbFxuICAgICAgICAgICAgICAgIHJhbmdlID0gbnVsbFxuICAgICAgICAgICAgd2hlbiAxICMgUmFuZ2VcbiAgICAgICAgICAgICAgICByYW5nZSA9IEBwYXJhbXMucmFuZ2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMuc2NvcGVcbiAgICAgICAgICAgIHdoZW4gMCAjIExvY2FsXG4gICAgICAgICAgICAgICAgaWYgQHBhcmFtcy5zY2VuZVxuICAgICAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmNsZWFyTG9jYWxWYXJpYWJsZXMoeyBpZDogQHBhcmFtcy5zY2VuZS51aWQgfSwgQHBhcmFtcy50eXBlLCByYW5nZSlcbiAgICAgICAgICAgIHdoZW4gMSAjIEFsbCBMb2NhbHNcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmNsZWFyTG9jYWxWYXJpYWJsZXMobnVsbCwgQHBhcmFtcy50eXBlLCByYW5nZSlcbiAgICAgICAgICAgIHdoZW4gMiAjIEdsb2JhbFxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuY2xlYXJHbG9iYWxWYXJpYWJsZXMoQHBhcmFtcy50eXBlLCByYW5nZSlcbiAgICAgICAgICAgIHdoZW4gMyAjIFBlcnNpc3RlbnRcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmNsZWFyUGVyc2lzdGVudFZhcmlhYmxlcyhAcGFyYW1zLnR5cGUsIHJhbmdlKVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNhdmVHbG9iYWxEYXRhKClcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VWYXJpYWJsZURvbWFpblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kQ2hhbmdlVmFyaWFibGVEb21haW46IC0+XG4gICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuY2hhbmdlRG9tYWluKEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuZG9tYWluKSlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhbmdlRGVjaW1hbFZhcmlhYmxlc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kQ2hhbmdlRGVjaW1hbFZhcmlhYmxlczogLT4gQGludGVycHJldGVyLmNoYW5nZURlY2ltYWxWYXJpYWJsZXMoQHBhcmFtcywgQHBhcmFtcy5yb3VuZE1ldGhvZClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VOdW1iZXJWYXJpYWJsZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZENoYW5nZU51bWJlclZhcmlhYmxlczogLT5cbiAgICAgICAgc291cmNlID0gMFxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMuc291cmNlXG4gICAgICAgICAgICB3aGVuIDAgIyBDb25zdGFudCBWYWx1ZSAvIFZhcmlhYmxlIFZhbHVlXG4gICAgICAgICAgICAgICAgc291cmNlID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zb3VyY2VWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gMSAjIFJhbmRvbVxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zb3VyY2VSYW5kb20uc3RhcnQpXG4gICAgICAgICAgICAgICAgZW5kID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zb3VyY2VSYW5kb20uZW5kKVxuICAgICAgICAgICAgICAgIGRpZmYgPSBlbmQgLSBzdGFydFxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IE1hdGguZmxvb3Ioc3RhcnQgKyBNYXRoLnJhbmRvbSgpICogKGRpZmYrMSkpXG4gICAgICAgICAgICB3aGVuIDIgIyBQb2ludGVyXG4gICAgICAgICAgICAgICAgc291cmNlID0gQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnNvdXJjZVNjb3BlLCBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnNvdXJjZVJlZmVyZW5jZSktMSwgQHBhcmFtcy5zb3VyY2VSZWZlcmVuY2VEb21haW4pXG4gICAgICAgICAgICB3aGVuIDMgIyBHYW1lIERhdGFcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZkdhbWVEYXRhKEBwYXJhbXMuc291cmNlVmFsdWUxKVxuICAgICAgICAgICAgd2hlbiA0ICMgRGF0YWJhc2UgRGF0YVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mRGF0YWJhc2VEYXRhKEBwYXJhbXMuc291cmNlVmFsdWUxKVxuICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBAcGFyYW1zLnRhcmdldFxuICAgICAgICAgICAgd2hlbiAwICMgVmFyaWFibGVcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIEFkZFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgKyBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFN1YlxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgLSBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMyAjIE11bFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgKiBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gNCAjIERpdlxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgTWF0aC5mbG9vcihAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnRhcmdldFZhcmlhYmxlKSAvIHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gNSAjIE1vZFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgJSBzb3VyY2UpXG4gICAgICAgICAgICB3aGVuIDEgIyBSYW5nZVxuICAgICAgICAgICAgICAgIHNjb3BlID0gQHBhcmFtcy50YXJnZXRTY29wZVxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gQHBhcmFtcy50YXJnZXRSYW5nZS5zdGFydC0xXG4gICAgICAgICAgICAgICAgZW5kID0gQHBhcmFtcy50YXJnZXRSYW5nZS5lbmQtMVxuICAgICAgICAgICAgICAgIGZvciBpIGluIFtzdGFydC4uZW5kXVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMCAjIFNldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGksIHNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIEFkZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGksIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGkpICsgc291cmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgU3ViXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSwgQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSkgLSBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDMgIyBNdWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpLCBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVBdEluZGV4KHNjb3BlLCBpKSAqIHNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gNCAjIERpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZUF0SW5kZXgoc2NvcGUsIGksIE1hdGguZmxvb3IoQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSkgLyBzb3VyY2UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiA1ICMgTW9kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSwgQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChzY29wZSwgaSkgJSBzb3VyY2UpXG4gICAgICAgICAgICB3aGVuIDIgIyBSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICBpbmRleCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlKSAtIDFcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0U2NvcGUsIGluZGV4LCBzb3VyY2UsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBBZGRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZUF0SW5kZXgoQHBhcmFtcy50YXJnZXRTY29wZSwgaW5kZXgsIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZUF0SW5kZXgoQHBhcmFtcy50YXJnZXRTY29wZSwgaW5kZXgsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKSArIHNvdXJjZSwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFN1YlxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pIC0gc291cmNlLCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgTXVsXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0U2NvcGUsIGluZGV4LCBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0U2NvcGUsIGluZGV4LCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbikgKiBzb3VyY2UsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDQgIyBEaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZUF0SW5kZXgoQHBhcmFtcy50YXJnZXRTY29wZSwgaW5kZXgsIE1hdGguZmxvb3IoQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pIC8gc291cmNlKSwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gNSAjIE1vZFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQGludGVycHJldGVyLm51bWJlclZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFNjb3BlLCBpbmRleCwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pICUgc291cmNlLCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VCb29sZWFuVmFyaWFibGVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRDaGFuZ2VCb29sZWFuVmFyaWFibGVzOiAtPlxuICAgICAgICBzb3VyY2UgPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy52YWx1ZSlcblxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy50YXJnZXRcbiAgICAgICAgICAgIHdoZW4gMCAjIFZhcmlhYmxlXG4gICAgICAgICAgICAgICAgaWYgQHBhcmFtcy52YWx1ZSA9PSAyICMgVHJpZ2dlclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnRhcmdldFZhcmlhYmxlKVxuICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgaWYgdGFyZ2V0VmFsdWUgdGhlbiBmYWxzZSBlbHNlIHRydWUpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc291cmNlKVxuICAgICAgICAgICAgd2hlbiAxICMgUmFuZ2VcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IHsgaW5kZXg6IDAsIHNjb3BlOiBAcGFyYW1zLnRhcmdldFJhbmdlU2NvcGUgfVxuICAgICAgICAgICAgICAgIGZvciBpIGluIFsoQHBhcmFtcy5yYW5nZVN0YXJ0LTEpLi4oQHBhcmFtcy5yYW5nZUVuZC0xKV1cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGUuaW5kZXggPSBpXG4gICAgICAgICAgICAgICAgICAgIGlmIEBwYXJhbXMudmFsdWUgPT0gMiAjIFRyaWdnZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFZhbHVlID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKHZhcmlhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKHZhcmlhYmxlLCBpZiB0YXJnZXRWYWx1ZSB0aGVuIGZhbHNlIGVsc2UgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKHZhcmlhYmxlLCBzb3VyY2UpXG4gICAgICAgICAgICB3aGVuIDIgIyBSZWZlcmVuY2VcbiAgICAgICAgICAgICAgICBpbmRleCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlKSAtIDFcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFJhbmdlU2NvcGUsIGluZGV4LCBzb3VyY2UsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VTdHJpbmdWYXJpYWJsZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZENoYW5nZVN0cmluZ1ZhcmlhYmxlczogLT5cbiAgICAgICAgc291cmNlID0gXCJcIlxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy5zb3VyY2VcbiAgICAgICAgICAgIHdoZW4gMCAjIENvbnN0YW50IFRleHRcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBsY3MoQHBhcmFtcy50ZXh0VmFsdWUpXG4gICAgICAgICAgICB3aGVuIDEgIyBWYXJpYWJsZVxuICAgICAgICAgICAgICAgIHNvdXJjZSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuc291cmNlVmFyaWFibGUpXG4gICAgICAgICAgICB3aGVuIDIgIyBEYXRhYmFzZSBEYXRhXG4gICAgICAgICAgICAgICAgc291cmNlID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2ZEYXRhYmFzZURhdGEoQHBhcmFtcy5kYXRhYmFzZURhdGEpXG4gICAgICAgICAgICB3aGVuIDIgIyBTY3JpcHRcbiAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gZXZhbChAcGFyYW1zLnNjcmlwdClcbiAgICAgICAgICAgICAgICBjYXRjaCBleFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPSBcIkVSUjogXCIgKyBleC5tZXNzYWdlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc291cmNlID0gbGNzKEBwYXJhbXMudGV4dFZhbHVlKVxuICAgICAgICAgICAgXG4gICAgICAgIHN3aXRjaCBAcGFyYW1zLnRhcmdldFxuICAgICAgICAgICAgd2hlbiAwICMgVmFyaWFibGVcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIEFkZFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSkgKyBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFRvIFVwcGVyLUNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUpLnRvVXBwZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMyAjIFRvIExvd2VyLUNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUpLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgICAgICAgIHdoZW4gMSAjIFJhbmdlXG4gICAgICAgICAgICAgICAgdmFyaWFibGUgPSB7IGluZGV4OiAwLCBzY29wZTogQHBhcmFtcy50YXJnZXRSYW5nZVNjb3BlIH1cbiAgICAgICAgICAgICAgICBmb3IgaSBpbiBbQHBhcmFtcy5yYW5nZVN0YXJ0LTEuLkBwYXJhbXMucmFuZ2VFbmQtMV1cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGUuaW5kZXggPSBpXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLm9wZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgU2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8odmFyaWFibGUsIHNvdXJjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIEFkZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKHZhcmlhYmxlLCBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZih2YXJpYWJsZSkgKyBzb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDIgIyBUbyBVcHBlci1DYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8odmFyaWFibGUsIEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKHZhcmlhYmxlKS50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgVG8gTG93ZXItQ2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKHZhcmlhYmxlLCBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZih2YXJpYWJsZSkudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHdoZW4gMiAjIFJlZmVyZW5jZVxuICAgICAgICAgICAgICAgIGluZGV4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRSZWZlcmVuY2UpIC0gMVxuICAgICAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLm9wZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICB3aGVuIDAgIyBTZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZUF0SW5kZXgoQHBhcmFtcy50YXJnZXRSYW5nZVNjb3BlLCBpbmRleCwgc291cmNlLCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxICMgQWRkXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZUF0SW5kZXgoQHBhcmFtcy50YXJnZXRSYW5nZVNjb3BlLCBpbmRleCwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0UmFuZ2VTY29wZSwgaW5kZXgsIHRhcmdldFZhbHVlICsgc291cmNlLCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgVG8gVXBwZXItQ2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0UmFuZ2VTY29wZSwgaW5kZXgsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlQXRJbmRleChAcGFyYW1zLnRhcmdldFJhbmdlU2NvcGUsIGluZGV4LCB0YXJnZXRWYWx1ZS50b1VwcGVyQ2FzZSgpLCBAcGFyYW1zLnRhcmdldFJlZmVyZW5jZURvbWFpbilcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgVG8gTG93ZXItQ2FzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVBdEluZGV4KEBwYXJhbXMudGFyZ2V0UmFuZ2VTY29wZSwgaW5kZXgsIEBwYXJhbXMudGFyZ2V0UmVmZXJlbmNlRG9tYWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8oQHBhcmFtcy50YXJnZXRSYW5nZVNjb3BlLCBpbmRleCwgdGFyZ2V0VmFsdWUudG9Mb3dlckNhc2UoKSwgQHBhcmFtcy50YXJnZXRSZWZlcmVuY2VEb21haW4pXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoZWNrU3dpdGNoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kQ2hlY2tTd2l0Y2g6IC0+XG4gICAgICAgIHJlc3VsdCA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnRhcmdldFZhcmlhYmxlKSAmJiBAcGFyYW1zLnZhbHVlXG4gICAgICAgIGlmIHJlc3VsdFxuICAgICAgICAgICAgQGludGVycHJldGVyLnBvaW50ZXIgPSBAcGFyYW1zLmxhYmVsSW5kZXhcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmROdW1iZXJDb25kaXRpb25cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICBcbiAgICBjb21tYW5kTnVtYmVyQ29uZGl0aW9uOiAtPlxuICAgICAgICByZXN1bHQgPSBAaW50ZXJwcmV0ZXIuY29tcGFyZShAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnRhcmdldFZhcmlhYmxlKSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy52YWx1ZSksIEBwYXJhbXMub3BlcmF0aW9uKVxuICAgICAgICBAaW50ZXJwcmV0ZXIuY29uZGl0aW9uc1tAaW50ZXJwcmV0ZXIuaW5kZW50XSA9IHJlc3VsdFxuICAgICAgICBcbiAgICAgICAgaWYgcmVzdWx0XG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaW5kZW50KytcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDb25kaXRpb25cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgXG4gICAgY29tbWFuZENvbmRpdGlvbjogLT5cbiAgICAgICAgc3dpdGNoIEBwYXJhbXMudmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBAaW50ZXJwcmV0ZXIuY29tcGFyZShAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnZhcmlhYmxlKSwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSksIEBwYXJhbXMub3BlcmF0aW9uKVxuICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gQGludGVycHJldGVyLmNvbXBhcmUoQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMudmFyaWFibGUpLCBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSksIEBwYXJhbXMub3BlcmF0aW9uKVxuICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBpbnRlcnByZXRlci5jb21wYXJlKGxjcyhAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnZhcmlhYmxlKSksIGxjcyhAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnRleHRWYWx1ZSkpLCBAcGFyYW1zLm9wZXJhdGlvbilcbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5jb25kaXRpb25zW0BpbnRlcnByZXRlci5pbmRlbnRdID0gcmVzdWx0XG4gICAgICAgIGlmIHJlc3VsdFxuICAgICAgICAgICAgQGludGVycHJldGVyLmluZGVudCsrICAgIFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDb25kaXRpb25FbHNlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgXG4gICAgY29tbWFuZENvbmRpdGlvbkVsc2U6IC0+XG4gICAgICAgIGlmIG5vdCBAaW50ZXJwcmV0ZXIuY29uZGl0aW9uc1tAaW50ZXJwcmV0ZXIuaW5kZW50XVxuICAgICAgICAgICAgQGludGVycHJldGVyLmluZGVudCsrXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ29uZGl0aW9uRWxzZUlmXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICBcbiAgICBjb21tYW5kQ29uZGl0aW9uRWxzZUlmOiAtPlxuICAgICAgICBpZiBub3QgQGludGVycHJldGVyLmNvbmRpdGlvbnNbQGludGVycHJldGVyLmluZGVudF1cbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5jb21tYW5kQ29uZGl0aW9uLmNhbGwodGhpcylcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGVja051bWJlclZhcmlhYmxlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICBcbiAgICBjb21tYW5kQ2hlY2tOdW1iZXJWYXJpYWJsZTogLT5cbiAgICAgICAgcmVzdWx0ID0gQGludGVycHJldGVyLmNvbXBhcmUoQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSksIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMudmFsdWUpLCBAcGFyYW1zLm9wZXJhdGlvbilcbiAgICAgICAgaWYgcmVzdWx0XG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIucG9pbnRlciA9IEBwYXJhbXMubGFiZWxJbmRleFxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoZWNrVGV4dFZhcmlhYmxlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICBcbiAgICBjb21tYW5kQ2hlY2tUZXh0VmFyaWFibGU6IC0+XG4gICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgIHRleHQxID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy50YXJnZXRWYXJpYWJsZSlcbiAgICAgICAgdGV4dDIgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnZhbHVlKVxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy5vcGVyYXRpb25cbiAgICAgICAgICAgIHdoZW4gMCB0aGVuIHJlc3VsdCA9IHRleHQxID09IHRleHQyXG4gICAgICAgICAgICB3aGVuIDEgdGhlbiByZXN1bHQgPSB0ZXh0MSAhPSB0ZXh0MlxuICAgICAgICAgICAgd2hlbiAyIHRoZW4gcmVzdWx0ID0gdGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoXG4gICAgICAgICAgICB3aGVuIDMgdGhlbiByZXN1bHQgPSB0ZXh0MS5sZW5ndGggPj0gdGV4dDIubGVuZ3RoXG4gICAgICAgICAgICB3aGVuIDQgdGhlbiByZXN1bHQgPSB0ZXh0MS5sZW5ndGggPCB0ZXh0Mi5sZW5ndGhcbiAgICAgICAgICAgIHdoZW4gNSB0aGVuIHJlc3VsdCA9IHRleHQxLmxlbmd0aCA8PSB0ZXh0Mi5sZW5ndGhcbiAgICAgICAgICAgIFxuICAgICAgICBpZiByZXN1bHRcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5wb2ludGVyID0gQHBhcmFtcy5sYWJlbEluZGV4XG4gICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZExhYmVsXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgXG4gICAgY29tbWFuZExhYmVsOiAtPiAjIERvZXMgTm90aGluZ1xuICAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRKdW1wVG9MYWJlbFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgICAgXG4gICAgY29tbWFuZEp1bXBUb0xhYmVsOiAtPlxuICAgICAgICBsYWJlbCA9IEBwYXJhbXMubGFiZWxJbmRleCAjQGludGVycHJldGVyLmxhYmVsc1tAcGFyYW1zLm5hbWVdXG4gICAgICAgIGlmIGxhYmVsP1xuICAgICAgICAgICAgQGludGVycHJldGVyLnBvaW50ZXIgPSBsYWJlbFxuICAgICAgICAgICAgQGludGVycHJldGVyLmluZGVudCA9IEBpbnRlcnByZXRlci5vYmplY3QuY29tbWFuZHNbbGFiZWxdLmluZGVudFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuanVtcFRvTGFiZWwoQHBhcmFtcy5uYW1lKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDbGVhck1lc3NhZ2VcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgIFxuICAgIGNvbW1hbmRDbGVhck1lc3NhZ2U6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIG1lc3NhZ2VPYmplY3QgPSBAaW50ZXJwcmV0ZXIudGFyZ2V0TWVzc2FnZSgpXG4gICAgICAgIGlmIG5vdCBtZXNzYWdlT2JqZWN0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBkdXJhdGlvbiA9IDBcbiAgICAgICAgZmFkaW5nID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLm1lc3NhZ2VGYWRpbmdcbiAgICAgICAgaWYgbm90IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZmFkaW5nLmR1cmF0aW9uXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuYW5pbWF0b3IuZGlzYXBwZWFyKGZhZGluZy5hbmltYXRpb24sIGZhZGluZy5lYXNpbmcsIGR1cmF0aW9uLCBncy5DYWxsQmFjayhcIm9uTWVzc2FnZUFEVkNsZWFyXCIsIEBpbnRlcnByZXRlcikpXG5cbiAgICAgICAgQGludGVycHJldGVyLndhaXRGb3JDb21wbGV0aW9uKG1lc3NhZ2VPYmplY3QsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDbG9zZVBhZ2VOVkxcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZENsb3NlUGFnZU5WTDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgbWVzc2FnZU9iamVjdCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VOVkxfbWVzc2FnZVwiKVxuICAgICAgICBpZiBub3QgbWVzc2FnZU9iamVjdD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIG1lc3NhZ2VPYmplY3QubWVzc2FnZS5jbGVhcigpXG4gICAgICAgIFxuICAgICAgICBtZXNzYWdlQm94ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJtZXNzYWdlQm94TlZMXCIpXG4gICAgICAgIGlmIG1lc3NhZ2VCb3ggYW5kIEBwYXJhbXMudmlzaWJsZSAhPSBtZXNzYWdlQm94LnZpc2libGVcbiAgICAgICAgICAgIG1lc3NhZ2VCb3gudmlzaWJsZSA9IG5vXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTWVzc2FnZUJveERlZmF1bHRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRNZXNzYWdlQm94RGVmYXVsdHM6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMubWVzc2FnZUJveFxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuYXBwZWFyRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuYXBwZWFyRHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5kaXNhcHBlYXJEdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5kaXNhcHBlYXJEdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kaXNhcHBlYXJEdXJhdGlvbilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBkZWZhdWx0cy56T3JkZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5hcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5kaXNhcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5kaXNhcHBlYXJBbmltYXRpb25cbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTaG93TWVzc2FnZU5WTFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgY29tbWFuZFNob3dNZXNzYWdlTlZMOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5tZXNzYWdlTW9kZSA9IHZuLk1lc3NhZ2VNb2RlLk5WTFxuICAgICAgICBjaGFyYWN0ZXIgPSBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbQHBhcmFtcy5jaGFyYWN0ZXJJZF1cbiAgXG4gICAgICAgIHNjZW5lLmxheW91dC52aXNpYmxlID0gbm9cbiAgICAgICAgc2NlbmUubGF5b3V0TlZMLnZpc2libGUgPSB5ZXNcbiAgICAgICAgbWVzc2FnZU9iamVjdCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VOVkxfbWVzc2FnZVwiKVxuICAgICAgICBpZiBub3QgbWVzc2FnZU9iamVjdD8gdGhlbiByZXR1cm5cblxuICAgICAgICBAaW50ZXJwcmV0ZXIubWVzc2FnZUJveE9iamVjdCgpPy52aXNpYmxlID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlT2JqZWN0LmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICBtZXNzYWdlT2JqZWN0Lm1lc3NhZ2UuYWRkTWVzc2FnZShsY3NtKEBwYXJhbXMubWVzc2FnZSksIGNoYXJhY3RlciwgIUBwYXJhbXMucGFydGlhbCBhbmQgbWVzc2FnZU9iamVjdC5tZXNzYWdlcy5sZW5ndGggPiAwLCB5ZXMpXG4gICAgICAgIFxuICAgICAgICBpZiBAaW50ZXJwcmV0ZXIubWVzc2FnZVNldHRpbmdzKCkuYmFja2xvZ1xuICAgICAgICAgICAgR2FtZU1hbmFnZXIuYmFja2xvZy5wdXNoKHsgY2hhcmFjdGVyOiBjaGFyYWN0ZXIsIG1lc3NhZ2U6IGxjc20oQHBhcmFtcy5tZXNzYWdlKSwgY2hvaWNlczogW10gfSlcblxuICAgICAgICBtZXNzYWdlT2JqZWN0LmV2ZW50cy5vbiBcImZpbmlzaFwiLCAoZSkgPT4gQGludGVycHJldGVyLm9uTWVzc2FnZU5WTEZpbmlzaChlKVxuXG4gICAgICAgIHZvaWNlU2V0dGluZ3MgPSBHYW1lTWFuYWdlci5zZXR0aW5ncy52b2ljZXNCeUNoYXJhY3RlclttZXNzYWdlT2JqZWN0LmNoYXJhY3Rlcj8uaW5kZXhdXG4gICAgICAgIGlmIEBwYXJhbXMudm9pY2U/IGFuZCBHYW1lTWFuYWdlci5zZXR0aW5ncy52b2ljZUVuYWJsZWQgYW5kICghdm9pY2VTZXR0aW5ncyBvciB2b2ljZVNldHRpbmdzLmVuYWJsZWQpXG4gICAgICAgICAgICBpZiBHYW1lTWFuYWdlci5zZXR0aW5ncy5za2lwVm9pY2VPbkFjdGlvbiBvciBub3QgKEF1ZGlvTWFuYWdlci52b2ljZT8ucGxheWluZylcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0LnZvaWNlID0gQHBhcmFtcy52b2ljZVxuICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5Vm9pY2UoQHBhcmFtcy52b2ljZSkgICAgIFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIudm9pY2UgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0aW5nRm9yLm1lc3NhZ2VOVkwgPSBAcGFyYW1zXG4gICAgXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hvd01lc3NhZ2VcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRTaG93TWVzc2FnZTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUubWVzc2FnZU1vZGUgPSB2bi5NZXNzYWdlTW9kZS5BRFZcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIFxuICAgICAgICBzaG93TWVzc2FnZSA9ID0+XG4gICAgICAgICAgICBjaGFyYWN0ZXIgPSBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbQHBhcmFtcy5jaGFyYWN0ZXJJZF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2NlbmUubGF5b3V0LnZpc2libGUgPSB5ZXNcbiAgICAgICAgICAgIHNjZW5lLmxheW91dE5WTC52aXNpYmxlID0gbm9cbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QgPSBAaW50ZXJwcmV0ZXIudGFyZ2V0TWVzc2FnZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBub3QgbWVzc2FnZU9iamVjdD8gdGhlbiByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2NlbmUuY3VycmVudENoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5vcGFjaXR5ID0gMjU1XG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmV2ZW50cy5vZmZCeU93bmVyKFwiY2FsbENvbW1vbkV2ZW50XCIsIEBpbnRlcnByZXRlcilcbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuZXZlbnRzLm9uKFwiY2FsbENvbW1vbkV2ZW50XCIsIGdzLkNhbGxCYWNrKFwib25DYWxsQ29tbW9uRXZlbnRcIiwgQGludGVycHJldGVyKSwgcGFyYW1zOiBAcGFyYW1zLCBAaW50ZXJwcmV0ZXIpXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmV2ZW50cy5vbmNlKFwiZmluaXNoXCIsIGdzLkNhbGxCYWNrKFwib25NZXNzYWdlQURWRmluaXNoXCIsIEBpbnRlcnByZXRlciksIHBhcmFtczogQHBhcmFtcywgQGludGVycHJldGVyKVxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5ldmVudHMub25jZShcIndhaXRpbmdcIiwgZ3MuQ2FsbEJhY2soXCJvbk1lc3NhZ2VBRFZXYWl0aW5nXCIsIEBpbnRlcnByZXRlciksIHBhcmFtczogQHBhcmFtcywgQGludGVycHJldGVyKSAgIFxuICAgICAgICAgICAgaWYgbWVzc2FnZU9iamVjdC5zZXR0aW5ncy51c2VDaGFyYWN0ZXJDb2xvclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QubWVzc2FnZS5zaG93TWVzc2FnZShAaW50ZXJwcmV0ZXIsIEBwYXJhbXMsIGNoYXJhY3RlcilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0Lm1lc3NhZ2Uuc2hvd01lc3NhZ2UoQGludGVycHJldGVyLCBAcGFyYW1zKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnNldHRpbmdzXG4gICAgICAgICAgICB2b2ljZVNldHRpbmdzID0gc2V0dGluZ3Mudm9pY2VzQnlDaGFyYWN0ZXJbY2hhcmFjdGVyLmluZGV4XVxuICAgICAgXG4gICAgICAgICAgICBpZiBAcGFyYW1zLnZvaWNlPyBhbmQgR2FtZU1hbmFnZXIuc2V0dGluZ3Mudm9pY2VFbmFibGVkIGFuZCAoIXZvaWNlU2V0dGluZ3Mgb3Igdm9pY2VTZXR0aW5ncyA+IDApXG4gICAgICAgICAgICAgICAgaWYgKEdhbWVNYW5hZ2VyLnNldHRpbmdzLnNraXBWb2ljZU9uQWN0aW9uIG9yICFBdWRpb01hbmFnZXIudm9pY2U/LnBsYXlpbmcpIGFuZCAhR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZU9iamVjdC52b2ljZSA9IEBwYXJhbXMudm9pY2VcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5iZWhhdmlvci52b2ljZSA9IEF1ZGlvTWFuYWdlci5wbGF5Vm9pY2UoQHBhcmFtcy52b2ljZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmJlaGF2aW9yLnZvaWNlID0gbnVsbFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLmV4cHJlc3Npb25JZD8gYW5kIGNoYXJhY3Rlcj9cbiAgICAgICAgICAgIGV4cHJlc3Npb24gPSBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlckV4cHJlc3Npb25zW0BwYXJhbXMuZXhwcmVzc2lvbklkIHx8IDBdXG4gICAgICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmNoYXJhY3RlclxuICAgICAgICAgICAgZHVyYXRpb24gPSBpZiAhZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWQoQHBhcmFtcy5maWVsZEZsYWdzLmR1cmF0aW9uKSB0aGVuIEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbikgZWxzZSBkZWZhdWx0cy5leHByZXNzaW9uRHVyYXRpb25cbiAgICAgICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5jaGFuZ2VFYXNpbmcpXG4gICAgICAgICAgICBhbmltYXRpb24gPSBkZWZhdWx0cy5jaGFuZ2VBbmltYXRpb25cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2hhcmFjdGVyLmJlaGF2aW9yLmNoYW5nZUV4cHJlc3Npb24oZXhwcmVzc2lvbiwgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCA9PlxuICAgICAgICAgICAgICAgIHNob3dNZXNzYWdlKClcbiAgICAgICAgICAgIClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2hvd01lc3NhZ2UoKVxuICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0gKEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gPyB5ZXMpIGFuZCAhKEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWUgPT0gMClcbiAgICAgICAgQGludGVycHJldGVyLndhaXRpbmdGb3IubWVzc2FnZUFEViA9IEBwYXJhbXNcbiAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFNldE1lc3NhZ2VBcmVhXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgY29tbWFuZFNldE1lc3NhZ2VBcmVhOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgXG4gICAgICAgIGlmIHNjZW5lLm1lc3NhZ2VBcmVhc1tudW1iZXJdXG4gICAgICAgICAgICBtZXNzYWdlTGF5b3V0ID0gc2NlbmUubWVzc2FnZUFyZWFzW251bWJlcl0ubGF5b3V0XG4gICAgICAgICAgICBtZXNzYWdlTGF5b3V0LmRzdFJlY3QueCA9IEBwYXJhbXMuYm94LnhcbiAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC55ID0gQHBhcmFtcy5ib3gueVxuICAgICAgICAgICAgbWVzc2FnZUxheW91dC5kc3RSZWN0LndpZHRoID0gQHBhcmFtcy5ib3guc2l6ZS53aWR0aFxuICAgICAgICAgICAgbWVzc2FnZUxheW91dC5kc3RSZWN0LmhlaWdodCA9IEBwYXJhbXMuYm94LnNpemUuaGVpZ2h0XG4gICAgICAgICAgICBtZXNzYWdlTGF5b3V0Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRNZXNzYWdlRmFkaW5nXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRNZXNzYWdlRmFkaW5nOiAtPlxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MubWVzc2FnZUZhZGluZyA9IGR1cmF0aW9uOiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pLCBhbmltYXRpb246IEBwYXJhbXMuYW5pbWF0aW9uLCBlYXNpbmc6IGdzLkVhc2luZ3MuZnJvbU9iamVjdChAcGFyYW1zLmVhc2luZylcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTWVzc2FnZVNldHRpbmdzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kTWVzc2FnZVNldHRpbmdzOiAtPlxuICAgICAgICBtZXNzYWdlT2JqZWN0ID0gQGludGVycHJldGVyLnRhcmdldE1lc3NhZ2UoKVxuICAgICAgICBpZiAhbWVzc2FnZU9iamVjdCB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBtZXNzYWdlU2V0dGluZ3MgPSBAaW50ZXJwcmV0ZXIubWVzc2FnZVNldHRpbmdzKClcbiAgICAgICAgXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5hdXRvRXJhc2UpXG4gICAgICAgICAgICBtZXNzYWdlU2V0dGluZ3MuYXV0b0VyYXNlID0gQHBhcmFtcy5hdXRvRXJhc2VcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Mud2FpdEF0RW5kKVxuICAgICAgICAgICAgbWVzc2FnZVNldHRpbmdzLndhaXRBdEVuZCA9IEBwYXJhbXMud2FpdEF0RW5kXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmJhY2tsb2cpXG4gICAgICAgICAgICBtZXNzYWdlU2V0dGluZ3MuYmFja2xvZyA9IEBwYXJhbXMuYmFja2xvZ1xuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmxpbmVIZWlnaHQpXG4gICAgICAgICAgICBtZXNzYWdlU2V0dGluZ3MubGluZUhlaWdodCA9IEBwYXJhbXMubGluZUhlaWdodFxuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmxpbmVTcGFjaW5nKVxuICAgICAgICAgICAgbWVzc2FnZVNldHRpbmdzLmxpbmVTcGFjaW5nID0gQHBhcmFtcy5saW5lU3BhY2luZ1xuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmxpbmVQYWRkaW5nKVxuICAgICAgICAgICAgbWVzc2FnZVNldHRpbmdzLmxpbmVQYWRkaW5nID0gQHBhcmFtcy5saW5lUGFkZGluZ1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5wYXJhZ3JhcGhTcGFjaW5nKVxuICAgICAgICAgICAgbWVzc2FnZVNldHRpbmdzLnBhcmFncmFwaFNwYWNpbmcgPSBAcGFyYW1zLnBhcmFncmFwaFNwYWNpbmdcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MudXNlQ2hhcmFjdGVyQ29sb3IpXG4gICAgICAgICAgICBtZXNzYWdlU2V0dGluZ3MudXNlQ2hhcmFjdGVyQ29sb3IgPSBAcGFyYW1zLnVzZUNoYXJhY3RlckNvbG9yXG4gICAgICAgICAgICBcbiAgICAgICAgbWVzc2FnZU9iamVjdC50ZXh0UmVuZGVyZXIubWluTGluZUhlaWdodCA9IG1lc3NhZ2VTZXR0aW5ncy5saW5lSGVpZ2h0ID8gMFxuICAgICAgICBtZXNzYWdlT2JqZWN0LnRleHRSZW5kZXJlci5saW5lU3BhY2luZyA9IG1lc3NhZ2VTZXR0aW5ncy5saW5lU3BhY2luZyA/IG1lc3NhZ2VPYmplY3QudGV4dFJlbmRlcmVyLmxpbmVTcGFjaW5nXG4gICAgICAgIG1lc3NhZ2VPYmplY3QudGV4dFJlbmRlcmVyLnBhZGRpbmcgPSBtZXNzYWdlU2V0dGluZ3MubGluZVBhZGRpbmcgPyBtZXNzYWdlT2JqZWN0LnRleHRSZW5kZXJlci5wYWRkaW5nXG4gICAgICAgIFxuICAgICAgICBmb250TmFtZSA9IGlmICFpc0xvY2tlZChmbGFncy5mb250KSB0aGVuIEBwYXJhbXMuZm9udCBlbHNlIG1lc3NhZ2VPYmplY3QuZm9udC5uYW1lXG4gICAgICAgIGZvbnRTaXplID0gaWYgIWlzTG9ja2VkKGZsYWdzLnNpemUpIHRoZW4gQHBhcmFtcy5zaXplIGVsc2UgbWVzc2FnZU9iamVjdC5mb250LnNpemVcbiAgICAgICAgZm9udCA9IG1lc3NhZ2VPYmplY3QuZm9udFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZm9udCkgb3IgIWlzTG9ja2VkKGZsYWdzLnNpemUpXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQgPSBuZXcgRm9udChmb250TmFtZSwgZm9udFNpemUpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmJvbGQpXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuYm9sZCA9IEBwYXJhbXMuYm9sZFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuaXRhbGljKVxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5mb250Lml0YWxpYyA9IEBwYXJhbXMuaXRhbGljXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5zbWFsbENhcHMpXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuc21hbGxDYXBzID0gQHBhcmFtcy5zbWFsbENhcHNcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnVuZGVybGluZSlcbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC51bmRlcmxpbmUgPSBAcGFyYW1zLnVuZGVybGluZVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Muc3RyaWtlVGhyb3VnaClcbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC5zdHJpa2VUaHJvdWdoID0gQHBhcmFtcy5zdHJpa2VUaHJvdWdoXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5jb2xvcilcbiAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC5jb2xvciA9IG5ldyBDb2xvcihAcGFyYW1zLmNvbG9yKVxuICAgICAgICAgICAgXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC5jb2xvciA9IGlmIGZsYWdzLmNvbG9yPyBhbmQgIWlzTG9ja2VkKGZsYWdzLmNvbG9yKSB0aGVuIG5ldyBDb2xvcihAcGFyYW1zLmNvbG9yKSBlbHNlIGZvbnQuY29sb3JcbiAgICAgICAgbWVzc2FnZU9iamVjdC5mb250LmJvcmRlciA9IGlmIGZsYWdzLm91dGxpbmU/IGFuZCAhaXNMb2NrZWQoZmxhZ3Mub3V0bGluZSkgdGhlbiBAcGFyYW1zLm91dGxpbmUgZWxzZSBmb250LmJvcmRlclxuICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuYm9yZGVyQ29sb3IgPSBpZiBmbGFncy5vdXRsaW5lQ29sb3I/IGFuZCAhaXNMb2NrZWQoZmxhZ3Mub3V0bGluZUNvbG9yKSB0aGVuIG5ldyBDb2xvcihAcGFyYW1zLm91dGxpbmVDb2xvcikgZWxzZSBuZXcgQ29sb3IoZm9udC5ib3JkZXJDb2xvcilcbiAgICAgICAgbWVzc2FnZU9iamVjdC5mb250LmJvcmRlclNpemUgPSBpZiBmbGFncy5vdXRsaW5lU2l6ZT8gYW5kICFpc0xvY2tlZChmbGFncy5vdXRsaW5lU2l6ZSkgdGhlbiAoQHBhcmFtcy5vdXRsaW5lU2l6ZSA/IDQpIGVsc2UgZm9udC5ib3JkZXJTaXplXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC5zaGFkb3cgPSBpZiBmbGFncy5zaGFkb3c/IGFuZCAhaXNMb2NrZWQoZmxhZ3Muc2hhZG93KXRoZW4gQHBhcmFtcy5zaGFkb3cgZWxzZSBmb250LnNoYWRvd1xuICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuc2hhZG93Q29sb3IgPSBpZiBmbGFncy5zaGFkb3dDb2xvcj8gYW5kICFpc0xvY2tlZChmbGFncy5zaGFkb3dDb2xvcikgdGhlbiBuZXcgQ29sb3IoQHBhcmFtcy5zaGFkb3dDb2xvcikgZWxzZSBuZXcgQ29sb3IoZm9udC5zaGFkb3dDb2xvcilcbiAgICAgICAgbWVzc2FnZU9iamVjdC5mb250LnNoYWRvd09mZnNldFggPSBpZiBmbGFncy5zaGFkb3dPZmZzZXRYPyBhbmQgIWlzTG9ja2VkKGZsYWdzLnNoYWRvd09mZnNldFgpIHRoZW4gKEBwYXJhbXMuc2hhZG93T2Zmc2V0WCA/IDEpIGVsc2UgZm9udC5zaGFkb3dPZmZzZXRYXG4gICAgICAgIG1lc3NhZ2VPYmplY3QuZm9udC5zaGFkb3dPZmZzZXRZID0gaWYgZmxhZ3Muc2hhZG93T2Zmc2V0WT8gYW5kICFpc0xvY2tlZChmbGFncy5zaGFkb3dPZmZzZXRZKSB0aGVuIChAcGFyYW1zLnNoYWRvd09mZnNldFkgPyAxKSBlbHNlIGZvbnQuc2hhZG93T2Zmc2V0WVxuICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuYm9sZCA9IGZvbnQuYm9sZFxuICAgICAgICBtZXNzYWdlT2JqZWN0LmZvbnQuaXRhbGljID0gZm9udC5pdGFsaWNcbiAgICAgICAgbWVzc2FnZU9iamVjdC5mb250LnNtYWxsQ2FwcyA9IGZvbnQuc21hbGxDYXBzXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDcmVhdGVNZXNzYWdlQXJlYVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZENyZWF0ZU1lc3NhZ2VBcmVhOiAtPlxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlTWVzc2FnZUFyZWFEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIGlmICFzY2VuZS5tZXNzYWdlQXJlYXNbbnVtYmVyXVxuICAgICAgICAgICAgbWVzc2FnZUFyZWEgPSBuZXcgZ3MuT2JqZWN0X01lc3NhZ2VBcmVhKClcbiAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmxheW91dCA9IHVpLlVJTWFuYWdlci5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodHlwZTogXCJ1aS5DdXN0b21HYW1lTWVzc2FnZVwiLCBpZDogXCJjdXN0b21HYW1lTWVzc2FnZV9cIitudW1iZXIsIHBhcmFtczogeyBpZDogXCJjdXN0b21HYW1lTWVzc2FnZV9cIitudW1iZXIgfSwgbWVzc2FnZUFyZWEpXG4gICAgICAgICAgICBtZXNzYWdlQXJlYS5tZXNzYWdlID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJjdXN0b21HYW1lTWVzc2FnZV9cIitudW1iZXIrXCJfbWVzc2FnZVwiKVxuICAgICAgICAgICAgbWVzc2FnZUFyZWEubWVzc2FnZS5kb21haW4gPSBAcGFyYW1zLm51bWJlckRvbWFpblxuICAgICAgICAgICAgbWVzc2FnZUFyZWEuYWRkT2JqZWN0KG1lc3NhZ2VBcmVhLmxheW91dClcbiAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmxheW91dC5kc3RSZWN0LnggPSBAcGFyYW1zLmJveC54XG4gICAgICAgICAgICBtZXNzYWdlQXJlYS5sYXlvdXQuZHN0UmVjdC55ID0gQHBhcmFtcy5ib3gueVxuICAgICAgICAgICAgbWVzc2FnZUFyZWEubGF5b3V0LmRzdFJlY3Qud2lkdGggPSBAcGFyYW1zLmJveC5zaXplLndpZHRoXG4gICAgICAgICAgICBtZXNzYWdlQXJlYS5sYXlvdXQuZHN0UmVjdC5oZWlnaHQgPSBAcGFyYW1zLmJveC5zaXplLmhlaWdodFxuICAgICAgICAgICAgbWVzc2FnZUFyZWEubGF5b3V0Lm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgICAgICBzY2VuZS5tZXNzYWdlQXJlYXNbbnVtYmVyXSA9IG1lc3NhZ2VBcmVhXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kRXJhc2VNZXNzYWdlQXJlYVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZEVyYXNlTWVzc2FnZUFyZWE6IC0+XG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VNZXNzYWdlQXJlYURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgYXJlYSA9IHNjZW5lLm1lc3NhZ2VBcmVhc1tudW1iZXJdIFxuICAgICAgICBhcmVhPy5sYXlvdXQuZGlzcG9zZSgpXG4gICAgICAgIHNjZW5lLm1lc3NhZ2VBcmVhc1tudW1iZXJdID0gbnVsbFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2V0VGFyZ2V0TWVzc2FnZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZFNldFRhcmdldE1lc3NhZ2U6IC0+XG4gICAgICAgIG1lc3NhZ2UgPSBAaW50ZXJwcmV0ZXIudGFyZ2V0TWVzc2FnZSgpXG4gICAgICAgIG1lc3NhZ2U/LnRleHRSZW5kZXJlci5pc1dhaXRpbmcgPSBmYWxzZVxuICAgICAgICBtZXNzYWdlPy5iZWhhdmlvci5pc1dhaXRpbmcgPSBmYWxzZVxuICAgICAgICBcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlTWVzc2FnZUFyZWFEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIHRhcmdldCA9IHsgdHlwZTogQHBhcmFtcy50eXBlLCBpZDogbnVsbCB9XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy50eXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBMYXlvdXQtYmFzZWRcbiAgICAgICAgICAgICAgICB0YXJnZXQuaWQgPSBAcGFyYW1zLmlkXG4gICAgICAgICAgICB3aGVuIDEgIyBDdXN0b21cbiAgICAgICAgICAgICAgICB0YXJnZXQuaWQgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnNldHRpbmdzLm1lc3NhZ2UudGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLmNsZWFyXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIudGFyZ2V0TWVzc2FnZSgpPy5iZWhhdmlvci5jbGVhcigpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRCYWNrbG9nVmlzaWJpbGl0eVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZEJhY2tsb2dWaXNpYmlsaXR5OiAtPlxuICAgICAgICBpZiBAcGFyYW1zLnZpc2libGUgXG4gICAgICAgICAgICBjb250cm9sID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJiYWNrbG9nQm94XCIpXG4gICAgICAgICAgICBpZiBub3QgY29udHJvbD8gdGhlbiBjb250cm9sID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJiYWNrbG9nXCIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGNvbnRyb2w/XG4gICAgICAgICAgICAgICAgY29udHJvbC5kaXNwb3NlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQHBhcmFtcy5iYWNrZ3JvdW5kVmlzaWJsZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IuY3JlYXRlQ29udHJvbCh0aGlzLCB7IGRlc2NyaXB0b3I6IFwidWkuTWVzc2FnZUJhY2tsb2dCb3hcIiB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRyb2wgPSBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IuY3JlYXRlQ29udHJvbCh0aGlzLCB7IGRlc2NyaXB0b3I6IFwidWkuTWVzc2FnZUJhY2tsb2dcIiB9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb250cm9sID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJiYWNrbG9nQm94XCIpXG4gICAgICAgICAgICBpZiBub3QgY29udHJvbD8gdGhlbiBjb250cm9sID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJiYWNrbG9nXCIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRyb2w/LmRpc3Bvc2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1lc3NhZ2VWaXNpYmlsaXR5XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRNZXNzYWdlVmlzaWJpbGl0eTogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5tZXNzYWdlQm94XG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgXG4gICAgICAgIG1lc3NhZ2UgPSBAaW50ZXJwcmV0ZXIudGFyZ2V0TWVzc2FnZSgpXG4gICAgICAgIGlmIG5vdCBtZXNzYWdlPyBvciBAcGFyYW1zLnZpc2libGUgPT0gbWVzc2FnZS52aXNpYmxlIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnZpc2libGVcbiAgICAgICAgICAgIGR1cmF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzLmR1cmF0aW9uKSB0aGVuIEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbikgZWxzZSBkZWZhdWx0cy5hcHBlYXJEdXJhdGlvblxuICAgICAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5hcHBlYXJFYXNpbmcpXG4gICAgICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmFwcGVhckFuaW1hdGlvblxuICAgICAgICAgICAgbWVzc2FnZS5hbmltYXRvci5hcHBlYXIobWVzc2FnZS5kc3RSZWN0LngsIG1lc3NhZ2UuZHN0UmVjdC55LCBAcGFyYW1zLmFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmRpc2FwcGVhckR1cmF0aW9uXG4gICAgICAgICAgICBlYXNpbmcgPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJlYXNpbmcudHlwZVwiXSkgdGhlbiBncy5FYXNpbmdzLmZyb21PYmplY3QoQHBhcmFtcy5lYXNpbmcpIGVsc2UgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KGRlZmF1bHRzLmRpc2FwcGVhckVhc2luZylcbiAgICAgICAgICAgIGFuaW1hdGlvbiA9IGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIEBwYXJhbXMuYW5pbWF0aW9uIGVsc2UgZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgICAgICBtZXNzYWdlLmFuaW1hdG9yLmRpc2FwcGVhcihhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIC0+IG1lc3NhZ2UudmlzaWJsZSA9IG5vKVxuICAgICAgICBtZXNzYWdlLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1lc3NhZ2VCb3hWaXNpYmlsaXR5XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRNZXNzYWdlQm94VmlzaWJpbGl0eTogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5tZXNzYWdlQm94XG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgbWVzc2FnZUJveCA9IEBpbnRlcnByZXRlci5tZXNzYWdlQm94T2JqZWN0KEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuaWQpKVxuICAgICAgICB2aXNpYmxlID0gQHBhcmFtcy52aXNpYmxlID09IDFcbiAgICAgICAgaWYgbm90IG1lc3NhZ2VCb3g/IG9yIHZpc2libGUgPT0gbWVzc2FnZUJveC52aXNpYmxlIHRoZW4gcmV0dXJuXG4gIFxuICAgICAgICBpZiBAcGFyYW1zLnZpc2libGVcbiAgICAgICAgICAgIGR1cmF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzLmR1cmF0aW9uKSB0aGVuIEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbikgZWxzZSBkZWZhdWx0cy5hcHBlYXJEdXJhdGlvblxuICAgICAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5hcHBlYXJFYXNpbmcpXG4gICAgICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmFwcGVhckFuaW1hdGlvblxuICAgICAgICAgICAgbWVzc2FnZUJveC5hbmltYXRvci5hcHBlYXIobWVzc2FnZUJveC5kc3RSZWN0LngsIG1lc3NhZ2VCb3guZHN0UmVjdC55LCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGR1cmF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzLmR1cmF0aW9uKSB0aGVuIEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbikgZWxzZSBkZWZhdWx0cy5kaXNhcHBlYXJEdXJhdGlvblxuICAgICAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5kaXNhcHBlYXJFYXNpbmcpXG4gICAgICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmRpc2FwcGVhckFuaW1hdGlvblxuICAgICAgICAgICAgbWVzc2FnZUJveC5hbmltYXRvci5kaXNhcHBlYXIoYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCAtPiBtZXNzYWdlQm94LnZpc2libGUgPSBubylcbiAgICAgICAgbWVzc2FnZUJveC51cGRhdGUoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRVSUFjY2Vzc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kVUlBY2Nlc3M6IC0+XG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5nZW5lcmFsTWVudSlcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5tZW51QWNjZXNzID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuZ2VuZXJhbE1lbnUpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5zYXZlTWVudSlcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5zYXZlTWVudUFjY2VzcyA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnNhdmVNZW51KVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MubG9hZE1lbnUpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MubG9hZE1lbnVBY2Nlc3MgPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5sb2FkTWVudSlcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmJhY2tsb2cpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MuYmFja2xvZ0FjY2VzcyA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLmJhY2tsb2cpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRVbmxvY2tDR1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgIFxuICAgIGNvbW1hbmRVbmxvY2tDRzogLT5cbiAgICAgICAgY2cgPSBSZWNvcmRNYW5hZ2VyLmNnR2FsbGVyeVtAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLmNnSWQpXVxuICAgICAgICBcbiAgICAgICAgaWYgY2c/XG4gICAgICAgICAgICBHYW1lTWFuYWdlci5nbG9iYWxEYXRhLmNnR2FsbGVyeVtjZy5pbmRleF0gPSB7IHVubG9ja2VkOiB5ZXMgfVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2F2ZUdsb2JhbERhdGEoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMMkRNb3ZlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICBcbiAgICBjb21tYW5kTDJETW92ZTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXIgaW5zdGFuY2VvZiB2bi5PYmplY3RfTGl2ZTJEQ2hhcmFjdGVyIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIubW92ZU9iamVjdChjaGFyYWN0ZXIsIEBwYXJhbXMucG9zaXRpb24sIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEwyRE1vdGlvbkdyb3VwXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgY29tbWFuZEwyRE1vdGlvbkdyb3VwOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBjaGFyYWN0ZXIgPSBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSA9PiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gQHBhcmFtcy5jaGFyYWN0ZXJJZCBcbiAgICAgICAgaWYgbm90IGNoYXJhY3RlciBpbnN0YW5jZW9mIHZuLk9iamVjdF9MaXZlMkRDaGFyYWN0ZXIgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGNoYXJhY3Rlci5tb3Rpb25Hcm91cCA9IHsgbmFtZTogQHBhcmFtcy5kYXRhLm1vdGlvbkdyb3VwLCBsb29wOiBAcGFyYW1zLmxvb3AsIHBsYXlUeXBlOiBAcGFyYW1zLnBsYXlUeXBlIH1cbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IEBwYXJhbXMubG9vcFxuICAgICAgICAgICAgbW90aW9ucyA9IGNoYXJhY3Rlci5tb2RlbC5tb3Rpb25zQnlHcm91cFtjaGFyYWN0ZXIubW90aW9uR3JvdXAubmFtZV1cbiAgICAgICAgICAgIGlmIG1vdGlvbnM/XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IG1vdGlvbnMuc3VtIChtKSAtPiBtLmdldER1cmF0aW9uTVNlYygpIC8gMTYuNlxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMMkRNb3Rpb25cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRMMkRNb3Rpb246IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMubGl2ZTJkXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXIgaW5zdGFuY2VvZiB2bi5PYmplY3RfTGl2ZTJEQ2hhcmFjdGVyIHRoZW4gcmV0dXJuXG4gICAgICAgIGZhZGVJblRpbWUgPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZmFkZUluVGltZSkgdGhlbiBAcGFyYW1zLmZhZGVJblRpbWUgZWxzZSBkZWZhdWx0cy5tb3Rpb25GYWRlSW5UaW1lXG4gICAgICAgIGNoYXJhY3Rlci5tb3Rpb24gPSB7IG5hbWU6IEBwYXJhbXMuZGF0YS5tb3Rpb24sIGZhZGVJblRpbWU6IGZhZGVJblRpbWUsIGxvb3A6IEBwYXJhbXMubG9vcCB9XG4gICAgICAgIGNoYXJhY3Rlci5tb3Rpb25Hcm91cCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCBAcGFyYW1zLmxvb3BcbiAgICAgICAgICAgIG1vdGlvbiA9IGNoYXJhY3Rlci5tb2RlbC5tb3Rpb25zW2NoYXJhY3Rlci5tb3Rpb24ubmFtZV1cbiAgICAgICAgICAgIGlmIG1vdGlvbj9cbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gbW90aW9uLmdldER1cmF0aW9uTVNlYygpIC8gMTYuNlxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMMkRFeHByZXNzaW9uXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRMMkRFeHByZXNzaW9uOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmxpdmUyZFxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGNoYXJhY3RlciA9IHNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBAcGFyYW1zLmNoYXJhY3RlcklkIFxuICAgICAgICBpZiBub3QgY2hhcmFjdGVyIGluc3RhbmNlb2Ygdm4uT2JqZWN0X0xpdmUyRENoYXJhY3RlciB0aGVuIHJldHVyblxuICAgICAgICBmYWRlSW5UaW1lID0gaWYgIWlzTG9ja2VkKGZsYWdzLmZhZGVJblRpbWUpIHRoZW4gQHBhcmFtcy5mYWRlSW5UaW1lIGVsc2UgZGVmYXVsdHMuZXhwcmVzc2lvbkZhZGVJblRpbWVcbiAgICAgICAgXG4gICAgICAgIGNoYXJhY3Rlci5leHByZXNzaW9uID0geyBuYW1lOiBAcGFyYW1zLmRhdGEuZXhwcmVzc2lvbiwgZmFkZUluVGltZTogZmFkZUluVGltZSB9XG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMMkRFeGl0U2NlbmVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgIFxuICAgIGNvbW1hbmRMMkRFeGl0U2NlbmU6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMubGl2ZTJkXG4gICAgICAgIEBpbnRlcnByZXRlci5jb21tYW5kQ2hhcmFjdGVyRXhpdFNjZW5lLmNhbGwodGhpcywgZGVmYXVsdHMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEwyRFNldHRpbmdzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRMMkRTZXR0aW5nczogLT5cbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXI/LnZpc3VhbC5sMmRPYmplY3QgdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MubGlwU3luY1NlbnNpdGl2aXR5KVxuICAgICAgICAgICAgY2hhcmFjdGVyLnZpc3VhbC5sMmRPYmplY3QubGlwU3luY1NlbnNpdGl2aXR5ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5saXBTeW5jU2Vuc2l0aXZpdHkpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5pZGxlSW50ZW5zaXR5KSAgICBcbiAgICAgICAgICAgIGNoYXJhY3Rlci52aXN1YWwubDJkT2JqZWN0LmlkbGVJbnRlbnNpdHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmlkbGVJbnRlbnNpdHkpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5icmVhdGhJbnRlbnNpdHkpXG4gICAgICAgICAgICBjaGFyYWN0ZXIudmlzdWFsLmwyZE9iamVjdC5icmVhdGhJbnRlbnNpdHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmJyZWF0aEludGVuc2l0eSlcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZXllQmxpbmsuZW5hYmxlZFwiXSlcbiAgICAgICAgICAgIGNoYXJhY3Rlci52aXN1YWwubDJkT2JqZWN0LmV5ZUJsaW5rLmVuYWJsZWQgPSBAcGFyYW1zLmV5ZUJsaW5rLmVuYWJsZWRcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZXllQmxpbmsuaW50ZXJ2YWxcIl0pXG4gICAgICAgICAgICBjaGFyYWN0ZXIudmlzdWFsLmwyZE9iamVjdC5leWVCbGluay5ibGlua0ludGVydmFsTXNlYyA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZXllQmxpbmsuaW50ZXJ2YWwpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImV5ZUJsaW5rLmNsb3NlZE1vdGlvblRpbWVcIl0pXG4gICAgICAgICAgICBjaGFyYWN0ZXIudmlzdWFsLmwyZE9iamVjdC5leWVCbGluay5jbG9zZWRNb3Rpb25Nc2VjID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5leWVCbGluay5jbG9zZWRNb3Rpb25UaW1lKVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJleWVCbGluay5jbG9zaW5nTW90aW9uVGltZVwiXSlcbiAgICAgICAgICAgIGNoYXJhY3Rlci52aXN1YWwubDJkT2JqZWN0LmV5ZUJsaW5rLmNsb3NpbmdNb3Rpb25Nc2VjID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5leWVCbGluay5jbG9zaW5nTW90aW9uVGltZSlcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZXllQmxpbmsub3BlbmluZ01vdGlvblRpbWVcIl0pXG4gICAgICAgICAgICBjaGFyYWN0ZXIudmlzdWFsLmwyZE9iamVjdC5leWVCbGluay5vcGVuaW5nTW90aW9uTXNlYyA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZXllQmxpbmsub3BlbmluZ01vdGlvblRpbWUpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMMkRQYXJhbWV0ZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZEwyRFBhcmFtZXRlcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXIgaW5zdGFuY2VvZiB2bi5PYmplY3RfTGl2ZTJEQ2hhcmFjdGVyIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QoQHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICBjaGFyYWN0ZXIuYW5pbWF0b3IubDJkUGFyYW1ldGVyVG8oQHBhcmFtcy5wYXJhbS5uYW1lLCBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnBhcmFtLnZhbHVlKSwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTDJERGVmYXVsdHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZEwyRERlZmF1bHRzOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmxpdmUyZFxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuYXBwZWFyRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuYXBwZWFyRHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5kaXNhcHBlYXJEdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5kaXNhcHBlYXJEdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kaXNhcHBlYXJEdXJhdGlvbilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBkZWZhdWx0cy56T3JkZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLm1vdGlvbkZhZGVJblRpbWUpIHRoZW4gZGVmYXVsdHMubW90aW9uRmFkZUluVGltZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubW90aW9uRmFkZUluVGltZSlcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5hcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5kaXNhcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5kaXNhcHBlYXJBbmltYXRpb25cbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEwyREpvaW5TY2VuZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIGNvbW1hbmRMMkRKb2luU2NlbmU6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMubGl2ZTJkXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgcmVjb3JkID0gUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW0BpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuY2hhcmFjdGVySWQpXVxuICAgICAgICByZXR1cm4gaWYgIXJlY29yZCBvciBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSAtPiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gcmVjb3JkLmluZGV4XG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnBvc2l0aW9uVHlwZSA9PSAxXG4gICAgICAgICAgICB4ID0gQHBhcmFtcy5wb3NpdGlvbi54XG4gICAgICAgICAgICB5ID0gQHBhcmFtcy5wb3NpdGlvbi55XG4gICAgICAgIGVsc2UgaWYgQHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMlxuICAgICAgICAgICAgeCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueClcbiAgICAgICAgICAgIHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnBvc2l0aW9uLnkpXG4gICAgICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dCkgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuYXBwZWFyRWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuYXBwZWFyRHVyYXRpb25cbiAgICAgICAgekluZGV4ID0gaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcikgZWxzZSBkZWZhdWx0cy56T3JkZXJcbiAgICAgICAgYW5pbWF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiYW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gQHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgbW90aW9uQmx1ciA9IGlmICFpc0xvY2tlZChmbGFnc1tcIm1vdGlvbkJsdXIuZW5hYmxlZFwiXSkgdGhlbiBAcGFyYW1zLm1vdGlvbkJsdXIgZWxzZSBkZWZhdWx0cy5tb3Rpb25CbHVyXG4gICAgICAgIG9yaWdpbiA9IGlmICFpc0xvY2tlZChmbGFncy5vcmlnaW4pIHRoZW4gQHBhcmFtcy5vcmlnaW4gZWxzZSBkZWZhdWx0cy5vcmlnaW5cblxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgICAgICBcblxuICAgICAgICBjaGFyYWN0ZXIgPSBuZXcgdm4uT2JqZWN0X0xpdmUyRENoYXJhY3RlcihyZWNvcmQpXG4gICAgICAgIGNoYXJhY3Rlci5tb2RlbE5hbWUgPSBAcGFyYW1zLm1vZGVsPy5uYW1lIHx8IFwiXCJcbiAgICAgICAgY2hhcmFjdGVyLm1vZGVsID0gUmVzb3VyY2VNYW5hZ2VyLmdldExpdmUyRE1vZGVsKFwiTGl2ZTJELyN7Y2hhcmFjdGVyLm1vZGVsTmFtZX1cIilcbiAgICAgICAgY2hhcmFjdGVyLm1vdGlvbiA9IHsgbmFtZTogXCJcIiwgZmFkZUluVGltZTogMCwgbG9vcDogdHJ1ZSB9IGlmIGNoYXJhY3Rlci5tb2RlbC5tb3Rpb25zXG4gICAgICAgICNjaGFyYWN0ZXIuZXhwcmVzc2lvbiA9IHsgbmFtZTogT2JqZWN0LmtleXMoY2hhcmFjdGVyLm1vZGVsLmV4cHJlc3Npb25zKVswXSwgZmFkZUluVGltZTogMCB9IGlmIGNoYXJhY3Rlci5tb2RlbC5leHByZXNzaW9uc1xuICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC54ID0geFxuICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC55ID0geVxuICAgICAgICBjaGFyYWN0ZXIuYW5jaG9yLnggPSBpZiAhb3JpZ2luIHRoZW4gMCBlbHNlIDAuNVxuICAgICAgICBjaGFyYWN0ZXIuYW5jaG9yLnkgPSBpZiAhb3JpZ2luIHRoZW4gMCBlbHNlIDAuNVxuICAgICAgICBcbiAgICAgICAgY2hhcmFjdGVyLmJsZW5kTW9kZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYmxlbmRNb2RlKVxuICAgICAgICBjaGFyYWN0ZXIuem9vbS54ID0gQHBhcmFtcy5wb3NpdGlvbi56b29tLmRcbiAgICAgICAgY2hhcmFjdGVyLnpvb20ueSA9IEBwYXJhbXMucG9zaXRpb24uem9vbS5kXG4gICAgICAgIGNoYXJhY3Rlci56SW5kZXggPSB6SW5kZXggfHwgMjAwXG4gICAgICAgIGNoYXJhY3Rlci5tb2RlbD8ucmVzZXQoKVxuICAgICAgICBjaGFyYWN0ZXIuc2V0dXAoKVxuICAgICAgICBjaGFyYWN0ZXIudmlzdWFsLmwyZE9iamVjdC5pZGxlSW50ZW5zaXR5ID0gcmVjb3JkLmlkbGVJbnRlbnNpdHkgPyAxLjBcbiAgICAgICAgY2hhcmFjdGVyLnZpc3VhbC5sMmRPYmplY3QuYnJlYXRoSW50ZW5zaXR5ID0gcmVjb3JkLmJyZWF0aEludGVuc2l0eSA/IDEuMCBcbiAgICAgICAgY2hhcmFjdGVyLnZpc3VhbC5sMmRPYmplY3QubGlwU3luY1NlbnNpdGl2aXR5ID0gcmVjb3JkLmxpcFN5bmNTZW5zaXRpdml0eSA/IDEuMFxuICAgICAgICBcbiAgICAgICAgY2hhcmFjdGVyLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnBvc2l0aW9uVHlwZSA9PSAwXG4gICAgICAgICAgICBwID0gQGludGVycHJldGVyLnByZWRlZmluZWRPYmplY3RQb3NpdGlvbihAcGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBjaGFyYWN0ZXIsIEBwYXJhbXMpXG4gICAgICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC54ID0gcC54XG4gICAgICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC55ID0gcC55XG4gICAgICAgIFxuICAgICAgICBzY2VuZS5iZWhhdmlvci5hZGRDaGFyYWN0ZXIoY2hhcmFjdGVyLCBubywgeyBhbmltYXRpb246IGFuaW1hdGlvbiwgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNpbmc6IGVhc2luZywgbW90aW9uQmx1cjogbW90aW9uQmx1cn0pXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnZpZXdwb3J0Py50eXBlID09IFwidWlcIlxuICAgICAgICAgICAgY2hhcmFjdGVyLnZpZXdwb3J0ID0gR3JhcGhpY3Mudmlld3BvcnRcbiAgICAgICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFyYWN0ZXJKb2luU2NlbmVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kQ2hhcmFjdGVySm9pblNjZW5lOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmNoYXJhY3RlclxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHJlY29yZCA9IFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyc1tAcGFyYW1zLmNoYXJhY3RlcklkXVxuICAgICAgICByZXR1cm4gaWYgIXJlY29yZCBvciBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSAtPiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gcmVjb3JkLmluZGV4IGFuZCAhdi5kaXNwb3NlZFxuICAgICAgICBcbiAgICAgICAgY2hhcmFjdGVyID0gbmV3IHZuLk9iamVjdF9DaGFyYWN0ZXIocmVjb3JkLCBudWxsLCBzY2VuZSlcbiAgICAgICAgY2hhcmFjdGVyLmV4cHJlc3Npb24gPSBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlckV4cHJlc3Npb25zW0BwYXJhbXMuZXhwcmVzc2lvbklkID8gcmVjb3JkLmRlZmF1bHRFeHByZXNzaW9uSWR8fDBdICNjaGFyYWN0ZXIuZXhwcmVzc2lvblxuICAgICAgICBpZiBjaGFyYWN0ZXIuZXhwcmVzc2lvbj9cbiAgICAgICAgICAgIGJpdG1hcCA9IFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9DaGFyYWN0ZXJzLyN7Y2hhcmFjdGVyLmV4cHJlc3Npb24uaWRsZVswXT8ucmVzb3VyY2UubmFtZX1cIilcbiAgICAgICAgXG4gICAgICAgIG1pcnJvciA9IG5vXG4gICAgICAgIGFuZ2xlID0gMFxuICAgICAgICB6b29tID0gMVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMVxuICAgICAgICAgICAgeCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueClcbiAgICAgICAgICAgIHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnBvc2l0aW9uLnkpXG4gICAgICAgICAgICBtaXJyb3IgPSBAcGFyYW1zLnBvc2l0aW9uLmhvcml6b250YWxGbGlwXG4gICAgICAgICAgICBhbmdsZSA9IEBwYXJhbXMucG9zaXRpb24uYW5nbGV8fDBcbiAgICAgICAgICAgIHpvb20gPSBAcGFyYW1zLnBvc2l0aW9uLmRhdGE/Lnpvb20gfHwgMVxuICAgICAgICBlbHNlIGlmIEBwYXJhbXMucG9zaXRpb25UeXBlID09IDJcbiAgICAgICAgICAgIHggPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnBvc2l0aW9uLngpXG4gICAgICAgICAgICB5ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5wb3NpdGlvbi55KVxuICAgICAgICAgICAgbWlycm9yID0gbm9cbiAgICAgICAgICAgIGFuZ2xlID0gMFxuICAgICAgICAgICAgem9vbSA9IDFcbiAgICAgICAgXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmVhc2luZy50eXBlKSwgQHBhcmFtcy5lYXNpbmcuaW5PdXQpIGVsc2UgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KGRlZmF1bHRzLmFwcGVhckVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmFwcGVhckR1cmF0aW9uXG4gICAgICAgIG9yaWdpbiA9IGlmICFpc0xvY2tlZChmbGFncy5vcmlnaW4pIHRoZW4gQHBhcmFtcy5vcmlnaW4gZWxzZSBkZWZhdWx0cy5vcmlnaW5cbiAgICAgICAgekluZGV4ID0gaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcikgZWxzZSBkZWZhdWx0cy56T3JkZXJcbiAgICAgICAgYW5pbWF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiYW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gQHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgbW90aW9uQmx1ciA9IGlmICFpc0xvY2tlZChmbGFnc1tcIm1vdGlvbkJsdXIuZW5hYmxlZFwiXSkgdGhlbiBAcGFyYW1zLm1vdGlvbkJsdXIgZWxzZSBkZWZhdWx0cy5tb3Rpb25CbHVyXG4gICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmIGNoYXJhY3Rlci5leHByZXNzaW9uP1xuICAgICAgICAgICAgYml0bWFwID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL0NoYXJhY3RlcnMvI3tjaGFyYWN0ZXIuZXhwcmVzc2lvbi5pZGxlWzBdPy5yZXNvdXJjZS5uYW1lfVwiKVxuICAgICAgICAgICAgaWYgQHBhcmFtcy5vcmlnaW4gPT0gMSBhbmQgYml0bWFwP1xuICAgICAgICAgICAgICAgIHggKz0gKGJpdG1hcC53aWR0aCp6b29tLWJpdG1hcC53aWR0aCkvMlxuICAgICAgICAgICAgICAgIHkgKz0gKGJpdG1hcC5oZWlnaHQqem9vbS1iaXRtYXAuaGVpZ2h0KS8yXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGNoYXJhY3Rlci5taXJyb3IgPSBtaXJyb3JcbiAgICAgICAgY2hhcmFjdGVyLmFuY2hvci54ID0gaWYgIW9yaWdpbiB0aGVuIDAgZWxzZSAwLjVcbiAgICAgICAgY2hhcmFjdGVyLmFuY2hvci55ID0gaWYgIW9yaWdpbiB0aGVuIDAgZWxzZSAwLjVcbiAgICAgICAgY2hhcmFjdGVyLnpvb20ueCA9IHpvb21cbiAgICAgICAgY2hhcmFjdGVyLnpvb20ueSA9IHpvb21cbiAgICAgICAgY2hhcmFjdGVyLmRzdFJlY3QueCA9IHhcbiAgICAgICAgY2hhcmFjdGVyLmRzdFJlY3QueSA9IHlcbiAgICAgICAgY2hhcmFjdGVyLnpJbmRleCA9IHpJbmRleCB8fCAgMjAwXG4gICAgICAgIGNoYXJhY3Rlci5ibGVuZE1vZGUgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmJsZW5kTW9kZSlcbiAgICAgICAgY2hhcmFjdGVyLmFuZ2xlID0gYW5nbGVcbiAgICAgICAgY2hhcmFjdGVyLnNldHVwKClcbiAgICAgICAgY2hhcmFjdGVyLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnBvc2l0aW9uVHlwZSA9PSAwXG4gICAgICAgICAgICBwID0gQGludGVycHJldGVyLnByZWRlZmluZWRPYmplY3RQb3NpdGlvbihAcGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBjaGFyYWN0ZXIsIEBwYXJhbXMpXG4gICAgICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC54ID0gcC54XG4gICAgICAgICAgICBjaGFyYWN0ZXIuZHN0UmVjdC55ID0gcC55XG4gICAgICAgIFxuICAgICAgICBzY2VuZS5iZWhhdmlvci5hZGRDaGFyYWN0ZXIoY2hhcmFjdGVyLCBubywgeyBhbmltYXRpb246IGFuaW1hdGlvbiwgZHVyYXRpb246IGR1cmF0aW9uLCBlYXNpbmc6IGVhc2luZywgbW90aW9uQmx1cjogbW90aW9uQmx1cn0pXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnZpZXdwb3J0Py50eXBlID09IFwidWlcIlxuICAgICAgICAgICAgY2hhcmFjdGVyLnZpZXdwb3J0ID0gR3JhcGhpY3Mudmlld3BvcnRcbiAgICAgICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFyYWN0ZXJFeGl0U2NlbmVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kQ2hhcmFjdGVyRXhpdFNjZW5lOiAoZGVmYXVsdHMpIC0+XG4gICAgICAgIGRlZmF1bHRzID0gZGVmYXVsdHMgfHwgR2FtZU1hbmFnZXIuZGVmYXVsdHMuY2hhcmFjdGVyXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGNoYXJhY3RlciA9IHNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBAcGFyYW1zLmNoYXJhY3RlcklkXG4gICAgICAgIFxuICAgICAgICBlYXNpbmcgPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJlYXNpbmcudHlwZVwiXSkgdGhlbiBncy5FYXNpbmdzLmZyb21WYWx1ZXMoQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5lYXNpbmcudHlwZSksIEBwYXJhbXMuZWFzaW5nLmluT3V0KSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5kaXNhcHBlYXJFYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzLmR1cmF0aW9uKSB0aGVuIEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbikgZWxzZSBkZWZhdWx0cy5kaXNhcHBlYXJEdXJhdGlvblxuICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmRpc2FwcGVhckFuaW1hdGlvblxuICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgICAgIFxuICAgICAgICBzY2VuZS5iZWhhdmlvci5yZW1vdmVDaGFyYWN0ZXIoY2hhcmFjdGVyLCB7IGFuaW1hdGlvbjogYW5pbWF0aW9uLCBkdXJhdGlvbjogZHVyYXRpb24sIGVhc2luZzogZWFzaW5nfSkgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhcmFjdGVyQ2hhbmdlRXhwcmVzc2lvblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZENoYXJhY3RlckNoYW5nZUV4cHJlc3Npb246IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGNoYXJhY3RlciA9IHNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBAcGFyYW1zLmNoYXJhY3RlcklkIFxuICAgICAgICBpZiBub3QgY2hhcmFjdGVyPyB0aGVuIHJldHVyblxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmNoYXJhY3RlclxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuZXhwcmVzc2lvbkR1cmF0aW9uXG4gICAgICAgIGV4cHJlc3Npb24gPSBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlckV4cHJlc3Npb25zW0BwYXJhbXMuZXhwcmVzc2lvbklkIHx8IDBdXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbU9iamVjdChAcGFyYW1zLmVhc2luZykgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuY2hhbmdlRWFzaW5nKVxuICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmNoYW5nZUFuaW1hdGlvblxuICAgICAgICBcbiAgICAgICAgY2hhcmFjdGVyLmJlaGF2aW9yLmNoYW5nZUV4cHJlc3Npb24oZXhwcmVzc2lvbiwgQHBhcmFtcy5hbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24pXG5cbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYXJhY3RlclNldFBhcmFtZXRlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kQ2hhcmFjdGVyU2V0UGFyYW1ldGVyOiAtPlxuICAgICAgICBwYXJhbXMgPSBHYW1lTWFuYWdlci5jaGFyYWN0ZXJQYXJhbXNbQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5jaGFyYWN0ZXJJZCldXG4gICAgICAgIGlmIG5vdCBwYXJhbXM/IG9yIG5vdCBAcGFyYW1zLnBhcmFtPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMudmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXIgVmFsdWVcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5wYXJhbS50eXBlXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMCAjIE51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW0BwYXJhbXMucGFyYW0ubmFtZV0gPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBTd2l0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tAcGFyYW1zLnBhcmFtLm5hbWVdID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkgPiAwXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tAcGFyYW1zLnBhcmFtLm5hbWVdID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkudG9TdHJpbmcoKVxuICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoIFZhbHVlXG4gICAgICAgICAgICAgICAgc3dpdGNoIEBwYXJhbXMucGFyYW0udHlwZVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbQHBhcmFtcy5wYXJhbS5uYW1lXSA9IGlmIHZhbHVlIHRoZW4gMSBlbHNlIDBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxICMgU3dpdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbQHBhcmFtcy5wYXJhbS5uYW1lXSA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKSAgICBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tAcGFyYW1zLnBhcmFtLm5hbWVdID0gaWYgdmFsdWUgdGhlbiBcIk9OXCIgZWxzZSBcIk9GRlwiXG4gICAgICAgICAgICB3aGVuIDIgIyBUZXh0IFZhbHVlXG4gICAgICAgICAgICAgICAgc3dpdGNoIEBwYXJhbXMucGFyYW0udHlwZVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy50ZXh0VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbQHBhcmFtcy5wYXJhbS5uYW1lXSA9IHZhbHVlLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBTd2l0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tAcGFyYW1zLnBhcmFtLm5hbWVdID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy50ZXh0VmFsdWUpID09IFwiT05cIlxuICAgICAgICAgICAgICAgICAgICB3aGVuIDIgIyBUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbQHBhcmFtcy5wYXJhbS5uYW1lXSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMudGV4dFZhbHVlKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYXJhY3RlckdldFBhcmFtZXRlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kQ2hhcmFjdGVyR2V0UGFyYW1ldGVyOiAtPlxuICAgICAgICBwYXJhbXMgPSBHYW1lTWFuYWdlci5jaGFyYWN0ZXJQYXJhbXNbQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5jaGFyYWN0ZXJJZCldXG4gICAgICAgIGlmIG5vdCBwYXJhbXM/IG9yIG5vdCBAcGFyYW1zLnBhcmFtPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgdmFsdWUgPSBwYXJhbXNbQHBhcmFtcy5wYXJhbS5uYW1lXVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMudmFsdWVUeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXIgVmFsdWVcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5wYXJhbS50eXBlXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMCAjIE51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMSAjIFN3aXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgaWYgdmFsdWUgdGhlbiAxIGVsc2UgMClcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgaWYgdmFsdWU/IHRoZW4gdmFsdWUubGVuZ3RoIGVsc2UgMClcbiAgICAgICAgICAgIHdoZW4gMSAjIFN3aXRjaCBWYWx1ZVxuICAgICAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLnBhcmFtLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgdmFsdWUgPiAwKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBTd2l0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCB2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHZhbHVlID09IFwiT05cIilcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGVuIDIgIyBUZXh0IFZhbHVlXG4gICAgICAgICAgICAgICAgc3dpdGNoIEBwYXJhbXMucGFyYW0udHlwZVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDAgIyBOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIGlmIHZhbHVlPyB0aGVuIHZhbHVlLnRvU3RyaW5nKCkgZWxzZSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBTd2l0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIGlmIHZhbHVlIHRoZW4gXCJPTlwiIGVsc2UgXCJPRkZcIilcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldFN0cmluZ1ZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhcmFjdGVyTW90aW9uQmx1clxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgIFxuICAgIGNvbW1hbmRDaGFyYWN0ZXJNb3Rpb25CbHVyOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBjaGFyYWN0ZXIgPSBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSA9PiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gQHBhcmFtcy5jaGFyYWN0ZXJJZFxuICAgICAgICBpZiBub3QgY2hhcmFjdGVyPyB0aGVuIHJldHVyblxuXG4gICAgICAgIGNoYXJhY3Rlci5tb3Rpb25CbHVyLnNldChAcGFyYW1zLm1vdGlvbkJsdXIpXG4gICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYXJhY3RlckRlZmF1bHRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRDaGFyYWN0ZXJEZWZhdWx0czogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5jaGFyYWN0ZXJcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmFwcGVhckR1cmF0aW9uKSB0aGVuIGRlZmF1bHRzLmFwcGVhckR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmFwcGVhckR1cmF0aW9uKVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZGlzYXBwZWFyRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZGlzYXBwZWFyRHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5leHByZXNzaW9uRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuZXhwcmVzc2lvbkR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmV4cHJlc3Npb25EdXJhdGlvbilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBkZWZhdWx0cy56T3JkZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5hcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5kaXNhcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5kaXNhcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wibW90aW9uQmx1ci5lbmFibGVkXCJdKSB0aGVuIGRlZmF1bHRzLm1vdGlvbkJsdXIgPSBAcGFyYW1zLm1vdGlvbkJsdXJcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLm9yaWdpbikgdGhlbiBkZWZhdWx0cy5vcmlnaW4gPSBAcGFyYW1zLm9yaWdpblxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYXJhY3RlckVmZmVjdFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIGNvbW1hbmRDaGFyYWN0ZXJFZmZlY3Q6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGNoYXJhY3RlcklkID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5jaGFyYWN0ZXJJZClcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAoYykgLT4gIWMuZGlzcG9zZWQgYW5kIGMucmlkID09IGNoYXJhY3RlcklkXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXI/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIub2JqZWN0RWZmZWN0KGNoYXJhY3RlciwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRGbGFzaENoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgIFxuICAgIGNvbW1hbmRGbGFzaENoYXJhY3RlcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIHJldHVybiBpZiBub3QgY2hhcmFjdGVyXG4gICAgICAgIFxuICAgICAgICBkdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgY2hhcmFjdGVyLmFuaW1hdG9yLmZsYXNoKG5ldyBDb2xvcihAcGFyYW1zLmNvbG9yKSwgZHVyYXRpb24pXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRUaW50Q2hhcmFjdGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kVGludENoYXJhY3RlcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgXG4gICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmVhc2luZy50eXBlKSwgQHBhcmFtcy5lYXNpbmcuaW5PdXQpXG4gICAgICAgIHJldHVybiBpZiBub3QgY2hhcmFjdGVyXG4gICAgICAgIFxuICAgICAgICBkdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgY2hhcmFjdGVyLmFuaW1hdG9yLnRpbnRUbyhAcGFyYW1zLnRvbmUsIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kWm9vbUNoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kWm9vbUNoYXJhY3RlcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgICAgICBcbiAgICAgICAgaWYgbm90IGNoYXJhY3Rlcj8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci56b29tT2JqZWN0KGNoYXJhY3RlciwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUm90YXRlQ2hhcmFjdGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRSb3RhdGVDaGFyYWN0ZXI6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGNoYXJhY3RlciA9IHNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBAcGFyYW1zLmNoYXJhY3RlcklkICAgICAgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXI/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIucm90YXRlT2JqZWN0KGNoYXJhY3RlciwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRCbGVuZENoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRCbGVuZENoYXJhY3RlcjogLT5cbiAgICAgICAgY2hhcmFjdGVyID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBAcGFyYW1zLmNoYXJhY3RlcklkICAgICAgXG4gICAgICAgIGlmIG5vdCBjaGFyYWN0ZXI/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuYmxlbmRPYmplY3QoY2hhcmFjdGVyLCBAcGFyYW1zKSBcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTaGFrZUNoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRTaGFrZUNoYXJhY3RlcjogLT4gXG4gICAgICAgIGNoYXJhY3RlciA9IFNjZW5lTWFuYWdlci5zY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSA9PiAhdi5kaXNwb3NlZCBhbmQgIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgICAgICBcbiAgICAgICAgaWYgbm90IGNoYXJhY3Rlcj8gdGhlbiByZXR1cm5cbiAgICAgICAgQGludGVycHJldGVyLnNoYWtlT2JqZWN0KGNoYXJhY3RlciwgQHBhcmFtcykgIFxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTWFza0NoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRNYXNrQ2hhcmFjdGVyOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBjaGFyYWN0ZXIgPSBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSA9PiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gQHBhcmFtcy5jaGFyYWN0ZXJJZCAgICAgIFxuICAgICAgICBpZiBub3QgY2hhcmFjdGVyPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1hc2tPYmplY3QoY2hhcmFjdGVyLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTW92ZUNoYXJhY3RlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kTW92ZUNoYXJhY3RlcjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgY2hhcmFjdGVyID0gc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IEBwYXJhbXMuY2hhcmFjdGVySWQgICAgICBcbiAgICAgICAgaWYgbm90IGNoYXJhY3Rlcj8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5tb3ZlT2JqZWN0KGNoYXJhY3RlciwgQHBhcmFtcy5wb3NpdGlvbiwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1vdmVDaGFyYWN0ZXJQYXRoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZE1vdmVDaGFyYWN0ZXJQYXRoOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBjaGFyYWN0ZXIgPSBzY2VuZS5jaGFyYWN0ZXJzLmZpcnN0ICh2KSA9PiAhdi5kaXNwb3NlZCBhbmQgdi5yaWQgPT0gQHBhcmFtcy5jaGFyYWN0ZXJJZCAgICAgIFxuICAgICAgICBpZiBub3QgY2hhcmFjdGVyPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1vdmVPYmplY3RQYXRoKGNoYXJhY3RlciwgQHBhcmFtcy5wYXRoLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hha2VCYWNrZ3JvdW5kXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRTaGFrZUJhY2tncm91bmQ6IC0+IFxuICAgICAgICBiYWNrZ3JvdW5kID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJhY2tncm91bmRzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubGF5ZXIpXVxuICAgICAgICBpZiBub3QgYmFja2dyb3VuZD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5zaGFrZU9iamVjdChiYWNrZ3JvdW5kLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG5cbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kU2Nyb2xsQmFja2dyb3VuZDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIGhvcml6b250YWxTcGVlZCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuaG9yaXpvbnRhbFNwZWVkKVxuICAgICAgICB2ZXJ0aWNhbFNwZWVkID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy52ZXJ0aWNhbFNwZWVkKVxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21WYWx1ZXMoQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5lYXNpbmcudHlwZSksIEBwYXJhbXMuZWFzaW5nLmluT3V0KVxuICAgICAgICBsYXllciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubGF5ZXIpXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgXG4gICAgICAgIHNjZW5lLmJhY2tncm91bmRzW2xheWVyXT8uYW5pbWF0b3IubW92ZShob3Jpem9udGFsU3BlZWQsIHZlcnRpY2FsU3BlZWQsIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kVG9cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kVG86IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICB4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5iYWNrZ3JvdW5kLmxvY2F0aW9uLngpXG4gICAgICAgIHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmJhY2tncm91bmQubG9jYXRpb24ueSlcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dClcbiAgICAgICAgbGF5ZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKVxuICAgICAgICBiYWNrZ3JvdW5kID0gc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdXG4gICAgICAgIGlmICFiYWNrZ3JvdW5kIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMFxuICAgICAgICAgICAgcCA9IEBpbnRlcnByZXRlci5wcmVkZWZpbmVkT2JqZWN0UG9zaXRpb24oQHBhcmFtcy5wcmVkZWZpbmVkUG9zaXRpb25JZCwgYmFja2dyb3VuZCwgQHBhcmFtcylcbiAgICAgICAgICAgIHggPSBwLnhcbiAgICAgICAgICAgIHkgPSBwLnlcbiAgICAgXG4gICAgICAgIGJhY2tncm91bmQuYW5pbWF0b3IubW92ZVRvKHgsIHksIGR1cmF0aW9uLCBlYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kUGF0aFxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRTY3JvbGxCYWNrZ3JvdW5kUGF0aDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgYmFja2dyb3VuZCA9IHNjZW5lLmJhY2tncm91bmRzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubGF5ZXIpXVxuICAgICAgICByZXR1cm4gdW5sZXNzIGJhY2tncm91bmQ/XG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIubW92ZU9iamVjdFBhdGgoYmFja2dyb3VuZCwgQHBhcmFtcy5wYXRoLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTWFza0JhY2tncm91bmRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kTWFza0JhY2tncm91bmQ6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGJhY2tncm91bmQgPSBzY2VuZS5iYWNrZ3JvdW5kc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKV1cbiAgICAgICAgcmV0dXJuIHVubGVzcyBiYWNrZ3JvdW5kP1xuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1hc2tPYmplY3QoYmFja2dyb3VuZCwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRab29tQmFja2dyb3VuZFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kWm9vbUJhY2tncm91bmQ6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICB4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy56b29taW5nLngpXG4gICAgICAgIHkgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpvb21pbmcueSlcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dClcbiAgICAgICAgbGF5ZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKVxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgICAgICBcbiAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdPy5hbmltYXRvci56b29tVG8oeCAvIDEwMCwgeSAvIDEwMCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJvdGF0ZUJhY2tncm91bmRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZFJvdGF0ZUJhY2tncm91bmQ6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGJhY2tncm91bmQgPSBzY2VuZS5iYWNrZ3JvdW5kc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKV1cbiAgICAgICAgXG4gICAgICAgIGlmIGJhY2tncm91bmRcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5yb3RhdGVPYmplY3QoYmFja2dyb3VuZCwgQHBhcmFtcylcbiAgICAgICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAgICAgICAgIFxuICAgICMjIyogICAgICAgIFxuICAgICogQG1ldGhvZCBjb21tYW5kVGludEJhY2tncm91bmRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kVGludEJhY2tncm91bmQ6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGxheWVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5sYXllcilcbiAgICAgICAgYmFja2dyb3VuZCA9IHNjZW5lLmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICBpZiBub3QgYmFja2dyb3VuZD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QoQHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIGJhY2tncm91bmQuYW5pbWF0b3IudGludFRvKEBwYXJhbXMudG9uZSwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0Rm9yQ29tcGxldGlvbihiYWNrZ3JvdW5kLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQmxlbmRCYWNrZ3JvdW5kXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZEJsZW5kQmFja2dyb3VuZDogLT5cbiAgICAgICAgbGF5ZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKVxuICAgICAgICBiYWNrZ3JvdW5kID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICBpZiBub3QgYmFja2dyb3VuZD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5ibGVuZE9iamVjdChiYWNrZ3JvdW5kLCBAcGFyYW1zKSBcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRCYWNrZ3JvdW5kRWZmZWN0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kQmFja2dyb3VuZEVmZmVjdDogLT5cbiAgICAgICAgbGF5ZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKVxuICAgICAgICBiYWNrZ3JvdW5kID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICBpZiBub3QgYmFja2dyb3VuZD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5vYmplY3RFZmZlY3QoYmFja2dyb3VuZCwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEJhY2tncm91bmREZWZhdWx0c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIGNvbW1hbmRCYWNrZ3JvdW5kRGVmYXVsdHM6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMuYmFja2dyb3VuZFxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy56T3JkZXIpIHRoZW4gZGVmYXVsdHMuek9yZGVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy56T3JkZXIpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmVhc2luZyA9IEBwYXJhbXMuZWFzaW5nXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmFuaW1hdGlvbiA9IEBwYXJhbXMuYW5pbWF0aW9uXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5vcmlnaW4pIHRoZW4gZGVmYXVsdHMub3JpZ2luID0gQHBhcmFtcy5vcmlnaW5cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmxvb3BIb3Jpem9udGFsKSB0aGVuIGRlZmF1bHRzLmxvb3BIb3Jpem9udGFsID0gQHBhcmFtcy5sb29wSG9yaXpvbnRhbFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MubG9vcFZlcnRpY2FsKSB0aGVuIGRlZmF1bHRzLmxvb3BWZXJ0aWNhbCA9IEBwYXJhbXMubG9vcFZlcnRpY2FsXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQmFja2dyb3VuZE1vdGlvbkJsdXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgIFxuICAgIGNvbW1hbmRCYWNrZ3JvdW5kTW90aW9uQmx1cjogLT5cbiAgICAgICAgbGF5ZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKVxuICAgICAgICBiYWNrZ3JvdW5kID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICBpZiBub3QgYmFja2dyb3VuZD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGJhY2tncm91bmQubW90aW9uQmx1ci5zZXQoQHBhcmFtcy5tb3Rpb25CbHVyKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VCYWNrZ3JvdW5kXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kQ2hhbmdlQmFja2dyb3VuZDogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5iYWNrZ3JvdW5kXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmR1cmF0aW9uXG4gICAgICAgIGxvb3BIID0gaWYgIWlzTG9ja2VkKGZsYWdzLmxvb3BIb3Jpem9udGFsKSB0aGVuIEBwYXJhbXMubG9vcEhvcml6b250YWwgZWxzZSBkZWZhdWx0cy5sb29wSG9yaXpvbnRhbFxuICAgICAgICBsb29wViA9IGlmICFpc0xvY2tlZChmbGFncy5sb29wVmVydGljYWwpIHRoZW4gQHBhcmFtcy5sb29wVmVydGljYWwgZWxzZSBkZWZhdWx0cy5sb29wVmVydGljYWxcbiAgICAgICAgYW5pbWF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiYW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gQHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5hbmltYXRpb25cbiAgICAgICAgb3JpZ2luID0gaWYgIWlzTG9ja2VkKGZsYWdzLm9yaWdpbikgdGhlbiBAcGFyYW1zLm9yaWdpbiBlbHNlIGRlZmF1bHRzLm9yaWdpblxuICAgICAgICB6SW5kZXggPSBpZiAhaXNMb2NrZWQoZmxhZ3Muek9yZGVyKSB0aGVuIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuek9yZGVyKSBlbHNlIGRlZmF1bHRzLnpPcmRlclxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgIFxuICAgICAgICBlYXNpbmcgPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJlYXNpbmcudHlwZVwiXSkgdGhlbiAgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5lYXNpbmcpXG4gICAgICAgIGxheWVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5sYXllcilcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlQmFja2dyb3VuZChAcGFyYW1zLmdyYXBoaWMsIG5vLCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIDAsIDAsIGxheWVyLCBsb29wSCwgbG9vcFYpXG4gICAgICAgIFxuICAgICAgICBpZiBzY2VuZS5iYWNrZ3JvdW5kc1tsYXllcl1cbiAgICAgICAgICAgIGlmIEBwYXJhbXMudmlld3BvcnQ/LnR5cGUgPT0gXCJ1aVwiXG4gICAgICAgICAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLnZpZXdwb3J0ID0gR3JhcGhpY3Mudmlld3BvcnRcbiAgICAgICAgICAgIHNjZW5lLmJhY2tncm91bmRzW2xheWVyXS5hbmNob3IueCA9IGlmIG9yaWdpbiA9PSAwIHRoZW4gMCBlbHNlIDAuNVxuICAgICAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLmFuY2hvci55ID0gaWYgb3JpZ2luID09IDAgdGhlbiAwIGVsc2UgMC41XG4gICAgICAgICAgICBzY2VuZS5iYWNrZ3JvdW5kc1tsYXllcl0uYmxlbmRNb2RlID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5ibGVuZE1vZGUpXG4gICAgICAgICAgICBzY2VuZS5iYWNrZ3JvdW5kc1tsYXllcl0uekluZGV4ID0gekluZGV4XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIG9yaWdpbiA9PSAxXG4gICAgICAgICAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLmRzdFJlY3QueCA9IHNjZW5lLmJhY2tncm91bmRzW2xheWVyXS5kc3RSZWN0LngjICsgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLmJpdG1hcC53aWR0aC8yXG4gICAgICAgICAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLmRzdFJlY3QueSA9IHNjZW5lLmJhY2tncm91bmRzW2xheWVyXS5kc3RSZWN0LnkjICsgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLmJpdG1hcC5oZWlnaHQvMlxuICAgICAgICAgICAgc2NlbmUuYmFja2dyb3VuZHNbbGF5ZXJdLnNldHVwKClcbiAgICAgICAgICAgIHNjZW5lLmJhY2tncm91bmRzW2xheWVyXS51cGRhdGUoKVxuICAgICAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENhbGxTY2VuZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgIFxuICAgIGNvbW1hbmRDYWxsU2NlbmU6IC0+XG4gICAgICAgIEBpbnRlcnByZXRlci5jYWxsU2NlbmUoQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5zY2VuZS51aWQgfHwgQHBhcmFtcy5zY2VuZSkpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYW5nZVNjZW5lXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgXG4gICAgY29tbWFuZENoYW5nZVNjZW5lOiAtPlxuICAgICAgICBpZiBHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiAhQHBhcmFtcy5zYXZlUHJldmlvdXNcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5jbGVhcigpXG4gICAgICAgICAgICBcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgaWYgIUBwYXJhbXMuZXJhc2VQaWN0dXJlcyBhbmQgIUBwYXJhbXMuc2F2ZVByZXZpb3VzXG4gICAgICAgICAgICBzY2VuZS5yZW1vdmVPYmplY3Qoc2NlbmUucGljdHVyZUNvbnRhaW5lcilcbiAgICAgICAgICAgIGZvciBwaWN0dXJlIGluIHNjZW5lLnBpY3R1cmVzXG4gICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmNvbnRleHQucmVtb3ZlKFwiR3JhcGhpY3MvUGljdHVyZXMvI3twaWN0dXJlLmltYWdlfVwiKSBpZiBwaWN0dXJlXG4gICAgICAgIGlmICFAcGFyYW1zLmVyYXNlVGV4dHMgYW5kICFAcGFyYW1zLnNhdmVQcmV2aW91c1xuICAgICAgICAgICAgc2NlbmUucmVtb3ZlT2JqZWN0KHNjZW5lLnRleHRDb250YWluZXIpXG4gICAgICAgIGlmICFAcGFyYW1zLmVyYXNlVmlkZW9zIGFuZCAhQHBhcmFtcy5zYXZlUHJldmlvdXNcbiAgICAgICAgICAgIHNjZW5lLnJlbW92ZU9iamVjdChzY2VuZS52aWRlb0NvbnRhaW5lcilcbiAgICAgICAgICAgIGZvciB2aWRlbyBpbiBzY2VuZS52aWRlb3NcbiAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuY29udGV4dC5yZW1vdmUoXCJNb3ZpZXMvI3t2aWRlby52aWRlb31cIikgaWYgdmlkZW9cbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMuc2NlbmVcbiAgICAgICAgICAgIGlmIEBwYXJhbXMuc2F2ZVByZXZpb3VzXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVEYXRhID0gdWlkOiB1aWQgPSBAcGFyYW1zLnNjZW5lLnVpZCwgcGljdHVyZXM6IFtdLCB0ZXh0czogW10sIHZpZGVvczogW11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZURhdGEgPSB1aWQ6IHVpZCA9IEBwYXJhbXMuc2NlbmUudWlkLCBwaWN0dXJlczogc2NlbmUucGljdHVyZUNvbnRhaW5lci5zdWJPYmplY3RzQnlEb21haW4sIHRleHRzOiBzY2VuZS50ZXh0Q29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpbiwgdmlkZW9zOiBzY2VuZS52aWRlb0NvbnRhaW5lci5zdWJPYmplY3RzQnlEb21haW5cbiAgICAgICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgICAgICBuZXdTY2VuZSA9IG5ldyB2bi5PYmplY3RfU2NlbmUoKVxuICAgICAgICAgICAgaWYgQHBhcmFtcy5zYXZlUHJldmlvdXNcbiAgICAgICAgICAgICAgICBuZXdTY2VuZS5zY2VuZURhdGEgPSB1aWQ6IHVpZCA9IEBwYXJhbXMuc2NlbmUudWlkLCBwaWN0dXJlczogW10sIHRleHRzOiBbXSwgdmlkZW9zOiBbXSwgYmFja2xvZzogR2FtZU1hbmFnZXIuYmFja2xvZ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG5ld1NjZW5lLnNjZW5lRGF0YSA9IHVpZDogdWlkID0gQHBhcmFtcy5zY2VuZS51aWQsIHBpY3R1cmVzOiBzY2VuZS5waWN0dXJlQ29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpbiwgdGV4dHM6IHNjZW5lLnRleHRDb250YWluZXIuc3ViT2JqZWN0c0J5RG9tYWluLCB2aWRlb3M6IHNjZW5lLnZpZGVvQ29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpblxuICAgICAgICAgICAgXG4gICAgICAgICAgICBTY2VuZU1hbmFnZXIuc3dpdGNoVG8obmV3U2NlbmUsIEBwYXJhbXMuc2F2ZVByZXZpb3VzLCA9PiBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0gbm8pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhudWxsKVxuICAgICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUmV0dXJuVG9QcmV2aW91c1NjZW5lXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kUmV0dXJuVG9QcmV2aW91c1NjZW5lOiAtPlxuICAgICAgICBpZiBHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3IHRoZW4gcmV0dXJuXG4gICAgICAgIFNjZW5lTWFuYWdlci5yZXR1cm5Ub1ByZXZpb3VzKD0+IEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSBubylcbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU3dpdGNoVG9MYXlvdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZFN3aXRjaFRvTGF5b3V0OiAtPlxuICAgICAgICBpZiBHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3IHRoZW4gcmV0dXJuXG4gICAgICAgIGlmIHVpLlVJTWFuYWdlci5sYXlvdXRzW0BwYXJhbXMubGF5b3V0Lm5hbWVdP1xuICAgICAgICAgICAgc2NlbmUgPSBuZXcgZ3MuT2JqZWN0X0xheW91dChAcGFyYW1zLmxheW91dC5uYW1lKVxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnN3aXRjaFRvKHNjZW5lLCBAcGFyYW1zLnNhdmVQcmV2aW91cylcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VUcmFuc2l0aW9uXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRDaGFuZ2VUcmFuc2l0aW9uOiAtPlxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pXG4gICAgICAgICAgICBTY2VuZU1hbmFnZXIudHJhbnNpdGlvbkRhdGEuZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5ncmFwaGljKVxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnRyYW5zaXRpb25EYXRhLmdyYXBoaWMgPSBAcGFyYW1zLmdyYXBoaWNcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnZhZ3VlKVxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnRyYW5zaXRpb25EYXRhLnZhZ3VlID0gQHBhcmFtcy52YWd1ZVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRGcmVlemVTY3JlZW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kRnJlZXplU2NyZWVuOiAtPiBcbiAgICAgICAgR3JhcGhpY3MuZnJlZXplKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTY3JlZW5UcmFuc2l0aW9uXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kU2NyZWVuVHJhbnNpdGlvbjogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5zY2VuZVxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIGdyYXBoaWNOYW1lID0gaWYgIWlzTG9ja2VkKGZsYWdzLmdyYXBoaWMpIHRoZW4gQHBhcmFtcy5ncmFwaGljPy5uYW1lIGVsc2UgU2NlbmVNYW5hZ2VyLnRyYW5zaXRpb25EYXRhLmdyYXBoaWM/Lm5hbWVcbiAgICAgICAgXG4gICAgICAgIGlmIGdyYXBoaWNOYW1lXG4gICAgICAgICAgICBiaXRtYXAgPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZ3JhcGhpYykgdGhlbiBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tncmFwaGljTmFtZX1cIikgZWxzZSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tncmFwaGljTmFtZX1cIilcbiAgICAgICAgdmFndWUgPSBpZiAhaXNMb2NrZWQoZmxhZ3MudmFndWUpIHRoZW4gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy52YWd1ZSkgZWxzZSBTY2VuZU1hbmFnZXIudHJhbnNpdGlvbkRhdGEudmFndWVcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIFNjZW5lTWFuYWdlci50cmFuc2l0aW9uRGF0YS5kdXJhdGlvblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9ICFHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3XG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgR3JhcGhpY3MudHJhbnNpdGlvbihkdXJhdGlvbiwgYml0bWFwLCB2YWd1ZSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTaGFrZVNjcmVlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRTaGFrZVNjcmVlbjogLT5cbiAgICAgICAgaWYgbm90IFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydD8gdGhlbiByZXR1cm4gICAgICAgICAgICAgICAgXG4gICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5zaGFrZU9iamVjdChTY2VuZU1hbmFnZXIuc2NlbmUudmlld3BvcnQsIEBwYXJhbXMpICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kVGludFNjcmVlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kVGludFNjcmVlbjogLT5cbiAgICAgICAgZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC5hbmltYXRvci50aW50VG8obmV3IFRvbmUoQHBhcmFtcy50b25lKSwgZHVyYXRpb24sIGdzLkVhc2luZ3MuRUFTRV9MSU5FQVJbMF0pXG4gICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIGR1cmF0aW9uID4gMFxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kWm9vbVNjcmVlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZFpvb21TY3JlZW46IC0+XG4gICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChAcGFyYW1zLmVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0LmFuY2hvci54ID0gMC41XG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC5hbmNob3IueSA9IDAuNVxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUudmlld3BvcnQuYW5pbWF0b3Iuem9vbVRvKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuem9vbWluZy54KSAvIDEwMCwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy56b29taW5nLnkpIC8gMTAwLCBkdXJhdGlvbiwgZWFzaW5nKVxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLndhaXRGb3JDb21wbGV0aW9uKG51bGwsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRQYW5TY3JlZW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICBcbiAgICBjb21tYW5kUGFuU2NyZWVuOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBkdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKVxuICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0dGluZ3Muc2NyZWVuLnBhbi54IC09IEBwYXJhbXMucG9zaXRpb24ueFxuICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0dGluZ3Muc2NyZWVuLnBhbi55IC09IEBwYXJhbXMucG9zaXRpb24ueVxuICAgICAgICB2aWV3cG9ydCA9IFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydFxuXG4gICAgICAgIHZpZXdwb3J0LmFuaW1hdG9yLnNjcm9sbFRvKC1AcGFyYW1zLnBvc2l0aW9uLnggKyB2aWV3cG9ydC5kc3RSZWN0LngsIC1AcGFyYW1zLnBvc2l0aW9uLnkgKyB2aWV3cG9ydC5kc3RSZWN0LnksIGR1cmF0aW9uLCBlYXNpbmcpICBcbiAgICAgICAgQGludGVycHJldGVyLndhaXRGb3JDb21wbGV0aW9uKG51bGwsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJvdGF0ZVNjcmVlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kUm90YXRlU2NyZWVuOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KEBwYXJhbXMuZWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kdXJhdGlvbilcbiAgICAgICAgcGFuID0gQGludGVycHJldGVyLnNldHRpbmdzLnNjcmVlbi5wYW5cblxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUudmlld3BvcnQuYW5jaG9yLnggPSAwLjVcbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0LmFuY2hvci55ID0gMC41XG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC5hbmltYXRvci5yb3RhdGUoQHBhcmFtcy5kaXJlY3Rpb24sIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuc3BlZWQpIC8gMTAwLCBkdXJhdGlvbiwgZWFzaW5nKVxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLndhaXRGb3JDb21wbGV0aW9uKG51bGwsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRGbGFzaFNjcmVlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgIFxuICAgIGNvbW1hbmRGbGFzaFNjcmVlbjogLT5cbiAgICAgICAgZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC5hbmltYXRvci5mbGFzaChuZXcgQ29sb3IoQHBhcmFtcy5jb2xvciksIGR1cmF0aW9uLCBncy5FYXNpbmdzLkVBU0VfTElORUFSWzBdKVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgZHVyYXRpb24gIT0gMFxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb25cbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2NyZWVuRWZmZWN0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgIFxuICAgIGNvbW1hbmRTY3JlZW5FZmZlY3Q6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgZHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pXG4gICAgICAgIGVhc2luZyA9IGdzLkVhc2luZ3MuZnJvbU9iamVjdChAcGFyYW1zLmVhc2luZylcbiAgICAgICAgXG4gICAgICAgIGlmICFncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZChmbGFncy56T3JkZXIpIFxuICAgICAgICAgICAgek9yZGVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy56T3JkZXIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHpPcmRlciA9IFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC56SW5kZXhcbiAgICAgICAgICAgIFxuICAgICAgICB2aWV3cG9ydCA9IHNjZW5lLnZpZXdwb3J0Q29udGFpbmVyLnN1Yk9iamVjdHMuZmlyc3QgKHYpIC0+IHYuekluZGV4ID09IHpPcmRlclxuICAgICAgICBcbiAgICAgICAgaWYgIXZpZXdwb3J0XG4gICAgICAgICAgICB2aWV3cG9ydCA9IG5ldyBncy5PYmplY3RfVmlld3BvcnQoKVxuICAgICAgICAgICAgdmlld3BvcnQuekluZGV4ID0gek9yZGVyXG4gICAgICAgICAgICBzY2VuZS52aWV3cG9ydENvbnRhaW5lci5hZGRPYmplY3Qodmlld3BvcnQpXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy50eXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBXb2JibGVcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC5hbmltYXRvci53b2JibGVUbyhAcGFyYW1zLndvYmJsZS5wb3dlciAvIDEwMDAwLCBAcGFyYW1zLndvYmJsZS5zcGVlZCAvIDEwMCwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgICAgICAgICB3b2JibGUgPSB2aWV3cG9ydC5lZmZlY3RzLndvYmJsZVxuICAgICAgICAgICAgICAgIHdvYmJsZS5lbmFibGVkID0gQHBhcmFtcy53b2JibGUucG93ZXIgPiAwXG4gICAgICAgICAgICAgICAgd29iYmxlLnZlcnRpY2FsID0gQHBhcmFtcy53b2JibGUub3JpZW50YXRpb24gPT0gMCBvciBAcGFyYW1zLndvYmJsZS5vcmllbnRhdGlvbiA9PSAyXG4gICAgICAgICAgICAgICAgd29iYmxlLmhvcml6b250YWwgPSBAcGFyYW1zLndvYmJsZS5vcmllbnRhdGlvbiA9PSAxIG9yIEBwYXJhbXMud29iYmxlLm9yaWVudGF0aW9uID09IDJcbiAgICAgICAgICAgIHdoZW4gMSAjIEJsdXJcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC5hbmltYXRvci5ibHVyVG8oQHBhcmFtcy5ibHVyLnBvd2VyIC8gMTAwLCBkdXJhdGlvbiwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LmVmZmVjdHMuYmx1ci5lbmFibGVkID0geWVzXG4gICAgICAgICAgICB3aGVuIDIgIyBQaXhlbGF0ZVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LmFuaW1hdG9yLnBpeGVsYXRlVG8oQHBhcmFtcy5waXhlbGF0ZS5zaXplLndpZHRoLCBAcGFyYW1zLnBpeGVsYXRlLnNpemUuaGVpZ2h0LCBkdXJhdGlvbiwgZWFzaW5nKVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LmVmZmVjdHMucGl4ZWxhdGUuZW5hYmxlZCA9IHllc1xuICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBkdXJhdGlvbiAhPSAwXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRWaWRlb0RlZmF1bHRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRWaWRlb0RlZmF1bHRzOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnZpZGVvXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5hcHBlYXJEdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5hcHBlYXJEdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5hcHBlYXJEdXJhdGlvbilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmRpc2FwcGVhckR1cmF0aW9uKSB0aGVuIGRlZmF1bHRzLmRpc2FwcGVhckR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmRpc2FwcGVhckR1cmF0aW9uKVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Muek9yZGVyKSB0aGVuIGRlZmF1bHRzLnpPcmRlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuek9yZGVyKVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhcHBlYXJFYXNpbmcudHlwZVwiXSkgdGhlbiBkZWZhdWx0cy5hcHBlYXJFYXNpbmcgPSBAcGFyYW1zLmFwcGVhckVhc2luZ1xuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhcHBlYXJBbmltYXRpb24udHlwZVwiXSkgdGhlbiBkZWZhdWx0cy5hcHBlYXJBbmltYXRpb24gPSBAcGFyYW1zLmFwcGVhckFuaW1hdGlvblxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJkaXNhcHBlYXJFYXNpbmcudHlwZVwiXSkgdGhlbiBkZWZhdWx0cy5kaXNhcHBlYXJFYXNpbmcgPSBAcGFyYW1zLmRpc2FwcGVhckVhc2luZ1xuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJkaXNhcHBlYXJBbmltYXRpb24udHlwZVwiXSkgdGhlbiBkZWZhdWx0cy5kaXNhcHBlYXJBbmltYXRpb24gPSBAcGFyYW1zLmRpc2FwcGVhckFuaW1hdGlvblxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJtb3Rpb25CbHVyLmVuYWJsZWRcIl0pIHRoZW4gZGVmYXVsdHMubW90aW9uQmx1ciA9IEBwYXJhbXMubW90aW9uQmx1clxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Mub3JpZ2luKSB0aGVuIGRlZmF1bHRzLm9yaWdpbiA9IEBwYXJhbXMub3JpZ2luXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hvd1ZpZGVvXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kU2hvd1ZpZGVvOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnZpZGVvXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVmlkZW9Eb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB2aWRlb3MgPSBzY2VuZS52aWRlb3NcbiAgICAgICAgaWYgbm90IHZpZGVvc1tudW1iZXJdPyB0aGVuIHZpZGVvc1tudW1iZXJdID0gbmV3IGdzLk9iamVjdF9WaWRlbygpXG4gICAgICAgIFxuICAgICAgICB4ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5wb3NpdGlvbi54KVxuICAgICAgICB5ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5wb3NpdGlvbi55KVxuICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dCkgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuYXBwZWFyRWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuYXBwZWFyRHVyYXRpb25cbiAgICAgICAgb3JpZ2luID0gaWYgIWlzTG9ja2VkKGZsYWdzLm9yaWdpbikgdGhlbiBAcGFyYW1zLm9yaWdpbiBlbHNlIGRlZmF1bHRzLm9yaWdpblxuICAgICAgICB6SW5kZXggPSBpZiAhaXNMb2NrZWQoZmxhZ3Muek9yZGVyKSB0aGVuIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuek9yZGVyKSBlbHNlIGRlZmF1bHRzLnpPcmRlclxuICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmFwcGVhckFuaW1hdGlvblxuICAgICAgICBcbiAgICAgICAgdmlkZW8gPSB2aWRlb3NbbnVtYmVyXVxuICAgICAgICB2aWRlby5kb21haW4gPSBAcGFyYW1zLm51bWJlckRvbWFpblxuICAgICAgICB2aWRlby52aWRlbyA9IEBwYXJhbXMudmlkZW8/Lm5hbWVcbiAgICAgICAgdmlkZW8ubG9vcCA9IHllc1xuICAgICAgICB2aWRlby5kc3RSZWN0LnggPSB4XG4gICAgICAgIHZpZGVvLmRzdFJlY3QueSA9IHlcbiAgICAgICAgdmlkZW8uYmxlbmRNb2RlID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5ibGVuZE1vZGUpXG4gICAgICAgIHZpZGVvLmFuY2hvci54ID0gaWYgb3JpZ2luID09IDAgdGhlbiAwIGVsc2UgMC41XG4gICAgICAgIHZpZGVvLmFuY2hvci55ID0gaWYgb3JpZ2luID09IDAgdGhlbiAwIGVsc2UgMC41XG4gICAgICAgIHZpZGVvLnpJbmRleCA9IHpJbmRleCB8fCAgKDEwMDAgKyBudW1iZXIpXG4gICAgICAgIGlmIEBwYXJhbXMudmlld3BvcnQ/LnR5cGUgPT0gXCJzY2VuZVwiXG4gICAgICAgICAgICB2aWRlby52aWV3cG9ydCA9IFNjZW5lTWFuYWdlci5zY2VuZS5iZWhhdmlvci52aWV3cG9ydFxuICAgICAgICB2aWRlby51cGRhdGUoKVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMFxuICAgICAgICAgICAgcCA9IEBpbnRlcnByZXRlci5wcmVkZWZpbmVkT2JqZWN0UG9zaXRpb24oQHBhcmFtcy5wcmVkZWZpbmVkUG9zaXRpb25JZCwgdmlkZW8sIEBwYXJhbXMpXG4gICAgICAgICAgICB2aWRlby5kc3RSZWN0LnggPSBwLnhcbiAgICAgICAgICAgIHZpZGVvLmRzdFJlY3QueSA9IHAueVxuICAgICAgICAgICAgXG4gICAgICAgIHZpZGVvLmFuaW1hdG9yLmFwcGVhcih4LCB5LCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24pXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1vdmVWaWRlb1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgY29tbWFuZE1vdmVWaWRlbzogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVmlkZW9Eb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB2aWRlbyA9IHNjZW5lLnZpZGVvc1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB2aWRlbz8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5tb3ZlT2JqZWN0KHZpZGVvLCBAcGFyYW1zLnBpY3R1cmUucG9zaXRpb24sIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRNb3ZlVmlkZW9QYXRoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgY29tbWFuZE1vdmVWaWRlb1BhdGg6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdmlkZW8gPSBzY2VuZS52aWRlb3NbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIubW92ZU9iamVjdFBhdGgodmlkZW8sIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRSb3RhdGVWaWRlb1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kUm90YXRlVmlkZW86IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdmlkZW8gPSBzY2VuZS52aWRlb3NbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIucm90YXRlT2JqZWN0KHZpZGVvLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kWm9vbVZpZGVvXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRab29tVmlkZW86IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdmlkZW8gPSBzY2VuZS52aWRlb3NbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuem9vbU9iamVjdCh2aWRlbywgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEJsZW5kVmlkZW9cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kQmxlbmRWaWRlbzogLT5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICB2aWRlbyA9IFNjZW5lTWFuYWdlci5zY2VuZS52aWRlb3NbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuYmxlbmRPYmplY3QodmlkZW8sIEBwYXJhbXMpIFxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFRpbnRWaWRlb1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kVGludFZpZGVvOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHZpZGVvID0gc2NlbmUudmlkZW9zW251bWJlcl1cbiAgICAgICAgaWYgbm90IHZpZGVvPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnRpbnRPYmplY3QodmlkZW8sIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRGbGFzaFZpZGVvXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRGbGFzaFZpZGVvOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHZpZGVvID0gc2NlbmUudmlkZW9zW251bWJlcl1cbiAgICAgICAgaWYgbm90IHZpZGVvPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmZsYXNoT2JqZWN0KHZpZGVvLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ3JvcFZpZGVvXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRDcm9wVmlkZW86IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdmlkZW8gPSBzY2VuZS52aWRlb3NbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuY3JvcE9iamVjdCh2aWRlbywgQHBhcmFtcylcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kVmlkZW9Nb3Rpb25CbHVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kVmlkZW9Nb3Rpb25CbHVyOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHZpZGVvID0gc2NlbmUudmlkZW9zW251bWJlcl1cbiAgICAgICAgaWYgbm90IHZpZGVvPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm9iamVjdE1vdGlvbkJsdXIodmlkZW8sIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1hc2tWaWRlb1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kTWFza1ZpZGVvOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHZpZGVvID0gc2NlbmUudmlkZW9zW251bWJlcl1cbiAgICAgICAgaWYgbm90IHZpZGVvPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1hc2tPYmplY3QodmlkZW8sIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRWaWRlb0VmZmVjdFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kVmlkZW9FZmZlY3Q6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVZpZGVvRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdmlkZW8gPSBzY2VuZS52aWRlb3NbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdmlkZW8/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIub2JqZWN0RWZmZWN0KHZpZGVvLCBAcGFyYW1zKVxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kRXJhc2VWaWRlb1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgY29tbWFuZEVyYXNlVmlkZW86IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMudmlkZW9cbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHZpZGVvID0gc2NlbmUudmlkZW9zW251bWJlcl1cbiAgICAgICAgaWYgbm90IHZpZGVvPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dCkgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuZGlzYXBwZWFyRWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuZGlzYXBwZWFyRHVyYXRpb25cbiAgICAgICAgYW5pbWF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiYW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gQHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5kaXNhcHBlYXJBbmltYXRpb25cbiAgICAgICAgXG4gICAgICAgIHZpZGVvLmFuaW1hdG9yLmRpc2FwcGVhcihhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIChzZW5kZXIpID0+IFxuICAgICAgICAgICAgc2VuZGVyLmRpc3Bvc2UoKVxuICAgICAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihzZW5kZXIuZG9tYWluKVxuICAgICAgICAgICAgc2NlbmUudmlkZW9zW251bWJlcl0gPSBudWxsXG4gICAgICAgICAgIyAgc2VuZGVyLnZpZGVvLnBhdXNlKClcbiAgICAgICAgKVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvbiBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hvd0ltYWdlTWFwXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICBcbiAgICBjb21tYW5kU2hvd0ltYWdlTWFwOiAtPlxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgaW1hZ2VNYXAgPSBTY2VuZU1hbmFnZXIuc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBpbWFnZU1hcD9cbiAgICAgICAgICAgIGltYWdlTWFwLmRpc3Bvc2UoKVxuICAgICAgICBpbWFnZU1hcCA9IG5ldyBncy5PYmplY3RfSW1hZ2VNYXAoKVxuICAgICAgICBpbWFnZU1hcC52aXN1YWwudmFyaWFibGVDb250ZXh0ID0gQGludGVycHJldGVyLmNvbnRleHRcbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLnBpY3R1cmVzW251bWJlcl0gPSBpbWFnZU1hcFxuICAgICAgICBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tAcGFyYW1zLmdyb3VuZD8ubmFtZX1cIilcbiAgICAgICAgXG4gICAgICAgIGltYWdlTWFwLmRzdFJlY3Qud2lkdGggPSBiaXRtYXAud2lkdGhcbiAgICAgICAgaW1hZ2VNYXAuZHN0UmVjdC5oZWlnaHQgPSBiaXRtYXAuaGVpZ2h0XG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnBvc2l0aW9uVHlwZSA9PSAwXG4gICAgICAgICAgICBwID0gQGludGVycHJldGVyLnByZWRlZmluZWRPYmplY3RQb3NpdGlvbihAcGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBpbWFnZU1hcCwgQHBhcmFtcylcbiAgICAgICAgICAgIGltYWdlTWFwLmRzdFJlY3QueCA9IHAueFxuICAgICAgICAgICAgaW1hZ2VNYXAuZHN0UmVjdC55ID0gcC55XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGltYWdlTWFwLmRzdFJlY3QueCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueClcbiAgICAgICAgICAgIGltYWdlTWFwLmRzdFJlY3QueSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueSlcbiAgICAgICAgICAgIFxuICAgICAgICBpbWFnZU1hcC5hbmNob3IueCA9IGlmIEBwYXJhbXMub3JpZ2luID09IDEgdGhlbiAwLjUgZWxzZSAwXG4gICAgICAgIGltYWdlTWFwLmFuY2hvci55ID0gaWYgQHBhcmFtcy5vcmlnaW4gPT0gMSB0aGVuIDAuNSBlbHNlIDBcbiAgICAgICAgaW1hZ2VNYXAuekluZGV4ID0gaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcikgZWxzZSA0MDBcbiAgICAgICAgaW1hZ2VNYXAuYmxlbmRNb2RlID0gaWYgIWlzTG9ja2VkKGZsYWdzLmJsZW5kTW9kZSkgdGhlbiBAcGFyYW1zLmJsZW5kTW9kZSBlbHNlIDBcbiAgICAgICAgaW1hZ2VNYXAuaG90c3BvdHMgPSBAcGFyYW1zLmhvdHNwb3RzXG4gICAgICAgIGltYWdlTWFwLmltYWdlcyA9IFtcbiAgICAgICAgICAgIEBwYXJhbXMuZ3JvdW5kPy5uYW1lLFxuICAgICAgICAgICAgQHBhcmFtcy5ob3Zlcj8ubmFtZSxcbiAgICAgICAgICAgIEBwYXJhbXMudW5zZWxlY3RlZD8ubmFtZSxcbiAgICAgICAgICAgIEBwYXJhbXMuc2VsZWN0ZWQ/Lm5hbWUsXG4gICAgICAgICAgICBAcGFyYW1zLnNlbGVjdGVkSG92ZXI/Lm5hbWVcbiAgICAgICAgXVxuICAgICAgICBcbiAgICAgICAgaW1hZ2VNYXAuZXZlbnRzLm9uIFwianVtcFRvXCIsIGdzLkNhbGxCYWNrKFwib25KdW1wVG9cIiwgQGludGVycHJldGVyKVxuICAgICAgICBpbWFnZU1hcC5ldmVudHMub24gXCJjYWxsQ29tbW9uRXZlbnRcIiwgZ3MuQ2FsbEJhY2soXCJvbkNhbGxDb21tb25FdmVudFwiLCBAaW50ZXJwcmV0ZXIpXG4gICAgICAgIFxuICAgICAgICBpbWFnZU1hcC5zZXR1cCgpXG4gICAgICAgIGltYWdlTWFwLnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIuc2hvd09iamVjdChpbWFnZU1hcCwge3g6MCwgeTowfSwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb25cbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IDBcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIFxuICAgICAgICBpbWFnZU1hcC5ldmVudHMub24gXCJmaW5pc2hcIiwgKHNlbmRlcikgPT5cbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSBub1xuICAgICAgICAgICAjIEBpbnRlcnByZXRlci5lcmFzZU9iamVjdChzY2VuZS5pbWFnZU1hcCwgQHBhcmFtcylcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kRXJhc2VJbWFnZU1hcFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgICBcbiAgICBjb21tYW5kRXJhc2VJbWFnZU1hcDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgaW1hZ2VNYXAgPSBzY2VuZS5waWN0dXJlc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgIGlmIG5vdCBpbWFnZU1hcD8gdGhlbiByZXR1cm5cbiBcbiAgICAgICAgaW1hZ2VNYXAuZXZlbnRzLmVtaXQoXCJmaW5pc2hcIiwgaW1hZ2VNYXApXG4gICAgICAgIGltYWdlTWFwLnZpc3VhbC5hY3RpdmUgPSBub1xuICAgICAgICBAaW50ZXJwcmV0ZXIuZXJhc2VPYmplY3QoaW1hZ2VNYXAsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRBZGRIb3RzcG90XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgY29tbWFuZEFkZEhvdHNwb3Q6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZUhvdHNwb3REb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBob3RzcG90cyA9IHNjZW5lLmhvdHNwb3RzXG4gICAgIFxuICAgICAgICBpZiBub3QgaG90c3BvdHNbbnVtYmVyXT9cbiAgICAgICAgICAgIGhvdHNwb3RzW251bWJlcl0gPSBuZXcgZ3MuT2JqZWN0X0hvdHNwb3QoKVxuICAgICAgICAgICAgXG4gICAgICAgIGhvdHNwb3QgPSBob3RzcG90c1tudW1iZXJdXG4gICAgICAgIGhvdHNwb3QuZG9tYWluID0gQHBhcmFtcy5udW1iZXJEb21haW5cbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCBAcGFyYW1zLnBvc2l0aW9uVHlwZVxuICAgICAgICAgICAgd2hlbiAwICMgRGlyZWN0XG4gICAgICAgICAgICAgICAgaG90c3BvdC5kc3RSZWN0LnggPSBAcGFyYW1zLmJveC54XG4gICAgICAgICAgICAgICAgaG90c3BvdC5kc3RSZWN0LnkgPSBAcGFyYW1zLmJveC55XG4gICAgICAgICAgICAgICAgaG90c3BvdC5kc3RSZWN0LndpZHRoID0gQHBhcmFtcy5ib3guc2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgIGhvdHNwb3QuZHN0UmVjdC5oZWlnaHQgPSBAcGFyYW1zLmJveC5zaXplLmhlaWdodFxuICAgICAgICAgICAgd2hlbiAxICMgQ2FsY3VsYXRlZFxuICAgICAgICAgICAgICAgIGhvdHNwb3QuZHN0UmVjdC54ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5ib3gueClcbiAgICAgICAgICAgICAgICBob3RzcG90LmRzdFJlY3QueSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYm94LnkpXG4gICAgICAgICAgICAgICAgaG90c3BvdC5kc3RSZWN0LndpZHRoID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5ib3guc2l6ZS53aWR0aClcbiAgICAgICAgICAgICAgICBob3RzcG90LmRzdFJlY3QuaGVpZ2h0ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5ib3guc2l6ZS5oZWlnaHQpXG4gICAgICAgICAgICB3aGVuIDIgIyBCaW5kIHRvIFBpY3R1cmVcbiAgICAgICAgICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5waWN0dXJlTnVtYmVyKV1cbiAgICAgICAgICAgICAgICBpZiBwaWN0dXJlP1xuICAgICAgICAgICAgICAgICAgICBob3RzcG90LnRhcmdldCA9IHBpY3R1cmVcbiAgICAgICAgICAgIHdoZW4gMyAjIEJpbmQgdG8gVGV4dFxuICAgICAgICAgICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnRleHROdW1iZXIpXVxuICAgICAgICAgICAgICAgIGlmIHRleHQ/XG4gICAgICAgICAgICAgICAgICAgIGhvdHNwb3QudGFyZ2V0ID0gdGV4dFxuICAgICAgICBcbiAgICAgICAgaG90c3BvdC5iZWhhdmlvci5zaGFwZSA9IEBwYXJhbXMuc2hhcGUgPyBncy5Ib3RzcG90U2hhcGUuUkVDVEFOR0xFIFxuICAgICAgICBcbiAgICAgICAgaWYgdGV4dD9cbiAgICAgICAgICAgIGhvdHNwb3QuaW1hZ2VzID0gbnVsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBob3RzcG90LmltYWdlcyA9IFtcbiAgICAgICAgICAgICAgICBAcGFyYW1zLmJhc2VHcmFwaGljPy5uYW1lIHx8IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuYmFzZUdyYXBoaWMpIHx8IHBpY3R1cmU/LmltYWdlLFxuICAgICAgICAgICAgICAgIEBwYXJhbXMuaG92ZXJHcmFwaGljPy5uYW1lIHx8IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuaG92ZXJHcmFwaGljKSxcbiAgICAgICAgICAgICAgICBAcGFyYW1zLnNlbGVjdGVkR3JhcGhpYz8ubmFtZSB8fCBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnNlbGVjdGVkR3JhcGhpYyksXG4gICAgICAgICAgICAgICAgQHBhcmFtcy5zZWxlY3RlZEhvdmVyR3JhcGhpYz8ubmFtZSB8fCBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnNlbGVjdGVkSG92ZXJHcmFwaGljKSxcbiAgICAgICAgICAgICAgICBAcGFyYW1zLnVuc2VsZWN0ZWRHcmFwaGljPy5uYW1lIHx8IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMudW5zZWxlY3RlZEdyYXBoaWMpXG4gICAgICAgICAgICBdXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5hY3Rpb25zLm9uQ2xpY2sudHlwZSAhPSAwIG9yIEBwYXJhbXMuYWN0aW9ucy5vbkNsaWNrLmxhYmVsICAgICAgICBcbiAgICAgICAgICAgIGhvdHNwb3QuZXZlbnRzLm9uIFwiY2xpY2tcIiwgZ3MuQ2FsbEJhY2soXCJvbkhvdHNwb3RDbGlja1wiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkNsaWNrLmJpbmRWYWx1ZSkgfSlcbiAgICAgICAgaWYgQHBhcmFtcy5hY3Rpb25zLm9uRW50ZXIudHlwZSAhPSAwIG9yIEBwYXJhbXMuYWN0aW9ucy5vbkVudGVyLmxhYmVsICAgICAgICBcbiAgICAgICAgICAgIGhvdHNwb3QuZXZlbnRzLm9uIFwiZW50ZXJcIiwgZ3MuQ2FsbEJhY2soXCJvbkhvdHNwb3RFbnRlclwiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkVudGVyLmJpbmRWYWx1ZSkgfSlcbiAgICAgICAgaWYgQHBhcmFtcy5hY3Rpb25zLm9uTGVhdmUudHlwZSAhPSAwIG9yIEBwYXJhbXMuYWN0aW9ucy5vbkxlYXZlLmxhYmVsICAgICAgICBcbiAgICAgICAgICAgIGhvdHNwb3QuZXZlbnRzLm9uIFwibGVhdmVcIiwgZ3MuQ2FsbEJhY2soXCJvbkhvdHNwb3RMZWF2ZVwiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkxlYXZlLmJpbmRWYWx1ZSkgfSlcbiAgICAgICAgaWYgQHBhcmFtcy5hY3Rpb25zLm9uRHJhZy50eXBlICE9IDAgb3IgQHBhcmFtcy5hY3Rpb25zLm9uRHJhZy5sYWJlbCAgICAgICAgXG4gICAgICAgICAgICBob3RzcG90LmV2ZW50cy5vbiBcImRyYWdTdGFydFwiLCBncy5DYWxsQmFjayhcIm9uSG90c3BvdERyYWdTdGFydFwiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkRyYWcuYmluZFZhbHVlKSB9KVxuICAgICAgICAgICAgaG90c3BvdC5ldmVudHMub24gXCJkcmFnXCIsIGdzLkNhbGxCYWNrKFwib25Ib3RzcG90RHJhZ1wiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkRyYWcuYmluZFZhbHVlKSB9KVxuICAgICAgICAgICAgaG90c3BvdC5ldmVudHMub24gXCJkcmFnRW5kXCIsIGdzLkNhbGxCYWNrKFwib25Ib3RzcG90RHJhZ0VuZFwiLCBAaW50ZXJwcmV0ZXIsIHsgcGFyYW1zOiBAcGFyYW1zLCBiaW5kVmFsdWU6IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuYWN0aW9ucy5vbkRyYWcuYmluZFZhbHVlKSB9KVxuICAgICAgICBpZiBAcGFyYW1zLmFjdGlvbnMub25TZWxlY3QudHlwZSAhPSAwIG9yIEBwYXJhbXMuYWN0aW9ucy5vblNlbGVjdC5sYWJlbCBvclxuICAgICAgICAgICBAcGFyYW1zLmFjdGlvbnMub25EZXNlbGVjdC50eXBlICE9IDAgb3IgQHBhcmFtcy5hY3Rpb25zLm9uRGVzZWxlY3QubGFiZWwgICAgXG4gICAgICAgICAgICBob3RzcG90LmV2ZW50cy5vbiBcInN0YXRlQ2hhbmdlZFwiLCBncy5DYWxsQmFjayhcIm9uSG90c3BvdFN0YXRlQ2hhbmdlZFwiLCBAaW50ZXJwcmV0ZXIsIEBwYXJhbXMpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGhvdHNwb3Quc2VsZWN0YWJsZSA9IHllc1xuICAgICAgICBob3RzcG90LnNldHVwKClcblxuICAgICAgICBpZiBAcGFyYW1zLmRyYWdnaW5nLmVuYWJsZWRcbiAgICAgICAgICAgIGRyYWdnaW5nID0gQHBhcmFtcy5kcmFnZ2luZ1xuICAgICAgICAgICAgaG90c3BvdC5kcmFnZ2FibGUgPSB7IFxuICAgICAgICAgICAgICAgIHJlY3Q6IG5ldyBSZWN0KGRyYWdnaW5nLnJlY3QueCwgZHJhZ2dpbmcucmVjdC55LCBkcmFnZ2luZy5yZWN0LnNpemUud2lkdGgsIGRyYWdnaW5nLnJlY3Quc2l6ZS5oZWlnaHQpLCBcbiAgICAgICAgICAgICAgICBheGlzWDogZHJhZ2dpbmcuaG9yaXpvbnRhbCwgXG4gICAgICAgICAgICAgICAgYXhpc1k6IGRyYWdnaW5nLnZlcnRpY2FsIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaG90c3BvdC5hZGRDb21wb25lbnQobmV3IHVpLkNvbXBvbmVudF9EcmFnZ2FibGUoKSlcbiAgICAgICAgICAgIGhvdHNwb3QuZXZlbnRzLm9uIFwiZHJhZ1wiLCAoZSkgPT4gXG4gICAgICAgICAgICAgICAgZHJhZyA9IGUuc2VuZGVyLmRyYWdnYWJsZVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXBUZW1wVmFyaWFibGVzKEBpbnRlcnByZXRlci5jb250ZXh0KVxuICAgICAgICAgICAgICAgIGlmIEBwYXJhbXMuZHJhZ2dpbmcuaG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLmRyYWdnaW5nLnZhcmlhYmxlLCBNYXRoLnJvdW5kKChlLnNlbmRlci5kc3RSZWN0LngtZHJhZy5yZWN0LngpIC8gKGRyYWcucmVjdC53aWR0aC1lLnNlbmRlci5kc3RSZWN0LndpZHRoKSAqIDEwMCkpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLmRyYWdnaW5nLnZhcmlhYmxlLCBNYXRoLnJvdW5kKChlLnNlbmRlci5kc3RSZWN0LnktZHJhZy5yZWN0LnkpIC8gKGRyYWcucmVjdC5oZWlnaHQtZS5zZW5kZXIuZHN0UmVjdC5oZWlnaHQpICogMTAwKSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VIb3RzcG90U3RhdGVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kQ2hhbmdlSG90c3BvdFN0YXRlOiAtPlxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZUhvdHNwb3REb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBob3RzcG90ID0gc2NlbmUuaG90c3BvdHNbbnVtYmVyXVxuICAgICAgICByZXR1cm4gaWYgIWhvdHNwb3RcbiAgICAgICAgXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5zZWxlY3RlZCkgdGhlbiBob3RzcG90LmJlaGF2aW9yLnNlbGVjdGVkID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc2VsZWN0ZWQpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5lbmFibGVkKSB0aGVuIGhvdHNwb3QuYmVoYXZpb3IuZW5hYmxlZCA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLmVuYWJsZWQpXG4gICAgICAgIFxuICAgICAgICBob3RzcG90LmJlaGF2aW9yLnVwZGF0ZUlucHV0KClcbiAgICAgICAgaG90c3BvdC5iZWhhdmlvci51cGRhdGVJbWFnZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEVyYXNlSG90c3BvdFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgIFxuICAgIGNvbW1hbmRFcmFzZUhvdHNwb3Q6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZUhvdHNwb3REb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBcbiAgICAgICAgaWYgc2NlbmUuaG90c3BvdHNbbnVtYmVyXT9cbiAgICAgICAgICAgIHNjZW5lLmhvdHNwb3RzW251bWJlcl0uZGlzcG9zZSgpXG4gICAgICAgICAgICBzY2VuZS5ob3RzcG90Q29udGFpbmVyLmVyYXNlT2JqZWN0KG51bWJlcilcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VPYmplY3REb21haW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZENoYW5nZU9iamVjdERvbWFpbjogLT5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yLmNoYW5nZU9iamVjdERvbWFpbihAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLmRvbWFpbikpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFBpY3R1cmVEZWZhdWx0c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgIFxuICAgIGNvbW1hbmRQaWN0dXJlRGVmYXVsdHM6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMucGljdHVyZVxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuYXBwZWFyRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuYXBwZWFyRHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5kaXNhcHBlYXJEdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5kaXNhcHBlYXJEdXJhdGlvbiA9IEBpbnRlcnByZXRlci5kdXJhdGlvblZhbHVlT2YoQHBhcmFtcy5kaXNhcHBlYXJEdXJhdGlvbilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnpPcmRlcikgdGhlbiBkZWZhdWx0cy56T3JkZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnpPcmRlcilcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5hcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5hcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyRWFzaW5nLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRWFzaW5nID0gQHBhcmFtcy5kaXNhcHBlYXJFYXNpbmdcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wiZGlzYXBwZWFyQW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uID0gQHBhcmFtcy5kaXNhcHBlYXJBbmltYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzW1wibW90aW9uQmx1ci5lbmFibGVkXCJdKSB0aGVuIGRlZmF1bHRzLm1vdGlvbkJsdXIgPSBAcGFyYW1zLm1vdGlvbkJsdXJcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLm9yaWdpbikgdGhlbiBkZWZhdWx0cy5vcmlnaW4gPSBAcGFyYW1zLm9yaWdpblxuICAgIFxuICAgIFxuICAgIGNyZWF0ZVBpY3R1cmU6IChncmFwaGljLCBwYXJhbXMpIC0+XG4gICAgICAgIGdyYXBoaWMgPSBAc3RyaW5nVmFsdWVPZihncmFwaGljKVxuICAgICAgICBncmFwaGljTmFtZSA9IGlmIGdyYXBoaWM/Lm5hbWU/IHRoZW4gZ3JhcGhpYy5uYW1lIGVsc2UgZ3JhcGhpY1xuICAgICAgICBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tncmFwaGljTmFtZX1cIilcbiAgICAgICAgcmV0dXJuIG51bGwgaWYgYml0bWFwICYmICFiaXRtYXAubG9hZGVkXG4gICAgICAgIFxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnBpY3R1cmVcbiAgICAgICAgZmxhZ3MgPSBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIG51bWJlciA9IEBudW1iZXJWYWx1ZU9mKHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHBpY3R1cmVzID0gc2NlbmUucGljdHVyZXNcbiAgICAgICAgaWYgbm90IHBpY3R1cmVzW251bWJlcl0/XG4gICAgICAgICAgICBwaWN0dXJlID0gbmV3IGdzLk9iamVjdF9QaWN0dXJlKG51bGwsIG51bGwsIHBhcmFtcy52aXN1YWw/LnR5cGUpXG4gICAgICAgICAgICBwaWN0dXJlLmRvbWFpbiA9IHBhcmFtcy5udW1iZXJEb21haW5cbiAgICAgICAgICAgIHBpY3R1cmVzW251bWJlcl0gPSBwaWN0dXJlXG4gICAgICAgICAgICBzd2l0Y2ggcGFyYW1zLnZpc3VhbD8udHlwZVxuICAgICAgICAgICAgICAgIHdoZW4gMVxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IHllc1xuICAgICAgICAgICAgICAgIHdoZW4gMlxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLmZyYW1lVGhpY2tuZXNzID0gcGFyYW1zLnZpc3VhbC5mcmFtZS50aGlja25lc3NcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZS5mcmFtZUNvcm5lclNpemUgPSBwYXJhbXMudmlzdWFsLmZyYW1lLmNvcm5lclNpemVcbiAgICAgICAgICAgICAgICB3aGVuIDNcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZS52aXN1YWwub3JpZW50YXRpb24gPSBwYXJhbXMudmlzdWFsLnRocmVlUGFydEltYWdlLm9yaWVudGF0aW9uXG4gICAgICAgICAgICAgICAgd2hlbiA0XG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuY29sb3IgPSBncy5Db2xvci5mcm9tT2JqZWN0KHBhcmFtcy52aXN1YWwucXVhZC5jb2xvcilcbiAgICAgICAgICAgICAgICB3aGVuIDVcbiAgICAgICAgICAgICAgICAgICAgc25hcHNob3QgPSBHcmFwaGljcy5zbmFwc2hvdCgpXG4gICAgICAgICAgICAgICAgICAgICNSZXNvdXJjZU1hbmFnZXIuYWRkQ3VzdG9tQml0bWFwKHNuYXBzaG90KVxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLmJpdG1hcCA9IHNuYXBzaG90XG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuZHN0UmVjdC53aWR0aCA9IHNuYXBzaG90LndpZHRoXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuZHN0UmVjdC5oZWlnaHQgPSBzbmFwc2hvdC5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZS5zcmNSZWN0LnNldCgwLCAwLCBzbmFwc2hvdC53aWR0aCwgc25hcHNob3QuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICB4ID0gQG51bWJlclZhbHVlT2YocGFyYW1zLnBvc2l0aW9uLngpXG4gICAgICAgIHkgPSBAbnVtYmVyVmFsdWVPZihwYXJhbXMucG9zaXRpb24ueSlcbiAgICAgICAgcGljdHVyZSA9IHBpY3R1cmVzW251bWJlcl1cbiAgICAgICAgXG4gICAgICAgIGlmICFwaWN0dXJlLmJpdG1hcFxuICAgICAgICAgICAgcGljdHVyZS5pbWFnZSA9IGdyYXBoaWNOYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBpY3R1cmUuaW1hZ2UgPSBudWxsXG4gICAgXG4gICAgICAgIGJpdG1hcCA9IHBpY3R1cmUuYml0bWFwID8gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1BpY3R1cmVzLyN7Z3JhcGhpY05hbWV9XCIpXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAbnVtYmVyVmFsdWVPZihwYXJhbXMuZWFzaW5nLnR5cGUpLCBwYXJhbXMuZWFzaW5nLmluT3V0KSBlbHNlIGdzLkVhc2luZ3MuZnJvbU9iamVjdChkZWZhdWx0cy5hcHBlYXJFYXNpbmcpXG4gICAgICAgIGR1cmF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzLmR1cmF0aW9uKSB0aGVuIEBkdXJhdGlvblZhbHVlT2YocGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmFwcGVhckR1cmF0aW9uXG4gICAgICAgIG9yaWdpbiA9IGlmICFpc0xvY2tlZChmbGFncy5vcmlnaW4pIHRoZW4gcGFyYW1zLm9yaWdpbiBlbHNlIGRlZmF1bHRzLm9yaWdpblxuICAgICAgICB6SW5kZXggPSBpZiAhaXNMb2NrZWQoZmxhZ3Muek9yZGVyKSB0aGVuIEBudW1iZXJWYWx1ZU9mKHBhcmFtcy56T3JkZXIpIGVsc2UgZGVmYXVsdHMuek9yZGVyXG4gICAgICAgIGFuaW1hdGlvbiA9IGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5hcHBlYXJBbmltYXRpb25cbiAgICBcbiAgICAgICAgcGljdHVyZS5taXJyb3IgPSBwYXJhbXMucG9zaXRpb24uaG9yaXpvbnRhbEZsaXBcbiAgICAgICAgcGljdHVyZS5hbmdsZSA9IHBhcmFtcy5wb3NpdGlvbi5hbmdsZSB8fCAwXG4gICAgICAgIHBpY3R1cmUuem9vbS54ID0gKHBhcmFtcy5wb3NpdGlvbi5kYXRhPy56b29tfHwxKVxuICAgICAgICBwaWN0dXJlLnpvb20ueSA9IChwYXJhbXMucG9zaXRpb24uZGF0YT8uem9vbXx8MSlcbiAgICAgICAgcGljdHVyZS5ibGVuZE1vZGUgPSBAbnVtYmVyVmFsdWVPZihwYXJhbXMuYmxlbmRNb2RlKVxuICAgICAgICBcbiAgICAgICAgaWYgcGFyYW1zLm9yaWdpbiA9PSAxIGFuZCBiaXRtYXA/XG4gICAgICAgICAgICB4ICs9IChiaXRtYXAud2lkdGgqcGljdHVyZS56b29tLngtYml0bWFwLndpZHRoKS8yXG4gICAgICAgICAgICB5ICs9IChiaXRtYXAuaGVpZ2h0KnBpY3R1cmUuem9vbS55LWJpdG1hcC5oZWlnaHQpLzJcbiAgICAgICAgICAgIFxuICAgICAgICBwaWN0dXJlLmRzdFJlY3QueCA9IHhcbiAgICAgICAgcGljdHVyZS5kc3RSZWN0LnkgPSB5XG4gICAgICAgIHBpY3R1cmUuYW5jaG9yLnggPSBpZiBvcmlnaW4gPT0gMSB0aGVuIDAuNSBlbHNlIDBcbiAgICAgICAgcGljdHVyZS5hbmNob3IueSA9IGlmIG9yaWdpbiA9PSAxIHRoZW4gMC41IGVsc2UgMFxuICAgICAgICBwaWN0dXJlLnpJbmRleCA9IHpJbmRleCB8fCAgKDcwMCArIG51bWJlcilcbiAgICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy52aWV3cG9ydD8udHlwZSA9PSBcInNjZW5lXCJcbiAgICAgICAgICAgIHBpY3R1cmUudmlld3BvcnQgPSBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3Iudmlld3BvcnRcbiAgICAgICAgXG4gICAgICAgIGlmIHBhcmFtcy5zaXplPy50eXBlID09IDFcbiAgICAgICAgICAgIHBpY3R1cmUuZHN0UmVjdC53aWR0aCA9IHBhcmFtcy5zaXplLndpZHRoXG4gICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QuaGVpZ2h0ID0gcGFyYW1zLnNpemUuaGVpZ2h0XG4gICAgICAgICAgICBcbiAgICAgICAgcGljdHVyZS51cGRhdGUoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHBpY3R1cmVcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTaG93UGljdHVyZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kU2hvd1BpY3R1cmU6IC0+IFxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnBpY3R1cmVcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBwaWN0dXJlID0gQGludGVycHJldGVyLmNyZWF0ZVBpY3R1cmUoQHBhcmFtcy5ncmFwaGljLCBAcGFyYW1zKVxuICAgICAgICBpZiAhcGljdHVyZVxuICAgICAgICAgICAgQGludGVycHJldGVyLnBvaW50ZXItLVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gMVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLnBvc2l0aW9uVHlwZSA9PSAwXG4gICAgICAgICAgICBwID0gQGludGVycHJldGVyLnByZWRlZmluZWRPYmplY3RQb3NpdGlvbihAcGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBwaWN0dXJlLCBAcGFyYW1zKVxuICAgICAgICAgICAgcGljdHVyZS5kc3RSZWN0LnggPSBwLnhcbiAgICAgICAgICAgIHBpY3R1cmUuZHN0UmVjdC55ID0gcC55XG4gICAgICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dCkgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuYXBwZWFyRWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuYXBwZWFyRHVyYXRpb25cbiAgICAgICAgYW5pbWF0aW9uID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiYW5pbWF0aW9uLnR5cGVcIl0pIHRoZW4gQHBhcmFtcy5hbmltYXRpb24gZWxzZSBkZWZhdWx0cy5hcHBlYXJBbmltYXRpb25cbiAgICBcbiAgICAgICAgcGljdHVyZS5hbmltYXRvci5hcHBlYXIocGljdHVyZS5kc3RSZWN0LngsIHBpY3R1cmUuZHN0UmVjdC55LCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24pXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUGxheVBpY3R1cmVBbmltYXRpb25cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZFBsYXlQaWN0dXJlQW5pbWF0aW9uOiAtPlxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBcbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5waWN0dXJlXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgcGljdHVyZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmVhc2luZy50eXBlKSwgQHBhcmFtcy5lYXNpbmcuaW5PdXQpIGVsc2UgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KGRlZmF1bHRzLmFwcGVhckVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmFwcGVhckR1cmF0aW9uXG4gICAgICAgIGFuaW1hdGlvbiA9IGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIEBwYXJhbXMuYW5pbWF0aW9uIGVsc2UgZGVmYXVsdHMuYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLmFuaW1hdGlvbklkP1xuICAgICAgICAgICAgcmVjb3JkID0gUmVjb3JkTWFuYWdlci5hbmltYXRpb25zW0BwYXJhbXMuYW5pbWF0aW9uSWRdXG4gICAgICAgICAgICBpZiByZWNvcmQ/XG4gICAgICAgICAgICAgICAgcGljdHVyZSA9IEBpbnRlcnByZXRlci5jcmVhdGVQaWN0dXJlKHJlY29yZC5ncmFwaGljLCBAcGFyYW1zKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHBpY3R1cmUuZmluZENvbXBvbmVudChcIkNvbXBvbmVudF9GcmFtZUFuaW1hdGlvblwiKVxuICAgICAgICAgICAgICAgIGlmIGNvbXBvbmVudD9cbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnJlZnJlc2gocmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc3RhcnQoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbmV3IGdzLkNvbXBvbmVudF9GcmFtZUFuaW1hdGlvbihyZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuYWRkQ29tcG9uZW50KGNvbXBvbmVudClcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgQHBhcmFtcy5wb3NpdGlvblR5cGUgPT0gMFxuICAgICAgICAgICAgICAgICAgICBwID0gQGludGVycHJldGVyLnByZWRlZmluZWRPYmplY3RQb3NpdGlvbihAcGFyYW1zLnByZWRlZmluZWRQb3NpdGlvbklkLCBwaWN0dXJlLCBAcGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QueCA9IHAueFxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QueSA9IHAueVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwaWN0dXJlLmFuaW1hdG9yLmFwcGVhcihwaWN0dXJlLmRzdFJlY3QueCwgcGljdHVyZS5kc3RSZWN0LnksIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGljdHVyZSA9IFNjZW5lTWFuYWdlci5zY2VuZS5waWN0dXJlc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgICAgICBhbmltYXRpb24gPSBwaWN0dXJlPy5maW5kQ29tcG9uZW50KFwiQ29tcG9uZW50X0ZyYW1lQW5pbWF0aW9uXCIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGFuaW1hdGlvbj9cbiAgICAgICAgICAgICAgICBwaWN0dXJlLnJlbW92ZUNvbXBvbmVudChhbmltYXRpb24pXG4gICAgICAgICAgICAgICAgYml0bWFwID0gUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL0FuaW1hdGlvbnMvI3twaWN0dXJlLmltYWdlfVwiKVxuICAgICAgICAgICAgICAgIGlmIGJpdG1hcD9cbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZS5zcmNSZWN0LnNldCgwLCAwLCBiaXRtYXAud2lkdGgsIGJpdG1hcC5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuZHN0UmVjdC53aWR0aCA9IHBpY3R1cmUuc3JjUmVjdC53aWR0aFxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QuaGVpZ2h0ID0gcGljdHVyZS5zcmNSZWN0LmhlaWdodFxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy53YWl0Rm9yQ29tcGxldGlvbiBhbmQgbm90IChkdXJhdGlvbiA9PSAwIG9yIEBpbnRlcnByZXRlci5pc0luc3RhbnRTa2lwKCkpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvblxuICAgICAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTW92ZVBpY3R1cmVQYXRoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgXG4gICAgY29tbWFuZE1vdmVQaWN0dXJlUGF0aDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHBpY3R1cmUgPSBzY2VuZS5waWN0dXJlc1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCBwaWN0dXJlPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1vdmVPYmplY3RQYXRoKHBpY3R1cmUsIEBwYXJhbXMucGF0aCwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1vdmVQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kTW92ZVBpY3R1cmU6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVBpY3R1cmVEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5tb3ZlT2JqZWN0KHBpY3R1cmUsIEBwYXJhbXMucGljdHVyZS5wb3NpdGlvbiwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgIFxuXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kVGludFBpY3R1cmVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgIFxuICAgIGNvbW1hbmRUaW50UGljdHVyZTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgcGljdHVyZSA9IHNjZW5lLnBpY3R1cmVzW251bWJlcl1cbiAgICAgICAgaWYgbm90IHBpY3R1cmU/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIudGludE9iamVjdChwaWN0dXJlLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kRmxhc2hQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRGbGFzaFBpY3R1cmU6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVBpY3R1cmVEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4gfHwgXCJcIilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHBpY3R1cmUgPSBzY2VuZS5waWN0dXJlc1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCBwaWN0dXJlPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmZsYXNoT2JqZWN0KHBpY3R1cmUsIEBwYXJhbXMpXG4gICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENyb3BQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgXG4gICAgY29tbWFuZENyb3BQaWN0dXJlOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluIHx8IFwiXCIpXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5jcm9wT2JqZWN0KHBpY3R1cmUsIEBwYXJhbXMpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJvdGF0ZVBpY3R1cmVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgIFxuICAgIGNvbW1hbmRSb3RhdGVQaWN0dXJlOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluIHx8IFwiXCIpXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5yb3RhdGVPYmplY3QocGljdHVyZSwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFpvb21QaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgXG4gICAgY29tbWFuZFpvb21QaWN0dXJlOiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluIHx8IFwiXCIpXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci56b29tT2JqZWN0KHBpY3R1cmUsIEBwYXJhbXMpXG5cbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQmxlbmRQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZEJsZW5kUGljdHVyZTogLT5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yLmNoYW5nZVBpY3R1cmVEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4gfHwgXCJcIilcbiAgICAgICAgcGljdHVyZSA9IFNjZW5lTWFuYWdlci5zY2VuZS5waWN0dXJlc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgIGlmIG5vdCBwaWN0dXJlPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmJsZW5kT2JqZWN0KHBpY3R1cmUsIEBwYXJhbXMpIFxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hha2VQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZFNoYWtlUGljdHVyZTogLT4gXG4gICAgICAgIHBpY3R1cmUgPSBTY2VuZU1hbmFnZXIuc2NlbmUucGljdHVyZXNbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5zaGFrZU9iamVjdChwaWN0dXJlLCBAcGFyYW1zKSAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1hc2tQaWN0dXJlXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRNYXNrUGljdHVyZTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgcGljdHVyZSA9IHNjZW5lLnBpY3R1cmVzW251bWJlcl1cbiAgICAgICAgaWYgbm90IHBpY3R1cmU/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIubWFza09iamVjdChwaWN0dXJlLCBAcGFyYW1zKVxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRQaWN0dXJlTW90aW9uQmx1clxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgIFxuICAgIGNvbW1hbmRQaWN0dXJlTW90aW9uQmx1cjogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgcGljdHVyZSA9IHNjZW5lLnBpY3R1cmVzW251bWJlcl1cbiAgICAgICAgaWYgbm90IHBpY3R1cmU/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIub2JqZWN0TW90aW9uQmx1cihwaWN0dXJlLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUGljdHVyZUVmZmVjdFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kUGljdHVyZUVmZmVjdDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlUGljdHVyZURvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbiB8fCBcIlwiKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgcGljdHVyZSA9IHNjZW5lLnBpY3R1cmVzW251bWJlcl1cbiAgICAgICAgaWYgbm90IHBpY3R1cmU/IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIub2JqZWN0RWZmZWN0KHBpY3R1cmUsIEBwYXJhbXMpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEVyYXNlUGljdHVyZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRFcmFzZVBpY3R1cmU6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMucGljdHVyZVxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluIHx8IFwiXCIpXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICBwaWN0dXJlID0gc2NlbmUucGljdHVyZXNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgcGljdHVyZT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmVhc2luZy50eXBlKSwgQHBhcmFtcy5lYXNpbmcuaW5PdXQpIGVsc2UgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KGRlZmF1bHRzLmRpc2FwcGVhckVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmRpc2FwcGVhckR1cmF0aW9uXG4gICAgICAgIGFuaW1hdGlvbiA9IGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIEBwYXJhbXMuYW5pbWF0aW9uIGVsc2UgZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgIFxuICAgICAgICBwaWN0dXJlLmFuaW1hdG9yLmRpc2FwcGVhcihhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIFxuICAgICAgICAgICAgKHNlbmRlcikgPT4gXG4gICAgICAgICAgICAgICAgc2VuZGVyLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVBpY3R1cmVEb21haW4oc2VuZGVyLmRvbWFpbilcbiAgICAgICAgICAgICAgICBzY2VuZS5waWN0dXJlc1tudW1iZXJdID0gbnVsbFxuICAgICAgICApXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uIFxuICAgICAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kSW5wdXROdW1iZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kSW5wdXROdW1iZXI6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgaWYgQGludGVycHJldGVyLmlzUHJvY2Vzc2luZ01lc3NhZ2VJbk90aGVyQ29udGV4dCgpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdEZvck1lc3NhZ2UoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKEdhbWVNYW5hZ2VyLnNldHRpbmdzLmFsbG93Q2hvaWNlU2tpcHx8QGludGVycHJldGVyLnByZXZpZXcpIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIubWVzc2FnZU9iamVjdCgpLmJlaGF2aW9yLmNsZWFyKClcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudmFyaWFibGUsIDApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIFxuICAgICAgICAkdGVtcEZpZWxkcy5kaWdpdHMgPSBAcGFyYW1zLmRpZ2l0c1xuICAgICAgICBzY2VuZS5iZWhhdmlvci5zaG93SW5wdXROdW1iZXIoQHBhcmFtcy5kaWdpdHMsIGdzLkNhbGxCYWNrKFwib25JbnB1dE51bWJlckZpbmlzaFwiLCBAaW50ZXJwcmV0ZXIsIEBwYXJhbXMpKVxuICAgICAgIFxuICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdGluZ0Zvci5pbnB1dE51bWJlciA9IEBwYXJhbXNcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hvaWNlVGltZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kQ2hvaWNlVGltZXI6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIFxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZVRpbWVyID0gc2NlbmUuY2hvaWNlVGltZXJcbiAgICAgICAgR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5jaG9pY2VUaW1lclZpc2libGUgPSBAcGFyYW1zLnZpc2libGVcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5lbmFibGVkXG4gICAgICAgICAgICBzY2VuZS5jaG9pY2VUaW1lci5iZWhhdmlvci5zZWNvbmRzID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zZWNvbmRzKVxuICAgICAgICAgICAgc2NlbmUuY2hvaWNlVGltZXIuYmVoYXZpb3IubWludXRlcyA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubWludXRlcylcbiAgICAgICAgICAgIHNjZW5lLmNob2ljZVRpbWVyLmJlaGF2aW9yLnN0YXJ0KClcbiAgICAgICAgICAgIHNjZW5lLmNob2ljZVRpbWVyLmV2ZW50cy5vbiBcImZpbmlzaFwiLCAoc2VuZGVyKSA9PlxuICAgICAgICAgICAgICAgIGlmICBzY2VuZS5jaG9pY2VXaW5kb3cgYW5kIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlcz8ubGVuZ3RoID4gMCAgICBcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENob2ljZSA9IChHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZXMuZmlyc3QgKGMpIC0+IGMuaXNEZWZhdWx0KSB8fCBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZXNbMF1cbiAgICAgICAgICAgICAgICAgICAgI3NjZW5lLmNob2ljZVdpbmRvdy5ldmVudHMuZW1pdChcInNlbGVjdGlvbkFjY2VwdFwiLCBzY2VuZS5jaG9pY2VXaW5kb3csIHsgbGFiZWxJbmRleDogZGVmYXVsdENob2ljZS5hY3Rpb24ubGFiZWxJbmRleCB9KVxuICAgICAgICAgICAgICAgICAgICBzY2VuZS5jaG9pY2VXaW5kb3cuZXZlbnRzLmVtaXQoXCJzZWxlY3Rpb25BY2NlcHRcIiwgc2NlbmUuY2hvaWNlV2luZG93LCBkZWZhdWx0Q2hvaWNlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzY2VuZS5jaG9pY2VUaW1lci5zdG9wKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hvd0Nob2ljZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kU2hvd0Nob2ljZXM6IC0+ICBcbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgcG9pbnRlciA9IEBpbnRlcnByZXRlci5wb2ludGVyXG4gICAgICAgIGNob2ljZXMgPSBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZXMgfHwgW11cbiAgICAgICAgXG4gICAgICAgIGlmIChHYW1lTWFuYWdlci5zZXR0aW5ncy5hbGxvd0Nob2ljZVNraXB8fEBpbnRlcnByZXRlci5wcmV2aWV3RGF0YSkgYW5kIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0ID0gQGludGVycHJldGVyLm1lc3NhZ2VPYmplY3QoKVxuICAgICAgICAgICAgaWYgbWVzc2FnZU9iamVjdD8udmlzaWJsZVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QuYmVoYXZpb3IuY2xlYXIoKVxuICAgICAgICAgICAgZGVmYXVsdENob2ljZSA9IChjaG9pY2VzLmZpcnN0KChjKSAtPiBjLmlzRGVmYXVsdCkpIHx8IGNob2ljZXNbMF0gICAgXG4gICAgICAgICAgICBpZiBkZWZhdWx0Q2hvaWNlLmFjdGlvbi5sYWJlbEluZGV4P1xuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5wb2ludGVyID0gZGVmYXVsdENob2ljZS5hY3Rpb24ubGFiZWxJbmRleFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5qdW1wVG9MYWJlbChkZWZhdWx0Q2hvaWNlLmFjdGlvbi5sYWJlbClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgY2hvaWNlcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLnNob3dDaG9pY2VzKGNob2ljZXMsIGdzLkNhbGxCYWNrKFwib25DaG9pY2VBY2NlcHRcIiwgQGludGVycHJldGVyLCB7IHBvaW50ZXI6IHBvaW50ZXIsIHBhcmFtczogQHBhcmFtcyB9KSlcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2hvd0Nob2ljZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgXG4gICAgY29tbWFuZFNob3dDaG9pY2U6IC0+IFxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBjb21tYW5kcyA9IEBpbnRlcnByZXRlci5vYmplY3QuY29tbWFuZHNcbiAgICAgICAgY29tbWFuZCA9IG51bGxcbiAgICAgICAgaW5kZXggPSAwXG4gICAgICAgIHBvaW50ZXIgPSBAaW50ZXJwcmV0ZXIucG9pbnRlclxuICAgICAgICBjaG9pY2VzID0gbnVsbFxuICAgICAgICBkc3RSZWN0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMucG9zaXRpb25UeXBlXG4gICAgICAgICAgICB3aGVuIDAgIyBBdXRvXG4gICAgICAgICAgICAgICAgZHN0UmVjdCA9IG51bGxcbiAgICAgICAgICAgIHdoZW4gMSAjIERpcmVjdFxuICAgICAgICAgICAgICAgIGRzdFJlY3QgPSBuZXcgUmVjdChAcGFyYW1zLmJveC54LCBAcGFyYW1zLmJveC55LCBAcGFyYW1zLmJveC5zaXplLndpZHRoLCBAcGFyYW1zLmJveC5zaXplLmhlaWdodClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgIUdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlc1xuICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5jaG9pY2VzID0gW11cbiAgICAgICAgY2hvaWNlcyA9IEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlc1xuICAgICAgICBjaG9pY2VzLnB1c2goeyBcbiAgICAgICAgICAgIGRzdFJlY3Q6IGRzdFJlY3QsIFxuICAgICAgICAgICAgI3RleHQ6IGxjcyhAcGFyYW1zLnRleHQpLCBcbiAgICAgICAgICAgIHRleHQ6IEBwYXJhbXMudGV4dCwgXG4gICAgICAgICAgICBpbmRleDogaW5kZXgsIFxuICAgICAgICAgICAgYWN0aW9uOiBAcGFyYW1zLmFjdGlvbiwgXG4gICAgICAgICAgICBpc1NlbGVjdGVkOiBubywgXG4gICAgICAgICAgICBpc0RlZmF1bHQ6IEBwYXJhbXMuZGVmYXVsdENob2ljZSwgXG4gICAgICAgICAgICBpc0VuYWJsZWQ6IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLmVuYWJsZWQpIH0pXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kT3Blbk1lbnVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICBcbiAgICBjb21tYW5kT3Blbk1lbnU6IC0+XG4gICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhuZXcgZ3MuT2JqZWN0X0xheW91dChcIm1lbnVMYXlvdXRcIiksIHRydWUpXG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IDFcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE9wZW5Mb2FkTWVudVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgY29tbWFuZE9wZW5Mb2FkTWVudTogLT5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnN3aXRjaFRvKG5ldyBncy5PYmplY3RfTGF5b3V0KFwibG9hZE1lbnVMYXlvdXRcIiksIHRydWUpXG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IDFcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRPcGVuU2F2ZU1lbnVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgIFxuICAgIGNvbW1hbmRPcGVuU2F2ZU1lbnU6IC0+XG4gICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhuZXcgZ3MuT2JqZWN0X0xheW91dChcInNhdmVNZW51TGF5b3V0XCIpLCB0cnVlKVxuICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSAxXG4gICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJldHVyblRvVGl0bGVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgIFxuICAgIGNvbW1hbmRSZXR1cm5Ub1RpdGxlOiAtPlxuICAgICAgICBTY2VuZU1hbmFnZXIuY2xlYXIoKVxuICAgICAgICBTY2VuZU1hbmFnZXIuc3dpdGNoVG8obmV3IGdzLk9iamVjdF9MYXlvdXQoXCJ0aXRsZUxheW91dFwiKSlcbiAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gMVxuICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG5cbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRQbGF5VmlkZW9cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZFBsYXlWaWRlbzogLT5cbiAgICAgICAgaWYgKEdhbWVNYW5hZ2VyLmluTGl2ZVByZXZpZXcgb3IgR2FtZU1hbmFnZXIuc2V0dGluZ3MuYWxsb3dWaWRlb1NraXApIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXAgPSBub1xuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy52aWRlbz8ubmFtZT9cbiAgICAgICAgICAgIHNjZW5lLnZpZGVvID0gUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiTW92aWVzLyN7QHBhcmFtcy52aWRlby5uYW1lfVwiKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAdmlkZW9TcHJpdGUgPSBuZXcgU3ByaXRlKEdyYXBoaWNzLnZpZXdwb3J0KVxuICAgICAgICAgICAgQHZpZGVvU3ByaXRlLnNyY1JlY3QgPSBuZXcgUmVjdCgwLCAwLCBzY2VuZS52aWRlby53aWR0aCwgc2NlbmUudmlkZW8uaGVpZ2h0KVxuICAgICAgICAgICAgQHZpZGVvU3ByaXRlLnZpZGVvID0gc2NlbmUudmlkZW9cbiAgICAgICAgICAgIEB2aWRlb1Nwcml0ZS56b29tWCA9IEdyYXBoaWNzLndpZHRoIC8gc2NlbmUudmlkZW8ud2lkdGhcbiAgICAgICAgICAgIEB2aWRlb1Nwcml0ZS56b29tWSA9IEdyYXBoaWNzLmhlaWdodCAvIHNjZW5lLnZpZGVvLmhlaWdodFxuICAgICAgICAgICAgQHZpZGVvU3ByaXRlLnogPSA5OTk5OTk5OVxuICAgICAgICAgICAgc2NlbmUudmlkZW8ub25FbmRlZCA9ID0+XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICAgICAgQHZpZGVvU3ByaXRlLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIHNjZW5lLnZpZGVvID0gbnVsbFxuICAgICAgICAgICAgc2NlbmUudmlkZW8udm9sdW1lID0gQHBhcmFtcy52b2x1bWUgLyAxMDBcbiAgICAgICAgICAgIHNjZW5lLnZpZGVvLnBsYXliYWNrUmF0ZSA9IEBwYXJhbXMucGxheWJhY2tSYXRlIC8gMTAwXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0geWVzXG4gICAgICAgICAgICBzY2VuZS52aWRlby5wbGF5KClcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQXVkaW9EZWZhdWx0c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kQXVkaW9EZWZhdWx0czogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5hdWRpb1xuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MubXVzaWNGYWRlSW5EdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5tdXNpY0ZhZGVJbkR1cmF0aW9uID0gQHBhcmFtcy5tdXNpY0ZhZGVJbkR1cmF0aW9uXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5tdXNpY0ZhZGVPdXREdXJhdGlvbikgdGhlbiBkZWZhdWx0cy5tdXNpY0ZhZGVPdXREdXJhdGlvbiA9IEBwYXJhbXMubXVzaWNGYWRlT3V0RHVyYXRpb25cbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLm11c2ljVm9sdW1lKSB0aGVuIGRlZmF1bHRzLm11c2ljVm9sdW1lID0gQHBhcmFtcy5tdXNpY1ZvbHVtZVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MubXVzaWNQbGF5YmFja1JhdGUpIHRoZW4gZGVmYXVsdHMubXVzaWNQbGF5YmFja1JhdGUgPSBAcGFyYW1zLm11c2ljUGxheWJhY2tSYXRlXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5zb3VuZFZvbHVtZSkgdGhlbiBkZWZhdWx0cy5zb3VuZFZvbHVtZSA9IEBwYXJhbXMuc291bmRWb2x1bWVcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnNvdW5kUGxheWJhY2tSYXRlKSB0aGVuIGRlZmF1bHRzLnNvdW5kUGxheWJhY2tSYXRlID0gQHBhcmFtcy5zb3VuZFBsYXliYWNrUmF0ZVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Mudm9pY2VWb2x1bWUpIHRoZW4gZGVmYXVsdHMudm9pY2VWb2x1bWUgPSBAcGFyYW1zLnZvaWNlVm9sdW1lXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy52b2ljZVBsYXliYWNrUmF0ZSkgdGhlbiBkZWZhdWx0cy52b2ljZVBsYXliYWNrUmF0ZSA9IEBwYXJhbXMudm9pY2VQbGF5YmFja1JhdGVcbiAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUGxheU11c2ljXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZFBsYXlNdXNpYzogLT5cbiAgICAgICAgaWYgbm90IEBwYXJhbXMubXVzaWM/IHRoZW4gcmV0dXJuXG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMuYXVkaW9cbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmJnbUVuYWJsZWRcbiAgICAgICAgICAgIGZhZGVEdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5mYWRlSW5EdXJhdGlvbikgdGhlbiBAcGFyYW1zLmZhZGVJbkR1cmF0aW9uIGVsc2UgZGVmYXVsdHMubXVzaWNGYWRlSW5EdXJhdGlvblxuICAgICAgICAgICAgdm9sdW1lID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wibXVzaWMudm9sdW1lXCJdKSB0aGVuIEBwYXJhbXMubXVzaWMudm9sdW1lIGVsc2UgZGVmYXVsdHMubXVzaWNWb2x1bWVcbiAgICAgICAgICAgIHBsYXliYWNrUmF0ZSA9IGlmICFpc0xvY2tlZChmbGFnc1tcIm11c2ljLnBsYXliYWNrUmF0ZVwiXSkgdGhlbiBAcGFyYW1zLm11c2ljLnBsYXliYWNrUmF0ZSBlbHNlIGRlZmF1bHRzLm11c2ljUGxheWJhY2tSYXRlXG4gICAgICAgICAgICBtdXNpYyA9IHsgbmFtZTogQHBhcmFtcy5tdXNpYy5uYW1lLCB2b2x1bWU6IHZvbHVtZSwgcGxheWJhY2tSYXRlOiBwbGF5YmFja1JhdGUgfVxuICAgICAgICAgICAgaWYgQHBhcmFtcy5wbGF5VHlwZSA9PSAxXG4gICAgICAgICAgICAgICAgcGxheVRpbWUgPSBtaW46IEBwYXJhbXMucGxheVRpbWUubWluICogNjAsIG1heDogQHBhcmFtcy5wbGF5VGltZS5tYXggKiA2MFxuICAgICAgICAgICAgICAgIHBsYXlSYW5nZSA9IHN0YXJ0OiBAcGFyYW1zLnBsYXlSYW5nZS5zdGFydCAqIDYwLCBlbmQ6IEBwYXJhbXMucGxheVJhbmdlLmVuZCAqIDYwXG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlNdXNpY1JhbmRvbShtdXNpYywgZmFkZUR1cmF0aW9uLCBAcGFyYW1zLmxheWVyIHx8IDAsIHBsYXlUaW1lLCBwbGF5UmFuZ2UpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlNdXNpYyhAcGFyYW1zLm11c2ljLm5hbWUsIHZvbHVtZSwgcGxheWJhY2tSYXRlLCBmYWRlRHVyYXRpb24sIEBwYXJhbXMubGF5ZXIgfHwgMClcbiAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU3RvcE11c2ljXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZFN0b3BNdXNpYzogLT4gXG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMuYXVkaW9cbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBmYWRlRHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZmFkZU91dER1cmF0aW9uKSB0aGVuIEBwYXJhbXMuZmFkZU91dER1cmF0aW9uIGVsc2UgZGVmYXVsdHMubXVzaWNGYWRlT3V0RHVyYXRpb25cbiAgICAgICAgXG4gICAgICAgIEF1ZGlvTWFuYWdlci5zdG9wTXVzaWMoZmFkZUR1cmF0aW9uLCBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmxheWVyKSlcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFBhdXNlTXVzaWNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kUGF1c2VNdXNpYzogLT5cbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5hdWRpb1xuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIGZhZGVEdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5mYWRlT3V0RHVyYXRpb24pIHRoZW4gQHBhcmFtcy5mYWRlT3V0RHVyYXRpb24gZWxzZSBkZWZhdWx0cy5tdXNpY0ZhZGVPdXREdXJhdGlvblxuICAgICAgICBcbiAgICAgICAgQXVkaW9NYW5hZ2VyLnN0b3BNdXNpYyhmYWRlRHVyYXRpb24sIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubGF5ZXIpKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFJlc3VtZU11c2ljXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZFJlc3VtZU11c2ljOiAtPiBcbiAgICAgICAgZGVmYXVsdHMgPSBHYW1lTWFuYWdlci5kZWZhdWx0cy5hdWRpb1xuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIGZhZGVEdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5mYWRlSW5EdXJhdGlvbikgdGhlbiBAcGFyYW1zLmZhZGVJbkR1cmF0aW9uIGVsc2UgZGVmYXVsdHMubXVzaWNGYWRlSW5EdXJhdGlvblxuICAgICAgICBcbiAgICAgICAgQXVkaW9NYW5hZ2VyLnJlc3VtZU11c2ljKGZhZGVEdXJhdGlvbiwgQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5sYXllcikpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFBsYXlTb3VuZFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kUGxheVNvdW5kOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLmF1ZGlvXG4gICAgICAgIGZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIGlzTG9ja2VkID0gZ3MuQ29tbWFuZEZpZWxkRmxhZ3MuaXNMb2NrZWRcbiAgICAgICAgXG4gICAgICAgIGlmIEdhbWVNYW5hZ2VyLnNldHRpbmdzLnNvdW5kRW5hYmxlZCBhbmQgIUdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICB2b2x1bWUgPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJzb3VuZC52b2x1bWVcIl0pIHRoZW4gQHBhcmFtcy5zb3VuZC52b2x1bWUgZWxzZSBkZWZhdWx0cy5zb3VuZFZvbHVtZVxuICAgICAgICAgICAgcGxheWJhY2tSYXRlID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wic291bmQucGxheWJhY2tSYXRlXCJdKSB0aGVuIEBwYXJhbXMuc291bmQucGxheWJhY2tSYXRlIGVsc2UgZGVmYXVsdHMuc291bmRQbGF5YmFja1JhdGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlTb3VuZChAcGFyYW1zLnNvdW5kLm5hbWUsIHZvbHVtZSwgcGxheWJhY2tSYXRlLCBAcGFyYW1zLm11c2ljRWZmZWN0KVxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTdG9wU291bmRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgY29tbWFuZFN0b3BTb3VuZDogLT5cbiAgICAgICAgQXVkaW9NYW5hZ2VyLnN0b3BTb3VuZChAcGFyYW1zLnNvdW5kLm5hbWUpXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEVuZENvbW1vbkV2ZW50XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgY29tbWFuZEVuZENvbW1vbkV2ZW50OiAtPlxuICAgICAgICBldmVudElkID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5jb21tb25FdmVudElkKVxuICAgICAgICBldmVudCA9IEdhbWVNYW5hZ2VyLmNvbW1vbkV2ZW50c1tldmVudElkXSBcbiAgICAgICAgZXZlbnQ/LmJlaGF2aW9yLnN0b3AoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRSZXN1bWVDb21tb25FdmVudFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIGNvbW1hbmRSZXN1bWVDb21tb25FdmVudDogLT5cbiAgICAgICAgZXZlbnRJZCA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuY29tbW9uRXZlbnRJZClcbiAgICAgICAgZXZlbnQgPSBHYW1lTWFuYWdlci5jb21tb25FdmVudHNbZXZlbnRJZF0gXG4gICAgICAgIGV2ZW50Py5iZWhhdmlvci5yZXN1bWUoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENhbGxDb21tb25FdmVudFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kQ2FsbENvbW1vbkV2ZW50OiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBldmVudElkID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgQHBhcmFtcy5jb21tb25FdmVudElkLmluZGV4P1xuICAgICAgICAgICAgZXZlbnRJZCA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuY29tbW9uRXZlbnRJZClcbiAgICAgICAgICAgIGxpc3QgPSBAaW50ZXJwcmV0ZXIubGlzdE9iamVjdE9mKEBwYXJhbXMucGFyYW1ldGVycy52YWx1ZXNbMF0pXG4gICAgICAgICAgICBwYXJhbXMgPSB7IHZhbHVlczogbGlzdCB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcmFtcyA9IEBwYXJhbXMucGFyYW1ldGVyc1xuICAgICAgICAgICAgZXZlbnRJZCA9IEBwYXJhbXMuY29tbW9uRXZlbnRJZFxuXG4gICAgICAgIEBpbnRlcnByZXRlci5jYWxsQ29tbW9uRXZlbnQoZXZlbnRJZCwgcGFyYW1zKVxuICAgICBcbiAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhbmdlVGV4dFNldHRpbmdzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRDaGFuZ2VUZXh0U2V0dGluZ3M6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0ZXh0cyA9IHNjZW5lLnRleHRzXG4gICAgICAgIGlmIG5vdCB0ZXh0c1tudW1iZXJdPyBcbiAgICAgICAgICAgIHRleHRzW251bWJlcl0gPSBuZXcgZ3MuT2JqZWN0X1RleHQoKVxuICAgICAgICAgICAgdGV4dHNbbnVtYmVyXS52aXNpYmxlID0gbm9cbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGV4dFNwcml0ZSA9IHRleHRzW251bWJlcl1cbiAgICAgICAgcGFkZGluZyA9IHRleHRTcHJpdGUuYmVoYXZpb3IucGFkZGluZ1xuICAgICAgICBmb250ID0gdGV4dFNwcml0ZS5mb250XG4gICAgICAgIGZvbnROYW1lID0gdGV4dFNwcml0ZS5mb250Lm5hbWVcbiAgICAgICAgZm9udFNpemUgPSB0ZXh0U3ByaXRlLmZvbnQuc2l6ZVxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5saW5lU3BhY2luZykgdGhlbiB0ZXh0U3ByaXRlLnRleHRSZW5kZXJlci5saW5lU3BhY2luZyA9IEBwYXJhbXMubGluZVNwYWNpbmcgPyB0ZXh0U3ByaXRlLnRleHRSZW5kZXJlci5saW5lU3BhY2luZ1xuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZm9udCkgdGhlbiBmb250TmFtZSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuZm9udClcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnNpemUpIHRoZW4gZm9udFNpemUgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnNpemUpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmZvbnQpIG9yICFpc0xvY2tlZChmbGFncy5zaXplKVxuICAgICAgICAgICAgdGV4dFNwcml0ZS5mb250ID0gbmV3IEZvbnQoZm9udE5hbWUsIGZvbnRTaXplKVxuICAgICAgICAgICAgXG4gICAgICAgIHBhZGRpbmcubGVmdCA9IGlmICFpc0xvY2tlZChmbGFnc1tcInBhZGRpbmcuMFwiXSkgdGhlbiBAcGFyYW1zLnBhZGRpbmc/WzBdIGVsc2UgcGFkZGluZy5sZWZ0XG4gICAgICAgIHBhZGRpbmcudG9wID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wicGFkZGluZy4xXCJdKSB0aGVuIEBwYXJhbXMucGFkZGluZz9bMV0gZWxzZSBwYWRkaW5nLnRvcFxuICAgICAgICBwYWRkaW5nLnJpZ2h0ID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wicGFkZGluZy4yXCJdKSB0aGVuIEBwYXJhbXMucGFkZGluZz9bMl0gZWxzZSBwYWRkaW5nLnJpZ2h0XG4gICAgICAgIHBhZGRpbmcuYm90dG9tID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wicGFkZGluZy4zXCJdKSB0aGVuIEBwYXJhbXMucGFkZGluZz9bM10gZWxzZSBwYWRkaW5nLmJvdHRvbVxuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmJvbGQpXG4gICAgICAgICAgICB0ZXh0U3ByaXRlLmZvbnQuYm9sZCA9IEBwYXJhbXMuYm9sZFxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuaXRhbGljKVxuICAgICAgICAgICAgdGV4dFNwcml0ZS5mb250Lml0YWxpYyA9IEBwYXJhbXMuaXRhbGljXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5zbWFsbENhcHMpXG4gICAgICAgICAgICB0ZXh0U3ByaXRlLmZvbnQuc21hbGxDYXBzID0gQHBhcmFtcy5zbWFsbENhcHNcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLnVuZGVybGluZSlcbiAgICAgICAgICAgIHRleHRTcHJpdGUuZm9udC51bmRlcmxpbmUgPSBAcGFyYW1zLnVuZGVybGluZVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3Muc3RyaWtlVGhyb3VnaClcbiAgICAgICAgICAgIHRleHRTcHJpdGUuZm9udC5zdHJpa2VUaHJvdWdoID0gQHBhcmFtcy5zdHJpa2VUaHJvdWdoXG4gICAgICAgICAgICBcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LmNvbG9yID0gaWYgIWlzTG9ja2VkKGZsYWdzLmNvbG9yKSB0aGVuIG5ldyBDb2xvcihAcGFyYW1zLmNvbG9yKSBlbHNlIGZvbnQuY29sb3JcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LmJvcmRlciA9IGlmICFpc0xvY2tlZChmbGFncy5vdXRsaW5lKXRoZW4gQHBhcmFtcy5vdXRsaW5lIGVsc2UgZm9udC5ib3JkZXJcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LmJvcmRlckNvbG9yID0gaWYgIWlzTG9ja2VkKGZsYWdzLm91dGxpbmVDb2xvcikgdGhlbiBuZXcgQ29sb3IoQHBhcmFtcy5vdXRsaW5lQ29sb3IpIGVsc2UgbmV3IENvbG9yKGZvbnQuYm9yZGVyQ29sb3IpXG4gICAgICAgIHRleHRTcHJpdGUuZm9udC5ib3JkZXJTaXplID0gaWYgIWlzTG9ja2VkKGZsYWdzLm91dGxpbmVTaXplKSB0aGVuIEBwYXJhbXMub3V0bGluZVNpemUgZWxzZSBmb250LmJvcmRlclNpemVcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LnNoYWRvdyA9IGlmICFpc0xvY2tlZChmbGFncy5zaGFkb3cpdGhlbiBAcGFyYW1zLnNoYWRvdyBlbHNlIGZvbnQuc2hhZG93XG4gICAgICAgIHRleHRTcHJpdGUuZm9udC5zaGFkb3dDb2xvciA9IGlmICFpc0xvY2tlZChmbGFncy5zaGFkb3dDb2xvcikgdGhlbiBuZXcgQ29sb3IoQHBhcmFtcy5zaGFkb3dDb2xvcikgZWxzZSBuZXcgQ29sb3IoZm9udC5zaGFkb3dDb2xvcilcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LnNoYWRvd09mZnNldFggPSBpZiAhaXNMb2NrZWQoZmxhZ3Muc2hhZG93T2Zmc2V0WCkgdGhlbiBAcGFyYW1zLnNoYWRvd09mZnNldFggZWxzZSBmb250LnNoYWRvd09mZnNldFhcbiAgICAgICAgdGV4dFNwcml0ZS5mb250LnNoYWRvd09mZnNldFkgPSBpZiAhaXNMb2NrZWQoZmxhZ3Muc2hhZG93T2Zmc2V0WSkgdGhlbiBAcGFyYW1zLnNoYWRvd09mZnNldFkgZWxzZSBmb250LnNoYWRvd09mZnNldFlcbiAgICAgICAgdGV4dFNwcml0ZS5iZWhhdmlvci5yZWZyZXNoKClcbiAgICAgICAgdGV4dFNwcml0ZS51cGRhdGUoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRDaGFuZ2VUZXh0U2V0dGluZ3NcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBjb21tYW5kVGV4dERlZmF1bHRzOiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnRleHRcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBcbiAgICAgICAgaWYgIWlzTG9ja2VkKGZsYWdzLmFwcGVhckR1cmF0aW9uKSB0aGVuIGRlZmF1bHRzLmFwcGVhckR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmFwcGVhckR1cmF0aW9uKVxuICAgICAgICBpZiAhaXNMb2NrZWQoZmxhZ3MuZGlzYXBwZWFyRHVyYXRpb24pIHRoZW4gZGVmYXVsdHMuZGlzYXBwZWFyRHVyYXRpb24gPSBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZGlzYXBwZWFyRHVyYXRpb24pXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy56T3JkZXIpIHRoZW4gZGVmYXVsdHMuek9yZGVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy56T3JkZXIpXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImFwcGVhckVhc2luZy50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmFwcGVhckVhc2luZyA9IEBwYXJhbXMuYXBwZWFyRWFzaW5nXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImFwcGVhckFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmFwcGVhckFuaW1hdGlvbiA9IEBwYXJhbXMuYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImRpc2FwcGVhckVhc2luZy50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmRpc2FwcGVhckVhc2luZyA9IEBwYXJhbXMuZGlzYXBwZWFyRWFzaW5nXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcImRpc2FwcGVhckFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIGRlZmF1bHRzLmRpc2FwcGVhckFuaW1hdGlvbiA9IEBwYXJhbXMuZGlzYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFnc1tcIm1vdGlvbkJsdXIuZW5hYmxlZFwiXSkgdGhlbiBkZWZhdWx0cy5tb3Rpb25CbHVyID0gQHBhcmFtcy5tb3Rpb25CbHVyXG4gICAgICAgIGlmICFpc0xvY2tlZChmbGFncy5vcmlnaW4pIHRoZW4gZGVmYXVsdHMub3JpZ2luID0gQHBhcmFtcy5vcmlnaW5cbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTaG93VGV4dFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgY29tbWFuZFNob3dUZXh0OiAtPlxuICAgICAgICBkZWZhdWx0cyA9IEdhbWVNYW5hZ2VyLmRlZmF1bHRzLnRleHRcbiAgICAgICAgZmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgaXNMb2NrZWQgPSBncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZFxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VUZXh0RG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdGV4dCA9IEBwYXJhbXMudGV4dFxuICAgICAgICB0ZXh0cyA9IHNjZW5lLnRleHRzXG4gICAgICAgIGlmIG5vdCB0ZXh0c1tudW1iZXJdPyB0aGVuIHRleHRzW251bWJlcl0gPSBuZXcgZ3MuT2JqZWN0X1RleHQoKVxuICAgICAgICBcbiAgICAgICAgeCA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueClcbiAgICAgICAgeSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMucG9zaXRpb24ueSlcbiAgICAgICAgdGV4dE9iamVjdCA9IHRleHRzW251bWJlcl1cbiAgICAgICAgdGV4dE9iamVjdC5kb21haW4gPSBAcGFyYW1zLm51bWJlckRvbWFpblxuICAgICAgICBcbiAgICAgICAgZWFzaW5nID0gaWYgIWlzTG9ja2VkKGZsYWdzW1wiZWFzaW5nLnR5cGVcIl0pIHRoZW4gZ3MuRWFzaW5ncy5mcm9tVmFsdWVzKEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuZWFzaW5nLnR5cGUpLCBAcGFyYW1zLmVhc2luZy5pbk91dCkgZWxzZSBncy5FYXNpbmdzLmZyb21PYmplY3QoZGVmYXVsdHMuYXBwZWFyRWFzaW5nKVxuICAgICAgICBkdXJhdGlvbiA9IGlmICFpc0xvY2tlZChmbGFncy5kdXJhdGlvbikgdGhlbiBAaW50ZXJwcmV0ZXIuZHVyYXRpb25WYWx1ZU9mKEBwYXJhbXMuZHVyYXRpb24pIGVsc2UgZGVmYXVsdHMuYXBwZWFyRHVyYXRpb25cbiAgICAgICAgb3JpZ2luID0gaWYgIWlzTG9ja2VkKGZsYWdzLm9yaWdpbikgdGhlbiBAcGFyYW1zLm9yaWdpbiBlbHNlIGRlZmF1bHRzLm9yaWdpblxuICAgICAgICB6SW5kZXggPSBpZiAhaXNMb2NrZWQoZmxhZ3Muek9yZGVyKSB0aGVuIEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMuek9yZGVyKSBlbHNlIGRlZmF1bHRzLnpPcmRlclxuICAgICAgICBhbmltYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3NbXCJhbmltYXRpb24udHlwZVwiXSkgdGhlbiBAcGFyYW1zLmFuaW1hdGlvbiBlbHNlIGRlZmF1bHRzLmFwcGVhckFuaW1hdGlvblxuICAgICAgICBwb3NpdGlvbkFuY2hvciA9IGlmICFpc0xvY2tlZChmbGFncy5wb3NpdGlvbk9yaWdpbikgdGhlbiBAaW50ZXJwcmV0ZXIuZ3JhcGhpY0FuY2hvclBvaW50c0J5Q29uc3RhbnRbQHBhcmFtcy5wb3NpdGlvbk9yaWdpbl0gfHwgbmV3IGdzLlBvaW50KDAsIDApIGVsc2UgQGludGVycHJldGVyLmdyYXBoaWNBbmNob3JQb2ludHNCeUNvbnN0YW50W2RlZmF1bHRzLnBvc2l0aW9uT3JpZ2luXVxuICAgICAgICBcbiAgICAgICAgdGV4dE9iamVjdC50ZXh0ID0gdGV4dFxuICAgICAgICB0ZXh0T2JqZWN0LmRzdFJlY3QueCA9IHggXG4gICAgICAgIHRleHRPYmplY3QuZHN0UmVjdC55ID0geSBcbiAgICAgICAgdGV4dE9iamVjdC5ibGVuZE1vZGUgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmJsZW5kTW9kZSlcbiAgICAgICAgdGV4dE9iamVjdC5hbmNob3IueCA9IGlmIG9yaWdpbiA9PSAwIHRoZW4gMCBlbHNlIDAuNVxuICAgICAgICB0ZXh0T2JqZWN0LmFuY2hvci55ID0gaWYgb3JpZ2luID09IDAgdGhlbiAwIGVsc2UgMC41XG4gICAgICAgIHRleHRPYmplY3QucG9zaXRpb25BbmNob3IueCA9IHBvc2l0aW9uQW5jaG9yLnhcbiAgICAgICAgdGV4dE9iamVjdC5wb3NpdGlvbkFuY2hvci55ID0gcG9zaXRpb25BbmNob3IueVxuICAgICAgICB0ZXh0T2JqZWN0LnpJbmRleCA9IHpJbmRleCB8fCAgKDcwMCArIG51bWJlcilcbiAgICAgICAgdGV4dE9iamVjdC5zaXplVG9GaXQgPSB5ZXNcbiAgICAgICAgdGV4dE9iamVjdC5mb3JtYXR0aW5nID0geWVzXG4gICAgICAgIGlmIEBwYXJhbXMudmlld3BvcnQ/LnR5cGUgPT0gXCJzY2VuZVwiXG4gICAgICAgICAgICB0ZXh0T2JqZWN0LnZpZXdwb3J0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yLnZpZXdwb3J0XG4gICAgICAgIHRleHRPYmplY3QudXBkYXRlKClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMucG9zaXRpb25UeXBlID09IDBcbiAgICAgICAgICAgIHAgPSBAaW50ZXJwcmV0ZXIucHJlZGVmaW5lZE9iamVjdFBvc2l0aW9uKEBwYXJhbXMucHJlZGVmaW5lZFBvc2l0aW9uSWQsIHRleHRPYmplY3QsIEBwYXJhbXMpXG4gICAgICAgICAgICB0ZXh0T2JqZWN0LmRzdFJlY3QueCA9IHAueFxuICAgICAgICAgICAgdGV4dE9iamVjdC5kc3RSZWN0LnkgPSBwLnlcbiAgICAgICAgICAgIFxuICAgICAgICB0ZXh0T2JqZWN0LmFuaW1hdG9yLmFwcGVhcih4LCB5LCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24pXG4gICAgICAgIFxuICAgICAgICBpZiBAcGFyYW1zLndhaXRGb3JDb21wbGV0aW9uIGFuZCBub3QgKGR1cmF0aW9uID09IDAgb3IgQGludGVycHJldGVyLmlzSW5zdGFudFNraXAoKSlcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IGR1cmF0aW9uXG4gICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFRleHRNb3Rpb25CbHVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kVGV4dE1vdGlvbkJsdXI6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0ZXh0ID0gc2NlbmUudGV4dHNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdGV4dD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRleHQubW90aW9uQmx1ci5zZXQoQHBhcmFtcy5tb3Rpb25CbHVyKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRSZWZyZXNoVGV4dFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgXG4gICAgY29tbWFuZFJlZnJlc2hUZXh0OiAtPlxuICAgICAgICBzY2VuZSA9IFNjZW5lTWFuYWdlci5zY2VuZVxuICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VUZXh0RG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICBudW1iZXIgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcilcbiAgICAgICAgdGV4dHMgPSBzY2VuZS50ZXh0c1xuICAgICAgICBpZiBub3QgdGV4dHNbbnVtYmVyXT8gdGhlbiByZXR1cm5cblxuICAgICAgICB0ZXh0c1tudW1iZXJdLmJlaGF2aW9yLnJlZnJlc2goeWVzKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZE1vdmVUZXh0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRNb3ZlVGV4dDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB0ZXh0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm1vdmVPYmplY3QodGV4dCwgQHBhcmFtcy5waWN0dXJlLnBvc2l0aW9uLCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kTW92ZVRleHRQYXRoXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRNb3ZlVGV4dFBhdGg6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0ZXh0ID0gc2NlbmUudGV4dHNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdGV4dD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEBpbnRlcnByZXRlci5tb3ZlT2JqZWN0UGF0aCh0ZXh0LCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUm90YXRlVGV4dFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICBjb21tYW5kUm90YXRlVGV4dDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB0ZXh0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnJvdGF0ZU9iamVjdCh0ZXh0LCBAcGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kWm9vbVRleHRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgIFxuICAgIGNvbW1hbmRab29tVGV4dDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB0ZXh0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnpvb21PYmplY3QodGV4dCwgQHBhcmFtcylcbiAgICAgICAgXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRCbGVuZFRleHRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kQmxlbmRUZXh0OiAtPlxuICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgdGV4dCA9IFNjZW5lTWFuYWdlci5zY2VuZS50ZXh0c1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgIGlmIG5vdCB0ZXh0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmJsZW5kT2JqZWN0KHRleHQsIEBwYXJhbXMpICBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ29sb3JUZXh0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgY29tbWFuZENvbG9yVGV4dDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tudW1iZXJdXG4gICAgICAgIGR1cmF0aW9uID0gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKVxuICAgICAgICBlYXNpbmcgPSBncy5FYXNpbmdzLmZyb21PYmplY3QoQHBhcmFtcy5lYXNpbmcpXG4gICAgICAgIFxuICAgICAgICBpZiB0ZXh0P1xuICAgICAgICAgICAgdGV4dC5hbmltYXRvci5jb2xvclRvKG5ldyBDb2xvcihAcGFyYW1zLmNvbG9yKSwgZHVyYXRpb24sIGVhc2luZylcbiAgICAgICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5pc1dhaXRpbmcgPSB5ZXNcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBkdXJhdGlvbiBcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kRXJhc2VUZXh0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgIFxuICAgIGNvbW1hbmRFcmFzZVRleHQ6IC0+XG4gICAgICAgIGRlZmF1bHRzID0gR2FtZU1hbmFnZXIuZGVmYXVsdHMudGV4dFxuICAgICAgICBmbGFncyA9IEBwYXJhbXMuZmllbGRGbGFncyB8fCB7fVxuICAgICAgICBpc0xvY2tlZCA9IGdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkXG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgIG51bWJlciA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKVxuICAgICAgICB0ZXh0ID0gc2NlbmUudGV4dHNbbnVtYmVyXVxuICAgICAgICBpZiBub3QgdGV4dD8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGVhc2luZyA9IGlmICFpc0xvY2tlZChmbGFnc1tcImVhc2luZy50eXBlXCJdKSB0aGVuIGdzLkVhc2luZ3MuZnJvbVZhbHVlcyhAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLmVhc2luZy50eXBlKSwgQHBhcmFtcy5lYXNpbmcuaW5PdXQpIGVsc2UgZ3MuRWFzaW5ncy5mcm9tT2JqZWN0KGRlZmF1bHRzLmRpc2FwcGVhckVhc2luZylcbiAgICAgICAgZHVyYXRpb24gPSBpZiAhaXNMb2NrZWQoZmxhZ3MuZHVyYXRpb24pIHRoZW4gQGludGVycHJldGVyLmR1cmF0aW9uVmFsdWVPZihAcGFyYW1zLmR1cmF0aW9uKSBlbHNlIGRlZmF1bHRzLmRpc2FwcGVhckR1cmF0aW9uXG4gICAgICAgIGFuaW1hdGlvbiA9IGlmICFpc0xvY2tlZChmbGFnc1tcImFuaW1hdGlvbi50eXBlXCJdKSB0aGVuIEBwYXJhbXMuYW5pbWF0aW9uIGVsc2UgZGVmYXVsdHMuZGlzYXBwZWFyQW5pbWF0aW9uXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGV4dC5hbmltYXRvci5kaXNhcHBlYXIoYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCAoc2VuZGVyKSA9PiBcbiAgICAgICAgICAgIHNlbmRlci5kaXNwb3NlKClcbiAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oc2VuZGVyLmRvbWFpbilcbiAgICAgICAgICAgIHNjZW5lLnRleHRzW251bWJlcl0gPSBudWxsXG4gICAgICAgIClcbiAgICAgICAgXG4gICAgICAgIGlmIEBwYXJhbXMud2FpdEZvckNvbXBsZXRpb24gYW5kIG5vdCAoZHVyYXRpb24gPT0gMCBvciBAaW50ZXJwcmV0ZXIuaXNJbnN0YW50U2tpcCgpKVxuICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICAgICAgQGludGVycHJldGVyLndhaXRDb3VudGVyID0gZHVyYXRpb24gXG4gICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0TWlub3JDaGFuZ2UoKVxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFRleHRFZmZlY3RcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kVGV4dEVmZmVjdDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgbnVtYmVyID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXG4gICAgICAgIHRleHQgPSBzY2VuZS50ZXh0c1tudW1iZXJdXG4gICAgICAgIGlmIG5vdCB0ZXh0PyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLm9iamVjdEVmZmVjdCh0ZXh0LCBAcGFyYW1zKVxuICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdE1pbm9yQ2hhbmdlKClcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRJbnB1dFRleHRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZElucHV0VGV4dDogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgaWYgKEdhbWVNYW5hZ2VyLnNldHRpbmdzLmFsbG93Q2hvaWNlU2tpcHx8QGludGVycHJldGVyLnByZXZpZXcpIGFuZCBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgQGludGVycHJldGVyLm1lc3NhZ2VPYmplY3QoKS5iZWhhdmlvci5jbGVhcigpXG4gICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnZhcmlhYmxlLCBcIlwiKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgICAgICBpZiBAaW50ZXJwcmV0ZXIuaXNQcm9jZXNzaW5nTWVzc2FnZUluT3RoZXJDb250ZXh0KClcbiAgICAgICAgICAgIEBpbnRlcnByZXRlci53YWl0Rm9yTWVzc2FnZSgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgICR0ZW1wRmllbGRzLmxldHRlcnMgPSBAcGFyYW1zLmxldHRlcnNcbiAgICAgICAgc2NlbmUuYmVoYXZpb3Iuc2hvd0lucHV0VGV4dChAcGFyYW1zLmxldHRlcnMsIGdzLkNhbGxCYWNrKFwib25JbnB1dFRleHRGaW5pc2hcIiwgQGludGVycHJldGVyLCBAaW50ZXJwcmV0ZXIpKSAgXG4gICAgICAgIEBpbnRlcnByZXRlci53YWl0aW5nRm9yLmlucHV0VGV4dCA9IEBwYXJhbXNcbiAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RNaW5vckNoYW5nZSgpXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2F2ZVBlcnNpc3RlbnREYXRhXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIGNvbW1hbmRTYXZlUGVyc2lzdGVudERhdGE6IC0+IEdhbWVNYW5hZ2VyLnNhdmVHbG9iYWxEYXRhKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTYXZlU2V0dGluZ3NcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZFNhdmVTZXR0aW5nczogLT4gR2FtZU1hbmFnZXIuc2F2ZVNldHRpbmdzKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRQcmVwYXJlU2F2ZUdhbWVcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY29tbWFuZFByZXBhcmVTYXZlR2FtZTogLT5cbiAgICAgICAgaWYgQGludGVycHJldGVyLnByZXZpZXdEYXRhPyB0aGVuIHJldHVyblxuICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLnBvaW50ZXIrK1xuICAgICAgICBHYW1lTWFuYWdlci5wcmVwYXJlU2F2ZUdhbWUoQHBhcmFtcy5zbmFwc2hvdClcbiAgICAgICAgQGludGVycHJldGVyLnBvaW50ZXItLVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRTYXZlR2FtZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kU2F2ZUdhbWU6IC0+XG4gICAgICAgIGlmIEBpbnRlcnByZXRlci5wcmV2aWV3RGF0YT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIHRodW1iV2lkdGggPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLnRodW1iV2lkdGgpXG4gICAgICAgIHRodW1iSGVpZ2h0ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy50aHVtYkhlaWdodClcbiAgICAgICAgXG4gICAgICAgIEdhbWVNYW5hZ2VyLnNhdmUoQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zbG90KSAtIDEsIHRodW1iV2lkdGgsIHRodW1iSGVpZ2h0KVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBAbWV0aG9kIGNvbW1hbmRMb2FkR2FtZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kTG9hZEdhbWU6IC0+XG4gICAgICAgIGlmIEBpbnRlcnByZXRlci5wcmV2aWV3RGF0YT8gdGhlbiByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIEdhbWVNYW5hZ2VyLmxvYWQoQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5zbG90KSAtIDEpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFdhaXRGb3JJbnB1dFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBjb21tYW5kV2FpdEZvcklucHV0OiAtPlxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlRG93blwiLCBAb2JqZWN0KVxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlVXBcIiwgQG9iamVjdClcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9mZkJ5T3duZXIoXCJrZXlEb3duXCIsIEBvYmplY3QpXG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgXG4gICAgICAgIGYgPSA9PlxuICAgICAgICAgICAgZXhlY3V0ZUFjdGlvbiA9IG5vXG4gICAgICAgICAgICBpZiBJbnB1dC5Nb3VzZS5pc0J1dHRvbihAcGFyYW1zLmtleSlcbiAgICAgICAgICAgICAgICBleGVjdXRlQWN0aW9uID0gSW5wdXQuTW91c2UuYnV0dG9uc1tAcGFyYW1zLmtleV0gPT0gQHBhcmFtcy5zdGF0ZVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGV4ZWN1dGVBY3Rpb24gPSBJbnB1dC5rZXlzW0BwYXJhbXMua2V5XSA9PSBAcGFyYW1zLnN0YXRlXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBleGVjdXRlQWN0aW9uXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub2ZmQnlPd25lcihcIm1vdXNlRG93blwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwibW91c2VVcFwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5RG93blwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vZmZCeU93bmVyKFwia2V5VXBcIiwgQG9iamVjdClcbiAgICAgICAgICAgIFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZURvd25cIiwgZiwgbnVsbCwgQG9iamVjdFxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJtb3VzZVVwXCIsIGYsIG51bGwsIEBvYmplY3RcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwia2V5RG93blwiLCBmLCBudWxsLCBAb2JqZWN0XG4gICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5vbiBcIktleVVwXCIsIGYsIG51bGwsIEBvYmplY3RcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgQGludGVycHJldGVyLmlzV2FpdGluZyA9IHllc1xuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEdldElucHV0RGF0YVxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIGNvbW1hbmRHZXRJbnB1dERhdGE6IC0+XG4gICAgICAgIHN3aXRjaCBAcGFyYW1zLmZpZWxkXG4gICAgICAgICAgICB3aGVuIDAgIyBCdXR0b24gQVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuQV0pXG4gICAgICAgICAgICB3aGVuIDEgIyBCdXR0b24gQlxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuQl0pXG4gICAgICAgICAgICB3aGVuIDIgIyBCdXR0b24gWFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuWF0pXG4gICAgICAgICAgICB3aGVuIDMgIyBCdXR0b24gWVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuWV0pXG4gICAgICAgICAgICB3aGVuIDQgIyBCdXR0b24gTFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuTF0pXG4gICAgICAgICAgICB3aGVuIDUgIyBCdXR0b24gUlxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0LmtleXNbSW5wdXQuUl0pXG4gICAgICAgICAgICB3aGVuIDYgIyBCdXR0b24gU1RBUlRcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBJbnB1dC5rZXlzW0lucHV0LlNUQVJUXSlcbiAgICAgICAgICAgIHdoZW4gNyAjIEJ1dHRvbiBTRUxFQ1RcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBJbnB1dC5rZXlzW0lucHV0LlNFTEVDVF0pXG4gICAgICAgICAgICB3aGVuIDggIyBNb3VzZSBYXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgSW5wdXQuTW91c2UueClcbiAgICAgICAgICAgIHdoZW4gOSAjIE1vdXNlIFlcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBJbnB1dC5Nb3VzZS55KVxuICAgICAgICAgICAgd2hlbiAxMCAjIE1vdXNlIFdoZWVsXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgSW5wdXQuTW91c2Uud2hlZWwpXG4gICAgICAgICAgICB3aGVuIDExICMgTW91c2UgTGVmdFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIElucHV0Lk1vdXNlLmJ1dHRvbnNbSW5wdXQuTW91c2UuTEVGVF0pXG4gICAgICAgICAgICB3aGVuIDEyICMgTW91c2UgUmlnaHRcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLlJJR0hUXSlcbiAgICAgICAgICAgIHdoZW4gMTMgIyBNb3VzZSBNaWRkbGVcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLk1JRERMRV0pXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kR2V0R2FtZURhdGFcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgICBcbiAgICBjb21tYW5kR2V0R2FtZURhdGE6IC0+XG4gICAgICAgIHRlbXBTZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5nc1xuICAgICAgICBzZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnNldHRpbmdzXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy5maWVsZFxuICAgICAgICAgICAgd2hlbiAwICMgU2NlbmUgSURcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBTY2VuZU1hbmFnZXIuc2NlbmUuc2NlbmVEb2N1bWVudC51aWQpXG4gICAgICAgICAgICB3aGVuIDEgIyBHYW1lIFRpbWUgLSBTZWNvbmRzXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgTWF0aC5yb3VuZChHcmFwaGljcy5mcmFtZUNvdW50IC8gNjApKVxuICAgICAgICAgICAgd2hlbiAyICMgR2FtZSBUaW1lIC0gTWludXRlc1xuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIE1hdGgucm91bmQoR3JhcGhpY3MuZnJhbWVDb3VudCAvIDYwIC8gNjApKVxuICAgICAgICAgICAgd2hlbiAzICMgR2FtZSBUaW1lIC0gSG91cnNcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBNYXRoLnJvdW5kKEdyYXBoaWNzLmZyYW1lQ291bnQgLyA2MCAvIDYwIC8gNjApKVxuICAgICAgICAgICAgd2hlbiA0ICMgRGF0ZSAtIERheSBvZiBNb250aFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIG5ldyBEYXRlKCkuZ2V0RGF0ZSgpKVxuICAgICAgICAgICAgd2hlbiA1ICMgRGF0ZSAtIERheSBvZiBXZWVrXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgbmV3IERhdGUoKS5nZXREYXkoKSlcbiAgICAgICAgICAgIHdoZW4gNiAjIERhdGUgLSBNb250aFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIG5ldyBEYXRlKCkuZ2V0TW9udGgoKSlcbiAgICAgICAgICAgIHdoZW4gNyAjIERhdGUgLSBZZWFyXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpKVxuICAgICAgICAgICAgd2hlbiA4XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLmFsbG93U2tpcClcbiAgICAgICAgICAgIHdoZW4gOVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy5hbGxvd1NraXBVbnJlYWRNZXNzYWdlcylcbiAgICAgICAgICAgIHdoZW4gMTBcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy5tZXNzYWdlU3BlZWQpXG4gICAgICAgICAgICB3aGVuIDExXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWQpXG4gICAgICAgICAgICB3aGVuIDEyXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc2V0dGluZ3MuYXV0b01lc3NhZ2UudGltZSlcbiAgICAgICAgICAgIHdoZW4gMTNcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc2V0dGluZ3MuYXV0b01lc3NhZ2Uud2FpdEZvclZvaWNlKVxuICAgICAgICAgICAgd2hlbiAxNFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy5hdXRvTWVzc2FnZS5zdG9wT25BY3Rpb24pXG4gICAgICAgICAgICB3aGVuIDE1XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLnRpbWVNZXNzYWdlVG9Wb2ljZSlcbiAgICAgICAgICAgIHdoZW4gMTZcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc2V0dGluZ3MuYWxsb3dWaWRlb1NraXApXG4gICAgICAgICAgICB3aGVuIDE3XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLmFsbG93Q2hvaWNlU2tpcClcbiAgICAgICAgICAgIHdoZW4gMThcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0Qm9vbGVhblZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc2V0dGluZ3Muc2tpcFZvaWNlT25BY3Rpb24pXG4gICAgICAgICAgICB3aGVuIDE5XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLmZ1bGxTY3JlZW4pXG4gICAgICAgICAgICB3aGVuIDIwXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLmFkanVzdEFzcGVjdFJhdGlvKVxuICAgICAgICAgICAgd2hlbiAyMVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy5jb25maXJtYXRpb24pXG4gICAgICAgICAgICB3aGVuIDIyXG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgc2V0dGluZ3MuYmdtVm9sdW1lKVxuICAgICAgICAgICAgd2hlbiAyM1xuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLnZvaWNlVm9sdW1lKVxuICAgICAgICAgICAgd2hlbiAyNFxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLnNlVm9sdW1lKVxuICAgICAgICAgICAgd2hlbiAyNVxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy5iZ21FbmFibGVkKVxuICAgICAgICAgICAgd2hlbiAyNlxuICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBzZXR0aW5ncy52b2ljZUVuYWJsZWQpXG4gICAgICAgICAgICB3aGVuIDI3XG4gICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIHNldHRpbmdzLnNlRW5hYmxlZClcbiAgICAgICAgICAgIHdoZW4gMjggIyBMYW5ndWFnZSAtIENvZGVcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBMYW5ndWFnZU1hbmFnZXIubGFuZ3VhZ2U/LmNvZGUgfHwgXCJcIilcbiAgICAgICAgICAgIHdoZW4gMjkgIyBMYW5ndWFnZSAtIE5hbWVcbiAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBMYW5ndWFnZU1hbmFnZXIubGFuZ3VhZ2U/Lm5hbWUgfHwgXCJcIikgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kU2V0R2FtZURhdGFcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kU2V0R2FtZURhdGE6IC0+XG4gICAgICAgIHRlbXBTZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5nc1xuICAgICAgICBzZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnNldHRpbmdzXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggQHBhcmFtcy5maWVsZFxuICAgICAgICAgICAgd2hlbiAwXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuYWxsb3dTa2lwID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDFcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5hbGxvd1NraXBVbnJlYWRNZXNzYWdlcyA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgd2hlbiAyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MubWVzc2FnZVNwZWVkID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gM1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLmF1dG9NZXNzYWdlLmVuYWJsZWQgPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gNFxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmF1dG9NZXNzYWdlLnRpbWUgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKVxuICAgICAgICAgICAgd2hlbiA1XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuYXV0b01lc3NhZ2Uud2FpdEZvclZvaWNlID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDZcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5hdXRvTWVzc2FnZS5zdG9wT25BY3Rpb24gPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gN1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnRpbWVNZXNzYWdlVG9Wb2ljZSA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgd2hlbiA4XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuYWxsb3dWaWRlb1NraXAgPSBAaW50ZXJwcmV0ZXIuYm9vbGVhblZhbHVlT2YoQHBhcmFtcy5zd2l0Y2hWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gOVxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmFsbG93Q2hvaWNlU2tpcCA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgd2hlbiAxMFxuICAgICAgICAgICAgICAgIHNldHRpbmdzLnNraXBWb2ljZU9uQWN0aW9uID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDExXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuZnVsbFNjcmVlbiA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgICAgIGlmIHNldHRpbmdzLmZ1bGxTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLmJlaGF2aW9yLmVudGVyRnVsbFNjcmVlbigpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXIuc2NlbmUuYmVoYXZpb3IubGVhdmVGdWxsU2NyZWVuKClcbiAgICAgICAgICAgIHdoZW4gMTJcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5hZGp1c3RBc3BlY3RSYXRpbyA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgICAgIEdyYXBoaWNzLmtlZXBSYXRpbyA9IHNldHRpbmdzLmFkanVzdEFzcGVjdFJhdGlvXG4gICAgICAgICAgICAgICAgR3JhcGhpY3Mub25SZXNpemUoKVxuICAgICAgICAgICAgd2hlbiAxM1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpcm1hdGlvbiA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgd2hlbiAxNFxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmJnbVZvbHVtZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDE1XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Mudm9pY2VWb2x1bWUgPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKVxuICAgICAgICAgICAgd2hlbiAxNlxuICAgICAgICAgICAgICAgIHNldHRpbmdzLnNlVm9sdW1lID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSlcbiAgICAgICAgICAgIHdoZW4gMTdcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5iZ21FbmFibGVkID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDE4XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Mudm9pY2VFbmFibGVkID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpXG4gICAgICAgICAgICB3aGVuIDE5XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Muc2VFbmFibGVkID0gQGludGVycHJldGVyLmJvb2xlYW5WYWx1ZU9mKEBwYXJhbXMuc3dpdGNoVmFsdWUpICAgXG4gICAgICAgICAgICB3aGVuIDIwIFxuICAgICAgICAgICAgICAgIGNvZGUgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnRleHRWYWx1ZSlcbiAgICAgICAgICAgICAgICBsYW5ndWFnZSA9IExhbmd1YWdlTWFuYWdlci5sYW5ndWFnZXMuZmlyc3QgKGwpID0+IGwuY29kZSA9PSBjb2RlXG4gICAgICAgICAgICAgICAgTGFuZ3VhZ2VNYW5hZ2VyLnNlbGVjdExhbmd1YWdlKGxhbmd1YWdlKSBpZiBsYW5ndWFnZVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZEdldE9iamVjdERhdGFcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBjb21tYW5kR2V0T2JqZWN0RGF0YTogLT5cbiAgICAgICAgc2NlbmUgPSBTY2VuZU1hbmFnZXIuc2NlbmVcbiAgICAgICAgc3dpdGNoIEBwYXJhbXMub2JqZWN0VHlwZVxuICAgICAgICAgICAgd2hlbiAwICMgUGljdHVyZVxuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVBpY3R1cmVEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLnBpY3R1cmVzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKV1cbiAgICAgICAgICAgIHdoZW4gMSAjIEJhY2tncm91bmRcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBTY2VuZU1hbmFnZXIuc2NlbmUuYmFja2dyb3VuZHNbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5sYXllcildXG4gICAgICAgICAgICB3aGVuIDIgIyBUZXh0XG4gICAgICAgICAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVGV4dERvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBTY2VuZU1hbmFnZXIuc2NlbmUudGV4dHNbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXVxuICAgICAgICAgICAgd2hlbiAzICMgTW92aWVcbiAgICAgICAgICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VWaWRlb0RvbWFpbihAcGFyYW1zLm51bWJlckRvbWFpbilcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBTY2VuZU1hbmFnZXIuc2NlbmUudmlkZW9zW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKV1cbiAgICAgICAgICAgIHdoZW4gNCAjIENoYXJhY3RlclxuICAgICAgICAgICAgICAgIGNoYXJhY3RlcklkID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy5jaGFyYWN0ZXJJZClcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBTY2VuZU1hbmFnZXIuc2NlbmUuY2hhcmFjdGVycy5maXJzdCAodikgPT4gIXYuZGlzcG9zZWQgYW5kIHYucmlkID09IGNoYXJhY3RlcklkXG4gICAgICAgICAgICB3aGVuIDUgIyBNZXNzYWdlIEJveFxuICAgICAgICAgICAgICAgIG9iamVjdCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwibWVzc2FnZUJveFwiKVxuICAgICAgICAgICAgd2hlbiA2ICMgTWVzc2FnZSBBcmVhXG4gICAgICAgICAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlTWVzc2FnZUFyZWFEb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgICAgICAgICAgYXJlYSA9IFNjZW5lTWFuYWdlci5zY2VuZS5tZXNzYWdlQXJlYXNbQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXIpXVxuICAgICAgICAgICAgICAgIG9iamVjdCA9IGFyZWE/LmxheW91dFxuICAgICAgICAgICAgd2hlbiA3ICMgSG90c3BvdFxuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZUhvdHNwb3REb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmhvdHNwb3RzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKV1cbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgZmllbGQgPSBAcGFyYW1zLmZpZWxkXG4gICAgICAgIGlmIEBwYXJhbXMub2JqZWN0VHlwZSA9PSA0ICMgQ2hhcmFjdGVyXG4gICAgICAgICAgICBzd2l0Y2ggQHBhcmFtcy5maWVsZFxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIElEXG4gICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyc1tjaGFyYWN0ZXJJZF0/LmluZGV4IHx8IFwiXCIpXG4gICAgICAgICAgICAgICAgd2hlbiAxICMgTmFtZVxuICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBsY3MoUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW2NoYXJhY3RlcklkXT8ubmFtZSkgfHwgXCJcIilcbiAgICAgICAgICAgIGZpZWxkIC09IDJcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBvYmplY3Q/ICAgICAgICBcbiAgICAgICAgICAgIGlmIGZpZWxkID49IDBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggZmllbGRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgUmVzb3VyY2UgTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIEBwYXJhbXMub2JqZWN0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBvYmplY3QudGV4dCB8fCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0U3RyaW5nVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBvYmplY3QudmlkZW8gfHwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRTdHJpbmdWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIG9iamVjdC5pbWFnZSB8fCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEgIyBQb3NpdGlvbiAtIFhcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXROdW1iZXJWYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIG9iamVjdC5kc3RSZWN0LngpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMiAjIFBvc2l0aW9uIC0gWVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgb2JqZWN0LmRzdFJlY3QueSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgQW5jaG9yIC0gWFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgTWF0aC5yb3VuZChvYmplY3QuYW5jaG9yLnggKiAxMDApKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDQgIyBBbmNob3IgLSBZXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBNYXRoLnJvdW5kKG9iamVjdC5hbmNob3IueSAqIDEwMCkpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gNSAjIFpvb20gLSBYXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBNYXRoLnJvdW5kKG9iamVjdC56b29tLnggKiAxMDApKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDYgIyBab29tIC0gWVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgTWF0aC5yb3VuZChvYmplY3Quem9vbS55ICogMTAwKSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiA3ICMgU2l6ZSAtIFdpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBvYmplY3QuZHN0UmVjdC53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgd2hlbiA4ICMgU2l6ZSAtIEhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgb2JqZWN0LmRzdFJlY3QuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDkgIyBaLUluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICBAaW50ZXJwcmV0ZXIuc2V0TnVtYmVyVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBvYmplY3QuekluZGV4KVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEwICMgT3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgb2JqZWN0Lm9wYWNpdHkpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMTEgIyBBbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgb2JqZWN0LmFuZ2xlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEyICMgVmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldEJvb2xlYW5WYWx1ZVRvKEBwYXJhbXMudGFyZ2V0VmFyaWFibGUsIG9iamVjdC52aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEzICMgQmxlbmQgTW9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgQGludGVycHJldGVyLnNldE51bWJlclZhbHVlVG8oQHBhcmFtcy50YXJnZXRWYXJpYWJsZSwgb2JqZWN0LmJsZW5kTW9kZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxNCAjIEZsaXBwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbnRlcnByZXRlci5zZXRCb29sZWFuVmFsdWVUbyhAcGFyYW1zLnRhcmdldFZhcmlhYmxlLCBvYmplY3QubWlycm9yKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFNldE9iamVjdERhdGFcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgICAgICAgXG4gICAgY29tbWFuZFNldE9iamVjdERhdGE6IC0+XG4gICAgICAgIHNjZW5lID0gU2NlbmVNYW5hZ2VyLnNjZW5lXG4gICAgICAgIHN3aXRjaCBAcGFyYW1zLm9iamVjdFR5cGVcbiAgICAgICAgICAgIHdoZW4gMCAjIFBpY3R1cmVcbiAgICAgICAgICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VQaWN0dXJlRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICAgICAgICAgIG9iamVjdCA9IFNjZW5lTWFuYWdlci5zY2VuZS5waWN0dXJlc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgICAgICB3aGVuIDEgIyBCYWNrZ3JvdW5kXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmJhY2tncm91bmRzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubGF5ZXIpXVxuICAgICAgICAgICAgd2hlbiAyICMgVGV4dFxuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZVRleHREb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLnRleHRzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKV1cbiAgICAgICAgICAgIHdoZW4gMyAjIE1vdmllXG4gICAgICAgICAgICAgICAgc2NlbmUuYmVoYXZpb3IuY2hhbmdlVmlkZW9Eb21haW4oQHBhcmFtcy5udW1iZXJEb21haW4pXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZGVvc1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgICAgICB3aGVuIDQgIyBDaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBjaGFyYWN0ZXJJZCA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMuY2hhcmFjdGVySWQpXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gU2NlbmVNYW5hZ2VyLnNjZW5lLmNoYXJhY3RlcnMuZmlyc3QgKHYpID0+ICF2LmRpc3Bvc2VkIGFuZCB2LnJpZCA9PSBjaGFyYWN0ZXJJZFxuICAgICAgICAgICAgd2hlbiA1ICMgTWVzc2FnZSBCb3hcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcIm1lc3NhZ2VCb3hcIilcbiAgICAgICAgICAgIHdoZW4gNiAjIE1lc3NhZ2UgQXJlYVxuICAgICAgICAgICAgICAgIHNjZW5lLmJlaGF2aW9yLmNoYW5nZU1lc3NhZ2VBcmVhRG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICAgICAgICAgIGFyZWEgPSBTY2VuZU1hbmFnZXIuc2NlbmUubWVzc2FnZUFyZWFzW0BpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyKV1cbiAgICAgICAgICAgICAgICBvYmplY3QgPSBhcmVhPy5sYXlvdXRcbiAgICAgICAgICAgIHdoZW4gNyAjIEhvdHNwb3RcbiAgICAgICAgICAgICAgICBzY2VuZS5iZWhhdmlvci5jaGFuZ2VIb3RzcG90RG9tYWluKEBwYXJhbXMubnVtYmVyRG9tYWluKVxuICAgICAgICAgICAgICAgIG9iamVjdCA9IFNjZW5lTWFuYWdlci5zY2VuZS5ob3RzcG90c1tAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlcildXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBmaWVsZCA9IEBwYXJhbXMuZmllbGRcbiAgICAgICAgaWYgQHBhcmFtcy5vYmplY3RUeXBlID09IDQgIyBDaGFyYWN0ZXJcbiAgICAgICAgICAgIHN3aXRjaCBmaWVsZFxuICAgICAgICAgICAgICAgIHdoZW4gMCAjIE5hbWVcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IEBpbnRlcnByZXRlci5zdHJpbmdWYWx1ZU9mKEBwYXJhbXMudGV4dFZhbHVlKVxuICAgICAgICAgICAgICAgICAgICBpZiBvYmplY3Q/XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QubmFtZSA9IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW2NoYXJhY3RlcklkXT8ubmFtZSA9IG5hbWVcbiAgICAgICAgICAgIGZpZWxkLS1cbiAgICAgICAgICAgIFxuICAgICAgICBpZiBvYmplY3Q/ICAgICAgICBcbiAgICAgICAgICAgIGlmIGZpZWxkID49IDBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggZmllbGRcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAwICMgUmVzb3VyY2UgTmFtZSAvIFRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCBAcGFyYW1zLm9iamVjdFR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnRleHQgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnRleHRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIDNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnZpZGVvID0gQGludGVycHJldGVyLnN0cmluZ1ZhbHVlT2YoQHBhcmFtcy50ZXh0VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuaW1hZ2UgPSBAaW50ZXJwcmV0ZXIuc3RyaW5nVmFsdWVPZihAcGFyYW1zLnRleHRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAxICMgUG9zaXRpb24gLSBYXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHN0UmVjdC54ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAyICMgUG9zaXRpb24gLSBZXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZHN0UmVjdC55ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAzICMgQW5jaG9yIC0gWFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuY2hvci54ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkgLyAxMDBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiA0ICMgQW5jaG9yIC0gWVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuY2hvci55ID0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSkgLyAxMDBcbiAgICAgICAgICAgICAgICAgICAgd2hlbiA1ICMgWm9vbSAtIFhcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC56b29tLnggPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKSAvIDEwMFxuICAgICAgICAgICAgICAgICAgICB3aGVuIDYgIyBab29tIC0gWVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lnpvb20ueSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyVmFsdWUpIC8gMTAwXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gNyAjIFotSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC56SW5kZXggPSBAaW50ZXJwcmV0ZXIubnVtYmVyVmFsdWVPZihAcGFyYW1zLm51bWJlclZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDggIyBPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Qub3BhY2l0eT0gQGludGVycHJldGVyLm51bWJlclZhbHVlT2YoQHBhcmFtcy5udW1iZXJWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgd2hlbiA5ICMgQW5nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5hbmdsZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gMTAgIyBWaXNpYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlzaWJsZSA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKVxuICAgICAgICAgICAgICAgICAgICB3aGVuIDExICMgQmxlbmQgTW9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmJsZW5kTW9kZSA9IEBpbnRlcnByZXRlci5udW1iZXJWYWx1ZU9mKEBwYXJhbXMubnVtYmVyVmFsdWUpICAgIFxuICAgICAgICAgICAgICAgICAgICB3aGVuIDEyICMgRmxpcHBlZFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Lm1pcnJvciA9IEBpbnRlcnByZXRlci5ib29sZWFuVmFsdWVPZihAcGFyYW1zLnN3aXRjaFZhbHVlKSAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhbmdlU291bmRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIGNvbW1hbmRDaGFuZ2VTb3VuZHM6IC0+XG4gICAgICAgIHNvdW5kcyA9IFJlY29yZE1hbmFnZXIuc3lzdGVtLnNvdW5kc1xuICAgICAgICBmaWVsZEZsYWdzID0gQHBhcmFtcy5maWVsZEZsYWdzIHx8IHt9XG4gICAgICAgIFxuICAgICAgICBmb3Igc291bmQsIGkgaW4gQHBhcmFtcy5zb3VuZHNcbiAgICAgICAgICAgIGlmICFncy5Db21tYW5kRmllbGRGbGFncy5pc0xvY2tlZChmaWVsZEZsYWdzW1wic291bmRzLlwiK2ldKVxuICAgICAgICAgICAgICAgIHNvdW5kc1tpXSA9IEBwYXJhbXMuc291bmRzW2ldXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kQ2hhbmdlQ29sb3JzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgICAgICAgXG4gICAgY29tbWFuZENoYW5nZUNvbG9yczogLT5cbiAgICAgICAgY29sb3JzID0gUmVjb3JkTWFuYWdlci5zeXN0ZW0uY29sb3JzXG4gICAgICAgIGZpZWxkRmxhZ3MgPSBAcGFyYW1zLmZpZWxkRmxhZ3MgfHwge31cbiAgICAgICAgXG4gICAgICAgIGZvciBjb2xvciwgaSBpbiBAcGFyYW1zLmNvbG9yc1xuICAgICAgICAgICAgaWYgIWdzLkNvbW1hbmRGaWVsZEZsYWdzLmlzTG9ja2VkKGZpZWxkRmxhZ3NbXCJjb2xvcnMuXCIraV0pXG4gICAgICAgICAgICAgICAgY29sb3JzW2ldID0gbmV3IGdzLkNvbG9yKEBwYXJhbXMuY29sb3JzW2ldKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZENoYW5nZVNjcmVlbkN1cnNvclxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgIFxuICAgIGNvbW1hbmRDaGFuZ2VTY3JlZW5DdXJzb3I6IC0+XG4gICAgICAgIGlmIEBwYXJhbXMuZ3JhcGhpYz8ubmFtZT9cbiAgICAgICAgICAgIGJpdG1hcCA9IFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je0BwYXJhbXMuZ3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgR3JhcGhpY3Muc2V0Q3Vyc29yQml0bWFwKGJpdG1hcCwgQHBhcmFtcy5oeCwgQHBhcmFtcy5oeSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgR3JhcGhpY3Muc2V0Q3Vyc29yQml0bWFwKG51bGwsIDAsIDApXG4gICAgXG4gICAgIyMjKlxuICAgICogQG1ldGhvZCBjb21tYW5kUmVzZXRHbG9iYWxEYXRhXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICBcbiAgICBjb21tYW5kUmVzZXRHbG9iYWxEYXRhOiAtPlxuICAgICAgICBHYW1lTWFuYWdlci5yZXNldEdsb2JhbERhdGEoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEBtZXRob2QgY29tbWFuZFNjcmlwdFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICBcbiAgICBjb21tYW5kU2NyaXB0OiAtPlxuICAgICAgICB0cnlcbiAgICAgICAgICAgIGlmICFAcGFyYW1zLnNjcmlwdEZ1bmNcbiAgICAgICAgICAgICAgICBAcGFyYW1zLnNjcmlwdEZ1bmMgPSBldmFsKFwiKGZ1bmN0aW9uKCl7XCIgKyBAcGFyYW1zLnNjcmlwdCArIFwifSlcIilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIEBwYXJhbXMuc2NyaXB0RnVuYygpXG4gICAgICAgIGNhdGNoIGV4XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhleClcbiAgICAgICAgICAgIFxud2luZG93LkNvbW1hbmRJbnRlcnByZXRlciA9IENvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXJcbmdzLkNvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXIgPSBDb21wb25lbnRfQ29tbWFuZEludGVycHJldGVyXG4gICAgXG4gICAgICAgIFxuICAgICAgICAiXX0=
//# sourceURL=Component_CommandInterpreter_171.js