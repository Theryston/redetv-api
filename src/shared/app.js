const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

const corsUrls = ['http://localhost:4200', 'https://fillscene.com']
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors({ origin: corsUrls }))
app.use(express.json())

app.use(routes)

module.exports = { app }