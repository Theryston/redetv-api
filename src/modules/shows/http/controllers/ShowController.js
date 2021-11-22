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
                seasons,
                main
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
                seasons,
                main
            });

            res.json(show);
        } catch (error) {
            res.status(500).json({ error })
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
    updateSource: async (req, res) => {
        try {
            const { source_id } = req.params;
            const datas = req.body;
            datas.key = undefined;
            datas.poster_key = undefined;
            const source = ShowService.updateSource(source_id, datas);
            res.json(source);
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

    updateEpisode: async (req, res) => {
        try {
            const { episode_id } = req.params;
            const datas = req.body;
            const episode = await ShowService.updateEpisode(episode_id, datas);
            res.json(episode);
        } catch (error) {
            throw error;
        }
    },

    deleteEpisode: async (req, res) => {
        try {
            const { episode_id } = req.params;
            await ShowService.deleteEpisode(episode_id);
            res.json({ OK: true });
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

    updateSeason: async (req, res) => {
        try {
            const { season_id } = req.params;
            const datas = req.body;
            const season = await ShowService.updateSeason(season_id, datas);
            res.json(season);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    deleteSeason: async (req, res) => {
        try {
            const { season_id } = req.params;
            await ShowService.deleteSeason(season_id);
            res.json({ OK: true });
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    getShow: async (req, res) => {
        const { show_id } = req.params;

        try {
            const show = {};
            const showDb = await ShowService.getShow(show_id);

            let posters = [];
            for await (let poster of showDb.posters) {
                let sourcePoster = await ShowService.getSource(poster);
                let urlSourcePoster = await ShowService.getDownloadUrl(sourcePoster.key)
                posters.push(urlSourcePoster);
            }

            const seasons = [];
            for (let season of showDb.seasons) {
                const seasonWithEpisodes = await ShowService.getSeason(season._id);

                const episodes = [];
                for (let episode of seasonWithEpisodes.episodes) {
                    const episodeWidthSource = await ShowService.getEpisode(episode._id);

                    const sources = [];
                    for (let source of episodeWidthSource.sources) {
                        const sourceUrl = await ShowService.getDownloadUrl(source.key);
                        let sourcePosterUrl;
                        if (source.poster_key) {
                            sourcePosterUrl = await ShowService.getDownloadUrl(source.poster_key);
                        } else {
                            sourcePosterUrl = '';
                        }
                        sources.push({ _id: source._id, main: source.main, show_name: source.show_name, views_count: source.views_count, like_count: source.like_count, poster: sourcePosterUrl, url: sourceUrl });
                    }

                    episodes.push({ _id: episodeWidthSource._id, name: episodeWidthSource.name, number: episodeWidthSource.number, created_at: episodeWidthSource.created_at, sources });
                }

                seasons.push({ _id: seasonWithEpisodes._id, number: seasonWithEpisodes.number, name: seasonWithEpisodes.name, episodes: episodes });
            }

            show._id = showDb._id;
            show.name = showDb.name;
            show.main = showDb.main;
            show.posters = posters;
            show.description = showDb.description;
            show.short_description = showDb.short_description;
            show.trailers = showDb.trailers;
            show.release_date_of = showDb.release_date_of;
            show.default_duration = showDb.default_duration;
            show.show_hosts_name = showDb.show_hosts_name;
            show.categories = showDb.categories;
            show.created_at = showDb.created_at;
            show.seasons = seasons;

            res.json(show);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    getAllShows: async (req, res) => {
        try {
            const showsDb = await ShowService.getAllShows();

            const shows = []
            for (let show of showsDb) {
                const posters = [];
                for (let poster of show.posters) {
                    let sourcePoster = await ShowService.getSource(poster);
                    let urlSourcePoster = await ShowService.getDownloadUrl(sourcePoster.key)
                    posters.push(urlSourcePoster);
                }

                shows.push({
                    _id: show._id,
                    name: show.name,
                    main: show.main,
                    posters,
                    description: show.description,
                    short_description: show.short_description,
                    trailers: show.trailers,
                    release_date_of: show.release_date_of,
                    default_duration: show.default_duration,
                    show_hosts_name: show.show_hosts_name,
                    categories: show.categories,
                    created_at: show.created_at,
                });
            }

            res.json(shows)
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    deleteShow: async (req, res) => {
        try {
            const { show_id } = req.params;
            await ShowService.deleteShow(show_id);
            res.json({ OK: true });
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    updateShow: async (req, res) => {
        try {
            const { show_id } = req.params;
            const datas = req.body;
            const show = await ShowService.updateShow(show_id, datas);
            res.json(show)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error })
        }
    }
}