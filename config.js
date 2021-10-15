const fs = require('fs')
const util = require('util')

let initTime = new Date().toISOString()
initTime = initTime.replace('T', ' ').replace('Z', '')
const initEntry = initTime + ' - ' + util.format('Open or create log file.')
fs.appendFileSync('debug.log', initEntry + '\n')

const logFile = fs.realpathSync('debug.log')
log('Logfile path: ' + logFile)

let cacheFile
try {
    cacheFile = fs.realpathSync('cache.json')
} catch { }

let citiesCSV
try {
    citiesCSV = fs.realpathSync('worldcities.csv')
} catch { }

module.exports = {
    apiKey: '7b20b1b908b9119e34c22a567209746514c8ad610e77d52d5b',
    cacheFile: cacheFile,
    citiesCSV: citiesCSV,
    logFile: logFile,
    cacheSaveInterval: 8
}

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    fs.appendFileSync(logFile, logEntry + '\n', () => { })
    console.log(logEntry)
}