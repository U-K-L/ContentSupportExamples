var VariableStore;

VariableStore = (function() {
  VariableStore.objectCodecBlackList = ["persistentNumbers", "persistentStrings", "persistentBooleans", "persistentLists"];


  /**
  * <p>A storage for different kind of game variables. The following scopes
  * for variables exist:</p>
  * 
  * - Local Variables -> Only valid for the current scene.
  * - Global Variables -> Valid for the whole game but bound to a single save-game.
  * - Persistent Variables -> Valid for the whole game indepentent from the save-games.
  * 
  * <p>The following data-types exist:</p>
  * - Strings -> Variables storing text data.
  * - Numbers -> Variables storing integer number values.
  * - Booleans -> Variables storing boolean values. (Called "Switches" for easier understanding)
  * - Lists -> Variables storing multiple other variables. Lists can also contain Lists.
  * <p>
  * Local variables are stored by scene UID. For each scene UID a list of local variables is stored.</p>
  * 
  * <p>Global and persistent variables are stored and a specific domain. A domain is just a unique name such
  * as <i>com.example.game</i> for example. The default domain is an empty string. Domains are useful to avoid
  * overlapping of variable numbers when sharing content with other users. </p>
  *
  * @module gs
  * @class VariableStore
  * @memberof gs
  * @constructor
   */

  function VariableStore() {

    /**
    * Current local variable context
    * @property context
    * @type Object
     */
    this.context = null;

    /**
    * Current domain for global and persistent variables. Each domain has its own
    * variables. Please use <b>changeDomain</b> method to change the domain.
    * @property domain
    * @type Object
    * @readOnly
     */
    this.domain = "";

    /**
    * List of available domains for global and persistent variables.
    * @property domains
    * @type string[]
     */
    this.domains = [""];

    /**
    * The global number variables of the current domain.
    * @property numbers
    * @type number[]
     */
    this.numbers = null;

    /**
    * The global boolean variables of the current domain.
    * @property booleans
    * @type boolean[]
     */
    this.booleans = null;

    /**
    * The global string variables of the current domain.
    * @property strings
    * @type string[]
     */
    this.strings = null;

    /**
    * The global list variables of the current domain.
    * @property lists
    * @type Object[][]
     */
    this.lists = null;

    /**
    * The storage of all global variables by domain.
    * @property globalVariablesByDomain
    * @type Object[][]
     */
    this.globalVariablesByDomain = {};

    /**
    * The storage of all persistent variables by domain.
    * @property persistentVariablesByDomain
    * @type Object[][]
     */
    this.persistentVariablesByDomain = {};

    /**
    * The persistent number variables of the current domain.
    * @property persistentNumbers
    * @type number[]
     */
    this.persistentNumbers = [];

    /**
    * The persistent string variables of the current domain.
    * @property persistentStrings
    * @type string[]
     */
    this.persistentStrings = [];

    /**
    * The persistent boolean variables of the current domain.
    * @property persistentBooleans
    * @type boolean[]
     */
    this.persistentBooleans = [];

    /**
    * The persistent list variables of the current domain.
    * @property persistentLists
    * @type Object[][]
     */
    this.persistentLists = [];

    /**
    * The local number variables.
    * @property localNumbers
    * @type Object
     */
    this.localNumbers = {};

    /**
    * The local string variables.
    * @property localStrings
    * @type Object
     */
    this.localStrings = {};

    /**
    * The local boolean variables.
    * @property localBooleans
    * @type Object
     */
    this.localBooleans = {};

    /**
    * The local list variables.
    * @property localLists
    * @type Object
     */
    this.localLists = {};

    /**
    * @property tempNumbers
    * @type number[]
     */
    this.tempNumbers = null;

    /**
    * @property tempStrings
    * @type string[]
     */
    this.tempStrings = null;

    /**
    * @property localBooleans
    * @type number[]
     */
    this.tempBooleans = null;

    /**
    * @property localLists
    * @type Object[][]
     */
    this.tempLists = null;
  }


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  * 
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  VariableStore.prototype.onDataBundleRestore = function(data, context) {
    var domain, domains, i, j, len;
    domains = DataManager.getDocumentsByType("global_variables").select(function(d) {
      return d.items.domain;
    });
    for (i = j = 0, len = domains.length; j < len; i = ++j) {
      domain = domains[i];
      this.numbersByDomain[domain] = this.numbersByDomain[i];
      this.stringsByDomain[domain] = this.stringsByDomain[i];
      this.booleansByDomain[domain] = this.booleansByDomain[i];
      this.listsByDomain[domain] = this.listsByDomain[i];
    }
    return null;
  };

  VariableStore.prototype.setupDomains = function(domains) {
    var domain, i, j, len, ref;
    this.numbersByDomain = [];
    this.stringsByDomain = [];
    this.booleansByDomain = [];
    this.listsByDomain = [];
    this.domains = domains;
    ref = this.domains;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      domain = ref[i];
      this.numbersByDomain[i] = new Array(1000);
      this.numbersByDomain[domain] = this.numbersByDomain[i];
      this.stringsByDomain[i] = new Array(1000);
      this.stringsByDomain[domain] = this.stringsByDomain[i];
      this.booleansByDomain[i] = new Array(1000);
      this.booleansByDomain[domain] = this.booleansByDomain[i];
      this.listsByDomain[i] = new Array(1000);
      this.listsByDomain[domain] = this.listsByDomain[i];
      this.persistentNumbers[i] = new Array(10);
      this.persistentNumbers[domain] = this.persistentNumbers[i];
      this.persistentStrings[i] = new Array(10);
      this.persistentStrings[domain] = this.persistentStrings[i];
      this.persistentBooleans[i] = new Array(10);
      this.persistentBooleans[domain] = this.persistentBooleans[i];
      this.persistentLists[i] = new Array(10);
      this.persistentLists[domain] = this.persistentLists[i];
    }
    this.numbers = this.numbersByDomain[0];
    this.strings = this.stringsByDomain[0];
    this.booleans = this.booleansByDomain[0];
    return this.lists = this.numbersByDomain[0];
  };


  /**
  * Changes the current domain.
  *
  * @method changeDomain
  * @param {string} domain - The domain to change to.
   */

  VariableStore.prototype.changeDomain = function(domain) {
    var globalVariables, persistentVariables;
    this.domain = domain;
    globalVariables = this.globalVariablesByDomain[domain];
    persistentVariables = this.persistentVariablesByDomain[domain];
    if (!globalVariables) {
      globalVariables = this.globalVariablesByDomain[domain] = {
        numbers: new Array(500),
        strings: new Array(500),
        booleans: new Array(500),
        lists: new Array(500)
      };
    }
    if (!persistentVariables) {
      persistentVariables = this.persistentVariablesByDomain[domain] = {
        numbers: new Array(500),
        strings: new Array(500),
        booleans: new Array(500),
        lists: new Array(500)
      };
    }
    this.numbers = globalVariables.numbers;
    this.strings = globalVariables.strings;
    this.booleans = globalVariables.booleans;
    this.lists = globalVariables.lists;
    this.persistentNumbers = persistentVariables.numbers;
    this.persistentBooleans = persistentVariables.booleans;
    this.persistentStrings = persistentVariables.strings;
    return this.persistentLists = persistentVariables.lists;
  };


  /**
  * Clears all global variables
  *
  * @method clearGlobalVariables
   */

  VariableStore.prototype.clearAllGlobalVariables = function() {
    var globalVariables;
    this.setupDomains(this.domains);
    return;
    globalVariables = this.globalVariablesByDomain[this.domain];
    this.numbersByDomain = new Array(1000);
    globalVariables.booleans = new Array(1000);
    globalVariables.strings = new Array(1000);
    this.numbers = globalVariables.numbers;
    this.strings = globalVariables.strings;
    return this.booleans = globalVariables.booleans;
  };


  /**
  * Clears all local variables for all contexts/scenes/common-events.
  *
  * @method clearAllLocalVariables
   */

  VariableStore.prototype.clearAllLocalVariables = function() {
    this.localNumbers = {};
    this.localStrings = {};
    this.localBooleans = {};
    return this.localLists = {};
  };


  /**
  * Clears specified variables.
  *
  * @method clearVariables
  * @param {number[]} numbers - The number variables to clear.
  * @param {string[]} strings - The string variables to clear.
  * @param {boolean[]} booleans - The boolean variables to clear.
  * @param {Array[]} lists - The list variables to clear.
  * @param {number} type - Determines what kind of variables should be cleared.
  * <ul>
  * <li>0 = All</li>
  * <li>1 = Switches / Booleans</li>
  * <li>2 = Numbers</li>
  * <li>3 = Texts</li>
  * <li>4 = Lists</li>
  * </ul>
  * @param {Object} range - The variable id-range to clear. If <b>null</b> all specified variables are cleared.
   */

  VariableStore.prototype.clearVariables = function(numbers, strings, booleans, lists, type, range) {
    switch (type) {
      case 0:
        if (numbers != null) {
          numbers.fill(0, range.start, range.end);
        }
        if (strings != null) {
          strings.fill("", range.start, range.end);
        }
        if (booleans != null) {
          booleans.fill(false, range.start, range.end);
        }
        return lists != null ? lists.fill([], range.start, range.end) : void 0;
      case 1:
        return booleans != null ? booleans.fill(false, range.start, range.end) : void 0;
      case 2:
        return numbers != null ? numbers.fill(0, range.start, range.end) : void 0;
      case 3:
        return strings != null ? strings.fill("", range.start, range.end) : void 0;
      case 4:
        return lists != null ? lists.fill([], range.start, range.end) : void 0;
    }
  };


  /**
  * Clears all local variables for a specified context. If the context is not specified, all
  * local variables for all contexts/scenes/common-events are cleared.
  *
  * @method clearLocalVariables
  * @param {Object} context - The context to clear the local variables for. If <b>null</b>, all
  * @param {number} type - Determines what kind of variables should be cleared.
  * <ul>
  * <li>0 = All</li>
  * <li>1 = Switches / Booleans</li>
  * <li>2 = Numbers</li>
  * <li>3 = Texts</li>
  * <li>4 = Lists</li>
  * </ul>
  * @param {Object} range - The variable id-range to clear. If <b>null</b> all variables are cleared.
   */

  VariableStore.prototype.clearLocalVariables = function(context, type, range) {
    var id, ids, j, len, results;
    if (context != null) {
      ids = [context.id];
    } else {
      ids = Object.keys(this.localNumbers);
    }
    if (range != null) {
      range = {
        start: range.start,
        end: range.end + 1
      };
    } else {
      range = {
        start: 0,
        end: null
      };
    }
    results = [];
    for (j = 0, len = ids.length; j < len; j++) {
      id = ids[j];
      results.push(this.clearVariables(this.localNumbers[id], this.localStrings[id], this.localBooleans[id], this.localLists[id], type, range));
    }
    return results;
  };


  /**
  * Clears global variables.
  *
  * @method clearGlobalVariables
  * @param {number} type - Determines what kind of variables should be cleared.
  * <ul>
  * <li>0 = All</li>
  * <li>1 = Switches / Booleans</li>
  * <li>2 = Numbers</li>
  * <li>3 = Texts</li>
  * <li>4 = Lists</li>
  * </ul>
  * @param {Object} range - The variable id-range to clear. If <b>null</b> all variables are cleared.
   */

  VariableStore.prototype.clearGlobalVariables = function(type, range) {
    if (range != null) {
      range = {
        start: range.start,
        end: range.end + 1
      };
    } else {
      range = {
        start: 0,
        end: null
      };
    }
    return this.clearVariables(this.numbers, this.strings, this.booleans, this.lists, type, range);
  };


  /**
  * Clears persistent variables.
  *
  * @method clearPersistentVariables
  * @param {number} type - Determines what kind of variables should be cleared.
  * <ul>
  * <li>0 = All</li>
  * <li>1 = Switches / Booleans</li>
  * <li>2 = Numbers</li>
  * <li>3 = Texts</li>
  * <li>4 = Lists</li>
  * </ul>
  * @param {Object} range - The variable id-range to clear. If <b>null</b> all variables are cleared.
   */

  VariableStore.prototype.clearPersistentVariables = function(type, range) {
    if (range != null) {
      range = {
        start: range.start,
        end: range.end + 1
      };
    } else {
      range = {
        start: 0,
        end: null
      };
    }
    return this.clearVariables(this.persistentNumbers, this.persistentstrings, this.persistentBooleans, this.persistentLists, type, range);
  };


  /**
  * Initializes the variables. Should be called whenever the context changes. (Like after a scene change)
  *
  * @method setup
  * @param {Object} context - The context(current scene) needed for local variables. Needs have at least an id-property.
   */

  VariableStore.prototype.setup = function(context) {
    this.setupLocalVariables(context);
    return this.setupTempVariables(context);
  };


  /**
  * Initializes the local variables for the specified context. Should be called on first time use.
  *
  * @method setupLocalVariables
  * @param {Object} context - The context(current scene). Needs have at least an id-property.
   */

  VariableStore.prototype.setupLocalVariables = function(context) {
    this.setupVariables(context, "localNumbers", 0);
    this.setupVariables(context, "localStrings", "");
    this.setupVariables(context, "localBooleans", false);
    return this.setupVariables(context, "localLists", []);
  };


  /**
  * Initializes the specified kind of variables.
  *
  * @method setupVariables                                       
  * @param {Object} context - The context(current scene). Needs have at least an id-property.
  * @param {string} property - The kind of variables (property-name).
  * @param {Object} defaultValue - The default value for each variable.
   */

  VariableStore.prototype.setupVariables = function(context, property, defaultValue) {
    if (this[property][context.id] == null) {
      return this[property][context.id] = [];
    }
  };


  /**
  * Initializes the current temp variables for the specified context. Should be called whenever the context changed.
  *
  * @method setupTempVariables
  * @param {Object} context - The context(current scene). Needs have at least an id-property.
   */

  VariableStore.prototype.setupTempVariables = function(context) {
    this.context = context;
    if (!this.localNumbers[context.id]) {
      this.setupLocalVariables(context);
    }
    this.tempNumbers = this.localNumbers[context.id];
    this.tempStrings = this.localStrings[context.id];
    this.tempBooleans = this.localBooleans[context.id];
    return this.tempLists = this.localLists[context.id];
  };

  VariableStore.prototype.clearTempVariables = function(context) {};


  /**
  * Sets the value of the number variable at the specified index.
  *
  * @method setNumberValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @param {number} value - The value to set.
   */

  VariableStore.prototype.setNumberValueAtIndex = function(scope, index, value, domain) {
    if (scope === 2) {
      return this.persistentNumbers[domain][index] = value;
    } else if (scope === 1) {
      return this.numbersByDomain[domain || 0][index] = value;
    } else {
      return this.tempNumbers[index] = value;
    }
  };


  /**
  * Sets the value of a specified number variable.
  *
  * @method setNumberValueAtIndex
  * @param {number} variable - The variable to set. 
  * @param {number} value - The value to set.
   */

  VariableStore.prototype.setNumberValueTo = function(variable, value) {
    if (variable.scope === 2) {
      return this.persistentNumbers[variable.domain || 0][variable.index] = value;
    } else if (variable.scope === 1) {
      return this.numbersByDomain[variable.domain || 0][variable.index] = value;
    } else {
      return this.tempNumbers[variable.index] = value;
    }
  };


  /**
  * Sets the value of a specified list variable.
  *
  * @method setListObjectTo
  * @param {Object} variable - The variable to set. 
  * @param {Object} value - The value to set.
   */

  VariableStore.prototype.setListObjectTo = function(variable, value) {
    if (variable.scope === 2) {
      return this.persistentLists[variable.domain || 0][variable.index] = value;
    } else if (variable.scope === 1) {
      return this.listsByDomain[variable.domain || 0][variable.index] = value;
    } else {
      return this.tempLists[variable.index] = value;
    }
  };


  /**
  * Sets the value of a specified boolean variable.
  *
  * @method setBooleanValueTo
  * @param {Object} variable - The variable to set. 
  * @param {boolean} value - The value to set.
   */

  VariableStore.prototype.setBooleanValueTo = function(variable, value) {
    if (variable.scope === 2) {
      return this.persistentBooleans[variable.domain][variable.index] = value;
    } else if (variable.scope === 1) {
      return this.booleansByDomain[variable.domain][variable.index] = value;
    } else {
      return this.tempBooleans[variable.index] = value;
    }
  };


  /**
  * Sets the value of the boolean variable at the specified index.
  *
  * @method setBooleanValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @param {boolean} value - The value to set.
   */

  VariableStore.prototype.setBooleanValueAtIndex = function(scope, index, value, domain) {
    if (scope === 2) {
      return this.persistentBooleans[domain][index] = value;
    } else if (scope === 1) {
      return this.booleansByDomain[domain][index] = value;
    } else {
      return this.tempBooleans[index] = value;
    }
  };


  /**
  * Sets the value of a specified string variable.
  *
  * @method setStringValueTo
  * @param {Object} variable - The variable to set. 
  * @param {string} value - The value to set.
   */

  VariableStore.prototype.setStringValueTo = function(variable, value) {
    if (variable.scope === 2) {
      return this.persistentStrings[variable.domain][variable.index] = value;
    } else if (variable.scope === 1) {
      return this.stringsByDomain[variable.domain][variable.index] = value;
    } else {
      return this.tempStrings[variable.index] = value;
    }
  };


  /**
  * Sets the value of the string variable at the specified index.
  *
  * @method setStringValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @param {string} value - The value to set.
   */

  VariableStore.prototype.setStringValueAtIndex = function(scope, index, value, domain) {
    if (scope === 2) {
      return this.persistentStrings[domain][index] = value;
    } else if (scope === 1) {
      return this.stringsByDomain[domain][index] = value;
    } else {
      return this.tempStrings[index] = value;
    }
  };


  /**
  * Gets the value of a specified list variable.
  *
  * @method listObjectOf
  * @param {Object} object - The list-variable/object to get the value from.
  * @return {Object} The list-object.
   */

  VariableStore.prototype.listObjectOf = function(object) {
    var result;
    result = 0;
    if ((object != null) && (object.index != null)) {
      if (object.scope === 2) {
        result = this.persistentLists[object.domain][object.index];
      } else if (object.scope === 1) {
        result = this.listsByDomain[object.domain][object.index];
      } else {
        result = this.tempLists[object.index];
      }
    } else {
      result = object;
    }
    return result || [];
  };


  /**
  * Gets the value of a number variable at the specified index.
  *
  * @method numberValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @return {Object} The number value of the variable.
   */

  VariableStore.prototype.numberValueAtIndex = function(scope, index, domain) {
    var result;
    result = 0;
    if (scope === 2) {
      result = this.persistentNumbers[domain][index];
    } else if (scope === 1) {
      result = this.numbersByDomain[domain][index];
    } else {
      result = this.tempNumbers[index];
    }
    return result;
  };


  /**
  * Gets the value of a specified number variable.
  *
  * @method numberValueOf
  * @param {Object} object - The variable to get the value from.
  * @return {Object} The number value of the variable.
   */

  VariableStore.prototype.numberValueOf = function(object) {
    var result;
    result = 0;
    if ((object != null) && (object.index != null)) {
      if (object.scope === 2) {
        result = this.persistentNumbers[object.domain][object.index];
      } else if (object.scope === 1) {
        result = this.numbersByDomain[object.domain][object.index];
      } else {
        result = this.tempNumbers[object.index];
      }
    } else {
      result = object;
    }
    return result || 0;
  };


  /**
  * Gets the value of a specified string variable.
  *
  * @method stringValueOf
  * @param {Object} object - The variable to get the value from.
  * @return {string} The string value of the variable.
   */

  VariableStore.prototype.stringValueOf = function(object) {
    var result;
    result = "";
    if ((object != null) && (object.index != null)) {
      if (object.scope === 2) {
        result = this.persistentStrings[object.domain][object.index];
      } else if (object.scope === 1) {
        result = this.stringsByDomain[object.domain][object.index];
      } else {
        result = this.tempStrings[object.index];
      }
    } else {
      result = object;
    }
    return result || "";
  };


  /**
  * Gets the value of a string variable at the specified index.
  *
  * @method stringValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @return {string} The string value of the variable.
   */

  VariableStore.prototype.stringValueAtIndex = function(scope, index, domain) {
    var result;
    result = "";
    if (scope === 2) {
      result = this.persistentStrings[domain][index];
    } else if (scope === 1) {
      result = this.stringsByDomain[domain][index];
    } else {
      result = this.tempStrings[index];
    }
    return result || "";
  };


  /**
  * Gets the value of a specified boolean variable.
  *
  * @method booleanValueOf
  * @param {Object} object - The variable to get the value from.
  * @return {Object} The boolean value of the variable.
   */

  VariableStore.prototype.booleanValueOf = function(object) {
    var result;
    result = false;
    if ((object != null) && (object.index != null)) {
      if (object.scope === 2) {
        result = this.persistentBooleans[object.domain][object.index] || false;
      } else if (object.scope === 1) {
        result = this.booleansByDomain[object.domain][object.index] || false;
      } else {
        result = this.tempBooleans[object.index] || false;
      }
    } else {
      result = object ? true : false;
    }
    return result;
  };


  /**
  * Gets the value of a boolean variable at the specified index.
  *
  * @method booleanValueAtIndex
  * @param {number} scope - The variable scope.
  * @param {number} index - The variable's index.
  * @return {boolean} The boolean value of the variable.
   */

  VariableStore.prototype.booleanValueAtIndex = function(scope, index, domain) {
    var result;
    result = false;
    if (scope === 2) {
      result = this.persistenBooleans[domain][index] || false;
    } else if (scope === 1) {
      result = this.booleansByDomain[domain][index] || false;
    } else {
      result = this.tempBooleans[index] || false;
    }
    return result;
  };

  return VariableStore;

})();

gs.VariableStore = VariableStore;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07RUFDRixhQUFDLENBQUEsb0JBQUQsR0FBd0IsQ0FBQyxtQkFBRCxFQUFzQixtQkFBdEIsRUFBMkMsb0JBQTNDLEVBQWlFLGlCQUFqRTs7O0FBRXhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXlCYSx1QkFBQTs7QUFDVDs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXOztBQUVYOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLENBQUMsRUFBRDs7QUFFWDs7Ozs7SUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXOztBQUNYOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBQ1o7Ozs7O0lBS0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFDWDs7Ozs7SUFLQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7OztJQUtBLElBQUMsQ0FBQSx1QkFBRCxHQUEyQjs7QUFFM0I7Ozs7O0lBS0EsSUFBQyxDQUFBLDJCQUFELEdBQStCOztBQUUvQjs7Ozs7SUFLQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7O0FBQ3JCOzs7OztJQUtBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjs7QUFDckI7Ozs7O0lBS0EsSUFBQyxDQUFBLGtCQUFELEdBQXNCOztBQUN0Qjs7Ozs7SUFLQSxJQUFDLENBQUEsZUFBRCxHQUFtQjs7QUFDbkI7Ozs7O0lBS0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7O0FBQ2hCOzs7OztJQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCOztBQUNoQjs7Ozs7SUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQjs7QUFDakI7Ozs7O0lBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYzs7QUFDZDs7OztJQUlBLElBQUMsQ0FBQSxXQUFELEdBQWU7O0FBQ2Y7Ozs7SUFJQSxJQUFDLENB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LE1BQU0sQ0FBQyxLQUFQLENBQWpDLElBQWtELE1BRDFEO09BQUEsTUFBQTtRQUdELE1BQUEsR0FBUyxJQUFDLENBQUEsWUFBYSxDQUFBLE1BQU0sQ0FBQyxLQUFQLENBQWQsSUFBK0IsTUFIdkM7T0FIVDtLQUFBLE1BQUE7TUFTSSxNQUFBLEdBQVksTUFBSCxHQUFlLElBQWYsR0FBeUIsTUFUdEM7O0FBV0EsV0FBTztFQWJLOzs7QUFlaEI7Ozs7Ozs7OzswQkFRQSxtQkFBQSxHQUFxQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZjtBQUNqQixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBRVQsSUFBRyxLQUFBLEtBQVMsQ0FBWjtNQUNJLE1BQUEsR0FBUyxJQUFDLENBQUEsaUJBQWtCLENBQUEsTUFBQSxDQUFRLENBQUEsS0FBQSxDQUEzQixJQUFxQyxNQURsRDtLQUFBLE1BRUssSUFBRyxLQUFBLEtBQVMsQ0FBWjtNQUNELE1BQUEsR0FBUyxJQUFDLENBQUEsZ0JBQWlCLENBQUEsTUFBQSxDQUFRLENBQUEsS0FBQSxDQUExQixJQUFvQyxNQUQ1QztLQUFBLE1BQUE7TUFHRCxNQUFBLEdBQVMsSUFBQyxDQUFBLFlBQWEsQ0FBQSxLQUFBLENBQWQsSUFBd0IsTUFIaEM7O0FBS0wsV0FBTztFQVZVOzs7Ozs7QUFZekIsRUFBRSxDQUFDLGFBQUgsR0FBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IFZhcmlhYmxlU3RvcmVcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFZhcmlhYmxlU3RvcmVcbiAgICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJwZXJzaXN0ZW50TnVtYmVyc1wiLCBcInBlcnNpc3RlbnRTdHJpbmdzXCIsIFwicGVyc2lzdGVudEJvb2xlYW5zXCIsIFwicGVyc2lzdGVudExpc3RzXCJdXG4gICAgXG4gICAgIyMjKlxuICAgICogPHA+QSBzdG9yYWdlIGZvciBkaWZmZXJlbnQga2luZCBvZiBnYW1lIHZhcmlhYmxlcy4gVGhlIGZvbGxvd2luZyBzY29wZXNcbiAgICAqIGZvciB2YXJpYWJsZXMgZXhpc3Q6PC9wPlxuICAgICogXG4gICAgKiAtIExvY2FsIFZhcmlhYmxlcyAtPiBPbmx5IHZhbGlkIGZvciB0aGUgY3VycmVudCBzY2VuZS5cbiAgICAqIC0gR2xvYmFsIFZhcmlhYmxlcyAtPiBWYWxpZCBmb3IgdGhlIHdob2xlIGdhbWUgYnV0IGJvdW5kIHRvIGEgc2luZ2xlIHNhdmUtZ2FtZS5cbiAgICAqIC0gUGVyc2lzdGVudCBWYXJpYWJsZXMgLT4gVmFsaWQgZm9yIHRoZSB3aG9sZSBnYW1lIGluZGVwZW50ZW50IGZyb20gdGhlIHNhdmUtZ2FtZXMuXG4gICAgKiBcbiAgICAqIDxwPlRoZSBmb2xsb3dpbmcgZGF0YS10eXBlcyBleGlzdDo8L3A+XG4gICAgKiAtIFN0cmluZ3MgLT4gVmFyaWFibGVzIHN0b3JpbmcgdGV4dCBkYXRhLlxuICAgICogLSBOdW1iZXJzIC0+IFZhcmlhYmxlcyBzdG9yaW5nIGludGVnZXIgbnVtYmVyIHZhbHVlcy5cbiAgICAqIC0gQm9vbGVhbnMgLT4gVmFyaWFibGVzIHN0b3JpbmcgYm9vbGVhbiB2YWx1ZXMuIChDYWxsZWQgXCJTd2l0Y2hlc1wiIGZvciBlYXNpZXIgdW5kZXJzdGFuZGluZylcbiAgICAqIC0gTGlzdHMgLT4gVmFyaWFibGVzIHN0b3JpbmcgbXVsdGlwbGUgb3RoZXIgdmFyaWFibGVzLiBMaXN0cyBjYW4gYWxzbyBjb250YWluIExpc3RzLlxuICAgICogPHA+XG4gICAgKiBMb2NhbCB2YXJpYWJsZXMgYXJlIHN0b3JlZCBieSBzY2VuZSBVSUQuIEZvciBlYWNoIHNjZW5lIFVJRCBhIGxpc3Qgb2YgbG9jYWwgdmFyaWFibGVzIGlzIHN0b3JlZC48L3A+XG4gICAgKiBcbiAgICAqIDxwPkdsb2JhbCBhbmQgcGVyc2lzdGVudCB2YXJpYWJsZXMgYXJlIHN0b3JlZCBhbmQgYSBzcGVjaWZpYyBkb21haW4uIEEgZG9tYWluIGlzIGp1c3QgYSB1bmlxdWUgbmFtZSBzdWNoXG4gICAgKiBhcyA8aT5jb20uZXhhbXBsZS5nYW1lPC9pPiBmb3IgZXhhbXBsZS4gVGhlIGRlZmF1bHQgZG9tYWluIGlzIGFuIGVtcHR5IHN0cmluZy4gRG9tYWlucyBhcmUgdXNlZnVsIHRvIGF2b2lkXG4gICAgKiBvdmVybGFwcGluZyBvZiB2YXJpYWJsZSBudW1iZXJzIHdoZW4gc2hhcmluZyBjb250ZW50IHdpdGggb3RoZXIgdXNlcnMuIDwvcD5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgVmFyaWFibGVTdG9yZVxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIEN1cnJlbnQgbG9jYWwgdmFyaWFibGUgY29udGV4dFxuICAgICAgICAqIEBwcm9wZXJ0eSBjb250ZXh0XG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICMjI1xuICAgICAgICBAY29udGV4dCA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDdXJyZW50IGRvbWFpbiBmb3IgZ2xvYmFsIGFuZCBwZXJzaXN0ZW50IHZhcmlhYmxlcy4gRWFjaCBkb21haW4gaGFzIGl0cyBvd25cbiAgICAgICAgKiB2YXJpYWJsZXMuIFBsZWFzZSB1c2UgPGI+Y2hhbmdlRG9tYWluPC9iPiBtZXRob2QgdG8gY2hhbmdlIHRoZSBkb21haW4uXG4gICAgICAgICogQHByb3BlcnR5IGRvbWFpblxuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAjIyNcbiAgICAgICAgQGRvbWFpbiA9IFwiXCJcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBMaXN0IG9mIGF2YWlsYWJsZSBkb21haW5zIGZvciBnbG9iYWwgYW5kIHBlcnNpc3RlbnQgdmFyaWFibGVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBkb21haW5zXG4gICAgICAgICogQHR5cGUgc3RyaW5nW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBkb21haW5zID0gW1wiXCJdXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGdsb2JhbCBudW1iZXIgdmFyaWFibGVzIG9mIHRoZSBjdXJyZW50IGRvbWFpbi5cbiAgICAgICAgKiBAcHJvcGVydHkgbnVtYmVyc1xuICAgICAgICAqIEB0eXBlIG51bWJlcltdXG4gICAgICAgICMjI1xuICAgICAgICBAbnVtYmVycyA9IG51bGxcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBnbG9iYWwgYm9vbGVhbiB2YXJpYWJsZXMgb2YgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBib29sZWFuc1xuICAgICAgICAqIEB0eXBlIGJvb2xlYW5bXVxuICAgICAgICAjIyNcbiAgICAgICAgQGJvb2xlYW5zID0gbnVsbFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGdsb2JhbCBzdHJpbmcgdmFyaWFibGVzIG9mIHRoZSBjdXJyZW50IGRvbWFpbi5cbiAgICAgICAgKiBAcHJvcGVydHkgc3RyaW5nc1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgICMjI1xuICAgICAgICBAc3RyaW5ncyA9IG51bGxcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBnbG9iYWwgbGlzdCB2YXJpYWJsZXMgb2YgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsaXN0c1xuICAgICAgICAqIEB0eXBlIE9iamVjdFtdW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBsaXN0cyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgc3RvcmFnZSBvZiBhbGwgZ2xvYmFsIHZhcmlhYmxlcyBieSBkb21haW4uXG4gICAgICAgICogQHByb3BlcnR5IGdsb2JhbFZhcmlhYmxlc0J5RG9tYWluXG4gICAgICAgICogQHR5cGUgT2JqZWN0W11bXVxuICAgICAgICAjIyNcbiAgICAgICAgQGdsb2JhbFZhcmlhYmxlc0J5RG9tYWluID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgc3RvcmFnZSBvZiBhbGwgcGVyc2lzdGVudCB2YXJpYWJsZXMgYnkgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwZXJzaXN0ZW50VmFyaWFibGVzQnlEb21haW5cbiAgICAgICAgKiBAdHlwZSBPYmplY3RbXVtdXG4gICAgICAgICMjI1xuICAgICAgICBAcGVyc2lzdGVudFZhcmlhYmxlc0J5RG9tYWluID0ge31cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgcGVyc2lzdGVudCBudW1iZXIgdmFyaWFibGVzIG9mIHRoZSBjdXJyZW50IGRvbWFpbi5cbiAgICAgICAgKiBAcHJvcGVydHkgcGVyc2lzdGVudE51bWJlcnNcbiAgICAgICAgKiBAdHlwZSBudW1iZXJbXVxuICAgICAgICAjIyNcbiAgICAgICAgQHBlcnNpc3RlbnROdW1iZXJzID0gW11cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBwZXJzaXN0ZW50IHN0cmluZyB2YXJpYWJsZXMgb2YgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwZXJzaXN0ZW50U3RyaW5nc1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgICMjI1xuICAgICAgICBAcGVyc2lzdGVudFN0cmluZ3MgPSBbXVxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHBlcnNpc3RlbnQgYm9vbGVhbiB2YXJpYWJsZXMgb2YgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwZXJzaXN0ZW50Qm9vbGVhbnNcbiAgICAgICAgKiBAdHlwZSBib29sZWFuW11cbiAgICAgICAgIyMjXG4gICAgICAgIEBwZXJzaXN0ZW50Qm9vbGVhbnMgPSBbXVxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIHBlcnNpc3RlbnQgbGlzdCB2YXJpYWJsZXMgb2YgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwZXJzaXN0ZW50TGlzdHNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RbXVtdXG4gICAgICAgICMjI1xuICAgICAgICBAcGVyc2lzdGVudExpc3RzID0gW11cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsb2NhbCBudW1iZXIgdmFyaWFibGVzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsb2NhbE51bWJlcnNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBsb2NhbE51bWJlcnMgPSB7fVxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGxvY2FsIHN0cmluZyB2YXJpYWJsZXMuXG4gICAgICAgICogQHByb3BlcnR5IGxvY2FsU3RyaW5nc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQGxvY2FsU3RyaW5ncyA9IHt9XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbG9jYWwgYm9vbGVhbiB2YXJpYWJsZXMuXG4gICAgICAgICogQHByb3BlcnR5IGxvY2FsQm9vbGVhbnNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBsb2NhbEJvb2xlYW5zID0ge31cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsb2NhbCBsaXN0IHZhcmlhYmxlcy5cbiAgICAgICAgKiBAcHJvcGVydHkgbG9jYWxMaXN0c1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyNcbiAgICAgICAgQGxvY2FsTGlzdHMgPSB7fVxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHRlbXBOdW1iZXJzXG4gICAgICAgICogQHR5cGUgbnVtYmVyW11cbiAgICAgICAgIyMjXG4gICAgICAgIEB0ZW1wTnVtYmVycyA9IG51bGxcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSB0ZW1wU3RyaW5nc1xuICAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgICMjI1xuICAgICAgICBAdGVtcFN0cmluZ3MgPSBudWxsXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgbG9jYWxCb29sZWFuc1xuICAgICAgICAqIEB0eXBlIG51bWJlcltdXG4gICAgICAgICMjI1xuICAgICAgICBAdGVtcEJvb2xlYW5zID0gbnVsbFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGxvY2FsTGlzdHNcbiAgICAgICAgKiBAdHlwZSBPYmplY3RbXVtdXG4gICAgICAgICMjI1xuICAgICAgICBAdGVtcExpc3RzID0gbnVsbFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDYWxsZWQgaWYgdGhpcyBvYmplY3QgaW5zdGFuY2UgaXMgcmVzdG9yZWQgZnJvbSBhIGRhdGEtYnVuZGxlLiBJdCBjYW4gYmUgdXNlZFxuICAgICogcmUtYXNzaWduIGV2ZW50LWhhbmRsZXIsIGFub255bW91cyBmdW5jdGlvbnMsIGV0Yy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBvbkRhdGFCdW5kbGVSZXN0b3JlLlxuICAgICogQHBhcmFtIE9iamVjdCBkYXRhIC0gVGhlIGRhdGEtYnVuZGxlXG4gICAgKiBAcGFyYW0gZ3MuT2JqZWN0Q29kZWNDb250ZXh0IGNvbnRleHQgLSBUaGUgY29kZWMtY29udGV4dC5cbiAgICAjIyNcbiAgICBvbkRhdGFCdW5kbGVSZXN0b3JlOiAoZGF0YSwgY29udGV4dCkgLT5cbiAgICAgICAgZG9tYWlucyA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50c0J5VHlwZShcImdsb2JhbF92YXJpYWJsZXNcIikuc2VsZWN0IChkKSAtPiBkLml0ZW1zLmRvbWFpblxuICAgICAgICBcbiAgICAgICAgZm9yIGRvbWFpbiwgaSBpbiBkb21haW5zXG4gICAgICAgICAgICBAbnVtYmVyc0J5RG9tYWluW2RvbWFpbl0gPSBAbnVtYmVyc0J5RG9tYWluW2ldXG4gICAgICAgICAgICBAc3RyaW5nc0J5RG9tYWluW2RvbWFpbl0gPSBAc3RyaW5nc0J5RG9tYWluW2ldXG4gICAgICAgICAgICBAYm9vbGVhbnNCeURvbWFpbltkb21haW5dID0gQGJvb2xlYW5zQnlEb21haW5baV1cbiAgICAgICAgICAgIEBsaXN0c0J5RG9tYWluW2RvbWFpbl0gPSBAbGlzdHNCeURvbWFpbltpXVxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICBcbiAgICBzZXR1cERvbWFpbnM6IChkb21haW5zKSAtPlxuICAgICAgICBAbnVtYmVyc0J5RG9tYWluID0gW11cbiAgICAgICAgQHN0cmluZ3NCeURvbWFpbiA9IFtdXG4gICAgICAgIEBib29sZWFuc0J5RG9tYWluID0gW11cbiAgICAgICAgQGxpc3RzQnlEb21haW4gPSBbXVxuICAgICAgICBAZG9tYWlucyA9IGRvbWFpbnNcbiAgICAgICAgXG4gICAgICAgIGZvciBkb21haW4sIGkgaW4gQGRvbWFpbnNcbiAgICAgICAgICAgIEBudW1iZXJzQnlEb21haW5baV0gPSBuZXcgQXJyYXkoMTAwMClcbiAgICAgICAgICAgIEBudW1iZXJzQnlEb21haW5bZG9tYWluXSA9IEBudW1iZXJzQnlEb21haW5baV1cbiAgICAgICAgICAgIEBzdHJpbmdzQnlEb21haW5baV0gPSBuZXcgQXJyYXkoMTAwMClcbiAgICAgICAgICAgIEBzdHJpbmdzQnlEb21haW5bZG9tYWluXSA9IEBzdHJpbmdzQnlEb21haW5baV1cbiAgICAgICAgICAgIEBib29sZWFuc0J5RG9tYWluW2ldID0gbmV3IEFycmF5KDEwMDApXG4gICAgICAgICAgICBAYm9vbGVhbnNCeURvbWFpbltkb21haW5dID0gQGJvb2xlYW5zQnlEb21haW5baV1cbiAgICAgICAgICAgIEBsaXN0c0J5RG9tYWluW2ldID0gbmV3IEFycmF5KDEwMDApXG4gICAgICAgICAgICBAbGlzdHNCeURvbWFpbltkb21haW5dID0gQGxpc3RzQnlEb21haW5baV1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHBlcnNpc3RlbnROdW1iZXJzW2ldID0gbmV3IEFycmF5KDEwKVxuICAgICAgICAgICAgQHBlcnNpc3RlbnROdW1iZXJzW2RvbWFpbl0gPSBAcGVyc2lzdGVudE51bWJlcnNbaV1cbiAgICAgICAgICAgIEBwZXJzaXN0ZW50U3RyaW5nc1tpXSA9IG5ldyBBcnJheSgxMClcbiAgICAgICAgICAgIEBwZXJzaXN0ZW50U3RyaW5nc1tkb21haW5dID0gQHBlcnNpc3RlbnRTdHJpbmdzW2ldXG4gICAgICAgICAgICBAcGVyc2lzdGVudEJvb2xlYW5zW2ldID0gbmV3IEFycmF5KDEwKVxuICAgICAgICAgICAgQHBlcnNpc3RlbnRCb29sZWFuc1tkb21haW5dID0gQHBlcnNpc3RlbnRCb29sZWFuc1tpXVxuICAgICAgICAgICAgQHBlcnNpc3RlbnRMaXN0c1tpXSA9IG5ldyBBcnJheSgxMClcbiAgICAgICAgICAgIEBwZXJzaXN0ZW50TGlzdHNbZG9tYWluXSA9IEBwZXJzaXN0ZW50TGlzdHNbaV1cbiAgICAgICAgICAgIFxuICAgICAgICBAbnVtYmVycyA9IEBudW1iZXJzQnlEb21haW5bMF1cbiAgICAgICAgQHN0cmluZ3MgPSBAc3RyaW5nc0J5RG9tYWluWzBdXG4gICAgICAgIEBib29sZWFucyA9IEBib29sZWFuc0J5RG9tYWluWzBdXG4gICAgICAgIEBsaXN0cyA9IEBudW1iZXJzQnlEb21haW5bMF1cbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2hhbmdlcyB0aGUgY3VycmVudCBkb21haW4uXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGFuZ2VEb21haW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBkb21haW4gLSBUaGUgZG9tYWluIHRvIGNoYW5nZSB0by5cbiAgICAjIyMgXG4gICAgY2hhbmdlRG9tYWluOiAoZG9tYWluKSAtPlxuICAgICAgICBAZG9tYWluID0gZG9tYWluXG4gICAgICAgIGdsb2JhbFZhcmlhYmxlcyA9IEBnbG9iYWxWYXJpYWJsZXNCeURvbWFpbltkb21haW5dXG4gICAgICAgIHBlcnNpc3RlbnRWYXJpYWJsZXMgPSBAcGVyc2lzdGVudFZhcmlhYmxlc0J5RG9tYWluW2RvbWFpbl1cbiAgICAgICAgXG4gICAgICAgIGlmICFnbG9iYWxWYXJpYWJsZXNcbiAgICAgICAgICAgIGdsb2JhbFZhcmlhYmxlcyA9IEBnbG9iYWxWYXJpYWJsZXNCeURvbWFpbltkb21haW5dID0geyBudW1iZXJzOiBuZXcgQXJyYXkoNTAwKSwgc3RyaW5nczogbmV3IEFycmF5KDUwMCksIGJvb2xlYW5zOiBuZXcgQXJyYXkoNTAwKSwgbGlzdHM6IG5ldyBBcnJheSg1MDApIH1cbiAgICAgICAgaWYgIXBlcnNpc3RlbnRWYXJpYWJsZXNcbiAgICAgICAgICAgIHBlcnNpc3RlbnRWYXJpYWJsZXMgPSBAcGVyc2lzdGVudFZhcmlhYmxlc0J5RG9tYWluW2RvbWFpbl0gPSB7IG51bWJlcnM6IG5ldyBBcnJheSg1MDApLCBzdHJpbmdzOiBuZXcgQXJyYXkoNTAwKSwgYm9vbGVhbnM6IG5ldyBBcnJheSg1MDApLCBsaXN0czogbmV3IEFycmF5KDUwMCkgfSAgICBcbiAgICAgICAgXG4gICAgICAgIEBudW1iZXJzID0gZ2xvYmFsVmFyaWFibGVzLm51bWJlcnNcbiAgICAgICAgQHN0cmluZ3MgPSBnbG9iYWxWYXJpYWJsZXMuc3RyaW5nc1xuICAgICAgICBAYm9vbGVhbnMgPSBnbG9iYWxWYXJpYWJsZXMuYm9vbGVhbnNcbiAgICAgICAgQGxpc3RzID0gZ2xvYmFsVmFyaWFibGVzLmxpc3RzXG4gICAgICAgIEBwZXJzaXN0ZW50TnVtYmVycyA9IHBlcnNpc3RlbnRWYXJpYWJsZXMubnVtYmVyc1xuICAgICAgICBAcGVyc2lzdGVudEJvb2xlYW5zID0gcGVyc2lzdGVudFZhcmlhYmxlcy5ib29sZWFuc1xuICAgICAgICBAcGVyc2lzdGVudFN0cmluZ3MgPSBwZXJzaXN0ZW50VmFyaWFibGVzLnN0cmluZ3NcbiAgICAgICAgQHBlcnNpc3RlbnRMaXN0cyA9IHBlcnNpc3RlbnRWYXJpYWJsZXMubGlzdHNcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2xlYXJzIGFsbCBnbG9iYWwgdmFyaWFibGVzXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhckdsb2JhbFZhcmlhYmxlc1xuICAgICMjIyBcbiAgICBjbGVhckFsbEdsb2JhbFZhcmlhYmxlczogLT5cbiAgICAgICAgQHNldHVwRG9tYWlucyhAZG9tYWlucylcbiAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBnbG9iYWxWYXJpYWJsZXMgPSBAZ2xvYmFsVmFyaWFibGVzQnlEb21haW5bQGRvbWFpbl1cbiAgICAgICAgQG51bWJlcnNCeURvbWFpbiA9IG5ldyBBcnJheSgxMDAwKVxuICAgICAgICBnbG9iYWxWYXJpYWJsZXMuYm9vbGVhbnMgPSBuZXcgQXJyYXkoMTAwMClcbiAgICAgICAgZ2xvYmFsVmFyaWFibGVzLnN0cmluZ3MgPSBuZXcgQXJyYXkoMTAwMClcbiAgICBcbiAgICAgICAgQG51bWJlcnMgPSBnbG9iYWxWYXJpYWJsZXMubnVtYmVyc1xuICAgICAgICBAc3RyaW5ncyA9IGdsb2JhbFZhcmlhYmxlcy5zdHJpbmdzXG4gICAgICAgIEBib29sZWFucyA9IGdsb2JhbFZhcmlhYmxlcy5ib29sZWFuc1xuICAgIFxuICAgICMjIypcbiAgICAqIENsZWFycyBhbGwgbG9jYWwgdmFyaWFibGVzIGZvciBhbGwgY29udGV4dHMvc2NlbmVzL2NvbW1vbi1ldmVudHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhckFsbExvY2FsVmFyaWFibGVzXG4gICAgIyMjIFxuICAgIGNsZWFyQWxsTG9jYWxWYXJpYWJsZXM6IC0+XG4gICAgICAgIEBsb2NhbE51bWJlcnMgPSB7fVxuICAgICAgICBAbG9jYWxTdHJpbmdzID0ge31cbiAgICAgICAgQGxvY2FsQm9vbGVhbnMgPSB7fVxuICAgICAgICBAbG9jYWxMaXN0cyA9IHt9XG4gICAgIFxuICAgICMjIypcbiAgICAqIENsZWFycyBzcGVjaWZpZWQgdmFyaWFibGVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2xlYXJWYXJpYWJsZXNcbiAgICAqIEBwYXJhbSB7bnVtYmVyW119IG51bWJlcnMgLSBUaGUgbnVtYmVyIHZhcmlhYmxlcyB0byBjbGVhci5cbiAgICAqIEBwYXJhbSB7c3RyaW5nW119IHN0cmluZ3MgLSBUaGUgc3RyaW5nIHZhcmlhYmxlcyB0byBjbGVhci5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbltdfSBib29sZWFucyAtIFRoZSBib29sZWFuIHZhcmlhYmxlcyB0byBjbGVhci5cbiAgICAqIEBwYXJhbSB7QXJyYXlbXX0gbGlzdHMgLSBUaGUgbGlzdCB2YXJpYWJsZXMgdG8gY2xlYXIuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdHlwZSAtIERldGVybWluZXMgd2hhdCBraW5kIG9mIHZhcmlhYmxlcyBzaG91bGQgYmUgY2xlYXJlZC5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT4wID0gQWxsPC9saT5cbiAgICAqIDxsaT4xID0gU3dpdGNoZXMgLyBCb29sZWFuczwvbGk+XG4gICAgKiA8bGk+MiA9IE51bWJlcnM8L2xpPlxuICAgICogPGxpPjMgPSBUZXh0czwvbGk+XG4gICAgKiA8bGk+NCA9IExpc3RzPC9saT5cbiAgICAqIDwvdWw+XG4gICAgKiBAcGFyYW0ge09iamVjdH0gcmFuZ2UgLSBUaGUgdmFyaWFibGUgaWQtcmFuZ2UgdG8gY2xlYXIuIElmIDxiPm51bGw8L2I+IGFsbCBzcGVjaWZpZWQgdmFyaWFibGVzIGFyZSBjbGVhcmVkLlxuICAgICMjIyAgXG4gICAgY2xlYXJWYXJpYWJsZXM6IChudW1iZXJzLCBzdHJpbmdzLCBib29sZWFucywgbGlzdHMsIHR5cGUsIHJhbmdlKSAtPlxuICAgICAgICBzd2l0Y2ggdHlwZVxuICAgICAgICAgICAgd2hlbiAwICMgQWxsXG4gICAgICAgICAgICAgICAgbnVtYmVycz8uZmlsbCgwLCByYW5nZS5zdGFydCwgcmFuZ2UuZW5kKVxuICAgICAgICAgICAgICAgIHN0cmluZ3M/LmZpbGwoXCJcIiwgcmFuZ2Uuc3RhcnQsIHJhbmdlLmVuZClcbiAgICAgICAgICAgICAgICBib29sZWFucz8uZmlsbChmYWxzZSwgcmFuZ2Uuc3RhcnQsIHJhbmdlLmVuZClcbiAgICAgICAgICAgICAgICBsaXN0cz8uZmlsbChbXSwgcmFuZ2Uuc3RhcnQsIHJhbmdlLmVuZClcbiAgICAgICAgICAgIHdoZW4gMSAjIFN3aXRjaFxuICAgICAgICAgICAgICAgIGJvb2xlYW5zPy5maWxsKGZhbHNlLCByYW5nZS5zdGFydCwgcmFuZ2UuZW5kKVxuICAgICAgICAgICAgd2hlbiAyICMgTnVtYmVyXG4gICAgICAgICAgICAgICAgbnVtYmVycz8uZmlsbCgwLCByYW5nZS5zdGFydCwgcmFuZ2UuZW5kKVxuICAgICAgICAgICAgd2hlbiAzICMgVGV4dFxuICAgICAgICAgICAgICAgIHN0cmluZ3M/LmZpbGwoXCJcIiwgcmFuZ2Uuc3RhcnQsIHJhbmdlLmVuZClcbiAgICAgICAgICAgIHdoZW4gNCAjIExpc3RcbiAgICAgICAgICAgICAgICBsaXN0cz8uZmlsbChbXSwgcmFuZ2Uuc3RhcnQsIHJhbmdlLmVuZClcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDbGVhcnMgYWxsIGxvY2FsIHZhcmlhYmxlcyBmb3IgYSBzcGVjaWZpZWQgY29udGV4dC4gSWYgdGhlIGNvbnRleHQgaXMgbm90IHNwZWNpZmllZCwgYWxsXG4gICAgKiBsb2NhbCB2YXJpYWJsZXMgZm9yIGFsbCBjb250ZXh0cy9zY2VuZXMvY29tbW9uLWV2ZW50cyBhcmUgY2xlYXJlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGNsZWFyTG9jYWxWYXJpYWJsZXNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIGNvbnRleHQgdG8gY2xlYXIgdGhlIGxvY2FsIHZhcmlhYmxlcyBmb3IuIElmIDxiPm51bGw8L2I+LCBhbGxcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eXBlIC0gRGV0ZXJtaW5lcyB3aGF0IGtpbmQgb2YgdmFyaWFibGVzIHNob3VsZCBiZSBjbGVhcmVkLlxuICAgICogPHVsPlxuICAgICogPGxpPjAgPSBBbGw8L2xpPlxuICAgICogPGxpPjEgPSBTd2l0Y2hlcyAvIEJvb2xlYW5zPC9saT5cbiAgICAqIDxsaT4yID0gTnVtYmVyczwvbGk+XG4gICAgKiA8bGk+MyA9IFRleHRzPC9saT5cbiAgICAqIDxsaT40ID0gTGlzdHM8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSByYW5nZSAtIFRoZSB2YXJpYWJsZSBpZC1yYW5nZSB0byBjbGVhci4gSWYgPGI+bnVsbDwvYj4gYWxsIHZhcmlhYmxlcyBhcmUgY2xlYXJlZC5cbiAgICAjIyMgIFxuICAgIGNsZWFyTG9jYWxWYXJpYWJsZXM6IChjb250ZXh0LCB0eXBlLCByYW5nZSkgLT5cbiAgICAgICAgaWYgY29udGV4dD9cbiAgICAgICAgICAgIGlkcyA9IFtjb250ZXh0LmlkXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZHMgPSBPYmplY3Qua2V5cyhAbG9jYWxOdW1iZXJzKVxuICAgICAgICAgICAgXG4gICAgICAgIGlmIHJhbmdlP1xuICAgICAgICAgICAgcmFuZ2UgPSBzdGFydDogcmFuZ2Uuc3RhcnQsIGVuZDogcmFuZ2UuZW5kICsgMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByYW5nZSA9IHN0YXJ0OiAwLCBlbmQ6IG51bGxcbiAgICAgICAgICAgIFxuICAgICAgICBmb3IgaWQgaW4gaWRzXG4gICAgICAgICAgICBAY2xlYXJWYXJpYWJsZXMoQGxvY2FsTnVtYmVyc1tpZF0sIEBsb2NhbFN0cmluZ3NbaWRdLCBAbG9jYWxCb29sZWFuc1tpZF0sIEBsb2NhbExpc3RzW2lkXSwgdHlwZSwgcmFuZ2UpXG4gXG4gICAgIyMjKlxuICAgICogQ2xlYXJzIGdsb2JhbCB2YXJpYWJsZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhckdsb2JhbFZhcmlhYmxlc1xuICAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgLSBEZXRlcm1pbmVzIHdoYXQga2luZCBvZiB2YXJpYWJsZXMgc2hvdWxkIGJlIGNsZWFyZWQuXG4gICAgKiA8dWw+XG4gICAgKiA8bGk+MCA9IEFsbDwvbGk+XG4gICAgKiA8bGk+MSA9IFN3aXRjaGVzIC8gQm9vbGVhbnM8L2xpPlxuICAgICogPGxpPjIgPSBOdW1iZXJzPC9saT5cbiAgICAqIDxsaT4zID0gVGV4dHM8L2xpPlxuICAgICogPGxpPjQgPSBMaXN0czwvbGk+XG4gICAgKiA8L3VsPlxuICAgICogQHBhcmFtIHtPYmplY3R9IHJhbmdlIC0gVGhlIHZhcmlhYmxlIGlkLXJhbmdlIHRvIGNsZWFyLiBJZiA8Yj5udWxsPC9iPiBhbGwgdmFyaWFibGVzIGFyZSBjbGVhcmVkLlxuICAgICMjIyBcbiAgICBjbGVhckdsb2JhbFZhcmlhYmxlczogKHR5cGUsIHJhbmdlKSAtPlxuICAgICAgICBpZiByYW5nZT9cbiAgICAgICAgICAgIHJhbmdlID0gc3RhcnQ6IHJhbmdlLnN0YXJ0LCBlbmQ6IHJhbmdlLmVuZCArIDFcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmFuZ2UgPSBzdGFydDogMCwgZW5kOiBudWxsXG4gICAgICAgICAgICBcbiAgICAgICAgQGNsZWFyVmFyaWFibGVzKEBudW1iZXJzLCBAc3RyaW5ncywgQGJvb2xlYW5zLCBAbGlzdHMsIHR5cGUsIHJhbmdlKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDbGVhcnMgcGVyc2lzdGVudCB2YXJpYWJsZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBjbGVhclBlcnNpc3RlbnRWYXJpYWJsZXNcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eXBlIC0gRGV0ZXJtaW5lcyB3aGF0IGtpbmQgb2YgdmFyaWFibGVzIHNob3VsZCBiZSBjbGVhcmVkLlxuICAgICogPHVsPlxuICAgICogPGxpPjAgPSBBbGw8L2xpPlxuICAgICogPGxpPjEgPSBTd2l0Y2hlcyAvIEJvb2xlYW5zPC9saT5cbiAgICAqIDxsaT4yID0gTnVtYmVyczwvbGk+XG4gICAgKiA8bGk+MyA9IFRleHRzPC9saT5cbiAgICAqIDxsaT40ID0gTGlzdHM8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSByYW5nZSAtIFRoZSB2YXJpYWJsZSBpZC1yYW5nZSB0byBjbGVhci4gSWYgPGI+bnVsbDwvYj4gYWxsIHZhcmlhYmxlcyBhcmUgY2xlYXJlZC5cbiAgICAjIyMgXG4gICAgY2xlYXJQZXJzaXN0ZW50VmFyaWFibGVzOiAodHlwZSwgcmFuZ2UpIC0+XG4gICAgICAgIGlmIHJhbmdlP1xuICAgICAgICAgICAgcmFuZ2UgPSBzdGFydDogcmFuZ2Uuc3RhcnQsIGVuZDogcmFuZ2UuZW5kICsgMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByYW5nZSA9IHN0YXJ0OiAwLCBlbmQ6IG51bGxcbiAgICAgICAgICAgIFxuICAgICAgICBAY2xlYXJWYXJpYWJsZXMoQHBlcnNpc3RlbnROdW1iZXJzLCBAcGVyc2lzdGVudHN0cmluZ3MsIEBwZXJzaXN0ZW50Qm9vbGVhbnMsIEBwZXJzaXN0ZW50TGlzdHMsIHR5cGUsIHJhbmdlKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgdmFyaWFibGVzLiBTaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBjb250ZXh0IGNoYW5nZXMuIChMaWtlIGFmdGVyIGEgc2NlbmUgY2hhbmdlKVxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIGNvbnRleHQoY3VycmVudCBzY2VuZSkgbmVlZGVkIGZvciBsb2NhbCB2YXJpYWJsZXMuIE5lZWRzIGhhdmUgYXQgbGVhc3QgYW4gaWQtcHJvcGVydHkuXG4gICAgIyMjICAgICBcbiAgICBzZXR1cDogKGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cExvY2FsVmFyaWFibGVzKGNvbnRleHQpXG4gICAgICAgIEBzZXR1cFRlbXBWYXJpYWJsZXMoY29udGV4dClcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgbG9jYWwgdmFyaWFibGVzIGZvciB0aGUgc3BlY2lmaWVkIGNvbnRleHQuIFNob3VsZCBiZSBjYWxsZWQgb24gZmlyc3QgdGltZSB1c2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cExvY2FsVmFyaWFibGVzXG4gICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIFRoZSBjb250ZXh0KGN1cnJlbnQgc2NlbmUpLiBOZWVkcyBoYXZlIGF0IGxlYXN0IGFuIGlkLXByb3BlcnR5LlxuICAgICMjI1xuICAgIHNldHVwTG9jYWxWYXJpYWJsZXM6IChjb250ZXh0KSAtPlxuICAgICAgICBAc2V0dXBWYXJpYWJsZXMoY29udGV4dCwgXCJsb2NhbE51bWJlcnNcIiwgMClcbiAgICAgICAgQHNldHVwVmFyaWFibGVzKGNvbnRleHQsIFwibG9jYWxTdHJpbmdzXCIsIFwiXCIpXG4gICAgICAgIEBzZXR1cFZhcmlhYmxlcyhjb250ZXh0LCBcImxvY2FsQm9vbGVhbnNcIiwgbm8pXG4gICAgICAgIEBzZXR1cFZhcmlhYmxlcyhjb250ZXh0LCBcImxvY2FsTGlzdHNcIiwgW10pXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEluaXRpYWxpemVzIHRoZSBzcGVjaWZpZWQga2luZCBvZiB2YXJpYWJsZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFZhcmlhYmxlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBUaGUgY29udGV4dChjdXJyZW50IHNjZW5lKS4gTmVlZHMgaGF2ZSBhdCBsZWFzdCBhbiBpZC1wcm9wZXJ0eS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIFRoZSBraW5kIG9mIHZhcmlhYmxlcyAocHJvcGVydHktbmFtZSkuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdFZhbHVlIC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggdmFyaWFibGUuXG4gICAgIyMjICBcbiAgICBzZXR1cFZhcmlhYmxlczogKGNvbnRleHQsIHByb3BlcnR5LCBkZWZhdWx0VmFsdWUpIC0+XG4gICAgICAgIGlmIG5vdCB0aGlzW3Byb3BlcnR5XVtjb250ZXh0LmlkXT9cbiAgICAgICAgICAgIHRoaXNbcHJvcGVydHldW2NvbnRleHQuaWRdID0gW11cbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgY3VycmVudCB0ZW1wIHZhcmlhYmxlcyBmb3IgdGhlIHNwZWNpZmllZCBjb250ZXh0LiBTaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHRoZSBjb250ZXh0IGNoYW5nZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFRlbXBWYXJpYWJsZXNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIGNvbnRleHQoY3VycmVudCBzY2VuZSkuIE5lZWRzIGhhdmUgYXQgbGVhc3QgYW4gaWQtcHJvcGVydHkuXG4gICAgIyMjICAgIFxuICAgIHNldHVwVGVtcFZhcmlhYmxlczogKGNvbnRleHQpIC0+XG4gICAgICAgIEBjb250ZXh0ID0gY29udGV4dFxuICAgICAgICBpZiAhQGxvY2FsTnVtYmVyc1tjb250ZXh0LmlkXVxuICAgICAgICAgICAgQHNldHVwTG9jYWxWYXJpYWJsZXMoY29udGV4dClcbiAgICAgICAgICAgIFxuICAgICAgICBAdGVtcE51bWJlcnMgPSBAbG9jYWxOdW1iZXJzW2NvbnRleHQuaWRdXG4gICAgICAgIEB0ZW1wU3RyaW5ncyA9IEBsb2NhbFN0cmluZ3NbY29udGV4dC5pZF1cbiAgICAgICAgQHRlbXBCb29sZWFucyA9IEBsb2NhbEJvb2xlYW5zW2NvbnRleHQuaWRdXG4gICAgICAgIEB0ZW1wTGlzdHMgPSBAbG9jYWxMaXN0c1tjb250ZXh0LmlkXVxuICAgICAgICBcbiAgICBjbGVhclRlbXBWYXJpYWJsZXM6IChjb250ZXh0KSAtPlxuICAgICAgICBcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgbnVtYmVyIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXROdW1iZXJWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSBzY29wZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSB2YXJpYWJsZSdzIGluZGV4LlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAgICAjIyMgICAgIFxuICAgIHNldE51bWJlclZhbHVlQXRJbmRleDogKHNjb3BlLCBpbmRleCwgdmFsdWUsIGRvbWFpbikgLT5cbiAgICAgICAgaWYgc2NvcGUgPT0gMlxuICAgICAgICAgICAgQHBlcnNpc3RlbnROdW1iZXJzW2RvbWFpbl1baW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZSBpZiBzY29wZSA9PSAxXG4gICAgICAgICAgICBAbnVtYmVyc0J5RG9tYWluW2RvbWFpbnx8MF1baW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHRlbXBOdW1iZXJzW2luZGV4XSA9IHZhbHVlXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBudW1iZXIgdmFyaWFibGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXROdW1iZXJWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YXJpYWJsZSAtIFRoZSB2YXJpYWJsZSB0byBzZXQuIFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAgICAjIyMgICAgIFxuICAgIHNldE51bWJlclZhbHVlVG86ICh2YXJpYWJsZSwgdmFsdWUpIC0+XG4gICAgICAgIGlmIHZhcmlhYmxlLnNjb3BlID09IDJcbiAgICAgICAgICAgIEBwZXJzaXN0ZW50TnVtYmVyc1t2YXJpYWJsZS5kb21haW58fDBdW3ZhcmlhYmxlLmluZGV4XSA9IHZhbHVlXG4gICAgICAgIGVsc2UgaWYgdmFyaWFibGUuc2NvcGUgPT0gMVxuICAgICAgICAgICAgQG51bWJlcnNCeURvbWFpblt2YXJpYWJsZS5kb21haW58fDBdW3ZhcmlhYmxlLmluZGV4XSA9IHZhbHVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB0ZW1wTnVtYmVyc1t2YXJpYWJsZS5pbmRleF0gPSB2YWx1ZVxuXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgbGlzdCB2YXJpYWJsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldExpc3RPYmplY3RUb1xuICAgICogQHBhcmFtIHtPYmplY3R9IHZhcmlhYmxlIC0gVGhlIHZhcmlhYmxlIHRvIHNldC4gXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LlxuICAgICMjIyAgICAgICAgICAgICBcbiAgICBzZXRMaXN0T2JqZWN0VG86ICh2YXJpYWJsZSwgdmFsdWUpIC0+XG4gICAgICAgIGlmIHZhcmlhYmxlLnNjb3BlID09IDJcbiAgICAgICAgICAgIEBwZXJzaXN0ZW50TGlzdHNbdmFyaWFibGUuZG9tYWlufHwwXVt2YXJpYWJsZS5pbmRleF0gPSB2YWx1ZVxuICAgICAgICBlbHNlIGlmIHZhcmlhYmxlLnNjb3BlID09IDFcbiAgICAgICAgICAgIEBsaXN0c0J5RG9tYWluW3ZhcmlhYmxlLmRvbWFpbnx8MF1bdmFyaWFibGUuaW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHRlbXBMaXN0c1t2YXJpYWJsZS5pbmRleF0gPSB2YWx1ZVxuXG4gICAgXG4gICAgIyMjKlxuICAgICogU2V0cyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgYm9vbGVhbiB2YXJpYWJsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldEJvb2xlYW5WYWx1ZVRvXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gc2V0LiBcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LlxuICAgICMjIyAgICAgICAgICAgICAgIFxuICAgIHNldEJvb2xlYW5WYWx1ZVRvOiAodmFyaWFibGUsIHZhbHVlKSAtPlxuICAgICAgICBpZiB2YXJpYWJsZS5zY29wZSA9PSAyXG4gICAgICAgICAgICBAcGVyc2lzdGVudEJvb2xlYW5zW3ZhcmlhYmxlLmRvbWFpbl1bdmFyaWFibGUuaW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZSBpZiB2YXJpYWJsZS5zY29wZSA9PSAxXG4gICAgICAgICAgICBAYm9vbGVhbnNCeURvbWFpblt2YXJpYWJsZS5kb21haW5dW3ZhcmlhYmxlLmluZGV4XSA9IHZhbHVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB0ZW1wQm9vbGVhbnNbdmFyaWFibGUuaW5kZXhdID0gdmFsdWVcbiAgICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBib29sZWFuIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRCb29sZWFuVmFsdWVBdEluZGV4XG4gICAgKiBAcGFyYW0ge251bWJlcn0gc2NvcGUgLSBUaGUgdmFyaWFibGUgc2NvcGUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBUaGUgdmFyaWFibGUncyBpbmRleC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LlxuICAgICMjIyAgICAgXG4gICAgc2V0Qm9vbGVhblZhbHVlQXRJbmRleDogKHNjb3BlLCBpbmRleCwgdmFsdWUsIGRvbWFpbikgLT5cbiAgICAgICAgaWYgc2NvcGUgPT0gMlxuICAgICAgICAgICAgQHBlcnNpc3RlbnRCb29sZWFuc1tkb21haW5dW2luZGV4XSA9IHZhbHVlXG4gICAgICAgIGVsc2UgaWYgc2NvcGUgPT0gMVxuICAgICAgICAgICAgQGJvb2xlYW5zQnlEb21haW5bZG9tYWluXVtpbmRleF0gPSB2YWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAdGVtcEJvb2xlYW5zW2luZGV4XSA9IHZhbHVlXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBzdHJpbmcgdmFyaWFibGUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRTdHJpbmdWYWx1ZVRvXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdmFyaWFibGUgLSBUaGUgdmFyaWFibGUgdG8gc2V0LiBcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQuXG4gICAgIyMjICAgXG4gICAgc2V0U3RyaW5nVmFsdWVUbzogKHZhcmlhYmxlLCB2YWx1ZSkgLT5cbiAgICAgICAgaWYgdmFyaWFibGUuc2NvcGUgPT0gMlxuICAgICAgICAgICAgQHBlcnNpc3RlbnRTdHJpbmdzW3ZhcmlhYmxlLmRvbWFpbl1bdmFyaWFibGUuaW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZSBpZiB2YXJpYWJsZS5zY29wZSA9PSAxXG4gICAgICAgICAgICBAc3RyaW5nc0J5RG9tYWluW3ZhcmlhYmxlLmRvbWFpbl1bdmFyaWFibGUuaW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHRlbXBTdHJpbmdzW3ZhcmlhYmxlLmluZGV4XSA9IHZhbHVlXG4gICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgc3RyaW5nIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXRTdHJpbmdWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSBzY29wZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSB2YXJpYWJsZSdzIGluZGV4LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIHZhbHVlIHRvIHNldC5cbiAgICAjIyMgICAgIFxuICAgIHNldFN0cmluZ1ZhbHVlQXRJbmRleDogKHNjb3BlLCBpbmRleCwgdmFsdWUsIGRvbWFpbikgLT5cbiAgICAgICAgaWYgc2NvcGUgPT0gMlxuICAgICAgICAgICAgQHBlcnNpc3RlbnRTdHJpbmdzW2RvbWFpbl1baW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZSBpZiBzY29wZSA9PSAxXG4gICAgICAgICAgICBAc3RyaW5nc0J5RG9tYWluW2RvbWFpbl1baW5kZXhdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHRlbXBTdHJpbmdzW2luZGV4XSA9IHZhbHVlXG5cbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBsaXN0IHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgbGlzdE9iamVjdE9mXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gVGhlIGxpc3QtdmFyaWFibGUvb2JqZWN0IHRvIGdldCB0aGUgdmFsdWUgZnJvbS5cbiAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGxpc3Qtb2JqZWN0LlxuICAgICMjIyAgIFxuICAgIGxpc3RPYmplY3RPZjogKG9iamVjdCkgLT5cbiAgICAgICAgcmVzdWx0ID0gMFxuICAgICAgICBpZiBvYmplY3Q/IGFuZCBvYmplY3QuaW5kZXg/XG4gICAgICAgICAgICBpZiBvYmplY3Quc2NvcGUgPT0gMlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBwZXJzaXN0ZW50TGlzdHNbb2JqZWN0LmRvbWFpbl1bb2JqZWN0LmluZGV4XVxuICAgICAgICAgICAgZWxzZSBpZiBvYmplY3Quc2NvcGUgPT0gMVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBsaXN0c0J5RG9tYWluW29iamVjdC5kb21haW5dW29iamVjdC5pbmRleF1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBAdGVtcExpc3RzW29iamVjdC5pbmRleF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzdWx0ID0gb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBbXVxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGEgbnVtYmVyIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBudW1iZXJWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSBzY29wZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSB2YXJpYWJsZSdzIGluZGV4LlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbnVtYmVyIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgICAgICBcbiAgICBudW1iZXJWYWx1ZUF0SW5kZXg6IChzY29wZSwgaW5kZXgsIGRvbWFpbikgLT5cbiAgICAgICAgcmVzdWx0ID0gMFxuICAgICAgICBcbiAgICAgICAgaWYgc2NvcGUgPT0gMlxuICAgICAgICAgICAgcmVzdWx0ID0gQHBlcnNpc3RlbnROdW1iZXJzW2RvbWFpbl1baW5kZXhdXG4gICAgICAgIGVsc2UgaWYgc2NvcGUgPT0gMVxuICAgICAgICAgICAgcmVzdWx0ID0gQG51bWJlcnNCeURvbWFpbltkb21haW5dW2luZGV4XVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXN1bHQgPSBAdGVtcE51bWJlcnNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIG51bWJlciB2YXJpYWJsZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG51bWJlclZhbHVlT2ZcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBUaGUgdmFyaWFibGUgdG8gZ2V0IHRoZSB2YWx1ZSBmcm9tLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbnVtYmVyIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgICAgIFxuICAgIG51bWJlclZhbHVlT2Y6IChvYmplY3QpIC0+XG4gICAgICAgIHJlc3VsdCA9IDBcbiAgICAgICAgaWYgb2JqZWN0PyBhbmQgb2JqZWN0LmluZGV4P1xuICAgICAgICAgICAgaWYgb2JqZWN0LnNjb3BlID09IDJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBAcGVyc2lzdGVudE51bWJlcnNbb2JqZWN0LmRvbWFpbl1bb2JqZWN0LmluZGV4XVxuICAgICAgICAgICAgZWxzZSBpZiBvYmplY3Quc2NvcGUgPT0gMVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBudW1iZXJzQnlEb21haW5bb2JqZWN0LmRvbWFpbl1bb2JqZWN0LmluZGV4XVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEB0ZW1wTnVtYmVyc1tvYmplY3QuaW5kZXhdXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzdWx0ID0gb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAwXG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgdmFsdWUgb2YgYSBzcGVjaWZpZWQgc3RyaW5nIHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RyaW5nVmFsdWVPZlxuICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIFRoZSB2YXJpYWJsZSB0byBnZXQgdGhlIHZhbHVlIGZyb20uXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHJpbmcgdmFsdWUgb2YgdGhlIHZhcmlhYmxlLlxuICAgICMjIyAgICAgICAgXG4gICAgc3RyaW5nVmFsdWVPZjogKG9iamVjdCkgLT5cbiAgICAgICAgcmVzdWx0ID0gXCJcIlxuICAgICAgICBpZiBvYmplY3Q/IGFuZCBvYmplY3QuaW5kZXg/XG4gICAgICAgICAgICBpZiBvYmplY3Quc2NvcGUgPT0gMlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBwZXJzaXN0ZW50U3RyaW5nc1tvYmplY3QuZG9tYWluXVtvYmplY3QuaW5kZXhdXG4gICAgICAgICAgICBlbHNlIGlmIG9iamVjdC5zY29wZSA9PSAxXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gQHN0cmluZ3NCeURvbWFpbltvYmplY3QuZG9tYWluXVtvYmplY3QuaW5kZXhdXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gQHRlbXBTdHJpbmdzW29iamVjdC5pbmRleF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzdWx0ID0gb2JqZWN0XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBcIlwiXG4gICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGEgc3RyaW5nIHZhcmlhYmxlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgKlxuICAgICogQG1ldGhvZCBzdHJpbmdWYWx1ZUF0SW5kZXhcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzY29wZSAtIFRoZSB2YXJpYWJsZSBzY29wZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIFRoZSB2YXJpYWJsZSdzIGluZGV4LlxuICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3RyaW5nIHZhbHVlIG9mIHRoZSB2YXJpYWJsZS5cbiAgICAjIyMgICAgICAgIFxuICAgIHN0cmluZ1ZhbHVlQXRJbmRleDogKHNjb3BlLCBpbmRleCwgZG9tYWluKSAtPlxuICAgICAgICByZXN1bHQgPSBcIlwiXG4gICAgICAgIFxuICAgICAgICBpZiBzY29wZSA9PSAyXG4gICAgICAgICAgICByZXN1bHQgPSBAcGVyc2lzdGVudFN0cmluZ3NbZG9tYWluXVtpbmRleF1cbiAgICAgICAgZWxzZSBpZiBzY29wZSA9PSAxXG4gICAgICAgICAgICByZXN1bHQgPSBAc3RyaW5nc0J5RG9tYWluW2RvbWFpbl1baW5kZXhdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3VsdCA9IEB0ZW1wU3RyaW5nc1tpbmRleF1cblxuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IFwiXCJcbiAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBib29sZWFuIHZhcmlhYmxlLlxuICAgICpcbiAgICAqIEBtZXRob2QgYm9vbGVhblZhbHVlT2ZcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBUaGUgdmFyaWFibGUgdG8gZ2V0IHRoZSB2YWx1ZSBmcm9tLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgYm9vbGVhbiB2YWx1ZSBvZiB0aGUgdmFyaWFibGUuXG4gICAgIyMjICAgICAgIFxuICAgIGJvb2xlYW5WYWx1ZU9mOiAob2JqZWN0KSAtPlxuICAgICAgICByZXN1bHQgPSBub1xuICAgICAgICBpZiBvYmplY3Q/IGFuZCBvYmplY3QuaW5kZXg/XG4gICAgICAgICAgICBpZiBvYmplY3Quc2NvcGUgPT0gMlxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBwZXJzaXN0ZW50Qm9vbGVhbnNbb2JqZWN0LmRvbWFpbl1bb2JqZWN0LmluZGV4XSB8fCBub1xuICAgICAgICAgICAgZWxzZSBpZiBvYmplY3Quc2NvcGUgPT0gMVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEBib29sZWFuc0J5RG9tYWluW29iamVjdC5kb21haW5dW29iamVjdC5pbmRleF0gfHwgbm9cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBAdGVtcEJvb2xlYW5zW29iamVjdC5pbmRleF0gfHwgbm9cblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXN1bHQgPSBpZiBvYmplY3QgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIHZhbHVlIG9mIGEgYm9vbGVhbiB2YXJpYWJsZSBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgICpcbiAgICAqIEBtZXRob2QgYm9vbGVhblZhbHVlQXRJbmRleFxuICAgICogQHBhcmFtIHtudW1iZXJ9IHNjb3BlIC0gVGhlIHZhcmlhYmxlIHNjb3BlLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gVGhlIHZhcmlhYmxlJ3MgaW5kZXguXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBUaGUgYm9vbGVhbiB2YWx1ZSBvZiB0aGUgdmFyaWFibGUuXG4gICAgIyMjICAgICAgICBcbiAgICBib29sZWFuVmFsdWVBdEluZGV4OiAoc2NvcGUsIGluZGV4LCBkb21haW4pIC0+XG4gICAgICAgIHJlc3VsdCA9IG5vXG4gICAgICAgIFxuICAgICAgICBpZiBzY29wZSA9PSAyXG4gICAgICAgICAgICByZXN1bHQgPSBAcGVyc2lzdGVuQm9vbGVhbnNbZG9tYWluXVtpbmRleF0gfHwgbm9cbiAgICAgICAgZWxzZSBpZiBzY29wZSA9PSAxXG4gICAgICAgICAgICByZXN1bHQgPSBAYm9vbGVhbnNCeURvbWFpbltkb21haW5dW2luZGV4XSB8fCBub1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXN1bHQgPSBAdGVtcEJvb2xlYW5zW2luZGV4XSB8fCBub1xuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgXG5ncy5WYXJpYWJsZVN0b3JlID0gVmFyaWFibGVTdG9yZSJdfQ==
//# sourceURL=VariableStore_82.js