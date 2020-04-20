class Error {
    constructor (description, fileName, functionName) {
        this.description  = description;
        this.fileName     = fileName;
        this.functionName = functionName;
    }

    getDescription () {
        return this.description;
    }

    getFileName () {
        return this.description;
    }

    getFunctionName () {
        return this.functionName;
    }

    getErrorJson () {
        return {
            'error'        : true,
            'description'  : this.getDescription,
            'fileName'     : this.getDescription,
            'functionName' : this.getDescription
        }
    }
}

module.exports = Error;