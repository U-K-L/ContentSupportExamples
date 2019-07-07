var Object_Live2DCharacter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Object_Live2DCharacter = (function(superClass) {
  extend(Object_Live2DCharacter, superClass);

  Object_Live2DCharacter.objectCodecBlackList = ["parent"];


  /**
  * A game object for an animated Live2D visual novel character. 
  *
  * @module gs
  * @class Object_Live2DCharacter
  * @extends gs.Object_Visual
  * @memberof gs
  * @constructor
   */

  function Object_Live2DCharacter(record, data) {
    var ref;
    Object_Live2DCharacter.__super__.constructor.call(this, data);
    this.zIndex = 200;

    /**
    * The ID of the character-record used.
    * @property rid
    * @type number
     */
    this.rid = (data != null ? data.id : void 0) || ((ref = record != null ? record.index : void 0) != null ? ref : -1);

    /**
    * The rotation-angle of the character in degrees. The rotation center depends on the
    * anchor-point.
    * @property angle
    * @type number
     */
    this.angle = 0;

    /**
    * The color tone of the object used for the visual presentation.
    * @property tone
    * @type gs.Tone
     */
    this.tone = new Tone(0, 0, 0, 0);

    /**
    * The color of the object used for the visual presentation.
    * @property color
    * @type gs.Color
     */
    this.color = new Color(255, 255, 255, 0);

    /**
    * The Live2D model used for the visual presentation.
    * @property model
    * @type gs.Live2DModel
     */
    this.model = data != null ? ResourceManager.getLive2DModel("Live2D/" + data.modelName) : null;

    /**
    * The resource name of a Live2D model used for the visual presentation.
    * @property modelName
    * @type string
     */
    this.modelName = data != null ? data.modelName : void 0;

    /**
    * The Live2D motion.
    * @property motion
    * @type gs.Live2DMotion
     */
    this.motion = (data != null ? data.motion : void 0) || {
      name: "",
      loop: true

      /**
      * The Live2D motion group.
      * @property motion
      * @type gs.Live2DMotionGroup
       */
    };
    this.motionGroup = data != null ? data.motionGroup : void 0;

    /**
    * The Live2D expression.
    * @property expression
    * @type gs.Live2DExpression
     */
    this.expression = (data != null ? data.expression : void 0) || {
      name: ""

      /**
      * The character's behavior component which contains the character-specific logic.
      * @property behavior
      * @type vn.Component_CharacterBehavior
       */
    };
    this.behavior = new vn.Component_CharacterBehavior();
    this.logic = this.behavior;

    /**
    * The object's animator-component to execute different kind of animations like move, rotate, etc. on it.
    * @property animator
    * @type vn.Component_Animator
     */
    this.animator = new gs.Component_Animator();

    /**
    * The object's visual-component to display the game object on screen.
    * @property visual
    * @type gs.Component_Sprite
     */
    this.visual = new gs.Component_Live2D();
    this.visual.modelFolder = "Live2D";
    this.addComponent(this.logic);
    this.addComponent(this.animator);
    this.addComponent(this.visual);
  }


  /**
  * Serializes the object into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} The data-bundle.
   */

  Object_Live2DCharacter.prototype.toDataBundle = function() {
    return {
      rid: this.rid,
      x: this.dstRect.x,
      y: this.dstRect.y,
      opacity: this.opacity,
      offset: this.offset,
      zoom: this.zoom,
      origin: this.origin,
      mirror: this.mirror,
      expression: this.expression,
      modelName: this.modelName,
      motion: this.motion,
      motionGroup: this.motionGroup,
      expression: this.expression
    };
  };

  return Object_Live2DCharacter;

})(gs.Object_Visual);

vn.Object_Live2DCharacter = Object_Live2DCharacter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07OztFQUNGLHNCQUFDLENBQUEsb0JBQUQsR0FBd0IsQ0FBQyxRQUFEOzs7QUFFeEI7Ozs7Ozs7Ozs7RUFTYSxnQ0FBQyxNQUFELEVBQVMsSUFBVDtBQUNULFFBQUE7SUFBQSx3REFBTSxJQUFOO0lBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7SUFLQSxJQUFDLENBQUEsR0FBRCxtQkFBTyxJQUFJLENBQUUsWUFBTixJQUFZLGdFQUFpQixDQUFDLENBQWxCOztBQUVuQjs7Ozs7O0lBTUEsSUFBQyxDQUFBLEtBQUQsR0FBUzs7QUFFVDs7Ozs7SUFLQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsSUFBQSxDQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLENBQWQ7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixDQUFyQjs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsS0FBRCxHQUFZLFlBQUgsR0FBYyxlQUFlLENBQUMsY0FBaEIsQ0FBK0IsU0FBQSxHQUFVLElBQUksQ0FBQyxTQUE5QyxDQUFkLEdBQThFOztBQUV2Rjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxrQkFBYSxJQUFJLENBQUU7O0FBRW5COzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELG1CQUFVLElBQUksQ0FBRSxnQkFBTixJQUFnQjtNQUFBLElBQUEsRUFBTSxFQUFOO01BQVUsSUFBQSxFQUFNOztBQUUxQzs7OztTQUYwQjs7SUFPMUIsSUFBQyxDQUFBLFdBQUQsa0JBQWUsSUFBSSxDQUFFOztBQUVyQjs7Ozs7SUFLQSxJQUFDLENBQUEsVUFBRCxtQkFBYyxJQUFJLENBQUUsb0JBQU4sSUFBb0I7TUFBQSxJQUFBLEVBQU07O0FBRXhDOzs7O1NBRmtDOztJQU9sQyxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLEVBQUUsQ0FBQywyQkFBSCxDQUFBO0lBQ2hCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsRUFBRSxDQUFDLGtCQUFILENBQUE7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsZ0JBQUgsQ0FBQTtJQUNkLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQjtJQUV0QixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxLQUFmO0lBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsUUFBZjtJQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE1BQWY7RUE3RlM7OztBQStGYjs7Ozs7OzttQ0FNQSxZQUFBLEdBQWMsU0FBQTtXQUNWO01BQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFOO01BQ0EsQ0FBQSxFQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FEWjtNQUVBLENBQUEsRUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLENBRlo7TUFHQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BSFY7TUFJQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BSlQ7TUFLQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBTFA7TUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BTlQ7TUFPQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BUFQ7TUFRQSxVQUFBLEVBQVksSUFBQyxDQUFBLFVBUmI7TUFTQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFNBVFo7TUFVQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BVlQ7TUFXQSxXQUFBLEVBQWEsSUFBQyxDQUFBLFdBWGQ7TUFZQSxVQUFBLEVBQVksSUFBQyxDQUFBLFVBWmI7O0VBRFU7Ozs7R0FqSG1CLEVBQUUsQ0FBQzs7QUFrSXhDLEVBQUUsQ0FBQyxzQkFBSCxHQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogT2JqZWN0X0xpdmUyRENoYXJhY3RlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgT2JqZWN0X0xpdmUyRENoYXJhY3RlciBleHRlbmRzIGdzLk9iamVjdF9WaXN1YWxcbiAgICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJwYXJlbnRcIl1cbiAgICBcbiAgICAjIyMqXG4gICAgKiBBIGdhbWUgb2JqZWN0IGZvciBhbiBhbmltYXRlZCBMaXZlMkQgdmlzdWFsIG5vdmVsIGNoYXJhY3Rlci4gXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIE9iamVjdF9MaXZlMkRDaGFyYWN0ZXJcbiAgICAqIEBleHRlbmRzIGdzLk9iamVjdF9WaXN1YWxcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChyZWNvcmQsIGRhdGEpIC0+XG4gICAgICAgIHN1cGVyKGRhdGEpXG4gICAgICAgIEB6SW5kZXggPSAyMDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgSUQgb2YgdGhlIGNoYXJhY3Rlci1yZWNvcmQgdXNlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgcmlkXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAcmlkID0gZGF0YT8uaWQgfHwgKHJlY29yZD8uaW5kZXggPyAtMSlcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgcm90YXRpb24tYW5nbGUgb2YgdGhlIGNoYXJhY3RlciBpbiBkZWdyZWVzLiBUaGUgcm90YXRpb24gY2VudGVyIGRlcGVuZHMgb24gdGhlXG4gICAgICAgICogYW5jaG9yLXBvaW50LlxuICAgICAgICAqIEBwcm9wZXJ0eSBhbmdsZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGFuZ2xlID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjb2xvciB0b25lIG9mIHRoZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IHRvbmVcbiAgICAgICAgKiBAdHlwZSBncy5Ub25lXG4gICAgICAgICMjI1xuICAgICAgICBAdG9uZSA9IG5ldyBUb25lKDAsIDAsIDAsIDApXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGNvbG9yIG9mIHRoZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICogQHR5cGUgZ3MuQ29sb3JcbiAgICAgICAgIyMjXG4gICAgICAgIEBjb2xvciA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAwKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBMaXZlMkQgbW9kZWwgdXNlZCBmb3IgdGhlIHZpc3VhbCBwcmVzZW50YXRpb24uXG4gICAgICAgICogQHByb3BlcnR5IG1vZGVsXG4gICAgICAgICogQHR5cGUgZ3MuTGl2ZTJETW9kZWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBtb2RlbCA9IGlmIGRhdGE/IHRoZW4gUmVzb3VyY2VNYW5hZ2VyLmdldExpdmUyRE1vZGVsKFwiTGl2ZTJELyN7ZGF0YS5tb2RlbE5hbWV9XCIpIGVsc2UgbnVsbFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSByZXNvdXJjZSBuYW1lIG9mIGEgTGl2ZTJEIG1vZGVsIHVzZWQgZm9yIHRoZSB2aXN1YWwgcHJlc2VudGF0aW9uLlxuICAgICAgICAqIEBwcm9wZXJ0eSBtb2RlbE5hbWVcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEBtb2RlbE5hbWUgPSBkYXRhPy5tb2RlbE5hbWVcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgTGl2ZTJEIG1vdGlvbi5cbiAgICAgICAgKiBAcHJvcGVydHkgbW90aW9uXG4gICAgICAgICogQHR5cGUgZ3MuTGl2ZTJETW90aW9uXG4gICAgICAgICMjI1xuICAgICAgICBAbW90aW9uID0gZGF0YT8ubW90aW9uIHx8IG5hbWU6IFwiXCIsIGxvb3A6IHllc1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBMaXZlMkQgbW90aW9uIGdyb3VwLlxuICAgICAgICAqIEBwcm9wZXJ0eSBtb3Rpb25cbiAgICAgICAgKiBAdHlwZSBncy5MaXZlMkRNb3Rpb25Hcm91cFxuICAgICAgICAjIyNcbiAgICAgICAgQG1vdGlvbkdyb3VwID0gZGF0YT8ubW90aW9uR3JvdXBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgTGl2ZTJEIGV4cHJlc3Npb24uXG4gICAgICAgICogQHByb3BlcnR5IGV4cHJlc3Npb25cbiAgICAgICAgKiBAdHlwZSBncy5MaXZlMkRFeHByZXNzaW9uXG4gICAgICAgICMjI1xuICAgICAgICBAZXhwcmVzc2lvbiA9IGRhdGE/LmV4cHJlc3Npb24gfHwgbmFtZTogXCJcIiAjUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJFeHByZXNzaW9uc1tkYXRhPy5leHByZXNzaW9uSWQgfHwgMF1cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY2hhcmFjdGVyJ3MgYmVoYXZpb3IgY29tcG9uZW50IHdoaWNoIGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXItc3BlY2lmaWMgbG9naWMuXG4gICAgICAgICogQHByb3BlcnR5IGJlaGF2aW9yXG4gICAgICAgICogQHR5cGUgdm4uQ29tcG9uZW50X0NoYXJhY3RlckJlaGF2aW9yXG4gICAgICAgICMjI1xuICAgICAgICBAYmVoYXZpb3IgPSBuZXcgdm4uQ29tcG9uZW50X0NoYXJhY3RlckJlaGF2aW9yKClcbiAgICAgICAgQGxvZ2ljID0gQGJlaGF2aW9yXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG9iamVjdCdzIGFuaW1hdG9yLWNvbXBvbmVudCB0byBleGVjdXRlIGRpZmZlcmVudCBraW5kIG9mIGFuaW1hdGlvbnMgbGlrZSBtb3ZlLCByb3RhdGUsIGV0Yy4gb24gaXQuXG4gICAgICAgICogQHByb3BlcnR5IGFuaW1hdG9yXG4gICAgICAgICogQHR5cGUgdm4uQ29tcG9uZW50X0FuaW1hdG9yXG4gICAgICAgICMjI1xuICAgICAgICBAYW5pbWF0b3IgPSBuZXcgZ3MuQ29tcG9uZW50X0FuaW1hdG9yKClcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgb2JqZWN0J3MgdmlzdWFsLWNvbXBvbmVudCB0byBkaXNwbGF5IHRoZSBnYW1lIG9iamVjdCBvbiBzY3JlZW4uXG4gICAgICAgICogQHByb3BlcnR5IHZpc3VhbFxuICAgICAgICAqIEB0eXBlIGdzLkNvbXBvbmVudF9TcHJpdGVcbiAgICAgICAgIyMjXG4gICAgICAgIEB2aXN1YWwgPSBuZXcgZ3MuQ29tcG9uZW50X0xpdmUyRCgpXG4gICAgICAgIEB2aXN1YWwubW9kZWxGb2xkZXIgPSBcIkxpdmUyRFwiXG4gICAgICAgIFxuICAgICAgICBAYWRkQ29tcG9uZW50KEBsb2dpYylcbiAgICAgICAgQGFkZENvbXBvbmVudChAYW5pbWF0b3IpXG4gICAgICAgIEBhZGRDb21wb25lbnQoQHZpc3VhbClcbiAgICAgIFxuICAgICMjIypcbiAgICAqIFNlcmlhbGl6ZXMgdGhlIG9iamVjdCBpbnRvIGEgZGF0YS1idW5kbGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB0b0RhdGFCdW5kbGVcbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGRhdGEtYnVuZGxlLlxuICAgICMjIyAgICBcbiAgICB0b0RhdGFCdW5kbGU6IC0+IFxuICAgICAgICByaWQ6IEByaWQsIFxuICAgICAgICB4OiBAZHN0UmVjdC54LCBcbiAgICAgICAgeTogQGRzdFJlY3QueSwgXG4gICAgICAgIG9wYWNpdHk6IEBvcGFjaXR5LFxuICAgICAgICBvZmZzZXQ6IEBvZmZzZXQsXG4gICAgICAgIHpvb206IEB6b29tLFxuICAgICAgICBvcmlnaW46IEBvcmlnaW4sXG4gICAgICAgIG1pcnJvcjogQG1pcnJvciwgXG4gICAgICAgIGV4cHJlc3Npb246IEBleHByZXNzaW9uLCBcbiAgICAgICAgbW9kZWxOYW1lOiBAbW9kZWxOYW1lLFxuICAgICAgICBtb3Rpb246IEBtb3Rpb24sXG4gICAgICAgIG1vdGlvbkdyb3VwOiBAbW90aW9uR3JvdXAsXG4gICAgICAgIGV4cHJlc3Npb246IEBleHByZXNzaW9uXG4gICAgICAgIFxuICAgICAgICBcblxudm4uT2JqZWN0X0xpdmUyRENoYXJhY3RlciA9IE9iamVjdF9MaXZlMkRDaGFyYWN0ZXIiXX0=
//# sourceURL=Object_Live2DCharacter_70.js