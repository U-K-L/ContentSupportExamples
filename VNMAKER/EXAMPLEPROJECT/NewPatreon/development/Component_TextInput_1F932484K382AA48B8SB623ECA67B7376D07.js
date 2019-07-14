var Component_TextInput,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_TextInput = (function(superClass) {
  extend(Component_TextInput, superClass);


  /**
  * The text-input component defines the logic for the text-input window
  * of the default In-Game UI. 
  *
  * @module gs
  * @class Component_TextInput
  * @extends gs.Component
  * @memberof gs
  * @constructor
  * @params {Object} params - The params-object needs at least a letters-property to define 
  * the number of letters for the text. The letters-property can also be a property-path.
   */

  function Component_TextInput(params) {

    /**
    * The max. number of letters.
    * @property letters
    * @type number
     */
    this.letters = ui.Component_FormulaHandler.fieldValue(this, params.letters);

    /**
    * The cursor position. Points to the current letter.
    * @property cursor
    * @type number
    * @protected
     */
    this.cursor = 0;

    /**
    * The current text.
    * @property text
    * @type string
     */
    this.text = "";
  }


  /**
  * Puts the specified text into the UI label-objects to make it visible
  * on screen.
  *
  * @method setText
  * @param {string} text The text to set.
   */

  Component_TextInput.prototype.setText = function(text) {
    var c, i, j, len;
    for (i = j = 0, len = text.length; j < len; i = ++j) {
      c = text[i];
      this.object.controls[i].controls[1].text = c;
    }
    return null;
  };


  /**
  * An action-method to add a single letter to the text.
  *
  * @method action_addLetter
  * @param {gs.Object_Base} sender The sender of the action.
  * @param {Object} params The params-object which needs a letter-property containing the letter to add.
   */

  Component_TextInput.prototype.action_addLetter = function(sender, params) {
    var letter;
    letter = params.letter;
    if (this.text.length < this.letters) {
      this.text += letter;
    } else {
      this.text = this.text.replaceAt(this.text.length - 1, letter.toString());
    }
    return this.setText(this.text.rfill(" ", this.letters));
  };


  /**
  * An action-method to clear the letter at the current cursor position.
  *
  * @method action_removeLetter
  * @param {gs.Object_Base} sender The sender of the action.
  * @param {Object} [params=null] The params-object. Can be <b>null</b>.
   */

  Component_TextInput.prototype.action_removeLetter = function() {
    if (this.text.length > 0) {
      this.text = this.text.substring(0, this.text.length - 1);
    }
    return this.setText(this.text.rfill(" ", this.letters));
  };

  return Component_TextInput;

})(gs.Component);

gs.Component_TextInput = Component_TextInput;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsbUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7OztFQVlhLDZCQUFDLE1BQUQ7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBNUIsQ0FBdUMsSUFBdkMsRUFBNkMsTUFBTSxDQUFDLE9BQXBEOztBQUVYOzs7Ozs7SUFNQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7OztJQUtBLElBQUMsQ0FBQSxJQUFELEdBQVE7RUFyQkM7OztBQXVCYjs7Ozs7Ozs7Z0NBT0EsT0FBQSxHQUFTLFNBQUMsSUFBRDtBQUNMLFFBQUE7QUFBQSxTQUFBLDhDQUFBOztNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFoQyxHQUF1QztBQUQzQztBQUdBLFdBQU87RUFKRjs7O0FBTVQ7Ozs7Ozs7O2dDQU9BLGdCQUFBLEdBQWtCLFNBQUMsTUFBRCxFQUFTLE1BQVQ7QUFDZCxRQUFBO0lBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQztJQUNoQixJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLElBQUMsQ0FBQSxPQUFuQjtNQUNJLElBQUMsQ0FBQSxJQUFELElBQVMsT0FEYjtLQUFBLE1BQUE7TUFHSSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFnQixJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sR0FBYSxDQUE3QixFQUFnQyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQWhDLEVBSFo7O1dBS0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLElBQUMsQ0FBQSxPQUFsQixDQUFUO0VBUGM7OztBQVNsQjs7Ozs7Ozs7Z0NBT0EsbUJBQUEsR0FBcUIsU0FBQTtJQUNqQixJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLENBQWxCO01BQ0ksSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWEsQ0FBaEMsRUFEWjs7V0FHQSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLEdBQVosRUFBaUIsSUFBQyxDQUFBLE9BQWxCLENBQVQ7RUFKaUI7Ozs7R0F4RVMsRUFBRSxDQUFDOztBQThFckMsRUFBRSxDQUFDLG1CQUFILEdBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfVGV4dElucHV0XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfVGV4dElucHV0IGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgIyMjKlxuICAgICogVGhlIHRleHQtaW5wdXQgY29tcG9uZW50IGRlZmluZXMgdGhlIGxvZ2ljIGZvciB0aGUgdGV4dC1pbnB1dCB3aW5kb3dcbiAgICAqIG9mIHRoZSBkZWZhdWx0IEluLUdhbWUgVUkuIFxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfVGV4dElucHV0XG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKiBAcGFyYW1zIHtPYmplY3R9IHBhcmFtcyAtIFRoZSBwYXJhbXMtb2JqZWN0IG5lZWRzIGF0IGxlYXN0IGEgbGV0dGVycy1wcm9wZXJ0eSB0byBkZWZpbmUgXG4gICAgKiB0aGUgbnVtYmVyIG9mIGxldHRlcnMgZm9yIHRoZSB0ZXh0LiBUaGUgbGV0dGVycy1wcm9wZXJ0eSBjYW4gYWxzbyBiZSBhIHByb3BlcnR5LXBhdGguXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IChwYXJhbXMpIC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbWF4LiBudW1iZXIgb2YgbGV0dGVycy5cbiAgICAgICAgKiBAcHJvcGVydHkgbGV0dGVyc1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGxldHRlcnMgPSB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZSh0aGlzLCBwYXJhbXMubGV0dGVycylcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3Vyc29yIHBvc2l0aW9uLiBQb2ludHMgdG8gdGhlIGN1cnJlbnQgbGV0dGVyLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXJzb3JcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY3Vyc29yID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjdXJyZW50IHRleHQuXG4gICAgICAgICogQHByb3BlcnR5IHRleHRcbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgIyMjXG4gICAgICAgIEB0ZXh0ID0gXCJcIlxuXG4gICAgIyMjKlxuICAgICogUHV0cyB0aGUgc3BlY2lmaWVkIHRleHQgaW50byB0aGUgVUkgbGFiZWwtb2JqZWN0cyB0byBtYWtlIGl0IHZpc2libGVcbiAgICAqIG9uIHNjcmVlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldFRleHRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHNldC5cbiAgICAjIyMgIFxuICAgIHNldFRleHQ6ICh0ZXh0KSAtPlxuICAgICAgICBmb3IgYywgaSBpbiB0ZXh0XG4gICAgICAgICAgICBAb2JqZWN0LmNvbnRyb2xzW2ldLmNvbnRyb2xzWzFdLnRleHQgPSBjXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgXG4gICAgIyMjKlxuICAgICogQW4gYWN0aW9uLW1ldGhvZCB0byBhZGQgYSBzaW5nbGUgbGV0dGVyIHRvIHRoZSB0ZXh0LlxuICAgICpcbiAgICAqIEBtZXRob2QgYWN0aW9uX2FkZExldHRlclxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gc2VuZGVyIFRoZSBzZW5kZXIgb2YgdGhlIGFjdGlvbi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHBhcmFtcy1vYmplY3Qgd2hpY2ggbmVlZHMgYSBsZXR0ZXItcHJvcGVydHkgY29udGFpbmluZyB0aGUgbGV0dGVyIHRvIGFkZC5cbiAgICAjIyMgICBcbiAgICBhY3Rpb25fYWRkTGV0dGVyOiAoc2VuZGVyLCBwYXJhbXMpIC0+XG4gICAgICAgIGxldHRlciA9IHBhcmFtcy5sZXR0ZXJcbiAgICAgICAgaWYgQHRleHQubGVuZ3RoIDwgQGxldHRlcnNcbiAgICAgICAgICAgIEB0ZXh0ICs9IGxldHRlclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGV4dCA9IEB0ZXh0LnJlcGxhY2VBdChAdGV4dC5sZW5ndGgtMSwgbGV0dGVyLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFRleHQoQHRleHQucmZpbGwoXCIgXCIsIEBsZXR0ZXJzKSlcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQW4gYWN0aW9uLW1ldGhvZCB0byBjbGVhciB0aGUgbGV0dGVyIGF0IHRoZSBjdXJyZW50IGN1cnNvciBwb3NpdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFjdGlvbl9yZW1vdmVMZXR0ZXJcbiAgICAqIEBwYXJhbSB7Z3MuT2JqZWN0X0Jhc2V9IHNlbmRlciBUaGUgc2VuZGVyIG9mIHRoZSBhY3Rpb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcz1udWxsXSBUaGUgcGFyYW1zLW9iamVjdC4gQ2FuIGJlIDxiPm51bGw8L2I+LlxuICAgICMjIyAgXG4gICAgYWN0aW9uX3JlbW92ZUxldHRlcjogLT5cbiAgICAgICAgaWYgQHRleHQubGVuZ3RoID4gMFxuICAgICAgICAgICAgQHRleHQgPSBAdGV4dC5zdWJzdHJpbmcoMCwgQHRleHQubGVuZ3RoLTEpXG4gICAgICAgICAgICBcbiAgICAgICAgQHNldFRleHQoQHRleHQucmZpbGwoXCIgXCIsIEBsZXR0ZXJzKSlcbiAgICAgICAgXG5ncy5Db21wb25lbnRfVGV4dElucHV0ID0gQ29tcG9uZW50X1RleHRJbnB1dCJdfQ==
//# sourceURL=Component_TextInput_168.js