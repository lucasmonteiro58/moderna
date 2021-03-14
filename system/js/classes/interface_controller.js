var InterfaceController = {
	oedIsReady: false,
	isMuted: false,
	galeria: [],
	idGaleria: 0,
	canSlideGaleria: true,
	niveis: {
		tipo:'',
		itens: []
	},
	canPlay: false,
	mostrarBtnFases: false,
	mostrarBtnMenu: false,
	mostrarBtnRoteiro: false,
	mostrarBtnReiniciar: false,
	mostrarBtnAjuda: false,
	mostrarBtnCreditos: false,
	mostrarBtnAcessibilidade: false,
	mostrarNiveis: false,

	acessibilidade: {
		autoContraste: false,
		no_close_caption: true,
		no_speed: true,
		close_caption: false,
		font_size: 2,
		speed: 1
	},

	naoSelecionou: false,
	naoSelecionouTxt: "",

	init: function(){
		var that = this;

		setVolume();

		$('#stage .tocar').css({zIndex:99});

		setTimeout(function(){ that.oedIsReady = true; },500);
		$('#stage #interface .lateral .fechar').unbind('keydown tap').bind('keydown tap', function(e){
			if (e.keyCode === 13 || e.type === 'tap') {
				that.closeAjudaBox();
				that.closeCreditoBox();
				that.closeAcessibilidadeBox();
			}
		});

		
		// BOTÃO FECHAR POPUPVIDEO
		$('.fechar_popup').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				InterfaceController.closePopUpVideo();
			}
		} );

		// ABRE E FECHA A INTERFACE
		$('#btnOpcoes').show().unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				var status = $('#interface').attr('data-status');
				if(status == 'off'){
					that.openAbas(e);
				}else{
					if (that.naoSelecionou == true){
						$('.feedback').css({zIndex:105});
						showFeedback(that.naoSelecionouTxt);
					}else{
						that.closeAbas();
						$(this).attr('title','OPÇÕES');
					}
				}
			}
		} )
		.blur(function(){
			$('#stage .tocar').hide();
		});

		// BOTÃO FASES
		$('#btnFases').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnFases");
				that.btnFasesCallback();
				that.closeAbas(e);
			}
		} );



		// BOTÃO MENU
		$('#btnMenu').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnMenu");
				if($(window)[0].outerWidth > $(window)[0].outerHeight && $(window)[0].outerHeight < 476){
					$('.msgRotate').show();
				}
				that.btnMenuCallback();
				that.closeAbas(e);
			}
		} );

		// BOTÃO ROTEIRO DE ESTUDOS
		$('#btnRoteiro').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnRoteiro");
				that.btnRoteiroCallback();
				that.closeAbas(e);
			}
		} );

		// BOTÃO SOM
		$('#btnSom').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnSom");
				if(!that.isMuted){
					mute();
					that.isMuted = true;
					$('#btnSom').attr('data-status','off').attr('aria-label','Som Desativado').attr('aria-selected',true);
					$('#btnSom b').html('Som Desativado');
				}else{
					unmute();
					that.isMuted = false;
					$('#btnSom').attr('data-status','on').attr('aria-label','Som Ativado').attr('aria-selected',false);
					$('#btnSom b').html('Som Ativado');
				}
				that.closeTabs();
			}
		} );
		if( ($('audio').size() == 0 && $('video').size() == 0) ){
			$('#btnSom').parent().remove();
		}
		if( Main.isTablet ){
			$('#btnSom').parent().remove();
			$('#interComando').remove();
		}

		// BOTÃO AJUDA
		$("#ajuda .viewport .overview").html(Textos.ajuda);
		$('#btnAjuda').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnAjuda");
				var _status = $("#ajuda").attr('data-status');
				if(_status == 'closed'){
					$('#btnAjuda').parent().addClass('hover');
					$('#btnAjuda').attr('aria-expanded',true);
					$("#ajuda").attr('data-status','open').attr('aria-expanded',true);
					$('#ajuda').tinyscrollbar({invertscroll: true});
					that.closeAcessibilidadeBox();
					that.closeCreditoBox();
					boxScroll = $('#ajuda').data("plugin_tinyscrollbar");
					//$("#ajuda").css({top: -$('#btnAjuda').offset().top + $("#interface .superior").offset().top + $("#interface .superior").height()});
					TweenMax.to( "#ajuda .content", .7, { left:0, ease: Power2.easeOut } );
					clicouBotao = true;
					tamanhoAbaSuperiorOpen();
					that.btnAjudaCallback();
				}else{
					that.closeAjudaBox();
				}
			}
		} );

		// BOTÃO ACESSIBILIDADE
		$('#btnAcessibilidade').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnAcessibilidade");
				var _status = $("#acessibilidade").attr('data-status');
				if(_status == 'closed'){
					$('#btnAcessibilidade').parent().addClass('hover');
					$('#btnAcessibilidade').attr('aria-expanded',true);
					$("#acessibilidade").attr('data-status','open').attr('aria-expanded',true);

					//$("#acessibilidade").css({top: -$('#btnAcessibilidade').offset().top + $("#interface .superior").offset().top + $("#interface .superior").height()});
					that.closeAjudaBox();
					that.closeCreditoBox();
					TweenMax.to( "#acessibilidade #slideAcessivel", .7, { left:0, ease: Power2.easeOut } );
					$('#stage #interface #acessibilidade').tinyscrollbar({invertscroll: true});
					boxScroll = $('#stage #interface #acessibilidade').data("plugin_tinyscrollbar");
					$('#acessibilidade').data("plugin_tinyscrollbar").update(0);
					$("#btnPlrOpt").attr('data-show',true);
					clicouBotao = true;
					tamanhoAbaSuperiorOpen();
				}else{
					that.closeAcessibilidadeBox();
				}
			}
		} );

		// BOTÃO AUTO CONTRASTE
		$('#btnAutoContraste').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				if( that.acessibilidade.autoContraste ){
					that.acessibilidade.autoContraste = false;
					$('#btnAutoContraste .text').html('Desativado');
					$('#btnAutoContraste').attr('aria-label','Alto-contrate desativado').attr('aria-selected',false);
					$('#stage #interface .superior').css('margin-left','0px');
				}else{
					that.acessibilidade.autoContraste = true;
					$('#btnAutoContraste .text').html('Ativado');
					$('#btnAutoContraste').attr('aria-label','Alto-contrate ativado').attr('aria-selected',true);
					if (clicouBotao == true) {
						$('#stage #interface .superior').css('margin-left','-1px');
					}
				}
				$('#btnAutoContraste .checkbox').attr('aria-checked',that.acessibilidade.autoContraste);
				$('#stage').attr('data-autocontraste',that.acessibilidade.autoContraste);
			}
		} );

		// BOTÃO CLOSED CAPTION
		$('#btnClosedCaption').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				if( !that.acessibilidade.no_close_caption ){
					if( that.acessibilidade.close_caption ){
						that.acessibilidade.close_caption = false;
						$('#acessibilidade .cc_control').addClass('disabled');
						$('#acessibilidade .cc_control.tabindex').attr('tabindex',-1);
						$('#btnClosedCaption .text').html('Desativada');
						$('#btnClosedCaption').attr('aria-label','Legenda desativada').attr('aria-selected',false);
						$("#btnPlrCC").attr('title','LEGENDA DESATIVADA');
						__meplayer.setTrack('none');
					}else{
						that.acessibilidade.close_caption = true;
						$('#acessibilidade .cc_control').removeClass('disabled');
						$('#acessibilidade .cc_control.tabindex').attr('tabindex',0);
						$('#btnClosedCaption .text').html('Ativada');
						$('#btnClosedCaption').attr('aria-label','Legenda ativada').attr('aria-selected',true);
						$("#btnPlrCC").attr('title','LEGENDA ATIVADA');
						$('.mejs-captions-position').attr('data-size','s'+that.acessibilidade.font_size);
						__meplayer.setTrack('pt');
					}
					$("#btnPlrCC").attr('data-show',that.acessibilidade.close_caption);
					$('#btnClosedCaption .checkbox').attr('aria-checked',that.acessibilidade.close_caption);
				}
			}
		} );

		// BOTÃO CLOSED CAPTION	FONT
		$('#btnCCFont1, #btnCCFont2, #btnCCFont3').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				if( !$(this).hasClass('disabled') ){
					that.acessibilidade.font_size = parseInt($(this).data('value'));
					$('#acessibilidade .cc_font_control .radio').attr('aria-checked',false);
					$('#acessibilidade .cc_font_control').attr('aria-selected',false);
					$(this).find('.radio').attr('aria-checked',true);
					$(this).attr('aria-selected',true);
					$('.mejs-captions-position').attr('data-size','s'+that.acessibilidade.font_size);
				}
			}
		} );

		// BOTÃO VIDEO VELOCIDADE
		$('#btnCCSpeed1, #btnCCSpeed2, #btnCCSpeed3').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				var txtSpeed = { 1: '1.0 x', 2: '2.0 x', .5: '0.5 x' },
					txtBotao = { 1: 'Velocidade normal', 2: 'Velocidade rápida', .5: 'Velocidade lenta' };
				that.acessibilidade.speed = Number($(this).data('value'));
				$('#acessibilidade .cc_speed_control .radio').attr('aria-checked',false);
				$('#acessibilidade .cc_speed_control').attr('aria-selected',false);
				$(this).find('.radio').attr('aria-checked',true);
				$(this).attr('aria-selected',true);
				$("#btnPlrSpeed")
					.attr('data-velocidade',that.acessibilidade.speed)
					.attr('title',txtBotao[that.acessibilidade.speed].toUpperCase())
					.html( txtSpeed[that.acessibilidade.speed] );
				__meplayer.node.playbackRate = that.acessibilidade.speed;
			}
		} );

		// BOTÃO CREDITOS
		$("#informacoes .viewport .overview").html(Textos.creditos);
		$('#btnCreditos').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnCreditos");
				var _status = $("#informacoes").attr('data-status');
				if(_status == 'closed'){
					$('#btnCreditos').parent().addClass('hover');
					$('#btnCreditos').attr('aria-expanded',true);
					$("#informacoes").attr('data-status','open').attr('aria-expanded',true);
					$('#informacoes').tinyscrollbar({invertscroll: true});
					that.closeAjudaBox();
					that.closeAcessibilidadeBox();
					boxScroll = $('#informacoes').data("plugin_tinyscrollbar");
					$('#informacoes').data("plugin_tinyscrollbar").update(0);
					//$("#informacoes").css({top: -$('#btnCreditos').offset().top + $("#interface .superior").offset().top + $("#interface .superior").height()});
					TweenMax.to( "#informacoes .content", .7, { left:0, ease: Power2.easeOut } );
					clicouBotao = true;
					tamanhoAbaSuperiorOpen();
				}else{
					that.closeCreditoBox();
				}
			}
		} );

		// BOTÃO REININICAR
		$('#btnReiniciar').unbind('keydown tap').bind('keydown tap', function(e)
		{
			if (e.keyCode === 13 || e.type === 'tap') {
				$('#stage #interface').attr('aria-activedescendant',"btnReiniciar");				
				if($(window)[0].outerWidth > $(window)[0].outerHeight && $(window)[0].outerHeight < 476){
					$('.msgRotate').show();
				}
				that.btnReiniciarCallback();
				that.closeAbas(e);
				//$('#questionSection').scrollTop(0);

				console.log('reniciou')
				//window.location.reload()
				//document.getElementById("questionSection").scrollIntoView();
			}
		} );

		// INICIAR A GALERIA DE IMAGENS
		that.iniciaGaleria();

		if(!InterfaceController.mostrarBtnFases) $('#btnFases').parent().remove();
		if(!InterfaceController.mostrarBtnMenu) $('#btnMenu').parent().remove();
		if(!InterfaceController.mostrarBtnRoteiro) $('#btnRoteiro').parent().remove();
		if(!InterfaceController.mostrarBtnReiniciar) $('#btnReiniciar').parent().remove();
		if(!InterfaceController.mostrarBtnAjuda) $('#btnAjuda').parent().remove();
		if(!InterfaceController.mostrarBtnCreditos) $('#btnCreditos').parent().remove();

		$('#stage').attr('data-autocontraste',that.acessibilidade.autoContraste);
		setTimeout(function(){ $('#interatividade *').not('#areaVideo, #areaVideo *').attr('tabindex',-1).attr('aria-hidden',true); },500);

		// INICIAR ANIMAÇÃO
		inicioAnimacao();
		if( that.acessibilidade.no_close_caption ) $('[data-controller=no_close_caption]').hide();
		if( that.acessibilidade.no_speed ) $('[data-controller=no_speed]').hide();
		$('#stage .tocar').fadeOut(500);
	},
	responsivoMobile: function(){},
	responsivoPC: function(){},
	btnFasesCallback: function(){},
	btnMenuCallback: function(){},
	btnRoteiroCallback: function(){},
	btnAjudaCallback: function(){},
	btnReiniciarCallback: function(){
	},
	openAbas: function(e){
		var that = InterfaceController;

		TweenMax.to("#interface .superior",.5,{left:0});
		TweenMax.to("#interface .lateral",.5,{left:0, onStart: function(){
			$('#interface .filtro').fadeIn(500);
			$('#interface').attr('data-status','on').css({overflow:'visible'});
			if(that.mostrarNiveis && that.niveis.itens.length > 0){
				var _niveis = '', k;
				for(k = 0; k < that.niveis.itens.length; k++){
					if(typeof(that.niveis.itens[k]) == 'object'){
						_niveis += "<button class='niv_' data-id='"+k+"'>"+that.niveis.itens[k].texto+"</button>";
					}else{
						_niveis += that.niveis.itens[k];
					}
				}
				$('#interface .filtro').html("<nav class='niveis "+that.niveis.tipo+"'>"+_niveis+"</nav>");
				$("#interface .niveis").css({marginTop:-($("#interface .niveis").height() / 2)+"px"});
				$("#interface .niveis .niv_").each(function(j,el){
					$(el).unbind('keydown tap').bind('keydown tap',that.niveis.itens[$(this).data('id')].acao);
				});
				$('#interface .filtro, #interface .filtro *').attr('tabindex',-1).attr('aria-hidden',true);
			}
		}, onComplete: function(){
			that.onOpenAbas();
		}});
		$('#btnOpcoes').attr('aria-label','Fechar').attr('aria-expanded',true);
		$('#interface').attr('aria-expanded',true);
		$('#interatividade, .mejs-controls .tabindex, #interatividade .tabindex').attr('tabindex',-1);
	},
	onOpenAbas: function(){},
	closeAbas: function(e){
		var that = InterfaceController;

		TweenMax.to("#interface .superior",.5,{left:-330, ease:Linear.ease});
		TweenMax.to("#interface .lateral",.5,{left:-330, ease:Linear.ease, onStart: function(){
			$('#interface .filtro').fadeOut(500);
		},onComplete: function(){
			that.onCloseAbas();
			$('#interface').attr('data-status','off').css({overflow:'hidden'});
		}});
		$('#btnOpcoes').attr('aria-label','Opções').attr('aria-expanded',false);
		$('#interface').attr('aria-expanded',false);
		$('#interatividade, .mejs-controls .tabindex, #interatividade .tabindex').attr('tabindex',0);
		that.closeTabs();
		tamanhoAbaSuperiorClose();
		clicouBotao = false;
	},
	onCloseAbas: function(){},
	closeAjudaBox: function(){
		$('#btnAjuda').parent().removeClass('hover');
		$('#btnAjuda, #ajuda').attr('aria-expanded',false);
		TweenMax.to( "#ajuda .content", .7, { left:'-100%', ease: Power2.easeOut, onComplete: function(){ $("#ajuda").attr('data-status','closed') } } );
		boxScroll = false;
		InterfaceController.onCloseAjudaBox();
		tamanhoAbaSuperiorClose();
		clicouBotao = false;
	},
	onCloseAjudaBox: function(){},
	closeAcessibilidadeBox: function(){
		$('#btnAcessibilidade').parent().removeClass('hover');
		$('#btnAcessibilidade, #acessibilidade').attr('aria-expanded',false);
		TweenMax.to( "#acessibilidade #slideAcessivel", .5, { left:'-100%', ease: Power2.easeOut, onComplete: function(){ $("#acessibilidade").attr('data-status','closed') } } );
		//TweenMax.to( "#acessibilidade .content:last-of-type", .5, { left:-440, ease: Power2.easeOut } );
		$("#btnPlrOpt").attr('data-show',false);
		tamanhoAbaSuperiorClose();
		clicouBotao = false;

	},
	closeCreditoBox: function(){
		$('#btnCreditos').parent().removeClass('hover');
		$('#btnCreditos, #informacoes').attr('aria-expanded',false);
		TweenMax.to( "#informacoes .content", .7, { left:'-100%', ease: Power2.easeOut, onComplete: function(){ $("#informacoes").attr('data-status','closed') } } );
	},
	closeTabs: function(){
		var that = InterfaceController;
		that.closeAjudaBox();
		that.closeAcessibilidadeBox();
		that.closeCreditoBox();
		tamanhoAbaSuperiorClose();
		clicouBotao = false;
	},
	iniciaGaleria: function(){
		var that = InterfaceController,
			i;
		if(that.galeria.length > 0){
			$('#galeria').html('');
			for(i=0; i<that.galeria.length; i++){
				var g = that.galeria[i];

				var _titulo = '',
					_texto = '',
					_credito = '',
					_legenda = '',
					_classCredito = '',
					_classTitulo = '',
					_classLegenda = '',
					_hasVideo = '',
					_ampliacao = '';

				if(g.image.titulo){
					if(g.image.tituloIsInvert){
						_classTitulo = "invert";
					}
					_titulo = "<h4 class='"+_classTitulo+"'>"+g.image.titulo+"</h4>";
				}
				if(g.image.texto){
					_texto = "<div class='texto' data-status='closed'><div class='scrollbar'><div class='track'><div class='thumb'><div class='end'></div></div></div></div> <div class='viewport'> <div class='overview'>"+g.image.texto+"</div> </div></div> <button class='btMaisMenos' data-id='"+i+"' data-status='mais'>SAIBA MAIS</button>";
				}
				if(g.image.legenda){
					if(g.image.legendaIsInvert){
						_classLegenda = "invert";
					}
					_legenda = "<div class='legenda "+_classLegenda+"'>"+g.image.legenda+"</div>";
				}
				if(g.image.credito){
					if(g.image.creditoIsPreto){
						_classCredito = "black";
					}
					_credito = "<div class='credito'> <small class='"+_classCredito+"'>"+g.image.credito+"</small> </div>";
				}
				if(typeof(g.image.hasVideo) == 'function'){
					_hasVideo = "<div class='video' data-id='"+i+"'></div>";
				}
				if(g.image.ampliacao){
					_ampliacao = "<div class='ampliacao main displayNone'> <img class='abs' src='"+g.image.src+"' /> </div> <buttom class='btnZoom' data-status='mais' title='ZOOM'>ZOOM</buttom> ";
				}
				$('#galeria').append("<section id='g"+i+"' data-tipo='"+g.tipo+"' class='main galItens'> <div class='content'> <img src='"+g.image.src+"' /> "+_hasVideo+" "+_titulo+" "+_credito+" "+_legenda+" "+_texto+" </div> "+_ampliacao+" </section>");
			}

			$('#galeria').append("<buttom title='ANTERIOR' class='stNvGaleria stPrev'>ANTERIOR</buttom> <buttom title='PRÓXIMO' class='stNvGaleria stNext'>PRÓXIMO</buttom> <buttom title='FECHAR' class='fechar'>FECHAR</buttom>");

			$('#galeria .btMaisMenos').unbind('keydown tap').bind('keydown tap',that.textoGaleria);
			$('#galeria .stNext').unbind('keydown tap').bind('keydown tap',that.nextGaleria);
			$('#galeria .stPrev').unbind('keydown tap').bind('keydown tap',that.prevGaleria);
			$('#galeria .fechar').unbind('keydown tap').bind('keydown tap',that.closeGaleria);
			$('#galeria .btnZoom').unbind('keydown tap').bind('keydown tap',that.ampliaGaleria);
			$('#galeria .video').unbind('keydown tap').bind('keydown tap',function(e){
				var _id = parseInt($(this).attr('data-id'));
				InterfaceController.galeria[_id].image.hasVideo();
			});
			$('#galeria *').attr('tabindex',-1).attr('aria-hidden',true);
			InterfaceController.closePopup = that.closeGaleria;
		}
	},
	openFeedback: function(id,callback){
		$(id).fadeIn(500,callback);
		var w = parseInt($(id+' section').width()),
			h = parseInt($(id+' section').height());
		$(id+' section').css({
			'margin-top':-(h / 2)+'px',
			'margin-left':-(w / 2)+'px'
		});
	},
	openQuestion: function(){
		$('#questionSection').fadeIn(500);
		$('#questionSection section .title').html(Textos.question_title)
		$('#questionSection section .subtitle').html(Textos.question_subtitle)
		$('#questionSection section .question_content').html(Textos.question_content)
		$('#questionSection section .question_font').html(Textos.question_font)
		$('#questionSection section .question_acesso').html(Textos.question_acesso)
		$('#questionSection section .image_section .img_question ').attr('src' , Textos.image_src)
		$('#questionSection section .image_section span .image_font ').html(Textos.image_font)
		$('#questionSection section .image_section span .image_acesso ').html(Textos.image_acesso)
		$('#questionSection section .question_enunciado').html(Textos.question_enunciado)
		$('#questionSection section .question_item_a').html(Textos.question_item_a)
		$('#questionSection section .question_item_b').html(Textos.question_item_b)
		$('#questionSection section .question_item_c').html(Textos.question_item_c)
		$('#questionSection section .question_item_d').html(Textos.question_item_d)
	},
	closeQuestion: function() {
		$('#questionSection').hide();
	},
	openVideoIntroducao: function() {
		InterfaceController.closeQuestion();
		InterfaceController.closePopUpVideo();
		$('#videoSection').fadeIn(100);
		executaVideo('1-introducao');	
	},
	openVideoExplicacaoTexto: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('2-explicacao_texto');	
	},
	openVideoEnunciado: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('3-leitura-enunciado');	
	},
	openVideoItemA: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('4-item_a');	
	},
	openVideoItemB: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('5-item_b');	
	},
	openVideoItemC: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('6-item_c');	
	},
	openVideoItemD: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('7-item_d');	
	},
	openVideoEncerramento: function() {
		InterfaceController.closePopUpVideo();
		executaVideo('8-encerramento');	
	},
	openPopUpVideo1: function() {
		$('#popUpVideo1').fadeIn(100);
	},
	openPopUpVideo2: function() {
		$('#popUpVideo2').fadeIn(100);
	},
	openPopUpVideo3: function() {
		$('#popUpVideo3').fadeIn(100);
	},
	openPopUpVideo4: function() {
		$('#popUpVideo4').fadeIn(100);
	},
	closePopUpVideo: function() {
		$('#popUpVideo1').hide();
		$('#popUpVideo2').hide();
		$('#popUpVideo3').hide();
		$('#popUpVideo4').hide();
	},
	ampliaGaleria: function(e){
		if (e.keyCode === 13 || e.type === 'tap') {
			var that = InterfaceController;
				$btZoom = $(this),
				$ampliacao = $('#g'+that.idGaleria+' .ampliacao'),
				$img = $ampliacao.children('img');
			if( $btZoom.attr('data-status') == 'mais' )
			{
				$btZoom.attr('data-status','menos');
				$ampliacao.fadeIn(500);
				$img.draggable({
					cursor: 'move',
					axis: 'x',
					start: function(event,ui){ Functions.dndStartFunction(ui); },
					drag: function(event,ui){
						//Functions.dndDragFunction(ui);
						var _w = ($img.width() - $(window).width()),
							_h = ($img.height() - $(window).height());
						if(ui.position.left > 0){
							ui.position.left = 0;
						}else if(ui.position.left < -_w){
							ui.position.left = -_w;
						}
						/*if(ui.position.top > 0){
							ui.position.top = 0;
						}else if(ui.position.top < -_h){
							ui.position.top = -_h;
						}*/
					}
				});
				$('#galeria .fechar, #galeria .stNvGaleria').fadeOut(500);
			}else{
				$btZoom.attr('data-status','mais');
				$('#g'+that.idGaleria+' .ampliacao').fadeOut(500);
				$('#galeria .fechar').fadeIn(500);
				$('#galeria .stNvGaleria').show();
				if(that.idGaleria == 0){
					$('#galeria .stPrev').hide();
				}
				if(that.idGaleria >= (that.galeria.length-1)){
					$('#galeria .stNext').hide();
				}
				if(that.galeria.length == 1){
					$('#galeria .stNvGaleria').hide();
				}
			}
		}
	},
	showGaleria: function(id){
		var that = InterfaceController;
		that.closeAbas(window.event);
		that.idGaleria = parseInt(id);

		$('#galeria .stPrev, #galeria .stNext, #galeria .fechar').show();
		if(that.idGaleria == 0){
			$('#galeria .stPrev').hide();
		}
		if(that.idGaleria >= (that.galeria.length-1)){
			$('#galeria .stNext').hide();
		}
		if(that.galeria.length == 1){
			$('#galeria .stNvGaleria').hide();
		}

		$('#galeria .galItens').hide();
		$('#galeria #g'+id).show();;
		$('#galeria').fadeIn(500);

		$('#galeria .galItens').each(function(k,el){
			$(el).find('.legenda').css({bottom:42});
			if($(el).find('.btMaisMenos').size() <= 0){
				$(el).find('.legenda').css({bottom:0});
			}
		});
	},
	prevGaleria: function(e){
		if (e.keyCode === 13 || e.type === 'tap') {
			var that = InterfaceController,
				prev = that.idGaleria-1;
				if(prev >= 0){
					$('#galeria #g'+that.idGaleria).fadeOut(500);
					$('#galeria #g'+prev).fadeIn(500);
					that.idGaleria = prev;
					if(prev <= 0) $('#galeria .stPrev').hide();
					$('#galeria .stNext').show();
				}
		}
	},
	nextGaleria: function(e){
		if (e.keyCode === 13 || e.type === 'tap') {
			var that = InterfaceController,
				next = that.idGaleria+1;
			if(next <= (that.galeria.length-1)){
				$('#galeria #g'+that.idGaleria).fadeOut(500);
				$('#galeria #g'+next).fadeIn(500);
				that.idGaleria = next;
				if(next >= (that.galeria.length-1)) $('#galeria .stNext').hide();
				$('#galeria .stPrev').show();
			}
		}
	},
	closeGaleria: function(e){
		var that = InterfaceController;
		$('#galeria').fadeOut(500);
		that.callBackCloseGaleria();
	},
	callBackCloseGaleria: function(){},
	textoGaleria: function(e){
		if (e.keyCode === 13 || e.type === 'tap') {
			var that = InterfaceController,
				$bt = $(this),
				$texto = $('#galeria #g'+that.idGaleria+' .texto'),
				$legenda = $('#galeria #g'+that.idGaleria+' .legenda');

			$texto.tinyscrollbar({invertscroll: true});
			if($texto.attr('data-status') == 'closed'){
				$bt.attr('data-status','fechar').html('FECHAR');
				$texto.attr('data-status','opened').addClass('anima');
				$legenda.addClass('anima');
				$('#galeria .stNvGaleria, #galeria .fechar, #galeria .btnZoom').hide();
				$('#galeria .lock').show();
			}else{
				$bt.attr('data-status','mais').html('SAIBA MAIS');
				$texto.attr('data-status','closed').removeClass('anima');
				$legenda.removeClass('anima');
				$('#galeria .stNvGaleria, #galeria .fechar, #galeria .btnZoom').show();
				if(that.idGaleria >= (that.galeria.length-1)){
					$('#galeria .stNext').hide();
				}else if(that.idGaleria <= 0){
					$('#galeria .stPrev').hide();
				}
				if(that.galeria.length == 1){
					$('#galeria .stNvGaleria').hide();
				}

				$('#galeria .lock').hide();
			}
		}
	},
	closePopup: function(e){}
}

var	volume = 1;
function setVolume(){
	var objects = document.getElementsByClassName('volumeController');
	var i = 0,
		t = objects.length;
	for(i = 0; i < t; i++){
		if(objects[i]) objects[i].volume = volume;
	}
	if(volume == 0){
		$('#btSom').attr('data-status','off');
	}else{
		$('#btSom').attr('data-status','on');
	}
}
function stopAllMedia(){
	var objects = document.getElementsByClassName('volumeController');
	var i = 0,
		t = objects.length;
	for(i = 0; i < t; i++){
		if(objects[i] && typeof(objects[i].pause) == 'function'){
			objects[i].pause();
			$(objects[i]).attr('src','');
		}
	}
}
function stopMedia(tag){
	var media = document.getElementById(tag);
	media.pause();
	$(media).attr('src','');
}

function mute(){
	var objects = document.getElementsByClassName('volumeController');
	var i = 0,
		t = objects.length;
	for(i = 0; i < t; i++){
		if(objects[i]) objects[i].muted=true;
	}
}

function unmute(){
	var objects = document.getElementsByClassName('volumeController');
	var i = 0,
		t = objects.length;
	for(i = 0; i < t; i++){
		if(objects[i]) objects[i].muted=false;
	}
}

function playAudio(tag,nome,callback){
	var audio = document.getElementById(tag);
	audio.src = "application/assets/audios/"+nome+A_EXT;
	$(audio).unbind('ended');
	if(callback){
		$(audio).bind('ended',callback);
	}
	audio.play();
}

var __meplayer;
function playVideo(options){
	var loopOption = ( options.loop ) ? "loop='loop'" : "";
	var trackOption = ( options.track ) ? '<track default label="Legenda" srclang="pt" kind="subtitles" type="text/vtt" src="application/assets/videos/'+options.video+'.vtt">' : "";

	//if(__meplayer) __meplayer.remove(true);
	if( $("[data-idvideo="+options.id+"]").size() > 0 ){
		$("[data-idvideo="+options.id+"]").replaceWith("<video id='"+(options.id.replace("#",""))+"' class='' width='"+options.dimensions[0]+"' height='"+options.dimensions[1]+"' preload='auto' src='application/assets/videos/"+(options.video+V_EXT)+"' data-src='"+options.video+"' "+loopOption+">"+trackOption+"</video>")
	}
	__meplayer = new MediaElementPlayer(options.id,{
		features: ['playpause','progress','current','duration','options','tracks'],
		clickToPlayPause: false,
		autoRewind: false,
		success: function(player, node) {
			$('.mejs-overlay-play, .mejs-overlay-loading, .mejs-captions-button').remove();
			$(options.id).attr('class','abs volumeController');

			$mep = $(player).parent().parent().parent();
			$mep.attr('data-idvideo',options.id);

			var endVideo = function(){
				InterfaceController.acessibilidade.no_close_caption = true;
				InterfaceController.acessibilidade.no_speed = true;
				InterfaceController.canPlay = false;
				$('[data-controller=no_close_caption]').hide();
				$('[data-controller=no_speed]').hide();
				if($(window)[0].outerWidth > $(window)[0].outerHeight && $(window)[0].outerHeight < 476){
					$('.msgRotate').show();
				}
			}

			$(player)
				.unbind('ended').bind('ended',function(e){
					endVideo();
					options.callback_ended(e)
				})
				.unbind('emptied').bind('emptied',function(e){
					var path = e.target.src.split('/');
					if( path[ path.length-1 ] != options.video+V_EXT ){
						setTimeout(endVideo,700);
					}
				})
				.unbind('playing').bind("playing",function(e){
					InterfaceController.canPlay = true;
					if( InterfaceController.acessibilidade.no_close_caption ){
						$('[data-controller=no_close_caption]').hide();
					}else{
						$('[data-controller=no_close_caption]').show();
					}
					if( InterfaceController.acessibilidade.no_speed ){
						$('[data-controller=no_speed]').hide();
					}else{
						$('[data-controller=no_speed]').show();
					}
					if(__meplayer.node.textTracks.length > 0) __meplayer.node.textTracks[0].mode = "hidden";
					options.callback_playing(e)
				});

			$('#acessibilidade .cc_speed_control .radio').attr('aria-checked',false);
			$('#acessibilidade .cc_speed_control').attr('aria-selected',false);
			var txtSpeed = { 1: '1.0 x', 2: '2.0 x', .5: '0.5 x' },
				txtBotao = { 1: 'Velocidade normal', 2: 'Velocidade rápida', .5: 'Velocidade lenta' };
			$("#btnPlrSpeed")
				.attr('data-velocidade',InterfaceController.acessibilidade.speed)
				.attr('title',txtBotao[InterfaceController.acessibilidade.speed].toUpperCase())
				.html( txtSpeed[InterfaceController.acessibilidade.speed] );
			switch(InterfaceController.acessibilidade.speed){
				case 0.5:
					$('#btnCCSpeed1').find('.radio').attr('aria-checked',true);
					$('#btnCCSpeed1').attr('aria-selected',true);
				break;
				case 1:
					$('#btnCCSpeed2').find('.radio').attr('aria-checked',true);
					$('#btnCCSpeed2').attr('aria-selected',true);
				break;
				case 2:
					$('#btnCCSpeed3').find('.radio').attr('aria-checked',true);
					$('#btnCCSpeed3').attr('aria-selected',true);
				break;
			}
			if(options.controls){
				$('.mejs-controls').css({ opacity: 1});
			}else{
				$('.mejs-controls').css({ opacity: 0});
				setTimeout(function(){ $('.mejs-container *').attr('tabindex',-1).attr('aria-hidden',true); },500);
			}
			if(InterfaceController.isMuted){
				player.muted = true;
			}
			InterfaceController.acessibilidade.no_speed = false;
			$("#btnPlrSpeed").unbind('keydown tap').bind('keydown tap',function(e)
			{
				if (e.keyCode === 13 || e.type === 'tap') {
					$('#acessibilidade .cc_speed_control .radio').attr('aria-checked',false);
					$('#acessibilidade .cc_speed_control').attr('aria-selected',false);
					switch( $(this).attr('data-velocidade') ){
						case '1':
							player.playbackRate = 2;
							InterfaceController.acessibilidade.speed = 2
							$('#btnCCSpeed3').find('.radio').attr('aria-checked',true);
							$('#btnCCSpeed3').attr('aria-selected',true);
						break;
						case '2':
							player.playbackRate = 0.5;
							InterfaceController.acessibilidade.speed = 0.5
							$('#btnCCSpeed1').find('.radio').attr('aria-checked',true);
							$('#btnCCSpeed1').attr('aria-selected',true);
						break;
						case '0.5':
							player.playbackRate = 1;
							InterfaceController.acessibilidade.speed = 1
							$('#btnCCSpeed2').find('.radio').attr('aria-checked',true);
							$('#btnCCSpeed2').attr('aria-selected',true);
						break;
					}
					$("#btnPlrSpeed")
						.attr('data-velocidade',InterfaceController.acessibilidade.speed)
						.attr('title',txtBotao[InterfaceController.acessibilidade.speed].toUpperCase())
						.html( txtSpeed[InterfaceController.acessibilidade.speed] );
				}
			});

			$("#btnPlrOpt").unbind('keydown tap').bind('keydown tap',function(e)
			{
				if (e.keyCode === 13 || e.type === 'tap') {
					InterfaceController.openAbas(e);
					setTimeout(function(){
						$('#btnAcessibilidade').trigger('tap');
						if(e.type != 'tap') $('#btnAcessibilidade')[0].focus();
					},800);
				}
			});

			if( options.track )
			{
				InterfaceController.acessibilidade.no_close_caption = false;
				$("#btnPlrCC")
					.unbind('keydown tap')
					.bind('keydown tap',function(e)
					{
						if (e.keyCode === 13 || e.type === 'tap') {
							if( InterfaceController.acessibilidade.close_caption ){
								__meplayer.setTrack('none');
								InterfaceController.acessibilidade.close_caption = false;
								$('#acessibilidade .cc_control').addClass('disabled');
								$('#acessibilidade .cc_control.tabindex').attr('tabindex',-1);
								$('#btnClosedCaption .text').html('Desativada');
								$('#btnClosedCaption').attr('aria-label','Legenda desativada').attr('aria-selected',false);
								$("#btnPlrCC").attr('title','LEGENDA DESATIVADA');
							}else{
								__meplayer.setTrack('pt');
								InterfaceController.acessibilidade.close_caption = true;
								$('#acessibilidade .cc_control').removeClass('disabled');
								$('#acessibilidade .cc_control.tabindex').attr('tabindex',0);
								$('#btnClosedCaption .text').html('Ativada');
								$('#btnClosedCaption').attr('aria-label','Legenda ativada').attr('aria-selected',true);
								$("#btnPlrCC").attr('title','LEGENDA ATIVADA');
								$('.mejs-captions-position').attr('data-size','s'+InterfaceController.acessibilidade.font_size);
							}
							$(this).attr('data-show',InterfaceController.acessibilidade.close_caption);
							$('#btnClosedCaption .checkbox').attr('aria-checked',InterfaceController.acessibilidade.close_caption);
						}
					});
				$('#acessibilidade .cc_control').addClass('disabled');
				$('#acessibilidade .cc_control.tabindex').attr('tabindex',-1);
				$('#btnClosedCaption').attr('aria-label','Legenda desativada').attr('aria-selected',true);
				$('#btnClosedCaption .text').html('Desativada');
				$('#btnClosedCaption .checkbox').attr('aria-checked',InterfaceController.acessibilidade.close_caption);
			}else{
				InterfaceController.acessibilidade.close_caption = false;
				InterfaceController.acessibilidade.no_close_caption = true;
				$("#btnPlrCC").attr('data-show',false).unbind('keydown tap');
				$('#acessibilidade .cc_control').addClass('disabled');
				$('#acessibilidade .cc_control.tabindex').attr('tabindex',-1);
				$('#acessibilidade #btnClosedCaption .text').html('Desativada');
				$('#btnClosedCaption').attr('aria-label','Legenda desativada').attr('aria-selected',true);
				$('#acessibilidade #btnClosedCaption .checkbox').attr('aria-checked',InterfaceController.acessibilidade.close_caption);
			}
			$('#btnAcessibilidade').show();

			setTimeout(function(){
				player.playbackRate = InterfaceController.acessibilidade.speed;
				if( InterfaceController.acessibilidade.close_caption ){
					__meplayer.setTrack('pt');
					InterfaceController.acessibilidade.close_caption = true;
					$('#acessibilidade .cc_control').removeClass('disabled');
					$('#acessibilidade .cc_control.tabindex').attr('tabindex',0);
					$('#btnClosedCaption .text').html('Ativada');
					$('#btnClosedCaption').attr('aria-label','Legenda ativada').attr('aria-selected',true);
					$("#btnPlrCC").attr('data-show',true).attr('title','LEGENDA ATIVADA');
					$('.mejs-captions-position').attr('data-size','s'+InterfaceController.acessibilidade.font_size);
				}
			},50);
		}
	});
	__meplayer.setSrc('application/assets/videos/' + options.video + V_EXT);
	__meplayer.play();
	InterfaceController.canPlay = true;
	if(InterfaceController.isMuted == true){mute();};
	resizeAll();
}

function playPausedAudio(tag){
	var audio = document.getElementById(tag);
	if(audio)
		audio.play();
}
function playPausedVideo(tag){
	var video = document.getElementById(tag);
	if(video && video.currentTime != 0)
		video.play();
}
function pauseAudio(tag){
	var audio = document.getElementById(tag);
	if(audio)
		audio.pause();
}
function pauseVideo(tag){
	var video = document.getElementById(tag);
	if(video)
		video.pause();
}

function tamanhoAbaSuperiorOpen(){
	if ($(window).width() <= 320 || $(window).width() <= 425 && clicouBotao == true) {
		TweenMax.to( "#stage #interface .superior", .6, { width:'100%', delay: .1, ease: Power2.easeOut } );
	}else{
		TweenMax.to( "#stage #interface .superior", .6, { width: 425, delay: .1, ease: Power2.easeOut } );
	}

	if (InterfaceController.acessibilidade.autoContraste == true) {
		$('#stage #interface .superior').css('margin-left','-1px');
	}else{
		$('#stage #interface .superior').css('margin-left','0px');
	}
	$('#btnOpcoes').addClass( "openMenu" );
}

function tamanhoAbaSuperiorClose(){
	if ($(window).width() <= 320) {
		TweenMax.to( "#stage #interface .superior", .6, { width:'100%', ease: Power2.easeOut } );
	}else{
		TweenMax.to( "#stage #interface .superior", .6, { width: 320, ease: Power2.easeOut } );
	}

	$('#stage #interface .superior').css('margin-left','0px');
	$('#btnOpcoes').removeClass( "openMenu" );
}

var creditoStack = []
function showCredito(id,txt,callback,noStack)
{
	var show = ( creditoStack.length > 0 && !noStack ) ? false : true;
	creditoStack.push({id:id, text:txt, call:callback});
	if( show ) runStackCredito();
}
function runStackCredito(){
	if( creditoStack.length > 0 ){
		$(creditoStack[0].id).stop().hide().fadeIn(500);
		$(creditoStack[0].id).find('small').html( creditoStack[0].text );
		TweenMax.delayedCall( 5, function(){
			if( typeof(creditoStack[0].call) == 'function' ) creditoStack[0].call();
			$(creditoStack[0].id).fadeOut(500,function(){
				creditoStack.shift();
				runStackCredito();
			});
		});
	}
}

var boxScroll;
function arrowScroll(dir)
{
	if( boxScroll && (boxScroll.contentSize > boxScroll.trackSize) ){
		var as_y =  boxScroll.contentPosition,
			limitY = boxScroll.contentSize - boxScroll.trackSize,
			wsa = 30;
		if( dir == 'up' ){
			as_y -= wsa;
			if( as_y < 0 ) as_y = 0;
		}else if( dir == 'down' ){
			as_y += wsa;
			if( as_y >= limitY ) as_y = limitY;
		}
		boxScroll.update(as_y);
	}
}

function setFocus(jqr){ $(jqr)[0].focus(); setTimeout(function(){ $(jqr)[0].blur(); },50); }
