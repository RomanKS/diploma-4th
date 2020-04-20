module.exports = (sequelize, type) => {
    return sequelize.define('Pump', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Opened: type.BOOLEAN
    })
};