const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { isLoggedIn, serverValidate } = require("../middleware/isLoggedIn.js");
const listingController = require("../controller/listingController.js");

router.get("/", wrapAsync(listingController.index));

router.get("/show/:id", wrapAsync(listingController.renderListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  serverValidate,
  wrapAsync(listingController.createListing)
);

router.get("/edit/:id", isLoggedIn, wrapAsync(listingController.fetchListing));

router.put("/edit/:id", isLoggedIn, wrapAsync(listingController.updateListing));

router.delete(
  "/delete/:id",
  isLoggedIn,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
