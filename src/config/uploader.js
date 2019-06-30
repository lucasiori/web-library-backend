const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) { cb(err) };

                const fileName = `${hash.toString('hex')}.jpg`;

                cb(null, fileName);
            });
        }
    })
};