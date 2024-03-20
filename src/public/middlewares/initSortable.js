

const initSortable = (req, res, next) =>{
    res.locals.sort = {
        enabled: false,
        type: 'default',
    }
    if (req.query.hasOwnProperty('sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        Object.assign(res.locals.sort, {
            enabled: true,
            type: isValidType ? req.query.type : 'default',
            fieldName: req.query.field,
        });
    }
    next();
}

module.exports = initSortable;