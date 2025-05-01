const express = require('express')
const { authValidation } = require('../validation')
const { authController } = require('../controllers')
const router = express.Router()

router.post('/auth/signup',authValidation.signUp,authController.signUp)
router.post('/auth/login',authValidation.login,authController.login)
router.put('/auth/verify',authValidation.verify,authController.verify)

module.exports = router