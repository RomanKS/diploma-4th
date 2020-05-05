module.exports = (sequelize, type) => {
    const Tap =  sequelize.define('Tap', {
        ID: {
            type: type.UUID,
            defaultValue: type.UUIDV1,
            primaryKey: true
        },
        Name: type.STRING,
        Opened: {
            type: type.BOOLEAN,
            defaultValue: '0'
        },
        ControllerID: type.STRING,
        Number: type.INTEGER
    });

    Tap.associate = (models) => {
        Tap.belongsToMany(models.Field, {
            through: 'TapToField',
            as: 'Field',
            foreignKey: 'FK_Tap'
        });
    };

    return Tap;
};