'use strict';

const superAgent = require('superagent');

//MOVIES PART
function handleMovies(request,response) {
  let city = request.query.search_query;
  let url =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;
  superAgent.get(url)
    .then(superAgentResults =>{
      let movieArray = superAgentResults.body.results;
      let returnMovieArray = movieArray.map(movie => {
        return new Movies(movie);
      })
      response.status(200).send(returnMovieArray.slice(0,20));
    })
    .catch(err =>{
      console.log(err);
      response.status(500).send(err);
    });
}

function Movies(obj){
  this.title = obj.original_title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = 'https://api.themoviedb.org/3' + obj.poster_path; //: '/w4oiwXS03JFyK1frv7az9ERDinn.jpg', TODO: FIX PATH
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

module.exports = handleMovies;
