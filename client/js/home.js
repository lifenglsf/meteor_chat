Template.home.events({
	'click .ops'(event){
		console.log(this)
		event.preventDefault();
		operate = event.target.attributes['data-op'].value;
		switch(operate){
			case 'logout':
				Meteor.logout();
				break;
			case 'password':
				Router.go('changepassword');
				break;
			case 'groups':
				Router.go('addgroup');
				break;
			case 'friends':
				Router.go('addfriends');
				break;
		}
		console.log(event.target)
	},
	'click .friends-list':function(event,template){
		event.preventDefault();
		id = event.target.dataset.id;
		Router.go('/chattoperson/'+id);
	}
});
Template.home.helpers({
	friends:function(){
		curuser  = Meteor.user();
		friend = [];
		if(curuser){
			friend =cfriends.find({isdelete:{$ne:1}},{sort:{createAt:-1},skip:0,limit:10}).fetch({})
		}
		console.log(friend);
		return friend;

	},
	groups:function(){
		groups = cgroup.find({},{sort:{createAt:-1},skip:0,limit:10}).fetch();
		return groups;
	},
	historychatfriends:function(){
		historychatfriends = [];
		ids = [];
		chatlogs = cchatlog.find({}).fetch();
		_.each(chatlogs,function(val,key){
			if(val.from != Meteor.userId()){
				if(_.indexOf(ids,val.from) ==-1){
					ids.push(val.from);
					historychatfriends.push({_id:val.from,username:val.fromusername});
				}

			}
			if(val.to != Meteor.userId()){
				if(_.indexOf(ids,val.to) == -1){
					ids.push(val.to);
					historychatfriends.push({_id:val.to,username:val.tousername});
				}

			}
		})
		_.uniq(historychatfriends);
		return historychatfriends;
	},
	username:function(){
		return Meteor.user().username;
	}
})
Template.home.onCreated(function () {
	Tracker.autorun(function(){
		Meteor.subscribe('groups');
		Meteor.subscribe('chatlogs');
		Meteor.subscribe('allusers');
		Meteor.subscribe('allfriends');
	})
})
Template.home.onRendered(function(){
	console.log('rendered');
})

Template.password.events({
	'click #back'(event){
		Router.go('home');
	},
	'blur #opassword'(event){
		event.preventDefault();
		currentval = event.target.value;
		if(currentval === ""){
			sAlert.error('原密码不能为空',{position:'bottom-left'});
			return;
		}
		Meteor.apply('users.checkpassword',[currentval],true,function(err,result){
			if(err){
				sAlert.error('原密码错误',{position:'bottom-left'});
				$('#subs').attr('disabled',true);
			}else{
				if(result.error){
					sAlert.error(result.msg,{position:'bottom-left'});
					$('#subs').attr('disabled',true);
				}else{
					$('#subs').attr('disabled',false);

				}

			}

		})
	},
	'blur #orepassword'(event,template){
		event.preventDefault();
		ovalue = template.$('#opassword').val();
		currentval = event.target.value
		if(currentval === ""){
			sAlert.error('原确认密码不能为空',{position:'bottom-left'});
			return;
		}
		if(currentval !== ovalue){
			sAlert.error('两次原密码输入不一致',{position:'bottom-left'});
			template.$('#subs').attr('disabled',true);
			console.log(template.$('#sub'))
			return;
		}

		template.$('#subs').attr('disabled',false);

	},
	'blur #npassword'(event,template){
		event.preventDefault();
		template.$('#subs').attr('disabled',false);
		ovalue = template.$('#opassword').val();
		currentval = event.target.value
		if(currentval === ""){
			sAlert.error('新密码不能为空',{position:'bottom-left'});
			template.$('#subs').attr('disabled',true);
			return;
		}
		if(currentval === ovalue){
			sAlert.error('原密码和新密码不能一致',{position:'bottom-left'});
			template.$('#subs').attr('disabled',true);
			return;
		}

		template.$('#subs').attr('disabled',false);
	},
	'blur #nrepassword'(event,template){
		event.preventDefault();
		template.$('#subs').attr('disabled',false);
		nvalue = template.$('#npassword').val();
		currentval = event.target.value
		if(currentval === ""){
			sAlert.error('新确认密码不能为空',{position:'bottom-left'});
			template.$('#subs').attr('disabled',true);
			return;
		}
		if(currentval !== nvalue){
			sAlert.error('两次新密码输入不一致',{position:'bottom-left'});
			template.$('#subs').attr('disabled',true);
			return;
		}
		template.$('#subs').attr('disabled',false);
	},
	'submit form'(event,template){
		event.preventDefault();
		template.$('#subs').attr('disabled',true);
		opassword = template.$('#opassword').val();
		orepassword = template.$('#orepassword').val();
		npassword = template.$('#npassword').val();
		nrepassword = template.$('#nrepassword').val();
		if(opassword === ""){
			sAlert.error('原密码不能为空',{position:'bottom-left'});
			return;
		}

		if(orepassword === ""){
			sAlert.error('原确认密码不能为空',{position:'bottom-left'});
			return;
		}

		if(npassword === ""){
			sAlert.error('新密码不能为空',{position:'bottom-left'});
			return;
		}

		if(nrepassword === ""){
			sAlert.error('新确认密码不能为空',{position:'bottom-left'});
		}
		if(opassword !== orepassword){
			sAlert.error('两次原密码输入不一致',{position:'bottom-left'});
			return;
		}
		if(npassword !== nrepassword){
			sAlert.error('两次新密码输入不一致',{position:'bottom-left'});
			return;
		}
		if(npassword === opassword){
			sAlert.error('原密码和新密码不能一致',{position:'bottom-left'});
			return;
		}
		result = Meteor.apply('users.checkpassword',[opassword],function(err,res){
			console.log(err,res);
			if(err){
				sAlert.error('原密码错误',{position:'bottom-left'});
				return;
			}
			if(_.has(res,'error') && res.error){
				sAlert.error('原密码错误',{position:'bottom-left'});
				return;
			}else{
				Meteor.apply('users.changepassword',[npassword],true,function(err,result){
					if(err){
						sAlert.error('密码修改失败',{position:'bottom-left'});
						return;
					}
					var sAlertId = sAlert.success('密码修改成功', {position:"bottom-left",onClose: function() {Router.go('home')}});
					//sAlert.close(sAlertId);
				})
			}

		});



	}
})

