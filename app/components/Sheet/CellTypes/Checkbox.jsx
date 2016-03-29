import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import { updateCell} from 'actions/sheet';
import styles from 'css/components/table';
import { Input } from 'react-bootstrap';


const cx = classNames.bind(styles);

class CheckBox extends Component {
	constructor(props, state){
		super(props, state)
    this.handleChange = this.handleChange.bind(this)
	}


	handleChange(evt){
	  const { dispatch, cellKey, rowIdx, row } = this.props;
    let val;
    (this.props.cell.data === 'checked') ? val = 'off' : val = 'checked'
    dispatch(updateCell(val, cellKey, rowIdx, null, []));
	}

	render () {

    return (<Input
      className={cx('cellCheckBox')}
      type="checkbox" label=" "
      checked={this.props.cell.data === 'checked'}
      onClick={this.handleChange}/>
    )
  }

}


export default CheckBox;
