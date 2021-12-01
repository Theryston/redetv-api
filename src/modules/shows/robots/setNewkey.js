const Source = require('../models/Source');
const Logo = require('../models/Logo');
const New = require('../models/New');
const Season = require('../models/Season');
const Show = require('../models/Show');
const OneDriveSecret = require('../models/OneDriveSecret');
const axios = require('axios');

const main = async() => {
    let shows = await Show.find().populate('posters');
    let logos = await Logo.find();
    let news = await New.find();

    for (let show of shows) {
        try {
            for (let poster of show.posters) {
                if (poster.key.indexOf('http') === -1) {
                    let url = await requestUrl(poster.key);
                    await Source.findByIdAndUpdate(poster._id, { key: url });
                }
            }

            for (let season of show.seasons) {
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

            console.log('Updated show ' + show.name);
        } catch (error) {
            console.log('Error in update show: ' + show.name);

        }
    }

    for (let logo of logos) {
        try {
            if (logo.key.indexOf('http') === -1) {
                let url = await requestUrl(logo.key);
                await Logo.findByIdAndUpdate(logo._id, { key: url });
                console.log('Updated logo by company name ' + logo.company_name);
            }
        } catch (error) {
            console.log('Error in update logo: ' + logo.company_name)
        }
    }

    for (let newdata of news) {
        try {
            if (newdata.key.indexOf('http') === -1) {
                let url = await requestUrl(newdata.key);
                await New.findByIdAndUpdate(newdata._id, { key: url });
                console.log('Updated new by company name ' + newdata.company_name);
            }
        } catch (error) {
            console.log('Error in update new ' + newdata.company_name)
        }
    }

    console.log('Completed process of update urls');
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