const fs = require('fs')
const config = require('../../config.js')

export default async function handler(req, res) {
    res.status(200).end(fs.readFileSync(config.logFile, 'utf8'))
}