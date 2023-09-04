function getMetricData(rawResult, metricValue) {
  const metricData = [];

  if (
    rawResult &&
    rawResult.data &&
    rawResult.data.record &&
    Array.isArray(rawResult.data.record)
  ) {
    const records = rawResult.data.record;
    for (const record of records) {
      if (record.monitoring_db && Array.isArray(record.monitoring_db)) {
        for (const metric of record.monitoring_db) {
          if (metric.metric === metricValue) {

            metricData.push(...metric.values);

          }
        }
      }
    }
  }

  return metricData;
}


function reformatData(monitoringRawData) {
  const formattedOutput = {
    redis: {},
    cloudsql: {},
  };

  try {
    for (const entry of monitoringRawData) {
      const { db, metric, type, idx, values } = entry;

      if (!db || !metric) { continue; }

      if (type === 'redis') {
        if (!formattedOutput.redis[db]) {
          formattedOutput.redis[db] = {
            "redis.googleapis.com/stats/cpu_utilization": [],
            "redis.googleapis.com/stats/memory/usage": [],
            "redis.googleapis.com/stats/memory/maxmemory": [],
            "redis.googleapis.com/keyspace/keys": {},
            "redis.googleapis.com/keyspace/keys_with_expiration": {},
            "redis.googleapis.com/stats/cache_hit_ratio": [],
          };
        }

        if (metric === "redis.googleapis.com/keyspace/keys") {
          if (!formattedOutput.redis[db][metric][idx]) {
            formattedOutput.redis[db][metric][idx] = [];
          }
          formattedOutput.redis[db][metric][idx] = values;
        } else if (metric === "redis.googleapis.com/keyspace/keys_with_expiration") {
          if (!formattedOutput.redis[db]["redis.googleapis.com/keyspace/keys_with_expiration"][idx]) {
            formattedOutput.redis[db]["redis.googleapis.com/keyspace/keys_with_expiration"][idx] = [];
          }
          formattedOutput.redis[db]["redis.googleapis.com/keyspace/keys_with_expiration"][idx] = values;
        } else {
          formattedOutput.redis[db][metric] = values;
        }
      } else if (type === 'cloudsql') {
        if (!formattedOutput.cloudsql[db]) {
          formattedOutput.cloudsql[db] = {
            "cloudsql.googleapis.com/database/cpu/utilization": [],
            "cloudsql.googleapis.com/database/memory/usage": [],
            "cloudsql.googleapis.com/database/memory/total_usage": [],
            "cloudsql.googleapis.com/database/disk/read_ops_count": [],
            "cloudsql.googleapis.com/database/disk/write_ops_count": [],
          };
        }

        formattedOutput.cloudsql[db][metric] = values;
      }
    }
  } catch (error) {
    Logger.log("Error reformatting monitoring_db data", error);
    sheet.toast("Error reformatting monitoring_db data", error);
    return null
  };

  return formattedOutput;
}




async function retrieveTestResult() {

  var firstRow = 11 //first row of test result data
  //Distinguish testType based on the sheet name
  let testType
  var sheetName = currentSheet.getName()
  if (sheetName === '4.RESULT - SINGLE SERVICE') { testType = 'capacity' } else if (sheetName === '6.RESULT - E2E') { testType = 'e2e-load' }

  if (!projectId || !releaseName) {

    uiAlert().invalidProjectIdAndReleaseName();
    return;

  } else {

    var response = uiAlert().getResultConfirmation();

    if (response == ui.Button.YES) {

      currentSheet.getRange(firstRow, 2, 990, 36).clearContent()

      const rawResult = await queryPostgreSQL(projectId, releaseName, testType)

      Logger.log(`rawResult = ${rawResult}`)

      for (let i = 0; i < rawResult.data.record.length; i++) {

        var release = rawResult.data.record[i].release
        var execution_type = rawResult.data.record[i].execution_type
        var project = rawResult.data.record[i].project
        var service = rawResult.data.record[i].service
        var flow = rawResult.data.record[i].flow
        var tag = rawResult.data.record[i].tag
        var vu = rawResult.data.record[i].vu
        var duration = rawResult.data.record[i].duration
        var tps = rawResult.data.record[i].tps
        var error_rate = rawResult.data.record[i].error_rate
        var rt_avg = rawResult.data.record[i].rt_avg
        var rt_min = rawResult.data.record[i].rt_min
        var rt_max = rawResult.data.record[i].rt_max
        var rt_p90 = rawResult.data.record[i].rt_p90
        var rt_p95 = rawResult.data.record[i].rt_p95
        var rt_p99 = rawResult.data.record[i].rt_p99
        var is_cpu_below_request = rawResult.data.record[i].is_cpu_below_request

        var resource_map = rawResult.data.record[i].resource_map
        let cpuLimits
        let cpuRequests
        let memoryLimits
        let memoryRequests

        for (const key in resource_map) {
          if (resource_map.hasOwnProperty(key)) {
            cpuLimits = resource_map[key]["limits"]["cpu"]
            cpuRequests = resource_map[key]["requests"]["cpu"]
            memoryLimits = resource_map[key]["limits"]["memory"]
            memoryRequests = resource_map[key]["requests"]["memory"]
          }
        }

        //for chart
        var cpuData = {
          utilization: rawResult.data.record[i].cpu_utilization,
          request: rawResult.data.record[i].cpu_request,
          limit: rawResult.data.record[i].cpu_limit
        }

        var memoryData = {
          utilization: rawResult.data.record[i].memory_utilization,
          request: rawResult.data.record[i].memory_request,
          limit: rawResult.data.record[i].memory_limit
        }

        let chartFormulaSet = []

        if (rawResult.data.record[i].monitoring_db !== null) {

          const formattedData = reformatData(rawResult.data.record[i].monitoring_db)
          Logger.log(`monitoring_db = ${JSON.stringify(rawResult.data.record[i].monitoring_db)}`)
          Logger.log(`formattedData = ${JSON.stringify(formattedData)}`)



          // Construct charts Redis
          if (formattedData.hasOwnProperty('redis')) {
            for (const redisEntry in formattedData.redis) {

              // Redis | CPU Utilization
              var rcd = formattedData.redis[redisEntry]["redis.googleapis.com/stats/cpu_utilization"]
              var frcd = getChart(rcd, "redis-cpu", redisEntry);
              chartFormulaSet.push(frcd)

              // Redis | Memory Usage & Maximum
              var rmu = formattedData.redis[redisEntry]["redis.googleapis.com/stats/memory/usage"];
              var rmm = formattedData.redis[redisEntry]["redis.googleapis.com/stats/memory/maxmemory"];
              var rmum = {
                usage: rmu,
                max: rmm,
              };
              var frmum = getChart(rmum, 'redis-memory', redisEntry)
              chartFormulaSet.push(frmum)

              // Redis | Cache Hit Ratio
              var rchr = formattedData.redis[redisEntry]["redis.googleapis.com/stats/cache_hit_ratio"]
              var frchr = getChart(rchr, "redis-cache-hit-ratio", redisEntry);
              chartFormulaSet.push(frchr)

              // Redis | Keys in Database
              var redisKeys = {};
              var redisData = formattedData.redis;

              for (const redisEntry in redisData) {
                var keysData = redisData[redisEntry]["redis.googleapis.com/keyspace/keys"];
                var expKeysData = redisData[redisEntry]["redis.googleapis.com/keyspace/keys_with_expiration"];

                for (const key in keysData) {
                  redisKeys[`key-${key}`] = keysData[key];
                }

                for (const key in expKeysData) {
                  redisKeys[`exp-key-${key}`] = expKeysData[key];
                }
              }
              var frk = getChart(redisKeys, 'redis-key-in-db', redisEntry)
              chartFormulaSet.push(frk)

            }
          }

          // Construct charts CloudSQL
          if (formattedData.hasOwnProperty('cloudsql')) {

            for (const cloudsqlEntry in formattedData.cloudsql) {

              // CloudSQL | CPU Utilization
              var csqlc = formattedData.cloudsql[cloudsqlEntry]["cloudsql.googleapis.com/database/cpu/utilization"];
              var fcsqlc = getChart(csqlc, 'db-cpu', cloudsqlEntry)
              chartFormulaSet.push(fcsqlc)

              // CloudSQL | Memory Utilization
              var csqlm = formattedData.cloudsql[cloudsqlEntry]["cloudsql.googleapis.com/database/memory/usage"];
              var fcsqlm = getChart(csqlm, 'db-memory', cloudsqlEntry)
              chartFormulaSet.push(fcsqlm)

              // CloudSQL | Disk Read & Write
              var csqla = formattedData.cloudsql[cloudsqlEntry]["cloudsql.googleapis.com/database/disk/read_ops_count"];
              var csqlb = formattedData.cloudsql[cloudsqlEntry]["cloudsql.googleapis.com/database/disk/write_ops_count"];
              var csqldrw = {
                read: csqla,
                write: csqlb
              }
              var fcsqld = getChart(csqldrw, 'db-io', cloudsqlEntry)
              chartFormulaSet.push(fcsqld)
            }
          }
        }

        var timestamp = rawResult.data.record[i].timestamp

        //changeValue('B', firstRow + i, i + 1) //Number

        currentSheet.getRange(firstRow + i, 2).setDataValidation(checkbox)
        changeValue('B', firstRow + i, 'FALSE')

        changeValue('C', firstRow + i, `=HYPERLINK("https://ktbinnovation.atlassian.net/wiki/display/PFM/${projectId}%20%7C%20${service}","${service}")`)
        changeValue('D', firstRow + i, flow)
        changeValue('E', firstRow + i, getChart(cpuData, 'ms-cpu')) //CPU Utilization Chart
        changeValue('F', firstRow + i, cpuData.limit)
        changeValue('G', firstRow + i, cpuData.request)
        changeValue('H', firstRow + i, getChart(memoryData, 'ms-memory')) //Memory Utilization Chart
        changeValue('I', firstRow + i, memoryData.limit)
        changeValue('J', firstRow + i, memoryData.request)
        changeValue('K', firstRow + i, vu)
        changeValue('L', firstRow + i, tps)
        changeValue('M', firstRow + i, error_rate)
        changeValue('N', firstRow + i, duration)
        changeValue('U', firstRow + i, tag)
        changeValue('O', firstRow + i, rt_avg)
        changeValue('P', firstRow + i, rt_min)
        changeValue('Q', firstRow + i, rt_max)
        changeValue('R', firstRow + i, rt_p90)
        changeValue('S', firstRow + i, rt_p95)
        changeValue('T', firstRow + i, rt_p99)
        changeValue('V', firstRow + i, timestamp)
        changeValue('X', firstRow + i, `=IFERROR(VLOOKUP(W${firstRow + i},'3.PREPARATION - SINGLE SERVICE'!E22:J1021,6,FALSE),"Please select API")`)
        changeValue('Y', firstRow + i, `=IFERROR(ROUNDUP(X${firstRow + i}/L${firstRow + i}),"Please select API")`)

        if (chartFormulaSet.length > 0) {
          var chartFirstColumn = 26 // Column Z
          //Attach charts to the report
          for (let ii = 0; ii < chartFormulaSet.length; ii++) {

            changeValue(chartFirstColumn + ii, firstRow + i, chartFormulaSet[ii])

          }
        }

      }
    } else {
      return
    }
  }
}

