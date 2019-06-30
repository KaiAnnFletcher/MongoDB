var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(mongoDB_URI);

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var axios = require("axios");
var cheerio = require("cheerio");

//require the models also
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

//Configure the morgan middleware
//The morgan logger will be used for logging requests 
//using the dev format
//Concise output colored by response status for development use. 
//The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(logger("dev"));

//The request body must be parsed as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Direct express to static folder
app.use(express.static("public"));

//Using mongoose connect to the MongoDB
mongoose.connect("mongodb://localhost/NewsGuard", {useNewUrlParser: true});

//Now to configure the routes

app.get("/scrape", function(req, res) {
//Grab the html body with axios    
axios.get("https://www.newsguardtech.com/press/").then(function(response) {
//Load to cheerio and save to $ selector
var $ = cheerio.load(response.data);
//Now we need to grab the title reference for each article
$(".pub-date").each(function(i, element) {
    console.log(element)
//save empty result object
var result = {};

//Add summary text and the href of every link

result.title = $(this)//For this website the title will be the link text minus the link attribute
    .children("a")
    .text();

result.link = $(this)
    .children("a")
    .attr("href");

//Create a new article  using the "result" object built via scraping
db.Article.create(result)
    .then(function(dbArticle) {
     //View the result in the console
     console.log(dbArticle);
    })
    .catch(function(err) {
    //If there is an error, log it also
    // console.log(err);    
    });
});

//Send client message
res.send("Scrape Complete");
});

});

//Now we need a route to save unique users to the db
//Have a unique rule in the user schema which will prevent duplicate users
db.User.create({name:""})
    .then(function(dbUser) {
        console.log(dbUser);
    })
    .catch(function(err) {
        console.log(err.message);
    });

//Getting the articles that are now in the db

app.get("/articles", function(req, res) {
// Grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle){
        
            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        })
});

//For when users are submitting comments which will then be saved to the db

app.post("/submit", function(req, res) {
//create a new comment in the db
db.Comment.create(req, body)
    .then(function(dbComment) {

    return db.User.findOneAndUpdate({}, { $push: { notes: dbComment._id } }, { new: true });

})
.then(function(dbUser) {

    res.json(dbUser);
})
.catch(function(err) {

    res.json(err);
});

});

//Need a route to repopulate the page witht the comment after it is submitted and saved

//
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});






