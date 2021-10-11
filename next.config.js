const fs = require('fs')
const config = require('./config.js')
const util = require('util')

log_file = fs.createWriteStream('debug.log', { flags: 'a' })
let initLog = 'Initialized server with the following settings:\n' +
    'Cache file: ' + config.cacheFile + '\n' +
    'Cache save interval: ' + config.cacheSaveInterval
log(initLog)

let citiesCache = JSON.parse(fs.readFileSync(config.cacheFile, 'utf8'))
log('Loaded cities cache from: ' + config.cacheFile)

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    log_file.write(logEntry + '\n')
    console.log(logEntry)
}

module.exports = {
    serverRuntimeConfig: {
        citiesCache: citiesCache
    }
}