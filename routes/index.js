var express = require('express');
var router = express.Router();
var User = require('../models').User;
var Tap = require('../models').Tap;
var Field = require('../models').Field;
var TapToField = require('../models').TapToField;
var UserType = require('../models').UserType;
const passport = require('passport');
const auth = require('./auth');


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

router.get('/TapToField', function (req, res, next) {
    // TapToField.create({
    //     FieldID: "tap1",
    //     TapID: "tap1"
    // }).then(Tap => {
    //     res.json({success: true});
    // });
    TapToField.create({
        FK_Field: "tap1",
        FK_Tap: "tap1"
    }).then(Tap => {
        res.json({success: true});
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

module.exports = router;
