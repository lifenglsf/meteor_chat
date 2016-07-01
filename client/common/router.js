Router.configure({
	layoutTemplate:'mainLayout'
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
	"action":function(){
		if(this.ready){
			userId = Meteor.userId();
			if(userId){
				BlazeLayout.render('mainLayout', {main: "home" });
			}else{
				Router.go('login');
			}
		}else{
			this.render('Loading');
		}
	},
	"data":function(){
		curuser  = Meteor.user();
		friends = [];
		if(curuser){
			if(_.has(curuser,'friends')){
				 friends = curuser.friends;
			}
		}
		groups = group.find().fetch();
		chatlogs = chatlog.find().fetch()
		return {
			friends:friends,
			logs:chatlogs,
			groups:groups
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
})


