const mongoose = require('../../../config/database');

const ViewSchema = mongoose.Schema({
    ip: {
        type: String,
        unique: true,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    online: {
        type: Boolean,
        default: true
    }
})

const View = mongoose.model('View', ViewSchema, 'views');

module.exports = View;