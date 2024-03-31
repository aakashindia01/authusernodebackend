const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const auth = require('./routes/auth');
const requestResponseLogger = require('./middleware/logger');
const logger = require('./utils/logger')
const connectDb = require('./utils/db');
const passport = require('passport');
const session = require('express-session')
const cors = require('cors');
var MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

app.use(cors({
    origin: ['http://localhost:4200', 'https://accounts.google.com/o/oauth2/v2/auth'], // Allow requests from Angular app
    credentials: true // Allow credentials (cookies)
  }));
let store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'userSessions'
  });
  store.on('error', function(error) {
    console.log(error);
  });
  app.use((req, res, next)=>{
    // console.log('res', res)
     console.log('1srt-->',req.session);
     console.log(req.user)
     next();
   })
  app.use(session({
    secret: process.env.secret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: false,
    saveUninitialized: true
  }));


app.use(requestResponseLogger)



require('./config/oauth-setup');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use('/api/auth', auth);

const PORT = process.env.PORT || 3000;

connectDb(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
    });
})
