module.exports = (sequelize, type) => {
    var WateringSession =  sequelize.define('wateringSession', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        StartDate: type.DATE,
        EndDate: type.DATE,
        FK_Field: type.STRING,
        Humidity: type.STRING
    });

    WateringSession.associate = function (modules) {
        WateringSession.belongsTo(modules.Field, {foreignKey: 'FK_Field', as: 'Field'});
    };

    return WateringSession;
};