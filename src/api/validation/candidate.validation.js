const Joi = require('joi')
const messages = require("../config/messages.json")

const addCandidate = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            party:Joi.string().required(),
            age:Joi.number().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error,message})
    }
}

const getAllCandidate = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            search:Joi.string().optional()
        })
        req.query = await schema.validateAsync(req.query)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getCandidateById = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            id:Joi.string().required()
        })
        req.params = await schema.validateAsync(req.params)
        next()
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