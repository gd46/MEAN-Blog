// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user');

passport.use(new LocalStrategy(User.createStrategy()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());