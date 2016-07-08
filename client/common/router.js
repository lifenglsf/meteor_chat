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
			this.render('Loading');
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
Router.route('/admin/user/:page?',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			console.log(this.params.page)
			if(this.params.page == undefined){
				page = 10;
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
			Router.go('login');
		}
	},
})



