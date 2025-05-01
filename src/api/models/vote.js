const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    candidateId:{type:mongoose.Schema.Types.ObjectId,ref:'Candidate'},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true})

module.exports = mongoose.model('Vote',voteSchema)