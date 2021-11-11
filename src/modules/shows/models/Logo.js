const mongoose = require('../../../config/database');

const LogoSchema = mongoose.Schema({
    link: String,
    company_name: String,
    active: Boolean,
    key: String,
})

const Logo = mongoose.model('Logo', LogoSchema, 'logos');

module.exports = Logo;