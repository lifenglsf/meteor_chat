Meteor.methods({
	'users.checkpassword':function(password){
		userid = this.userId;
		digest = Package.sha.SHA256(password);
		check(digest, String);
		if (userid) {
	      var user = Meteor.user();
	      var password = {digest: digest, algorithm: 'sha-256'};
	      var result = Accounts._checkPassword(user, password);
	      console.log(result);
	      if(result.error == null){
	      	return {'error':0,'msg':'密码正确'};
	      }else{
	      	return {'error':1,'msg':'原密码错误'};
	      }
	    } else {
	      return {'error':1,'msg':'用户未登陆'};
	    }
	},
	'users.changepassword':function(password){
		r = Accounts.setPassword(this.userId,password,{logout:false});
		console.log(r);
		return r;
	},
	'useres.create':function(info){
		console.log(info);
		info.roles='user';
		id = Accounts.createUser(info);
		console.log(id);
		if(id){
			Roles.addUsersToRoles(id, 'user');
			return {'error':0};
		}else{
			return {error:1};
		}
	},
	'users.modifyremark':function(id,remark){
		currentuserid = this.userId;
		//friend = friends.fineOne({ownerid:currentuserid,'friend.id':id});
		console.log(currentuserid,id);
		console.log(friends.findOne({ownerid:currentuserid,'friend.id':id}))
		friends.update({ownerid:currentuserid,'friend.id':id},{$set:{'friend.remark':remark}})
	},
	'users.delete':function(id){
		user = Meteor.users.findOne({_id:id});
		if(user){
			Meteor.users.update({_id:id},{$set:{isdelete:1}});
			return true;
		}else{
			return false;
		}
	}
})