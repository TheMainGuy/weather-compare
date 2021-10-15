const fs = require('fs')
const config = require('../../config.js')

export default async function handler(req, res) {
    try {
        let = content = fs.readFileSync(config.logFile, 'utf8')
        res.status(200).end(content)
    } catch {
        res.status(500).end('There was a problem when trying to read the logfile.')
    }

}