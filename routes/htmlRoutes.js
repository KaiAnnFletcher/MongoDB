var db = require("../models");

module.exports = function(app) {
    //Load index page
    app.get("/", function(req, res) {
        db.Article.find({}).then(function(dbArticles) {
            res.render("index", {
            articles: dbArticles
            });
        })
    });
// Load Article page and pass in an article by user id
app.get("/populateduser/:id", function(req, res) {
    db.Article.findOne({ where: { id: req.params.id } }).then(function(dbArticle) {
        res.render("article", {
            article: dbArticle
        });
    });
});

//Load comments page
app.get("/comments", function(req, res) {
    db.Comment.find({}).then(function(dbComment) {
        res.render("comment", {
            comments:dbComment
        });
    })
});

//Load User profile page
app.get("/user", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
        res.render("user", {
            user: dbUser
        });
    });
});

// Render 404 page for any unmatched routes
app.get("*", function(req, res) {
    res.render("404");
  });
}

 
