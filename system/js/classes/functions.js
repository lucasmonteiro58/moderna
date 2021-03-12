var Functions = {
	strip_tags: function (str, allowed_tags){
		var key = '', allowed = false, matches = [], allowed_array = [], allowed_tag = '', i = 0, k = '', html = '';
		var replacer = function (search, replace, str){return str.split(search).join(replace);};
		if(allowed_tags){allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);}
		str += '';
		matches = str.match(/(<\/?[\S][^>]*>)/gi);
		for(key in matches){
			if(isNaN(key)){continue;}
			html = matches[key].toString();
			allowed = false;
			for(k in allowed_array){
				allowed_tag = allowed_array[k];
				i = -1;
				if(i != 0){i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
				if(i != 0){i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
				if(i != 0){i = html.toLowerCase().indexOf('</'+allowed_tag);}
				if(i == 0){allowed = true;break;}
			}
			 if(!allowed){str = replacer(html,"",str);}
		}
		 return str;
	},
	verificaBrowser: function(){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf('chrome')!=-1){/** SE É CHROME*/
			BROWSER = 'Chrome';
		}else if(ua.indexOf('android')!=-1){/** SE É ANDROID*/
			BROWSER = 'Android';
		}else if(ua.indexOf('ipad')!=-1){/** SE É IPAD*/
			BROWSER = 'iPad';
		}else if(ua.indexOf('safari')!=-1){/** SE É SAFARI*/
			BROWSER = 'Safari';
		}else if(ua.indexOf('firefox')!=-1){/** SE É FIREFOX*/
			BROWSER = 'Firefox';
		}else if(ua.indexOf('opera')!=-1){/** SE É OPERA*/
			BROWSER = 'Opera';
		}
		if(ua.indexOf('win')!=-1){/** SE É WINDOWS*/
			SYSTEM = 'win';
		}else if(ua.indexOf('mac')!=-1){/** SE É MAC*/
			SYSTEM = 'mac';
		}
		V_EXT = '.mp4';
		A_EXT = '.mp3';
	},
	updateScale: function(){
		if( Main.isTablet ){
			func();
		}else{
			if( window.devicePixelRatio == 1 ){
				func();
			}else if( window.devicePixelRatio < 1 ){
				$('#stage').attr('data-dpr','smaller');
			}else if( window.devicePixelRatio < 1 ){
				$('#stage').attr('data-dpr','bigger');
			}
		}
	},
	dndStartFunction: function(ui){
		ui.position.left = 0;
		ui.position.top = 0;
	},
	dndDragFunction: function(ui,scale){
		var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
		var newLeft = ui.originalPosition.left + changeLeft / scale; // adjust new left by our zoomScale

		var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
		var newTop = ui.originalPosition.top + changeTop / scale; // adjust new top by our zoomScale

		ui.position.left = newLeft;
		ui.position.top = newTop;
	},
	getOffset: function (evt,scale,obj){
		if(evt.offsetX!=undefined){
			return {
				x: (( evt.touches ) ? evt.touches[0].offsetX : evt.offsetX),
				y: (( evt.touches ) ? evt.touches[0].offsetY : evt.offsetY)
			};
		}else{
			var offset = {x: (obj.offset().left / scale) ,y: (obj.offset().top / scale)},
				oX = (( evt.touches ) ? evt.touches[0].pageX : evt.pageX) / scale,
				oY = (( evt.touches ) ? evt.touches[0].pageY : evt.pageY) / scale;
			return {
				x:  oX - offset.x,
				y:  oY - offset.y
			};
		}
	},
	log: function(_log){
		var date = new Date(),
			d = date.getDate(), m = date.getMonth(), y = date.getFullYear(), h = date.getHours(), i = date.getMinutes(), s = date.getSeconds();

		if(d <= 9) d = '0'+d;
		if(m <= 9) m = '0'+m;
		if(h <= 9) h = '0'+h;
		if(i <= 9) i = '0'+i;
		if(s <= 9) s = '0'+s;
		if( typeof(_log) == 'object' ){
			_log = JSON.stringify(_log, null, 2)
		}
		$('#OEDlog').append('<span> '+d+'/'+m+'/'+y+' - '+h+':'+i+':'+s+' > '+_log+'</span>');
	}
}
