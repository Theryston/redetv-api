const mongoose = require('../../../config/database');

const RedetvLogoStream = mongoose.Schema({
    key: String
});

const RedetvLogo = mongoose.model('RedetvLogo', RedetvLogoStream, 'redetvlogos');

module.exports = RedetvLogo;