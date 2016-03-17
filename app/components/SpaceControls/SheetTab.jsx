import React, { PropTypes, Component } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/space-control';
import {Button} from 'react-bootstrap';



const cx = classNames.bind(styles);

const SheetsTab = (props) => {
  //Will get sheet name from props
  //Props will be the sheet name and a reference if needed to know how to render the sheet
  //Link to space/sheetID
  //Will need action when clicked to show that sheet


  return (
    <Button className={cx('SheetTab')}>{props.sheet.name}</Button>
  );
};


export default SheetsTab;
