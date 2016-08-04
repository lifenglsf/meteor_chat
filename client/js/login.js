import { Meteor } from 'meteor/meteor';
import '../tpl/login.html';
Template.reg.onCreated(function(){
	console.log('reg created');
	Meteor.subscribe('alldeparts');
});
Template.reg.helpers({
	departlist:function(){
		return cdepart.find({}).fetch();
	}
})
Template.login.events({
'submit form'(event){
	event.preventDefault();
	var username=event.target.username.value;
	password = event.target.password.value;
	console.log(username,password);
	Meteor.loginWithPassword(username,password,function(error){
		console.log(error)
		if(error){
			if(error.reason == 'Incorrect password'){
				message = "密码错误";
			}else if(error.reason == 'User not found'){
				message = "用户不存在"
			}else if(error.reason == 'User has no password set'){
				message = "用户未设置密码"
			}else{
				message = "用户名或密码错误";
			}
			sAlert.error(message,{position:'bottom-left'});
		}else{
			Router.go('home');
		}
	})
	
}
});
Template.reg.events({
'submit form'(event){
	event.preventDefault();
	username = $.trim(event.target.username.value);
	passowrd = $.trim(event.target.password.value);
	repassowrd = $.trim(event.target.repassword.value);
	nickname = $.trim(event.target.nickname.value);
	depart = $.trim(event.target.depart.value);
	if(username == ""){
		sAlert.error('用户名不能为空',{position:"bottom-left"});
		return false;
	}
	if(password == ""){
		sAlert.error('密码不能为空',{position:"bottom-left"});
		return false;
	}
	if(repassowrd == ""){
		sAlert.error('确认密码不能为空',{position:"bottom-left"});
		return false;
	}
	if(passowrd.length <6){
		sAlert.error('密码至少6位',{position:"bottom-left"});
		return false;
	}
	if(passowrd !=repassowrd){
		sAlert.error('两次密码输入不一致',{position:"bottom-left"});
		return false;
	}
	info = {};
	info['username'] = event.target.username.value;
	info['password'] = event.target.password.value;
	info['profile'] = {};
	info['profile']['nickname'] = event.target.nickname.value;
	info['profile']['depart'] = event.target.depart.value;
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

