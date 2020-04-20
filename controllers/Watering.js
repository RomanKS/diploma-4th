let models           = require('../models'),
    WateringSession = models.WateringSession,
    Field            = models.Field,
    Pump             = models.Pump,
    Tap              = models.Tap,
    HumiditySlice    = models.HumiditySlice,
    TapToField       = models.TapToField,
    utils            = require('../common/Helpers/Utils/utils'),
    Log              = require('../common/Error/wateringSessionError'),
    wateringConstants = require('../common/constants/watering');

let executewateringFlow = async (action, type, WateringSessionModle) => {
    let currentPumpModelArray     = [],
        currentPumpModel          = null,
        fieldID                   = null,
        arrayOFTapToFields        = [],
        wateringSessionResponse  = new require('../common/Response/WateringSessionResponse'),
        arrayOfTap                = [],
        currentHumiditySliceModel = null,
        flag                      = '0';

    wateringSessionResponse = new wateringSessionResponse(action, type);

    flag = action === wateringConstants.actionOpen ? '1' : '0';

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

                    arrayOfTap.push(tapToFieldModel.FK_Tap);
                });

                currentHumiditySliceModel = await HumiditySlice.findOne({
                    where: {
                        FK_Field: fieldID
                    }
                });

                if (currentHumiditySliceModel && arrayOfTap.length) {
                    wateringSessionResponse.setwateringSessionData(WateringSessionModle);
                    wateringSessionResponse.setArrayOfTapData(arrayOfTap);
                    wateringSessionResponse.setFieldData(WateringSessionModle.Field);
                    wateringSessionResponse.setPumpData(currentPumpModel);
                } else {
                    return new Log(
                        'no "HumiditySlice" for field with id: ' + fieldID + ', or "arrayOfTap" is empty. "arrayOfTap" length: ' + arrayOfTap.length,
                        'watering.js',
                        'executewateringFlow',
                        WateringSessionModle.ID
                    );
                }
            } else {
                return new Log(
                    'no records in "TapToField" model for field id: ' + fieldID,
                    'watering.js',
                    'executewateringFlow',
                    WateringSessionModle.ID
                );
            }
        } else {
            return new Log(
                '"wateringSession" does not contain "Field" or "Field" does not contain ID',
                'watering.js',
                'executewateringFlow',
                WateringSessionModle.ID
            );
        }
    } else {
        return new Log(
            'no available pump in db',
            'watering.js',
            'executewateringFlow',
            null
        );
    }

    return wateringSessionResponse;
};

let startWatering = async (action, type) => {
    let currentDate      = new Date(),
        WateringSessionModle = null;

    WateringSessionModle = await WateringSession.findOne({
        where: {ID: 'wateringSession_1'}, include: [{ //in "where" section we should use "startDate" field instead of "ID". the "ID" was taken in order to simplify testing
            model: Field,
            as: 'Field'
        }]
    });

    if (WateringSessionModle) {
        return executewateringFlow (action, type, WateringSessionModle);
    }
};

module.exports = {
    startWatering : startWatering
};