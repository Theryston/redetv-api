const Logo = require('../../models/Logo');
const RedetvLogo = require('../../models/RedetvLogo');

module.exports = {
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
    }
}