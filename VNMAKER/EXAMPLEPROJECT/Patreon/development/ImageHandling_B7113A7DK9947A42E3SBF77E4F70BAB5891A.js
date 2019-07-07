
/**
* Enumeration describing the different types of image-handling.
*
* @module gs
* @class ImageHandling
* @extends gs.Component
* @memberof gs
* @static
 */
var ImageHandling;

ImageHandling = (function() {
  function ImageHandling() {}

  ImageHandling.initialize = function() {

    /**
    * Uses full image-size.
    * @property IMAGE_SIZE
    * @type number
    * @static
    * @final
     */
    this.IMAGE_SIZE = 0;

    /**
    * Uses only half image-height.
    * @property HALF_IMAGE_HEIGHT
    * @type number
    * @static
    * @final
     */
    this.HALF_IMAGE_HEIGHT = 1;

    /**
    * Uses a custom defined source-rectangle.
    * @property CUSTOM_SIZE
    * @type number
    * @static
    * @final
     */
    return this.CUSTOM_SIZE = 2;
  };

  return ImageHandling;

})();

ImageHandling.initialize();

gs.ImageHandling = ImageHandling;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFTTTs7O0VBQ0YsYUFBQyxDQUFBLFVBQUQsR0FBYSxTQUFBOztBQUNUOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLFVBQUQsR0FBYzs7QUFFZDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjs7QUFFckI7Ozs7Ozs7V0FPQSxJQUFDLENBQUEsV0FBRCxHQUFlO0VBMUJOOzs7Ozs7QUE0QmpCLGFBQWEsQ0FBQyxVQUFkLENBQUE7O0FBQ0EsRUFBRSxDQUFDLGFBQUgsR0FBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IEltYWdlSGFuZGxpbmdcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIyMjKlxuKiBFbnVtZXJhdGlvbiBkZXNjcmliaW5nIHRoZSBkaWZmZXJlbnQgdHlwZXMgb2YgaW1hZ2UtaGFuZGxpbmcuXG4qXG4qIEBtb2R1bGUgZ3NcbiogQGNsYXNzIEltYWdlSGFuZGxpbmdcbiogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4qIEBtZW1iZXJvZiBnc1xuKiBAc3RhdGljXG4jIyNcbmNsYXNzIEltYWdlSGFuZGxpbmdcbiAgICBAaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFVzZXMgZnVsbCBpbWFnZS1zaXplLlxuICAgICAgICAqIEBwcm9wZXJ0eSBJTUFHRV9TSVpFXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHN0YXRpY1xuICAgICAgICAqIEBmaW5hbFxuICAgICAgICAjIyNcbiAgICAgICAgQElNQUdFX1NJWkUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVXNlcyBvbmx5IGhhbGYgaW1hZ2UtaGVpZ2h0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBIQUxGX0lNQUdFX0hFSUdIVFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBIQUxGX0lNQUdFX0hFSUdIVCA9IDFcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBVc2VzIGEgY3VzdG9tIGRlZmluZWQgc291cmNlLXJlY3RhbmdsZS5cbiAgICAgICAgKiBAcHJvcGVydHkgQ1VTVE9NX1NJWkVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBAQ1VTVE9NX1NJWkUgPSAyXG4gICAgXG5JbWFnZUhhbmRsaW5nLmluaXRpYWxpemUoKVxuZ3MuSW1hZ2VIYW5kbGluZyA9IEltYWdlSGFuZGxpbmciXX0=
//# sourceURL=ImageHandling_41.js