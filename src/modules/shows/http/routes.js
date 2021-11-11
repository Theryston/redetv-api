const { Router } = require('express')
const multer = require('multer');
const multerConfig = require('../../../config/multer')

const router = Router()

const ShowController = require('./controllers/ShowController')

router.post('/data', ShowController.createShow);
router.post('/source', multer(multerConfig).single('file'), ShowController.createSource);
router.post('/source/poster/:source_id', multer(multerConfig).single('file'), ShowController.addPosterSource)
router.get('/source/list', ShowController.getAllSource)
router.get('/source/:source_id', ShowController.getSource)
router.get('/file/:key', ShowController.getDownloadUrl)


module.exports = router;