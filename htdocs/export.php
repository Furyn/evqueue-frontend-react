<?php
require_once __DIR__ . '/includes/inc/auth_check.php';

$xsl = new XSLEngine();

$filename = tempnam('/tmp','evqueue-frontend-');

$zip = new ZipArchive();
$zip->open($filename,ZipArchive::CREATE|ZipArchive::OVERWRITE);

// Fetch workflow XML
$workflow_xml = $xsl->Api('workflow','get',[ 'id' => $_GET['workflow_id'] ]);

$workflow_dom = new DOMDocument();
$workflow_dom->loadXML($workflow_xml);

$workflow_xml = $workflow_dom->saveXML($workflow_dom->documentElement->firstChild);
$zip->addFromString('workflow.xml',$workflow_xml);

// Fetch dependencies (ie tasks that are used by this workflow)
$workflow_xpath = new DOMXPath($workflow_dom);
$workflow_name = $workflow_xpath->evaluate('string(/response/workflow/@name)');
$tasks = $workflow_xpath->query('//task');
foreach($tasks as $task)
{
	// Fetch task description and add to Zip
	$task_name = $task->getAttribute('name');
	$task_xml = $xsl->Api('task','search',[ 'name' => $task_name]);
	
	$task_dom = new DOMDocument();
	$task_dom->loadXML($task_xml);
	
	$task_xml = $task_dom->saveXML($task_dom->documentElement->firstChild);
	$zip->addFromString("tasks/$task_name.xml",$task_xml);
}

$zip->close();

// Stream zip file
header("Content-Type: application/zip");
header("Content-Disposition: attachment; filename=$workflow_name.zip");

readfile($filename);
unlink($filename);
?>
