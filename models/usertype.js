module.exports = (sequelize, type) => {
    return sequelize.define('UserType', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Code: type.STRING,
        Type: type.STRING
    })
};