const Listing = require("../models/listing.js");
const User = require("../models/user");



module.exports.index = async (req,res)=>{
    const allListings = await  Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }

 module.exports.renderNewForm = (req,res)=>{
     
    res.render("listings/new.ejs");

}


module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate({path:"review",populate:{ path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res, next)=>{

    let url = req.file.path;

    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    console.log(newListing);

    console.log("Property type is ",req.body.listing.type);


    newListing.owner = req.user._id;

    newListing.property = req.body.listing.type;

    newListing.housingtype = req.body.listing.housingtype;

    newListing.image = {url, filename};
    
    await newListing.save();

    req.flash("success","New Listing Created");

    res.redirect("/listings");
  }

  module.exports.renderEditForm =  async (req,res)=>{
    
    let {id} = req.params;
    const listing  = await Listing.findById(id);

    console.log(listing);

    console.log("listing property is: ",listing.property );

    if(!listing){
    req.flash("error","Listing you requested for does not exist !");
    res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;

    originalImageUrl = originalImageUrl.replace("/uploads","/uploads/h_300,w_250");

    res.render("listings/edit.ejs",{listing, originalImageUrl});

    }

module.exports.updateListing =  async(req,res)=>{
    
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!== "undefined"){

        let url = req.file.path;

        let filename = req.file.filename;
    
        listing.image = {url, filename};

        await listing.save();

    }

    req.flash("success"," Listing Updated");
    console.log("updated listing property is",listing.property);
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}


//seacrh

module.exports.searchFunction = async(req, res)=>{

    let {destination} = req.params;
    console.log("Destination to search:",destination);
    let myListing = await Listing.find(
        
    {
            "$or":[
                {"location":{$regex:destination}}
            ]
        }
    );
    res.render("listings/destination.ejs", {myListing});
}

module.exports.housingtype = async(req, res)=>{
    let {housingtype} = req.params;
    console.log("the housingtype is",housingtype);
    let housingtype1 = await Listing.find(
        {
            "$or":[
                {"housingtype":{$regex:housingtype}}
            ]
        }
    );
    res.render("listings/housingtype.ejs",{housingtype1});
}



