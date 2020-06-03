var express = require("express");
var router = express.Router();

var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middleware = require("../middleware");//we could have write index.js also but it is a special name i.e. in requireing the middleware directory it will automatically look for index.js file in it . this is same fro each and every directory.
//INDEX - to show all campgrounds
router.get("/",function(req,res){
	 
    Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log("aaaaaaaaaaaa gyi ererrrrr");
		}
		else{
			res.render("campgrounds/index",{camp:allCampgrounds});
		}
	});
});

//CREATE - to add a new campground to the campground array
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to the array of the campgrounds
	var name   = req.body.name;
	var price  = req.body.price;
	var image  = req.body.image;
	var des    = req.body.description;
    var author = {
		id       : req.user._id,
		username : req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: des,author: author};
	//console.log(req.user);
	//create a new capmground and add to database
	Campground.create(newCampground,function(err,allCampgrounds){
		if(err){
			console.log("aaaaaaaaaaaa gyi ererrrrr");
		}
		else{
			//return back to the campground page 
			console.log(allCampgrounds);
			res.redirect("/campgrounds");
		}
	});
	
	
	//console.log("you hit the post route");
});

//NEW - to create  new campgrounds
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW - to show more info about the campgrounds
router.get("/:id",function(req, res){
	//find the campgrou9nd with the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else {
			console.log(foundCampground);	
			res.render("campgrounds/show", {camp: foundCampground});
			
		}
	});	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
// foundCampground.author.id is a mongoose object and req.user._id is a string hence they look identical when printed but in fict they are not identical..!!
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update correct campground 
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success","campground updated successfully...!!!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere ( show page )
});

//DESTROY CAMPGROUND ROUTES
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//res.send("you are trying to chdelete something..!!");
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success","campground deleted..!!")
			res.redirect("/campgrounds");
		}
	});
});






//importing middleware




module.exports = router;