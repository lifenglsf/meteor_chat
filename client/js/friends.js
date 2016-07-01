Template.addFriend.events({
	'submit form'(event,template){
		event.preventDefault();
		name = event.target.names.value;
		Session.set('friendssearch',name);
		
	}
})

Template.addFriend.helpers({
	searchlist:function(){
		name = Session.get('friendssearch');
		res =  Meteor.users.find({username:name}).fetch();
		return res;
	}
})