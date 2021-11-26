const mongoose = require('../../../config/database');

const EpisodeSchema = mongoose.Schema({
    sources: [{
        type: mongoose.ObjectId,
        ref: 'Source',
    }],
    name: String,
    number: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })

const Episode = mongoose.model('Episode', EpisodeSchema, 'episodes');

module.exports = Episode;