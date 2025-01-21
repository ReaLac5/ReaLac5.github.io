/*async function fetchAnalyticsData() {
    const response = await gapi.client.analyticsdata.properties.runReport({
        property: "properties/443269906",
        requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "country" }, { name: "deviceCategory" }, {
                name: "pagePath"
            }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, {
                name:
                    "averageSessionDuration"
            }]
        }
    });
    console.log(response.result);
}*/
/*async function fetchAnalyticsData() {
    const response = await gapi.client.analyticsdata.properties.runReport({
        property: "properties/443269906",
        requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "country" }, { name: "deviceCategory" }, { name: "pagePath" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "averageSessionDuration" }]
        }
    });
    
    // Provjeri što dobiješ u response.result
    console.log(response.result);

    // Provjeri kako podaci izgledaju prije nego što ih pošalješ za grafikon
    const data = {
        labels: response.result.rows.map(row => row.dimensionValues[0].value), // Za primjer, koristimo prvu dimenziju kao oznake
        values: response.result.rows.map(row => row.metricValues[0].value), // Pretpostavljamo da su podaci za aktivne korisnike
    };

    renderChart(data); // Poziv funkcije za renderiranje grafikona
}*/
/**
 * Fetch Google Analytics Data
 */
async function fetchAnalyticsData() {
    const response = await gapi.client.analyticsdata.properties.runReport({
        property: "properties/443269906",
        requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            dimensions: [{ name: "country" }, { name: "deviceCategory" }, {
                name: "pagePath"
            }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, {
                name:
                    "averageSessionDuration"
            }]
        }
    });
    console.log(response.result);
}