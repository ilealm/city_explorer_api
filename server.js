// libraries

// declare package to use
const express = require('express');
const app = express();

const cors =  require('cors');
app.use(cors());

// get variables from .env
require('dotenv').config();
const PORT = process.env.PORT || 3001;  // setting the listening port

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

{
  /*
  in the example on trello, the format is <> than the file
  "latitude": "47.606210",
  "longitude": "-122.332071"*/
}

// If page not found:
app.get('*',(request,response)=>{
  response.status(404).send('I could not find the page you are looking for');
});

// Turn on the server to listening
app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
})