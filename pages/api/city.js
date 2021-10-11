const https = require('https')
const csv = require("csvtojson")
import * as config from 'config.js'

let database = {}
let cities = {}
let init = false

export default async function handler(req, res) {

    if (!init) {
        init = true
        cities = await csv().fromFile('worldcities.csv')
    }

    let { id } = req.query
    let latlng = id.split('_')

    if (cityCached(id)) {
        res.status(200).send(database[id])
        return
    }
    const url = 'https://api.troposphere.io/climate/' + latlng[0] + ',' + latlng[1] + '?token=' + config.apiKey
    await getDataFromAPI(id, url, res)
}

function cacheCity(id, json) {
    const latlng = id.split('_')
    const lat = latlng[0]
    const lng = latlng[1]

    try {
        for (var index in cities) {
            let entry = cities[index]
            if (entry.lat === lat && entry.lng === lng) {
                json.data.city = entry.city
                database[id] = json
                throw 'break'
            }
        }
    } catch { }
}

function cityCached(id) {
    if (id in database) {
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
                res.status(200).json(database[id])
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