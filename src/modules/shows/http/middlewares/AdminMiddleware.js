module.exports = (req, res, next) => {
    const { username, password } = req.query;
    if (username === 'redetv-admin' && password === 'J2*rHNFKijHtX4DAzIVcQuE6qAcY2V') {
        next();
    } else {
        res.status(401).json({ message: 'Invalid username and password' })
    }
}