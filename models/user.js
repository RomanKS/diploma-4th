const jwt = require('jsonwebtoken');

module.exports = (sequelize, type) => {
    const User = sequelize.define('User', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        UserName: type.STRING,
        FirstName: type.STRING,
        LastName: type.STRING,
        Password: type.STRING,
        FK_UserType: type.STRING
    });


    User.associate = function (modules) {
        User.belongsTo(modules.UserType, {foreignKey: 'FK_UserType', as: 'UserType'});
    };

    User.prototype.validatePassword = function (password) {
        return this.Password == password;
    };
    User.prototype.generateJWT = function() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            email: this.UserName,
            id: this.ID,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'secret');
    };
    User.prototype.toAuthJSON = function() {
        return {
            _id: this.ID,
            email: this.UserName,
            token: this.generateJWT(),
        };
    };


    return User;
};