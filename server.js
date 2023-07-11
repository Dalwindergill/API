const express = require('express');
const dotenv = require('dotenv');
const app = express();
const errorHandler=require('./middlewares/errorhandler')
const middleware=require('./middlewares/loggers')
const bootcamp = require('./routes/bootcamp');
const bodyParser = require('body-parser')
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db')

connectDB()
app.use('/',middleware)

app.use('/api/v1/', bootcamp);
app.use(errorHandler)

app.listen(process.env.PORT);
