var RecordManager;

RecordManager = (function() {

  /**
  * Manages the game's database and gives access to all data-records.
  *
  * @module gs
  * @class RecordManager
  * @memberof gs
  * @constructor
   */
  function RecordManager() {

    /**
    * Stores all data-record documents
    * @property documents
    * @type gs.Document[]
     */
    this.documents = null;

    /**
    * Stores all data-record documents by category > id.
    * @property collectionDocuments
    * @type gs.Document[][]
     */
    this.collectionDocuments = [];

    /**
    * Localizable strings of all data-record documents.
    * @property localizableStrings
    * @type Object
     */
    this.localizableStrings = {};

    /**
    * Indicates if all data-records are already translated.
    * @property translated
    * @type boolean
     */
    this.translated = false;

    /**
    * Indicates if all data-records are loaded and initialized.
    * @property initialized
    * @type boolean
     */
    this.initialized = false;
  }


  /**
  * Loads all data-record documents.
  *
  * @method load
   */

  RecordManager.prototype.load = function() {
    return this.documents = DataManager.getDocumentsByType("data_record");
  };


  /**
  * Initializes RecordManager and all loaded data-record documents for use. Needs to be
  * called before RecordManager can be used.
  *
  * @method initialize
   */

  RecordManager.prototype.initialize = function() {
    var color, document, i, iconSets, j, k, len, len1, ref, ref1;
    iconSets = [];
    ref = this.documents;
    for (j = 0, len = ref.length; j < len; j++) {
      document = ref[j];
      if (this[document.items.category] == null) {
        this[document.items.category] = [];
        this[document.items.category + "Collection"] = [];
        this[document.items.category + "Array"] = [];
        this.collectionDocuments.push(this[document.items.category + "Collection"]);
      }
      if (document.items.id != null) {
        this[document.items.category][document.items.id] = document.items.data;
        this[document.items.category].push(document.items.data);
        this[document.items.category + "Collection"][document.items.id] = document;
        this[document.items.category + "Collection"].push(document);
        this[document.items.category + "Array"].push(document.items.data);
        document.items.data.index = document.items.id;
      }
      if ((document.items.data != null) && (document.items.data.icon != null)) {
        if (iconSets.indexOf(document.items.data.icon.name) === -1) {
          iconSets.push(document.items.data.icon.name);
        }
      }
      if (document.items.localizableStrings != null) {
        Object.mixin(this.localizableStrings, document.items.localizableStrings);
      }
    }
    this.system = this.system[0];
    this.system.iconSets = iconSets;
    if (this.system.colors) {
      ref1 = this.system.colors;
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        color = ref1[i];
        this.system.colors[i] = new Color(color);
      }
    }
    return this.initialized = true;
  };


  /**
  * Translates all localizable fields for each data-record.
  *
  * @method translate
   */

  RecordManager.prototype.translate = function() {
    var document, j, len, ref, results;
    if (!this.translated) {
      this.translated = true;
      ref = this.documents;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        document = ref[j];
        if ((document.items.data.name != null) && (document.items.data.name.lcId != null)) {
          document.items.data.name = lcs(document.items.data.name);
        }
        if ((document.items.data.description != null) && (document.items.data.description.lcId != null)) {
          document.items.data.description = lcs(document.items.data.description);
        }
        if ((document.items.data.removeMessage != null) && (document.items.data.removeMessage.lcId != null)) {
          document.items.data.removeMessage = lcs(document.items.data.removeMessage);
        }
        if ((document.items.data.usingMessage != null) && (document.items.data.usingMessage.lcId != null)) {
          results.push(document.items.data.usingMessage = lcs(document.items.data.usingMessage));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  return RecordManager;

})();

window.RecordManager = new RecordManager();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O0VBUWEsdUJBQUE7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsbUJBQUQsR0FBdUI7O0FBRXZCOzs7OztJQUtBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjs7QUFFdEI7Ozs7O0lBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYzs7QUFFZDs7Ozs7SUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlO0VBbENOOzs7QUFvQ2I7Ozs7OzswQkFLQSxJQUFBLEdBQU0sU0FBQTtXQUNGLElBQUMsQ0FBQSxTQUFELEdBQWEsV0FBVyxDQUFDLGtCQUFaLENBQStCLGFBQS9CO0VBRFg7OztBQUdOOzs7Ozs7OzBCQU1BLFVBQUEsR0FBWSxTQUFBO0FBQ1IsUUFBQTtJQUFBLFFBQUEsR0FBVztBQUNYO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFPLHFDQUFQO1FBQ0ksSUFBSyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBZixDQUFMLEdBQWdDO1FBQ2hDLElBQUssQ0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQWYsR0FBMEIsWUFBMUIsQ0FBTCxHQUErQztRQUMvQyxJQUFLLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFmLEdBQTBCLE9BQTFCLENBQUwsR0FBMEM7UUFDMUMsSUFBQyxDQUFBLG1CQUFtQixDQUFDLElBQXJCLENBQTBCLElBQUssQ0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQWYsR0FBMEIsWUFBMUIsQ0FBL0IsRUFKSjs7TUFLQSxJQUFHLHlCQUFIO1FBQ0ksSUFBSyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBZixDQUF5QixDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBZixDQUE5QixHQUFtRCxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ2xFLElBQUssQ0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQWYsQ0FBd0IsQ0FBQyxJQUE5QixDQUFtQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWxEO1FBQ0EsSUFBSyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBZixHQUEwQixZQUExQixDQUF3QyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBZixDQUE3QyxHQUFrRTtRQUNsRSxJQUFLLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFmLEdBQTBCLFlBQTFCLENBQXVDLENBQUMsSUFBN0MsQ0FBa0QsUUFBbEQ7UUFDQSxJQUFLLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFmLEdBQTBCLE9BQTFCLENBQWtDLENBQUMsSUFBeEMsQ0FBNkMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUE1RDtRQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQXBCLEdBQTRCLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FOL0M7O01BT0EsSUFBRyw2QkFBQSxJQUF5QixrQ0FBNUI7UUFDSSxJQUFHLFFBQVEsQ0FBQyxPQUFULENBQWlCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUExQyxDQUFBLEtBQW1ELENBQUMsQ0FBdkQ7VUFDSSxRQUFRLENBQUMsSUFBVCxDQUFjLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUF2QyxFQURKO1NBREo7O01BSUEsSUFBRyx5Q0FBSDtRQUNJLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBQyxDQUFBLGtCQUFkLEVBQWtDLFFBQVEsQ0FBQyxLQUFLLENBQUMsa0JBQWpELEVBREo7O0FBakJKO0lBb0JBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBO0lBQ2xCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQjtJQUVuQixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBWDtBQUNJO0FBQUEsV0FBQSxnREFBQTs7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQWYsR0FBd0IsSUFBQSxLQUFBLENBQU0sS0FBTjtBQUQ1QixPQURKOztXQUtBLElBQUMsQ0FBQSxXQUFELEdBQWU7RUE5QlA7OztBQWdDWjs7Ozs7OzBCQUtBLFNBQUEsR0FBVyxTQUFBO0FBQ1AsUUFBQTtJQUFBLElBQUcsQ0FBSSxJQUFDLENBQUEsVUFBUjtNQUNJLElBQUMsQ0FBQSxVQUFELEdBQWM7QUFDZDtBQUFBO1dBQUEscUNBQUE7O1FBQ0ksSUFBRyxrQ0FBQSxJQUE4Qix1Q0FBakM7VUFDSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFwQixHQUEyQixHQUFBLENBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBeEIsRUFEL0I7O1FBRUEsSUFBRyx5Q0FBQSxJQUFxQyw4Q0FBeEM7VUFDSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFwQixHQUFrQyxHQUFBLENBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBeEIsRUFEdEM7O1FBRUEsSUFBRywyQ0FBQSxJQUF1QyxnREFBMUM7VUFDSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFwQixHQUFvQyxHQUFBLENBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBeEIsRUFEeEM7O1FBRUEsSUFBRywwQ0FBQSxJQUFzQywrQ0FBekM7dUJBQ0ksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBcEIsR0FBbUMsR0FBQSxDQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQXhCLEdBRHZDO1NBQUEsTUFBQTsrQkFBQTs7QUFQSjtxQkFGSjs7RUFETzs7Ozs7O0FBY2YsTUFBTSxDQUFDLGFBQVAsR0FBMkIsSUFBQSxhQUFBLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IFJlY29yZE1hbmFnZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFJlY29yZE1hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBNYW5hZ2VzIHRoZSBnYW1lJ3MgZGF0YWJhc2UgYW5kIGdpdmVzIGFjY2VzcyB0byBhbGwgZGF0YS1yZWNvcmRzLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBSZWNvcmRNYW5hZ2VyXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIGFsbCBkYXRhLXJlY29yZCBkb2N1bWVudHNcbiAgICAgICAgKiBAcHJvcGVydHkgZG9jdW1lbnRzXG4gICAgICAgICogQHR5cGUgZ3MuRG9jdW1lbnRbXVxuICAgICAgICAjIyMgXG4gICAgICAgIEBkb2N1bWVudHMgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIGFsbCBkYXRhLXJlY29yZCBkb2N1bWVudHMgYnkgY2F0ZWdvcnkgPiBpZC5cbiAgICAgICAgKiBAcHJvcGVydHkgY29sbGVjdGlvbkRvY3VtZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkRvY3VtZW50W11bXVxuICAgICAgICAjIyMgXG4gICAgICAgIEBjb2xsZWN0aW9uRG9jdW1lbnRzID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBMb2NhbGl6YWJsZSBzdHJpbmdzIG9mIGFsbCBkYXRhLXJlY29yZCBkb2N1bWVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGxvY2FsaXphYmxlU3RyaW5nc1xuICAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICAjIyMgXG4gICAgICAgIEBsb2NhbGl6YWJsZVN0cmluZ3MgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiBhbGwgZGF0YS1yZWNvcmRzIGFyZSBhbHJlYWR5IHRyYW5zbGF0ZWQuXG4gICAgICAgICogQHByb3BlcnR5IHRyYW5zbGF0ZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICMjIyBcbiAgICAgICAgQHRyYW5zbGF0ZWQgPSBub1xuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljYXRlcyBpZiBhbGwgZGF0YS1yZWNvcmRzIGFyZSBsb2FkZWQgYW5kIGluaXRpYWxpemVkLlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbml0aWFsaXplZFxuICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgIyMjIFxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSBub1xuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyBhbGwgZGF0YS1yZWNvcmQgZG9jdW1lbnRzLlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZFxuICAgICMjIyAgXG4gICAgbG9hZDogLT5cbiAgICAgICAgQGRvY3VtZW50cyA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50c0J5VHlwZShcImRhdGFfcmVjb3JkXCIpXG5cbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyBSZWNvcmRNYW5hZ2VyIGFuZCBhbGwgbG9hZGVkIGRhdGEtcmVjb3JkIGRvY3VtZW50cyBmb3IgdXNlLiBOZWVkcyB0byBiZVxuICAgICogY2FsbGVkIGJlZm9yZSBSZWNvcmRNYW5hZ2VyIGNhbiBiZSB1c2VkLlxuICAgICpcbiAgICAqIEBtZXRob2QgaW5pdGlhbGl6ZVxuICAgICMjIyAgXG4gICAgaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgaWNvblNldHMgPSBbXVxuICAgICAgICBmb3IgZG9jdW1lbnQgaW4gQGRvY3VtZW50c1xuICAgICAgICAgICAgaWYgbm90IHRoaXNbZG9jdW1lbnQuaXRlbXMuY2F0ZWdvcnldP1xuICAgICAgICAgICAgICAgIHRoaXNbZG9jdW1lbnQuaXRlbXMuY2F0ZWdvcnldID0gW11cbiAgICAgICAgICAgICAgICB0aGlzW2RvY3VtZW50Lml0ZW1zLmNhdGVnb3J5ICsgXCJDb2xsZWN0aW9uXCJdID0gW11cbiAgICAgICAgICAgICAgICB0aGlzW2RvY3VtZW50Lml0ZW1zLmNhdGVnb3J5ICsgXCJBcnJheVwiXSA9IFtdXG4gICAgICAgICAgICAgICAgQGNvbGxlY3Rpb25Eb2N1bWVudHMucHVzaCh0aGlzW2RvY3VtZW50Lml0ZW1zLmNhdGVnb3J5ICsgXCJDb2xsZWN0aW9uXCJdKVxuICAgICAgICAgICAgaWYgZG9jdW1lbnQuaXRlbXMuaWQ/XG4gICAgICAgICAgICAgICAgdGhpc1tkb2N1bWVudC5pdGVtcy5jYXRlZ29yeV1bZG9jdW1lbnQuaXRlbXMuaWRdID0gZG9jdW1lbnQuaXRlbXMuZGF0YVxuICAgICAgICAgICAgICAgIHRoaXNbZG9jdW1lbnQuaXRlbXMuY2F0ZWdvcnldLnB1c2goZG9jdW1lbnQuaXRlbXMuZGF0YSlcbiAgICAgICAgICAgICAgICB0aGlzW2RvY3VtZW50Lml0ZW1zLmNhdGVnb3J5ICsgXCJDb2xsZWN0aW9uXCJdW2RvY3VtZW50Lml0ZW1zLmlkXSA9IGRvY3VtZW50XG4gICAgICAgICAgICAgICAgdGhpc1tkb2N1bWVudC5pdGVtcy5jYXRlZ29yeSArIFwiQ29sbGVjdGlvblwiXS5wdXNoKGRvY3VtZW50KVxuICAgICAgICAgICAgICAgIHRoaXNbZG9jdW1lbnQuaXRlbXMuY2F0ZWdvcnkgKyBcIkFycmF5XCJdLnB1c2goZG9jdW1lbnQuaXRlbXMuZGF0YSlcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5pdGVtcy5kYXRhLmluZGV4ID0gZG9jdW1lbnQuaXRlbXMuaWRcbiAgICAgICAgICAgIGlmIGRvY3VtZW50Lml0ZW1zLmRhdGE/IGFuZCBkb2N1bWVudC5pdGVtcy5kYXRhLmljb24/XG4gICAgICAgICAgICAgICAgaWYgaWNvblNldHMuaW5kZXhPZihkb2N1bWVudC5pdGVtcy5kYXRhLmljb24ubmFtZSkgPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgaWNvblNldHMucHVzaChkb2N1bWVudC5pdGVtcy5kYXRhLmljb24ubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBkb2N1bWVudC5pdGVtcy5sb2NhbGl6YWJsZVN0cmluZ3M/XG4gICAgICAgICAgICAgICAgT2JqZWN0Lm1peGluKEBsb2NhbGl6YWJsZVN0cmluZ3MsIGRvY3VtZW50Lml0ZW1zLmxvY2FsaXphYmxlU3RyaW5ncylcbiAgICAgICAgICAgIFxuICAgICAgICBAc3lzdGVtID0gQHN5c3RlbVswXVxuICAgICAgICBAc3lzdGVtLmljb25TZXRzID0gaWNvblNldHNcbiAgICAgICAgXG4gICAgICAgIGlmIEBzeXN0ZW0uY29sb3JzXG4gICAgICAgICAgICBmb3IgY29sb3IsIGkgaW4gQHN5c3RlbS5jb2xvcnNcbiAgICAgICAgICAgICAgICBAc3lzdGVtLmNvbG9yc1tpXSA9IG5ldyBDb2xvcihjb2xvcilcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBAaW5pdGlhbGl6ZWQgPSB5ZXNcbiAgICBcbiAgICAjIyMqXG4gICAgKiBUcmFuc2xhdGVzIGFsbCBsb2NhbGl6YWJsZSBmaWVsZHMgZm9yIGVhY2ggZGF0YS1yZWNvcmQuXG4gICAgKlxuICAgICogQG1ldGhvZCB0cmFuc2xhdGVcbiAgICAjIyMgICAgICBcbiAgICB0cmFuc2xhdGU6IC0+XG4gICAgICAgIGlmIG5vdCBAdHJhbnNsYXRlZFxuICAgICAgICAgICAgQHRyYW5zbGF0ZWQgPSB5ZXNcbiAgICAgICAgICAgIGZvciBkb2N1bWVudCBpbiBAZG9jdW1lbnRzXG4gICAgICAgICAgICAgICAgaWYgZG9jdW1lbnQuaXRlbXMuZGF0YS5uYW1lPyBhbmQgZG9jdW1lbnQuaXRlbXMuZGF0YS5uYW1lLmxjSWQ/XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lml0ZW1zLmRhdGEubmFtZSA9IGxjcyhkb2N1bWVudC5pdGVtcy5kYXRhLm5hbWUpXG4gICAgICAgICAgICAgICAgaWYgZG9jdW1lbnQuaXRlbXMuZGF0YS5kZXNjcmlwdGlvbj8gYW5kIGRvY3VtZW50Lml0ZW1zLmRhdGEuZGVzY3JpcHRpb24ubGNJZD9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuaXRlbXMuZGF0YS5kZXNjcmlwdGlvbiA9IGxjcyhkb2N1bWVudC5pdGVtcy5kYXRhLmRlc2NyaXB0aW9uKVxuICAgICAgICAgICAgICAgIGlmIGRvY3VtZW50Lml0ZW1zLmRhdGEucmVtb3ZlTWVzc2FnZT8gYW5kIGRvY3VtZW50Lml0ZW1zLmRhdGEucmVtb3ZlTWVzc2FnZS5sY0lkP1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5pdGVtcy5kYXRhLnJlbW92ZU1lc3NhZ2UgPSBsY3MoZG9jdW1lbnQuaXRlbXMuZGF0YS5yZW1vdmVNZXNzYWdlKVxuICAgICAgICAgICAgICAgIGlmIGRvY3VtZW50Lml0ZW1zLmRhdGEudXNpbmdNZXNzYWdlPyBhbmQgZG9jdW1lbnQuaXRlbXMuZGF0YS51c2luZ01lc3NhZ2UubGNJZD9cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuaXRlbXMuZGF0YS51c2luZ01lc3NhZ2UgPSBsY3MoZG9jdW1lbnQuaXRlbXMuZGF0YS51c2luZ01lc3NhZ2UpXG4gICAgICBcblxud2luZG93LlJlY29yZE1hbmFnZXIgPSBuZXcgUmVjb3JkTWFuYWdlcigpIl19
//# sourceURL=RecordManager_93.js