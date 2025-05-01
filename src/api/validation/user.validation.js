const Joi = require('joi')
const messages = require('../config/messages.json')

const getAllUser = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            search:Joi.string().optional(),
            isVoted:Joi.boolean().optional(),
            skip:Joi.number().optional(),
            limit:Joi.number().optional()
        })
        req.query = await schema.validateAsync(req.query)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getUserById = async(req,res,next)=>{
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

const deleteUserById = async(req,res,next)=>{
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

const updateUserById = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            name:Joi.string().optional(),
            age:Joi.number().optional(),
            address:Joi.string().optional()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports = {
    getAllUser,
    getUserById,
    deleteUserById,
    updateUserById
}