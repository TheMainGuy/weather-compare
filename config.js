const fs = require('fs')
const util = require('util')

let initTime = new Date().toISOString()
initTime = initTime.replace('T', ' ').replace('Z', '')
const initEntry = initTime + ' - ' + util.format('Open or create log file.')
fs.appendFileSync('Data/debug.log', initEntry + '\n')

const logFile = fs.realpathSync('Data/debug.log')
log('Logfile path: ' + logFile)

let cacheFile
try {
    cacheFile = fs.realpathSync('Data/cache.json')
} catch {
    fs.appendFileSync('Data/cache.json', '{}')
}

let cityNames
try {
    cityNames = fs.realpathSync('Data/allCities.json')
} catch { }

module.exports = {
    secret: '604daaf4-7ebb-4c7e-9ac1-44d5593c05bc',
    apiKey: '7b20b1b908b9119e34c22a567209746514c8ad610e77d52d5b',
    cacheFile: cacheFile,
    cityNamesFile: cityNames,
    countryCodesFile: 'Data/countryCodes.json',
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