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
  var formula = currentSheet.getDataRange().getFormulas();

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
      } else if (type === 'report') {
        var row = {
          'serviceName': formula[i][2],
          'flow': data[i][3],
          'cpu-chart': formula[i][4],
          'cpu-limit': data[i][5],
          'cpu-request': data[i][6],
          'memory-chart': formula[i][7],
          'memory-limit': data[i][8],
          'memory-request': data[i][9],
          'vu': data[i][10],
          'tps': data[i][11],
          'error-rate': data[i][12],
          'duration': data[i][13],
          'rt-avg': data[i][14],
          'rt-min': data[i][15],
          'rt-max': data[i][16],
          'rt-p90': data[i][17],
          'rt-p95': data[i][18],
          'rt-p99': data[i][19],
          'tag': data[i][20],
          'timestamp': data[i][21],
          'api-mapping': data[i][22],
          'expected-tps': formula[i][23],
          'pod-required': formula[i][24],
          'monitoring-1': formula[i][25],
          'monitoring-2': formula[i][26],
          'monitoring-3': formula[i][27],
          'monitoring-4': formula[i][28],
          'monitoring-5': formula[i][29],
          'monitoring-6': formula[i][30],
          'monitoring-7': formula[i][31],
          'monitoring-8': formula[i][32],
          'monitoring-9': formula[i][33],
          'monitoring-10': formula[i][34],
          'monitoring-11': formula[i][35],
          'monitoring-12': formula[i][36],
        };
      }

      jsonData.push(row);

    }
  }

  //Logger.log(`Ticked box(es) output: ${JSON.stringify(jsonData)}`)
  return jsonData;
}

