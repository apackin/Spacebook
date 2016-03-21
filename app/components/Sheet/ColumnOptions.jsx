import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/table';
import { DropdownButton, Glyphicon, Dropdown } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import MenuEditCol from './MenuEditCol';

const cx = classNames.bind(styles);

export default class ColumnOptions extends Component {
	constructor(props,state){
		super(props, state);
		this.state = {view: 'dropdown'};

		this.handleSelection = this.handleSelection.bind(this);
		this.changeType = this.changeType.bind(this);
		this.rename = this.rename.bind(this);
		this.duplicate = this.duplicate.bind(this);
		this.sortAsc = this.sortAsc.bind(this);
		this.sortDec = this.sortDec.bind(this);
		this.exitTypeMenu = this.exitTypeMenu.bind(this);
	}

	handleSelection(evt, evtKey){
		this[evtKey]();
	}

	exitTypeMenu() {
		console.log('ColOpt exitTypeMenu');
		this.setState({view: 'dropdown'});
	}

	changeType() {
		console.log('changeType');
		this.setState({view: 'editNameAndType'});
	}


	rename() {
		console.log('rename');
		this.setState({view: 'editNameAndType'});
	}

	duplicate() {
		console.log('duplicate this column');

	}

	sortAsc() {
		console.log('run sort on column ascending');

	}

	sortDec() {
		console.log('run sort on column descending');
	}

	render () {
		let viewing;
		if (!this.state || this.state.view === 'dropdown') {
			function generateMenuItems () {
				var items = [
					<MenuItem key="1" eventKey="changeType">Change Type</MenuItem>,
					<MenuItem key="2" eventKey="rename">Rename Column</MenuItem>,
					<MenuItem key="3" eventKey="duplicate">Duplicate Field</MenuItem>,
					<MenuItem key="4" eventKey="sortAsc">Sort A -> Z</MenuItem>,
					<MenuItem key="5" eventKey="sortDec">Sort Z -> A</MenuItem>
					];
				return items;
			}

			viewing = (
				<Dropdown id="dropdown-custom-1" onSelect={this.handleSelection} className={cx('columnWidth')}>
			      <Dropdown.Toggle noCaret className={cx('thead')}>
			        {this.props.data.name}
							<Glyphicon className={cx('columnCarrat')} glyph="menu-down" />
			      </Dropdown.Toggle>
			      <Dropdown.Menu className={cx('columnWidth')}>
			      	{generateMenuItems()}
			      </Dropdown.Menu>
			    </Dropdown>)

		} else if (this.state.view === 'editNameAndType') {
			viewing = (<MenuEditCol data={this.props.data} exitTypeMenu={this.exitTypeMenu}/>)
		}

		return (
			<div className={cx('thead')}>
				{viewing}
			</div>
		);
	}
}
