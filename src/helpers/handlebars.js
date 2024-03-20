const HandleBars = require('handlebars');

module.exports = {
    sum: (a, b) => a + b,
    subtract: (a, b) => a - b,
    valueAt: (a, b) => a[b],
    mult: (a, b) => a * b,
    sortable: (sort, field) => {
        const type = field === sort.fieldName ? sort.type : 'default';
        const icons = {
            default: 'fa-regular fa-sort',
            asc: 'fa-regular fa-arrow-down-a-z',
            desc: 'fa-regular fa-arrow-down-z-a',
        }
        const nextTypes = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        }
        const icon = icons[type];
        const nextType = nextTypes[type];
        const href = HandleBars.escapeExpression(`?sort&field=${field}&type=${nextType}`);
        const output = `<a href="${href}"><i class="${icon}"></i></a>`;
        return new HandleBars.SafeString(output);
    },
}