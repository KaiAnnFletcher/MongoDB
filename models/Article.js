var mongoose = require("mongoose");

//Save a schema constructor reference
var Schema = mongoose.Schema;

//Using the Schema constructor, create a new UserSchema object

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    //summary: {
        //type: String,
        //required: true
    //},

    link: {
        type: String,
        required: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;