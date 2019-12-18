 /*
  * This file is part of evQueue
  * 
  * evQueue is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  * 
  * evQueue is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with evQueue. If not, see <http://www.gnu.org/licenses/>.
  * 
  * Author: Thibault Kummer
  */

function Workflow(el,xml)
{
	this.el = el;
	
	this.attributes = new Object();
	
	this.undo_stack = [];
	this.redo_stack = [];
	
	// Initialise global node ID
	this.gnid = 0;
	
	// Load XML
	if(xml instanceof XMLDocument)
		this.xmldoc = xml;
	else
		this.xmldoc = jQuery.parseXML(xml);
	
	// Attribute IDs to each job
	this.xmldoc.documentElement.setAttribute('id','0');
	jobs = this.xmldoc.Query('//job',this.xmldoc);
	for(var i=0;i<jobs.length;i++)
		jobs[i].setAttribute('id',++this.gnid);
	
	// Attribute IDs to each task
	this.xmldoc.documentElement.setAttribute('id','0');
	jobs = this.xmldoc.Query('//task',this.xmldoc);
	for(var i=0;i<jobs.length;i++)
		jobs[i].setAttribute('id',++this.gnid);
	
	this.SetAttribute("name","");
}

Workflow.prototype.GetAttribute = function(name)
{
	return this.attributes[name];
}

Workflow.prototype.SetAttribute = function(name,value)
{
	this.attributes[name] = value;
}

Workflow.prototype.Backup = function(next_action)
{
	this.redo_stack = [];
	this.undo_stack.push({
		xml: this.GetXML(),
		next_action: next_action ? next_action : 'some action'
	});
}

Workflow.prototype.Undo = function()
{
	if(this.undo_stack.length==0) {
		Message('nothing to undo');
		return false;
	}
	
	var action = this.undo_stack.pop();
	Message('UNDO: '+action.next_action);
	
	this.redo_stack.push({
		xml: this.GetXML(),
		next_action: action.next_action
	});
	this.xmldoc = jQuery.parseXML(action.xml);
	return true;
}

Workflow.prototype.Redo = function()
{
	if(this.redo_stack.length==0){
		Message('nothing to redo');
		return false;
	}
	
	var action = this.redo_stack.pop();
	Message('REDO: '+action.next_action);
	
	this.undo_stack.push({
		xml: this.GetXML(),
		next_action: action.next_action
	});
	this.xmldoc = jQuery.parseXML(action.xml);
}

Workflow.prototype.GetXML = function(remove_id = false)
{
	if(!remove_id)
	{
		var xml = new XMLSerializer().serializeToString(this.xmldoc);
		return xml;
	}
	else
	{
		var newdom = document.implementation.createDocument(null,null);
		var root = newdom.importNode(this.xmldoc.documentElement,true);
		newdom.appendChild(root);
		var nodes = newdom.Query('//*',newdom);
		for(var i=0;i<nodes.length;i++)
			nodes[i].removeAttribute('id');
		var xml = new XMLSerializer().serializeToString(newdom);
		return xml;
	}
}

Workflow.prototype.GetRoot = function()
{
	return new Job(this.xmldoc.documentElement);
}

Workflow.prototype.GetParameters = function()
{
	var parameters = this.xmldoc.Query('/workflow/parameters/parameter',this.xmldoc);
	var ret = [];
	for(var i=0;i<parameters.length;i++)
		ret.push(parameters[i].getAttribute('name'));
	return ret;
}

Workflow.prototype.AddParameter = function(name)
{
	var parameters = this.xmldoc.Query('/workflow/parameters/parameter',this.xmldoc);
	for(var i=0;i<parameters.length;i++)
		if(parameters[i].getAttribute('name')==name)
			return false;
	
	var parameters_nodes =  this.xmldoc.Query('/workflow/parameters',this.xmldoc);
	var parameters_node;
	if(parameters_nodes.length>0)
		parameters_node = parameters_nodes[0];
	else
	{
		parameters_node = this.xmldoc.createElement('parameters');
		if(this.xmldoc.documentElement.firstChild)
			this.xmldoc.documentElement.insertBefore(parameters_node,this.xmldoc.documentElement.firstChild);
		else
			this.xmldoc.documentElement.appendChild(parameters_node);
	}
	
	var parameter = this.xmldoc.createElement('parameter');
	parameter.setAttribute('name',name);
	
	parameters_node.appendChild(parameter);
	
	return true;
}

Workflow.prototype.DeleteParameter = function(idx)
{
	var parameters = this.xmldoc.Query('/workflow/parameters/parameter',this.xmldoc);
	parameters[idx].parentNode.removeChild(parameters[idx]);
}

Workflow.prototype.GetCustomFilters = function()
{
	var filters = this.xmldoc.Query('/workflow/custom-filters/custom-filter',this.xmldoc);
	var ret = [];
	for(var i=0;i<filters.length;i++)
		ret.push({
			name: filters[i].getAttribute('name'),
			select: filters[i].getAttribute('select'),
			description: filters[i].getAttribute('description'),
		});
	return ret;
}

Workflow.prototype.DeleteCustomFilter = function(idx)
{
	var parameters = this.xmldoc.Query('/workflow/custom-filters/custom-filter',this.xmldoc);
	parameters[idx].parentNode.removeChild(parameters[idx]);
}

Workflow.prototype.GetJobByID = function(id)
{
	if(id==0)
		return this.GetRoot();
	
	jobs = this.xmldoc.Query('//job[@id = '+id+']',this.xmldoc);
	if(jobs.length==0)
		return false;
	
	return new Job(jobs[0]);
}

Workflow.prototype.GetTaskByID = function(id)
{
	tasks = this.xmldoc.Query('//task[@id = '+id+']',this.xmldoc);
	if(tasks.length==0)
		return false;
	
	return new Task(tasks[0]);
}

Workflow.prototype.get_tasks_width = function(job)
{
	var jobs = this.xmldoc.Query('subjobs/job',job);
	if(jobs.length==0)
		return 1;
	
	n = 0;
	for(var i=0;i<jobs.length;i++)
	{
		n += this.get_tasks_width(jobs[i]);
	}
	
	return n;
}

Workflow.prototype.GetTasksWidth = function()
{
	return this.get_tasks_width(this.xmldoc.documentElement);
}

Workflow.prototype.CreateJob = function()
{
	var new_job = this.xmldoc.createElement('job');
	new_job.setAttribute('id',++this.gnid);
	return new Job(new_job);
}

Workflow.prototype.CreateTask = function(path,parametersmode,outputmethod)
{
	var new_task = this.xmldoc.createElement('task');
	new_task.setAttribute('id',++this.gnid);
	new_task.setAttribute('path',path);
	new_task.setAttribute('parameters-mode',parametersmode);
	new_task.setAttribute('output-method',outputmethod);
	new_task.setAttribute('queue','default');
	return new Task(new_task);
}

Workflow.prototype.draw = function(branch,job,level)
{
	var jobs = job.GetSubjobs();
	
	for(var i=0;i<jobs.length;i++)
	{
		if(jobs.length==1)
			sep_html = "<div class='sep nosep'></div>";
		else
		{
			sep_class = 'sep';
			if(i==0)
				sep_class += ' lsep';
			else if(i==jobs.length-1)
				sep_class += ' rsep';
			sep_html = "<div class='"+sep_class+"'></div>";
		}
		
		branch.append("<div class='branch' data-type='branch'><div>"+sep_html+"</div><div class='droppable' data-parent-id='"+jobs[i].GetParentID()+"' data-sibling-pos='-1'><div class='postsep'></div></div></div>");
		var subbranch = branch.children().last();
		subbranch.append("<div class='nodesep droppable' data-parent-id='"+jobs[i].GetParentID()+"' data-sibling-pos='"+i+"'>&nbsp;</div>");
		subbranch.append("<div class='node' data-type='node' data-id='"+jobs[i].GetID()+"'>"+jobs[i].Draw()+"</div>");
		subbranch.append("<div class='nodesep droppable' data-parent-id='"+jobs[i].GetParentID()+"' data-sibling-pos='"+(i+1)+"'>&nbsp;</div>");
		subbranch.append("<div class='droppable presep' data-parent-id='"+jobs[i].GetID()+"' data-sibling-pos='-1'><div></div></div>");
		this.draw(subbranch,jobs[i],level+1);
	}
}

Workflow.prototype.Draw = function()
{
	this.el.html('');
	
	this.draw(this.el,this.GetRoot(),0);
	
	var tasks_width = this.GetTasksWidth();
	this.el.css('width',(tasks_width*222+2)+'px');
	
	$('.node').draggable({
		cursor:'grabbing',
		start:function(event, ui) {
			$(this).draggable('instance').offset.click = { left: Math.floor(ui.helper.width() / 2), top: Math.floor(ui.helper.height() / 2) };
			$(this).css('opacity','0.7');
		},
		stop:function(event, ui) {
			wf.Draw();
		}
	});
	$('.branch').draggable({
		cursor:'grabbing',
		start:function(event, ui) {
			$(this).find('.sep:first').remove();
			$(this).draggable('instance').offset.click = { left: Math.floor(ui.helper.width() / 2), top: Math.floor(ui.helper.height() / 2) };
			$(this).css('opacity','0.7');
		},
		stop:function(event, ui) {
			wf.Draw();
		}
	});
	
	$('.droppable').droppable({
		drop: function(event, ui) {
			
			var type = ui.draggable.data('type');
			var parent_id = $(this).data('parent-id');
			var sibling_pos = $(this).data('sibling-pos');
			var parent_job = wf.GetJobByID(parent_id);
			
			if(type=='task')
			{
				wf.Backup('Add task');
				
				var task_path = ui.draggable.data('path');
				var parameters_mode = ui.draggable.data('parametersmode')
				var output_method = ui.draggable.data('outputmethod')
				var new_job = wf.CreateJob();
				new_job.AddTask(wf.CreateTask(task_path,parameters_mode,output_method));
				parent_job.AddSubjob(sibling_pos,new_job);
			}
			else if(type=='branch')
			{
				wf.Backup('Move branch');
				
				var current_job_id = ui.draggable.find('.node:first').data('id');
				var current_job = wf.GetJobByID(current_job_id);
				current_job.MoveTo(parent_job,sibling_pos,true);
			}
			else if(type=='node')
			{
				wf.Backup('Move job');
				
				var current_job_id = ui.draggable.data('id');
				var current_job = wf.GetJobByID(current_job_id);
				current_job.MoveTo(parent_job,sibling_pos,false);
			}
			
			wf.Draw();
		},
		over: function(event,ui) {
			$(this).css('border','1px dashed grey');
		},
		out: function(event,ui) {
			$(this).css('border','0px');
		}
	});
	
	$('.node').droppable({
		drop: function(event, ui) {
			var type = ui.draggable.data('type');
			
			if(type=='task')
			{
				wf.Backup('Add task');
				
				var task_path = ui.draggable.data('path');
				var parameters_mode = ui.draggable.data('parametersmode')
				var output_method = ui.draggable.data('outputmethod')
				var current_job_id = $(this).data('id');
				var current_job = wf.GetJobByID(current_job_id);
				current_job.AddTask(wf.CreateTask(task_path,parameters_mode,output_method));
			}
		
			wf.Draw();
		},
		over: function(event,ui) {
			$(this).css('border-style','dashed');
		},
		out: function(event,ui) {
			$(this).css('border-style','solid');
		}
	});
	
	$('.node div.title').click(function() {
		job_editor.Open($(this).parent().data('id'));
	});
	
	$('.jobtask').click(function() {
		task_editor.Open($(this).data('id'));
	});
	
	$('.jobtask').contextmenu(function(e) {
		var task = $(e.target);
		if (!task.hasClass('jobtask'))
			task = task.parent('.jobtask');
		
		var idx = task.index()-1;
		var job_id = $(this).parent().data('id');
		
		$('#taskmenu').css({'top':e.pageY,'left':e.pageX, 'position':'absolute', 'border':'1px solid black', 'padding':'5px'});
		$('#taskmenu').show();
		
		$(document).off('click').on('click',function(e) {
			if($(e.target).attr('id')=='taskmenu' || $(e.target).parents('#taskmenu').length>0)
			{
				wf.Backup('Delete task');
				wf.GetJobByID(job_id).DeleteTask(idx);
				wf.Draw();
				
				$('#taskmenu').hide();
				return;
			}
			
			$('#taskmenu').hide();
		});
		
		
		return false;
	});
}
