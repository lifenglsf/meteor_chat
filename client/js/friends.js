Template.userlist.onCreated(function(){
	Meteor.subscribe('allusers');
	Meteor.subscribe('allfriends');
});
Template.userlist.helpers({
	'userlist':function(){
		currentuser = Meteor.user();
		myfriend = [];
		page = this.page;
		count = cfriends.find({}).count();
		pagesize = 10;
		pagenum = Math.ceil(count/pagesize);
		if(page<=1){
			page=1;
		}
		if(page>=pagenum){
			page= pagenum;
		}
		skip = (page-1)*pagesize;
		friend = cfriends.find({},{sort:{createAt:-1},skip:skip,limit:pagesize}).fetch();
		console.log(friend);
		if(currentuser){
			_.each(friend,function(val,key){
				
					myfriend[key] = val.friend;
					user = Meteor.users.findOne({_id:val.friend.id});
					myfriend[key]['nickname'] = user.profile.nickname;
					
				
			})
		}
		return myfriend;
	},
	pagerdata:function(){
		count = cfriends.find({}).count();
		routename = "myfriends";
		return {'count':count,'routename':routename};
	}
});
Template.userlist.events({
	'click .showmodal':function(event,template){
		event.preventDefault();
		remark = event.target.dataset.remark;
		id = event.target.dataset.id;
		template.$('#myModal').on('show.bs.modal', function (ev) {
		  var modal = $(this);
		  modal.find('.modal-footer .btn-primary').attr('data-id',id);
		  modal.find('.modal-body input').val(remark)
		});
		template.$('#myModal').on('hidden.bs.modal', function (ev) {
		  var modal = $(this);
		  modal.find('.modal-footer .btn-primary').removeAttr('data-id');
		  modal.find('.modal-body input').val('')
		});
		$('#myModal').modal('show');
	},
	'click  .btn-primary':function(event,template){
		event.preventDefault();
		id = event.target.dataset.id;
		remark = template.$('#remark').val();
		Meteor.apply('users.modifyremark',[id,remark],function(err,res){
			console.log(err);
			if(err){
				sAlert.error('备注失败',{position:'bottom-left'});
			}else{
				$('#myModal').modal('hide');
			}
		});
		
	},
	'click .delfriends':function(event,template){
		event.preventDefault();
		if(confirm('确认要删除这个好友吗')){
			//删除好友
		}
	}
})
Template.addFriend.onCreated(function(){
	Tracker.autorun(function(){
		Meteor.subscribe('allusers',{onReady:function(){
			Session.set('loaduserread',true);}
		});
		Meteor.subscribe('allfriends');
	})
})
Template.addFriend.events({
	'submit form'(event,template){
		event.preventDefault();
		name = event.target.names.value;
		Session.set('friendssearch',name);	
	},
	'click .addFriends'(event,template){
		event.preventDefault();
		id = event.target.dataset.id;
		Meteor.apply('friends.add',[id],function(err,res){
			if(err){
				sAlert.error('添加好友失败',{position:'bottom-left'});
			}else{
				if(res.error){
					sAlert.error(res.reason,{position:'bottom-left'});
				}else{
					sAlert.success('添加好友成功', {position:'bottom-left'});
					/*Meteor.setTimeout(function(){
						Router.go('home');
					},2000)*/
				}
			}
		})
	}
})

Template.addFriend.helpers({
	searchlist:function(){
		name = Session.get('friendssearch');
		res = [];
		friend = cfriends.find({}).fetch();
		currentuser = Meteor.user();
		ids = [];
		if(currentuser){
			ids.push(Meteor.userId());
			_.each(friend,function(val,key){
				if(_.has(val,'friend')){
						ids.push(val.friend.id);
				}
			})
			
		}
		console.log(ids);
		if(name){
			res =  Meteor.users.find({$and:[{$or:[{username:{$regex:new RegExp(name)},'profile.nickname':{$regex:new RegExp(name)}}]}],_id:{$nin:ids}}).fetch();

		}
		return res;
	}
})