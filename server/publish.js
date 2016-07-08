Meteor.publish('groups',function(){
	userid = this.userId;
	return group.find({$or:[{owner:userid},{"member.id":userid}]});
})

Meteor.publish('chatlogs',function(){
	userid = this.userId;
	//Post.find({"user_id":user_id}, {skip: 0, limit: 5});
	r= chatlog.find({$or:[{from:userid},{to:userid}]},{sort:{createAt:-1}});
	return r;
})
Meteor.publish('allusers',function(){
	return Meteor.users.find({});
})
Meteor.publish('roles',function(){
	return Roles.getAllRoles();
})
Meteor.publish('allfriends',function(){
	return friends.find({ownerid:this.userId});
})