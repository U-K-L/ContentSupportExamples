var Component_DomainContainer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_DomainContainer = (function(superClass) {
  extend(Component_DomainContainer, superClass);


  /**
  * A container component allows an object to have sub-objects.
  * @module gs
  * @class Component_DomainContainer
  * @memberof gs
  * @constructor
   */

  function Component_DomainContainer(disposeBehavior) {
    Component_DomainContainer.__super__.constructor.call(this, disposeBehavior);

    /**
    * The current domain. The default domain is an empty string. Please use
    * <b>changeDomain</b> to change the current domain.
    * @property domain
    * @readOnly
     */
    this.domain = "com.degica.vnm.default";
    this.domains = ["com.degica.vnm.default"];
  }


  /**
  * Changes the component and all sub-objects.
  * @method changeDomain
  * @param {string} domain - The domain to change to.
   */

  Component_DomainContainer.prototype.dispose = function() {
    var domain, j, len, ref;
    Component_DomainContainer.__super__.dispose.apply(this, arguments);
    ref = this.domains;
    for (j = 0, len = ref.length; j < len; j++) {
      domain = ref[j];
      if (domain !== this.domain) {
        this.object.subObjects = this.object.subObjectsByDomain[domain];
        this.object.disposeObjects();
      }
    }
    return this.object.subObjects = this.object.subObjectsByDomain[this.domain];
  };


  /**
  * Changes the current domain.
  * @method changeDomain
  * @param {string} domain - The domain to change to.
   */

  Component_DomainContainer.prototype.changeDomain = function(domain) {
    var objects;
    this.domain = domain;
    objects = this.object.subObjectsByDomain[domain];
    if (!objects) {
      objects = this.object.subObjectsByDomain[domain] = [];
      this.domains = Object.keys(this.object.subObjectsByDomain);
    }
    return this.object.subObjects = objects;
  };


  /**
  * Sets the visibility of all sub objects of all domains.
  * @method setVisible
  * @param {boolean} visible - The new visibility.
   */

  Component_DomainContainer.prototype.setVisible = function(visible) {
    var domain, j, len, ref, results, subObject, subObjects;
    ref = this.domains;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      domain = ref[j];
      subObjects = this.object.subObjectsByDomain[domain];
      if (subObjects) {
        results.push((function() {
          var k, len1, results1;
          results1 = [];
          for (k = 0, len1 = subObjects.length; k < len1; k++) {
            subObject = subObjects[k];
            if (subObject) {
              subObject.visible = visible;
              results1.push(subObject.update());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Updates all sub-objects and sorts them if necessary. It also removes
  * disposed objects from the list of sub-objects.
  * @method update
   */

  Component_DomainContainer.prototype.update = function() {
    var domain, i, j, len, ref, subObject, subObjects;
    ref = this.domains;
    for (j = 0, len = ref.length; j < len; j++) {
      domain = ref[j];
      subObjects = this.object.subObjectsByDomain[domain];
      i = 0;
      while (i < subObjects.length) {
        subObject = subObjects[i];
        if (subObject != null ? subObject.active : void 0) {
          if (subObject.disposed) {
            subObjects[i] = null;
          } else {
            subObject.update();
          }
        }
        i++;
      }
    }
    return null;
  };

  return Component_DomainContainer;

})(gs.Component_Container);

gs.Component_DomainContainer = Component_DomainContainer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEseUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7RUFPYSxtQ0FBQyxlQUFEO0lBQ1QsMkRBQU0sZUFBTjs7QUFFQTs7Ozs7O0lBTUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FBQyx3QkFBRDtFQVZGOzs7QUFZYjs7Ozs7O3NDQUtBLE9BQUEsR0FBUyxTQUFBO0FBQ0wsUUFBQTtJQUFBLHdEQUFBLFNBQUE7QUFFQTtBQUFBLFNBQUEscUNBQUE7O01BQ0ksSUFBRyxNQUFBLEtBQVUsSUFBQyxDQUFBLE1BQWQ7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBbUIsQ0FBQSxNQUFBO1FBQ2hELElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUFBLEVBRko7O0FBREo7V0FJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBbUIsQ0FBQSxJQUFDLENBQUEsTUFBRDtFQVAzQzs7O0FBU1Q7Ozs7OztzQ0FLQSxZQUFBLEdBQWMsU0FBQyxNQUFEO0FBQ1YsUUFBQTtJQUFBLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBbUIsQ0FBQSxNQUFBO0lBQ3JDLElBQUcsQ0FBQyxPQUFKO01BQ0ksT0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQW1CLENBQUEsTUFBQSxDQUEzQixHQUFxQztNQUMvQyxJQUFDLENBQUEsT0FBRCxHQUFXLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBcEIsRUFGZjs7V0FJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsR0FBcUI7RUFQWDs7O0FBU2Q7Ozs7OztzQ0FLQSxVQUFBLEdBQVksU0FBQyxPQUFEO0FBQ1IsUUFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTs7TUFDSSxVQUFBLEdBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBbUIsQ0FBQSxNQUFBO01BQ3hDLElBQUcsVUFBSDs7O0FBQW1CO2VBQUEsOENBQUE7O1lBQ2YsSUFBRyxTQUFIO2NBQ0ksU0FBUyxDQUFDLE9BQVYsR0FBb0I7NEJBQ3BCLFNBQVMsQ0FBQyxNQUFWLENBQUEsR0FGSjthQUFBLE1BQUE7b0NBQUE7O0FBRGU7O2NBQW5CO09BQUEsTUFBQTs2QkFBQTs7QUFGSjs7RUFEUTs7O0FBUVo7Ozs7OztzQ0FLQSxNQUFBLEdBQVEsU0FBQTtBQUNKLFFBQUE7QUFBQTtBQUFBLFNBQUEscUNBQUE7O01BQ0ksVUFBQSxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQW1CLENBQUEsTUFBQTtNQUV4QyxDQUFBLEdBQUk7QUFDSixhQUFNLENBQUEsR0FBSSxVQUFVLENBQUMsTUFBckI7UUFDSSxTQUFBLEdBQVksVUFBVyxDQUFBLENBQUE7UUFDdkIsd0JBQUcsU0FBUyxDQUFFLGVBQWQ7VUFDSSxJQUFHLFNBQVMsQ0FBQyxRQUFiO1lBQ0ksVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixLQURwQjtXQUFBLE1BQUE7WUFHSSxTQUFTLENBQUMsTUFBVixDQUFBLEVBSEo7V0FESjs7UUFLQSxDQUFBO01BUEo7QUFKSjtBQWFBLFdBQU87RUFkSDs7OztHQWxFNEIsRUFBRSxDQUFDOztBQW9GM0MsRUFBRSxDQUFDLHlCQUFILEdBQStCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfQ29udGFpbmVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfRG9tYWluQ29udGFpbmVyIGV4dGVuZHMgZ3MuQ29tcG9uZW50X0NvbnRhaW5lclxuICAgICMjIypcbiAgICAqIEEgY29udGFpbmVyIGNvbXBvbmVudCBhbGxvd3MgYW4gb2JqZWN0IHRvIGhhdmUgc3ViLW9iamVjdHMuXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0RvbWFpbkNvbnRhaW5lclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGRpc3Bvc2VCZWhhdmlvcikgLT5cbiAgICAgICAgc3VwZXIoZGlzcG9zZUJlaGF2aW9yKVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBjdXJyZW50IGRvbWFpbi4gVGhlIGRlZmF1bHQgZG9tYWluIGlzIGFuIGVtcHR5IHN0cmluZy4gUGxlYXNlIHVzZVxuICAgICAgICAqIDxiPmNoYW5nZURvbWFpbjwvYj4gdG8gY2hhbmdlIHRoZSBjdXJyZW50IGRvbWFpbi5cbiAgICAgICAgKiBAcHJvcGVydHkgZG9tYWluXG4gICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICMjI1xuICAgICAgICBAZG9tYWluID0gXCJjb20uZGVnaWNhLnZubS5kZWZhdWx0XCJcbiAgICAgICAgQGRvbWFpbnMgPSBbXCJjb20uZGVnaWNhLnZubS5kZWZhdWx0XCJdXG4gICAgIFxuICAgICMjIypcbiAgICAqIENoYW5nZXMgdGhlIGNvbXBvbmVudCBhbmQgYWxsIHN1Yi1vYmplY3RzLlxuICAgICogQG1ldGhvZCBjaGFuZ2VEb21haW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBkb21haW4gLSBUaGUgZG9tYWluIHRvIGNoYW5nZSB0by5cbiAgICAjIyMgICBcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgZm9yIGRvbWFpbiBpbiBAZG9tYWluc1xuICAgICAgICAgICAgaWYgZG9tYWluICE9IEBkb21haW5cbiAgICAgICAgICAgICAgICBAb2JqZWN0LnN1Yk9iamVjdHMgPSBAb2JqZWN0LnN1Yk9iamVjdHNCeURvbWFpbltkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC5kaXNwb3NlT2JqZWN0cygpXG4gICAgICAgIEBvYmplY3Quc3ViT2JqZWN0cyA9IEBvYmplY3Quc3ViT2JqZWN0c0J5RG9tYWluW0Bkb21haW5dXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIENoYW5nZXMgdGhlIGN1cnJlbnQgZG9tYWluLlxuICAgICogQG1ldGhvZCBjaGFuZ2VEb21haW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBkb21haW4gLSBUaGUgZG9tYWluIHRvIGNoYW5nZSB0by5cbiAgICAjIyMgICBcbiAgICBjaGFuZ2VEb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBkb21haW4gPSBkb21haW5cbiAgICAgICAgb2JqZWN0cyA9IEBvYmplY3Quc3ViT2JqZWN0c0J5RG9tYWluW2RvbWFpbl1cbiAgICAgICAgaWYgIW9iamVjdHNcbiAgICAgICAgICAgIG9iamVjdHMgPSBAb2JqZWN0LnN1Yk9iamVjdHNCeURvbWFpbltkb21haW5dID0gW11cbiAgICAgICAgICAgIEBkb21haW5zID0gT2JqZWN0LmtleXMoQG9iamVjdC5zdWJPYmplY3RzQnlEb21haW4pXG4gICAgICAgICAgICBcbiAgICAgICAgQG9iamVjdC5zdWJPYmplY3RzID0gb2JqZWN0c1xuICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHZpc2liaWxpdHkgb2YgYWxsIHN1YiBvYmplY3RzIG9mIGFsbCBkb21haW5zLlxuICAgICogQG1ldGhvZCBzZXRWaXNpYmxlXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBUaGUgbmV3IHZpc2liaWxpdHkuXG4gICAgIyMjXG4gICAgc2V0VmlzaWJsZTogKHZpc2libGUpIC0+XG4gICAgICAgIGZvciBkb21haW4gaW4gQGRvbWFpbnNcbiAgICAgICAgICAgIHN1Yk9iamVjdHMgPSBAb2JqZWN0LnN1Yk9iamVjdHNCeURvbWFpbltkb21haW5dXG4gICAgICAgICAgICBpZiBzdWJPYmplY3RzIHRoZW4gZm9yIHN1Yk9iamVjdCBpbiBzdWJPYmplY3RzXG4gICAgICAgICAgICAgICAgaWYgc3ViT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIHN1Yk9iamVjdC52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICBzdWJPYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGFsbCBzdWItb2JqZWN0cyBhbmQgc29ydHMgdGhlbSBpZiBuZWNlc3NhcnkuIEl0IGFsc28gcmVtb3Zlc1xuICAgICogZGlzcG9zZWQgb2JqZWN0cyBmcm9tIHRoZSBsaXN0IG9mIHN1Yi1vYmplY3RzLlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIGZvciBkb21haW4gaW4gQGRvbWFpbnNcbiAgICAgICAgICAgIHN1Yk9iamVjdHMgPSBAb2JqZWN0LnN1Yk9iamVjdHNCeURvbWFpbltkb21haW5dXG5cbiAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICB3aGlsZSBpIDwgc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgICAgICBzdWJPYmplY3QgPSBzdWJPYmplY3RzW2ldXG4gICAgICAgICAgICAgICAgaWYgc3ViT2JqZWN0Py5hY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgc3ViT2JqZWN0LmRpc3Bvc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJPYmplY3RzW2ldID0gbnVsbFxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJPYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuZ3MuQ29tcG9uZW50X0RvbWFpbkNvbnRhaW5lciA9IENvbXBvbmVudF9Eb21haW5Db250YWluZXJcbiJdfQ==
//# sourceURL=Component_DomainContainer_39.js