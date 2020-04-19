module.exports = (sequelize, type) => {
    var Field =  sequelize.define('Field', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        name: type.STRING
        //FK_Tap: type.STRING
    });

    Field.associate = function (modules) {
        Field.belongsTo(modules.Tap, {foreignKey: 'FK_Tap', as: 'Tap'});
    };

    Field.associate = (models) => {
        Field.belongsToMany(models.Tap, {
            through: 'TapToField',
            as: 'Tap',
            foreignKey: 'FK_Tap'
        });
    };

    return Field;
};