let Error = require('./Error');

class wateringSessionError extends Error {
    constructor(description, fileName, functionName, wateringSessionId) {
        super(description, fileName, functionName);

        this.wateringSessionId = wateringSessionId;
    }

    getwateringSessionId () {
        return this.wateringSessionId;
    }

    getErrorJson() {
        let errorJson = super.getErrorJson();

        errorJson['wateringSessionId'] = this.getwateringSessionId();

        return errorJson;
    }
}

module.exports = wateringSessionError;