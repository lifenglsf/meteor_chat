var autoScrollingIsActive = false;
/* reactive var here */
scrollToBottom = function scrollToBottom (duration) {
  var messageWindow = $("#chatlogs");
  var scrollHeight = messageWindow.prop("scrollHeight");
  console.log('bottom',scrollHeight);
  messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
};
Template.chattoperson.onCreated(function(){
	Meteor.subscribe('chatlogs',Meteor.userId());
	Meteor.subscribe('allusers');
});
Template.chattoperson.onRendered(function(){
	var template = this;
	this.autorun(function(c){
		if(template.subscriptionsReady()){
			Tracker.afterFlush(function(){
				Meteor.setTimeout(function(){
					scrolltops = $('#chatlogs').prop('scrollHeight');
					console.log(scrolltops);
					if(scrolltops){
						console.log('a');
						$('#chatlogs').scrollTop(scrolltops)
					};
				},1000)
				
			})
		}
		
	})
		
	
	
})
Template.chattoperson.helpers({
	'logs':function(){
		return cchatlog.find({type:"person"},{transform(obj){
			obj.isowner = false;
			if(obj.from == Meteor.userId()){
				obj.isowner= true;
			}
			return obj;
		}}).fetch();
	},
	touser:function(){
		toid = this.toid;
		return Meteor.users.findOne({_id:toid});
	}
});
Template.chattoperson.events({
	'click #send':function(event,template){
		event.preventDefault();
		message = $.trim($('#summernote').summernote('code'));
		if(message == ""){

		}else{
			/*if(message.length>6000){
				sAlert.error('聊天内容不能超过6000字',{position:"bottom-left"});
				return;
			}else{*/
				to = template.data.toid;
				Meteor.apply('chatlog.createPersonChat',[message,to],function(err,res){
					if(err){
						sAlert.error('消息发送失败',{position:'bottom-left'});
					}else{
						if(!res){
							sAlert.error('消息发送失败',{position:'bottom-left'});
						}else{
							$('#summernote').summernote('reset');
							Meteor.setTimeout(function(){
								scrolltops = $('#chatlogs').prop('scrollHeight');
								if(scrolltops){
									console.log('a');
									$('#chatlogs').scrollTop(scrolltops)
								}
							},500)
							
						}
					}
				})
			//}
			
		}
	}
});
Template.editor.rendered = function () {
    $('#summernote').summernote({
    	toolbar: [
    // [groupName, [list of button]]
    ['style', ['bold', 'italic', 'underline', 'clear']],
    //['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    //['height', ['height']]
    ['insert',['picture']]
  ]
    });
  };