const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },

});

const Comments = mongoose.model('Comments', commentSchema );

module.exports = Comments;