Template.admindepartlist.onCreated(function(){
	Meteor.subscribe('alldeparts');
});
Template.admindepartlist.helpers({
	pagerdata:function(){
		count = depart.find({}).count();
		routename = "admindepartlist";
		return {'count':count,'routename':routename};
	},
	departlist:function(){
		currentuser = Meteor.user();
		user = [];
		if(currentuser){
			page = this.page;
			count = cdepart.find({}).count();
			pagesize = 10;
			pagenum = Math.ceil(count/pagesize);
			if(page<=1){
				page=1;
			}
			if(page>=pagenum){
				page= pagenum;
			}
			skip = (page-1)*pagesize;
				return cdepart.find({},{sort:{createAt:-1},skip:skip,limit:pagesize})
			}
		return [];
	}
});
Template.admindepartlist.events({
	'click .deldepart':function(event,template){
		event.preventDefault();
		console.log('eee');
		id = event.target.dataset['id'];
		if(confirm('去人要删除这个部门吗')){
			Router.go('/admin/depart/del/'+id);
		}
	}
});
Template.admindepartedit.onCreated(function(){
	Meteor.subscribe('alldeparts');
})
Template.admindepartedit.helpers({
	departs:function(){
		console.log('abc')
		departid = this.id;
		return cdepart.findOne({_id:departid});
	}
});
Template.admindepartedit.events({
	'submit form':function(event,template){
		event.preventDefault();
		departname = $.trim(event.target.departname.value);
		if(departname == ""){
			sAlert.error('部门名称不能为空',{position:'bottom-left'});
			return false;
		}
		Meteor.apply('depart.update',[this.id,departname],function(err,res){
			if(err){
				sAlert.error('部门修改失败',{position:'bottom-left'});
				return false;
			}else{
				if(!res){
					sAlert.error('部门修改失败',{position:'bottom-left'});
					return false;
				}else{
					sAlert.success('部门修改成功',{position:'bottom-left'});
					console.log(res);
					event.target.reset();
					return;
				}
			}
		})
	}
})
Template.admindepartadd.events({
	'submit form':function(event,tempate){
		event.preventDefault();
		departname = $.trim(event.target.departname.value);
		if(departname == ""){
			sAlert.error('部门名称不能为空',{position:'bottom-left'});
			return false;
		}
		Meteor.apply('depart.add',[departname],function(err,res){
			if(err){
				sAlert.error('部门添加失败',{position:'bottom-left'});
				return false;
			}else{
				if(!res){
					sAlert.error('部门添加失败',{position:'bottom-left'});
					return false;
				}else{
					sAlert.success('部门添加成功',{position:'bottom-left'});
					console.log(res);
					event.target.reset();
					return;
				}
			}
		})
	}
})