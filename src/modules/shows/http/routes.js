const { Router } = require('express')
const multer = require('multer');
const multerConfig = require('../../../config/multer')

const router = Router()

const ShowController = require('./controllers/ShowController')

router.post('/data', ShowController.createShow)
router.post('/source', multer(multerConfig).single('file'), ShowController.createSource)


module.exports = router;