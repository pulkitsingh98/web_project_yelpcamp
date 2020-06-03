var express = require("express");
var router = express.Router();

var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middleware = require("../middleware");


//================================================
//---------------COMMENTS ROUTES------------------
//================================================


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn ,function(req,res){
	// find the campground by the id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground: campground});
		}
	});
});
router.post("/campgrounds/:id/comments", middleware.isLoggedIn ,function(req,res){
	//look up campground by the id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","somethiing went wrong..!!")
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save(); 
					campground.comments.push(comment);
					campground.save();
					req.flash("success","comment created..!!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//create new comment and save it
	
	// redirect to show page shoing the new comments
});

//edit comment router
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
});
//update comment router
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//to destroy a comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success","comment deleted..!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//importing middleware



module.exports = router;