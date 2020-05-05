let express            = require('express'),
    router             = express.Router(),
    WateringConstants  = require('../common/constants/watering'),
    WateringController = require('../controllers/Watering'),
    Error              = require('../common/Error/Error'),
    log                = new Error(`'Watering' route`);

router.post('/schedule', (req, res, next) => {
    let body           = req.body,
        startDateStr   = body.startDateStr ? body.startDateStr.trim() : null,
        endDateStr     = body.endDateStr ? body.endDateStr.trim() : null,
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

    console.log(`action in router: ${action}`);


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

    console.log(`action after checks: ${startDateStr}`);


    if ((startDateStr && endDateStr && fk_field) || (fk_field && humidity && type == WateringConstants.humidityWateringType) ) {
        //if (true) {
         startDate = new Date(startDateStr);
         endDate   = new Date(endDateStr);
         // startDate = new Date(new Date().getTime());
         // endDate   = new Date(new Date().getTime());

        console.log(`currrent date in watering: ${currentDate}`)

        if ((startDate.getTime() > currentDate.getTime() && endDate.getTime() > currentDate.getTime() && !isNaN(startDate) && !isNaN(endDate)) || (fk_field && humidity && type == WateringConstants.humidityWateringType)) {
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

//cancel watering by watering id
router.post('/cancelbyid', (req, res, next) => {
    let body       = req.body,
        wateringId = body.wateringId ? body.wateringId : null;

    if (wateringId) {
        WateringController.cancelByWateringId(req, wateringId)
            .then(response => {
                res.json(response);
            });
    }
});

//cancel watering by field number
router.post('/cancelbyfieldnumber', async (req, res, next) => {
    let body       = req.body,
        fieldNumber = body.fieldNumber ? Number(body.fieldNumber) : null;

    if (fieldNumber) {
        WateringController.cancelByFieldNumber(req, fieldNumber)
            .then(response => {
                res.json(response);
            });
    }
});

router.post('/cancelbyhumidity', (req, res, next) => {
    let body        = req.body,
        humidity    = body.humidity ? Number(body.humidity) : null,
        fieldNumber = body.fieldNumber ? Number(body.fieldNumber) : null;

    WateringController.checkHumidityWateringByFieldNumber(req, fieldNumber, humidity)
        .then(response => {
            res.json(response);
        });
});

router.get('/fielddetaildata', (req, res, next) => {
    WateringController.sendFieldDetailData(req, res);
});

module.exports = router;