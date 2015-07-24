var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String,
    unique: true,
  },
  firstname: String,
  lastname: String
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);