Template.addGroup.helpers({
	friends:function(){
		curuser  = Meteor.user();
		friends = [];
		if(curuser){
			if(_.has(curuser,'friend')){
				 friends = curuser.friend;
			}
		}
		return friends;
	}
});
Template.addGroup.events({
	'submit form':function(event,template){
		event.preventDefault();
		groupname = event.target.groupname.value;
		if(groupname === ""){
			sAlert.error('群组名称必填',{position:'bottom-left'});
			return ;
		}
		addselectedfriend = template.$('.selected');
		addselectedfriendids = [];
		if(addselectedfriend.length <=0){

		}else{
			_.each(addselectedfriend,function(val,key){
				id = $(val).data('id');
				username = $(val).text();
				obj = {id:id,username:username}
				addselectedfriendids.push(obj);
			})
		}
		Meteor.apply('groups.create',[groupname,addselectedfriendids],function(err,res){
			if(err){
				sAlert.error('创建群组失败',{position:'bottom-left'});
			}else{
				if(!res){
					sAlert.error('创建群组失败',{position:'bottom-left'});
				}else{
					sAlert.success('创建群组成功,2秒后跳转到首页',{position:'bottom-left'});
					Meteor.setTimeout(function(){
						Router.go('home');
					},2000);
				}
			}
		})
		
	},
	'click .friends-list':function(event,template){
		event.preventDefault();
		event.target.classList.add('selected')
		
	},
	'click #add':function(event,template){
		event.preventDefault();
		addselectedfriend = template.$('.selected');
		addselectedfriendids = {};
		_.each(addselectedfriend,function(val,key){
			addselectedfriendids[$(val).data('id')] = $(val).text();
		})
		console.log(addselectedfriendids);
		choose = Session.get('chooseids');
		if(choose){
			_.each(addselectedfriendids,function(val,key){
				console.log('val',val);
				if(_.indexOf(choose,val) == -1){
					choose.push(val);
					template.$('.choose-list').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')
				}
			})
			
			
		}else{
			choose = [event.target.dataset.id];
			_.each(addselectedfriendids,function(val,key){
				console.log('val1',val);
				if(_.indexOf(choose,val) == -1){
					choose = [];
					choose.push(val);
					template.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')
				}
			})
		}
		Session.set('chooseids',choose);
	},
	'click #del':function(event,template){
		event.preventDefault();
		delselectedfriend = template.$('.delselected');
		delselectedfriendids = {};
		_.each(delselectedfriend,function(val,key){
			delselectedfriendids[$(val).data('id')] = $(val).text();
		})
		console.log(delselectedfriendids);
		choose = Session.get('chooseids');
		if(choose){
			_.each(delselectedfriendids,function(val,key){
				console.log(key)
				if(_.indexOf(choose,val) !== -1){
					choose.pop(val);
					template.$('.friends-list[data-id="'+key+'"]').removeClass('selected');
					template.$('.choose-list[data-id="'+key+'"]').remove();
				}
			})
			
			
		}
		Session.set('chooseids',choose);
		template.$('.choose-list[data-id="Kd8GNPq2wHcC3y7T"]')
	},
	'click .choose-list':function(event,template){
		event.preventDefault();
		if(event.target.dataset.id == Meteor.userId()){
			sAlert.error('不能选中自己',{position:'bottom-left'});
		}else{
			event.target.classList.add('delselected')

		}
	}
});
Template.grouplist.onCreated(function(){
	Meteor.subscribe('groups');
})
Template.grouplist.helpers({
	grouplist:function(){
		page = this.page;
		count = group.find({}).count();
		pagesize = 10;
		pagenum = Math.ceil(count/pagesize);
		if(page<=1){
			page=1;
		}
		if(page>=pagenum){
			page= pagenum;
		}
		skip = (page-1)*pagesize;
		userid = Meteor.userId();
		r = group.find({},{sort:{createAt:-1},skip:skip,limit:pagesize,transform(obj){
			if(_.has(obj,'member')){
				obj.nums = obj.member.length+1;
			} else{
				obj.nums = 1;
			}
			return obj;
		}}).fetch();
		console.log(r);
		return r;
	},
	dateFormat:function(date){
		return moment(date).format('YYYY-MM-DD');
	}

})