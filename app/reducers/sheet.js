import _ from 'lodash';
import {
  UPDATE_FORMULA_CELL,
  UPDATE_CELL,
  SHOW_ROW_MODAL,
  CLOSE_ROW_MODAL,
  ADD_ROW,
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
  DRAG_TABLE_ROW,
  DRAG_TABLE_COL,
  SEARCH_SHEET,
  CLEAR_SEARCH_GRID,
  CLEAR_FILTERED_ROWS
} from 'constants/index';
import {
  insertNewColInRows,
  runCustomFunc
} from './sheetHelpers.js';

export default function sheet(state = {
  grid: [],
  columnHeaders: [],
  showRowModal: false,
  modalRow: {data:null,rowIdx:null} }, action = {}) {
  switch (action.type) {
    case CLEAR_SHEET:
      return {}
    case CHANGE_SHEET:
      return {
        columnHeaders: action.sheet.columnHeaders || [],
        grid: action.sheet.grid || [],
        history: action.history || [],
        historySheet: action.historySheet || null,
        modalRow: {
          data: null,
          rowIdx: null
        },
        showRowModal: false,
        showHistoryModal: false
      }
    case UPDATE_CELL:
      {
        let newState = _.cloneDeep(state);
        newState.grid[action.cell.idx][action.cell.key].data = action.cell.data
        return newState
      }
    case UPDATE_FORMULA_CELL:
      {
        let newState = _.cloneDeep(state);
        let data = runCustomFunc(newState, action.row, action.formula);
        newState.grid[action.cell.idx][action.cell.key].data = data;
        return newState
      }
    case CURRENT_CELL:
      return Object.assign({}, state, {currentCell : action.cell})
    case UPDATE_MODAL_CELL:
      {
        let modalRowState = _.cloneDeep(state);
        if (Array.isArray(modalRowState.modalRow.data[action.cell.key].data)) {
          modalRowState.modalRow.data[action.cell.key].data.push(action.cell.data)
        } else {
          modalRowState.modalRow.data[action.cell.key].data = action.cell.data
        }
        return modalRowState
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
        modalCloseState.grid[modalCloseState.modalRow.rowIdx] = modalCloseState.modalRow.data
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
      let newColumn = {
        id: (100+addColumnState.columnHeaders.length).toString(),
        name: 'Column ' + (1+addColumnState.columnHeaders.length),
        idx: addColumnState.columnHeaders.length,
      }

      // TODO need to set this.props.view: 'editNameAndType';
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
          row[updatingId].type = action.data.type;
          if(action.data.formula) {
            row[updatingId].data = runCustomFunc(updateColumnState, row, action.data.formula);
            row[updatingId].formula = action.data.formula;
          }
          return row;
        })
        return updateColumnState;
      }
    case INSERT_COLUMN:{
      let insertColumnState = _.cloneDeep(state);
      let newColumn = {
        id: (100+insertColumnState.columnHeaders.length).toString(),
        name: 'Column ' + (1+action.colIdx),
        idx: action.colIdx,
      }

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
      let colId = action.colId;
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
      newColumn.id = (100+formulaColumnState.columnHeaders.length).toString();
      newColumn.name = 'Column ' + (1+formulaColumnState.columnHeaders.length);
      newColumn.idx = formulaColumnState.columnHeaders.length;

      // action.arrMeth usually = 'map' or 'reduce';
      formulaColumnState.grid = formulaColumnState.grid[action.arrMeth]((row) =>{
        let newData = action.func(row[action.colData.id].data);

        // TODO should this corralate to the type of the new cell?
        // if (!newColumn.type) newColumn.type = 'Text';

        row[newColumn.id] = {
          data: newData,
          type: newColumn.type,
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
          newRow[col.id] = { data: null, type: col.type }
        })
        addRowState.grid.push(newRow)
        return addRowState
      }
    case DRAG_TABLE_ROW:
    {
      // let newState=_.cloneDeep(state);
      //
      // let newGrid=action.panes.sort((a,b)=> a - b ).map(el => {
      //   console.log(el.id)
      //   return newState.grid[el.id];
      // });
      // newState.grid=newGrid;
      // return newState;
      break;
    }
    case DRAG_TABLE_COL:
    {
      let newState=_.cloneDeep(state);




        let genNew=_.once(reorderCols);

        // console.log(newOrd)

        newState.columnHeaders=genNew(action.panes,state);

        // var gridBackup=_.cloneDeep(newState.grid);
        // newState.grid.forEach((el,idx) => {
        //   for (var key in newOrd) {
        //     el[key]=Object.assign({},gridBackup[idx][newOrd[key]]);
        //   }
        // })

        console.log(newState.columnHeaders)

      return newState;

    }
    default:
      return state;
  }
}

function reorderCols(panes,state) {

  var newOrd=[];
  panes.forEach((el,idx) => {
    newOrd.push({ prev: Number(idx+100),
      curr: Number(el.id)
    });
  });
    var newColHds=_.cloneDeep(state.columnHeaders);
    var headsCopy=_.cloneDeep(state.columnHeaders);
    newOrd.forEach(el => {
      headsCopy.forEach((cel,idx) => {
        if (cel.id == el.prev) {
          newColHds[idx].id=el.curr;
          newColHds[idx].idx=el.curr-100;
        }
      })
    })
    newColHds=_.orderBy(newColHds,['id'],['asc']);
    return newColHds;

  }

function insertNewColInRows (state, newColumn,data){
  state.grid.forEach(row => {
    row[newColumn.id] = {
      type: newColumn.type,
      data: data || null,
    }
  });
  return state;
}

function runCustomFunc (state, row, funcText) {
  let columnDefs = 'let document = undefined; let window = undefined; ';

  state.columnHeaders.forEach((elem, idx) => {
    // TODO remove this column?
    funcText = funcText.replace(elem.name, 'userCol' + idx);
    let userData = decorationType(row[elem.id].data);
    console.log(userData);
    columnDefs += 'let userCol' + idx + ' = ' + userData + '; ';
    });


  return eval(columnDefs+funcText);
}

function decorationType (type) {
  if (Array.isArray(type)) return '["' + type.join('","') + '"]';
  else if (typeof type === 'string') return '"' + type + '"';
  else return type;
}
