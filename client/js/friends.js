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
				if(!res){
					sAlert.error('添加好友失败',{position:'bottom-left'});
				}else{
					sAlert.success('添加好友成功', {position:'bottom-left'});
					Meteor.setTimeout(function(){
						Router.go('home');
					},2000)
				}
			}
		})
	}
})

Template.addFriend.helpers({
	searchlist:function(){
		name = Session.get('friendssearch');
		res = [];
		currentuser = Meteor.user();
		ids = [];
		if(currentuser){
			ids.push(Meteor.userId());
		if(_.has(currentuser,'friend')){
			_.each(currentuser.friend,function(val,key){
				ids.push(val.id);
			})
		}
		}
		console.log(ids);
		if(name){
			res =  Meteor.users.find({$and:[{$or:[{username:{$regex:new RegExp(name)},'profile.nickname':{$regex:new RegExp(name)}}]}],_id:{$nin:ids}}).fetch();

		}
		return res;
	}
})