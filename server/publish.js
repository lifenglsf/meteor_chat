Meteor.publish('groups',function(){
	userid = this.userId;
	return cgroup.find({$and:[{$or:[{owner:userid},{"member.id":userid}],isdelete:{$ne:1}}]});
})

Meteor.publish('chatlogs',function(userid){
	console.log(userid);
	//Post.find({"user_id":user_id}, {skip: 0, limit: 5});
	r= cchatlog.find({$or:[{from:userid},{to:userid}]});
	return r;
})
Meteor.publish('allusers',function(){
	return Meteor.users.find({isdelete:{$ne:1}});
})
Meteor.publish('roles',function(){
	return Roles.getAllRoles();
})
Meteor.publish('allfriends',function(){
	return cfriends.find({ownerid:this.userId});
});
Meteor.publish('alldeparts',function(){
	return cdepart.find({isdelete:{$ne:1}});
})
