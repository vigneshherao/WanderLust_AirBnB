const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const {reviewSchema} = require("../schemaValidation.js");
const {isLoggedIn} = require("../middleware/isLoggedIn.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}

//Reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    req.flash("sucess","New Review has been created");
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/show/${listing._id}`);
    
}));

router.delete("/:reviewId",isLoggedIn,wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    let result = await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted!");
    res.redirect(`/listing/show/${id}`);
   
}))

module.exports = router;