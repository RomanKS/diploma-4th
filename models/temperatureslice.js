module.exports = (sequelize, type) => {
    return sequelize.define('TemperatureSlice', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Temperature: type.STRING,
        Date: type.DATE
    })
};