const mongoose = require('../../../config/database');

const SourceSchema = mongoose.Schema({
    poster_key: String,
    main: Boolean,
    show_id: String,
    show_name: String,
    views_count: Number,
    like_count: Number,
    key: String,
    episode: {
        type: mongoose.ObjectId,
        ref: 'Episode'
    }
});

const Source = mongoose.model('Source', SourceSchema, 'sources');

module.exports = Source;