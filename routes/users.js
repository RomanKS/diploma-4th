let express        = require('express'),
    router         = express.Router(),
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

      if (userType == 'worker') {
          UserController.workerRegistration(res, user);
      } else if (userType == 'admin') {
          UserController.adminRegistration(res, user);
      }
  } else {
      return res.json({error: true});
  }
});

router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            return res.json({ user: passportUser.toAuthJSON() });
        }

        return res.json({error: true});
    })(req, res, next);
});

module.exports = router;
