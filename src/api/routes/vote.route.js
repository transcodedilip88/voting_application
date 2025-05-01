const express = require('express')
const { voteValidation } = require('../validation')
const { isAuthenticated } = require('../controllers/auth.controller')
const { USER_ROLE } = require('../../constants')
const { voteController } = require('../controllers')
const router = express.Router()

router.post('/vote/add',voteValidation.addVote,isAuthenticated([USER_ROLE.VOTER]),voteController.addVote)
router.get('/votes',voteValidation.getAllVotes,isAuthenticated([...Object.values(USER_ROLE)]),voteController.getAllVotes)

module.exports = router