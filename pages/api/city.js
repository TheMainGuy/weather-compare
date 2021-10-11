const https = require('https')
const fs = require('fs');
const util = require('util');
import * as config from 'config.js'

let citiesCache = {}
let cacheCount = 0
let initDone = false
let log_file

export default async function handler(req, res) {

    if (!initDone) {
        initServer()
    }

    let { id } = req.query

    if (cityCached(id)) {
        res.status(200).send(citiesCache[id])
        return
    }

    let splitId = id.split('_')
    let lat = splitId[1]
    let lng = splitId[2]

    const url = 'https://api.troposphere.io/climate/' + lat + ',' + lng + '?token=' + config.apiKey
    await getDataFromAPI(id, url, res)
}

function cityCached(id) {
    if (id in citiesCache) {
        return true
    }
    return false
}

function cacheCity(id, json) {
    let splitId = id.split('_')
    let name = splitId[0]
    json.data.city = name
    citiesCache[id] = json
    log('Added city ' + id + ' to cities cache.')
    saveCache()
}

function saveCache() {
    cacheCount++
    if (cacheCount === config.cacheSaveInterval) {
        cacheCount = 0
        fs.writeFile(config.cacheFile, JSON.stringify(citiesCache), function (err) {
            if (err) {
                return log(err)
            }
            log('Saved cities cache to ' + config.cacheFile)
        })
    }
}

async function getDataFromAPI(id, url, res) {
    return new Promise(resolve => {
        https.get(url, response => {
            let data = ''

            response.on('data', (chunk) => {
                data += chunk
            })

            response.on('end', () => {
                let json = JSON.parse(data)
                cacheCity(id, json)
                res.status(200).json(citiesCache[id])
                Promise.resolve();
            })

        }).on("error", (err) => {
            res.status(400).json({
                error: err.message,
            })
            Promise.resolve()
        })
    })
}

function initServer() {
    initDone = true

    log_file = fs.createWriteStream('debug.log', { flags: 'a' })
    let initLog = 'Initialized server with the following settings:\n' +
        'Cache file: ' + config.cacheFile + '\n' +
        'Cache save interval: ' + config.cacheSaveInterval
    log(initLog)

    citiesCache = JSON.parse(fs.readFileSync(config.cacheFile, 'utf8'))
    log('Loaded cities cache from: ' + config.cacheFile)
}

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    log_file.write(logEntry + '\n')
    console.log(logEntry)
}