//Sheet Data 

function getCurrentSheetUrl() {
  var url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  return url;
}

function readValue(sheetName, rangeString) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var range = sheet.getRange(rangeString);

  if (range.getNumRows() === 1 && range.getNumColumns() === 1) {

    var value = range.getValue();
    return value;
  } else {

    var values = range.getValues();
    return values;

  }
}

function changeValue(column, row, value) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (typeof column === 'number') {
    var targetCell = sheet.getRange(row, column);
  } else if (typeof column === 'string') {
    var columnNumber = column.toUpperCase().charCodeAt(0) - 64;
    var targetCell = sheet.getRange(row, columnNumber);
  }
  
  targetCell.setValue(value);
}

const sheet = SpreadsheetApp.getActive()
const ui = SpreadsheetApp.getUi()

// Alert Message
function uiAlert() {
  return {

    invalidProjectIdAndReleaseName: function () {
      ui.alert(
        `Please insert Project ID and Release Name on the first sheet and try again.`
        , SpreadsheetApp.getUi().ButtonSet.OK);
    },
    getResultConfirmation: function () {
      ui.alert(
        `Are you sure you want to retrieve test result?
      \r\n Querying could take several minutes to complete.
      \r\n Please wait until the process is done.`, SpreadsheetApp.getUi().ButtonSet.YES_NO);

      return response = ui.Button.YES ? "YES" : "NO";
      
    }

  }
}