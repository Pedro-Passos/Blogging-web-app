// jshint esversion:6
// requiring dependencies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// dummy starting content for the home, about and contact page
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// setting up Express Middleware with ejs , body-parser
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// opening a connection to mongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});
// defining the schema
const postsSchema = { title: String, content: String};
// creating a model
const Post = mongoose.model("Post", postsSchema);

// home route rendered with starting content and posts 
app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts
    });
  })
});

// dynamic route generated whenever a "Read More" link is selected
app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  // looking through posts for a post with the matching id
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

// about route rendered with starting content
app.get("/about", function(req, res){
  res.render("about", {startingContent: aboutContent});
});

// contact route rendered with starting content
app.get("/contact", function(req, res){
  res.render("contact", {startingContent: contactContent});
});

// the "hidden" compose route rendered only when manually entered into the addresss bar and allowed for creation of posts
app.get("/compose", function(req, res){
  res.render("compose");
});

// post route for /compose triggered from the publish button
app.post("/compose", function(req, res){
  // creating a new post
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  // saving the post
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });   
});

// listening for connections on the specified port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});