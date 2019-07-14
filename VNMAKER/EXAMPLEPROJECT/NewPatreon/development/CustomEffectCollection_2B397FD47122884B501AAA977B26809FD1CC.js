var CustomEffectCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CustomEffectCollection = (function(superClass) {
  extend(CustomEffectCollection, superClass);


  /**
  * An effect collection stores all effects by name. So if you add custom effects, you
  * have to create an own class and inherit from gs.EffectCollection and add your
  * own effects in the constructor. It is important to put the super-call at the end and not
  * at the beginning.
  *
  * @module gs
  * @class CircularDistortionEffect
  * @extends gs.CircularDistortionEffect
  * @memberof gs
  * @constructor
   */

  function CustomEffectCollection() {

    /**
    * A circular distortion effect.
    * @property circularDistortion
    * @type gs.CircularDistortionEffect
     */
    this.circularDistortion = new gs.CircularDistortionEffect();
    CustomEffectCollection.__super__.constructor.apply(this, arguments);
  }

  return CustomEffectCollection;

})(gs.EffectCollection);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsc0JBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7OztFQVlhLGdDQUFBOztBQUNUOzs7OztJQUtBLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLEVBQUUsQ0FBQyx3QkFBSCxDQUFBO0lBRzFCLHlEQUFBLFNBQUE7RUFUUzs7OztHQWJvQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IEN1c3RvbUVmZmVjdENvbGxlY3Rpb25cbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIEN1c3RvbUVmZmVjdENvbGxlY3Rpb24gZXh0ZW5kcyBncy5FZmZlY3RDb2xsZWN0aW9uXG4gICAgIyMjKlxuICAgICogQW4gZWZmZWN0IGNvbGxlY3Rpb24gc3RvcmVzIGFsbCBlZmZlY3RzIGJ5IG5hbWUuIFNvIGlmIHlvdSBhZGQgY3VzdG9tIGVmZmVjdHMsIHlvdVxuICAgICogaGF2ZSB0byBjcmVhdGUgYW4gb3duIGNsYXNzIGFuZCBpbmhlcml0IGZyb20gZ3MuRWZmZWN0Q29sbGVjdGlvbiBhbmQgYWRkIHlvdXJcbiAgICAqIG93biBlZmZlY3RzIGluIHRoZSBjb25zdHJ1Y3Rvci4gSXQgaXMgaW1wb3J0YW50IHRvIHB1dCB0aGUgc3VwZXItY2FsbCBhdCB0aGUgZW5kIGFuZCBub3RcbiAgICAqIGF0IHRoZSBiZWdpbm5pbmcuXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIENpcmN1bGFyRGlzdG9ydGlvbkVmZmVjdFxuICAgICogQGV4dGVuZHMgZ3MuQ2lyY3VsYXJEaXN0b3J0aW9uRWZmZWN0XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogQSBjaXJjdWxhciBkaXN0b3J0aW9uIGVmZmVjdC5cbiAgICAgICAgKiBAcHJvcGVydHkgY2lyY3VsYXJEaXN0b3J0aW9uXG4gICAgICAgICogQHR5cGUgZ3MuQ2lyY3VsYXJEaXN0b3J0aW9uRWZmZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAY2lyY3VsYXJEaXN0b3J0aW9uID0gbmV3IGdzLkNpcmN1bGFyRGlzdG9ydGlvbkVmZmVjdCgpXG4gICAgICAgIFxuICAgICAgICAjIEl0IGlzIGltcG9ydGFudCB0byBjYWxsIHN1cGVyIGF0IHRoZSBlbmQsIG5vdCBhdCB0aGUgYmVnaW5uaW5nLlxuICAgICAgICBzdXBlclxuIFxuIyBUaGlzIGxpbmUgaXMgdmVyeSBpbXBvcnRhbnQsIGl0IHBhdGNoZXMgdGhlIG9sZCBncy5FZmZlY3RDb2xsZWN0aW9uIHJlZmVyZW5jZSBzbyB0aGF0IGV2ZXJ5d2hlcmUgaW5cbiMgdGhlIGVuZ2luZSBncy5FZmZlY3RDb2xsZWN0aW9uIG5vdyByZWZlcnMgdG8geW91ciBjdXN0b20gZWZmZWN0IGNvbGxlY3Rpb24uIEp1c3QgdW5jb21tZW50IGl0XG4jIHRvIHVzZSB5b3VyIGN1c3RvbSBlZmZlY3RzLlxuIyBncy5FZmZlY3RDb2xsZWN0aW9uID0gQ3VzdG9tRWZmZWN0Q29sbGVjdGlvbiJdfQ==
//# sourceURL=CustomEffectCollection_24.js