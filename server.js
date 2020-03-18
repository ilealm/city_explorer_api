// framework(analogy: hollywood principle) / libraries
const express = require('express');
require('dotenv').config();  //here we dont asing it to a variable :. we dont interact w. it. Just use it
const cors =  require('cors');
// here superagent = requeire('superagent); //todo: intall it on terminal


// GLOBAL VARIABLES
const app = express();
const PORT = process.env.PORT || 3001; // setting the listening port. TODO: ADDED TO HEROKU

// MIDDLEWARE
app.use(cors()); //use is to register a middleware function
app.use(errorIrisRulesTheWorld); //to tell express to use this function. Is for error handling. 

////////  ROUTE HANDLERS
// LOCATION PART
// get the data from the front end
app.get('/location',(request, response) => {
  let city = request.query.city;
  if ((city === '') || (city === null))
    throw 'Not a valid city';
  console.log('You requested on city: ', city);

  //get data from geo.json
  let geo = require('./data/geo.json');
  let location = new Location(geo[0], city);
  response.send(location);
})

// create the Location object
function Location(obj, city){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


// WEATHER PART
app.get('/weather',(request, response) => {
  let weatherData = require('./data/darksky.json'); //get the info from the json file
  if ((weatherData === '') || (weatherData === null))
    throw 'Not a valid weather';
  let arrAllweather = weatherData.daily.data.map(weatherElement =>{
    return (new Weather(weatherElement));
  });

  response.send(arrAllweather); // here is where we have to send an araray of objects
})

// create the Location object
function Weather(obj){
  this.time = new Date(obj.time * 1000).toString().slice(0, 15);
  this.forecast = obj.summary;
}



// If page not found:
// turn this app.get into a function, the function is going to return a response status 
// the parameter to pass to function will be what the request is
//the function return, will be the response
// https://expressjs.com/en/guide/error-handling.html
// my error handle function. MUST BE THIS 4 parameters
function errorIrisRulesTheWorld (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send({ status: 500, responseText: 'Sorry, something went wrong' })
  //res.send({ status: 500, responseText: 'Sorry, something went wrong' })
}



// app.get('*',(request,response)=>{
//   response.status(500).send('I could not find the page you are looking for'); // the function is going to return this line
// });

// Turn on the server to listening
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})
