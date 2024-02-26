const multer = require('multer');
const path = require('path');
// Configure the destination and filename for uploaded images
const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, 'src/public/uploads/');
    // },
    destination: path.join(__dirname, 'src', 'public', 'uploads'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;