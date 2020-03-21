'use strict';

const superAgent = require('superagent');

function handleYelp(request,response) {
  let city = request.query.search_query;
  const url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
  return superAgent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then( data => {
      let yelpArray = data.body.businesses;
      let finalYelpArray = yelpArray.map(busines => {
        return new Yelp(busines);
      })
      response.send(finalYelpArray.slice(0,20));
    });
}

function Yelp(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}

module.exports = handleYelp;
