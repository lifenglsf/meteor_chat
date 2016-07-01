Tracker.autorun(function () {
  Meteor.subscribe("chatlogs");
  Meteor.subscribe("group");
  Meteor.subscribe('allusers');
});