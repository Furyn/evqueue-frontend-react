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

'use strict';

import {Help} from '../../../ui/help.js';
import {Checkbox} from '../../../ui/checkbox.js';
import {Dialog} from '../../../ui/dialog.js';
import {Tabs} from '../../../ui/tabs.js';
import {Tab} from '../../../ui/tab.js';
import {GroupAutocomplete} from '../../base/group-autocomplete.js';

export class WorkflowProperties extends React.Component {
	constructor(props) {
		super(props);
	}
	
	renderTabProperties() {
		let properties = this.props.properties;
		
		return (
			<div>
				<h2>
					Workflow properties
					<Help>
						Name is mandatory, this will be used from API to launch a new instance.
						<br /><br />
						Comment and group are optional, they are only used to classify workflows in interface.
					</Help>
				</h2>
				<div className="formdiv">
					<div>
						<label>Name</label>
						<input type="text" name="name" value={properties.name} onChange={this.props.onChange} />
					</div>
					<div>
						<label>Group</label>
						<GroupAutocomplete type="text" name="group" value={properties.group} onChange={this.props.onChange} />
					</div>
					<div>
						<label>Comment</label>
						<input type="text" name="comment" value={properties.comment} onChange={this.props.onChange} />
					</div>
				</div>
			</div>
		);
	}
	
	renderTabParameters() {
	}
	
	renderTabNotifications() {
	}
	
	renderTabCustomFilters() {
	}
	
	render() {
		return (
			<Dialog title="Edit workflow" width="800" onClose={this.props.onClose}>
				<div className="evq-workflow-properties">
					<Tabs>
						<Tab title="Properties">
							{ this.renderTabProperties() }
						</Tab>
						<Tab title="Parameters">
							{ this.renderTabParameters() }
						</Tab>
						<Tab title="Notifications">
							{ this.renderTabNotifications() }
						</Tab>
						<Tab title="Custom filters">
							{ this.renderTabCustomFilters() }
						</Tab>
					</Tabs>
				</div>
			</Dialog>
		);
	}
}