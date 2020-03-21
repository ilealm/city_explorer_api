'use strict';

const client = require('./client');
require('dotenv').config(); //here we dont asing it to a variable :. we dont interact w. it. Just use it
const superAgent = require('superagent');


function handleLocation(request, response) {
  let city = request.query.city.toLowerCase();
  if ((city === '') || (city === null))
    throw 'Not a valid city';
  // console.log('You requested on city: ', city);


  var sql = 'SELECT * FROM locations WHERE search_query =$1';
  let safeValues = [city];
  client.query(sql,safeValues)
    .then(results =>{
      if (results.rows.length>0) {
        console.log ('I found the city on the data base');
        response.send(results.rows[0]);
      }
      else
      {
        let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;
        superAgent.get(url)
          .then(superAgentResults =>
          {
            let location = new Location(superAgentResults.body[0],city);
            sql = 'INSERT INTO locations (search_query, formatted_query, latitude,longitude) VALUES ($1, $2, $3, $4);';
            safeValues = [location.search_query, location.search_query, location.latitude, location.longitude];
            client.query(sql,safeValues);
            response.status(200).send(location);
          })
          .catch(err => console.log(err));
      }
    })
}


function Location(obj, city){
  this.search_query = city;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

module.exports = handleLocation;
