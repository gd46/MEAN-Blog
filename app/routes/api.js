var bodyParser = require('body-parser'),
  BlogPost = require('../models/blogPost'),
  jwt = require('jsonwebtoken'),
  User = require('../models/user'),
  config = require('../../config.js'),
  superSecret = config.secret

module.exports = function(app, express){
  var apiRouter = express.Router();

  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username,
    }).select('name username password').exec(function(err, user) {
      if (err) throw err;

      // No user with that user was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // Check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // If user is found and password is right

          // Create a token
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, superSecret, {
            expiresInMinutes: 1440 // Expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

  app.use(function(req, res, next) {

    // check header or url parameters or post parameters for token”
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {

          // if everything is good save the request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {

      // if there is no token return a http response
      // of 403(access forbidden) and error message

      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });

    }
  });

  apiRouter.get('/', function(req, res){
    res.json({
      message: 'Welcome to api'
    });
  });

  apiRouter.route('/users')

    .post(function(req,res){

      var user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;

      user.save(function(err){
        if(err){
          return res.json({
            success: false,
            message: 'Failed to create user ' + err
          });
        };
        res.json({
          success: true,
          message: 'Successfully created user'
        });
      });
    })

    .get(function(req, res){

      User.find(function(err, user){
        if(err){
          res.send(err);
        } else{
          res.json(user);
        }
      });
    });

  apiRouter.route('/blog')

    // Create a blog post
    .post(function(req,res){
      var post = new BlogPost();
      post.title = req.body.title;
      post.caption = req.body.caption;
      post.description = req.body.description;
      post.author = req.user;

      post.save(function(err){
        if(err){
          return res.json({
            success: false,
            message: 'Failed to create blog post, error status ' + err
          });
        }
        res.json({
          success: true,
          message: 'Sucessfully created blog post'
        })
      });
    })

    // Grab all blog posts
    .get(function(req, res){
      BlogPost.find(function(err, posts){
        if(err){
          res.send(err);
        } else {
          res.json(posts);
        }
      });
    });


  // Individual blog post routes
  apiRouter.route('/blog/:blog_id')
    .get(function(req, res){
      BlogPost.findById(req.params.blog_id, function(err, post){
        if(err) {
          res.send(err);
        } else{
          res.json(post);
        }
      });
    })

    .put(function(req, res){
      BlogPost.findById(req.params.blog_id, function(err, post){
        if(err){
          res.send(err);
        }

        if(req.body.title){
          post.title = req.body.title;
        }
        if(req.body.caption){
          post.caption = req.body.caption;
        }
        if(req.body.description){
          post.description = req.body.description;
        }
        post.save(function(err){
          if(err){
            res.send(err);
          } else{
            res.json({
              success: true,
              message: 'Successfully updated blog post'
            })
          }
        })
      })
    })

    .delete(function(req, res){
      BlogPost.remove({
        _id: req.params.blog_id
      }, function(err, post){
        if(err) return res.send(err);
        res.json({
          success: true,
          message: 'Successfully Deleted Blog Post'
        });
      });
    });

  return apiRouter;
}