const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name:{type:String},
    party:{type:String},
    age:{type:Number},
    email:{type:String},
    isDeleted:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false},
    votes:{type:Number,default:0},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
},{timestamps:true})

    module.exports = mongoose.model('Candidate',candidateSchema)