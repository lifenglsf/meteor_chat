Meteor.methods({
	'groups.create':function(groupname,member){
		console.log(this.userId,'====');
		if(this.userId){
			console.log(1);
			user = Meteor.user();
			username = user.username
			id = cgroup.insert({owner:this.userId,groupname:groupname,member:member,ownername:username,createAt:new Date()});
			if(id){
				console.log(2);
				return true;
			}else{
				console.log(3)
				return false;
			}
		}else{
			console.log(4);
			return false;
			
		}
	}

})