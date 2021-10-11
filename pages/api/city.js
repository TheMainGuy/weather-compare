const https = require('https')
const fs = require('fs');
const util = require('util');
import * as config from 'config.js'

let citiesCache = {}
let cacheCount = 0
let initDone = false
let log_file, log_stdout

export default async function handler(req, res) {
    initServer()
    let { id } = req.query
    let splitId = id.split('_')
    let lat = splitId[1]
    let lng = splitId[2]

    if (cityCached(id)) {
        res.status(200).send(citiesCache[id])
        return
    }

    const url = 'https://api.troposphere.io/climate/' + lat + ',' + lng + '?token=' + config.apiKey
    await getDataFromAPI(id, url, res)
}

function cacheCity(id, json) {
    let splitId = id.split('_')
    let name = splitId[0]
    json.data.city = name
    citiesCache[id] = json
    saveCache()
}

function initServer() {
    if (initDone) {
        return
    }
    initDone = true

    log_file = fs.createWriteStream('/debug.log', { flags: 'w' })
    log_stdout = process.stdout

    citiesCache = JSON.parse(fs.readFileSync(config.cacheFile, 'utf8'))
    console.log('Loaded cache:\n' + citiesCache)
}

function saveCache() {
    cacheCount++
    if (cacheCount === config.cacheSaveInterval) {
        cacheCount = 0
        fs.writeFile(config.cacheFile, JSON.stringify(citiesCache), function (err) {
            if (err) {
                return console.log(err)
            }
            console.log('Saved cities cache to ' + config.cacheFile)
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

console.log = function (data) {
    const logTime = new Date().toISOString()
    log_file.write(logTime + ' - ' + util.format(data) + '\n');
    log_stdout.write(logTime + ' - ' - util.format(data) + '\n');
}