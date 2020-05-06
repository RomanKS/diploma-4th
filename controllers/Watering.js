let models            = require('../models'),
    utils             = require('../common/Helpers/Utils/utils'),
    WateringError     = require('../common/Error/WateringSessionError'),
    wateringConstants = require('../common/constants/watering'),
    wateringHelper    = require('../common/Helpers/watering');

let startWatering = async (action, type, WateringSessionModle) => {
    let currentPumpModelArray     = [],
        currentPumpModel          = null,
        fieldID                   = null,
        arrayOFTapToFields        = [],
        wateringSessionResponse  = new require('../common/Response/WateringSessionResponse'),
        arrayOfTap                = [],
        flag                      = '0';

    wateringSessionResponse = new wateringSessionResponse(action, type);

    console.log(`------actionn: ${action}`);

    flag = action === wateringConstants.actionOpen ? '1' : '0';


    console.log(`------+++actionn: ${action} flag: ${flag}`);


    WateringSessionModle.update({
        InProgress: flag
    });
    currentPumpModelArray = await models.Pump.findAll();

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

            arrayOFTapToFields = await models.TapToField.findAll({
                where: {
                    FK_Field: fieldID
                }
            });

            if (arrayOFTapToFields.length) {
                await utils.asyncForEach(arrayOFTapToFields, async (tapToFieldModel) => {
                    await  models.Tap.update({
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

    WateringSessionModle = await models.WateringSession.create({
        FK_Field: requestJson.fk_field,
        Humidity: requestJson.humidity,
        StartDate: requestJson.startDate,
        EndDate: requestJson.endDate,
    });

    WateringSessionModle = await models.WateringSession.findAll({
        where: {ID: WateringSessionModle.ID}, include: [{
            model: models.Field,
            as: 'Field'
        }]
    });

    return WateringSessionModle ? WateringSessionModle[0] : null;
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

let getInProcessWatering = async () => {
  let inProgressWatering = await models.WateringSession.findAll({
      where: {
          InProgress: '1'
      },
      include: [{
          model: models.Field,
          as: 'Field'
      }]
  });

  return inProgressWatering && inProgressWatering.length ? inProgressWatering[0] : null;
};


let sendFieldDetailData = async (req, res) => {
    var FieldModel            = models.Field.findAll(),
        HumiditySliceModel    = models.HumiditySlice.findAll(),
        WateringSessionModel  = models.WateringSession.findAll(),
        TemperatureSliceModel = models.TemperatureSlice.findAll(),
        fieldDataArray        = [];

    [FieldModel, HumiditySliceModel, WateringSessionModel, TemperatureSliceModel] = await Promise.all([FieldModel, HumiditySliceModel, WateringSessionModel, TemperatureSliceModel]);

    FieldModel.forEach((field) => {
        fieldDataArray.push({
            Id: field.ID,
            Name: field.Name,
            ShortName: field.ShortName,
            Humidities: wateringHelper.getHumidityArray(HumiditySliceModel, field.ID),
            Temperatures: wateringHelper.getTemperatureArray(TemperatureSliceModel),
            WateringSessions: wateringHelper.getWateringSessions(WateringSessionModel, field.ID)
        });
    });

    res.json(fieldDataArray);
};


let startWateringByDate = async (req, requestJson) => {
    let WateringModel                         = await createAndGetWateringSessionModelWithDepend(requestJson),
        responseJson                          = null,
        arrayOfTapsAssosiatedWithCurrentField = [];

    if (WateringModel) {
        arrayOfTapsAssosiatedWithCurrentField = await wateringHelper.getTapsNumberConnectingToField(WateringModel.Field.ID);

        if (arrayOfTapsAssosiatedWithCurrentField.length) {
            req.app.schedulejob.scheduleJob(WateringModel.ID + wateringConstants.wateringStartSign, requestJson.startDate, function(){
                responseJson = startWatering(wateringConstants.actionOpen, wateringConstants.dateWateringType, WateringModel);

                req.app.io.emit('watering', {open: true, fieldNumber: WateringModel.Field.Number, tapsArray: arrayOfTapsAssosiatedWithCurrentField});
                sendWateringResponseToClient(responseJson);
            });

            req.app.schedulejob.scheduleJob(WateringModel.ID + wateringConstants.wateringEndSign, requestJson.endDate, function(){
                responseJson = startWatering(wateringConstants.actionClose, wateringConstants.dateWateringType, WateringModel);

                req.app.io.emit('watering', {open: false, fieldNumber: WateringModel.Field.Number, tapsArray: arrayOfTapsAssosiatedWithCurrentField});
                sendWateringResponseToClient(responseJson);
            });

            return {wateringSchedule: true};
        }
    }

    return {wateringSchedule: false};
};

let startWateringByHumidity = async (req, requestJson) => {
    let WateringModel                         = await createAndGetWateringSessionModelWithDepend(requestJson),
        responseJson                          = null,
        arrayOfTapsAssosiatedWithCurrentField = [];

    if (WateringModel) {
        arrayOfTapsAssosiatedWithCurrentField = await wateringHelper.getTapsNumberConnectingToField(WateringModel.Field.ID);

        if (arrayOfTapsAssosiatedWithCurrentField.length) {
            responseJson = startWatering(wateringConstants.actionOpen, wateringConstants.humidityWateringType, WateringModel);

            req.app.io.emit('watering', {open: true, fieldNumber: WateringModel.Field.Number, tapsArray: arrayOfTapsAssosiatedWithCurrentField});
            sendWateringResponseToClient(responseJson);

            return {wateringSchedule: true};
        }
    }

    return {wateringSchedule: false};
};


// let startWatering2 = async (req, requestJson) => {
//     let WateringSessionModle                  = null,
//         field                                 = null,
//         arrayOfTapsAssosiatedWithCurrentField = [];
//
//     field = await models.Field.findOne({
//         where: {
//             ID: requestJson.fk_field
//         }
//     });
//
//     if (field) {
//         WateringSessionModle = await createAndGetWateringSessionModelWithDepend(requestJson);
//
//         if (WateringSessionModle) {
//             arrayOfTapsAssosiatedWithCurrentField = await wateringHelper.getTapsNumberConnectingToField(WateringSessionModle.Field.ID);
//
//             if (requestJson.type === wateringConstants.humidityWateringType) {
//                 console.log(`action inside: ${requestJson.action}`);
//                 let res = executewateringFlow(requestJson.action, requestJson.type, WateringSessionModle);
//
//                 sendWateringResponseToClient(res);
//             } else if (requestJson.type === wateringConstants.dateWateringType) {
//                 req.app.schedulejob.scheduleJob(WateringSessionModle.ID + wateringConstants.wateringStartSign, requestJson.startDate, function(){
//                     let res = executewateringFlow(wateringConstants.actionOpen, wateringConstants.dateWateringType, WateringSessionModle);
//
//                     req.app.io.emit('watering', {open: true, fieldNumber: WateringSessionModle.Field.Number, tapsArray: arrayOfTapsAssosiatedWithCurrentField});
//                     sendWateringResponseToClient(res);
//                 });
//
//                 req.app.schedulejob.scheduleJob(WateringSessionModle.ID + wateringConstants.wateringEndSign, requestJson.endDate, function(){
//                     let res = executewateringFlow(wateringConstants.actionClose, wateringConstants.dateWateringType, WateringSessionModle);
//                     req.app.io.emit('watering', {open: false, fieldNumber: WateringSessionModle.Field.Number, tapsArray: arrayOfTapsAssosiatedWithCurrentField});
//                     sendWateringResponseToClient(res);
//                 });
//             }
//         }
//     } else {
//         console.log(`no field with current fk_field`);
//     }
// };

let cancelByWateringId = async (req, wateringId) => {
    let WateringSessionModel = null;

    WateringSessionModel = await models.WateringSession.findOne({
        where: {
            ID: wateringId
        }
    });

    return await cancelWatering(req, WateringSessionModel);
};


let cancelWatering = async (req, WateringModel) => {
    let startJobName         = null,
        endJobName           = null,
        startJob             = null,
        endJob               = null,
        canceled             = false,
        startJobCancelStatus = false,
        endJobCancelStatus   = false;

    if (WateringModel && !WateringModel.InProgress) {
        return {canceled: true};
    } else if (WateringModel) {
        startJobName = WateringModel.ID + wateringConstants.wateringStartSign;
        endJobName   = WateringModel.ID + wateringConstants.wateringEndSign;
        startJob     = req.app.schedulejob.scheduledJobs[startJobName];
        endJob       = req.app.schedulejob.scheduledJobs[endJobName];

        if (startJob) {
            startJobCancelStatus = startJob.cancel();
        }
        if (endJob) {
            endJobCancelStatus = endJob.cancel();
        }

        await WateringModel.update({
            InProgress: "0"
        });

        canceled = true;
    }

    return {canceled: canceled};
};

let cancelByFieldNumber = async (req, fieldNumber) => {
    let WateringModel = await wateringHelper.getWateringSessionByFieldNumber('1', fieldNumber);

    return await cancelWatering(req, WateringModel);
};

let checkHumidityWateringByFieldNumber = async (req, fieldNumber, humidity) => {
    let WateringModel = await wateringHelper.getWateringSessionByFieldNumber('1', fieldNumber);

    if (WateringModel && humidity >= WateringModel.Humidity) {
        return await cancelWatering(req, WateringModel);
    } else {
        return false;
    }
};

module.exports = {
    startWateringByDate   : startWateringByDate,
    startWateringByHumidity : startWateringByHumidity,
    cancelWatering        : cancelWatering,
    cancelByWateringId    : cancelByWateringId,
    getInProcessWatering  : getInProcessWatering,
    sendFieldDetailData   : sendFieldDetailData,
    cancelByFieldNumber   : cancelByFieldNumber,
    checkHumidityWateringByFieldNumber : checkHumidityWateringByFieldNumber
};