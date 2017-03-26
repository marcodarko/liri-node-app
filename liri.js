// links packages to this file
var spotify= require('spotify');
var request= require('request');
var twitter= require('twitter');
var fs= require('fs');
var twitterKeys = require('./keys.js');

// store the input arguments
var inputArguments= process.argv;
// slice out the first and second args and keep the rest, start from index 2
inputArguments = inputArguments.slice(2);

// separating result to evaluate what we need to do, command & request
var command = inputArguments[0];
var yourRequest= inputArguments.slice(1);

// depending on what the first arg is we will call the appropiate function
// use index 0 to choose appropiate method
switch(command) {

// use index 1 to pass to the corresponding function
    case "my-tweets":
        getMyTweets(yourRequest);
        break;
    case "spotify-this-song":
        getMySong(yourRequest);
        break;
    case "movie-this":
        getMyMovie(yourRequest);
        break;
        // should nothing match
    default:
        console.log("Ooops! Something went wrong!");
};


// gets latest tweets using index 1 as arg
function getMyTweets(yourRequest){

	// gets keys from eported keys from keys.js
	var client = twitterKeys;
	 
	var params = {screen_name: 'artofmarco'};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {

	  if (!error) {
	  	console.log("-----------MY TWEETS RESULTS--------------");
	  	console.log(" ");
	    console.log(tweets);
	    console.log(" ");
	    
	  }
	});

};



// Passing index 1 as arg we search for a song
function getMySong(yourSong){

	spotify.search({ 

		type: 'track', 
		query: yourSong, 
		limit: "1", 

	}, function(err, data) {

    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 	
 	data = JSON.stringify(data, null, 2);
 	console.log("-------------MY SONG RESULTS--------------");
	console.log(" ");
 	console.log("raw response from song:"+ data);
    console.log(" ");
	
});

};


// using request package we communicate with OMDB to get movie info
function getMyMovie(yourMovie){

	// encode arg ready to be used in URL
	yourMovie= encodeURIComponent(yourMovie);
	console.log("encoded movie name: "+ yourMovie);

	var queryUrl = "http://www.omdbapi.com/?t=" 
	+ yourMovie 
	+ "&y=&plot=short&r=json&tomatoes=true";

	request(queryUrl, function(error, response, body) {

	// If the request is successful
	 if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("-------------MY MOVIE RESULTS--------------");
	console.log(" ");
	console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("Rating: " + JSON.parse(body).Rated);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
    console.log("Rotten Tomatoes Meter: " + JSON.parse(body).tomatoMeter);
    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

    console.log(" ");
    // response test
    //console.log("Title: " + JSON.stringify(body, null, 2));
	
  }
});

};







