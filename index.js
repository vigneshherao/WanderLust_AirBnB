const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require('method-override')
const engine = require('ejs-mate');
const { hostname } = require("os");
const wrapAsync = require("./utils/wrapAsync.js")
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'))


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


main().then(()=>{
    console.log("wanderlust database connection is successfull");
})


app.listen(port,()=>{
    console.log(`server is started with port number ${port}`);
})

app.get("/",async(req,res)=>{
    let datas = await Listing.find();
    res.render("listing/index.ejs",{datas});
})


app.get("/show/:id",async (req,res)=>{
    let {id} = req.params;
    let data =await Listing.findById(id);
    res.render("listing/show.ejs",{data});
})

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
})

app.post("/listing",wrapAsync(async(req,res,next)=>{
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/");
}))



app.get("/listing/edit/:id",async(req,res)=>{
    let {id} = req.params;
    let data =await Listing.findById(id);
    res.render("listing/edit.ejs",{data})
})



app.put("/listing/edit/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/");
})


app.delete("/listing/delete/:id",async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/");
})


app.use((err,req,res,next)=>{
    res.send(err.message);
})