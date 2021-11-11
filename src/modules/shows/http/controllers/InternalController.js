const InternalService = require('../services/InternalService')
const ShowService = require('../services/ShowService')

module.exports = {
    createLogo: async (req, res) => {
        try {
            const datas = req.body;
            const key = await ShowService.uploadToOnedrive(req.file.buffer, datas.folder, { fileSize: req.file.size, filename: Date.now().toString() + '-' + req.file.originalname });
            const logo = await InternalService.createLogo({ link: datas.link, company_name: datas.company_name, active: datas.active, key })
            res.json(logo);
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    getLogo: async (req, res) => {
        try {
            const { logo_id } = req.params;
            const logo = await InternalService.getLogo(logo_id);
            const logoUrl = await ShowService.getDownloadUrl(logo.key);
            res.json({ link: logo.link, company_name: logo.company_name, active: logo.active, url: logoUrl, _id: logo._id });
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    getAllLogos: async (req, res) => {
        try {
            const logos = await InternalService.getAllLogos();

            const logosWithUrl = [];
            for (let logo of logos) {
                const logoUrl = await ShowService.getDownloadUrl(logo.key);
                logosWithUrl.push({ link: logo.link, company_name: logo.company_name, active: logo.active, url: logoUrl, _id: logo._id })
            }

            res.json(logosWithUrl)
        } catch (error) {
            res.status(500).json({ error })
        }
    },
    updateLogo: async (req, res) => {
        try {
            const { logo_id } = req.params;
            const datas = req.body;
            const logo = await InternalService.updateLogo(logo_id, datas);
            res.json(logo);
        } catch (error) {
            throw error;
        }
    },
    deleteLogo: async (req, res) => {
        try {
            const { logo_id } = req.params;
            await InternalService.deleteLogo(logo_id);
            res.json({ OK: true });
        } catch (error) {
            throw error;
        }
    }
}