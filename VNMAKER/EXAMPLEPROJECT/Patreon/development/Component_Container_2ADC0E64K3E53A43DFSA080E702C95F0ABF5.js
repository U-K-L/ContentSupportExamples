var Component_Container,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Container = (function(superClass) {
  extend(Component_Container, superClass);


  /**
  * A container component allows an object to have sub-objects.
  * @module gs
  * @class Component_Container
  * @memberof gs
  * @constructor
   */

  function Component_Container(disposeBehavior) {
    Component_Container.__super__.constructor.apply(this, arguments);

    /**
    * The behavior how the container deals with disposed game objects.
    * @property disposeBehavior
    * @default gs.ContainerDisposeBehavior.REMOVE
     */
    this.disposeBehavior = disposeBehavior != null ? disposeBehavior : gs.ContainerDisposeBehavior.REMOVE;
  }


  /**
  * Sorts the sub-objects by order-index.
  * @method sort_
  * @param {gs.Object_Base} a Object A
  * @param {gs.Object_Base} b Object B
   */

  Component_Container.prototype.sort_ = function(a, b) {
    if (a.order > b.order) {
      return -1;
    } else if (a.order < b.order) {
      return 1;
    } else {
      return 0;
    }
  };


  /**
  * Sets the visibility of all sub objects.
  * @method setVisible
  * @param {boolean} visible - The new visibility.
   */

  Component_Container.prototype.setVisible = function(visible) {
    var j, len, ref, results, subObject;
    ref = this.object.subObjects;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      subObject = ref[j];
      if (subObject) {
        subObject.visible = visible;
        results.push(subObject.update());
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

  Component_Container.prototype.update = function() {
    var i, results, subObject, subObjects;
    Component_Container.__super__.update.apply(this, arguments);
    subObjects = this.object.subObjects;
    if (this.object.needsSort) {
      subObjects.sort(this.sort_);
      this.object.needsSort = false;
    }
    i = 0;
    results = [];
    while (i < subObjects.length) {
      subObject = subObjects[i];
      if (subObject != null ? subObject.active : void 0) {
        if (subObject.disposed) {
          if (this.disposeBehavior === gs.ContainerDisposeBehavior.REMOVE) {
            subObjects.remove(subObject);
            i--;
          } else {
            subObjects[i] = null;
          }
        } else {
          subObject.update();
        }
      }
      results.push(i++);
    }
    return results;
  };

  return Component_Container;

})(gs.Component);

gs.Component_Container = Component_Container;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsbUJBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7RUFPYSw2QkFBQyxlQUFEO0lBQ1Qsc0RBQUEsU0FBQTs7QUFFQTs7Ozs7SUFLQSxJQUFDLENBQUEsZUFBRCw2QkFBbUIsa0JBQWtCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztFQVJ4RDs7O0FBVWI7Ozs7Ozs7Z0NBTUEsS0FBQSxHQUFPLFNBQUMsQ0FBRCxFQUFJLENBQUo7SUFDSCxJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLEtBQWY7QUFDRSxhQUFPLENBQUMsRUFEVjtLQUFBLE1BRUssSUFBRyxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxLQUFmO0FBQ0gsYUFBTyxFQURKO0tBQUEsTUFBQTtBQUdILGFBQU8sRUFISjs7RUFIRjs7O0FBUVA7Ozs7OztnQ0FLQSxVQUFBLEdBQVksU0FBQyxPQUFEO0FBQ1IsUUFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTs7TUFDSSxJQUFHLFNBQUg7UUFDSSxTQUFTLENBQUMsT0FBVixHQUFvQjtxQkFDcEIsU0FBUyxDQUFDLE1BQVYsQ0FBQSxHQUZKO09BQUEsTUFBQTs2QkFBQTs7QUFESjs7RUFEUTs7O0FBTVo7Ozs7OztnQ0FLQSxNQUFBLEdBQVEsU0FBQTtBQUNKLFFBQUE7SUFBQSxpREFBQSxTQUFBO0lBRUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDckIsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVg7TUFDSSxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFDLENBQUEsS0FBakI7TUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsR0FBb0IsTUFGeEI7O0lBSUEsQ0FBQSxHQUFJO0FBQ0o7V0FBTSxDQUFBLEdBQUksVUFBVSxDQUFDLE1BQXJCO01BQ0ksU0FBQSxHQUFZLFVBQVcsQ0FBQSxDQUFBO01BQ3ZCLHdCQUFHLFNBQVMsQ0FBRSxlQUFkO1FBQ0ksSUFBRyxTQUFTLENBQUMsUUFBYjtVQUNJLElBQUcsSUFBQyxDQUFBLGVBQUQsS0FBb0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLE1BQW5EO1lBQ0ksVUFBVSxDQUFDLE1BQVgsQ0FBa0IsU0FBbEI7WUFDQSxDQUFBLEdBRko7V0FBQSxNQUFBO1lBSUksVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixLQUpwQjtXQURKO1NBQUEsTUFBQTtVQU9JLFNBQVMsQ0FBQyxNQUFWLENBQUEsRUFQSjtTQURKOzttQkFTQSxDQUFBO0lBWEosQ0FBQTs7RUFUSTs7OztHQWhEc0IsRUFBRSxDQUFDOztBQXVFckMsRUFBRSxDQUFDLG1CQUFILEdBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfQ29udGFpbmVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfQ29udGFpbmVyIGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgIyMjKlxuICAgICogQSBjb250YWluZXIgY29tcG9uZW50IGFsbG93cyBhbiBvYmplY3QgdG8gaGF2ZSBzdWItb2JqZWN0cy5cbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBDb21wb25lbnRfQ29udGFpbmVyXG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoZGlzcG9zZUJlaGF2aW9yKSAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBiZWhhdmlvciBob3cgdGhlIGNvbnRhaW5lciBkZWFscyB3aXRoIGRpc3Bvc2VkIGdhbWUgb2JqZWN0cy5cbiAgICAgICAgKiBAcHJvcGVydHkgZGlzcG9zZUJlaGF2aW9yXG4gICAgICAgICogQGRlZmF1bHQgZ3MuQ29udGFpbmVyRGlzcG9zZUJlaGF2aW9yLlJFTU9WRVxuICAgICAgICAjIyNcbiAgICAgICAgQGRpc3Bvc2VCZWhhdmlvciA9IGRpc3Bvc2VCZWhhdmlvciA/IGdzLkNvbnRhaW5lckRpc3Bvc2VCZWhhdmlvci5SRU1PVkVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU29ydHMgdGhlIHN1Yi1vYmplY3RzIGJ5IG9yZGVyLWluZGV4LlxuICAgICogQG1ldGhvZCBzb3J0X1xuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gYSBPYmplY3QgQVxuICAgICogQHBhcmFtIHtncy5PYmplY3RfQmFzZX0gYiBPYmplY3QgQlxuICAgICMjI1xuICAgIHNvcnRfOiAoYSwgYikgLT5cbiAgICAgICAgaWYgYS5vcmRlciA+IGIub3JkZXJcbiAgICAgICAgICByZXR1cm4gLTFcbiAgICAgICAgZWxzZSBpZiBhLm9yZGVyIDwgYi5vcmRlclxuICAgICAgICAgIHJldHVybiAxXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgIFxuICAgICMjIypcbiAgICAqIFNldHMgdGhlIHZpc2liaWxpdHkgb2YgYWxsIHN1YiBvYmplY3RzLlxuICAgICogQG1ldGhvZCBzZXRWaXNpYmxlXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBUaGUgbmV3IHZpc2liaWxpdHkuXG4gICAgIyMjXG4gICAgc2V0VmlzaWJsZTogKHZpc2libGUpIC0+XG4gICAgICAgIGZvciBzdWJPYmplY3QgaW4gQG9iamVjdC5zdWJPYmplY3RzXG4gICAgICAgICAgICBpZiBzdWJPYmplY3RcbiAgICAgICAgICAgICAgICBzdWJPYmplY3QudmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgICAgICAgICBzdWJPYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIGFsbCBzdWItb2JqZWN0cyBhbmQgc29ydHMgdGhlbSBpZiBuZWNlc3NhcnkuIEl0IGFsc28gcmVtb3Zlc1xuICAgICogZGlzcG9zZWQgb2JqZWN0cyBmcm9tIHRoZSBsaXN0IG9mIHN1Yi1vYmplY3RzLlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyNcbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHN1cGVyXG4gICAgICAgIFxuICAgICAgICBzdWJPYmplY3RzID0gQG9iamVjdC5zdWJPYmplY3RzXG4gICAgICAgIGlmIEBvYmplY3QubmVlZHNTb3J0XG4gICAgICAgICAgICBzdWJPYmplY3RzLnNvcnQoQHNvcnRfKVxuICAgICAgICAgICAgQG9iamVjdC5uZWVkc1NvcnQgPSBub1xuICAgICAgICAgIFxuICAgICAgICBpID0gMFxuICAgICAgICB3aGlsZSBpIDwgc3ViT2JqZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIHN1Yk9iamVjdCA9IHN1Yk9iamVjdHNbaV1cbiAgICAgICAgICAgIGlmIHN1Yk9iamVjdD8uYWN0aXZlXG4gICAgICAgICAgICAgICAgaWYgc3ViT2JqZWN0LmRpc3Bvc2VkXG4gICAgICAgICAgICAgICAgICAgIGlmIEBkaXNwb3NlQmVoYXZpb3IgPT0gZ3MuQ29udGFpbmVyRGlzcG9zZUJlaGF2aW9yLlJFTU9WRVxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViT2JqZWN0cy5yZW1vdmUoc3ViT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgaS0tXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Yk9iamVjdHNbaV0gPSBudWxsXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzdWJPYmplY3QudXBkYXRlKClcbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgXG4gICAgICAgIFxuZ3MuQ29tcG9uZW50X0NvbnRhaW5lciA9IENvbXBvbmVudF9Db250YWluZXIiXX0=
//# sourceURL=Component_Container_17.js