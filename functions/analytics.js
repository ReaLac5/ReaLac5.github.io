const axios = require('axios');

exports.handler = async function(event, context) {
  const { authorization } = event.headers;

  if (!authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "No token provided" }),
    };
  }

  const accessToken = authorization.split(' ')[1]; // Preuzimanje tokena iz Authorization headera
  
  try {
    const response = await axios.get('https://analytics.googleapis.com/v3/data/ga', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          ids: 'ga:443269906',
          'start-date': '30daysAgo',
          'end-date': 'today',
          metrics: 'ga:activeUsers,ga:sessions,ga:averageSessionDuration',
        },
      });
     

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data from Google Analytics', error }),
    };
  }
};
