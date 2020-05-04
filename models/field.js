module.exports = (sequelize, type) => {
    var Field =  sequelize.define('Field', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Name: type.STRING,
        Number: type.INTEGER
    });

    Field.associate = function (modules) {
        Field.belongsTo(modules.Tap, {foreignKey: 'FK_Tap', as: 'Tap'});
    };

    Field.associate = (models) => {
        Field.belongsToMany(models.Tap, {
            through: 'TapToField',
            as: 'Tap',
            foreignKey: 'FK_Field'
        });
    };

    return Field;
};