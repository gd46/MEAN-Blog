var bodyParser = require('body-parser'),
  BlogPost = require('../models/blogPost'),
  config = require('../../config.js');


module.exports = function(app, express){
  var apiRouter = express.Router();

  // apiRouter.use(function(req,res,next){
  //   console.log('Somebody just came to our app');
  //   next();
  // });

  apiRouter.get('/', function(req, res){
    res.json({
      message: 'Welcome to api'
    });
  });

  apiRouter.route('/blog')
    .post(function(req,res){
      var post = new BlogPost();
      post.title = req.body.title;
      post.caption = req.body.caption;
      post.description = req.body.description;

      post.save(function(err){
        if(err){
          return res.json({
            success: false,
            message: 'Failed to create blog post, error status ' + err
          });
        }
        res.json({
          message: 'Sucessfully created blog post'
        })
      });
    });

  return apiRouter;
}