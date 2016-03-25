
export function insertNewColInRows (state, newColumn){
  state.grid.forEach(row => {
    row[newColumn.id] = {
      type: newColumn.type,
      data: null,
    }
  });
  return state;
}

    // TODO remove the column that we're adding to to prevent errors?
export function runCustomFunc (state, row, funcText) {
  let columnDefs = 'let document = undefined, window = undefined, alert = undefined; ';

  state.columnHeaders.forEach((elem, idx) => {
    funcText = regexEscape(funcText.replace(new RegExp(elem.name, 'g'), 'Col' + (idx+1)));
    let cellUsed = decorationType(row[elem.id]);
    columnDefs += `let Col${idx+1} = ${cellUsed}; `;
    });

  return eval(columnDefs+funcText);
}

function decorationType (cell) {
  switch (cell.type) {
    case 'Images': return `["${cell.data.join('","')}"]`;
    case 'Formula': case 'Link': case 'Text': return `"${cell.data}"`;
    default: return cell.data;
  }
}

function regexEscape(str) {
    return str.replace(/[-\/\\^$?.()|[\]{}]/g, '\\$&')
}
