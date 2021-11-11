const { Router } = require('express')
const router = Router()

const movieRoutes = require('../modules/shows/http/routes')

router.use('/show', movieRoutes)

module.exports = router;