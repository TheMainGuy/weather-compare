const https = require('https')
const fs = require('fs');
import * as config from 'config.js'

let citiesCache = {}
let cacheCount = 0
let cacheLoaded = false

export default async function handler(req, res) {
    loadCache()
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

function loadCache() {
    if (cacheLoaded) {
        return
    }
    cacheLoaded = true
    citiesCache = JSON.parse(fs.readFileSync(config.cacheFile, 'utf8'))
    console.log('Loaded cache:')
    console.log(citiesCache)
}

function saveCache() {
    cacheCount++
    if (cacheCount === config.cacheSaveInterval) {
        cacheCount = 0
        fs.writeFile(config.cacheFile, JSON.stringify(citiesCache), function (err) {
            if (err) return console.log(err)
            console.log('Saved cache')
        })
    }
}

function cityCached(id) {
    if (id in citiesCache) {
        return true
    }
    return false
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