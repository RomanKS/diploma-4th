var express = require('express');
var router = express.Router();
var User = require('../models').User;
var Tap = require('../models').Tap;
var Field = require('../models').Field;
var TapToField = require('../models').TapToField;
var UserType = require('../models').UserType;
var WateringSession = require('../models').WateringSession;
var Pump = require('../models').Pump;
const passport = require('passport');
const auth = require('./auth');


router.get('/', async (req,res,next)=>{

    res.render('index', {name: 'Roman'});
});

router.get('/JobTest', function (req, res, next) {
    var schedule = require('node-schedule');

    var date = new Date().getTime();

    date = date + 5000;
    date = new Date(date);

    schedule.scheduleJob('Roman', date, function(){
        console.log('-------------');
    });

    schedule.scheduleJob('Roman2', date, function(){
        console.log('++++++++++++++');
    });


    var t = schedule.scheduledJobs["Roman"];

    t.cancel();

    res.json({mess: "mess"});
});


// router.get('/TapToField', function (req, res, next) {
//     // TapToField.create({
//     //     FieldID: "tap1",
//     //     TapID: "tap1"
//     // }).then(Tap => {
//     //     res.json({success: true});
//     // });
//     /*TapToField.create({
//         FK_Field: "tap1",
//         FK_Tap: "tap1"
//     }).then(Tap => {
//         res.json({success: true});
//     });*/
//
//     // wateringSession.create({
//     //     ID: "newWetSes",
//     //     FK_Field: "tap1",
//     //     StartDate: new Date(),
//     //     EndDate: new Date()
//     // }).then(Tap => {
//     //     res.json({success: 'true1111'});
//     // });
//
//     // Pump.create({
//     //     ID: "Pump",
//     //     Opened: "0"
//     // }).then(Tap => {
//     //     res.json({success: 'true1111'});
//     // });
//
//     let WateringConstants = require('../common/constants/watering');
//
//     let type   = req.query.type,
//         action = req.query.action;
//
//     if (type == WateringConstants.humidityWateringType) {
//         type = WateringConstants.humidityWateringType;
//     } else {
//         type = WateringConstants.dateWateringType;
//     }
//
//     if (action === WateringConstants.actionOpen) {
//         action = WateringConstants.actionOpen;
//     } else {
//         action = WateringConstants.actionClose;
//     }
//
//     var WateringController = require('../controllers/Watering').startWatering(action, type);
//
//     WateringController.then(resp => {
//         if (!resp["error"]) {
//             resp = resp.getResponseJson();
//         }
//
//         req.app.io.emit('response', resp);
//         res.json({t:1, response: resp});
//     });
//
// });


router.get('/fillData', async function (req, res, next) {
    var models           = require('../models'),
        Tap              = models.Tap,
        Pump             = models.Pump,
        WateringSession = models.WateringSession,
        Field            = models.Field,
        HumiditySlice    = models.HumiditySlice,
        TemperatureSlice = models.TemperatureSlice,
        TapToField       = models.TapToField,
        Log              = require('../common/Error/WateringSessionError');


    await Tap.create({
            Name: "tap_name_1",
            Opened: "0",
            ControllerID: "tapController_1"
        });

    await Tap.create({
            Name: "tap_name_2",
            Opened: "0",
            ControllerID: "tapController_2"
        });

    await Pump.create({
            Opened: "0"
        });

    await Field.create({
            Name: "field_name_1"
        });

    await WateringSession.create({
            FK_Field: "field_1",
            StartDate: new Date(),
            EndDate: new Date(),
            Humidity: "50"
        });

    await HumiditySlice.create({
            FK_Field: "field_1",
            Humidity: "70",
            Date: new Date()
        });

    // await TemperatureSlice.create({
    //         Temperature: "25",
    //         Date: new Date()
    //     });
    //
    // await TapToField.create({
    //         FK_Field: "field_1",
    //         FK_Tap: "tap_1",
    //     });

    await TapToField.create({
            FK_Field: "field_1",
            FK_Tap: "tap_2",
        });
    /*
    await Tap.findOrCreate({
        where: {
            ID: "tap_1"
        },
        defaults: {
            ID: "tap_1",
            Name: "tap_name_1",
            Opened: "0",
            ControllerID: "tapController_1"
        }
    });

    await Tap.findOrCreate({
        where: {
            ID: "tap_2"
        },
        defaults: {
            ID: "tap_2",
            Name: "tap_name_2",
            Opened: "0",
            ControllerID: "tapController_2"
        }
    });

    await Pump.findOrCreate({
        where: {
            ID: "pump_1"
        },
        defaults: {
            ID: "pump_1",
            Opened: "0"
        }
    });

    await Field.findOrCreate({
        where: {
            ID: "field_1"
        },
        defaults: {
            ID: "field_1",
            Name: "field_name_1"
        }
    });

    await WateringSession.findOrCreate({
        where: {
            ID: "wateringSession_1"
        },
        defaults: {
            ID: "wateringSession_1",
            FK_Field: "field_1",
            StartDate: new Date(),
            EndDate: new Date(),
            Humidity: "50"
        }
    });

    await HumiditySlice.findOrCreate({
        where: {
            ID: "humiditySlice_1"
        },
        defaults: {
            ID: "humiditySlice_1",
            FK_Field: "field_1",
            Humidity: "70",
            Date: new Date()
        }
    });

    await TemperatureSlice.findOrCreate({
        where: {
            ID: "temperatureSlice_1"
        },
        defaults: {
            ID: "temperatureSlice_1",
            Temperature: "25",
            Date: new Date()
        }
    });

    await TapToField.findOrCreate({
        where: {
            FK_Tap: "tap_1"
        },
        defaults: {
            FK_Field: "field_1",
            FK_Tap: "tap_1",
        }
    });

    await TapToField.findOrCreate({
        where: {
            FK_Tap: "tap_2"
        },
        defaults: {
            FK_Field: "field_1",
            FK_Tap: "tap_2",
        }
    });
*/
    res.json({success: true});
});

router.get('/addFielddddd', async (req, res, next) => {
    var models           = require('../models'),
        Tap              = models.Tap,
        Pump             = models.Pump,
        WateringSession = models.WateringSession,
        HumiditySlice   = models.HumiditySlice,
        Field            = models.Field;

    let field1 = await Field.create({
        Name: "field1",
        Number: 1,
        ID: "dc8d7380-87a6-11ea-a291-c7c9efb4ebe5"
    });

    let field2 = await Field.create({
        Name: "field2",
        Number: 2,
        ID: "8b077b70-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field3",
        Number: 3,
        ID: "8b0a88b0-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field4",
        Number: 4,
        ID: "8b0b4c00-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field5",
        Number: 5,
        ID: "8b0be840-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field6",
        Number: 6,
        ID: "8b0c8480-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field7",
        Number: 7,
        ID: "8b0cd2a0-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field8",
        Number: 8,
        ID: "8b0d6ee0-87c2-11ea-a63e-c330d02c972b"
    });

    await Field.create({
        Name: "field9",
        Number: 9,
        ID: "8b0de410-87c2-11ea-a63e-c330d02c972b"
    });

    await HumiditySlice.create({
        Humidity: "40",
        Date: new Date(),
        FK_Field: "dc8d7380-87a6-11ea-a291-c7c9efb4ebe5"
    });

    await HumiditySlice.create({
        Humidity: "70",
        Date: new Date(),
        FK_Field: "8b077b70-87c2-11ea-a63e-c330d02c972b"
    });

    await HumiditySlice.create({
        Humidity: "30",
        Date: new Date(),
        FK_Field: "8b0de410-87c2-11ea-a63e-c330d02c972b"
    });


    let tap1 = await Tap.create({
        Name: "tap1",
        Number: 1,
        ControllerID: "controller1",
    });

    let tap2 = await Tap.create({
        Name: "tap2",
        Number: 2,
        ControllerID: "controller1",
    });

    await TapToField.create({
        FK_Field: "dc8d7380-87a6-11ea-a291-c7c9efb4ebe5",
        FK_Tap: tap1.ID,
    });

    await TapToField.create({
        FK_Field: "dc8d7380-87a6-11ea-a291-c7c9efb4ebe5",
        FK_Tap: tap2.ID,
    });

    await Pump.create({

    });


    res.json({});
});

router.get('/addUserType', (req, res, next) => {
    UserType.create({
        Code: 'code',
        Type: 'worker'
    });

    UserType.create({
        Code: 'code',
        Type: 'admin'
    });

    res.end();
});


router.get('/addTemperatureSlice', (req, res, next) => {
    require('../models').TemperatureSlice.create({
        Temperature: '25',
        Date: new Date(new Date().getTime() + 50000)
    });

    require('../models').TemperatureSlice.create({
        Temperature: '18',
        Date: new Date(new Date().getTime())
    });

    res.end();
});

router.get('/addUser', (req, res, next) => {
    User.create({
        UserName: 'lll@gmail.com',
        FirstName: 'Roman',
        LastName: 'Romanov',
        Password: '12345',
        FK_UserType: '742f79c0-8d2b-11ea-b6b0-e3bee5fc7f97'
    });

    res.end();
});

router.get('/allField', async (req, res, next) => {
    var models           = require('../models'),
        Tap              = models.Tap,
        Pump             = models.Pump,
        WateringSession = models.WateringSession,
        Field            = models.Field;

    var fields = await Field.findAll({});

    res.json(JSON.stringify(fields));
});



/* GET home page. */
router.get('/add', function(req, res, next) {
    User.create({
        UserName: "Roman4",
        FirstName: "Roman4",
        LastName: "Roman4",
        Password: "Roman4",
        FK_UserType: "SecondType"
    })
        .then(user => res.json({user: user}));
    /*req.app.dbModels['UserType'].create({
      ID: "SecondType",
      Code: "123",
      Type: "RomanType"
    })
        .then(UserType => {
          req.app.dbModels['User'].create({
            UserName: "Roman",
            FirstName: "Roman",
            LastName: "Roman",
            Password: "Roman",
            FK_UserType: "SecondType"
          })
              .then(user => res.json({UserType: UserType, user: user}));
        });*/


    //res.render('index', { title: 'Express', helloMsg: ''});
});

router.get('/addTapToDo', function (req, res, next) {
    Tap.create({
        ID: "tap1",
        Name: "Name",
        Opened: "1",
        ControllerID: "ControllerID"
    }).then(Tap => {
        Field.create({
            ID: "tap1",
            Name: "Name",
        }).then(Field => {
            res.json({success: true});
        });
    });
});

router.get('/find', function(req, res, next) {

    User.findOne({
        where: {UserName: 'Roman4'}, include: [{
            model: UserType,
            as: 'UserType'
        }]
    })
        .then((findedUser) => {
            // Get the User with Company datas included
            console.log(findedUser);
            res.json({findedUser});

            // Get the company record only
            // console.log(findedUser.company)
        })
});

router.get('/seyHi', function(req, res, next) {
    let name = req.query.name;
    let seyHi = `Hello, ${name} and welcome to Node.JS`;


    res.render('index', { title: 'Express', helloMsg: seyHi});
});

//token not requered
// user variable should contain object with "username" and "password"
// like { "username": "Roman4", "password": "Roman4" }
// and not like: { "user": { "username": "Roman4", "password": "Roman4" } }
router.post('/login', auth.optional, function (req, res, next) {
    const { body: { user } } = req;


    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.json({error: true});
    })(req, res, next);
});

//token requiered
router.get('/current', auth.required, (req, res, next) => {
    const id = req.body.id;

    return User.findOne({
        where: {
            ID: id
        }
    })
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});


router.post('/getdata', async (req, res, next) => {
    let arrayOfFields = await Field.findAll();

    res.json({response: JSON.stringify(arrayOfFields)});
});

module.exports = router;
