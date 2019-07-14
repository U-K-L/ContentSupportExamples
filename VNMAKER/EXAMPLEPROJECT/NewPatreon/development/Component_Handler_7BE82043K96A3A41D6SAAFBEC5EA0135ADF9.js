var Component_Handler,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Handler = (function(superClass) {
  extend(Component_Handler, superClass);


  /**
  * The base class for all handler-components. A handler-component is
  * used to handle condition- or event-based processes of a In-Game UI
  * object like executing bindings or triggering actions.
  *
  * A handler is only executed if all assigned conditions and events are
  * true.
  *
  * @module ui
  * @class Component_Handler
  * @extends gs.Component
  * @memberof ui
  * @constructor
   */

  function Component_Handler() {

    /**
    * @property mouseEntered
    * @type boolean
    * @protected
     */
    this.mouseEntered = false;

    /**
    * @property mouseLeaved
    * @type boolean
    * @protected
     */
    this.mouseLeaved = true;
  }


  /**
  * Checks if the condition is <b>true</b> for the specified game object.
  *
  * @method checkCondition
  * @param {gs.Object_Base} object The game object.
  * @param {Object} condition The condition-object.
  * @return {boolean} If <b>true</b> the condition is true. Otherwise <b>false</b>.
  * @static
   */

  Component_Handler.checkCondition = function(object, condition) {
    var result;
    result = false;
    if (condition.equalTo != null) {
      result = ui.Component_FormulaHandler.fieldValue(object, condition.field) === ui.Component_FormulaHandler.fieldValue(object, condition.equalTo);
    } else if (condition.greaterThan != null) {
      result = ui.Component_FormulaHandler.fieldValue(object, condition.field) > ui.Component_FormulaHandler.fieldValue(object, condition.greaterThan);
    } else if (condition.lessThan != null) {
      result = ui.Component_FormulaHandler.fieldValue(object, condition.field) < ui.Component_FormulaHandler.fieldValue(object, condition.lessThan);
    } else if (condition.notEqualTo != null) {
      result = ui.Component_FormulaHandler.fieldValue(object, condition.field) !== ui.Component_FormulaHandler.fieldValue(object, condition.notEqualTo);
    }
    return result;
  };


  /**
  * Checks if the specified condition is <b>true</b>.
  *
  * @method checkCondition
  * @param {Object} condition The condition-object.
  * @return {boolean} If <b>true</b> the condition is true. Otherwise <b>false</b>.
   */

  Component_Handler.prototype.checkCondition = function(condition) {
    return ui.Component_Handler.checkCondition(this.object, condition);
  };


  /**
  * Checks if the specified conditions are <b>true</b>.
  *
  * @method checkConditions
  * @param {Object[]} conditions An array of condition-objects.
  * @return {boolean} If <b>true</b> all conditions are true. Otherwise <b>false</b>.
   */

  Component_Handler.prototype.checkConditions = function(conditions) {
    var condition, i, len, result;
    result = true;
    for (i = 0, len = conditions.length; i < len; i++) {
      condition = conditions[i];
      if (!this.checkCondition(condition)) {
        result = false;
        break;
      }
    }
    return result;
  };


  /**
  * Checks if the specified event is true.
  *
  * @method checkEvent
  * @param {Object} event The event to check for.
  * @param {Object} [binding=null] binding An optional binding-object necessary for some event-types.
  * @return {boolean} If <b>true</b> the event is true. Otherwise <b>false</b>.
   */

  Component_Handler.prototype.checkEvent = function(event, binding) {
    var entered, leaved, ref, ref1, result, value;
    result = false;
    if (event === "onAlways") {
      result = true;
    } else if (event === "onAction") {
      result = Input.Mouse.buttons[Input.Mouse.LEFT] === 2 && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
    } else if (event === "onCancel") {
      result = Input.Mouse.buttons[Input.Mouse.RIGHT] === 2 && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
    } else if (event === "onAccept") {
      result = Input.release(Input.KEY_RETURN) || (Input.Mouse.buttons[Input.Mouse.LEFT] === 2 && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y));
    } else if (event === "onDragEnter") {
      entered = ((ref = this.object.dragDrop) != null ? ref.isDragging : void 0) && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
      result = !this.mouseEntered && entered;
      this.mouseEntered = entered;
    } else if (event === "onDragLeave") {
      leaved = ((ref1 = this.object.dragDrop) != null ? ref1.isDragging : void 0) && !this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
      result = !this.mouseLeaved && leaved;
      this.mouseLeaved = leaved;
    } else if (event === "onMouseEnter") {
      entered = this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
      result = !this.mouseEntered && entered;
      this.mouseEntered = entered;
    } else if (event === "onMouseLeave") {
      leaved = !this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
      result = !this.mouseLeaved && leaved;
      this.mouseLeaved = leaved;
    } else if (event === "onMouseHover") {
      result = this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
    } else if (event === "onMouseClick") {
      result = Input.Mouse.buttons[Input.Mouse.LEFT] === 2 && this.object.dstRect.contains(Input.Mouse.x - this.object.origin.x, Input.Mouse.y - this.object.origin.y);
    } else if (event.onChange != null) {
      value = this.resolveFieldPath(event.onChange);
      if (value != null) {
        value = value.get(this.object);
        if (binding[event.onChange] !== value) {
          binding[event.onChange] = value;
          result = true;
        }
      } else {
        result = true;
      }
    }
    return result;
  };


  /**
  * Checks if all events and conditions defined for the handler
  * are true. If that check returns <b>true</b> the handler must be
  * executed.
  *
  * @method checkObject
  * @param {Object} object The game object to check.
  * @return {boolean} If <b>true</b> the handler must be executed. Otherwise <b>false</b>.
   */

  Component_Handler.prototype.checkObject = function(object) {
    var event, execute, i, len, ref;
    execute = true;
    if (object.event != null) {
      object.events = [object.event];
      delete object.event;
    }
    if (object.condition != null) {
      object.conditions = [object.condition];
      delete object.condition;
    }
    if (object.events != null) {
      ref = object.events;
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
        execute = this.checkEvent(event, object);
        if (execute) {
          break;
        }
      }
    }
    if ((object.conditions != null) && execute) {
      execute = this.checkConditions(object.conditions);
    }
    return execute;
  };

  return Component_Handler;

})(gs.Component);

ui.Component_Handler = Component_Handler;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsaUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7Ozs7Ozs7O0VBY2EsMkJBQUE7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7O0FBRWhCOzs7OztJQUtBLElBQUMsQ0FBQSxXQUFELEdBQWU7RUFiTjs7O0FBZWI7Ozs7Ozs7Ozs7RUFTQSxpQkFBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxNQUFELEVBQVMsU0FBVDtBQUNiLFFBQUE7SUFBQSxNQUFBLEdBQVM7SUFFVCxJQUFHLHlCQUFIO01BQ0ksTUFBQSxHQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUE1QixDQUF1QyxNQUF2QyxFQUErQyxTQUFTLENBQUMsS0FBekQsQ0FBQSxLQUFtRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBNUIsQ0FBdUMsTUFBdkMsRUFBK0MsU0FBUyxDQUFDLE9BQXpELEVBRGhGO0tBQUEsTUFFSyxJQUFHLDZCQUFIO01BQ0QsTUFBQSxHQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUE1QixDQUF1QyxNQUF2QyxFQUErQyxTQUFTLENBQUMsS0FBekQsQ0FBQSxHQUFrRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBNUIsQ0FBdUMsTUFBdkMsRUFBK0MsU0FBUyxDQUFDLFdBQXpELEVBRDFFO0tBQUEsTUFFQSxJQUFHLDBCQUFIO01BQ0QsTUFBQSxHQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUE1QixDQUF1QyxNQUF2QyxFQUErQyxTQUFTLENBQUMsS0FBekQsQ0FBQSxHQUFrRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBNUIsQ0FBdUMsTUFBdkMsRUFBK0MsU0FBUyxDQUFDLFFBQXpELEVBRDFFO0tBQUEsTUFFQSxJQUFHLDRCQUFIO01BQ0QsTUFBQSxHQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxVQUE1QixDQUF1QyxNQUF2QyxFQUErQyxTQUFTLENBQUMsS0FBekQsQ0FBQSxLQUFtRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsVUFBNUIsQ0FBdUMsTUFBdkMsRUFBK0MsU0FBUyxDQUFDLFVBQXpELEVBRDNFOztBQUdMLFdBQU87RUFaTTs7O0FBY2pCOzs7Ozs7Ozs4QkFPQSxjQUFBLEdBQWdCLFNBQUMsU0FBRDtXQUFlLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFyQixDQUFvQyxJQUFDLENBQUEsTUFBckMsRUFBNkMsU0FBN0M7RUFBZjs7O0FBRWhCOzs7Ozs7Ozs4QkFPQSxlQUFBLEdBQWlCLFNBQUMsVUFBRDtBQUNiLFFBQUE7SUFBQSxNQUFBLEdBQVM7QUFDVCxTQUFBLDRDQUFBOztNQUNJLElBQUcsQ0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixTQUFoQixDQUFQO1FBQ0ksTUFBQSxHQUFTO0FBQ1QsY0FGSjs7QUFESjtBQUtBLFdBQU87RUFQTTs7O0FBU2pCOzs7Ozs7Ozs7OEJBUUEsVUFBQSxHQUFZLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDUixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBS1QsSUFBRyxLQUFBLEtBQVMsVUFBWjtNQUNJLE1BQUEsR0FBUyxLQURiO0tBQUEsTUFFSyxJQUFHLEtBQUEsS0FBUyxVQUFaO01BQ0QsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBUSxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWixDQUFwQixLQUF5QyxDQUF6QyxJQUErQyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFoQixDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBeEQsRUFBMkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQTFGLEVBRHZEO0tBQUEsTUFFQSxJQUFHLEtBQUEsS0FBUyxVQUFaO01BQ0QsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBUSxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBWixDQUFwQixLQUEwQyxDQUExQyxJQUFnRCxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFoQixDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBeEQsRUFBMkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQTFGLEVBRHhEO0tBQUEsTUFFQSxJQUFHLEtBQUEsS0FBUyxVQUFaO01BQ0QsTUFBQSxHQUFTLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBSyxDQUFDLFVBQXBCLENBQUEsSUFBbUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVosQ0FBcEIsS0FBeUMsQ0FBekMsSUFBK0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBaEIsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXhELEVBQTJELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUExRixDQUFoRCxFQUQzQztLQUFBLE1BRUEsSUFBRyxLQUFBLEtBQVMsYUFBWjtNQUNELE9BQUEsOENBQTBCLENBQUUsb0JBQWxCLElBQWlDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQWhCLENBQXlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUF4RCxFQUEyRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBMUY7TUFDM0MsTUFBQSxHQUFTLENBQUMsSUFBQyxDQUFBLFlBQUYsSUFBbUI7TUFDNUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFIZjtLQUFBLE1BSUEsSUFBRyxLQUFBLEtBQVMsYUFBWjtNQUNELE1BQUEsZ0RBQXlCLENBQUUsb0JBQWxCLElBQWlDLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBaEIsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXhELEVBQTJELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUExRjtNQUMzQyxNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsV0FBRixJQUFrQjtNQUMzQixJQUFDLENBQUEsV0FBRCxHQUFlLE9BSGQ7S0FBQSxNQUlBLElBQUcsS0FBQSxLQUFTLGNBQVo7TUFDRCxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBaEIsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXhELEVBQTJELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUExRjtNQUNWLE1BQUEsR0FBUyxDQUFDLElBQUMsQ0FBQSxZQUFGLElBQW1CO01BQzVCLElBQUMsQ0FBQSxZQUFELEdBQWdCLFFBSGY7S0FBQSxNQUlBLElBQUcsS0FBQSxLQUFTLGNBQVo7TUFDRCxNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFoQixDQUF5QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBeEQsRUFBMkQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQTFGO01BQ1YsTUFBQSxHQUFTLENBQUMsSUFBQyxDQUFBLFdBQUYsSUFBa0I7TUFDM0IsSUFBQyxDQUFBLFdBQUQsR0FBZSxPQUhkO0tBQUEsTUFJQSxJQUFHLEtBQUEsS0FBUyxjQUFaO01BQ0QsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQWhCLENBQXlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUF4RCxFQUEyRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQVosR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBMUYsRUFEUjtLQUFBLE1BRUEsSUFBRyxLQUFBLEtBQVMsY0FBWjtNQUNELE1BQUEsR0FBUyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVosQ0FBcEIsS0FBeUMsQ0FBekMsSUFBK0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBaEIsQ0FBeUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFaLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXhELEVBQTJELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBWixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUExRixFQUR2RDtLQUFBLE1BRUEsSUFBRyxzQkFBSDtNQUNELEtBQUEsR0FBUSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBSyxDQUFDLFFBQXhCO01BQ1IsSUFBRyxhQUFIO1FBQ0ksS0FBQSxHQUFRLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBQyxDQUFBLE1BQVg7UUFDUixJQUFHLE9BQVEsQ0FBQSxLQUFLLENBQUMsUUFBTixDQUFSLEtBQTJCLEtBQTlCO1VBQ0ksT0FBUSxDQUFBLEtBQUssQ0FBQyxRQUFOLENBQVIsR0FBMEI7VUFDMUIsTUFBQSxHQUFTLEtBRmI7U0FGSjtPQUFBLE1BQUE7UUFNSSxNQUFBLEdBQVMsS0FOYjtPQUZDOztBQVdMLFdBQU87RUE3Q0M7OztBQStDWjs7Ozs7Ozs7Ozs4QkFTQSxXQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1QsUUFBQTtJQUFBLE9BQUEsR0FBVTtJQUVWLElBQUcsb0JBQUg7TUFDSSxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFSO01BQ2hCLE9BQU8sTUFBTSxDQUFDLE1BRmxCOztJQUdBLElBQUcsd0JBQUg7TUFDSSxNQUFNLENBQUMsVUFBUCxHQUFvQixDQUFDLE1BQU0sQ0FBQyxTQUFSO01BQ3BCLE9BQU8sTUFBTSxDQUFDLFVBRmxCOztJQUdBLElBQUcscUJBQUg7QUFDSTtBQUFBLFdBQUEscUNBQUE7O1FBQ0ksT0FBQSxHQUFVLElBQUMsQ0FBQSxVQUFELENBQVksS0FBWixFQUFtQixNQUFuQjtRQUNWLElBQUcsT0FBSDtBQUFnQixnQkFBaEI7O0FBRkosT0FESjs7SUFJQSxJQUFHLDJCQUFBLElBQXVCLE9BQTFCO01BQ0ksT0FBQSxHQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxVQUF4QixFQURkOztBQUdBLFdBQU87RUFoQkU7Ozs7R0E5SWUsRUFBRSxDQUFDOztBQWdLbkMsRUFBRSxDQUFDLGlCQUFILEdBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfRnJlZUxheW91dEJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfSGFuZGxlciBleHRlbmRzIGdzLkNvbXBvbmVudFxuICAgICMjIypcbiAgICAqIFRoZSBiYXNlIGNsYXNzIGZvciBhbGwgaGFuZGxlci1jb21wb25lbnRzLiBBIGhhbmRsZXItY29tcG9uZW50IGlzXG4gICAgKiB1c2VkIHRvIGhhbmRsZSBjb25kaXRpb24tIG9yIGV2ZW50LWJhc2VkIHByb2Nlc3NlcyBvZiBhIEluLUdhbWUgVUlcbiAgICAqIG9iamVjdCBsaWtlIGV4ZWN1dGluZyBiaW5kaW5ncyBvciB0cmlnZ2VyaW5nIGFjdGlvbnMuXG4gICAgKlxuICAgICogQSBoYW5kbGVyIGlzIG9ubHkgZXhlY3V0ZWQgaWYgYWxsIGFzc2lnbmVkIGNvbmRpdGlvbnMgYW5kIGV2ZW50cyBhcmVcbiAgICAqIHRydWUuXG4gICAgKlxuICAgICogQG1vZHVsZSB1aVxuICAgICogQGNsYXNzIENvbXBvbmVudF9IYW5kbGVyXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAqIEBtZW1iZXJvZiB1aVxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgbW91c2VFbnRlcmVkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBtb3VzZUVudGVyZWQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBtb3VzZUxlYXZlZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAbW91c2VMZWF2ZWQgPSB5ZXNcbiAgICAgXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGlmIHRoZSBjb25kaXRpb24gaXMgPGI+dHJ1ZTwvYj4gZm9yIHRoZSBzcGVjaWZpZWQgZ2FtZSBvYmplY3QuXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGVja0NvbmRpdGlvblxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gb2JqZWN0IFRoZSBnYW1lIG9iamVjdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25kaXRpb24gVGhlIGNvbmRpdGlvbi1vYmplY3QuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiA8Yj50cnVlPC9iPiB0aGUgY29uZGl0aW9uIGlzIHRydWUuIE90aGVyd2lzZSA8Yj5mYWxzZTwvYj4uXG4gICAgKiBAc3RhdGljXG4gICAgIyMjICAgXG4gICAgQGNoZWNrQ29uZGl0aW9uOiAob2JqZWN0LCBjb25kaXRpb24pIC0+XG4gICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgIFxuICAgICAgICBpZiBjb25kaXRpb24uZXF1YWxUbz9cbiAgICAgICAgICAgIHJlc3VsdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLmZpZWxkKSA9PSB1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShvYmplY3QsIGNvbmRpdGlvbi5lcXVhbFRvKVxuICAgICAgICBlbHNlIGlmIGNvbmRpdGlvbi5ncmVhdGVyVGhhbj9cbiAgICAgICAgICAgIHJlc3VsdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLmZpZWxkKSA+IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLmdyZWF0ZXJUaGFuKVxuICAgICAgICBlbHNlIGlmIGNvbmRpdGlvbi5sZXNzVGhhbj9cbiAgICAgICAgICAgIHJlc3VsdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLmZpZWxkKSA8IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLmxlc3NUaGFuKVxuICAgICAgICBlbHNlIGlmIGNvbmRpdGlvbi5ub3RFcXVhbFRvP1xuICAgICAgICAgICAgcmVzdWx0ID0gdWkuQ29tcG9uZW50X0Zvcm11bGFIYW5kbGVyLmZpZWxkVmFsdWUob2JqZWN0LCBjb25kaXRpb24uZmllbGQpICE9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG9iamVjdCwgY29uZGl0aW9uLm5vdEVxdWFsVG8pXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgIFxuICAgICMjIypcbiAgICAqIENoZWNrcyBpZiB0aGUgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyA8Yj50cnVlPC9iPi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNoZWNrQ29uZGl0aW9uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gY29uZGl0aW9uIFRoZSBjb25kaXRpb24tb2JqZWN0LlxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgPGI+dHJ1ZTwvYj4gdGhlIGNvbmRpdGlvbiBpcyB0cnVlLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+LlxuICAgICMjIyAgICAgXG4gICAgY2hlY2tDb25kaXRpb246IChjb25kaXRpb24pIC0+IHVpLkNvbXBvbmVudF9IYW5kbGVyLmNoZWNrQ29uZGl0aW9uKEBvYmplY3QsIGNvbmRpdGlvbilcbiAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBjb25kaXRpb25zIGFyZSA8Yj50cnVlPC9iPi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNoZWNrQ29uZGl0aW9uc1xuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY29uZGl0aW9ucyBBbiBhcnJheSBvZiBjb25kaXRpb24tb2JqZWN0cy5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIDxiPnRydWU8L2I+IGFsbCBjb25kaXRpb25zIGFyZSB0cnVlLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+LlxuICAgICMjI1xuICAgIGNoZWNrQ29uZGl0aW9uczogKGNvbmRpdGlvbnMpIC0+XG4gICAgICAgIHJlc3VsdCA9IHllc1xuICAgICAgICBmb3IgY29uZGl0aW9uIGluIGNvbmRpdGlvbnNcbiAgICAgICAgICAgIGlmIG5vdCBAY2hlY2tDb25kaXRpb24oY29uZGl0aW9uKVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBldmVudCBpcyB0cnVlLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2hlY2tFdmVudFxuICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCB0byBjaGVjayBmb3IuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW2JpbmRpbmc9bnVsbF0gYmluZGluZyBBbiBvcHRpb25hbCBiaW5kaW5nLW9iamVjdCBuZWNlc3NhcnkgZm9yIHNvbWUgZXZlbnQtdHlwZXMuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiA8Yj50cnVlPC9iPiB0aGUgZXZlbnQgaXMgdHJ1ZS4gT3RoZXJ3aXNlIDxiPmZhbHNlPC9iPi5cbiAgICAjIyMgIFxuICAgIGNoZWNrRXZlbnQ6IChldmVudCwgYmluZGluZykgLT5cbiAgICAgICAgcmVzdWx0ID0gbm9cbiAgICAgICAgXG4gICAgICAgICNpZiBldmVudCA9PSBcIm9uSW5pdGlhbGl6ZVwiIGFuZCAhU2NlbmVNYW5hZ2VyLnNjZW5lLnByZXBhcmluZ1xuICAgICAgICAjICAgIHJlc3VsdCA9ICFAaW5pdGlhbGl6ZUV2ZW50RW1pdHRlZFxuICAgICAgICAjICAgIEBpbml0aWFsaXplRXZlbnRFbWl0dGVkID0geWVzXG4gICAgICAgIGlmIGV2ZW50ID09IFwib25BbHdheXNcIlxuICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgIGVsc2UgaWYgZXZlbnQgPT0gXCJvbkFjdGlvblwiXG4gICAgICAgICAgICByZXN1bHQgPSBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLkxFRlRdID09IDIgYW5kIEBvYmplY3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpIFxuICAgICAgICBlbHNlIGlmIGV2ZW50ID09IFwib25DYW5jZWxcIlxuICAgICAgICAgICAgcmVzdWx0ID0gSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5SSUdIVF0gPT0gMiBhbmQgQG9iamVjdC5kc3RSZWN0LmNvbnRhaW5zKElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54LCBJbnB1dC5Nb3VzZS55IC0gQG9iamVjdC5vcmlnaW4ueSkgICAgIFxuICAgICAgICBlbHNlIGlmIGV2ZW50ID09IFwib25BY2NlcHRcIlxuICAgICAgICAgICAgcmVzdWx0ID0gSW5wdXQucmVsZWFzZShJbnB1dC5LRVlfUkVUVVJOKSBvciAoSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyIGFuZCBAb2JqZWN0LmRzdFJlY3QuY29udGFpbnMoSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KSkgICAgICAgICBcbiAgICAgICAgZWxzZSBpZiBldmVudCA9PSBcIm9uRHJhZ0VudGVyXCIgICAgXG4gICAgICAgICAgICBlbnRlcmVkID0gQG9iamVjdC5kcmFnRHJvcD8uaXNEcmFnZ2luZyBhbmQgQG9iamVjdC5kc3RSZWN0LmNvbnRhaW5zKElucHV0Lk1vdXNlLnggLSBAb2JqZWN0Lm9yaWdpbi54LCBJbnB1dC5Nb3VzZS55IC0gQG9iamVjdC5vcmlnaW4ueSlcbiAgICAgICAgICAgIHJlc3VsdCA9ICFAbW91c2VFbnRlcmVkIGFuZCBlbnRlcmVkXG4gICAgICAgICAgICBAbW91c2VFbnRlcmVkID0gZW50ZXJlZFxuICAgICAgICBlbHNlIGlmIGV2ZW50ID09IFwib25EcmFnTGVhdmVcIlxuICAgICAgICAgICAgbGVhdmVkID0gQG9iamVjdC5kcmFnRHJvcD8uaXNEcmFnZ2luZyBhbmQgIUBvYmplY3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICByZXN1bHQgPSAhQG1vdXNlTGVhdmVkIGFuZCBsZWF2ZWRcbiAgICAgICAgICAgIEBtb3VzZUxlYXZlZCA9IGxlYXZlZFxuICAgICAgICBlbHNlIGlmIGV2ZW50ID09IFwib25Nb3VzZUVudGVyXCJcbiAgICAgICAgICAgIGVudGVyZWQgPSBAb2JqZWN0LmRzdFJlY3QuY29udGFpbnMoSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KVxuICAgICAgICAgICAgcmVzdWx0ID0gIUBtb3VzZUVudGVyZWQgYW5kIGVudGVyZWRcbiAgICAgICAgICAgIEBtb3VzZUVudGVyZWQgPSBlbnRlcmVkXG4gICAgICAgIGVsc2UgaWYgZXZlbnQgPT0gXCJvbk1vdXNlTGVhdmVcIlxuICAgICAgICAgICAgbGVhdmVkID0gIUBvYmplY3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgICAgICByZXN1bHQgPSAhQG1vdXNlTGVhdmVkIGFuZCBsZWF2ZWRcbiAgICAgICAgICAgIEBtb3VzZUxlYXZlZCA9IGxlYXZlZFxuICAgICAgICBlbHNlIGlmIGV2ZW50ID09IFwib25Nb3VzZUhvdmVyXCJcbiAgICAgICAgICAgIHJlc3VsdCA9IEBvYmplY3QuZHN0UmVjdC5jb250YWlucyhJbnB1dC5Nb3VzZS54IC0gQG9iamVjdC5vcmlnaW4ueCwgSW5wdXQuTW91c2UueSAtIEBvYmplY3Qub3JpZ2luLnkpXG4gICAgICAgIGVsc2UgaWYgZXZlbnQgPT0gXCJvbk1vdXNlQ2xpY2tcIlxuICAgICAgICAgICAgcmVzdWx0ID0gSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyIGFuZCBAb2JqZWN0LmRzdFJlY3QuY29udGFpbnMoSW5wdXQuTW91c2UueCAtIEBvYmplY3Qub3JpZ2luLngsIElucHV0Lk1vdXNlLnkgLSBAb2JqZWN0Lm9yaWdpbi55KVxuICAgICAgICBlbHNlIGlmIGV2ZW50Lm9uQ2hhbmdlP1xuICAgICAgICAgICAgdmFsdWUgPSBAcmVzb2x2ZUZpZWxkUGF0aChldmVudC5vbkNoYW5nZSlcbiAgICAgICAgICAgIGlmIHZhbHVlPyBcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmdldChAb2JqZWN0KVxuICAgICAgICAgICAgICAgIGlmIGJpbmRpbmdbZXZlbnQub25DaGFuZ2VdICE9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdbZXZlbnQub25DaGFuZ2VdID0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0geWVzXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgYWxsIGV2ZW50cyBhbmQgY29uZGl0aW9ucyBkZWZpbmVkIGZvciB0aGUgaGFuZGxlclxuICAgICogYXJlIHRydWUuIElmIHRoYXQgY2hlY2sgcmV0dXJucyA8Yj50cnVlPC9iPiB0aGUgaGFuZGxlciBtdXN0IGJlXG4gICAgKiBleGVjdXRlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNoZWNrT2JqZWN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBnYW1lIG9iamVjdCB0byBjaGVjay5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIDxiPnRydWU8L2I+IHRoZSBoYW5kbGVyIG11c3QgYmUgZXhlY3V0ZWQuIE90aGVyd2lzZSA8Yj5mYWxzZTwvYj4uXG4gICAgIyMjICAgICBcbiAgICBjaGVja09iamVjdDogKG9iamVjdCkgLT5cbiAgICAgICAgZXhlY3V0ZSA9IHllc1xuICAgICAgICAgICAgXG4gICAgICAgIGlmIG9iamVjdC5ldmVudD9cbiAgICAgICAgICAgIG9iamVjdC5ldmVudHMgPSBbb2JqZWN0LmV2ZW50XVxuICAgICAgICAgICAgZGVsZXRlIG9iamVjdC5ldmVudFxuICAgICAgICBpZiBvYmplY3QuY29uZGl0aW9uP1xuICAgICAgICAgICAgb2JqZWN0LmNvbmRpdGlvbnMgPSBbb2JqZWN0LmNvbmRpdGlvbl1cbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3QuY29uZGl0aW9uXG4gICAgICAgIGlmIG9iamVjdC5ldmVudHM/XG4gICAgICAgICAgICBmb3IgZXZlbnQgaW4gb2JqZWN0LmV2ZW50c1xuICAgICAgICAgICAgICAgIGV4ZWN1dGUgPSBAY2hlY2tFdmVudChldmVudCwgb2JqZWN0KVxuICAgICAgICAgICAgICAgIGlmIGV4ZWN1dGUgdGhlbiBicmVha1xuICAgICAgICBpZiBvYmplY3QuY29uZGl0aW9ucz8gYW5kIGV4ZWN1dGVcbiAgICAgICAgICAgIGV4ZWN1dGUgPSBAY2hlY2tDb25kaXRpb25zKG9iamVjdC5jb25kaXRpb25zKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGV4ZWN1dGVcblxudWkuQ29tcG9uZW50X0hhbmRsZXIgPSBDb21wb25lbnRfSGFuZGxlciJdfQ==
//# sourceURL=Component_Handler_98.js