const Source = require('../../models/Source');
const { Readable } = require('stream');
const oneDriveAPI = require('onedrive-api');
const OneDriveSecret = require('../../models/OneDriveSecret');
const axios = require('axios');

module.exports = {
    createSource: async ({ main, show_name, key }) => {
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

    addPosterSource: async (source_id, poster_key) => {
        try {
            const source = await Source.findByIdAndUpdate(source_id, {
                poster_key,
            });
            return source;
        } catch (error) {
            throw error;
        }
    },

    uploadToOnedrive: async (binary, folder, file) => {
        try {
            const accessToken = (await OneDriveSecret.findOne()).access_token;

            const fileStream = new Readable({
                read() {
                    this.push(binary);
                    this.push(null);
                }
            });
            folder = folder.split('/');
            let folderOnedrive;
            for (let i = 0; i < folder.length; i++) {
                folderOnedrive = await oneDriveAPI.items.createFolder({
                    accessToken: accessToken,
                    rootItemId: i == 0 ? 'root' : folderOnedrive.id,
                    name: folder[i]
                })
            };

            const fileUploaded = await oneDriveAPI.items.uploadSession({
                accessToken: accessToken,
                filename: file.filename,
                fileSize: file.fileSize,
                readableStream: fileStream,
                parentId: folderOnedrive.id
            }, () => { });

            return fileUploaded.id;
        } catch (error) {
            console.error(error)
            throw error;
        }
    },

    getSource: async (source_id) => {
        try {
            const source = await Source.findById(source_id);
            return source;
        } catch (error) {
            throw error;
        }
    },

    getAllSource: async () => {
        try {
            const source = await Source.find({ limit: 12 });
            return source;
        } catch (error) {
            throw error;
        }
    },

    getDownloadUrl: async (key) => {
        try {
            const access_token = (await OneDriveSecret.findOne()).access_token;
            const response = await axios.get('https://graph.microsoft.com/v1.0/drive/items/' + key, { headers: { authorization: 'Bearer ' + access_token } });
            return response.data['@microsoft.graph.downloadUrl'];
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}