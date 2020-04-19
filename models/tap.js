module.exports = (sequelize, type) => {
    const Tap =  sequelize.define('Tap', {
        ID: {
            type: type.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        Name: type.STRING,
        Opened: type.BOOLEAN,
        ControllerID: type.STRING
    });

    Tap.associate = (models) => {
        Tap.belongsToMany(models.Field, {
            through: 'TapToField',
            as: 'Field',
            foreignKey: 'FK_Field'
        });
    };

    return Tap;
};