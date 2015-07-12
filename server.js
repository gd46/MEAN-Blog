var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  path = require('path'),
  mongoose = require('mongoose'),
  config = require('./config.js');


mongoose.connect(config.database);

mongoose.connection.on("connected", function(){
  console.log("Successfully connected to DB");
});

mongoose.connection.on("error", function(err){
  console.log("Failed to connect to DB" + err);
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var apiRoutes = require('./app/routes/api.js')(app, express);
app.use('/api', apiRoutes);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
console.log("Magic happens on port " + config.port);