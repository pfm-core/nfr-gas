function getJiraCredentials() {

  var jiraAccountEmailPrompt = ui.prompt('Please insert JIRA Email', ui.ButtonSet.OK_CANCEL);

  var apiTokenPrompt = ui.prompt(`Please insert JIRA API Token
    \r\n Visit url below for more info:
    \r https://id.atlassian.com/manage-profile/security/api-tokens`, ui.ButtonSet.OK_CANCEL);

  var jiraEmail = jiraAccountEmailPrompt.getResponseText();
  var apiToken = apiTokenPrompt.getResponseText();
  var encodedApiKey = Utilities.base64Encode(`${jiraEmail}:${apiToken}`);

  if (jiraAccountEmailPrompt.getSelectedButton() == ui.Button.OK && apiTokenPrompt.getSelectedButton() == ui.Button.OK) {
    if (jiraEmail == '' || apiToken == '') {
      ui.alert('Please insert both Email and API Token.');
      return;
    }
    return encodedApiKey
  }
  return;
}

async function createIssue(ticketType, ticketProperties, jiraCredential) {

  switch (ticketType) {



    case 'capacity':
      var capacityContent =
        `{
        "microservice": "${ticketProperties.serviceName}",
        "api": "${ticketProperties.apiMethodAndPath}",
        "expected-tps": ${ticketProperties.expectedTps}\r\n}`
      var summary = `pfm-${ticketType} | ${ticketProperties.serviceName} | ${ticketProperties.apiMethodAndPath}`
      var issueDescription = [
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
      var summary = `pfm-${ticketType} | ${ticketProperties.serviceName}`
      var issueDescription = []
      break;



    case 'e2e-load':
      var summary = `pfm-${ticketType} | ${ticketProperties.businessFlow}`
      var e2eContent =
        `{
        "microservice-list": ${ticketProperties.serviceList.split('\n').map(line => `"${line}",`).join('\n')},
        "api-list": ${ticketProperties.apiList.split('\n').map(line => `"${line}",`).join('\n')}\r\n}`
      var issueDescription = [
        {
          type: "codeBlock",
          attrs: {
            language: "json"
          },
          content: [
            {
              type: "text",
              text: e2eContent
            }
          ]
        }
      ]
      break;



    case 'e2e-load-external':
      var summary = `pfm-${ticketType} | ${ticketProperties.businessFlow}`
      var issueDescription = []
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + jiraCredential
    },
    payload: JSON.stringify(ticketData)
  };

  try {

    const response = UrlFetchApp.fetch(`${baseUrl}/rest/api/3/issue`, options);

    if (response.getResponseCode() === 201) {

      var data = JSON.parse(response.getContentText());
      Logger.log(`response : ${response}`)
      Logger.log(`data : ${data}`)

      if (ticketType === 'capacity') {
        addRemoteLink(jiraCredential, data.key, 'sla', ticketProperties.serviceName)
        addRemoteLink(jiraCredential, data.key, 'nfr')
      }

      return data;

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



async function createSelectedIssues() {

  let ticketType
  var sheetName = currentSheet.getName()
  if (sheetName === '3.PREPARATION - SINGLE SERVICE') { ticketType = 'capacity' } else if (sheetName === '5.PREPARATION - E2E') { ticketType = 'e2e-load' }


  var nfrStatus = 'Approved'
  var epicName = ''
  var epicKey = ''


  //var response = Browser.msgBox("Are you sure you want to bulk create JIRA tickets?", Browser.Buttons.YES_NO);

  var response = ui.alert(
    `Are you sure you want to bulk create JIRA tickets?
    \r
    \r Please check the following before clicking YES.
    \r - Target project:  ${baseUrl + '/browse/' + projectKey}`
    , SpreadsheetApp.getUi().ButtonSet.YES_NO);

  if (response == ui.Button.YES) {


    var jsonData = getTickBoxValues(ticketType);

    if (jsonData.length <= 0) {
      ui.alert('Please select at least one row to proceed .');
      return
    }

    var jiraCredential = getJiraCredentials();

    if (jiraCredential === undefined || jiraCredential === '') { return }

    for (var i = 0; i < jsonData.length; i++) {

      var ticketProperties = jsonData[i]


      try {

        var ticketResponse = await createIssue(ticketType, ticketProperties, jiraCredential);
        var ticketKey = ticketResponse.key;

      } catch (e) {

        SpreadsheetApp.getUi().alert(`Error creating Jira ticket : \r\n ${e} \r\n Aborting ticket creation.`); return

      }

      // Change tickbox cell(s) to 'created' to prevent creating duplicate tickets 
      changeValue('B', ticketProperties.tickedRow, 'Created')

    }

    SpreadsheetApp.getUi().alert(`Finished creating ticket(s)`);

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

      var jiraCredential = getJiraCredentials();

      //Logger.log(`scalingServiceList = ${scalingServiceList}`)

      for (var i = 0; i < scalingServiceList.length; i++) {
        //loop to create issues here

        var ticketProperties = { serviceName: scalingServiceList[i] }

        try {

          await createIssue('scaling', ticketProperties, jiraCredential)

        } catch (e) {

          SpreadsheetApp.getUi().alert(`Error creating Jira ticket ${e}`, 'Click OK to close', SpreadsheetApp.getUi().ButtonSet.OK);

        }
      }

    } else {
      return;
    }
  }
}

function wrapValueWithQuotes(value) {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  } else {
    return '"' + value + '"';
    //return value;
  }
}

function addRemoteLink(jiraCredential, ticketId, linkType, serviceName) {

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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + jiraCredential
    },
    payload: JSON.stringify(bodyData)
  };

  const response = UrlFetchApp.fetch(`${baseUrl}/rest/api/3/issue/${ticketId}/remotelink`, options);
  // add error handling
}