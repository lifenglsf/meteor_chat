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
Router.route('/user',{
	action:function(){
		userId = Meteor.userId();
		if(userId){
			BlazeLayout.render('mainLayout',{main:'userlist'});
		}else{
			Router.go('login');
		}
	}
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
			BlazeLayout.render('mainLayout',{main:'grouplist',params:{page:page}});
		}else{
			Router.go('login');
		}
	},
	name:'usergroups'
})


