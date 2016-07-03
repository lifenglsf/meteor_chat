Meteor.methods({
	'friends.add':function(id){
		friend = Meteor.users.findOne({_id:id});
		console.log(id,friend);
		if(!friend){
			return false;
		}else{
			updator = {id:id,username:friend.username};
			Meteor.users.update({_id:this.userId},{$addToSet:{friend:updator}});
			updators = {id:this.userId,username:Meteor.user().username}
			Meteor.users.update({_id:id},{$addToSet:{friend:updators}});
			return true;
		}
		
	}
})