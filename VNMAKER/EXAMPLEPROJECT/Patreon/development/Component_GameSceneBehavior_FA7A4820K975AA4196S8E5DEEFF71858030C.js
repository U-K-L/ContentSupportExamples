var Component_GameSceneBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_GameSceneBehavior = (function(superClass) {
  extend(Component_GameSceneBehavior, superClass);


  /**
  * Defines the behavior of visual novel game scene.
  *
  * @module vn
  * @class Component_GameSceneBehavior
  * @extends gs.Component_LayoutSceneBehavior
  * @memberof vn
   */

  function Component_GameSceneBehavior() {
    Component_GameSceneBehavior.__super__.constructor.call(this);
    this.onAutoCommonEventStart = (function(_this) {
      return function() {
        _this.object.removeComponent(_this.object.interpreter);
        return _this.object.interpreter.stop();
      };
    })(this);
    this.onAutoCommonEventFinish = (function(_this) {
      return function() {
        if (!_this.object.components.contains(_this.object.interpreter)) {
          _this.object.addComponent(_this.object.interpreter);
        }
        return _this.object.interpreter.resume();
      };
    })(this);
    this.resourceContext = null;
    this.objectDomain = "";
  }


  /**
  * Initializes the scene. 
  *
  * @method initialize
   */

  Component_GameSceneBehavior.prototype.initialize = function() {
    var ref, saveGame, sceneUid, sprite;
    if (SceneManager.previousScenes.length === 0) {
      gs.GlobalEventManager.clear();
    }
    this.resourceContext = ResourceManager.createContext();
    ResourceManager.context = this.resourceContext;
    Graphics.freeze();
    saveGame = GameManager.loadedSaveGame;
    sceneUid = null;
    if (saveGame) {
      sceneUid = saveGame.sceneUid;
      this.object.sceneData = saveGame.data;
    } else {
      sceneUid = ((ref = $PARAMS.preview) != null ? ref.scene.uid : void 0) || this.object.sceneData.uid || RecordManager.system.startInfo.scene.uid;
    }
    this.object.sceneDocument = DataManager.getDocument(sceneUid);
    if (this.object.sceneDocument && this.object.sceneDocument.items.type === "vn.scene") {
      this.object.chapter = DataManager.getDocument(this.object.sceneDocument.items.chapterUid);
      this.object.currentCharacter = {
        "name": ""
      };
      if (!GameManager.initialized) {
        GameManager.initialize();
      }
      LanguageManager.loadBundles();
    } else {
      sprite = new gs.Sprite();
      sprite.bitmap = new gs.Bitmap(Graphics.width, 50);
      sprite.bitmap.drawText(0, 0, Graphics.width, 50, "No Start Scene selected", 1, 0);
      sprite.srcRect = new gs.Rect(0, 0, Graphics.width, 50);
      sprite.y = (Graphics.height - 50) / 2;
      sprite.z = 10000;
    }
    return this.setupScreen();
  };


  /**
  * Disposes the scene. 
  *
  * @method dispose
   */

  Component_GameSceneBehavior.prototype.dispose = function() {
    var event, j, len, ref;
    ResourceManager.context = this.resourceContext;
    this.object.removeObject(this.object.commonEventContainer);
    this.show(false);
    ref = GameManager.commonEvents;
    for (j = 0, len = ref.length; j < len; j++) {
      event = ref[j];
      if (event) {
        event.events.offByOwner("start", this.object);
        event.events.offByOwner("finish", this.object);
      }
    }
    if (this.object.video) {
      this.object.video.dispose();
      this.object.video.onEnded();
    }
    return Component_GameSceneBehavior.__super__.dispose.call(this);
  };

  Component_GameSceneBehavior.prototype.changePictureDomain = function(domain) {
    this.object.pictureContainer.behavior.changeDomain(domain);
    return this.object.pictures = this.object.pictureContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeTextDomain = function(domain) {
    this.object.textContainer.behavior.changeDomain(domain);
    return this.object.texts = this.object.textContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeVideoDomain = function(domain) {
    this.object.videoContainer.behavior.changeDomain(domain);
    return this.object.videos = this.object.videoContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeHotspotDomain = function(domain) {
    this.object.hotspotContainer.behavior.changeDomain(domain);
    return this.object.hotspots = this.object.hotspotContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeMessageAreaDomain = function(domain) {
    this.object.messageAreaContainer.behavior.changeDomain(domain);
    return this.object.messageAreas = this.object.messageAreaContainer.subObjects;
  };


  /**
  * Shows/Hides the current scene. A hidden scene is no longer shown and executed
  * but all objects and data is still there and be shown again anytime.
  *
  * @method show
  * @param {boolean} visible - Indicates if the scene should be shown or hidden.
   */

  Component_GameSceneBehavior.prototype.show = function(visible) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
    this.object.visible = visible;
    if ((ref = this.object.layout) != null) {
      ref.update();
    }
    if ((ref1 = this.object.layoutNVL) != null) {
      ref1.update();
    }
    this.object.pictureContainer.behavior.setVisible(visible);
    this.object.hotspotContainer.behavior.setVisible(visible);
    this.object.textContainer.behavior.setVisible(visible);
    this.object.videoContainer.behavior.setVisible(visible);
    this.object.messageAreaContainer.behavior.setVisible(visible);
    this.object.viewportContainer.behavior.setVisible(visible);
    this.object.characterContainer.behavior.setVisible(visible);
    this.object.backgroundContainer.behavior.setVisible(visible);
    if ((ref2 = this.viewport) != null) {
      ref2.visible = visible;
    }
    if ((ref3 = this.object.choiceWindow) != null) {
      ref3.visible = visible;
    }
    if ((ref4 = this.object.inputNumberBox) != null) {
      ref4.visible = visible;
    }
    if ((ref5 = this.object.inputTextBox) != null) {
      ref5.visible = visible;
    }
    if ((ref6 = this.object.inputTextBox) != null) {
      ref6.update();
    }
    if ((ref7 = this.object.inputNumberBox) != null) {
      ref7.update();
    }
    if ((ref8 = this.object.choiceWindow) != null) {
      ref8.update();
    }
    return this.setupCommonEvents();
  };


  /**
  * Sets up common event handling.
  *
  * @method setupCommonEvents
   */

  Component_GameSceneBehavior.prototype.setupCommonEvents = function() {
    var commonEvents, event, i, j, k, len, len1, ref, ref1, ref2, ref3;
    commonEvents = (ref = this.object.sceneData) != null ? ref.commonEvents : void 0;
    if (commonEvents) {
      for (i = j = 0, len = commonEvents.length; j < len; i = ++j) {
        event = commonEvents[i];
        if (event && this.object.commonEventContainer.subObjects.indexOf(event) === -1) {
          this.object.commonEventContainer.setObject(event, i);
          event.behavior.setupEventHandlers();
          if ((ref1 = event.interpreter) != null ? ref1.isRunning : void 0) {
            event.events.emit("start", event);
          }
        }
      }
    } else {
      ref2 = GameManager.commonEvents;
      for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
        event = ref2[i];
        if (event && (event.record.startCondition === 1 || event.record.parallel) && this.object.commonEventContainer.subObjects.indexOf(event) === -1) {
          this.object.commonEventContainer.setObject(event, i);
          event.events.offByOwner("start", this.object);
          event.events.offByOwner("finish", this.object);
          if (!event.record.parallel) {
            event.events.on("start", gs.CallBack("onAutoCommonEventStart", this), null, this.object);
            event.events.on("finish", gs.CallBack("onAutoCommonEventFinish", this), null, this.object);
          }
          if ((ref3 = event.interpreter) != null ? ref3.isRunning : void 0) {
            event.events.emit("start", event);
          }
        }
      }
    }
    return null;
  };


  /**
  * Sets up main interpreter.
  *
  * @method setupInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupInterpreter = function() {
    this.object.commands = this.object.sceneDocument.items.commands;
    if (this.object.sceneData.interpreter) {
      this.object.removeComponent(this.object.interpreter);
      this.object.interpreter = this.object.sceneData.interpreter;
      this.object.addComponent(this.object.interpreter);
      this.object.interpreter.context.set(this.object.sceneDocument.uid, this.object);
      return this.object.interpreter.object = this.object;
    } else {
      this.object.interpreter.setup();
      this.object.interpreter.context.set(this.object.sceneDocument.uid, this.object);
      return this.object.interpreter.start();
    }
  };


  /**
  * Sets up characters and restores them from loaded save game if necessary.
  *
  * @method setupCharacters
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupCharacters = function() {
    var c, i, j, len, ref;
    if (this.object.sceneData.characters != null) {
      ref = this.object.sceneData.characters;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        this.object.characterContainer.setObject(c, i);
      }
    }
    return this.object.currentCharacter = this.object.sceneData.currentCharacter || {
      name: ""
    };
  };


  /**
  * Sets up viewports and restores them from loaded save game if necessary.
  *
  * @method setupViewports
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupViewports = function() {
    var i, j, len, ref, ref1, results, viewport, viewports;
    viewports = (ref = (ref1 = this.object.sceneData) != null ? ref1.viewports : void 0) != null ? ref : [];
    results = [];
    for (i = j = 0, len = viewports.length; j < len; i = ++j) {
      viewport = viewports[i];
      if (viewport) {
        results.push(this.object.viewportContainer.setObject(viewport, i));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up backgrounds and restores them from loaded save game if necessary.
  *
  * @method setupBackgrounds
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupBackgrounds = function() {
    var b, backgrounds, i, j, len, ref, ref1, results;
    backgrounds = (ref = (ref1 = this.object.sceneData) != null ? ref1.backgrounds : void 0) != null ? ref : [];
    results = [];
    for (i = j = 0, len = backgrounds.length; j < len; i = ++j) {
      b = backgrounds[i];
      results.push(this.object.backgroundContainer.setObject(b, i));
    }
    return results;
  };


  /**
  * Sets up pictures and restores them from loaded save game if necessary.
  *
  * @method setupPictures
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupPictures = function() {
    var domain, i, path, picture, pictures, ref, ref1, results;
    pictures = (ref = (ref1 = this.object.sceneData) != null ? ref1.pictures : void 0) != null ? ref : {};
    results = [];
    for (domain in pictures) {
      this.object.pictureContainer.behavior.changeDomain(domain);
      if (pictures[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = pictures[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            picture = ref2[i];
            this.object.pictureContainer.setObject(picture, i);
            if (picture != null ? picture.image : void 0) {
              path = "Graphics/Pictures/" + picture.image;
              results1.push(this.resourceContext.add(path, ResourceManager.resourcesByPath[path]));
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
  * Sets up texts and restores them from loaded save game if necessary.
  *
  * @method setupTexts
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupTexts = function() {
    var domain, i, ref, ref1, results, text, texts;
    texts = (ref = (ref1 = this.object.sceneData) != null ? ref1.texts : void 0) != null ? ref : {};
    results = [];
    for (domain in texts) {
      this.object.textContainer.behavior.changeDomain(domain);
      if (texts[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = texts[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            text = ref2[i];
            results1.push(this.object.textContainer.setObject(text, i));
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
  * Sets up videos and restores them from loaded save game if necessary.
  *
  * @method setupVideos
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupVideos = function() {
    var domain, i, path, ref, ref1, results, video, videos;
    videos = (ref = (ref1 = this.object.sceneData) != null ? ref1.videos : void 0) != null ? ref : {};
    results = [];
    for (domain in videos) {
      this.object.videoContainer.behavior.changeDomain(domain);
      if (videos[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = videos[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            video = ref2[i];
            if (video) {
              path = "Movies/" + video.video;
              this.resourceContext.add(path, ResourceManager.resourcesByPath[path]);
              video.visible = true;
              video.update();
            }
            results1.push(this.object.videoContainer.setObject(video, i));
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
  * Sets up hotspots and restores them from loaded save game if necessary.
  *
  * @method setupHotspots
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupHotspots = function() {
    var domain, hotspot, hotspots, i, ref, ref1, results;
    hotspots = (ref = (ref1 = this.object.sceneData) != null ? ref1.hotspots : void 0) != null ? ref : {};
    results = [];
    for (domain in hotspots) {
      this.object.hotspotContainer.behavior.changeDomain(domain);
      if (hotspots[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = hotspots[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            hotspot = ref2[i];
            results1.push(this.object.hotspotContainer.setObject(hotspot, i));
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
  * Sets up layout.
  *
  * @method setupLayout
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupLayout = function() {
    var advVisible, nvlVisible, ref;
    this.dataFields = ui.UIManager.dataSources[ui.UiFactory.layouts.gameLayout.dataSource || "default"]();
    this.dataFields.scene = this.object;
    window.$dataFields = this.dataFields;
    advVisible = this.object.messageMode === vn.MessageMode.ADV;
    nvlVisible = this.object.messageMode === vn.MessageMode.NVL;
    this.object.layoutNVL = ui.UiFactory.createFromDescriptor(ui.UiFactory.layouts.gameLayoutNVL, this.object);
    this.object.layout = ui.UiFactory.createFromDescriptor(ui.UiFactory.layouts.gameLayout, this.object);
    this.object.layoutNVL.visible = nvlVisible;
    this.object.layout.visible = advVisible;
    $gameMessageNVL_message.visible = nvlVisible;
    $gameMessage_message.visible = advVisible;
    this.object.layout.ui.prepare();
    this.object.layoutNVL.ui.prepare();
    if (((ref = $tempFields.choices) != null ? ref.length : void 0) > 0) {
      this.showChoices(GameManager.tempFields.choices, gs.CallBack("onChoiceAccept", this.object.interpreter, {
        pointer: this.object.interpreter.pointer,
        params: this.params
      }));
    }
    if (this.object.interpreter.waitingFor.inputNumber) {
      this.showInputNumber(GameManager.tempFields.digits, gs.CallBack("onInputNumberFinish", this.object.interpreter, this.object.interpreter));
    }
    if (this.object.interpreter.waitingFor.inputText) {
      return this.showInputText(GameManager.tempFields.letters, gs.CallBack("onInputTextFinish", this.object.interpreter, this.object.interpreter));
    }
  };


  /**
  * Sets up the main viewport / screen viewport.
  *
  * @method setupMainViewport
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupMainViewport = function() {
    if (!this.object.sceneData.viewport) {
      GameManager.sceneViewport.removeComponent(GameManager.sceneViewport.visual);
      GameManager.sceneViewport.dispose();
      GameManager.sceneViewport = new gs.Object_Viewport(GameManager.sceneViewport.visual.viewport);
      this.viewport = GameManager.sceneViewport.visual.viewport;
      return this.object.viewport = GameManager.sceneViewport;
    } else {
      GameManager.sceneViewport.dispose();
      GameManager.sceneViewport = this.object.sceneData.viewport;
      this.object.viewport = this.object.sceneData.viewport;
      this.viewport = this.object.viewport.visual.viewport;
      this.viewport.viewport = Graphics.viewport;
      return this.object.addObject(this.object.viewport);
    }
  };


  /**
  * Sets up screen.
  *
  * @method setupScreen
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupScreen = function() {
    if (this.object.sceneData.screen) {
      return this.object.viewport.restore(this.object.sceneData.screen);
    }
  };


  /**
  * Restores main interpreter from loaded save game.
  *
  * @method restoreInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreInterpreter = function() {
    if (this.object.sceneData.interpreter) {
      return this.object.interpreter.restore();
    }
  };


  /**
  * Restores message box from loaded save game.
  *
  * @method restoreMessageBox
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreMessageBox = function() {
    var c, j, len, message, messageBox, messageBoxes, messageObject, ref, results;
    messageBoxes = (ref = this.object.sceneData) != null ? ref.messageBoxes : void 0;
    if (messageBoxes) {
      results = [];
      for (j = 0, len = messageBoxes.length; j < len; j++) {
        messageBox = messageBoxes[j];
        messageObject = gs.ObjectManager.current.objectById(messageBox.id);
        messageObject.visible = messageBox.visible;
        if (messageBox.message) {
          message = gs.ObjectManager.current.objectById(messageBox.message.id);
          message.textRenderer.dispose();
          Object.mixin(message, messageBox.message, ui.Object_Message.objectCodecBlackList.concat(["origin"]));
          results.push((function() {
            var k, len1, ref1, results1;
            ref1 = message.components;
            results1 = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              c = ref1[k];
              results1.push(c.object = message);
            }
            return results1;
          })());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Restores message from loaded save game.
  *
  * @method restoreMessages
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreMessages = function() {
    var area, c, domain, i, message, messageArea, messageAreas, messageLayout, messageObject, ref, ref1, ref2, results;
    if (this.object.messageMode === vn.MessageMode.NVL) {
      messageObject = gs.ObjectManager.current.objectById("gameMessageNVL_message");
    } else {
      messageObject = gs.ObjectManager.current.objectById("gameMessage_message");
    }
    if ((ref = this.object.sceneData) != null ? ref.message : void 0) {
      messageObject.restore(this.object.sceneData.message);
    }
    if ((ref1 = this.object.sceneData) != null ? ref1.messages : void 0) {
      messageObject.message.restoreMessages(this.object.sceneData.messages);
      messageObject.textRenderer.restore(this.object.sceneData.messageTextRenderer);
    }
    if ((ref2 = this.object.sceneData) != null ? ref2.messageAreas : void 0) {
      results = [];
      for (domain in this.object.sceneData.messageAreas) {
        this.object.messageAreaContainer.behavior.changeDomain(domain);
        messageAreas = this.object.sceneData.messageAreas;
        if (messageAreas[domain]) {
          results.push((function() {
            var j, k, len, len1, ref3, ref4, results1;
            ref3 = messageAreas[domain];
            results1 = [];
            for (i = j = 0, len = ref3.length; j < len; i = ++j) {
              area = ref3[i];
              if (area) {
                messageArea = new gs.Object_MessageArea();
                messageLayout = ui.UIManager.createControlFromDescriptor({
                  type: "ui.CustomGameMessage",
                  id: "customGameMessage_" + i,
                  params: {
                    id: "customGameMessage_" + i
                  }
                }, messageArea);
                message = gs.ObjectManager.current.objectById("customGameMessage_" + i + "_message");
                Object.mixin(message, area.message);
                ref4 = message.components;
                for (k = 0, len1 = ref4.length; k < len1; k++) {
                  c = ref4[k];
                  c.object = message;
                }
                messageLayout.dstRect.x = area.layout.dstRect.x;
                messageLayout.dstRect.y = area.layout.dstRect.y;
                messageLayout.dstRect.width = area.layout.dstRect.width;
                messageLayout.dstRect.height = area.layout.dstRect.height;
                messageLayout.needsUpdate = true;
                messageLayout.update();
                messageArea.message = message;
                messageArea.layout = messageLayout;
                messageArea.addObject(messageLayout);
                results1.push(this.object.messageAreaContainer.setObject(messageArea, i));
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
    }
  };


  /**
  * Restores audio-playback from loaded save game.
  *
  * @method restoreAudioPlayback
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreAudioPlayback = function() {
    var b, j, len, ref;
    if (this.object.sceneData.audio) {
      ref = this.object.sceneData.audio.audioBuffers;
      for (j = 0, len = ref.length; j < len; j++) {
        b = ref[j];
        AudioManager.audioBuffers.push(b);
      }
      AudioManager.audioBuffersByLayer = this.object.sceneData.audio.audioBuffersByLayer;
      AudioManager.audioLayers = this.object.sceneData.audio.audioLayers;
      return AudioManager.soundReferences = this.object.sceneData.audio.soundReferences;
    }
  };


  /**
  * Restores the scene objects from the current loaded save-game. If no save-game is
  * present in GameManager.loadedSaveGame, nothing will happen.
  *
  * @method restoreScene
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreScene = function() {
    var c, context, ref, saveGame;
    saveGame = GameManager.loadedSaveGame;
    if (saveGame) {
      context = new gs.ObjectCodecContext([Graphics.viewport, this.object, this], saveGame.encodedObjectStore, null);
      saveGame.data = gs.ObjectCodec.decode(saveGame.data, context);
      if ((function() {
        var j, len, ref, results;
        ref = saveGame.data.characterNames;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          results.push(c);
        }
        return results;
      })()) {
        if ((ref = RecordManager.characters[c.index]) != null) {
          ref.name = c.name;
        }
      }
      GameManager.restore(saveGame);
      gs.ObjectCodec.onRestore(saveGame.data, context);
      this.resourceContext.fromDataBundle(saveGame.data.resourceContext, ResourceManager.resourcesByPath);
      this.object.sceneData = saveGame.data;
      return Graphics.frameCount = saveGame.data.frameCount;
    }
  };


  /**
  * Prepares all data for the scene and loads the necessary graphic and audio resources.
  *
  * @method prepareData
  * @abstract
   */

  Component_GameSceneBehavior.prototype.prepareData = function() {
    GameManager.scene = this.object;
    gs.ObjectManager.current = this.objectManager;
    this.object.sceneData.uid = this.object.sceneDocument.uid;
    if (!ResourceLoader.loadEventCommandsData(this.object.sceneDocument.items.commands)) {
      ResourceLoader.loadEventCommandsGraphics(this.object.sceneDocument.items.commands);
      GameManager.backlog = this.object.sceneData.backlog || GameManager.sceneData.backlog || [];
      ResourceLoader.loadSystemSounds();
      ResourceLoader.loadSystemGraphics();
      ResourceLoader.loadUiTypesGraphics(ui.UiFactory.customTypes);
      ResourceLoader.loadUiLayoutGraphics(ui.UiFactory.layouts.gameLayout);
      if (this.dataFields != null) {
        ResourceLoader.loadUiDataFieldsGraphics(this.dataFields);
      }
      $tempFields.choiceTimer = this.object.choiceTimer;
      return GameManager.variableStore.setup({
        id: this.object.sceneDocument.uid
      });
    }
  };


  /**
  * Prepares all visual game object for the scene.
  *
  * @method prepareVisual
   */

  Component_GameSceneBehavior.prototype.prepareVisual = function() {
    var ref;
    if (this.object.layout) {
      return;
    }
    if (GameManager.tempFields.isExitingGame) {
      GameManager.tempFields.isExitingGame = false;
      gs.GameNotifier.postResetSceneChange(this.object.sceneDocument.items.name);
    } else {
      gs.GameNotifier.postSceneChange(this.object.sceneDocument.items.name);
    }
    this.restoreScene();
    this.object.messageMode = (ref = this.object.sceneData.messageMode) != null ? ref : vn.MessageMode.ADV;
    this.setupMainViewport();
    this.setupViewports();
    this.setupCharacters();
    this.setupBackgrounds();
    this.setupPictures();
    this.setupTexts();
    this.setupVideos();
    this.setupHotspots();
    this.setupInterpreter();
    this.setupLayout();
    this.setupCommonEvents();
    this.restoreMessageBox();
    this.restoreInterpreter();
    this.restoreMessages();
    this.restoreAudioPlayback();
    this.show(true);
    this.object.sceneData = {};
    GameManager.sceneData = {};
    Graphics.update();
    return this.transition({
      duration: 0
    });
  };


  /**
  * Adds a new character to the scene.
  *
  * @method addCharacter
  * @param {vn.Object_Character} character - The character to add.
  * @param {boolean} noAnimation - Indicates if the character should be added immediately witout any appear-animation.
  * @param {Object} animationData - Contains the appear-animation data -> { animation, easing, duration }.
   */

  Component_GameSceneBehavior.prototype.addCharacter = function(character, noAnimation, animationData) {
    if (!noAnimation) {
      character.motionBlur.set(animationData.motionBlur);
      if (animationData.duration > 0) {
        if (!noAnimation) {
          character.animator.appear(character.dstRect.x, character.dstRect.y, animationData.animation, animationData.easing, animationData.duration);
        }
      }
    }
    character.viewport = this.viewport;
    character.visible = true;
    return this.object.characterContainer.addObject(character);
  };


  /**
  * Removes a character from the scene.
  *
  * @method removeCharacter
  * @param {vn.Object_Character} character - The character to remove.
  * @param {Object} animationData - Contains the disappear-animation data -> { animation, easing, duration }.
   */

  Component_GameSceneBehavior.prototype.removeCharacter = function(character, animationData) {
    return character != null ? character.animator.disappear(animationData.animation, animationData.easing, animationData.duration, function(sender) {
      return sender.dispose();
    }) : void 0;
  };


  /**
  * Resumes the current scene if it has been paused.
  *
  * @method resumeScene
   */

  Component_GameSceneBehavior.prototype.resumeScene = function() {
    var message;
    this.object.pictureContainer.active = true;
    this.object.characterContainer.active = true;
    this.object.backgroundContainer.active = true;
    this.object.textContainer.active = true;
    this.object.hotspotContainer.active = true;
    this.object.videoContainer.active = true;
    message = gs.ObjectManager.current.objectById("gameMessage_message");
    return message.active = true;
  };


  /**
  * Pauses the current scene. A paused scene will not continue, messages, pictures, etc. will
  * stop until the scene resumes.
  *
  * @method pauseScene
   */

  Component_GameSceneBehavior.prototype.pauseScene = function() {
    var message;
    this.object.pictureContainer.active = false;
    this.object.characterContainer.active = false;
    this.object.backgroundContainer.active = false;
    this.object.textContainer.active = false;
    this.object.hotspotContainer.active = false;
    this.object.videoContainer.active = false;
    message = gs.ObjectManager.current.objectById("gameMessage_message");
    return message.active = false;
  };


  /**
  * Shows input-text box to let the user enter a text.
  *
  * @param {number} letters - The max. number of letters the user can enter.
  * @param {gs.Callback} callback - A callback function called if the input-text box has been accepted by the user.
  * @method showInputText
   */

  Component_GameSceneBehavior.prototype.showInputText = function(letters, callback) {
    var ref;
    if ((ref = this.object.inputTextBox) != null) {
      ref.dispose();
    }
    this.object.inputTextBox = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.InputTextBox"], this.object);
    this.object.inputTextBox.ui.prepare();
    return this.object.inputTextBox.events.on("accept", callback);
  };


  /**
  * Shows input-number box to let the user enter a number.
  *
  * @param {number} digits - The max. number of digits the user can enter.
  * @param {gs.Callback} callback - A callback function called if the input-number box has been accepted by the user.
  * @method showInputNumber
   */

  Component_GameSceneBehavior.prototype.showInputNumber = function(digits, callback) {
    var ref;
    if ((ref = this.object.inputNumberBox) != null) {
      ref.dispose();
    }
    this.object.inputNumberBox = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.InputNumberBox"], this.object);
    this.object.inputNumberBox.ui.prepare();
    return this.object.inputNumberBox.events.on("accept", callback);
  };


  /**
  * Shows choices to let the user pick a choice.
  *
  * @param {Object[]} choices - An array of choices
  * @param {gs.Callback} callback - A callback function called if a choice has been picked by the user.
  * @method showChoices
   */

  Component_GameSceneBehavior.prototype.showChoices = function(choices, callback) {
    var ref, useFreeLayout;
    useFreeLayout = choices.where(function(x) {
      return x.dstRect != null;
    }).length > 0;
    GameManager.tempFields.choices = choices;
    if ((ref = this.object.choiceWindow) != null) {
      ref.dispose();
    }
    if (useFreeLayout) {
      this.object.choiceWindow = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.FreeChoiceBox"], this.object);
    } else {
      this.object.choiceWindow = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.ChoiceBox"], this.object);
    }
    this.object.choiceWindow.events.on("selectionAccept", callback);
    return this.object.choiceWindow.ui.prepare();
  };


  /**
  * Changes the background of the scene.
  *
  * @method changeBackground
  * @param {Object} background - The background graphic object -> { name }
  * @param {boolean} noAnimation - Indicates if the background should be changed immediately witout any change-animation.
  * @param {Object} animation - The appear/disappear animation to use.
  * @param {Object} easing - The easing of the change animation.
  * @param {number} duration - The duration of the change in frames.
  * @param {number} ox - The x-origin of the background.
  * @param {number} oy - The y-origin of the background.
  * @param {number} layer - The background-layer to change.
  * @param {boolean} loopHorizontal - Indicates if the background should be looped horizontally.
  * @param {boolean} loopVertical - Indicates if the background should be looped vertically.
   */

  Component_GameSceneBehavior.prototype.changeBackground = function(background, noAnimation, animation, easing, duration, ox, oy, layer, loopHorizontal, loopVertical) {
    var object, otherObject, ref;
    if (background != null) {
      otherObject = this.object.backgrounds[layer];
      object = new vn.Object_Background();
      object.image = background.name;
      object.origin.x = ox;
      object.origin.y = oy;
      object.viewport = this.viewport;
      object.visual.looping.vertical = false;
      object.visual.looping.horizontal = false;
      object.update();
      this.object.backgroundContainer.setObject(object, layer);
      duration = duration != null ? duration : 30;
      if (otherObject != null) {
        otherObject.zIndex = layer;
      }
      if (duration === 0) {
        if (otherObject != null) {
          otherObject.dispose();
        }
        object.visual.looping.vertical = loopVertical;
        return object.visual.looping.horizontal = loopHorizontal;
      } else {
        if (noAnimation) {
          object.visual.looping.vertical = loopVertical;
          return object.visual.looping.horizontal = loopHorizontal;
        } else {
          object.animator.otherObject = otherObject;
          return object.animator.appear(0, 0, animation, easing, duration, (function(_this) {
            return function(sender) {
              var ref;
              sender.update();
              if ((ref = sender.animator.otherObject) != null) {
                ref.dispose();
              }
              sender.animator.otherObject = null;
              sender.visual.looping.vertical = loopVertical;
              return sender.visual.looping.horizontal = loopHorizontal;
            };
          })(this));
        }
      }
    } else {
      return (ref = this.object.backgrounds[layer]) != null ? ref.animator.hide(duration, easing, (function(_this) {
        return function() {
          _this.object.backgrounds[layer].dispose();
          return _this.object.backgrounds[layer] = null;
        };
      })(this)) : void 0;
    }
  };


  /**
  * Skips all viewport animations except the main viewport animation.
  *
  * @method skipViewports
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipViewports = function() {
    var component, j, k, len, len1, ref, viewport, viewports;
    viewports = this.object.viewportContainer.subObjects;
    for (j = 0, len = viewports.length; j < len; j++) {
      viewport = viewports[j];
      if (viewport) {
        ref = viewport.components;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          component = ref[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all picture animations.
  *
  * @method skipPictures
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipPictures = function() {
    var component, j, k, len, len1, picture, ref, ref1;
    ref = this.object.pictures;
    for (j = 0, len = ref.length; j < len; j++) {
      picture = ref[j];
      if (picture) {
        ref1 = picture.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all text animations.
  *
  * @method skipTexts
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipTexts = function() {
    var component, j, k, len, len1, ref, ref1, text;
    ref = this.object.texts;
    for (j = 0, len = ref.length; j < len; j++) {
      text = ref[j];
      if (text) {
        ref1 = text.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all video animations but not the video-playback itself.
  *
  * @method skipVideos
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipVideos = function() {
    var component, j, k, len, len1, ref, ref1, video;
    ref = this.object.videos;
    for (j = 0, len = ref.length; j < len; j++) {
      video = ref[j];
      if (video) {
        ref1 = video.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all background animations.
  *
  * @method skipBackgrounds
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipBackgrounds = function() {
    var background, component, j, k, len, len1, ref, ref1;
    ref = this.object.backgrounds;
    for (j = 0, len = ref.length; j < len; j++) {
      background = ref[j];
      if (background) {
        ref1 = background.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all character animations
  *
  * @method skipCharacters
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipCharacters = function() {
    var character, component, j, k, len, len1, ref, ref1;
    ref = this.object.characters;
    for (j = 0, len = ref.length; j < len; j++) {
      character = ref[j];
      if (character) {
        ref1 = character.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips the main viewport animation.
  *
  * @method skipMainViewport
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMainViewport = function() {
    var component, j, len, ref;
    ref = this.object.viewport.components;
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      if (typeof component.skip === "function") {
        component.skip();
      }
    }
    return null;
  };


  /**
  * Skips all animations of all message boxes defined in MESSAGE_BOX_IDS ui constant.
  *
  * @method skipMessageBoxes
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMessageBoxes = function() {
    var component, j, k, len, len1, messageBox, messageBoxId, ref, ref1;
    ref = gs.UIConstants.MESSAGE_BOX_IDS || ["messageBox", "messageBoxNVL"];
    for (j = 0, len = ref.length; j < len; j++) {
      messageBoxId = ref[j];
      messageBox = gs.ObjectManager.current.objectById(messageBoxId);
      if (messageBox.components) {
        ref1 = messageBox.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all animations of all message areas.
  *
  * @method skipMessageAreas
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMessageAreas = function() {
    var component, j, k, l, len, len1, len2, len3, m, messageArea, msg, ref, ref1, ref2, ref3;
    ref = this.object.messageAreas;
    for (j = 0, len = ref.length; j < len; j++) {
      messageArea = ref[j];
      if (messageArea != null ? messageArea.message : void 0) {
        ref1 = messageArea.message.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    msg = gs.ObjectManager.current.objectById("gameMessage_message");
    if (msg) {
      ref2 = msg.components;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        component = ref2[l];
        if (typeof component.skip === "function") {
          component.skip();
        }
      }
    }
    msg = gs.ObjectManager.current.objectById("gameMessageNVL_message");
    if (msg) {
      ref3 = msg.components;
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        component = ref3[m];
        if (typeof component.skip === "function") {
          component.skip();
        }
      }
    }
    return null;
  };


  /**
  * Skips the scene interpreter timer.
  *
  * @method skipInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipInterpreter = function() {
    if (this.object.interpreter.waitCounter > GameManager.tempSettings.skipTime) {
      this.object.interpreter.waitCounter = GameManager.tempSettings.skipTime;
      if (this.object.interpreter.waitCounter === 0) {
        return this.object.interpreter.isWaiting = false;
      }
    }
  };


  /**
  * Skips the interpreter timer of all common events.
  *
  * @method skipCommonEvents
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipCommonEvents = function() {
    var event, events, j, len, results;
    events = this.object.commonEventContainer.subObjects;
    results = [];
    for (j = 0, len = events.length; j < len; j++) {
      event = events[j];
      if ((event != null ? event.interpreter : void 0) && event.interpreter.waitCounter > GameManager.tempSettings.skipTime) {
        event.interpreter.waitCounter = GameManager.tempSettings.skipTime;
        if (event.interpreter.waitCounter === 0) {
          results.push(event.interpreter.isWaiting = false);
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Skips the scene's content.
  *
  * @method skipContent
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipContent = function() {
    this.skipPictures();
    this.skipTexts();
    this.skipVideos();
    this.skipBackgrounds();
    this.skipCharacters();
    this.skipMainViewport();
    this.skipViewports();
    this.skipMessageBoxes();
    this.skipMessageAreas();
    this.skipInterpreter();
    return this.skipCommonEvents();
  };


  /**
  * Updates the scene's content.
  *
  * @method updateContent
   */

  Component_GameSceneBehavior.prototype.updateContent = function() {
    GameManager.scene = this.object;
    if (!this.object.settings.allowSkip) {
      this.object.tempSettings.skip = false;
    }
    Graphics.viewport.update();
    this.object.viewport.update();
    if (GameManager.tempSettings.skip) {
      this.skipContent();
    }
    if (this.object.video != null) {
      this.object.video.update();
      if (this.object.settings.allowVideoSkip && (Input.trigger(Input.C) || Input.Mouse.buttons[Input.Mouse.LEFT] === 2)) {
        this.object.video.stop();
      }
      Input.clear();
    }
    if (GameManager.tempSettings.menuAccess && Input.trigger(Input.X)) {
      SceneManager.switchTo(new gs.Object_Layout("settingsMenuLayout"), true);
    }
    if (Input.trigger(Input.KEY_ESCAPE)) {
      gs.Application.exit();
    }
    if (this.object.settings.allowSkip) {
      if (Input.keys[Input.KEY_CONTROL] === 1) {
        GameManager.tempSettings.skip = true;
      } else if (Input.keys[Input.KEY_CONTROL] === 2) {
        GameManager.tempSettings.skip = false;
      }
    }
    return Component_GameSceneBehavior.__super__.updateContent.call(this);
  };

  return Component_GameSceneBehavior;

})(gs.Component_LayoutSceneBehavior);

vn.Component_GameSceneBehavior = Component_GameSceneBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsMkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFFRjs7Ozs7Ozs7O0VBUWEscUNBQUE7SUFDVCwyREFBQTtJQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDdEIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBaEM7ZUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFwQixDQUFBO01BRnNCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtJQUcxQixJQUFDLENBQUEsdUJBQUQsR0FBMkIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ3ZCLElBQUcsQ0FBQyxLQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFuQixDQUE0QixLQUFDLENBQUEsTUFBTSxDQUFDLFdBQXBDLENBQUo7VUFDSSxLQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxXQUE3QixFQURKOztlQUVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQXBCLENBQUE7TUFIdUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBSzNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxZQUFELEdBQWdCO0VBWlA7OztBQWNiOzs7Ozs7d0NBS0EsVUFBQSxHQUFZLFNBQUE7QUFDUixRQUFBO0lBQUEsSUFBRyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQTVCLEtBQXNDLENBQXpDO01BQ0ksRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQXRCLENBQUEsRUFESjs7SUFHQSxJQUFDLENBQUEsZUFBRCxHQUFtQixlQUFlLENBQUMsYUFBaEIsQ0FBQTtJQUNuQixlQUFlLENBQUMsT0FBaEIsR0FBMEIsSUFBQyxDQUFB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LEtBQU4sQ0FBQSxFQUpKOztJQU1BLElBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxVQUF6QixJQUF3QyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQUssQ0FBQyxDQUFwQixDQUEzQztNQUNJLFlBQVksQ0FBQyxRQUFiLENBQTBCLElBQUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsb0JBQWpCLENBQTFCLEVBQWtFLElBQWxFLEVBREo7O0lBRUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQUssQ0FBQyxVQUFwQixDQUFIO01BQ0ksRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFmLENBQUEsRUFESjs7SUFHQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQXBCO01BQ0ksSUFBRyxLQUFLLENBQUMsSUFBSyxDQUFBLEtBQUssQ0FBQyxXQUFOLENBQVgsS0FBaUMsQ0FBcEM7UUFDSSxXQUFXLENBQUMsWUFBWSxDQUFDLElBQXpCLEdBQWdDLEtBRHBDO09BQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxJQUFLLENBQUEsS0FBSyxDQUFDLFdBQU4sQ0FBWCxLQUFpQyxDQUFwQztRQUNELFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBekIsR0FBZ0MsTUFEL0I7T0FIVDs7V0FNQSw2REFBQTtFQS9CVzs7OztHQWwzQnVCLEVBQUUsQ0FBQzs7QUFtNUI3QyxFQUFFLENBQUMsMkJBQUgsR0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9HYW1lU2NlbmVCZWhhdmlvclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0dhbWVTY2VuZUJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50X0xheW91dFNjZW5lQmVoYXZpb3JcbiAjICAgQG9iamVjdENvZGVjQmxhY2tMaXN0ID0gW1wib2JqZWN0TWFuYWdlclwiXVxuICAgICMjIypcbiAgICAqIERlZmluZXMgdGhlIGJlaGF2aW9yIG9mIHZpc3VhbCBub3ZlbCBnYW1lIHNjZW5lLlxuICAgICpcbiAgICAqIEBtb2R1bGUgdm5cbiAgICAqIEBjbGFzcyBDb21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRTY2VuZUJlaGF2aW9yXG4gICAgKiBAbWVtYmVyb2Ygdm5cbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgQG9uQXV0b0NvbW1vbkV2ZW50U3RhcnQgPSA9PlxuICAgICAgICAgICAgQG9iamVjdC5yZW1vdmVDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuc3RvcCgpXG4gICAgICAgIEBvbkF1dG9Db21tb25FdmVudEZpbmlzaCA9ID0+XG4gICAgICAgICAgICBpZiAhQG9iamVjdC5jb21wb25lbnRzLmNvbnRhaW5zKEBvYmplY3QuaW50ZXJwcmV0ZXIpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5hZGRDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIucmVzdW1lKClcbiAgICAgICAgICAgIFxuICAgICAgICBAcmVzb3VyY2VDb250ZXh0ID0gbnVsbFxuICAgICAgICBAb2JqZWN0RG9tYWluID0gXCJcIlxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgc2NlbmUuIFxuICAgICpcbiAgICAqIEBtZXRob2QgaW5pdGlhbGl6ZVxuICAgICMjIyBcbiAgICBpbml0aWFsaXplOiAtPlxuICAgICAgICBpZiBTY2VuZU1hbmFnZXIucHJldmlvdXNTY2VuZXMubGVuZ3RoID09IDBcbiAgICAgICAgICAgIGdzLkdsb2JhbEV2ZW50TWFuYWdlci5jbGVhcigpXG4gICAgICAgICAgICBcbiAgICAgICAgQHJlc291cmNlQ29udGV4dCA9IFJlc291cmNlTWFuYWdlci5jcmVhdGVDb250ZXh0KClcbiAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmNvbnRleHQgPSBAcmVzb3VyY2VDb250ZXh0XG4gICAgICAgIFxuICAgICAgICBHcmFwaGljcy5mcmVlemUoKVxuICAgICAgICBzYXZlR2FtZSA9IEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lXG4gICAgICAgIHNjZW5lVWlkID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgc2F2ZUdhbWVcbiAgICAgICAgICAgIHNjZW5lVWlkID0gc2F2ZUdhbWUuc2NlbmVVaWRcbiAgICAgICAgICAgIEBvYmplY3Quc2NlbmVEYXRhID0gc2F2ZUdhbWUuZGF0YVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzY2VuZVVpZCA9ICRQQVJBTVMucHJldmlldz8uc2NlbmUudWlkIHx8IEBvYmplY3Quc2NlbmVEYXRhLnVpZCB8fCBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5zdGFydEluZm8uc2NlbmUudWlkXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LnNjZW5lRG9jdW1lbnQgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChzY2VuZVVpZClcbiAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEb2N1bWVudCBhbmQgQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLnR5cGUgPT0gXCJ2bi5zY2VuZVwiXG4gICAgICAgICAgICBAb2JqZWN0LmNoYXB0ZXIgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMuY2hhcHRlclVpZClcbiAgICAgICAgICAgIEBvYmplY3QuY3VycmVudENoYXJhY3RlciA9IHsgXCJuYW1lXCI6IFwiXCIgfSAjUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzWzBdXG4gICAgXG4gICAgICAgICAgICBpZiBub3QgR2FtZU1hbmFnZXIuaW5pdGlhbGl6ZWRcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci5pbml0aWFsaXplKClcbiAgICBcbiAgICAgICAgICAgIExhbmd1YWdlTWFuYWdlci5sb2FkQnVuZGxlcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNwcml0ZSA9IG5ldyBncy5TcHJpdGUoKVxuICAgICAgICAgICAgc3ByaXRlLmJpdG1hcCA9IG5ldyBncy5CaXRtYXAoR3JhcGhpY3Mud2lkdGgsIDUwKVxuICAgICAgICAgICAgc3ByaXRlLmJpdG1hcC5kcmF3VGV4dCgwLCAwLCBHcmFwaGljcy53aWR0aCwgNTAsIFwiTm8gU3RhcnQgU2NlbmUgc2VsZWN0ZWRcIiwgMSwgMClcbiAgICAgICAgICAgIHNwcml0ZS5zcmNSZWN0ID0gbmV3IGdzLlJlY3QoMCwgMCwgR3JhcGhpY3Mud2lkdGgsIDUwKVxuICAgICAgICAgICAgc3ByaXRlLnkgPSAoR3JhcGhpY3MuaGVpZ2h0IC0gNTApIC8gMlxuICAgICAgICAgICAgc3ByaXRlLnogPSAxMDAwMFxuICAgXG4gICAgICAgIEBzZXR1cFNjcmVlbigpIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyB0aGUgc2NlbmUuIFxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZVxuICAgICMjI1xuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIFJlc291cmNlTWFuYWdlci5jb250ZXh0ID0gQHJlc291cmNlQ29udGV4dFxuICAgICAgICBAb2JqZWN0LnJlbW92ZU9iamVjdChAb2JqZWN0LmNvbW1vbkV2ZW50Q29udGFpbmVyKVxuICAgICAgICBAc2hvdyhubylcblxuICAgICAgICBmb3IgZXZlbnQgaW4gR2FtZU1hbmFnZXIuY29tbW9uRXZlbnRzXG4gICAgICAgICAgICBpZiBldmVudFxuICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vZmZCeU93bmVyKFwic3RhcnRcIiwgQG9iamVjdClcbiAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub2ZmQnlPd25lcihcImZpbmlzaFwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3QudmlkZW9cbiAgICAgICAgICAgIEBvYmplY3QudmlkZW8uZGlzcG9zZSgpXG4gICAgICAgICAgICBAb2JqZWN0LnZpZGVvLm9uRW5kZWQoKVxuICAgICAgICBcbiAgICAgICAgc3VwZXIoKVxuICAgIFxuICAgIGNoYW5nZVBpY3R1cmVEb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVzID0gQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VUZXh0RG9tYWluOiAoZG9tYWluKSAtPlxuICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC50ZXh0cyA9IEBvYmplY3QudGV4dENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgY2hhbmdlVmlkZW9Eb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QudmlkZW9Db250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC52aWRlb3MgPSBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VIb3RzcG90RG9tYWluOiAoZG9tYWluKSAtPlxuICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC5ob3RzcG90cyA9IEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgY2hhbmdlTWVzc2FnZUFyZWFEb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QubWVzc2FnZUFyZWFDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYXMgPSBAb2JqZWN0Lm1lc3NhZ2VBcmVhQ29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNob3dzL0hpZGVzIHRoZSBjdXJyZW50IHNjZW5lLiBBIGhpZGRlbiBzY2VuZSBpcyBubyBsb25nZXIgc2hvd24gYW5kIGV4ZWN1dGVkXG4gICAgKiBidXQgYWxsIG9iamVjdHMgYW5kIGRhdGEgaXMgc3RpbGwgdGhlcmUgYW5kIGJlIHNob3duIGFnYWluIGFueXRpbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzaG93XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBJbmRpY2F0ZXMgaWYgdGhlIHNjZW5lIHNob3VsZCBiZSBzaG93biBvciBoaWRkZW4uXG4gICAgIyMjICAgICAgICAgIFxuICAgIHNob3c6ICh2aXNpYmxlKSAtPlxuICAgICAgICBAb2JqZWN0LnZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LmxheW91dD8udXBkYXRlKClcbiAgICAgICAgQG9iamVjdC5sYXlvdXROVkw/LnVwZGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmJlaGF2aW9yLnNldFZpc2libGUodmlzaWJsZSlcbiAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3Qudmlld3BvcnRDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QuYmFja2dyb3VuZENvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG5cbiAgICAgICAgQHZpZXdwb3J0Py52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdz8udmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveD8udmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3g/LnZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgIEBvYmplY3QuaW5wdXRUZXh0Qm94Py51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94Py51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdz8udXBkYXRlKClcbiAgICAgICAgXG4gICAgICAgICNpZiB2aXNpYmxlIGFuZCBAb2JqZWN0LmNvbW1vbkV2ZW50Q29udGFpbmVyLnN1Yk9iamVjdHMubGVuZ3RoID09IDBcbiAgICAgICAgQHNldHVwQ29tbW9uRXZlbnRzKClcbiAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBjb21tb24gZXZlbnQgaGFuZGxpbmcuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cENvbW1vbkV2ZW50c1xuICAgICMjIyAgIFxuICAgIHNldHVwQ29tbW9uRXZlbnRzOiAtPlxuICAgICAgICBjb21tb25FdmVudHMgPSBAb2JqZWN0LnNjZW5lRGF0YT8uY29tbW9uRXZlbnRzXG4gICAgICAgIFxuICAgICAgICBpZiBjb21tb25FdmVudHNcbiAgICAgICAgICAgIGZvciBldmVudCwgaSBpbiBjb21tb25FdmVudHNcbiAgICAgICAgICAgICAgICBpZiBldmVudCBhbmQgQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzLmluZGV4T2YoZXZlbnQpID09IC0xXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc2V0T2JqZWN0KGV2ZW50LCBpKVxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZWhhdmlvci5zZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiBldmVudC5pbnRlcnByZXRlcj8uaXNSdW5uaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMuZW1pdChcInN0YXJ0XCIsIGV2ZW50KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgZXZlbnQsIGkgaW4gR2FtZU1hbmFnZXIuY29tbW9uRXZlbnRzXG4gICAgICAgICAgICAgICAgaWYgZXZlbnQgYW5kIChldmVudC5yZWNvcmQuc3RhcnRDb25kaXRpb24gPT0gMSBvciBldmVudC5yZWNvcmQucGFyYWxsZWwpIGFuZCBAb2JqZWN0LmNvbW1vbkV2ZW50Q29udGFpbmVyLnN1Yk9iamVjdHMuaW5kZXhPZihldmVudCkgPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zZXRPYmplY3QoZXZlbnQsIGkpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub2ZmQnlPd25lcihcInN0YXJ0XCIsIEBvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vZmZCeU93bmVyKFwiZmluaXNoXCIsIEBvYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgZXZlbnQucmVjb3JkLnBhcmFsbGVsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub24gXCJzdGFydFwiLCBncy5DYWxsQmFjayhcIm9uQXV0b0NvbW1vbkV2ZW50U3RhcnRcIiwgdGhpcyksIG51bGwsIEBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vbiBcImZpbmlzaFwiLCBncy5DYWxsQmFjayhcIm9uQXV0b0NvbW1vbkV2ZW50RmluaXNoXCIsIHRoaXMpLCBudWxsLCBAb2JqZWN0XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXZlbnQuaW50ZXJwcmV0ZXI/LmlzUnVubmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLmVtaXQoXCJzdGFydFwiLCBldmVudClcbiAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIG1haW4gaW50ZXJwcmV0ZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEludGVycHJldGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgc2V0dXBJbnRlcnByZXRlcjogLT5cbiAgICAgICAgQG9iamVjdC5jb21tYW5kcyA9IEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kc1xuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURhdGEuaW50ZXJwcmV0ZXJcbiAgICAgICAgICAgIEBvYmplY3QucmVtb3ZlQ29tcG9uZW50KEBvYmplY3QuaW50ZXJwcmV0ZXIpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyID0gQG9iamVjdC5zY2VuZURhdGEuaW50ZXJwcmV0ZXJcbiAgICAgICAgICAgIEBvYmplY3QuYWRkQ29tcG9uZW50KEBvYmplY3QuaW50ZXJwcmV0ZXIpXG4gICAgICAgICAgICAjT2JqZWN0Lm1peGluKEBvYmplY3QuaW50ZXJwcmV0ZXIsIEBvYmplY3Quc2NlbmVEYXRhLmludGVycHJldGVyLCBncy5Db21wb25lbnRfQ29tbWFuZEludGVycHJldGVyLm9iamVjdENvZGVjQmxhY2tMaXN0KVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5jb250ZXh0LnNldChAb2JqZWN0LnNjZW5lRG9jdW1lbnQudWlkLCBAb2JqZWN0KVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5vYmplY3QgPSBAb2JqZWN0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuc2V0dXAoKVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5jb250ZXh0LnNldChAb2JqZWN0LnNjZW5lRG9jdW1lbnQudWlkLCBAb2JqZWN0KVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5zdGFydCgpXG4gICAgICAgICAgICBcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBjaGFyYWN0ZXJzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cENoYXJhY3RlcnNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgXG4gICAgc2V0dXBDaGFyYWN0ZXJzOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5jaGFyYWN0ZXJzP1xuICAgICAgICAgICAgZm9yIGMsIGkgaW4gQG9iamVjdC5zY2VuZURhdGEuY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgIEBvYmplY3QuY2hhcmFjdGVyQ29udGFpbmVyLnNldE9iamVjdChjLCBpKVxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5jdXJyZW50Q2hhcmFjdGVyID0gQG9iamVjdC5zY2VuZURhdGEuY3VycmVudENoYXJhY3RlciB8fCB7IG5hbWU6IFwiXCIgfSNSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbMF1cbiAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHZpZXdwb3J0cyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBWaWV3cG9ydHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgXG4gICAgc2V0dXBWaWV3cG9ydHM6IC0+XG4gICAgICAgIHZpZXdwb3J0cyA9IEBvYmplY3Quc2NlbmVEYXRhPy52aWV3cG9ydHMgPyBbXVxuICAgICAgICBmb3Igdmlld3BvcnQsIGkgaW4gdmlld3BvcnRzXG4gICAgICAgICAgICBpZiB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIEBvYmplY3Qudmlld3BvcnRDb250YWluZXIuc2V0T2JqZWN0KHZpZXdwb3J0LCBpKVxuICAgICMjIypcbiAgICAqIFNldHMgdXAgYmFja2dyb3VuZHMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQmFja2dyb3VuZHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICBcbiAgICBzZXR1cEJhY2tncm91bmRzOiAtPlxuICAgICAgICBiYWNrZ3JvdW5kcyA9IEBvYmplY3Quc2NlbmVEYXRhPy5iYWNrZ3JvdW5kcyA/IFtdXG4gICAgICAgIGZvciBiLCBpIGluIGJhY2tncm91bmRzXG4gICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuc2V0T2JqZWN0KGIsIGkpXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHBpY3R1cmVzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFBpY3R1cmVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgc2V0dXBQaWN0dXJlczogLT5cbiAgICAgICAgcGljdHVyZXMgPSBAb2JqZWN0LnNjZW5lRGF0YT8ucGljdHVyZXMgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIHBpY3R1cmVzXG4gICAgICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIHBpY3R1cmVzW2RvbWFpbl0gdGhlbiBmb3IgcGljdHVyZSwgaSBpbiBwaWN0dXJlc1tkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLnNldE9iamVjdChwaWN0dXJlLCBpKVxuICAgICAgICAgICAgICAgIGlmIHBpY3R1cmU/LmltYWdlXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIkdyYXBoaWNzL1BpY3R1cmVzLyN7cGljdHVyZS5pbWFnZX1cIlxuICAgICAgICAgICAgICAgICAgICBAcmVzb3VyY2VDb250ZXh0LmFkZChwYXRoLCBSZXNvdXJjZU1hbmFnZXIucmVzb3VyY2VzQnlQYXRoW3BhdGhdKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRleHRzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFRleHRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgXG4gICAgc2V0dXBUZXh0czogLT5cbiAgICAgICAgdGV4dHMgPSBAb2JqZWN0LnNjZW5lRGF0YT8udGV4dHMgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIHRleHRzXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIHRleHRzW2RvbWFpbl0gdGhlbiBmb3IgdGV4dCwgaSBpbiB0ZXh0c1tkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC50ZXh0Q29udGFpbmVyLnNldE9iamVjdCh0ZXh0LCBpKVxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB2aWRlb3MgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwVmlkZW9zXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIHNldHVwVmlkZW9zOiAtPlxuICAgICAgICB2aWRlb3MgPSBAb2JqZWN0LnNjZW5lRGF0YT8udmlkZW9zID8ge31cbiAgICAgICAgZm9yIGRvbWFpbiBvZiB2aWRlb3NcbiAgICAgICAgICAgIEBvYmplY3QudmlkZW9Db250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIHZpZGVvc1tkb21haW5dIHRoZW4gZm9yIHZpZGVvLCBpIGluIHZpZGVvc1tkb21haW5dXG4gICAgICAgICAgICAgICAgaWYgdmlkZW9cbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiTW92aWVzLyN7dmlkZW8udmlkZW99XCJcbiAgICAgICAgICAgICAgICAgICAgQHJlc291cmNlQ29udGV4dC5hZGQocGF0aCwgUmVzb3VyY2VNYW5hZ2VyLnJlc291cmNlc0J5UGF0aFtwYXRoXSlcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8udmlzaWJsZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICB2aWRlby51cGRhdGUoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLnNldE9iamVjdCh2aWRlbywgaSlcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBob3RzcG90cyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBIb3RzcG90c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgXG4gICAgc2V0dXBIb3RzcG90czogLT5cbiAgICAgICAgaG90c3BvdHMgPSBAb2JqZWN0LnNjZW5lRGF0YT8uaG90c3BvdHMgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIGhvdHNwb3RzXG4gICAgICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIGhvdHNwb3RzW2RvbWFpbl0gdGhlbiBmb3IgaG90c3BvdCwgaSBpbiBob3RzcG90c1tkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC5ob3RzcG90Q29udGFpbmVyLnNldE9iamVjdChob3RzcG90LCBpKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIGxheW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwTGF5b3V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgIFxuICAgIHNldHVwTGF5b3V0OiAtPlxuICAgICAgICBAZGF0YUZpZWxkcyA9IHVpLlVJTWFuYWdlci5kYXRhU291cmNlc1t1aS5VaUZhY3RvcnkubGF5b3V0cy5nYW1lTGF5b3V0LmRhdGFTb3VyY2UgfHwgXCJkZWZhdWx0XCJdKClcbiAgICAgICAgQGRhdGFGaWVsZHMuc2NlbmUgPSBAb2JqZWN0XG4gICAgICAgIHdpbmRvdy4kZGF0YUZpZWxkcyA9IEBkYXRhRmllbGRzXG4gICAgICAgIGFkdlZpc2libGUgPSBAb2JqZWN0Lm1lc3NhZ2VNb2RlID09IHZuLk1lc3NhZ2VNb2RlLkFEVlxuICAgICAgICBudmxWaXNpYmxlID0gQG9iamVjdC5tZXNzYWdlTW9kZSA9PSB2bi5NZXNzYWdlTW9kZS5OVkxcbiAgICAgICAgQG9iamVjdC5sYXlvdXROVkwgPSB1aS5VaUZhY3RvcnkuY3JlYXRlRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dE5WTCwgQG9iamVjdClcbiAgICAgICAgQG9iamVjdC5sYXlvdXQgPSB1aS5VaUZhY3RvcnkuY3JlYXRlRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dCwgQG9iamVjdClcbiAgICAgICAgQG9iamVjdC5sYXlvdXROVkwudmlzaWJsZSA9IG52bFZpc2libGVcbiAgICAgICAgQG9iamVjdC5sYXlvdXQudmlzaWJsZSA9IGFkdlZpc2libGVcbiAgICAgICAgJGdhbWVNZXNzYWdlTlZMX21lc3NhZ2UudmlzaWJsZSA9IG52bFZpc2libGVcbiAgICAgICAgJGdhbWVNZXNzYWdlX21lc3NhZ2UudmlzaWJsZSA9IGFkdlZpc2libGVcbiAgICAgICAgQG9iamVjdC5sYXlvdXQudWkucHJlcGFyZSgpXG4gICAgICAgIEBvYmplY3QubGF5b3V0TlZMLnVpLnByZXBhcmUoKVxuICAgICAgICBcbiAgICAgICAgaWYgJHRlbXBGaWVsZHMuY2hvaWNlcz8ubGVuZ3RoID4gMFxuICAgICAgICAgICAgQHNob3dDaG9pY2VzKEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlcywgZ3MuQ2FsbEJhY2soXCJvbkNob2ljZUFjY2VwdFwiLCBAb2JqZWN0LmludGVycHJldGVyLCB7IHBvaW50ZXI6IEBvYmplY3QuaW50ZXJwcmV0ZXIucG9pbnRlciwgcGFyYW1zOiBAcGFyYW1zIH0pKVxuICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRpbmdGb3IuaW5wdXROdW1iZXJcbiAgICAgICAgICAgIEBzaG93SW5wdXROdW1iZXIoR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5kaWdpdHMsIGdzLkNhbGxCYWNrKFwib25JbnB1dE51bWJlckZpbmlzaFwiLCBAb2JqZWN0LmludGVycHJldGVyLCBAb2JqZWN0LmludGVycHJldGVyKSlcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRpbmdGb3IuaW5wdXRUZXh0XG4gICAgICAgICAgICBAc2hvd0lucHV0VGV4dChHYW1lTWFuYWdlci50ZW1wRmllbGRzLmxldHRlcnMsIGdzLkNhbGxCYWNrKFwib25JbnB1dFRleHRGaW5pc2hcIiwgQG9iamVjdC5pbnRlcnByZXRlciwgQG9iamVjdC5pbnRlcnByZXRlcikpXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdXAgdGhlIG1haW4gdmlld3BvcnQgLyBzY3JlZW4gdmlld3BvcnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cE1haW5WaWV3cG9ydFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBzZXR1cE1haW5WaWV3cG9ydDogLT5cbiAgICAgICAgaWYgIUBvYmplY3Quc2NlbmVEYXRhLnZpZXdwb3J0XG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnJlbW92ZUNvbXBvbmVudChHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnZpc3VhbClcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuZGlzcG9zZSgpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0ID0gbmV3IGdzLk9iamVjdF9WaWV3cG9ydChHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnZpc3VhbC52aWV3cG9ydClcbiAgICAgICAgICAgIEB2aWV3cG9ydCA9IEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQudmlzdWFsLnZpZXdwb3J0XG4gICAgICAgICAgICBAb2JqZWN0LnZpZXdwb3J0ID0gR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LmRpc3Bvc2UoKVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydCA9IEBvYmplY3Quc2NlbmVEYXRhLnZpZXdwb3J0XG4gICAgICAgICAgICBAb2JqZWN0LnZpZXdwb3J0ID0gQG9iamVjdC5zY2VuZURhdGEudmlld3BvcnRcbiAgICAgICAgICAgIEB2aWV3cG9ydCA9IEBvYmplY3Qudmlld3BvcnQudmlzdWFsLnZpZXdwb3J0XG4gICAgICAgICAgICBAdmlld3BvcnQudmlld3BvcnQgPSBHcmFwaGljcy52aWV3cG9ydFxuICAgICAgICAgICAgQG9iamVjdC5hZGRPYmplY3QoQG9iamVjdC52aWV3cG9ydClcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdXAgc2NyZWVuLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBTY3JlZW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgc2V0dXBTY3JlZW46IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLnNjcmVlblxuICAgICAgICAgICAgQG9iamVjdC52aWV3cG9ydC5yZXN0b3JlKEBvYmplY3Quc2NlbmVEYXRhLnNjcmVlbilcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIG1haW4gaW50ZXJwcmV0ZXIgZnJvbSBsb2FkZWQgc2F2ZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZUludGVycHJldGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgICAgXG4gICAgcmVzdG9yZUludGVycHJldGVyOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5pbnRlcnByZXRlclxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5yZXN0b3JlKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyBtZXNzYWdlIGJveCBmcm9tIGxvYWRlZCBzYXZlIGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlTWVzc2FnZUJveFxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgcmVzdG9yZU1lc3NhZ2VCb3g6IC0+XG4gICAgICAgIG1lc3NhZ2VCb3hlcyA9IEBvYmplY3Quc2NlbmVEYXRhPy5tZXNzYWdlQm94ZXNcbiAgICAgICAgaWYgbWVzc2FnZUJveGVzXG4gICAgICAgICAgICBmb3IgbWVzc2FnZUJveCBpbiBtZXNzYWdlQm94ZXNcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQobWVzc2FnZUJveC5pZClcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0LnZpc2libGUgPSBtZXNzYWdlQm94LnZpc2libGVcbiAgICAgICAgICAgICAgICBpZiBtZXNzYWdlQm94Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKG1lc3NhZ2VCb3gubWVzc2FnZS5pZClcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0UmVuZGVyZXIuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5taXhpbihtZXNzYWdlLCBtZXNzYWdlQm94Lm1lc3NhZ2UsIHVpLk9iamVjdF9NZXNzYWdlLm9iamVjdENvZGVjQmxhY2tMaXN0LmNvbmNhdChbXCJvcmlnaW5cIl0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZvciBjIGluIG1lc3NhZ2UuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5vYmplY3QgPSBtZXNzYWdlXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyBtZXNzYWdlIGZyb20gbG9hZGVkIHNhdmUgZ2FtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVNZXNzYWdlc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgICAgICAgXG4gICAgcmVzdG9yZU1lc3NhZ2VzOiAtPlxuICAgICAgICBpZiBAb2JqZWN0Lm1lc3NhZ2VNb2RlID09IHZuLk1lc3NhZ2VNb2RlLk5WTFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcImdhbWVNZXNzYWdlTlZMX21lc3NhZ2VcIilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZV9tZXNzYWdlXCIpXG4gICAgICAgIFxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YT8ubWVzc2FnZVxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC5yZXN0b3JlKEBvYmplY3Quc2NlbmVEYXRhLm1lc3NhZ2UpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURhdGE/Lm1lc3NhZ2VzXG4gICAgICAgICAgICBtZXNzYWdlT2JqZWN0Lm1lc3NhZ2UucmVzdG9yZU1lc3NhZ2VzKEBvYmplY3Quc2NlbmVEYXRhLm1lc3NhZ2VzKVxuICAgICAgICAgICAgbWVzc2FnZU9iamVjdC50ZXh0UmVuZGVyZXIucmVzdG9yZShAb2JqZWN0LnNjZW5lRGF0YS5tZXNzYWdlVGV4dFJlbmRlcmVyKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhPy5tZXNzYWdlQXJlYXNcbiAgICAgICAgICAgIGZvciBkb21haW4gb2YgQG9iamVjdC5zY2VuZURhdGEubWVzc2FnZUFyZWFzXG4gICAgICAgICAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhcyA9IEBvYmplY3Quc2NlbmVEYXRhLm1lc3NhZ2VBcmVhc1xuICAgICAgICAgICAgICAgIGlmIG1lc3NhZ2VBcmVhc1tkb21haW5dIHRoZW4gZm9yIGFyZWEsIGkgaW4gbWVzc2FnZUFyZWFzW2RvbWFpbl1cbiAgICAgICAgICAgICAgICAgICAgaWYgYXJlYVxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUFyZWEgPSBuZXcgZ3MuT2JqZWN0X01lc3NhZ2VBcmVhKClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQgPSB1aS5VSU1hbmFnZXIuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKHR5cGU6IFwidWkuQ3VzdG9tR2FtZU1lc3NhZ2VcIiwgaWQ6IFwiY3VzdG9tR2FtZU1lc3NhZ2VfXCIraSwgcGFyYW1zOiB7IGlkOiBcImN1c3RvbUdhbWVNZXNzYWdlX1wiK2kgfSwgbWVzc2FnZUFyZWEpXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJjdXN0b21HYW1lTWVzc2FnZV9cIitpK1wiX21lc3NhZ2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5taXhpbihtZXNzYWdlLCBhcmVhLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYyBpbiBtZXNzYWdlLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm9iamVjdCA9IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLnJlc3RvcmUoZi5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0LmRzdFJlY3QueCA9IGFyZWEubGF5b3V0LmRzdFJlY3QueFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC5kc3RSZWN0LnkgPSBhcmVhLmxheW91dC5kc3RSZWN0LnlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC53aWR0aCA9IGFyZWEubGF5b3V0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC5oZWlnaHQgPSBhcmVhLmxheW91dC5kc3RSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC51cGRhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgI21lc3NhZ2UubWVzc2FnZS5yZXN0b3JlTWVzc2FnZXMoZi5tZXNzYWdlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLnRleHRSZW5kZXJlci5yZXN0b3JlKGYudGV4dFJlbmRlcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgI21lc3NhZ2UudmlzaWJsZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUFyZWEubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmxheW91dCA9IG1lc3NhZ2VMYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmFkZE9iamVjdChtZXNzYWdlTGF5b3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5zZXRPYmplY3QobWVzc2FnZUFyZWEsIGkpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICBcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyBhdWRpby1wbGF5YmFjayBmcm9tIGxvYWRlZCBzYXZlIGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlQXVkaW9QbGF5YmFja1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICAgIFxuICAgIHJlc3RvcmVBdWRpb1BsYXliYWNrOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpb1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmF1ZGlvQnVmZmVycy5wdXNoKGIpIGZvciBiIGluIEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLmF1ZGlvQnVmZmVyc1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmF1ZGlvQnVmZmVyc0J5TGF5ZXIgPSBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpby5hdWRpb0J1ZmZlcnNCeUxheWVyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuYXVkaW9MYXllcnMgPSBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpby5hdWRpb0xheWVyc1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnNvdW5kUmVmZXJlbmNlcyA9IEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLnNvdW5kUmVmZXJlbmNlc1xuICAgICAgICAgICAgXG4gICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIHRoZSBzY2VuZSBvYmplY3RzIGZyb20gdGhlIGN1cnJlbnQgbG9hZGVkIHNhdmUtZ2FtZS4gSWYgbm8gc2F2ZS1nYW1lIGlzXG4gICAgKiBwcmVzZW50IGluIEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lLCBub3RoaW5nIHdpbGwgaGFwcGVuLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZVNjZW5lXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZVNjZW5lOiAtPlxuICAgICAgICBzYXZlR2FtZSA9IEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lXG4gICAgICAgIGlmIHNhdmVHYW1lXG4gICAgICAgICAgICBjb250ZXh0ID0gbmV3IGdzLk9iamVjdENvZGVjQ29udGV4dChbR3JhcGhpY3Mudmlld3BvcnQsIEBvYmplY3QsIHRoaXNdLCBzYXZlR2FtZS5lbmNvZGVkT2JqZWN0U3RvcmUsIG51bGwpXG4gICAgICAgICAgICBzYXZlR2FtZS5kYXRhID0gZ3MuT2JqZWN0Q29kZWMuZGVjb2RlKHNhdmVHYW1lLmRhdGEsIGNvbnRleHQpXG4gICAgICAgICAgICBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbYy5pbmRleF0/Lm5hbWUgPSBjLm5hbWUgaWYgYyBmb3IgYyBpbiBzYXZlR2FtZS5kYXRhLmNoYXJhY3Rlck5hbWVzXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5yZXN0b3JlKHNhdmVHYW1lKVxuICAgICAgICAgICAgZ3MuT2JqZWN0Q29kZWMub25SZXN0b3JlKHNhdmVHYW1lLmRhdGEsIGNvbnRleHQpXG4gICAgICAgICAgICBAcmVzb3VyY2VDb250ZXh0LmZyb21EYXRhQnVuZGxlKHNhdmVHYW1lLmRhdGEucmVzb3VyY2VDb250ZXh0LCBSZXNvdXJjZU1hbmFnZXIucmVzb3VyY2VzQnlQYXRoKVxuXG4gICAgICAgICAgICBAb2JqZWN0LnNjZW5lRGF0YSA9IHNhdmVHYW1lLmRhdGFcbiAgICAgICAgICAgIEdyYXBoaWNzLmZyYW1lQ291bnQgPSBzYXZlR2FtZS5kYXRhLmZyYW1lQ291bnRcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMgYWxsIGRhdGEgZm9yIHRoZSBzY2VuZSBhbmQgbG9hZHMgdGhlIG5lY2Vzc2FyeSBncmFwaGljIGFuZCBhdWRpbyByZXNvdXJjZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlRGF0YVxuICAgICogQGFic3RyYWN0XG4gICAgIyMjXG4gICAgcHJlcGFyZURhdGE6IC0+XG4gICAgICAgICNSZWNvcmRNYW5hZ2VyLnRyYW5zbGF0ZSgpXG4gICAgICAgIFxuICAgICAgICBHYW1lTWFuYWdlci5zY2VuZSA9IEBvYmplY3RcblxuICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQgPSBAb2JqZWN0TWFuYWdlclxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5zY2VuZURhdGEudWlkID0gQG9iamVjdC5zY2VuZURvY3VtZW50LnVpZFxuICAgICAgICBcbiAgICAgICAgaWYgIVJlc291cmNlTG9hZGVyLmxvYWRFdmVudENvbW1hbmRzRGF0YShAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMuY29tbWFuZHMpXG4gICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkRXZlbnRDb21tYW5kc0dyYXBoaWNzKEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kcylcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLmJhY2tsb2cgPSBAb2JqZWN0LnNjZW5lRGF0YS5iYWNrbG9nIHx8IEdhbWVNYW5hZ2VyLnNjZW5lRGF0YS5iYWNrbG9nIHx8IFtdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRTeXN0ZW1Tb3VuZHMoKVxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFN5c3RlbUdyYXBoaWNzKClcbiAgICAgICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRVaVR5cGVzR3JhcGhpY3ModWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzKVxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpTGF5b3V0R3JhcGhpY3ModWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGRhdGFGaWVsZHM/XG4gICAgICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpRGF0YUZpZWxkc0dyYXBoaWNzKEBkYXRhRmllbGRzKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgJHRlbXBGaWVsZHMuY2hvaWNlVGltZXIgPSBAb2JqZWN0LmNob2ljZVRpbWVyXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc2V0dXAoeyBpZDogQG9iamVjdC5zY2VuZURvY3VtZW50LnVpZH0pXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBQcmVwYXJlcyBhbGwgdmlzdWFsIGdhbWUgb2JqZWN0IGZvciB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlVmlzdWFsXG4gICAgIyMjIFxuICAgIHByZXBhcmVWaXN1YWw6IC0+XG4gICAgICAgIGlmIEBvYmplY3QubGF5b3V0IHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmlzRXhpdGluZ0dhbWVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuaXNFeGl0aW5nR2FtZSA9IG5vXG4gICAgICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdFJlc2V0U2NlbmVDaGFuZ2UoQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLm5hbWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0U2NlbmVDaGFuZ2UoQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLm5hbWUpXG4gICAgICAgIFxuICAgICAgICBAcmVzdG9yZVNjZW5lKClcbiAgICAgICAgQG9iamVjdC5tZXNzYWdlTW9kZSA9IEBvYmplY3Quc2NlbmVEYXRhLm1lc3NhZ2VNb2RlID8gdm4uTWVzc2FnZU1vZGUuQURWXG4gICAgICAgIEBzZXR1cE1haW5WaWV3cG9ydCgpXG4gICAgICAgIEBzZXR1cFZpZXdwb3J0cygpXG4gICAgICAgIEBzZXR1cENoYXJhY3RlcnMoKVxuICAgICAgICBAc2V0dXBCYWNrZ3JvdW5kcygpXG4gICAgICAgIEBzZXR1cFBpY3R1cmVzKClcbiAgICAgICAgQHNldHVwVGV4dHMoKVxuICAgICAgICBAc2V0dXBWaWRlb3MoKVxuICAgICAgICBAc2V0dXBIb3RzcG90cygpXG4gICAgICAgIEBzZXR1cEludGVycHJldGVyKClcbiAgICAgICAgQHNldHVwTGF5b3V0KClcbiAgICAgICAgQHNldHVwQ29tbW9uRXZlbnRzKClcbiAgICAgICAgXG4gICAgICAgIEByZXN0b3JlTWVzc2FnZUJveCgpXG4gICAgICAgIEByZXN0b3JlSW50ZXJwcmV0ZXIoKVxuICAgICAgICBAcmVzdG9yZU1lc3NhZ2VzKClcbiAgICAgICAgQHJlc3RvcmVBdWRpb1BsYXliYWNrKClcbiAgICAgICAgXG4gICAgICAgIEBzaG93KHRydWUpXG4gICAgICAgIFxuICAgICAgICBAb2JqZWN0LnNjZW5lRGF0YSA9IHt9XG4gICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lRGF0YSA9IHt9XG4gICAgICAgIFxuICAgICAgICBHcmFwaGljcy51cGRhdGUoKVxuICAgICAgICBAdHJhbnNpdGlvbih7IGR1cmF0aW9uOiAwIH0pXG4gICAgICAgIFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGEgbmV3IGNoYXJhY3RlciB0byB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBhZGRDaGFyYWN0ZXJcbiAgICAqIEBwYXJhbSB7dm4uT2JqZWN0X0NoYXJhY3Rlcn0gY2hhcmFjdGVyIC0gVGhlIGNoYXJhY3RlciB0byBhZGQuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vQW5pbWF0aW9uIC0gSW5kaWNhdGVzIGlmIHRoZSBjaGFyYWN0ZXIgc2hvdWxkIGJlIGFkZGVkIGltbWVkaWF0ZWx5IHdpdG91dCBhbnkgYXBwZWFyLWFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmltYXRpb25EYXRhIC0gQ29udGFpbnMgdGhlIGFwcGVhci1hbmltYXRpb24gZGF0YSAtPiB7IGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiB9LlxuICAgICMjIyBcbiAgICBhZGRDaGFyYWN0ZXI6IChjaGFyYWN0ZXIsIG5vQW5pbWF0aW9uLCBhbmltYXRpb25EYXRhKSAtPlxuICAgICAgICB1bmxlc3Mgbm9BbmltYXRpb25cbiAgICAgICAgICAgIGNoYXJhY3Rlci5tb3Rpb25CbHVyLnNldChhbmltYXRpb25EYXRhLm1vdGlvbkJsdXIpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIGFuaW1hdGlvbkRhdGEuZHVyYXRpb24gPiAwXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyLmFuaW1hdG9yLmFwcGVhcihjaGFyYWN0ZXIuZHN0UmVjdC54LCBjaGFyYWN0ZXIuZHN0UmVjdC55LCBhbmltYXRpb25EYXRhLmFuaW1hdGlvbiwgYW5pbWF0aW9uRGF0YS5lYXNpbmcsIGFuaW1hdGlvbkRhdGEuZHVyYXRpb24pIHVubGVzcyBub0FuaW1hdGlvblxuICAgICAgICBcbiAgICAgICAgY2hhcmFjdGVyLnZpZXdwb3J0ID0gQHZpZXdwb3J0XG4gICAgICAgIGNoYXJhY3Rlci52aXNpYmxlID0geWVzIFxuICAgIFxuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5hZGRPYmplY3QoY2hhcmFjdGVyKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIGEgY2hhcmFjdGVyIGZyb20gdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVtb3ZlQ2hhcmFjdGVyXG4gICAgKiBAcGFyYW0ge3ZuLk9iamVjdF9DaGFyYWN0ZXJ9IGNoYXJhY3RlciAtIFRoZSBjaGFyYWN0ZXIgdG8gcmVtb3ZlLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGFuaW1hdGlvbkRhdGEgLSBDb250YWlucyB0aGUgZGlzYXBwZWFyLWFuaW1hdGlvbiBkYXRhIC0+IHsgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uIH0uXG4gICAgIyMjXG4gICAgcmVtb3ZlQ2hhcmFjdGVyOiAoY2hhcmFjdGVyLCBhbmltYXRpb25EYXRhKSAtPlxuICAgICAgICBjaGFyYWN0ZXI/LmFuaW1hdG9yLmRpc2FwcGVhcihhbmltYXRpb25EYXRhLmFuaW1hdGlvbiwgYW5pbWF0aW9uRGF0YS5lYXNpbmcsIGFuaW1hdGlvbkRhdGEuZHVyYXRpb24sIChzZW5kZXIpIC0+IHNlbmRlci5kaXNwb3NlKCkpXG4gICAgXG4gICAgIyMjKlxuICAgICogUmVzdW1lcyB0aGUgY3VycmVudCBzY2VuZSBpZiBpdCBoYXMgYmVlbiBwYXVzZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN1bWVTY2VuZVxuICAgICMjI1xuICAgIHJlc3VtZVNjZW5lOiAtPlxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYWN0aXZlID0geWVzXG4gICAgICAgIEBvYmplY3QuY2hhcmFjdGVyQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuYWN0aXZlID0geWVzXG4gICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5hY3RpdmUgPSB5ZXNcbiAgICAgICAgQG9iamVjdC5ob3RzcG90Q29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBcbiAgICAgICAgbWVzc2FnZSA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VfbWVzc2FnZVwiKVxuICAgICAgICBtZXNzYWdlLmFjdGl2ZSA9IHllc1xuIFxuICAgICMjIypcbiAgICAqIFBhdXNlcyB0aGUgY3VycmVudCBzY2VuZS4gQSBwYXVzZWQgc2NlbmUgd2lsbCBub3QgY29udGludWUsIG1lc3NhZ2VzLCBwaWN0dXJlcywgZXRjLiB3aWxsXG4gICAgKiBzdG9wIHVudGlsIHRoZSBzY2VuZSByZXN1bWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgcGF1c2VTY2VuZVxuICAgICMjI1xuICAgIHBhdXNlU2NlbmU6IC0+XG4gICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuYWN0aXZlID0gbm9cbiAgICAgICAgQG9iamVjdC50ZXh0Q29udGFpbmVyLmFjdGl2ZSA9IG5vXG4gICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmFjdGl2ZSA9IG5vXG4gICAgICAgIFxuICAgICAgICBtZXNzYWdlID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZV9tZXNzYWdlXCIpXG4gICAgICAgIG1lc3NhZ2UuYWN0aXZlID0gbm9cbiAgICAgICAgXG4gIFxuICAgICMjIypcbiAgICAqIFNob3dzIGlucHV0LXRleHQgYm94IHRvIGxldCB0aGUgdXNlciBlbnRlciBhIHRleHQuXG4gICAgKlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGxldHRlcnMgLSBUaGUgbWF4LiBudW1iZXIgb2YgbGV0dGVycyB0aGUgdXNlciBjYW4gZW50ZXIuXG4gICAgKiBAcGFyYW0ge2dzLkNhbGxiYWNrfSBjYWxsYmFjayAtIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIGlmIHRoZSBpbnB1dC10ZXh0IGJveCBoYXMgYmVlbiBhY2NlcHRlZCBieSB0aGUgdXNlci5cbiAgICAqIEBtZXRob2Qgc2hvd0lucHV0VGV4dFxuICAgICMjI1xuICAgIHNob3dJbnB1dFRleHQ6IChsZXR0ZXJzLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3g/LmRpc3Bvc2UoKVxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveCA9IHVpLlVpRmFjdG9yeS5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW1widWkuSW5wdXRUZXh0Qm94XCJdLCBAb2JqZWN0KVxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveC51aS5wcmVwYXJlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3guZXZlbnRzLm9uKFwiYWNjZXB0XCIsIGNhbGxiYWNrKVxuICAgICAgIFxuICAgICMjIypcbiAgICAqIFNob3dzIGlucHV0LW51bWJlciBib3ggdG8gbGV0IHRoZSB1c2VyIGVudGVyIGEgbnVtYmVyLlxuICAgICpcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgLSBUaGUgbWF4LiBudW1iZXIgb2YgZGlnaXRzIHRoZSB1c2VyIGNhbiBlbnRlci5cbiAgICAqIEBwYXJhbSB7Z3MuQ2FsbGJhY2t9IGNhbGxiYWNrIC0gQSBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgaWYgdGhlIGlucHV0LW51bWJlciBib3ggaGFzIGJlZW4gYWNjZXB0ZWQgYnkgdGhlIHVzZXIuXG4gICAgKiBAbWV0aG9kIHNob3dJbnB1dE51bWJlclxuICAgICMjIyBcbiAgICBzaG93SW5wdXROdW1iZXI6IChkaWdpdHMsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94Py5kaXNwb3NlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveCA9IHVpLlVpRmFjdG9yeS5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW1widWkuSW5wdXROdW1iZXJCb3hcIl0sIEBvYmplY3QpXG4gICAgICAgIEBvYmplY3QuaW5wdXROdW1iZXJCb3gudWkucHJlcGFyZSgpXG4gICAgICAgIEBvYmplY3QuaW5wdXROdW1iZXJCb3guZXZlbnRzLm9uKFwiYWNjZXB0XCIsIGNhbGxiYWNrKSAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTaG93cyBjaG9pY2VzIHRvIGxldCB0aGUgdXNlciBwaWNrIGEgY2hvaWNlLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IGNob2ljZXMgLSBBbiBhcnJheSBvZiBjaG9pY2VzXG4gICAgKiBAcGFyYW0ge2dzLkNhbGxiYWNrfSBjYWxsYmFjayAtIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIGlmIGEgY2hvaWNlIGhhcyBiZWVuIHBpY2tlZCBieSB0aGUgdXNlci5cbiAgICAqIEBtZXRob2Qgc2hvd0Nob2ljZXNcbiAgICAjIyMgICAgIFxuICAgIHNob3dDaG9pY2VzOiAoY2hvaWNlcywgY2FsbGJhY2spIC0+XG4gICAgICAgIHVzZUZyZWVMYXlvdXQgPSBjaG9pY2VzLndoZXJlKCh4KSAtPiB4LmRzdFJlY3Q/KS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuY2hvaWNlcyA9IGNob2ljZXMgXG4gICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93Py5kaXNwb3NlKClcbiAgICAgICAgXG4gICAgICAgIGlmIHVzZUZyZWVMYXlvdXRcbiAgICAgICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93ID0gdWkuVWlGYWN0b3J5LmNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcih1aS5VaUZhY3RvcnkuY3VzdG9tVHlwZXNbXCJ1aS5GcmVlQ2hvaWNlQm94XCJdLCBAb2JqZWN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdyA9IHVpLlVpRmFjdG9yeS5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW1widWkuQ2hvaWNlQm94XCJdLCBAb2JqZWN0KVxuICAgICAgICBcbiAgICAgICAgQG9iamVjdC5jaG9pY2VXaW5kb3cuZXZlbnRzLm9uKFwic2VsZWN0aW9uQWNjZXB0XCIsIGNhbGxiYWNrKVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdy51aS5wcmVwYXJlKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2hhbmdlcyB0aGUgYmFja2dyb3VuZCBvZiB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGFuZ2VCYWNrZ3JvdW5kXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYmFja2dyb3VuZCAtIFRoZSBiYWNrZ3JvdW5kIGdyYXBoaWMgb2JqZWN0IC0+IHsgbmFtZSB9XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vQW5pbWF0aW9uIC0gSW5kaWNhdGVzIGlmIHRoZSBiYWNrZ3JvdW5kIHNob3VsZCBiZSBjaGFuZ2VkIGltbWVkaWF0ZWx5IHdpdG91dCBhbnkgY2hhbmdlLWFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmltYXRpb24gLSBUaGUgYXBwZWFyL2Rpc2FwcGVhciBhbmltYXRpb24gdG8gdXNlLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZyAtIFRoZSBlYXNpbmcgb2YgdGhlIGNoYW5nZSBhbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhlIGNoYW5nZSBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gb3ggLSBUaGUgeC1vcmlnaW4gb2YgdGhlIGJhY2tncm91bmQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gb3kgLSBUaGUgeS1vcmlnaW4gb2YgdGhlIGJhY2tncm91bmQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGF5ZXIgLSBUaGUgYmFja2dyb3VuZC1sYXllciB0byBjaGFuZ2UuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvb3BIb3Jpem9udGFsIC0gSW5kaWNhdGVzIGlmIHRoZSBiYWNrZ3JvdW5kIHNob3VsZCBiZSBsb29wZWQgaG9yaXpvbnRhbGx5LlxuICAgICogQHBhcmFtIHtib29sZWFufSBsb29wVmVydGljYWwgLSBJbmRpY2F0ZXMgaWYgdGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGxvb3BlZCB2ZXJ0aWNhbGx5LlxuICAgICMjIyAgIFxuICAgIGNoYW5nZUJhY2tncm91bmQ6IChiYWNrZ3JvdW5kLCBub0FuaW1hdGlvbiwgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCBveCwgb3ksIGxheWVyLCBsb29wSG9yaXpvbnRhbCwgbG9vcFZlcnRpY2FsKSAtPlxuICAgICAgICBpZiBiYWNrZ3JvdW5kP1xuICAgICAgICAgICAgb3RoZXJPYmplY3QgPSBAb2JqZWN0LmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICAgICAgb2JqZWN0ID0gbmV3IHZuLk9iamVjdF9CYWNrZ3JvdW5kKClcbiAgICAgICAgICAgIG9iamVjdC5pbWFnZSA9IGJhY2tncm91bmQubmFtZVxuICAgICAgICAgICAgb2JqZWN0Lm9yaWdpbi54ID0gb3hcbiAgICAgICAgICAgIG9iamVjdC5vcmlnaW4ueSA9IG95XG4gICAgICAgICAgICBvYmplY3Qudmlld3BvcnQgPSBAdmlld3BvcnRcbiAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IG5vXG4gICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IG5vXG4gICAgICAgICAgICBvYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kQ29udGFpbmVyLnNldE9iamVjdChvYmplY3QsIGxheWVyKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiA/IDMwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG90aGVyT2JqZWN0Py56SW5kZXggPSBsYXllclxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBkdXJhdGlvbiA9PSAwXG4gICAgICAgICAgICAgICAgb3RoZXJPYmplY3Q/LmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IGxvb3BWZXJ0aWNhbFxuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy5ob3Jpem9udGFsID0gbG9vcEhvcml6b250YWxcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBub0FuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBsb29wVmVydGljYWxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBsb29wSG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLm90aGVyT2JqZWN0ID0gb3RoZXJPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLmFwcGVhcigwLCAwLCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIChzZW5kZXIpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyLnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXIuYW5pbWF0b3Iub3RoZXJPYmplY3Q/LmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyLmFuaW1hdG9yLm90aGVyT2JqZWN0ID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyLnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0gbG9vcFZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXIudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IGxvb3BIb3Jpem9udGFsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kc1tsYXllcl0/LmFuaW1hdG9yLmhpZGUgZHVyYXRpb24sIGVhc2luZywgID0+XG4gICAgICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRzW2xheWVyXS5kaXNwb3NlKClcbiAgICAgICAgICAgICAgIEBvYmplY3QuYmFja2dyb3VuZHNbbGF5ZXJdID0gbnVsbFxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCB2aWV3cG9ydCBhbmltYXRpb25zIGV4Y2VwdCB0aGUgbWFpbiB2aWV3cG9ydCBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVmlld3BvcnRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIHNraXBWaWV3cG9ydHM6IC0+XG4gICAgICAgIHZpZXdwb3J0cyA9IEBvYmplY3Qudmlld3BvcnRDb250YWluZXIuc3ViT2JqZWN0c1xuICAgICAgICBmb3Igdmlld3BvcnQgaW4gdmlld3BvcnRzXG4gICAgICAgICAgICBpZiB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gdmlld3BvcnQuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgIFxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCBwaWN0dXJlIGFuaW1hdGlvbnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwUGljdHVyZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgIFxuICAgIHNraXBQaWN0dXJlczogLT5cbiAgICAgICAgZm9yIHBpY3R1cmUgaW4gQG9iamVjdC5waWN0dXJlc1xuICAgICAgICAgICAgaWYgcGljdHVyZVxuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gcGljdHVyZS5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCB0ZXh0IGFuaW1hdGlvbnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVGV4dHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgc2tpcFRleHRzOiAtPlxuICAgICAgIGZvciB0ZXh0IGluIEBvYmplY3QudGV4dHNcbiAgICAgICAgICAgIGlmIHRleHRcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIHRleHQuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgdmlkZW8gYW5pbWF0aW9ucyBidXQgbm90IHRoZSB2aWRlby1wbGF5YmFjayBpdHNlbGYuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVmlkZW9zXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIHNraXBWaWRlb3M6IC0+XG4gICAgICAgIGZvciB2aWRlbyBpbiBAb2JqZWN0LnZpZGVvc1xuICAgICAgICAgICAgaWYgdmlkZW9cbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIHZpZGVvLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIGJhY2tncm91bmQgYW5pbWF0aW9ucy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBCYWNrZ3JvdW5kc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyBcbiAgICBza2lwQmFja2dyb3VuZHM6IC0+XG4gICAgICAgIGZvciBiYWNrZ3JvdW5kIGluIEBvYmplY3QuYmFja2dyb3VuZHNcbiAgICAgICAgICAgIGlmIGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIGJhY2tncm91bmQuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgY2hhcmFjdGVyIGFuaW1hdGlvbnNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBDaGFyYWN0ZXJzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjIFxuICAgIHNraXBDaGFyYWN0ZXJzOiAtPlxuICAgICAgICBmb3IgY2hhcmFjdGVyIGluIEBvYmplY3QuY2hhcmFjdGVyc1xuICAgICAgICAgICAgaWYgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBjaGFyYWN0ZXIuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgbWFpbiB2aWV3cG9ydCBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwTWFpblZpZXdwb3J0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIHNraXBNYWluVmlld3BvcnQ6IC0+XG4gICAgICAgIGZvciBjb21wb25lbnQgaW4gQG9iamVjdC52aWV3cG9ydC5jb21wb25lbnRzXG4gICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgYW5pbWF0aW9ucyBvZiBhbGwgbWVzc2FnZSBib3hlcyBkZWZpbmVkIGluIE1FU1NBR0VfQk9YX0lEUyB1aSBjb25zdGFudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBNZXNzYWdlQm94ZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgc2tpcE1lc3NhZ2VCb3hlczogLT5cbiAgICAgICAgZm9yIG1lc3NhZ2VCb3hJZCBpbiBncy5VSUNvbnN0YW50cy5NRVNTQUdFX0JPWF9JRFMgfHwgW1wibWVzc2FnZUJveFwiLCBcIm1lc3NhZ2VCb3hOVkxcIl1cbiAgICAgICAgICAgIG1lc3NhZ2VCb3ggPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChtZXNzYWdlQm94SWQpXG4gICAgICAgICAgICBpZiBtZXNzYWdlQm94LmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIG1lc3NhZ2VCb3guY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKSBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIGFuaW1hdGlvbnMgb2YgYWxsIG1lc3NhZ2UgYXJlYXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwTWVzc2FnZUFyZWFzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIHNraXBNZXNzYWdlQXJlYXM6IC0+XG4gICAgICAgIGZvciBtZXNzYWdlQXJlYSBpbiBAb2JqZWN0Lm1lc3NhZ2VBcmVhc1xuICAgICAgICAgICAgaWYgbWVzc2FnZUFyZWE/Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIG1lc3NhZ2VBcmVhLm1lc3NhZ2UuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICAgICAgICAgXG4gICAgICAgIG1zZyA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VfbWVzc2FnZVwiKSAgICAgXG4gICAgICAgIGlmIG1zZ1xuICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBtc2cuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIG1zZyA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VOVkxfbWVzc2FnZVwiKSAgICAgXG4gICAgICAgIGlmIG1zZ1xuICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBtc2cuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgc2NlbmUgaW50ZXJwcmV0ZXIgdGltZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwSW50ZXJwcmV0ZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgc2tpcEludGVycHJldGVyOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID4gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG4gICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIGludGVycHJldGVyIHRpbWVyIG9mIGFsbCBjb21tb24gZXZlbnRzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcENvbW1vbkV2ZW50c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgXG4gICAgc2tpcENvbW1vbkV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0gQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgICAgIGZvciBldmVudCBpbiBldmVudHNcbiAgICAgICAgICAgIGlmIGV2ZW50Py5pbnRlcnByZXRlciBhbmQgZXZlbnQuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWVcbiAgICAgICAgICAgICAgICBldmVudC5pbnRlcnByZXRlci53YWl0Q291bnRlciA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwVGltZVxuICAgICAgICAgICAgICAgIGlmIGV2ZW50LmludGVycHJldGVyLndhaXRDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0gbm9cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIHNjZW5lJ3MgY29udGVudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBDb250ZW50XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjICAgIFxuICAgIHNraXBDb250ZW50OiAtPlxuICAgICAgICBAc2tpcFBpY3R1cmVzKClcbiAgICAgICAgQHNraXBUZXh0cygpXG4gICAgICAgIEBza2lwVmlkZW9zKClcbiAgICAgICAgQHNraXBCYWNrZ3JvdW5kcygpXG4gICAgICAgIEBza2lwQ2hhcmFjdGVycygpXG4gICAgICAgIEBza2lwTWFpblZpZXdwb3J0KClcbiAgICAgICAgQHNraXBWaWV3cG9ydHMoKVxuICAgICAgICBAc2tpcE1lc3NhZ2VCb3hlcygpXG4gICAgICAgIEBza2lwTWVzc2FnZUFyZWFzKClcbiAgICAgICAgQHNraXBJbnRlcnByZXRlcigpXG4gICAgICAgIEBza2lwQ29tbW9uRXZlbnRzKClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc2NlbmUncyBjb250ZW50LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlQ29udGVudFxuICAgICMjIyAgICAgIFxuICAgIHVwZGF0ZUNvbnRlbnQ6IC0+XG4gICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lID0gQG9iamVjdFxuICAgICAgICBcbiAgICAgICAgaWYgIUBvYmplY3Quc2V0dGluZ3MuYWxsb3dTa2lwXG4gICAgICAgICAgICBAb2JqZWN0LnRlbXBTZXR0aW5ncy5za2lwID0gbm9cbiAgICAgICAgICAgIFxuICAgICAgICBHcmFwaGljcy52aWV3cG9ydC51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LnZpZXdwb3J0LnVwZGF0ZSgpXG4gICAgICAgICNAb2JqZWN0LnZpZXdwb3J0LnpJbmRleCA9IDEwMDAwMFxuXG4gICAgICAgIFxuICAgICAgICBpZiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFxuICAgICAgICAgICAgQHNraXBDb250ZW50KClcbiBcbiAgICAgICAgaWYgQG9iamVjdC52aWRlbz9cbiAgICAgICAgICAgIEBvYmplY3QudmlkZW8udXBkYXRlKClcbiAgICAgICAgICAgIGlmIEBvYmplY3Quc2V0dGluZ3MuYWxsb3dWaWRlb1NraXAgYW5kIChJbnB1dC50cmlnZ2VyKElucHV0LkMpIG9yIElucHV0Lk1vdXNlLmJ1dHRvbnNbSW5wdXQuTW91c2UuTEVGVF0gPT0gMilcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnZpZGVvLnN0b3AoKVxuICAgICAgICAgICAgSW5wdXQuY2xlYXIoKVxuICAgICAgICBcbiAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLm1lbnVBY2Nlc3MgYW5kIElucHV0LnRyaWdnZXIoSW5wdXQuWClcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhuZXcgZ3MuT2JqZWN0X0xheW91dChcInNldHRpbmdzTWVudUxheW91dFwiKSwgdHJ1ZSlcbiAgICAgICAgaWYgSW5wdXQudHJpZ2dlcihJbnB1dC5LRVlfRVNDQVBFKVxuICAgICAgICAgICAgZ3MuQXBwbGljYXRpb24uZXhpdCgpXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC5zZXR0aW5ncy5hbGxvd1NraXBcbiAgICAgICAgICAgIGlmIElucHV0LmtleXNbSW5wdXQuS0VZX0NPTlRST0xdID09IDFcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCA9IHllc1xuICAgICAgICAgICAgZWxzZSBpZiBJbnB1dC5rZXlzW0lucHV0LktFWV9DT05UUk9MXSA9PSAyXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXAgPSBub1xuXG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG52bi5Db21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3IgPSBDb21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3IiXX0=
//# sourceURL=Component_GameSceneBehavior_42.js