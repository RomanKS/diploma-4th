let express        = require('express'),
    router         = express.Router(),
    models         = require('../models');
    UserController = require('../controllers/User');
const passport     = require('passport'),
      auth         = require('./auth');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registration', (req, res, next) => {
  let body      = req.body,
      user      = null,
      userType  = body.userType ? body.userType.trim() : null,
      userName  = body.userName ? body.userName.trim() : null,
      firstName = body.firstName ? body.firstName.trim() : null,
      lastName  = body.lastName ? body.lastName.trim() : null,
      password  = body.password ? body.password.trim() : null;

  if (password && userName) {
      user = {
          userName  : userName,
          firstName : firstName,
          lastName  : lastName,
          password  : password
      };

      if (userType == 'Manager') {
          UserController.managerRegistration(res, user);
      } else if (userType == 'Spectator') {
          UserController.spectatorRegistration(res, user);
      } else {
          return res.json({error: true});
      }
  } else {
      return res.json({error: true});
  }
});

router.post('/login', auth.optional,  (req, res, next) => {
    const { body: { user } } = req;

    return passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            let responseJson = await passportUser.toAuthJSON(models.UserType);

            return res.json({ user: responseJson });
        }

        return res.json({error: true});
    })(req, res, next);
});

module.exports = router;
