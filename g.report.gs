function generateReport() {

  let newSheetName
  var sheetName = currentSheet.getName()
  if (sheetName === '4.RESULT - SINGLE SERVICE') { newSheetName = '98.REPORT - SINGLE SERVICE' } else if (sheetName === '6.RESULT - E2E') { newSheetName = '99. E2E' }

  var check = getActive.getSheetByName(newSheetName)

  // If the report hasn't been created yet
  if (check === null) {
    var newSheet = sheet.insertSheet().setName(newSheetName)
    getActive.toast('Creating the report')

    //If the report already exists
  } else {
    getActive.toast('Updating the report')
  }


  var dataToMigrate = getTickBoxValues('report')
  //ui.alert('Sheet Already Exists')

  if (dataToMigrate.length <= 0) {
    ui.alert('Please select at least one row to proceed .');
    return
  }
  for (var i = 0; i < dataToMigrate.length; i++) {

    Logger.log(`dataToMigrate = ${dataToMigrate}`)
    Logger.log(`stringified dataToMigrate = ${JSON.stringify(dataToMigrate)}`)

    var firstRow = 11
    var thisSheet = getActive.getSheetByName(newSheetName);

    //getActive.setActiveSheet();

    thisSheet.getRange(firstRow + i, 2).setValue(dataToMigrate[i]['serviceName'])
    thisSheet.getRange(firstRow + i, 3).setValue(dataToMigrate[i]['flow'])
    thisSheet.getRange(firstRow + i, 4).setValue(dataToMigrate[i]['cpu-chart']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 5).setValue(dataToMigrate[i]['cpu-limit'])
    thisSheet.getRange(firstRow + i, 6).setValue(dataToMigrate[i]['cpu-request'])
    thisSheet.getRange(firstRow + i, 7).setValue(dataToMigrate[i]['memory-chart']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 8).setValue(dataToMigrate[i]['memory-limit'])
    thisSheet.getRange(firstRow + i, 9).setValue(dataToMigrate[i]['memory-request'])
    thisSheet.getRange(firstRow + i, 10).setValue(dataToMigrate[i]['vu'])
    thisSheet.getRange(firstRow + i, 11).setValue(dataToMigrate[i]['tps'])
    thisSheet.getRange(firstRow + i, 12).setValue(dataToMigrate[i]['error-rate'])
    thisSheet.getRange(firstRow + i, 13).setValue(dataToMigrate[i]['duration'])
    thisSheet.getRange(firstRow + i, 14).setValue(dataToMigrate[i]['rt-avg'])
    thisSheet.getRange(firstRow + i, 15).setValue(dataToMigrate[i]['rt-min'])
    thisSheet.getRange(firstRow + i, 16).setValue(dataToMigrate[i]['rt-max'])
    thisSheet.getRange(firstRow + i, 17).setValue(dataToMigrate[i]['rt-p90'])
    thisSheet.getRange(firstRow + i, 18).setValue(dataToMigrate[i]['rt-p95'])
    thisSheet.getRange(firstRow + i, 19).setValue(dataToMigrate[i]['rt-p99'])
    thisSheet.getRange(firstRow + i, 20).setValue(dataToMigrate[i]['tag'])
    thisSheet.getRange(firstRow + i, 21).setValue(dataToMigrate[i]['timestamp'])
    thisSheet.getRange(firstRow + i, 22).setValue(dataToMigrate[i]['api-mapping'])
    thisSheet.getRange(firstRow + i, 23).setValue(dataToMigrate[i]['expected-tps'])
    thisSheet.getRange(firstRow + i, 24).setValue(dataToMigrate[i]['pod-required'])
    thisSheet.getRange(firstRow + i, 25).setValue(dataToMigrate[i]['monitoring-1']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 26).setValue(dataToMigrate[i]['monitoring-2']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 27).setValue(dataToMigrate[i]['monitoring-3']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 28).setValue(dataToMigrate[i]['monitoring-4']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 29).setValue(dataToMigrate[i]['monitoring-5']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 30).setValue(dataToMigrate[i]['monitoring-6']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 31).setValue(dataToMigrate[i]['monitoring-7']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 32).setValue(dataToMigrate[i]['monitoring-8']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 33).setValue(dataToMigrate[i]['monitoring-9']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 34).setValue(dataToMigrate[i]['monitoring-10']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 35).setValue(dataToMigrate[i]['monitoring-11']).setVerticalAlignment('middle').setHorizontalAlignment('center')
    thisSheet.getRange(firstRow + i, 36).setValue(dataToMigrate[i]['monitoring-12']).setVerticalAlignment('middle').setHorizontalAlignment('center')

    thisSheet.setRowHeight(firstRow + i, 200)
    thisSheet.setColumnWidth(4, 350)
    thisSheet.setColumnWidth(7, 350)
    thisSheet.setColumnWidth(25, 350)
    thisSheet.setColumnWidth(26, 350)
    thisSheet.setColumnWidth(27, 350)
    thisSheet.setColumnWidth(28, 350)
    thisSheet.setColumnWidth(29, 350)
    thisSheet.setColumnWidth(30, 350)
    thisSheet.setColumnWidth(31, 350)
    thisSheet.setColumnWidth(32, 350)
    thisSheet.setColumnWidth(33, 350)
    thisSheet.setColumnWidth(34, 350)
    thisSheet.setColumnWidth(35, 350)
    thisSheet.setColumnWidth(36, 350)

    //paste data here
    /* changeValue('B', firstRow + i, dataToMigrate[i]['serviceName'])
    changeValue('C', firstRow + i, dataToMigrate[i]['flow'])
    changeValue('D', firstRow + i, dataToMigrate[i]['cpu-chart'])
    changeValue('E', firstRow + i, dataToMigrate[i]['cpu-limit'])
    changeValue('F', firstRow + i, dataToMigrate[i]['cpu-request'])
    changeValue('G', firstRow + i, dataToMigrate[i]['memory-chart'])
    changeValue('H', firstRow + i, dataToMigrate[i]['memory-limit'])
    changeValue('I', firstRow + i, dataToMigrate[i]['memory-request'])
    changeValue('J', firstRow + i, dataToMigrate[i]['vu'])
    changeValue('K', firstRow + i, dataToMigrate[i]['tps'])
    changeValue('L', firstRow + i, dataToMigrate[i]['error-rate'])
    changeValue('M', firstRow + i, dataToMigrate[i]['duration'])
    changeValue('N', firstRow + i, dataToMigrate[i]['rt-avg'])
    changeValue('O', firstRow + i, dataToMigrate[i]['rt-min'])
    changeValue('P', firstRow + i, dataToMigrate[i]['rt-max'])
    changeValue('Q', firstRow + i, dataToMigrate[i]['rt-p90'])
    changeValue('R', firstRow + i, dataToMigrate[i]['rt-p95'])
    changeValue('S', firstRow + i, dataToMigrate[i]['rt-p99'])
    changeValue('T', firstRow + i, dataToMigrate[i]['tag'])
    changeValue('U', firstRow + i, dataToMigrate[i]['timestamp'])
    changeValue('V', firstRow + i, dataToMigrate[i]['api-mapping'])
    changeValue('W', firstRow + i, dataToMigrate[i]['expected-tps'])
    changeValue('X', firstRow + i, dataToMigrate[i]['pod-required'])
    changeValue('Y', firstRow + i, dataToMigrate[i]['monitoring-1'])
    changeValue('Z', firstRow + i, dataToMigrate[i]['monitoring-2'])
    changeValue('AA', firstRow + i, dataToMigrate[i]['monitoring-3'])
    changeValue('AB', firstRow + i, dataToMigrate[i]['monitoring-4'])
    changeValue('AC', firstRow + i, dataToMigrate[i]['monitoring-5'])
    changeValue('AD', firstRow + i, dataToMigrate[i]['monitoring-6'])
    changeValue('AE', firstRow + i, dataToMigrate[i]['monitoring-7'])
    changeValue('AF', firstRow + i, dataToMigrate[i]['monitoring-8'])
    changeValue('AG', firstRow + i, dataToMigrate[i]['monitoring-9'])
    changeValue('AH', firstRow + i, dataToMigrate[i]['monitoring-10'])
    changeValue('AI', firstRow + i, dataToMigrate[i]['monitoring-11'])
    changeValue('AJ', firstRow + i, dataToMigrate[i]['monitoring-12']) */

  }

}


function testtest() {

  var sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("4.RESULT - SINGLE SERVICE");
  var destinationSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("98.REPORT - SINGLE SERVICE");

  // Define the range of cells to copy
  var rangeToCopy = sourceSheet.getRange("E11");

  // Get the values from the range
  var valuesToCopy = rangeToCopy.getFormula();

  // Define the range where the values will be pasted
  var pasteRange = destinationSheet.getRange("A1");

  // Paste the values to the destination range
  pasteRange.setFormula(valuesToCopy);

}