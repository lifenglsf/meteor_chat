Template.pagination.helpers({
	pager:function(){
		//console.log();
		data= Template[this.templatename].__helpers.get('pagerdata')();
		page = this.page;
		limit = 1;
		count = data.count;
		pagenum = Math.ceil(count/limit);
		if(pagenum<=1){
			return [];
		}
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
			pages['firsturl'] =  Router.path(data.routename,{page:1});
		}else{
			pages['isfirst'] = false;
			pages['prevurl'] =Router.path(data.routename,{page:(page-1)});
		}
		for(i=0;i<pagenum;i++){
			pages['pages'][i] = {};
			//pages[i]['pages'] = {};
			pages['pages'][i]['current'] = false;
			if((i+1)==page){
				pages['pages'][i]['current'] = true;
			}
			pages['pages'][i]['index'] = i+1;
			pages['pages'][i]['url'] = Router.path(data.routename,{page:(i+1)});
		}
		if(page == pagenum){
			pages['islast'] = true;
			pages['lasturl'] = Router.path(data.routename,{page:pagenum});
		}else{
			pages['islast'] = false;
			pages['nexturl'] = Router.path(data.routename,{page:parseInt(page)+1});
		}
		return pages;
	}
})