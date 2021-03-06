const https = require('https')
const fs = require('fs')
const util = require('util')
import getConfig from 'next/config'

let { serverRuntimeConfig } = getConfig()
const config = serverRuntimeConfig.config

let citiesCache = serverRuntimeConfig.citiesCache
let cacheCount = 0
let log_file = fs.createWriteStream(config.logFile, { flags: 'a' })

export default async function handler(req, res) {
  let { id } = req.query
  log('Query for id: ' + id)
  if (cityCached(id)) {
    res.status(200).send(citiesCache[id])
    return
  }

  let splitId = id.split('_')
  let lat = splitId[1]
  let lng = splitId[2]

  const url =
    'https://api.troposphere.io/climate/' +
    lat +
    ',' +
    lng +
    '?token=' +
    config.apiKey
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
  json.data.name = name
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
  return new Promise((resolve) => {
    https
      .get(url, (response) => {
        let data = ''

        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('end', () => {
          let json = JSON.parse(data)
          cacheCity(id, json)
          res.status(200).json(citiesCache[id])
          Promise.resolve()
        })
      })
      .on('error', (err) => {
        res.status(400).json({
          error: err.message,
        })
        Promise.resolve()
      })
  })
}

function log(data) {
  let logTime = new Date().toISOString()
  logTime = logTime.replace('T', ' ').replace('Z', '')
  const logEntry = logTime + ' - ' + util.format(data)
  log_file.write(logEntry + '\n')
  console.log(logEntry)
}
