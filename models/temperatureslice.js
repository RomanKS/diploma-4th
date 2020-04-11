module.exports = (sequelize, type) => {
    return sequelize.define('TemperatureSlice', {
        id: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Temperature: type.STRING,
        Date: type.DATE
    })
};