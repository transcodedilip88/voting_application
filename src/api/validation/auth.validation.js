const Joi = require('joi')
const messages = require('../config/messages.json')

const signUp = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            age:Joi.number().required(),
            password : Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).optional().messages({ 'string.pattern.base': 'Password is not strong' }),
            mobile:Joi.number().required(),
            aadharCardNumber:Joi.number().required(),
            address:Joi.string().optional(),
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error);
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const login = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            aadharCardNumber:Joi.number().required(),
            password:Joi.string().required(),
            deviceToken:Joi.string().optional(),
            deviceType:Joi.number().optional()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const verify = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            verifyToken:Joi.string().required(),
            otp:Joi.number().required()
        })
        req.body = await schema.validateAsync(req.body)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports ={
    signUp,
    login,
    verify
}