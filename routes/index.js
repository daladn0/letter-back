const { Router } = require('express')
const router = Router()

const authRouter = require('./auth.router')
const wordRouter = require('./word.router')

router.use('/auth', authRouter)
router.use('/word', wordRouter)

module.exports = router