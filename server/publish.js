Meteor.publish("friends", function () {
	userid = this.userId;
  return Meteor.users.find({friends:{$exists:true}});
});

Meteor.publish('group',function(){
	userid = this.userId;
	return group.find({$or:[{owner:userid,member:userid}]});
})

Meteor.publish('history',function(){
	userid = this.userId;
	return history.find({$or:[{from:userid,to:userid}]});
})