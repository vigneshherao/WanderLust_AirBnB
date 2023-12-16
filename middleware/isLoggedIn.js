module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you need to be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
}
