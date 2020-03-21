
'use strict';
const superAgent = require('superagent');

function handleWeather(request, response){
  // obtaining the info from darkSkyAPI using superagent
  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.latitude},${request.query.longitude}`;
  superAgent.get(url)
    .then(superAgentResults =>{
      let arrAllweather = superAgentResults.body.daily.data.map(weatherElement =>{
        return (new Weather(weatherElement));
      });
      response.send(arrAllweather);
    })
    .catch(err => console.log(err));
}

// create the Weather object
function Weather(obj){
  this.time = new Date(obj.time * 1000).toString().slice(0, 15);
  this.forecast = obj.summary;
}

module.exports = handleWeather;
