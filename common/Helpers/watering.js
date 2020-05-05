let models = require('../../models');

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
                StartTime: new Date(wateringSession.StartDate).getTime(),
                EndTime: new Date(wateringSession.EndDate).getTime(),
                RequiredHumidity: wateringSession.Humidity,
                InProgress: wateringSession.InProgress
            });
        });
    }

    return finalWateringArray;
};

let getWateringSessionByFieldNumber = async (inProgressFalg, fieldNumber) => {
    let WateringModel = null,
        FieldModel    = await models.Field.findAll({
        where: {
            Number: fieldNumber
        }
    });


    if (FieldModel && FieldModel[0]) {
        WateringModel = await models.WateringSession.findAll({
            where: {
                FK_Field: FieldModel[0].ID,
                InProgress: "1"
            }
        });

        return WateringModel && WateringModel[0] ? WateringModel[0] : null;
    }
};


module.exports = {
    getHumidityArray : getHumidityArray,
    getTemperatureArray : getTemperatureArray,
    getWateringSessions : getWateringSessions,
    getWateringSessionByFieldNumber : getWateringSessionByFieldNumber
};