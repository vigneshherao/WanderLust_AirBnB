const Review = require("../models/review.js");
const Listing = require("../models/listing");


module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    req.flash("sucess","New Review has been created");
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/show/${listing._id}`);  
};


module.exports.destroyReview = async (req,res)=>{
    let{id,reviewId} = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
    let result = await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted!");
    res.redirect(`/listing/show/${id}`);
   
};