var Component_CharacterBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_CharacterBehavior = (function(superClass) {
  extend(Component_CharacterBehavior, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_CharacterBehavior.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A behavior-component which handles the character-specific behavior like
  * talking and idle.
  *
  * @module vn
  * @class Component_CharacterBehavior
  * @extends gs.Component
  * @memberof vn
  * @constructor
   */

  function Component_CharacterBehavior() {
    Component_CharacterBehavior.__super__.constructor.apply(this, arguments);

    /**
    * @property imageIndex
    * @type number
    * @private
     */
    this.imageIndex = 0;

    /**
    * @property imageDuration
    * @type number
    * @private
     */
    this.imageDuration = 30;

    /**
    * @property idleTime
    * @type number
    * @private
     */
    this.idleTime = 120 + 120 * Math.random();

    /**
    * Indicates if the character is currently talking.
    * @property talking
    * @type boolean
     */
    this.talking = false;

    /**
    * @property initialized
    * @type boolean
    * @private
     */
    this.initialized = false;

    /**
    * Temporary game settings used by this character.
    * @property imageIndex
    * @type number
     */
    this.tempSettings = GameManager.tempSettings;
  }


  /**
  * Adds event-handlers
  *
  * @method setupEventHandlers
   */

  Component_CharacterBehavior.prototype.setupEventHandlers = function() {
    gs.GlobalEventManager.on("talkingStarted", (function(_this) {
      return function(e) {
        var ref;
        if (((ref = e.character) != null ? ref.index : void 0) === _this.object.rid) {
          _this.object.talking = true;
          return _this.imageIndex = 0;
        }
      };
    })(this));
    return gs.GlobalEventManager.on("talkingEnded", (function(_this) {
      return function(e) {
        var ref;
        if (((ref = e.character) != null ? ref.index : void 0) === _this.object.rid) {
          _this.object.talking = false;
          return _this.imageIndex = 0;
        }
      };
    })(this));
  };


  /**
  * Initializes the component. Adds event-handlers.
  *
  * @method setup
   */

  Component_CharacterBehavior.prototype.setup = function() {
    this.initialized = true;
    this.setupEventHandlers();
    return this.update();
  };


  /**
  * Changes the characters expression using blending. If the duration is set
  * to 0 the expression change is executed immediately without animation.
  *
  * @method changeExpression
  * @param {vn.CharacterExpression} expression - The character expression database-record.
  * @param {number} duration - The animation-duration in frames. Pass 0 to skip animation.
  * @param {function} [callback] An optional callback-function called when the change is finished.
   */

  Component_CharacterBehavior.prototype.changeExpression = function(expression, animation, easing, duration, callback) {
    var picture, prevExpression, ref;
    prevExpression = this.object.expression;
    this.object.expression = expression;
    if ((prevExpression != null ? (ref = prevExpression.idle) != null ? ref.length : void 0 : void 0) > 0 && (this.object.expression != null) && prevExpression !== this.object.expression) {
      this.imageIndex = 0;
      picture = new gs.Object_Picture();
      picture.imageFolder = "Graphics/Characters";
      picture.image = prevExpression.idle[0].resource.name;
      picture.update();
      picture.dstRect.x = this.object.dstRect.x + Math.round((this.object.dstRect.width - picture.dstRect.width) / 2);
      picture.dstRect.y = this.object.dstRect.y + Math.round((this.object.dstRect.height - picture.dstRect.height) / 2);
      picture.zIndex = this.object.zIndex - 1;
      picture.zoom.x = this.object.zoom.x;
      picture.zoom.y = this.object.zoom.y;
      picture.update();
      this.object.parent.addObject(picture);
      switch (animation.fading) {
        case 0:
          this.object.animator.appear(this.object.dstRect.x, this.object.dstRect.y, animation, easing, duration, function() {
            picture.dispose();
            return typeof callback === "function" ? callback() : void 0;
          });
          return this.object.update();
        case 1:
          picture.animator.disappear(animation, easing, duration, function(object) {
            return object.dispose();
          });
          picture.update();
          this.object.animator.appear(this.object.dstRect.x, this.object.dstRect.y, animation, easing, duration, function(object) {
            return typeof callback === "function" ? callback() : void 0;
          });
          return this.object.update();
      }
    } else {
      return typeof callback === "function" ? callback() : void 0;
    }
  };


  /**
  * Lets the character start talking.
  *
  * @method startTalking
   */

  Component_CharacterBehavior.prototype.startTalking = function() {
    return this.object.talking = true;
  };


  /**
  * Lets the character stop with talking.
  *
  * @method stopTalking
   */

  Component_CharacterBehavior.prototype.stopTalking = function() {
    return this.object.talking = false;
  };


  /**
  * Updates character's talking-animation.
  *
  * @method updateTalking
  * @protected
   */

  Component_CharacterBehavior.prototype.updateTalking = function() {
    var imageIndex, ref, ref1, speed;
    if (this.tempSettings.skip && ((ref = this.object.expression.talking) != null ? ref.length : void 0) > 0) {
      this.object.talking = false;
      this.imageIndex = 0;
      return this.object.image = this.object.expression.talking[this.imageIndex].resource.name;
    } else if (this.object.expression != null) {
      if (((ref1 = this.object.expression.talking) != null ? ref1.length : void 0) > 0) {
        this.imageDuration--;
        if (this.imageDuration <= 0) {
          imageIndex = this.imageIndex;
          while (imageIndex === this.imageIndex && this.object.expression.talking.length > 1) {
            this.imageIndex = Math.round(Math.random() * (this.object.expression.talking.length - 1));
          }
          speed = this.object.expression.talkingSpeed / 100 * 5;
          this.imageDuration = speed + Math.round(speed * Math.random());
        }
        return this.object.image = this.object.expression.talking[this.imageIndex].resource.name;
      } else {
        return this.updateIdle();
      }
    }
  };


  /**
  * Updates character's idle-animation.
  *
  * @method updateIdle
  * @protected
   */

  Component_CharacterBehavior.prototype.updateIdle = function() {
    var ref;
    if ((this.object.expression != null) && ((ref = this.object.expression.idle) != null ? ref.length : void 0) > 0) {
      if (this.imageDuration <= 0) {
        this.idleTime--;
        if (this.idleTime <= 0) {
          this.idleTime = this.object.expression.idleTime.start + (this.object.expression.idleTime.end - this.object.expression.idleTime.start) * Math.random();
          this.imageDuration = this.object.expression.idleSpeed / 100 * 5;
        }
      }
      if (this.imageDuration > 0) {
        this.imageDuration--;
        if (this.imageDuration <= 0) {
          this.imageIndex++;
          if (this.imageIndex >= this.object.expression.idle.length) {
            this.imageIndex = 0;
            this.imageDuration = 0;
          } else {
            this.imageDuration = this.object.expression.idleSpeed / 100 * 5;
          }
        }
      }
      return this.object.image = this.object.expression.idle[this.imageIndex].resource.name;
    }
  };


  /**
  * Updates character logic & animation-handling.
  *
  * @method update
   */

  Component_CharacterBehavior.prototype.update = function() {
    Component_CharacterBehavior.__super__.update.apply(this, arguments);
    if (!this.initialized) {
      this.setup();
    }
    if (this.object.talking) {
      return this.updateTalking();
    } else {
      return this.updateIdle();
    }
  };

  return Component_CharacterBehavior;

})(gs.Component);

vn.Component_CharacterBehavior = Component_CharacterBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsMkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7O3dDQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7RUFVYSxxQ0FBQTtJQUNULDhEQUFBLFNBQUE7O0FBRUE7Ozs7O0lBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYzs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQjs7QUFFakI7Ozs7O0lBTUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLEdBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxNQUFMLENBQUE7O0FBQ3hCOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBZTs7QUFFZjs7Ozs7SUFLQSxJQUFDLENBQUEsWUFBRCxHQUFnQixXQUFXLENBQUM7RUEzQ25COzs7QUE2Q2I7Ozs7Ozt3Q0FLQSxrQkFBQSxHQUFvQixTQUFBO0lBQ2hCLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUF0QixDQUF5QixnQkFBekIsRUFBMkMsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDdkMsWUFBQTtRQUFBLHNDQUFjLENBQUUsZUFBYixLQUFzQixLQUFDLENBQUEsTUFBTSxDQUFDLEdBQWpDO1VBQ0ksS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLEdBQWtCO2lCQUNsQixLQUFDLENBQUEsVUFBRCxHQUFjLEVBRmxCOztNQUR1QztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0M7V0FJQSxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBdEIsQ0FBeUIsY0FBekIsRUFBeUMsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDckMsWUFBQTtRQUFBLHNDQUFj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MkJBQUgsR0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IENvbXBvbmVudF9DaGFyYWN0ZXJCZWhhdmlvclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0NoYXJhY3RlckJlaGF2aW9yIGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgIyMjKlxuICAgICogQ2FsbGVkIGlmIHRoaXMgb2JqZWN0IGluc3RhbmNlIGlzIHJlc3RvcmVkIGZyb20gYSBkYXRhLWJ1bmRsZS4gSXQgY2FuIGJlIHVzZWRcbiAgICAqIHJlLWFzc2lnbiBldmVudC1oYW5kbGVyLCBhbm9ueW1vdXMgZnVuY3Rpb25zLCBldGMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBIGJlaGF2aW9yLWNvbXBvbmVudCB3aGljaCBoYW5kbGVzIHRoZSBjaGFyYWN0ZXItc3BlY2lmaWMgYmVoYXZpb3IgbGlrZVxuICAgICogdGFsa2luZyBhbmQgaWRsZS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHZuXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0NoYXJhY3RlckJlaGF2aW9yXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiB2blxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgICAgIHN1cGVyXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZUluZGV4XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZUluZGV4ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZUR1cmF0aW9uXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZUR1cmF0aW9uID0gMzBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgaWRsZVRpbWVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAjIyNcbiAgICAgICAgXG4gICAgICAgIEBpZGxlVGltZSA9IDEyMCArIDEyMCAqIE1hdGgucmFuZG9tKClcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgY2hhcmFjdGVyIGlzIGN1cnJlbnRseSB0YWxraW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSB0YWxraW5nXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQHRhbGtpbmcgPSBub1xuICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgaW5pdGlhbGl6ZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbml0aWFsaXplZCA9IG5vXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGVtcG9yYXJ5IGdhbWUgc2V0dGluZ3MgdXNlZCBieSB0aGlzIGNoYXJhY3Rlci5cbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VJbmRleFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQHRlbXBTZXR0aW5ncyA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5nc1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBBZGRzIGV2ZW50LWhhbmRsZXJzXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyMgXG4gICAgc2V0dXBFdmVudEhhbmRsZXJzOiAtPlxuICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIub24gXCJ0YWxraW5nU3RhcnRlZFwiLCAoZSkgPT4gXG4gICAgICAgICAgICBpZiBlLmNoYXJhY3Rlcj8uaW5kZXggPT0gQG9iamVjdC5yaWRcbiAgICAgICAgICAgICAgICBAb2JqZWN0LnRhbGtpbmcgPSB5ZXNcbiAgICAgICAgICAgICAgICBAaW1hZ2VJbmRleCA9IDBcbiAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLm9uIFwidGFsa2luZ0VuZGVkXCIsIChlKSA9PiBcbiAgICAgICAgICAgIGlmIGUuY2hhcmFjdGVyPy5pbmRleCA9PSBAb2JqZWN0LnJpZFxuICAgICAgICAgICAgICAgIEBvYmplY3QudGFsa2luZyA9IG5vXG4gICAgICAgICAgICAgICAgQGltYWdlSW5kZXggPSAwXG4gICAgICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIGNvbXBvbmVudC4gQWRkcyBldmVudC1oYW5kbGVycy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIEBpbml0aWFsaXplZCA9IHllc1xuICAgICAgICBAc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgQHVwZGF0ZSgpXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2hhbmdlcyB0aGUgY2hhcmFjdGVycyBleHByZXNzaW9uIHVzaW5nIGJsZW5kaW5nLiBJZiB0aGUgZHVyYXRpb24gaXMgc2V0XG4gICAgKiB0byAwIHRoZSBleHByZXNzaW9uIGNoYW5nZSBpcyBleGVjdXRlZCBpbW1lZGlhdGVseSB3aXRob3V0IGFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNoYW5nZUV4cHJlc3Npb25cbiAgICAqIEBwYXJhbSB7dm4uQ2hhcmFjdGVyRXhwcmVzc2lvbn0gZXhwcmVzc2lvbiAtIFRoZSBjaGFyYWN0ZXIgZXhwcmVzc2lvbiBkYXRhYmFzZS1yZWNvcmQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgYW5pbWF0aW9uLWR1cmF0aW9uIGluIGZyYW1lcy4gUGFzcyAwIHRvIHNraXAgYW5pbWF0aW9uLlxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBBbiBvcHRpb25hbCBjYWxsYmFjay1mdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY2hhbmdlIGlzIGZpbmlzaGVkLiBcbiAgICAjIyNcbiAgICBjaGFuZ2VFeHByZXNzaW9uOiAoZXhwcmVzc2lvbiwgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCBjYWxsYmFjaykgLT5cbiAgICAgICAgcHJldkV4cHJlc3Npb24gPSBAb2JqZWN0LmV4cHJlc3Npb25cbiAgICAgICAgQG9iamVjdC5leHByZXNzaW9uID0gZXhwcmVzc2lvblxuICAgICAgICBcbiAgICAgICAgaWYgcHJldkV4cHJlc3Npb24/LmlkbGU/Lmxlbmd0aCA+IDAgYW5kIEBvYmplY3QuZXhwcmVzc2lvbj8gYW5kIHByZXZFeHByZXNzaW9uICE9IEBvYmplY3QuZXhwcmVzc2lvblxuICAgICAgICAgICAgQGltYWdlSW5kZXggPSAwXG5cbiAgICAgICAgICAgIHBpY3R1cmUgPSBuZXcgZ3MuT2JqZWN0X1BpY3R1cmUoKVxuICAgICAgICAgICAgcGljdHVyZS5pbWFnZUZvbGRlciA9IFwiR3JhcGhpY3MvQ2hhcmFjdGVyc1wiXG4gICAgICAgICAgICBwaWN0dXJlLmltYWdlID0gcHJldkV4cHJlc3Npb24uaWRsZVswXS5yZXNvdXJjZS5uYW1lXG4gICAgICAgICAgICBwaWN0dXJlLnVwZGF0ZSgpXG4gICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QueCA9IEBvYmplY3QuZHN0UmVjdC54ICsgTWF0aC5yb3VuZCgoQG9iamVjdC5kc3RSZWN0LndpZHRoIC0gcGljdHVyZS5kc3RSZWN0LndpZHRoKSAvIDIpXG4gICAgICAgICAgICBwaWN0dXJlLmRzdFJlY3QueSA9IEBvYmplY3QuZHN0UmVjdC55ICsgTWF0aC5yb3VuZCgoQG9iamVjdC5kc3RSZWN0LmhlaWdodCAtIHBpY3R1cmUuZHN0UmVjdC5oZWlnaHQpIC8gMilcbiAgICAgICAgICAgIHBpY3R1cmUuekluZGV4ID0gQG9iamVjdC56SW5kZXggLSAxXG4gICAgICAgICAgICBwaWN0dXJlLnpvb20ueCA9IEBvYmplY3Quem9vbS54XG4gICAgICAgICAgICBwaWN0dXJlLnpvb20ueSA9IEBvYmplY3Quem9vbS55XG4gICAgICAgICAgICBwaWN0dXJlLnVwZGF0ZSgpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQG9iamVjdC5wYXJlbnQuYWRkT2JqZWN0KHBpY3R1cmUpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN3aXRjaCBhbmltYXRpb24uZmFkaW5nXG4gICAgICAgICAgICAgICAgd2hlbiAwICMgT3ZlcmxheVxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmFuaW1hdG9yLmFwcGVhcihAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaz8oKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgICAgICB3aGVuIDEgIyBDcm9zcyBGYWRlXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmUuYW5pbWF0b3IuZGlzYXBwZWFyKGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgKG9iamVjdCkgLT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QuZGlzcG9zZSgpKVxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlLnVwZGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmFuaW1hdG9yLmFwcGVhcihAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgKG9iamVjdCkgLT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaz8oKSlcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC51cGRhdGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjYWxsYmFjaz8oKVxuICAgICAgICAgICAgXG4gICAgIFxuICAgICMjIypcbiAgICAqIExldHMgdGhlIGNoYXJhY3RlciBzdGFydCB0YWxraW5nLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RhcnRUYWxraW5nXG4gICAgIyMjICAgICAgIFxuICAgIHN0YXJ0VGFsa2luZzogLT4gQG9iamVjdC50YWxraW5nID0geWVzXG4gICAgXG4gICAgIyMjKlxuICAgICogTGV0cyB0aGUgY2hhcmFjdGVyIHN0b3Agd2l0aCB0YWxraW5nLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RvcFRhbGtpbmdcbiAgICAjIyNcbiAgICBzdG9wVGFsa2luZzogLT4gQG9iamVjdC50YWxraW5nID0gbm9cbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGNoYXJhY3RlcidzIHRhbGtpbmctYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlVGFsa2luZ1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHVwZGF0ZVRhbGtpbmc6IC0+XG4gICAgICAgIGlmIEB0ZW1wU2V0dGluZ3Muc2tpcCBhbmQgQG9iamVjdC5leHByZXNzaW9uLnRhbGtpbmc/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgIEBvYmplY3QudGFsa2luZyA9IG5vXG4gICAgICAgICAgICBAaW1hZ2VJbmRleCA9IDBcbiAgICAgICAgICAgIEBvYmplY3QuaW1hZ2UgPSBAb2JqZWN0LmV4cHJlc3Npb24udGFsa2luZ1tAaW1hZ2VJbmRleF0ucmVzb3VyY2UubmFtZVxuICAgICAgICBlbHNlIGlmIEBvYmplY3QuZXhwcmVzc2lvbj9cbiAgICAgICAgICAgIGlmIEBvYmplY3QuZXhwcmVzc2lvbi50YWxraW5nPy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgQGltYWdlRHVyYXRpb24tLVxuICAgICAgICAgICAgICAgIGlmIEBpbWFnZUR1cmF0aW9uIDw9IDBcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VJbmRleCA9IEBpbWFnZUluZGV4XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIGltYWdlSW5kZXggPT0gQGltYWdlSW5kZXggYW5kIEBvYmplY3QuZXhwcmVzc2lvbi50YWxraW5nLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbWFnZUluZGV4ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKEBvYmplY3QuZXhwcmVzc2lvbi50YWxraW5nLmxlbmd0aC0xKSlcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQgPSBAb2JqZWN0LmV4cHJlc3Npb24udGFsa2luZ1NwZWVkIC8gMTAwICogNVxuICAgICAgICAgICAgICAgICAgICBAaW1hZ2VEdXJhdGlvbiA9IHNwZWVkICsgTWF0aC5yb3VuZChzcGVlZCAqIE1hdGgucmFuZG9tKCkpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5pbWFnZSA9IEBvYmplY3QuZXhwcmVzc2lvbi50YWxraW5nW0BpbWFnZUluZGV4XS5yZXNvdXJjZS5uYW1lXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHVwZGF0ZUlkbGUoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGNoYXJhY3RlcidzIGlkbGUtYW5pbWF0aW9uLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlSWRsZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICAgICBcbiAgICB1cGRhdGVJZGxlOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmV4cHJlc3Npb24/IGFuZCBAb2JqZWN0LmV4cHJlc3Npb24uaWRsZT8ubGVuZ3RoID4gMFxuICAgICAgICAgICAgaWYgQGltYWdlRHVyYXRpb24gPD0gMFxuICAgICAgICAgICAgICAgIEBpZGxlVGltZS0tXG4gICAgICAgICAgICAgICAgaWYgQGlkbGVUaW1lIDw9IDBcbiAgICAgICAgICAgICAgICAgICAgQGlkbGVUaW1lID0gQG9iamVjdC5leHByZXNzaW9uLmlkbGVUaW1lLnN0YXJ0ICsgKEBvYmplY3QuZXhwcmVzc2lvbi5pZGxlVGltZS5lbmQgLSBAb2JqZWN0LmV4cHJlc3Npb24uaWRsZVRpbWUuc3RhcnQpICogTWF0aC5yYW5kb20oKVxuICAgICAgICAgICAgICAgICAgICBAaW1hZ2VEdXJhdGlvbiA9IEBvYmplY3QuZXhwcmVzc2lvbi5pZGxlU3BlZWQgLyAxMDAgKiA1XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBpbWFnZUR1cmF0aW9uID4gMFxuICAgICAgICAgICAgICAgIEBpbWFnZUR1cmF0aW9uLS1cbiAgICAgICAgICAgICAgICBpZiBAaW1hZ2VEdXJhdGlvbiA8PSAwXG4gICAgICAgICAgICAgICAgICAgIEBpbWFnZUluZGV4KytcbiAgICAgICAgICAgICAgICAgICAgaWYgQGltYWdlSW5kZXggPj0gQG9iamVjdC5leHByZXNzaW9uLmlkbGUubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW1hZ2VJbmRleCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbWFnZUR1cmF0aW9uID0gMFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW1hZ2VEdXJhdGlvbiA9IEBvYmplY3QuZXhwcmVzc2lvbi5pZGxlU3BlZWQgLyAxMDAgKiA1XG4gICAgICAgICAgICBAb2JqZWN0LmltYWdlID0gQG9iamVjdC5leHByZXNzaW9uLmlkbGVbQGltYWdlSW5kZXhdLnJlc291cmNlLm5hbWVcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGNoYXJhY3RlciBsb2dpYyAmIGFuaW1hdGlvbi1oYW5kbGluZy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgICAgICAgICAgICAgICAgICBcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIGlmIG5vdCBAaW5pdGlhbGl6ZWQgdGhlbiBAc2V0dXAoKVxuICAgICAgICBcbiAgICAgICAgaWYgQG9iamVjdC50YWxraW5nXG4gICAgICAgICAgICBAdXBkYXRlVGFsa2luZygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB1cGRhdGVJZGxlKClcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbnZuLkNvbXBvbmVudF9DaGFyYWN0ZXJCZWhhdmlvciA9IENvbXBvbmVudF9DaGFyYWN0ZXJCZWhhdmlvciJdfQ==
//# sourceURL=Component_CharacterBehavior_160.js