const fs = require('fs')
import getConfig from 'next/config'

let { serverRuntimeConfig } = getConfig()
const config = serverRuntimeConfig.config

export default async function handler(req, res) {
    try {
        let content = fs.readFileSync(config.logFile, 'utf8')
        res.status(200).end(content)
    } catch {
        res.status(500).end('There was a problem when trying to read the logfile.')
    }

}