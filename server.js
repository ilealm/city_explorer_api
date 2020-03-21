'use strict';


// framework(analogy: hollywood principle) / libraries
const express = require('express');
const app = express();

const cors =  require('cors');
// const superAgent = require('superagent');
require('dotenv').config(); //here we dont asing it to a variable :. we dont interact w. it. Just use it


// my Libraries
const client = require('./lib/client');
const handleLocation = require('./lib/handleLocation');
const handleWeather = require('./lib/handleWeather');
const handleTrails = require('./lib/handleTrails');
const handleMovies = require('./lib/handleMovies');
const handleYelp = require('./lib/handleYelp');




// GLOBAL VARIABLES
const PORT = process.env.PORT || 3001; // setting the listening port. 


// MIDDLEWARE
app.use(cors()); //use is to register a middleware function
app.use(errorIrisRulesTheWorld); //to tell express to use this function. Is for error handling. 

////////  ROUTE HANDLERS

app.get('/location',handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
app.get('/movies', handleMovies);
app.get('/yelp', handleYelp);



// //start the server. if is on, :. turn on port to listeting
client.connect()
  .then( () =>{
    // Turn on the server to listening
    app.listen(PORT, () =>{
      console.log(`listening on port ${PORT}`);
    })
  });

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

app.get('*',(request,response)=>{
  response.status(500).send('I could not find the page you are looking for'); // the function is going to return this line
});


// THIS WORKS PERFECT, BUT REACH FOR INFO IN A FILE INSTED USING AN API

// //get data from geo.json file
// let geo = require('./data/geo.json');
// let location = new Location(geo[0], city);
// response.send(location);
// Get data from iqLocations using superAgent to handle the info


// this ways return info from a json WORKS FINE. LEAVE JUST A REFERENCE
// let weatherData = require('./data/darksky.json'); //get the info from the json file
// if ((weatherData === '') || (weatherData === null))
//   throw 'Not a valid weather';   
// let arrAllweather = weatherData.daily.data.map(weatherElement =>{
//   return (new Weather(weatherElement));
// });
// response.send(arrAllweather); // here is where we have to send an araray of objects