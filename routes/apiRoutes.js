var db = require("../models");

module.exports = function(app) {
    //Get all articles
    app.get("/api/articles", function(req, res) {
        db.Article.findAll({}).then(function(dbArticles) {
            res.json(dbArticles);
        });
    });


    //Create a comment
    app.post("/api/comments", function(req, res){
        db.Comment.create(req.body).then(function(dbComment) {
            res.json(dbComment);
        });
    });

    //Get all comments tied to user ID
    app.get("/api/comments", function(req,res){
        db.Comment.findAll({ where: { id: req.params.id } }).then(function(dbComment) {
            res.json(dbComment)
        });
    });

    //Get user by ID
    app.get("/api/users", function(req,res){
        db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
            res.json(dbUser)
        });
    });
    
};