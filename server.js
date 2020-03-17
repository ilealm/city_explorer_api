// libraries

// declare package to use
const express = require('express');
const app = express();

const cors =  require('cors');
app.use(cors());

// get variables from .env
require('dotenv').config();
const PORT = process.env.PORT || 3001;  // setting the listening port

// LOCATION PART
// get the data from the front end
app.get('/location',(request, response) => {
  try{
    let city = request.query.city;
    console.log('You requested on city: ', city);

    //get data from geo.json
    let geo = require('./data/geo.json');
    let location = new Location(geo[0], city);
    response.send(location);
  }
  catch(err){
    console.error(err);
  }
})

// create the Location object
function Location(obj, city){
  this.search_query = city;
  this.formated_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

// WEATHER PART
// get the data from the front end
app.get('/weather',(request, response) => {
  try{
    //get data from darksky.json
    let weatherData = require('./data/darksky.json');
    // let weather = new Weather(weatherData[0], city);
    // we need to 
    let arrAllweather =[];
    
    weatherData.daily.data.forEach(weatherElement => {
      arrAllweather.push(new Weather(weatherElement));
    })

    // let weather = new Weather(weatherData.currently);
    response.send(arrAllweather); // here is where we have to send an araray of objects

  }
  catch(err){
    console.error(err);
  }
})

// create the Location object
function Weather(obj){
  this.time = new Date(obj.time * 1000).toString().slice(0, 15);
  this.forecast = obj.summary;
}
  


// If page not found:
app.get('*',(request,response)=>{
  response.status(404).send('I could not find the page you are looking for');
});

// Turn on the server to listening
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})