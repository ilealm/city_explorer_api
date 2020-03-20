
// framework(analogy: hollywood principle) / libraries
const express = require('express');
// access all hidden variables
require('dotenv').config(); //here we dont asing it to a variable :. we dont interact w. it. Just use it
const cors =  require('cors');
const superAgent = require('superagent'); //todo: intall it on terminal
const pg = require('pg');

// DATABASE CONECCTION TO POSTGRES
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));



// GLOBAL VARIABLES
const app = express();
const PORT = process.env.PORT || 3001; // setting the listening port. TODO: ADDED TO HEROKU


// MIDDLEWARE
app.use(cors()); //use is to register a middleware function
app.use(errorIrisRulesTheWorld); //to tell express to use this function. Is for error handling. 

////////  ROUTE HANDLERS
// LOCATION PART
// get the data from (file | API) and send it the front end
// the endpoint lives un the URL last part
app.get('/location',(request, response) => {
  let city = request.query.city; //TODO: toLowerCases
  if ((city === '') || (city === null))
    throw 'Not a valid city';
  console.log('You requested on city: ', city);

  // review if city exists in table locations, if so, we retrieve the info
  var sql = 'SELECT * FROM locations WHERE search_query =$1';
  let safeValues = [city];
  client.query(sql,safeValues)
    .then(results =>{
      if (results.rows.length>0) {
        console.log ('I found the city on the data base');
      }
      else {
        console.log ('I DO NOT found the city on the data base');
      }
    })
//   console.log(sql);
//   return client.query(sql);
//   // return client.query(sql).then().catch();
  


  // console.log('Retrieveing city info from BD');
  // console.log('test',cityObj);


  // if the location does't exist in the table locations
  // console.log('geoKey: ', process.env.GEOCODE_API_KEY);
  // create url from where we are getting the data using superagent API
  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;
  superAgent.get(url)
    .then(superAgentResults =>{
      console.log(superAgentResults.body[0],'line 54');

      let location = new Location(superAgentResults.body[0]);
      console.log(location);
      // try insert in table
      response.send(location);
    })
    .catch(err => console.log(err));
  // THIS WORKS PERFECT, BUT REACH FOR INFO IN A FILE INSTED USING AN API
  // //get data from geo.json file
  // let geo = require('./data/geo.json');
  // let location = new Location(geo[0], city);
  // response.send(location);
  // Get data from iqLocations using superAgent to handle the info
})

// create the Location object
function Location(obj, city){
  this.search_query = city; //TODO: toLowerCases
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


// WEATHER PART
app.get('/weather',(request, response) => {

  // obtaining the info from darkSkyAPI using superagent
  let url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.latitude},${request.query.longitude}`;
  superAgent.get(url)
    .then(superAgentResults =>{
      let arrAllweather = superAgentResults.body.daily.data.map(weatherElement =>{
        return (new Weather(weatherElement));
      });
      response.send(arrAllweather); // here is where we have to send an araray of objects
    })
    .catch(err => console.log(err));

  // this ways return info from a json 
  // let weatherData = require('./data/darksky.json'); //get the info from the json file
  // if ((weatherData === '') || (weatherData === null))
  //   throw 'Not a valid weather';   
  // let arrAllweather = weatherData.daily.data.map(weatherElement =>{
  //   return (new Weather(weatherElement));
  // });

  // response.send(arrAllweather); // here is where we have to send an araray of objects
})

// create the Location object
function Weather(obj){
  this.time = new Date(obj.time * 1000).toString().slice(0, 15);
  this.forecast = obj.summary;
}


//TRAILS PART
app.get('/trails',(request, response) => {
  let url =`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=10&key=${process.env.TRAIL_API_KEY}`;
  superAgent.get(url)
    .then(superAgentResults => {
      let arrAllTrails = superAgentResults.body.trails.map(trail => new Trail(trail));
      response.status(200).send(arrAllTrails);
    })
    .catch(err => {
      console.log(err)
      response.status(500).send(err);
    });
})

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = new Date(obj.conditionDate).toString().slice(0, 15);
  this.condition_time = new Date(obj.conditionDate).toString().slice(16,25);
}


// function getCityInfo(city){
//   var sql = `SELECT * FROM locations WHERE search_query = '${city}';`;
//   console.log(sql);
//   return client.query(sql);
//   // return client.query(sql).then().catch();
// }



//start the server. if is on, :. turn on port to listeting
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