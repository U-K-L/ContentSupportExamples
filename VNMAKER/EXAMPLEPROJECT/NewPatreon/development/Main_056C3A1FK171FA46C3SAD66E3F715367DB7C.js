var Main;

Main = (function() {

  /**
  * Controls the boot-process of the game.
  *
  * @module gs
  * @class Main
  * @memberof gs
  * @constructor
   */
  function Main() {
    window.$ = jQuery.noConflict();
    this.languagesLoaded = false;
    this.frameCallback = null;
  }


  /**
  * Updates the current frame.
  *
  * @method updateFrame
   */

  Main.prototype.updateFrame = function() {
    if ($PARAMS.showDebugInfo) {
      window.startTime = window.performance != null ? window.performance.now() : Date.now();
    }
    SceneManager.update();
    Graphics.frameCount++;
    if ($PARAMS.showDebugInfo) {
      if (this.debugSprite == null) {
        this.debugSprite = new Sprite_Debug();
      }
      window.endTime = window.performance != null ? window.performance.now() : Date.now();
      if (Graphics.frameCount % 30 === 0) {
        this.debugSprite.frameTime = endTime - startTime;
        return this.debugSprite.redraw();
      }
    }
  };


  /**
  * Loads game data.
  *
  * @method loadData
   */

  Main.prototype.loadData = function() {
    RecordManager.load();
    DataManager.getDocumentsByType("global_variables");
    DataManager.getDocumentsByType("language_profile");
    return DataManager.getDocumentsByType("vn.chapter");
  };


  /**
  * Loads system data.
  *
  * @method loadSystemData
   */

  Main.prototype.loadSystemData = function() {
    DataManager.getDocument("RESOURCES");
    return DataManager.getDocument("SUMMARIES");
  };


  /**
  * Loads system resources such as graphics, sounds, fonts, etc.
  *
  * @method loadSystemResources
   */

  Main.prototype.loadSystemResources = function() {
    var j, language, len, ref, ref1, ref2;
    ResourceManager.loadFonts();
    ResourceLoader.loadSystemSounds(RecordManager.system);
    ResourceLoader.loadSystemGraphics(RecordManager.system);
    ref = LanguageManager.languages;
    for (j = 0, len = ref.length; j < len; j++) {
      language = ref[j];
      if (((ref1 = language.icon) != null ? (ref2 = ref1.name) != null ? ref2.length : void 0 : void 0) > 0) {
        ResourceManager.getBitmap("Graphics/Icons/" + language.icon.name);
      }
    }
    return gs.Fonts.initialize();
  };


  /**
  * Gets game settings.
  *
  * @method getSettings
   */

  Main.prototype.getSettings = function() {
    var settings;
    settings = GameStorage.getObject("settings");
    if ((settings == null) || settings.version !== 338) {
      GameManager.resetSettings();
      settings = GameManager.settings;
    }
    return settings;
  };


  /**
  * Sets up game settings.
  *
  * @method setupGameSettings
  * @param {Object} settings - Current game settings.
   */

  Main.prototype.setupGameSettings = function(settings) {
    var cg, character, i, j, l, len, len1, ref, ref1, results;
    GameManager.globalData = GameStorage.getObject("globalData");
    GameManager.settings = settings;
    GameManager.settings.fullScreen = Graphics.isFullscreen();
    ref = RecordManager.charactersArray;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      character = ref[i];
      if (character && !GameManager.settings.voicesByCharacter[character.index]) {
        GameManager.settings.voicesByCharacter[character.index] = 100;
      }
    }
    ref1 = RecordManager.cgGalleryArray;
    results = [];
    for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
      cg = ref1[i];
      if ((cg != null) && !GameManager.globalData.cgGallery[cg.index]) {
        results.push(GameManager.globalData.cgGallery[cg.index] = {
          unlocked: false
        });
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up audio settings.
  *
  * @method setupAudioSettings
  * @param {Object} settings - Current game settings.
   */

  Main.prototype.setupAudioSettings = function(settings) {
    AudioManager.generalSoundVolume = settings.seVolume;
    AudioManager.generalMusicVolume = settings.bgmVolume;
    return AudioManager.generalVoiceVolume = settings.voiceVolume;
  };


  /**
  * Sets up video settings.
  *
  * @method setupVideoSettings
  * @param {Object} settings - Current game settings.
   */

  Main.prototype.setupVideoSettings = function(settings) {
    settings.renderer = 1;
    Graphics.keepRatio = !settings.adjustAspectRatio;
    return Graphics.onResize();
  };


  /**
  * Sets up settings.
  *
  * @method setupSettings
   */

  Main.prototype.setupSettings = function() {
    var settings;
    settings = this.getSettings();
    this.setupGameSettings(settings);
    this.setupAudioSettings(settings);
    this.setupVideoSettings(settings);
    return GameStorage.setObject("settings", settings);
  };


  /**
  * Loads all system resources needed to start the actual game.
  *
  * @method load
  * @param {Function} callback - Called when all system resources are loaded.
   */

  Main.prototype.load = function(callback) {
    this.loadSystemData();
    return DataManager.events.on("loaded", (function(_this) {
      return function() {
        GameManager.tempFields = new gs.GameTemp();
        window.$tempFields = GameManager.tempFields;
        if (_this.languagesLoaded) {
          RecordManager.initialize();
          LanguageManager.initialize();
          SceneManager.initialize();
          _this.setupSettings();
        } else {
          _this.loadData();
        }
        if (_this.languagesLoaded) {
          _this.loadSystemResources();
          DataManager.events.off("loaded");
          ResourceManager.events.on("loaded", function() {
            GameManager.setupCursor();
            ResourceManager.events.off("loaded");
            ui.UIManager.setup();
            return callback();
          });
        }
        return _this.languagesLoaded = true;
      };
    })(this));
  };


  /**
  * Sets up the application.
  *
  * @method setupApplication
   */

  Main.prototype.setupApplication = function() {
    $PARAMS.showDebugInfo = false;
    window.ResourceManager = new window.ResourceManager();
    window.DataManager = new window.DataManager();
    window.Graphics = new Graphics_OpenGL();
    window.gs.Graphics = window.Graphics;
    window.Renderer = window.Renderer_OpenGL;
    return Texture2D.filter = 1;
  };


  /**
  * Initializes the input system to enable support for keyboard, mouse, touch, etc.
  *
  * @method setupInput
   */

  Main.prototype.setupInput = function() {
    Input.initialize();
    return Input.Mouse.initialize();
  };


  /**
  * Initializes the video system with the game's resolution. It is necessary to
  * call this method before using graphic object such as bitmaps, sprites, etc.
  *
  * @method setupVideo
   */

  Main.prototype.setupVideo = function() {
    this.frameCallback = this.createFrameCallback();
    Graphics.initialize($PARAMS.resolution.width, $PARAMS.resolution.height);
    Graphics.onDispose = (function(_this) {
      return function() {
        return ResourceManager.dispose();
      };
    })(this);
    Graphics.formats = [320, 384, 427];
    Graphics.scale = 0.5 / 240 * Graphics.height;
    Font.defaultSize = Math.round(9 / 240 * Graphics.height);
    return Graphics.onEachFrame(this.frameCallback);
  };


  /**
  * Registers shader-based effects. It is important to register all effects
  * before the graphics system is initialized.
  *
  * @method setupEffects
   */

  Main.prototype.setupEffects = function() {
    gs.Effect.registerEffect(gs.Effect.fragmentShaderInfos.lod_blur);
    return gs.Effect.registerEffect(gs.Effect.fragmentShaderInfos.pixelate);
  };


  /**
  * Initializes the Live2D. If Live2D is not available, it does nothing. Needs to be
  * called before using Live2D.
  *
  * @method setupLive2D
   */

  Main.prototype.setupLive2D = function() {
    Live2D.init();
    Live2D.setGL($gl);
    return Live2DFramework.setPlatformManager(new L2DPlatformManager());
  };


  /**
  * Creates the frame-callback function called once per frame to update and render
  * the game.
  *
  * @method setupLive2D
  * @return {Function} The frame-callback function.
   */

  Main.prototype.createFrameCallback = function() {
    var callback;
    callback = null;
    if (($PARAMS.preview != null) || window.parent !== window) {
      callback = (function(_this) {
        return function(time) {
          var ex;
          try {
            return _this.updateFrame();
          } catch (error) {
            ex = error;
            if ($PARAMS.preview || GameManager.inLivePreview) {
              $PARAMS.preview = {
                error: ex
              };
            }
            return console.log(ex);
          }
        };
      })(this);
    } else {
      callback = (function(_this) {
        return function(time) {
          return _this.updateFrame();
        };
      })(this);
    }
    return callback;
  };


  /**
  * Creates the start scene object. If an intro-scene is set, this method returns the
  * intro-scene. If the game runs in Live-Preview, this method returns the selected
  * scene in editor.
  *
  * @method createStartScene
  * @return {gs.Object_Base} The start-scene.
   */

  Main.prototype.createStartScene = function() {
    var introScene, ref, ref1, ref2, ref3, ref4, scene;
    scene = null;
    introScene = null;
    if (RecordManager.system.useIntroScene) {
      introScene = DataManager.getDocumentSummary((ref = RecordManager.system.introInfo) != null ? (ref1 = ref.scene) != null ? ref1.uid : void 0 : void 0);
    }
    if ($PARAMS.preview || introScene) {
      scene = new vn.Object_Scene();
      scene.sceneData.uid = ((ref2 = $PARAMS.preview) != null ? ref2.scene.uid : void 0) || ((ref3 = RecordManager.system.introInfo) != null ? (ref4 = ref3.scene) != null ? ref4.uid : void 0 : void 0);
      scene.events.on("dispose", function(e) {
        return GameManager.sceneData.uid = null;
      });
    } else if (LanguageManager.languages.length > 1) {
      scene = new gs.Object_Layout("languageMenuLayout");
    } else {
      scene = new gs.Object_Layout("titleLayout");
    }
    return scene;
  };


  /**
  * Boots the game by setting up the application window as well as the video, audio and input system.
  *
  * @method start
   */

  Main.prototype.start = function() {
    this.setupApplication();
    this.setupEffects();
    this.setupVideo();
    this.setupLive2D();
    this.setupInput();
    return this.load((function(_this) {
      return function() {
        return SceneManager.switchTo(_this.createStartScene());
      };
    })(this));
  };

  return Main;

})();

gs.Main = new Main();

gs.Application.initialize();

gs.Application.onReady = function() {
  Object.keys(gs).forEach(function(k) {
    gs[k].$namespace = "gs";
    return gs[k].$name = k;
  });
  Object.keys(vn).forEach(function(k) {
    vn[k].$namespace = "vn";
    return vn[k].$name = k;
  });
  Object.keys(ui).forEach(function(k) {
    ui[k].$namespace = "ui";
    return ui[k].$name = k;
  });
  return gs.Main.start();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O0VBUWEsY0FBQTtJQUNULE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBTSxDQUFDLFVBQVAsQ0FBQTtJQUVYLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxhQUFELEdBQWlCO0VBSlI7OztBQU1iOzs7Ozs7aUJBS0EsV0FBQSxHQUFhLFNBQUE7SUFDVCxJQUFHLE9BQU8sQ0FBQyxhQUFYO01BQ0ksTUFBTSxDQUFDLFNBQVAsR0FBc0IsMEJBQUgsR0FBNEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFuQixDQUFBLENBQTVCLEdBQTBELElBQUksQ0FBQyxHQUFMLENBQUEsRUFEakY7O0lBR0EsWUFBWSxDQUFDLE1BQWIsQ0FBQTtJQUNBLFFBQVEsQ0FBQyxVQUFUO0lBRUEsSUFBRyxPQUFPLENBQUMsYUFBWDtNQUNJLElBQU8sd0JBQVA7UUFBMEIsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxZQUFBLENBQUEsRUFBN0M7O01BRUEsTUFBTSxDQUFDLE9BQVAsR0FBb0IsMEJBQUgsR0FBNEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFuQixDQUFBLENBQTVCLEdBQTBELElBQUksQ0FBQyxHQUFMLENBQUE7TUFDM0UsSUFBRyxRQUFRLENBQUMsVUFBVCxHQUFzQixFQUF0QixLQUE0QixDQUEvQjtRQUNJLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixHQUEwQixPQUFBLEdBQVU7ZUFDcEMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQUEsRUFGSjtPQUpKOztFQVBTOzs7QUFlYjs7Ozs7O2lCQUtBLFFBQUEsR0FBVSxTQUFBO0lBQ04sYUFBYSxDQUFDLElBQWQsQ0FBQTtJQUNBLFdBQVcsQ0FBQyxrQkFBWixDQUErQixrQkFBL0I7SUFDQSxXQUFXLENBQUMsa0JBQVosQ0FBK0Isa0JBQS9CO1dBQ0Es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QyxJQUFQLENBQVksRUFBWixDQUFlLENBQUMsT0FBaEIsQ0FBd0IsU0FBQyxDQUFEO0lBQU8sRUFBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLFVBQU4sR0FBbUI7V0FBTSxFQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTixHQUFjO0VBQTlDLENBQXhCO0VBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxFQUFaLENBQWUsQ0FBQyxPQUFoQixDQUF3QixTQUFDLENBQUQ7SUFBTyxFQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsVUFBTixHQUFtQjtXQUFNLEVBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFOLEdBQWM7RUFBOUMsQ0FBeEI7RUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVosQ0FBZSxDQUFDLE9BQWhCLENBQXdCLFNBQUMsQ0FBRDtJQUFPLEVBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUFOLEdBQW1CO1dBQU0sRUFBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU4sR0FBYztFQUE5QyxDQUF4QjtTQUVBLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBUixDQUFBO0FBTnFCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBNYWluXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBFbnRyeSBwb2ludCBvZiB5b3VyIGdhbWUuXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIE1haW5cbiAgICAjIyMqXG4gICAgKiBDb250cm9scyB0aGUgYm9vdC1wcm9jZXNzIG9mIHRoZSBnYW1lLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBNYWluXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICB3aW5kb3cuJCA9IGpRdWVyeS5ub0NvbmZsaWN0KClcbiAgICAgICAgXG4gICAgICAgIEBsYW5ndWFnZXNMb2FkZWQgPSBub1xuICAgICAgICBAZnJhbWVDYWxsYmFjayA9IG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlRnJhbWVcbiAgICAjIyNcbiAgICB1cGRhdGVGcmFtZTogLT5cbiAgICAgICAgaWYgJFBBUkFNUy5zaG93RGVidWdJbmZvXG4gICAgICAgICAgICB3aW5kb3cuc3RhcnRUaW1lID0gaWYgd2luZG93LnBlcmZvcm1hbmNlPyB0aGVuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSBlbHNlIERhdGUubm93KClcbiAgICAgICAgICAgXG4gICAgICAgIFNjZW5lTWFuYWdlci51cGRhdGUoKVxuICAgICAgICBHcmFwaGljcy5mcmFtZUNvdW50KytcbiAgICAgICAgXG4gICAgICAgIGlmICRQQVJBTVMuc2hvd0RlYnVnSW5mb1xuICAgICAgICAgICAgaWYgbm90IEBkZWJ1Z1Nwcml0ZT8gdGhlbiBAZGVidWdTcHJpdGUgPSBuZXcgU3ByaXRlX0RlYnVnKClcbiAgICAgIFxuICAgICAgICAgICAgd2luZG93LmVuZFRpbWUgPSBpZiB3aW5kb3cucGVyZm9ybWFuY2U/IHRoZW4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIGVsc2UgRGF0ZS5ub3coKVxuICAgICAgICAgICAgaWYgR3JhcGhpY3MuZnJhbWVDb3VudCAlIDMwID09IDBcbiAgICAgICAgICAgICAgICBAZGVidWdTcHJpdGUuZnJhbWVUaW1lID0gKGVuZFRpbWUgLSBzdGFydFRpbWUpXG4gICAgICAgICAgICAgICAgQGRlYnVnU3ByaXRlLnJlZHJhdygpXG4gICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgZ2FtZSBkYXRhLlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZERhdGFcbiAgICAjIyNcbiAgICBsb2FkRGF0YTogLT5cbiAgICAgICAgUmVjb3JkTWFuYWdlci5sb2FkKClcbiAgICAgICAgRGF0YU1hbmFnZXIuZ2V0RG9jdW1lbnRzQnlUeXBlKFwiZ2xvYmFsX3ZhcmlhYmxlc1wiKVxuICAgICAgICBEYXRhTWFuYWdlci5nZXREb2N1bWVudHNCeVR5cGUoXCJsYW5ndWFnZV9wcm9maWxlXCIpXG4gICAgICAgIERhdGFNYW5hZ2VyLmdldERvY3VtZW50c0J5VHlwZShcInZuLmNoYXB0ZXJcIilcbiAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyBzeXN0ZW0gZGF0YS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRTeXN0ZW1EYXRhXG4gICAgIyMjICAgIFxuICAgIGxvYWRTeXN0ZW1EYXRhOiAtPlxuICAgICAgICBEYXRhTWFuYWdlci5nZXREb2N1bWVudChcIlJFU09VUkNFU1wiKVxuICAgICAgICBEYXRhTWFuYWdlci5nZXREb2N1bWVudChcIlNVTU1BUklFU1wiKVxuICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIHN5c3RlbSByZXNvdXJjZXMgc3VjaCBhcyBncmFwaGljcywgc291bmRzLCBmb250cywgZXRjLlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZFN5c3RlbVJlc291cmNlc1xuICAgICMjIyAgICAgXG4gICAgbG9hZFN5c3RlbVJlc291cmNlczogLT5cbiAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmxvYWRGb250cygpXG4gICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRTeXN0ZW1Tb3VuZHMoUmVjb3JkTWFuYWdlci5zeXN0ZW0pXG4gICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRTeXN0ZW1HcmFwaGljcyhSZWNvcmRNYW5hZ2VyLnN5c3RlbSlcbiAgICAgICAgXG4gICAgICAgIGZvciBsYW5ndWFnZSBpbiBMYW5ndWFnZU1hbmFnZXIubGFuZ3VhZ2VzXG4gICAgICAgICAgICBpZiBsYW5ndWFnZS5pY29uPy5uYW1lPy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL0ljb25zLyN7bGFuZ3VhZ2UuaWNvbi5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICBncy5Gb250cy5pbml0aWFsaXplKClcbiAgICAgXG4gICAgIyMjKlxuICAgICogR2V0cyBnYW1lIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZ2V0U2V0dGluZ3NcbiAgICAjIyMgICAgICAgIFxuICAgIGdldFNldHRpbmdzOiAtPlxuICAgICAgICBzZXR0aW5ncyA9IEdhbWVTdG9yYWdlLmdldE9iamVjdChcInNldHRpbmdzXCIpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIG5vdCBzZXR0aW5ncz8gb3Igc2V0dGluZ3MudmVyc2lvbiAhPSAzMzhcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnJlc2V0U2V0dGluZ3MoKVxuICAgICAgICAgICAgc2V0dGluZ3MgPSBHYW1lTWFuYWdlci5zZXR0aW5nc1xuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBzZXR0aW5nc1xuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdXAgZ2FtZSBzZXR0aW5ncy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwR2FtZVNldHRpbmdzXG4gICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBDdXJyZW50IGdhbWUgc2V0dGluZ3MuXG4gICAgIyMjICAgICBcbiAgICBzZXR1cEdhbWVTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgICAgICBHYW1lTWFuYWdlci5nbG9iYWxEYXRhID0gR2FtZVN0b3JhZ2UuZ2V0T2JqZWN0KFwiZ2xvYmFsRGF0YVwiKVxuICAgICAgICBHYW1lTWFuYWdlci5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgICAgIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmZ1bGxTY3JlZW4gPSBHcmFwaGljcy5pc0Z1bGxzY3JlZW4oKVxuICAgICAgICBcbiAgICAgICAgZm9yIGNoYXJhY3RlciwgaSBpbiBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNBcnJheVxuICAgICAgICAgICAgaWYgY2hhcmFjdGVyIGFuZCAhR2FtZU1hbmFnZXIuc2V0dGluZ3Mudm9pY2VzQnlDaGFyYWN0ZXJbY2hhcmFjdGVyLmluZGV4XVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNldHRpbmdzLnZvaWNlc0J5Q2hhcmFjdGVyW2NoYXJhY3Rlci5pbmRleF0gPSAxMDBcbiAgICAgICAgZm9yIGNnLCBpIGluIFJlY29yZE1hbmFnZXIuY2dHYWxsZXJ5QXJyYXlcbiAgICAgICAgICAgIGlmIGNnPyBhbmQgIUdhbWVNYW5hZ2VyLmdsb2JhbERhdGEuY2dHYWxsZXJ5W2NnLmluZGV4XVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLmdsb2JhbERhdGEuY2dHYWxsZXJ5W2NnLmluZGV4XSA9IHsgdW5sb2NrZWQ6IG5vIH0gXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBhdWRpbyBzZXR0aW5ncy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQXVkaW9TZXR0aW5nc1xuICAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzIC0gQ3VycmVudCBnYW1lIHNldHRpbmdzLlxuICAgICMjIyAgICAgXG4gICAgc2V0dXBBdWRpb1NldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgICAgIEF1ZGlvTWFuYWdlci5nZW5lcmFsU291bmRWb2x1bWUgPSBzZXR0aW5ncy5zZVZvbHVtZVxuICAgICAgICBBdWRpb01hbmFnZXIuZ2VuZXJhbE11c2ljVm9sdW1lID0gc2V0dGluZ3MuYmdtVm9sdW1lXG4gICAgICAgIEF1ZGlvTWFuYWdlci5nZW5lcmFsVm9pY2VWb2x1bWUgPSBzZXR0aW5ncy52b2ljZVZvbHVtZVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHZpZGVvIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBWaWRlb1NldHRpbmdzXG4gICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3MgLSBDdXJyZW50IGdhbWUgc2V0dGluZ3MuXG4gICAgIyMjICAgIFxuICAgIHNldHVwVmlkZW9TZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgICAgICBzZXR0aW5ncy5yZW5kZXJlciA9IDFcbiAgICAgICAgR3JhcGhpY3Mua2VlcFJhdGlvID0gIXNldHRpbmdzLmFkanVzdEFzcGVjdFJhdGlvXG4gICAgICAgIEdyYXBoaWNzLm9uUmVzaXplKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHNldHRpbmdzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBTZXR0aW5nc1xuICAgICMjIyAgICAgICAgXG4gICAgc2V0dXBTZXR0aW5nczogLT5cbiAgICAgICAgc2V0dGluZ3MgPSBAZ2V0U2V0dGluZ3MoKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgQHNldHVwR2FtZVNldHRpbmdzKHNldHRpbmdzKVxuICAgICAgICBAc2V0dXBBdWRpb1NldHRpbmdzKHNldHRpbmdzKVxuICAgICAgICBAc2V0dXBWaWRlb1NldHRpbmdzKHNldHRpbmdzKVxuXG4gICAgICAgIEdhbWVTdG9yYWdlLnNldE9iamVjdChcInNldHRpbmdzXCIsIHNldHRpbmdzKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyBhbGwgc3lzdGVtIHJlc291cmNlcyBuZWVkZWQgdG8gc3RhcnQgdGhlIGFjdHVhbCBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZFxuICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsZWQgd2hlbiBhbGwgc3lzdGVtIHJlc291cmNlcyBhcmUgbG9hZGVkLlxuICAgICMjIyAgICAgICAgICAgICAgICBcbiAgICBsb2FkOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBsb2FkU3lzdGVtRGF0YSgpXG4gICAgICAgIFxuICAgICAgICBEYXRhTWFuYWdlci5ldmVudHMub24gXCJsb2FkZWRcIiwgPT5cbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMgPSBuZXcgZ3MuR2FtZVRlbXAoKVxuICAgICAgICAgICAgd2luZG93LiR0ZW1wRmllbGRzID0gR2FtZU1hbmFnZXIudGVtcEZpZWxkc1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBAbGFuZ3VhZ2VzTG9hZGVkXG4gICAgICAgICAgICAgICAgUmVjb3JkTWFuYWdlci5pbml0aWFsaXplKClcbiAgICAgICAgICAgICAgICBMYW5ndWFnZU1hbmFnZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLmluaXRpYWxpemUoKVxuICAgICAgICAgICAgICAgIEBzZXR1cFNldHRpbmdzKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAbG9hZERhdGEoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgQGxhbmd1YWdlc0xvYWRlZFxuICAgICAgICAgICAgICAgIEBsb2FkU3lzdGVtUmVzb3VyY2VzKClcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5ldmVudHMub2ZmIFwibG9hZGVkXCJcbiAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZXZlbnRzLm9uIFwibG9hZGVkXCIsID0+IFxuICAgICAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci5zZXR1cEN1cnNvcigpXG4gICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5ldmVudHMub2ZmIFwibG9hZGVkXCJcbiAgICAgICAgICAgICAgICAgICAgdWkuVUlNYW5hZ2VyLnNldHVwKClcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIEBsYW5ndWFnZXNMb2FkZWQgPSB5ZXNcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQXBwbGljYXRpb25cbiAgICAjIyNcbiAgICBzZXR1cEFwcGxpY2F0aW9uOiAtPlxuICAgICAgICAkUEFSQU1TLnNob3dEZWJ1Z0luZm8gPSBub1xuICAgICAgICB3aW5kb3cuUmVzb3VyY2VNYW5hZ2VyID0gbmV3IHdpbmRvdy5SZXNvdXJjZU1hbmFnZXIoKVxuICAgICAgICB3aW5kb3cuRGF0YU1hbmFnZXIgPSBuZXcgd2luZG93LkRhdGFNYW5hZ2VyKClcbiAgICAgICAgXG4gICAgICAgICMgRm9yY2UgT3BlbkdMIHJlbmRlcmVyXG4gICAgICAgIHdpbmRvdy5HcmFwaGljcyA9IG5ldyBHcmFwaGljc19PcGVuR0woKVxuICAgICAgICB3aW5kb3cuZ3MuR3JhcGhpY3MgPSB3aW5kb3cuR3JhcGhpY3NcbiAgICAgICAgd2luZG93LlJlbmRlcmVyID0gd2luZG93LlJlbmRlcmVyX09wZW5HTFxuICAgICAgICBcbiAgICAgICAgIyBGb3JjZSBsaW5lYXIgZmlsdGVyaW5nXG4gICAgICAgIFRleHR1cmUyRC5maWx0ZXIgPSAxXG4gICAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIGlucHV0IHN5c3RlbSB0byBlbmFibGUgc3VwcG9ydCBmb3Iga2V5Ym9hcmQsIG1vdXNlLCB0b3VjaCwgZXRjLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBJbnB1dFxuICAgICMjI1xuICAgIHNldHVwSW5wdXQ6IC0+XG4gICAgICAgIElucHV0LmluaXRpYWxpemUoKVxuICAgICAgICBJbnB1dC5Nb3VzZS5pbml0aWFsaXplKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgdmlkZW8gc3lzdGVtIHdpdGggdGhlIGdhbWUncyByZXNvbHV0aW9uLiBJdCBpcyBuZWNlc3NhcnkgdG9cbiAgICAqIGNhbGwgdGhpcyBtZXRob2QgYmVmb3JlIHVzaW5nIGdyYXBoaWMgb2JqZWN0IHN1Y2ggYXMgYml0bWFwcywgc3ByaXRlcywgZXRjLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBWaWRlb1xuICAgICMjIyAgICBcbiAgICBzZXR1cFZpZGVvOiAtPlxuICAgICAgICBAZnJhbWVDYWxsYmFjayA9IEBjcmVhdGVGcmFtZUNhbGxiYWNrKClcbiAgICAgICAgXG4gICAgICAgIEdyYXBoaWNzLmluaXRpYWxpemUoJFBBUkFNUy5yZXNvbHV0aW9uLndpZHRoLCAkUEFSQU1TLnJlc29sdXRpb24uaGVpZ2h0KVxuICAgICAgICAjR3JhcGhpY3Mub25Gb2N1c1JlY2VpdmUgPSA9PiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCA9IG5vXG4gICAgICAgIEdyYXBoaWNzLm9uRGlzcG9zZSA9ID0+IFJlc291cmNlTWFuYWdlci5kaXNwb3NlKClcbiAgICAgICAgR3JhcGhpY3MuZm9ybWF0cyA9IFszMjAsIDM4NCwgNDI3XVxuICAgICAgICBHcmFwaGljcy5zY2FsZSA9IDAuNSAvIDI0MCAqIEdyYXBoaWNzLmhlaWdodFxuICAgICAgICBGb250LmRlZmF1bHRTaXplID0gTWF0aC5yb3VuZCg5IC8gMjQwICogR3JhcGhpY3MuaGVpZ2h0KVxuICAgICAgICBcbiAgICAgICAgR3JhcGhpY3Mub25FYWNoRnJhbWUoQGZyYW1lQ2FsbGJhY2spXG4gICAgXG4gICAgIyMjKlxuICAgICogUmVnaXN0ZXJzIHNoYWRlci1iYXNlZCBlZmZlY3RzLiBJdCBpcyBpbXBvcnRhbnQgdG8gcmVnaXN0ZXIgYWxsIGVmZmVjdHNcbiAgICAqIGJlZm9yZSB0aGUgZ3JhcGhpY3Mgc3lzdGVtIGlzIGluaXRpYWxpemVkLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBFZmZlY3RzXG4gICAgIyMjICAgXG4gICAgc2V0dXBFZmZlY3RzOiAtPlxuICAgICAgICAjIFJlZ2lzdGVyIGJ1aWx0LWluIExPRC9Cb3ggQmx1ciBlZmZlY3RcbiAgICAgICAgZ3MuRWZmZWN0LnJlZ2lzdGVyRWZmZWN0KGdzLkVmZmVjdC5mcmFnbWVudFNoYWRlckluZm9zLmxvZF9ibHVyKVxuICAgICAgICAjIFJlZ2lzdGVyIGJ1aWx0LWluIHBpeGVsYXRlIGVmZmVjdFxuICAgICAgICBncy5FZmZlY3QucmVnaXN0ZXJFZmZlY3QoZ3MuRWZmZWN0LmZyYWdtZW50U2hhZGVySW5mb3MucGl4ZWxhdGUpXG4gICAgICAgIFxuICAgICAgICAjIFRoaXMgaXMgYW4gZXhhbXBsZSBvZiBob3cgdG8gcmVnaXN0ZXIgeW91ciBvd24gc2hhZGVyLWVmZmVjdC5cbiAgICAgICAgIyBTZWUgRWZmZWN0cyA+IENpcmN1bGFyRGlzdG9ydGlvbkVmZmVjdCBzY3JpcHQgZm9yIG1vcmUgaW5mby5cbiAgICAgICAgIyBncy5DaXJjdWxhckRpc3RvcnRpb25FZmZlY3QucmVnaXN0ZXIoKVxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBMaXZlMkQuIElmIExpdmUyRCBpcyBub3QgYXZhaWxhYmxlLCBpdCBkb2VzIG5vdGhpbmcuIE5lZWRzIHRvIGJlXG4gICAgKiBjYWxsZWQgYmVmb3JlIHVzaW5nIExpdmUyRC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwTGl2ZTJEXG4gICAgIyMjIFxuICAgIHNldHVwTGl2ZTJEOiAtPlxuICAgICAgICBMaXZlMkQuaW5pdCgpXG4gICAgICAgIExpdmUyRC5zZXRHTCgkZ2wpXG4gICAgICAgIExpdmUyREZyYW1ld29yay5zZXRQbGF0Zm9ybU1hbmFnZXIobmV3IEwyRFBsYXRmb3JtTWFuYWdlcigpKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIHRoZSBmcmFtZS1jYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgb25jZSBwZXIgZnJhbWUgdG8gdXBkYXRlIGFuZCByZW5kZXJcbiAgICAqIHRoZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBMaXZlMkRcbiAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgZnJhbWUtY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgIyMjICAgIFxuICAgIGNyZWF0ZUZyYW1lQ2FsbGJhY2s6IC0+XG4gICAgICAgIGNhbGxiYWNrID0gbnVsbFxuXG4gICAgICAgIGlmICRQQVJBTVMucHJldmlldz8gb3Igd2luZG93LnBhcmVudCAhPSB3aW5kb3dcbiAgICAgICAgICAgIGNhbGxiYWNrID0gKHRpbWUpID0+IFxuICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgICAgICBAdXBkYXRlRnJhbWUoKVxuICAgICAgICAgICAgICAgIGNhdGNoIGV4XG4gICAgICAgICAgICAgICAgICAgIGlmICRQQVJBTVMucHJldmlldyBvciBHYW1lTWFuYWdlci5pbkxpdmVQcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAkUEFSQU1TLnByZXZpZXcgPSBlcnJvcjogZXhcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNhbGxiYWNrID0gKHRpbWUpID0+IEB1cGRhdGVGcmFtZSgpXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrXG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyB0aGUgc3RhcnQgc2NlbmUgb2JqZWN0LiBJZiBhbiBpbnRyby1zY2VuZSBpcyBzZXQsIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlXG4gICAgKiBpbnRyby1zY2VuZS4gSWYgdGhlIGdhbWUgcnVucyBpbiBMaXZlLVByZXZpZXcsIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlIHNlbGVjdGVkXG4gICAgKiBzY2VuZSBpbiBlZGl0b3IuXG4gICAgKlxuICAgICogQG1ldGhvZCBjcmVhdGVTdGFydFNjZW5lXG4gICAgKiBAcmV0dXJuIHtncy5PYmplY3RfQmFzZX0gVGhlIHN0YXJ0LXNjZW5lLlxuICAgICMjIyAgICAgIFxuICAgIGNyZWF0ZVN0YXJ0U2NlbmU6IC0+XG4gICAgICAgIHNjZW5lID0gbnVsbFxuICAgICAgICBpbnRyb1NjZW5lID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgUmVjb3JkTWFuYWdlci5zeXN0ZW0udXNlSW50cm9TY2VuZVxuICAgICAgICAgICAgaW50cm9TY2VuZSA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50U3VtbWFyeShSZWNvcmRNYW5hZ2VyLnN5c3RlbS5pbnRyb0luZm8/LnNjZW5lPy51aWQpXG4gICAgICAgIFxuICAgICAgICBpZiAkUEFSQU1TLnByZXZpZXcgb3IgaW50cm9TY2VuZVxuICAgICAgICAgICAgc2NlbmUgPSBuZXcgdm4uT2JqZWN0X1NjZW5lKClcbiAgICAgICAgICAgIHNjZW5lLnNjZW5lRGF0YS51aWQgPSAkUEFSQU1TLnByZXZpZXc/LnNjZW5lLnVpZCB8fCBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5pbnRyb0luZm8/LnNjZW5lPy51aWRcbiAgICAgICAgICAgIHNjZW5lLmV2ZW50cy5vbiBcImRpc3Bvc2VcIiwgKGUpIC0+IEdhbWVNYW5hZ2VyLnNjZW5lRGF0YS51aWQgPSBudWxsXG4gICAgICAgIGVsc2UgaWYgTGFuZ3VhZ2VNYW5hZ2VyLmxhbmd1YWdlcy5sZW5ndGggPiAxXG4gICAgICAgICAgICBzY2VuZSA9IG5ldyBncy5PYmplY3RfTGF5b3V0KFwibGFuZ3VhZ2VNZW51TGF5b3V0XCIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNjZW5lID0gbmV3IGdzLk9iamVjdF9MYXlvdXQoXCJ0aXRsZUxheW91dFwiKVxuICAgICAgICAgIFxuICAgICAgICByZXR1cm4gc2NlbmVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQm9vdHMgdGhlIGdhbWUgYnkgc2V0dGluZyB1cCB0aGUgYXBwbGljYXRpb24gd2luZG93IGFzIHdlbGwgYXMgdGhlIHZpZGVvLCBhdWRpbyBhbmQgaW5wdXQgc3lzdGVtLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAjIyMgIFxuICAgIHN0YXJ0OiAtPlxuICAgICAgICBAc2V0dXBBcHBsaWNhdGlvbigpXG4gICAgICAgIEBzZXR1cEVmZmVjdHMoKVxuICAgICAgICBAc2V0dXBWaWRlbygpXG4gICAgICAgIEBzZXR1cExpdmUyRCgpXG4gICAgICAgIEBzZXR1cElucHV0KClcbiAgICBcbiAgICAgICAgQGxvYWQgPT4gU2NlbmVNYW5hZ2VyLnN3aXRjaFRvKEBjcmVhdGVTdGFydFNjZW5lKCkpXG5cblxuIyBUaGUgZW50cnkgcG9pbnQgb2YgdGhlIGdhbWUuXG5ncy5NYWluID0gbmV3IE1haW4oKSBcbmdzLkFwcGxpY2F0aW9uLmluaXRpYWxpemUoKVxuZ3MuQXBwbGljYXRpb24ub25SZWFkeSA9IC0+XG4gICAgIyBBZGQgbWV0YSBkYXRhIHRvIGFsbCBjbGFzcyBvYmplY3RzIG5lY2Vzc2FyeSBmb3Igb2JqZWN0IHNlcmlhbGl6YXRpb24uXG4gICAgT2JqZWN0LmtleXMoZ3MpLmZvckVhY2ggKGspIC0+IGdzW2tdLiRuYW1lc3BhY2UgPSBcImdzXCI7IGdzW2tdLiRuYW1lID0ga1xuICAgIE9iamVjdC5rZXlzKHZuKS5mb3JFYWNoIChrKSAtPiB2bltrXS4kbmFtZXNwYWNlID0gXCJ2blwiOyB2bltrXS4kbmFtZSA9IGtcbiAgICBPYmplY3Qua2V5cyh1aSkuZm9yRWFjaCAoaykgLT4gdWlba10uJG5hbWVzcGFjZSA9IFwidWlcIjsgdWlba10uJG5hbWUgPSBrXG4gICAgXG4gICAgZ3MuTWFpbi5zdGFydCgpXG5cblxuICAgICAgICAgICAgICAgIFxuICAgIFxuIFxuIl19
//# sourceURL=Main_105.js