let express            = require('express'),
    router             = express.Router(),
    WateringConstants  = require('../common/constants/watering'),
    WateringController = require('../controllers/Watering'),
    Error              = require('../common/Error/Error'),
    log                = new Error(`'Watering' route`),
    FieldModel         = require('../models').Field,
    HumidityModel      = require('../models').HumiditySlice;


router.get('/', async (req, res, next) => {
    res.render('fieldmap');
});

// router.post('/inprogresswatering', (req, res, next) => {
//     let inProgressWatering = WateringController.getInProcessWatering();
//
//     if (inProgressWatering) {
//         inProgressWatering.then(resp => {
//             res.json(JSON.stringify(resp));
//         });
//         return;
//     }
//
//     res.json(null);
// });

router.get('/getfielddata', async (req, res, next) => {
    let fieldsData   = FieldModel.findAll(),
        wateringData = WateringController.getInProcessWatering(),
        humidityData = HumidityModel.findAll();

    [fieldsData, wateringData, humidityData] = await Promise.all([fieldsData, wateringData, humidityData]);
    res.json({
        fieldsData: JSON.stringify(fieldsData),
        wateringData: JSON.stringify(wateringData),
        humidityData: JSON.stringify(humidityData)
    });
});

module.exports = router;