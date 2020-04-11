module.exports = (sequelize, type) => {
    return sequelize.define('Pump', {
        id: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Opened: type.BOOLEAN
    })
};