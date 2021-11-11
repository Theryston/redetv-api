const mongoose = require('../../../config/database')

const showSchema = mongoose.Schema({
    name: String,
    posters: [{
        type: mongoose.ObjectId,
        ref: 'Source'
    }],
    description: String,
    short_description: String,
    trailers: [{
        type: String,
        required: false
    }],
    release_date_of: Date | String,
    default_duration: Number,
    show_hosts_name: [{
        type: String
    }],
    categories: [{
        name: String,
        created_at: {
            type: Date,
            default: Date.now()
        }
    }],
    seasons: [{
        type: mongoose.ObjectId,
        ref: 'Season'
    }],
    created_at: {
        type: Date,
        default: Date.now()
    },
})

const Show = mongoose.model('Show', showSchema, 'shows');

module.exports = Show;