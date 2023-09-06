/* async function queryPostgreSQL(projectId, releaseName, executionType) {
  var baseUrl = 'https://postgres-broker-ptct.onrender.com:3000/query?q='

  var query = 
 `SELECT *
  FROM record.report
  WHERE 'project' = '${projectId}' 
  AND 'release' = '${releaseName}'
  AND 'execution_type' = '${executionType}'`

  var url = baseUrl + encodeURI(query)

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var queryResult = JSON.parse(response.getContentText());

  Logger.log(`url = ${url}`);
  Logger.log(`response = ${response}`);

  return queryResult
} */

//PTCT
async function queryPostgreSQL(projectId, releaseName, executionType) {
  const url = `https://db-client-99nl.onrender.com/api/v1/report`;

  var body = {
    "project": projectId,
    "release": releaseName,
    "execution_type": executionType,
    "duration_seconds": 60
}

  var requestOptions = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(body),
    'muteHttpExceptions': true
  };

  var response = UrlFetchApp.fetch(url, requestOptions);
  var queryResult = JSON.parse(response.getContentText());

  Logger.log(`url = ${url}`);
  Logger.log(`response = ${response}`);
  Logger.log(`queryResult = ${queryResult}`);

  return queryResult
}

function cockroachHealthheck() {

  var healthcheckResponse = UrlFetchApp.fetch('https://postgres-broker-ptct.onrender.com/healthz')
  Logger.log(healthcheckResponse.getResponseCode())

  if (healthcheckResponse.getResponseCode() === 200) {
    SpreadsheetApp.getActiveSpreadsheet().toast(`Connected to Database (status: ${healthcheckResponse.getResponseCode()})`)
  }

}
