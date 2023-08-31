const backgroundColor = 'rgb(255,255,255)'
const quickChartBaseUrl = 'https://quickchart.io/chart?'
const width = 350
const height = 200

const color = {
    red: {
        bd: 'rgb(255, 99, 132)',
        bg: 'rgba(255, 99, 132, .5)',
        bgt: 'rgba(255, 99, 132, 0)'
    },
    blue: {
        bd: 'rgb(54, 162, 235)',
        bg: 'rgba(54, 162, 235, .5)',
        bgt: 'rgba(54, 162, 235, 0)',
    },
    green: {
        bd: 'rgb(75, 192, 192)',
        bg: 'rgba(75, 192, 192, .25)',
        bgt: 'rgba(75, 192, 192, 0)',
    },
    yellow: {
        bd: 'rgb(255, 205, 86)',
        bg: 'rgba(255, 205, 86, .5)',
        bgt: 'rgba(255, 205, 86, 0)',
    },
    transparent: 'rgba(255, 255, 255, 0)'
}

function generateXAxisLabels(ref) {
    let maxLength = 0;

    if (Array.isArray(ref)) {
        maxLength = ref.length;
    } else if (typeof ref === "object") {
        for (const key in ref) {
            const value = ref[key];

            if (Array.isArray(value)) {
                maxLength = Math.max(maxLength, value.length);
            } else if (typeof value === "object") {
                for (const nestedKey in value) {
                    const nestedValue = value[nestedKey];

                    if (Array.isArray(nestedValue)) {
                        maxLength = Math.max(maxLength, nestedValue.length);
                    } else if (typeof nestedValue === "object") {
                        for (const deepNestedKey in nestedValue) {
                            const deepNestedValue = nestedValue[deepNestedKey];

                            if (Array.isArray(deepNestedValue)) {
                                maxLength = Math.max(maxLength, deepNestedValue.length);
                            }
                        }
                    }
                }
            }
        }
    }

    const xAxisLabels = new Array(maxLength).fill("");
    return xAxisLabels;
}

function getChart(rawData, chartType, componentName) {

    // common properties

    var xAxisLabels = generateXAxisLabels(rawData)

    let chartProperties = {}
    chartProperties.type = 'sparkline'
    chartProperties.data = { labels: xAxisLabels }
    chartProperties.options = {
        responsive: true,
        legend: {
            display: true,
            labels: {
                usePointStyle: true,
                fontSize: 10
            }
        },
        title: {
            position: 'left',
            display: false,
            text: 'component name',
            fontSize: 10
        },
        scales: {
            xAxes: [
                {
                    display: false
                }
            ],
            yAxes: [
                {
                    ticks: {
                        fontSize: 10
                    }
                }
            ]
        }
    }

    chartProperties.options.plugins = {
        datalabels: {
            display: true,
            backgroundColor: 'rgb(255,255,255)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            borderRadius: 5,
            anchor: 'end',
            align: 'bottom',
            font: {
                color: 'rgb(255,255,255)',
                size: 10,
                weight: 'bold'
            },
            offset: 0,
            padding: 0,
        },
    }

    // properties by chart type
    switch (chartType) {

        //microservice
        case 'ms-cpu':
        case 'ms-memory':

            chartProperties.data = {
                datasets: [
                    {
                        label: "Used",
                        backgroundColor: color.blue.bg,
                        borderColor: color.blue.bd,
                        pointStyle: "dash",
                        data: rawData.utilization,
                        pointRadius: 3,
                        borderWidth: 3,
                        lineTension: 0.5,
                        datalabels: { display: true }
                    },
                    {
                        label: "Requested",
                        backgroundColor: color.green.bgt,
                        borderColor: color.green.bd,
                        pointStyle: "dash",
                        data: rawData.request,
                        pointRadius: 3,
                        borderWidth: 3,
                        borderDash: [10, 5],
                        lineTension: 0.5,
                    },
                    {
                        label: "Limit",
                        backgroundColor: color.red.bgt,
                        borderColor: color.red.bd,
                        borderWidth: 3,
                        pointStyle: "dash",
                        data: rawData.limit,
                        pointRadius: 3,
                        borderWidth: 3,
                        borderDash: [10, 5],
                        lineTension: 0.5,
                    }
                ],
            }

            break;

        case 'redis-cpu':
        case 'redis-memory':
        case 'redis-cache-hit-ratio':
        case 'db-cpu':
        case 'db-memory':
        case 'db-total-memory':

            // to refactor to put in commin prop
            chartProperties.options.title =
            {
                position: 'top',
                display: true,
                text: `${componentName} (${chartType})`,
                fontSize: 10
            }

            chartProperties.data = {
                datasets: [
                    {
                        backgroundColor: color.blue.bg,
                        borderColor: color.blue.bd,
                        pointStyle: "dash",
                        data: rawData,
                        pointRadius: 3,
                        borderWidth: 3,
                        lineTension: 0.5,
                    }
                ],
            }
            break;

        case 'db-io':

            // to refactor to put in common prop
            chartProperties.options.title =
            {
                position: 'top',
                display: true,
                text: `${componentName} (${chartType})`,
                fontSize: 10
            }

            chartProperties.data = {
                datasets: [
                    {
                        label: "Read",
                        backgroundColor: color.blue.bg,
                        borderColor: color.blue.bd,
                        pointStyle: "dash",
                        data: rawData.read,
                        pointRadius: 3,
                        borderWidth: 3,
                        lineTension: 0.5,
                    },
                    {
                        label: "Write",
                        backgroundColor: color.green.bgt,
                        borderColor: color.green.bd,
                        pointStyle: "dash",
                        data: rawData.write,
                        pointRadius: 3,
                        borderWidth: 3,
                        lineTension: 0.5,
                    }
                ],
            }
            break;

        case 'redis-key-in-db':

            chartProperties.options.title =
            {
                position: 'top',
                display: true,
                text: `${componentName} (${chartType})`,
                fontSize: 10
            }

            chartProperties.data.datasets = []

            for (const entry in rawData) {

                var c = `rgb(0, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
                var b = 0

                if (entry.includes('exp-')) {
                    c = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0)`
                    b = [10, 7.5]
                }


                const d = {
                    "label": entry,
                    "backgroundColor": color.transparent,
                    "borderColor": c,
                    "pointStyle": 'dash',
                    "data": rawData[entry],
                    pointRadius: 3,
                    borderWidth: 2,
                    borderDash: b,
                    lineTension: 0.5,
                    datalabels: { display: true }
                }

                chartProperties.data.datasets.push(d)

            }

            break;

    }

    // Generate formula
    const queryString = `bkg=${backgroundColor}&w=${width}&h=${height}&c=${JSON.stringify(chartProperties)}`
    const endpoint = quickChartBaseUrl + encodeURI(queryString)

    console.log(`chart result : ${JSON.stringify(endpoint)}`)

    return `=IMAGE("${endpoint}")`

}


//TEST

/* var cpuData = {
    utilization: [0.07, 0.24, 0.35, 0.4, 0.37, 0.33, 0.4, 0.36, 0.34, 0.39, 0.31, 0.12],
    request: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    limit: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
} */


/* var memoryData = {
    memory_utilization: rawResult.data.record[i].memory_utilization,
    memory_request: rawResult.data.record[i].memory_request,
    memory_limit: rawResult.data.record[i].memory_limit
} */

/* console.log(getChart(cpuData, 'ms-cpu')) */