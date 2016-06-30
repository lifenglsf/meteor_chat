Tracker.autorun(function () {
  Meteor.subscribe("friends");
  Meteor.subscribe("group");
});