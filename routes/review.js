const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const {reviewSchema} = require("../schemaValidation.js");

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
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`http://localhost:8080/show/${listing._id}`);
}));

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    let result = await Review.findByIdAndDelete(reviewId);
    res.redirect(`http://localhost:8080/show/${id}`);
   
}))

module.exports = router;