const Sequelize     = require('sequelize');
var db = {};

const sequelize = new Sequelize('My_New_DB', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    });

var models = {
    User: sequelize.import('./user'),
    UserType: sequelize.import('./usertype'),
    Tap: sequelize.import('./tap'),
    Field: sequelize.import('./field'),
    TapToField: sequelize.import('./taptofield'),
    Pump: sequelize.import('./pump'),
    WaterringSession: sequelize.import('./waterringsession'),
    HumiditySlice: sequelize.import('./humidityslice'),
    TemperatureSlice: sequelize.import('./temperatureslice')
};


    Object.keys(models).forEach(modelKey => {
        // Create model associations
        if ('associate' in models[modelKey]) {
            models[modelKey].associate(models);
        }
    });



models.sequelize = sequelize;
models.Sequelize = Sequelize;



// db = {
//     Sequelize: Sequelize,
//     sequelize: sequelize,
//     usertype: sequelize.import(__dirname + '/usertype.js'),
//     tap: sequelize.import(__dirname + '/tap.js'),
//     field: sequelize.import(__dirname + '/field.js'),
//     pump: sequelize.import(__dirname + '/pump.js'),
//     waterringsession: sequelize.import(__dirname + '/waterringsession.js'),
//     humidityslice: sequelize.import(__dirname + '/humidityslice.js'),
//     temperatureslice: sequelize.import(__dirname + '/temperatureslice.js')
// };
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = models;