const mongoose = require('../../../config/database');

const NewSchema = mongoose.Schema({
    link: String,
    company_name: String,
    active: Boolean,
    key: String,
})

const New = mongoose.model('New', NewSchema, 'news')

module.exports = New;