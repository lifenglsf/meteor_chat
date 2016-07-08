Template.userlist.onCreated(function(){
	Meteor.subscribe('allusers');
});
Template.userlist.helpers({
	'userlist':function(){
		currentuser = Meteor.user();
		friend = [];
		friend = friends.find({}).fetch();
		if(currentuser){
			_.each(friend,function(val,key){
					user = Meteor.users.findOne({_id:val.friend.id});
					console.log(user);
					friend[key]['friend']['nickname'] = user.profile.nickname;
				
			})
		}
		return friend;
	},
	pagerdata:function(){
		count = friends.find({}).count();
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
			if(err){
				sAlert.error('备注失败',{position:'bottom-left'});
			}
		});
		$('#myModal').modal('hide');
	}
})