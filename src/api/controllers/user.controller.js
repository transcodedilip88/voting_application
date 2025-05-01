const messages = require('../config/messages.json')
const universalFunctions = require('../lib/universal-functions')
const { mongoService } = require('../services')
const {User} = require('../models')
const constants = require('../../constants')

const ObjectId = require('mongoose').Types.ObjectId

const getAllUser = async(req,res)=>{
    try{
        let {search,isVoted,skip,limit} = req.query

        let criteria ={
            isDeleted:false
        }

        let options ={
            skip:parseInt(skip) || constants.PAGINATION.DEFAULT_SKIP,
            limit:parseInt(limit) || constants.PAGINATION.DEFAULT_LIMI,
            sort:{createdAt:-1}
        }

        if(search){
            criteria.$or=[
                {name:{$regex:search,$options:"i"}},
            ]
        }

        if(isVoted){
            criteria.isVoted = isVoted
        }

        let user = await mongoService.getData(User,criteria,{},options)
        let userCount = await mongoService.countData(User,criteria)

        let response = {
            data:user,
            count:userCount
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : error",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const getUserById = async(req,res)=>{
    try{
        let id = req.params.id 

        let criteria = {
            _id:new ObjectId(id),
            isDeleted:false
        }

        let user = await mongoService.getFirstMatch(User,criteria,{},{})

        if(!user){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        let response ={
            data:user
        }

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const updateUserById = async(req,res)=>{
    try{
        let id = req.params.id
        let {name,age,address} = req.body

        let criteria ={
            _id:new ObjectId(id),
            isDeleted:false
        }

        let user = await mongoService.getFirstMatch(User,criteria,{},{})

        if(!user){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        if(age<18){
            return res.status(403).json({message:messages.REQUIRED_AGE})
        }

        let dataToSet = {
            name,
            age,
            address
        }

        user = await mongoService.updateData(User,criteria,dataToSet,{})

        let response ={
            data:user
        }

        res.status(200).json({message:messages.DATA_UPDATED,response})

    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const deleteUserById = async(req,res)=>{
    try{
        let id = req.params.id

        let criteria = {
            _id:new ObjectId(id),
            isDeleted:false
        }

        let user = await mongoService.getFirstMatch(User,criteria,{},{})

        if(!user){
            return res.status(404).json({message:messages.DATA_NOT_FOUND})
        }

        await mongoService.updateData(User,criteria,{isDeleted:true},{})

        res.status(200).json({message:'User deletes SuccessFully.'})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

module.exports ={
    getAllUser,
    getUserById,
    updateUserById,
    deleteUserById
}