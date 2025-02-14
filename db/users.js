const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: false,
    },
    
    password: {
        type: String,
        required: true,
    },

    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],

    profileimage: {
        type: String,
        required: false,
    }

    // sessionId: {
    //     type: String,
    //     required: true,
    // }

});

const Users = mongoose.model("users", userSchema);
module.exports = Users;

//Creating a model
// Model is a constructor that let's you interact with specific mongoDb collection
// It provides methods for CRUD operations, such as creating, reading, updating, and deleting documents.

 
// Here, we created a Blogs model that maps the userSchema to the "blogs" collection in the MongoDB database.
// Note: Mongoose automatically pluralizes and lowercases the collection name (e.g., "blogs" in this case).




