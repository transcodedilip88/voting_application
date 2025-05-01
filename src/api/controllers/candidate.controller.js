const messages = require('../config/messages.json')
const universalFunctions = require('../lib/universal-functions')
const { mongoService } = require('../services')
const {Candidate} = require('../models')

const ObjectId = require('mongoose').Types.ObjectId

const addCandidate = async(req,res)=>{
    try{
        const {name,party,age,email} = req.body

        let criteria ={
            name:name,
            party:party,
            isDeleted:false
        }

        if(age<35){
            return res.status(403).json(messages.REQUIRED_AGE)
        }

        let isExist = await mongoService.getFirstMatch(Candidate,criteria,{},{})

        if(isExist){
            return res.status(400).json({message:messages.DUPLICATE_NAME})
        }

        let dataToSave ={
            name,
            party,
            age,
            email
        }

        let candidate = await mongoService.createData(Candidate,dataToSave)

        let response ={
            data:candidate
        }
        
        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getAllCandidate = async(req,res)=>{
    try{    
        let {search}= req.query

        let candidateCriteria ={
            isDeleted:false
        }

        if(search){
            candidateCriteria.$or=[
                {name:{$regex:search,$options:"i"}},    
                {party:{$regex:search,$options:"i"}}
            ]
        }

        let candidate = await mongoService.getData(Candidate,candidateCriteria,{},{})
        let countCandidate = await mongoService.countData(Candidate,candidateCriteria)

        let response ={
            data:candidate,
            count:countCandidate
        }

        res.status(200).json({message:messages.SUCCESS,response})
        
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getCandidateById = async(req,res)=>{
    try{
        let id = req.params.id

        let candidateCriteria ={
            _id:new ObjectId(id),
            isDeleted:false
        }

        let candidate = await mongoService.getFirstMatch(Candidate,candidateCriteria,{},{})
        
        if(!candidate){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        let response ={
            data:candidate
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports ={
    addCandidate,
    getAllCandidate,
    getCandidateById
}