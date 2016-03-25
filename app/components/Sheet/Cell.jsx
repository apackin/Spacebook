import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { updateCell, showRowModal, currentCell, updateFormulaCell, changeCurrentCell, moveToCell } from 'actions/sheet';
import styles from 'css/components/table';
import { Modal, Glyphicon } from 'react-bootstrap';
import { searching } from 'actions/SpaceControls'
import ContentEditable from 'react-contenteditable';


const cx = classNames.bind(styles);

class Cell extends Component {
	constructor(props, state){
		super(props, state)
    const { cellKey, rowIdx, grid } = this.props;
    this.state = {disabled: true};
    // leaving disabled in case we choose to use it later
		this.handleCell = this.handleCell.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setMouseEnter = this.setMouseEnter.bind(this);
		this.setMouseLeave = this.setMouseLeave.bind(this);
    this.cell = this.cell.bind(this);
    this.editable = this.editable.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
		this.isCurrentCell = this.isCurrentCell.bind(this);
		this.shouldCellBeDisabled = this.shouldCellBeDisabled.bind(this);
	}

	handleChange(evt){
	  const { dispatch, cellKey, rowIdx, row } = this.props;

    row[cellKey].data = dispatch(updateCell(evt.target.value, cellKey, rowIdx)).cell.data;
		this.handleCell();

    for (let cell in row) {
      if (row[cell].type === 'Formula') {
        dispatch(updateFormulaCell(cell, rowIdx, row[cell].formula, row));
      }
    }
	}

  editable (evt) {
    this.setState({disabled: false});
  }

	shouldCellBeDisabled() {
		// if (this.isCurrentCell()) return false;
		if (this.state.disabled || this.props.disableAll) return true;
		return false;
	}

  cell(cell, cellKey, row, rowIdx, cellIdx){
    if (cell.type === 'Images' ) {
      cell.data = cell.data || [];
      return (cell.data.map(function (img, i) {
        return (<img src={img} key={i} className={cx('img-thumb')}/>)
      }))
    } else {
      return (<ContentEditable
				className={cx('cellContent')}
        html={cell.data} // innerHTML of the editable div
        disabled={this.shouldCellBeDisabled()}       // use true to disable edition
        onChange={this.handleChange} // handle innerHTML change
        onDoubleClick={this.editable} // allow for cell editing after focus
        onMouseEnter={this.setMouseEnter} // handle innerHTML change
        onMouseLeave={this.setMouseLeave} // handle innerHTML change
				ref="content"
      />)
    }
  }

	setMouseEnter (evt) {
		evt.target.parentElement.parentElement.style.backgroundColor = '#e9e9e9';
	}

	setMouseLeave (evt) {
		evt.target.parentElement.parentElement.style.backgroundColor = '';
	}

	handleCell() {
		this.props.dispatch(changeCurrentCell(
			this.props.rowIdx,
			this.props.cellKey,
			this.props.cell.data,
			this.props.cell.type
		));
		// TODO want to dynamically select the inner element in this function which is called on focus
		// will allow editing the element
		// this.refs.content.getDOMNodefocus();
		// ReactDOM.findDOMNode(this.refs.content).focus();
		// console.log(this.refs.content.getDOMNode)
	}

  keyPress (evt) {
		const col=Number(this.props.currentCell.cellKey);
		const row=Number(this.props.currentCell.rowIdx);
		console.log(col, row);
    // let col = Number(evt.target.id.substr(0,3));
    // let row = Number(evt.target.id.substr(3));
    switch (evt.keyCode) {
      case 37:{
							evt.preventDefault();
							this.props.dispatch(moveToCell(col-1,row,this.props.grid))
							this.handleFocus(""+(col-1)+row);
              break;}
      case 38:{
							evt.preventDefault();
							this.props.dispatch(moveToCell(col,row-1,this.props.grid));
							// const location = col.toString().concat((row-1).toString());
							// console.log('locl', location);
							// console.log(ReactDOM.findDOMNode(this.refs[location]));
							this.handleFocus(""+col+(row-1));
              break;}
      case 39:{
							evt.preventDefault();
							this.props.dispatch(moveToCell(col+1,row,this.props.grid))
							this.handleFocus(""+(col+1)+row);
              break;}
      case 40 || 13:{
							evt.preventDefault();
							this.props.dispatch(moveToCell(col,row+1,this.props.grid))
							this.handleFocus(""+col+(row+1));
              break;}
      default:
        this.editable(evt);
        break;
    }
  }

  handleFocus (cellId) {
    // if(document.getElementById(cellId)) document.getElementById(cellId).children[0].focus();
  }

	isCurrentCell() {
		if(this.props.currentCell) {
			if(this.props.currentCell.idx === this.props.rowIdx && this.props.currentCell.key === this.props.cellKey) {
				return true;
			}
		} else {
			return false;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.cell.data !== this.props.cell.data ||
			nextState.disabled !== this.state.disabled ||
			this.props.currentCell.idx == this.props.rowIdx  &&
				this.props.currentCell.key == this.props.cellKey ||
			nextProps.currentCell.idx == nextProps.rowIdx  &&
				nextProps.currentCell.key == nextProps.cellKey;
	}

	render () {
		console.log('CELL RENDERED')
    const { cellKey, rowIdx, grid, cell, row } = this.props;
    // if (this.props.cellIdx === 0) {
    //     return (
    //       <div tabIndex='-1' className={cx('cell')} key={this.props.key}
    //         id={''+this.props.cellKey+this.props.rowIdx}
    //         onDoubleClick={this.editable} // allow for cell editing after focus
    //         onKeyDown={this.keyPress} // for key navigation
    //         >
    //         <ContentEditable className={cx('first-cell')}
    //           html={cell.data} // innerHTML of the editable div
    //           disabled={this.state.disabled}       // use true to disable edition
    //           onChange={this.handleChange} // handle innerHTML change
    //           onDoubleClick={this.editable} // allow for cell editing after focus
    //           onMouseEnter={this.setMouseEnter}
    //           onMouseLeave={this.setMouseLeave}
    //         />
    //       </div>
    //     );
    // }

    return (
      <div tabIndex='-1'
				className={cx('cell')}
				id={''+this.props.cellKey+this.props.rowIdx}
        onDoubleClick={this.editable} // allow for cell editing after focus
				onFocus={this.handleCell}
				onKeyDown={this.keyPress} // for key navigation
				className={this.isCurrentCell() ? cx('selectedCell') : cx('cell')} // for key navigation
        >
        {this.cell(cell,cellKey,row,rowIdx)}
      </div>
      );
  }
}

Cell.propTypes = {
  dispatch: PropTypes.func
};



export default connect()(Cell);
