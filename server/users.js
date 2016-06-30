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
	'users.checkpasswordbyquery':function(password){
		var user = Meteor.users.findOne({_id:this.userId,password:password});
		console.log(this.userId,password);
		if(user){
			return true;
		}else{
			return false;
		}
	},
	'users.changepassword':function(password){
		r = Accounts.setPassword(this.userId,password,{logout:false});
		console.log(r);
		return r;
	}
})