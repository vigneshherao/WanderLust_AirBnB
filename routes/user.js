const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const createdUser = await User.register(newUser, password);
      console.log(createdUser);
      req.flash("sucess", "Welcome to WanderLust!");
      res.redirect("/listing");
    } catch (error) {
      req.flash("error", "A user with same name or email is registered!");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  async(req, res)=>{
    req.flash('sucess',"Logged in successfully!");
    res.redirect("/listing");
  });




module.exports = router;
