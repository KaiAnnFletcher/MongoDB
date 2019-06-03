var mongoose = require("mongoose");

var schema = mongoose.Schema;

var CommentSchema = new SChema({

    title: String,

    body: String,
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;