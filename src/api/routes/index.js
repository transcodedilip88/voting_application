const express = require('express')
const router = express.Router()

const authRouter = require('./auth.route')
const candidateRouter = require('./candidate.route')
const voteRouter = require('./vote.route')
const userRouter = require('./user.route')

router.use(authRouter)
router.use(candidateRouter)
router.use(voteRouter)
router.use(userRouter)

module.exports = router
