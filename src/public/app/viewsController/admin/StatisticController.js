const Order = require('../../models/Order');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

class StatisticController {
    index(req, res, next) {
        res.render('admin/statistic/index', { pageTitle: 'Thống kê', layout: 'admin', isAdmin: req.session.isAdmin, });
    }

    countOrdersOfWeek(req, res, next) {
        const today = moment();
        today.set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        const data = [];
        for (let i = 6; i >= 0; i--) {
            let curDay = moment(today).subtract(i, 'days');
            let dayAfter = moment(curDay).add(1, 'days');

            data.push(
                Order.countDocuments({
                    status: 4,
                    updatedAt: { $gte: curDay.toDate(), $lt: dayAfter.toDate() }
                }).then(count => {
                    return { date: curDay.toDate(), count };
                })
            );
        }

        Promise.all(data)
            .then(data => {
                res.send(data);
            })
            .catch(next);
    }
}

module.exports = new StatisticController;