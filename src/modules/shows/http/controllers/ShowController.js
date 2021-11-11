const ShowService = require('../services/ShowService')

module.exports = {
    createShow: async (req, res) => {
        const {
            name,
            posters,
            description,
            short_description,
            trailers,
            release_date_of,
            default_duration,
            show_hosts_name,
            categories,
            seasons
        } = req.body;
    }
}