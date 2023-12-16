module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you need to be logged in!");
        return res.redirect("/listing");
    }
    next();
}