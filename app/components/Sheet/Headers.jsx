import React, { Component, PropTypes } from 'react';
import ColumnOptions from './ColumnOptions';
import AddColumn from './AddColumn';
import classNames from 'classnames/bind';
import styles from 'css/components/table';
import { SortablePane, Pane } from 'react-sortable-pane';
import _ from 'lodash';

const cx = classNames.bind(styles);

function generateColumnOptions (headers) {
  return headers.map((header, key) => {
      return (
        <Pane
          id={header.id}
          key={key}
          width={200}
          height={34}>
          <ColumnOptions data={header} key={header.id}/>
          </Pane>
      )
  })
}

const paneStyle = {
  fontSize: "40px",
  textAlign:"center",
  paddingTop:"60px",
  height:"200px",
  border: "solid 1px #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff"
};


const Headers = (props) => {
  return (
    <div className={cx('theaders')}>
      <AddColumn />
        {/*<div className={cx('topCorner')} />*/}
        {/*<div className={cx('topCorner')}></div>*/}
          <SortablePane
             direction="horizontal"
             margin={0}
             onResize={(id, dir, size, rect) => null}
             onOrderChange={(oldPanes,newPanes) => {
               let bounced=_.debounce(() => props.dragCol(newPanes),300);
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
