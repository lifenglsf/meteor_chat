Template.addGroup.onCreated(function(){
	Meteor.subscribe('allusers');
	Meteor.subscribe('allfriends');
})
Template.addGroup.helpers({
	friends:function(){
		curuser  = Meteor.user();
		friends = [];
		if(curuser){
			friends = cfriends.find({isdelete:{$ne:1}}).fetch();
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
		chooselist = template.$('.choose-list');
		choose = [];
		_.each(chooselist,function(val,key){
			choose.push($(val).data('id'));
		})
		//choose = Session.get('chooseids');
		if(choose){
			_.each(addselectedfriendids,function(val,key){
				console.log('val',val);
				if(_.indexOf(choose,val) == -1){
					choose.push(val);
					template.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')
				}
			})


		}else{
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
Template.groupchat.onRendered(function(){
	template = this;
	this.autorun(function(c){
		if(template.subscriptionsReady()){
			Tracker.afterFlush(function(){
				Meteor.setTimeout(function(){
					scrolltops = $('#chatlogs').prop('scrollHeight');
					console.log(scrolltops);
					if(scrolltops){
						console.log('a');
						$('#chatlogs').scrollTop(scrolltops)
					};
				},1000)

			})
		}

	})
})
Template.groupchat.helpers({
	logs:function(){
			if (Template.instance().subscriptionsReady()){
				curuserid = Meteor.userId();
				groupid = this.groupid;
				console.log(groupid)
				if(curuserid){
					return cchatlog.find({type:'group',to:groupid},{transform:function(obj){
						obj.isowner = false;
						if(obj.from == Meteor.userId()){
							obj.isowner= true;
						}
						return obj;
					}}).fetch();

				}else{
					Router.go('login');
				}
			}



	},
	members:function(){
			if (Template.instance().subscriptionsReady()){
				curuserid = Meteor.userId();
				groupid = this.groupid;
				if(curuserid){
					group = cgroup.findOne({_id:groupid});
					member = group.member;
					manager = group.manager;
					_.each(member,function(val,index){
						val['ismanager'] = 0;
						val['ismember'] = 1;
						val['isowner'] = 0;
						if(val.id == group.owner){
							val = null
						}
						_.each(manager,function(v,i){
							if(v.id == val.id){
								val['ismanager'] = 1;
								val['ismember'] = 0;
							}
						})
					})
					len = member.length
					console.log(len)
					member[len] = {}
					member[len]['id'] = group.owner;
					member[len]['username'] = group.ownername
					member[len]['isowner'] = 1
					member[len]['ismember'] = 0
					member[len]['ismanager'] = 0
					return member;
				}else{
					Router.go('login');
				}
			}
	}
});
Template.groupchat.events({
		'click #send':function(event,template){
		event.preventDefault();
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
});
Template.groupedit.helpers({
	group:function(){
		groupid = this.groupid;
		return cgroup.findOne({_id:groupid});
	},
	friends:function(){
		curuser  = Meteor.user();
		friends = [];
		groupid = this.groupid;
		ids = [];
		curgroup = cgroup.findOne({_id:groupid},{transform(obj){
			_.each(obj.member,function(val,key){
				ids.push(val.id);
			})
			return obj;
		}})
		if(curuser){
			friends = cfriends.find({'friend.id':{$nin:ids},'isdelete':{$ne:1}}).fetch();
		}
		return friends;
	}
})
Template.groupedit.events({
	'submit form':function(event,template){
		event.preventDefault();
		groupname = event.target.groupname.value;
		if(groupname === ""){
			sAlert.error('群组名称必填',{position:'bottom-left'});
			return ;
		}
		addselectedfriend = template.$('.choose-list').not('.delselected');
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
		Meteor.apply('groups.edit',[template.data.groupid,groupname,addselectedfriendids],function(err,res){
			if(err){
				sAlert.error('编辑群组失败',{position:'bottom-left'});
			}else{
				if(!res){
					sAlert.error('编辑群组失败',{position:'bottom-left'});
				}else{
					sAlert.success('编辑群组成功,2秒后跳转到首页',{position:'bottom-left'});
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
		chooselist = template.$('.choose-list').not('.delselected');
		debugger;
		choose = [];
		_.each(chooselist,function(val,key){
			choose.push($(val).data('id'));
		})
		//
		if(choose){
			_.each(addselectedfriendids,function(val,key){
				console.log('val',key);
				if(_.indexOf(choose,key) == -1){
					choose.push(key);
					template.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')
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
		chooselist = template.$('.choose-list').not('.delselected');
		//debugger;
		choose = [];
		_.each(chooselist,function(val,key){
			choose.push($(val).data('id'));
		})
		if(choose){
			_.each(delselectedfriendids,function(val,key){
				console.log(key)
				//if(_.indexOf(choose,key) !== -1){
				//	choose.pop(key);
					if(template.$('#friends-lists>li')){
						if(template.$('.friends-list[data-id="'+key+'"]').length){
							template.$('.friends-list[data-id="'+key+'"]').removeClass('selected');
						}else{
							debugger;
							template.$('.friends-list:last').after('<li class="friends-list" data-id="'+key+'">'+val+'</li>')
						}
					}else{
						template.$('.friends-list:last').html('<li class="friends-list" data-id="'+key+'">'+val+'</li>')
					}
					//template.$('.choose-list[data-id="'+key+'"]').remove();
				//}
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

Template.groupmanager.helpers({
	group:function(){
		groupid = this.groupid;
		return cgroup.findOne({_id:groupid},{transform(obj){
			userid = Meteor.userId();
			if(_.has(obj,'member')){
				_.each(obj.member,function(val,key){
					//if(val.id !== userid || val.id !=obj.owner){
						val.ismember=true
					//}
				})
			}
			return obj;
		}});
	},
	friends:function(){
		curuser  = Meteor.user();
		friends = [];
		groupid = this.groupid;
		ids = [];
		curgroup = cgroup.findOne({_id:groupid},{transform(obj){
			_.each(obj.member,function(val,key){
				ids.push(val.id);
			})
			return obj;
		}})
		if(curuser){
			friends = cfriends.find({'friend.id':{$nin:ids},isdelete:{$ne:1}}).fetch();
		}
		return friends;
	}
})
Template.groupmanager.events({
	'submit form':function(event,template){
		event.preventDefault();
		addselectedfriend = template.$('.choose-list');
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
		if(!addselectedfriendids.length){
			sAlert.error('必须选择管理员',{position:'bottom-left'});
		}else{
			Meteor.apply('groups.setmanager',[template.data.groupid,addselectedfriendids],function(err,res){
				if(err){
					sAlert.error('管理员设置失败',{position:'bottom-left'});
				}else{
					if(!res){
						sAlert.error('管理员设置失败',{position:'bottom-left'});
					}else{
						sAlert.success('管理员设置成功,2秒后跳转到首页',{position:'bottom-left'});
						Meteor.setTimeout(function(){
							Router.go('home');
						},2000);
					}
				}
			})
		}


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
		chooselist = template.$('.choose-list');
		choose = [];
		_.each(chooselist,function(val,key){
			choose.push($(val).data('id'));
		})
		//
		if(choose){
			_.each(addselectedfriendids,function(val,key){
				console.log(choose,key);
				if(_.indexOf(choose,key) == -1){
					choose.push(key);
					if(template.$('.choose-list').length){
						template.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')

					}else{
						template.$('#managerlist').html('<li class="choose-list" data-id="'+key+'">'+val+'</li>')

					}
					//template.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')
				}
			})


		}else{
			_.each(addselectedfriendids,function(val,key){
				console.log('val1',val);
				if(_.indexOf(choose,val) == -1){
					choose = [];
					choose.push(val);
					if(template.$('.choose-list').length){
						emplate.$('.choose-list:last').after('<li class="choose-list" data-id="'+key+'">'+val+'</li>')

					}else{
						template.$('#managerlist').html('<li class="choose-list" data-id="'+key+'">'+val+'</li>')

					}
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
		chooselist = template.$('.choose-list').not('.delselected');
		choose = [];
		_.each(chooselist,function(val,key){
			choose.push($(val).data('id'));
		})
		if(choose){
			_.each(delselectedfriendids,function(val,key){
				console.log(key)
				//if(_.indexOf(choose,key) !== -1){
				//	choose.pop(key);
					if(template.$('#friends-lists>li')){
						if(template.$('.friends-list[data-id="'+key+'"]')){
							template.$('.friends-list[data-id="'+key+'"]').removeClass('selected');
						}else{
							template.$('.friends-list:last').after('<li class="friends-list" data-id="'+key+'">'+val+'</li>')
						}
					}else{
						template.$('.friends-list:last').html('<li class="friends-list" data-id="'+key+'">'+val+'</li>')
					}
					template.$('.choose-list[data-id="'+key+'"]').remove();
				//}
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
	grouplists:function(){
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
			userid = Meteor.userId();
			obj.isadmin = false;
			obj.isowner = false;
			console.log(obj.owner == userid)
			if(userid == obj.owner){
				obj.isadmin = true;
				obj.isowner = true;
			}
			if(_.has(obj,'manager')){
				_.each(obj.manager,function(val,key){
					if(val.id == userid){
						obj.isadmin = true;
					}
				})
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
