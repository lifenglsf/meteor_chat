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
	info = {};
	info['username'] = event.target.username.value;
	info['password'] = event.target.password.value;
	info['profile'] = {};
	info['profile']['nickname'] = event.target.nickname.value;

	Meteor.apply('useres.create',[info],function(err,res){
		if(err){
			sAlert.error('注册失败',{position:'bottom-left'});
		}else{
			if(_.has(res,'error') && res.error){
				sAlert.error('注册失败',{position:'bottom-left'});
			}else{
				Router.go('home');
			}
			
		}
	})
}
})

