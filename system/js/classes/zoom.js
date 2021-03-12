var Zoom = {
	width:854,
	height:480,
	percent:100,
	element:'',
	hasDnD:'',
	init: function(cssID,prc,hasDnD)
	{
		var that = Zoom;		
		that.percent = prc;
		that.element = cssID;
		that.hasDnD = hasDnD;
		$(that.element)
			.css({transform:'scale(1,1)'})
			.attr('data-scale','1');
		if(that.hasDnD){
			$(that.element).draggable({
				disabled: true,
				cursor: 'move',
				start: function(event,ui){ Functions.dndStartFunction(ui); },
				drag: function(event,ui){ 
					var percent = ((that.percent - 100 ) / 100),
						_w = (that.width * percent),
						_h = (that.height * percent)
					Functions.dndDragFunction(ui);
					if(ui.position.left > 0){
						ui.position.left = 0;
					}else if(ui.position.left < -_w){
						ui.position.left = -_w;
					}
					if(ui.position.top > 0){
						ui.position.top = 0;
					}else if(ui.position.top < -_h){
						ui.position.top = -_h;
					}
				}
			});
		}
		$(".btnZoom").attr('data-status','mais').unbind('click').bind('click',Zoom.toggleZoom);
	},
	in: function()
	{
		var that = Zoom,
			scale = that.percent / 100;		
		$(that.element).css({transform:'scale('+scale+','+scale+')'}).attr('data-scale',scale);
		if( that.hasDnD ) $(that.element).draggable( "option", "disabled", false );
		$(".btnZoom").attr('data-status','menos');
		Main.noEventMobile = true;
	},
	out: function()
	{
		var that = Zoom;
		$(that.element).css({transform:'scale(1,1)'}).attr('data-scale','1');
		if( that.hasDnD ) $(that.element).draggable( "option", "disabled", true );
		$(".btnZoom").attr('data-status','mais');
		Main.noEventMobile = false;
	},
	toggleZoom: function()
	{
		var that = Zoom;
		if($(that.element).attr('data-scale') == "1"){
			that.in();
		}else{
			that.out();
		}
	}
}