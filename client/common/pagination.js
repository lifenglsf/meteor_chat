Template.pagination.helpers({
	pager:function(){
		page = this.page;
		limit = 10;
		count = group.find({}).count();
		pagenum = Math.ceil(count/limit);
		if(page >=pagenum){
			page=pagenum;
		}
		if(page<1){
			page=1;
		}
		pages = [];
		pages['pages'] = [];
		if(page == 1){
			pages['isfirst'] = true;
			pages['firsturl'] =  Router.path('usergroups',{page:1});
		}else{
			pages['isfirst'] = false;
			pages['prevurl'] =Router.path('usergroups',{page:(page-1)});
		}
		for(i=0;i<pagenum;i++){
			pages['pages'][i] = {};
			//pages[i]['pages'] = {};
			pages['pages'][i]['current'] = false;
			if((i+1)==page){
				pages['pages'][i]['current'] = true;
			}
			pages['pages'][i]['index'] = i+1;
			pages['pages'][i]['url'] = Router.path('usergroups',{page:(i+1)});
		}
		if(page == pagenum){
			pages['islast'] = true;
			pages['lasturl'] = Router.path('usergroups',{page:pagenum});
		}else{
			pages['islast'] = false;
			pages['nexturl'] = Router.path('usergroups',{page:parseInt(page)+1});
		}
		return pages;
	}
})