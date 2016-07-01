Meteor.publish('groups',function(){
	userid = this.userId;
	return group.find({$or:[{owner:userid,member:userid}]});
})

Meteor.publish('chatlogs',function(){
	userid = this.userId;
	return chatlog.find({$or:[{from:userid,to:userid}]});
})
Meteor.publish('allusers',function(){
	return Meteor.users.find({});
})