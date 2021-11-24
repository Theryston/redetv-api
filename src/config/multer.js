const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.memoryStorage({
        destination: function(req, file, callback) {
            callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1024 * 1024, // 1 PB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'video/mp4',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/gif',
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('invalid file type.'))
        }
    }
}