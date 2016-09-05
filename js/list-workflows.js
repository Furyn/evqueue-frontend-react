$(document).ready( function() {

	$(document).delegate( '.bigger', 'click', function() {
		
		if ($(this).parent().children("div.content_xml").is(":visible")){
			$(this).parent().children("div.content_xml").css("display","none")
			$(this).parent().children("div.content_xml_resume").css("display","block")
		}else{
			$(this).parent().children("div.content_xml").css("display","block")
			$(this).parent().children("div.content_xml_resume").css("display","none")
		}
	});	
	
	
});

function workflow_edit_method()
{
	$( "#workflow_edit_select" ).dialog({
		buttons: [
			{ text: "Simple", click: function() { window.location='manage-task.php?create_workflow=yes&parameters_mode=CMDLINE'; } },
			{ text: "Text", click: function() { window.location='manage-workflow.php'; } }
		]
	});
}