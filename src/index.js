const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const { format } = require('timeago.js');

const path = require('path');

//initializations
const app = express();
require('./database');


//Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log('file info'+file);
        cb(null, uuid() + path.extname(file.originalname));
    }
});
 
app.use(multer({storage}).single('image'));

//global variables
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});


//routes
app.use(require('./routes/index'));


//static files
app.use(express.static(path.join(__dirname, 'public')));


//start server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});