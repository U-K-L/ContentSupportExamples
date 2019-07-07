var ResourceManager, ResourceManagerContext;

ResourceManagerContext = (function() {

  /**
  * If associated to a gs.ResourceManager, a resource context registers all loaded resources
  * resources. If gs.ResourceManager needs to dispose resources, it will only dispose
  * resource associated if the current context.
  *
  * By default, each game scene creates it's own resource context to only dispose resources
  * created by itself.
  *
  * @module gs
  * @class ResourceManager
  * @memberof gs
  * @constructor
   */
  function ResourceManagerContext() {

    /**
    * All resources associated with this context.
    * @property resources
    * @type Object[]
    * @readOnly
     */
    this.resources = [];
  }


  /**
  * Converts the resource context into a data-bundle for serialization. The data-bundle will only contain
  * the names of the resources associated with this context but not the resource-data itself.
  * @method toDataBundle
  * @return {string[]} An array of resource names associated with this context.
   */

  ResourceManagerContext.prototype.toDataBundle = function() {
    return this.resources.select(function(r) {
      return r.name;
    });
  };


  /**
  * Initializes the resource context from a data-bundle. Any already existing resource associations
  * with this context will be deleted.
  * @method fromDataBundle
   */

  ResourceManagerContext.prototype.fromDataBundle = function(data, resourcesByPath) {
    return this.resources = data.select(function(n) {
      return {
        name: n,
        data: resourcesByPath[n]
      };
    });
  };


  /**
  * Adds the specified resource to the context.
  * @method add
  * @param {string} name - A unique name for the resource like the file-path for example.
  * @param {gs.Bitmap|gs.AudioBuffer|gs.Video|gs.Live2DModel} data - The resource data like a gs.Bitmap object for example.
   */

  ResourceManagerContext.prototype.add = function(name, resource) {
    return this.resources.push({
      name: name,
      data: resource
    });
  };


  /**
  * Removes the resource with the specified name from the context.
  * @method remove
  * @param {string} name - The name of the resource to remove. For Example: The file name.
   */

  ResourceManagerContext.prototype.remove = function(name) {
    return this.resources.remove(this.resources.first(function(r) {
      return r.name === name;
    }));
  };

  return ResourceManagerContext;

})();

gs.ResourceManagerContext = ResourceManagerContext;

ResourceManager = (function() {

  /**
  * Manages the resources of the game like graphics, audio, fonts, etc. It
  * offers a lot of methods to easily access game resources and automatically
  * caches them. So if an image is requested a second time it will be taken
  * from the cache instead of loading it again.
  *
  * @module gs
  * @class ResourceManager
  * @memberof gs
  * @constructor
   */
  function ResourceManager() {

    /**
    * Current resource context. All loaded resources will be associated with it. If current context
    * is set to <b>null</b>, the <b>systemContext</b> is used instead.
    * @property context
    * @type gs.ResourceManagerContext
    * @protected
     */
    this.context_ = null;

    /**
    * System resource context. All loaded system resources are associated with this context. Resources
    * which are associated with the system context are not disposed until the game ends.
    * @property context
    * @type gs.ResourceManagerContext
     */
    this.systemContext = this.createContext();

    /**
    * Holds in-memory created bitmaps.
    * @property customBitmapsByKey
    * @type Object
    * @protected
     */
    this.customBitmapsByKey = {};

    /**
    * Caches resources by file path.
    * @property resourcesByPath
    * @type Object
    * @protected
     */
    this.resourcesByPath = {};

    /**
    * Caches resources by file path and HUE.
    * @property resourcesByPath
    * @type Object
    * @protected
     */
    this.resourcesByPathHue = {};

    /**
    * Stores all loaded resources.
    * @property resources
    * @type Object[]
     */
    this.resources = [];

    /**
    * Indicates if all requested resources are loaded.
    * @property resourcesLoaded
    * @type boolean
     */
    this.resourcesLoaded = true;

    /**
    * @property events
    * @type gs.EventEmitter
     */
    this.events = new gs.EventEmitter();
  }


  /**
  * Current resource context. All loaded resources will be associated with it. If current context
  * is set to <b>null</b>, the <b>systemContext</b> is used instead.
  * @property context
  * @type gs.ResourceManagerContext
   */

  ResourceManager.accessors("context", {
    set: function(v) {
      return this.context_ = v;
    },
    get: function() {
      var ref;
      return (ref = this.context_) != null ? ref : this.systemContext;
    }
  });


  /**
  * Creates a new resource context. Use <b>context</b> to set the new created context
  * as current context.
  *
  * @method createContext
   */

  ResourceManager.prototype.createContext = function() {
    return new gs.ResourceManagerContext();
  };


  /**
  * Disposes all bitmap resources associated with the current context.
  *
  * @method disposeBitmaps
   */

  ResourceManager.prototype.disposeBitmaps = function() {
    var j, len, ref, resource, results;
    ref = this.context.resources;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      resource = ref[j];
      if (resource.data instanceof gs.Bitmap) {
        resource.data.dispose();
        this.resources.remove(resource.data);
        if (resource.name) {
          this.resourcesByPath[resource.name] = null;
          results.push(delete this.resourcesByPath[resource.name]);
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
  * Disposes all video resources associated with the current context.
  *
  * @method disposeVideos
   */

  ResourceManager.prototype.disposeVideos = function() {
    var j, len, ref, resource, results;
    ref = this.context.resources;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      resource = ref[j];
      if (resource.data instanceof gs.Video) {
        resource.data.dispose();
        this.resources.remove(resource.data);
        this.resourcesByPath[resource.name] = null;
        results.push(delete this.resourcesByPath[resource.name]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Disposes all audio resources associated with the current context.
  *
  * @method disposeAudio
   */

  ResourceManager.prototype.disposeAudio = function() {
    var j, len, ref, resource, results;
    AudioManager.dispose(this.context);
    ref = this.context.resources;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      resource = ref[j];
      if (resource.data instanceof GS.AudioBuffer || resource instanceof GS.AudioBufferStream) {
        resource.data.dispose();
        this.resources.remove(resource.data);
        this.resourcesByPath[resource.name] = null;
        results.push(delete this.resourcesByPath[resource.name]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Disposes all Live2D resources associated with the current context.
  *
  * @method disposeLive2D
   */

  ResourceManager.prototype.disposeLive2D = function() {
    var j, len, ref, resource, results;
    ref = this.context.resources;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      resource = ref[j];
      if (resource.data instanceof gs.Live2DModel) {
        resource.data.dispose();
        this.resources.remove(resource.data);
        this.resourcesByPath[resource.name] = null;
        results.push(delete this.resourcesByPath[resource.name]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Disposes all resources.
  *
  * @method dispose
   */

  ResourceManager.prototype.dispose = function() {
    this.disposeBitmaps();
    this.disposeVideos();
    this.disposeAudio();
    this.disposeLive2D();
    return this.context = this.systemContext;
  };


  /**
  * Loads all custom fonts in Graphics/Fonts folder.
  *
  * @method loadFonts
   */

  ResourceManager.prototype.loadFonts = function() {
    var resource;
    resource = {
      loaded: false
    };
    this.resources.push(resource);
    this.resourcesByPath["Graphics/Fonts"] = resource;
    return gs.Font.loadCustomFonts((function(_this) {
      return function(error) {
        _this.resourcesByPath["Graphics/Fonts"].loaded = true;
        if (error) {
          return _this.resourcesByPath["Graphics/Fonts"].error = true;
        }
      };
    })(this));
  };


  /**
  * Gets a custom created bitmap by key.
  *
  * @method getCustomBitmap
  * @param {String} key - The key for the bitmap to get.
  * @return {gs.Bitmap} The bitmap or <b>null</b> if no bitmap exists for the specified key.
   */

  ResourceManager.prototype.getCustomBitmap = function(key) {
    return this.customBitmapsByKey[key];
  };


  /**
  * Sets a custom created bitmap for a specified key.
  *
  * @method setCustomBitmap
  * @param {String} key - The key for the bitmap to set.
  * @param {gs.Bitmap} bitmap - The bitmap to set.
   */

  ResourceManager.prototype.setCustomBitmap = function(key, bitmap) {
    this.customBitmapsByKey[key] = bitmap;
    if (bitmap.loaded == null) {
      this.resources.push(bitmap);
      return this.resourcesLoaded = false;
    }
  };


  /**
  * Adds a custom created bitmap to the resource manager.
  *
  * @method addCustomBitmap
  * @param {gs.Bitmap} bitmap - The bitmap to add.
   */

  ResourceManager.prototype.addCustomBitmap = function(bitmap) {
    return this.context.resources.push({
      name: "",
      data: bitmap
    });
  };


  /**
  * Gets a Live2D model.
  *
  * @method getLive2DModel
  * @param {String} filePath - Path to the Live2D model file.
  * @return {gs.Live2DModel} The Live2D model or <b>null</b> if no model exists at the specified file path.
   */

  ResourceManager.prototype.getLive2DModel = function(filePath) {
    var profile, result;
    result = this.resourcesByPath[filePath];
    if ((result == null) || result.disposed) {
      profile = LanguageManager.profile;
      result = new gs.Live2DModel(filePath, ((profile != null) && (profile.items != null) ? profile.items.code : null));
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
      this.context.resources.push({
        name: filePath,
        data: result
      });
    }
    return result;
  };


  /**
  * Gets a font.
  *
  * @method getFont
  * @param {String} name - The name of the font to get.
  * @param {number} size - The size of the font to get.
  * @return {gs.Font} The font or <b>null</b> if no font with the specified name exists.
   */

  ResourceManager.prototype.getFont = function(name, size) {
    var result;
    result = new Font(name, size);
    this.resources.push(result);
    this.resourcesLoaded = false;
    return result;
  };


  /**
  * Gets a video.
  *
  * @method getVideo
  * @param {String} filePath - Path to the video file.
  * @return {gs.Video} The video or <b>null</b> if no video exists at the specified file path.
   */

  ResourceManager.prototype.getVideo = function(filePath) {
    var profile, result;
    if (filePath.endsWith("/")) {
      return null;
    }
    result = this.resourcesByPath[filePath];
    if ((result == null) || result.disposed) {
      profile = LanguageManager.profile;
      result = new gs.Video(filePath, ((profile != null) && (profile.items != null) ? profile.items.code : null));
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
      this.context.resources.push({
        name: filePath,
        data: result
      });
    }
    return result;
  };


  /**
  * Gets a bitmap.
  *
  * @method getBitmap
  * @param {String} filePath - Path to the bitmap file.
  * @param {number} hue - The bitmap's hue. The bitmap will be loaded and then recolored.
  * @return {gs.Bitmap} The bitmap or <b>null</b> if no bitmap exists at the specified file path.
   */

  ResourceManager.prototype.getBitmap = function(filePath, hue) {
    var hueBitmap, profile, result;
    if (filePath.endsWith("/")) {
      return null;
    }
    hue = hue || 0;
    result = this.resourcesByPath[filePath] || this.customBitmapsByKey[filePath];
    if (result == null) {
      profile = LanguageManager.profile;
      result = new Bitmap(filePath, ((profile != null) && (profile.items != null) ? profile.items.code : null), false);
      result.hue = hue;
      result.filePath = filePath;
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
      this.context.resources.push({
        name: filePath,
        data: result
      });
    } else if (!result.loaded && result.hue !== hue) {
      profile = LanguageManager.profile;
      result = new Bitmap(filePath, ((profile != null) && (profile.items != null) ? profile.items.code : null));
      result.hue = hue;
      result.filePath = filePath;
      this.resources.push(result);
      this.resourcesLoaded = false;
    } else if (hue > 0) {
      hueBitmap = this.resourcesByPathHue[filePath + "@" + hue];
      if ((hueBitmap == null) && result.loaded) {
        hueBitmap = new Bitmap(result.image);
        hueBitmap.changeHue(hue);
        this.resourcesByPathHue[filePath + "@" + hue] = hueBitmap;
      }
      if (hueBitmap != null) {
        result = hueBitmap;
      }
    }
    return result;
  };


  /**
  * Gets an HTML image.
  *
  * @method getImage
  * @param {String} filePath - Path to the image file.
  * @return {HTMLImageElement} The image or <b>null</b> if no image exists at the specified file path.
   */

  ResourceManager.prototype.getImage = function(filePath) {
    var result;
    result = this.resourcesByPath[filePath];
    if (result == null) {
      result = new Bitmap("resources/" + filePath + ".png");
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
    }
    return result;
  };


  /**
  * Gets an audio stream.
  *
  * @method getAudioStream
  * @param {String} filePath - Path to the audio file.
  * @return {gs.AudioBuffer} The audio buffer or <b>null</b> if no audio file exists at the specified file path.
   */

  ResourceManager.prototype.getAudioStream = function(filePath) {
    var languageCode, profile, result;
    result = this.resourcesByPath[filePath];
    profile = LanguageManager.profile;
    languageCode = (profile != null) && (profile.items != null) ? profile.items.code : null;
    if (result == null) {
      result = new GS.AudioBuffer(filePath);
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
      this.context.resources.push({
        name: filePath,
        data: result
      });
    }
    return result;
  };


  /**
  * Gets an audio buffer. The audio data is fully loaded and decoded in memory. It is recommeneded
  * for sound effects but for a long background music, <b>getAudioStream</b> should be used instead. That is especially
  * the case on mobile devices.
  *
  * @method getAudioBuffer
  * @param {String} filePath - Path to the audio file.
  * @return {gs.AudioBuffer} The audio buffer or <b>null</b> if no audio file exists at the specified file path.
   */

  ResourceManager.prototype.getAudioBuffer = function(filePath) {
    var languageCode, profile, result;
    result = this.resourcesByPath[filePath];
    profile = LanguageManager.profile;
    languageCode = (profile != null) && (profile.items != null) ? profile.items.code : null;
    if (result == null) {
      result = new GS.AudioBuffer(filePath);
      this.resourcesByPath[filePath] = result;
      this.resources.push(result);
      this.resourcesLoaded = false;
      this.context.resources.push({
        name: filePath,
        data: result
      });
    }
    return result;
  };


  /**
  * Updates the loading process. Needs to be called once per frame to keep 
  * the ResourceManager up to date.
  *
  * @method update
   */

  ResourceManager.prototype.update = function() {
    var bitmap, i, j, ref;
    if (this.events == null) {
      this.events = new gs.EventEmitter();
    }
    if (!this.resourcesLoaded) {
      this.resourcesLoaded = true;
      for (i = j = 0, ref = this.resources.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (!this.resources[i].loaded) {
          this.resourcesLoaded = false;
          break;
        } else if ((this.resources[i].hue != null) && this.resources[i].hue > 0) {
          bitmap = new Bitmap(this.resources[i].image);
          this.resourcesByPath[this.resources[i].filePath] = bitmap;
          this.resources[i].changeHue(this.resources[i].hue);
          this.resourcesByPathHue[this.resources[i].filePath + "@" + this.resources[i].hue] = this.resources[i];
          delete this.resources[i].filePath;
          delete this.resources[i].hue;
        }
      }
      if (this.resourcesLoaded) {
        this.events.emit("loaded", this);
      }
    }
    return null;
  };

  return ResourceManager;

})();

window.ResourceManager = ResourceManager;

gs.ResourceManager = ResourceManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7Ozs7RUFhYSxnQ0FBQTs7QUFDVDs7Ozs7O0lBTUEsSUFBQyxDQUFBLFNBQUQsR0FBYTtFQVBKOzs7QUFVYjs7Ozs7OzttQ0FNQSxZQUFBLEdBQWMsU0FBQTtXQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixTQUFDLENBQUQ7YUFBTyxDQUFDLENBQUM7SUFBVCxDQUFsQjtFQUFIOzs7QUFFZDs7Ozs7O21DQUtBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sZUFBUDtXQUEyQixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUksQ0FBQyxNQUFMLENBQVksU0FBQyxDQUFEO2FBQU87UUFBQSxJQUFBLEVBQU0sQ0FBTjtRQUFTLElBQUEsRUFBTSxlQUFnQixDQUFBLENBQUEsQ0FBL0I7O0lBQVAsQ0FBWjtFQUF4Qzs7O0FBRWhCOzs7Ozs7O21DQU1BLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQW9CLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQjtNQUFFLElBQUEsRUFBTSxJQUFSO01BQWMsSUFBQSxFQUFNLFFBQXBCO0tBQWhCO0VBQXBCOzs7QUFFTDs7Ozs7O21DQUtBLE1BQUEsR0FBUSxTQUFDLElBQUQ7V0FBVSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQWlCLFNBQUMsQ0FBRDthQUFPLENBQUMsQ0FBQyxJQUFGLEtBQVU7SUFBakIsQ0FBakIsQ0FBbEI7RUFBVjs7Ozs7O0FBRVosRUFBRSxDQUFDLHNCQUFILEdBQTRCOztBQUV0Qjs7QUFDRjs7Ozs7Ozs7Ozs7RUFXYSx5QkFBQTs7QUFDVDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBRVo7Ozs7OztJQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlC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b0IsQ0FBOUM7VUFDRCxNQUFBLEdBQWEsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFyQjtVQUViLElBQUMsQ0FBQSxlQUFnQixDQUFBLElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBZCxDQUFqQixHQUEyQztVQUMzQyxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQWQsQ0FBd0IsSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUF0QztVQUNBLElBQUMsQ0FBQSxrQkFBbUIsQ0FBQSxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQWQsR0FBdUIsR0FBdkIsR0FBMkIsSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUF6QyxDQUFwQixHQUFvRSxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUE7VUFDL0UsT0FBTyxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDO1VBQ3JCLE9BQU8sSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQVBwQjs7QUFKVDtNQVlBLElBQUcsSUFBQyxDQUFBLGVBQUo7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBREo7T0FkSjs7QUFpQkEsV0FBTztFQW5CSDs7Ozs7O0FBcUJaLE1BQU0sQ0FBQyxlQUFQLEdBQXlCOztBQUN6QixFQUFFLENBQUMsZUFBSCxHQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogUmVzb3VyY2VNYW5hZ2VyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBSZXNvdXJjZU1hbmFnZXJDb250ZXh0XG4gICAgIyMjKlxuICAgICogSWYgYXNzb2NpYXRlZCB0byBhIGdzLlJlc291cmNlTWFuYWdlciwgYSByZXNvdXJjZSBjb250ZXh0IHJlZ2lzdGVycyBhbGwgbG9hZGVkIHJlc291cmNlc1xuICAgICogcmVzb3VyY2VzLiBJZiBncy5SZXNvdXJjZU1hbmFnZXIgbmVlZHMgdG8gZGlzcG9zZSByZXNvdXJjZXMsIGl0IHdpbGwgb25seSBkaXNwb3NlXG4gICAgKiByZXNvdXJjZSBhc3NvY2lhdGVkIGlmIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAgKlxuICAgICogQnkgZGVmYXVsdCwgZWFjaCBnYW1lIHNjZW5lIGNyZWF0ZXMgaXQncyBvd24gcmVzb3VyY2UgY29udGV4dCB0byBvbmx5IGRpc3Bvc2UgcmVzb3VyY2VzXG4gICAgKiBjcmVhdGVkIGJ5IGl0c2VsZi5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgUmVzb3VyY2VNYW5hZ2VyXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPiBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFsbCByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udGV4dC5cbiAgICAgICAgKiBAcHJvcGVydHkgcmVzb3VyY2VzXG4gICAgICAgICogQHR5cGUgT2JqZWN0W11cbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNvdXJjZXMgPSBbXVxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIENvbnZlcnRzIHRoZSByZXNvdXJjZSBjb250ZXh0IGludG8gYSBkYXRhLWJ1bmRsZSBmb3Igc2VyaWFsaXphdGlvbi4gVGhlIGRhdGEtYnVuZGxlIHdpbGwgb25seSBjb250YWluXG4gICAgKiB0aGUgbmFtZXMgb2YgdGhlIHJlc291cmNlcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjb250ZXh0IGJ1dCBub3QgdGhlIHJlc291cmNlLWRhdGEgaXRzZWxmLlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAqIEByZXR1cm4ge3N0cmluZ1tdfSBBbiBhcnJheSBvZiByZXNvdXJjZSBuYW1lcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjb250ZXh0LlxuICAgICMjIyAgXG4gICAgdG9EYXRhQnVuZGxlOiAtPiBAcmVzb3VyY2VzLnNlbGVjdCAocikgLT4gci5uYW1lXG4gICAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIHJlc291cmNlIGNvbnRleHQgZnJvbSBhIGRhdGEtYnVuZGxlLiBBbnkgYWxyZWFkeSBleGlzdGluZyByZXNvdXJjZSBhc3NvY2lhdGlvbnNcbiAgICAqIHdpdGggdGhpcyBjb250ZXh0IHdpbGwgYmUgZGVsZXRlZC5cbiAgICAqIEBtZXRob2QgZnJvbURhdGFCdW5kbGVcbiAgICAjIyNcbiAgICBmcm9tRGF0YUJ1bmRsZTogKGRhdGEsIHJlc291cmNlc0J5UGF0aCkgLT4gQHJlc291cmNlcyA9IGRhdGEuc2VsZWN0IChuKSAtPiBuYW1lOiBuLCBkYXRhOiByZXNvdXJjZXNCeVBhdGhbbl1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UgdG8gdGhlIGNvbnRleHQuXG4gICAgKiBAbWV0aG9kIGFkZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBBIHVuaXF1ZSBuYW1lIGZvciB0aGUgcmVzb3VyY2UgbGlrZSB0aGUgZmlsZS1wYXRoIGZvciBleGFtcGxlLlxuICAgICogQHBhcmFtIHtncy5CaXRtYXB8Z3MuQXVkaW9CdWZmZXJ8Z3MuVmlkZW98Z3MuTGl2ZTJETW9kZWx9IGRhdGEgLSBUaGUgcmVzb3VyY2UgZGF0YSBsaWtlIGEgZ3MuQml0bWFwIG9iamVjdCBmb3IgZXhhbXBsZS5cbiAgICAjIyMgICBcbiAgICBhZGQ6IChuYW1lLCByZXNvdXJjZSkgLT4gQHJlc291cmNlcy5wdXNoKHsgbmFtZTogbmFtZSwgZGF0YTogcmVzb3VyY2UgfSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIHRoZSByZXNvdXJjZSB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBmcm9tIHRoZSBjb250ZXh0LlxuICAgICogQG1ldGhvZCByZW1vdmVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHJlc291cmNlIHRvIHJlbW92ZS4gRm9yIEV4YW1wbGU6IFRoZSBmaWxlIG5hbWUuXG4gICAgIyMjICBcbiAgICByZW1vdmU6IChuYW1lKSAtPiBAcmVzb3VyY2VzLnJlbW92ZShAcmVzb3VyY2VzLmZpcnN0KChyKSAtPiByLm5hbWUgPT0gbmFtZSkpXG4gICAgXG5ncy5SZXNvdXJjZU1hbmFnZXJDb250ZXh0ID0gUmVzb3VyY2VNYW5hZ2VyQ29udGV4dFxuXG5jbGFzcyBSZXNvdXJjZU1hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBNYW5hZ2VzIHRoZSByZXNvdXJjZXMgb2YgdGhlIGdhbWUgbGlrZSBncmFwaGljcywgYXVkaW8sIGZvbnRzLCBldGMuIEl0XG4gICAgKiBvZmZlcnMgYSBsb3Qgb2YgbWV0aG9kcyB0byBlYXNpbHkgYWNjZXNzIGdhbWUgcmVzb3VyY2VzIGFuZCBhdXRvbWF0aWNhbGx5XG4gICAgKiBjYWNoZXMgdGhlbS4gU28gaWYgYW4gaW1hZ2UgaXMgcmVxdWVzdGVkIGEgc2Vjb25kIHRpbWUgaXQgd2lsbCBiZSB0YWtlblxuICAgICogZnJvbSB0aGUgY2FjaGUgaW5zdGVhZCBvZiBsb2FkaW5nIGl0IGFnYWluLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBSZXNvdXJjZU1hbmFnZXJcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBDdXJyZW50IHJlc291cmNlIGNvbnRleHQuIEFsbCBsb2FkZWQgcmVzb3VyY2VzIHdpbGwgYmUgYXNzb2NpYXRlZCB3aXRoIGl0LiBJZiBjdXJyZW50IGNvbnRleHRcbiAgICAgICAgKiBpcyBzZXQgdG8gPGI+bnVsbDwvYj4sIHRoZSA8Yj5zeXN0ZW1Db250ZXh0PC9iPiBpcyB1c2VkIGluc3RlYWQuXG4gICAgICAgICogQHByb3BlcnR5IGNvbnRleHRcbiAgICAgICAgKiBAdHlwZSBncy5SZXNvdXJjZU1hbmFnZXJDb250ZXh0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGNvbnRleHRfID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN5c3RlbSByZXNvdXJjZSBjb250ZXh0LiBBbGwgbG9hZGVkIHN5c3RlbSByZXNvdXJjZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbnRleHQuIFJlc291cmNlc1xuICAgICAgICAqIHdoaWNoIGFyZSBhc3NvY2lhdGVkIHdpdGggdGhlIHN5c3RlbSBjb250ZXh0IGFyZSBub3QgZGlzcG9zZWQgdW50aWwgdGhlIGdhbWUgZW5kcy5cbiAgICAgICAgKiBAcHJvcGVydHkgY29udGV4dFxuICAgICAgICAqIEB0eXBlIGdzLlJlc291cmNlTWFuYWdlckNvbnRleHRcbiAgICAgICAgIyMjICAgIFxuICAgICAgICBAc3lzdGVtQ29udGV4dCA9IEBjcmVhdGVDb250ZXh0KClcbiAgICAgICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogSG9sZHMgaW4tbWVtb3J5IGNyZWF0ZWQgYml0bWFwcy5cbiAgICAgICAgKiBAcHJvcGVydHkgY3VzdG9tQml0bWFwc0J5S2V5XG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGN1c3RvbUJpdG1hcHNCeUtleSA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ2FjaGVzIHJlc291cmNlcyBieSBmaWxlIHBhdGguXG4gICAgICAgICogQHByb3BlcnR5IHJlc291cmNlc0J5UGF0aFxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNvdXJjZXNCeVBhdGggPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIENhY2hlcyByZXNvdXJjZXMgYnkgZmlsZSBwYXRoIGFuZCBIVUUuXG4gICAgICAgICogQHByb3BlcnR5IHJlc291cmNlc0J5UGF0aFxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNvdXJjZXNCeVBhdGhIdWUgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgbG9hZGVkIHJlc291cmNlcy5cbiAgICAgICAgKiBAcHJvcGVydHkgcmVzb3VyY2VzXG4gICAgICAgICogQHR5cGUgT2JqZWN0W11cbiAgICAgICAgIyMjXG4gICAgICAgIEByZXNvdXJjZXMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiBhbGwgcmVxdWVzdGVkIHJlc291cmNlcyBhcmUgbG9hZGVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSByZXNvdXJjZXNMb2FkZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjI1xuICAgICAgICBAcmVzb3VyY2VzTG9hZGVkID0gdHJ1ZVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBldmVudHNcbiAgICAgICAgKiBAdHlwZSBncy5FdmVudEVtaXR0ZXJcbiAgICAgICAgIyMjXG4gICAgICAgIEBldmVudHMgPSBuZXcgZ3MuRXZlbnRFbWl0dGVyKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDdXJyZW50IHJlc291cmNlIGNvbnRleHQuIEFsbCBsb2FkZWQgcmVzb3VyY2VzIHdpbGwgYmUgYXNzb2NpYXRlZCB3aXRoIGl0LiBJZiBjdXJyZW50IGNvbnRleHRcbiAgICAqIGlzIHNldCB0byA8Yj5udWxsPC9iPiwgdGhlIDxiPnN5c3RlbUNvbnRleHQ8L2I+IGlzIHVzZWQgaW5zdGVhZC5cbiAgICAqIEBwcm9wZXJ0eSBjb250ZXh0XG4gICAgKiBAdHlwZSBncy5SZXNvdXJjZU1hbmFnZXJDb250ZXh0XG4gICAgIyMjXG4gICAgQGFjY2Vzc29ycyBcImNvbnRleHRcIiwgXG4gICAgICAgIHNldDogKHYpIC0+IEBjb250ZXh0XyA9IHZcbiAgICAgICAgZ2V0OiAtPiBAY29udGV4dF8gPyBAc3lzdGVtQ29udGV4dFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGEgbmV3IHJlc291cmNlIGNvbnRleHQuIFVzZSA8Yj5jb250ZXh0PC9iPiB0byBzZXQgdGhlIG5ldyBjcmVhdGVkIGNvbnRleHRcbiAgICAqIGFzIGN1cnJlbnQgY29udGV4dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNyZWF0ZUNvbnRleHRcbiAgICAjIyNcbiAgICBjcmVhdGVDb250ZXh0OiAtPiBuZXcgZ3MuUmVzb3VyY2VNYW5hZ2VyQ29udGV4dCgpXG4gICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgYWxsIGJpdG1hcCByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlQml0bWFwc1xuICAgICMjI1xuICAgIGRpc3Bvc2VCaXRtYXBzOiAtPlxuICAgICAgICBmb3IgcmVzb3VyY2UgaW4gQGNvbnRleHQucmVzb3VyY2VzXG4gICAgICAgICAgICBpZiByZXNvdXJjZS5kYXRhIGluc3RhbmNlb2YgZ3MuQml0bWFwXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UuZGF0YS5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICBAcmVzb3VyY2VzLnJlbW92ZShyZXNvdXJjZS5kYXRhKVxuICAgICAgICAgICAgICAgIGlmIHJlc291cmNlLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgQHJlc291cmNlc0J5UGF0aFtyZXNvdXJjZS5uYW1lXSA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIEByZXNvdXJjZXNCeVBhdGhbcmVzb3VyY2UubmFtZV1cbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyBhbGwgdmlkZW8gcmVzb3VyY2VzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBjb250ZXh0LlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZVZpZGVvc1xuICAgICMjI1xuICAgIGRpc3Bvc2VWaWRlb3M6IC0+ICAgICAgICAgICAgXG4gICAgICAgIGZvciByZXNvdXJjZSBpbiBAY29udGV4dC5yZXNvdXJjZXNcbiAgICAgICAgICAgIGlmIHJlc291cmNlLmRhdGEgaW5zdGFuY2VvZiBncy5WaWRlb1xuICAgICAgICAgICAgICAgIHJlc291cmNlLmRhdGEuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgQHJlc291cmNlcy5yZW1vdmUocmVzb3VyY2UuZGF0YSlcbiAgICAgICAgICAgICAgICBAcmVzb3VyY2VzQnlQYXRoW3Jlc291cmNlLm5hbWVdID0gbnVsbFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBAcmVzb3VyY2VzQnlQYXRoW3Jlc291cmNlLm5hbWVdXG4gICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIGFsbCBhdWRpbyByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlQXVkaW9cbiAgICAjIyMgICAgICAgICAgIFxuICAgIGRpc3Bvc2VBdWRpbzogLT5cbiAgICAgICAgQXVkaW9NYW5hZ2VyLmRpc3Bvc2UoQGNvbnRleHQpXG4gICAgICAgIFxuICAgICAgICBmb3IgcmVzb3VyY2UgaW4gQGNvbnRleHQucmVzb3VyY2VzXG4gICAgICAgICAgICBpZiByZXNvdXJjZS5kYXRhIGluc3RhbmNlb2YgR1MuQXVkaW9CdWZmZXIgb3IgcmVzb3VyY2UgaW5zdGFuY2VvZiBHUy5BdWRpb0J1ZmZlclN0cmVhbVxuICAgICAgICAgICAgICAgIHJlc291cmNlLmRhdGEuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgQHJlc291cmNlcy5yZW1vdmUocmVzb3VyY2UuZGF0YSlcbiAgICAgICAgICAgICAgICBAcmVzb3VyY2VzQnlQYXRoW3Jlc291cmNlLm5hbWVdID0gbnVsbFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBAcmVzb3VyY2VzQnlQYXRoW3Jlc291cmNlLm5hbWVdXG4gICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogRGlzcG9zZXMgYWxsIExpdmUyRCByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlTGl2ZTJEXG4gICAgIyMjXG4gICAgZGlzcG9zZUxpdmUyRDogLT4gICAgICAgICAgICBcbiAgICAgICAgZm9yIHJlc291cmNlIGluIEBjb250ZXh0LnJlc291cmNlc1xuICAgICAgICAgICAgaWYgcmVzb3VyY2UuZGF0YSBpbnN0YW5jZW9mIGdzLkxpdmUyRE1vZGVsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UuZGF0YS5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICBAcmVzb3VyY2VzLnJlbW92ZShyZXNvdXJjZS5kYXRhKVxuICAgICAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhbcmVzb3VyY2UubmFtZV0gPSBudWxsXG4gICAgICAgICAgICAgICAgZGVsZXRlIEByZXNvdXJjZXNCeVBhdGhbcmVzb3VyY2UubmFtZV1cbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyBhbGwgcmVzb3VyY2VzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZVxuICAgICMjIyAgICAgICAgXG4gICAgZGlzcG9zZTogLT4gXG4gICAgICAgIEBkaXNwb3NlQml0bWFwcygpXG4gICAgICAgIEBkaXNwb3NlVmlkZW9zKClcbiAgICAgICAgQGRpc3Bvc2VBdWRpbygpXG4gICAgICAgIEBkaXNwb3NlTGl2ZTJEKClcbiAgICAgICAgXG4gICAgICAgIEBjb250ZXh0ID0gQHN5c3RlbUNvbnRleHRcbiAgICAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgYWxsIGN1c3RvbSBmb250cyBpbiBHcmFwaGljcy9Gb250cyBmb2xkZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkRm9udHNcbiAgICAjIyMgICAgICAgXG4gICAgbG9hZEZvbnRzOiAtPlxuICAgICAgICByZXNvdXJjZSA9IHsgbG9hZGVkOiBubyB9XG4gICAgICAgIEByZXNvdXJjZXMucHVzaChyZXNvdXJjZSlcbiAgICAgICAgQHJlc291cmNlc0J5UGF0aFtcIkdyYXBoaWNzL0ZvbnRzXCJdID0gcmVzb3VyY2VcbiAgICAgICAgXG4gICAgICAgIGdzLkZvbnQubG9hZEN1c3RvbUZvbnRzKChlcnJvcikgPT5cbiAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhbXCJHcmFwaGljcy9Gb250c1wiXS5sb2FkZWQgPSB5ZXNcbiAgICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICAgICAgQHJlc291cmNlc0J5UGF0aFtcIkdyYXBoaWNzL0ZvbnRzXCJdLmVycm9yID0geWVzXG4gICAgICAgIClcbiAgICAjIyMqXG4gICAgKiBHZXRzIGEgY3VzdG9tIGNyZWF0ZWQgYml0bWFwIGJ5IGtleS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldEN1c3RvbUJpdG1hcFxuICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRoZSBrZXkgZm9yIHRoZSBiaXRtYXAgdG8gZ2V0LlxuICAgICogQHJldHVybiB7Z3MuQml0bWFwfSBUaGUgYml0bWFwIG9yIDxiPm51bGw8L2I+IGlmIG5vIGJpdG1hcCBleGlzdHMgZm9yIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICMjIyAgICAgXG4gICAgZ2V0Q3VzdG9tQml0bWFwOiAoa2V5KSAtPlxuICAgICAgICByZXR1cm4gQGN1c3RvbUJpdG1hcHNCeUtleVtrZXldXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyBhIGN1c3RvbSBjcmVhdGVkIGJpdG1hcCBmb3IgYSBzcGVjaWZpZWQga2V5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0Q3VzdG9tQml0bWFwXG4gICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IC0gVGhlIGtleSBmb3IgdGhlIGJpdG1hcCB0byBzZXQuXG4gICAgKiBAcGFyYW0ge2dzLkJpdG1hcH0gYml0bWFwIC0gVGhlIGJpdG1hcCB0byBzZXQuXG4gICAgIyMjIFxuICAgIHNldEN1c3RvbUJpdG1hcDogKGtleSwgYml0bWFwKSAtPlxuICAgICAgICBAY3VzdG9tQml0bWFwc0J5S2V5W2tleV0gPSBiaXRtYXBcbiAgICAgICAgaWYgbm90IGJpdG1hcC5sb2FkZWQ/XG4gICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2goYml0bWFwKVxuICAgICAgICAgICAgQHJlc291cmNlc0xvYWRlZCA9IGZhbHNlXG4gICAgXG4gICAgIyMjKlxuICAgICogQWRkcyBhIGN1c3RvbSBjcmVhdGVkIGJpdG1hcCB0byB0aGUgcmVzb3VyY2UgbWFuYWdlci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZEN1c3RvbUJpdG1hcFxuICAgICogQHBhcmFtIHtncy5CaXRtYXB9IGJpdG1hcCAtIFRoZSBiaXRtYXAgdG8gYWRkLlxuICAgICMjIyAgICAgICAgIFxuICAgIGFkZEN1c3RvbUJpdG1hcDogKGJpdG1hcCkgLT5cbiAgICAgICAgQGNvbnRleHQucmVzb3VyY2VzLnB1c2gobmFtZTogXCJcIiwgZGF0YTogYml0bWFwKVxuXG4gICAgIyMjKlxuICAgICogR2V0cyBhIExpdmUyRCBtb2RlbC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldExpdmUyRE1vZGVsXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggLSBQYXRoIHRvIHRoZSBMaXZlMkQgbW9kZWwgZmlsZS5cbiAgICAqIEByZXR1cm4ge2dzLkxpdmUyRE1vZGVsfSBUaGUgTGl2ZTJEIG1vZGVsIG9yIDxiPm51bGw8L2I+IGlmIG5vIG1vZGVsIGV4aXN0cyBhdCB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICAjIyMgIFxuICAgIGdldExpdmUyRE1vZGVsOiAoZmlsZVBhdGgpIC0+XG4gICAgICAgIHJlc3VsdCA9IEByZXNvdXJjZXNCeVBhdGhbZmlsZVBhdGhdXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgcmVzdWx0PyBvciByZXN1bHQuZGlzcG9zZWRcbiAgICAgICAgICAgIHByb2ZpbGUgPSBMYW5ndWFnZU1hbmFnZXIucHJvZmlsZVxuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IGdzLkxpdmUyRE1vZGVsKGZpbGVQYXRoLCAoaWYgcHJvZmlsZT8gYW5kIHByb2ZpbGUuaXRlbXM/IHRoZW4gcHJvZmlsZS5pdGVtcy5jb2RlIGVsc2UgbnVsbCkpXG4gICAgICAgICAgICBAcmVzb3VyY2VzQnlQYXRoW2ZpbGVQYXRoXSA9IHJlc3VsdFxuICAgICAgICAgICAgQHJlc291cmNlcy5wdXNoKHJlc3VsdClcbiAgICAgICAgICAgIEByZXNvdXJjZXNMb2FkZWQgPSBmYWxzZVxuICAgICAgICAgICAgQGNvbnRleHQucmVzb3VyY2VzLnB1c2gobmFtZTogZmlsZVBhdGgsIGRhdGE6IHJlc3VsdClcbiAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgYSBmb250LlxuICAgICpcbiAgICAqIEBtZXRob2QgZ2V0Rm9udFxuICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZm9udCB0byBnZXQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc2l6ZSAtIFRoZSBzaXplIG9mIHRoZSBmb250IHRvIGdldC5cbiAgICAqIEByZXR1cm4ge2dzLkZvbnR9IFRoZSBmb250IG9yIDxiPm51bGw8L2I+IGlmIG5vIGZvbnQgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgZXhpc3RzLlxuICAgICMjIyAgXG4gICAgZ2V0Rm9udDogKG5hbWUsIHNpemUpIC0+XG4gICAgICAgIHJlc3VsdCA9IG5ldyBGb250KG5hbWUsIHNpemUpXG4gICAgICAgIFxuICAgICAgICBAcmVzb3VyY2VzLnB1c2gocmVzdWx0KVxuICAgICAgICBAcmVzb3VyY2VzTG9hZGVkID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIGEgdmlkZW8uXG4gICAgKlxuICAgICogQG1ldGhvZCBnZXRWaWRlb1xuICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoIC0gUGF0aCB0byB0aGUgdmlkZW8gZmlsZS5cbiAgICAqIEByZXR1cm4ge2dzLlZpZGVvfSBUaGUgdmlkZW8gb3IgPGI+bnVsbDwvYj4gaWYgbm8gdmlkZW8gZXhpc3RzIGF0IHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgICMjIyAgIFxuICAgIGdldFZpZGVvOiAoZmlsZVBhdGgpIC0+XG4gICAgICAgIGlmIGZpbGVQYXRoLmVuZHNXaXRoKFwiL1wiKSB0aGVuIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICAgICByZXN1bHQgPSBAcmVzb3VyY2VzQnlQYXRoW2ZpbGVQYXRoXVxuICAgICAgICBcbiAgICAgICAgaWYgbm90IHJlc3VsdD8gb3IgcmVzdWx0LmRpc3Bvc2VkXG4gICAgICAgICAgICBwcm9maWxlID0gTGFuZ3VhZ2VNYW5hZ2VyLnByb2ZpbGVcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBncy5WaWRlbyhmaWxlUGF0aCwgKGlmIHByb2ZpbGU/IGFuZCBwcm9maWxlLml0ZW1zPyB0aGVuIHByb2ZpbGUuaXRlbXMuY29kZSBlbHNlIG51bGwpKVxuICAgICAgICAgICAgQHJlc291cmNlc0J5UGF0aFtmaWxlUGF0aF0gPSByZXN1bHRcbiAgICAgICAgICAgIEByZXNvdXJjZXMucHVzaChyZXN1bHQpXG4gICAgICAgICAgICBAcmVzb3VyY2VzTG9hZGVkID0gZmFsc2VcbiAgICAgICAgICAgIEBjb250ZXh0LnJlc291cmNlcy5wdXNoKG5hbWU6IGZpbGVQYXRoLCBkYXRhOiByZXN1bHQpXG4gICAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIGEgYml0bWFwLlxuICAgICpcbiAgICAqIEBtZXRob2QgZ2V0Qml0bWFwXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggLSBQYXRoIHRvIHRoZSBiaXRtYXAgZmlsZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBodWUgLSBUaGUgYml0bWFwJ3MgaHVlLiBUaGUgYml0bWFwIHdpbGwgYmUgbG9hZGVkIGFuZCB0aGVuIHJlY29sb3JlZC5cbiAgICAqIEByZXR1cm4ge2dzLkJpdG1hcH0gVGhlIGJpdG1hcCBvciA8Yj5udWxsPC9iPiBpZiBubyBiaXRtYXAgZXhpc3RzIGF0IHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgICMjIyAgIFxuICAgIGdldEJpdG1hcDogKGZpbGVQYXRoLCBodWUpIC0+XG4gICAgICAgIGlmIGZpbGVQYXRoLmVuZHNXaXRoKFwiL1wiKSB0aGVuIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgaHVlID0gaHVlIHx8IDBcbiAgICAgICAgcmVzdWx0ID0gQHJlc291cmNlc0J5UGF0aFtmaWxlUGF0aF0gfHwgQGN1c3RvbUJpdG1hcHNCeUtleVtmaWxlUGF0aF1cbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCByZXN1bHQ/XG4gICAgICAgICAgICBwcm9maWxlID0gTGFuZ3VhZ2VNYW5hZ2VyLnByb2ZpbGVcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBCaXRtYXAoZmlsZVBhdGgsIChpZiBwcm9maWxlPyBhbmQgcHJvZmlsZS5pdGVtcz8gdGhlbiBwcm9maWxlLml0ZW1zLmNvZGUgZWxzZSBudWxsKSwgbm8pXG4gICAgICAgICAgICByZXN1bHQuaHVlID0gaHVlXG4gICAgICAgICAgICByZXN1bHQuZmlsZVBhdGggPSBmaWxlUGF0aFxuICAgICAgICAgICAgQHJlc291cmNlc0J5UGF0aFtmaWxlUGF0aF0gPSByZXN1bHRcbiAgICAgICAgICAgIEByZXNvdXJjZXMucHVzaChyZXN1bHQpXG4gICAgICAgICAgICBAcmVzb3VyY2VzTG9hZGVkID0gZmFsc2VcbiAgICAgICAgICAgIEBjb250ZXh0LnJlc291cmNlcy5wdXNoKG5hbWU6IGZpbGVQYXRoLCBkYXRhOiByZXN1bHQpXG4gICAgICAgIGVsc2UgaWYgbm90IHJlc3VsdC5sb2FkZWQgYW5kIHJlc3VsdC5odWUgIT0gaHVlXG4gICAgICAgICAgICBwcm9maWxlID0gTGFuZ3VhZ2VNYW5hZ2VyLnByb2ZpbGVcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBCaXRtYXAoZmlsZVBhdGgsIChpZiBwcm9maWxlPyBhbmQgcHJvZmlsZS5pdGVtcz8gdGhlbiBwcm9maWxlLml0ZW1zLmNvZGUgZWxzZSBudWxsKSlcbiAgICAgICAgICAgIHJlc3VsdC5odWUgPSBodWVcbiAgICAgICAgICAgIHJlc3VsdC5maWxlUGF0aCA9IGZpbGVQYXRoXG4gICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2gocmVzdWx0KVxuICAgICAgICAgICAgQHJlc291cmNlc0xvYWRlZCA9IGZhbHNlICBcbiAgICAgICAgZWxzZSBpZiBodWUgPiAwXG4gICAgICAgICAgICBodWVCaXRtYXAgPSBAcmVzb3VyY2VzQnlQYXRoSHVlW2ZpbGVQYXRoK1wiQFwiK2h1ZV1cbiAgICAgICAgICAgIGlmIG5vdCBodWVCaXRtYXA/IGFuZCByZXN1bHQubG9hZGVkXG4gICAgICAgICAgICAgICAgaHVlQml0bWFwID0gbmV3IEJpdG1hcChyZXN1bHQuaW1hZ2UpXG4gICAgICAgICAgICAgICAgaHVlQml0bWFwLmNoYW5nZUh1ZShodWUpXG4gICAgICAgICAgICAgICAgQHJlc291cmNlc0J5UGF0aEh1ZVtmaWxlUGF0aCtcIkBcIitodWVdID0gaHVlQml0bWFwXG4gICAgICAgICAgICBpZiBodWVCaXRtYXA/IHRoZW4gcmVzdWx0ID0gaHVlQml0bWFwXG4gICAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcblxuICAgICMjIypcbiAgICAqIEdldHMgYW4gSFRNTCBpbWFnZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldEltYWdlXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggLSBQYXRoIHRvIHRoZSBpbWFnZSBmaWxlLlxuICAgICogQHJldHVybiB7SFRNTEltYWdlRWxlbWVudH0gVGhlIGltYWdlIG9yIDxiPm51bGw8L2I+IGlmIG5vIGltYWdlIGV4aXN0cyBhdCB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICAjIyMgIFxuICAgIGdldEltYWdlOiAoZmlsZVBhdGgpIC0+XG4gICAgICAgIHJlc3VsdCA9IEByZXNvdXJjZXNCeVBhdGhbZmlsZVBhdGhdXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgcmVzdWx0P1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEJpdG1hcChcInJlc291cmNlcy8je2ZpbGVQYXRofS5wbmdcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhbZmlsZVBhdGhdID0gcmVzdWx0XG4gICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2gocmVzdWx0KVxuICAgICAgICAgICAgQHJlc291cmNlc0xvYWRlZCA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG5cbiAgICAjIyMqXG4gICAgKiBHZXRzIGFuIGF1ZGlvIHN0cmVhbS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldEF1ZGlvU3RyZWFtXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gZmlsZVBhdGggLSBQYXRoIHRvIHRoZSBhdWRpbyBmaWxlLlxuICAgICogQHJldHVybiB7Z3MuQXVkaW9CdWZmZXJ9IFRoZSBhdWRpbyBidWZmZXIgb3IgPGI+bnVsbDwvYj4gaWYgbm8gYXVkaW8gZmlsZSBleGlzdHMgYXQgdGhlIHNwZWNpZmllZCBmaWxlIHBhdGguXG4gICAgIyMjIFxuICAgIGdldEF1ZGlvU3RyZWFtOiAoZmlsZVBhdGgpIC0+XG4gICAgICAgIHJlc3VsdCA9IEByZXNvdXJjZXNCeVBhdGhbZmlsZVBhdGhdXG4gICAgICAgIHByb2ZpbGUgPSBMYW5ndWFnZU1hbmFnZXIucHJvZmlsZVxuICAgICAgICBsYW5ndWFnZUNvZGUgPSBpZiBwcm9maWxlPyBhbmQgcHJvZmlsZS5pdGVtcz8gdGhlbiBwcm9maWxlLml0ZW1zLmNvZGUgZWxzZSBudWxsXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgcmVzdWx0P1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEdTLkF1ZGlvQnVmZmVyKGZpbGVQYXRoKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAcmVzb3VyY2VzQnlQYXRoW2ZpbGVQYXRoXSA9IHJlc3VsdFxuICAgICAgICAgICAgQHJlc291cmNlcy5wdXNoKHJlc3VsdClcbiAgICAgICAgICAgIEByZXNvdXJjZXNMb2FkZWQgPSBmYWxzZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAY29udGV4dC5yZXNvdXJjZXMucHVzaChuYW1lOiBmaWxlUGF0aCwgZGF0YTogcmVzdWx0KVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgYW4gYXVkaW8gYnVmZmVyLiBUaGUgYXVkaW8gZGF0YSBpcyBmdWxseSBsb2FkZWQgYW5kIGRlY29kZWQgaW4gbWVtb3J5LiBJdCBpcyByZWNvbW1lbmVkZWRcbiAgICAqIGZvciBzb3VuZCBlZmZlY3RzIGJ1dCBmb3IgYSBsb25nIGJhY2tncm91bmQgbXVzaWMsIDxiPmdldEF1ZGlvU3RyZWFtPC9iPiBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLiBUaGF0IGlzIGVzcGVjaWFsbHlcbiAgICAqIHRoZSBjYXNlIG9uIG1vYmlsZSBkZXZpY2VzLlxuICAgICpcbiAgICAqIEBtZXRob2QgZ2V0QXVkaW9CdWZmZXJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aCAtIFBhdGggdG8gdGhlIGF1ZGlvIGZpbGUuXG4gICAgKiBAcmV0dXJuIHtncy5BdWRpb0J1ZmZlcn0gVGhlIGF1ZGlvIGJ1ZmZlciBvciA8Yj5udWxsPC9iPiBpZiBubyBhdWRpbyBmaWxlIGV4aXN0cyBhdCB0aGUgc3BlY2lmaWVkIGZpbGUgcGF0aC5cbiAgICAjIyMgXG4gICAgZ2V0QXVkaW9CdWZmZXI6IChmaWxlUGF0aCkgLT5cbiAgICAgICAgcmVzdWx0ID0gQHJlc291cmNlc0J5UGF0aFtmaWxlUGF0aF1cbiAgICAgICAgcHJvZmlsZSA9IExhbmd1YWdlTWFuYWdlci5wcm9maWxlXG4gICAgICAgIGxhbmd1YWdlQ29kZSA9IGlmIHByb2ZpbGU/IGFuZCBwcm9maWxlLml0ZW1zPyB0aGVuIHByb2ZpbGUuaXRlbXMuY29kZSBlbHNlIG51bGxcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCByZXN1bHQ/XG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgR1MuQXVkaW9CdWZmZXIoZmlsZVBhdGgpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhbZmlsZVBhdGhdID0gcmVzdWx0XG4gICAgICAgICAgICBAcmVzb3VyY2VzLnB1c2gocmVzdWx0KVxuICAgICAgICAgICAgQHJlc291cmNlc0xvYWRlZCA9IGZhbHNlXG4gICAgICAgIFxuICAgICAgICAgICAgQGNvbnRleHQucmVzb3VyY2VzLnB1c2gobmFtZTogZmlsZVBhdGgsIGRhdGE6IHJlc3VsdClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGxvYWRpbmcgcHJvY2Vzcy4gTmVlZHMgdG8gYmUgY2FsbGVkIG9uY2UgcGVyIGZyYW1lIHRvIGtlZXAgXG4gICAgKiB0aGUgUmVzb3VyY2VNYW5hZ2VyIHVwIHRvIGRhdGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgaWYgbm90IEBldmVudHM/IHRoZW4gQGV2ZW50cyA9IG5ldyBncy5FdmVudEVtaXR0ZXIoKVxuICAgICAgICBpZiBub3QgQHJlc291cmNlc0xvYWRlZFxuICAgICAgICAgICAgQHJlc291cmNlc0xvYWRlZCA9IHRydWVcbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uQHJlc291cmNlcy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgaWYgbm90IEByZXNvdXJjZXNbaV0ubG9hZGVkXG4gICAgICAgICAgICAgICAgICAgIEByZXNvdXJjZXNMb2FkZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgQHJlc291cmNlc1tpXS5odWU/IGFuZCBAcmVzb3VyY2VzW2ldLmh1ZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgYml0bWFwID0gbmV3IEJpdG1hcChAcmVzb3VyY2VzW2ldLmltYWdlKVxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhbQHJlc291cmNlc1tpXS5maWxlUGF0aF0gPSBiaXRtYXBcbiAgICAgICAgICAgICAgICAgICAgQHJlc291cmNlc1tpXS5jaGFuZ2VIdWUoQHJlc291cmNlc1tpXS5odWUpXG4gICAgICAgICAgICAgICAgICAgIEByZXNvdXJjZXNCeVBhdGhIdWVbQHJlc291cmNlc1tpXS5maWxlUGF0aCtcIkBcIitAcmVzb3VyY2VzW2ldLmh1ZV0gPSBAcmVzb3VyY2VzW2ldXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBAcmVzb3VyY2VzW2ldLmZpbGVQYXRoXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBAcmVzb3VyY2VzW2ldLmh1ZVxuICAgICAgICAgICAgaWYgQHJlc291cmNlc0xvYWRlZFxuICAgICAgICAgICAgICAgIEBldmVudHMuZW1pdChcImxvYWRlZFwiLCB0aGlzKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcblxud2luZG93LlJlc291cmNlTWFuYWdlciA9IFJlc291cmNlTWFuYWdlclxuZ3MuUmVzb3VyY2VNYW5hZ2VyID0gUmVzb3VyY2VNYW5hZ2VyIl19
//# sourceURL=ResourceManager_58.js