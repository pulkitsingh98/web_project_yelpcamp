var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var Campground      = require("./models/campgrounds");
var Comment         = require("./models/comment");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var User 			= require("./models/user"); 
var seedDB          = require("./seed");
var methodOverride  = require("method-override");
var flash           = require("connect-flash");

var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");


// seedDB();  //for seeding the databse
//----------------------------------------------------------------------------------------------------------------------
//------------connecting to atlas using environment variables-----------------------------------------------------------
mongoose.connect(process.env.DATABASEURL);
//----------------------------------------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------------------------------------
//-------- HEROKU + ATLAS app db URL , use it for uploading code to heroku----------------------------------------------
// mongoose.connect("mongodb+srv://adminpulkit:pulkit123@yelpcamp-0f4qw.mongodb.net/yelpcamp?retryWrites=true&w=majority",{
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("connected to db..!!");
// }).catch(err => {
// 	console.log("ERROR! ",err.message);
// });
//----------------------------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------------
//------ use this localhost URL if you r working locally use it---------------------------------------------
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
//----------------------------------------------------------------------------------------------------------




mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
//PASSPORT CONFRIGUATION
app.use(require("express-session")({
	secret: "i'm well determined to finish all this shithy course...!!!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware to make currentUser user variable availabe on each and every template
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);

//writing this just to test git



app.listen(3000,process.env.IP, function() { 
  console.log('the yelpcamp server has started!!!!!'); 
});
