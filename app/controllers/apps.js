import Ember from "ember";
import handleModelError from '../utils/handle-model-error';


export default Ember.ObjectController.extend({
  sortBy: ['name'],
  queryParams: ['filter'],
  filter: null,
  selectedApp: null,
  breadCrumb: {name: 'App Store', icon: 'cubes'},
  sortedApps: Ember.computed.sort('model', 'sortBy'),

  filteredApps: Ember.computed('filter', 'sortedApps', function() {
    var filter = this.get('filter');
    var apps = this.get('sortedApps');

    if (filter === 'installed') {
      return apps.filterBy('installed', true);
    } else if (filter === 'notinstalled') {
      return apps.filterBy('installed', false);
    } else {
      return apps;
    }
  }),

  allFilter: function() {
    return this.get('filter') === null;
  }.property('filter'),
  installedFilter: function() {
    return this.get('filter') === 'installed';
  }.property('filter'),
  notInstalledFilter: function() {
    return this.get('filter') === 'notinstalled';
  }.property('filter'),

  actions: {
    install: function(app) {
      var self = this;
      app.set('operation', 'install');
      app.set('isReady', false);
      var promise = app.save();
      promise.then(function(){}, function(e){
        handleModelError(self, e);
      });
    },
    setFilter: function(filt) {
      if (filt === 'installed') {
        this.set('filter', 'installed');
      } else if (filt === 'notinstalled') {
        this.set('filter', 'notinstalled');
      } else {
        this.set('filter', null);
      }
    },
    openModal: function(name, app) {
      this.set('selectedApp', app);
      Ember.$('.ui.' + name + '.modal').modal('show');
    },
    uninstallApp: function() {
      var self = this,
           app = this.get('selectedApp');
      app.set('operation', 'uninstall');
      app.set('isReady', false);
      var promise = app.save();
      promise.then(function(){}, function(e){
        handleModelError(self, e);
      });
      this.set('selectedApp', null);
    },
    clearModal: function() {
      this.set('selectedApp', null);
    }
  }
});
