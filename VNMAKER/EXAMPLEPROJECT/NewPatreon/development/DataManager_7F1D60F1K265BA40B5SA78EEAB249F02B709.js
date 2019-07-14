var DataManager;

DataManager = (function() {

  /**
  * Manages the game's data like loading documents. Documents are stored
  * in the data folder of the game in JSON format. The UID is used as the file-name.
  * A document has the following structure:<br>
  * <br>
  * UID - Unique Identifier<br>
  * Items -> An object containing all the items/fields of the document.<br>
  * Items.Type -> The type of the document<br>
  * Items.Name -> The name of the document<br>
  * <br>
  * @module gs
  * @class DataManager
  * @memberof gs
  * @constructor
   */
  function DataManager() {

    /**
    * Stores all documents by UID.
    * @property documentsByUid
    * @type gs.Document[]
     */
    this.documentsByUid = {};

    /**
    * Stores all documents.
    * @property documents
    * @type gs.Document[]
     */
    this.documents = [];

    /**
    * Indiciates if all requested documents are loaded.
    * @property documentsLoaded
    * @type boolean
     */
    this.documentsLoaded = true;

    /**
    * @property events
    * @type gs.EventEmitter
     */
    this.events = new gs.EventEmitter();
  }


  /**
  * Unloads all documents with a specified type.
  *
  * @method disposeDocumentsByType
  * @param {String} type - The document type.
   */

  DataManager.prototype.disposeDocumentsByType = function(type) {
    var d, i;
    i = 0;
    while (i < this.documents.length) {
      d = this.documents[i];
      if (d && d.items && d.items.type === type) {
        this.documents.remove(d);
        this.documentsByUid[d.uid] = null;
        GS.dataCache[d.uid] = null;
        delete this.documentsByUid[d.uid];
        delete GS.dataCache[d.uid];
        i--;
      }
      i++;
    }
    return null;
  };


  /**
  * Gets all documents with a specified type.
  *
  * @method getDocumentsByType
  * @param {String} type - The document type.
  * @return {gs.Document[]} The documents.
   */

  DataManager.prototype.getDocumentsByType = function(type) {
    var result, summary, uid;
    result = [];
    for (uid in this.summaries.items) {
      summary = this.summaries.items[uid];
      if ((summary.items != null) && summary.items.type === type) {
        result.push(this.getDocument(uid));
      }
    }
    return result;
  };


  /**
  * Gets the first document with the specified type.
  *
  * @method getDocumentByType
  * @param {String} type - The document type.
  * @return {gs.Document} The document or <b>null</b> if a document with the specified type doesn't exist.
   */

  DataManager.prototype.getDocumentByType = function(type) {
    var result, summary, uid;
    result = null;
    for (uid in this.summaries.items) {
      summary = this.summaries.items[uid];
      if ((summary.items != null) && summary.items.type === type) {
        result = this.getDocument(uid);
        break;
      }
    }
    return result;
  };


  /**
  * Gets a document by its UID.
  *
  * @method getDocument
  * @param {String} uid - The UID of the document to get.
  * @return {gs.Document} The document or <b>null</b> if a document with the specified UID doesn't exist.
   */

  DataManager.prototype.getDocument = function(uid) {
    var result, summary;
    result = this.documentsByUid[uid];
    if (result == null) {
      gs.Data.load(uid, (function(_this) {
        return function(dataObject, error) {
          var r;
          if (!error) {
            r = _this.documentsByUid[dataObject.uid];
            r.items = dataObject.items;
            return r.loaded = true;
          }
        };
      })(this));
      if (this.summaries && this.summaries.items) {
        summary = this.summaries.items[uid];
        if (summary) {
          result = {
            uid: uid,
            items: summary.items,
            loaded: false
          };
        }
      } else {
        result = {
          uid: uid,
          loaded: false
        };
      }
      if (result) {
        this.documentsByUid[uid] = result;
        this.documents.push(result);
        this.documentsLoaded = false;
      }
      if (uid === "SUMMARIES") {
        this.summaries = result;
      }
    }
    return result;
  };


  /**
  * Gets a document by its UID. If the document isn't already loaded this method
  * only returned document only contains summary data.
  *
  * @method getDocumentSummary
  * @param {String} uid - The UID of the document to get.
  * @return {gs.Document} The document or <b>null</b> if a document with the specified UID doesn't exist.
   */

  DataManager.prototype.getDocumentSummary = function(uid) {
    return this.summaries.items[uid];
  };


  /**
  * Updates the loading process of documents.
  *
  * @method update
   */

  DataManager.prototype.update = function() {
    var i, j, ref;
    if (!this.documentsLoaded) {
      this.documentsLoaded = true;
      for (i = j = 0, ref = this.documents.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        if (!this.documents[i].loaded) {
          this.documentsLoaded = false;
          break;
        }
      }
      if (this.documentsLoaded) {
        this.events.emit("loaded", this);
      }
    }
    return null;
  };

  return DataManager;

})();

window.DataManager = DataManager;

gs.DataManager = DataManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztFQWVhLHFCQUFBOztBQUNUOzs7OztJQUtBLElBQUMsQ0FBQSxjQUFELEdBQWtCOztBQUVsQjs7Ozs7SUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhOztBQUViOzs7OztJQUtBLElBQUMsQ0FBQSxlQUFELEdBQW1COztBQUVuQjs7OztJQUlBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxFQUFFLENBQUMsWUFBSCxDQUFBO0VBMUJMOzs7QUE2QmI7Ozs7Ozs7d0JBTUEsc0JBQUEsR0FBd0IsU0FBQyxJQUFEO0FBQ3BCLFFBQUE7SUFBQSxDQUFBLEdBQUk7QUFFSixXQUFNLENBQUEsR0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXJCO01BQ0ksQ0FBQSxHQUFJLElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQTtNQUNmLElBQUcsQ0FBQSxJQUFLLENBQUMsQ0FBQyxLQUFQLElBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBUixLQUFnQixJQUFuQztRQUNDLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixDQUFsQjtRQUNBLElBQUMsQ0FBQSxjQUFlLENBQUEsQ0FBQyxDQUFDLEdBQUYsQ0FBaEIsR0FBeUI7UUFDekIsRUFBRSxDQUFDLFNBQVUsQ0FBQSxDQUFDLENBQUMsR0FBRixDQUFiLEdBQXNCO1FBQ3RCLE9BQU8sSUFBQyxDQUFBLGNBQWUsQ0FBQSxDQUFDLENBQUMsR0FBRjtRQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFVLENBQUEsQ0FBQyxDQUFDLEdBQUY7UUFDcEIsQ0FBQSxHQU5EOztNQU9BLENBQUE7SUFUSjtBQVdBLFdBQU87RUFkYTs7O0FBaUJ4Qjs7Ozs7Ozs7d0JBT0Esa0JBQUEsR0FBb0IsU0FBQyxJQUFEO0FBQ2hCLFFBQUE7SUFBQSxNQUFBLEdBQVM7QUFFVCxTQUFBLDJCQUFB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QUFILEdBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBEYXRhTWFuYWdlclxuI1xuIyAgICQkQ09QWVJJR0hUJCRcbiNcbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgRGF0YU1hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBNYW5hZ2VzIHRoZSBnYW1lJ3MgZGF0YSBsaWtlIGxvYWRpbmcgZG9jdW1lbnRzLiBEb2N1bWVudHMgYXJlIHN0b3JlZFxuICAgICogaW4gdGhlIGRhdGEgZm9sZGVyIG9mIHRoZSBnYW1lIGluIEpTT04gZm9ybWF0LiBUaGUgVUlEIGlzIHVzZWQgYXMgdGhlIGZpbGUtbmFtZS5cbiAgICAqIEEgZG9jdW1lbnQgaGFzIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlOjxicj5cbiAgICAqIDxicj5cbiAgICAqIFVJRCAtIFVuaXF1ZSBJZGVudGlmaWVyPGJyPlxuICAgICogSXRlbXMgLT4gQW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpdGVtcy9maWVsZHMgb2YgdGhlIGRvY3VtZW50Ljxicj5cbiAgICAqIEl0ZW1zLlR5cGUgLT4gVGhlIHR5cGUgb2YgdGhlIGRvY3VtZW50PGJyPlxuICAgICogSXRlbXMuTmFtZSAtPiBUaGUgbmFtZSBvZiB0aGUgZG9jdW1lbnQ8YnI+XG4gICAgKiA8YnI+XG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgRGF0YU1hbmFnZXJcbiAgICAqIEBtZW1iZXJvZiBnc1xuICAgICogQGNvbnN0cnVjdG9yXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYWxsIGRvY3VtZW50cyBieSBVSUQuXG4gICAgICAgICogQHByb3BlcnR5IGRvY3VtZW50c0J5VWlkXG4gICAgICAgICogQHR5cGUgZ3MuRG9jdW1lbnRbXVxuICAgICAgICAjIyMgXG4gICAgICAgIEBkb2N1bWVudHNCeVVpZCA9IHt9XG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogU3RvcmVzIGFsbCBkb2N1bWVudHMuXG4gICAgICAgICogQHByb3BlcnR5IGRvY3VtZW50c1xuICAgICAgICAqIEB0eXBlIGdzLkRvY3VtZW50W11cbiAgICAgICAgIyMjXG4gICAgICAgIEBkb2N1bWVudHMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEluZGljaWF0ZXMgaWYgYWxsIHJlcXVlc3RlZCBkb2N1bWVudHMgYXJlIGxvYWRlZC5cbiAgICAgICAgKiBAcHJvcGVydHkgZG9jdW1lbnRzTG9hZGVkXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAjIyNcbiAgICAgICAgQGRvY3VtZW50c0xvYWRlZCA9IHRydWVcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgZXZlbnRzXG4gICAgICAgICogQHR5cGUgZ3MuRXZlbnRFbWl0dGVyXG4gICAgICAgICMjI1xuICAgICAgICBAZXZlbnRzID0gbmV3IGdzLkV2ZW50RW1pdHRlcigpXG4gICAgICAgIFxuXG4gICAgIyMjKlxuICAgICogVW5sb2FkcyBhbGwgZG9jdW1lbnRzIHdpdGggYSBzcGVjaWZpZWQgdHlwZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VEb2N1bWVudHNCeVR5cGVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIGRvY3VtZW50IHR5cGUuXG4gICAgIyMjICBcbiAgICBkaXNwb3NlRG9jdW1lbnRzQnlUeXBlOiAodHlwZSkgLT5cbiAgICAgICAgaSA9IDBcbiAgICAgICAgXG4gICAgICAgIHdoaWxlIGkgPCBAZG9jdW1lbnRzLmxlbmd0aFxuICAgICAgICAgICAgZCA9IEBkb2N1bWVudHNbaV1cbiAgICAgICAgICAgIGlmIGQgJiYgZC5pdGVtcyAmJiBkLml0ZW1zLnR5cGUgPT0gdHlwZVxuICAgICAgICAgICAgXHRAZG9jdW1lbnRzLnJlbW92ZShkKVxuICAgICAgICAgICAgXHRAZG9jdW1lbnRzQnlVaWRbZC51aWRdID0gbnVsbFxuICAgICAgICAgICAgXHRHUy5kYXRhQ2FjaGVbZC51aWRdID0gbnVsbFxuICAgICAgICAgICAgXHRkZWxldGUgQGRvY3VtZW50c0J5VWlkW2QudWlkXVxuICAgICAgICAgICAgXHRkZWxldGUgR1MuZGF0YUNhY2hlW2QudWlkXVxuICAgICAgICAgICAgXHRpLS07XG4gICAgICAgICAgICBpKytcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFx0XHRcblx0XG4gICAgIyMjKlxuICAgICogR2V0cyBhbGwgZG9jdW1lbnRzIHdpdGggYSBzcGVjaWZpZWQgdHlwZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldERvY3VtZW50c0J5VHlwZVxuICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgZG9jdW1lbnQgdHlwZS5cbiAgICAqIEByZXR1cm4ge2dzLkRvY3VtZW50W119IFRoZSBkb2N1bWVudHMuXG4gICAgIyMjICBcbiAgICBnZXREb2N1bWVudHNCeVR5cGU6ICh0eXBlKSAtPlxuICAgICAgICByZXN1bHQgPSBbXVxuICAgICAgICBcbiAgICAgICAgZm9yIHVpZCBvZiBAc3VtbWFyaWVzLml0ZW1zXG4gICAgICAgICAgICBzdW1tYXJ5ID0gQHN1bW1hcmllcy5pdGVtc1t1aWRdXG4gICAgICAgICAgICBpZiBzdW1tYXJ5Lml0ZW1zPyBhbmQgc3VtbWFyeS5pdGVtcy50eXBlID09IHR5cGVcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChAZ2V0RG9jdW1lbnQodWlkKSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgdGhlIGZpcnN0IGRvY3VtZW50IHdpdGggdGhlIHNwZWNpZmllZCB0eXBlLlxuICAgICpcbiAgICAqIEBtZXRob2QgZ2V0RG9jdW1lbnRCeVR5cGVcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIGRvY3VtZW50IHR5cGUuXG4gICAgKiBAcmV0dXJuIHtncy5Eb2N1bWVudH0gVGhlIGRvY3VtZW50IG9yIDxiPm51bGw8L2I+IGlmIGEgZG9jdW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIHR5cGUgZG9lc24ndCBleGlzdC5cbiAgICAjIyMgIFxuICAgIGdldERvY3VtZW50QnlUeXBlOiAodHlwZSkgLT5cbiAgICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgICBcbiAgICAgICAgZm9yIHVpZCBvZiBAc3VtbWFyaWVzLml0ZW1zXG4gICAgICAgICAgICBzdW1tYXJ5ID0gQHN1bW1hcmllcy5pdGVtc1t1aWRdXG4gICAgICAgICAgICBpZiBzdW1tYXJ5Lml0ZW1zPyBhbmQgc3VtbWFyeS5pdGVtcy50eXBlID09IHR5cGVcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBAZ2V0RG9jdW1lbnQodWlkKVxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBHZXRzIGEgZG9jdW1lbnQgYnkgaXRzIFVJRC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGdldERvY3VtZW50XG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdWlkIC0gVGhlIFVJRCBvZiB0aGUgZG9jdW1lbnQgdG8gZ2V0LlxuICAgICogQHJldHVybiB7Z3MuRG9jdW1lbnR9IFRoZSBkb2N1bWVudCBvciA8Yj5udWxsPC9iPiBpZiBhIGRvY3VtZW50IHdpdGggdGhlIHNwZWNpZmllZCBVSUQgZG9lc24ndCBleGlzdC5cbiAgICAjIyMgIFxuICAgIGdldERvY3VtZW50OiAodWlkKSAtPlxuICAgICAgICByZXN1bHQgPSBAZG9jdW1lbnRzQnlVaWRbdWlkXVxuICAgIFxuICAgICAgICBpZiBub3QgcmVzdWx0P1xuICAgICAgICAgICAgZ3MuRGF0YS5sb2FkKHVpZCwgKGRhdGFPYmplY3QsIGVycm9yKSA9PlxuICAgICAgICAgICAgICAgIGlmICFlcnJvclxuICAgICAgICAgICAgICAgICAgICByID0gQGRvY3VtZW50c0J5VWlkW2RhdGFPYmplY3QudWlkXVxuICAgICAgICAgICAgICAgICAgICByLml0ZW1zID0gZGF0YU9iamVjdC5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgci5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiBAc3VtbWFyaWVzIGFuZCBAc3VtbWFyaWVzLml0ZW1zXG4gICAgICAgICAgICAgICAgc3VtbWFyeSA9IEBzdW1tYXJpZXMuaXRlbXNbdWlkXVxuICAgICAgICAgICAgICAgIGlmIHN1bW1hcnlcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geyB1aWQ6IHVpZCwgaXRlbXM6IHN1bW1hcnkuaXRlbXMsIGxvYWRlZDogZmFsc2UgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgdWlkOiB1aWQsIGxvYWRlZDogZmFsc2UgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiByZXN1bHRcbiAgICAgICAgICAgICAgICBAZG9jdW1lbnRzQnlVaWRbdWlkXSA9IHJlc3VsdFxuICAgICAgICAgICAgICAgIEBkb2N1bWVudHMucHVzaChyZXN1bHQpXG4gICAgICAgICAgICAgICAgQGRvY3VtZW50c0xvYWRlZCA9IGZhbHNlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHVpZCA9PSBcIlNVTU1BUklFU1wiIHRoZW4gQHN1bW1hcmllcyA9IHJlc3VsdFxuICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIEdldHMgYSBkb2N1bWVudCBieSBpdHMgVUlELiBJZiB0aGUgZG9jdW1lbnQgaXNuJ3QgYWxyZWFkeSBsb2FkZWQgdGhpcyBtZXRob2RcbiAgICAqIG9ubHkgcmV0dXJuZWQgZG9jdW1lbnQgb25seSBjb250YWlucyBzdW1tYXJ5IGRhdGEuXG4gICAgKlxuICAgICogQG1ldGhvZCBnZXREb2N1bWVudFN1bW1hcnlcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1aWQgLSBUaGUgVUlEIG9mIHRoZSBkb2N1bWVudCB0byBnZXQuXG4gICAgKiBAcmV0dXJuIHtncy5Eb2N1bWVudH0gVGhlIGRvY3VtZW50IG9yIDxiPm51bGw8L2I+IGlmIGEgZG9jdW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIFVJRCBkb2Vzbid0IGV4aXN0LlxuICAgICMjIyBcbiAgICBnZXREb2N1bWVudFN1bW1hcnk6ICh1aWQpIC0+IEBzdW1tYXJpZXMuaXRlbXNbdWlkXVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGxvYWRpbmcgcHJvY2VzcyBvZiBkb2N1bWVudHMuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBpZiBub3QgQGRvY3VtZW50c0xvYWRlZFxuICAgICAgICAgICAgQGRvY3VtZW50c0xvYWRlZCA9IHRydWVcbiAgICBcbiAgICAgICAgICAgIGZvciBpIGluIFswLi4uQGRvY3VtZW50cy5sZW5ndGhdXG4gICAgICAgICAgICAgICAgaWYgbm90IEBkb2N1bWVudHNbaV0ubG9hZGVkXG4gICAgICAgICAgICAgICAgICAgIEBkb2N1bWVudHNMb2FkZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIEBkb2N1bWVudHNMb2FkZWRcbiAgICAgICAgICAgICAgICBAZXZlbnRzLmVtaXQoXCJsb2FkZWRcIiwgdGhpcylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG5cbndpbmRvdy5EYXRhTWFuYWdlciA9IERhdGFNYW5hZ2VyXG5ncy5EYXRhTWFuYWdlciA9IERhdGFNYW5hZ2VyIl19
//# sourceURL=DataManager_77.js