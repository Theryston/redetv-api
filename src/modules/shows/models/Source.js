const mongoose = require('../../../config/database');

const SourceSchema = mongoose.Schema({
    poster_key: String,
    main: Boolean,
    show_name: String,
    views_count: Number,
    like_count: Number,
    key: String,
    created_at: {
        type: Date
    }
}, { timestamps: true });


SourceSchema.pre('save', function(next) {
    let now = new Date();
    this.created_at = now;
    next();
});

const Source = mongoose.model('Source', SourceSchema, 'sources');

module.exports = Source;