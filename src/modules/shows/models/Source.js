const mongoose = require('../../../config/database');

const SourceSchema = mongoose.Schema({
    poster_key: String,
    main: Boolean,
    show_name: String,
    views_count: Number,
    like_count: Number,
    key: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

const Source = mongoose.model('Source', SourceSchema, 'sources');

module.exports = Source;