const mongoose = require('../../../config/database');

const OneDriveSecretSchema = mongoose.Schema({
    token_type: String,
    scope: String,
    expires_in: Number,
    ext_expires_in: Number,
    access_token: String,
    refresh_token: String,
});

const OneDriveSecret = mongoose.model('OneDriveSecret', OneDriveSecretSchema)

module.exports = OneDriveSecret;