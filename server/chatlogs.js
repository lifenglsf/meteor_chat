Meteor.methods({
	'chatlog.createPersonChat':function(message,toid){
		userid = this.userId;
		user = Meteor.user();
		fusername = user.username;
		touser = Meteor.users.findOne({_id:toid});
		if(touser){
			tousername = touser.username;
			id = cchatlog.insert({type:"person",from:userid,to:toid,content:message,tousername:tousername,fromusername:fusername,createAt:new Date()})
			if(id){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},
	'chatlog.createGroupChat':function(message,toid){
		userid = this.userId;
		user = Meteor.user();
		fusername = user.username;
		to = cgroup.findOne({_id:toid});
		if(to){
			tousername = to.groupname;
			id = cchatlog.insert({type:"group",from:userid,to:toid,content:message,tousername,fromusername:fusername,createAt:new Date()})
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