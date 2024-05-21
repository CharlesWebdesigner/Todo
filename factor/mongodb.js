const mongoose=require("mongoose");
const dotenv=require("dotenv")
dotenv.config()
const mongoUrl=process.env.Mongo_url
const mongodb=()=>{
    mongoose.connect(mongoUrl).then((run)=>{
        console.log("database is running")
    }).catch(()=>console.log("Database connection error"))
}
module.exports=mongodb