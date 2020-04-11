var express = require('express');
var router = express.Router();
var User = require('../models').User;
var UserType = require('../models').UserType;

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

module.exports = router;
