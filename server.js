const express = require('express');
const dotenv = require('dotenv');
const fileupload=require('express-fileupload')
const app = express();
const errorHandler=require('./middlewares/errorhandler')
const middleware = require('./middlewares/loggers')
const path=require('path')
const bootcamp = require('./routes/bootcamp');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const bodyParser = require('body-parser')
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileupload())
// set static folder

app.use(express.static(path.join(__dirname,'public')))

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db')

connectDB()
app.use('/',middleware)

app.use('/api/v1/', bootcamp);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler)

app.listen(process.env.PORT);
