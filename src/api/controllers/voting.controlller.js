const messages = require('../config/messages.json')
const universalFunctions = require('../lib/universal-functions')
const { mongoService } = require('../services')
const {User,Candidate, Vote} = require('../models')
const constants = require('../../constants')

const ObjectId = require('mongoose').Types.ObjectId

const addVote = async(req,res)=>{
    try{
        let id = req.query.id;
        let loginId = req?.user?.id

        let userCriteria ={
            _id:loginId,
            isDeleted:false,
        }

        let user = await mongoService.getFirstMatch(User,userCriteria,{},{})

        if(!user){
            return res.status(400).json(messages.DATA_NOT_FOUND)
        }

        if(user.isVoted){
            return res.status(401).json(messages.ALREADY_VOTED)
        }

        let dataToSave ={
            candidateId:new ObjectId(id),
            createdBy:new ObjectId(req?.user?.id),
            updatedBy:new ObjectId(req?.user?.id)
        }

        let vote = await mongoService.createData(Vote,dataToSave)

        let dataToSet = {
            isVoted:true,
        }

        await mongoService.updateData(User,{_id:new ObjectId(req?.user?.id)},dataToSet,{})
        await mongoService.updateData(Candidate, { _id: new ObjectId(id) }, { $inc: { votes: 1 } });
        
        let response ={
            data:vote
        }
        
        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getAllVotes = async(req,res)=>{
    try{
        let { candidateId ,skip ,limit} = req.query

        let criteria = {};

        let options ={
            skip:parseInt(skip) || constants.PAGINATION.DEFAULT_SKIP,
            limit:parseInt(limit) || constants.PAGINATION.DEFAULT_LIMI,
            sort:{createdAt:-1}
        }

        if(candidateId){
            criteria.candidateId = new ObjectId(candidateId)
        }

        let populate = [
            {
                path:'candidateId',
                select:'name party age'
            },
            {
                path:'createdBy',
                select:'name age'
            }
        ]

        let vote = await mongoService.findAllWithPopulate(Vote,criteria,{},options,populate)
        let countVote = await mongoService.countData(Vote,criteria)

        let response = {
            data:vote,
            count:countVote
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}


module.exports = {
    addVote,
    getAllVotes
}