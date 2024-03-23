const mongoose = require("mongoose");
const Review = require("./reviews.js")
const Schema =  mongoose.Schema;


const listingSchema = new Schema({
    title:{
    type:String,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    property:{
        type:String,
        required:true,
    },
    housingtype:{
       type: String,
       required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:String,
     review:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
         ref:"User"
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
      if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});
      }
})

const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;