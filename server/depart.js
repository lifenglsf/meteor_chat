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
		isexists = Meteor.users.find({'profile.depart':id}).count();
		console.log(isexists);
		if(isexists){
			return {error:false,msg:'该部门已被使用，不能删除'};
		}else{
			departs = cdepart.findOne({_id:id});
			if(departs){
				cdepart.update({_id:id},{$set:{isdelete:1}});
				return {error:true,msg:''};
			}else{
				return {error:false,msg:'非法操作'};
			}
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