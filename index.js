const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require('method-override')
const engine = require('ejs-mate');
const { hostname } = require("os");
const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require("./utils/expressError.js")
const {listingValidate,reviewSchema} = require("./schemaValidation.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js")
const session = require('express-session')
const flash = require('connect-flash');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))
app.use(session({
    secret: 'keyboardmouse',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
  }));

app.use(flash());

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("wanderlust database connection is successfull");
})

app.listen(port,()=>{
    console.log(`server is started with port number ${port}`);
})

app.use((req,res,next)=>{
    res.locals.message = req.flash("sucess");
    next();
})

app.use("/listing",listing);

app.use("/listings/:id/reviews",review);

app.get("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something error has been occured"} = err;
    res.status(statusCode).render("error.ejs",{err});
})