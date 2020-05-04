module.exports = (sequelize, type) => {
    return sequelize.define('TemperatureSlice', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Temperature: type.STRING,
        Date: type.DATE
    })
};