module.exports = (sequelize, type) => {
    var WateringSession =  sequelize.define('wateringSession', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        StartDate: type.DATE,
        EndDate: type.DATE,
        FK_Field: type.UUID,
        Humidity: type.STRING,
        InProgress: {
            type: type.BOOLEAN,
            defaultValue: '0'
        }
    });

    WateringSession.associate = function (modules) {
        WateringSession.belongsTo(modules.Field, {foreignKey: 'FK_Field', as: 'Field'});
    };

    return WateringSession;
};