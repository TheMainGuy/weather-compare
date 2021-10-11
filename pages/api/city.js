const https = require('https')
const csv = require("csvtojson")
import * as config from 'config.js'

let database = {}

export default async function handler(req, res) {

    let { id } = req.query
    let splitId = id.split('_')
    let lat = splitId[1]
    let lng = splitId[2]

    if (cityCached(id)) {
        res.status(200).send(database[id])
        return
    }
    const url = 'https://api.troposphere.io/climate/' + lat + ',' + lng + '?token=' + config.apiKey
    await getDataFromAPI(id, url, res)
}

function cacheCity(id, json) {
    let splitId = id.split('_')
    let name = splitId[0]
    json.data.city = name
    database[id] = json
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