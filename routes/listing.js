const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js")
const expressError = require("../utils/expressError.js")
const {listingValidate} = require("../schemaValidation.js");

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
    res.render("listing/show.ejs",{data});
}));

router.get("/new",(req,res)=>{
    res.render("listing/new.ejs");
})

router.post("/", serverValidate ,wrapAsync(async(req,res,next)=>{
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("sucess","New villa has be created");
    res.redirect("/listing");
}))

router.get("/edit/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let data =await Listing.findById(id);
    res.render("listing/edit.ejs",{data})
}));

router.put("/edit/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new expressError(400,"Please add valid data!");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
}));


router.delete("/delete/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports = router;

