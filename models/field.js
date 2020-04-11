module.exports = (sequelize, type) => {
    var Field =  sequelize.define('Field', {
        id: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        name: type.STRING,
        FK_Tap: type.STRING
    });

    Field.associate = function (modules) {
        Field.belongsTo(modules.Tap, {foreignKey: 'FK_Tap', as: 'Tap'});
    };

    return Field;
};