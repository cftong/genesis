import Ember from "ember";


export default Ember.Controller.extend({
  socketIOService: Ember.inject.service('socket-io'),
  hasNotifications: Ember.computed.notEmpty('notifications.items'),
  init: function() {
    this._super.apply(this, arguments);
    var socket = this.get('socketIOService').socketFor('http://localhost:8000/');
    socket.on('connect', function() {
      socket.on('sendNotification', this.onNotification, this);
      socket.on('modelPush', this.onModelPush, this);
      socket.on('modelPurge', this.onModelPurge, this);
    }, this);
    socket.on('close', this.onSocketClose, this);
  },
  onNotification: function(m) {
    this.notifications.newNotification(m.level, m.message, m.title, m.id, m.complete, m.time);
  },
  onModelPush: function(items) {
    this.get('store').pushPayload(items);
  },
  onModelPurge: function(item) {
    var record = this.get('store').getById(item.model, item.id);
    if (record) {
      this.get('store').unloadRecord(record);
    }
  },
  onSocketClose: function() {
    var socket = this.get('socketIOService').socketFor('http://localhost:8000/');
    socket.reconnect();
  },
  userId: function() {
    if (this.get("session.isAuthenticated") && this.get("session.content.secure") && this.get("session.content.secure.token")) {
      var data = JSON.parse(atob(this.get("session.content.secure.token").split(".")[1]));
      return data.uln?(data.ufn+" "+data.uln):data.ufn;
    } else {
      return "Unknown User";
    }
  }.property("session.isAuthenticated"),
  showBreadCrumbs: function() {
    return ["login", "index", "error", "firstrun"].indexOf(this.get("currentRouteName")) === -1;
  }.property("currentRouteName"),
  actions: {
    openModal: function(name) {
      Ember.$('.ui.' + name + '.modal').modal('show');
    },
    openSidebar: function(sidebarName) {
      Ember.$('#' + sidebarName).sidebar('show');
    },
    deleteNotification: function(msg) {
      this.notifications.remove(msg);
    },
    clearNotifications: function() {
      Ember.$('#notifications-sidebar').sidebar('hide');
      this.notifications.empty();
    }
  }
});
