Meteor.methods({
	'friends.add':function(id){
			currentuser = Meteor.user();
			if(!currentuser){
				return false
			}else{
				user = Meteor.users.findOne({_id:id});
				if(user){
					if(!cfriends.findOne({ownerid:this.userId,'friend.id':id})){
						cfriends.insert({ownerid:this.userId,friend:{id:id,username:user.username}});
					}else{
						return {error:1,reason:user.username+"已经是你的好友了"};
					}

					if(!cfriends.findOne({ownerid:id,'friend.id':this.userId})){
						cfriends.insert({ownerid:id,friend:{id:this.userId,username:currentuser.username}});
					}
				}else{
					return {error:1,reason:"您要添加的好友不存在"};
				}
			
			return true;
			}
			
		
	}
})