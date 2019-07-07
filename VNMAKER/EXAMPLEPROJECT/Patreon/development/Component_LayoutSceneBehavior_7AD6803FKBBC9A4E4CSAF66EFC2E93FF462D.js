var Component_LayoutSceneBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_LayoutSceneBehavior = (function(superClass) {
  extend(Component_LayoutSceneBehavior, superClass);


  /**
  * The base class of all scene-behavior components. A scene-behavior component
  * define the logic of a single game scene. 
  *
  * @module gs
  * @class Component_LayoutSceneBehavior
  * @extends gs.Component_SceneBehavior
  * @memberof gs
   */

  function Component_LayoutSceneBehavior() {
    Component_LayoutSceneBehavior.__super__.constructor.call(this);
    this.objectManager = SceneManager;
    this.layout = null;
    this.resourceContext = null;
  }


  /**
  * Initializes the scene. 
  *
  * @method initialize
   */

  Component_LayoutSceneBehavior.prototype.initialize = function() {
    Component_LayoutSceneBehavior.__super__.initialize.apply(this, arguments);
    this.resourceContext = ResourceManager.createContext();
    ResourceManager.context = this.resourceContext;
    if (this.object.layoutData == null) {
      this.object.layoutData = {
        "type": "ui.FreeLayout",
        "controls": [],
        "frame": [0, 0, 1, 1]
      };
    }
    return LanguageManager.loadBundles();
  };


  /**
  * Disposes the scene. 
  *
  * @method dispose
   */

  Component_LayoutSceneBehavior.prototype.dispose = function() {
    return Component_LayoutSceneBehavior.__super__.dispose.apply(this, arguments);
  };


  /**
  * Prepares all data for the scene and loads the necessary graphic and audio resources.
  *
  * @method prepareData
  * @abstract
   */

  Component_LayoutSceneBehavior.prototype.prepareData = function() {
    gs.ObjectManager.current = this.objectManager;
    if (!GameManager.initialized) {
      GameManager.initialize();
    }
    this.dataFields = ui.UiFactory.dataSources[this.object.layoutData.dataSource || "default"]();
    window.$dataFields = this.dataFields;
    this.music = ui.Component_FormulaHandler.fieldValue(this.object, this.object.layoutData.music);
    AudioManager.loadMusic(this.music);
    this.prepareTransition(RecordManager.system.menuTransition);
    ResourceLoader.loadUiTypesGraphics(ui.UiFactory.customTypes);
    ResourceLoader.loadUiLayoutGraphics(this.object.layoutData);
    if (this.dataFields != null) {
      ResourceLoader.loadUiDataFieldsGraphics(this.dataFields);
    }
    return ResourceManager.getBitmap("Graphics/Characters/JaneDate_Normal");
  };


  /**
  * Prepares all visual game object for the scene.
  *
  * @method prepareVisual
   */

  Component_LayoutSceneBehavior.prototype.prepareVisual = function() {
    var scale, vocab;
    scale = Graphics.scale;
    vocab = RecordManager.vocabulary;
    if (this.layout == null) {
      this.dataObject = {};
      this.layout = ui.UiFactory.createFromDescriptor(this.object.layoutData, this.object);
      if (this.music != null) {
        AudioManager.changeMusic(this.music, 30);
      }
    }
    this.layout.ui.prepare();
    this.layout.ui.appear();
    this.layout.update();
    this.transition();
    if (SceneManager.previousScenes.length === 0) {
      if (GameManager.tempFields.isExitingGame) {
        GameManager.tempFields.isExitingGame = false;
        return gs.GameNotifier.postResetSceneChange(this.object.layoutName);
      } else {
        return gs.GameNotifier.postSceneChange(this.object.layoutName);
      }
    }
  };


  /**
  * Updates the scene's content.
  *
  * @method updateContent
   */

  Component_LayoutSceneBehavior.prototype.updateContent = function() {
    GameManager.update();
    return Graphics.viewport.update();
  };


  /**
  * Shows/Hides the current scene. A hidden scene is no longer shown and executed
  * but all objects and data is still there and be shown again anytime.
  *
  * @method show
  * @param {boolean} visible - Indicates if the scene should be shown or hidden.
   */

  Component_LayoutSceneBehavior.prototype.show = function(visible) {
    if (visible) {
      ResourceManager.context = this.resourceContext;
    }
    this.layout.visible = visible;
    this.layout.update();
    this.objectManager.active = visible;
    if (visible) {
      return gs.ObjectManager.current = SceneManager;
    }
  };


  /**
  * Action method which triggers a full refresh on the object returned by the specified binding-expression.
  * The params must be a direct binding-expression string.
  *
  * @method fullRefreshObject
  * @param {gs.Object_Base} sender - The sender object.
  * @param {string} params -  The binding expression.
   */

  Component_LayoutSceneBehavior.prototype.fullRefreshObject = function(sender, object) {
    object = ui.Component_FormulaHandler.fieldValue(sender, object);
    return object != null ? object.fullRefresh() : void 0;
  };


  /**
  * Action method which triggers a refresh on the object returned by the specified binding-expression.
  * The params must be a direct binding-expression string.
  *
  * @method refreshObject
  * @param {gs.Object_Base} sender - The sender object.
  * @param {string} params -  The binding expression.
   */

  Component_LayoutSceneBehavior.prototype.refreshObject = function(sender, object) {
    object = ui.Component_FormulaHandler.fieldValue(sender, object);
    return object != null ? object.needsUpdate = true : void 0;
  };

  Component_LayoutSceneBehavior.prototype.addStyle = function(sender, style) {
    var styleObject;
    styleObject = ui.UIManager.styles[style];
    if (styleObject != null) {
      styleObject.apply(sender);
    }
    sender.needsUpdate = true;
    if (styleObject != null ? styleObject.font : void 0) {
      return sender.behavior.refresh();
    }
  };

  Component_LayoutSceneBehavior.prototype.removeStyle = function(sender, style) {
    var i, len, ref, ref1, s, styleObject;
    styleObject = ui.UIManager.styles[style];
    if (styleObject != null) {
      styleObject.revert(sender);
    }
    sender.descriptor.styles.remove(style);
    ref = sender.descriptor.styles;
    for (i = 0, len = ref.length; i < len; i++) {
      s = ref[i];
      if ((ref1 = ui.UIManager.styles[s]) != null) {
        ref1.apply(sender);
      }
    }
    sender.needsUpdate = true;
    if (styleObject != null ? styleObject.font : void 0) {
      return sender.behavior.refresh();
    }
  };


  /**
  * Action method which executes the specified bindings.
  *
  * @method executeBindings
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object[]} params -  An array of binding-definitions.
   */

  Component_LayoutSceneBehavior.prototype.executeBindings = function(sender, bindings) {
    var binding, i, len;
    for (i = 0, len = bindings.length; i < len; i++) {
      binding = bindings[i];
      ui.Component_FormulaHandler.executeBinding(sender, binding);
    }
    return null;
  };


  /**
  * Action method which executes the specified formulas.
  *
  * @method executeFormulas
  * @param {gs.Object_Base} sender - The sender object.
  * @param {ui.Formula[]} params -  An array of formula-definitions.
   */

  Component_LayoutSceneBehavior.prototype.executeFormulas = function(sender, formulas) {
    var formula, i, len, results;
    results = [];
    for (i = 0, len = formulas.length; i < len; i++) {
      formula = formulas[i];
      results.push(ui.Component_FormulaHandler.executeFormula(sender, formula));
    }
    return results;
  };


  /**
  * Action method which executes an animation on a specified target game object.
  *
  * @method executeAnimation
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params -  Contains target-id and animations: { target, animations }
   */

  Component_LayoutSceneBehavior.prototype.executeAnimation = function(sender, params) {
    var animation, object;
    object = ui.Component_FormulaHandler.fieldValue(sender, params.target);
    animation = object != null ? object.animations.first(function(a) {
      return a.event === params.event;
    }) : void 0;
    if (animation && object) {
      return object.animationExecutor.execute(animation);
    }
  };


  /**
  * Action method which emits the specified event.
  *
  * @method emitEvent
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains event name, source and data.
  * <ul>
  * <li>params.name - The name of the event to emit</li>
  * <li>params.source - A binding-expression to define the game object which should emit the event.</li>
  * <li>params.data - An object containing additional event specific data.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.emitEvent = function(sender, params) {
    var object;
    object = ui.Component_FormulaHandler.fieldValue(sender, params.source);
    return object != null ? object.events.emit(params.name, object, ui.Component_FormulaHandler.fieldValue(sender, params.data)) : void 0;
  };


  /**
  * Action method which changes the game's aspect ratio.
  *
  * @method executeBindings
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean} params -  If <b>true</b> the game screen will stretched so that it fills the entire screen
  * of the player without any black borders. Otherwise the game screen stretches but keeps its ratio
  * so black borders are possible if the game resolution's ratio and the target display's ratio are not match. It can also
  * be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.adjustAspectRatio = function(sender, adjust) {
    adjust = ui.Component_FormulaHandler.fieldValue(sender, adjust);
    GameManager.settings.adjustAspectRatio = adjust;
    Graphics.keepRatio = !adjust;
    return Graphics.onResize();
  };


  /**
  * Action method which enters fullscreen mode.
  *
  * @method enterFullScreen
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean} params - Can be <b>null</b>
   */

  Component_LayoutSceneBehavior.prototype.enterFullScreen = function(sender, params) {
    gs.Graphics.enterFullscreen();
    return GameManager.settings.fullScreen = Graphics.isFullscreen();
  };


  /**
  * Action method which leaves fullscreen mode.
  *
  * @method leaveFullScreen
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean} params - Can be <b>null</b>
   */

  Component_LayoutSceneBehavior.prototype.leaveFullScreen = function() {
    gs.Graphics.leaveFullscreen();
    return GameManager.settings.fullScreen = Graphics.isFullscreen();
  };


  /**
  * Action method which toggles between window and fullscreen mode.
  *
  * @method toggleFullScreen
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>
   */

  Component_LayoutSceneBehavior.prototype.toggleFullScreen = function(sender, params) {
    if (gs.Graphics.isFullscreen()) {
      gs.Graphics.leaveFullscreen();
    } else {
      gs.Graphics.enterFullscreen();
    }
    return GameManager.settings.fullScreen = gs.Graphics.isFullscreen();
  };


  /**
  * Action method which plays the specified sound.
  *
  * @method playSound
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - The sound to play.
   */

  Component_LayoutSceneBehavior.prototype.playSound = function(sender, params) {
    AudioManager.loadSound(params);
    return AudioManager.playSound(params);
  };


  /**
  * Action method which plays the specified voice.
  *
  * @method playVoice
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - The voice to play.
   */

  Component_LayoutSceneBehavior.prototype.playVoice = function(sender, params) {
    AudioManager.loadSound(params);
    return AudioManager.playVoice(params);
  };


  /**
  * Action method which turns voice on or off.
  *
  * @method turnOnOffVoice
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - If <b>true</b> voice will be turned on. Otherwise it will be turned off. Can also be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.turnOnOffVoice = function(sender, state) {
    if (ui.Component_FormulaHandler.fieldValue(sender, state)) {
      return this.turnOnVoice();
    } else {
      return this.turnOffVoice();
    }
  };


  /**
  * Action method which turns music on or off.
  *
  * @method turnOnOffMusic
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - If <b>true</b> music will be turned on. Otherwise it will be turned off. Can also be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.turnOnOffMusic = function(sender, state) {
    if (ui.Component_FormulaHandler.fieldValue(sender, state)) {
      return this.turnOnMusic();
    } else {
      return this.turnOffMusic();
    }
  };


  /**
  * Action method which turns sound on or off.
  *
  * @method turnOnOffSound
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - If <b>true</b> sound will be turned on. Otherwise it will be turned off. Can also be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.turnOnOffSound = function(sender, state) {
    if (ui.Component_FormulaHandler.fieldValue(sender, state)) {
      return this.turnOnSound();
    } else {
      return this.turnOffSound();
    }
  };


  /**
  * Action method which turns off voice.
  *
  * @method turnOffVoice
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOffVoice = function() {
    return AudioManager.stopAllVoices();
  };


  /**
  * Action method which turns off music.
  *
  * @method turnOffMusic
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOffMusic = function() {
    return AudioManager.stopMusic();
  };


  /**
  * Action method which turns off sound.
  *
  * @method turnOffSound
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOffSound = function() {
    return AudioManager.stopAllSounds();
  };


  /**
  * Action method which turns on voice.
  *
  * @method turnOnVoice
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOnVoice = function() {};


  /**
  * Action method which turns on sound.
  *
  * @method turnOnSound
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOnSound = function() {};


  /**
  * Action method which turns on music.
  *
  * @method turnOnMusic
  * @param {gs.Object_Base} sender - The sender object.
  * @param {boolean|string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.turnOnMusic = function() {
    return AudioManager.resumeMusic();
  };


  /**
  * Action method which selects the specified language.
  *
  * @method selectLanguage
  * @param {gs.Object_Base} sender - The sender object.
  * @param {number|string} params - Index of the language to set. Can be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.selectLanguage = function(sender, params) {
    var language;
    language = LanguageManager.languages[ui.Component_FormulaHandler.fieldValue(sender, params)];
    return LanguageManager.selectLanguage(language);
  };


  /**
  * Action method which resets global data storage.
  *
  * @method resetGlobalData
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.resetGlobalData = function(sender) {
    return GameManager.resetGlobalData();
  };


  /**
  * Action method which saves game settings.
  *
  * @method saveSettings
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.saveSettings = function(sender) {
    return GameManager.saveSettings();
  };


  /**
  * Action method which prepares the game for saving by taking a snapshot of the current game state
  * and storing it in GameManager.saveGame.
  *
  * @method prepareSaveGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.prepareSaveGame = function(sender, params) {
    return GameManager.prepareSaveGame(params != null ? params.snapshot : void 0);
  };


  /**
  * Action method which saves the current game at the specified save slot.
  *
  * @method saveGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains the slot-index where the game should be saved.
  * <ul>
  * <li>params.slot - The slot-index where the game should be saved. Can be a binding-expression.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.saveGame = function(sender, params) {
    return GameManager.save(ui.Component_FormulaHandler.fieldValue(sender, params.slot));
  };


  /**
  * Action method which loads the game from the specified save slot.
  *
  * @method loadGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains the slot-index where the game should be loaded from.
  * <ul>
  * <li>params.slot - The slot-index where the game should be loaded from. Can be a binding-expression.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.loadGame = function(sender, params) {
    GameManager.tempSettings.skip = false;
    return GameManager.load(ui.Component_FormulaHandler.fieldValue(sender, params.slot));
  };


  /**
  * Action method which starts a new game.
  *
  * @method newGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>
   */

  Component_LayoutSceneBehavior.prototype.newGame = function(sender, params) {
    var scene;
    AudioManager.stopAllMusic(30);
    GameManager.newGame();
    scene = new vn.Object_Scene();
    SceneManager.clear();
    return SceneManager.switchTo(scene);
  };


  /**
  * Action method which exists the current game. It doesn't change the scene and
  * should be called before switching back to the title screen or main menu.
  *
  * @method exitGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>
   */

  Component_LayoutSceneBehavior.prototype.exitGame = function(sender, params) {
    return GameManager.exitGame();
  };


  /**
  * Action method which switches to another scene.
  *
  * @method switchScene
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains the class name of the scene to switch to.
  * <ul>
  * <li>params.name - The class-name of the scene to switch to. The class must be defined in vn-namespace.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.switchScene = function(sender, params) {
    var f;
    f = (function(_this) {
      return function() {
        var scene;
        if (params.clear) {
          SceneManager.clear();
        }
        scene = new vn[params.name]();
        return SceneManager.switchTo(scene, params.savePrevious);
      };
    })(this);
    if (!params.savePrevious) {
      return this.layout.ui.disappear((function(_this) {
        return function(e) {
          return f();
        };
      })(this));
    } else {
      return f();
    }
  };


  /**
  * Action method which switches to another game scene.
  *
  * @method switchGameScene
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains the UID of the scene to switch to.
  * <ul>
  * <li>params.uid - The UID of the scene to switch to.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.switchGameScene = function(sender, params) {
    var f;
    f = (function(_this) {
      return function() {
        var newScene, sceneData, sceneDocument, sceneDocuments, uid;
        if (params.clear) {
          SceneManager.clear();
        }
        uid = params.uid;
        if (params.name) {
          sceneDocuments = DataManager.getDocumentsByType("vn.scene");
          sceneDocument = sceneDocuments.first(function(d) {
            return d.items.name === params.name;
          });
          if (sceneDocument) {
            uid = sceneDocument.uid;
          }
        }
        sceneData = {
          uid: uid,
          pictures: [],
          texts: []
        };
        GameManager.sceneData = sceneData;
        newScene = new vn.Object_Scene();
        newScene.sceneData = sceneData;
        return SceneManager.switchTo(newScene, params.savePrevious);
      };
    })(this);
    if (!params.savePrevious) {
      return this.layout.ui.disappear((function(_this) {
        return function(e) {
          return f();
        };
      })(this));
    } else {
      return f();
    }
  };


  /**
  * Action method which switches to another layout.
  *
  * @method switchLayout
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Contains the name of the layout to switch to.
  * <ul>
  * <li>params.name - The name of the layout to switch to.</li>
  * <li>params.savePrevious - Indicates if the current layout should not be erased but paused and hidden instead so
  * that it can be restored using <i>returnToPrevious</i> action.</li>
  * <li>params.dataFields - Defines the data of "$dataFields" binding-expression variable. Can be a binding-expression
  * or a direct object. Optional.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.switchLayout = function(sender, layout) {
    var f;
    f = (function(_this) {
      return function() {
        var dataFields, i, len, ref, scene, senderField;
        Graphics.freeze();
        if (layout.clear) {
          SceneManager.clear();
        }
        scene = new gs.Object_Layout(layout.name);
        dataFields = sender.dataFields;
        if (typeof layout.dataFields === "string") {
          dataFields = ui.Component_FormulaHandler.fieldValue(sender, layout.dataFields);
        } else if (layout.dataFields != null) {
          dataFields = layout.dataFields;
        }
        scene.dataFields = dataFields;
        scene.controllers = layout.controllers;
        if (layout.senderData != null) {
          ref = layout.senderData;
          for (i = 0, len = ref.length; i < len; i++) {
            senderField = ref[i];
            scene[senderField] = sender[senderField];
          }
        }
        return SceneManager.switchTo(scene, layout.savePrevious, layout.stack);
      };
    })(this);
    if (!layout.savePrevious) {
      return (this.layout || this.object.layout).ui.disappear((function(_this) {
        return function(e) {
          return f();
        };
      })(this));
    } else {
      return f();
    }
  };


  /**
  * Action method which returns to previous layout. (If savePrevious was set to <b>true</b> on switchLayout.).
  *
  * @method previousLayout
  * @param {gs.Object_Base} sender - The sender object.
  * @param {Object} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.previousLayout = function(sender) {
    return SceneManager.returnToPrevious();
  };


  /**
  * Action method which disposes the specified control.
  *
  * @method disposeControl
  * @param {gs.Object_Base} sender - The sender object.
  * @param {string} params - The ID of the control to dispose. Can be a binding-expression.
   */

  Component_LayoutSceneBehavior.prototype.disposeControl = function(sender, id) {
    var control;
    control = this.objectManager.objectById(ui.Component_FormulaHandler.fieldValue(sender, id));
    return control != null ? control.ui.disappear(function(sender) {
      return sender.dispose();
    }) : void 0;
  };


  /**
  * Action method which creates a new control from the specified descriptor.
  *
  * @method createControl
  * @param {gs.Object_Base} sender - The sender object.
  * @param {string} params - Contains the descriptor and other data needed to construct the control.
  * <ul>
  * <li>params.descriptor - The control' descriptor. Can be a direct descriptor definition or a template name</li>
  * <li>params.parent - A binding-expression which returns the control's parent.</li>
  * <li>params.senderData - An object containing additional data merged into the control object.</li>
  * </ul>
   */

  Component_LayoutSceneBehavior.prototype.createControl = function(sender, data) {
    var control, descriptor, fieldName, i, len, parent, ref;
    if (typeof data.descriptor === "string") {
      descriptor = ui.UIManager.customTypes[data.descriptor];
    } else {
      descriptor = data.descriptor;
    }
    parent = ui.Component_FormulaHandler.fieldValue(sender, data.parent);
    control = ui.UiFactory._createFromDescriptor(descriptor, parent != null ? parent : this.object);
    if (data.senderData != null) {
      ref = data.senderData;
      for (i = 0, len = ref.length; i < len; i++) {
        fieldName = ref[i];
        control[fieldName] = sender[fieldName];
      }
    }
    control.ui.prepare();
    control.ui.appear();
    return control;
  };


  /**
  * Action method which quits the game.
  *
  * @method quitGame
  * @param {gs.Object_Base} sender - The sender object.
  * @param {string} params - Can be <b>null</b>.
   */

  Component_LayoutSceneBehavior.prototype.quitGame = function(sender, data) {
    return SceneManager.switchTo(null);
  };

  return Component_LayoutSceneBehavior;

})(gs.Component_SceneBehavior);

gs.Component_LayoutSceneBehavior = Component_LayoutSceneBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsNkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFFRjs7Ozs7Ozs7OztFQVNhLHVDQUFBO0lBQ1QsNkRBQUE7SUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUNqQixJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLGVBQUQsR0FBbUI7RUFMVjs7O0FBT2I7Ozs7OzswQ0FLQSxVQUFBLEdBQVksU0FBQTtJQUNSLCtEQUFBLFNBQUE7SUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixlQUFlLENBQUMsYUFBaEIsQ0FBQTtJQUNuQixlQUFlLENBQUMsT0FBaEIsR0FBMEIsSUFBQyxDQUFBO0lBRTNCLElBQU8sOEJBQVA7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsR0FBcUI7UUFBRSxNQUFBLEVBQVEsZUFBVjtRQUEyQixVQUFBLEVBQVksRUFBdkM7UUFBMkMsT0FBQSxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixDQUFwRDtRQUR6Qjs7V0FHQSxlQUFlLENBQUMsV0FBaEIsQ0FBQTtFQVRROzs7QUFXWjs7Ozs7OzBDQUtBLE9BQUEsR0FBUyxTQUFBO1dBQ0wsNERBQUEsU0FBQTtFQURLOzs7QUFHVDs7Ozs7OzswQ0FNQSxXQUFBLEdBQWEsU0FBQTtJQUNULEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBakIsR0FBMkIsSUFBQyxDQUFBO0lBRTVCLElBQUcsQ0FBSSxXQUFXLENBQUMsV0FBbkI7TUFDSSxXQUFXLENBQUMsVUFBWixDQUFBLEVBREo7O0lBR0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVksQ0FBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFuQixJQUFpQyxTQUFqQyxDQUF6QixDQUFBO0lBQ2QsTUFBTSxDQUFDLFdBQVAsR0FBcUIsSUFBQyxD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Q0FBQyxTQUFaLENBQXNCLFNBQUMsTUFBRDthQUFZLE1BQU0sQ0FBQyxPQUFQLENBQUE7SUFBWixDQUF0QjtFQUpZOzs7QUFNaEI7Ozs7Ozs7Ozs7Ozs7MENBWUEsYUFBQSxHQUFlLFNBQUMsTUFBRCxFQUFTLElBQVQ7QUFDWCxRQUFBO0lBQUEsSUFBRyxPQUFPLElBQUksQ0FBQyxVQUFaLEtBQTBCLFFBQTdCO01BQ0ksVUFBQSxHQUFhLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBWSxDQUFBLElBQUksQ0FBQyxVQUFMLEVBRDFDO0tBQUEsTUFBQTtNQUdJLFVBQUEsR0FBYSxJQUFJLENBQUMsV0FIdEI7O0lBTUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUE1QixDQUF1QyxNQUF2QyxFQUErQyxJQUFJLENBQUMsTUFBcEQ7SUFDVCxPQUFBLEdBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxxQkFBYixDQUFtQyxVQUFuQyxtQkFBK0MsU0FBUyxJQUFDLENBQUEsTUFBekQ7SUFFVixJQUFHLHVCQUFIO0FBQ0k7QUFBQSxXQUFBLHFDQUFBOztRQUNJLE9BQVEsQ0FBQSxTQUFBLENBQVIsR0FBcUIsTUFBTyxDQUFBLFNBQUE7QUFEaEMsT0FESjs7SUFHQSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQVgsQ0FBQTtJQUNBLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBWCxDQUFBO0FBRUEsV0FBTztFQWhCSTs7O0FBa0JmOzs7Ozs7OzswQ0FPQSxRQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsSUFBVDtXQUNOLFlBQVksQ0FBQyxRQUFiLENBQXNCLElBQXRCO0VBRE07Ozs7R0E5bkI4QixFQUFFLENBQUM7O0FBbW9CL0MsRUFBRSxDQUFDLDZCQUFILEdBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfTGF5b3V0U2NlbmVCZWhhdmlvcuOAgFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0xheW91dFNjZW5lQmVoYXZpb3IgZXh0ZW5kcyBncy5Db21wb25lbnRfU2NlbmVCZWhhdmlvclxuICAjICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJvYmplY3RNYW5hZ2VyXCJdXG4gICAgIyMjKlxuICAgICogVGhlIGJhc2UgY2xhc3Mgb2YgYWxsIHNjZW5lLWJlaGF2aW9yIGNvbXBvbmVudHMuIEEgc2NlbmUtYmVoYXZpb3IgY29tcG9uZW50XG4gICAgKiBkZWZpbmUgdGhlIGxvZ2ljIG9mIGEgc2luZ2xlIGdhbWUgc2NlbmUuIFxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfTGF5b3V0U2NlbmVCZWhhdmlvclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1NjZW5lQmVoYXZpb3JcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0TWFuYWdlciA9IFNjZW5lTWFuYWdlclxuICAgICAgICBAbGF5b3V0ID0gbnVsbFxuICAgICAgICBAcmVzb3VyY2VDb250ZXh0ID0gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBzY2VuZS4gXG4gICAgKlxuICAgICogQG1ldGhvZCBpbml0aWFsaXplXG4gICAgIyMjICAgIFxuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBAcmVzb3VyY2VDb250ZXh0ID0gUmVzb3VyY2VNYW5hZ2VyLmNyZWF0ZUNvbnRleHQoKVxuICAgICAgICBSZXNvdXJjZU1hbmFnZXIuY29udGV4dCA9IEByZXNvdXJjZUNvbnRleHRcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAb2JqZWN0LmxheW91dERhdGE/XG4gICAgICAgICAgICBAb2JqZWN0LmxheW91dERhdGEgPSB7IFwidHlwZVwiOiBcInVpLkZyZWVMYXlvdXRcIiwgXCJjb250cm9sc1wiOiBbXSwgXCJmcmFtZVwiOiBbMCwgMCwgMSwgMV0gfVxuICAgICAgICAgICAgXG4gICAgICAgIExhbmd1YWdlTWFuYWdlci5sb2FkQnVuZGxlcygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBzY2VuZS4gXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgXG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMgYWxsIGRhdGEgZm9yIHRoZSBzY2VuZSBhbmQgbG9hZHMgdGhlIG5lY2Vzc2FyeSBncmFwaGljIGFuZCBhdWRpbyByZXNvdXJjZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlRGF0YVxuICAgICogQGFic3RyYWN0XG4gICAgIyMjICAgIFxuICAgIHByZXBhcmVEYXRhOiAtPlxuICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQgPSBAb2JqZWN0TWFuYWdlclxuICAgICAgICBcbiAgICAgICAgaWYgbm90IEdhbWVNYW5hZ2VyLmluaXRpYWxpemVkXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5pbml0aWFsaXplKClcbiAgICAgICAgICAgIFxuICAgICAgICBAZGF0YUZpZWxkcyA9IHVpLlVpRmFjdG9yeS5kYXRhU291cmNlc1tAb2JqZWN0LmxheW91dERhdGEuZGF0YVNvdXJjZSB8fCBcImRlZmF1bHRcIl0oKVxuICAgICAgICB3aW5kb3cuJGRhdGFGaWVsZHMgPSBAZGF0YUZpZWxkc1xuICAgICAgICBAbXVzaWMgPSB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShAb2JqZWN0LCBAb2JqZWN0LmxheW91dERhdGEubXVzaWMpXG4gICAgICAgIEF1ZGlvTWFuYWdlci5sb2FkTXVzaWMoQG11c2ljKVxuICAgICAgICBAcHJlcGFyZVRyYW5zaXRpb24oUmVjb3JkTWFuYWdlci5zeXN0ZW0ubWVudVRyYW5zaXRpb24pXG4gICAgICAgIFxuICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkVWlUeXBlc0dyYXBoaWNzKHVpLlVpRmFjdG9yeS5jdXN0b21UeXBlcylcbiAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpTGF5b3V0R3JhcGhpY3MoQG9iamVjdC5sYXlvdXREYXRhKVxuICAgICAgICBcbiAgICAgICAgaWYgQGRhdGFGaWVsZHM/XG4gICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkVWlEYXRhRmllbGRzR3JhcGhpY3MoQGRhdGFGaWVsZHMpXG4gICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9DaGFyYWN0ZXJzL0phbmVEYXRlX05vcm1hbFwiKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBQcmVwYXJlcyBhbGwgdmlzdWFsIGdhbWUgb2JqZWN0IGZvciB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlVmlzdWFsXG4gICAgIyMjICAgICAgICAgXG4gICAgcHJlcGFyZVZpc3VhbDogLT5cbiAgICAgICAgc2NhbGUgPSBHcmFwaGljcy5zY2FsZVxuICAgICAgICB2b2NhYiA9IFJlY29yZE1hbmFnZXIudm9jYWJ1bGFyeVxuXG4gICAgICAgIGlmIG5vdCBAbGF5b3V0P1xuICAgICAgICAgICAgQGRhdGFPYmplY3QgPSB7fVxuICAgICAgICAgICAgQGxheW91dCA9IHVpLlVpRmFjdG9yeS5jcmVhdGVGcm9tRGVzY3JpcHRvcihAb2JqZWN0LmxheW91dERhdGEsIEBvYmplY3QpXG4gICAgXG4gICAgICAgICAgICBpZiBAbXVzaWM/XG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmNoYW5nZU11c2ljKEBtdXNpYywgMzApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICBAbGF5b3V0LnVpLnByZXBhcmUoKVxuICAgICAgICBAbGF5b3V0LnVpLmFwcGVhcigpXG4gICAgICAgIEBsYXlvdXQudXBkYXRlKClcbiAgICAgICAgXG4gICAgICAgIEB0cmFuc2l0aW9uKClcbiAgICAgICAgXG4gICAgICAgIGlmIFNjZW5lTWFuYWdlci5wcmV2aW91c1NjZW5lcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5pc0V4aXRpbmdHYW1lXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5pc0V4aXRpbmdHYW1lID0gbm9cbiAgICAgICAgICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdFJlc2V0U2NlbmVDaGFuZ2UoQG9iamVjdC5sYXlvdXROYW1lKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0U2NlbmVDaGFuZ2UoQG9iamVjdC5sYXlvdXROYW1lKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBzY2VuZSdzIGNvbnRlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVDb250ZW50XG4gICAgIyMjICAgIFxuICAgIHVwZGF0ZUNvbnRlbnQ6IC0+XG4gICAgICAgIEdhbWVNYW5hZ2VyLnVwZGF0ZSgpXG4gICAgICAgIEdyYXBoaWNzLnZpZXdwb3J0LnVwZGF0ZSgpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNob3dzL0hpZGVzIHRoZSBjdXJyZW50IHNjZW5lLiBBIGhpZGRlbiBzY2VuZSBpcyBubyBsb25nZXIgc2hvd24gYW5kIGV4ZWN1dGVkXG4gICAgKiBidXQgYWxsIG9iamVjdHMgYW5kIGRhdGEgaXMgc3RpbGwgdGhlcmUgYW5kIGJlIHNob3duIGFnYWluIGFueXRpbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzaG93XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBJbmRpY2F0ZXMgaWYgdGhlIHNjZW5lIHNob3VsZCBiZSBzaG93biBvciBoaWRkZW4uXG4gICAgIyMjICAgICAgICAgIFxuICAgIHNob3c6ICh2aXNpYmxlKSAtPlxuICAgICAgICBpZiB2aXNpYmxlXG4gICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuY29udGV4dCA9IEByZXNvdXJjZUNvbnRleHRcbiAgICAgICAgQGxheW91dC52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAbGF5b3V0LnVwZGF0ZSgpXG4gICAgICAgIEBvYmplY3RNYW5hZ2VyLmFjdGl2ZSA9IHZpc2libGVcbiAgICAgICAgaWYgdmlzaWJsZVxuICAgICAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50ID0gU2NlbmVNYW5hZ2VyICNAb2JqZWN0TWFuYWdlclxuICAgICAgICAjQG9iamVjdE1hbmFnZXIudXBkYXRlKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCB0cmlnZ2VycyBhIGZ1bGwgcmVmcmVzaCBvbiB0aGUgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBzcGVjaWZpZWQgYmluZGluZy1leHByZXNzaW9uLlxuICAgICogVGhlIHBhcmFtcyBtdXN0IGJlIGEgZGlyZWN0IGJpbmRpbmctZXhwcmVzc2lvbiBzdHJpbmcuXG4gICAgKlxuICAgICogQG1ldGhvZCBmdWxsUmVmcmVzaE9iamVjdFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zIC0gIFRoZSBiaW5kaW5nIGV4cHJlc3Npb24uXG4gICAgIyMjICAgIFxuICAgIGZ1bGxSZWZyZXNoT2JqZWN0OiAoc2VuZGVyLCBvYmplY3QpIC0+XG4gICAgICAgIG9iamVjdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHNlbmRlciwgb2JqZWN0KVxuICAgICAgICBvYmplY3Q/LmZ1bGxSZWZyZXNoKClcbiAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggdHJpZ2dlcnMgYSByZWZyZXNoIG9uIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhlIHNwZWNpZmllZCBiaW5kaW5nLWV4cHJlc3Npb24uXG4gICAgKiBUaGUgcGFyYW1zIG11c3QgYmUgYSBkaXJlY3QgYmluZGluZy1leHByZXNzaW9uIHN0cmluZy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlZnJlc2hPYmplY3RcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtcyAtICBUaGUgYmluZGluZyBleHByZXNzaW9uLlxuICAgICMjIyAgICBcbiAgICByZWZyZXNoT2JqZWN0OiAoc2VuZGVyLCBvYmplY3QpIC0+XG4gICAgICAgIG9iamVjdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHNlbmRlciwgb2JqZWN0KVxuICAgICAgICBvYmplY3Q/Lm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgICAgICBcbiAgICBhZGRTdHlsZTogKHNlbmRlciwgc3R5bGUpIC0+XG4gICAgICAgIHN0eWxlT2JqZWN0ID0gdWkuVUlNYW5hZ2VyLnN0eWxlc1tzdHlsZV1cbiAgICAgICAgc3R5bGVPYmplY3Q/LmFwcGx5KHNlbmRlcilcbiAgICAgICAgc2VuZGVyLm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgIGlmIHN0eWxlT2JqZWN0Py5mb250XG4gICAgICAgICAgICBzZW5kZXIuYmVoYXZpb3IucmVmcmVzaCgpXG4gICAgICAgIFxuICAgIHJlbW92ZVN0eWxlOiAoc2VuZGVyLCBzdHlsZSkgLT4gXG4gICAgICAgIHN0eWxlT2JqZWN0ID0gdWkuVUlNYW5hZ2VyLnN0eWxlc1tzdHlsZV1cbiAgICAgICAgc3R5bGVPYmplY3Q/LnJldmVydChzZW5kZXIpXG4gICAgICAgIHNlbmRlci5kZXNjcmlwdG9yLnN0eWxlcy5yZW1vdmUoc3R5bGUpXG4gICAgICAgIFxuICAgICAgICBmb3IgcyBpbiBzZW5kZXIuZGVzY3JpcHRvci5zdHlsZXNcbiAgICAgICAgICAgIHVpLlVJTWFuYWdlci5zdHlsZXNbc10/LmFwcGx5KHNlbmRlcilcbiAgICAgICAgc2VuZGVyLm5lZWRzVXBkYXRlID0geWVzXG4gICAgICAgIGlmIHN0eWxlT2JqZWN0Py5mb250XG4gICAgICAgICAgICBzZW5kZXIuYmVoYXZpb3IucmVmcmVzaCgpXG4gICAgICAgICAgICBcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIGV4ZWN1dGVzIHRoZSBzcGVjaWZpZWQgYmluZGluZ3MuXG4gICAgKlxuICAgICogQG1ldGhvZCBleGVjdXRlQmluZGluZ3NcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gcGFyYW1zIC0gIEFuIGFycmF5IG9mIGJpbmRpbmctZGVmaW5pdGlvbnMuXG4gICAgIyMjIFxuICAgIGV4ZWN1dGVCaW5kaW5nczogKHNlbmRlciwgYmluZGluZ3MpIC0+XG4gICAgICAgIGZvciBiaW5kaW5nIGluIGJpbmRpbmdzXG4gICAgICAgICAgICB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZXhlY3V0ZUJpbmRpbmcoc2VuZGVyLCBiaW5kaW5nKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBleGVjdXRlcyB0aGUgc3BlY2lmaWVkIGZvcm11bGFzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZXhlY3V0ZUZvcm11bGFzXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7dWkuRm9ybXVsYVtdfSBwYXJhbXMgLSAgQW4gYXJyYXkgb2YgZm9ybXVsYS1kZWZpbml0aW9ucy5cbiAgICAjIyMgIFxuICAgIGV4ZWN1dGVGb3JtdWxhczogKHNlbmRlciwgZm9ybXVsYXMpIC0+XG4gICAgICAgIGZvciBmb3JtdWxhIGluIGZvcm11bGFzXG4gICAgICAgICAgICB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZXhlY3V0ZUZvcm11bGEoc2VuZGVyLCBmb3JtdWxhKVxuICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggZXhlY3V0ZXMgYW4gYW5pbWF0aW9uIG9uIGEgc3BlY2lmaWVkIHRhcmdldCBnYW1lIG9iamVjdC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGV4ZWN1dGVBbmltYXRpb25cbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtICBDb250YWlucyB0YXJnZXQtaWQgYW5kIGFuaW1hdGlvbnM6IHsgdGFyZ2V0LCBhbmltYXRpb25zIH1cbiAgICAjIyMgICAgICAgICBcbiAgICBleGVjdXRlQW5pbWF0aW9uOiAoc2VuZGVyLCBwYXJhbXMpIC0+XG4gICAgICAgIG9iamVjdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHNlbmRlciwgcGFyYW1zLnRhcmdldClcbiAgICAgICAgYW5pbWF0aW9uID0gb2JqZWN0Py5hbmltYXRpb25zLmZpcnN0IChhKSAtPiBhLmV2ZW50ID09IHBhcmFtcy5ldmVudFxuICAgICAgICBcbiAgICAgICAgaWYgYW5pbWF0aW9uIGFuZCBvYmplY3RcbiAgICAgICAgICAgIG9iamVjdC5hbmltYXRpb25FeGVjdXRvci5leGVjdXRlKGFuaW1hdGlvbilcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggZW1pdHMgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGVtaXRFdmVudFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQ29udGFpbnMgZXZlbnQgbmFtZSwgc291cmNlIGFuZCBkYXRhLlxuICAgICogPHVsPlxuICAgICogPGxpPnBhcmFtcy5uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQ8L2xpPlxuICAgICogPGxpPnBhcmFtcy5zb3VyY2UgLSBBIGJpbmRpbmctZXhwcmVzc2lvbiB0byBkZWZpbmUgdGhlIGdhbWUgb2JqZWN0IHdoaWNoIHNob3VsZCBlbWl0IHRoZSBldmVudC48L2xpPlxuICAgICogPGxpPnBhcmFtcy5kYXRhIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBldmVudCBzcGVjaWZpYyBkYXRhLjwvbGk+XG4gICAgKiA8L3VsPlxuICAgICMjIyAgICBcbiAgICBlbWl0RXZlbnQ6IChzZW5kZXIsIHBhcmFtcykgLT5cbiAgICAgICAgb2JqZWN0ID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBwYXJhbXMuc291cmNlKVxuICAgICAgICBvYmplY3Q/LmV2ZW50cy5lbWl0KHBhcmFtcy5uYW1lLCBvYmplY3QsIHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHNlbmRlciwgcGFyYW1zLmRhdGEpKVxuICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggY2hhbmdlcyB0aGUgZ2FtZSdzIGFzcGVjdCByYXRpby5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGV4ZWN1dGVCaW5kaW5nc1xuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcyAtICBJZiA8Yj50cnVlPC9iPiB0aGUgZ2FtZSBzY3JlZW4gd2lsbCBzdHJldGNoZWQgc28gdGhhdCBpdCBmaWxscyB0aGUgZW50aXJlIHNjcmVlblxuICAgICogb2YgdGhlIHBsYXllciB3aXRob3V0IGFueSBibGFjayBib3JkZXJzLiBPdGhlcndpc2UgdGhlIGdhbWUgc2NyZWVuIHN0cmV0Y2hlcyBidXQga2VlcHMgaXRzIHJhdGlvXG4gICAgKiBzbyBibGFjayBib3JkZXJzIGFyZSBwb3NzaWJsZSBpZiB0aGUgZ2FtZSByZXNvbHV0aW9uJ3MgcmF0aW8gYW5kIHRoZSB0YXJnZXQgZGlzcGxheSdzIHJhdGlvIGFyZSBub3QgbWF0Y2guIEl0IGNhbiBhbHNvXG4gICAgKiBiZSBhIGJpbmRpbmctZXhwcmVzc2lvbi5cbiAgICAjIyNcbiAgICBhZGp1c3RBc3BlY3RSYXRpbzogKHNlbmRlciwgYWRqdXN0KSAtPlxuICAgICAgICBhZGp1c3QgPSB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShzZW5kZXIsIGFkanVzdClcbiAgICBcbiAgICAgICAgR2FtZU1hbmFnZXIuc2V0dGluZ3MuYWRqdXN0QXNwZWN0UmF0aW8gPSBhZGp1c3RcbiAgICAgICAgR3JhcGhpY3Mua2VlcFJhdGlvID0gIWFkanVzdFxuICAgICAgICBHcmFwaGljcy5vblJlc2l6ZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggZW50ZXJzIGZ1bGxzY3JlZW4gbW9kZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGVudGVyRnVsbFNjcmVlblxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHBhcmFtcyAtIENhbiBiZSA8Yj5udWxsPC9iPlxuICAgICMjI1xuICAgIGVudGVyRnVsbFNjcmVlbjogKHNlbmRlciwgcGFyYW1zKSAtPiBcbiAgICAgICAgZ3MuR3JhcGhpY3MuZW50ZXJGdWxsc2NyZWVuKClcbiAgICAgICAgR2FtZU1hbmFnZXIuc2V0dGluZ3MuZnVsbFNjcmVlbiA9IEdyYXBoaWNzLmlzRnVsbHNjcmVlbigpXG4gICAgICAgIFxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBsZWF2ZXMgZnVsbHNjcmVlbiBtb2RlLlxuICAgICpcbiAgICAqIEBtZXRob2QgbGVhdmVGdWxsU2NyZWVuXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcGFyYW1zIC0gQ2FuIGJlIDxiPm51bGw8L2I+XG4gICAgIyMjXG4gICAgbGVhdmVGdWxsU2NyZWVuOiAtPiBcbiAgICAgICAgZ3MuR3JhcGhpY3MubGVhdmVGdWxsc2NyZWVuKClcbiAgICAgICAgR2FtZU1hbmFnZXIuc2V0dGluZ3MuZnVsbFNjcmVlbiA9IEdyYXBoaWNzLmlzRnVsbHNjcmVlbigpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggdG9nZ2xlcyBiZXR3ZWVuIHdpbmRvdyBhbmQgZnVsbHNjcmVlbiBtb2RlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9nZ2xlRnVsbFNjcmVlblxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj5cbiAgICAjIyNcbiAgICB0b2dnbGVGdWxsU2NyZWVuOiAoc2VuZGVyLCBwYXJhbXMpIC0+XG4gICAgICAgIGlmIGdzLkdyYXBoaWNzLmlzRnVsbHNjcmVlbigpXG4gICAgICAgICAgICBncy5HcmFwaGljcy5sZWF2ZUZ1bGxzY3JlZW4oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBncy5HcmFwaGljcy5lbnRlckZ1bGxzY3JlZW4oKVxuXG4gICAgICAgIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmZ1bGxTY3JlZW4gPSBncy5HcmFwaGljcy5pc0Z1bGxzY3JlZW4oKVxuICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBwbGF5cyB0aGUgc3BlY2lmaWVkIHNvdW5kLlxuICAgICpcbiAgICAqIEBtZXRob2QgcGxheVNvdW5kXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgc291bmQgdG8gcGxheS5cbiAgICAjIyNcbiAgICBwbGF5U291bmQ6IChzZW5kZXIsIHBhcmFtcykgLT5cbiAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChwYXJhbXMpXG4gICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5U291bmQocGFyYW1zKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHBsYXlzIHRoZSBzcGVjaWZpZWQgdm9pY2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBwbGF5Vm9pY2VcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIFRoZSB2b2ljZSB0byBwbGF5LlxuICAgICMjI1xuICAgIHBsYXlWb2ljZTogKHNlbmRlciwgcGFyYW1zKSAtPlxuICAgICAgICBBdWRpb01hbmFnZXIubG9hZFNvdW5kKHBhcmFtcylcbiAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlWb2ljZShwYXJhbXMpXG4gICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCB0dXJucyB2b2ljZSBvbiBvciBvZmYuXG4gICAgKlxuICAgICogQG1ldGhvZCB0dXJuT25PZmZWb2ljZVxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBwYXJhbXMgLSBJZiA8Yj50cnVlPC9iPiB2b2ljZSB3aWxsIGJlIHR1cm5lZCBvbi4gT3RoZXJ3aXNlIGl0IHdpbGwgYmUgdHVybmVkIG9mZi4gQ2FuIGFsc28gYmUgYSBiaW5kaW5nLWV4cHJlc3Npb24uXG4gICAgIyMjIFxuICAgIHR1cm5Pbk9mZlZvaWNlOiAoc2VuZGVyLCBzdGF0ZSkgLT5cbiAgICAgICAgaWYgdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBzdGF0ZSkgdGhlbiBAdHVybk9uVm9pY2UoKSBlbHNlIEB0dXJuT2ZmVm9pY2UoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHR1cm5zIG11c2ljIG9uIG9yIG9mZi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHR1cm5Pbk9mZk11c2ljXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbnxzdHJpbmd9IHBhcmFtcyAtIElmIDxiPnRydWU8L2I+IG11c2ljIHdpbGwgYmUgdHVybmVkIG9uLiBPdGhlcndpc2UgaXQgd2lsbCBiZSB0dXJuZWQgb2ZmLiBDYW4gYWxzbyBiZSBhIGJpbmRpbmctZXhwcmVzc2lvbi5cbiAgICAjIyMgXG4gICAgdHVybk9uT2ZmTXVzaWM6IChzZW5kZXIsIHN0YXRlKSAtPlxuICAgICAgICBpZiB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShzZW5kZXIsIHN0YXRlKSB0aGVuIEB0dXJuT25NdXNpYygpIGVsc2UgQHR1cm5PZmZNdXNpYygpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggdHVybnMgc291bmQgb24gb3Igb2ZmLlxuICAgICpcbiAgICAqIEBtZXRob2QgdHVybk9uT2ZmU291bmRcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtib29sZWFufHN0cmluZ30gcGFyYW1zIC0gSWYgPGI+dHJ1ZTwvYj4gc291bmQgd2lsbCBiZSB0dXJuZWQgb24uIE90aGVyd2lzZSBpdCB3aWxsIGJlIHR1cm5lZCBvZmYuIENhbiBhbHNvIGJlIGEgYmluZGluZy1leHByZXNzaW9uLlxuICAgICMjIyBcbiAgICB0dXJuT25PZmZTb3VuZDogKHNlbmRlciwgc3RhdGUpIC0+XG4gICAgICAgIGlmIHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHNlbmRlciwgc3RhdGUpIHRoZW4gQHR1cm5PblNvdW5kKCkgZWxzZSBAdHVybk9mZlNvdW5kKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCB0dXJucyBvZmYgdm9pY2UuXG4gICAgKlxuICAgICogQG1ldGhvZCB0dXJuT2ZmVm9pY2VcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtib29sZWFufHN0cmluZ30gcGFyYW1zIC0gQ2FuIGJlIDxiPm51bGw8L2I+LlxuICAgICMjIyBcbiAgICB0dXJuT2ZmVm9pY2U6IC0+XG4gICAgICAgIEF1ZGlvTWFuYWdlci5zdG9wQWxsVm9pY2VzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCB0dXJucyBvZmYgbXVzaWMuXG4gICAgKlxuICAgICogQG1ldGhvZCB0dXJuT2ZmTXVzaWNcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtib29sZWFufHN0cmluZ30gcGFyYW1zIC0gQ2FuIGJlIDxiPm51bGw8L2I+LlxuICAgICMjIyBcbiAgICB0dXJuT2ZmTXVzaWM6IC0+XG4gICAgICAgIEF1ZGlvTWFuYWdlci5zdG9wTXVzaWMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHR1cm5zIG9mZiBzb3VuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHR1cm5PZmZTb3VuZFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjIFxuICAgIHR1cm5PZmZTb3VuZDogLT5cbiAgICAgICAgQXVkaW9NYW5hZ2VyLnN0b3BBbGxTb3VuZHMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHR1cm5zIG9uIHZvaWNlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdHVybk9uVm9pY2VcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtib29sZWFufHN0cmluZ30gcGFyYW1zIC0gQ2FuIGJlIDxiPm51bGw8L2I+LlxuICAgICMjIyBcbiAgICB0dXJuT25Wb2ljZTogLT5cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCB0dXJucyBvbiBzb3VuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHR1cm5PblNvdW5kXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbnxzdHJpbmd9IHBhcmFtcyAtIENhbiBiZSA8Yj5udWxsPC9iPi5cbiAgICAjIyMgXG4gICAgdHVybk9uU291bmQ6IC0+XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggdHVybnMgb24gbXVzaWMuXG4gICAgKlxuICAgICogQG1ldGhvZCB0dXJuT25NdXNpY1xuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjIFxuICAgIHR1cm5Pbk11c2ljOiAtPlxuICAgICAgICBBdWRpb01hbmFnZXIucmVzdW1lTXVzaWMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHNlbGVjdHMgdGhlIHNwZWNpZmllZCBsYW5ndWFnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNlbGVjdExhbmd1YWdlXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gcGFyYW1zIC0gSW5kZXggb2YgdGhlIGxhbmd1YWdlIHRvIHNldC4gQ2FuIGJlIGEgYmluZGluZy1leHByZXNzaW9uLlxuICAgICMjIyBcbiAgICBzZWxlY3RMYW5ndWFnZTogKHNlbmRlciwgcGFyYW1zKS0+XG4gICAgICAgIGxhbmd1YWdlID0gTGFuZ3VhZ2VNYW5hZ2VyLmxhbmd1YWdlc1t1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShzZW5kZXIsIHBhcmFtcyldXG4gICAgICAgIExhbmd1YWdlTWFuYWdlci5zZWxlY3RMYW5ndWFnZShsYW5ndWFnZSlcbiAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHJlc2V0cyBnbG9iYWwgZGF0YSBzdG9yYWdlLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzZXRHbG9iYWxEYXRhXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjIFxuICAgIHJlc2V0R2xvYmFsRGF0YTogKHNlbmRlcikgLT4gXG4gICAgICAgIEdhbWVNYW5hZ2VyLnJlc2V0R2xvYmFsRGF0YSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBzYXZlcyBnYW1lIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2F2ZVNldHRpbmdzXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjIFxuICAgIHNhdmVTZXR0aW5nczogKHNlbmRlcikgLT4gR2FtZU1hbmFnZXIuc2F2ZVNldHRpbmdzKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHByZXBhcmVzIHRoZSBnYW1lIGZvciBzYXZpbmcgYnkgdGFraW5nIGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgZ2FtZSBzdGF0ZVxuICAgICogYW5kIHN0b3JpbmcgaXQgaW4gR2FtZU1hbmFnZXIuc2F2ZUdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlU2F2ZUdhbWVcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENhbiBiZSA8Yj5udWxsPC9iPi5cbiAgICAjIyMgXG4gICAgcHJlcGFyZVNhdmVHYW1lOiAoc2VuZGVyLCBwYXJhbXMpIC0+XG4gICAgICAgIEdhbWVNYW5hZ2VyLnByZXBhcmVTYXZlR2FtZShwYXJhbXM/LnNuYXBzaG90KVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHNhdmVzIHRoZSBjdXJyZW50IGdhbWUgYXQgdGhlIHNwZWNpZmllZCBzYXZlIHNsb3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBzYXZlR2FtZVxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQ29udGFpbnMgdGhlIHNsb3QtaW5kZXggd2hlcmUgdGhlIGdhbWUgc2hvdWxkIGJlIHNhdmVkLlxuICAgICogPHVsPlxuICAgICogPGxpPnBhcmFtcy5zbG90IC0gVGhlIHNsb3QtaW5kZXggd2hlcmUgdGhlIGdhbWUgc2hvdWxkIGJlIHNhdmVkLiBDYW4gYmUgYSBiaW5kaW5nLWV4cHJlc3Npb24uPC9saT5cbiAgICAqIDwvdWw+XG4gICAgIyMjIFxuICAgIHNhdmVHYW1lOiAoc2VuZGVyLCBwYXJhbXMpIC0+IEdhbWVNYW5hZ2VyLnNhdmUodWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBwYXJhbXMuc2xvdCkpXG4gICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBsb2FkcyB0aGUgZ2FtZSBmcm9tIHRoZSBzcGVjaWZpZWQgc2F2ZSBzbG90LlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZEdhbWVcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENvbnRhaW5zIHRoZSBzbG90LWluZGV4IHdoZXJlIHRoZSBnYW1lIHNob3VsZCBiZSBsb2FkZWQgZnJvbS5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT5wYXJhbXMuc2xvdCAtIFRoZSBzbG90LWluZGV4IHdoZXJlIHRoZSBnYW1lIHNob3VsZCBiZSBsb2FkZWQgZnJvbS4gQ2FuIGJlIGEgYmluZGluZy1leHByZXNzaW9uLjwvbGk+XG4gICAgKiA8L3VsPlxuICAgICMjIyBcbiAgICBsb2FkR2FtZTogKHNlbmRlciwgcGFyYW1zKSAtPlxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCA9IG5vXG4gICAgICAgIEdhbWVNYW5hZ2VyLmxvYWQodWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBwYXJhbXMuc2xvdCkpXG4gICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggc3RhcnRzIGEgbmV3IGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBuZXdHYW1lXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj5cbiAgICAjIyMgXG4gICAgbmV3R2FtZTogKHNlbmRlciwgcGFyYW1zKSAtPlxuICAgICAgICBBdWRpb01hbmFnZXIuc3RvcEFsbE11c2ljKDMwKVxuICAgICAgICBHYW1lTWFuYWdlci5uZXdHYW1lKClcbiAgICAgICAgXG4gICAgICAgIHNjZW5lID0gbmV3IHZuLk9iamVjdF9TY2VuZSgpXG4gICAgICAgIFNjZW5lTWFuYWdlci5jbGVhcigpXG4gICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhzY2VuZSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIGV4aXN0cyB0aGUgY3VycmVudCBnYW1lLiBJdCBkb2Vzbid0IGNoYW5nZSB0aGUgc2NlbmUgYW5kXG4gICAgKiBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBzd2l0Y2hpbmcgYmFjayB0byB0aGUgdGl0bGUgc2NyZWVuIG9yIG1haW4gbWVudS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGV4aXRHYW1lXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj5cbiAgICAjIyMgXG4gICAgZXhpdEdhbWU6IChzZW5kZXIsIHBhcmFtcykgLT5cbiAgICAgICAgR2FtZU1hbmFnZXIuZXhpdEdhbWUoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHN3aXRjaGVzIHRvIGFub3RoZXIgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzd2l0Y2hTY2VuZVxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gQ29udGFpbnMgdGhlIGNsYXNzIG5hbWUgb2YgdGhlIHNjZW5lIHRvIHN3aXRjaCB0by5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT5wYXJhbXMubmFtZSAtIFRoZSBjbGFzcy1uYW1lIG9mIHRoZSBzY2VuZSB0byBzd2l0Y2ggdG8uIFRoZSBjbGFzcyBtdXN0IGJlIGRlZmluZWQgaW4gdm4tbmFtZXNwYWNlLjwvbGk+XG4gICAgKiA8L3VsPlxuICAgICMjIyAgICAgXG4gICAgc3dpdGNoU2NlbmU6IChzZW5kZXIsIHBhcmFtcykgLT5cbiAgICAgICAgZiA9ID0+XG4gICAgICAgICAgICBpZiBwYXJhbXMuY2xlYXJcbiAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXIuY2xlYXIoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgdm5bcGFyYW1zLm5hbWVdKClcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhzY2VuZSwgcGFyYW1zLnNhdmVQcmV2aW91cylcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAhcGFyYW1zLnNhdmVQcmV2aW91c1xuICAgICAgICAgICAgQGxheW91dC51aS5kaXNhcHBlYXIgKGUpID0+IGYoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBzd2l0Y2hlcyB0byBhbm90aGVyIGdhbWUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzd2l0Y2hHYW1lU2NlbmVcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciAtIFRoZSBzZW5kZXIgb2JqZWN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIENvbnRhaW5zIHRoZSBVSUQgb2YgdGhlIHNjZW5lIHRvIHN3aXRjaCB0by5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT5wYXJhbXMudWlkIC0gVGhlIFVJRCBvZiB0aGUgc2NlbmUgdG8gc3dpdGNoIHRvLjwvbGk+XG4gICAgKiA8L3VsPlxuICAgICMjIyAgICBcbiAgICBzd2l0Y2hHYW1lU2NlbmU6IChzZW5kZXIsIHBhcmFtcykgLT5cbiAgICAgICAgZiA9ID0+XG4gICAgICAgICAgICBpZiBwYXJhbXMuY2xlYXJcbiAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXIuY2xlYXIoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgdWlkID0gcGFyYW1zLnVpZFxuICAgICAgICAgICAgaWYgcGFyYW1zLm5hbWVcbiAgICAgICAgICAgICAgICBzY2VuZURvY3VtZW50cyA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50c0J5VHlwZShcInZuLnNjZW5lXCIpXG4gICAgICAgICAgICAgICAgc2NlbmVEb2N1bWVudCA9IHNjZW5lRG9jdW1lbnRzLmZpcnN0IChkKSAtPiBkLml0ZW1zLm5hbWUgPT0gcGFyYW1zLm5hbWVcbiAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50XG4gICAgICAgICAgICAgICAgICAgIHVpZCA9IHNjZW5lRG9jdW1lbnQudWlkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNjZW5lRGF0YSA9IHVpZDogdWlkLCBwaWN0dXJlczogW10sIHRleHRzOiBbXVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVEYXRhID0gc2NlbmVEYXRhXG4gICAgICAgICAgICBuZXdTY2VuZSA9IG5ldyB2bi5PYmplY3RfU2NlbmUoKVxuICAgICAgICAgICAgbmV3U2NlbmUuc2NlbmVEYXRhID0gc2NlbmVEYXRhXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhuZXdTY2VuZSwgcGFyYW1zLnNhdmVQcmV2aW91cylcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAhcGFyYW1zLnNhdmVQcmV2aW91c1xuICAgICAgICAgICAgQGxheW91dC51aS5kaXNhcHBlYXIgKGUpID0+IGYoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBBY3Rpb24gbWV0aG9kIHdoaWNoIHN3aXRjaGVzIHRvIGFub3RoZXIgbGF5b3V0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3dpdGNoTGF5b3V0XG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDb250YWlucyB0aGUgbmFtZSBvZiB0aGUgbGF5b3V0IHRvIHN3aXRjaCB0by5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT5wYXJhbXMubmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBsYXlvdXQgdG8gc3dpdGNoIHRvLjwvbGk+XG4gICAgKiA8bGk+cGFyYW1zLnNhdmVQcmV2aW91cyAtIEluZGljYXRlcyBpZiB0aGUgY3VycmVudCBsYXlvdXQgc2hvdWxkIG5vdCBiZSBlcmFzZWQgYnV0IHBhdXNlZCBhbmQgaGlkZGVuIGluc3RlYWQgc29cbiAgICAqIHRoYXQgaXQgY2FuIGJlIHJlc3RvcmVkIHVzaW5nIDxpPnJldHVyblRvUHJldmlvdXM8L2k+IGFjdGlvbi48L2xpPlxuICAgICogPGxpPnBhcmFtcy5kYXRhRmllbGRzIC0gRGVmaW5lcyB0aGUgZGF0YSBvZiBcIiRkYXRhRmllbGRzXCIgYmluZGluZy1leHByZXNzaW9uIHZhcmlhYmxlLiBDYW4gYmUgYSBiaW5kaW5nLWV4cHJlc3Npb25cbiAgICAqIG9yIGEgZGlyZWN0IG9iamVjdC4gT3B0aW9uYWwuPC9saT5cbiAgICAqIDwvdWw+XG4gICAgIyMjICAgIFxuICAgIHN3aXRjaExheW91dDogKHNlbmRlciwgbGF5b3V0KSAtPlxuICAgICAgICBmID0gPT5cbiAgICAgICAgICAgIEdyYXBoaWNzLmZyZWV6ZSgpXG4gICAgICAgICAgICBpZiBsYXlvdXQuY2xlYXJcbiAgICAgICAgICAgICAgICBTY2VuZU1hbmFnZXIuY2xlYXIoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgZ3MuT2JqZWN0X0xheW91dChsYXlvdXQubmFtZSlcbiAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGFGaWVsZHMgPSBzZW5kZXIuZGF0YUZpZWxkc1xuICAgICAgICAgICAgaWYgdHlwZW9mIGxheW91dC5kYXRhRmllbGRzID09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICBkYXRhRmllbGRzID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBsYXlvdXQuZGF0YUZpZWxkcylcbiAgICAgICAgICAgIGVsc2UgaWYgbGF5b3V0LmRhdGFGaWVsZHM/XG4gICAgICAgICAgICAgICAgZGF0YUZpZWxkcyA9IGxheW91dC5kYXRhRmllbGRzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBzY2VuZS5kYXRhRmllbGRzID0gZGF0YUZpZWxkc1xuICAgICAgICAgICAgc2NlbmUuY29udHJvbGxlcnMgPSBsYXlvdXQuY29udHJvbGxlcnNcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgbGF5b3V0LnNlbmRlckRhdGE/XG4gICAgICAgICAgICAgICAgZm9yIHNlbmRlckZpZWxkIGluIGxheW91dC5zZW5kZXJEYXRhXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lW3NlbmRlckZpZWxkXSA9IHNlbmRlcltzZW5kZXJGaWVsZF1cbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhzY2VuZSwgbGF5b3V0LnNhdmVQcmV2aW91cywgbGF5b3V0LnN0YWNrKVxuICAgICAgICBcbiAgICAgICAgaWYgIWxheW91dC5zYXZlUHJldmlvdXNcbiAgICAgICAgICAgIChAbGF5b3V0fHxAb2JqZWN0LmxheW91dCkudWkuZGlzYXBwZWFyIChlKSA9PiBmKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZigpXG4gICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggcmV0dXJucyB0byBwcmV2aW91cyBsYXlvdXQuIChJZiBzYXZlUHJldmlvdXMgd2FzIHNldCB0byA8Yj50cnVlPC9iPiBvbiBzd2l0Y2hMYXlvdXQuKS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHByZXZpb3VzTGF5b3V0XG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjICAgICBcbiAgICBwcmV2aW91c0xheW91dDogKHNlbmRlcikgLT5cbiAgICAgICAgU2NlbmVNYW5hZ2VyLnJldHVyblRvUHJldmlvdXMoKVxuICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBkaXNwb3NlcyB0aGUgc3BlY2lmaWVkIGNvbnRyb2wuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlQ29udHJvbFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zIC0gVGhlIElEIG9mIHRoZSBjb250cm9sIHRvIGRpc3Bvc2UuIENhbiBiZSBhIGJpbmRpbmctZXhwcmVzc2lvbi5cbiAgICAjIyMgICAgXG4gICAgZGlzcG9zZUNvbnRyb2w6IChzZW5kZXIsIGlkKSAtPlxuICAgICAgICBjb250cm9sID0gQG9iamVjdE1hbmFnZXIub2JqZWN0QnlJZCh1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShzZW5kZXIsIGlkKSlcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBjb250cm9sPy51aS5kaXNhcHBlYXIgKHNlbmRlcikgLT4gc2VuZGVyLmRpc3Bvc2UoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEFjdGlvbiBtZXRob2Qgd2hpY2ggY3JlYXRlcyBhIG5ldyBjb250cm9sIGZyb20gdGhlIHNwZWNpZmllZCBkZXNjcmlwdG9yLlxuICAgICpcbiAgICAqIEBtZXRob2QgY3JlYXRlQ29udHJvbFxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIC0gVGhlIHNlbmRlciBvYmplY3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zIC0gQ29udGFpbnMgdGhlIGRlc2NyaXB0b3IgYW5kIG90aGVyIGRhdGEgbmVlZGVkIHRvIGNvbnN0cnVjdCB0aGUgY29udHJvbC5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT5wYXJhbXMuZGVzY3JpcHRvciAtIFRoZSBjb250cm9sJyBkZXNjcmlwdG9yLiBDYW4gYmUgYSBkaXJlY3QgZGVzY3JpcHRvciBkZWZpbml0aW9uIG9yIGEgdGVtcGxhdGUgbmFtZTwvbGk+XG4gICAgKiA8bGk+cGFyYW1zLnBhcmVudCAtIEEgYmluZGluZy1leHByZXNzaW9uIHdoaWNoIHJldHVybnMgdGhlIGNvbnRyb2wncyBwYXJlbnQuPC9saT5cbiAgICAqIDxsaT5wYXJhbXMuc2VuZGVyRGF0YSAtIEFuIG9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YSBtZXJnZWQgaW50byB0aGUgY29udHJvbCBvYmplY3QuPC9saT5cbiAgICAqIDwvdWw+XG4gICAgIyMjICBcbiAgICBjcmVhdGVDb250cm9sOiAoc2VuZGVyLCBkYXRhKSAtPlxuICAgICAgICBpZiB0eXBlb2YgZGF0YS5kZXNjcmlwdG9yID09IFwic3RyaW5nXCJcbiAgICAgICAgICAgIGRlc2NyaXB0b3IgPSB1aS5VSU1hbmFnZXIuY3VzdG9tVHlwZXNbZGF0YS5kZXNjcmlwdG9yXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZXNjcmlwdG9yID0gZGF0YS5kZXNjcmlwdG9yXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgcGFyZW50ID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUoc2VuZGVyLCBkYXRhLnBhcmVudClcbiAgICAgICAgY29udHJvbCA9IHVpLlVpRmFjdG9yeS5fY3JlYXRlRnJvbURlc2NyaXB0b3IoZGVzY3JpcHRvciwgcGFyZW50ID8gQG9iamVjdClcbiAgICAgICAgXG4gICAgICAgIGlmIGRhdGEuc2VuZGVyRGF0YT9cbiAgICAgICAgICAgIGZvciBmaWVsZE5hbWUgaW4gZGF0YS5zZW5kZXJEYXRhXG4gICAgICAgICAgICAgICAgY29udHJvbFtmaWVsZE5hbWVdID0gc2VuZGVyW2ZpZWxkTmFtZV1cbiAgICAgICAgY29udHJvbC51aS5wcmVwYXJlKClcbiAgICAgICAgY29udHJvbC51aS5hcHBlYXIoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQWN0aW9uIG1ldGhvZCB3aGljaCBxdWl0cyB0aGUgZ2FtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHF1aXRHYW1lXG4gICAgKiBAcGFyYW0ge2dzLk9iamVjdF9CYXNlfSBzZW5kZXIgLSBUaGUgc2VuZGVyIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMgLSBDYW4gYmUgPGI+bnVsbDwvYj4uXG4gICAgIyMjIFxuICAgIHF1aXRHYW1lOiAoc2VuZGVyLCBkYXRhKSAtPlxuICAgICAgICBTY2VuZU1hbmFnZXIuc3dpdGNoVG8obnVsbClcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG5ncy5Db21wb25lbnRfTGF5b3V0U2NlbmVCZWhhdmlvciA9IENvbXBvbmVudF9MYXlvdXRTY2VuZUJlaGF2aW9yIl19
//# sourceURL=Component_LayoutSceneBehavior_20.js