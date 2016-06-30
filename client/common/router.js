Router.route('/login',function(){
	userId = Meteor.userId();
	if(userId){
		Router.go('home');
	}else{
		this.render('login');
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
		this.render('reg');
	}
})
Router.route('/home',{
	"action":function(){
		if(this.ready){
			userId = Meteor.userId();
			if(userId){
				this.render('home');
			}else{
				Router.go('login');
			}
		}
	},
	"before":function(){
		console.log('wait')
		this.subscribe('group');
		this.subscribe('chatlog')
		this.next();
	},
	"data":function(){
		curuser  = Meteor.user();
		friends = [];
		if(curuser){
			if(_.has(curuser,'friends')){
				 friends = curuser.friends;
			}
		}
		console.log(friends);
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
			this.render('password');
		}else{
			Router.go('login');
		}
	}
})
