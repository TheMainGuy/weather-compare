const fs = require('fs')

const cacheFile = fs.realpathSync('cache.json')
const logFile = fs.realpathSync('debug.log')

module.exports = {
    apiKey: '7b20b1b908b9119e34c22a567209746514c8ad610e77d52d5b',
    cacheFile: cacheFile,
    logFile: logFile,
    cacheSaveInterval: 8
}