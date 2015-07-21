var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String,
    unique: true,
  },
  firstname: String,
  lastname: String,
  posts: {
    type: Schema.ObjectId,
    ref: 'BlogPost'
  }
});

module.exports = mongoose.model('User', UserSchema);