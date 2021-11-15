const { Router } = require('express')
const multer = require('multer');
const multerConfig = require('../../../config/multer')

const AdminMiddleware = require('./middlewares/AdminMiddleware')


const router = Router()

const ShowController = require('./controllers/ShowController')
const InternalController = require('./controllers/InternalController')

router.get('/file/:key', ShowController.getDownloadUrl)

router.post('/source', [multer(multerConfig).single('file'), AdminMiddleware], ShowController.createSource);
router.post('/source/poster/:source_id', multer(multerConfig).single('file'), ShowController.addPosterSource)
router.get('/source/list', ShowController.getAllSource)
router.get('/source/:source_id', ShowController.getSource)
router.put('/source/:source_id', ShowController.updateSource)

router.post('/episode', ShowController.createEpisode)
router.get('/episode/:episode_id', ShowController.getEpisode)
router.put('/episode/:episode_id', ShowController.updateEpisode)

router.post('/season', ShowController.createSeason)
router.get('/season/:season_id', ShowController.getSeason)
router.put('/season/:season_id', ShowController.updateSeason)

router.post('/logo/data', [multer(multerConfig).single('file'), AdminMiddleware], InternalController.createLogo);
router.get('/logo/list', InternalController.getAllLogos);
router.get('/logo/:logo_id', InternalController.getLogo);
router.put('/logo/:logo_id', AdminMiddleware, InternalController.updateLogo);
router.delete('/logo/:logo_id', AdminMiddleware, InternalController.deleteLogo);

router.post('/redetv/logo', [multer(multerConfig).single('file'), AdminMiddleware], InternalController.createRedetvLogo);
router.put('/redetv/logo/:redetvLogo_id', [multer(multerConfig).single('file'), AdminMiddleware], InternalController.updateRedetvLogo);
router.get('/redetv/logo', InternalController.getRedetvLogo);

router.post('/view', InternalController.addView);
router.patch('/view', InternalController.setViewOffline);
router.get('/view/online', InternalController.getOnlineViewsCount);
router.get('/view', InternalController.getViewsCount);

router.post('/data', ShowController.createShow);
router.get('/list', ShowController.getAllShows)
router.get('/:show_id', ShowController.getShow)
router.put('/:show_id', ShowController.updateShow)
router.delete('/:show_id', ShowController.deleteShow)


module.exports = router;