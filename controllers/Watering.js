let models            = require('../models'),
    WateringSession   = models.WateringSession,
    FieldModel        = models.Field,
    Pump              = models.Pump,
    Tap               = models.Tap,
    TapToField        = models.TapToField,
    utils             = require('../common/Helpers/Utils/utils'),
    WateringError     = require('../common/Error/WateringSessionError'),
    wateringConstants = require('../common/constants/watering');

let executewateringFlow = async (action, type, WateringSessionModle) => {
    let currentPumpModelArray     = [],
        currentPumpModel          = null,
        fieldID                   = null,
        arrayOFTapToFields        = [],
        wateringSessionResponse  = new require('../common/Response/WateringSessionResponse'),
        arrayOfTap                = [],
        flag                      = '0';

    wateringSessionResponse = new wateringSessionResponse(action, type);

    flag = action === wateringConstants.actionOpen ? '1' : '0';

    WateringSessionModle.InProgress = flag;
    currentPumpModelArray = await Pump.findAll();

    if (currentPumpModelArray.length) {
        currentPumpModel = currentPumpModelArray[0];
        currentPumpModel = await currentPumpModel.update({
                Opened: flag
            }, {
                returning: true,
                plain: true
            }
        );

        if (WateringSessionModle.Field && WateringSessionModle.Field.ID) {
            fieldID = WateringSessionModle.Field.ID;

            arrayOFTapToFields = await TapToField.findAll({
                where: {
                    FK_Field: fieldID
                }
            });

            if (arrayOFTapToFields.length) {
                await utils.asyncForEach(arrayOFTapToFields, async (tapToFieldModel) => {
                    await Tap.update({
                        Opened: flag
                    }, {
                        where: {
                            ID: tapToFieldModel.FK_Tap
                        }
                    });

                    arrayOfTap.push({ID:tapToFieldModel.FK_Tap});
                });

                if (arrayOfTap.length) {
                    wateringSessionResponse.setwateringSessionData(WateringSessionModle);
                    wateringSessionResponse.setArrayOfTapData(arrayOfTap);
                    wateringSessionResponse.setFieldData(WateringSessionModle.Field);
                    wateringSessionResponse.setPumpData(currentPumpModel);
                } else {
                    return new WateringError(
                        'no "HumiditySlice" for field with id: ' + fieldID + ', or "arrayOfTap" is empty. "arrayOfTap" length: ' + arrayOfTap.length,
                        'watering.js',
                        'executewateringFlow',
                        WateringSessionModle.ID
                    );
                }
            } else {
                return new WateringError(
                    'no records in "TapToField" model for field id: ' + fieldID,
                    'watering.js',
                    'executewateringFlow',
                    WateringSessionModle.ID
                );
            }
        } else {
            return new WateringError(
                '"wateringSession" does not contain "Field" or "Field" does not contain ID',
                'watering.js',
                'executewateringFlow',
                WateringSessionModle.ID
            );
        }
    } else {
        return new WateringError(
            'no available pump in db',
            'watering.js',
            'executewateringFlow',
            null
        );
    }

    return wateringSessionResponse;
};

let createAndGetWateringSessionModelWithDepend = async (requestJson) => {
  let WateringSessionModle = null;

    WateringSessionModle = await WateringSession.create({
        FK_Field: requestJson.fk_field,
        Humidity: requestJson.humidity,
        StartDate: requestJson.startDate,
        EndDate: requestJson.endDate,
    });

    WateringSessionModle = await WateringSession.findOne({
        where: {ID: WateringSessionModle.ID}, include: [{
            model: FieldModel,
            as: 'Field'
        }]
    });

    return WateringSessionModle;
};

let sendWateringResponseToClient = (response) => {
    response.then(resp => {
        if (resp instanceof WateringError) {
            resp = resp.getErrorJson();
        } else {
            resp = resp.getResponseJson();
        }

        console.log('-------       ' + JSON.stringify(resp));
    });
};

let startWatering = async (req, requestJson) => {
    let WateringSessionModle = null,
        field                = null;

    field = await FieldModel.findOne({
        where: {
            ID: requestJson.fk_field
        }
    });

    if (field) {
        WateringSessionModle = await createAndGetWateringSessionModelWithDepend(requestJson);

        if (requestJson.type === wateringConstants.humidityWateringType && WateringSessionModle) {
            let res = executewateringFlow(requestJson.action, requestJson.type, WateringSessionModle);

            sendWateringResponseToClient(res);
        } else if (requestJson.type === wateringConstants.dateWateringType && WateringSessionModle) {
            if (WateringSessionModle) {
                req.app.schedulejob.scheduleJob(WateringSessionModle.ID + wateringConstants.wateringStartSign, requestJson.startDate, function(){
                    let res = executewateringFlow(wateringConstants.actionOpen, wateringConstants.dateWateringType, WateringSessionModle);

                    sendWateringResponseToClient(res);
                });

                req.app.schedulejob.scheduleJob(WateringSessionModle.ID + wateringConstants.wateringEndSign, requestJson.endDate, function(){
                    let res = executewateringFlow(wateringConstants.actionClose, wateringConstants.dateWateringType, WateringSessionModle);

                    sendWateringResponseToClient(res);
                });
            }
        }
    } else {
        console.log(`no field with current fk_field`);
    }
};

let cancelWatering = async (req, wateringId) => {
    let WateringSessionModel = null,
        startJobName         = wateringId + wateringConstants.wateringStartSign,
        endJobName           = wateringId + wateringConstants.wateringEndSign,
        startJob             = null,
        endJob               = null,
        startJobCancelStatus = false,
        endJobCancelStatus   = false;

    var y = req.app.schedulejob.scheduledJobs['job'].cancel();


    WateringSessionModel = await WateringSession.findOne({
        where: {
            ID: wateringId
        }
    });

    if (WateringSessionModel) {
        startJob = req.app.schedulejob.scheduledJobs[startJobName];
        endJob   = req.app.schedulejob.scheduledJobs[endJobName];

        if (startJob) {
            startJobCancelStatus = startJob.cancel();
        }

        if (endJob) {
            endJobCancelStatus = endJob.cancel();
        }
    }

    return {
        startJobCancelStatus: startJobCancelStatus,
        endJobCancelStatus: endJobCancelStatus
    };
};

let getInProcessWatering = async () => {
  let inProgressWatering = await WateringSession.findAll({
      where: {
          InProgress: '1'
      }
  });

  return inProgressWatering && inProgressWatering.length ? inProgressWatering[0] : null;
};

let getHumidityArray = (HumiditySliceModel, currentFieldId) => {
    let arrayOfHumidityForField = HumiditySliceModel.filter(humidity => humidity.FK_Field == currentFieldId),
        finalHumidityArray      = [];

    if (arrayOfHumidityForField.length) {
        arrayOfHumidityForField.forEach((humidity) => {
            finalHumidityArray.push({
                Id: humidity.ID,
                Value: humidity.Humidity,
                Time: new Date(humidity.Date).getTime()
            });
        });
    }

    return finalHumidityArray;
};

let getTemperatureArray = (TemperatureSliceModel) => {
    let finalTemperatureArray = [];

    TemperatureSliceModel.forEach((temperature) => {
       finalTemperatureArray.push({
          Id: temperature.ID,
          Value: temperature.Temperature,
          Time: new Date(temperature.Date).getTime()
       });
    });

    return finalTemperatureArray;
};

let getWateringSessions = (WateringSessionModel, currentFieldId) => {
  let arrayOfWateringSessionsForField = WateringSessionModel.filter(watering => watering.FK_Field == currentFieldId),
      finalWateringArray              = [];

  if (arrayOfWateringSessionsForField) {
      arrayOfWateringSessionsForField.forEach((wateringSession) => {
          finalWateringArray.push({
              Id: wateringSession.ID,
              StartTime: wateringSession.StartDate,
              EndTime: wateringSession.EndDate,
              RequiredHumidity: wateringSession.Humidity,
              InProgress: wateringSession.InProgress
          });
      });
  }

  return finalWateringArray;
};

let sendFieldDetailData = async (req, res) => {
    var FieldModel            = models.Field.findAll(),
        HumiditySliceModel    = models.HumiditySlice.findAll(),
        WateringSessionModel  = models.WateringSession.findAll(),
        TemperatureSliceModel = models.TemperatureSlice.findAll(),
        fieldDataArray        = [];

    [FieldModel, HumiditySliceModel, WateringSessionModel, TemperatureSliceModel] = await Promise.all([FieldModel, HumiditySliceModel, WateringSessionModel, TemperatureSliceModel]);

    console.log(`TemperatureSliceModel: ${JSON.stringify(TemperatureSliceModel)}`);

    //fill up FieldDataArray with field values
    FieldModel.forEach((field) => {
        fieldDataArray.push({
            Id: field.ID,
            Name: field.Name,
            Humidities: getHumidityArray(HumiditySliceModel, field.ID),
            Temperatures: getTemperatureArray(TemperatureSliceModel),
            WateringSessions: getWateringSessions(WateringSessionModel, field.ID)
        });
    });

    res.json(fieldDataArray);
};

module.exports = {
    startWatering        : startWatering,
    cancelWatering       : cancelWatering,
    getInProcessWatering : getInProcessWatering,
    sendFieldDetailData  : sendFieldDetailData
};