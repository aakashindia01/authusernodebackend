const dotenv = require('dotenv');
dotenv.config();
require('./config/oauth-setup');
const express = require('express');
const auth = require('./routes/auth');
const requestResponseLogger = require('./middleware/logger');
const logger = require('./utils/logger')
const connectDb = require('./utils/db');
const passport = require('passport');
const session = require('express-session')


const app = express();

app.use(session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(requestResponseLogger)



app.use(express.json());

app.use('/api/auth', auth);

const PORT = process.env.PORT || 3000;

connectDb(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
    });
})
