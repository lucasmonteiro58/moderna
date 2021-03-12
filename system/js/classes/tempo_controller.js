var TempoController = {
	timer: { pause: function(){}, kill:function(){} },
	minuto: 0,
	segundo: 0,
	miliseg:0,
	tempoLimite:0,
	isRegressivo:false,
	endCallback: function(){},
	init: function(tempoLimite, callback)
	{
		var that = TempoController;		
		that.minuto = 0;
		that.segundo = 0;
		that.miliseg = 0;
		if(that.isRegressivo){
			if(tempoLimite >= 60){
				that.minuto = (tempoLimite/60);
				that.segundo = (tempoLimite%60);
			}else{
				that.segundo = tempoLimite;
			}
		}
		that.endCallback = callback;
		that.tempoLimite = tempoLimite;
		that.iniciar();
	},
	iniciar: function()
	{
		var that = TempoController,
			Time = { value: 0};
		that.zerar();
		that.timer = TweenMax.to( Time, that.tempoLimite, {
			value: that.tempoLimite,
			onUpdate: function(tween){		
				var sec = parseInt(tween.target.value),
					prc =  parseInt( (sec * 100) / that.tempoLimite);
				$('.knob').val(sec).trigger('change');
				if(prc > 15 && prc <= 30){
					$('#cronometro .barra span:nth-child(1)').removeClass('cor');
				}else if(prc > 30 && prc <= 45){
					$('#cronometro .barra span:nth-child(2)').removeClass('cor');
				}else if(prc > 45 && prc <= 60){
					$('#cronometro .barra span:nth-child(3)').removeClass('cor');
				}else if(prc > 60 && prc <= 75){
					$('#cronometro .barra span:nth-child(4)').removeClass('cor');
				}else if(prc > 75 && prc <= 90){
					$('#cronometro .barra span:nth-child(5)').removeClass('cor');
				}else if(prc > 90 && prc <= 99){
					$('#cronometro .barra span:nth-child(6)').removeClass('cor');
				}else if(prc >= 100){
					$('#cronometro .nums').addClass('cor');
				}				
				if(that.isRegressivo){
					that.miliseg--;
					if(that.miliseg < 0){
						that.miliseg = 59;
						that.segundo--;
					}
					if(that.segundo < 0){
						that.segundo = 59;
						that.minuto--;
					}
				}else{
					that.miliseg++;
					if(that.miliseg > 59){
						that.miliseg = 0;
						that.segundo++;
					}
					if(that.segundo > 59){
						that.segundo = 0;
						that.minuto++;
					}
				}
				if(that.segundo <= 9){
					$("#tempo_seg").html('0'+that.segundo);
				}else{
					$("#tempo_seg").html(that.segundo);
				}
				if(that.minuto <= 9){
					$("#tempo_min").html('0'+that.minuto);
				}else{
					$("#tempo_min").html(that.minuto);
				}				
			}, onUpdateParams:["{self}"], onComplete: function(){
				that.endCallback();
			},
			ease: Linear.easeNone
		});
		//Timer.timeScale( 0.5 );
		$('#cronometro .barra span').addClass('cor');
		$('#cronometro .nums').removeClass('cor');
	},
	parar: function()
	{
		var that = TempoController;
		that.timer.pause();
		that.timer.kill();
	},
	zerar: function()
	{
		var that = TempoController;
		that.parar();
		that.minuto = 0;
		that.segundo = 0;
		that.miliseg = 0;
		if(that.isRegressivo){
			if(that.tempoLimite >= 60){
				that.minuto = (that.tempoLimite/60);
				that.segundo = (that.tempoLimite%60);
			}else{
				that.segundo = that.tempoLimite;
			}
		}
		$("#tempo_min, #tempo_seg").html('00');
	}
}