const { QRPay, BanksObject, VietQRService } = require('vietnam-qr-pay');

module.exports = {
    qrContent: function (total, message) {
        const qrPay = QRPay.initVietQR({
            bankBin: BanksObject.mbbank.bin,
            bankNumber: '0382740405',
            amount: total,
            purpose: message,
        })
        const content = qrPay.build();
        return content;
    }
}
