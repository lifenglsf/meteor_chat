//BlazeLayout.setRoot("#body");
Router.configure({
	//notFoundTemplate: '404',
})

Router.route('/login',function(){
	userId = Meteor.userId();
	if(userId){
		Router.go('home');
	}else{
		BlazeLayout.render('mainLayout', {main: "login" });
	}
})
Router.route('/',function(){
	Router.go('home');
})
Router.route('/register',function(){
	userId = Meteor.userId();
	if(userId){
		Router.go('home');
	}else{
		BlazeLayout.render('mainLayout', {main: "reg" });
		//this.render('reg');
	}
})
Router.route('/home',{
	action:function(){
		if(this.ready){
			userId = Meteor.userId();
			if(userId){
				//BlazeLayout.setRoot("#body");
				BlazeLayout.render('mainLayout', {main: "home" });
			}else{
				Router.go('login');
			}
		}else{
			//this.render('Loading');
		}
	}
})
Router.route('/changepassword',{
	'action':function(){
	userId = Meteor.userId();
		if(userId){
			BlazeLayout.render('mainLayout', {main: "password" });
		}else{
			Router.go('login');
		}
	}
})

Router.route('/addgroup',{
	'action':function(){
		Session.set('chooseids','');
	userId = Meteor.userId();
		if(userId){
			BlazeLayout.render('mainLayout', {main: "addGroup" });
		}else{
			Router.go('login');
		}
	}
})

Router.route('/addfriends',{
	'action':function(){
		Session.set('friendssearch','');
		userId = Meteor.userId();
		if(userId){
			BlazeLayout.render('mainLayout', {main: "addFriend" });
		}else{
			Router.go('login');
		}
	}
});
Router.route('/chattoperson/:_id',{
	action:function(){
		id = this.params._id;
		console.log(id);
		userId = Meteor.userId();
		if(userId){
			BlazeLayout.render('mainLayout',{main:'chattoperson',params:{toid:id}});
		}else{
			Router.go('login');
		}
	}
});
Router.route('/user/:page?',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			if(this.params.page == undefined){
				page = 1;
			}else{
				page = this.params.page;
			}
			BlazeLayout.render('mainLayout',{main:'userlist',params:{page:page,templatename:'userlist'}});
		}else{
			Router.go('login');
		}
	},
	name:'myfriends'
});
Router.route('/user/del/:_id',{
	action:function(){
		id = this.params._id;
		Meteor.apply('friends.delete',[id],function(err,res){
			console.log(err,res)
			if(err){
				console.log(err);
				BlazeLayout.render('mainLayout',{main:'403'});
			}else if(res.error){
				BlazeLayout.render('mainLayout',{main:'success'});
			}else{
				console.log(res.msg);
				BlazeLayout.render('mainLayout',{main:'errmsg',params:{errmsg:res.msg}});
			}
		})
	}
})
Router.route('/groups/:page?',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			console.log(this.params.page)
			if(this.params.page == undefined){
				page = 1;
			}else{
				page = this.params.page;
			}
			BlazeLayout.render('mainLayout',{main:'grouplist',params:{page:page,templatename:'grouplist'}});
		}else{
			Router.go('login');
		}
	},
	name:'usergroups'
});
Router.route('/group/edit/:_id',{
	action:function(){
		if (this.ready()) {
			console.log('ready');
            userId = Meteor.userId();
			if(userId){
				groupid = this.params._id;
				currentgroup = cgroup.findOne({_id:groupid});
				if(!currentgroup){
					BlazeLayout.render('mainLayout',{main:'datanotfound'});
				}else{
					administrator = [];
					administrator.push(currentgroup.owner);
					if(_.has(currentgroup,'manager')){
						_.each(currentgroup.manager,function(val,key){
							administrator.push(val.id);
						})

					}
					if(_.indexOf(administrator,userId) == -1){
						BlazeLayout.render('mainLayout',{main:'403'});
					}else{
						BlazeLayout.render('mainLayout',{main:'groupedit',params:{groupid:groupid}});
					}

				}

			}else{
				Router.go('login');
			}
        }

	},
	subscriptions:function(){
		this.subscribe('groups').wait();
		this.subscribe('allusers').wait();
		this.subscribe('allfriends').wait();
	}
});
Router.route('/group/del/:_id',{
	action:function(){
		groupid = this.params._id;
		Meteor.apply('groups.delete',[groupid],function(err,res){
			if(err){
				console.log(err);
				BlazeLayout.render('mainLayout',{main:'403'});
			}else if(res == -1){
				Router.go('login');
			}else if(res ==1){
				BlazeLayout.render('mainLayout',{main:'success'});
			}else if(res == -2){
				BlazeLayout.render('mainLayout',{main:'datanotfound'});
			}else{
				BlazeLayout.render('mainLayout',{main:'403'});
			}
		})

	}
});
Router.route('/group/setmanage/:_id',{
	action:function(){
		groupid = this.params._id;
		BlazeLayout.render('mainLayout',{main:'groupmanager',params:{groupid:groupid}});

	},
	subscriptions:function(){
		this.subscribe('groups').wait();
		this.subscribe('allusers').wait();
		this.subscribe('allfriends').wait();
	}
});
Router.route('/group/chat/:_id',{
	action:function(){
		if (this.ready()) {
			console.log('ready');
            userId = Meteor.userId();
			if(userId){
				groupid = this.params._id;
				if(!cgroup.findOne({_id:groupid})){
					BlazeLayout.render('mainLayout',{main:'datanotfound'});
				}else{
					BlazeLayout.render('mainLayout',{main:'groupchat',params:{groupid:groupid}});
				}

			}else{
				Router.go('login');
			}
        }

	},
	subscriptions:function(){
		this.subscribe('groups').wait();
		this.subscribe('allusers').wait();
		this.subscribe('chatlogs',this.params._id).wait();
	}
})
Router.route('/admin/user/:page?',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			console.log(this.params.page)
			if(this.params.page == undefined){
				page = 1;
			}else{
				page = this.params.page;
			}
			BlazeLayout.render('mainLayout',{main:'adminuserlist',params:{page:page,templatename:'adminuserlist'}});
		}else{
			Router.go('login');
		}
	},
	name:'adminuserlist'
})

Router.route('/admin/user/del/:_id',{
	action:function(){
		console.log('================')
		user = Meteor.user();
		if(user){
			if(Roles.userIsInRole(user, 'admin')){
				id = this.params._id;
				Meteor.apply('users.delete',[id],function(err,res){
					if(err){
						console.log(err);
						BlazeLayout.render('mainLayout',{main:'403'});
					}else if(res){
						BlazeLayout.render('mainLayout',{main:'success'});
					}else{
						BlazeLayout.render('mainLayout',{main:'403'});
					}
				})

			}else{
				BlazeLayout.render('mainLayout',{main:'403'});
			}

		}else{
			console.log('bbbbccccc')
			Router.go('login');
		}
	},
	name:"admindeleteuser"
});

Router.route('/admin/depart/list/:page?',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
				if(this.params.page == undefined){
					page = 1;
				}else{
					page = this.params.page;
				}
				BlazeLayout.render('mainLayout',{main:'admindepartlist',params:{page:page,templatename:'admindepartlist'}});
			}else{
				BlazeLayout.render('mainLayout',{main:'403'});
			}

		}else{
			Router.go('login');
		}
	},
	name:'admindepartlist'
});
Router.route('/admin/depart/add',{
	action:function(){
		userId = Meteor.userId();
		if(Roles.userIsInRole(userId, ['admin'])){
			if(userId){
				BlazeLayout.render('mainLayout',{main:'admindepartadd'});
			}else{
				Router.go('login');
			}
		}else{
			BlazeLayout.render('mainLayout',{main:'403'});
		}
	}
});
Router.route('/admin/depart/edit/:_id',{
	action:function(){
		userId = Meteor.userId();
		if(Roles.userIsInRole(userId, ['admin'])){
			if(userId){
				id = this.params._id;
				BlazeLayout.render('mainLayout',{main:'admindepartedit',params:{id:id}});
			}else{
				Router.go('login');
			}
		}else{
			BlazeLayout.render('mainLayout',{main:'403'});
		}
	}
});
Router.route('/admin/depart/del/:_id',{
	action:function(){
		userId = Meteor.userId();
		if(Roles.userIsInRole(userId, ['admin'])){
			console.log('abc');
			if(userId){
				id = this.params._id;
				Meteor.apply('depart.delete',[id],function(err,res){
					console.log(res);
					if(err){
						console.log(err);
						BlazeLayout.render('mainLayout',{main:'403'});
					}else if(res.error){
						BlazeLayout.render('mainLayout',{main:'success'});
					}else{
						console.log(res.msg);
						BlazeLayout.render('mainLayout',{main:'errmsg',params:{errmsg:res.msg}});
					}
				})
			}else{
				Router.go('login');
			}
		}else{
			console.log('def');
			BlazeLayout.render('mainLayout',{main:'403'});
		}
	}
})



