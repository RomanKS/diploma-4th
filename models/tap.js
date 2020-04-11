module.exports = (sequelize, type) => {
    return sequelize.define('Field', {
        id: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Name: type.STRING,
        Opened: type.BOOLEAN,
        ControllerID: type.STRING
    })
};