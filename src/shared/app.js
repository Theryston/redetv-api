const express = require('express')
const cors = require('cors')
const routes = require('./routes')
// const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const corsUrls = ['http://localhost:4200', 'https://redetv-one.vercel.app', 'http://localhost:49715', 'https://redetv-admin.vercel.app']
app.use(cors({ origin: corsUrls }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(routes)

module.exports = { app }