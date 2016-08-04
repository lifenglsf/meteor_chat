Meteor.publish('groups',function(){
	userid = this.userId;
	return cgroup.find({$or:[{owner:userid},{"member.id":userid}]});
})

Meteor.publish('chatlogs',function(userid){
	console.log(userid);
	//Post.find({"user_id":user_id}, {skip: 0, limit: 5});
	r= cchatlog.find({$or:[{from:userid},{to:userid}]});
	return r;
})
Meteor.publish('allusers',function(){
	return Meteor.users.find({});
})
Meteor.publish('roles',function(){
	return Roles.getAllRoles();
})
Meteor.publish('allfriends',function(){
	return cfriends.find({ownerid:this.userId});
});
Meteor.publish('alldeparts',function(){
	return cdepart.find({});
})