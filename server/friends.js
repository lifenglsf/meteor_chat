Meteor.methods({
	'friends.add':function(id){
			currentuser = Meteor.user();
			if(!currentuser){
				return false
			}else{
				user = Meteor.users.findOne({_id:id});
				if(user){
					console.log(cfriends.findOne({ownerid:this.userId,'friend.id':id}));
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


	},
	'friends.delete':function(id){
		console.log(id)
		currentuser = Meteor.user();
		if(!currentuser){
			return false
		}else{
			user = Meteor.users.findOne({_id:id});
			if(user){
				if(!cfriends.findOne({ownerid:this.userId,'friend.id':id})){
					return {error:1,reason:user.username+"不是您的好友"};
				}else{
					cfriends.update({ownerid:this.userId,'friend.id':id},{$set:{isdelete:1}});
					cgroup.update({},{$pull:{member:{id:id}}},{multi:true});
					cchatlog.update({$or:[{from:this.userId},{to:id}]},{$set:{isdelete:1}})
					return {error:1,reason:"删除成功"};
				}

			}else{
				return {error:1,reason:"您要删除的好友不存在"};
			}

		return true;
		}
	}
})
