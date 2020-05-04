class Error {
    constructor (fileName, description, functionName) {
        this.description  = description ? description : null;
        this.fileName     = fileName ? fileName : null;
        this.functionName = functionName ? functionName : null;
    }

    getDescription () {
        return this.description;
    }

    getFileName () {
        return this.fileName;
    }

    getFunctionName () {
        return this.functionName;
    }

    setDescription (description) {
        this.description = description;
    }

    setFunctionName (functionName) {
        this.functionName = functionName;
    }

    getErrorJson () {
        return {
            'error'        : true,
            'description'  : this.getDescription(),
            'fileName'     : this.getFileName(),
            'functionName' : this.getFunctionName()
        }
    }
}

module.exports = Error;