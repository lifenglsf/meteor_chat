Template.adminuserlist.onCreated(function(){
	Meteor.subscribe('allusers');
});
Template.adminuserlist.helpers({
	'userlist':function(){
		currentuser = Meteor.user();
		user = [];
		if(currentuser){
			page = this.page;
			count = Meteor.users.find({}).count();
			pagesize = 10;
			pagenum = Math.ceil(count/pagesize);
			if(page<=1){
				page=1;
			}
			if(page>=pagenum){
				page= pagenum;
			}
			skip = (page-1)*pagesize;
				return Meteor.users.find({},{sort:{createAt:-1},skip:skip,limit:pagesize})
			}
		return [];
	},
	pagerdata:function(){
		count = friends.find({}).count();
		routename = "adminuserlist";
		return {'count':count,'routename':routename};
	}
});
Template.adminuserlist.events({
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