const messages = require('../config/messages.json')
const universalFunctions = require('../lib/universal-functions')
const { mongoService } = require('../services')
const {User} = require('../models')
const { errors, jwt } = require('../utils')
const { jwtSecrets } = require('../../config/dev')
const constants = require('../../constants')

const ObjectId = require('mongoose').Types.ObjectId

const signUp = async(req,res)=>{
    try{
        let {name,email,password,role,age,mobile,address,aadharCardNumber} = req.body
        let body = req.body

        if(role === constants.USER_ROLE.VOTER && age<18){
            return res.status(403).json(messages.REQUIRED_AGE)
        }

        let userCriteria ={
            email:email,
            aadharCardNumber:aadharCardNumber,
            isDeleted:false
        }
        
        
        let checkIfAlreadyExists = await mongoService.getFirstMatch(User,userCriteria,{},{})
        
        if(checkIfAlreadyExists){
           return res.status(401).json({message:messages.EMAIL_IN_USE})
        }

        if(password){
            const hashedPassword = await universalFunctions.encryptData(password)
            body.password = hashedPassword
        }
        
        let dataToSave ={
            name,
            email,
            password:body?.password,
            role,
            age,
            mobile,
            aadharCardNumber,
            address
        }

        let user = await mongoService.createData(User,dataToSave)

        let response ={
            data:user
        }

        res.status(200).json({messge:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const login = async(req,res)=>{
    try{
        const {password,aadharCardNumber,deviceToken,deviceType} = req.body
        let user;

        let criteria = {
            aadharCardNumber:aadharCardNumber,
            isDeleted:false
        }

        user = await mongoService.getFirstMatch(User, criteria, {}, {});

        if(!user){
            return res.status(404).json(messages.INVALID_CREDENTIALS)
        }else if(!await universalFunctions.compareBcryptPassword(password,user.password)){
            return res.status(401).json(messages.INVALID_CREDENTIALS)
        }

        if(user.isDelete){
            return res.status(400).json(messages.ACCOUNT_DELETED_BY_ADMIN)
        }

        if(user.isBlocked){
            return res.status(400).json(messages.ACCOUNT_BLOCKED_BY_ADMIN)
        }

        let twoFactorAuthCode = await universalFunctions.generate_otp()

        await mongoService.updateData(User,{_id:user._id},{$set:{twoFactorAuthCode:twoFactorAuthCode,deviceToken,deviceType}})

        let response ={
            data:user
        }

        response.verifyToken = jwt.sign({
            id:user?._id,
            role:user?.role
        },jwtSecrets.verify,{expiresIn:'1h'})

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log('error : ',error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const verify = async(req,res)=>{
    try{
        let { verifyToken , otp} = req.body

        let [err,decoded] = await jwt.verify(verifyToken,jwtSecrets.verify)

        if(err){
            return res.status(400).json({message:messages.INVALID_TOKEN})
        }

        let { id ,role}= decoded

        let user = await mongoService.getFirstMatch(User,{_id:id},{},{})

        if(!user){
            return res.status(400).json({message:messages.INVALID_TOKEN})
        }else if(otp !== user.twoFactorAuthCode){
            return res.status(400).json({message:messages.INVALID_OTP})
        }

        let updateUser = await mongoService.updateData(User,{_id:user._id},{$set:{twoFactorAuthCode:''}},{})

        let response ={
            data:updateUser
        }

        response.token = jwt.sign({
            id,
            role
        },jwtSecrets.main,{expiresIn:'1h'})

        res.status(200).json({message:messages.SUCCESS,response})
    }catch(error){
        console.log("error : ",error)
        res.status(500).json({message:messages.ERROR,error:error.message})
    }
}

const isAuthenticated = (allowedRoles = []) => {

    return async (req, res, next) => {
      let token = req.headers.authorization;
      if (token && token.startsWith('Bearer ')) {
          token = token.slice(7, token.length);
      }
  
      if (token) {
          try {
              const [err, decoded] = await jwt.verify(token, jwtSecrets.main); 
              if (err) throw new errors.Unauthorized(messages.INVALID_VERIFICATION_TOKEN);
            
              req.user = decoded;
              req.token = token;
  
              if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
                  next(); 
              } else {
                  return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
              }
          } catch (error) {
              console.log(error);
              return res.status(401).json({ message: 'Unauthorized' , reason : "Invalid/Expired Token"});
          }
      } else {
          return res.status(400).json({ message: 'Authorization header is missing.' });
      }
    };
};

module.exports ={
    signUp,
    login,
    verify,
    isAuthenticated
}