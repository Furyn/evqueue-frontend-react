<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:import href="value-selector.xsl" />
	
<xsl:template name="task-editor">
	<div id='task-editor' class="tabs dialog" title="Edit task">
		<ul>
			<li><a href="#tab-path">Path</a></li>
			<li><a href="#tab-inputs">Inputs</a></li>
			<li><a href="#tab-output">Output</a></li>
			<li><a href="#tab-conditionsloops">Conditions &amp; loops</a></li>
			<li><a href="#tab-queueretry">Queue &amp; retry</a></li>
			<li><a href="#tab-remote">Remote execution</a></li>
			<li><a href="#tab-stdin">Stdin</a></li>
		</ul>
		<div id="tab-path">
			<h2>
				Task path
				<span class="help faicon fa-question-circle" title="If you want to call an existing binary command, choose 'binary' type and enter its path. The path can contain arguments.&#10;&#10;You can still add dynamic inputs from evQueue. These inputs will be added to the command line arguments or sent as environment variables depending on the task configuration.&#10;&#10; If you choose 'script' type and 'static' script type, you can write here a small script that will be executed.&#10;&#10;If you select 'dynamic' script type, the content of the script will be taken from the output of an earlier task. For both cases, if you plan remote execution, you must enable the evQueue agent in the 'Remote execution' section."></span>
			</h2>
			<div class="formdiv">
				<form>
					<div>
						<label class="formLabel" for="type">Type</label>
						<select id="type">
							<option value="BINARY">binary</option>
							<option value="SCRIPT">script</option>
						</select>
					</div>
					<div>
						<label class="formLabel" for="path">Path</label>
						<input id="path" class="filenameInput" />
					</div>
					<div>
						<label class="formLabel" for="name">Name</label>
						<input id="name" class="filenameInput" />
					</div>
					<div>
						<label class="formLabel" for="wd">Working directory</label>
						<input id="wd" class="dirnameInput" />
					</div>
					<div>
						<label class="formLabel" for="script_type">Script type</label>
						<select id="script_type">
							<option value="STATIC">static</option>
							<option value="DYNAMIC">dynamic</option>
						</select>
					</div>
					<div>
						<label class="formLabel">
							Script editor
						</label>
						<span class="faicon fa-code"></span>
					</div>
					<div>
						<label class="formLabel" for="script_xpath">Script path</label>
						<input id="script_xpath" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
				</form>
			</div>
		</div>
		<div id="tab-inputs">
			<h2>
				Task inputs
				<span class="help faicon fa-question-circle" title="The inputs are passed to the task that will be executed.&#10;&#10;Parameters mode defines how parameters will be passed to the task. 'Command line' is the traditional way to send arguments to a binary (like in a shell prompt). 'Environment variables' will set named environment variables in the task's ENV. &#10;&#10;Input values can be static (simple text), or dynamic by fetching output of parent tasks in the workflow.&#10;&#10;Optionally, tasks can have loops or conditions."></span>
			</h2>
			<div class="formdiv">
				<div>
					<label class="formLabel" for="parametersmode">Parameters mode</label>
					<select id="parametersmode">
						<option value="CMDLINE">Command line</option>
						<option value="ENV">Environment variables</option>
					</select>
				</div>
			</div>
			<div class="inputs"></div>
			<span id="add-input" class="faicon fa-plus" title="Add input"></span>
		</div>
		<div id="tab-output">
			<h2>
				Output method
				<span class="help faicon fa-question-circle" title="How task output should be considered. You will only be able to use loops and conditions on XML type of output.&#10;&#10;Merging stderr with stdout is the traditional 2>&amp;1 redirection."></span>
			</h2>
			<div class="formdiv">
				<form>
					<div>
						<label class="formLabel" for="outputmethod">Output method</label>
						<select id="outputmethod">
							<option value="TEXT">Text</option>
							<option value="XML">XML</option>
						</select>
					</div>
					<div>
						<label class="formLabel" for="mergestderr">Merge stderr with stdout</label>
						<input type="checkbox" id="mergestderr" />
					</div>
				</form>
			</div>
		</div>
		<div id="tab-conditionsloops">
			<h2>
				Conditions and loops
				<span class="help faicon fa-question-circle" title="It is possible to loop on a task output to execute one action several times. Loop context can be used to access the current value of the loop iteration.&#10;&#10;Condition is used to skip one task. This condition is evaluated before the loop. Iteration condition is evaluated after the loop, on each task. It can refer to loop context."></span>
			</h2>
			<div class="formdiv">
				<form>
					<div>
						<label class="formLabel" for="condition">Condition</label>
						<input id="condition" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
					<div>
						<label class="formLabel" for="loop">Loop</label>
						<input id="loop" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
					<div>
						<label class="formLabel" for="iteration-condition">Iteration condition</label>
						<input id="iteration-condition" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
				</form>
			</div>
		</div>
		<div id="tab-queueretry">
			<h2>
				Queue and retry
				<span class="help faicon fa-question-circle" title="Queues are used to limit tasks parallelisation depending on the queue concurrency. A conncurrency of 1 will limit execution to one task at a time.&#10;&#10;Retry schedules are used to retry failed tasks. The task will not be considered faild as long as retries are still scheduled."></span>
			</h2>
			<div class="formdiv">
				<form>
					<div>
						<label class="formLabel" for="queue">Queue</label>
						<select id="queue" />
					</div>
					<div>
						<label class="formLabel" for="retryschedule">Retry schedule</label>
						<select id="retryschedule" />
					</div>
					<div>
						<label class="formLabel" for="retryretval">Retry on</label>
						<select id="retryretval" />
					</div>
				</form>
			</div>
		</div>
		<div id="tab-remote">
			<h2>
				Remote execution
				<span class="help faicon fa-question-circle" title="If the task should not be executed locally, enter the user and host used for remote SSH connection.&#10;&#10;If you are using dynamic a dynamic queue, the used will be used by default to create the dynamic queue name.&#10;&#10;It is possible to use dynamic queues with local execution with the queue host attribute. This can be useful for tasks operating on distant machines without SSH (SQL connections, rsync...) on which you want to limit concurrency for performance reasons.&#10;&#10;All these values can incorporate dynamic XPath parts surrounded with braces.&#10;&#10;evQueue agent can be used to enable advanced functionalities such as dedicated log and real time task progression. If you intend to use the agent, you must first deploy it on all needed machines."></span>
			</h2>
			<div class="formdiv">
				<form>
					<div>
						<label class="formLabel" for="user">User</label>
						<input id="user" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
					<div>
						<label class="formLabel" for="host">Host</label>
						<input id="host" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
					<div>
						<label class="formLabel" for="queue_host">Queue host</label>
						<input id="queue_host" />
						&#160;<span class="faicon fa-magic"></span>
					</div>
					<div>
						<label class="formLabel" for="useagent">Use evQueue agent</label>
						<input type="checkbox" id="useagent" />
					</div>
				</form>
			</div>
		</div>
		<div id="tab-stdin">
			<h2>
				Stdin stream
				<span class="help faicon fa-question-circle" title="Task stdin is used to pipe data to the task. It has the same utility as the 'pipe' character in a shell.&#10;&#10;Data can be piped to XML or text format. If the text format is chosen, XML markup tags will be stripped to keep only text values."></span>
			</h2>
			<div>
				stdin mode&#160;:&#160;
				<select id="stdinmode">
					<option value="xml">XML</option>
					<option value="text">Text</option>
				</select>
			</div>
			<div class="input_line" data-inputtype="stdin">
				<div class="input">stdin</div>
				<div class="value"></div>
			</div>
		</div>
	</div>
	
	<div id='task-input-editor' class="dialog" title="Properties">
		<h2>
			Task properties
			<span class="help faicon fa-question-circle" title="Input name is used when passing inputs as environement variables.&#10;&#10;Input condition can be used to optionally pass a flag to the task. The flag will be passed to the task if the condition evaluates to true, otherwise the input will be ignored.&#10;&#10;Loops are used to pass a list of inputs based on a preceding task output. This could be a list of files, databases..."></span>
		</h2>
		<div class="formdiv">
			<form>
				<div>
					<label class="formLabel" for="input-name">Name</label>
					<input id="input-name" />
				</div>
				<div>
					<label class="formLabel" for="condition">Condition</label>
					<input id="input-condition" />
					&#160;<span class="faicon fa-magic"></span>
				</div>
				<div>
					<label class="formLabel" for="loop">Loop</label>
					<input id="input-loop" />
					&#160;<span class="faicon fa-magic"></span>
				</div>
			</form>
			<div>
				<button class="submit">Save</button>
			</div>
		</div>
	</div>
	
	<div id="task-script-editor" class="dialog" title="Script editor">
		<h2>Script editor <span class="help faicon fa-question-circle" title="Write here your script. Remember to have a shebang (#!) on the first line !"></span></h2>
		<div class="formdiv">
			<form>
				<div>
					<textarea id="script">
					</textarea>
				</div>
			</form>
		</div>
	</div>
	
	<xsl:call-template name="value-selector" />
</xsl:template>

</xsl:stylesheet>
