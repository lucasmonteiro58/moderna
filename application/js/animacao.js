var NOME_DO_VIDEO = 'a_m17_VDfil_c13av_direitos';
var MOLDURA_MOBILE = '';//SE HOUVER A NECESSIDADE NO PROJETO DE APLICAR MOLDURA PARA O CELULAR, PREENCHA COM O NOME DA IMAGEM CASO CONTRARIO DEIXE VAZIO;

/*
Main.preRun = function(){
	executaVideo(NOME_DO_VIDEO);
}

var tocouAbertura = false;
function inicioAnimacao()
{
	$('#interatividade').fadeIn(500);
	
	InterfaceController.btnReiniciarCallback = reiniciar;
	
	tocouAbertura = true;							
	$('.mejs-time-rail').css('width',490);	
	$('.mejs-time-total').css('width',480);	
	document.getElementById('video').play();
}

DESCOMENTAR LINHA 90 TAMBÉM
*/
function inicioAnimacao()
{/*** FUNÇÃO CHAMADA PELO PROTÓTIPO PARA INICAR O OED
	ESTA FUNÇÃO É PADRÃO PARA O PROTÓRIPO, NÃO EXCLUIR.
	ELA DEVE SER UTILIZADA PARA INICAR VARIAVEIS, BOTÕES, TELAS, ETC...
	***/
	$('#interatividade').fadeIn(500);
	
	//EXEMPLO DE AÇÃO PARA O BOTÃO #btnMenu, ESTA AÇÃO PODE SER MODIFICADA OU EXCLUÍDA.
	//InterfaceController.btnMenuCallback = backHome;
	
	//EXEMPLO DE AÇÃO PARA O BOTÃO btnReiniciar, ESTA AÇÃO PODE SER MODIFICADA OU EXCLUÍDA.
	InterfaceController.btnReiniciarCallback = reiniciar;
	/*InterfaceController.btnAjudaCallback = function(){ playAudio('auAjuda','loc/ajuda',silencioAjuda); }
	InterfaceController.onCloseAjudaBox = silencioAjuda;	*/
	
	showFeedback(function(){ executaVideo('floresta_conservada'); });
		
	InterfaceController.galeria = galeria1;
	InterfaceController.iniciaGaleria();

	//InterfaceController.niveis = niveis;
}

InterfaceController.onOpenAbas = function()
{/*** FUNÇÃO CHAMADA PELO PROTÓTIPO PARA EXECUTAR UMA AÇÃO QUANDO O MENU FOR ACIONADO
	ELA PODE SER UTILIZADA PARA PARAR ÁUDIOS, CRONOMETROS, ETC...
	***/
	//pauseAudio('audio');// FUNÇÃO PARA PARADO UM ÁUDIO ([ID DA TAG])
	pauseVideo('video');// FUNÇÃO PARA PARADO UM VÍDEO ([ID DA TAG])
}

InterfaceController.onCloseAbas = function()
{/*** FUNÇÃO CHAMADA PELO PROTÓTIPO PARA EXECUTAR UMA AÇÃO QUANDO O MENU FOR FECHADO
	ELA PODE SER UTILIZADA PARA VOLTAR A EXECUTAR ÁUDIOS, CRONOMETROS, ETC...
	***/
	//playPausedAudio('audio');// FUNÇÃO PARA TOCAR UM ÁUDIO PARADO ([ID DA TAG])	
	if( InterfaceController.canPlay )  playPausedVideo('video');// FUNÇÃO PARA TOCAR UM VÍDEO PARADO ([ID DA TAG])	
}

function reiniciar()
{/*** FUNÇÃO DE EXEMPLO PARA CHAMAR O POPUP NA TELA
	ESTA FUNÇÃO PODE SER MODIFICADA OU EXCLUÍDA.
	***/
	stopAllMedia();
	InterfaceController.closeGaleria();
	$('.feedback, #areaVideo').hide();
	showFeedback(function(){ executaVideo('floresta_conservada'); });
}
	
function executaVideo(nomeVideo, _callBackEnd)
{	
	stopAllMedia();
	$('#areaVideo').fadeIn(500);	
	var funcEnd = function(e)
	{
		if (e.keyCode === 13 || e.keyCode === 88 || e.type === 'tap' || e.type === 'ended' ) {
			stopAllMedia();
			$('#areaVideo').fadeOut(500);
			if( typeof(_callBackEnd) == 'function' ) _callBackEnd();
			//$('#interface #btnAcessibilidade').hide();
		}
	}	
	
	playVideo({
		id: '#video',
		video: nomeVideo, 
		dimensions: [846,476],
		controls: true, 
		track: true, 
		callback_playing: function()
		{
			//if( !tocouAbertura ) pauseVideo('video');
			setTimeout( function(){ $('#posterVideo').fadeOut(500); }, 800 );
		}, 
		callback_ended: funcEnd
	});
	$('#posterVideo').attr('src','application/assets/images/'+nomeVideo+'.png').show();	
	InterfaceController.closePopup = funcEnd;
	$('#areaVideo .fechar').unbind('keydown tap').bind('keydown tap',funcEnd);
}

function showFeedback(callback)
{/*** FUNÇÃO DE EXEMPLO PARA CHAMAR O POPUP NA TELA
	ESTA FUNÇÃO PODE SER MODIFICADA OU EXCLUÍDA.
	***/
	$('.feedback section').css({width:300});
	$('.feedback section article blockquote').html(Textos.feedback);
	$('.feedback section article footer').html('<button class="btnPadrao" >FECHAR</button>');
	
	var execute = function(){
		$('.feedback').fadeOut(500);
		if( typeof(callback) == 'function' ) callback();
	}
	InterfaceController.closePopup = execute;
	$('.feedback section article footer .btnPadrao').unbind('keydown tap').bind('keydown tap',function(e){ 
		if (e.keyCode === 13 || e.type === 'tap') {
			execute();
		}
	});
	$('.feedback *').attr('tabindex',-1).attr('aria-hidden',true);
//	InterfaceController.openFeedback('.feedback');
	InterfaceController.openQuestion();
}