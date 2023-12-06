const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true

    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ",
        set: (v)=> v ===""? "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})


const Listing = mongoose.model("Listing",listingSchema);


module.exports = Listing;