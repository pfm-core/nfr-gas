function UntitledMacro() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E11').activate();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('98.REPORT - SINGLE SERVICE'), true);
  spreadsheet.getRange('D11').activate()
  spreadsheet.getRange('\'4.RESULT - SINGLE SERVICE\'!E11').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
};