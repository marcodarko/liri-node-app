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

// logs input history
writeRecord(command, yourRequest);
// take in args for eval
executeCommand(command, yourRequest);

// main function that calls on the right functions depending on command
function executeCommand(command, yourRequest){
	// depending on what the first arg is we will call the appropiate function
	// use index 0 to choose appropiate method
	switch(command) {

	// use index 1 to pass to the corresponding function
	    case "my-tweets":
	        getMyTweets();
	        break;
	    case "spotify-this-song":
	        getMySong(yourRequest);
	        break;
	    case "movie-this":
	        getMyMovie(yourRequest);
	        break;
	    case "do-what-it-says":
	    	getRandom();
	    	break;
	    	// if nothing matches
	    default:
	        console.log("Ooops! Something went wrong!");
	        console.log("---AVAILABLE COMMANDS:------");
	        console.log("my-tweets");
	        console.log("spotify-this-song");
	        console.log("movie-this");
	        console.log("do-what-it-says");
	};

};

// random will read a file and pick a random action
function getRandom(){

	// The code will store the contents of the reading inside the variable "data"
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // Then split it into an array by commas (to make it more readable)
	  var dataArr = data.split(",");

	  // pick a random index of array 
	  var commandChosen = dataArr[Math.floor(Math.random() * dataArr.length)];

	  commandChosen= String(commandChosen);
	  console.log("Random Command Chosen: "+ commandChosen);

	  executeCommand(commandChosen);

	});

};


// writes to a txt file the successful commands executed 
function writeRecord(comm, req){

	fs.appendFile("requestLog.txt", "INPUT-"+"C: "+comm+", R: "+req+".  ", function(err) {

  // If the code experiences any errors it will log the error to the console.
  if (err) {
    return console.log(err);
  }

  // Otherwise, it will print: "movies.txt was updated!"
  console.log("requestLog.txt was updated!");

});
}


// gets latest tweets using index 1 as arg
function getMyTweets(){

	// gets keys from eported keys from keys.js
	// keys are in an object of the same name so use dot notation and name to access them from exports
	var client = new twitter(twitterKeys.TKeys);

	// console.log("client is: "+ JSON.stringify(client, null, 2));
	 
	var params = {screen_name: 'artofmarco', count: '20'};


	client.get('statuses/user_timeline', params, function(error, tweets, response) {

	  if (!error) {
	  	console.log("-----------MY TWEETS RESULTS--------------");
	  	//console.log(tweets[0]);
	  	for(i=0; i< tweets.length; i++){
	  		console.log(" ");
		    console.log(tweets[i].user.name+ "- @"+ tweets[i].user.screen_name);
		    
		    // if regular tweet exists
		    if(tweets[i].text){
		    	console.log("Tweeted:");
			    console.log(tweets[i].text);
			    console.log(" * * * *");
			}else{
				// else look for retweet and look for text
				console.log("Re-Tweeted:");
				console.log(tweets[i].retweeted_status.text);
				console.log(" * * * *");
			}
	    };
	    
	  }
	});

};



// Passing index 1 as arg we search for a song
function getMySong(yourSong){

	// if no song was provided
	if(yourSong=== null){
		yourSong= "The Sign";
	}

	spotify.search({ type: 'track', query: yourSong, limit: "1"}, function(err, data) {

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

	if(typeof yourMovie === "undefined" || null){
		yourMovie= "Free Willy";
	}

	// encode arg ready to be used in URL
	yourMovie= encodeURIComponent(yourMovie);
	console.log("encoded movie name: "+ yourMovie);

	var queryUrl = "http://www.omdbapi.com/?t=" + yourMovie + "&y=&plot=short&r=json&tomatoes=true";

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







