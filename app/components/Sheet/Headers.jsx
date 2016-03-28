import React, { Component, PropTypes } from 'react';
import ColumnOptions from './ColumnOptions';
import AddColumn from './AddColumn';
import classNames from 'classnames/bind';
import styles from 'css/components/table';
import { SortablePane, Pane } from 'react-sortable-pane';
import _ from 'lodash';

const cx = classNames.bind(styles);

function generateColumnOptions (headers) {
  return headers.map((header) => {
      return (
        <Pane
          className={cx('thead')}
          id={header.id}
          key={header.id}
          width={200}
          height={34}>
          <ColumnOptions data={header} key={header.id}/>
          </Pane>
      )
  })
}


const Headers = (props) => {

  return (
    <div className={cx('theaders')}>
      <AddColumn />
        {/*<div className={cx('topCorner')} />*/}
        {/*<div className={cx('topCorner')}></div>*/}
          <SortablePane
             direction="horizontal"
             margin={0}
             disableEffect={true}
             onResizeStop={(id, dir, size, rect) => props.resizeCol(id)}
             onOrderChange={(oldPanes,newPanes) => {
               let bounced=_.debounce(() => props.dragCol(newPanes),500);
               bounced();
             }}
             >
        {generateColumnOptions(props.headers)}
      </SortablePane>
      <div>
  </div>
        </div>
    );
}

export default Headers;
