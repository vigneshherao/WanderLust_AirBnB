const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { listingValidate } = require("../schemaValidation.js");
const {reviewSchema} = require("../schemaValidation.js");
const expressError = require("../utils/expressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you need to be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.addListCheck = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list.owner.equals(res.locals.isLogged._id)) {
    req.flash("error", "This is not Accesable!");
    res.redirect(`/listing`);
  }
  next();
};

module.exports.serverValidate = (req, res, next) => {
  let { error } = listingValidate.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.isLogged._id)) {
    req.flash("error", "Permission to delete for Author's only!!");
    return res.redirect(`/listing/show/${id}`);
  }
  next();
};
