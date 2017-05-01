
!function(){
	var Cookie = function(){
		if (!(this instanceof Cookie)) {
            return new Cookie();
        }
	}

	Cookie.prototype.get=function(name){
		var arr = document.cookie.split(';');
		for (var i=0;i<arr.length;i++){
			var index = arr[i].indexOf(name+'=');
			if(index != -1) return unescape( arr[i].substring( index + name.length + 1 ));
		}
		return false;
	}

	Cookie.prototype.set=function(name,val,opt){

		//批量设置
		if(!!name && Object.prototype.toString.call(name) === '[object Object]'){
			for(var key in name) this.set(key,name[key],val);
		}else{
			var expires,path,domain,secure;

			//opt: Josn or string/number
			if(!!opt && Object.prototype.toString.call(opt) === '[object Object]'){
				expires = opt.expires || '';
				path = opt.path || ';path=/';
				domain = opt.domain || '';
				secure = opt.secure || '';
			}else{
				expires = opt || '';
				path = ';path=/';
				domain='';
				secure='';
			}

			//expires
			if (expires && typeof expires === 'string') expires = new Date(expires);
			else if (typeof expires === 'number') expires = new Date(+new Date + 1000 * 60 * 60 * 24 * expires);

			//to GMT
			if (expires && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();

			//set cookie
			document.cookie = name + "="+ escape(val) + expires + path + domain +secure;
		}
	}
	Cookie.prototype.remove=function(name){
		var _this = this;
		var arr = Array.isArray(name) ? name : Array.from(arguments);
		arr.forEach(function(el,i){ _this.set(el,'',-1); })
		return name;
	}
	Cookie.prototype.all=function(){
		var result={};
		if(document.cookie!=''){
			document.cookie.split(';').forEach(function(el,i){
				var item = el.split('=');
				result[unescape(item[0].trim())] = unescape(item[1]);
			});
		}
		return result;
	}
	Cookie.prototype.clear=function(){
		for(var name in this.all()) this.remove(name);
		return true;
	}

	var cookie =function(name,value,options){
		var l = arguments.length;
		if (l === 0) return Cookie().all();
		if (l === 1 && name === null) return Cookie().clear();
		if (l === 2 && !value) return Cookie().clear(name);
		if (typeof(name) == 'string'&&!value) return Cookie().get(name);
		if (Object.prototype.toString.call(name) === '[object Object]' || (l>1 && name && value)) return Cookie().set(name, value, options);
		if (value === null) return Cookie().remove(name);
		return Cookie().all();
	};

	for(var key in Cookie.prototype) cookie[key] = Cookie.prototype[key];

	window.cookie=cookie;

}();