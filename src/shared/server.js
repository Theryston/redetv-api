const { app } = require('./app')

require('../modules/shows/robots/onedrive');
require('../modules/shows/robots/setoffline');

app.listen(process.env.PORT || 3333, () => console.log('server started in ' + process.env.PORT))