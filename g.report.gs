function generateReport() {

  let newSheetName
  var sheetName = currentSheet.getName()
  if (sheetName === '4.RESULT - SINGLE SERVICE') { newSheetName = '98.REPORT - SINGLE SERVICE' } else if (sheetName === '6.RESULT - E2E') { newSheetName = '99. E2E' }

  var check = getActive.getSheetByName(newSheetName)
  if (check != null) {
    
    getTickBoxValues()
    //ui.alert('Sheet Already Exists')
  
  } else { 
    var newSheet = sheet.insertSheet().setName(newSheetName)
    getActive.toast('Report Created')
    }





}
