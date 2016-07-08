Meteor.methods({
	'friends.add':function(id){
			currentuser = Meteor.user();
			if(!currentuser){
				return false
			}else{
				user = Meteor.users.findOne({_id:id});
			if(!friends.findOne({ownerid:this.userId,'friend.id':id})){
				friends.insert({ownerid:this.userId,friend:{id:id,username:user.username}});
			}

			if(!friends.findOne({ownerid:id,'friend.id':this.userId})){
				friends.insert({ownerid:id,friend:{id:this.userId,username:currentuser.username}});
			}
			return true;
			}
			
		
	}
})