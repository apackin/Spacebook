import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { updateColumn } from 'actions/sheet';
import styles from 'css/components/table';
import { DropdownButton, Glyphicon, Dropdown } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

const cx = classNames.bind(styles);


class MenuEditCol extends Component {
	constructor(props,state){
		super(props, state);
		this.state = {colType: false};

		this.saveTypeChanges = this.saveTypeChanges.bind(this);
		this.itemSelected = this.itemSelected.bind(this);
	}

	itemSelected(e, ekey) {
		console.log('itemSelected', ekey);
		this.setState({colType: ekey});
	}

	saveTypeChanges() {
		let newColData = {
			id: this.props.data.id,
			type: this.state.colType || this.props.data.type,
			name: document.getElementById("newColName").innerHTML,
			idx: this.props.data.idx,
		}

		if (newColData == this.props.data) console.log('No Change');
		else this.props.dispatch(updateColumn(newColData))
		this.props.exitTypeMenu();
	}

	render () {
		let columnTypes = {
			'Text': (
				<div className='col-md-12'>
					<p className='col-md-12'> A single line of text. </p>
				</div>
				),
			'Number': (
				<div className='col-md-12'>
					<p className='col-md-12'> A number feild </p>
				</div>
				), 
			'Formula': (
				<div className='col-md-12'>
					<p className='col-md-12'> Allows you to create custom formulas for manipulating your data: </p>
					<textarea id="functionDefine" className='col-md-12'> </textarea>
				</div>
				), 
			'Images': (
				<div className='col-md-12'>
					<p className='col-md-12'> Upload custom images </p>
				</div>
				), 
			'Checkbox': (
				<div className='col-md-12'>
					<p className='col-md-12'> Creates checkboxes </p>
				</div>
				), 
			'Select': (
				<div className='col-md-12'>
					<p className='col-md-12'> Select a single predefined option from a dropdown </p>
				</div>
				), 
			'Link': (
				<div className='col-md-12'>
					<p className='col-md-12'> Create a link to an external site </p>
				</div>
				), 
		}

		function generateTypes () {
			var MenuItems = [];
			for (let feildType in columnTypes) {
				MenuItems.push(<MenuItem key={MenuItems.length} eventKey={feildType}>{feildType}</MenuItem>);
			}
			return MenuItems;
			}

		return (
				<div className={cx('editNameAndType')}>
					<div className={cx('thead') + ' col-md-12'} id="newColName" contentEditable>{this.props.data.name}</div>
					<Dropdown id="dropdown-custom-1" onSelect={this.itemSelected} className={cx('typeDropdown') + ' col-md-12'}>
				      <Dropdown.Toggle noCaret className=' col-md-12'>
				        {this.state.colType || this.props.data.type} <Glyphicon className={cx('columnCarrat')} glyph="menu-down" />
				      </Dropdown.Toggle>
				      <Dropdown.Menu className={cx('columnMenu')}>
				      	{generateTypes()}
				      </Dropdown.Menu>
				    </Dropdown>

				    
				    {columnTypes[this.state.colType]}
				    <div className='col-md-12'>
					    <button className="btn col-md-5" type="button" onClick={this.props.exitTypeMenu}>Cancel</button>
					    <button className="btn btn-primary col-md-5" type="button" onClick={this.saveTypeChanges}>Save</button>
					</div>
				</div>
				)
	}
}

export default connect()(MenuEditCol);