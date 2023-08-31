// @ts-nocheck
// main functions



async function createIssue(executionType, ticketProperties) {

  let summary
  let issueDescription
  var serviceName = ticketProperties.serviceName
  var businessFlow = '' //TBD

  switch (executionType) {



    case 'capacity':
      var apiMethodAndPath = ticketProperties.apiMethodAndPath
      var expectedTps = ticketProperties.expectedTps
      var capacityContent =
        `{
        "microservice": "${serviceName}",
        "api": "${apiMethodAndPath}",
        "expected-tps": ${expectedTps}\r\n}`
      summary = `pfm-${executionType} | ${serviceName} | ${apiMethodAndPath}`
      issueDescription = [
        {
          type: "codeBlock",
          attrs: {
            language: "json"
          },
          content: [
            {
              type: "text",
              text: capacityContent
            }
          ]
        }
      ]
      break;



    case 'scaling':
      summary = `pfm-${executionType} | ${serviceName}`
      issueDescription = []
      break;



    case 'e2e-load':
      summary = `pfm-${executionType} | ${businessFlow}`
      issueDescription = []
      break;



    case 'e2e-load-external':
      summary = `pfm-${executionType} | ${businessFlow}`
      issueDescription = []
      break;



    default:

      break;
  }



  var ticketData = {

    fields: {
      project: {
        key: projectKey
      },
      summary: summary,
      description: {
        type: "doc",
        version: 1,
        content: issueDescription
      },
      issuetype: {
        name: 'Task'
      }
    }

  };

  /*   if (dataType === 'nfr') {
      ticketData.fields.parent = { key: 'epicName' }
    }
  
    //ticketData.fields.parent = { key: 'epicName' };
    switch (issueType) {
      case 'capacity':
        break
  
      case 'nfr':
  
        break
    } */

  var epicBody = {
    parent: {
      key: epicKey
    }
  }

  const options = {
    method: 'POST',
    headers: headers,
    payload: JSON.stringify(ticketData)
  };

  try {

    const response = UrlFetchApp.fetch(`${baseUrl}/rest/api/3/issue`, options);

    if (response.getResponseCode() === 201) {

      var data = JSON.parse(response.getContentText());
      Logger.log(`response : ${response}`)
      Logger.log(`data : ${data}`)
      return data; //data

    } else {

      var errorData = JSON.parse(response.getContent());
      Logger.log(`Error : ${errorData}`)
      SpreadsheetApp.getUi().alert(`Error creating Jira ticket ${errorData}`, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

    }

  } catch (e) {

    Logger.log(`Error : ${e}`)
    SpreadsheetApp.getUi().alert(`Error creating Jira ticket ${e}`, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

  }

}



async function createCapacityIssues() {

  var nfrStatus = 'Approved'
  var epicName = ''
  var epicKey = ''

  if (nfrStatus !== 'Approved' /* && epicName !== "" && epicKey !== "" */) {

    SpreadsheetApp.getUi().alert('All conditions must be fulfilled.', 'This form must be approved and Epic must be defined first', SpreadsheetApp.getUi().ButtonSet.OK);

  } else {

    //var response = Browser.msgBox("Are you sure you want to bulk create JIRA tickets?", Browser.Buttons.YES_NO);

    var response = SpreadsheetApp.getUi().alert(
      `Are you sure you want to bulk create JIRA tickets?
    \r
    \r Please check the following before clicking YES.
    \r - Target project:  ${baseUrl + '/browse/' + projectKey}`
      , SpreadsheetApp.getUi().ButtonSet.YES_NO);

    if (response == SpreadsheetApp.getUi().Button.YES) {

      var jsonData = getTickBoxValues();

      if (jsonData.length <= 0) { SpreadsheetApp.getUi().alert('Please select at least one row to proceed .'); }

      else {

        //var apiList = readValue("2.API", "B7:P16") //P1013
        //Logger.log(`apiList = ${apiList}`)

        for (var i = 0; i < jsonData.length; i++) {

          var ticketProperties = jsonData[i]
          var serviceName = ticketProperties.serviceName

          try {

            var ticketResponse = await createIssue('capacity', ticketProperties);
            var ticketKey = ticketResponse.key;

            //Logger.log(`ticketResponse : ${ticketResponse}`)
            //Logger.log(`ticketKey : ${ticketKey}`)

            addRemoteLink(ticketKey, 'sla', serviceName)
            addRemoteLink(ticketKey, 'nfr')

          } catch (e) {

            SpreadsheetApp.getUi().alert(`Error creating Jira ticket ${e}`, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

          }

          //SpreadsheetApp.getUi().alert(`Ticket No. ${i + 1} Creation Succeeded `, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

          // Change tickbox cell(s) to 'created' to prevent creating duplicate tickets 
          changeValue('B', ticketProperties.tickedRow, 'Created')

        }

        SpreadsheetApp.getUi().alert(`Finished creating ticket(s)`);

      }

    } else {
      return; // If no
    }

  }
}


async function createScalingIssues() {

  if (isHpaRequired != 'YES') {

    ui.alert(
      `HPA must be implemented in order to create Scaling Test issues on JIRA. 
      \r\nIf this was a mistake, please change the input of 'IS HPA REQUIRED FOR THIS RELEASE?' in the first sheet to 'YES'`
      , SpreadsheetApp.getUi().ButtonSet.OK);
    return;

  } else {

    var response = ui.alert(
      `Are you sure you want to bulk create JIRA Scaling Test issues?
      \r\n Multiple issues will be created based on the number of microservices in this release.
      \r\n This action cannot be undone.`, SpreadsheetApp.getUi().ButtonSet.YES_NO);

    if (response == ui.Button.YES) {

      var scalingServiceList = []
      var tempData = readValue('2.PLANNING - MICROSERVICE', `C13:C219`) //C200

      for (var i = 0; i < tempData.length; i++) {
        if (tempData[i][0] !== "") {
          scalingServiceList.push(tempData[i][0]);
        }
      }

      //Logger.log(`scalingServiceList = ${scalingServiceList}`)

      for (var i = 0; i < scalingServiceList.length; i++) {
        //loop to create issues here

        var ticketProperties = { serviceName: scalingServiceList[i] }

        try {

          await createIssue('scaling', ticketProperties)

        } catch (e) {

          SpreadsheetApp.getUi().alert(`Error creating Jira ticket ${e}`, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

        }
      }

    } else {
      return;
    }
  }
}



function getTickBoxValues() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var jsonData = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i][1] === true) {

      var row = {

        tickedRow: 1 + i,            //DON'T FORGET TO CHANGE B IF THE TICK BOX COLUMN CHANGES
        businessFlow: data[i][2],
        serviceName: data[i][3],
        apiMethodAndPath: data[i][4],
        peakUsers: data[i][8],
        expectedTps: data[i][9],

      };

      jsonData.push(row);

    }
  }

  Logger.log(`Ticked box(es) output: ${JSON.stringify(jsonData)}`)
  return jsonData;
}

function wrapValueWithQuotes(value) {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  } else {
    return '"' + value + '"';
    //return value;
  }
}

function addRemoteLink(ticketId, linkType, serviceName) {

  //var serviceName = ticketProperties.serviceName

  switch (linkType) {
    case 'sla':
      var bodyData =
      {
        "object": {
          "url": `https://ktbinnovation.atlassian.net/wiki/display/PFM/${projectId}%20%7C%20${serviceName}`,
          "title": "Test Result (Accessible after first capacity test execution)"
        }
      }
      break;

    case 'nfr':
      var bodyData =
      {
        "object": {
          "url": `${getCurrentSheetUrl()}`,
          "title": "NFR"
        }
      }
      break;
  }

  const options = {
    method: 'POST',
    headers: headers,
    payload: JSON.stringify(bodyData)
  };

  const response = UrlFetchApp.fetch(`${baseUrl}/rest/api/3/issue/${ticketId}/remotelink`, options);
  // add error handling
}