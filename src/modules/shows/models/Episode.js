const mongoose = require('../../../config/database');

const EpisodeSchema = mongoose.Schema({
    season: {
        type: mongoose.ObjectId,
        ref: 'Season',
    },
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
})

const Episode = mongoose.model('Episode', EpisodeSchema, 'episodes');

module.exports = Episode;