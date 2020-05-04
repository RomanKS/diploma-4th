let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let schedule = require('node-schedule');


//routers initialisation
let indexRouter    = require('./routes/index'),
    wateringRout   = require('./routes/watering'),
    fieldRout      = require('./routes/field'),
    usersRouter    = require('./routes/users'),
    fieldMapRouter = require('./routes/fieldmap');

let model = require('./models');
let passport = require('passport');
require('./config/passport')(passport);

model.sequelize.sync((err)=>{});

let app = express();
app.use(passport.initialize());
app.schedulejob = schedule;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/watering', wateringRout);
app.use('/field', fieldRout);
app.use('/users', usersRouter);
app.use('/fieldmap', fieldMapRouter);

module.exports = app;
