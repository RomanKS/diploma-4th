const jwt = require('jsonwebtoken');

module.exports = (sequelize, type) => {
    const User = sequelize.define('User', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        UserName: type.STRING,
        FirstName: type.STRING,
        LastName: type.STRING,
        Password: type.STRING,
        FK_UserType: type.UUID
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

    User.prototype.getUserType = async function (UserType) {
        let UserTypeModel = await UserType.findOne({
            where: {
                ID: this.FK_UserType
            }
        });

        if (UserTypeModel) {
            return UserTypeModel;
        } else {
            return null;
        }
    };

    User.prototype.getUserTypeNumber = async function (UserType) {
        let UserTypeModel = await this.getUserType(UserType);

        return UserTypeModel.Type;
    };

    User.prototype.toAuthJSON = async function(UserType) {
        return {
            _id: this.ID,
            email: this.UserName,
            userType: await this.getUserTypeNumber(UserType),
            token: this.generateJWT()
        };
    };


    return User;
};