const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public/css")));



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
    console.log(data)
})


app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
})

app.post("/listing",(req,res)=>{
    let listing =  new Listing(req.body.listing);
    listing.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/");

})