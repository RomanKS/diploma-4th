module.exports = (sequelize, type) => {
    return sequelize.define('Pump', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Opened: {
            type: type.BOOLEAN,
            defaultValue: '0'
        }
    })
};