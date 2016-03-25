import React, { Component, PropTypes } from 'react';
import Cell from './Cell';
import RowOpener from './RowOpener'
import classNames from 'classnames/bind';
import styles from 'css/components/table';
import {connect} from 'react-redux';
import _ from 'lodash';

const cx = classNames.bind(styles);

class Grid extends Component {

<<<<<<< HEAD
  constructor(props) {
    super(props);
    this.generateRows=this.generateRows.bind(this);
    this.generateCells=this.generateCells.bind(this);
  }

  generateRows(grid) {
    return grid.map( (row, idx) => {
      return (
            <div className={cx('trow')} key={idx} >
              <div className={cx('rnum')}>{idx + 1}</div>
              {this.props.disableAll ? <div className={cx('rnum')}></div> : <RowOpener className={cx('rnum')} row={idx}/>}
              {this.generateCells(row, idx)}
            </div>
        );
    });
=======
  function generateRows(grid, filtered) {
    return grid.map( (row, idx) => {
        return (
          <div className={filtered.indexOf(idx) === -1 ? cx('trow') : cx('trowHidden')} key={idx}>
            <div className={cx('rnum')}>{idx + 1}</div>
            {props.disableAll ? <div className={cx('rnum')}></div> : <RowOpener className={cx('rnum')} row={idx}/>}
            {generateCells(row, idx)}
          </div>);
        });
>>>>>>> master
  }

  generateCells (row, idx) {
    return this.props.headers.map((head) => {
      return (<Cell
        cell={row[head.id]}
        key={head.id}
        cellKey={head.id}
        row={row}
        rowIdx={idx}
        cellIdx={head.idx}
<<<<<<< HEAD
        disableAll={this.props.disableAll}
=======
        disableAll={props.disableAll}
        searching={props.searching}
>>>>>>> master
      /> );
    });
  }

render() {

  return (
<<<<<<< HEAD
    <div className={cx('trows')} >
      {this.generateRows(this.props.grid)}
=======
    <div className={cx('trows')}>
      {generateRows(props.grid ? props.grid : [], props.filteredRows ? props.filteredRows : [])}
>>>>>>> master
    </div>
  );
}
}

export default connect()(Grid);
