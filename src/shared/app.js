const express = require('express')
const cors = require('cors')
const routes = require('./routes')
    // const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

const corsUrls = ['http://localhost:4200', 'https://redetv-7a36f.web.app', 'https://redetv-7a36f.firebaseapp.com', 'https://redetv-admin.web.app', 'https://redetv-admin.firebaseapp.com', 'https://redetvto.com.br', 'https://admin.redetvto.com.br']
    // app.use(cors({ origin: corsUrls }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(routes)

module.exports = { app }