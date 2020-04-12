const LocalStrategy = require('passport-local');
var User = require('../models').User;

module.exports = function(passport) {
    console.log("LocalStrategy called");
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({where: {UserName: username}}).then((user) => {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (user.Password !== password) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            });
        }
    ));
}