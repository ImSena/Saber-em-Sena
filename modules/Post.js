const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    subtitle:{
        type: String,
        require: true,
    },
    content: {
        type: Array,
        require: true,
    }
});

const Post = mongoose.model('Posts', PostSchema);

module.exports = Post;