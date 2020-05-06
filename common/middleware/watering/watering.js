let checkScheduleWateringByHumidityArguments = (req, res, next) => {
    let body           = req.body,
        fk_field       = body.fk_field ? body.fk_field : null,
        humidity       = body.humidity ? body.humidity : null;

    if (fk_field && humidity) {
        res.locals.requestJson = {
            fk_field: fk_field,
            humidity: humidity
        };
        next();
    } else {
        res.status(400).send({error: 'check passed parrams'});
    }
};

let checkScheduleWateringByDateArguments = (req, res, next) => {
    let body           = req.body,
        startDateStr   = body.startDateStr ? body.startDateStr.trim() : null,
        endDateStr     = body.endDateStr ? body.endDateStr.trim() : null,
        startDate      = null,
        endDate        = null,
        fk_field       = body.fk_field ? body.fk_field : null,
        currentDate    = new Date();

    if (startDateStr && endDateStr && fk_field) {
        startDate = new Date(startDateStr);
        endDate = new Date(endDateStr);

        if (startDate.getTime() > currentDate.getTime() && endDate.getTime() > currentDate.getTime() && !isNaN(startDate) && !isNaN(endDate)) {
            res.locals.requestJson = {
                startDate: startDate,
                endDate: endDate,
                fk_field: fk_field
            };
            next();
        } else {
            res.status(400).send({error: 'check date params'});
        }
    } else {
        res.status(400).send({error: 'check passed parrams'});
    }
};


module.exports = {
    checkScheduleWateringByHumidityArguments: checkScheduleWateringByHumidityArguments,
    checkScheduleWateringByDateArguments : checkScheduleWateringByDateArguments
};