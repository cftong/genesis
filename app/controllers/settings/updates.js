import Ember from "ember";


export default Ember.ObjectController.extend({
  breadCrumb: {name: 'Updates', icon: 'fa-star'},
  sortBy: ['id:desc'],
  updates: Ember.computed.sort('model', 'sortBy')
});
