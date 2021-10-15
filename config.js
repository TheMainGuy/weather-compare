const fs = require('fs')
const util = require('util')

let log_file = fs.createWriteStream('debug.log', { flags: 'a' })
log('Open or create debug.log file.')

const logFile = fs.realpathSync('debug.log')
log(logFile)
let cacheFile
try {
    cacheFile = fs.realpathSync('cache.json')
} catch { }

module.exports = {
    apiKey: '7b20b1b908b9119e34c22a567209746514c8ad610e77d52d5b',
    cacheFile: cacheFile,
    logFile: logFile,
    cacheSaveInterval: 8
}

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    log_file.write(logEntry + '\n')
    console.log(logEntry)
}