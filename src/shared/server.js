const { app } = require('./app');
const https = require('https');
const path = require('path');
const fs = require('fs');

require('../modules/shows/robots/onedrive');
require('../modules/shows/robots/setoffline');

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', '..', 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', '..', 'cert', 'cert.pem')),
}, app)

sslServer.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT))