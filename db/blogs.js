const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: false,
    },

    username: {
        type: String,
    },
},
{ timestamps: true },
);

module.exports = mongoose.model("blogs", blogSchema);


//Syntax 2: same thing as above
// const Blog = mongoose.models.blogs || mongoose.model("blogs", blogSchema);

// module.exports = Blog;