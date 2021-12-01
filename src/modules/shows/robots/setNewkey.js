const { Readable } = require('stream');
const Source = require('../models/Source');
const Episode = require('../models/Episode');
const Season = require('../models/Season');
const Show = require('../models/Show');
const OneDriveSecret = require('../models/OneDriveSecret');
const axios = require('axios');

const main = async() => {
    try {
        let shows = await Show.find().populate('posters');

        for await (let show of shows) {
            for await (let poster of show.posters) {
                if (poster.key.indexOf('http') === -1) {
                    let url = await requestUrl(poster.key);
                    await Source.findByIdAndUpdate(poster._id, { key: url });
                }
            }

            console.log('Updated posters of show by name ' + show.name);

            for await (let season of show.seasons) {
                let seasonDb = await Season.findById(season).populate('episodes');
                for (let episode of seasonDb.episodes) {
                    for (let source of episode.sources) {
                        let sourceDb = await Source.findById(source);
                        let posterUrl = undefined;
                        let sourceUrl = undefined;
                        if (typeof sourceDb.poster_key === 'string' && sourceDb.poster_key.indexOf('http') === -1) {
                            posterUrl = await requestUrl(sourceDb.poster_key);
                        }
                        if (sourceDb.key.indexOf('http') === -1) {
                            sourceUrl = await requestUrl(sourceDb.key);
                        }
                        if (posterUrl !== undefined) {
                            await Source.findByIdAndUpdate(sourceDb._id, { poster_key: posterUrl })
                        }
                        if (sourceUrl !== undefined) {
                            await Source.findByIdAndUpdate(sourceDb._id, { key: sourceUrl })
                        }
                    }
                }
            }

            console.log('Updated sources of show by name ' + show.name);
        }

        console.log('Completed process of update urls');
    } catch (error) {
        console.log('Error in update urls: ' + error.message);
    }
};

const requestUrl = async(key) => {
    try {
        const accessToken = (await OneDriveSecret.findOne()).access_token;
        const response = await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${key}/createLink`, {
            "type": "embed"
        }, { headers: { authorization: 'Bearer ' + accessToken }, 'Content-Type': 'application/json', 'Retry-After': 2.128 });
        return response.data.link.webUrl.replace('embed', 'download');
    } catch (error) {
        throw error;
    }
}

setInterval(main, 1 * 60 * 60 * 60 * 1000);

main();