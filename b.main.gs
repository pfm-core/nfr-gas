//Sheet Data 

var getActive = SpreadsheetApp.getActiveSpreadsheet()
var currentSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
var sheet = SpreadsheetApp.getActive()
var ui = SpreadsheetApp.getUi()
var checkbox = SpreadsheetApp.newDataValidation().requireCheckbox().build();

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

  if (typeof column === 'number') {
    var targetCell = currentSheet.getRange(row, column);
  } else if (typeof column === 'string') {
    var columnNumber = column.toUpperCase().charCodeAt(0) - 64;
    var targetCell = currentSheet.getRange(row, columnNumber);
  }

  targetCell.setValue(value);
}


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

    },
    insertApiKey: function () {
      ui.prompt(`Please insert JIRA API Token
      \r\n Visit url below for more info:
      \r\n https://id.atlassian.com/manage-profile/security/api-tokens`)
    }

  }
}

//
function getTickBoxValues(type) {

  var data = currentSheet.getDataRange().getValues();
  var jsonData = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === true) {

      if (type === 'capacity') {
        var row = {

          tickedRow: 1 + i,            //DON'T FORGET TO CHANGE B IF THE TICK BOX COLUMN CHANGES
          businessFlow: data[i][2],
          serviceName: data[i][3],
          apiMethodAndPath: data[i][4],
          peakUsers: data[i][8],
          expectedTps: data[i][9],

        };
      } else if (type === 'e2e-load') {
        var row = {
          tickedRow: 1 + i,            //DON'T FORGET TO CHANGE B IF THE TICK BOX COLUMN CHANGES
          businessFlow: data[i][2],
          serviceList: data[i][3],
          apiList: data[i][4]

        };
      } else if (type === 'capacity-report') {
        var row = {
          'serviceName': data[i][2],
          'flow': data[i][3],
          'cpu-utilization': data[i][4]

        };
      }

      jsonData.push(row);

    }
  }

  //Logger.log(`Ticked box(es) output: ${JSON.stringify(jsonData)}`)
  return jsonData;
}