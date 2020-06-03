var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");



router.get("/",function(req,res){
    //res.render("landing");
	//res.alert("yaha tak to theek hai");	
	res.render("landing");
});



//=========================================
//---------AUTHENTICATION ROUTES-----------
//=========================================



//show regiter from
router.get("/register",function(req,res){
	res.render("register");
});
//handle signup logic
router.post("/register",function(req,res){
	//res.send("signing you up.....")
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			//popup.alert( {content: 'Hello!'} ) ;
			console.log(err);
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","welcome to yelpcamp " + user.username + "..!!" );
			res.redirect("/campgrounds");
		});
	});
});

//show login from
router.get("/login",function(req,res){
	res.render("login");
});
//handle login request
router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}) ,function(req,res){
	//res.send("logging you in...");
});

// logout route logic
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out..!!");
	res.redirect("/campgrounds");
});




module.exports = router;