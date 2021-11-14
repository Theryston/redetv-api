const { Router } = require('express')
const router = Router()

const movieRoutes = require('../modules/shows/http/routes')

router.use('/show', movieRoutes)

router.get('/login', (req, res) => {
    const { username, password } = req.query;
    if (username === 'redetv-admin' && password === 'J2*rHNFKijHtX4DAzIVcQuE6qAcY2V') {
        res.json({ success: true })
    } else {
        res.status(401).json({ message: 'Invalid username and password' })
    }
})

module.exports = router;