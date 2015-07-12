var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var BlogPostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  caption: String,
  description: String
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);