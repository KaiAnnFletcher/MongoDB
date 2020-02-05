var express = require("express");
const router = require("express").Router();
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");

//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://kaiann.fletcher%40mail.utoronto.ca:JoyPhi48*@ds345587.mlab.com:45587/heroku_r87w3qr6";
//mongoose.connect(MONGODB_URI);

// Our scraping tools                                                                                                                                                                                                                                                                                          ````````````````````````````````````````````````````````````````````      
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var axios = require("axios");
var cheerio = require("cheerio");

//require the models also
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();
//var collections = ["scrapedData"];
//Configure the morgan middleware
//The morgan logger will be used for logging requests 
//using the dev format
//Concise output colored by response status for development use. 
//The status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
//The request body must be parsed as JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//Direct express to static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

  // Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

//Using mongoose connect to the MongoDB
const connect = async function () {
    //const uri = combineDbURI();
    //console.log(`Connecting to DB - uri: ${uri}`)
    return mongoose.connect("mongodb://kaiann.fletcher%40mail.utoronto.ca:JoyPhi48*@ds345587.mlab.com:45587/heroku_r87w3qr6", {useNewUrlParser: true});
};

//Call it with an async function using await

(async () => {
    try {
        const connected = await connect();
        console.log("connected");
    } catch(e) {
        console.log('Error happened while connecting to the DB: ', e.message)
    }
}) ();
console.log("test");
//Now to configure the routes

app.get("/scrape", function(req, res) {
    res.render("index", function(err) {
        if(err) {
            res.status(500).send(err)
            console.log("500 error");
        }
    });
})

console.log("scraping all data");
//Grab the html body with axios    
axios.get("https://news.ycombinator.com/").then(function(response) {
//Load to cheerio and save to $ selector
var $ = cheerio.load(response.data);

//Now we need to grab the title reference for each article
$(".title").each(function(i, element) {
    console.log(element)
//save empty result object
var result = {};

//Add summary text and the href of every link

result.title = $(element)//For this website the title will be the link text minus the link attribute
    .children("a")
    //.children("a")
    .text();

result.link = $(element)
    .children("a")
    //.children("a")
    .attr("href");

    // If this found element had both a title and a link
    if (result.title && result.link) {
        // Insert the data in the scrapedData db
        db.Article.create({
          title: result.title,
          link: result.link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }

    // if (result.title !== '') {
    //     result.linkid = result.link.match(/\d{4,6}/g)[0];
    //     const promise = News
    //     .findOneAndUpdate(result, result, {upsert:true, new:true})
    //     promises.push(promise);
    //     // .then(dbModel => output.push(dbModel));
    //   }
    // });
    // Promise.all(promises).then((data) => {
    //   res.json(data)
    // })

//Create a new article  using the "result" object built via scraping
// db.Article.create(result)
//     .then(function(dbArticle) {
//      //View the result in the console
//      console.log(dbArticle);
//     })
//     .catch(function(err) {
//     //If there is an error, log it also
//     // console.log(err);    
//     });
});

//Send client message
//res.send("Scrape Complete");



//Now we need a route to save unique users to the db
//Have a unique rule in the user schema which will prevent duplicate users
// db.User.create({})
//     .then(function(dbUser) {
//         console.log(dbUser);
//     })
//     .catch(function(err) {
//         console.log(err.message);
//     });

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
})