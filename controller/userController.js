const User = require("../models/user.js");


module.exports.render = (req, res) => {
    res.render("user/signup.ejs");
  };


module.exports.createUser = async (req, res, next) => {
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
  };

module.exports.loginRender = (req, res) => {
    res.render("user/login.ejs");
  };

module.exports.loginPost = async (req, res) => {
    let name = req.user.username;
    req.flash("sucess", `Welcome to wanderlust ${name} !`);
    let redirect = res.locals.redirectUrl || "/listing";
    res.redirect(redirect);
  };

module.exports.renderLogoutForm = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
  
      req.flash("sucess", "logged out sucessfully!");
      res.redirect("/listing");
    });
  };