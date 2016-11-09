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
	},
	'groups.edit':function(groupid,groupname,member){
		if(this.userId){
			console.log(1);
			user = Meteor.user();
			username = user.username
			currentgroup = cgroup.findOne({_id:groupid});
			membersid = [];
			_.each(member,function(val,key){
				membersid.push(val.id);
			})
			managers = {};
			if(currentgroup){
				manager = [];
				if(_.has(currentgroup,'manager')){
					_.each(currentgroup.manager,function(val,key){
						if(_.indexOf(membersid,val.id) !== -1){
							managers[key] = {id:val.id,username:val.username}
						}
					})
					id = cgroup.update({_id:groupid},{$set:{groupname:groupname,member:member,manager:managers}});
				}else{
					id = cgroup.update({_id:groupid},{$set:{groupname:groupname,member:member}});
				}
				
				if(id){
					console.log(2);
					return true;
				}else{
					console.log(3)
					return false;
				}
			}else{
				return false;
			}
			
		}else{
			console.log(4);
			return false;
			
		}
	},
	'groups.setmanager':function(groupid,manager){
		if(this.userId){
			console.log(1);
			user = Meteor.user();
			username = user.username
			id = cgroup.update({_id:groupid},{$set:{manager:manager}});
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
	},
	'groups.delete':function(groupid){
		if(this.userId){
			console.log(1);
			user = Meteor.user();
			username = user.username
			currentgroup = cgroup.findOne({_id:groupid});
			console.log(!_.has(currentgroup,"isdelete"));
			if(currentgroup){
				if(this.userId != currentgroup.owner || (_.has(currentgroup,"isdelete"))){
					return -3;
				}else{
					res = cgroup.update({_id:groupid},{$set:{isdelete:1}});
					cchatlog.remove({to:groupid});//删除聊天记录
					console.log(res);
					return true;
				}
				
			}else{
				console.log(3)
				return -2;
			}
		}else{
			console.log(4);
			return -1;
			
		}
	}

})