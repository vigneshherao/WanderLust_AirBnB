const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const {listingValidate} = require("../schemaValidation.js");
const {isLoggedIn} = require("../middleware/isLoggedIn.js")

const serverValidate = (req,res,next)=>{
    let {error} = listingValidate.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}

router.get("/",wrapAsync(async(req,res)=>{
    let datas = await Listing.find();
    res.render("listing/index.ejs",{datas});
}));

router.get("/show/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data =await Listing.findById(id).populate("reviews");
    if(!data){
        req.flash("error","This Listing is does not exit!");
        res.redirect("/listing");
    }
    res.render("listing/show.ejs",{data});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listing/new.ejs");
})

router.post("/",isLoggedIn,serverValidate ,wrapAsync(async(req,res,next)=>{
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("sucess","New villa has be created");
    res.redirect("/listing");
}))

router.get("/edit/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let data =await Listing.findById(id);
    if(!data){
        req.flash("error","This Listing is does not exit!");
        res.redirect("/listing");
    }
    res.render("listing/edit.ejs",{data})
}));

router.put("/edit/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new expressError(400,"Please add valid data!");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("sucess","Villa has been updated!");
    res.redirect("/listing");
}));


router.delete("/delete/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess","Villa has been Deleted!");
    res.redirect("/listing");
}));

module.exports = router;

