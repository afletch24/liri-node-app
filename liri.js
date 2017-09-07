var tkeys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");

var consumerKey = tkeys.twitterKeys.consumer_key;
var consumkerSecret = tkeys.twitterKeys.consumer_secret;
var token = tkeys.twitterKeys.access_token_key;
var tokenSecret = tkeys.twitterKeys.access_token_secret;

var client = new Twitter(tkeys.twitterKeys)
var spotify = new Spotify(tkeys.spotifyKeys);

var action = process.argv[2];
var nodeArgs = process.argv;


var itemName = "";

for(var i=3; i < nodeArgs.length; i++){
    if(i > 2 && i <nodeArgs.length){
        itemName= itemName + "+" + nodeArgs[i];
    }
    else{
        itemName += nodeArgs[i];
    }
}



// ****Print out the keys*****
// console.log("Consumer Key: "+ consumerKey);
// console.log("Consumer Secret: " + consumkerSecret);
// console.log("Token: " + token);
// console.log("Token Secret: " + tokenSecret);
// console.log("Spotify id: " + tkeys.spotifyKeys.id);
// conso le.log("Spotify secret: " + tkeys.spotifyKeys.secret);

switch (action) {
  case "my-tweets":
    tweet();
    break;

  case "spotify-this-song":
    spotSong();
    break;

  case "movie-this":
    movieRequest();
    break;

  case "do-what-it-says":
   console.log("do what it says test");
   doThis();
    break;
}

// Twitter
function tweet(){
    var params = {screen_name: '@A_Smo24', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i=0; i < tweets.length; i++){
                console.log(tweets[i].user.screen_name);
                console.log("'" + tweets[i].text + "'");
                console.log("Tweet created at: " + tweets[i].created_at);
                console.log("---------------------------------");
            }
        }
    }); 
};

function spotSong(){
    if(!itemName){
        itemName= "The "+"Sign";
    }
    spotify.search({ type: 'track', query: itemName }, function(err, data) {
       console.log("Hi " + itemName);
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            if (!data.tracks.items.length) {
                console.log('not found')
            }
            for(var i=0; i < data.tracks.items.length; i++){
                console.log("--------------------------------------------");
                console.log("Track Name: " + data.tracks.items[i].name); 
                console.log("Artist: " + data.tracks.items[i].artists[0].name); 
                console.log("Album: " + data.tracks.items[i].album.name); 
                console.log("Preview Link: " + data.tracks.items[i].href); 6 
            }
        }
    });
}



// Movies
function movieRequest(){
    if(!itemName){
        itemName = "Mr."+"Nobody";
    }  
    
    var queryUrl = "http://www.omdbapi.com/?t=" + itemName + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body){
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year Released: " + JSON.parse(body).Year);
        console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    });   
};

function doThis(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            return console.log("error");
        }
        else{
            var dataArr = data.split(",");
            var action= (dataArr[0]);
            itemName= (dataArr[1]);
            console.log(dataArr[0]);
            console.log(dataArr[1]);

            switch (action) {
                case "my-tweets":
                    tweet();
                    break;

                case "spotify-this-song":
                    spotSong();
                    break;

                case "movie-this":
                    movieRequest();
                    break;

                case "do-what-it-says":
                    doThis();
                    break;
            }
        }
     });
};