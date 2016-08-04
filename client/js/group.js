Template.addGroup.onCreated(function(){
	Meteor.subscribe('allusers');
	Meteor.subscribe('allfriends');
})
Template.addGroup.helpers({
	friends:function(){
		curuser  = Meteor.user();
		friends = [];
		if(curuser){
			friends = cfriends.find({}).fetch();
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
Template.groupchat.onCreated(function(){
	Meteor.subscribe('groups');
	Meteor.subscribe('allusers');
	Meteor.subscribe('chatlogs',this.data.groupid);
});
/*Template.groupchat.onRendered(function(){
	template = this;
	this.autorun(function(c){
		console.log(template._allSubsReady)
		if(template.subscriptionsReady()){
			console.log(cchatlog.find().count())
		curgroup = cgroup.findOne({_id:template.data.groupid});
		console.log(curgroup);
		if(!curgroup){
			console.log('abc');
			BlazeLayout.render('mainLayout',{main:'datanotfound'});
		}
		}
		
	})
})*/
Template.groupchat.helpers({
	logs:function(){
			if (Template.instance().subscriptionsReady()){
				curuserid = Meteor.userId();
				if(curuserid){
					curgroup = cgroup.findOne({_id:this.groupid});
					console.log(curgroup);
					//if(!curgroup){
					//	BlazeLayout.render('mainLayout',{main:'datanotfound'});
					//}else{
						return cchatlog.find({type:'group'},{transform:function(obj){
							obj.isowner = false;
							if(obj.from == Meteor.userId()){
								obj.isowner= true;
							}
							return obj;
						}}).fetch();
//
						
					
					
				}else{
					Router.go('login');
				}
			}
			
				
		
	}
});
Template.groupchat.events({
		'click #send':function(event,template){
		event.preventDefault();
		console.log(template.data)
		message = $.trim($('#summernote').summernote('code'));
		if(message == ""){

		}else{
			/*if(message.length>6000){
				sAlert.error('聊天内容不能超过6000字',{position:"bottom-left"});
				return;
			}else{*/
				to = template.data.groupid;
				Meteor.apply('chatlog.createGroupChat',[message,to],function(err,res){
					if(err){
						sAlert.error('消息发送失败',{position:'bottom-left'});
					}else{
						if(!res){
							sAlert.error('消息发送失败',{position:'bottom-left'});
						}else{
							$('#summernote').summernote('reset');
							Meteor.setTimeout(function(){
								scrolltops = $('#chatlogs').prop('scrollHeight');
								if(scrolltops){
									console.log('a');
									$('#chatlogs').scrollTop(scrolltops)
								}
							},500)
							
						}
					}
				})
			//}
			
		}
	}
})
Template.grouplist.onCreated(function(){
	Meteor.subscribe('groups');
})
Template.grouplist.helpers({
	grouplist:function(){
		page = this.page;
		count = cgroup.find({}).count();
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
		r = cgroup.find({},{sort:{createAt:-1},skip:skip,limit:pagesize,transform(obj){

			if(_.has(obj,'member')){
				obj.nums = obj.member.length+1;
			} else{
				obj.nums = 1;
			}
			return obj;
		}}).fetch();

		return r;
	},
	pagerdata:function(){
		count = cgroup.find({}).count();
		routename = "usergroups";
		return {'count':count,'routename':routename};
	},
	dateFormat:function(date){
		return moment(date).format('YYYY-MM-DD');
	}

})