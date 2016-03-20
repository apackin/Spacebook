import { 
  UPDATE_CELL,
  SHOW_ROW_MODAL,
  CLOSE_ROW_MODAL,
  ADD_ROW,
  ADD_COLUMN
} from 'constants/index';

import initialState from './sheetState'

export default function sheet(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_CELL:
      let newState = Object.assign({}, state, {});
      newState.grid[action.cell.idx][action.cell.key].data = action.cell.data
      return newState
    case SHOW_ROW_MODAL:
      return Object.assign({}, state, {
        showRowModal: true,
        modalRow: state.grid[action.rowIdx]
      });
    case CLOSE_ROW_MODAL:
      return Object.assign({}, state, {
        showRowModal: false,
        modalRow: null
      });
    case ADD_COLUMN:
      let AddColumnState = Object.assign({}, state, {});
      let newColumn = {
        id: addColumnState.columnHeaders[addColumnState.columnHeaders.length-1].id+10;
        // How are we making ids?
        type: action.column.type,
        name: action.column.name,
        idx: addColumnState.columnHeaders.length,
      } 

      addColumnState.columnHeaders.push(newColumn);

      AddColumnState.grid.forEach(row => {
          row[newColumn.id] = {
            type: newColumn.type,
            data: null,
          }
        });

      return AddColumnState;
    case ADD_ROW:
      let addRowState = Object.assign({}, state, {});
      let lastRow = addRowState.grid[addRowState.grid.length - 1]
      for (let key in lastRow) {
        lastRow[key].data = null
      }
      addRowState.grid.push(lastRow)
      return addRowState
    default:
      return state;
  }
}