const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing= require("../models/listing.js");

const dbUrl = process.env.dbUrl;

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
   console.log("error is",err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"65431b8ff14b4230684d7b95",
    }))
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();