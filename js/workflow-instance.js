


$(document).ready( function() {
	
	$(document).delegate( 'img.relaunch', 'click', function() {
		var id = $(this).data("wfiid");
		$("#relaunch_"+id).dialog({ 
			minHeight: 300, 
			minWidth: 650, 
			modal: true, 
			title: "Relaunch workflow"
		});
		$('div.makeMeTabz:visible').tabs().removeClass('makeMeTabz');
	});
	
	// LAUNCH WORKFLOW
	$('select#launchWF').change( function () {
		var name = $(this).val();
		$("#launch_"+name).dialog({ 
			minHeight: 300, 
			minWidth: 650, 
			modal: true, 
			title: "Launch workflow "+name
		});
		$('div.makeMeTabz:visible').tabs().removeClass('makeMeTabz');
	});
	
	$('#searchByWorkflow #searchByWorkflowSelect').change(function(){
		window.location.href = 'index.php?wf_name='+$(this).val();
	});
	
	$(document).delegate('form[id*=launchForm_]', 'submit', function(event) {
		event.preventDefault();
		$(this).parents('[id^=relaunch_]').dialog('close');  // close the dialog box so that the user does not click twice on submit
		
		var params = $(this).serializeArray();
		params.push({name: 'form_id', value: 'launchWorkflow'});
		
		wsfwd({
			params: params,
			success: function () { window.location.reload(); }
		});
	});
	
	$(document).delegate( 'img.deleteWFI', 'click', function() {
		var id = $(this).data("wfiid");
		if (confirm("Delete the workflow instance n°"+id+"?")){
			deleteWfi(id);
		}
	});
	
	$(document).delegate( 'img.stopWFI', 'click', function() {
		var id = $(this).data("wfiid");
		if (confirm("Stop the workflow instance n°"+id+"?")){
			stopWfi(id);
		}
	});
	
});

$(document).ready( function () {
	get.p = typeof(get.p) != 'undefined' ? get.p : 1;
});

$(document).delegate('img.refreshWorkflows, span.prevPage, span.nextPage', 'click', function () {
	var status = $(this).data('status');
	
	if ($(this).hasClass('prevPage'))
		get.p -= 1;
	if ($(this).hasClass('nextPage'))
		get.p += 1;
	
	refreshWorkflows(status);
});

function refreshWorkflows (status) {
	$.get('ajax/'+status.toLowerCase()+'-workflows.php',get,function (content) {
		$('div#'+status+'-workflows').replaceWith(content);
	});
}


function deleteWfi(id){
	ajaxDelete('deleteWFI', id, '');
}

function stopWfi(id){
	ajaxDelete('stopWFI', id, '');
}