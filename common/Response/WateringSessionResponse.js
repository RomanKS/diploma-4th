let wateringConstants = require('../constants/watering');

class WateringSessionResponse {
    constructor(action, type) { //ToDo add action: start watering or end watering
        this.fieldId     = null;
        this.startDate   = null;
        this.endDate     = null;
        this.arrayOfTap  = null;
        this.pumpId      = null;
        this.humidity    = null;
        this.wateringId = null;

        if (action === wateringConstants.actionOpen) {
            this.action = wateringConstants.actionOpen;
        } else {
            this.action = wateringConstants.actionClose;
        }

        if (type === wateringConstants.humidityWateringType) {
            this.type = wateringConstants.humidityWateringType;
        } else {
            this.type = wateringConstants.dateWateringType;
        }
    }

    setwateringSessionData (wateringSessionModel) {
        this.wateringId = wateringSessionModel.ID ? wateringSessionModel.ID : null;

        if (this.type === wateringConstants.humiditywateringType) {
            this.humidity  = wateringSessionModel.Humidity ? wateringSessionModel.Humidity : null;
        } else {
            this.startDate = wateringSessionModel.StartDate ? wateringSessionModel.StartDate : null;
            this.endDate   = wateringSessionModel.EndDate ? wateringSessionModel.EndDate : wateringSessionModel.EndDate;
        }
    }

    setArrayOfTapData (arrayOfTap) {
        this.arrayOfTap = arrayOfTap;
    }

    setFieldData (fieldModel) {
        this.fieldId   = fieldModel.ID ? fieldModel.ID : null;
    }

    setPumpData (pumpModel) {
        this.pumpId     = pumpModel.ID ? pumpModel.ID : null;
    }

    getResponseJson () {
        return {
            Action: this.action,
            wateringSession: {
                ID        : this.wateringId,
                StartDate : this.startDate,
                EndDate   : this.endDate,
                Humidity  : this.humidity,
                Type      : this.type
            },
            ArrayOfTap: this.arrayOfTap,
            Field: {
                ID   : this.fieldId
            },
            Pump: {
                ID     : this.pumpId
            }
        }
    }
}

module.exports = WateringSessionResponse;