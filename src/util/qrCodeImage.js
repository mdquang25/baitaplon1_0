const QRCode = require('qrcode');
const path = require('path');

module.exports = {
    generateQRCode: (code, filename) => {
        return new Promise((resolve, reject) => {
            QRCode.toFile(path.join(__dirname, '..', 'public', 'qr', filename), code, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('QR code generated and saved:', '/src/public/qr/' + filename);
                    resolve('/qr/' + filename);
                }
            });
        });
    }
}
