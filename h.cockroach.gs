async function queryPostgreSQL(projectId, releaseName, executionType) {
  const url = `https://db-client-99nl.onrender.com/api/project/${projectId}/release/${releaseName}/execution-type/${executionType}`;

  //Logger.log(`Request URL: ${url}`)

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var queryResult = JSON.parse(response.getContentText());

  Logger.log(`url = ${url}`);
  Logger.log(`response = ${response}`);
  //Logger.log(`queryResult = ${queryResult}`);
  
  //For debugging
  //changeValue('A1',response)
  return queryResult

}

function cockroachHealthheck() {

  var healthcheckResponse = UrlFetchApp.fetch('https://db-client-99nl.onrender.com/healthz')
  Logger.log(healthcheckResponse.getResponseCode())

  if (healthcheckResponse.getResponseCode() === 200) {
    SpreadsheetApp.getActiveSpreadsheet().toast(`Connected to Database (status: ${healthcheckResponse.getResponseCode()})`)
  }

}
