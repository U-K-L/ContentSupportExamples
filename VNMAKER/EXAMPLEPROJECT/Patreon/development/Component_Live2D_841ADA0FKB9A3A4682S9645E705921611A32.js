var Component_Live2D,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Live2D = (function(superClass) {
  extend(Component_Live2D, superClass);


  /**
  * A Live2D component which allows a game-object to become a animated
  * Live2D character.
  *
  * @module vn
  * @class Component_Live2D
  * @extends gs.Component
  * @memberof vn
  * @constructor
   */

  function Component_Live2D() {
    Component_Live2D.__super__.constructor.apply(this, arguments);

    /**
    * The Live2D graphics object.
    * @property l2dObject
    * @type gs.Live2DObject
    * @readOnly
     */
    this.l2dObject = null;

    /**
    * The character's Live2D motion. Set name-property to an empty string
    * to disable motion and use a generated default idle-motion.
    * @property motion
    * @type gs.Live2DMotion
    * @default { name: "", loop: yes }
     */
    this.motion = {
      name: "",
      loop: true

      /**
      * The character's Live2D motion-group. Can be null
      * @property motionGroup
      * @type gs.Live2DMotionGroup
      * @default null
       */
    };
    this.motionGroup = null;

    /**
    * The character's Live2D expression. Set name-property to an empty string
    * to use default expression.
    * @property expression
    * @type gs.Live2DExpression
    * @default { name: "" }
     */
    this.expression = {
      name: ""

      /**
      * @property talkingDuration
      * @type number
      * @protected
       */
    };
    this.talkingDuration = 1;

    /**
    * @property talkingStep
    * @type number
    * @protected
     */
    this.talkingStep = 0;

    /**
    * @property talkingStep
    * @type number[]
    * @protected
     */
    this.talkingSteps = [0, 0.5, 1];
  }


  /**
  * Disposes the component and Live2D object.
  *
  * @method dispose
   */

  Component_Live2D.prototype.dispose = function() {
    Component_Live2D.__super__.dispose.apply(this, arguments);
    return this.l2dObject.dispose();
  };


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Live2D.prototype.onDataBundleRestore = function(data, context) {
    this.expression = {
      name: ""
    };
    this.motion = {
      name: "",
      loop: true
    };
    this.motionGroup = null;
    this.updateMotion();
    this.updateExpression();
    return this.updateMotionGroup();
  };


  /**
  * Setup the Live2D component. This method is automatically called by the
  * system.
  * @method setup
   */

  Component_Live2D.prototype.setup = function() {
    return this.l2dObject = new gs.Live2DObject();
  };


  /**
  * Updates the character's Live2D motion.
  *
  * @method updateMotion
   */

  Component_Live2D.prototype.updateMotion = function() {
    if (this.motion !== this.object.motion) {
      this.motion = this.object.motion;
      if (this.motion.name) {
        this.l2dObject.playMotion(this.motion.name, this.motion.fadeInTime);
        return this.l2dObject.loopMotion = this.motion.loop;
      }
    }
  };


  /**
  * Updates the character's Live2D motion-group.
  *
  * @method updateMotionGroup
   */

  Component_Live2D.prototype.updateMotionGroup = function() {
    var ref;
    if (this.motionGroup !== this.object.motionGroup) {
      this.motionGroup = this.object.motionGroup;
      if ((ref = this.motionGroup) != null ? ref.name : void 0) {
        this.l2dObject.playMotionGroup(this.motionGroup.name, this.motionGroup.playType);
        return this.l2dObject.loopMotion = this.motionGroup.loop;
      }
    }
  };


  /**
  * Updates the character's Live2D expression.
  *
  * @method updateExpression
   */

  Component_Live2D.prototype.updateExpression = function() {
    if (this.expression.name !== this.object.expression.name) {
      this.expression = this.object.expression;
      return this.l2dObject.setExpression(this.expression.name, this.expression.fadeInTime);
    }
  };


  /**
  * Updates the Live2D object properties from the game object properties.
  *
  * @method updateProperties
   */

  Component_Live2D.prototype.updateProperties = function() {
    this.l2dObject.model = this.object.model;
    this.object.dstRect.width = this.l2dObject.width;
    this.object.dstRect.height = this.l2dObject.height;
    this.l2dObject.x = this.object.dstRect.x + this.object.offset.x;
    this.l2dObject.y = this.object.dstRect.y + this.object.offset.y;
    this.l2dObject.z = this.object.zIndex;
    this.l2dObject.visible = this.object.visible;
    this.l2dObject.opacity = this.object.opacity;
    this.l2dObject.zoomX = this.object.zoom.x;
    this.l2dObject.zoomY = this.object.zoom.y;
    this.l2dObject.anchor.x = this.object.anchor.x;
    this.l2dObject.anchor.y = this.object.anchor.y;
    this.l2dObject.angle = this.object.angle;
    this.l2dObject.tone = this.object.tone;
    return this.l2dObject.color = this.object.color;
  };


  /**
  * Updates the optional Live2D object properties from the game object properties.
  *
  * @method updateOptionalProperties
   */

  Component_Live2D.prototype.updateOptionalProperties = function() {
    if (this.object.viewport != null) {
      this.l2dObject.viewport = this.object.viewport;
    }
    if (this.object.effects != null) {
      return this.l2dObject.effects = this.object.effects;
    }
  };


  /**
  * Updates the Live2D object and its talking-animation.
  *
  * @method update
   */

  Component_Live2D.prototype.update = function() {
    if ((this.object.model != null) && !this.object.model.initialized) {
      this.object.model.initialize();
    }
    this.updateProperties();
    this.updateMotion();
    this.updateMotionGroup();
    this.updateExpression();
    this.updateOptionalProperties();
    return this.updateTalking();
  };


  /**
  * Updates the Live2D character's talking-animation.
  *
  * @method update
   */

  Component_Live2D.prototype.updateTalking = function() {
    var step;
    step = 0;
    if (this.object.talking) {
      this.l2dObject.talking = true;
      if (AudioManager.voice != null) {
        return this.l2dObject.talkingVolume = (AudioManager.voice.averageVolume || 0) / 100;
      } else {
        this.talkingDuration--;
        if (this.talkingDuration <= 0) {
          while (this.talkingStep === step) {
            step = Math.round(Math.random() * 2);
          }
          this.talkingDuration = 5;
          this.talkingStep = step;
          return this.l2dObject.talkingVolume = this.talkingSteps[step];
        }
      }
    } else {
      return this.l2dObject.talking = false;
    }
  };

  return Component_Live2D;

})(gs.Component);

vn.Component_Live2D = Component_Live2D;

gs.Component_Live2D = Component_Live2D;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZ0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7RUFVYSwwQkFBQTtJQUNULG1EQUFBLFNBQUE7O0FBRUE7Ozs7OztJQU1BLElBQUMsQ0FBQSxTQUFELEdBQWE7O0FBRWI7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQUEsSUFBQSxFQUFNLEVBQU47TUFBVSxJQUFBLEVBQU07O0FBRTFCOzs7OztTQUZVOztJQVFWLElBQUMsQ0FBQSxXQUFELEdBQWU7O0FBRWY7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BQUEsSUFBQSxFQUFNOztBQUVwQjs7OztTQUZjOztJQU9kLElBQUMsQ0FBQSxlQUFELEdBQW1COztBQUVuQjs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7OztJQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxDQUFUO0VBeERQOzs7QUEwRGI7Ozs7Ozs2QkFLQSxPQUFBLEdBQVMsU0FBQTtJQUNMLCtDQUFBLFNBQUE7V0FFQSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBQTtFQUhLOzs7QUFLVDs7Ozs7Ozs7OzZCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7SUFDakIsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUFBLElBQUEsRUFBTSxFQUFOOztJQUNkLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFBQSxJQUFBLEVBQU0sRUFBTjtNQUFVLElBQUEsRUFBTSxJQUFoQjs7SUFDVixJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7RUFQaUI7OztBQVNyQjs7Ozs7OzZCQUtBLEtBQUEsR0FBTyxTQUFB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QUMsT0FBWCxHQUFxQjtNQUNyQixJQUFHLDBCQUFIO2VBQ0ksSUFBQyxDQUFBLFNBQVMsQ0FBQyxhQUFYLEdBQTJCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxhQUFuQixJQUFvQyxDQUFyQyxDQUFBLEdBQTBDLElBRHpFO09BQUEsTUFBQTtRQUdJLElBQUMsQ0FBQSxlQUFEO1FBQ0EsSUFBRyxJQUFDLENBQUEsZUFBRCxJQUFvQixDQUF2QjtBQUNJLGlCQUFNLElBQUMsQ0FBQSxXQUFELEtBQWdCLElBQXRCO1lBQ0ksSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBQTNCO1VBRFg7VUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQjtVQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlO2lCQUNmLElBQUMsQ0FBQSxTQUFTLENBQUMsYUFBWCxHQUEyQixJQUFDLENBQUEsWUFBYSxDQUFBLElBQUEsRUFMN0M7U0FKSjtPQUZKO0tBQUEsTUFBQTthQWFJLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxHQUFxQixNQWJ6Qjs7RUFGVzs7OztHQWpNWSxFQUFFLENBQUM7O0FBa05sQyxFQUFFLENBQUMsZ0JBQUgsR0FBc0I7O0FBQ3RCLEVBQUUsQ0FBQyxnQkFBSCxHQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0xpdmUyRFxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0xpdmUyRCBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIEEgTGl2ZTJEIGNvbXBvbmVudCB3aGljaCBhbGxvd3MgYSBnYW1lLW9iamVjdCB0byBiZWNvbWUgYSBhbmltYXRlZFxuICAgICogTGl2ZTJEIGNoYXJhY3Rlci5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHZuXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0xpdmUyRFxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2Ygdm5cbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBMaXZlMkQgZ3JhcGhpY3Mgb2JqZWN0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBsMmRPYmplY3RcbiAgICAgICAgKiBAdHlwZSBncy5MaXZlMkRPYmplY3RcbiAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgIyMjXG4gICAgICAgIEBsMmRPYmplY3QgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNoYXJhY3RlcidzIExpdmUyRCBtb3Rpb24uIFNldCBuYW1lLXByb3BlcnR5IHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICAqIHRvIGRpc2FibGUgbW90aW9uIGFuZCB1c2UgYSBnZW5lcmF0ZWQgZGVmYXVsdCBpZGxlLW1vdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgbW90aW9uXG4gICAgICAgICogQHR5cGUgZ3MuTGl2ZTJETW90aW9uXG4gICAgICAgICogQGRlZmF1bHQgeyBuYW1lOiBcIlwiLCBsb29wOiB5ZXMgfVxuICAgICAgICAjIyNcbiAgICAgICAgQG1vdGlvbiA9IG5hbWU6IFwiXCIsIGxvb3A6IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjaGFyYWN0ZXIncyBMaXZlMkQgbW90aW9uLWdyb3VwLiBDYW4gYmUgbnVsbFxuICAgICAgICAqIEBwcm9wZXJ0eSBtb3Rpb25Hcm91cFxuICAgICAgICAqIEB0eXBlIGdzLkxpdmUyRE1vdGlvbkdyb3VwXG4gICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICAjIyNcbiAgICAgICAgQG1vdGlvbkdyb3VwID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjaGFyYWN0ZXIncyBMaXZlMkQgZXhwcmVzc2lvbi4gU2V0IG5hbWUtcHJvcGVydHkgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICogdG8gdXNlIGRlZmF1bHQgZXhwcmVzc2lvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgZXhwcmVzc2lvblxuICAgICAgICAqIEB0eXBlIGdzLkxpdmUyREV4cHJlc3Npb25cbiAgICAgICAgKiBAZGVmYXVsdCB7IG5hbWU6IFwiXCIgfVxuICAgICAgICAjIyNcbiAgICAgICAgQGV4cHJlc3Npb24gPSBuYW1lOiBcIlwiXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHRhbGtpbmdEdXJhdGlvblxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB0YWxraW5nRHVyYXRpb24gPSAxXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHRhbGtpbmdTdGVwXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHRhbGtpbmdTdGVwID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSB0YWxraW5nU3RlcFxuICAgICAgICAqIEB0eXBlIG51bWJlcltdXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQHRhbGtpbmdTdGVwcyA9IFswLCAwLjUsIDFdXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBjb21wb25lbnQgYW5kIExpdmUyRCBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBsMmRPYmplY3QuZGlzcG9zZSgpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICogXG4gICAgKiBAbWV0aG9kIG9uRGF0YUJ1bmRsZVJlc3RvcmUuXG4gICAgKiBAcGFyYW0gT2JqZWN0IGRhdGEgLSBUaGUgZGF0YS1idW5kbGVcbiAgICAqIEBwYXJhbSBncy5PYmplY3RDb2RlY0NvbnRleHQgY29udGV4dCAtIFRoZSBjb2RlYy1jb250ZXh0LlxuICAgICMjI1xuICAgIG9uRGF0YUJ1bmRsZVJlc3RvcmU6IChkYXRhLCBjb250ZXh0KSAtPlxuICAgICAgICBAZXhwcmVzc2lvbiA9IG5hbWU6IFwiXCJcbiAgICAgICAgQG1vdGlvbiA9IG5hbWU6IFwiXCIsIGxvb3A6IHllc1xuICAgICAgICBAbW90aW9uR3JvdXAgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAdXBkYXRlTW90aW9uKClcbiAgICAgICAgQHVwZGF0ZUV4cHJlc3Npb24oKVxuICAgICAgICBAdXBkYXRlTW90aW9uR3JvdXAoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXR1cCB0aGUgTGl2ZTJEIGNvbXBvbmVudC4gVGhpcyBtZXRob2QgaXMgYXV0b21hdGljYWxseSBjYWxsZWQgYnkgdGhlXG4gICAgKiBzeXN0ZW0uXG4gICAgKiBAbWV0aG9kIHNldHVwXG4gICAgIyMjXG4gICAgc2V0dXA6IC0+XG4gICAgICAgIEBsMmRPYmplY3QgPSBuZXcgZ3MuTGl2ZTJET2JqZWN0KClcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgY2hhcmFjdGVyJ3MgTGl2ZTJEIG1vdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU1vdGlvblxuICAgICMjIyAgICAgICAgICBcbiAgICB1cGRhdGVNb3Rpb246IC0+XG4gICAgICAgIGlmIEBtb3Rpb24gIT0gQG9iamVjdC5tb3Rpb25cbiAgICAgICAgICAgIEBtb3Rpb24gPSBAb2JqZWN0Lm1vdGlvblxuICAgICAgICAgICAgaWYgQG1vdGlvbi5uYW1lXG4gICAgICAgICAgICAgICAgQGwyZE9iamVjdC5wbGF5TW90aW9uKEBtb3Rpb24ubmFtZSwgQG1vdGlvbi5mYWRlSW5UaW1lKVxuICAgICAgICAgICAgICAgIEBsMmRPYmplY3QubG9vcE1vdGlvbiA9IEBtb3Rpb24ubG9vcFxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGNoYXJhY3RlcidzIExpdmUyRCBtb3Rpb24tZ3JvdXAuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVNb3Rpb25Hcm91cFxuICAgICMjIyAgICAgICAgICBcbiAgICB1cGRhdGVNb3Rpb25Hcm91cDogLT5cbiAgICAgICAgaWYgQG1vdGlvbkdyb3VwICE9IEBvYmplY3QubW90aW9uR3JvdXBcbiAgICAgICAgICAgIEBtb3Rpb25Hcm91cCA9IEBvYmplY3QubW90aW9uR3JvdXBcbiAgICAgICAgICAgIGlmIEBtb3Rpb25Hcm91cD8ubmFtZVxuICAgICAgICAgICAgICAgIEBsMmRPYmplY3QucGxheU1vdGlvbkdyb3VwKEBtb3Rpb25Hcm91cC5uYW1lLCBAbW90aW9uR3JvdXAucGxheVR5cGUpXG4gICAgICAgICAgICAgICAgQGwyZE9iamVjdC5sb29wTW90aW9uID0gQG1vdGlvbkdyb3VwLmxvb3BcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBjaGFyYWN0ZXIncyBMaXZlMkQgZXhwcmVzc2lvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUV4cHJlc3Npb25cbiAgICAjIyMgICAgICAgICAgICAgIFxuICAgIHVwZGF0ZUV4cHJlc3Npb246IC0+XG4gICAgICAgIGlmIEBleHByZXNzaW9uLm5hbWUgIT0gQG9iamVjdC5leHByZXNzaW9uLm5hbWVcbiAgICAgICAgICAgIEBleHByZXNzaW9uID0gQG9iamVjdC5leHByZXNzaW9uXG4gICAgICAgICAgICBAbDJkT2JqZWN0LnNldEV4cHJlc3Npb24oQGV4cHJlc3Npb24ubmFtZSwgQGV4cHJlc3Npb24uZmFkZUluVGltZSlcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIExpdmUyRCBvYmplY3QgcHJvcGVydGllcyBmcm9tIHRoZSBnYW1lIG9iamVjdCBwcm9wZXJ0aWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUHJvcGVydGllc1xuICAgICMjIyAgICAgICAgXG4gICAgdXBkYXRlUHJvcGVydGllczogLT5cbiAgICAgICAgQGwyZE9iamVjdC5tb2RlbCA9IEBvYmplY3QubW9kZWxcbiAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQGwyZE9iamVjdC53aWR0aFxuICAgICAgICBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQGwyZE9iamVjdC5oZWlnaHRcbiAgICAgICAgXG4gICAgICAgIEBsMmRPYmplY3QueCA9IEBvYmplY3QuZHN0UmVjdC54ICsgQG9iamVjdC5vZmZzZXQueFxuICAgICAgICBAbDJkT2JqZWN0LnkgPSBAb2JqZWN0LmRzdFJlY3QueSArIEBvYmplY3Qub2Zmc2V0LnlcbiAgICAgICAgQGwyZE9iamVjdC56ID0gQG9iamVjdC56SW5kZXhcbiAgICAgICAgQGwyZE9iamVjdC52aXNpYmxlID0gQG9iamVjdC52aXNpYmxlXG4gICAgICAgIEBsMmRPYmplY3Qub3BhY2l0eSA9IEBvYmplY3Qub3BhY2l0eVxuICAgICAgICBAbDJkT2JqZWN0Lnpvb21YID0gQG9iamVjdC56b29tLnhcbiAgICAgICAgQGwyZE9iamVjdC56b29tWSA9IEBvYmplY3Quem9vbS55XG4gICAgICAgIEBsMmRPYmplY3QuYW5jaG9yLnggPSBAb2JqZWN0LmFuY2hvci54XG4gICAgICAgIEBsMmRPYmplY3QuYW5jaG9yLnkgPSBAb2JqZWN0LmFuY2hvci55XG4gICAgICAgIEBsMmRPYmplY3QuYW5nbGUgPSBAb2JqZWN0LmFuZ2xlXG4gICAgICAgIEBsMmRPYmplY3QudG9uZSA9IEBvYmplY3QudG9uZVxuICAgICAgICBAbDJkT2JqZWN0LmNvbG9yID0gQG9iamVjdC5jb2xvclxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBvcHRpb25hbCBMaXZlMkQgb2JqZWN0IHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllc1xuICAgICMjIyAgICBcbiAgICB1cGRhdGVPcHRpb25hbFByb3BlcnRpZXM6IC0+XG4gICAgICAgIGlmIEBvYmplY3Qudmlld3BvcnQ/XG4gICAgICAgICAgICBAbDJkT2JqZWN0LnZpZXdwb3J0ID0gQG9iamVjdC52aWV3cG9ydFxuICAgICAgICBpZiBAb2JqZWN0LmVmZmVjdHM/XG4gICAgICAgICAgICBAbDJkT2JqZWN0LmVmZmVjdHMgPSBAb2JqZWN0LmVmZmVjdHNcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIExpdmUyRCBvYmplY3QgYW5kIGl0cyB0YWxraW5nLWFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICMjIyAgIFxuICAgIHVwZGF0ZTogLT5cbiAgICAgICAgaWYgQG9iamVjdC5tb2RlbD8gYW5kIG5vdCBAb2JqZWN0Lm1vZGVsLmluaXRpYWxpemVkXG4gICAgICAgICAgICBAb2JqZWN0Lm1vZGVsLmluaXRpYWxpemUoKVxuICAgICAgICAgICAgXG4gICAgICAgIEB1cGRhdGVQcm9wZXJ0aWVzKClcbiAgICAgICAgQHVwZGF0ZU1vdGlvbigpXG4gICAgICAgIEB1cGRhdGVNb3Rpb25Hcm91cCgpXG4gICAgICAgIEB1cGRhdGVFeHByZXNzaW9uKClcbiAgICAgICAgQHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllcygpXG4gICAgICAgIEB1cGRhdGVUYWxraW5nKClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBMaXZlMkQgY2hhcmFjdGVyJ3MgdGFsa2luZy1hbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICAgXG4gICAgdXBkYXRlVGFsa2luZzogLT5cbiAgICAgICAgc3RlcCA9IDBcbiAgICAgICAgaWYgQG9iamVjdC50YWxraW5nXG4gICAgICAgICAgICBAbDJkT2JqZWN0LnRhbGtpbmcgPSB5ZXNcbiAgICAgICAgICAgIGlmIEF1ZGlvTWFuYWdlci52b2ljZT9cbiAgICAgICAgICAgICAgICBAbDJkT2JqZWN0LnRhbGtpbmdWb2x1bWUgPSAoQXVkaW9NYW5hZ2VyLnZvaWNlLmF2ZXJhZ2VWb2x1bWUgfHwgMCkgLyAxMDBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAdGFsa2luZ0R1cmF0aW9uLS1cbiAgICAgICAgICAgICAgICBpZiBAdGFsa2luZ0R1cmF0aW9uIDw9IDBcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgQHRhbGtpbmdTdGVwID09IHN0ZXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAyKVxuICAgICAgICAgICAgICAgICAgICBAdGFsa2luZ0R1cmF0aW9uID0gNVxuICAgICAgICAgICAgICAgICAgICBAdGFsa2luZ1N0ZXAgPSBzdGVwXG4gICAgICAgICAgICAgICAgICAgIEBsMmRPYmplY3QudGFsa2luZ1ZvbHVtZSA9IEB0YWxraW5nU3RlcHNbc3RlcF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGwyZE9iamVjdC50YWxraW5nID0gbm9cbiBcbnZuLkNvbXBvbmVudF9MaXZlMkQgPSBDb21wb25lbnRfTGl2ZTJEICAgICAgIFxuZ3MuQ29tcG9uZW50X0xpdmUyRCA9IENvbXBvbmVudF9MaXZlMkQgIyBEZXByZWNhdGVkIl19
//# sourceURL=Component_Live2D_144.js