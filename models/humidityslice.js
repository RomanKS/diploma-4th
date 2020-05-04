module.exports = (sequelize, type) => {
    const HumiditySlice =  sequelize.define('HumiditySlice', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Humidity: type.STRING,
        Date: type.DATE,
        FK_Field: type.UUID
    });

    HumiditySlice.associate = function (modules) {
        HumiditySlice.belongsTo(modules.Field, {foreignKey: 'FK_UserType', as: 'Field'});
    };

    return HumiditySlice;
};