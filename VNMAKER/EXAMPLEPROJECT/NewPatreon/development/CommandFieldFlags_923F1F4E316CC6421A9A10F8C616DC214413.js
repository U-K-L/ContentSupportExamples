
/**
* An enumeration of command field flags.
*
* @module gs
* @class CommandFieldFlags
* @memberof gs
* @constructor
* @static
* @final
 */
var CommandFieldFlags;

CommandFieldFlags = (function() {
  function CommandFieldFlags() {}

  CommandFieldFlags.initialize = function() {

    /**
    * Indicates if the field is locked and should not be changed.
    * @property LOCKED
    * @type number
    * @static
    * @final
     */
    return this.LOCKED = 1;
  };


  /**
  * Checks if a command field is locked.
  * @method isLocked
  * @static
  * @param {number} flags - Field flags to check.
   */

  CommandFieldFlags.isLocked = function(flags) {
    return flags & CommandFieldFlags.LOCKED;
  };

  return CommandFieldFlags;

})();

CommandFieldFlags.initialize();

gs.CommandFieldFlags = CommandFieldFlags;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBVU07OztFQUNGLGlCQUFDLENBQUEsVUFBRCxHQUFhLFNBQUE7O0FBQ1Q7Ozs7Ozs7V0FPQSxJQUFDLENBQUEsTUFBRCxHQUFVO0VBUkQ7OztBQVViOzs7Ozs7O0VBTUEsaUJBQUMsQ0FBQSxRQUFELEdBQVcsU0FBQyxLQUFEO1dBQVcsS0FBQSxHQUFRLGlCQUFpQixDQUFDO0VBQXJDOzs7Ozs7QUFFZixpQkFBaUIsQ0FBQyxVQUFsQixDQUFBOztBQUNBLEVBQUUsQ0FBQyxpQkFBSCxHQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tbWFuZEZpZWxkRmxhZ3NcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuIyMjKlxuKiBBbiBlbnVtZXJhdGlvbiBvZiBjb21tYW5kIGZpZWxkIGZsYWdzLlxuKlxuKiBAbW9kdWxlIGdzXG4qIEBjbGFzcyBDb21tYW5kRmllbGRGbGFnc1xuKiBAbWVtYmVyb2YgZ3NcbiogQGNvbnN0cnVjdG9yXG4qIEBzdGF0aWNcbiogQGZpbmFsXG4jIyMgIFxuY2xhc3MgQ29tbWFuZEZpZWxkRmxhZ3NcbiAgICBAaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgZmllbGQgaXMgbG9ja2VkIGFuZCBzaG91bGQgbm90IGJlIGNoYW5nZWQuXG4gICAgICAgICogQHByb3BlcnR5IExPQ0tFRFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBMT0NLRUQgPSAxXG4gICAgXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGlmIGEgY29tbWFuZCBmaWVsZCBpcyBsb2NrZWQuXG4gICAgKiBAbWV0aG9kIGlzTG9ja2VkXG4gICAgKiBAc3RhdGljXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZmxhZ3MgLSBGaWVsZCBmbGFncyB0byBjaGVjay5cbiAgICAjIyNcbiAgICBAaXNMb2NrZWQ6IChmbGFncykgLT4gZmxhZ3MgJiBDb21tYW5kRmllbGRGbGFncy5MT0NLRURcbiBcbkNvbW1hbmRGaWVsZEZsYWdzLmluaXRpYWxpemUoKSAgIFxuZ3MuQ29tbWFuZEZpZWxkRmxhZ3MgPSBDb21tYW5kRmllbGRGbGFnc1xuICAiXX0=
//# sourceURL=CommandFieldFlags_87.js