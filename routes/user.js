const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware/isLoggedIn.js");
const userController = require("../controller/userController.js");

router.get("/signup",userController.render);

router.post(
  "/signup",
  wrapAsync(userController.createUser)
);

router.get("/login", userController.loginRender);

router.post(
  "/login",savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginPost
);

router.get("/logout", userController.renderLogoutForm);

module.exports = router;
