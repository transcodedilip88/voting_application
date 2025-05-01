const express = require('express')
const { candidateValidation } = require('../validation')
const { isAuthenticated } = require('../controllers/auth.controller')
const {USER_ROLE} = require('../../constants')
const { candidateController } = require('../controllers')
const router = express.Router()

router.post('/candidate/add',candidateValidation.addCandidate,isAuthenticated([USER_ROLE.SUPER_ADMIN]),candidateController.addCandidate)
router.get('/candidates',candidateValidation.getAllCandidate,isAuthenticated([...Object.values(USER_ROLE)]),candidateController.getAllCandidate)
router.get('/candidate/:id',candidateValidation.getCandidateById,isAuthenticated([...Object.values(USER_ROLE)]),candidateController.getCandidateById)

module.exports = router