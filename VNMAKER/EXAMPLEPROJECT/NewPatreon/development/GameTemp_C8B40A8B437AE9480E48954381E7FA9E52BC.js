var GameTemp;

GameTemp = (function() {

  /**
  * The GameTemp holds the temporary data of the currently running game like currently displayed
  * choices, choice timer, etc. The GameTemp is written to the save-game as well.
  *
  * @module gs
  * @class GameTemp
  * @memberof gs
  * @constructor
  * @param {Object} data - An optional data-bundle to initialize the game-temp from.
   */
  function GameTemp(data) {

    /**
    * Stores the current choice timer.
    *
    * @property choiceTimer
    * @type gs.Object_Timer
     */
    this.choiceTimer = null;

    /**
    * Stores the current choices.
    *
    * @property choices
    * @type Object[]
     */
    this.choices = [];
    this.restore(data);
  }


  /**
  * Serializes the game-temp into a data-bundle.
  *
  * @method toDataBundle
  * @return {Object} A data-bundle which can be serialized to JSON.
   */

  GameTemp.prototype.toDataBundle = function() {
    var bundle, ref;
    bundle = {};
    Object.mixin(bundle, this);
    bundle.choiceTimer = (ref = this.choiceTimer) != null ? ref.toDataBundle() : void 0;
    return bundle;
  };


  /**
  * Restores the game-temp from a data-bundle.
  *
  * @method restore
  * @param {Object} data - A data-bundle to restore the game-temp from.
   */

  GameTemp.prototype.restore = function(data) {
    if (!data) {
      return;
    }
    Object.mixin(this, data);
    if (data.choiceTimer) {
      return this.choiceTimer = new gs.Object_Timer(data.choiceTimer);
    }
  };


  /**
  * Clears the game temp.
  *
  * @method clear
   */

  GameTemp.prototype.clear = function() {
    return Object.keys(this).forEach((function(_this) {
      return function(x) {
        return delete _this[x];
      };
    })(this));
  };

  return GameTemp;

})();

gs.GameTemp = GameTemp;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7RUFVYSxrQkFBQyxJQUFEOztBQUNUOzs7Ozs7SUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7SUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRVgsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFUO0VBakJTOzs7QUFtQmI7Ozs7Ozs7cUJBTUEsWUFBQSxHQUFjLFNBQUE7QUFDVixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLEVBQXFCLElBQXJCO0lBRUEsTUFBTSxDQUFDLFdBQVAseUNBQWlDLENBQUUsWUFBZCxDQUFBO0FBRXJCLFdBQU87RUFORzs7O0FBUWQ7Ozs7Ozs7cUJBTUEsT0FBQSxHQUFTLFNBQUMsSUFBRDtJQUNMLElBQUcsQ0FBQyxJQUFKO0FBQWMsYUFBZDs7SUFFQSxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsRUFBbUIsSUFBbkI7SUFFQSxJQUFHLElBQUksQ0FBQyxXQUFSO2FBQ0ksSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFJLENBQUMsV0FBckIsRUFEdkI7O0VBTEs7OztBQVFUOzs7Ozs7cUJBS0EsS0FBQSxHQUFPLFNBQUE7V0FDSCxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsQ0FBRDtlQUFPLE9BQU8sS0FBSyxDQUFBLENBQUE7TUFBbkI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO0VBREc7Ozs7OztBQUdYLEVBQUUsQ0FBQyxRQUFILEdBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IEdhbWVUZW1wXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBHYW1lVGVtcFxuICAgICMjIypcbiAgICAqIFRoZSBHYW1lVGVtcCBob2xkcyB0aGUgdGVtcG9yYXJ5IGRhdGEgb2YgdGhlIGN1cnJlbnRseSBydW5uaW5nIGdhbWUgbGlrZSBjdXJyZW50bHkgZGlzcGxheWVkXG4gICAgKiBjaG9pY2VzLCBjaG9pY2UgdGltZXIsIGV0Yy4gVGhlIEdhbWVUZW1wIGlzIHdyaXR0ZW4gdG8gdGhlIHNhdmUtZ2FtZSBhcyB3ZWxsLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBHYW1lVGVtcFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gQW4gb3B0aW9uYWwgZGF0YS1idW5kbGUgdG8gaW5pdGlhbGl6ZSB0aGUgZ2FtZS10ZW1wIGZyb20uXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChkYXRhKSAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIHRoZSBjdXJyZW50IGNob2ljZSB0aW1lci5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBjaG9pY2VUaW1lclxuICAgICAgICAqIEB0eXBlIGdzLk9iamVjdF9UaW1lclxuICAgICAgICAjIyMgXG4gICAgICAgIEBjaG9pY2VUaW1lciA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgdGhlIGN1cnJlbnQgY2hvaWNlcy5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBjaG9pY2VzXG4gICAgICAgICogQHR5cGUgT2JqZWN0W11cbiAgICAgICAgIyMjIFxuICAgICAgICBAY2hvaWNlcyA9IFtdXG4gICAgICAgIFxuICAgICAgICBAcmVzdG9yZShkYXRhKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXJpYWxpemVzIHRoZSBnYW1lLXRlbXAgaW50byBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgdG9EYXRhQnVuZGxlXG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgZGF0YS1idW5kbGUgd2hpY2ggY2FuIGJlIHNlcmlhbGl6ZWQgdG8gSlNPTi5cbiAgICAjIyMgXG4gICAgdG9EYXRhQnVuZGxlOiAtPlxuICAgICAgICBidW5kbGUgPSB7fVxuICAgICAgICBPYmplY3QubWl4aW4oYnVuZGxlLCB0aGlzKVxuICAgIFxuICAgICAgICBidW5kbGUuY2hvaWNlVGltZXIgPSBAY2hvaWNlVGltZXI/LnRvRGF0YUJ1bmRsZSgpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gYnVuZGxlXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIHRoZSBnYW1lLXRlbXAgZnJvbSBhIGRhdGEtYnVuZGxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZVxuICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBBIGRhdGEtYnVuZGxlIHRvIHJlc3RvcmUgdGhlIGdhbWUtdGVtcCBmcm9tLlxuICAgICMjIyAgICAgXG4gICAgcmVzdG9yZTogKGRhdGEpIC0+XG4gICAgICAgIGlmICFkYXRhIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBPYmplY3QubWl4aW4odGhpcywgZGF0YSlcbiAgICAgICAgXG4gICAgICAgIGlmIGRhdGEuY2hvaWNlVGltZXJcbiAgICAgICAgICAgIEBjaG9pY2VUaW1lciA9IG5ldyBncy5PYmplY3RfVGltZXIoZGF0YS5jaG9pY2VUaW1lcilcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIENsZWFycyB0aGUgZ2FtZSB0ZW1wLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2xlYXJcbiAgICAjIyMgXG4gICAgY2xlYXI6IC0+XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMpLmZvckVhY2ggKHgpID0+IGRlbGV0ZSB0aGlzW3hdXG5cbmdzLkdhbWVUZW1wID0gR2FtZVRlbXAiXX0=
//# sourceURL=GameTemp_33.js