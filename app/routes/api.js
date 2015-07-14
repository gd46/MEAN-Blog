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

    // Create a blog post
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