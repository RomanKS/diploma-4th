module.exports = (sequelize, type) => {
    const HumiditySlice =  sequelize.define('HumiditySlice', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Humidity: type.STRING,
        Date: type.DATE,
        FK_Field: type.STRING
    });

    HumiditySlice.associate = function (modules) {
        HumiditySlice.belongsTo(modules.Field, {foreignKey: 'FK_UserType', as: 'Field'});
    };

    return HumiditySlice;
};