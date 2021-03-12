var BROWSER = '';
var SYSTEM = '';
var V_EXT = '';
var A_EXT = '';
var	mobi_w = 846;
var	mobi_h = 476;
var clicouBotao = false;


var Main = {
	titulo: '',
	log: false,
	hasPreRun: false,
	preRun: function(){},
	_stage_w: 846,
	_stage_h: 476,
	tituloWithAudio: false,
	isTablet: false,

	init: function(){
		InterfaceController.init();
		if(Main.log){
			window.console.log = showLog
			$('#stage').append('<pre id="OEDlog"></pre>');
		}
		this.mobileInit();

		$('#stage .tocar').unbind('tap keydown').bind('tap keydown',function(e){
			console.log(e)
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage .tocar').unbind('tap keydown').fadeOut(500);
				$('#stage').attr('data-os',SYSTEM).attr('data-browser',BROWSER);
				if(Main.isTablet){
					$('#stage').addClass('tablet');
				}
				var func = function(){
					$('#abertura').fadeOut(500);
					InterfaceController.init(e);
				}
				if(Main.hasPreRun)
					Main.preRun();

				if(Main.tituloWithAudio){
					playAudio('audio','titulo',func);
				}else{
					func();
				}
			}
		});

				// BOTÃO CONFERIR

				$('#btnConferir').unbind('keydown tap').bind('keydown tap', function(e)
				{
					InterfaceController.openVideo();					
				} );


		$('.titulo').html(Main.titulo);
		$('.sub_titulo').html(Main.subtitulo);
		//$('.titulo.noBR').html(Functions.strip_tags(Main.titulo,"<i><sup>"));
		$('.titulo.noBR').html(Main.titulo,"<i><sup>");
		$('title').html(Functions.strip_tags(Main.titulo));
		/*
		var countLinhas = Main.titulo.match(/\<br\/\>/gi);
		if(countLinhas && countLinhas.length>0){
			$('#mc_titulo_intro').addClass('l'+(countLinhas.length+1));
		}*/
	},

	initPreloader: function(){
		var loaderAnimation = $("#html5Loader").LoaderAnimation({ lineWidth:3, color:"#F7A71E", glowColor:"#F7A71E", radius:25.5, font:"normal bold 14px Arial" });
		$.html5Loader({
			getFilesToLoadJSON:filesJSON,
			onUpdate: loaderAnimation.update
		});
	},
	mobileInit:function()
	{
		var that = this;

		uaBrowser	= function(a){
			var
				a= a.toLowerCase(),
				c=/(opera)(?:.*version)?[ \/]([\w.]+)/,
				b=/(msie) ([\w.]+)/,
				e=/(mozilla)(?:.*? rv:([\w.]+))?/,
				a=/(webkit)[ \/]([\w.]+)/.exec(a)||c.exec(a)||b.exec(a)||0>a.indexOf("compatible")&&e.exec(a)||[];
			return{
				browser:a[1]||"",
				version:a[2]||"0"
			}
		};

		uaPlatform = function(a){
			var b=a.toLowerCase(),
				d=/(android)/,
				e=/(mobile)/,
				a=/(ipad|iphone|ipod|android|mobile|blackberry|playbook|windows ce|webos)/.exec(b)||[],
				b=/(ipad|playbook)/.exec(b)||!e.exec(b)&&d.exec(b)||e.exec(b)&&d.exec(b)||[];
			a[1]&&(a[1]=a[1].replace(/\s/g,"_"));
			return{
				platform:a[1]||"",
				tablet:b[1]||""
			}
		};

		browser={};
		platform={};
		var i=uaBrowser(navigator.userAgent);

		browser && ( browser[i.browser] =! 0, browser.version = i.version);
		i = uaPlatform(navigator.userAgent);
		platform && ( platform[i.platform] =! 0, platform.mobile =! i.tablet, platform.tablet =!! i.tablet);

		that.isTablet = false;
		if(i.platform!='') {
			that.isTablet = true;
		}
	}
}

function showLog(_log){
	if(Main.log)
		Functions.log(_log);
}

function preventPullToRefresh() {
    var lastTouchY = 0,
        maybePreventPullToRefresh = false;
    // Pull-to-refresh will only trigger if the scroll begins when the document's Y offset is zero.
    var touchstartHandler = function (e) {
        if (e.touches.length != 1) {
            return;
        }
        lastTouchY = e.touches[0].clientY;
        maybePreventPullToRefresh = (window.pageYOffset == 0);
    }
    // To suppress pull-to-refresh it is sufficient to preventDefault the first overscrolling touchmove.
    var touchmoveHandler = function (e) {
        var touchY = e.touches[0].clientY,
            touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;
        if (maybePreventPullToRefresh) {
            maybePreventPullToRefresh = false;
            if (touchYDelta > 0) {
                e.preventDefault();
                return;
            }
        }
        if (window.pageYOffset == 0 && touchYDelta > 0) {
            e.preventDefault();
            return;
        }
    }
    document.addEventListener('touchstart', touchstartHandler, false);
    document.addEventListener('touchmove', touchmoveHandler, false);
}

$(window).resize(function(){
    if ($(window).width() <= 425) {
		InterfaceController.responsivoMobile();
		if (clicouBotao == true) {
			$('#stage #interface .superior').css('width','100%');
		}else{
			$('#stage #interface .superior').css('width','320px');
		}
   }else if($(window).width() <= 320){
   		$('#stage #interface .superior').css('width','100%');
   }else{
		InterfaceController.responsivoPC();
		if (clicouBotao == true) {
			$('#stage #interface .superior').css('width','425px');
		}else{
			$('#stage #interface .superior').css('width','320px');
		}
   }
});

var PROTOTIPO = '5.0.15';
$(document).ready(function(e)
{
	Functions.verificaBrowser();
	KeyNavigationController.init(e);
	Main.init();
	resizeAll();
	$(window).resize(function(){ resizeAll();});
	preventPullToRefresh();
});

function resizeAll(){
	is_keyboard = ($(document.activeElement).attr('type') == 'text');
	if(Main.isTablet){
		if($(window)[0].outerWidth > $(window)[0].outerHeight && $(window)[0].outerHeight < 476){
			if( InterfaceController.canPlay ){
				$('.msgRotate').hide();
			}else{
				if(is_keyboard){
					$('.msgRotate').hide();
				}else{
					$('.msgRotate').show();
				}
			}
		}else{
			$('.msgRotate').hide();
		}
	}else{
		 $('.msgRotate').hide();
	}
}