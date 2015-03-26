import Ember from "ember";
import ENV from "../config/environment";


export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      sites: this.get('store').find('website'),
      domains: this.get('store').find('domain'),
      apps: this.get('store').find('app', {type: "website", loadable: true})
    });
  },
  actions: {
    delete: function(model){
      model.set('isReady', false);
      $.ajax({
        url: ENV.APP.krakenHost+'/websites/'+model.get('id'),
        type: 'DELETE'
      });
    }
  }
});