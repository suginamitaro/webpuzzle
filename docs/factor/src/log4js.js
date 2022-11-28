class Log4JSDummyLogger {
    costructor() {
        this.level = '';
    }
    debug() {};
    isDebugEnabled() {return false};
    fatal() {};
    error() {};
    warn() {};
    info() {};
    debug() {};
    trace() {};
}

function getLogger() {
    return new Log4JSDummyLogger();
}

exports.getLogger = getLogger;
