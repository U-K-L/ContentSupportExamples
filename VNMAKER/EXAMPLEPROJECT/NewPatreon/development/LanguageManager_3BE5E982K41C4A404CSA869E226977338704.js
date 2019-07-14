var LanguageManager;

LanguageManager = (function() {

  /**
  * Manages the different languages of the game.  
  *
  * @module gs
  * @class LanguageManager
  * @memberof gs
  * @constructor
   */
  function LanguageManager() {

    /**
    * The default language profile.
    * @property defaultProfile
    * @type gs.LanguageProfile
     */
    this.defaultProfile = null;

    /**
    * The current language profile.
    * @property profile
    * @type gs.LanguageProfile
     */
    this.profile = null;

    /**
    * The current strings bundle.
    * @property bundle
    * @type gs.LanguageStringsBundle
     */
    this.bundle = null;

    /**
    * The default strings bundle.
    * @property defaultBundle
    * @type gs.LanguageStringsBundle
     */
    this.defaultBundle = null;
  }


  /**
  * Initializes the language system by loading the necessary language profiles
  * and strings bundles.
  *
  * @method initialize
   */

  LanguageManager.prototype.initialize = function() {
    var document, documents, i, len, ref;
    this.languages = [];
    DataManager.getDocumentByType("custom_strings_bundle");
    documents = DataManager.getDocumentsByType("language_profile");
    for (i = 0, len = documents.length; i < len; i++) {
      document = documents[i];
      this.languages.push({
        name: document.items.name,
        code: document.items.code,
        uid: document.uid,
        icon: document.items.icon,
        bundleUid: document.items.bundleUid,
        wordWrap: (ref = document.items.wordWrap) != null ? ref : "spaceBased"
      });
      if (document.uid === "07DDA0716161F104") {
        this.language = this.languages[this.languages.length - 1];
        this.defaultLanguage = this.language;
      }
    }
    this.selectLanguage(this.language);
    if (this.language.uid !== this.defaultLanguage.uid) {
      return this.defaultProfile = DataManager.getDocument(this.defaultLanguage.uid);
    } else {
      return this.defaultProfile = this.profile;
    }
  };


  /**
  * Loads the necessary strings bundles for the current language. 
  *
  * @method loadBundles
   */

  LanguageManager.prototype.loadBundles = function() {
    var customStrings;
    customStrings = DataManager.getDocumentByType("custom_strings_bundle");
    if (this.language.uid !== this.defaultLanguage.uid) {
      this.bundle = DataManager.getDocument(this.language.bundleUid);
    }
    this.defaultBundle = {
      items: {
        localizableStrings: RecordManager.localizableStrings
      }
    };
    Object.mixin(this.defaultBundle.items.localizableStrings, customStrings.items.localizableStrings);
    return this.language.uid !== this.defaultLanguage.uid;
  };


  /**
  * Sets the specified language as current language.
  *
  * @method selectLanguage
  * @param {Object} language - The language to set.
   */

  LanguageManager.prototype.selectLanguage = function(language) {
    this.language = language;
    return this.profile = DataManager.getDocument(this.language.uid);
  };


  /**
  * Gets the string for the specified id. If the string doesn't exist for current
  * language, its taken from the default language.
  *
  * @method string
  * @param {String} id - The ID of the string to get.
  * @return {String} The string for the specified ID. If the string could not be found the result
  * is an empty string.
   */

  LanguageManager.prototype.string = function(id) {
    var result;
    result = null;
    if ((this.bundle != null) && (this.bundle.items != null)) {
      result = this.bundle.items.localizableStrings[id];
      if ((result != null ? result.t : void 0) != null) {
        result = result.t;
      }
    }
    if ((result == null) || result.length === 0) {
      result = this.stringFromDefault(id);
    }
    return result;
  };


  /**
  * Gets the string for the specified id in default language.
  *
  * @method stringFromDefault
  * @param {String} id - The ID of the string to get.
  * @return {String} The string for the specified ID. If the string could not be found the result
  * is an empty string.
   */

  LanguageManager.prototype.stringFromDefault = function(id) {
    var ref, result;
    result = null;
    if ((this.defaultBundle != null) && (this.defaultBundle.items != null)) {
      result = (ref = this.defaultBundle.items.localizableStrings[id]) != null ? ref.t : void 0;
    }
    return result;
  };

  return LanguageManager;

})();

window.LanguageManager = new LanguageManager();

gs.LanguageManager = LanguageManager;

window.lcsi = function(id) {
  if (id != null) {
    return window.LanguageManager.string(id) || "";
  } else {
    return "";
  }
};

window.lcs = function(value) {
  var ref;
  if ((value != null) && (value.lcId != null)) {
    return window.LanguageManager.string(value.lcId) || (value != null ? (ref = value.defaultText) != null ? ref.t : void 0 : void 0) || (value != null ? value.defaultText : void 0);
  } else {
    return value;
  }
};

window.lcsm = function(value) {
  return lcs(value);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O0VBUWEseUJBQUE7O0FBQ1Q7Ozs7O0lBS0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7O0FBRWxCOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBVTs7QUFFVjs7Ozs7SUFLQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtFQTNCUjs7O0FBNkJiOzs7Ozs7OzRCQU1BLFVBQUEsR0FBWSxTQUFBO0FBQ1IsUUFBQTtJQUFBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixXQUFXLENBQUMsaUJBQVosQ0FBOEIsdUJBQTlCO0lBQ0EsU0FBQSxHQUFZLFdBQVcsQ0FBQyxrQkFBWixDQUErQixrQkFBL0I7QUFFWixTQUFBLDJDQUFBOztNQUNJLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQjtRQUFFLElBQUEsRUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQXZCO1FBQTZCLElBQUEsRUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWxEO1FBQXdELEdBQUEsRUFBSyxRQUFRLENBQUMsR0FBdEU7UUFBMkUsSUFBQSxFQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBaEc7UUFBc0csU0FBQSxFQUFXLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBaEk7UUFBMkksUUFBQSxrREFBb0MsWUFBL0s7T0FBaEI7TUFDQSxJQUFHLFFBQVEsQ0FBQyxHQUFULEtBQWdCLGtCQUFuQjtRQUNJLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBa0IsQ0FBbEI7UUFDdkIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLFNBRnhCOztBQUZKO0lBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFB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WyIjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiNcbiMgICBTY3JpcHQ6IExhbmd1YWdlTWFuYWdlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgTGFuZ3VhZ2VNYW5hZ2VyXG4gICAgIyMjKlxuICAgICogTWFuYWdlcyB0aGUgZGlmZmVyZW50IGxhbmd1YWdlcyBvZiB0aGUgZ2FtZS4gIFxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBMYW5ndWFnZU1hbmFnZXJcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgZGVmYXVsdCBsYW5ndWFnZSBwcm9maWxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBkZWZhdWx0UHJvZmlsZVxuICAgICAgICAqIEB0eXBlIGdzLkxhbmd1YWdlUHJvZmlsZVxuICAgICAgICAjIyMgXG4gICAgICAgIEBkZWZhdWx0UHJvZmlsZSA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgY3VycmVudCBsYW5ndWFnZSBwcm9maWxlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwcm9maWxlXG4gICAgICAgICogQHR5cGUgZ3MuTGFuZ3VhZ2VQcm9maWxlXG4gICAgICAgICMjIyBcbiAgICAgICAgQHByb2ZpbGUgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGN1cnJlbnQgc3RyaW5ncyBidW5kbGUuXG4gICAgICAgICogQHByb3BlcnR5IGJ1bmRsZVxuICAgICAgICAqIEB0eXBlIGdzLkxhbmd1YWdlU3RyaW5nc0J1bmRsZVxuICAgICAgICAjIyMgXG4gICAgICAgIEBidW5kbGUgPSBudWxsXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIGRlZmF1bHQgc3RyaW5ncyBidW5kbGUuXG4gICAgICAgICogQHByb3BlcnR5IGRlZmF1bHRCdW5kbGVcbiAgICAgICAgKiBAdHlwZSBncy5MYW5ndWFnZVN0cmluZ3NCdW5kbGVcbiAgICAgICAgIyMjIFxuICAgICAgICBAZGVmYXVsdEJ1bmRsZSA9IG51bGxcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIGxhbmd1YWdlIHN5c3RlbSBieSBsb2FkaW5nIHRoZSBuZWNlc3NhcnkgbGFuZ3VhZ2UgcHJvZmlsZXNcbiAgICAqIGFuZCBzdHJpbmdzIGJ1bmRsZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBpbml0aWFsaXplXG4gICAgIyMjXG4gICAgaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgQGxhbmd1YWdlcyA9IFtdXG4gICAgICAgIERhdGFNYW5hZ2VyLmdldERvY3VtZW50QnlUeXBlKFwiY3VzdG9tX3N0cmluZ3NfYnVuZGxlXCIpXG4gICAgICAgIGRvY3VtZW50cyA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50c0J5VHlwZShcImxhbmd1YWdlX3Byb2ZpbGVcIilcbiAgICAgICAgXG4gICAgICAgIGZvciBkb2N1bWVudCBpbiBkb2N1bWVudHNcbiAgICAgICAgICAgIEBsYW5ndWFnZXMucHVzaCh7IG5hbWU6IGRvY3VtZW50Lml0ZW1zLm5hbWUsIGNvZGU6IGRvY3VtZW50Lml0ZW1zLmNvZGUsIHVpZDogZG9jdW1lbnQudWlkLCBpY29uOiBkb2N1bWVudC5pdGVtcy5pY29uLCBidW5kbGVVaWQ6IGRvY3VtZW50Lml0ZW1zLmJ1bmRsZVVpZCwgd29yZFdyYXA6IGRvY3VtZW50Lml0ZW1zLndvcmRXcmFwID8gXCJzcGFjZUJhc2VkXCIgfSlcbiAgICAgICAgICAgIGlmIGRvY3VtZW50LnVpZCA9PSBcIjA3RERBMDcxNjE2MUYxMDRcIiAjIERlZmF1bHQgUHJvZmlsZVxuICAgICAgICAgICAgICAgIEBsYW5ndWFnZSA9IEBsYW5ndWFnZXNbQGxhbmd1YWdlcy5sZW5ndGgtMV1cbiAgICAgICAgICAgICAgICBAZGVmYXVsdExhbmd1YWdlID0gQGxhbmd1YWdlXG4gICAgICAgICAgIFxuICAgICAgICBAc2VsZWN0TGFuZ3VhZ2UoQGxhbmd1YWdlKSAgICAgXG4gICAgICAgIGlmIEBsYW5ndWFnZS51aWQgIT0gQGRlZmF1bHRMYW5ndWFnZS51aWRcbiAgICAgICAgICAgIEBkZWZhdWx0UHJvZmlsZSA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KEBkZWZhdWx0TGFuZ3VhZ2UudWlkKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGVmYXVsdFByb2ZpbGUgPSBAcHJvZmlsZVxuICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIHRoZSBuZWNlc3Nhcnkgc3RyaW5ncyBidW5kbGVzIGZvciB0aGUgY3VycmVudCBsYW5ndWFnZS4gXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkQnVuZGxlc1xuICAgICMjIyAgICAgICAgXG4gICAgbG9hZEJ1bmRsZXM6IC0+XG4gICAgICAgIGN1c3RvbVN0cmluZ3MgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudEJ5VHlwZShcImN1c3RvbV9zdHJpbmdzX2J1bmRsZVwiKVxuICAgICAgICBpZiBAbGFuZ3VhZ2UudWlkICE9IEBkZWZhdWx0TGFuZ3VhZ2UudWlkXG4gICAgICAgICAgICBAYnVuZGxlID0gRGF0YU1hbmFnZXIuZ2V0RG9jdW1lbnQoQGxhbmd1YWdlLmJ1bmRsZVVpZClcbiAgICAgIFxuICAgICAgICBAZGVmYXVsdEJ1bmRsZSA9IHsgaXRlbXM6IHsgbG9jYWxpemFibGVTdHJpbmdzOiBSZWNvcmRNYW5hZ2VyLmxvY2FsaXphYmxlU3RyaW5ncyB9IH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgT2JqZWN0Lm1peGluKEBkZWZhdWx0QnVuZGxlLml0ZW1zLmxvY2FsaXphYmxlU3RyaW5ncywgY3VzdG9tU3RyaW5ncy5pdGVtcy5sb2NhbGl6YWJsZVN0cmluZ3MpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gQGxhbmd1YWdlLnVpZCAhPSBAZGVmYXVsdExhbmd1YWdlLnVpZFxuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHNwZWNpZmllZCBsYW5ndWFnZSBhcyBjdXJyZW50IGxhbmd1YWdlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2VsZWN0TGFuZ3VhZ2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBsYW5ndWFnZSAtIFRoZSBsYW5ndWFnZSB0byBzZXQuXG4gICAgIyMjICAgICAgXG4gICAgc2VsZWN0TGFuZ3VhZ2U6IChsYW5ndWFnZSkgLT5cbiAgICAgICAgQGxhbmd1YWdlID0gbGFuZ3VhZ2VcbiAgICAgICAgQHByb2ZpbGUgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChAbGFuZ3VhZ2UudWlkKVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIHRoZSBzdHJpbmcgZm9yIHRoZSBzcGVjaWZpZWQgaWQuIElmIHRoZSBzdHJpbmcgZG9lc24ndCBleGlzdCBmb3IgY3VycmVudFxuICAgICogbGFuZ3VhZ2UsIGl0cyB0YWtlbiBmcm9tIHRoZSBkZWZhdWx0IGxhbmd1YWdlLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RyaW5nXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgSUQgb2YgdGhlIHN0cmluZyB0byBnZXQuXG4gICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBzdHJpbmcgZm9yIHRoZSBzcGVjaWZpZWQgSUQuIElmIHRoZSBzdHJpbmcgY291bGQgbm90IGJlIGZvdW5kIHRoZSByZXN1bHRcbiAgICAqIGlzIGFuIGVtcHR5IHN0cmluZy5cbiAgICAjIyMgICAgIFxuICAgIHN0cmluZzogKGlkKSAtPiBcbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuXG4gICAgICAgIGlmIEBidW5kbGU/IGFuZCBAYnVuZGxlLml0ZW1zP1xuICAgICAgICAgICAgcmVzdWx0ID0gQGJ1bmRsZS5pdGVtcy5sb2NhbGl6YWJsZVN0cmluZ3NbaWRdXG4gICAgICAgICAgICBpZiByZXN1bHQ/LnQ/XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnRcblxuICAgICAgICBpZiBub3QgcmVzdWx0PyBvciByZXN1bHQubGVuZ3RoID09IDBcbiAgICAgICAgICAgIHJlc3VsdCA9IEBzdHJpbmdGcm9tRGVmYXVsdChpZClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgXG4gICAgIyMjKlxuICAgICogR2V0cyB0aGUgc3RyaW5nIGZvciB0aGUgc3BlY2lmaWVkIGlkIGluIGRlZmF1bHQgbGFuZ3VhZ2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdHJpbmdGcm9tRGVmYXVsdFxuICAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIElEIG9mIHRoZSBzdHJpbmcgdG8gZ2V0LlxuICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgc3RyaW5nIGZvciB0aGUgc3BlY2lmaWVkIElELiBJZiB0aGUgc3RyaW5nIGNvdWxkIG5vdCBiZSBmb3VuZCB0aGUgcmVzdWx0XG4gICAgKiBpcyBhbiBlbXB0eSBzdHJpbmcuXG4gICAgIyMjICAgICAgXG4gICAgc3RyaW5nRnJvbURlZmF1bHQ6IChpZCkgLT5cbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgaWYgQGRlZmF1bHRCdW5kbGU/IGFuZCBAZGVmYXVsdEJ1bmRsZS5pdGVtcz9cbiAgICAgICAgICAgIHJlc3VsdCA9IEBkZWZhdWx0QnVuZGxlLml0ZW1zLmxvY2FsaXphYmxlU3RyaW5nc1tpZF0/LnRcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gXG53aW5kb3cuTGFuZ3VhZ2VNYW5hZ2VyID0gbmV3IExhbmd1YWdlTWFuYWdlcigpXG5ncy5MYW5ndWFnZU1hbmFnZXIgPSBMYW5ndWFnZU1hbmFnZXJcblxud2luZG93Lmxjc2kgPSAoaWQpIC0+IGlmIGlkPyB0aGVuIHdpbmRvdy5MYW5ndWFnZU1hbmFnZXIuc3RyaW5nKGlkKSB8fCBcIlwiIGVsc2UgXCJcIlxud2luZG93LmxjcyA9ICh2YWx1ZSkgLT4gcmV0dXJuIGlmICh2YWx1ZT8gYW5kIHZhbHVlLmxjSWQ/KSB0aGVuIHdpbmRvdy5MYW5ndWFnZU1hbmFnZXIuc3RyaW5nKHZhbHVlLmxjSWQpIHx8IHZhbHVlPy5kZWZhdWx0VGV4dD8udCB8fCB2YWx1ZT8uZGVmYXVsdFRleHQgZWxzZSB2YWx1ZVxud2luZG93Lmxjc20gPSAodmFsdWUpIC0+IHJldHVybiBsY3ModmFsdWUpICNyZXR1cm4gaWYgdmFsdWUubGNJZD8gdGhlbiB3aW5kb3cuTGFuZ3VhZ2VNYW5hZ2VyLnN0cmluZ0Zyb21CdW5kbGUodmFsdWUubGNJZCwgd2luZG93Lkxhbmd1YWdlTWFuYWdlci5tYXBCdW5kbGUpIHx8IHZhbHVlLmRlZmF1bHRUZXh0IGVsc2UgdmFsdWVcbiJdfQ==
//# sourceURL=LanguageManager_48.js