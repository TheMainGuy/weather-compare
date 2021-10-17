const fs = require('fs')
const config = require('./config.js')
const util = require('util')

let initLog = 'Initialized server with the following settings:\n' +
    'Cache file: ' + config.cacheFile + '\n' +
    'Cache save interval: ' + config.cacheSaveInterval
log(initLog)

let cityNames = JSON.parse(fs.readFileSync(config.cityNamesFile, 'utf8'))
log('Loaded city names from: ' + config.cityNamesFile)

let citiesCache = JSON.parse(fs.readFileSync(config.cacheFile, 'utf8'))
log('Loaded cities cache from: ' + config.cacheFile)

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    fs.appendFileSync(config.logFile, logEntry + '\n', () => { })
    console.log(logEntry)
}
module.exports = {
    serverRuntimeConfig: {
        config: config,
        cityNames: cityNames.data,
        citiesCache: citiesCache
    }
}