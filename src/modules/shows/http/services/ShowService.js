const { Readable } = require('stream');
const Source = require('../../models/Source');
const Episode = require('../../models/Episode');
const Season = require('../../models/Season');
const Show = require('../../models/Show');
const OneDriveSecret = require('../../models/OneDriveSecret');
const axios = require('axios');
const got = require("got");

module.exports = {
    createSource: async({ main, show_name, key }) => {
        try {
            const source = await Source.create({
                poster_key: null,
                main,
                show_name,
                views_count: 0,
                like_count: 0,
                key
            })

            return source;
        } catch (error) {
            throw error;
        }
    },

    addPosterSource: async(source_id, poster_key) => {
        try {
            const source = await Source.findByIdAndUpdate(source_id, {
                poster_key,
            });
            return source;
        } catch (error) {
            throw error;
        }
    },

    uploadToOnedrive: async(binary, folder, file) => {
        try {

            const run = async(resolve, reject) => {
                const accessToken = (await OneDriveSecret.findOne()).access_token;

                const fileStream = new Readable({
                    read() {
                        this.push(binary);
                    }
                });


                folder = folder.split('/');
                let onedriveFolder;

                for (let f of folder) {
                    try {
                        onedriveFolder = (await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${onedriveFolder ? encodeURI(onedriveFolder.id) : 'root'}/children`, {
                            name: f,
                            folder: {},
                        }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` } })).data;
                    } catch (error) {
                        reject(error);
                    }
                }

                let uploadSession;
                try {
                    uploadSession = (await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${encodeURI(onedriveFolder.id)}:/${encodeURI(file.filename)}:/createUploadSession`, {}, { headers: { 'Authorization': `Bearer ${accessToken}` } })).data;
                } catch (error) {
                    reject(error);
                }
                let chunks = [];
                let chunksToUploadSize = 0;
                let onedriveFile;
                let uploadedBytes = 0;

                fileStream.on('data', async(chunk) => {
                    chunks.push(chunk);
                    chunksToUploadSize += chunk.length;

                    if (chunks.length === 20 || chunksToUploadSize + uploadedBytes === file.fileSize) {
                        fileStream.pause();
                        const payload = Buffer.concat(chunks, chunksToUploadSize);

                        const uploadGotExtended = got.extend({
                            method: "PUT",
                            headers: {
                                "Content-Length": chunksToUploadSize,
                                "Content-Range": "bytes " + uploadedBytes + "-" + (uploadedBytes + chunksToUploadSize - 1) + "/" + file.fileSize,
                            },
                            body: payload,
                        });
                        let res;
                        try {
                            res = await uploadGotExtended(uploadSession.uploadUrl);
                        } catch (error) {
                            res = error;
                        }


                        if (
                            res.statusCode === 201 ||
                            res.statusCode === 203 ||
                            res.statusCode === 200
                        ) {
                            fileStream.destroy();
                            let data = JSON.parse(res.body);
                            try {
                                const response = await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${data.id}/createLink`, {
                                    "type": "embed"
                                }, { headers: { authorization: 'Bearer ' + accessToken }, 'Content-Type': 'application/json', 'Retry-After': 2.128 });
                                resolve(response.data.link.webUrl.replace('embed', 'download'));
                            } catch (e) {
                                console.log(e.message);
                                resolve(data.id);
                            }
                        }

                        fileStream.resume();
                    }
                })
            }

            const func = new Promise(function(resolve, reject) {
                run(resolve, reject)
            })

            const key = await func;
            return key;
        } catch (error) {
            throw error;
        }
    },

    getSource: async(source_id) => {
        try {
            const source = await Source.findById(source_id);
            return source;
        } catch (error) {
            throw error;
        }
    },

    getAllSource: async() => {
        try {
            const source = await Source.find({}).sort([
                ['created_at', -1]
            ]);
            return source;
        } catch (error) {
            throw error;
        }
    },

    updateSource: async(source_id, datas) => {
        try {
            console.log(source_id)
            const source = await Source.findByIdAndUpdate(source_id, {
                ...datas,
            });
            return source;
        } catch (error) {
            throw error;
        }
    },

    getDownloadUrl: async(key) => {
        try {
            if (key.indexOf('http') !== -1) {
                return key;
            } else {
                const access_token = (await OneDriveSecret.findOne()).access_token;
                const response = await axios.get('https://graph.microsoft.com/v1.0/drive/items/' + key, { headers: { authorization: 'Bearer ' + access_token } });
                return response.data['@microsoft.graph.downloadUrl'];
            }
        } catch (error) {
            throw error;
        }
    },

    _getDownloadUrl: async(key) => {
        try {
            const access_token = (await OneDriveSecret.findOne()).access_token;
            const response = await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${key}/createLink`, {
                "type": "embed"
            }, { headers: { authorization: 'Bearer ' + access_token }, 'Content-Type': 'application/json' });
            // response.data = undefined;
            console.log(response.data.link.webUrl.replace('embed', 'download'))
            const url = 'https://onedrive.live.com/download?resid=' + encodeURI(key) + '&authkey=AAO4Wu4aprpjLe4';
            return url;
        } catch (error) {
            console.log(error.message)
            throw error;
        }
    },

    createEpisode: async({ sources, name, number }) => {
        try {
            const episode = await Episode.create({ sources, name, number });
            return episode;
        } catch (error) {
            throw error;
        }
    },

    getEpisode: async(episode_id) => {
        try {
            const episode = await Episode.findById(episode_id).populate('sources');
            return episode;
        } catch (error) {
            throw error;
        }
    },

    updateEpisode: async(episode_id, datas) => {
        try {
            const episode = await Episode.findByIdAndUpdate(episode_id, datas);
            return episode;
        } catch (error) {
            throw error;
        }
    },

    deleteEpisode: async(episode_id) => {
        try {
            const episode = await Episode.findById(episode_id).populate('sources');
            for (let source of episode.sources) {
                await Source.findByIdAndDelete(source._id);
            }
            await Episode.findByIdAndDelete(episode_id);
            return true;
        } catch (error) {
            throw error;
        }
    },

    createSeason: async({ episodes, name, number }) => {
        try {
            const season = await Season.create({ episodes, name, number });
            return season;
        } catch (error) {
            throw error;
        }
    },

    getSeason: async(season_id) => {
        try {
            const season = await Season.findById(season_id).populate('episodes');
            return season;
        } catch (error) {
            throw error;
        }
    },

    updateSeason: async(season_id, datas) => {
        try {
            if (datas.episodes) {
                for (episode of datas.episodes) {
                    if (typeof episode === 'string') {
                        const show = await Show.findOne({ seasons: season_id });
                        await Show.findByIdAndUpdate(show._id, { last_episode_date: Date.now() });
                    }
                }
            }
            const season = await Season.findByIdAndUpdate(season_id, datas);
            return season;
        } catch (error) {
            throw error;
        }
    },

    deleteSeason: async(season_id) => {
        try {
            const season = await Season.findById(season_id).populate('episodes');
            for (let episode of season.episodes) {
                for (let source of episode.sources) {
                    await Source.findByIdAndDelete(source);
                }
                await Episode.findByIdAndDelete(episode);
                return true;
            }
            await Season.findByIdAndDelete(season_id);
        } catch (error) {
            throw error;
        }
    },

    createShow: async(show_datas) => {
        try {
            const show = await Show.create(show_datas);
            return show;
        } catch (error) {
            throw error;
        }
    },
    getShow: async(show_id) => {
        try {
            const show = await Show.findById(show_id).populate('seasons').sort([
                ['last_episode_date', -1]
            ]);
            return show;
        } catch (error) {
            throw error;
        }
    },

    getAllShows: async() => {
        try {
            const shows = await Show.find().populate('seasons');
            return shows;
        } catch (error) {
            throw error;
        }
    },

    deleteShow: async(show_id) => {
        try {
            const show = await Show.findById(show_id).populate('seasons');
            await Source.findByIdAndDelete(show.posters[0]);
            for (let season of show.seasons) {
                const episodes = season.episodes;
                for (let episode of episodes) {
                    const episodeDb = await Episode.findById(episode);
                    for (let source of episodeDb.sources) {
                        await Source.findByIdAndDelete(source);
                    }
                    await Episode.findByIdAndDelete(episode);
                }
                await Season.findByIdAndDelete(season);
            }
            await Show.findByIdAndDelete(show_id);
            return true;
        } catch (error) {
            throw error;
        }
    },

    updateShow: async(show_id, datas) => {
        try {
            const show = await Show.findByIdAndUpdate(show_id, datas);
            return show;
        } catch (error) {
            throw error;
        }
    }
}