import Ember from 'ember';

export default Ember.Controller.extend({
  breadCrumb: {name: 'Users, Groups and Domains', icon: 'group'},
  selectedDomain: null,
  actions: {
    openModal: function(name, domain) {
      this.set('selectedDomain', domain);
      Ember.$('.ui.' + name + '.modal').modal('show');
    },
    deleteDomain: function() {
      this.get('selectedDomain').destroyRecord();
      this.set('selectedDomain', null);
    },
    clearModal: function() {
      this.set('selectedDomain', null);
    }
  }
});
