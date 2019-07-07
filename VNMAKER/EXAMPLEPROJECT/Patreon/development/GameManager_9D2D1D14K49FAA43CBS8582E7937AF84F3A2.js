var GameManager;

GameManager = (function() {

  /**
  * Manages all general things around the game like holding the game settings,
  * manages the save/load of a game, etc.
  *
  * @module gs
  * @class GameManager
  * @memberof gs
  * @constructor
   */
  function GameManager() {

    /**
    * The current scene data.
    * @property sceneData
    * @type Object
     */
    this.sceneData = {};

    /**
    * The scene viewport containing all visual objects which are part of the scene and influenced
    * by the in-game camera.
    * @property sceneViewport
    * @type gs.Object_Viewport
     */
    this.sceneViewport = null;

    /**
    * The list of common events.
    * @property commonEvents
    * @type gs.Object_CommonEvent[]
     */
    this.commonEvents = [];

    /**
    * Indicates if the GameManager is initialized.
    * @property commonEvents
    * @type gs.Object_CommonEvent[]
     */
    this.initialized = false;

    /**
    * Temporary game settings.
    * @property tempSettings
    * @type Object
     */
    this.tempSettings = {
      skip: false,
      skipTime: 5,
      loadMenuAccess: true,
      menuAccess: true,
      backlogAccess: true,
      saveMenuAccess: true,
      messageFading: {
        animation: {
          type: 1
        },
        duration: 15,
        easing: null
      }

      /**
      * Temporary game fields.
      * @property tempFields
      * @type Object
       */
    };
    this.tempFields = null;

    /**
    * Stores default values for backgrounds, pictures, etc.
    * @property defaults
    * @type Object
     */
    this.defaults = {
      background: {
        "duration": 30,
        "origin": 0,
        "zOrder": 0,
        "loopVertical": 0,
        "loopHorizontal": 0,
        "easing": {
          "type": 0,
          "inOut": 1
        },
        "animation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "motionBlur": {
          "enabled": 0,
          "delay": 2,
          "opacity": 100,
          "dissolveSpeed": 3
        }
      },
      picture: {
        "appearDuration": 30,
        "disappearDuration": 30,
        "origin": 0,
        "zOrder": 0,
        "appearEasing": {
          "type": 0,
          "inOut": 1
        },
        "disappearEasing": {
          "type": 0,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "motionBlur": {
          "enabled": 0,
          "delay": 2,
          "opacity": 100,
          "dissolveSpeed": 3
        }
      },
      character: {
        "expressionDuration": 0,
        "appearDuration": 40,
        "disappearDuration": 40,
        "origin": 0,
        "zOrder": 0,
        "appearEasing": {
          "type": 2,
          "inOut": 2
        },
        "disappearEasing": {
          "type": 1,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "motionBlur": {
          "enabled": 0,
          "delay": 2,
          "opacity": 100,
          "dissolveSpeed": 3
        },
        "changeAnimation": {
          "type": 1,
          "movement": 0,
          "fading": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "changeEasing": {
          "type": 2,
          "inOut": 2
        }
      },
      text: {
        "appearDuration": 30,
        "disappearDuration": 30,
        "positionOrigin": 0,
        "origin": 0,
        "zOrder": 0,
        "appearEasing": {
          "type": 0,
          "inOut": 1
        },
        "disappearEasing": {
          "type": 0,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "motionBlur": {
          "enabled": 0,
          "delay": 2,
          "opacity": 100,
          "dissolveSpeed": 3
        }
      },
      video: {
        "appearDuration": 30,
        "disappearDuration": 30,
        "origin": 0,
        "zOrder": 0,
        "appearEasing": {
          "type": 0,
          "inOut": 1
        },
        "disappearEasing": {
          "type": 0,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "motionBlur": {
          "enabled": 0,
          "delay": 2,
          "opacity": 100,
          "dissolveSpeed": 3
        }
      },
      live2d: {
        "motionFadeInTime": 1000,
        "appearDuration": 30,
        "disappearDuration": 30,
        "zOrder": 0,
        "appearEasing": {
          "type": 0,
          "inOut": 1
        },
        "disappearEasing": {
          "type": 0,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 1,
          "movement": 0,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        }
      },
      messageBox: {
        "appearDuration": 30,
        "disappearDuration": 30,
        "zOrder": 0,
        "appearEasing": {
          "type": 0,
          "inOut": 1
        },
        "disappearEasing": {
          "type": 0,
          "inOut": 1
        },
        "appearAnimation": {
          "type": 0,
          "movement": 3,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        },
        "disappearAnimation": {
          "type": 0,
          "movement": 3,
          "mask": {
            "graphic": null,
            "vague": 30
          }
        }
      },
      audio: {
        "musicFadeInDuration": 0,
        "musicFadeOutDuration": 0,
        "musicVolume": 100,
        "musicPlaybackRate": 100,
        "soundVolume": 100,
        "soundPlaybackRate": 100,
        "voiceVolume": 100,
        "voicePlaybackRate": 100
      }
    };

    /**
    * The game's backlog.
    * @property backlog
    * @type Object[]
     */
    this.backlog = [];

    /**
    * Character parameters by character ID.
    * @property characterParams
    * @type Object[]
     */
    this.characterParams = [];

    /**
    * The game's chapter
    * @property chapters
    * @type gs.Document[]
     */
    this.chapters = [];

    /**
    * The game's current displayed messages. Especially in NVL mode the messages 
    * of the current page are stored here.
    * @property messages
    * @type Object[]
     */
    this.messages = [];

    /**
    * Count of save slots. Default is 100.
    * @property saveSlotCount
    * @type number
     */
    this.saveSlotCount = 100;

    /**
    * The index of save games. Contains the header-info for each save game slot.
    * @property saveGameSlots
    * @type Object[]
     */
    this.saveGameSlots = [];

    /**
    * Stores global data like the state of persistent game variables.
    * @property globalData
    * @type Object
     */
    this.globalData = null;

    /**
    * Indicates if the game runs in editor's live-preview.
    * @property inLivePreview
    * @type Object
     */
    this.inLivePreview = false;
  }


  /**
  * Initializes the GameManager, should be called before the actual game starts.
  *
  * @method initialize
   */

  GameManager.prototype.initialize = function() {
    var character, i, j, k, l, len, len1, param, ref, ref1, ref2;
    this.initialized = true;
    this.inLivePreview = $PARAMS.preview != null;
    this.saveSlotCount = RecordManager.system.saveSlotCount || 100;
    this.tempFields = new gs.GameTemp();
    window.$tempFields = this.tempFields;
    this.createSaveGameIndex();
    this.variableStore = new gs.VariableStore();
    this.variableStore.setupDomains(DataManager.getDocumentsByType("global_variables").select(function(v) {
      return v.items.domain || "";
    }));
    this.sceneViewport = new gs.Object_Viewport(new Viewport(0, 0, Graphics.width, Graphics.height, Graphics.viewport));
    ref = RecordManager.charactersArray;
    for (j = 0, len = ref.length; j < len; j++) {
      character = ref[j];
      if (character != null) {
        this.characterParams[character.index] = {};
        if (character.params != null) {
          ref1 = character.params;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            param = ref1[k];
            this.characterParams[character.index][param.name] = param.value;
          }
        }
      }
    }
    this.setupCommonEvents();
    for (i = l = 0, ref2 = RecordManager.characters; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
      this.settings.voicesPerCharacter[i] = 100;
    }
    this.chapters = DataManager.getDocumentsByType("vn.chapter");
    return this.chapters.sort(function(a, b) {
      if (a.items.order > b.items.order) {
        return 1;
      } else if (a.items.order < b.items.order) {
        return -1;
      } else {
        return 0;
      }
    });
  };


  /**
  * Sets up common events.
  *
  * @method setupCommonEvents
   */

  GameManager.prototype.setupCommonEvents = function() {
    var event, j, k, len, len1, object, ref, ref1, results;
    ref = this.commonEvents;
    for (j = 0, len = ref.length; j < len; j++) {
      event = ref[j];
      if (event != null) {
        event.dispose();
      }
    }
    this.commonEvents = [];
    ref1 = RecordManager.commonEvents;
    results = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      event = ref1[k];
      if (!event) {
        continue;
      }
      if (event.startCondition === 1 && event.autoPreload) {
        gs.ResourceLoader.loadEventCommandsGraphics(event.commands);
      }
      object = new gs.Object_CommonEvent();
      object.record = event;
      object.rid = event.index;
      this.commonEvents[event.index] = object;
      results.push(this.commonEvents.push(object));
    }
    return results;
  };


  /**
  * Sets up cursor depending on system settings.
  *
  * @method setupCursor
   */

  GameManager.prototype.setupCursor = function() {
    var bitmap, ref;
    if ((ref = RecordManager.system.cursor) != null ? ref.name : void 0) {
      bitmap = ResourceManager.getBitmap("Graphics/Pictures/" + RecordManager.system.cursor.name);
      return Graphics.setCursorBitmap(bitmap, RecordManager.system.cursor.hx, RecordManager.system.cursor.hy);
    } else {
      return Graphics.setCursorBitmap(null);
    }
  };


  /**
  * Disposes the GameManager. Should be called before quit the game.
  *
  * @method dispose
   */

  GameManager.prototype.dispose = function() {};


  /**
  * Quits the game. The implementation depends on the platform. So for example on mobile
  * devices this method has no effect.
  *
  * @method exit
   */

  GameManager.prototype.exit = function() {
    return Application.exit();
  };


  /**
  * Resets the GameManager by disposing and re-initializing it.
  *
  * @method reset
   */

  GameManager.prototype.reset = function() {
    this.initialized = false;
    this.interpreter = null;
    this.dispose();
    return this.initialize();
  };


  /**
  * Starts a new game.
  *
  * @method newGame
   */

  GameManager.prototype.newGame = function() {
    this.messages = [];
    this.variableStore.clearAllGlobalVariables();
    this.variableStore.clearAllLocalVariables();
    this.tempSettings.skip = false;
    this.tempFields.clear();
    this.tempFields.inGame = true;
    this.setupCommonEvents();
    this.tempSettings.menuAccess = true;
    this.tempSettings.saveMenuAccess = true;
    this.tempSettings.loadMenuAccess = true;
    return this.tempSettings.backlogAccess = true;
  };


  /**
  * Exists the game and resets the GameManager which is important before going back to
  * the main menu or title screen.
  *
  * @method exitGame
   */

  GameManager.prototype.exitGame = function() {
    this.tempFields.inGame = false;
    return this.tempFields.isExitingGame = true;
  };


  /**
  * Updates the GameManager. Should be called once per frame.
  *
  * @method update
   */

  GameManager.prototype.update = function() {};


  /**
  * Creates the index of all save-games. Should be called whenever a new save game
  * is created.
  *
  * @method createSaveGameIndex
  * @protected
   */

  GameManager.prototype.createSaveGameIndex = function() {
    var chaper, chapter, header, i, image, j, ref, scene;
    this.saveGameSlots = [];
    for (i = j = 0, ref = this.saveSlotCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (GameStorage.exists("SaveGame_" + i + "_Header")) {
        header = GameStorage.getObject("SaveGame_" + i + "_Header");
        chapter = DataManager.getDocument(header.chapterUid);
        scene = DataManager.getDocumentSummary(header.sceneUid);
        image = header.image;
      } else {
        header = null;
        chaper = null;
        scene = null;
      }
      if ((chapter != null) && (scene != null) && !this.inLivePreview) {
        this.saveGameSlots.push({
          date: header.date,
          chapter: chapter.items.name || "DELETED",
          scene: scene.items.name || "DELETED",
          image: image
        });
      } else {
        this.saveGameSlots.push({
          "date": "",
          "chapter": "",
          "scene": "",
          "image": null
        });
      }
    }
    return this.saveGameSlots;
  };


  /**
  * Resets the game's settings to its default values.
  *
  * @method resetSettings
   */

  GameManager.prototype.resetSettings = function() {
    var i, j, ref;
    this.settings = {
      version: 338,
      renderer: 0,
      filter: 1,
      confirmation: true,
      adjustAspectRatio: false,
      allowSkip: true,
      allowSkipUnreadMessages: true,
      allowVideoSkip: true,
      skipVoiceOnAction: true,
      allowChoiceSkip: false,
      voicesByCharacter: [],
      timeMessageToVoice: true,
      "autoMessage": {
        enabled: false,
        time: 0,
        waitForVoice: true,
        stopOnAction: false
      },
      "voiceEnabled": true,
      "bgmEnabled": true,
      "soundEnabled": true,
      "voiceVolume": 100,
      "bgmVolume": 100,
      "seVolume": 100,
      "messageSpeed": 4,
      "fullScreen": false,
      "aspectRatio": 0
    };
    this.saveGameSlots = [];
    for (i = j = 0, ref = this.saveSlotCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      GameStorage.remove("SaveGame_" + i + "_Header");
      GameStorage.remove("SaveGame_" + i);
      this.saveGameSlots.push({
        "date": "",
        "chapter": "",
        "scene": "",
        "thumb": ""
      });
    }
    GameStorage.setObject("settings", this.settings);
    this.globalData = {
      messages: {},
      cgGallery: {}
    };
    return GameStorage.setObject("globalData", this.globalData);
  };


  /**
  * Saves current game settings.
  *
  * @method saveSettings
   */

  GameManager.prototype.saveSettings = function() {
    return GameStorage.setObject("settings", this.settings);
  };


  /**
  * Saves current global data.
  *
  * @method saveGlobalData
   */

  GameManager.prototype.saveGlobalData = function() {
    this.globalData.persistentNumbers = this.variableStore.persistentNumbers;
    this.globalData.persistentStrings = this.variableStore.persistentStrings;
    this.globalData.persistentBooleans = this.variableStore.persistentBooleans;
    return GameStorage.setObject("globalData", this.globalData);
  };


  /**
  * Resets current global data. All stored data about read messages, persistent variables and
  * CG gallery will be deleted.
  *
  * @method resetGlobalData
   */

  GameManager.prototype.resetGlobalData = function() {
    var cg, i, j, len, ref;
    this.globalData = {
      messages: {},
      cgGallery: {}
    };
    ref = RecordManager.cgGalleryArray;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      cg = ref[i];
      if (cg != null) {
        this.globalData.cgGallery[cg.index] = {
          unlocked: false
        };
      }
    }
    return GameStorage.setObject("globalData", this.globalData);
  };

  GameManager.prototype.readSaveGame = function(saveGame) {};

  GameManager.prototype.writeSaveGame = function(saveGame) {};

  GameManager.prototype.prepareSaveGame = function(snapshot) {
    var context, messageBoxIds, messageBoxes, messageIds, messages, saveGame, sceneData;
    if (snapshot) {
      snapshot = ResourceManager.getCustomBitmap("$snapshot");
      if (snapshot != null) {
        snapshot.dispose();
      }
      ResourceManager.setCustomBitmap("$snapshot", Graphics.snapshot());
    }
    context = new gs.ObjectCodecContext();
    context.decodedObjectStore.push(Graphics.viewport);
    context.decodedObjectStore.push(this.scene);
    context.decodedObjectStore.push(this.scene.behavior);
    messageBoxIds = ["messageBox", "nvlMessageBox", "messageMenu"];
    messageIds = ["gameMessage_message", "gameMessageNVL_message"];
    messageBoxes = messageBoxIds.select((function(_this) {
      return function(id) {
        return _this.scene.behavior.objectManager.objectById(id);
      };
    })(this));
    messages = messageIds.select((function(_this) {
      return function(id) {
        return _this.scene.behavior.objectManager.objectById(id);
      };
    })(this));
    sceneData = {};
    saveGame = {};
    saveGame.encodedObjectStore = null;
    saveGame.sceneUid = this.scene.sceneDocument.uid;
    saveGame.data = {
      resourceContext: this.scene.behavior.resourceContext.toDataBundle(),
      currentCharacter: this.scene.currentCharacter,
      frameCount: Graphics.frameCount,
      tempFields: this.tempFields,
      viewport: this.scene.viewport,
      characters: this.scene.characters,
      characterNames: RecordManager.charactersArray.select(function(c) {
        return {
          name: c.name,
          index: c.index
        };
      }),
      backgrounds: this.scene.backgrounds,
      pictures: this.scene.pictureContainer.subObjectsByDomain,
      texts: this.scene.textContainer.subObjectsByDomain,
      videos: this.scene.videoContainer.subObjectsByDomain,
      viewports: this.scene.viewportContainer.subObjects,
      commonEvents: this.scene.commonEventContainer.subObjects,
      hotspots: this.scene.hotspotContainer.subObjectsByDomain,
      interpreter: this.scene.interpreter,
      messageBoxes: messageBoxes.select((function(_this) {
        return function(mb, i) {
          return {
            visible: mb.visible,
            id: mb.id,
            message: messages[i]
          };
        };
      })(this)),
      backlog: this.backlog,
      variableStore: this.variableStore,
      defaults: this.defaults,
      transitionData: SceneManager.transitionData,
      audio: {
        audioBuffers: AudioManager.audioBuffers,
        audioBuffersByLayer: AudioManager.audioBuffersByLayer,
        audioLayers: AudioManager.audioLayers,
        soundReferences: AudioManager.soundReferences
      },
      messageAreas: this.scene.messageAreaContainer.subObjectsByDomain
    };
    saveGame.data = gs.ObjectCodec.encode(saveGame.data, context);
    saveGame.encodedObjectStore = context.encodedObjectStore;
    return this.saveGame = saveGame;
  };

  GameManager.prototype.createSaveGameSlot = function(header) {
    var slot;
    slot = {
      "date": new Date().toDateString(),
      "chapter": this.scene.chapter.items.name,
      "scene": this.scene.sceneDocument.items.name,
      "image": header.image
    };
    return slot;
  };

  GameManager.prototype.createSaveGameHeader = function(thumbWidth, thumbHeight) {
    var header, thumbImage;
    thumbImage = this.createSaveGameThumbImage(thumbWidth, thumbHeight);
    header = {
      "date": new Date().toDateString(),
      "chapterUid": this.scene.chapter.uid,
      "sceneUid": this.scene.sceneDocument.uid,
      "image": thumbImage != null ? thumbImage.image.toDataURL() : void 0
    };
    if (thumbImage != null) {
      thumbImage.dispose();
    }
    return header;
  };

  GameManager.prototype.createSaveGameThumbImage = function(width, height) {
    var snapshot, thumbImage;
    snapshot = ResourceManager.getBitmap("$snapshot");
    thumbImage = null;
    if (snapshot) {
      if (width && height) {
        thumbImage = new Bitmap(width, height);
      } else {
        thumbImage = new Bitmap(Graphics.width / 8, Graphics.height / 8);
      }
      thumbImage.stretchBlt(new Rect(0, 0, thumbImage.width, thumbImage.height), snapshot, new Rect(0, 0, snapshot.width, snapshot.height));
    }
    return thumbImage;
  };

  GameManager.prototype.storeSaveGame = function(name, saveGame, header) {
    if (header) {
      GameStorage.setData(name + "_Header", JSON.stringify(header));
    }
    return GameStorage.setData(name, JSON.stringify(saveGame));
  };


  /**
  * Saves the current game at the specified slot.
  *
  * @method save
  * @param {number} slot - The slot where the game should be saved at.
  * @param {number} thumbWidth - The width for the snapshot-thumb. You can specify <b>null</b> or 0 to use an auto calculated width.
  * @param {number} thumbHeight - The height for the snapshot-thumb. You can specify <b>null</b> or 0 to use an auto calculated height.
   */

  GameManager.prototype.save = function(slot, thumbWidth, thumbHeight) {
    var header;
    if (this.saveGame) {
      header = this.createSaveGameHeader(thumbWidth, thumbHeight);
      this.saveGameSlots[slot] = this.createSaveGameSlot(header);
      this.storeSaveGame("SaveGame_" + slot, this.saveGame, header);
      this.sceneData = {};
      return this.saveGame;
    }
  };

  GameManager.prototype.restore = function(saveGame) {
    this.backlog = saveGame.data.backlog;
    this.defaults = saveGame.data.defaults;
    this.variableStore = saveGame.data.variableStore;
    this.sceneData = saveGame.data;
    this.saveGame = null;
    this.loadedSaveGame = null;
    this.tempFields = saveGame.data.tempFields;
    window.$tempFields = this.tempFields;
    return window.$dataFields.backlog = this.backlog;
  };

  GameManager.prototype.prepareLoadGame = function() {
    return AudioManager.stopAllMusic(30);
  };


  /**
  * Loads the game from the specified save game slot. This method triggers
  * a automatic scene change.
  *
  * @method load
  * @param {number} slot - The slot where the game should be loaded from.
   */

  GameManager.prototype.load = function(slot) {
    if (!this.saveGameSlots[slot] || this.saveGameSlots[slot].date.trim().length === 0) {
      return;
    }
    this.prepareLoadGame();
    this.loadedSaveGame = this.loadSaveGame("SaveGame_" + slot);
    SceneManager.switchTo(new vn.Object_Scene());
    return SceneManager.clear();
  };

  GameManager.prototype.loadSaveGame = function(name) {
    return JSON.parse(GameStorage.getData(name));
  };


  /**
  * Gets the save game data for a specified slot.
  *
  * @method getSaveGame
  * @param {number} slot - The slot to get the save data from.
  * @return {Object} The save game data.
   */

  GameManager.prototype.getSaveGame = function(slot) {
    return JSON.parse(GameStorage.getData("SaveGame_" + slot));
  };

  return GameManager;

})();

window.GameManager = new GameManager();

gs.GameManager = window.GameManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7OztFQVNhLHFCQUFBOztBQUNUOzs7OztJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWE7O0FBRWI7Ozs7OztJQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCOztBQUVqQjs7Ozs7SUFLQSxJQUFDLENBQUEsWUFBRCxHQUFnQjs7QUFFaEI7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBZTs7QUFFZjs7Ozs7SUFLQSxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUFBLElBQUEsRUFBTSxLQUFOO01BQWEsUUFBQSxFQUFVLENBQXZCO01BQTBCLGNBQUEsRUFBZ0IsSUFBMUM7TUFBZ0QsVUFBQSxFQUFZLElBQTVEO01BQWtFLGFBQUEsRUFBZSxJQUFqRjtNQUF1RixjQUFBLEVBQWdCLElBQXZHO01BQTZHLGFBQUEsRUFBZTtRQUFFLFNBQUEsRUFBVztVQUFFLElBQUEsRUFBTSxDQUFSO1NBQWI7UUFBMEIsUUFBQSxFQUFVLEVBQXBDO1FBQXdDLE1BQUEsRUFBUSxJQUFoRDs7O0FBRTVJOzs7O1NBRmdCOztJQU9oQixJQUFDLENBQUEsVUFBRCxHQUFjOztBQUVkOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDUixVQUFBLEVBQVk7UUFBRSxVQUFBLEVBQVksRUFBZDtRQUFrQixRQUFBLEVBQVUsQ0FBNUI7UUFBK0IsUUFBQSxFQUFVLENBQXpDO1FBQTRDLGNBQUEsRUFBZ0IsQ0FBNUQ7UUFBK0QsZ0JBQUEsRUFBa0IsQ0FBakY7UUFBb0YsUUFBQSxFQUFVO1VBQUUsTUFBQSxFQUFRLENBQVY7VUFBYSxPQUFBLEVBQVMsQ0FBdEI7U0FBOUY7UUFBeUgsV0FBQSxFQUFhO1VBQUUsTUFBQSxFQUFRLENBQVY7VUFBYSxVQUFBLEVBQVksQ0FBekI7VUFBNEIsTUFBQSxFQUFRO1lBQUUsU0FBQSxFQUFXLElBQWI7WUFBbUIsT0FB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PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBHYW1lTWFuYWdlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgR2FtZU1hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBNYW5hZ2VzIGFsbCBnZW5lcmFsIHRoaW5ncyBhcm91bmQgdGhlIGdhbWUgbGlrZSBob2xkaW5nIHRoZSBnYW1lIHNldHRpbmdzLFxuICAgICogbWFuYWdlcyB0aGUgc2F2ZS9sb2FkIG9mIGEgZ2FtZSwgZXRjLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBHYW1lTWFuYWdlclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjdXJyZW50IHNjZW5lIGRhdGEuXG4gICAgICAgICogQHByb3BlcnR5IHNjZW5lRGF0YVxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyMgXG4gICAgICAgIEBzY2VuZURhdGEgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBzY2VuZSB2aWV3cG9ydCBjb250YWluaW5nIGFsbCB2aXN1YWwgb2JqZWN0cyB3aGljaCBhcmUgcGFydCBvZiB0aGUgc2NlbmUgYW5kIGluZmx1ZW5jZWRcbiAgICAgICAgKiBieSB0aGUgaW4tZ2FtZSBjYW1lcmEuXG4gICAgICAgICogQHByb3BlcnR5IHNjZW5lVmlld3BvcnRcbiAgICAgICAgKiBAdHlwZSBncy5PYmplY3RfVmlld3BvcnRcbiAgICAgICAgIyMjXG4gICAgICAgIEBzY2VuZVZpZXdwb3J0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsaXN0IG9mIGNvbW1vbiBldmVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGNvbW1vbkV2ZW50c1xuICAgICAgICAqIEB0eXBlIGdzLk9iamVjdF9Db21tb25FdmVudFtdXG4gICAgICAgICMjIyBcbiAgICAgICAgQGNvbW1vbkV2ZW50cyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBHYW1lTWFuYWdlciBpcyBpbml0aWFsaXplZC5cbiAgICAgICAgKiBAcHJvcGVydHkgY29tbW9uRXZlbnRzXG4gICAgICAgICogQHR5cGUgZ3MuT2JqZWN0X0NvbW1vbkV2ZW50W11cbiAgICAgICAgIyMjIFxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRlbXBvcmFyeSBnYW1lIHNldHRpbmdzLlxuICAgICAgICAqIEBwcm9wZXJ0eSB0ZW1wU2V0dGluZ3NcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjIFxuICAgICAgICBAdGVtcFNldHRpbmdzID0gc2tpcDogZmFsc2UsIHNraXBUaW1lOiA1LCBsb2FkTWVudUFjY2VzczogdHJ1ZSwgbWVudUFjY2VzczogdHJ1ZSwgYmFja2xvZ0FjY2VzczogdHJ1ZSwgc2F2ZU1lbnVBY2Nlc3M6IHRydWUsIG1lc3NhZ2VGYWRpbmc6IHsgYW5pbWF0aW9uOiB7IHR5cGU6IDEgfSwgZHVyYXRpb246IDE1LCBlYXNpbmc6IG51bGwgfVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRlbXBvcmFyeSBnYW1lIGZpZWxkcy5cbiAgICAgICAgKiBAcHJvcGVydHkgdGVtcEZpZWxkc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyMgXG4gICAgICAgIEB0ZW1wRmllbGRzID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBkZWZhdWx0IHZhbHVlcyBmb3IgYmFja2dyb3VuZHMsIHBpY3R1cmVzLCBldGMuXG4gICAgICAgICogQHByb3BlcnR5IGRlZmF1bHRzXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAZGVmYXVsdHMgPSB7IFxuICAgICAgICAgICAgYmFja2dyb3VuZDogeyBcImR1cmF0aW9uXCI6IDMwLCBcIm9yaWdpblwiOiAwLCBcInpPcmRlclwiOiAwLCBcImxvb3BWZXJ0aWNhbFwiOiAwLCBcImxvb3BIb3Jpem9udGFsXCI6IDAsIFwiZWFzaW5nXCI6IHsgXCJ0eXBlXCI6IDAsIFwiaW5PdXRcIjogMSB9LCBcImFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJtb3Rpb25CbHVyXCI6IHsgXCJlbmFibGVkXCI6IDAsIFwiZGVsYXlcIjogMiwgXCJvcGFjaXR5XCI6IDEwMCwgXCJkaXNzb2x2ZVNwZWVkXCI6IDMgfSB9LFxuICAgICAgICAgICAgcGljdHVyZTogeyBcImFwcGVhckR1cmF0aW9uXCI6IDMwLCBcImRpc2FwcGVhckR1cmF0aW9uXCI6IDMwLCBcIm9yaWdpblwiOiAwLCBcInpPcmRlclwiOiAwLCBcImFwcGVhckVhc2luZ1wiOiB7IFwidHlwZVwiOiAwLCBcImluT3V0XCI6IDEgfSwgXCJkaXNhcHBlYXJFYXNpbmdcIjogeyBcInR5cGVcIjogMCwgXCJpbk91dFwiOiAxIH0sIFwiYXBwZWFyQW5pbWF0aW9uXCI6IHsgXCJ0eXBlXCI6IDEsIFwibW92ZW1lbnRcIjogMCwgXCJtYXNrXCI6IHsgXCJncmFwaGljXCI6IG51bGwsIFwidmFndWVcIjogMzAgfSB9LCBcImRpc2FwcGVhckFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJtb3Rpb25CbHVyXCI6IHsgXCJlbmFibGVkXCI6IDAsIFwiZGVsYXlcIjogMiwgXCJvcGFjaXR5XCI6IDEwMCwgXCJkaXNzb2x2ZVNwZWVkXCI6IDMgfSB9LFxuICAgICAgICAgICAgY2hhcmFjdGVyOiB7IFwiZXhwcmVzc2lvbkR1cmF0aW9uXCI6IDAsIFwiYXBwZWFyRHVyYXRpb25cIjogNDAsIFwiZGlzYXBwZWFyRHVyYXRpb25cIjogNDAsIFwib3JpZ2luXCI6IDAsIFwiek9yZGVyXCI6IDAsIFwiYXBwZWFyRWFzaW5nXCI6IHsgXCJ0eXBlXCI6IDIsIFwiaW5PdXRcIjogMiB9LCBcImRpc2FwcGVhckVhc2luZ1wiOiB7IFwidHlwZVwiOiAxLCBcImluT3V0XCI6IDEgfSwgXCJhcHBlYXJBbmltYXRpb25cIjogeyBcInR5cGVcIjogMSwgXCJtb3ZlbWVudFwiOiAwLCBcIm1hc2tcIjogeyBcImdyYXBoaWNcIjogbnVsbCwgXCJ2YWd1ZVwiOiAzMCB9IH0sIFwiZGlzYXBwZWFyQW5pbWF0aW9uXCI6IHsgXCJ0eXBlXCI6IDEsIFwibW92ZW1lbnRcIjogMCwgXCJtYXNrXCI6IHsgXCJncmFwaGljXCI6IG51bGwsIFwidmFndWVcIjogMzAgfSB9LCBcIm1vdGlvbkJsdXJcIjogeyBcImVuYWJsZWRcIjogMCwgXCJkZWxheVwiOiAyLCBcIm9wYWNpdHlcIjogMTAwLCBcImRpc3NvbHZlU3BlZWRcIjogMyB9LCBcImNoYW5nZUFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwiZmFkaW5nXCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJjaGFuZ2VFYXNpbmdcIjogeyBcInR5cGVcIjogMiwgXCJpbk91dFwiOiAyIH0gfSxcbiAgICAgICAgICAgIHRleHQ6IHsgXCJhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJkaXNhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJwb3NpdGlvbk9yaWdpblwiOiAwLCBcIm9yaWdpblwiOiAwLCBcInpPcmRlclwiOiAwLCBcImFwcGVhckVhc2luZ1wiOiB7IFwidHlwZVwiOiAwLCBcImluT3V0XCI6IDEgfSwgXCJkaXNhcHBlYXJFYXNpbmdcIjogeyBcInR5cGVcIjogMCwgXCJpbk91dFwiOiAxIH0sIFwiYXBwZWFyQW5pbWF0aW9uXCI6IHsgXCJ0eXBlXCI6IDEsIFwibW92ZW1lbnRcIjogMCwgXCJtYXNrXCI6IHsgXCJncmFwaGljXCI6IG51bGwsIFwidmFndWVcIjogMzAgfSB9LCBcImRpc2FwcGVhckFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJtb3Rpb25CbHVyXCI6IHsgXCJlbmFibGVkXCI6IDAsIFwiZGVsYXlcIjogMiwgXCJvcGFjaXR5XCI6IDEwMCwgXCJkaXNzb2x2ZVNwZWVkXCI6IDMgfSB9LFxuICAgICAgICAgICAgdmlkZW86IHsgXCJhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJkaXNhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJvcmlnaW5cIjogMCwgXCJ6T3JkZXJcIjogMCwgXCJhcHBlYXJFYXNpbmdcIjogeyBcInR5cGVcIjogMCwgXCJpbk91dFwiOiAxIH0sIFwiZGlzYXBwZWFyRWFzaW5nXCI6IHsgXCJ0eXBlXCI6IDAsIFwiaW5PdXRcIjogMSB9LCBcImFwcGVhckFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJkaXNhcHBlYXJBbmltYXRpb25cIjogeyBcInR5cGVcIjogMSwgXCJtb3ZlbWVudFwiOiAwLCBcIm1hc2tcIjogeyBcImdyYXBoaWNcIjogbnVsbCwgXCJ2YWd1ZVwiOiAzMCB9IH0sIFwibW90aW9uQmx1clwiOiB7IFwiZW5hYmxlZFwiOiAwLCBcImRlbGF5XCI6IDIsIFwib3BhY2l0eVwiOiAxMDAsIFwiZGlzc29sdmVTcGVlZFwiOiAzIH0gfSxcbiAgICAgICAgICAgIGxpdmUyZDogeyBcIm1vdGlvbkZhZGVJblRpbWVcIjogMTAwMCwgXCJhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJkaXNhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJ6T3JkZXJcIjogMCwgXCJhcHBlYXJFYXNpbmdcIjogeyBcInR5cGVcIjogMCwgXCJpbk91dFwiOiAxIH0sIFwiZGlzYXBwZWFyRWFzaW5nXCI6IHsgXCJ0eXBlXCI6IDAsIFwiaW5PdXRcIjogMSB9LCBcImFwcGVhckFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAxLCBcIm1vdmVtZW50XCI6IDAsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJkaXNhcHBlYXJBbmltYXRpb25cIjogeyBcInR5cGVcIjogMSwgXCJtb3ZlbWVudFwiOiAwLCBcIm1hc2tcIjogeyBcImdyYXBoaWNcIjogbnVsbCwgXCJ2YWd1ZVwiOiAzMCB9IH0gfSxcbiAgICAgICAgICAgIG1lc3NhZ2VCb3g6IHsgXCJhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJkaXNhcHBlYXJEdXJhdGlvblwiOiAzMCwgXCJ6T3JkZXJcIjogMCwgXCJhcHBlYXJFYXNpbmdcIjogeyBcInR5cGVcIjogMCwgXCJpbk91dFwiOiAxIH0sIFwiZGlzYXBwZWFyRWFzaW5nXCI6IHsgXCJ0eXBlXCI6IDAsIFwiaW5PdXRcIjogMSB9LCBcImFwcGVhckFuaW1hdGlvblwiOiB7IFwidHlwZVwiOiAwLCBcIm1vdmVtZW50XCI6IDMsIFwibWFza1wiOiB7IFwiZ3JhcGhpY1wiOiBudWxsLCBcInZhZ3VlXCI6IDMwIH0gfSwgXCJkaXNhcHBlYXJBbmltYXRpb25cIjogeyBcInR5cGVcIjogMCwgXCJtb3ZlbWVudFwiOiAzLCBcIm1hc2tcIjogeyBcImdyYXBoaWNcIjogbnVsbCwgXCJ2YWd1ZVwiOiAzMCB9IH0gfSxcbiAgICAgICAgICAgIGF1ZGlvOiB7IFwibXVzaWNGYWRlSW5EdXJhdGlvblwiOiAwLCBcIm11c2ljRmFkZU91dER1cmF0aW9uXCI6IDAsIFwibXVzaWNWb2x1bWVcIjogMTAwLCBcIm11c2ljUGxheWJhY2tSYXRlXCI6IDEwMCwgXCJzb3VuZFZvbHVtZVwiOiAxMDAsIFwic291bmRQbGF5YmFja1JhdGVcIjogMTAwLCBcInZvaWNlVm9sdW1lXCI6IDEwMCwgXCJ2b2ljZVBsYXliYWNrUmF0ZVwiOiAxMDAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGdhbWUncyBiYWNrbG9nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBiYWNrbG9nXG4gICAgICAgICogQHR5cGUgT2JqZWN0W11cbiAgICAgICAgIyMjIFxuICAgICAgICBAYmFja2xvZyA9IFtdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ2hhcmFjdGVyIHBhcmFtZXRlcnMgYnkgY2hhcmFjdGVyIElELlxuICAgICAgICAqIEBwcm9wZXJ0eSBjaGFyYWN0ZXJQYXJhbXNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RbXVxuICAgICAgICAjIyMgXG4gICAgICAgIEBjaGFyYWN0ZXJQYXJhbXMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBnYW1lJ3MgY2hhcHRlclxuICAgICAgICAqIEBwcm9wZXJ0eSBjaGFwdGVyc1xuICAgICAgICAqIEB0eXBlIGdzLkRvY3VtZW50W11cbiAgICAgICAgIyMjIFxuICAgICAgICBAY2hhcHRlcnMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBnYW1lJ3MgY3VycmVudCBkaXNwbGF5ZWQgbWVzc2FnZXMuIEVzcGVjaWFsbHkgaW4gTlZMIG1vZGUgdGhlIG1lc3NhZ2VzIFxuICAgICAgICAqIG9mIHRoZSBjdXJyZW50IHBhZ2UgYXJlIHN0b3JlZCBoZXJlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBtZXNzYWdlc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFtdXG4gICAgICAgICMjIyBcbiAgICAgICAgQG1lc3NhZ2VzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDb3VudCBvZiBzYXZlIHNsb3RzLiBEZWZhdWx0IGlzIDEwMC5cbiAgICAgICAgKiBAcHJvcGVydHkgc2F2ZVNsb3RDb3VudFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyMgXG4gICAgICAgIEBzYXZlU2xvdENvdW50ID0gMTAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGluZGV4IG9mIHNhdmUgZ2FtZXMuIENvbnRhaW5zIHRoZSBoZWFkZXItaW5mbyBmb3IgZWFjaCBzYXZlIGdhbWUgc2xvdC5cbiAgICAgICAgKiBAcHJvcGVydHkgc2F2ZUdhbWVTbG90c1xuICAgICAgICAqIEB0eXBlIE9iamVjdFtdXG4gICAgICAgICMjIyBcbiAgICAgICAgQHNhdmVHYW1lU2xvdHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBnbG9iYWwgZGF0YSBsaWtlIHRoZSBzdGF0ZSBvZiBwZXJzaXN0ZW50IGdhbWUgdmFyaWFibGVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBnbG9iYWxEYXRhXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjIyBcbiAgICAgICAgQGdsb2JhbERhdGEgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBnYW1lIHJ1bnMgaW4gZWRpdG9yJ3MgbGl2ZS1wcmV2aWV3LlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbkxpdmVQcmV2aWV3XG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjIyBcbiAgICAgICAgQGluTGl2ZVByZXZpZXcgPSBub1xuICAgICAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgR2FtZU1hbmFnZXIsIHNob3VsZCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBhY3R1YWwgZ2FtZSBzdGFydHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBpbml0aWFsaXplXG4gICAgIyMjICAgIFxuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICAgIEBpbml0aWFsaXplZCA9IHllc1xuICAgICAgICBAaW5MaXZlUHJldmlldyA9ICRQQVJBTVMucHJldmlldz9cbiAgICAgICAgQHNhdmVTbG90Q291bnQgPSBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5zYXZlU2xvdENvdW50IHx8IDEwMFxuICAgICAgICBAdGVtcEZpZWxkcyA9IG5ldyBncy5HYW1lVGVtcCgpXG4gICAgICAgIHdpbmRvdy4kdGVtcEZpZWxkcyA9IEB0ZW1wRmllbGRzXG4gICAgICAgIFxuICAgICAgICBAY3JlYXRlU2F2ZUdhbWVJbmRleCgpXG4gICAgICAgIEB2YXJpYWJsZVN0b3JlID0gbmV3IGdzLlZhcmlhYmxlU3RvcmUoKVxuICAgICAgICBAdmFyaWFibGVTdG9yZS5zZXR1cERvbWFpbnMoRGF0YU1hbmFnZXIuZ2V0RG9jdW1lbnRzQnlUeXBlKFwiZ2xvYmFsX3ZhcmlhYmxlc1wiKS5zZWxlY3QgKHYpIC0+IHYuaXRlbXMuZG9tYWlufHxcIlwiKVxuICAgICAgICBAc2NlbmVWaWV3cG9ydCA9IG5ldyBncy5PYmplY3RfVmlld3BvcnQobmV3IFZpZXdwb3J0KDAsIDAsIEdyYXBoaWNzLndpZHRoLCBHcmFwaGljcy5oZWlnaHQsIEdyYXBoaWNzLnZpZXdwb3J0KSlcbiAgICAgICAgZm9yIGNoYXJhY3RlciBpbiBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNBcnJheVxuICAgICAgICAgICAgaWYgY2hhcmFjdGVyP1xuICAgICAgICAgICAgICAgIEBjaGFyYWN0ZXJQYXJhbXNbY2hhcmFjdGVyLmluZGV4XSA9IHt9XG4gICAgICAgICAgICAgICAgaWYgY2hhcmFjdGVyLnBhcmFtcz9cbiAgICAgICAgICAgICAgICAgICAgZm9yIHBhcmFtIGluIGNoYXJhY3Rlci5wYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjaGFyYWN0ZXJQYXJhbXNbY2hhcmFjdGVyLmluZGV4XVtwYXJhbS5uYW1lXSA9IHBhcmFtLnZhbHVlIFxuXG4gICAgICAgIFxuICAgICAgICBAc2V0dXBDb21tb25FdmVudHMoKVxuICAgICAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi4uUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzXVxuICAgICAgICAgICAgQHNldHRpbmdzLnZvaWNlc1BlckNoYXJhY3RlcltpXSA9IDEwMFxuICAgICAgICAgICAgIFxuICAgICAgICBAY2hhcHRlcnMgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudHNCeVR5cGUoXCJ2bi5jaGFwdGVyXCIpXG4gICAgICAgIEBjaGFwdGVycy5zb3J0IChhLCBiKSAtPlxuICAgICAgICAgICAgaWYgYS5pdGVtcy5vcmRlciA+IGIuaXRlbXMub3JkZXJcbiAgICAgICAgICAgICAgICByZXR1cm4gMVxuICAgICAgICAgICAgZWxzZSBpZiBhLml0ZW1zLm9yZGVyIDwgYi5pdGVtcy5vcmRlclxuICAgICAgICAgICAgICAgIHJldHVybiAtMVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdXAgY29tbW9uIGV2ZW50cy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQ29tbW9uRXZlbnRzXG4gICAgIyMjICAgICAgICAgICAgXG4gICAgc2V0dXBDb21tb25FdmVudHM6IC0+XG4gICAgICAgIGZvciBldmVudCBpbiBAY29tbW9uRXZlbnRzXG4gICAgICAgICAgICBldmVudD8uZGlzcG9zZSgpXG4gICAgICAgIFxuICAgICAgICBAY29tbW9uRXZlbnRzID0gW10gICAgXG4gICAgICAgIGZvciBldmVudCBpbiBSZWNvcmRNYW5hZ2VyLmNvbW1vbkV2ZW50c1xuICAgICAgICAgICAgY29udGludWUgaWYgbm90IGV2ZW50XG4gICAgICAgICAgICBpZiBldmVudC5zdGFydENvbmRpdGlvbiA9PSAxIGFuZCBldmVudC5hdXRvUHJlbG9hZFxuICAgICAgICAgICAgICAgIGdzLlJlc291cmNlTG9hZGVyLmxvYWRFdmVudENvbW1hbmRzR3JhcGhpY3MoZXZlbnQuY29tbWFuZHMpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBvYmplY3QgPSBuZXcgZ3MuT2JqZWN0X0NvbW1vbkV2ZW50KClcbiAgICAgICAgICAgIG9iamVjdC5yZWNvcmQgPSBldmVudFxuICAgICAgICAgICAgb2JqZWN0LnJpZCA9IGV2ZW50LmluZGV4XG4gICAgICAgICAgICBAY29tbW9uRXZlbnRzW2V2ZW50LmluZGV4XSA9IG9iamVjdFxuICAgICAgICAgICAgQGNvbW1vbkV2ZW50cy5wdXNoKG9iamVjdClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIGN1cnNvciBkZXBlbmRpbmcgb24gc3lzdGVtIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBDdXJzb3JcbiAgICAjIyNcbiAgICBzZXR1cEN1cnNvcjogLT5cbiAgICAgICAgaWYgUmVjb3JkTWFuYWdlci5zeXN0ZW0uY3Vyc29yPy5uYW1lXG4gICAgICAgICAgICBiaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tSZWNvcmRNYW5hZ2VyLnN5c3RlbS5jdXJzb3IubmFtZX1cIilcbiAgICAgICAgICAgIEdyYXBoaWNzLnNldEN1cnNvckJpdG1hcChiaXRtYXAsIFJlY29yZE1hbmFnZXIuc3lzdGVtLmN1cnNvci5oeCwgUmVjb3JkTWFuYWdlci5zeXN0ZW0uY3Vyc29yLmh5KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBHcmFwaGljcy5zZXRDdXJzb3JCaXRtYXAobnVsbClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgdGhlIEdhbWVNYW5hZ2VyLiBTaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBxdWl0IHRoZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZVxuICAgICMjIyAgICAgICAgICAgICAgIFxuICAgIGRpc3Bvc2U6IC0+XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFF1aXRzIHRoZSBnYW1lLiBUaGUgaW1wbGVtZW50YXRpb24gZGVwZW5kcyBvbiB0aGUgcGxhdGZvcm0uIFNvIGZvciBleGFtcGxlIG9uIG1vYmlsZVxuICAgICogZGV2aWNlcyB0aGlzIG1ldGhvZCBoYXMgbm8gZWZmZWN0LlxuICAgICpcbiAgICAqIEBtZXRob2QgZXhpdFxuICAgICMjIyAgIFxuICAgIGV4aXQ6IC0+IEFwcGxpY2F0aW9uLmV4aXQoKVxuICAgIFxuICAgICMjIypcbiAgICAqIFJlc2V0cyB0aGUgR2FtZU1hbmFnZXIgYnkgZGlzcG9zaW5nIGFuZCByZS1pbml0aWFsaXppbmcgaXQuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXNldFxuICAgICMjIyAgICAgICAgICBcbiAgICByZXNldDogLT5cbiAgICAgICAgQGluaXRpYWxpemVkID0gbm9cbiAgICAgICAgQGludGVycHJldGVyID0gbnVsbFxuICAgICAgICBAZGlzcG9zZSgpXG4gICAgICAgIEBpbml0aWFsaXplKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogU3RhcnRzIGEgbmV3IGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBuZXdHYW1lXG4gICAgIyMjICAgICAgXG4gICAgbmV3R2FtZTogLT5cbiAgICAgICAgQG1lc3NhZ2VzID0gW11cbiAgICAgICAgQHZhcmlhYmxlU3RvcmUuY2xlYXJBbGxHbG9iYWxWYXJpYWJsZXMoKVxuICAgICAgICBAdmFyaWFibGVTdG9yZS5jbGVhckFsbExvY2FsVmFyaWFibGVzKClcbiAgICAgICAgQHRlbXBTZXR0aW5ncy5za2lwID0gbm9cbiAgICAgICAgQHRlbXBGaWVsZHMuY2xlYXIoKVxuICAgICAgICBAdGVtcEZpZWxkcy5pbkdhbWUgPSB5ZXNcbiAgICAgICAgQHNldHVwQ29tbW9uRXZlbnRzKClcbiAgICAgICAgQHRlbXBTZXR0aW5ncy5tZW51QWNjZXNzID0geWVzXG4gICAgICAgIEB0ZW1wU2V0dGluZ3Muc2F2ZU1lbnVBY2Nlc3MgPSB5ZXNcbiAgICAgICAgQHRlbXBTZXR0aW5ncy5sb2FkTWVudUFjY2VzcyA9IHllc1xuICAgICAgICBAdGVtcFNldHRpbmdzLmJhY2tsb2dBY2Nlc3MgPSB5ZXNcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBFeGlzdHMgdGhlIGdhbWUgYW5kIHJlc2V0cyB0aGUgR2FtZU1hbmFnZXIgd2hpY2ggaXMgaW1wb3J0YW50IGJlZm9yZSBnb2luZyBiYWNrIHRvXG4gICAgKiB0aGUgbWFpbiBtZW51IG9yIHRpdGxlIHNjcmVlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGV4aXRHYW1lXG4gICAgIyMjICAgIFxuICAgIGV4aXRHYW1lOiAtPlxuICAgICAgICBAdGVtcEZpZWxkcy5pbkdhbWUgPSBubyAgICAgXG4gICAgICAgIEB0ZW1wRmllbGRzLmlzRXhpdGluZ0dhbWUgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBHYW1lTWFuYWdlci4gU2hvdWxkIGJlIGNhbGxlZCBvbmNlIHBlciBmcmFtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgdGhlIGluZGV4IG9mIGFsbCBzYXZlLWdhbWVzLiBTaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbmV3IHNhdmUgZ2FtZVxuICAgICogaXMgY3JlYXRlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZVNhdmVHYW1lSW5kZXhcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgXG4gICAgY3JlYXRlU2F2ZUdhbWVJbmRleDogLT5cbiAgICAgICAgQHNhdmVHYW1lU2xvdHMgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMC4uLkBzYXZlU2xvdENvdW50XVxuICAgICAgICAgICAgaWYgR2FtZVN0b3JhZ2UuZXhpc3RzKFwiU2F2ZUdhbWVfI3tpfV9IZWFkZXJcIilcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBHYW1lU3RvcmFnZS5nZXRPYmplY3QoXCJTYXZlR2FtZV8je2l9X0hlYWRlclwiKVxuICAgICAgICAgICAgICAgIGNoYXB0ZXIgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChoZWFkZXIuY2hhcHRlclVpZClcbiAgICAgICAgICAgICAgICBzY2VuZSA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50U3VtbWFyeShoZWFkZXIuc2NlbmVVaWQpXG4gICAgICAgICAgICAgICAgaW1hZ2UgPSBoZWFkZXIuaW1hZ2VcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBudWxsXG4gICAgICAgICAgICAgICAgY2hhcGVyID0gbnVsbFxuICAgICAgICAgICAgICAgIHNjZW5lID0gbnVsbFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgY2hhcHRlcj8gYW5kIHNjZW5lPyBhbmQgIUBpbkxpdmVQcmV2aWV3XG4gICAgICAgICAgICAgICAgQHNhdmVHYW1lU2xvdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGhlYWRlci5kYXRlLFxuICAgICAgICAgICAgICAgICAgICBjaGFwdGVyOiBjaGFwdGVyLml0ZW1zLm5hbWUgfHwgXCJERUxFVEVEXCJcbiAgICAgICAgICAgICAgICAgICAgc2NlbmU6IHNjZW5lLml0ZW1zLm5hbWUgfHwgXCJERUxFVEVEXCIsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWFnZSAjY2hhcHRlci5pdGVtcy5jb21tYW5kc1swXS5wYXJhbXMuc2F2ZUdhbWVHcmFwaGljPy5uYW1lXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2F2ZUdhbWVTbG90cy5wdXNoKHsgXCJkYXRlXCI6IFwiXCIsIFwiY2hhcHRlclwiOiBcIlwiLCBcInNjZW5lXCI6IFwiXCIsIFwiaW1hZ2VcIjogbnVsbCB9KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIEBzYXZlR2FtZVNsb3RzXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc2V0cyB0aGUgZ2FtZSdzIHNldHRpbmdzIHRvIGl0cyBkZWZhdWx0IHZhbHVlcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc2V0U2V0dGluZ3NcbiAgICAjIyMgICAgICAgICAgICBcbiAgICByZXNldFNldHRpbmdzOiAtPlxuICAgICAgICBAc2V0dGluZ3MgPSB7IHZlcnNpb246IDMzOCwgcmVuZGVyZXI6IDAsIGZpbHRlcjogMSwgY29uZmlybWF0aW9uOiB5ZXMsIGFkanVzdEFzcGVjdFJhdGlvOiBubywgYWxsb3dTa2lwOiB5ZXMsIGFsbG93U2tpcFVucmVhZE1lc3NhZ2VzOiB5ZXMsICBhbGxvd1ZpZGVvU2tpcDogeWVzLCBza2lwVm9pY2VPbkFjdGlvbjogeWVzLCBhbGxvd0Nob2ljZVNraXA6IG5vLCB2b2ljZXNCeUNoYXJhY3RlcjogW10sIHRpbWVNZXNzYWdlVG9Wb2ljZTogdHJ1ZSwgIFwiYXV0b01lc3NhZ2VcIjogeyBlbmFibGVkOiBmYWxzZSwgdGltZTogMCwgd2FpdEZvclZvaWNlOiB5ZXMsIHN0b3BPbkFjdGlvbjogbm8gfSwgIFwidm9pY2VFbmFibGVkXCI6IHRydWUsIFwiYmdtRW5hYmxlZFwiOiB0cnVlLCBcInNvdW5kRW5hYmxlZFwiOiB0cnVlLCBcInZvaWNlVm9sdW1lXCI6IDEwMCwgXCJiZ21Wb2x1bWVcIjogMTAwLCBcInNlVm9sdW1lXCI6IDEwMCwgXCJtZXNzYWdlU3BlZWRcIjogNCwgXCJmdWxsU2NyZWVuXCI6IG5vLCBcImFzcGVjdFJhdGlvXCI6IDAgfVxuICAgICAgICBAc2F2ZUdhbWVTbG90cyA9IFtdXG4gICAgICAgIGZvciBpIGluIFswLi4uQHNhdmVTbG90Q291bnRdXG4gICAgICAgICAgICBHYW1lU3RvcmFnZS5yZW1vdmUoXCJTYXZlR2FtZV8je2l9X0hlYWRlclwiKVxuICAgICAgICAgICAgR2FtZVN0b3JhZ2UucmVtb3ZlKFwiU2F2ZUdhbWVfI3tpfVwiKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAc2F2ZUdhbWVTbG90cy5wdXNoKHsgXCJkYXRlXCI6IFwiXCIsIFwiY2hhcHRlclwiOiBcIlwiLCBcInNjZW5lXCI6IFwiXCIsIFwidGh1bWJcIjogXCJcIiB9KVxuICAgICAgIFxuICAgICAgICBHYW1lU3RvcmFnZS5zZXRPYmplY3QoXCJzZXR0aW5nc1wiLCBAc2V0dGluZ3MpXG4gICAgICAgIEBnbG9iYWxEYXRhID0geyBtZXNzYWdlczoge30sIGNnR2FsbGVyeToge30gfVxuICAgICAgICBHYW1lU3RvcmFnZS5zZXRPYmplY3QoXCJnbG9iYWxEYXRhXCIsIEBnbG9iYWxEYXRhKVxuICAgIFxuICAgICMjIypcbiAgICAqIFNhdmVzIGN1cnJlbnQgZ2FtZSBzZXR0aW5ncy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNhdmVTZXR0aW5nc1xuICAgICMjIyAgICAgXG4gICAgc2F2ZVNldHRpbmdzOiAtPlxuICAgICAgICBHYW1lU3RvcmFnZS5zZXRPYmplY3QoXCJzZXR0aW5nc1wiLCBAc2V0dGluZ3MpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFNhdmVzIGN1cnJlbnQgZ2xvYmFsIGRhdGEuXG4gICAgKlxuICAgICogQG1ldGhvZCBzYXZlR2xvYmFsRGF0YVxuICAgICMjIyAgXG4gICAgc2F2ZUdsb2JhbERhdGE6IC0+XG4gICAgICAgIEBnbG9iYWxEYXRhLnBlcnNpc3RlbnROdW1iZXJzID0gQHZhcmlhYmxlU3RvcmUucGVyc2lzdGVudE51bWJlcnNcbiAgICAgICAgQGdsb2JhbERhdGEucGVyc2lzdGVudFN0cmluZ3MgPSBAdmFyaWFibGVTdG9yZS5wZXJzaXN0ZW50U3RyaW5nc1xuICAgICAgICBAZ2xvYmFsRGF0YS5wZXJzaXN0ZW50Qm9vbGVhbnMgPSBAdmFyaWFibGVTdG9yZS5wZXJzaXN0ZW50Qm9vbGVhbnNcbiAgICAgICAgR2FtZVN0b3JhZ2Uuc2V0T2JqZWN0KFwiZ2xvYmFsRGF0YVwiLCBAZ2xvYmFsRGF0YSlcbiAgICAgXG4gICAgIyMjKlxuICAgICogUmVzZXRzIGN1cnJlbnQgZ2xvYmFsIGRhdGEuIEFsbCBzdG9yZWQgZGF0YSBhYm91dCByZWFkIG1lc3NhZ2VzLCBwZXJzaXN0ZW50IHZhcmlhYmxlcyBhbmRcbiAgICAqIENHIGdhbGxlcnkgd2lsbCBiZSBkZWxldGVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzZXRHbG9iYWxEYXRhXG4gICAgIyMjICAgICBcbiAgICByZXNldEdsb2JhbERhdGE6IC0+XG4gICAgICAgIEBnbG9iYWxEYXRhID0geyBtZXNzYWdlczoge30sIGNnR2FsbGVyeToge30gfVxuICAgICAgICBcbiAgICAgICAgZm9yIGNnLCBpIGluIFJlY29yZE1hbmFnZXIuY2dHYWxsZXJ5QXJyYXlcbiAgICAgICAgICAgIGlmIGNnP1xuICAgICAgICAgICAgICAgIEBnbG9iYWxEYXRhLmNnR2FsbGVyeVtjZy5pbmRleF0gPSB7IHVubG9ja2VkOiBubyB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIEdhbWVTdG9yYWdlLnNldE9iamVjdChcImdsb2JhbERhdGFcIiwgQGdsb2JhbERhdGEpIFxuICAgICBcbiAgICAgXG4gICAgcmVhZFNhdmVHYW1lOiAoc2F2ZUdhbWUpIC0+XG4gICAgd3JpdGVTYXZlR2FtZTogKHNhdmVHYW1lKSAtPlxuICAgICAgICBcbiAgICBwcmVwYXJlU2F2ZUdhbWU6IChzbmFwc2hvdCkgLT5cbiAgICAgICAgaWYgc25hcHNob3RcbiAgICAgICAgICAgIHNuYXBzaG90ID0gUmVzb3VyY2VNYW5hZ2VyLmdldEN1c3RvbUJpdG1hcChcIiRzbmFwc2hvdFwiKVxuICAgICAgICAgICAgc25hcHNob3Q/LmRpc3Bvc2UoKVxuICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLnNldEN1c3RvbUJpdG1hcChcIiRzbmFwc2hvdFwiLCBHcmFwaGljcy5zbmFwc2hvdCgpKVxuICAgICAgICBcbiAgICAgICAgY29udGV4dCA9IG5ldyBncy5PYmplY3RDb2RlY0NvbnRleHQoKVxuICAgICAgICBjb250ZXh0LmRlY29kZWRPYmplY3RTdG9yZS5wdXNoKEdyYXBoaWNzLnZpZXdwb3J0KVxuICAgICAgICBjb250ZXh0LmRlY29kZWRPYmplY3RTdG9yZS5wdXNoKEBzY2VuZSlcbiAgICAgICAgY29udGV4dC5kZWNvZGVkT2JqZWN0U3RvcmUucHVzaChAc2NlbmUuYmVoYXZpb3IpXG4gIFxuICAgICAgICBtZXNzYWdlQm94SWRzID0gW1wibWVzc2FnZUJveFwiLCBcIm52bE1lc3NhZ2VCb3hcIiwgXCJtZXNzYWdlTWVudVwiXTtcbiAgICAgICAgbWVzc2FnZUlkcyA9IFtcImdhbWVNZXNzYWdlX21lc3NhZ2VcIiwgXCJnYW1lTWVzc2FnZU5WTF9tZXNzYWdlXCJdO1xuICAgICAgICBtZXNzYWdlQm94ZXMgPSBtZXNzYWdlQm94SWRzLnNlbGVjdCAoaWQpID0+IEBzY2VuZS5iZWhhdmlvci5vYmplY3RNYW5hZ2VyLm9iamVjdEJ5SWQoaWQpXG4gICAgICAgIG1lc3NhZ2VzID0gbWVzc2FnZUlkcy5zZWxlY3QgKGlkKSA9PiBAc2NlbmUuYmVoYXZpb3Iub2JqZWN0TWFuYWdlci5vYmplY3RCeUlkKGlkKVxuICBcbiAgICAgICAgc2NlbmVEYXRhID0ge31cbiAgICAgICAgc2F2ZUdhbWUgPSB7fVxuICAgICAgICBzYXZlR2FtZS5lbmNvZGVkT2JqZWN0U3RvcmUgPSBudWxsXG4gICAgICAgIHNhdmVHYW1lLnNjZW5lVWlkID0gQHNjZW5lLnNjZW5lRG9jdW1lbnQudWlkXG4gICAgICAgIHNhdmVHYW1lLmRhdGEgPSB7XG4gICAgICAgICAgICByZXNvdXJjZUNvbnRleHQ6IEBzY2VuZS5iZWhhdmlvci5yZXNvdXJjZUNvbnRleHQudG9EYXRhQnVuZGxlKCksXG4gICAgICAgICAgICBjdXJyZW50Q2hhcmFjdGVyOiBAc2NlbmUuY3VycmVudENoYXJhY3RlcixcbiAgICAgICAgICAgIGZyYW1lQ291bnQ6IEdyYXBoaWNzLmZyYW1lQ291bnQsXG4gICAgICAgICAgICB0ZW1wRmllbGRzOiBAdGVtcEZpZWxkcyxcbiAgICAgICAgICAgIHZpZXdwb3J0OiBAc2NlbmUudmlld3BvcnQsXG4gICAgICAgICAgICBjaGFyYWN0ZXJzOiBAc2NlbmUuY2hhcmFjdGVycyxcbiAgICAgICAgICAgIGNoYXJhY3Rlck5hbWVzOiBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNBcnJheS5zZWxlY3QoKGMpIC0+IHsgbmFtZTogYy5uYW1lLCBpbmRleDogYy5pbmRleCB9KSxcbiAgICAgICAgICAgIGJhY2tncm91bmRzOiBAc2NlbmUuYmFja2dyb3VuZHMsXG4gICAgICAgICAgICBwaWN0dXJlczogQHNjZW5lLnBpY3R1cmVDb250YWluZXIuc3ViT2JqZWN0c0J5RG9tYWluLFxuICAgICAgICAgICAgdGV4dHM6IEBzY2VuZS50ZXh0Q29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpbixcbiAgICAgICAgICAgIHZpZGVvczogQHNjZW5lLnZpZGVvQ29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpbixcbiAgICAgICAgICAgIHZpZXdwb3J0czogQHNjZW5lLnZpZXdwb3J0Q29udGFpbmVyLnN1Yk9iamVjdHMsXG4gICAgICAgICAgICBjb21tb25FdmVudHM6IEBzY2VuZS5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzLFxuICAgICAgICAgICAgaG90c3BvdHM6IEBzY2VuZS5ob3RzcG90Q29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpbixcbiAgICAgICAgICAgIGludGVycHJldGVyOiBAc2NlbmUuaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBtZXNzYWdlQm94ZXM6IG1lc3NhZ2VCb3hlcy5zZWxlY3QoKG1iLCBpKSA9PiB7IHZpc2libGU6IG1iLnZpc2libGUsIGlkOiBtYi5pZCwgbWVzc2FnZTogbWVzc2FnZXNbaV0gfSksXG4gICAgICAgICAgICBiYWNrbG9nOiBAYmFja2xvZyxcbiAgICAgICAgICAgIHZhcmlhYmxlU3RvcmU6IEB2YXJpYWJsZVN0b3JlLFxuICAgICAgICAgICAgZGVmYXVsdHM6IEBkZWZhdWx0cyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EYXRhOiBTY2VuZU1hbmFnZXIudHJhbnNpdGlvbkRhdGEsXG4gICAgICAgICAgICBhdWRpbzogeyBhdWRpb0J1ZmZlcnM6IEF1ZGlvTWFuYWdlci5hdWRpb0J1ZmZlcnMsIGF1ZGlvQnVmZmVyc0J5TGF5ZXI6IEF1ZGlvTWFuYWdlci5hdWRpb0J1ZmZlcnNCeUxheWVyLCBhdWRpb0xheWVyczogQXVkaW9NYW5hZ2VyLmF1ZGlvTGF5ZXJzLCBzb3VuZFJlZmVyZW5jZXM6IEF1ZGlvTWFuYWdlci5zb3VuZFJlZmVyZW5jZXMgfSxcbiAgICAgICAgICAgIG1lc3NhZ2VBcmVhczogQHNjZW5lLm1lc3NhZ2VBcmVhQ29udGFpbmVyLnN1Yk9iamVjdHNCeURvbWFpblxuICAgICAgICAgICMgIG1lc3NhZ2VBcmVhczogQHNjZW5lLm1lc3NhZ2VBcmVhcy5zZWxlY3QgKGYpIC0+XG4gICAgICAgICAgIyAgICAgIGlmIGYgXG4gICAgICAgICAgIyAgICAgICAgICB7IFxuICAgICAgICAgICMgICAgICAgICAgICAgIG1lc3NhZ2U6IGYubWVzc2FnZSwgXG4gICAgICAgICAgIyAgICAgICAgICAgICAgbGF5b3V0OiB7IGRzdFJlY3Q6IGdzLlJlY3QuZnJvbU9iamVjdChmLmxheW91dC5kc3RSZWN0KSB9IFxuICAgICAgICAgICMgICAgICAgICAgfSBcbiAgICAgICAgICAjICAgICAgZWxzZSBcbiAgICAgICAgICAjICAgICAgICAgIG51bGxcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgI3NzID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgICAgIHNhdmVHYW1lLmRhdGEgPSBncy5PYmplY3RDb2RlYy5lbmNvZGUoc2F2ZUdhbWUuZGF0YSwgY29udGV4dClcbiAgICAgICAgI2NvbnNvbGUubG9nKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAtIHNzKVxuICAgICAgICBzYXZlR2FtZS5lbmNvZGVkT2JqZWN0U3RvcmUgPSBjb250ZXh0LmVuY29kZWRPYmplY3RTdG9yZVxuXG4gICAgICAgIEBzYXZlR2FtZSA9IHNhdmVHYW1lXG4gICAgICBcbiAgICBjcmVhdGVTYXZlR2FtZVNsb3Q6IChoZWFkZXIpIC0+XG4gICAgICAgIHNsb3QgPSB7XG4gICAgICAgICAgICBcImRhdGVcIjogbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKSxcbiAgICAgICAgICAgIFwiY2hhcHRlclwiOiBAc2NlbmUuY2hhcHRlci5pdGVtcy5uYW1lLFxuICAgICAgICAgICAgXCJzY2VuZVwiOiBAc2NlbmUuc2NlbmVEb2N1bWVudC5pdGVtcy5uYW1lLFxuICAgICAgICAgICAgXCJpbWFnZVwiOiBoZWFkZXIuaW1hZ2VcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNsb3Q7XG4gICAgICAgIFxuICAgIGNyZWF0ZVNhdmVHYW1lSGVhZGVyOiAodGh1bWJXaWR0aCwgdGh1bWJIZWlnaHQpIC0+XG4gICAgICAgIHRodW1iSW1hZ2UgPSBAY3JlYXRlU2F2ZUdhbWVUaHVtYkltYWdlKHRodW1iV2lkdGgsIHRodW1iSGVpZ2h0KVxuICAgICAgICBcbiAgICAgICAgaGVhZGVyID0ge1xuICAgICAgICAgICAgXCJkYXRlXCI6IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCksXG4gICAgICAgICAgICBcImNoYXB0ZXJVaWRcIjogQHNjZW5lLmNoYXB0ZXIudWlkLFxuICAgICAgICAgICAgXCJzY2VuZVVpZFwiOiBAc2NlbmUuc2NlbmVEb2N1bWVudC51aWQsXG4gICAgICAgICAgICBcImltYWdlXCI6IHRodW1iSW1hZ2U/LmltYWdlLnRvRGF0YVVSTCgpIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aHVtYkltYWdlPy5kaXNwb3NlKClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBoZWFkZXJcbiAgICAgICAgXG4gICAgY3JlYXRlU2F2ZUdhbWVUaHVtYkltYWdlOiAod2lkdGgsIGhlaWdodCkgLT5cbiAgICAgICAgc25hcHNob3QgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiJHNuYXBzaG90XCIpXG4gICAgICAgIHRodW1iSW1hZ2UgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBpZiBzbmFwc2hvdFxuICAgICAgICAgICAgaWYgd2lkdGggYW5kIGhlaWdodFxuICAgICAgICAgICAgICAgIHRodW1iSW1hZ2UgPSBuZXcgQml0bWFwKHdpZHRoLCBoZWlnaHQpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGh1bWJJbWFnZSA9IG5ldyBCaXRtYXAoR3JhcGhpY3Mud2lkdGggLyA4LCBHcmFwaGljcy5oZWlnaHQgLyA4KVxuICAgICAgICAgICAgdGh1bWJJbWFnZS5zdHJldGNoQmx0KG5ldyBSZWN0KDAsIDAsIHRodW1iSW1hZ2Uud2lkdGgsIHRodW1iSW1hZ2UuaGVpZ2h0KSwgc25hcHNob3QsIG5ldyBSZWN0KDAsIDAsIHNuYXBzaG90LndpZHRoLCBzbmFwc2hvdC5oZWlnaHQpKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiB0aHVtYkltYWdlXG4gICAgICBcbiAgICBzdG9yZVNhdmVHYW1lOiAobmFtZSwgc2F2ZUdhbWUsIGhlYWRlcikgLT5cbiAgICAgICAgaWYgaGVhZGVyXG4gICAgICAgICAgICBHYW1lU3RvcmFnZS5zZXREYXRhKFwiI3tuYW1lfV9IZWFkZXJcIiwgSlNPTi5zdHJpbmdpZnkoaGVhZGVyKSlcbiAgICAgICAgICAgIFxuICAgICAgICBHYW1lU3RvcmFnZS5zZXREYXRhKG5hbWUsIEpTT04uc3RyaW5naWZ5KHNhdmVHYW1lKSlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU2F2ZXMgdGhlIGN1cnJlbnQgZ2FtZSBhdCB0aGUgc3BlY2lmaWVkIHNsb3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBzYXZlXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc2xvdCAtIFRoZSBzbG90IHdoZXJlIHRoZSBnYW1lIHNob3VsZCBiZSBzYXZlZCBhdC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aHVtYldpZHRoIC0gVGhlIHdpZHRoIGZvciB0aGUgc25hcHNob3QtdGh1bWIuIFlvdSBjYW4gc3BlY2lmeSA8Yj5udWxsPC9iPiBvciAwIHRvIHVzZSBhbiBhdXRvIGNhbGN1bGF0ZWQgd2lkdGguXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdGh1bWJIZWlnaHQgLSBUaGUgaGVpZ2h0IGZvciB0aGUgc25hcHNob3QtdGh1bWIuIFlvdSBjYW4gc3BlY2lmeSA8Yj5udWxsPC9iPiBvciAwIHRvIHVzZSBhbiBhdXRvIGNhbGN1bGF0ZWQgaGVpZ2h0LlxuICAgICMjIyAgICAgXG4gICAgc2F2ZTogKHNsb3QsIHRodW1iV2lkdGgsIHRodW1iSGVpZ2h0KSAtPlxuICAgICAgICBpZiBAc2F2ZUdhbWVcbiAgICAgICAgICAgIGhlYWRlciA9IEBjcmVhdGVTYXZlR2FtZUhlYWRlcih0aHVtYldpZHRoLCB0aHVtYkhlaWdodClcbiAgICAgICAgICAgIEBzYXZlR2FtZVNsb3RzW3Nsb3RdID0gQGNyZWF0ZVNhdmVHYW1lU2xvdChoZWFkZXIpXG4gICAgICAgICAgICBAc3RvcmVTYXZlR2FtZShcIlNhdmVHYW1lXyN7c2xvdH1cIiwgQHNhdmVHYW1lLCBoZWFkZXIpXG4gICAgICAgICAgICBAc2NlbmVEYXRhID0ge31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIEBzYXZlR2FtZVxuICAgIFxuICAgIHJlc3RvcmU6IChzYXZlR2FtZSkgLT5cbiAgICAgICAgQGJhY2tsb2cgPSBzYXZlR2FtZS5kYXRhLmJhY2tsb2dcbiAgICAgICAgQGRlZmF1bHRzID0gc2F2ZUdhbWUuZGF0YS5kZWZhdWx0c1xuICAgICAgICBAdmFyaWFibGVTdG9yZSA9IHNhdmVHYW1lLmRhdGEudmFyaWFibGVTdG9yZVxuICAgICAgICBAc2NlbmVEYXRhID0gc2F2ZUdhbWUuZGF0YVxuICAgICAgICBAc2F2ZUdhbWUgPSBudWxsXG4gICAgICAgIEBsb2FkZWRTYXZlR2FtZSA9IG51bGxcbiAgICAgICAgQHRlbXBGaWVsZHMgPSBzYXZlR2FtZS5kYXRhLnRlbXBGaWVsZHNcbiAgICAgICAgd2luZG93LiR0ZW1wRmllbGRzID0gQHRlbXBGaWVsZHNcbiAgICAgICAgd2luZG93LiRkYXRhRmllbGRzLmJhY2tsb2cgPSBAYmFja2xvZ1xuICAgICAgICAgICAgXG4gICAgXG4gICAgcHJlcGFyZUxvYWRHYW1lOiAtPlxuICAgICAgICBBdWRpb01hbmFnZXIuc3RvcEFsbE11c2ljKDMwKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyB0aGUgZ2FtZSBmcm9tIHRoZSBzcGVjaWZpZWQgc2F2ZSBnYW1lIHNsb3QuIFRoaXMgbWV0aG9kIHRyaWdnZXJzXG4gICAgKiBhIGF1dG9tYXRpYyBzY2VuZSBjaGFuZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc2xvdCAtIFRoZSBzbG90IHdoZXJlIHRoZSBnYW1lIHNob3VsZCBiZSBsb2FkZWQgZnJvbS5cbiAgICAjIyMgICAgICAgIFxuICAgIGxvYWQ6IChzbG90KSAtPlxuICAgICAgICByZXR1cm4gaWYgIUBzYXZlR2FtZVNsb3RzW3Nsb3RdIG9yIEBzYXZlR2FtZVNsb3RzW3Nsb3RdLmRhdGUudHJpbSgpLmxlbmd0aCA9PSAwXG4gICAgICAgIFxuICAgICAgICBAcHJlcGFyZUxvYWRHYW1lKClcbiAgICAgICAgQGxvYWRlZFNhdmVHYW1lID0gQGxvYWRTYXZlR2FtZShcIlNhdmVHYW1lXyN7c2xvdH1cIilcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBTY2VuZU1hbmFnZXIuc3dpdGNoVG8obmV3IHZuLk9iamVjdF9TY2VuZSgpKVxuICAgICAgICBTY2VuZU1hbmFnZXIuY2xlYXIoKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgbG9hZFNhdmVHYW1lOiAobmFtZSkgLT4gSlNPTi5wYXJzZShHYW1lU3RvcmFnZS5nZXREYXRhKG5hbWUpKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgc2F2ZSBnYW1lIGRhdGEgZm9yIGEgc3BlY2lmaWVkIHNsb3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBnZXRTYXZlR2FtZVxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNsb3QgLSBUaGUgc2xvdCB0byBnZXQgdGhlIHNhdmUgZGF0YSBmcm9tLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgc2F2ZSBnYW1lIGRhdGEuXG4gICAgIyMjICAgICAgICBcbiAgICBnZXRTYXZlR2FtZTogKHNsb3QpIC0+IEpTT04ucGFyc2UoR2FtZVN0b3JhZ2UuZ2V0RGF0YShcIlNhdmVHYW1lXyN7c2xvdH1cIikpXG4gICAgXG53aW5kb3cuR2FtZU1hbmFnZXIgPSBuZXcgR2FtZU1hbmFnZXIoKVxuZ3MuR2FtZU1hbmFnZXIgPSB3aW5kb3cuR2FtZU1hbmFnZXIiXX0=
//# sourceURL=GameManager_27.js