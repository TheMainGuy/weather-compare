const csv = require("csvtojson")

let cities = {}
let init = false

export default async function handler(req, res) {
    if (!init) {
        init = true
        try {
            cities = await csv().fromFile('worldcities.csv')
        } catch (error) {
            log(error)
            res.status(500).end(error)
            return
        }

    }
    let name = req.query.name
    if (name.length <= 2) {
        res.status(400).end('')
        return
    }
    let json = {
        data: {
            matches: []
        }
    }
    for (var index in cities) {
        let entry = cities[index]
        if (entry.city.toLowerCase().startsWith(name.toLowerCase())) {
            let match = {}
            match.city = entry.city
            match.country = entry.country
            match.id = entry.city + '_' + entry.lat + '_' + entry.lng
            json.data.matches.push(match)
        }
    }
    res.status(200).json(json)
}

function log(data) {
    let logTime = new Date().toISOString()
    logTime = logTime.replace('T', ' ').replace('Z', '')
    const logEntry = logTime + ' - ' + util.format(data)
    log_file.write(logEntry + '\n')
    console.log(logEntry)
}