function generateReport() {

  var firstRow = 4
  let newSheetName
  var sheetName = currentSheet.getName()
  if (sheetName === '4.RESULT - SINGLE SERVICE') { newSheetName = '4.5.REPORT - SINGLE SERVICE' } else if (sheetName === '6.RESULT - E2E') { newSheetName = '6.5.REPORT - E2E' }

  var check = getActive.getSheetByName(newSheetName)

  // If the report hasn't been created yet
  if (check === null) {
    var newSheet = sheet.insertSheet(newSheetName).setTabColor("ff0000")
    getActive.toast('Creating the report')

    newSheet.setHiddenGridlines(true)
    newSheet.getRangeList(['B3:AJ3', 'E2:J2', 'O2:T2']).setBackgroundRGB(...cellColor.automatedGrey).setVerticalAlignment('middle').setHorizontalAlignment('center')
    newSheet.getRangeList(['B3:AJ3', 'E2:J2', 'O2:T2'])
    newSheet.getRangeList(['W3']).setBackgroundRGB(...cellColor.mandatoryBlue)

    //Merge Header
    newSheet.getRange('E2:G2').merge().setValue('CPU').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange('H2:J2').merge().setValue('Memory').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange('O2:T2').merge().setValue('Response Time').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)

    //Create Filter View
    newSheet.getRange('B3:AK3').createFilter()

    newSheet.getRange(3, 2).setValue('#').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 3).setValue('Microservice').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 4).setValue('Flow').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 5).setValue('Utilization').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 6).setValue('Limit\r\n(mCPU)').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 7).setValue('Request\r\n(mCPU)').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 8).setValue('Utilization').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 9).setValue('Limit\r\n(MiB)').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 10).setValue('Request\r\n(MiB)').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 11).setValue('VU').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 12).setValue('TPS').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 13).setValue('Error %').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 14).setValue('Duration').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 15).setValue('AVG').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 16).setValue('MIN').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 17).setValue('MAX').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 18).setValue('P90').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 19).setValue('P95').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 20).setValue('P99').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 21).setValue('TAG').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 22).setValue('Timestamp').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 23).setValue('API Mapping').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 24).setValue('Expected TPS').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 25).setValue('# PODS Required').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 26).setValue('Monitoring 1').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 27).setValue('Monitoring 2').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 28).setValue('Monitoring 3').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 29).setValue('Monitoring 4').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 30).setValue('Monitoring 5').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 31).setValue('Monitoring 6').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 32).setValue('Monitoring 7').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 33).setValue('Monitoring 8').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 34).setValue('Monitoring 9').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 35).setValue('Monitoring 10').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 36).setValue('Monitoring 11').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    newSheet.getRange(3, 37).setValue('Monitoring 12').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)

  } else {

    //If the report already exists
    getActive.toast('Updating the report')

  }


  var thisSheet = getActive.getSheetByName(newSheetName);

  // Clean up existing data
  thisSheet.getRange(firstRow, 1, 990, 33).clearContent().clearDataValidations()

  //Formatting
  //Header
  thisSheet.getRange('B2:AK3').setFontFamily('Calibri').setTextStyle(SpreadsheetApp.newTextStyle().setBold(true).build())
  thisSheet.getRange(firstRow, 1, 990, 33).setFontFamily('Calibri').setVerticalAlignment('middle')
  var dataToMigrate = getTickBoxValues('report')
  //ui.alert('Sheet Already Exists')

  if (dataToMigrate.length <= 0) {
    ui.alert('Please select at least one row to proceed .');
    return
  }
  for (var i = 0; i < dataToMigrate.length; i++) {

    //Logger.log(`dataToMigrate = ${dataToMigrate}`)
    //Logger.log(`stringified dataToMigrate = ${JSON.stringify(dataToMigrate)}`)

    thisSheet.getRange(firstRow + i, 2).setValue((firstRow - 3) + i).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 3).setValue(dataToMigrate[i]['serviceName']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 4).setValue(dataToMigrate[i]['flow']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 5).setValue(dataToMigrate[i]['cpu-chart']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 6).setValue(dataToMigrate[i]['cpu-limit']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 7).setValue(dataToMigrate[i]['cpu-request']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 8).setValue(dataToMigrate[i]['memory-chart']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 9).setValue(dataToMigrate[i]['memory-limit']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 10).setValue(dataToMigrate[i]['memory-request']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 11).setValue(dataToMigrate[i]['vu']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 12).setValue(dataToMigrate[i]['tps']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 13).setValue(dataToMigrate[i]['error-rate']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 14).setValue(dataToMigrate[i]['duration']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 15).setValue(dataToMigrate[i]['rt-avg']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 16).setValue(dataToMigrate[i]['rt-min']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 17).setValue(dataToMigrate[i]['rt-max']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 18).setValue(dataToMigrate[i]['rt-p90']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 19).setValue(dataToMigrate[i]['rt-p95']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 20).setValue(dataToMigrate[i]['rt-p99']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 21).setValue(dataToMigrate[i]['tag']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 22).setValue(dataToMigrate[i]['timestamp']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 23).setValue(dataToMigrate[i]['api-mapping']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 24).setValue(dataToMigrate[i]['expected-tps']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 25).setValue(dataToMigrate[i]['pod-required']).setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 26).setValue(dataToMigrate[i]['monitoring-1']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 27).setValue(dataToMigrate[i]['monitoring-2']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 28).setValue(dataToMigrate[i]['monitoring-3']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 29).setValue(dataToMigrate[i]['monitoring-4']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 30).setValue(dataToMigrate[i]['monitoring-5']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 31).setValue(dataToMigrate[i]['monitoring-6']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 32).setValue(dataToMigrate[i]['monitoring-7']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 33).setValue(dataToMigrate[i]['monitoring-8']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 34).setValue(dataToMigrate[i]['monitoring-9']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 35).setValue(dataToMigrate[i]['monitoring-10']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 36).setValue(dataToMigrate[i]['monitoring-11']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)
    thisSheet.getRange(firstRow + i, 37).setValue(dataToMigrate[i]['monitoring-12']).setVerticalAlignment('middle').setHorizontalAlignment('center').setBorder(true, true, true, true, null, null, '#cccccc', SpreadsheetApp.BorderStyle.SOLID)

    thisSheet.setRowHeight(firstRow + i, 200)

    //Adjust column width
    thisSheet.setColumnWidth(2, 25) //#
    thisSheet.setColumnWidth(3, 200) //Microservice
    thisSheet.setColumnWidth(4, 100) //Flow
    thisSheet.setColumnWidth(5, 350) //CPU Utilization Chart
    thisSheet.setColumnWidth(6, 75) //CPU Limit
    thisSheet.setColumnWidth(7, 75) //CPU Request

    thisSheet.setColumnWidth(8, 350) //Memory Utilization Chart
    thisSheet.setColumnWidth(9, 75) //Memory Limit
    thisSheet.setColumnWidth(10, 75) //Memory Request

    thisSheet.setColumnWidth(11, 75) //VU
    thisSheet.setColumnWidth(12, 75) //TPS
    thisSheet.setColumnWidth(13, 75) //Error %
    thisSheet.setColumnWidth(14, 75) //Duration

    thisSheet.setColumnWidth(15, 50) //Response Time AVG
    thisSheet.setColumnWidth(16, 50) //Response Time MIN
    thisSheet.setColumnWidth(17, 50) //Response Time MAX
    thisSheet.setColumnWidth(18, 50) //Response Time P90
    thisSheet.setColumnWidth(19, 50) //Response Time P95
    thisSheet.setColumnWidth(20, 50) //Response Time P99

    thisSheet.setColumnWidth(21, 75) //TAG 
    thisSheet.setColumnWidth(22, 75) //Timestamp

    thisSheet.setColumnWidth(23, 75) //API Mapping
    thisSheet.setColumnWidth(24, 75) //Expected TPS
    thisSheet.setColumnWidth(25, 75) //#PODS Required

    thisSheet.setColumnWidth(26, 350) //Monitoring 1
    thisSheet.setColumnWidth(27, 350) //Monitoring 2
    thisSheet.setColumnWidth(28, 350) //Monitoring 3
    thisSheet.setColumnWidth(29, 350) //Monitoring 4
    thisSheet.setColumnWidth(30, 350) //Monitoring 5
    thisSheet.setColumnWidth(31, 350) //Monitoring 6
    thisSheet.setColumnWidth(32, 350) //Monitoring 7
    thisSheet.setColumnWidth(33, 350) //Monitoring 8
    thisSheet.setColumnWidth(34, 350) //Monitoring 9
    thisSheet.setColumnWidth(35, 350) //Monitoring 10
    thisSheet.setColumnWidth(36, 350) //Monitoring 11
    thisSheet.setColumnWidth(37, 350) //Monitoring 12

  }

}


function testtest() {

}