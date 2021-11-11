const express = require('express')
const cors = require('cors')
const routes = require('./routes')
// const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const corsUrls = ['http://localhost:4200', 'https://fillscene.com']
app.use(cors({ origin: corsUrls }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(routes)

module.exports = { app }