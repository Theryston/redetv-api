const { Router } = require('express')
const router = Router()

const ShowController = require('./controllers/ShowController')

router.get('/init', ShowController.init)


module.exports = router;