import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  admin = Meteor.users.findOne({username:"admin"});
  if(!admin){
  	info = {username:"admin",password:"webmasteradmin",profile:{nickname:"admin"},roles:"admin"}
  	id = Accounts.createUser(info)
  	if(id){
		Roles.addUsersToRoles(id, 'admin');
	}
}
});
