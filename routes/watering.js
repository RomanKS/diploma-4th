let express            = require('express'),
    router             = express.Router(),
    WateringConstants  = require('../common/constants/watering'),
    WateringController = require('../controllers/Watering'),
    Error              = require('../common/Error/Error'),
    log                = new Error(`'Watering' route`);

router.post('/schedulewatering', (req, res, next) => {
    let body           = req.body,
        start_millisec = body.start_millisec ? parseInt(body.start_millisec) : null,
        end_millisec   = body.end_millisec ? parseInt(body.end_millisec) : null,
        startDate      = null,
        endDate        = null,
        type           = body.type ? body.type : null,
        action         = body.action ? body.action : null,
        fk_field       = body.fk_field ? body.fk_field : null,
        humidity       = body.humidity ? body.humidity : null,
        currentDate    = new Date(),
        requestJson    = {
            action: null,
            fk_field: null,
            startDate: null,
            endDate: null,
            type: null,
            humidity: null,
        };

    if (type == WateringConstants.humidityWateringType) {
        type = WateringConstants.humidityWateringType;
    } else {
        type = WateringConstants.dateWateringType;
    }

    if (action === WateringConstants.actionOpen) {
        action = WateringConstants.actionOpen;
    } else {
        action = WateringConstants.actionClose;
    }

    if ((start_millisec && end_millisec && fk_field) || (fk_field && humidity && type == WateringConstants.humidityWateringType) ) {
        //if (true) {
         startDate = new Date(start_millisec);
         endDate   = new Date(end_millisec);
         startDate = new Date(new Date().getTime() + 5000);
         endDate   = new Date(new Date().getTime() + 7000);

        if ((startDate > currentDate && endDate > currentDate && !isNaN(startDate) && !isNaN(endDate)) || (fk_field && humidity && type == WateringConstants.humidityWateringType)) {
            requestJson['action'] = action;
            requestJson['fk_field'] = fk_field;
            requestJson['startDate'] = startDate;
            requestJson['endDate'] = endDate;
            requestJson['type'] = type;
            requestJson['humidity'] = humidity;

            WateringController.startWatering(req, requestJson);
        } else {
            log.setDescription(`sent 'start_millisec' | 'end_millisec' param represent wrond date (the date smaller than current or the amount of milliseconds can't be transformed to the date)`);
            log.setFunctionName(`rout name is: 'taptofield'`);

            res.json({response: log.getErrorJson()});
            return;
        }
    } else {
        log.setDescription(`the 'start_millisec' and|or 'end_millisec' and|or 'fk_field' param(s) wasn't send`);
        log.setFunctionName(`rout name is: 'schedulewatering'`);

        res.json({response: log.getErrorJson()});
        return;
    }
    res.json({response: {scheduled: true}});
});

router.post('/cancelwatering', (req, res, next) => {
    let body       = req.body,
        wateringId = body.wateringId ? body.wateringId : null;

    if (wateringId) {
        WateringController.cancelWatering(req, wateringId)
            .then(response => {
                res.json(response);
            });
    }
});

router.get('/fielddetaildata', (req, res, next) => {
    WateringController.sendFieldDetailData(req, res);
});

module.exports = router;