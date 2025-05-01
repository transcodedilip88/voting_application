const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String},
    age:{type:Number},
    email:{type:String},
    password:{type:String},
    mobile:{type:Number},
    address:{type:String},
    aadharCardNumber:{type:Number},
    twoFactorAuthCode:{type:Number,default:null},
    role:{type:String,enum:['Voter','Super admin'],default:'Voter'},
    isVoted:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false},
    deviceType:{type:Number},
    deviceToken:{type:String}
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)