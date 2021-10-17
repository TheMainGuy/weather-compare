import getConfig from 'next/config'

let { serverRuntimeConfig } = getConfig()

let cities = serverRuntimeConfig.cityNames
export default async function handler(req, res) {

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
        if (entry.name.toString().toLowerCase().startsWith(name.toString().toLowerCase())) {
            let match = {}
            match.name = entry.name
            match.country = entry.country
            match.population = entry.population
            match.id = entry.name + '_' + entry.lat + '_' + entry.lng
            if (isDuplicate(entry, json.data.matches) === false) {
                json.data.matches.push(match)
            }
        }
    }
    res.status(200).json(json)
}

function isDuplicate(entry, matches) {
    for (const match of matches) {
        if (match.name === entry.name) {
            if (match.country === entry.country) {
                let matchIDcomponents = match.id.split('_')
                let matchLat = Number(matchIDcomponents[1])
                let matchLng = Number(matchIDcomponents[2])

                let lat = Number(entry.lat)
                let lng = Number(entry.lng)

                let distance = Math.abs(matchLat - lat) + Math.abs(matchLng - lng)
                if (distance < 1) {
                    return true
                }
            }
        }
    }
    return false
}