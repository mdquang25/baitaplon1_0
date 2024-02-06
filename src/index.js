const express = require('express');
const app = express();
const port = process.env.port || 8080;
const handlebar = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('./config/mongodb-session');
const cookieParser = require('cookie-parser');


const db = require('./config/db');
const router = require('./routes');

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(cookieParser());
app.use(session);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine(
    'hbs',
    handlebar.engine({
        helpers: {
            sum: (a, b) => a + b,
            subtract: (a, b) => a - b,
            valueAt: (a, b) => a[b],
        },
        extname: 'hbs',
    }),
);
app.set('views', path.join(__dirname, 'sources', 'views'));
app.set('view engine', 'hbs');

db.connect();
router(app);

app.listen(
    { port: port, host: "104.196.232.237" }, 
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    }
);
