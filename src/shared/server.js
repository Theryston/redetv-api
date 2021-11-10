const { app } = require('./app')

app.listen(process.env.PORT || 3333, () => console.log('server started in ' + process.env.PORT))