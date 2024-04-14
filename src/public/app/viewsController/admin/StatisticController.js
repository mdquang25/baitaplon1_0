const Order = require('../../models/Order');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

class StatisticController {
    index(req, res, next) {
        res.render('admin/statistic/index', { pageTitle: 'Thống kê', layout: 'admin', });
    }

    countOrders(req, res, next) {
        var dayNum = parseInt(req.query.dayNum);
        console.log('dayNum: ', dayNum);
        if (dayNum < 3 || dayNum > 31)
            dayNum = 7;
        const today = moment();
        today.set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        const done = [];
        const created = [];
        for (let i = dayNum-1; i >= 0; i--) {
            let curDay = moment(today).subtract(i, 'days');
            let dayAfter = moment(curDay).add(1, 'days');

            done.push(
                Order.find({
                    status: 4,
                    updatedAt: { $gte: curDay.toDate(), $lt: dayAfter.toDate() }
                }).then(docs => {
                    let total = 0;
                    docs.forEach(doc => total += parseInt(doc.total));
                    return { date: curDay.toDate(), count: docs.length, total };
                })
            );
            created.push(
                Order.countDocuments({
                    createdAt: { $gte: curDay.toDate(), $lt: dayAfter.toDate() }
                }).then(count => {
                    return { date: curDay.toDate(), count };
                })
            );
        }

        Promise.all(done)
            .then(done => {
                Promise.all(created)
                    .then(created => {
                        res.send({ done, created });
                    })
                    .catch(next);
            })
            .catch(next);
    }
}

module.exports = new StatisticController;