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


module.exports = {
    getHumidityArray : getHumidityArray,
    getTemperatureArray : getTemperatureArray,
    getWateringSessions : getWateringSessions
};