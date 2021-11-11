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
        res.json({ OK: true })
    },
    createSource: async (req, res) => {
        const { show_name, main } = req.body;
        const key = '';

        const source = await ShowService.createSource({ show_name, main, key });
        res.json(source);
    }
}