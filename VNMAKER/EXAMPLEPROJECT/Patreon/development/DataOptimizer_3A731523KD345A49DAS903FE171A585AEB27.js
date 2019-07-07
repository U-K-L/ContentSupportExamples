var DataOptimizer;

DataOptimizer = (function() {

  /**
  * The data optimizer is to optimize data structures coming from data files to
  * make processing faster. One way of optimization for example is to convert
  * regular array to typed arrays.
  *
  * @module gs
  * @class DataOptimizer
  * @memberof gs
  * @static
  * @constructor
   */
  function DataOptimizer() {
    this.labels = {};
    this.labelJumps = {};
  }


  /**
  * Converts the specified number-array to a typed Int16 array.
  *
  * @method arrayToNativeArray
  * @param {Array} array - The array to convert.
  * @return {Int16Array} The typed array.
  * @static
   */

  DataOptimizer.prototype.arrayToNativeArray = function(array) {
    var i, j, length, ref, result;
    result = null;
    length = array.length || Object.keys(array).length;
    if (array != null) {
      if (window.ArrayBuffer != null) {
        result = new ArrayBuffer(length * 2);
        result = new Int16Array(result);
      } else {
        result = new Array(length);
      }
      for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        result[i] = array[i];
      }
    }
    return result;
  };


  /**
  * Creates a typed Int16 array if supported. Otherwise a regular array is created.
  *
  * @method nativeArray16
  * @param {number} size - The size of the array in elements.(Not in bytes).
  * @return {Int16Array} The Int16 array.
  * @static
   */

  DataOptimizer.prototype.nativeArray16 = function(size) {
    var result;
    result = new Array(size);
    return result;
  };


  /**
  * Creates a typed Int8 array if supported. Otherwise a regular array is created.
  *
  * @method nativeArray16
  * @param {number} size - The size of the array in elements.(Not in bytes).
  * @return {Int8Array} The Int8 array.
  * @static
   */

  DataOptimizer.prototype.nativeArray8 = function(size) {
    var result;
    result = new Array(size);
    return result;
  };


  /**
  * Removes a single empty command like a comment.
  *
  * @method removeEmptyCommand
  * @private
  * @param {Object[]} commands - A list of commands.
  * @param {Object} command - The command to optimize.
  * @static
   */

  DataOptimizer.prototype.removeEmptyCommand = function(command, index, commands) {
    var result;
    if (GameManager.inLivePreview) {
      return false;
    }
    result = false;
    switch (commands[index].id) {
      case "gs.Comment":
        commands.splice(index, 1);
        result = true;
        break;
      case "gs.EmptyCommand":
        commands.splice(index, 1);
        result = true;
    }
    return result;
  };


  /**
  * Checks if a common event call can be optimized by inline it. In special cases,
  * such as recursion or parameters, an optimization is no possible.
  *
  * @method optimizeCommonEventCall
  * @private
  * @param {Object[]} commands - A list of commands.
  * @param {number} index - Index of the command in command-list.
  * @param {Object} command - The command to optimize.
  * @return If <b>true</b> the call can be safly inline. Otherwise <b>false</b>
  * @static
   */

  DataOptimizer.prototype.canInlineCommonEventCall = function(command, index, commands, callStack) {
    var c, commonEvent, i, j, len, ref, result;
    result = !(command.params.commonEventId.index != null);
    commonEvent = RecordManager.commonEvents[command.params.commonEventId];
    if (commonEvent != null ? commonEvent.inline : void 0) {
      if (callStack.indexOf(commonEvent) !== -1) {
        result = false;
      } else {
        callStack.push(commonEvent);
        ref = commonEvent.commands;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          c = ref[i];
          if (c.id === "gs.CallCommonEvent") {
            result = this.canInlineCommonEventCall(c, i, commonEvent.commands, callStack);
          }
        }
      }
    }
    return result;
  };


  /**
  * Optimizes a common event call.
  *
  * @method optimizeCommonEventCall
  * @private
  * @param {Object[]} commands - A list of commands.
  * @param {number} index - Index of the command in command-list.
  * @param {Object} command - The command to optimize.
  * @static
   */

  DataOptimizer.prototype.optimizeCommonEventCall = function(command, index, commands) {
    var commonEvent;
    commonEvent = RecordManager.commonEvents[command.params.commonEventId];
    if (commonEvent != null ? commonEvent.inline : void 0) {
      if (this.canInlineCommonEventCall(command, index, commands, [])) {
        commands.splice(index, 1);
        return commands.splice.apply(commands, [index, 0].concat(Object.copy(commonEvent.commands)));
      }
    }
  };


  /**
  * Optimizes the variable-access by replacing the domain-string with the domain-index
  * value at runtime to allow faster domain access using integer numbers instead of strings.
  *
  * @method optimizeVariableAccess
  * @param {Object} data - The data to opimize, e.g. the params-object of a command.
  * @static
   */

  DataOptimizer.prototype.optimizeVariableAccess = function(data) {
    var domainIndex, e, p, ref, ref1, results;
    if (data != null ? data.__optimized : void 0) {
      return;
    }
    if (data != null) {
      data.__optimized = true;
    }
    results = [];
    for (p in data) {
      if (data[p] instanceof Array && !data[p].__optimized) {
        data[p].__optimized = true;
        results.push((function() {
          var j, len, ref, results1;
          ref = data[p];
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            e = ref[j];
            results1.push(this.optimizeVariableAccess(e));
          }
          return results1;
        }).call(this));
      } else if (p === "domain" && data.scope > 0 && (data.index != null)) {
        domainIndex = GameManager.variableStore.domains.indexOf(data[p]);
        results.push(data[p] = domainIndex === -1 ? data[p] : domainIndex);
      } else if (typeof data[p] === "object" && !(data[p] instanceof String || data[p] instanceof Array)) {
        if (!((ref = data[p]) != null ? ref.__optimized : void 0)) {
          this.optimizeVariableAccess(data[p]);
        }
        results.push((ref1 = data[p]) != null ? ref1.__optimized = true : void 0);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Optimizes a single command.
  *
  * @method optimizeCommand
  * @private
  * @param {Object[]} commands - A list of commands.
  * @param {number} index - Index of the command in command-list.
  * @param {Object} command - The command to optimize.
  * @static
   */

  DataOptimizer.prototype.optimizeCommand = function(command, index, commands) {
    var ref;
    this.optimizeVariableAccess(command.params);
    switch (command.id) {
      case "gs.CallCommonEvent":
        return this.optimizeCommonEventCall(command, index, commands);
      case "gs.Label":
        this.labels[command.params.name] = index;
        return (ref = this.labelJumps[command.params.name]) != null ? ref.forEach(function(c) {
          return c.params.labelIndex = index;
        }) : void 0;
      case "vn.Choice":
        command.params.action.labelIndex = this.labels[command.params.action.label];
        if (!this.labelJumps[command.params.action.label]) {
          this.labelJumps[command.params.action.label] = [];
        }
        return this.labelJumps[command.params.action.label].push(command);
      case "gs.CheckSwitch":
      case "gs.CheckNumberVariable":
      case "gs.CheckTextVariable":
        command.params.labelIndex = this.labels[command.params.label];
        if (!this.labelJumps[command.params.label]) {
          this.labelJumps[command.params.label] = [];
        }
        return this.labelJumps[command.params.label].push(command);
      case "gs.JumpToLabel":
        command.params.labelIndex = this.labels[command.params.name];
        if (!this.labelJumps[command.params.name]) {
          this.labelJumps[command.params.name] = [];
        }
        return this.labelJumps[command.params.name].push(command);
    }
  };


  /**
  * Optimizes a list of event/scene commands by removing unnecessary commands like
  * comments or empty commands. It also optimizes label jumps. Adds an <b>optimized</b> to
  * the specified command-list to indicate that the list was already optimized. If <b>optimized</b>
  * property of command-list is set to <b>true</b> this method will return immediately.
  *
  * @method optimizeEventCommands
  * @param {Object[]} commands - A list of commands to optimize.
  * @static
   */

  DataOptimizer.prototype.optimizeEventCommands = function(commands) {
    var i;
    if (commands.optimized) {
      return;
    }
    i = 0;
    this.labels = {};
    this.labelJumps = {};
    if (!$PARAMS.preview) {
      while (i < commands.length) {
        commands[i].indent = commands[i].indent || 0;
        if (this.removeEmptyCommand(commands[i], i, commands)) {
          i--;
        }
        i++;
      }
    }
    i = 0;
    while (i < commands.length) {
      this.optimizeCommand(commands[i], i, commands);
      i++;
    }
    return commands.optimized = true;
  };

  return DataOptimizer;

})();

window.DataOptimizer = new DataOptimizer();

gs.DataOptimizer = DataOptimizer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7O0VBV2EsdUJBQUE7SUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVO0lBQ1YsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUZMOzs7QUFJYjs7Ozs7Ozs7OzBCQVFBLGtCQUFBLEdBQW9CLFNBQUMsS0FBRDtBQUNoQixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsTUFBQSxHQUFTLEtBQUssQ0FBQyxNQUFOLElBQWdCLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixDQUFrQixDQUFDO0lBQzVDLElBQUcsYUFBSDtNQUNJLElBQUcsMEJBQUg7UUFDSSxNQUFBLEdBQWEsSUFBQSxXQUFBLENBQVksTUFBQSxHQUFTLENBQXJCO1FBQ2IsTUFBQSxHQUFhLElBQUEsVUFBQSxDQUFXLE1BQVgsRUFGakI7T0FBQSxNQUFBO1FBSUksTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNLE1BQU4sRUFKakI7O0FBT0EsV0FBUywrRUFBVDtRQUNJLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxLQUFNLENBQUEsQ0FBQTtBQUR0QixPQVJKOztBQVdBLFdBQU87RUFkUzs7O0FBZ0JwQjs7Ozs7Ozs7OzBCQVFBLGFBQUEsR0FBZSxTQUFDLElBQUQ7QUFHWCxRQUFBO0lBQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNLElBQU47QUFDYixXQUFPO0VBSkk7OztBQU1mOzs7Ozs7Ozs7MEJBUUEsWUFBQSxHQUFjLFNBQUMsSUFBRDtBQUNWLFFBQUE7SUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU0sSUFBTjtBQUNiLFdBQU87RUFGRzs7O0FBS2Q7Ozs7Ozs7Ozs7MEJBU0Esa0JBQUEsR0FBb0IsU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixRQUFqQjtBQUNoQixRQUFBO0lBQUEsSUFBYSxXQUFXLENBQUMsYUFBekI7QUFBQSxhQUFPLE1BQVA7O0lB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QUNWLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFDZCxJQUFHLENBQUMsT0FBTyxDQUFDLE9BQVo7QUFDSSxhQUFNLENBQUEsR0FBSSxRQUFRLENBQUMsTUFBbkI7UUFDSSxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBWixHQUFxQixRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBWixJQUFzQjtRQUMzQyxJQUFHLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixRQUFTLENBQUEsQ0FBQSxDQUE3QixFQUFpQyxDQUFqQyxFQUFvQyxRQUFwQyxDQUFIO1VBQ0ksQ0FBQSxHQURKOztRQUVBLENBQUE7TUFKSixDQURKOztJQU1BLENBQUEsR0FBSTtBQUNKLFdBQU0sQ0FBQSxHQUFJLFFBQVEsQ0FBQyxNQUFuQjtNQUNJLElBQUMsQ0FBQSxlQUFELENBQWlCLFFBQVMsQ0FBQSxDQUFBLENBQTFCLEVBQThCLENBQTlCLEVBQWlDLFFBQWpDO01BQ0EsQ0FBQTtJQUZKO1dBR0EsUUFBUSxDQUFDLFNBQVQsR0FBcUI7RUFoQkY7Ozs7OztBQW1CM0IsTUFBTSxDQUFDLGFBQVAsR0FBMkIsSUFBQSxhQUFBLENBQUE7O0FBQzNCLEVBQUUsQ0FBQyxhQUFILEdBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBEYXRhT3B0aW1pemVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBEYXRhT3B0aW1pemVyXG4gICAgIyMjKlxuICAgICogVGhlIGRhdGEgb3B0aW1pemVyIGlzIHRvIG9wdGltaXplIGRhdGEgc3RydWN0dXJlcyBjb21pbmcgZnJvbSBkYXRhIGZpbGVzIHRvXG4gICAgKiBtYWtlIHByb2Nlc3NpbmcgZmFzdGVyLiBPbmUgd2F5IG9mIG9wdGltaXphdGlvbiBmb3IgZXhhbXBsZSBpcyB0byBjb252ZXJ0XG4gICAgKiByZWd1bGFyIGFycmF5IHRvIHR5cGVkIGFycmF5cy5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgRGF0YU9wdGltaXplclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAc3RhdGljXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgQGxhYmVscyA9IHt9XG4gICAgICAgIEBsYWJlbEp1bXBzID0ge31cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ29udmVydHMgdGhlIHNwZWNpZmllZCBudW1iZXItYXJyYXkgdG8gYSB0eXBlZCBJbnQxNiBhcnJheS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFycmF5VG9OYXRpdmVBcnJheVxuICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgdG8gY29udmVydC5cbiAgICAqIEByZXR1cm4ge0ludDE2QXJyYXl9IFRoZSB0eXBlZCBhcnJheS5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgXG4gICAgYXJyYXlUb05hdGl2ZUFycmF5OiAoYXJyYXkpIC0+XG4gICAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIHx8IE9iamVjdC5rZXlzKGFycmF5KS5sZW5ndGhcbiAgICAgICAgaWYgYXJyYXk/XG4gICAgICAgICAgICBpZiB3aW5kb3cuQXJyYXlCdWZmZXI/XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCAqIDIpXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEludDE2QXJyYXkocmVzdWx0KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShsZW5ndGgpXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgaSBpbiBbMC4uLmxlbmd0aF1cbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBhcnJheVtpXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgXG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIHR5cGVkIEludDE2IGFycmF5IGlmIHN1cHBvcnRlZC4gT3RoZXJ3aXNlIGEgcmVndWxhciBhcnJheSBpcyBjcmVhdGVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgbmF0aXZlQXJyYXkxNlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSBUaGUgc2l6ZSBvZiB0aGUgYXJyYXkgaW4gZWxlbWVudHMuKE5vdCBpbiBieXRlcykuXG4gICAgKiBAcmV0dXJuIHtJbnQxNkFycmF5fSBUaGUgSW50MTYgYXJyYXkuXG4gICAgKiBAc3RhdGljXG4gICAgIyMjIFxuICAgIG5hdGl2ZUFycmF5MTY6IChzaXplKSAtPlxuICAgICAgICAjcmVzdWx0ID0gbmV3IEFycmF5QnVmZmVyKHNpemUgKiAyKVxuICAgICAgICAjcmVzdWx0ID0gbmV3IEludDE2QXJyYXkocmVzdWx0KVxuICAgICAgICByZXN1bHQgPSBuZXcgQXJyYXkoc2l6ZSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgICMjIypcbiAgICAqIENyZWF0ZXMgYSB0eXBlZCBJbnQ4IGFycmF5IGlmIHN1cHBvcnRlZC4gT3RoZXJ3aXNlIGEgcmVndWxhciBhcnJheSBpcyBjcmVhdGVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgbmF0aXZlQXJyYXkxNlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNpemUgLSBUaGUgc2l6ZSBvZiB0aGUgYXJyYXkgaW4gZWxlbWVudHMuKE5vdCBpbiBieXRlcykuXG4gICAgKiBAcmV0dXJuIHtJbnQ4QXJyYXl9IFRoZSBJbnQ4IGFycmF5LlxuICAgICogQHN0YXRpY1xuICAgICMjIyAgICAgXG4gICAgbmF0aXZlQXJyYXk4OiAoc2l6ZSkgLT5cbiAgICAgICAgcmVzdWx0ID0gbmV3IEFycmF5KHNpemUpXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgXG4gICAgIFxuICAgICMjIypcbiAgICAqIFJlbW92ZXMgYSBzaW5nbGUgZW1wdHkgY29tbWFuZCBsaWtlIGEgY29tbWVudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlbW92ZUVtcHR5Q29tbWFuZFxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IGNvbW1hbmRzIC0gQSBsaXN0IG9mIGNvbW1hbmRzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGNvbW1hbmQgLSBUaGUgY29tbWFuZCB0byBvcHRpbWl6ZS5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgXG4gICAgcmVtb3ZlRW1wdHlDb21tYW5kOiAoY29tbWFuZCwgaW5kZXgsIGNvbW1hbmRzKSAtPlxuICAgICAgICByZXR1cm4gbm8gaWYgR2FtZU1hbmFnZXIuaW5MaXZlUHJldmlld1xuICAgICAgICBcbiAgICAgICAgcmVzdWx0ID0gbm9cbiAgICAgICAgc3dpdGNoIGNvbW1hbmRzW2luZGV4XS5pZFxuICAgICAgICAgICAgd2hlbiBcImdzLkNvbW1lbnRcIlxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB5ZXNcbiAgICAgICAgICAgIHdoZW4gXCJncy5FbXB0eUNvbW1hbmRcIlxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB5ZXNcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGVja3MgaWYgYSBjb21tb24gZXZlbnQgY2FsbCBjYW4gYmUgb3B0aW1pemVkIGJ5IGlubGluZSBpdC4gSW4gc3BlY2lhbCBjYXNlcyxcbiAgICAqIHN1Y2ggYXMgcmVjdXJzaW9uIG9yIHBhcmFtZXRlcnMsIGFuIG9wdGltaXphdGlvbiBpcyBubyBwb3NzaWJsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9wdGltaXplQ29tbW9uRXZlbnRDYWxsXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY29tbWFuZHMgLSBBIGxpc3Qgb2YgY29tbWFuZHMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY29tbWFuZCBpbiBjb21tYW5kLWxpc3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gY29tbWFuZCAtIFRoZSBjb21tYW5kIHRvIG9wdGltaXplLlxuICAgICogQHJldHVybiBJZiA8Yj50cnVlPC9iPiB0aGUgY2FsbCBjYW4gYmUgc2FmbHkgaW5saW5lLiBPdGhlcndpc2UgPGI+ZmFsc2U8L2I+XG4gICAgKiBAc3RhdGljXG4gICAgIyMjICAgIFxuICAgIGNhbklubGluZUNvbW1vbkV2ZW50Q2FsbDogKGNvbW1hbmQsIGluZGV4LCBjb21tYW5kcywgY2FsbFN0YWNrKSAtPlxuICAgICAgICByZXN1bHQgPSAhKGNvbW1hbmQucGFyYW1zLmNvbW1vbkV2ZW50SWQuaW5kZXg/KVxuICAgICAgICBjb21tb25FdmVudCA9IFJlY29yZE1hbmFnZXIuY29tbW9uRXZlbnRzW2NvbW1hbmQucGFyYW1zLmNvbW1vbkV2ZW50SWRdXG4gICAgICAgIGlmIGNvbW1vbkV2ZW50Py5pbmxpbmVcbiAgICAgICAgICAgIGlmIGNhbGxTdGFjay5pbmRleE9mKGNvbW1vbkV2ZW50KSAhPSAtMVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2FsbFN0YWNrLnB1c2goY29tbW9uRXZlbnQpXG4gICAgICAgICAgICAgICAgZm9yIGMsIGkgaW4gY29tbW9uRXZlbnQuY29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgaWYgYy5pZCA9PSBcImdzLkNhbGxDb21tb25FdmVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBAY2FuSW5saW5lQ29tbW9uRXZlbnRDYWxsKGMsIGksIGNvbW1vbkV2ZW50LmNvbW1hbmRzLCBjYWxsU3RhY2spXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBPcHRpbWl6ZXMgYSBjb21tb24gZXZlbnQgY2FsbC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG9wdGltaXplQ29tbW9uRXZlbnRDYWxsXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY29tbWFuZHMgLSBBIGxpc3Qgb2YgY29tbWFuZHMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgY29tbWFuZCBpbiBjb21tYW5kLWxpc3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gY29tbWFuZCAtIFRoZSBjb21tYW5kIHRvIG9wdGltaXplLlxuICAgICogQHN0YXRpY1xuICAgICMjIyBcbiAgICBvcHRpbWl6ZUNvbW1vbkV2ZW50Q2FsbDogKGNvbW1hbmQsIGluZGV4LCBjb21tYW5kcykgLT5cbiAgICAgICAgY29tbW9uRXZlbnQgPSBSZWNvcmRNYW5hZ2VyLmNvbW1vbkV2ZW50c1tjb21tYW5kLnBhcmFtcy5jb21tb25FdmVudElkXVxuICAgICAgICBpZiBjb21tb25FdmVudD8uaW5saW5lXG4gICAgICAgICAgICBpZiBAY2FuSW5saW5lQ29tbW9uRXZlbnRDYWxsKGNvbW1hbmQsIGluZGV4LCBjb21tYW5kcywgW10pXG4gICAgICAgICAgICAgICAgY29tbWFuZHMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzLnNwbGljZS5hcHBseShjb21tYW5kcywgW2luZGV4LCAwXS5jb25jYXQoT2JqZWN0LmNvcHkoY29tbW9uRXZlbnQuY29tbWFuZHMpKSlcbiAgICBcbiAgICAjIyMqXG4gICAgKiBPcHRpbWl6ZXMgdGhlIHZhcmlhYmxlLWFjY2VzcyBieSByZXBsYWNpbmcgdGhlIGRvbWFpbi1zdHJpbmcgd2l0aCB0aGUgZG9tYWluLWluZGV4XG4gICAgKiB2YWx1ZSBhdCBydW50aW1lIHRvIGFsbG93IGZhc3RlciBkb21haW4gYWNjZXNzIHVzaW5nIGludGVnZXIgbnVtYmVycyBpbnN0ZWFkIG9mIHN0cmluZ3MuXG4gICAgKlxuICAgICogQG1ldGhvZCBvcHRpbWl6ZVZhcmlhYmxlQWNjZXNzXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIHRvIG9waW1pemUsIGUuZy4gdGhlIHBhcmFtcy1vYmplY3Qgb2YgYSBjb21tYW5kLlxuICAgICogQHN0YXRpY1xuICAgICMjIyAgICAgICAgICAgICBcbiAgICBvcHRpbWl6ZVZhcmlhYmxlQWNjZXNzOiAoZGF0YSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIGRhdGE/Ll9fb3B0aW1pemVkXG4gICAgICAgIGRhdGE/Ll9fb3B0aW1pemVkID0geWVzIFxuICAgICAgICBmb3IgcCBvZiBkYXRhXG4gICAgICAgICAgICBpZiBkYXRhW3BdIGluc3RhbmNlb2YgQXJyYXkgYW5kICFkYXRhW3BdLl9fb3B0aW1pemVkXG4gICAgICAgICAgICAgICAgZGF0YVtwXS5fX29wdGltaXplZCA9IHllc1xuICAgICAgICAgICAgICAgIGZvciBlIGluIGRhdGFbcF1cbiAgICAgICAgICAgICAgICAgICAgQG9wdGltaXplVmFyaWFibGVBY2Nlc3MoZSlcbiAgICAgICAgICAgIGVsc2UgaWYgcCA9PSBcImRvbWFpblwiIGFuZCBkYXRhLnNjb3BlID4gMCBhbmQgZGF0YS5pbmRleD9cbiAgICAgICAgICAgICAgICBkb21haW5JbmRleCA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuZG9tYWlucy5pbmRleE9mKGRhdGFbcF0pXG4gICAgICAgICAgICAgICAgZGF0YVtwXSA9IGlmIGRvbWFpbkluZGV4ID09IC0xIHRoZW4gZGF0YVtwXSBlbHNlIGRvbWFpbkluZGV4XG4gICAgICAgICAgICBlbHNlIGlmIHR5cGVvZiBkYXRhW3BdID09IFwib2JqZWN0XCIgYW5kICEoZGF0YVtwXSBpbnN0YW5jZW9mIFN0cmluZyB8fCBkYXRhW3BdIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICAgICAgQG9wdGltaXplVmFyaWFibGVBY2Nlc3MoZGF0YVtwXSkgaWYgbm90IGRhdGFbcF0/Ll9fb3B0aW1pemVkXG4gICAgICAgICAgICAgICAgZGF0YVtwXT8uX19vcHRpbWl6ZWQgPSB5ZXNcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogT3B0aW1pemVzIGEgc2luZ2xlIGNvbW1hbmQuXG4gICAgKlxuICAgICogQG1ldGhvZCBvcHRpbWl6ZUNvbW1hbmRcbiAgICAqIEBwcml2YXRlXG4gICAgKiBAcGFyYW0ge09iamVjdFtdfSBjb21tYW5kcyAtIEEgbGlzdCBvZiBjb21tYW5kcy5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBjb21tYW5kIGluIGNvbW1hbmQtbGlzdC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21tYW5kIC0gVGhlIGNvbW1hbmQgdG8gb3B0aW1pemUuXG4gICAgKiBAc3RhdGljXG4gICAgIyMjICAgICBcbiAgICBvcHRpbWl6ZUNvbW1hbmQ6IChjb21tYW5kLCBpbmRleCwgY29tbWFuZHMpIC0+XG4gICAgICAgIEBvcHRpbWl6ZVZhcmlhYmxlQWNjZXNzKGNvbW1hbmQucGFyYW1zKVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIGNvbW1hbmQuaWRcbiAgICAgICAgICAgIHdoZW4gXCJncy5DYWxsQ29tbW9uRXZlbnRcIlxuICAgICAgICAgICAgICAgIEBvcHRpbWl6ZUNvbW1vbkV2ZW50Q2FsbChjb21tYW5kLCBpbmRleCwgY29tbWFuZHMpXG4gICAgICAgICAgICB3aGVuIFwiZ3MuTGFiZWxcIlxuICAgICAgICAgICAgICAgIEBsYWJlbHNbY29tbWFuZC5wYXJhbXMubmFtZV0gPSBpbmRleFxuICAgICAgICAgICAgICAgIEBsYWJlbEp1bXBzW2NvbW1hbmQucGFyYW1zLm5hbWVdPy5mb3JFYWNoIChjKSAtPiBjLnBhcmFtcy5sYWJlbEluZGV4ID0gaW5kZXhcbiAgICAgICAgICAgIHdoZW4gXCJ2bi5DaG9pY2VcIlxuICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1zLmFjdGlvbi5sYWJlbEluZGV4ID0gQGxhYmVsc1tjb21tYW5kLnBhcmFtcy5hY3Rpb24ubGFiZWxdXG4gICAgICAgICAgICAgICAgaWYgIUBsYWJlbEp1bXBzW2NvbW1hbmQucGFyYW1zLmFjdGlvbi5sYWJlbF1cbiAgICAgICAgICAgICAgICAgICAgQGxhYmVsSnVtcHNbY29tbWFuZC5wYXJhbXMuYWN0aW9uLmxhYmVsXSA9IFtdXG4gICAgICAgICAgICAgICAgQGxhYmVsSnVtcHNbY29tbWFuZC5wYXJhbXMuYWN0aW9uLmxhYmVsXS5wdXNoKGNvbW1hbmQpXG4gICAgICAgICAgICB3aGVuIFwiZ3MuQ2hlY2tTd2l0Y2hcIiwgXCJncy5DaGVja051bWJlclZhcmlhYmxlXCIsIFwiZ3MuQ2hlY2tUZXh0VmFyaWFibGVcIlxuICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1zLmxhYmVsSW5kZXggPSBAbGFiZWxzW2NvbW1hbmQucGFyYW1zLmxhYmVsXVxuICAgICAgICAgICAgICAgIGlmICFAbGFiZWxKdW1wc1tjb21tYW5kLnBhcmFtcy5sYWJlbF1cbiAgICAgICAgICAgICAgICAgICAgQGxhYmVsSnVtcHNbY29tbWFuZC5wYXJhbXMubGFiZWxdID0gW11cbiAgICAgICAgICAgICAgICBAbGFiZWxKdW1wc1tjb21tYW5kLnBhcmFtcy5sYWJlbF0ucHVzaChjb21tYW5kKVxuICAgICAgICAgICAgI3doZW4gXCJncy5BZGRIb3RzcG90XCJcbiAgICAgICAgICAgICMgICAgY29tbWFuZC5wYXJhbXMuYWN0aW9ucy5vbkNsaWNrXG4gICAgICAgICAgICB3aGVuIFwiZ3MuSnVtcFRvTGFiZWxcIlxuICAgICAgICAgICAgICAgIGNvbW1hbmQucGFyYW1zLmxhYmVsSW5kZXggPSBAbGFiZWxzW2NvbW1hbmQucGFyYW1zLm5hbWVdXG4gICAgICAgICAgICAgICAgaWYgIUBsYWJlbEp1bXBzW2NvbW1hbmQucGFyYW1zLm5hbWVdXG4gICAgICAgICAgICAgICAgICAgIEBsYWJlbEp1bXBzW2NvbW1hbmQucGFyYW1zLm5hbWVdID0gW11cbiAgICAgICAgICAgICAgICBAbGFiZWxKdW1wc1tjb21tYW5kLnBhcmFtcy5uYW1lXS5wdXNoKGNvbW1hbmQpXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIE9wdGltaXplcyBhIGxpc3Qgb2YgZXZlbnQvc2NlbmUgY29tbWFuZHMgYnkgcmVtb3ZpbmcgdW5uZWNlc3NhcnkgY29tbWFuZHMgbGlrZVxuICAgICogY29tbWVudHMgb3IgZW1wdHkgY29tbWFuZHMuIEl0IGFsc28gb3B0aW1pemVzIGxhYmVsIGp1bXBzLiBBZGRzIGFuIDxiPm9wdGltaXplZDwvYj4gdG9cbiAgICAqIHRoZSBzcGVjaWZpZWQgY29tbWFuZC1saXN0IHRvIGluZGljYXRlIHRoYXQgdGhlIGxpc3Qgd2FzIGFscmVhZHkgb3B0aW1pemVkLiBJZiA8Yj5vcHRpbWl6ZWQ8L2I+XG4gICAgKiBwcm9wZXJ0eSBvZiBjb21tYW5kLWxpc3QgaXMgc2V0IHRvIDxiPnRydWU8L2I+IHRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIGltbWVkaWF0ZWx5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgb3B0aW1pemVFdmVudENvbW1hbmRzXG4gICAgKiBAcGFyYW0ge09iamVjdFtdfSBjb21tYW5kcyAtIEEgbGlzdCBvZiBjb21tYW5kcyB0byBvcHRpbWl6ZS5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgICAgICAgXG4gICAgb3B0aW1pemVFdmVudENvbW1hbmRzOiAoY29tbWFuZHMpIC0+XG4gICAgICAgIHJldHVybiBpZiBjb21tYW5kcy5vcHRpbWl6ZWRcblxuICAgICAgICBpID0gMFxuICAgICAgICBAbGFiZWxzID0ge31cbiAgICAgICAgQGxhYmVsSnVtcHMgPSB7fVxuICAgICAgICBpZiAhJFBBUkFNUy5wcmV2aWV3XG4gICAgICAgICAgICB3aGlsZSBpIDwgY29tbWFuZHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgY29tbWFuZHNbaV0uaW5kZW50ID0gY29tbWFuZHNbaV0uaW5kZW50IHx8IDBcbiAgICAgICAgICAgICAgICBpZiBAcmVtb3ZlRW1wdHlDb21tYW5kKGNvbW1hbmRzW2ldLCBpLCBjb21tYW5kcylcbiAgICAgICAgICAgICAgICAgICAgaS0tXG4gICAgICAgICAgICAgICAgaSsrXG4gICAgICAgIGkgPSAwXG4gICAgICAgIHdoaWxlIGkgPCBjb21tYW5kcy5sZW5ndGhcbiAgICAgICAgICAgIEBvcHRpbWl6ZUNvbW1hbmQoY29tbWFuZHNbaV0sIGksIGNvbW1hbmRzKVxuICAgICAgICAgICAgaSsrXG4gICAgICAgIGNvbW1hbmRzLm9wdGltaXplZCA9IHllc1xuICAgICAgICBcbiAgICAgICAgXG53aW5kb3cuRGF0YU9wdGltaXplciA9IG5ldyBEYXRhT3B0aW1pemVyKClcbmdzLkRhdGFPcHRpbWl6ZXIgPSBEYXRhT3B0aW1pemVyIl19
//# sourceURL=DataOptimizer_1.js