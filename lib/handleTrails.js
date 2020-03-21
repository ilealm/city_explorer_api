
'use strict';

const superAgent = require('superagent');
require('dotenv').config();

function handleTrails(request,response) {
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
}

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

module.exports = handleTrails;