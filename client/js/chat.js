Template.chattoperson.helpers({
	'logs':function(){
		return chatlog.find({},{transform(obj){
			obj.isowner = false;
			if(obj.from == Meteor.userId()){
				obj.isowner= true;
			}
			return obj;
		}}).fetch();
	}
});
Template.chattoperson.events({
	'click #send':function(event,template){
		event.preventDefault();
		message = $.trim(template.$('#message').val());
		if(message == ""){

		}else{
			to = template.data.toid;
			Meteor.apply('chatlog.create',[message,to],function(err,res){
				if(err){
					sAlert.error('消息发送失败',{position:'bottom-left'});
				}else{
					if(!res){
						sAlert.error('消息发送失败',{position:'bottom-left'});
					}else{
						template.$('#message').val('')
					}
				}
			})
		}
	}
});