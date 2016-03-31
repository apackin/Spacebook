
import _ from 'lodash';
import {
  UPDATE_CELL,
  SHOW_ROW_MODAL,
  CLOSE_ROW_MODAL,
  ADD_ROW,
  DELETE_ROW,
  ADD_COLUMN,
  UPDATE_COLUMN,
  SORT_COLUMN,
  REMOVE_COLUMN,
  INSERT_COLUMN,
  FORMULA_COLUMN,
  UPDATE_MODAL_CELL,
  CHANGE_SHEET,
  CLEAR_SHEET,
  SHOW_HISTORY_MODAL,
  CLOSE_HISTORY_MODAL,
  CURRENT_CELL,
  SET_HISTORY_TABLE,
  UPDATE_HISTORY,
  SEARCH_SHEET,
  CLEAR_SEARCH_GRID,
  CLEAR_FILTERED_ROWS,
  SHOW_LOOKUP_MODAL,
  CLOSE_LOOKUP_MODAL,
  UPDATE_CELL_BY_ID,
  MOVE_TO_CELL,
  SHOW_MAP,
  HIDE_MAP,
  DRAG_TABLE_COL,
  RESIZE_TABLE_COL,
  SEND_LAT_LONGS
} from 'constants/index';
import {
  insertNewColInRows,
  runCustomFunc,
  navToNewCell,
  newColInfo
} from './sheetHelpers.js';

export default function sheet(state = {
  grid: [],
  columnHeaders: [],
  showRowModal: false,
  modalRow: {data:null,rowIdx:null} }, action = {}) {
  switch (action.type) {
    case CLEAR_SHEET:
      return {}
    case CHANGE_SHEET: {

      let newState=_.cloneDeep(state);

        action.sheet.grid.forEach(row => {
          for (let cell in row){
            row[cell].focused = false;
          }
        })
        newState.columnHeaders= action.sheet.columnHeaders || [];
        newState.grid= action.sheet.grid || [];
        newState.history= action.history || [];
        newState.historySheet= action.historySheet || null;
        newState.modalRow= {
          data: null,
          rowIdx: null
        };
        newState.showRowModal= false;
        newState.showHistoryModal= false;

      return newState;
    }
    case UPDATE_CELL:
      {
        let newState = _.cloneDeep(state);
        if(action.fromSuper && newState.grid[newState.currentCell.rowIdx][newState.currentCell.cellKey]) newState.grid[newState.currentCell.rowIdx][newState.currentCell.cellKey].focused = false;
        newState.grid[action.cell.idx][action.cell.key].data = action.cell.data
        newState.currentCell.cell.data = action.cell.data;
        if (action.formulaCells)
        {
          action.formulaCells.forEach(cell =>{
            let data = runCustomFunc(newState, newState.grid[action.cell.idx], cell.formula);
            newState.grid[action.cell.idx][cell.col].data = data;
          })
        }
        return newState
      }
    case UPDATE_CELL_BY_ID:
      {
        let newState = _.cloneDeep(state);
        newState.grid.forEach(function(row){
          for (let key in row) {
            if (row[key].id == action.cell.id) {
              row[key].data = action.cell.data;
              break;
            }
          }
        })
        return newState
      }
    case MOVE_TO_CELL:{
          let newState = _.cloneDeep(state);
          let newCoord = navToNewCell(action.keyCode, newState)
          newState.grid[newState.currentCell.rowIdx][newState.currentCell.cellKey].focused = false;
          newState.currentCell.cell = state.grid[newCoord.newRowIdx][newCoord.newColId];
          newState.currentCell.rowIdx = newCoord.newRowIdx;
          newState.currentCell.cellKey = newCoord.newColId;
          newState.grid[newCoord.newRowIdx][newCoord.newColId].focused = true;
          return newState}
    case CURRENT_CELL:{
          let newState = _.cloneDeep(state);
          if(newState.currentCell) newState.grid[newState.currentCell.rowIdx][newState.currentCell.cellKey].focused = false;
          newState.currentCell = action.cell;
          if(action.cell) newState.grid[action.cell.rowIdx][action.cell.cellKey].focused = true;
          // find cell and give it focus
          return newState}
    case UPDATE_MODAL_CELL:
      {
        let modalRowState = _.cloneDeep(state);
        if (action.push) {
          modalRowState.modalRow.data[action.cell.key].data.push(action.cell.data)
        } else {
          modalRowState.modalRow.data[action.cell.key].data = action.cell.data
        }
        return modalRowState
      }
    case SHOW_LOOKUP_MODAL:
      {
        let newState = _.cloneDeep(state)
        newState.showLookupModal = true;
        newState.lookup = {
          row: action.row,
          cell: action.cell,
          rowIdx: action.rowIdx,
          colId: action.cellKey
        }
        return newState
      }
    case CLOSE_LOOKUP_MODAL:
      {
        let modalCloseState = _.cloneDeep(state)
        modalCloseState.showLookupModal = false;
        return modalCloseState
      }
    case SHOW_ROW_MODAL:
      {
        let newState = _.cloneDeep(state)
        newState.showRowModal = true;
        newState.modalRow = {
          data: state.grid[action.rowIdx],
          rowIdx: action.rowIdx
        }
        return newState
      }
    case CLOSE_ROW_MODAL:
      {
        let modalCloseState = _.cloneDeep(state)
        modalCloseState.showRowModal = false;
        if (!action.dontSave) {
          modalCloseState.grid[modalCloseState.modalRow.rowIdx] = modalCloseState.modalRow.data
        }
        modalCloseState.modalRow.data = null;
        modalCloseState.modalRow.rowIdx = null;
        return modalCloseState
      }
    case SHOW_HISTORY_MODAL:
      {
        let newState = _.cloneDeep(state)
        newState.showHistoryModal = true;
        return newState
      }
    case SET_HISTORY_TABLE:
      {
        let newState = _.cloneDeep(state);
        newState.historySheet = newState.history[action.index]
        return newState
      }
    case UPDATE_HISTORY:
      {
        let newState = _.cloneDeep(state);
        newState.history = action.history;
        return newState
      }
    case CLOSE_HISTORY_MODAL:
      {
        let newState = _.cloneDeep(state)
        newState.showHistoryModal = false;
        newState.historySheet = null
        return newState
      }
    case ADD_COLUMN:{
      let addColumnState =  _.cloneDeep(state);
      let newColumn = newColInfo(addColumnState.columnHeaders)

      addColumnState.columnHeaders.push(newColumn);
      addColumnState = insertNewColInRows(addColumnState, newColumn);
      return addColumnState;}
    case UPDATE_COLUMN:
      {
        let updateColumnState =  _.cloneDeep(state);
        let updatingId = action.data.id;
        updateColumnState.columnHeaders = updateColumnState.columnHeaders.map(column=>{
          if (column.id===updatingId) {return action.data}
          else return column;
        })

        updateColumnState.grid = updateColumnState.grid.map(row=>{
          let curRow = row[updatingId];
          curRow.type = action.data.type;
          if(action.data.type==="Checkbox") curRow.data = "off";
          if(action.data.formula) {
            curRow.data = runCustomFunc(updateColumnState, row, action.data.formula);
            curRow.formula = action.data.formula;
          }
          if(action.data.selectOptions) {
            curRow.selectOptions = action.data.selectOptions;
          }
          return row;
        })
        return updateColumnState;
      }
    case INSERT_COLUMN:{
      let insertColumnState = _.cloneDeep(state);

      let newColumn = newColInfo(insertColumnState.columnHeaders)
      newColumn.name = 'Column ' + (1+action.colIdx);
      newColumn.idx = action.colIdx;

      insertColumnState.columnHeaders = insertColumnState.columnHeaders.map(column=>{
        if (column.idx >= action.colIdx) {column.idx++}
        return column;
      })

      // TODO need to set this.props.view: 'editNameAndType';
      insertColumnState.columnHeaders.splice(action.colIdx, 0, newColumn);

      insertColumnState = insertNewColInRows(insertColumnState, newColumn);

      return insertColumnState}
    case SORT_COLUMN:{
      let sortColumnState = _.cloneDeep(state);
      let colId = action.sortBy.colId;
      let sortFn = function(a,b){
          if (!a[colId].data) return (1);
          else if (!b[colId].data) return (-1);
          else if (a[colId].data > b[colId].data) return (1*action.sortBy.order);
          else if (b[colId].data > a[colId].data) return (-1*action.sortBy.order);
          else return 0;
      };
      sortColumnState.grid = sortColumnState.grid.sort(sortFn);
      return sortColumnState;}
    case SEARCH_SHEET:
      let searchState = _.cloneDeep(state);
      // approach to hide the rows that don't meet search criteria
      searchState.filteredRows = searchState.grid.reduce((accum, row, idx) => {
        let toSave;
        for(let cell in row) {
          if (row[cell].data && typeof row[cell].data === 'string') {
            row[cell].data.toLowerCase().indexOf(action.term.toLowerCase()) > -1 ? toSave = true : null;
          }
        }
        if (!toSave) accum.push(idx);
        return accum;
      }, [])
      return searchState;
    case CLEAR_FILTERED_ROWS:
      let clearedFilteredState = _.cloneDeep(state);
      clearedFilteredState.filteredRows = [];
      return clearedFilteredState;
    case REMOVE_COLUMN:{
      let removeColumnState = _.cloneDeep(state);
      let colId = action.colId ? action.colId : removeColumnState.columnHeaders[removeColumnState.columnHeaders.length-1].id ;
      removeColumnState.columnHeaders = removeColumnState.columnHeaders.filter(col => {
        return colId !== col.id;
      })

      removeColumnState.grid = removeColumnState.grid.map(row=>{
        if (row[colId]) delete row[colId];
        return row;
      })

      return removeColumnState;
    }
    case FORMULA_COLUMN:{
      let formulaColumnState = _.cloneDeep(state);

      let newColumn = Object.assign({}, action.colData);
      let colIdIdx = newColInfo(formulaColumnState.columnHeaders);
      newColumn.id = colIdIdx.id;
      newColumn.name = 'Column ' + colIdIdx.idx;
      newColumn.idx = colIdIdx.idx;

      // action.arrMeth usually = 'map' or 'reduce';
      formulaColumnState.grid = formulaColumnState.grid[action.arrMeth]((row) =>{
        let newData = action.func(row[action.colData.id].data);

        // TODO should this corralate to the type of the new cell?
        // if (!newColumn.type) newColumn.type = 'Text';

        row[newColumn.id] = {
          data: newData,
          type: newColumn.type,
          width: newColumn.width,
        }
        return row;
      })

      formulaColumnState.columnHeaders.push(newColumn);

      return formulaColumnState;
      }
    case ADD_ROW:
      {
        let addRowState = _.cloneDeep(state);
        let newRow = {}
        addRowState.columnHeaders.forEach(function(col) {
          newRow[col.id] = { width: col.width || 200 ,data: null, type: col.type, id: col.id + Math.floor((Math.random() * (99999999 - 111111) + 111111)) }
          if (col.formula) newRow[col.id].formula = col.formula;
          if (col.selectOptions) newRow[col.id].selectOptions = col.selectOptions;
        })
        addRowState.grid.push(newRow)
        return addRowState
      }
    case DELETE_ROW:
      {
        let newState = _.cloneDeep(state);
        let newGrid = []
        newState.grid.forEach((row,i)=>{
          if (i !== action.rowIdx) {
            newGrid.push(row)
          }
        })
        newState.grid = newGrid
        return newState
      }
    case RESIZE_TABLE_COL: {

        let newState=_.cloneDeep(state);
        // newState.columnHeaders[(action.size.id)-100].width=action.size.rect.width;

        newState.columnHeaders.forEach(ch => {
          if (ch.id === action.size.id) ch.width=action.size.rect.width;
        })

        newState.grid.forEach(row => {
          row[action.size.id].width=action.size.rect.width;
        })

        return newState;
      }
    case DRAG_TABLE_COL: {
        break;
      }
    case SHOW_MAP:
      let showMapState = _.cloneDeep(state);
      let colId = action.colId
      let addressData = showMapState.grid.reduce((accum, row) => {
        if(row[colId]) accum.push({data: row[colId].data, name: row[100].data})
        return accum
      },[])
      showMapState.showMap = true;
      showMapState.addressData = addressData;
      showMapState.mapMarkersData = null;
      showMapState.mapColumn = showMapState.columnHeaders.filter(col => col.id === colId ? true : false)[0].name
      return showMapState;
    case SEND_LAT_LONGS:
      let newMapState = _.cloneDeep(state);
      newMapState.mapMarkersData = action.geoResults;
      return newMapState;
    case HIDE_MAP:
        let hideMapState = _.cloneDeep(state);
        hideMapState.showMap = false;
        return hideMapState;
    default:
      return state;
  }
}
