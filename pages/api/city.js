const https = require('https')
import * as config from 'config.js'

export default async function handler(req, res) {
    const { lat, lng } = req.query
    if (!lat || !lng) {
        res.status(400).json({
            error: 'Bad lattitude or longitude',
        })
    }
    const url = 'https://api.troposphere.io/climate/' + lat + ',' + lng + '?token=' + config.apiKey
    https.get(url, (resp) => {
        let data = ''

        resp.on('data', (chunk) => {
            data += chunk;
        })

        resp.on('end', () => {
            res.status(200).json(JSON.parse(data))
        })

    }).on("error", (err) => {
        res.status(400).json({
            error: err.message,
        })
    })
}