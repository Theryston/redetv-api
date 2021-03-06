const InternalService = require("../services/InternalService");
const ShowService = require("../services/ShowService");

module.exports = {
  createNewLogo: async (req, res) => {
    try {
      const datas = req.body;
      const key = await ShowService.uploadToOnedrive(
        req.file.buffer,
        datas.folder,
        {
          fileSize: req.file.size,
          filename: Date.now().toString() + "-" + req.file.originalname,
        }
      );
      const newLogo = await InternalService.createNewLogo({
        link: datas.link,
        company_name: datas.company_name,
        active: true,
        key,
      });
      res.json(newLogo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  getAllNewLogos: async (req, res) => {
    try {
      const logos = await InternalService.getAllNewLogos();
      const logosWithUrl = [];

      for (const logo of logos) {
        const url = await ShowService.getDownloadUrl(logo.key);
        logosWithUrl.push({
          link: logo.link,
          company_name: logo.company_name,
          url: url,
          _id: logo._id,
        });
      }

      res.json([...logosWithUrl]);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getNewLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      const logo = await InternalService.getNewLogo(logo_id);
      const url = await ShowService.getDownloadUrl(logo.key);
      res.json({
        link: logo.link,
        company_name: logo.company_name,
        url: url,
        _id: logo._id,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  deleteNewLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      await InternalService.deleteNewLogo(logo_id);
      res.json({ OK: true });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  updateNewLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      const datas = req.body;
      if (req.file) {
        const key = await ShowService.uploadToOnedrive(
          req.file.buffer,
          datas.folder,
          {
            fileSize: req.file.size,
            filename: Date.now().toString() + "-" + req.file.originalname,
          }
        );
        const logo = await InternalService.updateNewLogo(logo_id, {
          ...datas,
          key,
        });
        res.json(logo);
      } else {
        const logo = await InternalService.updateNewLogo(logo_id, datas);
        res.json(logo);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },

  createLogo: async (req, res) => {
    try {
      const datas = req.body;
      const key = await ShowService.uploadToOnedrive(
        req.file.buffer,
        datas.folder,
        {
          fileSize: req.file.size,
          filename: Date.now().toString() + "-" + req.file.originalname,
        }
      );
      const logo = await InternalService.createLogo({
        link: datas.link,
        company_name: datas.company_name,
        active: datas.active,
        key,
      });
      res.json(logo);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      const logo = await InternalService.getLogo(logo_id);
      const logoUrl = await ShowService.getDownloadUrl(logo.key);
      res.json({
        link: logo.link,
        company_name: logo.company_name,
        active: logo.active,
        url: logoUrl,
        _id: logo._id,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  getAllLogos: async (req, res) => {
    try {
      const logos = await InternalService.getAllLogos();

      const logosWithUrl = [];
      for (let logo of logos) {
        const logoUrl = await ShowService.getDownloadUrl(logo.key);
        logosWithUrl.push({
          link: logo.link,
          company_name: logo.company_name,
          active: logo.active,
          url: logoUrl,
          _id: logo._id,
        });
      }

      res.json(logosWithUrl);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  updateLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      const datas = req.body;
      if (req.file) {
        const key = await ShowService.uploadToOnedrive(
          req.file.buffer,
          datas.folder,
          {
            fileSize: req.file.size,
            filename: Date.now().toString() + "-" + req.file.originalname,
          }
        );
        const logo = await InternalService.updateLogo(logo_id, {
          ...datas,
          key,
        });
        res.json(logo);
      } else {
        const logo = await InternalService.updateLogo(logo_id, datas);
        res.json(logo);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  deleteLogo: async (req, res) => {
    try {
      const { logo_id } = req.params;
      await InternalService.deleteLogo(logo_id);
      res.json({ OK: true });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  createRedetvLogo: async (req, res) => {
    try {
      const key = await ShowService.uploadToOnedrive(
        req.file.buffer,
        "redetv/logo",
        {
          fileSize: req.file.size,
          filename: Date.now().toString() + "-" + req.file.originalname,
        }
      );
      const logo = await InternalService.createRedetvLogo(key);
      res.json(logo);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  updateRedetvLogo: async (req, res) => {
    try {
      const { redetvLogo_id } = req.params;
      const key = await ShowService.uploadToOnedrive(
        req.file.buffer,
        "redetv/logo",
        {
          fileSize: req.file.size,
          filename: Date.now().toString() + "-" + req.file.originalname,
        }
      );
      const logo = await InternalService.updateRedetvLogo(redetvLogo_id, key);
      const url = await ShowService.getDownloadUrl(key);
      res.json({ _id: logo._id, url });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  getRedetvLogo: async (req, res) => {
    try {
      const redetvLogo = await InternalService.getRedetvLogo();
      const url = await ShowService.getDownloadUrl(redetvLogo.key);
      res.json({ _id: redetvLogo._id, url });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  addView: async (req, res) => {
    try {
      const ip = req.body.user_ip;
      const view = await InternalService.addView(ip);
      res.json(view);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  setViewOffline: async (req, res) => {
    try {
      const ip = req.body.user_ip;
      const view = await InternalService.setViewOffline(ip);
      res.json(view);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  getViewsCount: async (req, res) => {
    try {
      const viewsCount = await InternalService.getViewsCount();
      res.json({ views_count: viewsCount });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  getOnlineViewsCount: async (req, res) => {
    try {
      const viewsCount = await InternalService.getOnlineViewsCount();
      res.json({ views_count: viewsCount });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  addViewToSource: async (req, res) => {
    try {
      const { source_id } = req.params;
      const viewsCount = await InternalService.addViewToSource(source_id);
      res.json({ views_count: viewsCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },

  addLikeToSource: async (req, res) => {
    try {
      const { source_id } = req.params;
      const likesCount = await InternalService.addLikeToSource(source_id);
      res.json({ likes_count: likesCount });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};
