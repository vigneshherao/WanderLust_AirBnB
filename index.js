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
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("wanderlust database connection is successfull");
})

app.listen(port,()=>{
    console.log(`server is started with port number ${port}`);
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