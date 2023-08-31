/* function doGet() {
  return HtmlService.createHtmlOutputFromFile('index').setTitle('Popup Web App');
}  */

function doGet(e) {
  var queryString = e.parameter.function;

  if (queryString) {
    var functionName = queryString.trim();

    if (typeof this[functionName] === 'function') {
      var result = this[functionName]();
      return ContentService.createTextOutput(result);
    } else {
      return ContentService.createTextOutput('Specified function does not exist.');
    }
  } else {
    return ContentService.createTextOutput('No function specified.');
  }
}

function function1() {
  var html = HtmlService.createHtmlOutputFromFile('capacity_report').getContent();
  return HtmlService.createHtmlOutput(html).setTitle('Popup Web App');
}




function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Open Sidebar', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('sidebar');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function myFunctionToRun() {
  // Your function code goes here
  // Replace this with the function you want to run within the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Function ran successfully!');
  return HtmlService.createHtmlOutputFromFile('index').setTitle('Popup Web App');
}
