const Logo = require('../../models/Logo');
const RedetvLogo = require('../../models/RedetvLogo');
const View = require('../../models/View');
const Source = require('../../models/Source');
const New = require('../../models/New');

module.exports = {
    createNewLogo: async (datas) => {
        try {
            const newLogo = await New.create(datas);
            return newLogo;
        } catch (error) {
            throw error;
        }
    },
    getAllNewLogos: async () => {
        try {
            const logos = await New.find();
            return logos;
        } catch (error) {
            throw error;
        }
    },
    getNewLogo: async (_id) => {
        try {
            const newLogo = await New.findById(_id);
            return newLogo;
        } catch (error) {
            throw error;
        }
    },
    deleteNewLogo: async (_id) => {
        try {
            await New.findByIdAndDelete(_id);
            return true;
        } catch (error) {
            throw error;
        }
    },
    updateNewLogo: async (_id, datas) => {
        try {
            const newLogo = await New.findByIdAndUpdate(_id, datas);
            return newLogo;
        } catch (error) {
            throw error;
        }
    },

    createLogo: async (datas) => {
        try {
            const logo = await Logo.create(datas);
            return logo;
        } catch (error) {
            throw error;
        }
    },
    getLogo: async (logo_id) => {
        try {
            const logo = await Logo.findById(logo_id);
            return logo;
        } catch (error) {
            throw error;
        }
    },
    getAllLogos: async () => {
        try {
            const logos = await Logo.find();
            return logos;
        } catch (error) {
            throw error;
        }
    },
    updateLogo: async (logo_id, datas) => {
        try {
            const logo = await Logo.findByIdAndUpdate(logo_id, datas);
            return logo;
        } catch (error) {
            throw error;
        }
    },
    deleteLogo: async (logo_id) => {
        try {
            await Logo.findByIdAndDelete(logo_id);
            return true;
        } catch (error) {
            throw error;
        }
    },

    createRedetvLogo: async (key) => {
        try {
            const logo = await RedetvLogo.create({ key });
            return logo;
        } catch (error) {
            throw error;
        }
    },

    updateRedetvLogo: async (redetvLogo_id, key) => {
        try {
            const logo = await RedetvLogo.findOneAndUpdate(redetvLogo_id, { key });
            return logo;
        } catch (error) {
            throw error;
        }
    },

    getRedetvLogo: async () => {
        try {
            const redetvLogo = await RedetvLogo.find();
            return redetvLogo[0];
        } catch (error) {
            throw error;
        }
    },

    addView: async (ip) => {
        try {
            const viewExists = await View.findOne({ 'ip': ip });
            if (viewExists) {
                await View.findOneAndUpdate({ 'ip': ip }, { online: true });
                return { online: true };
            }

            const view = await View.create({ ip });
            return view;
        } catch (error) {
            throw error;
        }
    },

    setViewOffline: async (ip) => {
        try {
            await View.findOneAndUpdate({ 'ip': ip }, { online: false });
            console.log(ip)
            return { online: false };
        } catch (error) {
            throw error;
        }
    },

    getViewsCount: async () => {
        try {
            const views = await View.find();
            return views.length + 500;
        } catch (error) {
            throw error;
        }
    },

    getOnlineViewsCount: async () => {
        try {
            const views = await View.find({ 'online': true });
            return views.length;
        } catch (error) {
            throw error;
        }
    },

    addViewToSource: async (source_id) => {
        try {
            const source = await Source.findById(source_id);
            await Source.findByIdAndUpdate(source_id, { views_count: source.views_count + 1 });
            return source.views_count + 1;
        } catch (error) {
            throw error;
        }
    },

    addLikeToSource: async (source_id) => {
        try {
            const source = await Source.findById(source_id);
            await Source.findByIdAndUpdate(source_id, { like_count: source.like_count + 1 });
            return source.like_count + 1;
        } catch (error) {
            throw error;
        }
    }
}