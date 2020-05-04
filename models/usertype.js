module.exports = (sequelize, type) => {
    return sequelize.define('UserType', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Code: type.STRING,
        Type: type.STRING
    })
};