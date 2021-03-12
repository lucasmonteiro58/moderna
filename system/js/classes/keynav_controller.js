var KeyNavigationController =
{
	map: {
		 9: false,	//tab
		13: false,	//enter
		16: false,	//shift
		18: false,	//alt
		27: false,	//esc
		32: false,	// espaço --> pausar/tocar vídeo
		37: false,	// seta esquerda
		38: false,	// seta cima
		39: false,	// seta direita
		40: false,	// seta baixo
		65: false,	// a --> alt + a Vai para acessibilidade
		67: false,	// c --> alt + c Vai para conteúdo
		79: false,	// o --> alt + o Abre Opções
		88: false	// x --> alt + x Fecha popups
	},

	pageX: 0,
	pageY: 0,

	keydownCallback: function(){},
	keyupCallback: function(){},

	init: function(ev)
	{
		var that = KeyNavigationController;
		that.pageX = ev.pageX;
		that.pageY = ev.pageY;
		$(document)
			.touchmove(function(e){
				if(e.touches){
					if( e.touches[0].clientX != that.pageX && e.touches[0].clientY != that.pageY ){
						that.pageX = e.touches[0].clientX;
						that.pageY = e.touches[0].clientY;
						$('#stage *:focus').not('input, select, textarea').blur();

						if( InterfaceController.oedIsReady ) $('#stage .tocar').hide();
					}
				}
			})
			.mousemove(function(e){
				if( e.pageX != that.pageX && e.pageY != that.pageY ){
					that.pageX = e.pageX;
					$('#stage *:focus').not('input, select, textarea').blur();
				}
			})
			.keydown(function(e) {
				if (e.keyCode in that.map) {
					that.map[e.keyCode] = true;
				}
				if( $('.mejs-controls').size() > 0 ){
					$('.mejs-controls').css({ visibility: 'visible' });
				}
				that.keydownCallback();
			})
			.keyup(function(e) {
				if (e.keyCode in that.map) {
					//console.log(e.keyCode)
					if( that.map[18] && BROWSER == 'Firefox' ){ e.preventDefault(); e.stopPropagation(); }
					if (that.map[18] && that.map[79]){// Abre Opções
						InterfaceController.openAbas();
						$('#btnOpcoes')[0].focus();
						that.map[79] = false;
					}
					else if (that.map[18] && that.map[67]){// Vai para conteúdo
						InterfaceController.closeAbas();
						$('#interatividade')[0].focus();
						that.map[67] = false;
					}
					else if (that.map[18] && that.map[65]){// Vai para acessibilidade
						InterfaceController.openAbas(e);
						setTimeout(function(){
							$('#btnAcessibilidade').trigger('tap');
							$('#btnAcessibilidade')[0].focus();
						},800);
						that.map[65] = false;
					}
					else if (that.map[18] && that.map[88]){// Fecha popups
						$('#stage .tocar').hide();// suprir necessidade do exemplo do protótipo. Verificar se realmente é necessário em todos os casos
						InterfaceController.closePopup(e);
						that.map[88] = false;
					}
					else if (that.map[32]){// Toca ou pausa o vídeo
						var v = document.getElementById('video'),
							status = $('#interface').attr('data-status');
						if( v && status == 'off' ){
							if(v.paused||v.ended){
								v.play();
							}else{
								v.pause();
							}
						}
					}
					else if (that.map[37]){// voltar para o item correspondente do menu
						var activedescendant = $('#stage #interface').attr('aria-activedescendant');
						if( $('#'+activedescendant).size() > 0 ){
							$('#'+activedescendant)[0].focus();
							switch(activedescendant){
								case 'btnAjuda': InterfaceController.closeAjudaBox(); break;
								case 'btnCreditos': InterfaceController.closeCreditoBox(); break;
								case 'btnAcessibilidade': InterfaceController.closeAcessibilidadeBox(); break;
							}
						}
					}
					else if (that.map[38]){// tiny scroll up
						arrowScroll('up');
					}
					else if (that.map[40]){// tiny scroll down
						arrowScroll('down');
					}
					else if (that.map[27]){// sair do OED no livro digital
						if( parent.app ){
							console.log('Saíu do OED');
							parent.app.api.getFocus();
						}else{
							console.log('Não encontrado a variavel [parent.app]');
						}
					}
					that.map[e.keyCode] = false;
				}else{
					if( $('input').size() == 0 ) e.preventDefault();
				}
				that.keyupCallback();
			});
	}
}
