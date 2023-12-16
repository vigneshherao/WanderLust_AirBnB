const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware/isLoggedIn.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const createdUser = await User.register(newUser, password);
      req.login(createdUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("sucess", "Welcome to WanderLust!");
        res.redirect("/listing");
      });
    } catch (error) {
      req.flash("error", "A user with same name or email is registered!");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    let name = req.user.username;
    req.flash("sucess", `Welcome to wanderlust ${name} !`);
    let redirect = res.locals.redirectUrl || "/listing";
    res.redirect(redirect);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }

    req.flash("sucess", "logged out sucessfully!");
    res.redirect("/listing");
  });
});

module.exports = router;
