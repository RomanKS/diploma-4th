const Sequelize     = require('sequelize');
var db = {};

// const sequelize = new Sequelize('My_New_DB', 'root', '12345', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

const sequelize = new Sequelize('heroku_68d2985deee609a', 'b1e15cb3c0e42d', 'a1818308', {
    host: 'eu-cdbr-west-03.cleardb.net',
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
    WateringSession: sequelize.import('./wateringsession'),
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
//     wateringsession: sequelize.import(__dirname + '/wateringsession.js'),
//     humidityslice: sequelize.import(__dirname + '/humidityslice.js'),
//     temperatureslice: sequelize.import(__dirname + '/temperatureslice.js')
// };
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = models;