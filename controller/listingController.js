const Listing = require("../models/listing");
const expressError = require("../utils/expressError.js");

module.exports.index = async (req, res) => {
    let datas = await Listing.find();
    res.render("listing/index.ejs", { datas });
  };

module.exports.renderListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!data) {
      req.flash("error", "This Listing is does not exit!");
      res.redirect("/listing");
    }
    res.render("listing/show.ejs", { data });
  };

module.exports.renderNewForm =  (req, res) => {
    res.render("listing/new.ejs");
  };

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};
    await listing.save();
    req.flash("sucess", "New villa has be created");
    res.redirect("/listing");
  };


module.exports.fetchListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
      req.flash("error", "This Listing is does not exit!");
      res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { data });
  };

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
      throw new expressError(400, "Please add valid data!");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("sucess", "Villa has been updated!");
    res.redirect("/listing");
  };



module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Villa has been Deleted!");
    res.redirect("/listing");
  };