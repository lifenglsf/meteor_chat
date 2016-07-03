Meteor.methods({
	'groups.create':function(groupname,member){
		console.log(member);
		id = group.insert({owner:this.userId,groupname:groupname,member:member});
		if(id){
			return true;
		}else{
			return false;
		}
	}
})