const mongoose = require('../../../config/database');

const SeasonSchema = mongoose.Schema({
    number: Number,
    name: String,
    episodes: [{
        type: mongoose.ObjectId,
        ref: 'Episode'
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Season = mongoose.model('Season', SeasonSchema, 'seasons');

module.exports = Season;