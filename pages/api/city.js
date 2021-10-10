const https = require('https')
import * as config from 'config.js'

export default async function handler(req, res) {
    const { lat, lng } = req.query
    if (!lat || !lng) {
        res.status(400).json({
            error: 'Bad lattitude or longitude',
        })
        return
    }
    const url = 'https://api.troposphere.io/climate/' + lat + ',' + lng + '?token=' + config.apiKey
    await getDataFromAPI(url, res)
}

async function getDataFromAPI(url, res) {
    return new Promise(resolve => {
        https.get(url, response => {
            let data = ''

            response.on('data', (chunk) => {
                data += chunk
            })

            response.on('end', () => {
                res.status(200).json(JSON.parse(data))
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