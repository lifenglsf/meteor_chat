import { Meteor } from 'meteor/meteor';
import '../tpl/login.html';
Template.login.events({
'submit form'(event){
	event.preventDefault();
	var username=event.target.username.value;
	password = event.target.password.value;
	console.log(username,password);
	Meteor.loginWithPassword(username,password,function(error){
		console.log(error)
		if(error){
			sAlert.error('用户名或密码错误',{position:'bottom-left'});
		}else{
			Router.go('home');
		}
	})
	
}
});
Template.reg.events({
'submit form'(event){
	event.preventDefault();
	var username = event.target.username.value;
	var nickname = event.target.nickname.value;
	var password = event.target.password.value;
	Accounts.createUser({username:username,password:password,profile:{nickname:nickname}},function(error){
		if(error){
			sAlert.error('注册失败',{position:'bottom-left'});
		}else{
			Router.go('home');
		}
	})
}
})

