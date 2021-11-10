const { Router } = require('express')
const router = Router()

const movieRoutes = require('../modules/shows/http/routes')

router.use('/shows', movieRoutes)

module.exports = router;