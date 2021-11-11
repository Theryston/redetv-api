const ShowService = require('../services/ShowService')

module.exports = {
    createShow: async (req, res) => {
        try {
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

            const show = await ShowService.createShow({
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
            });

            res.json(show);
        } catch (error) {
            res.json({ error })
        }
    },
    createSource: async (req, res) => {
        try {
            const { show_name, main, folder } = req.body;
            const key = await ShowService.uploadToOnedrive(req.file.buffer, folder, { fileSize: req.file.size, filename: Date.now().toString() + '-' + req.file.originalname })

            const source = await ShowService.createSource({ show_name, main, key });
            res.json(source);
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    addPosterSource: async (req, res) => {
        try {
            const { source_id } = req.params;
            const key = await ShowService.uploadToOnedrive(req.file.buffer, 'posters', { fileSize: req.file.size, filename: Date.now().toString() + '-' + req.file.originalname });
            const source = await ShowService.addPosterSource(source_id, key);
            res.json(source);
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    getSource: async (req, res) => {
        const { source_id } = req.params;
        try {
            const source = await ShowService.getSource(source_id);
            let url = await ShowService.getDownloadUrl(source.key);
            let poster = source.poster_key ? await ShowService.getDownloadUrl(source.poster_key) : '';
            res.json({ _id: source._id, main: source.main, show_name: source.show_name, views_count: source.views_count, like_count: source.like_count, __v: source.__v, url: url, poster: poster });
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    getAllSource: async (req, res) => {
        try {
            const sources = await ShowService.getAllSource();
            res.json(sources);
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    getDownloadUrl: async (req, res) => {
        try {
            const url = await ShowService.getDownloadUrl(req.params.key);
            res.json({ url });
        } catch (error) {
            res.status(500).json({ error })
        }
    },

    createEpisode: async (req, res) => {
        const {
            sources,
            name,
            number
        } = req.body;

        try {
            const episode = await ShowService.createEpisode({ sources, name, number });
            res.json(episode);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    getEpisode: async (req, res) => {
        const { episode_id } = req.params;
        try {
            const episode = await ShowService.getEpisode(episode_id);
            res.json(episode);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    createSeason: async (req, res) => {
        const {
            episodes,
            name,
            number
        } = req.body;

        try {
            const season = await ShowService.createSeason({ episodes, name, number });
            res.json(season);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    getSeason: async (req, res) => {
        const { season_id } = req.params;
        try {
            const season = await ShowService.getSeason(season_id);
            res.json(season);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
}