const Joi = require('joi')

const addVote = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            id:Joi.string().required()
        })
        req.query = await schema.validateAsync(req.query)
        next()
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getAllVotes = async(req,res,next)=>{
    try{
        const schema = Joi.object({
            candidateId:Joi.string().optional(),
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

module.exports ={
    addVote,
    getAllVotes
}