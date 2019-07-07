var Component_Animation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Animation = (function(superClass) {
  extend(Component_Animation, superClass);


  /**
  * The base-class of all animation components. An animation-component
  * executes a certain animation on a game object. The type of the animation depends
  * on the component. <br>
  * <br>
  * In regular, animation components a used together with the gs.Component_Animator
  * component.
  *
  * @module gs
  * @class Component_Animation
  * @extends gs.Component
  * @memberof gs
  * @constructor
   */

  function Component_Animation() {
    Component_Animation.__super__.constructor.apply(this, arguments);
  }


  /**
  * Updates the animation. 
  *
  * @method update
   */

  Component_Animation.prototype.update = function() {
    return this.object.needsFullUpdate = true;
  };


  /**
  * Skips the animation. That is used to skip an animation if the user
  * wants to skip very fast through a visual novel scene.
  *
  * @method skip
   */

  Component_Animation.prototype.skip = function() {
    var ref;
    if (((ref = this.easing) != null ? ref.duration : void 0) > GameManager.tempSettings.skipTime) {
      if (GameManager.tempSettings.skipTime === 0) {
        return this.easing.time = this.easing.duration;
      } else {
        this.easing.duration = GameManager.tempSettings.skipTime;
        return this.easing.time = 0;
      }
    }
  };


  /**
  * Indicates if instant-skipping is enabled. In that case, there shouldn't be any delay and animation
  * must finish immediately and call its callback. It is mostly used for live-preview purposes.
  *
  * @method isInstantSkip
  * @return {boolean} If <b>true</b>, instant-skipping is enabled. Otherwise <b>false</b>.
   */

  Component_Animation.prototype.isInstantSkip = function() {
    return GameManager.tempSettings.skip && GameManager.tempSettings.skipTime === 0;
  };

  return Component_Animation;

})(gs.Component);

gs.Component_Animation = Component_Animation;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsbUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0VBY2EsNkJBQUE7SUFDVCxzREFBQSxTQUFBO0VBRFM7OztBQUdiOzs7Ozs7Z0NBS0EsTUFBQSxHQUFRLFNBQUE7V0FDSixJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsR0FBMEI7RUFEdEI7OztBQUdSOzs7Ozs7O2dDQU1BLElBQUEsR0FBTSxTQUFBO0FBQ0YsUUFBQTtJQUFBLHNDQUFVLENBQUUsa0JBQVQsR0FBb0IsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFoRDtNQUNJLElBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUF6QixLQUFxQyxDQUF4QztlQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FEM0I7T0FBQSxNQUFBO1FBR0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLEdBQW1CLFdBQVcsQ0FBQyxZQUFZLENBQUM7ZUFDNUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsRUFKbkI7T0FESjs7RUFERTs7O0FBUU47Ozs7Ozs7O2dDQU9BLGFBQUEsR0FBZSxTQUFBO1dBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUF6QixJQUFrQyxXQUFXLENBQUMsWUFBWSxDQUFDLFFBQXpCLEtBQXFDO0VBQTFFOzs7O0dBL0NlLEVBQUUsQ0FBQzs7QUFrRHJDLEVBQUUsQ0FBQyxtQkFBSCxHQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0FuaW1hdGlvblxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ29tcG9uZW50X0FuaW1hdGlvbiBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIFRoZSBiYXNlLWNsYXNzIG9mIGFsbCBhbmltYXRpb24gY29tcG9uZW50cy4gQW4gYW5pbWF0aW9uLWNvbXBvbmVudFxuICAgICogZXhlY3V0ZXMgYSBjZXJ0YWluIGFuaW1hdGlvbiBvbiBhIGdhbWUgb2JqZWN0LiBUaGUgdHlwZSBvZiB0aGUgYW5pbWF0aW9uIGRlcGVuZHNcbiAgICAqIG9uIHRoZSBjb21wb25lbnQuIDxicj5cbiAgICAqIDxicj5cbiAgICAqIEluIHJlZ3VsYXIsIGFuaW1hdGlvbiBjb21wb25lbnRzIGEgdXNlZCB0b2dldGhlciB3aXRoIHRoZSBncy5Db21wb25lbnRfQW5pbWF0b3JcbiAgICAqIGNvbXBvbmVudC5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0FuaW1hdGlvblxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGFuaW1hdGlvbi4gXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBAb2JqZWN0Lm5lZWRzRnVsbFVwZGF0ZSA9IHllc1xuICAgICBcbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgYW5pbWF0aW9uLiBUaGF0IGlzIHVzZWQgdG8gc2tpcCBhbiBhbmltYXRpb24gaWYgdGhlIHVzZXJcbiAgICAqIHdhbnRzIHRvIHNraXAgdmVyeSBmYXN0IHRocm91Z2ggYSB2aXN1YWwgbm92ZWwgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwXG4gICAgIyMjICAgIFxuICAgIHNraXA6IC0+XG4gICAgICAgIGlmIEBlYXNpbmc/LmR1cmF0aW9uID4gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICBpZiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWUgPT0gMFxuICAgICAgICAgICAgICAgIEBlYXNpbmcudGltZSA9IEBlYXNpbmcuZHVyYXRpb25cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAZWFzaW5nLmR1cmF0aW9uID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICAgICAgQGVhc2luZy50aW1lID0gMFxuICAgIFxuICAgICMjIypcbiAgICAqIEluZGljYXRlcyBpZiBpbnN0YW50LXNraXBwaW5nIGlzIGVuYWJsZWQuIEluIHRoYXQgY2FzZSwgdGhlcmUgc2hvdWxkbid0IGJlIGFueSBkZWxheSBhbmQgYW5pbWF0aW9uXG4gICAgKiBtdXN0IGZpbmlzaCBpbW1lZGlhdGVseSBhbmQgY2FsbCBpdHMgY2FsbGJhY2suIEl0IGlzIG1vc3RseSB1c2VkIGZvciBsaXZlLXByZXZpZXcgcHVycG9zZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBpc0luc3RhbnRTa2lwXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiA8Yj50cnVlPC9iPiwgaW5zdGFudC1za2lwcGluZyBpcyBlbmFibGVkLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+LlxuICAgICMjIyAgICAgICAgICAgICAgICBcbiAgICBpc0luc3RhbnRTa2lwOiAtPiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCBhbmQgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lID09IDBcbiAgICAgICAgXG4gICAgXG5ncy5Db21wb25lbnRfQW5pbWF0aW9uID0gQ29tcG9uZW50X0FuaW1hdGlvbiJdfQ==
//# sourceURL=Component_Animation_11.js