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

    return User;
};