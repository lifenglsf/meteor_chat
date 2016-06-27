Router.route('/login',function(){
	userId = Meteor.userId();
	if(userId){
		Router.go('home');
	}else{
		this.render('login');
	}
})
Router.route('/register',function(){
	userId = Meteor.userId();
	if(userId){
		Router.go('home');
	}else{
		this.render('reg');
	}
})
Router.route('/home',function(){
	userId = Meteor.userId();
	if(userId){
		this.render('home');
	}else{
		Router.go('login');
	}
})
