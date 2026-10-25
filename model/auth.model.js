import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
     email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
     password : {
        type : String,
        required : true,
    },
    domain : {
        type : String,
        trim : true
    },
    skills : [{
        type : String,
        trim : true,
    }],
    files:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"File",
            required : true
        }
    ]

}, {timestamps : true})

const User = mongoose.model("User", userSchema)
export default User