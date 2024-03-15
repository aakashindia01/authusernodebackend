const dotenv = require('dotenv');
const express = require('express');
const auth = require('./routes/auth');
const requestResponseLogger = require('./middleware/logger');
const logger = require('./utils/logger')
const connectDb = require('./utils/db')

dotenv.config();
const app = express();

app.use(requestResponseLogger)
app.use(express.json());

app.use('/api/auth', auth);

const PORT = process.env.PORT || 3000;

connectDb(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
    });
})
