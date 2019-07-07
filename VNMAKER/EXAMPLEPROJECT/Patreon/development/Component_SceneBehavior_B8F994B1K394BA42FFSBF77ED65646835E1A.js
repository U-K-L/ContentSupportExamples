var Component_SceneBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_SceneBehavior = (function(superClass) {
  extend(Component_SceneBehavior, superClass);


  /**
  * The base class of all scene-behavior components. A scene-behavior component
  * define the logic of a single game scene. 
  *
  * @module gs
  * @class Component_SceneBehavior
  * @extends gs.Component_Container
  * @memberof gs
   */

  function Component_SceneBehavior() {
    Component_SceneBehavior.__super__.constructor.call(this);
    this.loadingScreenVisible = false;
  }


  /**
  * Initializes the scene. 
  *
  * @method initialize
  * @abstract
   */

  Component_SceneBehavior.prototype.initialize = function() {};


  /**
  * Disposes the scene.
  *
  * @method dispose
   */

  Component_SceneBehavior.prototype.dispose = function() {
    var ref;
    if (!GameManager.inLivePreview) {
      ResourceManager.dispose();
    }
    return (ref = this.object.events) != null ? ref.emit("dispose", this.object) : void 0;
  };


  /**
  * Called if the preparation and transition
  * is done and the is ready to start.
  *
  * @method start
   */

  Component_SceneBehavior.prototype.start = function() {};


  /**
  * Prepares all visual game object for the scene.
  *
  * @method prepareVisual
  * @abstract
   */

  Component_SceneBehavior.prototype.prepareVisual = function() {};


  /**
  * Prepares all data for the scene and loads the necessary graphic and audio resources.
  *
  * @method prepareData
  * @abstract
   */

  Component_SceneBehavior.prototype.prepareData = function() {};


  /**
  * Prepares for a screen-transition.
  *
  * @method prepareTransition
  * @param {Object} transitionData - Object containing additional data for the transition 
  * like graphic, duration and vague.
   */

  Component_SceneBehavior.prototype.prepareTransition = function(transitionData) {
    var ref;
    if ((transitionData != null ? (ref = transitionData.graphic) != null ? ref.name.length : void 0 : void 0) > 0) {
      return ResourceManager.getBitmap("Graphics/Masks/" + transitionData.graphic.name);
    }
  };


  /**
  * Executes a screen-transition.
  *
  * @method transition
  * @param {Object} transitionData - Object containing additional data for the transition 
  * like graphic, duration and vague.
   */

  Component_SceneBehavior.prototype.transition = function(transitionData) {
    var ref;
    if ($PARAMS.preview) {
      return Graphics.transition(0);
    } else {
      transitionData = transitionData || SceneManager.transitionData;
      if ((transitionData != null ? (ref = transitionData.graphic) != null ? ref.name.length : void 0 : void 0) > 0) {
        return Graphics.transition(transitionData.duration, ResourceManager.getBitmap("Graphics/Masks/" + transitionData.graphic.name), transitionData.vague || 30);
      } else {
        return Graphics.transition(transitionData.duration);
      }
    }
  };


  /**
  * Update the scene's content.
  *
  * @method updateContent
  * @abstract
   */

  Component_SceneBehavior.prototype.updateContent = function() {};


  /**
  * Called once per frame while a scene is loading. Can be used to display
  * loading-message/animation.
  *
  * @method loading
   */

  Component_SceneBehavior.prototype.loading = function() {
    if (this.loadingBackgroundSprite == null) {
      this.loadingBackgroundSprite = {};
      if (Graphics.frozen) {
        return this.transition({
          duration: 0
        });
      }
    }
  };


  /**
  * Update the scene.
  *
  * @method update
   */

  Component_SceneBehavior.prototype.update = function() {
    Component_SceneBehavior.__super__.update.call(this);
    if (DataManager.documentsLoaded) {
      if (this.object.loadingData && !this.object.initialized) {
        this.prepareData();
      }
      this.object.loadingData = !DataManager.documentsLoaded;
    }
    if (!this.object.loadingData && ResourceManager.resourcesLoaded) {
      if (this.object.loadingResources && !this.object.initialized) {
        if (!this.loadingScreenVisible) {
          this.prepareVisual();
        }
        this.object.initialized = true;
      }
      this.object.loadingResources = false;
    }
    if (ResourceManager.resourcesLoaded && DataManager.documentsLoaded) {
      this.object.loading = false;
      if (Graphics.frozen && this.object.preparing) {
        return Graphics.update();
      } else {
        if (this.loadingScreenVisible) {
          if (this.object.loaded) {
            this.loadingScreenVisible = false;
            this.object.loaded = true;
            return this.updateContent();
          } else {
            if (!Graphics.frozen) {
              Graphics.freeze();
            }
            this.object.loaded = true;
            this.object.setup();
            this.prepareVisual();
            this.loadingScreenVisible = false;
            Graphics.update();
            return Input.update();
          }
        } else {
          if (this.object.preparing) {
            this.object.preparing = false;
            this.start();
          }
          Graphics.update();
          this.updateContent();
          return Input.update();
        }
      }
    } else {
      this.loadingScreenVisible = true;
      Graphics.update();
      return this.loading();
    }
  };

  return Component_SceneBehavior;

})(gs.Component_Container);

gs.Component_SceneBehavior = Component_SceneBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsdUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OztFQVNhLGlDQUFBO0lBQ1QsdURBQUE7SUFFQSxJQUFDLENBQUEsb0JBQUQsR0FBd0I7RUFIZjs7O0FBS2I7Ozs7Ozs7b0NBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTs7O0FBRVo7Ozs7OztvQ0FLQSxPQUFBLEdBQVMsU0FBQTtBQUNMLFFBQUE7SUFBQSxJQUFHLENBQUksV0FBVyxDQUFDLGFBQW5CO01BQ0ksZUFBZSxDQUFDLE9BQWhCLENBQUEsRUFESjs7bURBRWMsQ0FBRSxJQUFoQixDQUFxQixTQUFyQixFQUFnQyxJQUFDLENBQUEsTUFBakM7RUFISzs7O0FBTVQ7Ozs7Ozs7b0NBTUEsS0FBQSxHQUFPLFNBQUEsR0FBQTs7O0FBRVA7Ozs7Ozs7b0NBTUEsYUFBQSxHQUFlLFNBQUEsR0FBQTs7O0FBRWY7Ozs7Ozs7b0NBTUEsV0FBQSxHQUFhLFNBQUEsR0FBQTs7O0FBRWI7Ozs7Ozs7O29DQU9BLGlCQUFBLEdBQW1CLFNBQUMsY0FBRDtBQUNmLFFBQUE7SUFBQSwwRUFBMEIsQ0FBRSxJQUFJLENBQUMseUJBQTlCLEdBQXVDLENBQTFDO2FBQ0ksZUFBZSxDQUFDLFNBQWhCLENBQTBCLGlCQUFBLEdBQWtCLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBbkUsRUFESjs7RUFEZTs7O0FBSW5COzs7Ozs7OztvQ0FPQSxVQUFBLEdBQVksU0FBQyxjQUFEO0FBQ1IsUUFBQTtJQUFBLElBQUcsT0FBTyxDQUFDLE9BQVg7YUFDSSxRQUFRLENBQUMsVUFBVCxDQUFvQixDQUFwQixFQURKO0tBQUEsTUFBQTtNQUdJLGNBQUEsR0FBaUIsY0FBQSxJQUFrQixZQUFZLENBQUM7TUFDaEQsMEVBQTBCLENBQUUsSUFBSSxDQUFDLHlCQUE5QixHQUF1QyxDQUExQztlQUNJLFFBQVEsQ0FBQyxVQUFULENBQW9C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Q0FBQSxPQUFELENBQUEsRUEvQko7O0VBZEk7Ozs7R0E5RzBCLEVBQUUsQ0FBQzs7QUFnS3pDLEVBQUUsQ0FBQyx1QkFBSCxHQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X1NjZW5lQmVoYXZpb3JcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9TY2VuZUJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50X0NvbnRhaW5lclxuICAgICMjIypcbiAgICAqIFRoZSBiYXNlIGNsYXNzIG9mIGFsbCBzY2VuZS1iZWhhdmlvciBjb21wb25lbnRzLiBBIHNjZW5lLWJlaGF2aW9yIGNvbXBvbmVudFxuICAgICogZGVmaW5lIHRoZSBsb2dpYyBvZiBhIHNpbmdsZSBnYW1lIHNjZW5lLiBcbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1NjZW5lQmVoYXZpb3JcbiAgICAqIEBleHRlbmRzIGdzLkNvbXBvbmVudF9Db250YWluZXJcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIFxuICAgICAgICBAbG9hZGluZ1NjcmVlblZpc2libGUgPSBub1xuXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIHNjZW5lLiBcbiAgICAqXG4gICAgKiBAbWV0aG9kIGluaXRpYWxpemVcbiAgICAqIEBhYnN0cmFjdFxuICAgICMjI1xuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjICBcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBpZiBub3QgR2FtZU1hbmFnZXIuaW5MaXZlUHJldmlld1xuICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmRpc3Bvc2UoKVxuICAgICAgICBAb2JqZWN0LmV2ZW50cz8uZW1pdChcImRpc3Bvc2VcIiwgQG9iamVjdClcbiAgICAgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoZSBwcmVwYXJhdGlvbiBhbmQgdHJhbnNpdGlvblxuICAgICogaXMgZG9uZSBhbmQgdGhlIGlzIHJlYWR5IHRvIHN0YXJ0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAjIyMgIFxuICAgIHN0YXJ0OiAtPlxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBQcmVwYXJlcyBhbGwgdmlzdWFsIGdhbWUgb2JqZWN0IGZvciB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlVmlzdWFsXG4gICAgKiBAYWJzdHJhY3RcbiAgICAjIyMgIFxuICAgIHByZXBhcmVWaXN1YWw6IC0+XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFByZXBhcmVzIGFsbCBkYXRhIGZvciB0aGUgc2NlbmUgYW5kIGxvYWRzIHRoZSBuZWNlc3NhcnkgZ3JhcGhpYyBhbmQgYXVkaW8gcmVzb3VyY2VzLlxuICAgICpcbiAgICAqIEBtZXRob2QgcHJlcGFyZURhdGFcbiAgICAqIEBhYnN0cmFjdFxuICAgICMjIyBcbiAgICBwcmVwYXJlRGF0YTogLT5cbiAgICAgXG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMgZm9yIGEgc2NyZWVuLXRyYW5zaXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlVHJhbnNpdGlvblxuICAgICogQHBhcmFtIHtPYmplY3R9IHRyYW5zaXRpb25EYXRhIC0gT2JqZWN0IGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhIGZvciB0aGUgdHJhbnNpdGlvbiBcbiAgICAqIGxpa2UgZ3JhcGhpYywgZHVyYXRpb24gYW5kIHZhZ3VlLlxuICAgICMjIyAgICBcbiAgICBwcmVwYXJlVHJhbnNpdGlvbjogKHRyYW5zaXRpb25EYXRhKSAtPlxuICAgICAgICBpZiB0cmFuc2l0aW9uRGF0YT8uZ3JhcGhpYz8ubmFtZS5sZW5ndGggPiAwXG4gICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3t0cmFuc2l0aW9uRGF0YS5ncmFwaGljLm5hbWV9XCIpXG4gICAgXG4gICAgIyMjKlxuICAgICogRXhlY3V0ZXMgYSBzY3JlZW4tdHJhbnNpdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHRyYW5zaXRpb25cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2l0aW9uRGF0YSAtIE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgZGF0YSBmb3IgdGhlIHRyYW5zaXRpb24gXG4gICAgKiBsaWtlIGdyYXBoaWMsIGR1cmF0aW9uIGFuZCB2YWd1ZS5cbiAgICAjIyMgICAgICAgICBcbiAgICB0cmFuc2l0aW9uOiAodHJhbnNpdGlvbkRhdGEpIC0+XG4gICAgICAgIGlmICRQQVJBTVMucHJldmlld1xuICAgICAgICAgICAgR3JhcGhpY3MudHJhbnNpdGlvbigwKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0cmFuc2l0aW9uRGF0YSA9IHRyYW5zaXRpb25EYXRhIHx8IFNjZW5lTWFuYWdlci50cmFuc2l0aW9uRGF0YVxuICAgICAgICAgICAgaWYgdHJhbnNpdGlvbkRhdGE/LmdyYXBoaWM/Lm5hbWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIEdyYXBoaWNzLnRyYW5zaXRpb24odHJhbnNpdGlvbkRhdGEuZHVyYXRpb24sIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9NYXNrcy8je3RyYW5zaXRpb25EYXRhLmdyYXBoaWMubmFtZX1cIiksIHRyYW5zaXRpb25EYXRhLnZhZ3VlIHx8IDMwKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEdyYXBoaWNzLnRyYW5zaXRpb24odHJhbnNpdGlvbkRhdGEuZHVyYXRpb24pXG4gICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlIHRoZSBzY2VuZSdzIGNvbnRlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVDb250ZW50XG4gICAgKiBAYWJzdHJhY3RcbiAgICAjIyMgICAgICAgICBcbiAgICB1cGRhdGVDb250ZW50OiAtPlxuICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCBvbmNlIHBlciBmcmFtZSB3aGlsZSBhIHNjZW5lIGlzIGxvYWRpbmcuIENhbiBiZSB1c2VkIHRvIGRpc3BsYXlcbiAgICAqIGxvYWRpbmctbWVzc2FnZS9hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkaW5nXG4gICAgIyMjIFxuICAgIGxvYWRpbmc6IC0+XG4gICAgICAgIGlmIG5vdCBAbG9hZGluZ0JhY2tncm91bmRTcHJpdGU/XG4gICAgICAgICAgICBAbG9hZGluZ0JhY2tncm91bmRTcHJpdGUgPSB7fVxuICAgICAgICAgICAgaWYgR3JhcGhpY3MuZnJvemVuIHRoZW4gQHRyYW5zaXRpb24oeyBkdXJhdGlvbjogMCB9KVxuXG4gICAgIyMjKlxuICAgICogVXBkYXRlIHRoZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgIGlmIERhdGFNYW5hZ2VyLmRvY3VtZW50c0xvYWRlZFxuICAgICAgICAgICAgaWYgQG9iamVjdC5sb2FkaW5nRGF0YSBhbmQgbm90IEBvYmplY3QuaW5pdGlhbGl6ZWQgdGhlbiBAcHJlcGFyZURhdGEoKVxuICAgICAgICAgICAgQG9iamVjdC5sb2FkaW5nRGF0YSA9ICFEYXRhTWFuYWdlci5kb2N1bWVudHNMb2FkZWRcbiAgICAgICAgXG4gICAgICAgIGlmIG5vdCBAb2JqZWN0LmxvYWRpbmdEYXRhIGFuZCBSZXNvdXJjZU1hbmFnZXIucmVzb3VyY2VzTG9hZGVkXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmxvYWRpbmdSZXNvdXJjZXMgYW5kIG5vdCBAb2JqZWN0LmluaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgaWYgbm90IEBsb2FkaW5nU2NyZWVuVmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBAcHJlcGFyZVZpc3VhbCgpIFxuICAgICAgICAgICAgICAgIEBvYmplY3QuaW5pdGlhbGl6ZWQgPSB5ZXNcbiAgICAgICAgICAgIEBvYmplY3QubG9hZGluZ1Jlc291cmNlcyA9IGZhbHNlXG4gICAgXG4gICAgICAgIGlmIFJlc291cmNlTWFuYWdlci5yZXNvdXJjZXNMb2FkZWQgYW5kIERhdGFNYW5hZ2VyLmRvY3VtZW50c0xvYWRlZFxuICAgICAgICAgICAgQG9iamVjdC5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgXG4gICAgICAgICAgICBpZiBHcmFwaGljcy5mcm96ZW4gYW5kIEBvYmplY3QucHJlcGFyaW5nXG4gICAgICAgICAgICAgICAgR3JhcGhpY3MudXBkYXRlKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBAbG9hZGluZ1NjcmVlblZpc2libGVcbiAgICAgICAgICAgICAgICAgICAgaWYgQG9iamVjdC5sb2FkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIEBsb2FkaW5nU2NyZWVuVmlzaWJsZSA9IG5vXG4gICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmxvYWRlZCA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgQHVwZGF0ZUNvbnRlbnQoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgR3JhcGhpY3MuZnJvemVuIHRoZW4gR3JhcGhpY3MuZnJlZXplKClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QubG9hZGVkID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LnNldHVwKClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBwcmVwYXJlVmlzdWFsKCkgXG4gICAgICAgICAgICAgICAgICAgICAgICBAbG9hZGluZ1NjcmVlblZpc2libGUgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgR3JhcGhpY3MudXBkYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIElucHV0LnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBpZiBAb2JqZWN0LnByZXBhcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5wcmVwYXJpbmcgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgQHN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgR3JhcGhpY3MudXBkYXRlKClcbiAgICAgICAgICAgICAgICAgICAgQHVwZGF0ZUNvbnRlbnQoKVxuICAgICAgICAgICAgICAgICAgICBJbnB1dC51cGRhdGUoKVxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBsb2FkaW5nU2NyZWVuVmlzaWJsZSA9IHllc1xuICAgICAgICAgICAgR3JhcGhpY3MudXBkYXRlKClcbiAgICAgICAgICAgICNJbnB1dC51cGRhdGUoKVxuICAgICAgICAgICAgQGxvYWRpbmcoKVxuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBcbmdzLkNvbXBvbmVudF9TY2VuZUJlaGF2aW9yID0gQ29tcG9uZW50X1NjZW5lQmVoYXZpb3IiXX0=
//# sourceURL=Component_SceneBehavior_8.js