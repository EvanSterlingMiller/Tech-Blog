const path = require('path')
const express = require('express')
const routes = require('./controllers')
const sequelize = require('./config/connection')
const helpers = require('./utils/helpers')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const exphbs = require('express-handlebars')
const hbs = exphbs.create({ helpers })

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

const session = require('express-session')

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'super secret',
    cookie: {
        maxAge: 15000
    },
    rolling: true,
    resave: true,
        saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
}

app.use(session(sess))
app.use(routes)

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening on port 3001'))
})
