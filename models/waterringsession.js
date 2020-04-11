module.exports = (sequelize, type) => {
    var WaterringSession =  sequelize.define('WaterringSession', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        StartDate: type.DATE,
        EndDate: type.DATE,
        FK_Field: type.STRING
    });

    WaterringSession.associate = function (modules) {
        WaterringSession.belongsTo(modules.Field, {foreignKey: 'FK_Field', as: 'Field'});
    };

    return WaterringSession;
};