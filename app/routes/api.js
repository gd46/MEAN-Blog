var bodyParser = require('body-parser'),
  BlogPost = require('../models/blogPost'),
  config = require('../../config.js');


module.exports = function(app, express){
  var apiRouter = express.Router()l

  apiRouter.get('/', function(req, res){
    res.json({
      message: 'Welcome to api'
    });
  });

  return apiRouter;
}