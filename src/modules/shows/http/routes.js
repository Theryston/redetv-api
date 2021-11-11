const { Router } = require('express')
const router = Router()

const ShowController = require('./controllers/ShowController')

router.post('/data', ShowController.createShow)


module.exports = router;