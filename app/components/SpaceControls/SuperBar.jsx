import React, { PropTypes, Component } from 'react';
import SearchButton from './SearchButton';
import ShareButton from './ShareButton';
import SaveButton from './SaveButton';
import HistoryButton from './HistoryButton';
import classNames from 'classnames/bind';
import styles from 'css/components/magic-bar';


const cx = classNames.bind(styles);

const SuperBar = (props) => {
  function funcToCall (evt) {
    props.updateCell(evt.target.value, props.cell.key, props.cell.idx)
    props.changeCurrentCell(props.cell.idx, props.cell.key,evt.target.value, props.cell.type);
  }

  // Being used as search

  // REMOVED A CHECK TO SEE IF THERE IS PROPS.CELL
  if (props.searching) {
    return (
      <input
        placeholder={'Search your sheet'}
        onChange={props.searchSheet}
      />
    )
  }

  // If no cell or image then disabled and says Magic Bar
  if (!props.cell || props.cell.cellType  === 'Images' || props.cell.cellType  === 'Reference') return (
      <input
        placeholder={'Magic Bar'}
        onChange={props.searchSheet}
        disabled
      />
  )

  // standard when cell is selected is populates the magic bar and is linked with the cell
  return (
      <input
        value={props.cell ? props.cell.data : 'Magic Bar'}
        placeholder={props.cell ? props.cell.data : 'Magic Bar'}
        onChange={funcToCall}
      />
  );
};


export default SuperBar;
