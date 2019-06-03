var mongoose = require("mongoose");

//Save reference to schema structure
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    name: {
        type: String,
        unique: true
    },

    comments: [
        {
            type: Schema.Types.ObjectId,

            ref: "Comment"
        }
    ]

});

var User = mongoose.model("User", UserSchema);

module.exports = User;