const { app } = require('./app');

require('../modules/shows/robots/onedrive');
require('../modules/shows/robots/setoffline');

app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT))