const express = require('express')
const { userValidation } = require('../validation')
const { isAuthenticated } = require('../controllers/auth.controller')
const { USER_ROLE } = require('../../constants')
const { userController } = require('../controllers')
const router = express.Router()

router.get('/users',userValidation.getAllUser,isAuthenticated([...Object.values(USER_ROLE)]),userController.getAllUser)
router.get('/user/:id',userValidation.getUserById,isAuthenticated([...Object.values(USER_ROLE)]),userController.getUserById)
router.put('/user/:id/update',userValidation.updateUserById,isAuthenticated([...Object.values(USER_ROLE)]),userController.updateUserById)
router.put('/user/:id/delete',userValidation.deleteUserById,isAuthenticated([...Object.values(USER_ROLE)]),userController.deleteUserById)

module.exports = router