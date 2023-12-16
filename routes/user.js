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
  wrapAsync(async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const createdUser = await User.register(newUser, password);
      req.login(createdUser,(err)=>{
        if(err){
          next(err);
        }
        req.flash("sucess", "Welcome to WanderLust!");
        res.redirect("/listing");
      })
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
    let name = req.user.username;
    req.flash('sucess',`Welcome to wanderlust ${name} !`);
    res.redirect("/listing");
  });


  router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }

      req.flash("sucess","logged out sucessfully!");
      res.redirect("/listing");
    })
  })


module.exports = router;
