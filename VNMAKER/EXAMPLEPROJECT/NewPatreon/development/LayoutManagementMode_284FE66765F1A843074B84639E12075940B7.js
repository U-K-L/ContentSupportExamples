
/**
* An enumeration of different management modes describing how a layout should
* handle its sub-objects coming from a data-source.
*
* @module ui
* @class LayoutManagementMode
* @memberof ui
* @constructor
* @static
* @final
 */
var LayoutManagementMode;

LayoutManagementMode = (function() {
  function LayoutManagementMode() {}

  LayoutManagementMode.initialize = function() {

    /**
    * All sub-objects are created at setup time.
    * @property NORMAL
    * @type number
    * @static
    * @final
     */
    this.NORMAL = 0;

    /**
    * The sub-objects are created at update time and only those which are currently visible.
    * @property JUST_IN_TIME
    * @type number
    * @static
    * @final
     */
    return this.JUST_IN_TIME = 1;
  };


  /**
  * Gets the constant number value from a specified human-readable string.
  * @method fromString
  * @param {string} s - The management mode as string. Can be "normal" or "just_in_time".
  * @return {number} The constant number value.
  * @static
  * @final
   */

  LayoutManagementMode.fromString = function(s) {
    switch (s) {
      case "normal":
        return 0;
      case "just_in_time":
        return 1;
      default:
        return 0;
    }
  };

  return LayoutManagementMode;

})();

LayoutManagementMode.initialize();

ui.LayoutManagementMode = LayoutManagementMode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQVdNOzs7RUFDRixvQkFBQyxDQUFBLFVBQUQsR0FBYSxTQUFBOztBQUNUOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7OztXQU9BLElBQUMsQ0FBQSxZQUFELEdBQWdCO0VBakJQOzs7QUFtQmI7Ozs7Ozs7OztFQVFBLG9CQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsQ0FBRDtBQUNULFlBQU8sQ0FBUDtBQUFBLFdBQ1MsUUFEVDtBQUVRLGVBQU87QUFGZixXQUdTLGNBSFQ7QUFJUSxlQUFPO0FBSmY7QUFNUSxlQUFPO0FBTmY7RUFEUzs7Ozs7O0FBU2pCLG9CQUFvQixDQUFDLFVBQXJCLENBQUE7O0FBQ0EsRUFBRSxDQUFDLG9CQUFILEdBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBMYXlvdXRNYW5hZ2VtZW50TW9kZVxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4jIyMqXG4qIEFuIGVudW1lcmF0aW9uIG9mIGRpZmZlcmVudCBtYW5hZ2VtZW50IG1vZGVzIGRlc2NyaWJpbmcgaG93IGEgbGF5b3V0IHNob3VsZFxuKiBoYW5kbGUgaXRzIHN1Yi1vYmplY3RzIGNvbWluZyBmcm9tIGEgZGF0YS1zb3VyY2UuXG4qXG4qIEBtb2R1bGUgdWlcbiogQGNsYXNzIExheW91dE1hbmFnZW1lbnRNb2RlXG4qIEBtZW1iZXJvZiB1aVxuKiBAY29uc3RydWN0b3JcbiogQHN0YXRpY1xuKiBAZmluYWxcbiMjI1xuY2xhc3MgTGF5b3V0TWFuYWdlbWVudE1vZGVcbiAgICBAaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFsbCBzdWItb2JqZWN0cyBhcmUgY3JlYXRlZCBhdCBzZXR1cCB0aW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBOT1JNQUxcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBATk9STUFMID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBzdWItb2JqZWN0cyBhcmUgY3JlYXRlZCBhdCB1cGRhdGUgdGltZSBhbmQgb25seSB0aG9zZSB3aGljaCBhcmUgY3VycmVudGx5IHZpc2libGUuXG4gICAgICAgICogQHByb3BlcnR5IEpVU1RfSU5fVElNRVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBKVVNUX0lOX1RJTUUgPSAxXG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgY29uc3RhbnQgbnVtYmVyIHZhbHVlIGZyb20gYSBzcGVjaWZpZWQgaHVtYW4tcmVhZGFibGUgc3RyaW5nLlxuICAgICogQG1ldGhvZCBmcm9tU3RyaW5nXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcyAtIFRoZSBtYW5hZ2VtZW50IG1vZGUgYXMgc3RyaW5nLiBDYW4gYmUgXCJub3JtYWxcIiBvciBcImp1c3RfaW5fdGltZVwiLlxuICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgY29uc3RhbnQgbnVtYmVyIHZhbHVlLlxuICAgICogQHN0YXRpY1xuICAgICogQGZpbmFsXG4gICAgIyMjXG4gICAgQGZyb21TdHJpbmc6IChzKSAtPlxuICAgICAgICBzd2l0Y2ggc1xuICAgICAgICAgICAgd2hlbiBcIm5vcm1hbFwiXG4gICAgICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICAgIHdoZW4gXCJqdXN0X2luX3RpbWVcIlxuICAgICAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgICAgICBlbHNlIFxuICAgICAgICAgICAgICAgIHJldHVybiAwXG4gXG5MYXlvdXRNYW5hZ2VtZW50TW9kZS5pbml0aWFsaXplKCkgICBcbnVpLkxheW91dE1hbmFnZW1lbnRNb2RlID0gTGF5b3V0TWFuYWdlbWVudE1vZGUiXX0=
//# sourceURL=LayoutManagementMode_28.js