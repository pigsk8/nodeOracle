const express = require('express');
const app = express();
const cors = require('cors');
const xss = require('xss-clean');

//ENVs
const config = require('./config')
const port = config.SERVER_PORT
const contextPath = config.CONTEXT_PATH

//Logs
const logger = require('./config/logger.config')

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({
    extended: true
}));

// sanitize request data
app.use(xss());

//cors
app.use(cors({
    origin: '*'
}));

//routes
const routes = require('./routes');
app.use(contextPath, routes);

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
})
