Meteor.methods({
	'chatlog.create':function(message,toid){
		userid = this.userId;
		user = Meteor.user();
		fusername = user.username;
		touser = Meteor.users.findOne({_id:toid});
		if(touser){
			tousername = touser.username;
			id = chatlog.insert({from:userid,to:toid,content:message,tousername,fromusername:fusername,createAt:new Date()})
			if(id){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
})