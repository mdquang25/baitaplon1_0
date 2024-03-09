const { QRPay, BanksObject, VietQRService } = require('vietnam-qr-pay');

module.exports = {
    qrContent: function (total, message) {
        const qrPay = QRPay.initVietQR({
            bankBin: BanksObject.vietinbank.bin,
            bankNumber: '101877369079',
            amount: total,
            purpose: message,
        })
        const content = qrPay.build();
        return content;
    }
}
