Meteor.methods({
	'depart.add':function(departname){
		//departname = $.trim(departname);
		if(departname == ""){
			return false;
		}else{
			id = cdepart.insert({departname:departname,createAt:new Date()});
			return id;
		}
	},
	'depart.delete':function(id){
		departs = cdepart.findOne({_id:id});
		if(departs){
			cdepart.update({_id:id},{$set:{isdelete:1}});
			return true;
		}else{
			return false;
		}
	},
	'depart.update':function(id,departname){
		departs = cdepart.findOne({_id:id});
		console.log(departname);
		if(departs){
			cdepart.update({_id:id},{$set:{departname:departname}});
			return true;
		}else{
			return false;
		}
	}
})